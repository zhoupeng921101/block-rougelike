/**
 * 从小丑区**重算**出来的 ability 字段。
 *
 * 原作在 `Card:update`（`card.lua:4190` 起）里**每帧**重算这几个：
 * `Joker Stencil` 的 `x_mult`、`Swashbuckler` 的 `mult`、
 * `Cloud 9` 的 `nine_tally`、`Steel/Stone Joker` 的 tally、
 * `Blueprint/Brainstorm` 的 `blueprint_compat`。
 *
 * 它们**不是**「事件驱动地加减」，而是「每次都从当前状态推导」——
 * 所以复刻件不该在买卖小丑时去增量维护，而应该在用到之前调一次这个函数。
 *
 * 为什么要单独一个文件而不是塞进 `calculate.ts`：
 * `calculate_joker` 的契约是「读状态、返回一个 effect」，
 * 而这些是**写** ability 的。混在一起会让「一次调用最多产出一个 effect」
 * 那条不变量变得难以检查。
 */

import { type Card, getId } from '../card';
import { JOKER_CENTERS } from './centers.generated';
import type { Joker } from './types';

/**
 * 重算派生字段。**在任何读 ability 的地方之前调**：
 * 出牌结算之前、算小丑区文字之前、买卖小丑之后。
 *
 * `jokerSlots` 是小丑区的格子数（`Joker Stencil` 要算空格子）。
 */
export function refreshDerivedAbilities(
    jokers: Joker[],
    jokerSlots: number,
    playingCards: Card[] = [],
): void {
    for (const joker of jokers) {
        const a = joker.ability;

        switch (a.name) {
            // `card.lua:4194`：整副牌里有几张 9。**读的是 `get_id`**，
            // 所以石头牌不算（它的 id 是个假值）
            case 'Cloud 9':
                a.nine_tally = playingCards.filter((c) => getId(c) === 9).length;
                break;
            // `card.lua:4188` / `:4200`：整副牌里有几张钢铁 / 石头牌。
            // **数的是整副牌（`G.playing_cards`），不是牌堆**——手里的、弃掉的都算
            case 'Steel Joker':
                a.steel_tally = playingCards.filter((c) => c.enhancement === 'm_steel').length;
                break;
            case 'Stone Joker':
                a.stone_tally = playingCards.filter((c) => c.enhancement === 'm_stone').length;
                break;
            // `card.lua:4182`：`v.config.center.name ~= "Default Base"`——
            // **任意一种强化都算**，不挑种类。没强化的 `enhancement` 是 null
            case "Driver's License":
                a.driver_tally = playingCards.filter((c) => c.enhancement !== null).length;
                break;
            // `card.lua:4206`：空格子数，**再把小丑区里每张 Joker Stencil 自己也算一格**。
            // 那第二个循环不是笔误——Stencil 占着的格子也被当成「空的」算进去，
            // 所以两张 Stencil 在 5 格空 3 格时各给 ×5（3 + 2），不是 ×3
            case 'Joker Stencil': {
                let x = jokerSlots - jokers.length;
                for (const other of jokers) {
                    if (other.ability.name === 'Joker Stencil') x += 1;
                }
                a.x_mult = x;
                break;
            }

            // `card.lua:4243`：**其余**小丑的卖价之和（不含自己）
            case 'Swashbuckler': {
                let sellCost = 0;
                for (const other of jokers) {
                    if (other !== joker) sellCost += other.sell_cost;
                }
                a.mult = sellCost;
                break;
            }

            // `card.lua:4227`：蓝图／头脑风暴指向的那张兼不兼容。
            // 只影响 UI 上的提示文字，但算出来存着——补 UI 时不用回头找
            case 'Blueprint':
            case 'Brainstorm': {
                const target = blueprintTarget(joker, jokers);
                a.blueprint_compat =
                    target && target !== joker && JOKER_CENTERS[target.key].blueprint_compat
                        ? 'compatible'
                        : 'incompatible';
                break;
            }
        }
    }
}

/**
 * 蓝图 / 头脑风暴复制的是哪一张。
 *
 * - `Blueprint`（`card.lua:2309`）：**右边那一张**（数组里的下一个）
 * - `Brainstorm`（`card.lua:2325`）：**最左边那一张**（数组第一个）
 *
 * 两者都可能指向自己或指向不存在，调用方要查。
 */
export function blueprintTarget(self: Joker, jokers: Joker[]): Joker | null {
    if (self.ability.name === 'Brainstorm') return jokers[0] ?? null;
    if (self.ability.name === 'Blueprint') {
        const i = jokers.indexOf(self);
        return i >= 0 ? (jokers[i + 1] ?? null) : null;
    }
    return null;
}
