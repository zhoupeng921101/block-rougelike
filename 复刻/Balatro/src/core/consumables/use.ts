/**
 * 用掉一张消耗品。`card.lua:1092` 的 `Card:use_consumeable`。
 *
 * ## 覆盖面要算出来，不要手写
 *
 * 与小丑那边同一条纪律（`jokers/calculate.ts` 的 `isJokerImplemented`）：
 * `isConsumableImplemented` 从 `HANDLERS` 这张表算，不维护第二份名单。
 * 手写的名单会漂，而且漂的方向更糟——把一张什么也不做的卡报成已实现。
 *
 * 商店按设计从全池生成（池子内容影响 RNG，不能裁），所以玩家会买到
 * 还没实现的塔罗。**那一格必须标出来**，理由见 `jokers/coverage.test.ts`。
 *
 * ## `delay` 仍然压成 0
 *
 * 09 号票列的 5 处「带 delay 的消耗品 RNG 消费」里，本切片只命中
 * `card.lua:1472` 的 The Wheel of Fortune，而它那三次掷点共用
 * `wheel_of_fortune` 一个 key、在一次 `use_consumeable` 里严格 FIFO。
 * 所以不需要虚拟时钟。**接补充包（17 号票）时要重新核这一条。**
 */

import { type HandInfo, type HandName, levelUpHand } from '../scoring';
import { CONSUMABLE_CENTERS, CONSUMABLE_KEYS_BY_SET } from './centers.generated';
import type { Consumable, ConsumableSet, PlanetConfig } from './types';

/**
 * `G.GAME.consumeable_usage` + `consumeable_usage_total`
 * （`misc_functions.lua:1192` 的 `set_consumeable_usage`）。
 *
 * **两个都要**，它们喂不同的小丑：
 * - `Fortune Teller` 读 `total.tarot`（用过几张塔罗，**算重复**）
 * - `Satellite` 读 `byKey` 里 set 是 Planet 的**条目数**（用过几种星球，**不算重复**）
 */
export type ConsumableUsage = {
    byKey: Map<string, { count: number; set: ConsumableSet }>;
    total: { tarot: number; planet: number; tarot_planet: number; all: number };
};

export function makeConsumableUsage(): ConsumableUsage {
    return { byKey: new Map(), total: { tarot: 0, planet: 0, tarot_planet: 0, all: 0 } };
}

/** `misc_functions.lua:1192`。**用掉的那一刻记，不管卡有没有真的产生效果。** */
export function recordConsumableUsage(usage: ConsumableUsage, consumable: Consumable): void {
    const { key, center } = consumable;
    const entry = usage.byKey.get(key);
    if (entry) entry.count++;
    else usage.byKey.set(key, { count: 1, set: center.set });

    if (center.set === 'Tarot') {
        usage.total.tarot++;
        usage.total.tarot_planet++;
    } else {
        usage.total.planet++;
        usage.total.tarot_planet++;
    }
    usage.total.all++;
}

/** `Satellite` 要的那个数：用过**几种**星球。 */
export function distinctPlanetsUsed(usage: ConsumableUsage): number {
    let n = 0;
    for (const entry of usage.byKey.values()) if (entry.set === 'Planet') n++;
    return n;
}

/** 用一张消耗品要读写的东西。塔罗进来时会长（手牌、小丑区、钱） */
export type UseContext = {
    hands: Record<HandName, HandInfo>;
};

export type ConsumableHandler = (consumable: Consumable, ctx: UseContext) => void;

/**
 * 12 张星球牌。`card.lua:1266` 的
 * `if self.ability.consumeable.hand_type then level_up_hand(...) end`——
 * 一条判定管 12 张，靠 center 的 `config.hand_type` 分流。
 *
 * **这张表是循环建出来的，不是手抄 12 行**：手抄会漏、会和生成器漂开，
 * 而漏掉的那张会变成「买得到、用了什么也不发生」。
 */
const PLANET_HANDLERS: Record<string, ConsumableHandler> = Object.fromEntries(
    CONSUMABLE_KEYS_BY_SET.Planet.map((key) => [
        key,
        ((consumable, ctx) => {
            const config = consumable.center.config as PlanetConfig;
            levelUpHand(ctx.hands, config.hand_type);
        }) satisfies ConsumableHandler,
    ]),
);

/**
 * 有行为的消耗品。**塔罗那 22 张还没进来**（16 号票的第 6 步），
 * 所以现在是 12 / 34。
 */
export const CONSUMABLE_HANDLERS: Record<string, ConsumableHandler> = {
    ...PLANET_HANDLERS,
};

/** 这张卡用了会不会真的发生点什么。**从 `CONSUMABLE_HANDLERS` 算，别手写名单。** */
export function isConsumableImplemented(key: string): boolean {
    return key in CONSUMABLE_HANDLERS;
}

/** 还没实现的那些，按 order 排。`⚠未实现` 标记与覆盖面测试读它 */
export function unimplementedConsumables(): string[] {
    return [...CONSUMABLE_KEYS_BY_SET.Tarot, ...CONSUMABLE_KEYS_BY_SET.Planet].filter(
        (key) => !isConsumableImplemented(key),
    );
}

/**
 * 用掉一张。**没有 handler 就抛**——与 Boss 的 `assertImplemented` 同一条理由：
 * 静默放过等于把「买了什么也不发生」伪装成正常行为。
 * 调用方（`Run.useConsumable`）先查 `isConsumableImplemented` 再调。
 */
export function applyConsumable(consumable: Consumable, ctx: UseContext): void {
    const handler = CONSUMABLE_HANDLERS[consumable.key];
    if (!handler) {
        throw new Error(
            `${CONSUMABLE_CENTERS[consumable.key]?.name ?? consumable.key} 还没有实现行为`,
        );
    }
    handler(consumable, ctx);
}
