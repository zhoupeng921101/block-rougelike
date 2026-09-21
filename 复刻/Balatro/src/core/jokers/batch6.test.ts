/**
 * Trading Card / Certificate / Luchador / Chicot，外加这一刀补上的 `Blind:disable()`
 * 与两处顺带修掉的问题（弃牌计数的时机、The Needle 的次数）。
 *
 * 口径与前几批一样：期望值手算、算式写进用例名。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { makeBlindState } from '../blinds';
import { makeStandardDeck, resetCardCounters } from '../card';
import { Round } from '../round';
import { Run } from '../run';
import { makeJoker } from './instance';

beforeEach(() => resetCardCounters());

/** 直接跳到 Ante 1 的 Boss，指定是哪一个 */
function bossRun(bossKey: string): Run {
    const run = new Run('TUTORIAL', makeStandardDeck());
    run.blindIndex = 2;
    run.bossKey = bossKey;
    return run;
}

// ————————————————————————————————————————————————————————————————
// Trading Card
// ————————————————————————————————————————————————————————————————

describe('Trading Card', () => {
    it('本回合第一次弃牌只弃一张：+$3，那张牌被毁（不进弃牌堆、离开整副牌）', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_trading'));
        const round = run.startRound();
        const before = round.dollars;
        const victim = round.hand[0];

        round.discard([victim]);
        expect(round.dollars).toBe(before + 3);
        expect(round.discardPile).not.toContain(victim);
        expect(run.fullDeck).not.toContain(victim);
        expect(run.fullDeck).toHaveLength(51);
    });

    it('第二次弃牌不触发；一次弃两张也不触发', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_trading'));
        const round = run.startRound();
        round.discard(round.hand.slice(0, 2));
        const before = round.dollars;
        round.discard([round.hand[0]]);
        expect(round.dollars).toBe(before);
        expect(run.fullDeck).toHaveLength(52);
    });

    it('毁掉的是玻璃牌 → 算「碎掉」，Glass Joker 长 0.75', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const glassJoker = makeJoker('j_glass');
        run.jokers.push(makeJoker('j_trading'), glassJoker);
        const round = run.startRound();
        round.hand[0].enhancement = 'm_glass';
        round.discard([round.hand[0]]);
        expect(glassJoker.ability.x_mult).toBeCloseTo(1.75);
    });

    it('弃牌循环里读到的「已弃次数」：第一次是 0（计数在循环之后才 +1）', () => {
        // Burnt Joker 靠同一个数：第一次弃牌升级牌型，第二次不升
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_burnt'));
        const round = run.startRound();
        const levelOf = () => Object.values(run.hands).reduce((n, h) => n + h.level, 0);
        const start = levelOf();
        round.discard([round.hand[0]]);
        expect(levelOf()).toBe(start + 1);
        round.discard([round.hand[0]]);
        expect(levelOf()).toBe(start + 1);
    });
});

// ————————————————————————————————————————————————————————————————
// Certificate
// ————————————————————————————————————————————————————————————————

describe('Certificate', () => {
    it('每关第一次发完牌往手里塞一张带蜡封的牌：手牌 8 + 1 = 9，整副牌 53', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_certificate'));
        const round = run.startRound();
        expect(round.hand).toHaveLength(9);
        expect(run.fullDeck).toHaveLength(53);
        const made = run.fullDeck[52];
        expect(round.hand).toContain(made);
        expect(['Red', 'Blue', 'Gold', 'Purple']).toContain(made.seal);
        expect(made.enhancement).toBeNull();
    });

    it('Certificate + Hologram：塞一张 → Hologram 1.25', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const holo = makeJoker('j_hologram');
        run.jokers.push(makeJoker('j_certificate'), holo);
        run.startRound();
        expect(holo.ability.x_mult).toBe(1.25);
    });

    it('The Club 的 Boss 局里造出梅花 → 当场 debuff', () => {
        for (let i = 0; i < 300; i++) {
            const run = new Run(`C${i}`, makeStandardDeck());
            run.blindIndex = 2;
            run.bossKey = 'bl_club';
            run.jokers.push(makeJoker('j_certificate'));
            run.startRound();
            const made = run.fullDeck[52];
            if (made.base.suit !== 'Clubs') continue;
            expect(made.debuff).toBe(true);
            return;
        }
        throw new Error('300 个 seed 里 Certificate 一次梅花都没造出来');
    });
});

// ————————————————————————————————————————————————————————————————
// 关掉 Boss：Luchador / Chicot
// ————————————————————————————————————————————————————————————————

describe('Luchador / Chicot', () => {
    it('Chicot：进 Boss 盲注就关掉它——The Manacle 的 -1 手牌上限不生效', () => {
        const run = bossRun('bl_manacle');
        run.jokers.push(makeJoker('j_chicot'));
        const round = run.startRound();
        expect(round.blind!.disabled).toBe(true);
        expect(round.handLimit).toBe(8);
        expect(round.hand).toHaveLength(8);
    });

    it('Chicot：The Club 的梅花不 debuff', () => {
        const run = bossRun('bl_club');
        run.jokers.push(makeJoker('j_chicot'));
        const round = run.startRound();
        expect(round.deck.filter((c) => c.base.suit === 'Clubs').every((c) => !c.debuff)).toBe(true);
    });

    it('Chicot：小盲注什么都不做', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        run.jokers.push(makeJoker('j_chicot'));
        const round = run.startRound();
        expect(round.blind!.disabled).toBe(false);
    });

    it('Chicot 在 Boss 盲注**中途**进小丑区（`add_to_deck`）也当场关掉', () => {
        const run = bossRun('bl_manacle');
        const round = run.startRound();
        expect(round.handLimit).toBe(7);
        (run as unknown as { onJokerAdded(j: unknown): void }).onJokerAdded(makeJoker('j_chicot'));
        expect(round.blind!.disabled).toBe(true);
        // `blind.lua:386`：手牌上限 +1 并补抽 1 张
        expect(round.handLimit).toBe(8);
        expect(round.hand).toHaveLength(8);
    });

    it('Luchador：Boss 局里卖掉 → The Club 的梅花当场解除 debuff', () => {
        const run = bossRun('bl_club');
        run.jokers.push(makeJoker('j_luchador'));
        const round = run.startRound();
        expect(round.deck.some((c) => c.debuff)).toBe(true);
        run.sellJoker(0);
        expect(round.blind!.disabled).toBe(true);
        expect([...round.deck, ...round.hand].some((c) => c.debuff)).toBe(false);
    });

    it('Luchador：The Psychic 被关掉后，出不满 5 张也正常计分', () => {
        const run = bossRun('bl_psychic');
        run.jokers.push(makeJoker('j_luchador'));
        const round = run.startRound();
        run.sellJoker(0);
        const out = round.play(round.hand.slice(0, 2));
        expect(out.debuffed).toBe(false);
        expect(out.score).toBeGreaterThan(0);
    });

    it('Luchador：商店里卖掉什么也不发生', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.jokers.push(makeJoker('j_luchador'));
        expect(() => run.sellJoker(0)).not.toThrow();
    });
});

// ————————————————————————————————————————————————————————————————
// Blind:disable 的逐个还原（直接造 Round）
// ————————————————————————————————————————————————————————————————

describe('Blind:disable() 把进场效果逐个还回去', () => {
    it('The Wall：分数要求减半，**已经够分就当场过关**', () => {
        const round = new Round('TUTORIAL', makeStandardDeck(), { ante: 2, blind: makeBlindState('bl_wall') });
        // Ante 2 基数 800 × 4 = 3200 → 关掉后 1600
        expect(round.requirement).toBe(3200);
        round.chips = 2000;
        round.disableBlind();
        expect(round.requirement).toBe(1600);
        expect(round.phase).toBe('won');
    });

    it('The Water：弃牌 0 → 关掉后还回 3', () => {
        const round = new Round('TUTORIAL', makeStandardDeck(), { ante: 2, blind: makeBlindState('bl_water') });
        expect(round.discardsLeft).toBe(0);
        round.disableBlind();
        expect(round.discardsLeft).toBe(3);
    });

    it('The Needle：出牌 1 → 关掉后还回 4', () => {
        const round = new Round('TUTORIAL', makeStandardDeck(), { ante: 2, blind: makeBlindState('bl_needle') });
        expect(round.handsLeft).toBe(1);
        round.disableBlind();
        expect(round.handsLeft).toBe(4);
    });

    /**
     * `hands_sub = round_resets.hands - 1`，而 `round_resets.hands` 含小丑给的。
     * 原先写死「减 3」，Troubadour（-1）+ The Needle 会得到 0 次出牌，进场即输
     */
    it('The Needle + Troubadour：仍然是 1 次出牌（原先是 0）', () => {
        const round = new Round('TUTORIAL', makeStandardDeck(), {
            ante: 2,
            blind: makeBlindState('bl_needle'),
            jokers: [makeJoker('j_troubadour')],
        });
        expect(round.handsLeft).toBe(1);
    });

    it('关两次等于关一次', () => {
        const round = new Round('TUTORIAL', makeStandardDeck(), { ante: 2, blind: makeBlindState('bl_wall') });
        round.disableBlind();
        round.disableBlind();
        expect(round.requirement).toBe(1600);
    });
});
