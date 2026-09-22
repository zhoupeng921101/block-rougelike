/**
 * 牌堆（`G.deck`）的牌背堆叠（22 号票）。
 *
 * `cardarea.lua:418` 的 deck 分支：第 k 张（共 n 张）摆在区域中心，再按区域的阴影视差逐张错开
 * `shadow_parrallax × (0.15/52) × (n − k)`，最后叠一个 `card.shadow_parrallax.x/30`。
 * `CardArea:draw`（`cardarea.lua:328`）从最后一张往前画，**只画第 1 张、每第 9 张和最后一张**（`thin_draw`），
 * 牌堆里的卡不画阴影（`card.lua:4368` 排除了 `deck` 类型的区域）。
 *
 * **牌堆里的牌背不走 shader**（`card.lua:4557`）：直接 `Sprite:draw(overlay)`，第 4 张起乘一个灰
 * `0.5 + ((n − rank) % 7)/50`——堆叠边缘那几道灰线就是它。所以这里用能乘色的 `Image`，不用 `Shader`。
 */
import type { GameObjects, Scene } from 'phaser';

import { CARD_H, CARD_W, toPx } from './coords';
import { cardShadowParallaxX } from './align-cards';
import type { Rect } from '../ui/uibox';

/** 红牌组的牌背在 `centers` 图集的 `{x=0,y=0}`，也就是第 0 帧（`game.lua:629`） */
const BACK_FRAME = 0;
const DECK_HEIGHT = 0.15 / 52;
const THIN_DRAW = 9;
/** `card.lua:58` */
const CARD_SCALE = 0.95;

export class DeckSprite {
    private readonly quads: GameObjects.Image[] = [];

    /**
     * `deckHeight`（`config.deck_height`，缺省 0.15）、`thinDraw`（缺省 9）；不是 `G.deck` 的牌堆错开量按 `n/2 − k` 算
     * （`cardarea.lua:423` 的 `#self.cards/(self == G.deck and 1 or 2)`）——开局设置的牌组预览就是这种
     */
    constructor(
        private readonly scene: Scene,
        private readonly opts: { deckHeight?: number; thinDraw?: number; mainDeck?: boolean; depth?: number; scale?: number; frame?: number } = {},
    ) {}

    private get height(): number {
        return (this.opts.deckHeight ?? 0.15) / 52;
    }

    destroy(): void {
        for (const q of this.quads) q.destroy();
        this.quads.length = 0;
    }

    /** 换牌背（图鉴翻牌组）：已建的都换帧 */
    setFrame(frame: number): void {
        this.opts.frame = frame;
        for (const q of this.quads) q.setFrame(frame);
    }

    /** 最上面那张（`G.deck.cards[1]`）的碰撞矩形；牌堆空了没有 */
    static topRect(area: Rect, n: number): Rect | null {
        if (n <= 0) return null;
        let x = area.x + 0.5 * (area.w - CARD_W) + cardShadowParallaxX(area.x, area.w) * DECK_HEIGHT * (n - 1);
        x += cardShadowParallaxX(x, CARD_W) / 30;
        return { x, y: area.y + 0.5 * (area.h - CARD_H) - 1.5 * DECK_HEIGHT * (n - 1), w: CARD_W, h: CARD_H };
    }

    /** 每帧：`n` 是牌堆里还剩几张，`area` 是 `G.deck` 的区域 */
    update(area: Rect, n: number): void {
        // 要画的下标（1 起），按原作从最后一张往前画的顺序
        const drawn: number[] = [];
        const thin = this.opts.thinDraw ?? THIN_DRAW;
        const H = this.height;
        const base = this.opts.mainDeck === false ? n / 2 : n;
        const depth = this.opts.depth ?? 5;
        const cw = CARD_W * (this.opts.scale ?? 1);
        const ch = CARD_H * (this.opts.scale ?? 1);
        for (let i = n; i >= 1; i--) if (i === 1 || i % thin === 0 || i === n) drawn.push(i);
        while (this.quads.length < drawn.length) {
            const q = this.scene.add.image(0, 0, 'centers', this.opts.frame ?? BACK_FRAME);
            q.setDisplaySize(toPx(cw) * CARD_SCALE, toPx(ch) * CARD_SCALE);
            this.quads.push(q);
        }
        const spAreaX = cardShadowParallaxX(area.x, area.w);
        this.quads.forEach((q, j) => {
            const k = drawn[j];
            q.setVisible(k !== undefined);
            if (k === undefined) return;
            let x = area.x + 0.5 * (area.w - cw) + spAreaX * H * (base - k);
            const y = area.y + 0.5 * (area.h - ch) - 1.5 * H * (base - k);
            x += cardShadowParallaxX(x, cw) / 30;
            // 先画的在下面：深度随绘制顺序递增。rank 就是下标 k，前三张不乘色
            const grey = k > 3 ? 0.5 + ((n - k) % 7) / 50 : 1;
            const c = Math.round(grey * 255);
            q.setPosition(toPx(x + cw / 2), toPx(y + ch / 2)).setDepth(depth + j * 0.01).setTint((c << 16) | (c << 8) | c);
        });
    }
}
