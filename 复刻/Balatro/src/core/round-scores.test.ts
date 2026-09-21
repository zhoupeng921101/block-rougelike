/**
 * `G.GAME.round_scores` / `hand_usage` 的计数落点（游戏结束界面读）。
 */
import { describe, expect, it } from 'vitest';

import { resetCardCounters } from './card';
import { mostPlayedHandUsage } from './round-scores';
import { Run } from './run';

describe('round_scores', () => {
    it('出牌逐张、弃牌整批、最佳一手取 floor 后的最大值、hand_usage 按牌型计', () => {
        resetCardCounters();
        const run = new Run('ALEEB');
        const round = run.startRound();
        round.discard(round.hand.slice(0, 3));
        expect(run.scores.cardsDiscarded).toBe(3);
        const out = round.play(round.hand.slice(0, 2));
        expect(run.scores.cardsPlayed).toBe(2);
        expect(run.scores.bestHand).toBe(Math.floor(out.score));
        expect(mostPlayedHandUsage(run.scores)).toEqual({ hand: out.handName, count: 1 });
    });

    it('一手没出过时是 None / 0；并列时取先打出的', () => {
        const run = new Run('ALEEB');
        expect(mostPlayedHandUsage(run.scores)).toEqual({ hand: null, count: 0 });
        run.scores.handUsage.set('Pair', 2).set('Flush', 2);
        expect(mostPlayedHandUsage(run.scores)).toEqual({ hand: 'Pair', count: 2 });
    });

    it('重掷与买东西计数；商店之外不动', () => {
        resetCardCounters();
        const run = new Run('ALEEB');
        const round = run.startRound();
        round.chips = round.requirement;
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.dollars = 100;
        run.rerollShop();
        run.rerollShop();
        expect(run.scores.timesRerolled).toBe(2);
        const jokerSlot = run.shop!.items.findIndex((i) => i.kind === 'joker');
        if (jokerSlot >= 0) {
            run.buyJoker(jokerSlot);
            expect(run.scores.cardsPurchased).toBe(1);
        }
    });
});
