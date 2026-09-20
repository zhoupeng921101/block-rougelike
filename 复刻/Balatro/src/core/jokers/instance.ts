/**
 * 造一张小丑。直译自 `card.lua:223` `Card:set_ability` 与 `card.lua:369` `Card:set_cost`。
 *
 * 只取小丑用得上的部分：`set_ability` 里的精灵尺寸调整（Half Joker 高度 ÷1.7 等）
 * 属于表现层，`set_cost` 里的版本/优惠券/租赁加价本里程碑没有。
 * 每处省略都在下面注明，不要以为是漏了。
 */

import type { HandName } from '../poker-hands';
import { JOKER_CENTERS } from './centers.generated';
import type { Joker, JokerAbility, JokerCenter } from './types';

/** `copy_table`。`extra` 会被好几张小丑原地改，必须深拷贝，不能共享 center 上那份。 */
function copyExtra<T>(value: T): T {
    if (value === undefined || value === null) return value;
    if (typeof value !== 'object') return value;
    return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * `card.lua:277-296`。
 *
 * **`x_mult` 默认 1 而不是 0**——`calculate_joker` 的泛化判定写的是
 * `x_mult > 1` / `x_mult <= 1`，默认 0 会让所有小丑都掉进倍率分支。
 */
export function makeAbility(center: JokerCenter): JokerAbility {
    const c = center.config;

    return {
        name: center.name,
        effect: center.effect,
        set: 'Joker',
        mult: c.mult ?? 0,
        h_mult: c.h_mult ?? 0,
        h_x_mult: c.h_x_mult ?? 0,
        h_dollars: c.h_dollars ?? 0,
        p_dollars: c.p_dollars ?? 0,
        t_mult: c.t_mult ?? 0,
        t_chips: c.t_chips ?? 0,
        x_mult: c.Xmult ?? 1,
        h_size: c.h_size ?? 0,
        d_size: c.d_size ?? 0,
        extra: copyExtra(c.extra),
        type: (c.type ?? '') as HandName | '',
        order: center.order,
    };
}

/**
 * `card.lua:369` `set_cost` 的小丑分支。
 *
 * 省掉的：`G.GAME.inflation`（Ante 涨价，要 Ante 2+）、版本加价、
 * `discount_percent`（优惠券）、`rental`。本里程碑这些都是 0 / 不存在，
 * 所以 `cost = base_cost`、`sell_cost = max(1, floor(cost/2))`。
 */
export function sellCost(cost: number): number {
    return Math.max(1, Math.floor(cost / 2));
}

/**
 * `card.lua:370` 那条 `math.floor((base_cost + extra_cost + 0.5) * ...)`。
 * 本里程碑 `extra_cost = 0`、`discount_percent = 0`，化简后就是 `base_cost`
 * （`floor(cost + 0.5)` 对整数 cost 恒等于 cost）。留成函数是为了接优惠券时只改这里。
 */
export function buyCost(center: { cost: number }): number {
    return Math.max(1, Math.floor(center.cost + 0.5));
}

export type MakeJokerOptions = {
    /** `To Do List` 在 `set_ability` 里就要抽一个牌型，抽取消费 RNG，所以得传进来 */
    pickToDoHand?: () => HandName;
    /** `Loyalty Card` 要记下创建时的累计出牌数 */
    handsPlayed?: number;
};

export function makeJoker(key: string, options: MakeJokerOptions = {}): Joker {
    const center = JOKER_CENTERS[key];
    if (!center) throw new Error(`没有这张小丑：${key}`);

    const ability = makeAbility(center);

    // `card.lua:311` —— To Do List 创建时就抽定一个牌型。
    // 原作用 `pseudorandom_element(可见牌型, pseudoseed('to_do'))`，
    // 「可见牌型」取决于本局打出过哪些，所以抽取要由调用方给。
    if (ability.name === 'To Do List' && options.pickToDoHand) {
        ability.to_do_poker_hand = options.pickToDoHand();
    }

    // `card.lua:330` 起的 Loyalty Card 分支
    if (ability.name === 'Loyalty Card') {
        ability.hands_played_at_create = options.handsPlayed ?? 0;
        ability.loyalty_remaining = ability.extra.every;
    }

    const cost = buyCost(center);

    return {
        key,
        center,
        ability,
        debuff: false,
        sell_cost: sellCost(cost),
        T: { x: 0, y: 0, w: 0, h: 0 },
    };
}
