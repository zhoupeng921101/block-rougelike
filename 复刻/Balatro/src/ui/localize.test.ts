/**
 * 描述解析对拍原作（22 号票）：`tools/loc-oracle.py` 拿原作的 `loc_parse_string` 跑 en-us.lua 的全部描述。
 */
import { describe, expect, it } from 'vitest';

import { DESCRIPTIONS } from './descriptions.generated';
import oracle from './loc-oracle.generated.json';
import { locParseString, localizeRaw, luaNumber } from './localize';

describe('loc_parse_string', () => {
    const cases = oracle as unknown as Record<string, unknown[]>;

    it('380 条描述逐行与原作一致', () => {
        expect(Object.keys(cases)).toHaveLength(380);
        for (const [id, expected] of Object.entries(cases)) {
            const [set, key] = id.split('/') as [string, string];
            const lines = DESCRIPTIONS[set]![key]!.text!;
            expect(lines.map(locParseString), id).toEqual(expected);
        }
    });

    it('拼变量：Joker 的 +4 Mult', () => {
        expect(localizeRaw('Joker', 'j_joker', [4])).toEqual(['+4 Mult']);
    });
});

describe('luaNumber（Lua 5.1 的 %.14g）', () => {
    it.each([
        [2, '2'], [1.5, '1.5'], [0.1, '0.1'], [-3, '-3'], [1e15, '1e+15'], [0.1 + 0.2, '0.3'], [1 / 3, '0.33333333333333'],
    ])('%s → %s', (n, s) => expect(luaNumber(n)).toBe(s));
});
