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
import { BOOSTER_CENTERS } from './boosters';
import {
    type OpenPack,
    type PackCard,
    isBoosterImplemented,
    openBooster,
    releasePack,
} from './booster-open';
import { type Card, P_CARDS, type Suit, makeCard, makeStandardDeck } from './card';
import { negativeCount } from './editions';
import { sealEndOfRoundPlanet } from './seals';
import { getEndOfRoundDollars } from './enhancements';
import {
    type Consumable,
    type ConsumableUsage,
    type UseContext,
    applyConsumable,
    canUseConsumable,
    distinctPlanetsUsed,
    isConsumableImplemented,
    makeConsumable,
    makeConsumableUsage,
    planetKeyFor,
    recordConsumableUsage,
} from './consumables';
import { type Payout, evaluateRound } from './economy';
import { calculateJoker, makeGameView, refreshDerivedAbilities, runModifiers, setCost } from './jokers';
import type { GameView, Joker } from './jokers';
import { NO_JOKERS, type JokerFlags } from './poker-hands';
import { PseudorandomState, pseudorandomElement, pseudoshuffle } from './rng';
import { type JokerAreaHooks, Round, STARTING_PARAMS } from './round';
import { type BlindType, type Tag, type TagTiming, isTagImplemented, makeTag, nextTagKey } from './tags';
import { type HandInfo, type HandName, initialHands, levelUpHand } from './scoring';
import {
    type ShopVoucher,
    type VoucherParams,
    isVoucherImplemented,
    nextVoucherKey,
    voucherParams,
} from './vouchers';
import {
    type ShopTagHooks,
    type PoolContext,
    type ShopItem,
    BASE_REROLL_COST,
    SHOP_JOKER_MAX,
    Shop,
    createConsumableCard,
    createJokerCard,
    pickToDoHand,
    releaseUsed,
} from './shop';

/** `game.lua:2094` 的 `win_ante`。打过这个 Ante 的 Boss 就赢了 */
export const WIN_ANTE = 8;

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

/**
 * 牌组（`G.GAME.selected_back`）。复刻件只做红牌组（`game.lua:629`）。
 *
 * `back.lua:211` 的 `Back:apply_to_run` 把 `config.discards` 加进 `G.GAME.starting_params`，
 * **07 号票起一直漏了这一步**：复刻件按 3 次弃牌打，实机红牌组是 4 次（21 号票，模拟器首帧就看得到）。
 * `Round` 单独构造时仍是 `get_starting_params` 的基础值 3——牌组效果属于整局，由 `Run` 传进去。
 */
export const RED_DECK = { key: 'b_red', config: { discards: 1 } } as const;

export class Run {
    readonly seed: string;
    readonly back = RED_DECK;
    readonly rng: PseudorandomState;
    /** 整副牌。**跨回合持有同一批 `Card` 对象**——`played_this_ante` 挂在它们身上 */
    readonly fullDeck: Card[];
    readonly hands: Record<HandName, HandInfo> = initialHands();
    readonly jokers: Joker[] = [];
    /** `G.consumeables` 里的牌。**是逻辑状态**：它参与 `find_joker` 的搜索域 */
    readonly consumables: Consumable[] = [];
    /** `G.GAME.consumeable_usage`。`Fortune Teller` / `Satellite` 读它 */
    readonly consumableUsage: ConsumableUsage = makeConsumableUsage();
    /** `G.GAME.last_tarot_planet`。`The Fool` 复制它 */
    lastTarotPlanet?: string;
    /** `G.GAME.last_hand_played`（`state_events.lua:597`）。Blue 蜡封读它 */
    lastHandPlayed?: HandName;
    /**
     * `G.hand:change_size` 的累计量。`Ouija` -1、`Ectoplasm` 递增地减。
     * **跨回合持续**，所以不能放在 `Round` 上。
     */
    handSizeDelta = 0;
    /** `G.GAME.ecto_minus`（`card.lua:1497`）。从 1 起，每用一张 Ectoplasm +1 */
    private ectoMinus = 1;
    /**
     * `G.GAME.first_shop_buffoon`。新档的第一个商店，第一个补充包格子恒是小丑包，
     * 而且那一格**不消费 `shop_pack<ante>`**（`common_events.lua:1984` 提前 return）。
     * 商店一开就用掉了，所以开完无条件置真。
     */
    firstShopBuffoon = false;

    ante = 1;
    dollars: number = STARTING_PARAMS.dollars;
    state: RunState = 'blind-select';
    /** 本 Ante 打到第几关（0 = 小盲注） */
    blindIndex = 0;
    /** 整局累计出牌数。`Loyalty Card` 读它 */
    handsPlayed = 0;
    /**
     * `G.GAME.round`：选盲注时 +1（`button_callbacks.lua:2643` 的 `ease_round(1)`），跳过盲注不加。
     * 机制上没人读它（只有成就），左侧面板的「Round」显示它
     */
    roundNumber = 0;
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
    /**
     * 正在开的补充包。`null` 表示没在开包。
     *
     * **开包期间商店还在**（原作是把商店滑出屏幕、不销毁），
     * 所以 `state` 仍然是 `'shop'`；表现层靠这个字段决定画哪一层。
     */
    openPack: OpenPack | null = null;

    /** 本回合的 `mail_card` 点数。每回合结束时重抽 */
    mailCard?: number;

    /** `G.GAME.tags`：手上还没触发的标签，按拿到的先后排 */
    tags: Tag[] = [];
    /**
     * `G.GAME.won`：打过了第 `win_ante`（8）个 Ante 的 Boss（`state_events.lua:113`）。
     * **赢了局不结束**——原作弹出胜利窗口，可以接着打（无尽模式），所以这里只是一个标记
     */
    won = false;
    /** `G.GAME.skips`：本局跳过了几个盲注。Throwback 与 Skip Tag 读它 */
    skips = 0;
    /**
     * `G.GAME.round_resets.blind_tags`：这个 Ante 的小盲注、大盲注**跳过时给哪个标签**。
     * 开局抽一次，每打完一个 Boss 再抽下一个 Ante 的（`button_callbacks.lua:3062`）
     */
    blindTags: { Small: string; Big: string } = { Small: '', Big: '' };
    /** `G.GAME.unused_discards`：过关时剩下的弃牌累计。Garbage Tag 读它 */
    unusedDiscards = 0;
    /**
     * `G.GAME.orbital_choices[ante][type]`：Orbital Tag 升级哪个牌型。
     * **每个 Ante 的盲注选择界面第一次构建时对 Small / Big / Boss 各掷一次**，
     * 不管标签是不是 Orbital（掷点在界面代码里，`UI_definitions.lua:1622`）
     */
    private orbitalChoices = new Map<number, Record<BlindType, HandName>>();
    /** `G.GAME.used_vouchers`：已兑换的优惠券 */
    readonly usedVouchers = new Set<string>();
    /**
     * `G.GAME.current_round.voucher`：本 Ante 商店里摆的那张。开局抽一次、每打完 Boss 抽一次；
     * **兑换任何一张优惠券都会把它清掉**（`card.lua:1852`），这个 Ante 后面的商店就不再摆
     */
    currentVoucher: string | null = null;
    /**
     * `G.GAME.round_resets.boss_rerolled`。Director's Cut 每个 Ante 只能重掷一次 Boss；
     * **Boss Tag 也会置它**（两条路共用 `reroll_boss`）。进新 Ante 时清（`common_events.lua:2383`）
     */
    bossRerolled = false;
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

        // `game.lua:2395`：开局抽定 Ante 1 的优惠券
        this.currentVoucher = nextVoucherKey(this.rng, this.voucherPoolContext([]));

        // `game.lua:2396`：开局抽定 Ante 1 的两个跳过标签
        this.rollBlindTags();

        // `game.lua:2602`：开局也跑一遍那四个 reset
        this.resetSpecialCards();

        this.enterBlindSelect();
    }

    // ————————————————————————————————————————————————————————————————
    // 标签与跳过盲注（18 号票）
    // ————————————————————————————————————————————————————————————————

    /** `get_next_tag_key` × 2：小盲注一个、大盲注一个，**先小后大** */
    private rollBlindTags(): void {
        this.blindTags = { Small: nextTagKey(this.rng, this.ante), Big: nextTagKey(this.rng, this.ante) };
    }

    /**
     * 进盲注选择界面。`game.lua:3640` 起：界面第一次构建时掷 `orbital`，
     * 然后跑一遍 `immediate`、再跑 `new_blind_choice`（**第一个生效的就停**）。
     */
    private enterBlindSelect(): void {
        this.state = 'blind-select';
        if (!this.orbitalChoices.has(this.ante)) {
            // `pairs(G.GAME.hands)` 里 `visible` 的那些。**顺序是 LuaJIT 的哈希序**，
            // 复刻件按牌型声明序——掷点次数对，结果映射没法不跑实机核实（见 18 号票）
            const visible = (Object.keys(this.hands) as HandName[]).filter((h) => this.hands[h].visible);
            const roll = () => pseudorandomElement(visible, this.rng.pseudoseed('orbital'))[0]!;
            this.orbitalChoices.set(this.ante, { Small: roll(), Big: roll(), Boss: roll() });
        }
        this.applyTags('immediate');
        this.applyNewBlindChoice();
    }

    /** 商店问标签的三个时机（`ShopTagHooks`）。生效的标签当场移走 */
    private shopTagHooks(): ShopTagHooks {
        const take = (key: string): boolean => {
            const tag = this.tags.find((t) => !t.triggered && t.key === key);
            if (!tag) return false;
            tag.triggered = true;
            this.tags = this.tags.filter((t) => !t.triggered);
            return true;
        };
        return {
            // `tag.lua:394`：D6 每个商店只生效一张（`shop_d6ed`）
            shopStart: () => take('tag_d_six'),
            // `tag.lua:376`：`create_card('Joker', …, 0.9, …, 'uta')`——rarity 固定 0.9 → 罕见，
            // 走商店那条（`etperpoll` 照掷），版本照掷
            storeJokerCreate: () =>
                take('tag_uncommon')
                    ? createJokerCard(this.rng, this.poolContext(), 'uta', 'shop', { rarity: 0.9 })
                    : null,
            // `tag.lua:302`：**每张** Voucher Tag 各加一张（循环不 break），
            // 用 `Voucher_fromtag`，依次排除已经摆出来的
            voucherAdd: (inShop) => {
                const added: string[] = [];
                while (take('tag_voucher')) {
                    const key = nextVoucherKey(this.rng, this.voucherPoolContext([...inShop, ...added]), true);
                    added.push(key);
                }
                return added;
            },
            // `tag.lua:448`：`shop_free` 每个商店只生效一张
            shopFinalPass: () => take('tag_coupon'),
        };
    }

    /** `eval` 标签：打完 Boss 的 Investment Tag 各给 $25。触发即移走 */
    private takeEvalTags(): Array<{ key: string; dollars: number }> {
        if (this.blindKind !== 'boss') return [];
        const rows: Array<{ key: string; dollars: number }> = [];
        for (const tag of this.tags) {
            if (tag.key !== 'tag_investment') continue;
            rows.push({ key: tag.key, dollars: tag.center.config.dollars });
            tag.triggered = true;
        }
        this.tags = this.tags.filter((t) => !t.triggered);
        return rows;
    }

    /** `round_start_bonus`：Juggle Tag 这一回合 +3 手牌上限。触发即移走 */
    private takeRoundStartBonus(): number {
        let bonus = 0;
        for (const tag of this.tags) {
            if (tag.key !== 'tag_juggle') continue;
            bonus += tag.center.config.h_size;
            tag.triggered = true;
        }
        this.tags = this.tags.filter((t) => !t.triggered);
        return bonus;
    }

    /** 这一格现在能跳过吗。**Boss 不能跳** */
    get canSkipBlind(): boolean {
        return this.state === 'blind-select' && !this.openPack && this.blindKind !== 'boss';
    }

    /**
     * `button_callbacks.lua:2850` 的 `skip_blind`：跳过当前的小 / 大盲注，拿走它的标签。
     *
     * 顺序照原文：
     * 1. `skips + 1`、`add_tag`（已有的 Double 在这时复制它）、盲注序推进——**不进商店**
     * 2. 小丑的 `skip_blind`（Throwback）
     * 3. 所有 `immediate` 标签，再 `new_blind_choice`（第一个生效的就停）
     *
     * 跳过的那一关**不跑每回合的 reset**（`reset_idol_card` 那四个在 `end_round` 里）。
     */
    skipBlind(): Tag {
        if (!this.canSkipBlind) throw new Error(`现在不能跳过（${this.state} / ${this.blindKind}）`);
        const type: BlindType = this.blindKind === 'small' ? 'Small' : 'Big';
        this.skips++;
        const key = this.blindTags[type];
        const tag = makeTag(key, key === 'tag_orbital' ? this.orbitalChoices.get(this.ante)?.[type] : undefined);
        this.addTag(tag);
        this.blindIndex++;
        refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);

        for (const joker of [...this.jokers]) {
            calculateJoker(joker, { skip_blind: true }, this.shopGameView());
        }
        this.applyTags('immediate');
        this.applyNewBlindChoice();
        return tag;
    }

    /**
     * `UI_definitions.lua:1356` 的 `add_tag`：**先让手上的标签看一眼新来的**（`tag_add`），再入列。
     *
     * 只有 Double Tag 响应：复制一份新来的（不复制 Double 自己）。
     * 原文的复制是入队的，落地时触发过的 Double 已经 `triggered`，所以复制品不会再被复制——
     * 复刻件先把新标签入列、再移走触发过的 Double、再逐个加复制品，结果相同。
     */
    addTag(tag: Tag): void {
        const copies: Tag[] = [];
        for (const t of this.tags) {
            if (t.triggered || t.key !== 'tag_double' || tag.key === 'tag_double') continue;
            t.triggered = true;
            // `tag.lua:326`：复制 Orbital 时连同它选中的牌型一起抄（`G.orbital_hand`）
            copies.push(makeTag(tag.key, tag.orbitalHand));
        }
        this.tags.push(tag);
        this.tags = this.tags.filter((t) => !t.triggered);
        for (const copy of copies) this.addTag(copy);
    }

    /** 跑一遍某种时机的标签。生效的标签当场移走（原文在 `yep` 的事件里 `remove()`） */
    private applyTags(type: TagTiming): void {
        for (const tag of [...this.tags]) {
            if (tag.triggered || tag.center.config.type !== type) continue;
            if (this.applyTag(tag)) tag.triggered = true;
        }
        this.tags = this.tags.filter((t) => !t.triggered);
    }

    /** `new_blind_choice`：**第一个生效的就停**。包关掉、Boss 重掷之后原文会再跑一次 */
    private applyNewBlindChoice(): void {
        for (const tag of [...this.tags]) {
            if (tag.triggered || tag.center.config.type !== 'new_blind_choice') continue;
            if (this.applyTag(tag)) {
                tag.triggered = true;
                this.tags = this.tags.filter((t) => !t.triggered);
                return;
            }
        }
    }

    /**
     * `tag.lua:128` 的 `apply_to_run`。返回「生效了没有」。
     *
     * 商店那几种（`store_joker_create` / `shop_start` / `shop_final_pass`）在 `Shop` 里；
     * `eval` 在 `finishRound`、`round_start_bonus` 在 `startRound`、`tag_add` 在 `addTag`。
     */
    private applyTag(tag: Tag): boolean {
        const cfg = tag.center.config;
        switch (tag.key) {
            // ———— immediate ————
            case 'tag_top_up':
                // `tag.lua:141`：造 2 张**普通**小丑（`_rarity = 0`），**每张都查空位**
                for (let i = 0; i < cfg.spawn_jokers; i++) {
                    if (this.jokers.length < this.jokerSlots) {
                        this.jokers.push(createJokerCard(this.rng, this.poolContext(), 'top', 'none', { rarity: 0 }));
                    }
                }
                refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
                return true;
            case 'tag_skip':
                // `tag.lua:162`：**读的是加完这次之后的** skips
                this.dollars += this.skips * cfg.skip_bonus;
                return true;
            case 'tag_garbage':
                this.dollars += this.unusedDiscards * cfg.dollars_per_discard;
                return true;
            case 'tag_handy':
                this.dollars += this.handsPlayed * cfg.dollars_per_hand;
                return true;
            case 'tag_economy':
                // `tag.lua:196`：翻倍，封顶 $40，**负债时给 0**
                this.dollars += Math.min(cfg.max, Math.max(0, this.dollars));
                return true;
            case 'tag_orbital':
                if (tag.orbitalHand) levelUpHand(this.hands, tag.orbitalHand, cfg.levels);
                return true;

            // ———— new_blind_choice ————
            case 'tag_boss':
                // `button_callbacks.lua:2910` 的 `reroll_boss`，从标签来的不花 $10。
                // **同样置 `boss_rerolled`**——这个 Ante 就不能再用 Director's Cut
                this.bossKey = getNewBoss(this.ante, this.rng, this.bossesUsed);
                this.bossRerolled = true;
                return true;
            case 'tag_charm':
                return this.openFreePack('p_arcana_mega_1');
            case 'tag_meteor':
                return this.openFreePack('p_celestial_mega_1');
            case 'tag_ethereal':
                return this.openFreePack('p_spectral_normal_1');
            case 'tag_standard':
                return this.openFreePack('p_standard_mega_1');
            case 'tag_buffoon':
                return this.openFreePack('p_buffoon_mega_1');

            // Voucher Tag 的时机是 `voucher_add`，在商店里（`shopTagHooks`），不走这里
            case 'tag_voucher':
                return false;
            default:
                if (!isTagImplemented(tag.key)) {
                    // Rare / Negative / Foil / Holo / Polychrome：新档 + 指定 seed 下抽不到
                    throw new Error(`${tag.center.name} 在「新档 + 指定 seed」口径下不该出现`);
                }
                return false;
        }
    }

    /**
     * 标签开的包（`tag.lua:217` 起）：**免费**，走普通的 `Card:open`，账与商店的包相同。
     *
     * Charm / Meteor 原文是 `'p_arcana_mega_'..math.random(1, 2)`——全局流，两张只差美术，
     * 复刻件固定取 1。已经有包开着就先不开（原文由状态机保证不会重叠）。
     */
    private openFreePack(key: string): boolean {
        if (this.openPack) return false;
        const center = BOOSTER_CENTERS[key];
        for (const joker of [...this.jokers]) {
            calculateJoker(joker, { open_booster: true }, this.shopGameView());
        }
        this.openPack = openBooster(this.rng, center, key, this.poolContext());
        return true;
    }

    /**
     * 结算里那几张造塔罗的小丑（`8 Ball` / `Vagabond` / `Superposition` / `Cartomancer`）
     * 要碰消耗品区，而 `Round` 不持有它。
     *
     * **同步立即造**，不入队：原作是 `trigger='before', delay=0` 的事件，
     * 并先把 `G.GAME.consumeable_buffer` 加 1 占位。同步造之下那个 buffer 恒为 0——
     * 与 `dollar_buffer` 同一条理由。跨 key 的 RNG 顺序不受影响（09 号票）。
     */
    private consumableHooks() {
        return {
            count: () => this.consumables.length,
            slots: this.consumableSlots,
            usageTarot: () => this.consumableUsage.total.tarot,
            create: (set: 'Tarot' | 'Planet' | 'Spectral', keyAppend: string) => {
                if (this.consumables.length >= this.consumableSlots) return;
                const made = createConsumableCard(this.rng, set, this.poolContext(), keyAppend);
                this.consumables.push(made);
                this.usedJokers.add(made.key);
            },
            cards: () => this.consumables,
            duplicateAsNegative: (key: string) => this.duplicateConsumableAsNegative(key),
        };
    }

    /**
     * `card.lua:2521` 的 `context.setting_blind`：**进盲注时问一遍每张小丑**。
     * 由 `Round` 在构造到一半时回调（见那边的注释），此时手牌上限与牌堆都还没定。
     *
     * 这一趟里的增删**都是入队的**，照原作的顺序落地：
     * 1. 逐张问小丑。Madness / Ceremonial Dagger 只**打标记**（`getting_sliced`），
     *    Riff-raff 只**记账**（`joker_buffer`）——后面的小丑仍看得见被判死刑的那张
     * 2. 跑完之后先造 Riff-raff 的小丑、再删被判死刑的。
     *    先造后删是因为原作里删是 `start_dissolve`（带动画延迟），造是紧跟着的事件——
     *    造的时候被删的那张还占着 `used_jokers`，不会被抽出来
     */
    private settingBlind(round: Round): void {
        this.jokerBuffer = 0;
        this.pendingJokers = [];
        const context = { setting_blind: true, blind_boss: this.blindKind === 'boss' };
        for (const joker of [...this.jokers]) {
            calculateJoker(joker, context, round.gameView());
        }

        for (const { keyAppend, rarity } of this.pendingJokers) {
            this.jokers.push(createJokerCard(this.rng, this.poolContext(), keyAppend, 'none', { rarity }));
        }
        this.pendingJokers = [];
        for (const joker of this.jokers.filter((j) => j.getting_sliced)) {
            const i = this.jokers.indexOf(joker);
            this.jokers.splice(i, 1);
            releaseUsed(this.poolContext(), joker.key);
        }
        this.jokerBuffer = 0;
        refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
    }

    /** `G.GAME.joker_buffer`。只在 `setting_blind` 那一趟里非零 */
    private jokerBuffer = 0;
    /** 这一次用消耗品造出来的扑克牌（Cryptid / Familiar …），用完一起报给 Hologram */
    private addedByConsumable: Card[] = [];
    /** Riff-raff 说好要造、还没造的小丑 */
    private pendingJokers: Array<{ keyAppend: string; rarity: number }> = [];

    /** 小丑区的口子，`Round` 与商店视图共用 */
    private jokerAreaHooks(): JokerAreaHooks {
        return {
            getBuffer: () => this.jokerBuffer,
            setBuffer: (n) => { this.jokerBuffer = n; },
            queueJoker: (keyAppend, rarity) => { this.pendingJokers.push({ keyAppend, rarity }); },
            sliceJoker: (target) => { target.getting_sliced = true; },
            duplicateJoker: (self, key) => this.duplicateJoker(self, key),
            addTag: (key) => this.addTag(makeTag(key)),
            addPlayingCard: (card) => {
                this.fullDeck.push(card);
                refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
            },
        };
    }

    /**
     * `card.lua:2374` 的 Invisible Joker：从小丑区里**除自己之外**随机复制一张。
     *
     * 判空位用 `#小丑区 <= card_limit`——**这时自己还在区里**（`selling_self` 在移出之前），
     * 所以满格也能复制：卖掉自己之后正好空出那一格。复制品的 Negative 剥掉（`copy_card` 的
     * `strip_edition`），`ability` 深拷贝，复制到的若也是 Invisible Joker，它的回合数归零。
     */
    private duplicateJoker(self: Joker, key: string): void {
        const others = this.jokers.filter((j) => j !== self);
        if (others.length === 0) return;
        if (this.jokers.length > this.jokerSlots) return;
        const [chosen] = pseudorandomElement(others, this.rng.pseudoseed(key));
        if (!chosen) return;
        // `copy_card` 的 `set_ability`：复制的是 To Do List 就**照样掷一次 `to_do`**，结果被抄过来的 ability 盖掉
        if (chosen.ability.name === 'To Do List') pickToDoHand(this.rng, this.visibleHands());
        const copy: Joker = {
            ...chosen,
            ability: structuredClone(chosen.ability),
            edition: chosen.edition === 'negative' ? undefined : chosen.edition,
            T: { ...chosen.T },
            getting_sliced: false,
        };
        if (copy.ability.invis_rounds !== undefined) copy.ability.invis_rounds = 0;
        // `copy_card` 末尾的 `set_seal` → `set_cost`：剥掉 Negative 的那张便宜 5 块
        setCost(copy, this.discountPercent);
        this.jokers.push(copy);
        this.usedJokers.add(copy.key);
        this.onJokerAdded(copy);
        refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
    }

    /**
     * `card.lua:579` 的 `add_to_deck` 里与局面有关的那几条。**Boss 盲注中途**进小丑区的：
     * Chicot 当场关掉 Boss（`card.lua:596`）。买、开包都在商店里，碰不到这条；
     * 碰得到的是出牌阶段用 Judgement / The Soul / Wraith、卖 Invisible Joker。
     *
     * 其余 `add_to_deck` 效果（手牌上限、概率、Credit Card …）都是从小丑区现算的，不在这里。
     */
    private onJokerAdded(joker: Joker): void {
        if (joker.debuff || joker.ability.name !== 'Chicot') return;
        const round = this.round;
        if (round?.blind?.center.boss && round.phase === 'selecting') round.disableBlind();
    }

    /**
     * `misc_functions.lua:1604` 的 `playing_card_joker_effects`：**有扑克牌加进了牌组**，
     * 问一遍每张小丑（`Hologram` 按张数长倍率）。
     *
     * 触发点（原作）：Marble Joker、DNA（在结算里，见 `scoring.ts`）、
     * Cryptid 与 Familiar / Grim / Incantation（消耗品）、标准包里挑走一张扑克牌。
     */
    private playingCardsAdded(cards: unknown[]): void {
        if (cards.length === 0) return;
        const view = this.round?.gameView() ?? this.shopGameView();
        for (const joker of [...this.jokers]) {
            calculateJoker(joker, { playing_card_added: true, cards }, view);
        }
    }

    /**
     * `card.lua:2584` 的 `Marble Joker`：造一张扑克牌进整副牌。
     *
     * **消费一次 `pseudorandom_element(P_CARDS, pseudoseed(key))`**——
     * `P_CARDS` 是以 key 为键的表，抽取按 key 的字节序排（不是 2→A 的牌序），
     * 与标准包造牌走的是同一条路。
     *
     * 进 `fullDeck`，**这一关就在牌堆里**：原文先 `emplace` 进出牌区，紧跟着
     * `draw_card(G.play, G.deck)` 放回牌堆，而本关的洗牌排在这之后。
     * 复刻件的 `setting_blind` 那一趟跑在 `Round` 复制牌堆之前，所以直接进 `fullDeck` 就对了。
     *
     * 造完**同步**跑一趟 `playing_card_added`（原文 `playing_card_joker_effects({true})`）。
     */
    private createPlayingCard(enhancement: string | null, key: string): void {
        const [, frontKey] = pseudorandomElement(P_CARDS, this.rng.pseudoseed(key));
        const front = P_CARDS[String(frontKey)];
        const card = makeCard(String(frontKey), front.suit, front.value);
        card.enhancement = enhancement;
        this.fullDeck.push(card);
        // 整副牌变了，`Steel/Stone Joker` 与 `Driver's License` 的 tally 要跟着重算
        refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
        this.playingCardsAdded([card]);
    }

    /**
     * `card.lua:2419` 的 `Perkeo`：把消耗品区里**随机一张**复制成 Negative 的。
     *
     * Negative 的消耗品**不占格子**（`consumableSlots` 从 `negativeCount` 算），
     * 所以这里不查空位——原作也不查。
     */
    private duplicateConsumableAsNegative(key: string): void {
        const [source] = pseudorandomElement(this.consumables, this.rng.pseudoseed(key));
        if (!source) return;
        // `copy_card` 之后 `set_edition({negative = true})` → `set_cost`：**贵 5 块**
        const copy = { ...source, edition: 'negative' as const };
        setCost(copy, this.discountPercent);
        this.consumables.push(copy);
    }

    /** 喂给商店的池子上下文。**每次现建**——`jokers` 与 `grosMichelExtinct` 会变 */
    poolContext(): PoolContext {
        return {
            ante: this.ante,
            usedJokers: this.usedJokers,
            grosMichelExtinct: this.grosMichelExtinct,
            jokers: this.jokers,
            consumables: this.consumables,
            handsPlayed: Object.fromEntries(
                Object.entries(this.hands).map(([name, info]) => [name, info.played]),
            ) as Record<HandName, number>,
            firstShopBuffoon: this.firstShopBuffoon,
            discountPercent: this.vouchers.discountPercent,
            editionRate: this.vouchers.editionRate,
            rates: this.vouchers.rates,
            telescope: this.vouchers.telescope,
            visibleHands: this.visibleHands(),
        };
    }

    /** 可见的牌型，按声明序。To Do List 从这里掷 */
    private visibleHands(): HandName[] {
        return (Object.keys(this.hands) as HandName[]).filter((h) => this.hands[h].visible);
    }

    /** 兑换了哪些优惠券 → 整局参数。**每次现算**，理由见 `vouchers.ts` 文件头 */
    get vouchers(): VoucherParams {
        return voucherParams(this.usedVouchers);
    }

    /** `G.GAME.discount_percent`。Clearance Sale 之后是 25，所有 `set_cost` 都要带 */
    get discountPercent(): number {
        return this.vouchers.discountPercent;
    }

    private voucherPoolContext(inShop: string[]) {
        return { ante: this.ante, usedVouchers: this.usedVouchers, inShop };
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
            onRemoveFromDeck: (cards) => this.removeFromDeck(cards),
            onCreatePlayingCard: (enhancement, key) => this.createPlayingCard(enhancement, key),
            consumables: this.consumableHooks(),
            // `tag.lua:337` 的 Juggle Tag（`round_start_bonus`）：**只加这一回合**
            // （`temp_handsize` 在回合结束时减回去，`state_events.lua:291`）
            handSizeDelta: this.handSizeDelta + this.vouchers.handSize + this.takeRoundStartBonus(),
            handsDelta: this.vouchers.hands,
            discardsDelta: this.back.config.discards + this.vouchers.discards,
            discountPercent: this.discountPercent,
            jokerSlots: this.jokerSlots,
            jokerArea: this.jokerAreaHooks(),
            onSettingBlind: (round) => this.settingBlind(round),
            skips: this.skips,
        });

        this.roundNumber++;
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
        // `state_events.lua:142`：过关时把剩下的弃牌攒起来（Garbage Tag）
        if (won) this.unusedDiscards += round.discardsLeft;

        // `Round` 在结算里已经把小丑赚的钱写进它自己那份 dollars 了，先收回来
        this.dollars = round.dollars;
        // **读回来，不是加一遍**——`evaluatePlay` 已经经 `gameView` 的 setter
        // 把每次出牌记进 `round.handsPlayed` 了
        this.handsPlayed = round.handsPlayed;

        // `state_events.lua:597` 的 `last_hand_played` 在 `Round` 上，收回来
        this.lastHandPlayed = round.lastHandPlayed ?? this.lastHandPlayed;

        // `Cloud 9` 的 `nine_tally` 是**重算**出来的，而这一关可能销毁过牌
        // （碎掉的玻璃牌 / The Hanged Man），所以收益之前要刷一次
        refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);

        // `state_events.lua:99` 的小丑 `end_of_round` 遍历。
        // **在 `evaluate_round` 之前**——原文两者都在 `end_round` 里，
        // 小丑那一趟排在最前面（`:99`），手牌区那一趟在 `:192`，
        // 而 `evaluate_round` 是回合结算界面另外调的（`:1156`）
        this.runEndOfRoundJokers();

        // `state_events.lua:192` 的手牌区遍历：**留在手里的黄金牌各给 $3**。
        // 它排在 `evaluate_round` 之前，所以这笔钱**参与本回合的利息**——
        // 挪到收益之后会少给利息
        for (const card of round.hand) {
            const gold = getEndOfRoundDollars(card);
            if (gold > 0) this.dollars += gold;

            // `card.lua:1041`：**Blue 蜡封造「上一手打出的牌型」对应的那张星球**，
            // 不是随机星球。没打过牌就不造
            const planetHand = sealEndOfRoundPlanet(card, this.lastHandPlayed);
            if (planetHand && this.consumables.length < this.consumableSlots) {
                const key = planetKeyFor(planetHand);
                if (key) {
                    this.consumables.push(makeConsumable(key, this.discountPercent));
                    // `card.lua:350`：造出来那一刻就标 used，**别漏**——
                    // 漏了这一张就不会退出星球池，下一个商店的 `_resample` 次数跟着偏
                    this.usedJokers.add(key);
                }
            }
        }

        // `state_events.lua:1156`。**利息读的是入账前的余额**
        const payout = evaluateRound({
            won,
            blindDollars: round.blind?.center.dollars ?? 0,
            handsLeft: round.handsLeft,
            discardsLeft: round.discardsLeft,
            discardsUsed: round.discardsUsed,
            dollars: this.dollars,
            jokers: this.jokers,
            // `Satellite` 数的是「用过几种」星球，不是「用过几张」
            distinctPlanets: distinctPlanetsUsed(this.consumableUsage),
            // `To the Moon` 每张 +1。由 `runModifiers` 从小丑区重算
            interestAmount: runModifiers(this.jokers).interestAmount,
            // Seed Money
            interestCap: this.vouchers.interestCap,
            // `state_events.lua:1204`：`eval` 标签。Investment 只在**打完 Boss** 时兑现
            tagDollars: won ? this.takeEvalTags() : [],
        });
        this.dollars += payout.total;

        if (!won) {
            this.state = 'game-over';
            return { payout, won };
        }

        // `state_events.lua:113`：**判的是结算时的 Ante**（`ease_ante(1)` 还没落地），所以是 8 不是 9
        if (this.blindKind === 'boss' && this.ante === WIN_ANTE) this.won = true;

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
            // `blind_boss`：Rocket 只在打完 Boss 时涨（原文读 `G.GAME.blind.boss`）
            const effect = calculateJoker(joker, { end_of_round: true, blind_boss: this.blindKind === 'boss' }, view);
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
            // `state_events.lua:284`：打完 Boss 抽下一张优惠券。`ease_ante(1)` 的事件排在它前面，
            // 所以用的是**新 Ante** 的 key；商店已经关了，「正摆在商店里」那条不起作用
            this.currentVoucher = nextVoucherKey(this.rng, this.voucherPoolContext([]));
            // `common_events.lua:2382`：进新 Ante 时抽新 Boss，并清 `boss_rerolled`
            this.bossKey = getNewBoss(this.ante, this.rng, this.bossesUsed);
            this.bossRerolled = false;
            // `button_callbacks.lua:3062`：兑现收益时抽下一个 Ante 的两个跳过标签
            this.rollBlindTags();
        } else {
            this.blindIndex++;
        }

        // `state_events.lua:294`：**每回合都跑**这四个 reset，不只是 Ante 结束
        this.resetSpecialCards();

        // `state_events.lua:1129`：回合结算完开商店。
        // **商店在 `advanceBlind` 之后开**，所以它读的 ante 已经是新的那个——
        // 商店的所有 seed key 都带 ante（`cdt`/`rarity`/`Joker<r>sho`），
        // 在 `ante++` 之前开会用上一个 ante 的 key
        this.shop = new Shop(this.rng, () => this.poolContext(), {
            tags: this.shopTagHooks(),
            jokerMax: SHOP_JOKER_MAX + this.vouchers.shopJokerSlots,
            rerollBase: BASE_REROLL_COST - this.vouchers.rerollDiscount,
            voucher: this.currentVoucher,
        });
        // 保底那一格只可能在第一个商店被用掉，开完就置真
        this.firstShopBuffoon = true;
        this.state = 'shop';
    }

    /** 离开商店，进下一个盲注。 */
    leaveShop(): void {
        if (this.state !== 'shop') throw new Error(`现在是 ${this.state}，不在商店里`);
        if (this.openPack) throw new Error('还有补充包开着，先挑完或跳过');

        // `button_callbacks.lua:2594` 的 `context.ending_shop`。`Perkeo` 靠它
        for (const joker of [...this.jokers]) {
            calculateJoker(joker, { ending_shop: true }, this.shopGameView());
        }

        //
        // **没卖出去的那几格要还回池子。** 原作是
        // `UIBox:remove()` → `CardArea:remove()` → `remove_all(cards)`，
        // 每张 `Card:remove()` 走 `card.lua:4829` 那条 used 清除。
        // 不还回去，下一个商店的池子内容就比原版窄，`_resample` 次数跟着偏
        this.shop?.release();
        this.shop = null;
        this.enterBlindSelect();
    }

    /**
     * 买商店第 `index` 格的小丑。
     *
     * 三道闸：钱够不够、小丑区满没满、那一格是不是小丑。
     * 原作的 `can_buy` 还查 `Negative` 版本（买了不占格子），版本不在范围。
     */
    buyJoker(index: number): Joker {
        const bought = this.buy(index);
        if (bought.kind !== 'joker') throw new Error('这一格不是小丑');
        return bought.joker;
    }

    /** 买 Magic Trick 摆出来的扑克牌 */
    buyPlayingCard(index: number): Card {
        const bought = this.buy(index);
        if (bought.kind !== 'card') throw new Error('这一格不是扑克牌');
        return bought.card;
    }

    /** 买消耗品。**买得到不等于用得了**——没实现行为的塔罗照样能买，见 `useConsumable` */
    buyConsumable(index: number): Consumable {
        const bought = this.buy(index);
        if (bought.kind !== 'consumable') throw new Error('这一格不是消耗品');
        return bought.consumable;
    }

    private buy(index: number): ShopItem {
        if (!this.shop) throw new Error('不在商店里');
        const item = this.shop.items[index];
        if (!item) throw new Error(`商店没有第 ${index} 格`);
        // **现算价**：`Astronomer` 让星球牌免费，而它可能是刚买的
        const cost = this.shop.itemCost(index);
        if (!this.canAfford(cost)) throw new Error(`买不起：要 $${cost}，只有 $${this.dollars}`);
        if (item.kind === 'joker' && this.jokersFull) {
            throw new Error(`小丑区满了（${this.jokerSlots} 格）`);
        }
        if (item.kind === 'consumable' && this.consumablesFull) {
            throw new Error(`消耗品区满了（${this.consumableSlots} 格）`);
        }

        this.shop.take(index);
        this.dollars -= cost;

        if (item.kind === 'consumable') {
            this.consumables.push(item.consumable);
            return item;
        }
        if (item.kind === 'card') {
            // `button_callbacks.lua:2331`：Magic Trick 的扑克牌**进整副牌**，然后 `playing_card_joker_effects`
            this.fullDeck.push(item.card);
            refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
            this.playingCardsAdded([item.card]);
            return item;
        }

        const joker = item.joker;
        this.jokers.push(joker);
        // 小丑区变了 → 派生字段要重算（Joker Stencil 的空格子数、Swashbuckler 的卖价和）
        refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
        // `card.lua:1858` 的 `context.buying_card` 分支在原作里是空的，
        // 但调用点要留着——它是接 `Trading Card` 之类的落点
        for (const other of this.jokers) {
            calculateJoker(other, { buying_card: true }, this.round?.gameView() ?? this.shopGameView());
        }
        return item;
    }

    /** 第 `index` 张优惠券现在兑换得了吗（钱够、效果实现了） */
    canRedeemVoucher(index: number): boolean {
        const v = this.shop?.vouchers[index];
        if (!v || !this.shop || this.openPack) return false;
        return this.canAfford(this.shop.voucherCost(index)) && isVoucherImplemented(v.key);
    }

    /**
     * 兑换商店里第 `index` 张优惠券。`card.lua:1814` 的 `Card:redeem`。
     *
     * 顺序照原文：记进 `used_vouchers` → 扣钱 → **无条件**清 `current_round.voucher` →
     * `apply_to_run` → 小丑的 `buying_card`。
     *
     * 大半效果是从 `usedVouchers` 现算的（`vouchers` getter），这里只做那几件一次性的事。
     */
    redeemVoucher(index: number): ShopVoucher {
        const shop = this.shop;
        if (!shop) throw new Error('不在商店里');
        if (this.openPack) throw new Error('还有补充包开着');
        const v = shop.vouchers[index];
        if (!v) throw new Error(`商店没有第 ${index} 张优惠券`);
        if (!isVoucherImplemented(v.key)) {
            throw new Error(`${v.center.name} 在「新档 + 指定 seed」口径下不该出现`);
        }
        const cost = shop.voucherCost(index);
        if (!this.canAfford(cost)) throw new Error(`买不起：要 $${cost}，只有 $${this.dollars}`);

        shop.takeVoucher(index);
        this.usedVouchers.add(v.key);
        this.dollars -= cost;
        // `card.lua:1852`：**不管买的是不是本 Ante 那张**。买掉 Voucher Tag 给的那张，
        // 主优惠券虽然还摆在这个商店里，这个 Ante 后面的商店也不再摆
        this.currentVoucher = null;

        this.applyVoucher(v.key);

        for (const joker of this.jokers) {
            calculateJoker(joker, { buying_card: true }, this.shopGameView());
        }
        return v;
    }

    /**
     * `card.lua:1882` 的 `apply_to_run` 里**一次性**的那几条。其余（权重、版本率、
     * 出牌 / 弃牌 / 手牌上限、消耗品格、利息上限、Telescope、Director's Cut）从 `usedVouchers` 现算
     */
    private applyVoucher(key: string): void {
        const shop = this.shop!;
        switch (key) {
            case 'v_overstock_norm':
                // `change_shop_size(1)`：当场补一格
                shop.growJokerSlots(1);
                break;
            case 'v_clearance_sale':
                // `for k, v in pairs(G.I.CARD) do v:set_cost() end`：**全场重新定价**，
                // 手上的小丑与消耗品的卖价也跟着掉
                this.repriceAll();
                break;
            case 'v_reroll_surplus':
                shop.applyRerollDiscount(this.vouchers.rerollDiscount);
                break;
            case 'v_hieroglyph':
                // `ease_ante(-1)`：**当场**就是上一个 Ante，这个商店之后的重掷用新 Ante 的 key
                this.ante -= 1;
                break;
        }
    }

    /** Clearance Sale 的 `set_cost` 全场重算 */
    private repriceAll(): void {
        const d = this.discountPercent;
        for (const j of this.jokers) setCost(j, d);
        for (const c of this.consumables) setCost(c, d);
        for (const item of this.shop?.items ?? []) {
            if (item.kind === 'joker') {
                setCost(item.joker, d);
                item.cost = item.joker.cost;
            } else if (item.kind === 'consumable') {
                setCost(item.consumable, d);
                item.cost = item.consumable.cost;
            }
        }
        refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
    }

    /** Director's Cut 的重掷 Boss 现在按得了吗（`button_callbacks.lua:2895`） */
    get canRerollBoss(): boolean {
        return (
            this.state === 'blind-select' &&
            !this.openPack &&
            this.vouchers.directorsCut &&
            !this.bossRerolled &&
            this.spendable - 10 >= 0
        );
    }

    /**
     * `button_callbacks.lua:2910` 的 `reroll_boss`：花 $10 重掷这个 Ante 的 Boss，
     * 然后**再轮一次** `new_blind_choice`（`:2885`）
     */
    rerollBoss(): void {
        if (!this.canRerollBoss) throw new Error('现在不能重掷 Boss');
        this.bossRerolled = true;
        this.dollars -= 10;
        this.bossKey = getNewBoss(this.ante, this.rng, this.bossesUsed);
        this.applyNewBlindChoice();
    }

    /**
     * 买下并**立刻打开**第 `index` 个补充包格子。`card.lua:1682` 的 `Card:open`。
     *
     * 原作里买包与开包是同一个动作（按钮叫 `ml_open_target`），没有「买了放着」。
     *
     * **两趟的顺序不能反**：`open_booster` 的小丑遍历是同步的、
     * 造包里的牌那段只是入队，所以 `Hallucination` 造的塔罗**先**落地，
     * 再造包里的牌。那张塔罗会标进 `used_jokers`，改包里那几张的池子内容。
     */
    buyAndOpenPack(index: number): OpenPack {
        if (!this.shop) throw new Error('不在商店里');
        if (this.openPack) throw new Error('已经有一个补充包开着了');
        const slot = this.shop.packs[index];
        if (!slot) throw new Error(`商店没有第 ${index} 个补充包`);
        // **现算价**：`Astronomer` 可能是在这个商店里刚买的
        const cost = this.shop.packCost(index);
        if (!this.canAfford(cost)) {
            throw new Error(`买不起：要 $${cost}，只有 $${this.dollars}`);
        }
        if (!isBoosterImplemented(slot.key, BOOSTER_CENTERS)) {
            throw new Error(`${slot.center.name} 还没有实现`);
        }

        this.shop.takePack(index);
        this.dollars -= cost;

        // ① `card.lua:1799` 的 `open_booster` 遍历。**同步，排在造牌之前**
        for (const joker of [...this.jokers]) {
            calculateJoker(joker, { open_booster: true }, this.shopGameView());
        }

        // ② 造包里的 `extra` 张
        this.openPack = openBooster(this.rng, slot.center, slot.key, this.poolContext());
        return this.openPack;
    }

    /** 这一格买得了吗。表现层拿它决定按钮灰不灰 */
    canBuyPack(index: number): boolean {
        const slot = this.shop?.packs[index];
        if (!slot || !this.shop) return false;
        if (this.openPack) return false;
        if (!this.canAfford(this.shop.packCost(index))) return false;
        return isBoosterImplemented(slot.key, BOOSTER_CENTERS);
    }

    /**
     * 从开着的包里挑走第 `index` 张。挑满 `choose` 张就自动关包。
     *
     * 挑走的那张**留着 `used_jokers` 标记**（它还活着），
     * 没挑走的在关包时还回池子。
     */
    takeFromPack(index: number): PackCard {
        const pack = this.openPack;
        if (!pack) throw new Error('没有开着的补充包');
        const card = pack.cards[index];
        if (!card) throw new Error(`包里没有第 ${index} 张`);

        if (card.kind === 'joker') {
            if (this.jokersFull) throw new Error(`小丑区满了（${this.jokerSlots} 格）`);
            this.jokers.push(card.joker);
            refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
        } else if (card.kind === 'consumable') {
            if (this.consumablesFull) throw new Error(`消耗品区满了（${this.consumableSlots} 格）`);
            this.consumables.push(card.consumable);
        } else {
            // 标准包的扑克牌：**进整副牌**，牌组变大一张。
            // 不进当前这一局的牌堆——原作也是 `G.deck` 加，本局的 `Round` 已经洗过了
            this.fullDeck.push(card.card);
            refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
            // `button_callbacks.lua:2338`
            this.playingCardsAdded([card.card]);
        }

        pack.cards.splice(index, 1);
        pack.choicesLeft--;
        if (pack.choicesLeft <= 0) this.closePack();
        return card;
    }

    /** 这一张现在挑得了吗（`button_callbacks.lua:2225` 的 `can_select_card`） */
    canTakeFromPack(index: number): boolean {
        const card = this.openPack?.cards[index];
        if (!card) return false;
        if (card.kind === 'joker') return !this.jokersFull;
        if (card.kind === 'consumable') return !this.consumablesFull;
        // 扑克牌进牌组，没有格子限制
        return true;
    }

    /**
     * 跳过剩下的选择。`button_callbacks.lua:2668` 的 `skip_booster`。
     *
     * **跳过会触发小丑的 `skipping_booster` 分支**（`Red Card` 靠它长倍率），
     * 而挑满自动关包**不触发**——两条路不一样。
     */
    skipPack(): void {
        if (!this.openPack) throw new Error('没有开着的补充包');
        for (const joker of [...this.jokers]) {
            calculateJoker(joker, { skipping_booster: true }, this.shopGameView());
        }
        this.closePack();
    }

    /** 关掉开着的包：没挑走的那几张还回池子 */
    private closePack(): void {
        if (!this.openPack) return;
        releasePack(this.openPack, this.poolContext());
        this.openPack = null;
        // `button_callbacks.lua:2728`：标签开的包关掉之后，**再轮一次** `new_blind_choice`
        if (this.state === 'blind-select') this.applyNewBlindChoice();
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
        refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);

        // `card.lua:4829`：小丑区与消耗品区里都没有它了就解除 used 标记
        releaseUsed(this.poolContext(), joker.key);

        // `card.lua:2758` 的 `context.selling_card`：`Campfire` 靠它长个子
        for (const other of this.jokers) {
            calculateJoker(other, { selling_card: true }, this.round?.gameView() ?? this.shopGameView());
        }
        return joker.sell_cost;
    }

    /** 卖掉消耗品区第 `index` 张。与卖小丑同一条路，只是没有 `selling_self` 分支 */
    sellConsumable(index: number): number {
        const consumable = this.consumables[index];
        if (!consumable) throw new Error(`消耗品区没有第 ${index} 张`);

        this.consumables.splice(index, 1);
        this.dollars += consumable.sell_cost;
        releaseUsed(this.poolContext(), consumable.key);

        for (const other of this.jokers) {
            calculateJoker(other, { selling_card: true }, this.round?.gameView() ?? this.shopGameView());
        }
        return consumable.sell_cost;
    }

    /**
     * 用掉消耗品区第 `index` 张。`card.lua:1092` 的 `Card:use_consumeable`。
     *
     * **用量在效果之前记**（`card.lua:1094` 的 `set_consumeable_usage` 是第一句），
     * 所以哪怕这张卡的效果还没实现，`Fortune Teller` / `Satellite` 的计数也对得上。
     *
     * 没实现行为的塔罗**在这里抛**，不静默吞掉——与 Boss 的 `assertImplemented`
     * 同一条理由。表现层要先查 `isConsumableImplemented` 把按钮灰掉，
     * 而不是让玩家点了之后什么也不发生。
     */
    useConsumable(index: number, highlighted: Card[] = []): void {
        const consumable = this.consumables[index];
        if (!consumable) throw new Error(`消耗品区没有第 ${index} 张`);

        // `card.lua:1545` 的 `can_use_consumeable`：原作里用不了的卡**按钮是灰的**，
        // 点不下去。这里不拦的话，选 0 张就用 Death 会在效果里崩，
        // 而选 0 张用 The Magician 会**静默吞掉**这张卡（计数照记、效果为空）
        if (!this.canUseConsumable(index, highlighted)) {
            throw new Error(`${consumable.center.name} 现在用不了（选中 ${highlighted.length} 张）`);
        }

        // `card.lua:1094`：**计数在效果之前**，而且是同步的
        recordConsumableUsage(this.consumableUsage, consumable);

        // **先离开消耗品区、再跑效果**：`The Emperor` 要往区里造两张，
        // 而它自己那一格得先空出来（原作是 `remove_card` 在 `use_consumeable` 之后，
        // 但 `G.consumeables.config.card_limit > #cards` 那个判定里
        // 用掉的那张已经被 `G.GAME.consumeable_buffer` 抵掉了，等价）
        this.consumables.splice(index, 1);

        const ctx = this.useContext(highlighted);
        this.addedByConsumable = [];
        applyConsumable(consumable, ctx);

        releaseUsed(this.poolContext(), consumable.key);

        // `button_callbacks.lua:2330`：用完之后问一遍每张小丑。
        // `Constellation` 靠它长 x_mult。**漏掉这一趟它就是个空实现**——
        // 而 `isJokerImplemented` 会照样把它报成已实现
        for (const joker of [...this.jokers]) {
            calculateJoker(
                joker,
                {
                    using_consumeable: true,
                    consumeable: { set: consumable.center.set, name: consumable.center.name },
                    // `Glass Joker` 要数 The Hanged Man 毁掉了几张玻璃牌。
                    // **牌已经被毁了，但数组还在**——原文读的 `G.hand.highlighted`
                    // 那时也还没清（销毁是入队的），语义一致
                    highlighted,
                },
                this.round?.gameView() ?? this.shopGameView(),
            );
        }

        // `card.lua:1218` / `:1339`：Cryptid 与 Familiar / Grim / Incantation 造完牌，
        // **整批**跑一趟 `playing_card_added`。原文是入队的，排在上面那趟之后
        this.playingCardsAdded(this.addedByConsumable);
        this.addedByConsumable = [];

        // `misc_functions.lua:1227` 的双层嵌套 immediate：
        // **在效果之后才写**，所以 `The Fool` 读到的是上一张、不是自己
        this.lastTarotPlanet = consumable.key;
    }

    /**
     * 这张卡现在用得了吗。表现层拿它决定按钮灰不灰。
     *
     * 两件事：**实现了没有**（`isConsumableImplemented`）与
     * **这个局面允不允许**（`can_use_consumeable`）。两个都要过。
     */
    canUseConsumable(index: number, highlighted: Card[] = []): boolean {
        const consumable = this.consumables[index];
        if (!consumable) return false;
        if (!isConsumableImplemented(consumable.key)) return false;
        // 查 `canUse` 时这张牌还在区里，而效果跑的时候它已经出去了 ——
        // `The Emperor` / `The Fool` 判的是「有没有空位」，所以要按「它已经出去」来算
        const ctx = this.useContext(highlighted, consumable);
        return canUseConsumable(consumable, ctx);
    }

    /**
     * 喂给消耗品的那张宽接口。`exclude` 是正在被用掉的那一张——
     * 它在效果跑的时候已经离开消耗品区了。
     */
    private useContext(highlighted: Card[], exclude?: Consumable): UseContext {
        const consumables = exclude
            ? this.consumables.filter((c) => c !== exclude)
            : this.consumables;

        return {
            discountPercent: this.discountPercent,
            hands: this.hands,
            highlighted,
            handCards: this.round?.hand ?? [],
            jokers: this.jokers,
            consumables,
            consumableSlots: this.consumableSlots,
            jokerSlots: this.jokerSlots,
            getDollars: () => this.dollars,
            addDollars: (amount) => { this.dollars += amount; },
            removeCards: (cards) => {
                this.removeFromDeck(cards);
                this.round?.removeCards(cards);
                // `card.lua:1370`：销毁之后跑小丑的 `remove_playing_cards`。
                // 位置在销毁之后。`Glass Joker` 在这条上**数不到**——被 The Hanged Man
                // 毁掉的牌没有 `shattered`，它走下面 `using_consumeable` 那一趟
                for (const joker of this.jokers) {
                    calculateJoker(
                        joker,
                        { remove_playing_cards: true, removed: cards },
                        this.round?.gameView() ?? this.shopGameView(),
                    );
                }
            },
            addConsumable: (c) => {
                this.consumables.push(c);
                this.usedJokers.add(c.key);
            },
            addJoker: (j) => {
                this.jokers.push(j);
                this.usedJokers.add(j.key);
                this.onJokerAdded(j);
                refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
            },
            removeJoker: (j) => {
                const i = this.jokers.indexOf(j);
                if (i >= 0) this.jokers.splice(i, 1);
                releaseUsed(this.poolContext(), j.key);
                refreshDerivedAbilities(this.jokers, this.jokerSlots, this.fullDeck, this.skips);
            },
            addPlayingCard: (card) => {
                // `create_playing_card`：进整副牌**与当前这一局的手牌**
                this.fullDeck.push(card);
                this.round?.addToHand(card);
                this.addedByConsumable.push(card);
            },
            changeHandSize: (delta) => { this.handSizeDelta += delta; },
            createConsumable: (set, keyAppend) =>
                createConsumableCard(this.rng, set, this.poolContext(), keyAppend),
            createJoker: (keyAppend, options) =>
                createJokerCard(this.rng, this.poolContext(), keyAppend, 'none', options),
            makeConsumable: (key) => makeConsumable(key, this.discountPercent),
            lastTarotPlanet: this.lastTarotPlanet,
            probabilities: { normal: runModifiers(this.jokers).probabilityNormal },
            pseudorandom: (key) => this.rng.pseudorandom(key),
            pickRandom: (list, key) => pseudorandomElement(list, this.rng.pseudoseed(key))[0],
            shuffled: <T,>(list: T[], key: string) => {
                // `pseudoshuffle` 的签名要 `{sort_id?}`（它对有 sort_id 的先排一遍），
                // 而这里只可能是扑克牌，确实有
                const copy = [...list] as Array<{ sort_id?: number }>;
                pseudoshuffle(copy, this.rng.pseudoseed(key));
                return copy as T[];
            },
            nextEctoplasmMinus: () => this.ectoMinus++,
        };
    }

    /**
     * `G.GAME.bankrupt_at`：钱最低能花到多少。基线 0，**每张 Credit Card -20**
     * （`card.lua:593` 的 `add_to_deck`，卖掉 / 被毁 / 被 debuff 时 `remove_from_deck` 加回来）。
     *
     * 复刻件从小丑区**现算**，不增量维护——与 `runModifiers` 同一条理由：
     * 小丑会被卖、被毁、被 debuff，增量一处漏了下限就永久跑偏。
     */
    get bankruptAt(): number {
        let at = 0;
        for (const j of this.jokers) {
            if (!j.debuff && j.ability.name === 'Credit Card') at -= j.ability.extra;
        }
        return at;
    }

    /** 现在最多能花多少：`dollars - bankrupt_at`。有 Credit Card 时可以花到负数 */
    get spendable(): number {
        return this.dollars - this.bankruptAt;
    }

    /**
     * `button_callbacks.lua:92` 的 `can_buy`：`cost > dollars - bankrupt_at and cost > 0` 就买不起。
     * **免费的永远买得起**（Astronomer 的星球），哪怕已经欠到底。
     */
    canAfford(cost: number): boolean {
        return cost <= 0 || cost <= this.spendable;
    }

    /** 重掷商店。`button_callbacks.lua:2965`。 */
    rerollShop(): void {
        if (!this.shop) throw new Error('不在商店里');
        const cost = this.shop.rerollCost;
        if (!this.canAfford(cost)) throw new Error(`重掷不起：要 $${cost}，只有 $${this.dollars}`);
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
            consumeable_usage_tarot: this.consumableUsage.total.tarot,
            consumableCount: this.consumables.length,
            consumable_slots: this.consumableSlots,
            consumableCards: this.consumables,
            duplicateConsumableAsNegative: (key) => this.duplicateConsumableAsNegative(key),
            createConsumable: (set, keyAppend) => this.consumableHooks().create(set, keyAppend),
            createPlayingCard: (enhancement, key) => this.createPlayingCard(enhancement, key),
            duplicateJoker: (self, key) => this.duplicateJoker(self, key),
            // 商店里没有正在打的盲注：卖掉 Luchador 什么也不发生（原文判 `G.GAME.blind` 是不是 Boss）
            disableBoss: () => {},
            addTag: (key) => this.addTag(makeTag(key)),
            deckCount: this.fullDeck.length,
            startingDeckSize: this.fullDeck.length,
            playingCardCount: this.fullDeck.length,
            smeared: runModifiers(this.jokers).smeared,
            ante: this.ante,
            discount_percent: this.discountPercent,
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

    /**
     * 从整副牌里永久拿走几张。现在只有碎掉的玻璃牌走这条。
     * **必须动 `fullDeck`**——它是跨回合共享的那一批对象，只删这一局的堆不够。
     */
    private removeFromDeck(cards: Card[]): void {
        for (const card of cards) {
            const i = this.fullDeck.indexOf(card);
            if (i >= 0) this.fullDeck.splice(i, 1);
        }
    }

    /**
     * `misc_functions.lua:1855` 的 `joker_slots`。
     *
     * **每张 Negative 小丑 +1 格**（`card.lua:412`）。原作是
     * `set_edition` 里加减 `card_limit`，本复刻按「重算不增量」的口径
     * 从小丑区数一遍——理由与 `runModifiers` 那三处一样（见 README）。
     */
    get jokerSlots(): number {
        return STARTING_PARAMS.joker_slots + negativeCount(this.jokers);
    }

    /** 小丑区满了没有。买小丑之前要查 */
    get jokersFull(): boolean {
        return this.jokers.length >= this.jokerSlots;
    }

    /**
     * `misc_functions.lua:1862` 的 `consumable_slots`。
     * **每张 Negative 消耗品 +1 格**（`card.lua:410`）。
     */
    get consumableSlots(): number {
        return STARTING_PARAMS.consumable_slots + this.vouchers.consumableSlots + negativeCount(this.consumables);
    }

    get consumablesFull(): boolean {
        return this.consumables.length >= this.consumableSlots;
    }
}
