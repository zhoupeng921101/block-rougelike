/**
 * 一整局（run）。`Round` 之上的那一层：Ante 推进、盲注序、钱、小丑、牌型等级。
 *
 * 直译自 `参考/产物/Balatro_1.0.1o/源码/` 的几处：
 * - `game.lua:2100` 起 `G.GAME` 的初始化
 * - `functions/misc_functions.lua:1853` `get_starting_params`
 * - `functions/common_events.lua:2375` `reset_blinds`、`:2387` `get_new_boss`
 * - `functions/state_events.lua:87` `end_round`、`:272` 回合结束的那串 reset
 *
 * ## 为什么 RNG 状态归 `Run` 持有
 *
 * `G.GAME.pseudorandom` 是**整局共享**的一张表：每个 key 有自己的浮点状态，
 * 同一个 key 的第 n 次调用依赖前 n-1 次。每回合新建一个 `PseudorandomState`
 * 会让 `'hook'` / `'business'` / `'misprint'` 这些 key 每回合从头开始，
 * 从第二回合起就与原版分叉。所以它必须活在 `Run` 上，按引用传给 `Round`。
 *
 * ## 盲注序
 *
 * 一个 Ante 三关：小盲注 → 大盲注 → Boss。**Boss 在 Ante 开始时就抽定**
 * （`reset_blinds` 里调 `get_new_boss`），不是打到它才抽——抽取消耗 RNG，
 * 位置错了同 seed 就分叉。
 */

import {
    type BlindKind,
    type BlindState,
    assertImplemented,
    getNewBoss,
    makeBlindState,
} from './blinds';
import { type Card, type Suit, makeStandardDeck } from './card';
import { type Payout, evaluateRound } from './economy';
import { calculateJoker, makeGameView, refreshDerivedAbilities, runModifiers } from './jokers';
import type { GameView, Joker } from './jokers';
import { NO_JOKERS, type JokerFlags } from './poker-hands';
import { PseudorandomState, pseudorandomElement } from './rng';
import { Round, STARTING_PARAMS } from './round';
import { type HandInfo, type HandName, initialHands } from './scoring';
import { type PoolContext, Shop } from './shop';

/** `game.lua:2186`：`blind_choices = {Small = 'bl_small', Big = 'bl_big'}`。 */
const BLIND_ORDER: readonly BlindKind[] = ['small', 'big', 'boss'];

export type RunState =
    /** 盲注选择。本里程碑简化成「直接进下一个盲注」，不做选盲注界面 */
    | 'blind-select'
    | 'playing'
    /** 回合结算画面（收益逐行滚出来） */
    | 'round-eval'
    | 'shop'
    | 'game-over';

export class Run {
    readonly seed: string;
    readonly rng: PseudorandomState;
    /** 整副牌。**跨回合持有同一批 `Card` 对象**——`played_this_ante` 挂在它们身上 */
    readonly fullDeck: Card[];
    readonly hands: Record<HandName, HandInfo> = initialHands();
    readonly jokers: Joker[] = [];

    ante = 1;
    dollars: number = STARTING_PARAMS.dollars;
    state: RunState = 'blind-select';
    /** 本 Ante 打到第几关（0 = 小盲注） */
    blindIndex = 0;
    /** 整局累计出牌数。`Loyalty Card` 读它 */
    handsPlayed = 0;
    /** 当前在打的那一局。`null` 表示不在 `playing` */
    round: Round | null = null;

    /** `game.lua:2129` 的 `G.GAME.bosses_used`。**它改变 Boss 池的大小**，见 `getNewBoss` */
    readonly bossesUsed: Record<string, number> = {};
    /** 本 Ante 的 Boss，在 Ante 开始时抽定 */
    bossKey: string;
    /** `G.GAME.pool_flags.gros_michel_extinct` */
    grosMichelExtinct = false;
    /**
     * `G.GAME.used_jokers`。本局**见过**的小丑 key——注意是见过，不是买过：
     * `card.lua:350` 在 `set_ability` 里就标记，所以商店摆出来那一刻就算见过。
     * 它会把那张小丑从池子里剔掉（换成 `UNAVAILABLE`），所以是 RNG 相关状态。
     */
    readonly usedJokers = new Set<string>();
    /** 当前商店。`null` 表示不在 `shop` */
    shop: Shop | null = null;

    /** 本回合的 `mail_card` 点数。每回合结束时重抽 */
    mailCard?: number;
    /** `The Idol` / `Ancient Joker` / `Castle` 的每回合随机项 */
    idolCard?: { id: number; suit: Suit };
    ancientSuit: Suit = 'Spades';
    castleSuit: Suit = 'Spades';

    constructor(seed: string, deck: Card[] = makeStandardDeck()) {
        this.seed = seed;
        this.rng = new PseudorandomState(seed);
        this.fullDeck = deck;

        // `game.lua:2394`：开局就抽定 Ante 1 的 Boss
        this.bossKey = getNewBoss(this.ante, this.rng, this.bossesUsed);

        // `game.lua:2602`：开局也跑一遍那四个 reset
        this.resetSpecialCards();
    }

    /** 喂给商店的池子上下文。**每次现建**——`jokers` 与 `grosMichelExtinct` 会变 */
    poolContext(): PoolContext {
        return {
            ante: this.ante,
            usedJokers: this.usedJokers,
            grosMichelExtinct: this.grosMichelExtinct,
            jokers: this.jokers,
        };
    }

    get blindKind(): BlindKind {
        return BLIND_ORDER[this.blindIndex];
    }

    /** 当前这一关对应的盲注 key。 */
    get blindKey(): string {
        switch (this.blindKind) {
            case 'small':
                return 'bl_small';
            case 'big':
                return 'bl_big';
            case 'boss':
                return this.bossKey;
        }
    }

    /**
     * 进当前这一关。对应原作的 `BLIND_SELECT → SELECTING_HAND`，
     * 但**不做选盲注界面**（15 号票裁定），也不做跳过盲注。
     */
    startRound(jokerFlags: JokerFlags = NO_JOKERS): Round {
        if (this.state !== 'blind-select') throw new Error(`现在是 ${this.state}，不能进盲注`);

        const blind: BlindState = makeBlindState(this.blindKey);
        // 那 20 个未实现 debuff 的 Boss 在这里挡住，不静默放过——见 `assertImplemented`
        assertImplemented(blind.center);

        this.round = new Round(this.seed, this.fullDeck, {
            ante: this.ante,
            blind,
            jokers: this.jokers,
            dollars: this.dollars,
            handsPlayed: this.handsPlayed,
            hands: this.hands,
            jokerFlags,
            rng: this.rng,
            mailCard: this.mailCard,
            special: {
                idolCard: this.idolCard,
                ancientSuit: this.ancientSuit,
                castleSuit: this.castleSuit,
            },
        });
        this.state = 'playing';
        return this.round;
    }

    /**
     * 结束当前这一关，算收益。对应 `state_events.lua:87` `end_round` +
     * `:1156` `evaluate_round`。
     *
     * 返回收益明细；钱在**这里**入账（`Round` 里那份 `dollars` 是结算中途的
     * 小丑收益，已经同步写回来了）。
     */
    finishRound(): { payout: Payout; won: boolean } {
        const round = this.round;
        if (!round) throw new Error('没有正在进行的回合');
        if (round.phase === 'selecting') throw new Error('这一局还没打完');

        const won = round.phase === 'won';

        // `Round` 在结算里已经把小丑赚的钱写进它自己那份 dollars 了，先收回来
        this.dollars = round.dollars;
        // **读回来，不是加一遍**——`evaluatePlay` 已经经 `gameView` 的 setter
        // 把每次出牌记进 `round.handsPlayed` 了
        this.handsPlayed = round.handsPlayed;

        // `state_events.lua:1156`。**利息读的是入账前的余额**
        const payout = evaluateRound({
            won,
            blindDollars: round.blind?.center.dollars ?? 0,
            handsLeft: round.handsLeft,
            discardsLeft: round.discardsLeft,
            discardsUsed: round.discardsUsed,
            dollars: this.dollars,
            jokers: this.jokers,
            // `To the Moon` 每张 +1。由 `runModifiers` 从小丑区重算
            interestAmount: runModifiers(this.jokers).interestAmount,
        });
        this.dollars += payout.total;

        // `card.lua:2877` 的 `end_of_round` 分支。**在收益之后**——
        // Egg 涨的是卖价、Popcorn 掉的是倍率，都不参与本回合收益
        this.runEndOfRoundJokers();

        if (!won) {
            this.state = 'game-over';
            return { payout, won };
        }

        this.advanceBlind();
        return { payout, won };
    }

    /**
     * `card.lua:2877` 的 `end_of_round`。销毁由这里执行——
     * `calculate_joker` 只回一个 `destroy` 标志（见 `JokerEffect.destroy`）。
     */
    private runEndOfRoundJokers(): void {
        const round = this.round;
        if (!round) return;
        const view = round.gameView();

        // **先收集再删**：遍历中途改数组会跳过元素
        const destroy: Joker[] = [];
        for (const joker of [...this.jokers]) {
            const effect = calculateJoker(joker, { end_of_round: true }, view);
            if (!effect) continue;
            if (effect.grosMichelExtinct) this.grosMichelExtinct = true;
            if (effect.destroy) destroy.push(joker);
        }
        for (const joker of destroy) {
            const i = this.jokers.indexOf(joker);
            if (i >= 0) this.jokers.splice(i, 1);
        }
    }

    /**
     * 推进盲注序。对应 `common_events.lua:2375` `reset_blinds` 与
     * `state_events.lua:272` 那串 reset。
     *
     * 打完 Boss 才进下一个 Ante，并且**只有那时**才：
     * 清 `played_this_ante`、抽下一个 Boss。
     */
    private advanceBlind(): void {
        const wasBoss = this.blindKind === 'boss';
        this.round = null;

        if (wasBoss) {
            // `state_events.lua:286`：**只在 Boss 打完之后清**，不是每回合
            for (const card of this.fullDeck) card.played_this_ante = false;

            this.ante++;
            this.blindIndex = 0;
            // `common_events.lua:2382`：进新 Ante 时抽新 Boss
            this.bossKey = getNewBoss(this.ante, this.rng, this.bossesUsed);
        } else {
            this.blindIndex++;
        }

        // `state_events.lua:294`：**每回合都跑**这四个 reset，不只是 Ante 结束
        this.resetSpecialCards();

        // `state_events.lua:1129`：回合结算完开商店。
        // **商店在 `advanceBlind` 之后开**，所以它读的 ante 已经是新的那个——
        // 商店的所有 seed key 都带 ante（`cdt`/`rarity`/`Joker<r>sho`），
        // 在 `ante++` 之前开会用上一个 ante 的 key
        this.shop = new Shop(this.rng, this.poolContext());
        this.state = 'shop';
    }

    /** 离开商店，进下一个盲注。 */
    leaveShop(): void {
        if (this.state !== 'shop') throw new Error(`现在是 ${this.state}，不在商店里`);
        // `card.lua` 的 `context.ending_shop` 分支：本里程碑没有小丑用它
        this.shop = null;
        this.state = 'blind-select';
    }

    /**
     * 买商店第 `index` 格的小丑。
     *
     * 三道闸：钱够不够、小丑区满没满、那一格是不是小丑。
     * 原作的 `can_buy` 还查消耗品槽位与 `Negative` 版本（买了不占格子），
     * 两者都不在本里程碑。
     */
    buyJoker(index: number): Joker {
        if (!this.shop) throw new Error('不在商店里');
        const item = this.shop.items[index];
        if (!item) throw new Error(`商店没有第 ${index} 格`);
        if (item.kind !== 'joker') throw new Error('这一格是塔罗／星球，本里程碑未实现');
        if (item.cost > this.dollars) throw new Error(`买不起：要 $${item.cost}，只有 $${this.dollars}`);
        if (this.jokersFull) throw new Error(`小丑区满了（${this.jokerSlots} 格）`);

        const joker = this.shop.take(index);
        this.dollars -= item.cost;
        this.jokers.push(joker);
        // 小丑区变了 → 派生字段要重算（Joker Stencil 的空格子数、Swashbuckler 的卖价和）
        refreshDerivedAbilities(this.jokers, this.jokerSlots);
        // `card.lua:1858` 的 `context.buying_card` 分支在原作里是空的，
        // 但调用点要留着——它是接 `Trading Card` 之类的落点
        for (const other of this.jokers) {
            calculateJoker(other, { buying_card: true }, this.round?.gameView() ?? this.shopGameView());
        }
        return joker;
    }

    /**
     * 卖掉小丑区第 `index` 张。`card.lua:1592` 的 `Card:sell_card`。
     *
     * **`selling_self` 在移出小丑区之前调**（`card.lua:1601`）——
     * `Luchador` 要在还在场时关掉 Boss。
     */
    sellJoker(index: number): number {
        const joker = this.jokers[index];
        if (!joker) throw new Error(`小丑区没有第 ${index} 张`);

        calculateJoker(joker, { selling_self: true }, this.round?.gameView() ?? this.shopGameView());
        this.jokers.splice(index, 1);
        this.dollars += joker.sell_cost;
        refreshDerivedAbilities(this.jokers, this.jokerSlots);

        // `card.lua:4826` 的 `remove_from_deck`：小丑区里没有同名的了就解除 used 标记
        if (!this.jokers.some((j) => j.ability.name === joker.ability.name)) {
            this.usedJokers.delete(joker.key);
        }

        // `card.lua:2758` 的 `context.selling_card`：`Campfire` 靠它长个子
        for (const other of this.jokers) {
            calculateJoker(other, { selling_card: true }, this.round?.gameView() ?? this.shopGameView());
        }
        return joker.sell_cost;
    }

    /** 重掷商店。`button_callbacks.lua:2965`。 */
    rerollShop(): void {
        if (!this.shop) throw new Error('不在商店里');
        const cost = this.shop.rerollCost;
        if (cost > this.dollars) throw new Error(`重掷不起：要 $${cost}，只有 $${this.dollars}`);
        this.dollars -= cost;
        this.shop.reroll();
        // `button_callbacks.lua:3010` 的 `context.reroll_shop`：`Flash Card` 靠它长个子
        for (const joker of this.jokers) {
            calculateJoker(joker, { reroll_shop: true }, this.shopGameView());
        }
    }

    /**
     * 商店里没有 `Round`，但小丑还是要能读 `G.GAME`。
     * 所以这里单独造一张视图——这正是 `GameView` 不由 `Round` 独占的原因。
     */
    private shopGameView(): GameView {
        return makeGameView({
            hands: this.hands,
            dollars: this.dollars,
            hands_played: this.handsPlayed,
            jokers: this.jokers,
            joker_slots: this.jokerSlots,
            deckCount: this.fullDeck.length,
            startingDeckSize: this.fullDeck.length,
            playingCardCount: this.fullDeck.length,
            smeared: runModifiers(this.jokers).smeared,
            pseudorandom: (key, min, max) => this.rng.pseudorandom(key, min, max),
        });
    }

    /**
     * `common_events.lua:2320-2374` 的四个 `reset_*`。
     *
     * **四个都要跑，即使本里程碑只有 `Mail-In Rebate` 会读结果。**
     * 它们各自消费一个独立的 key（`idol`/`mail`/`anc`/`cas` 加 ante），
     * 而 `PseudorandomState` 是按 key 分开记状态的，所以少跑一个
     * 不影响别的 key——但**接 `The Idol` / `Ancient Joker` / `Castle` 时会**，
     * 那时候这几个 key 的调用次数必须已经对齐。现在跑完，以后就不用回来补。
     */
    private resetSpecialCards(): void {
        // 原文过滤的是 `ability.effect ~= 'Stone Card'`。石头牌不在本里程碑，
        // 所以候选就是整副牌
        const valid = this.fullDeck;
        if (valid.length === 0) return;

        const [idol] = pseudorandomElement(valid, this.rng.pseudoseed(`idol${this.ante}`));
        if (idol) this.idolCard = { id: idol.base.id, suit: idol.base.suit };

        const [mail] = pseudorandomElement(valid, this.rng.pseudoseed(`mail${this.ante}`));
        if (mail) this.mailCard = mail.base.id;

        // `reset_ancient_card`：候选是**除当前花色以外**的三个，所以池子是 3 不是 4
        const ancientSuits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'].filter(
            (s) => s !== this.ancientSuit,
        );
        const [ancient] = pseudorandomElement(ancientSuits, this.rng.pseudoseed(`anc${this.ante}`));
        if (ancient) this.ancientSuit = ancient as Suit;

        const [castle] = pseudorandomElement(valid, this.rng.pseudoseed(`cas${this.ante}`));
        if (castle) this.castleSuit = castle.base.suit;
    }

    /** `misc_functions.lua:1855` 的 `joker_slots`，再加上小丑给的槽位。 */
    get jokerSlots(): number {
        return STARTING_PARAMS.joker_slots;
    }

    /** 小丑区满了没有。买小丑之前要查 */
    get jokersFull(): boolean {
        return this.jokers.length >= this.jokerSlots;
    }
}
