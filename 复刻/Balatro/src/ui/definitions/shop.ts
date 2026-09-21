/**
 * 商店（22 号票）：`UI_definitions.lua:666` 的 `G.UIDEF.shop`（外框、Next Round / Reroll、三个 CardArea、
 * 左上的 SHOP 招牌）与 `:851` 的 `create_shop_card_ui`（每张卡的价签），逐节点直译。
 *
 * 三个 CardArea（货架 / 优惠券 / 补充包）以 O 节点嵌在外框里，布局只读它们的宽高；
 * 卡片怎么在区域里摆是 `align_cards` 的 shop 分支（`alignPlay`），由场景做。
 */
import { CARD_H, CARD_W } from '../../game/coords';
import { C, darken, lighten } from '../colours';
import { DynaText } from '../dynatext';
import { DICTIONARY } from '../lang.generated';
import { type Rect, type UINodeDef, type UIObject, UIT } from '../uibox';
import { dynContainer } from './blind-select';
import { locVariable } from './round-eval';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

/** 嵌在 UI 里的 CardArea：布局只要它的尺寸；摆好之后场景从 O 元素读它在房间里的位置 */
export type CardAreaObject = UIObject & { kind: 'card_area'; name: 'shop_jokers' | 'shop_vouchers' | 'shop_booster'; cardW: number };

/** 招牌动画（`AnimatedSprite(0,0, 4.4, 2.2, shop_sign)`，4 帧） */
export type ShopSignObject = UIObject & { kind: 'shop_sign'; shadowHeight: number };

export type ShopAreas = Record<CardAreaObject['name'], CardAreaObject>;

/** `G.UIDEF.shop` 里建的三个 CardArea（`joker_max` 是货架格数，缺省 2，Overstock 加） */
export function shopAreas(jokerMax: number): ShopAreas {
    const area = (name: CardAreaObject['name'], w: number, h: number, cardW = CARD_W): CardAreaObject =>
        ({ kind: 'card_area', name, cardW, T: { x: 0, y: 0, w, h } as Rect });
    return {
        shop_jokers: area('shop_jokers', jokerMax * 1.02 * CARD_W, 1.05 * CARD_H),
        shop_vouchers: area('shop_vouchers', 2.1 * CARD_W, 1.05 * CARD_H),
        shop_booster: area('shop_booster', 2.4 * CARD_W, 1.15 * CARD_H, 1.27 * CARD_W),
    };
}

/** 商店外框。`current_round` 是 `G.GAME.current_round`（Reroll 按钮绑它的 `reroll_cost`） */
export function createShop(areas: ShopAreas, ante: number, currentRound: { reroll_cost: number }): UINodeDef {
    return { n: UIT.ROOT, config: { align: 'cl', colour: C.CLEAR }, nodes: [
        dynContainer([
            { n: UIT.C, config: { align: 'cm', padding: 0.1, emboss: 0.05, r: 0.1, colour: C.DYN_UI.BOSS_MAIN }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: 0.05 }, nodes: [
                    { n: UIT.C, config: { align: 'cm', padding: 0.1 }, nodes: [
                        { n: UIT.R, config: { id: 'next_round_button', align: 'cm', minw: 2.8, minh: 1.5, r: 0.15, colour: C.RED, one_press: true, button: 'toggle_shop', hover: true, shadow: true }, nodes: [
                            { n: UIT.R, config: { align: 'cm', padding: 0.07, func: 'set_button_pip' }, nodes: [
                                { n: UIT.R, config: { align: 'cm', maxw: 1.3 }, nodes: [
                                    { n: UIT.T, config: { text: loc('b_next_round_1'), scale: 0.4, colour: C.WHITE, shadow: true } },
                                ] },
                                { n: UIT.R, config: { align: 'cm', maxw: 1.3 }, nodes: [
                                    { n: UIT.T, config: { text: loc('b_next_round_2'), scale: 0.4, colour: C.WHITE, shadow: true } },
                                ] },
                            ] },
                        ] },
                        { n: UIT.R, config: { align: 'cm', minw: 2.8, minh: 1.6, r: 0.15, colour: C.GREEN, button: 'reroll_shop', func: 'can_reroll', hover: true, shadow: true }, nodes: [
                            { n: UIT.R, config: { align: 'cm', padding: 0.07, func: 'set_button_pip' }, nodes: [
                                { n: UIT.R, config: { align: 'cm', maxw: 1.3 }, nodes: [
                                    { n: UIT.T, config: { text: loc('k_reroll'), scale: 0.4, colour: C.WHITE, shadow: true } },
                                ] },
                                { n: UIT.R, config: { align: 'cm', maxw: 1.3, minw: 1 }, nodes: [
                                    { n: UIT.T, config: { text: loc('$'), scale: 0.7, colour: C.WHITE, shadow: true } },
                                    { n: UIT.T, config: { ref_table: currentRound, ref_value: 'reroll_cost', scale: 0.75, colour: C.WHITE, shadow: true } },
                                ] },
                            ] },
                        ] },
                    ] },
                    { n: UIT.C, config: { align: 'cm', padding: 0.2, r: 0.2, colour: C.L_BLACK, emboss: 0.05, minw: 8.2 }, nodes: [
                        { n: UIT.O, config: { object: areas.shop_jokers } },
                    ] },
                ] },
                { n: UIT.R, config: { align: 'cm', minh: 0.2 }, nodes: [] },
                { n: UIT.R, config: { align: 'cm', padding: 0.1 }, nodes: [
                    { n: UIT.C, config: { align: 'cm', padding: 0.15, r: 0.2, colour: C.L_BLACK, emboss: 0.05 }, nodes: [
                        { n: UIT.C, config: { align: 'cm', padding: 0.2, r: 0.2, colour: C.BLACK, maxh: areas.shop_vouchers.T.h + 0.4 }, nodes: [
                            { n: UIT.T, config: { text: locVariable('ante_x_voucher', [ante]), scale: 0.45, colour: C.L_BLACK, vert: true } },
                            { n: UIT.O, config: { object: areas.shop_vouchers } },
                        ] },
                    ] },
                    { n: UIT.C, config: { align: 'cm', padding: 0.15, r: 0.2, colour: C.L_BLACK, emboss: 0.05 }, nodes: [
                        { n: UIT.O, config: { object: areas.shop_booster } },
                    ] },
                ] },
            ] },
        ], false),
    ] };
}

/** 左上的 SHOP 招牌（`G.SHOP_SIGN`），挂在左侧面板的 `row_blind` 上 */
export function createShopSign(): UINodeDef {
    const sign: ShopSignObject = { kind: 'shop_sign', shadowHeight: 0.05, T: { x: 0, y: 0, w: 4.4, h: 2.2 } };
    return { n: UIT.ROOT, config: { colour: C.DYN_UI.MAIN, emboss: 0.05, align: 'cm', r: 0.1, padding: 0.1 }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.1, minw: 4.72, minh: 3.1, colour: C.DYN_UI.DARK, r: 0.1 }, nodes: [
            { n: UIT.R, config: { align: 'cm' }, nodes: [{ n: UIT.O, config: { object: sign } }] },
            { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.O, config: { object: new DynaText({ string: [loc('ph_improve_run')], colours: [lighten(C.GOLD, 0.3)], shadow: true, rotate: true, float: true, bump: true, scale: 0.5, spacing: 1, pop_in: 1.5, maxw: 4.3 }) } },
            ] },
        ] },
    ] };
}

/**
 * `create_shop_card_ui` 的价签（t1）。挂在卡上：`tm`、offset.y 0.38（补充包 0.5）——
 * 不是贴内侧，所以价签整个在卡的上沿之上、再往下压 0.38
 */
export function priceTag(card: { cost: number }): UINodeDef {
    return { n: UIT.ROOT, config: { minw: 0.6, align: 'tm', colour: darken(C.BLACK, 0.2), shadow: true, r: 0.05, padding: 0.05, minh: 1 }, nodes: [
        { n: UIT.R, config: { align: 'cm', colour: lighten(C.BLACK, 0.1), r: 0.1, minw: 1, minh: 0.55, emboss: 0.05, padding: 0.03 }, nodes: [
            { n: UIT.O, config: { object: new DynaText({ string: [{ prefix: loc('$'), ref_table: card, ref_value: 'cost' }], colours: [C.MONEY], shadow: true, silent: true, bump: true, pop_in: 0, scale: 0.5 }) } },
        ] },
    ] };
}
