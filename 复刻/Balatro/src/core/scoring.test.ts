/**
 * 出牌结算管线的测试。
 *
 * 期望分数是照 `出牌结算管线.md` 的公式手算的：
 * `floor((牌型基础筹码 + Σ计分牌 nominal) × 牌型基础倍率)`。
 * 不带小丑时这条公式就是全部——小丑的测试在 `jokers/calculate.test.ts`。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Suit, type Value, makeCard, resetCardCounters } from './card';
import { makeGameView } from './jokers';
import { blindRequirement, evaluatePlay, getBlindAmount, initialHands, levelUpHand } from './scoring';

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
        const r = evaluatePlay(hand(...specs), initialHands(), makeGameView());
        expect(r.handName).toBe(name);
        expect(r.score).toBe(expected);
    });
});

describe('第 4 步：计分牌集合', () => {
    it('默认只有构成牌型的那几张计分', () => {
        // 一对 K，另外三张不计分——这是 Pair 只得 60 分的原因
        const r = evaluatePlay(hand('SK', 'HK', 'D9', 'C4', 'D3'), initialHands(), makeGameView());
        expect(r.scoringHand).toHaveLength(2);
        expect(r.scoringHand.every((x) => x.base.id === 13)).toBe(true);
    });

    it('顺子与同花是 5 张全计分', () => {
        expect(evaluatePlay(hand('DJ', 'CT', 'C9', 'S8', 'H7'), initialHands(), makeGameView()).scoringHand).toHaveLength(5);
        expect(evaluatePlay(hand('HA', 'HK', 'HT', 'H5', 'H4'), initialHands(), makeGameView()).scoringHand).toHaveLength(5);
    });

    it('计分牌按 T.x 从左到右排序，不按传入顺序', () => {
        // 故意把 T.x 倒过来给
        const cards = [c('SK', 10), c('HK', 5), c('D9', 0), c('C4', 1), c('D3', 2)];
        const r = evaluatePlay(cards, initialHands(), makeGameView());
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

        const r = evaluatePlay(hand('SK', 'HK', 'D9', 'C4', 'D3'), hands, makeGameView());
        expect(r.baseChips).toBe(25);
        expect(r.baseMult).toBe(3);
        expect(r.score).toBe((25 + 20) * 3); // 135
    });

    it('出牌会累加 played 计数', () => {
        const hands = initialHands();
        evaluatePlay(hand('SK', 'HK', 'D9', 'C4', 'D3'), hands, makeGameView());
        evaluatePlay(hand('SQ', 'HQ', 'D9', 'C4', 'D3'), hands, makeGameView());
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
        const flush = evaluatePlay(hand('HA', 'HK', 'HT', 'H5', 'H4'), initialHands(), makeGameView());
        expect(flush.score).toBe(300);
        expect(flush.score >= blindRequirement(1, 'small')).toBe(true);

        // 而一对 K 只有 60，四手打满也才 240，过不了
        const pair = evaluatePlay(hand('SK', 'HK', 'D9', 'C4', 'D3'), initialHands(), makeGameView());
        expect(pair.score * 4).toBeLessThan(blindRequirement(1, 'small'));
    });
});

/**
 * `level_up_hand` 的数值部分。期望值全部手算，算式写在用例名里。
 *
 * 这一组盯的是**重算 vs 增量**的差别：只要等级不撞下限两者给一样的结果，
 * 所以只有降级的用例才能把错的实现照出来。
 */
describe('levelUpHand：mult = max(s_mult + l_mult×(lvl-1), 1)，chips = max(s_chips + l_chips×(lvl-1), 0)', () => {
    it('Pair 升 1 级：chips 10 + 15×1 = 25，mult 2 + 1×1 = 3', () => {
        const hands = initialHands();
        levelUpHand(hands, 'Pair');
        expect(hands.Pair).toMatchObject({ level: 2, chips: 25, mult: 3 });
    });

    it('Pair 一次升 3 级：chips 10 + 15×3 = 55，mult 2 + 1×3 = 5', () => {
        const hands = initialHands();
        levelUpHand(hands, 'Pair', 3);
        expect(hands.Pair).toMatchObject({ level: 4, chips: 55, mult: 5 });
    });

    it('升 10 次 = 一次升 10 级：两条路径必须给同一个数（重算的前提）', () => {
        const step = initialHands();
        for (let i = 0; i < 10; i++) levelUpHand(step, 'Flush');
        const once = initialHands();
        levelUpHand(once, 'Flush', 10);
        expect(step.Flush).toEqual(once.Flush);
    });

    it('等级下限是 0：1 级再降 2 级还是 0 级，不是 -1', () => {
        const hands = initialHands();
        levelUpHand(hands, 'Pair', -2);
        expect(hands.Pair.level).toBe(0);
    });

    it('High Card 降到 0 级：mult = max(1 + 1×(0-1), 1) = max(0, 1) = 1，不是 0', () => {
        // 这一条是增量实现唯一照得出来的地方：减法会给 0，那一手直接 0 分
        const hands = initialHands();
        levelUpHand(hands, 'High Card', -1);
        expect(hands['High Card']).toMatchObject({ level: 0, mult: 1, chips: 0 });
        // chips = max(5 + 10×(0-1), 0) = max(-5, 0) = 0
    });

    it('降到 0 再升回 1 级：回到开局值（撞过下限也不跑偏）', () => {
        const hands = initialHands();
        levelUpHand(hands, 'High Card', -1);
        levelUpHand(hands, 'High Card', 1);
        expect(hands['High Card']).toMatchObject({ level: 1, mult: 1, chips: 5 });
    });

    it('没有上限：Pair 升 100 级 = chips 10 + 15×100 = 1510', () => {
        const hands = initialHands();
        levelUpHand(hands, 'Pair', 100);
        expect(hands.Pair).toMatchObject({ level: 101, chips: 1510, mult: 102 });
    });
});

describe('initialHands 的 visible：九个常规牌型开局就可见', () => {
    it('只有三个五张同点的开局不可见（game.lua:2212-2214）', () => {
        const hands = initialHands();
        const hidden = Object.entries(hands).filter(([, v]) => !v.visible).map(([k]) => k);
        expect(hidden).toEqual(['Flush Five', 'Flush House', 'Five of a Kind']);
    });
});
