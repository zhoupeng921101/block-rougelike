/**
 * 一张牌的表现层。
 *
 * 按 11 号票：Phaser 4 里自定义 shader 走 `Shader` GameObject 而不是 Filter，
 * 每个实例自己 `new` 一个 `ShaderQuad`，uniform 天然逐实例独立（13 号票已实测）。
 *
 * 代价（11 号票记过）：`Shader` 只混入 8 个组件，没有 Animation / Tint，
 * `setAlpha` 是显式 NOOP——alpha 要走 shader uniform。交互得自己挂 hit area。
 */

import Phaser, { GameObjects, Scene } from 'phaser';

import type { Card, Suit } from '../core/card';
import { CARD_H, CARD_MOUSE_DAMPING, CARD_W, PX_PER_TILE, toPx } from './coords';
import { DISSOLVE_FRAG, DISSOLVE_VERT } from './shaders/dissolve';

/** `8BitDeck.png` 实测 923×380，`game.lua:982` 给的格子是 71×95。 */
export const ATLAS = { w: 923, h: 380, frameW: 71, frameH: 95 } as const;
const ATLAS_COLS = Math.floor(ATLAS.w / ATLAS.frameW);

/**
 * `Enhancers.png`（`game.lua:984` 注册为 `centers`），497×475 = 7 列 × 5 行。
 * 原作每张牌是**两层**：底板（centers 图集）+ 正面（cards_1 图集）。
 * 8BitDeck 里的牌面是透明背景的花色与数字，没有白底。
 */
export const CENTERS = { w: 497, h: 475, frameW: 71, frameH: 95 } as const;
const CENTERS_COLS = Math.floor(CENTERS.w / CENTERS.frameW);
/** `game.lua:368` 的 `c_base`，`pos = {x=1,y=0}` */
const BASE_POS = { x: 1, y: 0 } as const;

/** `game.lua:302` 起 `P_CARDS` 的 `pos.y`：花色决定行。 */
const SUIT_ROW: Record<Suit, number> = { Hearts: 0, Clubs: 1, Diamonds: 2, Spades: 3 };
/** `pos.x`：点数决定列，2 → 0 … A → 12。 */
const VALUE_COL: Record<string, number> = {
    '2': 0, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6, '9': 7, '10': 8,
    Jack: 9, Queen: 10, King: 11, Ace: 12,
};

export function atlasPos(card: Card): { x: number; y: number } {
    return { x: VALUE_COL[card.base.value], y: SUIT_ROW[card.base.suit] };
}

export class CardSprite {
    /**
     * 悬停倾斜的强度，对应原作的 `hover_tilt`（`card.lua:4351` 设为 1）。
     *
     * 12 号票裁定要实现它：在本产物里它是死代码
     * （`touch_collide_tilt` 在 `Card` 上从不设置），
     * 但它是 Balatro 最具辨识度的动作，这是全图唯一一处有意偏离产物的地方。
     */
    private hoverTilt = 0;

    /** 底板层，画在正面之下 */
    readonly base: GameObjects.Shader;
    readonly shader: GameObjects.Shader;
    /** 选中的牌抬起来。`G.HIGHLIGHT_H` 在原作里是 tile 量。 */
    highlighted = false;

    constructor(
        private readonly scene: Scene,
        readonly card: Card,
        private readonly onClick: (card: Card) => void,
    ) {
        const pos = atlasPos(card);
        const w = toPx(CARD_W);
        const h = toPx(CARD_H);
        const cardTime = (123.33412 * (card.sort_id / 1.14212)) % 3000;

        this.base = this.makeLayer(
            scene, `base_${card.key}`, 'centers', BASE_POS, CENTERS, CENTERS_COLS, cardTime, w, h,
        );
        this.base.setDepth(0);

        this.shader = scene.add.shader(
            {
                name: `card_${card.key}`,
                fragmentSource: DISSOLVE_FRAG,
                vertexSource: DISSOLVE_VERT,
                setupUniforms: (setUniform: (name: string, value: unknown) => void) => {
                    setUniform('uMainSampler', 0);
                    setUniform('dissolve', 0);
                    // `sprite.lua:101`：time = 123.33412*(card.ID/1.14212)%3000，逐卡不同
                    setUniform('time', cardTime);
                    setUniform('texture_details', [pos.x, pos.y, ATLAS.frameW, ATLAS.frameH]);
                    setUniform('image_details', [ATLAS.w, ATLAS.h]);
                    setUniform('shadow', false);
                    setUniform('burn_colour_1', [0, 0, 0, 0]);
                    setUniform('burn_colour_2', [0, 0, 0, 0]);
                    setUniform('uProbe', [0, 0, 0]);
                    setUniform('uProbePatch', 0);
                    this.sendTiltUniforms(setUniform, scene);
                },
            },
            0,
            0,
            w,
            h,
            ['cards'],
        );

        // 13 号票实测：Shader GameObject 不会自动应用 spritesheet 的帧，
        // 必须显式设纹理坐标，否则整张图集被画进 quad。
        this.shader.setTextureCoordinatesFromFrame(String(pos.y * ATLAS_COLS + pos.x), 'cards');

        // Shader 不带 Input 组件的默认 hit area，得自己给
        this.shader.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, w, h),
            Phaser.Geom.Rectangle.Contains,
        );
        this.shader.setDepth(1);
        this.shader.on('pointerdown', () => this.onClick(this.card));
        this.shader.on('pointerover', () => { this.hoverTilt = 1; });
        this.shader.on('pointerout', () => { this.hoverTilt = 0; });
    }

    /**
     * 倾斜相关的三个 uniform。
     *
     * **不需要重标定系数**（13 号票原以为要）：
     * 原作的 `screen_scale = TILESCALE*TILESIZE*mouse_damping*CANV_SCALE`，
     * 而 `TILESCALE*TILESIZE*CANV_SCALE` 正是「每 tile 多少像素」，
     * 所以 `mouse_offset = (顶点 - 鼠标) / 每tile像素 / mouse_damping`
     * ——量纲是「tile ÷ 1.5」。只要两个量都用同一个世界坐标空间，
     * `position()` 里那串手调常数原样成立。
     */
    private sendTiltUniforms(
        setUniform: (n: string, v: unknown) => void,
        scene: Scene,
    ): void {
        const p = scene.input.activePointer;
        setUniform('mouse_screen_pos', [p.worldX, p.worldY]);
        setUniform('hovering', this.hoverTilt);
        setUniform('screen_scale', PX_PER_TILE * CARD_MOUSE_DAMPING);
        setUniform('uScreenSize', [scene.scale.width, scene.scale.height]);
    }

    /** 底板与正面用的是同一个 shader，只是图集与帧不同。 */
    private makeLayer(
        scene: Scene,
        name: string,
        textureKey: string,
        pos: { x: number; y: number },
        atlas: { w: number; h: number; frameW: number; frameH: number },
        cols: number,
        cardTime: number,
        w: number,
        h: number,
    ): GameObjects.Shader {
        const layer = scene.add.shader(
            {
                name,
                fragmentSource: DISSOLVE_FRAG,
                vertexSource: DISSOLVE_VERT,
                setupUniforms: (setUniform: (n: string, v: unknown) => void) => {
                    setUniform('uMainSampler', 0);
                    setUniform('dissolve', 0);
                    setUniform('time', cardTime);
                    setUniform('texture_details', [pos.x, pos.y, atlas.frameW, atlas.frameH]);
                    setUniform('image_details', [atlas.w, atlas.h]);
                    setUniform('shadow', false);
                    setUniform('burn_colour_1', [0, 0, 0, 0]);
                    setUniform('burn_colour_2', [0, 0, 0, 0]);
                    setUniform('uProbe', [0, 0, 0]);
                    setUniform('uProbePatch', 0);
                    this.sendTiltUniforms(setUniform, scene);
                },
            },
            0, 0, w, h, [textureKey],
        );
        layer.setTextureCoordinatesFromFrame(String(pos.y * cols + pos.x), textureKey);
        return layer;
    }

    /**
     * 逻辑层的 `T` 是 tile 量，这里换算到像素。换算只允许发生在这一层。
     *
     * `offsetXTiles` 是表现层的边距——**不写回 `card.T.x`**。
     * 逻辑层的 `T.x` 只由 `alignHand` 按下标赋值，表现层不改它。
     */
    layout(offsetXTiles: number, baseYTiles: number): void {
        const liftTiles = this.highlighted ? 0.6 : 0;
        const x = toPx(this.card.T.x + offsetXTiles) + toPx(CARD_W) / 2;
        const y = toPx(baseYTiles - liftTiles) + toPx(CARD_H) / 2;
        this.base.setPosition(x, y);
        this.shader.setPosition(x, y);
    }

    /** 计分时的弹一下。对应原作的 `juice_up`。 */
    pop(): void {
        for (const layer of [this.base, this.shader]) {
            this.scene.tweens.add({
                targets: layer,
                scaleX: 1.18, scaleY: 1.18,
                duration: 90, yoyo: true, ease: 'Quad.easeOut',
            });
        }
    }

    destroy(): void {
        this.base.destroy();
        this.shader.destroy();
    }

    /** 让 `scene` 字段不被 noUnusedParameters 判死，同时留个取用口 */
    get owner(): Scene {
        return this.scene;
    }
}
