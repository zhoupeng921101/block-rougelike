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

import type { Card } from './card';
import type { GameView, Joker } from './jokers';
import { PseudorandomState, pseudoshuffle } from './rng';
import { type JokerFlags, NO_JOKERS } from './poker-hands';
import {
    type BlindHooks,
    type HandInfo,
    type HandName,
    type ScoreStep,
    blindRequirement,
    evaluatePlay,
    initialHands,
} from './scoring';

/** `misc_functions.lua:1853` 的 `get_starting_params`，只取本切片用得上的。 */
export const STARTING_PARAMS = {
    hand_size: 8,
    hands: 4,
    discards: 3,
    dollars: 4,
    joker_slots: 5,
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
    /** 结算的逐步轨迹 */
    steps: ScoreStep[];
    /** 这一手之后的累计分 */
    chips: number;
    /** 这一手赚到的钱 */
    dollars: number;
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
    blind?: 'small' | 'big' | 'boss';
    /** 小丑区。**`Round` 会原地改它们的 ability**（自增型小丑长个子） */
    jokers?: Joker[];
    /** 起手金钱。`Run` 层带过来 */
    dollars?: number;
    /** 本局累计出牌数。Loyalty Card / Supernova 之类跨回合的计数 */
    handsPlayed?: number;
    /** 牌型等级。跨回合持有，所以由 `Run` 层传进来 */
    hands?: Record<HandName, HandInfo>;
    /** 盲注钩子。Boss 盲注落地时填 */
    blindHooks?: BlindHooks;
    jokerFlags?: JokerFlags;
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
    private handsPlayed: number;
    private readonly rng: PseudorandomState;
    private readonly blindHooks: BlindHooks;
    private readonly jokerFlags: JokerFlags;

    constructor(seed: string, fullDeck: Card[], options: RoundOptions = {}) {
        this.ante = options.ante ?? 1;
        this.jokers = options.jokers ?? [];
        this.dollars = options.dollars ?? STARTING_PARAMS.dollars;
        this.handsPlayed = options.handsPlayed ?? 0;
        this.hands = options.hands ?? initialHands();
        this.blindHooks = options.blindHooks ?? {};
        this.jokerFlags = options.jokerFlags ?? NO_JOKERS;

        this.rng = new PseudorandomState(seed);
        this.requirement = blindRequirement(this.ante, options.blind ?? 'small');

        // `misc_functions.lua:1855` 的基数，再加上小丑的 h_size / d_size。
        // Juggler（`h_size = 1`）与 Drunkard（`d_size = 1`）全靠这两行，
        // 它们在 `calculate_joker` 里**没有任何代码**。
        const hSize = this.jokers.reduce((n, j) => n + (j.debuff ? 0 : j.ability.h_size), 0);
        const dSize = this.jokers.reduce((n, j) => n + (j.debuff ? 0 : j.ability.d_size), 0);
        this.handLimit = STARTING_PARAMS.hand_size + hSize;
        this.handsLeft = STARTING_PARAMS.hands;
        this.discardsLeft = STARTING_PARAMS.discards + dSize;

        this.deck = [...fullDeck];
        for (const card of this.deck) {
            if (this.blindHooks.debuffCard) card.debuff = this.blindHooks.debuffCard(card);
        }

        // `state_events.lua:365` 回合开始洗牌，key 是 'nr'..ante
        pseudoshuffle(this.deck, this.rng.pseudoseed(`nr${this.ante}`));
        this.drawToHandLimit();
    }

    readonly handLimit: number;

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
            },
            probabilities: { normal: 1 },
            jokers: this.jokers,
            joker_slots: STARTING_PARAMS.joker_slots,
            get deckCount() {
                return round.deck.length;
            },
            get handCards() {
                return round.hand;
            },
            consumeable_usage_tarot: 0,
            pseudorandom: (key, min, max) => this.rng.pseudorandom(key, min, max),
        };
    }

    /**
     * `state_events.lua:383`：
     * `hand_space = min(#deck.cards, hand.card_limit - #hand.cards)`
     */
    private drawToHandLimit(): void {
        const space = Math.min(this.deck.length, this.handLimit - this.hand.length);
        for (let i = 0; i < space; i++) {
            const card = this.deck.pop(); // deck 从末端取
            if (card) this.hand.push(card);
        }
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
        this.handsPlayedThisRound++;

        // 打出去的牌离开手牌区。**要在结算之前**——手牌区遍历（第 10 步）
        // 只看留在手里的，`Raised Fist` 与 `Shoot the Moon` 吃这个差别
        this.moveOut(played);

        const chipsBefore = this.chips;
        const result = evaluatePlay(played, this.hands, this.gameView(), this.jokerFlags, this.blindHooks);
        this.chips += result.score;

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
            steps: result.steps,
            chips: this.chips,
            dollars: result.dollars,
            phase: this.phase,
        };
    }

    /** 弃牌。不计分、不结算，只消耗一次弃牌次数。 */
    discard(selected: Card[]): void {
        this.requireSelecting(selected);
        if (this.discardsLeft < 1) throw new Error('没有弃牌次数了');

        this.discardsLeft--;
        this.moveOut([...selected].sort((a, b) => a.T.x - b.T.x));
        this.drawToHandLimit();
        this.settlePhase();
    }

    private requireSelecting(selected: Card[]): void {
        if (this.phase !== 'selecting') throw new Error(`回合已经 ${this.phase} 了`);
        if (selected.length === 0) throw new Error('没有选中任何牌');
        if (selected.length > 5) throw new Error('一次最多 5 张');
        for (const card of selected) {
            if (!this.hand.includes(card)) throw new Error(`${card.key} 不在手牌里`);
        }
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
