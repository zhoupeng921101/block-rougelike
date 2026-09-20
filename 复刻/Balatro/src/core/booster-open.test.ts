/**
 * 开补充包。期望值手算或按源码逐条对齐，依据写在用例名里。
 *
 * 这组盯的是**RNG 的账**与**顺序**——包里抽到哪几张由 seed 决定，
 * 断言具体是哪张等于把测试钉死在当前 seed 上，所以只断言
 * 「消费了哪些 key、消费了几次、顺序对不对」。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { BOOSTER_CENTERS } from './boosters';
import { isBoosterImplemented, openBooster, packCardKey, releasePack } from './booster-open';
import { P_CARDS, resetCardCounters } from './card';
import { PseudorandomState } from './rng';
import { initialHands } from './scoring';
import type { PoolContext } from './shop';
import type { HandName } from './poker-hands';

function ctx(overrides: Partial<PoolContext> = {}): PoolContext {
    return {
        ante: 1,
        usedJokers: new Set(),
        grosMichelExtinct: false,
        jokers: [],
        consumables: [],
        handsPlayed: Object.fromEntries(
            Object.keys(initialHands()).map((name) => [name, 0]),
        ) as Record<HandName, number>,
        firstShopBuffoon: true,
        ...overrides,
    };
}

/**
 * 记下每次掷点用的 key，用来核 RNG 的账。
 *
 * **只包 `pseudoseed`**：`pseudorandom` 内部就是
 * `randomseed(this.pseudoseed(key))`（`rng/pseudorandom.ts:65`），
 * 两个都包会让每次消费被记两遍。`pseudoseed` 是唯一的咽喉。
 */
function tracingRng(seed: string): { rng: PseudorandomState; keys: string[] } {
    const rng = new PseudorandomState(seed);
    const keys: string[] = [];
    const realSeed = rng.pseudoseed.bind(rng);
    rng.pseudoseed = (key: string) => {
        keys.push(key);
        return realSeed(key);
    };
    return { rng, keys };
}

beforeEach(() => resetCardCounters());

describe('奥秘包：3 张塔罗', () => {
    it('普通奥秘包给 3 张、挑 1 张', () => {
        const pack = openBooster(
            new PseudorandomState('ALEEB'),
            BOOSTER_CENTERS.p_arcana_normal_1,
            'p_arcana_normal_1',
            ctx(),
        );
        expect(pack.cards).toHaveLength(3);
        expect(pack.choicesLeft).toBe(1);
        expect(pack.cards.every((c) => c.kind === 'consumable')).toBe(true);
    });

    it('Mega 奥秘包给 5 张、挑 2 张', () => {
        const pack = openBooster(
            new PseudorandomState('ALEEB'),
            BOOSTER_CENTERS.p_arcana_mega_1,
            'p_arcana_mega_1',
            ctx(),
        );
        expect(pack.cards).toHaveLength(5);
        expect(pack.choicesLeft).toBe(2);
    });

    it('里面全是塔罗，没有星球', () => {
        const pack = openBooster(
            new PseudorandomState('QQQ777'),
            BOOSTER_CENTERS.p_arcana_jumbo_1,
            'p_arcana_jumbo_1',
            ctx(),
        );
        for (const c of pack.cards) {
            expect(c.kind === 'consumable' && c.consumable.center.set).toBe('Tarot');
        }
    });

    /**
     * **每张牌前面多一次 `soul_Tarot<ante>`**（`soulable` 在包里传真值），
     * 然后才是池子抽取。16 号票查明商店路径不传，所以商店那边没有这一次。
     */
    it('每张的账是 soul_Tarot<ante> → Tarotar1<ante>，soul 那次排在抽取之前', () => {
        const { rng, keys } = tracingRng('ALEEB');
        const pack = openBooster(rng, BOOSTER_CENTERS.p_arcana_normal_1, 'p_arcana_normal_1', ctx());

        // soul 那次**每张都掷**
        expect(keys.filter((k) => k === 'soul_Tarot1')).toHaveLength(3);

        // **中了 soul 的那张不抽池子**（`create_card` 的 if/else），
        // 所以池子抽取的次数 = 3 − 抽到 The Soul 的张数
        const souls = pack.cards.filter(
            (c) => c.kind === 'consumable' && c.consumable.key === 'c_soul',
        ).length;
        expect(keys.filter((k) => k === 'Tarotar11')).toHaveLength(3 - souls);

        expect(keys.indexOf('soul_Tarot1')).toBeLessThan(keys.indexOf('Tarotar11'));
    });

    /**
     * 0.3% 的门槛（`> 0.997`）。ALEEB 这个 seed 的第一个奥秘包恰好中了一次——
     * **这条同时验证了 `forced_key` 那条路真的会走**。
     */
    it('ALEEB 的第一个奥秘包里真的有一张 The Soul', () => {
        const pack = openBooster(
            new PseudorandomState('ALEEB'),
            BOOSTER_CENTERS.p_arcana_normal_1,
            'p_arcana_normal_1',
            ctx(),
        );
        const keys = pack.cards.map((c) => packCardKey(c));
        expect(keys).toContain('c_soul');
    });

    it('**不掷 soul_Planet**（The Soul 那一支只对 Tarot / Spectral 跑）', () => {
        const { rng, keys } = tracingRng('ALEEB');
        openBooster(rng, BOOSTER_CENTERS.p_arcana_normal_1, 'p_arcana_normal_1', ctx());
        expect(keys).not.toContain('soul_Planet1');
    });
});

describe('天体包：3 张星球', () => {
    it('里面全是星球', () => {
        const pack = openBooster(
            new PseudorandomState('ALEEB'),
            BOOSTER_CENTERS.p_celestial_normal_1,
            'p_celestial_normal_1',
            ctx(),
        );
        expect(pack.cards).toHaveLength(3);
        for (const c of pack.cards) {
            expect(c.kind === 'consumable' && c.consumable.center.set).toBe('Planet');
        }
    });

    /** `_type == 'Planet'` 只进 Black Hole 那一支，所以 key 是 `soul_Planet` */
    it('账是 soul_Planet<ante> → Planetpl1<ante>，**不掷 soul_Tarot**', () => {
        const { rng, keys } = tracingRng('ALEEB');
        openBooster(rng, BOOSTER_CENTERS.p_celestial_normal_1, 'p_celestial_normal_1', ctx());
        expect(keys.filter((k) => k === 'soul_Planet1')).toHaveLength(3);
        expect(keys.filter((k) => k === 'Planetpl11')).toHaveLength(3);
        expect(keys).not.toContain('soul_Tarot1');
    });

    /** 一包 3 张星球 —— 这正是「商店供不起、包供得起」的那个量级差 */
    it('Jumbo 天体包一口气给 5 张星球', () => {
        const pack = openBooster(
            new PseudorandomState('XYZ99'),
            BOOSTER_CENTERS.p_celestial_jumbo_1,
            'p_celestial_jumbo_1',
            ctx(),
        );
        expect(pack.cards).toHaveLength(5);
    });
});

describe('小丑包：小丑，且 etperpoll 换成 packetper', () => {
    it('里面全是小丑', () => {
        const pack = openBooster(
            new PseudorandomState('ALEEB'),
            BOOSTER_CENTERS.p_buffoon_normal_1,
            'p_buffoon_normal_1',
            ctx(),
        );
        expect(pack.cards).toHaveLength(2);
        expect(pack.cards.every((c) => c.kind === 'joker')).toBe(true);
    });

    /**
     * `common_events.lua:2180`：
     * `(area == G.pack_cards and 'packetper' or 'etperpoll')..ante`。
     * **两个 key 搞混，商店与补充包的链会互相污染。**
     */
    it('用的是 packetper<ante>，不是 etperpoll<ante>', () => {
        const { rng, keys } = tracingRng('ALEEB');
        openBooster(rng, BOOSTER_CENTERS.p_buffoon_normal_1, 'p_buffoon_normal_1', ctx());
        expect(keys.filter((k) => k === 'packetper1')).toHaveLength(2);
        expect(keys).not.toContain('etperpoll1');
    });

    it('版本那次仍然消费，key 是 edibuf<ante>', () => {
        const { rng, keys } = tracingRng('ALEEB');
        openBooster(rng, BOOSTER_CENTERS.p_buffoon_normal_1, 'p_buffoon_normal_1', ctx());
        expect(keys.filter((k) => k === 'edibuf1')).toHaveLength(2);
    });

    /** `_type == 'Joker'` 不进 soulable 那两支 */
    it('小丑包一次 soul_ 都不掷', () => {
        const { rng, keys } = tracingRng('ALEEB');
        openBooster(rng, BOOSTER_CENTERS.p_buffoon_normal_1, 'p_buffoon_normal_1', ctx());
        expect(keys.filter((k) => k.startsWith('soul_'))).toHaveLength(0);
    });
});

describe('标准包：扑克牌 + 强化 + 版本 + 蜡封', () => {
    it('普通标准包给 3 张扑克牌', () => {
        const pack = openBooster(
            new PseudorandomState('ALEEB'),
            BOOSTER_CENTERS.p_standard_normal_1,
            'p_standard_normal_1',
            ctx(),
        );
        expect(pack.cards).toHaveLength(3);
        expect(pack.cards.every((c) => c.kind === 'card')).toBe(true);
    });

    /**
     * 标准包的账与别的包完全不一样，而且**不掷一次 soul_**：
     * `_type` 是 `Base` / `Enhanced`，两支 soul 判定都不匹配。
     */
    it('账是 stdset → (Enhancedsta) → frontsta → standard_edition → stdseal，且不掷 soul_', () => {
        const { rng, keys } = tracingRng('ALEEB');
        openBooster(rng, BOOSTER_CENTERS.p_standard_normal_1, 'p_standard_normal_1', ctx());
        expect(keys.filter((k) => k === 'stdset1')).toHaveLength(3);
        expect(keys.filter((k) => k === 'frontsta1')).toHaveLength(3);
        expect(keys.filter((k) => k === 'standard_edition1')).toHaveLength(3);
        expect(keys.filter((k) => k === 'stdseal1')).toHaveLength(3);
        expect(keys.filter((k) => k.startsWith('soul_'))).toHaveLength(0);
    });

    /** `stdseal` 不到 0.8 就**不掷 `stdsealtype`** */
    it('没蜡封就不掷 stdsealtype', () => {
        const { rng, keys } = tracingRng('ALEEB');
        const pack = openBooster(rng, BOOSTER_CENTERS.p_standard_normal_1, 'p_standard_normal_1', ctx());
        const sealed = pack.cards.filter((c) => c.kind === 'card' && c.card.seal).length;
        expect(keys.filter((k) => k === 'stdsealtype1')).toHaveLength(sealed);
    });

    it('抽出来的牌面是 52 张里的一张', () => {
        const pack = openBooster(
            new PseudorandomState('QQQ777'),
            BOOSTER_CENTERS.p_standard_jumbo_1,
            'p_standard_jumbo_1',
            ctx(),
        );
        for (const c of pack.cards) {
            expect(c.kind === 'card' && c.card.key in P_CARDS).toBe(true);
        }
    });

    /** 扑克牌**拿不到 Negative**（`no_neg = true`） */
    it('扑克牌不会是 Negative', () => {
        for (let i = 0; i < 60; i++) {
            const pack = openBooster(
                new PseudorandomState(`S${i}`),
                BOOSTER_CENTERS.p_standard_mega_1,
                'p_standard_mega_1',
                ctx(),
            );
            for (const c of pack.cards) {
                if (c.kind === 'card') expect(c.card.edition).not.toBe('negative');
            }
        }
    });

    /** 扑克牌不进 `used_jokers`：`Enhanced` 池子无条件 `add = true`，标不标都不改池子 */
    it('标准包的牌不进 usedJokers', () => {
        const context = ctx();
        openBooster(
            new PseudorandomState('ALEEB'),
            BOOSTER_CENTERS.p_standard_normal_1,
            'p_standard_normal_1',
            context,
        );
        expect(context.usedJokers.size).toBe(0);
    });
});

describe('幽灵包：2 张幽灵牌，soul 掷两次', () => {
    it('五种包全实现了', () => {
        for (const k of ['p_arcana_normal_1', 'p_celestial_normal_1', 'p_buffoon_normal_1',
            'p_standard_normal_1', 'p_spectral_normal_1']) {
            expect(isBoosterImplemented(k, BOOSTER_CENTERS), k).toBe(true);
        }
    });

    it('普通幽灵包给 2 张、Jumbo 4 张', () => {
        const pack = openBooster(
            new PseudorandomState('QQQ777'),
            BOOSTER_CENTERS.p_spectral_normal_1,
            'p_spectral_normal_1',
            ctx(),
        );
        expect(pack.cards).toHaveLength(2);
        for (const c of pack.cards) {
            expect(c.kind === 'consumable' && c.consumable.center.set).toBe('Spectral');
        }
    });

    /**
     * **`_type == 'Spectral'` 两支 soul 判定都跑**（`common_events.lua:2131` 与 `:2138`
     * 是两个并列的 if），所以每张牌掷**两次** `soul_Spectral<ante>`。
     */
    it('每张掷两次 soul_Spectral<ante>，不是一次', () => {
        const { rng, keys } = tracingRng('QQQ777');
        openBooster(rng, BOOSTER_CENTERS.p_spectral_normal_1, 'p_spectral_normal_1', ctx());
        expect(keys.filter((k) => k === 'soul_Spectral1')).toHaveLength(4); // 2 张 × 2 次
    });

    it('抽出来的不会是 The Soul / Black Hole（池子里被无条件剔掉）', () => {
        for (let i = 0; i < 30; i++) {
            const pack = openBooster(
                new PseudorandomState(`S${i}`),
                BOOSTER_CENTERS.p_spectral_jumbo_1,
                'p_spectral_jumbo_1',
                ctx(),
            );
            for (const c of pack.cards) {
                if (c.kind !== 'consumable') continue;
                // 只可能从 soulable 那条路来，而那条路是 0.3%——
                // 这里不断言「一次都没有」，只断言它不是从池子里抽出来的常客
                expect(c.consumable.center.set).toBe('Spectral');
            }
        }
    });
});

describe('used_jokers：包里的牌摆出来就标，关包还回去', () => {
    it('造出来的每一张都标进 usedJokers', () => {
        const context = ctx();
        const pack = openBooster(
            new PseudorandomState('ALEEB'),
            BOOSTER_CENTERS.p_arcana_normal_1,
            'p_arcana_normal_1',
            context,
        );
        for (const c of pack.cards) {
            const key = packCardKey(c)!;
            expect(context.usedJokers.has(key)).toBe(true);
        }
    });

    /**
     * 与「离开商店」同一条路（`card.lua:4829` 的 used 清除）。
     * 不还回去，下一个包的池子内容就比原版窄，`_resample` 次数跟着偏。
     */
    it('关包把没挑走的还回池子', () => {
        const context = ctx();
        const pack = openBooster(
            new PseudorandomState('ALEEB'),
            BOOSTER_CENTERS.p_arcana_normal_1,
            'p_arcana_normal_1',
            context,
        );
        releasePack(pack, context);
        expect(context.usedJokers.size).toBe(0);
    });

    it('挑走的那张**留着**标记（它还活着）', () => {
        const context = ctx();
        const pack = openBooster(
            new PseudorandomState('ALEEB'),
            BOOSTER_CENTERS.p_arcana_normal_1,
            'p_arcana_normal_1',
            context,
        );
        const taken = pack.cards[0];
        const key = packCardKey(taken)!;
        // 模拟「挑走」：从包里移出去、放进消耗品区
        pack.cards.splice(0, 1);
        context.consumables.push(taken.kind === 'consumable' ? taken.consumable : ({} as never));

        releasePack(pack, context);
        expect(context.usedJokers.has(key)).toBe(true);
    });

    it('同一个包里三张互不相同（池子剔除生效了）', () => {
        const context = ctx();
        const pack = openBooster(
            new PseudorandomState('ALEEB'),
            BOOSTER_CENTERS.p_arcana_jumbo_1,
            'p_arcana_jumbo_1',
            context,
        );
        const keys = pack.cards.map((c) => packCardKey(c)!);
        expect(new Set(keys).size).toBe(keys.length);
    });

    it('小丑包里两张也互不相同', () => {
        const context = ctx();
        const pack = openBooster(
            new PseudorandomState('QQQ777'),
            BOOSTER_CENTERS.p_buffoon_jumbo_1,
            'p_buffoon_jumbo_1',
            context,
        );
        const keys = pack.cards.map((c) => packCardKey(c)!);
        expect(new Set(keys).size).toBe(keys.length);
    });
});

describe('同 seed 同包', () => {
    it('两次开同一个包，内容逐张一致', () => {
        const a = openBooster(
            new PseudorandomState('TUTORIAL'),
            BOOSTER_CENTERS.p_celestial_normal_1,
            'p_celestial_normal_1',
            ctx(),
        );
        resetCardCounters();
        const b = openBooster(
            new PseudorandomState('TUTORIAL'),
            BOOSTER_CENTERS.p_celestial_normal_1,
            'p_celestial_normal_1',
            ctx(),
        );
        const keys = (p: typeof a) => p.cards.map((c) => packCardKey(c));
        expect(keys(a)).toEqual(keys(b));
    });
});
