/**
 * 标签。直译自 `参考/产物/Balatro_1.0.1o/源码/tag.lua` 与 `common_events.lua:1953` 的 `get_next_tag_key`。
 *
 * 这个文件只管**数据与抽取**：池子、抽下一个、造一个 `Tag`。
 * 效果散在它们的触发点上（跳过盲注、进盲注、商店、回合收益），由 `Run` 执行——
 * 与 `calculate_joker` 不同，标签的每种时机都要碰 `Run` 的不同部分（商店、小丑区、钱、牌型等级），
 * 收成一张 handler 表反而要把整个 `Run` 传进去。切片边界见 18 号票。
 */

import type { HandName } from './poker-hands';
import type { PseudorandomState } from './rng';
import { pseudorandomElement } from './rng';
import { TAG_CENTERS, TAG_KEYS_BY_ORDER } from './tags.generated';

export { TAG_CENTERS, TAG_KEYS_BY_ORDER } from './tags.generated';

/** `tag.lua:128` 起 `apply_to_run` 分派的那十种时机 */
export type TagTiming =
    | 'eval'
    | 'immediate'
    | 'new_blind_choice'
    | 'voucher_add'
    | 'tag_add'
    | 'round_start_bonus'
    | 'store_joker_create'
    | 'shop_start'
    | 'store_joker_modify'
    | 'shop_final_pass';

/** `P_TAGS` 里的一行。由 `tools/gen-tag-centers.mjs` 生成 */
export type TagCenter = {
    order: number;
    name: string;
    /** 到这个 Ante 才进池。没有就是从 Ante 1 起 */
    min_ante?: number;
    /** 要求这张卡「已发现」才进池。**指定 seed 的对局里永远不满足**，见 `tagPool` */
    requires?: string;
    pos: { x: number; y: number };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: { type: TagTiming } & Record<string, any>;
};

/** `Blind` 选择界面上的哪一格给的。Orbital 靠它查 `orbital_choices` */
export type BlindType = 'Small' | 'Big' | 'Boss';

/** 一个具体的标签（`Tag:init`） */
export type Tag = {
    readonly key: string;
    readonly center: TagCenter;
    /**
     * `self.triggered`。触发过的标签原作在 `yep` 的事件里 `remove()`——
     * 复刻件触发之后**立刻**从 `Run.tags` 里拿掉，所以这个字段只在一次遍历中途有意义
     */
    triggered: boolean;
    /** Orbital Tag 要升级的牌型（`Tag:set_ability`，`tag.lua:104`） */
    orbitalHand?: HandName;
};

/**
 * 效果**实现了**的标签。
 *
 * 不在这里的只有一类（18 号票）：**Rare / Negative / Foil / Holographic / Polychrome**，
 * `requires` 永远不满足，**抽不到**。效果不写，真被调到就抛。
 * Voucher Tag 在 19 号票接上了（效果在 `Run.shopTagHooks` 的 `voucherAdd`）。
 */
const IMPLEMENTED = new Set([
    'tag_voucher', 'tag_uncommon', 'tag_investment', 'tag_boss', 'tag_standard', 'tag_charm', 'tag_meteor',
    'tag_buffoon', 'tag_handy', 'tag_garbage', 'tag_ethereal', 'tag_coupon', 'tag_double',
    'tag_juggle', 'tag_d_six', 'tag_top_up', 'tag_skip', 'tag_orbital', 'tag_economy',
]);

export function isTagImplemented(key: string): boolean {
    return IMPLEMENTED.has(key);
}

/**
 * `common_events.lua:2019` 的 `get_current_pool('Tag')`。
 *
 * 按 `order` 排的 24 格，不进池的写 `'UNAVAILABLE'`（**占位，不删**——删了池子变短、抽取结果全变）：
 * - `requires`：要那张卡「已发现」。**`discover_card` 第一句是 `if G.GAME.seeded then return end`**，
 *   指定 seed 的对局里什么都不会被发现；复刻件按「新档 + 指定 seed」口径，所以这 5 个恒不进池
 * - `min_ante > ante`：还没到那个 Ante
 *
 * 一个都没有就是 `['tag_handy']`（原文的兜底）。
 */
export function tagPool(ante: number): string[] {
    let size = 0;
    const pool = TAG_KEYS_BY_ORDER.map((key) => {
        const c = TAG_CENTERS[key];
        const ok = !c.requires && (c.min_ante === undefined || c.min_ante <= ante);
        if (ok) size++;
        return ok ? key : 'UNAVAILABLE';
    });
    return size > 0 ? pool : ['tag_handy'];
}

/**
 * `common_events.lua:1953` 的 `get_next_tag_key`：从池里抽一个，抽到占位就
 * `Tag<ante>_resample<n>` 重抽（n 从 2 起）。
 */
export function nextTagKey(rng: PseudorandomState, ante: number): string {
    const pool = tagPool(ante);
    const poolKey = `Tag${ante}`;
    let [tag] = pseudorandomElement(pool, rng.pseudoseed(poolKey));
    let it = 1;
    while (tag === 'UNAVAILABLE') {
        it++;
        [tag] = pseudorandomElement(pool, rng.pseudoseed(`${poolKey}_resample${it}`));
    }
    return tag!;
}

export function makeTag(key: string, orbitalHand?: HandName): Tag {
    const center = TAG_CENTERS[key];
    if (!center) throw new Error(`没有这个标签：${key}`);
    return { key, center, triggered: false, orbitalHand };
}
