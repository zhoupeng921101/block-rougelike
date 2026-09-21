/**
 * UIBox 的 Phaser 绘制层（22 号票）。布局在 `src/ui/`（纯计算、对拍过 Lua 原作），这里只管画：
 * `ui.lua:663` 的 `draw_self`、`:866` 的 `draw_pixellated_rect`、`text.lua:236` 的 `DynaText:draw`。
 *
 * 单位换算：布局给的是 tile，世界坐标是 72 像素 / tile（`toPx`），原作画矩形时的顶点单位是
 * 1/TILESIZE tile（`love.graphics.scale(1/G.TILESIZE)` 之后画），这里记作 `U`。
 * 相机再把世界坐标按窗口缩放（`RunScene.applyRoomCamera`），所以这里不碰窗口像素。
 */
import { GameObjects, type Math as PMath, type Scene } from 'phaser';

import { type Colour, darken } from '../ui/colours';
import { DynaText } from '../ui/dynatext';
import type { SpriteObject } from '../ui/definitions/hud';
import { EN_FONT } from '../ui/font';
import { TILESIZE, UIT, type UIBox, type UIElement } from '../ui/uibox';
import { TILE_W, toPx } from './coords';

/** 世界像素 / 原作画矩形时的顶点单位（1/TILESIZE tile） */
const U = toPx(1) / TILESIZE;
/** 纯观感：原作设置里的「阴影」开关，缺省开 */
const SHADOWS_ON = true;
export const UI_FONT_FAMILY = 'm6x11plus';

/** `fillPoints` 的类型要 `Vector2[]`，实际只读 x / y */
const pts = (p: Array<{ x: number; y: number }>) => p as unknown as PMath.Vector2[];

const rgb = (c: Colour) => (Math.round(c[0] * 255) << 16) | (Math.round(c[1] * 255) << 8) | Math.round(c[2] * 255);

/** `moveable.lua:459`：阴影往远离屏幕中线的方向偏，y 恒为 -1.5 */
function shadowParallax(x: number, w: number): { x: number; y: number } {
    return { x: ((x + w / 2 - TILE_W / 2) / (TILE_W / 2)) * 1.5, y: -1.5 };
}

/**
 * `ui.lua:866` 的顶点表（不含开头那个扇心——Phaser 的 `fillPoints` 自己三角化）。单位 U，原点在元素左上角。
 * 四个角是三级台阶，台阶大小 `res` 按元素尺寸取 0.8 / 0.6 / 0.15。
 */
export function pixellatedRect(w: number, h: number, res?: number, extUp = 0): Array<{ x: number; y: number }> {
    const ext = extUp * TILESIZE;
    const m = Math.min(w, h + Math.abs(ext) / TILESIZE);
    const r = res ?? (m > 3.5 ? 0.8 : m > 0.3 ? 0.6 : 0.15);
    const totw = w * TILESIZE;
    const toth = (h + Math.abs(ext) / TILESIZE) * TILESIZE;
    const subw = totw - 4 * r;
    const subh = toth - 4 * r;
    const v: Array<[number, number]> = [
        [0, 4 * r], [1 * r, 4 * r], [1 * r, 2 * r], [2 * r, 2 * r], [2 * r, 1 * r], [4 * r, 1 * r], [4 * r, 0],
        [subw, 0], [subw, 1 * r], [subw + 2 * r, 1 * r], [subw + 2 * r, 2 * r], [subw + 3 * r, 2 * r], [subw + 3 * r, 4 * r],
        [totw, 4 * r], [totw, subh], [subw + 3 * r, subh], [subw + 3 * r, subh + 2 * r], [subw + 2 * r, subh + 2 * r],
        [subw + 2 * r, subh + 3 * r], [subw, subh + 3 * r], [subw, toth], [4 * r, toth], [4 * r, subh + 3 * r],
        [2 * r, subh + 3 * r], [2 * r, subh + 2 * r], [1 * r, subh + 2 * r], [1 * r, subh], [0, subh],
    ];
    return v.map(([x, y]) => ({ x, y: y - ext }));
}

/** 固定度量的文字：行框高 = 字号，基线在 0.75 字号处（m6x11plus 的 ascent 768/1024） */
function makeText(scene: Scene, fontPx: number): GameObjects.Text {
    return scene.add.text(0, 0, '', {
        fontFamily: UI_FONT_FAMILY,
        fontSize: `${fontPx}px`,
        color: '#ffffff',
        metrics: { ascent: fontPx * 0.75, descent: fontPx * 0.25, fontSize: fontPx },
    });
}

type ElementView = {
    el: UIElement;
    gfx?: GameObjects.Graphics;
    text?: { shadow: GameObjects.Text | null; main: GameObjects.Text };
    letters?: Array<{ shadow: GameObjects.Text | null; main: GameObjects.Text }>;
    image?: GameObjects.Image;
};

/** 一个 UIBox 的全部显示对象，按原作的绘制顺序（先自己、再孩子）建在一个 Container 里 */
export class UIBoxView {
    readonly container: GameObjects.Container;
    private views: ElementView[] = [];
    private resolution = 1;

    constructor(
        private readonly scene: Scene,
        readonly box: UIBox,
        depth: number,
    ) {
        this.container = scene.add.container(0, 0).setDepth(depth);
        this.build();
    }

    /** 文字按相机缩放后的实际像素栅格化，不然放大后是糊的 */
    setResolution(r: number): void {
        this.resolution = r;
        for (const v of this.views) {
            for (const t of [v.text?.main, v.text?.shadow, ...(v.letters ?? []).flatMap((l) => [l.main, l.shadow])]) {
                t?.setResolution(r);
            }
        }
    }

    private build(): void {
        this.container.removeAll(true);
        this.views = [];
        for (const el of this.box.root.walk()) {
            const view: ElementView = { el };
            const cfg = el.config;
            if (el.UIT === UIT.T) {
                const px = toPx(cfg.scale ?? 1);
                view.text = {
                    shadow: cfg.shadow && SHADOWS_ON ? makeText(this.scene, px) : null,
                    main: makeText(this.scene, px),
                };
                if (view.text.shadow) this.container.add(view.text.shadow);
                this.container.add(view.text.main);
            } else if (el.UIT === UIT.O && cfg.object instanceof DynaText) {
                view.letters = [];
            } else if (el.UIT === UIT.O && (cfg.object as SpriteObject | undefined)?.kind === 'sprite') {
                const sprite = cfg.object as SpriteObject;
                const frame = sprite.pos.y * this.atlasColumns(sprite.atlas) + sprite.pos.x;
                view.image = this.scene.add.image(0, 0, sprite.atlas, frame).setOrigin(0, 0);
                this.container.add(view.image);
            } else if (el.UIT !== UIT.O) {
                view.gfx = this.scene.add.graphics();
                this.container.add(view.gfx);
            }
            this.views.push(view);
        }
        this.setResolution(this.resolution);
    }

    private atlasColumns(key: string): number {
        const tex = this.scene.textures.get(key);
        const src = tex.getSourceImage() as { width: number };
        const f = tex.get(0);
        return Math.round(src.width / f.width);
    }

    /** 每帧：同步绑定值、必要时重排，再按当前布局画一遍 */
    update(timeSeconds: number): void {
        let resized = false;
        for (const el of this.box.root.walk()) {
            const obj = el.config.object;
            if (obj instanceof DynaText) {
                obj.update();
                if (obj.resized) {
                    obj.resized = false;
                    resized = true;
                }
            }
        }
        if (this.box.refresh() || resized) {
            if (resized) this.box.recalculate();
        }
        for (const v of this.views) this.draw(v, timeSeconds);
    }

    private draw(v: ElementView, t: number): void {
        const el = v.el;
        const cfg = el.config;
        const colour = cfg.colour!;
        const x = el.x;
        const y = el.y;
        const w = el.T.w;
        const h = el.T.h;
        const sp = shadowParallax(x, w);

        if (v.gfx) {
            const g = v.gfx.clear();
            if (colour[3] <= 0.01) return;
            g.setPosition(toPx(x), toPx(y));
            const pixel = cfg.r !== undefined && w > 0.01;
            const parallax = 1.5;
            // 阴影：原点在左上角时整体 ×0.98，再往远离中线的方向错开
            if (cfg.shadow && SHADOWS_ON) {
                const shadow = cfg.shadow_colour ?? ([0, 0, 0, 0.3 * colour[3]] as Colour);
                g.fillStyle(rgb(shadow), shadow[3]);
                const dx = -sp.x * parallax;
                const dy = -sp.y * parallax;
                if (pixel) g.fillPoints(pts(pixellatedRect(w, h, cfg.res, cfg.ext_up).map((p) => ({ x: (p.x + dx) * 0.98 * U, y: (p.y + dy) * 0.98 * U }))), true);
                else g.fillRect(dx * 0.98 * U, dy * 0.98 * U, w * TILESIZE * 0.98 * U, h * TILESIZE * 0.98 * U);
            }
            // 压花：往下错开 emboss，暗三成（悬停时暗五成）
            if (cfg.emboss) {
                const em = darken(colour, 0.3);
                g.fillStyle(rgb(em), em[3]);
                if (pixel) g.fillPoints(pts(pixellatedRect(w, h, cfg.res, cfg.ext_up).map((p) => ({ x: p.x * U, y: (p.y + cfg.emboss! * TILESIZE) * U }))), true);
            }
            g.fillStyle(rgb(colour), colour[3]);
            if (pixel) g.fillPoints(pts(pixellatedRect(w, h, cfg.res, cfg.ext_up).map((p) => ({ x: p.x * U, y: p.y * U }))), true);
            else g.fillRect(0, 0, toPx(w), toPx(h));
            return;
        }

        if (v.text) {
            const s = cfg.scale ?? 1;
            const text = cfg.text ?? '';
            const font = cfg.lang ?? EN_FONT;
            // `ui.lua:721`：行框左上角在 (x + TEXT_OFFSET.x·s·FONTSCALE/TILESIZE, y + TEXT_OFFSET.y·…)
            const ox = (font.TEXT_OFFSET.x * s * font.FONTSCALE) / TILESIZE;
            const oy = (font.TEXT_OFFSET.y * s * font.FONTSCALE) / TILESIZE;
            v.text.main.setText(text).setColor(css(colour)).setAlpha(colour[3]).setPosition(toPx(x + ox), toPx(y + oy));
            if (v.text.shadow) {
                // 阴影按 0.97 以元素中心缩放，再偏 (-sp.x·0.5, -sp.y·0.5)/TILESIZE
                const k = 0.97;
                const cx = x + w / 2;
                const cy = y + h / 2;
                const sx = cx - (k * w) / 2 + k * (ox + (-sp.x * 0.5) / TILESIZE);
                const sy = cy - (k * h) / 2 + k * (oy + (-sp.y * 0.5) / TILESIZE);
                v.text.shadow.setText(text).setColor('#000000').setAlpha(0.3 * colour[3]).setScale(k).setPosition(toPx(sx), toPx(sy));
            }
            return;
        }

        if (v.letters && cfg.object instanceof DynaText) this.drawDynaText(v, cfg.object, x, y, t);
        if (v.image) v.image.setPosition(toPx(x), toPx(y)).setDisplaySize(toPx(w), toPx(h));
    }

    /** `text.lua:236` 的 `DynaText:draw`：逐字画，每个字以自己的格子中心为原点缩放、旋转 */
    private drawDynaText(v: ElementView, d: DynaText, x: number, y: number, t: number): void {
        const letters = v.letters!;
        const fs = d.font.FONTSCALE;
        const n = d.letters.length;
        while (letters.length < n) {
            const px = toPx(d.scale);
            const shadow = d.config.shadow ? makeText(this.scene, px) : null;
            const main = makeText(this.scene, px);
            if (shadow) this.container.add(shadow);
            this.container.add(main);
            shadow?.setResolution(this.resolution);
            main.setResolution(this.resolution);
            letters.push({ shadow, main });
        }
        letters.forEach((l, i) => {
            const on = i < n;
            l.main.setVisible(on);
            l.shadow?.setVisible(on);
        });

        const sp = shadowParallax(x, d.T.w);
        const norm = Math.hypot(sp.x, sp.y);
        const shadowNorm = { x: ((sp.x / norm) * fs) / TILESIZE, y: ((sp.y / norm) * fs) / TILESIZE };
        const base = {
            x: x + (d.font.TEXT_OFFSET.x * d.scale * fs) / TILESIZE + ((d.config.spacing ?? 0) * fs) / TILESIZE,
            y: y + (d.font.TEXT_OFFSET.y * d.scale * fs) / TILESIZE,
        };
        const colours = d.colours;
        const sqrtS = Math.sqrt(d.scale);
        const px = (d.font.renderScale / (TILESIZE * 10)) * 7;
        let cursor = 0;
        d.letters.forEach((letter, k0) => {
            const k = k0 + 1;
            // `text.lua:187` 起的逐字动画（旋转 / 漂浮 / 弹跳）
            let r = 0;
            if (d.config.rotate) r = (d.config.rotate === 2 ? -1 : 1) * (0.2 * (-n / 2 - 0.5 + k) / n + 0.02 * Math.sin(2 * t + k));
            let offY = 0;
            if (d.config.float) offY = sqrtS * px * 1.5 * Math.sin(2.666 * t + 200 * k);
            if (d.config.bump) offY = sqrtS * px * Math.max(0, (5 + 2.666) * Math.sin(2.666 * t + 200 * k) - 3 - 2.666);

            const cx = base.x + cursor + (0.5 * letter.dims.x * fs) / TILESIZE;
            const cy = base.y + (0.5 * (letter.dims.y - offY) * fs) / TILESIZE;
            // 字形在自己字体像素里的原点：格子中心（`0.5*dims/scale`）
            const oxFont = (0.5 * letter.dims.x) / d.scale;
            const oyFont = (0.5 * letter.dims.y) / d.scale;
            const colour = colours[k % colours.length] ?? colours[0]!;
            const l = letters[k0]!;
            // 字体像素 → 世界像素：字号 toPx(scale) 对应 renderScale
            const fontToWorld = toPx(d.scale) / d.font.renderScale;
            const place = (txt: GameObjects.Text, ax: number, ay: number) => {
                txt.setText(letter.char)
                    .setOrigin(0, 0)
                    .setRotation(r)
                    .setPosition(
                        toPx(ax) - (oxFont * Math.cos(r) - oyFont * Math.sin(r)) * fontToWorld,
                        toPx(ay) - (oxFont * Math.sin(r) + oyFont * Math.cos(r)) * fontToWorld,
                    );
            };
            if (l.shadow) {
                place(l.shadow, cx - (sp.x * d.scale) / TILESIZE, base.y + (0.5 * letter.dims.y * fs) / TILESIZE - (sp.y * d.scale) / TILESIZE);
                l.shadow.setColor('#000000').setAlpha(0.3 * (colours[0]![3]));
            }
            place(l.main, cx + shadowNorm.x, cy + shadowNorm.y);
            l.main.setColor(css(colour)).setAlpha(colour[3]);
            cursor += (letter.dims.x * fs) / TILESIZE;
        });
    }
}

function css(c: Colour): string {
    return `#${rgb(c).toString(16).padStart(6, '0')}`;
}
