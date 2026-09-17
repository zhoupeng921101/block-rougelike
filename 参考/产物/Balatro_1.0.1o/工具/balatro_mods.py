# -*- coding: utf-8 -*-
"""Balatro 版本(Edition) / 蜡封(Seal)总表。

这是八类内容里最后两类,也是最不「配置化」的两类:

版本 Edition —— 原型表 5 条,每条只有一个 `config.extra`。但**只有 3 个被读**:
    `card.lua:392/397/402` 分别把 `e_holo` / `e_foil` / `e_polychrome` 的 extra
    拷进 `self.edition.mult / chips / x_mult`。`e_negative.config.extra = 1`
    **从头到尾没有任何地方读它** —— 负片的 +1 槽位是 `card.lua:409-413` 写死的
    `card_limit + 1`。另外版本的售价加成(foil +2 / holo +3 / poly +5 / neg +5)
    也是 `card.lua:372-373` 的字面量,不在 config 里。
    掉率来自 `common_events.lua:2094` 的 `poll_edition`,是**累积阈值**写法。

蜡封 Seal —— `P_SEALS` 里**一个 config 字段都没有**,只有 order/set/discovered。
    四种蜡封的全部数值与行为都硬编码在 `card.lua`:金 +$3、红重复触发 1 次、
    蓝回合结束生成星球牌、紫弃牌时生成塔罗牌。文案也不在 `descriptions.Seal`
    (根本没这个集合),而在 `descriptions.Other` 的 `<小写>_seal` 键下。

用法: python balatro_mods.py [源码目录] [配置目录] [文本目录]
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
from balatro_meta import write_table

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# poll_edition(common_events.lua:2094)是累积阈值写法,单档概率要相减。
# 基础 _mod=1 / edition_rate=1;_guaranteed 分支把 _mod 硬编成 25。
EDITION_ODDS = [
    # key,            阈值系数, 效果类型,  效果字段
    ('e_negative',    0.003, '槽位',   '+1 小丑槽(消耗品上是 +1 消耗品槽)'),
    ('e_polychrome',  0.006, 'X倍率',  '乘区'),
    ('e_holo',        0.020, '倍率',   '加倍率'),
    ('e_foil',        0.040, '筹码',   '加筹码'),
]
# card.lua:372-373 的售价加成,字面量,不在 config 里
EDITION_EXTRA_COST = {'e_foil': 2, 'e_holo': 3, 'e_polychrome': 5, 'e_negative': 5}

# 版本 config.extra 被谁读走(card.lua:390-403);负片那条是刻意留空的
EDITION_CONSUMER = {
    'e_holo': 'card.lua:392 -> self.edition.mult',
    'e_foil': 'card.lua:397 -> self.edition.chips',
    'e_polychrome': 'card.lua:402 -> self.edition.x_mult',
    'e_negative': '(无人读 config.extra;+1 槽位写死在 card.lua:409-413)',
    'e_base': '(无 config)',
}

# 蜡封:P_SEALS 没有 config,数值全在 card.lua 里。这里记的是判据与语义,
# 行号由 scan_seal_uses 实扫,改了源码不会对不上。
SEAL_INFO = {
    'Gold':   ('计分结算', '每张给 $3', '写死在 Card:get_p_dollars 里的 ret + 3'),
    'Red':    ('重复触发', '该牌再触发 1 次', 'context.repetition 分支返回 repetitions = 1'),
    'Blue':   ('回合结束', '留在手牌则生成 1 张星球牌', '受消耗品槽位上限限制'),
    'Purple': ('弃牌时',   '生成 1 张塔罗牌', '受消耗品槽位上限限制'),
}


def scan_seal_uses(src_dir):
    """实扫 `seal == '<颜色>'`,单双引号都认。"""
    out = {}
    res = {c: re.compile(r"""seal\s*==\s*(?:"%s"|'%s')""" % (c, c))
           for c in SEAL_INFO}
    for base, _, files in os.walk(src_dir):
        for fn in sorted(files):
            if not fn.endswith('.lua'):
                continue
            rel = os.path.relpath(os.path.join(base, fn), src_dir).replace(os.sep, '/')
            text = io.open(os.path.join(base, fn), encoding='utf-8',
                           errors='replace').read()
            for i, l in enumerate(text.split('\n'), 1):
                for c, rx in res.items():
                    if rx.search(l):
                        out.setdefault(c, [])
                        if len(out[c]) < 6:
                            out[c].append('%s:%d' % (rel, i))
    return out


def build_editions(cfg_dir, loc_zh, loc_en):
    items = json.load(io.open(os.path.join(cfg_dir, '配置JSON', 'P_CENTERS.Edition.json'),
                              encoding='utf-8'))
    thresh = {k: t for k, t, _, _ in EDITION_ODDS}
    kind = {k: s for k, _, s, _ in EDITION_ODDS}
    note = {k: n for k, _, _, n in EDITION_ODDS}
    # 累积阈值 -> 单档概率:按阈值从小到大依次相减
    ordered = sorted(thresh.items(), key=lambda x: x[1])
    single = {}
    prev = 0.0
    for k, t in ordered:
        single[k] = t - prev
        prev = t

    rows = []
    for key in sorted(items, key=lambda k: items[k].get('order', 0)):
        it = items[key]
        cfg = it.get('config') or {}
        zh_d = loc_zh['descriptions']['Edition'].get(key) or {}
        en_d = loc_en['descriptions']['Edition'].get(key) or {}
        vals = [cfg.get('extra')] if cfg.get('extra') is not None else []
        alt = loc_zh['descriptions']['Edition'].get(key + '_consumable')

        base_p = single.get(key)
        rows.append({
            'key': key,
            '中文名': zh_d.get('name', ''),
            '英文名': it.get('name', ''),
            '效果类型': kind.get(key, '无'),
            '效果数值': cfg.get('extra', ''),
            '效果说明': note.get(key, ''),
            '中文描述': plain(fill(join_text(zh_d.get('text')), vals)),
            '英文描述': plain(fill(join_text(en_d.get('text')), vals)),
            '消耗品上的变体描述': plain(fill(join_text((alt or {}).get('text')), vals)),
            '掉率_基础%': round(base_p * 100, 2) if base_p else (96.0 if key == 'e_base' else ''),
            '掉率_保底包%': round(base_p * 25 * 100, 2) if base_p else (0.0 if key == 'e_base' else ''),
            '售价加成$': EDITION_EXTRA_COST.get(key, 0),
            '数值参数': '; '.join(flat_config(cfg)),
            '数值消费点': EDITION_CONSUMER.get(key, ''),
            'order': it.get('order', ''),
            '图片': '图片资源/Edition/%s.png' % key,
        })
    write_table(cfg_dir, '_版本总表', rows, '版本')
    return rows


def build_seals(src, cfg_dir, loc_zh, loc_en):
    items = json.load(io.open(os.path.join(cfg_dir, '配置JSON', 'P_SEALS.json'),
                              encoding='utf-8'))
    uses = scan_seal_uses(src)

    rows = []
    for key in sorted(items, key=lambda k: items[k].get('order', 0)):
        it = items[key]
        dkey = '%s_seal' % key.lower()
        zh_d = loc_zh['descriptions']['Other'].get(dkey) or {}
        en_d = loc_en['descriptions']['Other'].get(dkey) or {}
        when, what, how = SEAL_INFO.get(key, ('', '', ''))
        rows.append({
            'key': key,
            '中文名': zh_d.get('name', ''),
            '英文名': it.get('name', key),
            '触发时机': when,
            '效果': what,
            '中文描述': plain(join_text(zh_d.get('text'))),
            '英文描述': plain(join_text(en_d.get('text'))),
            '数值来源': '硬编码(P_SEALS 无 config)',
            '实现说明': how,
            '生效点': ' ; '.join(uses.get(key, [])),
            '文案键': 'descriptions.Other.%s' % dkey,
            'order': it.get('order', ''),
            '图片': '图片资源/Seal/%s.png' % key,
        })
    write_table(cfg_dir, '_蜡封总表', rows, '蜡封')
    return rows


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '源码')
    cfg_dir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, '配置')
    txt_dir = sys.argv[3] if len(sys.argv) > 3 else os.path.join(ROOT, '文本')

    loc_zh = json.load(io.open(os.path.join(txt_dir, 'zh_CN.json'), encoding='utf-8'))
    loc_en = json.load(io.open(os.path.join(txt_dir, 'en-us.json'), encoding='utf-8'))

    build_editions(cfg_dir, loc_zh, loc_en)
    build_seals(src, cfg_dir, loc_zh, loc_en)


if __name__ == '__main__':
    main()
