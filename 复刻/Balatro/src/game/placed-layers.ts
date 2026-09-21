/**
 * 单层卡（小丑、消耗品）按 `align_cards` 的结果摆放（22 号票）：与 `CardSprite.place` 同一套——
 * `card.lua:58` 的 `T.scale = 0.95`、阴影（`G.shared_shadow` 就是卡面自己，`shadow_height = 0.1`，
 * `sprite.lua:76` 往视差反方向错开并缩 `1 − 0.2·h`）、按下标分深度（后压前，全部阴影在全部卡之下）。
 */
import type { GameObjects, Scene } from 'phaser';

import type { Placed } from './align-cards';
import { cardShadowParallaxX } from './align-cards';
import { toPx } from './coords';
import { type LayeredQuad, type QuadOptions, makeShaderQuad } from './shader-quad';

const CARD_SCALE = 0.95;
const SHADOW_HEIGHT = 0.1;

export class PlacedLayers {
    readonly shadow: GameObjects.Shader;
    /** 上一帧的 x（tile）：`align_cards` 的正弦相位与阴影视差读它 */
    prevX = 0;

    constructor(
        scene: Scene,
        private readonly layers: LayeredQuad,
        quad: QuadOptions,
        /** 卡面尺寸（tile），小丑有几张不是标准尺寸 */
        private readonly wTiles: number,
        private readonly hTiles: number,
    ) {
        this.shadow = makeShaderQuad(scene, { ...quad, name: `${quad.name}_shadow`, tilt: () => 0, shadow: true, shader: 'dissolve' });
        for (const q of layers.quads) q.setScale(CARD_SCALE);
        this.shadow.setScale(CARD_SCALE * (1 - 0.2 * SHADOW_HEIGHT)).setDepth(1);
    }

    /** `p` 是左上角（tile）与转角 */
    place(p: Placed, index: number): void {
        const cx = toPx(p.x + this.wTiles / 2);
        const cy = toPx(p.y + this.hTiles / 2);
        this.layers.setDepth(10 + index);
        this.layers.setPosition(cx, cy);
        this.layers.setRotation(p.r);
        const spx = cardShadowParallaxX(p.x, this.wTiles);
        this.shadow.setDepth(1 + index * 0.001)
            .setPosition(toPx(p.x + this.wTiles / 2 - spx * SHADOW_HEIGHT), toPx(p.y + this.hTiles / 2 + 1.5 * SHADOW_HEIGHT))
            .setRotation(p.r);
        this.prevX = p.x;
    }

    setVisible(v: boolean): void {
        this.layers.setVisible(v);
        this.shadow.setVisible(v);
    }

    destroy(): void {
        this.shadow.destroy();
    }
}
