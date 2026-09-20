/**
 * 蜡封（seal）：Red / Blue / Gold / Purple。
 *
 * 直译自 `参考/产物/Balatro_1.0.1o/源码/`：
 * - `card.lua:2245` `Card:calculate_seal`（Red 的重复触发、Purple 的弃牌造塔罗）
 * - `card.lua:1072` `Card:get_p_dollars` 的第一段（Gold 打出给 $3）
 * - `card.lua:1041` `Card:get_end_of_round_effect`（Blue 回合结束造星球）
 *
 * ## 四种蜡封分别挂在四个**不同的**钩子上
 *
 * | 蜡封 | 钩子 | 位置 |
 * |---|---|---|
 * | Red | `context.repetition` | 逐张循环的重复次数，**排在小丑的重复之前** |
 * | Gold | `get_p_dollars` | 逐张循环里，**排在幸运牌的 `p_dollars` 之前** |
 * | Purple | `context.discard` | 弃牌时，逐张 |
 * | Blue | `get_end_of_round_effect` | 回合结束，**只认留在手里的** |
 *
 * 四个钩子互不相干，所以这个文件是四个独立的小函数，不是一张表。
 *
 * ## 原文里有一处 copy-paste bug，照抄
 *
 * Purple 蜡封造塔罗时用的 key_append 是 **`'8ba'`**（`card.lua:2263`），
 * 也就是 `8 Ball` 那张小丑的。看起来是从上面抄下来忘了改，
 * 但它决定了 seed key（`Tarot8ba<ante>`），**照抄才对得上**。
 */

import type { Card } from './card';
import type { HandName } from './poker-hands';

export type Seal = 'Red' | 'Blue' | 'Gold' | 'Purple';

/** `card.lua:1072`。Gold 蜡封打出时给 $3 */
export const GOLD_SEAL_DOLLARS = 3;

/**
 * `card.lua:2247` 的 `context.repetition` 分支。Red 蜡封让这张牌多触发一次。
 *
 * **被 debuff 的不给**（`calculate_seal` 第一句）。
 */
export function sealRepetitions(card: Card): number {
    if (card.debuff) return 0;
    return card.seal === 'Red' ? 1 : 0;
}

/** `card.lua:1072`。**排在幸运牌那一段之前**，两者可以叠加 */
export function sealPDollars(card: Card): number {
    if (card.debuff) return 0;
    return card.seal === 'Gold' ? GOLD_SEAL_DOLLARS : 0;
}

/** 这张牌被弃掉时要不要造塔罗（Purple）。`card.lua:2256` */
export function sealDiscardCreatesTarot(card: Card): boolean {
    if (card.debuff) return false;
    return card.seal === 'Purple';
}

/**
 * `card.lua:2263` 的 key_append。**是 `'8ba'` 不是 `'pur'`**——
 * 原文从 `8 Ball` 那段抄下来忘了改。照抄才对得上 seed。
 */
export const PURPLE_SEAL_APPEND = '8ba';

/**
 * 这张牌回合结束时要不要造星球（Blue）。`card.lua:1041`。
 *
 * 造的不是随机星球，而是**上一手打出的牌型对应的那张**
 * （`G.GAME.last_hand_played`）。没打过牌就不造。
 */
export function sealEndOfRoundPlanet(card: Card, lastHandPlayed?: HandName): HandName | null {
    if (card.debuff) return null;
    if (card.seal !== 'Blue') return null;
    return lastHandPlayed ?? null;
}
