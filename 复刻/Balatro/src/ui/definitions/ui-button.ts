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
    /** 单选组里的一个（标签页按钮）：点了就把同组别的 `chosen` 清掉，被选中的头上画一个红三角 */
    choice?: boolean;
    chosen?: boolean;
    refTable?: object;
    /** 按钮下面一行「已发现 / 总数」（图鉴） */
    count?: { tally: number; of: number };
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
    if (args.count) labelNodes.push({ n: UIT.R, config: { align: 'cm', minh: 0.4 }, nodes: [
        { n: UIT.T, config: { scale: 0.35, text: `${args.count.tally} / ${args.count.of}`, colour: [1, 1, 1, 0.9] } },
    ] });
    return { n: args.col ? UIT.C : UIT.R, config: { align: 'cm' }, nodes: [
        { n: UIT.C, config: { align: 'cm', padding: args.padding ?? 0, r: 0.1, hover: true, colour, button, minh: minh - 0.3 * (args.count ? 1 : 0), shadow: true, func: args.func, id: args.id, choice: args.choice, chosen: args.chosen, ref_table: args.refTable }, nodes: labelNodes },
    ] };
}
