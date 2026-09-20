/**
 * 8 张强化牌。期望分数全部手算，算式写在用例名里（04 号票：没有外部真值）。
 *
 * 基准公式：`floor((牌型基础筹码 + Σ计分牌筹码) × 牌型基础倍率)`，
 * 1 级 Pair 是 `(10 + …) × 2`、1 级 High Card 是 `(5 + …) × 1`。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Card, type Suit, type Value, getId, isSuit, makeCard, resetCardCounters } from './card';
import { ENHANCEMENT_CENTERS, getEndOfRoundDollars, isStone } from './enhancements';
import { makeGameView } from './jokers';
import { evaluatePokerHand } from './poker-hands';
import { evaluatePlay, initialHands } from './scoring';

function c(spec: string, x: number, enhancement: string | null = null): Card {
    const suitMap: Record<string, Suit> = { S: 'Spades', H: 'Hearts', C: 'Clubs', D: 'Diamonds' };
    const valMap: Record<string, Value> = {
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        T: '10', J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace',
    };
    const card = makeCard(spec, suitMap[spec[0]], valMap[spec.slice(1)]);
    card.T.x = x;
    card.enhancement = enhancement;
    return card;
}

/** 按传入顺序铺 T.x。`[牌, 强化]` 二元组 */
const hand = (...specs: Array<string | [string, string]>) =>
    specs.map((spec, i) =>
        typeof spec === 'string' ? c(spec, i * 2.05) : c(spec[0], i * 2.05, spec[1]),
    );

/** 掷点恒不中（0.999），用来把幸运／玻璃的随机项钉死 */
const never = () => 0.999;
/** 掷点恒中（0） */
const always = () => 0;

beforeEach(() => resetCardCounters());

describe('加筹码 / 加倍率的两张', () => {
    it('Bonus Card 给 +30 筹码：Pair = (10 + 10+30 + 10) × 2 = 120', () => {
        // 两张 K（各 10 点），其中一张是 Bonus（+30）。另外三张不计分
        const out = evaluatePlay(
            hand(['SK', 'm_bonus'], 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView(),
        );
        expect(out.handName).toBe('Pair');
        expect(out.score).toBe(120);
    });

    it('Mult Card 给 +4 倍率：Pair = (10 + 10+10) × (2+4) = 180', () => {
        const out = evaluatePlay(
            hand(['SK', 'm_mult'], 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView(),
        );
        expect(out.score).toBe(180);
    });

    it('两张一起：(10 + 10+30 + 10) × (2+4) = 360', () => {
        const out = evaluatePlay(
            hand(['SK', 'm_bonus'], ['HK', 'm_mult'], 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView(),
        );
        expect(out.score).toBe(360);
    });
});

describe('Wild Card：算所有花色', () => {
    it('四红桃 + 一张黑桃万能牌 = 同花', () => {
        const cards = hand('HA', 'HK', 'HT', 'H5', ['S4', 'm_wild']);
        expect(evaluatePokerHand(cards).topName).toBe('Flush');
    });

    it('不带万能牌就只是高牌', () => {
        expect(evaluatePokerHand(hand('HA', 'HK', 'HT', 'H5', 'S4')).topName).toBe('High Card');
    });

    it('万能牌的点数照算：同花 = (35 + 11+10+10+5+4) × 4 = 300', () => {
        const out = evaluatePlay(
            hand('HA', 'HK', 'HT', 'H5', ['S4', 'm_wild']),
            initialHands(),
            makeGameView(),
        );
        expect(out.score).toBe(300);
    });

    it('`isSuit` 对万能牌四个花色全返回真', () => {
        const wild = c('S4', 0, 'm_wild');
        for (const suit of ['Spades', 'Hearts', 'Clubs', 'Diamonds'] as const) {
            expect(isSuit(wild, suit)).toBe(true);
        }
    });
});

describe('Stone Card：没点数没花色，但无条件计分', () => {
    it('`get_id` 返回一个与真实点数都不等的值，所以凑不成对子', () => {
        const stone = c('S4', 0, 'm_stone');
        expect(isStone(stone)).toBe(true);
        expect(getId(stone)).toBeLessThan(0);
        expect(evaluatePokerHand([stone, c('H4', 1)]).topName).toBe('High Card');
    });

    it('`isSuit` 对石头牌四个花色全返回假', () => {
        const stone = c('S4', 0, 'm_stone');
        for (const suit of ['Spades', 'Hearts', 'Clubs', 'Diamonds'] as const) {
            expect(isSuit(stone, suit)).toBe(false);
        }
    });

    /**
     * **这一条是石头牌最容易漏的地方**：它凑不成牌型，所以不会出现在
     * `results.top` 里，但 `state_events.lua:605` 的 `pures` 会把它追加进计分集。
     */
    it('石头牌不进牌型却照样计分：Pair + 石头 = (10 + 10+10 + 50) × 2 = 160', () => {
        const cards = hand(['D3', 'm_stone'], 'SK', 'HK', 'C4', 'D9');
        const out = evaluatePlay(cards, initialHands(), makeGameView());
        expect(out.handName).toBe('Pair');
        expect(out.scoringHand).toHaveLength(3);
        expect(out.score).toBe(160);
    });

    it('石头牌加的是 config.bonus(50)，不是自己的点数', () => {
        expect(ENHANCEMENT_CENTERS.m_stone.config.bonus).toBe(50);
        // 3 点的石头牌与 K 的石头牌给一样多：High Card + 石头
        const low = evaluatePlay(hand(['D3', 'm_stone'], 'SA', 'H7', 'C4', 'D9'), initialHands(), makeGameView());
        resetCardCounters();
        const high = evaluatePlay(hand(['DK', 'm_stone'], 'SA', 'H7', 'C4', 'D9'), initialHands(), makeGameView());
        expect(low.score).toBe(high.score);
        // (5 + 11 + 50) × 1 = 66
        expect(low.score).toBe(66);
    });
});

describe('Glass Card：×2 倍率，1/4 碎掉', () => {
    it('一张玻璃：Pair = (10 + 10+10) × 2 × 2 = 120', () => {
        const out = evaluatePlay(
            hand(['SK', 'm_glass'], 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ pseudorandom: never }),
        );
        expect(out.score).toBe(120);
    });

    it('两张玻璃是 ×2×2 = ×4：(10 + 10+10) × 2 × 4 = 240', () => {
        const out = evaluatePlay(
            hand(['SK', 'm_glass'], ['HK', 'm_glass'], 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ pseudorandom: never }),
        );
        expect(out.score).toBe(240);
    });

    it('碎掉的牌**本手照样出过力**——销毁判定排在那唯一一次乘法之前', () => {
        const out = evaluatePlay(
            hand(['SK', 'm_glass'], 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ pseudorandom: always }),
        );
        expect(out.score).toBe(120);
        expect(out.destroyed).toHaveLength(1);
        expect(out.destroyed[0].key).toBe('SK');
    });

    it('掷点不中就不碎', () => {
        const out = evaluatePlay(
            hand(['SK', 'm_glass'], 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ pseudorandom: never }),
        );
        expect(out.destroyed).toHaveLength(0);
    });

    it('没进计分集的玻璃牌不掷点（只扫 scoringHand）', () => {
        const keys: string[] = [];
        // D9 的玻璃牌不参与 Pair，所以不该被扫到
        evaluatePlay(
            hand('SK', 'HK', ['D9', 'm_glass'], 'C4', 'D3'),
            initialHands(),
            makeGameView({ pseudorandom: (k) => { keys.push(k); return 0.999; } }),
        );
        expect(keys.filter((k) => k === 'glass')).toHaveLength(0);
    });
});

describe('Lucky Card：1/5 给 +20 倍率、1/15 给 $20，两次掷点都无条件发生', () => {
    it('全中：Pair = (10 + 10+10) × (2+20) = 660，且 +$20', () => {
        const game = makeGameView({ pseudorandom: always, dollars: 0 });
        const out = evaluatePlay(hand(['SK', 'm_lucky'], 'HK', 'D9', 'C4', 'D3'), initialHands(), game);
        expect(out.score).toBe(660);
        expect(game.dollars).toBe(20);
    });

    it('全不中：Pair = (10 + 10+10) × 2 = 60，钱不变', () => {
        const game = makeGameView({ pseudorandom: never, dollars: 0 });
        const out = evaluatePlay(hand(['SK', 'm_lucky'], 'HK', 'D9', 'C4', 'D3'), initialHands(), game);
        expect(out.score).toBe(60);
        expect(game.dollars).toBe(0);
    });

    /**
     * **两个 key 独立，而且中不中都掷。** 把掷点挪进 `if` 里
     * （「先判会不会给钱再掷」）会让同 seed 从这一手起分叉。
     */
    it('`lucky_mult` 与 `lucky_money` 各掷一次，顺序是 mult 在前', () => {
        const keys: string[] = [];
        evaluatePlay(
            hand(['SK', 'm_lucky'], 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ pseudorandom: (k) => { keys.push(k); return 0.999; } }),
        );
        expect(keys.filter((k) => k.startsWith('lucky'))).toEqual(['lucky_mult', 'lucky_money']);
    });

    it('`Oops! All 6s` 把概率翻倍：normal = 2 时 1/5 判的是 < 0.4', () => {
        const game = makeGameView({ pseudorandom: () => 0.3, probabilities: { normal: 2 } });
        const out = evaluatePlay(hand(['SK', 'm_lucky'], 'HK', 'D9', 'C4', 'D3'), initialHands(), game);
        // 0.3 < 2/5 = 0.4 → 中；normal = 1 时 0.3 >= 0.2 → 不中
        expect(out.score).toBe(660);
    });
});

describe('Steel / Gold：留在手里才算', () => {
    it('Steel 在手牌区给 ×1.5：Pair = (10 + 10+10) × 2 × 1.5 = 90', () => {
        const held = [c('S7', 0, 'm_steel')];
        const out = evaluatePlay(
            hand('SK', 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ handCards: held }),
        );
        expect(out.score).toBe(90);
    });

    it('两张 Steel 是 ×1.5×1.5 = ×2.25：60 × 2.25 = 135', () => {
        const held = [c('S7', 0, 'm_steel'), c('S8', 1, 'm_steel')];
        const out = evaluatePlay(
            hand('SK', 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ handCards: held }),
        );
        expect(out.score).toBe(135);
    });

    it('Steel **打出去就不给** ×1.5（它只在手牌区结算）', () => {
        const out = evaluatePlay(
            hand(['SK', 'm_steel'], 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ handCards: [] }),
        );
        expect(out.score).toBe(60);
    });

    it('Gold 每张回合结束给 $3，只认留在手里的', () => {
        expect(getEndOfRoundDollars(c('S7', 0, 'm_gold'))).toBe(3);
        expect(getEndOfRoundDollars(c('S7', 0))).toBe(0);
    });
});

describe('被 debuff 的强化牌全部归零', () => {
    it('debuff 的 Bonus Card 不给 30，也不给自己的点数', () => {
        const cards = hand(['SK', 'm_bonus'], 'HK', 'D9', 'C4', 'D3');
        cards[0].debuff = true;
        // 被 debuff 的牌整张跳过（`state_events.lua:677`）：(10 + 10) × 2 = 40
        const out = evaluatePlay(cards, initialHands(), makeGameView());
        expect(out.score).toBe(40);
    });

    it('debuff 的玻璃牌不掷 `glass`（原文 `and not debuff` 短路）', () => {
        const cards = hand(['SK', 'm_glass'], 'HK', 'D9', 'C4', 'D3');
        cards[0].debuff = true;
        const keys: string[] = [];
        const out = evaluatePlay(
            cards,
            initialHands(),
            makeGameView({ pseudorandom: (k) => { keys.push(k); return 0; } }),
        );
        expect(keys).not.toContain('glass');
        expect(out.destroyed).toHaveLength(0);
    });
});
