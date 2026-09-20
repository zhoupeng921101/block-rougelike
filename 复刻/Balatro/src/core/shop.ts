/**
 * 商店。直译自
 * - `参考/产物/Balatro_1.0.1o/源码/functions/common_events.lua:2002` `get_current_pool`
 * - 同文件 `:2121` `create_card`
 * - `functions/UI_definitions.lua:791` `create_card_for_shop`
 * - `functions/button_callbacks.lua:2965` `G.FUNCS.reroll_shop`
 * - `functions/common_events.lua:2312` `calculate_reroll_cost`
 *
 * ## 这是第二个 RNG 消费点，而且比洗牌复杂
 *
 * 生成**一个**商店格子要消费的 key，按顺序：
 *
 * 1. `'cdt' + ante` —— 决定这格是小丑还是消耗品（20 : 4 : 4 的权重）
 * 2. `'rarity' + ante + 'sho'` —— 稀有度（>0.95 → 3，>0.7 → 2，否则 1）
 * 3. `'Joker' + rarity + 'sho' + ante` —— 在该稀有度池里抽下标
 * 4. `'Joker' + rarity + 'sho' + ante + '_resample' + n` —— 抽到 `UNAVAILABLE` 就重抽
 * 5. `'etperpoll' + ante` —— 永恒／易腐掷点。**无条件消费**，
 *    即使 `enable_eternals_in_shop` 是 false（原文那行 `local ... = pseudorandom(...)`
 *    在 if 外面）。少这一次整条链就偏了。
 * 6. `'edi' + 'sho' + ante` —— 版本掷点（`poll_edition`）
 *
 * 租赁那一次掷点**不消费**：`if G.GAME.modifiers.enable_rentals_in_shop and pseudorandom(...)`
 * 是短路的，默认关，所以右边不求值。这两处一个要算一个不要算，是最容易搞错的地方。
 *
 * ## 池子有三件事会改它的大小，而大小直接改 `math.random(#pool)`
 *
 * - **45 张 `start_locked` 的小丑不在新档池里**（`unlocked ~= false` 那条剔除）
 * - **本局见过的小丑退出池子**（`used_jokers`，除非有 Showman）
 * - **`pool_flag`**：`Gros Michel` 灭绝后退池，`Cavendish` 灭绝后才进池
 *
 * 剔除掉的格子**不是从数组里删掉**，而是换成 `'UNAVAILABLE'`——所以池子长度
 * 恒等于原始池长度，`math.random(#pool)` 的取值域不变，抽到 UNAVAILABLE 就换
 * 一个带 `_resample` 后缀的 key 重抽。把它们真删掉会让同 seed 立刻分叉。
 */

import { JOKER_CENTERS, JOKER_KEYS_BY_ORDER, findJoker, makeJoker } from './jokers';
import type { Joker } from './jokers';
import type { PseudorandomState } from './rng';
import { pseudorandomElement } from './rng';

/** `game.lua:2111-2115`。权重不是概率——要过总和。 */
export const SHOP_RATES = {
    joker: 20,
    tarot: 4,
    planet: 4,
    playing_card: 0,
    spectral: 0,
} as const;

/** `game.lua:2194`。 */
export const SHOP_JOKER_MAX = 2;

/** `misc_functions.lua:1859`。 */
export const BASE_REROLL_COST = 5;

/**
 * `game.lua:724` 的 `P_JOKER_RARITY_POOLS`，`:851` 起按 `order` 排序。
 *
 * 构建时的 `not v.demo` 剔除**在完整版里不生效**：`game.lua:746`
 * 有一句 `if not G.FTP_LOCKED then v.demo = nil end`，而 `G.FTP_LOCKED`
 * 在 `globals.lua:162` 是注释掉的。所以 150 张全部进池，一张不少。
 */
export const JOKER_RARITY_POOLS: Record<number, string[]> = (() => {
    const pools: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [] };
    // JOKER_KEYS_BY_ORDER 已经是 order 序，所以直接 push 就等于排好序
    for (const key of JOKER_KEYS_BY_ORDER) {
        pools[JOKER_CENTERS[key].rarity].push(key);
    }
    return pools;
})();

/** 池子剔除要查的那几样状态。 */
export type PoolContext = {
    ante: number;
    /** `G.GAME.used_jokers`——本局见过的小丑 key */
    usedJokers: Set<string>;
    /** `G.GAME.pool_flags` */
    grosMichelExtinct: boolean;
    /** 小丑区。查 `Showman`（它让见过的小丑重新进池） */
    jokers: Joker[];
};

/** 抽到这个就重抽。**必须占着池子里的位置**，见文件头。 */
export const UNAVAILABLE = 'UNAVAILABLE';

/**
 * `common_events.lua:2002` 的 `get_current_pool`，只走 `_type == 'Joker'` 那一支。
 *
 * 返回 `[池子, 池子的 seed key]`。池子里被剔除的位置是 `UNAVAILABLE`。
 */
export function getCurrentJokerPool(
    rng: PseudorandomState,
    context: PoolContext,
    keyAppend = '',
): [string[], string] {
    // `common_events.lua:2008`：**掷点在建池之前**
    const roll = rng.pseudorandom(`rarity${context.ante}${keyAppend}`);
    const rarity = roll > 0.95 ? 3 : roll > 0.7 ? 2 : 1;

    const poolKey = `Joker${rarity}${keyAppend}`;
    const starting = JOKER_RARITY_POOLS[rarity];

    // Showman 让「本局见过的小丑」重新进池
    const showman = findJoker(context.jokers, 'Showman').length > 0;

    const pool: string[] = [];
    let poolSize = 0;
    for (const key of starting) {
        const center = JOKER_CENTERS[key];
        let add = false;

        // `common_events.lua:2026`
        if (!(context.usedJokers.has(key) && !showman) && (center.unlocked !== false || center.rarity === 4)) {
            add = true;
        }

        // `common_events.lua:2066`
        if (center.no_pool_flag === 'gros_michel_extinct' && context.grosMichelExtinct) add = false;
        if (center.yes_pool_flag === 'gros_michel_extinct' && !context.grosMichelExtinct) add = false;

        if (add) {
            pool.push(key);
            poolSize++;
        } else {
            pool.push(UNAVAILABLE);
        }
    }

    // `common_events.lua:2077`：整池空了就退化成单元素池 `['j_joker']`
    if (poolSize === 0) return [['j_joker'], `${poolKey}${context.ante}`];

    return [pool, `${poolKey}${context.ante}`];
}

/** 商店里的一格。 */
export type ShopItem =
    | { kind: 'joker'; joker: Joker; cost: number }
    /**
     * 塔罗／星球牌。**本里程碑不实现它们的效果**，但格子照样生成——
     * 因为 `'cdt'+ante` 那次掷点是真的会掉到这两档上（20:4:4，合起来 28.6%），
     * 把它们改成小丑就等于改了商店的分布，同 seed 立刻分叉。
     * 这一格买不了，UI 上标成未实现。
     */
    | { kind: 'unimplemented'; type: 'Tarot' | 'Planet'; cost: number };

/**
 * `UI_definitions.lua:791` 的 `create_card_for_shop`。
 *
 * 省掉的：教学关的 `forced_shop`、标签的 `store_joker_create` 钩子
 * （标签不在本里程碑）、`v_illusion` 优惠券让 `Base` 变 `Enhanced` 的那次掷点
 * （优惠券不在范围，而那次掷点在 `and` 右边、默认短路，不消费 RNG）。
 */
export function createCardForShop(rng: PseudorandomState, context: PoolContext): ShopItem {
    const total =
        SHOP_RATES.joker +
        SHOP_RATES.tarot +
        SHOP_RATES.planet +
        SHOP_RATES.playing_card +
        SHOP_RATES.spectral;

    // `UI_definitions.lua:814`
    const polled = rng.pseudorandom(`cdt${context.ante}`) * total;

    // `UI_definitions.lua:816` 的那张表，**顺序就是判定顺序**。
    // `Base` 与 `Spectral` 的权重是 0，`polled > check && polled <= check + 0`
    // 永远不成立，所以本牌组下它们进不来——列出来只为让这张表与原文逐行对齐
    const buckets: Array<{ type: 'Joker' | 'Tarot' | 'Planet' | 'Base' | 'Spectral'; val: number }> = [
        { type: 'Joker', val: SHOP_RATES.joker },
        { type: 'Tarot', val: SHOP_RATES.tarot },
        { type: 'Planet', val: SHOP_RATES.planet },
        { type: 'Base', val: SHOP_RATES.playing_card },
        { type: 'Spectral', val: SHOP_RATES.spectral },
    ];

    let check = 0;
    for (const bucket of buckets) {
        if (polled > check && polled <= check + bucket.val) {
            if (bucket.type === 'Joker') return createJokerForShop(rng, context);
            if (bucket.type === 'Tarot' || bucket.type === 'Planet') {
                // 格子照生成，但**不消费塔罗／星球自己的池子 RNG**。
                // `create_card('Tarot', …)` 抽的是 `pseudoseed('Tarotsho'+ante)`，
                // 那是塔罗自己的 key；`PseudorandomState` 按 key 分开记状态，
                // 所以少消费它不会让小丑那条链偏。接消耗品时换成真的 `createCard`。
                return { kind: 'unimplemented', type: bucket.type, cost: 3 };
            }
            throw new Error(`权重为 0 的档位被命中了：${bucket.type}`);
        }
        check += bucket.val;
    }

    // 一个桶都不命中只可能是 `polled === 0`（那串判定是严格大于），
    // 而 TW223 的 `math.random()` 落在开区间上，实际到不了。
    // 原作这时 `create_card_for_shop` 返回 nil、商店少一格，但
    // `refill()` 是 `while` 循环，返回空会死循环——所以这里抛而不是静默补一张
    throw new Error(`商店档位判定一个都没命中：polled = ${polled}`);
}

function createJokerForShop(rng: PseudorandomState, context: PoolContext): ShopItem {
    const [pool, poolKey] = getCurrentJokerPool(rng, context, 'sho');

    // `common_events.lua:2156`
    let [key] = pseudorandomElement(pool, rng.pseudoseed(poolKey));
    let it = 1;
    while (key === UNAVAILABLE) {
        it++;
        [key] = pseudorandomElement(pool, rng.pseudoseed(`${poolKey}_resample${it}`));
    }

    const joker = makeJoker(String(key));

    // `card.lua:350`：**任何一张牌被 `set_ability` 就标记 used**，
    // 包括商店里摆出来的。所以同一局里同一张小丑不会出第二次
    context.usedJokers.add(String(key));

    // `common_events.lua:2181`：永恒／易腐掷点，**无条件消费**。
    // 判定被 `enable_eternals_in_shop`（默认 false）挡住，但掷点本身在 if 外面
    rng.pseudorandom(`etperpoll${context.ante}`);

    // 租赁那次掷点在 `and` 右边、默认关 → **短路，不消费**

    // `common_events.lua:2192` 的 `poll_edition('edi'+append+ante)`。
    // 版本不在本里程碑，但这次掷点要消费
    rng.pseudorandom(`edisho${context.ante}`);

    return { kind: 'joker', joker, cost: joker.center.cost };
}

/**
 * 一次商店的状态。
 *
 * 重掷价格**跨重掷累进、每回合归零**：
 * `reroll_cost = round_resets.reroll_cost(5) + reroll_cost_increase`，
 * 而 `reroll_cost_increase` 在回合开始时置 0（`state_events.lua:321`）。
 */
export class Shop {
    items: ShopItem[] = [];
    /** `G.GAME.current_round.reroll_cost_increase` */
    rerollCostIncrease = 0;
    /** `G.GAME.current_round.free_rerolls`。`Chaos the Clown` 每张给 1 次 */
    freeRerolls: number;

    constructor(
        private readonly rng: PseudorandomState,
        private readonly context: PoolContext,
    ) {
        // `state_events.lua:332`：回合开始时按 Chaos the Clown 的张数给免费重掷
        this.freeRerolls = findJoker(context.jokers, 'Chaos the Clown').length;
        this.refill();
    }

    /** `common_events.lua:2312` 的 `calculate_reroll_cost`。 */
    get rerollCost(): number {
        if (this.freeRerolls > 0) return 0;
        return BASE_REROLL_COST + this.rerollCostIncrease;
    }

    private refill(): void {
        while (this.items.length < SHOP_JOKER_MAX) {
            this.items.push(createCardForShop(this.rng, this.context));
        }
    }

    /**
     * `button_callbacks.lua:2965` 的 `reroll_shop`。
     *
     * **`calculate_reroll_cost(final_free)`**：用掉最后一次免费重掷时传
     * `skip_increment = true`，所以那一次**不涨价**。这是原文里最容易漏的一行。
     */
    reroll(): void {
        const finalFree = this.freeRerolls > 0;
        this.freeRerolls = Math.max(this.freeRerolls - 1, 0);
        if (!finalFree) this.rerollCostIncrease++;
        this.items = [];
        this.refill();
    }

    /** 买掉第 `index` 格。返回买到的小丑；调用方负责扣钱与放进小丑区。 */
    take(index: number): Joker {
        const item = this.items[index];
        if (!item) throw new Error(`商店没有第 ${index} 格`);
        if (item.kind !== 'joker') throw new Error('这一格不是小丑（塔罗／星球本里程碑未实现）');
        this.items.splice(index, 1);
        return item.joker;
    }
}
