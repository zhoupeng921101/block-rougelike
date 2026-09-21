/**
 * 优惠券。直译自 `参考/产物/Balatro_1.0.1o/源码/` 的
 * - `functions/common_events.lua:1940` `get_next_voucher_key`、`:2027` 池子的优惠券那一支
 * - `card.lua:1814` `Card:redeem`、`:1882` `Card:apply_to_run`
 *
 * 这个文件只管**数据、池子、抽取与「兑换了哪些 → 整局参数」**。
 * 一次性的效果（Hieroglyph 退 Ante、Clearance Sale 全场改价、Overstock 当场补一格）
 * 要碰 `Run` 与 `Shop` 的状态，由 `Run.redeemVoucher` 执行。切片边界见 19 号票。
 *
 * ## 为什么参数从「兑换了哪些」重算
 *
 * 原作是 `apply_to_run` 往 `G.GAME` 上写（`tarot_rate = 4 * extra` 之类）。
 * 可达的 16 张里没有两张写同一个字段，所以「写一次」与「从集合重算」等价；
 * 重算的好处与 `runModifiers` 一样：没有增量，也就没有漏掉的那一处。
 */

import type { PseudorandomState } from './rng';
import { pseudorandomElement } from './rng';
import { VOUCHER_CENTERS, VOUCHER_KEYS_BY_ORDER } from './vouchers.generated';

export { VOUCHER_CENTERS, VOUCHER_KEYS_BY_ORDER } from './vouchers.generated';

/** `P_CENTERS` 里的一张优惠券。由 `tools/gen-voucher-centers.mjs` 生成 */
export type VoucherCenter = {
    order: number;
    name: string;
    cost: number;
    /** 新档里解锁了没有。**二级优惠券全是 false，指定 seed 的对局里也不会被解锁**，见 `voucherPool` */
    unlocked: boolean;
    /** 要先兑换过这几张 */
    requires?: string[];
    pos: { x: number; y: number };
    config: { extra?: number; extra_disp?: number };
};

/**
 * 效果**实现了**的优惠券：16 张一级。
 *
 * 二级那 16 张在「新档 + 指定 seed」口径下**抽不到**（`unlocked = false`，
 * 而 `check_for_unlock` 对 seeded 直接 return），效果不写。
 */
const IMPLEMENTED = new Set(VOUCHER_KEYS_BY_ORDER.filter((k) => VOUCHER_CENTERS[k].unlocked));

export function isVoucherImplemented(key: string): boolean {
    return IMPLEMENTED.has(key);
}

/** 池子要查的三样状态 */
export type VoucherPoolContext = {
    ante: number;
    /** `G.GAME.used_vouchers`：已兑换的 */
    usedVouchers: ReadonlySet<string>;
    /** `G.shop_vouchers.cards`：**正摆在商店里的**。商店关着时传空 */
    inShop: readonly string[];
};

/**
 * `get_current_pool('Voucher')`。按 `order` 排的 32 格，不进池的写 `'UNAVAILABLE'`：
 *
 * - `v.unlocked ~= false`（`common_events.lua:2026`）：二级优惠券恒不进
 * - 已兑换的不进
 * - `requires` 里有没兑换的不进
 * - 正摆在商店里的不进
 *
 * `used_jokers` 那半条对优惠券也生效（摆出来的那张会被 `set_ability` 标记），
 * 但它与「正摆在商店里」这条剔除的是同一张，不单独建模。
 *
 * 一格都没有就是 `['v_blank']`（`common_events.lua:2085`）。
 */
export function voucherPool(ctx: VoucherPoolContext): string[] {
    let size = 0;
    const pool = VOUCHER_KEYS_BY_ORDER.map((key) => {
        const c = VOUCHER_CENTERS[key];
        const ok =
            c.unlocked &&
            !ctx.usedVouchers.has(key) &&
            (c.requires ?? []).every((r) => ctx.usedVouchers.has(r)) &&
            !ctx.inShop.includes(key);
        if (ok) size++;
        return ok ? key : 'UNAVAILABLE';
    });
    return size > 0 ? pool : ['v_blank'];
}

/**
 * `get_next_voucher_key(_from_tag)`：池 key 是 `Voucher<ante>`；Voucher Tag 给的那张是
 * **`Voucher_fromtag`，不带 ante**——`get_current_pool` 返回的已经是拼好 ante 的整串，
 * 原文 `if _from_tag then _pool_key = 'Voucher_fromtag' end` 把整串换掉了。
 * 所以 fromtag 这条流**跨 Ante 共用**，写成带 ante 会从第二张起分叉。
 */
export function nextVoucherKey(rng: PseudorandomState, ctx: VoucherPoolContext, fromTag = false): string {
    const pool = voucherPool(ctx);
    const poolKey = fromTag ? 'Voucher_fromtag' : `Voucher${ctx.ante}`;
    let [key] = pseudorandomElement(pool, rng.pseudoseed(poolKey));
    let it = 1;
    while (key === 'UNAVAILABLE') {
        it++;
        [key] = pseudorandomElement(pool, rng.pseudoseed(`${poolKey}_resample${it}`));
    }
    return key!;
}

/** `game.lua:2111-2115` 的基线。优惠券改其中三个 */
export const BASE_RATES = { joker: 20, tarot: 4, planet: 4, playing_card: 0, spectral: 0 } as const;

export type ShopRates = { joker: number; tarot: number; planet: number; playing_card: number; spectral: number };

/** 兑换了哪些 → 整局参数。字段名对着 `G.GAME` 上被 `apply_to_run` 写的那个 */
export type VoucherParams = {
    /** `G.GAME.shop.joker_max` 的增量（Overstock） */
    shopJokerSlots: number;
    /** `G.GAME.discount_percent`（Clearance Sale） */
    discountPercent: number;
    /** `G.GAME.edition_rate`（Hone） */
    editionRate: number;
    /** `round_resets.reroll_cost` 的减量（Reroll Surplus） */
    rerollDiscount: number;
    /** 消耗品格的增量（Crystal Ball） */
    consumableSlots: number;
    /** Telescope：天体包第一张固定 */
    telescope: boolean;
    /** `round_resets.hands` 的增量（Grabber +1、Hieroglyph −1） */
    hands: number;
    /** `round_resets.discards` 的增量（Wasteful） */
    discards: number;
    /** `G.hand:change_size` 的增量（Paint Brush） */
    handSize: number;
    /** 商店五档权重（Tarot / Planet Merchant、Magic Trick） */
    rates: ShopRates;
    /** `G.GAME.interest_cap`（Seed Money） */
    interestCap: number;
    /** Director's Cut：每个 Ante 能花 $10 重掷一次 Boss */
    directorsCut: boolean;
};

export function voucherParams(used: ReadonlySet<string>): VoucherParams {
    const has = (k: string) => used.has(k);
    const extra = (k: string) => VOUCHER_CENTERS[k].config.extra!;
    return {
        shopJokerSlots: has('v_overstock_norm') ? 1 : 0,
        discountPercent: has('v_clearance_sale') ? extra('v_clearance_sale') : 0,
        editionRate: has('v_hone') ? extra('v_hone') : 1,
        rerollDiscount: has('v_reroll_surplus') ? extra('v_reroll_surplus') : 0,
        consumableSlots: has('v_crystal_ball') ? 1 : 0,
        telescope: has('v_telescope'),
        hands: (has('v_grabber') ? extra('v_grabber') : 0) - (has('v_hieroglyph') ? extra('v_hieroglyph') : 0),
        discards: has('v_wasteful') ? extra('v_wasteful') : 0,
        handSize: has('v_paint_brush') ? 1 : 0,
        rates: {
            ...BASE_RATES,
            // `card.lua:1895`：`tarot_rate = 4 * extra`，extra 是 `9.6/4`。**先除再乘**，照抄浮点
            tarot: has('v_tarot_merchant') ? 4 * extra('v_tarot_merchant') : BASE_RATES.tarot,
            planet: has('v_planet_merchant') ? 4 * extra('v_planet_merchant') : BASE_RATES.planet,
            playing_card: has('v_magic_trick') ? extra('v_magic_trick') : BASE_RATES.playing_card,
        },
        interestCap: has('v_seed_money') ? extra('v_seed_money') : 25,
        directorsCut: has('v_directors_cut'),
    };
}

/** 商店优惠券格里的一张 */
export type ShopVoucher = {
    key: string;
    center: VoucherCenter;
    /** `card.shop_voucher`：本 Ante 那张主优惠券（不是 Voucher Tag 给的） */
    main: boolean;
};

export function makeShopVoucher(key: string, main: boolean): ShopVoucher {
    const center = VOUCHER_CENTERS[key];
    if (!center) throw new Error(`没有这张优惠券：${key}`);
    return { key, center, main };
}
