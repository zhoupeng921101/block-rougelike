/**
 * 只用来「看」的扑克牌：Run Info 牌型提示里那排示例牌（`create_UIBox_hand_tip` 的
 * `Card(0,0, 0.5·CARD_W, 0.5·CARD_H, G.P_CARDS[key], G.P_CENTERS.c_base)`，22 号票第二十三步），
 * 与 View Deck 里整副牌的缩小复制品（`view_deck` 的 `copy_card(card, nil, 0.7)`）。
 *
 * 与 `CardSprite` 同一套画法（底板 + 牌面 + 蜡封 + 阴影，版本与削弱叠在底板和牌面上），但尺寸可变、不接逻辑层的 `Card`、
 * 没有点击，深度由调用方给（要压在 overlay 之上）。缓动照 `Moveable`：`T` 是目标、画的是 `VT`。
 */
import type { GameObjects, Scene } from 'phaser';

import { CENTERS_ATLAS, DECK_ATLAS, JOKER_ATLAS } from '../core/atlas';
import { JOKER_CENTERS } from '../core/jokers/centers.generated';
import type { Edition } from '../core/editions';
import { ENHANCEMENT_CENTERS } from '../core/enhancements';
import { cardShadowParallaxX } from './align-cards';
import { SEAL_POS } from './card-sprite';
import { toPx } from './coords';
import { Motion } from './moveable';
import { type DissolveState, LayeredQuad, cardTimeOf, makeClickable, makeShaderQuad } from './shader-quad';
import { cardsTexture, shadowsOn } from './settings';

/** `P_CARDS` 的 key（`S_A`、`D_T`…）→ 图集格：花色定行、点数定列（2 → 0 … A → 12） */
const SUIT_ROW: Record<string, number> = { H: 0, C: 1, D: 2, S: 3 };
const RANK_COL: Record<string, number> = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7, T: 8, J: 9, Q: 10, K: 11, A: 12 };
const BASE_POS = { x: 1, y: 0 };
const SHADOW_HEIGHT = 0.1;

/** 复制品的样子：强化换底板（石头牌不画牌面）、版本、蜡封、被削弱（红叉）、`greyed`（View Deck 里不在牌堆的，底板与牌面改用 `played` 画） */
export type MiniCardLook = {
    enhancement?: string | null;
    edition?: Edition;
    seal?: string | null;
    debuff?: boolean;
    greyed?: boolean;
    /** `draw_layers = {'card'}`（View Deck）不画阴影 */
    shadow?: boolean;
    /** `Card.dissolve` / `dissolve_colours`：给了就由调用方缓动（主菜单那张黑桃 A 的 `start_materialize`） */
    dissolve?: DissolveState;
    /** 给了就多造一层背面（红牌组，Enhancers {0,0}），能 `flip()`：转场那张牌（`screenwipecard`）先背面、立刻翻过来 */
    facing?: 'front' | 'back';
};

let serial = 0;

export class MiniCard {
    private readonly base: LayeredQuad;
    private readonly front: LayeredQuad | null;
    private readonly seal: LayeredQuad | null;
    private readonly back: LayeredQuad | null;
    /** `sprite_facing`：画的是哪一面 */
    private shownFacing: 'front' | 'back';
    private flipTo: 'front' | 'back' | null = null;
    private readonly shadow: GameObjects.Shader | null;
    private readonly onPostUpdate = (time: number, delta: number) => this.render(time / 1000, delta / 1000);
    private motion: Motion | null = null;

    constructor(
        private readonly scene: Scene,
        key: string,
        /** 卡面尺寸（tile） */
        private readonly w: number,
        private readonly h: number,
        depth: number,
        look: MiniCardLook = {},
    ) {
        // `j_*`：一张小丑（开机 splash 中间那张 `j_joker`），只有底板一层、画小丑图集
        const joker = JOKER_CENTERS[key];
        const [suit, rank] = key.split('_') as [string, string];
        const id = serial++;
        const cardTime = cardTimeOf(1000 + id);
        const common = { cardTime, w: toPx(w), h: toPx(h), tilt: () => 0, dissolve: look.dissolve };
        const basePos = look.enhancement ? ENHANCEMENT_CENTERS[look.enhancement]!.pos : BASE_POS;
        // `card.lua:4429` 起：greyed 的牌底板与牌面**不画 dissolve**，只画叠层——版本、`debuff`（红叉）、最后 `played`（去饱和、半透明）。
        // 复刻件的底层 quad 就用叠层里的第一个 shader 画
        const greyedChain = look.greyed ? [...(look.debuff ? ['debuff' as const] : []), 'played' as const] : [];
        const shader = greyedChain[0];
        const layerLook = look.greyed
            ? { edition: look.edition, played: greyedChain.length > 1 }
            : { edition: look.edition, debuff: look.debuff };
        this.base = joker
            ? new LayeredQuad(scene, { ...common, name: `mini_base_${id}`, textureKey: 'jokers', atlas: JOKER_ATLAS, pos: joker.pos, shader }, depth, layerLook)
            : new LayeredQuad(scene, { ...common, name: `mini_base_${id}`, textureKey: 'centers', atlas: CENTERS_ATLAS, pos: basePos, shader }, depth, layerLook);
        this.front = joker || look.enhancement === 'm_stone'
            ? null
            : new LayeredQuad(scene, { ...common, name: `mini_front_${id}`, textureKey: cardsTexture(), atlas: DECK_ATLAS, pos: { x: RANK_COL[rank]!, y: SUIT_ROW[suit]! }, shader }, depth + 0.02, layerLook);
        this.seal = look.seal
            ? new LayeredQuad(scene, { ...common, name: `mini_seal_${id}`, textureKey: 'centers', atlas: CENTERS_ATLAS, pos: SEAL_POS[look.seal]!, shader: 'dissolve' }, depth + 0.04, { set: look.seal === 'Gold' ? 'Voucher' : undefined })
            : null;
        this.back = look.facing
            ? new LayeredQuad(scene, { ...common, name: `mini_back_${id}`, textureKey: 'centers', atlas: CENTERS_ATLAS, pos: { x: 0, y: 0 } }, depth + 0.03, {})
            : null;
        this.shownFacing = look.facing ?? 'front';
        this.shadow = look.shadow === false
            ? null
            : joker
                ? makeShaderQuad(scene, { ...common, name: `mini_shadow_${id}`, textureKey: 'jokers', atlas: JOKER_ATLAS, pos: joker.pos, shadow: true }).setDepth(depth - 0.5)
                : makeShaderQuad(scene, { ...common, name: `mini_shadow_${id}`, textureKey: 'centers', atlas: CENTERS_ATLAS, pos: basePos, shadow: true }).setDepth(depth - 0.5);
        scene.events.on('postupdate', this.onPostUpdate);
        this.applyVisibility();
    }

    /** `Card:flip`：横向捏到 0（`pinch.x`）那一刻换面、再撑开 */
    flip(): void {
        this.flipTo = this.shownFacing === 'back' ? 'front' : 'back';
        if (this.motion) this.motion.pinchX = true;
    }

    private applyVisibility(): void {
        const front = this.visible && this.shownFacing === 'front';
        for (const l of [this.base, this.front, this.seal]) for (const q of l?.quads ?? []) q.setVisible(front);
        for (const q of this.back?.quads ?? []) q.setVisible(this.visible && this.shownFacing === 'back');
        this.shadow?.setVisible(this.visible && shadowsOn());
    }

    /** 目标：左上角（tile）、转角、缩放（`T.scale`） */
    place(x: number, y: number, r: number, scale: number): void {
        if (!this.motion) this.motion = new Motion({ x, y, r, scale });
        Object.assign(this.motion.T, { x, y, r, scale });
    }

    /** `Card:juice_up`（参数是卡牌版的，内部 ×0.4） */
    juiceUp(amount?: number, rot?: number): void {
        this.motion?.cardJuiceUp(this.scene.time.now / 1000, amount, rot);
    }

    /** 可见矩形（tile，`VT` 左上角 + 卡面尺寸）：提示框挂在它上面 */
    get rect(): { x: number; y: number; w: number; h: number } {
        const VT = this.motion?.VT ?? { x: 0, y: 0 };
        return { x: VT.x, y: VT.y, w: this.w, h: this.h };
    }

    /** 悬停（`Card:hover`）：悬停时大 0.05（`zoom`），回调里由调用方弹一下、出提示框 */
    onHover(over: () => void, out: () => void): void {
        makeClickable(this.base.main, toPx(this.w), toPx(this.h), {
            onOver: () => {
                if (this.motion) this.motion.hovered = true;
                over();
            },
            onOut: () => {
                if (this.motion) this.motion.hovered = false;
                out();
            },
        });
    }

    /** `states.visible`：连阴影一起藏 */
    setVisible(on: boolean): void {
        this.visible = on;
        this.applyVisibility();
    }

    private visible = true;

    /** 同一区域里后面的牌压前面的：整张卡（含叠层）一起换深度 */
    setDepth(depth: number): void {
        this.base.setDepth(depth);
        this.front?.setDepth(depth + 0.02);
        this.seal?.setDepth(depth + 0.04);
        this.back?.setDepth(depth + 0.03);
    }

    private render(now: number, dt: number): void {
        const m = this.motion;
        if (!m) return;
        if (this.flipTo && !m.pinchX) m.pinchX = true;
        m.step(dt, now);
        if (this.flipTo && m.wScale <= 0) {
            this.shownFacing = this.flipTo;
            this.flipTo = null;
            m.pinchX = false;
            this.applyVisibility();
        }
        const { VT } = m;
        const sx = VT.scale * m.wScale;
        const cx = toPx(VT.x + this.w / 2);
        const cy = toPx(VT.y + this.h / 2);
        for (const l of [this.base, this.front, this.seal, this.back]) {
            if (!l) continue;
            l.setPosition(cx, cy);
            l.setRotation(VT.r);
            for (const q of l.quads) q.setScale(sx, VT.scale);
        }
        if (this.shadow) {
            this.shadow.setVisible(this.visible && shadowsOn());
            const spx = cardShadowParallaxX(m.T.x, this.w);
            this.shadow.setScale(sx * (1 - 0.2 * SHADOW_HEIGHT), VT.scale * (1 - 0.2 * SHADOW_HEIGHT))
                .setPosition(cx - toPx(spx * SHADOW_HEIGHT), cy + toPx(1.5 * SHADOW_HEIGHT))
                .setRotation(VT.r);
        }
    }

    private destroyed = false;

    destroy(): void {
        if (this.destroyed) return;
        this.destroyed = true;
        this.scene.events.off('postupdate', this.onPostUpdate);
        this.base.destroy();
        this.front?.destroy();
        this.seal?.destroy();
        this.back?.destroy();
        this.shadow?.destroy();
    }
}
