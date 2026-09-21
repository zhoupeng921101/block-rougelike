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
import { makeStandardDeck } from './card';
import { BOOSTER_CENTERS } from './boosters';
import { clearOneBlind, playRound, shopAndLeave } from './fixtures/greedy-bot';
import { makeJoker } from './jokers';
import { Run } from './run';
import { SHOP_JOKER_MAX, shopItemKey } from './shop';

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

    /**
     * 星球牌真的走通了整条路：商店抽出来 → 买 → 用 → 牌型升级 → 分数更高。
     *
     * **但它没有把 Ante 3 那道墙推倒。** 实测八个 seed 的贪心深度
     * 从 2.875 只抬到 3.0：商店两格里只有 ~28.6% 是消耗品、其中一半是塔罗，
     * 整局也就买到 1–5 张，而且抽到哪个牌型不由人挑
     * （买到 Two Pair 的星球，策略打的却是同花）。
     *
     * **原作里星球的主要来源是天体补充包**（一包 3 张、Jumbo 5 张），
     * 那是商店的第三格，在 17 号票。这条实测把它从「放最后」抬成了关键路径。
     */
    it('星球牌走通：买 → 用 → 牌型升级', () => {
        const run = new Run('QQQ777');
        let planets = 0;
        for (let i = 0; i < 3; i++) {
            const before = run.consumableUsage.total.planet;
            clearOneBlind(run, { consumables: true });
            planets += run.consumableUsage.total.planet - before;
        }
        expect(planets, 'QQQ777 的 Ante 1 三个商店里应该买得到星球').toBeGreaterThan(0);

        const leveled = Object.values(run.hands).filter((h) => h.level > 1);
        expect(leveled).toHaveLength(planets);
        // 升过级的牌型，chips 与 mult 都必须比 1 级高
        for (const h of leveled) {
            expect(h.chips).toBe(h.s_chips + h.l_chips * (h.level - 1));
            expect(h.mult).toBe(h.s_mult + h.l_mult * (h.level - 1));
        }
    });

    /**
     * 28 个 Boss 全实现之后，Ante 2 起就不再撞「未实现的 Boss」这道墙了。
     *
     * **止步的原因换成了缺牌型升级**：没有星球牌，牌型永远停在 1 级，
     * 而需求是 300 → 800 → 2000 → 5000 的指数曲线。实测贪心策略能到 Ante 2–4。
     * 这条测试只钉住「Ante 2 的三关都进得去、不抛异常」——
     * 打得过打不过取决于 seed 与策略，不该写进断言。
     */
    it('Ante 2 的三关都进得去（28 个 Boss 全实现之后不再撞墙）', () => {
        const run = new Run('JHZ7FPM');
        for (let i = 0; i < 3; i++) clearOneBlind(run);
        expect(run.ante).toBe(2);

        for (const expected of ['small', 'big', 'boss'] as const) {
            expect(run.blindKind).toBe(expected);
            const round = run.startRound(); // 不抛就算过
            expect(round.requirement).toBeGreaterThan(0);
            // 不管打不打得过，直接判过关往下走——这条测的是「进得去」
            (round as unknown as { phase: string }).phase = 'won';
            run.finishRound();
            run.leaveShop();
        }
        expect(run.ante).toBe(3);
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
                out.push(run.shop!.items.map(shopItemKey).join(','));
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

/**
 * 补充包的供给量——**16 号票那次「星球供不上」的量化对照**。
 *
 * 16 号票实测：商店两格整局只买得到 1–5 张星球（~28.6% 的格子是消耗品，
 * 其中一半还是塔罗）。这里钉住「一个天体包顶多少个商店格子」，
 * 这是机制事实，不依赖任何策略。
 */
describe('天体包的供给量', () => {
    it('一个普通天体包一次给 3 张星球，Jumbo 给 5 张', () => {
        const run = new Run('ALEEB', makeStandardDeck());
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.dollars = 200;

        expect(BOOSTER_CENTERS.p_celestial_normal_1.extra).toBe(3);
        expect(BOOSTER_CENTERS.p_celestial_jumbo_1.extra).toBe(5);

        // 对照：一整个商店最多两格，而且只有 ~14% 的格子是星球
        expect(SHOP_JOKER_MAX).toBe(2);
    });

    /**
     * **这一条是 17 号票的验收**：接上补充包之后，整局用掉的星球张数
     * 要比只有商店时多。贪心策略见 `fixtures/greedy-bot.ts`——
     * 它不挑牌，所以塔罗基本用不出来，量出来的就是星球那一条线。
     */
    it('带补充包跑完 Ante 1，星球供给比只有商店时多', () => {
        const withPacks = runAnte1('MNBVCXZ', true);
        const without = runAnte1('MNBVCXZ', false);
        expect(withPacks).toBeGreaterThan(without);
    });
});

/** 打完 Ante 1 的三关，返回整局用掉的星球张数 */
function runAnte1(seed: string, buyPacks: boolean): number {
    const run = new Run(seed, makeStandardDeck());
    for (let i = 0; i < 3; i++) {
        const round = run.startRound();
        playRound(round);
        if (round.phase !== 'won') break;
        run.finishRound();
        shopAndLeave(run, { consumables: true, packs: buyPacks });
    }
    return run.consumableUsage.total.planet;
}
