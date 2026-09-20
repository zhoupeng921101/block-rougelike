/**
 * 开补充包。直译自 `card.lua:1682` 的 `Card:open`。
 *
 * 单独一个文件是为了避开循环 import：`boosters.ts` 只管「抽哪个包」
 * （纯数据 + 一次掷点，谁都不依赖），造包里的牌要用 `shop.ts` 的
 * `createConsumableCard` / `createJokerCard`，而 `shop.ts` 反过来要用
 * `boosters.ts` 的 `getPack`。
 *
 * ## `Card:open` 里的执行顺序，照着读会写反
 *
 * ```lua
 * -- ① 入队：造包里的牌（delay 1.3，blockable=false）
 * G.E_MANAGER:add_event(Event({ ... for i = 1, _size do create_card(...) end ... }))
 * -- ② 同步：open_booster 的小丑遍历
 * for i = 1, #G.jokers.cards do G.jokers.cards[i]:calculate_joker({open_booster = true}) end
 * ```
 *
 * **② 是同步的，① 只是入队**，所以真实执行序是「先跑小丑遍历、再造包里的牌」。
 * 这个顺序有观测后果：`Hallucination` 造出来的那张塔罗会被标进 `used_jokers`，
 * 而包里那几张塔罗的池子要读它——反过来的话包里可能抽到那一张，
 * `_resample` 的次数跟着变。调用方（`Run.openPack`）负责守住这个顺序。
 *
 * ## `soulable` 在包里传的是真值
 *
 * 16 号票查明商店路径传 `nil`，所以 The Soul / Black Hole 出不了商店。
 * 包里全部传 `true`，于是每张牌前面多一次（幽灵包是两次）`soul_<Type><ante>`。
 */

import { type BoosterCenter, type BoosterKind } from './boosters';
import { type Consumable, type ConsumableSet } from './consumables';
import type { Joker } from './jokers';
import type { PseudorandomState } from './rng';
import {
    type PoolContext,
    createConsumableCard,
    createJokerCard,
    releaseUsed,
} from './shop';

/** 包里的一张。标准包（扑克牌）与幽灵包在 17 号票的后半段 */
export type PackCard =
    | { kind: 'consumable'; consumable: Consumable }
    | { kind: 'joker'; joker: Joker };

/** 一个开着的补充包。`Run` 持有它，`null` 表示没在开包 */
export type OpenPack = {
    key: string;
    center: BoosterCenter;
    cards: PackCard[];
    /** `G.GAME.pack_choices`。挑掉一张减一，到 0 自动关 */
    choicesLeft: number;
};

/**
 * 这种包现在开得了吗。
 *
 * **标准包与幽灵包还没实现**：前者要版本与蜡封、后者要 18 张幽灵牌，
 * 都在 17 号票的后半段。商店会给它们标 `⚠未实现`，买不了——
 * 与没行为的小丑、没行为的塔罗同一条机制。
 */
const IMPLEMENTED_KINDS: ReadonlySet<BoosterKind> = new Set<BoosterKind>([
    'Arcana',
    'Celestial',
    'Buffoon',
]);

export function isBoosterImplemented(key: string, centers: Record<string, BoosterCenter>): boolean {
    const center = centers[key];
    return !!center && IMPLEMENTED_KINDS.has(center.kind);
}

/** `Card:open` 里造牌那一段的 RNG 口径，按口味分。 */
const PACK_SPECS: Record<
    BoosterKind,
    { type: 'consumable'; set: ConsumableSet; append: string } | { type: 'joker'; append: string } | null
> = {
    // `card.lua:1734`：`create_card("Tarot", …, true, true, nil, 'ar1')`
    Arcana: { type: 'consumable', set: 'Tarot', append: 'ar1' },
    // `card.lua:1740`：`create_card("Planet", …, true, true, nil, 'pl1')`
    Celestial: { type: 'consumable', set: 'Planet', append: 'pl1' },
    // `card.lua:1775`：`create_card("Joker", …, true, true, nil, 'buf')`
    Buffoon: { type: 'joker', append: 'buf' },
    Standard: null,
    Spectral: null,
};

/**
 * 造包里的 `extra` 张牌。**不跑 `open_booster` 的小丑遍历**——
 * 那一趟由调用方在这之前跑（见文件头）。
 */
export function openBooster(
    rng: PseudorandomState,
    center: BoosterCenter,
    key: string,
    context: PoolContext,
): OpenPack {
    const spec = PACK_SPECS[center.kind];
    if (!spec) throw new Error(`${center.name} 还没有实现（要版本／蜡封／幽灵牌）`);

    const cards: PackCard[] = [];
    for (let i = 0; i < center.extra; i++) {
        if (spec.type === 'consumable') {
            // `soulable` 的那次（幽灵包是两次）掷点排在池子抽取**之前**。
            // The Soul / Black Hole 还没实现，所以这里只消费、不落地——
            // 与商店那两次 `edi` 掷点同一个处理
            rollSoulable(rng, spec.set, context.ante);
            cards.push({
                kind: 'consumable',
                consumable: createConsumableCard(rng, spec.set, context, spec.append),
            });
        } else {
            // 小丑包：`_type == 'Joker'` 不进 soulable 那两支
            cards.push({ kind: 'joker', joker: createJokerCard(rng, context, spec.append, 'pack') });
        }
    }

    return { key, center, cards, choicesLeft: center.choose };
}

/**
 * `common_events.lua:2130` 的 soulable 段。**两个并列的 if**，不是 if/elseif：
 *
 * | `_type` | The Soul | Black Hole | 掷点 |
 * |---|---|---|---|
 * | Tarot | ✅ | ❌ | 1 次 |
 * | Planet | ❌ | ✅ | 1 次 |
 * | Spectral | ✅ | ✅ | **2 次** |
 *
 * 判据 `> 0.997`。两支各带一条「手上有就不掷」的守卫，
 * 而 The Soul / Black Hole 现在造不出来（幽灵牌在 17 号票后半段），
 * 所以那条守卫恒不成立、两次都掷。
 */
function rollSoulable(rng: PseudorandomState, set: ConsumableSet, ante: number): void {
    // The Soul 那一支只对 Tarot / Spectral / Tarot_Planet 跑
    if (set === 'Tarot') rng.pseudorandom(`soul_Tarot${ante}`);
    // Black Hole 那一支只对 Planet / Spectral 跑
    if (set === 'Planet') rng.pseudorandom(`soul_Planet${ante}`);
}

/**
 * 关掉一个开着的包：**没挑走的那几张要还回池子**。
 *
 * 原作是 `end_consumeable` → `G.pack_cards:remove()` → 每张 `Card:remove()`，
 * 走 `card.lua:4829` 那条 used 清除。与「离开商店」同一条路。
 * 不还回去，下一个包的池子内容就比原版窄，`_resample` 次数跟着偏。
 */
export function releasePack(pack: OpenPack, context: PoolContext): void {
    for (const card of pack.cards) {
        releaseUsed(context, card.kind === 'joker' ? card.joker.key : card.consumable.key);
    }
}
