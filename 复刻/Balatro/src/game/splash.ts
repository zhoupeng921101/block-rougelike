/**
 * 开机 splash（22 号票第四十八步）：`Game:splash_screen`（`game.lua:1451`）。
 *
 * 事件时间线（`G.TIMERS.REAL` 从 0 起，括号里是原作的事件形状）：
 * - 0：蓝白旋涡（`splash`，`vort_speed = 1`，`vort_offset` 按 `os.time()`）铺底，`flash` 白盖在最上面
 * - 0.2（after，阻塞）：房间正中一张 1.2 倍的 Joker（`j_joker`），`whoosh1` + `introPad1`
 * - 2.0（再 after 1.8，阻塞）：它 `start_dissolve({WHITE, WHITE}, silent, 12, no_juice)`——8.4 秒慢慢化白；`magic_crumple` + `splash_buildup`
 * - 3 起（非阻塞，200 个，间隔 `max(1/i, 0.2·(170−i)/500, 0.016)`，最后一个在 11.9 秒）：在半径 `18 + 尺寸` 的圆上随机一个角造一张随机的牌
 *   （两成背面），`T.r` = 那个角，`T.scale` 在 `speed` 秒里缓到 0、位置在 `0.9·speed` 秒里缓到正中，走 `vortex` 顶点 shader 被拧着吸进去；
 *   **两个都是线性**：`ease_value` 把 `'elastic'` 塞进事件的 `type` 字段，而 `Event:init` 读的是 `config.ease`（`event.lua:26`），缓动类型永远是 `lerp`。
 *   照 elastic 算的话 `T.scale` 在 7.5% 处就过零、牌一出生就被拆，实机截图上满屏飞的牌说明原作确实是线性；
 *   `T.scale ≤ 0` 那一帧拆掉，前 30 张各一声 `whoosh1`（音高随序号升），第 15 张再一声 `whoosh_long`
 * - 最后一张造出来之后再 2 秒（after 2，阻塞——那 200 个事件本身 `blocking` 缺省为真，所以它排在它们后面）：`main_menu('splash')`
 *
 * 期间点一下（`queue_L_cursor_press` → `escape`）：`delete_run` 后直接 `main_menu()`。
 * 这段没有音乐（`modulate_sound` 的 `desired_track` 在 SPLASH 时是 `''`）。
 */
import type { GameObjects, Scene } from 'phaser';

import { CENTERS_ATLAS, DECK_ATLAS, frameIndex } from '../core/atlas';
import { C } from '../ui/colours';
import { playExit } from './card-exit';
import { CARD_H, CARD_W, TILE_H, TILE_W, toPx } from './coords';
import { MiniCard } from './mini-card';
import { Motion } from './moveable';
import { cardsTexture } from './settings';
import { BACKGROUND_VERT } from './shaders/background';
import { SPLASH_FRAG } from './shaders/splash';
import { FLASH_FRAG, VORTEX_FRAG, VORTEX_VERT } from './shaders/vortex';

/** 200 张牌各自的造出时刻（`temp_del`） */
export function splashSpawnTimes(): number[] {
    const out: number[] = [];
    let t = 3;
    for (let i = 1; i <= 200; i++) {
        out.push(t);
        t += Math.max(1 / i, Math.max((0.2 * (170 - i)) / 500, 0.016));
    }
    return out;
}

const SUITS = ['H', 'C', 'D', 'S'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUIT_ROW: Record<string, number> = { H: 0, C: 1, D: 2, S: 3 };

/** 被吸进旋涡的一张牌：底板（或背面）+ 牌面，都走 `vortex` 顶点 shader，没有阴影（`no_shadow`） */
class VortexCard {
    readonly motion: Motion;
    private readonly quads: GameObjects.Shader[] = [];
    private ease: { t0: number; dur: number; x0: number; y0: number; x1: number; y1: number; sdur: number } | null = null;

    constructor(scene: Scene, readonly w: number, readonly h: number, x: number, y: number, r: number, back: boolean, vortexAmt: () => number, depth: number) {
        this.motion = new Motion({ x, y, r, scale: 0.95 });
        const layers: Array<{ key: string; frame: number }> = back
            // 背面：`G.GAME.selected_back`，红牌组（Enhancers {0,0}）
            ? [{ key: 'centers', frame: frameIndex(CENTERS_ATLAS, { x: 0, y: 0 }) }]
            : (() => {
                // `pseudorandom_element(G.P_CARDS)`：52 张里随便一张（splash 时还没有局，这里用全局随机）
                const suit = SUITS[Math.floor(Math.random() * 4)]!;
                const rank = RANKS[Math.floor(Math.random() * 13)]!;
                return [
                    { key: 'centers', frame: frameIndex(CENTERS_ATLAS, { x: 1, y: 0 }) },
                    { key: cardsTexture(), frame: frameIndex(DECK_ATLAS, { x: RANKS.indexOf(rank), y: SUIT_ROW[suit]! }) },
                ];
            })();
        layers.forEach(({ key, frame }, i) => {
            const q = scene.add.shader({
                name: `vortex_${Math.random().toString(36).slice(2, 8)}`,
                fragmentSource: VORTEX_FRAG,
                vertexSource: VORTEX_VERT,
                setupUniforms: (setUniform: (n: string, v: unknown) => void) => {
                    setUniform('uMainSampler', 0);
                    setUniform('vortex_amt', vortexAmt());
                    setUniform('uScreenSize', [scene.scale.width, scene.scale.height]);
                },
            }, 0, 0, toPx(w), toPx(h), [key]);
            q.setTextureCoordinatesFromFrame(String(frame), key);
            q.setDepth(depth + i * 0.001);
            this.quads.push(q);
        });
    }

    /** `ease_value(T, 'scale', −scale, …, speed, 'elastic')`（实际是线性，见文件头）与 x / y 在 `0.9·speed` 里线性缓到正中 */
    startEase(now: number, speed: number, dx: number, dy: number): void {
        const T = this.motion.T;
        this.ease = { t0: now, dur: 0.9 * speed, x0: T.x, y0: T.y, x1: T.x + dx, y1: T.y + dy, sdur: speed };
    }

    step(now: number, dt: number): void {
        const e = this.ease;
        const T = this.motion.T;
        if (e) {
            const px = Math.max(0, 1 - (now - e.t0) / e.dur);
            T.x = px * e.x0 + (1 - px) * e.x1;
            T.y = px * e.y0 + (1 - px) * e.y1;
            T.scale = 0.95 * Math.max(0, 1 - (now - e.t0) / e.sdur);
        }
        this.motion.step(dt, now);
        const { VT } = this.motion;
        for (const q of this.quads) {
            q.setPosition(toPx(VT.x + this.w / 2), toPx(VT.y + this.h / 2)).setRotation(VT.r).setScale(Math.max(0, VT.scale));
        }
    }

    destroy(): void {
        for (const q of this.quads) q.destroy();
    }
}

export class Splash {
    /** 旋涡底与白闪，场景贴屏摆 */
    readonly back: GameObjects.Shader;
    readonly front: GameObjects.Shader;
    private readonly t0: number;
    private readonly spawnTimes = splashSpawnTimes();
    private spawned = 0;
    private cards: Array<{ card: VortexCard; i: number }> = [];
    private sc: MiniCard | null = null;
    private readonly scDissolve = { amount: 0, colours: [C.WHITE, C.WHITE] as ReadonlyArray<readonly number[]> };
    private readonly fired = new Set<string>();
    private lastNow: number;
    done = false;

    constructor(
        private readonly scene: Scene,
        /** 走完（或被点掉）：`'splash'` 带着当前的 `REAL` 进主菜单，`null` 是点掉了 */
        private readonly onDone: (context: 'splash' | null, real: number) => void,
    ) {
        this.t0 = scene.time.now / 1000;
        this.lastNow = this.t0;
        const vortOffset = (2 * 90.15315131 * Math.floor(Date.now() / 1000)) % 100000;
        this.back = scene.add.shader({
            name: 'splash_back',
            fragmentSource: SPLASH_FRAG,
            vertexSource: BACKGROUND_VERT,
            setupUniforms: (setUniform: (n: string, v: unknown) => void) => {
                setUniform('time', this.real());
                setUniform('vort_speed', 1);
                setUniform('colour_1', C.BLUE);
                setUniform('colour_2', C.WHITE);
                setUniform('mid_flash', 0);
                setUniform('vort_offset', vortOffset);
                setUniform('uScreenSize', [scene.scale.width, scene.scale.height]);
            },
        }, 0, 0, 1, 1, []);
        this.back.setDepth(-1000);
        this.front = scene.add.shader({
            name: 'splash_front',
            fragmentSource: FLASH_FRAG,
            vertexSource: BACKGROUND_VERT,
            setupUniforms: (setUniform: (n: string, v: unknown) => void) => {
                setUniform('time', this.real());
                setUniform('mid_flash', 1);
                setUniform('uScreenSize', [scene.scale.width, scene.scale.height]);
            },
        }, 0, 0, 1, 1, []);
        this.front.setDepth(450);
    }

    /** `G.TIMERS.REAL`（splash 开始时清零） */
    real(): number {
        return this.scene.time.now / 1000 - this.t0;
    }

    private at(key: string, t: number, fn: () => void): void {
        if (this.real() >= t && !this.fired.has(key)) {
            this.fired.add(key);
            fn();
        }
    }

    /** 点一下跳过（`escape` → `main_menu()`） */
    skip(): void {
        if (this.done) return;
        this.finish(null);
    }

    update(now: number): void {
        if (this.done) return;
        const dt = Math.max(0, now - this.lastNow);
        this.lastNow = now;
        const t = this.real();
        const sound = this.scene.sound;

        this.at('sc', 0.2, () => {
            const s = 1.2;
            this.sc = new MiniCard(this.scene, 'j_joker', s * CARD_W, s * CARD_H, 10, { dissolve: this.scDissolve });
            this.sc.place(TILE_W / 2 - (s * CARD_W) / 2, TILE_H / 2 - (s * CARD_H) / 2, 0, 0.95);
            sound.play('whoosh1', { rate: 0.7, volume: 0.2 });
            sound.play('introPad1', { rate: 0.704, volume: 0.6 });
        });
        this.at('sc_dissolve', 2.0, () => {
            const sc = this.sc;
            if (!sc) return;
            playExit(this.scene, {
                dissolve: this.scDissolve,
                get rect() { return sc.rect; },
                topDepth: 11,
                juiceUp: (a, r) => sc.juiceUp(a, r),
                pinch: () => undefined,
                setTargetR: () => undefined,
                disableInput: () => undefined,
                destroy: () => sc.destroy(),
            }, { kind: 'dissolve', colours: [C.WHITE, C.WHITE], silent: true, timeFac: 12, noJuice: true }, () => { if (this.sc === sc) this.sc = null; });
            sound.play('magic_crumple', { rate: 1, volume: 0.5 });
            sound.play('splash_buildup', { rate: 1, volume: 0.7 });
        });

        while (this.spawned < this.spawnTimes.length && t >= this.spawnTimes[this.spawned]!) {
            this.spawnCard(this.spawned + 1, now);
            this.spawned++;
        }

        this.cards = this.cards.filter(({ card, i }) => {
            card.step(now, dt);
            if (card.motion.T.scale > 0) return true;
            // `T.scale ≤ 0`：拆掉，前 30 张出声
            if (i < 30) sound.play('whoosh1', { rate: i * 0.007 + 0.6 + Math.random() * 0.05, volume: 0.25 * (1 - i / 50) });
            if (i === 15) sound.play('whoosh_long', { rate: 0.9, volume: 0.7 });
            card.destroy();
            return false;
        });

        if (this.spawned === this.spawnTimes.length) this.at('menu', this.spawnTimes[this.spawnTimes.length - 1]! + 2, () => this.finish('splash'));
    }

    /** `make_splash_card`：尺寸 `scale·(rand + 1)`，`scale = 2 − i/300`；速度 `max(2 − 0.005·i, 0.001)` */
    private spawnCard(i: number, now: number): void {
        const angle = Math.random() * 2 * 3.14;
        const size = (2 - i / 300) * (Math.random() + 1);
        const pos = { x: (18 + size) * Math.sin(angle), y: (18 + size) * Math.cos(angle) };
        const w = size * CARD_W;
        const h = size * CARD_H;
        const back = Math.random() > 0.8;
        const card = new VortexCard(this.scene, w, h, pos.x + TILE_W / 2 - w / 2, pos.y + TILE_H / 2 - h / 2, angle, back, () => this.real(), 20 + i * 0.01);
        const speed = Math.max(2 - i * 0.005, 0.001);
        card.startEase(now, speed, -pos.x, -pos.y);
        this.cards.push({ card, i });
    }

    private finish(context: 'splash' | null): void {
        this.done = true;
        const real = this.real();
        for (const { card } of this.cards) card.destroy();
        this.cards = [];
        this.sc?.destroy();
        this.sc = null;
        this.back.destroy();
        this.front.destroy();
        this.onDone(context, real);
    }
}
