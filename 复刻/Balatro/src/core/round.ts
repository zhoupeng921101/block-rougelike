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
import type { Card, Suit } from './card';
import { calculateJoker, refreshDerivedAbilities, runModifiers } from './jokers';
import type { GameView, Joker, RunModifiers } from './jokers';
import { PseudorandomState, pseudoshuffle } from './rng';
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
    /**
     * 牌被永久销毁时（碎掉的玻璃牌）通知上层，好让 `Run.fullDeck` 也删掉。
     * **`Run` 跨回合持有同一批 `Card` 对象**，只从这一局的三个堆里删不够——
     * 下一回合又会从 `fullDeck` 洗回来。
     */
    onRemoveFromDeck?(cards: Card[]): void;
};

/**
 * `common_events.lua:2320-2374` 的四个 `reset_*` 抽出来的结果。
 *
 * 它们**每回合都重抽**（`state_events.lua:294`），各用一个独立的 RNG key，
 * 所以由 `Run` 层持有并传下来。
 */
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

    handsLeft: number;
    discardsLeft: number;
    /** `G.GAME.chips`，本回合累计 */
    chips = 0;
    dollars: number;
    phase: RoundPhase = 'selecting';
    handsPlayedThisRound = 0;

    readonly requirement: number;
    readonly hands: Record<HandName, HandInfo>;
    readonly jokers: Joker[];
    readonly ante: number;
    readonly blind: BlindState | null;
    readonly handLimit: number;
    /** 用掉的弃牌次数。`Delayed Gratification` 判的是「一次都没用过」 */
    discardsUsed = 0;
    /** 这一手的牌型等级，`The Arm` 在 `debuff_hand` 里要读它 */
    private lastHandLevel = 1;
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
    private readonly onRemoveFromDeck?: (cards: Card[]) => void;

    constructor(seed: string, fullDeck: Card[], options: RoundOptions = {}) {
        this.ante = options.ante ?? 1;
        this.jokers = options.jokers ?? [];
        this.dollars = options.dollars ?? STARTING_PARAMS.dollars;
        this.handsPlayed = options.handsPlayed ?? 0;
        this.hands = options.hands ?? initialHands();
        // `Four Fingers` 与 `Shortcut` 是小丑给的牌型判定松紧，
        // 与调用方传进来的（测试用）取并集
        this.onRemoveFromDeck = options.onRemoveFromDeck;
        const passedFlags = options.jokerFlags ?? NO_JOKERS;
        const jokerMods = runModifiers(options.jokers ?? []);
        this.jokerFlags = {
            fourFingers: passedFlags.fourFingers || jokerMods.flags.fourFingers,
            shortcut: passedFlags.shortcut || jokerMods.flags.shortcut,
        };
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

        // **派生字段先重算一遍**：`Joker Stencil` 的倍率与 `Swashbuckler` 的 mult
        // 是从小丑区推导的（原作每帧重算），不重算就会读到 config 里的初值
        refreshDerivedAbilities(this.jokers, STARTING_PARAMS.joker_slots);

        // `misc_functions.lua:1855` 的基数，再加上小丑区给的修正。
        // 全部由 `runModifiers` 从小丑区**重算**而不是增量加减——
        // 小丑会被摧毁/被 debuff/被卖掉，加减一旦漏一处上限就永久跑偏
        this.mods = runModifiers(this.jokers);
        this.handLimit =
            STARTING_PARAMS.hand_size + this.mods.handSize + (this.blind?.handSizeMod ?? 0);

        // `blind.lua:179-186` 的 `discards_sub` / `hands_sub`，**在进场时一次性扣掉**。
        // `The Water` 砍的是「进场时实际剩多少」（含 Drunkard 的 +1），
        // 所以用哨兵 `ALL_DISCARDS` 表示归零而不是写死一个数。
        // `Burglar` 走的是同一处（`card.lua:2525` 的 setting_blind）：
        // **弃牌清零、出牌 +3**，顺序上它排在 Boss 的 sub 之后
        this.handsLeft =
            STARTING_PARAMS.hands - (this.blind?.handsSub ?? 0) + this.mods.hands + this.mods.burglarHands;
        const discardsBase = STARTING_PARAMS.discards + this.mods.discards;
        this.discardsLeft =
            this.blind?.discardsSub === ALL_DISCARDS || this.mods.burglarHands > 0
                ? 0
                : discardsBase - (this.blind?.discardsSub ?? 0);

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
                mail_card: this.mailCard,
                idol_card: this.special.idolCard,
                ancient_suit: this.special.ancientSuit,
                castle_suit: this.special.castleSuit,
            },
            // `Oops! All 6s` 每张把它 ×2。**不是常量**
            probabilities: { normal: this.mods.probabilityNormal },
            jokers: this.jokers,
            joker_slots: STARTING_PARAMS.joker_slots,
            get deckCount() {
                return round.deck.length;
            },
            get handCards() {
                return round.hand;
            },
            consumeable_usage_tarot: 0,
            smeared: this.mods.smeared,
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
        alignHand(this.hand);

        // `blind.lua:572` 的 `drawn_to_hand`——**在整批抽完之后调一次**，不是逐张。
        // 它会无条件清掉 `prepped`，`The Fish` 只盖一批就靠这个
        if (this.blind) drawnToHand(this.blind, this.hand, this.jokers, this.rng);
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
        this.handsPlayedThisRound++;

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
        this.chips += result.score;

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

        this.discardsLeft--;
        this.discardsUsed++;
        this.discardCards(selected);
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
                { pre_discard: true, full_hand: cards, hook, discardsUsed: this.discardsUsed - 1 },
                this.gameView(),
            );
            // `Burnt Joker`：把刚弃掉那手的牌型升一级。
            // **牌型要现判**——弃掉的这批不一定构成任何「打出过」的牌型
            if (effect?.levelUpDiscarded) {
                const name = evaluatePokerHand(cards, this.jokerFlags).topName;
                if (name) levelUpHand(this.hands, name);
            }
        }

        // `state_events.lua:421`：逐张问每张小丑。**直接调 `calculate_joker`、不带
        // `cardarea`**——原文如此，`context.discard` 那条分支在 cardarea 判定之前。
        for (const card of cards) {
            for (const joker of this.jokers) {
                calculateJoker(
                    joker,
                    { discard: true, other_card: card, full_hand: cards },
                    this.gameView(),
                );
            }
        }

        this.moveOut(cards);
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
     * 把牌从这一局的所有位置拿走，并通知 `Run` 从整副牌里删掉。
     * 对应 `card.lua` 的 `Card:remove()` + `remove_from_deck`。
     */
    private removeFromDeck(cards: Card[]): void {
        for (const card of cards) {
            for (const pile of [this.hand, this.deck, this.discardPile]) {
                const i = pile.indexOf(card);
                if (i >= 0) pile.splice(i, 1);
            }
        }
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
