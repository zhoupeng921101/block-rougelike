/**
 * 对拍基准：16 条外部真值。
 *
 * 这 16 条**不依赖实机、不依赖素材**，是目前唯一拿得到的外部 ground truth。
 * 它们必须在写第一行 gameplay 代码之前就绿着——后面每一步直译都靠它兜底。
 *
 * 出处与推导见 .scratch/balatro-复刻/research/02-LuaJIT-RNG.md §9。
 */

import { describe, expect, it } from 'vitest';

import { fmt13, formatFixedExact } from './fmt13';
import { SEED_FIXED_REFERENCE, random, randomseed } from './luajit-random';
import { ANTE_1_BOSSES, ANTE_1_BOSS_VECTORS } from '../fixtures/ante1-boss-vectors';
import { PseudorandomState, pseudohash } from './pseudorandom';

describe('第一层：TW223 本身（4/4）', () => {
    it('randomseed(0.0) 的状态等于 LuaJIT 的 lj_prng_seed_fixed', () => {
        // 这四个常量同时出现在 参考/产物/Balatro_1.0.1o/原生库/arm64-v8a/liblove.so
        // 的字节偏移 1159408 / 1159416 / 1156768 / 1156776——
        // 即「这里复刻的算法」与「游戏实际链接的那份 LuaJIT」是同一份代码。
        expect(randomseed(0.0)).toEqual([...SEED_FIXED_REFERENCE]);
    });

    // 真值：balatro4j 的 LuaRandom.test.js KNOWN_VALUES
    const firstDraw: ReadonlyArray<readonly [number, number]> = [
        [0.0, 0.794206292431241],
        [1.0, 0.3238105623786367],
        [42.0, 0.9560792879182105],
        [12345.0, 0.3579737466187569],
    ];

    it.each(firstDraw)('randomseed(%f) 后首个 math.random() = %f', (seed, expected) => {
        expect(random(randomseed(seed))).toBe(expected);
    });
});

describe('第二层：完整链路 → Ante 1 的 Boss Blind（12/12）', () => {
    /**
     * 这一层只验 **RNG 算法本身**：手写一遍 `pseudorandom('boss', 1, 8)`。
     * 「生产代码的接线也对」是另一件事，由 `blinds.test.ts` 用同一份 fixture 验
     * （那边真的走 `getNewBoss`，能抓到池子顺序与池子大小的错）。
     */
    function ante1Boss(seed: string): string {
        const state = new PseudorandomState(seed);
        // get_new_boss 走 pseudorandom_element(eligible, pseudoseed('boss'))，
        // 池子固定 8 个、下标 1-based，等价于 math.random(8)
        return ANTE_1_BOSSES[state.pseudorandom('boss', 1, 8) - 1];
    }

    it.each(ANTE_1_BOSS_VECTORS)('种子 %s → %s', (seed, expected) => {
        expect(ante1Boss(seed)).toBe(expected);
    });

    it('对输入逐字符敏感：种子尾随一个空格就换一个 boss', () => {
        // Blueprint 的 SF9SZOB1 fixture 里 seed 字段实际带一个尾随空格，
        // 按字面值算得 The Club。这既是那条 fixture 的数据瑕疵，
        // 也反过来印证实现没有偷偷 trim 输入。
        expect(ante1Boss('SF9SZOB1 ')).toBe('The Club');
        expect(ante1Boss('SF9SZOB1')).toBe('The Head');
    });
});

describe('%.13f 的舍入口径', () => {
    it('走 round-half-to-even，不是 toFixed 的 half-away', () => {
        // 分歧集是「奇数/16384」这类第 14 位精确落在半个单位上的值
        const x = 1 / 16384; // = 0.00006103515625

        expect(formatFixedExact(x, 13, true)).toBe('0.0000610351562'); // 向偶数舍——LuaJIT 口径
        expect(formatFixedExact(x, 13, false)).toBe('0.0000610351563'); // 向远离零舍
        expect(x.toFixed(13)).toBe('0.0000610351563'); // JS 自带的是 half-away
        expect(fmt13(x)).toBe(0.0000610351562); // 我们要的是 half-even
    });

    it('不用 Immolate 系的 round(x*1e13)/1e13', () => {
        // 那个近似与精确值整体有约 0.05% 的分叉率。
        // 这里钉两个已知分叉点作回归锚点，比跑一遍随机采样稳。
        const immolate = (v: number) => Math.round(v * 1e13) / 1e13;

        expect(immolate(0.96432006404005)).toBe(0.9643200640401);
        expect(fmt13(0.96432006404005)).toBe(0.96432006404);

        expect(immolate(0.54436445261555)).toBe(0.5443644526156);
        expect(fmt13(0.54436445261555)).toBe(0.5443644526155);
    });
});

describe('浮点哈希层的中间值', () => {
    // 未找到公开来源可对，仅作回归锚点：改动 pseudohash 时这里会先红
    it('pseudohash 的已知值', () => {
        expect(pseudohash('ALEEB')).toBe(0.22857354040434075);
        expect(pseudohash('Joker1ALEEB')).toBe(0.8446389227813142);
    });

    it('pseudoseed 对同一个 key 连续推进', () => {
        const state = new PseudorandomState('ALEEB');
        expect([state.pseudoseed('boss'), state.pseudoseed('boss'), state.pseudoseed('boss')]).toEqual([
            0.1803697639015704, 0.29546120627267036, 0.4939148005815704,
        ]);
    });

    it('快照可回滚——对拍要能 checkpoint', () => {
        const state = new PseudorandomState('ALEEB');
        state.pseudoseed('boss');

        const checkpoint = state.snapshot();
        const next = state.pseudoseed('boss');

        state.restore(checkpoint);
        expect(state.pseudoseed('boss')).toBe(next);
    });

    it('跨 key 互不干扰——只有同 key 的调用序要对齐', () => {
        const a = new PseudorandomState('ALEEB');
        const b = new PseudorandomState('ALEEB');

        a.pseudoseed('boss');
        b.pseudoseed('shuffle'); // 插一个别的 key
        b.pseudoseed('boss');

        expect(a.pseudoseed('boss')).toBe(b.pseudoseed('boss'));
    });
});
