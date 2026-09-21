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
    /**
     * 「增删牌」那 8 张接进来之后 2.333 → 2.417：贪心什么都买，
     * 买到的 Riff-raff 现在真的会造小丑了。
     * 补上版本加价之后 → 2.383（带版本的小丑变贵了，见下一条）。
     */
    it('贪心：平均 2.383，一半以上死在 Ante 2', () => {
        expect(mean(greedy)).toBe(2.383);
        expect(histogram(greedy)).toEqual([4, 31, 23, 2, 0, 0, 0, 0, 0, 0]);
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
     *
     * 「增删牌」那 8 张之后 4.333 → 4.267，**不是内容的作用**（挑牌 bot 一张都没买，
     * 禁掉它们 240 局逐局相同），是顺带修的时序改了 RNG 路径——在噪声里。
     *
     * **补上版本加价之后 → 4.083**（240 seed：4.146 → 3.992）。这是**纠偏不是退步**：
     * 原先带版本的小丑按基础价卖（Negative / Polychrome 少收 $5），复刻件比原作便宜，
     * 墙被高估了约 0.15 个 Ante。同一刀加的 Credit Card / Rocket / Gift Card 贡献为零
     * （禁掉它们 3.996，在噪声里）。
     *
     * Trading Card / Certificate / Luchador / Chicot 之后 → 4.1。**第一批让挑牌 bot 受益的内容**，
     * 虽然很小：240 seed 放开 4.000、禁掉 3.992，2 局更深、0 局更浅。
     */
    it('挑牌：平均 4.1，41 个 seed 比贪心深、8 个更浅', () => {
        expect(mean(picky)).toBe(4.1);
        expect(histogram(picky)).toEqual([3, 11, 13, 9, 10, 7, 4, 2, 0, 1]);
        const deeper = picky.filter((r, i) => r.ante > greedy[i].ante).length;
        const shallower = picky.filter((r, i) => r.ante < greedy[i].ante).length;
        expect([deeper, shallower]).toEqual([41, 8]);
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
     * 重跑过四次：出牌改好之后（2.867 / 4.017 对 4.133），
     * 估值学会看成长之后（2.950 / 4.133 对 4.333），增删牌那 8 张之后（3.0 / 4.167 对 4.267），
     * 补上版本加价之后（2.933 / 4.100 对 4.083），关掉 Boss 那一刀之后（2.933 / 4.100 对 4.100）。
     * **全程存一直明显更差；后期存 + 重掷已经连着两次打平**，不算赢。
     */
    it('存利息：全程存 $25 掉到 2.933，后期才存 + 重掷 4.100，与不存（4.100）打平', () => {
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
        expect(mean(flat25)).toBe(2.933);
        expect(mean(late25)).toBe(4.1);
    });

    /**
     * **跳过盲注对挑牌 bot 也不划算**（18 号票第 4 步），与存利息同一个原因：
     * bot 的瓶颈是战力，跳过就少一次商店、少一关的奖金，标签补不回来。
     *
     * 两轮实验（细节见 18 号票）。120 seed：全跳 2.517、只为好标签跳 3.575、Ante 2 起 3.717、
     * 只跳小盲注 3.833、只为开包标签跳 3.975，对不跳 4.008。240 seed 加「上一关赢得轻松才跳」：
     * **最好的「赢 5 倍以上才跳」4.021 对不跳 4.000，但平均每局只跳 0.1 次**，在噪声里。
     * 所以默认不跳，这两条是代表。
     */
    it('跳过盲注：全跳 2.233，只为开包标签跳 4.083，都不比不跳（4.1）好', () => {
        const PACKS = new Set(['tag_charm', 'tag_meteor', 'tag_buffoon', 'tag_ethereal', 'tag_standard']);
        const all = SEEDS.map((s) => pickyRun(fresh(s), { skip: () => true }));
        const packs = SEEDS.map((s) => pickyRun(fresh(s), { skip: (_run, k) => PACKS.has(k) }));
        expect(mean(all)).toBe(2.233);
        expect(mean(packs)).toBe(4.083);
    });
});
