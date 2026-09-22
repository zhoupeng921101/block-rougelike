/**
 * `UI_definitions.lua:6547` 的 `UIBox_button`（不带 `count` / `choice` 的那部分）。结束界面、选盲注的 Reroll Boss 共用
 */
import { C, type Colour } from '../colours';
import { type UINodeDef, UIT } from '../uibox';

export type ButtonArgs = {
    button?: string;
    id?: string;
    label?: string[];
    colour?: Colour;
    textColour?: Colour;
    minw?: number;
    maxw?: number;
    minh?: number;
    scale?: number;
    shadow?: boolean;
    padding?: number;
    col?: boolean;
    /** 每帧跑的 `G.FUNCS[func]`（置灰之类） */
    func?: string;
};

/** `UIBox_button` */
export function uiboxButton(args: ButtonArgs): UINodeDef {
    const button = args.button ?? 'exit_overlay_menu';
    const colour = args.colour ?? C.RED;
    const label = args.label ?? ['LABEL'];
    const minw = args.minw ?? 2.7;
    let maxw = args.maxw ?? minw - 0.2;
    if (minw < maxw) maxw = minw - 0.2;
    const minh = args.minh ?? 0.9;
    const scale = args.scale ?? 0.5;
    const textColour = args.textColour ?? C.UI.TEXT_LIGHT;
    const labelNodes: UINodeDef[] = label.map((v) => ({ n: UIT.R, config: { align: 'cm', padding: 0, minw, maxw }, nodes: [
        { n: UIT.T, config: { text: v, scale, colour: textColour, shadow: args.shadow } },
    ] }));
    return { n: args.col ? UIT.C : UIT.R, config: { align: 'cm' }, nodes: [
        { n: UIT.C, config: { align: 'cm', padding: args.padding ?? 0, r: 0.1, hover: true, colour, button, minh, shadow: true, func: args.func, id: args.id }, nodes: labelNodes },
    ] };
}
