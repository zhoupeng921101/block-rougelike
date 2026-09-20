/**
 * 图集坐标的测试。
 *
 * 这是**表现层里唯一能单测的部分**，而它抓的正是表现层里最难靠眼睛发现的一类错：
 * 一个越界的 `pos` 不会报错，只会安静地画出网格里另一张卡的图——
 * 150 张小丑里错一张，得逐张点开才看得出来。
 *
 * `core/atlas.ts` 刻意不 import Phaser，就是为了让这组测试跑得起来。
 */

import { describe, expect, it } from 'vitest';

import {
    BOOSTER_ATLAS,
    CENTERS_ATLAS,
    DECK_ATLAS,
    JOKER_ATLAS,
    TAROT_ATLAS,
    columnsOf,
    frameIndex,
    inBounds,
    rowsOf,
} from './atlas';
import { makeStandardDeck } from './card';
import { BOOSTER_CENTERS } from './boosters';
import { CONSUMABLE_CENTERS } from './consumables';
import { JOKER_CENTERS } from './jokers';

describe('网格尺寸', () => {
    it('8BitDeck 923×380 = 13 列 × 4 行，正好装 52 张', () => {
        expect(columnsOf(DECK_ATLAS)).toBe(13);
        expect(rowsOf(DECK_ATLAS)).toBe(4);
        expect(columnsOf(DECK_ATLAS) * rowsOf(DECK_ATLAS)).toBe(52);
    });

    it('Enhancers 497×475 = 7 列 × 5 行', () => {
        expect(columnsOf(CENTERS_ATLAS)).toBe(7);
        expect(rowsOf(CENTERS_ATLAS)).toBe(5);
    });

    it('Tarots 710×570 = 10 列 × 6 行，三个 set 共用这一张', () => {
        expect(columnsOf(TAROT_ATLAS)).toBe(10);
        expect(rowsOf(TAROT_ATLAS)).toBe(6);
    });

    it('Jokers 710×1520 = 10 列 × 16 行，够装 150 张', () => {
        expect(columnsOf(JOKER_ATLAS)).toBe(10);
        expect(rowsOf(JOKER_ATLAS)).toBe(16);
        expect(columnsOf(JOKER_ATLAS) * rowsOf(JOKER_ATLAS)).toBeGreaterThanOrEqual(150);
    });

    it('三张图集的格子都是 71×95——`game.lua:978` 起那张注册表', () => {
        for (const atlas of [DECK_ATLAS, CENTERS_ATLAS, JOKER_ATLAS]) {
            expect(atlas.frameW, atlas.key).toBe(71);
            expect(atlas.frameH, atlas.key).toBe(95);
        }
    });
});

describe('frameIndex', () => {
    it('行优先：(0,0) → 0，(1,0) → 1，(0,1) → 列数', () => {
        expect(frameIndex(DECK_ATLAS, { x: 0, y: 0 })).toBe(0);
        expect(frameIndex(DECK_ATLAS, { x: 1, y: 0 })).toBe(1);
        expect(frameIndex(DECK_ATLAS, { x: 0, y: 1 })).toBe(13);
        expect(frameIndex(JOKER_ATLAS, { x: 0, y: 1 })).toBe(10);
    });

    it('52 张扑克牌的帧序号两两不同、且落在 0..51', () => {
        // 与 card-sprite 的 SUIT_ROW / VALUE_COL 同一套映射，这里重算一遍做交叉验证
        const suitRow = { Hearts: 0, Clubs: 1, Diamonds: 2, Spades: 3 } as const;
        const valueCol: Record<string, number> = {
            '2': 0, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6, '9': 7, '10': 8,
            Jack: 9, Queen: 10, King: 11, Ace: 12,
        };

        const seen = new Set<number>();
        for (const card of makeStandardDeck()) {
            const pos = { x: valueCol[card.base.value], y: suitRow[card.base.suit] };
            expect(inBounds(DECK_ATLAS, pos), card.key).toBe(true);
            const idx = frameIndex(DECK_ATLAS, pos);
            expect(seen.has(idx), `${card.key} 与别的牌撞了帧 ${idx}`).toBe(false);
            expect(idx).toBeGreaterThanOrEqual(0);
            expect(idx).toBeLessThan(52);
            seen.add(idx);
        }
        expect(seen.size).toBe(52);
    });
});

describe('150 张小丑的图集坐标', () => {
    it('每一张的 pos 都在 10×16 的网格里', () => {
        for (const [key, center] of Object.entries(JOKER_CENTERS)) {
            expect(inBounds(JOKER_ATLAS, center.pos), `${key} 的 pos ${JSON.stringify(center.pos)} 越界`)
                .toBe(true);
        }
    });

    /**
     * **150 张小丑只占 149 个格子**：`j_joker` 与 `j_wee` 在 `game.lua` 里
     * 都是 `pos = {x=0, y=0}`（`:371` 与 `:502`），故意共用同一格——
     * Wee Joker 的卡面就是普通 Joker 的脸，只是 `set_ability` 把它缩到 0.7
     * （`card.lua:250`）。这是原作的数据，不是抽取错误。
     *
     * 所以这条测试断言的是「**只有这一处**共用」，而不是「两两不同」。
     * 哪天冒出第二处共用，那才是解析出了问题。
     */
    it('只有 Joker 与 Wee Joker 共用一格，其余两两不同', () => {
        const byFrame = new Map<number, string[]>();
        for (const [key, center] of Object.entries(JOKER_CENTERS)) {
            const idx = frameIndex(JOKER_ATLAS, center.pos);
            byFrame.set(idx, [...(byFrame.get(idx) ?? []), key]);
        }

        const shared = [...byFrame.entries()].filter(([, keys]) => keys.length > 1);
        expect(shared).toHaveLength(1);
        expect(shared[0][0]).toBe(0);
        expect(shared[0][1].sort()).toEqual(['j_joker', 'j_wee']);
        expect(byFrame.size).toBe(149);
    });

    it('带灵魂层的那几张（传奇小丑）的 soul_pos 也在网格里', () => {
        const withSoul = Object.entries(JOKER_CENTERS).filter(([, c]) => c.soul_pos);
        // rarity 4 的 5 张 + Hologram 之类。至少要有 5 张
        expect(withSoul.length).toBeGreaterThanOrEqual(5);
        for (const [key, center] of withSoul) {
            expect(inBounds(JOKER_ATLAS, center.soul_pos!), `${key} 的 soul_pos 越界`).toBe(true);
        }
    });
});

describe('消耗品的图集坐标', () => {
    it('52 张消耗品的 pos 全部在 Tarots 的网格内', () => {
        for (const [key, center] of Object.entries(CONSUMABLE_CENTERS)) {
            expect(inBounds(TAROT_ATLAS, center.pos), `${key} 的 pos 越界`).toBe(true);
        }
    });

    it('52 张两两不共格', () => {
        const frames = Object.values(CONSUMABLE_CENTERS).map((c) => frameIndex(TAROT_ATLAS, c.pos));
        expect(new Set(frames).size).toBe(52);
    });

    /**
     * 三张 softlock 星球的 pos 落在**塔罗那几行**（y = 2），不在星球那一行（y = 3）。
     * 看着像抽错了，实际原作就是这么排的——`c_planet_x` 是 `{x=9,y=2}`。
     * 钉住它，免得下一个人「顺手修正」成 y = 3 而画出 Judgement 的脸。
     */
    it('Planet X / Ceres / Eris 的 pos 在 y = 2 那一行，不是 y = 3', () => {
        expect(CONSUMABLE_CENTERS.c_planet_x.pos).toEqual({ x: 9, y: 2 });
        expect(CONSUMABLE_CENTERS.c_ceres.pos).toEqual({ x: 8, y: 2 });
        expect(CONSUMABLE_CENTERS.c_eris.pos).toEqual({ x: 3, y: 2 });
    });
});

describe('补充包的图集坐标', () => {
    it('boosters 284×855 = 4 列 × 9 行', () => {
        expect(columnsOf(BOOSTER_ATLAS)).toBe(4);
        expect(rowsOf(BOOSTER_ATLAS)).toBe(9);
    });

    it('32 个包的 pos 全部在网格内', () => {
        for (const [key, center] of Object.entries(BOOSTER_CENTERS)) {
            expect(inBounds(BOOSTER_ATLAS, center.pos), `${key} 的 pos 越界`).toBe(true);
        }
    });

    it('32 个包两两不共格', () => {
        const frames = Object.values(BOOSTER_CENTERS).map((c) => frameIndex(BOOSTER_ATLAS, c.pos));
        expect(new Set(frames).size).toBe(32);
    });
});
