#!/usr/bin/env node
// 从 本地化/en-us.lua 抽 `misc.dictionary` 的纯字符串条目，生成 src/ui/lang.generated.ts（22 号票）。
// UI 定义里的 `localize('k_hud_hands')` 查的就是这张表（`misc_functions.lua` 的 `localize` 默认分支）。
//
//   node tools/gen-localization.mjs
//
// 只收 `key="value",` 与 `["key"]="value",` 两种单行；值是表的条目（多行）跳过，用到时再扩。
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync(new URL('../../../参考/产物/Balatro_1.0.1o/本地化/en-us.lua', import.meta.url), 'utf8');
const lines = src.split(/\r?\n/);
const start = lines.findIndex((l) => /^\s*dictionary=\{\s*$/.test(l));
if (start < 0) throw new Error('没找到 misc.dictionary');
const indent = lines[start].match(/^\s*/)[0];

// Lua 字符串里的转义：本文件只用到 \" \\ \n
const unescape = (s) => s.replace(/\\(["\\n])/g, (_, c) => (c === 'n' ? '\n' : c));

const dict = {};
for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith(`${indent}},`) || line === `${indent}}`) break;
    const m = line.match(/^\s*(?:\["((?:[^"\\]|\\.)*)"\]|([A-Za-z_]\w*))="((?:[^"\\]|\\.)*)",\s*$/);
    if (m) dict[m[1] !== undefined ? unescape(m[1]) : m[2]] = unescape(m[3]);
}

const keys = Object.keys(dict).sort();
const body = keys.map((k) => `    ${JSON.stringify(k)}: ${JSON.stringify(dict[k])},`).join('\n');
writeFileSync(
    new URL('../src/ui/lang.generated.ts', import.meta.url),
    `// 由 tools/gen-localization.mjs 从 本地化/en-us.lua 的 misc.dictionary 生成，不要手改。\nexport const DICTIONARY: Readonly<Record<string, string>> = {\n${body}\n};\n`,
);
console.log(`${keys.length} entries`);
