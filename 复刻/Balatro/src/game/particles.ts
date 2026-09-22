/**
 * `engine/particles.lua` 的直译（22 号票）：开包时的闪光、天体包的星星与流星。
 *
 * 纯表现：颜色用的 `pseudorandom_element(self.colours)` 不带 seed，走的是全局 `math.random`，
 * 不碰任何 `pseudoseed` 流，所以这里用 `Math.random`。
 *
 * 挂在 `G.ROOM_ATTACH` 上（`attach`），以房间为中心；`fill` 时在整块区域里随机出生，
 * 区域是房间尺寸减去 `padding`（原作 `T.w = major.T.w - padding`，负的 padding 往外扩）。
 * 原作经 `ROOM_ATTACH` 在 `I.MOVEABLE` 里画——**在所有 UIBox 与卡之前**，所以深度紧贴背景之上。
 */
import type { GameObjects, Scene } from 'phaser';

import type { Colour } from '../ui/colours';
import { TILE_H, TILE_W, toPx } from './coords';

export type ParticlesConfig = {
    timer?: number;
    scale?: number;
    initialize?: boolean;
    lifespan?: number;
    speed?: number;
    padding?: number;
    colours: Colour[];
    fill?: boolean;
    max?: number;
    vel_variation?: number;
    /** `pulse_max`：不管 `max`，先连着出这么多颗（最多 20），`attention_text` 盖色块时的那一阵碎屑 */
    pulse_max?: number;
    /**
     * `attach`：跟着哪个东西走（`bond = 'Strong'`，以它的中心为原点）。返回它当前的矩形（tile）。
     * 不给就是挂 `G.ROOM_ATTACH`（开包的全屏粒子）
     */
    attach?: () => { x: number; y: number; w: number; h: number };
    /** 画在哪一层。缺省 −1（紧贴背景之上） */
    depth?: number;
};

type Particle = {
    dir: number;
    facing: number;
    age: number;
    velocity: number;
    r_vel: number;
    scale: number;
    colour: Colour;
    offset: { x: number; y: number };
};

const rgb = (c: Colour) => (Math.round(c[0] * 255) << 16) | (Math.round(c[1] * 255) << 8) | Math.round(c[2] * 255);

export class Particles {
    private readonly g: GameObjects.Graphics;
    private readonly particles: Particle[] = [];
    private readonly timer: number;
    private readonly lifespan: number;
    private readonly speed: number;
    private readonly scale: number;
    /** `max`：`start_materialize` 在半程把它置 0，不再出新的 */
    max: number;
    private readonly velVariation: number;
    private readonly pulseMax: number;
    private pulsed = 0;
    private readonly fill: boolean;
    private readonly w: number;
    private readonly h: number;
    private readonly attach?: () => { x: number; y: number; w: number; h: number };
    private readonly colours: Colour[];
    /** `G.TIMERS.REAL` 的对应物：场景时间（秒） */
    private now: number;
    private lastRealTime: number;
    /** `fade_alpha`：1 = 全透明。`fade(delay, to)` 线性缓动过去 */
    private fadeAlpha = 0;
    private fadeFrom = 0;
    private fadeTo = 0;
    private fadeT0 = 0;
    private fadeDur = 0;
    private removeAt = Infinity;
    private readonly onUpdate = (time: number, delta: number) => this.tick(time / 1000, delta / 1000);

    constructor(private readonly scene: Scene, config: ParticlesConfig) {
        this.timer = config.timer ?? 0.5;
        this.lifespan = config.lifespan ?? 1;
        this.speed = config.speed ?? 1;
        this.scale = config.scale ?? 1;
        this.max = config.max ?? 1e15;
        this.velVariation = config.vel_variation ?? 1;
        this.pulseMax = Math.min(20, config.pulse_max ?? 0);
        this.fill = !!config.fill;
        this.colours = config.colours;
        const padding = config.padding ?? 0;
        this.attach = config.attach;
        const major = config.attach?.() ?? { x: 0, y: 0, w: TILE_W, h: TILE_H };
        this.w = this.fill ? major.w - padding : 0;
        this.h = this.fill ? major.h - padding : 0;
        this.now = scene.time.now / 1000;
        this.lastRealTime = this.now - this.timer;
        this.g = scene.add.graphics().setDepth(config.depth ?? -1);

        // `initialize`：先空跑 60 步、每步 1/4 秒，开包那一刻屏幕上就已经铺满
        if (config.initialize) {
            for (let i = 0; i < 60; i++) {
                this.lastRealTime -= 15 / 60;
                this.update();
                this.move(15 / 60);
            }
        }
        scene.events.on('update', this.onUpdate);
    }

    /** `Particles:fade(delay, to)`：`fade_alpha` 在 `delay` 秒里缓动到 `to`（默认 1 = 淡出） */
    fade(delay: number, to = 1): void {
        this.fadeFrom = this.fadeAlpha;
        this.fadeTo = to;
        this.fadeT0 = this.now;
        this.fadeDur = delay;
    }

    /** 建好就淡入（`fade_alpha = 1` 再 `fade(1, 0)`），各个开包分支都这么写 */
    fadeIn(): this {
        this.fadeAlpha = 1;
        this.fade(1, 0);
        return this;
    }

    /** `end_consumeable`：淡出 `delay` 秒，1 秒后移除 */
    fadeOutAndRemove(delay = 1): void {
        this.fade(delay, 1);
        this.removeAt = this.now + 1;
    }

    private update(): void {
        let added = 0;
        while (this.now > this.lastRealTime + this.timer && (this.particles.length < this.max || this.pulsed < this.pulseMax) && added < 20) {
            this.lastRealTime += this.timer;
            if (this.pulsed <= this.pulseMax) this.pulsed++;
            this.particles.push({
                dir: Math.random() * 2 * Math.PI,
                facing: Math.random() * 2 * Math.PI,
                age: 0,
                velocity: this.speed * (this.velVariation * Math.random() + (1 - this.velVariation)) * 0.7,
                r_vel: 0.2 * (0.5 - Math.random()),
                scale: 0,
                colour: this.colours[Math.floor(Math.random() * this.colours.length)]!,
                offset: { x: this.fill ? (0.5 - Math.random()) * this.w : 0, y: this.fill ? (0.5 - Math.random()) * this.h : 0 },
            });
            added++;
        }
    }

    private move(dt: number): void {
        const S = this.scale;
        const L = this.lifespan;
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i]!;
            p.age += dt;
            p.scale = Math.min(2 * Math.min((p.age / L) * S, S * ((L - p.age) / L)), S);
            if (p.scale < 0) {
                this.particles.splice(i, 1);
                continue;
            }
            p.offset.x += p.velocity * Math.sin(p.dir) * dt;
            p.offset.y += p.velocity * Math.cos(p.dir) * dt;
            p.facing += p.r_vel * dt;
            p.velocity = Math.max(0, p.velocity - p.velocity * 0.07 * dt);
        }
    }

    private tick(now: number, dt: number): void {
        this.now = now;
        if (this.fadeDur > 0) {
            const k = Math.min(1, (now - this.fadeT0) / this.fadeDur);
            this.fadeAlpha = this.fadeFrom + (this.fadeTo - this.fadeFrom) * k;
        }
        if (now >= this.removeAt) {
            this.destroy();
            return;
        }
        this.update();
        this.move(dt);
        this.draw();
    }

    /** 每颗是一个绕自己中心转的实心方块，边长 = 当前 `scale`（tile） */
    private draw(): void {
        const g = this.g.clear();
        const major = this.attach?.();
        const cx = major ? major.x + major.w / 2 : TILE_W / 2;
        const cy = major ? major.y + major.h / 2 : TILE_H / 2;
        for (const p of this.particles) {
            const a = p.colour[3] * (1 - this.fadeAlpha);
            if (a <= 0 || p.scale <= 0) continue;
            const half = p.scale / 2;
            const c = Math.cos(p.facing);
            const s = Math.sin(p.facing);
            const x = cx + p.offset.x;
            const y = cy + p.offset.y;
            const corner = (dx: number, dy: number) => ({ x: toPx(x + dx * c - dy * s), y: toPx(y + dx * s + dy * c) });
            g.fillStyle(rgb(p.colour), a);
            g.fillPoints([corner(-half, -half), corner(half, -half), corner(half, half), corner(-half, half)] as never, true);
        }
    }

    destroy(): void {
        this.scene.events.off('update', this.onUpdate);
        this.g.destroy();
    }
}
