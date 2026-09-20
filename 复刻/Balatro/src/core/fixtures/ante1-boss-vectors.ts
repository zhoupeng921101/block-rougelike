/**
 * Ante 1 Boss Blind 的 12 条外部真值。
 *
 * **这是本工程唯一的外部 ground truth**——不依赖实机、不依赖素材，
 * 来自四个互不相干的渠道（balatrowiki / balatrohq / Blueprint fixture / balatro4j）。
 * 推导见 `.scratch/balatro-复刻/research/02-LuaJIT-RNG.md` §9。
 *
 * 它被**两层**同时消费，这是有意的：
 * - `rng/rng.test.ts` 用它验 RNG 层（手写一遍 `pseudorandom('boss', 1, 8)`）
 * - `blinds.test.ts` 用它验**生产代码**（真的走 `getNewBoss`）
 *
 * 前者证明算法对，后者证明**接线对**——`get_new_boss` 的池子顺序是 key 的字母序、
 * 池子大小受 `bosses_used` 最小值过滤影响，这两件事只有后者能抓到。
 * 所以这份 fixture 放在 `fixtures/` 而不是某个 test 文件里，两边引同一份。
 */

/**
 * `boss.min <= 1` 且非 showdown 的 8 个，**按 key 的字母序**
 * （`bl_club` / `bl_goad` / `bl_head` / `bl_hook` / `bl_manacle` /
 * `bl_pillar` / `bl_psychic` / `bl_window`）。
 *
 * 出处 `源码/game.lua:266` 的 `P_BLINDS` 与
 * `源码/functions/common_events.lua:2387` 的 `get_new_boss`。
 */
export const ANTE_1_BOSSES = [
    'The Club',
    'The Goad',
    'The Head',
    'The Hook',
    'The Manacle',
    'The Pillar',
    'The Psychic',
    'The Window',
] as const;

export const ANTE_1_BOSS_VECTORS: ReadonlyArray<readonly [string, string]> = [
    ['TUTORIAL', 'The Hook'], // balatrowiki The_Hook 的 Trivia
    ['ALEEB', 'The Window'], // balatrohq seed-analyzer 的默认示例
    ['7LB2WVPK', 'The Club'], // 以下 9 条为 Blueprint fixture（gameVersion 10106 = 1.0.1o）
    ['3SZ71111', 'The Head'],
    ['2K9H9HN', 'The Club'],
    ['7ODNKXP', 'The Manacle'],
    ['9ZXMM1M', 'The Hook'],
    ['U8RJYV6M', 'The Club'],
    ['V3PUR5L4', 'The Pillar'],
    ['VNOMH111', 'The Hook'],
    ['SF9SZOB1', 'The Head'],
    ['JHZ7FPM', 'The Head'], // balatro4j BalatroTests.java
];
