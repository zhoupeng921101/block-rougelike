/**
 * 「墙在哪」的**结论版**：60 个 seed，三组并排。默认 `npm test` 不跑它（约 6 秒），
 * 要跑用 `npm run test:slow`。
 *
 * 为什么要 60 个：`depth.test.ts` 那 8 个 seed 只够当快照——
 * 一处小的策略改动就能让某些 seed 升三级、另一些降两级，8 个的均值会被这种噪声带着走。
 *
 * 三组：
 * - **贪心**：`greedy-bot.ts`
 * - **挑牌**：`picky-bot.ts`
 * - **挑牌、禁掉强化牌那 9 张**：量那 9 张的贡献（见下面最后一条）
 *
 * 红了的处理与 `depth.test.ts` 相同：先想清楚是内容变了、bot 变了还是 RNG 顺序变了。
 */

import { describe, expect, it } from 'vitest';

import { makeStandardDeck } from './card';
import { greedyRun } from './fixtures/greedy-bot';
import { pickyRun } from './fixtures/picky-bot';
import { Run } from './run';

const SEEDS = Array.from({ length: 60 }, (_, i) => `S${i * 7919}`);

const NINE: ReadonlySet<string> = new Set([
    'Marble Joker', 'Steel Joker', 'Vampire', 'Midas Mask', 'Stone Joker',
    'Lucky Cat', 'Golden Ticket', 'Glass Joker', "Driver's License",
]);

const fresh = (seed: string) => new Run(seed, makeStandardDeck());
const greedy = SEEDS.map((s) => greedyRun(fresh(s)));
const picky = SEEDS.map((s) => pickyRun(fresh(s)));
const pickyBanned = SEEDS.map((s) => pickyRun(fresh(s), { bannedJokers: NINE }));

const mean = (xs: Array<{ ante: number }>) =>
    Math.round((xs.reduce((n, r) => n + r.ante, 0) / xs.length) * 1000) / 1000;
/** 死在 Ante 1..10 的各有几局 */
const histogram = (xs: Array<{ ante: number }>) =>
    Array.from({ length: 10 }, (_, a) => xs.filter((r) => r.ante === a + 1).length);

describe('60 个 seed 的墙', { timeout: 60_000 }, () => {
    it('贪心：平均 2.333，一半以上死在 Ante 2', () => {
        expect(mean(greedy)).toBe(2.333);
        expect(histogram(greedy)).toEqual([4, 35, 19, 1, 1, 0, 0, 0, 0, 0]);
    });

    /**
     * **策略欠的约是 1.5 个 Ante。** 贪心的墙主要是策略墙，不是内容墙。
     * 最大的一项是小丑估值：贪心把钱先花在包上、买小丑不看好坏，
     * 死的时候小丑区常常只有一两张废的。
     */
    it('挑牌：平均 3.867，有一局打穿了 Ante 8', () => {
        expect(mean(picky)).toBe(3.867);
        expect(histogram(picky)).toEqual([4, 11, 13, 11, 9, 9, 2, 0, 0, 1]);
        // 逐 seed 比：挑牌更深的远多于更浅的
        const deeper = picky.filter((r, i) => r.ante > greedy[i].ante).length;
        const shallower = picky.filter((r, i) => r.ante < greedy[i].ante).length;
        expect([deeper, shallower]).toEqual([41, 5]);
    });

    /**
     * **强化牌那 9 张的贡献，换成挑牌 bot 也还是零**（3.867 vs 3.883，在噪声里）。
     *
     * 两个原因，都不是 bot 的锅：
     * - **3 张新档根本抽不到**：Golden Ticket / Glass Joker / Driver's License
     *   是 `start_locked`，不在新档的池子里（`unlocked: false`）
     * - **另外 6 张的价值不在「现在」**：Steel / Stone / Lucky Cat 要牌组里先有对应强化，
     *   Vampire / Midas Mask 是越打越强的成长型，Marble 是往牌组里塞石头牌——
     *   估值只看「现在这副牌打一手能多几分」，它们在买的那一刻都接近零
     *
     * 第二条是估值的已知短板（只看眼前、不看成长），修它得给估值加「未来」，暂不做。
     */
    it('禁掉强化牌那 9 张：平均 3.883，与不禁的差在噪声里', () => {
        expect(mean(pickyBanned)).toBe(3.883);
        const held = picky.filter((r) => r.jokers.some((n) => NINE.has(n))).length;
        expect(held).toBe(1);
    });

    /**
     * **存利息对挑牌 bot 不划算**——这两条是 15 种组合里的代表，理由见 `picky-bot.ts` 的 `Economy`。
     *
     * - 全程存 $25（除非小丑能涨 50%）：明显更差，一半局死在 Ante 2 以前
     * - 后期（Ante 3 起）才存 $25、放行天体包、余钱重掷：最像人的打法，也没赢
     *
     * 等出牌与估值改好之后重跑这两条——钱那时可能就变得有用了。
     */
    it('存利息：全程存 $25 掉到 2.900，后期才存 + 重掷 3.633，都不比不存（3.867）好', () => {
        const flat25 = SEEDS.map((s) =>
            pickyRun(fresh(s), { economy: { reserve: () => 25, breakReserveGain: 0.5 } }));
        const late25 = SEEDS.map((s) =>
            pickyRun(fresh(s), {
                economy: {
                    reserve: (ante) => (ante >= 3 ? 25 : 0),
                    breakReserveGain: 0.3,
                    exemptCelestial: true,
                    maxRerolls: 10,
                },
            }));
        expect(mean(flat25)).toBe(2.9);
        expect(mean(late25)).toBe(3.633);
    });
});
