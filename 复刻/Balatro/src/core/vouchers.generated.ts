/**
 * 32 张优惠券的 center。**这个文件是生成的，不要手改**——
 * 改 `tools/gen-voucher-centers.mjs` 然后重跑 `node tools/gen-voucher-centers.mjs`。
 *
 * 源：`参考/产物/Balatro_1.0.1o/源码/game.lua:593-625`。图集是 `Vouchers.png`。
 */

import type { VoucherCenter } from './vouchers';

export const VOUCHER_CENTERS: Record<string, VoucherCenter> = {
    v_overstock_norm: {"order":1,"name":"Overstock","cost":10,"unlocked":true,"pos":{"x":0,"y":0},"config":{}},
    v_overstock_plus: {"order":2,"name":"Overstock Plus","cost":10,"unlocked":false,"requires":["v_overstock_norm"],"pos":{"x":0,"y":1},"config":{}},
    v_clearance_sale: {"order":3,"name":"Clearance Sale","cost":10,"unlocked":true,"pos":{"x":3,"y":0},"config":{"extra":25}},
    v_liquidation: {"order":4,"name":"Liquidation","cost":10,"unlocked":false,"requires":["v_clearance_sale"],"pos":{"x":3,"y":1},"config":{"extra":50}},
    v_hone: {"order":5,"name":"Hone","cost":10,"unlocked":true,"pos":{"x":4,"y":0},"config":{"extra":2}},
    v_glow_up: {"order":6,"name":"Glow Up","cost":10,"unlocked":false,"requires":["v_hone"],"pos":{"x":4,"y":1},"config":{"extra":4}},
    v_reroll_surplus: {"order":7,"name":"Reroll Surplus","cost":10,"unlocked":true,"pos":{"x":0,"y":2},"config":{"extra":2}},
    v_reroll_glut: {"order":8,"name":"Reroll Glut","cost":10,"unlocked":false,"requires":["v_reroll_surplus"],"pos":{"x":0,"y":3},"config":{"extra":2}},
    v_crystal_ball: {"order":9,"name":"Crystal Ball","cost":10,"unlocked":true,"pos":{"x":2,"y":2},"config":{"extra":3}},
    v_omen_globe: {"order":10,"name":"Omen Globe","cost":10,"unlocked":false,"requires":["v_crystal_ball"],"pos":{"x":2,"y":3},"config":{"extra":4}},
    v_telescope: {"order":11,"name":"Telescope","cost":10,"unlocked":true,"pos":{"x":3,"y":2},"config":{"extra":3}},
    v_observatory: {"order":12,"name":"Observatory","cost":10,"unlocked":false,"requires":["v_telescope"],"pos":{"x":3,"y":3},"config":{"extra":1.5}},
    v_grabber: {"order":13,"name":"Grabber","cost":10,"unlocked":true,"pos":{"x":5,"y":0},"config":{"extra":1}},
    v_nacho_tong: {"order":14,"name":"Nacho Tong","cost":10,"unlocked":false,"requires":["v_grabber"],"pos":{"x":5,"y":1},"config":{"extra":1}},
    v_wasteful: {"order":15,"name":"Wasteful","cost":10,"unlocked":true,"pos":{"x":6,"y":0},"config":{"extra":1}},
    v_recyclomancy: {"order":16,"name":"Recyclomancy","cost":10,"unlocked":false,"requires":["v_wasteful"],"pos":{"x":6,"y":1},"config":{"extra":1}},
    v_tarot_merchant: {"order":17,"name":"Tarot Merchant","cost":10,"unlocked":true,"pos":{"x":1,"y":0},"config":{"extra":2.4,"extra_disp":2}},
    v_tarot_tycoon: {"order":18,"name":"Tarot Tycoon","cost":10,"unlocked":false,"requires":["v_tarot_merchant"],"pos":{"x":1,"y":1},"config":{"extra":8,"extra_disp":4}},
    v_planet_merchant: {"order":19,"name":"Planet Merchant","cost":10,"unlocked":true,"pos":{"x":2,"y":0},"config":{"extra":2.4,"extra_disp":2}},
    v_planet_tycoon: {"order":20,"name":"Planet Tycoon","cost":10,"unlocked":false,"requires":["v_planet_merchant"],"pos":{"x":2,"y":1},"config":{"extra":8,"extra_disp":4}},
    v_seed_money: {"order":21,"name":"Seed Money","cost":10,"unlocked":true,"pos":{"x":1,"y":2},"config":{"extra":50}},
    v_money_tree: {"order":22,"name":"Money Tree","cost":10,"unlocked":false,"requires":["v_seed_money"],"pos":{"x":1,"y":3},"config":{"extra":100}},
    v_blank: {"order":23,"name":"Blank","cost":10,"unlocked":true,"pos":{"x":7,"y":0},"config":{"extra":5}},
    v_antimatter: {"order":24,"name":"Antimatter","cost":10,"unlocked":false,"requires":["v_blank"],"pos":{"x":7,"y":1},"config":{"extra":15}},
    v_magic_trick: {"order":25,"name":"Magic Trick","cost":10,"unlocked":true,"pos":{"x":4,"y":2},"config":{"extra":4}},
    v_illusion: {"order":26,"name":"Illusion","cost":10,"unlocked":false,"requires":["v_magic_trick"],"pos":{"x":4,"y":3},"config":{"extra":4}},
    v_hieroglyph: {"order":27,"name":"Hieroglyph","cost":10,"unlocked":true,"pos":{"x":5,"y":2},"config":{"extra":1}},
    v_petroglyph: {"order":28,"name":"Petroglyph","cost":10,"unlocked":false,"requires":["v_hieroglyph"],"pos":{"x":5,"y":3},"config":{"extra":1}},
    v_directors_cut: {"order":29,"name":"Director's Cut","cost":10,"unlocked":true,"pos":{"x":6,"y":2},"config":{"extra":10}},
    v_retcon: {"order":30,"name":"Retcon","cost":10,"unlocked":false,"requires":["v_directors_cut"],"pos":{"x":6,"y":3},"config":{"extra":10}},
    v_paint_brush: {"order":31,"name":"Paint Brush","cost":10,"unlocked":true,"pos":{"x":7,"y":2},"config":{"extra":1}},
    v_palette: {"order":32,"name":"Palette","cost":10,"unlocked":false,"requires":["v_paint_brush"],"pos":{"x":7,"y":3},"config":{"extra":1}},
};

/** 按 `order` 排好的 key。`P_CENTER_POOLS.Voucher` 的顺序（`game.lua:851` 按 order 排） */
export const VOUCHER_KEYS_BY_ORDER: string[] = [
    'v_overstock_norm',
    'v_overstock_plus',
    'v_clearance_sale',
    'v_liquidation',
    'v_hone',
    'v_glow_up',
    'v_reroll_surplus',
    'v_reroll_glut',
    'v_crystal_ball',
    'v_omen_globe',
    'v_telescope',
    'v_observatory',
    'v_grabber',
    'v_nacho_tong',
    'v_wasteful',
    'v_recyclomancy',
    'v_tarot_merchant',
    'v_tarot_tycoon',
    'v_planet_merchant',
    'v_planet_tycoon',
    'v_seed_money',
    'v_money_tree',
    'v_blank',
    'v_antimatter',
    'v_magic_trick',
    'v_illusion',
    'v_hieroglyph',
    'v_petroglyph',
    'v_directors_cut',
    'v_retcon',
    'v_paint_brush',
    'v_palette',
];
