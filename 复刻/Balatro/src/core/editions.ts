/**
 * 版本（edition）：Foil / Holographic / Polychrome / Negative。
 *
 * 直译自 `参考/产物/Balatro_1.0.1o/源码/`：
 * - `functions/common_events.lua:2092` `poll_edition`（掷点）
 * - `card.lua:387` `Card:set_edition`（摊平成三个字段）
 * - `card.lua:1016` `Card:get_edition`（结算时读出来）
 * - 数值 `game.lua:659-663` 的五个 `e_*` center
 *
 * ## 三个数字
 *
 * | 版本 | 效果 | 出处 |
 * |---|---|---|
 * | Foil | **+50 筹码** | `e_foil.config.extra` |
 * | Holographic | **+10 倍率** | `e_holo.config.extra` |
 * | Polychrome | **×1.5 倍率** | `e_polychrome.config.extra` |
 * | Negative | **+1 格**（小丑区或消耗品区），不参与计分 | `e_negative.config.extra` |
 *
 * ## 小丑身上的版本效果**分两段**
 *
 * 这是最容易写错的一处。`state_events.lua:900` 起，小丑主遍历里的顺序是：
 *
 * 1. 版本的 `chip_mod` 与 `mult_mod`（**加法段**）
 * 2. 小丑自己的效果
 * 3. 小丑对小丑
 * 4. 版本的 `x_mult_mod`（**乘法段**）
 *
 * 也就是说 Polychrome 的 ×1.5 排在**那张小丑自己的 Xmult 之后**。
 * 三段合并成一段会让「Polychrome 的 Baseball Card」算错。
 *
 * **扑克牌身上不分段**（`state_events.lua:780`）：chip → mult → x_mult 一口气走完。
 */

/** 掷点的最小接口。`PseudorandomState` 与消耗品的 `UseContext` 都满足它 */
export type Roller = { pseudorandom(key: string): number };

export type Edition = 'foil' | 'holo' | 'polychrome' | 'negative';

/** `game.lua:659-663` 的 `e_*` center 的 `config.extra`。 */
export const EDITION_VALUES = {
    foil: 50,
    holo: 10,
    polychrome: 1.5,
    negative: 1,
} as const;

/** `G.GAME.edition_rate`（`game.lua:2110`）。基线 1，优惠券能改 */
export const EDITION_RATE = 1;

export type PollEditionOptions = {
    /** `_mod`。标准包传 2，其余默认 1 */
    mod?: number;
    /** `_no_neg`。真值时**不出 Negative** */
    noNeg?: boolean;
    /** `_guaranteed`。真值时四档的门槛全部 ×25，几乎必出 */
    guaranteed?: boolean;
};

/**
 * `common_events.lua:2092` 的 `poll_edition`。
 *
 * **无条件掷一次点**，然后拿那个数过四道门槛。四道门槛从上往下是
 * negative → polychrome → holo → foil，**顺序不能换**：
 * 它们是 `elseif` 链，门槛越往下越宽，换序会让高稀有度那几档被吃掉。
 *
 * `guaranteed` 那一支把系数从 `0.003 / 0.006 / 0.02 / 0.04` 全部 ×25
 * （即 `0.075 / 0.15 / 0.5 / 1.0`），而且**不乘 `edition_rate`**——
 * 两支的公式不一样，别合并。
 */
export function pollEdition(
    rng: Roller,
    key: string,
    options: PollEditionOptions = {},
): Edition | null {
    const mod = options.mod ?? 1;
    const poll = rng.pseudorandom(key);

    if (options.guaranteed) {
        if (poll > 1 - 0.003 * 25 && !options.noNeg) return 'negative';
        if (poll > 1 - 0.006 * 25) return 'polychrome';
        if (poll > 1 - 0.02 * 25) return 'holo';
        if (poll > 1 - 0.04 * 25) return 'foil';
        return null;
    }

    // **negative 那一档不乘 `edition_rate`**（原文只有后三档乘），照抄
    if (poll > 1 - 0.003 * mod && !options.noNeg) return 'negative';
    if (poll > 1 - 0.006 * EDITION_RATE * mod) return 'polychrome';
    if (poll > 1 - 0.02 * EDITION_RATE * mod) return 'holo';
    if (poll > 1 - 0.04 * EDITION_RATE * mod) return 'foil';
    return null;
}

/** `card.lua:1016` 的 `get_edition` 摊出来的那三个字段。 */
export type EditionEffect = {
    chip_mod?: number;
    mult_mod?: number;
    x_mult_mod?: number;
};

/**
 * `card.lua:1016` 的 `Card:get_edition`。
 *
 * **被 debuff 的不给**（原文第一句 `if self.debuff then return end`）。
 * Negative 不进这三个字段——它的效果是格子数，不是分数。
 */
export function getEdition(card: { edition?: Edition; debuff?: boolean }): EditionEffect | null {
    if (card.debuff) return null;
    switch (card.edition) {
        case 'foil':
            return { chip_mod: EDITION_VALUES.foil };
        case 'holo':
            return { mult_mod: EDITION_VALUES.holo };
        case 'polychrome':
            return { x_mult_mod: EDITION_VALUES.polychrome };
        default:
            // Negative 与无版本都落这里
            return null;
    }
}

/**
 * 这一批东西里有几张是 Negative。
 * **每张 +1 格**（`card.lua:408`：`card_limit = card_limit + 1`）。
 */
export function negativeCount(items: ReadonlyArray<{ edition?: Edition }>): number {
    return items.filter((x) => x.edition === 'negative').length;
}
