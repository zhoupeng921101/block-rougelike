/**
 * 把 `game.lua` 里 32 个补充包的 center 抽成 TS。
 *
 * 与另外三个生成器同一套理由：纯数据，手抄不如重跑。
 * 这一份尤其不该手抄——`weight` 那一列是 `get_pack` 的累积权重分母
 * （总和 22.42），抄错一个数就是整张包表的分布偏掉，而那种偏差
 * 得跑几百局才看得出来。
 *
 *     node tools/gen-booster-centers.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { luaTableToJs } from './lua-table.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, '../../../参考/产物/Balatro_1.0.1o/源码/game.lua');
const OUT = resolve(HERE, '../src/core/boosters.generated.ts');

/** `kind` → 期望个数。数字对不上就抛 */
const KINDS = { Arcana: 8, Celestial: 8, Standard: 8, Buffoon: 4, Spectral: 4 };

const lua = readFileSync(SRC, 'utf8');
const lines = lua.split(/\r?\n/).filter((l) => /^ {8}p_\w+\s*=\s*\{/.test(l));
if (lines.length !== 32) throw new Error(`期望 32 个补充包，实际抽到 ${lines.length}`);

const centers = {};
for (const line of lines) {
    const m = /^(p_\w+)\s*=\s*(\{.*\}),?\s*$/.exec(line.trim());
    if (!m) throw new Error(`解析不了这一行：${line}`);
    const [, key, table] = m;
    const raw = luaTableToJs(table);

    centers[key] = {
        order: raw.order,
        name: raw.name,
        kind: raw.kind,
        cost: raw.cost,
        // `get_pack` 的累积权重。缺省 1（原文 `v.weight or 1`），但 32 行全写了
        weight: raw.weight ?? 1,
        pos: raw.pos,
        // `config.extra` = 包里几张，`config.choose` = 能挑几张（缺省 1）
        extra: raw.config.extra,
        choose: raw.config.choose ?? 1,
    };
}

// **按 order 排**：`game.lua:848` 的 `table.sort(P_CENTER_POOLS["Booster"], order)`。
// `get_pack` 的累积权重循环按这个顺序走，打乱它同 seed 立刻分叉
const byOrder = Object.entries(centers).sort((a, b) => a[1].order - b[1].order);

const tally = {};
for (const [, c] of byOrder) tally[c.kind] = (tally[c.kind] ?? 0) + 1;
for (const [kind, expected] of Object.entries(KINDS)) {
    if (tally[kind] !== expected) throw new Error(`${kind} 期望 ${expected} 个，实际 ${tally[kind]}`);
}

const body = byOrder.map(([k, c]) => `    ${k}: ${JSON.stringify(c)},`).join('\n');

writeFileSync(
    OUT,
    `/**
 * 32 个补充包的 center。**这个文件是生成的，不要手改**——
 * 改 \`tools/gen-booster-centers.mjs\` 然后重跑
 * \`node tools/gen-booster-centers.mjs\`。
 *
 * 源：\`参考/产物/Balatro_1.0.1o/源码/game.lua:666-697\`。
 * 图集是 \`boosters.png\`（\`BOOSTER_ATLAS\`）。
 */

import type { BoosterCenter } from './boosters';

export const BOOSTER_CENTERS: Record<string, BoosterCenter> = {
${body}
};

/**
 * 按 \`order\` 排好的 key。**\`getPack\` 的累积权重循环按这个顺序走**，
 * 打乱它会让同 seed 抽到不一样的包。别改成 \`Object.keys\`。
 */
export const BOOSTER_KEYS_BY_ORDER: string[] = [
${byOrder.map(([k]) => `    '${k}',`).join('\n')}
];
`,
    'utf8',
);

console.log(
    `写出 ${byOrder.length} 个补充包 → ${OUT}\n` +
    Object.entries(tally).map(([k, n]) => `  ${k}: ${n}`).join('\n'),
);
