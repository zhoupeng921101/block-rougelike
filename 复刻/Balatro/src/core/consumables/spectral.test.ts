/**
 * 18 张幽灵牌。期望值手算或按源码逐条对齐，依据写在用例名里。
 *
 * 盯两件事：**效果对不对**与**RNG 的账对不对**（哪个 key、掷几次、什么顺序）。
 * 抽到具体哪张由 seed 决定，所以断言的是「掷了什么」而不是「抽到了什么」。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Card, type Suit, type Value, isSuit, makeCard, resetCardCounters } from '../card';
import { isStone } from '../enhancements';
import { makeJoker } from '../jokers';
import { initialHands } from '../scoring';
import {
    type UseContext,
    applyConsumable,
    canUseConsumable,
    makeConsumable,
    makeUseContext,
} from './index';

function c(spec: string, x = 0): Card {
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

function use(key: string, ctx: UseContext): void {
    applyConsumable(makeConsumable(key), ctx);
}

/** 记下每次 `pickRandom` / `pseudorandom` 用的 key */
function tracing(overrides: Partial<UseContext> = {}) {
    const keys: string[] = [];
    const ctx = makeUseContext({
        pickRandom: <T,>(list: T[], key: string) => { keys.push(key); return list[0]; },
        pseudorandom: (key) => { keys.push(key); return 0.5; },
        ...overrides,
    });
    return { ctx, keys };
}

beforeEach(() => resetCardCounters());

describe('三张造牌的：Familiar / Grim / Incantation', () => {
    function makeCtx(made: Card[], removed: Card[][], extra: Partial<UseContext> = {}) {
        return tracing({
            handCards: hand('SK', 'HQ', 'D9'),
            addPlayingCard: (card) => made.push(card),
            removeCards: (cards) => removed.push(cards),
            ...extra,
        });
    }

    it('Familiar：毁 1 张、造 3 张人头牌', () => {
        const made: Card[] = [];
        const removed: Card[][] = [];
        const { ctx } = makeCtx(made, removed);
        use('c_familiar', ctx);
        expect(removed).toHaveLength(1);
        expect(made).toHaveLength(3);
        for (const card of made) expect(['Jack', 'Queen', 'King']).toContain(card.base.value);
    });

    /**
     * **Familiar 用同一个 key 掷两次**（先点数、再花色），
     * 然后 `spe_card` 抽强化。Grim 只掷花色。搞错次数整条链就偏。
     */
    it('Familiar 的账：random_destroy → (familiar_create ×2 + spe_card) ×3', () => {
        const made: Card[] = [];
        const removed: Card[][] = [];
        const { ctx, keys } = makeCtx(made, removed);
        use('c_familiar', ctx);
        expect(keys[0]).toBe('random_destroy');
        expect(keys.filter((k) => k === 'familiar_create')).toHaveLength(6);
        expect(keys.filter((k) => k === 'spe_card')).toHaveLength(3);
    });

    it('Grim：造 2 张 A，**点数不掷点**（只掷花色）', () => {
        const made: Card[] = [];
        const removed: Card[][] = [];
        const { ctx, keys } = makeCtx(made, removed);
        use('c_grim', ctx);
        expect(made).toHaveLength(2);
        for (const card of made) expect(card.base.value).toBe('Ace');
        expect(keys.filter((k) => k === 'grim_create')).toHaveLength(2); // 只有花色
    });

    it('Incantation：造 4 张数字牌（2–10）', () => {
        const made: Card[] = [];
        const removed: Card[][] = [];
        const { ctx, keys } = makeCtx(made, removed);
        use('c_incantation', ctx);
        expect(made).toHaveLength(4);
        for (const card of made) expect(card.base.id).toBeLessThanOrEqual(10);
        expect(keys.filter((k) => k === 'incantation_create')).toHaveLength(8); // 点数 + 花色
    });

    /** `card.lua:1329`：强化池是 8 张**去掉石头牌**的 7 张 */
    it('造出来的牌不会是石头牌', () => {
        const made: Card[] = [];
        const removed: Card[][] = [];
        const { ctx } = makeCtx(made, removed, {
            // 让 pickRandom 每次都取最后一个，看看会不会摸到 m_stone
            pickRandom: <T,>(list: T[]) => list[list.length - 1],
        });
        use('c_familiar', ctx);
        for (const card of made) expect(isStone(card)).toBe(false);
    });

    it('手牌只有 1 张就用不了', () => {
        const one = makeUseContext({ handCards: hand('SK') });
        expect(canUseConsumable(makeConsumable('c_familiar'), one)).toBe(false);
        const two = makeUseContext({ handCards: hand('SK', 'HQ') });
        expect(canUseConsumable(makeConsumable('c_familiar'), two)).toBe(true);
    });
});

describe('四张加蜡封的', () => {
    const cases: ReadonlyArray<readonly [string, string, string]> = [
        ['c_talisman', 'Talisman', 'Gold'],
        ['c_deja_vu', 'Deja Vu', 'Red'],
        ['c_trance', 'Trance', 'Blue'],
        ['c_medium', 'Medium', 'Purple'],
    ];

    for (const [key, name, seal] of cases) {
        it(`${name} → ${seal} 蜡封`, () => {
            const cards = hand('SK');
            use(key, makeUseContext({ highlighted: cards }));
            expect(cards[0].seal).toBe(seal);
        });
    }

    it('要正好选 1 张', () => {
        const t = makeConsumable('c_talisman');
        expect(canUseConsumable(t, makeUseContext())).toBe(false);
        expect(canUseConsumable(t, makeUseContext({ highlighted: hand('SK') }))).toBe(true);
        expect(canUseConsumable(t, makeUseContext({ highlighted: hand('SK', 'HQ') }))).toBe(false);
    });
});

describe('Aura：给选中的那张加保底版本', () => {
    it('0.6 → holo（guaranteed 下门槛是 0.5）', () => {
        const cards = hand('SK');
        use('c_aura', makeUseContext({ highlighted: cards, pseudorandom: () => 0.6 }));
        expect(cards[0].edition).toBe('holo');
    });

    it('**不会是 Negative**（no_neg）', () => {
        const cards = hand('SK');
        use('c_aura', makeUseContext({ highlighted: cards, pseudorandom: () => 0.99 }));
        expect(cards[0].edition).toBe('polychrome');
    });

    it('那张已经有版本了就用不了', () => {
        const cards = hand('SK');
        cards[0].edition = 'foil';
        expect(canUseConsumable(makeConsumable('c_aura'), makeUseContext({ highlighted: cards })))
            .toBe(false);
    });
});

describe('Wraith：造一张稀有小丑，把钱清零', () => {
    it('rarity 传 0.99（> 0.95 → 稀有），**不掷 rarity 点**', () => {
        let rarity: number | undefined;
        let dollars = 17;
        use('c_wraith', makeUseContext({
            getDollars: () => dollars,
            addDollars: (n) => { dollars += n; },
            createJoker: (keyAppend, options) => {
                expect(keyAppend).toBe('wra');
                rarity = options?.rarity;
                return makeJoker('j_banner');
            },
        }));
        expect(rarity).toBe(0.99);
        expect(dollars).toBe(0);
    });

    it('钱是清零不是扣固定数：$3 也清到 0', () => {
        let dollars = 3;
        use('c_wraith', makeUseContext({
            getDollars: () => dollars,
            addDollars: (n) => { dollars += n; },
            createJoker: () => makeJoker('j_banner'),
        }));
        expect(dollars).toBe(0);
    });
});

describe('Sigil / Ouija：整手牌变同花色 / 同点数', () => {
    it('Sigil：**一次掷点定花色**，所有手牌都改', () => {
        const cards = hand('SK', 'HQ', 'D9');
        const { ctx, keys } = tracing({
            handCards: cards,
            pickRandom: <T,>(list: T[], key: string) => { keys.push(key); return list[1]; },
        });
        use('c_sigil', ctx);
        const suits = new Set(cards.map((x) => x.base.suit));
        expect(suits.size).toBe(1);
        expect(keys.filter((k) => k === 'sigil')).toHaveLength(1);
        for (const card of cards) expect(isSuit(card, [...suits][0])).toBe(true);
    });

    it('Sigil 不改点数', () => {
        const cards = hand('SK', 'HQ', 'D9');
        use('c_sigil', makeUseContext({ handCards: cards, pickRandom: (l) => l[0] }));
        expect(cards.map((x) => x.base.value)).toEqual(['King', 'Queen', '9']);
    });

    it('Ouija：整手变同点数，而且**手牌上限 -1**', () => {
        const cards = hand('SK', 'HQ', 'D9');
        let delta = 0;
        use('c_ouija', makeUseContext({
            handCards: cards,
            pickRandom: (l) => l[0],
            changeHandSize: (d) => { delta += d; },
        }));
        expect(new Set(cards.map((x) => x.base.value)).size).toBe(1);
        expect(delta).toBe(-1);
    });

    it('Ouija 不改花色', () => {
        const cards = hand('SK', 'HQ', 'D9');
        use('c_ouija', makeUseContext({ handCards: cards, pickRandom: (l) => l[0] }));
        expect(cards.map((x) => x.base.suit)).toEqual(['Spades', 'Hearts', 'Diamonds']);
    });
});

describe('Ectoplasm / Hex：给小丑加版本', () => {
    it('Ectoplasm：加 Negative，手牌上限递增地减', () => {
        const joker = makeJoker('j_banner');
        let delta = 0;
        let ecto = 1;
        const ctx = makeUseContext({
            jokers: [joker],
            pickRandom: (l) => l[0],
            changeHandSize: (d) => { delta += d; },
            nextEctoplasmMinus: () => ecto++,
        });
        use('c_ectoplasm', ctx);
        expect(joker.edition).toBe('negative');
        expect(delta).toBe(-1);

        // 第二次减 2
        const joker2 = makeJoker('j_joker');
        use('c_ectoplasm', { ...ctx, jokers: [joker2] });
        expect(delta).toBe(-3);
    });

    it('Hex：加 Polychrome，**毁掉其余所有小丑**', () => {
        const keep = makeJoker('j_banner');
        const doomed = makeJoker('j_joker');
        const removed: string[] = [];
        use('c_hex', makeUseContext({
            jokers: [keep, doomed],
            pickRandom: (l) => l[0],
            removeJoker: (j) => removed.push(j.key),
        }));
        expect(keep.edition).toBe('polychrome');
        expect(removed).toEqual(['j_joker']);
    });

    it('小丑全都有版本了，两张都用不了', () => {
        const joker = makeJoker('j_banner');
        joker.edition = 'foil';
        const ctx = makeUseContext({ jokers: [joker] });
        expect(canUseConsumable(makeConsumable('c_ectoplasm'), ctx)).toBe(false);
        expect(canUseConsumable(makeConsumable('c_hex'), ctx)).toBe(false);
    });
});

describe('Immolate：洗一遍手牌，毁前 5 张，给 $20', () => {
    it('**洗牌**而不是逐张抽——只消费一次 `immolate`', () => {
        const cards = hand('SK', 'HQ', 'D9', 'C4', 'D3', 'S7', 'H8');
        const removed: Card[][] = [];
        const keys: string[] = [];
        let dollars = 0;
        use('c_immolate', makeUseContext({
            handCards: cards,
            removeCards: (x) => removed.push(x),
            addDollars: (n) => { dollars += n; },
            shuffled: (list, key) => { keys.push(key); return [...list].reverse(); },
        }));
        expect(keys).toEqual(['immolate']);
        expect(removed[0]).toHaveLength(5);
        expect(dollars).toBe(20);
    });

    it('手牌不到 5 张就毁光那几张', () => {
        const cards = hand('SK', 'HQ', 'D9');
        const removed: Card[][] = [];
        use('c_immolate', makeUseContext({
            handCards: cards,
            removeCards: (x) => removed.push(x),
            shuffled: (list) => [...list],
        }));
        expect(removed[0]).toHaveLength(3);
    });
});

describe('Ankh：复制一张随机小丑，毁掉其余的', () => {
    it('复制被选中的那张，其余全毁', () => {
        const chosen = makeJoker('j_banner');
        const other = makeJoker('j_joker');
        const removed: string[] = [];
        const added: string[] = [];
        use('c_ankh', makeUseContext({
            jokers: [chosen, other],
            pickRandom: (l, key) => { expect(key).toBe('ankh_choice'); return l[0]; },
            removeJoker: (j) => removed.push(j.key),
            addJoker: (j) => added.push(j.key),
        }));
        expect(removed).toEqual(['j_joker']);
        expect(added).toEqual(['j_banner']);
    });

    /** `copy_card(…, strip_edition = chosen.edition.negative)`：Negative 不跟着复制 */
    it('Negative 不跟着复制，别的版本跟着', () => {
        const neg = makeJoker('j_banner');
        neg.edition = 'negative';
        let copy: { edition?: string } | undefined;
        use('c_ankh', makeUseContext({
            jokers: [neg],
            pickRandom: (l) => l[0],
            addJoker: (j) => { copy = j; },
        }));
        expect(copy?.edition).toBeUndefined();

        const foil = makeJoker('j_banner');
        foil.edition = 'foil';
        use('c_ankh', makeUseContext({
            jokers: [foil],
            pickRandom: (l) => l[0],
            addJoker: (j) => { copy = j; },
        }));
        expect(copy?.edition).toBe('foil');
    });

    it('小丑区空着就用不了', () => {
        expect(canUseConsumable(makeConsumable('c_ankh'), makeUseContext())).toBe(false);
    });
});

describe('Cryptid：复制选中的那张 2 份', () => {
    it('造 2 张一模一样的（含强化、版本、蜡封）', () => {
        const source = c('SK');
        source.enhancement = 'm_glass';
        source.edition = 'foil';
        source.seal = 'Red';
        const made: Card[] = [];
        use('c_cryptid', makeUseContext({
            highlighted: [source],
            addPlayingCard: (card) => made.push(card),
        }));
        expect(made).toHaveLength(2);
        for (const card of made) {
            expect(card.key).toBe(source.key);
            expect(card.enhancement).toBe('m_glass');
            expect(card.edition).toBe('foil');
            expect(card.seal).toBe('Red');
        }
    });

    /** 复制出来的是**新牌**，`sort_id` 要各自不同 */
    it('复制出来的两张 sort_id 互不相同，也不等于原牌', () => {
        const source = c('SK');
        const made: Card[] = [];
        use('c_cryptid', makeUseContext({
            highlighted: [source],
            addPlayingCard: (card) => made.push(card),
        }));
        const ids = [source.sort_id, ...made.map((x) => x.sort_id)];
        expect(new Set(ids).size).toBe(3);
    });
});

describe('The Soul / Black Hole', () => {
    it('The Soul：造传奇小丑，legendary = true、keyAppend = sou', () => {
        let opts: { legendary?: boolean } | undefined;
        use('c_soul', makeUseContext({
            createJoker: (keyAppend, options) => {
                expect(keyAppend).toBe('sou');
                opts = options;
                return makeJoker('j_caino');
            },
        }));
        expect(opts?.legendary).toBe(true);
    });

    it('小丑区满了 The Soul 就用不了', () => {
        const full = makeUseContext({
            jokers: Array.from({ length: 5 }, () => makeJoker('j_joker')),
            jokerSlots: 5,
        });
        expect(canUseConsumable(makeConsumable('c_soul'), full)).toBe(false);
    });

    /** **每一个**牌型都升一级，不是只升打出过的 */
    it('Black Hole：12 个牌型全升到 2 级', () => {
        const hands = initialHands();
        use('c_black_hole', makeUseContext({ hands }));
        expect(Object.values(hands).every((h) => h.level === 2)).toBe(true);
    });

    it('Black Hole 随时能用（不挑牌、不看格子）', () => {
        expect(canUseConsumable(makeConsumable('c_black_hole'), makeUseContext())).toBe(true);
    });
});
