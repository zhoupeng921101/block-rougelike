/**
 * 出牌结算管线。直译自
 * `参考/产物/Balatro_1.0.1o/源码/functions/state_events.lua:592-1030` 的 `evaluate_play`。
 *
 * **本切片只实现 15 步里的第 3、4、7、9、14 步**——
 * 第 2/5/8 步是盲注钩子、第 6/11/15 步是小丑遍历、第 10 步是手牌区、
 * 第 12 步是牌背、第 13 步是摧毁判定，全都要等有小丑/强化牌/Boss 盲注才有内容。
 * 切片边界见 07 号票。
 *
 * 全景与每一步的作用面见 `参考/结论/Balatro_1.0.1o/出牌结算管线.md`。
 */

import type { Card } from './card';
import { type HandName, type JokerFlags, NO_JOKERS, evaluatePokerHand } from './poker-hands';

export type { HandName };

/** `game.lua:2211-2224` 的 `G.GAME.hands`。本切片只用到 `chips` / `mult` / `level`。 */
export type HandInfo = {
    chips: number;
    mult: number;
    /** 每升一级加的筹码 */
    l_chips: number;
    /** 每升一级加的倍率 */
    l_mult: number;
    level: number;
    played: number;
};

export function initialHands(): Record<HandName, HandInfo> {
    // 数值逐字抄自 game.lua:2212-2223
    const h = (chips: number, mult: number, l_chips: number, l_mult: number): HandInfo => ({
        chips, mult, l_chips, l_mult, level: 1, played: 0,
    });

    return {
        'Flush Five': h(160, 16, 50, 3),
        'Flush House': h(140, 14, 40, 4),
        'Five of a Kind': h(120, 12, 35, 3),
        'Straight Flush': h(100, 8, 40, 4),
        'Four of a Kind': h(60, 7, 30, 3),
        'Full House': h(40, 4, 25, 2),
        Flush: h(35, 4, 15, 2),
        Straight: h(30, 4, 30, 3),
        'Three of a Kind': h(30, 3, 20, 2),
        'Two Pair': h(20, 2, 20, 1),
        Pair: h(10, 2, 15, 1),
        'High Card': h(5, 1, 10, 1),
    };
}

/**
 * `card.lua:977` 的 `Card:get_chip_bonus`。
 *
 * 本切片没有强化牌（`ability.bonus`）与石头牌，所以只剩 `base.nominal`。
 * 留成函数而不是内联，是为了接强化牌时只改这一处。
 */
export function getChipBonus(card: Card): number {
    return card.base.nominal;
}

export type PlayResult = {
    handName: HandName;
    /** 第 4 步定下的计分牌集合，已按 `T.x` 排序 */
    scoringHand: Card[];
    /** 第 7 步取到的牌型基础值 */
    baseChips: number;
    baseMult: number;
    /** 第 9 步之后的累加器 */
    handChips: number;
    mult: number;
    /** 第 14 步：`math.floor(hand_chips * mult)` */
    score: number;
};

/**
 * 一次出牌的结算。
 *
 * `playedCards` 是打出去的那几张（最多 5 张），**顺序必须是手牌里从左到右**——
 * 原作靠 `table.sort(scoring_hand, function(a,b) return a.T.x < b.T.x end)`
 * （`state_events.lua:621`）保证这一点，这里照搬，读的是 `T.x`。
 * `T.x` 的单位是 tile 不是像素，见 10 号票。
 */
export function evaluatePlay(
    playedCards: Card[],
    hands: Record<HandName, HandInfo>,
    jokers: JokerFlags = NO_JOKERS,
): PlayResult {
    // —— 第 3 步：牌型判定 ——
    const results = evaluatePokerHand(playedCards, jokers);
    const handName = results.topName;
    if (!handName || !results.top) {
        throw new Error('evaluate_poker_hand 没有返回 top —— 空手牌？');
    }

    hands[handName].played++;

    // —— 第 4 步：确定计分牌集合 ——
    // 默认只有构成牌型的那几张进 scoring_hand。
    // 泼溅（Splash）让全部 5 张都计分、石头牌无条件追加——本切片都没有，
    // 所以这里只有默认分支。见 `出牌结算管线.md` §2。
    const scoringHand = [...results.top[0]];

    // 按屏幕上的 x 坐标排序 = 手牌里从左到右。
    // 「打出的第一张计分牌」指的是最左边那张，玩家可以靠调手牌顺序控制它。
    scoringHand.sort((a, b) => a.T.x - b.T.x);

    // —— 第 7 步：取牌型的基础筹码与基础倍率 ——
    // 注意读的是**升级之后**的值：原作第 6 步（小丑「出牌前」遍历）比这里早，
    // 所以"出牌前升级牌型"这类效果当次就生效。本切片没有小丑，但顺序要留对。
    const baseChips = hands[handName].chips;
    const baseMult = hands[handName].mult;

    let handChips = baseChips;
    let mult = baseMult;

    // —— 第 9 步：逐张计分牌结算（左 → 右）——
    // 原作在这里还会跑重复触发（红蜡封）、强化牌、版本、逐张型小丑，
    // 本切片都没有，只剩牌面筹码。
    for (const card of scoringHand) {
        handChips += getChipBonus(card);
    }

    // —— 第 14 步：全局唯一的一次乘法 ——
    const score = Math.floor(handChips * mult);

    return { handName, scoringHand, baseChips, baseMult, handChips, mult, score };
}

/** `misc_functions.lua:922` 的 `get_blind_amount`，前 8 个 Ante 写死。 */
const ANTE_AMOUNTS = [300, 800, 2000, 5000, 11000, 20000, 35000, 50000];

export function getBlindAmount(ante: number): number {
    if (ante < 1) return 100;
    if (ante <= 8) return ANTE_AMOUNTS[ante - 1];

    // Ante 9 起走公式。本切片到不了，但直译过来免得以后忘。
    const a = ANTE_AMOUNTS[7];
    const b = 1.6;
    const c = ante - 8;
    const d = 1 + 0.2 * (ante - 8);
    let amount = Math.floor(a * Math.pow(b + Math.pow(0.75 * c, d), c));
    amount = amount - (amount % Math.pow(10, Math.floor(Math.log10(amount) - 1)));
    return amount;
}

/** `game.lua:267-268`。小盲注 ×1、大盲注 ×1.5。 */
export const BLIND_MULT = { small: 1, big: 1.5 } as const;

export function blindRequirement(ante: number, blind: keyof typeof BLIND_MULT): number {
    return getBlindAmount(ante) * BLIND_MULT[blind];
}
