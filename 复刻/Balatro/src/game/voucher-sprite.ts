/**
 * 一张优惠券的表现层。
 *
 * 与消耗品同一个形状：`Vouchers.png` 里那一格就是完整卡面，外加一层 `voucher` 扫光
 * （`card.lua:4454`，20 号票）。
 */

import type { GameObjects, Scene } from 'phaser';

import { CENTERS_ATLAS, VOUCHER_ATLAS } from '../core/atlas';
import type { VoucherCenter } from '../core/vouchers';
import { CARD_H, CARD_W, toPx } from './coords';
import type { Placed } from './align-cards';
import { PlacedLayers } from './placed-layers';
import { Particles } from './particles';
import { type DissolveState, LayeredQuad, cardTimeOf, makeClickable } from './shader-quad';
import { C } from '../ui/colours';

/** `start_materialize` 的 `dissolve_time`（`timefac` 缺省 1） */
const DISSOLVE_TIME = 0.6;

export class VoucherSprite {
    private hoverTilt = 0;
    private readonly layers: LayeredQuad;
    private readonly placed: PlacedLayers;
    readonly w = toPx(CARD_W);
    readonly h = toPx(CARD_H);

    constructor(
        scene: Scene,
        readonly center: VoucherCenter,
        private readonly onClick: () => void,
        /** 卡与阴影的基准深度（Run Info 的 Vouchers 页要压在 overlay 之上） */
        depthBase?: { card: number; shadow: number },
        /** `Card:start_materialize(nil, silent)`：建出来时溶入（Run Info 的 Vouchers 页） */
        materialize?: { silent: boolean },
        /** 图鉴：没解锁的画 `v_locked`（{8,3}），没发现的画 `v_undiscovered`（{8,2}）再浮一张问号 */
        display?: 'locked' | 'undiscovered',
    ) {
        const quad = {
            name: `voucher_${center.order}_${Math.random().toString(36).slice(2, 7)}`,
            textureKey: 'vouchers',
            atlas: VOUCHER_ATLAS,
            pos: display === 'locked' ? { x: 8, y: 3 } : display === 'undiscovered' ? { x: 8, y: 2 } : center.pos,
            // 与小丑／塔罗／补充包错开，免得 shader 动画同相
            cardTime: cardTimeOf(center.order + 600),
            w: this.w,
            h: this.h,
            tilt: () => this.hoverTilt,
            dissolve: this.dissolve,
        };
        this.layers = new LayeredQuad(scene, quad, 2, { set: 'Voucher' });
        this.placed = new PlacedLayers(scene, this.layers, quad, this.w / toPx(1), this.h / toPx(1), depthBase);
        if (display === 'undiscovered') this.placed.addFloating(scene, 'undiscovered', { ...quad, textureKey: 'centers', atlas: CENTERS_ATLAS, pos: { x: 6, y: 3 } });
        if (materialize) this.startMaterialize(scene, materialize.silent, (depthBase?.card ?? 10) + 0.5);

        makeClickable(this.shader, this.w, this.h, {
            onClick: () => this.onClick(),
            onOver: () => { this.hoverTilt = 1; this.placed.hovered = true; },
            onOut: () => { this.hoverTilt = 0; this.placed.hovered = false; },
        });
    }

    /** `xTiles` / `yTiles` 是左上角，tile 单位。换算只发生在这一层（10 号票） */
    layout(xTiles: number, yTiles: number): void {
        this.place({ x: xTiles, y: yTiles, r: 0 }, 0);
    }

    /** 按 `align_cards` 的结果摆：`T.scale = 0.95`、阴影、缓动都在 `PlacedLayers` 里 */
    place(p: Placed, index: number): void {
        this.placed.place(p, index);
    }

    /** 选中（点一下；按钮挂在它身上） */
    highlighted = false;

    /** 上一帧的 x（tile），`align_cards` 要 */
    get prevX(): number {
        return this.placed.prevX;
    }

    /** 可见矩形（tile） */
    get rect(): { x: number; y: number; w: number; h: number } {
        return this.placed.rect;
    }

    /** 底层（点击区挂在它上面） */
    get shader(): GameObjects.Shader {
        return this.layers.main;
    }

    /** `dissolve` 与烧边色（`start_materialize` 时 1 → 0；优惠券是 `{SECONDARY_SET.Voucher, CLEAR}`） */
    private readonly dissolve: DissolveState = { amount: 0, colours: [C.SECONDARY_SET.Voucher, C.CLEAR] };
    private materializing: { start: number; particles: Particles | null } | null = null;
    private readonly onPostUpdate = (time: number) => this.stepMaterialize(time / 1000);
    private scene: Scene | null = null;

    /** `materialize` 期间（`states.hover.can = false`）不响应悬停 */
    get hoverable(): boolean {
        return !this.materializing;
    }

    /**
     * `card.lua:2186`：`dissolve` 置 1、0.6 秒线性缓到 0；弹一下；同色碎屑半程停出、1.05 倍时长后移除、才能悬停。
     * 不 `silent` 时 `whoosh1` + `crumple<n>` 两声（一批里只有第一张出声）
     */
    private startMaterialize(scene: Scene, silent: boolean, depth: number): void {
        this.scene = scene;
        const now = scene.time.now / 1000;
        this.dissolve.amount = 1;
        this.placed.juiceUp();
        const particles = new Particles(scene, {
            timer: 0.025 * DISSOLVE_TIME, scale: 0.25, speed: 3, lifespan: 0.7 * DISSOLVE_TIME,
            colours: [C.SECONDARY_SET.Voucher, C.CLEAR], fill: true, attach: () => this.placed.rect, depth,
        });
        this.materializing = { start: now, particles };
        if (!silent) {
            scene.sound.play('whoosh1', { rate: Math.random() * 0.1 + 0.6, volume: 0.3 });
            scene.sound.play(`crumple${1 + Math.floor(Math.random() * 5)}`, { rate: Math.random() * 0.2 + 1.2, volume: 0.8 });
        }
        scene.events.on('postupdate', this.onPostUpdate);
    }

    private stepMaterialize(now: number): void {
        const m = this.materializing;
        if (!m) return;
        const t = now - m.start;
        this.dissolve.amount = Math.max(0, 1 - t / DISSOLVE_TIME);
        if (m.particles && t > 0.5 * DISSOLVE_TIME) m.particles.max = 0;
        if (t > 1.05 * DISSOLVE_TIME) {
            m.particles?.destroy();
            this.materializing = null;
            this.scene?.events.off('postupdate', this.onPostUpdate);
        }
    }

    destroy(): void {
        this.materializing?.particles?.destroy();
        this.materializing = null;
        this.scene?.events.off('postupdate', this.onPostUpdate);
        this.layers.destroy();
        this.placed.destroy();
    }
}
