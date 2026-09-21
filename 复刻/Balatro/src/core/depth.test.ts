/**
 * 「墙在哪」的快照：八个 seed 拿两个机器人各跑到死，钉住各自死在第几个 Ante。
 *
 * - **贪心**（`fixtures/greedy-bot.ts`）：不挑手牌、不挑小丑、不挑包里的牌
 * - **挑牌**（`fixtures/picky-bot.ts`）：会对手牌用塔罗、拿真管线给小丑估值、挑包里的牌
 *
 * 两者的差就是「策略欠的」，挑牌 bot 碰不到的才是「内容欠的」。
 *
 * ## 这条测试红了怎么办
 *
 * **先别急着改数字。** 它红只有三种原因：
 * - **内容变了**（新小丑、新消耗品、新系统）——那正是要量的东西。
 *   把新数字填进来，并跑一遍 `npm run test:slow`（60 个 seed），在 map 里记前后对比
 * - **bot 变了**——同上，但记的是策略那一侧
 * - **RNG 消费顺序变了**——同一局里任何一处多掷或少掷一次，后面全部分叉。
 *   **如果你没打算改 RNG 顺序，这就是 bug**
 *
 * ## 八个 seed 只够当快照，不够当结论
 *
 * 实测一处小的策略改动就能让某些 seed 升三级、另一些降两级。
 * **比较两种策略或两批内容要看 60 个 seed 的均值**（`depth.slow.test.ts`）。
 */

import { describe, expect, it } from 'vitest';

import { makeStandardDeck } from './card';
import { greedyRun } from './fixtures/greedy-bot';
import { pickyRun } from './fixtures/picky-bot';
import { Run } from './run';

const SEEDS = ['TUTORIAL', 'ALEEB', '7LB2WVPK', 'JHZ7FPM', 'QQQ777', 'MNBVCXZ', 'ZZZZZZ', 'ABCDEF'];

const greedy = SEEDS.map((seed) => ({ seed, ...greedyRun(new Run(seed, makeStandardDeck())) }));
const picky = SEEDS.map((seed) => ({ seed, ...pickyRun(new Run(seed, makeStandardDeck())) }));

const mean = (xs: Array<{ ante: number }>) => xs.reduce((n, r) => n + r.ante, 0) / xs.length;
const bySeed = (xs: Array<{ seed: string; ante: number }>) =>
    Object.fromEntries(xs.map((r) => [r.seed, r.ante]));

describe('贪心深度', () => {
    it('八个 seed 各自死在第几个 Ante（平均 3.125）', () => {
        expect(bySeed(greedy)).toEqual({
            TUTORIAL: 2,
            ALEEB: 3,
            '7LB2WVPK': 4,
            JHZ7FPM: 4,
            QQQ777: 4,
            MNBVCXZ: 1,
            ZZZZZZ: 5,
            ABCDEF: 2,
        });
        expect(mean(greedy)).toBe(3.125);
    });

    /**
     * **强化牌那 9 张小丑对贪心的贡献是零**：八局里一张都没买到。
     * 就算买到也吃不上——它们要整副牌里有强化牌，而强化牌来自塔罗（要选手牌）。
     */
    it('强化牌那 9 张一张都没进过小丑区', () => {
        const nine = new Set([
            'Marble Joker', 'Steel Joker', 'Vampire', 'Midas Mask', 'Stone Joker',
            'Lucky Cat', 'Golden Ticket', 'Glass Joker', "Driver's License",
        ]);
        const seen = greedy.flatMap((r) => r.jokers).filter((name) => nine.has(name));
        expect(seen).toEqual([]);
    });
});

describe('挑牌深度', () => {
    /**
     * **注意这 8 个的均值与 60 个的走势对不上**：改出牌时 3.75 → 2.75（60 个是 3.867 → 4.133），
     * 估值看成长后 2.75 → 3.0（60 个 4.133 → 4.333）。这正是「8 个只够当快照」的活例子。
     *
     * 2.75 → 3.75 那次不是内容也不是策略，是 21 号票在模拟器上对出来的三处**原作行为**：
     * 开局造牌的规范序（同 seed 整副牌序全变）、红牌组 +1 弃牌、摸牌后手牌区按点数重排。
     * 这 8 局等于换了 8 局，新旧不可比。
     */
    it('八个 seed 各自死在第几个 Ante（平均 3.75）', () => {
        expect(bySeed(picky)).toEqual({
            TUTORIAL: 4,
            ALEEB: 3,
            '7LB2WVPK': 4,
            JHZ7FPM: 5,
            QQQ777: 5,
            MNBVCXZ: 1,
            ZZZZZZ: 6,
            ABCDEF: 2,
        });
        expect(mean(picky)).toBe(3.75);
    });
});
