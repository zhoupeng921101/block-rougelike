/**
 * 选中一张卡之后挂在它身上的按钮（22 号票）：
 * - 商店：`create_shop_card_ui`（`UI_definitions.lua:851`）的 t2（BUY / REDEEM / OPEN）与 t3（BUY & USE）
 * - 小丑区 / 消耗品区 / 开包：`G.UIDEF.use_and_sell_buttons`（`:268`）
 *
 * 逐节点直译。按钮名与 `func`（置灰）都照原文，场景把它们接到 `Run` 上。
 */
import { C } from '../colours';
import { DICTIONARY } from '../lang.generated';
import type { UINodeDef } from '../uibox';
import { UIT } from '../uibox';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

/** 卡在按钮定义里被读的那几项（`ref_table = card`） */
export type ButtonCard = { T: { w: number; h: number }; sell_cost_label: number | string };

/** t2：优惠券 REDEEM、补充包 OPEN、其余 BUY。挂法 `bm`、offset (0, −0.3) */
export function shopBuyButton(set: 'Voucher' | 'Booster' | 'other', card: object): UINodeDef {
    if (set === 'Voucher') {
        return { n: UIT.ROOT, config: { ref_table: card, minw: 1.1, maxw: 1.3, padding: 0.1, align: 'bm', colour: C.GREEN, shadow: true, r: 0.08, minh: 0.94, func: 'can_redeem', one_press: true, button: 'redeem_from_shop', hover: true }, nodes: [
            { n: UIT.T, config: { text: loc('b_redeem'), colour: C.WHITE, scale: 0.4 } },
        ] };
    }
    if (set === 'Booster') {
        return { n: UIT.ROOT, config: { ref_table: card, minw: 1.1, maxw: 1.3, padding: 0.1, align: 'bm', colour: C.GREEN, shadow: true, r: 0.08, minh: 0.94, func: 'can_open', one_press: true, button: 'open_booster', hover: true }, nodes: [
            { n: UIT.T, config: { text: loc('b_open'), colour: C.WHITE, scale: 0.5 } },
        ] };
    }
    return { n: UIT.ROOT, config: { ref_table: card, minw: 1.1, maxw: 1.3, padding: 0.1, align: 'bm', colour: C.GOLD, shadow: true, r: 0.08, minh: 0.94, func: 'buy_button_check', one_press: true, button: 'buy_from_shop', hover: true }, nodes: [
        { n: UIT.T, config: { text: loc('b_buy'), colour: C.WHITE, scale: 0.5 } },
    ] };
}

/** t3：消耗品的 BUY & USE。挂法 `cr`、offset (−0.3, 0) */
export function buyAndUseButton(card: object): UINodeDef {
    return { n: UIT.ROOT, config: { id: 'buy_and_use', ref_table: card, minh: 1.1, padding: 0.1, align: 'cr', colour: C.RED, shadow: true, r: 0.08, minw: 1.1, func: 'buy_and_use_button_check', one_press: true, button: 'buy_from_shop', hover: true }, nodes: [
        { n: UIT.B, config: { w: 0.1, h: 0.6 } },
        { n: UIT.C, config: { align: 'cm' }, nodes: [
            { n: UIT.R, config: { align: 'cm', maxw: 1 }, nodes: [
                { n: UIT.T, config: { text: loc('b_buy'), colour: C.WHITE, scale: 0.5 } },
            ] },
            { n: UIT.R, config: { align: 'cm', maxw: 1 }, nodes: [
                { n: UIT.T, config: { text: loc('b_and_use'), colour: C.WHITE, scale: 0.3 } },
            ] },
        ] },
    ] };
}

/**
 * `G.UIDEF.use_and_sell_buttons(card)`。`area`：卡在哪个区（`joker` 类型 = 小丑区与消耗品区，`pack` = `G.pack_cards`）；
 * `consumeable`：`card.ability.consumeable`。挂法见 `Card:highlight`：小丑区 / 消耗品区 `cr`、offset (x_off − 0.4, 0)，
 * 其余 `bmi`、offset (0, 0.65)；x_off 消耗品 −0.1、其余 0
 */
export function useAndSellButtons(card: ButtonCard, area: 'joker' | 'pack', consumeable: boolean): UINodeDef {
    let sell: UINodeDef | null = null;
    let use: UINodeDef | null = null;
    if (area === 'joker') {
        sell = { n: UIT.C, config: { align: 'cr' }, nodes: [
            { n: UIT.C, config: { ref_table: card, align: 'cr', padding: 0.1, r: 0.08, minw: 1.25, hover: true, shadow: true, colour: C.UI.BACKGROUND_INACTIVE, one_press: true, button: 'sell_card', func: 'can_sell_card' }, nodes: [
                { n: UIT.B, config: { w: 0.1, h: 0.6 } },
                { n: UIT.C, config: { align: 'tm' }, nodes: [
                    { n: UIT.R, config: { align: 'cm', maxw: 1.25 }, nodes: [
                        { n: UIT.T, config: { text: loc('b_sell'), colour: C.UI.TEXT_LIGHT, scale: 0.4, shadow: true } },
                    ] },
                    { n: UIT.R, config: { align: 'cm' }, nodes: [
                        { n: UIT.T, config: { text: loc('$'), colour: C.WHITE, scale: 0.4, shadow: true } },
                        { n: UIT.T, config: { ref_table: card, ref_value: 'sell_cost_label', colour: C.WHITE, scale: 0.55, shadow: true } },
                    ] },
                ] },
            ] },
        ] };
    }
    if (consumeable) {
        if (area === 'pack') {
            return { n: UIT.ROOT, config: { padding: 0, colour: C.CLEAR }, nodes: [
                { n: UIT.R, config: { mid: true }, nodes: [] },
                { n: UIT.R, config: { ref_table: card, r: 0.08, padding: 0.1, align: 'bm', minw: 0.5 * card.T.w - 0.15, minh: 0.8 * card.T.h, maxw: 0.7 * card.T.w - 0.15, hover: true, shadow: true, colour: C.UI.BACKGROUND_INACTIVE, one_press: true, button: 'use_card', func: 'can_use_consumeable' }, nodes: [
                    { n: UIT.T, config: { text: loc('b_use'), colour: C.UI.TEXT_LIGHT, scale: 0.55, shadow: true } },
                ] },
            ] };
        }
        use = { n: UIT.C, config: { align: 'cr' }, nodes: [
            { n: UIT.C, config: { ref_table: card, align: 'cr', maxw: 1.25, padding: 0.1, r: 0.08, minw: 1.25, minh: area === 'joker' ? 0 : 1, hover: true, shadow: true, colour: C.UI.BACKGROUND_INACTIVE, one_press: true, button: 'use_card', func: 'can_use_consumeable' }, nodes: [
                { n: UIT.B, config: { w: 0.1, h: 0.6 } },
                { n: UIT.T, config: { text: loc('b_use'), colour: C.UI.TEXT_LIGHT, scale: 0.55, shadow: true } },
            ] },
        ] };
    } else if (area === 'pack') {
        return { n: UIT.ROOT, config: { padding: 0, colour: C.CLEAR }, nodes: [
            { n: UIT.R, config: { ref_table: card, r: 0.08, padding: 0.1, align: 'bm', minw: 0.5 * card.T.w - 0.15, maxw: 0.9 * card.T.w - 0.15, minh: 0.3 * card.T.h, hover: true, shadow: true, colour: C.UI.BACKGROUND_INACTIVE, one_press: true, button: 'use_card', func: 'select_button_check' }, nodes: [
                { n: UIT.T, config: { text: loc('b_select'), colour: C.UI.TEXT_LIGHT, scale: 0.45, shadow: true } },
            ] },
        ] };
    }
    return { n: UIT.ROOT, config: { padding: 0, colour: C.CLEAR }, nodes: [
        { n: UIT.C, config: { padding: 0.15, align: 'cl' }, nodes: [
            { n: UIT.R, config: { align: 'cl' }, nodes: sell ? [sell] : [] },
            { n: UIT.R, config: { align: 'cl' }, nodes: use ? [use] : [] },
        ] },
    ] };
}
