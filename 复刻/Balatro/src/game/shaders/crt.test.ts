/**
 * CRT 的 uniform 取值。21 号票在模拟器上与正版并排量出过两处偏差，这里挡回归：
 * - `game.lua:3292` 先把设置值乘 0.3 再喂 shader（漏了就是原作的 3.3 倍强）
 * - 扫描线密度按显示出来的物理像素算（原作画布就是屏幕分辨率），不是按复刻件的画布尺寸
 */
import { describe, expect, it } from 'vitest';

import { crtUniforms } from './crt';

describe('crtUniforms', () => {
    it('移动版设置 30 喂进 shader 的是 9：crt_intensity = 0.16 × 9 / 100', () => {
        const u = crtUniforms(30, 2560, 1440, 0);
        expect(u.crt_intensity).toBeCloseTo(0.0144, 10);
        expect(u.distortion_fac[0]).toBeCloseTo(1 + 0.07 * 0.09, 10);
        expect(u.distortion_fac[1]).toBeCloseTo(1 + 0.1 * 0.09, 10);
    });

    it('扫描线 = 物理像素高 × 0.75：1440p 上周期 2π/0.75 ≈ 8.4 像素，与实机截图量到的 8 一致', () => {
        const u = crtUniforms(30, 2560, 1440, 0);
        expect(u.scanlines).toBe(1080);
        expect((2 * Math.PI * 1440) / u.scanlines).toBeCloseTo(8.38, 2);
    });
});
