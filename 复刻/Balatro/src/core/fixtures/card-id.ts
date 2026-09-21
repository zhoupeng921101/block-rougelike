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

export function cardId(card: Card): string {
    return RANK_OF[card.base.value]! + SUIT_OF[card.base.suit]!;
}

/** 从 `from` 里按 id 取牌，缺一张就抛（把当前那一手打出来，方便对照） */
export function pickCards(from: readonly Card[], ids: string): Card[] {
    return ids.split(',').map((want) => {
        const card = from.find((c) => cardId(c) === want);
        if (!card) throw new Error(`没有 ${want}：${from.map(cardId).join(' ')}`);
        return card;
    });
}
