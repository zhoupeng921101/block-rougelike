/**
 * 局内各个 CardArea 的位置与尺寸（22 号票）。不 import Phaser。
 *
 * 尺寸：`game.lua:2436` 的 `CAI`；位置：`common_events.lua:3` 的 `set_screen_positions`。
 * 全是房间坐标（tile）。
 */
import { CARD_H, CARD_W, TILE_H, TILE_W } from './coords';
import type { Rect } from '../ui/uibox';

export type AreaKey = 'hand' | 'play' | 'jokers' | 'consumeables' | 'deck' | 'discard';

export function cardAreas(): Record<AreaKey, Rect> {
    const size = {
        discard: { w: CARD_W, h: CARD_H },
        deck: { w: CARD_W * 1.1, h: 0.95 * CARD_H },
        hand: { w: 6 * CARD_W, h: 0.95 * CARD_H },
        play: { w: 5.3 * CARD_W, h: 0.95 * CARD_H },
        jokers: { w: 4.9 * CARD_W, h: 0.95 * CARD_H },
        consumeables: { w: 2.3 * CARD_W, h: 0.95 * CARD_H },
    };
    const hand = { x: TILE_W - size.hand.w - 3.55, y: TILE_H - size.hand.h, ...size.hand };
    const play = { x: hand.x + (hand.w - size.play.w) / 2, y: hand.y - 3.6, ...size.play };
    const jokers = { x: hand.x - 0.1, y: 0, ...size.jokers };
    const consumeables = { x: jokers.x + jokers.w + 0.8, y: 0, ...size.consumeables };
    const deck = { x: TILE_W - size.deck.w - 0.5, y: TILE_H - size.deck.h, ...size.deck };
    const discard = { x: jokers.x + jokers.w / 2 + 0.3 + 15, y: 4.2, ...size.discard };
    return { hand, play, jokers, consumeables, deck, discard };
}
