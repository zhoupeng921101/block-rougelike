/**
 * `UI_definitions.lua` 的 `create_UIBox_HUD_blind`：左上的盲注面板（22 号票）。逐节点直译。
 *
 * 挂在左侧面板的 `row_blind` 上（`game.lua:2617`，`align = 'cm'`）。里面的几个 `func`
 * （debuff 文字行的伸缩、分数字号随位数缩放、奖励行）由场景按 `button_callbacks.lua` 的原文实现，
 * 它们会改节点的 `minh` / `scale` 再 `recalculate`。
 */
import { C } from '../colours';
import { DynaText } from '../dynatext';
import { EN_FONT } from '../font';
import { DICTIONARY } from '../lang.generated';
import { type Rect, type UINodeDef, type UIObject, UIT } from '../uibox';
import type { SpriteObject } from './hud';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

/** `G.GAME.blind` 里被面板绑定的字段；它本身也是面板里的一个 O 对象（盲注筹码，1.5×1.5） */
export type HudBlind = UIObject & {
    kind: 'blind';
    /** `P_BLINDS` 的 key；没有盲注时是 null（面板照样建，只是筹码不画） */
    key: string | null;
    loc_name: string;
    chip_text: string;
    chips: number;
    loc_debuff_text: string;
    /** 原作是 1 起的数组 `{[1]=..., [2]=...}`，定义里按 `ref_value = 1 / 2` 取 */
    loc_debuff_lines: Record<'1' | '2', string>;
    /** `G.GAME.probabilities.normal`（The Wheel 的前缀要它） */
    probabilities: number;
};

export type HudBlindState = {
    blind: HudBlind;
    current_round: { dollars_to_be_earned: string };
};

export function makeHudBlindState(): HudBlindState {
    return {
        blind: {
            kind: 'blind',
            key: null,
            // `Blind:change_dim(1.5, 1.5)`
            T: { x: 0, y: 0, w: 1.5, h: 1.5 } as Rect,
            loc_name: '',
            chip_text: '',
            chips: 0,
            loc_debuff_text: '',
            loc_debuff_lines: { 1: '', 2: '' },
            probabilities: 1,
        },
        current_round: { dollars_to_be_earned: '' },
    };
}

export function createHudBlind(state: HudBlindState, stake = 1): UINodeDef {
    const scale = 0.4;
    if (stake !== 1) throw new Error(`赌注 ${stake} 的图标位置还没抄`);
    const stakeSprite: SpriteObject = { kind: 'sprite', atlas: 'chips', pos: { x: 0, y: 0 }, T: { x: 0, y: 0, w: 0.5, h: 0.5 } };
    const b = state.blind;

    return { n: UIT.ROOT, config: { align: 'cm', minw: 4.5, r: 0.1, colour: C.BLACK, emboss: 0.05, padding: 0.05, func: 'HUD_blind_visible', id: 'HUD_blind' }, nodes: [
        { n: UIT.R, config: { align: 'cm', minh: 0.7, r: 0.1, emboss: 0.05, colour: C.DYN_UI.MAIN }, nodes: [
            { n: UIT.C, config: { align: 'cm', minw: 3 }, nodes: [
                { n: UIT.O, config: { object: new DynaText({ string: [{ ref_table: b, ref_value: 'loc_name' }], colours: [C.UI.TEXT_LIGHT], shadow: true, rotate: true, silent: true, float: true, scale: 1.6 * scale }), id: 'HUD_blind_name' } },
            ] },
        ] },
        { n: UIT.R, config: { align: 'cm', minh: 2.74, r: 0.1, colour: C.DYN_UI.DARK }, nodes: [
            { n: UIT.R, config: { align: 'cm', padding: 0.05 }, nodes: [
                { n: UIT.R, config: { align: 'cm', minh: 0.3, maxw: 4.2 }, nodes: [
                    { n: UIT.T, config: { ref_table: { val: '' }, ref_value: 'val', scale: scale * 0.9, colour: C.UI.TEXT_LIGHT, func: 'HUD_blind_debuff_prefix' } },
                    { n: UIT.T, config: { ref_table: b.loc_debuff_lines, ref_value: '1', scale: scale * 0.9, colour: C.UI.TEXT_LIGHT, id: 'HUD_blind_debuff_1', func: 'HUD_blind_debuff' } },
                ] },
                { n: UIT.R, config: { align: 'cm', minh: 0.3, maxw: 4.2 }, nodes: [
                    { n: UIT.T, config: { ref_table: b.loc_debuff_lines, ref_value: '2', scale: scale * 0.9, colour: C.UI.TEXT_LIGHT, id: 'HUD_blind_debuff_2', func: 'HUD_blind_debuff' } },
                ] },
            ] },
            { n: UIT.R, config: { align: 'cm', padding: 0.15 }, nodes: [
                { n: UIT.O, config: { object: b, draw_layer: 1 } },
                { n: UIT.C, config: { align: 'cm', r: 0.1, padding: 0.05, emboss: 0.05, minw: 2.9, colour: C.BLACK }, nodes: [
                    { n: UIT.R, config: { align: 'cm', maxw: 2.8 }, nodes: [
                        { n: UIT.T, config: { text: loc('ph_blind_score_at_least'), scale: 0.3, colour: C.WHITE, shadow: true } },
                    ] },
                    { n: UIT.R, config: { align: 'cm', minh: 0.6 }, nodes: [
                        { n: UIT.O, config: { w: 0.5, h: 0.5, colour: C.BLUE, object: stakeSprite, hover: true, can_collide: false } },
                        { n: UIT.B, config: { h: 0.1, w: 0.1 } },
                        { n: UIT.T, config: { ref_table: b, ref_value: 'chip_text', scale: 0.001, colour: C.RED, lang: EN_FONT, shadow: true, id: 'HUD_blind_count', func: 'blind_chip_UI_scale' } },
                    ] },
                    { n: UIT.R, config: { align: 'cm', minh: 0.45, maxw: 2.8, func: 'HUD_blind_reward' }, nodes: [
                        { n: UIT.T, config: { text: loc('ph_blind_reward'), scale: 0.3, colour: C.WHITE } },
                        { n: UIT.O, config: { object: new DynaText({ string: [{ ref_table: state.current_round, ref_value: 'dollars_to_be_earned' }], font: EN_FONT, colours: [C.MONEY], shadow: true, rotate: true, bump: true, silent: true, scale: 0.45 }), id: 'dollars_to_be_earned' } },
                    ] },
                ] },
            ] },
        ] },
    ] };
}

/** `button_callbacks.lua:2008` 的 `scale_number`：位数多了按对数缩字号 */
export function scaleNumber(num: number, scale: number, max = 10000): number {
    const E_SWITCH_POINT = 100000000000;
    if (num >= E_SWITCH_POINT) return (scale * Math.floor(Math.log10(max * 10))) / Math.floor(Math.log10(1000000 * 10));
    if (num >= max) return (scale * Math.floor(Math.log10(max * 10))) / Math.floor(Math.log10(num * 10));
    return scale;
}
