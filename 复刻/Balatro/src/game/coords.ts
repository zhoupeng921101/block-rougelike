/**
 * tile ↔ 像素的换算边界。
 *
 * **整个工程只有这一个文件允许做这个换算。** 见 10 号票：
 * 逻辑层的 `T.x` / `T.y` 全程用 tile 单位，`align_cards` 里那堆手调常数
 * （`0.27`、`1.8`、`shadow_parrallax.x/30`……）都是 tile 尺度的，
 * 用 Phaser 像素维护 `T` 会让它们一个都不能用。
 *
 * 常数出处 `参考/产物/Balatro_1.0.1o/源码/globals.lua:308-314`。
 */

/** `globals.lua:308` */
export const TILESIZE = 20;
/** `globals.lua:310-311`，整个游戏区域的 tile 尺寸 */
export const TILE_W = 21;
export const TILE_H = 11.2;
/** `globals.lua:313-314` */
export const CARD_W = (2.4 * 35) / 41;
export const CARD_H = (2.4 * 47) / 41;

/**
 * `G.TILESCALE`。原作按窗口大小算，这里固定——
 * 复刻件只跑 localhost，不做多分辨率适配。
 */
export const TILESCALE = 3.6;

/** tile → 像素。渲染时用。 */
export function toPx(tiles: number): number {
    return tiles * TILESCALE * TILESIZE;
}

/** 像素 → tile。处理输入（鼠标坐标）时用，对应 `moveable.lua:223`。 */
export function toTiles(px: number): number {
    return px / (TILESCALE * TILESIZE);
}

/** 整个游戏区域的像素尺寸。 */
export const CANVAS_W = toPx(TILE_W);
export const CANVAS_H = toPx(TILE_H);
