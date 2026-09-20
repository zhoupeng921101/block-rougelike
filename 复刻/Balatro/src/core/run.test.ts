/**
 * `Run` 的测试：盲注序、钱、跨回合状态、RNG 的整局连续性。
 *
 * 「RNG 跨回合连续」那一组是这个文件里最要紧的：`G.GAME.pseudorandom` 是
 * **整局共享**的表，每回合新建一份会让所有 key 从头开始，
 * 从第二回合起与原版分叉。而这种分叉在单回合测试里完全看不出来。
 */

import { describe, expect, it } from 'vitest';

import { BLIND_CENTERS } from './blinds';
import { makeStandardDeck } from './card';
import { makeJoker } from './jokers';
import { Run } from './run';
import { blindRequirement } from './scoring';

/** 把当前这一局直接判过关：塞满分。绕过打牌，专测 `Run` 层。 */
function winRound(run: Run): void {
    const round = run.startRound();
    round.chips = round.requirement;
    // `settlePhase` 是私有的，但 `play` 会调它——这里直接写 phase，
    // 因为本文件测的是 `Run` 的推进而不是 `Round` 的结算
    (round as unknown as { phase: string }).phase = 'won';
}

function loseRound(run: Run): void {
    const round = run.startRound();
    (round as unknown as { phase: string }).phase = 'lost';
}

/** 打过一关并穿过商店，回到下一关的盲注选择。 */
function clearRound(run: Run): void {
    winRound(run);
    run.finishRound();
    run.leaveShop();
}

describe('盲注序', () => {
    it('一个 Ante 三关：小盲注 → 大盲注 → Boss', () => {
        const run = new Run('TUTORIAL');
        expect(run.blindKind).toBe('small');
        expect(run.blindKey).toBe('bl_small');

        clearRound(run);
        expect(run.blindKind).toBe('big');
        expect(run.blindKey).toBe('bl_big');

        clearRound(run);
        expect(run.blindKind).toBe('boss');
        expect(run.blindKey).toBe(run.bossKey);
    });

    it('打完 Boss 才进下一个 Ante', () => {
        const run = new Run('TUTORIAL');
        for (let i = 0; i < 3; i++) clearRound(run);
        expect(run.ante).toBe(2);
        expect(run.blindKind).toBe('small');
    });

    it('Boss 在 Ante 开始时就抽定，不是打到它才抽', () => {
        const run = new Run('TUTORIAL');
        const boss = run.bossKey;
        expect(BLIND_CENTERS[boss].boss).toBeTruthy();
        // 打小盲注、大盲注都不该换 Boss
        clearRound(run);
        expect(run.bossKey).toBe(boss);
        clearRound(run);
        expect(run.bossKey).toBe(boss);
    });

    it('同 seed 抽到同一个 Ante 1 Boss', () => {
        expect(new Run('TUTORIAL').bossKey).toBe(new Run('TUTORIAL').bossKey);
        expect(BLIND_CENTERS[new Run('TUTORIAL').bossKey].name).toBe('The Hook');
    });

    it('三关的需求：300 / 450 / 600', () => {
        const run = new Run('TUTORIAL');
        expect(run.startRound().requirement).toBe(blindRequirement(1, 'small'));
        (run.round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.leaveShop();
        expect(run.startRound().requirement).toBe(blindRequirement(1, 'big'));
        (run.round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.leaveShop();
        expect(run.startRound().requirement).toBe(600);
    });
});

describe('输了就结束', () => {
    it('没过关进 game-over，不推进盲注', () => {
        const run = new Run('TUTORIAL');
        loseRound(run);
        const { won } = run.finishRound();
        expect(won).toBe(false);
        expect(run.state).toBe('game-over');
        expect(run.blindKind).toBe('small');
    });

    it('没过关拿不到盲注收益，但剩余出牌与利息照算', () => {
        const run = new Run('TUTORIAL');
        run.dollars = 10;
        const round = run.startRound();
        round.handsLeft = 2;
        (round as unknown as { phase: string }).phase = 'lost';
        const { payout } = run.finishRound();
        // 盲注 0 + 剩余出牌 2 + 利息 2 = 4
        expect(payout.total).toBe(4);
    });
});

describe('钱', () => {
    it('起手 $4', () => {
        expect(new Run('TUTORIAL').dollars).toBe(4);
    });

    it('打过小盲注：$4 + 盲注 3 + 剩余出牌 4 = $11', () => {
        const run = new Run('TUTORIAL');
        winRound(run);
        const { payout } = run.finishRound();
        // startRound 里没打牌，所以 handsLeft 还是 4
        expect(payout.total).toBe(3 + 4);
        expect(run.dollars).toBe(11);
    });
});

describe('RNG 跨回合连续', () => {
    it('同一个 key 的状态跨回合累进，不是每回合重置', () => {
        const run = new Run('TUTORIAL');
        const first = run.startRound();
        const a = first.gameView().pseudorandom('misprint', 0, 23);
        (first as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.leaveShop();

        const second = run.startRound();
        const b = second.gameView().pseudorandom('misprint', 0, 23);

        // 同一个 `Run`、同一个 key 的第 1 次与第 2 次调用必须走不同的状态。
        // 每回合新建 PseudorandomState 的实现下这两个值会相等
        const fresh = new Run('TUTORIAL');
        const round = fresh.startRound();
        expect(round.gameView().pseudorandom('misprint', 0, 23)).toBe(a);
        expect(b).not.toBe(a);
    });

    it('每回合的洗牌结果不同——key 是 `nr`+ante，但状态在累进', () => {
        const run = new Run('TUTORIAL');
        const first = run.startRound().deck.map((c) => c.key).join();
        (run.round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.leaveShop();
        const second = run.startRound().deck.map((c) => c.key).join();
        expect(second).not.toBe(first);
    });

    it('同 seed 的两局逐回合一致', () => {
        const a = new Run('ALEEB');
        const b = new Run('ALEEB');
        for (let i = 0; i < 3; i++) {
            const ra = a.startRound();
            const rb = b.startRound();
            expect(rb.hand.map((c) => c.key)).toEqual(ra.hand.map((c) => c.key));
            (ra as unknown as { phase: string }).phase = 'won';
            (rb as unknown as { phase: string }).phase = 'won';
            a.finishRound();
            b.finishRound();
            a.leaveShop();
            b.leaveShop();
        }
    });
});

describe('跨回合的小丑状态', () => {
    it('Popcorn 每回合掉 4 点倍率，掉到 0 就被吃掉', () => {
        const run = new Run('TUTORIAL');
        run.jokers.push(makeJoker('j_popcorn'));
        const popcorn = run.jokers[0];
        expect(popcorn.ability.mult).toBe(20);

        // 20 → 16 → 12 → 8 → 4 → 被吃掉（第 5 次时 4-4 <= 0）
        for (let i = 0; i < 4; i++) clearRound(run);
        expect(popcorn.ability.mult).toBe(4);
        expect(run.jokers).toHaveLength(1);

        clearRound(run);
        expect(run.jokers).toHaveLength(0);
    });

    it('Egg 每回合卖价 +3', () => {
        const run = new Run('TUTORIAL');
        run.jokers.push(makeJoker('j_egg'));
        const egg = run.jokers[0];
        const before = egg.sell_cost;
        clearRound(run);
        expect(egg.sell_cost).toBe(before + 3);
    });

    it('Cavendish 每回合 1/1000 灭绝——正常情况下活着', () => {
        const run = new Run('TUTORIAL');
        run.jokers.push(makeJoker('j_cavendish'));
        clearRound(run);
        expect(run.jokers).toHaveLength(1);
    });

    it('Gros Michel 灭绝时置 grosMichelExtinct', () => {
        const run = new Run('TUTORIAL');
        run.jokers.push(makeJoker('j_gros_michel'));
        // 1/6 概率，不保证一次就中。连打若干回合直到它死，或确认它还活着
        let rounds = 0;
        while (run.jokers.length > 0 && rounds < 60) {
            clearRound(run);
            rounds++;
        }
        expect(run.jokers).toHaveLength(0);
        expect(run.grosMichelExtinct).toBe(true);
    });
});

describe('The Pillar 的 played_this_ante', () => {
    it('打完 Boss 才清，中间两关不清', () => {
        const run = new Run('TUTORIAL');
        const deck = run.fullDeck;
        deck[0].played_this_ante = true;

        clearRound(run);
        expect(deck[0].played_this_ante).toBe(true); // 小盲注打完不清

        clearRound(run);
        expect(deck[0].played_this_ante).toBe(true); // 大盲注打完也不清

        clearRound(run);
        expect(deck[0].played_this_ante).toBe(false); // Boss 打完才清
    });
});

describe('未实现的 Boss', () => {
    it('走到一个未实现 debuff 的 Boss 时抛，不静默当成无 debuff', () => {
        const run = new Run('TUTORIAL');
        run.bossKey = 'bl_ox';
        run.blindIndex = 2;
        expect(() => run.startRound()).toThrow(/The Ox/);
    });
});

describe('牌组', () => {
    it('默认红牌组 52 张，跨回合是同一批 Card 对象', () => {
        const run = new Run('TUTORIAL');
        expect(run.fullDeck).toHaveLength(52);
        const first = run.startRound();
        expect(first.deck.length + first.hand.length).toBe(52);
        expect(run.fullDeck.includes(first.hand[0])).toBe(true);
    });

    it('可以传自定义牌组', () => {
        const deck = makeStandardDeck().slice(0, 10);
        expect(new Run('TUTORIAL', deck).fullDeck).toHaveLength(10);
    });
});
