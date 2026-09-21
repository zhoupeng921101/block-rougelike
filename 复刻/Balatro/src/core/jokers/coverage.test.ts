/**
 * 小丑的覆盖面。
 *
 * **这个文件的作用是让「没有行为的小丑」这件事可见。**
 *
 * 商店按设计从 150 张的全池生成（池子大小影响 RNG，不能裁），
 * 所以玩家会买到还没实现行为的小丑，而它「看起来完全正常、买了什么也不发生」。
 * 这与「有数值但没 debuff 的 Boss」是同一个坑，只是这次不能用抛异常挡——
 * 那会让商店开不出来。
 *
 * 所以这里钉一份**名单快照**：
 * - 实现了一张 → 这里会红，来删掉对应那行
 * - 手滑删掉一个 handler → 这里也会红
 *
 * 名单本身是从 handler 表**算出来的**（`isJokerImplemented`），不手写，
 * 所以它不会与代码漂移。
 */

import { describe, expect, it } from 'vitest';

import { JOKER_CENTERS, JOKER_KEYS_BY_ORDER, isJokerImplemented, unimplementedJokers } from './index';

/**
 * 还没实现的 17 张，按**卡在哪个系统**分组。
 *
 * 这份分组是这个文件真正的价值：一眼能看出「补哪个系统能一次解开多少张」。
 * 数字是当前的实际张数，实现一张就从下面删掉一行。
 */
const BLOCKED: Readonly<Record<string, readonly string[]>> = {

    /** 生成 / 摧毁小丑与扑克牌。解开 8 张 */
    增删牌: [
        'Ceremonial Dagger', 'DNA', 'Madness', 'Riff-raff', 'Invisible Joker',
        'Caino', 'Yorick', 'Hologram',
    ],
    /** 负债（`Run.dollars` 现在不许负数）。解开 4 张 */
    负债: ['Credit Card', 'Rocket', 'Gift Card', 'Diet Cola'],
    /** 标签与跳过盲注。解开 3 张 */
    标签: ['Throwback', 'Certificate', 'Trading Card'],
    /** Boss 的 `disable()`。解开 2 张 */
    关掉Boss: ['Luchador', 'Chicot'],
};

describe('覆盖面', () => {
    it('150 张里 133 张有行为', () => {
        const implemented = JOKER_KEYS_BY_ORDER.filter(isJokerImplemented);
        expect(implemented.length + unimplementedJokers().length).toBe(150);
        expect(implemented).toHaveLength(133);
    });

    it('rarity 1 的 61 张里只剩 2 张没做', () => {
        const un = unimplementedJokers().filter((k) => JOKER_CENTERS[k].rarity === 1);
        expect(un.map((k) => JOKER_CENTERS[k].name)).toEqual([
            'Credit Card', // 负债上限 —— 钱要能扣到 -20
            'Riff-raff', // 生成小丑
        ]);
    });

    /** 未实现的名单快照。**实现一张就来 `BLOCKED` 里删一行。** */
    it('未实现的 17 张，与分组表逐条对得上', () => {
        const actual = unimplementedJokers().map((k) => JOKER_CENTERS[k].name).sort();
        const grouped = Object.values(BLOCKED).flat().slice().sort();
        expect(actual).toEqual(grouped);
        expect(actual).toHaveLength(17);
    });

    it('分组表里没有重复，也没有拼错的名字', () => {
        const all = Object.values(BLOCKED).flat();
        expect(new Set(all).size).toBe(all.length);
        const names = new Set(Object.values(JOKER_CENTERS).map((c) => c.name));
        for (const name of all) expect(names.has(name), name).toBe(true);
    });

    it('下一刀是增删牌那 8 张', () => {
        // 这条不是断言代码行为，是把「下一步做什么」的依据钉住：
        // 哪个分组最大，下一刀就先做它
        const sizes = Object.entries(BLOCKED).map(([k, v]) => [k, v.length] as const);
        const biggest = sizes.reduce((a, b) => (b[1] > a[1] ? b : a));
        expect(biggest[0]).toBe('增删牌');
        expect(biggest[1]).toBe(8);
    });
});
