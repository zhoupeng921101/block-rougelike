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

// Lua 字符串里的转义：本文件只用到 \" \\ \n
const unescape = (s) => s.replace(/\\(["\\n])/g, (_, c) => (c === 'n' ? '\n' : c));

/** `misc.<name>={ ... }` 里的单行字符串条目 */
function flatSection(name) {
    const start = lines.findIndex((l) => l.trim() === `${name}={`);
    if (start < 0) throw new Error(`没找到 misc.${name}`);
    const indent = lines[start].match(/^\s*/)[0];
    const out = {};
    for (let i = start + 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith(`${indent}},`) || line === `${indent}}`) break;
        const m = line.match(/^\s*(?:\["((?:[^"\\]|\\.)*)"\]|([A-Za-z_]\w*))="((?:[^"\\]|\\.)*)",\s*$/);
        if (m) out[m[1] !== undefined ? unescape(m[1]) : m[2]] = unescape(m[3]);
    }
    return out;
}

const dict = flatSection('dictionary');
// `localize{type = 'variable', key = ...}` 查的是 `misc.v_dictionary`（`#1#` 占位符原样保留）
const vdict = flatSection('v_dictionary');
const flat = (d) => Object.keys(d).sort().map((k) => `    ${JSON.stringify(k)}: ${JSON.stringify(d[k])},`).join('\n');
const body = flat(dict);
const vBody = flat(vdict);

// descriptions.Blind：每个盲注的 name 与 text（debuff 描述，按行）。左上盲注面板要（`Blind:set_text`）
const blindStart = lines.findIndex((l) => /^ {8}Blind=\{\s*$/.test(l));
if (blindStart < 0) throw new Error('没找到 descriptions.Blind');
const blinds = {};
let cur = null;
let inText = false;
for (let i = blindStart + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^ {8}\},?\s*$/.test(line)) break;
    let m;
    if ((m = line.match(/^ {12}(bl_\w+)=\{\s*$/))) cur = blinds[m[1]] = { name: '', text: [] };
    else if (cur && (m = line.match(/^ {16}name="((?:[^"\\]|\\.)*)",\s*$/))) cur.name = unescape(m[1]);
    else if (cur && /^ {16}text=\{\s*$/.test(line)) inText = true;
    else if (cur && inText && (m = line.match(/^ {20}"((?:[^"\\]|\\.)*)",\s*$/))) cur.text.push(unescape(m[1]));
    else if (inText && /^ {16}\},?\s*$/.test(line)) inText = false;
}
const blindBody = Object.keys(blinds).sort()
    .map((k) => `    ${k}: ${JSON.stringify(blinds[k])},`).join('\n');

writeFileSync(
    new URL('../src/ui/lang.generated.ts', import.meta.url),
    `// 由 tools/gen-localization.mjs 从 本地化/en-us.lua 生成，不要手改。\n` +
    `/** \`misc.dictionary\` 的纯字符串条目 */\nexport const DICTIONARY: Readonly<Record<string, string>> = {\n${body}\n};\n\n` +
    `/** \`misc.v_dictionary\`：带 \`#1#\` 占位符的条目（\`localize{type = 'variable'}\`） */\n` +
    `export const V_DICTIONARY: Readonly<Record<string, string>> = {\n${vBody}\n};\n\n` +
    `/** \`descriptions.Blind\`：盲注名与描述行（\`{#1#}\` 这类占位符原样保留） */\n` +
    `export const BLIND_TEXT: Readonly<Record<string, { name: string; text: string[] }>> = {\n${blindBody}\n};\n`,
);
console.log(`${Object.keys(dict).length} dictionary, ${Object.keys(vdict).length} v_dictionary, ${Object.keys(blinds).length} blinds`);
