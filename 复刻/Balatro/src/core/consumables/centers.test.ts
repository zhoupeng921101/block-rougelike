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
    it('塔罗 22 张、星球 12 张、幽灵 18 张，合起来 52', () => {
        expect(CONSUMABLE_KEYS_BY_SET.Tarot).toHaveLength(22);
        expect(CONSUMABLE_KEYS_BY_SET.Planet).toHaveLength(12);
        expect(CONSUMABLE_KEYS_BY_SET.Spectral).toHaveLength(18);
        expect(Object.keys(CONSUMABLE_CENTERS)).toHaveLength(52);
    });

    it('三个 set 内部都按 order 严格递增（池子下标靠它）', () => {
        for (const keys of [
            CONSUMABLE_KEYS_BY_SET.Tarot,
            CONSUMABLE_KEYS_BY_SET.Planet,
            CONSUMABLE_KEYS_BY_SET.Spectral,
        ]) {
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

    it('只有三个 set，没有 `c_base` 那张底板混进来', () => {
        const sets = new Set(Object.values(CONSUMABLE_CENTERS).map((c) => c.set));
        expect([...sets].sort()).toEqual(['Planet', 'Spectral', 'Tarot']);
    });

    /**
     * `The Soul` 与 `Black Hole` 带 `hidden`，被 `get_current_pool` 无条件剔除
     * （`common_events.lua:2062`）。它们只能从 `create_card` 的 soulable 分支来。
     */
    it('只有 The Soul 与 Black Hole 是 hidden', () => {
        const hidden = Object.entries(CONSUMABLE_CENTERS)
            .filter(([, c]) => c.hidden)
            .map(([, c]) => c.name);
        expect(hidden.sort()).toEqual(['Black Hole', 'The Soul']);
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

    it('塔罗与星球 $3，幽灵牌 $4', () => {
        for (const k of [...CONSUMABLE_KEYS_BY_SET.Tarot, ...CONSUMABLE_KEYS_BY_SET.Planet]) {
            expect(CONSUMABLE_CENTERS[k].cost, k).toBe(3);
        }
        for (const k of CONSUMABLE_KEYS_BY_SET.Spectral) {
            expect(CONSUMABLE_CENTERS[k].cost, k).toBe(4);
        }
    });

    it('没有这张 key 就抛，不静默造一张空卡', () => {
        expect(() => makeConsumable('c_not_a_card')).toThrow('没有这张消耗品');
    });
});
