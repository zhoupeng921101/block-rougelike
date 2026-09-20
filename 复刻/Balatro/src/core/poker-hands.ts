/**
 * 牌型判定。直译自 `参考/产物/Balatro_1.0.1o/源码/functions/misc_functions.lua:379-623`
 * 的 `evaluate_poker_hand` 与四个辅助函数。
 *
 * 直译意味着保留原作的控制流与判定顺序，包括那些看起来冗余的地方——
 * 比如 `results` 里每种牌型都先置空表、再逐个填、`top` 只在第一次命中时写入。
 * 顺序就是优先级，改写成 "找最高牌型" 的查表会丢掉这个语义。
 */

import { type Card, type Suit, getId, getNominal, isSuit } from './card';

export type HandName =
    | 'Flush Five' | 'Flush House' | 'Five of a Kind' | 'Straight Flush'
    | 'Four of a Kind' | 'Full House' | 'Flush' | 'Straight'
    | 'Three of a Kind' | 'Two Pair' | 'Pair' | 'High Card';

/** 与原作的 `results` 同构：每种牌型 → 若干组牌；`top` 指向命中的最高牌型那一组。 */
export type HandResults = {
    parts: Record<HandName, Card[][]>;
    top: Card[][] | null;
    /** `top` 对应的牌型名。原作靠 `evaluate_play` 回头找，这里顺手记下来。 */
    topName: HandName | null;
};

/**
 * 小丑钩子。第一个切片没有小丑，恒返回 false。
 *
 * `get_flush` 与 `get_straight` 会查 `Four Fingers`（同花/顺子只要 4 张）
 * 与 `Shortcut`（顺子允许跳一档）。留成参数而不是写死，
 * 是为了第二个里程碑接小丑时不用回来改这两个函数。
 */
export type JokerFlags = {
    fourFingers: boolean;
    shortcut: boolean;
};

export const NO_JOKERS: JokerFlags = { fourFingers: false, shortcut: false };

/** `misc_functions.lua:525`。 */
export function getFlush(hand: Card[], jokers: JokerFlags = NO_JOKERS): Card[][] {
    const need = 5 - (jokers.fourFingers ? 1 : 0);
    if (hand.length > 5 || hand.length < need) return [];

    // 花色的遍历顺序照抄原作，别改——它决定了多花色并存时返回哪一组
    const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];

    for (const suit of suits) {
        const t = hand.filter((c) => isSuit(c, suit));
        if (t.length >= need) return [t];
    }
    return [];
}

/** `misc_functions.lua:551`。 */
export function getStraight(hand: Card[], jokers: JokerFlags = NO_JOKERS): Card[][] {
    const need = 5 - (jokers.fourFingers ? 1 : 0);
    if (hand.length > 5 || hand.length < need) return [];

    const t: Card[] = [];
    const IDS = new Map<number, Card[]>();

    for (const card of hand) {
        const id = getId(card);
        if (id > 1 && id < 15) {
            const bucket = IDS.get(id);
            if (bucket) bucket.push(card);
            else IDS.set(id, [card]);
        }
    }

    let straightLength = 0;
    let straight = false;
    let skippedRank = false;

    // j=1 查的是 A（14），这是 A-2-3-4-5 低顺子成立的原因
    for (let j = 1; j <= 14; j++) {
        const bucket = IDS.get(j === 1 ? 14 : j);

        if (bucket) {
            straightLength++;
            skippedRank = false;
            for (const v of bucket) t.push(v);
        } else if (jokers.shortcut && !skippedRank && j !== 14) {
            skippedRank = true;
        } else {
            straightLength = 0;
            skippedRank = false;
            if (!straight) t.length = 0;
            if (straight) break;
        }

        if (straightLength >= need) straight = true;
    }

    if (!straight) return [];
    return [t];
}

/**
 * `misc_functions.lua:595`。
 *
 * 原作从 `#hand` 倒着扫，把每个点数的那一组写进 `vals[id]`，
 * 再从 `#vals` 倒着收集——**所以返回的组按点数从高到低**。
 * 这个顺序被 `Two Pair` 与 `Full House` 的拼装依赖着，不能改成正序。
 */
export function getXSame(num: number, hand: Card[]): Card[][] {
    const vals: Card[][] = Array.from({ length: 14 }, () => []);

    for (let i = hand.length - 1; i >= 0; i--) {
        const curr: Card[] = [hand[i]];
        for (let j = 0; j < hand.length; j++) {
            if (getId(hand[i]) === getId(hand[j]) && i !== j) curr.push(hand[j]);
        }
        if (curr.length === num) vals[getId(curr[0]) - 1] = curr;
    }

    const ret: Card[][] = [];
    for (let i = vals.length - 1; i >= 0; i--) {
        if (vals[i].length > 0) ret.push(vals[i]);
    }
    return ret;
}

/** `misc_functions.lua:616`。tie-break 靠 `getNominal` 末项的 `unique_val`。 */
export function getHighest(hand: Card[]): Card[][] {
    if (hand.length === 0) return [];

    let highest = hand[0];
    for (const v of hand) {
        if (getNominal(v) > getNominal(highest)) highest = v;
    }
    return [[highest]];
}

const EMPTY_RESULTS = (): Record<HandName, Card[][]> => ({
    'Flush Five': [], 'Flush House': [], 'Five of a Kind': [], 'Straight Flush': [],
    'Four of a Kind': [], 'Full House': [], Flush: [], Straight: [],
    'Three of a Kind': [], 'Two Pair': [], Pair: [], 'High Card': [],
});

/** `misc_functions.lua:379`。判定顺序即优先级。 */
export function evaluatePokerHand(hand: Card[], jokers: JokerFlags = NO_JOKERS): HandResults {
    const results = EMPTY_RESULTS();
    let top: Card[][] | null = null;
    let topName: HandName | null = null;

    const setTop = (name: HandName) => {
        if (!top) {
            top = results[name];
            topName = name;
        }
    };

    const parts = {
        _5: getXSame(5, hand),
        _4: getXSame(4, hand),
        _3: getXSame(3, hand),
        _2: getXSame(2, hand),
        _flush: getFlush(hand, jokers),
        _straight: getStraight(hand, jokers),
        _highest: getHighest(hand),
    };

    if (parts._5.length && parts._flush.length) {
        results['Flush Five'] = parts._5;
        setTop('Flush Five');
    }

    if (parts._3.length && parts._2.length && parts._flush.length) {
        results['Flush House'] = [[...parts._3[0], ...parts._2[0]]];
        setTop('Flush House');
    }

    if (parts._5.length) {
        results['Five of a Kind'] = parts._5;
        setTop('Five of a Kind');
    }

    if (parts._flush.length && parts._straight.length) {
        // 同花的那组打底，再把顺子里不在同花组中的补上
        const ret = [...parts._flush[0]];
        for (const v of parts._straight[0]) {
            if (!parts._flush[0].includes(v)) ret.push(v);
        }
        results['Straight Flush'] = [ret];
        setTop('Straight Flush');
    }

    if (parts._4.length) {
        results['Four of a Kind'] = parts._4;
        setTop('Four of a Kind');
    }

    if (parts._3.length && parts._2.length) {
        results['Full House'] = [[...parts._3[0], ...parts._2[0]]];
        setTop('Full House');
    }

    if (parts._flush.length) {
        results.Flush = parts._flush;
        setTop('Flush');
    }

    if (parts._straight.length) {
        results.Straight = parts._straight;
        setTop('Straight');
    }

    if (parts._3.length) {
        results['Three of a Kind'] = parts._3;
        setTop('Three of a Kind');
    }

    if (parts._2.length === 2 || (parts._3.length === 1 && parts._2.length === 1)) {
        const a = parts._2[0];
        const b = parts._2[1] ?? parts._3[0];
        results['Two Pair'] = [[...a, ...b]];
        setTop('Two Pair');
    }

    if (parts._2.length) {
        results.Pair = parts._2;
        setTop('Pair');
    }

    if (parts._highest.length) {
        results['High Card'] = parts._highest;
        setTop('High Card');
    }

    // 原作末尾的降级填充。注意切的是**组**不是牌：
    // `{results["Five of a Kind"][1], [2], [3], [4]}` 取的是前 4 个组，
    // 而 5 张手牌下 `get_X_same(5, ...)` 最多返回 1 组，
    // 所以实际效果是「把那一组原样也登记成 Four of a Kind」。
    // 小丑会读这些降级结果，不能省。
    if (results['Five of a Kind'][0]) {
        results['Four of a Kind'] = parts._5.slice(0, 4);
    }
    if (results['Four of a Kind'][0]) {
        results['Three of a Kind'] = results['Four of a Kind'].slice(0, 3);
    }
    if (results['Three of a Kind'][0]) {
        results.Pair = results['Three of a Kind'].slice(0, 2);
    }

    return { parts: results, top, topName };
}
