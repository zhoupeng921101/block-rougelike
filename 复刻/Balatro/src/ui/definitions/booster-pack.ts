/**
 * 开包界面（22 号票）：`UI_definitions.lua:1736` 起的五个 `create_UIBox_*_pack`，逐节点直译。
 *
 * 五个函数只差两处：标题的本地化键，与 `G.pack_cards` 的宽度（奥秘 / 幽灵 `size·CARD_W`，
 * 标准 / 小丑 `size·CARD_W·1.1`，天体再加 0.5）。所以这里合成一个、按口味取这两项。
 *
 * 外框挂在手牌区上：`align = 'tmi'`、落定后 `offset.y = −2.2`（`game.lua:3727`）。
 * 包里的牌怎么在区域里摆是 `align_cards` 的 consumeable 分支，由场景做。
 */
import type { BoosterKind } from '../../core/boosters';
import { CARD_H, CARD_W } from '../../game/coords';
import { C } from '../colours';
import { DynaText } from '../dynatext';
import { DICTIONARY } from '../lang.generated';
import { type Rect, type UINodeDef, type UIObject, UIT } from '../uibox';
import { dynContainer } from './blind-select';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

/** `G.pack_cards`：布局只读它的尺寸 */
export type PackCardsObject = UIObject & { kind: 'card_area'; name: 'pack_cards' };

const TITLE: Record<BoosterKind, string> = {
    Arcana: 'k_arcana_pack',
    Spectral: 'k_spectral_pack',
    Standard: 'k_standard_pack',
    Buffoon: 'k_buffoon_pack',
    Celestial: 'k_celestial_pack',
};

/** `G.pack_cards = CardArea(…, w, 1.05·CARD_H, …)`；`size` 是 `G.GAME.pack_size`（包的 `extra`） */
export function packCardsArea(kind: BoosterKind, size: number): PackCardsObject {
    const w =
        kind === 'Arcana' || kind === 'Spectral' ? size * CARD_W
        : kind === 'Celestial' ? size * CARD_W * 1.1 + 0.5
        : size * CARD_W * 1.1;
    return { kind: 'card_area', name: 'pack_cards', T: { x: 0, y: 0, w, h: 1.05 * CARD_H } as Rect };
}

/** `game` 是 `G.GAME` 的同形对象，「Choose N」绑它的 `pack_choices` */
export function createBoosterPack(kind: BoosterKind, area: PackCardsObject, game: { pack_choices: number }): UINodeDef {
    const dt = (string: ConstructorParameters<typeof DynaText>[0]['string'], scale: number, extra: object = {}) =>
        ({ n: UIT.O, config: { object: new DynaText({ string, colours: [C.WHITE], shadow: true, rotate: true, bump: true, spacing: 2, scale, ...extra }) } }) as UINodeDef;
    return { n: UIT.ROOT, config: { align: 'tm', r: 0.15, colour: C.CLEAR, padding: 0.15 }, nodes: [
        { n: UIT.R, config: { align: 'cl', colour: C.CLEAR, r: 0.15, padding: 0.1, minh: 2, shadow: true }, nodes: [
            { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.C, config: { align: 'cm', padding: 0.1 }, nodes: [
                    { n: UIT.C, config: { align: 'cm', r: 0.2, colour: C.CLEAR, shadow: true }, nodes: [
                        { n: UIT.O, config: { object: area } },
                    ] },
                ] },
            ] },
            { n: UIT.R, config: { align: 'cm' }, nodes: [] },
            { n: UIT.R, config: { align: 'tm' }, nodes: [
                { n: UIT.C, config: { align: 'tm', padding: 0.05, minw: 2.4 }, nodes: [] },
                { n: UIT.C, config: { align: 'tm', padding: 0.05 }, nodes: [
                    dynContainer([
                        { n: UIT.C, config: { align: 'cm', padding: 0.05, minw: 4 }, nodes: [
                            { n: UIT.R, config: { align: 'bm', padding: 0.05 }, nodes: [
                                dt([loc(TITLE[kind])], 0.7, { maxw: 4, pop_in: 0.5 }),
                            ] },
                            { n: UIT.R, config: { align: 'bm', padding: 0.05 }, nodes: [
                                dt([`${loc('k_choose')} `], 0.5, { pop_in: 0.7 }),
                                dt([{ ref_table: game, ref_value: 'pack_choices' }], 0.5, { pop_in: 0.7 }),
                            ] },
                        ] },
                    ], false),
                ] },
                { n: UIT.C, config: { align: 'tm', padding: 0.05, minw: 2.4 }, nodes: [
                    { n: UIT.R, config: { minh: 0.2 }, nodes: [] },
                    { n: UIT.R, config: { align: 'tm', padding: 0.2, minh: 1.2, minw: 1.8, r: 0.15, colour: C.GREY, one_press: true, button: 'skip_booster', hover: true, shadow: true, func: 'can_skip_booster' }, nodes: [
                        { n: UIT.T, config: { text: loc('b_skip'), scale: 0.5, colour: C.WHITE, shadow: true, func: 'set_button_pip' } },
                    ] },
                ] },
            ] },
        ] },
    ] };
}
