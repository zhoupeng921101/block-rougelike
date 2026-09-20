/**
 * Phaser 4 渲染路线 spike。
 *
 * 验四件事，见 .scratch/balatro-复刻/issues/13-Phaser4渲染路线spike.md：
 *  1. per-instance uniform 真的独立（40 个 Shader GameObject，各传不同的值，readPixels 断言）
 *  2. 移植一个真 shader（dissolve.fs）
 *  3. CRT 全屏链路（setForceComposite + captureFrame + 全屏 Shader）
 *  4. 性能：帧时间。上一张票判断真正的风险是全屏背景的 fill-rate，不是 draw call
 *
 * 结果全部打到 console 上，`SPIKE_RESULT ` 前缀那行是给 Playwright 解析的。
 */

import { AUTO, Game, GameObjects, Scale, Scene, type Types } from 'phaser';

import { DECK_ATLAS } from '../src/core/atlas';
import { CRT_FRAG, CRT_VERT, crtUniforms } from '../src/game/shaders/crt';
import { DISSOLVE_FRAG, DISSOLVE_VERT } from '../src/game/shaders/dissolve';

const CARD_W = DECK_ATLAS.frameWidth * 2;
const CARD_H = DECK_ATLAS.frameHeight * 2;
/** 8BitDeck.png 实测 923x380 = 13 列 x 71 、4 行 x 95 */
const ATLAS_W = 923;
const ATLAS_H = 380;
const ATLAS_COLS = Math.floor(ATLAS_W / DECK_ATLAS.frameWidth);
const ATLAS_ROWS = Math.floor(ATLAS_H / DECK_ATLAS.frameHeight);

const params = new URLSearchParams(location.search);
const CARD_COUNT = Number(params.get('cards') ?? 40);
/** 是否额外铺一层全屏 shader——上一张票判断真正的风险在这的 fill-rate */
const FULLSCREEN_BG = params.get('bg') === '1';
/** CRT 全屏后处理：setForceComposite + captureFrame + 全屏 Shader */
const CRT = params.get('crt') === '1';
/** G.SETTINGS.GRAPHICS.crt —— 移动 30 / 桌面 70，12 号票裁定取桌面值 */
const CRT_STRENGTH = Number(params.get('crtStrength') ?? 70);
const WARMUP_FRAMES = 60;
const MEASURE_FRAMES = 240;

type Probe = { x: number; y: number; expected: [number, number, number] };

class SpikeScene extends Scene {
    private cards: GameObjects.Shader[] = [];
    private probes: Probe[] = [];
    private frameTimes: number[] = [];
    private lastTs = 0;
    private warmup = 0;
    private done = false;

    constructor() {
        super('Spike');
    }

    preload(): void {
        // 素材口径已裁定（06 号票）：拷进 public/assets/ 并入库
        this.load.spritesheet('card', '/assets/textures/8BitDeck.png', {
            frameWidth: DECK_ATLAS.frameWidth,
            frameHeight: DECK_ATLAS.frameHeight,
        });
    }

    create(): void {
        if (FULLSCREEN_BG) {
            // 一层全屏的 dissolve，纯粹用来吃 fill-rate
            this.add.shader(
                {
                    name: 'bg',
                    fragmentSource: DISSOLVE_FRAG,
                    vertexSource: DISSOLVE_VERT,
                    setupUniforms: (setUniform) => {
                        setUniform('uMainSampler', 0);
                        setUniform('dissolve', 0.5);
                        setUniform('time', 1.0);
                        setUniform('texture_details', [0, 0, CARD_W, CARD_H]);
                        setUniform('image_details', [CARD_W, CARD_H]);
                        setUniform('shadow', false);
                        setUniform('burn_colour_1', [0, 0, 0, 0]);
                        setUniform('burn_colour_2', [0, 0, 0, 0]);
                        setUniform('uProbe', [0, 0, 0]);
                        setUniform('uProbePatch', 0);
                        setUniform('mouse_screen_pos', [0, 0]);
                        setUniform('hovering', 0);
                        setUniform('screen_scale', 1);
                        setUniform('uScreenSize', [this.scale.width, this.scale.height]);
                    },
                },
                this.scale.width / 2,
                this.scale.height / 2,
                this.scale.width,
                this.scale.height,
                ['card'],
            );
        }

        const cols = 8;
        const marginX = (this.scale.width - cols * (CARD_W + 8)) / 2;
        const marginY = 20;

        for (let i = 0; i < CARD_COUNT; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = marginX + col * (CARD_W + 8) + CARD_W / 2;
            // 超过一屏就叠着放——压力测试要的是 draw call 与 fill-rate，不是布局
            const y = marginY + ((row * (CARD_H + 8)) % (this.scale.height - CARD_H)) + CARD_H / 2;

            // 每张牌一个可辨识的 probe 颜色。40 张要两两不同，用 i 编码进 RGB。
            const probe: [number, number, number] = [
                ((i * 6 + 13) % 256) / 255,
                ((i * 11 + 47) % 256) / 255,
                ((i * 17 + 101) % 256) / 255,
            ];

            // 原作 sprite.lua:101：time = 123.33412*(card.ID/1.14212)%3000
            // 逐卡不同，正是 per-instance uniform 的真实需求
            const cardTime = (123.33412 * ((i + 1) / 1.14212)) % 3000;
            // 从图集里取第 i 张牌
            const gridX = i % ATLAS_COLS;
            const gridY = Math.floor(i / ATLAS_COLS) % ATLAS_ROWS;
            const dissolve = 0; // 静态展示，不做溶解动画

            const shader = this.add.shader(
                {
                    name: `dissolve_${i}`,
                    fragmentSource: DISSOLVE_FRAG,
                    vertexSource: DISSOLVE_VERT,
                    setupUniforms: (setUniform) => {
                        setUniform('uMainSampler', 0);
                        setUniform('dissolve', dissolve);
                        setUniform('time', cardTime);
                        // Balatro 的图集约定（sprite.lua:103-104）：
                        //   texture_details = (格子列, 格子行, 格宽px, 格高px)
                        //   image_details   = (图集总宽px, 图集总高px)
                        setUniform('texture_details', [
                            gridX,
                            gridY,
                            DECK_ATLAS.frameWidth,
                            DECK_ATLAS.frameHeight,
                        ]);
                        setUniform('image_details', [ATLAS_W, ATLAS_H]);
                        setUniform('shadow', false);
                        setUniform('burn_colour_1', [0, 0, 0, 0]);
                        setUniform('burn_colour_2', [0, 0, 0, 0]);
                        setUniform('uProbe', probe);
                        setUniform('uProbePatch', 1);
                        setUniform('mouse_screen_pos', [0, 0]);
                        setUniform('hovering', 0);
                        setUniform('screen_scale', 1);
                        setUniform('uScreenSize', [this.scale.width, this.scale.height]);
                    },
                },
                x,
                y,
                CARD_W,
                CARD_H,
                ['card'],
            );

            // **关键一步**：Shader GameObject 不会自动应用 spritesheet 的帧，
            // 必须显式把纹理坐标设成该帧的子矩形，outTexCoord 才会落在帧内。
            shader.setTextureCoordinatesFromFrame(String(gridY * ATLAS_COLS + gridX), 'card');

            this.cards.push(shader);

            // probe patch 画在 texture_coords.y < 0.25 处。**实测**它出现在卡牌
            // 屏幕坐标的**底部**——即 Phaser 4 的 outTexCoord.y 方向与 LÖVE 相反。
            // 这条对 dissolve_mask 的 borders 逻辑有影响（上下边界会镜像），
            // 正式移植时要么翻转 uv，要么翻转 borders。
            this.probes.push({
                x: Math.round(x - CARD_W / 2 + CARD_W * 0.1),
                y: Math.round(y + CARD_H / 2 - CARD_H * 0.1),
                expected: probe,
            });
        }

        if (CRT) this.setupCrt();

        this.lastTs = performance.now();
    }

    /**
     * CRT 全屏链路。出自 Phaser 4 自带的 skills/filters-and-postfx/SKILL.md：
     * 相机开 composite → captureFrame 捕获到具名纹理 → 全屏 Shader 采样它。
     */
    private setupCrt(): void {
        this.cameras.main.setForceComposite(true);
        this.add.captureFrame('scene');

        const { width, height } = this.scale;
        const u = crtUniforms(CRT_STRENGTH, width, height, 0);

        const crt = this.add.shader(
            {
                name: 'crt',
                fragmentSource: CRT_FRAG,
                vertexSource: CRT_VERT,
                setupUniforms: (setUniform) => {
                    const t = crtUniforms(CRT_STRENGTH, width, height, this.time.now / 1000);
                    setUniform('uMainSampler', 0);
                    setUniform('distortion_fac', t.distortion_fac);
                    setUniform('scale_fac', t.scale_fac);
                    setUniform('feather_fac', t.feather_fac);
                    setUniform('crt_intensity', t.crt_intensity);
                    setUniform('scanlines', t.scanlines);
                    setUniform('time', t.time);
                    setUniform('uScreenSize', t.uScreenSize);
                },
            },
            width / 2,
            height / 2,
            width,
            height,
            ['scene'],
        );
        crt.setDepth(1000);
        void u;
    }

    update(): void {
        if (this.done) return;

        const now = performance.now();
        const dt = now - this.lastTs;
        this.lastTs = now;

        if (this.warmup < WARMUP_FRAMES) {
            this.warmup++;
            return;
        }

        this.frameTimes.push(dt);

        if (this.frameTimes.length >= MEASURE_FRAMES) {
            this.done = true;
            this.game.events.once('postrender', () => this.report());
        }
    }

    private report(): void {
        const gl = (this.game.renderer as unknown as { gl: WebGLRenderingContext }).gl;
        const canvas = gl.canvas as HTMLCanvasElement;
        const dpr = canvas.width / this.scale.width;

        // —— per-instance uniform 隔离断言 ——
        const readings: Array<{ i: number; got: number[]; want: number[]; ok: boolean }> = [];
        const pixel = new Uint8Array(4);

        this.probes.slice(0, 40).forEach((p, i) => {
            const px = Math.round(p.x * dpr);
            // WebGL 的 readPixels 原点在左下
            const py = Math.round(canvas.height - p.y * dpr);
            gl.readPixels(px, py, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

            const got = [pixel[0], pixel[1], pixel[2]];
            const want = p.expected.map((v) => Math.round(v * 255));
            const ok = got.every((v, k) => Math.abs(v - want[k]) <= 2);
            readings.push({ i, got, want, ok });
        });

        const distinct = new Set(readings.map((r) => r.got.join(','))).size;
        const matched = readings.filter((r) => r.ok).length;

        // —— 帧时间 ——
        const sorted = [...this.frameTimes].sort((a, b) => a - b);
        const pct = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];

        const result = {
            renderer: this.game.renderer.constructor.name,
            webglVersion: gl.getParameter(gl.VERSION),
            glRenderer: (() => {
                const ext = gl.getExtension('WEBGL_debug_renderer_info');
                return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unavailable';
            })(),
            cards: CARD_COUNT,
            fullscreenBg: FULLSCREEN_BG,
            crt: CRT ? CRT_STRENGTH : false,
            uniformIsolation: {
                distinctColoursRead: distinct,
                expectedDistinct: CARD_COUNT,
                matchedExpected: matched,
                pass: distinct === CARD_COUNT && matched === CARD_COUNT,
                firstMismatch: readings.find((r) => !r.ok) ?? null,
            },
            frameMs: {
                samples: sorted.length,
                p50: +pct(0.5).toFixed(3),
                p95: +pct(0.95).toFixed(3),
                max: +sorted[sorted.length - 1].toFixed(3),
            },
        };

        console.log('SPIKE_RESULT ' + JSON.stringify(result));
    }
}

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1280,
    height: 900,
    parent: 'spike-container',
    backgroundColor: '#14161c',
    scale: { mode: Scale.NONE },
    render: {
        // readPixels 要在 swap 之后还能读到内容
        preserveDrawingBuffer: true,
    },
    scene: [SpikeScene],
};

new Game(config);
