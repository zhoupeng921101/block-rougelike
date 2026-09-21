/**
 * 把复刻件的卡与局面转成提示框要的「原作同形」输入（22 号票，`ui/definitions/card-popup.ts`）。不 import Phaser。
 */
import type { Card } from '../core/card';
import { type Consumable, distinctPlanetsUsed } from '../core/consumables';
import type { Joker } from '../core/jokers';
import { runModifiers } from '../core/jokers/modifiers';
import type { Run } from '../core/run';
import type { PopupCard, PopupGame } from '../ui/definitions/card-popup';
import { P_CENTERS } from '../ui/descriptions.generated';

const RANK_BY_ID: Record<number, string> = { 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' };
const rankOf = (id: number | undefined) => (id === undefined ? 'Ace' : RANK_BY_ID[id] ?? String(id));

/** `Card:set_ability` 的形状，从 center 的 config 现算（消耗品、优惠券、补充包在复刻件里没有 ability） */
function abilityOf(key: string): Record<string, unknown> {
    const c = P_CENTERS[key]!;
    const cfg = c.config;
    const a: Record<string, unknown> = {
        name: c.name, effect: c.effect, set: c.set, mult: cfg.mult ?? 0, x_mult: cfg.Xmult ?? 1,
        extra: cfg.extra, type: cfg.type ?? '', bonus: cfg.bonus ?? 0, perma_bonus: 0,
    };
    if (c.consumeable) a.consumeable = cfg;
    return a;
}

export function popupOfJoker(j: Joker, area: PopupCard['area']): PopupCard {
    return { centerKey: j.key, ability: j.ability as unknown as Record<string, unknown>, edition: j.edition, debuff: j.debuff, area };
}

export function popupOfConsumable(c: Consumable, area: PopupCard['area']): PopupCard {
    return { centerKey: c.key, ability: abilityOf(c.key), edition: c.edition, area };
}

export function popupOfCenter(key: string, area: PopupCard['area']): PopupCard {
    return { centerKey: key, ability: abilityOf(key), area };
}

export function popupOfCard(card: Card, area: PopupCard['area']): PopupCard {
    const key = card.enhancement ?? 'c_base';
    const ability = abilityOf(key);
    ability.set = card.enhancement ? 'Enhanced' : 'Default';
    ability.perma_bonus = card.perma_bonus;
    return {
        centerKey: key, ability, area,
        base: { value: card.base.value, suit: card.base.suit, nominal: card.base.nominal },
        edition: card.edition, seal: card.seal, debuff: card.debuff,
    };
}

/** `G.GAME` 与区域的快照 */
export function popupGame(run: Run, mobile: boolean): PopupGame {
    const round = run.round;
    return {
        probabilitiesNormal: runModifiers(run.jokers).probabilityNormal,
        hands: run.hands,
        tarotUsed: run.consumableUsage.total.tarot,
        planetsUsed: distinctPlanetsUsed(run.consumableUsage),
        dollars: round ? round.dollars : run.dollars,
        idolCard: { rank: rankOf(run.idolCard?.id), suit: run.idolCard?.suit ?? 'Spades' },
        ancientSuit: run.ancientSuit,
        castleSuit: run.castleSuit,
        mailRank: rankOf(run.mailCard),
        startingDeckSize: 52,
        playingCards: run.fullDeck.length,
        deckCards: round && run.state === 'playing' ? round.deck.length : run.fullDeck.length - (run.packHand?.length ?? 0),
        jokers: run.jokers.map((j) => ({ sell_cost: j.sell_cost, negative: j.edition === 'negative' })),
        lastTarotPlanet: run.lastTarotPlanet,
        ectoMinus: run.ectoplasmMinus,
        bossDisableable: !!(round?.blind && round.blind.center.boss && !round.blind.disabled),
        mobile,
    };
}
