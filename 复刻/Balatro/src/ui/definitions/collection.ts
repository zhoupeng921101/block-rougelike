/**
 * 图鉴（22 号票第四十五步）：`UI_definitions.lua:3609` 的 `create_UIBox_your_collection` 与各个分页
 * （`create_UIBox_your_collection_jokers` / `_tarots` / `_planets` / `_spectrals` …）。
 *
 * 分页的卡区是 `type = 'title'` 的 CardArea（`collection = true`），卡由场景按页填、按 `align_cards` 的 title 分支摆。
 * 这里只出界面树：每个卡区是一个占位对象（`CollectionArea`），场景找到它的位置往里摆卡。
 */
import { CARD_H, CARD_W } from '../../game/coords';
import { C } from '../colours';
import { DICTIONARY, ML_DICTIONARY } from '../lang.generated';
import { P_CENTERS } from '../descriptions.generated';
import { type UINodeDef, UIT } from '../uibox';
import type { EmptyObject } from './hud';
import { createOptionCycle } from './options';
import { genericOptions } from './overlay';
import { uiboxButton } from './ui-button';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

export type Tally = { tally: number; of: number };
export type CollectionTallies = Record<'jokers' | 'backs' | 'vouchers' | 'tarots' | 'planets' | 'spectrals' | 'editions' | 'boosters' | 'tags' | 'blinds', Tally>;

/** `G.P_CENTER_POOLS[set]`：按 `order` 排 */
export function centerPool(set: string): string[] {
    return Object.entries(P_CENTERS)
        .filter(([k, c]) => c.set === set && k !== 'b_challenge')
        .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0))
        .map(([k]) => k);
}

/** `create_UIBox_your_collection`：局中进来 Back 回 Options */
export function yourCollection(t: CollectionTallies): UINodeDef {
    return genericOptions({ backFunc: 'options', contents: [
        { n: UIT.C, config: { align: 'cm', padding: 0.15 }, nodes: [
            uiboxButton({ button: 'your_collection_jokers', label: [loc('b_jokers')], count: t.jokers, minw: 5, minh: 1.7, scale: 0.6, id: 'your_collection_jokers' }),
            uiboxButton({ button: 'your_collection_decks', label: [loc('b_decks')], count: t.backs, minw: 5 }),
            uiboxButton({ button: 'your_collection_vouchers', label: [loc('b_vouchers')], count: t.vouchers, minw: 5, id: 'your_collection_vouchers' }),
            { n: UIT.R, config: { align: 'cm', padding: 0.1, r: 0.2, colour: C.BLACK }, nodes: [
                { n: UIT.C, config: { align: 'cm', maxh: 2.9 }, nodes: [
                    { n: UIT.T, config: { text: loc('k_cap_consumables'), scale: 0.45, colour: C.L_BLACK, vert: true, maxh: 2.2 } },
                ] },
                { n: UIT.C, config: { align: 'cm', padding: 0.15 }, nodes: [
                    uiboxButton({ button: 'your_collection_tarots', label: [loc('b_tarot_cards')], count: t.tarots, minw: 4, id: 'your_collection_tarots', colour: C.SECONDARY_SET.Tarot }),
                    uiboxButton({ button: 'your_collection_planets', label: [loc('b_planet_cards')], count: t.planets, minw: 4, id: 'your_collection_planets', colour: C.SECONDARY_SET.Planet }),
                    uiboxButton({ button: 'your_collection_spectrals', label: [loc('b_spectral_cards')], count: t.spectrals, minw: 4, id: 'your_collection_spectrals', colour: C.SECONDARY_SET.Spectral }),
                ] },
            ] },
        ] },
        { n: UIT.C, config: { align: 'cm', padding: 0.15 }, nodes: [
            uiboxButton({ button: 'your_collection_enhancements', label: [loc('b_enhanced_cards')], minw: 5 }),
            uiboxButton({ button: 'your_collection_seals', label: [loc('b_seals')], minw: 5, id: 'your_collection_seals' }),
            uiboxButton({ button: 'your_collection_editions', label: [loc('b_editions')], count: t.editions, minw: 5, id: 'your_collection_editions' }),
            uiboxButton({ button: 'your_collection_boosters', label: [loc('b_booster_packs')], count: t.boosters, minw: 5, id: 'your_collection_boosters' }),
            uiboxButton({ button: 'your_collection_tags', label: [loc('b_tags')], count: t.tags, minw: 5, id: 'your_collection_tags' }),
            uiboxButton({ button: 'your_collection_blinds', label: [loc('b_blinds')], count: t.blinds, minw: 5, minh: 2.0, id: 'your_collection_blinds' }),
        ] },
    ] });
}

/** 一格卡区（`CardArea{type = 'title', collection = true}`）：尺寸（tile）与 `card_limit` */
export type CollectionArea = EmptyObject & { collectionArea: true; row: number; limit: number };

/** 一页的形状：几行卡区、翻页选项（没有就是一页装完，如 Planet） */
export type CollectionPageSpec = {
    kind: 'jokers' | 'tarots' | 'planets' | 'spectrals' | 'vouchers' | 'boosters' | 'enhancements' | 'seals' | 'editions';
    rows: Array<{ w: number; h: number; limit: number }>;
    /** 行外层的 padding（Jokers 0.07，消耗品 0） */
    rowPadding: number;
    /** 第 `page` 页（1 起）第 `row` 行第 `i` 张（都 1 起）在池子里的下标（1 起） */
    index: (page: number, row: number, i: number) => number;
    pages: number;
    set: string;
    /** 卡区的摆法：`title` 或 `voucher`（奇偶交错） */
    areaType?: 'title' | 'voucher';
    /** 一页装完、下面没有翻页（强化 / 蜡封 / 版本） */
    noPager?: boolean;
    /** 框下面的说明（`create_UIBox_generic_options{infotip = …}`） */
    infotip?: readonly string[];
};

export const COLLECTION_PAGES: Record<CollectionPageSpec['kind'], CollectionPageSpec> = {
    // `create_UIBox_your_collection_jokers`：3 行 × 5，每页 15 张
    jokers: {
        kind: 'jokers', set: 'Joker', rowPadding: 0.07, pages: Math.ceil(150 / 15),
        rows: [1, 2, 3].map(() => ({ w: 5 * CARD_W, h: 0.95 * CARD_H, limit: 5 })),
        index: (p, j, i) => i + (j - 1) * 5 + 15 * (p - 1),
    },
    // `_tarots`：两行 5 + 6，每页 11 张，`floor(22/11)` 页
    tarots: {
        kind: 'tarots', set: 'Tarot', rowPadding: 0, pages: Math.floor(22 / 11),
        rows: [1, 2].map((j) => ({ w: (4.25 + j) * CARD_W, h: CARD_H, limit: 4 + j })),
        index: (p, j, i) => i + (j - 1) * 5 + 11 * (p - 1),
    },
    // `_planets`：两行 6，一页装完（底下空一行 padding 0.7）
    planets: {
        kind: 'planets', set: 'Planet', rowPadding: 0, pages: 1,
        rows: [1, 2].map(() => ({ w: 6.25 * CARD_W, h: CARD_H, limit: 6 })),
        index: (_p, j, i) => i + (j - 1) * 6,
    },
    // `_spectrals`：两行 4 + 5，每页 9 张；页数原文按 `floor(#Tarot/9)` 算选项个数（= 2），显示的分母是 `floor(#Spectral/9)`（= 2）
    spectrals: {
        kind: 'spectrals', set: 'Spectral', rowPadding: 0, pages: Math.floor(22 / 9),
        rows: [1, 2].map((j) => ({ w: (3.25 + j) * CARD_W, h: CARD_H, limit: 3 + j })),
        index: (p, j, i) => i + (j - 1) * 4 + 9 * (p - 1),
    },
    // `_vouchers`：两行 4，每页 8 张（`type = 'voucher'`：奇偶交错），建出来时溶入
    vouchers: {
        kind: 'vouchers', set: 'Voucher', rowPadding: 0, pages: Math.ceil(32 / 8), areaType: 'voucher',
        rows: [1, 2].map(() => ({ w: 4.25 * CARD_W, h: CARD_H, limit: 4 })),
        index: (p, j, i) => i + (j - 1) * 4 + 8 * (p - 1),
    },
    // `_boosters`：两行 4，卡是 1.27 倍大
    boosters: {
        kind: 'boosters', set: 'Booster', rowPadding: 0, pages: Math.ceil(32 / 8),
        rows: [1, 2].map(() => ({ w: 5.25 * CARD_W, h: 1.3 * CARD_H, limit: 4 })),
        index: (p, j, i) => i + (j - 1) * 4 + 8 * (p - 1),
    },
    // `_enhancements`：两行 4，`c_base` 换成强化底板、正面是 `P_CARDS.empty`
    enhancements: {
        kind: 'enhancements', set: 'Enhanced', rowPadding: 0, pages: 1, noPager: true, infotip: ML_DICTIONARY.ml_edition_seal_enhancement_explanation,
        rows: [1, 2].map(() => ({ w: 4.25 * CARD_W, h: 1.03 * CARD_H, limit: 4 })),
        index: (_p, j, i) => i + (j - 1) * 4,
    },
    // `_seals`：一行 4 张底板，各上一种蜡封
    seals: {
        kind: 'seals', set: 'Seal', rowPadding: 0, pages: 1, noPager: true, infotip: ML_DICTIONARY.ml_edition_seal_enhancement_explanation,
        rows: [{ w: 4.25 * CARD_W, h: 1.03 * CARD_H, limit: 4 }],
        index: (_p, _j, i) => i,
    },
    // `_editions`：一行 5（`e_base` 起），画的是 Joker 图集 {0,0}，发现了才上版本
    editions: {
        kind: 'editions', set: 'Edition', rowPadding: 0, pages: 1, noPager: true, infotip: ML_DICTIONARY.ml_edition_seal_enhancement_explanation,
        rows: [{ w: 5.3 * CARD_W, h: 1.03 * CARD_H, limit: 5 }],
        index: (_p, _j, i) => i,
    },
};

/** `G.P_CENTER_POOLS.Seal`（`P_SEALS` 按 order） */
export const SEAL_POOL = ['Gold', 'Red', 'Blue', 'Purple'];

/** `overlay_infotip`：框下面的几行说明（0.45、带阴影） */
export function overlayInfotip(rows: readonly string[]): UINodeDef {
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR, padding: 0.1 }, nodes: rows.map((v) => ({ n: UIT.R, config: { align: 'cm' }, nodes: [
        { n: UIT.T, config: { text: v, colour: C.UI.TEXT_LIGHT, scale: 0.45, shadow: true } },
    ] })) };
}

/** 各个分页（`back_func = 'your_collection'`）：黑底里几行卡区，下面翻页 */
export function collectionPage(spec: CollectionPageSpec, onPage: (page: number) => void): UINodeDef {
    const rows: UINodeDef[] = spec.rows.map((r, j) => {
        const area: CollectionArea = { kind: 'empty', T: { x: 0, y: 0, w: r.w, h: r.h }, collectionArea: true, row: j + 1, limit: r.limit };
        return { n: UIT.R, config: { align: 'cm', padding: spec.rowPadding, no_fill: true }, nodes: [{ n: UIT.O, config: { object: area } }] };
    });
    const table: UINodeDef = spec.kind === 'jokers'
        ? { n: UIT.R, config: { align: 'cm', r: 0.1, colour: C.BLACK, emboss: 0.05 }, nodes: rows }
        : { n: UIT.R, config: { align: 'cm', minw: 2.5, padding: 0.1, r: 0.1, colour: C.BLACK, emboss: 0.05 }, nodes: rows };
    const options = Array.from({ length: spec.pages }, (_, i) => `${loc('k_page')} ${i + 1}/${spec.kind === 'spectrals' ? Math.floor(18 / 9) : spec.pages}`);
    if (spec.noPager) return genericOptions({ backFunc: 'your_collection', contents: [table] });
    const footer: UINodeDef = spec.kind === 'planets'
        ? { n: UIT.R, config: { align: 'cm', padding: 0.7 }, nodes: [] }
        : { n: UIT.R, config: { align: 'cm', padding: spec.kind === 'spectrals' ? 0 : undefined }, nodes: [
            createOptionCycle({ options, w: 4.5, cycle_shoulders: true, current_option: 1, colour: C.RED, no_pips: true, opt_callback: ({ to_key }) => onPage(to_key) }),
        ] };
    return genericOptions({ backFunc: 'your_collection', contents: [table, footer] });
}
