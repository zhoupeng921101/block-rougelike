/**
 * 描述文字的解析与排版（22 号票）：`misc_functions.lua:1619` 的 `loc_parse_string`、`:1517` 的 `loc_colour`、
 * `:1674` 的 `localize` 里 descriptions / other / name / name_text 这几支。逐行直译。
 *
 * 描述原文形如 `{C:red,s:1.1}+#1#{} Mult`：`{…}` 是控制段（C 颜色、X 底色块、s 缩放、E 动效、V 取 vars.colours、T 悬浮提示），
 * `#n#` 是第 n 个变量。`localize` 把一行拼成一串 UI 节点：普通段是 T，X 段是带底色的 C，E 段与名字是 DynaText。
 */
import { C, type Colour } from './colours';
import { DESCRIPTIONS, MISC } from './descriptions.generated';
import { DynaText } from './dynatext';
import { DICTIONARY } from './lang.generated';
import { type UINodeDef, UIT } from './uibox';

export type LocPart = { strings: Array<string | [string]>; control: Record<string, string | undefined> };

/** `loc_parse_string`：逐字符的小状态机，照原文（包括 `X` 段里吞掉空白） */
export function locParseString(line: string): LocPart[] {
    const parsed: LocPart[] = [];
    let control: Record<string, string | undefined> = {};
    let c = false;
    let cName: string | undefined;
    let cVal: string | undefined;
    let cGather = false;
    let sGather = false;
    let sRef: string | undefined;
    let parts: Array<string | [string]> = [];
    let it = 0;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i]!;
        if (ch === '{') {
            if (parts[0] !== undefined) parsed.push({ strings: parts, control });
            parts = [];
            it = 0;
            control = {};
            cName = cVal = undefined;
            cGather = false;
            sGather = false;
            sRef = undefined;
            c = true;
        } else if (c && !(ch === ':' || ch === '}') && !cGather) cName = (cName ?? '') + ch;
        else if (c && ch === ':') cGather = true;
        else if (c && !(ch === ',' || ch === '}') && cGather) cVal = (cVal ?? '') + ch;
        else if (c && (ch === ',' || ch === '}')) {
            cGather = false;
            if (cName !== undefined) control[cName] = cVal;
            cName = cVal = undefined;
            if (ch === '}') c = false;
        } else if (!c && ch !== '#' && !sGather) {
            const add = control.X !== undefined ? ch.replace(/\s+/g, '') : ch;
            parts[it] = (((parts[it] as string | undefined) ?? '') + add);
        } else if (!c && ch === '#' && !sGather) {
            sGather = true;
            if (parts[it] !== undefined) it++;
        } else if (!c && ch === '#' && sGather) {
            sGather = false;
            if (sRef !== undefined) {
                parts[it] = [sRef];
                it++;
                sRef = undefined;
            }
        } else if (!c && sGather) sRef = (sRef ?? '') + ch;
        if (i === line.length - 1) {
            if (parts[0] !== undefined) parsed.push({ strings: parts, control });
            return parsed;
        }
    }
    return parsed;
}

/** `loc_colour`：未知名字给 `_default` 或黑 */
export function locColour(name?: string, def?: Colour): Colour {
    const map: Record<string, Colour> = {
        red: C.RED, mult: C.MULT, blue: C.BLUE, chips: C.CHIPS, green: C.GREEN, money: C.MONEY, gold: C.GOLD,
        attention: C.FILTER, purple: C.PURPLE, white: C.WHITE, inactive: C.UI.TEXT_INACTIVE,
        spades: C.SUITS.Spades!, hearts: C.SUITS.Hearts!, clubs: C.SUITS.Clubs!, diamonds: C.SUITS.Diamonds!,
        tarot: C.SECONDARY_SET.Tarot, planet: C.SECONDARY_SET.Planet, spectral: C.SECONDARY_SET.Spectral,
        edition: C.EDITION, dark_edition: C.DARK_EDITION, legendary: C.RARITY[3]!, enhanced: C.SECONDARY_SET.Enhanced,
    };
    return (name !== undefined ? map[name] : undefined) ?? def ?? C.BLACK;
}

/** `localize(key, cat)`：`misc` 里的一张表，缺省是 dictionary */
export function locMisc(key: string, cat?: string): string {
    if (cat && MISC[cat]) return MISC[cat]![key] ?? 'ERROR';
    return DICTIONARY[key] ?? 'ERROR';
}

/** `localize{type = 'name_text'}`：名字的原文（多行名字取第一行之外原样返回数组的 Lua 行为这里用不到） */
export function locNameText(set: string, key: string): string {
    const name = DESCRIPTIONS[set]?.[key]?.name;
    if (name === undefined || name === null) return 'ERROR';
    return typeof name === 'string' ? name : name.join('');
}

/** `#n#` 的实参。`colours` 是 `V:n` 控制段取色用的 */
export type LocVars = Array<string | number | undefined> & { colours?: Colour[] };

const lua = (v: string | number | undefined): string | undefined => {
    if (v === undefined) return undefined;
    return typeof v === 'number' ? luaNumber(v) : v;
};

/** Lua 5.1 的 `tostring(number)`：`%.14g` */
export function luaNumber(n: number): string {
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
    const s = n.toPrecision(14);
    if (s.includes('e')) {
        const [m, e] = s.split('e');
        const mm = m!.includes('.') ? m!.replace(/0+$/, '').replace(/\.$/, '') : m!;
        const ee = Number(e);
        return `${mm}e${ee < 0 ? '-' : '+'}${String(Math.abs(ee)).padStart(2, '0')}`;
    }
    return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}

function assemble(part: LocPart, vars: LocVars): string {
    let out = '';
    for (const sub of part.strings) out += typeof sub === 'string' ? sub : (lua(vars[Number(sub[0]) - 1]) ?? 'ERROR');
    return out;
}

export type LocalizeArgs = {
    type: 'descriptions' | 'other' | 'name' | 'unlocks';
    set?: string;
    key: string;
    vars?: LocVars;
    nodes?: UINodeDef[][];
    shadow?: boolean;
    default_col?: Colour;
    /** `G.F_MOBILE`：描述字号 ×1.45 */
    mobile?: boolean;
};

const parsedCache = new Map<string, LocPart[][]>();
function parsedLines(set: string, key: string, which: 'text' | 'name' | 'unlock'): LocPart[][] | null {
    const id = `${set}/${key}/${which}`;
    const hit = parsedCache.get(id);
    if (hit) return hit;
    const entry = DESCRIPTIONS[set]?.[key];
    if (!entry) return null;
    const src = which === 'text' ? entry.text : which === 'unlock' ? entry.unlock : entry.name;
    if (src === undefined || src === null) return null;
    const lines = (typeof src === 'string' ? [src] : src).map(locParseString);
    parsedCache.set(id, lines);
    return lines;
}

/**
 * `localize{type = ...}` 的 UI 分支：每行拼成一串节点。`name` 类型只返回第一行的节点（原文 `return final_line`）；
 * 其余把每行追加到 `args.nodes` 里
 */
export function localize(args: LocalizeArgs): UINodeDef[] | undefined {
    const set = args.type === 'other' ? 'Other' : args.set!;
    const lines = parsedLines(set, args.key, args.type === 'name' ? 'name' : args.type === 'unlocks' ? 'unlock' : 'text');
    if (!lines) return undefined;
    const vars = args.vars ?? ([] as LocVars);
    const descScale = args.mobile ? 1.45 : 1;
    for (const line of lines) {
        const finalLine: UINodeDef[] = [];
        for (const part of line) {
            const s = assemble(part, vars);
            const k = part.control.s !== undefined ? Number(part.control.s) : 1;
            const vCol = part.control.V !== undefined ? vars.colours?.[Number(part.control.V) - 1] : undefined;
            if (args.type === 'name') {
                finalLine.push({ n: UIT.O, config: { object: new DynaText({
                    string: [s],
                    colours: [vCol ?? (part.control.C !== undefined ? locColour(part.control.C) : C.UI.TEXT_LIGHT)],
                    bump: true, silent: true, pop_in: 0, maxw: 5, shadow: true, y_offset: -0.6,
                    spacing: Math.max(0, 0.32 * (17 - s.length)),
                    scale: (0.55 - 0.004 * s.length) * k,
                }) } });
            } else if (part.control.E !== undefined) {
                const e1 = part.control.E === '1';
                const e2 = part.control.E === '2';
                finalLine.push({ n: UIT.O, config: { object: new DynaText({
                    string: [s],
                    colours: [vCol ?? locColour(part.control.C)],
                    float: e1 || undefined, silent: true, pop_in: e1 ? 0 : undefined, bump: e2 || undefined, spacing: e2 ? 1 : undefined,
                    scale: 0.32 * k * descScale,
                }) } });
            } else if (part.control.X !== undefined) {
                finalLine.push({ n: UIT.C, config: { align: 'm', colour: locColour(part.control.X), r: 0.05, padding: 0.03, res: 0.15 }, nodes: [
                    { n: UIT.T, config: { text: s, colour: locColour(part.control.C), scale: 0.32 * k * descScale } },
                ] });
            } else {
                finalLine.push({ n: UIT.T, config: {
                    text: s, shadow: args.shadow,
                    colour: vCol ?? locColour(part.control.C, args.default_col),
                    scale: 0.32 * k * descScale,
                } });
            }
        }
        if (args.type === 'name') return finalLine;
        args.nodes?.push(finalLine);
    }
    return undefined;
}

/** `localize{type = 'raw_descriptions'}` 的拼法，但对任意 set：每行拼成纯文本（测试与调试用） */
export function localizeRaw(set: string, key: string, vars: LocVars = []): string[] {
    const lines = parsedLines(set, key, 'text') ?? [];
    return lines.map((line) => line.map((p) => assemble(p, vars)).join(''));
}
