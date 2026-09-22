/**
 * 主菜单的画面（22 号票第四十七步）：`Game:main_menu`（`game.lua:1664`）与 `set_main_menu_UI`（`common_events.lua:756`）。
 *
 * - 背景：`splash` shader（红蓝旋涡），`G.TIMERS.REAL` 进主菜单时拨到 12（从 splash 进来的除外），`REAL_SHADER` 开了 Reduced Motion 恒 300
 * - `G.title_top`：一格宽的 `title` 区，摆在房间正中偏上 1.2（`set_screen_positions`）；里面一张 1.32 倍的黑桃 A（`replace_card`），
 *   `start_materialize({WHITE, WHITE}, nil, 1.2)` 溶进来
 * - `G.SPLASH_LOGO`：`balatro` 图 13·1.1 宽，`cm` 钉在 `title_top` 上，走 `dissolve` shader，`dissolve` 从 1 线性缓到 0
 * - 三块 UI：按钮 `bmi` 从下面 10 格滑上来、Profile `bli` 从左边 10 格滑进来（下一帧才建）、版本号 `tri`
 *
 * 各事件的时刻按 `change_context`：页面直接打开是 `nil`（原作 `skip_splash` 的那条路），局里点 Main Menu 回来是 `'game'`。
 * 这些事件都是 `blockable = false, blocking = false`，从进主菜单那一刻并行计时。
 *
 * 不做的：`j_blueprint` 解锁之后 4 秒把 A 换成随机一张未解锁的小丑 / 优惠券（新档没解锁 Blueprint，走不到）；
 * 收藏按钮上的「!」（`set_alerts`，新档里 `j_joker` / `c_base` 都是 `start_alerted`，没有要提醒的）。
 */
import type { GameObjects, Scene } from 'phaser';

import type { AtlasSpec } from '../core/atlas';
import { C, type Colour } from '../ui/colours';
import { mainMenuButtons, profileButton, versionBox } from '../ui/definitions/main-menu';
import { UIBox, type UIElement } from '../ui/uibox';
import { alignTitle, cardShadowParallaxX } from './align-cards';
import { playEnter } from './card-exit';
import { CARD_H, CARD_W, TILE_H, TILE_W, toPx } from './coords';
import { MiniCard } from './mini-card';
import { SETTINGS } from './settings';
import { type DissolveState, cardTimeOf, makeShaderQuad } from './shader-quad';
import { SPLASH_FRAG } from './shaders/splash';
import { BACKGROUND_VERT } from './shaders/background';
import { UIBoxView } from './ui-draw';

/** `G.ASSET_ATLAS.balatro`（`game.lua:991`）：一整张 333×216 */
export const LOGO_ATLAS: AtlasSpec = { key: 'balatro', path: 'assets/textures/balatro.png', w: 333, h: 216, frameW: 333, frameH: 216 };

export type MenuContext = 'game' | null;

/** `SC_scale = 1.1`（`debug_splash_size_toggle` 关） */
const SC_SCALE = 1.1;

const ROOM = { T: { x: 0, y: 0, w: TILE_W, h: TILE_H } };

export class MainMenu {
    /** 全屏 `splash` 旋涡，由场景跟背景一样贴屏摆 */
    readonly splash: GameObjects.Shader;
    private readonly logo: GameObjects.Shader;
    private readonly logoDissolve: DissolveState = { amount: 1, colours: [C.WHITE, C.WHITE] };
    private readonly card: MiniCard;
    private readonly cardDissolve: DissolveState = { amount: 0, colours: [C.WHITE, C.WHITE] };
    /** `G.title_top`：`CARD_W × CARD_H`，房间水平居中、竖直居中再往上 1.2 */
    private readonly titleTop = { x: TILE_W / 2 - CARD_W / 2, y: TILE_H / 2 - CARD_H / 2 - 1.2, w: CARD_W, h: CARD_H };
    private readonly version: UIBoxView;
    private buttons: UIBoxView | null = null;
    private profile: UIBoxView | null = null;
    private readonly t0: number;
    private readonly fired = new Set<string>();
    private logoEase: { start: number; dur: number } | null = null;
    private cardX = 0;

    constructor(
        private readonly scene: Scene,
        private readonly context: MenuContext,
        private readonly onButton: (name: string, el: UIElement) => void,
        private resolution: number,
    ) {
        this.t0 = scene.time.now / 1000;
        this.splash = scene.add.shader(
            {
                name: 'splash',
                fragmentSource: SPLASH_FRAG,
                vertexSource: BACKGROUND_VERT,
                setupUniforms: (setUniform: (n: string, v: unknown) => void) => {
                    // `G.TIMERS.REAL` 进主菜单时拨到 12；`REAL_SHADER = reduced_motion and 300 or REAL`（`game.lua:2699`）
                    const real = 12 + scene.time.now / 1000 - this.t0;
                    setUniform('time', SETTINGS.reduced_motion ? 300 : real);
                    setUniform('vort_speed', 0.4);
                    setUniform('colour_1', C.RED);
                    setUniform('colour_2', C.BLUE);
                    setUniform('mid_flash', 0);
                    setUniform('vort_offset', 0);
                    setUniform('uScreenSize', [scene.scale.width, scene.scale.height]);
                },
            },
            0, 0, 1, 1,
            [],
        );
        this.splash.setDepth(-1000);

        const logoW = 13 * SC_SCALE;
        const logoH = logoW * (LOGO_ATLAS.h / LOGO_ATLAS.w);
        this.logo = makeShaderQuad(scene, {
            name: 'splash_logo', textureKey: LOGO_ATLAS.key, atlas: LOGO_ATLAS, pos: { x: 0, y: 0 },
            cardTime: cardTimeOf(1), w: toPx(logoW), h: toPx(logoH), tilt: () => 0, dissolve: this.logoDissolve, mouseDamping: 1,
        });
        this.logo.setDepth(-10);

        // `replace_card`：`Card(…, 1.2·CARD_W·SC_scale, 1.2·CARD_H·SC_scale, G.P_CARDS.S_A, c_base)`，先藏着；`ambient_tilt = 0`、`no_ui`
        const cw = 1.2 * CARD_W * SC_SCALE;
        const ch = 1.2 * CARD_H * SC_SCALE;
        this.card = new MiniCard(scene, 'S_A', cw, ch, -5, { dissolve: this.cardDissolve });
        this.card.setVisible(false);
        // `Card:hover`：弹一下、`paper1`；`no_ui` 不出提示框
        this.card.onHover(() => {
            this.card.juiceUp(0.05, 0.03);
            scene.sound.play('paper1', { rate: Math.random() * 0.2 + 0.9, volume: 0.35 });
        }, () => undefined);

        this.version = this.mount(versionBox(), 'tri', 60);
    }

    private mount(def: ReturnType<typeof versionBox>, align: string, depth: number): UIBoxView {
        const view = new UIBoxView(this.scene, new UIBox(def, { align, offset: { x: 0, y: 0 }, major: ROOM }), depth, this.onButton);
        view.setResolution(this.resolution);
        return view;
    }

    setResolution(r: number): void {
        this.resolution = r;
        for (const v of [this.version, this.buttons, this.profile]) v?.setResolution(r);
    }

    /** 到点的事件只跑一次 */
    private at(key: string, t: number, age: number, fn: () => void): void {
        if (age >= t && !this.fired.has(key)) {
            this.fired.add(key);
            fn();
        }
    }

    update(now: number): void {
        const age = now - this.t0;
        const game = this.context === 'game';
        const sound = this.scene.sound;

        // 黑桃 A 溶进来：`game` 等 1.5 秒，否则立刻
        this.at('card', game ? 1.5 : 0, age, () => {
            this.card.setVisible(true);
            const card = this.card;
            playEnter(this.scene, {
                dissolve: this.cardDissolve,
                get rect() { return card.rect; },
                topDepth: -4,
                juiceUp: (a, r) => this.card.juiceUp(a, r),
                pinch: () => undefined,
                setTargetR: () => undefined,
                disableInput: () => undefined,
                destroy: () => undefined,
            }, [C.WHITE, C.WHITE] as Colour[], false, 1.2);
        });
        // 标志溶出来：`magic_crumple3`（音高 1.3）、`whoosh1`，`dissolve` 0.9 秒缓到 0
        this.at('logo', game ? 2 : 0.5, age, () => {
            sound.play('magic_crumple3', { rate: 1.3, volume: 0.9 });
            sound.play('whoosh1', { rate: 0.4, volume: 0.8 });
            this.logoEase = { start: now, dur: 0.9 };
        });
        // `set_main_menu_UI`：按钮从下面 10 格滑上来，Profile 下一帧从左边 10 格滑进来
        this.at('ui', game ? 3 : 1.5, age, () => {
            this.buttons = this.mount(mainMenuButtons(), 'bmi', 60);
            this.buttons.slideFrom(10);
        });
        if (this.buttons && !this.profile) {
            this.profile = this.mount(profileButton(), 'bli', 60);
            this.profile.slideFrom(0, -10);
        }

        if (this.logoEase) this.logoDissolve.amount = Math.max(0, 1 - (now - this.logoEase.start) / this.logoEase.dur);

        // title 区里的那一张（`align_cards` 的 title 分支，`card_w = CARD_W`）
        const cw = 1.2 * CARD_W * SC_SCALE;
        const ch = 1.2 * CARD_H * SC_SCALE;
        const [p] = alignTitle(this.titleTop, [{ highlighted: false, prevX: this.cardX, w: cw, h: ch }], 1, now);
        // `Card:init` 的 `T.scale = 0.95`（`card.lua:58`）；`T.x` 当正弦的相位
        const x = p!.x + cardShadowParallaxX(p!.x, cw) / 30;
        this.card.place(x, p!.y, p!.r, 0.95);
        this.cardX = x;

        // 标志 `cm` 钉在 title_top 上（`bond = 'Strong'`，跟着区走，不缓动）
        this.logo.setPosition(toPx(this.titleTop.x + this.titleTop.w / 2), toPx(this.titleTop.y + this.titleTop.h / 2));
        this.logo.setVisible(this.logoDissolve.amount < 1);

        this.version.update(now);
        this.buttons?.update(now);
        this.profile?.update(now);
    }

    destroy(): void {
        this.splash.destroy();
        this.logo.destroy();
        this.card.destroy();
        this.version.destroy();
        this.buttons?.destroy();
        this.profile?.destroy();
    }
}
