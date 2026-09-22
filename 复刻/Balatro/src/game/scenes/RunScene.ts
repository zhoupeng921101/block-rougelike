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

import { GameObjects, Scene, Textures, type Types } from 'phaser';

import { BLIND_CENTERS } from '../../core/blinds';
import type { Card } from '../../core/card';
import { makeBase, makeStandardDeck, resetCardCounters } from '../../core/card';
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
import { UIBoxView, UI_FONT_FAMILY, dynaTextsOf, inheritPop } from '../ui-draw';
import type { DynaText } from '../../ui/dynatext';
import { makeRoomJuice, stepRoomJuice } from '../room-juice';
import { Particles } from '../particles';
import type { OpenPack } from '../../core/booster-open';
import type { BoosterKind } from '../../core/boosters';
import { type BackgroundColours, applyBlindColours, backgroundFor, backgroundTarget, packMainColour } from '../../ui/blind-colour';
import { C, type Colour, HEX, applySuitColours, lighten, mixColours, setColour, tickColours } from '../../ui/colours';
import { buyAndUseButton, shopBuyButton, useAndSellButtons } from '../../ui/definitions/card-buttons';
import { type PopupCard, abilityTable, cardHPopup, infoBoxes, tagAbilityTable } from '../../ui/definitions/card-popup';
import { popupGame, popupOfCard, popupOfCenter, popupOfConsumable, popupOfJoker } from '../popup-adapter';
import { type HudState, createHud, makeHudState } from '../../ui/definitions/hud';
import { type AreaCount, cardAreaBox } from '../../ui/definitions/card-area';
import { createButtons } from '../../ui/definitions/buttons';
import { deckPreview, viewDeckLabel } from '../../ui/definitions/deck-preview';
import { MUSIC_KEYS, Music, desiredTrack } from '../music';
import { AttentionText } from '../attention-text';
import { FlameState, flamesIntensity } from '../flames';
import { FLAME_FRAG } from '../shaders/flame';
import { DISSOLVE_VERT } from '../shaders/dissolve';
import { hudFuncs } from '../../ui/definitions/hud-funcs';

/** `localize{type = 'variable', key, vars = {v}}` 的单变量版 */
const locVariable = (key: string, v: number) => (V_DICTIONARY[key] ?? 'ERROR').replace('#1#', String(v));
import { type ViewDeckArea, deckInfo } from '../../ui/definitions/deck-info';
import { type HudBlindState, createHudBlind, makeHudBlindState } from '../../ui/definitions/hud-blind';
import { hudBlindFuncs } from '../../ui/definitions/hud-blind-funcs';
import { type BlindSelectState, type BlindType, type TagSpriteObject, blindChoiceBox, blindChoiceFuncs, cardAlert, currentBlinds, createBlindPrompt, createBlindSelect, hudTag } from '../../ui/definitions/blind-select';
import { mostPlayedHand } from '../../core/round';
import { runModifiers } from '../../core/jokers/modifiers';
import { type EvalRow, type EvalStep, RoundEval, evalTimeline } from '../../ui/definitions/round-eval';
import { BLIND_TEXT, DICTIONARY, V_DICTIONARY } from '../../ui/lang.generated';
import type { Rect, UIElement, UIFuncs, UINodeDef } from '../../ui/uibox';
import { cardAreas } from '../areas';
import { type Placed, alignConsumeable, alignHand, alignJokers, alignPackHand, alignPlay, cardShadowParallaxX } from '../align-cards';
import { type PackCardsObject, createBoosterPack, packCardsArea } from '../../ui/definitions/booster-pack';
import { type CardAreaObject, createShop, createShopSign, priceTag, shopAreas } from '../../ui/definitions/shop';
import { DeckSprite } from '../deck-sprite';
import { numberFormat } from '../../ui/format';
import { UIBox, UIT } from '../../ui/uibox';
import { RED_DECK, WIN_ANTE } from '../../core/run';
import { JokerSprite } from '../joker-sprite';
import { type ExitStyle, type ExitTarget, destroyStyle, playEnter, playExit } from '../card-exit';
import { queueUseConsumable } from '../use-sequence';
import { BACK_POOL, backNameText, backPos, backUi, blindPopup, blindsPage, decksPage, tagsPage } from '../../ui/definitions/collection-misc';
import { type CollectionArea, type CollectionPageSpec, type CollectionTallies, COLLECTION_PAGES, SEAL_POOL, centerPool, collectionPage, overlayInfotip, yourCollection } from '../../ui/definitions/collection';
import { discover, discoverTally, isDiscovered } from '../profile';
import { alignTitle, alignVoucher } from '../align-cards';
import { makeJoker as makeJokerInstance } from '../../core/jokers';
import { makeConsumable as makeConsumableInstance } from '../../core/consumables';
import { P_CENTERS } from '../../ui/descriptions.generated';

import { LOOK } from '../look';
import { SETTINGS, masterGain, saveSettings, wobble } from '../settings';
import { type SettingsHooks, controlFuncs, handleControlButton, optionsMenu, settingsMenu } from '../../ui/definitions/options';
import { type RunSetupState, runSetup, seededRunRow } from '../../ui/definitions/run-setup';
import { TEXT_HOOK, keyboardInput, selectTextInput, textInputFuncs, textInputKey } from '../../ui/definitions/text-input';
import { VoucherSprite } from '../voucher-sprite';
import { BACKGROUND_FRAG, BACKGROUND_VERT } from '../shaders/background';
import { CRT_FRAG, CRT_VERT, crtUniforms } from '../shaders/crt';
import { type GameOverState, createGameOver, createWin } from '../../ui/definitions/game-over';
import { mostPlayedHandUsage } from '../../core/round-scores';
import { Jimbo } from '../jimbo';
import { type Tab, type VoucherArea, changeTab, currentHands, handTip, popupTooltip, runInfo, usedVouchers } from '../../ui/definitions/run-info';
import { HAND_DESCRIPTIONS, HAND_EXAMPLES } from '../../ui/descriptions.generated';
import { MiniCard } from '../mini-card';
import { LOGO_ATLAS, MainMenu, type MenuContext } from '../main-menu';
import { Splash } from '../splash';
import { ScreenWipe, randomCardKey } from '../screen-wipe';

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
/** `update_hand_text` 的 `vals`：数值或字串（Black Hole 的 `...` / `+`），`StatusText` 时在那一格上冒增量 */
type HandTextVals = { chips?: number | string; mult?: number | string; handname?: string; level?: number | string; chip_total?: number; StatusText?: boolean };

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
     * `G.OVERLAY_MENU`：游戏结束 / 胜利界面。从下方 10 tile 弹上来（`UIBoxView.slideFrom`），
     * `bg` 是背景那张颜色表，alpha 由 `ease_value` 0.3 秒线性缓上去；`blocker` 吞掉底下所有点击与悬停
     */
    /** `G.HUD_tags`：手上的标签，右下角往上叠。`run.tags` 变了就整列重建 */
    private hudTags: { list: readonly object[]; views: UIBoxView[] } = { list: [], views: [] };
    private readonly hudTagTargets = new Set<object>();

    /** 这一局输了（`G.STATE = GAME_OVER`）。`Run` 停在那一关不再推进 */
    private runOver = false;
    private overlay: {
        view: UIBoxView;
        bg: Colour;
        alpha: { from: number; to: number; start: number };
        blocker: GameObjects.Zone;
        jimbo: Jimbo | null;
        /** Run Info 的 Vouchers 页：每格里的卡 */
        vouchers: Array<{ sprite: VoucherSprite; area: VoucherArea }>;
        /** View Deck 当前页：每个花色行里的复制品 */
        deckCards: Array<{ card: MiniCard; area: ViewDeckArea; index: number }>;
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
    /** 牌堆最上面那张的悬停区（`G.deck.cards[1].states.collide`） */
    private deckZone!: GameObjects.Zone;
    private deckHovered = false;
    private blindChipZone!: GameObjects.Zone;

    private hudBlindChip(): UIElement | undefined {
        return [...this.hudBlindView.box.root.walk()].find((e) => (e.config.object as { kind?: string } | undefined)?.kind === 'blind');
    }
    /** `G.deck_preview`：选牌时悬停牌堆弹出的剩余牌表 */
    private deckPreview: UIBoxView | null = null;
    /** 牌堆上的「View Deck」：悬停牌堆时画 */
    private viewDeckLabel: { view: UIBoxView; major: { T: Rect } } | null = null;
    /** 已经打到出牌区的牌（`G.play`），逐帧按 `alignPlay` 摆；其余手牌按 `alignHand` */
    private readonly inPlay = new Set<CardSprite>();
    private readonly areas = cardAreas();
    private areaViews: Array<{ view: UIBoxView; count: AreaCount; key: 'jokers' | 'consumeables' | 'hand' | 'deck' }> = [];
    /** 背景与 CRT：铺满可视区，窗口变了跟着相机重摆（`applyRoomCamera`） */
    private readonly fullscreenQuads: GameObjects.Shader[] = [];
    /** 背景那张 `background` shader（主菜单时藏起来，换成 `splash`） */
    private bgQuad: GameObjects.Shader | null = null;
    /** 主菜单（`G.STAGE == MAIN_MENU`）：URL 上没有 `?seed` 时进这里，局里的东西全藏着 */
    private mainMenu: MainMenu | null = null;
    /** 转场（`G.screenwipe`）：开着时吞掉一切输入（`CONTROLLER.locks.wipe`） */
    private wipe: { wipe: ScreenWipe; blocker: GameObjects.Zone } | null = null;
    /** 开机 splash（`Game:splash_screen`）：直接打开页面时先走这段，走完进主菜单 */
    private splash: Splash | null = null;
    /** 正在播放出牌动画时不接受输入 */
    private animating = false;
    /** 计分过程中的实时累加器，只用于显示 */

    private hud!: GameObjects.Text;
    private handPreview!: GameObjects.Text;
    private message!: GameObjects.Text;
    private jokerInfo!: GameObjects.Text;
    private nextBtn!: GameObjects.Text;
    private rerollBtn!: GameObjects.Text;
    /** 盲注选择界面上的「跳过盲注」（调试按钮；卡片上的 Skip Blind 接管之后只在标签开包时露出来） */
    private skipBlindBtn!: GameObjects.Text;

    constructor(key = 'Run') {
        super(key);
    }

    /** 换局时交给下一个场景实例的东西（音乐接着放，不断） */
    private static carry: { music: Music } | null = null;
    private static serial = 0;

    private get round(): Round | null {
        return this.run.round;
    }

    preload(): void {
        this.load.font(UI_FONT_FAMILY, '/assets/fonts/m6x11plus.ttf');
        // `game.lua:996`：赌注筹码，29×29 一格
        this.load.spritesheet('chips', '/assets/textures/chips.png', { frameWidth: 29, frameHeight: 29 });
        // `game.lua:991`：主菜单的 BALATRO 标志，一整张 333×216
        this.load.spritesheet(LOGO_ATLAS.key, `/${LOGO_ATLAS.path}`, { frameWidth: LOGO_ATLAS.frameW, frameHeight: LOGO_ATLAS.frameH });
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
        // 高对比度牌面（`cards_2`）与设置里开关的勾（`icons`，66 像素一格）
        this.load.spritesheet('cards_2', '/assets/textures/8BitDeck_opt2.png', { frameWidth: 71, frameHeight: 95 });
        this.load.spritesheet('icons', '/assets/textures/icons.png', { frameWidth: 66, frameHeight: 66 });
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
            'negative', 'whoosh2', 'win', 'whoosh1', 'paper1', 'tarot2', 'multhit2', 'cardFan2', 'foil2',
            ...Array.from({ length: 11 }, (_, i) => `voice${i + 1}`),
            ...Array.from({ length: 5 }, (_, i) => `crumple${i + 1}`),
            // 玻璃牌碎掉（`Card:shatter`）
            ...Array.from({ length: 6 }, (_, i) => `glass${i + 1}`),
            // 版本（`set_edition`）、蜡封、造牌 / 给钱的定音鼓
            'foil1', 'holo1', 'polychrome1', 'timpani', 'gold_seal',
            // 主菜单标志溶出来（`magic_crumple3`）；开机 splash 的几声
            'magic_crumple3', 'magic_crumple2', 'magic_crumple', 'introPad1', 'splash_buildup', 'whoosh_long',
        ]) {
            this.load.audio(key, `/assets/sounds/${key}.ogg`);
        }
    }

    /** 背景音乐与管风琴（`modulate_sound`）。音乐 14M，场景起来之后再后台加载 */
    private music!: Music;
    /** 关包后粒子还在淡出（`booster_pack_sparkles` 没 `REMOVED`）：那一包的种类与到期时刻 */
    private packFade: { kind: string; until: number } | null = null;

    create(data?: { wipe?: string }): void {
        const seed = new URLSearchParams(location.search).get('seed') ?? 'ALEEB';

        resetCardCounters();
        this.run = new Run(seed, makeStandardDeck());
        // `G.GAME.seeded`：种子是玩家给的（URL 上带 `?seed=`，且不是 New Run 随机出来的 `rs`）
        this.seeded = new URLSearchParams(location.search).has('seed') && !new URLSearchParams(location.search).has('rs');
        this.applySettings();

        this.setupBackground();

        // `game.lua:2613`：`G.HUD = UIBox{definition = create_UIBox_HUD(), config = {align='cli', offset={x=-0.7,y=0}, major=G.ROOM_ATTACH}}`
        this.hudState = makeHudState();
        const hudBox = new UIBox(createHud(this.hudState), {
            align: 'cli',
            offset: { x: -0.7, y: 0 },
            major: { T: { x: 0, y: 0, w: TILE_W, h: TILE_H } },
        }, hudFuncs(this.hudState));
        // 左侧面板上的按钮：Run Info / Options 打开 overlay
        this.hudView = new UIBoxView(this, hudBox, 40, (name) => {
            if (name === 'run_info') this.openRunInfo();
            else if (name === 'options') this.openOptions();
        });
        // 钩住文本框时，键盘直接往里敲（`love.textinput` / `keypressed` → `text_input_key`）
        this.input.keyboard?.on('keydown', (ev: KeyboardEvent) => {
            if (!TEXT_HOOK.el) return;
            const key = ev.key === 'Backspace' ? 'backspace' : ev.key === 'Enter' ? 'return' : ev.key;
            if (textInputKey(key) === 'release') this.releaseTextInput();
        });

        // `game.lua:2617`：`G.HUD_blind = UIBox{definition = create_UIBox_HUD_blind(), config = {major = row_blind, align = 'cm'}}`
        const row = hudBox.getById('row_blind')!;
        this.hudBlindState = makeHudBlindState();
        this.hudBlindView = new UIBoxView(this, new UIBox(
            createHudBlind(this.hudBlindState),
            { align: 'cm', offset: { x: 0, y: 0 }, major: { T: { x: row.x, y: row.y, w: row.T.w, h: row.T.h } } },
            hudBlindFuncs(this.hudBlindState),
        ), 41);
        this.deckSprite = new DeckSprite(this);
        this.music = RunScene.carry?.music.rebind(this) ?? new Music(this);
        RunScene.carry = null;
        for (const key of [...MUSIC_KEYS, 'ambientOrgan1', 'ambientFire1', 'ambientFire2', 'ambientFire3']) this.load.audio(key, `/assets/sounds/${key}.ogg`);
        this.createFlames();
        this.load.start();
        this.deckZone = this.add.zone(0, 0, 1, 1).setOrigin(0, 0).setInteractive().setDepth(6);
        this.deckZone.on('pointerover', () => { this.deckHovered = true; });
        this.deckZone.on('pointerout', () => { this.deckHovered = false; });
        // `Card:click`：点牌堆最上面那张 → `G.FUNCS.deck_info`
        this.deckZone.on('pointerdown', () => this.openDeckInfo());
        // `Blind:hover`（`blind.lua:428`）：左上盲注筹码悬停只弹一下、响一声（没有提示框）
        this.blindChipZone = this.add.zone(0, 0, 1, 1).setOrigin(0, 0).setInteractive().setDepth(43);
        this.blindChipZone.on('pointerover', () => {
            const el = this.hudBlindChip();
            if (!el || !this.hudBlindView.container.visible || !(el.config.object as { key?: string }).key) return;
            this.hudBlindView.juiceObject(el.config.object!, this.time.now / 1000, 0.05, 0.02);
            this.sound.play('chips1', { rate: Math.random() * 0.1 + 0.55, volume: 0.12 });
        });

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

        const params = new URLSearchParams(location.search);
        // 上一个场景实例放完 `wipe_on` 换过来的：接着放 `wipe_off`
        const wipeKey = data?.wipe;
        if (wipeKey) {
            // 从主菜单进局：`G.C.BACKGROUND` 在主菜单是黑的，`start_run` 再缓到盲注色——方块的颜色跟着变
            if (params.has('seed')) {
                const black = backgroundTarget({ new_colour: C.BLACK, contrast: 1 });
                this.bg = { now: black, from: black, to: black, t0: -Infinity };
            }
            this.startWipe('off', wipeKey);
        }
        if (params.has('seed')) {
            // 开局先进盲注选择（原作如此）：能看到这一格跳过给什么标签，再决定打还是跳
            this.showBlindSelect();
        } else {
            this.hideRun();
            if (params.get('menu') === 'game') this.enterMainMenu('game');
            else this.startSplash();
        }
        this.setupCrt();
        this.applyRoomCamera();
        const onResize = () => this.applyRoomCamera();
        this.scale.on('resize', onResize);
        // 换局时整个场景实例被拆掉：挂在全局 ScaleManager 上的监听要一起摘
        this.events.once('destroy', () => this.scale.off('resize', onResize));
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
        this.retireBlindSelect();
        // `Blind:set_blind`（`blind.lua:126`）：左上盲注面板 offset −10 → 0，从上面落下来
        this.hudBlindView.slideFrom(-10);
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
        // `reroll_boss`（`button_callbacks.lua:2910`）：只换 Boss 那张卡，别的卡不动。旧卡 offset 改到 20 滑下去；
        // 0.3 秒后拆掉、按新 Boss 重建塞回原来的 O 节点，offset `ROOM.T.y+9` → 0 从下面滑上来。
        // 整个过程 `locks.boss_reroll` 锁住输入，新卡放进去 0.5 秒后才解
        const b = this.blindSelectState;
        const views = this.blindSelectViews;
        const old = b?.opts.Boss;
        const el = old && [...b.select.root.walk()].find((e) => e.config.object === old);
        if (!b || !views || !el || !old) {
            this.showBlindSelect();
            return;
        }
        this.bossRerollLock = true;
        views.select.childView(old)?.slideTo(20);
        this.time.delayedCall(300, () => {
            if (this.blindSelectState !== b) {
                this.bossRerollLock = false;
                return;
            }
            b.state.choices.Boss = this.run.bossKey;
            const box = blindChoiceBox('Boss', b.state, b.loc, b.funcs);
            b.opts.Boss = box;
            b.select.replaceObject(el, box);
            views.select.childView(box)?.slideFrom(9);
            // 重掷之后会再轮一次 `new_blind_choice`，标签可能开出一个包
            this.showBlindSelect(false);
            this.time.delayedCall(500, () => { this.bossRerollLock = false; });
        });
    }

    /** `G.CONTROLLER.locks.boss_reroll`：重掷 Boss 的动画期间不接受点击 */
    private bossRerollLock = false;

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
            this.retireShop();
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
        // `state_events.lua:144`：打过的盲注记进图鉴
        discover(blindKey, this.seeded);
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
        this.destroyUnlessExiting(this.sprites);
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
        // `G.round_eval`：offset `ROOM.T.y+19` → −7.8，从下面滑上来
        const view = new UIBoxView(this, ev.box, 30, onButton).slideFrom(26.8);
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
                state.cashView = new UIBoxView(this, state.ev.cashOut!, 31, (name) => this.onUIButton(name)).followSlide(state.view);
                state.cashView.setResolution(this.mapping.pxPerTile / toPx(1));
                break;
            }
        }
    }

    /** `G.FUNCS.cash_out`：入账、拆掉结算面板、进商店 */
    private cashOut(): void {
        const state = this.roundEval;
        if (!state?.cashView) return;
        // `cash_out`（`button_callbacks.lua:3026`）：结算面板滑到 `ROOM.T.y+15`（Cash Out 按钮跟着），滑走后才拆
        state.view.slideTo(22.8);
        this.retire([state.view, state.cashView]);
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
        for (const s of this.jokerSprites) {
            if (this.run.jokers.includes(s.joker)) s.destroy();
            else this.exitCard(s, this.vanishedJokerStyle(s.joker));
        }
        this.jokerSprites = this.run.jokers.filter((j) => !this.hiddenJokers.has(j)).map((j) => {
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

    /** 卖掉 / 用掉的卡由调用方先登记退场方式；没登记的在 `vanishedJokerStyle` 里按来路推断 */
    private readonly pendingExit = new WeakMap<object, ExitStyle>();

    /**
     * 从小丑区消失的小丑怎么退场：
     * 卖掉 `start_dissolve({GOLD})`（`card.lua:1611`，调用方登记）；Madness / Ceremonial Dagger 切掉的
     * `start_dissolve({RED} / {57ecab}, nil, 1.6)`；Mr. Bones 救命后 `start_dissolve()`；
     * 剩下的都是吃完 / 灭绝（Gros Michel、Popcorn、Ice Cream……）——歪一下、捏扁
     */
    private vanishedJokerStyle(j: Joker): ExitStyle {
        const registered = this.pendingExit.get(j);
        if (registered) return registered;
        if (j.sliced_by === 'Madness') return { kind: 'dissolve', colours: [C.RED], timeFac: 1.6 };
        if (j.sliced_by === 'Ceremonial Dagger') return { kind: 'dissolve', colours: [HEX('57ecab')], timeFac: 1.6 };
        if (j.ability.name === 'Mr. Bones') return { kind: 'dissolve' };
        return { kind: 'eaten' };
    }

    /**
     * 消耗品毁掉的手牌（The Hanged Man / Immolate / Familiar / Grim / Incantation，`card.lua:1284` 起）：
     * 玻璃牌 `shatter()`、别的 `start_dissolve(nil, silent)`。`silent` 照各分支原文——
     * Familiar 那一族是 `i ~= #destroyed`（只有一张，出声），其余是 `i == #highlighted`（倒序遍历里第一张不出声）
     */
    private exitDestroyedHand(old: CardSprite[], consumableName: string): void {
        const gone = old.filter((s) => !this.run.fullDeck.includes(s.card));
        const familiar = ['Familiar', 'Grim', 'Incantation'].includes(consumableName);
        gone.forEach((s, i) => {
            const silent = familiar ? i !== gone.length - 1 : i === gone.length - 1;
            this.exitCard(s, destroyStyle(s.card.enhancement, silent), () => this.dropHandSprite(s));
        });
    }

    /** Ankh / Hex 毁掉的小丑：`start_dissolve(nil, _first_dissolve)`——第一张出声，之后的静音（`card.lua:1440` / `:1492`） */
    private registerDestroyedJokers(before: Joker[]): void {
        before.filter((j) => !this.run.jokers.includes(j))
            .forEach((j, i) => this.pendingExit.set(j, { kind: 'dissolve', silent: i > 0 }));
    }

    /** 选中小丑后按 SELL（`sell_card`）。能不能卖由按钮的 `can_sell_card` 管：出牌结算中不行 */
    private onJokerClick(joker: Joker): void {
        if (this.animating) return;
        const index = this.run.jokers.indexOf(joker);
        if (index < 0) return;
        this.pendingExit.set(joker, { kind: 'dissolve', colours: [C.GOLD] });
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
        for (const s of this.consumableSprites) {
            if (this.run.consumables.includes(s.consumable)) s.destroy();
            // 没登记的就是用掉了：`use_card` 里 `card:start_dissolve()`（`button_callbacks.lua:2370`）
            else this.exitCard(s, this.pendingExit.get(s.consumable) ?? { kind: 'dissolve' });
        }
        this.consumableSprites = this.run.consumables.filter((c) => !this.hiddenConsumables.includes(c)).map((c) => {
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

        const snap = this.useSnapshot();
        this.run.useConsumable(index, highlighted);
        const used = this.consumableSprites.find((s) => s.consumable === consumable);
        // 用的那张离开消耗品区（`area:remove_card`），交给 `playUse` 飞走、溶掉
        this.consumableSprites = this.consumableSprites.filter((s) => s !== used);
        if (this.picked?.where.kind === 'consumable') this.unpick();
        this.playUse(used, consumable, snap);
    }

    /** 用消耗品之前记下表现要用的「之前」：选中的牌（按选中顺序）、各牌型的值、小丑区 */
    private useSnapshot() {
        const hands: Record<string, { chips: number; mult: number; level: number }> = {};
        for (const [k, h] of Object.entries(this.run.hands)) hands[k] = { chips: h.chips, mult: h.mult, level: h.level };
        const round = this.round;
        return {
            highlighted: [...this.selected],
            hands,
            jokers: [...this.run.jokers],
            jokerEditions: new Map(this.run.jokers.map((j) => [j, j.edition] as const)),
            consumables: [...this.run.consumables],
            handCards: [...(this.run.packHand ?? round?.hand ?? [])],
            dollars: round && this.run.state === 'playing' ? round.dollars : this.run.dollars - this.pendingPayout,
            // 包的种类要在用之前记：只剩一次选择的包，逻辑层用完当场就关了
            packKind: this.run.openPack?.center.kind,
        };
    }

    /** 用消耗品期间还没演到的结果：新造的小丑 / 消耗品（按造的顺序）/ 手牌，与逻辑层已经改掉、还没 `ease_dollars` 的金额 */
    private hiddenJokers = new Set<Joker>();
    private hiddenConsumables: Consumable[] = [];
    private hiddenCards = new Set<Card>();
    private heldDollars = 0;

    /** `set_edition` 的那一声（`card.lua:439`） */
    private editionSound(edition: string | undefined): void {
        if (edition === 'foil') this.sound.play('foil1', { rate: 1.2, volume: 0.4 });
        if (edition === 'holo') this.sound.play('holo1', { rate: 1.2 * 1.58, volume: 0.4 });
        if (edition === 'polychrome') this.sound.play('polychrome1', { rate: 1.2, volume: 0.7 });
        if (edition === 'negative') this.sound.play('negative', { rate: 1.5, volume: 0.4 });
    }

    /** 飞在半路 / 停在出牌区的那张（`use_card` 的 `draw_card(G.hand, G.play)`），每帧摆 */
    private usingCard: { sprite: ConsumableSprite; inPack: boolean } | null = null;

    private placeUsing(real: number): void {
        const u = this.usingCard;
        if (!u) return;
        if (u.inPack) {
            // 开包时：`T` 直接设到手牌区中间偏上 0.5
            const h = this.areas.hand;
            u.sprite.place({ x: h.x + h.w / 2 - CARD_W / 2, y: h.y + h.h / 2 - CARD_H / 2 - 0.5, r: 0 }, 30);
        } else {
            const p = alignPlay(this.areas.play, [{ highlighted: false, prevX: u.sprite.prevX }], 5)[0]!;
            u.sprite.place(p, 30);
        }
        void real;
    }

    /**
     * `G.FUNCS.use_card` 的表现：商店 / 开包界面让开（`offset.y = ROOM.T.y + 29`），用的那张飞到出牌区，
     * `delay(0.2)`，`use_consumeable` 的那一段（`use-sequence.ts`），0.2 秒后溶掉，再 0.1 秒收尾：界面回来、放开输入、刷新各区
     */
    private playUse(used: ConsumableSprite | undefined, consumable: Consumable, snap: ReturnType<RunScene['useSnapshot']>, onDone?: () => void): void {
        this.animating = true;
        this.tarotInterrupt = true;
        discover(consumable.key, this.seeded); // `misc_functions.lua:1217`：用过的消耗品
        this.hidePopup();
        // `G.STATE` 是奥秘 / 天体 / 幽灵包时停在手牌区上方，否则进出牌区
        const inPack = ['Arcana', 'Celestial', 'Spectral'].includes(snap.packKind ?? '');
        if (used) this.usingCard = { sprite: used, inPack };
        const shop = this.shopUi;
        shop?.view.slideTo(34.3);
        const pack = this.packUi;
        pack?.view.slideTo(31.2);

        const handList = () => (this.run.packHand ? this.packHandSprites : this.sprites);
        const highlighted = snap.highlighted
            .map((c) => handList().find((s) => s.card === c))
            .filter((s): s is CardSprite => !!s);
        const handsAfter: Record<string, { chips: number; mult: number; level: number }> = {};
        for (const [k, h] of Object.entries(this.run.hands)) handsAfter[k] = { chips: h.chips, mult: h.mult, level: h.level };
        this.registerDestroyedJokers(snap.jokers);

        // 新造的先藏着、金额先按用之前的显示，到点再揭开
        const logicalHand = () => this.run.packHand ?? this.round?.hand ?? [];
        this.hiddenJokers = new Set(this.run.jokers.filter((j) => !snap.jokers.includes(j)));
        this.hiddenConsumables = this.run.consumables.filter((c) => !snap.consumables.includes(c));
        this.hiddenCards = new Set(logicalHand().filter((c) => !snap.handCards.includes(c)));
        const nowDollars = this.round && this.run.state === 'playing' ? this.round.dollars : this.run.dollars - this.pendingPayout;
        this.heldDollars = nowDollars - snap.dollars;
        const handCards = handList().slice();
        const entered = { jokers: false, hand: false };
        const usedRect = () => used?.rect ?? { x: 0, y: 0, w: CARD_W, h: CARD_H };

        this.delayEvent(0.2);
        queueUseConsumable({
            queue: this.queue,
            sound: (key, rate = 1, volume = 1) => this.sound.play(key, { rate, volume }),
            delay: (t) => this.delayEvent(t),
            updateHandText: (config, vals) => this.updateHandText(config, vals),
            juiceUsed: (a, r) => used?.juiceUp(a, r),
            setPulse: (on) => { this.hudState.tarot_interrupt_pulse = on; },
            highlighted,
            refreshCard: (card) => {
                const list = handList();
                const i = list.findIndex((s) => s.card === card);
                if (i < 0) return;
                const old = list[i]!;
                const fresh = new CardSprite(this, card, (c) => (this.run.packHand ? this.togglePackHand(c) : this.toggle(c)));
                this.attachPopup(fresh.hoverTargets, fresh, () => popupOfCard(card, this.run.packHand ? 'pack' : 'hand'));
                fresh.adoptMotion(old);
                fresh.place({ x: old.rect.x, y: old.rect.y, r: 0 }, i);
                fresh.adoptFacing(old);
                list[i] = fresh;
                const h = highlighted.indexOf(old);
                if (h >= 0) highlighted[h] = fresh;
                const hc = handCards.indexOf(old);
                if (hc >= 0) handCards[hc] = fresh;
                old.destroy();
            },
            unhighlightAll: () => this.selected.clear(),
            destroyCards: () => this.exitDestroyedHand([...this.sprites, ...this.packHandSprites], consumable.center.name),
            handsBefore: snap.hands,
            handsAfter,
            handCards,
            revealJokers: (opts = {}) => {
                const fresh = [...this.hiddenJokers];
                if (!opts.keepNew) this.hiddenJokers.clear();
                this.rebuildJokers();
                if (opts.materialize && !opts.keepNew) {
                    entered.jokers = true;
                    for (const j of fresh) {
                        const sp = this.jokerSprites.find((x) => x.joker === j);
                        if (sp) playEnter(this, sp, [C.RARITY[(j.center.rarity ?? 1) - 1] ?? C.RARITY[0]!]);
                    }
                }
            },
            revealConsumable: () => {
                this.hiddenConsumables.shift();
                this.rebuildConsumables();
            },
            hiddenConsumables: () => this.hiddenConsumables.length,
            revealHand: (colours) => {
                // 不整体重建：只把新牌的精灵插进它在逻辑层里的位置，原地溶进来（`create_playing_card` / `copy_card` + `emplace`）
                const list = handList();
                let first = true;
                for (const card of logicalHand()) {
                    if (!this.hiddenCards.has(card)) continue;
                    this.hiddenCards.delete(card);
                    const sp = this.handSprite(card, [], (c) => (this.run.packHand ? this.togglePackHand(c) : this.toggle(c)));
                    sp.spawnFrom = null;
                    const at = logicalHand().filter((c) => !this.hiddenCards.has(c)).indexOf(card);
                    list.splice(Math.min(at, list.length), 0, sp);
                    playEnter(this, sp, colours === 'spectral' ? [C.SECONDARY_SET.Spectral] : [C.GREEN], !first);
                    first = false;
                }
                entered.hand = true;
            },
            releaseDollars: () => {
                if (this.heldDollars !== 0) this.sound.play('coin1', { volume: 0.8 });
                this.heldDollars = 0;
            },
            jokerEditionChanged: () => {
                const changed = this.run.jokers.find((j) => snap.jokerEditions.has(j) && snap.jokerEditions.get(j) !== j.edition);
                // Hex 溶掉的别的小丑也在这一拍
                this.rebuildJokers();
                if (!changed) return false;
                const sp = this.jokerSprites.find((x) => x.joker === changed);
                sp?.juiceUp(1, 0.5);
                this.editionSound(changed.edition);
                return true;
            },
            cardEditionPop: (card) => {
                handList().find((x) => x.card === card)?.juiceUp(1, 0.5);
                this.editionSound(card.edition);
            },
            sealPop: (card) => {
                handList().find((x) => x.card === card)?.juiceUp(0.3, 0.3);
                this.sound.play('gold_seal', { rate: 1.2, volume: 0.4 });
            },
            nope: () => {
                // `attention_text{text = 'Nope!', scale = 1.3, hold = 1.4, backdrop_colour = Tarot}`，两声 `tarot2`
                const tall = snap.packKind === 'Arcana' || snap.packKind === 'Spectral';
                this.attentionTexts.push(new AttentionText(this, {
                    text: DICTIONARY.k_nope_ex ?? 'Nope!', scale: 1.3, hold: 1.4, major: usedRect,
                    backdropColour: C.SECONDARY_SET.Tarot, align: tall ? 'tm' : 'cm', offset: { x: 0, y: tall ? -0.2 : 0 },
                }, this.mapping.pxPerTile / toPx(1), 60));
                this.sound.play('tarot2', { rate: 1, volume: 0.4 });
                this.time.delayedCall(60, () => this.sound.play('tarot2', { rate: 0.76, volume: 0.4 }));
                used?.juiceUp(0.3, 0.5);
            },
        }, consumable);
        this.queue.add(new GameEvent({ trigger: 'after', delay: 0.2, func: () => {
            if (used) {
                this.usingCard = null;
                this.exitCard(used, { kind: 'dissolve' });
            }
            return true;
        } }));
        this.queue.add(new GameEvent({ trigger: 'after', delay: 0.1, func: () => {
            this.tarotInterrupt = false;
            this.hudState.tarot_interrupt_pulse = false;
            this.animating = false;
            this.selected.clear();
            this.hiddenJokers.clear();
            this.hiddenConsumables = [];
            this.hiddenCards.clear();
            this.heldDollars = 0;
            if (shop && this.shopUi === shop) shop.view.slideTo(0);
            if (pack && this.packUi === pack && this.run.openPack) pack.view.slideTo(0);
            // 兜底：还没演到的结果在这里一次性刷出来。刚溶进来的区不重建（重建会把溶入动画截掉）
            if (!entered.hand) this.rebuildHand();
            if (onDone) onDone();
            else {
                if (this.run.openPack && !entered.hand) this.rebuildPackCards();
                if (!entered.jokers) this.rebuildJokers();
                this.rebuildConsumables();
                this.refresh();
            }
            return true;
        } }));
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

    /**
     * 离场中的界面：原作把 offset 改到屏幕外、等它滑走再 `remove()`。复刻件把视图（与跟着它的卡）交给这里，
     * 每帧推进，滑到位或 1.5 秒后销毁。`step` 返回 true 表示可以销毁了
     */
    private retiring: Array<{ step: (now: number) => boolean; destroy: () => void; start: number; maxAge: number }> = [];

    /** `maxAge`：原作到点就 `remove()` 的（关包 0.2 秒），不等滑完 */
    private retire(views: UIBoxView[], extra: { step?: (now: number) => void; destroy?: () => void; maxAge?: number } = {}): void {
        this.retiring.push({
            start: this.time.now / 1000,
            maxAge: extra.maxAge ?? 1.5,
            step: (now) => {
                for (const v of views) v.update(now);
                extra.step?.(now);
                return views.every((v) => v.settled);
            },
            destroy: () => {
                for (const v of views) v.destroy();
                extra.destroy?.();
            },
        });
    }

    private stepRetiring(now: number): void {
        this.retiring = this.retiring.filter((r) => {
            if (!r.step(now) && now - r.start < r.maxAge) return true;
            r.destroy();
            return false;
        });
    }

    /**
     * 离开商店（`toggle_shop`，`button_callbacks.lua:2601`）：外框滑到 `ROOM.T.y+29`、招牌升到 −15，货架上的卡跟着外框走，
     * 滑出去之后才销毁。复刻件的 `clearShop` 会立即拆，所以先把这些对象从场景的字段里摘出来交给 `retire`
     */
    private retireShop(): void {
        const ui = this.shopUi;
        if (!ui) return;
        const slots = this.shopSlots;
        const jokerMax = this.run.shop?.jokerMax ?? 2;
        const owned: Array<{ destroy(): void }> = [
            ...ui.tags, ...this.shopSprites, ...this.packSprites, ...this.shopConsumableSprites, ...this.voucherSprites, ...this.shopCardSprites, ...this.shopLabels,
        ];
        for (const t of ui.tags) t.followSlide(ui.view);
        this.shopUi = null;
        this.shopSprites = [];
        this.packSprites = [];
        this.shopConsumableSprites = [];
        this.voucherSprites = [];
        this.shopCardSprites = [];
        this.shopLabels = [];
        this.shopSlots = [];
        this.hidePopup();
        this.unpick();
        ui.view.slideTo(34.3);
        ui.sign.slideTo(-15);
        this.retire([ui.view, ui.sign], {
            step: (now) => {
                this.placeShopSlots(slots, jokerMax, ui.view.slideOffset.y);
                for (const t of ui.tags) t.update(now);
            },
            destroy: () => { for (const o of owned) o.destroy(); },
        });
        this.shopShownFor = null;
        this.signShownFor = null;
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
        if (!this.run.openPack) this.retirePack();
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
    /** 开包界面上一次对应的包与滑动位置（挑牌重建时不重滑） */
    private packShownFor: object | null = null;
    private packSlide = 0;
    private packTexts: DynaText[] = [];

    /** 为哪一版选盲注界面收起过（开包时收、关包后还原） */
    private blindSelectCollapsed: UIBoxView | null = null;

    /**
     * 标签在选盲注时开了包（`use_card`，`button_callbacks.lua:2306`）：`G.blind_select` 的 offset 记进 `py`、改成 `ROOM.T.y+39` 滑下去；
     * 关包（`end_consumeable`，`:2709`）等外框滑走、手牌收回（0.2 + 0.2 秒）后还原。左侧提示框不动
     */
    private collapseBlindSelect(open: boolean): void {
        const views = this.blindSelectViews;
        if (!views) {
            this.blindSelectCollapsed = null;
            return;
        }
        const select = views.select;
        if (open && this.blindSelectCollapsed !== select) {
            select.slideTo(39 - (select.box.config.offset?.y ?? 0));
            this.blindSelectCollapsed = select;
        } else if (!open && this.blindSelectCollapsed === select) {
            this.blindSelectCollapsed = null;
            this.time.delayedCall(400, () => { if (this.blindSelectViews?.select === select && !this.run.openPack) select.slideTo(0); });
        }
    }

    private rebuildPackCards(): void {
        this.packSlide = this.packUi?.view.slideOffset.y ?? 0;
        // 发下来的手牌接着上一版精灵的缓动走（挑牌 / 用塔罗之后整个重建）
        const oldPackHand = this.packHandSprites;
        this.packHandSprites = [];
        const pack = this.run.openPack;
        if (!pack) this.retirePack();
        this.clearPackCards();
        this.collapseBlindSelect(!!pack);
        // `end_consumeable`：粒子淡出 1 秒后移除
        if (this.packFx && this.packFx.pack !== pack) {
            for (const p of this.packFx.systems) p.fadeOutAndRemove(1);
            // 小丑包没有粒子，音乐只跟着外框（0.2 秒后拆）；别的包跟着粒子淡出 1 秒
            const kind = this.packFx.pack.center.kind;
            this.packFade = { kind, until: this.time.now / 1000 + (kind === 'Buffoon' ? 0.2 : 1) };
            this.packFx = null;
        }
        if (!pack) {
            this.destroyUnlessExiting(oldPackHand);
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
        const texts = dynaTextsOf(box);
        if (this.packShownFor === pack) inheritPop(this.packTexts, texts);
        this.packTexts = texts;
        const view = new UIBoxView(this, box, 0.5, (name) => this.onUIButton(name));
        view.setResolution(this.mapping.pxPerTile / toPx(1));
        // 新开的包从下面滑上来（offset `ROOM.T.y+9` → −2.2）；挑牌重建时接着上一版的位置
        view.slideFrom(this.packShownFor === pack ? this.packSlide : 11.2);
        this.packShownFor = pack;
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
        this.packHandSprites = (this.run.packHand ?? []).filter((c) => !this.hiddenCards.has(c)).map((c) => {
            const sprite = this.handSprite(c, oldPackHand, (card) => this.togglePackHand(card));
            if (sprite.spawnFrom) sprite.holdUntil = this.time.now / 1000 + 0.1 * drawn++;
            return sprite;
        });
        this.destroyUnlessExiting(oldPackHand);
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
        this.placePackCards(this.packUi, this.packCardSprites, this.packLabels, real);
        const hand = this.packHandSprites;
        for (const s of hand) s.highlighted = this.selected.has(s.card);
        alignPackHand(this.areas.hand, hand.map((s) => ({ highlighted: s.highlighted, prevX: s.prevX })), this.run.packHand?.length ?? 0, real)
            .forEach((p, i) => hand[i]!.place(p, i));
    }

    private placePackCards(ui: NonNullable<RunScene['packUi']>, sprites: RunScene['packCardSprites'], labels: GameObjects.Text[], real: number): void {
        const U = toPx(1);
        const size = (s: JokerSprite | ConsumableSprite | CardSprite) =>
            s instanceof CardSprite ? { w: CARD_W, h: CARD_H } : { w: s.w / U, h: s.h / U };
        let label = 0;
        alignConsumeable({ ...ui.rect, y: ui.rect.y + ui.view.slideOffset.y }, sprites.map((s) => ({ highlighted: s.highlighted, prevX: s.prevX, ...size(s) })), real)
            .forEach((p, i) => {
                const s = sprites[i]!;
                s.place(p, i);
                if (s instanceof CardSprite) labels[label++]?.setPosition(toPx(p.x), toPx(p.y + CARD_H + 0.1));
            });
    }

    /**
     * 关包（`end_consumeable`，`button_callbacks.lua:2682`）：外框 offset 改到 `ROOM.T.y+9` 往下滑，
     * 0.2 秒后连同没挑走的牌一起拆
     */
    private retirePack(): void {
        const ui = this.packUi;
        if (!ui) return;
        const sprites = this.packCardSprites;
        const labels = this.packLabels;
        this.packUi = null;
        this.packCardSprites = [];
        this.packLabels = [];
        this.hidePopup();
        if (this.picked?.where.kind === 'pack') this.unpick();
        ui.view.slideTo(11.2);
        this.retire([ui.view], {
            maxAge: 0.2,
            step: (now) => this.placePackCards(ui, sprites, labels, now),
            destroy: () => { for (const o of [...sprites, ...labels]) o.destroy(); },
        });
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
        const snap = this.useSnapshot();
        const sprite = card.kind === 'consumable' ? this.packCardSprites[index] : undefined;
        this.run.takeFromPack(index, highlighted);
        const refresh = () => {
            this.rebuildJokers();
            this.rebuildConsumables();
            if (!this.run.openPack) this.rebuildShop();
            this.rebuildPackCards();
            this.refresh();
        };
        // 包里的塔罗 / 星球 / 幽灵是当场用掉的（`use_card`），走和消耗品区一样的表现
        if (card.kind === 'consumable' && !this.run.consumables.includes(card.consumable)) {
            const used = sprite instanceof ConsumableSprite ? sprite : undefined;
            this.packCardSprites = this.packCardSprites.filter((s) => s !== used);
            this.playUse(used, card.consumable, snap, refresh);
            return;
        }
        this.selected.clear();
        this.sound.play('card1', { volume: 0.5 });
        refresh();
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
        discover(this.run.shop?.packs[index]?.key ?? '', this.seeded); // `Card:open` 的 discover
        this.run.buyAndOpenPack(index);
        this.sound.play('coin1', { volume: 0.5 });
        this.rebuildJokers();
        this.rebuildConsumables();
        this.rebuildShop();
        this.rebuildPackCards();
        this.refresh();
    }

    /**
     * 商店界面上一次「出现」对应的商店与滑动位置。原作 `G.shop` 建一次、买卖重掷只改里面的卡；复刻件整个重建，
     * 所以要记住：同一个商店接着上一版的位置走，**新商店或关包回来**才从下面滑上来（offset `ROOM.T.y+11` → −5.3）
     */
    private shopShownFor: object | null = null;
    private signShownFor: object | null = null;

    /** 上一版商店外框与各格价签里的 DynaText（价签按商品对象认），重建时接着弹入进度走 */
    private shopTexts: { shop: object | null; box: DynaText[]; tags: Map<object, DynaText[]> } = { shop: null, box: [], tags: new Map() };

    private rebuildShop(): void {
        const prevShop = this.shopUi ? { shop: this.shopShownFor, offset: this.shopUi.view.slideOffset.y, sign: this.shopUi.sign.slideOffset.y } : null;
        this.clearShop();
        const shop = this.run.shop;
        const prevTexts = this.shopTexts.shop === shop ? this.shopTexts : { shop, box: [], tags: new Map<object, DynaText[]>() };
        this.shopTexts = { shop, box: [], tags: new Map() };
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
        this.shopTexts.box = [...dynaTextsOf(box), ...dynaTextsOf(sign)];
        inheritPop(prevTexts.box, this.shopTexts.box);
        for (const v of [this.shopUi.view, this.shopUi.sign]) v.setResolution(this.mapping.pxPerTile / U);
        // 开包时商店滑到下面（`ROOM.T.y+11`），关包回来再滑上来；招牌只在新商店时从上面（−15）落下
        if (this.run.openPack) {
            this.shopUi.view.slideFrom(prevShop ? prevShop.offset : 16.3).slideTo(16.3);
            this.shopShownFor = null;
        } else if (prevShop && prevShop.shop === null) {
            // 关包回来：`end_consumeable` 等外框滑走（0.2 秒）、手牌收回牌堆（再 0.2 秒）之后才把 offset 还原
            const view = this.shopUi.view.slideFrom(prevShop.offset).slideTo(16.3);
            this.time.delayedCall(400, () => view.slideTo(0));
        } else this.shopUi.view.slideFrom(prevShop && prevShop.shop === shop ? prevShop.offset : 16.3);
        if (!this.run.openPack) this.shopShownFor = shop;
        this.shopUi.sign.slideFrom(this.signShownFor === shop ? prevShop?.sign ?? 0 : -15);
        this.signShownFor = shop;
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
        const slot = (group: ShopSlot['group'], index: number, sprite: Pickable, area: Rect, w: number, h: number, cost: number, done: boolean, item: object) => {
            const tagMajor = { T: { x: area.x, y: area.y, w, h } };
            const t = new UIBox(priceTag({ cost }), { align: 'tm', offset: { x: 0, y: group === 'packs' ? 0.5 : 0.38 }, major: tagMajor });
            const texts = dynaTextsOf(t);
            inheritPop(prevTexts.tags.get(item) ?? [], texts);
            this.shopTexts.tags.set(item, texts);
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
                slot('items', i, s, itemsArea, s.w / U, s.h / U, shop.itemCost(i), isJokerImplemented(item.joker.key), item);
            } else if (item.kind === 'consumable') {
                const s = new ConsumableSprite(this, item.consumable, () => this.pick(s, { kind: 'shop', index: i }));
                this.attachPopup([s.shader], s, () => popupOfConsumable(item.consumable, 'shop'), true);
                this.shopConsumableSprites.push(s);
                slot('items', i, s, itemsArea, CARD_W, CARD_H, shop.itemCost(i), isConsumableImplemented(item.consumable.key), item);
            } else {
                // Magic Trick 的扑克牌
                const s = new CardSprite(this, item.card, () => this.pick(s, { kind: 'shop', index: i }));
                this.attachPopup(s.hoverTargets, s, () => popupOfCard(item.card, 'shop'), true);
                this.shopCardSprites.push(s);
                slot('items', i, s, itemsArea, CARD_W, CARD_H, shop.itemCost(i), true, item);
            }
        });

        // 优惠券
        const voucherArea = rectOf(areas.shop_vouchers);
        shop.vouchers.forEach((v, i) => {
            const s = new VoucherSprite(this, v.center, () => this.pick(s, { kind: 'voucher', index: i }));
            this.attachPopup([s.shader], s, () => popupOfCenter(v.key, 'shop'), true);
            this.voucherSprites.push(s);
            slot('vouchers', i, s, voucherArea, CARD_W, CARD_H, shop.voucherCost(i), true, v);
        });

        // 补充包：买掉的那一格从区域里拿走，剩下的重新居中（原作 `remove_card` 之后 `align_cards`）
        const packArea = rectOf(areas.shop_booster);
        shop.packs.forEach((p, i) => {
            if (!p) return;
            const s = new BoosterSprite(this, p.center, () => this.pick(s, { kind: 'booster', index: i }));
            this.attachPopup([s.shader], s, () => popupOfCenter(p.key, 'shop'), true);
            this.packSprites.push(s);
            slot('packs', i, s, packArea, CARD_W * 1.27, CARD_H * 1.27, shop.packCost(i), isBoosterImplemented(p.key, BOOSTER_CENTERS), p);
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
        const item = this.run.shop?.items[index];
        const snap = this.useSnapshot();
        snap.dollars -= this.run.shop?.itemCost(index) ?? 0;
        const consumable = this.run.buyAndUseConsumable(index, this.selectedInOrder());
        this.sound.play('coin1', { volume: 0.5 });
        // 买下的那张离开货架（价签一起拆，`card.children.price:remove()`），交给 `playUse`
        const used = item?.kind === 'consumable' ? this.shopConsumableSprites.find((s) => s.consumable === item.consumable) : undefined;
        this.shopConsumableSprites = this.shopConsumableSprites.filter((s) => s !== used);
        // 价签还挂在 `shopUi.tags` 里每帧更新，先藏起来，重建商店时一起拆
        this.shopSlots = this.shopSlots.filter((slot) => {
            if (slot.sprite !== used) return true;
            slot.tagView.setVisible(false);
            slot.warn?.setVisible(false);
            return false;
        });
        this.playUse(used, consumable, snap, () => {
            this.rebuildJokers();
            this.rebuildConsumables();
            this.rebuildShop();
            this.refresh();
        });
    }

    /** 选中消耗品后按 SELL */
    private sellConsumable(consumable: Consumable): void {
        const index = this.run.consumables.indexOf(consumable);
        if (this.animating || index < 0) return;
        this.pendingExit.set(consumable, { kind: 'dissolve', colours: [C.GOLD] });
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
        // overlay（Run Info）里的卡压在 overlay 之上，提示框也得在它们之上
        const depth = this.overlay ? 210 : 90;
        const views = [new UIBoxView(this, box, depth)];
        const info = infoBoxes(aut);
        if (info) {
            const ibox = new UIBox(info, { align: 'cl', offset: { x: -0.03, y: 0 }, major: box.getById('h_popup_main')!.asMajor });
            views.push(new UIBoxView(this, ibox, depth));
        }
        for (const v of views) v.setResolution(this.mapping.pxPerTile / U);
        this.popup = { sprite, major, views };
    }

    /**
     * 标签的提示框（`Tag:generate_UI` 的 `hover`）：`get_uibox_table` → `card_h_popup`，`cl` 挂在精灵左边、再左移 0.1
     */
    private showTagPopup(target: { readonly rect: Rect }, key: string, orbital: string | undefined, hide = false): void {
        this.hidePopup();
        const run = this.run;
        const g = popupGame(run, LOOK.mobileUi);
        const aut = tagAbilityTable(key, orbital, { handsPlayed: run.round?.handsPlayed ?? run.handsPlayed, unusedDiscards: run.unusedDiscards, skips: run.skips }, g, hide);
        const card: PopupCard = { centerKey: key, ability: { set: 'Tag', name: TAG_CENTERS[key]?.name } };
        const major = { T: { ...target.rect } };
        const box = new UIBox(cardHPopup(card, aut), { align: 'cl', offset: { x: -0.1, y: 0 }, major });
        // overlay（图鉴）里的标签，提示框压在 overlay 之上
        const depth = this.overlay ? 210 : 90;
        const views = [new UIBoxView(this, box, depth)];
        const info = infoBoxes(aut);
        if (info) views.push(new UIBoxView(this, new UIBox(info, { align: 'cl', offset: { x: -0.03, y: 0 }, major: box.getById('h_popup_main')!.asMajor }), depth));
        for (const v of views) v.setResolution(this.mapping.pxPerTile / toPx(1));
        this.popup = { sprite: target as unknown as Pickable, major, views };
        this.sound.play('paper1', { rate: Math.random() * 0.1 + 0.55, volume: 0.42 });
        this.sound.play('tarot2', { rate: Math.random() * 0.1 + 0.55, volume: 0.09 });
    }

    /**
     * 标签精灵的悬停区（UIBoxView 只给按钮建命中区）。每帧跟着元素的位置走；打过 / 跳过的格子标签行被挪到 10 tile 以下，区也跟着走
     */
    private tagHoverZones: Array<{ zone: GameObjects.Zone; target: { readonly rect: Rect } }> = [];

    private addTagHover(rect: () => Rect, key: string, orbital: () => string | undefined, sprite: TagSpriteObject, juice?: () => void, opts: { depth?: number; hide?: boolean } = {}): void {
        const target = { get rect() { return rect(); } };
        const zone = this.add.zone(0, 0, 1, 1).setOrigin(0, 0).setInteractive().setDepth(opts.depth ?? 43);
        // `tag_sprite.hover`：`hover_tilt = 3`、`juice_up(0.05, 0.02)` 弹一下、两声，出提示框；`stop_hover` 把倾斜收回 0
        zone.on('pointerover', () => {
            sprite.hoverTilt = 3;
            juice?.();
            this.showTagPopup(target, key, orbital(), opts.hide);
        });
        zone.on('pointerout', () => {
            sprite.hoverTilt = 0;
            if (this.popup?.sprite === (target as unknown as Pickable)) this.hidePopup();
        });
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
        this.placeShopSlots(this.shopSlots, shop.jokerMax, this.shopUi?.view.slideOffset.y ?? 0);
    }

    /** 货架 / 优惠券 / 补充包三格的卡与价签，按外框当前的滑动量 `dy` 摆 */
    private placeShopSlots(all: ShopSlot[], jokerMax: number, dy: number): void {
        const groups: Array<[ShopSlot['group'], number, number]> = [['items', jokerMax, CARD_W], ['vouchers', 1, CARD_W], ['packs', 2, CARD_W * 1.27]];
        for (const [group, limit, cardW] of groups) {
            const slots = all.filter((x) => x.group === group);
            if (slots.length === 0) continue;
            alignPlay({ ...slots[0]!.area, y: slots[0]!.area.y + dy }, slots.map((x) => ({ highlighted: x.sprite.highlighted, prevX: x.sprite.prevX || slots[0]!.area.x, w: x.w, h: x.h })), limit, cardW)
                .forEach((p, k) => slots[k]!.sprite.place(p, 0));
        }
        for (const x of all) {
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
        const chipsBefore = round.chips;
        const out = round.play(played);

        this.animating = true;
        this.selected.clear();
        // 回合分数在逻辑层已经加上了，显示上照 `ease_chips` 在最后才缓过去
        this.shownRoundChips = { v: chipsBefore };
        const hand = this.hudState.current_round.current_hand;
        const handSprite = (c: Card) => this.sprites.find((x) => x.card === c);
        const jokerSprite = (j: Joker) => this.jokerSprites.find((x) => x.joker === j);

        // `play_cards_from_highlighted`：出牌次数 -1，0.4 秒后逐张 `draw_card(G.hand, G.play)`
        this.easeHudCount('hand_UI_count', -1);
        const sprites = played.map(handSprite).filter((s): s is CardSprite => !!s);
        this.delayEvent(0.4);
        sprites.forEach((sp, i) => this.drawCardEvent((i + 1) * 100 / sprites.length, 'up', () => {
            sp.highlighted = false;
            this.inPlay.add(sp);
        }));

        // —— `G.FUNCS.evaluate_play`（`state_events.lua:592`）的表现部分，按 `out.steps` 重放 ——
        const scoring = out.scoringHand.map(handSprite).filter((s): s is CardSprite => !!s);
        this.delayEvent(0.2);
        scoring.forEach((sp, i) => this.highlightCard(sp, (i + 1 - 0.999) / 5, 'up'));

        let percent = 0.3;
        const delta = 0.08;
        const info = round.hands[out.handName];
        const changed = hand.handname !== out.handName;
        if (changed) this.delayEvent(0.3);
        this.updateHandText({ sound: changed ? 'button' : undefined, volume: 0.4, immediate: true, delay: changed ? 0.4 : 0 },
            { handname: out.handName, level: info.level, mult: out.baseMult, chips: out.baseChips });

        if (out.debuffed) {
            // `:1018`：整手不合法——盲注面板弹一下、两声 tarot2、出牌区上方「Not Allowed!」
            this.queue.add(new GameEvent({ trigger: 'immediate', func: () => {
                this.sound.play('tarot2', { rate: 1, volume: 0.4 });
                this.time.delayedCall(60, () => this.sound.play('tarot2', { rate: 0.76, volume: 0.4 }));
                return true;
            } }));
            this.playAreaStatusText('Not Allowed!');
        } else {
            this.delayEvent(0.4);
            let lastCard: Card | null = null;
            let lastRep = -1;
            for (const step of out.steps) {
                if (step.kind === 'joker' && step.phase === 'after') continue;
                if (step.kind === 'joker' && step.phase === 'before') {
                    const js = jokerSprite(step.joker);
                    if (js && step.message) this.cardEvalStatus(js, 'jokers', 'jokers', 0, percent, { message: step.message });
                    percent += delta;
                    continue;
                }
                if (step.kind === 'card') {
                    const sp = handSprite(step.card);
                    if (step.card !== lastCard || step.rep !== lastRep) {
                        percent += delta;
                        // 重复触发：先让带来重复的那张（Red 蜡封是牌自己）冒「Again!」
                        if (step.rep > 0 && step.card === lastCard && sp) this.cardEvalStatus(sp, 'play', 'jokers', 0, percent, { message: DICTIONARY.k_again_ex });
                        lastCard = step.card;
                        lastRep = step.rep;
                    }
                    if (!sp) continue;
                    if (step.message === 'debuffed') {
                        this.cardEvalStatus(sp, 'play', 'debuff', 1, percent);
                        continue;
                    }
                    const src = step.source ? jokerSprite(step.source) : undefined;
                    if (step.chipMod) {
                        if (src) this.juiceCard(src);
                        this.updateHandText({ delay: 0 }, { chips: step.handChips });
                        this.cardEvalStatus(sp, 'play', 'chips', step.chipMod, percent);
                    }
                    if (step.multMod) {
                        if (src) this.juiceCard(src);
                        this.updateHandText({ delay: 0 }, { mult: step.xMult !== 1 ? step.mult / step.xMult : step.mult });
                        this.cardEvalStatus(sp, 'play', 'mult', step.multMod, percent);
                    }
                    if (step.xMult !== 1) {
                        if (src) this.juiceCard(src);
                        this.updateHandText({ delay: 0 }, { mult: step.mult });
                        this.cardEvalStatus(sp, 'play', 'x_mult', step.xMult, percent);
                    }
                    if (!step.chipMod && !step.multMod && step.xMult === 1 && step.message) {
                        if (src) this.juiceCard(src);
                        this.cardEvalStatus(sp, 'play', 'extra', 0, percent, { message: step.message });
                    }
                    continue;
                }
                if (step.kind === 'held') {
                    const sp = handSprite(step.card);
                    if (step.card !== lastCard) {
                        percent += delta;
                        lastCard = step.card;
                    }
                    if (!sp) continue;
                    const src = step.source ? jokerSprite(step.source) : undefined;
                    if (src) this.queue.add(new GameEvent({ trigger: 'immediate', func: () => { src.pop(0.7); return true; } }));
                    if (step.multMod) {
                        this.updateHandText({ delay: 0 }, { mult: step.xMult !== 1 ? step.mult / step.xMult : step.mult });
                        this.cardEvalStatus(sp, 'hand', 'h_mult', step.multMod, percent);
                    }
                    if (step.xMult !== 1) {
                        this.updateHandText({ delay: 0 }, { mult: step.mult });
                        this.cardEvalStatus(sp, 'hand', 'x_mult', step.xMult, percent);
                    }
                    if (!step.multMod && step.xMult === 1 && step.message) {
                        this.updateHandText({ delay: 0 }, { mult: step.mult });
                        this.cardEvalStatus(sp, 'hand', 'extra', 0, percent, { message: step.message });
                    }
                    continue;
                }
                // 小丑主遍历：加法 → 乘法都在同一条里，提示字一条
                const js = jokerSprite(step.joker);
                this.updateHandText({ delay: 0 }, {
                    chips: step.chipMod ? step.handChips : undefined,
                    mult: step.multMod || step.xMult !== 1 ? step.mult : undefined,
                });
                const message = step.message
                    ?? (step.xMult !== 1 ? locVariable('a_xmult', step.xMult) : step.multMod ? locVariable('a_mult', step.multMod) : step.chipMod ? locVariable('a_chips', step.chipMod) : undefined);
                if (js && message) {
                    this.cardEvalStatus(js, 'jokers', 'jokers', 0, percent, {
                        message, chip_mod: step.chipMod || undefined, mult_mod: step.multMod || undefined, Xmult_mod: step.xMult !== 1 ? step.xMult : undefined,
                    });
                }
                percent += delta;
            }
            scoring.forEach((sp, i) => this.highlightCard(sp, (i + 1 - 0.999) / (scoring.length - 0.998), 'down'));
            // `state_events.lua:1006`：放下之后，每张毁掉的牌一个事件——玻璃牌 `shatter()`、别的 `start_dissolve()`。
            // 退场是非阻塞的，跟后面的事件并行；卡在出牌区里溶完才摘掉（原作 `remove` 时才离开 `G.play`）
            for (const sp of sprites) {
                if (!out.destroyed.includes(sp.card)) continue;
                this.queue.add(new GameEvent({ trigger: 'immediate', func: () => {
                    this.exitCard(sp, destroyStyle(sp.card.enhancement), () => this.dropHandSprite(sp));
                    return true;
                } }));
            }
        }

        // `:1045`：本手总分挪到牌型名那一格，筹码 × 倍率清零
        this.queue.add(new GameEvent({ trigger: 'after', delay: 0.4, func: () => {
            this.applyHandText({ mult: 0, chips: 0, chip_total: out.score, level: '', handname: '' }, { nopulse: false });
            this.sound.play('button', { rate: 0.9, volume: 0.6 });
            return true;
        } }));
        if (out.score > 0) {
            this.delayEvent(0.8);
            this.queue.add(new GameEvent({ trigger: 'immediate', func: () => { this.sound.play('chips2'); return true; } }));
        }
        // `ease_chips` 与 `chip_total` 同时 0.5 秒缓过去，后者阻塞
        const shown = this.shownRoundChips;
        this.queue.add(new GameEvent({ trigger: 'ease', blocking: false, refTable: shown, refValue: 'v', easeTo: round.chips, delay: 0.5 }));
        this.queue.add(new GameEvent({ trigger: 'ease', refTable: hand as unknown as Record<string, number>, refValue: 'chip_total', easeTo: 0, delay: 0.5 }));
        this.queue.add(new GameEvent({ trigger: 'immediate', func: () => { hand.handname = ''; return true; } }));
        this.delayEvent(0.3);
        // 出牌后的善后（Ice Cream、Seltzer……）
        for (const step of out.steps) {
            if (step.kind !== 'joker' || step.phase !== 'after' || !step.message) continue;
            const js = jokerSprite(step.joker);
            if (js) this.cardEvalStatus(js, 'jokers', 'jokers', 0, percent, { message: step.message });
        }

        // `draw_from_play_to_discard`（碎掉 / 毁掉的不去弃牌堆），再 `draw_from_deck_to_hand`
        this.delayEvent(0.1);
        const kept = sprites.filter((sp) => !out.destroyed.includes(sp.card));
        kept.forEach((sp, i) => this.drawCardEvent((i + 1) * 100 / kept.length, 'down', () => this.sendToDiscard(sp)));
        this.queue.add(new GameEvent({ trigger: 'immediate', func: () => {
            this.shownRoundChips = null;
            return true;
        } }));
        this.drawFromDeckToHand();
    }

    /** 正在放退场动画的精灵：各处整体重建时别提前拆它们，由 `playExit` 到点拆 */
    private readonly exiting = new Set<ExitTarget>();

    private exitCard(sp: ExitTarget, style: ExitStyle, onGone?: () => void): void {
        if (this.exiting.has(sp)) return;
        this.exiting.add(sp);
        playExit(this, sp, style, () => {
            this.exiting.delete(sp);
            onGone?.();
        });
    }

    /** 整体重建时拆旧精灵：退场中的留给 `playExit` */
    private destroyUnlessExiting(sprites: Iterable<ExitTarget>): void {
        for (const s of sprites) if (!this.exiting.has(s)) s.destroy();
    }

    /** 退场动画放完的牌：从手牌 / 出牌区摘掉（`playExit` 已经拆了精灵） */
    private dropHandSprite(sp: CardSprite): void {
        this.inPlay.delete(sp);
        this.sprites = this.sprites.filter((x) => x !== sp);
    }

    /** 飞向弃牌堆的牌（屏幕外右边），飞够了就拆 */
    private discarding: Array<{ sprite: CardSprite; until: number }> = [];

    /**
     * `draw_card`（`common_events.lua:393`）：入队一个 `before` 0.1 秒的事件，到点把一张牌挪进目标区、`card1` 一声。
     * 音高 `0.85 + percent·0.2/100`；`dir = 'down'` 时原文写的是 `percent = 1 − percent`（percent 是 0..100），照抄
     */
    private drawCardEvent(percent: number, dir: 'up' | 'down', move: () => void): void {
        const p = dir === 'down' ? 1 - percent : percent;
        this.queue.add(new GameEvent({ trigger: 'before', delay: 0.1, func: () => {
            move();
            this.sound.play('card1', { rate: 0.85 + (p * 0.2) / 100, volume: 0.6 });
            return true;
        } }));
    }

    /** 把一张牌交给弃牌堆：从手牌 / 出牌区摘掉，每帧摆到 `G.discard`（屏幕外），1.5 秒后拆 */
    private sendToDiscard(sp: CardSprite): void {
        this.inPlay.delete(sp);
        this.sprites = this.sprites.filter((x) => x !== sp);
        sp.highlighted = false;
        this.discarding.push({ sprite: sp, until: this.time.now / 1000 + 1.5 });
    }

    /**
     * `draw_from_deck_to_hand`：0.3 秒后逐张从牌堆摸（逻辑层早就摸好了，这里只按 0.1 秒一张让它们飞进来、各响一声），
     * 摸完才放开输入
     */
    private drawFromDeckToHand(): void {
        this.delayEvent(0.3);
        let drawn = 0;
        this.queue.add(new GameEvent({ trigger: 'immediate', func: () => {
            const before = new Set(this.sprites.map((s) => s.card));
            this.rebuildHand();
            this.rebuildJokers(); // 自增型小丑长了个子，数字要跟着变
            const fresh = this.sprites.filter((s) => !before.has(s.card));
            drawn = fresh.length;
            fresh.forEach((_, i) => this.time.delayedCall(100 * i, () => this.sound.play('card1', { rate: 0.85 + ((i + 1) * 100 / fresh.length * 0.2) / 100, volume: 0.6 })));
            return true;
        } }));
        this.queue.add(new GameEvent({ trigger: 'after', delay: 0, func: () => {
            this.time.delayedCall(100 * drawn, () => {
                this.animating = false;
                this.refresh();
            });
            return true;
        } }));
    }

    /**
     * `ease_hands_played` / `ease_discard` 的表现：那一格上盖一块红（减）/ 绿（加）色块、冒 `-1`，`chips2` 一声。
     * 次数本身逻辑层已经改了
     */
    private easeHudCount(id: 'hand_UI_count' | 'discard_UI_count', mod: number): void {
        this.queue.add(new GameEvent({ trigger: 'immediate', func: () => {
            const el = this.hudView.box.getById(id)?.parent;
            if (!el) return true;
            this.attentionTexts.push(new AttentionText(this, {
                text: `${mod < 0 ? '' : '+'}${mod}`, scale: 0.8, hold: 0.7, align: 'cm',
                major: () => ({ x: el.x, y: el.y, w: el.T.w, h: el.T.h }), cover: true, coverColour: mod < 0 ? C.RED : C.GREEN,
            }, this.mapping.pxPerTile / toPx(1), 45));
            this.sound.play('chips2');
            return true;
        } }));
    }

    private lastDollars: number | null = null;

    private dollarsPopup(mod: number): void {
        const el = this.hudView.box.getById('dollar_text_UI')?.parent;
        if (!el) return;
        this.attentionTexts.push(new AttentionText(this, {
            text: `${mod < 0 ? '-' : '+'}$${Math.abs(mod)}`, scale: 0.8, hold: 0.7, align: 'cm',
            major: () => ({ x: el.x, y: el.y, w: el.T.w, h: el.T.h }), cover: true, coverColour: mod < 0 ? C.RED : C.MONEY,
        }, this.mapping.pxPerTile / toPx(1), 45));
    }

    /** 当前显示的回合分数（`G.GAME.chips` 的缓动值）；null 时直接读逻辑层 */
    private shownRoundChips: { v: number } | null = null;

    /** `delay(t)` */
    private delayEvent(t: number): void {
        this.queue.add(new GameEvent({ trigger: 'after', delay: t, func: () => true }));
    }

    /** `highlight_card`（`common_events.lua:429`）：抬起 / 放下一张计分牌，`cardSlide1` 音高随 percent 升 */
    private highlightCard(sp: CardSprite, percent: number, dir: 'up' | 'down'): void {
        const p = dir === 'down' ? 1 - percent : percent;
        this.queue.add(new GameEvent({ trigger: 'before', delay: 0.1, func: () => {
            sp.highlighted = dir === 'up';
            this.sound.play('cardSlide1', { rate: 0.85 + p * 0.2 });
            return true;
        } }));
    }

    /** `juice_card`：效果来自哪张小丑，那张 `juice_up(0.7)` */
    private juiceCard(js: JokerSprite): void {
        this.queue.add(new GameEvent({ trigger: 'immediate', func: () => { js.pop(0.7); return true; } }));
    }

    /**
     * `update_hand_text`（`common_events.lua:498`）：入队，`before` 触发、`delay` 缺省 0.8。
     * 只写数值；显示由 HUD 的 `*_UI_set` 每帧同步
     */
    private updateHandText(config: { delay?: number; immediate?: boolean; sound?: string; volume?: number; pitch?: number; nopulse?: boolean },
        vals: HandTextVals): void {
        this.queue.add(new GameEvent({
            trigger: 'before', blockable: !config.immediate, delay: config.delay ?? 0.8,
            func: () => {
                this.applyHandText(vals, config);
                if (config.sound) this.sound.play(config.sound, { rate: config.pitch ?? 1, volume: config.volume ?? 1 });
                return true;
            },
        }));
    }

    /** `G.TAROT_INTERRUPT`：用消耗品期间倍率换值不弹那一格 */
    private tarotInterrupt = false;

    private applyHandText(vals: HandTextVals, config: { nopulse?: boolean }): void {
        const hand = this.hudState.current_round.current_hand;
        // `StatusText`：在那一格上盖一块色、冒增量（`+3` / `-1`；给的是字串就冒字串本身）。增量为负时底色偏红
        const status = (id: string, from: number | string, to: number | string, base: Colour, coverAlign: string) => {
            const numeric = typeof from === 'number' && typeof to === 'number';
            const d = numeric ? (to as number) - (from as number) : 0;
            const text = typeof to === 'string' ? to : d > 0 ? `+${d}` : `${d}`;
            const col = d < 0 ? C.RED : C.GREEN;
            const el = this.hudView.box.getById(id)?.parent;
            if (!el) return;
            this.attentionTexts.push(new AttentionText(this, {
                text, scale: 0.8, hold: 1, align: 'cm', emboss: 0.05, coverAlign,
                major: () => ({ x: el.x, y: el.y, w: el.T.w, h: el.T.h }), cover: true, coverColour: mixColours(base, col, 0.1),
            }, this.mapping.pxPerTile / toPx(1), 45));
        };
        if (vals.chips !== undefined && hand.chips !== vals.chips) {
            if (vals.StatusText) status('hand_chips', hand.chips, vals.chips, C.CHIPS, 'cr');
            hand.chips = vals.chips;
        }
        if (vals.mult !== undefined && hand.mult !== vals.mult) {
            if (vals.StatusText) status('hand_mult', hand.mult, vals.mult, C.MULT, 'cl');
            hand.mult = vals.mult;
            if (!this.tarotInterrupt) this.hudView.juiceElement(this.hudView.box.getById('hand_mult_area'), this.time.now / 1000);
        }
        if (vals.handname !== undefined && hand.handname !== vals.handname) {
            hand.handname = vals.handname;
            if (!config.nopulse) (this.hudView.box.getById('hand_name')?.config.object as DynaText | undefined)?.pulse(0.2);
        }
        if (vals.chip_total !== undefined) {
            hand.chip_total = vals.chip_total;
            (this.hudView.box.getById('hand_chip_total')?.config.object as DynaText | undefined)?.pulse(0.5);
        }
        if (vals.level !== undefined) {
            const text = vals.level === '' ? '' : ` ${DICTIONARY.k_lvl}${vals.level}`;
            if (text !== hand.hand_level) {
                hand.hand_level = text;
                const el = this.hudView.box.getById('hand_level');
                if (el && vals.level !== '') {
                    // 字串（Black Hole 的 `+1`）用第一级的颜色
                    el.config.colour = C.HAND_LEVELS[typeof vals.level === 'number' ? Math.min(vals.level, 7) : 1]!;
                    this.hudView.juiceElement(el, this.time.now / 1000);
                }
            }
        }
    }

    /** 飘在卡上的字（`attention_text`），每帧推进，拆完就从表里拿掉 */
    private attentionTexts: AttentionText[] = [];

    /**
     * `card_eval_status_text`（`common_events.lua:781`）：入队一个 `before` 事件（时长 ×1.25），
     * 到点在卡上冒字（出牌区 / 手牌区的牌挂 `tm` 上提 0.05 卡高，小丑挂 `bm` 下压 0.05 卡高）、按类型放声（音高 0.8 + 0.2·percent）、卡弹一下、房间抖 0.7
     */
    private cardEvalStatus(target: { readonly rect: Rect; pop(amount?: number): void }, area: 'play' | 'hand' | 'jokers', type: 'debuff' | 'chips' | 'mult' | 'x_mult' | 'h_mult' | 'dollars' | 'extra' | 'jokers',
        amt: number, percent: number, extra?: { message?: string; colour?: Colour; chip_mod?: number; mult_mod?: number; Xmult_mod?: number; edition?: boolean }): void {
        let text = '';
        let sound = 'generic1';
        let volume = 1;
        let delay = 0.65;
        let colour: Colour = extra?.colour ?? C.FILTER;
        let scale = 1;
        if (type === 'debuff') {
            sound = 'cancel'; amt = 1; colour = C.RED; scale = 0.6; text = DICTIONARY.k_debuffed ?? 'Debuffed';
        } else if (type === 'chips') {
            sound = 'chips1'; colour = C.CHIPS; text = locVariable('a_chips', amt); delay = 0.6;
        } else if (type === 'mult' || type === 'h_mult') {
            sound = 'multhit1'; text = locVariable('a_mult', amt); colour = C.MULT; scale = 0.7;
        } else if (type === 'x_mult') {
            sound = 'multhit2'; volume = 0.7; text = locVariable('a_xmult', amt); colour = C.XMULT; scale = 0.7;
        } else if (type === 'dollars') {
            sound = 'coin3'; text = `${amt < -0.01 ? '-' : ''}$${Math.abs(amt)}`; colour = amt < -0.01 ? C.RED : C.MONEY;
        } else {
            const e = extra ?? {};
            sound = e.edition ? 'foil2' : e.mult_mod ? 'multhit1' : e.Xmult_mod ? 'multhit2' : 'generic1';
            if (e.edition) colour = C.DARK_EDITION;
            volume = e.edition ? 0.3 : sound === 'multhit2' ? 0.7 : 1;
            delay = 0.75;
            amt = 1;
            text = e.message ?? text;
            if (!e.edition && (e.mult_mod || e.Xmult_mod)) colour = C.MULT;
            if (e.chip_mod) colour = C.CHIPS;
            scale = 0.7;
        }
        delay *= 1.25;
        if (!amt) return;
        const aligned = area === 'jokers' ? 'bm' : 'tm';
        const yOff = area === 'jokers' ? 0.05 * target.rect.h : -0.05 * CARD_H;
        this.queue.add(new GameEvent({
            trigger: 'before', delay,
            func: () => {
                this.attentionTexts.push(new AttentionText(this, {
                    text, scale, hold: delay - 0.2, backdropColour: colour, align: aligned, major: () => target.rect, offset: { x: 0, y: yOff },
                }, this.mapping.pxPerTile / toPx(1), 60));
                if (this.cache.audio.exists(sound)) this.sound.play(sound, { rate: 0.8 + percent * 0.2, volume });
                target.pop();
                this.juice.jiggle += 0.7;
                return true;
            },
        }));
    }

    /** `play_area_status_text`：出牌区上方 1 格的大字，`cardFan2` 一声、房间抖 2 */
    private playAreaStatusText(text: string): void {
        this.queue.add(new GameEvent({ trigger: 'before', delay: 0.6, func: () => {
            const area = this.areas.play;
            this.attentionTexts.push(new AttentionText(this, { text, scale: 0.9, hold: 0.9, align: 'tm', major: () => area, offset: { x: 0, y: -1 } },
                this.mapping.pxPerTile / toPx(1), 60));
            this.juice.jiggle += 2;
            if (this.cache.audio.exists('cardFan2')) this.sound.play('cardFan2');
            return true;
        } }));
    }

    private doDiscard(): void {
        const round = this.round;
        if (this.animating || !round || round.phase !== 'selecting') return;
        if (this.selected.size === 0 || round.discardsLeft < 1) return;

        // `discard_cards_from_highlighted`：本手那格清空，逐张 `draw_card(G.hand, G.discard)`，弃牌次数 -1，再摸牌
        const cards = this.selectedInOrder();
        round.discard(cards);
        this.animating = true;
        this.selected.clear();
        this.updateHandText({ immediate: true, nopulse: true, delay: 0 }, { mult: 0, chips: 0, level: '', handname: '' });
        const all = cards.map((c) => this.sprites.find((s) => s.card === c)).filter((s): s is CardSprite => !!s);
        // `state_events.lua:433`：小丑回了 `remove`（Trading Card）的那张当场碎 / 溶，留在手里直到移除，不去弃牌堆
        const sprites = all.filter((sp) => this.run.fullDeck.includes(sp.card));
        for (const sp of all) if (!sprites.includes(sp)) this.exitCard(sp, destroyStyle(sp.card.enhancement), () => this.dropHandSprite(sp));
        sprites.forEach((sp, i) => this.drawCardEvent((i + 1) * 100 / sprites.length, 'down', () => this.sendToDiscard(sp)));
        this.easeHudCount('discard_UI_count', -1);
        this.drawFromDeckToHand();
        this.refresh('弃牌');
    }

    // ————————————————————————————————————————————————————————————————
    // 手牌
    // ————————————————————————————————————————————————————————————————

    /** 手牌变了就整体重建。8 张牌，重建比增量同步便宜也不容易错。 */
    private rebuildHand(): void {
        this.hidePopup();
        const old = this.sprites;
        const wasInPlay = new Set(this.inPlay);
        this.sprites = [];
        this.inPlay.clear();

        const round = this.round;
        if (round) {
            // 逻辑层已经给过 T.x（等距单调，tile 单位）。
            // **不改它**——边距是表现层的事，在 layout 时叠加
            let drawn = 0;
            for (const card of round.hand) {
                if (this.hiddenCards.has(card)) continue;
                const sprite = this.handSprite(card, old, (c) => this.toggle(c));
                if (sprite.spawnFrom) sprite.holdUntil = this.time.now / 1000 + 0.1 * drawn++;
                this.sprites.push(sprite);
            }
        }
        // 退场中的牌还占着原来的位置（原作 `remove` 时才离开区，别的牌那时才合拢），到点由 `dropHandSprite` 摘掉
        old.forEach((sp, i) => {
            if (!this.exiting.has(sp)) return;
            this.sprites.splice(Math.min(i, this.sprites.length), 0, sp);
            if (wasInPlay.has(sp)) this.inPlay.add(sp);
        });
        this.destroyUnlessExiting(old);
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
            createButtons({ playButtonPos: SETTINGS.play_button_pos, mobile: LOOK.mobileUi }),
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
            // `G.blind_select`：offset `ROOM.T.y+29` → 终值，从下面滑上来；左侧提示框 −15 → 0 从上面落下
            select: new UIBoxView(this, select, 30, onButton).slideFrom(29 - select.config.offset!.y),
            prompt: new UIBoxView(this, prompt, 41, onButton).slideFrom(-15),
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
            // 悬停区跟着卡片那块的滑动走（开包时收到屏幕下面，区也跟下去）
            const slid = () => this.blindSelectViews?.select.slideOffset ?? { x: 0, y: 0 };
            this.addTagHover(() => ({ x: sprite.x + slid().x, y: sprite.y + slid().y, w: sprite.T.w, h: sprite.T.h }), key, () => run.orbitalChoice(type),
                sprite.config.object as TagSpriteObject, () => this.blindSelectViews?.select.childView(card)?.juiceObject(sprite.config.object!, this.time.now / 1000, 0.05, 0.02));
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
        if (this.blindSelectViews) view.followSlide(this.blindSelectViews.select);
        view.setResolution(this.mapping.pxPerTile / toPx(1));
        this.skippedAlerts.push(view);
    }

    /**
     * 选了盲注（`select_blind`，`button_callbacks.lua:2635`）：卡片那块滑到 offset 40、左侧提示框升到 −10，滑走后才拆
     */
    private retireBlindSelect(): void {
        const v = this.blindSelectViews;
        if (!v) return;
        const end = v.select.box.config.offset?.y ?? 0;
        v.select.slideTo(40 - end);
        v.prompt.slideTo(-10);
        const alerts = this.skippedAlerts;
        this.skippedAlerts = [];
        this.blindSelectViews = null;
        this.clearTagHovers((t) => this.blindTagTargets.has(t));
        this.blindTagTargets.clear();
        this.blindSelectState = null;
        this.retire([v.select, v.prompt], {
            step: (now) => { for (const a of alerts) a.update(now); },
            destroy: () => { for (const a of alerts) a.destroy(); },
        });
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
                    x: spot.x, y: spot.y + overlay.view.slideOffset.y, w: spot.T.w, h: spot.T.h,
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
        view.slideFrom(10);
        const blocker = this.add.zone(-toPx(TILE_W * 3), -toPx(TILE_H * 3), toPx(TILE_W * 7), toPx(TILE_H * 7))
            .setOrigin(0, 0).setInteractive().setDepth(199);
        const overlay = {
            view, bg, alpha: { from: bg[3], to: alphaTo, start: this.time.now / 1000 }, blocker,
            jimbo: null as Jimbo | null, vouchers: [] as Array<{ sprite: VoucherSprite; area: VoucherArea }>,
            deckCards: [] as Array<{ card: MiniCard; area: ViewDeckArea; index: number }>,
        };
        this.overlay = overlay;
        this.juice.jiggle += 1;
        this.hidePopup();
        return overlay;
    }

    private closeOverlay(): void {
        if (!this.overlay) return;
        this.closeRunSetupExtras();
        this.closeCollectionExtras();
        this.collection = null;
        this.closeCollectionMisc();
        this.hidePopup();
        this.overlay.view.destroy();
        this.overlay.blocker.destroy();
        this.overlay.jimbo?.destroy();
        for (const v of this.overlay.vouchers) v.sprite.destroy();
        for (const c of this.overlay.deckCards) c.card.destroy();
        this.overlay = null;
        this.syncHandRowHovers();
    }

    /** View Deck 当前页的花色行（`view_deck` 建页时写） */
    private deckViewAreas: ViewDeckArea[] = [];

    /**
     * `G.FUNCS.deck_info`（点牌堆最上面那张 / 牌堆上的「View Deck」）：选牌中打开有 Remaining 与 Full Deck 两页，
     * 其余时候只有 Full Deck。灰底 0.7，同 Run Info
     */
    private openDeckInfo(): void {
        if (this.overlay || this.animating) return;
        const run = this.run;
        const round = this.round;
        const inRound = !!round && run.state === 'playing' && round.phase === 'selecting';
        this.deckHovered = false;
        const input = {
            playingCards: run.fullDeck,
            inDeck: new Set(inRound ? round.deck : run.fullDeck),
            wheelFlipped: new Set(inRound ? round.hand.filter((c) => c.facing === 'back') : []),
            smeared: run.jokers.some((j) => j.key === 'j_smeared' && !j.debuff),
            pareidolia: run.jokers.some((j) => j.key === 'j_pareidolia' && !j.debuff),
            back: { name: 'Red Deck', key: RED_DECK.key, vars: [RED_DECK.config.discards] },
            mobile: LOOK.mobileUi,
        };
        const def = deckInfo(input, inRound, (areas) => { this.deckViewAreas = areas; });
        const bg: Colour = [C.GREY[0], C.GREY[1], C.GREY[2], 0.7];
        this.mountOverlay(def, bg, 0.7);
        this.syncDeckViewCards();
        this.syncHandRowHovers();
    }

    /** 每个花色行按当前页造复制品（`copy_card(card, nil, 0.7)`：强化、版本、蜡封、削弱都跟着；不在牌堆的 greyed） */
    private syncDeckViewCards(): void {
        const o = this.overlay;
        if (!o) return;
        if (o.deckCards.some((c) => this.popup?.sprite === (c.card as unknown as Pickable))) this.hidePopup();
        for (const c of o.deckCards) c.card.destroy();
        o.deckCards = [];
        const inner = o.view.box.getById('tab_contents')?.config.object as UIBox | undefined;
        if (!inner || ![...inner.root.walk()].some((e) => (e.config.object as { kind?: string } | undefined)?.kind === 'view_deck')) return;
        for (const area of this.deckViewAreas) {
            area.cards.forEach(({ card, greyed }, index) => {
                const mini = new MiniCard(this, card.key, 0.7 * CARD_W, 0.7 * CARD_H, 202 + index * 0.05, {
                    enhancement: card.enhancement, edition: card.edition, seal: card.seal, debuff: card.debuff, greyed, shadow: false,
                });
                // `Card:hover`：`juice_up(0.05, 0.03)`、`paper1`，出 `card_h_popup`——`view_deck` 区域里与商店一样挂左边（`cl`）
                const target = mini as unknown as Pickable;
                mini.onHover(() => {
                    mini.juiceUp(0.05, 0.03);
                    this.sound.play('paper1', { rate: Math.random() * 0.2 + 0.9, volume: 0.35 });
                    this.showPopup(target, popupOfCard(card, 'other'), true);
                }, () => { if (this.popup?.sprite === target) this.hidePopup(); });
                o.deckCards.push({ card: mini, area, index });
            });
        }
    }

    /**
     * `align_cards` 的 `title` 分支，`card_w = 0.7·CARD_W`、卡本身也是 0.7 倍：
     * x 按下标在行宽里均分，转角 `0.2·(−n/2 − ½ + k)/n + 0.02·sin(2t + x)`，y 上下浮并按离中间的距离往下弯
     */
    private placeDeckViewCards(now: number): void {
        const o = this.overlay;
        if (!o || o.deckCards.length === 0) return;
        const inner = o.view.box.getById('tab_contents')?.config.object as UIBox | undefined;
        if (!inner) return;
        const slide = o.view.slideOffset.y;
        const els = new Map<ViewDeckArea, UIElement>();
        for (const e of inner.root.walk()) {
            const obj = e.config.object as ViewDeckArea | undefined;
            if (obj?.kind === 'view_deck') els.set(obj, e);
        }
        const cw = 0.7 * CARD_W;
        const ch = 0.7 * CARD_H;
        for (const { card, area, index } of o.deckCards) {
            const el = els.get(area);
            if (!el) continue;
            const n = area.cards.length;
            const k = index + 1;
            let x = el.x + (area.T.w - cw) * ((k - 1) / Math.max(n - 1, 1));
            const r = (0.2 * (-n / 2 - 0.5 + k)) / n + wobble() * 0.02 * Math.sin(2 * now + x);
            const y = el.y + slide + area.T.h / 2 - ch / 2 + wobble() * 0.03 * Math.sin(0.666 * now + x) + Math.abs((0.5 * (-n / 2 + k - 0.5)) / n) - (n > 1 ? 0.2 : 0);
            x += cardShadowParallaxX(x, cw) / 30;
            card.place(x, y, r, 0.95);
        }
    }

    private seeded = false;

    /** 开局设置开着时：`G.run_setup_seed` / `G.setup_seed`、牌组预览那一叠、屏幕键盘 */
    private runSetup: { state: RunSetupState; deck: DeckSprite; keyboard: UIBoxView | null } | null = null;

    /** `G.FUNCS.setup_run`：`G.UIDEF.run_setup()` 挂成 overlay */
    private openRunSetup(fromGameOver: boolean): void {
        const state: RunSetupState = { run_setup_seed: false, setup_seed: '' };
        const now = () => this.time.now / 1000;
        const inputFuncs = textInputFuncs(now);
        const funcs = {
            ...controlFuncs(),
            ...inputFuncs,
            // `toggle_seeded_run`：勾上就在这一行挂出说明 + 种子框 + Paste Seed，取消就拆掉（放开输入）
            toggle_seeded_run: (e: UIElement) => {
                const slot = e.config.object as { seedSlot?: boolean } | UIBox | undefined;
                if (slot instanceof UIBox && !state.run_setup_seed) {
                    e.box.replaceObject(e, { kind: 'empty', T: { x: 0, y: 0, w: 0, h: 0 }, seedSlot: true } as never);
                    if (TEXT_HOOK.el) this.releaseTextInput();
                } else if (!(slot instanceof UIBox) && state.run_setup_seed) {
                    e.box.replaceObject(e, new UIBox(seededRunRow(state), { align: 'cm', offset: { x: 0, y: 0 } }, inputFuncs));
                }
            },
        };
        const bg: Colour = [C.GREY[0], C.GREY[1], C.GREY[2], 0.7];
        this.mountOverlay(runSetup(state, LOOK.mobileUi, funcs, fromGameOver), bg, 0.7);
        this.runSetup = { state, deck: new DeckSprite(this, { deckHeight: 0.75, thinDraw: 1, mainDeck: false, depth: 201 }), keyboard: null };
    }

    private closeRunSetupExtras(): void {
        const r = this.runSetup;
        if (!r) return;
        r.deck.destroy();
        r.keyboard?.destroy();
        TEXT_HOOK.el = null;
        TEXT_HOOK.args = null;
        this.runSetup = null;
    }

    /** 放开种子框（`text_input_key('return')`），收起屏幕键盘 */
    private releaseTextInput(): void {
        textInputKey('return');
        this.runSetup?.keyboard?.destroy();
        if (this.runSetup) this.runSetup.keyboard = null;
    }

    /** 开局设置的几个按钮。认得就返回 true */
    private handleRunSetupButton(name: string, el?: UIElement): boolean {
        const r = this.runSetup;
        if (!r) return false;
        if (name === 'select_text_input' && el) {
            selectTextInput(el);
            // 移动版：在种子框那一行上方 4 格弹出屏幕键盘（`keyboard_offset or -4`，`major = e.UIBox`）
            if (LOOK.mobileUi && !r.keyboard) {
                const box = new UIBox(keyboardInput(true), { align: 'cm', offset: { x: 0, y: -4 }, major: { T: { x: el.box.T.x, y: el.box.T.y, w: el.box.T.w, h: el.box.T.h } } });
                r.keyboard = new UIBoxView(this, box, 230, (n, e) => this.onOverlayButton(n, e));
                r.keyboard.setResolution(this.mapping.pxPerTile / toPx(1));
            }
            return true;
        }
        if (name === 'key_button' && el) {
            const key = (el.config.ref_table as { key: string }).key;
            if (textInputKey(key) === 'release') this.releaseTextInput();
            return true;
        }
        if (name === 'paste_seed') {
            // `paste_seed`：清空再把剪贴板的前 8 个字逐个敲进去（不在字表里的跳过）
            void navigator.clipboard?.readText().then((text) => {
                const inputEl = this.overlay?.view.box && this.findTextInput();
                if (!inputEl) return;
                selectTextInput(inputEl);
                for (let i = 0; i < 8; i++) textInputKey('backspace');
                for (const ch of text.slice(0, 8)) textInputKey(ch);
                this.releaseTextInput();
            }).catch(() => undefined);
            return true;
        }
        if (name === 'start_setup_run') {
            // `start_setup_run`：勾了 Seeded Run 且敲了种子就用它（`G.GAME.seeded`），否则随机种子
            saveSettings();
            const params = new URLSearchParams(location.search);
            const seed = r.state.run_setup_seed && r.state.setup_seed ? r.state.setup_seed : null;
            params.set('seed', seed ?? randomSeed());
            params.delete('menu');
            if (seed) params.delete('rs');
            else params.set('rs', '1');
            this.wipeTo(params);
            return true;
        }
        return false;
    }

    /** 种子框（`id = 'text_input'` 的那个按钮），在 overlay 里嵌套的盒子中找 */
    private findTextInput(): UIElement | null {
        const walk = (box: UIBox): UIElement | null => {
            for (const e of box.root.walk()) {
                if (e.config.id === 'text_input') return e;
                if (e.config.object instanceof UIBox) {
                    const hit = walk(e.config.object);
                    if (hit) return hit;
                }
            }
            return null;
        };
        return this.overlay ? walk(this.overlay.view.box) : null;
    }

    /** 每帧：牌组预览那一叠跟着它的格子（含 overlay 的滑动）；屏幕键盘更新 */
    private followRunSetup(now: number): void {
        const r = this.runSetup;
        const o = this.overlay;
        if (!r || !o) return;
        const find = (box: UIBox): UIElement | null => {
            for (const e of box.root.walk()) {
                if (e.config.id === 'run_setup_deck') return e;
                if (e.config.object instanceof UIBox) {
                    const hit = find(e.config.object);
                    if (hit) return hit;
                }
            }
            return null;
        };
        const el = find(o.view.box);
        const slide = o.view.slideOffset;
        if (el) r.deck.update({ x: el.x + slide.x, y: el.y + slide.y, w: el.T.w, h: el.T.h }, 10);
        else r.deck.update({ x: 0, y: 0, w: 0, h: 0 }, 0);
        r.keyboard?.update(now);
    }

    /** `G.FUNCS.options`：`create_UIBox_options()` 挂成 overlay（灰底 0.7） */
    private openOptions(): void {
        if (this.overlay) return;
        const bg: Colour = [C.GREY[0], C.GREY[1], C.GREY[2], 0.7];
        this.mountOverlay(optionsMenu({ seeded: this.seeded, seed: this.run.seed, stage: this.mainMenu ? 'menu' : 'run' }), bg, 0.7);
    }

    /** `G.FUNCS.settings`：三页设置，第一页 Game。控件的 `func`（滑条、开关）挂在每页的内容盒上 */
    private openSettings(): void {
        const hooks: SettingsHooks = {
            playDiscardPosition: () => {
                // `change_play_discard_position`：出牌 / 弃牌按钮整块重建
                this.buttonsView?.container.destroy();
                this.buttonsView = null;
                saveSettings();
            },
            contrast: () => {
                this.applySettings();
                this.rebuildHand();
                if (this.run.openPack) this.rebuildPackCards();
                if (this.run.state === 'shop') this.rebuildShop();
            },
            shadows: () => saveSettings(),
            smoothing: () => { this.applySettings(); saveSettings(); },
            volume: () => this.applySettings(),
        };
        const bg: Colour = [C.GREY[0], C.GREY[1], C.GREY[2], 0.7];
        this.mountOverlay(settingsMenu(SETTINGS, hooks, controlFuncs()), bg, 0.7);
    }

    /**
     * 设置里不是每帧读的那几项落到画面上：花色色（`refresh_contrast_mode`）、纹理滤波（`set_render_settings`：
     * Pixel Art Smoothing 关 = 最近邻，开 = 线性；原作开的时候还换 2 倍图，复刻件只有 1 倍图）、主音量与音效音量
     */
    private applySettings(): void {
        applySuitColours(SETTINGS.colourblind_option);
        const filter = SETTINGS.GRAPHICS.texture_scaling === 1 ? Textures.FilterMode.NEAREST : Textures.FilterMode.LINEAR;
        for (const key of this.textures.getTextureKeys()) this.textures.get(key).setFilter(filter);
        this.sound.volume = masterGain();
        // 音效再乘 `game_sounds_volume/100`（`SET_SFX`）。音乐走 `sound.add`，不经这里，由 `Music` 自己乘音乐音量
        const mgr = this.sound as typeof this.sound & { gamePlayPatched?: boolean };
        if (!mgr.gamePlayPatched) {
            const play = mgr.play.bind(mgr);
            mgr.play = ((key: string, extra?: Types.Sound.SoundConfig) =>
                play(key, { ...extra, volume: (extra?.volume ?? 1) * SETTINGS.SOUND.game_sounds_volume / 100 })) as typeof mgr.play;
            mgr.gamePlayPatched = true;
        }
    }

    /** `set_discover_tallies` 里图鉴首页要的那几项 */
    private collectionTallies(): CollectionTallies {
        const bySet = (set: string) => discoverTally((k, s) => s === set && k !== 'b_challenge');
        return {
            jokers: bySet('Joker'), backs: bySet('Back'), vouchers: bySet('Voucher'), tarots: bySet('Tarot'), planets: bySet('Planet'),
            spectrals: bySet('Spectral'), editions: bySet('Edition'), boosters: bySet('Booster'),
            tags: { tally: Object.keys(TAG_CENTERS).filter((k) => isDiscovered(k)).length, of: Object.keys(TAG_CENTERS).length },
            blinds: { tally: Object.keys(BLIND_CENTERS).filter((k) => isDiscovered(k)).length, of: Object.keys(BLIND_CENTERS).length },
        };
    }

    /** `G.FUNCS.your_collection` */
    private openCollection(): void {
        const bg: Colour = [C.GREY[0], C.GREY[1], C.GREY[2], 0.7];
        this.mountOverlay(yourCollection(this.collectionTallies()), bg, 0.7);
    }

    /** 图鉴分页开着时：哪一页、第几页、卡 */
    private collection: {
        spec: CollectionPageSpec; page: number;
        cards: Array<{ sprite: JokerSprite | ConsumableSprite | VoucherSprite | BoosterSprite | CardSprite; row: number }>;
        /** `overlay_infotip`：挂在框底下（`overlay_menu_infotip` 那个零尺寸节点，`bm`） */
        infotip: { view: UIBoxView; major: { T: Rect } } | null;
    } | null = null;

    private openCollectionPage(kind: CollectionPageSpec['kind']): void {
        const spec = COLLECTION_PAGES[kind];
        const bg: Colour = [C.GREY[0], C.GREY[1], C.GREY[2], 0.7];
        this.mountOverlay(collectionPage(spec, (page) => this.fillCollection(page)), bg, 0.7);
        this.collection = { spec, page: 1, cards: [], infotip: null };
        if (spec.infotip) {
            const major = { T: { x: 0, y: 0, w: 0, h: 0 } };
            const view = new UIBoxView(this, new UIBox(overlayInfotip(spec.infotip), { align: 'bm', offset: { x: 0, y: 0 }, major }), 201);
            view.setResolution(this.mapping.pxPerTile / toPx(1));
            this.collection.infotip = { view, major };
        }
        this.fillCollection(1);
    }

    private clearCollectionCards(): void {
        const c = this.collection;
        if (!c) return;
        if (c.cards.some((x) => this.popup?.sprite === x.sprite)) this.hidePopup();
        for (const x of c.cards) x.sprite.destroy();
        c.cards = [];
    }

    /** 图鉴的 Decks / Tags / Blinds 页开着时的东西 */
    private collectionMisc: {
        deck?: { index: number; sprite: DeckSprite };
        tagTargets?: Set<object>;
        blinds?: { zones: GameObjects.Zone[]; popup: { view: UIBoxView; major: { T: Rect } } | null };
    } | null = null;

    private closeCollectionMisc(): void {
        const m = this.collectionMisc;
        if (!m) return;
        m.deck?.sprite.destroy();
        if (m.tagTargets) this.clearTagHovers((t) => m.tagTargets!.has(t));
        for (const z of m.blinds?.zones ?? []) z.destroy();
        m.blinds?.popup?.view.destroy();
        this.collectionMisc = null;
    }

    /** `your_collection_decks`：选项循环翻牌组，换牌背、名字、说明 */
    private openCollectionDecks(index = 0): void {
        const bg: Colour = [C.GREY[0], C.GREY[1], C.GREY[2], 0.7];
        const frameOf = (i: number) => { const p = backPos(BACK_POOL[i]!); return p.y * 7 + p.x; };
        const o = this.mountOverlay(decksPage(index, LOOK.mobileUi, (i) => {
            const box = o.view.box;
            const key = BACK_POOL[i]!;
            for (const el of box.root.walk()) {
                if (el.config.id === 'deck_name') box.replaceObject(el, backNameText(key));
                if (el.config.id === 'deck_ui') box.replaceObject(el, new UIBox(backUi(key, LOOK.mobileUi), { offset: { x: 0, y: 0 } }));
            }
            this.collectionMisc?.deck?.sprite.setFrame(frameOf(i));
        }), bg, 0.7);
        this.collectionMisc = { deck: { index, sprite: new DeckSprite(this, { scale: 1.2, depth: 201, mainDeck: false, frame: frameOf(index) }) } };
    }

    /** `your_collection_tags`：悬停照 `Tag:generate_UI` 的 hover（倾斜、弹一下、两声、提示框；没发现的藏描述） */
    private openCollectionTags(): void {
        const bg: Colour = [C.GREY[0], C.GREY[1], C.GREY[2], 0.7];
        const { def, sprites } = tagsPage((k) => isDiscovered(k));
        const o = this.mountOverlay(def, bg, 0.7);
        const targets = new Set<object>();
        for (const { key, sprite } of sprites) {
            const el = [...o.view.box.root.walk()].find((e) => e.config.object === sprite);
            if (!el) continue;
            this.addTagHover(() => ({ x: el.x + o.view.slideOffset.x, y: el.y + o.view.slideOffset.y, w: el.T.w, h: el.T.h }), key, () => undefined, sprite,
                () => o.view.juiceObject(sprite, this.time.now / 1000, 0.05, 0.02), { depth: 203, hide: !isDiscovered(key) });
            targets.add(this.tagHoverZones[this.tagHoverZones.length - 1]!.target);
        }
        this.collectionMisc = { tagTargets: targets };
    }

    /** `your_collection_blinds`：悬停弹一下、`chips1`、`create_UIBox_blind_popup`（`cl`、左移 0.1） */
    private openCollectionBlinds(): void {
        const bg: Colour = [C.GREY[0], C.GREY[1], C.GREY[2], 0.7];
        const { def, chips } = blindsPage((k) => isDiscovered(k));
        const o = this.mountOverlay(def, bg, 0.7);
        const zones: GameObjects.Zone[] = [];
        const state: NonNullable<NonNullable<RunScene['collectionMisc']>['blinds']> = { zones, popup: null };
        for (const { key, chip } of chips) {
            const el = [...o.view.box.root.walk()].find((e) => e.config.object === chip);
            if (!el) continue;
            const zone = this.add.zone(0, 0, 1, 1).setOrigin(0, 0).setInteractive().setDepth(203);
            (zone as GameObjects.Zone & { uiEl?: UIElement }).uiEl = el;
            zone.on('pointerover', () => {
                o.view.juiceObject(chip, this.time.now / 1000, 0.05, 0.02);
                this.sound.play('chips1', { rate: Math.random() * 0.1 + 0.55, volume: 0.12 });
                state.popup?.view.destroy();
                const major = { T: { x: el.x, y: el.y, w: el.T.w, h: el.T.h } };
                const view = new UIBoxView(this, new UIBox(blindPopup(key, isDiscovered(key)), { align: 'cl', offset: { x: -0.1, y: 0 }, major }), 210);
                view.setResolution(this.mapping.pxPerTile / toPx(1));
                state.popup = { view, major };
            });
            zone.on('pointerout', () => { state.popup?.view.destroy(); state.popup = null; });
            zones.push(zone);
        }
        this.collectionMisc = { blinds: state };
    }

    /** 每帧：牌堆预览跟着格子；盲注悬停区与提示框跟着 overlay 的滑动 */
    private followCollectionMisc(now: number): void {
        const m = this.collectionMisc;
        const o = this.overlay;
        if (!m || !o) return;
        const slide = o.view.slideOffset;
        if (m.deck) {
            const el = [...o.view.box.root.walk()].find((e) => (e.config.object as { collectionDeck?: boolean } | undefined)?.collectionDeck);
            if (el) m.deck.sprite.update({ x: el.x + slide.x, y: el.y + slide.y, w: el.T.w, h: el.T.h }, 52);
        }
        if (m.blinds) {
            for (const z of m.blinds.zones) {
                const el = (z as GameObjects.Zone & { uiEl?: UIElement }).uiEl!;
                z.setPosition(toPx(el.x + slide.x), toPx(el.y + slide.y)).setSize(toPx(el.T.w), toPx(el.T.h));
                z.input!.hitArea.setTo(0, 0, toPx(el.T.w), toPx(el.T.h));
            }
            const p = m.blinds.popup;
            if (p) {
                p.view.box.followMajor();
                p.view.update(now);
            }
        }
    }

    /** 拆图鉴分页的额外东西（框下说明） */
    private closeCollectionExtras(): void {
        this.clearCollectionCards();
        this.collection?.infotip?.view.destroy();
    }

    /**
     * `your_collection_*_page`：拆掉这一页的卡、按页码从池子里取、造卡放进各行。图鉴里的卡没有 `bypass_discovery_center`：
     * 没解锁的小丑画锁、没发现的画问号，提示框相应是 Locked（解锁条件）/ Undiscovered（藏描述）
     */
    private fillCollection(page: number): void {
        const c = this.collection;
        if (!c) return;
        this.clearCollectionCards();
        c.page = page;
        const pool = c.spec.set === 'Seal' ? SEAL_POOL : c.spec.set === 'Edition' ? ['e_base', 'e_foil', 'e_holo', 'e_polychrome', 'e_negative'] : centerPool(c.spec.set);
        c.spec.rows.forEach((row, j) => {
            for (let i = 1; i <= row.limit; i++) {
                const key = pool[c.spec.index(page, j + 1, i) - 1];
                if (!key) break;
                const center = P_CENTERS[key];
                const locked = center?.unlocked === false;
                const discovered = isDiscovered(key);
                if (c.spec.set === 'Enhanced' || c.spec.set === 'Seal') {
                    // `Card(…, G.P_CARDS.empty, center)`：只画底板；蜡封页是 `c_base` 上 `set_seal`
                    // 不走 `makeCard`：那会推进 `sort_id`（洗牌的规范序），图鉴里的展示牌不能影响对局
                    const card: Card = {
                        key: 'S_A', base: makeBase('Spades', 'Ace'), sort_id: 0, unique_val: 0, debuff: false, played_this_ante: false,
                        forced_selection: false, facing: 'front', perma_bonus: 0, enhancement: null, T: { x: 0, y: 0, w: 0, h: 0 },
                    };
                    if (c.spec.set === 'Enhanced') card.enhancement = key as Card['enhancement'];
                    else card.seal = key as Card['seal'];
                    const sp = new CardSprite(this, card, () => undefined, { noFront: true });
                    sp.setBaseDepth(202, 201);
                    const pc = c.spec.set === 'Enhanced'
                        ? popupOfCenter(key, 'other')
                        : { ...popupOfCenter('c_base', 'other'), seal: key };
                    this.attachPopup(sp.hoverTargets, sp, () => pc);
                    c.cards.push({ sprite: sp, row: j + 1 });
                    continue;
                }
                if (c.spec.set === 'Edition') {
                    // `G.P_CENTERS.e_*` 的 `atlas = 'Joker', pos = {0,0}`：画的就是 Joker 那张；发现了才 `set_edition`（静音）。建出来时溶入
                    const joker = makeJokerInstance('j_joker');
                    if (discovered && key !== 'e_base') joker.edition = key.slice(2) as Joker['edition'];
                    const sp = new JokerSprite(this, joker, () => undefined, discovered ? undefined : 'undiscovered');
                    sp.setBaseDepth(202, 201);
                    playEnter(this, sp, [C.GREEN], i > 1);
                    this.attachPopup([sp.shader], sp, () => ({ ...popupOfCenter(key, 'other'), display: discovered ? undefined : 'Undiscovered' }));
                    c.cards.push({ sprite: sp, row: j + 1 });
                    continue;
                }
                if (c.spec.set === 'Voucher') {
                    const vc = VOUCHER_CENTERS[key]!;
                    const display = locked ? 'locked' as const : !discovered ? 'undiscovered' as const : undefined;
                    // `start_materialize(nil, i > 1 or j > 1)`：只有第一张出声
                    const sp = new VoucherSprite(this, vc, () => undefined, { card: 202, shadow: 201 }, { silent: i > 1 || j > 0 }, display);
                    this.attachPopup([sp.shader], sp, () => ({ ...popupOfCenter(key, 'other'), display: locked ? 'Locked' : !discovered ? 'Undiscovered' : undefined }));
                    c.cards.push({ sprite: sp, row: j + 1 });
                } else if (c.spec.set === 'Booster') {
                    const sp = new BoosterSprite(this, BOOSTER_CENTERS[key]!, () => undefined, discovered ? undefined : 'undiscovered');
                    sp.setBaseDepth(202, 201);
                    this.attachPopup([sp.shader], sp, () => ({ ...popupOfCenter(key, 'other'), display: discovered ? undefined : 'Undiscovered' }));
                    c.cards.push({ sprite: sp, row: j + 1 });
                } else if (c.spec.set === 'Joker') {
                    const joker = makeJokerInstance(key);
                    const display = locked ? 'locked' as const : !discovered ? 'undiscovered' as const : undefined;
                    const sp = new JokerSprite(this, joker, () => undefined, display);
                    sp.setBaseDepth(202, 201);
                    this.attachPopup([sp.shader], sp, () => ({ ...popupOfJoker(joker, 'other'), display: locked ? 'Locked' : !discovered ? 'Undiscovered' : undefined }));
                    c.cards.push({ sprite: sp, row: j + 1 });
                } else {
                    const con = makeConsumableInstance(key);
                    const sp = new ConsumableSprite(this, con, () => undefined, discovered ? undefined : 'undiscovered');
                    sp.setBaseDepth(202, 201);
                    this.attachPopup([sp.shader], sp, () => ({ ...popupOfConsumable(con, 'other'), display: discovered ? undefined : 'Undiscovered' }));
                    c.cards.push({ sprite: sp, row: j + 1 });
                }
            }
        });
    }

    /** 每帧：各行按 `align_cards` 的 title 分支摆（含 overlay 的滑动） */
    private followCollection(now: number): void {
        const c = this.collection;
        const o = this.overlay;
        if (!c || !o) return;
        const slide = o.view.slideOffset;
        if (c.infotip) {
            const el = o.view.box.getById('overlay_menu_infotip');
            if (el) Object.assign(c.infotip.major.T, { x: el.x + slide.x, y: el.y + slide.y, w: el.T.w, h: el.T.h });
            c.infotip.view.box.followMajor();
            c.infotip.view.update(now);
        }
        for (const el of o.view.box.root.walk()) {
            const area = el.config.object as CollectionArea | undefined;
            if (!area?.collectionArea) continue;
            const cards = c.cards.filter((x) => x.row === area.row).map((x) => x.sprite);
            const rect = { x: el.x + slide.x, y: el.y + slide.y, w: el.T.w, h: el.T.h };
            const U = toPx(1);
            const align = c.spec.areaType === 'voucher' ? alignVoucher : alignTitle;
            align(rect, cards.map((s) => ({ highlighted: false, prevX: s.prevX, w: s.w / U, h: s.h / U })), area.limit, now)
                .forEach((p, i) => cards[i]!.place(p, i));
        }
    }

    /**
     * `discover_card` 的几个来路收成一处：在场的小丑与消耗品（`add_to_deck`）、它们的版本、兑换过的优惠券、牌组里的强化与版本。
     * 用掉的消耗品、开的包、打过的盲注、拿到的标签在各自那一处单独记。指定种子的局都不记
     */
    private discoverVisible(): void {
        const seeded = this.seeded;
        const d = (k: string | undefined) => { if (k) discover(k, seeded); };
        for (const j of this.run.jokers) { d(j.key); if (j.edition) d(`e_${j.edition}`); }
        for (const c of this.run.consumables) { d(c.key); if (c.edition) d(`e_${c.edition}`); }
        for (const v of this.run.usedVouchers) d(v);
        for (const t of this.run.tags) d(t.key); // `add_tag` 的 discover
        for (const card of this.run.fullDeck) { d(card.enhancement ?? undefined); if (card.edition) d(`e_${card.edition}`); }
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
        this.syncHandRowHovers();
    }

    /** Poker Hands 页每一行的悬停区（UIBoxView 只给按钮建命中区） */
    private handRowHovers: Array<{ zone: GameObjects.Zone; el: UIElement }> = [];
    /** 当前显示的牌型说明：提示框与五张示例牌 */
    private handTipShown: { view: UIBoxView; cards: MiniCard[]; major: { T: Rect }; el: UIElement; start: number } | null = null;

    private syncHandRowHovers(): void {
        for (const h of this.handRowHovers) h.zone.destroy();
        this.handRowHovers = [];
        this.hideHandTip();
        const inner = this.overlay?.view.box.getById('tab_contents')?.config.object as UIBox | undefined;
        if (!inner) return;
        for (const el of inner.root.walk()) {
            const tip = el.config.on_demand_tooltip as { hand: string } | undefined;
            const plain = el.config.tooltip as { text: string[] } | undefined;
            if (!tip && !plain) continue;
            // O 节点带的 tooltip 与它外层 C 节点的是同一个（`tally_sprite`），外层那个就够了
            if (plain && el.UIT === UIT.O && el.parent?.parent?.config.tooltip) continue;
            const zone = this.add.zone(0, 0, 1, 1).setOrigin(0, 0).setInteractive().setDepth(203);
            zone.on('pointerover', () => (tip ? this.showHandTip(el, tip.hand) : this.showTooltip(el, plain!.text)));
            zone.on('pointerout', () => { if (this.handTipShown?.el === el) this.hideHandTip(); });
            this.handRowHovers.push({ zone, el });
        }
    }

    /**
     * `UIElement:hover` 的 `on_demand_tooltip`：`create_popup_UIBox_tooltip{text = 牌型说明, filler = create_UIBox_hand_tip}`，
     * 行在下半屏挂 `tm`（上提 0.1）、上半屏 `bm`（下压 0.1）。示例牌半尺寸，计分的放大 0.25 并弹一下、不计分的缩 0.15
     */
    private showHandTip(el: UIElement, hand: string): void {
        this.hideHandTip();
        const o = this.overlay;
        if (!o) return;
        const example = HAND_EXAMPLES[hand];
        const tip = handTip(hand, !!example);
        const slide = o.view.slideOffset.y;
        const major = { T: { x: el.x, y: el.y + slide, w: el.T.w, h: el.T.h } };
        const lower = el.y > TILE_H / 2;
        const box = new UIBox(popupTooltip(HAND_DESCRIPTIONS[hand] ?? [], tip.def), { align: lower ? 'tm' : 'bm', offset: { x: 0, y: lower ? -0.1 : 0.1 }, major });
        const view = new UIBoxView(this, box, 205);
        view.setResolution(this.mapping.pxPerTile / toPx(1));
        const cards = (example ?? []).map(([key]) => new MiniCard(this, key, 0.5 * CARD_W, 0.5 * CARD_H, 207));
        this.handTipShown = { view, cards, major, el, start: this.time.now / 1000 };
        example?.forEach(([, scoring], i) => { if (scoring) this.time.delayedCall(0, () => cards[i]?.juiceUp(0.3, 0.2)); });
        this.sound.play('paper1', { rate: 0.95 + Math.random() * 0.1, volume: 0.3 });
    }

    /** `UIElement:hover` 的 `tooltip`：`create_popup_UIBox_tooltip(tooltip)`，挂 `tm`、上提 0.1 */
    private showTooltip(el: UIElement, text: string[]): void {
        this.hideHandTip();
        const o = this.overlay;
        if (!o) return;
        const major = { T: { x: el.x, y: el.y + o.view.slideOffset.y, w: el.T.w, h: el.T.h } };
        const box = new UIBox(popupTooltip(text, null), { align: 'tm', offset: { x: 0, y: -0.1 }, major });
        const view = new UIBoxView(this, box, 205);
        view.setResolution(this.mapping.pxPerTile / toPx(1));
        this.handTipShown = { view, cards: [], major, el, start: this.time.now / 1000 };
    }

    private hideHandTip(): void {
        const t = this.handTipShown;
        if (!t) return;
        t.view.destroy();
        for (const c of t.cards) c.destroy();
        this.handTipShown = null;
    }

    /** 每帧：悬停区跟着行走；示例牌按 CardArea `title` 分支摆（`card_w` 是整张卡宽，牌本身半宽） */
    private followRunInfoHovers(now: number): void {
        const o = this.overlay;
        if (!o) return;
        const slide = o.view.slideOffset.y;
        for (const { zone, el } of this.handRowHovers) {
            zone.setPosition(toPx(el.x), toPx(el.y + slide)).setSize(toPx(el.T.w), toPx(el.T.h));
            zone.input!.hitArea.setTo(0, 0, toPx(el.T.w), toPx(el.T.h));
        }
        const t = this.handTipShown;
        if (!t) return;
        Object.assign(t.major.T, { x: t.el.x, y: t.el.y + slide });
        t.view.box.followMajor();
        t.view.update(now);
        const areaEl = [...t.view.box.root.walk()].find((e) => (e.config.object as { kind?: string } | undefined)?.kind === 'hand_tip');
        if (!areaEl) return;
        const n = t.cards.length;
        const example = HAND_EXAMPLES[(areaEl.config.object as unknown as { hand: string }).hand] ?? [];
        const grown = now - t.start;
        t.cards.forEach((card, i) => {
            const k = i + 1;
            const cw = 0.5 * CARD_W;
            const ch = 0.5 * CARD_H;
            const maxCards = Math.max(n, 5);
            const x = areaEl.x + (areaEl.T.w - CARD_W) * ((k - 1) / Math.max(maxCards - 1, 1) - (0.5 * (n - maxCards)) / Math.max(maxCards - 1, 1)) + 0.5 * (CARD_W - cw);
            const y = areaEl.y + areaEl.T.h / 2 - ch / 2 + wobble() * 0.03 * Math.sin(0.666 * now + x) + Math.abs((0.5 * (-n / 2 + k - 0.5)) / n) - (n > 1 ? 0.2 : 0);
            const r = (0.2 * (-n / 2 - 0.5 + k)) / n + wobble() * 0.02 * Math.sin(2 * now + x);
            // `ease_value(card.T, 'scale', ±, nil, 'REAL', true, 0.2)`：0.2 秒线性从 0.95 缓到 1.2 / 0.8
            const p = Math.min(1, grown / 0.2);
            const scale = 0.95 + (example[i]?.[1] ? 0.25 : -0.15) * p;
            card.place(x, y, r, scale);
        });
    }

    /** Vouchers 页当前那几格（`usedVouchers` 建页时写） */
    private runInfoVoucherAreas: VoucherArea[] = [];

    /** 切到 Vouchers 页时给每格造卡（原作 `Card(...)` + `emplace`），离开这一页就拆掉 */
    private syncRunInfoVouchers(showing: boolean): void {
        const o = this.overlay;
        if (!o) return;
        if (o.vouchers.some((v) => this.popup?.sprite === v.sprite)) this.hidePopup();
        for (const v of o.vouchers) v.sprite.destroy();
        o.vouchers = [];
        if (!showing) return;
        // `used_vouchers`：每张 `start_materialize(nil, silent)`，只有第一张出声；溶完（1.05 × 0.6 秒）才能悬停出提示框
        let silent = false;
        for (const area of this.runInfoVoucherAreas) {
            for (const key of area.keys) {
                const s = new VoucherSprite(this, VOUCHER_CENTERS[key]!, () => undefined, { card: 202, shadow: 201.5 }, { silent });
                silent = true;
                s.shader.on('pointerover', () => { if (s.hoverable) this.showPopup(s, popupOfCenter(key, 'other'), false); });
                s.shader.on('pointerout', () => { if (this.popup?.sprite === s) this.hidePopup(); });
                o.vouchers.push({ sprite: s, area });
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
        const slide = o.view.slideOffset.y;
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
                const y = el.y + slide + area.T.h / 2 - CARD_H / 2 + wobble() * 0.03 * Math.sin(0.666 * now + x0) + Math.abs((0.5 * (-n / 2 + k - 0.5)) / n) - (n > 1 ? 0.2 : 0);
                const r = (0.2 * (-n / 2 - 0.5 + k)) / n + wobble() * 0.02 * Math.sin(2 * now + x0);
                card.place({ x: x0, y, r }, i);
            });
        }
    }

    private stepOverlay(now: number): void {
        const o = this.overlay;
        if (!o) return;
        // `ease_value` 的缺省：0.3 秒线性
        const p = Math.min(1, (now - o.alpha.start) / 0.3);
        o.bg[3] = o.alpha.from + (o.alpha.to - o.alpha.from) * p;
        o.view.update(now);
        o.jimbo?.update(now);
        this.placeRunInfoVouchers(now);
        this.placeDeckViewCards(now);
        this.followRunInfoHovers(now);
        this.followRunSetup(now);
        this.followCollection(now);
        this.followCollectionMisc(now);
    }

    private onOverlayButton(name: string, el?: UIElement): void {
        if (name === 'change_tab' && el && this.overlay) {
            const tab = el.config.ref_table as Tab;
            changeTab(this.overlay.view.box, tab);
            this.syncRunInfoVouchers(tab.label === DICTIONARY.b_vouchers);
            this.syncDeckViewCards();
            this.syncHandRowHovers();
            this.sound.play('button', { volume: 0.3 });
            this.juice.jiggle += 0.5;
            return;
        }
        if (name === 'copy_seed') {
            void navigator.clipboard?.writeText(this.run.seed).catch(() => undefined);
            return;
        }
        if (handleControlButton(name, el!)) {
            this.sound.play('button', { volume: 0.3 });
            return;
        }
        if (name === 'settings' || name === 'options') {
            // Options ↔ Settings：换掉整块 overlay（`overlay_menu` 先拆旧的），新的从下面滑上来
            this.closeOverlay();
            if (name === 'settings') this.openSettings();
            else this.openOptions();
            return;
        }
        if (name === 'exit_overlay_menu') {
            // Endless：关掉胜利窗口接着打。`exit_overlay_menu` 顺手存设置
            this.closeOverlay();
            saveSettings();
            return;
        }
        // 复刻件没有主菜单与开局设置（牌组 / 赌注 / 种子都定死）：
        // 「New Run」换一个随机种子重开，「Main Menu」同种子重开。都走整页重载，URL 上的 ?seed 就是这一局的种子
        // New Run：开局设置（`setup_run`）；从结束界面来的没有 Back（`notify_then_setup_run` → `from_game_over`）
        if (name === 'setup_run' || name === 'notify_then_setup_run') {
            this.closeOverlay();
            this.openRunSetup(name === 'notify_then_setup_run');
            return;
        }
        if (this.handleRunSetupButton(name, el)) return;
        // 图鉴：首页 ↔ 分页都是换掉整块 overlay
        if (name === 'your_collection') {
            this.closeOverlay();
            this.openCollection();
            return;
        }
        if (name === 'your_collection_decks' || name === 'your_collection_tags' || name === 'your_collection_blinds') {
            this.closeOverlay();
            if (name === 'your_collection_decks') this.openCollectionDecks();
            else if (name === 'your_collection_tags') this.openCollectionTags();
            else this.openCollectionBlinds();
            return;
        }
        const page = /^your_collection_(jokers|tarots|planets|spectrals|vouchers|boosters|enhancements|seals|editions)$/.exec(name)?.[1] as CollectionPageSpec['kind'] | undefined;
        if (page) {
            this.closeOverlay();
            this.openCollectionPage(page);
            return;
        }
        // 「Main Menu」（`go_to_menu` → `G:main_menu('game')`）：整页重载，去掉种子就是主菜单
        if (name === 'go_to_menu') {
            saveSettings();
            const params = new URLSearchParams(location.search);
            params.delete('seed');
            params.delete('rs');
            params.set('menu', 'game');
            this.wipeTo(params);
        }
    }

    private onUIButton(name: string): void {
        const round = this.round;
        if (this.bossRerollLock) return;
        if (name === 'select_blind') {
            this.doNext();
            return;
        }
        if (name === 'skip_blind') {
            this.doSkipBlind();
            return;
        }
        if (name === 'deck_info') {
            this.openDeckInfo();
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
        // 飞向弃牌堆的
        const now = real;
        this.discarding = this.discarding.filter(({ sprite, until }) => {
            if (now > until) {
                sprite.destroy();
                return false;
            }
            const d = this.areas.discard;
            sprite.place({ x: d.x, y: d.y, r: 0 }, 30);
            return true;
        });
        // 计分牌被 `highlight_card` 抬起来
        alignPlay(this.areas.play, played.map((s) => ({ highlighted: s.highlighted, prevX: s.prevX })), 5)
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
        this.discoverVisible();
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
        if (this.splash) {
            const p = this.input.activePointer;
            const P = this.mapping.pxPerTile;
            this.placeRoom(stepRoomJuice(this.juice, delta / 1000, time / 1000, SETTINGS.screenshake,
                { x: p.x / P, y: p.y / P }, { x: this.mapping.roomX, y: this.mapping.roomY }));
            this.splash.update(time / 1000);
            return;
        }
        if (this.mainMenu) {
            this.updateMainMenu(time, delta);
            return;
        }
        // `game.lua:2730` 的 `SPEEDFACTOR`：局内、没暂停（overlay 开着就是暂停）时按设置的游戏速度走事件队列
        this.queue.update((delta / 1000) * (this.overlay ? 1 : SETTINGS.GAMESPEED));
        // `update_canvas_juice`：光标用屏幕 tile 坐标（`G.CURSOR.T`）
        const p = this.input.activePointer;
        const P = this.mapping.pxPerTile;
        this.placeRoom(stepRoomJuice(this.juice, delta / 1000, time / 1000, SETTINGS.screenshake,
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
        this.stepOverlay(time / 1000);
        this.stepRetiring(time / 1000);
        if (this.shopUi) {
            const hidden = !!this.run.openPack;
            // 开包时外框自己滑到屏幕下面（`slideTo`），价签跟着卡一起收起
            this.shopUi.view.update(time / 1000);
            for (const v of this.shopUi.tags) {
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
        this.placeUsing(time / 1000);
        // 牌堆：盲注里是剩余张数，盲注外整副牌都在牌堆里
        this.deckSprite.update(this.areas.deck, this.deckCount());
        this.syncDeckPreview(time / 1000);
        this.syncMusic(time / 1000);
        for (const a of this.attentionTexts) a.update(time / 1000);
        this.attentionTexts = this.attentionTexts.filter((a) => !a.done);
    }

    /**
     * `Game:main_menu`：`prep_stage(MAIN_MENU)` 清掉局里的一切，只剩旋涡、标志、黑桃 A 与三块 UI。
     * 复刻件的场景仍按局来建（Options / 图鉴 / 开局设置都长在它上面），这里把局里看得见的东西全藏起来、不再逐帧更新
     */
    private enterMainMenu(context: MenuContext, real0 = 12): void {
        this.mainMenu = new MainMenu(this, context, (name) => this.onMainMenuButton(name), this.mapping.pxPerTile / toPx(1), real0);
        this.fullscreenQuads.push(this.mainMenu.splash);
        this.placeRoom({ x: this.mapping.roomX, y: this.mapping.roomY, r: 0 });
    }

    /** 主菜单与 splash 时局里看得见的东西全藏起来（局照常建，Options / 图鉴 / 开局设置都长在场景上） */
    private hideRun(): void {
        this.hudView.setVisible(false);
        this.hudBlindView.setVisible(false);
        for (const a of this.areaViews) a.view.setVisible(false);
        for (const t of [this.hud, this.handPreview, this.jokerInfo, this.message, this.nextBtn, this.rerollBtn, this.skipBlindBtn]) t.setVisible(false);
        for (const f of this.flames) f.quad.setVisible(false);
        this.deckZone.disableInteractive();
        this.blindChipZone.disableInteractive();
        this.bgQuad?.setVisible(false);
    }

    /** `Game:splash_screen`：走完（或被点掉）进主菜单；从 splash 走完的 `REAL` 接着走 */
    private startSplash(): void {
        const splash = new Splash(this, (context, real) => {
            this.fullscreenQuads.splice(0, this.fullscreenQuads.length, ...this.fullscreenQuads.filter((q) => q !== splash.back && q !== splash.front));
            this.splash = null;
            this.enterMainMenu(context, context === 'splash' ? real : 12);
        });
        this.splash = splash;
        this.fullscreenQuads.push(splash.back, splash.front);
        // `queue_L_cursor_press`：splash 时点一下 = `escape` = 跳到主菜单
        this.input.on('pointerdown', () => this.splash?.skip());
    }

    /**
     * 主菜单上的按钮。PLAY 进开局设置（教程做完了的 `setup_run`），OPTIONS、COLLECTION 同局里。
     * Profile / 语言 / 链接三个按钮原作各开一个 overlay（存档选择、语言列表、FAQ 与社交链接），复刻件没有这几页：画照原样、点了没反应
     */
    private onMainMenuButton(name: string): void {
        if (this.overlay) return;
        if (name === 'setup_run') this.openRunSetup(false);
        else if (name === 'options') this.openOptions();
        else if (name === 'your_collection') this.openCollection();
    }

    /** `wipe_on` / `wipe_off` 挂上，并用一块全屏挡板吞掉输入 */
    private startWipe(phase: 'on' | 'off', key: string, onSwitch?: () => void): void {
        const wipe = new ScreenWipe(this, phase, key, () => this.bg.now.C, onSwitch);
        const blocker = this.add.zone(-toPx(TILE_W * 3), -toPx(TILE_H * 3), toPx(TILE_W * 7), toPx(TILE_H * 7))
            .setOrigin(0, 0).setInteractive().setDepth(459);
        this.wipe = { wipe, blocker };
        this.time.delayedCall(1200, () => {
            if (phase === 'off' && this.wipe?.wipe === wipe) {
                blocker.destroy();
                this.wipe = null;
            }
        });
    }

    /**
     * `delete_run` + `start_run` / `main_menu`：地址栏换成新局面（刷新仍能回到这里），拆掉这个场景实例、起一个新的。
     * 新实例的字段全是新的（不用 `scene.restart`——那会复用同一个对象，上一局的状态全留着）；音乐交过去接着放
     */
    private swapScene(params: URLSearchParams, wipe: string): void {
        history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
        saveSettings();
        RunScene.carry = { music: this.music };
        const game = this.game;
        const next = new RunScene(`Run${++RunScene.serial}`);
        game.scene.remove(this.scene.key);
        game.scene.add(next.sys.settings.key, next, true, { wipe });
    }

    /** 换局 / 回主菜单：先放 `wipe_on`，0.7 秒（场景切换那一刻）换场景实例，新实例接着放 `wipe_off` */
    private wipeTo(params: URLSearchParams): void {
        if (this.wipe) return;
        const key = randomCardKey();
        this.startWipe('on', key, () => this.swapScene(params, key));
    }

    /** 主菜单这一帧：房间的余振、旋涡与标志、overlay、提示框、音乐（`music1`，没有局就没有火与管风琴） */
    private updateMainMenu(time: number, delta: number): void {
        this.queue.update(delta / 1000);
        const now = time / 1000;
        const p = this.input.activePointer;
        const P = this.mapping.pxPerTile;
        this.placeRoom(stepRoomJuice(this.juice, delta / 1000, now, SETTINGS.screenshake,
            { x: p.x / P, y: p.y / P }, { x: this.mapping.roomX, y: this.mapping.roomY }));
        this.mainMenu!.update(now);
        // `ease_background_colour{new_colour = G.C.BLACK, contrast = 1}`：主菜单不画背景 shader，但转场方块读 `G.C.BACKGROUND.C`
        this.easeBackground(backgroundTarget({ new_colour: C.BLACK, contrast: 1 }));
        this.stepOverlay(now);
        this.followPopup(now);
        tickColours(now);
        this.music.update(now, {
            track: desiredTrack({ packKind: null, packFading: null, inShop: false, boss: false }),
            gameOver: false, earned: 0, required: 0, flames: 0, fireChange: 0,
        });
    }

    /** 两团分数火：状态、贴片、挂在哪个元素上 */
    private flames: Array<{ state: FlameState; quad: GameObjects.Shader; el: UIElement }> = [];
    private flameLastT = -1;

    /**
     * `flame_handler`：筹码格与倍率格各一张 2.5×2.5 的 `flame` 贴片，`bmi` 挂在格子底部，画在底框之后、数字之前。
     * 主色是格子本色，火舌尖的亮色是它与黄的混色（`UI_CHIPLICK` / `UI_MULTLICK`）
     */
    private createFlames(): void {
        const lick = (c: Colour): Colour => [0, 1, 2].map((i) => Math.min(Math.max((c[i]! * 0.5 + [1, 1, 0][i]! * 0.5 + 0.1) ** 2, 0.1), 1)).concat(1) as Colour;
        [['flame_chips', C.UI_CHIPS], ['flame_mult', C.UI_MULT]].forEach(([id, colour], i) => {
            const el = this.hudView.box.getById(id as string);
            if (!el) return;
            const state = new FlameState(this.time.now / 1000);
            const c1 = colour as Colour;
            const c2 = lick(c1);
            const quad = this.add.shader({
                name: `flame_${id}`, fragmentSource: FLAME_FRAG, vertexSource: DISSOLVE_VERT,
                setupUniforms: (u: (n: string, v: unknown) => void) => {
                    u('time', state.timer);
                    u('amount', state.realIntensity);
                    u('texture_details', [0, -1, 1, 1]);
                    u('image_details', [1, -1]);
                    u('colour_1', c1);
                    u('colour_2', c2);
                    u('id', 1000 + i * 7.3);
                    u('mouse_screen_pos', [0, 0]);
                    u('hovering', 0);
                    u('screen_scale', 1);
                    u('uScreenSize', [this.scale.width, this.scale.height]);
                },
            }, 0, 0, toPx(2.5), toPx(2.5));
            this.hudView.attach(el, quad);
            this.flames.push({ state, quad, el });
        });
    }

    /** 每帧：按本手分推进两团火、把贴片摆到格子底部 */
    private syncFlames(now: number, earned: number, required: number): void {
        const dt = this.flameLastT < 0 ? 0 : Math.min(now - this.flameLastT, 0.1);
        this.flameLastT = now;
        for (const f of this.flames) {
            f.state.step(dt, earned, required, !!this.run.openPack);
            const box = f.el.parent!;
            f.quad.setPosition(toPx(box.x + box.T.w / 2), toPx(box.y + box.T.h - 1.25));
        }
    }

    /** `modulate_sound`：挑音轨、游戏结束降调、管风琴跟着本手分数 */
    private syncMusic(now: number): void {
        const run = this.run;
        const round = this.round;
        if (this.packFade && now > this.packFade.until) this.packFade = null;
        const blindKey = run.state === 'playing' ? run.blindKey : this.roundEval?.blindHeld ? this.roundEval.last.blindKey : null;
        // `score_intensity.earned_score`：本手那格的筹码 × 倍率（选牌预览时也算）
        const hand = this.hudState.current_round.current_hand;
        const earned = typeof hand.chips === 'number' && typeof hand.mult === 'number' ? hand.chips * hand.mult : 0;
        const required = round?.requirement ?? 0;
        this.syncFlames(now, earned, required);
        const chipFlame = this.flames[0]?.state;
        this.music.update(now, {
            track: desiredTrack({
                packKind: run.openPack?.center.kind ?? null,
                packFading: this.packFade?.kind ?? null,
                inShop: !!this.shopUi,
                boss: !!blindKey && !!BLIND_CENTERS[blindKey]?.boss,
            }),
            gameOver: this.runOver,
            earned,
            required,
            flames: chipFlame ? flamesIntensity(chipFlame) : 0,
            fireChange: this.flames.reduce((a, f) => a + f.state.change, 0),
        });
    }

    /**
     * `Game:update_selecting_hand`（`game.lua:3371`）：选牌时悬停牌堆最上面那张，建 `G.deck_preview`
     * （挂手牌区 `tm`、上移 0.8），同时藏起出牌 / 弃牌按钮；移开就拆、按钮回来
     */
    private syncDeckPreview(now: number): void {
        const chip = this.hudBlindChip();
        if (chip) {
            const o = this.hudBlindView.slideOffset;
            this.blindChipZone.setPosition(toPx(chip.x + o.x), toPx(chip.y + o.y)).setSize(toPx(chip.T.w), toPx(chip.T.h));
            this.blindChipZone.input!.hitArea.setTo(0, 0, toPx(chip.T.w), toPx(chip.T.h));
        }
        const top = DeckSprite.topRect(this.areas.deck, this.deckCount());
        if (top) {
            this.deckZone.setPosition(toPx(top.x), toPx(top.y)).setSize(toPx(top.w), toPx(top.h));
            this.deckZone.input!.hitArea.setTo(0, 0, toPx(top.w), toPx(top.h));
        } else this.deckHovered = false;
        const round = this.round;
        const want = this.deckHovered && !!round && this.run.state === 'playing' && round.phase === 'selecting' && !this.overlay && !this.run.openPack;
        if (want && !this.deckPreview) {
            const box = new UIBox(deckPreview({
                playingCards: this.run.fullDeck,
                inDeck: new Set(round.deck),
                wheelFlipped: new Set(round.hand.filter((c) => c.facing === 'back')),
                smeared: this.run.jokers.some((j) => j.key === 'j_smeared' && !j.debuff),
            }), { align: 'tm', offset: { x: 0, y: -0.8 }, major: { T: this.areas.hand } });
            this.deckPreview = new UIBoxView(this, box, 46);
            this.deckPreview.setResolution(this.mapping.pxPerTile / toPx(1));
        } else if (!want && this.deckPreview) {
            this.deckPreview.destroy();
            this.deckPreview = null;
        }
        this.buttonsView?.setVisible(!this.deckPreview);
        this.deckPreview?.update(now);

        // `cardarea.lua:411`：没被 overlay 盖着、牌堆被悬停（或者 deck_preview 开着）就画「View Deck」
        const label = top && !this.overlay && (this.deckHovered || !!this.deckPreview);
        if (label && !this.viewDeckLabel) {
            const major = { T: { ...top } };
            const view = new UIBoxView(this, new UIBox(viewDeckLabel(), { align: 'cm', offset: { x: 0, y: 0 }, major }), 44).setPassThrough();
            view.setResolution(this.mapping.pxPerTile / toPx(1));
            this.viewDeckLabel = { view, major };
        } else if (!label && this.viewDeckLabel) {
            this.viewDeckLabel.view.destroy();
            this.viewDeckLabel = null;
        }
        if (this.viewDeckLabel && top) {
            Object.assign(this.viewDeckLabel.major.T, top);
            this.viewDeckLabel.view.box.followMajor();
            this.viewDeckLabel.view.update(now);
        }
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
                this.addTagHover(() => ({ x: sprite.x, y: sprite.y, w: sprite.T.w, h: sprite.T.h }), tag.key, () => tag.orbitalHand,
                    sprite.config.object as TagSpriteObject, () => view.juiceObject(sprite.config.object!, this.time.now / 1000, 0.05, 0.02));
                // `Tag:generate_UI` 末尾的 `tag_sprite:juice_up()`：新拿到的标签弹一下（缺省幅度 0.4）
                if (!cur.list.includes(tag)) view.juiceObject(sprite.config.object!, now, 0.4);
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
        // 还没飞出来的新牌算在牌堆里
        if (this.round && this.run.state === 'playing') {
            const shown = new Set(this.sprites.filter((s) => s.appeared).map((s) => s.card));
            return this.round.deck.length + this.round.hand.filter((c) => !shown.has(c)).length;
        }
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
                // 摸牌 / 出牌动画中按屏幕上的算（逻辑层早就摸好了）
                const shown = this.animating ? this.sprites.filter((s) => !this.inPlay.has(s) && s.appeared).length : round?.hand.length ?? 0;
                [c.card_count, c.card_limit] = [shown, round?.handLimit ?? 8];
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
        s.dollars = (inRound ? round.dollars : run.dollars - this.pendingPayout) - this.heldDollars;
        // `ease_dollars`：金额格上盖一块金（加）/ 红（减）色块、冒「+$N」（同一帧里的几笔合成一笔；`coin1` 由各处自己放）
        if (this.lastDollars !== null && s.dollars !== this.lastDollars) this.dollarsPopup(s.dollars - this.lastDollars);
        this.lastDollars = s.dollars;
        s.round = run.roundNumber;
        s.round_resets.ante = run.ante;
        const last = this.roundEval?.last;
        s.chips_text = numberFormat(Math.floor(this.shownRoundChips?.v ?? (inRound ? round.chips : last?.chips ?? 0)));
        s.current_round.hands_left = round ? round.handsLeft : last?.handsLeft ?? 4 + run.vouchers.hands;
        s.current_round.discards_left = round
            ? round.discardsLeft
            : last?.discardsLeft ?? 3 + RED_DECK.config.discards + run.vouchers.discards;

        // 选牌时（`CardArea:parse_highlighted` → `update_hand_text{immediate, nopulse, delay = 0}`）：本手那一格显示选中那几张的牌型；
        // 计分中由出牌的事件流写，这里不碰
        if (!this.animating) {
            const preview = round && this.selected.size > 0 ? evaluatePokerHand(this.selectedInOrder()) : null;
            const info = preview?.topName ? round!.hands[preview.topName] : null;
            this.applyHandText({
                handname: preview?.topName ?? '', level: info ? info.level : '', chips: info?.chips ?? 0, mult: info?.mult ?? 0,
            }, { nopulse: true });
        }

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
        this.bgQuad = bg;
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
        this.mainMenu?.setResolution(this.mapping.pxPerTile / toPx(1));
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
        // 纹理名按场景实例区分：换局时新旧两个实例会短暂并存，旧的那张随实例一起拆掉
        const frameKey = `scene_${this.sys.settings.key}`;
        this.add.captureFrame(frameKey).setDepth(500);
        this.events.once('destroy', () => { if (this.textures.exists(frameKey)) this.textures.remove(frameKey); });

        const crt = this.add.shader(
            {
                name: 'crt',
                fragmentSource: CRT_FRAG,
                vertexSource: CRT_VERT,
                setupUniforms: (setUniform: (n: string, v: unknown) => void) => {
                    // 扫描线密度与色散都按画布像素算（`G.CANVAS:getPixelHeight()`、`love_ScreenSize`）。
                    // 画布曾经只有 1512×806 再被 CSS 放大，线粗一倍多（21 号票在模拟器上并排看出来的）
                    const u = crtUniforms(SETTINGS.GRAPHICS.crt, this.scale.width, this.scale.height, this.time.now / 1000);
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
            [frameKey],
        );
        crt.setDepth(1000);
        this.fullscreenQuads.push(crt);
    }
}

export const RUN_SCENE_SIZE = { width: CANVAS_W, height: CANVAS_H, cardH: toPx(CARD_H) };
