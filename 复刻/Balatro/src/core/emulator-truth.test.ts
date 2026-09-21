/**
 * **实机对拍**：同一个 seed 在正版 Balatro 1.0.1o（移动版，雷电模拟器）里跑出来的真值。
 *
 * 这是复刻件第一批「整局层面」的外部真值——此前洗牌只有结构性验证（04 号票：
 * 独立重推一遍 Fisher–Yates 逐位比对），而那条验证与复刻件共用「开局造牌的顺序」这个假设，
 * 所以两边一起错也看得出来是绿的。这里的每个数都是从实机截图上读的。
 *
 * ## 怎么取的
 *
 * `tools/emu.mjs` 驱动模拟器（截图、点按、敲 seed），`tools/seed-probe.ts` 让复刻件按同一串动作跑。
 * 口径：红牌组、白注、Options → New Run → Seeded Run，**档要先走完新手教程**——
 * 教程会强制首个商店的两格、优惠券与两个跳过标签（`button_callbacks.lua:1982`），
 * 还会给补充包加 $3（`card.lua:377`）。
 *
 * ## 红了怎么办
 *
 * 这些数不是快照，是**原作的行为**。红了说明复刻件偏离了原作，不要改期望值去迁就，
 * 除非能证明截图读错了（读错的话在这里记一笔）。
 */
import { describe, expect, it } from 'vitest';

import { cardId, pickCards } from './fixtures/card-id';
import { Run } from './run';

describe('TESTSEED（2026-09-21 实机）', () => {
    const run = new Run('TESTSEED');

    it('开局：Boss、优惠券、两个跳过标签', () => {
        expect(run.bossKey).toBe('bl_head');
        expect(run.currentVoucher).toBe('v_crystal_ball');
        expect(run.blindTags).toEqual({ Small: 'tag_economy', Big: 'tag_investment' });
    });

    /**
     * 首手曾经对不上：复刻件给的是 K♦ Q♥ 10♥ 9♣ 9♠ 5♣ 5♦ 4♣，5 张对、3 张错位。
     * 原因是开局造牌的顺序——`game.lua:2584` 按 `花色..点数` 的**字符串**排序，
     * 点数是 `2..9 A J K Q T`，而复刻件按 2 → A 造。见 `makeStandardDeck`。
     */
    /**
     * 比的是**手牌区数组本身**（实机截图从左到右），不是排序后的集合：
     * 原作每摸一张都 `G.hand:sort()`，复刻件曾经不排（`Round.sortHand`）。
     */
    it('小盲注的首手与之后 12 张抽牌', () => {
        run.startRound();
        const round = run.round!;
        // 红牌组 +1 弃牌（`back.lua:211`）。复刻件曾经漏了这一步，按 3 次打
        expect([round.handsLeft, round.discardsLeft]).toEqual([4, 4]);
        expect(round.hand.map(cardId)).toEqual(['AH', 'KH', 'QD', '9S', '9C', '5C', '5D', '4C']);

        round.discard(pickCards(round.hand, '4C,5D,5C'));
        expect(round.hand.map(cardId)).toEqual(['AH', 'KH', 'QD', 'TC', '9S', '9C', '8C', '7H']);

        round.discard(pickCards(round.hand, 'AH,KH,QD,9S,7H'));
        expect(round.hand.map(cardId)).toEqual(['AS', 'AD', 'QC', 'TC', 'TD', '9C', '8C', '2D']);

        round.discard(pickCards(round.hand, 'AS,AD,TD,2D'));
        expect(round.hand.map(cardId)).toEqual(['AC', 'KS', 'QC', 'TC', '9C', '8C', '3H', '2C']);
    });

    it('同花 83 × 4 = 332 过关，兑现 $6（盲注 $3 + 剩 3 手）', () => {
        const round = run.round!;
        round.play(pickCards(round.hand, 'AC,QC,TC,9C,8C'));
        expect(round.chips).toBe(332);
        expect(round.phase).toBe('won');
        // 实机此刻 Hands 3 / Discards 1
        expect([round.handsLeft, round.discardsLeft]).toEqual([3, 1]);

        const { payout } = run.finishRound();
        expect(payout.total).toBe(6);
        expect(run.dollars).toBe(10);
    });

    it('第一个商店：两格小丑、两个包、优惠券', () => {
        const shop = run.shop!;
        expect(shop.items.map((i) => (i.kind === 'joker' ? [i.joker.center.name, i.joker.edition, i.cost] : i.kind)))
            .toEqual([['Raised Fist', undefined, 5], ['Pareidolia', undefined, 5]]);
        // 第一格包恒是小丑包、不掷点（`common_events.lua:1984`）；`_1` / `_2` 只差美术，走全局流，不断言
        expect(shop.packs.map((p) => p?.key.replace(/_\d$/, ''))).toEqual(['p_buffoon_normal', 'p_standard_jumbo']);
        expect(shop.vouchers.map((v) => v.key)).toEqual(['v_crystal_ball']);
    });

    /** 标准包的账是全局最绕的一条（`stdset` → `Enhancedsta` → `frontsta` → `standard_edition` → `stdseal` → `stdsealtype`） */
    it('Jumbo Standard 包的 5 张：点数、强化、蜡封', () => {
        const open = run.buyAndOpenPack(1);
        expect(run.dollars).toBe(4);
        expect(
            open.cards.map((c) => {
                if (c.kind !== 'card') return c.kind;
                return [cardId(c.card), c.card.enhancement, c.card.edition ?? null, c.card.seal ?? null];
            }),
        ).toEqual([
            ['9D', null, null, null],
            ['6S', 'm_bonus', null, null],
            ['TH', 'm_steel', null, null],
            ['JC', null, null, null],
            ['TS', null, null, 'Purple'],
        ]);
    });
});

/**
 * 同一个 seed 的第二局（22 号票，2026-09-21 实机）：这回打的是两对 → 弃 5 张 → 葫芦。
 * 实机截图上读的：每手之后的手牌区、Round score、Cash Out 的金额、商店两格。
 */
describe('TESTSEED 第二局：两对、弃五张、葫芦（2026-09-21 实机）', () => {
    const run = new Run('TESTSEED');

    it('两对 (20 + 28) × 2 = 96，补的牌与实机一致', () => {
        run.startRound();
        const round = run.round!;
        round.play(pickCards(round.hand, '9S,9C,5C,5D'));
        expect(round.chips).toBe(96);
        expect(round.hand.map(cardId)).toEqual(['AS', 'AH', 'KH', 'QD', 'TC', '8C', '7H', '4C']);

        round.discard(pickCards(round.hand, 'KH,QD,8C,7H,4C'));
        expect(round.hand.map(cardId)).toEqual(['AS', 'AH', 'AD', 'KS', 'QC', 'TC', 'TD', '2D']);
        expect(round.deck.length).toBe(35);
    });

    /**
     * **赢下的那一手之后不补牌**（`game.lua:3558`：够分直接 `NEW_ROUND`，不进 `DRAW_TO_HAND`）。
     * 复刻件曾经先补 5 张再判胜负——回合结束时留在手里的牌就多了 5 张
     */
    it('葫芦 (40 + 53) × 4 = 372，共 468 过关；不补牌；兑现 $5（盲注 $3 + 剩 2 手）', () => {
        const round = run.round!;
        round.play(pickCards(round.hand, 'AS,AH,AD,TC,TD'));
        expect(round.chips).toBe(468);
        expect(round.phase).toBe('won');
        expect([round.handsLeft, round.discardsLeft]).toEqual([2, 3]);
        expect(round.hand.map(cardId)).toEqual(['KS', 'QC', '2D']);
        expect(round.deck.length).toBe(35);

        const { payout } = run.finishRound();
        expect(payout.total).toBe(5);
        expect(run.dollars).toBe(9);
        expect(run.shop!.items.map((i) => (i.kind === 'joker' ? i.joker.center.name : i.kind)))
            .toEqual(['Raised Fist', 'Pareidolia']);
    });
});

/**
 * ALEEB 第一个商店的 Arcana Pack（22 号票，2026-09-21 实机）。
 *
 * 奥秘包开包时从牌堆顶发一手牌。**牌堆在 Cash Out 时 `shuffle('cashout'..ante)` 过**（`button_callbacks.lua:3028`），
 * 所以这手牌是确定的——复刻件以前根本没有这一步（包里的塔罗拿进消耗品区），这是它第一次被实机验证。
 * 同一截图上：包里 Temperance / The Empress / The Soul，牌堆 44/52
 */
describe('ALEEB：Arcana Pack 发的手牌（2026-09-21 实机）', () => {
    const run = new Run('ALEEB');

    it('小盲注：弃 TC TD 2D → 顺子 260 → 一对 A，共 324；商店 Trading Card / Rocket、Buffoon / Arcana', () => {
        run.startRound();
        const round = run.round!;
        expect(round.hand.map(cardId)).toEqual(['TC', 'TD', '9S', '7S', '6H', '5H', '4H', '2D']);
        round.discard(pickCards(round.hand, 'TC,TD,2D'));
        round.play(pickCards(round.hand, '9S,8D,7S,6H,5H'));
        expect(round.chips).toBe(260);
        round.play(pickCards(round.hand, 'AC,AD'));
        expect(round.chips).toBe(324);
        run.finishRound();
        expect(run.dollars).toBe(9);
        expect(run.shop!.items.map((i) => (i.kind === 'joker' ? i.joker.center.name : i.kind))).toEqual(['Trading Card', 'Rocket']);
        expect(run.shop!.packs.map((p) => p?.center.kind)).toEqual(['Buffoon', 'Arcana']);
    });

    it('开 Arcana Pack：包里三张、发下来的手牌 QH TH TC 9D 8H 8D 7D 6C、牌堆剩 44', () => {
        const pack = run.buyAndOpenPack(1);
        expect(run.dollars).toBe(5);
        expect(pack.cards.map((c) => (c.kind === 'consumable' ? c.consumable.center.name : c.kind)))
            .toEqual(['Temperance', 'The Empress', 'The Soul']);
        expect(run.packHand!.map(cardId)).toEqual(['QH', 'TH', 'TC', '9D', '8H', '8D', '7D', '6C']);
        expect(run.fullDeck.length - run.packHand!.length).toBe(44);
    });
});
