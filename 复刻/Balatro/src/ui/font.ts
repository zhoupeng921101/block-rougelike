/**
 * 英文字体 `G.LANGUAGES['en-us'].font`（`game.lua:937` 的第一项）与 LÖVE 的 `Font` 度量。
 *
 * 原作 `love.graphics.newFont(file, render_scale)` 以 200 像素加载 m6x11plus，
 * UI 按 `getWidth(text) * scale * FONTSCALE / TILESIZE` 换成 tile。
 * 换算下来：**scale = 1 的文字在屏幕上的字号就是 1 tile 的像素数**。
 */
import { ADVANCES, ASCENT, DESCENT, LINE_GAP, UNITS_PER_EM } from './font.generated';

export type FontSpec = {
    /** `render_scale`：LÖVE 加载字体的像素字号 */
    renderScale: number;
    TEXT_HEIGHT_SCALE: number;
    TEXT_OFFSET: { x: number; y: number };
    FONTSCALE: number;
    squish: number;
};

/** `game.lua:937` */
export const EN_FONT: FontSpec = {
    renderScale: 20 * 10,
    TEXT_HEIGHT_SCALE: 0.83,
    TEXT_OFFSET: { x: 10, y: -20 },
    FONTSCALE: 0.1,
    squish: 1,
};

/** FreeType 在 26.6 定点上的取整（`FT_PIX_ROUND`）：逢半进一 */
const pixRound = (x: number) => Math.floor(x + 0.5);

/**
 * LÖVE `Font:getWidth(text)`：逐字前进宽度之和（这款字体没有 kern 表）。
 * 每个字的前进宽度按 FreeType 取整到整像素——200 像素下 'A' 是 87.5 → 88，
 * 与 Pillow（同样走 FreeType）量出来的一致。字体里没有的字按 0 算。
 */
export function fontWidth(text: string, font: FontSpec = EN_FONT): number {
    let w = 0;
    for (const ch of text) {
        const adv = ADVANCES[ch.codePointAt(0)!];
        if (adv !== undefined) w += pixRound((adv * font.renderScale) / UNITS_PER_EM);
    }
    return w;
}

/** LÖVE `Font:getHeight()`：`ascent - descent + lineGap` 换到像素（m6x11plus 在 200 下正好 200） */
export function fontHeight(font: FontSpec = EN_FONT): number {
    return pixRound(((ASCENT - DESCENT + LINE_GAP) * font.renderScale) / UNITS_PER_EM);
}
