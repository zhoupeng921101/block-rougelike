/**
 * 扑克牌模型。直译自 `参考/产物/Balatro_1.0.1o/源码/card.lua:113-145` 的 `Card:set_base`。
 *
 * 保留原作的字段名（`nominal` / `suit_nominal` / `face_nominal` / `id`），
 * 不改成更"合理"的命名——它们会被 `get_nominal()` 的那条加权公式直接用到，
 * 改名之后对不上原文，校对成本反而更高。见 03 号票的直译裁定。
 */

import { enhancedGetId, enhancedIsSuit, isStone } from './enhancements';

export type Suit = 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds';

export type Value =
    | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
    | 'Jack' | 'Queen' | 'King' | 'Ace';

/** 对应 `card.lua:113` 的 `self.base`。 */
export type CardBase = {
    suit: Suit;
    value: Value;
    nominal: number;
    suit_nominal: number;
    suit_nominal_original: number;
    face_nominal: number;
    id: number;
};

export type Card = {
    /** `P_CARDS` 的 key，如 `C_2`。直译时当作牌的身份。 */
    readonly key: string;
    readonly base: CardBase;
    /** `card.lua:24` 的全局自增计数器，`pseudoshuffle` 的规范序靠它 */
    sort_id: number;
    /** `get_nominal` 公式末项 `0.000001*self.unique_val` 用到 */
    unique_val: number;
    /**
     * `card.lua:526` 的 `self.debuff`。Boss 盲注与 debuff 效果置位，
     * 一被置位，`get_chip_bonus` / `is_face` 全部归零——它不是表现层的标记。
     */
    debuff: boolean;
    /**
     * `card.ability.played_this_ante`（`state_events.lua:502` 置位、`:287` 清）。
     * `The Pillar` 靠它认「本 Ante 之前打出过的牌」。
     */
    played_this_ante: boolean;
    /**
     * `card.ability.forced_selection`。`Cerulean Bell` 强制这张牌必须被选中，
     * 取消不掉。清除在 `Blind:disable`（`blind.lua:382`）与回合结束时
     * （`state_events.lua:299`）。
     */
    forced_selection: boolean;
    /**
     * `card.facing`。`'back'` = 盖着（`Blind:stay_flipped`）。
     *
     * **盖牌不改任何数值**：牌还在手里、还能选、还照常计分，玩家只是看不见它是什么。
     * 所以它是信息隐藏，不是 debuff——但**判定消费 RNG**（The Wheel 的 1/7），
     * 所以它得由逻辑层的抽牌流程写，不能让表现层自己算。
     */
    facing: 'front' | 'back';
    /**
     * `card.ability.perma_bonus`。**跟着这张牌走的永久筹码加成**，
     * 不是本手的临时值——`Hiker` 每次让计分牌 +5，效果留在牌上。
     *
     * `get_chip_bonus` 是 `base.nominal + ability.bonus + perma_bonus`
     * （`card.lua:977`），所以它与强化牌给的 `bonus` 是两笔。
     */
    perma_bonus: number;
    /**
     * `card.config.center` 里的强化 key（`m_bonus` / `m_steel` …），
     * `null` 表示 `c_base`（没强化）。
     *
     * 原作把它摊平进 `self.ability`（`bonus` / `mult` / `Xmult` / `h_x_mult` …），
     * 这里存 key、读的时候查 center——因为**强化是可以被塔罗牌换掉的**
     * （The Magician 把牌变成幸运牌），摊平之后换一次就得把七个字段全重置，
     * 漏一个就留下前一种强化的残值。
     */
    enhancement: string | null;
    /** 目标变换的 x。**tile 单位，不是像素**——见 10 号票 */
    T: { x: number; y: number; w: number; h: number };
};

/** `card.lua:122-134`。10/J/Q/K 的 nominal 都是 10，靠 face_nominal 区分。 */
const VALUE_TABLE: Record<Value, { nominal: number; face_nominal: number; id: number }> = {
    '2': { nominal: 2, face_nominal: 0, id: 2 },
    '3': { nominal: 3, face_nominal: 0, id: 3 },
    '4': { nominal: 4, face_nominal: 0, id: 4 },
    '5': { nominal: 5, face_nominal: 0, id: 5 },
    '6': { nominal: 6, face_nominal: 0, id: 6 },
    '7': { nominal: 7, face_nominal: 0, id: 7 },
    '8': { nominal: 8, face_nominal: 0, id: 8 },
    '9': { nominal: 9, face_nominal: 0, id: 9 },
    '10': { nominal: 10, face_nominal: 0, id: 10 },
    Jack: { nominal: 10, face_nominal: 0.1, id: 11 },
    Queen: { nominal: 10, face_nominal: 0.2, id: 12 },
    King: { nominal: 10, face_nominal: 0.3, id: 13 },
    Ace: { nominal: 11, face_nominal: 0.4, id: 14 },
};

/** `card.lua:139-142`。 */
const SUIT_TABLE: Record<Suit, { suit_nominal: number; suit_nominal_original: number }> = {
    Diamonds: { suit_nominal: 0.01, suit_nominal_original: 0.001 },
    Clubs: { suit_nominal: 0.02, suit_nominal_original: 0.002 },
    Hearts: { suit_nominal: 0.03, suit_nominal_original: 0.003 },
    Spades: { suit_nominal: 0.04, suit_nominal_original: 0.004 },
};

let nextSortId = 1;
let nextUniqueVal = 1;

/** 测试用：把两个全局自增计数器归零，让每个用例从同一状态起跑。 */
export function resetCardCounters(): void {
    nextSortId = 1;
    nextUniqueVal = 1;
}

export function makeCard(key: string, suit: Suit, value: Value): Card {
    const v = VALUE_TABLE[value];
    const s = SUIT_TABLE[suit];

    return {
        key,
        base: {
            suit,
            value,
            nominal: v.nominal,
            face_nominal: v.face_nominal,
            id: v.id,
            suit_nominal: s.suit_nominal,
            suit_nominal_original: s.suit_nominal_original,
        },
        sort_id: nextSortId++,
        unique_val: nextUniqueVal++,
        debuff: false,
        played_this_ante: false,
        forced_selection: false,
        facing: 'front',
        perma_bonus: 0,
        enhancement: null,
        T: { x: 0, y: 0, w: 0, h: 0 },
    };
}

/**
 * `card.lua:958` 的 `get_id`。
 *
 * **石头牌返回一个与任何真实点数都不相等的值**，所以它凑不成对子、顺子、
 * 也不是人头牌。见 `enhancements.ts` 的 `enhancedGetId`。
 */
export function getId(card: Card): number {
    return enhancedGetId(card) ?? card.base.id;
}

/**
 * `card.lua:951`。
 *
 * 这条公式是个**加权排序键**，不是"点数"：
 * `nominal + suit_nominal*mult + suit_nominal_original*0.0001*mult + face_nominal + 0.000001*unique_val`
 *
 * 末项用 `unique_val` 保证任意两张牌的 nominal 严格不等——
 * `get_highest` 靠它做确定性的 tie-break。
 */
export function getNominal(card: Card, mod?: 'suit'): number {
    // `card.lua:954`：**石头牌把 mult 翻成 -1000**，于是它在按 nominal 排序时
    // 永远垫底。`Raised Fist`（找手牌里最低点数的那张）吃这个差别
    const mult = isStone(card) ? -1000 : mod === 'suit' ? 1000 : 1;
    const b = card.base;

    return (
        b.nominal +
        b.suit_nominal * mult +
        b.suit_nominal_original * 0.0001 * mult +
        b.face_nominal +
        0.000001 * card.unique_val
    );
}

/**
 * `card.lua:4072` 的 `Card:is_suit`。
 *
 * 强化会插队：**万能牌认所有花色、石头牌一个都不认**，
 * 都排在 `base.suit` 的比较之前。`Smeared Joker` 是再外面一层，由调用方合并。
 */
export function isSuit(card: Card, suit: Suit): boolean {
    const enhanced = enhancedIsSuit(card, suit);
    if (enhanced !== null) return enhanced;
    return card.base.suit === suit;
}

/** 一副标准 52 张，顺序照 `game.lua:302` 起的 `P_CARDS`（花色外层、点数内层）。 */
export function makeStandardDeck(): Card[] {
    const suits: Suit[] = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    const values: Value[] = [
        '2', '3', '4', '5', '6', '7', '8', '9', '10',
        'Jack', 'Queen', 'King', 'Ace',
    ];
    const letter: Record<Suit, string> = { Clubs: 'C', Diamonds: 'D', Hearts: 'H', Spades: 'S' };
    const vkey: Record<Value, string> = {
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '10': 'T', Jack: 'J', Queen: 'Q', King: 'K', Ace: 'A',
    };

    const deck: Card[] = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push(makeCard(`${letter[suit]}_${vkey[value]}`, suit, value));
        }
    }
    return deck;
}

/**
 * `card.lua:965` 的 `Card:is_face`。
 *
 * 两条直译要点：
 * - **被 debuff 的牌不算人头牌**（除了 Boss 盲注自己查的时候，`from_boss`）。
 *   原文是 `if self.debuff and not from_boss then return end`——返回 nil 而不是 false。
 * - `Pareidolia`（所有牌都算人头牌）是**小丑钩子**，原文用 `find_joker` 现查，
 *   这里提成参数，调用方从小丑区算出来传进来。
 */
export function isFace(card: Card, pareidolia = false, fromBoss = false): boolean {
    if (card.debuff && !fromBoss) return false;
    const id = getId(card);
    return id === 11 || id === 12 || id === 13 || pareidolia;
}
