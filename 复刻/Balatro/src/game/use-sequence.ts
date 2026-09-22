/**
 * 用消耗品的表现（22 号票第四十二步）：`G.FUNCS.use_card`（`button_callbacks.lua:2265`）与
 * `Card:use_consumeable`（`card.lua:1092`）里入队的那一串事件。
 *
 * **逻辑层已经一次算完**（改牌、升级、毁牌都落地了），这里只按原作的节奏把结果「演」出来：
 * 用的那张飞到出牌区（开包时是手牌区上方）→ `delay(0.2)` → 各类消耗品自己的一段 → 0.2 秒后溶掉 → 0.1 秒后放开输入。
 *
 * 各类的那一段照原文：
 * - 改牌的塔罗（`mod_conv` / `suit_conv`，含 Strength、Death）：0.4 秒后 `tarot1`、用的那张弹一下；选中的牌逐张（0.15 秒）翻过去，
 *   `delay(0.2)`，逐张（0.1 秒）换成新牌面，逐张（0.15 秒）翻回来（`tarot2`），0.2 秒后放下选中，`delay(0.5)`
 * - 星球（`hand_type`）：本手那格先写上牌型与**升级前**的筹码 / 倍率 / 等级，`level_up_hand` 的三拍（每拍 `tarot1`、弹一下）
 *   倍率冒增量、筹码冒增量、等级跳一级，`delay(1.3)`，再清空那格
 * - Black Hole：同一套，但写的是 `All Hands` 与 `...` / `+` / `+1`
 * - 毁牌（`remove_card`）：0.4 秒后 `tarot1`、弹一下，The Hanged Man 再 0.2 秒、Familiar 一族再 0.1 秒后碎 / 溶
 * - 其余：0.4 秒后 `tarot1`、弹一下，结果在收尾时一次性刷出来（它们各自的细节动画还没做）
 */
import type { Card } from '../core/card';
import type { Consumable } from '../core/consumables';
import { DICTIONARY } from '../ui/lang.generated';
import { type EventManager, GameEvent } from '../core/event-queue';
import type { CardSprite } from './card-sprite';

type HandVals = { chips: number; mult: number; level: number };

export type UseDeps = {
    queue: EventManager;
    sound: (key: string, rate?: number, volume?: number) => void;
    delay: (t: number) => void;
    updateHandText: (config: { delay?: number; immediate?: boolean; sound?: string; volume?: number; pitch?: number; nopulse?: boolean },
        vals: { chips?: number | string; mult?: number | string; handname?: string; level?: number | string; StatusText?: boolean }) => void;
    /** 用的那张弹一下（`used_tarot:juice_up`） */
    juiceUsed: (amount: number, rot: number) => void;
    /** `G.TAROT_INTERRUPT_PULSE` */
    setPulse: (on: boolean) => void;
    /** 选中的手牌精灵（`G.hand.highlighted`，按选中顺序） */
    highlighted: CardSprite[];
    /** 按逻辑层的新状态重建这张牌的精灵（接着旧精灵的位置与翻面） */
    refreshCard: (card: Card) => void;
    /** `G.hand:unhighlight_all()` */
    unhighlightAll: () => void;
    /** 碎 / 溶掉被毁的手牌 */
    destroyCards: () => void;
    /** 星球 / Black Hole：各牌型升级前后的值 */
    handsBefore: Record<string, HandVals>;
    handsAfter: Record<string, HandVals>;
};

const handName = (key: string) => DICTIONARY[key] ?? key;

function event(d: UseDeps, delay: number, func: () => void, trigger: 'after' | 'before' = 'after'): void {
    d.queue.add(new GameEvent({ trigger, delay, func: () => { func(); return true; } }));
}

/** `level_up_hand(card, hand)`（非 instant）：三拍，每拍 `tarot1` + 弹一下，依次冒倍率、筹码、等级 */
function levelUpHand(d: UseDeps, after: { chips: number | string; mult: number | string; level: number | string }): void {
    event(d, 0.2, () => { d.sound('tarot1'); d.juiceUsed(0.8, 0.5); d.setPulse(true); });
    d.updateHandText({ delay: 0 }, { mult: after.mult, StatusText: true });
    event(d, 0.9, () => { d.sound('tarot1'); d.juiceUsed(0.8, 0.5); });
    d.updateHandText({ delay: 0 }, { chips: after.chips, StatusText: true });
    event(d, 0.9, () => { d.sound('tarot1'); d.juiceUsed(0.8, 0.5); d.setPulse(false); });
    d.updateHandText({ sound: 'button', volume: 0.7, pitch: 0.9, delay: 0 }, { level: after.level });
    d.delay(1.3);
}

/** `Card:use_consumeable` 的表现部分。调用前逻辑层已经 `use` 过了 */
export function queueUseConsumable(d: UseDeps, c: Consumable): void {
    const cfg = c.center.config as { mod_conv?: string; suit_conv?: string; hand_type?: string; remove_card?: boolean; max_highlighted?: number };
    const name = c.center.name;

    if (cfg.max_highlighted) d.updateHandText({ immediate: true, nopulse: true, delay: 0 }, { mult: 0, chips: 0, level: '', handname: '' });

    if (cfg.mod_conv || cfg.suit_conv) {
        event(d, 0.4, () => { d.sound('tarot1'); d.juiceUsed(0.3, 0.5); });
        const hl = d.highlighted;
        const n = hl.length;
        hl.forEach((sp, i) => {
            const percent = 1.15 - ((i + 1 - 0.999) / (n - 0.998)) * 0.3;
            event(d, 0.15, () => { sp.flip(); d.sound('card1', percent); sp.juiceUp(0.3, 0.3); });
        });
        d.delay(0.2);
        // 换牌面：逐张 0.1 秒（Death 把右边那张抄到别的上面，同一个节奏）
        hl.forEach((sp) => event(d, 0.1, () => d.refreshCard(sp.card)));
        hl.forEach((_, i) => {
            const percent = 0.85 + ((i + 1 - 0.999) / (n - 0.998)) * 0.3;
            // 翻回来的是换过的新精灵，到点再取
            event(d, 0.15, () => {
                const now = d.highlighted[i];
                now?.flip();
                d.sound('tarot2', percent, 0.6);
                now?.juiceUp(0.3, 0.3);
            });
        });
        event(d, 0.2, () => d.unhighlightAll());
        d.delay(0.5);
    }

    if (name === 'Black Hole') {
        d.updateHandText({ sound: 'button', volume: 0.7, pitch: 0.8, delay: 0.3 }, { handname: DICTIONARY.k_all_hands ?? 'All Hands', chips: '...', mult: '...', level: '' });
        event(d, 0.2, () => { d.sound('tarot1'); d.juiceUsed(0.8, 0.5); d.setPulse(true); });
        d.updateHandText({ delay: 0 }, { mult: '+', StatusText: true });
        event(d, 0.9, () => { d.sound('tarot1'); d.juiceUsed(0.8, 0.5); });
        d.updateHandText({ delay: 0 }, { chips: '+', StatusText: true });
        event(d, 0.9, () => { d.sound('tarot1'); d.juiceUsed(0.8, 0.5); d.setPulse(false); });
        d.updateHandText({ sound: 'button', volume: 0.7, pitch: 0.9, delay: 0 }, { level: '+1' });
        d.delay(1.3);
        d.updateHandText({ sound: 'button', volume: 0.7, pitch: 1.1, delay: 0 }, { mult: 0, chips: 0, handname: '', level: '' });
    }

    if (cfg.hand_type) {
        const before = d.handsBefore[cfg.hand_type]!;
        const after = d.handsAfter[cfg.hand_type]!;
        d.updateHandText({ sound: 'button', volume: 0.7, pitch: 0.8, delay: 0.3 }, { handname: handName(cfg.hand_type), chips: before.chips, mult: before.mult, level: before.level });
        levelUpHand(d, after);
        d.updateHandText({ sound: 'button', volume: 0.7, pitch: 1.1, delay: 0 }, { mult: 0, chips: 0, handname: '', level: '' });
    }

    if (cfg.remove_card) {
        event(d, 0.4, () => { d.sound('tarot1'); d.juiceUsed(0.3, 0.5); });
        event(d, name === 'The Hanged Man' ? 0.2 : 0.1, () => d.destroyCards());
        return;
    }

    if (!cfg.mod_conv && !cfg.suit_conv && !cfg.hand_type && name !== 'Black Hole') {
        event(d, 0.4, () => { d.sound('tarot1'); d.juiceUsed(0.3, 0.5); });
    }
}
