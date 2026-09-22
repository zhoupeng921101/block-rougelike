/**
 * 卡牌提示框对拍原作（22 号票）：`tools/popup-oracle.py` 原样调用 `generate_UIBox_ability_table` 与 `card_h_popup`。
 * 卡与 `G.GAME` 两边照同一份构造（`MAKE_CARD` / `GAME`）。
 */
import { describe, expect, it } from 'vitest';

import { type PopupCard, type PopupGame, abilityTable, cardHPopup, tagAbilityTable } from './definitions/card-popup';
import { P_CENTERS } from './descriptions.generated';
import { DynaText } from './dynatext';
import oracle from './popup-oracle.generated.json';
import { UIBox, type UIElement, type UINodeDef, UIT } from './uibox';

type Texts = Record<string, { name: string; main: string[]; info: Array<{ name: string; rows: string[] }> }>;
const O = oracle as unknown as { texts: Texts; tags: Texts; layouts: Record<string, Array<[number, string, number, number, number, number]>> };

const HANDS = ['Flush Five', 'Flush House', 'Five of a Kind', 'Straight Flush', 'Four of a Kind', 'Full House', 'Flush', 'Straight', 'Three of a Kind', 'Two Pair', 'Pair', 'High Card'];
const GAME: PopupGame = {
    probabilitiesNormal: 1,
    hands: Object.fromEntries(HANDS.map((h) => [h, { level: h === 'Pair' ? 3 : 1, l_mult: 2, l_chips: 20 }])),
    tarotUsed: 2,
    planetsUsed: 2,
    dollars: 12,
    idolCard: { rank: 'Ace', suit: 'Hearts' },
    ancientSuit: 'Clubs',
    castleSuit: 'Spades',
    mailRank: 'King',
    startingDeckSize: 52,
    playingCards: 50,
    deckCards: 44,
    jokers: [{ sell_cost: 3, negative: false }, { sell_cost: 2, negative: false }],
    lastTarotPlanet: 'c_mars',
    ectoMinus: 1,
    bossDisableable: false,
    mobile: false,
};

/** 与 oracle 的 `MAKE_CARD` 同一个构造（`Card:set_ability` 的形状） */
function makeCard(key: string, opts: Partial<PopupCard> = {}): PopupCard {
    const c = P_CENTERS[key]!;
    const cfg = c.config;
    const ability: Record<string, unknown> = {
        name: c.name, effect: c.effect, set: c.set,
        mult: cfg.mult ?? 0, h_mult: cfg.h_mult ?? 0, h_x_mult: cfg.h_x_mult ?? 0, h_dollars: cfg.h_dollars ?? 0,
        p_dollars: cfg.p_dollars ?? 0, t_mult: cfg.t_mult ?? 0, t_chips: cfg.t_chips ?? 0, x_mult: cfg.Xmult ?? 1,
        h_size: cfg.h_size ?? 0, d_size: cfg.d_size ?? 0, extra: cfg.extra === undefined ? undefined : JSON.parse(JSON.stringify(cfg.extra)),
        extra_value: 0, type: cfg.type ?? '', order: c.order, perma_bonus: 0, bonus: cfg.bonus ?? 0,
    };
    if (c.consumeable) ability.consumeable = cfg;
    if (c.name === 'Invisible Joker') ability.invis_rounds = 0;
    if (c.name === 'To Do List') ability.to_do_poker_hand = 'Flush';
    if (c.name === 'Caino') ability.caino_xmult = 1;
    if (c.name === 'Yorick') ability.yorick_discards = (cfg.extra as { discards: number }).discards;
    if (c.name === 'Loyalty Card') ability.loyalty_remaining = (cfg.extra as { every: number }).every;
    return { centerKey: key, ability, ...opts };
}

function nodeText(n: UINodeDef, out: string[]): void {
    if (n.n === UIT.T) out.push(String(n.config?.text ?? ''));
    else if (n.n === UIT.O && n.config?.object instanceof DynaText) out.push(n.config.object.text);
    for (const c of n.nodes ?? []) if (c) nodeText(c, out);
}
const rowText = (row: UINodeDef[]) => { const out: string[] = []; for (const n of row) nodeText(n, out); return out.join(''); };

describe('提示框文本：274 张卡逐行对拍', () => {
    const keys = Object.keys(O.texts);
    it('覆盖小丑 150、塔罗 22、星球 12、幽灵 18、优惠券 32、补充包 32、强化 8', () => {
        expect(keys).toHaveLength(274);
    });
    // Misprint 原作是随机滚动的 DynaText，复刻件定格一帧，单独不比
    it.each(keys.filter((k) => k !== 'j_misprint'))('%s', (key) => {
        const base = key.startsWith('m_') ? { value: '7', suit: 'Hearts', nominal: 7 } : undefined;
        const aut = abilityTable(makeCard(key, { area: 'jokers', base }), GAME);
        const got = {
            name: Array.isArray(aut.name) ? rowText(aut.name) : '',
            main: aut.main.map(rowText),
            info: aut.info.map((b) => ({ name: b.name ?? '', rows: b.map(rowText) })),
        };
        // Lua 的空表导出成 `{}`：数组位上归一成 `[]`
        const arr = <T,>(v: T[] | object): T[] => (Array.isArray(v) ? v : []);
        const want = O.texts[key]!;
        expect(got).toEqual({ name: want.name, main: arr(want.main), info: arr(want.info).map((b) => ({ name: b.name, rows: arr(b.rows) })) });
    });
});

describe('标签提示框：Tag:get_uibox_table 逐行对拍', () => {
    const keys = Object.keys(O.tags);
    it('24 个标签 + Orbital 没掷过牌型', () => expect(keys).toHaveLength(25));
    it.each(keys)('%s', (id) => {
        const [key, variant] = id.split('/');
        const aut = tagAbilityTable(key!, variant === 'unrolled' ? undefined : 'Pair', { handsPlayed: 7, unusedDiscards: 3, skips: 2 }, GAME);
        const arr = <T,>(v: T[] | object): T[] => (Array.isArray(v) ? v : []);
        const want = O.tags[id]!;
        expect({
            name: Array.isArray(aut.name) ? rowText(aut.name) : '',
            main: aut.main.map(rowText),
            info: aut.info.map((b) => ({ name: b.name ?? '', rows: b.map(rowText) })),
        }).toEqual({ name: want.name, main: arr(want.main), info: arr(want.info).map((b) => ({ name: b.name, rows: arr(b.rows) })) });
    });
});

describe('提示框布局：card_h_popup 整框', () => {
    const cases: Array<[string, PopupCard]> = [
        ['joker', makeCard('j_joker', { area: 'jokers' })],
        ['lucky_cat_foil', makeCard('j_lucky_cat', { area: 'jokers', edition: 'foil' })],
        ['tarot_magician', makeCard('c_magician', { area: 'consumeables' })],
        ['planet_mercury', makeCard('c_mercury', { area: 'consumeables' })],
        ['voucher', makeCard('v_overstock_norm')],
        ['booster', makeCard('p_arcana_normal_1')],
        ['card_ace', makeCard('c_base', { base: { value: 'Ace', suit: 'Spades', nominal: 11 } })],
        ['card_bonus_red_seal', makeCard('m_bonus', { base: { value: '7', suit: 'Hearts', nominal: 7 }, seal: 'Red' })],
    ];
    it.each(cases)('%s', (name, card) => {
        const box = new UIBox(cardHPopup(card, abilityTable(card, GAME)), { align: 'cm', offset: { x: 0, y: 0 }, major: { T: { x: 5, y: 3, w: 2, h: 3 } } });
        const out: Array<[number, string, number, number, number, number]> = [];
        const walk = (e: UIElement) => {
            const obj = e.config.object;
            const text = e.UIT === UIT.T ? String(e.config.text ?? '') : obj instanceof DynaText ? obj.text : '';
            out.push([e.UIT, text, e.x, e.y, e.T.w, e.T.h]);
            for (const c of e.children) walk(c);
        };
        walk(box.root);
        const expected = O.layouts[name]!;
        expect(out.map((r) => [r[0], r[1]])).toEqual(expected.map((r) => [r[0], r[1]]));
        out.forEach((r, i) => {
            for (let k = 2; k < 6; k++) expect(r[k], `#${i} ${r[1]} [${'xywh'[k - 2]}]`).toBeCloseTo(expected[i]![k] as number, 9);
        });
    });
});
