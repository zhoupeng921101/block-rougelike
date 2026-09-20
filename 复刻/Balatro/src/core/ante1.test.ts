/**
 * 里程碑 2 的验收测试：**真的把 Ante 1 打通**。
 *
 * 前面那些文件都在单测一层（结算、盲注、经济、商店）。这个文件不 mock 任何东西，
 * 也不直接写 `phase`——它真的打牌、真的进商店、真的买小丑，
 * 走完小盲注 → 商店 → 大盲注 → 商店 → Boss → 商店 → Ante 2。
 *
 * 为什么需要它：每一层单测都绿，拼起来仍然可能不通。
 * 最典型的是**跨层的状态传递**——`Round` 改的小丑 ability 有没有留在 `Run` 上、
 * 商店扣的钱有没有回到下一关、Boss 的 debuff 有没有真的落到牌上。
 */

import { describe, expect, it } from 'vitest';

import { BLIND_CENTERS } from './blinds';
import type { Card } from './card';
import { makeJoker } from './jokers';
import { evaluatePokerHand } from './poker-hands';
import type { Round } from './round';
import { Run } from './run';
import type { HandInfo, HandName } from './scoring';

/**
 * 穷举手牌的所有 ≤5 张子集，挑得分最高的那一组。
 *
 * 手牌 8 张，子集数 `C(8,1..5) = 218`，穷举比写启发式便宜也准。
 * **不算小丑**——挑哪一手只需要个排序，小丑的加成不改相对优劣的大方向，
 * 而把小丑算进来就得把整条管线跑 218 遍（还会污染 RNG 状态）。
 */
function bestPlay(hand: Card[], hands: Record<HandName, HandInfo>): { cards: Card[]; score: number } {
    let best: { cards: Card[]; score: number } = { cards: [], score: -1 };

    const walk = (start: number, picked: Card[]) => {
        if (picked.length >= 1) {
            const results = evaluatePokerHand(picked);
            const name = results.topName;
            if (name && results.top) {
                const info = hands[name];
                const chips = info.chips + results.top[0].reduce((n, c) => n + c.base.nominal, 0);
                const score = Math.floor(chips * info.mult);
                if (score > best.score) best = { cards: [...picked], score };
            }
        }
        if (picked.length === 5) return;
        for (let i = start; i < hand.length; i++) {
            picked.push(hand[i]);
            walk(i + 1, picked);
            picked.pop();
        }
    };
    walk(0, []);

    return best;
}

/**
 * 决定「留哪 5 张」。
 *
 * 追同花是基础牌组在 Ante 1 的标准打法：同花 300 分，一手就够小盲注，
 * 而一对只有 50–60 分，四手打满也过不了。所以弃牌的目标是**把同花凑出来**，
 * 凑不动才退回「留最大的同点数组」。
 */
function keepSet(hand: Card[]): Card[] {
    const candidates: Array<{ cards: Card[]; value: number }> = [];

    // 同花项目：同花色的牌，张数越多越值钱
    for (const suit of ['Spades', 'Hearts', 'Clubs', 'Diamonds'] as const) {
        const same = hand
            .filter((c) => c.base.suit === suit)
            .sort((a, b) => b.base.nominal - a.base.nominal)
            .slice(0, 5);
        if (same.length >= 3) candidates.push({ cards: same, value: 100 * same.length });
    }

    // 同点数项目：三条 / 四条比一对值钱得多
    const byId = new Map<number, Card[]>();
    for (const card of hand) {
        const list = byId.get(card.base.id) ?? [];
        list.push(card);
        byId.set(card.base.id, list);
    }
    for (const group of byId.values()) {
        if (group.length >= 2) candidates.push({ cards: group, value: 90 * group.length });
    }

    if (candidates.length === 0) {
        // 什么项目都没有 → 留点数最高的 3 张，剩下全换
        return [...hand].sort((a, b) => b.base.nominal - a.base.nominal).slice(0, 3);
    }
    candidates.sort((a, b) => b.value - a.value);
    return candidates[0].cards;
}

/**
 * 把一局打完。
 *
 * 出牌的条件：这一手就能过关、或者手已经打得够好（≥250，约等于一个同花的量级）、
 * 或者没得选了（最后一手 / 弃牌用尽）。否则按 `keepSet` 弃牌换牌。
 */
function playRound(round: Round): void {
    let guard = 0;
    while (round.phase === 'selecting') {
        if (guard++ > 40) throw new Error('打不完——策略死循环了');

        const best = bestPlay(round.hand, round.hands);
        const need = round.requirement - round.chips;
        const mustPlay = round.discardsLeft === 0 || round.handsLeft === 1;

        if (mustPlay || best.score >= need || best.score >= 250) {
            round.play(best.cards);
            continue;
        }

        const keep = keepSet(round.hand);
        const spare = round.hand
            .filter((c) => !keep.includes(c))
            .sort((a, b) => a.base.nominal - b.base.nominal)
            .slice(0, 5);

        if (spare.length === 0) {
            round.play(best.cards);
            continue;
        }
        round.discard(spare);
    }
}

/** 在商店里能买就买、买不了就走。返回买到的小丑 key。 */
function shopAndLeave(run: Run): string[] {
    if (run.state !== 'shop') throw new Error(`现在是 ${run.state}，不在商店`);
    const bought: string[] = [];

    for (let i = run.shop!.items.length - 1; i >= 0; i--) {
        const item = run.shop!.items[i];
        if (item.kind !== 'joker') continue;
        if (item.cost > run.dollars || run.jokersFull) continue;
        bought.push(run.buyJoker(i).key);
    }
    run.leaveShop();
    return bought;
}

/** 打一关 + 逛一次商店。返回这一关的记录。 */
function clearOneBlind(run: Run): { kind: string; requirement: number; chips: number; bought: string[] } {
    const kind = run.blindKind;
    const round = run.startRound();
    const requirement = round.requirement;
    playRound(round);

    if (round.phase !== 'won') {
        throw new Error(`${kind} 盲注没打过：${round.chips} / ${requirement}`);
    }
    const chips = round.chips;
    run.finishRound();
    return { kind, requirement, chips, bought: shopAndLeave(run) };
}

describe('打通 Ante 1', () => {
    it('小盲注 → 商店 → 大盲注 → 商店 → Boss → 商店 → Ante 2', () => {
        const run = new Run('TUTORIAL');
        const rounds = [clearOneBlind(run), clearOneBlind(run), clearOneBlind(run)];

        expect(rounds.map((r) => r.kind)).toEqual(['small', 'big', 'boss']);
        expect(rounds.map((r) => r.requirement)).toEqual([300, 450, 600]);
        for (const r of rounds) expect(r.chips).toBeGreaterThanOrEqual(r.requirement);

        expect(run.ante).toBe(2);
        expect(run.blindKind).toBe('small');
        expect(run.state).toBe('blind-select');
    });

    it('换几个 seed 也打得通', () => {
        for (const seed of ['ALEEB', '7LB2WVPK', 'JHZ7FPM']) {
            const run = new Run(seed);
            for (let i = 0; i < 3; i++) clearOneBlind(run);
            expect(run.ante, seed).toBe(2);
        }
    });

    it('同 seed 打出完全一样的一局', () => {
        function transcript(seed: string): string[] {
            const run = new Run(seed);
            const out: string[] = [];
            for (let i = 0; i < 3; i++) {
                const round = run.startRound();
                out.push(round.hand.map((c) => c.key).join(','));
                playRound(round);
                out.push(`chips=${round.chips} hands=${round.handsLeft}`);
                out.push(`payout=${run.finishRound().payout.total}`);
                out.push(run.shop!.items.map((x) => (x.kind === 'joker' ? x.joker.key : x.type)).join(','));
                out.push(`bought=${shopAndLeave(run).join('/')}`);
            }
            return out;
        }
        expect(transcript('ALEEB')).toEqual(transcript('ALEEB'));
    });

    it('不同 seed 打出不同的一局', () => {
        const hand = (seed: string) => new Run(seed).startRound().hand.map((c) => c.key).join();
        expect(hand('TUTORIAL')).not.toBe(hand('ALEEB'));
    });

    it('打不过就是 game-over，不会假装过关', () => {
        const run = new Run('TUTORIAL');
        const round = run.startRound();
        // 四手全弃掉最小的那张 → 一分都不得
        for (let i = 0; i < 4; i++) round.play([round.hand[0]]);
        expect(round.phase).toBe('lost');
        const { won } = run.finishRound();
        expect(won).toBe(false);
        expect(run.state).toBe('game-over');
    });
});

describe('Boss 的 debuff 真的落到牌上', () => {
    /** 找一个 Ante 1 Boss 是指定名字的 seed。 */
    function seedWithBoss(name: string): string {
        for (let i = 0; i < 400; i++) {
            const seed = `B${i}`;
            if (BLIND_CENTERS[new Run(seed).bossKey].name === name) return seed;
        }
        throw new Error(`400 个 seed 里没抽到 ${name}`);
    }

    it('The Club 把所有梅花牌置 debuff', () => {
        const run = new Run(seedWithBoss('The Club'));
        run.blindIndex = 2; // 直接跳到 Boss 那一关
        const round = run.startRound();

        const clubs = round.deck.filter((c) => c.base.suit === 'Clubs');
        expect(clubs.length).toBeGreaterThan(0);
        expect(clubs.every((c) => c.debuff)).toBe(true);
        expect(round.deck.filter((c) => c.base.suit !== 'Clubs').every((c) => !c.debuff)).toBe(true);
    });

    it('The Manacle 让手牌上限变 7', () => {
        const run = new Run(seedWithBoss('The Manacle'));
        run.blindIndex = 2;
        const round = run.startRound();
        expect(round.handLimit).toBe(7);
        expect(round.hand).toHaveLength(7);
    });

    it('The Psychic 出不满 5 张就得 0 分', () => {
        const run = new Run(seedWithBoss('The Psychic'));
        run.blindIndex = 2;
        const round = run.startRound();

        const out = round.play(round.hand.slice(0, 2));
        expect(out.score).toBe(0);
        expect(out.debuffed).toBe(true);
        expect(round.chips).toBe(0);
    });

    it('The Psychic 出满 5 张就正常计分', () => {
        const run = new Run(seedWithBoss('The Psychic'));
        run.blindIndex = 2;
        const round = run.startRound();
        const out = round.play(round.hand.slice(0, 5));
        expect(out.debuffed).toBe(false);
        expect(out.score).toBeGreaterThan(0);
    });

    it('The Hook 每次出牌后额外弃 2 张，且**不扣弃牌次数**', () => {
        const run = new Run(seedWithBoss('The Hook'));
        run.blindIndex = 2;
        const round = run.startRound();

        const discardsBefore = round.discardsLeft;
        const deckBefore = round.deck.length;
        round.play(round.hand.slice(0, 2));

        // 出了 2 张 + Hook 弃 2 张 = 离开手牌区 4 张
        expect(round.discardsLeft).toBe(discardsBefore);
        expect(deckBefore - round.deck.length).toBe(4);
        expect(round.discardPile).toHaveLength(4);
    });
});

describe('跨层的状态传递', () => {
    it('`Round` 里长个子的小丑，长出来的值留在 `Run` 上', () => {
        const run = new Run('TUTORIAL');
        const green = makeJoker('j_green_joker');
        run.jokers.push(green);

        const round = run.startRound();
        playRound(round);
        const afterRound = green.ability.mult;
        expect(afterRound).toBeGreaterThan(0);

        run.finishRound();
        run.leaveShop();
        // 下一关开始时那个值还在
        expect(run.jokers[0].ability.mult).toBe(afterRound);
    });

    it('商店扣掉的钱带进下一关', () => {
        // `TUTORIAL` 的第一个商店两格都买不起，所以扫几个 seed 找一个能买的。
        // 这不是放宽断言——买得起哪一格取决于 seed，而本用例测的是「钱有没有带过去」
        for (let i = 0; i < 40; i++) {
            const run = new Run(`M${i}`);
            const round = run.startRound();
            playRound(round);
            if (round.phase !== 'won') continue;
            run.finishRound();

            const before = run.dollars;
            const idx = run.shop!.items.findIndex((x) => x.kind === 'joker' && x.cost <= before);
            if (idx < 0) continue;

            const cost = run.shop!.items[idx].cost;
            run.buyJoker(idx);
            run.leaveShop();

            expect(run.dollars).toBe(before - cost);
            expect(run.startRound().dollars).toBe(before - cost);
            return;
        }
        throw new Error('40 个 seed 里一个买得起的商店都没有');
    });

    it('买到的小丑在下一关真的参与计分', () => {
        const run = new Run('TUTORIAL');
        // 手工塞一张而不是等商店给——商店给什么取决于 seed，测试不该依赖那个
        run.jokers.push(makeJoker('j_joker')); // +4 mult

        const round = run.startRound();
        const out = round.play(round.hand.slice(0, 5));
        expect(out.steps.some((s) => s.kind === 'joker')).toBe(true);

        // 同一手牌，没有小丑时倍率少 4
        const bare = new Run('TUTORIAL');
        const bareRound = bare.startRound();
        const bareOut = bareRound.play(bareRound.hand.slice(0, 5));
        expect(out.mult - bareOut.mult).toBe(4);
    });

    it('卖掉小丑的钱进得了账，下一关也不再算它', () => {
        const run = new Run('TUTORIAL');
        run.jokers.push(makeJoker('j_joker'));
        const before = run.dollars;
        run.sellJoker(0);
        expect(run.dollars).toBe(before + 1); // cost 2 → 卖 1
        expect(run.jokers).toHaveLength(0);

        const round = run.startRound();
        const out = round.play(round.hand.slice(0, 5));
        expect(out.steps.some((s) => s.kind === 'joker')).toBe(false);
    });
});
