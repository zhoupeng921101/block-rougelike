/**
 * 只用来「看」的扑克牌（22 号票第二十三步）：Run Info 牌型提示里那排示例牌（`create_UIBox_hand_tip` 的
 * `Card(0,0, 0.5·CARD_W, 0.5·CARD_H, G.P_CARDS[key], G.P_CENTERS.c_base)`）。
 *
 * 与 `CardSprite` 同一套画法（`c_base` 底板 + 牌面 + 阴影，都走 `dissolve`），但尺寸可变、不接逻辑层的 `Card`、
 * 没有点击，深度由调用方给（要压在 overlay 之上）。缓动照 `Moveable`：`T` 是目标、画的是 `VT`。
 */
import type { GameObjects, Scene } from 'phaser';

import { CENTERS_ATLAS, DECK_ATLAS } from '../core/atlas';
import { cardShadowParallaxX } from './align-cards';
import { toPx } from './coords';
import { Motion } from './moveable';
import { cardTimeOf, makeShaderQuad } from './shader-quad';

/** `P_CARDS` 的 key（`S_A`、`D_T`…）→ 图集格：花色定行、点数定列（2 → 0 … A → 12） */
const SUIT_ROW: Record<string, number> = { H: 0, C: 1, D: 2, S: 3 };
const RANK_COL: Record<string, number> = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7, T: 8, J: 9, Q: 10, K: 11, A: 12 };
const BASE_POS = { x: 1, y: 0 };
const SHADOW_HEIGHT = 0.1;

let serial = 0;

export class MiniCard {
    private readonly base: GameObjects.Shader;
    private readonly front: GameObjects.Shader;
    private readonly shadow: GameObjects.Shader;
    private readonly onPostUpdate = (time: number, delta: number) => this.render(time / 1000, delta / 1000);
    private motion: Motion | null = null;

    constructor(
        private readonly scene: Scene,
        key: string,
        /** 卡面尺寸（tile） */
        private readonly w: number,
        private readonly h: number,
        depth: number,
    ) {
        const [suit, rank] = key.split('_') as [string, string];
        const id = serial++;
        const cardTime = cardTimeOf(1000 + id);
        const common = { cardTime, w: toPx(w), h: toPx(h), tilt: () => 0 };
        this.base = makeShaderQuad(scene, { ...common, name: `mini_base_${id}`, textureKey: 'centers', atlas: CENTERS_ATLAS, pos: BASE_POS }).setDepth(depth);
        this.front = makeShaderQuad(scene, { ...common, name: `mini_front_${id}`, textureKey: 'cards', atlas: DECK_ATLAS, pos: { x: RANK_COL[rank]!, y: SUIT_ROW[suit]! } }).setDepth(depth + 0.001);
        this.shadow = makeShaderQuad(scene, { ...common, name: `mini_shadow_${id}`, textureKey: 'centers', atlas: CENTERS_ATLAS, pos: BASE_POS, shadow: true }).setDepth(depth - 0.5);
        scene.events.on('postupdate', this.onPostUpdate);
    }

    /** 目标：左上角（tile）、转角、缩放（`T.scale`） */
    place(x: number, y: number, r: number, scale: number): void {
        if (!this.motion) this.motion = new Motion({ x, y, r, scale });
        Object.assign(this.motion.T, { x, y, r, scale });
    }

    /** `Card:juice_up`（参数是卡牌版的，内部 ×0.4） */
    juiceUp(amount?: number, rot?: number): void {
        this.motion?.cardJuiceUp(this.scene.time.now / 1000, amount, rot);
    }

    private render(now: number, dt: number): void {
        const m = this.motion;
        if (!m) return;
        m.step(dt, now);
        const { VT } = m;
        const cx = toPx(VT.x + this.w / 2);
        const cy = toPx(VT.y + this.h / 2);
        for (const q of [this.base, this.front]) q.setPosition(cx, cy).setRotation(VT.r).setScale(VT.scale);
        const spx = cardShadowParallaxX(m.T.x, this.w);
        this.shadow.setScale(VT.scale * (1 - 0.2 * SHADOW_HEIGHT))
            .setPosition(cx - toPx(spx * SHADOW_HEIGHT), cy + toPx(1.5 * SHADOW_HEIGHT))
            .setRotation(VT.r);
    }

    destroy(): void {
        this.scene.events.off('postupdate', this.onPostUpdate);
        this.base.destroy();
        this.front.destroy();
        this.shadow.destroy();
    }
}
