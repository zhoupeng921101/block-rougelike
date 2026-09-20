/**
 * 生成出来的 34 张消耗品 center。
 *
 * 这组测试盯的是**生成器有没有把数据抽歪**，不是行为。
 * 抽歪了的后果是静默的：少一张会让池子长度变了、`math.random(#pool)` 的
 * 取值域跟着变，同 seed 的商店立刻与原版分叉，而屏幕上看起来一切正常。
 *
 * 期望值逐条对照 `参考/产物/Balatro_1.0.1o/源码/game.lua:534-569`。
 */

import { describe, expect, it } from 'vitest';

import { CONSUMABLE_CENTERS, CONSUMABLE_KEYS_BY_SET, makeConsumable } from './index';
import type { PlanetConfig } from './types';

describe('张数与顺序', () => {
    it('塔罗 22 张、星球 12 张，合起来 34', () => {
        expect(CONSUMABLE_KEYS_BY_SET.Tarot).toHaveLength(22);
        expect(CONSUMABLE_KEYS_BY_SET.Planet).toHaveLength(12);
        expect(Object.keys(CONSUMABLE_CENTERS)).toHaveLength(34);
    });

    it('两个 set 内部都按 order 严格递增（池子下标靠它）', () => {
        for (const keys of [CONSUMABLE_KEYS_BY_SET.Tarot, CONSUMABLE_KEYS_BY_SET.Planet]) {
            const orders = keys.map((k) => CONSUMABLE_CENTERS[k].order);
            expect(orders).toEqual([...orders].sort((a, b) => a - b));
            expect(new Set(orders).size).toBe(orders.length);
        }
    });

    it('塔罗的头尾是 The Fool 与 The World', () => {
        const keys = CONSUMABLE_KEYS_BY_SET.Tarot;
        expect(CONSUMABLE_CENTERS[keys[0]].name).toBe('The Fool');
        expect(CONSUMABLE_CENTERS[keys[21]].name).toBe('The World');
    });

    it('星球是水金地火木土天海冥 + 三张 softlock，顺序照 order', () => {
        expect(CONSUMABLE_KEYS_BY_SET.Planet.map((k) => CONSUMABLE_CENTERS[k].name)).toEqual([
            'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn',
            'Uranus', 'Neptune', 'Pluto', 'Planet X', 'Ceres', 'Eris',
        ]);
    });

    it('没有混进幽灵牌（生成器只抽 Tarot 与 Planet）', () => {
        const sets = new Set(Object.values(CONSUMABLE_CENTERS).map((c) => c.set));
        expect([...sets].sort()).toEqual(['Planet', 'Tarot']);
    });
});

describe('星球牌的 hand_type 覆盖 12 个牌型，一一对应', () => {
    it('12 张星球对上 12 个牌型，不重不漏', () => {
        const hands = CONSUMABLE_KEYS_BY_SET.Planet.map(
            (k) => (CONSUMABLE_CENTERS[k].config as PlanetConfig).hand_type,
        );
        expect(new Set(hands).size).toBe(12);
        expect(hands).toContain('High Card');
        expect(hands).toContain('Flush Five');
    });

    it('只有 Planet X / Ceres / Eris 带 softlock（对应牌型打出过才进池）', () => {
        const locked = CONSUMABLE_KEYS_BY_SET.Planet
            .filter((k) => (CONSUMABLE_CENTERS[k].config as PlanetConfig).softlock)
            .map((k) => CONSUMABLE_CENTERS[k].name);
        expect(locked).toEqual(['Planet X', 'Ceres', 'Eris']);
    });

    it('那三张锁的正是三个五张同点的牌型', () => {
        const locked = CONSUMABLE_KEYS_BY_SET.Planet
            .map((k) => CONSUMABLE_CENTERS[k].config as PlanetConfig)
            .filter((c) => c.softlock)
            .map((c) => c.hand_type);
        expect(locked).toEqual(['Five of a Kind', 'Flush House', 'Flush Five']);
    });
});

describe('价格', () => {
    it('塔罗与星球都是 cost 3，卖价 max(1, floor(3/2)) = 1', () => {
        const fool = makeConsumable('c_fool');
        expect(fool.cost).toBe(3);
        expect(fool.sell_cost).toBe(1);

        const pluto = makeConsumable('c_pluto');
        expect(pluto.cost).toBe(3);
        expect(pluto.sell_cost).toBe(1);
    });

    it('34 张的 base cost 全是 3', () => {
        expect(Object.values(CONSUMABLE_CENTERS).every((c) => c.cost === 3)).toBe(true);
    });

    it('没有这张 key 就抛，不静默造一张空卡', () => {
        expect(() => makeConsumable('c_not_a_card')).toThrow('没有这张消耗品');
    });
});
