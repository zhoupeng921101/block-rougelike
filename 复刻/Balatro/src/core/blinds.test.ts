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
    ALL_DISCARDS,
    BLIND_CENTERS,
    assertImplemented,
    debuffCard,
    debuffHand,
    drawCount,
    drawnToHand,
    getNewBoss,
    makeBlindState,
    modifyHand,
    pressPlay,
    stayFlipped,
} from './blinds';
import { makeJoker } from './jokers';
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

describe('press_play', () => {
    const hand5 = () => ['SK', 'HK', 'D9', 'C4', 'D3'].map((s, i) => c(s, i));

    it('The Hook 从手里随机抽 2 张，不重复', () => {
        const hand = hand5();
        const { discard } = pressPlay(makeBlindState('bl_hook'), hand, [], new PseudorandomState('TUTORIAL'));
        expect(discard).toHaveLength(2);
        expect(new Set(discard).size).toBe(2);
        expect(discard.every((p) => hand.includes(p))).toBe(true);
    });

    it('The Hook 手里只有 1 张时只弃 1 张——循环条件查的是原手牌区的位置', () => {
        const { discard } = pressPlay(makeBlindState('bl_hook'), [c('SK')], [], new PseudorandomState('T'));
        expect(discard).toHaveLength(1);
    });

    it('The Hook 手里没牌时不弃，也不消费 RNG', () => {
        const rng = new PseudorandomState('TUTORIAL');
        expect(pressPlay(makeBlindState('bl_hook'), [], [], rng).discard).toHaveLength(0);
        expect(Object.keys(rng.snapshot())).toHaveLength(0);
    });

    it('The Hook 同 seed 抽到同两张', () => {
        const a = pressPlay(makeBlindState('bl_hook'), hand5(), [], new PseudorandomState('ALEEB'));
        const b = pressPlay(makeBlindState('bl_hook'), hand5(), [], new PseudorandomState('ALEEB'));
        expect(a.discard.map((x) => x.key)).toEqual(b.discard.map((x) => x.key));
    });

    it('The Tooth 按**打出的张数**扣钱，不是手里的张数', () => {
        const played = ['SK', 'HK', 'D9'].map((x, i) => c(x, i));
        const r = pressPlay(makeBlindState('bl_tooth'), hand5(), played, new PseudorandomState('X'));
        expect(r.dollarsLost).toBe(3);
        expect(r.discard).toHaveLength(0);
    });

    it('The Fish 置 prepped，好让下一批补的牌盖着', () => {
        const blind = makeBlindState('bl_fish');
        blind.prepped = false;
        pressPlay(blind, hand5(), [c('SK')], new PseudorandomState('X'));
        expect(blind.prepped).toBe(true);
    });

    it('别的 Boss 既不弃牌也不扣钱', () => {
        const r = pressPlay(makeBlindState('bl_club'), hand5(), hand5(), new PseudorandomState('X'));
        expect(r).toEqual({ discard: [], dollarsLost: 0 });
    });

    it('被 disable 之后什么都不做', () => {
        const blind = makeBlindState('bl_hook');
        blind.disabled = true;
        expect(pressPlay(blind, hand5(), [], new PseudorandomState('X')).discard).toHaveLength(0);
    });
});

describe('stay_flipped：四个盖牌 Boss', () => {
    const fresh = { handsPlayed: 0, discardsUsed: 0 };
    const later = { handsPlayed: 1, discardsUsed: 0 };

    it('The House 只盖第一批（还没出牌也没弃牌那批）', () => {
        const blind = makeBlindState('bl_house');
        expect(stayFlipped(blind, c('SK'), fresh, new PseudorandomState('X'))).toBe(true);
        expect(stayFlipped(blind, c('SK'), later, new PseudorandomState('X'))).toBe(false);
        expect(stayFlipped(blind, c('SK'), { handsPlayed: 0, discardsUsed: 1 }, new PseudorandomState('X')))
            .toBe(false);
    });

    it('The Mark 只盖人头牌', () => {
        const blind = makeBlindState('bl_mark');
        const rng = () => new PseudorandomState('X');
        expect(stayFlipped(blind, c('SK'), fresh, rng())).toBe(true);
        expect(stayFlipped(blind, c('SQ'), fresh, rng())).toBe(true);
        expect(stayFlipped(blind, c('SJ'), fresh, rng())).toBe(true);
        expect(stayFlipped(blind, c('ST'), fresh, rng())).toBe(false);
        expect(stayFlipped(blind, c('SA'), fresh, rng())).toBe(false);
    });

    it('The Mark 对**被 debuff 的**人头牌照样盖——`is_face(true)` 的 true 是 from_boss', () => {
        const card = c('SK');
        card.debuff = true;
        expect(stayFlipped(makeBlindState('bl_mark'), card, fresh, new PseudorandomState('X'))).toBe(true);
    });

    it('The Wheel **无条件消费一次 RNG**，中不中都消费', () => {
        const rng = new PseudorandomState('TUTORIAL');
        stayFlipped(makeBlindState('bl_wheel'), c('SK'), fresh, rng);
        expect(rng.snapshot()).toHaveProperty('wheel');
    });

    it('The Wheel 大约 1/7 盖牌', () => {
        let flipped = 0;
        const n = 700;
        const rng = new PseudorandomState('TUTORIAL');
        const blind = makeBlindState('bl_wheel');
        for (let i = 0; i < n; i++) {
            if (stayFlipped(blind, c('SK'), fresh, rng)) flipped++;
        }
        // 期望 100。700 个样本给 ±45 的余量
        expect(flipped).toBeGreaterThan(55);
        expect(flipped).toBeLessThan(145);
    });

    it('The Fish 只在 prepped 时盖', () => {
        const blind = makeBlindState('bl_fish');
        expect(blind.prepped).toBe(true);
        expect(stayFlipped(blind, c('SK'), later, new PseudorandomState('X'))).toBe(true);
        blind.prepped = false;
        expect(stayFlipped(blind, c('SK'), later, new PseudorandomState('X'))).toBe(false);
    });

    it('别的 Boss 不盖牌', () => {
        for (const key of ['bl_club', 'bl_hook', 'bl_small']) {
            expect(stayFlipped(makeBlindState(key), c('SK'), fresh, new PseudorandomState('X')), key)
                .toBe(false);
        }
    });
});

describe('The Needle / The Water：进场就砍次数', () => {
    it('The Needle 的 handsSub 是 3（4 次砍到只剩 1 次）', () => {
        expect(makeBlindState('bl_needle').handsSub).toBe(3);
        expect(makeBlindState('bl_club').handsSub).toBe(0);
    });

    it('The Water 的 discardsSub 是「全砍」的哨兵，而不是写死 3', () => {
        // 写死 3 会在带 Drunkard（d_size +1）时留下 1 次弃牌
        expect(makeBlindState('bl_water').discardsSub).toBe(ALL_DISCARDS);
        expect(makeBlindState('bl_club').discardsSub).toBe(0);
    });

    it('The Needle 的 mult 是 1 —— 需求不翻倍，但只给一次出牌', () => {
        expect(BLIND_CENTERS.bl_needle.mult).toBe(1);
    });
});

describe('The Serpent：出牌／弃牌之后固定补 3 张', () => {
    it('第一批按常规（返回 null）', () => {
        expect(drawCount(makeBlindState('bl_serpent'), { handsPlayed: 0, discardsUsed: 0 }, 40)).toBeNull();
    });

    it('出过牌之后固定 3 张', () => {
        expect(drawCount(makeBlindState('bl_serpent'), { handsPlayed: 1, discardsUsed: 0 }, 40)).toBe(3);
    });

    it('弃过牌之后也固定 3 张', () => {
        expect(drawCount(makeBlindState('bl_serpent'), { handsPlayed: 0, discardsUsed: 1 }, 40)).toBe(3);
    });

    it('牌堆不够 3 张时补剩下的', () => {
        expect(drawCount(makeBlindState('bl_serpent'), { handsPlayed: 1, discardsUsed: 0 }, 2)).toBe(2);
    });

    it('别的 Boss 不改补牌数', () => {
        expect(drawCount(makeBlindState('bl_club'), { handsPlayed: 1, discardsUsed: 0 }, 40)).toBeNull();
    });
});

describe('debuff_hand 的四个有状态 Boss', () => {
    it('The Eye：每种牌型本局只能打一次', () => {
        const blind = makeBlindState('bl_eye');
        const cards = ['SK', 'HK', 'D9', 'C4', 'D3'].map((x, i) => c(x, i));
        expect(debuffHand(blind, cards, 'Pair')).toBe(false); // 第一次 Pair
        expect(debuffHand(blind, cards, 'Two Pair')).toBe(false); // 换个牌型也行
        expect(debuffHand(blind, cards, 'Pair')).toBe(true); // 第二次 Pair 不合法
    });

    it('The Eye 的 check 模式只查不写', () => {
        const blind = makeBlindState('bl_eye');
        const cards = [c('SK')];
        expect(debuffHand(blind, cards, 'Pair', { check: true })).toBe(false);
        // check 没记下来，所以真出牌时还是第一次
        expect(debuffHand(blind, cards, 'Pair')).toBe(false);
    });

    it('The Mouth：本局只许第一手打的那种牌型', () => {
        const blind = makeBlindState('bl_mouth');
        const cards = [c('SK')];
        expect(debuffHand(blind, cards, 'Pair')).toBe(false);
        expect(debuffHand(blind, cards, 'Pair')).toBe(false); // 同一种随便打
        expect(debuffHand(blind, cards, 'Flush')).toBe(true); // 换牌型就不合法
    });

    it('The Arm：降一级但**返回 false**——这手牌照常计分', () => {
        const blind = makeBlindState('bl_arm');
        let leveled: string | null = null;
        const r = debuffHand(blind, [c('SK')], 'Pair', {
            handLevel: 3,
            levelDown: (n) => { leveled = n; },
        });
        expect(r).toBe(false); // 关键：不是 true
        expect(blind.triggered).toBe(true);
        expect(leveled).toBe('Pair');
    });

    it('The Arm：等级已经是 1 就不降', () => {
        const blind = makeBlindState('bl_arm');
        let called = false;
        debuffHand(blind, [c('SK')], 'Pair', { handLevel: 1, levelDown: () => { called = true; } });
        expect(called).toBe(false);
        expect(blind.triggered).toBe(false);
    });

    it('The Ox：打出最常用牌型就清空钱，但**返回 false**', () => {
        const blind = makeBlindState('bl_ox');
        let broke = false;
        const r = debuffHand(blind, [c('SK')], 'Pair', {
            mostPlayedHand: 'Pair',
            loseAllMoney: () => { broke = true; },
        });
        expect(r).toBe(false);
        expect(broke).toBe(true);
    });

    it('The Ox：打别的牌型不扣钱', () => {
        let broke = false;
        debuffHand(makeBlindState('bl_ox'), [c('SK')], 'Flush', {
            mostPlayedHand: 'Pair',
            loseAllMoney: () => { broke = true; },
        });
        expect(broke).toBe(false);
    });
});

describe('Verdant Leaf：封掉所有扑克牌', () => {
    it('每种花色、每个点数都被封', () => {
        const blind = makeBlindState('bl_final_leaf');
        for (const spec of ['SK', 'HA', 'C2', 'DT']) {
            expect(debuffCard(blind, c(spec)), spec).toBe(true);
        }
    });

    it('被 disable 之后解封', () => {
        const blind = makeBlindState('bl_final_leaf');
        blind.disabled = true;
        expect(debuffCard(blind, c('SK'))).toBe(false);
    });
});

describe('drawn_to_hand：两个 showdown Boss', () => {
    it('Cerulean Bell 强制选中一张，且消费 RNG', () => {
        const blind = makeBlindState('bl_final_bell');
        const hand = ['SK', 'HK', 'D9', 'C4', 'D3'].map((x, i) => c(x, i));
        const rng = new PseudorandomState('TUTORIAL');
        const { forced } = drawnToHand(blind, hand, [], rng);
        expect(forced).toBeTruthy();
        expect(forced!.forced_selection).toBe(true);
        expect(rng.snapshot()).toHaveProperty('cerulean_bell');
    });

    it('Cerulean Bell 手里已经有强制牌就不再选', () => {
        const blind = makeBlindState('bl_final_bell');
        const hand = ['SK', 'HK'].map((x, i) => c(x, i));
        hand[0].forced_selection = true;
        const rng = new PseudorandomState('TUTORIAL');
        expect(drawnToHand(blind, hand, [], rng).forced).toBeNull();
        expect(Object.keys(rng.snapshot())).toHaveLength(0);
    });

    it('Crimson Heart 每回合 debuff 一张小丑，且**先把上一张解封**', () => {
        const blind = makeBlindState('bl_final_heart');
        const jokers = [makeJoker('j_joker'), makeJoker('j_jolly'), makeJoker('j_sly')];
        jokers[0].debuff = true; // 上一回合被封的那张

        const { debuffedJoker } = drawnToHand(blind, [c('SK')], jokers, new PseudorandomState('ALEEB'));
        expect(debuffedJoker).toBeTruthy();
        // 恰好一张被封
        expect(jokers.filter((j) => j.debuff)).toHaveLength(1);
        // 上一张已经解封（除非又抽中了它）
        expect(jokers.filter((j) => j.debuff)[0]).toBe(debuffedJoker);
    });

    it('drawn_to_hand **无条件**清 prepped —— The Fish 只盖一批就靠这个', () => {
        const blind = makeBlindState('bl_fish');
        expect(blind.prepped).toBe(true);
        drawnToHand(blind, [c('SK')], [], new PseudorandomState('X'));
        expect(blind.prepped).toBe(false);
    });
});

describe('modify_hand', () => {
    it('Ante 1 的 8 个 Boss 一个都不改基础值', () => {
        for (const name of ANTE_1_BOSSES) {
            const key = Object.entries(BLIND_CENTERS).find(([, b]) => b.name === name)![0];
            expect(modifyHand(makeBlindState(key), 4, 35), name).toEqual({ mult: 4, handChips: 35 });
        }
    });

    it('28 个 Boss 里只有 The Flint 改基础值', () => {
        const changers = Object.entries(BLIND_CENTERS)
            .filter(([, b]) => b.boss)
            .filter(([k]) => {
                const r = modifyHand(makeBlindState(k), 4, 35);
                return r.mult !== 4 || r.handChips !== 35;
            })
            .map(([, b]) => b.name);
        expect(changers).toEqual(['The Flint']);
    });

    it('The Wall 与 Violet Vessel 改的是**需求**，不走 modify_hand', () => {
        expect(BLIND_CENTERS.bl_wall.mult).toBe(4);
        expect(BLIND_CENTERS.bl_final_vessel.mult).toBe(6);
        expect(modifyHand(makeBlindState('bl_wall'), 4, 35)).toEqual({ mult: 4, handChips: 35 });
    });

    it('The Flint 砍半，且是四舍五入不是截断：mult 5 → 3、chips 35 → 18', () => {
        const blind = makeBlindState('bl_flint');
        expect(modifyHand(blind, 5, 35)).toEqual({ mult: 3, handChips: 18 });
    });

    it('The Flint 的 mult 下限是 1', () => {
        expect(modifyHand(makeBlindState('bl_flint'), 1, 0)).toEqual({ mult: 1, handChips: 0 });
    });
});

describe('实现名单这道闸', () => {
    it('28 个 Boss 全在名单里', () => {
        for (const [key, center] of Object.entries(BLIND_CENTERS)) {
            expect(() => assertImplemented(center), key).not.toThrow();
        }
    });

    it('小盲注／大盲注不是 Boss，直接过', () => {
        expect(() => assertImplemented(BLIND_CENTERS.bl_small)).not.toThrow();
        expect(() => assertImplemented(BLIND_CENTERS.bl_big)).not.toThrow();
    });

    it('冒出一个名单外的 Boss 会抛——这是「有数值没行为」那条教训的落点', () => {
        expect(() =>
            assertImplemented({ ...BLIND_CENTERS.bl_ox, name: 'The Nonexistent' }),
        ).toThrow(/The Nonexistent/);
    });
});

describe('生成的数据本身', () => {
    it('30 条 = 小盲注 + 大盲注 + 28 个 Boss', () => {
        const all = Object.values(BLIND_CENTERS);
        expect(all).toHaveLength(30);
        expect(all.filter((b) => b.boss)).toHaveLength(28);
    });
});
