/**
 * 出牌结算管线。直译自
 * `参考/产物/Balatro_1.0.1o/源码/functions/state_events.lua:592-1030` 的 `evaluate_play`。
 *
 * ## 现在做到哪一步
 *
 * 15 步里做了 **3、4、6、9、10、11、14、15**，也就是整条「有小丑的」主干。
 * 还空着的：
 * - **2 / 5 / 8**：盲注钩子（`debuff_hand` / `modify_hand` / 逐张 debuff）。
 *   接口 `BlindHooks` 已经留好，Boss 盲注落地时填它，不用回来改管线。
 * - **12**：牌背效果（`selected_back:trigger_effect`）——只有 18 个牌组里的几个用
 * - **13**：摧毁判定（玻璃牌碎裂 / Gros Michel 自毁）——要强化牌与回合结算
 *
 * ## 顺序上三处容易错的
 *
 * 1. **第 7 步取基础值在第 6 步之后**。小丑的「出牌前」遍历能升级牌型
 *    （Space Joker），升完当次就生效。基础值必须在 before 循环跑完之后再读。
 * 2. **重复触发次数在逐张循环之前算一次**（`state_events.lua:689`），
 *    不是每次重复都重算。手牌区那个循环反而是**边跑边加**（`while j <= #reps`），
 *    两处形状不一样，别统一。
 * 3. **全局只有一次乘法**（第 14 步 `math.floor(hand_chips * mult)`）。
 *    中间所有 `x_mult` 都是在改 `mult` 这个累加器，不是在乘分数。
 *
 * 全景与每一步的作用面见 `参考/结论/Balatro_1.0.1o/出牌结算管线.md`。
 */

import type { Card } from './card';
import {
    type EvalResult,
    type GameView,
    type Joker,
    type JokerEffect,
    calculateJoker,
    evalCard,
    findJoker,
    getChipBonus,
} from './jokers';
import { type HandName, type JokerFlags, NO_JOKERS, evaluatePokerHand } from './poker-hands';

export type { HandName };
export { getChipBonus };

/** `game.lua:2211-2224` 的 `G.GAME.hands`。 */
export type HandInfo = {
    chips: number;
    mult: number;
    /**
     * 1 级时的筹码。**`level_up_hand` 每次都从它重算**，不是在 `chips` 上加减，
     * 所以它必须存着。见 `levelUpHand`
     */
    s_chips: number;
    /** 1 级时的倍率。同上 */
    s_mult: number;
    /** 每升一级加的筹码 */
    l_chips: number;
    /** 每升一级加的倍率 */
    l_mult: number;
    level: number;
    played: number;
    played_this_round: number;
    /**
     * 这个牌型**在牌型表里露没露过脸**。`Obelisk` 与 `To Do List` 的可选池读它。
     *
     * **不是「本局打出过」**——`game.lua:2212-2223` 里九个常规牌型开局就是 `true`，
     * 只有 Flush Five / Flush House / Five of a Kind 三个五张同点的开局是 `false`，
     * 打出来才翻成 `true`（`state_events.lua:599`）。
     */
    visible: boolean;
};

export function initialHands(): Record<HandName, HandInfo> {
    // 数值逐字抄自 game.lua:2212-2223。`visible` 那一列也是抄的，别改成全 false——
    // 全 false 会让 To Do List 的可选池在开局是空的
    const h = (
        chips: number,
        mult: number,
        l_chips: number,
        l_mult: number,
        visible: boolean,
    ): HandInfo => ({
        chips, mult,
        s_chips: chips, s_mult: mult,
        l_chips, l_mult,
        level: 1, played: 0, played_this_round: 0, visible,
    });

    return {
        'Flush Five': h(160, 16, 50, 3, false),
        'Flush House': h(140, 14, 40, 4, false),
        'Five of a Kind': h(120, 12, 35, 3, false),
        'Straight Flush': h(100, 8, 40, 4, true),
        'Four of a Kind': h(60, 7, 30, 3, true),
        'Full House': h(40, 4, 25, 2, true),
        Flush: h(35, 4, 15, 2, true),
        Straight: h(30, 4, 30, 3, true),
        'Three of a Kind': h(30, 3, 20, 2, true),
        'Two Pair': h(20, 2, 20, 1, true),
        Pair: h(10, 2, 15, 1, true),
        'High Card': h(5, 1, 10, 1, true),
    };
}

/**
 * `common_events.lua:467` 的 `level_up_hand`，数值部分：
 *
 * ```lua
 * level = math.max(0, level + amount)
 * mult  = math.max(s_mult  + l_mult *(level - 1), 1)
 * chips = math.max(s_chips + l_chips*(level - 1), 0)
 * ```
 *
 * **三件事容易写错**：
 *
 * 1. **倍率与筹码是从 1 级值重算的，不是在当前值上加减。**
 *    只要等级不撞下限两者等价，一撞下限就永久跑偏。
 * 2. **等级下限是 0**，不是无下限。`The Arm` 传的是 `-1`。
 * 3. **倍率下限 1、筹码下限 0。** High Card 是 `s_mult = 1, l_mult = 1`，
 *    0 级时原作给 `max(1-1, 1) = 1`；写成减法会给 0，那一手直接 0 分。
 *
 * **没有上限**，星球牌可以无限叠。
 */
export function levelUpHand(hands: Record<HandName, HandInfo>, name: HandName, amount = 1): void {
    const info = hands[name];
    info.level = Math.max(0, info.level + amount);
    info.mult = Math.max(info.s_mult + info.l_mult * (info.level - 1), 1);
    info.chips = Math.max(info.s_chips + info.l_chips * (info.level - 1), 0);
}

/**
 * 盲注对结算的三个钩子。Boss 盲注落地时实现它，现在的默认实现什么都不做。
 *
 * 对应 `blind.lua` 的三个方法与 `evaluate_play` 的第 2 / 5 / 8 步：
 * - `debuffHand`：整手牌不合法（The Psychic「必须出 5 张」这类）→ 本次得分归零
 * - `modifyHand`：改基础筹码与倍率（The Flint「基础筹码与倍率减半」）
 * - `debuffCard`：逐张 debuff（The Club「所有梅花失效」这类）
 */
export type BlindHooks = {
    /**
     * `pokerHands` 是各牌型的命中情况（`evaluate_poker_hand` 的 `results`）。
     * 只有 `debuff.hand` 那条（挑战模式的「某牌型直接不合法」）要用，
     * 但签名里先带着——补挑战模式时不用回来改管线。
     */
    debuffHand?(fullHand: Card[], handName: HandName, pokerHands: Record<HandName, Card[][]>): boolean;
    modifyHand?(handName: HandName, mult: number, handChips: number): { mult: number; handChips: number };
    /** 在结算开始前给牌置 `debuff`。原作是进盲注时一次性置位，不是每手重算 */
    debuffCard?(card: Card): boolean;
};

/**
 * 结算轨迹的一条。表现层按这串重放动画，**逻辑层已经同步算完**——
 * 改动画不可能改分数。
 */
export type ScoreStep =
    | {
          kind: 'card';
          card: Card;
          /** 第几次触发（重复触发时 > 0） */
          rep: number;
          chipMod: number;
          multMod: number;
          xMult: number;
          handChips: number;
          mult: number;
          /** 这一步的效果来自哪张小丑；来自牌面本身时为 null */
          source: Joker | null;
          message?: string;
      }
    | {
          kind: 'held';
          card: Card;
          rep: number;
          multMod: number;
          xMult: number;
          mult: number;
          source: Joker | null;
          message?: string;
      }
    | {
          kind: 'joker';
          joker: Joker;
          chipMod: number;
          multMod: number;
          xMult: number;
          handChips: number;
          mult: number;
          message?: string;
      };

export type PlayResult = {
    handName: HandName;
    /** 第 4 步定下的计分牌集合，已按 `T.x` 排序 */
    scoringHand: Card[];
    /** 第 7 步取到的牌型基础值 */
    baseChips: number;
    baseMult: number;
    handChips: number;
    mult: number;
    /** 第 14 步：`math.floor(hand_chips * mult)` */
    score: number;
    steps: ScoreStep[];
    /** 结算过程中赚到的钱（Business Card / To Do List 这类） */
    dollars: number;
    /** 整手被盲注判为不合法——分数为 0 */
    debuffed: boolean;
};

/**
 * 一次出牌的结算。
 *
 * `playedCards` 是打出去的那几张（最多 5 张），**顺序必须是手牌里从左到右**——
 * 原作靠 `table.sort(scoring_hand, function(a,b) return a.T.x < b.T.x end)`
 * （`state_events.lua:621`）保证这一点，这里照搬，读的是 `T.x`（tile 单位，见 10 号票）。
 */
export function evaluatePlay(
    playedCards: Card[],
    hands: Record<HandName, HandInfo>,
    game: GameView,
    jokerFlags: JokerFlags = NO_JOKERS,
    blind: BlindHooks = {},
): PlayResult {
    const steps: ScoreStep[] = [];
    const dollarsBefore = game.dollars + game.dollar_buffer;

    // —— 第 3 步：牌型判定 ——
    const results = evaluatePokerHand(playedCards, jokerFlags);
    const handName = results.topName;
    if (!handName || !results.top) {
        throw new Error('evaluate_poker_hand 没有返回 top —— 空手牌？');
    }

    // `state_events.lua:595-599`
    hands[handName].played++;
    hands[handName].played_this_round++;
    hands[handName].visible = true;
    game.hands_played++;

    // —— 第 4 步：确定计分牌集合 ——
    // `state_events.lua:601-620`：Splash 让全部 5 张都计分；石头牌无条件追加
    // （石头牌本里程碑没有，那个 `pures` 数组恒为空）。
    const splash = findJoker(game.jokers, 'Splash').length > 0;
    const scoringHand = splash ? [...playedCards] : [...results.top[0]];

    // 按屏幕上的 x 坐标排序 = 手牌里从左到右。
    // 「打出的第一张计分牌」指的是最左边那张，玩家可以靠调手牌顺序控制它——
    // Hanging Chad 与 Photograph 都吃这个顺序。
    scoringHand.sort((a, b) => a.T.x - b.T.x);

    // —— 第 2 步：盲注能不能判整手不合法 ——
    // `state_events.lua:636`：`if not G.GAME.blind:debuff_hand(...) then <正常结算> else <归零> end`
    if (blind.debuffHand?.(playedCards, handName, results.parts)) {
        return {
            handName, scoringHand, baseChips: 0, baseMult: 0, handChips: 0, mult: 0,
            score: 0, steps, dollars: 0, debuffed: true,
        };
    }

    // —— 第 6 步：小丑的「出牌前」遍历 ——
    // `state_events.lua:655`。**必须在第 7 步取基础值之前**：
    // Space Joker 在这里升级牌型，升完当次就生效。
    for (const joker of [...game.jokers]) {
        const effects = evalCard(joker, {
            cardarea: 'jokers',
            full_hand: playedCards,
            scoring_hand: scoringHand,
            scoring_name: handName,
            poker_hands: results.parts,
            before: true,
        }, game);

        if (effects.jokers?.level_up) levelUpHand(hands, handName);
    }

    // —— 第 7 步：取牌型的基础筹码与基础倍率 ——
    let mult = hands[handName].mult;
    let handChips = hands[handName].chips;
    const baseChips = handChips;
    const baseMult = mult;

    // —— 第 8 步：盲注改基础值 ——
    // `state_events.lua:665`
    if (blind.modifyHand) {
        const modded = blind.modifyHand(handName, mult, handChips);
        mult = modded.mult;
        handChips = modded.handChips;
    }

    // —— 第 9 / 11 步：逐张计分牌结算（左 → 右）——
    for (const card of scoringHand) {
        // `state_events.lua:677`：被 debuff 的牌整张跳过，一个效果都不跑
        if (card.debuff) {
            steps.push({
                kind: 'card', card, rep: 0, chipMod: 0, multMod: 0, xMult: 1,
                handChips, mult, source: null, message: 'debuffed',
            });
            continue;
        }

        // `state_events.lua:689`：**重复次数在这里算一次，不在重复循环里重算**
        let reps = 1;
        for (const joker of game.jokers) {
            const eval_ = evalCard(joker, {
                cardarea: 'play',
                full_hand: playedCards,
                scoring_hand: scoringHand,
                scoring_name: handName,
                poker_hands: results.parts,
                other_card: card,
                repetition: true,
            }, game);
            if (eval_.jokers?.repetitions) reps += eval_.jokers.repetitions;
        }

        for (let rep = 0; rep < reps; rep++) {
            // `state_events.lua:712`：牌面本身的效果先进数组，小丑的逐张效果再追加
            const effects: EvalResult[] = [
                evalCard(card, {
                    cardarea: 'play',
                    full_hand: playedCards,
                    scoring_hand: scoringHand,
                    scoring_name: handName,
                }, game),
            ];

            for (const joker of game.jokers) {
                const eval_ = evalCard(joker, {
                    cardarea: 'play',
                    full_hand: playedCards,
                    scoring_hand: scoringHand,
                    scoring_name: handName,
                    poker_hands: results.parts,
                    other_card: card,
                    individual: true,
                }, game);
                if (eval_.jokers) effects.push({ jokers: eval_.jokers });
            }

            // `state_events.lua:721`：**顺序是 chips → mult → dollars → extra → x_mult**。
            // x_mult 排在最后，所以同一张牌上「加倍率」总是先于「乘倍率」。
            for (const effect of effects) {
                const applied = applyCardEffect(effect, handChips, mult, game);
                if (applied.changed) {
                    handChips = applied.handChips;
                    mult = applied.mult;
                    steps.push({
                        kind: 'card', card, rep,
                        chipMod: applied.chipMod,
                        multMod: applied.multMod,
                        xMult: applied.xMult,
                        handChips, mult,
                        source: effect.jokers?.card ?? null,
                        message: effect.jokers?.message,
                    });
                }
            }
        }
    }

    // —— 第 10 步：手牌区遍历（留在手里没打出去的牌）——
    // `state_events.lua:803`。这个循环的重复触发是**边跑边加**（`while j <= #reps`），
    // 与上面那个「先算一次」的形状不同，别统一。
    for (const card of game.handCards) {
        let reps = 1;
        for (let j = 0; j < reps; j++) {
            const effects: EvalResult[] = [
                evalCard(card, {
                    cardarea: 'hand',
                    full_hand: playedCards,
                    scoring_hand: scoringHand,
                    scoring_name: handName,
                    poker_hands: results.parts,
                }, game),
            ];

            for (const joker of game.jokers) {
                const eval_ = evalCard(joker, {
                    cardarea: 'hand',
                    full_hand: playedCards,
                    scoring_hand: scoringHand,
                    scoring_name: handName,
                    poker_hands: results.parts,
                    other_card: card,
                    individual: true,
                }, game);
                if (eval_.jokers) effects.push({ jokers: eval_.jokers });
            }

            // `state_events.lua:820`：重复次数只在第一遍算，而且**要等 effects 拿到之后**——
            // Mime 靠 `card_effects` 判断「这张手牌本来有没有效果」
            if (j === 0) {
                for (const joker of game.jokers) {
                    const eval_ = evalCard(joker, {
                        cardarea: 'hand',
                        full_hand: playedCards,
                        scoring_hand: scoringHand,
                        scoring_name: handName,
                        poker_hands: results.parts,
                        other_card: card,
                        repetition: true,
                        card_effects: effects.map((e) => e.jokers ?? {}),
                    }, game);
                    if (eval_.jokers?.repetitions) reps += eval_.jokers.repetitions;
                }
            }

            // `state_events.lua:849`：手牌区**只应用 dollars / h_mult / x_mult**，不加筹码
            for (const effect of effects) {
                const e = effect.jokers;
                let multMod = 0;
                let xMult = 1;
                let changed = false;

                if (effect.h_mult) {
                    mult += effect.h_mult;
                    multMod += effect.h_mult;
                    changed = true;
                }
                if (e?.dollars) {
                    game.dollars += e.dollars;
                    changed = true;
                }
                if (e?.h_mult) {
                    mult += e.h_mult;
                    multMod += e.h_mult;
                    changed = true;
                }
                if (e?.x_mult) {
                    mult *= e.x_mult;
                    xMult *= e.x_mult;
                    changed = true;
                }
                if (!changed && !e?.message) continue;

                steps.push({
                    kind: 'held', card, rep: j, multMod, xMult, mult,
                    source: e?.card ?? null, message: e?.message,
                });
            }
        }
    }

    // —— 第 15 步：小丑区主遍历 ——
    // `state_events.lua:895`。三段，顺序固定：
    // 版本效果的加法段 → 小丑自身 → 小丑对小丑 → 版本效果的乘法段。
    // 版本（foil/holo/polychrome）本里程碑没有，所以第一段与第四段恒空。
    for (const joker of [...game.jokers]) {
        const ctx = {
            cardarea: 'jokers' as const,
            full_hand: playedCards,
            scoring_hand: scoringHand,
            scoring_name: handName,
            poker_hands: results.parts,
        };

        const effects = evalCard(joker, ctx, game);

        if (effects.jokers) {
            // `state_events.lua:929`：**mult_mod → chip_mod → Xmult_mod**，这个顺序要守住
            const e = effects.jokers;
            let chipMod = 0;
            let multMod = 0;
            let xMult = 1;
            if (e.mult_mod) { mult += e.mult_mod; multMod = e.mult_mod; }
            if (e.chip_mod) { handChips += e.chip_mod; chipMod = e.chip_mod; }
            if (e.Xmult_mod) { mult *= e.Xmult_mod; xMult = e.Xmult_mod; }
            // **主遍历不给钱**（`state_events.lua:929-936` 只处理那三个 mod）。
            // `Matador` 之类返回的 `dollars` 只是给提示文字用的，钱是它自己
            // 调 `ease_dollars` 加的——在这里再加一遍就会翻倍
            steps.push({
                kind: 'joker', joker, chipMod, multMod, xMult, handChips, mult, message: e.message,
            });
        }

        // `state_events.lua:939`：小丑对小丑。**内层遍历的是整个小丑区**，
        // 每张都拿 `other_joker = 当前这张` 问一遍
        for (const other of game.jokers) {
            const effect = calculateOtherJoker(other, joker, ctx, game);
            if (!effect) continue;
            let chipMod = 0;
            let multMod = 0;
            let xMult = 1;
            if (effect.mult_mod) { mult += effect.mult_mod; multMod = effect.mult_mod; }
            if (effect.chip_mod) { handChips += effect.chip_mod; chipMod = effect.chip_mod; }
            if (effect.Xmult_mod) { mult *= effect.Xmult_mod; xMult = effect.Xmult_mod; }
            steps.push({
                kind: 'joker', joker: other, chipMod, multMod, xMult, handChips, mult,
                message: effect.message,
            });
        }
    }

    // —— 第 14 步：全局唯一的一次乘法 ——
    const score = Math.floor(handChips * mult);

    return {
        handName, scoringHand, baseChips, baseMult, handChips, mult, score, steps,
        dollars: game.dollars + game.dollar_buffer - dollarsBefore,
        debuffed: false,
    };
}

/**
 * `state_events.lua:721-820` 那一串 `if effects[ii].X then`。
 *
 * 抽成函数是因为它在逐张循环里要跑 `#effects × reps` 次，内联会把主循环
 * 撑到读不动。**顺序就是原文的顺序**，别按字段名排。
 */
function applyCardEffect(
    effect: EvalResult,
    handChips: number,
    mult: number,
    game: GameView,
): { changed: boolean; handChips: number; mult: number; chipMod: number; multMod: number; xMult: number } {
    let chipMod = 0;
    let multMod = 0;
    let xMult = 1;
    let changed = false;

    // 牌面本身的 chips / mult（`eval_card` 的 cardarea == play 分支）
    if (effect.chips) { handChips += effect.chips; chipMod += effect.chips; changed = true; }
    if (effect.mult) { mult += effect.mult; multMod += effect.mult; changed = true; }

    const e = effect.jokers;
    if (e) {
        if (e.chips) { handChips += e.chips; chipMod += e.chips; changed = true; }
        if (e.mult) { mult += e.mult; multMod += e.mult; changed = true; }
        if (e.p_dollars) { game.dollars += e.p_dollars; changed = true; }
        if (e.dollars) { game.dollars += e.dollars; changed = true; }
        if (e.extra) {
            if (e.extra.mult_mod) { mult += e.extra.mult_mod; multMod += e.extra.mult_mod; }
            if (e.extra.chip_mod) { handChips += e.extra.chip_mod; chipMod += e.extra.chip_mod; }
            // `state_events.lua:764` 的 swap：筹码与倍率互换
            if (e.extra.swap) {
                const oldMult = mult;
                mult = handChips;
                handChips = oldMult;
            }
            changed = true;
        }
        // x_mult 最后
        if (e.x_mult) { mult *= e.x_mult; xMult *= e.x_mult; changed = true; }
    }

    return { changed, handChips, mult, chipMod, multMod, xMult };
}

/** `state_events.lua:940` 的 `v:calculate_joker{other_joker = _card}`。 */
function calculateOtherJoker(
    v: Joker,
    target: Joker,
    ctx: { full_hand: Card[]; scoring_hand: Card[]; scoring_name: HandName; poker_hands: Record<HandName, Card[][]> },
    game: GameView,
): JokerEffect | null {
    // **直接调 `calculate_joker`，不走 `eval_card`、也不带 cardarea**。
    //
    // 这一点很容易搞错：`eval_card` 的 `other_joker` 分支（`common_events.lua:647`）
    // 转调的是 **`context.other_joker` 自己**的 `calculate_joker`，
    // 而这里要问的是 `v`（提供效果的那张）。走 `eval_card` 会把主体与对象搞反，
    // 结果是 Baseball Card 这类「小丑影响小丑」的效果一个都不触发。
    return calculateJoker(v, { ...ctx, other_joker: target }, game);
}

/** `misc_functions.lua:922` 的 `get_blind_amount`，前 8 个 Ante 写死。 */
const ANTE_AMOUNTS = [300, 800, 2000, 5000, 11000, 20000, 35000, 50000];

export function getBlindAmount(ante: number): number {
    if (ante < 1) return 100;
    if (ante <= 8) return ANTE_AMOUNTS[ante - 1];

    // Ante 9 起走公式。本里程碑到不了，但直译过来免得以后忘。
    const a = ANTE_AMOUNTS[7];
    const b = 1.6;
    const c = ante - 8;
    const d = 1 + 0.2 * (ante - 8);
    let amount = Math.floor(a * Math.pow(b + Math.pow(0.75 * c, d), c));
    amount = amount - (amount % Math.pow(10, Math.floor(Math.log10(amount) - 1)));
    return amount;
}

/** `game.lua:267-298`。小盲注 ×1、大盲注 ×1.5、Boss 各带自己的 mult（Ante 1 全是 ×2）。 */
export const BLIND_MULT = { small: 1, big: 1.5, boss: 2 } as const;

export function blindRequirement(ante: number, blind: keyof typeof BLIND_MULT): number {
    return getBlindAmount(ante) * BLIND_MULT[blind];
}
