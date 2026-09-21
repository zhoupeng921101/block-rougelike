/**
 * UI 布局引擎对拍**原作的 Lua 引擎本身**（22 号票）。
 *
 * 真值由 `tools/ui-oracle.py` 生成：用 LuaJIT 原样加载 `engine/ui.lua` 等文件、跑同一份 UI 定义，
 * 导出每个元素最终的 `T`（已经 `move_with_major` 到房间坐标）。两边字体度量是同一个模型，
 * 所以这里验的是布局算法——`calculate_xywh` / `set_wh` / `set_alignments` / `align_to_major`。
 */
import { describe, expect, it } from 'vitest';

import { cardAreas } from '../game/areas';
import { type BlindSelectState, createBlindPrompt, createBlindSelect } from './definitions/blind-select';
import { createButtons } from './definitions/buttons';
import { type EvalRow, RoundEval, evalTimeline } from './definitions/round-eval';
import { cardAreaBox } from './definitions/card-area';
import { createShop, createShopSign, priceTag, shopAreas } from './definitions/shop';
import { createBoosterPack, packCardsArea } from './definitions/booster-pack';
import { buyAndUseButton, shopBuyButton, useAndSellButtons } from './definitions/card-buttons';
import { createHudBlind, makeHudBlindState } from './definitions/hud-blind';
import { hudBlindFuncs } from './definitions/hud-blind-funcs';
import { makeHudState, createHud } from './definitions/hud';
import oracle from './oracle.generated.json';
import { UIBox, type UIElement } from './uibox';

type Case = { name: string; box: number[]; elements: Array<[number, string, number, number, number, number]> };
const cases = oracle as unknown as Case[];

function dump(box: UIBox): Array<[number, string, number, number, number, number]> {
    const out: Array<[number, string, number, number, number, number]> = [];
    const walk = (e: UIElement) => {
        out.push([e.UIT, e.config.id ?? '', e.x, e.y, e.T.w, e.T.h]);
        for (const c of e.children) walk(c);
    };
    walk(box.root);
    return out;
}

function expectSame(actual: ReturnType<typeof dump>, expected: Case['elements']): void {
    expect(actual).toHaveLength(expected.length);
    actual.forEach((a, i) => {
        const e = expected[i]!;
        const where = `#${i} UIT=${e[0]} id='${e[1]}'`;
        expect([a[0], a[1]], where).toEqual([e[0], e[1]]);
        for (let k = 2; k < 6; k++) expect(a[k], `${where} [${'xywh'[k - 2]}]`).toBeCloseTo(e[k] as number, 9);
    });
}

describe('UIBox 对拍 Lua 原作引擎', () => {
    it('create_UIBox_HUD：左侧面板 80 个元素的位置与尺寸', () => {
        const expected = cases.find((c) => c.name === 'hud')!;
        const box = new UIBox(createHud(makeHudState()), {
            align: 'cli',
            offset: { x: -0.7, y: 0 },
            major: { T: { x: 0, y: 0, w: 21, h: 11.2 } },
        });
        expect([box.T.x, box.T.y, box.T.w, box.T.h].map((v) => Number(v.toFixed(9))))
            .toEqual(expected.box.map((v) => Number(v.toFixed(9))));
        expectSame(dump(box), expected.elements);
    });

    /** `area_uibox`：底板那行 `mid = true`，UIBox 以它居中对齐到区域，计数行挂在下面 */
    const areas = cardAreas();
    it.each([
        ['area_jokers', areas.jokers, 'cl', 0, 5],
        ['area_consumeables', areas.consumeables, 'cr', 0, 2],
        ['area_hand', areas.hand, 'cm', 8, 8],
        ['area_deck', areas.deck, 'cr', 44, 52],
    ] as const)('%s：CardArea 的底框与计数', (name, area, align, count, limit) => {
        const expected = cases.find((c) => c.name === name)!;
        const box = new UIBox(cardAreaBox(area, { card_count: count, card_limit: limit }, align), {
            align: 'cm',
            offset: { x: 0, y: 0 },
            major: { T: area },
        });
        expectSame(dump(box), expected.elements);
    });

    /**
     * 盲注面板：挂在 HUD 的 `row_blind` 上。几个 `func`（debuff 行伸缩、分数字号、奖励行）在建盒子时跑一次、
     * 画第一帧前再跑一次——Boss 那一格两行 debuff 文字把面板撑高，小盲注那一格收起
     */
    it.each([
        ['hud_blind_small', 'Small Blind', 300, [] as string[]],
        ['hud_blind_head', 'The Head', 600, ['All Heart cards', 'are debuffed']],
    ])('%s：create_UIBox_HUD_blind 与它的 G.FUNCS', (name, blindName, chips, lines) => {
        const expected = cases.find((c) => c.name === name)!;
        const hud = new UIBox(createHud(makeHudState()), {
            align: 'cli', offset: { x: -0.7, y: 0 }, major: { T: { x: 0, y: 0, w: 21, h: 11.2 } },
        });
        const row = hud.getById('row_blind')!;
        const state = makeHudBlindState();
        Object.assign(state.blind, {
            key: 'x', loc_name: blindName, chips, chip_text: String(chips),
            loc_debuff_text: lines.length ? `${lines[0]} ${lines[1]}` : '',
        });
        state.blind.loc_debuff_lines['1'] = lines[0] ?? '';
        state.blind.loc_debuff_lines['2'] = lines[1] ?? '';
        state.current_round.dollars_to_be_earned = '$$$';
        const box = new UIBox(createHudBlind(state), {
            align: 'cm', offset: { x: 0, y: 0 }, major: { T: { x: row.x, y: row.y, w: row.T.w, h: row.T.h } },
        }, hudBlindFuncs(state));
        box.runFuncs();
        expectSame(dump(box), expected.elements);
    });

    it('create_UIBox_buttons（移动版、出牌在左）：挂在选牌状态的手牌区下面', () => {
        const expected = cases.find((c) => c.name === 'buttons_mobile')!;
        const hand = { ...areas.hand, y: areas.hand.y - 1.9 };
        const box = new UIBox(createButtons({ playButtonPos: 2, mobile: true }), {
            align: 'bm',
            offset: { x: 0, y: 0.3 },
            major: { T: hand },
        });
        expectSame(dump(box), expected.elements);
    });

    /**
     * 选盲注界面：外层挂在手牌区（`bmi`，offset 按 `game.lua:3649` 的终值），三张卡是 O 节点里的嵌套 UIBox；
     * `blind_choice_handler` 跑过一遍之后，轮到的小盲注上提 0.9、其余 0.2
     */
    it('create_UIBox_blind_select：外层、三张卡与左侧提示框', () => {
        const state: BlindSelectState = {
            ante: 1,
            choices: { Small: 'bl_small', Big: 'bl_big', Boss: 'bl_head' },
            states: { Small: 'Select', Big: 'Upcoming', Boss: 'Upcoming' },
            tags: { Small: 'tag_economy', Big: 'tag_investment' },
            mostPlayedHand: 'High Card',
            probabilities: 1,
        };
        const { def, opts } = createBlindSelect(state, areas.hand.w, { Small: 'Select', Big: 'Upcoming', Boss: 'Upcoming' });
        const select = new UIBox(def, { align: 'bmi', offset: { x: 0, y: 29 }, major: { T: areas.hand } });
        select.config.offset = { x: 0, y: 0.8 - (areas.hand.y - areas.jokers.y) + select.T.h };
        select.realign();
        for (const box of Object.values(opts)) box.runFuncs();
        expectSame(dump(select), cases.find((c) => c.name === 'blind_select')!.elements);
        expectSame(dump(opts.Small!), cases.find((c) => c.name === 'blind_choice_small')!.elements);
        expectSame(dump(opts.Big!), cases.find((c) => c.name === 'blind_choice_big')!.elements);
        expectSame(dump(opts.Boss!), cases.find((c) => c.name === 'blind_choice_boss')!.elements);

        const hud = new UIBox(createHud(makeHudState()), {
            align: 'cli', offset: { x: -0.7, y: 0 }, major: { T: { x: 0, y: 0, w: 21, h: 11.2 } },
        });
        const prompt = new UIBox(createBlindPrompt(), { align: 'cm', offset: { x: 0, y: 0 }, major: hud.getById('row_blind')!.asMajor });
        expectSame(dump(prompt), cases.find((c) => c.name === 'blind_prompt')!.elements);
    });

    /**
     * 回合结算：空面板挂在手牌区下（offset −7.8），按 `evaluate_round` 的事件顺序一行行 `add_child`，
     * 最后单独一个 Cash Out 盒子。A 是 TESTSEED 第二局的实机局面，B 多一行利息
     */
    it.each([
        ['a', [
            { name: 'blind1', dollars: 3, blindPos: { x: 0, y: 0 }, chipText: '300', chips: 300 },
            { name: 'hands', dollars: 2, disp: 2, per: 1 },
        ]],
        ['b', [
            { name: 'blind1', dollars: 3, blindPos: { x: 0, y: 0 }, chipText: '300', chips: 300 },
            { name: 'hands', dollars: 3, disp: 3, per: 1 },
            { name: 'interest', dollars: 1, interestAmount: 1, interestCap: 25 },
        ]],
    ] as Array<[string, EvalRow[]]>)('round_eval_%s：create_UIBox_round_evaluation 与 add_round_eval_row', (k, rows) => {
        const ev = new RoundEval({ T: areas.hand });
        for (const { step } of evalTimeline(rows, 3)) ev.apply(step);
        expectSame(dump(ev.box), cases.find((c) => c.name === `round_eval_${k}`)!.elements);
        expectSame(dump(ev.cashOut!), cases.find((c) => c.name === `cash_out_${k}`)!.elements);
    });

    /** 商店外框挂在手牌区上（`tmi`，offset −5.3）；招牌挂在 `row_blind`；价签挂在卡上（`tm`，offset 0.38） */
    it('G.UIDEF.shop、SHOP 招牌与价签', () => {
        const shop = new UIBox(createShop(shopAreas(2), 1, { reroll_cost: 5 }), { align: 'tmi', offset: { x: 0, y: -5.3 }, major: { T: areas.hand } });
        expectSame(dump(shop), cases.find((c) => c.name === 'shop')!.elements);

        const hud = new UIBox(createHud(makeHudState()), {
            align: 'cli', offset: { x: -0.7, y: 0 }, major: { T: { x: 0, y: 0, w: 21, h: 11.2 } },
        });
        const sign = new UIBox(createShopSign(), { align: 'cm', offset: { x: 0, y: 0 }, major: hud.getById('row_blind')!.asMajor });
        expectSame(dump(sign), cases.find((c) => c.name === 'shop_sign')!.elements);

        const card = { cost: 5, T: { x: 8, y: 4, w: (2.4 * 35) / 41, h: (2.4 * 47) / 41 } };
        const price = new UIBox(priceTag(card), { align: 'tm', offset: { x: 0, y: 0.38 }, major: card });
        expectSame(dump(price), cases.find((c) => c.name === 'price_tag')!.elements);
    });

    /** 开包界面挂在手牌区上（`tmi`，offset −2.2），五个口味只差标题与区域宽 */
    it('create_UIBox_*_pack：奥秘 3、天体 3、小丑 2、巨型标准 5', () => {
        const table = [['arcana', 'Arcana', 3, 1], ['celestial', 'Celestial', 3, 1], ['buffoon', 'Buffoon', 2, 1], ['standard', 'Standard', 5, 2]] as const;
        for (const [name, kind, size, choices] of table) {
            const box = new UIBox(createBoosterPack(kind, packCardsArea(kind, size), { pack_choices: choices }), {
                align: 'tmi', offset: { x: 0, y: -2.2 }, major: { T: areas.hand },
            });
            expectSame(dump(box), cases.find((c) => c.name === `pack_${name}`)!.elements);
        }
    });

    /** 选中一张卡之后的按钮：挂法照 `Card:highlight`（小丑区 / 消耗品区 `cr`，开包 `bmi` 下压 0.65）与 `create_shop_card_ui` */
    it('use_and_sell_buttons 与商店的 BUY / REDEEM / OPEN / BUY & USE', () => {
        const card = () => ({ T: { x: 8, y: 4, w: (2.4 * 35) / 41, h: (2.4 * 47) / 41 }, sell_cost_label: 3 });
        const cases2: Array<[string, () => UIBox]> = [
            ['btn_joker', () => { const c = card(); return new UIBox(useAndSellButtons(c, 'joker', false), { align: 'cr', offset: { x: -0.4, y: 0 }, major: c }); }],
            ['btn_consumeable', () => { const c = card(); return new UIBox(useAndSellButtons(c, 'joker', true), { align: 'cr', offset: { x: -0.5, y: 0 }, major: c }); }],
            ['btn_pack_consumeable', () => { const c = card(); return new UIBox(useAndSellButtons(c, 'pack', true), { align: 'bmi', offset: { x: 0, y: 0.65 }, major: c }); }],
            ['btn_pack_joker', () => { const c = card(); return new UIBox(useAndSellButtons(c, 'pack', false), { align: 'bmi', offset: { x: 0, y: 0.65 }, major: c }); }],
            ['btn_shop_buy', () => { const c = card(); return new UIBox(shopBuyButton('other', c), { align: 'bm', offset: { x: 0, y: -0.3 }, major: c }); }],
            ['btn_shop_redeem', () => { const c = card(); return new UIBox(shopBuyButton('Voucher', c), { align: 'bm', offset: { x: 0, y: -0.3 }, major: c }); }],
            ['btn_shop_open', () => { const c = card(); return new UIBox(shopBuyButton('Booster', c), { align: 'bm', offset: { x: 0, y: -0.3 }, major: c }); }],
            ['btn_shop_buy_and_use', () => { const c = card(); return new UIBox(buyAndUseButton(c), { align: 'cr', offset: { x: -0.3, y: 0 }, major: c }); }],
        ];
        for (const [name, make] of cases2) expectSame(dump(make()), cases.find((c) => c.name === name)!.elements);
    });
});
