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
import type { Edition } from '../editions';
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
    /** `Cloud 9`：整副牌里有几张 9。由 `refreshDerivedAbilities` **重算**，不增量 */
    nine_tally?: number;
    /** `Steel Joker`：整副牌里有几张钢铁牌。`card.lua:4188`，同样是**重算** */
    steel_tally?: number;
    /** `Stone Joker`：整副牌里有几张石头牌。`card.lua:4200` */
    stone_tally?: number;
    /** `Driver's License`：整副牌里有几张**带任意强化**的。`card.lua:4182` */
    driver_tally?: number;
    /** `Invisible Joker`：已经熬过几个回合。`set_ability` 里置 0（`card.lua:308`） */
    invis_rounds?: number;
    /** `Caino`：自己攒的倍率，初值 1（`card.lua:324`）。**不走 `x_mult`**，main 分支单独读 */
    caino_xmult?: number;
    /** `Yorick`：还要再弃几张才长一档，初值 `extra.discards`（`card.lua:327`） */
    yorick_discards?: number;
};

export type Joker = {
    readonly key: string;
    readonly center: JokerCenter;
    ability: JokerAbility;
    /** `card.lua:526` 的 `self.debuff`。被 debuff 的小丑 `calculate_joker` 直接返回 nil */
    debuff: boolean;
    /** 买价。`card.lua:375`，**含版本加价**。由 `setCost` 算 */
    cost: number;
    /** 卖价。`card.lua:382`，`max(1, floor(cost/2)) + extra_value`。由 `setCost` 算 */
    sell_cost: number;
    /**
     * `ability.extra_value`：Egg / Gift Card 攒在卡上的额外卖价。
     * **放在卡上而不是 ability 上**只是为了与消耗品同形（`setCost` 两边共用），
     * 语义与原文一样跟着卡走——复制小丑时一并抄过去（`copy_card` 抄整个 ability）
     */
    extra_value?: number;
    /**
     * `card.edition`。商店与补充包里的小丑都会掷一次版本
     * （`poll_edition('edi'+append+ante)`）。
     * **Negative 不参与计分，它的效果是让小丑区多一格。**
     */
    edition?: Edition;
    /** 表现层排序用，单位是 tile（与 `Card.T` 同口径，见 10 号票） */
    T: { x: number; y: number; w: number; h: number };
    /**
     * `card.getting_sliced`：**已经被 Madness / Ceremonial Dagger 判了死刑、还没真的删掉**。
     *
     * 原作在 `setting_blind` 那一趟里只打标记，删除是入队的——所以同一趟里
     * 后面的小丑仍然看得见它（Riff-raff 数小丑区张数时算它一张），
     * 而它自己的 `setting_blind` 分支被 `not self.getting_sliced` 挡掉。
     * 复刻件照这个语义：标记、跑完整趟、再删。
     */
    getting_sliced?: boolean;
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
    /**
     * `card.lua:2700` 的 `context.using_consumeable`：**刚用掉了一张消耗品**。
     * `Constellation`（星球）与 `Fortune Teller`（塔罗）读它。
     */
    using_consumeable?: boolean;
    /**
     * 跟着 `using_consumeable` 一起来的那张牌。
     * **`name` 不是可有可无的**：`Glass Joker` 只认 `The Hanged Man`。
     */
    consumeable?: { set: 'Tarot' | 'Planet' | 'Spectral'; name?: string };
    /**
     * `G.hand.highlighted`——用消耗品时选中的那几张牌。
     * `Glass Joker` 要数「这一次 The Hanged Man 毁掉了几张玻璃牌」，
     * 而销毁是同步发生的、`removed` 那条路又已经被 `remove_playing_cards` 占了，
     * 所以选中列表得单独传。
     */
    highlighted?: Card[];
    /**
     * `card.lua:2521` 的 `context.setting_blind`：**刚选定盲注**。
     * `Cartomancer` 在这时造一张塔罗。
     */
    setting_blind?: boolean;
    /** 跟着 `setting_blind` 来的 `context.blind.boss`。`Madness` 在 Boss 盲注不动手 */
    blind_boss?: boolean;
    /**
     * `game.lua:3589` 的 `context.first_hand_drawn`：**这一关第一次发完牌**。
     * Certificate 在这时塞一张带蜡封的牌
     */
    first_hand_drawn?: boolean;
    /**
     * `misc_functions.lua:1604` 的 `playing_card_joker_effects`：**有扑克牌加进了牌组**。
     * `Hologram` 按 `#cards` 长倍率。
     */
    playing_card_added?: boolean;
    /** 跟着 `playing_card_added` 一起来的那批。**只有张数有意义**（Marble 与 DNA 传的是 `{true}`） */
    cards?: unknown[];
    /**
     * `card.lua:2338` 的 `context.open_booster`：**刚打开一个补充包**。
     * `Hallucination` 读它。**这一趟排在「造包里的牌」之前**（`card.lua:1799`）。
     */
    open_booster?: boolean;
    /**
     * `card.lua:2444` 的 `context.skipping_booster`：**跳过了补充包的剩余选择**。
     * `Red Card` 靠它长倍率。**挑满自动关包不触发**，只有主动跳过才触发。
     */
    skipping_booster?: boolean;
    /**
     * `card.lua:2606` 的 `context.destroying_card`：结算之后的销毁判定。
     * 返回 `destroyCard` 表示「这张我要毁掉」。`Sixth Sense` 读它。
     */
    destroying_card?: boolean;
    /**
     * `state_events.lua:996` 与 `card.lua:1370` 的 `remove_playing_cards`：
     * 有扑克牌被永久销毁（碎掉的玻璃牌 / The Hanged Man）。
     * `Glass Joker`（只数 `shattered`）与 `Caino`（数人头牌）读它
     */
    remove_playing_cards?: boolean;
    /** 跟着 `remove_playing_cards` 一起来的那批牌 */
    removed?: Card[];
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
         * `G.GAME.current_round.discards_used`：本回合已弃几次。
         * **逐张弃牌循环之后才 +1**（`state_events.lua:454`），Trading Card 判「第一次弃牌」用它
         */
        discards_used?: number;
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
    /** `G.GAME.consumeable_usage_total.tarot`。`Fortune Teller` 读它 */
    consumeable_usage_tarot: number;
    /** `#G.consumeables.cards`。造塔罗的那几张（8 Ball / Vagabond …）要查空位 */
    consumableCount: number;
    /** `G.consumeables.config.card_limit` */
    consumable_slots: number;
    /**
     * `create_card(set, G.consumeables, …, keyAppend)` + `emplace`。
     * **消费 RNG**（池子抽取那一次），由 `Run` 接到真的池子上。
     *
     * 原作是入队一个 `trigger='before', delay=0` 的事件，并先把
     * `G.GAME.consumeable_buffer` 加 1 占位、事件里再清零。
     * 本复刻是**同步立即**造，所以那个 buffer 恒为 0——
     * 与 `dollar_buffer` 同一条理由（见 map 的已知的坑）。
     */
    createConsumable(set: 'Tarot' | 'Planet' | 'Spectral', keyAppend: string): void;
    /** `G.consumeables.cards`。`Perkeo` 要查空没空 */
    consumableCards: ReadonlyArray<unknown>;
    /**
     * `card.lua:2419`：把消耗品区里随机一张复制成 Negative 的。
     * **消费一次 `pseudoseed(key)`**。
     */
    duplicateConsumableAsNegative(key: string): void;
    /**
     * `card.lua:2584` 的 `Marble Joker`：造一张扑克牌进 `G.playing_cards`。
     * **消费一次 `pseudorandom_element(P_CARDS, pseudoseed(key))`**（`marb_fr`）。
     *
     * 原文先 `emplace` 进 `G.play`（出牌区），紧跟着 `draw_card(G.play, G.deck)` 放回牌堆，
     * 而本关的洗牌排在这之后——所以**这一关就摸得到它**。复刻件的 `setting_blind` 那一趟
     * 跑在 `Round` 复制牌堆之前，进 `Run.fullDeck` 就等于进了这一关的牌堆。
     *
     * 原文还跟着入队一次 `G.deck.config.card_limit + 1`——那是牌堆**那一摞的视觉高度**，
     * 不是任何数值上限，复刻件不建模。
     */
    createPlayingCard(enhancement: string | null, key: string): void;
    /**
     * `G.GAME.joker_buffer`：**已经说好要进小丑区、但还没进的张数**（可以是负的）。
     * Riff-raff 造小丑前 `+n`，Ceremonial Dagger 切掉一张 `-1`——
     * 同一趟 `setting_blind` 里后面的 Riff-raff 数空位时要算上它。
     * **Madness 切掉的那张不减**，原文如此。
     */
    jokerBuffer: number;
    /**
     * Riff-raff 的 `create_card('Joker', …, _rarity, …, keyAppend)`。
     * **入队**：原文是 `add_event`，在这一趟 `setting_blind` 跑完之后才真的造。
     */
    queueJoker(keyAppend: string, rarity: number): void;
    /** Madness / Ceremonial Dagger：给一张小丑判死刑（`getting_sliced = true`），这一趟跑完再删 */
    sliceJoker(target: Joker): void;
    /**
     * `card.lua:2374` 的 Invisible Joker：**从小丑区里除自己之外随机复制一张**，
     * 消费一次 `pseudorandom_element(others, pseudoseed(key))`。满了就不复制。
     */
    duplicateJoker(self: Joker, key: string): void;
    /**
     * DNA：把一张扑克牌的复制品（`copy_card`）放进**手牌与整副牌**。
     * 不进牌堆——原文 `G.hand:emplace`。
     */
    addPlayingCardToHand(card: Card): void;
    /**
     * `blind.lua:356` 的 `Blind:disable()`（Luchador / Chicot）。
     * **只对 Boss 生效**；不在 Boss 盲注里（商店里卖掉 Luchador）什么也不做
     */
    disableBoss(): void;
    /** Certificate：往手里塞一张随机牌面、随机蜡封的牌（`cert_fr` / `certsl`），见 `round.ts` */
    createCertificateCard(): void;
    /**
     * `Smeared Joker` 在场——红桃认方块、黑桃认梅花。
     * 由 `modifiers.ts` 从小丑区算出来，不是每张小丑自己去 `find_joker`。
     */
    smeared: boolean;
    /** `G.GAME.round_resets.ante`。带 ante 的 seed key（`halu<ante>`）要用 */
    ante: number;
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
    /** `context.destroying_card` 下返回真值 = 这张牌要被毁掉（`Sixth Sense`） */
    destroyCard?: boolean;
    /**
     * `context.discard` 下返回 `remove = true`：**这张被弃的牌直接毁掉**，不进弃牌堆
     * （Trading Card）。弃牌循环照样把后面的小丑问完
     */
    remove?: boolean;
    /** `Burnt Joker`：把刚弃掉那手的牌型升一级 */
    levelUpDiscarded?: boolean;
    /**
     * `playing_cards_created`：这次造了几张扑克牌（`DNA`）。
     * 原作在 `card_eval_status_text` 里看到它就跑一趟 `playing_card_joker_effects`
     * （`common_events.lua:924`），**同步，排在下一张小丑的 before 之前**。
     */
    playingCardsCreated?: number;
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
