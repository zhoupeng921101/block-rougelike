import { describe, expect, it } from 'vitest';

import { numberFormat } from './format';

describe('number_format（misc_functions.lua:957）', () => {
    it('整数加千分位', () => {
        expect(numberFormat(0)).toBe('0');
        expect(numberFormat(332)).toBe('332');
        expect(numberFormat(1234)).toBe('1,234');
        expect(numberFormat(1234567)).toBe('1,234,567');
    });

    it('非整数按大小取 2 / 1 / 0 位小数', () => {
        expect(numberFormat(1.5)).toBe('1.50');
        // 恰好一半时 LuaJIT 取偶（JS 的 toFixed 会给 12.3）
        expect(numberFormat(12.25)).toBe('12.2');
        expect(numberFormat(12.35)).toBe('12.3'); // 12.35 的二进制值略小于一半
        expect(numberFormat(1234.4)).toBe('1,234');
    });

    it('过了 1e11 换成科学计数', () => {
        expect(numberFormat(123456789012)).toBe('1.235e11');
    });
});
