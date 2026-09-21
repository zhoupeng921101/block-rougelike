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
import { getBlindAmount } from '../../core/scoring';
import { CardSprite } from '../card-sprite';
import { BoosterSprite } from '../booster-sprite';
import { ConsumableSprite } from '../consumable-sprite';
import { CANVAS_H, CANVAS_W, CARD_H, CARD_W, TILE_H, TILE_W, roomMapping, toPx } from '../coords';
import { UIBoxView, UI_FONT_FAMILY } from '../ui-draw';
import { makeRoomJuice, stepRoomJuice } from '../room-juice';
import { applyBlindColours } from '../../ui/blind-colour';
import { C, mixColours, setColour } from '../../ui/colours';
import { type HudState, createHud, makeHudState } from '../../ui/definitions/hud';
import { type AreaCount, cardAreaBox } from '../../ui/definitions/card-area';
import { cardAreas } from '../areas';
import { alignHand, alignPlay } from '../align-cards';
import { numberFormat } from '../../ui/format';
import { UIBox } from '../../ui/uibox';
import { RED_DECK } from '../../core/run';
import { JokerSprite } from '../joker-sprite';
import { LOOK } from '../look';
import { VoucherSprite } from '../voucher-sprite';
import { BACKGROUND_COLOURS, BACKGROUND_FRAG, BACKGROUND_VERT } from '../shaders/background';
import { CRT_FRAG, CRT_VERT, crtUniforms } from '../shaders/crt';

/** 小丑区，画在最上面一排 */
const JOKER_Y_TILES = 0.5;
const JOKER_X_TILES = 9.0;
/** 消耗品区，接在小丑区右边。5 格小丑 + 2 格消耗品 */
const CONSUMABLE_Y_TILES = 0.5;
const CONSUMABLE_X_TILES = JOKER_X_TILES + 5 * (CARD_W + 0.15) + 0.6;
/** 商店那两格 */
const SHOP_Y_TILES = 4.0;
const SHOP_X_TILES = 6.5;
/** 补充包那两格，画在商店格子下面一排 */
const PACK_Y_TILES = SHOP_Y_TILES - 3.2;
const PACK_X_TILES = SHOP_X_TILES;
/** 开着的包：内容摊在屏幕中间 */
const PACK_OPEN_Y_TILES = 1.6;
const PACK_OPEN_X_TILES = 1.2;

/**
 * 版本的文字标记。
 *
 * **版本的 shader 没有移植**（原作每种版本一个 `.fs`，与 `dissolve` 并列），
 * 所以这一版只用文字标出来——不标的话玩家分不出一张 Polychrome 的小丑
 * 和普通小丑，而两者差 ×1.5。
 */
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
    private skipBtn!: GameObjects.Text;
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
    /** 四个 CardArea 身后的底框与计数（`cardarea.lua:288`） */
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
    private playBtn!: GameObjects.Text;
    private discardBtn!: GameObjects.Text;
    private nextBtn!: GameObjects.Text;
    private rerollBtn!: GameObjects.Text;
    /** 盲注选择界面上的「跳过盲注」。与开包界面的「跳过」（`skipBtn`）不是一回事 */
    private skipBlindBtn!: GameObjects.Text;
    /** Director's Cut：盲注选择界面上花 $10 重掷 Boss */
    private rerollBossBtn!: GameObjects.Text;

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
            'cardSlide2', 'chips1', 'chips2', 'card1', 'button', 'generic1',
            'coin1', 'coin2', 'coin3', 'other1', 'tarot1', 'cancel', 'multhit1',
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
        this.hudView = new UIBoxView(this, hudBox, 40);

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
        this.hud = this.add.text(toPx(5.0), toPx(2.75), '', {
            fontFamily: 'monospace', fontSize: 22, color: '#e8e8e8', lineSpacing: 6,
        });
        // 牌型预览已经在左侧面板里了（`hand_text_area`），这行调试字不再显示
        this.handPreview = this.add.text(toPx(5.0), toPx(3.1), '', {
            fontFamily: 'monospace', fontSize: 26, color: '#ffd76e',
        }).setVisible(false);
        this.jokerInfo = this.add.text(toPx(5.0), toPx(3.55), '', {
            fontFamily: 'monospace', fontSize: 18, color: '#9fd6ff',
        });
        this.message = this.add.text(CANVAS_W / 2, CANVAS_H / 2, '', {
            fontFamily: 'monospace', fontSize: 44, color: '#ffffff', align: 'center',
        }).setOrigin(0.5).setDepth(100);

        this.playBtn = this.makeButton(toPx(5.0), toPx(10.2), '出牌', '#3fa34d', () => this.doPlay());
        this.discardBtn = this.makeButton(toPx(7.4), toPx(10.2), '弃牌', '#b5462f', () => this.doDiscard());
        this.nextBtn = this.makeButton(toPx(9.8), toPx(10.2), '下一关', '#3c6ea5', () => this.doNext());
        this.rerollBtn = this.makeButton(toPx(12.2), toPx(10.2), '重掷', '#8a5fb0', () => this.doReroll());
        this.skipBtn = this.makeButton(toPx(14.6), toPx(10.2), '跳过', '#6b7280', () => this.doSkipPack());
        this.skipBlindBtn = this.makeButton(toPx(17.0), toPx(10.2), '跳过盲注', '#a07a2c', () => this.doSkipBlind());
        this.rerollBossBtn = this.makeButton(toPx(17.0), toPx(9.2), '重掷 Boss $10', '#b5462f', () => this.doRerollBoss());

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
    private showBlindSelect(): void {
        this.selected.clear();
        this.clearShop();
        this.rebuildHand();
        this.rebuildJokers();
        this.rebuildConsumables();
        this.rebuildPackCards();
        this.refresh();
    }

    /** 「跳过盲注」：拿走这一格的标签，直接到下一格（不打、不进商店） */
    private doSkipBlind(): void {
        if (this.animating || !this.run.canSkipBlind) return;
        const tag = this.run.skipBlind();
        this.sound.play('generic1', { volume: 0.5 });
        this.message.setText(`拿到 ${tag.center.name}`).setColor('#ffd76e');
        this.time.delayedCall(1400, () => this.message.setText(''));
        this.showBlindSelect();
    }

    /** Director's Cut：花 $10 重掷这个 Ante 的 Boss（每个 Ante 一次） */
    private doRerollBoss(): void {
        if (this.animating || !this.run.canRerollBoss) {
            this.sound.play('cancel', { volume: 0.4 });
            return;
        }
        this.run.rerollBoss();
        this.sound.play('other1', { volume: 0.5 });
        // 重掷之后会再轮一次 `new_blind_choice`，标签可能开出一个包
        this.showBlindSelect();
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
            // 输了就到此为止。重开要刷新页面——本里程碑不做局外流程
            this.run.finishRound();
            this.refresh();
            return;
        }

        const wasWon = this.run.won;
        const { payout } = this.run.finishRound();
        this.sound.play('coin1', { volume: 0.5 });

        const lines = payout.rows.map((r) => {
            const label = {
                blind: '盲注', hands: '剩余出牌', discards: '剩余弃牌',
                joker: r.joker?.ability.name ?? '小丑', interest: '利息',
                tag: r.tag ? (TAG_CENTERS[r.tag]?.name ?? '标签') : '标签',
            }[r.kind];
            return `${label}  +$${r.dollars}`;
        });
        // 打过 Ante 8 的 Boss：原作弹胜利窗口、可以接着打（无尽模式）。这里只给一行字，局照常往下走
        const title = !wasWon && this.run.won ? ['赢了！接着打就是无尽模式', ''] : [];
        this.message.setText([...title, `本关收益 $${payout.total}`, ...lines].join('\n')).setColor('#ffd76e');

        // 进商店之前把上一关的牌收掉。`finishRound` 已经把 `run.round` 置空，
        // 不清的话那 8 张会一直挂在商店界面上
        for (const sprite of this.sprites) sprite.destroy();
        this.sprites = [];
        this.selected.clear();

        this.rebuildJokers(); // end_of_round 可能吃掉小丑（Popcorn / Gros Michel）
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
        for (const s of this.jokerSprites) s.destroy();
        this.jokerSprites = this.run.jokers.map(
            (j) => new JokerSprite(this, j, (joker) => this.onJokerClick(joker)),
        );
        this.layoutJokers();
    }

    private layoutJokers(): void {
        this.jokerSprites.forEach((s, i) => {
            s.layout(JOKER_X_TILES + i * (CARD_W + 0.15), JOKER_Y_TILES);
        });
    }

    /** 点小丑区里的小丑 = 卖掉它。只在商店里允许——原作里回合内也能卖，
     *  但那会在出牌中途改小丑区，本里程碑先不开。 */
    private onJokerClick(joker: Joker): void {
        if (this.animating || this.run.state !== 'shop') return;
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
        for (const s of this.consumableSprites) s.destroy();
        this.consumableSprites = this.run.consumables.map(
            (c) => new ConsumableSprite(this, c, (con) => this.onConsumableClick(con)),
        );
        this.consumableSprites.forEach((s, i) => {
            s.layout(CONSUMABLE_X_TILES + i * (CARD_W + 0.15), CONSUMABLE_Y_TILES);
        });
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
        // 塔罗会换点数 / 换花色 / 换强化 / 销毁手牌，**整个手牌区要重建**
        this.rebuildHand();
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
    }

    private clearPackCards(): void {
        for (const s of this.packCardSprites) s.destroy();
        this.packCardSprites = [];
    }

    /**
     * 开着的包：内容摊在屏幕上排，点一张就挑走它。
     *
     * **挑不走的也画出来**（小丑区满了之类），点一下给一句反馈——
     * 与「点不动的塔罗」同一条：不画出来等于把限制伪装成「这张不存在」。
     */
    private rebuildPackCards(): void {
        this.clearPackCards();
        const pack = this.run.openPack;
        if (!pack) return;

        pack.cards.forEach((card, i) => {
            const x = PACK_OPEN_X_TILES + i * (CARD_W + 0.5);
            if (card.kind === 'joker') {
                const sprite = new JokerSprite(this, card.joker, () => this.takeFromPack(i));
                sprite.layout(x, PACK_OPEN_Y_TILES);
                this.packCardSprites.push(sprite);
            } else if (card.kind === 'consumable') {
                const sprite = new ConsumableSprite(this, card.consumable, () => this.takeFromPack(i));
                sprite.layout(x, PACK_OPEN_Y_TILES);
                this.packCardSprites.push(sprite);
            } else {
                // 标准包的扑克牌。`CardSprite` 按 `T.x` 排版，所以先把它摆好
                card.card.T.x = x - PACK_OPEN_X_TILES;
                const sprite = new CardSprite(this, card.card, () => this.takeFromPack(i));
                sprite.layout(PACK_OPEN_X_TILES, PACK_OPEN_Y_TILES);
                this.packCardSprites.push(sprite);

                // **版本与蜡封的贴图都没有移植**，只用文字标出来——
                // 一张 Red 蜡封的牌会多算一遍分，不标就看不出来
                const tags = `${editionTag(card.card.edition)}${sealTag(card.card.seal)}`.trim();
                if (tags) {
                    this.shopLabels.push(
                        this.add.text(toPx(x), toPx(PACK_OPEN_Y_TILES + CARD_H + 0.1), tags, {
                            fontFamily: 'monospace', fontSize: 15, color: '#9fd6ff',
                        }).setDepth(40),
                    );
                }
            }
        });
    }

    private takeFromPack(index: number): void {
        if (this.animating || !this.run.openPack) return;
        if (!this.run.canTakeFromPack(index)) {
            this.sound.play('cancel', { volume: 0.4 });
            this.message.setText('放不下了——先卖一张').setColor('#e5885f');
            this.time.delayedCall(1400, () => this.message.setText(''));
            return;
        }
        this.run.takeFromPack(index);
        this.sound.play('card1', { volume: 0.5 });
        this.rebuildJokers();
        this.rebuildConsumables();
        this.rebuildPackCards();
        this.refresh();
    }

    private doSkipPack(): void {
        if (this.animating || !this.run.openPack) return;
        this.run.skipPack();
        this.sound.play('cardSlide2', { volume: 0.4 });
        this.rebuildJokers();
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
        if (!shop) return;
        this.rebuildVouchers();

        // 补充包那两格。买掉的那一格是 null，不画——原作也是让它空着
        shop.packs.forEach((slot, i) => {
            if (!slot) return;
            const x = PACK_X_TILES + i * (CARD_W * 1.27 + 0.6);
            const sprite = new BoosterSprite(this, slot.center, () => this.openPack(i));
            sprite.layout(x, PACK_Y_TILES);
            this.packSprites.push(sprite);

            const done = isBoosterImplemented(slot.key, BOOSTER_CENTERS);
            this.shopLabels.push(
                this.add.text(
                    toPx(x),
                    toPx(PACK_Y_TILES + CARD_H * 1.27 + 0.1),
                    `$${shop.packCost(i)}${done ? '' : '  ⚠未实现'}`,
                    {
                        fontFamily: 'monospace', fontSize: 16,
                        color: done ? '#ffd76e' : '#e5885f',
                    },
                ).setDepth(40),
            );
        });

        shop.items.forEach((item, i) => {
            const x = SHOP_X_TILES + i * (CARD_W + 1.4);

            if (item.kind === 'card') {
                // Magic Trick 的扑克牌。`CardSprite` 按 `T.x` 排版，所以先把它摆好
                item.card.T.x = x - SHOP_X_TILES;
                const sprite = new CardSprite(this, item.card, () => this.buy(i));
                sprite.layout(SHOP_X_TILES, SHOP_Y_TILES);
                this.shopCardSprites.push(sprite);
                this.shopLabels.push(
                    this.add.text(toPx(x), toPx(SHOP_Y_TILES + CARD_H + 0.1), `$${shop.itemCost(i)}`, {
                        fontFamily: 'monospace', fontSize: 18, color: '#ffd76e',
                    }).setDepth(40),
                );
                return;
            }

            if (item.kind === 'consumable') {
                const c = item.consumable;
                const sprite = new ConsumableSprite(this, c, () => this.buy(i));
                sprite.layout(x, SHOP_Y_TILES);
                this.shopConsumableSprites.push(sprite);

                // **没实现行为的塔罗要标出来**，与小丑那一条同理：
                // 商店按设计从全池生成（池子内容影响 RNG，不能裁），
                // 买了什么也不发生就是把缺口伪装成正常行为
                const done = isConsumableImplemented(c.key);
                this.shopLabels.push(
                    this.add.text(
                        toPx(x),
                        toPx(SHOP_Y_TILES + CARD_H + 0.1),
                        `$${shop.itemCost(i)}${done ? '' : '  ⚠未实现'}`,
                        {
                            fontFamily: 'monospace', fontSize: 18,
                            color: done ? '#ffd76e' : '#e5885f',
                        },
                    ).setDepth(40),
                );
                return;
            }

            const sprite = new JokerSprite(this, item.joker, () => this.buy(i));
            sprite.layout(x, SHOP_Y_TILES);
            this.shopSprites.push(sprite);

            // **没有行为的小丑要标出来。** 商店按设计从 150 张的全池生成
            // （池子大小影响 RNG，不能裁），所以会摆出还没实现的小丑，
            // 而它买了什么也不发生。不标就是把缺口伪装成正常行为
            const done = isJokerImplemented(item.joker.key);
            this.shopLabels.push(
                this.add.text(
                    toPx(x),
                    toPx(SHOP_Y_TILES + CARD_H + 0.1),
                    `$${item.cost}${editionTag(item.joker.edition)}${done ? '' : '  ⚠未实现'}`,
                    {
                        fontFamily: 'monospace', fontSize: 18,
                        color: done ? '#ffd76e' : '#e5885f',
                    },
                ).setDepth(40),
            );
        });
    }

    /**
     * 优惠券格，排在货架右边。**已兑换的列在 HUD 里**（原作在「本局信息」里），
     * 这里只画还摆着的
     */
    private rebuildVouchers(): void {
        const shop = this.run.shop;
        if (!shop) return;
        const x0 = SHOP_X_TILES + shop.jokerMax * (CARD_W + 1.4) + 0.4;
        shop.vouchers.forEach((v, i) => {
            const x = x0 + i * (CARD_W + 0.6);
            const sprite = new VoucherSprite(this, v.center, () => this.redeem(i));
            sprite.layout(x, SHOP_Y_TILES);
            this.voucherSprites.push(sprite);
            this.shopLabels.push(
                this.add.text(toPx(x), toPx(SHOP_Y_TILES + CARD_H + 0.1), `$${shop.voucherCost(i)}\n${v.center.name}`, {
                    fontFamily: 'monospace', fontSize: 15, color: '#ffd76e',
                }).setDepth(40),
            );
        });
    }

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
        for (const s of this.sprites) s.destroy();
        this.sprites = [];
        this.inPlay.clear();

        const round = this.round;
        if (!round) {
            this.layout();
            return;
        }

        // 逻辑层已经给过 T.x（等距单调，tile 单位）。
        // **不改它**——边距是表现层的事，在 layout 时叠加。
        for (const card of round.hand) {
            this.sprites.push(new CardSprite(this, card, (c) => this.toggle(c)));
        }
        this.layout();
    }

    private layout(): void {
        for (const s of this.sprites) s.highlighted = this.selected.has(s.card);
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
        const blindName = BLIND_CENTERS[run.blindKey].name;

        const vouchersLine = run.usedVouchers.size > 0
            ? `优惠券：${[...run.usedVouchers].map((k) => VOUCHER_CENTERS[k].name).join('、')}`
            : '';
        const tagsLine = run.tags.length > 0
            ? `标签：${run.tags.map((t) => t.center.name + (isTagImplemented(t.key) ? '' : ' ⚠未实现')).join('、')}`
            : '';

        if (run.state === 'blind-select') {
            const center = BLIND_CENTERS[run.blindKey];
            const need = getBlindAmount(run.ante) * center.mult;
            const skipKey = run.blindKind === 'small' ? run.blindTags.Small : run.blindKind === 'big' ? run.blindTags.Big : '';
            const skipText = skipKey
                ? `跳过可得：${TAG_CENTERS[skipKey].name}${isTagImplemented(skipKey) ? '' : ' ⚠未实现'}`
                : 'Boss 盲注不能跳过';
            this.hud.setText([
                `选择盲注 — Ante ${run.ante}   ${blindName}   需要 ${need}    本 Ante 的 Boss：${BLIND_CENTERS[run.bossKey].name}`,
                `$${run.dollars}    ${skipText}    ${tagsLine}`,
                run.openPack
                    ? `${run.openPack.center.name}（标签送的）—— 还能挑 ${run.openPack.choicesLeft} 张`
                    : `「下一关」开打，「跳过盲注」拿标签    ${vouchersLine}`,
            ].join('\n'));
        } else if (run.state === 'shop') {
            this.hud.setText([
                `商店 — Ante ${run.ante}${run.won ? '（无尽）' : ''}   下一关：${blindName}`,
                `$${run.dollars}    重掷 $${run.shop?.rerollCost ?? 0}    小丑 ${run.jokers.length}/${run.jokerSlots}    消耗品 ${run.consumables.length}/${run.consumableSlots}    ${tagsLine}`,
                run.openPack
                    ? `${run.openPack.center.name} —— 还能挑 ${run.openPack.choicesLeft} 张`
                    : `点商店的牌买入，点小丑区的牌卖出，点消耗品用掉它    ${vouchersLine}`,
            ].join('\n'));
        } else if (round) {
            this.hud.setText([
                `Ante ${run.ante}  ${blindName}   ${round.chips} / ${round.requirement}`,
                `出牌 ${round.handsLeft}    弃牌 ${round.discardsLeft}    牌堆 ${round.deck.length}    $${run.dollars}`,
                lastAction,
            ].join('\n'));
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
        this.playBtn.setAlpha(done || this.animating ? 0.3 : 1);
        this.discardBtn.setAlpha(done || this.animating || (round?.discardsLeft ?? 0) < 1 ? 0.3 : 1);
        const inSelect = run.state === 'blind-select';
        this.nextBtn.setAlpha(
            this.animating || run.openPack || (!inShop && !inSelect && !done) ? 0.3 : 1,
        );
        this.skipBlindBtn.setAlpha(run.canSkipBlind && !this.animating ? 1 : 0.3);
        // 没兑换 Director's Cut 就整个藏起来，免得多一个永远灰着的按钮
        this.rerollBossBtn.setVisible(run.vouchers.directorsCut && run.state === 'blind-select');
        this.rerollBossBtn.setAlpha(run.canRerollBoss && !this.animating ? 1 : 0.3);
        this.rerollBtn.setAlpha(inShop && !this.animating && !this.run.openPack ? 1 : 0.3);
        // 「跳过」只在开着包的时候能按
        this.skipBtn.setAlpha(this.run.openPack && !this.animating ? 1 : 0.3);

        if (run.state === 'game-over') {
            this.message.setText('失败').setColor('#e5585f');
        } else if (round?.phase === 'won') {
            this.message.setText('过关').setColor('#7ddf64');
        } else if (round?.phase === 'lost') {
            this.message.setText('分数不够').setColor('#e5585f');
        } else if (run.state !== 'shop') {
            this.message.setText('');
        }
    }

    /**
     * 小丑区的文字说明。
     *
     * 本里程碑**不做卡面上的描述文字**——那要接 `本地化/` 的全量文本与
     * `generate_UIBox_ability_table`（`card.lua:708`，6,607 行 UI 定义的一部分），
     * 而 UI 按 03 号票是重写不是直译。先用一行纯文本顶着，
     * 至少让「这张小丑现在给多少」可见。
     */
    private describeJokers(): string {
        if (this.run.jokers.length === 0) return '';
        return this.run.jokers
            .map((j) => {
                const a = j.ability;
                const parts: string[] = [];
                if (a.mult > 0) parts.push(`+${a.mult}`);
                if (a.t_mult > 0) parts.push(`+${a.t_mult}/${a.type}`);
                if (a.t_chips > 0) parts.push(`+${a.t_chips}c/${a.type}`);
                if (a.x_mult > 1) parts.push(`×${a.x_mult}`);
                if (typeof a.extra?.chips === 'number') parts.push(`+${a.extra.chips}c`);
                // 没有行为的小丑要标出来，理由同商店那一处
                const warn = isJokerImplemented(j.key) ? '' : ' ⚠未实现';
                return `${a.name}${editionTag(j.edition)}${parts.length ? ` ${parts.join(' ')}` : ''} ($${j.sell_cost})${warn}`;
            })
            .join('   ');
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
        this.syncAreas();
        for (const a of this.areaViews) a.view.update(time / 1000);
        this.slideHand(delta / 1000);
        this.placeCards(time / 1000);
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
                a.view.setVisible(run.state === 'playing' && round?.phase === 'selecting' && !run.openPack);
            } else [c.card_count, c.card_limit] = [round ? round.deck.length : run.fullDeck.length, run.fullDeck.length];
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
        s.dollars = inRound ? round.dollars : run.dollars;
        s.round = run.roundNumber;
        s.round_resets.ante = run.ante;
        s.chips_text = numberFormat(inRound ? round.chips : 0);
        s.current_round.hands_left = round ? round.handsLeft : 4 + run.vouchers.hands;
        s.current_round.discards_left = round
            ? round.discardsLeft
            : 3 + RED_DECK.config.discards + run.vouchers.discards;

        const hand = s.current_round.current_hand;
        const preview = round && this.selected.size > 0 ? evaluatePokerHand(this.selectedInOrder()) : null;
        const info = preview?.topName ? round!.hands[preview.topName] : null;
        hand.handname_text = preview?.topName ?? '';
        hand.hand_level = info ? `lvl.${info.level}` : '';
        hand.chip_text = numberFormat(info?.chips ?? 0);
        hand.mult_text = numberFormat(info?.mult ?? 0);

        // `ease_background_colour_blind`：盲注里按盲注换色；选盲注与商店时 `G.GAME.blind` 是空名字的占位，
        // 商店再把 MAIN 换成暗红
        applyBlindColours(run.state === 'playing' ? run.blindKey : null);
        if (run.state === 'shop') setColour(C.DYN_UI.MAIN, mixColours(C.RED, C.BLACK, 0.9));
    }

    // ————————————————————————————————————————————————————————————————
    // 背景与 CRT
    // ————————————————————————————————————————————————————————————————

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
                    setUniform('colour_1', BACKGROUND_COLOURS.colour_1);
                    setUniform('colour_2', BACKGROUND_COLOURS.colour_2);
                    setUniform('colour_3', BACKGROUND_COLOURS.colour_3);
                    setUniform('contrast', BACKGROUND_COLOURS.contrast);
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
