/**
 * 把 `game.lua` 里塔罗（22）与星球（12）的 center 定义抽成 TS。
 *
 * 与 `gen-joker-centers.mjs` 同一套理由：纯数据，手抄不如重跑。
 *
 * **幽灵牌（18 张 `set = "Spectral"`）故意不抽**：
 * `G.GAME.spectral_rate` 默认 0，商店永远不出幽灵牌，它只能从幽灵补充包
 * 与 The Soul 来，而那两样都在 17 号票。抽了也没有池子装得下它，
 * 只会变成一堆「有数值没行为」的 center。接补充包时把 `SETS` 加一行即可。
 *
 *     node tools/gen-consumable-centers.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { luaTableToJs } from './lua-table.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, '../../../参考/产物/Balatro_1.0.1o/源码/game.lua');
const OUT = resolve(HERE, '../src/core/consumables/centers.generated.ts');

/** `set` → 期望张数。数字对不上就抛，这是唯一能挡住「原作改了表」的那道闸 */
const SETS = { Tarot: 22, Planet: 12 };

const lua = readFileSync(SRC, 'utf8');

// `c_` 开头的 center 共 53 行，其中 `c_base` 是 `set = "Default"` 的底板，不要
const lines = lua.split(/\r?\n/).filter((l) => /^ {8}c_\w+\s*=\s*\{/.test(l));
if (lines.length !== 53) throw new Error(`期望 53 行 c_ 定义，实际抽到 ${lines.length}`);

const centers = {};
for (const line of lines) {
    const m = /^(c_\w+)\s*=\s*(\{.*\}),?\s*$/.exec(line.trim());
    if (!m) throw new Error(`解析不了这一行：${line}`);
    const [, key, table] = m;
    const raw = luaTableToJs(table);

    if (!(raw.set in SETS)) continue;

    // 丢掉的字段：`discovered` / `cost_mult` / `freq` / `demo` / `hidden`
    // 是局外解锁与商店定价倍率，不在范围。`pos` 要留，图集坐标由 atlas.ts 推导
    centers[key] = {
        order: raw.order,
        set: raw.set,
        cost: raw.cost,
        name: raw.name,
        pos: raw.pos,
        effect: raw.effect,
        config: raw.config ?? {},
    };
}

const bySet = {};
for (const [set, expected] of Object.entries(SETS)) {
    // **按 order 排**：`game.lua:847` 的 `table.sort(P_CENTER_POOLS[set], order)`。
    // 池内下标决定 `pseudorandom_element` 抽到谁，打乱它同 seed 就分叉
    const keys = Object.entries(centers)
        .filter(([, c]) => c.set === set)
        .sort((a, b) => a[1].order - b[1].order)
        .map(([k]) => k);
    if (keys.length !== expected) throw new Error(`${set} 期望 ${expected} 张，实际 ${keys.length}`);
    bySet[set] = keys;
}

const all = [...bySet.Tarot, ...bySet.Planet];
const body = all.map((k) => `    ${k}: ${JSON.stringify(centers[k])},`).join('\n');

writeFileSync(
    OUT,
    `/**
 * 塔罗 22 张 + 星球 12 张的 center 定义。**这个文件是生成的，不要手改**——
 * 改 \`tools/gen-consumable-centers.mjs\` 然后重跑
 * \`node tools/gen-consumable-centers.mjs\`。
 *
 * 源：\`参考/产物/Balatro_1.0.1o/源码/game.lua\` 的 \`P_CENTERS\` 消耗品段。
 * 幽灵牌不在这里，理由见生成器的文件头注释。
 */

import type { ConsumableCenter } from './types';

export const CONSUMABLE_CENTERS: Record<string, ConsumableCenter> = {
${body}
};

/**
 * 按 \`order\` 排好的 key，**按 set 分开**。\`getCurrentPool\` 读这个建池。
 *
 * **顺序有意义**：池内下标决定 \`pseudorandom_element\` 抽到谁，
 * 打乱它会让同 seed 的商店与原版分叉。别改成 \`Object.keys\`。
 */
export const CONSUMABLE_KEYS_BY_SET = {
${Object.entries(bySet)
    .map(([set, keys]) => `    ${set}: [\n${keys.map((k) => `        '${k}',`).join('\n')}\n    ],`)
    .join('\n')}
} as const;
`,
    'utf8',
);

console.log(`写出 ${all.length} 张消耗品（塔罗 ${bySet.Tarot.length} / 星球 ${bySet.Planet.length}） → ${OUT}`);
