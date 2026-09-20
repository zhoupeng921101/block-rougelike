/**
 * 第二批小丑的测试（37 张纯逻辑的）。
 *
 * 口径与 `calculate.test.ts` 一样：**期望值全是手算的，算式写在用例名里**。
 * 洗牌与结算都没有外部真值（04 号票），手算错了测试照样绿，
 * 所以算式必须留痕，让下一个人能不跑代码就复核。
 *
 * 分成两个文件只是因为一个文件太长；口径与 helper 是同一套。
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { type Card, type Suit, type Value, makeCard, resetCardCounters } from '../card';
import { type HandInfo, type HandName, evaluatePlay, initialHands } from '../scoring';
import { calculateJoker } from './calculate';
import { makeGameView } from './game-view';
import { refreshDerivedAbilities } from './derived';
import { makeJoker } from './instance';
import { runModifiers } from './modifiers';
import type { GameView, Joker } from './types';

function c(spec: string, x = 0): Card {
    const suitMap: Record<string, Suit> = { S: 'Spades', H: 'Hearts', C: 'Clubs', D: 'Diamonds' };
    const valMap: Record<string, Value> = {
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        T: '10', J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace',
    };
    const card = makeCard(spec, suitMap[spec[0]], valMap[spec.slice(1)]);
    card.T.x = x;
    return card;
}

const hand = (...specs: string[]) => specs.map((s, i) => c(s, i * 2.05));

/** `context.poker_hands` 的空壳。只有 `Superposition` 之类要查具体某一项 */
const EMPTY_HANDS: Record<HandName, Card[][]> = Object.fromEntries(
    Object.keys(initialHands()).map((name) => [name, []]),
) as unknown as Record<HandName, Card[][]>;

type Scene = {
    play: string[];
    held?: string[];
    jokers?: string[];
    roll?: number;
    dollars?: number;
    deckCount?: number;
    playingCardCount?: number;
    startingDeckSize?: number;
    blindTriggered?: boolean;
    idolCard?: { id: number; suit: Suit };
    ancientSuit?: Suit;
    hands?: Record<HandName, HandInfo>;
    jokerSlots?: number;
};

function run(scene: Scene): { score: number; dollars: number; mult: number; view: GameView; jokers: Joker[] } {
    const jokers = (scene.jokers ?? []).map((k) => makeJoker(k));
    const hands = scene.hands ?? initialHands();
    const played = hand(...scene.play);
    const held = (scene.held ?? []).map((s, i) => c(s, 100 + i));
    const slots = scene.jokerSlots ?? 5;

    // 派生字段（Joker Stencil / Swashbuckler）要先重算，否则读到 config 初值
    refreshDerivedAbilities(jokers, slots);
    const mods = runModifiers(jokers);

    const view = makeGameView({
        hands,
        jokers,
        handCards: held,
        joker_slots: slots,
        dollars: scene.dollars ?? 0,
        deckCount: scene.deckCount ?? 0,
        startingDeckSize: scene.startingDeckSize ?? 52,
        playingCardCount: scene.playingCardCount ?? 52,
        blindTriggered: scene.blindTriggered ?? false,
        smeared: mods.smeared,
        probabilities: { normal: mods.probabilityNormal },
        current_round: {
            hands_left: 3,
            discards_left: 3,
            hands_played: 0,
            idol_card: scene.idolCard,
            ancient_suit: scene.ancientSuit,
        },
        pseudorandom: () => {
            if (scene.roll === undefined) throw new Error('这个用例没给 roll，但有小丑要掷点');
            return scene.roll;
        },
    });

    const r = evaluatePlay(played, hands, view, mods.flags);
    return { score: r.score, dollars: r.dollars, mult: r.mult, view, jokers };
}

beforeEach(() => resetCardCounters());

// ————————————————————————————————————————————————————————————————
// 逐张计分牌
// ————————————————————————————————————————————————————————————————

describe('逐张型（新增）', () => {
    it('Fibonacci（A/2/3/5/8 各 +8 mult）：一对 3 → (10+3+3) × (2+8+8) = 288', () => {
        expect(run({ play: ['S3', 'H3', 'D9', 'C4', 'D6'], jokers: ['j_fibonacci'] }).score).toBe(288);
    });

    it('Fibonacci 对 4 不生效：(10+4+4) × 2 = 36', () => {
        expect(run({ play: ['S4', 'H4', 'D9', 'C7', 'D6'], jokers: ['j_fibonacci'] }).score).toBe(36);
    });

    it('Triboulet（Q/K 各 ×2 mult）：一对 K → 30 × (2×2×2) = 240', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_triboulet'] }).score).toBe(240);
    });

    it('Arrowhead（每张黑桃 +50 筹码）：一对黑桃 K → (10+10+50+10+50) × 2 = 260', () => {
        expect(run({ play: ['SK', 'SK', 'D9', 'C4', 'D3'], jokers: ['j_arrowhead'] }).score).toBe(260);
    });

    it('Onyx Agate（每张梅花 +7 mult）：一对梅花 K → 30 × (2+7+7) = 480', () => {
        expect(run({ play: ['CK', 'CK', 'D9', 'S4', 'D3'], jokers: ['j_onyx_agate'] }).score).toBe(480);
    });

    it('Rough Gem（每张方块 +$1）：一对方块 K → +$2', () => {
        expect(run({ play: ['DK', 'DK', 'S9', 'C4', 'S3'], jokers: ['j_rough_gem'] }).dollars).toBe(2);
    });

    it('Bloodstone（红桃 + 掷中 ×1.5）：一对红桃 K 全中 → 30 × (2×1.5×1.5) = 135', () => {
        expect(run({ play: ['HK', 'HK', 'S9', 'C4', 'S3'], jokers: ['j_bloodstone'], roll: 0.1 }).score)
            .toBe(135);
    });

    it('Bloodstone 掷不中就不给：30 × 2 = 60', () => {
        expect(run({ play: ['HK', 'HK', 'S9', 'C4', 'S3'], jokers: ['j_bloodstone'], roll: 0.9 }).score)
            .toBe(60);
    });

    it('Bloodstone **非红桃不消耗 RNG**——掷点在花色判定之后', () => {
        // 不给 roll，所以一旦掷点就会抛
        expect(() => run({ play: ['SK', 'SK', 'D9', 'C4', 'D3'], jokers: ['j_bloodstone'] }))
            .not.toThrow();
    });

    /**
     * Hiker 与 Wee Joker 的差别值得记一笔：两者都在逐张型里长个子，
     * 但 **Hiker 长的是牌、Wee Joker 长的是自己**。
     *
     * 牌的 `perma_bonus` 在同一张牌的 `getChipBonus` **之后**才加
     * （effects[0] 是牌自己的筹码、effects[1] 才是 Hiker 的），所以本手用旧值；
     * Wee Joker 长的 `extra.chips` 要等第 15 步主遍历才被读，所以本手用新值。
     */
    it('Hiker（每张计分牌永久 +5 筹码）：**本手用的是加之前的值** → 30 × 2 = 60', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_hiker'] }).score).toBe(60);
    });

    it('Hiker 的加成留在牌上：同两张牌再打一次就是 (10+15+15) × 2 = 80', () => {
        const cards = hand('SK', 'HK', 'D9', 'C4', 'D3');
        const jokers = [makeJoker('j_hiker')];
        const hands = initialHands();
        const view = makeGameView({ hands, jokers });

        evaluatePlay(cards, hands, view);
        expect(cards[0].perma_bonus).toBe(5);
        expect(cards[1].perma_bonus).toBe(5);

        const second = evaluatePlay(cards, hands, view);
        expect(second.score).toBe((10 + 15 + 15) * 2);
    });

    it('The Idol（点数与花色都撞上 → ×2 mult）', () => {
        const r = run({
            play: ['SK', 'HK', 'D9', 'C4', 'D3'],
            jokers: ['j_idol'],
            idolCard: { id: 13, suit: 'Spades' },
        });
        // 只有 SK 同时满足点数 13 与黑桃 → 30 × (2×2) = 120
        expect(r.score).toBe(120);
    });

    it('The Idol 点数对花色不对就不给', () => {
        expect(run({
            play: ['SK', 'HK', 'D9', 'C4', 'D3'],
            jokers: ['j_idol'],
            idolCard: { id: 13, suit: 'Diamonds' },
        }).score).toBe(60);
    });

    it('Ancient Joker（撞上本回合花色 → ×1.5 mult）：一对黑桃 K → 30 × (2×1.5×1.5) = 135', () => {
        expect(run({
            play: ['SK', 'SK', 'D9', 'C4', 'D3'],
            jokers: ['j_ancient'],
            ancientSuit: 'Spades',
        }).score).toBe(135);
    });

    /**
     * **Wee Joker 的成长当次就算进去。**
     *
     * 逐张型（管线第 11 步）跑在小丑区主遍历（第 15 步）**之前**，
     * 所以 `extra.chips` 在 main 读到它的时候已经长完了。
     * 这不是复刻件的取巧——原作两步的先后就是这样，Wee Joker 的第一手就吃到加成。
     */
    it('Wee Joker（每张 2 号牌 +8 筹码，**当次就算**）：(10+2+2+16) × 2 = 60', () => {
        const r = run({ play: ['S2', 'H2', 'D9', 'C4', 'D6'], jokers: ['j_wee'] });
        expect(r.score).toBe(60);
        expect(r.jokers[0].ability.extra.chips).toBe(16); // 两张 2 各长一档
    });
});

// ————————————————————————————————————————————————————————————————
// main 分支
// ————————————————————————————————————————————————————————————————

describe('main（新增）', () => {
    it('Flower Pot（四种花色齐全 ×3）：A-2-3-4-5 顺子 → (30+11+2+3+4+5) × (4×3) = 660', () => {
        // **看的是 `scoring_hand`**，所以要让四种花色都进计分集合 →
        // 用顺子（5 张全计分）而不是对子（只有 2 张计分）
        expect(run({ play: ['SA', 'H2', 'C3', 'D4', 'S5'], jokers: ['j_flower_pot'] }).score).toBe(660);
    });

    it('Flower Pot 缺一种花色就不给', () => {
        // 全黑桃顺子 → 同花顺，四花色不齐
        const r = run({ play: ['SA', 'S2', 'S3', 'S4', 'S5'], jokers: ['j_flower_pot'] });
        expect(r.score).toBe((100 + 11 + 2 + 3 + 4 + 5) * 8); // 没有 ×3
    });

    it('Seeing Double（至少一张梅花 + 至少一张非梅花 ×2）', () => {
        const r = run({ play: ['CA', 'C2', 'S3', 'C4', 'C5'], jokers: ['j_seeing_double'] });
        // 顺子，5 张全计分，有梅花也有黑桃 → (30+11+2+3+4+5) × (4×2) = 440
        expect(r.score).toBe(440);
    });

    it('Seeing Double 全是梅花就不给——梅花是必需的**一方**，不是「任意两种花色」', () => {
        const r = run({ play: ['CA', 'C2', 'C3', 'C4', 'C5'], jokers: ['j_seeing_double'] });
        expect(r.score).toBe((100 + 11 + 2 + 3 + 4 + 5) * 8); // 同花顺，没有 ×2
    });

    it('Seeing Double 一张梅花都没有也不给', () => {
        const r = run({ play: ['SA', 'H2', 'D3', 'S4', 'H5'], jokers: ['j_seeing_double'] });
        expect(r.score).toBe((30 + 11 + 2 + 3 + 4 + 5) * 4);
    });

    it('Blackboard（手里全是黑色花色 ×3）：手里两张黑桃 → 30 × (2×3) = 180', () => {
        expect(run({
            play: ['SK', 'HK', 'D9', 'C4'],
            held: ['S5', 'C7'],
            jokers: ['j_blackboard'],
        }).score).toBe(180);
    });

    it('Blackboard 手里有一张红的就不给', () => {
        expect(run({
            play: ['SK', 'HK', 'D9', 'C4'],
            held: ['S5', 'H7'],
            jokers: ['j_blackboard'],
        }).score).toBe(60);
    });

    it('Blackboard 手里没牌时算「全是黑的」——`every` 对空数组为真，原文同理', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4'], held: [], jokers: ['j_blackboard'] }).score)
            .toBe(180);
    });

    it('Erosion（起始牌组每少一张 +4 mult）：52 → 48 → 30 × (2+16) = 540', () => {
        expect(run({
            play: ['SK', 'HK', 'D9', 'C4', 'D3'],
            jokers: ['j_erosion'],
            startingDeckSize: 52,
            playingCardCount: 48,
        }).score).toBe(540);
    });

    it('Erosion 一张没少就不给', () => {
        expect(run({
            play: ['SK', 'HK', 'D9', 'C4', 'D3'],
            jokers: ['j_erosion'],
            playingCardCount: 52,
        }).score).toBe(60);
    });

    it('Card Sharp（本回合这个牌型打过不止一次 ×3）', () => {
        const hands = initialHands();
        run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_card_sharp'], hands }); // 第一次
        const second = run({ play: ['SQ', 'HQ', 'D9', 'C4', 'D3'], jokers: ['j_card_sharp'], hands });
        expect(second.score).toBe(30 * 6); // 180
    });

    it('Card Sharp 第一次打不给', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_card_sharp'] }).score).toBe(60);
    });

    it('Bootstraps（每满 $5 +2 mult）：$12 → floor(12/5)=2 → 30 × (2+4) = 180', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_bootstraps'], dollars: 12 }).score)
            .toBe(180);
    });

    it('Bootstraps 不到 $5 不给', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_bootstraps'], dollars: 4 }).score)
            .toBe(60);
    });

    it('Stuntman（+250 筹码）：(10+20+250) × 2 = 560', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_stuntman'] }).score).toBe(560);
    });

    it('Matador（Boss 的 debuff 本手触发过 → $8）', () => {
        const r = run({
            play: ['SK', 'HK', 'D9', 'C4', 'D3'],
            jokers: ['j_matador'],
            blindTriggered: true,
        });
        expect(r.dollars).toBe(8);
    });

    it('Matador 没触发就不给钱', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_matador'] }).dollars).toBe(0);
    });

    it('Joker Stencil（每个空格子 ×1，且把自己占的格也算空的）', () => {
        // 5 格里只有 Stencil 一张 → 空 4 格 + 自己 1 = ×5 → 30 × (2×5) = 300
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_stencil'] }).score).toBe(300);
    });

    it('Joker Stencil 小丑区满了就不给', () => {
        // 陪衬那四张都挑「本手打不中」的：Droll/Crazy 要同花与顺子，
        // Devious/Crafty 要顺子与同花的 t_chips —— 一对 K 一个都不触发
        const keys = ['j_stencil', 'j_droll', 'j_crazy', 'j_devious', 'j_crafty'];
        const r = run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: keys });
        expect(r.score).toBe(60);
    });

    it('Swashbuckler（其余小丑的卖价之和）', () => {
        // Swashbuckler + Banner(cost 5 → 卖 2) + Blue Joker(cost 5 → 卖 2) = +4 mult
        const r = run({
            play: ['SK', 'HK', 'D9', 'C4', 'D3'],
            jokers: ['j_swashbuckler', 'j_banner', 'j_blue_joker'],
        });
        // Banner 给 3×30=90 筹码、Blue Joker 牌堆 0 张不给
        // (10+20+90) × (2+4) = 120 × 6 = 720
        expect(r.score).toBe(720);
    });

    it('Swashbuckler 只有自己时 mult 为 0，不给', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_swashbuckler'] }).score).toBe(60);
    });
});

// ————————————————————————————————————————————————————————————————
// 小丑对小丑 / 蓝图
// ————————————————————————————————————————————————————————————————

describe('小丑对小丑', () => {
    it('Baseball Card（每张 rarity 2 的小丑 ×1.5）', () => {
        // Baseball Card(r3) + Fibonacci(r2) + Hack(r2) → 两张 r2 → ×1.5×1.5
        const r = run({ play: ['S3', 'H3', 'D9', 'C4', 'D6'], jokers: ['j_baseball', 'j_fibonacci', 'j_hack'] });
        // Hack 让两张 3 各触发两次；Fibonacci 每次 +8 mult
        // 筹码 10 + (3+3) + (3+3) = 22；mult 2 + 8×4 = 34，再 ×1.5×1.5 = 76.5
        // floor(22 × 76.5) = 1683
        expect(r.score).toBe(1683);
    });

    it('Baseball Card 不算自己（它自己是 rarity 3）', () => {
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_baseball'] }).score).toBe(60);
    });
});

describe('蓝图与头脑风暴', () => {
    it('Blueprint 复制**右边**那一张：[Blueprint, Joker] → 两份 +4 mult', () => {
        const r = run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_blueprint', 'j_joker'] });
        expect(r.score).toBe(30 * (2 + 4 + 4)); // 300
    });

    it('Blueprint 右边没牌就什么都不做：[Joker, Blueprint]', () => {
        const r = run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_joker', 'j_blueprint'] });
        expect(r.score).toBe(30 * (2 + 4)); // 180
    });

    it('Brainstorm 复制**最左边**那一张：[Joker, Brainstorm] → 两份', () => {
        const r = run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_joker', 'j_brainstorm'] });
        expect(r.score).toBe(30 * (2 + 4 + 4)); // 300
    });

    it('Brainstorm 在最左边时复制的是自己 → 不生效', () => {
        const r = run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_brainstorm', 'j_joker'] });
        expect(r.score).toBe(30 * (2 + 4)); // 180
    });

    it('一串蓝图能链下去：[Blueprint, Blueprint, Joker] → 三份 +4', () => {
        const r = run({
            play: ['SK', 'HK', 'D9', 'C4', 'D3'],
            jokers: ['j_blueprint', 'j_blueprint', 'j_joker'],
        });
        expect(r.score).toBe(30 * (2 + 4 + 4 + 4)); // 420
    });

    it('Blueprint 也复制逐张型的效果（不只是主遍历）', () => {
        // [Blueprint, Scary Face] → 每张人头牌 +30 筹码 ×2 份
        const r = run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_blueprint', 'j_scary_face'] });
        expect(r.score).toBe((10 + (10 + 30 + 30) + (10 + 30 + 30)) * 2); // 300
    });

    it('Blueprint + Brainstorm 互指不会无限递归', () => {
        expect(() =>
            run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_brainstorm', 'j_blueprint'] }),
        ).not.toThrow();
    });
});

// ————————————————————————————————————————————————————————————————
// 局面参数（modifiers.ts）
// ————————————————————————————————————————————————————————————————

describe('局面参数', () => {
    const mods = (...keys: string[]) => runModifiers(keys.map((k) => makeJoker(k)));

    it('Juggler +1 手牌上限、Drunkard +1 弃牌', () => {
        expect(mods('j_juggler').handSize).toBe(1);
        expect(mods('j_drunkard').discards).toBe(1);
    });

    it('Merry Andy +3 弃牌 / -1 手牌上限', () => {
        const m = mods('j_merry_andy');
        expect(m.discards).toBe(3);
        expect(m.handSize).toBe(-1);
    });

    it('Troubadour +2 手牌上限、**-1 出牌次数**', () => {
        const m = mods('j_troubadour');
        expect(m.handSize).toBe(2);
        expect(m.hands).toBe(-1);
    });

    it('Stuntman **-2** 手牌上限——原文是 `change_size(-extra.h_size)`', () => {
        expect(mods('j_stuntman').handSize).toBe(-2);
    });

    it('Burglar 给 +3 出牌次数（弃牌清零由 Round 执行）', () => {
        expect(mods('j_burglar').burglarHands).toBe(3);
    });

    it('Oops! All 6s 把概率 ×2，**两张就是 ×4**', () => {
        expect(mods('j_oops').probabilityNormal).toBe(2);
        expect(mods('j_oops', 'j_oops').probabilityNormal).toBe(4);
    });

    it('To the Moon 让利息基数 +1', () => {
        expect(mods('j_to_the_moon').interestAmount).toBe(2);
    });

    it('Four Fingers / Shortcut 放松牌型判定', () => {
        expect(mods('j_four_fingers').flags.fourFingers).toBe(true);
        expect(mods('j_shortcut').flags.shortcut).toBe(true);
    });

    it('被 debuff 的小丑不给任何局面加成', () => {
        const juggler = makeJoker('j_juggler');
        juggler.debuff = true;
        expect(runModifiers([juggler]).handSize).toBe(0);
    });

    it('**重算而不是加减**：同一批小丑算两次结果一样', () => {
        const jokers = ['j_juggler', 'j_drunkard', 'j_troubadour'].map((k) => makeJoker(k));
        expect(runModifiers(jokers)).toEqual(runModifiers(jokers));
    });
});

describe('Four Fingers 与 Shortcut 真的改牌型', () => {
    it('Four Fingers：4 张同花就算同花 → (35+11+10+10+5) × 4 = 284', () => {
        const r = run({ play: ['HA', 'HK', 'HT', 'H5', 'S4'], jokers: ['j_four_fingers'] });
        expect(r.score).toBe((35 + 11 + 10 + 10 + 5) * 4);
    });

    it('没有 Four Fingers 时同样的牌只是高牌：(5+11) × 1 = 16', () => {
        expect(run({ play: ['HA', 'HK', 'HT', 'H5', 'S4'] }).score).toBe(16);
    });

    it('Shortcut：跳一档也算顺子 —— 3,4,6,7,8', () => {
        const r = run({ play: ['S3', 'H4', 'C6', 'D7', 'S8'], jokers: ['j_shortcut'] });
        expect(r.score).toBe((30 + 3 + 4 + 6 + 7 + 8) * 4); // 232
    });

    it('没有 Shortcut 时那手牌只是高牌', () => {
        expect(run({ play: ['S3', 'H4', 'C6', 'D7', 'S8'] }).score).toBe((5 + 8) * 1);
    });
});

describe('Smeared Joker：红黑互认', () => {
    it('让 Greedy Joker（方块）也吃红桃：一对红桃 K → 30 × (2+3+3) = 240', () => {
        const r = run({
            play: ['HK', 'HK', 'S9', 'C4', 'S3'],
            jokers: ['j_greedy_joker', 'j_smeared'],
        });
        expect(r.score).toBe(240);
    });

    it('但不让红桃认黑桃：一对黑桃 K 对 Greedy Joker 无效', () => {
        const r = run({ play: ['SK', 'SK', 'H9', 'C4', 'H3'], jokers: ['j_greedy_joker', 'j_smeared'] });
        expect(r.score).toBe(60);
    });

    it('Arrowhead（黑桃）带 Smeared 之后也吃梅花', () => {
        const r = run({ play: ['CK', 'CK', 'H9', 'D4', 'H3'], jokers: ['j_arrowhead', 'j_smeared'] });
        expect(r.score).toBe((10 + 10 + 50 + 10 + 50) * 2); // 260
    });
});

describe('Oops! All 6s 真的改掷点阈值', () => {
    it('Business Card 的 1/2 变成 2/2 —— 掷 0.9 也中', () => {
        // 不带 Oops 时 0.9 不中
        expect(run({ play: ['SK', 'HK', 'D9', 'C4', 'D3'], jokers: ['j_business'], roll: 0.9 }).dollars)
            .toBe(0);
        // 带一张 Oops → 阈值 2/2 = 1，0.9 < 1 命中
        expect(run({
            play: ['SK', 'HK', 'D9', 'C4', 'D3'],
            jokers: ['j_business', 'j_oops'],
            roll: 0.9,
        }).dollars).toBe(4);
    });
});

// ————————————————————————————————————————————————————————————————
// 消耗品那一刀解开的 8 张（16 号票第 7 步）
//
// 期望值手算，算式写在用例名里。造塔罗的那几张**只断言「造了几张、
// 用的是哪个 keyAppend」**——抽到具体哪张由池子与 seed 决定，
// 断言那个等于把测试钉死在当前 seed 上。
// ————————————————————————————————————————————————————————————————

describe('8 Ball：打出 8 就 1/4 造一张塔罗', () => {
    /** `card.lua:3109` 的三个条件是嵌套的：先查空位、再判点数、最后掷点 */
    function ctx8(card: Card, roll: number, made: string[], count = 0) {
        return makeGameView({
            consumableCount: count,
            consumable_slots: 2,
            createConsumable: (set, keyAppend) => made.push(`${set}:${keyAppend}`),
            pseudorandom: () => roll,
            handCards: [card],
        });
    }

    it('打出 8 且掷点中（0 < 1/4）→ 造一张塔罗，keyAppend 是 8ba', () => {
        const made: string[] = [];
        const card = c('S8');
        const out = calculateJoker(
            makeJoker('j_8_ball'),
            { cardarea: 'play', individual: true, other_card: card },
            ctx8(card, 0, made),
        );
        expect(made).toEqual(['Tarot:8ba']);
        expect(out?.message).toBe('plus_tarot');
    });

    it('打出 8 但掷点不中（0.9 ≥ 1/4）→ 不造', () => {
        const made: string[] = [];
        const card = c('S8');
        calculateJoker(
            makeJoker('j_8_ball'),
            { cardarea: 'play', individual: true, other_card: card },
            ctx8(card, 0.9, made),
        );
        expect(made).toEqual([]);
    });

    /** **非 8 不掷点**：原文 `id == 8 and pseudorandom(...)` 是短路的 */
    it('不是 8 就**一次点都不掷**', () => {
        const keys: string[] = [];
        const card = c('S7');
        calculateJoker(
            makeJoker('j_8_ball'),
            { cardarea: 'play', individual: true, other_card: card },
            makeGameView({
                consumableCount: 0,
                consumable_slots: 2,
                createConsumable: () => {},
                pseudorandom: (k) => { keys.push(k); return 0; },
            }),
        );
        expect(keys).not.toContain('8ball');
    });

    /** **消耗品区满了也不掷点**：那个判定在最外层 */
    it('消耗品区满了就不掷点', () => {
        const keys: string[] = [];
        const card = c('S8');
        calculateJoker(
            makeJoker('j_8_ball'),
            { cardarea: 'play', individual: true, other_card: card },
            makeGameView({
                consumableCount: 2,
                consumable_slots: 2,
                createConsumable: () => {},
                pseudorandom: (k) => { keys.push(k); return 0; },
            }),
        );
        expect(keys).not.toContain('8ball');
    });
});

describe('Vagabond：出牌时 ≤ $4 就造一张塔罗', () => {
    const run = (dollars: number, made: string[]) =>
        calculateJoker(
            makeJoker('j_vagabond'),
            { cardarea: 'jokers', after: true },
            makeGameView({
                dollars,
                consumableCount: 0,
                consumable_slots: 2,
                createConsumable: (set, keyAppend) => made.push(`${set}:${keyAppend}`),
            }),
        );

    it('$4 造（判的是 ≤ 不是 <）', () => {
        const made: string[] = [];
        run(4, made);
        expect(made).toEqual(['Tarot:vag']);
    });

    it('$5 不造', () => {
        const made: string[] = [];
        run(5, made);
        expect(made).toEqual([]);
    });
});

describe('Superposition：A + 顺子就造一张塔罗', () => {
    function run(scoring: Card[], straight: Card[][], made: string[]) {
        return calculateJoker(
            makeJoker('j_superposition'),
            {
                cardarea: 'jokers',
                after: true,
                scoring_hand: scoring,
                poker_hands: { ...EMPTY_HANDS, Straight: straight },
            },
            makeGameView({
                consumableCount: 0,
                consumable_slots: 2,
                createConsumable: (set, keyAppend) => made.push(`${set}:${keyAppend}`),
            }),
        );
    }

    it('有 A 且命中顺子 → 造，keyAppend 是 sup', () => {
        const made: string[] = [];
        const cards = [c('SA'), c('H2')];
        run(cards, [cards], made);
        expect(made).toEqual(['Tarot:sup']);
    });

    it('有 A 但没顺子 → 不造', () => {
        const made: string[] = [];
        run([c('SA')], [], made);
        expect(made).toEqual([]);
    });

    it('有顺子但没 A → 不造', () => {
        const made: string[] = [];
        const cards = [c('S5'), c('H6')];
        run(cards, [cards], made);
        expect(made).toEqual([]);
    });
});

describe('Constellation：每用一张**星球**涨 X0.1', () => {
    it('用星球 → x_mult 1 + 0.1 = 1.1', () => {
        const joker = makeJoker('j_constellation');
        calculateJoker(joker, { using_consumeable: true, consumeable: { set: 'Planet' } }, makeGameView());
        expect(joker.ability.x_mult).toBeCloseTo(1.1);
    });

    it('用三张星球 → 1 + 0.1×3 = 1.3', () => {
        const joker = makeJoker('j_constellation');
        for (let i = 0; i < 3; i++) {
            calculateJoker(joker, { using_consumeable: true, consumeable: { set: 'Planet' } }, makeGameView());
        }
        expect(joker.ability.x_mult).toBeCloseTo(1.3);
    });

    it('用塔罗**不涨**', () => {
        const joker = makeJoker('j_constellation');
        calculateJoker(joker, { using_consumeable: true, consumeable: { set: 'Tarot' } }, makeGameView());
        expect(joker.ability.x_mult).toBe(1);
    });
});

describe('Cartomancer：进盲注时造一张塔罗', () => {
    it('造一张，keyAppend 是 car', () => {
        const made: string[] = [];
        calculateJoker(
            makeJoker('j_cartomancer'),
            { setting_blind: true },
            makeGameView({
                consumableCount: 0,
                consumable_slots: 2,
                createConsumable: (set, keyAppend) => made.push(`${set}:${keyAppend}`),
            }),
        );
        expect(made).toEqual(['Tarot:car']);
    });

    it('消耗品区满了就不造', () => {
        const made: string[] = [];
        calculateJoker(
            makeJoker('j_cartomancer'),
            { setting_blind: true },
            makeGameView({
                consumableCount: 2,
                consumable_slots: 2,
                createConsumable: (set, keyAppend) => made.push(`${set}:${keyAppend}`),
            }),
        );
        expect(made).toEqual([]);
    });
});

describe('Turtle Bean：手牌上限 +5，每回合 -1，到 0 自毁', () => {
    it('开局给 +5 手牌上限', () => {
        expect(runModifiers([makeJoker('j_turtle_bean')]).handSize).toBe(5);
    });

    it('一个回合之后变成 +4', () => {
        const joker = makeJoker('j_turtle_bean');
        calculateJoker(joker, { end_of_round: true }, makeGameView());
        expect(runModifiers([joker]).handSize).toBe(4);
    });

    /** 与 `Popcorn` 同一个形状：**先判会不会掉到 0、再减** */
    it('剩 +1 时那一回合就自毁，不是先减到 0 再多活一回合', () => {
        const joker = makeJoker('j_turtle_bean');
        joker.ability.extra.h_size = 1;
        const out = calculateJoker(joker, { end_of_round: true }, makeGameView());
        expect(out?.destroy).toBe(true);
        expect(joker.ability.extra.h_size).toBe(1); // 没被减，直接毁
    });
});
