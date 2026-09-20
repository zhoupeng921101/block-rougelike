/**
 * 塔罗 22 张 + 星球 12 张的 center 定义。**这个文件是生成的，不要手改**——
 * 改 `tools/gen-consumable-centers.mjs` 然后重跑
 * `node tools/gen-consumable-centers.mjs`。
 *
 * 源：`参考/产物/Balatro_1.0.1o/源码/game.lua` 的 `P_CENTERS` 消耗品段。
 * 幽灵牌不在这里，理由见生成器的文件头注释。
 */

import type { ConsumableCenter } from './types';

export const CONSUMABLE_CENTERS: Record<string, ConsumableCenter> = {
    c_fool: {"order":1,"set":"Tarot","cost":3,"name":"The Fool","pos":{"x":0,"y":0},"effect":"Disable Blind Effect","config":{}},
    c_magician: {"order":2,"set":"Tarot","cost":3,"name":"The Magician","pos":{"x":1,"y":0},"effect":"Enhance","config":{"mod_conv":"m_lucky","max_highlighted":2}},
    c_high_priestess: {"order":3,"set":"Tarot","cost":3,"name":"The High Priestess","pos":{"x":2,"y":0},"effect":"Round Bonus","config":{"planets":2}},
    c_empress: {"order":4,"set":"Tarot","cost":3,"name":"The Empress","pos":{"x":3,"y":0},"effect":"Enhance","config":{"mod_conv":"m_mult","max_highlighted":2}},
    c_emperor: {"order":5,"set":"Tarot","cost":3,"name":"The Emperor","pos":{"x":4,"y":0},"effect":"Round Bonus","config":{"tarots":2}},
    c_heirophant: {"order":6,"set":"Tarot","cost":3,"name":"The Hierophant","pos":{"x":5,"y":0},"effect":"Enhance","config":{"mod_conv":"m_bonus","max_highlighted":2}},
    c_lovers: {"order":7,"set":"Tarot","cost":3,"name":"The Lovers","pos":{"x":6,"y":0},"effect":"Enhance","config":{"mod_conv":"m_wild","max_highlighted":1}},
    c_chariot: {"order":8,"set":"Tarot","cost":3,"name":"The Chariot","pos":{"x":7,"y":0},"effect":"Enhance","config":{"mod_conv":"m_steel","max_highlighted":1}},
    c_justice: {"order":9,"set":"Tarot","cost":3,"name":"Justice","pos":{"x":8,"y":0},"effect":"Enhance","config":{"mod_conv":"m_glass","max_highlighted":1}},
    c_hermit: {"order":10,"set":"Tarot","cost":3,"name":"The Hermit","pos":{"x":9,"y":0},"effect":"Dollar Doubler","config":{"extra":20}},
    c_wheel_of_fortune: {"order":11,"set":"Tarot","cost":3,"name":"The Wheel of Fortune","pos":{"x":0,"y":1},"effect":"Round Bonus","config":{"extra":4}},
    c_strength: {"order":12,"set":"Tarot","cost":3,"name":"Strength","pos":{"x":1,"y":1},"effect":"Round Bonus","config":{"mod_conv":"up_rank","max_highlighted":2}},
    c_hanged_man: {"order":13,"set":"Tarot","cost":3,"name":"The Hanged Man","pos":{"x":2,"y":1},"effect":"Card Removal","config":{"remove_card":true,"max_highlighted":2}},
    c_death: {"order":14,"set":"Tarot","cost":3,"name":"Death","pos":{"x":3,"y":1},"effect":"Card Conversion","config":{"mod_conv":"card","max_highlighted":2,"min_highlighted":2}},
    c_temperance: {"order":15,"set":"Tarot","cost":3,"name":"Temperance","pos":{"x":4,"y":1},"effect":"Joker Payout","config":{"extra":50}},
    c_devil: {"order":16,"set":"Tarot","cost":3,"name":"The Devil","pos":{"x":5,"y":1},"effect":"Enhance","config":{"mod_conv":"m_gold","max_highlighted":1}},
    c_tower: {"order":17,"set":"Tarot","cost":3,"name":"The Tower","pos":{"x":6,"y":1},"effect":"Enhance","config":{"mod_conv":"m_stone","max_highlighted":1}},
    c_star: {"order":18,"set":"Tarot","cost":3,"name":"The Star","pos":{"x":7,"y":1},"effect":"Suit Conversion","config":{"suit_conv":"Diamonds","max_highlighted":3}},
    c_moon: {"order":19,"set":"Tarot","cost":3,"name":"The Moon","pos":{"x":8,"y":1},"effect":"Suit Conversion","config":{"suit_conv":"Clubs","max_highlighted":3}},
    c_sun: {"order":20,"set":"Tarot","cost":3,"name":"The Sun","pos":{"x":9,"y":1},"effect":"Suit Conversion","config":{"suit_conv":"Hearts","max_highlighted":3}},
    c_judgement: {"order":21,"set":"Tarot","cost":3,"name":"Judgement","pos":{"x":0,"y":2},"effect":"Random Joker","config":{}},
    c_world: {"order":22,"set":"Tarot","cost":3,"name":"The World","pos":{"x":1,"y":2},"effect":"Suit Conversion","config":{"suit_conv":"Spades","max_highlighted":3}},
    c_mercury: {"order":1,"set":"Planet","cost":3,"name":"Mercury","pos":{"x":0,"y":3},"effect":"Hand Upgrade","config":{"hand_type":"Pair"}},
    c_venus: {"order":2,"set":"Planet","cost":3,"name":"Venus","pos":{"x":1,"y":3},"effect":"Hand Upgrade","config":{"hand_type":"Three of a Kind"}},
    c_earth: {"order":3,"set":"Planet","cost":3,"name":"Earth","pos":{"x":2,"y":3},"effect":"Hand Upgrade","config":{"hand_type":"Full House"}},
    c_mars: {"order":4,"set":"Planet","cost":3,"name":"Mars","pos":{"x":3,"y":3},"effect":"Hand Upgrade","config":{"hand_type":"Four of a Kind"}},
    c_jupiter: {"order":5,"set":"Planet","cost":3,"name":"Jupiter","pos":{"x":4,"y":3},"effect":"Hand Upgrade","config":{"hand_type":"Flush"}},
    c_saturn: {"order":6,"set":"Planet","cost":3,"name":"Saturn","pos":{"x":5,"y":3},"effect":"Hand Upgrade","config":{"hand_type":"Straight"}},
    c_uranus: {"order":7,"set":"Planet","cost":3,"name":"Uranus","pos":{"x":6,"y":3},"effect":"Hand Upgrade","config":{"hand_type":"Two Pair"}},
    c_neptune: {"order":8,"set":"Planet","cost":3,"name":"Neptune","pos":{"x":7,"y":3},"effect":"Hand Upgrade","config":{"hand_type":"Straight Flush"}},
    c_pluto: {"order":9,"set":"Planet","cost":3,"name":"Pluto","pos":{"x":8,"y":3},"effect":"Hand Upgrade","config":{"hand_type":"High Card"}},
    c_planet_x: {"order":10,"set":"Planet","cost":3,"name":"Planet X","pos":{"x":9,"y":2},"effect":"Hand Upgrade","config":{"hand_type":"Five of a Kind","softlock":true}},
    c_ceres: {"order":11,"set":"Planet","cost":3,"name":"Ceres","pos":{"x":8,"y":2},"effect":"Hand Upgrade","config":{"hand_type":"Flush House","softlock":true}},
    c_eris: {"order":12,"set":"Planet","cost":3,"name":"Eris","pos":{"x":3,"y":2},"effect":"Hand Upgrade","config":{"hand_type":"Flush Five","softlock":true}},
};

/**
 * 按 `order` 排好的 key，**按 set 分开**。`getCurrentPool` 读这个建池。
 *
 * **顺序有意义**：池内下标决定 `pseudorandom_element` 抽到谁，
 * 打乱它会让同 seed 的商店与原版分叉。别改成 `Object.keys`。
 */
export const CONSUMABLE_KEYS_BY_SET = {
    Tarot: [
        'c_fool',
        'c_magician',
        'c_high_priestess',
        'c_empress',
        'c_emperor',
        'c_heirophant',
        'c_lovers',
        'c_chariot',
        'c_justice',
        'c_hermit',
        'c_wheel_of_fortune',
        'c_strength',
        'c_hanged_man',
        'c_death',
        'c_temperance',
        'c_devil',
        'c_tower',
        'c_star',
        'c_moon',
        'c_sun',
        'c_judgement',
        'c_world',
    ],
    Planet: [
        'c_mercury',
        'c_venus',
        'c_earth',
        'c_mars',
        'c_jupiter',
        'c_saturn',
        'c_uranus',
        'c_neptune',
        'c_pluto',
        'c_planet_x',
        'c_ceres',
        'c_eris',
    ],
} as const;
