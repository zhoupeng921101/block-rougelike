/**
 * 优惠券（19 号票）。
 *
 * 口径与标签那组一样：期望值手算、算式写进用例名。
 * 效果那几组**直接指定商店摆哪张**（改 `run.currentVoucher`），不靠 seed 去碰。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { BOOSTER_CENTERS } from './boosters';
import { openBooster } from './booster-open';
import { makeStandardDeck, resetCardCounters } from './card';
import { makeJoker } from './jokers';
import { PseudorandomState, pseudorandomElement } from './rng';
import { Run } from './run';
import { initialHands } from './scoring';
import type { HandName } from './poker-hands';
import { DEFAULT_POOL_FIELDS, type PoolContext, createCardForShop } from './shop';
import { makeTag } from './tags';
import { VOUCHER_CENTERS, VOUCHER_KEYS_BY_ORDER, nextVoucherKey, voucherPool } from './vouchers';

beforeEach(() => resetCardCounters());

const fresh = (seed = 'TUTORIAL') => new Run(seed, makeStandardDeck());
const empty = { ante: 1, usedVouchers: new Set<string>(), inShop: [] as string[] };

/** 打完当前这一关（直接判过关） */
function winRound(run: Run): void {
    const round = run.startRound();
    (round as unknown as { phase: string }).phase = 'won';
    run.finishRound();
}

/** 让下一个商店摆 `key`，打完这一关、进商店、给够钱，兑换它 */
function redeem(run: Run, key: string, dollars = 100): void {
    run.currentVoucher = key;
    winRound(run);
    run.dollars = dollars;
    const i = run.shop!.vouchers.findIndex((v) => v.key === key);
    run.redeemVoucher(i);
}

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

// ————————————————————————————————————————————————————————————————
// 数据、池子、抽取
// ————————————————————————————————————————————————————————————————

describe('优惠券池', () => {
    it('32 张按 order 排；一级（奇数 order）16 张解锁、二级全锁', () => {
        expect(VOUCHER_KEYS_BY_ORDER).toHaveLength(32);
        VOUCHER_KEYS_BY_ORDER.forEach((k, i) => {
            expect(VOUCHER_CENTERS[k].order).toBe(i + 1);
            expect(VOUCHER_CENTERS[k].unlocked).toBe(i % 2 === 0);
        });
    });

    it('Merchant 的 extra 是 9.6/4，照抄浮点：4 × extra = 9.6', () => {
        expect(4 * VOUCHER_CENTERS.v_tarot_merchant.config.extra!).toBe(9.6);
    });

    it('新局 32 格、16 格可用；二级优惠券即使 requires 满足也不进（没解锁）', () => {
        const pool = voucherPool(empty);
        expect(pool).toHaveLength(32);
        expect(pool.filter((k) => k !== 'UNAVAILABLE')).toHaveLength(16);
        const used = new Set(['v_hone']);
        expect(voucherPool({ ...empty, usedVouchers: used })).not.toContain('v_glow_up');
    });

    it('已兑换的、正摆在商店里的不进', () => {
        const pool = voucherPool({ ...empty, usedVouchers: new Set(['v_hone']), inShop: ['v_blank'] });
        expect(pool).not.toContain('v_hone');
        expect(pool).not.toContain('v_blank');
        expect(pool.filter((k) => k !== 'UNAVAILABLE')).toHaveLength(14);
    });

    it('16 张全兑换了就退化成 [v_blank]', () => {
        const all = new Set(VOUCHER_KEYS_BY_ORDER.filter((k) => VOUCHER_CENTERS[k].unlocked));
        expect(voucherPool({ ...empty, usedVouchers: all })).toEqual(['v_blank']);
    });

    it('Voucher<ante> 抽一次（+ resample）；手推一遍逐位相同', () => {
        for (const seed of ['TUTORIAL', 'ABCDEFGH', '1234']) {
            const a = new PseudorandomState(seed);
            const b = new PseudorandomState(seed);
            const got = nextVoucherKey(a, { ...empty, ante: 3 });
            const pool = voucherPool(empty);
            let [k] = pseudorandomElement(pool, b.pseudoseed('Voucher3'));
            let it = 1;
            while (k === 'UNAVAILABLE') {
                it++;
                [k] = pseudorandomElement(pool, b.pseudoseed(`Voucher3_resample${it}`));
            }
            expect(got).toBe(k);
        }
    });

    it('Voucher Tag 那条 key 是 Voucher_fromtag，**不带 ante**', () => {
        const a = new PseudorandomState('TUTORIAL');
        const b = new PseudorandomState('TUTORIAL');
        const got = nextVoucherKey(a, { ...empty, ante: 5 }, true);
        const pool = voucherPool(empty);
        let [k] = pseudorandomElement(pool, b.pseudoseed('Voucher_fromtag'));
        let it = 1;
        while (k === 'UNAVAILABLE') {
            it++;
            [k] = pseudorandomElement(pool, b.pseudoseed(`Voucher_fromtag_resample${it}`));
        }
        expect(got).toBe(k);
    });
});

describe('Run 里的抽取时机', () => {
    it('开局抽 Voucher1；打完 Boss 抽 Voucher2（新 Ante 的 key）', () => {
        const run = fresh();
        expect(run.currentVoucher).toBe(nextVoucherKey(new PseudorandomState('TUTORIAL'), empty));
        for (let i = 0; i < 3; i++) {
            winRound(run);
            if (i < 2) run.leaveShop();
        }
        expect(run.ante).toBe(2);
        expect(run.currentVoucher).toBe(nextVoucherKey(new PseudorandomState('TUTORIAL'), { ...empty, ante: 2 }));
    });

    it('没买就一直摆着：小盲注后、大盲注后的商店是同一张', () => {
        const run = fresh();
        const key = run.currentVoucher;
        winRound(run);
        expect(run.shop!.vouchers.map((v) => v.key)).toEqual([key]);
        run.leaveShop();
        winRound(run);
        expect(run.shop!.vouchers.map((v) => v.key)).toEqual([key]);
    });

    it('兑换：扣 $10、记进 usedVouchers、清掉 currentVoucher，下一个商店不再摆', () => {
        const run = fresh();
        redeem(run, 'v_blank', 30);
        expect(run.dollars).toBe(20);
        expect(run.usedVouchers.has('v_blank')).toBe(true);
        expect(run.currentVoucher).toBeNull();
        expect(run.shop!.vouchers).toEqual([]);
        run.leaveShop();
        winRound(run);
        expect(run.shop!.vouchers).toEqual([]);
    });

    it('买掉 Voucher Tag 给的那张，**主优惠券也不再摆**（card.lua:1852 无条件清）', () => {
        const run = fresh();
        run.addTag(makeTag('tag_voucher'));
        winRound(run);
        const shop = run.shop!;
        const main = shop.vouchers[0].key;
        run.dollars = 100;
        run.redeemVoucher(1);
        expect(shop.vouchers.map((v) => v.key)).toEqual([main]); // 这个商店里还在
        expect(run.currentVoucher).toBeNull();
        run.leaveShop();
        winRound(run);
        expect(run.shop!.vouchers).toEqual([]);
    });

    it('两张 Voucher Tag 各加一张，三张互不相同', () => {
        const run = fresh();
        run.addTag(makeTag('tag_voucher'));
        run.addTag(makeTag('tag_voucher'));
        winRound(run);
        const keys = run.shop!.vouchers.map((v) => v.key);
        expect(keys).toHaveLength(3);
        expect(new Set(keys).size).toBe(3);
    });

    it('买不起不让买', () => {
        const run = fresh();
        run.currentVoucher = 'v_blank';
        winRound(run);
        run.dollars = 9;
        expect(run.canRedeemVoucher(0)).toBe(false);
        expect(() => run.redeemVoucher(0)).toThrow(/买不起/);
    });
});

// ————————————————————————————————————————————————————————————————
// 16 张的效果
// ————————————————————————————————————————————————————————————————

describe('商店那几张', () => {
    it('Overstock：当场补第三格；之后的商店都是三格', () => {
        const run = fresh();
        redeem(run, 'v_overstock_norm');
        expect(run.shop!.items).toHaveLength(3);
        run.rerollShop();
        expect(run.shop!.items).toHaveLength(3);
        run.leaveShop();
        winRound(run);
        expect(run.shop!.items).toHaveLength(3);
    });

    it('Clearance Sale：floor((c + 0.5) × 0.75)——优惠券 10 → 7、包也打折、手上的 Blueprint 10 → 7（卖 3）', () => {
        const run = fresh();
        const joker = makeJoker('j_blueprint'); // cost 10
        run.jokers.push(joker);
        run.addTag(makeTag('tag_voucher'));
        run.currentVoucher = 'v_clearance_sale';
        winRound(run);
        run.dollars = 100;
        const i = run.shop!.vouchers.findIndex((v) => v.key === 'v_clearance_sale');
        run.redeemVoucher(i);
        expect(run.dollars).toBe(90); // 自己按原价
        expect(run.shop!.voucherCost(0)).toBe(7);
        // Blueprint 10 → floor(10.5 × 0.75) = 7，卖价 floor(7/2) = 3
        expect(joker.cost).toBe(7);
        expect(joker.sell_cost).toBe(3);
        const pack = run.shop!.packs[0]!;
        expect(run.shop!.packCost(0)).toBe(Math.floor((pack.center.cost + 0.5) * 0.75));
    });

    it('Clearance Sale 之后新造的卡也打折（重掷出来的）', () => {
        const run = fresh();
        redeem(run, 'v_clearance_sale');
        run.dollars = 100;
        run.rerollShop();
        for (const item of run.shop!.items) {
            const base = item.kind === 'joker' ? item.joker.center.cost : item.kind === 'consumable' ? item.consumable.center.cost : 1;
            expect(item.cost).toBeLessThanOrEqual(Math.max(1, Math.floor((base + 5 + 0.5) * 0.75)));
        }
        // 星球 3 → floor(3.5 × 0.75) = 2
        const planet = run.shop!.items.find((it) => it.kind === 'consumable' && it.consumable.center.set === 'Planet');
        if (planet && planet.kind === 'consumable') expect(planet.consumable.cost).toBe(2);
    });

    it('Reroll Surplus：当前价 5 → 3，重掷一次 3 + 1 = 4；下个商店从 3 起', () => {
        const run = fresh();
        redeem(run, 'v_reroll_surplus');
        expect(run.shop!.rerollCost).toBe(3);
        run.rerollShop();
        expect(run.shop!.rerollCost).toBe(4);
        run.leaveShop();
        winRound(run);
        expect(run.shop!.rerollCost).toBe(3);
    });

    it('Reroll Surplus 与 D6 同场：当前价 max(0, 0 − 2) = 0，重掷后按 D6 的 0 起算 → 1', () => {
        const run = fresh();
        run.addTag(makeTag('tag_d_six'));
        redeem(run, 'v_reroll_surplus');
        expect(run.shop!.rerollCost).toBe(0);
        run.rerollShop();
        expect(run.shop!.rerollCost).toBe(1);
    });

    it('Tarot / Planet Merchant、Magic Trick、Hone 改池子上下文', () => {
        const run = fresh();
        expect(run.poolContext().rates).toEqual({ joker: 20, tarot: 4, planet: 4, playing_card: 0, spectral: 0 });
        for (const k of ['v_tarot_merchant', 'v_planet_merchant', 'v_magic_trick', 'v_hone']) run.usedVouchers.add(k);
        const c = run.poolContext();
        expect(c.rates).toEqual({ joker: 20, tarot: 9.6, planet: 9.6, playing_card: 4, spectral: 0 });
        expect(c.editionRate).toBe(2);
    });

    it('Magic Trick 的扑克牌格：只掷 cdt 与 frontsho1，$1，买了进整副牌', () => {
        const rates = { joker: 0, tarot: 0, planet: 0, playing_card: 4, spectral: 0 };
        const rng = new PseudorandomState('TUTORIAL');
        const item = createCardForShop(rng, ctx({ rates }));
        expect(item.kind).toBe('card');
        expect(item.cost).toBe(1);

        const run = fresh();
        run.usedVouchers.add('v_magic_trick');
        const before = run.fullDeck.length;
        winRound(run);
        run.dollars = 100;
        // 找一格扑克牌；没有就重掷，直到出现（权重 4 / 32，很快）
        let i = run.shop!.items.findIndex((it) => it.kind === 'card');
        for (let n = 0; i < 0 && n < 50; n++) {
            run.rerollShop();
            i = run.shop!.items.findIndex((it) => it.kind === 'card');
        }
        expect(i).toBeGreaterThanOrEqual(0);
        const card = run.buyPlayingCard(i);
        expect(run.fullDeck).toHaveLength(before + 1);
        expect(run.fullDeck).toContain(card);
    });
});

describe('回合参数那几张', () => {
    it('Grabber +1 出牌、Wasteful +1 弃牌、Paint Brush +1 手牌上限、Crystal Ball +1 消耗品格', () => {
        const run = fresh();
        for (const k of ['v_grabber', 'v_wasteful', 'v_paint_brush', 'v_crystal_ball']) run.usedVouchers.add(k);
        expect(run.consumableSlots).toBe(3);
        const round = run.startRound();
        expect(round.handsLeft).toBe(5);
        expect(round.discardsLeft).toBe(5); // 3 + 红牌组 1 + Wasteful 1
        expect(round.handLimit).toBe(9);
    });

    it('Hieroglyph：兑换当场 Ante −1，之后每回合出牌 4 − 1 = 3', () => {
        const run = fresh();
        for (let i = 0; i < 3; i++) {
            winRound(run);
            if (i < 2) run.leaveShop();
        }
        expect(run.ante).toBe(2);
        run.currentVoucher = null;
        run.shop!.vouchers.length = 0;
        run.shop!.vouchers.push({ key: 'v_hieroglyph', center: VOUCHER_CENTERS.v_hieroglyph, main: true });
        run.dollars = 100;
        run.redeemVoucher(0);
        expect(run.ante).toBe(1);
        expect(run.shop!.context.ante).toBe(1); // 商店的上下文现取，重掷用新 Ante
        run.leaveShop();
        expect(run.startRound().handsLeft).toBe(3);
    });

    it('The Needle 砍到只剩 1 按含 Grabber 的出牌数算：5 → 1', () => {
        const run = fresh();
        run.usedVouchers.add('v_grabber');
        run.blindIndex = 2;
        run.bossKey = 'bl_needle';
        expect(run.startRound().handsLeft).toBe(1);
    });

    it('Seed Money：$50 的利息 min(10, 50/5) = 10（没有它是 5）', () => {
        const run = fresh();
        run.usedVouchers.add('v_seed_money');
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        round.dollars = 50;
        const { payout } = run.finishRound();
        expect(payout.rows.find((r) => r.kind === 'interest')?.dollars).toBe(10);
    });
});

describe('Telescope', () => {
    const celestial = BOOSTER_CENTERS.p_celestial_normal_1;

    it('第一张是打得最多的牌型的星球（Pair → Mercury），其余照常抽', () => {
        const handsPlayed = { ...ctx().handsPlayed, Pair: 3, Flush: 1 };
        const pack = openBooster(new PseudorandomState('T'), celestial, 'p_celestial_normal_1', ctx({ telescope: true, handsPlayed }));
        const first = pack.cards[0];
        expect(first.kind === 'consumable' && first.consumable.key).toBe('c_mercury');
    });

    it('并列取 G.handlist 里靠前的（Flush 排在 Pair 前面）', () => {
        const handsPlayed = { ...ctx().handsPlayed, Pair: 2, Flush: 2 };
        const pack = openBooster(new PseudorandomState('T'), celestial, 'p_celestial_normal_1', ctx({ telescope: true, handsPlayed }));
        const first = pack.cards[0];
        expect(first.kind === 'consumable' && first.consumable.key).toBe('c_jupiter');
    });

    it('一手都没打过：与没有 Telescope 完全相同（包括 soul 那次掷点）', () => {
        const a = openBooster(new PseudorandomState('T'), celestial, 'p_celestial_normal_1', ctx({ telescope: true }));
        const b = openBooster(new PseudorandomState('T'), celestial, 'p_celestial_normal_1', ctx());
        const keys = (p: typeof a) => p.cards.map((c) => (c.kind === 'consumable' ? c.consumable.key : ''));
        expect(keys(a)).toEqual(keys(b));
    });

    it('forced 那张不掷 soul、不抽池子：后面几张与「少造一张」的普通包错开一位', () => {
        const handsPlayed = { ...ctx().handsPlayed, Pair: 1 };
        const tele = openBooster(new PseudorandomState('T'), celestial, 'p_celestial_normal_1', ctx({ telescope: true, handsPlayed }));
        const plain = openBooster(new PseudorandomState('T'), BOOSTER_CENTERS.p_celestial_normal_1, 'x', ctx({ handsPlayed, usedJokers: new Set(['c_mercury']) }));
        const keys = (p: typeof tele) => p.cards.map((c) => (c.kind === 'consumable' ? c.consumable.key : ''));
        expect(keys(tele).slice(1)).toEqual(keys(plain).slice(0, tele.cards.length - 1));
    });
});

describe("Director's Cut", () => {
    it('每个 Ante 花 $10 重掷一次 Boss；进新 Ante 恢复', () => {
        const run = fresh();
        expect(run.canRerollBoss).toBe(false);
        redeem(run, 'v_directors_cut');
        run.leaveShop();
        run.dollars = 25;
        expect(run.canRerollBoss).toBe(true);
        run.rerollBoss();
        expect(run.dollars).toBe(15);
        expect(run.bossesUsed[run.bossKey]).toBeGreaterThan(0);
        expect(run.canRerollBoss).toBe(false);
        winRound(run);
        run.leaveShop();
        winRound(run);
        run.leaveShop();
        expect(run.ante).toBe(2);
        expect(run.canRerollBoss).toBe(true);
    });

    it('Boss Tag 也置 boss_rerolled：拿过它的 Ante 就不能再用', () => {
        const run = fresh();
        redeem(run, 'v_directors_cut');
        run.addTag(makeTag('tag_boss'));
        run.leaveShop(); // 进盲注选择时 new_blind_choice 触发 Boss Tag
        run.dollars = 25;
        expect(run.bossRerolled).toBe(true);
        expect(run.canRerollBoss).toBe(false);
    });

    it('钱只算到 bankrupt_at：$9 不能按', () => {
        const run = fresh();
        run.usedVouchers.add('v_directors_cut');
        run.dollars = 9;
        expect(run.canRerollBoss).toBe(false);
    });
});
