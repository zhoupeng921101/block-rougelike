/**
 * 造一张消耗品。`card.lua:223` `Card:set_ability` 与 `:369` `Card:set_cost`
 * 的消耗品分支。
 *
 * 比小丑那一支短得多：消耗品没有 `mult` / `x_mult` 那一组摊平字段
 * （`calculate_joker` 不对它们跑），只有 `self.ability.consumeable = center.config`。
 * 价格那一条与小丑**完全一样**，所以直接借 `jokers/instance.ts` 的两个函数，
 * 不复制一遍——复制的那一份迟早会和原文漂开。
 */

import { buyCost, sellCost } from '../jokers';
import type { HandName } from '../poker-hands';
import { CONSUMABLE_CENTERS, CONSUMABLE_KEYS_BY_SET } from './centers.generated';
import type { Consumable, PlanetConfig } from './types';

export function makeConsumable(key: string): Consumable {
    const center = CONSUMABLE_CENTERS[key];
    if (!center) throw new Error(`没有这张消耗品：${key}`);

    const cost = buyCost(center);
    return { key, center, cost, sell_cost: sellCost(cost) };
}

/**
 * 按牌型找对应的那张星球。`card.lua:1050` 的
 * `for k, v in pairs(P_CENTER_POOLS.Planet) do if v.config.hand_type == _hand then ... end`。
 *
 * `Blue` 蜡封与 `v_telescope` 优惠券都用它——**它不抽随机，是按牌型查表**。
 */
export function planetKeyFor(hand: HandName): string | null {
    for (const key of CONSUMABLE_KEYS_BY_SET.Planet) {
        if ((CONSUMABLE_CENTERS[key].config as PlanetConfig).hand_type === hand) return key;
    }
    return null;
}
