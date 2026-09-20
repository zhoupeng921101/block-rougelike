/**
 * 一局小盲注的回合状态机。
 *
 * 直译自 `参考/产物/Balatro_1.0.1o/源码/` 的几处：
 * - `functions/state_events.lua:376` `G.FUNCS.draw_from_deck_to_hand`
 * - `functions/state_events.lua:471` `G.FUNCS.play_cards_from_highlighted`
 * - `functions/state_events.lua:405` `G.FUNCS.discard_cards_from_highlighted`
 * - `cardarea.lua:66` `CardArea:remove_card`
 * - `game.lua:3559` 的过关／失败判定
 *
 * **没有事件队列。** 按 09 号票：第一个切片零处「队列驱动的 RNG 消费」，
 * 所以把动画 delay 压成 0、同步执行，RNG 顺序不变。
 * **这条结论不能带过第一个里程碑**——第二个里程碑接消耗品与补充包时，
 * 那边有 5 处带 delay / `blockable=false` 的 RNG 消费，虚拟时钟必须如实复刻。
 */

import type { Card } from './card';
import { PseudorandomState, pseudoshuffle } from './rng';
import { type JokerFlags, NO_JOKERS } from './poker-hands';
import {
    type HandInfo,
    type HandName,
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
} as const;

export type RoundPhase = 'selecting' | 'won' | 'lost';

export type PlayOutcome = {
    handName: HandName;
    score: number;
    /** 这一手之后的累计分 */
    chips: number;
    phase: RoundPhase;
};

/**
 * 手牌区的 `T.x` 赋值。
 *
 * 原作在 `CardArea:align_cards()` 的 hand 分支（`cardarea.lua:462`）里，
 * 由下标 `k` 算出位置：
 * `T.x = 区左边 + (区宽-牌宽)*((k-1)/(max-1) - ...) + ...`
 * ——**严格随下标单调递增**，没有 voucher 分支那个 ±0.27 的错落。
 *
 * 逻辑层只需要「顺序可比」，所以这里给一个等距的单调序列，
 * **单位是 tile**（`G.CARD_W = 2.4*35/41 ≈ 2.05`，见 10 号票）。
 * 真正的间距公式属于表现层，等 Phaser 层接上后由它布局并写回 `T.x`。
 */
const CARD_W_TILES = (2.4 * 35) / 41;

export function alignHand(cards: Card[]): void {
    cards.forEach((card, i) => {
        card.T.w = CARD_W_TILES;
        card.T.x = i * CARD_W_TILES;
    });
}

export class Round {
    /** 牌堆。**抽牌从末端取**——`cardarea.lua:76-77` 对 deck 走 `_cards[#_cards]` */
    deck: Card[] = [];
    hand: Card[] = [];
    discardPile: Card[] = [];

    handsLeft = STARTING_PARAMS.hands;
    discardsLeft = STARTING_PARAMS.discards;
    /** `G.GAME.chips`，本回合累计 */
    chips = 0;
    phase: RoundPhase = 'selecting';

    readonly requirement: number;
    readonly hands: Record<HandName, HandInfo>;
    private readonly rng: PseudorandomState;

    constructor(
        seed: string,
        fullDeck: Card[],
        readonly ante = 1,
        blind: 'small' | 'big' = 'small',
        private readonly jokers: JokerFlags = NO_JOKERS,
    ) {
        this.rng = new PseudorandomState(seed);
        this.requirement = blindRequirement(ante, blind);
        this.hands = initialHands();
        this.deck = [...fullDeck];

        // `state_events.lua:365` 回合开始洗牌，key 是 'nr'..ante
        pseudoshuffle(this.deck, this.rng.pseudoseed(`nr${ante}`));
        this.drawToHandLimit();
    }

    /**
     * `state_events.lua:383`：
     * `hand_space = min(#deck.cards, hand.card_limit - #hand.cards)`
     */
    private drawToHandLimit(): void {
        const space = Math.min(this.deck.length, STARTING_PARAMS.hand_size - this.hand.length);
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

        this.handsLeft--; // ease_hands_played(-1)

        const result = evaluatePlay(played, this.hands, this.jokers);
        this.chips += result.score;

        this.moveOut(played);
        this.drawToHandLimit();
        this.settlePhase();

        return {
            handName: result.handName,
            score: result.score,
            chips: this.chips,
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
