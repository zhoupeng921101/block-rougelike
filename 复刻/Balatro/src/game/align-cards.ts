/**
 * `cardarea.lua:416` 的 `CardArea:align_cards`：卡在区域里摆在哪、转多少（22 号票）。不 import Phaser。
 *
 * 原作把结果写进卡的 `T`（目标变换），`VT` 再缓动过去。**机制只用到先后顺序**（出牌按 `T.x` 排），
 * 而这些公式对下标单调，与 `core` 里 `alignHand` 的 `i * CARD_W` 同序——所以 core 不动，
 * 表现层按原式算真正的摆放。时间项（`G.TIMERS.REAL` 的正弦）是原作的「微动」，照抄。
 *
 * 正弦项都乘 `wobble()`：设置里开了 Reduced Motion 就不晃（原文每一项前面的 `(G.SETTINGS.reduced_motion and 0 or 1)`）。
 *
 * 公式里读的 `card.T.x`（正弦的相位、阴影视差）是**上一帧**的值：原文先算 r 再改 x，这里由调用方传进来。
 */
import { CARD_H, CARD_W, TILE_W } from './coords';
import type { Rect } from '../ui/uibox';
import { wobble } from './settings';

/** `globals.lua` 的 `G.HIGHLIGHT_H` */
export const HIGHLIGHT_H = 0.2 * CARD_H;

export type Placed = { x: number; y: number; r: number };

/** `moveable.lua:459`：只有 x 分量随位置变 */
export function cardShadowParallaxX(x: number, w: number): number {
    return ((x + w / 2 - TILE_W / 2) / (TILE_W / 2)) * 1.5;
}

type CardIn = { highlighted: boolean; prevX: number; w?: number; h?: number };

/** `(k-1)/max(max_cards-1,1) - 0.5*(#cards-max_cards)/max(max_cards-1,1)` 那一串：均摊到区域宽度上 */
function spread(area: Rect, k: number, n: number, limit: number, w: number, cardW = CARD_W): number {
    const maxCards = Math.max(n, limit);
    const d = Math.max(maxCards - 1, 1);
    return area.x + (area.w - cardW) * ((k - 1) / d - (0.5 * (n - maxCards)) / d) + 0.5 * (cardW - w);
}

/** `cardarea.lua:456`：手牌（不在开包时）。扇形、两端下沉、±0.1 弧度转角 */
export function alignHand(area: Rect, cards: CardIn[], limit: number, real: number): Placed[] {
    const n = cards.length;
    return cards.map((c, i) => {
        const k = i + 1;
        const w = c.w ?? CARD_W;
        const h = c.h ?? CARD_H;
        const r = (0.2 * (-n / 2 - 0.5 + k)) / n + wobble() * 0.02 * Math.sin(2 * real + c.prevX);
        let x = spread(area, k, n, limit, w);
        const lift = c.highlighted ? HIGHLIGHT_H : 0;
        const y = area.y + area.h / 2 - h / 2 - lift + wobble() * 0.03 * Math.sin(0.666 * real + x) + Math.abs((0.5 * (-n / 2 + k - 0.5)) / n) - 0.2;
        x += cardShadowParallaxX(c.prevX, w) / 30;
        return { x, y, r };
    });
}

/** `cardarea.lua:501`：出牌区与商店。不转、不晃 */
export function alignPlay(area: Rect, cards: CardIn[], limit: number, cardW = CARD_W): Placed[] {
    const n = cards.length;
    return cards.map((c, i) => {
        const w = c.w ?? CARD_W;
        const h = c.h ?? CARD_H;
        // `self.card_w or G.CARD_W`：补充包那一格是 1.27 倍宽
        let x = spread(area, i + 1, n, limit, w, cardW) + (limit === 1 ? 0.5 * (area.w - w) : 0);
        const y = area.y + area.h / 2 - h / 2 - (c.highlighted ? HIGHLIGHT_H : 0);
        x += cardShadowParallaxX(c.prevX, w) / 30;
        return { x, y, r: 0 };
    });
}

/**
 * `cardarea.lua:515`：小丑区（与消耗品区——`G.consumeables` 的 `type` 也是 `'joker'`）。
 * 超过两张（消耗品区超过一张）就铺满整个宽度；两张时各占一半的中点；一张居中。选中只抬半个高度
 */
export function alignJokers(area: Rect, cards: CardIn[], isConsumeables: boolean, real: number): Placed[] {
    const n = cards.length;
    return cards.map((c, i) => {
        const k = i + 1;
        const w = c.w ?? CARD_W;
        const h = c.h ?? CARD_H;
        const r = (0.1 * (-n / 2 - 0.5 + k)) / n + wobble() * 0.02 * Math.sin(2 * real + c.prevX);
        let x: number;
        if (n > 2 || (n > 1 && isConsumeables)) x = area.x + (area.w - CARD_W) * ((k - 1) / (n - 1)) + 0.5 * (CARD_W - w);
        else if (n > 1) x = area.x + (area.w - CARD_W) * ((k - 0.5) / n) + 0.5 * (CARD_W - w);
        else x = area.x + area.w / 2 - CARD_W / 2 + 0.5 * (CARD_W - w);
        const lift = c.highlighted ? HIGHLIGHT_H / 2 : 0;
        const y = area.y + area.h / 2 - h / 2 - lift + wobble() * 0.03 * Math.sin(0.666 * real + x);
        x += cardShadowParallaxX(c.prevX, w) / 30;
        return { x, y, r };
    });
}

/**
 * `cardarea.lua:536`：`type = 'consumeable'` 的区域——开包时的 `G.pack_cards`。
 * 铺满整个宽度（一张居中）、不转角；没选中的牌上下浮动（振幅 0.05、比小丑区快）
 */
export function alignConsumeable(area: Rect, cards: CardIn[], real: number, cardW = CARD_W): Placed[] {
    const n = cards.length;
    return cards.map((c, i) => {
        const k = i + 1;
        const w = c.w ?? CARD_W;
        const h = c.h ?? CARD_H;
        let x = n > 1
            ? area.x + (area.w - cardW) * ((k - 1) / (n - 1)) + 0.5 * (cardW - w)
            : area.x + area.w / 2 - cardW / 2 + 0.5 * (cardW - w);
        const y = area.y + area.h / 2 - h / 2 - (c.highlighted ? HIGHLIGHT_H : 0)
            + (c.highlighted ? 0 : wobble() * 0.05 * Math.sin(2 * 1.666 * real + x));
        x += cardShadowParallaxX(c.prevX, w) / 30;
        return { x, y, r: 0 };
    });
}

/**
 * `cardarea.lua:441`：开奥秘 / 幽灵 / 天体包时的手牌区（`G.STATE` 是 `*_PACK`）。整排抬到手牌区之上
 * `1.8·card.h`、扇形更开（±0.2 弧度）、两端按平方下沉，晃得也更大（0.1）。`limit` 是 `config.temp_limit`
 */
export function alignPackHand(area: Rect, cards: CardIn[], limit: number, real: number): Placed[] {
    const n = cards.length;
    return cards.map((c, i) => {
        const k = i + 1;
        const w = c.w ?? CARD_W;
        const h = c.h ?? CARD_H;
        const r = (0.4 * (-n / 2 - 0.5 + k)) / n + wobble() * 0.02 * Math.sin(2 * real + c.prevX);
        let x = spread(area, k, n, limit, w);
        const lift = c.highlighted ? HIGHLIGHT_H : 0;
        const y = area.y - 1.8 * h - lift + wobble() * 0.1 * Math.sin(0.666 * real + x) + Math.abs((1.3 * (-n / 2 + k - 0.5)) / n) ** 2 - 0.3;
        x += cardShadowParallaxX(c.prevX, w) / 30;
        return { x, y, r };
    });
}
