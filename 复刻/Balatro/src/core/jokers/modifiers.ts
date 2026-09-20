/**
 * 小丑区对**局面参数**的影响：手牌上限、出牌／弃牌次数、概率、牌型判定的松紧。
 *
 * 这些在原作里散在三处，但都是「小丑一进小丑区就生效、一离开就撤销」的加减：
 * - `card.lua:564` `Card:add_to_deck`（进场时加）与 `:645` `remove_from_deck`（离场时减）
 * - `card.lua:2525` 的 `setting_blind` 分支（`Burglar` 在进盲注时给次数）
 * - `misc_functions.lua` 的 `find_joker` 查询（`Four Fingers` / `Shortcut` / `Smeared Joker`）
 *
 * **复刻件不做「加减」，而是每次需要时从小丑区重算一遍。**
 * 理由：加减要求 add / remove 严格配对，而小丑会被摧毁（Popcorn / Gros Michel /
 * Madness）、被 debuff（Crimson Heart）、被卖掉。任一路径漏了 remove，
 * 手牌上限就会永久跑偏，而那种 bug 只在特定组合下出现、极难复现。
 * 重算是 O(5)，代价可以忽略。
 *
 * **被 debuff 的小丑不算**：`add_to_deck(from_debuff)` 在 debuff 时会走 remove 路径，
 * 所以 debuff 的小丑不提供手牌上限之类的加成。
 */

import type { Suit } from '../card';
import type { JokerFlags } from '../poker-hands';
import type { Joker } from './types';

/** 小丑区给出的局面修正。全部相对基数（`get_starting_params`）。 */
export type RunModifiers = {
    /** 手牌上限的增量 */
    handSize: number;
    /** 出牌次数的增量 */
    hands: number;
    /** 弃牌次数的增量 */
    discards: number;
    /** `G.GAME.probabilities.normal`。`Oops! All 6s` 每张 ×2 */
    probabilityNormal: number;
    /** `G.GAME.interest_amount`。`To the Moon` 每张 +1 */
    interestAmount: number;
    /** 牌型判定的松紧（`Four Fingers` / `Shortcut`） */
    flags: JokerFlags;
    /** `Smeared Joker`：红桃与方块互认、黑桃与梅花互认 */
    smeared: boolean;
    /** `Burglar`：进盲注时把弃牌清零、出牌次数 +3。归 `Round` 执行 */
    burglarHands: number;
};

export const NO_MODIFIERS: RunModifiers = {
    handSize: 0,
    hands: 0,
    discards: 0,
    probabilityNormal: 1,
    interestAmount: 1,
    flags: { fourFingers: false, shortcut: false },
    smeared: false,
    burglarHands: 0,
};

export function runModifiers(jokers: Joker[]): RunModifiers {
    const m: RunModifiers = {
        ...NO_MODIFIERS,
        flags: { fourFingers: false, shortcut: false },
    };

    for (const joker of jokers) {
        if (joker.debuff) continue;
        const a = joker.ability;

        // `card.lua:586-591`：`ability.h_size` / `d_size` 直接来自 config。
        // Juggler（h_size 1）、Drunkard（d_size 1）、Merry Andy（d_size 3 / h_size -1）
        m.handSize += a.h_size;
        m.discards += a.d_size;

        switch (a.name) {
            // `card.lua:623`：手牌上限 +2、出牌次数 **-1**
            case 'Troubadour':
                m.handSize += a.extra.h_size;
                m.hands += a.extra.h_plays;
                break;

            // `card.lua:627`：`change_size(-extra.h_size)`——**是减不是加**
            case 'Stuntman':
                m.handSize -= a.extra.h_size;
                break;

            // `card.lua:608`：把 `probabilities` 里**每一项**都 ×2，所以两张就是 ×4
            case 'Oops! All 6s':
                m.probabilityNormal *= 2;
                break;

            // `card.lua:613`
            case 'To the Moon':
                m.interestAmount += a.extra;
                break;

            // `misc_functions.lua:525` 的 `get_flush`：同花只要 4 张
            case 'Four Fingers':
                m.flags.fourFingers = true;
                break;

            // `misc_functions.lua:551` 的 `get_straight`：顺子允许跳一档
            case 'Shortcut':
                m.flags.shortcut = true;
                break;

            // `card.lua:4075` 的 `is_suit`：红/黑两色内部互认
            case 'Smeared Joker':
                m.smeared = true;
                break;

            // `card.lua:2525`：进盲注时 `ease_discard(-discards_left)` + `ease_hands_played(+3)`
            case 'Burglar':
                m.burglarHands += a.extra;
                break;
        }
    }

    return m;
}

/**
 * `card.lua:4067` 的 `Card:is_suit` 里那条 `Smeared Joker` 分支。
 *
 * ```lua
 * if next(find_joker('Smeared Joker')) and
 *    (self.base.suit == 'Hearts' or self.base.suit == 'Diamonds') ==
 *    (suit == 'Hearts' or suit == 'Diamonds') then return true end
 * ```
 *
 * 判的是**「两者是否同为红色」**，不是「花色相同」——所以红桃认方块、
 * 黑桃认梅花，而红桃不认黑桃。那个 `==` 两边都是布尔值，很容易读成花色比较。
 */
export function smearedMatches(cardSuit: Suit, wanted: Suit): boolean {
    const red = (s: Suit) => s === 'Hearts' || s === 'Diamonds';
    return red(cardSuit) === red(wanted);
}
