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
import { LayeredQuad, cardTimeOf, makeClickable } from './shader-quad';

export class VoucherSprite {
    private hoverTilt = 0;
    private readonly layers: LayeredQuad;
    readonly w = toPx(CARD_W);
    readonly h = toPx(CARD_H);

    constructor(
        scene: Scene,
        readonly center: VoucherCenter,
        private readonly onClick: () => void,
    ) {
        this.layers = new LayeredQuad(scene, {
            name: `voucher_${center.order}_${Math.random().toString(36).slice(2, 7)}`,
            textureKey: 'vouchers',
            atlas: VOUCHER_ATLAS,
            pos: center.pos,
            // 与小丑／塔罗／补充包错开，免得 shader 动画同相
            cardTime: cardTimeOf(center.order + 600),
            w: this.w,
            h: this.h,
            tilt: () => this.hoverTilt,
        }, 2, { set: 'Voucher' });

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

    destroy(): void {
        this.layers.destroy();
    }
}
