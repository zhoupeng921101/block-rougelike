/**
 * 小丑的计分测试。
 *
 * ## 期望值怎么来的
 *
 * **每一条都是手算的**，算式写在用例名里。基线公式：
 * `floor((牌型基础筹码 + Σ计分牌 nominal + Σ筹码加成) × 倍率)`，
 * 其中倍率按管线顺序逐个施加——**同一张牌上「加倍率」总是先于「乘倍率」**
 * （`state_events.lua:721` 起那串 `if` 的顺序），跨小丑则按小丑区从左到右。
 *
 * ## 为什么不用对拍
 *
 * 洗牌没有外部真值（04 号票），小丑更没有——社区工具全是 seed-search 模型，
 * 不建模结算。所以这一层只能靠「照源码手算 + 逐条留出处」。
 * 手算错了测试也会绿，所以**每条用例的算式必须写出来**，
 * 让下一个人能不跑代码就复核。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Card, type Suit, type Value, makeCard, resetCardCounters } from '../card';
import { type HandInfo, type HandName, evaluatePlay, initialHands } from '../scoring';
import { JOKER_CENTERS, JOKER_KEYS_BY_ORDER } from './centers.generated';
import { makeGameView } from './game-view';
import { makeJoker } from './instance';
import type { GameView, Joker } from './types';

function c(spec: string, x: number): Card {
    const suitMap: Record<string, Suit> = { S: 'Spades', H: 'Hearts', C: 'Clubs', D: 'Diamonds' };
    const valMap: Record<string, Value> = {
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        T: '10', J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace',
    };
    const card = makeCard(spec, suitMap[spec[0]], valMap[spec.slice(1)]);
    card.T.x = x;
    return card;
}

/** 按传入顺序铺 `T.x`，模拟手牌里从左到右。tile 单位，见 10 号票。 */
const hand = (...specs: string[]) => specs.map((s, i) => c(s, i * 2.05));

type Scene = {
    /** 打出去的牌 */
    play: string[];
    /** 留在手里没打出去的牌 */
    held?: string[];
    jokers?: string[];
    discardsLeft?: number;
    handsLeft?: number;
    deckCount?: number;
    /** 掷点桩。给一个常数就行——需要「命中」时给小于阈值的值 */
    roll?: number;
    hands?: Record<HandName, HandInfo>;
};

function run(scene: Scene): { score: number; dollars: number; view: GameView; jokers: Joker[] } {
    const jokers = (scene.jokers ?? []).map((k) => makeJoker(k));
    const hands = scene.hands ?? initialHands();
    const played = hand(...scene.play);
    const held = (scene.held ?? []).map((s, i) => c(s, 100 + i));

    const view = makeGameView({
        hands,
        jokers,
        handCards: held,
        deckCount: scene.deckCount ?? 0,
        current_round: {
            hands_left: scene.handsLeft ?? 3,
            discards_left: scene.discardsLeft ?? 3,
            hands_played: 0,
        },
        pseudorandom: () => {
            if (scene.roll === undefined) throw new Error('这个用例没给 roll，但有小丑要掷点');
            return scene.roll;
        },
    });

    const r = evaluatePlay(played, hands, view);
    return { score: r.score, dollars: r.dollars, view, jokers };
}

beforeEach(() => resetCardCounters());

// ————————————————————————————————————————————————————————————————
// main 分支的三条泛化判定。它们覆盖 10 张小丑，而那 10 张没有任何专属代码
// ————————————————————————————————————————————————————————————————

describe('main：泛化的 t_mult / t_chips / x_mult', () => {
    it('Jolly Joker（t_mult 8 / Pair）：(10 + 10+10) × (2+8) = 300', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_jolly'] }).score).toBe(300);
    });

    it('Jolly Joker 打不中牌型就不给：High Card 时 = (5+11) × 1 = 16', () => {
        expect(run({ play: ['SA', 'DQ', 'D9', 'C4', 'D3'], jokers: ['j_jolly'] }).score).toBe(16);
    });

    it('Sly Joker（t_chips 50 / Pair）：(10 + 50 + 10+10) × 2 = 160', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_sly'] }).score).toBe(160);
    });

    it('Cavendish（Xmult 3，无条件）：(10 + 10+10) × (2×3) = 180', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_cavendish'] }).score).toBe(180);
    });

    it('Droll Joker（t_mult 10 / Flush）：(35 + 11+10+10+5+4) × (4+10) = 1050', () => {
        expect(run({ play: ['HA', 'HK', 'HT', 'H5', 'H4'], jokers: ['j_droll'] }).score).toBe(1050);
    });
});

// ————————————————————————————————————————————————————————————————
// main 分支的名字判定
// ————————————————————————————————————————————————————————————————

describe('main：按名字的那些', () => {
    it('Joker（+4 mult）：(10 + 20) × (2+4) = 180', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_joker'] }).score).toBe(180);
    });

    it('Half Joker（≤3 张 +20 mult）：出 2 张 (10 + 20) × (2+20) = 660', () => {
        expect(run({ play: ['SK', 'HK'], jokers: ['j_half'] }).score).toBe(660);
    });

    it('Half Joker 出 4 张就不给：(10 + 20) × 2 = 60', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4'], jokers: ['j_half'] }).score).toBe(60);
    });

    it('Banner（每点剩余弃牌 +30 筹码）：3 次弃牌 → (10+20+90) × 2 = 240', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_banner'], discardsLeft: 3 }).score)
            .toBe(240);
    });

    it('Banner 弃牌用完就不给：(10+20) × 2 = 60', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_banner'], discardsLeft: 0 }).score)
            .toBe(60);
    });

    it('Mystic Summit（弃牌为 0 时 +15 mult）：(10+20) × (2+15) = 510', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_mystic_summit'], discardsLeft: 0 }).score)
            .toBe(510);
    });

    it('Mystic Summit 还剩弃牌就不给——判的是**相等**不是 <=', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_mystic_summit'], discardsLeft: 1 }).score)
            .toBe(60);
    });

    it('Abstract Joker（每张小丑 +3 mult，含自己）：1 张 → (10+20) × (2+3) = 150', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_abstract'] }).score).toBe(150);
    });

    it('Abstract Joker 数的是整个小丑区：2 张 → (10+20) × (2+6) = 240', () => {
        // 另一张挑 Splash：它在 calculate_joker 里没有任何代码，只被 find_joker 查，
        // 但会让**全部 5 张计分**——所以筹码也跟着变：(10 + 10+10+9+4+3) × 8
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_abstract', 'j_splash'] }).score)
            .toBe((10 + 10 + 10 + 9 + 4 + 3) * 8);
    });

    it('Supernova（+本局该牌型累计次数）：第一次打 Pair → (10+20) × (2+1) = 90', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_supernova'] }).score).toBe(90);
    });

    it('Supernova 第二次打同牌型：(10+20) × (2+2) = 120', () => {
        const hands = initialHands();
        run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_supernova'], hands });
        expect(run({ play: ['SQ', 'HQ', 'D9', 'C4', 'D3'], jokers: ['j_supernova'], hands }).score).toBe(120);
    });

    it('Blue Joker（牌堆每张 +2 筹码）：牌堆 10 张 → (10+20+20) × 2 = 100', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_blue_joker'], deckCount: 10 }).score)
            .toBe(100);
    });

    it('Misprint（掷 [0,23] 当 mult）：桩给 7 → (10+20) × (2+7) = 270', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_misprint'], roll: 7 }).score).toBe(270);
    });

    it('Gros Michel（+15 mult）：(10+20) × (2+15) = 510', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_gros_michel'] }).score).toBe(510);
    });

    it('Ice Cream（起始 100 筹码）：(10+20+100) × 2 = 260', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_ice_cream'] }).score).toBe(260);
    });
});

// ————————————————————————————————————————————————————————————————
// 小丑区的顺序。这是「一次结算里施加顺序」的唯一验收手段
// ————————————————————————————————————————————————————————————————

describe('小丑区从左到右施加，顺序改结果', () => {
    it('[Joker, Cavendish]：先 +4 再 ×3 → 30 × ((2+4)×3) = 540', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_joker', 'j_cavendish'] }).score)
            .toBe(540);
    });

    it('[Cavendish, Joker]：先 ×3 再 +4 → 30 × (2×3+4) = 300', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_cavendish', 'j_joker'] }).score)
            .toBe(300);
    });
});

// ————————————————————————————————————————————————————————————————
// individual + cardarea play —— 管线第 11 步
// ————————————————————————————————————————————————————————————————

describe('逐张计分牌（cardarea = play）', () => {
    it('Scholar（A：+20 筹码 +4 mult）：一对 A → (10 + 11+20 + 11+20) × (2+4+4) = 720', () => {
        expect(run({ play: ['SA', 'HA', 'D9', 'C4', 'D3'], jokers: ['j_scholar'] }).score).toBe(720);
    });

    it('Walkie Talkie（10 或 4）：一对 10 → (10 + 10+10 + 10+10) × (2+4+4) = 500', () => {
        expect(run({ play: ['ST', 'HT', 'D9', 'C4', 'D3'], jokers: ['j_walkie_talkie'] }).score).toBe(500);
    });

    it('Walkie Talkie 对 J 不给——命中的是点数 10 与 4，不是「10 与人头」', () => {
        expect(run({ play: ['SJ', 'HJ', 'D9', 'C4', 'D3'], jokers: ['j_walkie_talkie'] }).score).toBe(60);
    });

    it('Even Steven（偶数 ≤10 +4 mult）：一对 4 → (10 + 4+4) × (2+4+4) = 180', () => {
        expect(run({ play: ['S4', 'H4', 'D9', 'C7', 'D3'], jokers: ['j_even_steven'] }).score).toBe(180);
    });

    it('Even Steven 对 10 也算（10 是偶数）：(10 + 10+10) × 10 = 300', () => {
        expect(run({ play: ['ST', 'HT', 'D9', 'C7', 'D3'], jokers: ['j_even_steven'] }).score).toBe(300);
    });

    it('Odd Todd（奇数 ≤10 或 A，+31 筹码）：一对 3 → (10 + 3+31 + 3+31) × 2 = 156', () => {
        expect(run({ play: ['S3', 'H3', 'D9', 'C4', 'D6'], jokers: ['j_odd_todd'] }).score).toBe(156);
    });

    it('Odd Todd 把 A 算作奇数：一对 A → (10 + 11+31 + 11+31) × 2 = 188', () => {
        expect(run({ play: ['SA', 'HA', 'D9', 'C4', 'D6'], jokers: ['j_odd_todd'] }).score).toBe(188);
    });

    it('Scary Face（人头牌 +30 筹码）：一对 K → (10 + 10+30 + 10+30) × 2 = 180', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_scary_face'] }).score).toBe(180);
    });

    it('Smiley Face（人头牌 +5 mult）：一对 K → (10+20) × (2+5+5) = 360', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_smiley'] }).score).toBe(360);
    });

    it('Greedy Joker（每张方块 +3 mult）：DK+HK 只有一张方块 → (10+20) × (2+3) = 150', () => {
        expect(run({ play: ['DK', 'HK', 'S9', 'C4', 'S3'], jokers: ['j_greedy_joker'] }).score).toBe(150);
    });

    it('Lusty Joker 认红桃——四张「花色 mult」走的是同一条按 effect 分发的代码', () => {
        // HK 是红桃、DK 不是 → 只加一次 3：(10+20) × (2+3) = 150
        expect(run({ play: ['HK', 'DK', 'S9', 'C4', 'S3'], jokers: ['j_lusty_joker'] }).score).toBe(150);
    });

    it('两张红桃都计分时 Lusty 加两次：(10+20) × (2+3+3) = 240', () => {
        // 一对红桃 K。真牌组里没有两张同牌，但 makeCard 不禁——这里就是要两张都命中
        expect(run({ play: ['HK', 'HK', 'S9', 'C4', 'S3'], jokers: ['j_lusty_joker'] }).score).toBe(240);
    });

    it('Photograph（**第一张**人头牌 ×2 mult）：一对 K → 30 × (2×2) = 120', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_photograph'] }).score).toBe(120);
    });

    it('Photograph 没有人头牌就不给：一对 4 → (10+8) × 2 = 36', () => {
        expect(run({ play: ['S4', 'H4', 'D9', 'C7', 'D3'], jokers: ['j_photograph'] }).score).toBe(36);
    });

    it('Business Card（人头牌掷中 +$2）：一对 K 两次掷中 → +$4', () => {
        // extra = 2，阈值 1/2；桩给 0.1 → 两张都中
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_business'], roll: 0.1 }).dollars)
            .toBe(4);
    });

    it('Business Card 掷不中就不给钱', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_business'], roll: 0.9 }).dollars)
            .toBe(0);
    });
});

// ————————————————————————————————————————————————————————————————
// individual + cardarea hand —— 管线第 10 步
// ————————————————————————————————————————————————————————————————

describe('手牌区（cardarea = hand）', () => {
    it('Raised Fist（手里最低点数 ×2 当 h_mult）：手里 5 → (10+20) × (2+10) = 360', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4'], held: ['D5'], jokers: ['j_raised_fist'] }).score)
            .toBe(360);
    });

    it('Raised Fist 只认最低的那一张：手里 5 与 9 → 还是 +10', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4'], held: ['D5', 'S9'], jokers: ['j_raised_fist'] }).score)
            .toBe(360);
    });

    it('Shoot the Moon（手里每张 Q +13 mult）：1 张 Q → (10+20) × (2+13) = 450', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4'], held: ['DQ'], jokers: ['j_shoot_the_moon'] }).score)
            .toBe(450);
    });

    it('Baron（手里每张 K ×1.5 mult）：1 张 K → (10+20) × (2×1.5) = 90', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4'], held: ['DK'], jokers: ['j_baron'] }).score).toBe(90);
    });

    it('打出去的牌不算「手里」——Baron 对打出的那两张 K 无效', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4'], held: [], jokers: ['j_baron'] }).score).toBe(60);
    });
});

// ————————————————————————————————————————————————————————————————
// repetition —— 重复触发
// ————————————————————————————————————————————————————————————————

describe('重复触发', () => {
    it('Hack（2/3/4/5 各多触发 1 次）：一对 3 → (10 + 3+3 + 3+3) × 2 = 44', () => {
        expect(run({ play: ['S3', 'H3', 'D9', 'C4', 'D6'], jokers: ['j_hack'] }).score).toBe(44);
    });

    it('Hack 对 K 不生效：(10 + 10+10) × 2 = 60', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_hack'] }).score).toBe(60);
    });

    it('Sock and Buskin（人头牌多触发 1 次）：一对 K → (10 + 10+10+10+10) × 2 = 100', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_sock_and_buskin'] }).score).toBe(100);
    });

    it('Hanging Chad（**只有第一张**多触发 2 次）：一对 K → (10 + 10×3 + 10) × 2 = 100', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_hanging_chad'] }).score).toBe(100);
    });

    it('Dusk（最后一手时全部多触发 1 次）：hands_left=0 → (10 + 10+10+10+10) × 2 = 100', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_dusk'], handsLeft: 0 }).score).toBe(100);
    });

    it('Dusk 不是最后一手就不给：(10+20) × 2 = 60', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_dusk'], handsLeft: 2 }).score).toBe(60);
    });

    it('重复触发与逐张加成叠乘：Hack + Odd Todd，一对 3 → (10 + (3+31)×4) × 2 = 292', () => {
        expect(run({ play: ['S3', 'H3', 'D9', 'C4', 'D6'], jokers: ['j_hack', 'j_odd_todd'] }).score).toBe(292);
    });
});

// ————————————————————————————————————————————————————————————————
// before / after —— 管线第 6 步与结算后
// ————————————————————————————————————————————————————————————————

describe('before：自增型小丑在出牌前长个子', () => {
    it('Square Joker 出**恰好 4 张**时 +4 筹码，当次就生效：(10+20+4) × 2 = 68', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4'], jokers: ['j_square'] }).score).toBe(68);
    });

    it('Square Joker 出 5 张不长：(10+20+0) × 2 = 60', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_square'] }).score).toBe(60);
    });

    it('Square Joker 连出两次 4 张 → 第二次是 +8', () => {
        const jokers = [makeJoker('j_square')];
        const hands = initialHands();
        const view = makeGameView({ hands, jokers });
        evaluatePlay(hand('SK', 'HK', 'D9', 'C4'), hands, view);
        expect(jokers[0].ability.extra.chips).toBe(4);
        const r = evaluatePlay(hand('SQ', 'HQ', 'D8', 'C5'), hands, view);
        expect(jokers[0].ability.extra.chips).toBe(8);
        expect(r.score).toBe((10 + 20 + 8) * 2); // 76
    });

    it('Runner 打出顺子时 +15 筹码：(30 + 10+10+9+8+7 + 15) × 4 = 356', () => {
        expect(run({ play: ['DJ', 'CT', 'C9', 'S8', 'H7'], jokers: ['j_runner'] }).score).toBe(356);
    });

    it('Green Joker 每次出牌 +1 mult，当次生效：(10+20) × (2+1) = 90', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_green_joker'] }).score).toBe(90);
    });

    it('Ride the Bus 没有人头牌就长；有人头牌就**清零**', () => {
        const jokers = [makeJoker('j_ride_the_bus')];
        const hands = initialHands();
        const view = makeGameView({ hands, jokers });

        // 第一手一对 3，没有人头牌 → mult 0 → 1，当次 +1
        const first = evaluatePlay(hand('S3', 'H3', 'D9', 'C4', 'D6'), hands, view);
        expect(jokers[0].ability.mult).toBe(1);
        expect(first.score).toBe((10 + 3 + 3) * (2 + 1)); // 48

        // 第二手一对 K，有人头牌 → 清零，当次不给
        const second = evaluatePlay(hand('SK', 'HK', 'D9', 'C4', 'D3'), hands, view);
        expect(jokers[0].ability.mult).toBe(0);
        expect(second.score).toBe((10 + 20) * 2); // 60
    });
});

// ————————————————————————————————————————————————————————————————
// 不进 calculate_joker 的那几张
// ————————————————————————————————————————————————————————————————

describe('没有 calculate_joker 代码的小丑', () => {
    it('Splash 让全部 5 张都计分：(10 + 10+10+9+4+3) × 2 = 92', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_splash'] }).score).toBe(92);
    });

    it('Splash 不改牌型，只改计分集合——还是 Pair 的 10/2', () => {
        const r = run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_splash'] });
        expect(r.view.hands.Pair.played).toBe(1);
    });
});

// ————————————————————————————————————————————————————————————————
// debuff
// ————————————————————————————————————————————————————————————————

describe('debuff', () => {
    it('被 debuff 的小丑一个效果都不出', () => {
        const jokers = [makeJoker('j_joker')];
        jokers[0].debuff = true;
        const hands = initialHands();
        const view = makeGameView({ hands, jokers });
        expect(evaluatePlay(hand('SK', 'HK', 'D9', 'C4', 'D3'), hands, view).score).toBe(60);
    });

    it('被 debuff 的计分牌整张跳过，连牌面筹码都不给：(10 + 10) × 2 = 40', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].debuff = true;
        const hands = initialHands();
        expect(evaluatePlay(cards, hands, makeGameView({ hands })).score).toBe(40);
    });

    it('被 debuff 的牌不算人头牌——Scary Face 对它无效', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        cards[0].debuff = true;
        const jokers = [makeJoker('j_scary_face')];
        const hands = initialHands();
        const view = makeGameView({ hands, jokers });
        // 只剩 HK 计分且拿到 +30：(10 + 10+30) × 2 = 100
        expect(evaluatePlay(cards, hands, view).score).toBe(100);
    });
});

// ————————————————————————————————————————————————————————————————
// set_ability 的默认值
// ————————————————————————————————————————————————————————————————

describe('set_ability', () => {
    it('x_mult 默认是 1 不是 0——否则所有小丑都会掉进倍率分支', () => {
        expect(makeJoker('j_joker').ability.x_mult).toBe(1);
    });

    it('extra 是深拷贝：改一张不影响另一张', () => {
        const a = makeJoker('j_square');
        const b = makeJoker('j_square');
        a.ability.extra.chips = 999;
        expect(b.ability.extra.chips).toBe(0);
    });

    it('卖价 = max(1, floor(买价/2))', () => {
        expect(makeJoker('j_joker').sell_cost).toBe(1); // cost 2 → 1
        expect(makeJoker('j_sly').sell_cost).toBe(1); // cost 3 → 1
        expect(makeJoker('j_banner').sell_cost).toBe(2); // cost 5 → 2
    });

    it('150 张小丑全都造得出来，且 ability 的必填字段都有值', () => {
        const keys = Object.keys(JOKER_CENTERS);
        expect(keys).toHaveLength(150);
        for (const key of keys) {
            const j = makeJoker(key);
            expect(j.ability.name, key).toBeTruthy();
            expect(j.ability.set, key).toBe('Joker');
            expect(Number.isFinite(j.ability.x_mult), key).toBe(true);
            expect(j.sell_cost, key).toBeGreaterThanOrEqual(1);
        }
    });

    it('池子按 order 排序，且与 centers 一一对应', () => {
        expect(JOKER_KEYS_BY_ORDER).toHaveLength(150);
        const orders = JOKER_KEYS_BY_ORDER.map((k) => JOKER_CENTERS[k].order);
        expect(orders).toEqual([...orders].sort((a, b) => a - b));
        expect(orders[0]).toBe(1);
        expect(orders[149]).toBe(150);
    });
});
