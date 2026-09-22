/**
 * 卡的三种退场（22 号票第三十九步）：`Card:shatter`、`Card:start_dissolve`（`card.lua:2082` / `:2133`）
 * 与被吃掉的小丑那段「歪一下、捏扁」（`card.lua:2768` 那一族）。
 *
 * 原作这几段全是 `blockable = false` 的事件，从调用那一刻并行计时：
 * - `shatter`：`dissolve_time = 0.7`；白色半透明（`{1,1,1,0.8}`）烧边；弹一下；一团大碎屑
 *   （每 `0.007·t` 秒一颗、边长 0.3、速度 4、寿命 `0.5·t`）`0.5·t` 后淡出；`glass1..6` + `generic1`；
 *   `dissolve` 在 `0.5·t` 里线性 0 → 1；`0.55·t` 后移除
 * - `start_dissolve(colours, silent, fac, no_juice)`：`t = 0.7·fac`；烧边缺省 BLACK / ORANGE（前两色）；
 *   细碎屑（`0.01·t` 一颗、边长 0.1、速度 2、寿命 `0.7·t`，颜色取整张表）`0.7·t` 后淡出；
 *   不 silent 就 `whoosh2` + `crumple1..5`；`dissolve` 在 `1·t` 里线性到 1；`1.05·t` 后移除
 * - 吃掉：`tarot1`、`T.r = −0.2`、`juice_up(0.3, 0.4)`、`pinch.x`（`VT.w` 以每秒 8 倍宽收到 0），0.3 秒后移除
 *
 * 碎屑是卡的 child（`Particles` 带 `attach` 时插进 `major.children`），卡 `remove` 时一起没——所以这里一起拆。
 * 音高都是 `math.random()·0.2 + 0.9`，走全局随机，不碰 RNG 流。
 */
import type { Scene } from 'phaser';

import { C, type Colour } from '../ui/colours';
import { Particles } from './particles';
import type { DissolveState } from './shader-quad';

export interface ExitTarget {
    readonly dissolve: DissolveState;
    /** 可见矩形（tile），碎屑以它为范围 */
    readonly rect: { x: number; y: number; w: number; h: number };
    readonly topDepth: number;
    juiceUp(amount?: number, rot?: number): void;
    pinch(): void;
    setTargetR(r: number): void;
    disableInput(): void;
    destroy(): void;
}

export type ExitStyle =
    | { kind: 'shatter' }
    | { kind: 'dissolve'; colours?: Colour[]; silent?: boolean; timeFac?: number; noJuice?: boolean }
    | { kind: 'eaten' };

/** `start_dissolve` 的缺省烧边色 */
export const DEFAULT_DISSOLVE_COLOURS: Colour[] = [C.BLACK, C.ORANGE, C.RED, C.GOLD, C.JOKER_GREY];

/** 玻璃牌碎、别的溶（`state_events.lua:1010` 等处都是这一句） */
export function destroyStyle(enhancement: string | null | undefined, silent = false): ExitStyle {
    return enhancement === 'm_glass' ? { kind: 'shatter' } : { kind: 'dissolve', silent };
}

const rnd = () => Math.random() * 0.2 + 0.9;

/**
 * 让 `target` 按 `style` 退场，到点 `destroy()`，然后调 `onGone`（调用方从自己的区里摘掉它）。
 * 退场中的卡不再响应输入。
 */
export function playExit(scene: Scene, target: ExitTarget, style: ExitStyle, onGone?: () => void): void {
    const start = scene.time.now / 1000;
    target.disableInput();
    // 退场这段时间里 rect 可能因为卡已从区里摘掉而不再更新，碎屑照样读它
    const attach = () => target.rect;
    let parts: Particles | null = null;
    let easeDur = 0;
    let removeAt: number;
    let fadeAt = Infinity;
    let fadeDur = 0;

    if (style.kind === 'eaten') {
        scene.sound.play('tarot1', { volume: 0.4 });
        target.setTargetR(-0.2);
        target.juiceUp(0.3, 0.4);
        target.pinch();
        removeAt = 0.3;
    } else if (style.kind === 'shatter') {
        const t = 0.7;
        target.dissolve.amount = 0;
        target.dissolve.colours = [[1, 1, 1, 0.8]];
        target.juiceUp();
        parts = new Particles(scene, {
            timer: 0.007 * t, scale: 0.3, speed: 4, lifespan: 0.5 * t,
            attach, colours: [[1, 1, 1, 0.8]], fill: true, depth: target.topDepth,
        });
        fadeAt = 0.5 * t;
        fadeDur = 0.15 * t;
        scene.sound.play(`glass${1 + Math.floor(Math.random() * 6)}`, { rate: rnd(), volume: 0.5 });
        scene.sound.play('generic1', { rate: rnd(), volume: 0.5 });
        easeDur = 0.5 * t;
        removeAt = 0.55 * t;
    } else {
        const t = 0.7 * (style.timeFac ?? 1);
        const colours = style.colours ?? DEFAULT_DISSOLVE_COLOURS;
        target.dissolve.amount = 0;
        target.dissolve.colours = colours;
        if (!style.noJuice) target.juiceUp();
        parts = new Particles(scene, {
            timer: 0.01 * t, scale: 0.1, speed: 2, lifespan: 0.7 * t,
            attach, colours, fill: true, depth: target.topDepth,
        });
        fadeAt = 0.7 * t;
        fadeDur = 0.3 * t;
        if (!style.silent) {
            scene.sound.play('whoosh2', { rate: rnd(), volume: 0.5 });
            scene.sound.play(`crumple${1 + Math.floor(Math.random() * 5)}`, { rate: rnd(), volume: 0.5 });
        }
        easeDur = 1 * t;
        removeAt = 1.05 * t;
    }

    let faded = false;
    const tick = (time: number) => {
        const age = time / 1000 - start;
        if (easeDur > 0) target.dissolve.amount = Math.min(1, age / easeDur);
        if (parts && !faded && age >= fadeAt) {
            parts.fade(fadeDur);
            faded = true;
        }
        if (age >= removeAt) {
            scene.events.off('update', tick);
            parts?.destroy();
            target.destroy();
            onGone?.();
        }
    };
    scene.events.on('update', tick);
}

/**
 * `Card:start_materialize(colours, silent, timefac)`（`card.lua:2185`）：反过来的溶解——`dissolve` 从 1 线性缓到 0（`0.6·timefac` 秒），
 * 弹一下，一阵同色碎屑（每 `0.025·t` 秒一颗、边长 0.25、速度 3、寿命 `0.7·t`，半程停出新的，`1.05·t` 后拆），
 * 不 silent 就 `whoosh1` + `crumple1..5`。弹一下放在第一帧（新精灵要摆过一次才有缓动）
 */
export function playEnter(scene: Scene, target: ExitTarget, colours: Colour[], silent = false, timeFac = 1): void {
    const t = 0.6 * timeFac;
    const start = scene.time.now / 1000;
    target.dissolve.amount = 1;
    target.dissolve.colours = colours;
    const parts = new Particles(scene, {
        timer: 0.025 * t, scale: 0.25, speed: 3, lifespan: 0.7 * t,
        attach: () => target.rect, colours, fill: true, depth: target.topDepth,
    });
    if (!silent) {
        scene.sound.play('whoosh1', { rate: Math.random() * 0.1 + 0.6, volume: 0.3 });
        scene.sound.play(`crumple${1 + Math.floor(Math.random() * 5)}`, { rate: Math.random() * 0.2 + 1.2, volume: 0.8 });
    }
    let juiced = false;
    const tick = (time: number) => {
        const age = time / 1000 - start;
        if (!juiced) {
            target.juiceUp();
            juiced = true;
        }
        target.dissolve.amount = Math.max(0, 1 - age / t);
        if (age > 0.5 * t) parts.max = 0;
        if (age >= 1.05 * t) {
            scene.events.off('update', tick);
            parts.destroy();
        }
    };
    scene.events.on('update', tick);
}
