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

/**
 * 每 tile 多少像素。倾斜 shader 的 `screen_scale` 要用到——
 * 原作是 `G.TILESCALE*G.TILESIZE*mouse_damping*G.CANV_SCALE`（`sprite.lua:98`），
 * 其中 `TILESCALE*TILESIZE*CANV_SCALE` 正是这个量，
 * 所以 `mouse_offset` 的量纲是「tile ÷ mouse_damping」。
 */
export const PX_PER_TILE = TILESCALE * TILESIZE;

/** `card.lua:346` 的 `self.mouse_damping`，卡牌专用。 */
export const CARD_MOUSE_DAMPING = 1.5;

/** 整个游戏区域的像素尺寸。 */
export const CANVAS_W = toPx(TILE_W);
export const CANVAS_H = toPx(TILE_H);

/**
 * `game.lua:1092` 的房间留白：窗口 = 房间 + 左右各 0.8、上下共 3×0.4 tile。
 */
export const ROOM_PADDING_W = 0.8;
export const ROOM_PADDING_H = 0.4;
/** `globals.lua:309` 的初始 `G.TILESCALE`。`love.resize` 拿它当基准比例，约掉之后不影响结果 */
const ORIG_TILESCALE = 3.65;

export type RoomMapping = {
    /** 窗口下的 `G.TILESCALE` */
    tileScale: number;
    /** 每 tile 多少**窗口**像素（`TILESIZE * tileScale`） */
    pxPerTile: number;
    /** `G.ROOM.T.x` / `.y`：房间原点在窗口里的位置，单位 tile */
    roomX: number;
    roomY: number;
};

/**
 * `main.lua:436` 的 `love.resize`：按窗口算 `G.TILESCALE` 与房间位置。
 *
 * 窗口比 22.6:12.4 窄就按宽缩、房间上下居中，否则按高缩、左右居中。
 * 这是复刻件与原作「同一个窗口里东西摆在同一个像素」的前提（22 号票）：
 * 2560×1440 时每 tile 113.3 像素、房间原点 (0.8, 0.757) tile，
 * 用它算出的牌堆左上角 (2180, 1043) 与模拟器实机截图一致。
 */
export function roomMapping(w: number, h: number): RoomMapping {
    // 原文：窗口太方（宽 < 高）时把 h 当成 w 算，免得上下出现空白里的弹入
    if (w / h < 1) h = w;
    const winW = TILE_W + 2 * ROOM_PADDING_W;
    const winH = TILE_H + 3 * ROOM_PADDING_H;
    const prevW = winW * TILESIZE * ORIG_TILESCALE;
    const prevH = winH * TILESIZE * ORIG_TILESCALE;
    const narrow = w / h < prevW / prevH;
    const tileScale = narrow ? (ORIG_TILESCALE * w) / prevW : (ORIG_TILESCALE * h) / prevH;
    const pxPerTile = TILESIZE * tileScale;
    return narrow
        ? {
            tileScale, pxPerTile,
            roomX: ROOM_PADDING_W,
            roomY: (h / pxPerTile - (TILE_H + ROOM_PADDING_H)) / 2 + ROOM_PADDING_H / 2,
        }
        : {
            tileScale, pxPerTile,
            roomX: (w / pxPerTile - (TILE_W + ROOM_PADDING_W)) / 2 + ROOM_PADDING_W / 2,
            roomY: ROOM_PADDING_H,
        };
}
