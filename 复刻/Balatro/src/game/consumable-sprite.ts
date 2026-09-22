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

import { CENTERS_ATLAS, TAROT_ATLAS } from '../core/atlas';
import type { Consumable } from '../core/consumables';
import type { Placed } from './align-cards';
import { CARD_H, CARD_W, toPx } from './coords';
import { PlacedLayers } from './placed-layers';
import { type DissolveState, LayeredQuad, cardTimeOf, makeClickable } from './shader-quad';

export class ConsumableSprite {
    private hoverTilt = 0;
    /** 卡面 + 叠加层：幽灵牌叠 `booster`，Negative 的换底层、叠 `negative_shine`（20 号票） */
    private readonly layers: LayeredQuad;
    /** 摆放、阴影、缩放（`align_cards` 的结果落在这里） */
    private readonly placed: PlacedLayers;
    readonly w = toPx(CARD_W);
    readonly h = toPx(CARD_H);
    /** 被选中（消耗品区里待用／待卖） */
    highlighted = false;
    /** `Card.dissolve` / `dissolve_colours`：卖掉、用掉、被毁时由 `card-exit.ts` 缓动 */
    readonly dissolve: DissolveState = { amount: 0, colours: [] };

    constructor(
        scene: Scene,
        readonly consumable: Consumable,
        private readonly onClick: (consumable: Consumable) => void,
    ) {
        const quad = {
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
            dissolve: this.dissolve,
        };
        this.layers = new LayeredQuad(scene, quad, 2, { edition: consumable.edition, set: consumable.center.set });
        this.placed = new PlacedLayers(scene, this.layers, quad, CARD_W, CARD_H);
        // The Soul 的宝石是 `G.shared_soul`：`centers` 图集里 `P_CENTERS.soul.pos`（`game.lua:175`）
        if (consumable.key === 'c_soul') {
            this.placed.addFloating(scene, 'soul', { ...quad, textureKey: 'centers', atlas: CENTERS_ATLAS, pos: { x: 0, y: 1 } });
        }

        makeClickable(this.shader, this.w, this.h, {
            onClick: () => this.onClick(this.consumable),
            onOver: () => { this.hoverTilt = 1; this.placed.hovered = true; },
            onOut: () => { this.hoverTilt = 0; this.placed.hovered = false; },
        });
    }

    /** `xTiles` / `yTiles` 是左上角，tile 单位。换算只发生在这一层（10 号票）。商店、开包里用 */
    layout(xTiles: number, yTiles: number): void {
        this.place({ x: xTiles, y: yTiles, r: 0 }, 0);
    }

    /** 按 `align_cards` 算出的目标摆（小丑区 / 消耗品区），`index` 定深度 */
    place(p: Placed, index: number): void {
        this.placed.place(p, index);
    }

    /** 可见矩形（tile） */
    get rect(): { x: number; y: number; w: number; h: number } {
        return this.placed.rect;
    }

    /** 上一帧的 x（tile），`align_cards` 要 */
    get prevX(): number {
        return this.placed.prevX;
    }

    /** 底层（点击区挂在它上面） */
    get shader(): GameObjects.Shader {
        return this.layers.main;
    }

    /** 计分时弹一下：`card_eval_status_text` 的 `juice_up(0.6, 0.1)`（`common_events.lua:896`） */
    pop(): void {
        this.placed.juiceUp(0.6, 0.1);
    }

    /** 退场（`card-exit.ts`）要的那几样 */
    get topDepth(): number {
        return this.placed.topDepth;
    }

    juiceUp(amount?: number, rot?: number): void {
        this.placed.juiceUp(amount, rot);
    }

    pinch(): void {
        this.placed.pinch();
    }

    setTargetR(r: number): void {
        this.placed.setTargetR(r);
    }

    disableInput(): void {
        this.shader.disableInteractive();
        this.hoverTilt = 0;
        this.placed.hovered = false;
    }

    destroy(): void {
        this.layers.destroy();
        this.placed.destroy();
    }
}
