/**
 * 左侧面板随盲注换色（22 号票）：`misc_functions.lua:365` 的 `get_blind_main_colour`
 * 与 `blind.lua:32` 的 `Blind:change_colour`。结果原地写进 `C.DYN_UI`（原作是 `ease_colour`
 * 缓动过去，复刻件先直接落到终点）。
 */
import { BLIND_CENTERS } from '../core/blinds';
import { C, type Colour, HEX, darken, lighten, mixColours, setColour } from './colours';

/** `get_blind_main_colour(blind)`：Boss 用自己的 `boss_colour`，小盲蓝、大盲橙（各混六成黑），其余黑 */
export function blindMainColour(key: string | null): Colour {
    const center = key ? BLIND_CENTERS[key] : undefined;
    if (!center) return C.BLACK;
    if (center.boss_colour) return HEX(center.boss_colour);
    if (key === 'bl_small') return mixColours(C.BLUE, C.BLACK, 0.6);
    if (key === 'bl_big') return mixColours(C.ORANGE, C.BLACK, 0.6);
    return C.BLACK;
}

/**
 * `Blind:change_colour`。原文 `not self.boss and self.name` 那一支：`self.name` 只在 `Blind()` 刚构造出来时是 nil，
 * 而开局紧接着就 `set_blind(nil, nil, true)`（`game.lua:2648`）把它设成 ''——Lua 里空串是真值——
 * 所以实际画得出来的只有两种：**Boss 用自己的颜色，其余一律是近黑的那一对**
 * （`BOSS_MAIN` 暗 5%、`BOSS_DARK` 亮 7%，实机截图上面板的分层就是这么来的）。
 */
export function applyBlindColours(key: string | null): void {
    let blind = blindMainColour(key);
    const isBoss = !!(key && BLIND_CENTERS[key]?.boss);
    setColour(C.DYN_UI.MAIN, blind);
    setColour(C.DYN_UI.DARK, mixColours(blind, C.BLACK, 0.4));
    let dark: Colour;
    if (!isBoss) {
        blind = darken(C.BLACK, 0.05);
        dark = lighten(C.BLACK, 0.07);
    } else {
        dark = mixColours(blind, C.BLACK, 0.2);
    }
    setColour(C.DYN_UI.BOSS_MAIN, blind);
    setColour(C.DYN_UI.BOSS_DARK, dark);
}
