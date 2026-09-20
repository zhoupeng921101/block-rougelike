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

import { type Card, getId, isFace, isSuit } from '../card';
import type { HandName } from '../poker-hands';
import type { GameView, Joker, JokerContext, JokerEffect } from './types';

/** `next(context.poker_hands[type])` —— 那一档有没有命中。 */
function hasHand(context: JokerContext, type: HandName | ''): boolean {
    if (type === '') return false;
    const parts = context.poker_hands?.[type];
    return !!parts && parts.length > 0;
}

/** 原作每处 `pseudorandom('x') < G.GAME.probabilities.normal/odds` 的那条判定。 */
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
};

/**
 * `card.lua:3218`：`if self.ability.effect == 'Suit Mult' and other_card:is_suit(extra.suit)`。
 *
 * 这一条**按 effect 而不是按名字**分发，一次覆盖
 * Greedy / Lusty / Wrathful / Gluttonous 四张。放在名字表之后，与原文同序。
 */
function suitMult(self: Joker, context: JokerContext): JokerEffect | null {
    if (self.ability.effect !== 'Suit Mult') return null;
    if (!isSuit(context.other_card!, self.ability.extra.suit)) return null;
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

    // `card.lua:3022`。两张共用一条，只有 seed key 不同。
    // **掷点是无条件的**：不管中不中都消耗一次 RNG
    'Gros Michel': (self, _context, game) => grosMichel(self, game),
    Cavendish: (self, _context, game) => grosMichel(self, game),
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

    // **这两条必须排在 `individual` / `repetition` 之前**：原文的 elseif 链里
    // `context.discard`（`card.lua:2760`）与 `context.end_of_round`（`:2877`）
    // 都在它们前面，而 `end_of_round` + `individual` 是个**真实存在的组合**
    // （原文在 end_of_round 内部再分 individual / repetition 两个子情形）。
    // 顺序反了，回合结算的逐张型调用会被误路由进出牌结算的那张表。
    // 原文 elseif 链里排在 `discard` 之前的那些分支。本里程碑**没有一张小丑用它们**
    // （`Luchador` / `Campfire` / `Flash Card` / `Burnt Joker` 全是 rarity 2+），
    // 但**必须显式拦掉**：不拦的话这些调用会一路掉进 main 分支，
    // 在买卖／重掷／弃牌时白算一遍出牌结算。补它们时把 return null 换成对应的查表。
    if (
        context.buying_card ||
        context.selling_self ||
        context.selling_card ||
        context.reroll_shop ||
        context.ending_shop ||
        context.pre_discard
    ) {
        return null;
    }

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
            return suitMult(self, context);
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
        // `card.lua:3399`。本里程碑只有 Baseball Card 走这里，它是 rarity 3、不在范围。
        // 分支留着——它是「小丑影响小丑」这条形状的唯一入口。
        return null;
    }

    if (context.cardarea !== 'jokers') return null;

    if (context.before) return BEFORE[name]?.(self, context, game) ?? null;
    if (context.after) return AFTER[name]?.(self, context, game) ?? null;

    return mainScoring(self, context, game);
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
