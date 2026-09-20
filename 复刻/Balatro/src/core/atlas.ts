/**
 * 图集定义。
 *
 * Balatro 的图集是**规则网格**，每格一张卡：图集注册表给格子尺寸 `(px, py)`，
 * 每个条目的 `pos = {x, y}` 给它在网格里的坐标。
 * 所以 Phaser 要的 atlas JSON **不需要手写**，从这两处推导即可。
 *
 * 出处：
 * - 格子尺寸 `参考/产物/Balatro_1.0.1o/源码/game.lua:982`
 *   `{name = "cards_1", path = "…/8BitDeck.png", px = 71, py = 95}`
 * - 帧坐标 `game.lua:302` 起的 `P_CARDS`，如
 *   `C_2 = {name = "2 of Clubs", value = '2', suit = 'Clubs', pos = {x = 0, y = 1}}`
 *
 * 校验：`8BitDeck.png` 实测 923×380 = 13 列 × 71 与 4 行 × 95，严丝合缝。
 *
 * **配置数据从 Lua 直译，不从 `参考/产物/.../配置CSV/` 读。**
 * 那些 CSV 是 Python 脚本从同一批 Lua 表派生的研究产物，隔了一层；
 * 而且它们装不下行为——`_小丑总表.csv` 的「配置驱动」只有 19/150 = 13%，
 * 其余 87% 在 `calculate_joker` 的分支里。详见 06 号票。
 */

export type AtlasSpec = {
    /** Phaser 的纹理 key */
    readonly key: string;
    /** 相对 public/ 的路径 */
    readonly path: string;
    /** 单格宽，对应 Lua 的 px */
    readonly frameWidth: number;
    /** 单格高，对应 Lua 的 py */
    readonly frameHeight: number;
};

/** 对应 `game.lua:982` 的 `cards_1`。52 张标准牌。 */
export const DECK_ATLAS: AtlasSpec = {
    key: 'cards_1',
    path: 'assets/textures/8BitDeck.png',
    frameWidth: 71,
    frameHeight: 95,
};

/** 卡面底板与强化牌。格子尺寸与牌面一致。 */
export const ENHANCERS_ATLAS: AtlasSpec = {
    key: 'centers',
    path: 'assets/textures/Enhancers.png',
    frameWidth: 71,
    frameHeight: 95,
};

/** 网格坐标 → Phaser 的帧序号。 */
export function frameIndex(atlas: AtlasSpec, pos: { x: number; y: number }, atlasPixelWidth: number): number {
    const columns = Math.floor(atlasPixelWidth / atlas.frameWidth);
    return pos.y * columns + pos.x;
}
