/**
 * UIBox 的 Phaser 绘制层（22 号票）。布局在 `src/ui/`（纯计算、对拍过 Lua 原作），这里只管画：
 * `ui.lua:663` 的 `draw_self`、`:866` 的 `draw_pixellated_rect`、`text.lua:236` 的 `DynaText:draw`。
 *
 * 单位换算：布局给的是 tile，世界坐标是 72 像素 / tile（`toPx`），原作画矩形时的顶点单位是
 * 1/TILESIZE tile（`love.graphics.scale(1/G.TILESIZE)` 之后画），这里记作 `U`。
 * 相机再把世界坐标按窗口缩放（`RunScene.applyRoomCamera`），所以这里不碰窗口像素。
 */
import { GameObjects, type Math as PMath, type Scene } from 'phaser';

import { BLIND_CENTERS } from '../core/blinds';
import { C, type Colour, darken } from '../ui/colours';
import type { HudBlind } from '../ui/definitions/hud-blind';
import type { BlindChipObject, TagSpriteObject } from '../ui/definitions/blind-select';
import type { ShopSignObject } from '../ui/definitions/shop';
import { DynaText } from '../ui/dynatext';
import type { SpriteObject } from '../ui/definitions/hud';
import { EN_FONT } from '../ui/font';
import { TILESIZE, UIT, UIBox, type UIElement } from '../ui/uibox';
import { TILE_W, toPx } from './coords';
import { Motion } from './moveable';

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

/** 字号跟着 `config.scale` 走：`func`（例如 `blind_chip_UI_scale`）会在建好之后改它 */
function syncFontPx(t: GameObjects.Text, fontPx: number): void {
    if (Number(t.style.fontSize.toString().replace('px', '')) === fontPx) return;
    t.setStyle({ fontSize: `${fontPx}px`, metrics: { ascent: fontPx * 0.75, descent: fontPx * 0.25, fontSize: fontPx } });
}

type ElementView = {
    el: UIElement;
    /** 按钮的命中区（只给定义里带 `button` 的元素建；点到按钮里的字也落在它上面） */
    zone?: GameObjects.Zone;
    hovered?: boolean;
    gfx?: GameObjects.Graphics;
    text?: { shadow: GameObjects.Text | null; main: GameObjects.Text };
    letters?: Array<{ shadow: GameObjects.Text | null; main: GameObjects.Text }>;
    image?: GameObjects.Image;
    /** 盲注筹码（`Blind` 的 `animatedSprite`）：阴影一张、本体一张 */
    blindChip?: { shadow: GameObjects.Image; main: GameObjects.Image };
    /** 精灵的阴影（`draw_steps` 里带 `shadow_height` 的那一步，标签有） */
    imageShadow?: GameObjects.Image;
    /** O 节点里装的 UIBox（选盲注卡）：它自己的一套视图，容器挂在这里 */
    child?: UIBoxView;
};

/** `game.lua:978`：`blind_chips` 图集每行 21 帧，`G.ANIMATION_FPS = 10`（`globals.lua:388`） */
const BLIND_CHIP_FRAMES = 21;
const ANIMATION_FPS = 10;

/** 一个 UIBox 的全部显示对象，按原作的绘制顺序（先自己、再孩子）建在一个 Container 里 */
export class UIBoxView {
    readonly container: GameObjects.Container;
    private views: ElementView[] = [];
    private resolution = 1;

    constructor(
        private readonly scene: Scene,
        readonly box: UIBox,
        depth: number,
        /** 按钮被点（`G.FUNCS[button]`）。按钮名照原作，如 `play_cards_from_highlighted` */
        private readonly onButton: (name: string, el: UIElement) => void = () => undefined,
    ) {
        this.container = scene.add.container(0, 0).setDepth(depth);
        this.build();
    }

    setVisible(on: boolean): void {
        this.container.setVisible(on);
    }

    destroy(): void {
        for (const v of this.views) v.child?.destroy();
        this.container.destroy();
    }

    /** 文字按相机缩放后的实际像素栅格化，不然放大后是糊的 */
    setResolution(r: number): void {
        this.resolution = r;
        for (const v of this.views) {
            for (const t of [v.text?.main, v.text?.shadow, ...(v.letters ?? []).flatMap((l) => [l.main, l.shadow])]) {
                t?.setResolution(r);
            }
            v.child?.setResolution(r);
        }
    }

    /** 建显示对象时盒子的 `version`；`add_child` 之后不一致就整个重建 */
    private builtVersion = -1;

    private build(): void {
        for (const v of this.views) v.child?.destroy();
        this.container.removeAll(true);
        this.views = [];
        this.viewOf.clear();
        this.builtVersion = this.box.version;
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
            } else if (el.UIT === UIT.O && cfg.object instanceof UIBox) {
                view.child = new UIBoxView(this.scene, cfg.object, 0, this.onButton);
                this.container.add(view.child.container);
            } else if (el.UIT === UIT.O && ['blind', 'blind_chip', 'shop_sign'].includes((cfg.object as { kind?: string } | undefined)?.kind ?? '')) {
                const tex = (cfg.object as unknown as { kind: string }).kind === 'shop_sign' ? 'shop_sign' : 'blind_chips';
                const shadow = this.scene.add.image(0, 0, tex, 0).setTint(0x000000).setAlpha(0.3);
                const main = this.scene.add.image(0, 0, tex, 0);
                this.container.add([shadow, main]);
                view.blindChip = { shadow, main };
            } else if (el.UIT === UIT.O && (cfg.object as SpriteObject | undefined)?.kind === 'sprite') {
                const sprite = cfg.object as SpriteObject;
                const frame = sprite.pos.y * this.atlasColumns(sprite.atlas) + sprite.pos.x;
                if ((sprite as TagSpriteObject).shadowHeight) {
                    view.imageShadow = this.scene.add.image(0, 0, sprite.atlas, frame).setTint(0x000000).setAlpha(0.3);
                    this.container.add(view.imageShadow);
                }
                view.image = this.scene.add.image(0, 0, sprite.atlas, frame).setOrigin(0, 0);
                this.container.add(view.image);
            } else if (el.UIT !== UIT.O) {
                view.gfx = this.scene.add.graphics();
                this.container.add(view.gfx);
            }
            if (cfg.button) {
                const zone = this.scene.add.zone(0, 0, 1, 1).setOrigin(0, 0).setInteractive({ useHandCursor: true });
                zone.on('pointerover', () => { view.hovered = true; });
                zone.on('pointerout', () => { view.hovered = false; });
                zone.on('pointerdown', () => this.box.click(el, this.scene.time.now / 1000, this.onButton));
                this.container.add(zone);
                view.zone = zone;
            }
            this.views.push(view);
            this.viewOf.set(el, view);
        }
        this.setResolution(this.resolution);
        this.orderDirty = true;
    }

    private viewOf = new Map<UIElement, ElementView>();
    /** 显示对象的先后要按当前的 `draw_after` 重排（`func` 会改它），或者新建了逐字的文字对象 */
    private orderDirty = false;
    private orderSig = '';

    /** 一个元素自己的显示对象，先画的在前 */
    private own(v: ElementView): GameObjects.GameObject[] {
        const out: Array<GameObjects.GameObject | null | undefined> = [
            v.gfx, v.imageShadow, v.image, v.blindChip?.shadow, v.blindChip?.main, v.text?.shadow, v.text?.main,
            ...(v.letters ?? []).flatMap((l) => [l.shadow, l.main]), v.child?.container, v.zone,
        ];
        return out.filter((o): o is GameObjects.GameObject => !!o);
    }

    /**
     * `ui.lua:536` 的 `draw_children`：带 `draw_after` 的元素**先画孩子再画自己**
     * （选盲注界面没轮到的卡就是这样盖上一层半透明灰的）
     */
    private reorder(): void {
        const sig = this.views.map((v) => (v.el.config.draw_after ? '1' : '0')).join('');
        if (!this.orderDirty && sig === this.orderSig) return;
        this.orderDirty = false;
        this.orderSig = sig;
        const list: GameObjects.GameObject[] = [];
        const visit = (el: UIElement) => {
            const v = this.viewOf.get(el)!;
            const after = !!el.config.draw_after;
            if (!after) list.push(...this.own(v));
            for (const c of el.children) visit(c);
            if (after) list.push(...this.own(v));
        };
        visit(this.box.root);
        const index = new Map(list.map((o, i) => [o, i] as const));
        this.container.list.sort((a, b) => (index.get(a) ?? 0) - (index.get(b) ?? 0));
    }

    private atlasColumns(key: string): number {
        const tex = this.scene.textures.get(key);
        const src = tex.getSourceImage() as { width: number };
        const f = tex.get(0);
        return Math.round(src.width / f.width);
    }

    /**
     * `ui.lua:677`：按钮（及其子孙）的分层视差。带阴影的一层比父层多往阴影反方向挪 `0.4·sp/TILESIZE`，
     * 所以按钮里带阴影的文字挪两层——实机截图上 Run Info 的字比布局位置偏左上约 6.8 像素就是这个。
     * 不是按钮的元素恒为 0。按下时的回弹（`last_clicked`）还没做。
     */
    private layeredParallax = new Map<UIElement, { x: number; y: number }>();

    /** 按下中的按钮：阴影不再错开（`parallax_dist = 0`），整体缩到 0.985 */
    private pressed = new Set<UIElement>();

    private computeLayeredParallax(now: number): void {
        this.layeredParallax.clear();
        this.pressed.clear();
        const pointerDown = this.scene.input.activePointer.isDown;
        const hovered = new Set(this.views.filter((v) => v.hovered).map((v) => v.el));
        for (const el of this.box.root.walk()) {
            const cfg = el.config;
            if (!cfg.button && !cfg.button_UIE) {
                this.layeredParallax.set(el, { x: 0, y: 0 });
                continue;
            }
            const parent = el.parent ? this.layeredParallax.get(el.parent)! : { x: 0, y: 0 };
            const sp = shadowParallax(el.x, el.T.w);
            const lp = {
                x: parent.x + (cfg.shadow ? 0.4 * sp.x : 0) / TILESIZE,
                y: parent.y + (cfg.shadow ? 0.4 * sp.y : 0) / TILESIZE,
            };
            // `ui.lua:681`：刚点过（0.1 秒内），或悬停且按着——往阴影方向压下去
            if (cfg.button && (now - el.lastClicked < 0.1 || (hovered.has(el) && pointerDown))) {
                lp.x -= (1.5 * sp.x) / TILESIZE;
                lp.y -= (1.5 * sp.y) / TILESIZE;
                this.pressed.add(el);
            }
            this.layeredParallax.set(el, lp);
        }
    }

    /** 每帧：同步绑定值、必要时重排，再按当前布局画一遍 */
    /**
     * 界面的滑入 / 滑出（`bond = 'Weak'` 的 UIBox 靠 `move_xy` 的弹簧追 `role.offset`）。布局里的位置 `T` 恒是终点，
     * 画的时候整块挪 `VT − T`：`slideFrom(dy)` 让它从终点下方（或上方）`dy` tile 处滑回来
     */
    private slide: Motion | null = null;
    /** 跟着另一块一起滑（挂在它上面的角标、Cash Out 按钮） */
    private slideLeader: UIBoxView | null = null;
    private lastT = -1;

    slideFrom(dy: number, dx = 0): this {
        this.slide = new Motion({ x: 0, y: 0, r: 0, scale: 1 });
        this.slide.VT.x = dx;
        this.slide.VT.y = dy;
        this.applySlide();
        return this;
    }

    /** 往 `dy` 处滑走（终点换成 `dy`，`T` 不动）。滑出去之后由调用方销毁 */
    slideTo(dy: number): this {
        this.slide ??= new Motion({ x: 0, y: 0, r: 0, scale: 1 });
        this.slide.T.y = dy;
        return this;
    }

    followSlide(leader: UIBoxView): this {
        this.slideLeader = leader;
        this.applySlide();
        return this;
    }

    /** 当前画的位置相对布局位置挪了多少（tile）。画在 UIBox 之外但跟着它走的东西（商店的卡、开包的卡）要加上它 */
    get slideOffset(): { x: number; y: number } {
        if (this.slideLeader) return this.slideLeader.slideOffset;
        return this.slide ? { x: this.slide.VT.x, y: this.slide.VT.y } : { x: 0, y: 0 };
    }

    /** 滑完了没有（终点就是布局位置） */
    get settled(): boolean {
        const s = this.slide;
        return !s || (s.VT.x === s.T.x && s.VT.y === s.T.y);
    }

    private applySlide(): void {
        const o = this.slideOffset;
        this.container.setPosition(toPx(o.x), toPx(o.y));
    }

    update(timeSeconds: number): void {
        const dt = this.lastT < 0 ? 0 : timeSeconds - this.lastT;
        this.lastT = timeSeconds;
        if (this.slide && dt > 0) this.slide.step(dt, timeSeconds);
        this.applySlide();
        if (this.box.version !== this.builtVersion) this.build();
        this.box.followMajor();
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
        this.box.runFuncs();
        this.computeLayeredParallax(timeSeconds);
        for (const v of this.views) this.draw(v, timeSeconds);
        this.reorder();
    }

    private draw(v: ElementView, t: number): void {
        const el = v.el;
        const cfg = el.config;
        const colour = cfg.colour!;
        const w = el.T.w;
        const h = el.T.h;
        // 阴影视差按元素自己的布局位置算（`calculate_parrallax` 读 T），分层视差只挪画的位置（`prep_draw`）
        const sp = shadowParallax(el.x, w);
        const lp = this.layeredParallax.get(el) ?? { x: 0, y: 0 };
        const x = el.x + lp.x;
        const y = el.y + lp.y;

        if (v.zone) {
            v.zone.setPosition(toPx(x), toPx(y)).setSize(toPx(w), toPx(h));
            v.zone.input!.hitArea.setTo(0, 0, toPx(w), toPx(h));
        }

        if (v.gfx) {
            const g = v.gfx.clear();
            if (colour[3] <= 0.01 && !cfg.outline) return;
            g.setPosition(toPx(x), toPx(y));
            const pixel = cfg.r !== undefined && w > 0.01;
            const pressed = this.pressed.has(el);
            const parallax = pressed ? 0 : 1.5;
            // 所属按钮悬停着（触屏上要按着）或 0.1 秒内点过：叠一层 `G.C.UI.HOVER`
            const btn = cfg.button_UIE ?? el;
            const btnView = this.views.find((w2) => w2.el === btn);
            const hover = !!btn.config.hover && ((!!btnView?.hovered && this.scene.input.activePointer.isDown)
                || t - btn.lastClicked < 0.1);
            g.setScale(pressed ? 0.985 : 1);
            if (colour[3] <= 0.01) {
                this.drawOutline(g, el, w, h, sp, hover);
                return;
            }
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
                const em = darken(colour, hover ? 0.5 : 0.3);
                g.fillStyle(rgb(em), em[3]);
                if (pixel) g.fillPoints(pts(pixellatedRect(w, h, cfg.res, cfg.ext_up).map((p) => ({ x: p.x * U, y: (p.y + cfg.emboss! * TILESIZE) * U }))), true);
            }
            for (const c of hover ? [colour, C.UI.HOVER] : [colour]) {
                g.fillStyle(rgb(c), c[3]);
                if (pixel) g.fillPoints(pts(pixellatedRect(w, h, cfg.res, cfg.ext_up).map((p) => ({ x: p.x * U, y: p.y * U }))), true);
                else g.fillRect(0, 0, toPx(w), toPx(h));
            }
            this.drawOutline(g, el, w, h, sp, hover);
            // `ui.lua:847`：单选组里被选中的那个（标签页按钮）头上一个上下跳的红三角（`get_chosen_triangle_from_rect`）
            if (cfg.chosen) {
                const bob = Math.min(0.6 * Math.sin(t * 9) * 2 + 0.2, 0);
                const W = w * TILESIZE;
                const tri = (ox: number, oy: number) => pts([
                    { x: (W / 2 - 3 + ox) * U, y: (-8 + bob + oy) * U },
                    { x: (W / 2 + ox) * U, y: (-2.2 + bob + oy) * U },
                    { x: (W / 2 + 3 + ox) * U, y: (-8 + bob + oy) * U },
                ]);
                if (cfg.shadow && SHADOWS_ON) {
                    g.fillStyle(0x000000, 0.3 * colour[3]);
                    g.fillPoints(tri(-sp.x * parallax * 0.5, -sp.y * parallax * 0.5), true);
                }
                g.fillStyle(rgb(C.RED), 1);
                g.fillPoints(tri(0, 0), true);
            }
            return;
        }

        if (v.text) {
            // `ui.lua:697`：按钮里的字（且按钮可用）无论 `shadow` 配没配都画阴影
            const button = cfg.button_UIE;
            const buttonActive = !button || !!button.config.button;
            if (v.text.shadow === null && button && buttonActive && SHADOWS_ON) {
                v.text.shadow = makeText(this.scene, toPx(cfg.scale ?? 1)).setResolution(this.resolution);
                this.container.addAt(v.text.shadow, this.container.getIndex(v.text.main));
            }
            const s = cfg.scale ?? 1;
            syncFontPx(v.text.main, toPx(s));
            if (v.text.shadow) syncFontPx(v.text.shadow, toPx(s));
            const text = cfg.text ?? '';
            const font = cfg.lang ?? EN_FONT;
            // `ui.lua:721`：行框左上角在 (x + TEXT_OFFSET.x·s·FONTSCALE/TILESIZE, y + TEXT_OFFSET.y·…)
            const ox = (font.TEXT_OFFSET.x * s * font.FONTSCALE) / TILESIZE;
            const oy = (font.TEXT_OFFSET.y * s * font.FONTSCALE) / TILESIZE;
            // `ui.lua:716`：按钮不可用（`button` 被 `can_*` 摘掉了）时字变灰
            const shown = buttonActive ? colour : C.UI.TEXT_INACTIVE;
            if (cfg.vert) {
                // `ui.lua:715`：先平移 (0, h) 再转 −90°，字的局部 (ox, oy) 落到 (x + oy, y + h − ox)
                v.text.main.setText(text).setColor(css(shown)).setAlpha(shown[3]).setRotation(-Math.PI / 2).setPosition(toPx(x + oy), toPx(y + h - ox));
                v.text.shadow?.setVisible(false);
                return;
            }
            v.text.main.setText(text).setColor(css(shown)).setAlpha(shown[3]).setPosition(toPx(x + ox), toPx(y + oy));
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

        // O 节点里的对象自己是 Moveable，`prep_draw` 读的是它自己的 `layered_parallax`（恒 0），不吃按钮视差
        if (v.letters && cfg.object instanceof DynaText) {
            const before = v.letters.length;
            this.drawDynaText(v, cfg.object, el.x, el.y, t);
            if (v.letters.length !== before) this.orderDirty = true;
        }
        if (v.image) v.image.setPosition(toPx(el.x), toPx(el.y)).setDisplaySize(toPx(w), toPx(h));
        if (v.imageShadow) {
            // `sprite.lua:76`：往视差反方向错开 `shadow_height`、缩到 `1 − 0.2·shadow_height`（以中心）
            const hgt = (cfg.object as TagSpriteObject).shadowHeight;
            const k = 1 - 0.2 * hgt;
            v.imageShadow.setPosition(toPx(el.x + w / 2 - sp.x * hgt), toPx(el.y + h / 2 - sp.y * hgt)).setDisplaySize(toPx(w) * k, toPx(h) * k);
        }
        if (v.blindChip) {
            const obj = cfg.object as HudBlind | BlindChipObject | ShopSignObject;
            if (obj.kind === 'blind') {
                const center = obj.key ? BLIND_CENTERS[obj.key] : undefined;
                this.drawBlindChip(v.blindChip, center?.pos ?? null, el.x, el.y, w, h, t, 0.1, true);
            } else if (obj.kind === 'shop_sign') {
                // `game.lua:979`：`shop_sign` 图集一行 4 帧
                this.drawBlindChip(v.blindChip, { x: 0, y: 0 }, el.x, el.y, w, h, t, obj.shadowHeight, false, 4);
            } else this.drawBlindChip(v.blindChip, obj.pos, el.x, el.y, w, h, t, obj.shadowHeight, false);
        }
        if (v.child) v.child.update(t);
    }

    /**
     * `ui.lua:799`：描边。线宽单位与顶点一样是 1/TILESIZE tile。`line_emboss` 先画一圈暗三成的、
     * 往阴影方向错开的描边（y 错 `−emboss·sp.y`、x 错 `−0.7·emboss·sp.x`），再画本色描边
     */
    private drawOutline(g: GameObjects.Graphics, el: UIElement, w: number, h: number, sp: { x: number; y: number }, hover: boolean): void {
        const cfg = el.config;
        const oc = cfg.outline_colour;
        if (!cfg.outline || !oc || oc[3] <= 0.01) return;
        const ring = pixellatedRect(w, h, cfg.res, cfg.ext_up);
        if (cfg.line_emboss) {
            const em = darken(oc, hover ? 0.5 : 0.3);
            const dx = -0.7 * cfg.line_emboss * sp.x;
            const dy = -cfg.line_emboss * sp.y;
            g.lineStyle(cfg.outline * U, rgb(em), em[3]);
            g.strokePoints(pts(ring.map((p) => ({ x: (p.x + dx) * U, y: (p.y + dy) * U }))), true, true);
        }
        g.lineStyle(cfg.outline * U, rgb(oc), oc[3]);
        g.strokePoints(pts(ring.map((p) => ({ x: p.x * U, y: p.y * U }))), true, true);
    }

    /**
     * 盲注筹码：`blind.lua:446` 的 `Blind:draw`（左上面板，阴影高 0.1、`Blind:align` 的 ±0.02 弧度摆动）
     * 与选盲注卡里的 `AnimatedSprite`（阴影高 0.05、不摆）。阴影往视差反方向错开 `shadow_height`、
     * 缩到 `1 − 0.2·shadow_height`（`sprite.lua:76`）。帧 = `floor(10·t) % 21`（`AnimatedSprite:animate`）。
     * `pos` 为空（没有盲注）时不画
     */
    private drawBlindChip(chip: { shadow: GameObjects.Image; main: GameObjects.Image }, pos: { x: number; y: number } | null, x: number, y: number, w: number, h: number, t: number, shadowHeight: number, sway: boolean, frames = BLIND_CHIP_FRAMES): void {
        chip.main.setVisible(!!pos);
        chip.shadow.setVisible(!!pos);
        if (!pos) return;
        const frame = pos.y * frames + (Math.floor(ANIMATION_FPS * t) % frames);
        const r = sway ? 0.02 * Math.sin(2 * t + x) : 0;
        const sp = shadowParallax(x, w);
        const cx = x + w / 2;
        const cy = y + h / 2;
        const k = 1 - 0.2 * shadowHeight;
        chip.main.setFrame(frame).setPosition(toPx(cx), toPx(cy)).setDisplaySize(toPx(w), toPx(h)).setRotation(r);
        chip.shadow.setFrame(frame).setPosition(toPx(cx - sp.x * shadowHeight), toPx(cy - sp.y * shadowHeight))
            .setDisplaySize(toPx(w) * k, toPx(h) * k).setRotation(r);
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
            x: x + ((d.font.TEXT_OFFSET.x * d.scale + (d.config.x_offset ?? 0)) * fs) / TILESIZE + ((d.config.spacing ?? 0) * fs) / TILESIZE,
            y: y + ((d.font.TEXT_OFFSET.y * d.scale + (d.config.y_offset ?? 0)) * fs) / TILESIZE,
        };
        const colours = d.colours;
        const sqrtS = Math.sqrt(d.scale);
        const px = (d.font.renderScale / (TILESIZE * 10)) * 7;
        let cursor = 0;
        const R = d.config.text_rot ?? 0;
        const rcx = x + d.T.w / 2;
        const rcy = y + d.T.h / 2;
        d.letters.forEach((letter, k0) => {
            const k = k0 + 1;
            // `text.lua:187` 起的逐字动画（旋转 / 漂浮 / 弹跳）
            let rl = 0;
            if (d.config.rotate) rl = (d.config.rotate === 2 ? -1 : 1) * (0.2 * (-n / 2 - 0.5 + k) / n + 0.02 * Math.sin(2 * t + k));
            let offY = 0;
            if (d.config.float) offY = sqrtS * px * 1.5 * Math.sin(2.666 * t + 200 * k);
            if (d.config.bump) {
                const rate = d.config.bump_rate ?? 2.666;
                offY = (d.config.bump_amount ?? 1) * sqrtS * px * Math.max(0, (5 + rate) * Math.sin(rate * t + 200 * k) - 3 - rate);
            }

            const cx = base.x + cursor + (0.5 * letter.dims.x * fs) / TILESIZE;
            const cy = base.y + (0.5 * (letter.dims.y - offY) * fs) / TILESIZE;
            // 字形在自己字体像素里的原点：格子中心（`0.5*dims/scale`）
            const oxFont = (0.5 * letter.dims.x) / d.scale;
            const oyFont = (0.5 * letter.dims.y) / d.scale;
            const colour = letter.colour ?? colours[k % colours.length] ?? colours[0]!;
            const l = letters[k0]!;
            // 字体像素 → 世界像素：字号 toPx(scale) 对应 renderScale
            const fontToWorld = toPx(d.scale) / d.font.renderScale;
            const place = (txt: GameObjects.Text, ax0: number, ay0: number) => {
                // `text_rot`：整串绕 DynaText 的中心转（`prep_draw` 按 `T.r` 旋转）
                const ax = R ? rcx + (ax0 - rcx) * Math.cos(R) - (ay0 - rcy) * Math.sin(R) : ax0;
                const ay = R ? rcy + (ax0 - rcx) * Math.sin(R) + (ay0 - rcy) * Math.cos(R) : ay0;
                const r = rl + R;
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
