/**
 * 强化牌那一组小丑（9 张）的测试。
 *
 * 口径与 `calculate.test.ts` / `batch2.test.ts` 一样：
 * **期望值全是手算的，算式写在用例名里**。没有外部真值（04 号票），
 * 手算错了测试照样绿，所以算式必须留痕。
 *
 * 这一批与前两批的不同之处：**它们全都要碰牌面的强化**——
 * 有的数整副牌（Steel / Stone / Driver's License）、有的当场改强化（Midas / Vampire）、
 * 有的靠牌面的掷点结果（Lucky Cat）、有的靠销毁（Glass Joker）。
 * 所以这里的 helper 比前两批多两件事：**给牌挂强化**与**分 key 的掷点**。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Card, type Suit, type Value, makeCard, resetCardCounters } from '../card';
import { type HandName, evaluatePlay, initialHands } from '../scoring';
import { calculateJoker } from './calculate';
import { makeGameView } from './game-view';
import { refreshDerivedAbilities } from './derived';
import { makeJoker } from './instance';
import { runModifiers } from './modifiers';
import type { GameView, Joker } from './types';

/** `"S3"` / `"HK:m_gold"`——冒号后面是强化 key */
function c(spec: string, x = 0): Card {
    const [face, enhancement] = spec.split(':');
    const suitMap: Record<string, Suit> = { S: 'Spades', H: 'Hearts', C: 'Clubs', D: 'Diamonds' };
    const valMap: Record<string, Value> = {
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        T: '10', J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace',
    };
    const card = makeCard(face, suitMap[face[0]], valMap[face.slice(1)]);
    card.enhancement = enhancement ?? null;
    card.T.x = x;
    return card;
}

const EMPTY_HANDS: Record<HandName, Card[][]> = Object.fromEntries(
    Object.keys(initialHands()).map((name) => [name, []]),
) as unknown as Record<HandName, Card[][]>;

type Scene = {
    play: string[];
    held?: string[];
    jokers?: string[];
    /**
     * 整副牌（`G.playing_cards`）。**只给它就够了**——
     * Steel / Stone / Driver's License 三张数的是它，不是牌堆。
     * 不给就拿打出去的那几张当整副牌。
     */
    deck?: string[];
    /**
     * 按 key 给固定掷点结果。**没登记的 key 一掷就抛**——
     * 静默返回 0 会让「这一处到底掷没掷」无声通过，那是最难查的一类错。
     */
    rolls?: Record<string, number>;
};

type RunResult = {
    score: number;
    dollars: number;
    view: GameView;
    jokers: Joker[];
    played: Card[];
    destroyed: Card[];
    /** 每个 key 被掷了几次。用来断言「这一处不该消耗 RNG」 */
    rollCounts: Record<string, number>;
};

function run(scene: Scene): RunResult {
    const jokers = (scene.jokers ?? []).map((k) => makeJoker(k));
    const hands = initialHands();
    const played = scene.play.map((s, i) => c(s, i * 2.05));
    const held = (scene.held ?? []).map((s, i) => c(s, 100 + i));
    const fullDeck = scene.deck ? scene.deck.map((s) => c(s)) : played;

    refreshDerivedAbilities(jokers, 5, fullDeck);
    const mods = runModifiers(jokers);

    const rollCounts: Record<string, number> = {};
    const view = makeGameView({
        hands,
        jokers,
        handCards: held,
        dollars: 0,
        deckCount: 0,
        startingDeckSize: fullDeck.length,
        playingCardCount: fullDeck.length,
        smeared: mods.smeared,
        probabilities: { normal: mods.probabilityNormal },
        current_round: { hands_left: 3, discards_left: 3, hands_played: 0 },
        pseudorandom: (key) => {
            rollCounts[key] = (rollCounts[key] ?? 0) + 1;
            const v = scene.rolls?.[key];
            if (v === undefined) throw new Error(`这个用例没给 ${key} 的掷点结果`);
            return v;
        },
    });

    const r = evaluatePlay(played, hands, view, mods.flags);
    return {
        score: r.score,
        dollars: r.dollars,
        view,
        jokers,
        played,
        destroyed: r.destroyed,
        rollCounts,
    };
}

beforeEach(() => resetCardCounters());

// ————————————————————————————————————————————————————————————————
// 数整副牌的三张：tally 由 derived.ts 重算
// ————————————————————————————————————————————————————————————————

describe('Steel / Stone Joker 与 Driver 执照 —— 数整副牌', () => {
    it('Steel Joker：整副牌 3 张钢铁 → ×(1+0.2×3)=×1.6。一对 3 → 16 × (2×1.6) = 51', () => {
        // handChips = 10 + 3 + 3 = 16，mult = 2 × 1.6 = 3.2，16 × 3.2 = 51.2 → floor 51
        const r = run({
            play: ['S3', 'H3', 'D9', 'C4', 'D6'],
            jokers: ['j_steel_joker'],
            deck: ['SA:m_steel', 'HA:m_steel', 'CA:m_steel', 'D2'],
        });
        expect(r.jokers[0].ability.steel_tally).toBe(3);
        expect(r.score).toBe(51);
    });

    it('Steel Joker：整副牌一张钢铁也没有 → 16 × 2 = 32（`tally > 0` 的护栏）', () => {
        const r = run({
            play: ['S3', 'H3', 'D9', 'C4', 'D6'],
            jokers: ['j_steel_joker'],
            deck: ['D2'],
        });
        expect(r.jokers[0].ability.steel_tally).toBe(0);
        expect(r.score).toBe(32);
    });

    it('Stone Joker：整副牌 2 张石头 → +25×2 筹码。一对 3 → (16+50) × 2 = 132', () => {
        const r = run({
            play: ['S3', 'H3', 'D9', 'C4', 'D6'],
            jokers: ['j_stone'],
            deck: ['SA:m_stone', 'HA:m_stone', 'D2'],
        });
        expect(r.jokers[0].ability.stone_tally).toBe(2);
        expect(r.score).toBe(132);
    });

    it('Driver 执照：整副牌 16 张带强化 → ×3。一对 3 → 16 × (2×3) = 96', () => {
        const deck = Array.from({ length: 16 }, (_, i) => `S${'23456789TJQKA'[i % 13]}:m_bonus`);
        const r = run({ play: ['S3', 'H3', 'D9', 'C4', 'D6'], jokers: ['j_drivers_license'], deck });
        expect(r.jokers[0].ability.driver_tally).toBe(16);
        expect(r.score).toBe(96);
    });

    it('Driver 执照：15 张就差一张，什么都不给——门槛 `>= 16` 是写死的，不是 `extra`', () => {
        const deck = Array.from({ length: 15 }, (_, i) => `S${'23456789TJQKA'[i % 13]}:m_bonus`);
        const r = run({ play: ['S3', 'H3', 'D9', 'C4', 'D6'], jokers: ['j_drivers_license'], deck });
        expect(r.jokers[0].ability.driver_tally).toBe(15);
        expect(r.score).toBe(32);
    });

    it('Driver 执照数的是**任意强化**，不挑种类：8 种各一张 = 8', () => {
        const kinds = [
            'm_bonus', 'm_mult', 'm_wild', 'm_glass',
            'm_steel', 'm_stone', 'm_gold', 'm_lucky',
        ];
        const deck = kinds.map((k, i) => `S${'23456789'[i]}:${k}`);
        const r = run({ play: ['S3', 'H3', 'D9', 'C4', 'D6'], jokers: ['j_drivers_license'], deck });
        expect(r.jokers[0].ability.driver_tally).toBe(8);
    });
});

// ————————————————————————————————————————————————————————————————
// 当场改强化的两张
// ————————————————————————————————————————————————————————————————

describe('Midas Mask 与 Vampire —— 当场改强化', () => {
    it('Midas Mask 把**计分的**人头牌全变成黄金牌，没计分的不动', () => {
        const r = run({ play: ['SK', 'HK', 'D9', 'C4', 'D6'], jokers: ['j_midas_mask'] });
        expect(r.played[0].enhancement).toBe('m_gold');
        expect(r.played[1].enhancement).toBe('m_gold');
        expect(r.played[2].enhancement).toBeNull();
    });

    it('Midas Mask 变金是**破坏性的**：原来那张玻璃牌的强化没了', () => {
        const r = run({ play: ['SK:m_glass', 'HK', 'D9', 'C4', 'D6'], jokers: ['j_midas_mask'] });
        expect(r.played[0].enhancement).toBe('m_gold');
    });

    it('Midas Mask + Golden Ticket：变金在 before、发钱在逐张 → 2 张人头 = $8', () => {
        const r = run({ play: ['SK', 'HK', 'D9', 'C4', 'D6'], jokers: ['j_midas_mask', 'j_ticket'] });
        expect(r.dollars).toBe(8);
    });

    it('Golden Ticket 只认黄金牌：没有就不发钱', () => {
        const r = run({ play: ['SK', 'HK', 'D9', 'C4', 'D6'], jokers: ['j_ticket'] });
        expect(r.dollars).toBe(0);
    });

    it('Vampire 吸掉计分牌的强化，每张 +0.1：2 张 → ×1.2，16 × (2×1.2) = 38', () => {
        // 用 m_wild（只改花色、不加筹码）避开筹码干扰
        const r = run({ play: ['S3:m_wild', 'H3:m_wild', 'D9', 'C4', 'D6'], jokers: ['j_vampire'] });
        expect(r.played[0].enhancement).toBeNull();
        expect(r.played[1].enhancement).toBeNull();
        expect(r.jokers[0].ability.x_mult).toBeCloseTo(1.2);
        expect(r.score).toBe(38); // 16 × 2.4 = 38.4 → floor 38
    });

    it('Vampire 吸完**当场就按普通牌计分**：m_bonus 的 +30 筹码不再算 → 16 × 2.2 = 35', () => {
        const r = run({ play: ['S3:m_bonus', 'H3', 'D9', 'C4', 'D6'], jokers: ['j_vampire'] });
        expect(r.score).toBe(35);
    });

    it('Vampire 一张强化都没有时不长个子', () => {
        const r = run({ play: ['S3', 'H3', 'D9', 'C4', 'D6'], jokers: ['j_vampire'] });
        expect(r.jokers[0].ability.x_mult).toBe(1);
        expect(r.score).toBe(32);
    });
});

// ————————————————————————————————————————————————————————————————
// 靠牌面掷点结果的一张
// ————————————————————————————————————————————————————————————————

describe('Lucky Cat —— 读 lucky_trigger', () => {
    it('幸运牌中了倍率 → +0.25。一对 3 带一张幸运 → 16 × ((2+20)×1.25) = 440', () => {
        const r = run({
            play: ['S3:m_lucky', 'H3', 'D9', 'C4', 'D6'],
            jokers: ['j_lucky_cat'],
            rolls: { lucky_mult: 0.1, lucky_money: 0.9 },
        });
        expect(r.jokers[0].ability.x_mult).toBeCloseTo(1.25);
        expect(r.score).toBe(440);
    });

    it('幸运牌**只中钱**也算触发——两个 key 共用一个标记', () => {
        const r = run({
            play: ['S3:m_lucky', 'H3', 'D9', 'C4', 'D6'],
            jokers: ['j_lucky_cat'],
            rolls: { lucky_mult: 0.9, lucky_money: 0.01 },
        });
        expect(r.jokers[0].ability.x_mult).toBeCloseTo(1.25);
        expect(r.dollars).toBe(20);
    });

    it('两次都没中 → 不长个子，但两个 key **都照样掷了**', () => {
        const r = run({
            play: ['S3:m_lucky', 'H3', 'D9', 'C4', 'D6'],
            jokers: ['j_lucky_cat'],
            rolls: { lucky_mult: 0.9, lucky_money: 0.9 },
        });
        expect(r.jokers[0].ability.x_mult).toBe(1);
        expect(r.rollCounts.lucky_mult).toBe(1);
        expect(r.rollCounts.lucky_money).toBe(1);
    });

    it('**标记不会串到下一张牌**：两张幸运牌只中第一张，也只长一次', () => {
        let n = 0;
        // 第一张中倍率、不中钱；第二张两次都不中
        const rolls = [0.1, 0.9, 0.9, 0.9];
        const jokers = [makeJoker('j_lucky_cat')];
        const hands = initialHands();
        const played = ['S3:m_lucky', 'H3:m_lucky', 'D9', 'C4', 'D6'].map((s, i) => c(s, i * 2.05));
        refreshDerivedAbilities(jokers, 5, played);
        const view = makeGameView({
            hands,
            jokers,
            handCards: [],
            current_round: { hands_left: 3, discards_left: 3, hands_played: 0 },
            pseudorandom: () => rolls[n++],
        });
        evaluatePlay(played, hands, view, { fourFingers: false, shortcut: false });
        expect(jokers[0].ability.x_mult).toBeCloseTo(1.25);
        // 清除到位了：两张牌都不该留着标记
        expect(played[0].lucky_trigger).toBeUndefined();
        expect(played[1].lucky_trigger).toBeUndefined();
    });

    it('不是幸运牌就**一次都不掷**', () => {
        const r = run({ play: ['S3', 'H3', 'D9', 'C4', 'D6'], jokers: ['j_lucky_cat'] });
        expect(r.rollCounts).toEqual({});
    });
});

// ————————————————————————————————————————————————————————————————
// 靠销毁的一张
// ————————————————————————————————————————————————————————————————

describe('Glass Joker —— 数碎掉的玻璃牌', () => {
    it('计分里碎掉 1 张 → x_mult 1 → 1.75，而**这一手的分数不受影响**', () => {
        const r = run({
            play: ['S3:m_glass', 'H3', 'D9', 'C4', 'D6'],
            jokers: ['j_glass'],
            rolls: { glass: 0.1 },
        });
        expect(r.destroyed).toHaveLength(1);
        expect(r.destroyed[0].shattered).toBe(true);
        expect(r.jokers[0].ability.x_mult).toBeCloseTo(1.75);
        // 销毁趟是第 13 步、分数已经定了：这一手仍是 16 × (2×2) = 64
        expect(r.score).toBe(64);
    });

    it('玻璃牌没碎就不长', () => {
        const r = run({
            play: ['S3:m_glass', 'H3', 'D9', 'C4', 'D6'],
            jokers: ['j_glass'],
            rolls: { glass: 0.9 },
        });
        expect(r.destroyed).toHaveLength(0);
        expect(r.jokers[0].ability.x_mult).toBe(1);
    });

    it('碎两张就长两档：1 + 0.75×2 = 2.5', () => {
        const r = run({
            play: ['S3:m_glass', 'H3:m_glass', 'D9', 'C4', 'D6'],
            jokers: ['j_glass'],
            rolls: { glass: 0.1 },
        });
        expect(r.destroyed).toHaveLength(2);
        expect(r.jokers[0].ability.x_mult).toBeCloseTo(2.5);
    });

    it('The Hanged Man 毁掉的玻璃牌走的是**另一条**分支，两条不重复计数', () => {
        const joker = makeJoker('j_glass');
        const glass = c('S3:m_glass');
        const view = makeGameView({ jokers: [joker] });

        // `remove_playing_cards` 数的是 `shattered`——没这个标记就是 0 档
        calculateJoker(joker, { remove_playing_cards: true, removed: [glass] }, view);
        expect(joker.ability.x_mult).toBe(1);

        calculateJoker(joker, {
            using_consumeable: true,
            consumeable: { set: 'Tarot', name: 'The Hanged Man' },
            highlighted: [glass, c('H9')],
        }, view);
        expect(joker.ability.x_mult).toBeCloseTo(1.75);
    });

    it('别的塔罗不触发——只认 The Hanged Man', () => {
        const joker = makeJoker('j_glass');
        calculateJoker(joker, {
            using_consumeable: true,
            consumeable: { set: 'Tarot', name: 'The Fool' },
            highlighted: [c('S3:m_glass')],
        }, makeGameView({ jokers: [joker] }));
        expect(joker.ability.x_mult).toBe(1);
    });
});

// ————————————————————————————————————————————————————————————————
// 造牌的一张
// ————————————————————————————————————————————————————————————————

describe('Marble Joker —— 进盲注时造一张石头牌', () => {
    it('掷 `marb_fr` 造一张 m_stone', () => {
        const joker = makeJoker('j_marble');
        const made: Array<[string | null, string]> = [];
        const view = makeGameView({
            jokers: [joker],
            createPlayingCard: (enhancement, key) => made.push([enhancement, key]),
        });

        const effect = calculateJoker(joker, { setting_blind: true }, view);
        expect(made).toEqual([['m_stone', 'marb_fr']]);
        expect(effect?.card).toBe(joker);
    });

    it('只在 `setting_blind` 触发，出牌结算时不造', () => {
        const joker = makeJoker('j_marble');
        // 这张视图的 createPlayingCard 一调就抛
        const view = makeGameView({ jokers: [joker] });
        expect(() =>
            calculateJoker(joker, {
                cardarea: 'jokers',
                poker_hands: EMPTY_HANDS,
                scoring_name: 'Pair',
            }, view),
        ).not.toThrow();
    });
});
