/**
 * 分数火焰的强度（`G.FUNCS.flame_handler`，`button_callbacks.lua:2110` 起）。不 import Phaser，有单测。
 *
 * - 本手 `筹码 × 倍率` ≥ 盲注要求时目标强度 `max(0, log₅(本手分) − 2)`（开包 / 塔罗打断时 0），否则 0
 * - `real_intensity` 带速度地追目标：`vel ← (1 − e)·(目标 − 当前)·dt·25 + e·vel`（`e = exp(−0.4dt)`，速度为负时先按 `1 − 10dt` 衰减），
 *   所以窜起来有过冲、落下去是慢慢熄
 * - `timer` 走得比真实时间快 `1 + 0.2·强度`（火越大跳得越快），`change` 是「还在往上窜」的平滑量（驱动 `ambientFire3`）
 */
export class FlameState {
    intensity = 0;
    realIntensity = 0;
    private vel = 0;
    timer: number;
    change = 0;

    constructor(now: number) {
        this.timer = now;
    }

    step(dt: number, earned: number, required: number, suppressed: boolean): void {
        const exptime = Math.exp(-0.4 * dt);
        if (earned >= required && required > 0) {
            this.intensity = suppressed ? 0 : Math.max(0, Math.log(earned) / Math.log(5) - 2);
        } else this.intensity = 0;
        this.timer += dt * (1 + this.intensity * 0.2);
        if (this.vel < 0) this.vel *= 1 - 10 * dt;
        this.vel = (1 - exptime) * (this.intensity - this.realIntensity) * dt * 25 + exptime * this.vel;
        this.realIntensity = Math.max(0, this.realIntensity + this.vel);
        this.change = this.change * (1 - 4 * dt) + 4 * dt * (this.realIntensity < this.intensity ? 1 : 0) * this.realIntensity;
    }
}

/** `modulate_sound` 的 `score_intensity.flames`：`min(1, (筹码火的 real_intensity + change)/10)` */
export function flamesIntensity(chip: FlameState): number {
    return Math.min(1, (chip.realIntensity + chip.change) / 10);
}
