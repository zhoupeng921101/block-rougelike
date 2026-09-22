/**
 * `attention_text`（`UI_definitions.lua:987`）：计分时卡上冒出来的「+11」「+4 Mult」「X1.5 Mult」、出牌区上方的「Not Allowed!」。
 *
 * - 一个只装一段 DynaText 的 UIBox（`float`、`shadow`、`pop_in = 0`、`pop_in_rate = 6`，建好就 `pulse(0.5)`），
 *   按 `align` / `offset` 挂在卡（或出牌区）上，每帧跟着它走
 * - `backdrop_colour`：背后一颗大粒子（`scale 2.4`、寿命 5 秒、速度 0）当底色，从 0 慢慢长大
 * - 停 `hold + 0.1` 秒后字 `pop_out(3)` 缩回去，同时 `fade = 1 − 3·(t − 起点)`，字色与底色的 alpha 跟着降，降到 0 拆掉
 */
import type { Scene } from 'phaser';

import { C, type Colour, darken, lighten } from '../ui/colours';
import { DynaText } from '../ui/dynatext';
import { UIBox, type Rect, UIT } from '../ui/uibox';
import { Particles } from './particles';
import { UIBoxView } from './ui-draw';

export type AttentionTextArgs = {
    text: string;
    scale?: number;
    colour?: Colour;
    hold?: number;
    align?: string;
    /** 挂在谁身上（每帧读，tile） */
    major: () => Rect;
    offset?: { x: number; y: number };
    backdropColour?: Colour;
    rotate?: boolean;
    maxw?: number;
    /** `cover`：整块盖住 HUD 的某一格（色块同尺寸、`cover_colour`，建好时冒一阵同色系碎屑），挂在它身上 */
    cover?: boolean;
    coverColour?: Colour;
    coverAlign?: string;
    emboss?: number;
};

export class AttentionText {
    private readonly view: UIBoxView;
    private readonly major: { T: Rect };
    private readonly colour: Colour;
    private readonly backdrop: { colour: Colour; particles: Particles } | null;
    private readonly cover: { colours: [Colour, Colour, Colour]; particles: Particles } | null;
    private readonly text: DynaText;
    private readonly hold: number;
    private readonly born: number;
    private fadeStart: number | null = null;
    done = false;

    constructor(scene: Scene, private readonly args: AttentionTextArgs, resolution: number, depth: number) {
        this.colour = [...(args.colour ?? C.WHITE)] as Colour;
        this.hold = (args.hold ?? 0) + 0.1;
        this.born = scene.time.now / 1000;
        this.major = { T: { ...args.major() } };
        this.text = new DynaText({
            string: [args.text], scale: args.scale ?? 1, maxw: args.maxw, colours: [this.colour],
            float: true, shadow: true, silent: true, pop_in: 0, pop_in_rate: 6, rotate: args.rotate || undefined,
        });
        const coverRect = args.cover ? args.major() : null;
        const coverColour = args.cover ? [...(args.coverColour ?? C.RED)] as Colour : null;
        const box = new UIBox({ n: UIT.ROOT, config: {
            align: args.coverAlign ?? 'cm', minw: coverRect ? coverRect.w : 0.001, minh: coverRect ? coverRect.h : 0.001,
            padding: 0.03, r: 0.1, emboss: args.emboss, colour: coverColour ?? C.CLEAR,
        }, nodes: [
            { n: UIT.O, config: { object: this.text } },
        ] }, { align: args.align ?? 'cm', offset: args.offset ?? { x: 0, y: 0 }, major: this.major });
        if (coverColour) {
            const light = [...lighten(coverColour, 0.2)] as Colour;
            const dark = [...darken(coverColour, 0.2)] as Colour;
            const particles = new Particles(scene, {
                timer: 0.01, pulse_max: 15, max: 0, scale: 0.3, vel_variation: 0.2, padding: 0.1, fill: true, lifespan: 0.5, speed: 2.5,
                attach: () => ({ x: box.T.x, y: box.T.y, w: box.T.w, h: box.T.h }), colours: [coverColour, light, dark], depth: depth + 0.05,
            });
            this.cover = { colours: [coverColour, light, dark], particles };
        } else this.cover = null;
        this.text.pulse(0.5);
        this.view = new UIBoxView(scene, box, depth + 0.1);
        this.view.setResolution(resolution);
        if (args.backdropColour) {
            const colour = [...args.backdropColour] as Colour;
            const particles = new Particles(scene, {
                timer: 5, scale: 2.4, lifespan: 5, speed: 0, colours: [colour],
                attach: () => ({ x: box.T.x, y: box.T.y, w: box.T.w, h: box.T.h }), depth,
            });
            this.backdrop = { colour, particles };
        } else this.backdrop = null;
    }

    update(now: number): void {
        if (this.done) return;
        Object.assign(this.major.T, this.args.major());
        this.view.box.followMajor();
        if (now - this.born >= this.hold) {
            if (this.fadeStart === null) {
                this.fadeStart = now;
                this.text.startPopOut(3);
            }
            const fade = Math.max(0, 1 - 3 * (now - this.fadeStart));
            this.colour[3] = Math.min(this.colour[3], fade);
            if (this.backdrop) this.backdrop.colour[3] = Math.min(this.backdrop.colour[3], fade);
            if (this.cover) {
                const [c, l, d] = this.cover.colours;
                c[3] = Math.min(c[3], 2 * fade);
                l[3] = Math.min(l[3], fade);
                d[3] = Math.min(d[3], fade);
            }
            if (fade <= 0) {
                this.destroy();
                return;
            }
        }
        this.view.update(now);
    }

    destroy(): void {
        if (this.done) return;
        this.done = true;
        this.view.destroy();
        this.backdrop?.particles.destroy();
        this.cover?.particles.destroy();
    }
}
