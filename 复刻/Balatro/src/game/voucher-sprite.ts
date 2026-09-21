/**
 * 一张优惠券的表现层。
 *
 * 与消耗品同一个形状：**单层**，`Vouchers.png` 里那一格就是完整卡面。
 * 原作给优惠券单独一个 `voucher` shader（`card.lua:4448`，一层扫光），没有移植——
 * 与版本 shader 同一个处理，先用普通卡面顶着。
 */

import type { GameObjects, Scene } from 'phaser';

import { VOUCHER_ATLAS } from '../core/atlas';
import type { VoucherCenter } from '../core/vouchers';
import { CARD_H, CARD_W, toPx } from './coords';
import { cardTimeOf, makeClickable, makeShaderQuad } from './shader-quad';

export class VoucherSprite {
    private hoverTilt = 0;
    readonly shader: GameObjects.Shader;
    readonly w = toPx(CARD_W);
    readonly h = toPx(CARD_H);

    constructor(
        scene: Scene,
        readonly center: VoucherCenter,
        private readonly onClick: () => void,
    ) {
        this.shader = makeShaderQuad(scene, {
            name: `voucher_${center.order}_${Math.random().toString(36).slice(2, 7)}`,
            textureKey: 'vouchers',
            atlas: VOUCHER_ATLAS,
            pos: center.pos,
            // 与小丑／塔罗／补充包错开，免得 shader 动画同相
            cardTime: cardTimeOf(center.order + 600),
            w: this.w,
            h: this.h,
            tilt: () => this.hoverTilt,
        });
        this.shader.setDepth(2);

        makeClickable(this.shader, this.w, this.h, {
            onClick: () => this.onClick(),
            onOver: () => { this.hoverTilt = 1; },
            onOut: () => { this.hoverTilt = 0; },
        });
    }

    /** `xTiles` / `yTiles` 是左上角，tile 单位。换算只发生在这一层（10 号票） */
    layout(xTiles: number, yTiles: number): void {
        this.shader.setPosition(toPx(xTiles) + this.w / 2, toPx(yTiles) + this.h / 2);
    }

    destroy(): void {
        this.shader.destroy();
    }
}
