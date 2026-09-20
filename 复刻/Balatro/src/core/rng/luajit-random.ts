/**
 * LuaJIT 2.1 的 `math.randomseed` / `math.random`（TW223 Tausworthe）。
 *
 * Balatro 跑在 LÖVE 上，但 **LÖVE 从未替换全局 `math.random`** ——
 * 这条已在本仓库的 `参考/产物/Balatro_1.0.1o/原生库/arm64-v8a/liblove.so` 里验证：
 * LuaJIT 的预计算种子常量原样出现在该二进制中（见下方 `SEED_FIXED_REFERENCE`）。
 *
 * 依据见 .scratch/balatro-复刻/research/02-LuaJIT-RNG.md §1、§2。
 */

const U64_MASK = (1n << 64n) - 1n;

/** LuaJIT 源码里的 `TW223_STEP` 参数，四个分量各一组 (k, q, s)。 */
const STEP_PARAMS: ReadonlyArray<readonly [bigint, bigint, bigint]> = [
    [63n, 31n, 18n],
    [58n, 19n, 28n],
    [55n, 24n, 7n],
    [47n, 21n, 8n],
];

/**
 * `lj_prng_seed_fixed` 的预计算值，即 `randomseed(0.0)` 之后的状态。
 * 这四个常量在 `liblove.so` 里的字节偏移：1159408 / 1159416 / 1156768 / 1156776。
 * 用作单元测试的硬基准——它不依赖实机，也不依赖任何素材。
 */
export const SEED_FIXED_REFERENCE: ReadonlyArray<bigint> = [
    0xa0d277570a345b8cn,
    0x764a296c5d4aa64fn,
    0x51220704070adeaan,
    0x2a2717b5a7b7b927n,
];

/** TW223 的内部状态：四个 64 位字。 */
export type LuaRandomState = bigint[];

const SCRATCH = new DataView(new ArrayBuffer(8));

function doubleToBits(x: number): bigint {
    SCRATCH.setFloat64(0, x);
    return (BigInt(SCRATCH.getUint32(0)) << 32n) | BigInt(SCRATCH.getUint32(4));
}

function bitsToDouble(u: bigint): number {
    SCRATCH.setUint32(0, Number((u >> 32n) & 0xffffffffn));
    SCRATCH.setUint32(4, Number(u & 0xffffffffn));
    return SCRATCH.getFloat64(0);
}

/** 推进一步，返回四个分量异或后的 64 位结果。 */
function step(state: LuaRandomState): bigint {
    let result = 0n;

    for (let i = 0; i < 4; i++) {
        const [k, q, s] = STEP_PARAMS[i];
        const z = state[i];
        const topMask = (U64_MASK << (64n - k)) & U64_MASK;

        // 每次左移后都要截回 64 位——BigInt 不会自动截断
        const next =
            (((((z << q) & U64_MASK) ^ z) >> (k - s)) ^ (((z & topMask) << s) & U64_MASK)) &
            U64_MASK;

        result ^= next;
        state[i] = next;
    }

    return result;
}

/**
 * `math.randomseed(d)`。
 *
 * 注意 `d = d * π + e` 这一步**不能**收缩成 FMA：LuaJIT 官方的预计算常量就是按
 * 「两次独立舍入」算出来的。JS 天然没有 FMA，写成两步即正确。
 */
export function randomseed(d: number): LuaRandomState {
    const state: LuaRandomState = [0n, 0n, 0n, 0n];
    let rotator = 0x11090601;

    for (let i = 0; i < 4; i++) {
        const minimum = 1n << BigInt(rotator & 255);
        rotator >>>= 8;

        d = d * Math.PI + 2.718281828459045;

        let bits = doubleToBits(d);
        // 保证该分量的高 k 位非零，否则 LFSR 会退化
        if (bits < minimum) bits = (bits + minimum) & U64_MASK;

        state[i] = bits;
    }

    // LuaJIT 丢弃前 10 次输出
    for (let i = 0; i < 10; i++) step(state);

    return state;
}

/**
 * `math.random()` / `math.random(m)` / `math.random(m, n)`。
 *
 * **刻意不做参数校验。** LuaJIT 对 `math.random(0)` 不报错（返回 1），
 * 只有 PUC Lua 才抛 `interval is empty`。加了校验会在空池场景与原版分叉。
 */
export function random(state: LuaRandomState, m?: number, n?: number): number {
    const bits = (step(state) & 0x000fffffffffffffn) | 0x3ff0000000000000n;
    const d = bitsToDouble(bits) - 1.0;

    if (m !== undefined && n === undefined) return Math.floor(d * m) + 1;
    if (m !== undefined && n !== undefined) return Math.floor(d * (n - m + 1)) + m;
    return d;
}
