/**
 * Options 菜单与 Settings 三页（22 号票第四十步）：`UI_definitions.lua:2317` 的 `create_UIBox_options`、
 * `:2373` 的 `create_UIBox_settings` / `G.UIDEF.settings_tab`，以及三种控件
 * `create_slider`（`:1975`）、`create_toggle`（`:2010`）、`create_option_cycle`（`:2062`）。
 *
 * 控件的回调（`G.FUNCS.slider` / `toggle` / `toggle_button` / `option_cycle`，`button_callbacks.lua:508` 起）也在这里，
 * 场景只负责把拖动中的光标交进来、把改了什么应用到画面上。
 *
 * 本产物是移动版（`G.F_MOBILE`）：没有 Video 页（`F_VIDEO_SETTINGS` 关）、没有震动开关（`F_RUMBLE` 关）、
 * 没有崩溃报告开关，选项循环的箭头宽 1.2。复刻件照这一版。
 */
import type { Settings } from '../../game/settings';
import { C, type Colour } from '../colours';
import { DICTIONARY, ML_DICTIONARY } from '../lang.generated';
import { DynaText } from '../dynatext';
import { UI_DRAG, type UIElement, type UIFuncs, type UINodeDef, UIT } from '../uibox';
import type { SpriteObject } from './hud';
import { genericOptions } from './overlay';
import { type Tab, createTabs } from './run-info';
import { uiboxButton } from './ui-button';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

// ————————————————————————————————————————————————————————————————
// 控件
// ————————————————————————————————————————————————————————————————

export type SliderArgs = {
    label?: string;
    w?: number;
    h?: number;
    colour?: Colour;
    label_scale?: number;
    text_scale?: number;
    min?: number;
    max?: number;
    decimal_places?: number;
    ref_table: Record<string, unknown>;
    ref_value: string;
    /** 拖动中每帧调（原作 `G.FUNCS[rt.callback]`） */
    callback?: (value: number) => void;
    /** 显示的字（`string.format("%.nf")`），拖动时改 */
    text?: string;
};

/** `create_slider`。原文外层与槽都写的是 `min_h`（没有这个键），高度由里面那条 B 撑起来，照抄 */
export function createSlider(args: SliderArgs): UINodeDef {
    const colour = args.colour ?? C.RED;
    const w = args.w ?? 1;
    const h = args.h ?? 0.5;
    const labelScale = args.label_scale ?? 0.5;
    const textScale = args.text_scale ?? 0.3;
    const min = args.min ?? 0;
    const max = args.max ?? 1;
    Object.assign(args, { colour, w, h, min, max, decimal_places: args.decimal_places ?? 0 });
    const value = Number(args.ref_table[args.ref_value]);
    args.text = value.toFixed(args.decimal_places ?? 0);
    const startval = (w * (value - min)) / (max - min);

    let t: UINodeDef = { n: UIT.C, config: { align: 'cm', minw: w, padding: 0.1, r: 0.1, colour: C.CLEAR }, nodes: [
        { n: UIT.C, config: { align: 'cl', minw: w, r: 0.1, collideable: true, hover: true, colour: C.BLACK, emboss: 0.05, func: 'slider', refresh_movement: true }, nodes: [
            { n: UIT.B, config: { w: startval, h, r: 0.1, colour, ref_table: args, refresh_movement: true } },
        ] },
        { n: UIT.C, config: { align: 'cm', minh: h, r: 0.1, minw: 0.8, colour, shadow: true }, nodes: [
            { n: UIT.T, config: { ref_table: args, ref_value: 'text', scale: textScale, colour: C.UI.TEXT_LIGHT } },
        ] },
    ] };
    if (args.label) {
        t = { n: UIT.R, config: { align: 'cm', minh: 1, minw: 1, padding: 0.1 * labelScale, colour: C.CLEAR }, nodes: [
            { n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [
                { n: UIT.T, config: { text: args.label, scale: labelScale, colour: C.UI.TEXT_LIGHT } },
            ] },
            { n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [t] },
        ] };
    }
    return t;
}

export type ToggleArgs = {
    label?: string;
    w?: number;
    h?: number;
    scale?: number;
    label_scale?: number;
    active_colour?: Colour;
    inactive_colour?: Colour;
    ref_table: Record<string, unknown>;
    ref_value: string;
    callback?: (value: boolean) => void;
    col?: boolean;
};

/** 开关里那个勾：`icons` 图集 `{x=1, y=0}`，关着时藏起来 */
export type CheckObject = SpriteObject & { visible: boolean };

/** `create_toggle` */
export function createToggle(args: ToggleArgs): UINodeDef {
    const scale = args.scale ?? 1;
    const w = args.w ?? 3;
    Object.assign(args, { active_colour: args.active_colour ?? C.RED, inactive_colour: args.inactive_colour ?? C.BLACK });
    const check: CheckObject = { kind: 'sprite', atlas: 'icons', pos: { x: 1, y: 0 }, T: { x: 0, y: 0, w: 0.5 * scale, h: 0.5 * scale }, visible: false };
    return { n: args.col ? UIT.C : UIT.R, config: { align: 'cm', padding: 0.1, r: 0.1, colour: C.CLEAR }, nodes: [
        { n: UIT.C, config: { align: 'cr', minw: w }, nodes: [
            { n: UIT.T, config: { text: args.label ?? 'TEST?', scale: args.label_scale ?? 0.4, colour: C.UI.TEXT_LIGHT } },
            { n: UIT.B, config: { w: 0.1, h: 0.1 } },
        ] },
        { n: UIT.C, config: { align: 'cl', minw: 0.3 * w }, nodes: [
            { n: UIT.C, config: { align: 'cm', r: 0.1, colour: C.BLACK }, nodes: [
                { n: UIT.C, config: {
                    align: 'cm', r: 0.1, padding: 0.03, minw: 0.4 * scale, minh: 0.4 * scale, outline_colour: C.WHITE, outline: 1.2 * scale,
                    line_emboss: 0.5 * scale, ref_table: args, colour: args.inactive_colour, button: 'toggle_button', button_dist: 0.2, hover: true, func: 'toggle',
                }, nodes: [
                    { n: UIT.O, config: { object: check } },
                ] },
            ] },
        ] },
    ] };
}

export type OptionCycleArgs = {
    label?: string;
    options: readonly (string | number)[];
    current_option: number;
    /** 换掉中间那块（牌组 / 赌注选择：中间是整块卡片而不是一串字） */
    mid?: UINodeDef;
    /** 两边各留 0.7 的「肩膀」（手柄的 LB / RB 提示位）；图鉴翻页用 */
    cycle_shoulders?: boolean;
    no_pips?: boolean;
    opt_callback?: (to: { to_key: number; to_val: string | number }) => void;
    colour?: Colour;
    scale?: number;
    w?: number;
    h?: number;
    text_scale?: number;
    /** 显示的当前值、两个箭头的字：`ref_table = args` 读它们 */
    current_option_val?: string | number;
    l?: string;
    r?: string;
};

/** `create_option_cycle`（移动版：箭头宽 1.2·scale） */
export function createOptionCycle(args: OptionCycleArgs): UINodeDef {
    const colour = args.colour ?? C.RED;
    const scale = args.scale ?? 1;
    const w = (args.w ?? 2.5) * scale;
    const h = (args.h ?? 0.8) * scale;
    const textScale = (args.text_scale ?? 0.5) * scale;
    Object.assign(args, { current_option_val: args.options[args.current_option - 1], l: '<', r: '>' });
    const disabled = args.options.length < 2;
    const pips: UINodeDef[] = args.options.map((_, i) => ({ n: UIT.B, config: {
        w: 0.1 * scale, h: 0.1 * scale, r: 0.05, id: `pip_${i + 1}`, colour: args.current_option === i + 1 ? C.WHITE : C.BLACK,
    } }));
    const choicePips: UINodeDef | null = args.no_pips ? null : { n: UIT.R, config: { align: 'cm', padding: (0.05 - (args.options.length > 15 ? 0.03 : 0)) * scale }, nodes: pips };
    const arrow = (side: 'l' | 'r'): UINodeDef => ({ n: UIT.C, config: {
        align: 'cm', r: 0.1, minw: 1.2 * scale, hover: !disabled, colour: disabled ? C.BLACK : colour, shadow: !disabled,
        button: disabled ? undefined : 'option_cycle', ref_table: args, ref_value: side,
    }, nodes: [
        { n: UIT.T, config: { ref_table: args, ref_value: side, scale: textScale, colour: disabled ? C.UI.TEXT_INACTIVE : C.UI.TEXT_LIGHT } },
    ] });
    const text = new DynaText({
        string: [{ ref_table: args, ref_value: 'current_option_val' }], colours: [C.UI.TEXT_LIGHT],
        pop_in: 0, pop_in_rate: 8, reset_pop_in: true, shadow: true, float: true, silent: true, bump: true, scale: textScale,
    });
    let t: UINodeDef = { n: UIT.C, config: { align: 'cm', padding: 0.1, r: 0.1, colour: C.CLEAR }, nodes: [
        arrow('l'),
        args.mid
            ? { n: UIT.C, config: { id: 'cycle_main' }, nodes: [
                { n: UIT.R, config: { align: 'cm', minh: 0.05 }, nodes: [args.mid] },
                disabled ? null : choicePips,
            ] }
            : { n: UIT.C, config: { id: 'cycle_main', align: 'cm', minw: w, minh: h, r: 0.1, padding: 0.05, colour, emboss: 0.1, hover: true, can_collide: true }, nodes: [
                { n: UIT.R, config: { align: 'cm' }, nodes: [
                    { n: UIT.R, config: { align: 'cm' }, nodes: [{ n: UIT.O, config: { object: text } }] },
                    { n: UIT.R, config: { align: 'cm', minh: 0.05 }, nodes: [] },
                    disabled ? null : choicePips,
                ] },
            ] },
        arrow('r'),
    ] };
    t = args.cycle_shoulders
        ? { n: UIT.R, config: { align: 'cm', colour: C.CLEAR }, nodes: [
            { n: UIT.C, config: { minw: 0.7, align: 'cm', colour: C.CLEAR }, nodes: [] },
            { n: UIT.C, config: { id: 'cycle_shoulders', padding: 0.1 }, nodes: [t] },
            { n: UIT.C, config: { minw: 0.7, align: 'cm', colour: C.CLEAR }, nodes: [] },
        ] }
        : { n: UIT.R, config: { align: 'cm', colour: C.CLEAR, padding: 0 }, nodes: [t] };
    if (args.label) {
        t = { n: UIT.R, config: { align: 'cm', padding: 0.05 }, nodes: [
            { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.T, config: { text: args.label, scale: 0.5 * scale, colour: C.UI.TEXT_LIGHT } },
            ] },
            t,
        ] };
    }
    return t;
}

// ————————————————————————————————————————————————————————————————
// 回调
// ————————————————————————————————————————————————————————————————

/**
 * 每帧跑的两个 `func`：
 * - `G.FUNCS.slider`：被拖着时按光标定值——`(光标 − 外层.x)/槽宽`，外层比槽多 0.1 的 padding，
 *   所以光标到槽右端之前 0.1 就满了（原文如此）。改值、改字、改里面那条的宽
 * - `G.FUNCS.toggle`：按绑定值换底色、显隐勾
 */
export function controlFuncs(): UIFuncs {
    const drag = UI_DRAG;
    return {
        slider: (e) => {
            const c = e.children[0];
            if (!c || !drag.target || (drag.target !== e && drag.target !== c)) return;
            const rt = c.config.ref_table as SliderArgs;
            const min = rt.min ?? 0;
            const max = rt.max ?? 1;
            const v = Math.min(max, Math.max(min, min + ((max - min) * (drag.x - e.parent!.x)) / e.T.w));
            rt.ref_table[rt.ref_value] = v;
            rt.text = v.toFixed(rt.decimal_places ?? 0);
            c.T.w = ((v - min) / (max - min)) * (rt.w ?? 1);
            c.config.w = c.T.w;
            rt.callback?.(v);
        },
        toggle: (e) => {
            const rt = e.config.ref_table as ToggleArgs;
            const on = !!rt.ref_table[rt.ref_value];
            const check = e.children[0]?.config.object as CheckObject | undefined;
            if (!on && e.config.toggle_active) {
                e.config.toggle_active = undefined;
                e.config.colour = rt.inactive_colour;
                if (check) check.visible = false;
            } else if (on && !e.config.toggle_active) {
                e.config.toggle_active = true;
                e.config.colour = rt.active_colour;
                if (check) check.visible = true;
            }
        },
    };
}

/**
 * 两个按钮回调：`G.FUNCS.toggle_button`（翻绑定值、调 `toggle_callback`）与 `G.FUNCS.option_cycle`
 * （左右转一格、首尾相接，换 pip 的颜色，调 `opt_callback`）。认得就返回 true
 */
export function handleControlButton(name: string, e: UIElement): boolean {
    if (name === 'toggle_button') {
        const rt = e.config.ref_table as ToggleArgs;
        rt.ref_table[rt.ref_value] = !rt.ref_table[rt.ref_value];
        rt.callback?.(!!rt.ref_table[rt.ref_value]);
        return true;
    }
    if (name === 'option_cycle') {
        const rt = e.config.ref_table as OptionCycleArgs;
        const scope = e.parent?.parent;
        const pip = (i: number) => scope ? [...scope.walk()].find((x) => x.config.id === `pip_${i}`) : undefined;
        const old = pip(rt.current_option);
        const n = rt.options.length;
        rt.current_option = e.config.ref_value === 'l' ? (rt.current_option <= 1 ? n : rt.current_option - 1) : (rt.current_option >= n ? 1 : rt.current_option + 1);
        rt.current_option_val = rt.options[rt.current_option - 1];
        if (old) old.config.colour = C.BLACK;
        const now = pip(rt.current_option);
        if (now) now.config.colour = C.WHITE;
        rt.opt_callback?.({ to_key: rt.current_option, to_val: rt.current_option_val! });
        return true;
    }
    return false;
}

// ————————————————————————————————————————————————————————————————
// 菜单
// ————————————————————————————————————————————————————————————————

/** 复刻件接不上的按钮（没有主菜单、统计、图鉴、自定义牌组）：画成灰的、摘掉 `button`，点不动也不装样子 */
function inactive(def: UINodeDef): UINodeDef {
    const walk = (d: UINodeDef): UINodeDef => ({
        ...d,
        config: d.config?.button
            ? { ...d.config, button: undefined, hover: false, colour: C.UI.BACKGROUND_INACTIVE }
            : d.n === UIT.T ? { ...d.config, colour: C.UI.TEXT_INACTIVE } : d.config,
        nodes: d.nodes?.map((c) => (c ? walk(c) : c)),
    });
    return walk(def);
}

/** `create_UIBox_options`（`G.STAGE == RUN` 那一支；种子那行只在 `G.GAME.seeded` 时有） */
/**
 * `create_UIBox_options`。`stage` 照 `G.STAGE`：局内（`RUN`）有种子行、New Run、Main Menu、Collection；
 * 主菜单（`MAIN_MENU`）只有 Settings / Stats / Customize Deck / Credits（复刻件没有 Credits 页，画成灰的）
 */
export function optionsMenu(game: { seeded: boolean; seed: string; stage?: 'run' | 'menu' }): UINodeDef {
    const inRun = (game.stage ?? 'run') === 'run';
    const settings = uiboxButton({ button: 'settings', label: [loc('b_settings')], minw: 5 });
    const restart = uiboxButton({ id: 'restart_button', label: [loc('b_start_new_run')], button: 'setup_run', minw: 5 });
    const mainMenu = uiboxButton({ label: [loc('b_main_menu')], button: 'go_to_menu', minw: 5 });
    const yourCollection = uiboxButton({ label: [loc('b_collection')], button: 'your_collection', minw: 5, id: 'your_collection' });
    const currentSeed: UINodeDef = { n: UIT.R, config: { align: 'cm', padding: 0.05 }, nodes: [
        { n: UIT.C, config: { align: 'cm', padding: 0 }, nodes: [
            { n: UIT.T, config: { text: `${loc('b_seed')}: `, scale: 0.4, colour: C.WHITE } },
        ] },
        { n: UIT.C, config: { align: 'cm', padding: 0, minh: 0.8 }, nodes: [
            { n: UIT.C, config: { align: 'cm', padding: 0, minh: 0.8 }, nodes: [
                { n: UIT.R, config: { align: 'cm', r: 0.1, colour: game.seeded ? C.RED : C.BLACK, minw: 1.8, minh: 0.5, padding: 0.1, emboss: 0.05 }, nodes: [
                    { n: UIT.C, config: { align: 'cm' }, nodes: [
                        { n: UIT.T, config: { text: game.seed, scale: 0.43, colour: C.UI.TEXT_LIGHT, shadow: true } },
                    ] },
                ] },
            ] },
        ] },
        uiboxButton({ col: true, button: 'copy_seed', label: [loc('b_copy')], colour: C.BLUE, scale: 0.3, minw: 1.3, minh: 0.5 }),
    ] };
    const highScores = inactive(uiboxButton({ label: [loc('b_stats')], button: 'high_scores', minw: 5 }));
    const customize = inactive(uiboxButton({ label: [loc('b_customize_deck')], button: 'customize_deck', minw: 5 }));
    const credits = inRun ? null : inactive(uiboxButton({ label: [loc('b_credits')], button: 'show_credits', minw: 5 }));
    return genericOptions({ contents: [
        settings,
        inRun && game.seeded ? currentSeed : null,
        inRun ? restart : null,
        inRun ? mainMenu : null,
        highScores,
        inRun ? yourCollection : null,
        customize,
        credits,
    ].filter((x): x is UINodeDef => !!x) });
}

/** 设置项改了之后场景要做的事（重建按钮、换牌面、改滤波……） */
export type SettingsHooks = {
    playDiscardPosition: () => void;
    contrast: () => void;
    shadows: () => void;
    smoothing: () => void;
    volume: () => void;
};

/** `G.UIDEF.settings_tab`：移动版的 Game / Graphics / Audio 三页 */
export function settingsTab(tab: 'Game' | 'Graphics' | 'Audio', s: Settings, hooks: SettingsHooks): UINodeDef {
    const root = (nodes: UINodeDef[]): UINodeDef => ({ n: UIT.ROOT, config: { align: 'cm', padding: 0.05, colour: C.CLEAR }, nodes });
    const S = s as unknown as Record<string, unknown>;
    if (tab === 'Game') {
        const speeds = [0.5, 1, 2, 4];
        return root([
            createOptionCycle({ label: loc('b_set_gamespeed'), scale: 0.8, options: speeds, current_option: s.GAMESPEED === 0.5 ? 1 : s.GAMESPEED === 4 ? 4 : s.GAMESPEED + 1,
                opt_callback: ({ to_val }) => { s.GAMESPEED = Number(to_val); } }),
            createOptionCycle({ w: 5, label: loc('b_set_play_discard_pos'), scale: 0.8, options: ML_DICTIONARY.ml_play_discard_pos_opt ?? [], current_option: s.play_button_pos,
                opt_callback: ({ to_key }) => { s.play_button_pos = to_key as 1 | 2; hooks.playDiscardPosition(); } }),
            createSlider({ label: loc('b_set_screenshake'), w: 4, h: 0.4, ref_table: S, ref_value: 'screenshake', min: 0, max: 100 }),
            createToggle({ label: loc('ph_display_stickers'), ref_table: S, ref_value: 'run_stake_stickers' }),
            createToggle({ label: loc('b_high_contrast_cards'), ref_table: S, ref_value: 'colourblind_option', callback: () => hooks.contrast() }),
            createToggle({ label: loc('b_reduced_motion'), ref_table: S, ref_value: 'reduced_motion' }),
        ]);
    }
    if (tab === 'Audio') {
        const snd = s.SOUND as unknown as Record<string, unknown>;
        const vol = (label: string, key: string) => createSlider({ label: loc(label), w: 5, h: 0.4, ref_table: snd, ref_value: key, min: 0, max: 100, callback: () => hooks.volume() });
        return root([
            vol('b_set_master_vol', 'volume'),
            vol('b_set_music_vol', 'music_volume'),
            vol('b_set_game_vol', 'game_sounds_volume'),
        ]);
    }
    const g = s.GRAPHICS as unknown as Record<string, unknown>;
    return root([
        createOptionCycle({ w: 4, scale: 0.8, label: loc('b_set_shadows'), options: ML_DICTIONARY.ml_shadow_opt ?? [], current_option: s.GRAPHICS.shadows === 'On' ? 1 : 2,
            opt_callback: ({ to_key }) => { s.GRAPHICS.shadows = to_key === 1 ? 'On' : 'Off'; hooks.shadows(); } }),
        createOptionCycle({ w: 4, scale: 0.8, label: loc('b_set_pixel_smoothing'), options: ML_DICTIONARY.ml_smoothing_opt ?? [], current_option: s.GRAPHICS.texture_scaling,
            opt_callback: ({ to_key }) => { s.GRAPHICS.texture_scaling = to_key as 1 | 2; hooks.smoothing(); } }),
        createSlider({ label: loc('b_set_CRT'), w: 4, h: 0.4, ref_table: g, ref_value: 'crt', min: 0, max: 100 }),
    ]);
}

/** `create_UIBox_settings`：标签页高 7.7、`back_func = 'options'`（Back 回到 Options） */
export function settingsMenu(s: Settings, hooks: SettingsHooks, funcs: UIFuncs): UINodeDef {
    const tab = (label: string, key: 'Game' | 'Graphics' | 'Audio', chosen = false): Tab =>
        ({ label: loc(label), chosen, definition: () => settingsTab(key, s, hooks), funcs });
    return genericOptions({ backFunc: 'options', contents: [createTabs([
        tab('b_set_game', 'Game', true),
        tab('b_set_graphics', 'Graphics'),
        tab('b_set_audio', 'Audio'),
    ], { tabH: 7.7, tabAlignment: 'tm' })] });
}
