/**
 * 用两个字母指一张牌：点数字母 + 花色字母（`AH`、`TC`、`9S`）。
 * 实机对拍（`emulator-truth.test.ts`）与 `tools/seed-probe.ts` 共用——
 * 实机截图上读出来的就是这种写法，测试里照抄不用转换。
 */
import type { Card } from '../card';

const RANK_OF: Record<string, string> = {
    Ace: 'A', King: 'K', Queen: 'Q', Jack: 'J', '10': 'T', '9': '9', '8': '8',
    '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2',
};
const SUIT_OF: Record<string, string> = { Spades: 'S', Hearts: 'H', Clubs: 'C', Diamonds: 'D' };
/**
 * 原作手牌区的默认排序 `sort('desc')` 按 `get_nominal` 降序，那个值里带着花色权重
 * （`suit_nominal`：♠ 0.04 > ♥ 0.03 > ♣ 0.02 > ♦ 0.01），所以同点数是 ♠♥♣♦
 */
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['S', 'H', 'C', 'D'];

export function cardId(card: Card): string {
    return RANK_OF[card.base.value]! + SUIT_OF[card.base.suit]!;
}

/** 按实机手牌区的样子排（点数降序、同点数 ♠♥♣♦），方便对着截图读 */
export function sortedIds(cards: readonly Card[]): string[] {
    const key = (id: string) => RANKS.indexOf(id[0]!) * 4 + SUITS.indexOf(id[1]!);
    return cards.map(cardId).sort((a, b) => key(a) - key(b));
}

/** 从 `from` 里按 id 取牌，缺一张就抛（把当前那一手打出来，方便对照） */
export function pickCards(from: readonly Card[], ids: string): Card[] {
    return ids.split(',').map((want) => {
        const card = from.find((c) => cardId(c) === want);
        if (!card) throw new Error(`没有 ${want}：${from.map(cardId).join(' ')}`);
        return card;
    });
}
