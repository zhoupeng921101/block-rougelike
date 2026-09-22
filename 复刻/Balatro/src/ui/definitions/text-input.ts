/**
 * 文本输入框与屏幕键盘（22 号票第四十四步）：`UI_definitions.lua:2210` 的 `create_text_input`、`:2252` 的 `create_keyboard_input`、
 * `:2289` 的 `create_keyboard_button`，以及 `button_callbacks.lua` 里的 `select_text_input` / `text_input` / `flash` / `text_input_key`。
 *
 * 复刻件只用在开局设置的种子框上（`max_length = 8`、`all_caps`）。与原文的差别：光标恒在末尾——
 * 原作能用左右键挪光标（`TRANSPOSE_TEXT_INPUT` 把光标那个 B 节点在字母之间挪来挪去），种子框里用不上，没做。
 *
 * 移动版（`G.F_MOBILE`）点输入框会在它上面弹出屏幕键盘；桌面照样可以直接敲键盘。
 */
import { C, type Colour, darken, lighten } from '../colours';
import { DICTIONARY } from '../lang.generated';
import type { UIElement, UIFuncs, UINodeDef } from '../uibox';
import { UIT } from '../uibox';
import { uiboxButton } from './ui-button';

export type TextInputArgs = {
    ref_table: Record<string, unknown>;
    ref_value: string;
    max_length?: number;
    all_caps?: boolean;
    prompt_text?: string;
    w?: number;
    h?: number;
    text_scale?: number;
    colour?: Colour;
    hooked_colour?: Colour;
    /** 每个字一格（`text.letters`） */
    letters?: string[];
    current_prompt_text?: string;
};

/** `G.CONTROLLER.text_input_hook`：正在输入的那个框（`func = 'text_input'` 的那个 R 元素） */
export const TEXT_HOOK: { el: UIElement | null; args: TextInputArgs | null } = { el: null, args: null };

export function createTextInput(args: TextInputArgs): UINodeDef {
    args.colour ??= [...C.BLUE] as Colour;
    args.hooked_colour ??= darken(C.BLUE, 0.3);
    const w = args.w ?? 2.5;
    const scale = args.text_scale ?? 0.4;
    const max = args.max_length ?? 16;
    args.max_length = max;
    args.prompt_text ??= DICTIONARY.k_enter_text ?? 'Enter Text';
    args.current_prompt_text = '';
    const value = String(args.ref_table[args.ref_value] ?? '');
    args.letters = Array.from({ length: max }, (_, i) => value[i] ?? '');
    const letters: UINodeDef[] = args.letters.map((_, i) => ({ n: UIT.T, config: { ref_table: args.letters, ref_value: String(i), scale, colour: C.UI.TEXT_LIGHT, id: `letter_${i + 1}` } }));
    letters.push({ n: UIT.T, config: { ref_table: args, ref_value: 'current_prompt_text', scale, colour: lighten(args.colour, 0.4), id: 'prompt' } });
    letters.push({ n: UIT.B, config: { r: 0.03, w: 0.1, h: 0.4, colour: lighten(C.BLUE, 0.4), id: 'position', func: 'flash' } });
    return { n: UIT.C, config: { align: 'cm', colour: C.CLEAR }, nodes: [
        { n: UIT.C, config: { id: 'text_input', align: 'cm', padding: 0.05, r: 0.1, hover: true, colour: args.colour, minw: w, button: 'select_text_input', shadow: true, ref_table: args }, nodes: [
            { n: UIT.R, config: { ref_table: args, padding: 0.05, align: 'cm', r: 0.1, colour: C.CLEAR }, nodes: [
                { n: UIT.R, config: { ref_table: args, align: 'cm', r: 0.1, colour: C.CLEAR, func: 'text_input' }, nodes: letters },
            ] },
        ] },
    ] };
}

/** 每帧：框的底色（输入中变暗）、没字时显示提示、光标闪（每半秒一次） */
export function textInputFuncs(now: () => number): UIFuncs {
    return {
        text_input: (e) => {
            const args = e.config.ref_table as TextInputArgs;
            const box = e.parent?.parent;
            const hooked = TEXT_HOOK.el === e;
            if (box) box.config.colour = hooked ? args.hooked_colour : args.colour;
            args.current_prompt_text = !hooked && String(args.ref_table[args.ref_value] ?? '') === '' ? args.prompt_text : '';
        },
        flash: (e) => {
            const colour = e.config.colour as Colour;
            if (TEXT_HOOK.el) {
                colour[3] = Math.floor(now() * 2) % 2 === 1 ? 0 : 1;
                if (e.config.w !== 0.1) { e.config.w = 0.1; e.box.recalculate(); }
            } else {
                colour[3] = 0;
                if (e.config.w !== 0) { e.config.w = 0; e.box.recalculate(); }
            }
        },
    };
}

/** `select_text_input`：钩住这个框（点的是外面那层按钮，钩的是里面带 `text_input` 的那个） */
export function selectTextInput(button: UIElement): void {
    const inner = button.children[0]?.children[0];
    if (!inner) return;
    TEXT_HOOK.el = inner;
    TEXT_HOOK.args = inner.config.ref_table as TextInputArgs;
}

const CORPUS = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * `text_input_key`：`0` 当 `o`；`all_caps` 转大写；退格删最后一个；回车放开；其余在字表里、没超长就接在后面。
 * 返回 `'release'` 表示放开了（场景收起屏幕键盘）
 */
export function textInputKey(key: string): 'release' | 'typed' | null {
    const args = TEXT_HOOK.args;
    if (!args || !TEXT_HOOK.el) return null;
    if (key === '[' || key === ']') return null;
    if (key === '0') key = 'o';
    const cur = String(args.ref_table[args.ref_value] ?? '');
    let next = cur;
    if (key === 'backspace') next = cur.slice(0, -1);
    else if (key === 'return') {
        TEXT_HOOK.el = null;
        TEXT_HOOK.args = null;
        return 'release';
    } else {
        const k = args.all_caps ? key.toUpperCase() : key;
        if (k.length !== 1 || !CORPUS.includes(k) || cur.length >= (args.max_length ?? 16)) return null;
        next = cur + k;
    }
    args.ref_table[args.ref_value] = next;
    args.letters?.forEach((_, i) => { args.letters![i] = next[i] ?? ''; });
    return 'typed';
}

/** `create_keyboard_button`：移动版整体 ×1.9 */
function keyboardButton(key: string, mobile: boolean): UINodeDef {
    const s = mobile ? 1.9 : 1;
    const label = key === 'backspace' ? 'Backspace' : key === ' ' ? 'Space' : key === 'back' ? 'Back' : key === 'return' ? 'Enter' : key;
    const wide = key === 'return' || key === 'backspace' || key === 'back';
    return uiboxButton({
        label: [label], scale: s * 0.5, button: 'key_button', refTable: { key: key === 'back' ? 'return' : key },
        minw: key === ' ' ? s * 6 : wide ? s * 2.5 : s * 0.8,
        minh: key === 'return' || key === 'backspace' ? 1.5 : key === 'back' ? 0.8 : s * 0.7,
        col: true, colour: C.GREY,
    });
}

/** `create_keyboard_input{backspace_key = true, return_key = true, space_key = false}` */
export function keyboardInput(mobile: boolean): UINodeDef {
    const rows = ['1234567890', 'QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
    return { n: UIT.ROOT, config: { align: 'cm', padding: 15, r: 0.1, colour: [C.GREY[0], C.GREY[1], C.GREY[2], 0.7] as Colour }, nodes: [
        { n: UIT.C, config: { align: 'cm', padding: 0.05, colour: C.CLEAR }, nodes: [
            { n: UIT.C, config: { align: 'cm', padding: 0.05, colour: C.BLACK, emboss: 0.05, r: 0.1, mid: true }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: 0.05 }, nodes: [
                    { n: UIT.C, config: { align: 'cm', padding: 0.05, colour: C.CLEAR }, nodes: rows.map((r) => ({
                        n: UIT.R, config: { align: 'cm', padding: 0.07, colour: C.CLEAR }, nodes: [...r].map((c) => keyboardButton(c, mobile)),
                    })) },
                    { n: UIT.C, config: { align: 'cm', padding: 0.05, colour: C.CLEAR }, nodes: ['backspace', 'return', 'back'].map((k) => ({
                        n: UIT.R, config: { align: 'cm', padding: 0.05, colour: C.CLEAR }, nodes: [keyboardButton(k, mobile)],
                    })) },
                ] },
            ] },
        ] },
    ] };
}
