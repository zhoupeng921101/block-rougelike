/**
 * 把 `game.lua` 里 30 条盲注定义抽成 TS：**小盲注 + 大盲注 + 28 个 Boss**。
 *
 * 与 `gen-joker-centers.mjs` 同一套理由：纯数据，手抄不如重跑。
 * 多一处麻烦：盲注的 `vars` 字段里有 `localize('ph_most_played')` 调用，
 * 那是本地化文本、复刻层不需要，所以解析前先把整个 `vars = {...}` 剪掉。
 *
 *     node tools/gen-blind-centers.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { luaTableToJs } from './lua-table.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, '../../../参考/产物/Balatro_1.0.1o/源码/game.lua');
const OUT = resolve(HERE, '../src/core/blinds.generated.ts');

const lua = readFileSync(SRC, 'utf8');
const lines = lua.split(/\r?\n/).filter((l) => /^ {8}bl_\w+\s*=\s*\{/.test(l));
// 30 = bl_small + bl_big + 28 个 Boss。「28 个 Boss 盲注」这个常说的数字
// 指的是带 `boss` 字段的那些，不含前两个
if (lines.length !== 30) throw new Error(`期望 30 条盲注定义，实际抽到 ${lines.length}`);

const blinds = {};
for (const line of lines) {
    const m = /^(bl_\w+)\s*=\s*(\{.*?\}),?$/.exec(line.trim());
    if (!m) throw new Error(`解析不了这一行：${line}`);
    const [, key, table] = m;

    // `vars = {localize(...)}` → `vars = {}`。本地化不进复刻层
    // `boss_colour = HEX('xxxxxx')` → 去掉，颜色由表现层自己定
    const cleaned = table
        .replace(/vars\s*=\s*\{[^}]*\}/g, 'vars = {}')
        .replace(/,\s*boss_colour\s*=\s*HEX\([^)]*\)/g, '');

    const raw = luaTableToJs(cleaned);
    blinds[key] = {
        order: raw.order,
        name: raw.name,
        dollars: raw.dollars,
        mult: raw.mult,
        pos: raw.pos,
        boss: raw.boss ?? null,
        debuff: raw.debuff ?? {},
    };
}

const entries = Object.entries(blinds).sort((a, b) => a[1].order - b[1].order);

writeFileSync(
    OUT,
    `/**
 * 30 条盲注定义：小盲注 + 大盲注 + 28 个 Boss。**这个文件是生成的，不要手改**——
 * 改 \`tools/gen-blind-centers.mjs\` 然后重跑 \`node tools/gen-blind-centers.mjs\`。
 *
 * 源：\`参考/产物/Balatro_1.0.1o/源码/game.lua:266-298\` 的 \`P_BLINDS\`。
 *
 * **key 的字母序有意义**：\`get_new_boss\` 走 \`pseudorandom_element(eligible, …)\`，
 * 而 \`eligible\` 是一张**以 key 为键的表**，\`pseudorandom_element\` 对这种表
 * 按 key 的字符串序排（\`misc_functions.lua:266\`）。所以抽 boss 的池子顺序
 * 是 key 的字母序，不是 \`order\`。
 *
 * \`vars\`（本地化文本）与 \`boss_colour\` 没有抽进来：前者不属于复刻层，
 * 后者由表现层自己定。
 */

import type { BlindCenter } from './blinds';

export const BLIND_CENTERS: Record<string, BlindCenter> = {
${entries.map(([k, b]) => `    ${k}: ${JSON.stringify(b)},`).join('\n')}
};
`,
    'utf8',
);

const bosses = entries.filter(([, b]) => b.boss).length;
if (bosses !== 28) throw new Error(`期望 28 个 Boss，实际 ${bosses}`);
console.log(`写出 ${entries.length} 条盲注（其中 Boss ${bosses} 个） → ${OUT}`);
