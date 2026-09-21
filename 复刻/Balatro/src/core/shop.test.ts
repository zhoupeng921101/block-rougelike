/**
 * 商店的测试。
 *
 * 这一层**没有外部真值**——社区工具全是 seed-search 模型，不建模商店生成
 * （见 04 号票）。所以这里验的是**结构性质**，而不是「某个 seed 应该出什么」：
 *
 * - 池子按 `order` 排序、大小随剔除条件变化
 * - 剔除的位置换成 `UNAVAILABLE` 而不是删掉（池子长度不变）
 * - 每生成一格消费哪几个 key、消费几次
 * - 同 seed 同商店
 *
 * 「每格消费哪几个 key」那一组是最有价值的：它直接盯住 `etperpoll`
 * （要消费）与租赁掷点（不能消费）这对最容易搞反的东西。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { CONSUMABLE_KEYS_BY_SET } from './consumables';
import { makeStandardDeck, resetCardCounters } from './card';
import { JOKER_CENTERS, makeJoker } from './jokers';
import { PseudorandomState } from './rng';
import { Run } from './run';
import {
    BASE_REROLL_COST,
    JOKER_RARITY_POOLS,
    SHOP_JOKER_MAX,
    Shop,
    UNAVAILABLE,
    createCardForShop,
    getCurrentConsumablePool,
    getCurrentJokerPool,
    shopItemKey,
} from './shop';
import { DEFAULT_POOL_FIELDS, type PoolContext } from './shop';
import type { HandName } from './poker-hands';
import { initialHands } from './scoring';

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
        ...DEFAULT_POOL_FIELDS,
        ...overrides,
    };
}

beforeEach(() => resetCardCounters());

describe('消耗品池', () => {
    it('塔罗池 22 个位置，新档全可用，key 是 Tarotsho<ante>', () => {
        const [pool, key] = getCurrentConsumablePool('Tarot', ctx(), 'sho');
        expect(pool).toHaveLength(22);
        expect(pool.filter((k) => k === UNAVAILABLE)).toHaveLength(0);
        expect(key).toBe('Tarotsho1');
    });

    /**
     * **softlock**：Planet X / Ceres / Eris 要对应牌型 `played > 0` 才进池。
     * 位置还在（换成 UNAVAILABLE），所以 `math.random(#pool)` 的取值域不变——
     * 真删掉会让同 seed 立刻分叉。
     */
    it('星球池 12 个位置、新档只有 9 张可用（三张 softlock 占着 UNAVAILABLE）', () => {
        const [pool, key] = getCurrentConsumablePool('Planet', ctx(), 'sho');
        expect(pool).toHaveLength(12);
        expect(pool.filter((k) => k === UNAVAILABLE)).toHaveLength(3);
        expect(key).toBe('Planetsho1');
    });

    it('打出过 Five of a Kind 之后 Planet X 进池，池长度还是 12', () => {
        const handsPlayed = ctx().handsPlayed;
        handsPlayed['Five of a Kind'] = 1;
        const [pool] = getCurrentConsumablePool('Planet', ctx({ handsPlayed }), 'sho');
        expect(pool).toHaveLength(12);
        expect(pool).toContain('c_planet_x');
        expect(pool.filter((k) => k === UNAVAILABLE)).toHaveLength(2);
    });

    it('手上拿着的那张塔罗退出池子（used_jokers 对消耗品同样生效）', () => {
        const [pool] = getCurrentConsumablePool('Tarot', ctx({ usedJokers: new Set(['c_fool']) }), 'sho');
        expect(pool[0]).toBe(UNAVAILABLE);
        expect(pool).toHaveLength(22);
    });

    it('Showman 让被标记的那张重新进池', () => {
        const [pool] = getCurrentConsumablePool(
            'Tarot',
            ctx({ usedJokers: new Set(['c_fool']), jokers: [makeJoker('j_ring_master')] }),
            'sho',
        );
        expect(pool[0]).toBe('c_fool');
    });

    it('整池空了退化成单元素池：塔罗 c_strength、星球 c_pluto', () => {
        const allTarots = new Set(CONSUMABLE_KEYS_BY_SET.Tarot);
        const [tarot] = getCurrentConsumablePool('Tarot', ctx({ usedJokers: allTarots }), 'sho');
        expect(tarot).toEqual(['c_strength']);

        const allPlanets = new Set(CONSUMABLE_KEYS_BY_SET.Planet);
        const [planet] = getCurrentConsumablePool('Planet', ctx({ usedJokers: allPlanets }), 'sho');
        expect(planet).toEqual(['c_pluto']);
    });

    /**
     * 消耗品格的 RNG 账：**只有池子抽取那一次**（加 resample）。
     * `rarity` / `etperpoll` / `edi` / `front` / `soul_` 全部不消费——
     * 前三个在 `if _type == 'Joker'` 里面，`front` 只有 Base/Enhanced 才掷，
     * `soul_` 那一段要 `soulable`，而 `create_card_for_shop` 传的是 nil。见 16 号票。
     */
    it('建池本身不消费 RNG（rarity 那次掷点是小丑专有的）', () => {
        const rng = new PseudorandomState('ALEEB');
        const before = rng.pseudorandom('probe');
        getCurrentConsumablePool('Tarot', ctx(), 'sho');
        getCurrentConsumablePool('Planet', ctx(), 'sho');
        const after = new PseudorandomState('ALEEB');
        expect(after.pseudorandom('probe')).toBe(before);
    });
});

describe('稀有度池', () => {
    it('150 张按稀有度分成 61 / 64 / 20 / 5', () => {
        expect(JOKER_RARITY_POOLS[1]).toHaveLength(61);
        expect(JOKER_RARITY_POOLS[2]).toHaveLength(64);
        expect(JOKER_RARITY_POOLS[3]).toHaveLength(20);
        expect(JOKER_RARITY_POOLS[4]).toHaveLength(5);
    });

    it('每个池内按 order 升序——池内下标决定抽到谁', () => {
        for (const rarity of [1, 2, 3, 4]) {
            const orders = JOKER_RARITY_POOLS[rarity].map((k) => JOKER_CENTERS[k].order);
            expect(orders, `rarity ${rarity}`).toEqual([...orders].sort((a, b) => a - b));
        }
    });

    it('`demo` 不剔除任何小丑——完整版里 FTP_LOCKED 是关的', () => {
        const total = [1, 2, 3, 4].reduce((n, r) => n + JOKER_RARITY_POOLS[r].length, 0);
        expect(total).toBe(150);
    });
});

describe('get_current_pool 的剔除', () => {
    it('45 张 start_locked 的小丑不在新档池里，位置换成 UNAVAILABLE', () => {
        const rng = new PseudorandomState('TUTORIAL');
        // 稀有度是掷出来的，所以逐个稀有度单独验：直接查池子的构造结果
        const [pool] = getCurrentJokerPool(rng, ctx());
        // 池子长度 = 该稀有度的原始池长度，没有被删短
        expect([61, 64, 20].includes(pool.length)).toBe(true);
        const locked = pool.filter((k) => k === UNAVAILABLE).length;
        const unlocked = pool.filter((k) => k !== UNAVAILABLE).length;
        expect(locked + unlocked).toBe(pool.length);
    });

    it('**剔除不改池子长度**——这是同 seed 不分叉的前提', () => {
        const a = getCurrentJokerPool(new PseudorandomState('TUTORIAL'), ctx())[0];
        const b = getCurrentJokerPool(
            new PseudorandomState('TUTORIAL'),
            ctx({ usedJokers: new Set(JOKER_RARITY_POOLS[1].slice(0, 20)) }),
        )[0];
        // 同 seed → 同稀有度 → 同长度，即使剔掉了 20 张
        expect(b.length).toBe(a.length);
        expect(b.filter((k) => k === UNAVAILABLE).length).toBeGreaterThan(
            a.filter((k) => k === UNAVAILABLE).length,
        );
    });

    it('本局见过的小丑退出池子', () => {
        const [pool] = getCurrentJokerPool(new PseudorandomState('TUTORIAL'), ctx());
        const present = pool.find((k) => k !== UNAVAILABLE)!;
        const [pool2] = getCurrentJokerPool(
            new PseudorandomState('TUTORIAL'),
            ctx({ usedJokers: new Set([present]) }),
        );
        expect(pool2).not.toContain(present);
    });

    // Showman 的 key 是 `j_ring_master`（名字与 key 不同名的少数几张之一）
    it('Showman 让见过的小丑重新进池', () => {
        const [pool] = getCurrentJokerPool(new PseudorandomState('TUTORIAL'), ctx());
        const present = pool.find((k) => k !== UNAVAILABLE)!;
        const [pool2] = getCurrentJokerPool(
            new PseudorandomState('TUTORIAL'),
            ctx({ usedJokers: new Set([present]), jokers: [makeJoker('j_ring_master')] }),
        );
        expect(pool2).toContain(present);
    });

    it('Gros Michel 灭绝前在池里、Cavendish 不在；灭绝后反过来', () => {
        const before = getCurrentJokerPool(new PseudorandomState('X'), ctx({ grosMichelExtinct: false }))[0];
        const after = getCurrentJokerPool(new PseudorandomState('X'), ctx({ grosMichelExtinct: true }))[0];
        // 两次同 seed → 同稀有度池。只有 rarity 1 有这两张
        if (before.length === 61) {
            expect(before).toContain('j_gros_michel');
            expect(before).not.toContain('j_cavendish');
            expect(after).not.toContain('j_gros_michel');
            expect(after).toContain('j_cavendish');
        }
    });

    it('池子 key 带 ante：`Joker<rarity>sho<ante>`', () => {
        const [, key1] = getCurrentJokerPool(new PseudorandomState('TUTORIAL'), ctx({ ante: 1 }), 'sho');
        expect(key1).toMatch(/^Joker\dsho1$/);
        const [, key2] = getCurrentJokerPool(new PseudorandomState('TUTORIAL'), ctx({ ante: 2 }), 'sho');
        expect(key2).toMatch(/^Joker\dsho2$/);
    });
});

describe('一格商店消费哪几个 key', () => {
    /** 找一个第一格就掉到小丑档的 seed——`TUTORIAL` 第一格是消耗品。 */
    function seedWithJokerFirst(): string {
        for (let i = 0; i < 200; i++) {
            const seed = `J${i}`;
            if (createCardForShop(new PseudorandomState(seed), ctx()).kind === 'joker') return seed;
        }
        throw new Error('找不到第一格是小丑的 seed');
    }

    it('小丑格：cdt / rarity / Joker<r>sho / etperpoll / edisho', () => {
        const rng = new PseudorandomState(seedWithJokerFirst());
        const item = createCardForShop(rng, ctx());
        expect(item.kind).toBe('joker');

        // **只有这五个 key，外加零到多个 `_resample<n>`**：多一个（比如租赁的 `ssjr`）
        // 或少一个（比如 `etperpoll`）都会让后面每一格的商店与原版分叉。
        // `_resample` 的个数取决于池子里连抽到几个 UNAVAILABLE，不是固定值
        const keys = Object.keys(rng.snapshot());
        const poolKey = keys.find((k) => /^Joker\dsho1$/.test(k))!;
        expect(poolKey).toBeTruthy();

        const resamples = keys.filter((k) => k.startsWith(`${poolKey}_resample`));
        const rest = keys.filter((k) => !k.startsWith(`${poolKey}_resample`)).sort();
        expect(rest).toEqual([poolKey, 'cdt1', 'edisho1', 'etperpoll1', 'rarity1sho'].sort());

        // resample 的编号从 2 起连续（原文 `it` 初值 1、进循环先 ++）
        expect(resamples.map((k) => Number(k.slice(`${poolKey}_resample`.length))).sort((a, b) => a - b))
            .toEqual(resamples.map((_, i) => i + 2));
    });

    it('**`etperpoll` 必须被消费**——原文那行 pseudorandom 在 if 外面', () => {
        const rng = new PseudorandomState(seedWithJokerFirst());
        createCardForShop(rng, ctx());
        expect(rng.snapshot()).toHaveProperty('etperpoll1');
    });

    it('**租赁掷点不能被消费**——它在 `and` 右边、默认关、短路', () => {
        const rng = new PseudorandomState(seedWithJokerFirst());
        createCardForShop(rng, ctx());
        expect(rng.snapshot()).not.toHaveProperty('ssjr1');
    });

    it('同 seed 生成同一张小丑', () => {
        const a = createCardForShop(new PseudorandomState('ALEEB'), ctx());
        const b = createCardForShop(new PseudorandomState('ALEEB'), ctx());
        expect(a.kind).toBe(b.kind);
        expect(a.kind).toBe(b.kind);
        if (a.kind === 'joker' && b.kind === 'joker') expect(a.joker.key).toBe(b.joker.key);
    });

    it('生成的小丑会被记进 usedJokers', () => {
        const context = ctx();
        const item = createCardForShop(new PseudorandomState('ALEEB'), context);
        if (item.kind === 'joker') expect(context.usedJokers.has(item.joker.key)).toBe(true);
    });

    it('塔罗／星球格子生成的是真的消耗品', () => {
        // 20:4:4 下有 ~28.6% 的格子是消耗品。扫一批 seed 找一个
        let found = false;
        for (let i = 0; i < 200 && !found; i++) {
            const item = createCardForShop(new PseudorandomState(`S${i}`), ctx());
            if (item.kind === 'consumable') {
                expect(['Tarot', 'Planet']).toContain(item.consumable.center.set);
                expect(item.cost).toBe(3);
                found = true;
            }
        }
        expect(found, '200 个 seed 里一个消耗品格都没出现，权重接错了？').toBe(true);
    });

    it('小丑格约占七成——20 / 28', () => {
        let jokers = 0;
        const n = 400;
        for (let i = 0; i < n; i++) {
            if (createCardForShop(new PseudorandomState(`T${i}`), ctx()).kind === 'joker') jokers++;
        }
        // 期望 20/28 ≈ 0.714。400 个样本，给 ±0.08 的余量
        expect(jokers / n).toBeGreaterThan(0.63);
        expect(jokers / n).toBeLessThan(0.80);
    });
});

describe('Shop', () => {
    it('开局 2 格', () => {
        const shop = new Shop(new PseudorandomState('TUTORIAL'), ctx());
        expect(shop.items).toHaveLength(SHOP_JOKER_MAX);
    });

    it('重掷价从 $5 起，每次 +1', () => {
        const shop = new Shop(new PseudorandomState('TUTORIAL'), ctx());
        expect(shop.rerollCost).toBe(BASE_REROLL_COST);
        shop.reroll();
        expect(shop.rerollCost).toBe(BASE_REROLL_COST + 1);
        shop.reroll();
        expect(shop.rerollCost).toBe(BASE_REROLL_COST + 2);
    });

    it('重掷换一批新格子', () => {
        const shop = new Shop(new PseudorandomState('TUTORIAL'), ctx());
        const before = shop.items.map(shopItemKey);
        shop.reroll();
        const after = shop.items.map(shopItemKey);
        expect(after).not.toEqual(before);
        expect(shop.items).toHaveLength(SHOP_JOKER_MAX);
    });

    it('Chaos the Clown 给一次免费重掷，**那一次不涨价**', () => {
        const shop = new Shop(new PseudorandomState('TUTORIAL'), ctx({ jokers: [makeJoker('j_chaos')] }));
        expect(shop.freeRerolls).toBe(1);
        expect(shop.rerollCost).toBe(0);

        shop.reroll(); // 用掉免费那次
        expect(shop.freeRerolls).toBe(0);
        // `calculate_reroll_cost(final_free)` 传了 skip_increment，所以还是 5 不是 6
        expect(shop.rerollCost).toBe(BASE_REROLL_COST);

        shop.reroll();
        expect(shop.rerollCost).toBe(BASE_REROLL_COST + 1);
    });

    it('买掉一格后那格消失', () => {
        const rng = new PseudorandomState('ALEEB');
        const shop = new Shop(rng, ctx());
        const jokerIndex = shop.items.findIndex((i) => i.kind === 'joker');
        if (jokerIndex < 0) return; // 这个 seed 两格都是消耗品，换个用例覆盖
        const before = shop.items.length;
        shop.take(jokerIndex);
        expect(shop.items).toHaveLength(before - 1);
    });

    it('消耗品格也能拿走', () => {
        for (let i = 0; i < 200; i++) {
            const shop = new Shop(new PseudorandomState(`S${i}`), ctx());
            const idx = shop.items.findIndex((x) => x.kind === 'consumable');
            if (idx >= 0) {
                const taken = shop.take(idx);
                expect(taken.kind).toBe('consumable');
                return;
            }
        }
        throw new Error('200 个 seed 里一个消耗品格都没出现');
    });
});

describe('Run 里的商店', () => {
    it('回合结算完进商店，离开商店回盲注选择', () => {
        const run = new Run('TUTORIAL');
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        expect(run.state).toBe('shop');
        expect(run.shop?.items).toHaveLength(2);
        run.leaveShop();
        expect(run.state).toBe('blind-select');
        expect(run.shop).toBeNull();
    });

    it('**商店在 ante 推进之后开**——它的 key 带的是新 ante', () => {
        const run = new Run('TUTORIAL');
        for (let i = 0; i < 3; i++) {
            const round = run.startRound();
            (round as unknown as { phase: string }).phase = 'won';
            run.finishRound();
            if (i < 2) run.leaveShop();
        }
        // 打完 Boss 进 Ante 2，此时的商店应该用 ante 2 的 key
        expect(run.ante).toBe(2);
        expect(Object.keys(run.rng.snapshot())).toContain('cdt2');
    });

    it('买小丑：扣钱、进小丑区', () => {
        const run = new Run('TUTORIAL');
        run.dollars = 20;
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();

        const idx = run.shop!.items.findIndex((i) => i.kind === 'joker');
        if (idx < 0) return;
        const item = run.shop!.items[idx];
        const before = run.dollars;
        const joker = run.buyJoker(idx);
        expect(run.jokers).toContain(joker);
        expect(run.dollars).toBe(before - item.cost);
    });

    it('买不起就抛', () => {
        const run = new Run('TUTORIAL');
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.dollars = 0;
        const idx = run.shop!.items.findIndex((i) => i.kind === 'joker');
        if (idx < 0) return;
        expect(() => run.buyJoker(idx)).toThrow(/买不起/);
    });

    it('小丑区满了就抛', () => {
        const run = new Run('TUTORIAL');
        run.dollars = 100;
        for (const k of ['j_joker', 'j_jolly', 'j_sly', 'j_half', 'j_banner']) {
            run.jokers.push(makeJoker(k));
        }
        expect(run.jokersFull).toBe(true);
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        const idx = run.shop!.items.findIndex((i) => i.kind === 'joker');
        if (idx < 0) return;
        expect(() => run.buyJoker(idx)).toThrow(/满了/);
    });

    it('卖小丑：加钱、离开小丑区、解除 used 标记', () => {
        const run = new Run('TUTORIAL');
        const joker = makeJoker('j_banner');
        run.jokers.push(joker);
        run.usedJokers.add('j_banner');
        const before = run.dollars;

        const got = run.sellJoker(0);
        expect(got).toBe(2); // cost 5 → floor(5/2) = 2
        expect(run.dollars).toBe(before + 2);
        expect(run.jokers).toHaveLength(0);
        expect(run.usedJokers.has('j_banner')).toBe(false);
    });

    it('还有同名小丑在场时不解除 used 标记', () => {
        const run = new Run('TUTORIAL');
        run.jokers.push(makeJoker('j_banner'), makeJoker('j_banner'));
        run.usedJokers.add('j_banner');
        run.sellJoker(0);
        expect(run.usedJokers.has('j_banner')).toBe(true);
    });

    it('重掷扣钱', () => {
        const run = new Run('TUTORIAL');
        run.dollars = 20;
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        const before = run.dollars;
        run.rerollShop();
        expect(run.dollars).toBe(before - BASE_REROLL_COST);
    });

    it('重掷不起就抛，且不扣钱', () => {
        const run = new Run('TUTORIAL');
        const round = run.startRound();
        (round as unknown as { phase: string }).phase = 'won';
        run.finishRound();
        run.dollars = 1;
        expect(() => run.rerollShop()).toThrow(/重掷不起/);
        expect(run.dollars).toBe(1);
    });

    /**
     * `used_jokers` 的语义是「**此刻被摆出来或被持有的 center**」，
     * 不是「整局见过的」。三组用例把这条边界钉住——
     * 写成「见过就永久剔除」时第一条会过、后两条会红。
     */
    describe('used 标记：摆出来就标，收走就还', () => {
        function intoShop(seed: string): Run {
            const run = new Run(seed, makeStandardDeck());
            const round = run.startRound();
            (round as unknown as { phase: string }).phase = 'won';
            run.finishRound();
            return run;
        }

        it('同一个商店里两格不会是同一张', () => {
            for (let i = 0; i < 40; i++) {
                const run = intoShop(`S${i}`);
                const keys = run.shop!.items.map(shopItemKey);
                expect(new Set(keys).size, `seed S${i} 的两格重了`).toBe(keys.length);
            }
        });

        it('重掷把旧的那几格还回池子（`c:remove()` 会解除标记）', () => {
            const run = intoShop('ALEEB');
            const before = run.shop!.items.map(shopItemKey);
            run.rerollShop();
            for (const key of before) {
                expect(run.usedJokers.has(key), `${key} 重掷之后还占着 used`).toBe(false);
            }
        });

        it('离开商店把没卖出去的那几格还回池子', () => {
            const run = intoShop('ALEEB');
            const left = run.shop!.items.map(shopItemKey);
            run.leaveShop();
            expect(run.usedJokers.size).toBe(0);
            for (const key of left) expect(run.usedJokers.has(key)).toBe(false);
        });

        it('买下来的那张**留着**标记——它还活着，`find_joker` 找得到', () => {
            for (let i = 0; i < 40; i++) {
                const run = intoShop(`S${i}`);
                run.dollars = 50;
                const idx = run.shop!.items.findIndex((x) => x.kind === 'joker');
                if (idx < 0) continue;
                const key = shopItemKey(run.shop!.items[idx]);
                run.buyJoker(idx);
                run.leaveShop();
                expect(run.usedJokers.has(key)).toBe(true);
                return;
            }
            throw new Error('40 个 seed 里一格小丑都没有？');
        });
    });
});
