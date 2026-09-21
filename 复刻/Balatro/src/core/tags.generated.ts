/**
 * 24 个标签的 center。**这个文件是生成的，不要手改**——
 * 改 `tools/gen-tag-centers.mjs` 然后重跑 `node tools/gen-tag-centers.mjs`。
 *
 * 源：`参考/产物/Balatro_1.0.1o/源码/game.lua:228-251`。图集是 `tags.png`。
 */

import type { TagCenter } from './tags';

export const TAG_CENTERS: Record<string, TagCenter> = {
    tag_uncommon: {"order":1,"name":"Uncommon Tag","pos":{"x":0,"y":0},"config":{"type":"store_joker_create"}},
    tag_rare: {"order":2,"name":"Rare Tag","requires":"j_blueprint","pos":{"x":1,"y":0},"config":{"type":"store_joker_create","odds":3}},
    tag_negative: {"order":3,"name":"Negative Tag","min_ante":2,"requires":"e_negative","pos":{"x":2,"y":0},"config":{"type":"store_joker_modify","edition":"negative","odds":5}},
    tag_foil: {"order":4,"name":"Foil Tag","requires":"e_foil","pos":{"x":3,"y":0},"config":{"type":"store_joker_modify","edition":"foil","odds":2}},
    tag_holo: {"order":5,"name":"Holographic Tag","requires":"e_holo","pos":{"x":0,"y":1},"config":{"type":"store_joker_modify","edition":"holo","odds":3}},
    tag_polychrome: {"order":6,"name":"Polychrome Tag","requires":"e_polychrome","pos":{"x":1,"y":1},"config":{"type":"store_joker_modify","edition":"polychrome","odds":4}},
    tag_investment: {"order":7,"name":"Investment Tag","pos":{"x":2,"y":1},"config":{"type":"eval","dollars":25}},
    tag_voucher: {"order":8,"name":"Voucher Tag","pos":{"x":3,"y":1},"config":{"type":"voucher_add"}},
    tag_boss: {"order":9,"name":"Boss Tag","pos":{"x":0,"y":2},"config":{"type":"new_blind_choice"}},
    tag_standard: {"order":10,"name":"Standard Tag","min_ante":2,"pos":{"x":1,"y":2},"config":{"type":"new_blind_choice"}},
    tag_charm: {"order":11,"name":"Charm Tag","pos":{"x":2,"y":2},"config":{"type":"new_blind_choice"}},
    tag_meteor: {"order":12,"name":"Meteor Tag","min_ante":2,"pos":{"x":3,"y":2},"config":{"type":"new_blind_choice"}},
    tag_buffoon: {"order":13,"name":"Buffoon Tag","min_ante":2,"pos":{"x":4,"y":2},"config":{"type":"new_blind_choice"}},
    tag_handy: {"order":14,"name":"Handy Tag","min_ante":2,"pos":{"x":1,"y":3},"config":{"type":"immediate","dollars_per_hand":1}},
    tag_garbage: {"order":15,"name":"Garbage Tag","min_ante":2,"pos":{"x":2,"y":3},"config":{"type":"immediate","dollars_per_discard":1}},
    tag_ethereal: {"order":16,"name":"Ethereal Tag","min_ante":2,"pos":{"x":3,"y":3},"config":{"type":"new_blind_choice"}},
    tag_coupon: {"order":17,"name":"Coupon Tag","pos":{"x":4,"y":0},"config":{"type":"shop_final_pass"}},
    tag_double: {"order":18,"name":"Double Tag","pos":{"x":5,"y":0},"config":{"type":"tag_add"}},
    tag_juggle: {"order":19,"name":"Juggle Tag","pos":{"x":5,"y":1},"config":{"type":"round_start_bonus","h_size":3}},
    tag_d_six: {"order":20,"name":"D6 Tag","pos":{"x":5,"y":3},"config":{"type":"shop_start"}},
    tag_top_up: {"order":21,"name":"Top-up Tag","min_ante":2,"pos":{"x":4,"y":1},"config":{"type":"immediate","spawn_jokers":2}},
    tag_skip: {"order":22,"name":"Skip Tag","pos":{"x":0,"y":3},"config":{"type":"immediate","skip_bonus":5}},
    tag_orbital: {"order":23,"name":"Orbital Tag","min_ante":2,"pos":{"x":5,"y":2},"config":{"type":"immediate","levels":3}},
    tag_economy: {"order":24,"name":"Economy Tag","pos":{"x":4,"y":3},"config":{"type":"immediate","max":40}},
};

/** 按 `order` 排好的 key。`P_CENTER_POOLS.Tag` 的顺序（`game.lua:857` 按 order 排） */
export const TAG_KEYS_BY_ORDER: string[] = [
    'tag_uncommon',
    'tag_rare',
    'tag_negative',
    'tag_foil',
    'tag_holo',
    'tag_polychrome',
    'tag_investment',
    'tag_voucher',
    'tag_boss',
    'tag_standard',
    'tag_charm',
    'tag_meteor',
    'tag_buffoon',
    'tag_handy',
    'tag_garbage',
    'tag_ethereal',
    'tag_coupon',
    'tag_double',
    'tag_juggle',
    'tag_d_six',
    'tag_top_up',
    'tag_skip',
    'tag_orbital',
    'tag_economy',
];
