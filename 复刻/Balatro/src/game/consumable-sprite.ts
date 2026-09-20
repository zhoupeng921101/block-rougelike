/**
 * 一张消耗品的表现层。
 *
 * 与小丑同一个形状：**单层**，`Tarots.png` 里那一格就是完整卡面。
 * 也没有小丑那四条尺寸特例（`card.lua:238-257` 只对小丑生效），
 * 所以比 `JokerSprite` 还短。
 *
 * 一张图集装三个 set（塔罗 / 星球 / 幽灵），`pos` 不按 set 分区——
 * `c_planet_x` 的 pos 是 `{x=9,y=2}`，落在塔罗那几行的末尾。
 */

import type { GameObjects, Scene } from 'phaser';

import { TAROT_ATLAS } from '../core/atlas';
import type { Consumable } from '../core/consumables';
import { CARD_H, CARD_W, toPx } from './coords';
import { cardTimeOf, makeClickable, makeShaderQuad } from './shader-quad';

export class ConsumableSprite {
    private hoverTilt = 0;
    readonly shader: GameObjects.Shader;
    readonly w = toPx(CARD_W);
    readonly h = toPx(CARD_H);
    /** 被选中（消耗品区里待用／待卖） */
    highlighted = false;

    constructor(
        private readonly scene: Scene,
        readonly consumable: Consumable,
        private readonly onClick: (consumable: Consumable) => void,
    ) {
        this.shader = makeShaderQuad(scene, {
            // 名字要唯一：同一张牌可能同时在商店和消耗品区
            name: `consumable_${consumable.key}_${Math.random().toString(36).slice(2, 7)}`,
            textureKey: 'tarots',
            atlas: TAROT_ATLAS,
            pos: consumable.center.pos,
            // 塔罗与小丑的 order 各自从 1 起，撞在一起会让两张牌的
            // shader 动画完全同相。错开一段，只影响观感
            cardTime: cardTimeOf(consumable.center.order + 200),
            w: this.w,
            h: this.h,
            tilt: () => this.hoverTilt,
        });
        this.shader.setDepth(2);

        makeClickable(this.shader, this.w, this.h, {
            onClick: () => this.onClick(this.consumable),
            onOver: () => { this.hoverTilt = 1; },
            onOut: () => { this.hoverTilt = 0; },
        });
    }

    /** `xTiles` / `yTiles` 是左上角，tile 单位。换算只发生在这一层（10 号票）。 */
    layout(xTiles: number, yTiles: number): void {
        const lift = this.highlighted ? 0.35 : 0;
        this.shader.setPosition(toPx(xTiles) + this.w / 2, toPx(yTiles - lift) + this.h / 2);
    }

    pop(): void {
        this.scene.tweens.add({
            targets: this.shader,
            scaleX: 1.2, scaleY: 1.2,
            duration: 110, yoyo: true, ease: 'Quad.easeOut',
        });
    }

    destroy(): void {
        this.shader.destroy();
    }
}
