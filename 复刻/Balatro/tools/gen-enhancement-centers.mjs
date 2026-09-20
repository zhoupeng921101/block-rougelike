/**
 * 把 `game.lua` 里 8 张强化牌（`m_` 开头，`set = "Enhanced"`）的 center 抽成 TS。
 *
 * 8 行确实能手抄，但抄进来的数字（`bonus = 30` / `Xmult = 2` / `extra = 4`）
 * 全是结算公式里的常数，抄错一个就是一条只在特定牌型下出现的分数偏差。
 * 与另外三个生成器同一套理由。
 *
 *     node tools/gen-enhancement-centers.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { luaTableToJs } from './lua-table.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, '../../../参考/产物/Balatro_1.0.1o/源码/game.lua');
const OUT = resolve(HERE, '../src/core/enhancements.generated.ts');

const lua = readFileSync(SRC, 'utf8');
const lines = lua.split(/\r?\n/).filter((l) => /^ {8}m_\w+\s*=\s*\{/.test(l));
if (lines.length !== 8) throw new Error(`期望 8 张强化牌，实际抽到 ${lines.length}`);

const centers = {};
for (const line of lines) {
    const m = /^(m_\w+)\s*=\s*(\{.*\}),?\s*$/.exec(line.trim());
    if (!m) throw new Error(`解析不了这一行：${line}`);
    const [, key, table] = m;
    const raw = luaTableToJs(table);

    centers[key] = {
        order: raw.order,
        name: raw.name,
        // **机制判定读 `effect` 不读 `name`**：`card.lua` 里石头牌查的是
        // `ability.effect == 'Stone Card'`，而玻璃牌查的是 `ability.name == 'Glass Card'`。
        // 两个字段在这 8 张上恰好都存在且一一对应，但照抄两个、按原文各查各的
        effect: raw.effect,
        pos: raw.pos,
        config: raw.config ?? {},
    };
}

const byOrder = Object.entries(centers).sort((a, b) => a[1].order - b[1].order);
const body = byOrder.map(([k, c]) => `    ${k}: ${JSON.stringify(c)},`).join('\n');

writeFileSync(
    OUT,
    `/**
 * 8 张强化牌的 center。**这个文件是生成的，不要手改**——
 * 改 \`tools/gen-enhancement-centers.mjs\` 然后重跑
 * \`node tools/gen-enhancement-centers.mjs\`。
 *
 * 源：\`参考/产物/Balatro_1.0.1o/源码/game.lua:649-656\`。
 * 图集是 \`Enhancers.png\`（\`CENTERS_ATLAS\`），与卡牌底板同一张。
 */

import type { EnhancementCenter } from './enhancements';

export const ENHANCEMENT_CENTERS: Record<string, EnhancementCenter> = {
${body}
};

/** 按 \`order\` 排好的 key。\`P_CENTER_POOLS.Enhanced\` 的顺序 */
export const ENHANCEMENT_KEYS_BY_ORDER: string[] = [
${byOrder.map(([k]) => `    '${k}',`).join('\n')}
];
`,
    'utf8',
);

console.log(`写出 ${byOrder.length} 张强化牌 → ${OUT}`);
