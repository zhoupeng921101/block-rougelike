/**
 * 一张「用 shader 画的卡」的公共部分。
 *
 * 按 11 号票：Phaser 4 里自定义 shader 走 `Shader` GameObject 而不是 Filter，
 * 每个实例自己一个 quad，uniform 天然逐实例独立（13 号票已实测）。
 *
 * 扑克牌、小丑、盲注筹码都是「从一张规则网格图集里取一格、用 `dissolve.fs` 画出来」，
 * 只有图集与帧坐标不同。所以这个工厂是三者共用的，别在各自文件里各抄一份 uniform 列表——
 * `dissolve.fs` 的 uniform 有 11 个，抄漏一个就是一个只在某种卡上出现的渲染 bug。
 *
 * 代价（11 号票记过）：`Shader` 只混入 8 个组件，没有 Animation / Tint，
 * `setAlpha` 是显式 NOOP——alpha 要走 shader uniform，交互得自己挂 hit area。
 */

import Phaser, { type GameObjects, type Scene } from 'phaser';

import { type AtlasSpec, frameIndex } from '../core/atlas';
import { PX_PER_TILE } from './coords';
import { DISSOLVE_FRAG, DISSOLVE_VERT } from './shaders/dissolve';

// 图集尺寸与帧坐标推导在 `core/atlas.ts`——那个文件不 import Phaser，
// 所以「每张卡的 pos 都在网格内」可以单测（见 `core/atlas.test.ts`）。
export { CENTERS_ATLAS, DECK_ATLAS, JOKER_ATLAS } from '../core/atlas';

export type QuadOptions = {
    name: string;
    /** Phaser 的纹理 key */
    textureKey: string;
    atlas: AtlasSpec;
    pos: { x: number; y: number };
    /** `sprite.lua:101` 的 `123.33412*(card.ID/1.14212)%3000`，逐卡不同 */
    cardTime: number;
    w: number;
    h: number;
    /**
     * 悬停倾斜的读取口。每帧调一次，返回 0..1。
     *
     * 传函数而不是数值：`setupUniforms` 每帧跑一次，而倾斜强度是随鼠标变的，
     * 传数值会把它冻在创建那一刻。
     */
    tilt: () => number;
};

/**
 * 造一个 shader quad 并把纹理坐标钉到指定帧。
 *
 * **`setTextureCoordinatesFromFrame` 不能省**（13 号票实测）：
 * `Shader` GameObject 不会自动应用 spritesheet 的帧，
 * `outTexCoord` 默认跨整张纹理，省掉这一行整张图集会被画进每个 quad。
 */
export function makeShaderQuad(scene: Scene, opts: QuadOptions): GameObjects.Shader {
    const { atlas, pos } = opts;

    const quad = scene.add.shader(
        {
            name: opts.name,
            fragmentSource: DISSOLVE_FRAG,
            vertexSource: DISSOLVE_VERT,
            setupUniforms: (setUniform: (n: string, v: unknown) => void) => {
                setUniform('uMainSampler', 0);
                setUniform('dissolve', 0);
                setUniform('time', opts.cardTime);
                setUniform('texture_details', [pos.x, pos.y, atlas.frameW, atlas.frameH]);
                setUniform('image_details', [atlas.w, atlas.h]);
                setUniform('shadow', false);
                setUniform('burn_colour_1', [0, 0, 0, 0]);
                setUniform('burn_colour_2', [0, 0, 0, 0]);
                setUniform('uProbe', [0, 0, 0]);
                setUniform('uProbePatch', 0);

                // 倾斜那三个。**不需要重标定系数**（13 号票原以为要）：
                // 原作的 `screen_scale = TILESCALE*TILESIZE*mouse_damping*CANV_SCALE`，
                // 而 `TILESCALE*TILESIZE*CANV_SCALE` 正是「每 tile 多少像素」，
                // 所以 `mouse_offset` 的量纲是「tile ÷ mouse_damping」，
                // `position()` 里那串手调常数原样成立。
                const p = scene.input.activePointer;
                setUniform('mouse_screen_pos', [p.worldX, p.worldY]);
                setUniform('hovering', opts.tilt());
                setUniform('screen_scale', PX_PER_TILE * MOUSE_DAMPING);
                setUniform('uScreenSize', [scene.scale.width, scene.scale.height]);
            },
        },
        0, 0, opts.w, opts.h,
        [opts.textureKey],
    );

    quad.setTextureCoordinatesFromFrame(String(frameIndex(atlas, pos)), opts.textureKey);
    return quad;
}

/** `card.lua:346` 的 `self.mouse_damping`，卡牌专用。 */
const MOUSE_DAMPING = 1.5;

/** 给一个没有 Input 组件默认 hit area 的 `Shader` 挂上矩形命中区。 */
export function makeClickable(
    quad: GameObjects.Shader,
    w: number,
    h: number,
    handlers: { onClick?: () => void; onOver?: () => void; onOut?: () => void },
): void {
    quad.setInteractive(new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains);
    if (handlers.onClick) quad.on('pointerdown', handlers.onClick);
    if (handlers.onOver) quad.on('pointerover', handlers.onOver);
    if (handlers.onOut) quad.on('pointerout', handlers.onOut);
}

/** `sprite.lua:101` 的逐卡时间偏移。 */
export function cardTimeOf(id: number): number {
    return (123.33412 * (id / 1.14212)) % 3000;
}
