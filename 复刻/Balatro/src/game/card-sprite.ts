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
import { type Placed, cardShadowParallaxX } from './align-cards';
import {
    CENTERS_ATLAS,
    DECK_ATLAS,
    LayeredQuad,
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

/**
 * 蜡封：`game.lua:193` 的 `G.shared_seals`，也在 `centers` 图集（`Enhancers.png`）里，不用新素材。
 * `card.lua:4480`：用 `dissolve` 画在卡上，**Gold 再叠一层 `voucher` 扫光**
 */
const SEAL_POS: Record<string, { x: number; y: number }> = {
    Gold: { x: 2, y: 0 },
    Purple: { x: 4, y: 4 },
    Red: { x: 5, y: 4 },
    Blue: { x: 6, y: 4 },
};

/** `card.lua:58`：卡的 `T.scale` */
const CARD_SCALE = 0.95;
/** `card.lua:4369`：手牌区里的 `shadow_height`（出牌区选中、拖拽时 0.35，这里先只做 0.1） */
const SHADOW_HEIGHT = 0.1;

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

    /**
     * 底板层，画在正面之下。**版本叠加层两层都有**（`card.lua:4458` 起，
     * center 与 front 各叠一遍；Negative 两层都换底层 shader）
     */
    private readonly baseLayers: LayeredQuad;
    private readonly frontLayers: LayeredQuad;
    /** 蜡封（没有就是 null） */
    private readonly seal: LayeredQuad | null;
    /**
     * 牌背层。盖着的牌（`card.facing === 'back'`）只显示它。
     *
     * 四个 Boss 会盖牌（The Wheel / The House / The Mark / The Fish）。
     * 盖牌**不改任何数值**——牌还能选、还照常计分，玩家只是看不见它是什么。
     */
    readonly back: GameObjects.Shader;
    /**
     * 阴影层（`card.lua:4368`）：底板用 `dissolve` 的阴影模式再画一遍，往远离中线方向错开、缩小 2%。
     * 原作画的是 `G.shared_shadow`（正面朝上是底板、朝下是牌背，两者外形一样），这里恒用底板
     */
    private readonly shadow: GameObjects.Shader;
    /** 上一次摆放的 x（tile）。`align_cards` 的正弦相位与阴影视差读的是上一帧的 `T.x` */
    prevX = 0;
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

        const look = { edition: card.edition };
        this.baseLayers = new LayeredQuad(scene, {
            name: `base_${card.key}_${card.unique_val}`,
            textureKey: 'centers',
            atlas: CENTERS_ATLAS,
            pos: basePos,
            cardTime, w, h, tilt,
        }, 0, look);

        this.frontLayers = new LayeredQuad(scene, {
            name: `card_${card.key}_${card.unique_val}`,
            textureKey: 'cards',
            atlas: DECK_ATLAS,
            pos,
            cardTime, w, h, tilt,
        }, 1, look);

        this.seal = card.seal
            ? new LayeredQuad(scene, {
                name: `seal_${card.key}_${card.unique_val}`,
                textureKey: 'centers',
                atlas: CENTERS_ATLAS,
                pos: SEAL_POS[card.seal],
                cardTime, w, h, tilt,
                shader: 'dissolve',
            }, 1.5, { set: card.seal === 'Gold' ? 'Voucher' : undefined })
            : null;

        this.back = makeShaderQuad(scene, {
            name: `back_${card.key}_${card.unique_val}`,
            textureKey: 'centers',
            atlas: CENTERS_ATLAS,
            pos: BACK_POS,
            cardTime, w, h, tilt,
        });
        this.back.setDepth(2);

        this.shadow = makeShaderQuad(scene, {
            name: `shadow_${card.key}_${card.unique_val}`,
            textureKey: 'centers',
            atlas: CENTERS_ATLAS,
            pos: basePos,
            cardTime, w, h, tilt: () => 0,
            shadow: true,
        });
        this.shadow.setDepth(-1);

        // `card.lua:58`：**所有卡的 `T.scale` 都是 0.95**，以中心缩放。阴影再 × (1 − 0.2·shadow_height)。
        // 在这里设一次，`place` 不碰缩放——计分时的弹一下是缩放补间，每帧覆盖会把它吃掉
        for (const q of this.allQuads()) q.setScale(CARD_SCALE);
        this.shadow.setScale(CARD_SCALE * (1 - 0.2 * SHADOW_HEIGHT));

        // `Shader` 没有 Tint 组件、`setAlpha` 是 NOOP，所以「藏起来」只能靠
        // `setVisible`——它来自 Visible 组件，是 Shader 混入的那 8 个之一
        this.applyFacing();

        // **三层都挂点击区**：Phaser 的 `inputCandidate` 跳过不可见对象，只挂在正面层上的话，
        // 石头牌（不画正面）和被 Boss 盖住的牌（只画牌背）就点不到——原先正是这样。
        // 默认 `topOnly`，同一次点击只有最上面那个可见的会收到，不会触发两次
        for (const target of [this.baseLayers.main, this.frontLayers.main, this.back]) {
            makeClickable(target, w, h, {
                onClick: () => this.onClick(this.card),
                onOver: () => { this.hoverTilt = 1; },
                onOut: () => { this.hoverTilt = 0; },
            });
        }
    }

    /**
     * 逻辑层的 `T` 是 tile 量，这里换算到像素。换算只允许发生在这一层。
     *
     * `offsetXTiles` 是表现层的边距——**不写回 `card.T.x`**。
     * 逻辑层的 `T.x` 只由 `alignHand` 按下标赋值，表现层不改它。
     */
    layout(offsetXTiles: number, baseYTiles: number): void {
        const liftTiles = this.highlighted ? 0.6 : 0;
        this.place({ x: this.card.T.x + offsetXTiles, y: baseYTiles - liftTiles, r: 0 }, 0);
    }

    /**
     * 按 `align_cards` 算出的目标摆（22 号票）：`p` 是左上角（tile）与转角，`index` 定深度——
     * 后面的牌压前面的牌，全部阴影压在全部卡牌之下（`CardArea:draw` 先画完 'shadow' 层再画 'card' 层）。
     */
    place(p: Placed, index: number): void {
        const cx = toPx(p.x + CARD_W / 2);
        const cy = toPx(p.y + CARD_H / 2);
        const d = 10 + index;
        this.baseLayers.setDepth(d);
        this.frontLayers.setDepth(d + 0.1);
        this.seal?.setDepth(d + 0.2);
        this.back.setDepth(d + 0.3);
        for (const layer of [this.baseLayers, this.frontLayers]) {
            layer.setPosition(cx, cy);
            layer.setRotation(p.r);
        }
        this.seal?.setPosition(cx, cy);
        this.seal?.setRotation(p.r);
        this.back.setPosition(cx, cy).setRotation(p.r);
        // `sprite.lua:76`：阴影 VT 挪 `-shadow_parrallax * shadow_height`（y 分量恒 -1.5）
        const sh = SHADOW_HEIGHT;
        const spx = cardShadowParallaxX(p.x, CARD_W);
        this.shadow.setDepth(1 + index * 0.001)
            .setPosition(toPx(p.x + CARD_W / 2 - spx * sh), toPx(p.y + CARD_H / 2 + 1.5 * sh))
            .setRotation(p.r);
        this.prevX = p.x;
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
        this.baseLayers.setVisible(!faceDown);
        // **石头牌不画正面**（`card.lua:4426` 那一串 `ability.effect ~= 'Stone Card'`）——
        // 它没有点数也没有花色，画出来就是在骗人。正面的版本叠加层也跟着不画（原文同一个条件）
        this.frontLayers.setVisible(!faceDown && !isStone(this.card));
        this.seal?.setVisible(!faceDown);
    }

    /** 被 debuff 的牌要看得出来。`Shader` 的 setAlpha 是 NOOP，所以缩一点当提示。 */
    get isDimmed(): boolean {
        return this.dimmed;
    }

    /** 计分时的弹一下。对应原作的 `juice_up`。 */
    pop(): void {
        for (const layer of this.allQuads()) {
            this.scene.tweens.add({
                targets: layer,
                scaleX: CARD_SCALE * 1.18, scaleY: CARD_SCALE * 1.18,
                duration: 90, yoyo: true, ease: 'Quad.easeOut',
            });
        }
    }

    destroy(): void {
        for (const q of this.allQuads()) q.destroy();
    }

    /** 正面那一层的底（点击区挂在它上面） */
    get shader(): GameObjects.Shader {
        return this.frontLayers.main;
    }

    private allQuads(): GameObjects.Shader[] {
        return [...this.baseLayers.quads, ...this.frontLayers.quads, ...(this.seal?.quads ?? []), this.back, this.shadow];
    }

    /** 让 `scene` 字段不被 noUnusedParameters 判死，同时留个取用口 */
    get owner(): Scene {
        return this.scene;
    }
}
