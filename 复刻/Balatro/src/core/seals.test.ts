/**
 * 蜡封（Red / Blue / Gold / Purple）。期望分数手算，算式写在用例名里。
 *
 * 四种蜡封挂在四个**不同的**钩子上，所以这里也分四组测——
 * 合在一起测会掩盖「某个钩子压根没人调」这种错（16 号票收尾时逮到过两次）。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Card, type Suit, type Value, makeCard, makeStandardDeck, resetCardCounters } from './card';
import { makeConsumable } from './consumables';
import { makeGameView } from './jokers';
import { Run } from './run';
import { evaluatePlay, initialHands } from './scoring';
import { GOLD_SEAL_DOLLARS, PURPLE_SEAL_APPEND, sealRepetitions } from './seals';

function c(spec: string, x: number): Card {
    const suitMap: Record<string, Suit> = { S: 'Spades', H: 'Hearts', C: 'Clubs', D: 'Diamonds' };
    const valMap: Record<string, Value> = {
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        T: '10', J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace',
    };
    const card = makeCard(spec, suitMap[spec[0]], valMap[spec.slice(1)]);
    card.T.x = x;
    return card;
}

const hand = (...specs: string[]) => specs.map((s, i) => c(s, i * 2.05));

beforeEach(() => resetCardCounters());

describe('Red：重复触发一次', () => {
    it('`sealRepetitions` 对 Red 返回 1，别的返回 0', () => {
        const card = c('SK', 0);
        expect(sealRepetitions(card)).toBe(0);
        card.seal = 'Red';
        expect(sealRepetitions(card)).toBe(1);
        card.seal = 'Blue';
        expect(sealRepetitions(card)).toBe(0);
    });

    /** 那张 K 的筹码算两遍：Pair = (10 + 10 + 10+10) × 2 = 80 */
    it('Red 的 K：Pair = (10 + 10×2 + 10) × 2 = 80', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].seal = 'Red';
        expect(evaluatePlay(cards, initialHands(), makeGameView()).score).toBe(80);
    });

    /** 重复触发把强化也算两遍：(10 + (10+30)×2 + 10) × 2 = 200 */
    it('Red + Bonus Card：(10 + (10+30)×2 + 10) × 2 = 200', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].seal = 'Red';
        cards[0].enhancement = 'm_bonus';
        expect(evaluatePlay(cards, initialHands(), makeGameView()).score).toBe(200);
    });

    it('被 debuff 的牌不重复触发', () => {
        const card = c('SK', 0);
        card.seal = 'Red';
        card.debuff = true;
        expect(sealRepetitions(card)).toBe(0);
    });
});

describe('Gold：打出给 $3', () => {
    it('常量是 3（`card.lua:1073`）', () => {
        expect(GOLD_SEAL_DOLLARS).toBe(3);
    });

    it('打出一张 Gold 蜡封的计分牌 → +$3', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].seal = 'Gold';
        const game = makeGameView({ dollars: 0 });
        evaluatePlay(cards, initialHands(), game);
        expect(game.dollars).toBe(3);
    });

    /** **不计分的牌不给钱**——`get_p_dollars` 只在逐张循环里被调 */
    it('没参与计分的 Gold 蜡封不给钱', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[2].seal = 'Gold'; // D9 不在 Pair 里
        const game = makeGameView({ dollars: 0 });
        evaluatePlay(cards, initialHands(), game);
        expect(game.dollars).toBe(0);
    });

    /**
     * `card.lua:1072`：**Gold 蜡封那一段排在幸运牌之前，两者叠加**。
     * 幸运牌中了给 $20，加上蜡封的 $3 = $23。
     */
    it('Gold 蜡封 + 幸运牌全中：$3 + $20 = $23', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].seal = 'Gold';
        cards[0].enhancement = 'm_lucky';
        const game = makeGameView({ dollars: 0, pseudorandom: () => 0 });
        evaluatePlay(cards, initialHands(), game);
        expect(game.dollars).toBe(23);
    });

    it('Gold 蜡封 + 幸运牌没中：只有 $3', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].seal = 'Gold';
        cards[0].enhancement = 'm_lucky';
        const game = makeGameView({ dollars: 0, pseudorandom: () => 0.999 });
        evaluatePlay(cards, initialHands(), game);
        expect(game.dollars).toBe(3);
    });
});

describe('Purple：弃牌时造一张塔罗', () => {
    /**
     * key_append 是 **`'8ba'`**（`card.lua:2263`）——原文从 `8 Ball` 那段
     * 抄下来忘了改。照抄才对得上 seed。
     */
    it('常量是 8ba，不是 pur', () => {
        expect(PURPLE_SEAL_APPEND).toBe('8ba');
    });

    it('弃掉一张 Purple 蜡封的牌 → 消耗品区多一张塔罗', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const round = run.startRound();
        round.hand[0].seal = 'Purple';
        expect(run.consumables).toHaveLength(0);
        round.discard([round.hand[0]]);
        expect(run.consumables).toHaveLength(1);
        expect(run.consumables[0].center.set).toBe('Tarot');
    });

    it('消耗品区满了就不造', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.consumables.push(makeConsumable('c_pluto'), makeConsumable('c_mars'));
        const round = run.startRound();
        round.hand[0].seal = 'Purple';
        round.discard([round.hand[0]]);
        expect(run.consumables).toHaveLength(2);
    });

    it('没有 Purple 蜡封就不造', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const round = run.startRound();
        round.discard([round.hand[0]]);
        expect(run.consumables).toHaveLength(0);
    });
});

describe('Blue：回合结束造「上一手打出的牌型」对应的星球', () => {
    /**
     * **不是随机星球**（`card.lua:1050` 按 `hand_type` 查表），
     * 而且只认**留在手里**的那张牌。
     */
    it('打完一手 Pair，留着 Blue 蜡封 → 拿到 Mercury（Pair 那张）', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const round = run.startRound();

        // 手动凑一手对子打出去
        const pair = [c('SK', 0), c('HK', 1)];
        round.hand.splice(0, 2, ...pair);
        round.hand[2].seal = 'Blue'; // 留在手里的那张
        round.play(pair);
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();

        expect(run.lastHandPlayed).toBe('Pair');
        expect(run.consumables.map((x) => x.key)).toContain('c_mercury');
    });

    it('一手都没打过就不造', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const round = run.startRound();
        round.hand[0].seal = 'Blue';
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        expect(run.consumables).toHaveLength(0);
    });

    /** 打出去的那张不在手里了，所以不给 */
    it('Blue 蜡封被打出去就不给（只认留在手里的）', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const round = run.startRound();
        const pair = [c('SK', 0), c('HK', 1)];
        pair[0].seal = 'Blue';
        round.hand.splice(0, 2, ...pair);
        round.play(pair);
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        expect(run.consumables).toHaveLength(0);
    });
});
