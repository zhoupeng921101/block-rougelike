/**
 * 一局盲注的回合状态机。
 *
 * 直译自 `参考/产物/Balatro_1.0.1o/源码/` 的几处：
 * - `functions/state_events.lua:376` `G.FUNCS.draw_from_deck_to_hand`
 * - `functions/state_events.lua:471` `G.FUNCS.play_cards_from_highlighted`
 * - `functions/state_events.lua:405` `G.FUNCS.discard_cards_from_highlighted`
 * - `cardarea.lua:66` `CardArea:remove_card`
 * - `game.lua:3559` 的过关／失败判定
 *
 * **没有事件队列。** 按 09 号票：动画 delay 压成 0、同步执行，RNG 顺序不变。
 * 这条在**本回合内部**仍然成立——商店与消耗品路径上那 5 处带 delay 的 RNG 消费
 * 不在 `Round` 里，等 `Run` 层接商店时再核（见 15 号票的「连带处理」）。
 *
 * `Round` 只管一局盲注。Ante 推进、钱、小丑的持有在它之上的 `Run` 层
 * （还没写），所以小丑列表与钱是**构造时传进来的引用**，`Round` 会原地改它们——
 * 这跟原作一样（`G.jokers.cards` 与 `G.GAME.dollars` 是全局的）。
 */

import {
    ALL_DISCARDS,
    type BlindState,
    blindHooks,
    debuffCard,
    drawCount,
    drawnToHand,
    pressPlay,
    stayFlipped,
} from './blinds';
import { PURPLE_SEAL_APPEND, sealDiscardCreatesTarot } from './seals';
import { type Card, P_CARDS, type Suit, getNominal, makeCard } from './card';
import { calculateJoker, refreshDerivedAbilities, runModifiers } from './jokers';
import type { GameView, Joker, RunModifiers } from './jokers';
import { PseudorandomState, pseudorandomElement, pseudoshuffle } from './rng';
import { type JokerFlags, NO_JOKERS, evaluatePokerHand } from './poker-hands';
import {
    type BlindHooks,
    type HandInfo,
    type HandName,
    type ScoreStep,
    evaluatePlay,
    getBlindAmount,
    initialHands,
    levelUpHand,
} from './scoring';

/** `misc_functions.lua:1853` 的 `get_starting_params`，只取本切片用得上的。 */
export const STARTING_PARAMS = {
    hand_size: 8,
    hands: 4,
    discards: 3,
    dollars: 4,
    joker_slots: 5,
    /** `misc_functions.lua:1862`。消耗品区的格子数 */
    consumable_slots: 2,
} as const;

export type RoundPhase = 'selecting' | 'won' | 'lost';

export type PlayOutcome = {
    handName: HandName;
    score: number;
    /** 出牌前的累计分，表现层滚动动画的起点 */
    chipsBefore: number;
    /** 打出去的那几张，已按 T.x 排序 */
    played: Card[];
    /** 参与计分的那几张（可能少于打出的） */
    scoringHand: Card[];
    baseChips: number;
    baseMult: number;
    /** 第 14 步乘法前的两个累加器。表现层的滚动动画终点，也是核对分数的钩子 */
    handChips: number;
    mult: number;
    /** 结算的逐步轨迹 */
    steps: ScoreStep[];
    /** 这一手之后的累计分 */
    chips: number;
    /** 这一手赚到的钱 */
    dollars: number;
    /** 整手被盲注判为不合法（The Psychic 出不满 5 张）——分数为 0 */
    debuffed: boolean;
    phase: RoundPhase;
};

/**
 * 手牌区的 `T.x` 赋值。
 *
 * 原作在 `CardArea:align_cards()` 的 hand 分支（`cardarea.lua:462`）里，
 * 由下标 `k` 算出位置，**严格随下标单调递增**。
 * 逻辑层只需要「顺序可比」，所以这里给一个等距的单调序列，
 * **单位是 tile**（`G.CARD_W = 2.4*35/41 ≈ 2.05`，见 10 号票）。
 */
const CARD_W_TILES = (2.4 * 35) / 41;

export function alignHand(cards: Card[]): void {
    cards.forEach((card, i) => {
        card.T.w = CARD_W_TILES;
        card.T.x = i * CARD_W_TILES;
    });
}

export type RoundOptions = {
    ante?: number;
    /**
     * 这一局打的是哪个盲注。**必须是 `BlindState` 而不是 `'small' | 'boss'`**——
     * Boss 的 debuff、`-1` 手牌上限、出牌后的额外弃牌全挂在它身上，
     * 而且 `triggered` 是会被写的，所以它是状态不是枚举。
     */
    blind?: BlindState;
    /** 小丑区。**`Round` 会原地改它们的 ability**（自增型小丑长个子） */
    jokers?: Joker[];
    /** 起手金钱。`Run` 层带过来 */
    dollars?: number;
    /** 本局累计出牌数。Loyalty Card / Supernova 之类跨回合的计数 */
    handsPlayed?: number;
    /** 牌型等级。跨回合持有，所以由 `Run` 层传进来 */
    hands?: Record<HandName, HandInfo>;
    jokerFlags?: JokerFlags;
    /**
     * RNG 状态。**由 `Run` 层持有并跨回合传下来**——
     * 每回合新建一个 `PseudorandomState` 会让每回合的同名 key 从头开始，
     * 而原作的 `G.GAME.pseudorandom` 是整局共享的。
     */
    rng?: PseudorandomState;
    /** 本回合的 `mail_card` 点数（`Mail-In Rebate` 读它）。由 `Run` 层每回合抽 */
    mailCard?: number;
    /** 本回合的其余随机项。由 `Run` 层每回合抽（`reset_*` 那四个） */
    special?: RoundSpecialCards;
    /** 消耗品区的口子。由 `Run` 接上——结算里有小丑要造塔罗、要查空位 */
    consumables?: ConsumableHooks;
    /**
     * `G.hand:change_size` 的累计量（`Ouija` -1、`Ectoplasm` 递增地减）。
     * **跨回合持续**，所以由 `Run` 持有并传进来。
     */
    handSizeDelta?: number;
    /**
     * 优惠券给的每回合出牌 / 弃牌增量（Grabber +1、Hieroglyph −1、Wasteful +1）。
     * 原作写的是 `round_resets.hands` / `discards`，所以它们**算进** The Needle 的「砍到只剩 1」
     */
    handsDelta?: number;
    discardsDelta?: number;
    /** `G.GAME.discount_percent`（Clearance Sale）。结算里 Egg / Gift Card 重新定价要用 */
    discountPercent?: number;
    /**
     * 牌被永久销毁时（碎掉的玻璃牌）通知上层，好让 `Run.fullDeck` 也删掉。
     * **`Run` 跨回合持有同一批 `Card` 对象**，只从这一局的三个堆里删不够——
     * 下一回合又会从 `fullDeck` 洗回来。
     */
    onRemoveFromDeck?(cards: Card[]): void;
    /**
     * `Marble Joker` 造一张扑克牌进整副牌。由 `Run` 接上（它才持有 `fullDeck`）。
     * 调用发生在 `onSettingBlind` 里、复制牌堆之前，所以这张牌这一关就在牌堆里。
     */
    onCreatePlayingCard?(enhancement: string | null, key: string): void;
    /**
     * 小丑区的格数（`G.jokers.config.card_limit`），**含 Negative 多给的格子**。
     * 由 `Run` 传——`Round` 不知道小丑区之外的事。不给就是起手的 5 格
     */
    jokerSlots?: number;
    /** 小丑区的口子。由 `Run` 接上——增删小丑的那几张要碰小丑区与整副牌 */
    jokerArea?: JokerAreaHooks;
    /** `G.GAME.skips`，Throwback 的派生倍率要读 */
    skips?: number;
    /**
     * 小丑的 `setting_blind` 那一趟。**构造到一半时调**：盲注与 RNG 已就位，
     * 手牌上限、出牌/弃牌次数、牌堆都还没定。由 `Run` 接上，见构造函数里那条注释
     */
    onSettingBlind?(round: Round): void;
};

/**
 * 结算过程中要**增删小丑或扑克牌**的那几个口子。`Round` 不持有小丑区之外的状态，
 * 所以由 `Run` 传进来。字段与 `GameView` 上同名的那组一一对应，语义见那边。
 */
export type JokerAreaHooks = {
    getBuffer(): number;
    setBuffer(n: number): void;
    queueJoker(keyAppend: string, rarity: number): void;
    sliceJoker(target: Joker): void;
    duplicateJoker(self: Joker, key: string): void;
    /** DNA：复制品进整副牌。**手牌那一半由 `Round` 自己放** */
    addPlayingCard(card: Card): void;
    /** Diet Cola：卖掉时造一个 Double Tag */
    addTag(key: string): void;
};

/** 没接小丑区时的默认实现：**一调就抛**，免得静默吞掉 */
const NO_JOKER_AREA: JokerAreaHooks = {
    getBuffer: () => 0,
    setBuffer: () => {
        throw new Error('这个 Round 没接小丑区，但有小丑要动 joker_buffer');
    },
    queueJoker: () => {
        throw new Error('这个 Round 没接小丑区，但有小丑要造小丑');
    },
    sliceJoker: () => {
        throw new Error('这个 Round 没接小丑区，但有小丑要毁小丑');
    },
    duplicateJoker: () => {
        throw new Error('这个 Round 没接小丑区，但有小丑要复制小丑');
    },
    addPlayingCard: () => {
        throw new Error('这个 Round 没接整副牌，但有小丑要复制扑克牌');
    },
    addTag: () => {
        throw new Error('这个 Round 没接标签，但 Diet Cola 要造一个');
    },
};

/**
 * `common_events.lua:2320-2374` 的四个 `reset_*` 抽出来的结果。
 *
 * 它们**每回合都重抽**（`state_events.lua:294`），各用一个独立的 RNG key，
 * 所以由 `Run` 层持有并传下来。
 */
/**
 * 结算过程中要碰消耗品区的那几个口子（`8 Ball` / `Vagabond` / `Superposition`）。
 * `Round` 不持有消耗品区，所以由 `Run` 传进来。
 */
export type ConsumableHooks = {
    count(): number;
    slots: number;
    usageTarot(): number;
    create(set: 'Tarot' | 'Planet' | 'Spectral', keyAppend: string): void;
    /** `G.consumeables.cards`。`Perkeo` 查空没空 */
    cards(): ReadonlyArray<unknown>;
    /** `Perkeo`：把区里随机一张复制成 Negative 的 */
    duplicateAsNegative(key: string): void;
};

/** 没接消耗品区时的默认实现：**造卡会抛**，查空位恒满。 */
export const NO_CONSUMABLES: ConsumableHooks = {
    count: () => 0,
    slots: 0,
    usageTarot: () => 0,
    create: () => {
        throw new Error('这个 Round 没有接消耗品区，但有小丑要造塔罗');
    },
    cards: () => [],
    duplicateAsNegative: () => {
        throw new Error('这个 Round 没有接消耗品区，但 Perkeo 要复制一张');
    },
};

export type RoundSpecialCards = {
    /** `The Idol`：点数 + 花色都要撞上 */
    idolCard?: { id: number; suit: Suit };
    /** `Ancient Joker` */
    ancientSuit?: Suit;
    /** `Castle` */
    castleSuit?: Suit;
};

export class Round {
    /** 牌堆。**抽牌从末端取**——`cardarea.lua:76-77` 对 deck 走 `_cards[#_cards]` */
    deck: Card[] = [];
    hand: Card[] = [];
    discardPile: Card[] = [];
    /**
     * `G.hand.config.sort`。**每摸一张都照它把手牌区重排一遍**（`draw_card` 的 `sort` 参数，
     * `draw_from_deck_to_hand` 传的是 true），玩家点「按点数 / 按花色」时改它（`sort_hand_value` /
     * `sort_hand_suit`）。手牌区的顺序是逻辑状态：打出去的牌按 `T.x` 计分、手牌区遍历按下标——
     * 复刻件曾经不排（21 号票，模拟器首帧看出来的），同一手牌的计分次序因此与原作不同。
     */
    handSort: 'desc' | 'suit desc' = 'desc';

    handsLeft: number;
    discardsLeft: number;
    /** `G.GAME.chips`，本回合累计 */
    chips = 0;
    dollars: number;
    phase: RoundPhase = 'selecting';
    handsPlayedThisRound = 0;

    /** 分数要求。**可变**：The Wall / Violet Vessel 被关掉时除以 2 / 3（`blind.lua:378`） */
    requirement: number;
    /** 构造跑完了没有。`disableBlind` 在构造中途（Chicot 的 setting_blind）与之后做的事不一样 */
    private started = false;
    /** The Water 砍掉的弃牌数，关掉 Boss 时还回去（原文 `ease_discard(self.discards_sub)`） */
    private waterDiscards = 0;
    /** The Needle 砍掉的出牌数，同上（`ease_hands_played(self.hands_sub)`） */
    private needleHands = 0;
    readonly hands: Record<HandName, HandInfo>;
    readonly jokers: Joker[];
    readonly ante: number;
    readonly blind: BlindState | null;
    /** 手牌上限。**可变**：The Manacle 被关掉时 +1（`blind.lua:387`） */
    handLimit: number;
    /** 用掉的弃牌次数。`Delayed Gratification` 判的是「一次都没用过」 */
    discardsUsed = 0;
    /** 这一手的牌型等级，`The Arm` 在 `debuff_hand` 里要读它 */
    private lastHandLevel = 1;
    /** `G.GAME.last_hand_played`。Blue 蜡封在回合结束时按它造星球 */
    lastHandPlayed?: HandName;
    /** `G.GAME.starting_deck_size`。`Erosion` 读它 */
    private readonly startingDeckSize: number;
    /**
     * 整局累计出牌数（`G.GAME.hands_played`）。**`evaluatePlay` 会写它**
     * （经 `gameView().hands_played` 的 setter），所以回合结束后 `Run` 要读回去，
     * 不能自己再加一遍。`Loyalty Card` 读它。
     */
    handsPlayed: number;
    private readonly rng: PseudorandomState;
    private readonly blindHooks: BlindHooks;
    private readonly jokerFlags: JokerFlags;
    private readonly mailCard?: number;
    /** 小丑区给的局面修正。构造时从小丑区重算一次 */
    readonly mods: RunModifiers;
    /** 本回合的几个随机项（`The Idol` / `Ancient Joker` / `Castle` 读） */
    private readonly special: RoundSpecialCards;
    private readonly consumables: ConsumableHooks;
    private readonly onRemoveFromDeck?: (cards: Card[]) => void;
    private readonly onCreatePlayingCard?: (enhancement: string | null, key: string) => void;
    readonly jokerSlots: number;
    private readonly jokerArea: JokerAreaHooks;
    private readonly discountPercent: number;

    constructor(seed: string, fullDeck: Card[], options: RoundOptions = {}) {
        this.ante = options.ante ?? 1;
        this.jokers = options.jokers ?? [];
        this.dollars = options.dollars ?? STARTING_PARAMS.dollars;
        this.handsPlayed = options.handsPlayed ?? 0;
        this.hands = options.hands ?? initialHands();
        // `Four Fingers` 与 `Shortcut` 是小丑给的牌型判定松紧，
        // 与调用方传进来的（测试用）取并集
        this.onRemoveFromDeck = options.onRemoveFromDeck;
        this.onCreatePlayingCard = options.onCreatePlayingCard;
        this.jokerSlots = options.jokerSlots ?? STARTING_PARAMS.joker_slots;
        this.discountPercent = options.discountPercent ?? 0;
        this.jokerArea = options.jokerArea ?? NO_JOKER_AREA;
        this.consumables = options.consumables ?? NO_CONSUMABLES;
        this.blind = options.blind ?? null;
        // `debuff_hand` 要读牌型等级与本局最常用牌型，还要能降级、能清空钱。
        // 那些都是 `Round` 的状态，所以由它提供而不是 `blinds.ts` 自己去拿
        this.blindHooks = this.blind
            ? blindHooks(this.blind, () => ({
                  handLevel: this.lastHandLevel,
                  mostPlayedHand: this.mostPlayedHand(),
                  levelDown: (name) => levelUpHand(this.hands, name, -1),
                  loseAllMoney: () => {
                      this.dollars = 0;
                  },
              }))
            : {};
        this.mailCard = options.mailCard;
        this.special = options.special ?? {};

        this.rng = options.rng ?? new PseudorandomState(seed);
        this.requirement = getBlindAmount(this.ante) * (this.blind?.center.mult ?? 1);

        // `state_events.lua:354`：**`set_blind` → 小丑的 `setting_blind` → 洗牌 → 发牌**。
        // 小丑那一趟会增删小丑（Madness / Ceremonial Dagger / Riff-raff）、往整副牌里加牌
        // （Marble Joker 的石头牌是 `draw_card(G.play, G.deck)` 进了牌堆、再被洗进去的），
        // 所以它**必须排在下面算手牌上限、复制牌堆、洗牌之前**——
        // 否则 Riff-raff 造出来的 Juggler 这一关不加手牌、Marble 的石头牌这一关摸不到
        // `gameView()` 要读 `mods`（概率、Smeared），先按现在的小丑区算一份，这一趟之后重算
        this.mods = runModifiers(this.jokers);
        options.onSettingBlind?.(this);

        // `Four Fingers` 与 `Shortcut` 是小丑给的牌型判定松紧，
        // 与调用方传进来的（测试用）取并集。**在 setting_blind 之后算**，理由同上
        const passedFlags = options.jokerFlags ?? NO_JOKERS;
        const jokerMods = runModifiers(this.jokers);
        this.jokerFlags = {
            fourFingers: passedFlags.fourFingers || jokerMods.flags.fourFingers,
            shortcut: passedFlags.shortcut || jokerMods.flags.shortcut,
        };

        // **派生字段先重算一遍**：`Joker Stencil` 的倍率与 `Swashbuckler` 的 mult
        // 是从小丑区推导的（原作每帧重算），不重算就会读到 config 里的初值
        refreshDerivedAbilities(this.jokers, this.jokerSlots, fullDeck, options.skips ?? 0);

        // `misc_functions.lua:1855` 的基数，再加上小丑区给的修正。
        // 全部由 `runModifiers` 从小丑区**重算**而不是增量加减——
        // 小丑会被摧毁/被 debuff/被卖掉，加减一旦漏一处上限就永久跑偏
        this.mods = runModifiers(this.jokers);
        // `Ouija` / `Ectoplasm` 的 `G.hand:change_size` 是**跨回合持续**的，
        // 所以由 `Run` 传进来，不在 `runModifiers` 里算
        // **Boss 的进场效果都看 `disabled`**：Chicot 在上面那一趟里就可能把它关掉了。
        // 原作是「set_blind 先扣、Chicot 的事件再还回来」，净效果与「一开始就不扣」相同
        const boss = this.blind && !this.blind.disabled ? this.blind : null;
        this.handLimit = Math.max(
            0,
            STARTING_PARAMS.hand_size + this.mods.handSize +
            (options.handSizeDelta ?? 0) + (boss?.handSizeMod ?? 0),
        );

        // `blind.lua:179-186` 的 `discards_sub` / `hands_sub`，**在进场时一次性扣掉**。
        // `The Water` 砍的是「进场时实际剩多少」（含 Drunkard 的 +1），
        // 所以用哨兵 `ALL_DISCARDS` 表示归零而不是写死一个数。
        // `Burglar` 走的是同一处（`card.lua:2525` 的 setting_blind）：
        // **弃牌清零、出牌 +3**，顺序上它排在 Boss 的 sub 之后
        //
        // `The Needle` 的 `hands_sub = round_resets.hands - 1`——`round_resets.hands` **含小丑给的**
        // （Troubadour -1），所以是「砍到只剩 1」，不是「减 3」。原先写成减 3，
        // Troubadour + The Needle 会得到 0 次出牌
        const handsBase = STARTING_PARAMS.hands + (options.handsDelta ?? 0) + this.mods.hands;
        this.needleHands = boss && boss.handsSub > 0 ? handsBase - 1 : 0;
        this.handsLeft = handsBase - this.needleHands + this.mods.burglarHands;
        const discardsBase = STARTING_PARAMS.discards + (options.discardsDelta ?? 0) + this.mods.discards;
        this.waterDiscards = boss?.discardsSub === ALL_DISCARDS ? discardsBase : (boss?.discardsSub ?? 0);
        this.discardsLeft =
            this.mods.burglarHands > 0 ? 0 : discardsBase - this.waterDiscards;

        this.startingDeckSize = fullDeck.length;
        this.deck = [...fullDeck];
        // `blind.lua:624` 的 `debuff_card` 在**进盲注时**对整副牌跑一遍，
        // 不是每手重算。末尾那句 `set_debuff(false)` 是无条件的，所以这里直接赋值
        for (const card of this.deck) {
            card.debuff = this.blind ? debuffCard(this.blind, card) : false;
        }

        // `state_events.lua:365` 回合开始洗牌，key 是 'nr'..ante
        pseudoshuffle(this.deck, this.rng.pseudoseed(`nr${this.ante}`));
        this.drawToHandLimit();
        this.started = true;

        // `game.lua:3589`：**这一关第一次发完牌**（还没出过牌、也没弃过牌）问一遍小丑。
        // Certificate 在这时往手里塞一张带蜡封的牌
        for (const joker of [...this.jokers]) {
            calculateJoker(joker, { first_hand_drawn: true }, this.gameView());
        }
    }

    /**
     * `card.lua:2466` 的 Certificate：往**手里**塞一张随机牌面、随机蜡封的普通牌。
     *
     * 两次掷点，先牌面后蜡封：`pseudorandom_element(P_CARDS, pseudoseed('cert_fr'))`，
     * 然后 `pseudorandom(pseudoseed('certsl'))`——>0.75 Red、>0.5 Blue、>0.25 Gold、否则 Purple。
     * 进手之后 Boss 对它跑一遍 `debuff_card`，再报一次 `playing_card_added`。
     */
    createCertificateCard(): void {
        const [, frontKey] = pseudorandomElement(P_CARDS, this.rng.pseudoseed('cert_fr'));
        const front = P_CARDS[String(frontKey)];
        const card = makeCard(String(frontKey), front.suit, front.value);
        const roll = this.rng.pseudorandom('certsl');
        card.seal = roll > 0.75 ? 'Red' : roll > 0.5 ? 'Blue' : roll > 0.25 ? 'Gold' : 'Purple';
        if (this.blind) card.debuff = debuffCard(this.blind, card);
        this.addToHand(card);
        this.jokerArea.addPlayingCard(card);
        for (const joker of [...this.jokers]) {
            calculateJoker(joker, { playing_card_added: true, cards: [true] }, this.gameView());
        }
    }

    /**
     * `blind.lua:356` 的 `Blind:disable()`：**关掉 Boss**（Luchador / Chicot）。
     *
     * 各 Boss 的进场效果逐个还回去，然后对整副牌与小丑区重跑一遍 `debuff_card`
     * （关掉之后它恒返回「不 debuff」），最后**够分就当场过关**。
     *
     * 在构造中途调（Chicot 的 setting_blind）时只打标记、改分数要求——
     * 手牌上限、出牌/弃牌次数、牌堆的 debuff 都还没算，构造后半段会读 `disabled`。
     */
    disableBlind(): void {
        const blind = this.blind;
        if (!blind || blind.disabled) return;
        blind.disabled = true;

        // `blind.lua:377` / `:393`：分数要求降下来。`self.chips` 是原值，不是剩余
        const name = blind.center.name;
        if (name === 'The Wall') this.requirement /= 2;
        if (name === 'Violet Vessel') this.requirement /= 3;
        if (!this.started) return;

        // `blind.lua:361`
        if (name === 'The Water') this.discardsLeft += this.waterDiscards;
        // `blind.lua:364`：四个盖牌 Boss——手里盖着的翻回来
        if (name === 'The Wheel' || name === 'The House' || name === 'The Mark' || name === 'The Fish') {
            for (const card of this.hand) card.facing = 'front';
        }
        // `blind.lua:374`
        if (name === 'The Needle') this.handsLeft += this.needleHands;
        // `blind.lua:381`
        if (name === 'Cerulean Bell') {
            for (const card of [...this.deck, ...this.hand, ...this.discardPile]) card.forced_selection = false;
        }
        // `blind.lua:386`：手牌上限 +1 并**补抽 1 张**（`draw_from_deck_to_hand(1)` 不看上限）
        if (name === 'The Manacle') {
            this.handLimit += 1;
            const card = this.deck.pop();
            if (card) {
                this.hand.push(card);
                this.sortHand();
            }
        }

        // `blind.lua:407`：整副牌与小丑区重跑 `debuff_card`
        for (const card of [...this.deck, ...this.hand, ...this.discardPile]) {
            card.debuff = debuffCard(blind, card);
        }
        for (const joker of this.jokers) joker.debuff = false;

        // `blind.lua:400`：**够分就当场过关**（The Wall 除以 2 之后常常就够了）
        if (this.phase === 'selecting' && this.chips >= this.requirement) this.phase = 'won';
    }

    /**
     * 喂给 `calculate_joker` 的那张 `G.GAME` 视图。
     *
     * **每次现建**，不缓存：`handCards` 与 `dollars` 在一次结算里会变
     * （手牌区遍历读的就是当前手牌；Business Card 会当场加钱），
     * 缓存下来会让小丑读到过期值。
     */
    gameView(): GameView {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const round = this;
        return {
            hands: this.hands,
            get dollars() {
                return round.dollars;
            },
            set dollars(v: number) {
                round.dollars = v;
            },
            dollar_buffer: 0,
            get consumeable_usage_tarot() {
                return round.consumables.usageTarot();
            },
            get consumableCount() {
                return round.consumables.count();
            },
            get consumable_slots() {
                return round.consumables.slots;
            },
            createConsumable: (set, keyAppend) => round.consumables.create(set, keyAppend),
            get jokerBuffer() {
                return round.jokerArea.getBuffer();
            },
            set jokerBuffer(n: number) {
                round.jokerArea.setBuffer(n);
            },
            queueJoker: (keyAppend, rarity) => round.jokerArea.queueJoker(keyAppend, rarity),
            sliceJoker: (target) => round.jokerArea.sliceJoker(target),
            duplicateJoker: (self, key) => round.jokerArea.duplicateJoker(self, key),
            disableBoss: () => {
                if (round.blind?.center.boss) round.disableBlind();
            },
            createCertificateCard: () => round.createCertificateCard(),
            addTag: (key) => round.jokerArea.addTag(key),
            addPlayingCardToHand: (card) => {
                // 原文 `G.hand:emplace` + `table.insert(G.playing_cards, …)`：手牌这边自己放，
                // 整副牌那边交给 `Run`
                round.addToHand(card);
                round.jokerArea.addPlayingCard(card);
            },
            createPlayingCard: (enhancement, key) => {
                if (!round.onCreatePlayingCard) {
                    throw new Error('这个 Round 没接 onCreatePlayingCard，但 Marble Joker 要造牌');
                }
                round.onCreatePlayingCard(enhancement, key);
            },
            get consumableCards() {
                return round.consumables.cards();
            },
            duplicateConsumableAsNegative: (key) => round.consumables.duplicateAsNegative(key),
            get hands_played() {
                return round.handsPlayed;
            },
            set hands_played(v: number) {
                round.handsPlayed = v;
            },
            current_round: {
                get hands_left() {
                    return round.handsLeft;
                },
                get discards_left() {
                    return round.discardsLeft;
                },
                get hands_played() {
                    return round.handsPlayedThisRound;
                },
                get discards_used() {
                    return round.discardsUsed;
                },
                mail_card: this.mailCard,
                idol_card: this.special.idolCard,
                ancient_suit: this.special.ancientSuit,
                castle_suit: this.special.castleSuit,
            },
            // `Oops! All 6s` 每张把它 ×2。**不是常量**
            probabilities: { normal: this.mods.probabilityNormal },
            jokers: this.jokers,
            joker_slots: this.jokerSlots,
            get deckCount() {
                return round.deck.length;
            },
            get handCards() {
                return round.hand;
            },
            smeared: this.mods.smeared,
            ante: this.ante,
            discount_percent: this.discountPercent,
            startingDeckSize: this.startingDeckSize,
            get playingCardCount() {
                // `#G.playing_cards`——整副牌现在剩几张（牌堆 + 手牌 + 弃牌堆）
                return round.deck.length + round.hand.length + round.discardPile.length;
            },
            get blindTriggered() {
                return round.blind?.triggered ?? false;
            },
            get game_over() {
                return round.phase === 'lost';
            },
            get blindProgress() {
                return round.requirement > 0 ? round.chips / round.requirement : 0;
            },
            pseudorandom: (key, min, max) => this.rng.pseudorandom(key, min, max),
        };
    }

    /**
     * `state_events.lua:383`：
     * `hand_space = min(#deck.cards, hand.card_limit - #hand.cards)`
     *
     * 两处 Boss 介入：
     * - `The Serpent` 把补牌数固定成 3（`state_events.lua:384`）
     * - 四个盖牌 Boss 决定这一批里哪些牌盖着（`blind.lua:605` `stay_flipped`）。
     *   **`The Wheel` 的 1/7 掷点在这里消费 RNG**，所以盖牌判定必须在逻辑层。
     */
    private drawToHandLimit(): void {
        const round = { handsPlayed: this.handsPlayedThisRound, discardsUsed: this.discardsUsed };
        const forced = this.blind ? drawCount(this.blind, round, this.deck.length) : null;
        const space = forced ?? Math.min(this.deck.length, this.handLimit - this.hand.length);

        for (let i = 0; i < space; i++) {
            const card = this.deck.pop(); // deck 从末端取
            if (!card) break;
            if (this.blind) {
                card.facing = stayFlipped(this.blind, card, round, this.rng) ? 'back' : 'front';
            }
            this.hand.push(card);
        }
        this.sortHand();

        // `blind.lua:572` 的 `drawn_to_hand`——**在整批抽完之后调一次**，不是逐张。
        // 它会无条件清掉 `prepped`，`The Fish` 只盖一批就靠这个
        if (this.blind) drawnToHand(this.blind, this.hand, this.jokers, this.rng);
    }

    /**
     * `cardarea.lua:583` 的 `CardArea:sort`：按 `get_nominal` 降序（`suit desc` 用花色加权那一支）。
     * `get_nominal` 末项带 `unique_val`，任意两张严格不等，所以 LuaJIT 的不稳定排序也是确定的。
     */
    sortHand(mode: 'desc' | 'suit desc' = this.handSort): void {
        this.handSort = mode;
        const key = (c: Card) => getNominal(c, mode === 'suit desc' ? 'suit' : undefined);
        this.hand.sort((a, b) => key(b) - key(a));
        alignHand(this.hand);
    }

    /** 出牌。`selected` 是选中的牌，会按 `T.x` 排序后结算。 */
    play(selected: Card[]): PlayOutcome {
        this.requireSelecting(selected);
        if (this.handsLeft < 1) throw new Error('没有出牌次数了');

        // `state_events.lua:484` —— 出牌前按 T.x 排序
        const played = [...selected].sort((a, b) => a.T.x - b.T.x);

        // `ease_hands_played(-1)`。**在结算之前减**——Dusk 与 Acrobat 判的是
        // `hands_left == 0`，减在后面它们就永远不触发
        this.handsLeft--;

        // `state_events.lua:502`。`The Pillar` 靠它认「本 Ante 打过的牌」，
        // 而清除是在 **Boss 打完之后**（`state_events.lua:287`），不是每回合
        for (const card of played) card.played_this_ante = true;

        // 打出去的牌离开手牌区。**要在结算之前**——手牌区遍历（第 10 步）
        // 只看留在手里的，`Raised Fist` 与 `Shoot the Moon` 吃这个差别
        this.moveOut(played);

        // `The Arm` 要在 `debuff_hand` 里读「这手牌型现在几级」，而那是在
        // `evaluatePlay` 内部调的，拿不到牌型名。所以先自己判一次牌型、存下等级。
        // **判定是纯函数、不消费 RNG**，多判一次没有副作用
        const preview = evaluatePokerHand(played, this.jokerFlags);
        this.lastHandLevel = preview.topName ? this.hands[preview.topName].level : 1;

        const chipsBefore = this.chips;
        const result = evaluatePlay(played, this.hands, this.gameView(), this.jokerFlags, this.blindHooks);
        // `state_events.lua:597` 的 `G.GAME.last_hand_played`。Blue 蜡封读它
        this.lastHandPlayed = result.handName;
        this.chips += result.score;

        // `state_events.lua:545`：**本回合出牌数在结算之后才 +1**（`ease_hands_played` 那个是手数，
        // 这个是计数，两回事）。放在结算前会让结算里读到的第一手是 1——
        // `Sixth Sense` 与 `DNA` 判「本回合第一手」用的就是它，放错它们在真局里永远不触发
        this.handsPlayedThisRound++;

        // 第 13 步销毁掉的牌（碎掉的玻璃牌）。**离开这一局的弃牌堆**，
        // 而且要真的从整副牌里拿走——`Run` 跨回合持有同一批 `Card` 对象，
        // 只从 `discardPile` 删会让它下一回合又被洗回来
        if (result.destroyed.length > 0) this.removeFromDeck(result.destroyed);

        // `blind.lua:464` 的 `press_play`。**在结算之后、补牌之前**：
        // 原作是入队的，而队列里出牌结算的事件排在它前面
        if (this.blind) {
            const pressed = pressPlay(this.blind, this.hand, played, this.rng);
            if (pressed.dollarsLost > 0) this.dollars -= pressed.dollarsLost;
            if (pressed.discard.length > 0) this.discardCards(pressed.discard, true);
        }

        this.drawToHandLimit();
        this.settlePhase();

        return {
            handName: result.handName,
            score: result.score,
            chipsBefore,
            played,
            scoringHand: result.scoringHand,
            baseChips: result.baseChips,
            baseMult: result.baseMult,
            handChips: result.handChips,
            mult: result.mult,
            steps: result.steps,
            chips: this.chips,
            dollars: result.dollars,
            debuffed: result.debuffed,
            phase: this.phase,
        };
    }

    /**
     * 弃牌。不计分，但**会触发小丑的 `discard` 分支**——
     * Green Joker 掉倍率、Faceless Joker 给钱、Mail-In Rebate 给钱都在这里。
     */
    discard(selected: Card[]): void {
        this.requireSelecting(selected);
        if (this.discardsLeft < 1) throw new Error('没有弃牌次数了');

        this.discardCards(selected);
        // `state_events.lua:451`：**扣次数与计数都在逐张循环之后**。放在前面的话，
        // 循环里读到的「已弃次数」就多 1——Trading Card 判「本回合第一次弃牌」读的就是它
        this.discardsLeft--;
        this.discardsUsed++;
        this.drawToHandLimit();
        this.settlePhase();
    }

    /**
     * 真正把一批牌弃掉，并跑小丑的 `discard` 分支。
     * 直译自 `state_events.lua:403` 的 `discard_cards_from_highlighted`。
     *
     * `The Hook` 的额外弃牌走的是同一条路（原作也是调这个函数，只是带 `hook = true`），
     * 所以小丑照样触发——被 Hook 弃掉的人头牌**会**给 Faceless Joker 算进去。
     * 但 `hook = true` 时**不扣弃牌次数**（`ease_discard(-1)` 与 `discards_used++`
     * 都在 `if not hook` 里面），所以那两个由调用方 `discard()` 负责，不在这里。
     */
    private discardCards(selected: Card[], hook = false): void {
        // `state_events.lua:413`：**先按 T.x 排序**。`The Hook` 随机抽出来的两张
        // 也要过这一步，所以排序放在这里而不是 `discard()` 里
        const cards = [...selected].sort((a, b) => a.T.x - b.T.x);

        // `state_events.lua:415`：`pre_discard` 遍历，整批只问一次。
        // 本里程碑没有小丑用它（`Burnt Joker` 是 rarity 3），但调用点先留着——
        // 它的位置在逐张循环**之前**，补上的时候别塞错地方。
        for (const joker of this.jokers) {
            const effect = calculateJoker(
                joker,
                { pre_discard: true, full_hand: cards, hook, discardsUsed: this.discardsUsed },
                this.gameView(),
            );
            // `Burnt Joker`：把刚弃掉那手的牌型升一级。
            // **牌型要现判**——弃掉的这批不一定构成任何「打出过」的牌型
            if (effect?.levelUpDiscarded) {
                const name = evaluatePokerHand(cards, this.jokerFlags).topName;
                if (name) levelUpHand(this.hands, name);
            }
        }

        const destroyed: Card[] = [];
        // `state_events.lua:421`：逐张问每张小丑。**直接调 `calculate_joker`、不带
        // `cardarea`**——原文如此，`context.discard` 那条分支在 cardarea 判定之前。
        for (const card of cards) {
            // `common_events.lua:587` 的 `calculate_seal`：**Purple 蜡封弃牌时造塔罗**。
            // `eval_card` 对每张被弃的牌都会走一遍这一支
            if (sealDiscardCreatesTarot(card)) {
                if (this.consumables.count() < this.consumables.slots) {
                    // key_append 是 **`'8ba'`**（`card.lua:2263`）——原文从
                    // `8 Ball` 那段抄下来忘了改。照抄才对得上 seed
                    this.consumables.create('Tarot', PURPLE_SEAL_APPEND);
                }
            }

            // `state_events.lua:425`：**任何一张小丑回 `remove` 就毁掉这张**（Trading Card），
            // 但循环照样跑完——后面的小丑仍然看得到它
            let removed = false;
            for (const joker of this.jokers) {
                const effect = calculateJoker(
                    joker,
                    { discard: true, other_card: card, full_hand: cards },
                    this.gameView(),
                );
                if (effect?.remove) removed = true;
            }
            if (removed) destroyed.push(card);
        }

        // 毁掉的不进弃牌堆。玻璃牌走 `shatter()`，那会打上 `shattered`（`card.lua:2084`）——
        // 所以 Glass Joker 也数 Trading Card 毁掉的玻璃牌
        for (const card of destroyed) {
            if (card.enhancement === 'm_glass') card.shattered = true;
        }
        this.moveOut(cards.filter((c) => !destroyed.includes(c)));
        if (destroyed.length > 0) {
            this.removeFromDeck(destroyed);
            // `state_events.lua:445`：整批一次
            for (const joker of this.jokers) {
                calculateJoker(joker, { remove_playing_cards: true, removed: destroyed }, this.gameView());
            }
        }
    }

    /**
     * `G.GAME.current_round.most_played_poker_hand`。`The Ox` 判它。
     *
     * 原作在 `set_hand_usage`（`misc_functions.lua`）里维护，取本局打得最多的那种。
     * 并列时取**先达到该次数**的那个——`Record` 的插入序就是 `initialHands` 的声明序，
     * 而那是从高牌型到低牌型，所以并列时偏向高牌型。原作靠 `>` 严格大于，同此。
     */
    private mostPlayedHand(): HandName {
        let best: HandName = 'High Card';
        let most = 0;
        for (const [name, info] of Object.entries(this.hands) as Array<[HandName, HandInfo]>) {
            if (info.played > most) {
                most = info.played;
                best = name;
            }
        }
        return best;
    }

    /**
     * `Cerulean Bell` 强制选中的那张牌**不能取消选中**。
     * 表现层在玩家点牌时查它。
     */
    isForced(card: Card): boolean {
        return card.forced_selection;
    }

    private requireSelecting(selected: Card[]): void {
        if (this.phase !== 'selecting') throw new Error(`回合已经 ${this.phase} 了`);
        if (selected.length === 0) throw new Error('没有选中任何牌');
        if (selected.length > 5) throw new Error('一次最多 5 张');
        for (const card of selected) {
            if (!this.hand.includes(card)) throw new Error(`${card.key} 不在手牌里`);
        }
    }

    /**
     * 往手牌区加一张（`create_playing_card(…, G.hand)`）。
     * 造牌的幽灵牌（Familiar / Grim / Incantation / Cryptid）走这条。
     *
     * **`T.x` 由 `alignHand` 重排**，这里只管进数组。
     */
    addToHand(card: Card): void {
        this.hand.push(card);
        alignHand(this.hand);
    }

    /**
     * 把牌从这一局的手牌 / 牌堆 / 弃牌堆里拿走。**不通知 `Run`**——
     * 调用方是 `Run` 自己（塔罗的 `The Hanged Man` 走这条）。
     */
    removeCards(cards: Card[]): void {
        for (const card of cards) {
            for (const pile of [this.hand, this.deck, this.discardPile]) {
                const i = pile.indexOf(card);
                if (i >= 0) pile.splice(i, 1);
            }
        }
    }

    /**
     * 把牌从这一局的所有位置拿走，并通知 `Run` 从整副牌里删掉。
     * 对应 `card.lua` 的 `Card:remove()` + `remove_from_deck`。
     */
    private removeFromDeck(cards: Card[]): void {
        this.removeCards(cards);
        this.onRemoveFromDeck?.(cards);
    }

    private moveOut(cards: Card[]): void {
        for (const card of cards) {
            const i = this.hand.indexOf(card);
            if (i >= 0) this.hand.splice(i, 1);
            this.discardPile.push(card);
        }
    }

    /**
     * `game.lua:3559`：
     * `if G.GAME.chips - G.GAME.blind.chips >= 0 or G.GAME.current_round.hands_left < 1`
     *
     * 过关优先于失败——即使这是最后一手，只要够分就是赢。
     */
    private settlePhase(): void {
        if (this.chips - this.requirement >= 0) {
            this.phase = 'won';
        } else if (this.handsLeft < 1) {
            this.phase = 'lost';
        }
    }
}
