/**
 * `calculate_joker`。直译自 `参考/产物/Balatro_1.0.1o/源码/card.lua:2294-4066`（1773 行）。
 *
 * ## 翻译形状（15 号票裁定）
 *
 * 原文是一条 `if context.X then … elseif context.Y then …` 的大链，
 * 链内再按 `self.ability.name` 逐个判、命中即 `return`。
 *
 * **外层的 context 分支结构照抄**——它是真语义，分支之间互斥且有先后。
 * **分支内按名字分发**——名字唯一、命中即 return，查表与 if 链等价，
 * 而 150 张用 if 链会变成一个 2000 行函数。
 *
 * ## 一处不能改成查表的地方
 *
 * main 分支（原文的最后那个 `else`，`card.lua:3634`）**前四条判定不是按名字的**：
 *
 * ```lua
 * if self.ability.name == 'Loyalty Card' then …          -- 会 fall through
 * if self.ability.name ~= 'Seeing Double' and self.ability.x_mult > 1 and … -- 泛化
 * if self.ability.t_mult > 0 and next(poker_hands[type]) then …             -- 泛化
 * if self.ability.t_chips > 0 and next(poker_hands[type]) then …            -- 泛化
 * ```
 *
 * 那三条泛化判定覆盖了 Jolly/Zany/Mad/Crazy/Droll（`t_mult`）与
 * Sly/Wily/Clever/Devious/Crafty（`t_chips`）共 10 张，它们在 `P_CENTERS` 里
 * **没有任何专属代码**。而且它们**排在所有名字判定之前**，顺序有观测后果：
 * `Joker Stencil` 的名字分支在泛化 `x_mult > 1` 之后，一旦它的 `x_mult` 被抬上去，
 * 泛化那条就先命中、名字那条永远走不到。所以这四条必须按原序摆在查表之前。
 *
 * ## 不变量
 *
 * **一次调用最多产出一个 effect。** 原文靠 `return` 保证，这里靠每个 handler
 * 返回 `JokerEffect | null` 保证。破了它会在一次结算里把同一张小丑算两遍。
 */

import { type Card, type Suit, getId, isFace, isSuit } from '../card';
import { blueprintTarget } from './derived';
import { smearedMatches } from './modifiers';
import type { HandName } from '../poker-hands';
import { JOKER_CENTERS, JOKER_KEYS_BY_ORDER } from './centers.generated';
import type { GameView, Joker, JokerContext, JokerEffect } from './types';

/** `next(context.poker_hands[type])` —— 那一档有没有命中。 */
function hasHand(context: JokerContext, type: HandName | ''): boolean {
    if (type === '') return false;
    const parts = context.poker_hands?.[type];
    return !!parts && parts.length > 0;
}

/**
 * 原作每处 `pseudorandom('x') < G.GAME.probabilities.normal/odds` 的那条判定。
 *
 * `probabilities.normal` 基线是 1，**每张 `Oops! All 6s` 把它 ×2**
 * （`card.lua:608` 对 `probabilities` 里每一项都 ×2）。所以它不是常量，
 * 由 `modifiers.ts` 从小丑区算出来塞进 `GameView`。
 */
function rollOdds(game: GameView, key: string, odds: number): boolean {
    return game.pseudorandom(key) < game.probabilities.normal / odds;
}

/** `Pareidolia`（所有牌都算人头牌）。原文用 `find_joker`，这里现算。 */
export function hasPareidolia(jokers: Joker[]): boolean {
    return jokers.some((j) => !j.debuff && j.ability.name === 'Pareidolia');
}

function faceCheck(card: Card, game: GameView | undefined): boolean {
    return isFace(card, game ? hasPareidolia(game.jokers) : false);
}

// ————————————————————————————————————————————————————————————————
// context.individual && cardarea == G.play —— `card.lua:3069`
// 逐张计分牌。**顺序照原文**，虽然名字唯一、顺序不影响结果。
// ————————————————————————————————————————————————————————————————

type Handler = (self: Joker, context: JokerContext, game: GameView) => JokerEffect | null;

const INDIVIDUAL_PLAY: Record<string, Handler> = {
    // `card.lua:3096`
    Photograph: (self, context) => {
        let firstFace: Card | null = null;
        for (const card of context.scoring_hand ?? []) {
            if (isFace(card)) {
                firstFace = card;
                break;
            }
        }
        if (context.other_card === firstFace) {
            return { x_mult: self.ability.extra, card: self };
        }
        return null;
    },

    // `card.lua:3139`
    'Scary Face': (self, context, game) =>
        faceCheck(context.other_card!, game) ? { chips: self.ability.extra, card: self } : null,

    // `card.lua:3146`
    'Smiley Face': (self, context, game) =>
        faceCheck(context.other_card!, game) ? { mult: self.ability.extra, card: self } : null,

    // `card.lua:3162`
    Scholar: (self, context) =>
        getId(context.other_card!) === 14
            ? { chips: self.ability.extra.chips, mult: self.ability.extra.mult, card: self }
            : null,

    // `card.lua:3170`。10 或 4——**不是 10 与 J/Q/K**
    'Walkie Talkie': (self, context) => {
        const id = getId(context.other_card!);
        return id === 10 || id === 4
            ? { chips: self.ability.extra.chips, mult: self.ability.extra.mult, card: self }
            : null;
    },

    // `card.lua:3178`。命中才掷点——**掷点在 `is_face` 之后**，
    // 所以非人头牌不消耗 RNG。顺序错了整条 seed 链就会分叉。
    'Business Card': (self, context, game) => {
        if (!faceCheck(context.other_card!, game)) return null;
        if (!rollOdds(game, 'business', self.ability.extra)) return null;
        // 原文这里还有 `G.GAME.dollar_buffer = dollar_buffer + 2`。**这里刻意不写。**
        // 那个 buffer 的唯一用途是：原作的 `ease_dollars` 是**入队延迟**的，
        // 而 Bull 在同一次结算的后面读 `dollars`，读到的还是旧值，
        // 所以要用 buffer 把「在路上的钱」补上。本复刻的 ease 是同步立即的，
        // `dollars` 已经是最新值，再加 buffer 就会把这 2 块算两遍。
        return { dollars: 2, card: self };
    },

    // `card.lua:3199`。`id >= 0 and id <= 10 and id % 2 == 0`
    'Even Steven': (self, context) => {
        const id = getId(context.other_card!);
        return id <= 10 && id >= 0 && id % 2 === 0 ? { mult: self.ability.extra, card: self } : null;
    },

    // `card.lua:3209`。奇数 ≤10 **或者 A（14）**——A 在这里算奇数
    'Odd Todd': (self, context) => {
        const id = getId(context.other_card!);
        const odd = id <= 10 && id >= 0 && id % 2 === 1;
        return odd || id === 14 ? { chips: self.ability.extra, card: self } : null;
    },

    // `card.lua:3070`。给这张牌**永久** +5 筹码（`perma_bonus` 跟着牌走，不是本手）
    Hiker: (self, context) => {
        context.other_card!.perma_bonus += self.ability.extra;
        return { message: 'upgrade', card: self };
    },

    // `card.lua:3087`。2 号牌让它自己的筹码永久长一档
    'Wee Joker': (self, context) => {
        if (getId(context.other_card!) !== 2) return null;
        if (context.blueprint) return null;
        self.ability.extra.chips += self.ability.extra.chip_mod;
        return { message: 'upgrade', card: self };
    },

    // `card.lua:3129`。点数与花色**都要**撞上本回合的 idol 牌
    'The Idol': (self, context, game) => {
        const idol = game.current_round.idol_card;
        if (!idol) return null;
        if (getId(context.other_card!) !== idol.id) return null;
        if (!matchesSuit(context.other_card!, idol.suit, game)) return null;
        return { x_mult: self.ability.extra, card: self };
    },

    // `card.lua:3186`。斐波那契数列：A/2/3/5/8
    Fibonacci: (self, context) => {
        const id = getId(context.other_card!);
        return id === 2 || id === 3 || id === 5 || id === 8 || id === 14
            ? { mult: self.ability.extra, card: self }
            : null;
    },

    // `card.lua:3229`。方块 → 钱
    'Rough Gem': (self, context, game) =>
        matchesSuit(context.other_card!, 'Diamonds', game)
            ? { dollars: self.ability.extra, card: self }
            : null,

    // `card.lua:3236`。梅花 → mult
    'Onyx Agate': (self, context, game) =>
        matchesSuit(context.other_card!, 'Clubs', game)
            ? { mult: self.ability.extra, card: self }
            : null,

    // `card.lua:3243`。黑桃 → 筹码
    Arrowhead: (self, context, game) =>
        matchesSuit(context.other_card!, 'Spades', game)
            ? { chips: self.ability.extra, card: self }
            : null,

    // `card.lua:3250`。红桃 + 掷点 → x_mult。**掷点在花色判定之后**，
    // 所以非红桃不消耗 RNG
    Bloodstone: (self, context, game) => {
        if (!matchesSuit(context.other_card!, 'Hearts', game)) return null;
        if (!rollOdds(game, 'bloodstone', self.ability.extra.odds)) return null;
        return { x_mult: self.ability.extra.Xmult, card: self };
    },

    // `card.lua:3258`。撞上本回合的 ancient 花色
    'Ancient Joker': (self, context, game) =>
        matchesSuit(context.other_card!, game.current_round.ancient_suit ?? 'Spades', game)
            ? { x_mult: self.ability.extra, card: self }
            : null,

    // `card.lua:3265`。Q（12）或 K（13）
    Triboulet: (self, context) => {
        const id = getId(context.other_card!);
        return id === 12 || id === 13 ? { x_mult: self.ability.extra, card: self } : null;
    },
};

/**
 * `card.lua:4067` 的 `Card:is_suit`，带上 `Smeared Joker`。
 *
 * **不要直接用 `isSuit`**：`Smeared Joker` 让红桃认方块、黑桃认梅花，
 * 而那是「两者是否同为红色」而不是「花色相同」（见 `modifiers.ts` 的
 * `smearedMatches`）。漏掉它，带 Smeared 时所有花色型小丑都少算一半。
 */
function matchesSuit(card: Card, wanted: Suit, game: GameView): boolean {
    if (card.debuff) return false;
    if (isSuit(card, wanted)) return true;
    return game.smeared === true && smearedMatches(card.base.suit, wanted);
}

/**
 * `card.lua:3218`：`if self.ability.effect == 'Suit Mult' and other_card:is_suit(extra.suit)`。
 *
 * 这一条**按 effect 而不是按名字**分发，一次覆盖
 * Greedy / Lusty / Wrathful / Gluttonous 四张。放在名字表之后，与原文同序。
 */
function suitMult(self: Joker, context: JokerContext, game: GameView): JokerEffect | null {
    if (self.ability.effect !== 'Suit Mult') return null;
    if (!matchesSuit(context.other_card!, self.ability.extra.suit, game)) return null;
    return { mult: self.ability.extra.s_mult, card: self };
}

// ————————————————————————————————————————————————————————————————
// context.individual && cardarea == G.hand —— `card.lua:3274`
// 留在手里的牌。**每条都要先查 other_card.debuff**——原文对 debuff 的牌
// 返回一条只有 message 的 effect（不加数值但**照样播提示**），不是直接跳过。
// ————————————————————————————————————————————————————————————————

const DEBUFFED: JokerEffect = { message: 'debuffed' };

const INDIVIDUAL_HAND: Record<string, Handler> = {
    // `card.lua:3275`。Q（12）→ +13 mult。**13 是写死的字面量，不是 extra**
    'Shoot the Moon': (self, context) => {
        if (getId(context.other_card!) !== 12) return null;
        if (context.other_card!.debuff) return { ...DEBUFFED, card: self };
        return { h_mult: 13, card: self };
    },

    // `card.lua:3290`。K（13）→ x_mult
    Baron: (self, context) => {
        if (getId(context.other_card!) !== 13) return null;
        if (context.other_card!.debuff) return { ...DEBUFFED, card: self };
        return { x_mult: self.ability.extra, card: self };
    },

    // `card.lua:3305`。**掷点在 debuff 判定之前**——被 debuff 的人头牌照样消耗 RNG
    'Reserved Parking': (self, context, game) => {
        if (!faceCheck(context.other_card!, game)) return null;
        if (!rollOdds(game, 'parking', self.ability.extra.odds)) return null;
        if (context.other_card!.debuff) return { ...DEBUFFED, card: self };
        // 同 Business Card：不写 dollar_buffer
        return { dollars: self.ability.extra.dollars, card: self };
    },

    // `card.lua:3323`。手里点数最低的那张 → h_mult = 2 × 它的 nominal。
    // **`temp_ID >= base.id` 用的是 >=，所以并列时取最后一张**，别改成 >。
    'Raised Fist': (self, context, game) => {
        let tempMult = 15;
        let tempId = 15;
        let raised: Card | null = null;
        for (const card of game.handCards) {
            if (tempId >= card.base.id) {
                tempMult = card.base.nominal;
                tempId = card.base.id;
                raised = card;
            }
        }
        if (raised !== context.other_card) return null;
        if (context.other_card!.debuff) return { ...DEBUFFED, card: self };
        return { h_mult: 2 * tempMult, card: self };
    },
};

// ————————————————————————————————————————————————————————————————
// context.repetition —— `card.lua:3345`
// ————————————————————————————————————————————————————————————————

const REPETITION_PLAY: Record<string, Handler> = {
    // `card.lua:3347`
    'Sock and Buskin': (self, context, game) =>
        faceCheck(context.other_card!, game)
            ? { message: 'again', repetitions: self.ability.extra, card: self }
            : null,

    // `card.lua:3355`。**只对 scoring_hand 的第一张**（最左边那张）
    'Hanging Chad': (self, context) =>
        context.other_card === context.scoring_hand?.[0]
            ? { message: 'again', repetitions: self.ability.extra, card: self }
            : null,

    // `card.lua:3363`。最后一手（hands_left 已经被 ease_hands_played 减过了）
    Dusk: (self, _context, game) =>
        game.current_round.hands_left === 0
            ? { message: 'again', repetitions: self.ability.extra, card: self }
            : null,

    // `card.lua:3370`。repetitions 是写死的 1，不读 extra
    Seltzer: (self) => ({ message: 'again', repetitions: 1, card: self }),

    // `card.lua:3377`。2/3/4/5
    Hack: (self, context) => {
        const id = getId(context.other_card!);
        return id === 2 || id === 3 || id === 4 || id === 5
            ? { message: 'again', repetitions: self.ability.extra, card: self }
            : null;
    },
};

const REPETITION_HAND: Record<string, Handler> = {
    // `card.lua:3389`。只在「这张手牌本来就有效果」时才重复——
    // `next(card_effects[1]) or #card_effects > 1`
    Mime: (self, context) => {
        const effects = context.card_effects ?? [];
        const firstNonEmpty = effects[0] && Object.keys(effects[0]).length > 0;
        if (!firstNonEmpty && effects.length <= 1) return null;
        return { message: 'again', repetitions: self.ability.extra, card: self };
    },
};

// ————————————————————————————————————————————————————————————————
// context.before —— `card.lua:3414`。出牌前的小丑遍历（管线第 6 步）
// 这里是**自增型小丑长个子的地方**，所以每条都带 `not context.blueprint`。
// ————————————————————————————————————————————————————————————————

const BEFORE: Record<string, Handler> = {
    // `card.lua:3415`
    'Spare Trousers': (self, context) => {
        if (context.blueprint) return null;
        if (!hasHand(context, 'Two Pair') && !hasHand(context, 'Full House')) return null;
        self.ability.mult += self.ability.extra;
        return { message: 'upgrade', card: self };
    },

    // `card.lua:3423`。掷中就升级当前牌型
    'Space Joker': (self, _context, game) =>
        rollOdds(game, 'space', self.ability.extra)
            ? { card: self, level_up: true, message: 'level_up' }
            : null,

    // `card.lua:3430`。**恰好 4 张**才长，不是 ≤4
    'Square Joker': (self, context) => {
        if (context.blueprint) return null;
        if ((context.full_hand?.length ?? 0) !== 4) return null;
        self.ability.extra.chips += self.ability.extra.chip_mod;
        return { message: 'upgrade', card: self };
    },

    // `card.lua:3438`
    Runner: (self, context) => {
        if (context.blueprint) return null;
        if (!hasHand(context, 'Straight')) return null;
        self.ability.extra.chips += self.ability.extra.chip_mod;
        return { message: 'upgrade', card: self };
    },

    // `card.lua:3494`
    // 注意：**before 循环不消费返回值里的 `dollars`**（`state_events.lua:655-670`
    // 只看 `level_up`），所以这钱得自己加——原文也是自己调 `ease_dollars`。
    'To Do List': (self, context, game) => {
        if (context.scoring_name !== self.ability.to_do_poker_hand) return null;
        game.dollars += self.ability.extra.dollars;
        return { message: `$${self.ability.extra.dollars}`, dollars: self.ability.extra.dollars };
    },

    // `card.lua:3528`。有人头牌就**清零**，没有才 +1。
    // 清零时只在「原本非零」的情况下回一条提示——原文用 last_mult 记的
    'Ride the Bus': (self, context) => {
        if (context.blueprint) return null;
        const faces = (context.scoring_hand ?? []).some((c) => isFace(c));
        if (faces) {
            const lastMult = self.ability.mult;
            self.ability.mult = 0;
            if (lastMult > 0) return { card: self, message: 'reset' };
            return null;
        }
        self.ability.mult += self.ability.extra;
        return null;
    },

    // `card.lua:3547`。打的是**本局最常用之外**的牌型就长，否则打回 1。
    // 判据是「有没有别的可见牌型打得不比这个少」——注意是 `>=` 而不是 `>`
    Obelisk: (self, context, game) => {
        if (context.blueprint) return null;
        const playMoreThan = game.hands[context.scoring_name!].played;
        let reset = true;
        for (const [name, info] of Object.entries(game.hands)) {
            if (name !== context.scoring_name && info.played >= playMoreThan && info.visible) {
                reset = false;
            }
        }
        if (reset) {
            if (self.ability.x_mult > 1) {
                self.ability.x_mult = 1;
                return { card: self, message: 'reset' };
            }
            return null;
        }
        self.ability.x_mult += self.ability.extra;
        return null;
    },

    // `card.lua:3566`。无条件 +1，每次出牌都长
    'Green Joker': (self, context) => {
        if (context.blueprint) return null;
        self.ability.mult += self.ability.extra.hand_add;
        return { card: self, message: `+${self.ability.extra.hand_add}` };
    },
};

// ————————————————————————————————————————————————————————————————
// context.after —— `card.lua:3573`。出牌结算完之后，衰减型小丑掉一格
// ————————————————————————————————————————————————————————————————

/**
 * `Popcorn` 在 `card.lua:2948` 那条是**回合结算**的衰减，不在 after 分支里，
 * 所以这张表里没有它。出牌后什么都不掉。
 */
const AFTER: Record<string, Handler> = {
    // `card.lua:3574`。掉到 0 就自毁。自毁本身由调用方处理，这里只回 message
    'Ice Cream': (self, context) => {
        if (context.blueprint) return null;
        if (self.ability.extra.chips - self.ability.extra.chip_mod <= 0) {
            return { message: 'melted', card: self };
        }
        self.ability.extra.chips -= self.ability.extra.chip_mod;
        return { message: `-${self.ability.extra.chip_mod}`, card: self };
    },

};

// ————————————————————————————————————————————————————————————————
// context.discard —— `card.lua:2760`。弃牌时逐张问一遍
//
// **调用形状与结算不一样**：弃牌那条路径（`state_events.lua:405`
// `discard_cards_from_highlighted`）对**每一张被弃的牌**问一次每张小丑，
// `context.other_card` 是那张牌、`context.full_hand` 是整批被弃的牌。
// 好几张小丑靠 `other_card == full_hand[#full_hand]`（**最后一张**）
// 来做「整批只触发一次」，所以那个判定不能简化成「第一次调用」。
// ————————————————————————————————————————————————————————————————

const DISCARD: Record<string, Handler> = {
    // `card.lua:2828`。弃掉的牌点数撞上本回合的 mail_card 就给钱
    'Mail-In Rebate': (self, context, game) => {
        if (context.other_card!.debuff) return null;
        if (game.current_round.mail_card === undefined) return null;
        if (getId(context.other_card!) !== game.current_round.mail_card) return null;
        game.dollars += self.ability.extra;
        return { message: `$${self.ability.extra}`, dollars: self.ability.extra, card: self };
    },

    // `card.lua:2849`。**每弃一批扣 1**（靠「最后一张」判定），不是每张扣 1。
    // `math.max(0, …)` 会把它压在 0，所以扣不成负数
    'Green Joker': (self, context) => {
        if (context.blueprint) return null;
        if (context.other_card !== context.full_hand?.[context.full_hand.length - 1]) return null;
        const prev = self.ability.mult;
        self.ability.mult = Math.max(0, self.ability.mult - self.ability.extra.discard_sub);
        if (self.ability.mult === prev) return null;
        return { message: `-${self.ability.extra.discard_sub}`, card: self };
    },

    // `card.lua:2837`。弃掉 J（11）就让 x_mult 长一档
    'Hit the Road': (self, context) => {
        if (context.blueprint) return null;
        if (context.other_card!.debuff) return null;
        if (getId(context.other_card!) !== 11) return null;
        self.ability.x_mult += self.ability.extra;
        return { message: `X${self.ability.x_mult}`, card: self };
    },

    // `card.lua:2818`。弃掉本回合 castle 花色的牌就让筹码长一档
    Castle: (self, context, game) => {
        if (context.blueprint) return null;
        if (context.other_card!.debuff) return null;
        if (!matchesSuit(context.other_card!, game.current_round.castle_suit ?? 'Spades', game)) {
            return null;
        }
        self.ability.extra.chips += self.ability.extra.chip_mod;
        return { message: 'upgrade', card: self };
    },

    // `card.lua:2861`。整批里人头牌 ≥3 张就给 $5。
    // 注意原文 `return`（无值）在给钱之后——钱是在事件里加的，不走返回值
    'Faceless Joker': (self, context, game) => {
        if (context.other_card !== context.full_hand?.[context.full_hand.length - 1]) return null;
        const faces = (context.full_hand ?? []).filter((v) => isFace(v)).length;
        if (faces < self.ability.extra.faces) return null;
        game.dollars += self.ability.extra.dollars;
        return { message: `$${self.ability.extra.dollars}`, card: self };
    },
};

// ————————————————————————————————————————————————————————————————
// context.end_of_round —— `card.lua:2877`。回合结算
//
// 这里有三张小丑会**销毁自己**。原作直接 `G.jokers:remove_card(self)` 入队，
// 复刻件改成回一个 `destroy` 标志——理由见 `JokerEffect.destroy` 的注释。
// ————————————————————————————————————————————————————————————————

const END_OF_ROUND: Record<string, Handler> = {
    // `card.lua:2948`。**先判会不会掉到 0、再减**——顺序反了会多活一个回合
    Popcorn: (self, context) => {
        if (context.blueprint) return null;
        if (self.ability.mult - self.ability.extra <= 0) {
            return { message: 'eaten', card: self, destroy: true };
        }
        self.ability.mult -= self.ability.extra;
        return { message: `-${self.ability.extra}`, card: self };
    },

    // `card.lua:2988`。卖价 +3（原作走 `extra_value` 再 `set_cost`）
    Egg: (self) => {
        self.sell_cost += self.ability.extra;
        return { message: 'val_up', card: self };
    },

    // `card.lua:3011`。每回合把 x_mult 打回 1
    'Hit the Road': (self) => {
        if (self.ability.x_mult <= 1) return null;
        self.ability.x_mult = 1;
        return { message: 'reset', card: self };
    },

    // `card.lua:3045`。分数达到需求的 25% 就免死一次，然后自毁。
    // **只在 `game_over` 时才问**——平时回合结算不触发
    'Mr. Bones': (self, _context, game) => {
        if (!game.game_over) return null;
        if (game.blindProgress < 0.25) return null;
        return { message: 'saved', card: self, destroy: true, saved: true };
    },

    // `card.lua:3022`。两张共用一条，只有 seed key 不同。
    // **掷点是无条件的**：不管中不中都消耗一次 RNG
    'Gros Michel': (self, _context, game) => grosMichel(self, game),
    Cavendish: (self, _context, game) => grosMichel(self, game),
};

/**
 * `card.lua:3399` 的 `context.other_joker` 分支。
 *
 * 形状与别的分支不同：**内层遍历的是整个小丑区**，每张都拿
 * `other_joker = 当前被结算的那张` 问一遍（`state_events.lua:939`）。
 * 所以 `self` 是「提供效果的那张」、`context.other_joker` 是「被看的那张」。
 */
const OTHER_JOKER: Record<string, Handler> = {
    // `card.lua:3400`。**每张 rarity 2 的小丑**给 ×1.5，且不算自己
    'Baseball Card': (self, context) => {
        if (context.other_joker!.center.rarity !== 2) return null;
        if (self === context.other_joker) return null;
        return { message: `X${self.ability.extra}`, Xmult_mod: self.ability.extra };
    },
};

/** `card.lua:2758` 的 `context.selling_card`。 */
const SELLING_CARD: Record<string, Handler> = {
    // `card.lua:2759`。卖掉别的牌就让 x_mult 长一档
    Campfire: (self, context) => {
        if (context.blueprint) return null;
        self.ability.x_mult += self.ability.extra;
        return { message: `X${self.ability.x_mult}`, card: self };
    },
};

/** `button_callbacks.lua:3010` 的 `context.reroll_shop`。 */
const REROLL_SHOP: Record<string, Handler> = {
    // 重掷一次就 +2 mult
    'Flash Card': (self, context) => {
        if (context.blueprint) return null;
        self.ability.mult += self.ability.extra;
        return { message: `+${self.ability.extra}`, card: self };
    },
};

/** `card.lua:2745` 的 `context.pre_discard`。 */
const PRE_DISCARD: Record<string, Handler> = {
    // `card.lua:2752`。本回合**第一次**弃牌时把弃掉那手的牌型升一级。
    // `not context.hook` —— The Hook 逼出来的那次弃牌不算
    'Burnt Joker': (self, context) => {
        if (context.hook) return null;
        if ((context.discardsUsed ?? 0) > 0) return null;
        return { message: 'upgrade', card: self, levelUpDiscarded: true };
    },
};

function grosMichel(self: Joker, game: GameView): JokerEffect {
    const key = self.ability.name === 'Cavendish' ? 'cavendish' : 'gros_michel';
    if (game.pseudorandom(key) < game.probabilities.normal / self.ability.extra.odds) {
        return {
            message: 'extinct',
            card: self,
            destroy: true,
            grosMichelExtinct: self.ability.name === 'Gros Michel',
        };
    }
    return { message: 'safe', card: self };
}

// ————————————————————————————————————————————————————————————————
// main 分支 —— `card.lua:3634`。管线第 15 步，小丑区主遍历
// ————————————————————————————————————————————————————————————————

const MAIN: Record<string, Handler> = {
    // `card.lua:3675`。**`#full_hand <= extra.size`——看的是打出的总张数，不是计分张数**
    'Half Joker': (self, context) =>
        (context.full_hand?.length ?? 0) <= self.ability.extra.size
            ? { message: `+${self.ability.extra.mult}`, mult_mod: self.ability.extra.mult }
            : null,

    // `card.lua:3681`。数的是小丑区里 `set == 'Joker'` 的张数，**包括自己**
    'Abstract Joker': (self, _context, game) => {
        const x = game.jokers.filter((j) => j.ability.set === 'Joker').length;
        return { message: `+${x * self.ability.extra}`, mult_mod: x * self.ability.extra };
    },

    // `card.lua:3691`
    Acrobat: (self, _context, game) =>
        game.current_round.hands_left === 0
            ? { message: `X${self.ability.extra}`, Xmult_mod: self.ability.extra }
            : null,

    // `card.lua:3697`。`discards_left == extra.d_remaining`（0）——**相等，不是 <=**
    'Mystic Summit': (self, _context, game) =>
        game.current_round.discards_left === self.ability.extra.d_remaining
            ? { message: `+${self.ability.extra.mult}`, mult_mod: self.ability.extra.mult }
            : null,

    // `card.lua:3703`。**每次结算都掷一次**，即使结果不影响别的东西
    Misprint: (self, _context, game) => {
        const tempMult = game.pseudorandom('misprint', self.ability.extra.min, self.ability.extra.max);
        return { message: `+${tempMult}`, mult_mod: tempMult };
    },

    // `card.lua:3710`。`discards_left > 0` 才给
    Banner: (self, _context, game) =>
        game.current_round.discards_left > 0
            ? {
                  message: `+${game.current_round.discards_left * self.ability.extra}`,
                  chip_mod: game.current_round.discards_left * self.ability.extra,
              }
            : null,

    // `card.lua:3734`。读的是**本局累计**打出次数，而且第 3 步已经 ++ 过了
    Supernova: (_self, context, game) => {
        const played = game.hands[context.scoring_name!].played;
        return { message: `+${played}`, mult_mod: played };
    },

    // `card.lua:3890`。牌堆剩余 × extra
    'Blue Joker': (self, _context, game) =>
        game.deckCount > 0
            ? {
                  message: `+${game.deckCount * self.ability.extra}`,
                  chip_mod: game.deckCount * self.ability.extra,
              }
            : null,

    // `card.lua:3904` / `:3911` / `:3918`。三张自增型，读自己攒下来的 extra.chips
    'Square Joker': (self) => ({
        message: `+${self.ability.extra.chips}`,
        chip_mod: self.ability.extra.chips,
    }),
    Runner: (self) => ({
        message: `+${self.ability.extra.chips}`,
        chip_mod: self.ability.extra.chips,
    }),
    'Ice Cream': (self) => ({
        message: `+${self.ability.extra.chips}`,
        chip_mod: self.ability.extra.chips,
    }),

    // `card.lua:3939`。钱 > 0 才给，算的是 `dollars + dollar_buffer`
    Bull: (self, _context, game) => {
        const money = game.dollars + game.dollar_buffer;
        return money > 0
            ? { message: `+${money * self.ability.extra}`, chip_mod: money * self.ability.extra }
            : null;
    },

    // `card.lua:3977` / `:3983` / `:3990` / `:3995` / `:4007` / `:4013` / `:4037`
    // ——一组「读 ability.mult，非零才给」的自增型，原文逐个写了一遍
    Swashbuckler: (self) => flatMult(self),
    Joker: (self) => flatMult(self, true),
    'Spare Trousers': (self) => flatMult(self),
    'Ride the Bus': (self) => flatMult(self),
    Popcorn: (self) => flatMult(self),
    'Green Joker': (self) => flatMult(self),
    'Red Card': (self) => flatMult(self),

    // `card.lua:4019`。用过的塔罗张数
    'Fortune Teller': (_self, _context, game) => {
        const tarots = game.consumeable_usage_tarot;
        return tarots > 0 ? { message: `+${tarots}`, mult_mod: tarots } : null;
    },

    // `card.lua:3810`。计分牌里四种花色**齐全**才给
    'Flower Pot': (self, context, game) => {
        const suits: Suit[] = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
        const covered = suits.every((suit) =>
            (context.scoring_hand ?? []).some((card) => matchesSuit(card, suit, game)),
        );
        return covered ? { message: `X${self.ability.extra}`, Xmult_mod: self.ability.extra } : null;
    },

    // `card.lua:3842`。**至少一张梅花** + 至少一张非梅花。
    // 注意原文的条件是 `(Hearts>0 or Diamonds>0 or Spades>0) and Clubs>0`——
    // 梅花是必需的那一方，不能写成「任意两种花色」
    'Seeing Double': (self, context, game) => {
        const scoring = context.scoring_hand ?? [];
        const clubs = scoring.some((c) => matchesSuit(c, 'Clubs', game));
        const other = (['Hearts', 'Diamonds', 'Spades'] as Suit[]).some((suit) =>
            scoring.some((c) => matchesSuit(c, suit, game)),
        );
        return clubs && other
            ? { message: `X${self.ability.extra}`, Xmult_mod: self.ability.extra }
            : null;
    },

    // `card.lua:3876` / `:3884`。两张自增型，读自己攒下来的 extra.chips
    'Wee Joker': (self) => ({
        message: `+${self.ability.extra.chips}`,
        chip_mod: self.ability.extra.chips,
    }),
    Castle: (self) =>
        self.ability.extra.chips > 0
            ? { message: `+${self.ability.extra.chips}`, chip_mod: self.ability.extra.chips }
            : null,

    // `card.lua:3897`。起始牌组张数 - 现在的张数，每少一张 +4 mult
    Erosion: (self, _context, game) => {
        const missing = game.startingDeckSize - game.playingCardCount;
        return missing > 0
            ? { message: `+${self.ability.extra * missing}`, mult_mod: self.ability.extra * missing }
            : null;
    },

    // `card.lua:3954`。**手里全是黑色花色**才给（手里没牌也算「全是」）
    Blackboard: (self, _context, game) => {
        const allBlack = game.handCards.every(
            (card) => matchesSuit(card, 'Clubs', game) || matchesSuit(card, 'Spades', game),
        );
        return allBlack ? { message: `X${self.ability.extra}`, Xmult_mod: self.ability.extra } : null;
    },

    // `card.lua:3969`。**还有空格子**才给，倍率是 `derived.ts` 重算出来的
    'Joker Stencil': (self, _context, game) =>
        game.joker_slots - game.jokers.length > 0
            ? { message: `X${self.ability.x_mult}`, Xmult_mod: self.ability.x_mult }
            : null,

    // `card.lua:3729`。`blind.triggered` —— Boss 的 debuff 本手触发过就给钱
    Matador: (self, _context, game) => {
        if (!game.blindTriggered) return null;
        game.dollars += self.ability.extra;
        return { message: `$${self.ability.extra}`, dollars: self.ability.extra };
    },

    // `card.lua:4043`。本回合**这个牌型**打过不止一次
    'Card Sharp': (_self, context, game) =>
        game.hands[context.scoring_name!].played_this_round > 1
            ? {
                  message: `X${_self.ability.extra.Xmult}`,
                  Xmult_mod: _self.ability.extra.Xmult,
              }
            : null,

    // `card.lua:4049`。每满 $5 给 +2 mult
    Bootstraps: (self, _context, game) => {
        const steps = Math.floor((game.dollars + game.dollar_buffer) / self.ability.extra.dollars);
        if (steps < 1) return null;
        return {
            message: `+${self.ability.extra.mult * steps}`,
            mult_mod: self.ability.extra.mult * steps,
        };
    },

    // `card.lua:3757`。手里没牌时给筹码（-2 手牌上限在 `modifiers.ts`）
    Stuntman: (self) => ({
        message: `+${self.ability.extra.chip_mod}`,
        chip_mod: self.ability.extra.chip_mod,
    }),

    // `card.lua:4025` / `:4031`。两张纯倍率，不带条件
    'Gros Michel': (self) => ({
        message: `+${self.ability.extra.mult}`,
        mult_mod: self.ability.extra.mult,
    }),
    Cavendish: (self) => ({
        message: `X${self.ability.extra.Xmult}`,
        Xmult_mod: self.ability.extra.Xmult,
    }),
};

/**
 * 那一组「`ability.mult` 非零就给」的写法。
 * `Joker` 是唯一**不带 `> 0` 判定**的（它的 mult 是常数 4），所以单独标出来。
 */
function flatMult(self: Joker, unconditional = false): JokerEffect | null {
    if (!unconditional && !(self.ability.mult > 0)) return null;
    return { message: `+${self.ability.mult}`, mult_mod: self.ability.mult };
}

// ————————————————————————————————————————————————————————————————
// 入口
// ————————————————————————————————————————————————————————————————

/**
 * `card.lua:2294` `Card:calculate_joker`。
 *
 * 外层分支顺序照抄原文的 if/elseif 链：
 * `individual` → `repetition` → `other_joker` → `else`（`cardarea == jokers` 下再分
 * `before` / `after` / main）。
 */
export function calculateJoker(
    self: Joker,
    context: JokerContext,
    game: GameView,
): JokerEffect | null {
    // `card.lua:2295`：被 debuff 的小丑一律不算
    if (self.debuff) return null;

    const name = self.ability.name;

    // `card.lua:2308`：蓝图与头脑风暴**在 context 分派之前**就拦下来，
    // 所以它们对每一种 context 都生效——不是只在主遍历时复制
    if (name === 'Blueprint' || name === 'Brainstorm') {
        return copycat(self, context, game);
    }

    // **这两条必须排在 `individual` / `repetition` 之前**：原文的 elseif 链里
    // `context.discard`（`card.lua:2760`）与 `context.end_of_round`（`:2877`）
    // 都在它们前面，而 `end_of_round` + `individual` 是个**真实存在的组合**
    // （原文在 end_of_round 内部再分 individual / repetition 两个子情形）。
    // 顺序反了，回合结算的逐张型调用会被误路由进出牌结算的那张表。
    // 原文 elseif 链里排在 `discard` 之前的那些分支。本里程碑**没有一张小丑用它们**
    // （`Luchador` / `Campfire` / `Flash Card` / `Burnt Joker` 全是 rarity 2+），
    // 但**必须显式拦掉**：不拦的话这些调用会一路掉进 main 分支，
    // 在买卖／重掷／弃牌时白算一遍出牌结算。补它们时把 return null 换成对应的查表。
    if (context.selling_card) return SELLING_CARD[name]?.(self, context, game) ?? null;
    if (context.reroll_shop) return REROLL_SHOP[name]?.(self, context, game) ?? null;
    if (context.pre_discard) return PRE_DISCARD[name]?.(self, context, game) ?? null;

    // 原文 elseif 链里还有这几条，但**没有一张已实现的小丑用它们**
    // （`Luchador` 要能 disable Boss、`Diet Cola` 要标签、`Invisible Joker` 要复制小丑）。
    // 显式拦掉：不拦的话这些调用会一路掉进 main 分支，在买卖时白算一遍出牌结算
    if (context.buying_card || context.selling_self || context.ending_shop) return null;

    if (context.discard) {
        return DISCARD[name]?.(self, context, game) ?? null;
    }

    if (context.end_of_round) {
        // `card.lua:2878-2880`：`individual` 与 `repetition` 两个子分支在原文里是**空的**
        // （回合结算没有逐张型、也没有重复触发），只有第三种情形有内容
        if (context.individual || context.repetition) return null;
        return END_OF_ROUND[name]?.(self, context, game) ?? null;
    }

    if (context.individual) {
        if (context.cardarea === 'play') {
            const hit = INDIVIDUAL_PLAY[name]?.(self, context, game);
            if (hit) return hit;
            return suitMult(self, context, game);
        }
        if (context.cardarea === 'hand') {
            return INDIVIDUAL_HAND[name]?.(self, context, game) ?? null;
        }
        return null;
    }

    if (context.repetition) {
        if (context.cardarea === 'play') return REPETITION_PLAY[name]?.(self, context, game) ?? null;
        if (context.cardarea === 'hand') return REPETITION_HAND[name]?.(self, context, game) ?? null;
        return null;
    }

    if (context.other_joker) {
        return OTHER_JOKER[name]?.(self, context, game) ?? null;
    }

    if (context.cardarea !== 'jokers') return null;

    if (context.before) return BEFORE[name]?.(self, context, game) ?? null;
    if (context.after) return AFTER[name]?.(self, context, game) ?? null;

    return mainScoring(self, context, game);
}

/**
 * `card.lua:2308` 的 `Blueprint` 与 `:2325` 的 `Brainstorm`。
 *
 * 两者只差「复制谁」：Blueprint 复制**右边那一张**、Brainstorm 复制**最左边那一张**。
 * 其余完全相同，所以合成一个函数。
 *
 * ## 递归的终止条件
 *
 * 原文靠**改 context 本身**来计数：
 *
 * ```lua
 * context.blueprint = (context.blueprint and (context.blueprint + 1)) or 1
 * context.blueprint_card = context.blueprint_card or self
 * if context.blueprint > #G.jokers.cards + 1 then return end
 * ```
 *
 * 所以 `#小丑区 + 1` 层就停。为什么是这个数而不是 `#小丑区`：
 * 一串首尾相接的蓝图最多能链 `#小丑区` 张，多的那 1 是给「链到非蓝图那张」留的。
 *
 * **这里不改传进来的 context，而是造一份新的**。原文改的是同一张 Lua 表，
 * 但调用点（`evaluate_play` 的每个循环）每次都新建表字面量，所以改动不会泄漏到
 * 下一张小丑。复刻件显式拷一份，语义相同而且不依赖「调用方每次都新建」这个约定。
 *
 * ## 一处刻意不抄的
 *
 * `blueprint_compat`（`card.lua:4227`）**没有参与判定**——它只喂 UI 的提示文字。
 * 也就是说机制上蓝图会去复制「标着不兼容」的小丑，只是结果通常为空。
 * 别顺手加一个 `if (!compat) return null`，那会改变行为。
 */
function copycat(self: Joker, context: JokerContext, game: GameView): JokerEffect | null {
    const target = blueprintTarget(self, game.jokers);
    if (!target || target === self) return null;

    const depth = (context.blueprint ?? 0) + 1;
    if (depth > game.jokers.length + 1) return null;

    const inner: JokerContext = {
        ...context,
        blueprint: depth,
        // 第一张蓝图才是「效果来源」，链上后面的都归它——表现层弹的是它
        blueprint_card: context.blueprint_card ?? self,
    };

    const result = calculateJoker(target, inner, game);
    if (!result) return null;

    // `card.lua:2318`：把效果的归属改成蓝图自己
    return { ...result, card: inner.blueprint_card ?? self };
}

/**
 * main 分支。**前四条按原序写死，不进查表**——理由见文件头。
 */
function mainScoring(self: Joker, context: JokerContext, game: GameView): JokerEffect | null {
    const a = self.ability;

    // `card.lua:3635`。Loyalty Card 会 fall through 到后面的判定
    if (a.name === 'Loyalty Card') {
        a.loyalty_remaining =
            (a.extra.every - 1 - (game.hands_played - (a.hands_played_at_create ?? 0))) %
            (a.extra.every + 1);
        if (a.loyalty_remaining === a.extra.every) {
            return { message: `X${a.extra.Xmult}`, Xmult_mod: a.extra.Xmult };
        }
    }

    // `card.lua:3656`。泛化倍率。`type == ''` 表示无条件
    if (a.name !== 'Seeing Double' && a.x_mult > 1 && (a.type === '' || hasHand(context, a.type))) {
        return { message: `X${a.x_mult}`, Xmult_mod: a.x_mult };
    }

    // `card.lua:3663`。Jolly/Zany/Mad/Crazy/Droll 全靠这条
    if (a.t_mult > 0 && hasHand(context, a.type)) {
        return { message: `+${a.t_mult}`, mult_mod: a.t_mult };
    }

    // `card.lua:3669`。Sly/Wily/Clever/Devious/Crafty 全靠这条
    if (a.t_chips > 0 && hasHand(context, a.type)) {
        return { message: `+${a.t_chips}`, chip_mod: a.t_chips };
    }

    return MAIN[a.name]?.(self, context, game) ?? null;
}

// ————————————————————————————————————————————————————————————————
// 覆盖面
// ————————————————————————————————————————————————————————————————

/**
 * 在 `calculate_joker` 里有专属分支的小丑名。
 *
 * **从上面那九张表算出来，不手写名单。** 手写的名单会漂：加了 handler 忘了更名单，
 * 那张小丑就会被当成「未实现」；反过来更糟——删了 handler 名单还留着，
 * 于是一张什么都不做的小丑被报成已实现。
 */
const NAMES_WITH_HANDLERS: ReadonlySet<string> = new Set([
    // main 分支里**写在查表之前**的那些（见文件头：前四条不能进表）。
    // `Loyalty Card` 会 fall through，所以它必须留在链上、不能塞进 MAIN；
    // 这里手动补一条，否则它会被算成「未实现」。
    // `Seeing Double` 不算——它只是被泛化判定**排除**，不是被实现
    'Loyalty Card',
    ...Object.keys(INDIVIDUAL_PLAY),
    ...Object.keys(INDIVIDUAL_HAND),
    ...Object.keys(REPETITION_PLAY),
    ...Object.keys(REPETITION_HAND),
    ...Object.keys(BEFORE),
    ...Object.keys(AFTER),
    ...Object.keys(DISCARD),
    ...Object.keys(END_OF_ROUND),
    ...Object.keys(MAIN),
    ...Object.keys(OTHER_JOKER),
    ...Object.keys(SELLING_CARD),
    ...Object.keys(REROLL_SHOP),
    ...Object.keys(PRE_DISCARD),
    // `calculateJoker` 开头那条 copycat 分支，不走查表
    'Blueprint',
    'Brainstorm',
]);

/**
 * 行为**不在** `calculate_joker` 里的那些，逐条注明落在哪。
 *
 * 这几张在原作里也没有 `calculate_joker` 分支——它们靠别处的查询生效，
 * 所以「表里没有」不等于「没实现」。
 */
const IMPLEMENTED_ELSEWHERE: Readonly<Record<string, string>> = {
    // `state_events.lua:604` 的 `find_joker('Splash')`：让全部 5 张都计分
    Splash: 'scoring.ts 的第 4 步',
    // `ability.h_size` / `d_size`，在 `Round` 的构造里加进手牌上限与弃牌次数
    Juggler: 'round.ts 的 hSize',
    Drunkard: 'round.ts 的 dSize',
    // `card.lua:968` 的 `find_joker("Pareidolia")`：所有牌都算人头牌
    Pareidolia: 'calculate.ts 的 hasPareidolia',
    // `common_events.lua:2026` 的 `find_joker("Showman")`：见过的小丑重新进池
    Showman: 'shop.ts 的 getCurrentJokerPool',
    // `state_events.lua:332`：每张给一次免费重掷
    'Chaos the Clown': 'shop.ts 的 Shop.freeRerolls',
    // `card.lua:1657` 的 `calculate_dollar_bonus`
    'Golden Joker': 'economy.ts 的 calculateDollarBonus',
    'Delayed Gratification': 'economy.ts 的 calculateDollarBonus',

    // `modifiers.ts`：一进小丑区就改局面参数的那些。
    // 它们在原作里也没有 `calculate_joker` 分支——走 `add_to_deck` 与 `find_joker`
    'Four Fingers': 'modifiers.ts 的 flags.fourFingers',
    Shortcut: 'modifiers.ts 的 flags.shortcut',
    'Smeared Joker': 'modifiers.ts 的 smeared',
    'Oops! All 6s': 'modifiers.ts 的 probabilityNormal',
    'To the Moon': 'modifiers.ts 的 interestAmount',
    Troubadour: 'modifiers.ts 的 handSize / hands',
    'Merry Andy': 'modifiers.ts 的 handSize / discards',
    Burglar: 'modifiers.ts 的 burglarHands',
};

/**
 * 这张小丑的行为实现了吗。
 *
 * 三条通路，命中任一条就算实现：
 * 1. 九张 handler 表里有它的名字
 * 2. 它的 config 走 main 分支那三条**泛化判定**（`t_mult` / `t_chips` / `Xmult`）——
 *    Jolly/Zany/Mad/Crazy/Droll 与 Sly/Wily/Clever/Devious/Crafty 这 10 张
 *    在原作里也没有专属代码，全靠那三条
 * 3. 在 `IMPLEMENTED_ELSEWHERE` 里，即行为落在别的模块
 *
 * **为什么需要这个函数**：商店按设计从 150 张的全池生成，所以玩家会买到
 * 没有行为的小丑，而它「看起来完全正常、买了什么也不发生」。
 * 这跟「有数值没 debuff 的 Boss」是同一个坑，只是这次不能用抛异常挡
 * （那会让商店没法开），只能标出来。
 */
export function isJokerImplemented(key: string): boolean {
    const center = JOKER_CENTERS[key];
    if (!center) return false;
    if (NAMES_WITH_HANDLERS.has(center.name)) return true;
    if (center.name in IMPLEMENTED_ELSEWHERE) return true;

    // main 分支的三条泛化判定
    const c = center.config;
    if ((c.t_mult ?? 0) > 0) return true;
    if ((c.t_chips ?? 0) > 0) return true;
    if ((c.Xmult ?? 1) > 1) return true;

    // `effect === 'Suit Mult'` 走 individual/play 那条按 effect 分发的
    if (center.effect === 'Suit Mult') return true;

    return false;
}

/** 没有行为的小丑 key，按 `order` 排序。给测试与 UI 用。 */
export function unimplementedJokers(): string[] {
    return JOKER_KEYS_BY_ORDER.filter((key) => !isJokerImplemented(key));
}
