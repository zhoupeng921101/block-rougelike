/**
 * `cardarea.lua:288` 的 `area_uibox`：CardArea 身后那块 10% 黑的圆角底，加上下面的「张数/上限」（22 号票）。
 *
 * 底板那一行带 `mid = true`，UIBox 以它为准居中对齐到 CardArea，计数那一行挂在它下面。
 * 计数行的对齐：小丑区靠左（cl），手牌区居中（cm），其余靠右（cr）。
 */
import { C } from '../colours';
import { EN_FONT } from '../font';
import { type Rect, type UINodeDef, UIT } from '../uibox';

/** 绑定给计数行的对象（原作绑的是 `CardArea.config`） */
export type AreaCount = { card_count: number; card_limit: number };

export function cardAreaBox(area: Rect, count: AreaCount, align: 'cl' | 'cm' | 'cr'): UINodeDef {
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: [
        { n: UIT.R, config: { minw: area.w, minh: area.h, align: 'cm', padding: 0.1, mid: true, r: 0.1, colour: [0, 0, 0, 0.1] }, nodes: [] },
        { n: UIT.R, config: { align, padding: 0.03, no_fill: true }, nodes: [
            { n: UIT.B, config: { w: 0.1, h: 0.1 } },
            { n: UIT.T, config: { ref_table: count, ref_value: 'card_count', scale: 0.3, lang: EN_FONT, colour: C.WHITE } },
            { n: UIT.T, config: { text: '/', scale: 0.3, lang: EN_FONT, colour: C.WHITE } },
            { n: UIT.T, config: { ref_table: count, ref_value: 'card_limit', scale: 0.3, lang: EN_FONT, colour: C.WHITE } },
            { n: UIT.B, config: { w: 0.1, h: 0.1 } },
        ] },
    ] };
}
