/**
 * 一张优惠券的表现层。
 *
 * 与消耗品同一个形状：`Vouchers.png` 里那一格就是完整卡面，外加一层 `voucher` 扫光
 * （`card.lua:4454`，20 号票）。
 */

import type { GameObjects, Scene } from 'phaser';

import { VOUCHER_ATLAS } from '../core/atlas';
import type { VoucherCenter } from '../core/vouchers';
import { CARD_H, CARD_W, toPx } from './coords';
import type { Placed } from './align-cards';
import { PlacedLayers } from './placed-layers';
import { LayeredQuad, cardTimeOf, makeClickable } from './shader-quad';

export class VoucherSprite {
    private hoverTilt = 0;
    private readonly layers: LayeredQuad;
    private readonly placed: PlacedLayers;
    readonly w = toPx(CARD_W);
    readonly h = toPx(CARD_H);

    constructor(
        scene: Scene,
        readonly center: VoucherCenter,
        private readonly onClick: () => void,
    ) {
        const quad = {
            name: `voucher_${center.order}_${Math.random().toString(36).slice(2, 7)}`,
            textureKey: 'vouchers',
            atlas: VOUCHER_ATLAS,
            pos: center.pos,
            // 与小丑／塔罗／补充包错开，免得 shader 动画同相
            cardTime: cardTimeOf(center.order + 600),
            w: this.w,
            h: this.h,
            tilt: () => this.hoverTilt,
        };
        this.layers = new LayeredQuad(scene, quad, 2, { set: 'Voucher' });
        this.placed = new PlacedLayers(scene, this.layers, quad, this.w / toPx(1), this.h / toPx(1));

        makeClickable(this.shader, this.w, this.h, {
            onClick: () => this.onClick(),
            onOver: () => { this.hoverTilt = 1; this.placed.hovered = true; },
            onOut: () => { this.hoverTilt = 0; this.placed.hovered = false; },
        });
    }

    /** `xTiles` / `yTiles` 是左上角，tile 单位。换算只发生在这一层（10 号票） */
    layout(xTiles: number, yTiles: number): void {
        this.place({ x: xTiles, y: yTiles, r: 0 }, 0);
    }

    /** 按 `align_cards` 的结果摆：`T.scale = 0.95`、阴影、缓动都在 `PlacedLayers` 里 */
    place(p: Placed, index: number): void {
        this.placed.place(p, index);
    }

    /** 选中（点一下；按钮挂在它身上） */
    highlighted = false;

    /** 上一帧的 x（tile），`align_cards` 要 */
    get prevX(): number {
        return this.placed.prevX;
    }

    /** 可见矩形（tile） */
    get rect(): { x: number; y: number; w: number; h: number } {
        return this.placed.rect;
    }

    /** 底层（点击区挂在它上面） */
    get shader(): GameObjects.Shader {
        return this.layers.main;
    }

    destroy(): void {
        this.layers.destroy();
        this.placed.destroy();
    }
}
