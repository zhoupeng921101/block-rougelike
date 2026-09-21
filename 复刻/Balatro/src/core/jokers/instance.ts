/**
 * 造一张小丑。直译自 `card.lua:223` `Card:set_ability` 与 `card.lua:369` `Card:set_cost`。
 *
 * 只取小丑用得上的部分：`set_ability` 里的精灵尺寸调整（Half Joker 高度 ÷1.7 等）
 * 属于表现层；`set_cost` 见 `setCost`。每处省略都在下面注明，不要以为是漏了。
 */

import { type Edition, editionExtraCost } from '../editions';
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
 * `card.lua:382` 那条 `max(1, floor(cost/2))`，不含 `extra_value`。
 * 完整的定价见 `setCost`。
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

/** `setCost` 要读写的那几个字段。小丑与消耗品都有 */
export type Priced = {
    center: { cost: number };
    edition?: Edition;
    cost: number;
    sell_cost: number;
    extra_value?: number;
};

/**
 * `card.lua:369` 的 `Card:set_cost`：**从头重算**买价与卖价。
 *
 * ```lua
 * self.extra_cost = 0 + G.GAME.inflation + 版本加价
 * self.cost = max(1, floor((base_cost + extra_cost + 0.5) * (100 - discount_percent) / 100))
 * self.sell_cost = max(1, floor(cost / 2)) + (ability.extra_value or 0)
 * ```
 *
 * **原作在这几处调它**：造卡、`set_edition`、`set_seal`（所以 `copy_card` 末尾总会重算）、
 * Egg / Gift Card 加 `extra_value` 之后。复刻件在同样的位置调——
 * **漏调一处，那张卡的价格就停在旧版本上**（带 Negative 的小丑少卖 $2 这类）。
 *
 * 省掉的：`inflation`（只有挑战模式有）、`discount_percent`（优惠券）、`rental`、`couponed`。
 * Astronomer 的免费在 `shop.ts` 的 `shopCost` 里。
 */
export function setCost(card: Priced): void {
    card.cost = Math.max(1, Math.floor(card.center.cost + editionExtraCost(card.edition) + 0.5));
    card.sell_cost = sellCost(card.cost) + (card.extra_value ?? 0);
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

    // `card.lua:308` / `:324` / `:327`：三张在 `set_ability` 里挂自己的计数器
    if (ability.name === 'Invisible Joker') ability.invis_rounds = 0;
    if (ability.name === 'Caino') ability.caino_xmult = 1;
    if (ability.name === 'Yorick') ability.yorick_discards = ability.extra.discards;

    // `card.lua:330` 起的 Loyalty Card 分支
    if (ability.name === 'Loyalty Card') {
        ability.hands_played_at_create = options.handsPlayed ?? 0;
        ability.loyalty_remaining = ability.extra.every;
    }

    const joker: Joker = {
        key,
        center,
        ability,
        debuff: false,
        cost: 0,
        sell_cost: 0,
        T: { x: 0, y: 0, w: 0, h: 0 },
    };
    setCost(joker);
    return joker;
}
