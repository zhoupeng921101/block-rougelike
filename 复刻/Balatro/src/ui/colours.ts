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
    JOKER_GREY: HEX('bfc7d5'),
    XMULT: HEX('FE5F55'),
    PALE_GREEN: HEX('56a887'),
    CHANCE: HEX('4BC292'),
    VOUCHER: HEX('cb724c'),
    BOOSTER: HEX('646eb7'),
    /** 这两个每帧变（`game.lua:2735`），由 `tickColours` 写 */
    EDITION: [1, 1, 1, 1] as Colour,
    DARK_EDITION: [0, 0, 0, 1] as Colour,
    ETERNAL: HEX('c75985'),
    PERISHABLE: HEX('4f5da1'),
    RENTAL: HEX('b18f43'),
    SUITS: {
        Hearts: HEX('FE5F55'),
        Diamonds: HEX('FE5F55'),
        Spades: HEX('374649'),
        Clubs: HEX('424e54'),
    } as Record<string, Colour>,
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
    SET: {
        Default: HEX('cdd9dc'),
        Enhanced: HEX('cdd9dc'),
        Joker: HEX('424e54'),
        Tarot: HEX('424e54'),
        Planet: HEX('424e54'),
        Spectral: HEX('424e54'),
        Voucher: HEX('424e54'),
    } as Record<string, Colour>,
    SECONDARY_SET: {
        Default: HEX('9bb6bdFF'),
        Enhanced: HEX('8389DDFF'),
        Joker: HEX('708b91'),
        Tarot: HEX('a782d1'),
        Planet: HEX('13afce'),
        Spectral: HEX('4584fa'),
        Voucher: HEX('fd682b'),
        Edition: HEX('4ca893'),
    },
    RARITY: [HEX('009dff'), HEX('4BC292'), HEX('fe5f55'), HEX('b26cbb')],
    /** 下标 0 是 `G.C.RED`（`globals.lua` 末尾 `HAND_LEVELS[0] = RED`），1..7 照原文 */
    HAND_LEVELS: [HEX('FE5F55'), HEX('efefef'), HEX('95acff'), HEX('65efaf'), HEX('fae37e'), HEX('ffc052'), HEX('f87d75'), HEX('caa0ef')],
    /** `globals.lua` 末尾：`copy_table(G.C.BLUE)` / `copy_table(G.C.RED)`，是**副本**（会被火焰特效改） */
    UI_CHIPS: HEX('009dff'),
    UI_MULT: HEX('FE5F55'),
};

/** `Game:update` 里每帧改的两个颜色（`game.lua:2735`）。`t` 是 `G.TIMERS.REAL` */
export function tickColours(t: number): void {
    C.DARK_EDITION[0] = 0.6 + 0.2 * Math.sin(t * 1.3);
    C.DARK_EDITION[2] = 0.6 + 0.2 * (1 - Math.sin(t * 1.3));
    C.DARK_EDITION[1] = Math.min(C.DARK_EDITION[2], C.DARK_EDITION[0]);
    C.EDITION[0] = 0.7 + 0.2 * (1 + Math.sin(t * 1.5 + 0));
    C.EDITION[2] = 0.7 + 0.2 * (1 + Math.sin(t * 1.5 + 3));
    C.EDITION[1] = 0.7 + 0.2 * (1 + Math.sin(t * 1.5 + 6));
}
