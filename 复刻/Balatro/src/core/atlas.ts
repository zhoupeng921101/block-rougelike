/**
 * 图集定义。
 *
 * Balatro 的图集是**规则网格**，每格一张卡：图集注册表给格子尺寸 `(px, py)`，
 * 每个条目的 `pos = {x, y}` 给它在网格里的坐标。
 * 所以 Phaser 要的 atlas JSON **不需要手写**，从这两处推导即可。
 *
 * 出处：
 * - 格子尺寸 `参考/产物/Balatro_1.0.1o/源码/game.lua:978-985` 那张注册表
 * - 帧坐标：扑克牌在 `game.lua:302` 起的 `P_CARDS`，小丑在 `:371` 起的 `P_CENTERS`
 *
 * **这个文件不 import Phaser**，所以「每张卡的 pos 都在网格内」这件事可以单测——
 * 越界的 pos 会让那张卡显示成别人的图，而那是一种不会报错、只能靠眼睛发现的 bug。
 *
 * **配置数据从 Lua 直译，不从 `参考/产物/.../配置CSV/` 读。**
 * 那些 CSV 是脚本从同一批 Lua 表派生的研究产物，隔了一层；
 * 而且它们装不下行为——`_小丑总表.csv` 的「配置驱动」只有 19/150 = 13%，
 * 其余 87% 在 `calculate_joker` 的分支里。详见 06 号票。
 */

export type AtlasSpec = {
    /** Phaser 的纹理 key */
    readonly key: string;
    /** 相对 public/ 的路径 */
    readonly path: string;
    /** 图集的实际像素尺寸。用来推导列数 */
    readonly w: number;
    readonly h: number;
    /** 单格宽高，对应 Lua 的 px / py */
    readonly frameW: number;
    readonly frameH: number;
};

/**
 * 对应 `game.lua:982` 的 `cards_1`。52 张标准牌。
 * 实测 923×380 = 13 列 × 71 与 4 行 × 95，严丝合缝。
 */
export const DECK_ATLAS: AtlasSpec = {
    key: 'cards',
    path: 'assets/textures/8BitDeck.png',
    w: 923, h: 380, frameW: 71, frameH: 95,
};

/** 卡面底板与强化牌（`game.lua:984` 的 `centers`）。497×475 = 7 列 × 5 行。 */
export const CENTERS_ATLAS: AtlasSpec = {
    key: 'centers',
    path: 'assets/textures/Enhancers.png',
    w: 497, h: 475, frameW: 71, frameH: 95,
};

/** 小丑（`game.lua:985` 的 `Joker`）。710×1520 = 10 列 × 16 行。 */
export const JOKER_ATLAS: AtlasSpec = {
    key: 'jokers',
    path: 'assets/textures/Jokers.png',
    w: 710, h: 1520, frameW: 71, frameH: 95,
};

export function columnsOf(atlas: AtlasSpec): number {
    return Math.floor(atlas.w / atlas.frameW);
}

export function rowsOf(atlas: AtlasSpec): number {
    return Math.floor(atlas.h / atlas.frameH);
}

/** 网格坐标 → Phaser 的帧序号。 */
export function frameIndex(atlas: AtlasSpec, pos: { x: number; y: number }): number {
    return pos.y * columnsOf(atlas) + pos.x;
}

/** 这个 pos 在网格里吗。越界的 pos 会安静地画出别人的图。 */
export function inBounds(atlas: AtlasSpec, pos: { x: number; y: number }): boolean {
    return pos.x >= 0 && pos.x < columnsOf(atlas) && pos.y >= 0 && pos.y < rowsOf(atlas);
}
