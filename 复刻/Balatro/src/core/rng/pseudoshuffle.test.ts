/**
 * `pseudoshuffle` 的**结构性验证**。
 *
 * 为什么不是值验证：洗牌结果没有外部真值。
 * Blueprint / balatro4j / TheSoul / Immolate 全部源自同一个 seed-search 模型
 * （商店队列、补充包、Boss、标签、优惠券），没有一个建模洗牌——
 * 因为牌组组成会随局内变化，对种子搜索没有价值。
 * 详见 .scratch/balatro-复刻/issues/04-原版对拍基准能否导出.md。
 *
 * 换的证法：洗牌链只用到两个**已被外部真值验证过**的原语
 * （`pseudoseed` 由 16 条向量验、`math.random` 由 4 条 TW223 向量验），
 * 真正的新代码只有 `sort_id` 排序 + 4 行倒序 Fisher–Yates。
 * 下面把未验证面缩到「这几行有没有抄错」，靠的是在测试里**独立重推**一遍，
 * 而不是 mock 掉底层再看调用次数——后者在 ESM 下拦不住已绑定的导入，
 * 而且只验了「调了几次」，验不了「怎么用返回值」。
 */

import { describe, expect, it } from 'vitest';

import { random, randomseed } from './luajit-random';
import { PseudorandomState } from './pseudorandom';
import { pseudoshuffle } from './pseudoshuffle';

type Card = { sort_id: number };

function freshDeck(size = 52): Card[] {
    return Array.from({ length: size }, (_, i) => ({ sort_id: i }));
}

/**
 * 照 `misc_functions.lua:209` 逐字重推一遍，**只用已验证的原语**。
 * 与被测实现分别写一次，抄错的话两边对不上。
 */
function referenceShuffle(size: number, seed: number): number[] {
    const generator = randomseed(seed);
    const list = Array.from({ length: size }, (_, i) => i); // 已是 sort_id 升序

    // Lua: for i = #list, 2, -1 do j = math.random(i); list[i], list[j] = list[j], list[i]
    for (let i = size; i >= 2; i--) {
        const j = random(generator, i); // [1, i]，1-based
        const tmp = list[i - 1];
        list[i - 1] = list[j - 1];
        list[j - 1] = tmp;
    }

    return list;
}

describe('pseudoshuffle 的结构性验证', () => {
    it('与独立重推的倒序 Fisher–Yates 逐位一致', () => {
        for (const seed of [0.5, 0.123456789, 0.999, 0.0001]) {
            const deck = freshDeck();
            pseudoshuffle(deck, seed);
            expect(deck.map((c) => c.sort_id)).toEqual(referenceShuffle(52, seed));
        }
    });

    it('抽取次数是 n-1，且只播种一次', () => {
        // 若实现改成「每次抽取都重新播种」，下面两组会因消费模式不同而分叉。
        // 这里用一个独立的生成器连抽 51 次，验证被测实现走的是同一条消费路径。
        const generator = randomseed(0.5);
        const draws = Array.from({ length: 51 }, (_, k) => random(generator, 52 - k));

        const rebuilt = Array.from({ length: 52 }, (_, i) => i);
        draws.forEach((j, k) => {
            const i = 52 - k;
            const tmp = rebuilt[i - 1];
            rebuilt[i - 1] = rebuilt[j - 1];
            rebuilt[j - 1] = tmp;
        });

        const deck = freshDeck();
        pseudoshuffle(deck, 0.5);
        expect(deck.map((c) => c.sort_id)).toEqual(rebuilt);
    });

    it('先归到 sort_id 规范序——输入顺序不影响结果', () => {
        // 这一步不是装饰：table.sort 把列表归到与内存布局无关的规范序，
        // 洗牌结果才可复现。
        const inOrder = freshDeck();
        const reversed = freshDeck().reverse();
        const scrambled = freshDeck().sort((a, b) => (a.sort_id % 7) - (b.sort_id % 7));

        pseudoshuffle(inOrder, 0.5);
        pseudoshuffle(reversed, 0.5);
        pseudoshuffle(scrambled, 0.5);

        expect(reversed).toEqual(inOrder);
        expect(scrambled).toEqual(inOrder);
    });

    it('是置换——不丢牌不复制', () => {
        const deck = freshDeck();
        pseudoshuffle(deck, 0.5);

        const ids = deck.map((c) => c.sort_id).sort((a, b) => a - b);
        expect(ids).toEqual(Array.from({ length: 52 }, (_, i) => i));
    });

    it('不同 seed 给出不同牌序', () => {
        const a = freshDeck();
        const b = freshDeck();
        pseudoshuffle(a, 0.5);
        pseudoshuffle(b, 0.6);
        expect(b).not.toEqual(a);
    });

    it('首元素没有 sort_id 时跳过排序——照抄原版只看 list[1] 的写法', () => {
        const list = [{}, { sort_id: 3 }] as Card[];
        expect(() => pseudoshuffle(list, 0.5)).not.toThrow();
    });

    it('Ante 1 回合洗牌走 pseudoseed("nr1")', () => {
        // state_events.lua:365 `G.deck:shuffle('nr'..G.GAME.round_resets.ante)`
        // 锚定的是链路怎么串，不是牌序本身——牌序没有外部真值可对。
        const run = (seed: string) => {
            const state = new PseudorandomState(seed);
            const deck = freshDeck();
            pseudoshuffle(deck, state.pseudoseed('nr1'));
            return deck.map((c) => c.sort_id);
        };

        expect(run('ALEEB')).toEqual(run('ALEEB'));
        expect(run('TUTORIAL')).not.toEqual(run('ALEEB'));
    });

    it('开局洗牌走 pseudoseed("shuffle")，与回合洗牌是不同的流', () => {
        // game.lua:2600 `self.deck:shuffle()` —— key 取 CardArea:shuffle 的默认值
        const state = new PseudorandomState('ALEEB');
        const atStart = freshDeck();
        pseudoshuffle(atStart, state.pseudoseed('shuffle'));

        const other = new PseudorandomState('ALEEB');
        const atRound = freshDeck();
        pseudoshuffle(atRound, other.pseudoseed('nr1'));

        expect(atRound).not.toEqual(atStart);
    });
});
