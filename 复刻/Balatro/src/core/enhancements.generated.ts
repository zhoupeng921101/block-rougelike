/**
 * 8 张强化牌的 center。**这个文件是生成的，不要手改**——
 * 改 `tools/gen-enhancement-centers.mjs` 然后重跑
 * `node tools/gen-enhancement-centers.mjs`。
 *
 * 源：`参考/产物/Balatro_1.0.1o/源码/game.lua:649-656`。
 * 图集是 `Enhancers.png`（`CENTERS_ATLAS`），与卡牌底板同一张。
 */

import type { EnhancementCenter } from './enhancements';

export const ENHANCEMENT_CENTERS: Record<string, EnhancementCenter> = {
    m_bonus: {"order":2,"name":"Bonus","effect":"Bonus Card","pos":{"x":1,"y":1},"config":{"bonus":30}},
    m_mult: {"order":3,"name":"Mult","effect":"Mult Card","pos":{"x":2,"y":1},"config":{"mult":4}},
    m_wild: {"order":4,"name":"Wild Card","effect":"Wild Card","pos":{"x":3,"y":1},"config":{}},
    m_glass: {"order":5,"name":"Glass Card","effect":"Glass Card","pos":{"x":5,"y":1},"config":{"Xmult":2,"extra":4}},
    m_steel: {"order":6,"name":"Steel Card","effect":"Steel Card","pos":{"x":6,"y":1},"config":{"h_x_mult":1.5}},
    m_stone: {"order":7,"name":"Stone Card","effect":"Stone Card","pos":{"x":5,"y":0},"config":{"bonus":50}},
    m_gold: {"order":8,"name":"Gold Card","effect":"Gold Card","pos":{"x":6,"y":0},"config":{"h_dollars":3}},
    m_lucky: {"order":9,"name":"Lucky Card","effect":"Lucky Card","pos":{"x":4,"y":1},"config":{"mult":20,"p_dollars":20}},
};

/** 按 `order` 排好的 key。`P_CENTER_POOLS.Enhanced` 的顺序 */
export const ENHANCEMENT_KEYS_BY_ORDER: string[] = [
    'm_bonus',
    'm_mult',
    'm_wild',
    'm_glass',
    'm_steel',
    'm_stone',
    'm_gold',
    'm_lucky',
];
