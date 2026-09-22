/**
 * View Deck（`G.FUNCS.deck_info` → `G.UIDEF.deck_info`，`UI_definitions.lua:3217`）：点牌堆打开的全屏 overlay。
 * 选牌 / 出牌 / 摸牌中打开有两页（Remaining 选中、Full Deck），其余时候只有 Full Deck。
 *
 * 每页是 `G.UIDEF.view_deck`（`:3345`）：左边牌组名与牌组说明、各类计数（`tally_sprite`）与点数列，右边每个花色一行
 * `CardArea`（`title` 类型、卡宽 0.7），里面是整副牌的缩小复制品。Remaining 页里不在牌堆（也不是盖着摸进手里）的牌是灰的。
 * 计数在「按底色 / 实际生效」不一样时，DynaText 在两个数之间轮播（第二个数是蓝的）。
 */
import { type Card, type Suit, getId, getNominal, isFace } from '../../core/card';
import { isStone } from '../../core/enhancements';
import { C, type Colour, mixColours } from '../colours';
import { DynaText } from '../dynatext';
import { EN_FONT } from '../font';
import { DICTIONARY, V_DICTIONARY } from '../lang.generated';
import { localize, locMisc, type LocVars } from '../localize';
import { UIBox, type UINodeDef, type UIObject, UIT } from '../uibox';
import { descFromRows } from './card-popup';
import { isSuitForPreview } from './deck-preview';
import type { SpriteObject } from './hud';
import { genericOptions } from './overlay';
import { createTabs } from './run-info';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';
const CARD_W = (2.4 * 35) / 41;
const CARD_H = (2.4 * 47) / 41;

/** 一行花色的 `CardArea`（`title`、`view_deck`、卡宽 0.7·CARD_W），`cards` 已按 `get_nominal('suit')` 从大到小 */
export type ViewDeckArea = UIObject & { kind: 'view_deck'; suit: Suit; cards: Array<{ card: Card; greyed: boolean }> };

export type ViewDeckInput = {
    playingCards: readonly Card[];
    inDeck: ReadonlySet<Card>;
    wheelFlipped: ReadonlySet<Card>;
    smeared: boolean;
    pareidolia: boolean;
    /** `G.GAME.selected_back`：名字（`loc_name`）与说明的 key、变量 */
    back: { name: string; key: string; vars: LocVars };
    /** `G.F_MOBILE`：说明字号 ×1.45 */
    mobile: boolean;
};

const SUIT_MAP: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];

type TallyValue = [{ string: string; colour: Colour }, { string: string; colour: Colour }];

/** `tally_sprite`（`UI_definitions.lua:3517`）：一个 `ui_1` 图标，下面是数（两数相同是普通文字，不同是轮播的 DynaText） */
function tallySprite(pos: { x: number; y: number }, value: TallyValue, tooltip: string[]): UINodeDef {
    const same = value[0].string === value[1].string;
    const sprite: SpriteObject = { kind: 'sprite', atlas: 'ui_1', pos, T: { x: 0, y: 0, w: 0.5, h: 0.5 } };
    return { n: UIT.C, config: { align: 'cm', padding: 0.07, tooltip: { text: tooltip } }, nodes: [
        { n: UIT.R, config: { align: 'cm', r: 0.1, padding: 0.04, emboss: 0.05, colour: C.JOKER_GREY }, nodes: [
            { n: UIT.O, config: { w: 0.5, h: 0.5, can_collide: false, object: sprite, tooltip: { text: tooltip } } },
        ] },
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            same
                ? { n: UIT.T, config: { text: value[0].string, colour: value[0].colour ?? C.WHITE, scale: 0.4, lang: EN_FONT, shadow: true } }
                : { n: UIT.O, config: { object: new DynaText({ string: value.map((v) => ({ string: v.string, colour: v.colour })), colours: [C.RED], scale: 0.4, silent: true, shadow: true, pop_in_rate: 10, pop_delay: 4 }) } },
        ] },
    ] };
}

/** `Back:generate_UI(nil, 0.7, 0.5)`：牌组说明（`desc_from_rows(loc_nodes, true, min_dims·5)`） */
function backUi(back: ViewDeckInput['back'], mobile: boolean): UINodeDef {
    const minDims = 0.5;
    const nodes: UINodeDef[][] = [];
    localize({ type: 'descriptions', key: back.key, set: 'Back', nodes, vars: back.vars, mobile });
    return { n: UIT.ROOT, config: { align: 'cm', minw: minDims * 5, minh: minDims * 2.5, id: back.name, colour: C.CLEAR }, nodes: [
        descFromRows(nodes, true, minDims * 5),
    ] };
}

export function viewDeck(input: ViewDeckInput, unplayedOnly: boolean): { def: UINodeDef; areas: ViewDeckArea[] } {
    const sorted = [...input.playingCards].sort((a, b) => getNominal(b, 'suit') - getNominal(a, 'suit'));
    const bySuit: Record<Suit, Card[]> = { Spades: [], Hearts: [], Clubs: [], Diamonds: [] };
    for (const v of sorted) bySuit[v.base.suit].push(v);
    const counted = (v: Card) => input.inDeck.has(v) || input.wheelFlipped.has(v);

    const areas: ViewDeckArea[] = [];
    const deckTables: UINodeDef[] = [];
    for (const suit of SUIT_MAP) {
        if (!bySuit[suit].length) continue;
        const area: ViewDeckArea = {
            kind: 'view_deck', suit, T: { x: 0, y: 0, w: 6.5 * CARD_W, h: 0.6 * CARD_H },
            cards: bySuit[suit].map((card) => ({ card, greyed: unplayedOnly && !counted(card) })),
        };
        areas.push(area);
        deckTables.push({ n: UIT.R, config: { align: 'cm', padding: 0 }, nodes: [{ n: UIT.O, config: { object: area } }] });
    }

    let flipCol: Colour = C.WHITE;
    const suitTallies: Record<Suit, number> = { Spades: 0, Hearts: 0, Clubs: 0, Diamonds: 0 };
    const modSuitTallies: Record<Suit, number> = { Spades: 0, Hearts: 0, Clubs: 0, Diamonds: 0 };
    const rankTallies = new Array<number>(13).fill(0);
    const modRankTallies = new Array<number>(13).fill(0);
    const rankNames = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let face = 0, modFace = 0, num = 0, modNum = 0, ace = 0, modAce = 0, wheelFlipped = 0;

    for (const v of sorted) {
        if (isStone(v) || (unplayedOnly && !counted(v))) continue;
        if (input.wheelFlipped.has(v) && unplayedOnly) wheelFlipped++;
        suitTallies[v.base.suit]++;
        for (const s of SUIT_MAP) if (isSuitForPreview(v, s, input.smeared)) modSuitTallies[s]++;
        const id = getId(v);
        if (id === 11 || id === 12 || id === 13) face++;
        if (isFace(v, input.pareidolia)) modFace++;
        if (id > 1 && id < 11) {
            num++;
            if (!v.debuff) modNum++;
        }
        if (id === 14) {
            ace++;
            if (!v.debuff) modAce++;
        }
        rankTallies[id - 2]!++;
        if (!v.debuff) modRankTallies[id - 2]!++;
    }

    const modded = face !== modFace || SUIT_MAP.some((s) => modSuitTallies[s] !== suitTallies[s]);
    if (wheelFlipped > 0) flipCol = mixColours(C.FILTER, C.WHITE, 0.7);
    const pair = (a: number, b: number): TallyValue => [{ string: `${a}`, colour: flipCol }, { string: `${b}`, colour: C.BLUE }];

    const rankCols: UINodeDef[] = [];
    for (let i = 12; i >= 0; i--) {
        const delta = modRankTallies[i] !== rankTallies[i];
        rankCols.push({ n: UIT.R, config: { align: 'cm', padding: 0.07 }, nodes: [
            { n: UIT.C, config: { align: 'cm', r: 0.1, padding: 0.04, emboss: 0.04, minw: 0.5, colour: C.L_BLACK }, nodes: [
                { n: UIT.T, config: { text: rankNames[i], lang: EN_FONT, colour: C.JOKER_GREY, scale: 0.35, shadow: true } },
            ] },
            { n: UIT.C, config: { align: 'cr', minw: 0.4 }, nodes: [
                delta
                    ? { n: UIT.O, config: { object: new DynaText({ string: pair(rankTallies[i]!, modRankTallies[i]!), colours: [C.RED], scale: 0.4, y_offset: -2, silent: true, shadow: true, pop_in_rate: 10, pop_delay: 4 }) } }
                    : { n: UIT.T, config: { text: `${rankTallies[i]}`, lang: EN_FONT, colour: flipCol, scale: 0.45, shadow: true } },
            ] },
        ] });
    }

    const suitName = (s: Suit) => locMisc(s, 'suits_plural');
    const wheelKey = wheelFlipped > 1 ? 'deck_preview_wheel_plural' : 'deck_preview_wheel_singular';
    const def: UINodeDef = { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.05 }, nodes: [] },
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.C, config: { align: 'cm', minw: 1.5, minh: 2, r: 0.1, colour: C.BLACK, emboss: 0.05 }, nodes: [
                { n: UIT.C, config: { align: 'cm', padding: 0.1 }, nodes: [
                    { n: UIT.R, config: { align: 'cm', r: 0.1, colour: C.L_BLACK, emboss: 0.05, padding: 0.15 }, nodes: [
                        { n: UIT.R, config: { align: 'cm' }, nodes: [
                            { n: UIT.O, config: { object: new DynaText({ string: [input.back.name], colours: [C.WHITE], bump: true, rotate: true, shadow: true, scale: 0.6 - input.back.name.length * 0.01 }) } },
                        ] },
                        { n: UIT.R, config: { align: 'cm', r: 0.1, padding: 0.1, minw: 2.5, minh: 1.3, colour: C.WHITE, emboss: 0.05 }, nodes: [
                            { n: UIT.O, config: { object: new UIBox(backUi(input.back, input.mobile), { offset: { x: 0, y: 0 } }) } },
                        ] },
                    ] },
                    { n: UIT.R, config: { align: 'cm', r: 0.1, outline_colour: C.L_BLACK, line_emboss: 0.05, outline: 1.5 }, nodes: [
                        { n: UIT.R, config: { align: 'cm', minh: 0.05, padding: 0.07 }, nodes: [
                            { n: UIT.O, config: { object: new DynaText({
                                string: modded ? [{ string: loc('k_base_cards'), colour: C.RED }, { string: loc('k_effective'), colour: C.BLUE }] : [{ string: loc('k_base_cards'), colour: C.RED }],
                                colours: [C.RED], silent: true, scale: 0.4, pop_in_rate: 10, pop_delay: 4,
                            }) } },
                        ] },
                        { n: UIT.R, config: { align: 'cm', minh: 0.05, padding: 0.1 }, nodes: [
                            tallySprite({ x: 1, y: 0 }, pair(ace, modAce), [loc('k_aces')]),
                            tallySprite({ x: 2, y: 0 }, pair(face, modFace), [loc('k_face_cards')]),
                            tallySprite({ x: 3, y: 0 }, pair(num, modNum), [loc('k_numbered_cards')]),
                        ] },
                        { n: UIT.R, config: { align: 'cm', minh: 0.05, padding: 0.1 }, nodes: [
                            tallySprite({ x: 3, y: 1 }, pair(suitTallies.Spades, modSuitTallies.Spades), [suitName('Spades')]),
                            tallySprite({ x: 0, y: 1 }, pair(suitTallies.Hearts, modSuitTallies.Hearts), [suitName('Hearts')]),
                        ] },
                        { n: UIT.R, config: { align: 'cm', minh: 0.05, padding: 0.1 }, nodes: [
                            tallySprite({ x: 2, y: 1 }, pair(suitTallies.Clubs, modSuitTallies.Clubs), [suitName('Clubs')]),
                            tallySprite({ x: 1, y: 1 }, pair(suitTallies.Diamonds, modSuitTallies.Diamonds), [suitName('Diamonds')]),
                        ] },
                    ] },
                ] },
                { n: UIT.C, config: { align: 'cm' }, nodes: rankCols },
                { n: UIT.B, config: { w: 0.1, h: 0.1 } },
            ] },
            { n: UIT.B, config: { w: 0.2, h: 0.1 } },
            { n: UIT.C, config: { align: 'cm', padding: 0.1, r: 0.1, colour: C.BLACK, emboss: 0.05 }, nodes: deckTables },
        ] },
        { n: UIT.R, config: { align: 'cm', minh: 0.8, padding: 0.05 }, nodes: [
            modded ? { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.C, config: { padding: 0.3, r: 0.1, colour: mixColours(C.BLUE, C.WHITE, 0.7) }, nodes: [] },
                { n: UIT.T, config: { text: ` ${loc('ph_deck_preview_effective')}`, colour: C.WHITE, scale: 0.3 } },
            ] } : null,
            wheelFlipped > 0 ? { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.C, config: { padding: 0.3, r: 0.1, colour: flipCol }, nodes: [] },
                { n: UIT.T, config: { text: ` ${(V_DICTIONARY[wheelKey] ?? 'ERROR').replace('#1#', String(wheelFlipped))}`, colour: C.WHITE, scale: 0.3 } },
            ] } : null,
        ] },
    ] };
    return { def, areas };
}

/**
 * `G.UIDEF.deck_info(_show_remaining)`。`onPage` 在每次建页（包括切页）时拿到那一页的花色行，场景据此摆卡
 */
export function deckInfo(input: ViewDeckInput, showRemaining: boolean, onPage: (areas: ViewDeckArea[]) => void): UINodeDef {
    const page = (unplayed: boolean) => () => {
        const r = viewDeck(input, unplayed);
        onPage(r.areas);
        return r.def;
    };
    const tabs = showRemaining
        ? [
            { label: loc('b_remaining'), chosen: true, definition: page(true) },
            { label: loc('b_full_deck'), definition: page(false) },
        ]
        : [{ label: loc('b_full_deck'), chosen: true, definition: page(false) }];
    return genericOptions({ contents: [createTabs(tabs, { tabH: 8 })] });
}
