/**
 * 把 `game.lua` 里 150 张小丑的 center 定义抽成 TS。
 *
 * 为什么用生成器而不是手抄：那 150 行是**纯数据**（order / rarity / cost / config），
 * 手抄 150 行 Lua 表字面量的错误率远高于写一个 30 行的解析器，
 * 而且原作改一个数值时重跑一遍就行。
 *
 * 为什么不读 `配置CSV/`：那是研究产物，隔了一层（见 06 号票与 `复刻/README.md`）。
 * 这里读的是 `参考/产物/Balatro_1.0.1o/源码/game.lua` 本身。
 *
 *     node tools/gen-joker-centers.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { luaTableToJs } from './lua-table.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, '../../../参考/产物/Balatro_1.0.1o/源码/game.lua');
const OUT = resolve(HERE, '../src/core/jokers/centers.generated.ts');

const lua = readFileSync(SRC, 'utf8');

// 150 行小丑定义，每行形如 `        j_joker=            {order = 1, ...},`
const lines = lua.split(/\r?\n/).filter((l) => /^ {8}j_\w+\s*=\s*\{/.test(l));
if (lines.length !== 150) throw new Error(`期望 150 张小丑，实际抽到 ${lines.length}`);

const centers = {};
for (const line of lines) {
    const m = /^ {8}(j_\w+)\s*=\s*(\{.*\}),?\s*$/.exec(line.trim().replace(/^/, '        '));
    if (!m) throw new Error(`解析不了这一行：${line}`);
    const [, key, table] = m;
    const raw = luaTableToJs(table);

    // 只留复刻用得上的字段。`demo` / `discovered` / `start_alerted` / `pos` 是
    // 局外解锁与图集坐标，前者不在范围、后者由 atlas.ts 按 pos 推导——但 pos 要留。
    centers[key] = {
        order: raw.order,
        rarity: raw.rarity,
        cost: raw.cost,
        name: raw.name,
        pos: raw.pos,
        soul_pos: raw.soul_pos,
        blueprint_compat: raw.blueprint_compat ?? false,
        unlocked: raw.unlocked ?? false,
        config: raw.config ?? {},
        effect: raw.effect,
        // 池子门禁。只有 Gros Michel（灭绝后退池）与 Cavendish（灭绝后才进池）用
        no_pool_flag: raw.no_pool_flag,
        yes_pool_flag: raw.yes_pool_flag,
    };
}

const byOrder = Object.entries(centers).sort((a, b) => a[1].order - b[1].order);

const body = byOrder
    .map(([key, c]) => `    ${key}: ${JSON.stringify(c)},`)
    .join('\n');

writeFileSync(
    OUT,
    `/**
 * 150 张小丑的 center 定义。**这个文件是生成的，不要手改**——
 * 改 \`tools/gen-joker-centers.mjs\` 然后重跑 \`node tools/gen-joker-centers.mjs\`。
 *
 * 源：\`参考/产物/Balatro_1.0.1o/源码/game.lua\` 的 \`P_CENTERS\` 小丑段（150 行）。
 * 只留了复刻用得上的字段，按 \`order\` 排序——**顺序有意义**：
 * \`get_current_pool\` 按 order 建池，池内下标决定 \`pseudorandom_element\` 抽到谁，
 * 打乱这个顺序会让同 seed 的商店与原版分叉。
 */

import type { JokerCenter } from './types';

export const JOKER_CENTERS: Record<string, JokerCenter> = {
${body}
};

/** 按 order 排好的 key 列表。池子构建读这个，不要读 Object.keys。 */
export const JOKER_KEYS_BY_ORDER: string[] = [
${byOrder.map(([k]) => `    '${k}',`).join('\n')}
];
`,
    'utf8',
);

console.log(`写出 ${byOrder.length} 张小丑 → ${OUT}`);
