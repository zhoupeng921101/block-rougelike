/**
 * Jimbo 的对话气泡：`UI_definitions.lua:473` 的 `G.UIDEF.speech_bubble`（22 号票第十八步）。
 *
 * 文字走 `localize{type = 'quips'}`：俏皮话里没有控制码，每段都是 T 节点，字号 `0.32 × DESCSCALE`，
 * 移动版再 ×1.45（`misc_functions.lua:1747`，教程是 ×1.5），颜色是 `loc_colour(nil)` = `G.C.BLACK`。
 */
import { C } from '../colours';
import { QUIPS } from '../descriptions.generated';
import { locColour, locParseString } from '../localize';
import { type UINodeDef, UIT } from '../uibox';

export function speechBubble(quipKey: string, mobile: boolean): UINodeDef {
    const descScale = mobile ? 1.45 : 1;
    const rows: UINodeDef[] = (QUIPS[quipKey] ?? []).map((line) => ({
        n: UIT.R, config: { align: 'cl' }, nodes: locParseString(line).map((part): UINodeDef => ({
            n: UIT.T, config: {
                text: part.strings.map((s) => (typeof s === 'string' ? s : 'ERROR')).join(''),
                colour: locColour(part.control.C),
                scale: 0.32 * (part.control.s !== undefined ? Number(part.control.s) : 1) * descScale,
            },
        })),
    }));
    return { n: UIT.ROOT, config: { align: 'cm', minh: 1, r: 0.3, padding: 0.07, minw: 1, colour: C.JOKER_GREY, shadow: true }, nodes: [
        { n: UIT.C, config: { align: 'cm', minh: 1, r: 0.2, padding: 0.1, minw: 1, colour: C.WHITE }, nodes: [
            { n: UIT.C, config: { align: 'cm', minh: 1, r: 0.2, padding: 0.03, minw: 1, colour: C.WHITE }, nodes: rows },
        ] },
    ] };
}
