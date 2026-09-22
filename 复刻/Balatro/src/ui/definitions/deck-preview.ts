/**
 * `G.UIDEF.deck_preview`（`UI_definitions.lua:498`）：选牌时悬停牌堆弹出的「牌堆里还剩什么」——
 * 左边一列花色计数（Stone Card 那一行只有牌组里有石头牌才有字），右边一张点数 × 花色的表。
 *
 * 计入的是**还在牌堆里的牌**与**被盖着摸进手里的牌**（`wheel_flipped`：盖牌 Boss 摸进来的，玩家看不到是什么）。
 * 括号里的是「按 `is_suit` 算」的花色数（万能牌、Smeared Joker），与按底色算的不同时才显示。
 */
import { type Card, type Suit } from '../../core/card';
import { isStone } from '../../core/enhancements';
import { C, type Colour, adjustAlpha, mixColours } from '../colours';
import { EN_FONT } from '../font';
import { DICTIONARY, V_DICTIONARY } from '../lang.generated';
import { type UINodeDef, UIT } from '../uibox';
import type { SpriteObject } from './hud';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

export type DeckPreviewInput = {
    /** `G.playing_cards`（整副牌） */
    playingCards: readonly Card[];
    /** 在牌堆里的（`v.area == G.deck`） */
    inDeck: ReadonlySet<Card>;
    /** 盖着摸进手里的（`v.ability.wheel_flipped`） */
    wheelFlipped: ReadonlySet<Card>;
    /** 场上有 Smeared Joker（`is_suit` 红黑各算一色） */
    smeared: boolean;
};

const SUIT_MAP: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];

/** `card.lua:4067` 的 `Card:is_suit`（不 bypass debuff：被削弱的牌一个花色都不算） */
export function isSuitForPreview(card: Card, suit: Suit, smeared: boolean): boolean {
    if (card.debuff) return false;
    if (isStone(card)) return false;
    if (card.enhancement === 'm_wild') return true;
    const red = (s: Suit) => s === 'Hearts' || s === 'Diamonds';
    if (smeared && red(card.base.suit) === red(suit)) return true;
    return card.base.suit === suit;
}

export function deckPreview(input: DeckPreviewInput): UINodeDef {
    const minh = 0.35;
    const minw = 0.5;
    const suitLabels: UINodeDef[] = [];
    const suitCounts: Record<Suit, number> = { Spades: 0, Hearts: 0, Clubs: 0, Diamonds: 0 };
    const modSuitCounts: Record<Suit, number> = { Spades: 0, Hearts: 0, Clubs: 0, Diamonds: 0 };
    let modSuitDiff = false;
    let wheelFlipped = 0;
    const rankCounts: Record<number, number> = {};
    const deckTables: UINodeDef[] = [];
    const bySuit: Record<Suit, number[]> = { Spades: [], Hearts: [], Clubs: [], Diamonds: [] };

    let stones: number | null = null;
    for (const v of input.playingCards) {
        if (isStone(v)) stones ??= 0;
        const flipped = input.wheelFlipped.has(v);
        if (!input.inDeck.has(v) && !flipped) continue;
        if (flipped) wheelFlipped++;
        if (isStone(v)) {
            stones = (stones ?? 0) + 1;
            continue;
        }
        for (const s of SUIT_MAP) {
            if (v.base.suit === s) suitCounts[s]++;
            if (isSuitForPreview(v, s, input.smeared)) modSuitCounts[s]++;
        }
        bySuit[v.base.suit][v.base.id] = (bySuit[v.base.suit][v.base.id] ?? 0) + 1;
        rankCounts[v.base.id] = (rankCounts[v.base.id] ?? 0) + 1;
    }

    const wheelFlippedText: UINodeDef | null = wheelFlipped > 0 ? { n: UIT.T, config: { text: '?', colour: C.FILTER, scale: 0.25, shadow: true } } : null;
    const flipCol: Colour = wheelFlippedText ? mixColours(C.FILTER, C.WHITE, 0.7) : C.WHITE;

    suitLabels.push({ n: UIT.R, config: { align: 'cm', r: 0.1, padding: 0.04, minw, minh: 2 * minh + 0.25 }, nodes: stones !== null ? [
        { n: UIT.T, config: { text: `${loc('ph_deck_preview_stones')}: `, colour: C.WHITE, scale: 0.25, shadow: true } },
        { n: UIT.T, config: { text: `${stones}`, colour: stones > 0 ? C.WHITE : C.UI.TRANSPARENT_LIGHT, scale: 0.4, shadow: true } },
    ] : [] });

    const rankNames = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    let row: UINodeDef[] = [];
    let bgCol: Colour = C.JOKER_GREY;
    rankNames.forEach((v, k0) => {
        const k = k0 + 1;
        const tscale = 0.3;
        let rankCol = v === 'A' ? bgCol : v === 'K' || v === 'Q' || v === 'J' ? C.WHITE : bgCol;
        rankCol = mixColours(rankCol, bgCol, 0.8);
        row.push({ n: UIT.C, config: { align: 'cm' }, nodes: [
            { n: UIT.C, config: { align: 'cm', r: 0.1, minw, minh, colour: rankCol, emboss: 0.04, padding: 0.03 }, nodes: [
                { n: UIT.R, config: { align: 'cm' }, nodes: [
                    { n: UIT.T, config: { text: v, colour: C.BLACK, lang: EN_FONT, scale: 1.6 * tscale } },
                ] },
                { n: UIT.R, config: { align: 'cm', minw: minw + 0.04, minh, colour: C.L_BLACK, r: 0.1 }, nodes: [
                    { n: UIT.T, config: { text: `${rankCounts[15 - k] ?? 0}`, lang: EN_FONT, colour: flipCol, scale: tscale, shadow: true } },
                ] },
            ] },
        ] });
    });
    deckTables.push({ n: UIT.R, config: { align: 'cm', padding: 0.04 }, nodes: row });

    for (const suit of SUIT_MAP) {
        row = [];
        bgCol = mixColours(C.SUITS[suit]!, C.L_BLACK, 0.7);
        for (let i = 14; i >= 2; i--) {
            const n = bySuit[suit][i] ?? 0;
            row.push({ n: UIT.C, config: { align: 'cm', padding: 0.05, minw: minw + 0.098, minh }, nodes: [
                { n: UIT.T, config: { text: `${n}`, colour: n > 0 ? flipCol : C.UI.TRANSPARENT_LIGHT, scale: n > 0 ? 0.3 : 0.25, shadow: true, lang: EN_FONT } },
            ] });
        }
        deckTables.push({ n: UIT.R, config: { align: 'cm', r: 0.1, padding: 0.04, minh: 0.4, colour: bgCol }, nodes: row });
    }

    for (const suit of SUIT_MAP) {
        // `ui_1` 图集第二行：红心 0、方块 1、梅花 2、黑桃 3
        const x = suit === 'Spades' ? 3 : suit === 'Hearts' ? 0 : suit === 'Clubs' ? 2 : 1;
        const sprite: SpriteObject = { kind: 'sprite', atlas: 'ui_1', pos: { x, y: 1 }, T: { x: 0, y: 0, w: 0.3, h: 0.3 } };
        if (modSuitCounts[suit] !== suitCounts[suit]) modSuitDiff = true;
        suitLabels.push({ n: UIT.R, config: { align: 'cm', r: 0.1, padding: 0.03, colour: C.JOKER_GREY }, nodes: [
            { n: UIT.C, config: { align: 'cm', minw, minh }, nodes: [
                { n: UIT.O, config: { can_collide: false, object: sprite } },
            ] },
            { n: UIT.C, config: { align: 'cm', minw: minw * 2.4, minh, colour: C.L_BLACK, r: 0.1 }, nodes: [
                { n: UIT.T, config: { text: `${suitCounts[suit]}`, colour: flipCol, scale: 0.3, shadow: true, lang: EN_FONT } },
                ...(modSuitCounts[suit] !== suitCounts[suit]
                    ? [{ n: UIT.T, config: { text: ` (${modSuitCounts[suit]})`, colour: mixColours(C.BLUE, C.WHITE, 0.7), scale: 0.28, shadow: true, lang: EN_FONT } }]
                    : []),
            ] },
        ] });
    }

    const wheelKey = wheelFlipped > 1 ? 'deck_preview_wheel_plural' : 'deck_preview_wheel_singular';
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.JOKER_GREY, r: 0.1, emboss: 0.05, padding: 0.07 }, nodes: [
        { n: UIT.R, config: { align: 'cm', r: 0.1, emboss: 0.05, colour: C.BLACK, padding: 0.1 }, nodes: [
            { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.C, config: { align: 'cm', padding: 0.04 }, nodes: suitLabels },
                { n: UIT.C, config: { align: 'cm', padding: 0.02 }, nodes: deckTables },
            ] },
            modSuitDiff ? { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.C, config: { padding: 0.3, r: 0.1, colour: mixColours(C.BLUE, C.WHITE, 0.7) }, nodes: [] },
                { n: UIT.T, config: { text: ` ${loc('ph_deck_preview_effective')}`, colour: C.WHITE, scale: 0.3 } },
            ] } : null,
            wheelFlippedText ? { n: UIT.R, config: { align: 'cm' }, nodes: [
                { n: UIT.C, config: { padding: 0.3, r: 0.1, colour: flipCol }, nodes: [] },
                { n: UIT.T, config: { text: ` ${(V_DICTIONARY[wheelKey] ?? 'ERROR').replace('#1#', String(wheelFlipped))}`, colour: C.WHITE, scale: 0.3 } },
            ] } : null,
        ] },
    ] };
}

/**
 * 牌堆上的「View Deck」（`cardarea.lua:394` 的 `children.view_deck`）：挂在最上面那张牌中间（`cm`），
 * 悬停牌堆时才画；本身 `collide.can = false`，点下去点的是底下那张牌（→ `deck_info`）
 */
export function viewDeckLabel(): UINodeDef {
    return { n: UIT.ROOT, config: { align: 'cm', padding: 0.1, r: 0.1, colour: C.CLEAR }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.05, r: 0.1, colour: adjustAlpha(C.BLACK, 0.5), button: 'deck_info' }, nodes: [
            { n: UIT.R, config: { align: 'cm', maxw: 2 }, nodes: [{ n: UIT.T, config: { text: loc('k_view'), scale: 0.48, colour: C.WHITE, shadow: true } }] },
            { n: UIT.R, config: { align: 'cm', maxw: 2 }, nodes: [{ n: UIT.T, config: { text: loc('k_deck'), scale: 0.38, colour: C.WHITE, shadow: true } }] },
        ] },
    ] };
}
