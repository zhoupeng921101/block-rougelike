/**
 * 把 `game.lua` 里 32 张优惠券（`P_CENTERS` 里 `v_` 开头、`set = "Voucher"`）抽成 TS。
 *
 * `unlocked` 必须抄：二级优惠券在新档里是 `false`，`get_current_pool` 靠它把它们换成 `UNAVAILABLE`。
 * `config.extra` 有两处是算式（`9.6/4`、`32/4`），共用解析器走 `new Function`，会被算出来。
 *
 *     node tools/gen-voucher-centers.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { luaTableToJs } from './lua-table.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, '../../../参考/产物/Balatro_1.0.1o/源码/game.lua');
const OUT = resolve(HERE, '../src/core/vouchers.generated.ts');

const lua = readFileSync(SRC, 'utf8');
const lines = lua.split(/\r?\n/).filter((l) => /^ {8}v_\w+\s*=\s*\{.*set = "Voucher"/.test(l));
if (lines.length !== 32) throw new Error(`期望 32 张优惠券，实际抽到 ${lines.length}`);

const centers = {};
for (const line of lines) {
    const m = /^(v_\w+)\s*=\s*(\{.*\}),?\s*$/.exec(line.trim());
    if (!m) throw new Error(`解析不了这一行：${line}`);
    const [, key, table] = m;
    // `requires = {'v_hone'}` 是 Lua 的数组表，共用解析器只认键值表。在这里改成方括号，不去动它
    const raw = luaTableToJs(table.replace(/requires = \{([^}]*)\}/, 'requires = [$1]'));
    centers[key] = {
        order: raw.order,
        name: raw.name,
        cost: raw.cost,
        unlocked: raw.unlocked,
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
 * 32 张优惠券的 center。**这个文件是生成的，不要手改**——
 * 改 \`tools/gen-voucher-centers.mjs\` 然后重跑 \`node tools/gen-voucher-centers.mjs\`。
 *
 * 源：\`参考/产物/Balatro_1.0.1o/源码/game.lua:593-625\`。图集是 \`Vouchers.png\`。
 */

import type { VoucherCenter } from './vouchers';

export const VOUCHER_CENTERS: Record<string, VoucherCenter> = {
${body}
};

/** 按 \`order\` 排好的 key。\`P_CENTER_POOLS.Voucher\` 的顺序（\`game.lua:851\` 按 order 排） */
export const VOUCHER_KEYS_BY_ORDER: string[] = [
${byOrder.map(([k]) => `    '${k}',`).join('\n')}
];
`,
    'utf8',
);

console.log(`写出 ${byOrder.length} 张优惠券 → ${OUT}`);
