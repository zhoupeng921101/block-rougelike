/**
 * 造一张 `GameView`。
 *
 * 为什么需要它：`calculate_joker` 在原作里读的是全局 `G.GAME`，
 * 而调用点有四处——出牌结算、回合结算、商店、进盲注——**其中三处没有 `Round`**。
 * 所以视图不能由 `Round` 独占，得能单独造。
 *
 * 默认值对应「一局刚开始、没有小丑、身上 0 块钱」。
 * `pseudorandom` 的默认实现会**抛异常**而不是返回 0——
 * 静默返回 0 会让「掷点型小丑在测试里恒不触发」这件事无声通过，
 * 那是最难查的一类错。要掷点就显式给一个。
 */

import { initialHands } from '../scoring';
import type { GameView } from './types';

export function makeGameView(overrides: Partial<GameView> = {}): GameView {
    return {
        hands: initialHands(),
        dollars: 0,
        dollar_buffer: 0,
        hands_played: 0,
        current_round: { hands_left: 4, discards_left: 3, hands_played: 0 },
        probabilities: { normal: 1 },
        jokers: [],
        joker_slots: 5,
        deckCount: 0,
        handCards: [],
        consumeable_usage_tarot: 0,
        consumableCount: 0,
        consumable_slots: 2,
        consumableCards: [],
        duplicateConsumableAsNegative: () => {
            throw new Error('这个 GameView 没有接消耗品区，但 Perkeo 要复制一张');
        },
        createConsumable: () => {
            throw new Error('这个 GameView 没有接造卡的口子，但有小丑要造塔罗——显式传进来');
        },
        createPlayingCard: () => {
            throw new Error('这个 GameView 没有接整副牌，但 Marble Joker 要造一张石头牌——显式传进来');
        },
        jokerBuffer: 0,
        queueJoker: () => {
            throw new Error('这个 GameView 没有接小丑区，但有小丑要造小丑——显式传进来');
        },
        sliceJoker: () => {
            throw new Error('这个 GameView 没有接小丑区，但有小丑要毁小丑——显式传进来');
        },
        duplicateJoker: () => {
            throw new Error('这个 GameView 没有接小丑区，但 Invisible Joker 要复制——显式传进来');
        },
        addPlayingCardToHand: () => {
            throw new Error('这个 GameView 没有接手牌，但 DNA 要复制一张——显式传进来');
        },
        disableBoss: () => {
            throw new Error('这个 GameView 没有接盲注，但有小丑要关掉 Boss——显式传进来');
        },
        createCertificateCard: () => {
            throw new Error('这个 GameView 没有接手牌，但 Certificate 要造一张——显式传进来');
        },
        addTag: () => {
            throw new Error('这个 GameView 没有接标签，但 Diet Cola 要造一个——显式传进来');
        },
        smeared: false,
        ante: 1,
        startingDeckSize: 52,
        playingCardCount: 52,
        blindTriggered: false,
        game_over: false,
        blindProgress: 0,
        pseudorandom: () => {
            throw new Error('这个 GameView 没有接 RNG，但有小丑要掷点——显式传 pseudorandom');
        },
        ...overrides,
    };
}
