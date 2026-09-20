/**
 * 盲注。直译自 `参考/产物/Balatro_1.0.1o/源码/blind.lua` 与
 * `functions/common_events.lua:2387` 的 `get_new_boss`。
 *
 * ## 28 个 Boss 全部实现
 *
 * 第二个里程碑只做了 Ante 1 的 8 个，其余 20 个由 `assertImplemented` 挡着抛异常。
 * 现在补齐了，那道闸也就撤了——但**留着那个函数与名单**，
 * 因为它是「有数值但没行为的 Boss 会看起来完全正常」这条教训的落点，
 * 以后再加 Boss（挑战模式有自己的）时照样要过它。
 *
 * Boss 的机制分五类，各有自己的钩子：
 *
 * | 类 | 钩子 | 例子 |
 * |---|---|---|
 * | 逐张 debuff | `debuffCard` | The Club（梅花失效）、The Plant（人头牌失效） |
 * | 整手不合法 | `debuffHand` | The Psychic（必须 5 张）、The Mouth（只许一种牌型） |
 * | 改基础值 | `modifyHand` | The Flint（筹码与倍率减半） |
 * | 出牌后 | `pressPlay` | The Hook（弃 2 张）、The Tooth（每张 -$1） |
 * | 盖牌 | `stayFlipped` | The Wheel（1/7 盖牌）、The Mark（人头牌盖牌） |
 *
 * 外加两处在进场时一次性生效的：`handSizeMod`（The Manacle -1 手牌上限）、
 * `handsSub` / `discardsSub`（The Needle 只剩 1 次出牌、The Water 0 次弃牌）。
 *
 * **`The Arm` 是唯一一个「`debuff_hand` 返回假但仍然生效」的 Boss**：
 * 它把打出的牌型降一级，然后**让这手牌照常计分**（`blind.lua:551` 那个分支里
 * 只设 `triggered`、不 `return true`）。所以 `debuffHand` 的返回值不能当作
 * 「这个 Boss 有没有干活」，只能当作「这手牌算不算 0 分」。
 *
 * ## 抽 Boss 的池子顺序
 *
 * `get_new_boss` 走 `pseudorandom_element(eligible_bosses, pseudoseed('boss'))`，
 * 而 `eligible_bosses` 是一张**以 key 为键**的表。`pseudorandom_element`
 * （`misc_functions.lua:256`）对这种表按 **key 的字符串序**排，再取
 * `math.random(#keys)`。所以池子顺序是 `bl_club < bl_goad < bl_head < …`
 * 的字母序，**不是 `order`**。搞错这一条，同 seed 就会抽到别的 Boss。
 */

import { type Card, isFace, isSuit } from './card';
import type { Suit } from './card';
import type { Joker } from './jokers';
import { BLIND_CENTERS } from './blinds.generated';
import type { PseudorandomState } from './rng';
import { pseudorandomElement } from './rng';
import type { BlindHooks, HandName } from './scoring';

export type { BlindHooks };

export type BlindCenter = {
    order: number;
    name: string;
    /** 打过之后的基础收益 */
    dollars: number;
    /** 需求 = `get_blind_amount(ante) * mult` */
    mult: number;
    pos: { x: number; y: number };
    /** `null` 表示这是小盲注／大盲注，不是 Boss */
    boss: { min: number; max: number; showdown?: boolean } | null;
    /** 声明式的 debuff。`blind.lua:624` 的 `debuff_card` 读它 */
    debuff: {
        suit?: Suit;
        is_face?: 'face';
        /** 「至少出 N 张」——不足就整手不合法 */
        h_size_ge?: number;
        h_size_le?: number;
        hand?: HandName;
        value?: string;
        nominal?: number;
    };
};

export { BLIND_CENTERS };

/** 一局 Ante 的三个盲注。`Boss` 那一格在 Ante 开始时抽定。 */
export type BlindKind = 'small' | 'big' | 'boss';

/**
 * `common_events.lua:2387` 的 `get_new_boss`。
 *
 * 省掉的分支：`perscribed_bosses`（挑战模式）、`G.FORCE_BOSS`（调试）、
 * `banned_keys`（挑战模式）、`G.FTP_LOCKED`（试玩版）。本里程碑都不涉及。
 *
 * **`bossesUsed` 的最小使用次数过滤要留着**：它让 Boss 轮转而不是纯随机，
 * 而且它改变**池子大小**，也就改变 `math.random(#keys)` 的取值域——
 * 省掉它，第二个 Ante 起同 seed 就会分叉。
 */
export function getNewBoss(
    ante: number,
    rng: PseudorandomState,
    bossesUsed: Record<string, number>,
    winAnte = 8,
): string {
    const eligible: Record<string, number> = {};

    for (const [key, center] of Object.entries(BLIND_CENTERS)) {
        if (!center.boss) continue;
        const a = Math.max(1, ante);
        if (!center.boss.showdown) {
            if (center.boss.min <= a && (a % winAnte !== 0 || ante < 2)) {
                eligible[key] = bossesUsed[key] ?? 0;
            }
        } else if (ante % winAnte === 0 && ante >= 2) {
            eligible[key] = bossesUsed[key] ?? 0;
        }
    }

    // `common_events.lua:2422`：只留使用次数最少的那一档
    const minUse = Math.min(...Object.values(eligible));
    for (const key of Object.keys(eligible)) {
        if (eligible[key] > minUse) delete eligible[key];
    }

    const [, key] = pseudorandomElement(eligible, rng.pseudoseed('boss'));
    if (key === undefined) throw new Error(`Ante ${ante} 没有可选的 Boss`);
    const boss = String(key);
    bossesUsed[boss] = (bossesUsed[boss] ?? 0) + 1;
    return boss;
}

/**
 * 一个 Boss 在一局里的活动状态。
 *
 * 原作把这些挂在 `G.GAME.blind` 上（`self.triggered` / `self.hands` /
 * `self.only_hand`），因为 Boss 是个有生命周期的对象，不是纯数据。
 * 这里保持同一形状。
 */
export type BlindState = {
    readonly key: string;
    readonly center: BlindCenter;
    /** `blind.lua:356` 的 `Blind:disable()`。Luchador / Chicot 能关掉 Boss */
    disabled: boolean;
    /** 本局有没有触发过 debuff。表现层用来抖动 */
    triggered: boolean;
    /** `The Manacle` 的 -1 手牌上限。声明在这里而不是算在 debuff 里 */
    handSizeMod: number;
    /** `blind.lua:183` 的 `hands_sub`。`The Needle` 把出牌次数砍到 1 */
    handsSub: number;
    /** `blind.lua:179` 的 `discards_sub`。`The Water` 把弃牌次数砍到 0 */
    discardsSub: number;
    /** `blind.lua:157` 的 `self.hands`。`The Eye` 记本局打过哪些牌型 */
    seenHands: Set<HandName>;
    /** `blind.lua:173` 的 `self.only_hand`。`The Mouth` 锁定本局唯一的牌型 */
    onlyHand: HandName | null;
    /**
     * `blind.lua:92` 的 `self.prepped`。
     *
     * 两个 Boss 用它，含义不同：`The Fish` 用来标「刚出过牌，这批抽的要盖着」，
     * `Crimson Heart` 用来标「进场后还没 debuff 过小丑」。
     * 原文就是同一个字段两种用法，不拆。
     */
    prepped: boolean;
};

export function makeBlindState(key: string): BlindState {
    const center = BLIND_CENTERS[key];
    if (!center) throw new Error(`没有这个盲注：${key}`);
    return {
        key,
        center,
        disabled: false,
        triggered: false,
        // `blind.lua:187`：`if self.name == 'The Manacle' and not reset then G.hand:change_size(-1)`
        handSizeMod: center.name === 'The Manacle' ? -1 : 0,
        // `blind.lua:183`：`hands_sub = round_resets.hands - 1`，即只剩 1 次出牌
        handsSub: center.name === 'The Needle' ? STARTING_HANDS - 1 : 0,
        // `blind.lua:179`：`discards_sub = current_round.discards_left`，即全砍掉。
        // **它砍的是「进场时还剩多少」**，而进场时正是基数 + 小丑的 d_size，
        // 所以复刻件在 `Round` 里用 `discardsSub === ALL` 表示「归零」而不是写死 3
        discardsSub: center.name === 'The Water' ? ALL_DISCARDS : 0,
        seenHands: new Set(),
        onlyHand: null,
        prepped: true,
    };
}

/** `misc_functions.lua:1858` 的 `hands`。`The Needle` 的 `hands_sub` 算它。 */
const STARTING_HANDS = 4;

/**
 * `The Water` 的 `discards_sub` 哨兵值。
 *
 * 原文是 `discards_sub = G.GAME.current_round.discards_left` —— 砍掉**进场时实际剩的
 * 那个数**，而那个数含小丑给的 `d_size`（Drunkard +1）。写死 3 会在带 Drunkard 时
 * 留下 1 次弃牌。所以这里用哨兵，由 `Round` 在知道真实值时归零。
 */
export const ALL_DISCARDS = -1;

/**
 * 已实现行为的 Boss。28 个全在里面。
 *
 * **别把这张表删了。** 它是「有数值但没行为的 Boss 会看起来完全正常、
 * 玩起来是白送一关」这条教训的落点：新加 Boss（挑战模式带自己的）时，
 * 忘了写行为就会在这里被挡住，而不是静默上线。
 */
const IMPLEMENTED_BOSSES = new Set([
    // Ante 1（min = 1）
    'The Club', 'The Goad', 'The Head', 'The Hook',
    'The Manacle', 'The Pillar', 'The Psychic', 'The Window',
    // min = 2
    'The Arm', 'The Fish', 'The Flint', 'The House', 'The Mark',
    'The Mouth', 'The Needle', 'The Wall', 'The Water', 'The Wheel',
    // min = 3 起
    'The Eye', 'The Tooth', 'The Plant', 'The Serpent', 'The Ox',
    // showdown（ante 8）
    'Amber Acorn', 'Cerulean Bell', 'Crimson Heart', 'Verdant Leaf', 'Violet Vessel',
]);

/** 拿到一个 Boss 时先过这道闸。 */
export function assertImplemented(center: BlindCenter): void {
    if (!center.boss) return;
    if (!IMPLEMENTED_BOSSES.has(center.name)) {
        throw new Error(`Boss「${center.name}」还没有实现行为——别静默当成「没有 debuff」放过去`);
    }
}

/**
 * `blind.lua:624` 的 `Blind:debuff_card`。
 *
 * 两处直译要点：
 * - `is_suit(suit, true)` 与 `is_face(true)` 的第二个参数是 `bypass_debuff` /
 *   `from_boss`——**Boss 查花色与人头牌时无视已有的 debuff**，
 *   否则第二个 debuff 源就会因为第一个已经生效而查不到。
 * - 末尾那句 `card:set_debuff(false)` 是**无条件的**：没命中任何 debuff 条件
 *   就显式清掉，不是「保持原样」。
 */
export function debuffCard(blind: BlindState, card: Card): boolean {
    const { center } = blind;
    if (!blind.disabled) {
        if (center.debuff.suit && isSuit(card, center.debuff.suit)) return true;
        if (center.debuff.is_face === 'face' && isFace(card, false, true)) return true;
        // `The Pillar`：本 Ante 之前打出过的牌
        if (center.name === 'The Pillar' && card.played_this_ante) return true;
        if (center.debuff.value && center.debuff.value === card.base.value) return true;
        if (center.debuff.nominal && center.debuff.nominal === card.base.nominal) return true;
        // `blind.lua:650`：`Verdant Leaf` 封掉**所有**扑克牌，直到卖掉一张小丑。
        // 它在原文里排在 `if self.debuff and not disabled` 那个块**外面**，
        // 所以不看 `center.debuff` 有没有内容——这里也一样，摆在最后
        if (center.name === 'Verdant Leaf') return true;
    }
    return false;
}

/**
 * `blind.lua:519` 的 `Blind:debuff_hand`——整手牌合不合法。
 *
 * **返回 true 表示这手牌得 0 分**，不表示「Boss 干了活」。
 * `The Arm` 与 `The Ox` 都会做事（降牌型等级 / 清空钱）却返回假，
 * 原文那两个分支只设 `self.triggered`、不 `return true`。
 *
 * `check` 参数对应原文的 `check`：为真时只查不写状态
 * （UI 预览用——`The Eye` 与 `The Mouth` 要在玩家还没出牌时就显示「不合法」）。
 */
export function debuffHand(
    blind: BlindState,
    cards: Card[],
    handName: HandName,
    context: DebuffHandContext = {},
): boolean {
    if (blind.disabled) return false;
    const d = blind.center.debuff;
    const check = context.check ?? false;

    if (d.hand && context.pokerHands?.[d.hand]?.length) {
        blind.triggered = true;
        return true;
    }
    if (d.h_size_ge !== undefined && cards.length < d.h_size_ge) {
        blind.triggered = true;
        return true;
    }
    if (d.h_size_le !== undefined && cards.length > d.h_size_le) {
        blind.triggered = true;
        return true;
    }

    // `blind.lua:533`：`The Eye` —— 每种牌型本局只能打一次
    if (blind.center.name === 'The Eye') {
        if (blind.seenHands.has(handName)) {
            blind.triggered = true;
            return true;
        }
        if (!check) blind.seenHands.add(handName);
    }

    // `blind.lua:540`：`The Mouth` —— 本局只许一种牌型，第一手打的那种
    if (blind.center.name === 'The Mouth') {
        if (blind.onlyHand !== null && blind.onlyHand !== handName) {
            blind.triggered = true;
            return true;
        }
        if (!check) blind.onlyHand = handName;
    }

    // `blind.lua:549`：`The Arm` —— 把打出的牌型**降一级**，然后照常计分。
    // `triggered` 置位但**不 return true**，这是全 28 个 Boss 里唯一这样的
    if (blind.center.name === 'The Arm') {
        blind.triggered = false;
        if ((context.handLevel ?? 1) > 1) {
            blind.triggered = true;
            if (!check) context.levelDown?.(handName);
        }
    }

    // `blind.lua:562`：`The Ox` —— 打出本局最常用的牌型就**清空所有钱**
    if (blind.center.name === 'The Ox') {
        blind.triggered = false;
        if (handName === context.mostPlayedHand) {
            blind.triggered = true;
            if (!check) context.loseAllMoney?.();
        }
    }

    return false;
}

/**
 * `debuff_hand` 要读写的那几样外部状态，收成显式入参。
 *
 * 原文直接读 `G.GAME.hands[handname].level` 与 `G.GAME.current_round.most_played_poker_hand`、
 * 直接调 `level_up_hand(-1)` 与 `ease_dollars(-G.GAME.dollars)`。
 * 收成回调是因为 `blinds.ts` 不该 import `scoring.ts` 的 `levelUpHand`——
 * 那会让盲注层反过来依赖结算层，而结算层已经依赖盲注层的 `BlindHooks` 了。
 */
export type DebuffHandContext = {
    /** 只查不写。UI 预览用 */
    check?: boolean;
    /** 当前这手牌型的等级。`The Arm` 判 `> 1` */
    handLevel?: number;
    /** `G.GAME.current_round.most_played_poker_hand`。`The Ox` 判它 */
    mostPlayedHand?: HandName;
    /** 各牌型的命中情况。`debuff.hand` 那条（挑战模式用）查它 */
    pokerHands?: Record<HandName, Card[][]>;
    levelDown?: (handName: HandName) => void;
    loseAllMoney?: () => void;
};

/**
 * `blind.lua:510` 的 `Blind:modify_hand`。
 *
 * 28 个 Boss 里**只有 `The Flint`** 改基础值。
 * `The Wall`（mult 4）与 `Violet Vessel`（mult 6）不走这里——
 * 它们改的是**盲注需求**，那是 `center.mult` 的事，不是改这手牌的基础值。
 */
export function modifyHand(
    blind: BlindState,
    mult: number,
    handChips: number,
): { mult: number; handChips: number } {
    if (blind.disabled) return { mult, handChips };
    if (blind.center.name === 'The Flint') {
        blind.triggered = true;
        // `math.max(math.floor(x*0.5 + 0.5), …)`——**四舍五入，不是截断**
        return {
            mult: Math.max(Math.floor(mult * 0.5 + 0.5), 1),
            handChips: Math.max(Math.floor(handChips * 0.5 + 0.5), 0),
        };
    }
    return { mult, handChips };
}

/**
 * `blind.lua:464` 的 `Blind:press_play`——出牌**之后**触发的那些。
 *
 * 三个 Boss 走这里：
 * - `The Hook`：随机弃 2 张手牌。**消费 RNG**（`pseudoseed('hook')`）
 * - `The Tooth`：打出的每张牌 -$1
 * - `The Fish`：置 `prepped`，让紧接着补的那批牌盖着
 *
 * 原作是入队执行的，但队列里没有别的 RNG 消费点与 `'hook'` 交错，
 * 所以同步执行不改顺序（09 号票）。
 *
 * 返回要弃掉的牌与要扣的钱；调用方负责真的移出手牌区、真的扣钱。
 */
export type PressPlayResult = {
    /** 要弃掉的手牌（`The Hook`） */
    discard: Card[];
    /** 要扣的钱，正数表示扣（`The Tooth`） */
    dollarsLost: number;
};

export function pressPlay(
    blind: BlindState,
    hand: Card[],
    played: Card[],
    rng: PseudorandomState,
): PressPlayResult {
    const none: PressPlayResult = { discard: [], dollarsLost: 0 };
    if (blind.disabled) return none;

    // `blind.lua:496`：打出的每张牌 -$1。**按打出的张数，不是计分的张数**
    if (blind.center.name === 'The Tooth') {
        blind.triggered = true;
        return { discard: [], dollarsLost: played.length };
    }

    // `blind.lua:489`：置 prepped，`stay_flipped` 读它 → 这一批补的牌盖着
    if (blind.center.name === 'The Fish') {
        blind.prepped = true;
        return none;
    }

    if (blind.center.name !== 'The Hook') return none;

    // `blind.lua:467`：先整份拷贝一份候选，抽中一张就从候选里删掉
    const candidates = [...hand];
    const picked: Card[] = [];

    // **循环条件是 `G.hand.cards[i]` 而不是 `#_cards >= i`**——原文查的是
    // 原始手牌区的第 1、2 个位置存不存在，不是候选池还剩几张。
    // 手里只有 1 张时只弃 1 张。
    for (let i = 0; i < 2; i++) {
        if (!hand[i]) continue;
        const [card, key] = pseudorandomElement(candidates, rng.pseudoseed('hook'));
        if (card === undefined) continue;
        picked.push(card);
        candidates.splice(Number(key), 1);
    }

    blind.triggered = true;
    return { discard: picked, dollarsLost: 0 };
}

/**
 * `blind.lua:605` 的 `Blind:stay_flipped`——这张抽到手里的牌要不要盖着。
 *
 * 盖牌**不改任何数值**：牌还在手里、还能选、还照常计分，玩家只是看不见它是什么。
 * 所以它属于「信息隐藏」而不是 debuff。
 *
 * **但 `The Wheel` 要消费 RNG**（`pseudoseed('wheel')`，1/7 概率），
 * 所以这个函数必须在逻辑层、由抽牌流程调用，不能挪进表现层——
 * 挪过去 RNG 顺序就随渲染时机变了。
 */
export function stayFlipped(
    blind: BlindState,
    card: Card,
    round: { handsPlayed: number; discardsUsed: number },
    rng: PseudorandomState,
    probabilityNormal = 1,
): boolean {
    if (blind.disabled) return false;

    switch (blind.center.name) {
        // `blind.lua:608`。**掷点无条件发生**，中不中都消耗一次
        case 'The Wheel':
            return rng.pseudorandom('wheel') < probabilityNormal / 7;

        // `blind.lua:611`：本回合还没出牌也没弃牌 → 第一批手牌全盖着
        case 'The House':
            return round.handsPlayed === 0 && round.discardsUsed === 0;

        // `blind.lua:614`。`is_face(true)` 的 true 是 `from_boss`——无视 debuff
        case 'The Mark':
            return isFace(card, false, true);

        // `blind.lua:617`：只有刚出过牌那一批盖着（`prepped` 由 `pressPlay` 置位）
        case 'The Fish':
            return blind.prepped;

        default:
            return false;
    }
}

/**
 * `state_events.lua:384`：`The Serpent` 让「出牌或弃牌之后」的补牌**固定补 3 张**，
 * 而不是补到手牌上限。
 *
 * 返回这次该补几张；`null` 表示按常规（补到上限）。
 */
export function drawCount(
    blind: BlindState,
    round: { handsPlayed: number; discardsUsed: number },
    deckSize: number,
): number | null {
    if (blind.disabled) return null;
    if (blind.center.name !== 'The Serpent') return null;
    if (round.handsPlayed === 0 && round.discardsUsed === 0) return null;
    return Math.min(deckSize, 3);
}

/**
 * `blind.lua:572` 的 `Blind:drawn_to_hand`——一批牌抽进手里之后。
 *
 * 两个 showdown Boss 用它，都**消费 RNG**：
 * - `Cerulean Bell`：强制选中手里的一张牌（`pseudoseed('cerulean_bell')`）
 * - `Crimson Heart`：每回合 debuff 一张随机小丑（`pseudoseed('crimson_heart')`）
 *
 * 末尾那句 `self.prepped = nil` 是**无条件的**：不管哪个 Boss，
 * 抽完一批牌就清掉 prepped，这是 `The Fish` 只盖一批的原因。
 */
export function drawnToHand(
    blind: BlindState,
    hand: Card[],
    jokers: Joker[],
    rng: PseudorandomState,
): { forced: Card | null; debuffedJoker: Joker | null } {
    let forced: Card | null = null;
    let debuffedJoker: Joker | null = null;

    if (!blind.disabled) {
        // `blind.lua:574`：手里已经有被强制选中的牌就不再选
        if (blind.center.name === 'Cerulean Bell' && hand.length > 0) {
            if (!hand.some((c) => c.forced_selection)) {
                const [picked] = pseudorandomElement(hand, rng.pseudoseed('cerulean_bell'));
                if (picked) {
                    picked.forced_selection = true;
                    forced = picked;
                }
            }
        }

        // `blind.lua:588`：候选是「没被 debuff 的」，但**小丑只有一张时连它也算**；
        // 而且**先把所有小丑的 debuff 清掉再选**，所以每回合换一张
        if (blind.center.name === 'Crimson Heart' && blind.prepped && jokers.length > 0) {
            const candidates = jokers.filter((j) => !j.debuff || jokers.length < 2);
            for (const j of jokers) j.debuff = false;
            const [picked] = pseudorandomElement(candidates, rng.pseudoseed('crimson_heart'));
            if (picked) {
                picked.debuff = true;
                debuffedJoker = picked;
                blind.triggered = true;
            }
        }
    }

    // `blind.lua:602`：**无条件**清 prepped
    blind.prepped = false;
    return { forced, debuffedJoker };
}

/**
 * 把一个 `BlindState` 包成管线要的 `BlindHooks`。
 *
 * `context` 由 `Round` 提供——它知道牌型等级、最常用牌型，也知道怎么扣钱。
 */
export function blindHooks(blind: BlindState, context: () => DebuffHandContext = () => ({})): BlindHooks {
    return {
        debuffHand: (cards, handName, pokerHands) =>
            debuffHand(blind, cards, handName, { ...context(), pokerHands }),
        modifyHand: (_handName, mult, handChips) => modifyHand(blind, mult, handChips),
        debuffCard: (card) => debuffCard(blind, card),
    };
}
