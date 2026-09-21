/**
 * 挑牌机器人：在贪心机器人（`greedy-bot.ts`）之上补三件它不会做的事。
 *
 * ## 为什么要它
 *
 * 贪心量出来的墙（`depth.test.ts`）回答不了「还差多少内容」——
 * 强化牌那 9 张小丑接进来之后，八个 seed 的深度**逐 seed 一模一样**，
 * 因为贪心根本造不出强化牌。这份 bot 把**策略**这一侧补到够用，
 * 两份 bot 并排跑，差值就是「策略欠的」，剩下的才是「内容欠的」。
 *
 * ## 补了什么
 *
 * 1. **会挑手牌用消耗品。** 要选牌的塔罗与幽灵牌**攒在格子里，进盲注之后对手牌用**。
 *    原作里它们只能在出牌阶段或开奥秘/幽灵包时用（`card.lua:1566`），商店里用不了。
 *    目标怎么挑：见 `chooseTargets`，核心是「往**主花色**同花上攒」。
 * 2. **会挑小丑。** 在沙盒里拿真的结算管线打两手参考牌，
 *    看这张小丑能让分数涨几成（`teamScore`）。满了就与最弱那张比，值得才换。
 *    **小丑排在包前面买**——它是唯一的乘法来源。
 * 3. **会挑包里的牌。** 天体包挑最常打的那个牌型的星球，标准包挑主花色的牌。
 *
 * 出牌也改了两处：估分算上强化（石头 / 加成 / 倍率 / 玻璃），
 * 以及「够不够打」看牌型（顺子以上才出），不看写死的 250——
 * 牌型升了级、强化多了之后，250 这条线会越来越偏。
 *
 * ## 它**仍然不**会的
 *
 * - **估分不算小丑**：挑哪一手只看牌型与强化。算小丑得把整条管线跑 218 遍，
 *   还会改 ability、消费 RNG
 * - **默认不存利息、不重掷**：参数有（`Economy`），但实测都不划算，见那一节
 * - **不跳盲注、不卖小丑换钱**
 * - **与原作的一处差异它绕不开**：复刻件开奥秘包不会发手牌，
 *   包里的塔罗是**拿进消耗品区**而不是当场用。所以格子满了就挑不了——
 *   原作里没有这个限制。这是 Run 层的偏差，不是 bot 的
 *
 * 所以这个深度仍然是下界，只是比贪心的紧。
 */

import { type Card, type Suit, isSuit } from '../card';
import type { Consumable } from '../consumables';
import { isConsumableImplemented } from '../consumables';
import { enhancementBonus } from '../enhancements';
import {
    type Joker,
    isJokerImplemented,
    makeGameView,
    refreshDerivedAbilities,
    runModifiers,
} from '../jokers';
import { evaluatePokerHand } from '../poker-hands';
import { evaluatePlay } from '../scoring';
import type { Round } from '../round';
import type { Run } from '../run';
import type { HandInfo, HandName } from '../scoring';
import type { GreedyRun } from './greedy-bot';

const SUITS: readonly Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];

// ————————————————————————————————————————————————————————————————
// 整局的「打法」：往哪个花色的同花上攒
// ————————————————————————————————————————————————————————————————

/**
 * 主花色：整副牌里张数最多的那个花色（万能牌四个都算）。
 *
 * **每次现算**，不在开局定死：换花色的塔罗、Cryptid、标准包都会改它，
 * 而 bot 的所有选择（留哪几张、给谁加强化、换成什么花色）都朝它收敛。
 */
export function mainSuit(cards: readonly Card[]): Suit {
    let best: Suit = 'Spades';
    let bestN = -1;
    for (const suit of SUITS) {
        const n = cards.filter((c) => isSuit(c, suit)).length;
        if (n > bestN) {
            best = suit;
            bestN = n;
        }
    }
    return best;
}

/**
 * 这一手追哪个花色。**手里的张数为主，整副牌的比例为辅**。
 *
 * 不能直接用 `mainSuit`：开局四种花色各 13 张，并列时它固定给黑桃，
 * 于是手里明明四张红桃也会被当成废牌弃掉。整副牌的比例只在被塔罗推歪之后才起作用——
 * 一个花色占到 40%（均匀时 25%），大约顶手里多 0.6 张。
 */
function roundSuit(hand: readonly Card[], deck: readonly Card[]): Suit {
    let best: Suit = 'Spades';
    let bestScore = -Infinity;
    for (const suit of SUITS) {
        const inHand = hand.filter((c) => isSuit(c, suit)).length;
        const share = deck.length > 0 ? deck.filter((c) => isSuit(c, suit)).length / deck.length : 0;
        const score = inHand + share * 4;
        if (score > bestScore) {
            best = suit;
            bestScore = score;
        }
    }
    return best;
}

/** 这张牌对「打主花色同花」有多大用。越大越该留、越该强化 */
function cardValue(card: Card, suit: Suit): number {
    const onSuit = isSuit(card, suit) ? 100 : 0;
    const enhanced = card.enhancement && card.enhancement !== 'm_stone' ? 20 : 0;
    const sealed = card.seal ? 10 : 0;
    return onSuit + enhanced + sealed + card.base.nominal;
}

/** 留在手里才有用的强化（钢铁 ×1.5、黄金 $3）。**不弃、也尽量不打** */
function isHeldValue(card: Card): boolean {
    return card.enhancement === 'm_steel' || card.enhancement === 'm_gold';
}

// ————————————————————————————————————————————————————————————————
// 出牌
// ————————————————————————————————————————————————————————————————

/**
 * 估一手牌的分。**算强化、不算小丑**。
 *
 * 计分牌取 `evaluatePokerHand` 的 `top[0]`，加上石头牌（它们总是计分）。
 * 幸运牌按期望算（+20 × 1/5 = +4），玻璃牌按 ×2 算、不管会不会碎。
 */
function estimate(cards: Card[], hands: Record<HandName, HandInfo>): number {
    const results = evaluatePokerHand(cards);
    const name = results.topName;
    if (!name || !results.top) return -1;

    const scoring = new Set(results.top[0]);
    for (const c of cards) if (c.enhancement === 'm_stone') scoring.add(c);

    const info = hands[name];
    let chips = info.chips;
    let mult = info.mult;
    let xMult = 1;
    for (const c of scoring) {
        if (c.debuff) continue;
        chips += (c.enhancement === 'm_stone' ? 0 : c.base.nominal) + enhancementBonus(c) + c.perma_bonus;
        if (c.enhancement === 'm_mult') mult += 4;
        if (c.enhancement === 'm_lucky') mult += 4;
        if (c.enhancement === 'm_glass') xMult *= 2;
    }
    return Math.floor(chips * mult * xMult);
}

/** 值得直接出的牌型：顺子及以上。低于它的宁可弃牌去追同花 */
const STRONG_HANDS: ReadonlySet<HandName> = new Set([
    'Flush Five', 'Flush House', 'Five of a Kind', 'Straight Flush',
    'Four of a Kind', 'Full House', 'Flush', 'Straight',
]);

/** 穷举 ≤5 张子集挑估分最高的。**钢铁 / 黄金牌不进候选**——它们留在手里才值钱 */
function bestPlay(
    hand: Card[],
    hands: Record<HandName, HandInfo>,
): { cards: Card[]; score: number; name: HandName | null } {
    const pool = hand.filter((c) => !isHeldValue(c));
    // 全是钢铁 / 黄金也得出点什么
    const source = pool.length > 0 ? pool : hand;
    let best: { cards: Card[]; score: number; name: HandName | null } = {
        cards: [source[0]], score: -1, name: null,
    };

    const walk = (start: number, picked: Card[]) => {
        if (picked.length >= 1) {
            const score = estimate(picked, hands);
            if (score > best.score) {
                best = { cards: [...picked], score, name: evaluatePokerHand(picked).topName };
            }
        }
        if (picked.length === 5) return;
        for (let i = start; i < source.length; i++) {
            picked.push(source[i]);
            walk(i + 1, picked);
            picked.pop();
        }
    };
    walk(0, []);
    return best;
}

/**
 * 弃哪几张：留主花色、留钢铁 / 黄金、留成组的同点数，剩下的从最没用的弃起。
 *
 * 与贪心的区别：追哪个花色要把整副牌的比例也算进去（见 `roundSuit`）——
 * 换花色的塔罗一直在往主花色推，被推歪之后这一手也该跟着它走。
 */
function discardSet(hand: Card[], suit: Suit): Card[] {
    const byId = new Map<number, number>();
    for (const c of hand) byId.set(c.base.id, (byId.get(c.base.id) ?? 0) + 1);
    const onSuit = hand.filter((c) => isSuit(c, suit)).length;

    // 与贪心的 `keepSet` 同一个取舍：同花项目每张值 100、同点数项目每张值 90。
    // 同花凑不到 3 张就改留同点数组（对子也留）
    const bestGroup = Math.max(0, ...byId.values());
    const chaseRanks = onSuit < 3 ? bestGroup >= 2 : 90 * bestGroup > 100 * onSuit;

    const keep = (c: Card) =>
        isHeldValue(c) ||
        (chaseRanks ? (byId.get(c.base.id) ?? 0) >= 2 : isSuit(c, suit));

    return hand
        .filter((c) => !keep(c))
        .sort((a, b) => cardValue(a, suit) - cardValue(b, suit))
        .slice(0, 5);
}

function playRound(run: Run, round: Round): void {
    let guard = 0;
    while (round.phase === 'selecting') {
        if (guard++ > 60) throw new Error('打不完——策略死循环了');

        // 每手之前都看一眼：刚抽上来的牌可能正好是塔罗要的目标
        useHeldConsumables(run);
        if (round.phase !== 'selecting') break;

        const best = bestPlay(round.hand, round.hands);
        const need = round.requirement - round.chips;
        const mustPlay = round.discardsLeft === 0 || round.handsLeft === 1;
        // **出牌次数比弃牌次数贵**：一手对子打出去就少一次出同花的机会。
        // 所以只有「够过关」或「已经是顺子以上」才出，否则弃牌去追
        const strong = best.name !== null && STRONG_HANDS.has(best.name);

        if (mustPlay || best.score >= need || strong) {
            round.play(best.cards);
            continue;
        }

        const spare = discardSet(round.hand, roundSuit(round.hand, run.fullDeck));
        if (spare.length === 0) {
            round.play(best.cards);
            continue;
        }
        round.discard(spare);
    }
}

// ————————————————————————————————————————————————————————————————
// 消耗品：什么时候用、对谁用
// ————————————————————————————————————————————————————————————————

/** 不要的消耗品：用了有害或没意义。**拿到就卖** */
const NEVER_USE = new Set([
    'c_tower', // 石头牌没有花色，拆同花
    'c_ouija', // 全手变同点数，还 -1 手牌上限
    'c_hex', // 毁掉其余全部小丑
    'c_ankh', // 同上
    'c_ectoplasm', // -1 手牌上限
]);

/**
 * 给一张要选牌的消耗品挑目标。返回 `null` 表示「这把手牌里没有合适的，先留着」。
 *
 * 所有选择都朝主花色收敛：
 * - 加分的强化（玻璃 / 倍率 / 加成 / 幸运）、Red / Gold 蜡封、版本、Cryptid
 *   → 主花色里最好的牌（它们最常被打出去）
 * - 万能牌 → 一张**非**主花色的牌（它从此也算主花色）
 * - 钢铁 / 黄金 → 一张非主花色的牌（它们留在手里才值钱，本来也不会被打出去）
 * - 换花色 → 只用换成主花色的那一张，对三张非主花色的牌用
 * - The Hanged Man → 毁掉两张最没用的非主花色牌（瘦身，同花更好凑）
 * - Death → 把最好的主花色牌复制到最没用的那张上。**被复制的是 `T.x` 最右那张**
 * - Purple 蜡封 → 非主花色的牌（它会被弃掉，弃的时候造一张塔罗）
 */
function chooseTargets(c: Consumable, hand: Card[], suit: Suit): Card[] | null {
    const cfg = c.center.config;
    const on = hand.filter((x) => isSuit(x, suit)).sort((a, b) => cardValue(b, suit) - cardValue(a, suit));
    const off = hand.filter((x) => !isSuit(x, suit)).sort((a, b) => cardValue(a, suit) - cardValue(b, suit));
    const max = Math.min(5, cfg.max_highlighted ?? 1);

    // 已有强化的别覆盖掉，除非目标本来就是它
    const plain = (xs: Card[]) => xs.filter((x) => !x.enhancement);

    switch (c.key) {
        case 'c_magician':
        case 'c_empress':
        case 'c_heirophant':
        case 'c_justice': {
            const t = plain(on).slice(0, max);
            return t.length > 0 ? t : null;
        }
        case 'c_lovers':
        case 'c_chariot':
        case 'c_devil': {
            const t = plain(off).slice(0, max);
            return t.length > 0 ? t : null;
        }
        case 'c_strength': {
            // 点数 +1：挑主花色里点数最低的（A 会绕回 2，排除掉）
            const t = on.filter((x) => x.base.value !== 'Ace')
                .sort((a, b) => a.base.nominal - b.base.nominal)
                .slice(0, max);
            return t.length > 0 ? t : null;
        }
        case 'c_star':
        case 'c_moon':
        case 'c_sun':
        case 'c_world': {
            if (cfg.suit_conv !== suit) return null;
            const t = off.slice(0, max);
            return t.length > 0 ? t : null;
        }
        case 'c_hanged_man': {
            const t = off.filter((x) => !isHeldValue(x)).slice(0, max);
            return t.length > 0 ? t : null;
        }
        case 'c_death': {
            const source = on[0];
            if (!source) return null;
            // 被复制的是 T.x 最右那张，所以目标必须在它左边
            const target = [...off, ...on.slice(1).reverse()].find((x) => x.T.x < source.T.x);
            return target ? [target, source] : null;
        }
        case 'c_talisman':
        case 'c_deja_vu':
        case 'c_trance':
        case 'c_cryptid': {
            const t = on.filter((x) => !x.seal || c.key === 'c_cryptid').slice(0, 1);
            return t.length > 0 ? t : null;
        }
        case 'c_aura': {
            const t = on.filter((x) => !x.edition).slice(0, 1);
            return t.length > 0 ? t : null;
        }
        case 'c_medium': {
            const t = off.filter((x) => !x.seal).slice(0, 1);
            return t.length > 0 ? t : null;
        }
        default:
            // 不要选牌的：空数组
            return cfg.max_highlighted === undefined ? [] : null;
    }
}

/**
 * 把手里能用的消耗品用掉。**只在出牌阶段调**——要选牌的那些只有这时候用得了。
 *
 * 从后往前扫，因为用掉一张会改下标。用不了的留着，等下一手的新牌。
 */
function useHeldConsumables(run: Run): void {
    const round = run.round;
    if (!round || round.phase !== 'selecting') return;
    const suit = mainSuit(run.fullDeck);

    for (let i = run.consumables.length - 1; i >= 0; i--) {
        const c = run.consumables[i];
        if (!isConsumableImplemented(c.key) || NEVER_USE.has(c.key)) continue;
        const targets = chooseTargets(c, round.hand, suit);
        if (targets === null) continue;
        if (!run.canUseConsumable(i, targets)) continue;
        run.useConsumable(i, targets);
    }
}

/**
 * 在商店里（没有手牌）能用的那些：星球、造卡、给钱。要选牌的留到下一关。
 * `NEVER_USE` 的与「换成非主花色」的换花色牌直接卖掉，别占格子。
 */
function tidyConsumablesInShop(run: Run): void {
    const suit = mainSuit(run.fullDeck);
    for (let i = run.consumables.length - 1; i >= 0; i--) {
        const c = run.consumables[i];
        const suitConv = c.center.config.suit_conv as Suit | undefined;
        if (NEVER_USE.has(c.key) || (suitConv && suitConv !== suit) || !isConsumableImplemented(c.key)) {
            run.sellConsumable(i);
            continue;
        }
        if (c.center.config.max_highlighted !== undefined) continue;
        if (run.canUseConsumable(i, [])) run.useConsumable(i, []);
    }
}

/** 这张消耗品值得拿吗（商店与包里共用） */
function wantConsumable(run: Run, c: Consumable): boolean {
    if (!isConsumableImplemented(c.key) || NEVER_USE.has(c.key)) return false;
    const suitConv = c.center.config.suit_conv as Suit | undefined;
    if (suitConv && suitConv !== mainSuit(run.fullDeck)) return false;
    return true;
}

// ————————————————————————————————————————————————————————————————
// 给小丑估值：沙盒里真的打一手
// ————————————————————————————————————————————————————————————————

/**
 * 克隆一张牌。**不能用 `makeCard`**：它推进 `sort_id` / `unique_val` 两个全局计数器，
 * 而 `sort_id` 是 `pseudoshuffle` 的规范序——bot 光是「想一想」就会改掉后面的洗牌。
 */
function cloneCard(c: Card): Card {
    return { ...c, base: { ...c.base }, T: { ...c.T }, debuff: false };
}

type RefHand = { play: Card[]; held: Card[]; weight: number };

/**
 * 两手参考牌：**主花色同花**（本 bot 的主打）与**一手对子**（弃牌用完时的常态）。
 * 都从整副牌里挑，所以强化、蜡封、点数分布都是这一局真实的样子。
 */
function referenceHands(run: Run): RefHand[] {
    const deck = run.fullDeck.filter((c) => c.enhancement !== 'm_stone');
    const suit = mainSuit(deck);
    const byValue = (a: Card, b: Card) => b.base.nominal - a.base.nominal;

    const flush = deck.filter((c) => isSuit(c, suit)).sort(byValue).slice(0, 5);
    const rest = deck.filter((c) => !flush.includes(c));

    const byId = new Map<number, Card[]>();
    for (const c of rest) byId.set(c.base.id, [...(byId.get(c.base.id) ?? []), c]);
    const pairIds = [...byId.entries()].filter(([, g]) => g.length >= 2).sort((a, b) => byValue(a[1][0], b[1][0]));
    const pairId = pairIds[0]?.[0];
    const pair = pairId !== undefined ? byId.get(pairId)!.slice(0, 2) : [];
    // 凑数的三张挑**点数互不相同、也不同于对子**的，免得凑成两对 / 三条
    const filler: Card[] = [];
    const usedIds = new Set(pairId !== undefined ? [pairId] : []);
    for (const c of [...rest].sort((a, b) => a.base.nominal - b.base.nominal)) {
        if (usedIds.has(c.base.id)) continue;
        usedIds.add(c.base.id);
        filler.push(c);
    }
    const pairHand = [...pair, ...filler.slice(0, 3)];
    const held = filler.slice(3, 6);

    const out: RefHand[] = [];
    if (flush.length === 5) out.push({ play: flush, held, weight: 0.6 });
    if (pairHand.length === 5) out.push({ play: pairHand, held, weight: 0.4 });
    return out;
}

/**
 * 这一组小丑打参考牌能打多少分（加权平均）。**走真的结算管线**——
 * 不维护一张「每张小丑值多少」的表：150 张手标会漂，而且标不出协同（Blueprint、×倍率叠乘）。
 *
 * 沙盒里的一切都是克隆：小丑、牌、牌型等级。掷点一律给 0.5
 * （1/2 及以上的概率算中、以下不中），造卡的口子全是空操作，
 * **所以沙盒一次真 RNG 都不碰**。哪张小丑在沙盒里抛了就当这一组值 0——
 * 不能让估值把整局带崩。
 *
 * 只看计分：`Golden Joker` 这类发钱的在这里值 0，bot 不会主动买它们。
 */
function teamScore(run: Run, jokers: readonly Joker[]): number {
    let total = 0;
    for (const ref of referenceHands(run)) {
        const team = jokers.map((j) => structuredClone(j));
        const hands = structuredClone(run.hands);
        refreshDerivedAbilities(team, run.jokerSlots, run.fullDeck);
        const mods = runModifiers(team);
        const view = makeGameView({
            hands,
            jokers: team,
            joker_slots: run.jokerSlots,
            handCards: ref.held.map(cloneCard),
            dollars: run.dollars,
            deckCount: 30,
            startingDeckSize: run.fullDeck.length,
            playingCardCount: run.fullDeck.length,
            smeared: mods.smeared,
            probabilities: { normal: mods.probabilityNormal },
            current_round: { hands_left: 2, discards_left: 1, hands_played: 1 },
            ante: run.ante,
            consumable_slots: 0,
            createConsumable: () => {},
            createPlayingCard: () => {},
            duplicateConsumableAsNegative: () => {},
            pseudorandom: (_k, min, max) =>
                min !== undefined && max !== undefined ? Math.floor((min + max) / 2) : 0.5,
        });
        try {
            total += ref.weight * evaluatePlay(ref.play.map(cloneCard), hands, view, mods.flags).score;
        } catch {
            return 0;
        }
    }
    return total;
}

/** 小丑区里最弱的那张：拿掉它掉分最少的。没实现的直接算最弱 */
function weakestJoker(run: Run): number {
    const base = teamScore(run, run.jokers);
    let idx = -1;
    let worst = Infinity;
    run.jokers.forEach((j, i) => {
        const loss = isJokerImplemented(j.key)
            ? base - teamScore(run, run.jokers.filter((x) => x !== j))
            : -Infinity;
        if (loss < worst) {
            worst = loss;
            idx = i;
        }
    });
    return idx;
}

/**
 * 这张小丑值不值得要：要了之后参考分涨几成。满了就按「换掉最弱那张」算。
 * 没实现的一律 -1（买了什么也不发生）。
 */
function jokerGain(run: Run, candidate: Joker): number {
    if (!isJokerImplemented(candidate.key) || banned.has(candidate.ability.name)) return -1;
    const now = Math.max(1, teamScore(run, run.jokers));
    if (!run.jokersFull) return teamScore(run, [...run.jokers, candidate]) / now - 1;
    const w = weakestJoker(run);
    const swapped = run.jokers.map((j, i) => (i === w ? candidate : j));
    return teamScore(run, swapped) / now - 1;
}

// ————————————————————————————————————————————————————————————————
// 商店与补充包
// ————————————————————————————————————————————————————————————————

/** 最常打的牌型。一手都没打过就当是同花（本 bot 的主打） */
function favouriteHand(run: Run): HandName {
    let best: HandName = 'Flush';
    let n = 0;
    for (const [name, info] of Object.entries(run.hands) as [HandName, HandInfo][]) {
        if (info.played > n) {
            best = name;
            n = info.played;
        }
    }
    return best;
}

/** 包里这一张的分。负数 = 不要 */
function packScore(run: Run, index: number): number {
    const card = run.openPack!.cards[index];
    if (!run.canTakeFromPack(index)) return -1;
    if (card.kind === 'joker') {
        // 包里的小丑满了拿不了（`canTakeFromPack` 已经挡了），所以这里只按「加进去」算
        const gain = jokerGain(run, card.joker);
        return gain > BUY_GAIN ? 50 + gain * 100 : -1;
    }
    if (card.kind === 'card') return cardValue(card.card, mainSuit(run.fullDeck));
    const c = card.consumable;
    if (c.center.set === 'Planet') {
        return c.center.config.hand_type === favouriteHand(run) ? 100 : 40;
    }
    return wantConsumable(run, c) ? 30 : -1;
}

function openPack(run: Run, index: number): void {
    run.buyAndOpenPack(index);
    let guard = 0;
    while (run.openPack && guard++ < 10) {
        let bestIdx = -1;
        let best = -1;
        for (let j = 0; j < run.openPack.cards.length; j++) {
            const s = packScore(run, j);
            if (s > best) {
                best = s;
                bestIdx = j;
            }
        }
        if (bestIdx < 0) break;
        run.takeFromPack(bestIdx);
        // 星球拿到手就用，给下一张腾格子
        tidyConsumablesInShop(run);
    }
    if (run.openPack) run.skipPack();
}

/** 买小丑要涨多少才算值：加一张至少 +10%，换一张至少 +15%（换要亏买卖差价） */
const BUY_GAIN = 0.1;
const SWAP_GAIN = 0.15;

// ————————————————————————————————————————————————————————————————
// 存利息
// ————————————————————————————————————————————————————————————————

/**
 * 利息是回合结束时**每 $5 给 $1、封顶 $5**（`economy.ts`，身上 $25 就吃满）。
 * 所以花钱有个隐性成本：一笔开销让身上跌过一个 5 的倍数，之后每回合少 $1。
 *
 * bot 的做法是划一条**存钱线**：花完之后身上不能低于它。
 * 例外只有一种——小丑涨得足够多（`breakReserveGain`），因为小丑是唯一的乘法来源，
 * 早一关拿到它可能就是过不过得了下一个 Boss 的差别。线以上的余钱可以拿去重掷。
 *
 * ## 默认**不存**，因为实测不划算
 *
 * 60 个 seed 试了 15 种组合（存 5 / 10 / 15 / 25、前期存 / 后期才存、
 * 放不放行天体包、配不配重掷），**没有一种比不存好**，前期就存的明显更差
 * （全程存 $25：3.867 → 2.900）。利息确实发了——全程存 $25 时每回合多拿约 $2.5——
 * 但多出来的钱变不成战力：
 * - 回本太慢：少花 $25 要 5 回合满利息才补回来，而这个 bot 平均只活十来个回合
 * - 花不出去：重掷只换货架两格，刷到的小丑多半过不了估值线
 *
 * 卡住它的是出牌（每关一手同花之后只剩对子）与只看眼前的估值，不是钱。
 * 参数留着，是为了等那两处改好之后重新量——那时钱可能就变得有用了。
 * 对比见 `depth.slow.test.ts`。
 */
export type Economy = {
    /** 第几个 Ante 时存钱线是多少。返回 0 = 不存 */
    reserve(ante: number): number;
    /** 小丑能让参考分涨这么多，就允许动存款 */
    breakReserveGain: number;
    /** 天体包不受存钱线约束（星球的主要来源） */
    exemptCelestial: boolean;
    /** 每个商店最多重掷几次。只用存钱线以上的余钱 */
    maxRerolls: number;
};

const DEFAULT_ECONOMY: Economy = {
    reserve: () => 0,
    breakReserveGain: Infinity,
    exemptCelestial: false,
    maxRerolls: 0,
};

let policy: Economy = DEFAULT_ECONOMY;

/** 现在能花多少：身上的钱减去存钱线 */
function spendable(run: Run): number {
    return run.dollars - policy.reserve(run.ante);
}

function shop(run: Run): void {
    if (run.state !== 'shop') throw new Error(`现在是 ${run.state}，不在商店`);
    tidyConsumablesInShop(run);

    // **小丑优先**：小丑是唯一的乘法来源，星球只是加法。
    // 贪心把钱先花在包上，死的时候小丑区常常只有一两张
    buyJokers(run);

    // 再开包。天体包排最前（星球的主要来源）
    const packOrder = run.shop!.packs
        .map((p, i) => ({ i, celestial: p?.center.kind === 'Celestial' }))
        .sort((a, b) => Number(b.celestial) - Number(a.celestial));
    for (const { i, celestial } of packOrder) {
        if (!run.canBuyPack(i)) continue;
        const exempt = celestial && policy.exemptCelestial;
        if (exempt || spendable(run) >= run.shop!.packCost(i)) openPack(run, i);
    }

    buyConsumables(run);

    // 存钱线以上的余钱拿去重掷，刷小丑。**重掷只换货架，不换包**
    for (let r = 0; r < policy.maxRerolls; r++) {
        if (spendable(run) < run.shop!.rerollCost) break;
        run.rerollShop();
        buyJokers(run);
        buyConsumables(run);
    }

    run.leaveShop();
    tidyConsumablesInShop(run);
}

function buyConsumables(run: Run): void {
    for (let i = run.shop!.items.length - 1; i >= 0; i--) {
        const item = run.shop!.items[i];
        if (item.kind !== 'consumable' || item.cost > spendable(run)) continue;
        if (run.consumablesFull || !wantConsumable(run, item.consumable)) continue;
        run.buyConsumable(i);
        tidyConsumablesInShop(run);
    }
}

function buyJokers(run: Run): void {
    for (let i = run.shop!.items.length - 1; i >= 0; i--) {
        const item = run.shop!.items[i];
        if (item.kind !== 'joker') continue;
        const full = run.jokersFull;
        const w = full ? weakestJoker(run) : -1;
        const refund = full ? run.jokers[w].sell_cost : 0;
        if (item.cost > run.dollars + refund) continue;

        const gain = jokerGain(run, item.joker);
        if (gain < (full ? SWAP_GAIN : BUY_GAIN)) continue;
        // 要动存款的，只有涨得够多的才值——少吃的利息是每回合都在亏的
        if (item.cost > spendable(run) + refund && gain < policy.breakReserveGain) continue;
        if (full) run.sellJoker(w);
        run.buyJoker(i);
    }
}

/**
 * 拿这个 bot 从头跑到死。返回形状与 `greedyRun` 相同，好并排比。
 */
export function pickyRun(run: Run, options: PickyOptions = {}): GreedyRun {
    banned = options.bannedJokers ?? NONE;
    policy = { ...DEFAULT_ECONOMY, ...options.economy };
    try {
        let guard = 0;
        while (guard++ < 60) {
            const round = run.startRound();
            playRound(run, round);
            if (round.phase !== 'won') break;
            run.finishRound();
            shop(run);
        }
    } finally {
        banned = NONE;
        policy = DEFAULT_ECONOMY;
    }
    return {
        ante: run.ante,
        planets: run.consumableUsage.total.planet,
        jokers: run.jokers.map((j) => j.ability.name),
    };
}

export type PickyOptions = {
    /**
     * 当作「没实现」的小丑名：商店与包里都不拿。
     *
     * **这是量「某一批内容值多少」的开关**：同一批 seed 跑两遍，一遍禁掉、一遍放开，
     * 深度差就是这批小丑的贡献。比回退代码去量干净——回退会连带改掉 RNG 以外的东西。
     */
    bannedJokers?: ReadonlySet<string>;
    /** 存利息的参数。不给就用 `DEFAULT_ECONOMY` */
    economy?: Partial<Economy>;
};

const NONE: ReadonlySet<string> = new Set();
/**
 * 当前这一局的禁买名单。**模块级变量**，由 `pickyRun` 设置、`finally` 里清掉——
 * 估值那一串函数（`shop → buyJokers → jokerGain`，`openPack → packScore → jokerGain`）
 * 每层都要透传它，而整个 bot 是同步跑完的，不会有两局交错。
 */
let banned: ReadonlySet<string> = NONE;
