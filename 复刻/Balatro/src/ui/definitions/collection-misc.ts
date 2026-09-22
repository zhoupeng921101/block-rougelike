/**
 * 图鉴的另外三页（22 号票第四十六步）：`UI_definitions.lua:3981` 的 `_decks`、`:4024` 的 `_tags`、`:4079` 的 `_blinds`，
 * 以及 `back.lua:26` 的 `Back:generate_UI`（牌组页中间那块说明）与 `:4206` 的 `create_UIBox_blind_popup`。
 *
 * 新档口径：只有红牌组解锁；标签、盲注都没发现（指定种子的局也永远不会发现）。
 */
import { CARD_H, CARD_W } from '../../game/coords';
import { BLIND_CENTERS, type BlindCenter } from '../../core/blinds';
import { getBlindAmount } from '../../core/scoring';
import { TAG_CENTERS } from '../../core/tags';
import { C, type Colour, HEX, lighten, mixColours } from '../colours';
import { DynaText } from '../dynatext';
import { numberFormat } from '../format';
import { BLIND_TEXT, DICTIONARY } from '../lang.generated';
import { type LocVars, localize, locNameText } from '../localize';
import { P_CENTERS } from '../descriptions.generated';
import { UIBox, type UINodeDef, UIT } from '../uibox';
import type { BlindChipObject, TagSpriteObject } from './blind-select';
import { descFromRows } from './card-popup';
import { type EmptyObject, type SpriteObject, stakeSprite } from './hud';
import { createOptionCycle } from './options';
import { genericOptions } from './overlay';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

// ————————————————————————————————————————————————————————————————
// Decks
// ————————————————————————————————————————————————————————————————

/** `G.P_CENTER_POOLS.Back`（Challenge Deck `omit`，不算） */
export const BACK_POOL = Object.entries(P_CENTERS)
    .filter(([k, c]) => c.set === 'Back' && k !== 'b_challenge')
    .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0))
    .map(([k]) => k);

/** `get_stake_col` */
const STAKE_COLOURS: Colour[] = [C.WHITE, C.RED, C.GREEN, C.BLACK, C.BLUE, C.PURPLE, C.ORANGE, C.GOLD];
const STAKE_KEYS = ['stake_white', 'stake_red', 'stake_green', 'stake_black', 'stake_blue', 'stake_purple', 'stake_orange', 'stake_gold'];

/** `Back:get_name`：没解锁的叫「Locked」 */
export function backName(key: string): string {
    return P_CENTERS[key]!.unlocked ? locNameText('Back', key) : loc('k_locked');
}

/** 牌背在 `centers` 图集里的那一格：没解锁的是 {4,0}（`Back:change_to`） */
export function backPos(key: string): { x: number; y: number } {
    const c = P_CENTERS[key]!;
    return c.unlocked ? c.pos ?? { x: 0, y: 0 } : { x: 4, y: 0 };
}

/** `Back:generate_UI()`（`min_dims = 0.7`） */
export function backUi(key: string, mobile: boolean): UINodeDef {
    const c = P_CENTERS[key]!;
    const cfg = c.config;
    const rows: UINodeDef[][] = [];
    if (!c.unlocked) {
        const u = c.unlock_condition as { type: string; deck?: string; amount?: number; stake?: number } | undefined;
        if (!u) localize({ type: 'other', key: 'demo_locked', nodes: rows, mobile });
        else if (u.type === 'win_deck') {
            const other = u.deck && P_CENTERS[u.deck]?.unlocked ? locNameText('Back', u.deck) : loc('k_unknown');
            localize({ type: 'other', key: 'deck_locked_win', nodes: rows, vars: [other], mobile });
        } else if (u.type === 'discover_amount') {
            localize({ type: 'other', key: 'deck_locked_discover', nodes: rows, vars: [String(u.amount)], mobile });
        } else if (u.type === 'win_stake') {
            const s = u.stake ?? 1;
            const vars = [locNameText('Stake', STAKE_KEYS[s - 1]!)] as LocVars;
            vars.colours = [STAKE_COLOURS[s - 1]!];
            localize({ type: 'other', key: 'deck_locked_stake', nodes: rows, vars, mobile });
        }
    } else {
        const vname = (k: string, set: string) => locNameText(set, k);
        const name = c.name;
        const args: LocVars = name === 'Blue Deck' ? [cfg.hands] : name === 'Red Deck' ? [cfg.discards] : name === 'Yellow Deck' ? [cfg.dollars]
            : name === 'Green Deck' ? [cfg.extra_hand_bonus, cfg.extra_discard_bonus] : name === 'Black Deck' ? [cfg.joker_slot, -cfg.hands]
            : name === 'Magic Deck' ? [vname('v_crystal_ball', 'Voucher'), vname('c_fool', 'Tarot')]
            : name === 'Nebula Deck' ? [vname('v_telescope', 'Voucher'), -1]
            : name === 'Zodiac Deck' ? [vname('v_tarot_merchant', 'Voucher'), vname('v_planet_merchant', 'Voucher'), vname('v_overstock_norm', 'Voucher')]
            : name === 'Painted Deck' ? [cfg.hand_size, cfg.joker_slot] : name === 'Anaglyph Deck' ? [vname('tag_double', 'Tag')]
            : name === 'Plasma Deck' ? [cfg.ante_scaling] : [];
        localize({ type: 'descriptions', set: 'Back', key, vars: args, nodes: rows, mobile });
    }
    return { n: UIT.ROOT, config: { align: 'cm', minw: 0.7 * 5, minh: 0.7 * 2.5, colour: C.CLEAR }, nodes: [descFromRows(rows, true, 0.7 * 5)] };
}

/** 牌组预览（52 张 1.2 倍大的背面叠起），由场景画 */
export type DeckAreaObject = EmptyObject & { collectionDeck: true };

/** 牌组名那一格（`RUN_SETUP_check_back_name`） */
export function backNameText(key: string): DynaText {
    return new DynaText({ string: [backName(key)], maxw: 4, colours: [C.WHITE], shadow: true, bump: true, scale: 0.5, pop_in: 0, silent: true });
}

/** `create_UIBox_your_collection_decks`：选项循环（15 个牌组名），中间是牌堆 + 名字 + 说明 */
export function decksPage(index: number, mobile: boolean, onChange: (i: number) => void): UINodeDef {
    const key = BACK_POOL[index]!;
    const area: DeckAreaObject = { kind: 'empty', T: { x: 0, y: 0, w: 1.2 * CARD_W, h: 1.2 * CARD_H }, collectionDeck: true };
    const mid: UINodeDef = { n: UIT.R, config: { align: 'cm', minw: 2.5, padding: 0.1, r: 0.1, colour: C.BLACK, emboss: 0.05 }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.2, colour: C.BLACK, r: 0.2 }, nodes: [
            { n: UIT.C, config: { align: 'cm', padding: 0 }, nodes: [{ n: UIT.O, config: { object: area } }] },
            { n: UIT.C, config: { align: 'tm', minw: 3.7, minh: 2.1, r: 0.1, colour: C.L_BLACK, padding: 0.1 }, nodes: [
                { n: UIT.R, config: { align: 'cm', emboss: 0.1, r: 0.1, minw: 4, maxw: 4, minh: 0.6 }, nodes: [
                    { n: UIT.O, config: { id: 'deck_name', object: backNameText(key) } },
                ] },
                { n: UIT.R, config: { align: 'cm', colour: C.WHITE, emboss: 0.1, minh: 2.2, r: 0.1 }, nodes: [
                    { n: UIT.O, config: { id: 'deck_ui', object: new UIBox(backUi(key, mobile), { offset: { x: 0, y: 0 } }) } },
                ] },
            ] },
        ] },
    ] };
    const names = BACK_POOL.map((k) => P_CENTERS[k]!.name);
    return genericOptions({ backFunc: 'your_collection', contents: [
        createOptionCycle({ options: names, current_option: index + 1, colour: C.RED, w: 4.5, mid, opt_callback: ({ to_key }) => onChange(to_key - 1) }),
    ] });
}

// ————————————————————————————————————————————————————————————————
// Tags
// ————————————————————————————————————————————————————————————————

export const TAG_POOL = Object.keys(TAG_CENTERS).sort((a, b) => TAG_CENTERS[a]!.order - TAG_CENTERS[b]!.order);

/** `create_UIBox_your_collection_tags`：4 行 × 6，每个是 `Tag:generate_UI()`（0.8 的精灵）；没发现的画 `tag_undiscovered`（{3,4}） */
export function tagsPage(discovered: (key: string) => boolean): { def: UINodeDef; sprites: Array<{ key: string; sprite: TagSpriteObject }> } {
    const sprites: Array<{ key: string; sprite: TagSpriteObject }> = [];
    const rows: UINodeDef[][] = [[], [], [], []];
    TAG_POOL.forEach((key, i) => {
        const sprite: TagSpriteObject = {
            kind: 'sprite', atlas: 'tags', pos: discovered(key) ? TAG_CENTERS[key]!.pos : { x: 3, y: 4 }, T: { x: 0, y: 0, w: 0.8, h: 0.8 }, shadowHeight: 0.05, float: true,
        };
        sprites.push({ key, sprite });
        rows[Math.floor(i / 6)]!.push({ n: UIT.C, config: { align: 'cm', padding: 0.1 }, nodes: [
            { n: UIT.C, config: { align: 'cm' }, nodes: [{ n: UIT.O, config: { w: 0.8, h: 0.8, colour: C.BLUE, object: sprite } }] },
        ] });
    });
    const def = genericOptions({ backFunc: 'your_collection', contents: [
        { n: UIT.C, config: { align: 'cm', r: 0.1, colour: C.BLACK, padding: 0.1, emboss: 0.05 }, nodes: [
            { n: UIT.C, config: { align: 'cm' }, nodes: [
                { n: UIT.R, config: { align: 'cm' }, nodes: rows.map((r) => ({ n: UIT.R, config: { align: 'cm' }, nodes: r })) },
            ] },
        ] },
    ] });
    return { def, sprites };
}

// ————————————————————————————————————————————————————————————————
// Blinds
// ————————————————————————————————————————————————————————————————

export const BLIND_POOL = Object.keys(BLIND_CENTERS).sort((a, b) => BLIND_CENTERS[a]!.order - BLIND_CENTERS[b]!.order);

/**
 * `create_UIBox_your_collection_blinds`：左边 16 个 Ante 的底分（新档最远到过 0，全灰；行距 `1 − 15·0.06`），
 * 右边 6 行 × 5 个盲注筹码（1.3 大，没发现的画 `b_undiscovered` {0,30}），第 5/6、15/16、25/26 个旁边塞个空块
 */
export function blindsPage(discovered: (key: string) => boolean): { def: UINodeDef; chips: Array<{ key: string; chip: BlindChipObject }> } {
    const chips: Array<{ key: string; chip: BlindChipObject }> = [];
    const matrix: UINodeDef[][] = [[], [], [], [], [], []];
    BLIND_POOL.forEach((key, i) => {
        const k = i + 1;
        const chip: BlindChipObject = { kind: 'blind_chip', pos: discovered(key) ? BLIND_CENTERS[key]!.pos : { x: 0, y: 30 }, shadowHeight: 0.05, T: { x: 0, y: 0, w: 1.3, h: 1.3 } };
        chips.push({ key, chip });
        matrix[Math.floor(i / 5)]!.push({ n: UIT.C, config: { align: 'cm', padding: 0.1 }, nodes: [
            [6, 16, 26].includes(k) ? { n: UIT.B, config: { h: 0.2, w: 0.5 } } : null,
            { n: UIT.O, config: { object: chip } },
            [5, 15, 25].includes(k) ? { n: UIT.B, config: { h: 0.2, w: 0.5 } } : null,
        ] });
    });
    const furthest = 0;
    const antes: UINodeDef[] = [];
    for (let i = 1; i <= 16; i++) {
        const spacing = 1 - Math.min(20, Math.max(15, furthest)) * 0.06;
        if (spacing > 0 && i > 1) antes.push({ n: UIT.R, config: { minh: spacing }, nodes: [] });
        const blindChip: SpriteObject = { kind: 'sprite', atlas: 'ui_1', pos: { x: 0, y: 0 }, T: { x: 0, y: 0, w: 0.2, h: 0.2 } };
        antes.push({ n: UIT.R, config: { align: 'cm', padding: 0.03 }, nodes: [
            { n: UIT.C, config: { align: 'cm', minw: 0.7 }, nodes: [{ n: UIT.T, config: { text: String(i), scale: 0.4, colour: C.FILTER, shadow: true } }] },
            { n: UIT.C, config: { align: 'cr', minw: 2.8 }, nodes: [
                { n: UIT.O, config: { object: blindChip } },
                { n: UIT.C, config: { align: 'cm', minw: 0.03, minh: 0.01 }, nodes: [] },
                { n: UIT.T, config: { text: numberFormat(getBlindAmount(i)), scale: 0.4, colour: i <= furthest ? C.RED : C.JOKER_GREY, shadow: true } },
            ] },
        ] });
    }
    const def = genericOptions({ backFunc: 'your_collection', contents: [
        { n: UIT.C, config: { align: 'cm', r: 0.1, colour: C.BLACK, padding: 0.1, emboss: 0.05 }, nodes: [
            { n: UIT.C, config: { align: 'cm', r: 0.1, colour: C.L_BLACK, padding: 0.1 }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: 0.05 }, nodes: [
                    { n: UIT.C, config: { align: 'cm', minw: 0.7 }, nodes: [{ n: UIT.T, config: { text: loc('k_ante_cap'), scale: 0.4, colour: lighten(C.FILTER, 0.2), shadow: true } }] },
                    { n: UIT.C, config: { align: 'cr', minw: 2.8 }, nodes: [{ n: UIT.T, config: { text: loc('k_base_cap'), scale: 0.4, colour: lighten(C.RED, 0.2), shadow: true } }] },
                ] },
                { n: UIT.R, config: { align: 'cm' }, nodes: antes },
            ] },
            { n: UIT.C, config: { align: 'cm' }, nodes: [
                { n: UIT.R, config: { align: 'cm' }, nodes: matrix.map((r) => ({ n: UIT.R, config: { align: 'cm' }, nodes: r })) },
            ] },
        ] },
    ] });
    return { def, chips };
}

/** `create_UIBox_blind_popup(blind, discovered)` */
export function blindPopup(key: string, discovered: boolean): UINodeDef {
    const b: BlindCenter = BLIND_CENTERS[key]!;
    const text = BLIND_TEXT[key]?.text ?? [];
    const blindText: UINodeDef[] = [];
    if (discovered) {
        const ability = text.map((v, k) => ({ n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.T, config: { text: (k === 0 && b.name === 'The Wheel' ? '1' : '') + v, scale: 0.35, shadow: true, colour: C.WHITE } },
        ] }));
        const bossColour = b.boss_colour ? HEX(b.boss_colour) : C.GREY;
        blindText.push({ n: UIT.R, config: { align: 'cm', emboss: 0.05, r: 0.1, minw: 2.5, padding: 0.07, colour: C.WHITE }, nodes: [
            { n: UIT.R, config: { align: 'cm', maxw: 2.4 }, nodes: [{ n: UIT.T, config: { text: loc('ph_blind_score_at_least'), scale: 0.35, colour: C.UI.TEXT_DARK } }] },
            { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.O, config: { object: stakeSprite(1, 0.4) } },
                { n: UIT.T, config: { text: `${b.mult}${loc('k_x_base')}`, scale: 0.4, colour: C.RED } },
            ] },
            { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.T, config: { text: loc('ph_blind_reward'), scale: 0.35, colour: C.UI.TEXT_DARK } },
                { n: UIT.O, config: { object: new DynaText({ string: [b.dollars ? '$'.repeat(b.dollars) : '-'], colours: [C.MONEY], rotate: true, bump: true, silent: true, scale: 0.45 }) } },
            ] },
            ability.length ? { n: UIT.R, config: { align: 'cm', padding: 0.08, colour: mixColours(bossColour, C.GREY, 0.4), r: 0.1, emboss: 0.05, minw: 2.5, minh: 0.9 }, nodes: ability } : null,
        ] });
    } else {
        blindText.push({ n: UIT.R, config: { align: 'cm', emboss: 0.05, r: 0.1, minw: 2.5, padding: 0.1, colour: C.WHITE }, nodes: [
            { n: UIT.R, config: { align: 'cm' }, nodes: [{ n: UIT.T, config: { text: loc('ph_defeat_this_blind_1'), scale: 0.4, colour: C.UI.TEXT_DARK } }] },
            { n: UIT.R, config: { align: 'cm' }, nodes: [{ n: UIT.T, config: { text: loc('ph_defeat_this_blind_2'), scale: 0.4, colour: C.UI.TEXT_DARK } }] },
        ] });
    }
    const headColour = !discovered ? C.JOKER_GREY : b.boss_colour ? HEX(b.boss_colour) : C.GREY;
    return { n: UIT.ROOT, config: { align: 'cm', padding: 0.05, colour: lighten(C.JOKER_GREY, 0.5), r: 0.1, emboss: 0.05 }, nodes: [
        { n: UIT.R, config: { align: 'cm', emboss: 0.05, r: 0.1, minw: 2.5, padding: 0.1, colour: headColour }, nodes: [
            { n: UIT.O, config: { object: new DynaText({
                string: [discovered ? locNameText('Blind', key) : loc('k_not_discovered')], colours: [C.UI.TEXT_LIGHT], shadow: true,
                rotate: !discovered || undefined, spacing: discovered ? 2 : 0, bump: true, scale: 0.4,
            }) } },
        ] },
        { n: UIT.R, config: { align: 'cm' }, nodes: blindText },
    ] };
}
