/**
 * 强化牌。8 种，直译自 `card.lua` 的那一组 `Card:get_*` getter。
 *
 * ## 为什么是一组 getter 而不是一张 handler 表
 *
 * 小丑的行为集中在 `calculate_joker` 一个函数里，所以那边是「按名字查表」。
 * 强化牌不是：它的效果**摊在七个 getter 上**（`get_chip_bonus` /
 * `get_chip_mult` / `get_chip_x_mult` / `get_chip_h_mult` / `get_chip_h_x_mult` /
 * `get_p_dollars` / `get_end_of_round_effect`），每个 getter 在结算管线的
 * 不同位置被调用，而**调用位置是语义**。收成一张表就得自己重排顺序，
 * 那正是最容易出错的地方。所以这里照抄七个函数。
 *
 * ## 两处消费 RNG
 *
 * - `Lucky Card` 的 `lucky_mult`（1/5 给 +20 倍率）与 `lucky_money`（1/15 给 $20）
 * - `Glass Card` 的 `glass`（1/4 碎掉），在计分之后的销毁趟里
 *
 * **`lucky_mult` 与 `lucky_money` 是两个独立的 key，而且都无条件掷**——
 * 只要这张牌是幸运牌就掷，中不中都消耗。两次掷点的先后是
 * `get_chip_mult`（第 9 步的 mult）→ `get_p_dollars`（同一步的 dollars），
 * 顺序由 `state_events.lua:721` 的 `chips → mult → dollars` 定死。
 *
 * ## `effect` 与 `name` 两个字段都要照抄
 *
 * 原文查石头牌用 `ability.effect == 'Stone Card'`，查玻璃牌用
 * `ability.name == 'Glass Card'`，查万能牌用 `ability.name == 'Wild Card'`。
 * 这 8 张上两个字段一一对应，随便用哪个结果都一样——但照原文各查各的，
 * 免得以后接 modded center 时对不上。
 */

import type { Card, Suit } from './card';
import { sealPDollars } from './seals';
import { ENHANCEMENT_CENTERS } from './enhancements.generated';

export { ENHANCEMENT_CENTERS, ENHANCEMENT_KEYS_BY_ORDER } from './enhancements.generated';

/** `P_CENTERS` 里 `set = "Enhanced"` 的一行。由生成器产出，运行时只读 */
export type EnhancementCenter = {
    order: number;
    name: string;
    effect: string;
    /** `CENTERS_ATLAS`（`Enhancers.png`）里的格子坐标 */
    pos: { x: number; y: number };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any>;
};

/** 掷点要用的那点上下文。`G.GAME.probabilities.normal` 基线 1，`Oops! All 6s` 会翻倍 */
export type ProbContext = {
    pseudorandom(key: string): number;
    probabilities: { normal: number };
};

function centerOf(card: Card): EnhancementCenter | null {
    return card.enhancement ? ENHANCEMENT_CENTERS[card.enhancement] : null;
}

/** 这张牌是不是某一种强化。查的是 `ability.name`，与原文一致 */
export function isEnhancement(card: Card, name: string): boolean {
    return centerOf(card)?.name === name;
}

/** `ability.effect == 'Stone Card'`。石头牌到处都在被单独判，提成一个函数 */
export function isStone(card: Card): boolean {
    return centerOf(card)?.effect === 'Stone Card';
}

/** `card.lua:277` 摊平出来的 `ability.bonus`，没有强化就是 0 */
export function enhancementBonus(card: Card): number {
    return centerOf(card)?.config.bonus ?? 0;
}

/**
 * `card.lua:976` 的 `get_chip_bonus`。
 *
 * **石头牌不加自己的点数**：它返回 `bonus + perma_bonus`，
 * 而普通牌返回 `base.nominal + bonus + perma_bonus`。
 * 石头牌的 50 筹码是 `config.bonus`，不是点数。
 */
export function getChipBonus(card: Card): number {
    if (card.debuff) return 0;
    const bonus = enhancementBonus(card) + card.perma_bonus;
    if (isStone(card)) return bonus;
    return card.base.nominal + bonus;
}

/**
 * `card.lua:985` 的 `get_chip_mult`。
 *
 * **幸运牌的掷点无条件发生**（只要是幸运牌），中了才给 `config.mult`。
 * 把掷点挪进 `if` 里会让同 seed 从这一手起分叉。
 */
export function getChipMult(card: Card, ctx: ProbContext): number {
    if (card.debuff) return 0;
    const center = centerOf(card);
    if (!center) return 0;

    if (center.effect === 'Lucky Card') {
        if (ctx.pseudorandom('lucky_mult') < ctx.probabilities.normal / 5) {
            // `card.lua:990`：中了就给 `Lucky Cat` 留个标记。
            // **清除在小丑逐张循环之后**（`state_events.lua:721`），不在这里
            card.lucky_trigger = true;
            return center.config.mult ?? 0;
        }
        return 0;
    }
    return center.config.mult ?? 0;
}

/** `card.lua:1000` 的 `get_chip_x_mult`。玻璃牌的 ×2 走这里 */
export function getChipXMult(card: Card): number {
    if (card.debuff) return 0;
    return centerOf(card)?.config.Xmult ?? 0;
}

/** `card.lua:1007` 的 `get_chip_h_mult`。8 张强化牌里没有一张用它，留着对齐原文 */
export function getChipHMult(card: Card): number {
    if (card.debuff) return 0;
    return centerOf(card)?.config.h_mult ?? 0;
}

/** `card.lua:1012` 的 `get_chip_h_x_mult`。**钢铁牌的 ×1.5 走这里**，且是留在手里才算 */
export function getChipHXMult(card: Card): number {
    if (card.debuff) return 0;
    return centerOf(card)?.config.h_x_mult ?? 0;
}

/**
 * `card.lua:1074` 的 `get_p_dollars`。幸运牌的 $20 走这里，1/15。
 *
 * **不往 `dollar_buffer` 里写。** 原文写了是因为 `ease_dollars` 入队延迟，
 * 而本复刻的加钱是同步立即的——往里加会让 `Bull` 把同一笔算两遍（见 map 的已知的坑）。
 */
export function getPDollars(card: Card, ctx: ProbContext): number {
    if (card.debuff) return 0;

    // `card.lua:1072`：**Gold 蜡封那一段排在最前面**，与强化牌的 p_dollars 叠加
    let ret = sealPDollars(card);

    const center = centerOf(card);
    const p = center?.config.p_dollars ?? 0;
    if (p <= 0) return ret;

    if (center?.effect === 'Lucky Card') {
        // 掷点**无条件发生**，中不中都消耗
        if (ctx.pseudorandom('lucky_money') < ctx.probabilities.normal / 15) {
            // `card.lua:1078`：中钱也置位，与中倍率共用一个标记
            card.lucky_trigger = true;
            ret += p;
        }
        return ret;
    }
    return ret + p;
}

/** `card.lua:1034` 的 `get_end_of_round_effect`。**黄金牌的 $3 走这里**，留在手里才算 */
export function getEndOfRoundDollars(card: Card): number {
    if (card.debuff) return 0;
    return centerOf(card)?.config.h_dollars ?? 0;
}

/**
 * `card.lua:4072` 的 `Card:is_suit` 那一支。
 *
 * 两条：
 * - **万能牌算所有花色**（`ability.name == "Wild Card"`，且没被 debuff）
 * - **石头牌不算任何花色**（它在 `is_suit` 里先 `return` 掉）
 *
 * `Smeared Joker`（红桃认方块、黑桃认梅花）是另一层，由调用方合并。
 */
export function enhancedIsSuit(card: Card, _suit: Suit): boolean | null {
    if (isStone(card)) return false;
    if (isEnhancement(card, 'Wild Card') && !card.debuff) return true;
    return null; // 这张牌没有意见，按 base.suit 判
}

/**
 * `card.lua:958` 的 `get_id` 那一支。
 *
 * 原文对石头牌返回 `-math.random(100, 1000000)`——**一个随便的负数**，
 * 目的只是「与任何真实点数都不相等」。那次 `math.random` 用的是**全局流**
 * （没有 `pseudoseed`），02 号票已查明全局流不参与可复现性，
 * 所以这里返回一个固定的负数就够了，不必真去掷。
 */
export const STONE_ID = -1;

export function enhancedGetId(card: Card): number | null {
    return isStone(card) ? STONE_ID : null;
}
