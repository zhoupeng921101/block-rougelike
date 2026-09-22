/**
 * 一张小丑的表现层。
 *
 * 与扑克牌不同，小丑**只有一层**：`Jokers.png` 里那一格就是完整卡面，
 * 不需要底板（扑克牌需要，因为 `8BitDeck` 的牌面是透明背景的）。
 *
 * 三张小丑的卡面尺寸不是标准的（`card.lua:238-257`）：
 * Half Joker 高 ÷1.7、Photograph 高 ÷1.2、Square Joker 高 = 宽、Wee Joker ×0.7。
 * 那是**原作的表现层行为**，照做——它是这几张牌的识别特征。
 */

import type { GameObjects, Scene } from 'phaser';

import type { Joker } from '../core/jokers';
import type { Placed } from './align-cards';
import { CARD_H, CARD_W, toPx } from './coords';
import { PlacedLayers } from './placed-layers';
import { JOKER_ATLAS, LayeredQuad, cardTimeOf, makeClickable } from './shader-quad';

/**
 * `card.lua:238-257` 的那四条尺寸特例。
 *
 * 原文改的是 `self.T.h` / `self.T.w`，也就是**逻辑层的变换**——
 * 但它只影响碰撞与排版，不影响任何数值，所以复刻件把它放在表现层。
 */
function sizeOf(joker: Joker): { w: number; h: number } {
    let w = toPx(CARD_W);
    let h = toPx(CARD_H);
    switch (joker.ability.name) {
        case 'Half Joker':
            h /= 1.7;
            break;
        case 'Photograph':
            h /= 1.2;
            break;
        case 'Square Joker':
            h = w;
            break;
        case 'Wee Joker':
            w *= 0.7;
            h *= 0.7;
            break;
    }
    return { w, h };
}

export class JokerSprite {
    private hoverTilt = 0;
    /** 卡面 + 版本叠加层（20 号票） */
    private readonly layers: LayeredQuad;
    /** 摆放、阴影、缩放（`align_cards` 的结果落在这里） */
    private readonly placed: PlacedLayers;
    readonly w: number;
    readonly h: number;
    /** 被选中（商店里待买／小丑区里待卖） */
    highlighted = false;

    constructor(
        scene: Scene,
        readonly joker: Joker,
        private readonly onClick: (joker: Joker) => void,
    ) {
        const { w, h } = sizeOf(joker);
        this.w = w;
        this.h = h;

        const quad = {
            // 名字要唯一：同一张小丑可能同时在商店和小丑区
            name: `joker_${joker.key}_${joker.center.order}_${Math.random().toString(36).slice(2, 7)}`,
            textureKey: 'jokers',
            atlas: JOKER_ATLAS,
            pos: joker.center.pos,
            cardTime: cardTimeOf(joker.center.order),
            w, h,
            tilt: () => this.hoverTilt,
        };
        this.layers = new LayeredQuad(scene, quad, 2, { edition: joker.edition });
        this.placed = new PlacedLayers(scene, this.layers, quad, w / toPx(1), h / toPx(1));
        // 传奇小丑与 Hologram 的 `floating_sprite`（`card.lua:205`），Hologram 走 `hologram` shader
        if (joker.center.soul_pos) this.placed.addFloating(scene, joker.key === 'j_hologram' ? 'hologram' : 'soul_pos', { ...quad, pos: joker.center.soul_pos });

        makeClickable(this.shader, w, h, {
            onClick: () => this.onClick(this.joker),
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

    destroy(): void {
        this.layers.destroy();
        this.placed.destroy();
    }
}
