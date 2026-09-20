/**
 * 小丑的数据模型与 context/effect 协议。
 *
 * 三个东西要分清：
 * - **center**（`JokerCenter`）：`P_CENTERS` 里那一行，**不可变的定义**，150 张
 * - **ability**（`JokerAbility`）：`card.lua:277` `set_ability` 从 center 摊平出来的**可变**运行时状态
 * - **instance**（`Joker`）：一张具体的小丑，持有 ability
 *
 * 原作把 ability 摊平成 `mult` / `t_mult` / `x_mult` / `extra` 这一组固定字段，
 * 而 `calculate_joker` 的前三条判定**直接读这些字段、不看名字**
 * （`card.lua:3656-3673`）。所以摊平不是实现细节，是语义——
 * 不能改成「每张小丑一个自己的 config 类型」，那样那三条泛化判定就没法写。
 */

import type { Card, Suit } from '../card';
import type { HandName } from '../poker-hands';

/** `P_CENTERS` 里的一行。由 `tools/gen-joker-centers.mjs` 生成，运行时只读。 */
export type JokerCenter = {
    order: number;
    rarity: number;
    cost: number;
    name: string;
    pos: { x: number; y: number };
    soul_pos?: { x: number; y: number };
    blueprint_compat: boolean;
    /**
     * 局外解锁状态。**45 张 `start_locked` 的小丑是 `false`**，
     * 而 `get_current_pool` 的剔除条件是 `v.unlocked ~= false or v.rarity == 4`——
     * 所以它们**不在新档的商店池里**，这会改变池子大小、也就改变
     * `math.random(#pool)` 的取值域。复刻件按「新档」口径走（没有局外进度系统）。
     */
    unlocked: boolean;
    /** Lua 的 `config`，字段随小丑而异，所以是 `any`——03 号票认了直译带进来的弱类型 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any>;
    effect?: string;
    /** 这个 pool_flag 置位时**退出**池子。只有 `Gros Michel`（`gros_michel_extinct`）用 */
    no_pool_flag?: string;
    /** 这个 pool_flag 置位时**才进**池子。只有 `Cavendish` 用 */
    yes_pool_flag?: string;
};

/**
 * `card.lua:277-296` 的 `self.ability`。
 *
 * **默认值逐字抄原文**：`mult` 等取 0、`x_mult` 取 **1**（不是 0）。
 * `x_mult` 的默认值是 1 这件事被三处判定依赖（`x_mult > 1` / `x_mult <= 1`），
 * 写成 0 会让所有不带 Xmult 的小丑都触发倍率分支。
 */
export type JokerAbility = {
    name: string;
    effect?: string;
    set: 'Joker';
    mult: number;
    h_mult: number;
    h_x_mult: number;
    h_dollars: number;
    p_dollars: number;
    t_mult: number;
    t_chips: number;
    x_mult: number;
    h_size: number;
    d_size: number;
    /** `copy_table(center.config.extra)`——**必须是深拷贝**，好几张小丑会原地改它 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extra: any;
    type: HandName | '';
    order: number;
    /** `Loyalty Card` 在 main 分支里自己算的中间量，原作也挂在 ability 上 */
    loyalty_remaining?: number;
    /** `Blueprint` / `Brainstorm` 指向的那张兼不兼容。由 `derived.ts` 重算 */
    blueprint_compat?: 'compatible' | 'incompatible';
    hands_played_at_create?: number;
    /** `To Do List` 每回合随机指定的牌型 */
    to_do_poker_hand?: HandName;
};

export type Joker = {
    readonly key: string;
    readonly center: JokerCenter;
    ability: JokerAbility;
    /** `card.lua:526` 的 `self.debuff`。被 debuff 的小丑 `calculate_joker` 直接返回 nil */
    debuff: boolean;
    /** 卖价。`card.lua:369` `set_cost` 算出来的 */
    sell_cost: number;
    /** 表现层排序用，单位是 tile（与 `Card.T` 同口径，见 10 号票） */
    T: { x: number; y: number; w: number; h: number };
};

/**
 * `calculate_joker(context)` 的入参。
 *
 * 原作是一张裸 Lua 表，字段按调用点随便加。这里列全**本里程碑用得到的**，
 * 其余（`open_booster` / `using_consumeable` / `skip_blind` …）等接到那些系统时再加。
 *
 * `blueprint` / `blueprint_card` **现在就要留着**：17 处小丑行为靠
 * `not context.blueprint` 来禁自我升级，缺了它们会在有蓝图之前就算错。
 */
export type JokerContext = {
    /** 哪个区在结算。`'play'` = 打出的牌、`'hand'` = 留在手里的牌、`'jokers'` = 小丑区 */
    cardarea?: 'play' | 'hand' | 'jokers';
    full_hand?: Card[];
    scoring_hand?: Card[];
    scoring_name?: HandName;
    poker_hands?: Record<HandName, Card[][]>;
    /** 逐张型结算时指向当前那一张 */
    other_card?: Card;
    other_joker?: Joker;
    individual?: boolean;
    repetition?: boolean;
    repetition_only?: boolean;
    before?: boolean;
    after?: boolean;
    edition?: boolean;
    /** 蓝图/头脑风暴的递归深度。**别删**，见上面 */
    blueprint?: number;
    blueprint_card?: Joker;
    /** `Mime` 要靠它判断「这张手牌本来有没有效果」 */
    card_effects?: JokerEffect[];
    destroying_card?: Card;
    /** 弃牌。逐张调用，`other_card` 是当前那张、`full_hand` 是整批 */
    discard?: boolean;
    /** 弃牌前的整批一次性遍历（`Burnt Joker` 用）。排在逐张循环之前 */
    pre_discard?: boolean;
    /** 买了一张牌（原文这个分支是空的，留着当落点） */
    buying_card?: boolean;
    /** 卖掉自己（`Luchador` / `Diet Cola` / `Invisible Joker`）。**在移出小丑区之前调** */
    selling_self?: boolean;
    /** 卖掉别的牌（`Campfire`） */
    selling_card?: boolean;
    /** 重掷商店（`Flash Card`） */
    reroll_shop?: boolean;
    /** 离开商店（`Perkeo` / `Invisible Joker` 的计数） */
    ending_shop?: boolean;
    /** `The Hook` 触发的额外弃牌。`Burnt Joker` 查 `not context.hook` */
    hook?: boolean;
    /** 本回合已用掉的弃牌次数。`Burnt Joker` 判「是不是第一次弃牌」 */
    discardsUsed?: number;
    /** 回合结算。`end_of_round` 与 `individual`/`repetition` 组合出三种子情形 */
    end_of_round?: boolean;
    /** 本局是否已经输了（`Mr. Bones` 读它）。不在本里程碑，但字段先留 */
    game_over?: boolean;
    /** 本回合状态的只读视图。原作直接读 `G.GAME`，这里显式传进来 */
    game?: GameView;
};

/**
 * 原作里那些 `G.GAME.xxx` 的读取点，收成一个显式的只读视图。
 *
 * 为什么不直接把 `Round` 传进来：`calculate_joker` 会被商店、回合结算、
 * Boss 盲注三个地方调用，那些场景下 `Round` 不一定存在。
 * 收成一个窄接口，调用方按需填。
 */
export type GameView = {
    hands: Record<HandName, { played: number; played_this_round: number; visible: boolean }>;
    dollars: number;
    /**
     * `G.GAME.dollar_buffer`。**本复刻里恒为 0**，只有 `Bull` 读它。
     *
     * 原作的 `ease_dollars` 是入队延迟的，所以同一次结算里后面的小丑读
     * `G.GAME.dollars` 会读到旧值，buffer 用来补上「在路上的钱」。
     * 这里的加钱是同步立即的，`dollars` 本身已经最新，buffer 必须留 0——
     * 往里加会让 Bull 把同一笔钱算两遍。字段保留是为了让 Bull 那行与原文一字对得上。
     */
    dollar_buffer: number;
    hands_played: number;
    current_round: {
        hands_left: number;
        discards_left: number;
        hands_played: number;
        /**
         * `G.GAME.current_round.mail_card`。每回合抽一个点数，`Mail-In Rebate` 读它。
         * `undefined` = 本回合没抽（小丑区里没有 Mail-In Rebate 时原作也不抽）。
         */
        mail_card?: number;
        /** `G.GAME.current_round.idol_card`。`The Idol` 读它 */
        idol_card?: { id: number; suit: Suit };
        /** `G.GAME.current_round.ancient_card.suit`。`Ancient Joker` 读它 */
        ancient_suit?: Suit;
        /** `G.GAME.current_round.castle_card.suit`。`Castle` 读它 */
        castle_suit?: Suit;
    };
    /** `G.GAME.probabilities.normal`，基线 1。优惠券能改，本里程碑恒 1 */
    probabilities: { normal: number };
    jokers: Joker[];
    joker_slots: number;
    /** 牌堆剩余张数。`Blue Joker` 读它 */
    deckCount: number;
    /**
     * 手牌区的牌。`Raised Fist` 要扫一遍整个手牌区找最低点数的那张，
     * 光有 `context.other_card` 不够——原文直接读 `G.hand.cards`。
     */
    handCards: Card[];
    /** `G.GAME.consumeable_usage_total.tarot`。`Fortune Teller` 读它，本里程碑恒 0 */
    consumeable_usage_tarot: number;
    /**
     * `Smeared Joker` 在场——红桃认方块、黑桃认梅花。
     * 由 `modifiers.ts` 从小丑区算出来，不是每张小丑自己去 `find_joker`。
     */
    smeared: boolean;
    /** `G.GAME.starting_deck_size`。`Erosion` 读它 */
    startingDeckSize: number;
    /** `#G.playing_cards`——整副牌现在剩几张。`Erosion` 读它 */
    playingCardCount: number;
    /** `G.GAME.blind.triggered`——本手有没有触发 Boss 的 debuff。`Matador` 读它 */
    blindTriggered: boolean;
    /** 本局是不是已经判输（`Mr. Bones` 只在这时才问） */
    game_over: boolean;
    /** `G.GAME.chips / G.GAME.blind.chips`。`Mr. Bones` 要 ≥ 0.25 才救 */
    blindProgress: number;
    /** `pseudorandom(key, min, max)`。Misprint / Business Card 这类在结算里消费 RNG */
    pseudorandom(key: string, min?: number, max?: number): number;
};

/**
 * `calculate_joker` 的返回值，以及 `eval_card` 包装后的形状。
 *
 * **一次调用最多产出一个 effect**——原作靠 `return` 立刻返回来保证，
 * 这里靠「函数返回单个对象」保证。这条是 15 号票裁定的唯一不变量，
 * 破了它（比如让 handler 返回数组）就会在一次结算里把同一张小丑算两遍。
 */
export type JokerEffect = {
    /** 加筹码（逐张型用 `chips`，主遍历用 `chip_mod`——原文两个字段名，别合并） */
    chips?: number;
    mult?: number;
    x_mult?: number;
    h_mult?: number;
    dollars?: number;
    p_dollars?: number;
    chip_mod?: number;
    mult_mod?: number;
    Xmult_mod?: number;
    /** 重复触发次数 */
    repetitions?: number;
    /** 升级当前牌型（`Space Joker`） */
    level_up?: boolean;
    /**
     * 这张小丑要被移出小丑区（Popcorn 掉到 0、Gros Michel 掷中灭绝、Ice Cream 融化）。
     *
     * 原作是在 `calculate_joker` 里直接 `G.jokers:remove_card(self)` 入队的，
     * 复刻件不这么做：`calculate_joker` 的契约是「返回一个 effect，不动小丑区」，
     * 让它顺手删数组会让「遍历小丑区」这件事在遍历中途改数组长度。
     * 改成回一个标志，由持有小丑区的那一层（`Run`）执行。
     */
    destroy?: boolean;
    /** `Gros Michel` 灭绝——之后 `Cavendish` 才进池子 */
    grosMichelExtinct?: boolean;
    /** `Mr. Bones` 把这一局从失败里救回来 */
    saved?: boolean;
    /** `Burnt Joker`：把刚弃掉那手的牌型升一级 */
    levelUpDiscarded?: boolean;
    /** 效果来自哪张小丑，表现层用来 juice */
    card?: Joker;
    /** 纯提示，不影响数值。表现层用 */
    message?: string;
    /** `extra` 那一组间接修正。原文把 swap/func 也塞这里 */
    extra?: {
        mult_mod?: number;
        chip_mod?: number;
        swap?: boolean;
        message?: string;
    };
};
