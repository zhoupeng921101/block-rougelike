/**
 * 经济层的测试。
 *
 * 最容易写错的一条在「利息读的是入账前的余额」那组用例里：
 * `evaluate_round` 的加钱顺序是**盲注 → 剩余出牌 → 小丑 → 利息**，
 * 而利息读 `G.GAME.dollars`，也就是**这一轮收益还没入账之前**的值。
 * 用加完之后的余额算，每关都会多给钱。
 */

import { describe, expect, it } from 'vitest';

import { INTEREST_CAP, calculateDollarBonus, evaluateRound } from './economy';
import { makeJoker } from './jokers';
import type { Joker } from './jokers';

const base = {
    won: true,
    blindDollars: 3,
    handsLeft: 0,
    discardsLeft: 0,
    discardsUsed: 1,
    dollars: 0,
    jokers: [] as Joker[],
};

describe('盲注基础收益', () => {
    it('小盲注 $3 / 大盲注 $4 / Boss $5', () => {
        expect(evaluateRound({ ...base, blindDollars: 3 }).total).toBe(3);
        expect(evaluateRound({ ...base, blindDollars: 4 }).total).toBe(4);
        expect(evaluateRound({ ...base, blindDollars: 5 }).total).toBe(5);
    });

    it('没过关这一行是 0，但仍然出现在明细里', () => {
        const payout = evaluateRound({ ...base, won: false });
        expect(payout.total).toBe(0);
        expect(payout.rows[0]).toEqual({ kind: 'blind', dollars: 0 });
    });
});

describe('剩余出牌次数', () => {
    it('每次 +$1', () => {
        expect(evaluateRound({ ...base, handsLeft: 3 }).total).toBe(3 + 3);
    });

    it('剩 0 次时这一行不出现', () => {
        expect(evaluateRound({ ...base, handsLeft: 0 }).rows.map((r) => r.kind)).toEqual(['blind']);
    });

    it('剩余弃牌默认不给钱——`money_per_discard` 原作默认是 nil', () => {
        expect(evaluateRound({ ...base, discardsLeft: 3 }).total).toBe(3);
    });
});

describe('利息', () => {
    it('每 5 块 +$1', () => {
        expect(evaluateRound({ ...base, dollars: 5 }).total).toBe(3 + 1);
        expect(evaluateRound({ ...base, dollars: 14 }).total).toBe(3 + 2);
        expect(evaluateRound({ ...base, dollars: 15 }).total).toBe(3 + 3);
    });

    it('不到 5 块没有利息', () => {
        expect(evaluateRound({ ...base, dollars: 4 }).total).toBe(3);
    });

    it(`上限 +$5（interest_cap = ${INTEREST_CAP}）`, () => {
        expect(evaluateRound({ ...base, dollars: 25 }).total).toBe(3 + 5);
        expect(evaluateRound({ ...base, dollars: 100 }).total).toBe(3 + 5);
    });

    it('**读的是入账前的余额**：身上 4 块 + 这关赚 3 块，利息仍然是 0', () => {
        // 若用「加完之后的 7 块」算，会多给 $1
        const payout = evaluateRound({ ...base, dollars: 4, blindDollars: 3 });
        expect(payout.rows.some((r) => r.kind === 'interest')).toBe(false);
        expect(payout.total).toBe(3);
    });

    it('利息是明细的最后一行', () => {
        const payout = evaluateRound({ ...base, dollars: 10, handsLeft: 2 });
        expect(payout.rows.map((r) => r.kind)).toEqual(['blind', 'hands', 'interest']);
    });
});

describe('calculate_dollar_bonus', () => {
    it('Golden Joker 固定 $4', () => {
        expect(calculateDollarBonus(makeJoker('j_golden'), { discardsUsed: 0, discardsLeft: 0 })).toBe(4);
    });

    it('Delayed Gratification：一次弃牌都没用过 → 每点剩余弃牌 $2', () => {
        const j = makeJoker('j_delayed_grat');
        expect(calculateDollarBonus(j, { discardsUsed: 0, discardsLeft: 3 })).toBe(6);
    });

    it('Delayed Gratification：用过弃牌就不给', () => {
        const j = makeJoker('j_delayed_grat');
        expect(calculateDollarBonus(j, { discardsUsed: 1, discardsLeft: 2 })).toBeNull();
    });

    it('Delayed Gratification：弃牌次数剩 0 也不给——**两个条件都要**', () => {
        const j = makeJoker('j_delayed_grat');
        expect(calculateDollarBonus(j, { discardsUsed: 0, discardsLeft: 0 })).toBeNull();
    });

    it('被 debuff 的小丑不给钱', () => {
        const j = makeJoker('j_golden');
        j.debuff = true;
        expect(calculateDollarBonus(j, { discardsUsed: 0, discardsLeft: 0 })).toBeNull();
    });

    it('没有回合收益的小丑返回 null', () => {
        expect(calculateDollarBonus(makeJoker('j_joker'), { discardsUsed: 0, discardsLeft: 3 })).toBeNull();
    });
});

describe('小丑收益进明细，也进利息之前', () => {
    it('Golden Joker 的 $4 单独一行，排在利息之前', () => {
        const payout = evaluateRound({ ...base, dollars: 10, jokers: [makeJoker('j_golden')] });
        expect(payout.rows.map((r) => r.kind)).toEqual(['blind', 'joker', 'interest']);
        expect(payout.total).toBe(3 + 4 + 2);
    });

    it('小丑赚的钱不参与本关利息', () => {
        // 身上 4 块：小丑给 4 块之后是 8 块，但利息按 4 块算 → 0
        const payout = evaluateRound({ ...base, dollars: 4, jokers: [makeJoker('j_golden')] });
        expect(payout.rows.some((r) => r.kind === 'interest')).toBe(false);
        expect(payout.total).toBe(3 + 4);
    });
});
