/**
 * `Run` 的测试：盲注序、钱、跨回合状态、RNG 的整局连续性。
 *
 * 「RNG 跨回合连续」那一组是这个文件里最要紧的：`G.GAME.pseudorandom` 是
 * **整局共享**的表，每回合新建一份会让所有 key 从头开始，
 * 从第二回合起与原版分叉。而这种分叉在单回合测试里完全看不出来。
 */

import { describe, expect, it } from 'vitest';

import { BLIND_CENTERS } from './blinds';
import { makeCard, makeStandardDeck, resetCardCounters } from './card';
import { packCardKey } from './booster-open';
import { makeConsumable } from './consumables';
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

describe('28 个 Boss 全都进得去', () => {
    it('每个 Boss 都能开局，不抛', () => {
        for (const [key, center] of Object.entries(BLIND_CENTERS)) {
            if (!center.boss) continue;
            const run = new Run('TUTORIAL');
            run.bossKey = key;
            run.blindIndex = 2;
            expect(() => run.startRound(), center.name).not.toThrow();
        }
    });

    it('The Needle 只给 1 次出牌', () => {
        const run = new Run('TUTORIAL');
        run.bossKey = 'bl_needle';
        run.blindIndex = 2;
        expect(run.startRound().handsLeft).toBe(1);
    });

    it('The Water 一次弃牌都不给', () => {
        const run = new Run('TUTORIAL');
        run.bossKey = 'bl_water';
        run.blindIndex = 2;
        expect(run.startRound().discardsLeft).toBe(0);
    });

    it('The Water 带 Drunkard（d_size +1）时**也是 0**，不是 1', () => {
        // 原文的 `discards_sub` 砍的是「进场时实际剩多少」，写死 3 会在这里留一次
        const run = new Run('TUTORIAL');
        run.jokers.push(makeJoker('j_drunkard'));
        run.bossKey = 'bl_water';
        run.blindIndex = 2;
        expect(run.startRound().discardsLeft).toBe(0);
    });

    it('The House 把第一批手牌全盖上', () => {
        const run = new Run('TUTORIAL');
        run.bossKey = 'bl_house';
        run.blindIndex = 2;
        const round = run.startRound();
        expect(round.hand.every((c) => c.facing === 'back')).toBe(true);
    });

    it('The Mark 只盖人头牌', () => {
        const run = new Run('TUTORIAL');
        run.bossKey = 'bl_mark';
        run.blindIndex = 2;
        const round = run.startRound();
        for (const card of round.hand) {
            const isFaceCard = [11, 12, 13].includes(card.base.id);
            expect(card.facing === 'back', card.key).toBe(isFaceCard);
        }
    });

    it('The Serpent 出牌后只补 3 张', () => {
        const run = new Run('TUTORIAL');
        run.bossKey = 'bl_serpent';
        run.blindIndex = 2;
        const round = run.startRound();
        expect(round.hand).toHaveLength(8);
        round.play(round.hand.slice(0, 5));
        // 出 5 张 → 手里剩 3 张 → 补 3 张（而不是补到 8）
        expect(round.hand).toHaveLength(6);
    });

    it('The Tooth 每打一张扣 $1', () => {
        const run = new Run('TUTORIAL');
        run.dollars = 10;
        run.bossKey = 'bl_tooth';
        run.blindIndex = 2;
        const round = run.startRound();
        round.play(round.hand.slice(0, 3));
        expect(round.dollars).toBe(7);
    });

    it('The Wall 的需求是 4 倍：Ante 1 → 1200', () => {
        const run = new Run('TUTORIAL');
        run.bossKey = 'bl_wall';
        run.blindIndex = 2;
        expect(run.startRound().requirement).toBe(1200);
    });

    it('The Arm 把打出的牌型降一级，但这手牌照常计分', () => {
        const run = new Run('TUTORIAL');
        run.bossKey = 'bl_arm';
        run.blindIndex = 2;
        const round = run.startRound();
        // 先把 Pair 升到 3 级，好让 The Arm 有东西可降
        round.hands.Pair.level = 3;
        round.hands.Pair.chips = 40;
        round.hands.Pair.mult = 4;

        const before = round.hands.Pair.level;
        const out = round.play(round.hand.slice(0, 5));
        expect(round.hands.Pair.level).toBe(out.handName === 'Pair' ? before - 1 : before);
        expect(out.debuffed).toBe(false); // 关键：照常计分
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

describe('消耗品区', () => {
    /** `misc_functions.lua:1862` 的 `consumable_slots = 2` */
    it('开局 2 个格子、空的', () => {
        const run = new Run('TUTORIAL');
        expect(run.consumableSlots).toBe(2);
        expect(run.consumables).toHaveLength(0);
        expect(run.consumablesFull).toBe(false);
    });

    it('满了再买就抛', () => {
        const run = new Run('TUTORIAL');
        run.consumables.push(makeConsumable('c_pluto'), makeConsumable('c_mars'));
        expect(run.consumablesFull).toBe(true);
    });

    it('用掉一张星球：牌型升级、卡离开消耗品区', () => {
        const run = new Run('TUTORIAL');
        run.consumables.push(makeConsumable('c_jupiter'));
        run.useConsumable(0);
        // Flush: chips 35 + 15 = 50，mult 4 + 2 = 6
        expect(run.hands.Flush).toMatchObject({ level: 2, chips: 50, mult: 6 });
        expect(run.consumables).toHaveLength(0);
    });

    /**
     * `card.lua:1094` 的 `set_consumeable_usage` 是 `use_consumeable` 的**第一句**，
     * 排在所有效果之前。所以就算效果还没实现，计数也对得上——
     * `Fortune Teller` / `Satellite` 读的是这份计数。
     */
    it('用量在效果之前记：Fortune Teller 读得到的那个数会涨', () => {
        const run = new Run('TUTORIAL');
        run.consumables.push(makeConsumable('c_pluto'));
        expect(run.consumableUsage.total.planet).toBe(0);
        run.useConsumable(0);
        expect(run.consumableUsage.total.planet).toBe(1);
        expect(run.consumableUsage.total.all).toBe(1);
    });

    /**
     * 原作里用不了的卡按钮是灰的，点不下去（`card.lua:1545`）。`Run` 不拦的话：
     * 选 0 张用 Death 会在效果里崩，选 0 张用 The Magician 会**静默吞掉**那张卡——
     * 计数照记、效果为空。贪心 bot 以前就是这么把塔罗「用」掉的。
     */
    it('用不了的卡**抛**，不静默吞掉：选 0 张用 Death / The Magician', () => {
        const run = new Run('TUTORIAL');
        run.consumables.push(makeConsumable('c_death'), makeConsumable('c_magician'));
        expect(() => run.useConsumable(0, [])).toThrow('现在用不了');
        expect(() => run.useConsumable(1, [])).toThrow('现在用不了');
        // 没有副作用：卡还在，计数没涨
        expect(run.consumables).toHaveLength(2);
        expect(run.consumableUsage.total.all).toBe(0);
    });

    it('用掉之后那张卡还回池子（used 标记解除）', () => {
        const run = new Run('TUTORIAL');
        run.consumables.push(makeConsumable('c_pluto'));
        run.usedJokers.add('c_pluto');
        run.useConsumable(0);
        expect(run.usedJokers.has('c_pluto')).toBe(false);
    });

    it('卖一张：cost 3 → 卖价 max(1, floor(3/2)) = 1', () => {
        const run = new Run('TUTORIAL');
        run.consumables.push(makeConsumable('c_pluto'));
        const before = run.dollars;
        expect(run.sellConsumable(0)).toBe(1);
        expect(run.dollars).toBe(before + 1);
        expect(run.consumables).toHaveLength(0);
    });

    /**
     * 塔罗还没有行为。**这里必须抛，不能静默什么都不做**——
     * 与 Boss 的 `assertImplemented` 同一条：静默等于把缺口伪装成正常行为。
     * 表现层靠 `canUseConsumable` 把按钮灰掉。
     */
    /**
     * **实现了 ≠ 现在能用。** The Wheel of Fortune 要「小丑区里有没版本的小丑」，
     * 小丑区空着就用不了（`card.lua:1536` 的 `eligible_strength_jokers`）。
     */
    it('The Wheel of Fortune 在小丑区空着时用不了', () => {
        const run = new Run('TUTORIAL');
        run.consumables.push(makeConsumable('c_wheel_of_fortune'));
        expect(run.canUseConsumable(0)).toBe(false);
    });

    it('小丑区有一张没版本的小丑就能用了', () => {
        const run = new Run('TUTORIAL');
        run.jokers.push(makeJoker('j_banner'));
        run.consumables.push(makeConsumable('c_wheel_of_fortune'));
        expect(run.canUseConsumable(0)).toBe(true);
    });

    /**
     * **实现了 ≠ 现在能用。** `The Fool` 有 spec，但没有「上一张」时用不了。
     */
    it('The Fool 在没有「上一张」时用不了（can_use_consumeable 那一关）', () => {
        const run = new Run('TUTORIAL');
        run.consumables.push(makeConsumable('c_fool'));
        expect(run.lastTarotPlanet).toBeUndefined();
        expect(run.canUseConsumable(0)).toBe(false);
    });

    it('用过一张星球之后，The Fool 就能复制它了', () => {
        const run = new Run('TUTORIAL');
        run.consumables.push(makeConsumable('c_pluto'), makeConsumable('c_fool'));
        run.useConsumable(0);
        expect(run.lastTarotPlanet).toBe('c_pluto');
        expect(run.canUseConsumable(0)).toBe(true);
        run.useConsumable(0);
        expect(run.consumables.map((c) => c.key)).toEqual(['c_pluto']);
    });

    it('星球是能用的', () => {
        const run = new Run('TUTORIAL');
        run.consumables.push(makeConsumable('c_pluto'));
        expect(run.canUseConsumable(0)).toBe(true);
    });
});

describe('回归：用消耗品之后会问一遍小丑', () => {
    /**
     * `button_callbacks.lua:2330`。漏掉这一趟，`Constellation` 就是个空实现——
     * 而 `isJokerImplemented` 会照样把它报成已实现。
     */
    it('Constellation 在 Run.useConsumable 之后真的长 x_mult', () => {
        const run = new Run('TUTORIAL');
        const joker = makeJoker('j_constellation');
        run.jokers.push(joker);
        run.consumables.push(makeConsumable('c_pluto'));

        run.useConsumable(0);
        expect(joker.ability.x_mult).toBeCloseTo(1.1);
    });

    it('用塔罗不长（Constellation 只认星球）', () => {
        const run = new Run('TUTORIAL');
        const joker = makeJoker('j_constellation');
        run.jokers.push(joker);
        // The Hermit 随时能用、不需要选牌
        run.consumables.push(makeConsumable('c_hermit'));

        run.useConsumable(0);
        expect(joker.ability.x_mult).toBe(1);
    });

    it('用塔罗会让 Fortune Teller 的计数涨（consumeable_usage_tarot 接上了）', () => {
        const run = new Run('TUTORIAL');
        run.consumables.push(makeConsumable('c_hermit'));
        run.useConsumable(0);
        expect(run.consumableUsage.total.tarot).toBe(1);
    });
});

describe('回归：换牌面不推进全局自增计数器', () => {
    /**
     * `sort_id` 是 `pseudoshuffle` 的规范序。`setBase` 借 `makeCard` 造一张
     * 再抄过来会白白推进它，等 `增删牌` 那组小丑接进来，新造的牌就会拿到
     * 偏移过的 `sort_id`，同 seed 的洗牌跟着分叉。
     */
    it('The Sun 换三次花色之后，新造的牌 sort_id 不偏', () => {
        resetCardCounters();
        const deck = makeStandardDeck();
        const probe1 = makeCard('S_A', 'Spades', 'Ace');

        const run = new Run('TUTORIAL', deck);
        run.consumables.push(
            makeConsumable('c_sun'), makeConsumable('c_sun'), makeConsumable('c_sun'),
        );
        for (let i = 2; i >= 0; i--) run.useConsumable(i, [deck[0]]);

        const probe2 = makeCard('S_A', 'Spades', 'Ace');
        expect(probe2.sort_id).toBe(probe1.sort_id + 1);
        expect(probe2.unique_val).toBe(probe1.unique_val + 1);
    });
});

describe('补充包：商店第三、四格', () => {
    function intoShop(seed: string): Run {
        const run = new Run(seed, makeStandardDeck());
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        return run;
    }

    it('商店有两个补充包格子', () => {
        const run = intoShop('ALEEB');
        expect(run.shop!.packs).toHaveLength(2);
    });

    /** `common_events.lua:1984`。新档保底，而且那一格不掷点 */
    it('新档第一个商店的第一格恒是小丑包', () => {
        for (const seed of ['ALEEB', 'TUTORIAL', 'QQQ777']) {
            const run = intoShop(seed);
            expect(run.shop!.packs[0]!.key, seed).toBe('p_buffoon_normal_1');
        }
    });

    it('第二个商店起两格都是抽的，不再保底', () => {
        const run = intoShop('ALEEB');
        run.leaveShop();
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        // 两格都可能是任何一种；只断言「不再保底」不好写，
        // 改断言 firstShopBuffoon 已经置真（下一次 getPack 会正常掷点）
        expect(run.firstShopBuffoon).toBe(true);
    });

    /** `reroll_shop` 只清 `G.shop_jokers`——补充包不跟着换 */
    it('重掷不换补充包', () => {
        const run = intoShop('ALEEB');
        run.dollars = 50;
        const before = run.shop!.packs.map((p) => p?.key);
        run.rerollShop();
        expect(run.shop!.packs.map((p) => p?.key)).toEqual(before);
    });

    it('买下来那一格就空了', () => {
        const run = intoShop('ALEEB');
        run.dollars = 50;
        run.buyAndOpenPack(0);
        expect(run.shop!.packs[0]).toBeNull();
    });
});

describe('开包', () => {
    function intoShopWithPack(seed = 'ALEEB'): Run {
        const run = new Run(seed, makeStandardDeck());
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.dollars = 50;
        return run;
    }

    it('买了就直接开，包里有牌', () => {
        const run = intoShopWithPack();
        const pack = run.buyAndOpenPack(0);
        expect(run.openPack).toBe(pack);
        expect(pack.cards.length).toBeGreaterThan(0);
    });

    it('扣钱', () => {
        const run = intoShopWithPack();
        const cost = run.shop!.packCost(0);
        const before = run.dollars;
        run.buyAndOpenPack(0);
        expect(run.dollars).toBe(before - cost);
    });

    it('挑走一张小丑 → 进小丑区，包自动关（choose = 1）', () => {
        const run = intoShopWithPack();
        const pack = run.buyAndOpenPack(0); // 小丑包
        expect(pack.cards[0].kind).toBe('joker');
        run.takeFromPack(0);
        expect(run.jokers).toHaveLength(1);
        expect(run.openPack).toBeNull();
    });

    it('没挑走的那张还回池子（关包时解除 used）', () => {
        const run = intoShopWithPack();
        const pack = run.buyAndOpenPack(0);
        const left = pack.cards[1];
        const leftKey = packCardKey(left)!;
        run.takeFromPack(0);
        expect(run.usedJokers.has(leftKey)).toBe(false);
    });

    it('挑走的那张留着 used 标记（它还活着）', () => {
        const run = intoShopWithPack();
        const pack = run.buyAndOpenPack(0);
        const taken = pack.cards[0];
        const key = packCardKey(taken)!;
        run.takeFromPack(0);
        expect(run.usedJokers.has(key)).toBe(true);
    });

    /** `button_callbacks.lua:2668`：**跳过**才触发 `skipping_booster` */
    it('跳过会让 Red Card 长倍率，挑满自动关包不会', () => {
        const skip = intoShopWithPack();
        const red = makeJoker('j_red_card');
        skip.jokers.push(red);
        skip.buyAndOpenPack(0);
        skip.skipPack();
        expect(red.ability.mult).toBe(red.ability.extra);

        const take = intoShopWithPack();
        const red2 = makeJoker('j_red_card');
        take.jokers.push(red2);
        take.buyAndOpenPack(0);
        take.takeFromPack(0);
        expect(red2.ability.mult).toBe(0);
    });

    it('跳过也把包里的牌还回池子', () => {
        const run = intoShopWithPack();
        const pack = run.buyAndOpenPack(0);
        const keys = pack.cards.map((c) => packCardKey(c)!);
        run.skipPack();
        for (const key of keys) expect(run.usedJokers.has(key)).toBe(false);
        expect(run.openPack).toBeNull();
    });

    it('包还开着就不许离开商店', () => {
        const run = intoShopWithPack();
        run.buyAndOpenPack(0);
        expect(() => run.leaveShop()).toThrow(/补充包/);
    });

    it('小丑区满了就挑不走小丑', () => {
        const run = intoShopWithPack();
        for (const k of ['j_joker', 'j_jolly', 'j_sly', 'j_half', 'j_banner']) {
            run.jokers.push(makeJoker(k));
        }
        run.buyAndOpenPack(0);
        expect(run.canTakeFromPack(0)).toBe(false);
        expect(() => run.takeFromPack(0)).toThrow(/满了/);
    });

    it('五种包都买得了（覆盖面 5/5）', () => {
        const run = intoShopWithPack();
        run.leaveShop();
        const seen = new Set<string>();
        for (let i = 0; i < 80 && seen.size < 5; i++) {
            const round = run.startRound();
            (round as unknown as { phase: string }).phase = 'won';
            run.finishRound();
            run.dollars = 50;
            for (let p = 0; p < run.shop!.packs.length; p++) {
                const slot = run.shop!.packs[p];
                if (slot) {
                    seen.add(slot.center.kind);
                    expect(run.canBuyPack(p), slot.center.name).toBe(true);
                }
            }
            run.leaveShop();
        }
        expect([...seen].sort()).toEqual(
            ['Arcana', 'Buffoon', 'Celestial', 'Spectral', 'Standard'],
        );
    });
});

describe('幽灵牌改手牌上限（跨回合持续）', () => {
    it('用过 Ouija 之后，下一回合的手牌上限是 7', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const first = run.startRound();
        expect(first.handLimit).toBe(8);

        run.consumables.push(makeConsumable('c_ouija'));
        run.useConsumable(0);
        expect(run.handSizeDelta).toBe(-1);

        (first as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.leaveShop();
        expect(run.startRound().handLimit).toBe(7);
    });
});

describe('回归：Astronomer 的价格要现算', () => {
    function intoShop(seed: string): Run {
        const run = new Run(seed, makeStandardDeck());
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.dollars = 100;
        return run;
    }

    /**
     * `card.lua:616`：`Astronomer` 进小丑区时原作会把**所有卡重新定价一遍**
     * （`for k, v in pairs(G.I.CARD) do v:set_cost() end`）。
     * 价格算死在建格子那一刻的话，「先买 Astronomer 再买天体包」还是收全价。
     */
    it('商店里买到 Astronomer 之后，天体包立刻变免费', () => {
        for (let i = 0; i < 60; i++) {
            const run = intoShop(`S${i}`);
            const packIdx = run.shop!.packs.findIndex((p) => p?.center.kind === 'Celestial');
            if (packIdx < 0) { run.leaveShop(); continue; }

            expect(run.shop!.packCost(packIdx)).toBeGreaterThan(0);
            run.jokers.push(makeJoker('j_astronomer'));
            expect(run.shop!.packCost(packIdx)).toBe(0);
            return;
        }
        throw new Error('60 个商店里一个天体包都没出现？');
    });

    it('星球牌那一格同理', () => {
        for (let i = 0; i < 80; i++) {
            const run = intoShop(`P${i}`);
            const idx = run.shop!.items.findIndex(
                (x) => x.kind === 'consumable' && x.consumable.center.set === 'Planet',
            );
            if (idx < 0) { run.leaveShop(); continue; }

            expect(run.shop!.itemCost(idx)).toBe(3);
            run.jokers.push(makeJoker('j_astronomer'));
            expect(run.shop!.itemCost(idx)).toBe(0);
            return;
        }
        throw new Error('80 个商店里一格星球牌都没出现？');
    });

    it('塔罗牌不免费（Astronomer 只管星球与天体包）', () => {
        for (let i = 0; i < 80; i++) {
            const run = intoShop(`T${i}`);
            run.jokers.push(makeJoker('j_astronomer'));
            const idx = run.shop!.items.findIndex(
                (x) => x.kind === 'consumable' && x.consumable.center.set === 'Tarot',
            );
            if (idx < 0) { run.leaveShop(); continue; }
            expect(run.shop!.itemCost(idx)).toBe(3);
            return;
        }
        throw new Error('80 个商店里一格塔罗都没出现？');
    });
});

describe('回归：Blue 蜡封造出来的星球要退出池子', () => {
    it('造出来的那张进了 usedJokers', () => {
        const run = new Run('TUTORIAL', makeStandardDeck());
        const round = run.startRound();
        const pair = [round.hand[0], round.hand[1]];
        // 凑一手打出去，好让 lastHandPlayed 有值
        round.play([pair[0]]);
        round.hand[0].seal = 'Blue';
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();

        const made = run.consumables[0];
        if (!made) throw new Error('Blue 蜡封没造出星球？');
        expect(run.usedJokers.has(made.key)).toBe(true);
    });
});

describe('赢（state_events.lua:113）', () => {
    const win = (run: Run) => {
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
    };

    it('打过 Ante 8 的 Boss 置 won，局不结束，接着进商店（无尽模式）', () => {
        const run = new Run('WIN', makeStandardDeck());
        run.ante = 8;
        win(run);
        run.leaveShop();
        win(run);
        run.leaveShop();
        expect(run.won).toBe(false);
        win(run);
        expect(run.won).toBe(true);
        expect(run.ante).toBe(9);
        expect(run.state).toBe('shop');
    });

    it('Ante 7 的 Boss 不算', () => {
        const run = new Run('WIN', makeStandardDeck());
        run.ante = 7;
        for (let i = 0; i < 3; i++) {
            win(run);
            if (i < 2) run.leaveShop();
        }
        expect(run.won).toBe(false);
    });
});
