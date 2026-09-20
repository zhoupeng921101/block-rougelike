/**
 * `eval_card`。直译自 `参考/产物/Balatro_1.0.1o/源码/functions/common_events.lua:583-655`。
 *
 * 它是**扑克牌与小丑的统一入口**：同一个函数，靠 `context.cardarea` 决定读哪几个
 * getter。`evaluate_play` 从不直接调 `calculate_joker`（除了逐张型那两处），
 * 都走这里，所以这一层的字段名（`chips` / `mult` / `jokers` / `seals`）
 * 就是结算循环消费的字段名，不能改。
 */

import type { Card } from '../card';
import { calculateJoker } from './calculate';
import type { GameView, Joker, JokerContext, JokerEffect } from './types';

/**
 * `eval_card` 的返回形状。
 *
 * 原文返回一张 Lua 表，键是 `chips` / `mult` / `x_mult` / `p_dollars` /
 * `h_mult` / `jokers` / `seals` / `edition`。这里保持同名——
 * `jokers` 这个键名尤其别改成 `joker`，`if effects.jokers then` 在原文出现 11 次。
 */
export type EvalResult = {
    chips?: number;
    mult?: number;
    x_mult?: number;
    p_dollars?: number;
    h_mult?: number;
    jokers?: JokerEffect;
    seals?: JokerEffect;
};

/** `card.lua:977` `get_chip_bonus`。石头牌本里程碑没有，只剩 nominal + bonus。 */
export function getChipBonus(card: Card): number {
    if (card.debuff) return 0;
    return card.base.nominal;
}

/**
 * 目标是小丑还是扑克牌。
 *
 * **这不是 TS 的洁癖，是原文的语义**：`Card:calculate_joker` 的函数体只处理
 * `ability.set == "Planet"` 与 `== "Joker"` 两种，扑克牌进去必然返回 nil。
 * 所以 `cardarea == 'play'` 那条 `card:calculate_joker(context)` 对扑克牌是空转。
 */
function isJoker(target: Card | Joker): target is Joker {
    return (target as Joker).ability?.set === 'Joker';
}

/**
 * `common_events.lua:583`。
 *
 * `target` 既可能是扑克牌也可能是小丑——原文一个函数吃两种。
 * TS 里拆成两个重载会更漂亮，但那会掩盖一件事：
 * **`cardarea` 才是分派依据，不是对象类型**。同一张小丑在 `cardarea == 'jokers'`
 * 与 `cardarea == 'play'` 下走完全不同的分支。
 */
export function evalCard(
    target: Card | Joker,
    context: JokerContext,
    game: GameView,
): EvalResult {
    const ret: EvalResult = {};

    // `common_events.lua:587`。蜡封本里程碑没有，这条恒返回空表
    if (context.repetition_only) return ret;

    if (context.cardarea === 'play') {
        // **小丑也会带 `cardarea: 'play'` 进来**——重复触发那一问
        // （`state_events.lua:697`）就是拿小丑问 `cardarea = G.play`。
        // 原文对它照样跑 `get_chip_bonus`，但小丑的 `base` 来自 `P_CARDS.empty`，
        // `set_base` 匹配不到任何点数，`nominal` 停在 0，所以 `chips > 0` 不成立、
        // `ret.chips` 不会被写。这里用 isJoker 跳过，结果与原文一致。
        if (!isJoker(target)) {
            const chips = getChipBonus(target);
            if (chips > 0) ret.chips = chips;

            // `get_chip_mult` / `get_chip_x_mult` / `get_p_dollars` 都要强化牌才非零，
            // 本里程碑恒 0。留着这条注释是为了接强化牌时不用回头找位置。
        } else {
            const jokers = calculateJoker(target, context, game);
            if (jokers) ret.jokers = jokers;
        }
    }

    if (context.cardarea === 'hand') {
        // `get_chip_h_mult` / `get_chip_h_x_mult` 同上，要钢铁牌才非零
        if (isJoker(target)) {
            const jokers = calculateJoker(target, context, game);
            if (jokers) ret.jokers = jokers;
        }
    }

    if (context.cardarea === 'jokers') {
        // `common_events.lua:645`。版本（edition）本里程碑没有，
        // 所以 `context.edition` 恒返回空；`other_joker` 分支要转调**那一张**
        let jokers: JokerEffect | null = null;
        if (context.edition) {
            jokers = null;
        } else if (context.other_joker) {
            jokers = calculateJoker(context.other_joker, context, game);
        } else if (isJoker(target)) {
            jokers = calculateJoker(target, context, game);
        }
        if (jokers) ret.jokers = jokers;
    }

    return ret;
}

/** `misc_functions.lua` 的 `find_joker(name)`。被 debuff 的不算。 */
export function findJoker(jokers: Joker[], name: string): Joker[] {
    return jokers.filter((j) => !j.debuff && j.ability.name === name);
}
