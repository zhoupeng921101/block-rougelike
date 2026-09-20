/**
 * 消耗品的使用。期望值手算，算式写在用例名里（04 号票：没有外部真值）。
 *
 * 这个文件还兼着**覆盖面的名单快照**——与 `jokers/coverage.test.ts` 同一条理由：
 * 商店按设计从全池生成，玩家会买到还没实现的塔罗，而它「买了什么也不发生」。
 * 实现一张就来这里删一行。
 */

import { describe, expect, it } from 'vitest';

import { initialHands } from '../scoring';
import {
    CONSUMABLE_CENTERS,
    CONSUMABLE_KEYS_BY_SET,
    applyConsumable,
    distinctPlanetsUsed,
    isConsumableImplemented,
    makeConsumable,
    makeConsumableUsage,
    recordConsumableUsage,
    unimplementedConsumables,
} from './index';

const use = (key: string, hands = initialHands()) => {
    applyConsumable(makeConsumable(key), { hands });
    return hands;
};

describe('星球牌：level_up_hand(对应牌型)', () => {
    it('Pluto 升 High Card：chips 5 + 10 = 15，mult 1 + 1 = 2', () => {
        const hands = use('c_pluto');
        expect(hands['High Card']).toMatchObject({ level: 2, chips: 15, mult: 2 });
    });

    it('Mercury 升 Pair：chips 10 + 15 = 25，mult 2 + 1 = 3', () => {
        const hands = use('c_mercury');
        expect(hands.Pair).toMatchObject({ level: 2, chips: 25, mult: 3 });
    });

    it('Jupiter 升 Flush：chips 35 + 15 = 50，mult 4 + 2 = 6', () => {
        const hands = use('c_jupiter');
        expect(hands.Flush).toMatchObject({ level: 2, chips: 50, mult: 6 });
    });

    it('Neptune 升 Straight Flush：chips 100 + 40 = 140，mult 8 + 4 = 12', () => {
        const hands = use('c_neptune');
        expect(hands['Straight Flush']).toMatchObject({ level: 2, chips: 140, mult: 12 });
    });

    it('连吃三张 Jupiter：chips 35 + 15×3 = 80，mult 4 + 2×3 = 10', () => {
        const hands = initialHands();
        for (let i = 0; i < 3; i++) use('c_jupiter', hands);
        expect(hands.Flush).toMatchObject({ level: 4, chips: 80, mult: 10 });
    });

    it('只动自己那一个牌型，别的一动不动', () => {
        const before = initialHands();
        const hands = use('c_mercury');
        for (const name of Object.keys(hands) as Array<keyof typeof hands>) {
            if (name === 'Pair') continue;
            expect(hands[name], `${name} 被 Mercury 动到了`).toEqual(before[name]);
        }
    });

    it('12 张星球一张一张吃过去，12 个牌型全升到 2 级', () => {
        const hands = initialHands();
        for (const key of CONSUMABLE_KEYS_BY_SET.Planet) use(key, hands);
        expect(Object.values(hands).every((h) => h.level === 2)).toBe(true);
    });
});

describe('用量统计', () => {
    it('塔罗记 tarot 与 tarot_planet，星球记 planet 与 tarot_planet，all 都记', () => {
        const usage = makeConsumableUsage();
        recordConsumableUsage(usage, makeConsumable('c_fool'));
        recordConsumableUsage(usage, makeConsumable('c_pluto'));
        recordConsumableUsage(usage, makeConsumable('c_pluto'));
        expect(usage.total).toEqual({ tarot: 1, planet: 2, tarot_planet: 3, all: 3 });
    });

    /**
     * `Fortune Teller` 读 total.tarot（**算重复**），
     * `Satellite` 数 byKey 里 set 是 Planet 的条目（**不算重复**）。
     * 两张小丑读的是同一批数据的两种口径，混了就一张错。
     */
    it('Satellite 数的是「用过几种」星球，不是「用过几张」', () => {
        const usage = makeConsumableUsage();
        for (let i = 0; i < 5; i++) recordConsumableUsage(usage, makeConsumable('c_pluto'));
        expect(usage.total.planet).toBe(5);
        expect(distinctPlanetsUsed(usage)).toBe(1);

        recordConsumableUsage(usage, makeConsumable('c_mars'));
        expect(distinctPlanetsUsed(usage)).toBe(2);
    });

    it('塔罗不算进 Satellite 的数', () => {
        const usage = makeConsumableUsage();
        recordConsumableUsage(usage, makeConsumable('c_fool'));
        expect(distinctPlanetsUsed(usage)).toBe(0);
    });
});

describe('覆盖面：34 张里 12 张有行为', () => {
    it('12 张星球全部有 handler', () => {
        expect(CONSUMABLE_KEYS_BY_SET.Planet.every(isConsumableImplemented)).toBe(true);
    });

    /** 未实现的名单快照。**实现一张塔罗就来这里删一行。** */
    it('22 张塔罗一张都还没有——16 号票的第 6 步', () => {
        const names = unimplementedConsumables().map((k) => CONSUMABLE_CENTERS[k].name);
        expect(names).toEqual([
            'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
            'The Hierophant', 'The Lovers', 'The Chariot', 'Justice', 'The Hermit',
            'The Wheel of Fortune', 'Strength', 'The Hanged Man', 'Death', 'Temperance',
            'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
            'Judgement', 'The World',
        ]);
    });

    it('没实现的**抛**，不静默吞——与 Boss 的 assertImplemented 同一条', () => {
        expect(() => use('c_fool')).toThrow(/还没有实现行为/);
    });
});
