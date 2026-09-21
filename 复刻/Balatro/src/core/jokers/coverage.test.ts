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

describe('覆盖面', () => {
    /**
     * **150 张全部有行为**（18 号票第 1 步收尾：Throwback / Diet Cola）。
     *
     * 这条仍然留着：手滑删掉一个 handler，这里会红。
     * 「有行为」的判据从 handler 表**算出来**（`isJokerImplemented`），不手写名单。
     */
    it('150 张全部有行为', () => {
        expect(JOKER_KEYS_BY_ORDER).toHaveLength(150);
        expect(unimplementedJokers().map((k) => JOKER_CENTERS[k].name)).toEqual([]);
        expect(JOKER_KEYS_BY_ORDER.filter(isJokerImplemented)).toHaveLength(150);
    });

    it('rarity 1 的 61 张全做完了', () => {
        const un = unimplementedJokers().filter((k) => JOKER_CENTERS[k].rarity === 1);
        expect(un).toEqual([]);
    });
});
