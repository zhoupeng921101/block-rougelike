/**
 * UI 布局引擎对拍**原作的 Lua 引擎本身**（22 号票）。
 *
 * 真值由 `tools/ui-oracle.py` 生成：用 LuaJIT 原样加载 `engine/ui.lua` 等文件、跑同一份 UI 定义，
 * 导出每个元素最终的 `T`（已经 `move_with_major` 到房间坐标）。两边字体度量是同一个模型，
 * 所以这里验的是布局算法——`calculate_xywh` / `set_wh` / `set_alignments` / `align_to_major`。
 */
import { describe, expect, it } from 'vitest';

import { cardAreas } from '../game/areas';
import { createButtons } from './definitions/buttons';
import { cardAreaBox } from './definitions/card-area';
import { createHudBlind, makeHudBlindState } from './definitions/hud-blind';
import { hudBlindFuncs } from './definitions/hud-blind-funcs';
import { makeHudState, createHud } from './definitions/hud';
import oracle from './oracle.generated.json';
import { UIBox, type UIElement } from './uibox';

type Case = { name: string; box: number[]; elements: Array<[number, string, number, number, number, number]> };
const cases = oracle as unknown as Case[];

function dump(box: UIBox): Array<[number, string, number, number, number, number]> {
    const out: Array<[number, string, number, number, number, number]> = [];
    const walk = (e: UIElement) => {
        out.push([e.UIT, e.config.id ?? '', e.x, e.y, e.T.w, e.T.h]);
        for (const c of e.children) walk(c);
    };
    walk(box.root);
    return out;
}

function expectSame(actual: ReturnType<typeof dump>, expected: Case['elements']): void {
    expect(actual).toHaveLength(expected.length);
    actual.forEach((a, i) => {
        const e = expected[i]!;
        const where = `#${i} UIT=${e[0]} id='${e[1]}'`;
        expect([a[0], a[1]], where).toEqual([e[0], e[1]]);
        for (let k = 2; k < 6; k++) expect(a[k], `${where} [${'xywh'[k - 2]}]`).toBeCloseTo(e[k] as number, 9);
    });
}

describe('UIBox 对拍 Lua 原作引擎', () => {
    it('create_UIBox_HUD：左侧面板 80 个元素的位置与尺寸', () => {
        const expected = cases.find((c) => c.name === 'hud')!;
        const box = new UIBox(createHud(makeHudState()), {
            align: 'cli',
            offset: { x: -0.7, y: 0 },
            major: { T: { x: 0, y: 0, w: 21, h: 11.2 } },
        });
        expect([box.T.x, box.T.y, box.T.w, box.T.h].map((v) => Number(v.toFixed(9))))
            .toEqual(expected.box.map((v) => Number(v.toFixed(9))));
        expectSame(dump(box), expected.elements);
    });

    /** `area_uibox`：底板那行 `mid = true`，UIBox 以它居中对齐到区域，计数行挂在下面 */
    const areas = cardAreas();
    it.each([
        ['area_jokers', areas.jokers, 'cl', 0, 5],
        ['area_consumeables', areas.consumeables, 'cr', 0, 2],
        ['area_hand', areas.hand, 'cm', 8, 8],
        ['area_deck', areas.deck, 'cr', 44, 52],
    ] as const)('%s：CardArea 的底框与计数', (name, area, align, count, limit) => {
        const expected = cases.find((c) => c.name === name)!;
        const box = new UIBox(cardAreaBox(area, { card_count: count, card_limit: limit }, align), {
            align: 'cm',
            offset: { x: 0, y: 0 },
            major: { T: area },
        });
        expectSame(dump(box), expected.elements);
    });

    /**
     * 盲注面板：挂在 HUD 的 `row_blind` 上。几个 `func`（debuff 行伸缩、分数字号、奖励行）在建盒子时跑一次、
     * 画第一帧前再跑一次——Boss 那一格两行 debuff 文字把面板撑高，小盲注那一格收起
     */
    it.each([
        ['hud_blind_small', 'Small Blind', 300, [] as string[]],
        ['hud_blind_head', 'The Head', 600, ['All Heart cards', 'are debuffed']],
    ])('%s：create_UIBox_HUD_blind 与它的 G.FUNCS', (name, blindName, chips, lines) => {
        const expected = cases.find((c) => c.name === name)!;
        const hud = new UIBox(createHud(makeHudState()), {
            align: 'cli', offset: { x: -0.7, y: 0 }, major: { T: { x: 0, y: 0, w: 21, h: 11.2 } },
        });
        const row = hud.getById('row_blind')!;
        const state = makeHudBlindState();
        Object.assign(state.blind, {
            key: 'x', loc_name: blindName, chips, chip_text: String(chips),
            loc_debuff_text: lines.length ? `${lines[0]} ${lines[1]}` : '',
        });
        state.blind.loc_debuff_lines['1'] = lines[0] ?? '';
        state.blind.loc_debuff_lines['2'] = lines[1] ?? '';
        state.current_round.dollars_to_be_earned = '$$$';
        const box = new UIBox(createHudBlind(state), {
            align: 'cm', offset: { x: 0, y: 0 }, major: { T: { x: row.x, y: row.y, w: row.T.w, h: row.T.h } },
        }, hudBlindFuncs(state));
        box.runFuncs();
        expectSame(dump(box), expected.elements);
    });

    it('create_UIBox_buttons（移动版、出牌在左）：挂在选牌状态的手牌区下面', () => {
        const expected = cases.find((c) => c.name === 'buttons_mobile')!;
        const hand = { ...areas.hand, y: areas.hand.y - 1.9 };
        const box = new UIBox(createButtons({ playButtonPos: 2, mobile: true }), {
            align: 'bm',
            offset: { x: 0, y: 0.3 },
            major: { T: hand },
        });
        expectSame(dump(box), expected.elements);
    });
});
