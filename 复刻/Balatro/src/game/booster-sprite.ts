/**
 * 一个补充包的表现层。
 *
 * 与小丑／消耗品同一个形状：**单层**，`boosters.png` 里那一格就是完整包面。
 *
 * 原作把包画得比卡大一圈（`G.CARD_W*1.27`，`game.lua:3516`），
 * 照做——那是「这不是一张卡，是一个包」的唯一视觉区分。
 */

import type { GameObjects, Scene } from 'phaser';

import { BOOSTER_ATLAS } from '../core/atlas';
import type { BoosterCenter } from '../core/boosters';
import { CARD_H, CARD_W, toPx } from './coords';
import { LayeredQuad, cardTimeOf, makeClickable } from './shader-quad';

/** `game.lua:3516` 的 `G.CARD_W*1.27` */
const PACK_SCALE = 1.27;

export class BoosterSprite {
    private hoverTilt = 0;
    /** 包面 + `booster` 叠加层（20 号票） */
    private readonly layers: LayeredQuad;
    readonly w = toPx(CARD_W) * PACK_SCALE;
    readonly h = toPx(CARD_H) * PACK_SCALE;

    constructor(
        private readonly scene: Scene,
        readonly center: BoosterCenter,
        private readonly onClick: () => void,
    ) {
        this.layers = new LayeredQuad(scene, {
            name: `booster_${center.order}_${Math.random().toString(36).slice(2, 7)}`,
            textureKey: 'boosters',
            atlas: BOOSTER_ATLAS,
            pos: center.pos,
            // 与小丑／塔罗错开，免得三种卡的 shader 动画同相
            cardTime: cardTimeOf(center.order + 400),
            w: this.w,
            h: this.h,
            tilt: () => this.hoverTilt,
        }, 2, { set: 'Booster' });

        makeClickable(this.shader, this.w, this.h, {
            onClick: () => this.onClick(),
            onOver: () => { this.hoverTilt = 1; },
            onOut: () => { this.hoverTilt = 0; },
        });
    }

    /** `xTiles` / `yTiles` 是左上角，tile 单位。换算只发生在这一层（10 号票） */
    layout(xTiles: number, yTiles: number): void {
        this.layers.setPosition(toPx(xTiles) + this.w / 2, toPx(yTiles) + this.h / 2);
    }

    /** 底层（点击区挂在它上面） */
    get shader(): GameObjects.Shader {
        return this.layers.main;
    }

    pop(): void {
        this.scene.tweens.add({
            targets: this.layers.quads,
            scaleX: 1.15, scaleY: 1.15,
            duration: 110, yoyo: true, ease: 'Quad.easeOut',
        });
    }

    destroy(): void {
        this.layers.destroy();
    }
}
