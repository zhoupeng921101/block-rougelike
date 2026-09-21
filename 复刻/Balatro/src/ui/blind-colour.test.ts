/** `ease_background_colour_blind` 的背景那一半（`common_events.lua:313`） */
import { describe, expect, it } from 'vitest';

import { backgroundFor } from './blind-colour';
import { C, HEX } from './colours';

const scale = (c: number[], k: number) => c.slice(0, 3).map((v) => v * k);

describe('backgroundFor', () => {
    it('小盲注 / 大盲注 / 商店：G.C.BLIND.Small 按 L×1.3、C×0.9、D×0.7 派生', () => {
        for (const key of [null, 'bl_small', 'bl_big']) {
            const b = backgroundFor(null, key);
            expect(b.L.slice(0, 3)).toEqual(scale(C.BLIND.Small, 1.3));
            expect(b.C.slice(0, 3)).toEqual(scale(C.BLIND.Small, 0.9));
            expect(b.D.slice(0, 3)).toEqual(scale(C.BLIND.Small, 0.7));
            expect(b.contrast).toBe(1);
        }
    });

    it('普通 Boss：C 是 boss_colour 本身，对比度 2', () => {
        const b = backgroundFor(null, 'bl_head');
        expect(b.C.slice(0, 3)).toEqual(HEX('ac9db4').slice(0, 3));
        expect(b.contrast).toBe(2);
    });

    it('终局 Boss：蓝 / 红 / 深黑三色直接取，对比度 3', () => {
        const b = backgroundFor(null, 'bl_final_bell');
        expect(b.L.slice(0, 3)).toEqual(C.BLUE.slice(0, 3));
        expect(b.C.slice(0, 3)).toEqual(C.RED.slice(0, 3));
        expect(b.contrast).toBe(3);
    });

    it('开包优先于盲注：小丑包是 FILTER 橙配黑，D 取 0.4', () => {
        const b = backgroundFor('Buffoon', 'bl_head');
        expect(b.L.slice(0, 3)).toEqual(scale(C.FILTER, 1.3));
        expect(b.C.slice(0, 3)).toEqual(C.BLACK.slice(0, 3));
        expect(b.D.slice(0, 3)).toEqual(scale(C.FILTER, 0.4));
        expect(b.contrast).toBe(2);
    });
});
