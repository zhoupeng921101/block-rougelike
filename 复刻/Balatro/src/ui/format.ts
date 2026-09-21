/**
 * `misc_functions.lua:957` 的 `number_format`：千分位逗号；非整数按大小取 0 / 1 / 2 位小数；
 * 过了 `G.E_SWITCH_POINT`（1e11）换成 `x.xxxe12` 这种写法。
 *
 * `%.Nf` 走 `formatFixedExact`：LuaJIT 自带的格式化对**恰好一半**取偶（12.25 → "12.2"），
 * JS 的 `toFixed` 取大（"12.3"）。
 */
import { formatFixedExact } from '../core/rng/fmt13';

const E_SWITCH_POINT = 100000000000;

export function numberFormat(num: number): string {
    if (num >= E_SWITCH_POINT) {
        const x = Number(num.toPrecision(4));
        const fac = Math.floor(Math.log10(x));
        return `${formatFixedExact(x / 10 ** fac, 3)}e${fac}`;
    }
    const digits = num !== Math.floor(num) ? (num >= 100 ? 0 : num >= 10 ? 1 : 2) : 0;
    const s = formatFixedExact(num, digits);
    // 原文是把整串倒过来、每三位数字加逗号、去掉末尾逗号再倒回来——只对连续数字生效
    const reversed = [...s].reverse().join('').replace(/(\d\d\d)/g, '$1,').replace(/,$/, '');
    return [...reversed].reverse().join('');
}
