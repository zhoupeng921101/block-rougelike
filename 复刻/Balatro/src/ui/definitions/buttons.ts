/**
 * `UI_definitions.lua:1090` 的 `create_UIBox_buttons`：手牌下面的「出牌 / 排序 / 弃牌」（22 号票）。逐节点直译。
 *
 * 两个外部开关按参数传进来：`G.SETTINGS.play_button_pos`（缺省 2 = 出牌在左，`globals.lua:199`）
 * 与 `G.F_MOBILE`（排序那两个小按钮在移动版上大一号）。
 * 按钮名（`play_cards_from_highlighted` 等）照原作，由场景接到对应的操作上。
 */
import { C, mixColours } from '../colours';
import { DICTIONARY } from '../lang.generated';
import { type UINodeDef, UIT } from '../uibox';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

export function createButtons(opts: { playButtonPos?: 1 | 2; mobile?: boolean } = {}): UINodeDef {
    const textScale = 0.45;
    const buttonHeight = 1.3;
    const mobile = opts.mobile ?? false;

    const play: UINodeDef = { n: UIT.C, config: { id: 'play_button', align: 'tm', minw: 2.5, padding: 0.3, r: 0.1, hover: true, colour: C.BLUE, button: 'play_cards_from_highlighted', one_press: true, shadow: true, func: 'can_play' }, nodes: [
        { n: UIT.R, config: { align: 'bcm', padding: 0 }, nodes: [
            { n: UIT.T, config: { text: loc('b_play_hand'), scale: textScale, colour: C.UI.TEXT_LIGHT, func: 'set_button_pip' } },
        ] },
    ] };

    const discard: UINodeDef = { n: UIT.C, config: { id: 'discard_button', align: 'tm', padding: 0.3, r: 0.1, minw: 2.5, minh: buttonHeight, hover: true, colour: C.RED, button: 'discard_cards_from_highlighted', one_press: true, shadow: true, func: 'can_discard' }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [
            { n: UIT.T, config: { text: loc('b_discard'), scale: textScale, colour: C.UI.TEXT_LIGHT, func: 'set_button_pip' } },
        ] },
    ] };

    const sortButton = (label: string, button: string): UINodeDef => ({
        n: UIT.C, config: { align: 'cm', minh: mobile ? 0.8 : 0.7, minw: mobile ? 1.3 : 0.9, padding: 0.1, r: 0.1, hover: true, colour: C.ORANGE, button, shadow: true }, nodes: [
            { n: UIT.T, config: { text: loc(label), scale: textScale * 0.7, colour: C.UI.TEXT_LIGHT } },
        ],
    });

    return { n: UIT.ROOT, config: { align: 'cm', minw: 1, minh: 0.3, padding: 0.15, r: 0.1, colour: C.CLEAR }, nodes: [
        opts.playButtonPos === 1 ? discard : play,
        { n: UIT.C, config: { align: 'cm', padding: 0.1, r: 0.1, colour: C.UI.TRANSPARENT_DARK, outline: 1.5, outline_colour: mixColours(C.WHITE, C.JOKER_GREY, 0.7), line_emboss: 1 }, nodes: [
            { n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [
                    { n: UIT.T, config: { text: loc('b_sort_hand'), scale: textScale * 0.8, colour: C.UI.TEXT_LIGHT } },
                ] },
                { n: UIT.R, config: { align: 'cm', padding: 0.1 }, nodes: [
                    sortButton('k_rank', 'sort_hand_value'),
                    sortButton('k_suit', 'sort_hand_suit'),
                ] },
            ] },
        ] },
        opts.playButtonPos === 1 ? play : discard,
    ] };
}
