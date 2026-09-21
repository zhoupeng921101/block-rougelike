/** `engine/moveable.lua` 的 Major 缓动（22 号票） */
import { describe, expect, it } from 'vitest';

import { Motion } from './moveable';

const run = (m: Motion, frames: number, dt = 1 / 60) => {
    for (let i = 0; i < frames; i++) m.step(dt, i * dt);
};

describe('Motion', () => {
    it('VT 追到 T 后吸附，速度清零', () => {
        const m = new Motion({ x: 0, y: 0, r: 0, scale: 1 });
        m.T.x = 5;
        m.T.y = -2;
        run(m, 120);
        expect([m.VT.x, m.VT.y, m.velocity.x, m.velocity.y]).toEqual([5, -2, 0, 0]);
        expect(m.VT.r).toBe(0);
    });

    it('每帧位移不超过 70·move_dt（move_dt 封顶 1/20）', () => {
        const m = new Motion({ x: 0, y: 0, r: 0, scale: 1 });
        m.T.x = 1000;
        let prev = 0;
        for (let i = 0; i < 30; i++) {
            m.step(1 / 60, i / 60);
            expect(m.VT.x - prev).toBeLessThanOrEqual(70 / 60 + 1e-9);
            prev = m.VT.x;
        }
        const slow = new Motion({ x: 0, y: 0, r: 0, scale: 1 });
        slow.T.x = 1000;
        slow.step(0.5, 0);
        expect(slow.VT.x).toBeLessThanOrEqual(70 / 20 + 1e-9);
    });

    it('往右移时朝右歪（VT.r 为正），停下后回正', () => {
        const m = new Motion({ x: 0, y: 0, r: 0, scale: 1 });
        m.T.x = 3;
        run(m, 3);
        expect(m.VT.r).toBeGreaterThan(0);
        run(m, 200);
        expect(m.VT.r).toBe(0);
    });

    it('juice_up：VT.scale 先砸到 1 − 0.6·amount，0.4 秒后回到 T.scale', () => {
        const m = new Motion({ x: 0, y: 0, r: 0, scale: 0.95 });
        m.juiceUp(0, 0.5, 0.3);
        expect(m.VT.scale).toBeCloseTo(0.7, 12);
        for (let i = 1; i <= 90; i++) m.step(1 / 60, i / 60);
        expect(m.VT.scale).toBeCloseTo(0.95, 3);
        expect(m.VT.r).toBe(0);
    });
});
