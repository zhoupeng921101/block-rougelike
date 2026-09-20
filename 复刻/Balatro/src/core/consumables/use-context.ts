/**
 * 用一张消耗品要读写的东西。
 *
 * 为什么是一个显式的宽接口而不是直接传 `Run`：
 * 一来 `Run` 会 import `consumables`，反向传进来就是循环依赖；
 * 二来塔罗牌**真的会动到局面的每一块**（手牌、牌组、小丑区、消耗品区、钱、RNG），
 * 把这些写出来比藏在 `Run` 里更能看清哪张卡碰了什么。
 */

import type { Card } from '../card';
import type { Joker } from '../jokers';
import { type HandInfo, type HandName, initialHands } from '../scoring';
import { makeConsumable } from './instance';
import type { Consumable, ConsumableSet } from './types';

export type UseContext = {
    hands: Record<HandName, HandInfo>;
    /** `G.hand.highlighted`——选中的手牌。换强化 / 换花色 / 销毁的目标 */
    highlighted: Card[];
    /** `G.hand.cards`——手牌区**全部**的牌。幽灵牌里好几张要扫整手 */
    handCards: Card[];
    jokers: Joker[];
    /** `G.consumeables.cards`。**注意不含正在用的这一张**（它已经被拿出来了） */
    consumables: Consumable[];
    consumableSlots: number;
    jokerSlots: number;

    getDollars(): number;
    addDollars(amount: number): void;

    /** 从整副牌里永久拿走（`The Hanged Man`） */
    removeCards(cards: Card[]): void;
    addConsumable(consumable: Consumable): void;
    addJoker(joker: Joker): void;
    /** 从小丑区拿走（`Ankh` / `Hex` 会毁掉其余的小丑） */
    removeJoker(joker: Joker): void;
    /** 造一张扑克牌进手牌与牌组（`create_playing_card`） */
    addPlayingCard(card: Card): void;
    /** `G.hand:change_size(delta)`。`Ouija` -1、`Ectoplasm` 递增地减 */
    changeHandSize(delta: number): void;

    /**
     * `create_card(set, G.consumeables, …, keyAppend)`。**消费 RNG**，
     * 由 `Run` 接到真的池子上——放在这里而不是直接 import `shop.ts`，
     * 是为了不让 `consumables/` 反向依赖 `shop.ts`（后者已经 import 前者）。
     */
    createConsumable(set: ConsumableSet, keyAppend: string): Consumable;
    /** `create_card('Joker', G.jokers, …, keyAppend)`。同样消费 RNG */
    createJoker(keyAppend: string, options?: CreateJokerOptions): Joker;
    /** 按 key 造一张（`forced_key` 那条路，**不消费 RNG**）。`The Fool` 用 */
    makeConsumable(key: string): Consumable;

    /** `G.GAME.last_tarot_planet`。`The Fool` 读它，**读的是上一张、不是自己** */
    lastTarotPlanet?: string;

    /** `G.GAME.probabilities.normal`。`The Wheel of Fortune` 的 1/4 要过它 */
    probabilities: { normal: number };
    /** 掷点。`The Wheel of Fortune` 消费 `wheel_of_fortune` 这个 key */
    pseudorandom(key: string): number;
    /**
     * `pseudorandom_element(list, pseudoseed(key))`。
     * `The Wheel of Fortune` 要从「没版本的小丑」里挑一张。
     */
    pickRandom<T>(list: T[], key: string): T | undefined;
    /** `pseudoshuffle(list, pseudoseed(key))`。`Immolate` 洗一遍手牌再毁前 5 张 */
    shuffled<T>(list: T[], key: string): T[];
    /**
     * `G.GAME.ecto_minus`：`Ectoplasm` 每用一次手牌上限多减一格
     * （`card.lua:1497`，从 1 起）。**调用一次就推进一次**。
     */
    nextEctoplasmMinus(): number;
};

/** `create_card('Joker', …)` 的两个可选实参 */
export type CreateJokerOptions = {
    /** `legendary`。`The Soul` 传真值 → rarity 4 池，**池 key 不带 append 也不带 ante** */
    legendary?: boolean;
    /** `_rarity`。给了就**不掷 rarity 点**。`Wraith` 传 0.99（> 0.95 → 稀有） */
    rarity?: number;
};

export type ConsumableSpec = {
    apply(consumable: Consumable, ctx: UseContext): void;
    /**
     * `card.lua:1523` 的 `can_use_consumeable`。缺省是「随时能用」——
     * 星球牌就是这一类（`consumeable.hand_type` 那条直接 return true）。
     */
    canUse?(consumable: Consumable, ctx: UseContext): boolean;
};

/**
 * 造一张 `UseContext`，默认值对应「回合外、什么都没有」。
 *
 * 与 `makeGameView` 同一套理由（见 `jokers/game-view.ts`）：
 * 三个造卡的口子默认**抛异常**而不是返回空——静默返回会让
 * 「这张塔罗在测试里什么也没造」无声通过，那是最难查的一类错。
 */
export function makeUseContext(overrides: Partial<UseContext> = {}): UseContext {
    const noCreate = (): never => {
        throw new Error('这个 UseContext 没有接造卡的口子，但有塔罗要造牌——显式传进来');
    };

    return {
        hands: initialHands(),
        highlighted: [],
        handCards: [],
        jokers: [],
        consumables: [],
        consumableSlots: 2,
        jokerSlots: 5,
        getDollars: () => 0,
        addDollars: () => {},
        removeCards: () => {},
        addConsumable: () => {},
        addJoker: () => {},
        removeJoker: () => {},
        addPlayingCard: () => {},
        changeHandSize: () => {},
        createConsumable: noCreate,
        createJoker: noCreate,
        makeConsumable,
        probabilities: { normal: 1 },
        pseudorandom: () => {
            throw new Error('这个 UseContext 没有接 RNG，但有塔罗要掷点——显式传进来');
        },
        pickRandom: () => {
            throw new Error('这个 UseContext 没有接 RNG，但有塔罗要抽元素——显式传进来');
        },
        shuffled: (list) => [...list],
        nextEctoplasmMinus: () => 1,
        ...overrides,
    };
}
