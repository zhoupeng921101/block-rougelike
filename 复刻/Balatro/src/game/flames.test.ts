import { describe, expect, it } from 'vitest';
import { FlameState, flamesIntensity } from './flames';

describe('flame_handler', () => {
    it('没压过要求就不烧；压过了按 log5(分) − 2 窜起来，再慢慢熄', () => {
        const f = new FlameState(0);
        f.step(1 / 60, 200, 300, false);
        expect(f.intensity).toBe(0);
        expect(f.realIntensity).toBe(0);
        for (let i = 0; i < 120; i++) f.step(1 / 60, 5 ** 5, 300, false);
        expect(f.intensity).toBeCloseTo(3);
        expect(f.realIntensity).toBeGreaterThan(1.5);
        expect(flamesIntensity(f)).toBeGreaterThan(0.15);
        for (let i = 0; i < 600; i++) f.step(1 / 60, 0, 300, false);
        expect(f.realIntensity).toBeLessThan(0.5);
    });

    it('开包 / 塔罗打断时强度为 0', () => {
        const f = new FlameState(0);
        f.step(1 / 60, 1e6, 300, true);
        expect(f.intensity).toBe(0);
    });
});
