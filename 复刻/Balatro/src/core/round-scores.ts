/**
 * `G.GAME.round_scores` 与 `G.GAME.hand_usage`（`game.lua:2079`）。
 *
 * 机制上没人读它们——只有游戏结束 / 胜利界面（`create_UIBox_round_scores_row`）显示。
 * 各计数的落点照原作：
 * - `cards_played`：`play_cards_from_highlighted` 逐张 +1（`state_events.lua:503`）
 * - `cards_discarded`：`discard_cards_from_highlighted` 整批 `+#cards`，**The Hook 那次也算**（`:451`，在 `if not hook` 之外）
 * - `cards_purchased`：商店买牌（含 BUY & USE）、兑换优惠券、买补充包；**标签送的包不算**（`button_callbacks.lua:2355` 的 `from_tag`）
 * - `times_rerolled`：`reroll_shop`（`:2979`）。Director's Cut 重掷 Boss 不算
 * - `hand`：每手结算后 `check_and_set_high_score('hand', hand_chips*mult)`，取 `floor` 后的最大值
 * - `hand_usage`：`evaluate_play` 的 `set_hand_usage(text)`，被 debuff 的那手也算
 * - `new_collection`：`discover_card` 里 +1，而它第一句是 `if G.GAME.seeded then return end`——指定 seed 恒为 0
 */
import type { HandName } from './poker-hands';

export type RoundScores = {
    cardsPlayed: number;
    cardsDiscarded: number;
    cardsPurchased: number;
    timesRerolled: number;
    bestHand: number;
    /** 按**第一次打出**的先后插入。并列时的取舍见 `mostPlayedHandUsage` */
    handUsage: Map<HandName, number>;
};

export function makeRoundScores(): RoundScores {
    return {
        cardsPlayed: 0,
        cardsDiscarded: 0,
        cardsPurchased: 0,
        timesRerolled: 0,
        bestHand: 0,
        handUsage: new Map(),
    };
}

/** `check_and_set_high_score('hand', amt)` 的局内那半 */
export function recordHandScore(scores: RoundScores, amt: number): void {
    if (Math.floor(amt) > scores.bestHand) scores.bestHand = Math.floor(amt);
}

/** `set_hand_usage(text)` 的局内那半 */
export function recordHandUsage(scores: RoundScores, hand: HandName): void {
    scores.handUsage.set(hand, (scores.handUsage.get(hand) ?? 0) + 1);
}

/**
 * `create_UIBox_round_scores_row('poker_hand')`：`for k, v in pairs(G.GAME.hand_usage) do if v.count > amount ...`。
 * 一次都没出过牌时是 `{ hand: null, count: 0 }`（界面显示 `None`）。
 *
 * **近似**：原作并列时取 `pairs` 先遍历到的那个，那是 LuaJIT 哈希表的内部顺序（取决于键的哈希与表的大小），
 * 这里取先打出的那个。
 */
export function mostPlayedHandUsage(scores: RoundScores): { hand: HandName | null; count: number } {
    let hand: HandName | null = null;
    let count = 0;
    for (const [k, v] of scores.handUsage) {
        if (v > count) {
            hand = k;
            count = v;
        }
    }
    return { hand, count };
}
