/**
 * 选盲注界面（22 号票）：`UI_definitions.lua:1524` 的 `create_UIBox_blind_select`、`:1568` 的
 * `create_UIBox_blind_tag`、`:1592` 的 `create_UIBox_blind_choice`、`:6523` 的 `UIBox_dyn_container`，
 * 以及每帧跑的 `blind_choice_handler`（`button_callbacks.lua:2741`）。逐节点直译。
 *
 * 结构：外层一个 UIBox（挂在手牌区上、`bmi`），里面一行三个 O 节点，**每个 O 节点里装一张卡的 UIBox**
 * （`G.blind_select_opts.small / big / boss`）。卡片自己以 O 元素为 major、`bmi` 对齐，
 * handler 把轮到的那张往上提 0.9、其余提 0.2，并给没轮到的盖一层半透明灰（`draw_after`）。
 * 左侧面板的「Choose your next Blind」是另一个 UIBox（`G.blind_prompt_box`），挂在 `row_blind` 上。
 *
 * 只做非 `run_info` 的那一支（Run Info 里的盲注页另算）；Skipped 的「SKIPPED」角标、Director's Cut 的重掷按钮还没做。
 */
import { BLIND_CENTERS } from '../../core/blinds';
import { getBlindAmount } from '../../core/scoring';
import { TAG_CENTERS } from '../../core/tags';
import { blindMainColour } from '../blind-colour';
import { C, type Colour, adjustAlpha, darken, mixColours } from '../colours';
import { DynaText } from '../dynatext';
import { EN_FONT } from '../font';
import { numberFormat } from '../format';
import { BLIND_TEXT, DICTIONARY } from '../lang.generated';
import { type Rect, UIBox, type UIElement, type UIFuncs, type UINodeDef, type UIObject, UIT } from '../uibox';
import { type SpriteObject, stakeSprite } from './hud';
import { uiboxButton } from './ui-button';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

export type BlindType = 'Small' | 'Big' | 'Boss';
export type BlindSlotState = 'Defeated' | 'Skipped' | 'Select' | 'Upcoming';

/** 盲注筹码的逐帧动画（`AnimatedSprite(0,0,1.4,1.4, blind_chips, pos)`），绘制层按 `pos` 取行 */
export type BlindChipObject = UIObject & { kind: 'blind_chip'; pos: { x: number; y: number }; shadowHeight: number };

/** 标签精灵（`Tag:generate_UI` 的 `tag_sprite`）：`tags` 图集、带阴影、上下漂浮 */
/**
 * `Tag:generate_UI` 的精灵：带阴影那一步（`shadow_height = 0.05`）、漂浮。`touch_collide_tilt = true`，
 * 悬停时 `hover_tilt = 3`（`tag.lua:519`）——由场景的悬停区写 `hoverTilt`，绘制层喂给 `dissolve` 的 `hovering`
 */
export type TagSpriteObject = SpriteObject & { shadowHeight: number; float: true; hoverTilt?: number };

/** 界面读的 `G.GAME` 那几项 */
export type BlindSelectState = {
    ante: number;
    /** `G.GAME.round_resets.blind_choices` */
    choices: Record<BlindType, string>;
    /** `G.GAME.round_resets.blind_states` */
    states: Record<BlindType, BlindSlotState>;
    /** `G.GAME.round_resets.blind_tags`（Boss 没有） */
    tags: { Small: string; Big: string };
    /** `G.GAME.current_round.most_played_poker_hand`（The Ox 的描述要它） */
    mostPlayedHand: string;
    /** `G.GAME.probabilities.normal`（The Wheel 的描述前缀） */
    probabilities: number;
};

/** `G.GAME.blind_on_deck`：第一个既没打过也没跳过的格子 */
export function blindOnDeck(s: BlindSelectState): BlindType {
    const done = (t: BlindType) => s.states[t] === 'Defeated' || s.states[t] === 'Skipped';
    return !done('Small') ? 'Small' : !done('Big') ? 'Big' : 'Boss';
}

/** `misc_functions.lua:968` */
export function scoreNumberScale(scale: number, amt: number): number {
    const E_SWITCH_POINT = 100000000000;
    if (amt >= E_SWITCH_POINT) return 0.7 * scale;
    if (amt >= 1000000) return ((14 * 0.75) / (Math.floor(Math.log(amt)) + 4)) * scale;
    return 0.75 * scale;
}

/** `get_blind_main_colour(type)`：打过或跳过的格子是黑 */
function slotColour(s: BlindSelectState, type: BlindType): Colour {
    if (s.states[type] === 'Defeated' || s.states[type] === 'Skipped') return C.BLACK;
    return blindMainColour(s.choices[type]);
}

/** `UI_definitions.lua:6523` */
export function dynContainer(inner: UINodeDef[], horizontal: boolean, colourOverride?: Colour, backgroundOverride?: Colour): UINodeDef {
    return { n: UIT.R, config: { align: 'cm', padding: 0.03, colour: C.UI.TRANSPARENT_DARK, r: 0.1 }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.05, colour: colourOverride ?? C.DYN_UI.MAIN, r: 0.1 }, nodes: [
            { n: UIT.R, config: { align: horizontal ? 'cl' : 'tm', colour: backgroundOverride ?? C.DYN_UI.BOSS_DARK, minw: horizontal ? 100 : 0, minh: horizontal ? 0 : 30, r: 0.1, padding: 0.08 }, nodes: inner },
        ] },
    ] };
}

/** `:1568`：「or」与标签、跳过按钮 */
function createBlindTag(type: 'Small' | 'Big', tagKey: string, runInfo = false): UINodeDef | null {
    const center = TAG_CENTERS[tagKey];
    if (!center) return null;
    const size = 0.8;
    const sprite: TagSpriteObject = {
        kind: 'sprite', atlas: 'tags', pos: center.pos, T: { x: 0, y: 0, w: size, h: size }, shadowHeight: 0.05, float: true,
    };
    // `Tag:generate_UI`
    const tagUi: UINodeDef = { n: UIT.C, config: { align: 'cm' }, nodes: [
        { n: UIT.O, config: { w: size, h: size, colour: C.BLUE, object: sprite, focus_with_object: true } },
    ] };
    return { n: UIT.R, config: { id: 'tag_container', align: 'cm' }, nodes: [
        { n: UIT.R, config: { align: 'tm', minh: 0.65 }, nodes: [
            { n: UIT.T, config: { text: loc('k_or'), scale: 0.55, colour: C.WHITE, shadow: true } },
        ] },
        { n: UIT.R, config: { id: `tag_${type}`, align: 'cm', r: 0.1, padding: 0.1, minw: 1, can_collide: true }, nodes: [
            { n: UIT.C, config: { id: 'tag_desc', align: 'cm', minh: 1 }, nodes: [tagUi] },
            !runInfo ? { n: UIT.C, config: { align: 'cm', colour: C.UI.BACKGROUND_INACTIVE, minh: 0.6, minw: 2, maxw: 2, padding: 0.07, r: 0.1, shadow: true, hover: true, one_press: true, button: 'skip_blind', func: 'hover_tag_proxy' }, nodes: [
                { n: UIT.T, config: { text: loc('b_skip_blind'), scale: 0.4, colour: C.UI.TEXT_INACTIVE } },
            ] }
            // Run Info 里：不能点，换成「Skip Reward」
            : { n: UIT.C, config: { align: 'cm', padding: 0.1, emboss: 0.05, colour: mixColours(C.BLUE, C.BLACK, 0.4), r: 0.1, maxw: 2, hover: true, func: 'hover_tag_proxy' }, nodes: [
                { n: UIT.T, config: { text: loc('b_skip_reward'), scale: 0.35, colour: C.WHITE } },
            ] },
        ] },
    ] };
}

/**
 * `common_events.lua` 的 `add_tag`：手上的标签在房间右下角叠成一列，每个是一个 UIBox——
 * `ROOT(cm, padding 0.05)` 里装 `Tag:generate_UI()`（0.8 的精灵，带阴影、漂浮）。
 * 第一个 `bri` 挂房间、x 外移 0.7；之后每个 `tm` 挂在上一个上面（调用方负责挂法）
 */
export function hudTag(tagKey: string): UINodeDef {
    const center = TAG_CENTERS[tagKey];
    if (!center) throw new Error(`没有标签 ${tagKey}`);
    const size = 0.8;
    const sprite: TagSpriteObject = {
        kind: 'sprite', atlas: 'tags', pos: center.pos, T: { x: 0, y: 0, w: size, h: size }, shadowHeight: 0.05, float: true,
    };
    return { n: UIT.ROOT, config: { align: 'cm', padding: 0.05, colour: C.CLEAR }, nodes: [
        { n: UIT.C, config: { align: 'cm' }, nodes: [
            { n: UIT.O, config: { w: size, h: size, colour: C.BLUE, object: sprite, focus_with_object: true } },
        ] },
    ] };
}

/**
 * `UI_definitions.lua:1966` 的 `create_UIBox_card_alert`。选盲注界面上跳过的那一格盖一个斜着的「SKIPPED」
 * （`blind_choice_handler`：`text_rot = -0.35, no_bg, bump_amount = 1, scale = 0.9, maxw = 3.4`，`tmi` 挂卡片、下移 2.2）
 */
export function cardAlert(args: { text?: string; noBg?: boolean; bgCol?: Colour; redBad?: boolean; textRot?: number; bumpAmount?: number; scale?: number; maxw?: number; yOffset?: number }): UINodeDef {
    const scale = args.scale ?? 0.48;
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: [
        { n: UIT.R, config: { align: 'cm', r: 0.15, minw: 0.42, minh: 0.42, colour: args.noBg ? C.CLEAR : args.bgCol ?? (args.redBad ? darken(C.RED, 0.1) : C.RED), emboss: 0.05 }, nodes: [
            { n: UIT.O, config: { object: new DynaText({
                string: [args.text ?? '!'], colours: [C.WHITE], shadow: true, rotate: true, bump: true,
                bump_rate: args.text ? 3 : 7, bump_amount: args.bumpAmount ?? 3, maxw: args.maxw, text_rot: args.textRot ?? 0.2,
                spacing: 3 * (args.scale ?? 1), scale,
            }) } },
        ] },
    ] };
}

/** `:1592`（非 `run_info` 那一支） */
export function createBlindChoice(type: BlindType, s: BlindSelectState, locBlindStates: Record<BlindType, string>, stake = 1, runInfo = false): UINodeDef {
    const key = s.choices[type];
    const center = BLIND_CENTERS[key];
    if (!center) throw new Error(`没有盲注 ${key}`);
    const animation: BlindChipObject = { kind: 'blind_chip', pos: center.pos, shadowHeight: 0.05, T: { x: 0, y: 0, w: 1.4, h: 1.4 } as Rect };
    const stake_sprite = stakeSprite(stake, 0.5);

    let extras: UINodeDef | null = null;
    if (type === 'Small' || type === 'Big') extras = createBlindTag(type, s.tags[type], runInfo);
    else if (!runInfo) {
        const dt1 = new DynaText({ string: [{ string: loc('ph_up_ante_1'), colour: C.FILTER }], colours: [C.BLACK], scale: 0.55, silent: true, shadow: true, bump: true, maxw: 3 });
        const dt2 = new DynaText({ string: [{ string: loc('ph_up_ante_2'), colour: C.WHITE }], colours: [C.GREEN], scale: 0.35, silent: true, shadow: true, maxw: 3 });
        const dt3 = new DynaText({ string: [{ string: loc('ph_up_ante_3'), colour: C.WHITE }], colours: [C.GREEN], scale: 0.35, silent: true, shadow: true, maxw: 3 });
        extras = { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.R, config: { align: 'cm', padding: 0.07, r: 0.1, colour: [0, 0, 0, 0.12], minw: 2.9 }, nodes: [
                { n: UIT.R, config: { align: 'cm' }, nodes: [{ n: UIT.O, config: { object: dt1 } }] },
                { n: UIT.R, config: { align: 'cm' }, nodes: [{ n: UIT.O, config: { object: dt2 } }] },
                { n: UIT.R, config: { align: 'cm' }, nodes: [{ n: UIT.O, config: { object: dt3 } }] },
            ] },
        ] };
    }

    const text = BLIND_TEXT[key];
    const text_table = (text?.text ?? []).map((l) => l.replace('#1#', s.mostPlayedHand));
    const loc_name = text?.name ?? center.name;
    const blind_col = slotColour(s, type);
    const blind_amt = getBlindAmount(s.ante) * center.mult;

    // Run Info 里顶上那格是状态牌（Current 红 / Defeated 灰 / Skipped 蓝 / Upcoming 橙），不是按钮
    const state = s.states[type] === 'Select' ? 'Current' : s.states[type];
    const runInfoColour = state === 'Defeated' ? C.GREY : state === 'Skipped' ? C.BLUE : state === 'Upcoming' ? C.ORANGE : state === 'Current' ? C.RED : C.GOLD;
    const topButton: UINodeDef = !runInfo
        // `G.F_MOBILE`：按钮 1.2 高、字号 0.65（本产物是移动版）
        ? { n: UIT.R, config: { id: 'select_blind_button', align: 'cm', colour: C.ORANGE, minh: 1.2, minw: 2.7, maxw: 2.7, padding: 0.07, r: 0.1, shadow: true, hover: true, one_press: true, button: 'select_blind' }, nodes: [
            { n: UIT.T, config: { ref_table: locBlindStates, ref_value: type, scale: 0.65, colour: C.UI.TEXT_LIGHT, shadow: true } },
        ] }
        // `localize(blind_state, 'blind_states')`：en-us 里与键同名
        : { n: UIT.R, config: { id: 'select_blind_button', align: 'cm', colour: runInfoColour, minh: 0.6, minw: 2.7, padding: 0.07, r: 0.1, emboss: 0.08 }, nodes: [
            { n: UIT.T, config: { text: state, scale: 0.45, colour: C.UI.TEXT_LIGHT, shadow: true } },
        ] };

    return { n: UIT.R, config: { id: type, align: 'tm', func: 'blind_choice_handler', minh: runInfo ? undefined : 10, ref_table: { deck: null as string | null, run_info: runInfo }, r: 0.1, padding: 0.05 }, nodes: [
        { n: UIT.R, config: { align: 'cm', colour: mixColours(C.BLACK, C.L_BLACK, 0.5), r: 0.1, outline: 1, outline_colour: C.L_BLACK }, nodes: [
            { n: UIT.R, config: { align: 'cm', padding: 0.2 }, nodes: [topButton] },
            { n: UIT.R, config: { id: 'blind_name', align: 'cm', padding: 0.07 }, nodes: [
                { n: UIT.R, config: { align: 'cm', r: 0.1, outline: 1, outline_colour: blind_col, colour: darken(blind_col, 0.3), minw: 2.9, emboss: 0.1, padding: 0.07, line_emboss: 1 }, nodes: [
                    { n: UIT.O, config: { object: new DynaText({ string: [loc_name], colours: [C.WHITE], shadow: true, float: true, scale: 0.45, maxw: 2.8 }) } },
                ] },
            ] },
            { n: UIT.R, config: { align: 'cm', padding: 0.05 }, nodes: [
                { n: UIT.R, config: { id: 'blind_desc', align: 'cm', padding: 0.05 }, nodes: [
                    { n: UIT.R, config: { align: 'cm' }, nodes: [
                        { n: UIT.R, config: { align: 'cm', minh: 1.5 }, nodes: [
                            { n: UIT.O, config: { object: animation } },
                        ] },
                        text_table[0] !== undefined ? { n: UIT.R, config: { align: 'cm', minh: 0.7, padding: 0.05, minw: 2.9 }, nodes: [
                            { n: UIT.R, config: { align: 'cm', maxw: 2.8 }, nodes: [
                                { n: UIT.T, config: { id: key, ref_table: { val: '' }, ref_value: 'val', scale: 0.32, colour: C.WHITE, shadow: true, func: 'HUD_blind_debuff_prefix' } },
                                { n: UIT.T, config: { text: text_table[0], scale: 0.32, colour: C.WHITE, shadow: true } },
                            ] },
                            text_table[1] !== undefined ? { n: UIT.R, config: { align: 'cm', maxw: 2.8 }, nodes: [
                                { n: UIT.T, config: { text: text_table[1], scale: 0.32, colour: C.WHITE, shadow: true } },
                            ] } : null,
                        ] } : null,
                    ] },
                    { n: UIT.R, config: { align: 'cm', r: 0.1, padding: 0.05, minw: 3.1, colour: C.BLACK, emboss: 0.05 }, nodes: [
                        { n: UIT.R, config: { align: 'cm', maxw: 3 }, nodes: [
                            { n: UIT.T, config: { text: loc('ph_blind_score_at_least'), scale: 0.3, colour: C.WHITE, shadow: true } },
                        ] },
                        { n: UIT.R, config: { align: 'cm', minh: 0.6 }, nodes: [
                            { n: UIT.O, config: { w: 0.5, h: 0.5, colour: C.BLUE, object: stake_sprite, hover: true, can_collide: false } },
                            { n: UIT.B, config: { h: 0.1, w: 0.1 } },
                            { n: UIT.T, config: { text: numberFormat(blind_amt), scale: scoreNumberScale(0.9, blind_amt), lang: EN_FONT, colour: C.RED, shadow: true } },
                        ] },
                        { n: UIT.R, config: { align: 'cm' }, nodes: [
                            { n: UIT.T, config: { text: loc('ph_blind_reward'), scale: 0.35, colour: C.WHITE, shadow: true } },
                            { n: UIT.T, config: { text: `${'$'.repeat(center.dollars)}+`, lang: EN_FONT, scale: 0.35, colour: C.MONEY, shadow: true } },
                        ] },
                    ] },
                ] },
            ] },
        ] },
        { n: UIT.R, config: { id: 'blind_extras', align: 'cm' }, nodes: [extras] },
    ] };
}

/** 选盲注界面的全部盒子。`opts` 是三张卡（`G.blind_select_opts`），`select` 是装它们的外层 */
export type BlindSelect = {
    select: UIBox;
    opts: Partial<Record<BlindType, UIBox>>;
    prompt: UIBox;
};

/**
 * 「Choose your / next Blind」（`G.blind_prompt_box`），挂在左侧面板的 `row_blind` 上。
 * 兑换过 Director's Cut（或 Retcon）时下面多一个「Reroll Boss $10」（`reroll_boss_button` 每帧置灰）
 */
export function createBlindPrompt(rerollBoss = false): UINodeDef {
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR, padding: 0.2 }, nodes: [
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.O, config: { object: new DynaText({ string: [loc('ph_choose_blind_1')], colours: [C.WHITE], shadow: true, bump: true, scale: 0.6, pop_in: 0.5, maxw: 5 }), id: 'prompt_dynatext1' } },
        ] },
        { n: UIT.R, config: { align: 'cm' }, nodes: [
            { n: UIT.O, config: { object: new DynaText({ string: [loc('ph_choose_blind_2')], colours: [C.WHITE], shadow: true, bump: true, scale: 0.7, pop_in: 0.5, maxw: 5, silent: true }), id: 'prompt_dynatext2' } },
        ] },
        rerollBoss ? uiboxButton({ label: [loc('b_reroll_boss'), `${loc('$')}10`], button: 'reroll_boss', func: 'reroll_boss_button' }) : null,
    ] };
}

/**
 * Run Info 的 Blinds 页（`G.UIDEF.current_blinds`，`UI_definitions.lua:3266`）：三张 `run_info` 版的卡，各套一个黑描边
 */
export function currentBlinds(s: BlindSelectState, locBlindStates: Record<BlindType, string>): UINodeDef {
    const col = (type: BlindType): UINodeDef => ({ n: UIT.C, config: { align: 'tm', padding: 0.1, outline: 2, r: 0.1, line_emboss: 0.2, outline_colour: C.BLACK }, nodes: [
        createBlindChoice(type, s, locBlindStates, 1, true),
    ] });
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR, padding: 0.2 }, nodes: [col('Small'), col('Big'), col('Boss')] };
}

/**
 * `create_UIBox_blind_select` 的卡片部分与外层定义。三张卡的 UIBox 先建好（它们自己跑 `blind_choice_handler`），
 * 外层按 `G.hand.T.w` 撑宽。外层怎么挂由调用方给（`game.lua:3645`：`bmi` 对齐手牌区，offset 见那里）
 */
export function createBlindSelect(s: BlindSelectState, handW: number, locBlindStates: Record<BlindType, string>): { def: UINodeDef; opts: Partial<Record<BlindType, UIBox>>; funcs: UIFuncs } {
    const opts: Partial<Record<BlindType, UIBox>> = {};
    const funcs = blindChoiceFuncs(s, opts);
    for (const type of ['Small', 'Big', 'Boss'] as const) opts[type] = blindChoiceBox(type, s, locBlindStates, funcs);
    const def: UINodeDef = { n: UIT.ROOT, config: { align: 'tm', minw: handW, r: 0.15, colour: C.CLEAR }, nodes: [
        { n: UIT.R, config: { align: 'cm', padding: 0.5 }, nodes: [
            { n: UIT.O, config: { align: 'cm', object: opts.Small } },
            { n: UIT.O, config: { align: 'cm', object: opts.Big } },
            { n: UIT.O, config: { align: 'cm', object: opts.Boss } },
        ] },
    ] };
    return { def, opts, funcs };
}

/** 一张卡的 UIBox（`G.blind_select_opts.small / big / boss`）。`reroll_boss` 单独重建 Boss 那张 */
export function blindChoiceBox(type: BlindType, s: BlindSelectState, locBlindStates: Record<BlindType, string>, funcs: UIFuncs): UIBox {
    const colour = slotColour(s, type);
    const bg = type === 'Boss' ? mixColours(C.BLACK, colour, 0.8) : undefined;
    return new UIBox(
        { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: [dynContainer([createBlindChoice(type, s, locBlindStates)], false, colour, bg)] },
        { align: 'bmi', offset: { x: 0, y: 0 } },
        funcs,
    );
}

/** 卡片里用到的 `G.FUNCS` */
export function blindChoiceFuncs(s: BlindSelectState, opts: Partial<Record<BlindType, UIBox>>): UIFuncs {
    return {
        hover_tag_proxy: () => undefined,

        /** `button_callbacks.lua:193`：只有 The Wheel 的描述前面写几率的分子 */
        HUD_blind_debuff_prefix: (e: UIElement) => {
            const ref = e.config.ref_table as { val: string };
            if (e.config.id === 'bl_wheel') {
                ref.val = String(s.probabilities);
                e.config.scale = 0.32;
            } else {
                ref.val = '';
                e.config.scale = 0;
            }
        },

        /** `button_callbacks.lua:2741`：轮到的卡亮起、上提 0.9；其余盖灰、上提 0.2，按钮失效 */
        blind_choice_handler: (e: UIElement) => {
            const id = e.config.id as BlindType;
            const ref = e.config.ref_table as { deck: string | null; run_info?: boolean };
            if (ref.run_info) return;
            const box = opts[id];
            if (!box) return;
            const onDeck = blindOnDeck(s);
            if (!((ref.deck !== 'on' && id === onDeck) || (ref.deck !== 'off' && id !== onDeck))) return;

            const topButton = e.box.getById('select_blind_button');
            const border = e.box.root.children[0]!.children[0]!;
            const tag = e.box.getById(`tag_${id}`);
            const tagContainer = e.box.getById('tag_container');
            if (id === onDeck) {
                ref.deck = 'on';
                e.config.draw_after = false;
                e.config.colour = C.CLEAR;
                border.parent!.config.outline = 2;
                border.parent!.config.outline_colour = C.UI.TRANSPARENT_DARK;
                border.config.outline_colour = border.config.outline && border.config.outline_colour ? border.config.outline_colour : blindMainColour(s.choices[id]);
                border.config.outline = 1.5;
                box.config.offset = { x: 0, y: -0.9 };
                box.realign();
                if (tag && tagContainer) {
                    const skip = tag.children[1]!;
                    tagContainer.children[1]!.config.draw_after = false;
                    tagContainer.children[1]!.config.colour = C.BLACK;
                    skip.config.button = 'skip_blind';
                    tag.config.outline_colour = adjustAlpha(C.BLUE, 0.5);
                    skip.config.hover = true;
                    skip.config.colour = C.RED;
                    skip.children[0]!.config.colour = C.UI.TEXT_LIGHT;
                }
                if (topButton) {
                    topButton.config.button = 'select_blind';
                    topButton.config.colour = C.FILTER;
                    topButton.config.hover = true;
                    topButton.children[0]!.config.colour = C.WHITE;
                }
            } else {
                ref.deck = 'off';
                e.config.draw_after = true;
                e.config.colour = adjustAlpha(s.states[id] === 'Skipped' ? mixColours(C.BLUE, C.L_BLACK, 0.1) : C.L_BLACK, 0.5);
                border.parent!.config.outline = undefined;
                border.parent!.config.outline_colour = undefined;
                border.config.outline_colour = undefined;
                border.config.outline = undefined;
                box.config.offset = { x: 0, y: -0.2 };
                box.realign();
                if (tag && tagContainer) {
                    const skip = tag.children[1]!;
                    // 打过 / 跳过的格子：「or」和标签那一行扔到 10 tile 以下（`align(0, 10)`，即看不见了）
                    if (s.states[id] === 'Skipped' || s.states[id] === 'Defeated') {
                        tagContainer.children[1]!.align(0, 10);
                        tagContainer.children[0]!.align(0, 10);
                    }
                    skip.config.button = undefined;
                    tag.config.outline_colour = C.UI.BACKGROUND_INACTIVE;
                    skip.config.hover = false;
                    skip.config.colour = C.UI.BACKGROUND_INACTIVE;
                    skip.children[0]!.config.colour = C.UI.TEXT_INACTIVE;
                }
                if (topButton) {
                    topButton.config.colour = C.UI.BACKGROUND_INACTIVE;
                    topButton.config.button = undefined;
                    topButton.config.hover = false;
                    topButton.children[0]!.config.colour = C.UI.TEXT_INACTIVE;
                }
            }
        },
    };
}
