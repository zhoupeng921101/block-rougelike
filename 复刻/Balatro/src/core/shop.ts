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

import { CONSUMABLE_CENTERS, CONSUMABLE_KEYS_BY_SET, makeConsumable } from './consumables';
import type { Consumable, ConsumableSet, PlanetConfig } from './consumables';
import { JOKER_CENTERS, JOKER_KEYS_BY_ORDER, findJoker, makeJoker } from './jokers';
import type { Joker } from './jokers';
import type { HandName } from './poker-hands';
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
    /**
     * `G.GAME.used_jokers`。**不是「本局见过的」，是「此刻活着的」。**
     *
     * `card.lua:350` 的 `set_ability` 把 key 标上，而 `card.lua:4829` 的
     * `Card:remove()` 有一条对称的清除：小丑区与消耗品区里都没有同名的了，
     * 就把标记抹掉。而商店重掷（`button_callbacks.lua:2983` 的 `c:remove()`）
     * 与离开商店（`UIBox:remove` → `CardArea:remove` → `remove_all(cards)`）
     * **都会走那条清除**。所以它的实际语义是
     * 「现在被摆出来或被持有的 center」，不是「整局见过的」。
     *
     * 写成「见过就永久剔除」会让池子内容从第二个商店起就和原版不一样，
     * 而池长度不变（剔除位置换成 UNAVAILABLE），
     * 于是 `_resample` 的**次数**对不上 —— 同 seed 从那里分叉。
     *
     * key 与 name 一一对应，所以这里按 key 存；原文按 name 匹配全体 center。
     */
    usedJokers: Set<string>;
    /** `G.GAME.pool_flags` */
    grosMichelExtinct: boolean;
    /** 小丑区。查 `Showman`（它让见过的小丑重新进池），也是 `find_joker` 的搜索域之一 */
    jokers: Joker[];
    /** 消耗品区。`find_joker` 同时搜它（`misc_functions.lua:914`） */
    consumables: Consumable[];
    /**
     * 各牌型打出过几次。**星球的 `softlock` 读它**：
     * Planet X / Ceres / Eris 要对应牌型 `played > 0` 才进池
     * （`common_events.lua:2044`）。
     */
    handsPlayed: Record<HandName, number>;
};

/**
 * `card.lua:4829` 的那条清除：小丑区与消耗品区里都没有它了，就解除 used 标记。
 *
 * 三处调用：卖掉、重掷商店、离开商店。**少一处都会让池子内容慢慢跑偏。**
 */
export function releaseUsed(context: PoolContext, key: string): void {
    const held =
        context.jokers.some((j) => j.key === key) ||
        context.consumables.some((c) => c.key === key);
    if (!held) context.usedJokers.delete(key);
}

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

/**
 * 同一个 `get_current_pool`，走 `else` 那一支（`_type` 不是 `'Joker'`）。
 *
 * 与小丑那一支的三处不同：
 *
 * 1. **不掷 rarity。** 那次 `pseudorandom('rarity'..ante..append)` 在
 *    `if _type == 'Joker'` 里面，塔罗／星球格不消费它。
 * 2. **池 key 是 `<Type><append><ante>`**（`Tarotsho1`），没有 rarity 那一段。
 * 3. **多一条 `softlock` 剔除**（`common_events.lua:2044`）：星球要对应牌型
 *    `played > 0` 才进池。所以新档的星球池是 12 个位置、9 张可用。
 *
 * `Black Hole` 与 `The Soul` 在原文里有一条无条件剔除
 * （`common_events.lua:2062`）——这里不用写，它们是幽灵牌，压根不在
 * `CONSUMABLE_KEYS_BY_SET` 里（见 16 号票）。
 *
 * 空池的退化值按 set 分：塔罗 `c_strength`、星球 `c_pluto`
 * （`common_events.lua:2079-2081`）。
 */
export function getCurrentConsumablePool(
    set: ConsumableSet,
    context: PoolContext,
    keyAppend = '',
): [string[], string] {
    const poolKey = `${set}${keyAppend}${context.ante}`;
    const showman = findJoker(context.jokers, 'Showman').length > 0;

    const pool: string[] = [];
    let poolSize = 0;
    for (const key of CONSUMABLE_KEYS_BY_SET[set]) {
        const center = CONSUMABLE_CENTERS[key];
        let add = false;

        // `common_events.lua:2026`。消耗品的 center 没有 `unlocked` 字段，
        // 而条件是 `v.unlocked ~= false`——nil ~= false 为真，所以这一半恒成立
        if (!(context.usedJokers.has(key) && !showman)) add = true;

        // `common_events.lua:2043`：星球的 softlock
        if (add && set === 'Planet') {
            const config = center.config as PlanetConfig;
            if (config.softlock && context.handsPlayed[config.hand_type] <= 0) add = false;
        }

        if (add) {
            pool.push(key);
            poolSize++;
        } else {
            pool.push(UNAVAILABLE);
        }
    }

    // `common_events.lua:2079`
    if (poolSize === 0) return [[set === 'Tarot' ? 'c_strength' : 'c_pluto'], poolKey];

    return [pool, poolKey];
}

/** 商店里的一格。 */
export type ShopItem =
    | { kind: 'joker'; joker: Joker; cost: number }
    | { kind: 'consumable'; consumable: Consumable; cost: number };

/** 这一格占着的 center key。释放 used 标记要用 */
export function shopItemKey(item: ShopItem): string {
    return item.kind === 'joker' ? item.joker.key : item.consumable.key;
}

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
                return createConsumableForShop(rng, bucket.type, context);
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

/** `common_events.lua:2156` 的抽取 + resample 循环。三处都走它 */
function drawFromPool(rng: PseudorandomState, pool: string[], poolKey: string): string {
    let [key] = pseudorandomElement(pool, rng.pseudoseed(poolKey));
    let it = 1;
    while (key === UNAVAILABLE) {
        it++;
        [key] = pseudorandomElement(pool, rng.pseudoseed(`${poolKey}_resample${it}`));
    }
    return String(key);
}

/**
 * `create_card('Joker', area, …, keyAppend)`。
 *
 * **`inShop` 决定要不要消费 `etperpoll` 与 `edi`**：那一整段的条件是
 * `area == G.shop_jokers or area == G.pack_cards`（`common_events.lua:2181`），
 * 所以商店与补充包消费、`Judgement` 造到小丑区的那张不消费 `etperpoll`。
 * `edi` 那次（`poll_edition`）在 `if _type == 'Joker'` 里但在上面那个 if 外面，
 * **两条路都消费**。
 */
export function createJokerCard(
    rng: PseudorandomState,
    context: PoolContext,
    keyAppend: string,
    inShop: boolean,
): Joker {
    const [pool, poolKey] = getCurrentJokerPool(rng, context, keyAppend);
    const key = drawFromPool(rng, pool, poolKey);
    const joker = makeJoker(key);

    // `card.lua:350`：**任何一张牌被 `set_ability` 就标记 used**，包括商店里摆出来的
    context.usedJokers.add(key);

    if (inShop) {
        // `common_events.lua:2181`：永恒／易腐掷点，**无条件消费**。
        // 判定被 `enable_eternals_in_shop`（默认 false）挡住，但掷点本身在 if 外面。
        // 租赁那次在 `and` 右边、默认关 → **短路，不消费**
        rng.pseudorandom(`etperpoll${context.ante}`);
    }

    // `common_events.lua:2192` 的 `poll_edition('edi'+append+ante)`。
    // 版本不在范围，但这次掷点要消费
    rng.pseudorandom(`edi${keyAppend}${context.ante}`);

    return joker;
}

/**
 * `create_card('Tarot' | 'Planet', area, …, keyAppend)`。
 *
 * **比小丑那一支短得多**：`etperpoll` / `edi` 整段在 `if _type == 'Joker'` 里面，
 * `front` 掷点只有 `Base` / `Enhanced` 才走，`soul_` 那一段要 `soulable`
 * 而调用点全部传 nil。所以只消费池子抽取那一次（加 resample）。见 16 号票。
 */
export function createConsumableCard(
    rng: PseudorandomState,
    set: ConsumableSet,
    context: PoolContext,
    keyAppend: string,
): Consumable {
    const [pool, poolKey] = getCurrentConsumablePool(set, context, keyAppend);
    const key = drawFromPool(rng, pool, poolKey);
    // `card.lua:350` 对消耗品同样标记——那个循环按 name 匹配全体 P_CENTERS
    context.usedJokers.add(key);
    return makeConsumable(key);
}

function createJokerForShop(rng: PseudorandomState, context: PoolContext): ShopItem {
    const joker = createJokerCard(rng, context, 'sho', true);
    return { kind: 'joker', joker, cost: joker.center.cost };
}

/**
 * `create_card` 的塔罗／星球分支。**比小丑那一支短得多**——
 * `etperpoll` / `edi`（永恒、易腐、租赁、版本）整段在 `if _type == 'Joker'`
 * 里面，消耗品格一次都不消费；`front` 掷点只有 `Base` / `Enhanced` 才走。
 *
 * `soulable` 那一段也不进：`create_card_for_shop` 传的第 6 个实参是 `nil`
 * （`UI_definitions.lua:825`），所以 **The Soul / Black Hole 出不了商店**，
 * `soul_<Type><ante>` 这次掷点在商店路径上不消费。见 16 号票。
 *
 * 于是一格消耗品只消费一次池子抽取（加上 resample）。
 */
function createConsumableForShop(
    rng: PseudorandomState,
    set: ConsumableSet,
    context: PoolContext,
): ShopItem {
    const consumable = createConsumableCard(rng, set, context, 'sho');
    return { kind: 'consumable', consumable, cost: consumable.cost };
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
        readonly context: PoolContext,
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
        // `button_callbacks.lua:2983`：旧的那几张是 `c:remove()` 掉的，
        // 而 `remove` 会解除 used 标记 —— 它们**回到池子里**。
        // 只清 `items` 不放回去，池子内容会一次比一次窄，`_resample` 的次数跟着偏
        this.release();
        this.items = [];
        this.refill();
    }

    /**
     * 把还摆在架子上的那几格还回池子。**重掷与离开商店都要调**。
     *
     * 离开商店时原作是 `UIBox:remove()` → `CardArea:remove()` →
     * `remove_all(cards)` → 每张 `Card:remove()`，级联到那条 used 清除。
     */
    release(): void {
        for (const item of this.items) releaseUsed(this.context, shopItemKey(item));
    }

    /**
     * 拿走第 `index` 格。调用方负责扣钱与放进对应的区。
     *
     * **不解除 used 标记**——买下来之后那张牌还活着（在小丑区／消耗品区里），
     * `find_joker` 找得到它，`card.lua:4832` 那条清除就不成立。
     */
    take(index: number): ShopItem {
        const item = this.items[index];
        if (!item) throw new Error(`商店没有第 ${index} 格`);
        this.items.splice(index, 1);
        return item;
    }
}
