/**
 * 18 张幽灵牌。直译自 `card.lua:1092` `Card:use_consumeable` 里的那一串分支。
 *
 * ## 它们只能从幽灵补充包与 The Soul 来
 *
 * `G.GAME.spectral_rate` 默认 0（`create_card_for_shop` 里
 * `G.GAME.spectral_rate = G.GAME.spectral_rate or 0`），**商店永远不出幽灵牌**。
 * 这是 16 号票把幽灵牌推到 17 号票的依据。
 *
 * ## `The Soul` 与 `Black Hole` 进不了池子
 *
 * 它们的 center 带 `hidden`，`get_current_pool` 有一条无条件剔除
 * （`common_events.lua:2062` 按 name 判）。**只能从 `create_card` 的
 * soulable 分支（`forced_key`）来**——那条分支只在补充包里传真值。
 *
 * ## 三张造牌的幽灵牌，RNG 的账各不相同
 *
 * | 卡 | 点数 | 花色 | 强化 |
 * |---|---|---|---|
 * | Familiar | `familiar_create`（J/Q/K） | `familiar_create` | `spe_card` |
 * | Grim | 固定 A，**不掷** | `grim_create` | `spe_card` |
 * | Incantation | `incantation_create`（2–10） | `incantation_create` | `spe_card` |
 *
 * **Familiar 与 Incantation 用同一个 key 掷两次**（先点数、再花色），
 * Grim 只掷花色。搞错次数整条链就偏。
 * 强化的候选池是 8 张里**去掉石头牌**的 7 张（`card.lua:1329`）。
 */

import { type Suit, type Value, cardKey, copyPlayingCard, makeBase, makeCard } from '../card';
import { pollEdition } from '../editions';
import { ENHANCEMENT_KEYS_BY_ORDER } from '../enhancements';
import type { Joker } from '../jokers';
import { levelUpHand } from '../scoring';
import type { HandName } from '../poker-hands';
import type { Seal } from '../seals';
import type { Consumable } from './types';
import type { ConsumableSpec, UseContext } from './use-context';

const SUITS: Suit[] = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];

/**
 * `card.lua:1329` 的 `cen_pool`：8 张强化**去掉石头牌**。
 * 石头牌没有点数与花色，造出来会毁掉「造一张人头牌」的意思。
 */
const SPE_CARD_POOL = ENHANCEMENT_KEYS_BY_ORDER.filter((k) => k !== 'm_stone');

/** `card.lua:1319` 起三张造牌幽灵牌的点数候选 */
const FAMILIAR_RANKS: Value[] = ['Jack', 'Queen', 'King'];
const INCANTATION_RANKS: Value[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];

/** 原文的花色候选写成 `{'S','H','D','C'}`，**顺序就是这个**，别按字母排 */
function pickSuit(ctx: UseContext, key: string): Suit {
    return ctx.pickRandom(SUITS, key) ?? 'Spades';
}

/**
 * `create_playing_card` + 那三张幽灵牌的 for 循环（`card.lua:1313`）。
 *
 * 造 `count` 张：先销毁 1 张随机手牌（`random_destroy`，由调用方做），
 * 再逐张造。**每张都要按各自的顺序掷点**。
 */
function createCards(
    ctx: UseContext,
    count: number,
    pick: (i: number) => { suit: Suit; value: Value },
): void {
    for (let i = 0; i < count; i++) {
        const { suit, value } = pick(i);
        const card = makeCard(cardKey(suit, value), suit, value);
        // `card.lua:1337`：强化从去掉石头牌的 7 张里抽，key 是 `spe_card`
        card.enhancement = ctx.pickRandom(SPE_CARD_POOL, 'spe_card') ?? null;
        ctx.addPlayingCard(card);
    }
}

/** 销毁 1 张随机手牌（`card.lua:1291` 的 `pseudorandom_element(G.hand.cards, pseudoseed('random_destroy'))`） */
function destroyOneRandom(ctx: UseContext): void {
    const victim = ctx.pickRandom(ctx.handCards, 'random_destroy');
    if (victim) ctx.removeCards([victim]);
}

/** 给选中的那一张加蜡封。四张幽灵牌共用这一条（`card.lua:1180`） */
function sealSpec(seal: Seal): ConsumableSpec {
    return {
        apply: (_c, ctx) => {
            const target = ctx.highlighted[0];
            if (target) target.seal = seal;
        },
        canUse: (_c, ctx) => ctx.highlighted.length === 1,
    };
}

/** `card.lua:4220` 的 `eligible_editionless_jokers`：小丑区里还没有版本的那些 */
function editionless(ctx: UseContext): Joker[] {
    return ctx.jokers.filter((j) => !j.edition);
}

/** 造牌型幽灵牌要的：手牌至少 2 张（`card.lua:1576`） */
const needsHand: ConsumableSpec['canUse'] = (_c, ctx) => ctx.handCards.length > 1;

export const SPECTRAL_SPECS: Record<string, ConsumableSpec> = {
    // ———— 三张造牌的 ————
    c_familiar: {
        apply: (c, ctx) => {
            destroyOneRandom(ctx);
            createCards(ctx, c.center.config.extra as number, () => ({
                // **点数在前、花色在后**，同一个 key 掷两次
                value: ctx.pickRandom(FAMILIAR_RANKS, 'familiar_create') ?? 'Ace',
                suit: pickSuit(ctx, 'familiar_create'),
            }));
        },
        canUse: needsHand,
    },
    c_grim: {
        apply: (c, ctx) => {
            destroyOneRandom(ctx);
            // **点数固定 A，不掷点**；只掷花色
            createCards(ctx, c.center.config.extra as number, () => ({
                value: 'Ace' as Value,
                suit: pickSuit(ctx, 'grim_create'),
            }));
        },
        canUse: needsHand,
    },
    c_incantation: {
        apply: (c, ctx) => {
            destroyOneRandom(ctx);
            createCards(ctx, c.center.config.extra as number, () => ({
                value: ctx.pickRandom(INCANTATION_RANKS, 'incantation_create') ?? 'Ace',
                suit: pickSuit(ctx, 'incantation_create'),
            }));
        },
        canUse: needsHand,
    },

    // ———— 四张加蜡封的 ————
    c_talisman: sealSpec('Gold'),
    c_deja_vu: sealSpec('Red'),
    c_trance: sealSpec('Blue'),
    c_medium: sealSpec('Purple'),

    /**
     * `card.lua:1194`：给**手里选中的那一张**加一个保底版本。
     * `poll_edition('aura', nil, true, true)`——guaranteed 且 no_neg。
     * 门槛：选中正好 1 张，**而且那张还没有版本**（`card.lua:1543`）。
     */
    c_aura: {
        apply: (_c, ctx) => {
            const target = ctx.highlighted[0];
            if (!target) return;
            const edition = pollEdition(ctx, 'aura', { noNeg: true, guaranteed: true });
            if (edition) target.edition = edition;
        },
        canUse: (_c, ctx) => ctx.highlighted.length === 1 && !ctx.highlighted[0].edition,
    },

    /**
     * `card.lua:1456`：造一张**稀有**小丑，然后把钱清零。
     *
     * `create_card('Joker', G.jokers, nil, 0.99, …, 'wra')` —— 第 4 个实参是
     * `_rarity = 0.99`，**给了就不掷 rarity 点**，而 `0.99 > 0.95` → 稀有度 3。
     */
    c_wraith: {
        apply: (_c, ctx) => {
            ctx.addJoker(ctx.createJoker('wra', { rarity: 0.99 }));
            // `ease_dollars(-G.GAME.dollars, true)`：清零，不是扣固定数
            ctx.addDollars(-ctx.getDollars());
        },
        canUse: (_c, ctx) => ctx.jokers.length < ctx.jokerSlots,
    },

    /**
     * `card.lua:1241`：**整手牌变成同一个花色**。一次掷点定花色，
     * 然后所有手牌都改——不是逐张掷。
     */
    c_sigil: {
        apply: (_c, ctx) => {
            const suit = pickSuit(ctx, 'sigil');
            for (const card of ctx.handCards) {
                Object.assign(card.base, makeBase(suit, card.base.value));
                (card as { key: string }).key = cardKey(suit, card.base.value);
            }
        },
        canUse: needsHand,
    },

    /**
     * `card.lua:1252`：**整手牌变成同一个点数**，而且**手牌上限 -1**。
     * 点数候选是 `{'2'..'9','T','J','Q','K','A'}`，**13 个**。
     */
    c_ouija: {
        apply: (_c, ctx) => {
            const value = ctx.pickRandom(
                ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'] as Value[],
                'ouija',
            ) ?? 'Ace';
            for (const card of ctx.handCards) {
                Object.assign(card.base, makeBase(card.base.suit, value));
                (card as { key: string }).key = cardKey(card.base.suit, value);
            }
            ctx.changeHandSize(-1);
        },
        canUse: needsHand,
    },

    /**
     * `card.lua:1483`：给一张没版本的小丑加 **Negative**，手牌上限**递增地减**
     * （`ecto_minus` 从 1 起，每用一次多减一格）。
     */
    c_ectoplasm: {
        apply: (_c, ctx) => {
            const target = ctx.pickRandom(editionless(ctx), 'ectoplasm');
            if (target) target.edition = 'negative';
            ctx.changeHandSize(-ctx.nextEctoplasmMinus());
        },
        canUse: (_c, ctx) => editionless(ctx).length > 0,
    },

    /**
     * `card.lua:1341`：把手牌**洗一遍**（key `immolate`），毁掉前 5 张，给 $20。
     *
     * 洗牌而不是逐张抽——所以消费的是一次 `pseudoshuffle`，不是 5 次抽取。
     */
    c_immolate: {
        apply: (c, ctx) => {
            const extra = c.center.config.extra as { destroy: number; dollars: number };
            const shuffled = ctx.shuffled(ctx.handCards, 'immolate');
            ctx.removeCards(shuffled.slice(0, extra.destroy));
            ctx.addDollars(extra.dollars);
        },
        canUse: needsHand,
    },

    /**
     * `card.lua:1429`：**复制一张随机小丑，毁掉其余所有（非永恒的）小丑**。
     *
     * 抽取用 `ankh_choice`，而且抽的是**整个小丑区**（不是「可删的那些」）——
     * 所以被选中的那张有可能正是唯一一张永恒小丑。
     */
    c_ankh: {
        apply: (_c, ctx) => {
            const chosen = ctx.pickRandom(ctx.jokers, 'ankh_choice');
            if (!chosen) return;
            for (const joker of [...ctx.jokers]) {
                if (joker !== chosen) ctx.removeJoker(joker);
            }
            // `copy_card`：复制一份，**Negative 版本要剥掉**（原文 `strip_edition`）
            ctx.addJoker({
                ...chosen,
                ability: JSON.parse(JSON.stringify(chosen.ability)),
                edition: chosen.edition === 'negative' ? undefined : chosen.edition,
            });
        },
        canUse: (_c, ctx) => ctx.jokers.length > 0 && ctx.jokerSlots > 1,
    },

    /**
     * `card.lua:1483`：给一张没版本的小丑加 **Polychrome**，
     * 然后**毁掉其余所有（非永恒的）小丑**。
     */
    c_hex: {
        apply: (_c, ctx) => {
            const target = ctx.pickRandom(editionless(ctx), 'hex');
            if (!target) return;
            target.edition = 'polychrome';
            for (const joker of [...ctx.jokers]) {
                if (joker !== target) ctx.removeJoker(joker);
            }
        },
        canUse: (_c, ctx) => editionless(ctx).length > 0,
    },

    /** `card.lua:1203`：把选中的那张**复制 `extra` 份**进手牌与牌组 */
    c_cryptid: {
        apply: (c, ctx) => {
            const source = ctx.highlighted[0];
            if (!source) return;
            const count = c.center.config.extra as number;
            // `copy_card` 连永久筹码与 debuff 一起复制——原先这里只抄了三样
            for (let i = 0; i < count; i++) ctx.addPlayingCard(copyPlayingCard(source));
        },
        canUse: (_c, ctx) => ctx.highlighted.length === 1,
    },

    /**
     * `card.lua:1415`：造一张**传奇**小丑。
     *
     * `create_card('Joker', G.jokers, true, …, 'sou')` —— 第 3 个实参
     * `legendary = true`。两处容易漏：
     * - **rarity 那次点照掷**（`_rarity` 是 nil），只是结果被 `legendary and 4` 盖掉
     * - **池 key 不带 append 也不带 ante**：`'Joker'..4` 就是全部，
     *   因为 `_pool_key..(not _legendary and ante or '')` 在 legendary 下取空串
     */
    c_soul: {
        apply: (_c, ctx) => ctx.addJoker(ctx.createJoker('sou', { legendary: true })),
        canUse: (_c, ctx) => ctx.jokers.length < ctx.jokerSlots,
    },

    /** `card.lua:1155`：**每一个牌型都升一级**。随时能用 */
    c_black_hole: {
        apply: (_c, ctx) => {
            for (const name of Object.keys(ctx.hands) as HandName[]) {
                levelUpHand(ctx.hands, name);
            }
        },
    },
};

/** 让 `tarot.ts` 那边的 `Consumable` 类型在这个文件里也用得上 */
export type { Consumable };
