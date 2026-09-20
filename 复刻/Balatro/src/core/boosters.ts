/**
 * 补充包。直译自 `参考/产物/Balatro_1.0.1o/源码/`：
 * - `functions/common_events.lua:1983` `get_pack`（抽哪个包）
 * - `card.lua:1682` `Card:open`（开包，造里面的牌）
 * - `game.lua:3507` 商店第三、四格的填充
 *
 * ## 补充包是商店的第三、四格
 *
 * `G.shop_booster` 的 `card_limit = 2`，**两格**，生成在小丑那两格**之后**
 * （`game.lua:3473` 小丑 → `:3487` 优惠券 → `:3507` 补充包）。
 * 每格消费一次 `pseudoseed('shop_pack'..ante)`。
 *
 * **但第一个商店只消费一次。** `get_pack` 开头有一条提前 return：
 * 新档的第一个商店，第一格恒是小丑包，而且那一次**不掷点**。
 *
 * **补充包不参与重掷**：`reroll_shop` 只清 `G.shop_jokers`。
 *
 * ## 权重和是 22.420000000000005，不是 22.42
 *
 * 原文是 `for k, v in ipairs(pool) do cume = cume + (v.weight or 1) end`，
 * 按 `order` 序逐个累加双精度。0.25 / 0.3 / 0.07 / 0.6 / 0.15 这几个数
 * 在二进制里都不精确，累加出来带尾差。**这里必须按同一个顺序累加**——
 * 写成 22.42 会让贴着边界的那次掷点落进不同的桶。
 */

import { BOOSTER_CENTERS, BOOSTER_KEYS_BY_ORDER } from './boosters.generated';
import type { PseudorandomState } from './rng';

export { BOOSTER_CENTERS, BOOSTER_KEYS_BY_ORDER };

/** 五种口味。`Card:open` 靠 `name:find(kind)` 分流，这里直接存 kind */
export type BoosterKind = 'Arcana' | 'Celestial' | 'Standard' | 'Buffoon' | 'Spectral';

/** `P_CENTERS` 里 `set = "Booster"` 的一行。由生成器产出，运行时只读 */
export type BoosterCenter = {
    order: number;
    name: string;
    kind: BoosterKind;
    cost: number;
    /** `get_pack` 的累积权重 */
    weight: number;
    /** `BOOSTER_ATLAS`（`boosters.png`）里的格子坐标 */
    pos: { x: number; y: number };
    /** `config.extra`：包里几张 */
    extra: number;
    /** `config.choose`：能挑几张 */
    choose: number;
};

/**
 * 32 个权重之和。**按 `order` 序累加**，与原文 `ipairs(pool)` 一致。
 * 实际值是 `22.420000000000005`——尾差是故意的，见文件头。
 */
export const BOOSTER_WEIGHT_TOTAL: number = BOOSTER_KEYS_BY_ORDER.reduce(
    (n, key) => n + BOOSTER_CENTERS[key].weight,
    0,
);

/** 商店里的补充包格子数。`G.shop_booster` 的 `card_limit`（`UI_definitions.lua:694`） */
export const SHOP_BOOSTER_MAX = 2;

/** `get_pack` 要查的那点状态 */
export type PackContext = {
    ante: number;
    /**
     * `G.GAME.first_shop_buffoon`。**新档的第一个商店，第一格恒是小丑包**，
     * 而且那一格**不消费 `shop_pack<ante>`**（提前 return）。
     * 调用方在走过那条路之后要把它置真。
     */
    firstShopBuffoon: boolean;
};

/**
 * `common_events.lua:1983` 的 `get_pack`，省掉 `banned_keys`（挑战模式）
 * 与 `_type` 过滤（只有标签用，不在范围）。
 *
 * 返回 `[center key, 有没有消费 RNG]`——调用方要知道第二个值，
 * 因为第一个商店那一格是白给的。
 */
export function getPack(rng: PseudorandomState, context: PackContext): [string, boolean] {
    // `common_events.lua:1984`：新档第一个商店保底一个小丑包。
    // 原文用 `math.random(1, 2)` 在 `p_buffoon_normal_1/2` 之间挑，
    // 走的是**全局流**（没有 pseudoseed）。02 号票查明全局流不参与可复现性，
    // 而这两张除了图集坐标完全一样，所以取哪张都不影响任何数值——固定取 1
    if (!context.firstShopBuffoon) return ['p_buffoon_normal_1', false];

    const poll = rng.pseudorandom(`shop_pack${context.ante}`) * BOOSTER_WEIGHT_TOTAL;

    // `common_events.lua:1992`：累积权重。判据是
    // `it >= poll and it - weight <= poll`——**两边都要**，
    // 只写前半条会在权重为 0 的条目上误命中（本表没有 0，但照抄）
    let it = 0;
    for (const key of BOOSTER_KEYS_BY_ORDER) {
        const weight = BOOSTER_CENTERS[key].weight;
        it += weight;
        if (it >= poll && it - weight <= poll) return [key, true];
    }

    // 原文这时返回 nil、商店那一格就空着。这里抛——
    // `poll` 落在 `[0, cume)` 上，累积到最后必然命中，走到这里说明权重表坏了
    throw new Error(`补充包权重判定一个都没命中：poll = ${poll}`);
}
