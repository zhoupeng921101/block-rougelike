/**
 * 贪心机器人：一套**不 mock 任何东西**的自动打法。
 *
 * ## 它是干什么的
 *
 * 两件事，缺一不可：
 * - **端到端验收**：`ante1.test.ts` 用它真的打完 Ante 1（出牌、进商店、买小丑、
 *   开补充包），拼起来不通的跨层 bug 只有这样才抓得到。
 * - **量「墙在哪」**：`depth.test.ts` 用它跑到死，量出「现在的内容量能撑到第几个 Ante」。
 *
 * ## 为什么提成 fixture 而不是留在测试文件里
 *
 * 深度这个数在这张地图上被量过四次（消耗品前、消耗品后、补充包后、强化牌后），
 * 每次都是临时写一个 bot 现场跑——而**临时 bot 之间不可比**：
 * 换一组 seed、换一个出牌阈值，数字就动，于是「这一刀有没有把墙推开」这个问题
 * 每次都得重新吵。提成一份共享实现、配一张钉住的快照，这个数才有意义。
 *
 * ## 它**不**是什么
 *
 * 不是好玩家。三条已知的短板，读数字时必须记着：
 * - **不挑手牌**：只追同花与同点数，所以「给选中的牌加强化」的塔罗与幽灵牌
 *   全都用不出来（`canUseConsumable(i, [])` 直接是 false）
 * - **不挑小丑**：买得起就买，不看好坏，也不卖
 * - **不挑包里的牌**：拿第一张拿得了的
 *
 * 所以这个深度是**内容量的下界**，不是「这套内容能打多深」。
 */

import type { Card } from '../card';
import { isConsumableImplemented } from '../consumables';
import { evaluatePokerHand } from '../poker-hands';
import type { Round } from '../round';
import type { Run } from '../run';
import type { HandInfo, HandName } from '../scoring';

/**
 * 穷举手牌的所有 ≤5 张子集，挑得分最高的那一组。
 *
 * 手牌 8 张，子集数 `C(8,1..5) = 218`，穷举比写启发式便宜也准。
 * **不算小丑**——挑哪一手只需要个排序，小丑的加成不改相对优劣的大方向，
 * 而把小丑算进来就得把整条管线跑 218 遍（还会污染 RNG 状态）。
 */
export function bestPlay(
    hand: Card[],
    hands: Record<HandName, HandInfo>,
): { cards: Card[]; score: number } {
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
 * 决定「留哪几张」。
 *
 * 追同花是基础牌组在 Ante 1 的标准打法：同花 300 分，一手就够小盲注，
 * 而一对只有 50–60 分，四手打满也过不了。所以弃牌的目标是**把同花凑出来**，
 * 凑不动才退回「留最大的同点数组」。
 */
export function keepSet(hand: Card[]): Card[] {
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
 *
 * **打不过就停在 `lost`**，不抛——调用方自己决定要不要当成错误。
 */
export function playRound(round: Round): void {
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

/**
 * 把用得掉的消耗品全用掉。
 *
 * **传的是空的 highlighted**，所以只有星球那一类用得了——
 * 塔罗与半数幽灵牌要选手牌，`canUseConsumable` 会直接拒掉。
 * 这是本 bot 最大的短板，见文件头。
 */
export function useAllConsumables(run: Run): void {
    for (let i = run.consumables.length - 1; i >= 0; i--) {
        if (run.canUseConsumable(i, [])) run.useConsumable(i, []);
    }
}

export type ShopPolicy = {
    /** 买消耗品吗。买了就立刻用——消耗品区只有 2 格，攒着没意义 */
    consumables?: boolean;
    /** 买补充包吗。**这是星球的主要来源**（一包 3 张、Jumbo 5 张） */
    packs?: boolean;
};

/**
 * 在商店里能买就买、买不了就走。返回买到的 key。
 *
 * **补充包排在货架之前**：包要花钱，而货架上的小丑会先把钱花光。
 * 原作里玩家也是先看包——这不是纯策略选择，包的内容比两格货架稳定得多。
 */
export function shopAndLeave(run: Run, policy: ShopPolicy = {}): string[] {
    if (run.state !== 'shop') throw new Error(`现在是 ${run.state}，不在商店`);
    const bought: string[] = [];

    if (policy.packs) {
        for (let p = 0; p < run.shop!.packs.length; p++) {
            if (!run.canBuyPack(p)) continue;
            bought.push(run.buyAndOpenPack(p).key);
            let guard = 0;
            while (run.openPack && guard++ < 10) {
                const idx = run.openPack.cards.findIndex((_, j) => run.canTakeFromPack(j));
                if (idx < 0) break;
                run.takeFromPack(idx);
            }
            // 挑不动了就跳过剩下的（`Red Card` 靠这一下长个子）
            if (run.openPack) run.skipPack();
            useAllConsumables(run);
        }
    }

    for (let i = run.shop!.items.length - 1; i >= 0; i--) {
        const item = run.shop!.items[i];
        if (item.cost > run.dollars) continue;

        if (item.kind === 'joker') {
            if (run.jokersFull) continue;
            bought.push(run.buyJoker(i).key);
            continue;
        }

        if (!policy.consumables || run.consumablesFull) continue;
        // 还没实现行为的消耗品不买——买了占格子、用不了
        if (!isConsumableImplemented(item.consumable.key)) continue;
        bought.push(run.buyConsumable(i).key);
        run.useConsumable(run.consumables.length - 1);
    }

    run.leaveShop();
    useAllConsumables(run);
    return bought;
}

/** 打一关 + 逛一次商店。**打不过就抛**——调用方期望的是打得过。 */
export function clearOneBlind(
    run: Run,
    policy: ShopPolicy = {},
): { kind: string; requirement: number; chips: number; bought: string[] } {
    const kind = run.blindKind;
    const round = run.startRound();
    const requirement = round.requirement;
    playRound(round);

    if (round.phase !== 'won') {
        throw new Error(`${kind} 盲注没打过：${round.chips} / ${requirement}`);
    }
    const chips = round.chips;
    run.finishRound();
    return { kind, requirement, chips, bought: shopAndLeave(run, policy) };
}

/** 一局跑到死的结果。 */
export type GreedyRun = {
    /** 死在第几个 Ante。**这就是「墙」** */
    ante: number;
    /** 整局用掉几张星球 */
    planets: number;
    /** 死的时候小丑区里是哪几张（按名字） */
    jokers: string[];
};

/**
 * 拿这个 bot 从头跑到死。
 *
 * **全开**：买消耗品、买补充包。量的是「现有内容能撑多深」，
 * 所以不该人为关掉任何一条供给线。
 */
export function greedyRun(run: Run): GreedyRun {
    let guard = 0;
    while (guard++ < 60) {
        const round = run.startRound();
        playRound(round);
        if (round.phase !== 'won') break;
        run.finishRound();
        shopAndLeave(run, { consumables: true, packs: true });
    }
    return {
        ante: run.ante,
        planets: run.consumableUsage.total.planet,
        jokers: run.jokers.map((j) => j.ability.name),
    };
}
