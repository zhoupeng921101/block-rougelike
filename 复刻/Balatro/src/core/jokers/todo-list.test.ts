/**
 * To Do List。它原先是个**静默坏掉**的实现：造出来时从没掷过牌型，所以永远不给钱，
 * 回合末也不换——而覆盖面测试照样把它报成「已实现」。
 *
 * 原作（`card.lua:311`）在 `set_ability` 里就掷 `to_do`，**商店摆出来、包里开出来、复制品都算**；
 * 回合末（`card.lua:2978`）从「可见且不是当前那个」里再掷一次。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { makeStandardDeck, resetCardCounters } from '../card';
import type { HandName } from '../poker-hands';
import { PseudorandomState, pseudorandomElement } from '../rng';
import { Run } from '../run';
import { initialHands } from '../scoring';
import { DEFAULT_POOL_FIELDS, type PoolContext, createJokerCard } from '../shop';
import { calculateJoker } from './calculate';
import { makeGameView } from './game-view';
import { makeJoker } from './instance';

beforeEach(() => resetCardCounters());

function ctx(overrides: Partial<PoolContext> = {}): PoolContext {
    return {
        ante: 1,
        usedJokers: new Set(),
        grosMichelExtinct: false,
        jokers: [],
        consumables: [],
        handsPlayed: Object.fromEntries(Object.keys(initialHands()).map((n) => [n, 0])) as Record<HandName, number>,
        firstShopBuffoon: true,
        ...DEFAULT_POOL_FIELDS,
        ...overrides,
    };
}

/** 一路抽到 To Do List 为止，返回它与所用的 rng */
function drawTodo(seed: string) {
    const rng = new PseudorandomState(seed);
    for (let i = 0; i < 2000; i++) {
        const j = createJokerCard(rng, ctx(), 'sho', 'shop', { rarity: 0 });
        if (j.ability.name === 'To Do List') return { j, rng, calls: i };
    }
    throw new Error('2000 次都没抽到 To Do List');
}

describe('To Do List', () => {
    it('造出来就掷好了牌型：是开局可见的 9 个之一，等于 to_do 流的第一次', () => {
        const { j } = drawTodo('TODO');
        const first = pseudorandomElement([...DEFAULT_POOL_FIELDS.visibleHands], new PseudorandomState('TODO').pseudoseed('to_do'))[0];
        expect(j.ability.to_do_poker_hand).toBe(first);
    });

    it('打出那个牌型给 $4', () => {
        const j = makeJoker('j_todo_list');
        j.ability.to_do_poker_hand = 'Pair';
        const game = makeGameView({ dollars: 0 });
        calculateJoker(j, { before: true, scoring_name: 'Pair', cardarea: 'jokers' } as never, game);
        expect(game.dollars).toBe(4);
    });

    it('回合末换一个：新牌型可见、而且一定不是原来那个', () => {
        const rng = new PseudorandomState('ROUND');
        for (let i = 0; i < 50; i++) {
            const j = makeJoker('j_todo_list');
            j.ability.to_do_poker_hand = 'Pair';
            const game = makeGameView({ pseudorandom: (k, a, b) => rng.pseudorandom(k, a, b) });
            calculateJoker(j, { end_of_round: true }, game);
            expect(j.ability.to_do_poker_hand).not.toBe('Pair');
            expect(DEFAULT_POOL_FIELDS.visibleHands).toContain(j.ability.to_do_poker_hand);
        }
    });

    it('回合末那次与 pseudorandom_element 是同一次掷点', () => {
        const pool = DEFAULT_POOL_FIELDS.visibleHands.filter((h) => h !== 'Flush');
        const expected = pseudorandomElement(pool, new PseudorandomState('EQ').pseudoseed('to_do'))[0];
        const rng = new PseudorandomState('EQ');
        const j = makeJoker('j_todo_list');
        j.ability.to_do_poker_hand = 'Flush';
        calculateJoker(j, { end_of_round: true }, makeGameView({ pseudorandom: (k, a, b) => rng.pseudorandom(k, a, b) }));
        expect(j.ability.to_do_poker_hand).toBe(expected);
    });

    it('蓝图不替它换', () => {
        const j = makeJoker('j_todo_list');
        j.ability.to_do_poker_hand = 'Pair';
        calculateJoker(j, { end_of_round: true, blueprint: 1 } as never, makeGameView());
        expect(j.ability.to_do_poker_hand).toBe('Pair');
    });

    it('Invisible Joker 复制它：复制品抄原卡的牌型，但 to_do 流照样消费一次', () => {
        const run = new Run('COPY', makeStandardDeck());
        const todo = makeJoker('j_todo_list');
        todo.ability.to_do_poker_hand = 'Straight';
        const invis = makeJoker('j_invisible');
        run.jokers.push(todo, invis);
        // 复制前后看 to_do 流的下一次：消费了一次的话，下一次等于第二次
        const probe = new PseudorandomState('COPY');
        probe.pseudoseed('to_do');
        const second = probe.pseudoseed('to_do');
        (run as unknown as { duplicateJoker(s: unknown, k: string): void }).duplicateJoker(invis, 'invisible');
        expect(run.jokers).toHaveLength(3);
        expect(run.jokers[2].ability.to_do_poker_hand).toBe('Straight');
        expect(run.rng.pseudoseed('to_do')).toBe(second);
    });
});
