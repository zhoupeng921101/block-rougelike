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
import { CONSUMABLE_CENTERS } from './centers.generated';
import type { Consumable } from './types';

export function makeConsumable(key: string): Consumable {
    const center = CONSUMABLE_CENTERS[key];
    if (!center) throw new Error(`没有这张消耗品：${key}`);

    const cost = buyCost(center);
    return { key, center, cost, sell_cost: sellCost(cost) };
}
