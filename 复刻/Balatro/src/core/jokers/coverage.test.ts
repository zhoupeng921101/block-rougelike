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
 * 名单本身是从九张 handler 表**算出来的**（`isJokerImplemented`），不手写，
 * 所以它不会与代码漂移。
 */

import { describe, expect, it } from 'vitest';

import { JOKER_CENTERS, JOKER_KEYS_BY_ORDER, isJokerImplemented, unimplementedJokers } from './index';

describe('覆盖面', () => {
    it('150 张里 74 张有行为', () => {
        const implemented = JOKER_KEYS_BY_ORDER.filter(isJokerImplemented);
        expect(implemented.length + unimplementedJokers().length).toBe(150);
        expect(implemented).toHaveLength(74);
    });

    it('rarity 1 的 61 张里只剩 6 张没实现，且都卡在还没做的系统上', () => {
        const un = unimplementedJokers().filter((k) => JOKER_CENTERS[k].rarity === 1);
        expect(un.map((k) => JOKER_CENTERS[k].name)).toEqual([
            'Credit Card', // 负债上限 —— 钱能扣到 -20，`Run.dollars` 现在不许负数
            '8 Ball', // 生成塔罗牌
            'Superposition', // 生成塔罗牌
            'Riff-raff', // 生成小丑
            'Hallucination', // 开补充包时生成塔罗牌
            'Golden Ticket', // 黄金牌（强化牌）
        ]);
    });

    /**
     * 未实现的名单快照。**实现一张就来删一行。**
     *
     * 每一行后面注明它卡在什么上，这样一眼能看出「补哪个系统能一次解开多少张」：
     * 塔罗／星球（消耗品）、强化牌、版本、蜡封、标签与跳过盲注、补充包。
     */
    it('未实现的 76 张，逐条注明卡在哪', () => {
        expect(unimplementedJokers().map((k) => JOKER_CENTERS[k].name)).toEqual([
            // —— 卡在消耗品（塔罗 / 星球 / 幽灵牌）——
            '8 Ball', 'Superposition', 'Hallucination', 'Sixth Sense', 'Constellation',
            'Seance', 'Cloud 9', 'Vagabond', 'Cartomancer', 'Astronomer', 'Satellite',
            'To the Moon', 'Turtle Bean', 'Diet Cola', 'Perkeo',
            // —— 卡在强化牌 ——
            'Golden Ticket', 'Marble Joker', 'Steel Joker', 'Stone Joker', 'Lucky Cat',
            'Glass Joker', 'Midas Mask', 'Vampire', 'Driver\'s License', 'Caino',
            // —— 卡在标签 / 跳过盲注 / 补充包 ——
            'Throwback', 'Burglar', 'Certificate', 'Trading Card',
            // —— 卡在负债（Run.dollars 不许负数）——
            'Credit Card', 'Rocket', 'Gift Card', 'Bootstraps',
            // —— 生成 / 摧毁小丑 ——
            'Riff-raff', 'Ceremonial Dagger', 'Madness', 'Invisible Joker', 'Luchador',
            'DNA', 'Yorick', 'Chicot',
            // —— 纯逻辑，可以现在就做 ——
            'Joker Stencil', 'Four Fingers', 'Fibonacci', 'Blackboard', 'Hiker',
            'Card Sharp', 'Shortcut', 'Hologram', 'Erosion', 'Flash Card', 'Castle',
            'Mr. Bones', 'Troubadour', 'Smeared Joker', 'Rough Gem', 'Bloodstone',
            'Arrowhead', 'Onyx Agate', 'Flower Pot', 'Merry Andy', 'Oops! All 6s',
            'The Idol', 'Seeing Double', 'Matador', 'Obelisk', 'Baseball Card',
            'Ancient Joker', 'Campfire', 'Blueprint', 'Wee Joker', 'Hit the Road',
            'Stuntman', 'Brainstorm', 'Burnt Joker', 'Triboulet',
        ].sort((a, b) => keyOrder(a) - keyOrder(b)));
    });
});

/** 快照按 `order` 排序，所以上面那张手写的分组表也要按 order 重排一遍。 */
function keyOrder(name: string): number {
    const entry = Object.values(JOKER_CENTERS).find((c) => c.name === name);
    if (!entry) throw new Error(`没有这张小丑：${name}`);
    return entry.order;
}
