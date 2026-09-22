/**
 * 主菜单（22 号票第四十七步）：`UI_definitions.lua:6339` 的 `create_UIBox_main_menu_buttons`、
 * `:6303` 的 `create_UIBox_profile_button`，与 `game.lua:1917` 右上角的版本号。
 *
 * 本产物是 Android 版（`globals.lua:72`）：`F_QUIT_BUTTON = false`（没有 QUIT）、`F_ENGLISH_ONLY = false`（有语言按钮）、
 * `F_LINKTREE = true`（有链接按钮）、`F_DISP_USERNAME = nil`（Profile 下面不写「Playing as」）。
 * `G.FTP_LOCKED` / `F_JAN_CTA` 那行愿望单按钮在这一版不出。
 */
import { C, mixColours } from '../colours';
import { DICTIONARY } from '../lang.generated';
import type { UINodeDef } from '../uibox';
import { UIT } from '../uibox';
import type { SpriteObject } from './hud';
import { uiboxButton } from './ui-button';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

/** `globals.lua:1`：`'1.0.1o' .. '-FULL' .. ' [M]'` */
export const VERSION = '1.0.1o-FULL [M]';
/** `G.LANGUAGES['en-us'].label`（`game.lua:911`） */
const LANG_LABEL = 'English';

const iconSprite = (w: number, pos: { x: number; y: number }): SpriteObject =>
    ({ kind: 'sprite', atlas: 'icons', pos, T: { x: 0, y: 0, w, h: w } });

export function mainMenuButtons(): UINodeDef {
    const textScale = 0.45;
    // `Sprite(0,0,0.6,0.6,G.ASSET_ATLAS["icons"], {x=2, y=0})` 与 `{x=1, y=1}` 的 0.7
    const language = iconSprite(0.6, { x: 2, y: 0 });
    const linktree = iconSprite(0.7, { x: 1, y: 1 });
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: [
        { n: UIT.C, config: { align: 'bm' }, nodes: [
            { n: UIT.R, config: { align: 'cm', padding: 0.2, r: 0.1, emboss: 0.1, colour: C.L_BLACK, mid: true }, nodes: [
                // 教程没做完时是 `start_run`（直接开局、进教程）；复刻件没有教程，按做完了的 `setup_run`
                uiboxButton({ id: 'main_menu_play', button: 'setup_run', colour: C.BLUE, minw: 3.65, minh: 1.55, label: [loc('b_play_cap')], scale: textScale * 2, col: true }),
                { n: UIT.C, config: { align: 'cm' }, nodes: [
                    uiboxButton({ button: 'options', colour: C.ORANGE, minw: 2.65, minh: 1.35, label: [loc('b_options_cap')], scale: textScale * 1.2, col: true }),
                ] },
                uiboxButton({ id: 'collection_button', button: 'your_collection', colour: C.PALE_GREEN, minw: 3.65, minh: 1.55, label: [loc('b_collection_cap')], scale: textScale * 1.5, col: true }),
            ] },
        ] },
        { n: UIT.C, config: { align: 'br', minw: 3.2, padding: 0.1 }, nodes: [
            { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: 0.1, r: 0.1, hover: true, colour: mixColours(C.BLUE, C.GREY, 0.4), button: 'link_tree', shadow: true }, nodes: [
                    { n: UIT.O, config: { object: linktree } },
                ] },
            ] },
            { n: UIT.R, config: { align: 'cm', padding: 0.2, r: 0.1, emboss: 0.1, colour: C.L_BLACK }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: 0.15, minw: 1, r: 0.1, hover: true, colour: mixColours(C.WHITE, C.GREY, 0.2), button: 'language_selection', shadow: true }, nodes: [
                    { n: UIT.O, config: { object: language } },
                    { n: UIT.T, config: { text: LANG_LABEL, scale: 0.4, colour: C.UI.TEXT_LIGHT, shadow: true } },
                ] },
            ] },
        ] },
    ] };
}

/** `create_UIBox_profile_button`：档名是 `G.PROFILES[1].name`，缺省 `"P"..profile` */
export function profileButton(name = 'P1'): UINodeDef {
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.2, r: 0.1, emboss: 0.1, colour: C.L_BLACK }, nodes: [
            { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.T, config: { text: loc('k_profile'), scale: 0.4, colour: C.UI.TEXT_LIGHT, shadow: true } },
            ] },
            { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.C, config: { align: 'cm', padding: 0.15, minw: 2, minh: 0.8, maxw: 2, r: 0.1, hover: true, colour: mixColours(C.WHITE, C.GREY, 0.2), button: 'profile_select', shadow: true }, nodes: [
                    { n: UIT.T, config: { text: name, scale: 0.4, colour: C.UI.TEXT_LIGHT, shadow: true } },
                ] },
            ] },
        ] },
    ] };
}

/** `game.lua:1917`：`tri` 挂房间右上角，半透明黑底 */
export function versionBox(): UINodeDef {
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.UI.TRANSPARENT_DARK }, nodes: [
        { n: UIT.T, config: { text: VERSION, scale: 0.3, colour: C.UI.TEXT_LIGHT } },
    ] };
}
