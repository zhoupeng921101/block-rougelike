/**
 * UI 布局引擎对拍**原作的 Lua 引擎本身**（22 号票）。
 *
 * 真值由 `tools/ui-oracle.py` 生成：用 LuaJIT 原样加载 `engine/ui.lua` 等文件、跑同一份 UI 定义，
 * 导出每个元素最终的 `T`（已经 `move_with_major` 到房间坐标）。两边字体度量是同一个模型，
 * 所以这里验的是布局算法——`calculate_xywh` / `set_wh` / `set_alignments` / `align_to_major`。
 */
import { describe, expect, it } from 'vitest';

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
});
