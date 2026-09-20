/**
 * 回合状态机的测试。
 *
 * 这是第一个切片的「能不能玩」判据：发牌 → 选牌出牌／弃牌 →
 * 4 次出牌 3 次弃牌用完 → 累计到 300 分算过关。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { makeStandardDeck, resetCardCounters } from './card';
import { Round, STARTING_PARAMS } from './round';

beforeEach(() => resetCardCounters());

const newRound = (seed = 'ALEEB') => new Round(seed, makeStandardDeck());

describe('开局', () => {
    it('发 8 张手牌，牌堆剩 44 张', () => {
        const r = newRound();
        expect(r.hand).toHaveLength(STARTING_PARAMS.hand_size);
        expect(r.deck).toHaveLength(52 - STARTING_PARAMS.hand_size);
    });

    it('4 次出牌、3 次弃牌、小盲注 300 分', () => {
        const r = newRound();
        expect(r.handsLeft).toBe(4);
        expect(r.discardsLeft).toBe(3);
        expect(r.requirement).toBe(300);
        expect(r.chips).toBe(0);
        expect(r.phase).toBe('selecting');
    });

    it('同 seed 发出同样的手牌', () => {
        const a = newRound('ALEEB');
        resetCardCounters();
        const b = newRound('ALEEB');
        expect(b.hand.map((c) => c.key)).toEqual(a.hand.map((c) => c.key));
    });

    it('不同 seed 发出不同的手牌', () => {
        const a = newRound('ALEEB');
        resetCardCounters();
        const b = newRound('TUTORIAL');
        expect(b.hand.map((c) => c.key)).not.toEqual(a.hand.map((c) => c.key));
    });

    it('手牌的 T.x 单调递增——计分顺序靠它', () => {
        const xs = newRound().hand.map((c) => c.T.x);
        expect(xs).toEqual([...xs].sort((a, b) => a - b));
        expect(new Set(xs).size).toBe(xs.length);
    });

    it('52 张牌不多不少，手牌+牌堆就是全部', () => {
        const r = newRound();
        const all = [...r.hand, ...r.deck].map((c) => c.key).sort();
        expect(new Set(all).size).toBe(52);
    });
});

describe('出牌', () => {
    it('消耗一次出牌次数，累加分数，补满手牌', () => {
        const r = newRound();
        const out = r.play(r.hand.slice(0, 2));

        expect(r.handsLeft).toBe(3);
        expect(out.score).toBeGreaterThan(0);
        expect(r.chips).toBe(out.score);
        expect(r.hand).toHaveLength(8); // 补满
        expect(r.discardPile).toHaveLength(2);
    });

    it('打出去的牌离开手牌，进弃牌堆', () => {
        const r = newRound();
        const played = r.hand.slice(0, 2);
        r.play(played);

        for (const c of played) {
            expect(r.hand).not.toContain(c);
            expect(r.discardPile).toContain(c);
        }
    });

    it('牌堆抽干后手牌不再补满', () => {
        const r = newRound();
        r.deck.length = 1; // 只剩一张
        r.play(r.hand.slice(0, 3));
        expect(r.hand).toHaveLength(6); // 8-3+1
        expect(r.deck).toHaveLength(0);
    });

    it('一次最多 5 张', () => {
        const r = newRound();
        expect(() => r.play(r.hand.slice(0, 6))).toThrow('最多 5 张');
    });

    it('不能打不在手牌里的牌', () => {
        const r = newRound();
        const notInHand = r.deck[0];
        expect(() => r.play([notInHand])).toThrow('不在手牌里');
    });
});

describe('弃牌', () => {
    it('消耗一次弃牌次数，不计分，补满手牌', () => {
        const r = newRound();
        r.discard(r.hand.slice(0, 3));

        expect(r.discardsLeft).toBe(2);
        expect(r.handsLeft).toBe(4); // 不消耗出牌次数
        expect(r.chips).toBe(0); // 不计分
        expect(r.hand).toHaveLength(8);
    });

    it('弃牌次数用完就不能再弃', () => {
        const r = newRound();
        for (let i = 0; i < 3; i++) r.discard(r.hand.slice(0, 1));
        expect(r.discardsLeft).toBe(0);
        expect(() => r.discard(r.hand.slice(0, 1))).toThrow('没有弃牌次数');
    });
});

describe('过关与失败', () => {
    it('累计够 300 分即过关', () => {
        const r = newRound();
        r.chips = 299;
        const out = r.play(r.hand.slice(0, 1)); // 高牌至少 6 分
        expect(out.phase).toBe('won');
        expect(r.phase).toBe('won');
    });

    it('4 次出牌用完仍不够分即失败', () => {
        const r = newRound();
        // 每次只打一张，高牌分数远不够 300
        for (let i = 0; i < 4; i++) {
            if (r.phase !== 'selecting') break;
            r.play(r.hand.slice(0, 1));
        }
        expect(r.handsLeft).toBe(0);
        expect(r.phase).toBe('lost');
        expect(r.chips).toBeLessThan(300);
    });

    it('最后一手够分算赢——过关判定优先于失败', () => {
        // game.lua:3559 是 `chips >= blind.chips OR hands_left < 1`，
        // 够分那条在前，所以最后一手打够就是赢，不是「用完次数即输」
        const r = newRound();
        r.chips = 299;
        (r as unknown as { handsLeft: number }).handsLeft = 1;
        const out = r.play(r.hand.slice(0, 1));
        expect(out.phase).toBe('won');
    });

    it('结束之后不能再操作', () => {
        const r = newRound();
        r.chips = 500;
        r.play(r.hand.slice(0, 1));
        expect(r.phase).toBe('won');
        expect(() => r.play(r.hand.slice(0, 1))).toThrow('回合已经 won');
        expect(() => r.discard(r.hand.slice(0, 1))).toThrow('回合已经 won');
    });
});

describe('完整一局：同 seed 同操作 → 同结果', () => {
    it('两次跑出完全一样的过程', () => {
        const run = () => {
            resetCardCounters();
            const r = new Round('ALEEB', makeStandardDeck());
            const log: string[] = [];

            // 固定策略：每次打手牌最左边的 5 张
            while (r.phase === 'selecting') {
                const out = r.play(r.hand.slice(0, 5));
                log.push(`${out.handName} ${out.score} → ${out.chips}`);
            }
            return { log, phase: r.phase, chips: r.chips };
        };

        const a = run();
        const b = run();
        expect(b).toEqual(a);
        expect(a.log.length).toBeGreaterThan(0);
    });
});
