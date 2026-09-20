/**
 * 版本（Foil / Holographic / Polychrome / Negative）。
 * 期望分数手算，算式写在用例名里。
 *
 * 基准：1 级 Pair 是 `(10 + Σnominal) × 2`。两张 K 的 Pair 是 `(10+10+10) × 2 = 60`。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Card, type Suit, type Value, makeCard, resetCardCounters } from './card';
import { EDITION_VALUES, negativeCount, pollEdition } from './editions';
import { makeGameView, makeJoker } from './jokers';
import { evaluatePlay, initialHands } from './scoring';

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
const roller = (value: number) => ({ pseudorandom: () => value });

beforeEach(() => resetCardCounters());

describe('pollEdition：四道门槛从上往下 negative → polychrome → holo → foil', () => {
    /** 默认档：0.003 / 0.006 / 0.02 / 0.04（后三档乘 edition_rate = 1） */
    it('0.999 → negative（> 1 - 0.003）', () => {
        expect(pollEdition(roller(0.999), 'k')).toBe('negative');
    });

    it('0.996 → polychrome（过 1 - 0.006 但不过 1 - 0.003）', () => {
        expect(pollEdition(roller(0.996), 'k')).toBe('polychrome');
    });

    it('0.99 → holo（过 1 - 0.02）', () => {
        expect(pollEdition(roller(0.99), 'k')).toBe('holo');
    });

    it('0.97 → foil（过 1 - 0.04）', () => {
        expect(pollEdition(roller(0.97), 'k')).toBe('foil');
    });

    it('0.5 → 没版本', () => {
        expect(pollEdition(roller(0.5), 'k')).toBeNull();
    });

    /** `no_neg` 只挡 negative 那一档，**不影响后三档的门槛** */
    it('no_neg：0.999 从 negative 掉到 polychrome', () => {
        expect(pollEdition(roller(0.999), 'k', { noNeg: true })).toBe('polychrome');
    });

    /** `mod = 2`（标准包）：后三档门槛翻倍，negative 那档也翻倍 */
    it('mod = 2：0.93 变成 foil（1 - 0.04×2 = 0.92）', () => {
        expect(pollEdition(roller(0.93), 'k')).toBeNull();
        expect(pollEdition(roller(0.93), 'k', { mod: 2 })).toBe('foil');
    });

    /**
     * `guaranteed` 把系数全部 ×25：
     * negative > 0.925、polychrome > 0.85、holo > 0.5、foil > 0。
     * **而且不乘 `edition_rate`**——两支的公式不一样。
     */
    it('guaranteed：0.6 就能拿到 holo（平时要 0.98）', () => {
        expect(pollEdition(roller(0.6), 'k')).toBeNull();
        expect(pollEdition(roller(0.6), 'k', { guaranteed: true })).toBe('holo');
    });

    it('guaranteed 下 0 仍然是 null（foil 的门槛是严格 > 0）', () => {
        expect(pollEdition(roller(0), 'k', { guaranteed: true })).toBeNull();
    });

    it('掷点**无条件发生**：no_neg / guaranteed 都不影响掷不掷', () => {
        const keys: string[] = [];
        const r = { pseudorandom: (k: string) => { keys.push(k); return 0.5; } };
        pollEdition(r, 'edisho1');
        pollEdition(r, 'edisho1', { noNeg: true, guaranteed: true });
        expect(keys).toEqual(['edisho1', 'edisho1']);
    });
});

describe('扑克牌身上的版本：chip → mult → x_mult 一口气走完', () => {
    it('Foil 的 K：Pair = (10 + 10+50 + 10) × 2 = 160', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].edition = 'foil';
        expect(evaluatePlay(cards, initialHands(), makeGameView()).score).toBe(160);
    });

    it('Holographic 的 K：Pair = (10 + 10+10) × (2+10) = 360', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].edition = 'holo';
        expect(evaluatePlay(cards, initialHands(), makeGameView()).score).toBe(360);
    });

    it('Polychrome 的 K：Pair = (10 + 10+10) × 2 × 1.5 = 90', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].edition = 'polychrome';
        expect(evaluatePlay(cards, initialHands(), makeGameView()).score).toBe(90);
    });

    /** Negative 不参与计分——它的效果是格子数 */
    it('Negative 的 K 不改分数：仍是 60', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].edition = 'negative';
        expect(evaluatePlay(cards, initialHands(), makeGameView()).score).toBe(60);
    });

    /**
     * **版本排在牌自己的 `x_mult`（玻璃牌）之前**（`state_events.lua:780` vs `:800`）。
     * 两者都是乘法，所以顺序其实不改结果——但排错了以后接「加法型」的效果会错。
     */
    it('Polychrome + 玻璃牌：(10 + 10+10) × 2 × 1.5 × 2 = 180', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].edition = 'polychrome';
        cards[0].enhancement = 'm_glass';
        const out = evaluatePlay(
            cards, initialHands(),
            makeGameView({ pseudorandom: () => 0.999 }),
        );
        expect(out.score).toBe(180);
    });

    it('被 debuff 的牌连版本也不给', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].edition = 'holo';
        cards[0].debuff = true;
        // 被 debuff 的牌整张跳过：(10 + 10) × 2 = 40
        expect(evaluatePlay(cards, initialHands(), makeGameView()).score).toBe(40);
    });
});

describe('小丑身上的版本：加法段在前、乘法段在「小丑对小丑」之后', () => {
    /** `j_banner`：每点剩余弃牌 +30 筹码。3 次弃牌 → +90 */
    it('Foil 的 Banner：(10 + 10+10) × 2 + 版本 50 → (30+90+50) × 2 = 340', () => {
        const joker = makeJoker('j_banner');
        joker.edition = 'foil';
        const out = evaluatePlay(
            hand('SK', 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ jokers: [joker], current_round: { hands_left: 4, discards_left: 3, hands_played: 0 } }),
        );
        expect(out.score).toBe(340);
    });

    it('Holographic 的 Banner：(30+90) × (2+10) = 1440', () => {
        const joker = makeJoker('j_banner');
        joker.edition = 'holo';
        const out = evaluatePlay(
            hand('SK', 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ jokers: [joker], current_round: { hands_left: 4, discards_left: 3, hands_played: 0 } }),
        );
        expect(out.score).toBe(1440);
    });

    /**
     * **这一条盯的是分段。** `Jolly Joker` 有对子就 +8 倍率。
     * Polychrome 的 ×1.5 排在那 +8 **之后**：`(10+20) × (2+8) × 1.5 = 450`。
     * 如果把版本整段挪到小丑效果之前，就会变成 `(10+20) × (2×1.5+8) = 330`。
     */
    it('Polychrome 的 Jolly Joker：(10 + 10+10) × (2+8) × 1.5 = 450', () => {
        const joker = makeJoker('j_jolly');
        joker.edition = 'polychrome';
        const out = evaluatePlay(
            hand('SK', 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ jokers: [joker] }),
        );
        expect(out.score).toBe(450);
    });

    it('没版本的小丑不多算：Jolly Joker = (10+20) × (2+8) = 300', () => {
        const out = evaluatePlay(
            hand('SK', 'HK', 'D9', 'C4', 'D3'),
            initialHands(),
            makeGameView({ jokers: [makeJoker('j_jolly')] }),
        );
        expect(out.score).toBe(300);
    });
});

describe('Negative：+1 格', () => {
    it('数的是 edition === negative 的那些', () => {
        const a = makeJoker('j_banner');
        const b = makeJoker('j_joker');
        b.edition = 'negative';
        const cc = makeJoker('j_jolly');
        cc.edition = 'foil';
        expect(negativeCount([a, b, cc])).toBe(1);
    });

    it('空数组是 0', () => {
        expect(negativeCount([])).toBe(0);
    });

    it('三个数值常量与 game.lua:660-663 对得上', () => {
        expect(EDITION_VALUES).toEqual({ foil: 50, holo: 10, polychrome: 1.5, negative: 1 });
    });
});
