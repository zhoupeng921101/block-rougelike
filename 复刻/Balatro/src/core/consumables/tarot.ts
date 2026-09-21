/**
 * 22 张塔罗牌。直译自 `card.lua:1092` `Card:use_consumeable` 里的那一串分支。
 *
 * ## 形状
 *
 * 原文是一条一条 `if self.ability.name == 'X'`，中间夹着两段**按 config 分流**
 * 的通用分支（`mod_conv or suit_conv` 那一段、`remove_card` 那一段）。
 * 这里保持同样的划分：通用的走 config、特例的按名字查表——
 * 与 `calculate_joker` 的翻译形状（15 号票）同一条口径。
 *
 * ## 21 / 22
 *
 * **`The Wheel of Fortune` 没有实现**：它的效果是给一张小丑加**版本**
 * （foil / holo / polychrome），而版本系统整个不在范围
 * （15 号票起就没接，商店那次 `edi` 掷点只消费不落地）。
 * 半实现比不实现更糟——它会掷掉 `wheel_of_fortune` 那三次点再什么也不发生，
 * 所以干脆登记成未实现，让商店给它标 `⚠未实现`。
 *
 * ## 三处顺序要守住
 *
 * 1. **`The Fool` 读的是「上一张」，不是自己。** 原作里
 *    `G.GAME.last_tarot_planet` 由 `set_consumeable_usage` 的**双层嵌套**
 *    immediate 事件设置，而 The Fool 自己的创建事件在它之前入队——
 *    FIFO 下 The Fool 先跑。所以调用方要「先 apply、再记 lastTarotPlanet」。
 * 2. **`Death` 复制的是最右边那张**（`T.x` 最大），不是第一张。
 * 3. **`The Hanged Man` 销毁之后要跑小丑的 `remove_playing_cards`**
 *    （`card.lua:1370`），调用点在 `Run`。`Glass Joker` 另走 `using_consumeable`。
 */

import { type Card, type Suit, type Value, cardKey, makeBase } from '../card';
import { pollEdition } from '../editions';
import { type Joker, setCost } from '../jokers';
import type { Consumable } from './types';
import type { ConsumableSpec, UseContext } from './use-context';

/** `card.lua:1122` 的 `Strength`：A → 2，其余 `min(id+1, 14)`。 */
const RANK_UP: Record<Value, Value> = {
    '2': '3', '3': '4', '4': '5', '5': '6', '6': '7', '7': '8', '8': '9',
    '9': '10', '10': 'Jack', Jack: 'Queen', Queen: 'King', King: 'Ace', Ace: '2',
};

/**
 * `card.lua:113` 的 `Card:set_base`：**原地换掉 `base`，保留身份**。
 *
 * `sort_id` / `unique_val` / `enhancement` 都不动——换点数换花色的是同一张牌，
 * 不是新造一张。
 *
 * **不能借 `makeCard` 造一张再抄过来**：那会白白推进 `sort_id` /
 * `unique_val` 两个全局自增计数器，而 `sort_id` 正是 `pseudoshuffle` 的规范序。
 * 所以这里用 `makeBase`（纯函数，不碰计数器）。
 */
function setBase(card: Card, suit: Suit, value: Value): void {
    Object.assign(card.base, makeBase(suit, value));
    (card as { key: string }).key = cardKey(suit, value);
}

/** `card.lua:547` 的 `change_suit`：只换花色，点数不动。 */
function changeSuit(card: Card, suit: Suit): void {
    setBase(card, suit, card.base.value);
}

/** 按 `T.x` 排好的选中牌。原文的 `G.hand.highlighted` 已经是这个顺序 */
function selected(ctx: UseContext): Card[] {
    return [...ctx.highlighted].sort((a, b) => a.T.x - b.T.x);
}

/**
 * `card.lua:1568` 的选中张数判定：
 * `mod_num >= #highlighted >= (min_highlighted or 1)`，
 * 而 `mod_num = min(5, max_highlighted)`（`card.lua:4158`）。
 */
function highlightedOk(consumable: Consumable, ctx: UseContext): boolean {
    const max = consumable.center.config.max_highlighted;
    if (max === undefined) return true;
    const modNum = Math.min(5, max);
    const min = consumable.center.config.min_highlighted ?? 1;
    return ctx.highlighted.length <= modNum && ctx.highlighted.length >= min;
}

/** 给选中的牌换强化（`card.lua:1143` 的 `set_ability(P_CENTERS[mod_conv])`）。 */
function enhanceSelected(consumable: Consumable, ctx: UseContext): void {
    const key = consumable.center.config.mod_conv as string;
    for (const card of selected(ctx)) card.enhancement = key;
}

/** 给选中的牌换花色（`card.lua:1139` 的 `change_suit`）。 */
function convertSuit(consumable: Consumable, ctx: UseContext): void {
    const suit = consumable.center.config.suit_conv as Suit;
    for (const card of selected(ctx)) changeSuit(card, suit);
}

/** 只要选中张数对就能用的那些（换强化 / 换花色 / 升点数 / 变身）。 */
function highlightSpec(apply: ConsumableSpec['apply']): ConsumableSpec {
    return { apply, canUse: (c, ctx) => highlightedOk(c, ctx) };
}

export const TAROT_SPECS: Record<string, ConsumableSpec> = {
    // ———— 换强化：8 张，全部走 config.mod_conv ————
    c_magician: highlightSpec(enhanceSelected), // m_lucky，最多 2 张
    c_empress: highlightSpec(enhanceSelected), // m_mult
    c_heirophant: highlightSpec(enhanceSelected), // m_bonus
    c_lovers: highlightSpec(enhanceSelected), // m_wild，1 张
    c_chariot: highlightSpec(enhanceSelected), // m_steel
    c_justice: highlightSpec(enhanceSelected), // m_glass
    c_devil: highlightSpec(enhanceSelected), // m_gold
    c_tower: highlightSpec(enhanceSelected), // m_stone

    // ———— 换花色：4 张，全部走 config.suit_conv，最多 3 张 ————
    c_star: highlightSpec(convertSuit), // Diamonds
    c_moon: highlightSpec(convertSuit), // Clubs
    c_sun: highlightSpec(convertSuit), // Hearts
    c_world: highlightSpec(convertSuit), // Spades

    // `card.lua:1121`：选中的牌点数 +1，**A 回到 2**（不是停在 A）
    c_strength: highlightSpec((_c, ctx) => {
        for (const card of selected(ctx)) setBase(card, card.base.suit, RANK_UP[card.base.value]);
    }),

    /**
     * `card.lua:1112`：把**最右边那张**（`T.x` 最大）复制到其余选中的牌上。
     * 复制的是整张牌面——点数、花色、强化都跟着走。
     * `min_highlighted = 2`，所以必须选两张。
     */
    c_death: highlightSpec((_c, ctx) => {
        const cards = selected(ctx);
        const rightmost = cards.reduce((a, b) => (b.T.x > a.T.x ? b : a));
        for (const card of cards) {
            if (card === rightmost) continue;
            Object.assign(card.base, rightmost.base);
            (card as { key: string }).key = rightmost.key;
            card.enhancement = rightmost.enhancement;
        }
    }),

    /**
     * `card.lua:1274`：销毁选中的牌（最多 2 张）。
     * 销毁之后要跑小丑的 `remove_playing_cards`，调用点在 `Run`。
     */
    c_hanged_man: highlightSpec((_c, ctx) => {
        ctx.removeCards(selected(ctx));
    }),

    /**
     * `card.lua:1387`：翻倍身上的钱，**上限 $20**。
     * 公式是 `max(0, min(dollars, extra))`——负债时给 0，不是给负数。
     */
    c_hermit: {
        apply: (c, ctx) => {
            const extra = c.center.config.extra as number;
            ctx.addDollars(Math.max(0, Math.min(ctx.getDollars(), extra)));
        },
    },

    /**
     * `card.lua:1394`：按**小丑区的卖价总和**给钱，上限 $50
     * （`card.lua:4171` 的 `ability.money`，在 `set_ability` 里现算）。
     */
    c_temperance: {
        apply: (c, ctx) => {
            const cap = c.center.config.extra as number;
            const sum = ctx.jokers.reduce((n, j) => n + j.sell_cost, 0);
            ctx.addDollars(Math.min(sum, cap));
        },
    },

    /**
     * `card.lua:1402`：造 2 张塔罗（The Emperor）／2 张星球（The High Priestess）
     * 进消耗品区。**造几张取决于还剩几个格子**——
     * `math.min(config.tarots, card_limit - #cards)`，且循环里还会再查一次。
     */
    c_emperor: {
        apply: (c, ctx) => createInto(ctx, 'Tarot', c.center.config.tarots as number, 'emp'),
        canUse: (_c, ctx) => ctx.consumables.length < ctx.consumableSlots,
    },
    c_high_priestess: {
        apply: (c, ctx) => createInto(ctx, 'Planet', c.center.config.planets as number, 'pri'),
        canUse: (_c, ctx) => ctx.consumables.length < ctx.consumableSlots,
    },

    /**
     * `card.lua:1415`：造一张随机小丑。
     *
     * 走 `create_card('Joker', G.jokers, …, 'jud')`，所以消费的是
     * `rarity<ante>jud` → `Joker<r>jud<ante>`（+ resample）→ `edijud<ante>`。
     * **`etperpoll` 不消费**：那一段的条件是 `area == G.shop_jokers or G.pack_cards`，
     * 而这里是 `G.jokers`。
     */
    c_judgement: {
        apply: (_c, ctx) => ctx.addJoker(ctx.createJoker('jud')),
        canUse: (_c, ctx) => ctx.jokers.length < ctx.jokerSlots,
    },

    /**
     * `card.lua:1466`：**1/4 给一张没版本的小丑加一个保底版本**。
     *
     * 三次掷点共用 `wheel_of_fortune` 一个 key，顺序是：
     * 1. 门口的 `pseudorandom('wheel_of_fortune') < normal/extra`（extra = 4）
     * 2. 中了才有的 `pseudorandom_element(池子, pseudoseed('wheel_of_fortune'))`
     * 3. `poll_edition('wheel_of_fortune', nil, true, true)`——
     *    **guaranteed 且 no_neg**，所以必出 Polychrome / Holo / Foil 之一
     *
     * **没中的时候只消费第 1 次。** 把 2、3 也无条件掷会让同 seed 分叉。
     *
     * 可选池是 `card.lua:4213` 的 `eligible_strength_jokers`：
     * 小丑区里**还没有版本**的那些。池子空了这张牌就用不了（`card.lua:1536`）。
     */
    c_wheel_of_fortune: {
        apply: (c, ctx) => {
            const pool = eligibleForEdition(ctx);
            const odds = c.center.config.extra as number;
            if (ctx.pseudorandom('wheel_of_fortune') >= ctx.probabilities.normal / odds) return;

            const target = ctx.pickRandom(pool, 'wheel_of_fortune');
            if (!target) return;
            const edition = pollEdition(ctx, 'wheel_of_fortune', { noNeg: true, guaranteed: true });
            if (edition) {
                target.edition = edition;
                setCost(target, ctx.discountPercent); // `set_edition` 末尾的 `set_cost`
            }
        },
        canUse: (_c, ctx) => eligibleForEdition(ctx).length > 0,
    },

    /**
     * `card.lua:1374`：复制**上一张用过的塔罗／星球**。
     *
     * `forced_key` 有值，所以 `create_card` 不抽池子、**一次 RNG 都不消费**。
     * 两条门槛（`card.lua:1556`）：消耗品区要有空位，且上一张不能是 The Fool 自己。
     */
    c_fool: {
        apply: (_c, ctx) => {
            const key = ctx.lastTarotPlanet;
            if (!key) return;
            ctx.addConsumable(ctx.makeConsumable(key));
        },
        canUse: (_c, ctx) =>
            ctx.consumables.length < ctx.consumableSlots &&
            !!ctx.lastTarotPlanet &&
            ctx.lastTarotPlanet !== 'c_fool',
    },
};

/**
 * `card.lua:4213` 的 `eligible_strength_jokers`：小丑区里**还没有版本**的那些。
 * 注意原文的条件是 `v.ability.set == 'Joker' and (not v.edition)`——
 * 只看有没有版本，不看是不是被 debuff。
 */
function eligibleForEdition(ctx: UseContext): Joker[] {
    return ctx.jokers.filter((j) => !j.edition);
}

function createInto(
    ctx: UseContext,
    set: 'Tarot' | 'Planet',
    count: number,
    keyAppend: string,
): void {
    // `card.lua:1403`：外层 `math.min(n, 空位数)`，循环里**再查一次**
    const room = Math.min(count, ctx.consumableSlots - ctx.consumables.length);
    for (let i = 0; i < room; i++) {
        if (ctx.consumables.length >= ctx.consumableSlots) break;
        ctx.addConsumable(ctx.createConsumable(set, keyAppend));
    }
}
