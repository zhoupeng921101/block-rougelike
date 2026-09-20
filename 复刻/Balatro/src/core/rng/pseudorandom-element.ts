/**
 * `pseudorandom_element`。直译自
 * `参考/产物/Balatro_1.0.1o/源码/functions/misc_functions.lua:256`。
 *
 * ```lua
 * function pseudorandom_element(_t, seed)
 *   if seed then math.randomseed(seed) end
 *   local keys = {}
 *   for k, v in pairs(_t) do keys[#keys+1] = {k = k, v = v} end
 *   if keys[1] and keys[1].v and type(keys[1].v) == 'table' and keys[1].v.sort_id then
 *     table.sort(keys, function (a, b) return a.v.sort_id < b.v.sort_id end)
 *   else
 *     table.sort(keys, function (a, b) return a.k < b.k end)
 *   end
 *   local key = keys[math.random(#keys)].k
 *   return _t[key], key
 * end
 * ```
 *
 * ## 为什么那两次排序是语义而不是洁癖
 *
 * `pairs` 的遍历顺序在 Lua 里是**哈希序，不保证稳定**。原作因此在取随机元素之前
 * 强制排一次序——不排的话同一个 seed 在不同 Lua 版本／不同插入历史下会抽到不同的东西。
 * 所以这次排序是**结果的一部分**，复刻时必须照做：
 *
 * - **数组**（键是 1..n）：按键排 = 保持原顺序。
 * - **以字符串为键的表**（比如 `get_new_boss` 的 `eligible_bosses`）：
 *   **按 key 的字母序**。这是 Boss 抽取的池子顺序，不是 `order`。
 * - **值是带 `sort_id` 的表**（比如一堆 `Card`）：按 `sort_id`。
 *   只看 `keys[1]`——**第一个元素有 `sort_id` 就认为整份都有**，原文如此，别改成全量检查。
 */

import { random, randomseed } from './luajit-random';

type Keyed<V> = Record<string, V> | Record<number, V>;

/**
 * 返回 `[元素, key]`。key 对数组是**数字下标（0-based）**，对表是字符串键。
 *
 * 注意与原作的下标差异：Lua 返回 1-based 的数组下标，这里返回 JS 的 0-based，
 * 这样 `splice(key, 1)` 能直接用（`The Hook` 抽完要从候选池里删）。
 */
export function pseudorandomElement<V>(
    table: V[] | Keyed<V>,
    seed: number,
): [V | undefined, string | number | undefined] {
    const generator = randomseed(seed);

    const entries: Array<{ k: string | number; v: V }> = Array.isArray(table)
        ? table.map((v, i) => ({ k: i, v }))
        : Object.entries(table).map(([k, v]) => ({ k, v: v as V }));

    if (entries.length === 0) return [undefined, undefined];

    const first = entries[0].v as unknown as { sort_id?: number } | null;
    const bySortId = first !== null && typeof first === 'object' && first.sort_id !== undefined;

    if (bySortId) {
        entries.sort(
            (a, b) =>
                ((a.v as unknown as { sort_id: number }).sort_id ?? 0) -
                ((b.v as unknown as { sort_id: number }).sort_id ?? 0),
        );
    } else {
        entries.sort((a, b) => {
            // 数组的键是数字、表的键是字符串。Lua 的 `<` 对两者分别是数值序与字节序，
            // JS 的 `<` 对 ASCII 字符串同为字节序，所以分开处理就够
            if (typeof a.k === 'number' && typeof b.k === 'number') return a.k - b.k;
            return String(a.k) < String(b.k) ? -1 : String(a.k) > String(b.k) ? 1 : 0;
        });
    }

    // `math.random(#keys)` 返回 1..n
    const picked = entries[random(generator, 1, entries.length) - 1];
    return [picked.v, picked.k];
}
