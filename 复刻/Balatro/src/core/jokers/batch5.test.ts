/**
 * 「钱」那一组：Credit Card / Rocket / Gift Card，外加这一刀补上的 `set_cost`（版本加价）。
 *
 * 口径与前几批一样：期望值手算、算式写进用例名。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { makeStandardDeck, resetCardCounters } from '../card';
import { makeConsumable } from '../consumables';
import { calculateDollarBonus } from '../economy';
import { Run } from '../run';
import { calculateJoker } from './calculate';
import { makeGameView } from './game-view';
import { makeJoker, setCost } from './instance';

beforeEach(() => resetCardCounters());

/** 打完当前这一关（直接判过关），进商店 */
function toShop(run: Run): void {
    const round = run.startRound();
    (round as unknown as { phase: string }).phase = 'won';
    run.finishRound();
}

// ————————————————————————————————————————————————————————————————
// set_cost
// ————————————————————————————————————————————————————————————————

describe('set_cost：版本加价', () => {
    it('Joker（$2）：Foil +2 → 买 $4 卖 $2；Holo +3 → $5 / $2；Polychrome / Negative +5 → $7 / $3', () => {
        const cases: Array<['foil' | 'holo' | 'polychrome' | 'negative', number, number]> = [
            ['foil', 4, 2], ['holo', 5, 2], ['polychrome', 7, 3], ['negative', 7, 3],
        ];
        for (const [edition, cost, sell] of cases) {
            const j = makeJoker('j_joker');
            j.edition = edition;
            setCost(j);
            expect([j.cost, j.sell_cost], edition).toEqual([cost, sell]);
        }
    });

    it('商店按含版本的价收钱（原先按 center 的基础价）', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        toShop(run);
        const joker = makeJoker('j_joker');
        joker.edition = 'negative';
        setCost(joker);
        run.shop!.items[0] = { kind: 'joker', joker, cost: joker.cost };
        expect(run.shop!.itemCost(0)).toBe(7);

        run.dollars = 10;
        run.buyJoker(0);
        expect(run.dollars).toBe(3);
    });

    it('Invisible Joker 复制一张 Negative 的：剥掉 Negative，价格跟着回到基础价（$2 / $1）', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const inv = makeJoker('j_invisible');
        inv.ability.invis_rounds = 2;
        const neg = makeJoker('j_joker');
        neg.edition = 'negative';
        setCost(neg);
        run.jokers.push(inv, neg);
        run.sellJoker(0);
        const copy = run.jokers[1];
        expect(copy.edition).toBeUndefined();
        expect([copy.cost, copy.sell_cost]).toEqual([2, 1]);
    });

    it('Egg 攒的卖价是 `extra_value`，之后加上版本也不会被冲掉：floor((4+5)/2) + 3 = 7', () => {
        const egg = makeJoker('j_egg');
        calculateJoker(egg, { end_of_round: true }, makeGameView({ jokers: [egg] }));
        expect(egg.sell_cost).toBe(2 + 3);
        egg.edition = 'polychrome';
        setCost(egg);
        expect(egg.sell_cost).toBe(7);
    });
});

// ————————————————————————————————————————————————————————————————
// Gift Card / Rocket
// ————————————————————————————————————————————————————————————————

describe('Gift Card / Rocket', () => {
    it('Gift Card：每回合小丑区与消耗品区每一张（含自己）卖价 +1', () => {
        const gift = makeJoker('j_gift');
        const joker = makeJoker('j_joker');
        const planet = makeConsumable('c_pluto');
        const view = makeGameView({ jokers: [gift, joker], consumableCards: [planet] });
        const before = [gift.sell_cost, joker.sell_cost, planet.sell_cost];
        calculateJoker(gift, { end_of_round: true }, view);
        calculateJoker(gift, { end_of_round: true }, view);
        expect([gift.sell_cost, joker.sell_cost, planet.sell_cost]).toEqual(before.map((v) => v + 2));
    });

    it('Rocket：回合收益 $1；打完 Boss 那一刻 +2，这一关就拿 $3', () => {
        const rocket = makeJoker('j_rocket');
        const round = { discardsUsed: 0, discardsLeft: 0 };
        expect(calculateDollarBonus(rocket, round)).toBe(1);

        calculateJoker(rocket, { end_of_round: true }, makeGameView({ jokers: [rocket] }));
        expect(calculateDollarBonus(rocket, round)).toBe(1); // 小盲注不涨

        calculateJoker(rocket, { end_of_round: true, blind_boss: true }, makeGameView({ jokers: [rocket] }));
        expect(calculateDollarBonus(rocket, round)).toBe(3);
    });

    it('Rocket 走真的 Run：打完 Boss 的那一关收益里 Rocket 那行是 $3', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_rocket'));
        for (const expected of [1, 1, 3]) {
            const round = run.startRound();
            (round as unknown as { phase: string }).phase = 'won';
            const { payout } = run.finishRound();
            const row = payout.rows.find((r) => r.kind === 'joker');
            expect(row?.dollars).toBe(expected);
            run.leaveShop();
        }
    });
});

// ————————————————————————————————————————————————————————————————
// Credit Card
// ————————————————————————————————————————————————————————————————

describe('Credit Card：负债下限 -$20', () => {
    it('有它就能花到 -$20：$5 买 $7 的小丑 → 身上 -$2', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        toShop(run);
        run.jokers.push(makeJoker('j_credit_card'));
        expect(run.bankruptAt).toBe(-20);

        const joker = makeJoker('j_joker');
        joker.edition = 'negative';
        setCost(joker);
        run.shop!.items[0] = { kind: 'joker', joker, cost: joker.cost };
        run.dollars = 5;
        expect(run.canAfford(7)).toBe(true);
        run.buyJoker(0);
        expect(run.dollars).toBe(-2);
    });

    it('再往下就买不起：-$2 时最多还能花 $18', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_credit_card'));
        run.dollars = -2;
        expect(run.spendable).toBe(18);
        expect(run.canAfford(18)).toBe(true);
        expect(run.canAfford(19)).toBe(false);
    });

    it('免费的永远买得起，哪怕已经欠到底', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.dollars = -20;
        expect(run.canAfford(0)).toBe(true);
    });

    it('卖掉 / 被 debuff 就收回下限，但**欠的钱不会被抹平**', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const card = makeJoker('j_credit_card');
        run.jokers.push(card);
        run.dollars = -10;

        card.debuff = true;
        expect(run.bankruptAt).toBe(0);
        card.debuff = false;

        run.sellJoker(0); // 卖价 $1（cost 1）
        expect(run.bankruptAt).toBe(0);
        expect(run.dollars).toBe(-9);
        expect(run.canAfford(1)).toBe(false);
    });

    it('两张叠加：-$40', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_credit_card'), makeJoker('j_credit_card'));
        expect(run.bankruptAt).toBe(-40);
    });

    it('负债时没有利息（`dollars >= 5` 才算），也不会算出负利息', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_credit_card'));
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        round.dollars = -15;
        const { payout } = run.finishRound();
        expect(payout.rows.some((r) => r.kind === 'interest')).toBe(false);
    });
});
