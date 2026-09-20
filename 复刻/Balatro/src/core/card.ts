/**
 * 扑克牌模型。直译自 `参考/产物/Balatro_1.0.1o/源码/card.lua:113-145` 的 `Card:set_base`。
 *
 * 保留原作的字段名（`nominal` / `suit_nominal` / `face_nominal` / `id`），
 * 不改成更"合理"的命名——它们会被 `get_nominal()` 的那条加权公式直接用到，
 * 改名之后对不上原文，校对成本反而更高。见 03 号票的直译裁定。
 */

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
        T: { x: 0, y: 0, w: 0, h: 0 },
    };
}

/** `card.lua:958`。石头牌那条分支本切片没有，留到实现强化牌时补。 */
export function getId(card: Card): number {
    return card.base.id;
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
    const mult = mod === 'suit' ? 1000 : 1;
    const b = card.base;

    return (
        b.nominal +
        b.suit_nominal * mult +
        b.suit_nominal_original * 0.0001 * mult +
        b.face_nominal +
        0.000001 * card.unique_val
    );
}

/** `card.lua` 的 `Card:is_suit`。本切片没有万能牌与石头牌，只比花色。 */
export function isSuit(card: Card, suit: Suit): boolean {
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
