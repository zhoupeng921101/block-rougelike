/**
 * 盲注。直译自 `参考/产物/Balatro_1.0.1o/源码/blind.lua` 与
 * `functions/common_events.lua:2387` 的 `get_new_boss`。
 *
 * ## 本里程碑只实现 Ante 1 的 8 个 Boss
 *
 * `boss.min <= 1` 的那些（15 号票）：The Club / The Goad / The Head / The Hook /
 * The Manacle / The Pillar / The Psychic / The Window。八个的 `mult` 全是 2，
 * 所以 Ante 1 的 Boss 需求都是 600，但**八个的 debuff 各不相同**。
 *
 * 其余 20 个 Boss 的 debuff 留空——`BLIND_CENTERS` 里有它们的数值，
 * 但 `bossHooks` 里没有实现。`assertImplemented` 会在拿到未实现的 Boss 时抛，
 * 不会静默当成「没有 debuff 的 Boss」放过去。
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
    };
}

/** 本里程碑实现了 debuff 的 Boss。不在这张表里的 Boss 会在进场时抛。 */
const IMPLEMENTED_BOSSES = new Set([
    'The Club',
    'The Goad',
    'The Head',
    'The Hook',
    'The Manacle',
    'The Pillar',
    'The Psychic',
    'The Window',
]);

/**
 * 拿到一个 Boss 时先过这道闸。
 *
 * **为什么要抛而不是当没有 debuff**：那 20 个未实现的 Boss 在
 * `BLIND_CENTERS` 里有完整数值（`mult` / `dollars`），一个「有需求但没有 debuff」
 * 的 Boss 在游戏里看起来完全正常，玩起来就是白送一关。
 * 静默放过去等于把一个正确性缺口伪装成正常行为。
 */
export function assertImplemented(center: BlindCenter): void {
    if (!center.boss) return;
    if (!IMPLEMENTED_BOSSES.has(center.name)) {
        throw new Error(
            `Boss「${center.name}」的 debuff 还没实现（本里程碑只做 Ante 1 的 8 个，见 15 号票）`,
        );
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
    }
    return false;
}

/**
 * `blind.lua:519` 的 `Blind:debuff_hand`——整手牌合不合法。
 *
 * 只实现 Ante 1 的 8 个用得到的分支：`h_size_ge`（The Psychic「必须出 5 张」）。
 * `The Eye` / `The Mouth` / `The Arm` / `The Ox` 要跨手记状态，不在本里程碑。
 */
export function debuffHand(blind: BlindState, cards: Card[], _handName: HandName): boolean {
    if (blind.disabled) return false;
    const d = blind.center.debuff;
    if (d.h_size_ge !== undefined && cards.length < d.h_size_ge) {
        blind.triggered = true;
        return true;
    }
    if (d.h_size_le !== undefined && cards.length > d.h_size_le) {
        blind.triggered = true;
        return true;
    }
    return false;
}

/**
 * `blind.lua:510` 的 `Blind:modify_hand`。
 *
 * Ante 1 的 8 个 Boss 一个都不改基础值（只有 `The Flint` 改，它 min=2），
 * 所以这里恒等返回。**留着这个函数**是为了让管线第 8 步有落点，
 * 接 Ante 2 的 Boss 时只改这一处。
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
 * Ante 1 里只有 `The Hook`：从手牌里随机弃 2 张。
 * **这一处消费 RNG**（`pseudoseed('hook')`），而且原作是入队执行的——
 * 但队列里没有别的 RNG 消费点与它交错，所以同步执行不改顺序（09 号票）。
 *
 * 返回要弃掉的牌；调用方负责真的移出手牌区。
 */
export function pressPlay(blind: BlindState, hand: Card[], rng: PseudorandomState): Card[] {
    if (blind.disabled) return [];
    if (blind.center.name !== 'The Hook') return [];

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
    return picked;
}

/** 把一个 `BlindState` 包成管线要的 `BlindHooks`。 */
export function blindHooks(blind: BlindState): BlindHooks {
    return {
        debuffHand: (cards, handName) => debuffHand(blind, cards, handName),
        modifyHand: (_handName, mult, handChips) => modifyHand(blind, mult, handChips),
        debuffCard: (card) => debuffCard(blind, card),
    };
}
