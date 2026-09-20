/**
 * 第一个可玩里程碑的场景：用红牌组打过 Ante 1 的小盲注。
 *
 * 切片边界见 07 号票——无小丑、无商店、无强化牌、无大盲/Boss 盲。
 * 逻辑全在 `src/core/`，这一层只负责画出来与收输入。
 */

import { GameObjects, Scene } from 'phaser';

import type { Card } from '../../core/card';
import { makeStandardDeck, resetCardCounters } from '../../core/card';
import { EventManager, GameEvent } from '../../core/event-queue';
import { Round } from '../../core/round';
import { evaluatePokerHand } from '../../core/poker-hands';
import { CardSprite } from '../card-sprite';
import { CANVAS_H, CANVAS_W, CARD_H, toPx } from '../coords';
import { BACKGROUND_COLOURS, BACKGROUND_FRAG, BACKGROUND_VERT } from '../shaders/background';
import { CRT_FRAG, CRT_VERT, crtUniforms } from '../shaders/crt';

/** 手牌区基线，tile 单位。牌高 ≈2.75 tile，画布高 11.2 tile */
const HAND_Y_TILES = 6.4;
/** 手牌左边距，tile */
const HAND_X_TILES = 1.2;

/**
 * `G.SETTINGS.GRAPHICS.crt`。`globals.lua:231` 是 `F_MOBILE and 30 or 70`；
 * 12 号票裁定取桌面值。
 */
const CRT_STRENGTH = 70;

/** 打出区的基线，tile。在手牌上方。 */
const PLAY_Y_TILES = 3.2;
/** 逐张计分之间的间隔，秒。原作在 state_events.lua:622 是 delay(0.2) 起步 */
const SCORE_STEP_DELAY = 0.22;

export class RoundScene extends Scene {
    private round!: Round;
    private sprites: CardSprite[] = [];
    private selected = new Set<Card>();

    /** 事件队列。动画的节奏全靠它，语义直译自 engine/event.lua（09 号票）。
     *  刻意不叫 `events`——那是 Phaser Scene 自己的字段。 */
    private readonly queue = new EventManager();
    /** 正在播放出牌动画时不接受输入 */
    private animating = false;
    /** 计分过程中的实时累加器，只用于显示 */
    private liveChips = 0;
    private liveMult = 0;

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

        // 音效。对应关系从原作查出：
        // cardSlide2 选/取消选牌（card.lua:4625）、chips2 计分（state_events.lua:1062）
        for (const key of ['cardSlide2', 'chips1', 'chips2', 'card1', 'button', 'generic1']) {
            this.load.audio(key, `/assets/sounds/${key}.ogg`);
        }
    }

    create(): void {
        const seed = new URLSearchParams(location.search).get('seed') ?? 'ALEEB';

        resetCardCounters();
        this.round = new Round(seed, makeStandardDeck());

        this.setupBackground();

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
        this.setupCrt();
    }

    /**
     * 背景的动态 shader。必须最先 add——它得画在所有东西之下。
     *
     * 它不只是好看：CRT 的亮度校正是按这张明亮背景调的，
     * 纯色底会让 CRT 把白卡推成死白（14 号票记过这条）。
     */
    private setupBackground(): void {
        const { width, height } = this.scale;
        const bg = this.add.shader(
            {
                name: 'background',
                fragmentSource: BACKGROUND_FRAG,
                vertexSource: BACKGROUND_VERT,
                setupUniforms: (setUniform: (n: string, v: unknown) => void) => {
                    const t = this.time.now / 1000;
                    setUniform('time', t);
                    setUniform('spin_time', t);
                    setUniform('colour_1', BACKGROUND_COLOURS.colour_1);
                    setUniform('colour_2', BACKGROUND_COLOURS.colour_2);
                    setUniform('colour_3', BACKGROUND_COLOURS.colour_3);
                    setUniform('contrast', BACKGROUND_COLOURS.contrast);
                    // G.ARGS.spin.amount，game.lua:2494 起手是 0
                    setUniform('spin_amount', 0);
                    setUniform('uScreenSize', [width, height]);
                },
            },
            width / 2, height / 2, width, height,
            [],
        );
        bg.setDepth(-1000);
    }

    /**
     * CRT 全屏后处理。链路由 14 号票验过：
     * `setForceComposite` → `captureFrame` 到具名纹理 → 全屏 Shader 采样它。
     * 必须在所有内容都 add 完之后调用——`captureFrame` 捕获的是它在显示列表里
     * 之前的东西。
     */
    private setupCrt(): void {
        this.cameras.main.setForceComposite(true);

        // **depth 很关键。** captureFrame 捕获的是显示列表里排在它之前的东西，
        // 而 Phaser 按 depth 排序——默认 depth 0 会与卡牌底板同级，
        // 于是正面层（depth 1）排在它之后、不被捕获，CRT 下卡牌就只剩白底。
        // 放在所有游戏内容之上、CRT 之下。
        this.add.captureFrame('scene').setDepth(500);

        const { width, height } = this.scale;
        const crt = this.add.shader(
            {
                name: 'crt',
                fragmentSource: CRT_FRAG,
                vertexSource: CRT_VERT,
                setupUniforms: (setUniform: (n: string, v: unknown) => void) => {
                    const u = crtUniforms(CRT_STRENGTH, width, height, this.time.now / 1000);
                    setUniform('uMainSampler', 0);
                    setUniform('distortion_fac', u.distortion_fac);
                    setUniform('scale_fac', u.scale_fac);
                    setUniform('feather_fac', u.feather_fac);
                    setUniform('crt_intensity', u.crt_intensity);
                    setUniform('scanlines', u.scanlines);
                    setUniform('time', u.time);
                    setUniform('uScreenSize', u.uScreenSize);
                },
            },
            width / 2, height / 2, width, height,
            ['scene'],
        );
        crt.setDepth(1000);
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
        if (this.animating || this.round.phase !== 'selecting') return;

        if (this.selected.has(card)) this.selected.delete(card);
        else if (this.selected.size < 5) this.selected.add(card);
        else return; // 满 5 张，什么也不做，也不出声

        this.sound.play('cardSlide2', { volume: 0.3 });

        this.layout();
        this.refresh();
    }

    private selectedInOrder(): Card[] {
        // 逻辑层按 T.x 排序，这里给它一个按 T.x 排好的数组也无妨
        return [...this.selected].sort((a, b) => a.T.x - b.T.x);
    }

    /**
     * 出牌。
     *
     * **逻辑先同步算完**（`round.play` 里没有任何动画），
     * 再按它吐出的 `steps` 轨迹重放动画。
     * 所以改动画不可能改分数——这是 09 号票那条
     * 「第一个切片零处队列驱动的 RNG 消费」能成立的前提。
     */
    private doPlay(): void {
        if (this.animating || this.round.phase !== 'selecting' || this.selected.size === 0) return;

        const played = this.selectedInOrder();
        const out = this.round.play(played);

        this.animating = true;
        this.selected.clear();
        this.liveChips = out.baseChips;
        this.liveMult = out.baseMult;

        // 1) 打出的牌飞到打出区
        const sprites = this.sprites.filter((s) => played.includes(s.card));
        this.queue.add(new GameEvent({
            trigger: 'after',
            delay: 0.25,
            func: () => {
                for (const sp of sprites) {
                    sp.highlighted = false;
                    sp.layout(HAND_X_TILES, PLAY_Y_TILES);
                }
                this.sound.play('cardSlide2', { volume: 0.4 });
                this.refresh(`${out.handName}   ${out.baseChips} × ${out.baseMult}`);
                return true;
            },
        }));

        // 2) 逐张计分。原作 state_events.lua:628 的 percent 从 0.3 每张 +0.08，
        //    用来递增音高——这里照搬。
        out.steps.forEach((step, i) => {
            this.queue.add(new GameEvent({
                trigger: 'after',
                delay: SCORE_STEP_DELAY,
                func: () => {
                    // `held` 那一步只改倍率、不动筹码，所以 handChips 在它上面没有字段——
                    // 保持当前值。`joker` 那一步没有扑克牌可以 pop。
                    if (step.kind !== 'held') this.liveChips = step.handChips;
                    this.liveMult = step.mult;
                    const target = step.kind === 'joker' ? null : step.card;
                    const sp = target ? this.sprites.find((x) => x.card === target) : undefined;
                    sp?.pop();
                    this.sound.play('chips1', {
                        volume: 0.45,
                        rate: 0.9 + (0.3 + i * 0.08) * 0.5,
                    });
                    this.refresh(`${out.handName}   ${this.liveChips} × ${this.liveMult}`);
                    return true;
                },
            }));
        });

        // 3) 最终乘法与入账
        this.queue.add(new GameEvent({
            trigger: 'after',
            delay: 0.35,
            func: () => {
                this.sound.play('chips2', { volume: 0.6 });
                this.refresh(`${out.handName}   +${out.score}`);
                return true;
            },
        }));

        // 4) 收拾残局：重建手牌、放开输入
        this.queue.add(new GameEvent({
            trigger: 'after',
            delay: 0.45,
            func: () => {
                this.rebuildHand();
                this.animating = false;
                this.refresh(`${out.handName}   +${out.score}`);
                return true;
            },
        }));
    }

    update(_time: number, delta: number): void {
        this.queue.update(delta / 1000);
    }

    private doDiscard(): void {
        if (this.animating || this.round.phase !== 'selecting' || this.selected.size === 0) return;
        if (this.round.discardsLeft < 1) return;

        this.round.discard(this.selectedInOrder());
        this.sound.play('card1', { volume: 0.4 });
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
        this.playBtn.setAlpha(done || this.animating ? 0.3 : 1);
        this.discardBtn.setAlpha(done || this.animating || r.discardsLeft < 1 ? 0.3 : 1);

        if (r.phase === 'won') this.message.setText('过关').setColor('#7ddf64');
        else if (r.phase === 'lost') this.message.setText('失败').setColor('#e5585f');
        else this.message.setText('');
    }
}

export const ROUND_SCENE_SIZE = { width: CANVAS_W, height: CANVAS_H, cardH: toPx(CARD_H) };
