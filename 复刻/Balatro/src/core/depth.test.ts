/**
 * 「墙在哪」的快照：八个 seed 拿贪心机器人跑到死，钉住各自死在第几个 Ante。
 *
 * ## 这条测试红了怎么办
 *
 * **先别急着改数字。** 它红只有两种原因：
 * - **内容变了**（新小丑、新消耗品、新系统）——那正是要量的东西。
 *   把新数字填进来，并在 map 的「墙」那一段记一笔前后对比
 * - **RNG 消费顺序变了**——同一局里任何一处多掷或少掷一次，后面全部分叉。
 *   这种情况下深度可能不变，但 `planets` / `jokers` 会动。
 *   **如果你没打算改 RNG 顺序，这就是 bug**
 *
 * 与 `coverage.test.ts` 同一个思路：快照本身不断言「对不对」，
 * 它让「变了」这件事可见，逼着改动的人去解释为什么变。
 *
 * ## 读这个数时要记着
 *
 * bot 不挑手牌、不挑小丑、不挑包里的牌（见 `fixtures/greedy-bot.ts`），
 * 所以这是**内容量的下界**。尤其是：**凡是要选中手牌才能用的塔罗，它一张都用不出来**，
 * 而那正是强化牌的主要来源。
 */

import { describe, expect, it } from 'vitest';

import { makeStandardDeck } from './card';
import { greedyRun } from './fixtures/greedy-bot';
import { Run } from './run';

const SEEDS = ['TUTORIAL', 'ALEEB', '7LB2WVPK', 'JHZ7FPM', 'QQQ777', 'MNBVCXZ', 'ZZZZZZ', 'ABCDEF'];

const results = SEEDS.map((seed) => ({ seed, ...greedyRun(new Run(seed, makeStandardDeck())) }));

describe('贪心深度', () => {
    it('八个 seed 各自死在第几个 Ante', () => {
        expect(Object.fromEntries(results.map((r) => [r.seed, r.ante]))).toEqual({
            TUTORIAL: 3,
            ALEEB: 3,
            '7LB2WVPK': 3,
            JHZ7FPM: 3,
            QQQ777: 2,
            MNBVCXZ: 2,
            ZZZZZZ: 3,
            ABCDEF: 2,
        });
    });

    it('平均 2.625', () => {
        const mean = results.reduce((n, r) => n + r.ante, 0) / results.length;
        expect(mean).toBe(2.625);
    });

    /**
     * **强化牌那 9 张小丑（18 号票）对这个数的贡献是零**——这条把原因钉住。
     *
     * 八局里一张都没买到。就算买到，它们也吃不上：Steel / Stone / Glass /
     * Lucky Cat / Golden Ticket / Driver's License 全要**整副牌里有强化牌**，
     * 而强化牌的来源是塔罗（要选手牌，bot 用不了）与标准包（bot 拿第一张）。
     *
     * 所以「下一刀做什么」的问题上，内容已经不是瓶颈：**先写会挑牌的策略**，
     * 否则后面每一刀量出来都是零。
     */
    it('强化牌那 9 张一张都没进过小丑区', () => {
        const nine = new Set([
            'Marble Joker', 'Steel Joker', 'Vampire', 'Midas Mask', 'Stone Joker',
            'Lucky Cat', 'Golden Ticket', 'Glass Joker', "Driver's License",
        ]);
        const seen = results.flatMap((r) => r.jokers).filter((name) => nine.has(name));
        expect(seen).toEqual([]);
    });
});
