/**
 * 左侧面板那一格「本手」的 `G.FUNCS`（`button_callbacks.lua:2020-2149`），直译：
 * 数值（`chips` / `mult` / `chip_total` / `handname`）变了就改显示用的字串与字号，再 `text_super_juice`——
 * 按位数给 DynaText 一个抖（`set_quiver(0.03·位数)`）和一道脉冲（`pulse(0.3 + 0.08·位数)`）。
 * 场景只写数值（照 `update_hand_text`），显示由这几个函数每帧同步。
 */
import { DynaText } from '../dynatext';
import { numberFormat } from '../format';
import type { UIElement, UIFuncs } from '../uibox';
import type { HudState } from './hud';
import { scaleNumber } from './hud-blind';

/** `G.FUNCS.text_super_juice` */
function superJuice(e: UIElement, amount: number): void {
    const d = e.config.object as DynaText;
    d.setQuiver(0.03 * amount);
    d.pulse(0.3 + 0.08 * amount);
}

const digits = (v: number | string) => Math.max(0, Math.floor(Math.log10(typeof v === 'number' && v > 0 ? v : 1)));

export function hudFuncs(state: HudState): UIFuncs {
    const hand = state.current_round.current_hand;
    let lastTotal = -Infinity;
    return {
        /** `:2139`：牌型名变了按长度定字号（13 字及以上 `12·0.56/len`，否则 `2.4/√(len+5)`） */
        hand_text_UI_set: (e: UIElement) => {
            if (hand.handname === hand.handname_text) return;
            hand.handname_text = hand.handname;
            const d = e.config.object as DynaText;
            const len = hand.handname.length;
            d.scale = len >= 13 ? (12 * 0.56) / len : 2.4 / Math.sqrt(len + 5);
            d.update();
            e.box.recalculate();
        },
        /** `:2030`：筹码 */
        hand_chip_UI_set: (e: UIElement) => {
            const text = typeof hand.chips === 'number' ? numberFormat(hand.chips) : hand.chips;
            if (text === hand.chip_text) return;
            hand.chip_text = text;
            const d = e.config.object as DynaText;
            d.scale = typeof hand.chips === 'number' ? scaleNumber(hand.chips, 0.9, 1000) : 0.9;
            d.update();
            if (!state.tarot_interrupt_pulse) superJuice(e, digits(hand.chips));
            e.box.recalculate();
        },
        /** `:2020`：倍率 */
        hand_mult_UI_set: (e: UIElement) => {
            const text = typeof hand.mult === 'number' ? numberFormat(hand.mult) : hand.mult;
            if (text === hand.mult_text) return;
            hand.mult_text = text;
            const d = e.config.object as DynaText;
            d.scale = typeof hand.mult === 'number' ? scaleNumber(hand.mult, 0.9, 1000) : 0.9;
            d.update();
            if (!state.tarot_interrupt_pulse) superJuice(e, digits(hand.mult));
            e.box.recalculate();
        },
        /** `:2040`：这一手的总分（< 1 时不显示）；变大时才 juice */
        hand_chip_total_UI_set: (e: UIElement) => {
            if (hand.chip_total < 1) {
                hand.chip_total_text = '';
                return;
            }
            const text = numberFormat(hand.chip_total);
            if (text === hand.chip_total_text) return;
            const d = e.config.object as DynaText;
            d.scale = scaleNumber(hand.chip_total, 0.95, 100000000);
            hand.chip_total_text = text;
            if (lastTotal < hand.chip_total) superJuice(e, Math.floor(Math.log10(hand.chip_total)));
            lastTotal = hand.chip_total;
            d.update();
            e.box.recalculate();
        },
        // 分数火焰（`flame_handler`）还没做
        flame_handler: () => undefined,
    };
}
