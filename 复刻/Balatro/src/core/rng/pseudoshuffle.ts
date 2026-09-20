import { random, randomseed } from './luajit-random';

/**
 * `pseudoshuffle(list, seed)` —— 对应
 * `参考/产物/Balatro_1.0.1o/源码/functions/misc_functions.lua:209`。
 *
 * 两处调用点：
 * - `game.lua:2600` 开局 `deck:shuffle()`，key 取默认值 `'shuffle'`
 * - `functions/state_events.lua:365` 每回合开始 `deck:shuffle('nr'..ante)`，
 *   Ante 1 即 `'nr1'`
 *
 * 与 `pseudorandom` 的关键差别：**只播种一次，然后连抽**。
 * `pseudorandom` 是每次调用都重新播种。
 *
 * 排序那一步不是装饰：`table.sort` 把列表归到一个与内存布局无关的规范序，
 * 洗牌结果才可复现。`sort_id` 是全局自增计数器（`card.lua:24`）。
 */
export function pseudoshuffle<T extends { sort_id?: number }>(list: T[], seed: number): void {
    const generator = randomseed(seed);

    // 原版是 `if list[1] and list[1].sort_id then` —— 只看第一个元素
    if (list[0]?.sort_id !== undefined) {
        list.sort((a, b) => (a.sort_id ?? 1) - (b.sort_id ?? 2));
    }

    // 倒序 Fisher–Yates。Lua 的下标 1-based，这里换算成 0-based：
    // `j = math.random(i)` 取 [1, i]，对应 JS 的 [0, i-1]
    for (let i = list.length; i >= 2; i--) {
        const j = random(generator, i);
        const a = i - 1;
        const b = j - 1;
        [list[a], list[b]] = [list[b], list[a]];
    }
}
