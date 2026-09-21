/**
 * 「增删牌」那一组小丑（8 张）的测试，外加这一刀顺带修掉的两处时序。
 *
 * 口径与前几批一样：期望值手算、算式写进用例名。
 *
 * 这一批与前几批不同的地方是**它们改的是小丑区与牌组本身**，所以一半用例
 * 要走真的 `Run`：`setting_blind` 那一趟的「先标记、跑完、再增删」、
 * `joker_buffer` 的记账、`playing_card_added` 的几个触发点，都只有整条链跑起来才看得见。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Card, type Suit, type Value, makeCard, makeStandardDeck, resetCardCounters } from '../card';
import { Run } from '../run';
import { calculateJoker } from './calculate';
import { makeGameView } from './game-view';
import { makeJoker } from './instance';
import type { Joker } from './types';

function c(spec: string): Card {
    const suitMap: Record<string, Suit> = { S: 'Spades', H: 'Hearts', C: 'Clubs', D: 'Diamonds' };
    const valMap: Record<string, Value> = {
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        T: '10', J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace',
    };
    return makeCard(spec, suitMap[spec[0]], valMap[spec.slice(1)]);
}

beforeEach(() => resetCardCounters());

// ————————————————————————————————————————————————————————————————
// setting_blind 那一趟：Madness / Ceremonial Dagger / Riff-raff
// ————————————————————————————————————————————————————————————————

describe('Madness / Ceremonial Dagger / Riff-raff —— 单张的规则', () => {
    it('Madness：非 Boss 长 0.5，并判一张别的小丑死刑；**不动 joker_buffer**', () => {
        const madness = makeJoker('j_madness');
        const a = makeJoker('j_joker');
        const b = makeJoker('j_greedy_joker');
        const sliced: Joker[] = [];
        const view = makeGameView({
            jokers: [madness, a, b],
            pseudorandom: (key, min, max) => {
                expect(key).toBe('madness');
                expect([min, max]).toEqual([1, 2]);
                return 2;
            },
            sliceJoker: (j) => sliced.push(j),
        });
        calculateJoker(madness, { setting_blind: true }, view);
        expect(madness.ability.x_mult).toBe(1.5);
        expect(sliced).toEqual([b]);
        expect(view.jokerBuffer).toBe(0);
    });

    it('Madness：Boss 盲注什么都不做', () => {
        const madness = makeJoker('j_madness');
        calculateJoker(madness, { setting_blind: true, blind_boss: true }, makeGameView({ jokers: [madness] }));
        expect(madness.ability.x_mult).toBe(1);
    });

    it('Madness：没有可毁的**照样长**，而且**不掷点**', () => {
        const madness = makeJoker('j_madness');
        // 这张视图一掷点就抛
        calculateJoker(madness, { setting_blind: true }, makeGameView({ jokers: [madness] }));
        expect(madness.ability.x_mult).toBe(1.5);
    });

    it('Madness：已被判死刑的不在候选里', () => {
        const madness = makeJoker('j_madness');
        const doomed = makeJoker('j_joker');
        doomed.getting_sliced = true;
        calculateJoker(madness, { setting_blind: true }, makeGameView({ jokers: [madness, doomed] }));
        expect(madness.ability.x_mult).toBe(1.5); // 长了，但没掷点（否则视图会抛）
    });

    it('Ceremonial Dagger：切右边那张，mult += 2 × 卖价（Joker 卖 $1 → +2），buffer -1', () => {
        const dagger = makeJoker('j_ceremonial');
        const right = makeJoker('j_joker');
        const sliced: Joker[] = [];
        const view = makeGameView({ jokers: [dagger, right], sliceJoker: (j) => sliced.push(j) });
        calculateJoker(dagger, { setting_blind: true }, view);
        expect(sliced).toEqual([right]);
        expect(dagger.ability.mult).toBe(2);
        expect(view.jokerBuffer).toBe(-1);
    });

    it('Ceremonial Dagger：最右边的那张没东西可切', () => {
        const dagger = makeJoker('j_ceremonial');
        const left = makeJoker('j_joker');
        calculateJoker(dagger, { setting_blind: true }, makeGameView({ jokers: [left, dagger] }));
        expect(dagger.ability.mult).toBe(0);
    });

    it('Ceremonial Dagger：攒下的 mult 在主遍历里给出来', () => {
        const dagger = makeJoker('j_ceremonial');
        dagger.ability.mult = 6;
        const e = calculateJoker(dagger, { cardarea: 'jokers' }, makeGameView({ jokers: [dagger] }));
        expect(e?.mult_mod).toBe(6);
    });

    it('Riff-raff：空位 = 格数 - (张数 + buffer)，最多造 2 张普通小丑', () => {
        const riff = makeJoker('j_riff_raff');
        const queued: Array<[string, number]> = [];
        const view = makeGameView({
            jokers: [riff, makeJoker('j_joker'), makeJoker('j_joker'), makeJoker('j_joker')],
            joker_slots: 5,
            queueJoker: (k, r) => queued.push([k, r]),
        });
        // 5 - (4 + 0) = 1 → 造 1 张
        calculateJoker(riff, { setting_blind: true }, view);
        expect(queued).toEqual([['rif', 0]]);
        expect(view.jokerBuffer).toBe(1);
    });

    it('Riff-raff：buffer 已经把空位吃满了就不造', () => {
        const riff = makeJoker('j_riff_raff');
        const view = makeGameView({ jokers: [riff], joker_slots: 5, jokerBuffer: 4 });
        // 5 - (1 + 4) = 0；这张视图一造小丑就抛
        expect(calculateJoker(riff, { setting_blind: true }, view)).toBeNull();
    });

    it('被判死刑的小丑，自己的 setting_blind 不跑', () => {
        const riff = makeJoker('j_riff_raff');
        riff.getting_sliced = true;
        expect(calculateJoker(riff, { setting_blind: true }, makeGameView({ jokers: [riff] }))).toBeNull();
    });
});

describe('setting_blind 那一趟 —— 走真的 Run', () => {
    it('[Dagger, Joker, Riff-raff]：Dagger 切掉 Joker（buffer -1），Riff-raff 于是造满 2 张 → 剩 4 张', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const dagger = makeJoker('j_ceremonial');
        const victim = makeJoker('j_joker');
        const riff = makeJoker('j_riff_raff');
        run.jokers.push(dagger, victim, riff);

        run.startRound();
        // 空位 5 - (3 + -1) = 3 → min(2, 3) = 2
        expect(run.jokers).toHaveLength(4);
        expect(run.jokers).not.toContain(victim);
        expect(run.jokers.slice(0, 2)).toEqual([dagger, riff]);
        expect(dagger.ability.mult).toBe(2);
        // `_rarity = 0` → 普通
        for (const made of run.jokers.slice(2)) expect(made.center.rarity).toBe(1);
        // 标记清干净了
        expect(run.jokers.some((j) => j.getting_sliced)).toBe(false);
    });

    it('Madness 在 Boss 之外每关都吃掉一张', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const madness = makeJoker('j_madness');
        run.jokers.push(madness, makeJoker('j_joker'), makeJoker('j_greedy_joker'));
        run.startRound();
        expect(run.jokers).toHaveLength(2);
        expect(run.jokers[0]).toBe(madness);
        expect(madness.ability.x_mult).toBe(1.5);
    });

    it('Riff-raff 造出来的 Juggler **这一关就加手牌**——setting_blind 跑在发牌之前', () => {
        // 找一个 Riff-raff 能造出 Juggler 的 seed
        for (let i = 0; i < 400; i++) {
            const run = new Run(`R${i}`, makeStandardDeck());
            run.jokers.push(makeJoker('j_riff_raff'));
            const round = run.startRound();
            if (!run.jokers.some((j) => j.ability.name === 'Juggler')) continue;
            expect(round.handLimit).toBe(9);
            expect(round.hand).toHaveLength(9);
            return;
        }
        throw new Error('400 个 seed 里 Riff-raff 一次 Juggler 都没造出来');
    });
});

// ————————————————————————————————————————————————————————————————
// 往牌组里加牌：Marble / DNA / Hologram
// ————————————————————————————————————————————————————————————————

describe('Hologram 与 playing_card_added 的触发点', () => {
    it('Hologram：一次加 2 张 → x_mult 1 + 0.25×2 = 1.5', () => {
        const holo = makeJoker('j_hologram');
        calculateJoker(holo, { playing_card_added: true, cards: [true, true] }, makeGameView({ jokers: [holo] }));
        expect(holo.ability.x_mult).toBe(1.5);
    });

    it('Marble Joker 的石头牌**这一关就在牌堆里**（原文 `draw_card(G.play, G.deck)` 在洗牌之前）', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_marble'));
        const round = run.startRound();
        expect(run.fullDeck).toHaveLength(53);
        const stone = run.fullDeck.find((card) => card.enhancement === 'm_stone')!;
        expect([...round.deck, ...round.hand]).toContain(stone);
    });

    it('Marble + Hologram：进盲注造一张石头牌 → Hologram 1.25', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const holo = makeJoker('j_hologram');
        run.jokers.push(makeJoker('j_marble'), holo);
        run.startRound();
        expect(holo.ability.x_mult).toBe(1.25);
    });

    it('DNA：本回合第一手只出一张 → 复制进手牌与牌组；第二手不再复制', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const holo = makeJoker('j_hologram');
        run.jokers.push(makeJoker('j_dna'), holo);
        const round = run.startRound();

        const played = round.hand[0];
        round.play([played]);
        expect(run.fullDeck).toHaveLength(53);
        const copy = run.fullDeck[52];
        expect(copy).not.toBe(played);
        expect(copy.key).toBe(played.key);
        expect(round.hand).toContain(copy);
        // DNA 造牌之后当场跑了一趟 playing_card_added
        expect(holo.ability.x_mult).toBe(1.25);

        round.play([round.hand[0]]);
        expect(run.fullDeck).toHaveLength(53);
    });

    it('DNA：出两张不复制', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_dna'));
        const round = run.startRound();
        round.play(round.hand.slice(0, 2));
        expect(run.fullDeck).toHaveLength(52);
    });

    it('DNA 的复制品带着永久筹码与强化（`copy_card` 抄整个 ability）', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_dna'));
        const round = run.startRound();
        const played = round.hand[0];
        played.perma_bonus = 15;
        played.enhancement = 'm_mult';
        round.play([played]);
        const copy = run.fullDeck[52];
        expect(copy.perma_bonus).toBe(15);
        expect(copy.enhancement).toBe('m_mult');
    });
});

// ————————————————————————————————————————————————————————————————
// Invisible Joker
// ————————————————————————————————————————————————————————————————

describe('Invisible Joker', () => {
    it('每熬过一回合 +1', () => {
        const inv = makeJoker('j_invisible');
        calculateJoker(inv, { end_of_round: true }, makeGameView({ jokers: [inv] }));
        calculateJoker(inv, { end_of_round: true }, makeGameView({ jokers: [inv] }));
        expect(inv.ability.invis_rounds).toBe(2);
    });

    it('熬够 2 回合后卖掉：复制一张别的，Negative 剥掉', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const inv = makeJoker('j_invisible');
        inv.ability.invis_rounds = 2;
        const other = makeJoker('j_joker');
        other.edition = 'negative';
        other.ability.mult = 7;
        run.jokers.push(inv, other);

        run.sellJoker(0);
        expect(run.jokers).toHaveLength(2);
        const [kept, copy] = run.jokers;
        expect(kept).toBe(other);
        expect(copy.key).toBe('j_joker');
        expect(copy.edition).toBeUndefined();
        expect(copy.ability.mult).toBe(7);
        // 深拷贝：改原件不影响复制品
        other.ability.mult = 1;
        expect(copy.ability.mult).toBe(7);
    });

    it('小丑区满格也能复制——判定时自己还在区里（`#jokers <= card_limit`）', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const inv = makeJoker('j_invisible');
        inv.ability.invis_rounds = 2;
        run.jokers.push(inv, ...['j_joker', 'j_joker', 'j_joker', 'j_joker'].map((k) => makeJoker(k)));
        expect(run.jokersFull).toBe(true);
        run.sellJoker(0);
        expect(run.jokers).toHaveLength(5);
    });

    it('没熬够就卖：什么都不发生', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const inv = makeJoker('j_invisible');
        inv.ability.invis_rounds = 1;
        run.jokers.push(inv, makeJoker('j_joker'));
        run.sellJoker(0);
        expect(run.jokers).toHaveLength(1);
    });
});

// ————————————————————————————————————————————————————————————————
// Caino / Yorick
// ————————————————————————————————————————————————————————————————

describe('Caino / Yorick', () => {
    it('Caino：毁掉 K、Q、5 → 两张人头，caino_xmult 1 + 2 = 3，主遍历给 ×3', () => {
        const caino = makeJoker('j_caino');
        const view = makeGameView({ jokers: [caino] });
        calculateJoker(caino, { remove_playing_cards: true, removed: [c('SK'), c('HQ'), c('D5')] }, view);
        expect(caino.ability.caino_xmult).toBe(3);
        expect(calculateJoker(caino, { cardarea: 'jokers' }, view)?.Xmult_mod).toBe(3);
    });

    it('Caino：没攒过就不给（`caino_xmult > 1`）', () => {
        const caino = makeJoker('j_caino');
        expect(calculateJoker(caino, { cardarea: 'jokers' }, makeGameView({ jokers: [caino] }))).toBeNull();
    });

    it('Yorick：第 23 张弃牌那一下长 1（x_mult 1 → 2），计数回到 23', () => {
        const yorick = makeJoker('j_yorick');
        const view = makeGameView({ jokers: [yorick] });
        const card = c('S2');
        for (let i = 0; i < 22; i++) {
            calculateJoker(yorick, { discard: true, other_card: card, full_hand: [card] }, view);
        }
        expect(yorick.ability.x_mult).toBe(1);
        expect(yorick.ability.yorick_discards).toBe(1);
        calculateJoker(yorick, { discard: true, other_card: card, full_hand: [card] }, view);
        expect(yorick.ability.x_mult).toBe(2);
        expect(yorick.ability.yorick_discards).toBe(23);
    });
});

// ————————————————————————————————————————————————————————————————
// 顺带修掉的时序
// ————————————————————————————————————————————————————————————————

describe('顺带修掉的时序', () => {
    /**
     * `state_events.lua:545`：本回合出牌数在**结算之后**才 +1。
     * 原先复刻件在结算之前就加了，结算里读到的第一手是 1——
     * Sixth Sense 在真局里**一次都没触发过**（单测用的是手写的视图，所以一直是绿的）。
     */
    it('Sixth Sense 在真局里第一手出一张 6 就触发：牌被毁、造一张幽灵牌', () => {
        for (let i = 0; i < 200; i++) {
            const run = new Run(`X${i}`, makeStandardDeck());
            run.jokers.push(makeJoker('j_sixth_sense'));
            const round = run.startRound();
            const six = round.hand.find((card) => card.base.id === 6);
            if (!six) continue;
            round.play([six]);
            expect(run.fullDeck).not.toContain(six);
            expect(run.fullDeck).toHaveLength(51);
            expect(run.consumables.map((x) => x.center.set)).toEqual(['Spectral']);
            return;
        }
        throw new Error('200 个 seed 的起手都没有 6');
    });

    it('Round 的小丑格数含 Negative 多给的那一格（原先写死 5）', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const neg = makeJoker('j_joker');
        neg.edition = 'negative';
        run.jokers.push(neg);
        const round = run.startRound();
        expect(run.jokerSlots).toBe(6);
        expect(round.jokerSlots).toBe(6);
    });
});
