/**
 * 把 `game.lua` 里 24 个标签（`P_TAGS`，`tag_` 开头）抽成 TS。
 *
 * 与另外几个生成器同一套理由：`min_ante` / `requires` / `config` 全是池子与效果的判据，
 * 抄错一个就是某个 Ante 起池子长度不对、整条 `Tag<ante>` 抽取链分叉。
 *
 *     node tools/gen-tag-centers.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { luaTableToJs } from './lua-table.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, '../../../参考/产物/Balatro_1.0.1o/源码/game.lua');
const OUT = resolve(HERE, '../src/core/tags.generated.ts');

const lua = readFileSync(SRC, 'utf8');
const lines = lua.split(/\r?\n/).filter((l) => /^ {8}tag_\w+\s*=\s*\{/.test(l));
if (lines.length !== 24) throw new Error(`期望 24 个标签，实际抽到 ${lines.length}`);

const centers = {};
for (const line of lines) {
    const m = /^(tag_\w+)\s*=\s*(\{.*\}),?\s*$/.exec(line.trim());
    if (!m) throw new Error(`解析不了这一行：${line}`);
    const [, key, table] = m;
    // `min_ante = nil` 在 Lua 里等于没写这个字段。共用的解析器不认 `nil`，
    // 在这里剔掉，不去动它（另外四个生成器都没遇到过）
    const raw = luaTableToJs(table.replace(/\w+\s*=\s*nil\s*,?/g, ''));
    centers[key] = {
        order: raw.order,
        name: raw.name,
        // `min_ante = nil` 表示不限 Ante
        ...(raw.min_ante !== undefined ? { min_ante: raw.min_ante } : {}),
        ...(raw.requires !== undefined ? { requires: raw.requires } : {}),
        pos: raw.pos,
        config: raw.config ?? {},
    };
}

const byOrder = Object.entries(centers).sort((a, b) => a[1].order - b[1].order);
const body = byOrder.map(([k, c]) => `    ${k}: ${JSON.stringify(c)},`).join('\n');

writeFileSync(
    OUT,
    `/**
 * 24 个标签的 center。**这个文件是生成的，不要手改**——
 * 改 \`tools/gen-tag-centers.mjs\` 然后重跑 \`node tools/gen-tag-centers.mjs\`。
 *
 * 源：\`参考/产物/Balatro_1.0.1o/源码/game.lua:228-251\`。图集是 \`tags.png\`。
 */

import type { TagCenter } from './tags';

export const TAG_CENTERS: Record<string, TagCenter> = {
${body}
};

/** 按 \`order\` 排好的 key。\`P_CENTER_POOLS.Tag\` 的顺序（\`game.lua:857\` 按 order 排） */
export const TAG_KEYS_BY_ORDER: string[] = [
${byOrder.map(([k]) => `    '${k}',`).join('\n')}
];
`,
    'utf8',
);

console.log(`写出 ${byOrder.length} 个标签 → ${OUT}`);
