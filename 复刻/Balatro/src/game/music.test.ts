import { describe, expect, it } from 'vitest';
import { desiredTrack, organIntensity } from './music';

describe('modulate_sound', () => {
    it('挑音轨：包（含关包后粒子淡出）> 商店 > Boss > 其余', () => {
        const base = { packKind: null, packFading: null, inShop: false, boss: false };
        expect(desiredTrack(base)).toBe('music1');
        expect(desiredTrack({ ...base, boss: true })).toBe('music5');
        expect(desiredTrack({ ...base, inShop: true, boss: true })).toBe('music4');
        expect(desiredTrack({ ...base, inShop: true, packKind: 'Arcana' })).toBe('music2');
        expect(desiredTrack({ ...base, inShop: true, packKind: 'Buffoon' })).toBe('music2');
        expect(desiredTrack({ ...base, inShop: true, packKind: 'Celestial' })).toBe('music3');
        expect(desiredTrack({ ...base, inShop: true, packFading: 'Celestial' })).toBe('music3');
    });

    it('管风琴：0.1·log₅(earned/(required+1))，夹在 [0, 0.4]', () => {
        expect(organIntensity(0, 300)).toBe(0);
        expect(organIntensity(100, 300)).toBe(0);
        expect(organIntensity(301 * 5, 300)).toBeCloseTo(0.1);
        expect(organIntensity(301 * 625, 300)).toBeCloseTo(0.4);
        expect(organIntensity(301 * 1e9, 300)).toBe(0.4);
    });
});
