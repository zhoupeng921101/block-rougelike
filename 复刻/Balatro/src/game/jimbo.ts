/**
 * `card_character.lua` 的 `Card_Character`（22 号票第十八步）：结束界面左边那个说俏皮话的 Jimbo。
 *
 * 组成照原作：
 * - 一张 `j_joker`（`Card(..., G.P_CENTERS.j_joker)`），`start_materialize({BLUE, WHITE, RED})`：
 *   `dissolve` 在 0.6 秒里从 1 线性缓到 0，烧边取前两色；同时弹一下、冒一阵同色的碎屑（半程停止出新的，0.63 秒后移除）
 * - 自己的一团彩纸（`Particles`：每 0.03 秒一片、边长 0.3、速度 1.2、寿命 2 秒、红蓝橙、铺满 Jimbo 的矩形）
 * - 下方（`bm`）的对话气泡，0.1 秒后出现；`say_stuff(5)`：每 0.13 秒一句 `voice<n>`、卡弹一下，共 5 次
 *
 * 画的顺序（`Card_Character:draw`）：彩纸 → 气泡 → 卡。原作 `G.SETTINGS.paused` 时只有暂停中创建的对象在动，
 * Jimbo 与它的粒子都是暂停中建的，所以照常动。
 */
import type { Scene } from 'phaser';

import { C, type Colour } from '../ui/colours';
import { speechBubble } from '../ui/definitions/speech-bubble';
import { UIBox } from '../ui/uibox';
import { JOKER_ATLAS } from '../core/atlas';
import { CARD_H, CARD_W, toPx } from './coords';
import { Particles } from './particles';
import { PlacedLayers } from './placed-layers';
import { type DissolveState, LayeredQuad, cardTimeOf, makeClickable } from './shader-quad';
import { UIBoxView } from './ui-draw';

type Rect = { x: number; y: number; w: number; h: number };

/** `start_materialize` 的 `dissolve_time`（`timefac` 缺省 1） */
const DISSOLVE_TIME = 0.6;

export class Jimbo {
    private readonly colours: Colour[] = [C.BLUE, C.WHITE, C.RED];
    private readonly dissolve: DissolveState = { amount: 1, colours: this.colours };
    private readonly layers: LayeredQuad;
    private readonly placed: PlacedLayers;
    private readonly confetti: Particles;
    private materialize: Particles | null;
    private readonly bubble: UIBoxView;
    /** 气泡的 major（Jimbo 的矩形），每帧改它 */
    private readonly spotT: Rect;
    private readonly start: number;
    private said = 0;
    private lastSaid = 0;

    constructor(
        private readonly scene: Scene,
        /** `jimbo_spot` 当前的矩形（tile，已含 overlay 的滑动） */
        private readonly spot: () => Rect,
        quipKey: string,
        mobile: boolean,
        resolution: number,
        depth = 200,
    ) {
        this.start = scene.time.now / 1000;
        this.spotT = { ...spot() };
        const quad = {
            name: `jimbo_${Math.random().toString(36).slice(2, 7)}`,
            textureKey: 'jokers',
            atlas: JOKER_ATLAS,
            pos: { x: 0, y: 0 },
            cardTime: cardTimeOf(1),
            w: toPx(CARD_W),
            h: toPx(CARD_H),
            tilt: () => 0,
            dissolve: this.dissolve,
        };
        this.layers = new LayeredQuad(scene, quad, depth + 2, {});
        this.placed = new PlacedLayers(scene, this.layers, quad, CARD_W, CARD_H, { card: depth + 2, shadow: depth + 1.5 });
        this.placed.place(this.cardPlace(), 0);
        // `states.hover.can = true`、`hover = Node.hover`：悬停只放大，不出提示框
        makeClickable(this.layers.main, toPx(CARD_W), toPx(CARD_H), {
            onOver: () => { this.placed.hovered = true; },
            onOut: () => { this.placed.hovered = false; },
        });

        this.confetti = new Particles(scene, {
            timer: 0.03, scale: 0.3, speed: 1.2, lifespan: 2, colours: [C.RED, C.BLUE, C.ORANGE], fill: true,
            attach: () => this.spotT, depth: depth + 0.5,
        });
        // `start_materialize`：弹一下、冒碎屑、两声
        this.placed.juiceUp();
        this.materialize = new Particles(scene, {
            timer: 0.025 * DISSOLVE_TIME, scale: 0.25, speed: 3, lifespan: 0.7 * DISSOLVE_TIME,
            colours: this.colours, fill: true, attach: () => this.placed.rect, depth: depth + 2.5,
        });
        scene.sound.play('whoosh1', { rate: Math.random() * 0.1 + 0.6, volume: 0.3 });
        scene.sound.play(`crumple${1 + Math.floor(Math.random() * 5)}`, { rate: Math.random() * 0.2 + 1.2, volume: 0.8 });

        // `add_speech_bubble`：`bm` 挂在 Jimbo 下面，先藏着
        const box = new UIBox(speechBubble(quipKey, mobile), { align: 'bm', offset: { x: 0, y: 0 }, major: { T: this.spotT } });
        this.bubble = new UIBoxView(scene, box, depth + 1);
        this.bubble.setResolution(resolution);
        this.bubble.setVisible(false);
    }

    /** 卡在 Jimbo 矩形里居中（`Card_Character:align`） */
    private cardPlace() {
        const s = this.spot();
        return { x: s.x + (s.w - CARD_W) / 2, y: s.y + (s.h - CARD_H) / 2, r: 0 };
    }

    update(now: number): void {
        Object.assign(this.spotT, this.spot());
        this.placed.place(this.cardPlace(), 0);
        const t = now - this.start;

        // materialize：`dissolve` 0.6 秒线性到 0；半程停出碎屑；1.05 倍时长后移除
        this.dissolve.amount = Math.max(0, 1 - t / DISSOLVE_TIME);
        if (this.materialize) {
            if (t > 0.5 * DISSOLVE_TIME) this.materialize.max = 0;
            if (t > 1.05 * DISSOLVE_TIME) {
                this.materialize.destroy();
                this.materialize = null;
            }
        }

        // `say_stuff(5)`：0.1 秒后气泡出现、说第一句，之后每 0.13 秒一句
        if (t >= 0.1) this.bubble.setVisible(true);
        while (this.said < 5 && t >= 0.1 + 0.13 * this.said) {
            let n = 1 + Math.floor(Math.random() * 11);
            while (n === this.lastSaid) n = 1 + Math.floor(Math.random() * 11);
            this.lastSaid = n;
            this.scene.sound.play(`voice${1 + Math.floor(Math.random() * 11)}`, { rate: Math.random() * 0.2 + 1, volume: 0.5 });
            this.placed.juiceUp();
            this.said++;
        }
        this.bubble.update(now);
    }

    destroy(): void {
        this.placed.destroy();
        this.layers.destroy();
        this.confetti.destroy();
        this.materialize?.destroy();
        this.bubble.destroy();
    }
}
