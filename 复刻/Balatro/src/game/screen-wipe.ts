/**
 * 转场（22 号票第四十九步）：`G.FUNCS.wipe_on` / `wipe_off`（`button_callbacks.lua:3172` / `:3240`）。
 *
 * 原作画的东西只有两样（`screenwipe.colours` 的黑与白两色会被缓动，但没有任何地方画它们）：
 * - 一颗粒子：`Particles{max = 1, scale = 40, speed = 0, lifespan = 1.7, colours = {G.C.BACKGROUND.C}}` 挂在转场盒中心——
 *   一个 40 格见方的方块，随机朝向、慢慢转（`r_vel = 0.2·(0.5 − rand)`），边长 `min(2·min(age/1.7·40, 40·(1.7−age)/1.7), 40)`：
 *   0.85 秒长到 40 格盖满屏幕，再用 0.85 秒缩没。颜色表里放的是 `G.C.BACKGROUND.C` 这张表本身，所以方块的颜色跟着背景实时变
 * - 正中一张随机的牌（`Card(…, pseudorandom_element(G.P_CARDS), c_base)`）：背面朝上，`juice_up(0.5, 1)`，
 *   然后 `trigger = 'before', delay = 0.7` 的事件**第一次处理就执行**——立刻 `flip()` 翻到正面、`cardFan2`；
 *   这个事件 `blocking` 而 `blockable = false`，要挂满 0.7 秒才离开队列，所以后面的 `delete_run` / `start_run` / `main_menu` 被它挡到 0.7 秒
 *
 * `wipe_off`：换完场景之后 `particles.max = 0`（不再补新的，场上那颗走完寿命），0.55 秒后牌 `start_dissolve`
 * （黑 / 橙 / 金 / 红烧边），1.1 秒后拆掉整个转场。
 *
 * 复刻件换局是整页重载：前一页放 `wipe_on`，到 0.7 秒那一刻跳转（URL 带上 `wipe=<那张牌>`），
 * 新的一页一起来就接着放 `wipe_off`——方块从 0.7 秒的年龄接着长到顶再缩，牌是同一张、已经翻到正面。
 */
import type { GameObjects, Scene } from 'phaser';

import type { Colour } from '../ui/colours';
import { C } from '../ui/colours';
import { playExit } from './card-exit';
import { CARD_H, CARD_W, TILE_H, TILE_W, toPx } from './coords';
import { MiniCard } from './mini-card';

const LIFESPAN = 1.7;
const SUITS = ['H', 'C', 'D', 'S'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

/** `pseudorandom_element(G.P_CARDS)`：换场景时没有局的随机流可用，走全局随机 */
export function randomCardKey(): string {
    return `${SUITS[Math.floor(Math.random() * 4)]}_${RANKS[Math.floor(Math.random() * 13)]}`;
}

/** 那颗粒子的边长（格）：`particles.lua:108` 的 `min(2·min(age/L·S, S·(L−age)/L), S)` */
export function wipeSquareSize(age: number, lifespan = LIFESPAN, scale = 40): number {
    return Math.min(2 * Math.min((age / lifespan) * scale, (scale * (lifespan - age)) / lifespan), scale);
}

/** 场景切换那一刻（`before` 事件挂满 0.7 秒） */
export const WIPE_SWITCH_AT = 0.7;
const DEPTH = 460;

export class ScreenWipe {
    private readonly g: GameObjects.Graphics;
    private readonly card: MiniCard;
    private readonly cardDissolve = { amount: 0, colours: [] as ReadonlyArray<readonly number[]> };
    private readonly t0: number;
    /** 当前那颗方块：出生时刻、朝向、转速 */
    private square: { born: number; facing: number; rVel: number } | null;
    /** `particles.max`：`wipe_off` 置 0 之后不再补新的 */
    private respawn: boolean;
    private switched = false;
    private dissolving = false;
    done = false;

    private readonly onUpdate = (time: number) => this.update(time / 1000);

    constructor(
        private readonly scene: Scene,
        private readonly phase: 'on' | 'off',
        readonly cardKey: string,
        /** `G.C.BACKGROUND.C`，每帧读 */
        private readonly colour: () => Colour,
        /** `wipe_on` 到 0.7 秒：换场景（复刻件是整页跳转） */
        private readonly onSwitch: () => void = () => undefined,
    ) {
        const now = scene.time.now / 1000;
        this.t0 = now;
        this.g = scene.add.graphics().setDepth(DEPTH);
        // `off` 页接着前一页的那颗：年龄从 0.7 起
        this.square = { born: phase === 'on' ? now : now - WIPE_SWITCH_AT, facing: Math.random() * 2 * Math.PI, rVel: 0.2 * (0.5 - Math.random()) };
        this.respawn = phase === 'on';
        this.card = new MiniCard(scene, cardKey, CARD_W, CARD_H, DEPTH + 1, { facing: phase === 'on' ? 'back' : 'front', dissolve: this.cardDissolve });
        // 转场盒 `cm` 挂房间：牌在房间正中
        this.card.place(TILE_W / 2 - CARD_W / 2, TILE_H / 2 - CARD_H / 2, 0, 0.95);
        if (phase === 'on') {
            // `juice_up(0.5, 1)`；`before` 事件第一次处理就翻面、`cardFan2`
            scene.time.delayedCall(0, () => {
                this.card.juiceUp(0.5, 1);
                this.card.flip();
                scene.sound.play('cardFan2', { volume: 1 });
            });
        }
        scene.events.on('update', this.onUpdate);
    }

    private update(now: number): void {
        const age = now - this.t0;
        const sq = this.square;
        this.g.clear();
        if (sq) {
            const a = now - sq.born;
            const size = wipeSquareSize(a);
            if (size < 0) this.square = this.respawn ? { born: now, facing: Math.random() * 2 * Math.PI, rVel: 0.2 * (0.5 - Math.random()) } : null;
            else {
                const facing = sq.facing + sq.rVel * a;
                const c = this.colour();
                const cx = toPx(TILE_W / 2);
                const cy = toPx(TILE_H / 2);
                const h = toPx(size) / 2;
                const cos = Math.cos(facing);
                const sin = Math.sin(facing);
                const pts = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([x, y]) => ({ x: cx + x! * cos - y! * sin, y: cy + x! * sin + y! * cos }));
                this.g.fillStyle((Math.round(c[0] * 255) << 16) | (Math.round(c[1] * 255) << 8) | Math.round(c[2] * 255), c[3]);
                this.g.beginPath();
                pts.forEach((p, i) => (i ? this.g.lineTo(p.x, p.y) : this.g.moveTo(p.x, p.y)));
                this.g.closePath();
                this.g.fillPath();
            }
        }
        if (this.phase === 'on') {
            if (!this.switched && age >= WIPE_SWITCH_AT) {
                this.switched = true;
                this.onSwitch();
            }
            return;
        }
        if (!this.dissolving && age >= 0.55) {
            this.dissolving = true;
            const card = this.card;
            playExit(this.scene, {
                dissolve: this.cardDissolve,
                get rect() { return card.rect; },
                topDepth: DEPTH + 2,
                juiceUp: (x, r) => card.juiceUp(x, r),
                pinch: () => undefined,
                setTargetR: () => undefined,
                disableInput: () => undefined,
                destroy: () => card.destroy(),
            }, { kind: 'dissolve', colours: [C.BLACK, C.ORANGE, C.GOLD, C.RED] });
        }
        if (age >= 1.1) this.destroy();
    }

    destroy(): void {
        if (this.done) return;
        this.done = true;
        this.scene.events.off('update', this.onUpdate);
        this.g.destroy();
        this.card.destroy();
    }
}
