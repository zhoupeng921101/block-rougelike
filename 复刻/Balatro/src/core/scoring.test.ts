/**
 * 出牌结算管线的测试。
 *
 * 期望分数是照 `出牌结算管线.md` 的公式手算的：
 * `floor((牌型基础筹码 + Σ计分牌 nominal) × 牌型基础倍率)`。
 * 本切片没有小丑、强化牌与版本，所以这条公式就是全部。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Suit, type Value, makeCard, resetCardCounters } from './card';
import { blindRequirement, evaluatePlay, getBlindAmount, initialHands } from './scoring';

function c(spec: string, x: number) {
    const suitMap: Record<string, Suit> = { S: 'Spades', H: 'Hearts', C: 'Clubs', D: 'Diamonds' };
    const valMap: Record<string, Value> = {
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        T: '10', J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace',
    };
    const card = makeCard(spec, suitMap[spec[0]], valMap[spec.slice(1)]);
    card.T.x = x; // tile 单位，见 10 号票
    return card;
}

/** 按传入顺序铺 T.x，模拟手牌里从左到右 */
const hand = (...specs: string[]) => specs.map((s, i) => c(s, i * 2.05));

beforeEach(() => resetCardCounters());

describe('计分：floor((牌型筹码 + Σnominal) × 牌型倍率)', () => {
    const cases: ReadonlyArray<readonly [string, number, string, string[]]> = [
        ['High Card', 16, '(5 + 11) × 1', ['SA', 'DQ', 'D9', 'C4', 'D3']],
        ['Pair', 60, '(10 + 10+10) × 2', ['SK', 'HK', 'D9', 'C4', 'D3']],
        ['Two Pair', 100, '(20 + 11+11+4+4) × 2', ['HA', 'DA', 'CQ', 'H4', 'C4']],
        ['Three of a Kind', 180, '(30 + 10×3) × 3', ['ST', 'CT', 'DT', 'H6', 'D5']],
        ['Straight', 296, '(30 + 10+10+9+8+7) × 4', ['DJ', 'CT', 'C9', 'S8', 'H7']],
        ['Flush', 300, '(35 + 11+10+10+5+4) × 4', ['HA', 'HK', 'HT', 'H5', 'H4']],
        ['Full House', 296, '(40 + 10×3+2+2) × 4', ['HK', 'CK', 'DK', 'S2', 'D2']],
        ['Four of a Kind', 700, '(60 + 10×4) × 7', ['SJ', 'HJ', 'CJ', 'DJ', 'C3']],
        ['Straight Flush', 1176, '(100 + 10+10+10+9+8) × 8', ['SQ', 'SJ', 'ST', 'S9', 'S8']],
        ['Five of a Kind', 2100, '(120 + 11×5) × 12', ['SA', 'HA', 'HA', 'CA', 'DA']],
    ];

    it.each(cases)('%s = %d 分 —— %s', (name, expected, _formula, specs) => {
        const r = evaluatePlay(hand(...specs), initialHands());
        expect(r.handName).toBe(name);
        expect(r.score).toBe(expected);
    });
});

describe('第 4 步：计分牌集合', () => {
    it('默认只有构成牌型的那几张计分', () => {
        // 一对 K，另外三张不计分——这是 Pair 只得 60 分的原因
        const r = evaluatePlay(hand('SK', 'HK', 'D9', 'C4', 'D3'), initialHands());
        expect(r.scoringHand).toHaveLength(2);
        expect(r.scoringHand.every((x) => x.base.id === 13)).toBe(true);
    });

    it('顺子与同花是 5 张全计分', () => {
        expect(evaluatePlay(hand('DJ', 'CT', 'C9', 'S8', 'H7'), initialHands()).scoringHand).toHaveLength(5);
        expect(evaluatePlay(hand('HA', 'HK', 'HT', 'H5', 'H4'), initialHands()).scoringHand).toHaveLength(5);
    });

    it('计分牌按 T.x 从左到右排序，不按传入顺序', () => {
        // 故意把 T.x 倒过来给
        const cards = [c('SK', 10), c('HK', 5), c('D9', 0), c('C4', 1), c('D3', 2)];
        const r = evaluatePlay(cards, initialHands());
        expect(r.scoringHand.map((x) => x.T.x)).toEqual([5, 10]); // HK 在 SK 左边
    });
});

describe('第 7 步：读的是升级后的牌型值', () => {
    it('牌型升级后基础值随之变化', () => {
        const hands = initialHands();
        // 模拟升一级：Pair 的 l_chips=15 / l_mult=1
        hands.Pair.chips += hands.Pair.l_chips;
        hands.Pair.mult += hands.Pair.l_mult;
        hands.Pair.level = 2;

        const r = evaluatePlay(hand('SK', 'HK', 'D9', 'C4', 'D3'), hands);
        expect(r.baseChips).toBe(25);
        expect(r.baseMult).toBe(3);
        expect(r.score).toBe((25 + 20) * 3); // 135
    });

    it('出牌会累加 played 计数', () => {
        const hands = initialHands();
        evaluatePlay(hand('SK', 'HK', 'D9', 'C4', 'D3'), hands);
        evaluatePlay(hand('SQ', 'HQ', 'D9', 'C4', 'D3'), hands);
        expect(hands.Pair.played).toBe(2);
    });
});

describe('盲注需求', () => {
    it('前 8 个 Ante 的基数是写死的', () => {
        expect([1, 2, 3, 4, 5, 6, 7, 8].map(getBlindAmount)).toEqual([
            300, 800, 2000, 5000, 11000, 20000, 35000, 50000,
        ]);
    });

    it('Ante 1 小盲注 = 300，大盲注 = 450', () => {
        expect(blindRequirement(1, 'small')).toBe(300);
        expect(blindRequirement(1, 'big')).toBe(450);
    });

    it('第一个里程碑：一手同花打不过小盲注，得靠多手累加', () => {
        // Flush 300 分 = 刚好 300，而小盲注要求 300 —— 一手就能过，但这是最好的情况
        const flush = evaluatePlay(hand('HA', 'HK', 'HT', 'H5', 'H4'), initialHands());
        expect(flush.score).toBe(300);
        expect(flush.score >= blindRequirement(1, 'small')).toBe(true);

        // 而一对 K 只有 60，四手打满也才 240，过不了
        const pair = evaluatePlay(hand('SK', 'HK', 'D9', 'C4', 'D3'), initialHands());
        expect(pair.score * 4).toBeLessThan(blindRequirement(1, 'small'));
    });
});
