/**
 * 「墙在哪」的**结论版**：60 个 seed，三组并排。默认 `npm test` 不跑它（约 30 秒），
 * 要跑用 `npm run test:slow`。
 *
 * 为什么要 60 个：`depth.test.ts` 那 8 个 seed 只够当快照——
 * 一处小的策略改动就能让某些 seed 升三级、另一些降两级，8 个的均值会被这种噪声带着走。
 *
 * 三组：
 * - **贪心**：`greedy-bot.ts`
 * - **挑牌**：`picky-bot.ts`
 * - **挑牌、禁掉强化牌那 9 张**：量那 9 张的贡献（见下面最后一条）
 *
 * 红了的处理与 `depth.test.ts` 相同：先想清楚是内容变了、bot 变了还是 RNG 顺序变了。
 *
 * **2026-09-21 整张表换了一批数**：21 号票在模拟器上对出三处原作行为——开局造牌的规范序
 * （`makeStandardDeck`，同 seed 整副牌序全变）、红牌组 +1 弃牌（`back.lua:211`）、
 * 摸牌后手牌区按点数重排（`Round.sortHand`）。等于换了 60 局、而且多一次弃牌。
 * 下面各条括号里的旧数都是改之前的，**新旧之间不可比**；各条的结论在新口径下重新核过，写在各条里。
 *
 * **同日第二次换数**：22 号票把包里的塔罗 / 星球 / 幽灵牌改成**当场用**（`use_card`；奥秘 / 幽灵包先从牌堆顶发一手牌）。
 * 以前复刻件把它们拿进消耗品区，满了就挑不了——贪心尤其吃亏（塔罗塞满格子又用不出来）。各条结论重新核过，方向都没变。
 */

import { describe, expect, it } from 'vitest';

import { makeStandardDeck } from './card';
import { greedyRun } from './fixtures/greedy-bot';
import { pickyRun } from './fixtures/picky-bot';
import { Run } from './run';

const SEEDS = Array.from({ length: 60 }, (_, i) => `S${i * 7919}`);

const NINE: ReadonlySet<string> = new Set([
    'Marble Joker', 'Steel Joker', 'Vampire', 'Midas Mask', 'Stone Joker',
    'Lucky Cat', 'Golden Ticket', 'Glass Joker', "Driver's License",
]);

const fresh = (seed: string) => new Run(seed, makeStandardDeck());
const greedy = SEEDS.map((s) => greedyRun(fresh(s)));
const picky = SEEDS.map((s) => pickyRun(fresh(s)));
const pickyBanned = SEEDS.map((s) => pickyRun(fresh(s), { bannedJokers: NINE }));

const mean = (xs: Array<{ ante: number }>) =>
    Math.round((xs.reduce((n, r) => n + r.ante, 0) / xs.length) * 1000) / 1000;
/** 死在 Ante 1..10 的各有几局 */
const histogram = (xs: Array<{ ante: number }>) =>
    Array.from({ length: 10 }, (_, a) => xs.filter((r) => r.ante === a + 1).length);

describe('60 个 seed 的墙', { timeout: 60_000 }, () => {
    /**
     * 「增删牌」那 8 张接进来之后 2.333 → 2.417：贪心什么都买，
     * 买到的 Riff-raff 现在真的会造小丑了。
     * 补上版本加价之后 → 2.383（带版本的小丑变贵了，见下一条）。
     * 21 号票那三处改完之后 → 2.367（换了一批局，不可比）。
     * 包里的消耗品当场用之后 → 2.767：贪心以前把塔罗塞进消耗品区、要选牌的用不出来，现在挑得到的都是当场生效的。
     */
    it('贪心：平均 2.767，多数死在 Ante 2–3', () => {
        expect(mean(greedy)).toBe(2.767);
        expect(histogram(greedy)).toEqual([4, 22, 24, 5, 4, 1, 0, 0, 0, 0]);
    });

    /**
     * **策略欠的约是 2 个 Ante。** 贪心的墙主要是策略墙，不是内容墙。
     *
     * 三步来的：
     * 1. 小丑估值 + 用塔罗 + 挑包：2.333 → 3.867
     * 2. 出牌（带小丑精算挑哪一手、模拟挑弃法、弃牌按手数分配额）：→ 4.133。
     *    在另一批没参与调参的 60 个 seed（`H${i * 104729 + 17}`）上复核：3.967 → 4.350
     * 3. 估值看成长（沙盒连打 4 手、小丑状态带进下一手）：→ 4.333。
     *    视野 1 / 4 / 8 手在 240 个 seed 上是 3.967 / 4.158 / 4.125，4 手在四批里每批都赢
     *
     * 「增删牌」那 8 张之后 4.333 → 4.267，**不是内容的作用**（挑牌 bot 一张都没买，
     * 禁掉它们 240 局逐局相同），是顺带修的时序改了 RNG 路径——在噪声里。
     *
     * **补上版本加价之后 → 4.083**（240 seed：4.146 → 3.992）。这是**纠偏不是退步**：
     * 原先带版本的小丑按基础价卖（Negative / Polychrome 少收 $5），复刻件比原作便宜，
     * 墙被高估了约 0.15 个 Ante。同一刀加的 Credit Card / Rocket / Gift Card 贡献为零
     * （禁掉它们 3.996，在噪声里）。
     *
     * Trading Card / Certificate / Luchador / Chicot 之后 → 4.1。**第一批让挑牌 bot 受益的内容**，
     * 虽然很小：240 seed 放开 4.000、禁掉 3.992，2 局更深、0 局更浅。
     *
     * 21 号票那三处改完之后 → 3.8，对贪心仍差约 1.4 个 Ante。
     *
     * 22 号票对出「赢下的那一手之后不补牌」（`game.lua:3558`）之后 → 3.767，逐局分叉但均值在噪声里。
     *
     * 包里的消耗品当场用之后 → 3.95（奥秘包对发下来的手牌挑目标）。贪心涨得更多（+0.4），差距缩到约 1.2 个 Ante
     */
    it('挑牌：平均 3.95，35 个 seed 比贪心深、13 个更浅', () => {
        expect(mean(picky)).toBe(3.95);
        expect(histogram(picky)).toEqual([2, 14, 11, 11, 12, 4, 4, 0, 2, 0]);
        const deeper = picky.filter((r, i) => r.ante > greedy[i].ante).length;
        const shallower = picky.filter((r, i) => r.ante < greedy[i].ante).length;
        expect([deeper, shallower]).toEqual([35, 13]);
    });

    /**
     * **强化牌那 9 张的贡献，换成挑牌 bot 也几乎是零。** 21 号票之前禁掉它们 60 局**逐局深度完全相同**；
     * 之后 **59 局相同、1 局反而深一级**（`S229651`：放开时买了 Marble Joker 死在 Ante 5，
     * 禁掉后那一格换成 Blue Joker / Photograph，到了 Ante 6）。死时手上有其中一张的仍是 2 局。
     * 中间一版（只改了牌序）是另一局浅一级——单局的正负是噪声，「几乎是零」才是结论。
     * 22 号票「赢后不补牌」之后又回到 **60 局逐局相同**，死时手上有其中一张的是 1 局。
     * 包里的消耗品当场用之后：**58 局相同、2 局禁掉反而更深**（`S229651` 4 → 6、`S253408` 3 → 4），手上有其中一张的 2 局。
     * 仍是「几乎是零」——放开它们没有一局更深
     *
     * 两个原因，都不是 bot 的锅：
     * - **3 张新档根本抽不到**：Golden Ticket / Glass Joker / Driver's License
     *   是 `start_locked`，不在新档的池子里（`unlocked: false`）
     * - **另外 6 张的价值不在「现在」**：Steel / Stone / Lucky Cat 要牌组里先有对应强化，
     *   Vampire / Midas Mask 是越打越强的成长型，Marble 是往牌组里塞石头牌——
     *   估值只看「现在这副牌打一手能多几分」，它们在买的那一刻都接近零
     *
     * 第二条在估值学会看成长之后**仍然成立**：估值连打的是固定的参考牌，
     * 而新牌组里没有强化牌，Steel / Stone / Lucky Cat / Vampire 的成长条件碰不到。
     * 要让它们有价值，得让估值看到「bot 自己以后会往牌组里加什么」，那是另一个量级的活。
     */
    it('禁掉强化牌那 9 张：58 局逐局相同，另 2 局禁掉反而更深', () => {
        const differ = SEEDS.filter((_, i) => pickyBanned[i].ante !== picky[i].ante);
        expect(differ).toEqual(['S229651', 'S253408']);
        expect(differ.every((s) => pickyBanned[SEEDS.indexOf(s)].ante > picky[SEEDS.indexOf(s)].ante)).toBe(true);
        const held = picky.filter((r) => r.jokers.some((n) => NINE.has(n))).length;
        expect(held).toBe(2);
    });

    /**
     * **存利息对挑牌 bot 不划算**——这两条是 15 种组合里的代表，理由见 `picky-bot.ts` 的 `Economy`。
     *
     * - 全程存 $25（除非小丑能涨 50%）：明显更差，一半局死在 Ante 2 以前
     * - 后期（Ante 3 起）才存 $25、放行天体包、余钱重掷：最像人的打法，也没赢
     *
     * 重跑过四次：出牌改好之后（2.867 / 4.017 对 4.133），
     * 估值学会看成长之后（2.950 / 4.133 对 4.333），增删牌那 8 张之后（3.0 / 4.167 对 4.267），
     * 补上版本加价之后（2.933 / 4.100 对 4.083），关掉 Boss 那一刀之后（2.933 / 4.100 对 4.100），
     * 21 号票那三处改完之后（2.983 / 3.867 对 3.8），22 号票赢后不补牌之后（2.983 / 3.917 对 3.767），
     * 包里的消耗品当场用之后（3.117 / 3.883 对 3.95）。
     * **全程存一直明显更差；后期存 + 重掷连着几次打平或高一点点**（+0.067 是 60 局里多深 4 级），不算赢。
     */
    it('存利息：全程存 $25 掉到 3.117，后期才存 + 重掷 3.883，不比不存（3.95）好', () => {
        const flat25 = SEEDS.map((s) =>
            pickyRun(fresh(s), { economy: { reserve: () => 25, breakReserveGain: 0.5 } }));
        const late25 = SEEDS.map((s) =>
            pickyRun(fresh(s), {
                economy: {
                    reserve: (ante) => (ante >= 3 ? 25 : 0),
                    breakReserveGain: 0.3,
                    exemptCelestial: true,
                    maxRerolls: 10,
                },
            }));
        expect(mean(flat25)).toBe(3.117);
        expect(mean(late25)).toBe(3.883);
    });

    /**
     * **跳过盲注对挑牌 bot 也不划算**（18 号票第 4 步），与存利息同一个原因：
     * bot 的瓶颈是战力，跳过就少一次商店、少一关的奖金，标签补不回来。
     *
     * 两轮实验（细节见 18 号票）。120 seed：全跳 2.517、只为好标签跳 3.575、Ante 2 起 3.717、
     * 只跳小盲注 3.833、只为开包标签跳 3.975，对不跳 4.008。240 seed 加「上一关赢得轻松才跳」：
     * **最好的「赢 5 倍以上才跳」4.021 对不跳 4.000，但平均每局只跳 0.1 次**，在噪声里。
     * 所以默认不跳，这两条是代表。
     *
     * **21 号票那三处改完之后，这 60 个 seed 上「只为开包标签跳」反而高 0.233**（4.033 对 3.8）。
     * 拿另外三批各 60 个复核（`H${i*104729+17}` / `K${i*15485863+3}` / `P${i*32452843+11}`）：
     * 3.75 对 3.967、3.55 对 3.533、3.733 对 3.833，**240 个合计 3.767 对 3.783，打平**。
     * S 这一批是碰巧，结论不变。22 号票赢后不补牌之后这 60 个上是 3.967 对 3.767；
     * 包里的消耗品当场用之后是 3.7 对 3.95，这 60 个上也不再高了。
     */
    it('跳过盲注：全跳 2.45；只为开包标签跳 3.7，不如不跳（3.95）', () => {
        const PACKS = new Set(['tag_charm', 'tag_meteor', 'tag_buffoon', 'tag_ethereal', 'tag_standard']);
        const all = SEEDS.map((s) => pickyRun(fresh(s), { skip: () => true }));
        const packs = SEEDS.map((s) => pickyRun(fresh(s), { skip: (_run, k) => PACKS.has(k) }));
        expect(mean(all)).toBe(2.45);
        expect(mean(packs)).toBe(3.7);
    });

    /**
     * **优惠券对挑牌 bot 也不划算**（19 号票第 3 步），还是同一个原因：瓶颈是战力，$10 换不成战力。
     *
     * 240 seed：不买 4.025；全买、先买 3.196；精选 10 张先买 3.567（去掉 Hieroglyph 3.638）；
     * 只买出牌 / 弃牌 / 手牌上限那 3 张先买 3.929；小丑 ≥ 3 / 4 / 5 张后才先买精选 3.913 / 3.921 / 3.942。
     * **「余钱才买」与不买打平**（全买 4.046、换一批 seed 4.071 对 4.067），
     * 但那是因为平均每局只买到 0.19 张——bot 买完小丑和包几乎从不剩 $10。
     * To Do List 修好之后「先买」3.0 → 2.983（有一局碰到了它），别的几条没动。
     * 所以默认不买，这两条是代表。21 号票之前 60 seed 上余钱才买高出 0.067，之后是高 0.05（3.85 对 3.8）——
     * 始终在 240 seed 打平的范围里。22 号票赢后不补牌之后 3.817 对 3.767；包里的消耗品当场用之后 3.95 对 3.95。
     */
    it('优惠券：全买且先买掉到 3.167；余钱才买 3.95，与不买（3.95）打平', () => {
        const all = (k: string) => k.startsWith('v_');
        const first = SEEDS.map((s) => pickyRun(fresh(s), { vouchers: { want: all, first: true } }));
        const after = SEEDS.map((s) => pickyRun(fresh(s), { vouchers: { want: all, first: false } }));
        expect(mean(first)).toBe(3.167);
        expect(mean(after)).toBe(3.95);
    });
});
