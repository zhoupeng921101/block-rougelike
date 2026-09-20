/**
 * 21 张塔罗牌。期望值手算，算式或依据写在用例名里（04 号票：没有外部真值）。
 *
 * 每一张至少一条「效果对不对」，外加几条专门盯**顺序与边界**的——
 * 那些才是直译里真正会错的地方。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Card, type Suit, type Value, isSuit, makeCard, resetCardCounters } from '../card';
import { isStone } from '../enhancements';
import { makeJoker } from '../jokers';
import { evaluatePokerHand } from '../poker-hands';
import {
    type Consumable,
    type UseContext,
    applyConsumable,
    canUseConsumable,
    makeConsumable,
    makeUseContext,
} from './index';

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

function use(key: string, ctx: UseContext): Consumable {
    const consumable = makeConsumable(key);
    applyConsumable(consumable, ctx);
    return consumable;
}

beforeEach(() => resetCardCounters());

describe('换强化：8 张走 config.mod_conv', () => {
    const cases: ReadonlyArray<readonly [string, string, string]> = [
        ['c_magician', 'The Magician', 'm_lucky'],
        ['c_empress', 'The Empress', 'm_mult'],
        ['c_heirophant', 'The Hierophant', 'm_bonus'],
        ['c_lovers', 'The Lovers', 'm_wild'],
        ['c_chariot', 'The Chariot', 'm_steel'],
        ['c_justice', 'Justice', 'm_glass'],
        ['c_devil', 'The Devil', 'm_gold'],
        ['c_tower', 'The Tower', 'm_stone'],
    ];

    for (const [key, name, mod] of cases) {
        it(`${name} → ${mod}`, () => {
            const cards = hand('SK');
            use(key, makeUseContext({ highlighted: cards }));
            expect(cards[0].enhancement).toBe(mod);
        });
    }

    it('一次换多张：The Magician 的 max_highlighted 是 2', () => {
        const cards = hand('SK', 'HQ');
        use('c_magician', makeUseContext({ highlighted: cards }));
        expect(cards.map((x) => x.enhancement)).toEqual(['m_lucky', 'm_lucky']);
    });

    it('选多了就不能用：The Lovers 只许 1 张，选 2 张 canUse = false', () => {
        const lovers = makeConsumable('c_lovers');
        expect(canUseConsumable(lovers, makeUseContext({ highlighted: hand('SK') }))).toBe(true);
        expect(canUseConsumable(lovers, makeUseContext({ highlighted: hand('SK', 'HQ') }))).toBe(false);
    });

    it('一张都不选也不行（min_highlighted 缺省是 1）', () => {
        expect(canUseConsumable(makeConsumable('c_magician'), makeUseContext())).toBe(false);
    });

    it('换过的强化会被再换一次盖掉，不会叠加', () => {
        const cards = hand('SK');
        use('c_tower', makeUseContext({ highlighted: cards }));
        expect(isStone(cards[0])).toBe(true);
        use('c_empress', makeUseContext({ highlighted: cards }));
        expect(cards[0].enhancement).toBe('m_mult');
        expect(isStone(cards[0])).toBe(false);
    });
});

describe('换花色：4 张走 config.suit_conv，最多 3 张', () => {
    const cases: ReadonlyArray<readonly [string, string, Suit]> = [
        ['c_star', 'The Star', 'Diamonds'],
        ['c_moon', 'The Moon', 'Clubs'],
        ['c_sun', 'The Sun', 'Hearts'],
        ['c_world', 'The World', 'Spades'],
    ];

    for (const [key, name, suit] of cases) {
        it(`${name} → ${suit}`, () => {
            const cards = hand('SK');
            use(key, makeUseContext({ highlighted: cards }));
            expect(cards[0].base.suit).toBe(suit);
            expect(isSuit(cards[0], suit)).toBe(true);
        });
    }

    it('只换花色，点数不动', () => {
        const cards = hand('S7');
        use('c_sun', makeUseContext({ highlighted: cards }));
        expect(cards[0].base.value).toBe('7');
        expect(cards[0].key).toBe('H_7');
    });

    it('三张换成同花色就凑出同花', () => {
        const cards = hand('SA', 'CK', 'DT', 'H5', 'H4');
        use('c_sun', makeUseContext({ highlighted: cards.slice(0, 3) }));
        expect(evaluatePokerHand(cards).topName).toBe('Flush');
    });

    it('选 4 张超上限，canUse = false', () => {
        const star = makeConsumable('c_star');
        expect(canUseConsumable(star, makeUseContext({ highlighted: hand('SA', 'CK', 'DT') }))).toBe(true);
        expect(canUseConsumable(star, makeUseContext({ highlighted: hand('SA', 'CK', 'DT', 'H5') }))).toBe(false);
    });
});

describe('Strength：点数 +1，A 回到 2', () => {
    it('7 → 8', () => {
        const cards = hand('S7');
        use('c_strength', makeUseContext({ highlighted: cards }));
        expect(cards[0].base.value).toBe('8');
        expect(cards[0].base.nominal).toBe(8);
    });

    it('K → A（nominal 10 → 11）', () => {
        const cards = hand('SK');
        use('c_strength', makeUseContext({ highlighted: cards }));
        expect(cards[0].base.value).toBe('Ace');
        expect(cards[0].base.nominal).toBe(11);
    });

    /** `card.lua:1124`：`card.base.id == 14 and 2 or math.min(id+1, 14)`——A **绕回 2**，不是停在 A */
    it('A → 2，不是停在 A', () => {
        const cards = hand('SA');
        use('c_strength', makeUseContext({ highlighted: cards }));
        expect(cards[0].base.value).toBe('2');
    });

    it('花色不动', () => {
        const cards = hand('D7');
        use('c_strength', makeUseContext({ highlighted: cards }));
        expect(cards[0].base.suit).toBe('Diamonds');
    });
});

describe('Death：把最右边那张复制到其余选中的牌上', () => {
    /** `card.lua:1113`：`rightmost` 是 `T.x` 最大的那张，不是第一张 */
    it('复制的是 T.x 最大的那张，不是数组第一张', () => {
        const cards = hand('S2', 'HK'); // HK 的 T.x 更大
        use('c_death', makeUseContext({ highlighted: cards }));
        expect(cards.map((x) => x.key)).toEqual(['HK', 'HK']);
    });

    it('强化也跟着复制', () => {
        const cards = hand('S2', 'HK');
        cards[1].enhancement = 'm_glass';
        use('c_death', makeUseContext({ highlighted: cards }));
        expect(cards[0].enhancement).toBe('m_glass');
    });

    it('最右边那张自己不变', () => {
        const cards = hand('S2', 'HK');
        const before = { ...cards[1].base };
        use('c_death', makeUseContext({ highlighted: cards }));
        expect(cards[1].base).toEqual(before);
    });

    /** `min_highlighted = 2`：一张不够 */
    it('只选一张就不能用（min_highlighted = 2）', () => {
        const death = makeConsumable('c_death');
        expect(canUseConsumable(death, makeUseContext({ highlighted: hand('SK') }))).toBe(false);
        expect(canUseConsumable(death, makeUseContext({ highlighted: hand('SK', 'H2') }))).toBe(true);
    });
});

describe('The Hanged Man：销毁选中的牌', () => {
    it('最多 2 张，销毁的那几张交给 removeCards', () => {
        const cards = hand('SK', 'H2');
        const removed: Card[][] = [];
        use('c_hanged_man', makeUseContext({
            highlighted: cards,
            removeCards: (x) => removed.push(x),
        }));
        expect(removed).toHaveLength(1);
        expect(removed[0].map((x) => x.key)).toEqual(['SK', 'H2']);
    });

    it('选 3 张超上限', () => {
        const man = makeConsumable('c_hanged_man');
        expect(canUseConsumable(man, makeUseContext({ highlighted: hand('SK', 'H2', 'D3') }))).toBe(false);
    });
});

describe('给钱的两张', () => {
    /** `card.lua:1390`：`max(0, min(dollars, extra))`，extra = 20 */
    it('The Hermit 翻倍，上限 $20：$8 → +$8', () => {
        let dollars = 8;
        use('c_hermit', makeUseContext({
            getDollars: () => dollars,
            addDollars: (n) => { dollars += n; },
        }));
        expect(dollars).toBe(16);
    });

    it('The Hermit 封顶：$50 → +$20 = $70，不是 $100', () => {
        let dollars = 50;
        use('c_hermit', makeUseContext({
            getDollars: () => dollars,
            addDollars: (n) => { dollars += n; },
        }));
        expect(dollars).toBe(70);
    });

    it('The Hermit 在 $0 时给 0，不给负数', () => {
        let dollars = 0;
        use('c_hermit', makeUseContext({
            getDollars: () => dollars,
            addDollars: (n) => { dollars += n; },
        }));
        expect(dollars).toBe(0);
    });

    /**
     * `card.lua:4171`：`money = min(Σ小丑卖价, extra)`，extra = 50。
     * `j_banner` cost 5 → 卖价 floor(5/2) = 2，`j_joker` cost 2 → 卖价 1。
     */
    it('Temperance 给小丑卖价总和：banner(2) + joker(1) = $3', () => {
        let dollars = 0;
        use('c_temperance', makeUseContext({
            jokers: [makeJoker('j_banner'), makeJoker('j_joker')],
            addDollars: (n) => { dollars += n; },
        }));
        expect(dollars).toBe(3);
    });

    it('Temperance 没有小丑时给 $0', () => {
        let dollars = 0;
        use('c_temperance', makeUseContext({ addDollars: (n) => { dollars += n; } }));
        expect(dollars).toBe(0);
    });

    it('Temperance 封顶 $50', () => {
        // 30 张卖价 2 的小丑 = 60，封到 50
        let dollars = 0;
        use('c_temperance', makeUseContext({
            jokers: Array.from({ length: 30 }, () => makeJoker('j_banner')),
            addDollars: (n) => { dollars += n; },
        }));
        expect(dollars).toBe(50);
    });
});

describe('造牌的四张', () => {
    it('The Emperor 造 2 张塔罗进消耗品区', () => {
        const made: Consumable[] = [];
        use('c_emperor', makeUseContext({
            createConsumable: (set) => {
                expect(set).toBe('Tarot');
                return makeConsumable('c_fool');
            },
            addConsumable: (x) => made.push(x),
        }));
        expect(made).toHaveLength(2);
    });

    it('The High Priestess 造的是星球', () => {
        const made: Consumable[] = [];
        use('c_high_priestess', makeUseContext({
            createConsumable: (set) => {
                expect(set).toBe('Planet');
                return makeConsumable('c_pluto');
            },
            addConsumable: (x) => made.push(x),
        }));
        expect(made).toHaveLength(2);
    });

    /** `card.lua:1403`：`math.min(2, card_limit - #cards)` —— 只剩 1 格就只造 1 张 */
    it('只剩 1 个格子就只造 1 张', () => {
        const made: Consumable[] = [];
        const consumables = [makeConsumable('c_pluto')];
        use('c_emperor', makeUseContext({
            consumables,
            consumableSlots: 2,
            createConsumable: () => makeConsumable('c_fool'),
            addConsumable: (x) => { made.push(x); consumables.push(x); },
        }));
        expect(made).toHaveLength(1);
    });

    it('消耗品区满了就不能用', () => {
        const emperor = makeConsumable('c_emperor');
        const full = makeUseContext({
            consumables: [makeConsumable('c_pluto'), makeConsumable('c_mars')],
        });
        expect(canUseConsumable(emperor, full)).toBe(false);
    });

    it('Judgement 造一张随机小丑，keyAppend 是 jud', () => {
        const added: string[] = [];
        use('c_judgement', makeUseContext({
            createJoker: (keyAppend) => {
                expect(keyAppend).toBe('jud');
                return makeJoker('j_banner');
            },
            addJoker: (j) => added.push(j.key),
        }));
        expect(added).toEqual(['j_banner']);
    });

    it('小丑区满了 Judgement 就不能用', () => {
        const jud = makeConsumable('c_judgement');
        const full = makeUseContext({
            jokers: Array.from({ length: 5 }, () => makeJoker('j_joker')),
            jokerSlots: 5,
        });
        expect(canUseConsumable(jud, full)).toBe(false);
    });

    /** `card.lua:1374`：`forced_key` 有值 → 不抽池子，**一次 RNG 都不消费** */
    it('The Fool 复制 lastTarotPlanet，且不走造卡的口子（那个口子会抛）', () => {
        const made: Consumable[] = [];
        use('c_fool', makeUseContext({
            lastTarotPlanet: 'c_mercury',
            addConsumable: (x) => made.push(x),
        }));
        expect(made.map((x) => x.key)).toEqual(['c_mercury']);
    });

    it('The Fool 复制不了自己（can_use 里那条 `~= c_fool`）', () => {
        const fool = makeConsumable('c_fool');
        expect(canUseConsumable(fool, makeUseContext({ lastTarotPlanet: 'c_fool' }))).toBe(false);
        expect(canUseConsumable(fool, makeUseContext({ lastTarotPlanet: 'c_sun' }))).toBe(true);
    });

    it('没有「上一张」时 The Fool 用不了', () => {
        expect(canUseConsumable(makeConsumable('c_fool'), makeUseContext())).toBe(false);
    });
});

describe('星球牌随时能用（can_use 那条直接 return true）', () => {
    it('不选牌、消耗品区满了也能用', () => {
        const pluto = makeConsumable('c_pluto');
        expect(canUseConsumable(pluto, makeUseContext({
            consumables: [makeConsumable('c_mars'), makeConsumable('c_venus')],
        }))).toBe(true);
    });
});

describe('The Wheel of Fortune：1/4 给一张没版本的小丑加保底版本', () => {
    /**
     * **三次掷点共用同一个 key**，所以测试要按次序喂值，不能喂一个常数：
     * 第 1 次过 1/4 的门（要小），第 3 次决定是哪个版本（要大）。
     * 第 2 次是 `pseudorandom_element`，这里由 `pickRandom` 接管。
     */
    const sequence = (...values: number[]) => {
        let i = 0;
        return () => values[Math.min(i++, values.length - 1)];
    };

    it('小丑区空着就用不了（eligible_strength_jokers 是空的）', () => {
        expect(canUseConsumable(makeConsumable('c_wheel_of_fortune'), makeUseContext())).toBe(false);
    });

    it('有一张没版本的小丑就能用', () => {
        const ctx = makeUseContext({ jokers: [makeJoker('j_banner')] });
        expect(canUseConsumable(makeConsumable('c_wheel_of_fortune'), ctx)).toBe(true);
    });

    it('小丑全都有版本了也用不了', () => {
        const joker = makeJoker('j_banner');
        joker.edition = 'foil';
        const ctx = makeUseContext({ jokers: [joker] });
        expect(canUseConsumable(makeConsumable('c_wheel_of_fortune'), ctx)).toBe(false);
    });

    /**
     * 三次掷点共用 `wheel_of_fortune` 一个 key。
     * **没中的时候只消费第 1 次**——把 2、3 也无条件掷会让同 seed 分叉。
     */
    it('没中（0.9 ≥ 1/4）就只掷一次，小丑不加版本', () => {
        const joker = makeJoker('j_banner');
        const keys: string[] = [];
        use('c_wheel_of_fortune', makeUseContext({
            jokers: [joker],
            pseudorandom: (k) => { keys.push(k); return 0.9; },
            pickRandom: (list) => list[0],
        }));
        expect(keys).toEqual(['wheel_of_fortune']);
        expect(joker.edition).toBeUndefined();
    });

    /**
     * `poll_edition(..., no_neg = true, guaranteed = true)`：
     * 四档门槛全部 ×25，且不出 Negative。0.5 这个点落在
     * `1 - 0.02*25 = 0.5` 之上吗？`0.5 > 0.5` 为假，所以掉到 foil
     * （`0.5 > 1 - 0.04*25 = 0` 为真）。
     */
    /**
     * `guaranteed` 把四档门槛全部 ×25：
     * negative > 0.925、polychrome > 0.85、holo > 0.5、foil > 0。
     */
    it('中了之后掷到 0.6 → holo（0.6 > 1 - 0.02×25 = 0.5）', () => {
        const joker = makeJoker('j_banner');
        use('c_wheel_of_fortune', makeUseContext({
            jokers: [joker],
            pseudorandom: sequence(0, 0.6),
            pickRandom: (list) => list[0],
        }));
        expect(joker.edition).toBe('holo');
    });

    it('掷到 0.2 → foil（0.2 > 1 - 0.04×25 = 0，但不到 0.5）', () => {
        const joker = makeJoker('j_banner');
        use('c_wheel_of_fortune', makeUseContext({
            jokers: [joker],
            pseudorandom: sequence(0, 0.2),
            pickRandom: (list) => list[0],
        }));
        expect(joker.edition).toBe('foil');
    });

    /** `no_neg = true`：0.99 过了 negative 那一档也不给，落到 polychrome */
    it('掷到 0.99 → **不给 Negative**，落到 Polychrome', () => {
        const joker = makeJoker('j_banner');
        use('c_wheel_of_fortune', makeUseContext({
            jokers: [joker],
            pseudorandom: sequence(0, 0.99),
            pickRandom: (list) => list[0],
        }));
        expect(joker.edition).toBe('polychrome');
    });

    it('`Oops! All 6s` 把 1/4 翻成 2/4：0.3 从不中变成中', () => {
        const a = makeJoker('j_banner');
        use('c_wheel_of_fortune', makeUseContext({
            jokers: [a],
            pseudorandom: () => 0.3,
            pickRandom: (list) => list[0],
        }));
        expect(a.edition).toBeUndefined(); // 0.3 >= 1/4

        const b = makeJoker('j_banner');
        use('c_wheel_of_fortune', makeUseContext({
            jokers: [b],
            probabilities: { normal: 2 },
            pseudorandom: () => 0.3,
            pickRandom: (list) => list[0],
        }));
        expect(b.edition).toBeDefined(); // 0.3 < 2/4
    });
});

describe('两张牌换完之后，牌的身份不变', () => {
    /**
     * `set_base` 换的是 `base`，**`sort_id` 与 `unique_val` 不动**——
     * 换点数换花色的是同一张牌，不是新造一张。新造会让
     * `pseudoshuffle` 的规范序（按 `sort_id`）跟着变，同 seed 立刻分叉。
     */
    it('换花色 / 升点数都不改 sort_id 与 unique_val', () => {
        const cards = hand('S7');
        const { sort_id, unique_val } = cards[0];
        use('c_sun', makeUseContext({ highlighted: cards }));
        use('c_strength', makeUseContext({ highlighted: cards }));
        expect(cards[0].sort_id).toBe(sort_id);
        expect(cards[0].unique_val).toBe(unique_val);
    });
});
