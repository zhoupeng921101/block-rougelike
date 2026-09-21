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
 * `vars`（本地化文本）没有抽进来，它不属于复刻层。
 * `boss_colour` 是 Boss 的主色（十六进制串），左侧面板随盲注换色要用（22 号票）。
 */

import type { BlindCenter } from './blinds';

export const BLIND_CENTERS: Record<string, BlindCenter> = {
    bl_small: {"order":1,"name":"Small Blind","dollars":3,"mult":1,"pos":{"x":0,"y":0},"boss":null,"debuff":{}},
    bl_big: {"order":2,"name":"Big Blind","dollars":4,"mult":1.5,"pos":{"x":0,"y":1},"boss":null,"debuff":{}},
    bl_hook: {"order":3,"name":"The Hook","dollars":5,"mult":2,"pos":{"x":0,"y":7},"boss":{"min":1,"max":10},"debuff":{},"boss_colour":"a84024"},
    bl_ox: {"order":4,"name":"The Ox","dollars":5,"mult":2,"pos":{"x":0,"y":2},"boss":{"min":6,"max":10},"debuff":{},"boss_colour":"b95b08"},
    bl_house: {"order":5,"name":"The House","dollars":5,"mult":2,"pos":{"x":0,"y":3},"boss":{"min":2,"max":10},"debuff":{},"boss_colour":"5186a8"},
    bl_wall: {"order":6,"name":"The Wall","dollars":5,"mult":4,"pos":{"x":0,"y":9},"boss":{"min":2,"max":10},"debuff":{},"boss_colour":"8a59a5"},
    bl_wheel: {"order":7,"name":"The Wheel","dollars":5,"mult":2,"pos":{"x":0,"y":10},"boss":{"min":2,"max":10},"debuff":{},"boss_colour":"50bf7c"},
    bl_arm: {"order":8,"name":"The Arm","dollars":5,"mult":2,"pos":{"x":0,"y":11},"boss":{"min":2,"max":10},"debuff":{},"boss_colour":"6865f3"},
    bl_club: {"order":9,"name":"The Club","dollars":5,"mult":2,"pos":{"x":0,"y":4},"boss":{"min":1,"max":10},"debuff":{"suit":"Clubs"},"boss_colour":"b9cb92"},
    bl_fish: {"order":10,"name":"The Fish","dollars":5,"mult":2,"pos":{"x":0,"y":5},"boss":{"min":2,"max":10},"debuff":{},"boss_colour":"3e85bd"},
    bl_psychic: {"order":11,"name":"The Psychic","dollars":5,"mult":2,"pos":{"x":0,"y":12},"boss":{"min":1,"max":10},"debuff":{"h_size_ge":5},"boss_colour":"efc03c"},
    bl_goad: {"order":12,"name":"The Goad","dollars":5,"mult":2,"pos":{"x":0,"y":13},"boss":{"min":1,"max":10},"debuff":{"suit":"Spades"},"boss_colour":"b95c96"},
    bl_water: {"order":13,"name":"The Water","dollars":5,"mult":2,"pos":{"x":0,"y":14},"boss":{"min":2,"max":10},"debuff":{},"boss_colour":"c6e0eb"},
    bl_window: {"order":14,"name":"The Window","dollars":5,"mult":2,"pos":{"x":0,"y":6},"boss":{"min":1,"max":10},"debuff":{"suit":"Diamonds"},"boss_colour":"a9a295"},
    bl_manacle: {"order":15,"name":"The Manacle","dollars":5,"mult":2,"pos":{"x":0,"y":8},"boss":{"min":1,"max":10},"debuff":{},"boss_colour":"575757"},
    bl_eye: {"order":16,"name":"The Eye","dollars":5,"mult":2,"pos":{"x":0,"y":17},"boss":{"min":3,"max":10},"debuff":{},"boss_colour":"4b71e4"},
    bl_mouth: {"order":17,"name":"The Mouth","dollars":5,"mult":2,"pos":{"x":0,"y":18},"boss":{"min":2,"max":10},"debuff":{},"boss_colour":"ae718e"},
    bl_plant: {"order":18,"name":"The Plant","dollars":5,"mult":2,"pos":{"x":0,"y":19},"boss":{"min":4,"max":10},"debuff":{"is_face":"face"},"boss_colour":"709284"},
    bl_serpent: {"order":19,"name":"The Serpent","dollars":5,"mult":2,"pos":{"x":0,"y":15},"boss":{"min":5,"max":10},"debuff":{},"boss_colour":"439a4f"},
    bl_pillar: {"order":20,"name":"The Pillar","dollars":5,"mult":2,"pos":{"x":0,"y":16},"boss":{"min":1,"max":10},"debuff":{},"boss_colour":"7e6752"},
    bl_needle: {"order":21,"name":"The Needle","dollars":5,"mult":1,"pos":{"x":0,"y":20},"boss":{"min":2,"max":10},"debuff":{},"boss_colour":"5c6e31"},
    bl_head: {"order":22,"name":"The Head","dollars":5,"mult":2,"pos":{"x":0,"y":21},"boss":{"min":1,"max":10},"debuff":{"suit":"Hearts"},"boss_colour":"ac9db4"},
    bl_tooth: {"order":23,"name":"The Tooth","dollars":5,"mult":2,"pos":{"x":0,"y":22},"boss":{"min":3,"max":10},"debuff":{},"boss_colour":"b52d2d"},
    bl_flint: {"order":24,"name":"The Flint","dollars":5,"mult":2,"pos":{"x":0,"y":24},"boss":{"min":2,"max":10},"debuff":{},"boss_colour":"e56a2f"},
    bl_mark: {"order":25,"name":"The Mark","dollars":5,"mult":2,"pos":{"x":0,"y":23},"boss":{"min":2,"max":10},"debuff":{},"boss_colour":"6a3847"},
    bl_final_acorn: {"order":26,"name":"Amber Acorn","dollars":8,"mult":2,"pos":{"x":0,"y":27},"boss":{"showdown":true,"min":10,"max":10},"debuff":{},"boss_colour":"fda200"},
    bl_final_leaf: {"order":27,"name":"Verdant Leaf","dollars":8,"mult":2,"pos":{"x":0,"y":28},"boss":{"showdown":true,"min":10,"max":10},"debuff":{},"boss_colour":"56a786"},
    bl_final_vessel: {"order":28,"name":"Violet Vessel","dollars":8,"mult":6,"pos":{"x":0,"y":29},"boss":{"showdown":true,"min":10,"max":10},"debuff":{},"boss_colour":"8a71e1"},
    bl_final_heart: {"order":29,"name":"Crimson Heart","dollars":8,"mult":2,"pos":{"x":0,"y":25},"boss":{"showdown":true,"min":10,"max":10},"debuff":{},"boss_colour":"ac3232"},
    bl_final_bell: {"order":30,"name":"Cerulean Bell","dollars":8,"mult":2,"pos":{"x":0,"y":26},"boss":{"showdown":true,"min":10,"max":10},"debuff":{},"boss_colour":"009cfd"},
};
