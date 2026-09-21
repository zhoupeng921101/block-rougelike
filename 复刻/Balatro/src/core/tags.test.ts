/**
 * 标签与跳过盲注（18 号票）。
 *
 * 口径与小丑那几批一样：期望值手算、算式写进用例名。
 * 大多数用例**直接指定这一格给哪个标签**（改 `run.blindTags`），不靠 seed 去碰——
 * 测的是标签的效果，不是抽取。抽取另有一组。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { makeStandardDeck, resetCardCounters } from './card';
import { makeJoker } from './jokers';
import { PseudorandomState } from './rng';
import { Run } from './run';
import { TAG_CENTERS, makeTag, nextTagKey, tagPool } from './tags';

beforeEach(() => resetCardCounters());

const fresh = (seed = 'TUTORIAL') => new Run(seed, makeStandardDeck());

/** 打完当前这一关（直接判过关），可选地把剩余弃牌设成 n */
function winRound(run: Run, discardsLeft?: number): void {
    const round = run.startRound();
    if (discardsLeft !== undefined) round.discardsLeft = discardsLeft;
    (round as unknown as { phase: string }).phase = 'won';
    run.finishRound();
}

// ————————————————————————————————————————————————————————————————
// 池子与抽取
// ————————————————————————————————————————————————————————————————

describe('标签池', () => {
    it('24 格按 order 排，Ante 1 可用 11 个：5 个要「已发现」的 + 8 个 min_ante 2 的占位', () => {
        const pool = tagPool(1);
        expect(pool).toHaveLength(24);
        expect(pool.filter((k) => k !== 'UNAVAILABLE')).toEqual([
            'tag_uncommon', 'tag_investment', 'tag_voucher', 'tag_boss', 'tag_charm',
            'tag_coupon', 'tag_double', 'tag_juggle', 'tag_d_six', 'tag_skip', 'tag_economy',
        ]);
    });

    it('Ante 2 起 19 个：Rare 与四个版本标签**永远抽不到**（指定 seed 不会「发现」任何东西）', () => {
        const pool = tagPool(2);
        expect(pool.filter((k) => k !== 'UNAVAILABLE')).toHaveLength(19);
        for (const k of ['tag_rare', 'tag_negative', 'tag_foil', 'tag_holo', 'tag_polychrome']) {
            expect(pool).not.toContain(k);
        }
    });

    it('抽 500 次：从不抽到占位、从不抽到池外的；同 seed 同结果', () => {
        const a = new PseudorandomState('TAGS');
        const b = new PseudorandomState('TAGS');
        const allowed = new Set(tagPool(1));
        for (let i = 0; i < 500; i++) {
            const k = nextTagKey(a, 1);
            expect(k).not.toBe('UNAVAILABLE');
            expect(allowed.has(k)).toBe(true);
            expect(nextTagKey(b, 1)).toBe(k);
        }
    });

    it('开局就抽定 Ante 1 的两个跳过标签；打完 Boss 再抽 Ante 2 的', () => {
        const run = fresh();
        const first = { ...run.blindTags };
        expect(TAG_CENTERS[first.Small]).toBeDefined();
        expect(TAG_CENTERS[first.Big]).toBeDefined();
        for (let i = 0; i < 3; i++) {
            winRound(run);
            run.leaveShop();
        }
        expect(run.ante).toBe(2);
        expect(run.blindTags).not.toEqual(first);
    });
});

// ————————————————————————————————————————————————————————————————
// 跳过盲注
// ————————————————————————————————————————————————————————————————

describe('跳过盲注', () => {
    it('跳过小盲注：skips 1、直接到大盲注（不进商店）、拿到那个标签', () => {
        const run = fresh();
        run.blindTags.Small = 'tag_voucher'; // 什么也不做的那个，免得效果干扰
        const tag = run.skipBlind();
        expect(tag.key).toBe('tag_voucher');
        expect(run.skips).toBe(1);
        expect(run.blindKind).toBe('big');
        expect(run.state).toBe('blind-select');
        expect(run.tags.map((t) => t.key)).toEqual(['tag_voucher']);
    });

    it('Boss 不能跳', () => {
        const run = fresh();
        run.blindTags.Small = 'tag_voucher';
        run.blindTags.Big = 'tag_voucher';
        run.skipBlind();
        run.skipBlind();
        expect(run.blindKind).toBe('boss');
        expect(run.canSkipBlind).toBe(false);
        expect(() => run.skipBlind()).toThrow();
    });

    it('Throwback：跳过两次 → x_mult 1 + 0.25×2 = 1.5', () => {
        const run = fresh();
        const tb = makeJoker('j_throwback');
        run.jokers.push(tb);
        run.blindTags.Small = 'tag_voucher';
        run.blindTags.Big = 'tag_voucher';
        run.skipBlind();
        run.skipBlind();
        expect(tb.ability.x_mult).toBe(1.5);
    });

    it('Diet Cola：卖掉造一个 Double Tag', () => {
        const run = fresh();
        run.jokers.push(makeJoker('j_diet_cola'));
        run.sellJoker(0);
        expect(run.tags.map((t) => t.key)).toEqual(['tag_double']);
    });
});

// ————————————————————————————————————————————————————————————————
// 效果
// ————————————————————————————————————————————————————————————————

describe('immediate：拿到就生效', () => {
    it('Skip Tag：$4 + 跳过次数（这次算上）×5 = $4 + 5 = $9', () => {
        const run = fresh();
        run.blindTags.Small = 'tag_skip';
        run.skipBlind();
        expect(run.dollars).toBe(9);
        expect(run.tags).toEqual([]);
    });

    it('Economy Tag：钱翻倍，封顶 +$40；负债时给 0', () => {
        const run = fresh();
        run.dollars = 10;
        run.blindTags.Small = 'tag_economy';
        run.skipBlind();
        expect(run.dollars).toBe(20);

        const rich = fresh();
        rich.dollars = 100;
        rich.blindTags.Small = 'tag_economy';
        rich.skipBlind();
        expect(rich.dollars).toBe(140);

        const broke = fresh();
        broke.dollars = -5;
        broke.blindTags.Small = 'tag_economy';
        broke.skipBlind();
        expect(broke.dollars).toBe(-5);
    });

    it('Handy Tag：每出过一手 +$1', () => {
        const run = fresh();
        run.handsPlayed = 7;
        run.dollars = 0;
        run.blindTags.Small = 'tag_handy';
        run.skipBlind();
        expect(run.dollars).toBe(7);
    });

    it('Garbage Tag：过关时剩下的弃牌累计，每张 +$1', () => {
        const run = fresh();
        winRound(run, 2);
        run.leaveShop();
        expect(run.unusedDiscards).toBe(2);
        run.dollars = 0;
        run.blindTags.Big = 'tag_garbage';
        run.skipBlind();
        expect(run.dollars).toBe(2);
    });

    it('Top-up Tag：造 2 张普通小丑（空位够的话）', () => {
        const run = fresh();
        run.blindTags.Small = 'tag_top_up';
        run.skipBlind();
        expect(run.jokers).toHaveLength(2);
        for (const j of run.jokers) expect(j.center.rarity).toBe(1);
    });

    it('Top-up Tag：只剩一格就只造一张', () => {
        const run = fresh();
        for (let i = 0; i < 4; i++) run.jokers.push(makeJoker('j_joker'));
        run.blindTags.Small = 'tag_top_up';
        run.skipBlind();
        expect(run.jokers).toHaveLength(5);
    });

    it('Orbital Tag：把这一格掷定的牌型升 3 级', () => {
        const run = fresh();
        run.blindTags.Small = 'tag_orbital';
        const tag = run.skipBlind();
        expect(tag.orbitalHand).toBeDefined();
        expect(run.hands[tag.orbitalHand!].level).toBe(4);
    });
});

describe('tag_add：Double Tag', () => {
    it('手上有 Double，再拿到 Skip Tag → 复制一份，两张都生效：$4 + 5 + 5 = $14', () => {
        const run = fresh();
        run.addTag(makeTag('tag_double'));
        run.blindTags.Small = 'tag_skip';
        run.skipBlind();
        expect(run.dollars).toBe(14);
        expect(run.tags).toEqual([]);
    });

    it('Double 不复制 Double', () => {
        const run = fresh();
        run.addTag(makeTag('tag_double'));
        run.addTag(makeTag('tag_double'));
        expect(run.tags.map((t) => t.key)).toEqual(['tag_double', 'tag_double']);
    });

    it('两张 Double 都复制同一个新标签', () => {
        const run = fresh();
        run.addTag(makeTag('tag_double'));
        run.addTag(makeTag('tag_double'));
        run.addTag(makeTag('tag_voucher'));
        expect(run.tags.map((t) => t.key)).toEqual(['tag_voucher', 'tag_voucher', 'tag_voucher']);
    });
});

describe('其它时机', () => {
    it('Juggle Tag（round_start_bonus）：下一回合手牌上限 8 + 3 = 11，再下一回合回到 8', () => {
        const run = fresh();
        run.blindTags.Small = 'tag_juggle';
        run.skipBlind();
        const round = run.startRound();
        expect(round.handLimit).toBe(11);
        expect(round.hand).toHaveLength(11);
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.leaveShop();
        expect(run.startRound().handLimit).toBe(8);
    });

    it('Investment Tag（eval）：打完 Boss 的收益里多一行 $25；小 / 大盲注不兑现', () => {
        const run = fresh();
        run.blindTags.Small = 'tag_investment';
        run.skipBlind();
        winRound(run); // 大盲注
        expect(run.tags.map((t) => t.key)).toEqual(['tag_investment']);
        run.leaveShop();
        const round = run.startRound(); // Boss
        (round as unknown as { phase: string }).phase = 'won';
        const { payout } = run.finishRound();
        expect(payout.rows.find((r) => r.kind === 'tag')).toMatchObject({ dollars: 25, tag: 'tag_investment' });
        expect(run.tags).toEqual([]);
    });

    it('Boss Tag（new_blind_choice）：重抽这个 Ante 的 Boss', () => {
        for (let i = 0; i < 50; i++) {
            const run = fresh(`B${i}`);
            const before = run.bossKey;
            run.blindTags.Small = 'tag_boss';
            run.skipBlind();
            expect(run.tags).toEqual([]);
            if (run.bossKey !== before) return;
        }
        throw new Error('50 个 seed 里 Boss Tag 一次都没换出不同的 Boss');
    });

    it('Charm Tag：在盲注选择界面免费开一个 Mega 奥秘包；关掉之后轮到下一个开包标签', () => {
        const run = fresh();
        run.addTag(makeTag('tag_meteor'));
        run.blindTags.Small = 'tag_charm';
        const dollars = run.dollars;
        run.skipBlind();
        // `new_blind_choice` 第一个生效的就停：Meteor 在前，先开它
        expect(run.openPack?.key).toBe('p_celestial_mega_1');
        expect(run.dollars).toBe(dollars);
        run.skipPack();
        expect(run.openPack?.key).toBe('p_arcana_mega_1');
        run.skipPack();
        expect(run.openPack).toBeNull();
        expect(run.tags).toEqual([]);
    });
});

describe('商店里的三个', () => {
    it('Uncommon Tag：下一个商店第一格是一张免费的罕见小丑', () => {
        const run = fresh();
        run.blindTags.Small = 'tag_uncommon';
        run.skipBlind();
        winRound(run);
        const item = run.shop!.items[0];
        expect(item.kind).toBe('joker');
        if (item.kind === 'joker') expect(item.joker.center.rarity).toBe(2);
        expect(run.shop!.itemCost(0)).toBe(0);
        expect(run.tags).toEqual([]);
    });

    it('D6 Tag：这个商店的重掷从 $0 起，每次 +1', () => {
        const run = fresh();
        run.blindTags.Small = 'tag_d_six';
        run.skipBlind();
        winRound(run);
        expect(run.shop!.rerollCost).toBe(0);
        run.rerollShop();
        expect(run.shop!.rerollCost).toBe(1);
    });

    it('Coupon Tag：开张时货架与补充包全免费，重掷出来的照常收钱', () => {
        const run = fresh();
        run.blindTags.Small = 'tag_coupon';
        run.skipBlind();
        winRound(run);
        const shop = run.shop!;
        expect(shop.itemCost(0)).toBe(0);
        expect(shop.itemCost(1)).toBe(0);
        expect(shop.packCost(0)).toBe(0);
        run.dollars = 10;
        run.rerollShop();
        expect(shop.itemCost(0)).toBeGreaterThan(0);
    });

    it('Voucher Tag：优惠券系统不在，拿着什么也不发生', () => {
        const run = fresh();
        run.blindTags.Small = 'tag_voucher';
        run.skipBlind();
        winRound(run);
        expect(run.tags.map((t) => t.key)).toEqual(['tag_voucher']);
    });
});
