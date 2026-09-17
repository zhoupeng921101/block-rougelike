# -*- coding: utf-8 -*-
"""Balatro 补充包 / 强化牌总表。

两类各有一个「和别处都不一样」的地方,不知道会拿不到数据:

补充包 Booster —— **描述不在 `descriptions.Booster` 里**。`generate_card_ui`
    (`common_events.lua:2662`)把 key 改写成 `desc_override`(`p_arcana_normal_1`
    去掉尾号 -> `p_arcana_normal`),再去 `descriptions.Other` 取名称与文案。
    32 个包只有 15 条文案(5 种 × 3 档),4 个同档同种的包共用一条。
    loc_vars 统一是 `{config.choose, config.extra}`。
    原型表里另有 `kind`(种类)与 `weight`(商店出货权重),是这张表的主要数值。

强化牌 Enhanced —— loc_vars 按 **`_c.effect`** 分派而不是按 key
    (`'Mult Card'` / `'Glass Card'` / …)。效果消费端 8 张里有 5 张压根不出现
    名字:`set_ability` 把 config 拷进 `ability.*`,再由 `Card:get_chip_bonus` /
    `get_chip_mult` / `get_chip_x_mult` / `get_chip_h_x_mult` / `get_p_dollars`
    这几个通用 getter 直接读走。只有石头牌、幸运牌(比 `ability.effect`)
    与万能牌(比 `ability.name`,见 `card.lua:4072` 的 is_suit)是按名字写的。
    所以「数值消费点」列比「名字出现处」列更能说明这张牌怎么生效。

用法: python balatro_packs.py [源码目录] [配置目录] [文本目录]
"""
import io
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if hasattr(sys.stdout, 'reconfigure'):   # Windows 控制台默认 GBK
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from balatro_jokers import fill, flat_config, join_text, plain
from balatro_meta import load_key_names, write_table

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TIER_CN = {'normal': '普通', 'jumbo': '巨型', 'mega': '超巨'}
KIND_CN = {
    'Arcana': '塔罗', 'Celestial': '星球', 'Spectral': '幽灵',
    'Standard': '扑克牌', 'Buffoon': '小丑',
}


def scan_effect_uses(src_dir, effects):
    """扫 `effect == '<名>'` 与 `name == '<名>'`,记下消费点 文件:行号。

    两种都要扫:石头牌/幸运牌比的是 `ability.effect`,而万能牌比的是
    `ability.name == "Wild Card"`(card.lua:4072 的 is_suit),只扫 effect 会漏掉。
    单双引号同样都认。
    """
    out = {e: [] for e in effects}
    res = {e: re.compile(r"""(?:effect|name)\s*==\s*(?:"%s"|'%s')"""
                         % (re.escape(e), re.escape(e))) for e in effects}
    for base, _, files in os.walk(src_dir):
        for fn in sorted(files):
            if not fn.endswith('.lua'):
                continue
            rel = os.path.relpath(os.path.join(base, fn), src_dir).replace(os.sep, '/')
            if rel == 'game.lua':          # 原型表,声明不是生效点
                continue
            text = io.open(os.path.join(base, fn), encoding='utf-8',
                           errors='replace').read()
            for i, l in enumerate(text.split('\n'), 1):
                for e, rx in res.items():
                    if rx.search(l) and len(out[e]) < 6:
                        out[e].append('%s:%d' % (rel, i))
    return out


def build_boosters(cfg_dir, key_names, loc_zh, loc_en):
    items = json.load(io.open(os.path.join(cfg_dir, '配置JSON', 'P_CENTERS.Booster.json'),
                              encoding='utf-8'))
    rows = []
    total_weight = sum(v.get('weight') or 0 for v in items.values())
    for key in sorted(items, key=lambda k: items[k].get('order', 0)):
        it = items[key]
        cfg = it.get('config') or {}
        desc_key = re.sub(r'_\d+$', '', key)        # p_arcana_normal_1 -> p_arcana_normal
        tier = desc_key.rsplit('_', 1)[-1]
        zh_d = (loc_zh['descriptions']['Other'].get(desc_key) or {})
        en_d = (loc_en['descriptions']['Other'].get(desc_key) or {})
        vals = [cfg.get('choose'), cfg.get('extra')]
        choose = cfg.get('choose') or 0
        w = it.get('weight') or 0

        rows.append({
            'key': key,
            '中文名': zh_d.get('name', ''),
            '英文名': it.get('name', ''),
            '种类': KIND_CN.get(it.get('kind'), it.get('kind', '')),
            'kind': it.get('kind', ''),
            '档位': TIER_CN.get(tier, tier),
            '售价': it.get('cost', ''),
            '可选数': choose,
            '候选数': cfg.get('extra'),
            '每张成本': round((it.get('cost') or 0) / choose, 2) if choose else '',
            '出货权重': w,
            '权重占比%': round(100.0 * w / total_weight, 2) if total_weight else '',
            '中文描述': plain(fill(join_text(zh_d.get('text')), vals)),
            '英文描述': plain(fill(join_text(en_d.get('text')), vals)),
            '数值参数': '; '.join(flat_config(cfg)),
            '描述键': desc_key,
            'order': it.get('order', ''),
            '图片': '图片资源/Booster/%s.png' % key,
        })
    write_table(cfg_dir, '_补充包总表', rows, '补充包')
    return rows


def build_enhanced(src, cfg_dir, key_names, loc_zh, loc_en):
    items = json.load(io.open(os.path.join(cfg_dir, '配置JSON', 'P_CENTERS.Enhanced.json'),
                              encoding='utf-8'))
    effects = sorted({v.get('effect') for v in items.values() if v.get('effect')})
    uses = scan_effect_uses(src, effects)

    # common_events.lua:2650 起按 effect 分派的 loc_vars,照抄成表
    LOC_VARS = {
        'Mult Card': ['config.mult'],
        'Wild Card': [],
        'Glass Card': ['config.Xmult', '概率分子(默认1)', 'config.extra'],
        'Steel Card': ['config.h_x_mult'],
        'Stone Card': ['config.bonus'],
        'Gold Card': ['config.h_dollars'],
        'Lucky Card': ['概率分子(默认1)', 'config.mult', '5', 'config.p_dollars', '15'],
        'Bonus Card': [],
    }

    # config 字段 -> 真正把它读走的地方。强化牌的效果绝大多数不靠名字,
    # 而是这几个通用 getter 直接读 ability.<字段>(由 set_ability 从 config 拷来)
    FIELD_CONSUMER = {
        'bonus': 'Card:get_chip_bonus (card.lua:977)',
        'mult': 'Card:get_chip_mult (card.lua:985)',
        'Xmult': 'Card:get_chip_x_mult (card.lua:1000, 读 ability.x_mult)',
        'h_x_mult': 'Card:get_chip_h_x_mult (card.lua:1012)',
        'p_dollars': 'Card:get_p_dollars (card.lua:1069)',
        'h_dollars': '回合结算发钱 (state_events.lua)',
        'extra': '摧毁概率分母 (Card:shatter 路径)',
    }
    # 玩法代码里真按名字判的三张:石头牌与幸运牌比 ability.effect,
    # 万能牌比 ability.name(card.lua:4072 is_suit)。其余五张全靠 config 字段
    BY_NAME = {'Stone Card', 'Lucky Card', 'Wild Card'}

    def pick(path, cfg):
        if path.startswith('config.'):
            return cfg.get(path.split('.', 1)[1])
        return path if not path.isdigit() else int(path)

    rows = []
    for key in sorted(items, key=lambda k: items[k].get('order', 0)):
        it = items[key]
        cfg = it.get('config') or {}
        eff = it.get('effect', '')
        zh_d = loc_zh['descriptions']['Enhanced'].get(key) or {}
        en_d = loc_en['descriptions']['Enhanced'].get(key) or {}
        paths = LOC_VARS.get(eff, [])
        vals = [pick(p, cfg) for p in paths]
        vals = [1 if v == '概率分子(默认1)' else v for v in vals]

        zh_txt, en_txt = join_text(zh_d.get('text')), join_text(en_d.get('text'))
        # common_events.lua:2659 —— 除石头牌外,凡有 config.bonus 的都再追加一行
        # Other.card_extra_chips。奖励牌的 text 是空的,整条描述全靠这一行
        if cfg.get('bonus') and eff != 'Stone Card':
            for txt, lc in ((zh_txt, loc_zh), (en_txt, loc_en)):
                extra = (lc['descriptions']['Other'].get('card_extra_chips') or {})
                line = fill(join_text(extra.get('text')), [cfg['bonus']])
                if lc is loc_zh:
                    zh_txt = (zh_txt + ' ' + line).strip()
                else:
                    en_txt = (en_txt + ' ' + line).strip()

        rows.append({
            'key': key,
            '中文名': zh_d.get('name', ''),
            '英文名': it.get('name', ''),
            'effect': eff,
            '中文描述': plain(fill(zh_txt, vals)),
            '英文描述': plain(fill(en_txt, vals)),
            '数值参数': '; '.join(flat_config(cfg)),
            '附加筹码': cfg.get('bonus', ''),
            '占位变量取值': ' | '.join('#%d#=%s' % (i + 1, v) for i, v in enumerate(vals)),
            'loc_vars取自': ' | '.join(paths),
            '生效方式': ('玩法代码按名字判' if eff in BY_NAME
                         else 'config 字段被通用 getter 读走'),
            '数值消费点': ' ; '.join(FIELD_CONSUMER[k] for k in sorted(cfg)
                                     if k in FIELD_CONSUMER),
            '名字出现处': ' ; '.join(uses.get(eff, [])),   # effect== 与 name== 两种都扫
            '每副上限': it.get('max', ''),
            'order': it.get('order', ''),
            '图片': '图片资源/Enhanced/%s.png' % key,
        })
    write_table(cfg_dir, '_强化牌总表', rows, '强化牌')
    return rows


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '源码')
    cfg_dir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, '配置')
    txt_dir = sys.argv[3] if len(sys.argv) > 3 else os.path.join(ROOT, '文本')

    key_names = load_key_names(txt_dir)
    loc_zh = json.load(io.open(os.path.join(txt_dir, 'zh_CN.json'), encoding='utf-8'))
    loc_en = json.load(io.open(os.path.join(txt_dir, 'en-us.json'), encoding='utf-8'))

    build_boosters(cfg_dir, key_names, loc_zh, loc_en)
    build_enhanced(src, cfg_dir, key_names, loc_zh, loc_en)


if __name__ == '__main__':
    main()
