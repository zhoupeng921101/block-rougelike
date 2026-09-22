/**
 * Run Info（22 号票第二十二步）：`UI_definitions.lua:3241` 的 `G.UIDEF.run_info`、`:2154` 的 `create_tabs`、
 * `:3192` 的 `create_UIBox_current_hands` / `:3154` 的 `create_UIBox_current_hand_row`。
 *
 * 三页：Poker Hands / Blinds / Vouchers（赌注 > 1 才有第四页 Stake，复刻件只有白注）。
 * 标签页内容是 `tab_contents` 这个 O 节点里装的另一个 UIBox，`change_tab` 换掉它再整盒重排。
 */
import type { HandInfo } from '../../core/scoring';
import { C, darken } from '../colours';
import { DICTIONARY } from '../lang.generated';
import { DynaText } from '../dynatext';
import { UIBox, type UIFuncs, type UINodeDef, type UIObject, UIT } from '../uibox';
import { genericOptions } from './overlay';
import { uiboxButton } from './ui-button';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

export type Tab = { label: string; chosen?: boolean; definition: () => UINodeDef; funcs?: UIFuncs };

/**
 * 标签页的内容盒：`UIBox{definition = tab_definition_function(), config = {offset = {x=0,y=0}}}`。
 * 原作的 `func` 在第一次排版（`set_values`）里就跑了——Blinds 页的 `HUD_blind_debuff_prefix` 把前缀字号改成 0，
 * 外层随后整盒重排时这一行就塌成 0 高，所以建好先跑一遍
 */
export function tabContents(tab: Tab): UIBox {
    const box = new UIBox(tab.definition(), { offset: { x: 0, y: 0 } }, tab.funcs);
    box.runFuncs();
    return box;
}

/** `create_tabs`（只做 run_info / deck_info / settings 用到的参数） */
export function createTabs(tabs: Tab[], args: { tabH?: number; tabW?: number; textScale?: number; scale?: number; tabAlignment?: string } = {}): UINodeDef {
    const scale = args.scale ?? 1;
    const textScale = args.textScale ?? 0.5;
    const current = tabs.find((t) => t.chosen) ?? tabs[0]!;
    const buttons = tabs.map((t) => uiboxButton({
        id: `tab_but_${t.label}`, refTable: t, button: 'change_tab', label: [t.label], minh: 0.8 * scale, minw: 2.5 * scale,
        col: true, choice: true, scale: textScale, chosen: !!t.chosen,
    }));
    const shoulders = tabs.length > 1;
    return { n: UIT.R, config: { padding: 0, align: 'cm', colour: C.CLEAR }, nodes: [
        { n: UIT.R, config: { align: 'cm', colour: C.CLEAR }, nodes: [
            shoulders ? { n: UIT.C, config: { minw: 0.7, align: 'cm', colour: C.CLEAR }, nodes: [] } : null,
            { n: UIT.C, config: { id: 'tab_shoulders', align: 'cm', padding: 0.15 }, nodes: buttons },
            shoulders ? { n: UIT.C, config: { minw: 0.7, align: 'cm', colour: C.CLEAR }, nodes: [] } : null,
        ] },
        { n: UIT.R, config: { align: args.tabAlignment ?? 'cm', padding: 0.1, no_fill: true, minh: args.tabH ?? 0, minw: args.tabW ?? 0 }, nodes: [
            { n: UIT.O, config: { id: 'tab_contents', object: tabContents(current) } },
        ] },
    ] };
}

export type HandName = 'Flush Five' | 'Flush House' | 'Five of a Kind' | 'Straight Flush' | 'Four of a Kind' | 'Full House'
    | 'Flush' | 'Straight' | 'Three of a Kind' | 'Two Pair' | 'Pair' | 'High Card';

const HAND_ORDER: HandName[] = ['Flush Five', 'Flush House', 'Five of a Kind', 'Straight Flush', 'Four of a Kind', 'Full House',
    'Flush', 'Straight', 'Three of a Kind', 'Two Pair', 'Pair', 'High Card'];

/** `create_UIBox_current_hand_row`（非 `simple`）。没露过脸的牌型不出这一行 */
export function currentHandRow(name: HandName, h: HandInfo): UINodeDef | null {
    if (!h.visible) return null;
    // `on_demand_tooltip`：悬停出说明与示例牌（场景读它）
    return { n: UIT.R, config: { align: 'cm', padding: 0.05, r: 0.1, colour: darken(C.JOKER_GREY, 0.1), emboss: 0.05, hover: true, on_demand_tooltip: { hand: name } }, nodes: [
        { n: UIT.C, config: { align: 'cl', padding: 0, minw: 5 }, nodes: [
            { n: UIT.C, config: { align: 'cm', padding: 0.01, r: 0.1, colour: C.HAND_LEVELS[Math.min(7, h.level)]!, minw: 1.5, outline: 0.8, outline_colour: C.WHITE }, nodes: [
                { n: UIT.T, config: { text: `${loc('k_level_prefix')}${h.level}`, scale: 0.5, colour: C.UI.TEXT_DARK } },
            ] },
            { n: UIT.C, config: { align: 'cm', minw: 4.5, maxw: 4.5 }, nodes: [
                { n: UIT.T, config: { text: ` ${name}`, scale: 0.45, colour: C.UI.TEXT_LIGHT, shadow: true } },
            ] },
        ] },
        { n: UIT.C, config: { align: 'cm', padding: 0.05, colour: C.BLACK, r: 0.1 }, nodes: [
            { n: UIT.C, config: { align: 'cr', padding: 0.01, r: 0.1, colour: C.CHIPS, minw: 1.1 }, nodes: [
                { n: UIT.T, config: { text: String(h.chips), scale: 0.45, colour: C.UI.TEXT_LIGHT } },
                { n: UIT.B, config: { w: 0.08, h: 0.01 } },
            ] },
            { n: UIT.T, config: { text: 'X', scale: 0.45, colour: C.MULT } },
            { n: UIT.C, config: { align: 'cl', padding: 0.01, r: 0.1, colour: C.MULT, minw: 1.1 }, nodes: [
                { n: UIT.B, config: { w: 0.08, h: 0.01 } },
                { n: UIT.T, config: { text: String(h.mult), scale: 0.45, colour: C.UI.TEXT_LIGHT } },
            ] },
        ] },
        { n: UIT.C, config: { align: 'cm' }, nodes: [
            { n: UIT.T, config: { text: '  #', scale: 0.45, colour: C.UI.TEXT_LIGHT, shadow: true } },
        ] },
        { n: UIT.C, config: { align: 'cm', padding: 0.05, colour: C.L_BLACK, r: 0.1, minw: 0.9 }, nodes: [
            { n: UIT.T, config: { text: String(h.played), scale: 0.45, colour: C.FILTER, shadow: true } },
        ] },
    ] };
}

/** `create_UIBox_current_hands` */
export function currentHands(hands: Record<HandName, HandInfo>): UINodeDef {
    return { n: UIT.ROOT, config: { align: 'cm', minw: 3, padding: 0.1, r: 0.1, colour: C.CLEAR }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.04 }, nodes: HAND_ORDER.map((n) => currentHandRow(n, hands[n])) },
    ] };
}

/** 牌型提示里那排示例牌的区域（`CardArea(2,2, 3.5·CARD_W, 0.75·CARD_H, {card_limit = 5, type = 'title'})`） */
export type HandTipArea = UIObject & { kind: 'hand_tip'; hand: string };

/** `create_UIBox_hand_tip`（`UI_definitions.lua:3131`）：白底里一排半尺寸的示例牌；没有示例的牌型是空行 */
export function handTip(hand: string, hasExample: boolean): { def: UINodeDef; area: HandTipArea | null } {
    if (!hasExample) return { def: { n: UIT.R, config: { align: 'cm' }, nodes: [] }, area: null };
    const CARD_W = (2.4 * 35) / 41;
    const CARD_H = (2.4 * 47) / 41;
    const area: HandTipArea = { kind: 'hand_tip', hand, T: { x: 0, y: 0, w: 3.5 * CARD_W, h: 0.75 * CARD_H } };
    return { def: { n: UIT.R, config: { align: 'cm', colour: C.WHITE, r: 0.1 }, nodes: [
        { n: UIT.C, config: { align: 'cm' }, nodes: [{ n: UIT.O, config: { object: area } }] },
    ] }, area };
}

/** `create_popup_UIBox_tooltip`（`UI_definitions.lua:1284`）：红边白底，逐行深色字，末尾接 `filler` */
export function popupTooltip(text: readonly string[], filler: UINodeDef | null, title?: string): UINodeDef {
    const rows: UINodeDef[] = [];
    if (title) rows.push({ n: UIT.R, config: { align: 'cm' }, nodes: [{ n: UIT.C, config: { align: 'cm' }, nodes: [{ n: UIT.T, config: { text: title, colour: C.UI.TEXT_DARK, scale: 0.4 } }] }] });
    for (const line of text) rows.push({ n: UIT.R, config: { align: 'cm', padding: 0.03 }, nodes: [{ n: UIT.T, config: { text: line, colour: C.UI.TEXT_DARK, scale: 0.4 } }] });
    if (filler) rows.push(filler);
    return { n: UIT.ROOT, config: { align: 'cm', padding: 0.05, r: 0.1, colour: C.RED, emboss: 0.05 }, nodes: [
        { n: UIT.C, config: { align: 'cm', padding: 0.05, r: 0.1, colour: C.WHITE, emboss: 0.05 }, nodes: rows },
    ] };
}

/** Vouchers 页里的一格（`CardArea(..., {card_limit = 2, type = 'voucher'})`）：布局只要尺寸，卡由场景按 `align_cards` 摆 */
export type VoucherArea = UIObject & { kind: 'voucher_area'; keys: string[] };

/**
 * `G.UIDEF.used_vouchers`（`UI_definitions.lua:3538`）：优惠券按池序两两一组（一级与它的二级），兑换过的每组一格，
 * 满 5 格换行。格宽一张 1、两张 1.33 倍卡宽；10 格以上卡高缩到 0.75。一张都没有就一行「No vouchers redeemed」。
 * `poolOrder` 是 `G.P_CENTER_POOLS.Voucher`（按 `order` 排的 key）
 */
export function usedVouchers(poolOrder: string[], used: ReadonlySet<string>): { def: UINodeDef; areas: VoucherArea[] } {
    const CARD_W = (2.4 * 35) / 41;
    const CARD_H = (2.4 * 47) / 41;
    const groups: string[][] = [];
    poolOrder.forEach((key, i) => {
        const g = Math.floor((i + 1 - 0.1) / 2);
        groups[g] ??= [];
        if (used.has(key)) groups[g]!.push(key);
    });
    const filled = groups.filter((g) => g.length > 0);
    const areaCount = filled.length;
    if (areaCount === 0) {
        return { def: { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: [
            { n: UIT.O, config: { object: new DynaText({ string: [loc('ph_no_vouchers')], colours: [C.UI.TEXT_LIGHT], bump: true, scale: 0.6 }) } },
        ] }, areas: [] };
    }
    const areas: VoucherArea[] = [];
    const rows: UINodeDef[] = [];
    let row: UINodeDef[] = [];
    for (const keys of filled) {
        if (areas.length === 5 || areas.length === 10) {
            rows.push({ n: UIT.R, config: { align: 'cm', padding: 0, no_fill: true }, nodes: row });
            row = [];
        }
        const area: VoucherArea = { kind: 'voucher_area', keys, T: { x: 0, y: 0, w: (keys.length === 1 ? 1 : 1.33) * CARD_W, h: (areaCount >= 10 ? 0.75 : 1.07) * CARD_H } };
        areas.push(area);
        row.push({ n: UIT.C, config: { align: 'cm', padding: 0, no_fill: true }, nodes: [{ n: UIT.O, config: { object: area } }] });
    }
    rows.push({ n: UIT.R, config: { align: 'cm', padding: 0, no_fill: true }, nodes: row });
    return { def: { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: [
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.O, config: { object: new DynaText({ string: [loc('ph_vouchers_redeemed')], colours: [C.UI.TEXT_LIGHT], bump: true, scale: 0.6 }) } },
        ] },
        { n: UIT.R, config: { align: 'cm', minh: 0.5 }, nodes: [] },
        { n: UIT.R, config: { align: 'cm', colour: C.BLACK, r: 1, padding: 0.15, emboss: 0.05 }, nodes: [
            { n: UIT.R, config: { align: 'cm' }, nodes: rows },
        ] },
    ] }, areas };
}

/**
 * `G.FUNCS.change_tab`（`button_callbacks.lua:1348`）：换掉 `tab_contents` 里的盒子，再整盒重排、重新对齐。
 * 被点的按钮 `chosen`、同组别的清掉（`UIElement:click` 的 `choice` 那段）
 */
export function changeTab(box: UIBox, tab: Tab): void {
    const el = box.getById('tab_contents');
    if (!el) return;
    for (const e of box.root.walk()) if (e.config.choice) e.config.chosen = e.config.ref_table === tab;
    box.replaceObject(el, tabContents(tab));
    box.recalculate();
    box.realign();
}

/** `G.UIDEF.run_info`：三页，第一页选中 */
export function runInfo(pages: { hands: () => UINodeDef; blinds: () => UINodeDef; vouchers: () => UINodeDef; blindFuncs?: UIFuncs }): UINodeDef {
    return genericOptions({ contents: [createTabs([
        { label: loc('b_poker_hands'), chosen: true, definition: pages.hands },
        { label: loc('b_blinds'), definition: pages.blinds, funcs: pages.blindFuncs },
        { label: loc('b_vouchers'), definition: pages.vouchers },
    ], { tabH: 8 })] });
}
