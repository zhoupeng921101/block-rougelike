/**
 * 第一个可玩里程碑的场景：用红牌组打过 Ante 1 的小盲注。
 *
 * 切片边界见 07 号票——无小丑、无商店、无强化牌、无大盲/Boss 盲。
 * 逻辑全在 `src/core/`，这一层只负责画出来与收输入。
 */

import { GameObjects, Scene } from 'phaser';

import type { Card } from '../../core/card';
import { makeStandardDeck, resetCardCounters } from '../../core/card';
import { Round } from '../../core/round';
import { evaluatePokerHand } from '../../core/poker-hands';
import { CardSprite } from '../card-sprite';
import { CANVAS_H, CANVAS_W, CARD_H, toPx } from '../coords';

/** 手牌区基线，tile 单位。牌高 ≈2.75 tile，画布高 11.2 tile */
const HAND_Y_TILES = 6.4;
/** 手牌左边距，tile */
const HAND_X_TILES = 1.2;

export class RoundScene extends Scene {
    private round!: Round;
    private sprites: CardSprite[] = [];
    private selected = new Set<Card>();

    private hud!: GameObjects.Text;
    private handPreview!: GameObjects.Text;
    private message!: GameObjects.Text;
    private playBtn!: GameObjects.Text;
    private discardBtn!: GameObjects.Text;

    constructor() {
        super('Round');
    }

    preload(): void {
        this.load.spritesheet('cards', '/assets/textures/8BitDeck.png', {
            frameWidth: 71,
            frameHeight: 95,
        });
        // 底板层。原作每张牌是底板 + 正面两层，8BitDeck 里的牌面是透明背景的
        this.load.spritesheet('centers', '/assets/textures/Enhancers.png', {
            frameWidth: 71,
            frameHeight: 95,
        });
    }

    create(): void {
        const seed = new URLSearchParams(location.search).get('seed') ?? 'ALEEB';

        resetCardCounters();
        this.round = new Round(seed, makeStandardDeck());

        this.hud = this.add.text(toPx(1.2), toPx(0.6), '', {
            fontFamily: 'monospace', fontSize: 22, color: '#e8e8e8', lineSpacing: 6,
        });
        this.handPreview = this.add.text(toPx(1.2), toPx(4.9), '', {
            fontFamily: 'monospace', fontSize: 26, color: '#ffd76e',
        });
        this.message = this.add.text(CANVAS_W / 2, CANVAS_H / 2, '', {
            fontFamily: 'monospace', fontSize: 48, color: '#ffffff',
        }).setOrigin(0.5).setDepth(100);

        this.playBtn = this.makeButton(toPx(1.2), toPx(9.9), '出牌', '#3fa34d', () => this.doPlay());
        this.discardBtn = this.makeButton(toPx(4.4), toPx(9.9), '弃牌', '#b5462f', () => this.doDiscard());

        this.rebuildHand();
        this.refresh();
    }

    private makeButton(
        x: number, y: number, label: string, colour: string, onClick: () => void,
    ): GameObjects.Text {
        const t = this.add.text(x, y, ` ${label} `, {
            fontFamily: 'monospace', fontSize: 30, color: '#ffffff',
            backgroundColor: colour, padding: { x: 18, y: 10 },
        });
        t.setInteractive({ useHandCursor: true });
        t.on('pointerdown', onClick);
        return t;
    }

    /** 手牌变了就整体重建。8 张牌，重建比增量同步便宜也不容易错。 */
    private rebuildHand(): void {
        for (const s of this.sprites) s.destroy();
        this.sprites = [];

        // 逻辑层已经给过 T.x（等距单调，tile 单位）。
        // **不改它**——边距是表现层的事，在 layout 时叠加。
        for (const card of this.round.hand) {
            this.sprites.push(new CardSprite(this, card, (c) => this.toggle(c)));
        }
        this.layout();
    }

    private layout(): void {
        for (const s of this.sprites) {
            s.highlighted = this.selected.has(s.card);
            s.layout(HAND_X_TILES, HAND_Y_TILES);
        }
    }

    private toggle(card: Card): void {
        if (this.round.phase !== 'selecting') return;

        if (this.selected.has(card)) this.selected.delete(card);
        else if (this.selected.size < 5) this.selected.add(card);

        this.layout();
        this.refresh();
    }

    private selectedInOrder(): Card[] {
        // 逻辑层按 T.x 排序，这里给它一个按 T.x 排好的数组也无妨
        return [...this.selected].sort((a, b) => a.T.x - b.T.x);
    }

    private doPlay(): void {
        if (this.round.phase !== 'selecting' || this.selected.size === 0) return;

        const out = this.round.play(this.selectedInOrder());
        this.selected.clear();
        this.rebuildHand();
        this.refresh(`${out.handName}  +${out.score}`);
    }

    private doDiscard(): void {
        if (this.round.phase !== 'selecting' || this.selected.size === 0) return;
        if (this.round.discardsLeft < 1) return;

        this.round.discard(this.selectedInOrder());
        this.selected.clear();
        this.rebuildHand();
        this.refresh('弃牌');
    }

    private refresh(lastAction = ''): void {
        const r = this.round;

        this.hud.setText([
            `小盲注   ${r.chips} / ${r.requirement}`,
            `出牌 ${r.handsLeft}    弃牌 ${r.discardsLeft}    牌堆 ${r.deck.length}`,
            lastAction,
        ].join('\n'));

        // 选中的牌会构成什么牌型——原作的手牌提示
        if (this.selected.size > 0) {
            const preview = evaluatePokerHand(this.selectedInOrder());
            const info = preview.topName ? r.hands[preview.topName] : null;
            this.handPreview.setText(
                preview.topName && info
                    ? `${preview.topName}   ${info.chips} × ${info.mult}`
                    : '',
            );
        } else {
            this.handPreview.setText('');
        }

        const done = r.phase !== 'selecting';
        this.playBtn.setAlpha(done ? 0.3 : 1);
        this.discardBtn.setAlpha(done || r.discardsLeft < 1 ? 0.3 : 1);

        if (r.phase === 'won') this.message.setText('过关').setColor('#7ddf64');
        else if (r.phase === 'lost') this.message.setText('失败').setColor('#e5585f');
        else this.message.setText('');
    }
}

export const ROUND_SCENE_SIZE = { width: CANVAS_W, height: CANVAS_H, cardH: toPx(CARD_H) };
