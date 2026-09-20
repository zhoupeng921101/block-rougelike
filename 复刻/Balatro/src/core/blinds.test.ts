/**
 * 盲注的测试。
 *
 * **这个文件里最有价值的是第一个 describe**：它拿那 12 条外部真值去验
 * **生产代码**（真的走 `getNewBoss`），而 `rng/rng.test.ts` 验的是 RNG 算法本身。
 * 两者都用 `fixtures/ante1-boss-vectors.ts` 那一份 fixture。
 *
 * 分开验的理由：算法对 ≠ 接线对。`get_new_boss` 有两处只有生产代码才暴露的语义——
 * 池子按 **key 的字母序**（不是 `order`）、池子大小受 `bosses_used` 最小值过滤——
 * 手写 `pseudorandom('boss', 1, 8)` 那条测试抓不到它们。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import {
    BLIND_CENTERS,
    assertImplemented,
    debuffCard,
    debuffHand,
    getNewBoss,
    makeBlindState,
    modifyHand,
    pressPlay,
} from './blinds';
import { type Suit, type Value, makeCard, resetCardCounters } from './card';
import { ANTE_1_BOSSES, ANTE_1_BOSS_VECTORS } from './fixtures/ante1-boss-vectors';
import { PseudorandomState } from './rng';
import { blindRequirement, getBlindAmount } from './scoring';

function c(spec: string, x = 0) {
    const suitMap: Record<string, Suit> = { S: 'Spades', H: 'Hearts', C: 'Clubs', D: 'Diamonds' };
    const valMap: Record<string, Value> = {
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        T: '10', J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace',
    };
    const card = makeCard(spec, suitMap[spec[0]], valMap[spec.slice(1)]);
    card.T.x = x;
    return card;
}

beforeEach(() => resetCardCounters());

describe('get_new_boss：12 条外部真值打在生产代码上', () => {
    it.each(ANTE_1_BOSS_VECTORS)('种子 %s → %s', (seed, expected) => {
        const rng = new PseudorandomState(seed);
        const key = getNewBoss(1, rng, {});
        expect(BLIND_CENTERS[key].name).toBe(expected);
    });

    it('Ante 1 的池子正好是那 8 个，且按 key 的字母序', () => {
        // 把每个下标都取一遍：8 个 seed 抽出来的集合应当覆盖不了全部（随机），
        // 所以这里直接验池子构造——按 key 字母序排出来的 name 序列
        const keys = Object.entries(BLIND_CENTERS)
            .filter(([, b]) => b.boss && !b.boss.showdown && b.boss.min <= 1)
            .map(([k]) => k)
            .sort();
        expect(keys).toEqual([
            'bl_club', 'bl_goad', 'bl_head', 'bl_hook',
            'bl_manacle', 'bl_pillar', 'bl_psychic', 'bl_window',
        ]);
        expect(keys.map((k) => BLIND_CENTERS[k].name)).toEqual([...ANTE_1_BOSSES]);
    });

    it('bosses_used 的最小值过滤会缩小池子——抽过的那个下一次不在池里', () => {
        const rng = new PseudorandomState('TUTORIAL');
        const used: Record<string, number> = {};
        const first = getNewBoss(1, rng, used);
        expect(used[first]).toBe(1);

        // 第二次：其余 7 个的计数还是 0，所以池子只剩 7 个，first 被过滤掉
        const second = getNewBoss(1, rng, used);
        expect(second).not.toBe(first);
    });

    it('八个全抽过之后池子回到 8 个', () => {
        const rng = new PseudorandomState('TUTORIAL');
        const used: Record<string, number> = {};
        const drawn = new Set<string>();
        for (let i = 0; i < 8; i++) drawn.add(getNewBoss(1, rng, used));
        expect(drawn.size).toBe(8); // 最小值过滤保证不重复
        expect(Object.values(used).every((n) => n === 1)).toBe(true);
    });
});

describe('盲注需求', () => {
    it('前 8 个 Ante 的基数是写死的', () => {
        expect([1, 2, 3, 4, 5, 6, 7, 8].map(getBlindAmount)).toEqual([
            300, 800, 2000, 5000, 11000, 20000, 35000, 50000,
        ]);
    });

    it('Ante 1：小盲注 300 / 大盲注 450 / Boss 600', () => {
        expect(blindRequirement(1, 'small')).toBe(300);
        expect(blindRequirement(1, 'big')).toBe(450);
        expect(blindRequirement(1, 'boss')).toBe(600);
    });

    it('Ante 1 的 8 个 Boss 的 mult 全是 2，收益全是 $5', () => {
        for (const name of ANTE_1_BOSSES) {
            const center = Object.values(BLIND_CENTERS).find((b) => b.name === name);
            expect(center?.mult, name).toBe(2);
            expect(center?.dollars, name).toBe(5);
        }
    });
});

describe('debuff_card：四个花色 Boss', () => {
    const cases: ReadonlyArray<readonly [string, string, Suit]> = [
        ['bl_club', 'The Club', 'Clubs'],
        ['bl_goad', 'The Goad', 'Spades'],
        ['bl_head', 'The Head', 'Hearts'],
        ['bl_window', 'The Window', 'Diamonds'],
    ];

    it.each(cases)('%s 让 %s 封掉所有 %s', (key, _name, suit) => {
        const blind = makeBlindState(key);
        const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
        for (const s of suits) {
            const card = makeCard('x', s, 'King');
            expect(debuffCard(blind, card), s).toBe(s === suit);
        }
    });

    it('Boss 被 disable 之后不再 debuff', () => {
        const blind = makeBlindState('bl_club');
        const club = c('CK');
        expect(debuffCard(blind, club)).toBe(true);
        blind.disabled = true;
        expect(debuffCard(blind, club)).toBe(false);
    });
});

describe('debuff_card：The Pillar', () => {
    it('只封本 Ante 打过的牌', () => {
        const blind = makeBlindState('bl_pillar');
        const fresh = c('SK');
        const used = c('HK');
        used.played_this_ante = true;
        expect(debuffCard(blind, fresh)).toBe(false);
        expect(debuffCard(blind, used)).toBe(true);
    });
});

describe('debuff_hand：The Psychic', () => {
    it('出不到 5 张就整手不合法', () => {
        const blind = makeBlindState('bl_psychic');
        expect(blind.center.debuff.h_size_ge).toBe(5);
        expect(debuffHand(blind, [c('SK'), c('HK')], 'Pair')).toBe(true);
        expect(debuffHand(blind, [c('SK'), c('HK'), c('D9'), c('C4'), c('D3')], 'Pair')).toBe(false);
    });

    it('别的 Boss 不管张数', () => {
        expect(debuffHand(makeBlindState('bl_club'), [c('SK')], 'High Card')).toBe(false);
    });
});

describe('The Manacle：-1 手牌上限', () => {
    it('handSizeMod 是 -1，其余 Boss 是 0', () => {
        expect(makeBlindState('bl_manacle').handSizeMod).toBe(-1);
        expect(makeBlindState('bl_club').handSizeMod).toBe(0);
        expect(makeBlindState('bl_small').handSizeMod).toBe(0);
    });
});

describe('press_play：The Hook', () => {
    it('从手里随机抽 2 张，不重复', () => {
        const blind = makeBlindState('bl_hook');
        const hand = ['SK', 'HK', 'D9', 'C4', 'D3'].map((s, i) => c(s, i));
        const picked = pressPlay(blind, hand, new PseudorandomState('TUTORIAL'));
        expect(picked).toHaveLength(2);
        expect(new Set(picked).size).toBe(2);
        expect(picked.every((p) => hand.includes(p))).toBe(true);
    });

    it('手里只有 1 张时只弃 1 张——循环条件查的是原手牌区的位置', () => {
        const blind = makeBlindState('bl_hook');
        const picked = pressPlay(blind, [c('SK')], new PseudorandomState('TUTORIAL'));
        expect(picked).toHaveLength(1);
    });

    it('手里没牌时不弃，也不消费 RNG', () => {
        const blind = makeBlindState('bl_hook');
        const rng = new PseudorandomState('TUTORIAL');
        expect(pressPlay(blind, [], rng)).toHaveLength(0);
        expect(Object.keys(rng.snapshot())).toHaveLength(0);
    });

    it('别的 Boss 不弃牌', () => {
        const hand = ['SK', 'HK'].map((s, i) => c(s, i));
        expect(pressPlay(makeBlindState('bl_club'), hand, new PseudorandomState('X'))).toHaveLength(0);
    });

    it('同 seed 抽到同两张', () => {
        const hand = () => ['SK', 'HK', 'D9', 'C4', 'D3'].map((s, i) => c(s, i));
        const a = pressPlay(makeBlindState('bl_hook'), hand(), new PseudorandomState('ALEEB'));
        const b = pressPlay(makeBlindState('bl_hook'), hand(), new PseudorandomState('ALEEB'));
        expect(a.map((x) => x.key)).toEqual(b.map((x) => x.key));
    });
});

describe('modify_hand', () => {
    it('Ante 1 的 8 个 Boss 一个都不改基础值', () => {
        for (const name of ANTE_1_BOSSES) {
            const key = Object.entries(BLIND_CENTERS).find(([, b]) => b.name === name)![0];
            expect(modifyHand(makeBlindState(key), 4, 35), name).toEqual({ mult: 4, handChips: 35 });
        }
    });

    it('The Flint 砍半，且是四舍五入不是截断：mult 5 → 3、chips 35 → 18', () => {
        const blind = makeBlindState('bl_flint');
        expect(modifyHand(blind, 5, 35)).toEqual({ mult: 3, handChips: 18 });
    });

    it('The Flint 的 mult 下限是 1', () => {
        expect(modifyHand(makeBlindState('bl_flint'), 1, 0)).toEqual({ mult: 1, handChips: 0 });
    });
});

describe('未实现的 Boss 要挡住，不能静默放过', () => {
    it('The Ox 会抛——它有完整数值但没有 debuff 实现', () => {
        expect(() => assertImplemented(BLIND_CENTERS.bl_ox)).toThrow(/The Ox/);
    });

    it('Ante 1 的 8 个都过', () => {
        for (const name of ANTE_1_BOSSES) {
            const center = Object.values(BLIND_CENTERS).find((b) => b.name === name)!;
            expect(() => assertImplemented(center), name).not.toThrow();
        }
    });

    it('小盲注／大盲注不是 Boss，直接过', () => {
        expect(() => assertImplemented(BLIND_CENTERS.bl_small)).not.toThrow();
        expect(() => assertImplemented(BLIND_CENTERS.bl_big)).not.toThrow();
    });
});

describe('生成的数据本身', () => {
    it('30 条 = 小盲注 + 大盲注 + 28 个 Boss', () => {
        const all = Object.values(BLIND_CENTERS);
        expect(all).toHaveLength(30);
        expect(all.filter((b) => b.boss)).toHaveLength(28);
    });
});
