/**
 * `love.resize` 的直译（`roomMapping`）。期望值是拿模拟器里的正版截图对过的：
 * 2560×1440 下牌堆（`G.deck`，`common_events.lua:17`）左上角落在 (2180, 1043) 像素附近。
 */
import { describe, expect, it } from 'vitest';

import { CARD_H, CARD_W, TILE_H, TILE_W, roomMapping } from './coords';

describe('roomMapping', () => {
    it('2560×1440（16:9，比 22.6:12.4 窄）：按宽缩，房间上下居中', () => {
        const m = roomMapping(2560, 1440);
        expect(m.pxPerTile).toBeCloseTo(2560 / 22.6, 10);
        expect(m.roomX).toBe(0.8);
        expect(m.roomY).toBeCloseTo((1440 / m.pxPerTile - 11.6) / 2 + 0.2, 10);
    });

    it('牌堆左上角：实机截图量到的位置', () => {
        const m = roomMapping(2560, 1440);
        const deckX = TILE_W - CARD_W - 0.5;
        const deckY = TILE_H - CARD_H;
        expect((m.roomX + deckX) * m.pxPerTile).toBeCloseTo(2180, -1);
        expect((m.roomY + deckY) * m.pxPerTile).toBeCloseTo(1043, -1);
    });

    it('比 22.6:12.4 宽的窗口按高缩，房间左右居中', () => {
        const m = roomMapping(3000, 1000);
        expect(m.pxPerTile).toBeCloseTo(1000 / 12.4, 10);
        expect(m.roomY).toBe(0.4);
        expect(m.roomX).toBeCloseTo((3000 / m.pxPerTile - 21.8) / 2 + 0.4, 10);
    });

    it('比正方形还窄时把高当成宽（原文如此）', () => {
        expect(roomMapping(800, 1200)).toEqual(roomMapping(800, 800));
    });
});
