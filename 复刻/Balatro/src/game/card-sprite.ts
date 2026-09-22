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
import { Motion } from './moveable';
import { cardsTexture, shadowsOn } from './settings';
import {
    CENTERS_ATLAS,
    DECK_ATLAS,
    LayeredQuad,
    cardTimeOf,
    makeClickable,
    makeShaderQuad,
    type DissolveState,
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
export const SEAL_POS: Record<string, { x: number; y: number }> = {
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
    /** `Card.dissolve` / `dissolve_colours`：碎掉、被毁时由 `card-exit.ts` 缓动（所有层共用这一张表，阴影也跟着溶） */
    readonly dissolve: DissolveState = { amount: 0, colours: [] };

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
        const dissolve = this.dissolve;

        // **强化牌换的是底板那一格**，不是正面：`Enhancers.png` 里
        // `c_base` 在 `{x=1,y=0}`，8 张强化各占一格（`game.lua:649-656`）
        const basePos = card.enhancement
            ? ENHANCEMENT_CENTERS[card.enhancement].pos
            : BASE_POS;

        // 被削弱的牌底板与正面都盖 `debuff`（建精灵时的状态；Boss 在摸牌前就定了）
        const look = { edition: card.edition, debuff: card.debuff };
        this.baseLayers = new LayeredQuad(scene, {
            name: `base_${card.key}_${card.unique_val}`,
            textureKey: 'centers',
            atlas: CENTERS_ATLAS,
            pos: basePos,
            cardTime, w, h, tilt, dissolve,
        }, 0, look);

        this.frontLayers = new LayeredQuad(scene, {
            name: `card_${card.key}_${card.unique_val}`,
            textureKey: cardsTexture(),
            atlas: DECK_ATLAS,
            pos,
            cardTime, w, h, tilt, dissolve,
        }, 1, look);

        this.seal = card.seal
            ? new LayeredQuad(scene, {
                name: `seal_${card.key}_${card.unique_val}`,
                textureKey: 'centers',
                atlas: CENTERS_ATLAS,
                pos: SEAL_POS[card.seal],
                cardTime, w, h, tilt, dissolve,
                shader: 'dissolve',
            }, 1.5, { set: card.seal === 'Gold' ? 'Voucher' : undefined })
            : null;

        this.back = makeShaderQuad(scene, {
            name: `back_${card.key}_${card.unique_val}`,
            textureKey: 'centers',
            atlas: CENTERS_ATLAS,
            pos: BACK_POS,
            cardTime, w, h, tilt, dissolve,
        });
        this.back.setDepth(2);

        this.shadow = makeShaderQuad(scene, {
            name: `shadow_${card.key}_${card.unique_val}`,
            textureKey: 'centers',
            atlas: CENTERS_ATLAS,
            pos: basePos,
            cardTime, w, h, tilt: () => 0, dissolve,
            shadow: true,
        });
        this.shadow.setDepth(-1);

        // `card.lua:58`：**所有卡的 `T.scale` 都是 0.95**，以中心缩放。阴影再 × (1 − 0.2·shadow_height)。
        // 之后每帧按 `VT.scale` 重设（悬停、`juice_up` 都在它上面）
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
                onOver: () => { this.hoverTilt = 1; if (this.motion) this.motion.hovered = true; },
                onOut: () => { this.hoverTilt = 0; if (this.motion) this.motion.hovered = false; },
            });
        }
        scene.events.on('postupdate', this.onPostUpdate);
    }

    /** `T` → `VT` 的缓动（`moveable.lua`）。第一次摆放时落定，或从 `spawnFrom` 飞过来 */
    private motion: Motion | null = null;
    private depth = 10;
    private readonly onPostUpdate = (time: number, delta: number) => this.render(time / 1000, delta / 1000);
    /**
     * 重建精灵（塔罗改了强化、换了花色……）时接着上一个精灵的缓动走，而不是瞬移。
     * `from` 之后就不再用
     */
    adoptMotion(from: CardSprite): void {
        const m = from.motion;
        if (!m) return;
        this.motion = new Motion(m.T);
        Object.assign(this.motion.VT, m.VT);
        Object.assign(this.motion.velocity, m.velocity);
    }

    /**
     * 还在牌堆里、没轮到摸的牌：到这个时刻（秒，场景时间）之前不画、不开始缓动。
     * `draw_from_deck_to_hand` 逐张 `draw_card`，每张是 `trigger = 'before', delay = 0.1` 的事件，所以隔 0.1 秒一张
     */
    holdUntil = 0;

    /** 下一次（第一次）摆放时 VT 从这里出发：摸牌从牌堆飞进手牌（`draw_card` 的 `from:remove_card` 后 `to:emplace`） */
    spawnFrom: { x: number; y: number } | null = null;

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
        if (!this.motion && this.scene.time.now / 1000 < this.holdUntil) {
            for (const q of this.allQuads()) q.setVisible(false);
            this.prevX = p.x;
            return;
        }
        if (!this.motion) {
            const from = this.spawnFrom ?? p;
            this.motion = new Motion({ x: from.x, y: from.y, r: p.r, scale: CARD_SCALE });
        }
        const T = this.motion.T;
        T.x = p.x;
        T.y = p.y;
        T.r = p.r;
        this.depth = 10 + index;
        const d = this.depth;
        this.baseLayers.setDepth(d);
        this.frontLayers.setDepth(d + 0.1);
        this.seal?.setDepth(d + 0.2);
        this.back.setDepth(d + 0.3);
        this.shadow.setDepth(1 + index * 0.001);
        this.prevX = p.x;
        this.applyFacing();
        this.render(this.scene.time.now / 1000, 0);
    }

    /** 可见矩形（tile） */
    /** 已经出现在屏幕上了（新摸的牌在 `holdUntil` 之前还藏着） */
    get appeared(): boolean {
        return !!this.motion;
    }

    get rect(): { x: number; y: number; w: number; h: number } {
        const VT = this.motion?.VT ?? { x: 0, y: 0 };
        return { x: VT.x, y: VT.y, w: CARD_W, h: CARD_H };
    }

    /** 按缓动后的 `VT` 画。阴影从 VT 往视差反方向错开（视差按 `T.x` 算，`calculate_parrallax`） */
    private render(now: number, dt: number): void {
        const m = this.motion;
        if (!m) return;
        m.step(dt, now);
        if (this.flipTo && m.wScale <= 0) {
            this.shownFacing = this.flipTo;
            this.flipTo = null;
            m.pinchX = false;
            this.applyFacing();
        }
        const VT = m.VT;
        const cx = toPx(VT.x + CARD_W / 2);
        const cy = toPx(VT.y + CARD_H / 2);
        for (const layer of [this.baseLayers, this.frontLayers]) {
            layer.setPosition(cx, cy);
            layer.setRotation(VT.r);
        }
        this.seal?.setPosition(cx, cy);
        this.seal?.setRotation(VT.r);
        this.back.setPosition(cx, cy).setRotation(VT.r);
        // `pinch.x` 只缩横向（`VT.w`）
        for (const q of this.allQuads()) if (q !== this.shadow) q.setScale(VT.scale * m.wScale, VT.scale);
        const sh = SHADOW_HEIGHT;
        // `card.lua:4368`：设置关了阴影就不画；**玻璃牌从来没有投影**（`ability.effect ~= 'Glass Card'`）
        this.shadow.setVisible(shadowsOn() && this.card.enhancement !== 'm_glass');
        const spx = cardShadowParallaxX(m.T.x, CARD_W);
        this.shadow.setScale(VT.scale * (1 - 0.2 * sh) * m.wScale, VT.scale * (1 - 0.2 * sh))
            .setPosition(cx - toPx(spx * sh), cy + toPx(1.5 * sh))
            .setRotation(VT.r);
    }

    /**
     * 按 `card.facing` 决定显示正面还是背面。
     *
     * **每次 layout 都重算**：`facing` 是逻辑层在抽牌时写的
     * （`Blind:stay_flipped`，其中 The Wheel 那条还消费 RNG），
     * 而一张牌可能在 Boss 被 disable 之后翻回正面。
     */
    private applyFacing(): void {
        const faceDown = (this.shownFacing ?? this.card.facing) === 'back';
        this.back.setVisible(faceDown);
        this.baseLayers.setVisible(!faceDown);
        // **石头牌不画正面**（`card.lua:4426` 那一串 `ability.effect ~= 'Stone Card'`）——
        // 它没有点数也没有花色，画出来就是在骗人。正面的版本叠加层也跟着不画（原文同一个条件）
        this.frontLayers.setVisible(!faceDown && !isStone(this.card));
        this.seal?.setVisible(!faceDown);
    }

    /** 计分时弹一下：`card_eval_status_text` 的 `juice_up(0.6, 0.1)`（`common_events.lua:896`） */
    pop(amount?: number): void {
        if (amount === undefined) this.motion?.cardJuiceUp(this.scene.time.now / 1000, 0.6, 0.1);
        else this.motion?.cardJuiceUp(this.scene.time.now / 1000, amount);
    }

    /**
     * `Card:flip` 的画面那一半（`sprite_facing`）：塔罗改牌时翻过去、换牌面、再翻回来。
     * 逻辑层的 `facing` 不动（改牌的塔罗翻两次，净效果为零），画的是这里的覆盖值
     */
    shownFacing: 'front' | 'back' | null = null;
    private flipTo: 'front' | 'back' | null = null;

    /** 横向捏到 0（`pinch.x`），那一刻换面、再撑开（`Card:update` 的 `flipping`） */
    flip(): void {
        const now = this.shownFacing ?? this.card.facing ?? 'front';
        this.flipTo = now === 'back' ? 'front' : 'back';
        if (this.motion) this.motion.pinchX = true;
    }

    /** 换精灵时接着上一张的翻面状态（翻到背面时换牌面，新精灵也得是背面、宽度也接着） */
    adoptFacing(from: CardSprite): void {
        this.shownFacing = from.shownFacing;
        this.flipTo = from.flipTo;
        if (this.motion && from.motion) {
            this.motion.pinchX = from.motion.pinchX;
            this.motion.wScale = from.motion.wScale;
        }
        this.applyFacing();
    }

    /** `Card:juice_up(scale, rot)`，参数缺省即原作缺省 */
    juiceUp(amount?: number, rot?: number): void {
        this.motion?.cardJuiceUp(this.scene.time.now / 1000, amount, rot);
    }

    /** 最上面那层的深度：退场碎屑画在它之上（原作的碎屑是卡的 child，跟着卡画） */
    get topDepth(): number {
        return this.depth + 0.4;
    }

    /** 退场时不再响应悬停 / 点击（原作 `remove` 之前卡还在区里，但已经点不动了） */
    disableInput(): void {
        for (const q of this.hoverTargets) q.disableInteractive();
        this.hoverTilt = 0;
        if (this.motion) this.motion.hovered = false;
    }

    /** `children.center.pinch.x = true` */
    pinch(): void {
        if (this.motion) this.motion.pinchX = true;
    }

    /** 直接改转角目标（`self.T.r = -0.2`） */
    setTargetR(r: number): void {
        if (this.motion) this.motion.T.r = r;
    }

    destroy(): void {
        this.scene.events.off('postupdate', this.onPostUpdate);
        for (const q of this.allQuads()) q.destroy();
    }

    /** 挂点击区的三层（悬停提示框也挂在这三层上） */
    get hoverTargets(): GameObjects.Shader[] {
        return [this.baseLayers.main, this.frontLayers.main, this.back];
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
