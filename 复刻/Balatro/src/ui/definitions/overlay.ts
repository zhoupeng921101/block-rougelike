/**
 * `UI_definitions.lua:6479` 的 `create_UIBox_generic_options`：所有 overlay 菜单（结束界面、Run Info……）的外框。
 * 整屏半透明灰底（5 倍房间大）→ 灰边 → 深色底 → 内容；不带 `no_back` 时底下一个橙色「Back」（`exit_overlay_menu`）
 */
import { C, type Colour } from '../colours';
import { DICTIONARY } from '../lang.generated';
import type { UINodeDef, UIObject } from '../uibox';
import { UIT } from '../uibox';

export type GenericOptionsArgs = {
    contents: UINodeDef[];
    bgColour?: Colour;
    outlineColour?: Colour;
    colour?: Colour;
    /** 原文 `args.padding or 0.2`：Lua 里 0 是真值，传 0 就是 0 */
    padding?: number;
    minw?: number;
    noBack?: boolean;
    backLabel?: string;
    backColour?: Colour;
    backFunc?: string;
};

export function genericOptions(args: GenericOptionsArgs): UINodeDef {
    const ROOM = { w: 21, h: 11.2 };
    const infotip: UIObject = { T: { x: 0, y: 0, w: 0, h: 0 } };
    const bg = args.bgColour ?? ([C.GREY[0], C.GREY[1], C.GREY[2], 0.7] as Colour);
    return { n: UIT.ROOT, config: { align: 'cm', minw: ROOM.w * 5, minh: ROOM.h * 5, padding: 0.1, r: 0.1, colour: bg }, nodes: [
        { n: UIT.R, config: { align: 'cm', minh: 1, r: 0.3, padding: 0.07, minw: 1, colour: args.outlineColour ?? C.JOKER_GREY, emboss: 0.1 }, nodes: [
            { n: UIT.C, config: { align: 'cm', minh: 1, r: 0.2, padding: 0.15, minw: 1, colour: args.colour ?? C.L_BLACK }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: args.padding ?? 0.2, minw: args.minw ?? 7 }, nodes: args.contents },
                args.noBack ? null : { n: UIT.R, config: { id: 'overlay_menu_back_button', align: 'cm', minw: 2.5, minh: 0.8, padding: 0.1, r: 0.1, hover: true, colour: args.backColour ?? C.ORANGE, button: args.backFunc ?? 'exit_overlay_menu', shadow: true }, nodes: [
                    { n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [
                        { n: UIT.T, config: { text: args.backLabel ?? DICTIONARY.b_back, scale: 0.5, colour: C.UI.TEXT_LIGHT, shadow: true } },
                    ] },
                ] },
            ] },
        ] },
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.O, config: { id: 'overlay_menu_infotip', object: infotip } },
        ] },
    ] };
}
