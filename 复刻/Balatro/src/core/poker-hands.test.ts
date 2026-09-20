/**
 * 牌型判定的测试。
 *
 * 没有外部真值可对——社区工具不模拟出牌（见 04 号票）。
 * 所以这里测的是**规则本身**：每种牌型的正例、优先级顺序、
 * 以及几个原作特有的、容易在直译时走样的边角。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Suit, type Value, makeCard, resetCardCounters } from './card';
import { evaluatePokerHand, getFlush, getStraight, getXSame } from './poker-hands';

/** `SA` `H10` `DK` 这样写牌，省得每次敲全名。 */
function c(spec: string) {
    const suitMap: Record<string, Suit> = { S: 'Spades', H: 'Hearts', C: 'Clubs', D: 'Diamonds' };
    const valMap: Record<string, Value> = {
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        T: '10', J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace',
    };
    return makeCard(spec, suitMap[spec[0]], valMap[spec.slice(1)]);
}

const hand = (...specs: string[]) => specs.map(c);

beforeEach(() => resetCardCounters());

describe('十二种牌型的正例', () => {
    const cases: ReadonlyArray<readonly [string, string[]]> = [
        ['Flush Five', ['SA', 'SA', 'SA', 'SA', 'SA']],
        ['Flush House', ['D7', 'D7', 'D7', 'D4', 'D4']],
        ['Five of a Kind', ['SA', 'HA', 'HA', 'CA', 'DA']],
        ['Straight Flush', ['SQ', 'SJ', 'ST', 'S9', 'S8']],
        ['Four of a Kind', ['SJ', 'HJ', 'CJ', 'DJ', 'C3']],
        ['Full House', ['HK', 'CK', 'DK', 'S2', 'D2']],
        ['Flush', ['HA', 'HK', 'HT', 'H5', 'H4']],
        ['Straight', ['DJ', 'CT', 'C9', 'S8', 'H7']],
        ['Three of a Kind', ['ST', 'CT', 'DT', 'H6', 'D5']],
        ['Two Pair', ['HA', 'DA', 'CQ', 'H4', 'C4']],
        ['Pair', ['SK', 'S9', 'D9', 'H6', 'D3']],
        ['High Card', ['SA', 'DQ', 'D9', 'C4', 'D3']],
    ];

    // 用例取自 game.lua:2212-2223 每种牌型自带的 example 字段
    it.each(cases)('%s', (expected, specs) => {
        expect(evaluatePokerHand(hand(...specs)).topName).toBe(expected);
    });
});

describe('原作特有的边角', () => {
    it('A-2-3-4-5 算顺子', () => {
        // get_straight 的 j=1 查的是 A（id 14），低顺子因此成立
        expect(evaluatePokerHand(hand('SA', 'H2', 'C3', 'D4', 'S5')).topName).toBe('Straight');
    });

    it('10-J-Q-K-A 算顺子', () => {
        expect(evaluatePokerHand(hand('ST', 'HJ', 'CQ', 'DK', 'SA')).topName).toBe('Straight');
    });

    it('Q-K-A-2-3 不算顺子——不绕回', () => {
        expect(evaluatePokerHand(hand('SQ', 'HK', 'CA', 'D2', 'S3')).topName).toBe('High Card');
    });

    it('超过 5 张时同花与顺子都不成立', () => {
        // get_flush / get_straight 开头都有 `if #hand > 5 ... then return ret`
        const six = hand('HA', 'HK', 'HQ', 'HJ', 'HT', 'H9');
        expect(getFlush(six)).toEqual([]);
        expect(getStraight(six)).toEqual([]);
    });

    it('同花顺同时满足时，Straight Flush 优先于 Flush 与 Straight', () => {
        const r = evaluatePokerHand(hand('SQ', 'SJ', 'ST', 'S9', 'S8'));
        expect(r.topName).toBe('Straight Flush');
        // 但低牌型仍被登记，小丑会读
        expect(r.parts.Flush.length).toBeGreaterThan(0);
        expect(r.parts.Straight.length).toBeGreaterThan(0);
    });

    it('getXSame 返回的组按点数从高到低', () => {
        // Two Pair 与 Full House 的拼装依赖这个顺序
        const pairs = getXSame(2, hand('H3', 'C3', 'HK', 'CK', 'D7'));
        expect(pairs).toHaveLength(2);
        expect(pairs[0][0].base.id).toBe(13); // K 在前
        expect(pairs[1][0].base.id).toBe(3);
    });

    it('Two Pair 的牌序是「高对在前」', () => {
        const r = evaluatePokerHand(hand('H3', 'C3', 'HK', 'CK', 'D7'));
        expect(r.topName).toBe('Two Pair');
        expect(r.top![0].map((x) => x.base.id)).toEqual([13, 13, 3, 3]);
    });

    it('三条+一对时，Full House 的牌序是「三条在前」', () => {
        const r = evaluatePokerHand(hand('H3', 'C3', 'D3', 'HK', 'CK'));
        expect(r.topName).toBe('Full House');
        expect(r.top![0].map((x) => x.base.id)).toEqual([3, 3, 3, 13, 13]);
    });

    it('三条同时也登记成 Two Pair——原作的 (#_3==1 and #_2==1) 分支', () => {
        // 三条本身不产生 _2，所以单独的三条不该是 Two Pair
        const r = evaluatePokerHand(hand('H3', 'C3', 'D3', 'HK', 'C7'));
        expect(r.topName).toBe('Three of a Kind');
        expect(r.parts['Two Pair']).toEqual([]);
    });

    it('五条会降级登记成 Four of a Kind 与 Three of a Kind', () => {
        const r = evaluatePokerHand(hand('SA', 'HA', 'HA', 'CA', 'DA'));
        expect(r.topName).toBe('Five of a Kind');
        // 降级填的是**组**不是牌：那一组原样出现在低牌型里
        expect(r.parts['Four of a Kind']).toHaveLength(1);
        expect(r.parts['Four of a Kind'][0]).toHaveLength(5);
    });

    it('高牌的 tie-break 是确定的——靠 unique_val', () => {
        // 两张 nominal 相同的牌（同点不同花），get_highest 必须稳定选出一张
        const a = evaluatePokerHand(hand('SK', 'HK', 'D2', 'C3', 'S4'));
        resetCardCounters();
        const b = evaluatePokerHand(hand('SK', 'HK', 'D2', 'C3', 'S4'));
        expect(a.parts['High Card'][0][0].key).toBe(b.parts['High Card'][0][0].key);
    });
});

describe('小丑钩子（第一个切片不启用，但接口先留着）', () => {
    it('Four Fingers 让 4 张同花成立', () => {
        const four = hand('HA', 'HK', 'HQ', 'HJ');
        expect(getFlush(four)).toEqual([]);
        expect(getFlush(four, { fourFingers: true, shortcut: false })).toHaveLength(1);
    });

    it('Shortcut 让跳档顺子成立', () => {
        const gap = hand('S2', 'H3', 'C5', 'D6', 'S7'); // 缺 4
        expect(getStraight(gap)).toEqual([]);
        expect(getStraight(gap, { fourFingers: false, shortcut: true })).toHaveLength(1);
    });
});
