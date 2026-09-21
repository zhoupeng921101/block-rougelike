/**
 * `engine/ui.lua` 的布局部分：`UIBox` / `UIElement` 的 `calculate_xywh` → `set_wh` → `set_alignments`
 * → `align_to_major`（22 号票）。**不 import Phaser**，能进单测；绘制在 `src/game/ui-draw.ts`。
 *
 * 直译，连怪癖一起：
 * - 列（C）的 `emboss` 每遇到一个就往行高上加一次，不管它是不是最高的那列（`ui.lua:199`）
 * - `maxw` / `maxh` 超了就整段重排一遍，并把子节点的 `config.scale` **原地乘上**缩放系数（`ui.lua:184`）
 * - 叶子节点（T / B / O）的 `content_dimensions` 记的是**父节点游标**的宽高（`ui.lua:153`），对齐时用不到
 *
 * 坐标全是 tile。元素的 `T` 是盒内坐标（`calculate_xywh` 的结果），对齐只改 `offset`
 * （原作的 `role.offset`）；元素在房间里的位置 = 盒子的 `T` + 元素的 `offset`。
 */
import { C, type Colour } from './colours';
import { EN_FONT, type FontSpec, fontHeight, fontWidth } from './font';

/** `globals.lua` 的 `G.TILESIZE` */
export const TILESIZE = 20;

/** `globals.lua:519` 的 `G.UIT`。`padding = 0` 是缺省内边距 */
export const UIT = { T: 1, B: 2, C: 3, R: 4, O: 5, ROOT: 7 } as const;
export type UITKind = (typeof UIT)[keyof typeof UIT];
const DEFAULT_PADDING = 0;

export type Rect = { x: number; y: number; w: number; h: number };

/** 能放进 O 节点的东西（DynaText、精灵……）。布局只读它的宽高 */
export interface UIObject {
    T: Rect;
}

/** 有 `T` 的东西都能当 major（`G.ROOM_ATTACH`、别的 UIBox、某个 UIElement） */
export interface Major {
    T: Rect;
}

export type UIConfig = {
    align?: string;
    padding?: number;
    minw?: number;
    minh?: number;
    maxw?: number;
    maxh?: number;
    w?: number;
    h?: number;
    colour?: Colour;
    outline_colour?: Colour;
    outline?: number;
    r?: number;
    emboss?: number;
    shadow?: boolean;
    shadow_colour?: Colour;
    hover?: boolean;
    button?: string;
    id?: string;
    text?: string;
    scale?: number;
    ref_table?: Record<string, unknown>;
    ref_value?: string;
    lang?: FontSpec;
    vert?: boolean;
    object?: UIObject;
    no_fill?: boolean;
    no_recalc?: boolean;
    func?: string;
    res?: number;
    ext_up?: number;
    mid?: boolean;
    /** 按钮的子孙指回那个按钮（`ui.lua:246`，`set_parent_child` 往下传的），绘制时算分层视差要用 */
    button_UIE?: UIElement;
    [key: string]: unknown;
};

/** UI 定义树的一个节点（`{n = G.UIT.R, config = {...}, nodes = {...}}`）。`nodes` 里的空洞照 Lua 的 `pairs` 跳过 */
export type UINodeDef = {
    n: UITKind;
    config?: UIConfig;
    nodes?: ReadonlyArray<UINodeDef | null | undefined | false>;
};

/** `G.FUNCS[...]`：定义里 `func = '...'` 引用的回调 */
export type UIFuncs = Record<string, (e: UIElement) => void>;

export class UIElement {
    readonly children: UIElement[] = [];
    /** 盒内坐标（`calculate_xywh` 算的）。宽高会被 `set_wh` 拉齐 */
    readonly T: Rect = { x: 0, y: 0, w: 0, h: 0 };
    /** `role.offset`：相对盒子原点的位置，对齐会往上加 */
    readonly offset = { x: 0, y: 0 };
    /** `content_dimensions` */
    readonly content = { w: 0, h: 0 };
    /** `config.prev_value`：绑定值上次的样子，变了才重排 */
    prevValue: unknown;

    constructor(
        readonly box: UIBox,
        readonly parent: UIElement | null,
        readonly UIT: UITKind,
        readonly config: UIConfig,
    ) {}

    /** 在房间里的位置（tile） */
    get x(): number {
        return this.box.T.x + this.offset.x;
    }
    get y(): number {
        return this.box.T.y + this.offset.y;
    }

    /** `ui.lua:360` 的 `set_values`，只留布局与缺省颜色相关的部分 */
    setValues(t: Rect): void {
        this.T.x = t.x;
        this.T.y = t.y;
        this.T.w = t.w;
        this.T.h = t.h;
        this.offset.x = t.x;
        this.offset.y = t.y;
        if (this.config.ref_table && this.config.ref_value) {
            this.prevValue = this.config.ref_table[this.config.ref_value];
        }
        if (!this.config.colour) {
            this.config.colour =
                this.UIT === UIT.ROOT ? C.UI.BACKGROUND_DARK
                : this.UIT === UIT.T ? C.UI.TEXT_LIGHT
                : this.UIT === UIT.O ? C.WHITE
                : C.CLEAR;
        }
        if (!this.config.outline_colour) {
            // 原文 O 节点在这一支里改的是 colour 不是 outline_colour（`ui.lua:424`），照抄
            if (this.UIT === UIT.O) this.config.colour = C.UI.OUTLINE_LIGHT;
            else this.config.outline_colour = C.UI.OUTLINE_LIGHT;
        }
    }

    /** `ui.lua:576`：自己和所有后代一起挪 */
    align(x: number, y: number): void {
        this.offset.x += x;
        this.offset.y += y;
        for (const c of this.children) c.align(x, y);
    }

    /** `ui.lua:547`：行拉到最宽的兄弟那么宽、列拉到最高的兄弟那么高 */
    setWH(): [number, number] {
        const padding = this.config.padding ?? DEFAULT_PADDING;
        if (this.children.length === 0 || this.config.no_fill) return [this.T.w, this.T.h];
        let maxW = 0;
        let maxH = 0;
        for (const c of this.children) {
            const [cw, ch] = c.setWH();
            if (cw !== undefined && ch !== undefined) {
                if (cw > maxW) maxW = cw;
                if (ch > maxH) maxH = ch;
            } else {
                maxW = padding;
                maxH = padding;
            }
        }
        for (const c of this.children) {
            if (c.UIT === UIT.R) c.T.w = maxW;
            if (c.UIT === UIT.C) c.T.h = maxH;
        }
        return [this.T.w, this.T.h];
    }

    /** `ui.lua:586`：c 竖直居中、m 水平居中、b 贴底、r 贴右（t / l 是缺省，不动） */
    setAlignments(): void {
        for (const v of this.children) {
            const align = this.config.align;
            if (align) {
                const padding = this.config.padding ?? DEFAULT_PADDING;
                if (align.includes('c')) {
                    if (v.UIT === UIT.T || v.UIT === UIT.B || v.UIT === UIT.O) {
                        v.align(0, 0.5 * (this.T.h - 2 * padding - v.T.h));
                    } else {
                        v.align(0, 0.5 * (this.T.h - this.content.h));
                    }
                }
                if (align.includes('m')) v.align(0.5 * (this.T.w - this.content.w), 0);
                if (align.includes('b')) v.align(0, this.T.h - this.content.h);
                if (align.includes('r')) v.align(this.T.w - this.content.w, 0);
            }
            v.setAlignments();
        }
    }

    /** 深度优先，自己在前（`draw_self` 然后 `draw_children` 的顺序） */
    *walk(): Generator<UIElement> {
        yield this;
        for (const c of this.children) yield* c.walk();
    }
}

export type UIBoxConfig = {
    /** `config.align`：相对 major 怎么摆（c / m / t / b / l / r，i 表示贴内侧） */
    align?: string;
    offset?: { x: number; y: number };
    major?: Major;
    lr_clamp?: boolean;
    /** 房间宽度，`lr_clamp` 要用（`G.ROOM.T.w`） */
    roomW?: number;
};

export class UIBox implements Major {
    readonly T: Rect = { x: 0, y: 0, w: 1, h: 1 };
    readonly root: UIElement;
    /** `self.Mid`：对齐以它为准，缺省是根 */
    readonly mid: UIElement;
    /** `role.offset`：相对 major 的位置 */
    readonly offset = { x: 0, y: 0 };

    constructor(
        definition: UINodeDef,
        readonly config: UIBoxConfig = {},
        readonly funcs: UIFuncs = {},
    ) {
        let mid: UIElement | null = null;
        const build = (def: UINodeDef, parent: UIElement | null): UIElement => {
            const el = new UIElement(this, parent, def.n, { ...(def.config ?? {}) });
            // `ui.lua:246`：按钮的孩子指回按钮，孙子沿用孩子的
            if (parent?.config.button) el.config.button_UIE = parent;
            if (parent?.config.button_UIE) el.config.button_UIE = parent.config.button_UIE;
            if (def.config?.mid) mid = el;
            if (def.n === UIT.C || def.n === UIT.R || def.n === UIT.ROOT) {
                for (const child of def.nodes ?? []) if (child) el.children.push(build(child, el));
            }
            return el;
        };
        this.root = build(definition, null);
        this.mid = mid ?? this.root;

        this.calculateXYWH(this.root, this.T, false);
        this.T.w = this.root.T.w;
        this.T.h = this.root.T.h;
        this.root.setWH();
        this.root.setAlignments();
        this.alignToMajor();
        if (config.lr_clamp) this.lrClamp();
    }

    /** `ui.lua:118` */
    private calculateXYWH(node: UIElement, t: Rect, recalculate: boolean, scale?: number): [number, number] {
        const nt: Rect = { x: 0, y: 0, w: 0, h: 0 };
        const ct: Rect = { x: 0, y: 0, w: 0, h: 0 };
        const padding = node.config.padding ?? DEFAULT_PADDING;
        const cfg = node.config;

        if (node.UIT === UIT.B || node.UIT === UIT.T || node.UIT === UIT.O) {
            nt.x = t.x;
            nt.y = t.y;
            nt.w = cfg.w ?? cfg.object?.T.w ?? 0;
            nt.h = cfg.h ?? cfg.object?.T.h ?? 0;
            if (node.UIT === UIT.T) {
                const s = cfg.scale ?? 1;
                if (cfg.ref_table && cfg.ref_value) {
                    cfg.text = luaToString(cfg.ref_table[cfg.ref_value]);
                    if (cfg.func && !recalculate) this.funcs[cfg.func]?.(node);
                }
                if (cfg.text === undefined) cfg.text = '[UI ERROR]';
                const font = cfg.lang ?? EN_FONT;
                let tx = (fontWidth(cfg.text, font) * font.squish * s * font.FONTSCALE) / TILESIZE;
                let ty = (fontHeight(font) * s * font.FONTSCALE * font.TEXT_HEIGHT_SCALE) / TILESIZE;
                if (cfg.vert) [tx, ty] = [ty, tx];
                nt.w = tx;
                nt.h = ty;
                node.content.w = t.w;
                node.content.h = t.h;
            } else {
                node.content.w = nt.w;
                node.content.h = nt.h;
            }
            node.setValues(nt);
            return [nt.w, nt.h];
        }

        // 容器：一律当列来排（原注释）
        for (let pass = 1; pass <= 2; pass++) {
            const over = (cfg.maxw !== undefined && ct.w > cfg.maxw) || (cfg.maxh !== undefined && ct.h > cfg.maxh);
            if (pass === 2 && !over) continue;
            let fac = scale ?? 1;
            if (pass === 2) {
                const restriction = (cfg.maxw ?? cfg.maxh)!;
                fac = (fac * restriction) / (cfg.maxw !== undefined ? ct.w : ct.h);
            }
            nt.x = t.x;
            nt.y = t.y;
            nt.w = cfg.minw ?? 0;
            nt.h = cfg.minh ?? 0;
            if (node.UIT === UIT.ROOT) {
                nt.x = 0;
                nt.y = 0;
            }
            ct.x = nt.x + padding;
            ct.y = nt.y + padding;
            ct.w = 0;
            ct.h = 0;
            for (const v of node.children) {
                if (v.config.scale !== undefined) v.config.scale *= fac;
                const [tw, th] = this.calculateXYWH(v, ct, recalculate, fac);
                if (v.UIT === UIT.R) {
                    ct.h += th + padding;
                    ct.y += th + padding;
                    if (tw + padding > ct.w) ct.w = tw + padding;
                    if (v.config.emboss) {
                        ct.h += v.config.emboss;
                        ct.y += v.config.emboss;
                    }
                } else {
                    ct.w += tw + padding;
                    ct.x += tw + padding;
                    if (th + padding > ct.h) ct.h = th + padding;
                    if (v.config.emboss) ct.h += v.config.emboss;
                }
            }
        }
        node.content.w = ct.w + padding;
        node.content.h = ct.h + padding;
        nt.w = Math.max(ct.w + padding, nt.w);
        nt.h = Math.max(ct.h + padding, nt.h);
        node.setValues(nt);
        return [nt.w, nt.h];
    }

    /** `moveable.lua:114`（UIBox 只在建好时对齐一次） */
    private alignToMajor(): void {
        const major = this.config.major;
        const type = this.config.align ?? '';
        if (!major || type === '' || type === 'a') return;
        const off = this.config.offset ?? { x: 0, y: 0 };
        const has = (c: string) => type.includes(c);
        const inner = has('i');
        if (has('m')) this.offset.x = 0.5 * major.T.w - this.mid.T.w / 2 + off.x - this.mid.T.x + this.T.x;
        if (has('c')) this.offset.y = 0.5 * major.T.h - this.mid.T.h / 2 + off.y - this.mid.T.y + this.T.y;
        if (has('b')) this.offset.y = off.y + major.T.h - (inner ? this.T.h : 0);
        if (has('r')) this.offset.x = off.x + major.T.w - (inner ? this.T.w : 0);
        if (has('t')) this.offset.y = off.y - (inner ? 0 : this.T.h);
        if (has('l')) this.offset.x = off.x - (inner ? 0 : this.T.w);
        this.T.x = major.T.x + this.offset.x;
        this.T.y = major.T.y + this.offset.y;
    }

    /**
     * major 挪了，盒子跟着挪（强绑定的 `move_with_major`：`T = major.T + role.offset`，offset 在对齐时就定了）。
     * 例：手牌区上下滑动时，它身后的底框与「8/8」跟着走
     */
    followMajor(): void {
        const major = this.config.major;
        if (!major || !this.config.align || this.config.align === 'a') return;
        this.T.x = major.T.x + this.offset.x;
        this.T.y = major.T.y + this.offset.y;
    }

    /** `moveable.lua:322` */
    private lrClamp(): void {
        const roomW = this.config.roomW ?? 21;
        if (this.T.x < 0) this.T.x = 0;
        if (this.T.x + this.T.w > roomW) this.T.x = roomW - this.T.w;
    }

    /** `ui.lua:306`：重排（绑定的文字变长变短、DynaText 换了尺寸之后） */
    recalculate(): void {
        this.calculateXYWH(this.root, this.T, true);
        this.root.setWH();
        this.root.setAlignments();
        this.T.w = this.root.T.w;
        this.T.h = this.root.T.h;
    }

    /**
     * `ui.lua:617` 的 `update_text`：绑定的值变了就换文字，**字数变了才重排**（`no_recalc` 例外）。
     * 返回有没有重排。每帧调一次。
     */
    refresh(): boolean {
        let dirty = false;
        for (const el of this.root.walk()) {
            const cfg = el.config;
            if (el.UIT !== UIT.T || !cfg.ref_table || !cfg.ref_value) continue;
            const now = cfg.ref_table[cfg.ref_value];
            if (now === el.prevValue) continue;
            const text = luaToString(now);
            if (!cfg.no_recalc && el.prevValue !== undefined && luaToString(el.prevValue).length !== text.length) dirty = true;
            cfg.text = text;
            el.prevValue = now;
        }
        if (dirty) this.recalculate();
        return dirty;
    }

    /** `ui.lua:101` */
    getById(id: string): UIElement | null {
        for (const el of this.root.walk()) if (el.config.id === id) return el;
        return null;
    }
}

/** Lua（LuaJIT）的 `tostring`：数按 `%.14g`，整数值不带小数点 */
export function luaToString(v: unknown): string {
    if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(parseFloat(v.toPrecision(14)));
    return String(v);
}
