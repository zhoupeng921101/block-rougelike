/**
 * 第二个里程碑的场景：带小丑打过 Ante 1。
 *
 * 切片边界见 15 号票。这一层只负责画出来与收输入——**逻辑全在 `src/core/`**，
 * 场景里没有一处计算分数或消费 RNG。出牌时 `round.play()` 同步算完，
 * 场景按它吐出的 `steps` 轨迹重放动画，所以改动画不可能改分数。
 *
 * 前身是 `RoundScene`（只有一局小盲注）。改名是因为它现在持有的是 `Run`：
 * 盲注序、商店、钱都在它手里。
 */

import { GameObjects, Scene } from 'phaser';

import { BLIND_CENTERS } from '../../core/blinds';
import type { Card } from '../../core/card';
import { makeStandardDeck, resetCardCounters } from '../../core/card';
import { EventManager, GameEvent } from '../../core/event-queue';
import { BOOSTER_CENTERS } from '../../core/boosters';
import { isBoosterImplemented } from '../../core/booster-open';
import { isConsumableImplemented } from '../../core/consumables';
import { isJokerImplemented } from '../../core/jokers';
import type { Consumable } from '../../core/consumables';
import type { Joker } from '../../core/jokers';
import { evaluatePokerHand } from '../../core/poker-hands';
import type { Round } from '../../core/round';
import { Run } from '../../core/run';
import { TAG_CENTERS, isTagImplemented } from '../../core/tags';
import { VOUCHER_CENTERS } from '../../core/vouchers';
import { CardSprite } from '../card-sprite';
import { BoosterSprite } from '../booster-sprite';
import { ConsumableSprite } from '../consumable-sprite';
import { CANVAS_H, CANVAS_W, CARD_H, CARD_W, TILE_H, TILE_W, roomMapping, toPx } from '../coords';
import { UIBoxView, UI_FONT_FAMILY } from '../ui-draw';
import { makeRoomJuice, stepRoomJuice } from '../room-juice';
import { Particles } from '../particles';
import type { OpenPack } from '../../core/booster-open';
import type { BoosterKind } from '../../core/boosters';
import { type BackgroundColours, applyBlindColours, backgroundFor, packMainColour } from '../../ui/blind-colour';
import { C, type Colour, HEX, lighten, mixColours, setColour, tickColours } from '../../ui/colours';
import { buyAndUseButton, shopBuyButton, useAndSellButtons } from '../../ui/definitions/card-buttons';
import { type PopupCard, abilityTable, cardHPopup, infoBoxes, tagAbilityTable } from '../../ui/definitions/card-popup';
import { popupGame, popupOfCard, popupOfCenter, popupOfConsumable, popupOfJoker } from '../popup-adapter';
import { type HudState, createHud, makeHudState } from '../../ui/definitions/hud';
import { type AreaCount, cardAreaBox } from '../../ui/definitions/card-area';
import { createButtons } from '../../ui/definitions/buttons';
import { type HudBlindState, createHudBlind, makeHudBlindState } from '../../ui/definitions/hud-blind';
import { hudBlindFuncs } from '../../ui/definitions/hud-blind-funcs';
import { type BlindSelectState, type BlindType, blindChoiceBox, blindChoiceFuncs, cardAlert, currentBlinds, createBlindPrompt, createBlindSelect, hudTag } from '../../ui/definitions/blind-select';
import { mostPlayedHand } from '../../core/round';
import { runModifiers } from '../../core/jokers/modifiers';
import { type EvalRow, type EvalStep, RoundEval, evalTimeline } from '../../ui/definitions/round-eval';
import { BLIND_TEXT, DICTIONARY } from '../../ui/lang.generated';
import type { Rect, UIElement, UIFuncs, UINodeDef } from '../../ui/uibox';
import { cardAreas } from '../areas';
import { type Placed, alignConsumeable, alignHand, alignJokers, alignPackHand, alignPlay } from '../align-cards';
import { type PackCardsObject, createBoosterPack, packCardsArea } from '../../ui/definitions/booster-pack';
import { type CardAreaObject, createShop, createShopSign, priceTag, shopAreas } from '../../ui/definitions/shop';
import { DeckSprite } from '../deck-sprite';
import { numberFormat } from '../../ui/format';
import { UIBox, UIT } from '../../ui/uibox';
import { RED_DECK, WIN_ANTE } from '../../core/run';
import { JokerSprite } from '../joker-sprite';
import { LOOK } from '../look';
import { VoucherSprite } from '../voucher-sprite';
import { BACKGROUND_FRAG, BACKGROUND_VERT } from '../shaders/background';
import { CRT_FRAG, CRT_VERT, crtUniforms } from '../shaders/crt';
import { type GameOverState, createGameOver, createWin } from '../../ui/definitions/game-over';
import { mostPlayedHandUsage } from '../../core/round-scores';
import { Motion } from '../moveable';
import { Jimbo } from '../jimbo';
import { type Tab, type VoucherArea, changeTab, currentHands, runInfo, usedVouchers } from '../../ui/definitions/run-info';

/**
 * 版本的文字标记。
 *
 * **版本的 shader 没有移植**（原作每种版本一个 `.fs`，与 `dissolve` 并列），
 * 所以这一版只用文字标出来——不标的话玩家分不出一张 Polychrome 的小丑
 * 和普通小丑，而两者差 ×1.5。
 */
/**
 * `random_string(8)`（`misc_functions.lua:273`）：三成是 1–9，其余 A–N 与 P–Z 各半（没有 O 与 0）。
 * 原作不指定种子的开局用它；随机源是无种子的 `math.random`
 */
function randomSeed(): string {
    const range = (a: string, b: string) => String.fromCharCode(a.charCodeAt(0) + Math.floor(Math.random() * (b.charCodeAt(0) - a.charCodeAt(0) + 1)));
    let out = '';
    for (let i = 0; i < 8; i++) out += Math.random() > 0.7 ? range('1', '9') : Math.random() > 0.45 ? range('A', 'N') : range('P', 'Z');
    return out;
}

function editionTag(edition?: string): string {
    if (!edition) return '';
    const label: Record<string, string> = {
        foil: ' ✦箔', holo: ' ✦全息', polychrome: ' ✦多彩', negative: ' ✦负片',
    };
    return label[edition] ?? '';
}

/**
 * 蜡封的文字标记。**蜡封的贴图也没有移植**（原作是 `G.shared_seals`
 * 那四张小图叠在卡面上），同理只用文字标出来——
 * 一张 Red 蜡封的牌会多算一遍分，不标就看不出来。
 */
function sealTag(seal?: string): string {
    const label: Record<string, string> = {
        Red: ' ▣红', Blue: ' ▣蓝', Gold: ' ▣金', Purple: ' ▣紫',
    };
    return seal ? (label[seal] ?? '') : '';
}

/** 能被点选、挂按钮的卡（商店、小丑区、消耗品区、开包里的） */
type Pickable = {
    highlighted: boolean;
    readonly rect: { x: number; y: number; w: number; h: number };
    readonly prevX: number;
    place(p: Placed, index: number): void;
};

/** 选中的那张在哪（`index` 是它在对应列表里的下标：商店格 / 优惠券格 / 补充包格 / 包里第几张） */
type PickWhere =
    | { kind: 'shop' | 'voucher' | 'booster' | 'pack'; index: number }
    | { kind: 'joker'; joker: Joker }
    | { kind: 'consumable'; consumable: Consumable };

type ShopSlot = {
    group: 'items' | 'vouchers' | 'packs';
    index: number;
    sprite: Pickable;
    area: Rect;
    w: number;
    h: number;
    tagMajor: { T: Rect };
    tagView: UIBoxView;
    warn?: GameObjects.Text;
};

/** 逐张计分之间的间隔，秒。原作在 state_events.lua:622 是 delay(0.2) 起步 */
const SCORE_STEP_DELAY = 0.22;

export class RunScene extends Scene {
    private run!: Run;
    private sprites: CardSprite[] = [];
    private jokerSprites: JokerSprite[] = [];
    private shopSprites: JokerSprite[] = [];
    private consumableSprites: ConsumableSprite[] = [];
    /** 商店那两个补充包格子 */
    private packSprites: BoosterSprite[] = [];
    /** 开着的包里那几张 */
    private packCardSprites: Array<JokerSprite | ConsumableSprite | CardSprite> = [];
    /** 开包界面（外框、标题、Skip）与 `G.pack_cards` 在房间里的位置 */
    private packUi: { view: UIBoxView; area: PackCardsObject; rect: Rect } | null = null;
    /** 标准包里扑克牌的版本 / 蜡封文字标记（贴图没移植） */
    private packLabels: GameObjects.Text[] = [];
    /** 开包的粒子（`booster_pack_sparkles` / `_stars` / `_meteors`）：跟着包走，挑牌重建界面时不重开 */
    private packFx: { pack: OpenPack; systems: Particles[] } | null = null;
    /** 奥秘 / 幽灵包发下来的那手牌（`run.packHand`）。点选进 `selected`，就是包里塔罗的目标 */
    private packHandSprites: CardSprite[] = [];
    /** 商店里那些消耗品格。与 `shopSprites` 分开存，两者的类型不一样 */
    private shopConsumableSprites: ConsumableSprite[] = [];
    /** 商店格子下面那行价格／「未实现」标记 */
    private shopLabels: GameObjects.Text[] = [];
    /** 优惠券格（主优惠券 + Voucher Tag 给的） */
    private voucherSprites: VoucherSprite[] = [];
    /** Magic Trick 之后商店里卖的扑克牌 */
    private shopCardSprites: CardSprite[] = [];
    private selected = new Set<Card>();

    /** 事件队列。动画的节奏全靠它，语义直译自 engine/event.lua（09 号票）。
     *  刻意不叫 `events`——那是 Phaser Scene 自己的字段。 */
    private readonly queue = new EventManager();
    /** 左侧面板（`create_UIBox_HUD`，22 号票）。`hudState` 是它绑定的 `G.GAME` 同形对象 */
    private hudState!: HudState;
    private hudView!: UIBoxView;
    /** 左上盲注面板（`G.HUD_blind`，挂在左侧面板的 `row_blind` 上） */
    private hudBlindState!: HudBlindState;
    private hudBlindView!: UIBoxView;
    /** 四个 CardArea 身后的底框与计数（`cardarea.lua:288`） */
    /** 手牌下面的出牌 / 排序 / 弃牌（`G.buttons`）。只在选牌时存在，出牌或弃牌之后重建（`one_press` 复位） */
    private buttonsView: UIBoxView | null = null;
    /**
     * 选盲注界面（`G.blind_select` 与左侧的 `G.blind_prompt_box`）。进选盲注时建、开打时拆；
     * 跳过或重掷 Boss 之后整个重建（原作也是重建）
     */
    private blindSelectViews: { select: UIBoxView; prompt: UIBoxView } | null = null;
    /** 回合结算（`G.round_eval` 与 Cash Out）。`blindHeld`：左上盲注面板在 `defeat` 之前还留着 */
    /**
     * `G.OVERLAY_MENU`：游戏结束 / 胜利界面。`motion` 是 UIBox 自己的 VT（`bond = 'Weak'`，从下方 10 tile 弹上来），
     * `bg` 是背景那张颜色表，alpha 由 `ease_value` 0.3 秒线性缓上去；`blocker` 吞掉底下所有点击与悬停
     */
    /** `G.HUD_tags`：手上的标签，右下角往上叠。`run.tags` 变了就整列重建 */
    private hudTags: { list: readonly object[]; views: UIBoxView[] } = { list: [], views: [] };
    private readonly hudTagTargets = new Set<object>();

    /** 这一局输了（`G.STATE = GAME_OVER`）。`Run` 停在那一关不再推进 */
    private runOver = false;
    private overlay: {
        view: UIBoxView;
        motion: Motion;
        bg: Colour;
        alpha: { from: number; to: number; start: number };
        blocker: GameObjects.Zone;
        jimbo: Jimbo | null;
        /** Run Info 的 Vouchers 页：每格里的卡 */
        vouchers: Array<{ sprite: VoucherSprite; area: VoucherArea }>;
    } | null = null;
    private roundEval: {
        ev: RoundEval;
        view: UIBoxView;
        cashView: UIBoxView | null;
        blindHeld: boolean;
        /** 刚打完那一关的样子：左侧面板在 Cash Out 之前还显示它（分数、剩余手数 / 弃牌、盲注配色） */
        last: { blindKey: string; chips: number; handsLeft: number; discardsLeft: number };
    } | null = null;
    /** 已经算进 `run.dollars`、但还没按 Cash Out 的那笔（左侧 $ 要扣掉它显示） */
    private pendingPayout = 0;
    private deckSprite!: DeckSprite;
    /** 已经打到出牌区的牌（`G.play`），逐帧按 `alignPlay` 摆；其余手牌按 `alignHand` */
    private readonly inPlay = new Set<CardSprite>();
    private readonly areas = cardAreas();
    private areaViews: Array<{ view: UIBoxView; count: AreaCount; key: 'jokers' | 'consumeables' | 'hand' | 'deck' }> = [];
    /** 背景与 CRT：铺满可视区，窗口变了跟着相机重摆（`applyRoomCamera`） */
    private readonly fullscreenQuads: GameObjects.Shader[] = [];
    /** 正在播放出牌动画时不接受输入 */
    private animating = false;
    /** 计分过程中的实时累加器，只用于显示 */
    private liveChips = 0;
    private liveMult = 0;

    private hud!: GameObjects.Text;
    private handPreview!: GameObjects.Text;
    private message!: GameObjects.Text;
    private jokerInfo!: GameObjects.Text;
    private nextBtn!: GameObjects.Text;
    private rerollBtn!: GameObjects.Text;
    /** 盲注选择界面上的「跳过盲注」（调试按钮；卡片上的 Skip Blind 接管之后只在标签开包时露出来） */
    private skipBlindBtn!: GameObjects.Text;

    constructor() {
        super('Run');
    }

    private get round(): Round | null {
        return this.run.round;
    }

    preload(): void {
        this.load.font(UI_FONT_FAMILY, '/assets/fonts/m6x11plus.ttf');
        // `game.lua:996`：赌注筹码，29×29 一格
        this.load.spritesheet('chips', '/assets/textures/chips.png', { frameWidth: 29, frameHeight: 29 });
        // `game.lua:989`：`ui_1`，18×18 一格（结束界面「Best Hand」前的小筹码是 {0,0}）
        this.load.spritesheet('ui_1', '/assets/textures/ui_assets.png', { frameWidth: 18, frameHeight: 18 });
        // `game.lua:994`：标签，34×34 一格
        this.load.spritesheet('tags', '/assets/textures/tags.png', { frameWidth: 34, frameHeight: 34 });
        // `game.lua:979`：SHOP 招牌，113×57 一格，4 帧
        this.load.spritesheet('shop_sign', '/assets/textures/ShopSignAnimation.png', { frameWidth: 113, frameHeight: 57 });
        // `game.lua:978`：盲注筹码，34×34 一格，每行 21 帧动画
        this.load.spritesheet('blind_chips', '/assets/textures/BlindChips.png', { frameWidth: 34, frameHeight: 34 });
        this.load.spritesheet('cards', '/assets/textures/8BitDeck.png', {
            frameWidth: 71,
            frameHeight: 95,
        });
        // 底板层。原作每张牌是底板 + 正面两层，8BitDeck 里的牌面是透明背景的
        this.load.spritesheet('centers', '/assets/textures/Enhancers.png', {
            frameWidth: 71,
            frameHeight: 95,
        });
        // 小丑是单层，`Jokers.png` 里那一格就是完整卡面
        this.load.spritesheet('jokers', '/assets/textures/Jokers.png', {
            frameWidth: 71,
            frameHeight: 95,
        });
        // 消耗品同样是单层。**一张图集装三个 set**（塔罗 / 星球 / 幽灵）
        this.load.spritesheet('tarots', '/assets/textures/Tarots.png', {
            frameWidth: 71,
            frameHeight: 95,
        });
        // 补充包。原作把它画得比卡大一圈（×1.27），但图集格子是同一个尺寸
        this.load.spritesheet('boosters', '/assets/textures/boosters.png', {
            frameWidth: 71,
            frameHeight: 95,
        });
        // 优惠券（19 号票）。单层
        this.load.spritesheet('vouchers', '/assets/textures/Vouchers.png', {
            frameWidth: 71,
            frameHeight: 95,
        });

        // 音效。对应关系从原作查出：
        // cardSlide2 选/取消选牌（card.lua:4625）、chips2 计分（state_events.lua:1062）、
        // coin1 买卖（card.lua:1610）、coin2+other1 重掷（button_callbacks.lua:2991）
        for (const key of [
            'cardSlide1', 'cardSlide2', 'chips1', 'chips2', 'card1', 'button', 'generic1',
            'coin1', 'coin2', 'coin3', 'coin6', 'other1', 'tarot1', 'cancel', 'multhit1', 'highlight1',
            'negative', 'whoosh2', 'win', 'whoosh1', 'paper1', 'tarot2',
            ...Array.from({ length: 11 }, (_, i) => `voice${i + 1}`),
            ...Array.from({ length: 5 }, (_, i) => `crumple${i + 1}`),
        ]) {
            this.load.audio(key, `/assets/sounds/${key}.ogg`);
        }
    }

    create(): void {
        const seed = new URLSearchParams(location.search).get('seed') ?? 'ALEEB';

        resetCardCounters();
        this.run = new Run(seed, makeStandardDeck());

        this.setupBackground();

        // `game.lua:2613`：`G.HUD = UIBox{definition = create_UIBox_HUD(), config = {align='cli', offset={x=-0.7,y=0}, major=G.ROOM_ATTACH}}`
        this.hudState = makeHudState();
        const hudBox = new UIBox(createHud(this.hudState), {
            align: 'cli',
            offset: { x: -0.7, y: 0 },
            major: { T: { x: 0, y: 0, w: TILE_W, h: TILE_H } },
        });
        // 左侧面板上的按钮：Run Info 打开 overlay；Options 还没做
        this.hudView = new UIBoxView(this, hudBox, 40, (name) => { if (name === 'run_info') this.openRunInfo(); });

        // `game.lua:2617`：`G.HUD_blind = UIBox{definition = create_UIBox_HUD_blind(), config = {major = row_blind, align = 'cm'}}`
        const row = hudBox.getById('row_blind')!;
        this.hudBlindState = makeHudBlindState();
        this.hudBlindView = new UIBoxView(this, new UIBox(
            createHudBlind(this.hudBlindState),
            { align: 'cm', offset: { x: 0, y: 0 }, major: { T: { x: row.x, y: row.y, w: row.T.w, h: row.T.h } } },
            hudBlindFuncs(this.hudBlindState),
        ), 41);
        this.deckSprite = new DeckSprite(this);

        const areas = this.areas;
        const areaAlign = { jokers: 'cl', consumeables: 'cr', hand: 'cm', deck: 'cr' } as const;
        for (const key of ['jokers', 'consumeables', 'hand', 'deck'] as const) {
            const count: AreaCount = { card_count: 0, card_limit: 0 };
            const box = new UIBox(cardAreaBox(areas[key], count, areaAlign[key]), {
                align: 'cm',
                offset: { x: 0, y: 0 },
                major: { T: areas[key] },
            });
            this.areaViews.push({ view: new UIBoxView(this, box, -5), count, key });
        }

        // 下面这些调试文字与按钮是 UI 直译之前的占位，挪到左侧面板右边；等对应的原作 UI 直译过来再删
        this.hud = this.add.text(toPx(5.0), toPx(3.1), '', {
            fontFamily: 'monospace', fontSize: 22, color: '#e8e8e8', lineSpacing: 6,
        });
        // 牌型预览已经在左侧面板里了（`hand_text_area`），这行调试字不再显示
        this.handPreview = this.add.text(toPx(5.0), toPx(3.1), '', {
            fontFamily: 'monospace', fontSize: 26, color: '#ffd76e',
        }).setVisible(false);
        // 数值与说明在悬停提示框里；这里只标出没实现行为的小丑（不标就是把缺口伪装成正常行为）
        this.jokerInfo = this.add.text(toPx(this.areas.jokers.x), toPx(this.areas.jokers.y + this.areas.jokers.h + 0.3), '', {
            fontFamily: 'monospace', fontSize: 14, color: '#9fd6ff',
        }).setDepth(45);
        this.message = this.add.text(CANVAS_W / 2, CANVAS_H / 2, '', {
            fontFamily: 'monospace', fontSize: 44, color: '#ffffff', align: 'center',
        }).setOrigin(0.5).setDepth(100);

        this.nextBtn = this.makeButton(toPx(9.8), toPx(10.2), '下一关', '#3c6ea5', () => this.doNext());
        this.rerollBtn = this.makeButton(toPx(12.2), toPx(10.2), '重掷', '#8a5fb0', () => this.doReroll());
        this.skipBlindBtn = this.makeButton(toPx(17.0), toPx(10.2), '跳过盲注', '#a07a2c', () => this.doSkipBlind());

        // 开局先进盲注选择（原作如此）：能看到这一格跳过给什么标签，再决定打还是跳
        this.showBlindSelect();
        this.setupCrt();
        this.applyRoomCamera();
        this.scale.on('resize', () => this.applyRoomCamera());
    }

    // ————————————————————————————————————————————————————————————————
    // 流程
    // ————————————————————————————————————————————————————————————————

    private startRound(): void {
        try {
            this.run.startRound();
        } catch (e) {
            // `assertImplemented` 会在拿到没实现行为的 Boss 时抛。28 个 Boss 现在全实现了，
            // 但这道闸还在（挑战模式带自己的 Boss），所以场景要能优雅落地而不是白屏
            this.message.setText(`走不下去了：
${String(e instanceof Error ? e.message : e)}`)
                .setColor('#e5585f');
            this.refresh();
            return;
        }
        this.destroyBlindSelect();
        this.selected.clear();
        this.rebuildHand();
        this.rebuildJokers();
        this.rebuildConsumables();
        this.clearShop();
        this.refresh();
    }

    /**
     * 盲注选择界面（`run.state === 'blind-select'`）。
     *
     * 手牌区空着；标签开的包（Charm / Meteor …）在这一屏上挑，挑完或跳过才能开打。
     */
    private showBlindSelect(rebuild = true): void {
        if (rebuild) this.buildBlindSelect();
        else this.updateBlindSelectState();
        this.selected.clear();
        this.clearShop();
        this.rebuildHand();
        this.rebuildJokers();
        this.rebuildConsumables();
        this.rebuildPackCards();
        this.refresh();
    }

    /**
     * `skip_blind`（`button_callbacks.lua:2850`）之后：界面不重建，只把 `blind_states` 改掉——
     * 跳过的那格保留原来的配色、`blind_choice_handler` 把它盖灰、收起标签行、盖上「SKIPPED」，下一格亮起
     */
    private updateBlindSelectState(): void {
        const b = this.blindSelectState;
        if (!b || !this.blindSelectViews) {
            this.buildBlindSelect();
            return;
        }
        const run = this.run;
        for (const [type, kind] of [['Small', 'small'], ['Big', 'big'], ['Boss', 'boss']] as const) {
            const next = run.blindState(kind);
            if (next === 'Skipped' && b.state.states[type] !== 'Skipped') this.addSkippedAlert(type);
            b.state.states[type] = next;
            b.loc[type] = next;
        }
    }

    /** 「跳过盲注」：拿走这一格的标签，直接到下一格（不打、不进商店） */
    private doSkipBlind(): void {
        if (this.animating || !this.run.canSkipBlind) return;
        this.run.skipBlind();
        this.sound.play('generic1', { volume: 0.5 });
        // 拿到的标签出现在右下角那一列（`add_tag`），立即生效的（Economy 之类）当场兑现
        this.showBlindSelect(false);
    }

    /** Director's Cut：花 $10 重掷这个 Ante 的 Boss（每个 Ante 一次） */
    private doRerollBoss(): void {
        if (this.animating || !this.run.canRerollBoss) {
            this.sound.play('cancel', { volume: 0.4 });
            return;
        }
        this.run.rerollBoss();
        this.sound.play('other1', { volume: 0.5 });
        // `reroll_boss`：只换 Boss 那张卡（`G.blind_select_opts.boss` 重建、塞回原来的 O 节点），别的卡不动。
        // 原作旧卡滑出、0.3 秒后新卡从下面滑上来——界面的滑入动画还没做，这里直接换
        const b = this.blindSelectState;
        const old = b?.opts.Boss;
        const el = old && [...b.select.root.walk()].find((e) => e.config.object === old);
        if (b && el) {
            b.state.choices.Boss = this.run.bossKey;
            const box = blindChoiceBox('Boss', b.state, b.loc, b.funcs);
            b.opts.Boss = box;
            b.select.replaceObject(el, box);
            // 重掷之后会再轮一次 `new_blind_choice`，标签可能开出一个包
            this.showBlindSelect(false);
        } else this.showBlindSelect();
    }

    /**
     * 「下一关」按钮：
     * - 商店里：离开商店，回到盲注选择
     * - 盲注选择：开打这一格（有标签开的包没挑完就先不让）
     * - 过关画面：结算、进商店
     */
    private doNext(): void {
        if (this.animating) return;

        if (this.run.state === 'shop') {
            if (this.run.openPack) return;
            this.sound.play('cardSlide2', { volume: 0.4 });
            this.run.leaveShop();
            this.showBlindSelect();
            return;
        }

        if (this.run.state === 'blind-select') {
            if (this.run.openPack) return;
            this.sound.play('cardSlide2', { volume: 0.4 });
            this.message.setText('');
            this.startRound();
            return;
        }

        // 已经结算过就别再结算一次——`finishRound` 会重跑收益与 end_of_round，
        // 那会让 Egg 涨两次卖价、Popcorn 掉两格
        if (this.run.state === 'game-over') return;

        const round = this.round;
        if (!round || round.phase === 'selecting') return;

        if (round.phase === 'lost') {
            this.gameOver();
            return;
        }

        this.startRoundEval();
    }

    /**
     * 过关：`end_round` → `evaluate_round`（`state_events.lua:1156`）。收益在 core 里一次算完（`finishRound`），
     * 表现层按原作的事件队列把结算面板一行行加出来（`evalTimeline`），最后出「Cash Out」按钮；
     * **按了才入账、才进商店**（`G.FUNCS.cash_out`）。在那之前左侧 $ 显示的是入账前的余额
     */
    private startRoundEval(): void {
        const round = this.round;
        if (!round || round.phase !== 'won' || this.roundEval) return;
        const run = this.run;
        const blindKey = run.blindKey;
        const requirement = round.requirement;
        const jokersBefore = [...run.jokers];
        const last = { blindKey, chips: round.chips, handsLeft: round.handsLeft, discardsLeft: round.discardsLeft };
        const wasWon = run.won;
        const { payout } = run.finishRound();
        this.pendingPayout = payout.total;
        // 打过 Ante 8 的 Boss：`win_game`（`state_events.lua:1`）弹胜利窗口，结算在它底下照常走；
        // 按 Endless 关掉窗口就接着打
        if (!wasWon && run.won) {
            this.sound.play('win');
            this.showOverlay('win');
        }

        // 手牌收进弃牌堆（`draw_from_hand_to_discard`）。`finishRound` 已经把 `run.round` 置空
        for (const sprite of this.sprites) sprite.destroy();
        this.sprites = [];
        this.selected.clear();
        this.rebuildJokers(); // end_of_round 可能吃掉小丑（Popcorn / Gros Michel）

        let tagIndex = 0;
        const rows: EvalRow[] = payout.rows.map((r): EvalRow => {
            switch (r.kind) {
                case 'blind':
                    return { name: 'blind1', dollars: r.dollars, blindPos: BLIND_CENTERS[blindKey].pos, chipText: numberFormat(requirement), chips: requirement };
                case 'hands':
                    return { name: 'hands', dollars: r.dollars, disp: r.count ?? 0, per: 1 };
                case 'discards':
                    return { name: 'discards', dollars: r.dollars, disp: r.count ?? 0, per: r.count ? r.dollars / r.count : 0 };
                case 'joker':
                    return { name: `joker${jokersBefore.indexOf(r.joker!) + 1}`, dollars: r.dollars, jokerName: r.joker!.center.name };
                case 'tag':
                    tagIndex++;
                    // 会在结算时兑现的标签只有 Investment（`tag.lua` 的 `eval`），条件恒是「打过 Boss」
                    return { name: `tag${tagIndex}`, dollars: r.dollars, tagPos: TAG_CENTERS[r.tag!].pos, condition: DICTIONARY.ph_defeat_the_boss! };
                case 'interest':
                    return { name: 'interest', dollars: r.dollars, interestAmount: runModifiers(run.jokers).interestAmount, interestCap: run.vouchers.interestCap };
            }
        });

        const ev = new RoundEval({ T: this.areas.hand });
        const onButton = (name: string) => this.onUIButton(name);
        const view = new UIBoxView(this, ev.box, 30, onButton);
        view.setResolution(this.mapping.pxPerTile / toPx(1));
        this.roundEval = { ev, view, cashView: null, blindHeld: true, last };
        this.message.setText('');

        // 最后一手结算完到面板出现之间，原作有牌飞走、面板滑上来的一段，这里先空等
        let t = 0.4;
        const blindDollars = rows[0]?.dollars ?? 0;
        for (const { wait, step } of evalTimeline(rows, blindDollars)) {
            t += wait;
            this.time.delayedCall(t * 1000, () => this.applyEvalStep(step));
        }
        this.refresh();
    }

    private applyEvalStep(step: EvalStep): void {
        const state = this.roundEval;
        if (!state) return;
        state.ev.apply(step);
        switch (step.kind) {
            case 'row':
                this.sound.play('cancel', { volume: 0.5 });
                this.sound.play('highlight1', { volume: 0.2 });
                break;
            case 'dollar':
                this.sound.play('coin3', { volume: 0.7, rate: 0.9 + 0.2 * Math.random() });
                // 盲注那行每出一个 $，左上面板的奖励就少一个（`dollars_to_be_earned:sub(2)`）
                if (step.row.name === 'blind1') {
                    const cr = this.hudBlindState.current_round;
                    cr.dollars_to_be_earned = cr.dollars_to_be_earned.slice(1);
                }
                break;
            case 'defeat':
                // `Blind:defeat()`：左上盲注面板收起
                state.blindHeld = false;
                break;
            case 'cash_out': {
                this.sound.play('coin6', { volume: 0.6 });
                state.cashView = new UIBoxView(this, state.ev.cashOut!, 31, (name) => this.onUIButton(name));
                state.cashView.setResolution(this.mapping.pxPerTile / toPx(1));
                break;
            }
        }
    }

    /** `G.FUNCS.cash_out`：入账、拆掉结算面板、进商店 */
    private cashOut(): void {
        const state = this.roundEval;
        if (!state?.cashView) return;
        state.view.destroy();
        state.cashView.destroy();
        this.roundEval = null;
        this.pendingPayout = 0;
        this.sound.play('coin1', { volume: 0.5 });
        this.rebuildShop();
        this.refresh();
    }

    private doReroll(): void {
        if (this.animating || this.run.state !== 'shop' || !this.run.shop) return;
        if (!this.run.canAfford(this.run.shop.rerollCost)) {
            this.sound.play('cancel', { volume: 0.4 });
            return;
        }
        this.run.rerollShop();
        this.sound.play('coin2', { volume: 0.5 });
        this.sound.play('other1', { volume: 0.4 });
        this.rebuildShop();
        this.refresh();
    }

    // ————————————————————————————————————————————————————————————————
    // 小丑区与商店
    // ————————————————————————————————————————————————————————————————

    private rebuildJokers(): void {
        this.hidePopup();
        if (this.picked?.where.kind === 'joker') this.unpick();
        for (const s of this.jokerSprites) s.destroy();
        this.jokerSprites = this.run.jokers.map((j) => {
            const s: JokerSprite = new JokerSprite(this, j, (joker) => this.pick(s, { kind: 'joker', joker }));
            this.attachPopup([s.shader], s, () => popupOfJoker(j, 'jokers'));
            return s;
        });
        this.layoutJokers();
    }

    /** 小丑区与消耗品区：`align_cards` 的 joker 分支（两个区的 `type` 都是 `'joker'`），每帧摆 */
    private layoutJokers(real = this.time.now / 1000): void {
        const U = toPx(1);
        const place = (sprites: Array<JokerSprite | ConsumableSprite>, area: Rect, isConsumeables: boolean) => {
            alignJokers(area, sprites.map((s) => ({ highlighted: s.highlighted, prevX: s.prevX, w: s.w / U, h: s.h / U })), isConsumeables, real)
                .forEach((p, i) => sprites[i]!.place(p, i));
        };
        place(this.jokerSprites, this.areas.jokers, false);
        place(this.consumableSprites, this.areas.consumeables, true);
    }

    /** 选中小丑后按 SELL（`sell_card`）。能不能卖由按钮的 `can_sell_card` 管：出牌结算中不行 */
    private onJokerClick(joker: Joker): void {
        if (this.animating) return;
        const index = this.run.jokers.indexOf(joker);
        if (index < 0) return;
        this.run.sellJoker(index);
        this.sound.play('coin3', { volume: 0.5 });
        this.rebuildJokers();
        this.refresh();
    }

    /**
     * 消耗品区。点一下 = **用掉它**；商店里按住卖不做（本票不开拖拽），
     * 卖消耗品走「在商店里点」这条路，与卖小丑一致。
     */
    private rebuildConsumables(): void {
        this.hidePopup();
        if (this.picked?.where.kind === 'consumable') this.unpick();
        for (const s of this.consumableSprites) s.destroy();
        this.consumableSprites = this.run.consumables.map((c) => {
            const s: ConsumableSprite = new ConsumableSprite(this, c, (con) => this.pick(s, { kind: 'consumable', consumable: con }));
            this.attachPopup([s.shader], s, () => popupOfConsumable(c, 'consumeables'));
            return s;
        });
        this.layoutJokers();
    }

    private onConsumableClick(consumable: Consumable): void {
        if (this.animating) return;
        const index = this.run.consumables.indexOf(consumable);
        if (index < 0) return;

        // **选中的手牌就是塔罗的目标**（原作的 `G.hand.highlighted`）。
        // 按 `T.x` 排序交给逻辑层——`Death` 认的是「最右边那张」
        const highlighted = this.selectedInOrder();

        // **用不了的点不动。** 逻辑层会抛，但等抛出来已经晚了——
        // 玩家看到的是「点了一下什么也没发生」，那正是要避免的那种伪装。
        // 两种用不了：还没实现（The Wheel of Fortune），或这个局面不允许
        // （选的张数不对 / 消耗品区没空位 / 小丑区满了）
        if (!this.run.canUseConsumable(index, highlighted)) {
            this.sound.play('cancel', { volume: 0.4 });
            this.message.setText(this.whyCannotUse(consumable)).setColor('#e5885f');
            this.time.delayedCall(1400, () => this.message.setText(''));
            return;
        }

        this.run.useConsumable(index, highlighted);
        this.sound.play('tarot1', { volume: 0.6 });
        this.selected.clear();
        // 塔罗会换点数 / 换花色 / 换强化 / 销毁手牌，**整个手牌区要重建**（开包时的手牌也是）
        this.rebuildHand();
        if (this.run.openPack) this.rebuildPackCards();
        this.rebuildJokers();
        this.rebuildConsumables();
        this.refresh();
    }

    /** 点不动的时候给一句人话。没实现与「局面不允许」要分开说 */
    private whyCannotUse(consumable: Consumable): string {
        if (!isConsumableImplemented(consumable.key)) {
            return `${consumable.center.name} 还没有实现行为`;
        }
        const max = consumable.center.config.max_highlighted as number | undefined;
        if (max !== undefined) {
            const min = (consumable.center.config.min_highlighted as number | undefined) ?? 1;
            return min === max
                ? `${consumable.center.name} 要正好选 ${min} 张手牌`
                : `${consumable.center.name} 要选 ${min}–${Math.min(5, max)} 张手牌`;
        }
        return `${consumable.center.name} 现在用不了`;
    }

    private clearShop(): void {
        if (this.shopUi) {
            this.shopUi.view.destroy();
            this.shopUi.sign.destroy();
            for (const t of this.shopUi.tags) t.destroy();
            this.shopUi = null;
        }
        for (const s of this.shopSprites) s.destroy();
        this.shopSprites = [];
        for (const s of this.packSprites) s.destroy();
        this.packSprites = [];
        this.clearPackCards();
        for (const s of this.shopConsumableSprites) s.destroy();
        this.shopConsumableSprites = [];
        for (const t of this.shopLabels) t.destroy();
        this.shopLabels = [];
        for (const s of this.voucherSprites) s.destroy();
        this.voucherSprites = [];
        for (const s of this.shopCardSprites) s.destroy();
        this.shopCardSprites = [];
        this.shopSlots = [];
        this.hidePopup();
        if (this.picked?.where.kind === 'shop' || this.picked?.where.kind === 'voucher' || this.picked?.where.kind === 'booster') this.unpick();
    }

    private clearPackCards(): void {
        this.hidePopup();
        if (this.picked?.where.kind === 'pack') this.unpick();
        for (const s of this.packCardSprites) s.destroy();
        this.packCardSprites = [];
        for (const t of this.packLabels) t.destroy();
        this.packLabels = [];
        for (const s of this.packHandSprites) s.destroy();
        this.packHandSprites = [];
        if (this.packUi) {
            this.packUi.view.destroy();
            this.packUi = null;
        }
    }

    /**
     * 开包界面（`create_UIBox_*_pack`）：外框挂在手牌区上（`tmi`，offset 落定 −2.2），
     * 包里的牌放进 `G.pack_cards`，每帧按 `align_cards` 的 consumeable 分支摆（`layoutPackCards`）。
     *
     * **挑不走的也画出来**（小丑区满了之类），点一下给一句反馈——
     * 与「点不动的塔罗」同一条：不画出来等于把限制伪装成「这张不存在」。
     */
    private rebuildPackCards(): void {
        // 发下来的手牌接着上一版精灵的缓动走（挑牌 / 用塔罗之后整个重建）
        const oldPackHand = this.packHandSprites;
        this.packHandSprites = [];
        this.clearPackCards();
        const pack = this.run.openPack;
        // `end_consumeable`：粒子淡出 1 秒后移除
        if (this.packFx && this.packFx.pack !== pack) {
            for (const p of this.packFx.systems) p.fadeOutAndRemove(1);
            this.packFx = null;
        }
        if (!pack) {
            for (const s of oldPackHand) s.destroy();
            return;
        }
        if (!this.packFx) this.packFx = { pack, systems: this.makePackParticles(pack.center.kind) };

        const area = packCardsArea(pack.center.kind, pack.center.extra);
        const game = { pack_choices: pack.choicesLeft };
        const box = new UIBox(createBoosterPack(pack.center.kind, area, game), { align: 'tmi', offset: { x: 0, y: -2.2 }, major: { T: this.areas.hand } }, {
            set_button_pip: () => undefined,
            // `button_callbacks.lua:2242`：包里还有牌才能跳（奥秘 / 幽灵包还要手里有牌——手牌那一支还没做）
            can_skip_booster: (e: UIElement) => {
                const ok = !!this.run.openPack?.cards.length && !this.animating;
                e.config.colour = ok ? C.GREY : C.UI.BACKGROUND_INACTIVE;
                e.config.button = ok ? 'skip_booster' : undefined;
            },
        });
        const view = new UIBoxView(this, box, 0.5, (name) => this.onUIButton(name));
        view.setResolution(this.mapping.pxPerTile / toPx(1));
        const el = [...box.root.walk()].find((e) => e.config.object === area)!;
        this.packUi = { view, area, rect: { x: el.x, y: el.y, w: area.T.w, h: area.T.h } };

        pack.cards.forEach((card, i) => {
            if (card.kind === 'joker') {
                const s: JokerSprite = new JokerSprite(this, card.joker, () => this.pick(s, { kind: 'pack', index: i }));
                this.attachPopup([s.shader], s, () => popupOfJoker(card.joker, 'pack'));
                this.packCardSprites.push(s);
            } else if (card.kind === 'consumable') {
                const s: ConsumableSprite = new ConsumableSprite(this, card.consumable, () => this.pick(s, { kind: 'pack', index: i }));
                this.attachPopup([s.shader], s, () => popupOfConsumable(card.consumable, 'pack'));
                this.packCardSprites.push(s);
            } else {
                const s: CardSprite = new CardSprite(this, card.card, () => this.pick(s, { kind: 'pack', index: i }));
                this.attachPopup(s.hoverTargets, s, () => popupOfCard(card.card, 'pack'));
                this.packCardSprites.push(s);
                // **版本与蜡封的贴图都没有移植**，只用文字标出来——
                // 一张 Red 蜡封的牌会多算一遍分，不标就看不出来
                const tags = `${editionTag(card.card.edition)}${sealTag(card.card.seal)}`.trim();
                this.packLabels.push(this.add.text(0, 0, tags, { fontFamily: 'monospace', fontSize: 15, color: '#9fd6ff' }).setDepth(40));
            }
        });
        // 手牌区的开包分支（`cardarea.lua:441`）：发下来的牌抬到手牌区上方
        let drawn = 0;
        this.packHandSprites = (this.run.packHand ?? []).map((c) => {
            const sprite = this.handSprite(c, oldPackHand, (card) => this.togglePackHand(card));
            if (sprite.spawnFrom) sprite.holdUntil = this.time.now / 1000 + 0.1 * drawn++;
            return sprite;
        });
        for (const s of oldPackHand) s.destroy();
        this.layoutPackCards();
    }

    /** `game.lua:3714` 起各 `update_*_pack` 里建的粒子。小丑包没有 */
    private makePackParticles(kind: BoosterKind): Particles[] {
        switch (kind) {
            case 'Arcana':
                return [new Particles(this, { timer: 0.015, scale: 0.2, initialize: true, lifespan: 1, speed: 1.1, padding: -1, fill: true,
                    colours: [C.WHITE, lighten(C.PURPLE, 0.4), lighten(C.PURPLE, 0.2), lighten(C.GOLD, 0.2)] }).fadeIn()];
            case 'Spectral':
                return [new Particles(this, { timer: 0.015, scale: 0.1, initialize: true, lifespan: 3, speed: 0.2, padding: -1, fill: true,
                    colours: [C.WHITE, lighten(C.GOLD, 0.2)] }).fadeIn()];
            case 'Standard':
                return [new Particles(this, { timer: 0.015, scale: 0.3, initialize: true, lifespan: 3, speed: 0.2, padding: -1, fill: true,
                    colours: [C.BLACK, C.RED] }).fadeIn()];
            case 'Celestial':
                // 星星与流星都不淡入（没设 `fade_alpha`）；流星不 `fill`，从房间正中射出
                return [
                    new Particles(this, { timer: 0.07, scale: 0.1, initialize: true, lifespan: 15, speed: 0.1, padding: -4, fill: true,
                        colours: [C.WHITE, HEX('a7d6e0'), HEX('fddca0')] }),
                    new Particles(this, { timer: 2, scale: 0.05, lifespan: 1.5, speed: 4, colours: [C.WHITE] }),
                ];
            case 'Buffoon':
                return [];
        }
    }

    /** 点选开包时的手牌（`G.hand` 的 `highlight_limit` 是 5） */
    private togglePackHand(card: Card): void {
        if (this.animating || !this.run.packHand) return;
        if (this.selected.has(card)) this.selected.delete(card);
        else if (this.selected.size < 5) this.selected.add(card);
        else return;
        this.sound.play('cardSlide2', { volume: 0.3 });
    }

    /** `align_cards` 的 consumeable 分支，每帧摆（没选中的牌上下浮动） */
    private layoutPackCards(real = this.time.now / 1000): void {
        if (!this.packUi) return;
        const U = toPx(1);
        const sprites = this.packCardSprites;
        const size = (s: JokerSprite | ConsumableSprite | CardSprite) =>
            s instanceof CardSprite ? { w: CARD_W, h: CARD_H } : { w: s.w / U, h: s.h / U };
        let label = 0;
        alignConsumeable(this.packUi.rect, sprites.map((s) => ({ highlighted: s.highlighted, prevX: s.prevX, ...size(s) })), real)
            .forEach((p, i) => {
                const s = sprites[i]!;
                s.place(p, i);
                if (s instanceof CardSprite) this.packLabels[label++]?.setPosition(toPx(p.x), toPx(p.y + CARD_H + 0.1));
            });
        const hand = this.packHandSprites;
        for (const s of hand) s.highlighted = this.selected.has(s.card);
        alignPackHand(this.areas.hand, hand.map((s) => ({ highlighted: s.highlighted, prevX: s.prevX })), this.run.packHand?.length ?? 0, real)
            .forEach((p, i) => hand[i]!.place(p, i));
    }

    /**
     * 挑走包里第 `index` 张。小丑进小丑区、扑克牌进牌组；塔罗 / 星球 / 幽灵牌**当场用**（`use_card`），
     * 目标是开包时那手牌里选中的（与消耗品区的塔罗同一套 `selected`）
     */
    private takeFromPack(index: number): void {
        if (this.animating || !this.run.openPack) return;
        const card = this.run.openPack.cards[index];
        const highlighted = this.run.packHand ? this.selectedInOrder() : [];
        if (!card || !this.run.canTakeFromPack(index, highlighted)) {
            this.sound.play('cancel', { volume: 0.4 });
            this.message.setText(card?.kind === 'consumable' ? this.whyCannotUse(card.consumable) : '放不下了——先卖一张').setColor('#e5885f');
            this.time.delayedCall(1400, () => this.message.setText(''));
            return;
        }
        this.run.takeFromPack(index, highlighted);
        this.selected.clear();
        this.sound.play(card.kind === 'consumable' ? 'tarot1' : 'card1', { volume: 0.5 });
        this.rebuildJokers();
        this.rebuildConsumables();
        if (!this.run.openPack) this.rebuildShop();
        this.rebuildPackCards();
        this.refresh();
    }

    private doSkipPack(): void {
        if (this.animating || !this.run.openPack) return;
        this.run.skipPack();
        this.selected.clear();
        this.sound.play('cardSlide2', { volume: 0.4 });
        this.rebuildJokers();
        this.rebuildShop();
        this.rebuildPackCards();
        this.refresh();
    }

    private openPack(index: number): void {
        if (this.animating || this.run.state !== 'shop') return;
        if (!this.run.canBuyPack(index)) {
            this.sound.play('cancel', { volume: 0.4 });
            const slot = this.run.shop?.packs[index];
            this.message.setText(
                slot && !isBoosterImplemented(slot.key, BOOSTER_CENTERS)
                    ? `${slot.center.name} 还没有实现`
                    : '买不起',
            ).setColor('#e5885f');
            this.time.delayedCall(1400, () => this.message.setText(''));
            return;
        }
        this.run.buyAndOpenPack(index);
        this.sound.play('coin1', { volume: 0.5 });
        this.rebuildJokers();
        this.rebuildConsumables();
        this.rebuildShop();
        this.rebuildPackCards();
        this.refresh();
    }

    private rebuildShop(): void {
        this.clearShop();
        const shop = this.run.shop;
        if (!shop || this.roundEval) return;
        const U = toPx(1);

        // `G.UIDEF.shop`：外框挂在手牌区上（`tmi`，offset 落定 −5.3），招牌挂在左侧面板的 `row_blind`
        const areas = shopAreas(shop.jokerMax);
        const currentRound = { reroll_cost: shop.rerollCost };
        const box = new UIBox(createShop(areas, this.run.ante, currentRound), { align: 'tmi', offset: { x: 0, y: -5.3 }, major: { T: this.areas.hand } }, {
            set_button_pip: () => undefined,
            // `button_callbacks.lua` 的 `can_reroll`：付不起（且不是免费重掷）就灰掉
            can_reroll: (e: UIElement) => {
                currentRound.reroll_cost = shop.rerollCost;
                const ok = shop.rerollCost === 0 || this.run.canAfford(shop.rerollCost);
                e.config.colour = ok ? C.GREEN : C.UI.BACKGROUND_INACTIVE;
                e.config.button = ok ? 'reroll_shop' : undefined;
            },
        });
        const sign = new UIBox(createShopSign(), { align: 'cm', offset: { x: 0, y: 0 }, major: this.hudView.box.getById('row_blind')!.asMajor });
        const onButton = (name: string) => this.onUIButton(name);
        this.shopUi = { view: new UIBoxView(this, box, 0.5, onButton), sign: new UIBoxView(this, sign, 41), tags: [] };
        for (const v of [this.shopUi.view, this.shopUi.sign]) v.setResolution(this.mapping.pxPerTile / U);
        // 开包时商店整个挪出屏幕（`update_*_pack`：`G.shop.alignment.offset.y = G.ROOM.T.y + 11`），只留招牌；
        // 货架上的卡不建，关包时重建
        if (this.run.openPack) return;

        // 区域在房间里的位置 = 装它的 O 元素的位置
        const rectOf = (a: CardAreaObject): Rect => {
            const el = [...box.root.walk()].find((e) => e.config.object === a)!;
            return { x: el.x, y: el.y, w: a.T.w, h: a.T.h };
        };
        /**
         * 一格商品：精灵、所在区域、价签（`create_shop_card_ui` 的 t1：挂在卡上，`tm`、下压 0.38，补充包 0.5）。
         * 价签是卡的 child、先于卡面画：卡盖住价签的下半截（深度在外框之上、卡与卡的阴影之下）
         */
        const slot = (group: ShopSlot['group'], index: number, sprite: Pickable, area: Rect, w: number, h: number, cost: number, done: boolean) => {
            const tagMajor = { T: { x: area.x, y: area.y, w, h } };
            const t = new UIBox(priceTag({ cost }), { align: 'tm', offset: { x: 0, y: group === 'packs' ? 0.5 : 0.38 }, major: tagMajor });
            const tagView = new UIBoxView(this, t, 0.8);
            tagView.setResolution(this.mapping.pxPerTile / U);
            this.shopUi!.tags.push(tagView);
            // 没实现行为的商品照旧标出来：商店从全池生成，买了什么也不发生就是把缺口伪装成正常行为
            const warn = done ? undefined : this.add.text(0, 0, '⚠未实现', { fontFamily: 'monospace', fontSize: 16, color: '#e5885f' }).setDepth(40);
            if (warn) this.shopLabels.push(warn);
            this.shopSlots.push({ group, index, sprite, area, w, h, tagMajor, tagView, warn });
        };

        // 货架
        const itemsArea = rectOf(areas.shop_jokers);
        shop.items.forEach((item, i) => {
            if (item.kind === 'joker') {
                const s = new JokerSprite(this, item.joker, () => this.pick(s, { kind: 'shop', index: i }));
                this.attachPopup([s.shader], s, () => popupOfJoker(item.joker, 'shop'), true);
                this.shopSprites.push(s);
                slot('items', i, s, itemsArea, s.w / U, s.h / U, shop.itemCost(i), isJokerImplemented(item.joker.key));
            } else if (item.kind === 'consumable') {
                const s = new ConsumableSprite(this, item.consumable, () => this.pick(s, { kind: 'shop', index: i }));
                this.attachPopup([s.shader], s, () => popupOfConsumable(item.consumable, 'shop'), true);
                this.shopConsumableSprites.push(s);
                slot('items', i, s, itemsArea, CARD_W, CARD_H, shop.itemCost(i), isConsumableImplemented(item.consumable.key));
            } else {
                // Magic Trick 的扑克牌
                const s = new CardSprite(this, item.card, () => this.pick(s, { kind: 'shop', index: i }));
                this.attachPopup(s.hoverTargets, s, () => popupOfCard(item.card, 'shop'), true);
                this.shopCardSprites.push(s);
                slot('items', i, s, itemsArea, CARD_W, CARD_H, shop.itemCost(i), true);
            }
        });

        // 优惠券
        const voucherArea = rectOf(areas.shop_vouchers);
        shop.vouchers.forEach((v, i) => {
            const s = new VoucherSprite(this, v.center, () => this.pick(s, { kind: 'voucher', index: i }));
            this.attachPopup([s.shader], s, () => popupOfCenter(v.key, 'shop'), true);
            this.voucherSprites.push(s);
            slot('vouchers', i, s, voucherArea, CARD_W, CARD_H, shop.voucherCost(i), true);
        });

        // 补充包：买掉的那一格从区域里拿走，剩下的重新居中（原作 `remove_card` 之后 `align_cards`）
        const packArea = rectOf(areas.shop_booster);
        shop.packs.forEach((p, i) => {
            if (!p) return;
            const s = new BoosterSprite(this, p.center, () => this.pick(s, { kind: 'booster', index: i }));
            this.attachPopup([s.shader], s, () => popupOfCenter(p.key, 'shop'), true);
            this.packSprites.push(s);
            slot('packs', i, s, packArea, CARD_W * 1.27, CARD_H * 1.27, shop.packCost(i), isBoosterImplemented(p.key, BOOSTER_CENTERS));
        });
        this.layoutShop();
    }

    /**
     * 选中的那张卡与挂在它身上的按钮（`Card:highlight` 建的 `use_button`、商店的 `buy_button` / `buy_and_use_button`）。
     * 复刻件全场只选一张（原作每个区各自一张）；手牌的选择另算（`selected`）
     */
    private picked: { sprite: Pickable; where: PickWhere; major: { T: Rect }; views: Array<{ view: UIBoxView; visible?: () => boolean }> } | null = null;

    /** 点一张卡：选中它（再点一次取消），`cardSlide1`（`CardArea:add_to_highlighted`） */
    private pick(sprite: Pickable, where: PickWhere): void {
        if (this.animating) return;
        if (this.picked?.sprite === sprite) {
            this.unpick();
            this.sound.play('cardSlide2', { volume: 0.3 });
            return;
        }
        this.unpick();
        sprite.highlighted = true;
        const major = { T: { ...sprite.rect } };
        this.picked = { sprite, where, major, views: this.pickButtons(where, major) };
        const m = this.popupMakers.get(sprite);
        if (m) this.showPopup(sprite, m.make(), m.shop);
        this.sound.play('cardSlide1', { volume: 0.4 });
    }

    private unpick(): void {
        if (!this.picked) return;
        if (this.popup?.sprite === this.picked.sprite) this.hidePopup();
        this.picked.sprite.highlighted = false;
        for (const v of this.picked.views) v.view.destroy();
        this.picked = null;
    }

    /** 按钮：定义在 `card-buttons.ts`（对拍过 Lua），`func` 在这里接到 `Run` 上 */
    private pickButtons(where: PickWhere, major: { T: Rect }): Array<{ view: UIBoxView; visible?: () => boolean }> {
        const run = this.run;
        const U = toPx(1);
        const hand = () => (run.packHand || run.round ? this.selectedInOrder() : []);
        const idx = () => (where as { index: number }).index;
        const inactive = (e: UIElement) => { e.config.colour = C.UI.BACKGROUND_INACTIVE; e.config.button = undefined; };
        const set = (e: UIElement, ok: boolean, colour: Colour, button: string) => {
            if (!ok) return inactive(e);
            e.config.colour = colour;
            e.config.button = button;
        };
        const funcs = {
            buy_button_check: (e: UIElement) => set(e, !!run.shop && run.canAfford(run.shop.itemCost(idx())), C.ORANGE, 'buy_from_shop'),
            buy_and_use_button_check: (e: UIElement) => set(e, run.canBuyAndUse(idx(), hand()), HEX('fd682b'), 'buy_from_shop'),
            can_redeem: (e: UIElement) => set(e, !!run.shop && run.canAfford(run.shop.voucherCost(idx())), C.GREEN, 'use_card'),
            can_open: (e: UIElement) => set(e, !!run.shop && run.canAfford(run.shop.packCost(idx())), C.GREEN, 'use_card'),
            // `Card:can_sell_card`：出牌结算中不能卖（`G.play` 里有牌 / 控制器锁着）
            can_sell_card: (e: UIElement) => set(e, !this.animating && (run.state !== 'playing' || this.round?.phase === 'selecting'), C.GREEN, 'sell_card'),
            can_use_consumeable: (e: UIElement) => {
                let ok = false;
                if (where.kind === 'consumable') {
                    const i = run.consumables.indexOf(where.consumable);
                    ok = i >= 0 && !this.animating && run.canUseConsumable(i, hand());
                } else if (where.kind === 'pack') ok = !this.animating && run.canTakeFromPack(where.index, hand());
                set(e, ok, C.RED, 'use_card');
            },
            select_button_check: (e: UIElement) => set(e, where.kind === 'pack' && run.canTakeFromPack(where.index), C.GREEN, 'use_card'),
        };
        const make = (def: UINodeDef, align: string, offset: { x: number; y: number }, visible?: () => boolean) => {
            const box = new UIBox(def, { align, offset, major }, funcs);
            // 按钮是卡的 child、画在卡面之前（与价签同层）
            const view = new UIBoxView(this, box, 0.8, (name, el) => this.onPickButton(name, el));
            view.setResolution(this.mapping.pxPerTile / U);
            return { view, visible };
        };
        const card = { T: major.T, sell_cost_label: 0 };
        switch (where.kind) {
            case 'shop': {
                const item = run.shop?.items[where.index];
                const out = [make(shopBuyButton('other', card), 'bm', { x: 0, y: -0.3 })];
                if (item?.kind === 'consumable') out.push(make(buyAndUseButton(card), 'cr', { x: -0.3, y: 0 }, () => run.canBuyAndUse(where.index, hand())));
                return out;
            }
            case 'voucher':
                return [make(shopBuyButton('Voucher', card), 'bm', { x: 0, y: -0.3 })];
            case 'booster':
                return [make(shopBuyButton('Booster', card), 'bm', { x: 0, y: -0.3 })];
            case 'joker':
                card.sell_cost_label = where.joker.sell_cost;
                return [make(useAndSellButtons(card, 'joker', false), 'cr', { x: -0.4, y: 0 })];
            case 'consumable':
                card.sell_cost_label = where.consumable.sell_cost;
                return [make(useAndSellButtons(card, 'joker', true), 'cr', { x: -0.5, y: 0 })];
            case 'pack': {
                const c = run.openPack?.cards[where.index];
                return [make(useAndSellButtons(card, 'pack', c?.kind === 'consumable'), 'bmi', { x: 0, y: 0.65 })];
            }
        }
    }

    /** BUY & USE：买下就对选中的手牌用（商店里没有手牌，只有不用选牌的那些用得了） */
    private buyAndUse(index: number): void {
        if (this.animating || !this.run.canBuyAndUse(index, this.selectedInOrder())) {
            this.sound.play('cancel', { volume: 0.4 });
            return;
        }
        this.run.buyAndUseConsumable(index, this.selectedInOrder());
        this.selected.clear();
        this.sound.play('coin1', { volume: 0.5 });
        this.sound.play('tarot1', { volume: 0.6 });
        this.rebuildJokers();
        this.rebuildConsumables();
        this.rebuildShop();
        this.refresh();
    }

    /** 选中消耗品后按 SELL */
    private sellConsumable(consumable: Consumable): void {
        const index = this.run.consumables.indexOf(consumable);
        if (this.animating || index < 0) return;
        this.run.sellConsumable(index);
        this.sound.play('coin3', { volume: 0.5 });
        this.rebuildConsumables();
        this.refresh();
    }

    /** 选中卡上的按钮按下：`buy_from_shop` / `use_card`（兑换、开包、用、挑）/ `sell_card` */
    private onPickButton(name: string, el: UIElement): void {
        const picked = this.picked;
        if (!picked) return;
        const where = picked.where;
        this.unpick();
        if (name === 'buy_from_shop' && where.kind === 'shop') {
            if (el.config.id === 'buy_and_use') this.buyAndUse(where.index);
            else this.buy(where.index);
        } else if (name === 'use_card') {
            if (where.kind === 'voucher') this.redeem(where.index);
            else if (where.kind === 'booster') this.openPack(where.index);
            else if (where.kind === 'consumable') this.onConsumableClick(where.consumable);
            else if (where.kind === 'pack') this.takeFromPack(where.index);
        } else if (name === 'sell_card') {
            if (where.kind === 'joker') this.onJokerClick(where.joker);
            else if (where.kind === 'consumable') this.sellConsumable(where.consumable);
        }
    }

    /** 每帧：按钮跟着选中那张卡的可见位置走；BUY & USE 用不了时整个藏起来（`buy_and_use_button_check`） */
    private followPick(time: number): void {
        const p = this.picked;
        if (!p) return;
        Object.assign(p.major.T, p.sprite.rect);
        for (const v of p.views) {
            v.view.box.followMajor();
            v.view.setVisible(v.visible ? v.visible() : true);
            v.view.update(time);
        }
    }

    /** 悬停的提示框（`h_popup`）与它挂着的附加说明（`show_infotip`） */
    private popup: { sprite: Pickable; major: { T: Rect }; views: UIBoxView[] } | null = null;

    /** 给一张卡挂悬停提示框。`shop`：商店里的卡朝左弹（`align_h_popup` 的 `buy_button` / `shop` 那一支） */
    private attachPopup(targets: GameObjects.Shader[], sprite: Pickable, make: () => PopupCard, shop = false): void {
        this.popupMakers.set(sprite, { make, shop });
        for (const t of targets) {
            t.on('pointerover', () => this.showPopup(sprite, make(), shop));
            // 选中的那张常驻（触屏上抬手就是 pointerout；原作移动版单击卡牌也是一直显示提示）
            t.on('pointerout', () => { if (this.popup?.sprite === sprite && this.picked?.sprite !== sprite) this.hidePopup(); });
        }
    }

    private readonly popupMakers = new WeakMap<Pickable, { make: () => PopupCard; shop: boolean }>();

    /**
     * `Card:hover` → `card_h_popup`，挂法照 `Card:align_h_popup`：商店里 `cl`（小丑 x −0.05、消耗品 / 优惠券 0）；
     * 卡在上半屏（`T.y < 1.4·CARD_H`，小丑区与消耗品区）`bm`、下压 0.1；其余 `tm`、上提 0.13
     */
    private showPopup(sprite: Pickable, card: PopupCard, shop: boolean): void {
        this.hidePopup();
        const aut = abilityTable(card, popupGame(this.run, LOOK.mobileUi));
        const r = sprite.rect;
        const type = shop ? 'cl' : r.y < CARD_H * 1.4 ? 'bm' : 'tm';
        const set = card.ability.set as string;
        const offset = type === 'cl' ? { x: card.ability.consumeable || set === 'Voucher' ? 0 : -0.05, y: 0 }
            : type === 'bm' ? { x: 0, y: 0.1 } : { x: 0, y: -0.13 };
        const major = { T: { ...r } };
        const box = new UIBox(cardHPopup(card, aut), { align: type, offset, major });
        const U = toPx(1);
        const views = [new UIBoxView(this, box, 90)];
        const info = infoBoxes(aut);
        if (info) {
            const ibox = new UIBox(info, { align: 'cl', offset: { x: -0.03, y: 0 }, major: box.getById('h_popup_main')!.asMajor });
            views.push(new UIBoxView(this, ibox, 90));
        }
        for (const v of views) v.setResolution(this.mapping.pxPerTile / U);
        this.popup = { sprite, major, views };
    }

    /**
     * 标签的提示框（`Tag:generate_UI` 的 `hover`）：`get_uibox_table` → `card_h_popup`，`cl` 挂在精灵左边、再左移 0.1
     */
    private showTagPopup(target: { readonly rect: Rect }, key: string, orbital: string | undefined): void {
        this.hidePopup();
        const run = this.run;
        const g = popupGame(run, LOOK.mobileUi);
        const aut = tagAbilityTable(key, orbital, { handsPlayed: run.round?.handsPlayed ?? run.handsPlayed, unusedDiscards: run.unusedDiscards, skips: run.skips }, g);
        const card: PopupCard = { centerKey: key, ability: { set: 'Tag', name: TAG_CENTERS[key]?.name } };
        const major = { T: { ...target.rect } };
        const box = new UIBox(cardHPopup(card, aut), { align: 'cl', offset: { x: -0.1, y: 0 }, major });
        const views = [new UIBoxView(this, box, 90)];
        const info = infoBoxes(aut);
        if (info) views.push(new UIBoxView(this, new UIBox(info, { align: 'cl', offset: { x: -0.03, y: 0 }, major: box.getById('h_popup_main')!.asMajor }), 90));
        for (const v of views) v.setResolution(this.mapping.pxPerTile / toPx(1));
        this.popup = { sprite: target as unknown as Pickable, major, views };
        this.sound.play('paper1', { rate: Math.random() * 0.1 + 0.55, volume: 0.42 });
        this.sound.play('tarot2', { rate: Math.random() * 0.1 + 0.55, volume: 0.09 });
    }

    /**
     * 标签精灵的悬停区（UIBoxView 只给按钮建命中区）。每帧跟着元素的位置走；打过 / 跳过的格子标签行被挪到 10 tile 以下，区也跟着走
     */
    private tagHoverZones: Array<{ zone: GameObjects.Zone; target: { readonly rect: Rect } }> = [];

    private addTagHover(rect: () => Rect, key: string, orbital: () => string | undefined): void {
        const target = { get rect() { return rect(); } };
        const zone = this.add.zone(0, 0, 1, 1).setOrigin(0, 0).setInteractive().setDepth(43);
        zone.on('pointerover', () => this.showTagPopup(target, key, orbital()));
        zone.on('pointerout', () => { if (this.popup?.sprite === (target as unknown as Pickable)) this.hidePopup(); });
        this.tagHoverZones.push({ zone, target });
    }

    private clearTagHovers(filter: (t: { readonly rect: Rect }) => boolean = () => true): void {
        this.tagHoverZones = this.tagHoverZones.filter((h) => {
            if (!filter(h.target)) return true;
            if (this.popup?.sprite === (h.target as unknown as Pickable)) this.hidePopup();
            h.zone.destroy();
            return false;
        });
    }

    private followTagHovers(): void {
        for (const { zone, target } of this.tagHoverZones) {
            const r = target.rect;
            zone.setPosition(toPx(r.x), toPx(r.y)).setSize(toPx(r.w), toPx(r.h));
            zone.input!.hitArea.setTo(0, 0, toPx(r.w), toPx(r.h));
        }
    }

    private hidePopup(): void {
        if (!this.popup) return;
        for (const v of this.popup.views) v.destroy();
        this.popup = null;
    }

    /** 每帧：提示框跟着卡的可见位置走（`xy_bond = 'Strong'`） */
    private followPopup(time: number): void {
        const p = this.popup;
        if (!p) return;
        Object.assign(p.major.T, p.sprite.rect);
        for (const v of p.views) {
            v.box.followMajor();
            v.update(time);
        }
    }

    /** 商店里每一格：精灵、所在区域、价签与它的 major（跟着卡的 `VT` 走） */
    private shopSlots: ShopSlot[] = [];

    /**
     * 货架 / 优惠券 / 补充包三个区按 `align_cards` 的 shop 分支每帧摆：选中的抬 `HIGHLIGHT_H`（补充包那一格 `card_w = 1.27·CARD_W`）。
     * 价签与「未实现」标记跟着卡的可见位置走
     */
    private layoutShop(): void {
        const shop = this.run.shop;
        if (!shop) return;
        const groups: Array<[ShopSlot['group'], number, number]> = [['items', shop.jokerMax, CARD_W], ['vouchers', 1, CARD_W], ['packs', 2, CARD_W * 1.27]];
        for (const [group, limit, cardW] of groups) {
            const slots = this.shopSlots.filter((x) => x.group === group);
            if (slots.length === 0) continue;
            alignPlay(slots[0]!.area, slots.map((x) => ({ highlighted: x.sprite.highlighted, prevX: x.sprite.prevX || slots[0]!.area.x, w: x.w, h: x.h })), limit, cardW)
                .forEach((p, k) => slots[k]!.sprite.place(p, 0));
        }
        for (const x of this.shopSlots) {
            const r = x.sprite.rect;
            Object.assign(x.tagMajor.T, { x: r.x, y: r.y });
            x.tagView.box.followMajor();
            x.warn?.setPosition(toPx(r.x), toPx(r.y + x.h + 0.05));
        }
    }

    /** 商店的 UI（外框、招牌、价签）。开包时整个收起（原作把 `G.shop` 挪到屏幕外） */
    private shopUi: { view: UIBoxView; sign: UIBoxView; tags: UIBoxView[] } | null = null;

    private redeem(index: number): void {
        if (this.animating || this.run.state !== 'shop') return;
        if (!this.run.canRedeemVoucher(index)) {
            this.sound.play('cancel', { volume: 0.4 });
            this.message.setText(this.run.openPack ? '先把包挑完' : '买不起').setColor('#e5885f');
            this.time.delayedCall(1400, () => this.message.setText(''));
            return;
        }
        const v = this.run.redeemVoucher(index);
        this.sound.play('coin1', { volume: 0.5 });
        this.sound.play('card1', { volume: 0.5 });
        this.message.setText(`兑换 ${v.center.name}`).setColor('#ffd76e');
        this.time.delayedCall(1400, () => this.message.setText(''));
        // Clearance Sale 改卖价、Overstock 多一格、Crystal Ball 多一个消耗品格
        this.rebuildJokers();
        this.rebuildConsumables();
        this.rebuildShop();
        this.refresh();
    }

    private buy(index: number): void {
        if (this.animating || this.run.state !== 'shop') return;
        const item = this.run.shop?.items[index];
        if (!item) return;
        try {
            if (item.kind === 'joker') this.run.buyJoker(index);
            else if (item.kind === 'card') this.run.buyPlayingCard(index);
            else this.run.buyConsumable(index);
        } catch {
            // 买不起 / 区满了。逻辑层抛，表现层只给个反馈
            this.sound.play('cancel', { volume: 0.4 });
            return;
        }
        this.sound.play('coin1', { volume: 0.5 });
        this.rebuildJokers();
        this.rebuildConsumables();
        this.rebuildShop();
        this.refresh();
    }

    // ————————————————————————————————————————————————————————————————
    // 出牌 / 弃牌
    // ————————————————————————————————————————————————————————————————

    /**
     * 出牌。
     *
     * **逻辑先同步算完**（`round.play` 里没有任何动画），
     * 再按它吐出的 `steps` 轨迹重放动画。
     * 所以改动画不可能改分数——这是 09 号票那条
     * 「本切片零处队列驱动的 RNG 消费」能成立的前提。
     */
    private doPlay(): void {
        const round = this.round;
        if (this.animating || !round || round.phase !== 'selecting') return;
        if (this.selected.size === 0) return;

        const played = this.selectedInOrder();
        const out = round.play(played);

        this.animating = true;
        this.selected.clear();
        this.liveChips = out.baseChips;
        this.liveMult = out.baseMult;

        // 1) 打出的牌飞到打出区
        const sprites = this.sprites.filter((s) => played.includes(s.card));
        this.queue.add(new GameEvent({
            trigger: 'after',
            delay: 0.25,
            func: () => {
                for (const sp of sprites) {
                    sp.highlighted = false;
                    this.inPlay.add(sp);
                }
                this.sound.play('cardSlide2', { volume: 0.4 });
                this.refresh(
                    out.debuffed
                        ? `${out.handName}   不合法！`
                        : `${out.handName}   ${out.baseChips} × ${out.baseMult}`,
                );
                return true;
            },
        }));

        // 2) 逐张计分。原作 state_events.lua:628 的 percent 从 0.3 每张 +0.08，
        //    用来递增音高——这里照搬。
        out.steps.forEach((step, i) => {
            this.queue.add(new GameEvent({
                trigger: 'after',
                delay: SCORE_STEP_DELAY,
                func: () => {
                    // `held` 那一步只改倍率、不动筹码，所以 handChips 在它上面没有字段——
                    // 保持当前值。
                    if (step.kind !== 'held') this.liveChips = step.handChips;
                    this.liveMult = step.mult;

                    if (step.kind === 'joker') {
                        this.jokerSprites.find((x) => x.joker === step.joker)?.pop();
                        this.sound.play('multhit1', { volume: 0.4 });
                    } else {
                        this.sprites.find((x) => x.card === step.card)?.pop();
                        // 效果来自小丑时也弹那张小丑
                        if (step.source) {
                            this.jokerSprites.find((x) => x.joker === step.source)?.pop();
                        }
                        this.sound.play('chips1', {
                            volume: 0.45,
                            rate: 0.9 + (0.3 + i * 0.08) * 0.5,
                        });
                    }
                    this.refresh(`${out.handName}   ${this.liveChips} × ${this.liveMult}`);
                    return true;
                },
            }));
        });

        // 3) 最终乘法与入账
        this.queue.add(new GameEvent({
            trigger: 'after',
            delay: 0.35,
            func: () => {
                this.sound.play('chips2', { volume: 0.6 });
                this.refresh(`${out.handName}   +${out.score}`);
                return true;
            },
        }));

        // 4) 收拾残局：重建手牌、放开输入
        this.queue.add(new GameEvent({
            trigger: 'after',
            delay: 0.45,
            func: () => {
                this.rebuildHand();
                this.rebuildJokers(); // 自增型小丑长了个子，数字要跟着变
                this.animating = false;
                this.refresh(`${out.handName}   +${out.score}`);
                return true;
            },
        }));
    }

    private doDiscard(): void {
        const round = this.round;
        if (this.animating || !round || round.phase !== 'selecting') return;
        if (this.selected.size === 0 || round.discardsLeft < 1) return;

        round.discard(this.selectedInOrder());
        this.sound.play('card1', { volume: 0.4 });
        this.selected.clear();
        this.rebuildHand();
        this.rebuildJokers(); // Green Joker 弃牌会掉倍率
        this.refresh('弃牌');
    }

    // ————————————————————————————————————————————————————————————————
    // 手牌
    // ————————————————————————————————————————————————————————————————

    /** 手牌变了就整体重建。8 张牌，重建比增量同步便宜也不容易错。 */
    private rebuildHand(): void {
        this.hidePopup();
        const old = this.sprites;
        this.sprites = [];
        this.inPlay.clear();

        const round = this.round;
        if (round) {
            // 逻辑层已经给过 T.x（等距单调，tile 单位）。
            // **不改它**——边距是表现层的事，在 layout 时叠加
            let drawn = 0;
            for (const card of round.hand) {
                const sprite = this.handSprite(card, old, (c) => this.toggle(c));
                if (sprite.spawnFrom) sprite.holdUntil = this.time.now / 1000 + 0.1 * drawn++;
                this.sprites.push(sprite);
            }
        }
        for (const s of old) s.destroy();
        this.layout();
    }

    /** 手牌的精灵：已经在屏幕上的接着它的缓动走，新摸进来的从牌堆顶飞过来（`draw_card`） */
    private handSprite(card: Card, old: CardSprite[], onClick: (c: Card) => void): CardSprite {
        const sprite = new CardSprite(this, card, onClick);
        this.attachPopup(sprite.hoverTargets, sprite, () => popupOfCard(card, 'hand'));
        const prev = old.find((s) => s.card === card);
        if (prev) sprite.adoptMotion(prev);
        else {
            const d = this.areas.deck;
            sprite.spawnFrom = { x: d.x + (d.w - CARD_W) / 2, y: d.y + (d.h - CARD_H) / 2 };
        }
        return sprite;
    }

    private layout(): void {
        for (const s of this.sprites) s.highlighted = this.selected.has(s.card);
    }

    /**
     * `game.lua:3408`：进入选牌时建 `G.buttons`（挂在手牌区底下），离开选牌就拆。
     * 两个 `can_*` 每帧跑（`button_callbacks.lua:2151` / `:2195`）：不能出 / 不能弃时置灰并摘掉按钮名
     */
    private syncButtons(): void {
        const round = this.round;
        const selecting = this.run.state === 'playing' && round?.phase === 'selecting' && !this.animating && !this.run.openPack;
        if (!selecting) {
            this.buttonsView?.container.destroy();
            this.buttonsView = null;
            return;
        }
        if (this.buttonsView) return;
        const box = new UIBox(
            createButtons({ playButtonPos: 2, mobile: LOOK.mobileUi }),
            { align: 'bm', offset: { x: 0, y: 0.3 }, major: { T: this.areas.hand } },
            {
                can_play: (e: UIElement) => {
                    const n = this.selected.size;
                    const ok = n > 0 && n <= 5;
                    e.config.colour = ok ? C.BLUE : C.UI.BACKGROUND_INACTIVE;
                    e.config.button = ok ? 'play_cards_from_highlighted' : undefined;
                },
                can_discard: (e: UIElement) => {
                    const ok = (this.round?.discardsLeft ?? 0) > 0 && this.selected.size > 0;
                    e.config.colour = ok ? C.RED : C.UI.BACKGROUND_INACTIVE;
                    e.config.button = ok ? 'discard_cards_from_highlighted' : undefined;
                },
            },
        );
        this.buttonsView = new UIBoxView(this, box, 45, (name) => this.onUIButton(name));
        this.buttonsView.setResolution(this.mapping.pxPerTile / toPx(1));
    }

    /**
     * `game.lua:3645`：外层挂在手牌区上（`bmi`），offset 落定在 `0.8 − (hand.y − jokers.y) + 自身高`；
     * 三张卡的状态照 `G.GAME.round_resets.blind_states`。滑入动画还没做，直接落在终点
     */
    private buildBlindSelect(): void {
        this.destroyBlindSelect();
        const run = this.run;
        if (run.state !== 'blind-select') return;
        const state: BlindSelectState = {
            ante: run.ante,
            choices: { Small: 'bl_small', Big: 'bl_big', Boss: run.bossKey },
            states: { Small: run.blindState('small'), Big: run.blindState('big'), Boss: run.blindState('boss') },
            tags: run.blindTags,
            mostPlayedHand: mostPlayedHand(run.hands),
            probabilities: 1,
        };
        // `loc_blind_states`：英文里各状态的显示名与键同名
        const loc = { ...state.states };
        const { def, opts, funcs } = createBlindSelect(state, this.areas.hand.w, loc);
        this.blindSelectState = { state, loc, opts, funcs, select: null as unknown as UIBox };
        const hand = this.areas.hand;
        const select = new UIBox(def, { align: 'bmi', offset: { x: 0, y: 29 }, major: { T: hand } });
        select.config.offset = { x: 0, y: 0.8 - (hand.y - this.areas.jokers.y) + select.T.h };
        select.realign();
        this.blindSelectState.select = select;
        const prompt = new UIBox(createBlindPrompt(run.vouchers.directorsCut), {
            align: 'cm', offset: { x: 0, y: 0 }, major: this.hudView.box.getById('row_blind')!.asMajor,
        }, {
            // `button_callbacks.lua:2894`：钱够且这个 Ante 还没重掷过才亮；灰掉时两行字的阴影也去掉
            reroll_boss_button: (e: UIElement) => {
                const ok = run.canRerollBoss && !this.animating;
                e.config.colour = ok ? C.RED : C.UI.BACKGROUND_INACTIVE;
                e.config.button = ok ? 'reroll_boss' : undefined;
                for (const row of e.children) if (row.children[0]) row.children[0].config.shadow = ok;
            },
        });
        const onButton = (name: string) => this.onUIButton(name);
        this.blindSelectViews = {
            select: new UIBoxView(this, select, 30, onButton),
            prompt: new UIBoxView(this, prompt, 41, onButton),
        };
        for (const v of Object.values(this.blindSelectViews)) v.setResolution(this.mapping.pxPerTile / toPx(1));
        // `blind_choice_handler`：跳过的那一格盖一个斜着的「SKIPPED」（`tmi` 挂卡片、下移 2.2，跟着卡走）
        for (const type of ['Small', 'Big'] as const) if (state.states[type] === 'Skipped') this.addSkippedAlert(type);
        // 卡上「or」旁边的标签精灵
        for (const type of ['Small', 'Big'] as const) {
            const card = opts[type];
            const key = run.blindTags[type];
            const sprite = card && [...card.root.walk()].find((e) => e.UIT === UIT.O && (e.config.object as { atlas?: string } | undefined)?.atlas === 'tags');
            if (!sprite || !key) continue;
            this.addTagHover(() => ({ x: sprite.x, y: sprite.y, w: sprite.T.w, h: sprite.T.h }), key, () => run.orbitalChoice(type));
            this.blindTagTargets.add(this.tagHoverZones[this.tagHoverZones.length - 1]!.target);
        }
    }

    private readonly blindTagTargets = new Set<object>();

    /** 选盲注界面上跳过那几格的「SKIPPED」戳 */
    private skippedAlerts: UIBoxView[] = [];
    /** 当前选盲注界面读的那几张表。**跳过盲注不重建界面**（原作只改 `blind_states`，每帧的 handler 切外观） */
    private blindSelectState: {
        state: BlindSelectState;
        loc: Record<BlindType, string>;
        opts: Partial<Record<BlindType, UIBox>>;
        funcs: UIFuncs;
        select: UIBox;
    } | null = null;

    private addSkippedAlert(type: BlindType): void {
        const card = this.blindSelectState?.opts[type];
        if (!card) return;
        const alert = new UIBox(cardAlert({ textRot: -0.35, noBg: true, text: DICTIONARY.k_skipped_cap, bumpAmount: 1, scale: 0.9, maxw: 3.4 }),
            { align: 'tmi', offset: { x: 0, y: 2.2 }, major: card });
        const view = new UIBoxView(this, alert, 31);
        view.setResolution(this.mapping.pxPerTile / toPx(1));
        this.skippedAlerts.push(view);
    }

    private destroyBlindSelect(): void {
        if (!this.blindSelectViews) return;
        this.blindSelectViews.select.destroy();
        this.blindSelectViews.prompt.destroy();
        for (const v of this.skippedAlerts) v.destroy();
        this.skippedAlerts = [];
        this.clearTagHovers((t) => this.blindTagTargets.has(t));
        this.blindTagTargets.clear();
        this.blindSelectViews = null;
        this.blindSelectState = null;
    }

    /** `G.FUNCS[button]`：UI 按钮名接到场景的操作上 */
    // ————————————————————————————————————————————————————————————————
    // 游戏结束 / 胜利（`G.OVERLAY_MENU`）
    // ————————————————————————————————————————————————————————————————

    /** `end_round` 没够分 → `Game:update_game_over`（`game.lua:3944`） */
    private gameOver(): void {
        if (this.runOver) return;
        // 原作输了只跑一趟小丑的 `end_of_round`（Mr. Bones 在出牌结算里已经判过）就进 GAME_OVER：
        // 不结算、不清场，底下留着输掉那一局的盲注面板、分数与牌堆。所以这里**不调** `finishRound`
        this.runOver = true;
        this.selected.clear();
        this.refresh();
        this.sound.play('negative', { rate: 0.5, volume: 0.7 });
        this.sound.play('whoosh2', { rate: 0.9, volume: 0.7 });
        this.showOverlay('game_over');
        this.juice.jiggle += 3;
    }

    private gameOverState(): GameOverState {
        const run = this.run;
        const s = run.scores;
        return {
            ante: run.ante,
            round: run.roundNumber,
            seed: run.seed,
            // 复刻件的口径是「新档 + 指定 seed」（18 号票），种子那一格恒是红底
            seeded: true,
            bestHand: s.bestHand,
            mostPlayed: mostPlayedHandUsage(s),
            cardsPlayed: s.cardsPlayed,
            cardsDiscarded: s.cardsDiscarded,
            cardsPurchased: s.cardsPurchased,
            timesRerolled: s.timesRerolled,
            newCollection: 0,
            blindKey: run.blindKey,
        };
    }

    /** `G.FUNCS.overlay_menu`（`button_callbacks.lua:1377`）：`cm` 挂房间、offset 从 y=10 改成 0，靠 VT 的弹簧滑上来 */
    private showOverlay(kind: 'game_over' | 'win'): void {
        this.closeOverlay();
        const run = this.run;
        // `eased_red` / `eased_green`：复制一份、alpha 置 0，再 `ease_value` 到 0.8 / 0.5。无尽模式里输了是蓝的
        const bg: Colour = [...(kind === 'win' ? C.GREEN : run.ante <= WIN_ANTE ? C.RED : C.BLUE)] as Colour;
        bg[3] = 0;
        const def = kind === 'win' ? createWin(this.gameOverState(), bg) : createGameOver(this.gameOverState(), bg);
        const overlay = this.mountOverlay(def, bg, kind === 'win' ? 0.5 : 0.8);
        const box = overlay.view.box;
        // 2.5 秒后 `jimbo_spot` 换成说俏皮话的 Jimbo（`game.lua:3966` / `state_events.lua:42`）。
        // 输了只在没赢过时出（无尽模式里输了没有）；俏皮话 `lq_1..10` / `wq_1..7`，无种子的 `math.random`
        if (kind === 'win' || run.ante <= WIN_ANTE) {
            this.time.delayedCall(2500, () => {
                if (this.overlay !== overlay) return;
                const spot = box.getById('jimbo_spot');
                if (!spot) return;
                const quip = kind === 'win' ? `wq_${1 + Math.floor(Math.random() * 7)}` : `lq_${1 + Math.floor(Math.random() * 10)}`;
                overlay.jimbo = new Jimbo(this, () => ({
                    x: spot.x, y: spot.y + overlay.motion.VT.y - overlay.motion.T.y, w: spot.T.w, h: spot.T.h,
                }), quip, LOOK.mobileUi, this.mapping.pxPerTile / toPx(1));
            });
        }
        this.hidePopup();
    }

    /**
     * `G.FUNCS.overlay_menu`（`button_callbacks.lua:1377`）：`cm` 挂房间、offset 从 y=10 改成 0，靠 VT 的弹簧滑上来；
     * 挡板吞掉底下的点击与悬停（原作 `G.SETTINGS.paused` + 光标上下文层），房间 jiggle +1
     */
    private mountOverlay(def: UINodeDef, bg: Colour, alphaTo: number): NonNullable<RunScene['overlay']> {
        const box = new UIBox(def, { align: 'cm', offset: { x: 0, y: 0 }, major: { T: { x: 0, y: 0, w: TILE_W, h: TILE_H } } });
        const view = new UIBoxView(this, box, 200, (name, el) => this.onOverlayButton(name, el));
        view.setResolution(this.mapping.pxPerTile / toPx(1));
        const motion = new Motion({ x: box.T.x, y: box.T.y + 10, r: 0, scale: 1 });
        motion.T.y = box.T.y;
        const blocker = this.add.zone(-toPx(TILE_W * 3), -toPx(TILE_H * 3), toPx(TILE_W * 7), toPx(TILE_H * 7))
            .setOrigin(0, 0).setInteractive().setDepth(199);
        const overlay = {
            view, motion, bg, alpha: { from: bg[3], to: alphaTo, start: this.time.now / 1000 }, blocker,
            jimbo: null as Jimbo | null, vouchers: [] as Array<{ sprite: VoucherSprite; area: VoucherArea }>,
        };
        this.overlay = overlay;
        this.juice.jiggle += 1;
        this.hidePopup();
        return overlay;
    }

    private closeOverlay(): void {
        if (!this.overlay) return;
        this.overlay.view.destroy();
        this.overlay.blocker.destroy();
        this.overlay.jimbo?.destroy();
        for (const v of this.overlay.vouchers) v.sprite.destroy();
        this.overlay = null;
    }

    /** `G.FUNCS.run_info`：`G.UIDEF.run_info()` 挂成 overlay（灰底 0.7，不缓动），第一页牌型 */
    private openRunInfo(): void {
        if (this.overlay || this.animating) return;
        const run = this.run;
        const state: BlindSelectState = {
            ante: run.ante,
            choices: { Small: 'bl_small', Big: 'bl_big', Boss: run.bossKey },
            states: { Small: run.blindState('small'), Big: run.blindState('big'), Boss: run.blindState('boss') },
            tags: run.blindTags,
            mostPlayedHand: mostPlayedHand(run.hands),
            probabilities: 1,
        };
        const pool = Object.keys(VOUCHER_CENTERS).sort((a, b) => VOUCHER_CENTERS[a]!.order - VOUCHER_CENTERS[b]!.order);
        const def = runInfo({
            hands: () => currentHands(run.hands),
            blinds: () => currentBlinds(state, { ...state.states }),
            blindFuncs: blindChoiceFuncs(state, {}),
            vouchers: () => {
                const r = usedVouchers(pool, run.usedVouchers);
                this.runInfoVoucherAreas = r.areas;
                return r.def;
            },
        });
        const bg: Colour = [C.GREY[0], C.GREY[1], C.GREY[2], 0.7];
        this.mountOverlay(def, bg, 0.7);
    }

    /** Vouchers 页当前那几格（`usedVouchers` 建页时写） */
    private runInfoVoucherAreas: VoucherArea[] = [];

    /** 切到 Vouchers 页时给每格造卡（原作 `Card(...)` + `emplace`），离开这一页就拆掉 */
    private syncRunInfoVouchers(showing: boolean): void {
        const o = this.overlay;
        if (!o) return;
        for (const v of o.vouchers) v.sprite.destroy();
        o.vouchers = [];
        if (!showing) return;
        for (const area of this.runInfoVoucherAreas) {
            for (const key of area.keys) {
                o.vouchers.push({ sprite: new VoucherSprite(this, VOUCHER_CENTERS[key]!, () => undefined, { card: 202, shadow: 201.5 }), area });
            }
        }
    }

    /**
     * `align_cards` 的 voucher 分支（一格一张时同 title）：卡在格子里居中，转角 `0.02·sin(2t + x)`、上下浮 `0.03·sin(0.666t + x)`
     */
    private placeRunInfoVouchers(now: number): void {
        const o = this.overlay;
        if (!o || o.vouchers.length === 0) return;
        const inner = o.view.box.getById('tab_contents')?.config.object as UIBox | undefined;
        if (!inner) return;
        const slide = o.motion.VT.y - o.motion.T.y;
        const byArea = new Map<VoucherArea, VoucherSprite[]>();
        for (const v of o.vouchers) byArea.set(v.area, [...(byArea.get(v.area) ?? []), v.sprite]);
        for (const [area, cards] of byArea) {
            const el = [...inner.root.walk()].find((e) => e.config.object === area);
            if (!el) continue;
            const n = cards.length;
            const maxCards = Math.max(n, 2);
            cards.forEach((card, i) => {
                const k = i + 1;
                const x0 = el.x + (area.T.w - CARD_W) * ((k - 1) / Math.max(maxCards - 1, 1) - (0.5 * (n - maxCards)) / Math.max(maxCards - 1, 1));
                const y = el.y + slide + area.T.h / 2 - CARD_H / 2 + 0.03 * Math.sin(0.666 * now + x0) + Math.abs((0.5 * (-n / 2 + k - 0.5)) / n) - (n > 1 ? 0.2 : 0);
                const r = (0.2 * (-n / 2 - 0.5 + k)) / n + 0.02 * Math.sin(2 * now + x0);
                card.place({ x: x0, y, r }, i);
            });
        }
    }

    private stepOverlay(dt: number, now: number): void {
        const o = this.overlay;
        if (!o) return;
        o.motion.step(dt, now);
        o.view.container.y = toPx(o.motion.VT.y - o.motion.T.y);
        // `ease_value` 的缺省：0.3 秒线性
        const p = Math.min(1, (now - o.alpha.start) / 0.3);
        o.bg[3] = o.alpha.from + (o.alpha.to - o.alpha.from) * p;
        o.view.update(now);
        o.jimbo?.update(now);
        this.placeRunInfoVouchers(now);
    }

    private onOverlayButton(name: string, el?: UIElement): void {
        if (name === 'change_tab' && el && this.overlay) {
            const tab = el.config.ref_table as Tab;
            changeTab(this.overlay.view.box, tab);
            this.syncRunInfoVouchers(tab.label === DICTIONARY.b_vouchers);
            this.sound.play('button', { volume: 0.3 });
            this.juice.jiggle += 0.5;
            return;
        }
        if (name === 'copy_seed') {
            void navigator.clipboard?.writeText(this.run.seed).catch(() => undefined);
            return;
        }
        if (name === 'exit_overlay_menu') {
            // Endless：关掉胜利窗口接着打
            this.closeOverlay();
            return;
        }
        // 复刻件没有主菜单与开局设置（牌组 / 赌注 / 种子都定死）：
        // 「New Run」换一个随机种子重开，「Main Menu」同种子重开。都走整页重载，URL 上的 ?seed 就是这一局的种子
        if (name === 'notify_then_setup_run' || name === 'go_to_menu') {
            const params = new URLSearchParams(location.search);
            params.set('seed', name === 'go_to_menu' ? this.run.seed : randomSeed());
            location.search = params.toString();
        }
    }

    private onUIButton(name: string): void {
        const round = this.round;
        if (name === 'select_blind') {
            this.doNext();
            return;
        }
        if (name === 'skip_blind') {
            this.doSkipBlind();
            return;
        }
        if (name === 'reroll_boss') {
            this.doRerollBoss();
            return;
        }
        if (name === 'cash_out') {
            this.cashOut();
            return;
        }
        if (name === 'toggle_shop') {
            this.doNext();
            return;
        }
        if (name === 'skip_booster') {
            this.doSkipPack();
            return;
        }
        if (name === 'reroll_shop') {
            this.doReroll();
            return;
        }
        if (name === 'play_cards_from_highlighted') this.doPlay();
        else if (name === 'discard_cards_from_highlighted') {
            this.doDiscard();
            // 原作弃完牌 `G.buttons` 会重建（`one_press` 复位）；这里直接拆掉，下一帧 `syncButtons` 重建
            this.buttonsView?.container.destroy();
            this.buttonsView = null;
        } else if (round && (name === 'sort_hand_value' || name === 'sort_hand_suit')) {
            // `button_callbacks.lua` 的 `sort_hand_value` / `sort_hand_suit`：改排序方式并立即重排
            round.sortHand(name === 'sort_hand_value' ? 'desc' : 'suit desc');
            this.rebuildHand();
        } else return;
        this.sound.play('button', { volume: 0.3 });
    }

    /**
     * `cardarea.lua:236`：选牌时手牌区整体上移 1.9 tile，出牌结算时滑回底边，按 `15·dt` 缓动。
     * 手牌区身后的底框与计数以它为 major，跟着走（`UIBox.followMajor`）
     */
    private slideHand(dt: number): void {
        const round = this.round;
        const selecting = this.run.state === 'playing' && round?.phase === 'selecting' && !this.animating && !this.run.openPack;
        const hand = this.areas.hand;
        const desired = TILE_H - hand.h - 1.9 * (selecting ? 1 : 0);
        hand.y = 15 * dt * desired + (1 - 15 * dt) * hand.y;
        if (Math.abs(desired - hand.y) < 0.01) hand.y = desired;
    }

    /**
     * 逐帧摆牌（22 号票）：手里的按 `align_cards` 的手牌分支（扇形、弧形、转角、微动），
     * 打出去的按出牌区分支。上限用手牌上限（`temp_limit` 缺省就是 `card_limit`）
     */
    private placeCards(real: number): void {
        this.layoutJokers(real);
        this.layoutPackCards(real);
        const round = this.round;
        if (!round) return;
        const hand = this.sprites.filter((s) => !this.inPlay.has(s));
        alignHand(this.areas.hand, hand.map((s) => ({ highlighted: s.highlighted, prevX: s.prevX })), round.handLimit, real)
            .forEach((p, i) => hand[i]!.place(p, i));
        const played = this.sprites.filter((s) => this.inPlay.has(s));
        alignPlay(this.areas.play, played.map((s) => ({ highlighted: false, prevX: s.prevX })), 5)
            .forEach((p, i) => played[i]!.place(p, 20 + i));
    }

    private toggle(card: Card): void {
        const round = this.round;
        if (this.animating || !round || round.phase !== 'selecting') return;

        if (this.selected.has(card)) this.selected.delete(card);
        else if (this.selected.size < 5) this.selected.add(card);
        else return; // 满 5 张，什么也不做，也不出声

        this.sound.play('cardSlide2', { volume: 0.3 });
        this.layout();
        this.refresh();
    }

    private selectedInOrder(): Card[] {
        // 逻辑层按 T.x 排序，这里给它一个按 T.x 排好的数组也无妨
        return [...this.selected].sort((a, b) => a.T.x - b.T.x);
    }

    // ————————————————————————————————————————————————————————————————
    // HUD
    // ————————————————————————————————————————————————————————————————

    private refresh(lastAction = ''): void {
        const run = this.run;
        const round = this.round;

        // 兑换过的优惠券在 Run Info 的 Vouchers 页里
        const vouchersLine = '';
        // 标签的图标在右下角那一列（`G.HUD_tags`）；这里只标出没实现行为的
        const tagsLine = run.tags.some((t) => !isTagImplemented(t.key))
            ? `标签 ⚠未实现：${run.tags.filter((t) => !isTagImplemented(t.key)).map((t) => t.center.name).join('、')}`
            : '';

        if (run.state === 'blind-select') {
            // 盲注名、目标分、奖励、跳过标签都在卡片上了；这里只剩还没有 UI 的已有标签、优惠券、
            // 以及跳过标签没实现时的警告（开包提示在开包界面上）
            const skipKey = run.blindKind === 'small' ? run.blindTags.Small : run.blindKind === 'big' ? run.blindTags.Big : '';
            this.hud.setText([
                skipKey && !isTagImplemented(skipKey) ? `⚠ 跳过可得的 ${TAG_CENTERS[skipKey].name} 还没实现` : '',
                [tagsLine, vouchersLine].filter(Boolean).join('    '),
            ].filter(Boolean).join('\n'));
        } else if (this.roundEval) {
            // 回合结算中：`run.state` 已经是 'shop'，但 Cash Out 之前商店还没开
            this.hud.setText('');
        } else if (run.state === 'shop') {
            // 盲注、钱、重掷价、格数、开包都在 UI 里了；这里只剩还没有 UI 的已有标签 / 优惠券
            this.hud.setText([tagsLine, vouchersLine].filter(Boolean).join('    '));
        } else if (round) {
            // 盲注、目标分、出牌 / 弃牌数、钱都在左侧面板与盲注面板里了，这里只剩上一手的结算说明
            this.hud.setText(lastAction);
        }

        this.jokerInfo.setText(this.describeJokers());

        // 选中的牌会构成什么牌型——原作的手牌提示
        if (this.selected.size > 0 && round) {
            const preview = evaluatePokerHand(this.selectedInOrder());
            const info = preview.topName ? round.hands[preview.topName] : null;
            // **等级要显示出来**：星球牌唯一的可见反馈就是这个数字变大，
            // 不显示的话玩家看不出 $3 买了什么
            this.handPreview.setText(
                preview.topName && info
                    ? `${preview.topName} lv.${info.level}   ${info.chips} × ${info.mult}`
                    : '',
            );
        } else {
            this.handPreview.setText('');
        }

        const inShop = run.state === 'shop';
        const done = !round || round.phase !== 'selecting';
        const inSelect = run.state === 'blind-select';
        this.nextBtn.setAlpha(
            this.animating || run.openPack || (!inShop && !inSelect && !done) ? 0.3 : 1,
        );
        this.skipBlindBtn.setAlpha(run.canSkipBlind && !this.animating ? 1 : 0.3);
        this.rerollBtn.setAlpha(inShop && !this.animating && !this.run.openPack ? 1 : 0.3);
        // 选牌时这排调试按钮全藏起来：原作的出牌 / 排序 / 弃牌已经在手牌下面了（`G.buttons`）
        const choosing = run.state === 'playing' && round?.phase === 'selecting';
        for (const b of [this.nextBtn, this.rerollBtn, this.skipBlindBtn]) b.setVisible(!choosing);
        // 选盲注界面上「下一关」「跳过盲注」由卡片上的 Select / Skip Blind 代替；标签开的包挑完之前卡片收起
        // （`button_callbacks.lua:2306` 把 `G.blind_select` 挪到屏幕外），那时调试按钮还在
        if (inSelect && !run.openPack) {
            this.nextBtn.setVisible(false);
            this.skipBlindBtn.setVisible(false);
            this.rerollBtn.setVisible(false);
        }
        this.blindSelectViews?.select.setVisible(!run.openPack);
        if (this.roundEval) for (const b of [this.nextBtn, this.rerollBtn, this.skipBlindBtn]) b.setVisible(false);
        // 商店里 Next Round / Reroll 由商店 UI 接管；开包时的 Skip 在开包界面上
        if (inShop || run.openPack) for (const b of [this.nextBtn, this.rerollBtn, this.skipBlindBtn]) b.setVisible(false);
        if (this.runOver) for (const b of [this.nextBtn, this.rerollBtn, this.skipBlindBtn]) b.setVisible(false);

        if (run.state === 'game-over' || round?.phase === 'lost') {
            this.message.setText('');
        } else if (round?.phase === 'won') {
            this.message.setText('过关').setColor('#7ddf64');
        } else if (run.state !== 'shop') {
            this.message.setText('');
        }
    }

    /** 小丑区下面那行：只列没实现行为的小丑 */
    private describeJokers(): string {
        return this.run.jokers.filter((j) => !isJokerImplemented(j.key)).map((j) => `${j.ability.name} ⚠未实现`).join('   ');
    }

    private makeButton(
        x: number, y: number, label: string, colour: string, onClick: () => void,
    ): GameObjects.Text {
        const t = this.add.text(x, y, ` ${label} `, {
            fontFamily: 'monospace', fontSize: 28, color: '#ffffff',
            backgroundColor: colour, padding: { x: 16, y: 9 },
        });
        t.setInteractive({ useHandCursor: true });
        t.on('pointerdown', onClick);
        t.setDepth(50);
        return t;
    }

    update(time: number, delta: number): void {
        this.queue.update(delta / 1000);
        // `update_canvas_juice`：光标用屏幕 tile 坐标（`G.CURSOR.T`）
        const p = this.input.activePointer;
        const P = this.mapping.pxPerTile;
        this.placeRoom(stepRoomJuice(this.juice, delta / 1000, time / 1000, LOOK.screenshake,
            { x: p.x / P, y: p.y / P }, { x: this.mapping.roomX, y: this.mapping.roomY }));
        this.syncHud();
        this.hudView.update(time / 1000);
        this.syncHudBlind();
        this.syncHudTags(time / 1000);
        this.hudBlindView.update(time / 1000);
        this.syncAreas();
        for (const a of this.areaViews) a.view.update(time / 1000);
        this.slideHand(delta / 1000);
        this.syncButtons();
        this.buttonsView?.update(time / 1000);
        if (this.blindSelectViews) {
            this.blindSelectViews.select.update(time / 1000);
            this.blindSelectViews.prompt.update(time / 1000);
            for (const v of this.skippedAlerts) {
                v.setVisible(!this.run.openPack);
                v.box.followMajor();
                v.update(time / 1000);
            }
        }
        if (this.round?.phase === 'won' && !this.animating && !this.roundEval) this.startRoundEval();
        // `end_round`：没够分就直接 `G.STATE = GAME_OVER`，不用点任何按钮
        if (this.round?.phase === 'lost' && !this.animating) this.gameOver();
        this.stepOverlay(delta / 1000, time / 1000);
        if (this.shopUi) {
            const hidden = !!this.run.openPack;
            for (const v of [this.shopUi.view, ...this.shopUi.tags]) {
                v.setVisible(!hidden);
                v.update(time / 1000);
            }
            this.shopUi.sign.update(time / 1000);
        }
        this.packUi?.view.update(time / 1000);
        this.layoutShop();
        this.followPick(time / 1000);
        this.followTagHovers();
        this.followPopup(time / 1000);
        tickColours(time / 1000);
        this.roundEval?.view.update(time / 1000);
        this.roundEval?.cashView?.update(time / 1000);
        this.placeCards(time / 1000);
        // 牌堆：盲注里是剩余张数，盲注外整副牌都在牌堆里
        this.deckSprite.update(this.areas.deck, this.deckCount());
    }

    /** `add_tag` / `Tag:remove`：第一个 `bri` 挂房间（x 外移 0.7），之后每个 `tm` 叠在上一个上面 */
    private syncHudTags(now: number): void {
        const tags = this.run.tags;
        const cur = this.hudTags;
        if (cur.list.length !== tags.length || cur.list.some((t, i) => t !== tags[i])) {
            for (const v of cur.views) v.destroy();
            this.clearTagHovers((t) => this.hudTagTargets.has(t));
            this.hudTagTargets.clear();
            const views: UIBoxView[] = [];
            let prev: UIBox | null = null;
            for (const tag of tags) {
                const box: UIBox = new UIBox(hudTag(tag.key), prev
                    ? { align: 'tm', offset: { x: 0, y: 0 }, major: prev }
                    : { align: 'bri', offset: { x: 0.7, y: 0 }, major: { T: { x: 0, y: 0, w: TILE_W, h: TILE_H } } });
                const view = new UIBoxView(this, box, 42);
                view.setResolution(this.mapping.pxPerTile / toPx(1));
                views.push(view);
                prev = box;
                const sprite = [...box.root.walk()].find((e) => e.UIT === UIT.O)!;
                this.addTagHover(() => ({ x: sprite.x, y: sprite.y, w: sprite.T.w, h: sprite.T.h }), tag.key, () => tag.orbitalHand);
                this.hudTagTargets.add(this.tagHoverZones[this.tagHoverZones.length - 1]!.target);
            }
            this.hudTags = { list: [...tags], views };
        }
        for (const v of this.hudTags.views) {
            v.box.followMajor();
            v.update(now);
        }
    }

    /**
     * 盲注面板的绑定值：`Blind:set_text`（`blind.lua:47`）与 `set_blind` 里的目标分、奖励。
     * 描述行的 `#1#` 只有 The Ox 要填（本局最常打的牌型）；被关掉的 Boss 没有描述。
     * 不在盲注里时整块不画（原作是把它挪到屏幕上方外面，`offset.y = -10`）
     */
    private syncHudBlind(): void {
        const run = this.run;
        const round = this.round;
        const b = this.hudBlindState.blind;
        const playing = run.state === 'playing' && round !== null;
        // 结算中（`defeat` 之前）面板留着、值不再更新——奖励的 $ 正被一个个挪进结算面板
        const held = this.roundEval?.blindHeld ?? false;
        this.hudBlindView.setVisible(playing || held);
        if (!playing) return;
        const key = run.blindKey;
        const center = BLIND_CENTERS[key];
        const text = BLIND_TEXT[key];
        b.key = key;
        b.loc_name = text?.name ?? '';
        b.chips = round.requirement;
        b.chip_text = numberFormat(round.requirement);
        const lines = round.blind?.disabled || !text
            ? []
            : text.text.map((l) => (key === 'bl_ox' ? l.replace('#1#', round.mostPlayedHand()) : l));
        b.loc_debuff_lines['1'] = lines[0] ?? '';
        b.loc_debuff_lines['2'] = lines[1] ?? '';
        b.loc_debuff_text = lines.map((l) => `${l} `).join('');
        this.hudBlindState.current_round.dollars_to_be_earned = center ? '$'.repeat(center.dollars) : '';
        // `blind.lua:113`：`set_blind` 末尾 `G.HUD_blind:recalculate()`——同字数换数（300 → 450）也重排
        const sig = `${key}|${b.chip_text}|${b.loc_debuff_text}`;
        if (sig !== this.hudBlindSig) {
            this.hudBlindSig = sig;
            this.hudBlindView.box.refresh();
            this.hudBlindView.box.recalculate();
        }
    }

    private hudBlindSig = '';

    /** 牌堆里有几张：盲注里是剩余张数；盲注外整副牌都在牌堆里，开奥秘 / 幽灵包时扣掉发出去的那手 */
    private deckCount(): number {
        if (this.round && this.run.state === 'playing') return this.round.deck.length;
        return this.run.fullDeck.length - (this.run.packHand?.length ?? 0);
    }

    /**
     * 区域计数同步，以及 `cardarea.lua:283` 的隐藏规则：手牌区在商店、开包、回合结算、选盲注时不画框。
     * 牌堆的上限是整副牌的张数（原作 `G.deck.config.card_limit` 随加牌增长）。
     */
    private syncAreas(): void {
        const run = this.run;
        const round = this.round;
        for (const a of this.areaViews) {
            const c = a.count;
            if (a.key === 'jokers') [c.card_count, c.card_limit] = [run.jokers.length, run.jokerSlots];
            else if (a.key === 'consumeables') [c.card_count, c.card_limit] = [run.consumables.length, run.consumableSlots];
            else if (a.key === 'hand') {
                [c.card_count, c.card_limit] = [round?.hand.length ?? 0, round?.handLimit ?? 8];
                a.view.setVisible(run.state === 'playing' && (round?.phase === 'selecting' || this.runOver) && !run.openPack);
            } else [c.card_count, c.card_limit] = [this.deckCount(), run.fullDeck.length];
        }
    }

    /**
     * 把 `Run` 的状态同步进左侧面板绑定的 `HudState`，并按当前阶段给面板换色（`ease_background_colour_blind`）。
     *
     * 不在盲注里时，出牌 / 弃牌显示的是 `round_resets` 的基数（原作在回合结束时把 `current_round` 重置成它）。
     * **缺口**：小丑给的 `d_size` / `h_size`（Drunkard 之类）只在 `Round` 里算，这里没带上。
     */
    private syncHud(): void {
        const run = this.run;
        const round = this.round;
        const s = this.hudState;
        const inRound = run.state === 'playing' && round !== null;
        s.dollars = inRound ? round.dollars : run.dollars - this.pendingPayout;
        s.round = run.roundNumber;
        s.round_resets.ante = run.ante;
        const last = this.roundEval?.last;
        s.chips_text = numberFormat(inRound ? round.chips : last?.chips ?? 0);
        s.current_round.hands_left = round ? round.handsLeft : last?.handsLeft ?? 4 + run.vouchers.hands;
        s.current_round.discards_left = round
            ? round.discardsLeft
            : last?.discardsLeft ?? 3 + RED_DECK.config.discards + run.vouchers.discards;

        const hand = s.current_round.current_hand;
        const preview = round && this.selected.size > 0 ? evaluatePokerHand(this.selectedInOrder()) : null;
        const info = preview?.topName ? round!.hands[preview.topName] : null;
        hand.handname_text = preview?.topName ?? '';
        // `common_events.lua:561`：前面带一个空格（`' '..localize('k_lvl')..level`），牌型名与等级之间的间距就是它
        hand.hand_level = info ? ` ${DICTIONARY.k_lvl}${info.level}` : '';
        hand.chip_text = numberFormat(info?.chips ?? 0);
        hand.mult_text = numberFormat(info?.mult ?? 0);

        // `ease_background_colour_blind`：盲注里按盲注换色；选盲注与商店时 `G.GAME.blind` 是空名字的占位，
        // 商店再把 MAIN 换成暗红
        // 结算中：`defeat` 之前还是刚打完那一关的颜色，之后回到默认；商店的暗红要等 Cash Out
        const evalBlind = this.roundEval?.blindHeld ? this.roundEval.last.blindKey : null;
        applyBlindColours(run.state === 'playing' ? run.blindKey : evalBlind);
        if (run.state === 'shop' && !this.roundEval) setColour(C.DYN_UI.MAIN, mixColours(C.RED, C.BLACK, 0.9));
        if (run.openPack) setColour(C.DYN_UI.MAIN, packMainColour(run.openPack.center.kind));

        // 背景：`ease_background_colour_blind` 的后一半，终点变了就从当前值线性缓动 0.6 秒（`ease_value` 的 lerp）
        this.easeBackground(backgroundFor(run.openPack?.center.kind ?? null, run.state === 'playing' ? run.blindKey : evalBlind));
    }

    // ————————————————————————————————————————————————————————————————
    // 背景与 CRT
    // ————————————————————————————————————————————————————————————————

    /** `G.C.BACKGROUND` 的当前值，与正在缓动的那一段 */
    private bg: { now: BackgroundColours; from: BackgroundColours; to: BackgroundColours; t0: number } = (() => {
        const b = backgroundFor(null, null);
        return { now: b, from: b, to: b, t0: -Infinity };
    })();

    private easeBackground(target: BackgroundColours): void {
        const now = this.time.now / 1000;
        const same = (a: BackgroundColours, b: BackgroundColours) =>
            a.contrast === b.contrast && (['C', 'L', 'D'] as const).every((k) => a[k].every((v, i) => v === b[k][i]));
        if (!same(target, this.bg.to)) this.bg = { now: this.bg.now, from: this.bg.now, to: target, t0: now };
        const p = Math.min(1, (now - this.bg.t0) / 0.6);
        const lerp = (a: number, b: number) => a + (b - a) * p;
        const mix = (k: 'C' | 'L' | 'D') => this.bg.from[k].map((v, i) => lerp(v, this.bg.to[k][i]!)) as BackgroundColours['C'];
        this.bg.now = { C: mix('C'), L: mix('L'), D: mix('D'), contrast: lerp(this.bg.from.contrast, this.bg.to.contrast) };
    }

    /**
     * 背景的动态 shader。必须最先 add——它得画在所有东西之下。
     *
     * 它不只是好看：CRT 的亮度校正是按这张明亮背景调的，
     * 纯色底会让 CRT 把白卡推成死白（14 号票记过这条）。
     */
    private setupBackground(): void {
        const bg = this.add.shader(
            {
                name: 'background',
                fragmentSource: BACKGROUND_FRAG,
                vertexSource: BACKGROUND_VERT,
                setupUniforms: (setUniform: (n: string, v: unknown) => void) => {
                    const t = this.time.now / 1000;
                    setUniform('time', t);
                    setUniform('spin_time', t);
                    setUniform('colour_1', this.bg.now.C);
                    setUniform('colour_2', this.bg.now.L);
                    setUniform('colour_3', this.bg.now.D);
                    setUniform('contrast', this.bg.now.contrast);
                    // G.ARGS.spin.amount，game.lua:2494 起手是 0
                    setUniform('spin_amount', 0);
                    // 原作用片元的屏幕像素坐标（`screen_coords`）与 `love_ScreenSize`，
                    // quad 铺满可视区时 `outTexCoord * 画布像素` 与之同义
                    setUniform('uScreenSize', [this.scale.width, this.scale.height]);
                },
            },
            0, 0, 1, 1,
            [],
        );
        bg.setDepth(-1000);
        this.fullscreenQuads.push(bg);
    }

    /** `love.resize` 的结果：窗口变了才重算 */
    private mapping = roomMapping(1, 1);
    /** `update_canvas_juice` 的状态（缓动光标、余振） */
    private readonly juice = makeRoomJuice();

    /** 窗口变了：重算 `TILESCALE` 与房间原点（`G.ROOM_ORIG`），文字按新的缩放重新栅格化 */
    private applyRoomCamera(): void {
        const { width, height } = this.scale;
        this.mapping = roomMapping(width, height);
        this.hudView?.setResolution(this.mapping.pxPerTile / toPx(1));
        this.hudBlindView?.setResolution(this.mapping.pxPerTile / toPx(1));
        this.blindSelectViews?.select.setResolution(this.mapping.pxPerTile / toPx(1));
        this.blindSelectViews?.prompt.setResolution(this.mapping.pxPerTile / toPx(1));
        for (const a of this.areaViews) a.view.setResolution(this.mapping.pxPerTile / toPx(1));
        this.placeRoom({ x: this.mapping.roomX, y: this.mapping.roomY, r: 0 });
    }

    /**
     * 把房间的 `T`（位置与旋转，tile）落到相机上（22 号票）。世界坐标固定 72 像素 / tile（`toPx`）。
     *
     * 原作 `Node:translate_container`（`engine/node.lua:320`）以**屏幕上的** (ROOM.w/2, ROOM.h/2) 为轴旋转，
     * 再平移到房间原点：`屏幕 = P·(R·(局部 + ROOM − c) + c)`，c = (TILE_W/2, TILE_H/2)，P = 每 tile 像素。
     * Phaser 的相机是 `屏幕 = O + R·z·(世界 − scroll − O)`：取 O = P·c、z = P/72，
     * scroll = −72·(ROOM − c) − O 就与之相等（O 在 Phaser 里是按世界单位减的，照它的算法来）。
     *
     * 背景与 CRT 两个全屏 quad 要贴屏：自己反转 −r、摆在屏幕中心对应的世界点、尺寸 = 屏幕 / z。
     */
    private placeRoom(room: { x: number; y: number; r: number }): void {
        const { width, height } = this.scale;
        const P = this.mapping.pxPerTile;
        const z = P / toPx(1);
        const cx = TILE_W / 2;
        const cy = TILE_H / 2;
        const O = { x: P * cx, y: P * cy };
        const cam = this.cameras.main;
        cam.setOrigin(O.x / width, O.y / height);
        cam.setZoom(z);
        cam.setRotation(room.r);
        cam.setScroll(-toPx(room.x - cx) - O.x, -toPx(room.y - cy) - O.y);

        // 屏幕中心 → 世界：world = scroll + O + R⁻¹·(屏幕 − O)/z
        const dx = (width / 2 - O.x) / z;
        const dy = (height / 2 - O.y) / z;
        const cos = Math.cos(-room.r);
        const sin = Math.sin(-room.r);
        const wx = cam.scrollX + O.x + dx * cos - dy * sin;
        const wy = cam.scrollY + O.y + dx * sin + dy * cos;
        for (const quad of this.fullscreenQuads) {
            quad.setPosition(wx, wy).setRotation(-room.r);
            // `setSize` 不刷新 `displayOrigin`：不补这句，quad 仍按创建时 1×1 的原点、从中心往右下画
            quad.setSize(width / z, height / z).updateDisplayOrigin();
        }
    }

    /**
     * CRT 全屏后处理。链路由 14 号票验过：
     * `setForceComposite` → `captureFrame` 到具名纹理 → 全屏 Shader 采样它。
     * 必须在所有内容都 add 完之后调用——`captureFrame` 捕获的是它在显示列表里
     * 之前的东西。
     */
    private setupCrt(): void {
        this.cameras.main.setForceComposite(true);
        // 画布就是物理像素（`main.ts`），与原作「画布 = 屏幕分辨率」一致

        // **depth 很关键。** captureFrame 捕获的是显示列表里排在它之前的东西，
        // 而 Phaser 按 depth 排序——默认 depth 0 会与卡牌底板同级，
        // 于是正面层（depth 1）排在它之后、不被捕获，CRT 下卡牌就只剩白底。
        // 放在所有游戏内容之上、CRT 之下。
        this.add.captureFrame('scene').setDepth(500);

        const crt = this.add.shader(
            {
                name: 'crt',
                fragmentSource: CRT_FRAG,
                vertexSource: CRT_VERT,
                setupUniforms: (setUniform: (n: string, v: unknown) => void) => {
                    // 扫描线密度与色散都按画布像素算（`G.CANVAS:getPixelHeight()`、`love_ScreenSize`）。
                    // 画布曾经只有 1512×806 再被 CSS 放大，线粗一倍多（21 号票在模拟器上并排看出来的）
                    const u = crtUniforms(LOOK.crt, this.scale.width, this.scale.height, this.time.now / 1000);
                    setUniform('uMainSampler', 0);
                    setUniform('distortion_fac', u.distortion_fac);
                    setUniform('scale_fac', u.scale_fac);
                    setUniform('feather_fac', u.feather_fac);
                    setUniform('crt_intensity', u.crt_intensity);
                    setUniform('scanlines', u.scanlines);
                    setUniform('time', u.time);
                    setUniform('uScreenSize', u.uScreenSize);
                },
            },
            0, 0, 1, 1,
            ['scene'],
        );
        crt.setDepth(1000);
        this.fullscreenQuads.push(crt);
    }
}

export const RUN_SCENE_SIZE = { width: CANVAS_W, height: CANVAS_H, cardH: toPx(CARD_H) };
