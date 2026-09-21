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

/** `G.C.BACKGROUND`：背景 shader 的三个颜色（`colour_1 = C`、`colour_2 = L`、`colour_3 = D`）与对比度 */
export type BackgroundColours = { C: Colour; L: Colour; D: Colour; contrast: number };

/** `ease_background_colour` 的终点（`common_events.lua:278`）。原作缓动 0.6 秒过去，这里只算终点 */
export function backgroundTarget(args: { new_colour: Colour; special_colour?: Colour; tertiary_colour?: Colour; contrast: number }): BackgroundColours {
    const scale = (c: Colour, k: number): Colour => [c[0] * k, c[1] * k, c[2] * k, 1];
    if (args.special_colour && args.tertiary_colour) {
        return { L: scale(args.new_colour, 1), C: scale(args.special_colour, 1), D: scale(args.tertiary_colour, 1), contrast: args.contrast };
    }
    return {
        L: scale(args.new_colour, 1.3),
        C: args.special_colour ? scale(args.special_colour, 1) : scale(args.new_colour, 0.9),
        D: scale(args.new_colour, args.special_colour ? 0.4 : 0.7),
        contrast: args.contrast,
    };
}

/** 开包时的状态（`G.STATES.*_PACK`），按包的口味 */
export type PackState = 'Arcana' | 'Spectral' | 'Standard' | 'Buffoon' | 'Celestial';

/**
 * `ease_background_colour_blind`（`common_events.lua:313`）的背景那一半。
 * `blindKey` 是 `G.GAME.blind` 的 key，空 / 小盲 / 大盲都按小盲注的绿；`won` 是 `G.GAME.won`
 */
export function backgroundFor(pack: PackState | null, blindKey: string | null, won = false): BackgroundColours {
    if (pack === 'Arcana') return backgroundTarget({ new_colour: C.PURPLE, special_colour: darken(C.BLACK, 0.2), contrast: 1.5 });
    if (pack === 'Spectral') return backgroundTarget({ new_colour: C.SECONDARY_SET.Spectral, special_colour: darken(C.BLACK, 0.2), contrast: 2 });
    if (pack === 'Standard') return backgroundTarget({ new_colour: darken(C.BLACK, 0.2), special_colour: C.RED, contrast: 3 });
    if (pack === 'Buffoon') return backgroundTarget({ new_colour: C.FILTER, special_colour: C.BLACK, contrast: 2 });
    if (pack === 'Celestial') return backgroundTarget({ new_colour: C.BLACK, contrast: 3 });
    if (won) return backgroundTarget({ new_colour: C.BLIND.won, contrast: 1 });
    const center = blindKey ? BLIND_CENTERS[blindKey] : undefined;
    if (!center || !center.boss) return backgroundTarget({ new_colour: C.BLIND.Small, contrast: 1 });
    if (center.boss.showdown) {
        return backgroundTarget({ new_colour: C.BLUE, special_colour: C.RED, tertiary_colour: darken(C.BLACK, 0.4), contrast: 3 });
    }
    const boss = center.boss_colour ? HEX(center.boss_colour) : C.BLACK;
    return backgroundTarget({ new_colour: lighten(mixColours(boss, C.BLACK, 0.3), 0.1), special_colour: boss, contrast: 2 });
}

/** 开包时左侧面板的主色（`ease_background_colour_blind` 的前一半，只改 `DYN_UI.MAIN`） */
export function packMainColour(pack: PackState): Colour {
    switch (pack) {
        case 'Arcana': return mixColours(C.WHITE, C.BLACK, 0.9);
        case 'Spectral': return mixColours(C.SECONDARY_SET.Spectral, C.BLACK, 0.9);
        case 'Standard': return C.RED;
        case 'Buffoon': return C.FILTER;
        case 'Celestial': return mixColours(C.SECONDARY_SET.Planet, C.BLACK, 0.9);
    }
}
