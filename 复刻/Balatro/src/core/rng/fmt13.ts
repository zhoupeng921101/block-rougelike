/**
 * 复刻 Lua 的 `string.format("%.13f", x)` 再 `tonumber()`。
 *
 * 为什么不能用 `toFixed`：LuaJIT 2.1 不走 libc 的 printf，自带 `lj_strfmt_num.c`，
 * 固定 round-**half-to-even**；JS 的 `toFixed` 是 round-half-**away-from-zero**。
 * 两者在「精确等于半个单位」的输入上分叉。
 *
 * 为什么不能用 `Math.round(x * 1e13) / 1e13`（Immolate 系移植的做法）：
 * 实测与精确值有 0.042% 的偏差。
 *
 * 做法：把 double 拆成精确的 `m * 2^e`，用 BigInt 做精确的十进制定点舍入。
 * 依据见 .scratch/balatro-复刻/research/02-LuaJIT-RNG.md §4。
 */

const SCRATCH = new DataView(new ArrayBuffer(8));

/**
 * 精确复刻 C 的 `%.<digits>f`，返回十进制字符串。
 *
 * @param x 待格式化的有限双精度数
 * @param digits 小数位数
 * @param halfEven true 走 round-half-to-even（LuaJIT 口径）；
 *                 false 走 round-half-away（libc/`toFixed` 口径），仅用于对照测试
 */
export function formatFixedExact(x: number, digits: number, halfEven = true): string {
    if (!Number.isFinite(x)) return String(x);

    const negative = x < 0 || Object.is(x, -0);
    const abs = Math.abs(x);

    // 拆出 IEEE754 的尾数与指数，得到精确的 abs = mantissa * 2^exponent
    SCRATCH.setFloat64(0, abs);
    const hi = SCRATCH.getUint32(0);
    const lo = SCRATCH.getUint32(4);
    const rawExponent = (hi >>> 20) & 0x7ff;

    let mantissa = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
    let exponent: number;

    if (rawExponent === 0) {
        exponent = -1074; // 次正规数，无隐含位
    } else {
        mantissa |= 1n << 52n; // 补回隐含的前导 1
        exponent = rawExponent - 1075;
    }

    // 目标是 round(abs * 10^digits)，全程用整数算，不引入任何浮点误差
    const scale = 10n ** BigInt(digits);
    let quotient: bigint;
    let remainder: bigint;
    let half: bigint;

    if (exponent >= 0) {
        quotient = mantissa * (1n << BigInt(exponent)) * scale;
        remainder = 0n;
        half = 1n;
    } else {
        const shift = BigInt(-exponent);
        const numerator = mantissa * scale;
        quotient = numerator >> shift;
        remainder = numerator & ((1n << shift) - 1n);
        half = 1n << (shift - 1n);
    }

    if (remainder > half || (remainder === half && (halfEven ? (quotient & 1n) === 1n : true))) {
        quotient += 1n;
    }

    let digitsOut = quotient.toString();
    if (digits > 0) {
        if (digitsOut.length <= digits) {
            digitsOut = '0'.repeat(digits + 1 - digitsOut.length) + digitsOut;
        }
        const cut = digitsOut.length - digits;
        digitsOut = digitsOut.slice(0, cut) + '.' + digitsOut.slice(cut);
    }

    return (negative ? '-' : '') + digitsOut;
}

/** `tonumber(string.format("%.13f", x))` —— `pseudoseed` 每步都要过这一道。 */
export function fmt13(x: number): number {
    return Number(formatFixedExact(x, 13, true));
}
