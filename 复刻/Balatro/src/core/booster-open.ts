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
import { type Card, P_CARDS, makeCard } from './card';
import { type Consumable, type ConsumableSet, makeConsumable } from './consumables';
import { pollEdition } from './editions';
import { ENHANCEMENT_KEYS_BY_ORDER } from './enhancements';
import type { Joker } from './jokers';
import { type PseudorandomState, pseudorandomElement } from './rng';
import {
    type PoolContext,
    createConsumableCard,
    createJokerCard,
    releaseUsed,
} from './shop';

/** 包里的一张。幽灵包在 17 号票的最后一步 */
export type PackCard =
    | { kind: 'consumable'; consumable: Consumable }
    | { kind: 'joker'; joker: Joker }
    /** 标准包造出来的扑克牌。挑走就进牌组 */
    | { kind: 'card'; card: Card };

/** 包里这一张占着的 center key。扑克牌没有 key（它不进 `used_jokers`） */
export function packCardKey(card: PackCard): string | null {
    if (card.kind === 'joker') return card.joker.key;
    if (card.kind === 'consumable') return card.consumable.key;
    return null;
}

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
 * 五种全实现了，这张表因此恒为真——**但不要删掉它**。
 * 它是「买了什么也不发生」那条闸的落点，挑战模式与 mod 会带别的 kind 进来。
 */
const IMPLEMENTED_KINDS: ReadonlySet<BoosterKind> = new Set<BoosterKind>([
    'Arcana',
    'Celestial',
    'Buffoon',
    'Standard',
    'Spectral',
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
    // `card.lua:1758`：`create_card("Spectral", …, true, true, nil, 'spe')`
    Spectral: { type: 'consumable', set: 'Spectral', append: 'spe' },
    // 标准包不走 `PACK_SPECS`——它造的是扑克牌，账完全不一样（见 `createPlayingCard`）
    Standard: null,
};

/**
 * `card.lua:1760` 的标准包造牌。**账与别的包完全不一样**，按顺序：
 *
 * ```
 * stdset<ante>              > 0.6 → Enhanced，否则 Base
 * Enhancedsta<ante>         只有 Enhanced 才抽（8 张强化，**池子不剔除**）
 * frontsta<ante>            从 52 张 P_CARDS 里抽牌面
 * standard_edition<ante>    poll_edition(mod = 2, no_neg = true)
 * stdseal<ante>             > 0.8 才有蜡封
 * stdsealtype<ante>         只有有蜡封时才掷
 * ```
 *
 * 两处容易漏：
 * - **`soulable` 传了真值但一次都不掷**：`_type` 是 `Base` / `Enhanced`，
 *   两支 soul 判定都不匹配。
 * - **Base 不抽池子**：`create_card` 里 `_type == 'Base'` 直接
 *   `forced_key = 'c_base'`，跳过 `get_current_pool`。
 */
function createPlayingCard(
    rng: PseudorandomState,
    context: PoolContext,
    keyAppend: string,
): Card {
    const ante = context.ante;

    // `card.lua:1761`：**这一次排在 `create_card` 之前**（它是实参）
    const enhanced = rng.pseudorandom(`stdset${ante}`) > 0.6;

    let enhancement: string | null = null;
    if (enhanced) {
        // `get_current_pool('Enhanced', …)`：`_type == 'Enhanced'` 那一支
        // **无条件 `add = true`**，8 张一张不剔
        const poolKey = `Enhanced${keyAppend}${ante}`;
        const [picked] = pseudorandomElement(ENHANCEMENT_KEYS_BY_ORDER, rng.pseudoseed(poolKey));
        enhancement = String(picked);
    }

    // `common_events.lua:2166` 的 `front`。**`P_CARDS` 是以 key 为键的表**，
    // 所以抽取按 key 的字节序排，不是牌组那个 2→A 的顺序
    const [, frontKey] = pseudorandomElement(P_CARDS, rng.pseudoseed(`front${keyAppend}${ante}`));
    const front = P_CARDS[String(frontKey)];
    const card = makeCard(String(frontKey), front.suit, front.value);
    card.enhancement = enhancement;

    // `card.lua:1763`：**mod = 2、no_neg**（扑克牌拿不到 Negative）
    const edition = pollEdition(rng, `standard_edition${ante}`, { mod: 2, noNeg: true });
    if (edition) card.edition = edition;

    // `card.lua:1766`：`seal_rate = 10`，判据 `> 1 - 0.02*10 = 0.8`。
    // **不到门槛就不掷 `stdsealtype`**
    if (rng.pseudorandom(`stdseal${ante}`) > 1 - 0.02 * 10) {
        const t = rng.pseudorandom(`stdsealtype${ante}`);
        card.seal = t > 0.75 ? 'Red' : t > 0.5 ? 'Blue' : t > 0.25 ? 'Gold' : 'Purple';
    }

    return card;
}

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
    if (!IMPLEMENTED_KINDS.has(center.kind)) {
        throw new Error(`${center.name} 还没有实现（要幽灵牌）`);
    }

    const cards: PackCard[] = [];

    // 标准包造的是扑克牌，账与别的包完全不一样
    if (center.kind === 'Standard') {
        for (let i = 0; i < center.extra; i++) {
            cards.push({ kind: 'card', card: createPlayingCard(rng, context, 'sta') });
        }
        return { key, center, cards, choicesLeft: center.choose };
    }

    const spec = PACK_SPECS[center.kind];
    if (!spec) throw new Error(`${center.name} 的 PACK_SPECS 缺了一条`);

    for (let i = 0; i < center.extra; i++) {
        if (spec.type === 'consumable') {
            // `soulable` 的那次（幽灵包是两次）掷点排在池子抽取**之前**。
            // 中了就 `forced_key`，**那条路不抽池子**（`create_card` 的 if/else）
            const forced = rollSoulable(rng, spec.set, context.ante);
            if (forced) {
                const soul = makeConsumable(forced);
                context.usedJokers.add(forced);
                cards.push({ kind: 'consumable', consumable: soul });
            } else {
                cards.push({
                    kind: 'consumable',
                    consumable: createConsumableCard(rng, spec.set, context, spec.append),
                });
            }
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
function rollSoulable(rng: PseudorandomState, set: ConsumableSet, ante: number): string | null {
    let forced: string | null = null;

    // The Soul 那一支只对 Tarot / Spectral / Tarot_Planet 跑
    if (set === 'Tarot' || set === 'Spectral') {
        if (rng.pseudorandom(`soul_${set}${ante}`) > 0.997) forced = 'c_soul';
    }
    // Black Hole 那一支只对 Planet / Spectral 跑。
    // **幽灵包两支都跑，所以掷两次同 key**，而且第二次能盖掉第一次
    if (set === 'Planet' || set === 'Spectral') {
        if (rng.pseudorandom(`soul_${set}${ante}`) > 0.997) forced = 'c_black_hole';
    }

    return forced;
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
        // **扑克牌不进 `used_jokers`**：`get_current_pool('Enhanced')` 无条件
        // `add = true`，标不标都不改池子，所以造的时候也没标
        const key = packCardKey(card);
        if (key) releaseUsed(context, key);
    }
}
