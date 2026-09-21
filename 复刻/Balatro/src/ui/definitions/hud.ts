/**
 * `UI_definitions.lua:1378` 的 `create_UIBox_HUD`：左侧面板（22 号票）。逐节点直译。
 *
 * 原作绑定的是 `G.GAME` 里的几张表（`current_round` / `round_resets` / `current_round.current_hand`），
 * 这里给一个**同形状的可变对象** `HudState`，由场景每帧从 `Run` 同步进来；UI 通过 `ref_table` 读它，
 * 与原作「定义里存表的引用、值变了界面跟着变」是同一个语义。
 */
import { C, darken } from '../colours';
import { DynaText } from '../dynatext';
import { EN_FONT } from '../font';
import { DICTIONARY } from '../lang.generated';
import { type UINodeDef, type UIObject, UIT } from '../uibox';

/** `G.GAME` 里被 HUD 绑定的那些字段 */
export type HudState = {
    dollars: number;
    round: number;
    win_ante: number;
    chips_text: string;
    current_round: {
        hands_left: number;
        discards_left: number;
        current_hand: {
            handname_text: string;
            chip_total_text: string;
            hand_level: string;
            chip_text: string;
            mult_text: string;
        };
    };
    round_resets: { ante: number };
};

export function makeHudState(): HudState {
    return {
        dollars: 4,
        round: 0,
        win_ante: 8,
        chips_text: '0',
        current_round: {
            hands_left: 4,
            discards_left: 4,
            // `game.lua` 的 `init_game_object`：这几项开局都是空串 / '0'
            current_hand: { handname_text: '', chip_total_text: '', hand_level: '', chip_text: '0', mult_text: '0' },
        },
        round_resets: { ante: 1 },
    };
}

/** 图集里的一格（`Sprite`）。布局只要宽高，绘制那边按 `atlas` / `pos` 取帧 */
export type SpriteObject = UIObject & { kind: 'sprite'; atlas: string; pos: { x: number; y: number } };

/** 什么都不画、只占位的对象（`Moveable(0,0,0,0)`，火焰特效的挂点） */
export type EmptyObject = UIObject & { kind: 'empty' };

const loc = (key: string) => DICTIONARY[key] ?? `ERROR`;

/**
 * `misc_functions.lua:1801` 的 `get_stake_sprite`：`chips` 图集里赌注那一格，尺寸 `scale × 1`。
 * 复刻件只有白注（`game.lua:256`，`pos = {x=0, y=0}`），别的赌注要从 `P_STAKES` 抄 `pos`。
 */
function stakeSprite(stake: number, scale: number): SpriteObject {
    if (stake !== 1) throw new Error(`赌注 ${stake} 的图标位置还没抄`);
    return { kind: 'sprite', atlas: 'chips', pos: { x: 0, y: 0 }, T: { x: 0, y: 0, w: scale, h: scale } };
}

export function createHud(state: HudState, stake = 1): UINodeDef {
    const scale = 0.4;
    const stake_sprite = stakeSprite(stake, 0.5);
    const spacing = 0.13;
    const temp_col = C.DYN_UI.BOSS_MAIN;
    const temp_col2 = C.DYN_UI.BOSS_DARK;
    const en = EN_FONT;

    const round: UINodeDef[] = [
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.C, config: { id: 'hud_hands', align: 'cm', padding: 0.05, minw: 1.45, colour: temp_col, emboss: 0.05, r: 0.1 }, nodes: [
                { n: UIT.R, config: { align: 'cm', minh: 0.33, maxw: 1.35 }, nodes: [
                    { n: UIT.T, config: { text: loc('k_hud_hands'), scale: 0.85 * scale, colour: C.UI.TEXT_LIGHT, shadow: true } },
                ] },
                { n: UIT.R, config: { align: 'cm', r: 0.1, minw: 1.2, colour: temp_col2 }, nodes: [
                    { n: UIT.O, config: { object: new DynaText({ string: [{ ref_table: state.current_round, ref_value: 'hands_left' }], font: en, colours: [C.BLUE], shadow: true, rotate: true, scale: 2 * scale }), id: 'hand_UI_count' } },
                ] },
            ] },
            { n: UIT.C, config: { minw: spacing }, nodes: [] },
            { n: UIT.C, config: { align: 'cm', padding: 0.05, minw: 1.45, colour: temp_col, emboss: 0.05, r: 0.1 }, nodes: [
                { n: UIT.R, config: { align: 'cm', minh: 0.33, maxw: 1.35 }, nodes: [
                    { n: UIT.T, config: { text: loc('k_hud_discards'), scale: 0.85 * scale, colour: C.UI.TEXT_LIGHT, shadow: true } },
                ] },
                { n: UIT.R, config: { align: 'cm' }, nodes: [
                    { n: UIT.R, config: { align: 'cm', r: 0.1, minw: 1.2, colour: temp_col2 }, nodes: [
                        { n: UIT.O, config: { object: new DynaText({ string: [{ ref_table: state.current_round, ref_value: 'discards_left' }], font: en, colours: [C.RED], shadow: true, rotate: true, scale: 2 * scale }), id: 'discard_UI_count' } },
                    ] },
                ] },
            ] },
        ] },
        { n: UIT.R, config: { minh: spacing }, nodes: [] },
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.C, config: { align: 'cm', padding: 0.05, minw: 1.45 * 2 + spacing, minh: 1.15, colour: temp_col, emboss: 0.05, r: 0.1 }, nodes: [
                { n: UIT.R, config: { align: 'cm' }, nodes: [
                    { n: UIT.C, config: { align: 'cm', r: 0.1, minw: 1.28 * 2 + spacing, minh: 1, colour: temp_col2 }, nodes: [
                        { n: UIT.O, config: { object: new DynaText({ string: [{ ref_table: state, ref_value: 'dollars', prefix: loc('$') }], maxw: 1.35, colours: [C.MONEY], font: en, shadow: true, spacing: 2, bump: true, scale: 2.2 * scale }), id: 'dollar_text_UI' } },
                    ] },
                ] },
            ] },
        ] },
        { n: UIT.R, config: { minh: spacing }, nodes: [] },
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.C, config: { id: 'hud_ante', align: 'cm', padding: 0.05, minw: 1.45, minh: 1, colour: temp_col, emboss: 0.05, r: 0.1 }, nodes: [
                { n: UIT.R, config: { align: 'cm', minh: 0.33, maxw: 1.35 }, nodes: [
                    { n: UIT.T, config: { text: loc('k_ante'), scale: 0.85 * scale, colour: C.UI.TEXT_LIGHT, shadow: true } },
                ] },
                { n: UIT.R, config: { align: 'cm', r: 0.1, minw: 1.2, colour: temp_col2 }, nodes: [
                    { n: UIT.O, config: { object: new DynaText({ string: [{ ref_table: state.round_resets, ref_value: 'ante' }], colours: [C.IMPORTANT], shadow: true, font: en, scale: 2 * scale }), id: 'ante_UI_count' } },
                    { n: UIT.T, config: { text: ' ', scale: 0.3 * scale } },
                    { n: UIT.T, config: { text: '/ ', scale: 0.7 * scale, colour: C.WHITE, shadow: true, lang: en } },
                    // `G.FTP_LOCKED` 在完整版里是 nil（`globals.lua:162` 注释掉了），走绑定 `win_ante` 这一支
                    { n: UIT.T, config: { ref_table: state, ref_value: 'win_ante', scale, colour: C.WHITE, shadow: true, lang: en } },
                ] },
            ] },
            { n: UIT.C, config: { minw: spacing }, nodes: [] },
            { n: UIT.C, config: { align: 'cm', padding: 0.05, minw: 1.45, minh: 1, colour: temp_col, emboss: 0.05, r: 0.1 }, nodes: [
                { n: UIT.R, config: { align: 'cm', maxw: 1.35 }, nodes: [
                    { n: UIT.T, config: { text: loc('k_round'), minh: 0.33, scale: 0.85 * scale, colour: C.UI.TEXT_LIGHT, shadow: true } },
                ] },
                { n: UIT.R, config: { align: 'cm', r: 0.1, minw: 1.2, colour: temp_col2, id: 'row_round_text' }, nodes: [
                    { n: UIT.O, config: { object: new DynaText({ string: [{ ref_table: state, ref_value: 'round' }], font: en, colours: [C.IMPORTANT], shadow: true, scale: 2 * scale }), id: 'round_UI_count' } },
                ] },
            ] },
        ] },
    ];

    const hand = state.current_round.current_hand;
    const handRow: UINodeDef = { n: UIT.R, config: { align: 'cm', id: 'hand_text_area', colour: darken(C.BLACK, 0.1), r: 0.1, emboss: 0.05, padding: 0.03 }, nodes: [
        { n: UIT.C, config: { align: 'cm' }, nodes: [
            { n: UIT.R, config: { align: 'cm', minh: 1.1 }, nodes: [
                { n: UIT.O, config: { id: 'hand_name', func: 'hand_text_UI_set', object: new DynaText({ string: [{ ref_table: hand, ref_value: 'handname_text' }], colours: [C.UI.TEXT_LIGHT], shadow: true, float: true, scale: scale * 1.4 }) } },
                { n: UIT.O, config: { id: 'hand_chip_total', func: 'hand_chip_total_UI_set', object: new DynaText({ string: [{ ref_table: hand, ref_value: 'chip_total_text' }], colours: [C.UI.TEXT_LIGHT], font: en, shadow: true, float: true, scale: scale * 1.4 }) } },
                { n: UIT.T, config: { ref_table: hand, ref_value: 'hand_level', scale, colour: C.UI.TEXT_LIGHT, id: 'hand_level', shadow: true } },
            ] },
            { n: UIT.R, config: { align: 'cm', minh: 1, padding: 0.1 }, nodes: [
                { n: UIT.C, config: { align: 'cr', minw: 2, minh: 1, r: 0.1, colour: C.UI_CHIPS, id: 'hand_chip_area', emboss: 0.05 }, nodes: [
                    { n: UIT.O, config: { func: 'flame_handler', no_role: true, id: 'flame_chips', object: emptyObject(), w: 0, h: 0 } },
                    { n: UIT.O, config: { id: 'hand_chips', func: 'hand_chip_UI_set', object: new DynaText({ string: [{ ref_table: hand, ref_value: 'chip_text' }], colours: [C.UI.TEXT_LIGHT], font: en, shadow: true, float: true, scale: scale * 2.3 }) } },
                    { n: UIT.B, config: { w: 0.1, h: 0.1 } },
                ] },
                { n: UIT.C, config: { align: 'cm' }, nodes: [
                    { n: UIT.T, config: { text: 'X', lang: en, scale: scale * 2, colour: C.UI_MULT, shadow: true } },
                ] },
                { n: UIT.C, config: { align: 'cl', minw: 2, minh: 1, r: 0.1, colour: C.UI_MULT, id: 'hand_mult_area', emboss: 0.05 }, nodes: [
                    { n: UIT.O, config: { func: 'flame_handler', no_role: true, id: 'flame_mult', object: emptyObject(), w: 0, h: 0 } },
                    { n: UIT.B, config: { w: 0.1, h: 0.1 } },
                    { n: UIT.O, config: { id: 'hand_mult', func: 'hand_mult_UI_set', object: new DynaText({ string: [{ ref_table: hand, ref_value: 'mult_text' }], colours: [C.UI.TEXT_LIGHT], font: en, shadow: true, float: true, scale: scale * 2.3 }) } },
                ] },
            ] },
        ] },
    ] };

    const dollarsChips: UINodeDef = { n: UIT.R, config: { align: 'cm', r: 0.1, padding: 0, colour: C.DYN_UI.BOSS_MAIN, emboss: 0.05, id: 'row_dollars_chips' }, nodes: [
        { n: UIT.C, config: { align: 'cm', padding: 0.1 }, nodes: [
            { n: UIT.C, config: { align: 'cm', minw: 1.3 }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: 0, maxw: 1.3 }, nodes: [
                    { n: UIT.T, config: { text: loc('k_round'), scale: 0.42, colour: C.UI.TEXT_LIGHT, shadow: true } },
                ] },
                { n: UIT.R, config: { align: 'cm', padding: 0, maxw: 1.3 }, nodes: [
                    { n: UIT.T, config: { text: loc('k_lower_score'), scale: 0.42, colour: C.UI.TEXT_LIGHT, shadow: true } },
                ] },
            ] },
            { n: UIT.C, config: { align: 'cm', minw: 3.3, minh: 0.7, r: 0.1, colour: C.DYN_UI.BOSS_DARK }, nodes: [
                { n: UIT.O, config: { w: 0.5, h: 0.5, object: stake_sprite, hover: true, can_collide: false } },
                { n: UIT.B, config: { w: 0.1, h: 0.1 } },
                { n: UIT.T, config: { ref_table: state, ref_value: 'chips_text', lang: en, scale: 0.85, colour: C.WHITE, id: 'chip_UI_count', func: 'chip_UI_set', shadow: true } },
            ] },
        ] },
    ] };

    const buttons: UINodeDef[] = [
        { n: UIT.C, config: { align: 'cm', r: 0.1, colour: C.CLEAR, shadow: true, id: 'button_area', padding: 0.2 }, nodes: [
            { n: UIT.R, config: { id: 'run_info_button', align: 'cm', minh: 1.75, minw: 1.5, padding: 0.05, r: 0.1, hover: true, colour: C.RED, button: 'run_info', shadow: true }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: 0, maxw: 1.4 }, nodes: [
                    { n: UIT.T, config: { text: loc('b_run_info_1'), scale: 1.2 * scale, colour: C.UI.TEXT_LIGHT, shadow: true } },
                ] },
                { n: UIT.R, config: { align: 'cm', padding: 0, maxw: 1.4 }, nodes: [
                    { n: UIT.T, config: { text: loc('b_run_info_2'), scale: 1 * scale, colour: C.UI.TEXT_LIGHT, shadow: true, func: 'set_button_pip' } },
                ] },
            ] },
            { n: UIT.R, config: { align: 'cm', minh: 1.75, minw: 1.5, padding: 0.05, r: 0.1, hover: true, colour: C.ORANGE, button: 'options', shadow: true }, nodes: [
                { n: UIT.C, config: { align: 'cm', maxw: 1.4, func: 'set_button_pip' }, nodes: [
                    { n: UIT.T, config: { text: loc('b_options'), scale, colour: C.UI.TEXT_LIGHT, shadow: true } },
                ] },
            ] },
        ] },
    ];

    return { n: UIT.ROOT, config: { align: 'cm', padding: 0.03, colour: C.UI.TRANSPARENT_DARK }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.05, colour: C.DYN_UI.MAIN, r: 0.1 }, nodes: [
            { n: UIT.R, config: { align: 'cm', colour: C.DYN_UI.BOSS_DARK, r: 0.1, minh: 30, padding: 0.08 }, nodes: [
                { n: UIT.R, config: { align: 'cm', minh: 0.3 }, nodes: [] },
                { n: UIT.R, config: { align: 'cm', id: 'row_blind', minw: 1, minh: 3.75 }, nodes: [] },
                dollarsChips,
                handRow,
                { n: UIT.R, config: { align: 'cm', id: 'row_round' }, nodes: [
                    { n: UIT.C, config: { align: 'cm' }, nodes: buttons },
                    { n: UIT.C, config: { align: 'cm' }, nodes: round },
                ] },
            ] },
        ] },
    ] };
}

function emptyObject(): EmptyObject {
    return { kind: 'empty', T: { x: 0, y: 0, w: 0, h: 0 } };
}
