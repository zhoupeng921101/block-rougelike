/**
 * `eval_card`。直译自 `参考/产物/Balatro_1.0.1o/源码/functions/common_events.lua:583-655`。
 *
 * 它是**扑克牌与小丑的统一入口**：同一个函数，靠 `context.cardarea` 决定读哪几个
 * getter。`evaluate_play` 从不直接调 `calculate_joker`（除了逐张型那两处），
 * 都走这里，所以这一层的字段名（`chips` / `mult` / `jokers` / `seals`）
 * 就是结算循环消费的字段名，不能改。
 */

import type { Card } from '../card';
import { type EditionEffect, getEdition } from '../editions';
import {
    getChipBonus as enhancedChipBonus,
    getChipHMult,
    getChipHXMult,
    getChipMult,
    getChipXMult,
    getPDollars,
} from '../enhancements';
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
    /** `card.lua:1016` 的 `get_edition`。**扑克牌身上的版本走这里** */
    edition?: EditionEffect;
};

/**
 * `card.lua:977` 的 `get_chip_bonus`。实现在 `core/enhancements.ts`——
 * 石头牌那一支要读强化 center，而 `enhancements.ts` 才是放这些分支的地方。
 * 这里只转发，保住历史上的导出位置。
 */
export const getChipBonus = enhancedChipBonus;

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
            // **四个 getter 的顺序就是原文的顺序**（`common_events.lua:596-613`），
            // 而 `get_chip_mult` 与 `get_p_dollars` 在幸运牌上各消费一次 RNG
            // （`lucky_mult` / `lucky_money`，两个独立 key，无条件掷）。
            // 调换它们 = 同 seed 从这一手起分叉
            const chips = getChipBonus(target);
            if (chips > 0) ret.chips = chips;

            const mult = getChipMult(target, game);
            if (mult > 0) ret.mult = mult;

            const xMult = getChipXMult(target);
            if (xMult > 0) ret.x_mult = xMult;

            const pDollars = getPDollars(target, game);
            if (pDollars > 0) ret.p_dollars = pDollars;

            // `common_events.lua:621`：牌面本身的版本。**排在最后**
            const edition = getEdition(target);
            if (edition) ret.edition = edition;
        } else {
            const jokers = calculateJoker(target, context, game);
            if (jokers) ret.jokers = jokers;
        }
    }

    if (context.cardarea === 'hand') {
        if (!isJoker(target)) {
            const hMult = getChipHMult(target);
            if (hMult > 0) ret.h_mult = hMult;

            // **注意字段名**：`get_chip_h_x_mult` 的结果写进 `ret.x_mult`，
            // 不是 `h_x_mult`（`common_events.lua:634`）。钢铁牌的 ×1.5 走这条
            const hXMult = getChipHXMult(target);
            if (hXMult > 0) ret.x_mult = hXMult;
        } else {
            const jokers = calculateJoker(target, context, game);
            if (jokers) ret.jokers = jokers;
        }
    }

    if (context.cardarea === 'jokers') {
        // `common_events.lua:645`。版本（edition）本里程碑没有，
        // 所以 `context.edition` 恒返回空；`other_joker` 分支要转调**那一张**
        let jokers: JokerEffect | null = null;
        if (context.edition) {
            // `common_events.lua:648`：`context.edition` 时问的是 `get_edition`，
            // 不是 `calculate_joker`。**小丑身上的版本走这一支**
            const e = isJoker(target) ? getEdition(target) : null;
            jokers = e
                ? { chip_mod: e.chip_mod, mult_mod: e.mult_mod, Xmult_mod: e.x_mult_mod }
                : null;
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
