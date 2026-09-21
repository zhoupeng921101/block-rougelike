/**
 * 回合结算（22 号票）：`UI_definitions.lua:1719` 的 `create_UIBox_round_evaluation` 与
 * `common_events.lua:929` 的 `add_round_eval_row`，逐节点直译。
 *
 * 面板先建成空的（三格 `base_round_eval` / `bonus_round_eval` / `eval_bottom`），
 * 之后由 `evaluate_round`（`state_events.lua:1156`）按事件队列一行行 `add_child` 进去：
 * 盲注行 → 虚线 → 剩余出牌 / 弃牌 / 小丑 / 标签 / 利息 → 最后单独一个 UIBox 的「Cash Out: $N」按钮。
 * 这里只给「每一行长什么样」与「按什么顺序、隔多久加」，加的动作由场景按时间表执行。
 */
import { C } from '../colours';
import { DynaText } from '../dynatext';
import { EN_FONT } from '../font';
import { DICTIONARY, V_DICTIONARY } from '../lang.generated';
import { type Major, type Rect, UIBox, type UIElement, type UINodeDef, UIT } from '../uibox';
import type { BlindChipObject, TagSpriteObject } from './blind-select';
import { dynContainer } from './blind-select';
import { stakeSprite } from './hud';
import { scaleNumber } from './hud-blind';

const loc = (key: string) => DICTIONARY[key] ?? 'ERROR';

/** `localize{type = 'variable', key, vars}`：`#i#` 换成第 i 个值 */
export function locVariable(key: string, vars: Array<string | number>): string {
    return (V_DICTIONARY[key] ?? 'ERROR').replace(/#(\d+)#/g, (_, i: string) => String(vars[Number(i) - 1]));
}

/** `create_UIBox_round_evaluation`。`handW` 是 `G.hand.T.w` */
export function createRoundEvaluation(handW: number): UINodeDef {
    const width = handW - 2;
    return { n: UIT.ROOT, config: { align: 'tm', colour: C.CLEAR }, nodes: [
        dynContainer([
            { n: UIT.R, config: { align: 'tm', minw: width, minh: 3, padding: 0.1, r: 0.1, colour: C.BLACK, emboss: 0.05 }, nodes: [
                { n: UIT.R, config: { align: 'cm', minw: width, minh: 1.4 }, nodes: [] },
                { n: UIT.R, config: { align: 'cm', minw: width, id: 'base_round_eval' }, nodes: [] },
                { n: UIT.R, config: { align: 'cm', minw: width, id: 'bonus_round_eval' }, nodes: [] },
            ] },
            { n: UIT.R, config: { align: 'cm', minh: 0.05 }, nodes: [] },
            { n: UIT.R, config: { align: 'cm', minw: width, id: 'eval_bottom' }, nodes: [] },
        ], false),
    ] };
}

/** `add_round_eval_row` 的参数（原作的 `config`） */
export type EvalRow =
    | { name: 'blind1'; dollars: number; blindPos: { x: number; y: number }; chipText: string; chips: number; saved?: boolean }
    | { name: 'hands' | 'discards'; dollars: number; disp: number; per: number }
    | { name: `joker${number}`; dollars: number; jokerName: string }
    | { name: `tag${number}`; dollars: number; tagPos: { x: number; y: number }; condition: string }
    | { name: 'interest'; dollars: number; interestAmount: number; interestCap: number };

/** 盲注行以外的都进 `bonus_round_eval`（原文 `config.bonus`） */
export const isBonus = (row: EvalRow) => row.name !== 'blind1';

/** 虚线分隔（第一条 bonus 行之前加一次）。`width = G.round_eval.T.w − 0.51` */
export function spacerRow(width: number): UINodeDef {
    return { n: UIT.R, config: { align: 'cm', minw: width }, nodes: [
        { n: UIT.O, config: { object: new DynaText({ string: ['......................................'], colours: [C.WHITE], shadow: true, float: true, y_offset: -30, scale: 0.45, spacing: 13.5, font: EN_FONT, pop_in: 0 }) } },
    ] };
}

/** 一行的左半（说明）与右半（放 `$` 的空列，id `dollar_<name>`） */
export function evalRow(row: EvalRow, width: number, stake = 1): UINodeDef {
    const scale = 0.9;
    const left: UINodeDef[] = [];
    const dyn = (text: string, colour = C.UI.TEXT_LIGHT, s = 0.4 * scale): UINodeDef =>
        ({ n: UIT.O, config: { object: new DynaText({ string: [text], colours: [colour], shadow: true, pop_in: 0, scale: s, silent: true }) } });
    if (row.name === 'blind1') {
        const chip: BlindChipObject = { kind: 'blind_chip', pos: row.blindPos, shadowHeight: 0.05, T: { x: 0, y: 0, w: 1.2, h: 1.2 } as Rect };
        left.push({ n: UIT.O, config: { w: 1.2, h: 1.2, object: chip, hover: true, can_collide: false } });
        left.push(row.saved
            ? { n: UIT.C, config: { padding: 0.05, align: 'cm' }, nodes: [
                { n: UIT.R, config: { align: 'cm' }, nodes: [dyn(` ${loc('ph_mr_bones')} `, C.FILTER, 0.5 * scale)] },
            ] }
            : { n: UIT.C, config: { padding: 0.05, align: 'cm' }, nodes: [
                { n: UIT.R, config: { align: 'cm' }, nodes: [dyn(` ${loc('ph_score_at_least')} `)] },
                { n: UIT.R, config: { align: 'cm', minh: 0.8 }, nodes: [
                    { n: UIT.O, config: { w: 0.5, h: 0.5, object: stakeSprite(stake, 0.5), hover: true, can_collide: false } },
                    { n: UIT.T, config: { text: row.chipText, scale: scaleNumber(row.chips, scale, 100000), colour: C.RED, shadow: true } },
                ] },
            ] });
    } else if (row.name.startsWith('tag')) {
        const r = row as Extract<EvalRow, { tagPos: unknown }>;
        const sprite: TagSpriteObject = { kind: 'sprite', atlas: 'tags', pos: r.tagPos, T: { x: 0, y: 0, w: 0.7, h: 0.7 }, shadowHeight: 0.05, float: true };
        left.push({ n: UIT.O, config: { w: 0.7, h: 0.7, object: sprite, hover: true, can_collide: false } });
        left.push(dyn(r.condition));
    } else if (row.name === 'hands' || row.name === 'discards') {
        left.push({ n: UIT.T, config: { text: String(row.disp), scale: 0.8 * scale, colour: row.name === 'hands' ? C.BLUE : C.RED, shadow: true, juice: true } });
        left.push(dyn(` ${locVariable(row.name === 'hands' ? 'remaining_hand_money' : 'remaining_discard_money', [row.per])}`));
    } else if (row.name.startsWith('joker')) {
        const r = row as Extract<EvalRow, { jokerName: unknown }>;
        left.push(dyn(r.jokerName, C.FILTER, 0.6 * scale));
    } else if (row.name === 'interest') {
        left.push({ n: UIT.T, config: { text: String(row.dollars), scale: 0.8 * scale, colour: C.MONEY, shadow: true, juice: true } });
        left.push(dyn(` ${locVariable('interest', [row.interestAmount, 5, (row.interestAmount * row.interestCap) / 5])}`));
    }
    return { n: UIT.R, config: { align: 'cm', minw: 5 }, nodes: [
        { n: UIT.C, config: { padding: 0.05, minw: width * 0.55, minh: 0.61, align: 'cl' }, nodes: left },
        { n: UIT.C, config: { padding: 0.05, minw: width * 0.45, align: 'cr' }, nodes: [
            { n: UIT.C, config: { align: 'cm', id: `dollar_${row.name}` }, nodes: [] },
        ] },
    ] };
}

/** 每 30 个 `$` 起一行（`i % 30 == 1`） */
export function dollarRow(name: string, k: number): UINodeDef {
    return { n: UIT.R, config: { align: 'cm', id: `dollar_row_${k}_${name}` }, nodes: [] };
}

/** 一个 `$`。多了字号缩小 */
export function dollarSign(total: number): UINodeDef {
    const scale = total > 20 ? 0.28 : total > 9 ? 0.43 : 0.58;
    return { n: UIT.T, config: { text: loc('$'), colour: C.MONEY, scale, shadow: true, hover: true, can_collide: false, juice: true } };
}

/** 超过 60 块时整行只写一个「$N」 */
export function bigDollars(name: string, total: number): UINodeDef {
    return { n: UIT.R, config: { align: 'cm', id: `dollar_row_1_${name}` }, nodes: [
        { n: UIT.O, config: { object: new DynaText({ string: [`${loc('$')}${total}`], colours: [C.MONEY], shadow: true, pop_in: 0, scale: 0.65, float: true }) } },
    ] };
}

/** 「Cash Out: $N」：单独一个 UIBox，`tmi` 挂在结算面板上、下移 0.4 */
export function cashOutButton(dollars: number): UINodeDef {
    const scale = 0.9;
    return { n: UIT.ROOT, config: { align: 'cm', colour: C.CLEAR }, nodes: [
        { n: UIT.R, config: { id: 'cash_out_button', align: 'cm', padding: 0.1, minw: 7, r: 0.15, colour: C.ORANGE, shadow: true, hover: true, one_press: true, button: 'cash_out' }, nodes: [
            { n: UIT.T, config: { text: `${loc('b_cash_out')}: `, scale: 1, colour: C.UI.TEXT_LIGHT, shadow: true } },
            { n: UIT.T, config: { text: `${loc('$')}${dollars}`, scale: 1.2 * scale, colour: C.WHITE, shadow: true, juice: true } },
        ] },
    ] };
}

/**
 * `evaluate_round` + `add_round_eval_row` 的事件队列，摊平成一串「等多久、做什么」。
 * 原作的事件：`trigger = 'before'` 先执行再等 `delay`，`'after'` 先等再执行，`delay(t)` 是只等不做的事件。
 * 这里每一步是 `{ wait, then }`：先等 `wait` 秒、再执行 `then`（`before` 的等待挪到下一步前面）。
 */
export type EvalStep =
    | { kind: 'row'; row: EvalRow }
    | { kind: 'spacer' }
    | { kind: 'dollar'; row: EvalRow; i: number }
    | { kind: 'big_dollars'; row: EvalRow }
    | { kind: 'defeat' }
    | { kind: 'cash_out'; dollars: number };

export function evalTimeline(rows: EvalRow[], blindDollars: number): Array<{ wait: number; step: EvalStep }> {
    const out: Array<{ wait: number; step: EvalStep }> = [];
    let pending = 0;
    const wait = (t: number) => { pending += t; };
    const now = (step: EvalStep) => { out.push({ wait: pending, step }); pending = 0; };
    let dividerAdded = false;

    const addRow = (row: EvalRow) => {
        if (row.name !== 'blind1') {
            if (!dividerAdded) {
                wait(0.25);
                now({ kind: 'spacer' });
                wait(0.6);
                dividerAdded = true;
            }
        } else wait(0.2);
        wait(0.2);
        now({ kind: 'row', row });
        wait(0.5);
        const n = row.dollars;
        if (n > 60) {
            now({ kind: 'big_dollars', row });
            wait(0.38);
        } else {
            const d = 0.18 - (n > 20 ? 0.13 : n > 9 ? 0.1 : 0);
            // 原文 `for i = 1, num_dollars or 1`：Lua 里 0 是真值，0 块钱就一个 `$` 都不加
            for (let i = 1; i <= n; i++) {
                now({ kind: 'dollar', row, i });
                wait(d);
            }
        }
    };

    const [blind, ...rest] = rows;
    addRow(blind!);
    // `blind:defeat()`：左上盲注面板收起
    now({ kind: 'defeat' });
    wait((1.3 * Math.min(blindDollars + 2, 7)) / 2 * 0.15 + 0.5);
    wait(0.2);
    for (const row of rest) addRow(row);
    const total = rows.reduce((n, r) => n + r.dollars, 0);
    wait(0.4);
    now({ kind: 'cash_out', dollars: total });
    return out;
}

/**
 * 结算面板本体 + 按 `EvalStep` 往里加东西（`add_round_eval_row` 里那几个事件的 `func` 部分）。
 * 不碰 Phaser：场景按时间表调 `apply`，单测一口气全调完再与 Lua 真值比
 */
export class RoundEval {
    readonly box: UIBox;
    /** 「Cash Out」按钮的盒子，最后一步才有 */
    cashOut: UIBox | null = null;
    private readonly dollarRows = new Map<string, number>();

    constructor(hand: Major) {
        this.box = new UIBox(createRoundEvaluation(hand.T.w), { align: 'bm', offset: { x: 0, y: -7.8 }, major: hand });
        this.width = this.box.T.w - 0.51;
    }

    /**
     * `G.round_eval.T.w − 0.51`，**取空面板的宽度**：`evaluate_round` 一口气调完所有 `add_round_eval_row`
     * （宽度在调用时就算好了），事件之后才逐个执行。而每加一行盒子会宽 0.01（容器内边距合计 0.52），
     * 按执行时的宽度算就会越来越宽
     */
    private readonly width: number;

    private target(row: EvalRow): UIElement {
        return this.box.getById(isBonus(row) ? 'bonus_round_eval' : 'base_round_eval')!;
    }

    apply(step: EvalStep): void {
        switch (step.kind) {
            case 'spacer': {
                // 虚线加在**第一条 bonus 行**要去的那一格（原文按 `config.bonus` 选，恒是 bonus）
                this.box.addChild(spacerRow(this.width), this.box.getById('bonus_round_eval')!);
                break;
            }
            case 'row':
                this.box.addChild(evalRow(step.row, this.width), this.target(step.row));
                break;
            case 'dollar': {
                const name = step.row.name;
                if (step.i % 30 === 1) {
                    const k = (this.dollarRows.get(name) ?? 0) + 1;
                    this.dollarRows.set(name, k);
                    this.box.addChild(dollarRow(name, k), this.box.getById(`dollar_${name}`)!);
                }
                const k = this.dollarRows.get(name)!;
                this.box.addChild(dollarSign(step.row.dollars), this.box.getById(`dollar_row_${k}_${name}`)!);
                break;
            }
            case 'big_dollars':
                this.box.addChild(bigDollars(step.row.name, step.row.dollars), this.box.getById(`dollar_${step.row.name}`)!);
                break;
            case 'cash_out':
                this.cashOut = new UIBox(cashOutButton(step.dollars), { align: 'tmi', offset: { x: 0, y: 0.4 }, major: this.box });
                break;
            case 'defeat':
                break;
        }
    }
}
