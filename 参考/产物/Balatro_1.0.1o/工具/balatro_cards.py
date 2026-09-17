# -*- coding: utf-8 -*-
"""Balatro 塔罗牌 / 幽灵牌 / 优惠券总表。

和 `balatro_jokers.py` 一个路子,但取变量的地方不同:
  - 小丑的 `#1#` 占位来自 card.lua 的 `self.ability.*`(经 set_ability 重命名过)
  - 这三类来自 **functions/common_events.lua** 的 `generate_card_ui`,
    分支形如 `elseif _c.set == 'Tarot' then ... loc_vars = {_c.config.xxx}`,
    直接读 `_c.config`,不过 set_ability 那层,所以解析简单得多

效果归属:
  - 塔罗/幽灵是**配置驱动**的:`use_consumeable`(card.lua:1092)看的是
    `ability.consumeable.mod_conv / suit_conv / hand_type / remove_card / tarots / planets`
    这几个字段,只有特殊的才按名字开分支。所以「作用类型」列是从 config 签名推的
  - 优惠券全部在 `Card:apply_to_run`(card.lua:1882-1974),一个 name 一个 if 块,
    块里改哪个 G.GAME 字段就是它的生效点,「生效字段」列是从块体里抽出来的

用法: python balatro_cards.py [源码目录] [配置目录] [文本目录]
"""
import csv
import io
import json
import math
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if hasattr(sys.stdout, 'reconfigure'):   # Windows 控制台默认 GBK
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from balatro_jokers import (fill, flat_config, join_text, plain, scan_external_refs,
                            split_args, strip_comment)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 塔罗/幽灵的 config 字段 -> 作用类型。use_consumeable 就是看这几个字段分派的。
CONSUMABLE_RULES = [
    ('mod_conv', '转强化', 'card.lua:1144 把选中的牌 set_ability 成 config.mod_conv'),
    ('suit_conv', '转花色', 'card.lua:1140 把选中的牌 change_suit 成 config.suit_conv'),
    ('hand_type', '升级牌型', 'card.lua:1267 对 config.hand_type 调 level_up_hand'),
    ('tarots', '产出塔罗', 'card.lua:1403 生成 config.tarots 张塔罗'),
    ('planets', '产出星球', 'card.lua:1403 生成 config.planets 张星球'),
]


def parse_ui_loc_vars(common_lua, set_name):
    """common_events.lua 的 generate_card_ui 里 `_c.set == '<Set>'` 那一段。

    返回 {英文名: loc_vars 原式 或 None}。整段没有名字分支的(如 Planet 是统一一条)
    返回 {'*': 原式} 表示全集合共用。
    """
    lines = common_lua.split('\n')
    start = next(i for i, l in enumerate(lines)
                 if re.search(r"^\s*(?:els)?e?if _c\.set == '%s' then" % set_name, l))
    # 下一个 set 分支就是边界;Tarot 是链上最后一支,后面直接是收尾的 end,
    # 所以再认一条:缩进不深于分支行的 end
    start_indent = len(lines[start]) - len(lines[start].lstrip())
    end = next(i for i, l in enumerate(lines)
               if i > start and (
                   re.search(r"^\s*elseif _c\.set == '", l) or
                   (re.match(r'^\s*end\s*$', l) and
                    len(l) - len(l.lstrip()) <= start_indent)))

    # 引号要成对认:`"Director's Cut"` 里有撇号,用 ["']([^"']+)["'] 会截成 `Director`
    name_re = re.compile(r"""_c\.name\s*==\s*(?:"([^"]+)"|'([^']+)')""")

    def find_names(line):
        return [a or b for a, b in name_re.findall(line)]
    branch_re = re.compile(r"^\s*(?:els)?e?if\s+_c\.name\s*==")
    out, cur = {}, None
    shared = None
    for l in lines[start + 1:end]:
        s = strip_comment(l)
        if branch_re.match(s):
            if cur:
                out[tuple(cur['names'])] = grab_loc_vars('\n'.join(cur['body']))
            cur = {'names': find_names(s), 'body': [s]}
            continue
        if cur is not None:
            cur['names'] += find_names(s)
            cur['body'].append(s)
        elif 'loc_vars' in s:
            shared = s          # 整个 set 共用一条(Planet 就是)
    if cur:
        out[tuple(cur['names'])] = grab_loc_vars('\n'.join(cur['body']))

    flat = {}
    for names, expr in out.items():
        for n in names:
            flat[n] = expr
    if shared and not flat:
        flat['*'] = grab_loc_vars('\n'.join(lines[start + 1:end]))
    return flat


def grab_loc_vars(body):
    """从一段 Lua 里抠出第一个 `loc_vars = {...}` 的花括号内容。"""
    m = re.search(r'loc_vars\s*=\s*\{', body)
    if not m:
        return None
    i, depth = m.end() - 1, 0
    for j in range(i, len(body)):
        c = body[j]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return body[i + 1:j]
    return None


def resolve_c(expr, cfg):
    """解一条 `_c.config.*` 形式的实参。比小丑那边简单:没有 set_ability 重命名。"""
    e = expr.strip()
    if not e:
        return ''
    # localize{... key = _c.config.mod_conv ...} / localize(_c.config.suit, '...')
    m = re.search(r"key\s*=\s*(_c\.config\.[\w.]+)", e) or \
        re.match(r"^localize[\({]\s*(_c\.config\.[\w.]+)", e)
    if m:
        return resolve_c(m.group(1), cfg)
    if re.match(r"^localize", e):
        lit = re.search(r"'([^']+)'", e)
        return lit.group(1) if lit else e
    if re.match(r"^'[^']*'$", e):
        return e.strip("'")

    def sub(m2):
        v = cfg
        for p in m2.group(1).split('.'):
            v = v.get(p) if isinstance(v, dict) else None
        if v is None:
            return '<无此字段>'
        return repr(v) if not isinstance(v, str) else "'%s'" % v
    e = re.sub(r"_c\.config\.([\w.]+)", sub, e)
    if 'G.' in e or '_c.' in e or '<无此字段>' in e:
        return '<运行时>' if 'G.' in e else e
    try:
        v = eval(e, {'__builtins__': {}}, {})
        if isinstance(v, float) and v == int(v):
            v = int(v)
        return v
    except Exception:
        return e.strip("'")


def parse_apply_to_run(card_lua):
    """Card:apply_to_run 里每个 `center_table.name == 'X'` 块改了什么。"""
    lines = card_lua.split('\n')
    start = next(i for i, l in enumerate(lines) if l.startswith('function Card:apply_to_run'))
    end = next(i for i, l in enumerate(lines) if i > start and l.startswith('function Card:'))

    name_re = re.compile(r"center_table\.name\s*==\s*'([^']+)'")
    out, cur, depth = {}, None, 0
    for l in lines[start + 1:end]:
        s = strip_comment(l)
        if cur is None:
            if name_re.search(s) and re.match(r'^\s*if\b', s):
                cur = {'names': name_re.findall(s), 'body': []}
            continue
        if re.match(r'^\s{4}end\s*$', s):       # 顶层 if 的 end
            for n in cur['names']:
                out[n] = summarize_effect(cur['body'])
            cur = None
            continue
        cur['body'].append(s)
    return out


ASSIGN_RE = re.compile(r'^\s*(G\.[\w.\[\]\']+)\s*=')
# 三种调用都要认:裸函数 ease_ante(...)、方法 G.hand:change_size(...)、G.x.y(...)
CALL_RE = re.compile(r'^\s*((?:[A-Za-z_][\w.]*[:.])?[a-z_]\w*)\(')
SKIP_CALLS = {'return', 'for', 'if', 'local', 'end', 'while', 'elseif', 'function'}


def summarize_effect(body):
    """从块体里挑出「改了哪个全局字段 / 调了哪个函数」。"""
    hits = []
    for s in body:
        m = ASSIGN_RE.match(s)
        if m and m.group(1) not in hits:
            hits.append(m.group(1))
            continue
        m = CALL_RE.match(s)
        if m and m.group(1) not in SKIP_CALLS and m.group(1) + '()' not in hits:
            hits.append(m.group(1) + '()')
    return ' ; '.join(hits)


def scan_used_vouchers(src_dir):
    """券的第二套生效机制:不在 apply_to_run 里改全局,而是在用到的地方查
    `G.GAME.used_vouchers.<key>`(望远镜、预言球、天文台、导演剪辑版这一批)。
    返回 {券key: [文件:行号]}。
    """
    out = {}
    # 点号与中括号两种写法都有:used_vouchers.v_telescope / used_vouchers["v_directors_cut"]
    rx = re.compile(r"""used_vouchers(?:\.(v_\w+)|\[["'](v_\w+)["']\])""")
    for base, _, files in os.walk(src_dir):
        for fn in sorted(files):
            if not fn.endswith('.lua'):
                continue
            rel = os.path.relpath(os.path.join(base, fn), src_dir).replace(os.sep, '/')
            text = io.open(os.path.join(base, fn), encoding='utf-8', errors='replace').read()
            for i, l in enumerate(text.split('\n'), 1):
                for a, b in rx.findall(l):
                    k = a or b
                    out.setdefault(k, [])
                    if len(out[k]) < 4:
                        out[k].append('%s:%d' % (rel, i))
    return out


def consumable_kind(cfg, key):
    """按 config 签名判作用类型,可能命中多条。"""
    kinds = []
    for field, label, _ in CONSUMABLE_RULES:
        if cfg.get(field) is not None:
            kinds.append(label)
    if cfg.get('remove_card'):
        kinds.append('消耗所选牌')
    if not kinds:
        kinds.append('专属逻辑')
    return kinds


def build(set_name, out_name, jokers_like, src, cfg_dir, txt_dir, refs, extra_cols):
    cfg_json = os.path.join(cfg_dir, '配置JSON', 'P_CENTERS.%s.json' % set_name)
    items = json.load(io.open(cfg_json, encoding='utf-8'))
    loc = {lg: json.load(io.open(os.path.join(txt_dir, '%s.json' % lg), encoding='utf-8'))
           for lg in ('zh_CN', 'en-us')}
    # 资产 key -> 中文名,给 mod_conv/suit_conv 这类「变成某某牌」的占位用
    key_names = {}
    for _set, items_ in loc['zh_CN']['descriptions'].items():
        for k, v in (items_ or {}).items():
            if isinstance(v, dict) and v.get('name'):
                key_names.setdefault(k, v['name'])
    # 花色与牌型不在 descriptions 里,在 misc 下另有表
    for tbl in ('suits_plural', 'suits_singular', 'poker_hands'):
        for k, v in (loc['zh_CN']['misc'].get(tbl) or {}).items():
            key_names.setdefault(k, v)

    rows = []
    for key in sorted(items, key=lambda k: items[k].get('order', 0)):
        it = items[key]
        cfg = it.get('config') or {}
        en = it.get('name', '')
        zh_d = loc['zh_CN']['descriptions'][set_name].get(key) or {}
        en_d = loc['en-us']['descriptions'][set_name].get(key) or {}

        expr = jokers_like.get(en, jokers_like.get('*'))
        vals = [resolve_c(a, cfg) for a in split_args(expr)] if expr else []
        # loc_vars 里 localize{key = _c.config.mod_conv} 这类解出来是资产 key(m_lucky),
        # 游戏里显示的是它的本地化名,查一下换过去
        vals = [key_names.get(v, v) if isinstance(v, str) else v for v in vals]

        row = {
            'key': key,
            '中文名': zh_d.get('name', ''),
            '英文名': en,
            '售价': it.get('cost', ''),
            '卖价': math.floor((it.get('cost') or 0) / 2),
        }
        row.update(extra_cols(key, it, cfg))
        row.update({
            '中文描述': plain(fill(join_text(zh_d.get('text')), vals)),
            '英文描述': plain(fill(join_text(en_d.get('text')), vals)),
            '数值参数': '; '.join(flat_config(cfg)),
            '占位变量取值': ' | '.join('#%d#=%s' % (i + 1, v) for i, v in enumerate(vals)),
            'loc_vars原式': (expr or '').strip(),
            '默认解锁': '是' if it.get('unlocked') is not False else '',
            'order': it.get('order', ''),
            '代码出处': ' ; '.join(refs.get(en, [])),
            '图片': '图片资源/%s/%s.png' % (set_name, key),
        })
        rows.append(row)

    cols = list(rows[0].keys())
    path = os.path.join(cfg_dir, '配置CSV', out_name + '.csv')
    with io.open(path, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction='ignore')
        w.writeheader()
        w.writerows(rows)
    with io.open(os.path.join(cfg_dir, '配置JSON', out_name + '.json'), 'w',
                 encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False, indent=1)
    print('%-12s %3d 行 x %2d 列 -> %s.csv' % (set_name, len(rows), len(cols), out_name))
    return rows


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '源码')
    cfg_dir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, '配置')
    txt_dir = sys.argv[3] if len(sys.argv) > 3 else os.path.join(ROOT, '文本')

    card_lua = io.open(os.path.join(src, 'card.lua'), encoding='utf-8', errors='replace').read()
    common = io.open(os.path.join(src, 'functions', 'common_events.lua'),
                     encoding='utf-8', errors='replace').read()
    voucher_fx = parse_apply_to_run(card_lua)

    all_names = set()
    for s in ('Tarot', 'Spectral', 'Voucher'):
        d = json.load(io.open(os.path.join(cfg_dir, '配置JSON', 'P_CENTERS.%s.json' % s),
                              encoding='utf-8'))
        all_names |= {v['name'] for v in d.values() if v.get('name')}
    # 描述链所在区间要跳过(那是显示不是生效),这里只需跳 card.lua 的 UI 段
    refs = scan_external_refs(src, all_names, (708, 950))

    # ---- 塔罗 / 幽灵 ----
    def consumable_extra(key, it, cfg):
        kinds = consumable_kind(cfg, key)
        lo = cfg.get('min_highlighted') or (1 if cfg.get('max_highlighted') else 0)
        hi = cfg.get('max_highlighted') or 0
        return {
            '作用类型': '/'.join(kinds),
            '生效方式': '配置驱动' if kinds != ['专属逻辑'] else 'use_consumeable 按名字',
            '需选牌数': ('%s~%s' % (lo, hi)) if hi else '不需选牌',
            '转换目标': cfg.get('mod_conv') or cfg.get('suit_conv') or '',
            '消耗所选牌': '是' if cfg.get('remove_card') else '',
        }

    for s, name in (('Tarot', '_塔罗总表'), ('Spectral', '_幽灵总表')):
        build(s, name, parse_ui_loc_vars(common, s), src, cfg_dir, txt_dir,
              refs, consumable_extra)

    # ---- 优惠券 ----
    vouchers = json.load(io.open(os.path.join(cfg_dir, '配置JSON', 'P_CENTERS.Voucher.json'),
                                 encoding='utf-8'))
    upgrade_of = {}
    for k, v in vouchers.items():
        for req in (v.get('requires') or []):
            upgrade_of[req] = k

    passive = scan_used_vouchers(src)

    def voucher_extra(key, it, cfg):
        req = (it.get('requires') or [])
        fx = voucher_fx.get(it.get('name', ''), '')
        # 两套机制:买下时改全局(apply_to_run),或买下只记账、用到时查 used_vouchers
        if fx:
            how = 'apply_to_run 即时改全局'
        elif key in passive:
            how = '被动查询 used_vouchers'
        else:
            how = '未定位'
        return {
            '档位': '升级' if req else '基础',
            '前置券': ';'.join(req),
            '升级为': upgrade_of.get(key, ''),
            '生效方式': how,
            '生效字段': fx,
            '查询点': ' ; '.join(passive.get(key, [])),
        }

    build('Voucher', '_优惠券总表', parse_ui_loc_vars(common, 'Voucher'), src,
          cfg_dir, txt_dir, refs, voucher_extra)


if __name__ == '__main__':
    main()
