/**
 * Balatro 自己那层随机数包装：`pseudohash` / `pseudoseed` / `pseudorandom`。
 *
 * 对应 `参考/产物/Balatro_1.0.1o/源码/functions/misc_functions.lua` 的
 * `:256` `pseudorandom_element`、`:282` `pseudohash`、`:301` `pseudoseed`、`:318` `pseudorandom`。
 *
 * 关键结构：**每个 key 在 `G.GAME.pseudorandom[key]` 上维护自己的浮点状态**，
 * 而底层 `math.random` 每次使用前都会重新播种。
 * 所以跨 key 打乱无影响，**同一个 key 的调用次数与先后必须逐次对齐**。
 */

import { fmt13 } from './fmt13';
import { random, randomseed } from './luajit-random';

/** Lua 的 `a % 1`：对负数也返回非负。JS 的 `%` 是截断取余，不能直接用。 */
function frac(a: number): number {
    return a - Math.floor(a);
}

/**
 * `pseudohash(str)` —— 从末字节向前的浮点哈希链。
 * 注意 `i` 是 Lua 的 1-based 下标，直接参与运算，不能换成 0-based。
 */
export function pseudohash(str: string): number {
    let num = 1;

    for (let i = str.length; i >= 1; i--) {
        num = frac((1.1239285023 / num) * str.charCodeAt(i - 1) * Math.PI + Math.PI * i);
    }

    return num;
}

/**
 * 对应 `G.GAME.pseudorandom` 那张表。
 *
 * 整体可存档/回滚——对拍时要能 checkpoint。
 */
export class PseudorandomState {
    readonly seed: string;
    private readonly hashedSeed: number;
    private readonly keyStates = new Map<string, number>();

    constructor(seed: string) {
        this.seed = seed;
        this.hashedSeed = pseudohash(seed);
    }

    /**
     * `pseudoseed(key)` —— 推进该 key 的状态并返回本次的种子。
     * **有副作用**：每次调用都会改写该 key 的状态。
     */
    pseudoseed(key: string): number {
        let state = this.keyStates.get(key);
        if (state === undefined) state = pseudohash(key + this.seed);

        state = Math.abs(fmt13(frac(2.134453429141 + state * 1.72431234)));
        this.keyStates.set(key, state);

        return (state + this.hashedSeed) / 2;
    }

    /** `pseudorandom(key)` / `(key, min, max)`。 */
    pseudorandom(key: string, min?: number, max?: number): number {
        const generator = randomseed(this.pseudoseed(key));
        return random(generator, min, max);
    }

    /** 快照，供对拍时回滚。 */
    snapshot(): Record<string, number> {
        return Object.fromEntries(this.keyStates);
    }

    restore(snapshot: Record<string, number>): void {
        this.keyStates.clear();
        for (const [key, value] of Object.entries(snapshot)) this.keyStates.set(key, value);
    }
}

/**
 * `pseudoseed(key, predict_seed)` 的预测分支（`get_first_legendary` 用）。
 *
 * 这是**纯函数**，不写回 `G.GAME.pseudorandom`，公式也与主分支不同——
 * 刻意不与 `PseudorandomState.pseudoseed` 合并。
 */
export function predictSeed(key: string, predict: string): number {
    let p = pseudohash(key + predict);
    p = Math.abs(fmt13(frac(2.134453429141 + p * 1.72431234)));
    return (p + pseudohash(predict)) / 2;
}
