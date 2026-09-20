/**
 * 30 条盲注定义：小盲注 + 大盲注 + 28 个 Boss。**这个文件是生成的，不要手改**——
 * 改 `tools/gen-blind-centers.mjs` 然后重跑 `node tools/gen-blind-centers.mjs`。
 *
 * 源：`参考/产物/Balatro_1.0.1o/源码/game.lua:266-298` 的 `P_BLINDS`。
 *
 * **key 的字母序有意义**：`get_new_boss` 走 `pseudorandom_element(eligible, …)`，
 * 而 `eligible` 是一张**以 key 为键的表**，`pseudorandom_element` 对这种表
 * 按 key 的字符串序排（`misc_functions.lua:266`）。所以抽 boss 的池子顺序
 * 是 key 的字母序，不是 `order`。
 *
 * `vars`（本地化文本）与 `boss_colour` 没有抽进来：前者不属于复刻层，
 * 后者由表现层自己定。
 */

import type { BlindCenter } from './blinds';

export const BLIND_CENTERS: Record<string, BlindCenter> = {
    bl_small: {"order":1,"name":"Small Blind","dollars":3,"mult":1,"pos":{"x":0,"y":0},"boss":null,"debuff":{}},
    bl_big: {"order":2,"name":"Big Blind","dollars":4,"mult":1.5,"pos":{"x":0,"y":1},"boss":null,"debuff":{}},
    bl_hook: {"order":3,"name":"The Hook","dollars":5,"mult":2,"pos":{"x":0,"y":7},"boss":{"min":1,"max":10},"debuff":{}},
    bl_ox: {"order":4,"name":"The Ox","dollars":5,"mult":2,"pos":{"x":0,"y":2},"boss":{"min":6,"max":10},"debuff":{}},
    bl_house: {"order":5,"name":"The House","dollars":5,"mult":2,"pos":{"x":0,"y":3},"boss":{"min":2,"max":10},"debuff":{}},
    bl_wall: {"order":6,"name":"The Wall","dollars":5,"mult":4,"pos":{"x":0,"y":9},"boss":{"min":2,"max":10},"debuff":{}},
    bl_wheel: {"order":7,"name":"The Wheel","dollars":5,"mult":2,"pos":{"x":0,"y":10},"boss":{"min":2,"max":10},"debuff":{}},
    bl_arm: {"order":8,"name":"The Arm","dollars":5,"mult":2,"pos":{"x":0,"y":11},"boss":{"min":2,"max":10},"debuff":{}},
    bl_club: {"order":9,"name":"The Club","dollars":5,"mult":2,"pos":{"x":0,"y":4},"boss":{"min":1,"max":10},"debuff":{"suit":"Clubs"}},
    bl_fish: {"order":10,"name":"The Fish","dollars":5,"mult":2,"pos":{"x":0,"y":5},"boss":{"min":2,"max":10},"debuff":{}},
    bl_psychic: {"order":11,"name":"The Psychic","dollars":5,"mult":2,"pos":{"x":0,"y":12},"boss":{"min":1,"max":10},"debuff":{"h_size_ge":5}},
    bl_goad: {"order":12,"name":"The Goad","dollars":5,"mult":2,"pos":{"x":0,"y":13},"boss":{"min":1,"max":10},"debuff":{"suit":"Spades"}},
    bl_water: {"order":13,"name":"The Water","dollars":5,"mult":2,"pos":{"x":0,"y":14},"boss":{"min":2,"max":10},"debuff":{}},
    bl_window: {"order":14,"name":"The Window","dollars":5,"mult":2,"pos":{"x":0,"y":6},"boss":{"min":1,"max":10},"debuff":{"suit":"Diamonds"}},
    bl_manacle: {"order":15,"name":"The Manacle","dollars":5,"mult":2,"pos":{"x":0,"y":8},"boss":{"min":1,"max":10},"debuff":{}},
    bl_eye: {"order":16,"name":"The Eye","dollars":5,"mult":2,"pos":{"x":0,"y":17},"boss":{"min":3,"max":10},"debuff":{}},
    bl_mouth: {"order":17,"name":"The Mouth","dollars":5,"mult":2,"pos":{"x":0,"y":18},"boss":{"min":2,"max":10},"debuff":{}},
    bl_plant: {"order":18,"name":"The Plant","dollars":5,"mult":2,"pos":{"x":0,"y":19},"boss":{"min":4,"max":10},"debuff":{"is_face":"face"}},
    bl_serpent: {"order":19,"name":"The Serpent","dollars":5,"mult":2,"pos":{"x":0,"y":15},"boss":{"min":5,"max":10},"debuff":{}},
    bl_pillar: {"order":20,"name":"The Pillar","dollars":5,"mult":2,"pos":{"x":0,"y":16},"boss":{"min":1,"max":10},"debuff":{}},
    bl_needle: {"order":21,"name":"The Needle","dollars":5,"mult":1,"pos":{"x":0,"y":20},"boss":{"min":2,"max":10},"debuff":{}},
    bl_head: {"order":22,"name":"The Head","dollars":5,"mult":2,"pos":{"x":0,"y":21},"boss":{"min":1,"max":10},"debuff":{"suit":"Hearts"}},
    bl_tooth: {"order":23,"name":"The Tooth","dollars":5,"mult":2,"pos":{"x":0,"y":22},"boss":{"min":3,"max":10},"debuff":{}},
    bl_flint: {"order":24,"name":"The Flint","dollars":5,"mult":2,"pos":{"x":0,"y":24},"boss":{"min":2,"max":10},"debuff":{}},
    bl_mark: {"order":25,"name":"The Mark","dollars":5,"mult":2,"pos":{"x":0,"y":23},"boss":{"min":2,"max":10},"debuff":{}},
    bl_final_acorn: {"order":26,"name":"Amber Acorn","dollars":8,"mult":2,"pos":{"x":0,"y":27},"boss":{"showdown":true,"min":10,"max":10},"debuff":{}},
    bl_final_leaf: {"order":27,"name":"Verdant Leaf","dollars":8,"mult":2,"pos":{"x":0,"y":28},"boss":{"showdown":true,"min":10,"max":10},"debuff":{}},
    bl_final_vessel: {"order":28,"name":"Violet Vessel","dollars":8,"mult":6,"pos":{"x":0,"y":29},"boss":{"showdown":true,"min":10,"max":10},"debuff":{}},
    bl_final_heart: {"order":29,"name":"Crimson Heart","dollars":8,"mult":2,"pos":{"x":0,"y":25},"boss":{"showdown":true,"min":10,"max":10},"debuff":{}},
    bl_final_bell: {"order":30,"name":"Cerulean Bell","dollars":8,"mult":2,"pos":{"x":0,"y":26},"boss":{"showdown":true,"min":10,"max":10},"debuff":{}},
};
