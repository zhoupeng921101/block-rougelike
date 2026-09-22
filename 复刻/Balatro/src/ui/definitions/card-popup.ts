/**
 * 卡牌的悬停提示框（22 号票）：`card.lua:708` 的 `Card:generate_UIBox_ability_table`（每张卡的 `loc_vars`）、
 * `common_events.lua:2457` 的 `generate_card_ui`、`UI_definitions.lua:1176` 的 `G.UIDEF.card_h_popup`
 * 以及 `create_badge` / `get_badge_colour` / `desc_from_rows` / `info_tip_from_rows` / `name_from_rows`。逐支直译。
 *
 * 输入是「原作同形」的卡：`centerKey` 查 `P_CENTERS`（原作的表原样导出），`ability` 与 `Card:set_ability` 同形
 * （复刻件的 `Joker.ability` 就是）。读到的 `G.GAME` 状态由 `PopupGame` 传进来。
 *
 * 复刻件没有收藏 / 解锁进度，一律按「已发现、已解锁」画（原作里 `bypass_discovery_ui` / `bypass_lock` 的效果）。
 */
import { C, type Colour, adjustAlpha, darken, lighten, mixColours } from '../colours';
import { P_CENTERS, P_TAGS, type PCenter } from '../descriptions.generated';
import { DynaText } from '../dynatext';
import { V_DICTIONARY } from '../lang.generated';
import { type LocVars, locMisc, locNameText, localize } from '../localize';
import { type UINodeDef, UIT } from '../uibox';
import { numberFormat } from '../format';

/** 提示框会读的 `G.GAME` 与区域状态 */
export type PopupGame = {
    probabilitiesNormal: number;
    /** `G.GAME.hands`：星球牌要等级、每级加多少 */
    hands: Record<string, { level: number; l_mult: number; l_chips: number }>;
    /** `G.GAME.consumeable_usage_total.tarot`（Fortune Teller） */
    tarotUsed: number;
    /** `G.GAME.consumeable_usage` 里 set 为 Planet 的种数（Satellite） */
    planetsUsed: number;
    dollars: number;
    /** `G.GAME.current_round` 的四个每回合随机项 */
    idolCard: { rank: string; suit: string };
    ancientSuit: string;
    castleSuit: string;
    mailRank: string;
    startingDeckSize: number;
    /** `#G.playing_cards` 与 `#G.deck.cards` */
    playingCards: number;
    deckCards: number;
    /** `G.jokers.cards`：Abstract Joker 数张数、Temperance 数卖价、Ankh / Invisible Joker 找负片 */
    jokers: Array<{ sell_cost: number; negative: boolean }>;
    lastTarotPlanet?: string;
    ectoMinus: number;
    /** Luchador：现在有没有能关掉的 Boss */
    bossDisableable: boolean;
    /** `G.F_MOBILE`：描述字号 ×1.45、Misprint 字号 ×1.45 */
    mobile: boolean;
};

/** 提示框读的那张卡 */
export type PopupCard = {
    centerKey: string;
    // biome-ignore lint: 与 Lua 同形的 ability，字段因卡而异
    ability: Record<string, any>;
    base?: { value: string; suit: string; nominal: number };
    edition?: string;
    seal?: string;
    debuff?: boolean;
    /** 图鉴里没解锁 / 没发现的（`generate_UIBox_ability_table` 的 `card_type = 'Locked' / 'Undiscovered'`） */
    display?: 'Locked' | 'Undiscovered';
    /** 在哪个区（Blueprint / Brainstorm / Luchador 只在小丑区显示额外一行） */
    area?: 'jokers' | 'consumeables' | 'hand' | 'shop' | 'pack' | 'other';
};

/** `generate_card_ui` 的 `full_UI_table` */
export type CardUi = {
    main: UINodeDef[][];
    info: Array<UINodeDef[][] & { name?: string }>;
    name: UINodeDef[] | true | null;
    badges: string[] & { card_type?: string; force_rarity?: boolean };
    card_type?: string;
};

type Center = PCenter & { key: string; vars?: LocVars };

function center(key: string): Center {
    const c = P_CENTERS[key] ?? P_TAGS[key];
    if (!c) throw new Error(`没有 center ${key}`);
    return { ...c, key };
}

// ————————————————————————————————————————————————————————————————
// Card:generate_UIBox_ability_table
// ————————————————————————————————————————————————————————————————

type LocResult = { loc_vars?: LocVars; main_start?: UINodeDef[]; main_end?: UINodeDef[] };

const withColours = (vars: Array<string | number | undefined>, colours: Colour[]): LocVars => Object.assign(vars, { colours });

/** 小丑那一长串 `elseif self.ability.name == …`（`card.lua:731`–`:925`） */
function jokerLocVars(card: PopupCard, g: PopupGame): LocResult {
    const a = card.ability;
    const e = a.extra;
    const p = `${g.probabilitiesNormal}`;
    switch (a.name as string) {
        case 'Joker': return { loc_vars: [a.mult] };
        case 'Jolly Joker': case 'Zany Joker': case 'Mad Joker': case 'Crazy Joker': case 'Droll Joker':
            return { loc_vars: [a.t_mult, locMisc(a.type, 'poker_hands')] };
        case 'Sly Joker': case 'Wily Joker': case 'Clever Joker': case 'Devious Joker': case 'Crafty Joker':
            return { loc_vars: [a.t_chips, locMisc(a.type, 'poker_hands')] };
        case 'Half Joker': return { loc_vars: [e.mult, e.size] };
        case 'Fortune Teller': return { loc_vars: [e, g.tarotUsed] };
        case 'Steel Joker': return { loc_vars: [e, 1 + e * (a.steel_tally ?? 0)] };
        case 'Chaos the Clown': return { loc_vars: [e] };
        case 'Space Joker': return { loc_vars: [p, e] };
        case 'Stone Joker': return { loc_vars: [e, e * (a.stone_tally ?? 0)] };
        case 'Drunkard': return { loc_vars: [a.d_size] };
        case 'Green Joker': return { loc_vars: [e.hand_add, e.discard_sub, a.mult] };
        case 'Credit Card': return { loc_vars: [e] };
        case 'Greedy Joker': case 'Lusty Joker': case 'Wrathful Joker': case 'Gluttonous Joker':
            return { loc_vars: [e.s_mult, locMisc(e.suit, 'suits_singular')] };
        case 'Blue Joker': return { loc_vars: [e, e * g.deckCards] };
        case 'Sixth Sense': return { loc_vars: [] };
        case 'Hack': return { loc_vars: [e + 1] };
        case 'Faceless Joker': return { loc_vars: [e.dollars, e.faces] };
        case 'Juggler': return { loc_vars: [a.h_size] };
        case 'Golden Joker': return { loc_vars: [e] };
        case 'Joker Stencil': return { loc_vars: [a.x_mult] };
        case 'Ceremonial Dagger': return { loc_vars: [a.mult] };
        case 'Banner': return { loc_vars: [e] };
        case 'Misprint': {
            // 原作是两个随机滚动的 DynaText（`random_element`）；复刻件先定格在第一帧
            const k = g.mobile ? 1.45 : 1;
            return { main_start: [
                { n: UIT.T, config: { text: '   +', colour: C.MULT, scale: 0.32 * k } },
                { n: UIT.O, config: { object: new DynaText({ string: [String(e.min)], colours: [C.RED], silent: true, scale: 0.32 * k }) } },
                { n: UIT.O, config: { object: new DynaText({ string: [` ${locMisc('k_mult')} `], colours: [C.UI.TEXT_DARK], silent: true, scale: 0.32 * k }) } },
            ] };
        }
        case 'Mystic Summit': return { loc_vars: [e.mult, e.d_remaining] };
        case 'Loyalty Card': return { loc_vars: [e.Xmult, e.every + 1, locVariable(a.loyalty_remaining === 0 ? 'loyalty_active' : 'loyalty_inactive', [a.loyalty_remaining])] };
        case '8 Ball': return { loc_vars: [p, e] };
        case 'Dusk': return { loc_vars: [e + 1] };
        case 'Fibonacci': return { loc_vars: [e] };
        case 'Scary Face': return { loc_vars: [e] };
        case 'Abstract Joker': return { loc_vars: [e, g.jokers.length * e] };
        case 'Delayed Gratification': return { loc_vars: [e] };
        case 'Gros Michel': return { loc_vars: [e.mult, p, e.odds] };
        case 'Even Steven': return { loc_vars: [e] };
        case 'Odd Todd': return { loc_vars: [e] };
        case 'Scholar': return { loc_vars: [e.mult, e.chips] };
        case 'Business Card': return { loc_vars: [p, e] };
        case 'Spare Trousers': return { loc_vars: [e, locMisc('Two Pair', 'poker_hands'), a.mult] };
        case 'Superposition': return { loc_vars: [e] };
        case 'Ride the Bus': return { loc_vars: [e, a.mult] };
        case 'Egg': return { loc_vars: [e] };
        case 'Burglar': return { loc_vars: [e] };
        case 'Blackboard': return { loc_vars: [e, locMisc('Spades', 'suits_plural'), locMisc('Clubs', 'suits_plural')] };
        case 'Runner': return { loc_vars: [e.chips, e.chip_mod] };
        case 'Ice Cream': return { loc_vars: [e.chips, e.chip_mod] };
        case 'DNA': return { loc_vars: [e] };
        case 'Constellation': return { loc_vars: [e, a.x_mult] };
        case 'Hiker': return { loc_vars: [e] };
        case 'To Do List': return { loc_vars: [e.dollars, locMisc(a.to_do_poker_hand, 'poker_hands')] };
        case 'Blueprint': case 'Brainstorm': return { main_end: card.area === 'jokers' ? blueprintCompat(a) : undefined };
        case 'Astronomer': return { loc_vars: [e] };
        case 'Golden Ticket': return { loc_vars: [e] };
        case 'Acrobat': return { loc_vars: [e] };
        case 'Sock and Buskin': return { loc_vars: [e + 1] };
        case 'Swashbuckler': return { loc_vars: [a.mult] };
        case 'Troubadour': return { loc_vars: [e.h_size, -e.h_plays] };
        case 'Certificate': return { loc_vars: [e] };
        case 'Throwback': return { loc_vars: [e, a.x_mult] };
        case 'Hanging Chad': return { loc_vars: [e] };
        case 'Rough Gem': return { loc_vars: [e] };
        case 'Bloodstone': return { loc_vars: [p, e.odds, e.Xmult] };
        case 'Arrowhead': return { loc_vars: [e] };
        case 'Onyx Agate': return { loc_vars: [e] };
        case 'Glass Joker': return { loc_vars: [e, a.x_mult] };
        case 'Flower Pot': return { loc_vars: [e] };
        case 'Wee Joker': return { loc_vars: [e.chips, e.chip_mod] };
        case 'Merry Andy': return { loc_vars: [a.d_size, a.h_size] };
        case 'The Idol':
            return { loc_vars: withColours([e, locMisc(g.idolCard.rank, 'ranks'), locMisc(g.idolCard.suit, 'suits_plural')], [C.SUITS[g.idolCard.suit]!]) };
        case 'Seeing Double': return { loc_vars: [e] };
        case 'Matador': return { loc_vars: [e] };
        case 'Hit the Road': return { loc_vars: [e, a.x_mult] };
        case 'The Duo': case 'The Trio': case 'The Family': case 'The Order': case 'The Tribe':
            return { loc_vars: [a.x_mult, locMisc(a.type, 'poker_hands')] };
        case 'Cavendish': return { loc_vars: [e.Xmult, p, e.odds] };
        case 'Card Sharp': return { loc_vars: [e.Xmult] };
        case 'Red Card': return { loc_vars: [e, a.mult] };
        case 'Madness': return { loc_vars: [e, a.x_mult] };
        case 'Square Joker': return { loc_vars: [e.chips, e.chip_mod] };
        case 'Seance': return { loc_vars: [locMisc(e.poker_hand, 'poker_hands')] };
        case 'Riff-raff': return { loc_vars: [e] };
        case 'Vampire': return { loc_vars: [e, a.x_mult] };
        case 'Hologram': return { loc_vars: [e, a.x_mult] };
        case 'Vagabond': return { loc_vars: [e] };
        case 'Baron': return { loc_vars: [e] };
        case 'Cloud 9': return { loc_vars: [e, e * (a.nine_tally ?? 0)] };
        case 'Rocket': return { loc_vars: [e.dollars, e.increase] };
        case 'Obelisk': return { loc_vars: [e, a.x_mult] };
        case 'Luchador': {
            if (card.area !== 'jokers') return {};
            return { main_end: [
                { n: UIT.C, config: { align: 'bm', minh: 0.4 }, nodes: [
                    { n: UIT.C, config: { align: 'm', colour: g.bossDisableable ? C.GREEN : C.RED, r: 0.05, padding: 0.06 }, nodes: [
                        { n: UIT.T, config: { text: ` ${locMisc(g.bossDisableable ? 'k_active' : 'ph_no_boss_active')} `, colour: C.UI.TEXT_LIGHT, scale: 0.32 * 0.9 } },
                    ] },
                ] },
            ] };
        }
        case 'Photograph': return { loc_vars: [e] };
        case 'Gift Card': return { loc_vars: [e] };
        case 'Turtle Bean': return { loc_vars: [e.h_size, e.h_mod] };
        case 'Erosion': return { loc_vars: [e, Math.max(0, e * (g.startingDeckSize - g.playingCards)), g.startingDeckSize] };
        case 'Reserved Parking': return { loc_vars: [e.dollars, p, e.odds] };
        case 'Mail-In Rebate': return { loc_vars: [e, locMisc(g.mailRank, 'ranks')] };
        case 'To the Moon': return { loc_vars: [e] };
        case 'Hallucination': return { loc_vars: [g.probabilitiesNormal, e] };
        case 'Lucky Cat': return { loc_vars: [e, a.x_mult] };
        case 'Baseball Card': return { loc_vars: [e] };
        case 'Bull': return { loc_vars: [e, e * Math.max(0, g.dollars)] };
        case 'Diet Cola': return { loc_vars: [locNameText('Tag', 'tag_double')] };
        case 'Trading Card': return { loc_vars: [e] };
        case 'Flash Card': return { loc_vars: [e, a.mult] };
        case 'Popcorn': return { loc_vars: [a.mult, e] };
        case 'Ramen': return { loc_vars: [a.x_mult, e] };
        case 'Ancient Joker':
            return { loc_vars: withColours([e, locMisc(g.ancientSuit, 'suits_singular')], [C.SUITS[g.ancientSuit]!]) };
        case 'Walkie Talkie': return { loc_vars: [e.chips, e.mult] };
        case 'Seltzer': return { loc_vars: [e] };
        case 'Castle':
            return { loc_vars: withColours([e.chip_mod, locMisc(g.castleSuit, 'suits_singular'), e.chips], [C.SUITS[g.castleSuit]!]) };
        case 'Smiley Face': return { loc_vars: [e] };
        case 'Campfire': return { loc_vars: [e, a.x_mult] };
        case 'Stuntman': return { loc_vars: [e.chip_mod, e.h_size] };
        case 'Invisible Joker': return { loc_vars: [e, a.invis_rounds] };
        case 'Satellite': return { loc_vars: [e, g.planetsUsed * e] };
        case 'Shoot the Moon': return { loc_vars: [e] };
        case "Driver's License": return { loc_vars: [e, a.driver_tally ?? '0'] };
        case 'Bootstraps': return { loc_vars: [e.mult, e.dollars, e.mult * Math.floor(g.dollars / e.dollars)] };
        case 'Caino': return { loc_vars: [e, a.caino_xmult] };
        case 'Triboulet': return { loc_vars: [e] };
        case 'Yorick': return { loc_vars: [e.xmult, e.discards, a.yorick_discards, a.x_mult] };
        case 'Perkeo': return { loc_vars: [e] };
        default: return {};
    }
}

/** `localize{type = 'variable'}`：v_dictionary 的 `#n#` 替换 */
function locVariable(key: string, vars: Array<string | number>): string {
    const src = V_DICTIONARY[key] ?? 'ERROR';
    return src.replace(/#(\d+)#/g, (_, n: string) => String(vars[Number(n) - 1]));
}

/** Blueprint / Brainstorm 在小丑区里多一行「compatible / incompatible」（`G.FUNCS.blueprint_compat`） */
function blueprintCompat(a: Record<string, unknown>): UINodeDef[] {
    const compat = a.blueprint_compat as string | undefined;
    const colour = compat === 'compatible' ? mixColours(C.GREEN, C.JOKER_GREY, 0.8)
        : compat === 'incompatible' ? mixColours(C.RED, C.JOKER_GREY, 0.8) : C.JOKER_GREY;
    const text = compat ? ` ${locMisc(`k_${compat}`)} ` : '';
    return [
        { n: UIT.C, config: { align: 'bm', minh: 0.4 }, nodes: [
            { n: UIT.C, config: { align: 'm', colour, r: 0.05, padding: 0.06 }, nodes: [
                { n: UIT.T, config: { text, colour: C.UI.TEXT_LIGHT, scale: 0.32 * 0.8 } },
            ] },
        ] },
    ];
}

/**
 * `generate_card_ui` 的 Locked 那一支按名字填的 `loc_vars`（`common_events.lua:2508` 起）。
 * 读生涯统计的那几项（`career_stats.c_losses` 之类）复刻件没有生涯统计，按新档的 0
 */
function unlockVars(c: Center): LocVars {
    const u = (c.unlock_condition ?? {}) as Record<string, any>;
    const ex = u.extra as any;
    const hand = (k: string) => locMisc(k, 'poker_hands');
    switch (c.name) {
        case 'Mr. Bones': case 'Acrobat': case 'Sock and Buskin': case 'Swashbuckler': case 'Burnt Joker':
        case 'Overstock Plus': case 'Tarot Tycoon': case 'Planet Tycoon': case 'Reroll Glut': case 'Omen Globe': case 'Observatory':
        case 'Nacho Tong': case 'Recyclomancy': case 'Money Tree': case 'Antimatter': case 'Illusion':
            return [ex, 0];
        case 'Troubadour': case 'Satellite': case 'Liquidation': case 'Glow Up': case 'Petroglyph': case 'Retcon': case 'Palette':
            return [ex];
        case 'Smeared Joker': case 'Glass Joker':
            return [ex.count, locNameText('Enhanced', ex.e_key)];
        case 'Hanging Chad': case 'The Duo': case 'The Trio': case 'The Family': case 'The Order': case 'The Tribe':
            return [hand(ex)];
        case 'Rough Gem': case 'Bloodstone': case 'Arrowhead': case 'Onyx Agate':
            return [ex.count, locMisc(ex.suit, 'suits_singular')];
        case 'Showman': case 'Flower Pot':
            return [u.ante];
        case 'Wee Joker': case 'Merry Andy':
            return [u.n_rounds];
        case 'Oops! All 6s': case 'The Idol': case 'Stuntman':
            return [numberFormat(u.chips)];
        case 'Seeing Double':
            return [locMisc('ph_4_7_of_clubs')];
        case "Driver's License": case 'Bootstraps':
            return [ex.count];
        case 'Cartomancer':
            return [u.tarot_count];
        default:
            return [];
    }
}

/** `Card:generate_UIBox_ability_table` */
export function abilityTable(card: PopupCard, g: PopupGame): CardUi {
    const a = card.ability;
    const cardType: string = card.display ?? a.set ?? 'None';
    let loc: LocResult = {};
    // biome-ignore lint: loc_vars 在扑克牌那一支是个带字段的表
    let specific: any;
    if (card.debuff) {
        specific = { debuffed: true, playing_card: !!card.base, value: card.base?.value, suit: card.base?.suit, colour: card.base ? C.SUITS[card.base.suit] : undefined };
    } else if (cardType === 'Default' || cardType === 'Enhanced') {
        const bonus = (a.bonus ?? 0) + (a.perma_bonus ?? 0);
        specific = {
            playing_card: !!card.base, value: card.base?.value, suit: card.base?.suit, colour: card.base ? C.SUITS[card.base.suit] : undefined,
            nominal_chips: card.base && card.base.nominal > 0 ? card.base.nominal : undefined,
            bonus_chips: bonus > 0 ? bonus : undefined,
        };
    } else if (card.display) {
        // 锁住 / 没发现的不填 loc_vars
    } else if (a.set === 'Joker') {
        loc = jokerLocVars(card, g);
        specific = loc.loc_vars;
    }
    const badges = [] as unknown as CardUi['badges'];
    if (cardType !== 'Locked' && cardType !== 'Undiscovered' && cardType !== 'Default' || card.debuff) badges.card_type = cardType;
    if (card.edition) {
        if (card.edition === 'negative' && a.consumeable) badges.push('negative_consumable');
        else badges.push(card.edition === 'holo' ? 'holographic' : card.edition);
    }
    if (card.seal) badges.push(`${card.seal.toLowerCase()}_seal`);
    return generateCardUi(center(card.centerKey), null, specific, cardType, badges, cardType === 'Undiscovered', loc.main_start, loc.main_end, g);
}

/** `Tag:get_uibox_table` 读的 `G.GAME` 那几项 */
export type TagPopupGame = { handsPlayed: number; unusedDiscards: number; skips: number };

/**
 * `tag.lua:546` 的 `Tag:get_uibox_table`：按标签名填 `loc_vars`，再 `generate_card_ui(G.P_TAGS[key], nil, loc_vars, 'Tag')`。
 * `hide_ability` 在 1.0.1o 里从没被赋值，所以恒按已发现画。Orbital 没有掷过牌型时显示 `[poker hand]`
 */
export function tagAbilityTable(key: string, orbitalHand: string | undefined, t: TagPopupGame, g: PopupGame, hideAbility = false): CardUi {
    const c = center(key);
    const cfg = c.config as Record<string, number>;
    let locVars: Array<string | number> = [];
    switch (c.name) {
        case 'Investment Tag': locVars = [cfg.dollars!]; break;
        case 'Handy Tag': locVars = [cfg.dollars_per_hand!, cfg.dollars_per_hand! * t.handsPlayed]; break;
        case 'Garbage Tag': locVars = [cfg.dollars_per_discard!, cfg.dollars_per_discard! * t.unusedDiscards]; break;
        case 'Juggle Tag': locVars = [cfg.h_size!]; break;
        case 'Top-up Tag': locVars = [cfg.spawn_jokers!]; break;
        case 'Skip Tag': locVars = [cfg.skip_bonus!, cfg.skip_bonus! * (t.skips + 1)]; break;
        case 'Orbital Tag': locVars = [orbitalHand ?? `[${locMisc('k_poker_hand')}]`, cfg.levels!]; break;
        case 'Economy Tag': locVars = [cfg.max!]; break;
    }
    // 图鉴里没发现的标签 `hide_ability`：Undiscovered、藏描述（`tag.lua:560`）
    return generateCardUi(c, null, locVars, hideAbility ? 'Undiscovered' : 'Tag', undefined, hideAbility, undefined, undefined, g);
}

// ————————————————————————————————————————————————————————————————
// generate_card_ui
// ————————————————————————————————————————————————————————————————

/** 一行里放一串节点（`desc_nodes[#desc_nodes+1] = main_start`） */
type Rows = UINodeDef[][];

export function generateCardUi(
    c: Center,
    full: CardUi | null,
    // biome-ignore lint: specific_vars 在扑克牌与小丑两支形状不同
    specific: any,
    cardType: string | undefined,
    badges: CardUi['badges'] | undefined,
    hideDesc: boolean,
    mainStart: UINodeDef[] | undefined,
    mainEnd: UINodeDef[] | undefined,
    g: PopupGame,
): CardUi {
    let firstPass = false;
    if (!full) {
        firstPass = true;
        full = { main: [], info: [], name: null, badges: badges ?? ([] as unknown as CardUi['badges']) };
    }
    const mobile = g.mobile;
    // 原文 `(not full_UI_table.name and main) or info`：有名字时紧接着换成 info 里新开的一格
    let descNodes: Rows & { name?: string } = full.main;
    let nameOverride: string | undefined;
    const infoQueue: Center[] = [];

    if (full.name) {
        const box = [] as Rows & { name?: string };
        full.info.push(box);
        descNodes = box;
    }

    if (!full.name) {
        if (specific?.no_name) full.name = true;
        else if (cardType === 'Locked') full.name = localize({ type: 'name', set: 'Other', key: 'locked', mobile }) ?? null;
        else if (cardType === 'Undiscovered') full.name = localize({ type: 'name', set: 'Other', key: `undiscovered_${c.set.toLowerCase()}`, mobile }) ?? null;
        else if (specific && (cardType === 'Default' || cardType === 'Enhanced')) {
            if (c.name === 'Stone Card') full.name = true;
            if (specific.playing_card && c.name !== 'Stone Card') {
                const nodes: Rows = [];
                localize({ type: 'other', key: 'playing_card', nodes, mobile,
                    vars: withColours([locMisc(specific.value, 'ranks'), locMisc(specific.suit, 'suits_plural')], [specific.colour]) });
                full.name = nodes[0] ?? null;
            }
        } else if (cardType === 'Booster') {
            // 名字在下面 Booster 那一支里取
        } else {
            full.name = localize({ type: 'name', set: c.set, key: c.key, mobile }) ?? null;
        }
        full.card_type = cardType ?? c.set;
    }

    let locVars: LocVars = [];
    if (mainStart) descNodes.push(mainStart);

    if (c.set === 'Other') {
        localize({ type: 'other', key: c.key, nodes: descNodes, vars: specific ?? c.vars, mobile });
    } else if (cardType === 'Locked') {
        localize({ type: 'unlocks', key: c.key, set: c.set, nodes: descNodes, vars: unlockVars(c), mobile });
    } else if (hideDesc) {
        localize({ type: 'other', key: `undiscovered_${c.set.toLowerCase()}`, nodes: descNodes, mobile });
    } else if (specific?.debuffed) {
        localize({ type: 'other', key: `debuffed_${specific.playing_card ? 'playing_card' : 'default'}`, nodes: descNodes, mobile });
    } else if (c.set === 'Joker') {
        if (c.name === 'Stone Joker' || c.name === 'Marble Joker') infoQueue.push(center('m_stone'));
        else if (c.name === 'Steel Joker') infoQueue.push(center('m_steel'));
        else if (c.name === 'Glass Joker') infoQueue.push(center('m_glass'));
        else if (c.name === 'Golden Ticket') infoQueue.push(center('m_gold'));
        else if (c.name === 'Lucky Cat') infoQueue.push(center('m_lucky'));
        else if (c.name === 'Midas Mask') infoQueue.push(center('m_gold'));
        else if (c.name === 'Invisible Joker') {
            if (g.jokers.some((j) => j.negative)) {
                const nodes: Rows = [];
                localize({ type: 'other', key: 'remove_negative', nodes, vars: [], mobile });
                mainEnd = nodes[0];
            }
        } else if (c.name === 'Diet Cola') infoQueue.push({ ...center('tag_double'), key: 'tag_double', set: 'Tag' });
        else if (c.name === 'Perkeo') infoQueue.push({ name: 'Negative', key: 'e_negative_consumable', set: 'Edition', config: { extra: 1 } });
        localize({ type: 'descriptions', key: c.key, set: c.set, nodes: descNodes, vars: specific ?? [], mobile });
    } else if (c.set === 'Tag') {
        const tagInfo: Record<string, string> = {
            'Negative Tag': 'e_negative', 'Foil Tag': 'e_foil', 'Holographic Tag': 'e_holo', 'Polychrome Tag': 'e_polychrome',
            'Charm Tag': 'p_arcana_mega_1', 'Meteor Tag': 'p_celestial_mega_1', 'Ethereal Tag': 'p_spectral_normal_1',
            'Standard Tag': 'p_standard_mega_1', 'Buffoon Tag': 'p_buffoon_mega_1',
        };
        if (tagInfo[c.name]) infoQueue.push(center(tagInfo[c.name]!));
        localize({ type: 'descriptions', key: c.key, set: 'Tag', nodes: descNodes, vars: specific ?? [], mobile });
    } else if (c.set === 'Voucher') {
        const n = c.name;
        const cfg = c.config;
        if (['Tarot Merchant', 'Tarot Tycoon', 'Planet Merchant', 'Planet Tycoon'].includes(n)) locVars = [cfg.extra_disp];
        else if (['Hone', 'Glow Up', 'Reroll Surplus', 'Reroll Glut', 'Grabber', 'Nacho Tong', 'Wasteful', 'Recyclomancy',
            'Hieroglyph', 'Petroglyph', "Director's Cut", 'Retcon', 'Paint Brush', 'Palette', 'Telescope', 'Observatory',
            'Clearance Sale', 'Liquidation'].includes(n)) locVars = [cfg.extra];
        else if (n === 'Seed Money' || n === 'Money Tree') locVars = [cfg.extra / 5];
        localize({ type: 'descriptions', key: c.key, set: c.set, nodes: descNodes, vars: locVars, mobile });
    } else if (c.set === 'Edition') {
        localize({ type: 'descriptions', key: c.key, set: c.set, nodes: descNodes, vars: [c.config.extra], mobile });
    } else if (c.set === 'Default' && specific) {
        if (specific.nominal_chips) localize({ type: 'other', key: 'card_chips', nodes: descNodes, vars: [specific.nominal_chips], mobile });
        if (specific.bonus_chips) localize({ type: 'other', key: 'card_extra_chips', nodes: descNodes, vars: [specific.bonus_chips], mobile });
    } else if (c.set === 'Enhanced') {
        if (specific && c.name !== 'Stone Card' && specific.nominal_chips) {
            localize({ type: 'other', key: 'card_chips', nodes: descNodes, vars: [specific.nominal_chips], mobile });
        }
        const cfg = c.config;
        if (c.effect === 'Mult Card') locVars = [cfg.mult];
        else if (c.effect === 'Glass Card') locVars = [cfg.Xmult, g.probabilitiesNormal, cfg.extra];
        else if (c.effect === 'Steel Card') locVars = [cfg.h_x_mult];
        else if (c.effect === 'Stone Card') locVars = [specific?.bonus_chips ?? cfg.bonus];
        else if (c.effect === 'Gold Card') locVars = [cfg.h_dollars];
        else if (c.effect === 'Lucky Card') locVars = [g.probabilitiesNormal, cfg.mult, 5, cfg.p_dollars, 15];
        localize({ type: 'descriptions', key: c.key, set: c.set, nodes: descNodes, vars: locVars, mobile });
        const extra = specific?.bonus_chips ?? cfg.bonus;
        if (c.name !== 'Stone Card' && extra) localize({ type: 'other', key: 'card_extra_chips', nodes: descNodes, vars: [extra], mobile });
    } else if (c.set === 'Booster') {
        // 'Jumbo Arcana Pack' → p_arcana_jumbo：名字里的尺寸与口味直接拼出 key
        const m = c.name.match(/^(?:(Jumbo|Mega) )?(\w+) Pack$/);
        const descOverride = m ? `p_${m[2]!.toLowerCase()}_${(m[1] ?? 'normal').toLowerCase()}` : 'p_arcana_normal';
        locVars = [c.config.choose, c.config.extra];
        nameOverride = descOverride;
        if (!full.name) full.name = localize({ type: 'name', set: 'Other', key: nameOverride, mobile }) ?? null;
        localize({ type: 'other', key: descOverride, nodes: descNodes, vars: locVars, mobile });
    } else if (c.set === 'Spectral') {
        const n = c.name;
        if (n === 'Familiar' || n === 'Grim' || n === 'Incantation') locVars = [c.config.extra];
        else if (n === 'Immolate') locVars = [c.config.extra.destroy, c.config.extra.dollars];
        else if (n === 'Hex') infoQueue.push(center('e_polychrome'));
        else if (n === 'Talisman') infoQueue.push({ name: '', key: 'gold_seal', set: 'Other', config: {} });
        else if (n === 'Deja Vu') infoQueue.push({ name: '', key: 'red_seal', set: 'Other', config: {} });
        else if (n === 'Trance') infoQueue.push({ name: '', key: 'blue_seal', set: 'Other', config: {} });
        else if (n === 'Medium') infoQueue.push({ name: '', key: 'purple_seal', set: 'Other', config: {} });
        else if (n === 'Ankh') {
            if (g.jokers.some((j) => j.negative)) {
                infoQueue.push(center('e_negative'));
                const nodes: Rows = [];
                localize({ type: 'other', key: 'remove_negative', nodes, vars: [], mobile });
                mainEnd = nodes[0];
            }
        } else if (n === 'Cryptid') locVars = [c.config.extra];
        if (n === 'Ectoplasm') { infoQueue.push(center('e_negative')); locVars = [g.ectoMinus]; }
        if (n === 'Aura') infoQueue.push(center('e_foil'), center('e_holo'), center('e_polychrome'));
        localize({ type: 'descriptions', key: c.key, set: c.set, nodes: descNodes, vars: locVars, mobile });
    } else if (c.set === 'Planet') {
        const h = g.hands[c.config.hand_type]!;
        locVars = withColours([h.level, locMisc(c.config.hand_type, 'poker_hands'), h.l_mult, h.l_chips],
            [h.level === 1 ? C.UI.TEXT_DARK : C.HAND_LEVELS[Math.min(7, h.level)]!]);
        localize({ type: 'descriptions', key: c.key, set: c.set, nodes: descNodes, vars: locVars, mobile });
    } else if (c.set === 'Tarot') {
        const n = c.name;
        const cfg = c.config;
        const enhance = () => { locVars = [cfg.max_highlighted, locNameText('Enhanced', cfg.mod_conv)]; infoQueue.push(center(cfg.mod_conv)); };
        if (n === 'The Fool') {
            const fool = g.lastTarotPlanet ? center(g.lastTarotPlanet) : undefined;
            const last = fool ? locNameText(fool.set, fool.key) : locMisc('k_none');
            const colour = !fool || fool.name === 'The Fool' ? C.RED : C.GREEN;
            mainEnd = [
                { n: UIT.C, config: { align: 'bm', padding: 0.02 }, nodes: [
                    { n: UIT.C, config: { align: 'm', colour, r: 0.05, padding: 0.05 }, nodes: [
                        { n: UIT.T, config: { text: ` ${last} `, colour: C.UI.TEXT_LIGHT, scale: 0.3, shadow: true } },
                    ] },
                ] },
            ];
            locVars = [last];
            if (fool && fool.name !== 'The Fool') infoQueue.push(fool);
        } else if (['The Magician', 'The Empress', 'The Hierophant', 'The Lovers', 'The Chariot', 'Justice', 'The Devil', 'The Tower'].includes(n)) enhance();
        else if (n === 'The High Priestess') locVars = [cfg.planets];
        else if (n === 'The Emperor') locVars = [cfg.tarots];
        else if (n === 'The Hermit') locVars = [cfg.extra];
        else if (n === 'The Wheel of Fortune') { locVars = [g.probabilitiesNormal, cfg.extra]; infoQueue.push(center('e_foil'), center('e_holo'), center('e_polychrome')); }
        else if (n === 'Strength' || n === 'The Hanged Man' || n === 'Death') locVars = [cfg.max_highlighted];
        else if (n === 'Temperance') {
            const money = g.jokers.reduce((s, j) => s + j.sell_cost, 0);
            locVars = [cfg.extra, Math.min(cfg.extra, money)];
        } else if (['The Star', 'The Moon', 'The Sun', 'The World'].includes(n)) {
            locVars = withColours([cfg.max_highlighted, locMisc(cfg.suit_conv, 'suits_plural')], [C.SUITS[cfg.suit_conv]!]);
        }
        localize({ type: 'descriptions', key: c.key, set: c.set, nodes: descNodes, vars: locVars, mobile });
    }

    if (mainEnd) descNodes.push(mainEnd);

    if (!((specific && !specific.sticker) && (cardType === 'Default' || cardType === 'Enhanced'))) {
        if (descNodes === full.main && !full.name) {
            full.name = localize({ type: 'name', key: c.key, set: c.set, mobile }) ?? [];
        } else if (descNodes !== full.main) {
            descNodes.name = locNameText(nameOverride ? 'Other' : c.set, nameOverride ?? c.key);
        }
    }

    if (firstPass && c.set !== 'Edition' && badges) {
        for (const v of badges) {
            if (v === 'foil') infoQueue.push(center('e_foil'));
            if (v === 'holographic') infoQueue.push(center('e_holo'));
            if (v === 'polychrome') infoQueue.push(center('e_polychrome'));
            if (v === 'negative') infoQueue.push(center('e_negative'));
            if (v === 'negative_consumable') infoQueue.push({ name: 'Negative', key: 'e_negative_consumable', set: 'Edition', config: { extra: 1 } });
            if (v.endsWith('_seal')) infoQueue.push({ name: '', key: v, set: 'Other', config: {} });
        }
    }

    for (const v of infoQueue) generateCardUi(v, full, undefined, undefined, undefined, false, undefined, undefined, g);
    return full;
}

// ————————————————————————————————————————————————————————————————
// G.UIDEF.card_h_popup 与它的几个小工具
// ————————————————————————————————————————————————————————————————

export function descFromRows(rows: Rows, empty = false, maxw?: number): UINodeDef {
    return { n: UIT.R, config: { align: 'cm', colour: empty ? C.CLEAR : C.UI.BACKGROUND_WHITE, r: 0.1, padding: 0.04, minw: 2, minh: 0.8, emboss: !empty ? 0.05 : undefined, filler: true }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.03 }, nodes: rows.map((v) => ({ n: UIT.R, config: { align: 'cm', maxw }, nodes: v })) },
    ] };
}

function infoTipFromRows(rows: Rows, name: string): UINodeDef {
    return { n: UIT.R, config: { align: 'cm', colour: lighten(C.GREY, 0.15), r: 0.1 }, nodes: [
        { n: UIT.R, config: { align: 'tm', minh: 0.36, padding: 0.03 }, nodes: [{ n: UIT.T, config: { text: name, scale: 0.32, colour: C.UI.TEXT_LIGHT } }] },
        { n: UIT.R, config: { align: 'cm', minw: 1.5, minh: 0.4, r: 0.1, padding: 0.05, colour: C.WHITE }, nodes: [
            { n: UIT.R, config: { align: 'cm', padding: 0.03 }, nodes: rows.map((v) => ({ n: UIT.R, config: { align: 'cm' }, nodes: v })) },
        ] },
    ] };
}

function nameFromRows(nodes: UINodeDef[] | true | null, background?: Colour): UINodeDef | null {
    if (!nodes || nodes === true || nodes.length === 0) return null;
    return { n: UIT.R, config: { align: 'cm', padding: 0.05, r: 0.1, colour: background, emboss: background ? 0.05 : undefined }, nodes };
}

const BADGE_COL: Record<string, Colour> = {
    eternal: C.ETERNAL, perishable: C.PERISHABLE, rental: C.RENTAL,
    foil: C.DARK_EDITION, holographic: C.DARK_EDITION, polychrome: C.DARK_EDITION, negative: C.DARK_EDITION,
    gold_seal: C.GOLD, red_seal: C.RED, blue_seal: C.BLUE, purple_seal: C.PURPLE, pinned_left: C.ORANGE,
};

export function createBadge(text: string, badgeCol?: Colour, textCol?: Colour, scaling = 1): UINodeDef {
    return { n: UIT.R, config: { align: 'cm' }, nodes: [
        { n: UIT.R, config: { align: 'cm', colour: badgeCol ?? C.GREEN, r: 0.1, minw: 2, minh: 0.4 * scaling, emboss: 0.05, padding: 0.03 * scaling }, nodes: [
            { n: UIT.B, config: { h: 0.1, w: 0.03 } },
            { n: UIT.O, config: { object: new DynaText({ string: [text || 'ERROR'], colours: [textCol ?? C.WHITE], float: true, shadow: true, y_offset: -0.05, silent: true, spacing: 1, scale: 0.33 * scaling }) } },
            { n: UIT.B, config: { h: 0.1, w: 0.03 } },
        ] },
    ] };
}

/** `get_type_colour`（第二支因原文拼写 `discoveredand` 永不成立，略） */
function typeColour(c: Center, debuff: boolean): Colour {
    if (debuff) return mixColours(C.RED, C.GREY, 0.7);
    if (c.set === 'Joker') return C.RARITY[(c.rarity ?? 1) - 1]!;
    if (c.set === 'Edition') return C.DARK_EDITION;
    if (c.set === 'Booster') return C.BOOSTER;
    return (C.SECONDARY_SET as Record<string, Colour>)[c.set] ?? [0, 1, 1, 1];
}

/** `card_h_popup` 的外框。附加说明框（`show_infotip`）另建，挂在外框左边，见 `infoBoxes` */
export function cardHPopup(card: PopupCard, aut: CardUi): UINodeDef {
    const c = center(card.centerKey);
    const debuffed = !!card.debuff;
    const typeCol = typeColour(c, debuffed);
    const t = aut.card_type ?? c.set;
    const background = (t === 'Enhanced' || t === 'Default') ? darken(C.BLACK, 0.1)
        : debuffed ? darken(C.BLACK, 0.1)
        : darken(C.BLACK, 0.1);
    let typeName = locMisc(`k_${t.toLowerCase()}`);
    if (t === 'Joker' || aut.badges.force_rarity) typeName = [locMisc('k_common'), locMisc('k_uncommon'), locMisc('k_rare'), locMisc('k_legendary')][(c.rarity ?? 1) - 1]!;
    if (t === 'Enhanced') typeName = locNameText('Enhanced', c.key);
    if (debuffed && t !== 'Enhanced') typeName = locMisc('k_debuffed');
    const isPlaying = t === 'Enhanced' || t === 'Default';

    const badges: UINodeDef[] = [];
    if (aut.badges.card_type || aut.badges.force_rarity) {
        const n = card.ability.name;
        const label = n === 'Pluto' || n === 'Ceres' || n === 'Eris' ? locMisc('k_dwarf_planet') : n === 'Planet X' ? locMisc('k_planet_q') : typeName;
        badges.push(createBadge(label, typeCol, undefined, 1.2));
    }
    for (const raw of aut.badges) {
        const v = raw === 'negative_consumable' ? 'negative' : raw;
        badges.push(createBadge(locMisc(v, 'labels'), BADGE_COL[v] ?? [1, 0, 0, 1]));
    }

    const inner: UINodeDef[] = [];
    const name = nameFromRows(aut.name, isPlaying ? C.WHITE : undefined);
    if (name) inner.push(name);
    inner.push(descFromRows(aut.main));
    if (badges.length) inner.push({ n: UIT.R, config: { align: 'cm', padding: 0.03 }, nodes: badges });

    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: [
        { n: UIT.C, config: { id: 'h_popup_main', align: 'cm' }, nodes: [
            { n: UIT.R, config: { padding: 0.05, r: 0.12, colour: lighten(C.JOKER_GREY, 0.5), emboss: 0.07 }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: 0.07, r: 0.1, colour: adjustAlpha(background, 0.8) }, nodes: inner },
            ] },
        ] },
    ] };
}

/** `show_infotip`：附加说明（强化、版本、蜡封…）一列排开，UIBox 以 `cl`、offset −0.03 挂在外框那个 C 元素左边 */
export function infoBoxes(aut: CardUi): UINodeDef | null {
    if (aut.info.length === 0) return null;
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR, padding: 0.02 }, nodes: aut.info.map((v) => ({
        n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.R, config: { align: 'cm', colour: lighten(C.JOKER_GREY, 0.5), r: 0.1, padding: 0.05, emboss: 0.05 }, nodes: [
                infoTipFromRows(v, v.name ?? ''),
            ] },
        ],
    }) as UINodeDef) };
}
