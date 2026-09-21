#!/usr/bin/env node
// 从 m6x11plus.ttf 抽字宽与行高，生成 src/ui/font.generated.ts（22 号票）。
//
// UI 布局要知道每段文字多宽（`UIBox:calculate_xywh` 用 `FONT:getWidth`，`DynaText` 逐字量），
// 离线算出来布局就不依赖浏览器排版、能进单测。读的是 `public/assets/fonts/m6x11plus.ttf`，
// 与 `参考/产物/Balatro_1.0.1o/资源/fonts/` 里的是同一个文件。
//
//   node tools/gen-font-metrics.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const buf = readFileSync(new URL('../public/assets/fonts/m6x11plus.ttf', import.meta.url));
const u16 = (o) => buf.readUInt16BE(o);
const i16 = (o) => buf.readInt16BE(o);
const u32 = (o) => buf.readUInt32BE(o);

const tables = {};
for (let i = 0, n = u16(4); i < n; i++) {
    const rec = 12 + i * 16;
    tables[buf.toString('latin1', rec, rec + 4)] = u32(rec + 8);
}

const unitsPerEm = u16(tables.head + 18);
const ascent = i16(tables.hhea + 4);
const descent = i16(tables.hhea + 6);
const lineGap = i16(tables.hhea + 8);
const numHMetrics = u16(tables.hhea + 34);
const advanceOf = (gid) => u16(tables.hmtx + 4 * Math.min(gid, numHMetrics - 1));

// cmap：取 (3,1) 的 format 4
let sub = null;
for (let i = 0, n = u16(tables.cmap + 2); i < n; i++) {
    const rec = tables.cmap + 4 + i * 8;
    if (u16(rec) === 3 && u16(rec + 2) === 1) sub = tables.cmap + u32(rec + 4);
}
if (sub === null || u16(sub) !== 4) throw new Error('没有 (3,1) format 4 的 cmap');
const segX2 = u16(sub + 6);
const ends = sub + 14;
const starts = ends + segX2 + 2;
const deltas = starts + segX2;
const ranges = deltas + segX2;
const advances = {};
for (let s = 0; s < segX2 / 2; s++) {
    const end = u16(ends + 2 * s);
    const start = u16(starts + 2 * s);
    const delta = i16(deltas + 2 * s);
    const rangeOff = u16(ranges + 2 * s);
    for (let c = start; c <= end && c !== 0xffff; c++) {
        let gid;
        if (rangeOff === 0) gid = (c + delta) & 0xffff;
        else {
            const at = ranges + 2 * s + rangeOff + 2 * (c - start);
            gid = u16(at);
            if (gid !== 0) gid = (gid + delta) & 0xffff;
        }
        if (gid !== 0) advances[c] = advanceOf(gid);
    }
}

const out = `// 由 tools/gen-font-metrics.mjs 从 m6x11plus.ttf 生成，不要手改。
/** \`head.unitsPerEm\` */
export const UNITS_PER_EM = ${unitsPerEm};
/** \`hhea\` 的 ascent / descent / lineGap（字体单位） */
export const ASCENT = ${ascent};
export const DESCENT = ${descent};
export const LINE_GAP = ${lineGap};
/** 码位 → 前进宽度（字体单位）。这是像素字体，全是 64 的倍数 */
export const ADVANCES: Readonly<Record<number, number>> = ${JSON.stringify(advances)};
`;
writeFileSync(new URL('../src/ui/font.generated.ts', import.meta.url), out);
console.log(`${Object.keys(advances).length} glyphs, upem ${unitsPerEm}`);
