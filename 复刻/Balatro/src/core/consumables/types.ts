/**
 * 消耗品的数据模型。
 *
 * 与小丑同一套三层划分（见 `jokers/types.ts`）：
 * - **center**（`ConsumableCenter`）：`P_CENTERS` 里那一行，不可变，34 张
 * - **instance**（`Consumable`）：一张具体的消耗品
 *
 * 但比小丑**少一层**：消耗品没有 `ability` 那样的可变运行时状态。
 * `card.lua:277` 的 `set_ability` 对消耗品只摊平 `consumeable = center.config`，
 * 而塔罗／星球的 config 在使用后不会被改写（会长大的是幽灵牌里的
 * `Ectoplasm`，而它不在本票）。所以这里直接引用 center 的 config，不复制。
 */

import type { HandName } from '../poker-hands';

/** 塔罗与星球两个 set。幽灵牌在 17 号票，那时加 `'Spectral'` */
export type ConsumableSet = 'Tarot' | 'Planet';

/** `P_CENTERS` 里的一行。由 `tools/gen-consumable-centers.mjs` 生成，运行时只读。 */
export type ConsumableCenter = {
    order: number;
    set: ConsumableSet;
    cost: number;
    name: string;
    /** 在 `TAROT_ATLAS` 网格里的坐标。**三个 set 共用一张图集**，pos 不按 set 分区 */
    pos: { x: number; y: number };
    /** `P_CENTERS` 的 `effect` 字段。只喂 UI 分类，机制判定一律按 `name` 走 */
    effect?: string;
    /** Lua 的 `config`，字段随卡而异 —— 03 号票认了直译带进来的弱类型 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any>;
};

/** 一张具体的消耗品。 */
export type Consumable = {
    key: string;
    center: ConsumableCenter;
    /** `card.lua:370` 算出来的买入价 */
    cost: number;
    /** 卖价。`max(1, floor(cost/2))`，与小丑同一条 */
    sell_cost: number;
};

/**
 * 星球牌的 config。`hand_type` 是它要升的牌型，`softlock` 表示
 * **对应牌型打出过才进池**（`common_events.lua:2044`）——
 * Planet X / Ceres / Eris 三张有它，所以新档的星球池是 12 个位置、9 张可用。
 */
export type PlanetConfig = {
    hand_type: HandName;
    softlock?: boolean;
};
