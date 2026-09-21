/**
 * 单层卡（小丑、消耗品）按 `align_cards` 的结果摆放（22 号票）：与 `CardSprite.place` 同一套——
 * `card.lua:58` 的 `T.scale = 0.95`、阴影（`G.shared_shadow` 就是卡面自己，`shadow_height = 0.1`，
 * `sprite.lua:76` 往视差反方向错开并缩 `1 − 0.2·h`）、按下标分深度（后压前，全部阴影在全部卡之下）。
 */
import type { GameObjects, Scene } from 'phaser';

import type { Placed } from './align-cards';
import { cardShadowParallaxX } from './align-cards';
import { toPx } from './coords';
import { Motion } from './moveable';
import { type LayeredQuad, type QuadOptions, makeShaderQuad } from './shader-quad';

const CARD_SCALE = 0.95;
const SHADOW_HEIGHT = 0.1;

/**
 * 浮在卡面上的那一层（`card.lua:4513`）：The Soul 的宝石（`G.shared_soul`，`centers` 图集 `{0,1}`）、
 * 传奇小丑与 Hologram 的 `soul_pos`（`floating_sprite`）。`draw_from` 以卡心为轴，额外缩放 `1 + scale_mod`、
 * 额外转 `rotate_mod`；先画一遍阴影模式（下移 `0.1 + 0.03·sin(1.8t)` tile），再画本体。两种的摆动幅度不同
 */
export type FloatingKind = 'soul' | 'soul_pos';

function floatingMods(kind: FloatingKind, t: number): { scale: number; rotate: number } {
    const frac = t - Math.floor(t);
    if (kind === 'soul') {
        return {
            scale: 0.05 + 0.05 * Math.sin(1.8 * t) + 0.07 * Math.sin(frac * Math.PI * 14) * (1 - frac) ** 3,
            rotate: 0.1 * Math.sin(1.219 * t) + 0.07 * Math.sin(t * Math.PI * 5) * (1 - frac) ** 2,
        };
    }
    return { scale: 0.07 + 0.02 * Math.sin(1.8 * t), rotate: 0.05 * Math.sin(1.219 * t) };
}

export class PlacedLayers {
    readonly shadow: GameObjects.Shader;
    /** 上一帧的 x（tile，`T` 不是 `VT`）：`align_cards` 的正弦相位与阴影视差读它 */
    prevX = 0;
    /** `T` → `VT` 的缓动（`moveable.lua`）。第一次摆放时 `hard_set` 落定 */
    private motion: Motion | null = null;
    private depth = 10;
    private floating: { kind: FloatingKind; shadow: GameObjects.Shader; body: GameObjects.Shader } | null = null;
    private readonly onPostUpdate = (time: number, delta: number) => this.render(time / 1000, delta / 1000);

    constructor(
        private readonly scene: Scene,
        private readonly layers: LayeredQuad,
        quad: QuadOptions,
        /** 卡面尺寸（tile），小丑有几张不是标准尺寸 */
        private readonly wTiles: number,
        private readonly hTiles: number,
    ) {
        this.shadow = makeShaderQuad(scene, { ...quad, name: `${quad.name}_shadow`, tilt: () => 0, shadow: true, shader: 'dissolve' });
        for (const q of layers.quads) q.setScale(CARD_SCALE);
        this.shadow.setScale(CARD_SCALE * (1 - 0.2 * SHADOW_HEIGHT)).setDepth(1);
        // 场景的 `update` 摆完 `T` 之后再推进、再画（`postupdate`），免得晚一帧
        scene.events.on('postupdate', this.onPostUpdate);
    }

    /** 加浮层。`quad` 是浮层自己那一格（尺寸同卡） */
    addFloating(scene: Scene, kind: FloatingKind, quad: QuadOptions): void {
        this.floating = {
            kind,
            shadow: makeShaderQuad(scene, { ...quad, name: `${quad.name}_fshadow`, tilt: () => 0, shadow: true, shader: 'dissolve' }),
            body: makeShaderQuad(scene, { ...quad, name: `${quad.name}_float`, shader: 'dissolve' }),
        };
    }

    /** `p` 是左上角（tile）与转角：写进 `T`，画的是缓动后的 `VT` */
    place(p: Placed, index: number): void {
        if (!this.motion) this.motion = new Motion({ x: p.x, y: p.y, r: p.r, scale: CARD_SCALE });
        const T = this.motion.T;
        T.x = p.x;
        T.y = p.y;
        T.r = p.r;
        this.depth = 10 + index;
        this.shadow.setDepth(1 + index * 0.001);
        this.layers.setDepth(this.depth);
        this.prevX = p.x;
        this.render(this.scene.time.now / 1000, 0);
    }

    /** 可见矩形（tile，`VT` 左上角 + 卡面尺寸）：挂在卡上的按钮以它为 major */
    get rect(): { x: number; y: number; w: number; h: number } {
        const VT = this.motion?.VT ?? { x: 0, y: 0 };
        return { x: VT.x, y: VT.y, w: this.wTiles, h: this.hTiles };
    }

    /** 悬停时大 0.05（`zoom`） */
    set hovered(v: boolean) {
        if (this.motion) this.motion.hovered = v;
    }

    /** `juice_up`：计分、买下、用掉时弹一下 */
    juiceUp(amount?: number, rot?: number): void {
        this.motion?.juiceUp(this.scene.time.now / 1000, amount, rot);
    }

    private render(now: number, dt: number): void {
        const m = this.motion;
        if (!m) return;
        m.step(dt, now);
        const VT = m.VT;
        const cx = toPx(VT.x + this.wTiles / 2);
        const cy = toPx(VT.y + this.hTiles / 2);
        for (const q of this.layers.quads) q.setScale(VT.scale);
        this.layers.setPosition(cx, cy);
        this.layers.setRotation(VT.r);
        // `sprite.lua:76`：阴影从 VT 往视差反方向错开（视差按 T 算，`calculate_parrallax`），缩 `1 − 0.2·h`
        const spx = cardShadowParallaxX(m.T.x, this.wTiles);
        this.shadow.setScale(VT.scale * (1 - 0.2 * SHADOW_HEIGHT))
            .setPosition(cx - toPx(spx * SHADOW_HEIGHT), cy + toPx(1.5 * SHADOW_HEIGHT))
            .setRotation(VT.r);

        const f = this.floating;
        if (f) {
            const { scale, rotate } = floatingMods(f.kind, now);
            const k = VT.scale * (1 + scale);
            // 阴影那遍 `_shadow_height = 0`：不错开、不缩，只是 `draw_from` 的 my 往下挪
            f.shadow.setPosition(cx, cy + toPx(0.1 + 0.03 * Math.sin(1.8 * now))).setRotation(VT.r + rotate).setScale(k).setDepth(this.depth + 0.005);
            f.body.setPosition(cx, cy).setRotation(VT.r + rotate).setScale(k).setDepth(this.depth + 0.006);
        }
    }

    setVisible(v: boolean): void {
        this.layers.setVisible(v);
        this.shadow.setVisible(v);
        this.floating?.shadow.setVisible(v);
        this.floating?.body.setVisible(v);
    }

    destroy(): void {
        this.scene.events.off('postupdate', this.onPostUpdate);
        this.shadow.destroy();
        this.floating?.shadow.destroy();
        this.floating?.body.destroy();
        this.floating = null;
    }
}
