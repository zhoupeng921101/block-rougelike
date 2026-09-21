/**
 * `G.C`（`globals.lua` 的 `self.C`）与几个取色函数（`misc_functions.lua`）。
 *
 * 颜色是 `[r, g, b, a]`（0–1），**可变**：原作的 `G.C.DYN_UI.*` 会被 `ease_colour` 原地改写，
 * UI 定义里存的是同一个表的引用，所以界面跟着变。复刻件照这个语义：定义里放引用，改的时候原地改。
 */
export type Colour = [number, number, number, number];

/** `misc_functions.lua:358` */
export function HEX(hex: string): Colour {
    const h = hex.length <= 6 ? `${hex}FF` : hex;
    const v = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
    return [v(0), v(2), v(4), v(6)];
}

/** `misc_functions.lua:678` */
export function mixColours(c1: Colour, c2: Colour, p: number): Colour {
    return [
        c1[0] * p + c2[0] * (1 - p),
        c1[1] * p + c2[1] * (1 - p),
        c1[2] * p + c2[2] * (1 - p),
        c1[3] * p + c2[3] * (1 - p),
    ];
}

/** `misc_functions.lua:838` */
export function lighten(c: Colour, p: number): Colour {
    return [c[0] * (1 - p) + p, c[1] * (1 - p) + p, c[2] * (1 - p) + p, c[3]];
}

/** `misc_functions.lua:854` */
export function darken(c: Colour, p: number): Colour {
    return [c[0] * (1 - p), c[1] * (1 - p), c[2] * (1 - p), c[3]];
}

/** `misc_functions.lua:870` */
export function adjustAlpha(c: Colour, a: number): Colour {
    return [c[0], c[1], c[2], a];
}

/** 把 `to` 的值原地写进 `target`（`ease_colour` 的终点；复刻件先不做缓动） */
export function setColour(target: Colour, to: Colour): void {
    target[0] = to[0];
    target[1] = to[1];
    target[2] = to[2];
    target[3] = to[3];
}

/** `globals.lua` 的 `self.C`，只抄 UI 用得到的那些；要用新的再往里加，值照原文 */
export const C = {
    MULT: HEX('FE5F55'),
    CHIPS: HEX('009dff'),
    MONEY: HEX('f3b958'),
    FILTER: HEX('ff9a00'),
    BLUE: HEX('009dff'),
    RED: HEX('FE5F55'),
    GREEN: HEX('4BC292'),
    ORANGE: HEX('fda200'),
    IMPORTANT: HEX('ff9a00'),
    GOLD: HEX('eac058'),
    CLEAR: [0, 0, 0, 0] as Colour,
    WHITE: [1, 1, 1, 1] as Colour,
    PURPLE: HEX('8867a5'),
    BLACK: HEX('374244'),
    L_BLACK: HEX('4f6367'),
    GREY: HEX('5f7377'),
    DYN_UI: {
        MAIN: HEX('374244'),
        DARK: HEX('374244'),
        BOSS_MAIN: HEX('374244'),
        BOSS_DARK: HEX('374244'),
        BOSS_PALE: HEX('374244'),
    },
    UI: {
        TEXT_LIGHT: [1, 1, 1, 1] as Colour,
        TEXT_DARK: HEX('4F6367'),
        TEXT_INACTIVE: HEX('88888899'),
        BACKGROUND_LIGHT: HEX('B8D8D8'),
        BACKGROUND_WHITE: [1, 1, 1, 1] as Colour,
        BACKGROUND_DARK: HEX('7A9E9F'),
        BACKGROUND_INACTIVE: HEX('666666FF'),
        OUTLINE_LIGHT: HEX('D8D8D8'),
        OUTLINE_LIGHT_TRANS: HEX('D8D8D866'),
        OUTLINE_DARK: HEX('7A9E9F'),
        TRANSPARENT_LIGHT: HEX('eeeeee22'),
        TRANSPARENT_DARK: HEX('22222222'),
        HOVER: HEX('00000055'),
    },
    BLIND: {
        Small: HEX('50846e'),
        Big: HEX('50846e'),
        Boss: HEX('b44430'),
        won: HEX('4f6367'),
    },
    SECONDARY_SET: {
        Planet: HEX('13afce'),
        Spectral: HEX('4584fa'),
    },
    /** `globals.lua` 末尾：`copy_table(G.C.BLUE)` / `copy_table(G.C.RED)`，是**副本**（会被火焰特效改） */
    UI_CHIPS: HEX('009dff'),
    UI_MULT: HEX('FE5F55'),
};
