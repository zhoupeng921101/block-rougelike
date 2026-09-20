/**
 * 一张扑克牌的表现层。
 *
 * 原作每张牌是**两层**：底板（`Enhancers` 图集的 `c_base`）+ 正面（`8BitDeck` 图集）。
 * `8BitDeck` 里的牌面是透明背景的花色与数字，没有白底，所以底板不能省。
 *
 * shader quad 的公共部分在 [`shader-quad.ts`](./shader-quad.ts)。
 */

import type { GameObjects, Scene } from 'phaser';

import type { Card, Suit } from '../core/card';
import { ENHANCEMENT_CENTERS, isStone } from '../core/enhancements';
import { CARD_H, CARD_W, toPx } from './coords';
import {
    CENTERS_ATLAS,
    DECK_ATLAS,
    cardTimeOf,
    makeClickable,
    makeShaderQuad,
} from './shader-quad';

/** `game.lua:302` 起 `P_CARDS` 的 `pos.y`：花色决定行。 */
const SUIT_ROW: Record<Suit, number> = { Hearts: 0, Clubs: 1, Diamonds: 2, Spades: 3 };
/** `pos.x`：点数决定列，2 → 0 … A → 12。 */
const VALUE_COL: Record<string, number> = {
    '2': 0, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6, '9': 7, '10': 8,
    Jack: 9, Queen: 10, King: 11, Ace: 12,
};

/** `game.lua:368` 的 `c_base`，`pos = {x=1,y=0}` */
const BASE_POS = { x: 1, y: 0 } as const;

/**
 * 牌背。`card.lua:213` 用的是 `centers` 图集（`Enhancers.png`）加上
 * 当前牌组的 `pos`——红牌组 `b_red` 是 `{x=0,y=0}`（`game.lua:629`）。
 *
 * 所以牌背与底板在同一张图集里、只差一列，不需要额外的纹理。
 */
const BACK_POS = { x: 0, y: 0 } as const;

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
    /**
     * 牌背层。盖着的牌（`card.facing === 'back'`）只显示它。
     *
     * 四个 Boss 会盖牌（The Wheel / The House / The Mark / The Fish）。
     * 盖牌**不改任何数值**——牌还能选、还照常计分，玩家只是看不见它是什么。
     */
    readonly back: GameObjects.Shader;
    /** 选中的牌抬起来。`G.HIGHLIGHT_H` 在原作里是 tile 量。 */
    highlighted = false;
    /** 被 debuff 的牌画得暗一点。逻辑层的 `card.debuff` 是真状态，不是显示标记 */
    private readonly dimmed: boolean;

    constructor(
        private readonly scene: Scene,
        readonly card: Card,
        private readonly onClick: (card: Card) => void,
    ) {
        const pos = atlasPos(card);
        const w = toPx(CARD_W);
        const h = toPx(CARD_H);
        const cardTime = cardTimeOf(card.sort_id);
        const tilt = () => this.hoverTilt;
        this.dimmed = card.debuff;

        // **强化牌换的是底板那一格**，不是正面：`Enhancers.png` 里
        // `c_base` 在 `{x=1,y=0}`，8 张强化各占一格（`game.lua:649-656`）
        const basePos = card.enhancement
            ? ENHANCEMENT_CENTERS[card.enhancement].pos
            : BASE_POS;

        this.base = makeShaderQuad(scene, {
            name: `base_${card.key}_${card.unique_val}`,
            textureKey: 'centers',
            atlas: CENTERS_ATLAS,
            pos: basePos,
            cardTime, w, h, tilt,
        });
        this.base.setDepth(0);

        this.shader = makeShaderQuad(scene, {
            name: `card_${card.key}_${card.unique_val}`,
            textureKey: 'cards',
            atlas: DECK_ATLAS,
            pos,
            cardTime, w, h, tilt,
        });
        this.shader.setDepth(1);
        // **石头牌不画正面**（`card.lua:4426` 那一串 `ability.effect ~= 'Stone Card'`）——
        // 它没有点数也没有花色，画出来就是在骗人


        this.back = makeShaderQuad(scene, {
            name: `back_${card.key}_${card.unique_val}`,
            textureKey: 'centers',
            atlas: CENTERS_ATLAS,
            pos: BACK_POS,
            cardTime, w, h, tilt,
        });
        this.back.setDepth(2);

        // `Shader` 没有 Tint 组件、`setAlpha` 是 NOOP，所以「藏起来」只能靠
        // `setVisible`——它来自 Visible 组件，是 Shader 混入的那 8 个之一
        this.applyFacing();

        makeClickable(this.shader, w, h, {
            onClick: () => this.onClick(this.card),
            onOver: () => { this.hoverTilt = 1; },
            onOut: () => { this.hoverTilt = 0; },
        });
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
        this.back.setPosition(x, y);
        this.applyFacing();
    }

    /**
     * 按 `card.facing` 决定显示正面还是背面。
     *
     * **每次 layout 都重算**：`facing` 是逻辑层在抽牌时写的
     * （`Blind:stay_flipped`，其中 The Wheel 那条还消费 RNG），
     * 而一张牌可能在 Boss 被 disable 之后翻回正面。
     */
    private applyFacing(): void {
        const faceDown = this.card.facing === 'back';
        this.back.setVisible(faceDown);
        this.base.setVisible(!faceDown);
        // **石头牌不画正面**（`card.lua:4426` 那一串 `ability.effect ~= 'Stone Card'`）——
        // 它没有点数也没有花色，画出来就是在骗人
        this.shader.setVisible(!faceDown && !isStone(this.card));
    }

    /** 被 debuff 的牌要看得出来。`Shader` 的 setAlpha 是 NOOP，所以缩一点当提示。 */
    get isDimmed(): boolean {
        return this.dimmed;
    }

    /** 计分时的弹一下。对应原作的 `juice_up`。 */
    pop(): void {
        for (const layer of [this.base, this.shader, this.back]) {
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
        this.back.destroy();
    }

    /** 让 `scene` 字段不被 noUnusedParameters 判死，同时留个取用口 */
    get owner(): Scene {
        return this.scene;
    }
}
