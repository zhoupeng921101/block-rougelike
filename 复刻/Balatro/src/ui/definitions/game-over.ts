/**
 * 游戏结束与胜利界面（22 号票第十七步）：`UI_definitions.lua:2974` 的 `create_UIBox_game_over`、
 * `:2861` 的 `create_UIBox_win`、`:3045` 的 `create_UIBox_round_scores_row`、`:6479` 的 `create_UIBox_generic_options`、
 * `:6547` 的 `UIBox_button`，逐节点直译。
 *
 * 两个界面都经 `G.FUNCS.overlay_menu` 挂在 `G.ROOM_ATTACH` 上（`cm`，从下方 10 tile 滑进来）。
 * 左边的 `jimbo_spot` 是个 `CARD_W·1.1 × CARD_H·1.1` 的空 Moveable，2.5 秒后原作换成说俏皮话的 Jimbo（`Card_Character`）——
 * 那个还没做，位置先空着（尺寸照占）。
 */
import { BLIND_CENTERS } from '../../core/blinds';
import { C, type Colour, darken } from '../colours';
import { DynaText } from '../dynatext';
import { numberFormat } from '../format';
import { BLIND_TEXT, DICTIONARY } from '../lang.generated';
import type { Rect, UINodeDef, UIObject } from '../uibox';
import { UIT } from '../uibox';
import type { BlindChipObject } from './blind-select';
import { scoreNumberScale } from './blind-select';
import type { SpriteObject } from './hud';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

/** `G.CARD_W` / `G.CARD_H`（`globals.lua`） */
const CARD_W = (2.4 * 35) / 41;
const CARD_H = (2.4 * 47) / 41;

/** 结束界面读的 `G.GAME` 那几项 */
export type GameOverState = {
    /** `G.GAME.round_resets.ante` */
    ante: number;
    /** `G.GAME.round` */
    round: number;
    /** `G.GAME.pseudorandom.seed` */
    seed: string;
    /** `G.GAME.seeded`：种子那一格底色变红 */
    seeded: boolean;
    /** `round_scores.hand.amt` */
    bestHand: number;
    /** `hand_usage` 里次数最多的牌型（英文名，`localize(_, 'poker_hands')` 在 en-us 下是恒等）；没出过牌是 null */
    mostPlayed: { hand: string | null; count: number };
    cardsPlayed: number;
    cardsDiscarded: number;
    cardsPurchased: number;
    timesRerolled: number;
    newCollection: number;
    /** `G.GAME.blind.config.blind.key`（`defeated_by`） */
    blindKey: string;
};

type Score =
    | 'hand' | 'poker_hand' | 'cards_played' | 'cards_discarded' | 'cards_purchased' | 'times_rerolled'
    | 'new_collection' | 'seed' | 'furthest_ante' | 'furthest_round' | 'defeated_by';

/** `G.GAME.round_scores` 里有的那几项（`game.lua:2079`）；`seed` / `defeated_by` 不在里面，所以 label 先是 '' */
const ROUND_SCORE_KEYS = new Set<Score>([
    'furthest_ante', 'furthest_round', 'hand', 'poker_hand', 'new_collection', 'cards_played', 'cards_discarded',
    'times_rerolled', 'cards_purchased',
]);

function amountOf(s: GameOverState, score: Score): number {
    switch (score) {
        case 'hand': return s.bestHand;
        case 'cards_played': return s.cardsPlayed;
        case 'cards_discarded': return s.cardsDiscarded;
        case 'cards_purchased': return s.cardsPurchased;
        case 'times_rerolled': return s.timesRerolled;
        case 'new_collection': return s.newCollection;
        // 局内的 furthest_* 与 poker_hand 的 amt 界面不读（前两个显示 ante / round，后者显示 hand_usage）
        default: return 0;
    }
}

const dyn = (text: string, colour: Colour, scale: number, maxw?: number): UINodeDef =>
    ({ n: UIT.O, config: { object: new DynaText({ string: [text], colours: [colour], shadow: true, float: true, scale, maxw }) } });

/** `create_UIBox_round_scores_row(score, text_colour)` */
export function roundScoresRow(s: GameOverState, score: Score, textColour?: Colour): UINodeDef {
    let label = ROUND_SCORE_KEYS.has(score) ? loc(`ph_score_${score}`) : '';
    let checkHighScore = false;
    let scoreTab: UINodeDef[] = [];
    const big = score === 'hand' || score === 'poker_hand';
    let labelW = big ? 3.5 : 2.9;
    let scoreW = big ? 3.5 : 1;
    const h = 0.5;

    if (score === 'furthest_ante') {
        labelW = 1.9;
        checkHighScore = true;
        label = loc('k_ante');
        scoreTab = [dyn(numberFormat(s.ante), textColour ?? C.FILTER, 0.45)];
    }
    if (score === 'furthest_round') {
        labelW = 1.9;
        checkHighScore = true;
        label = loc('k_round');
        scoreTab = [dyn(numberFormat(s.round), textColour ?? C.FILTER, 0.45)];
    }
    if (score === 'seed') {
        labelW = 1.9;
        scoreW = 1.9;
        label = loc('k_seed');
        scoreTab = [dyn(s.seed, textColour ?? C.WHITE, 0.45)];
    }
    if (score === 'defeated_by') {
        label = loc('k_defeated_by');
        const center = BLIND_CENTERS[s.blindKey] ?? BLIND_CENTERS.bl_small!;
        const animation: BlindChipObject = { kind: 'blind_chip', pos: center.pos, shadowHeight: 0.05, T: { x: 0, y: 0, w: 1.4, h: 1.4 } as Rect };
        scoreTab = [
            { n: UIT.R, config: { align: 'cm', minh: 0.6 }, nodes: [
                dyn(BLIND_TEXT[s.blindKey]?.name ?? 'ERROR', C.WHITE, 0.45, 2.2),
            ] },
            { n: UIT.R, config: { align: 'cm', padding: 0.1 }, nodes: [
                { n: UIT.O, config: { object: animation } },
            ] },
        ];
    }

    const labelScale = 0.5;

    if (score === 'poker_hand') {
        const { hand, count } = s.mostPlayed;
        scoreTab = [
            dyn(count < 1 || !hand ? loc('k_none') : hand, textColour ?? C.WHITE, 0.45, 2.5),
            { n: UIT.T, config: { text: ` (${count})`, scale: 0.35, colour: C.JOKER_GREY } },
        ];
    } else if (score === 'hand') {
        checkHighScore = true;
        // `Sprite(0,0,0.3,0.3, G.ASSET_ATLAS.ui_1, {x=0, y=0})`：小筹码图标
        const chip: SpriteObject = { kind: 'sprite', atlas: 'ui_1', pos: { x: 0, y: 0 }, T: { x: 0, y: 0, w: 0.3, h: 0.3 } };
        const amt = s.bestHand;
        scoreTab = [
            { n: UIT.C, config: { align: 'cm' }, nodes: [
                { n: UIT.O, config: { w: 0.3, h: 0.3, object: chip } },
            ] },
            { n: UIT.C, config: { align: 'cm' }, nodes: [
                dyn(numberFormat(amt), textColour ?? C.RED, Math.min(0.6, scoreNumberScale(1.2, amt))),
            ] },
        ];
    } else if (ROUND_SCORE_KEYS.has(score) && scoreTab.length === 0) {
        const amt = amountOf(s, score);
        scoreTab = [dyn(numberFormat(amt), textColour ?? C.FILTER, scoreNumberScale(0.6, amt))];
    }

    const defeated = score === 'defeated_by';
    return { n: UIT.R, config: { align: 'cm', padding: 0.05, r: 0.1, colour: darken(C.JOKER_GREY, 0.1), emboss: 0.05, func: checkHighScore ? 'high_score_alert' : undefined, id: score }, nodes: [
        { n: defeated ? UIT.R : UIT.C, config: { align: 'cm', padding: 0.02, minw: labelW, maxw: labelW }, nodes: [
            { n: UIT.T, config: { text: label, scale: labelScale, colour: C.UI.TEXT_LIGHT, shadow: true } },
        ] },
        { n: defeated ? UIT.R : UIT.C, config: { align: 'cr' }, nodes: [
            { n: UIT.C, config: { align: 'cm', minh: h, r: 0.1, minw: defeated ? labelW : scoreW, colour: score === 'seed' && s.seeded ? C.RED : C.BLACK, emboss: 0.05 }, nodes: [
                { n: UIT.C, config: { align: 'cm', padding: 0.05, r: 0.1, minw: scoreW }, nodes: scoreTab },
            ] },
        ] },
    ] };
}

type ButtonArgs = {
    button?: string;
    id?: string;
    label?: string[];
    colour?: Colour;
    textColour?: Colour;
    minw?: number;
    maxw?: number;
    minh?: number;
    scale?: number;
    shadow?: boolean;
    padding?: number;
    col?: boolean;
};

/** `UIBox_button`（不带 `count` / `choice` 的那部分） */
export function uiboxButton(args: ButtonArgs): UINodeDef {
    const button = args.button ?? 'exit_overlay_menu';
    const colour = args.colour ?? C.RED;
    const label = args.label ?? ['LABEL'];
    const minw = args.minw ?? 2.7;
    let maxw = args.maxw ?? minw - 0.2;
    if (minw < maxw) maxw = minw - 0.2;
    const minh = args.minh ?? 0.9;
    const scale = args.scale ?? 0.5;
    const textColour = args.textColour ?? C.UI.TEXT_LIGHT;
    const labelNodes: UINodeDef[] = label.map((v) => ({ n: UIT.R, config: { align: 'cm', padding: 0, minw, maxw }, nodes: [
        { n: UIT.T, config: { text: v, scale, colour: textColour, shadow: args.shadow } },
    ] }));
    return { n: args.col ? UIT.C : UIT.R, config: { align: 'cm' }, nodes: [
        { n: UIT.C, config: { align: 'cm', padding: args.padding ?? 0, r: 0.1, hover: true, colour, button, minh, shadow: true, id: args.id }, nodes: labelNodes },
    ] };
}

/** `create_UIBox_generic_options`（`no_back` 那一支——两个结束界面都不带返回键） */
function genericOptions(args: { bgColour: Colour; outlineColour?: Colour; colour?: Colour; padding: number; contents: UINodeDef[] }): UINodeDef {
    const ROOM = { w: 21, h: 11.2 };
    const infotip: UIObject = { T: { x: 0, y: 0, w: 0, h: 0 } };
    return { n: UIT.ROOT, config: { align: 'cm', minw: ROOM.w * 5, minh: ROOM.h * 5, padding: 0.1, r: 0.1, colour: args.bgColour }, nodes: [
        { n: UIT.R, config: { align: 'cm', minh: 1, r: 0.3, padding: 0.07, minw: 1, colour: args.outlineColour ?? C.JOKER_GREY, emboss: 0.1 }, nodes: [
            { n: UIT.C, config: { align: 'cm', minh: 1, r: 0.2, padding: 0.15, minw: 1, colour: args.colour ?? C.L_BLACK }, nodes: [
                // 原文 `args.padding or 0.2`：两个结束界面都传 0，**Lua 里 0 是真值**，所以是 0
                { n: UIT.R, config: { align: 'cm', padding: args.padding, minw: 7 }, nodes: args.contents },
            ] },
        ] },
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.O, config: { id: 'overlay_menu_infotip', object: infotip } },
        ] },
    ] };
}

/** `jimbo_spot`：`Moveable(0,0,G.CARD_W*1.1, G.CARD_H*1.1)` */
function jimboSpot(): UINodeDef {
    const spot: UIObject = { T: { x: 0, y: 0, w: CARD_W * 1.1, h: CARD_H * 1.1 } };
    return { n: UIT.O, config: { padding: 0, id: 'jimbo_spot', object: spot } };
}

/** 两个界面共用的统计块（左列七行 + 右列） */
function statsColumns(s: GameOverState, right: UINodeDef[]): UINodeDef[] {
    return [
        { n: UIT.R, config: { align: 'cm', padding: 0.08 }, nodes: [
            roundScoresRow(s, 'hand'),
            roundScoresRow(s, 'poker_hand'),
        ] },
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.C, config: { align: 'cm', padding: 0.08 }, nodes: [
                roundScoresRow(s, 'cards_played', C.BLUE),
                roundScoresRow(s, 'cards_discarded', C.RED),
                roundScoresRow(s, 'cards_purchased', C.MONEY),
                roundScoresRow(s, 'times_rerolled', C.GREEN),
                roundScoresRow(s, 'new_collection', C.WHITE),
                roundScoresRow(s, 'seed', C.WHITE),
                uiboxButton({ button: 'copy_seed', label: [loc('b_copy')], colour: C.BLUE, scale: 0.3, minw: 2.3, minh: 0.4 }),
            ] },
            { n: UIT.C, config: { align: 'tr', padding: 0.08 }, nodes: right },
        ] },
    ];
}

/**
 * `create_UIBox_game_over`。背景色 `eased_red` 的 alpha 由场景从 0 缓到 0.8（`ease_value`），
 * 所以这里传进来的是那张会被改的颜色表本身
 */
export function createGameOver(s: GameOverState, bgColour: Colour): UINodeDef {
    const redButton = (id: string | undefined, button: string, text: string): UINodeDef =>
        ({ n: UIT.R, config: { id, align: 'cm', minw: 5, padding: 0.1, r: 0.1, hover: true, colour: C.RED, button, shadow: true }, nodes: [
            { n: UIT.R, config: { align: 'cm', padding: 0, maxw: 4.8 }, nodes: [
                { n: UIT.T, config: { text, scale: 0.5, colour: C.UI.TEXT_LIGHT } },
            ] },
        ] });
    const t = genericOptions({ bgColour, padding: 0, contents: [
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.O, config: { object: new DynaText({ string: [loc('ph_game_over')], colours: [C.RED], shadow: true, float: true, scale: 1.5, pop_in: 0.4, maxw: 6.5 }) } },
        ] },
        { n: UIT.R, config: { align: 'cm', padding: 0.15 }, nodes: [
            { n: UIT.C, config: { align: 'cm' }, nodes: [
                { n: UIT.R, config: { align: 'cm', padding: 0.05, colour: C.BLACK, emboss: 0.05, r: 0.1 }, nodes: statsColumns(s, [
                    roundScoresRow(s, 'furthest_ante', C.FILTER),
                    roundScoresRow(s, 'furthest_round', C.FILTER),
                    roundScoresRow(s, 'defeated_by'),
                ]) },
                { n: UIT.R, config: { align: 'cm', padding: 0.1 }, nodes: [
                    redButton('from_game_over', 'notify_then_setup_run', loc('b_start_new_run')),
                    redButton(undefined, 'go_to_menu', loc('b_main_menu')),
                ] },
            ] },
        ] },
    ] });
    const [menu, ...rest] = t.nodes!;
    return { ...t, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.1 }, nodes: [
            { n: UIT.C, config: { align: 'cm', padding: 2 }, nodes: [
                { n: UIT.R, config: { align: 'cm' }, nodes: [jimboSpot()] },
            ] },
            { n: UIT.C, config: { align: 'cm', padding: 0.1 }, nodes: [menu] },
        ] },
        ...rest,
    ] };
}

/** `create_UIBox_win`。`bgColour` 是 `eased_green`（alpha 由场景从 0 缓到 0.5） */
export function createWin(s: GameOverState, bgColour: Colour): UINodeDef {
    const t = genericOptions({ bgColour, colour: C.BLACK, outlineColour: C.EDITION, padding: 0, contents: [
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.O, config: { object: new DynaText({ string: [loc('ph_you_win')], colours: [C.EDITION], shadow: true, float: true, spacing: 10, rotate: true, scale: 1.5, pop_in: 0.4, maxw: 6.5 }) } },
        ] },
        { n: UIT.R, config: { align: 'cm', padding: 0.15 }, nodes: [
            { n: UIT.C, config: { align: 'cm' }, nodes: [
                ...statsColumns(s, [
                    roundScoresRow(s, 'furthest_ante', C.FILTER),
                    roundScoresRow(s, 'furthest_round', C.FILTER),
                    { n: UIT.R, config: { align: 'cm', minh: 0.4, minw: 0.1 }, nodes: [] },
                    uiboxButton({ id: 'from_game_won', button: 'notify_then_setup_run', label: [loc('b_start_new_run')], minw: 2.5, maxw: 2.5, minh: 1 }),
                    { n: UIT.R, config: { align: 'cm', minh: 0.2, minw: 0.1 }, nodes: [] },
                    uiboxButton({ button: 'go_to_menu', label: [loc('b_main_menu')], minw: 2.5, maxw: 2.5, minh: 1 }),
                ]),
                { n: UIT.R, config: { align: 'cm', padding: 0.08 }, nodes: [
                    uiboxButton({ button: 'exit_overlay_menu', label: [loc('b_endless')], minw: 6.5, maxw: 5, minh: 1.2, scale: 0.7, shadow: true, colour: C.BLUE }),
                ] },
            ] },
        ] },
    ] });
    const [menu, ...rest] = t.nodes!;
    return { ...t, config: { ...t.config, id: 'you_win_UI' }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.1 }, nodes: [
            { n: UIT.C, config: { align: 'cm', padding: 2 }, nodes: [jimboSpot()] },
            { n: UIT.C, config: { align: 'cm', padding: 0.1 }, nodes: [menu] },
        ] },
        ...rest,
    ] };
}
