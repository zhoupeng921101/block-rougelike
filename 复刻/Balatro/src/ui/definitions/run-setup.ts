/**
 * 开局设置（22 号票第四十四步）：`UI_definitions.lua:5434` 的 `G.UIDEF.run_setup`、`:6104` 的 `run_setup_option('New Run')`、
 * `:5598` 的 `stake_option` / `viewed_stake_option` / `stake_description`、`:3280` 的 `deck_stake_column`、
 * `back.lua:26` 的 `Back:generate_UI`，与 `button_callbacks.lua:1955` 的 `toggle_seeded_run`。
 *
 * 口径是**一个新存档**：没赢过任何一局，所以赌注只有白注（`max_stake + 1 = 1`，箭头灰掉），
 * 右边那列八个赌注标记只有第一格是大的（`valid_option`），Challenges 页显示解锁条件（`challenge_locked`，0/5）。
 *
 * **与原作的差别**：牌组循环只列红牌组。原作列出全部 15 个牌组，没解锁的显示解锁条件、PLAY 变灰；
 * 复刻件只实现了红牌组，把别的列进来也只能是一排锁住的牌。
 * 局中进来的是 `G.STAGE == RUN` 那一支：第二页是 Challenges（主菜单进来才有 Continue）。
 */
import { C } from '../colours';
import { DICTIONARY, ML_DICTIONARY } from '../lang.generated';
import { DynaText } from '../dynatext';
import { localize, locNameText } from '../localize';
import { CARD_H, CARD_W } from '../../game/coords';
import { UIBox, type UIFuncs, type UINodeDef, UIT } from '../uibox';
import { descFromRows } from './card-popup';
import { type EmptyObject, stakeSprite } from './hud';
import { createOptionCycle, createToggle } from './options';
import { genericOptions } from './overlay';
import { createTabs } from './run-info';
import { createTextInput } from './text-input';
import { uiboxButton } from './ui-button';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

/** 开局设置的状态：`G.run_setup_seed`（勾没勾 Seeded Run）与 `G.setup_seed`（敲进去的种子） */
export type RunSetupState = { run_setup_seed: boolean; setup_seed: string };

/** 牌组预览那一叠（`CardArea{type = 'deck', card_limit = 5, deck_height = 0.75, thin_draw = 1}`，10 张背面）。由场景画 */
export type DeckPreviewObject = EmptyObject & { deckPreview: true; n: number };

/** `Back:generate_UI()`：红牌组的说明（`min_dims = 0.7`、`desc_from_rows(…, true, 3.5)`） */
function backUi(mobile: boolean): UINodeDef {
    const rows: UINodeDef[][] = [];
    localize({ type: 'descriptions', set: 'Back', key: 'b_red', vars: [1], nodes: rows, mobile });
    return { n: UIT.ROOT, config: { align: 'cm', minw: 0.7 * 5, minh: 0.7 * 2.5, id: 'Red Deck', colour: C.CLEAR }, nodes: [
        descFromRows(rows, true, 0.7 * 5),
    ] };
}

/** `deck_stake_column`：八个赌注从高到低，新存档只有白注那格是可选的大小，都没赢过所以全是半透明 */
function deckStakeColumn(viewedStake: number): UINodeDef {
    const col: UINodeDef[] = [];
    let valid = false;
    for (let i = 8; i >= 1; i--) {
        if (i === 1) valid = true;
        col.push({ n: UIT.R, config: { id: `stake_${i}`, align: 'cm', colour: C.CLEAR, outline: i === viewedStake ? 0.8 : 0, outline_colour: C.WHITE, r: 0.1, minh: 0.25, minw: valid ? 0.45 : 0.25 }, nodes: [
            { n: UIT.R, config: { align: 'cm', minh: valid ? 0.17 : 0.13, minw: valid ? 0.37 : 0.13, colour: C.UI.TRANSPARENT_LIGHT, r: 0.1 }, nodes: [] },
        ] });
        if (i > 1) col.push({ n: UIT.R, config: { align: 'cm', minh: 0.1, minw: 0.04 }, nodes: [] });
    }
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: col };
}

/** `stake_description` */
function stakeDescription(mobile: boolean): UINodeDef {
    const rows: UINodeDef[][] = [];
    localize({ type: 'descriptions', set: 'Stake', key: 'stake_white', nodes: rows, mobile });
    return { n: UIT.C, config: { align: 'cm', padding: 0.05, r: 0.1, colour: C.L_BLACK }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [
            { n: UIT.T, config: { text: locNameText('Stake', 'stake_white'), scale: 0.35, colour: C.WHITE } },
        ] },
        { n: UIT.R, config: { align: 'cm', padding: 0.03, colour: C.WHITE, r: 0.1, minh: 1, minw: 5.5 }, nodes: rows.map((v) => ({ n: UIT.R, config: { align: 'cm', maxw: 5.3 }, nodes: v })) },
    ] };
}

/** `viewed_stake_option`：竖排「Stake」、赌注筹码、说明 */
function viewedStakeOption(mobile: boolean): UINodeDef {
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.BLACK, r: 0.1 }, nodes: [
        { n: UIT.C, config: { align: 'cm', padding: 0 }, nodes: [
            { n: UIT.T, config: { text: loc('k_stake'), scale: 0.4, colour: C.L_BLACK, vert: true } },
        ] },
        { n: UIT.C, config: { align: 'cm', padding: 0.1 }, nodes: [
            { n: UIT.C, config: { align: 'cm', padding: 0 }, nodes: [
                { n: UIT.O, config: { colour: C.BLUE, object: stakeSprite(1, 1), hover: true, can_collide: false } },
            ] },
            stakeDescription(mobile),
        ] },
    ] };
}

/** `stake_option('New Run')`：只有白注，选项循环只有一项（箭头灰） */
function stakeOption(mobile: boolean): UINodeDef {
    const middle: UINodeDef = { n: UIT.R, config: { align: 'cm', minh: 1.7, minw: 7.3 }, nodes: [
        { n: UIT.O, config: { object: new UIBox(viewedStakeOption(mobile), { offset: { x: 0, y: 0 } }) } },
    ] };
    return { n: UIT.ROOT, config: { align: 'tm', colour: C.CLEAR, minh: 2.03, minw: 8.3 }, nodes: [
        createOptionCycle({ options: [1], current_option: 1, colour: C.RED, w: 6, mid: middle }),
    ] };
}

/** `toggle_seeded_run` 勾上时挂进来的那一块：说明、种子框、Paste Seed */
export function seededRunRow(state: RunSetupState): UINodeDef {
    const disabled = (ML_DICTIONARY.ml_disabled_seed ?? []).map((line) => ({ n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [
        { n: UIT.T, config: { text: line, scale: 0.26, colour: C.UI.TEXT_LIGHT, shadow: true } },
    ] }));
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: [
        { n: UIT.C, config: { align: 'cm', minw: 2.5, padding: 0.05 }, nodes: [
            { n: UIT.R, config: { align: 'cm', padding: 0.03 }, nodes: disabled },
        ] },
        { n: UIT.C, config: { align: 'cm', minw: 0.1 }, nodes: [
            createTextInput({ max_length: 8, all_caps: true, ref_table: state as unknown as Record<string, unknown>, ref_value: 'setup_seed', prompt_text: loc('k_enter_seed') }),
            { n: UIT.C, config: { align: 'cm', minw: 0.1 }, nodes: [] },
            uiboxButton({ label: [...(ML_DICTIONARY.ml_paste_seed ?? ['Paste', 'Seed'])], minw: 1, minh: 0.6, button: 'paste_seed', colour: C.BLUE, scale: 0.3, col: true }),
        ] },
        { n: UIT.C, config: { align: 'cm', minw: 2.5 }, nodes: [] },
    ] };
}

/** 勾选框挂点：一个空对象，勾上时由 `toggle_seeded_run` 换成 `seededRunRow` 的 UIBox */
export type SeedSlotObject = EmptyObject & { seedSlot: true };

/** `run_setup_option('New Run')` */
export function runSetupOption(state: RunSetupState, mobile: boolean): UINodeDef {
    const area: DeckPreviewObject = { kind: 'empty', T: { x: 0, y: 0, w: CARD_W, h: CARD_H }, deckPreview: true, n: 10 };
    const name = new DynaText({ string: ['Red Deck'], maxw: 4, colours: [C.WHITE], shadow: true, bump: true, scale: 0.5, pop_in: 0, silent: true });
    const mid: UINodeDef = { n: UIT.R, config: { align: 'cm', minh: 3.3, minw: 5 }, nodes: [
        { n: UIT.C, config: { align: 'cm', colour: C.BLACK, padding: 0.15, r: 0.1, emboss: 0.05 }, nodes: [
            { n: UIT.C, config: { align: 'cm' }, nodes: [
                { n: UIT.R, config: { align: 'cm', shadow: false }, nodes: [{ n: UIT.O, config: { id: 'run_setup_deck', object: area } }] },
            ] },
            { n: UIT.C, config: { align: 'cm', minh: 1.7, r: 0.1, colour: C.L_BLACK, padding: 0.1 }, nodes: [
                { n: UIT.R, config: { align: 'cm', r: 0.1, minw: 4, maxw: 4, minh: 0.6 }, nodes: [{ n: UIT.O, config: { object: name } }] },
                { n: UIT.R, config: { align: 'cm', colour: C.WHITE, minh: 1.7, r: 0.1 }, nodes: [
                    { n: UIT.O, config: { object: new UIBox(backUi(mobile), { offset: { x: 0, y: 0 } }) } },
                ] },
            ] },
            { n: UIT.C, config: { align: 'cm' }, nodes: [
                { n: UIT.O, config: { object: new UIBox(deckStakeColumn(1), { offset: { x: 0, y: 0 } }) } },
            ] },
        ] },
    ] };
    const seedSlot: SeedSlotObject = { kind: 'empty', T: { x: 0, y: 0, w: 0, h: 0 }, seedSlot: true };
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR, minh: 6.6, minw: 6 }, nodes: [
        { n: UIT.R, config: { align: 'cm', minh: 3.8 }, nodes: [
            createOptionCycle({ options: ['Red Deck'], current_option: 1, colour: C.RED, w: 3.5, mid }),
        ] },
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.R, config: { align: 'cm', minh: 2.2, minw: 6.8 }, nodes: [
                { n: UIT.O, config: { object: new UIBox(stakeOption(mobile), { offset: { x: 0, y: 0 } }) } },
            ] },
        ] },
        { n: UIT.R, config: { align: 'cm', padding: 0.05, minh: 0.9 }, nodes: [
            { n: UIT.O, config: { align: 'cm', func: 'toggle_seeded_run', object: seedSlot } },
        ] },
        { n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [
            { n: UIT.C, config: { align: 'cm', minw: 2.4, id: 'run_setup_seed' }, nodes: [
                createToggle({ col: true, label: loc('k_seeded_run'), label_scale: 0.25, w: 0, scale: 0.7, ref_table: state as unknown as Record<string, unknown>, ref_value: 'run_setup_seed' }),
            ] },
            { n: UIT.C, config: { align: 'cm', minw: 5, minh: 0.8, padding: 0.2, r: 0.1, hover: true, colour: C.BLUE, button: 'start_setup_run', shadow: true }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [
                    { n: UIT.T, config: { text: loc('b_play_cap'), scale: 0.8, colour: C.UI.TEXT_LIGHT } },
                ] },
            ] },
            { n: UIT.C, config: { align: 'cm', minw: 2.5 }, nodes: [] },
        ] },
    ] };
}

/** `G.UIDEF.challenges` 没解锁那一支：`challenge_locked`（赢过 0 个牌组 / 要 5 个） */
function challengesLocked(mobile: boolean): UINodeDef {
    const rows: UINodeDef[][] = [];
    localize({ type: 'other', key: 'challenge_locked', vars: [5, 0], nodes: rows, default_col: C.WHITE, mobile });
    return { n: UIT.ROOT, config: { align: 'cm', padding: 0.1, colour: C.CLEAR, minh: 8.02, minw: 7 }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.03 }, nodes: rows.map((v) => ({ n: UIT.R, config: { align: 'cm' }, nodes: v })) },
    ] };
}

/** `G.UIDEF.run_setup(from_game_over)`：从结束界面来的没有 Back */
export function runSetup(state: RunSetupState, mobile: boolean, funcs: UIFuncs, fromGameOver = false): UINodeDef {
    return genericOptions({ noBack: fromGameOver, contents: [
        { n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [
            createTabs([
                { label: loc('b_new_run'), chosen: true, definition: () => runSetupOption(state, mobile), funcs },
                { label: loc('b_challenges'), definition: () => challengesLocked(mobile), funcs },
            ]),
        ] },
    ] });
}
