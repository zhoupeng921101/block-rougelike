/**
 * 单层卡（小丑、消耗品）按 `align_cards` 的结果摆放（22 号票）：与 `CardSprite.place` 同一套——
 * `card.lua:58` 的 `T.scale = 0.95`、阴影（`G.shared_shadow` 就是卡面自己，`shadow_height = 0.1`，
 * `sprite.lua:76` 往视差反方向错开并缩 `1 − 0.2·h`）、按下标分深度（后压前，全部阴影在全部卡之下）。
 */
import type { GameObjects, Scene } from 'phaser';

import type { Placed } from './align-cards';
import { cardShadowParallaxX } from './align-cards';
import { toPx } from './coords';
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
    /** 上一帧的 x（tile）：`align_cards` 的正弦相位与阴影视差读它 */
    prevX = 0;
    /** 浮层的阴影与本体；它每帧自己动，所以记下卡最近一次的摆放 */
    private floating: { kind: FloatingKind; shadow: GameObjects.Shader; body: GameObjects.Shader } | null = null;
    private last = { cx: 0, cy: 0, r: 0, depth: 0 };
    private readonly onUpdate = (time: number) => this.updateFloating(time / 1000);

    constructor(
        scene: Scene,
        private readonly layers: LayeredQuad,
        quad: QuadOptions,
        /** 卡面尺寸（tile），小丑有几张不是标准尺寸 */
        private readonly wTiles: number,
        private readonly hTiles: number,
    ) {
        this.shadow = makeShaderQuad(scene, { ...quad, name: `${quad.name}_shadow`, tilt: () => 0, shadow: true, shader: 'dissolve' });
        for (const q of layers.quads) q.setScale(CARD_SCALE);
        this.shadow.setScale(CARD_SCALE * (1 - 0.2 * SHADOW_HEIGHT)).setDepth(1);
    }

    /** 加浮层。`quad` 是浮层自己那一格（尺寸同卡） */
    addFloating(scene: Scene, kind: FloatingKind, quad: QuadOptions): void {
        this.floating = {
            kind,
            shadow: makeShaderQuad(scene, { ...quad, name: `${quad.name}_fshadow`, tilt: () => 0, shadow: true, shader: 'dissolve' }),
            body: makeShaderQuad(scene, { ...quad, name: `${quad.name}_float`, shader: 'dissolve' }),
        };
        this.scene = scene;
        scene.events.on('update', this.onUpdate);
    }

    private scene: Scene | null = null;

    private updateFloating(t: number): void {
        const f = this.floating;
        if (!f) return;
        const { scale, rotate } = floatingMods(f.kind, t);
        const { cx, cy, r, depth } = this.last;
        const k = CARD_SCALE * (1 + scale);
        // 阴影那遍 `_shadow_height = 0`：不错开、不缩，只是 `draw_from` 的 my 往下挪
        f.shadow.setPosition(cx, cy + toPx(0.1 + 0.03 * Math.sin(1.8 * t))).setRotation(r + rotate).setScale(k).setDepth(depth + 0.005);
        f.body.setPosition(cx, cy).setRotation(r + rotate).setScale(k).setDepth(depth + 0.006);
    }

    /** `p` 是左上角（tile）与转角 */
    place(p: Placed, index: number): void {
        const cx = toPx(p.x + this.wTiles / 2);
        const cy = toPx(p.y + this.hTiles / 2);
        this.layers.setDepth(10 + index);
        this.layers.setPosition(cx, cy);
        this.layers.setRotation(p.r);
        this.last = { cx, cy, r: p.r, depth: 10 + index };
        const spx = cardShadowParallaxX(p.x, this.wTiles);
        this.shadow.setDepth(1 + index * 0.001)
            .setPosition(toPx(p.x + this.wTiles / 2 - spx * SHADOW_HEIGHT), toPx(p.y + this.hTiles / 2 + 1.5 * SHADOW_HEIGHT))
            .setRotation(p.r);
        this.prevX = p.x;
    }

    setVisible(v: boolean): void {
        this.layers.setVisible(v);
        this.shadow.setVisible(v);
        this.floating?.shadow.setVisible(v);
        this.floating?.body.setVisible(v);
    }

    destroy(): void {
        this.shadow.destroy();
        if (this.floating) {
            this.scene?.events.off('update', this.onUpdate);
            this.floating.shadow.destroy();
            this.floating.body.destroy();
            this.floating = null;
        }
    }
}
