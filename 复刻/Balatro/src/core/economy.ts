/**
 * 经济层。直译自
 * `参考/产物/Balatro_1.0.1o/源码/functions/state_events.lua:1156` 的
 * `G.FUNCS.evaluate_round`，与 `card.lua:1657` 的 `Card:calculate_dollar_bonus`。
 *
 * ## 收益的顺序是语义
 *
 * `evaluate_round` 里加钱的顺序是：**盲注基础 → 剩余出牌 → 剩余弃牌 → 小丑 → 标签 → 利息**。
 * 利息**排在最后**，而它读的是 `G.GAME.dollars`——也就是**本回合收益还没入账之前**
 * 的余额。所以「打完这一关多赚的钱」不参与这一关的利息。
 * 把利息挪到前面或者用「加完之后的余额」算，都会多给钱。
 *
 * ## 上限
 *
 * `interest_cap = 25`、`interest_amount = 1`（`game.lua:2119`），
 * 公式是 `interest_amount * min(floor(dollars/5), interest_cap/5)`——
 * 即每 5 块 +1，**最多 +5**。
 */

import type { Joker } from './jokers';

/** `game.lua:2119-2120`。 */
export const INTEREST_CAP = 25;
export const INTEREST_AMOUNT = 1;

/** 收益的一行。表现层逐行滚出来，所以要保留行的身份而不只是总额。 */
export type PayoutRow = {
    kind: 'blind' | 'hands' | 'discards' | 'joker' | 'interest';
    dollars: number;
    /** `hands` / `discards` 行显示的「×N」 */
    count?: number;
    joker?: Joker;
};

export type Payout = {
    rows: PayoutRow[];
    total: number;
};

/**
 * `card.lua:1657` 的 `Card:calculate_dollar_bonus`。
 *
 * 本里程碑能实现的：`Golden Joker`（固定 $4）、
 * `Delayed Gratification`（本回合一次弃牌都没用过 → 每点剩余弃牌 $2）。
 * `Cloud 9` / `Rocket` / `Satellite` 要九号牌统计 / 跳过盲注 / 星球牌，都不在范围。
 */
export function calculateDollarBonus(
    joker: Joker,
    round: {
        discardsUsed: number;
        discardsLeft: number;
        /** 整副牌里有几张 9。`Cloud 9` 读它（由 `refreshDerivedAbilities` 算好） */
        nineTally?: number;
        /** 用过**几种**星球。`Satellite` 读它 */
        distinctPlanets?: number;
    },
): number | null {
    if (joker.debuff) return null;

    switch (joker.ability.name) {
        case 'Golden Joker':
            return joker.ability.extra;

        // `card.lua:1663`：整副牌里每张 9 给 $1。**一张都没有时返回 nil**，
        // 不是返回 0——收益明细里那一行根本不出现
        case 'Cloud 9': {
            const nines = joker.ability.nine_tally ?? 0;
            if (nines <= 0) return null;
            return joker.ability.extra * nines;
        }

        // `card.lua:1669`：用过**几种**星球（不算重复）× $1。同样是 0 就不出行
        case 'Satellite': {
            const planets = round.distinctPlanets ?? 0;
            if (planets === 0) return null;
            return joker.ability.extra * planets;
        }

        // `card.lua:1677`：**两个条件都要**——一次没用过 **且** 还剩弃牌
        case 'Delayed Gratification':
            if (round.discardsUsed === 0 && round.discardsLeft > 0) {
                return round.discardsLeft * joker.ability.extra;
            }
            return null;

        default:
            return null;
    }
}

export type RoundResult = {
    /** 过关没有。没过关时盲注基础收益是 0，但其余各行照算 */
    won: boolean;
    blindDollars: number;
    handsLeft: number;
    discardsLeft: number;
    discardsUsed: number;
    /** 结算前的余额。利息读的是这个值，不是加完之后的 */
    dollars: number;
    jokers: Joker[];
    /**
     * `G.GAME.interest_amount`。基线 1，**每张 `To the Moon` +1**
     * （`card.lua:613`）。所以利息不是「每 5 块 +1」的常量，
     * 上限也跟着变：`interest_amount * (interest_cap / 5)`。
     */
    interestAmount?: number;
    /** 本局用过**几种**星球（不算重复）。`Satellite` 读它 */
    distinctPlanets?: number;
};

/**
 * `state_events.lua:1156` 的 `evaluate_round`。
 *
 * 省掉的行：`money_per_discard`（只有某些挑战给）、标签（不在本里程碑）、
 * 牌背的 `eval` 钩子（18 个牌组里只有几个用）。
 */
export function evaluateRound(result: RoundResult): Payout {
    const rows: PayoutRow[] = [];
    let total = 0;

    // `state_events.lua:1160`：**没过关这一行是 0**，但仍然是一行（原作显示 "saved"）
    const blind = result.won ? result.blindDollars : 0;
    rows.push({ kind: 'blind', dollars: blind });
    total += blind;

    // `state_events.lua:1186`：`money_per_hand` 默认 1
    if (result.handsLeft > 0) {
        rows.push({ kind: 'hands', dollars: result.handsLeft, count: result.handsLeft });
        total += result.handsLeft;
    }

    // `state_events.lua:1191`：`money_per_discard` 默认 **nil**，所以这一行默认不出现。
    // 留着是为了接挑战模式时有落点。

    // `state_events.lua:1195`
    for (const joker of result.jokers) {
        const bonus = calculateDollarBonus(joker, result);
        if (bonus === null) continue;
        rows.push({ kind: 'joker', dollars: bonus, joker });
        total += bonus;
    }

    // `state_events.lua:1211`：**最后一行，且读的是结算前的余额**
    if (result.dollars >= 5) {
        const amount = result.interestAmount ?? INTEREST_AMOUNT;
        const interest = amount * Math.min(Math.floor(result.dollars / 5), INTEREST_CAP / 5);
        rows.push({ kind: 'interest', dollars: interest });
        total += interest;
    }

    return { rows, total };
}
