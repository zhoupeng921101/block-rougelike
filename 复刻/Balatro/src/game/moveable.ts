/**
 * `engine/moveable.lua` 的 Major 那一支（22 号票）：卡牌的可见变换 `VT` 怎么追目标变换 `T`。不 import Phaser。
 *
 * 原作每帧（`game.lua:2872`）按真实帧间隔算三个衰减系数，再以 `move_dt = min(1/20, real_dt)` 推进：
 * - `move_xy`：带速度的弹簧，速度上限 `70·move_dt`，离目标 0.01 以内且速度够小就吸附
 * - `move_r`：目标转角额外加 `0.015·vel.x/dt`——**卡在横向移动时朝运动方向歪**，`juice` 的转角加两倍
 * - `move_scale`：目标 = `T.scale` + 悬停 0.05（`zoom`）+ `juice.scale`
 * - `move_juice` / `juice_up`：「弹一下」——`VT.scale` 先砸到 `1 − 0.6·amount`，再按衰减正弦回弹 0.4 秒
 *
 * 顺序照 `Moveable:move`：juice → xy → r → scale。
 */

export type Transform = { x: number; y: number; r: number; scale: number };

type Juice = { scale: number; scaleAmt: number; r: number; rAmt: number; start: number; end: number };

export class Motion {
    readonly T: Transform;
    readonly VT: Transform;
    readonly velocity = { x: 0, y: 0, r: 0, scale: 0 };
    private juice: Juice | null = null;
    /** `states.hover.is`（`zoom` 的卡悬停时大 0.05） */
    hovered = false;
    /**
     * `pinch.x`（`moveable.lua:435`）：置位后 `VT.w` 每帧减 `8·dt·T.w`，直到 0——被吃掉的小丑（Gros Michel、Popcorn……）横向捏扁。
     * 复刻件的宽度不进 `Transform`，这里只记 `VT.w / T.w`，画的时候乘到横向缩放上
     */
    pinchX = false;
    wScale = 1;

    constructor(t: Transform) {
        this.T = { ...t };
        this.VT = { ...t };
    }

    /** `hard_set_T`：目标与可见一起落定，速度清零 */
    hardSet(t: Partial<Transform>): void {
        Object.assign(this.T, t);
        Object.assign(this.VT, t);
        this.velocity.x = this.velocity.y = this.velocity.r = this.velocity.scale = 0;
    }

    /**
     * `Moveable:juice_up(amount, rot_amt)`。`rot_amt` 缺省时原作用无种子的 `pseudorandom_element({0.6a, -0.6a})`，
     * 走全局 `math.random`，不碰 RNG 流
     */
    juiceUp(now: number, amount = 0.4, rotAmt?: number): void {
        this.juice = {
            scale: 0,
            scaleAmt: amount,
            r: 0,
            rAmt: rotAmt ?? (Math.random() < 0.5 ? 0.6 * amount : -0.6 * amount),
            start: now,
            end: now + 0.4,
        };
        this.VT.scale = 1 - 0.6 * amount;
    }

    /**
     * `Card:juice_up(scale, rot_amount)`（`card.lua:4340`）：卡牌版先换算再交给 `Moveable.juice_up`——
     * 幅度 ×0.4（缺省 0.11），转角 `0.4·rot` 随机正负（缺省 ±0.16）。随机走 `math.random`，不碰 RNG 流
     */
    cardJuiceUp(now: number, scale?: number, rotAmount?: number): void {
        const sign = Math.random() > 0.5 ? 1 : -1;
        const rot = rotAmount !== undefined ? 0.4 * sign * rotAmount : sign * 0.16;
        this.juiceUp(now, scale !== undefined ? scale * 0.4 : 0.11, rot);
    }

    /** 推进一帧。`realDt` 是真实帧间隔（秒），`now` 是 `G.TIMERS.REAL` */
    step(realDt: number, now: number): void {
        if (realDt <= 0) return;
        const exy = Math.exp(-50 * realDt);
        const escale = Math.exp(-60 * realDt);
        const er = Math.exp(-190 * realDt);
        const dt = Math.min(1 / 20, realDt);
        const maxVel = 70 * dt;
        const { T, VT, velocity: v } = this;

        // move_juice
        const j = this.juice;
        if (j) {
            if (j.end < now) this.juice = null;
            else {
                const left = Math.max(0, (j.end - now) / (j.end - j.start));
                j.scale = j.scaleAmt * Math.sin(50.8 * (now - j.start)) * left ** 3;
                j.r = j.rAmt * Math.sin(40.8 * (now - j.start)) * left ** 2;
            }
        }

        // move_xy
        if (T.x !== VT.x || Math.abs(v.x) > 0.01 || T.y !== VT.y || Math.abs(v.y) > 0.01) {
            v.x = exy * v.x + (1 - exy) * (T.x - VT.x) * 35 * dt;
            v.y = exy * v.y + (1 - exy) * (T.y - VT.y) * 35 * dt;
            const sq = v.x * v.x + v.y * v.y;
            if (sq > maxVel * maxVel) {
                const actual = Math.sqrt(sq);
                v.x = (maxVel * v.x) / actual;
                v.y = (maxVel * v.y) / actual;
            }
            VT.x += v.x;
            VT.y += v.y;
            if (Math.abs(VT.x - T.x) < 0.01 && Math.abs(v.x) < 0.01) { VT.x = T.x; v.x = 0; }
            if (Math.abs(VT.y - T.y) < 0.01 && Math.abs(v.y) < 0.01) { VT.y = T.y; v.y = 0; }
        }

        // move_r
        const desR = T.r + (0.015 * v.x) / dt + (this.juice ? this.juice.r * 2 : 0);
        if (desR !== VT.r || Math.abs(v.r) > 0.001) {
            v.r = er * v.r + (1 - er) * (desR - VT.r);
            VT.r += v.r;
        }
        if (Math.abs(VT.r - T.r) < 0.001 && Math.abs(v.r) < 0.001) { VT.r = T.r; v.r = 0; }

        // `moveable.lua:440`：pinch 放在 move 之后
        if (this.pinchX && this.wScale > 0) this.wScale = Math.max(0, this.wScale - 8 * dt);

        // move_scale
        const desScale = T.scale + (this.hovered ? 0.05 : 0) + (this.juice ? this.juice.scale : 0);
        if (desScale !== VT.scale || Math.abs(v.scale) > 0.001) {
            v.scale = escale * v.scale + (1 - escale) * (desScale - VT.scale);
            VT.scale += v.scale;
        }
    }
}
