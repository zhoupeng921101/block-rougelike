/**
 * 32 个补充包与 `get_pack`。
 *
 * 这组测试盯两件事：**生成器有没有把数据抽歪**，
 * 以及**权重累加的顺序与浮点尾差对不对**——后者是这一票最容易静默出错的地方。
 */

import { describe, expect, it } from 'vitest';

import {
    BOOSTER_CENTERS,
    BOOSTER_KEYS_BY_ORDER,
    BOOSTER_WEIGHT_TOTAL,
    getPack,
} from './boosters';
import { PseudorandomState } from './rng';

const ctx = (overrides: Partial<{ ante: number; firstShopBuffoon: boolean }> = {}) => ({
    ante: 1,
    firstShopBuffoon: true,
    ...overrides,
});

describe('32 个包的数据', () => {
    it('五种口味各 8 / 8 / 8 / 4 / 4', () => {
        const tally: Record<string, number> = {};
        for (const c of Object.values(BOOSTER_CENTERS)) tally[c.kind] = (tally[c.kind] ?? 0) + 1;
        expect(tally).toEqual({ Arcana: 8, Celestial: 8, Standard: 8, Buffoon: 4, Spectral: 4 });
    });

    it('按 order 严格递增（累积权重循环靠它）', () => {
        const orders = BOOSTER_KEYS_BY_ORDER.map((k) => BOOSTER_CENTERS[k].order);
        expect(orders).toEqual([...orders].sort((a, b) => a - b));
        expect(new Set(orders).size).toBe(32);
    });

    it('普通包 $4/3 张、Jumbo $6/5 张、Mega $8/5 张挑 2', () => {
        expect(BOOSTER_CENTERS.p_arcana_normal_1).toMatchObject({ cost: 4, extra: 3, choose: 1 });
        expect(BOOSTER_CENTERS.p_arcana_jumbo_1).toMatchObject({ cost: 6, extra: 5, choose: 1 });
        expect(BOOSTER_CENTERS.p_arcana_mega_1).toMatchObject({ cost: 8, extra: 5, choose: 2 });
    });

    it('幽灵包小一号：普通 2 张、Jumbo 4 张、Mega 4 张挑 2', () => {
        expect(BOOSTER_CENTERS.p_spectral_normal_1).toMatchObject({ cost: 4, extra: 2, choose: 1 });
        expect(BOOSTER_CENTERS.p_spectral_jumbo_1).toMatchObject({ cost: 6, extra: 4, choose: 1 });
        expect(BOOSTER_CENTERS.p_spectral_mega_1).toMatchObject({ cost: 8, extra: 4, choose: 2 });
    });
});

describe('权重', () => {
    /**
     * **尾差是故意的。** 原文 `cume = cume + (v.weight or 1)` 按 order 序
     * 逐个累加双精度，而 0.25 / 0.3 / 0.07 / 0.6 / 0.15 在二进制里都不精确。
     * 写成 22.42 会让贴着边界的那次掷点落进不同的桶。
     */
    it('权重和是 22.420000000000005，不是 22.42', () => {
        expect(BOOSTER_WEIGHT_TOTAL).toBe(22.420000000000005);
        expect(BOOSTER_WEIGHT_TOTAL).not.toBe(22.42);
    });

    it('五种口味的权重份额：奥秘 / 天体 / 标准各 6.5，小丑 1.95，幽灵 0.97', () => {
        const byKind: Record<string, number> = {};
        for (const c of Object.values(BOOSTER_CENTERS)) {
            byKind[c.kind] = (byKind[c.kind] ?? 0) + c.weight;
        }
        expect(byKind.Arcana).toBeCloseTo(6.5, 10);
        expect(byKind.Celestial).toBeCloseTo(6.5, 10);
        expect(byKind.Standard).toBeCloseTo(6.5, 10);
        expect(byKind.Buffoon).toBeCloseTo(1.95, 10);
        expect(byKind.Spectral).toBeCloseTo(0.97, 10);
    });
});

describe('getPack', () => {
    /**
     * `common_events.lua:1984`。新档的第一个商店，第一格恒是小丑包，
     * **而且那一次不掷点**（提前 return）。少算这一条，
     * 从第一个商店起 `shop_pack1` 的调用次数就偏一次。
     */
    it('新档第一格恒是小丑包，且不消费 RNG', () => {
        const rng = new PseudorandomState('ALEEB');
        const probe = new PseudorandomState('ALEEB');

        const [key, consumed] = getPack(rng, ctx({ firstShopBuffoon: false }));
        expect(key).toBe('p_buffoon_normal_1');
        expect(consumed).toBe(false);
        // 状态没动
        expect(rng.pseudorandom('shop_pack1')).toBe(probe.pseudorandom('shop_pack1'));
    });

    it('之后每一格都消费一次 shop_pack<ante>', () => {
        const rng = new PseudorandomState('ALEEB');
        const [, consumed] = getPack(rng, ctx());
        expect(consumed).toBe(true);
    });

    it('抽出来的永远是 32 个里的一个', () => {
        const rng = new PseudorandomState('ALEEB');
        for (let i = 0; i < 200; i++) {
            const [key] = getPack(rng, ctx({ ante: (i % 8) + 1 }));
            expect(BOOSTER_KEYS_BY_ORDER).toContain(key);
        }
    });

    /**
     * 分布抽检：跑一批 seed 数各口味出现次数。
     * 期望份额 = 权重份额（奥秘/天体/标准各 ~29%、小丑 ~8.7%、幽灵 ~4.3%）。
     * **这是分布断言，不是精确值**——所以区间开得宽，只挡「整张表接反了」。
     */
    it('分布大致对得上权重：奥秘／天体／标准三者都远多于幽灵', () => {
        const tally: Record<string, number> = {};
        for (let s = 0; s < 400; s++) {
            const rng = new PseudorandomState(`S${s}`);
            const [key] = getPack(rng, ctx());
            const kind = BOOSTER_CENTERS[key].kind;
            tally[kind] = (tally[kind] ?? 0) + 1;
        }
        // 期望 ~116 / ~116 / ~116 / ~35 / ~17
        for (const kind of ['Arcana', 'Celestial', 'Standard']) {
            expect(tally[kind], kind).toBeGreaterThan(70);
            expect(tally[kind], kind).toBeLessThan(170);
        }
        expect(tally.Spectral ?? 0).toBeLessThan(tally.Buffoon ?? 0);
        expect(tally.Buffoon ?? 0).toBeLessThan(tally.Arcana);
    });

    it('同 seed 同 ante 抽到同一个包', () => {
        const a = getPack(new PseudorandomState('TUTORIAL'), ctx());
        const b = getPack(new PseudorandomState('TUTORIAL'), ctx());
        expect(a).toEqual(b);
    });

    it('ante 不同 → key 不同 → 结果可以不同', () => {
        const a = getPack(new PseudorandomState('TUTORIAL'), ctx({ ante: 1 }));
        const b = getPack(new PseudorandomState('TUTORIAL'), ctx({ ante: 5 }));
        // 不断言一定不同（可能撞上），只断言两次都合法
        expect(BOOSTER_KEYS_BY_ORDER).toContain(a[0]);
        expect(BOOSTER_KEYS_BY_ORDER).toContain(b[0]);
    });
});
