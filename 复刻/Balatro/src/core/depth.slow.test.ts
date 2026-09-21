/**
 * 「墙在哪」的**结论版**：60 个 seed，三组并排。默认 `npm test` 不跑它（约 30 秒），
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
     * **策略欠的约是 2 个 Ante。** 贪心的墙主要是策略墙，不是内容墙。
     *
     * 三步来的：
     * 1. 小丑估值 + 用塔罗 + 挑包：2.333 → 3.867
     * 2. 出牌（带小丑精算挑哪一手、模拟挑弃法、弃牌按手数分配额）：→ 4.133。
     *    在另一批没参与调参的 60 个 seed（`H${i * 104729 + 17}`）上复核：3.967 → 4.350
     * 3. 估值看成长（沙盒连打 4 手、小丑状态带进下一手）：→ 4.333。
     *    视野 1 / 4 / 8 手在 240 个 seed 上是 3.967 / 4.158 / 4.125，4 手在四批里每批都赢
     */
    it('挑牌：平均 4.333，46 个 seed 比贪心深、7 个更浅', () => {
        expect(mean(picky)).toBe(4.333);
        expect(histogram(picky)).toEqual([3, 9, 11, 10, 12, 7, 3, 3, 1, 1]);
        const deeper = picky.filter((r, i) => r.ante > greedy[i].ante).length;
        const shallower = picky.filter((r, i) => r.ante < greedy[i].ante).length;
        expect([deeper, shallower]).toEqual([46, 7]);
    });

    /**
     * **强化牌那 9 张的贡献，换成挑牌 bot 也还是零**——禁掉它们，60 局**逐局深度完全相同**，
     * 估值学会看成长之后也一样。死时手上有其中一张的 2 局（都是 Steel Joker），
     * 禁买对它们也没影响——那张多半不是 bot 挑的
     * （`Judgement` / `Wraith` 这类随机造小丑的来源不受禁买名单管）。
     *
     * 两个原因，都不是 bot 的锅：
     * - **3 张新档根本抽不到**：Golden Ticket / Glass Joker / Driver's License
     *   是 `start_locked`，不在新档的池子里（`unlocked: false`）
     * - **另外 6 张的价值不在「现在」**：Steel / Stone / Lucky Cat 要牌组里先有对应强化，
     *   Vampire / Midas Mask 是越打越强的成长型，Marble 是往牌组里塞石头牌——
     *   估值只看「现在这副牌打一手能多几分」，它们在买的那一刻都接近零
     *
     * 第二条在估值学会看成长之后**仍然成立**：估值连打的是固定的参考牌，
     * 而新牌组里没有强化牌，Steel / Stone / Lucky Cat / Vampire 的成长条件碰不到。
     * 要让它们有价值，得让估值看到「bot 自己以后会往牌组里加什么」，那是另一个量级的活。
     */
    it('禁掉强化牌那 9 张：逐局深度完全相同', () => {
        expect(pickyBanned.map((r) => r.ante)).toEqual(picky.map((r) => r.ante));
        const held = picky.filter((r) => r.jokers.some((n) => NINE.has(n))).length;
        expect(held).toBe(2);
    });

    /**
     * **存利息对挑牌 bot 不划算**——这两条是 15 种组合里的代表，理由见 `picky-bot.ts` 的 `Economy`。
     *
     * - 全程存 $25（除非小丑能涨 50%）：明显更差，一半局死在 Ante 2 以前
     * - 后期（Ante 3 起）才存 $25、放行天体包、余钱重掷：最像人的打法，也没赢
     *
     * 重跑过两次，**结论都没变**：出牌改好之后（2.867 / 4.017 对 4.133），
     * 估值学会看成长之后（2.950 / 4.133 对 4.333）。
     */
    it('存利息：全程存 $25 掉到 2.950，后期才存 + 重掷 4.133，都不比不存（4.333）好', () => {
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
        expect(mean(flat25)).toBe(2.95);
        expect(mean(late25)).toBe(4.133);
    });
});
