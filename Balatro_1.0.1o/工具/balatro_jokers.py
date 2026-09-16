# -*- coding: utf-8 -*-
"""Balatro 小丑总表:150 张小丑的效果配置汇总成一张表。

把四处散着的信息拼到一行里:
  1. 原型数据    配置JSON/P_CENTERS.Joker.json  —— 稀有度/售价/config 数值/兼容标记/解锁条件
  2. 描述模板    文本/zh_CN.json、en-us.json    —— 带 #1# #2# 占位的富文本
  3. 占位变量    源码/card.lua 的 generate_UIBox_ability_table(708-950)
                 那条 `elseif self.ability.name == 'X' then loc_vars = {...}` 链,
                 决定 #1# #2# 分别取 config 的哪个字段
  4. 触发时机    源码/card.lua 的 Card:calculate_joker(2294 起)
                 按 context.* 分支归属,顺带记下 cardarea(计分区/手牌区)

`self.ability` 是 set_ability(card.lua:277)从 center.config 拷出来的,字段名不是一一对应
(x_mult <- config.Xmult、mult <- config.mult or 0 ...),映射表见下面的 ABILITY_FROM_CONFIG。
带运行时累加的小丑(搭乘巴士、卡尼奥这类),填进去的是**初始值**,另有「成长型」列标记。

用法: python balatro_jokers.py [源码目录] [配置目录] [文本目录]
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

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# card.lua:277 set_ability —— self.ability.<键> 来自 center.config.<值>,第二项是缺省值
ABILITY_FROM_CONFIG = {
    'mult': ('mult', 0), 'h_mult': ('h_mult', 0), 'h_x_mult': ('h_x_mult', 0),
    'h_dollars': ('h_dollars', 0), 'p_dollars': ('p_dollars', 0),
    't_mult': ('t_mult', 0), 't_chips': ('t_chips', 0),
    'x_mult': ('Xmult', 1), 'h_size': ('h_size', 0), 'd_size': ('d_size', 0),
    'bonus': ('bonus', 0), 'type': ('type', ''), 'extra': ('extra', None),
    'perma_bonus': (None, 0), 'extra_value': (None, 0),
}

RARITY_CN = {1: '普通', 2: '罕见', 3: '稀有', 4: '传奇'}

# calculate_joker 里的 context 名 -> 人话
CONTEXT_CN = {
    'joker_main': '计分主阶段', 'individual': '逐张计分', 'repetition': '重复触发',
    'before': '出牌前', 'after': '出牌后', 'end_of_round': '回合结算',
    'discard': '弃牌时', 'pre_discard': '弃牌前', 'destroying_card': '判定摧毁',
    'remove_playing_cards': '移除卡牌', 'cards_destroyed': '卡牌被摧毁',
    'glass_shattered': '玻璃牌碎裂', 'playing_card_added': '牌组加牌',
    'first_hand_drawn': '首次抽牌', 'setting_blind': '盲注选定', 'blind': '盲注',
    'skip_blind': '跳过盲注', 'buying_card': '购买时', 'selling_card': '卖出其它牌',
    'selling_self': '卖出自身', 'reroll_shop': '重摇商店', 'ending_shop': '离开商店',
    'open_booster': '打开补充包', 'skipping_booster': '跳过补充包',
    'using_consumeable': '使用消耗品', 'consumeable': '消耗品',
    'other_joker': '其它小丑触发', 'debuffed_hand': '手牌被废除',
    'game_over': '游戏结束', 'hook': '钩子', 'final_scoring_step': '最终结算',
    'forcetrigger': '强制触发', 'edition': '版本结算', 'scoring_hand': '计分牌',
    'full_hand': '整手牌', 'card_effects': '卡牌效果', 'cardarea': '区域',
}
AREA_CN = {'G.play': '计分区', 'G.hand': '手牌区', 'G.jokers': '小丑区', 'G.deck': '牌库'}

# 这些 context 字段是**数据**不是触发点(被结算的那张牌、牌型表、计分牌数组…),
# 出现在条件里只是取值,不该当成一层触发时机。context.blueprint 是「我是被蓝图复制的」
# 标志位,同理不算触发点。
DATA_CONTEXTS = {
    'blueprint', 'blueprint_card', 'poker_hands', 'scoring_hand', 'scoring_name',
    'full_hand', 'cards', 'card_effects', 'cardarea', 'other_card', 'removed',
    'destroying_card', 'debuffed_hand',
}

# calculate_joker 的主计分块(card.lua:3634 那个 else)不是靠 context 名字标出来的,
# 它就是「在小丑区、既不是出牌前也不是出牌后」的那一支 —— 加/乘倍率、加筹码的
# 返回值全在里面。解析出来的路径照字面是这个样子,换个人话名。
PATH_ALIAS = {
    '小丑区 > 其余(非出牌前/出牌后)': '小丑区 > 计分主阶段',
}


# ---------------------------------------------------------------- Lua 静态解析

def strip_comment(line):
    """去掉行尾 -- 注释(不考虑字符串里的 --,这份文件里没有)。"""
    i = line.find('--')
    return line[:i] if i >= 0 else line


def parse_loc_vars(card_lua):
    """card.lua 的 generate_UIBox_ability_table 里那条名字 -> loc_vars 链。

    一个分支可能挂多个名字(四色小丑共用一条),loc_vars 可能在条件行之后的行上,
    也可能整支没有 loc_vars(纯静态描述,如 拟像/水花)。
    """
    lines = card_lua.split('\n')
    start = next(i for i, l in enumerate(lines)
                 if "elseif self.ability.set == 'Joker' then" in l)
    end = next(i for i, l in enumerate(lines)
               if i > start and l.startswith('function Card:get_nominal'))
    branch_re = re.compile(r"^\s*(?:els)?e?if\s+self\.ability\.name\s*==")
    name_re = re.compile(r"self\.ability\.name\s*==\s*'([^']+)'")

    branches, cur = [], None
    for l in lines[start + 1:end]:
        s = strip_comment(l)
        if branch_re.match(s):
            if cur:
                branches.append(cur)
            cur = {'names': [], 'body': []}
        if cur is None:
            continue
        cur['names'] += name_re.findall(s)
        cur['body'].append(s)
    if cur:
        branches.append(cur)

    out = {}
    for b in branches:
        body = '\n'.join(b['body'])
        m = re.search(r'loc_vars\s*=\s*\{', body)
        expr = None
        if m:
            # 从 { 起配平,loc_vars 里可能嵌 localize{...}
            i, depth = m.end() - 1, 0
            for j in range(i, len(body)):
                c = body[j]
                if c == '{':
                    depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0:
                        expr = body[i + 1:j]
                        break
        for n in b['names']:
            out[n] = expr
    return out


def split_args(s):
    """按逗号切 loc_vars 的实参,跳过括号/花括号/引号内的逗号。"""
    args, depth, q, cur = [], 0, None, ''
    for c in s:
        if q:
            cur += c
            if c == q:
                q = None
            continue
        if c in '\'"':
            q = c
        elif c in '({[':
            depth += 1
        elif c in ')}]':
            depth -= 1
        elif c == ',' and depth == 0:
            args.append(cur.strip())
            cur = ''
            continue
        cur += c
    if cur.strip():
        args.append(cur.strip())
    return args


# 有一批小丑在 calculate_joker 里**不按名字**结算,而是按 config 签名走通用分支。
# 这里记下每条通用规则的判据行特征,解析时同样归位,再按 config 反挂到具体小丑上。
GENERIC_RULES = [
    # (标记名, 在 card.lua 里认这条规则的正则, 说明)
    ('花色倍率', r"self\.ability\.effect == 'Suit Mult'", '按 config.extra.suit 匹配计分牌花色,给 extra.s_mult 倍率'),
    ('牌型X倍率', r"self\.ability\.x_mult > 1 and \(self\.ability\.type", '打出的牌含 config.type 牌型时,给 config.Xmult 乘区'),
    ('牌型倍率', r"self\.ability\.t_mult > 0 and next\(context\.poker_hands", '打出的牌含 config.type 牌型时,给 config.t_mult 加倍率'),
    ('牌型筹码', r"self\.ability\.t_chips > 0 and next\(context\.poker_hands", '打出的牌含 config.type 牌型时,给 config.t_chips 加筹码'),
]


def match_generic(cfg, effect):
    """一张小丑吃哪条通用规则(可能一条都不吃)。"""
    if effect == 'Suit Mult':
        return '花色倍率'
    if (cfg.get('Xmult') or 0) > 1:
        return '牌型X倍率'
    if (cfg.get('t_mult') or 0) > 0:
        return '牌型倍率'
    if (cfg.get('t_chips') or 0) > 0:
        return '牌型筹码'
    return None


def parse_contexts(card_lua, joker_names):
    """扫 Card:calculate_joker,把每个 self.ability.name == 'X' 归到它所在的 context 分支。

    Lua 没有花括号,靠缩进认块:遇到 elseif/else/end 先弹掉缩进 >= 本行的条件,
    再把本行新的 context.* 压栈。多行条件只看首行,够用。

    返回 (按名字归位的 dict, 通用规则归位的 dict)。
    """
    lines = card_lua.split('\n')
    start = next(i for i, l in enumerate(lines)
                 if l.startswith('function Card:calculate_joker'))
    end = next(i for i, l in enumerate(lines)
               if i > start and l.startswith('function Card:is_suit'))

    # 只认**直接布尔测试**的 context.X:后面跟 [ 或 . 的是取值(context.scoring_hand[i]、
    # context.other_card.ability),前面带 # 的是取长度,都不是分支
    ctx_re = re.compile(r'(?<![#\w.])context\.([a-z_]+)(?![\w\[.])')
    area_re = re.compile(r'context\.cardarea\s*==\s*(G\.\w+)')
    cond_re = re.compile(r'^\s*(if|elseif)\b(.*)')
    close_re = re.compile(r'^\s*(elseif|else|end)\b')
    name_re = re.compile(r"self\.ability\.name\s*==\s*'([^']+)'")

    generic_res = [(tag, re.compile(pat)) for tag, pat, _ in GENERIC_RULES]
    stack = []          # [(缩进, [标签...])]
    siblings = {}       # 缩进 -> 该层 if/elseif 已出现过的 context 标签,给 else 用
    found, generic = {}, {}
    for l in lines[start:end]:
        s = strip_comment(l)
        if not s.strip():
            continue
        indent = len(s) - len(s.lstrip())
        head = s.lstrip().split()[0] if s.strip() else ''
        if close_re.match(s):
            while stack and stack[-1][0] >= indent:
                stack.pop()
            if head == 'end':
                siblings.pop(indent, None)
        m = cond_re.match(s)
        if m:
            if m.group(1) == 'if':          # 新开一层,清掉这层的旧兄弟记录
                siblings[indent] = []
            cond = m.group(2)
            labels = []
            for a in area_re.findall(cond):
                labels.append(AREA_CN.get(a, a))
            for c in ctx_re.findall(cond):
                if c in DATA_CONTEXTS:
                    continue
                labels.append(CONTEXT_CN.get(c, c))
            if labels:
                stack.append((indent, labels))
                siblings.setdefault(indent, [])
                for lab in labels:
                    if lab not in siblings[indent]:
                        siblings[indent].append(lab)
        elif head == 'else':
            # else 分支 = 这层所有 if/elseif 条件都不成立。calculate_joker 的主计分
            # 就藏在这种 else 里(出牌前/出牌后之外的那一支),不标出来会丢掉时机信息。
            # 只在兄弟分支不多时标出来。最外层那个 else 的兄弟是 Planet/Tarot 等
            # 十几种 set 分派,列出来纯是噪音,跳过。
            prior = siblings.get(indent) or []
            if prior and len(prior) <= 3:
                stack.append((indent, ['其余(非%s)' % '/'.join(prior)]))
        path = []
        for _, labels in stack:
            for lab in labels:
                if lab not in path:
                    path.append(lab)
        key = ' > '.join(path)
        for n in name_re.findall(s):
            if n in joker_names:
                found.setdefault(n, [])
                if key and key not in found[n]:
                    found[n].append(key)
        for tag, rx in generic_res:
            if rx.search(s):
                generic.setdefault(tag, [])
                if key and key not in generic[tag]:
                    generic[tag].append(key)
    return found, generic


def scan_external_refs(src_dir, joker_names, skip):
    """calculate_joker 里按名字找不到的小丑,多半是别处 find_joker / 名字比对生效的。

    全树扫一遍 `'<英文名>'`,记下 文件:行号,排除 game.lua 的原型表与 card.lua 的
    loc_vars 描述链(那两处只是声明与显示,不是生效点)。
    """
    refs = {n: [] for n in joker_names}
    # 单双引号都要认:带撇号的名字(Director's Cut)源码里是用双引号写的
    name_res = {n: re.compile(r"""(?:'%s'|"%s")""" % (re.escape(n), re.escape(n)))
                for n in joker_names}
    for base, _, files in os.walk(src_dir):
        for fn in sorted(files):
            if not fn.endswith('.lua'):
                continue
            rel = os.path.relpath(os.path.join(base, fn), src_dir).replace(os.sep, '/')
            if rel == 'game.lua':
                continue
            text = io.open(os.path.join(base, fn), encoding='utf-8', errors='replace').read()
            for i, l in enumerate(text.split('\n'), 1):
                if rel == 'card.lua' and skip[0] <= i <= skip[1]:
                    continue
                if 'loc_vars' in l:
                    continue
                for n, rx in name_res.items():
                    if rx.search(l):
                        if len(refs[n]) < 4:
                            refs[n].append('%s:%d' % (rel, i))
    return refs


# ---------------------------------------------------------------- 表达式求值

RUNTIME_SUBS = [
    # 运行时累加器 / 全局状态 —— 取初始值或常见缺省
    (r"\(self\.ability\.\w+ or 0\)", '0'),
    (r"\(G\.GAME\.consumeable_usage_total and G\.GAME\.consumeable_usage_total\.\w+ or 0\)", '0'),
    (r"''\.\.\(G\.GAME and G\.GAME\.probabilities\.normal or 1\)", '1'),
    (r"\(G\.GAME and G\.GAME\.probabilities\.normal or 1\)", '1'),
    (r"\(\(G\.deck and G\.deck\.cards\) and #G\.deck\.cards or 52\)", '52'),
    (r"#G\.playing_cards", '52'),
]


def resolve_expr(expr, cfg, ability):
    """把一条 loc_vars 实参解析成可显示的值;解不了就回原文。"""
    e = expr.strip()
    if not e:
        return ''
    # localize(...) / localize{...} —— 取里面那个字段的值当名词
    m = re.match(r"^localize[\({]\s*(.+?)\s*,", e) or re.match(r"^localize[\({]\s*'([^']+)'\s*[\)}]", e)
    if m:
        inner = m.group(1).strip()
        if inner.startswith("'"):
            return inner.strip("'")
        v = resolve_expr(inner, cfg, ability)
        return v if v != inner else inner
    if re.match(r"^'[^']*'$", e):
        return e.strip("'")
    for pat, rep in RUNTIME_SUBS:
        e = re.sub(pat, rep, e)
    # self.ability.<路径>
    def sub_ability(m):
        path = m.group(1).split('.')
        head = path[0]
        if head not in ABILITY_FROM_CONFIG:
            return '<运行时:%s>' % '.'.join(path)
        cfg_key, default = ABILITY_FROM_CONFIG[head]
        v = cfg.get(cfg_key, default) if cfg_key else default
        for p in path[1:]:
            v = v.get(p) if isinstance(v, dict) else None
        if v is None:
            return '<运行时:%s>' % '.'.join(path)
        return repr(v) if not isinstance(v, str) else "'%s'" % v
    e = re.sub(r"self\.ability\.([\w.]+)", sub_ability, e)
    if '<运行时' in e or 'G.' in e or 'self' in e:
        return e
    try:
        v = eval(e, {'__builtins__': {}}, {})          # 只剩数字与四则运算
        if isinstance(v, float) and v == int(v):
            v = int(v)
        return v
    except Exception:
        return e.strip("'")


def fill(template, vals):
    """把 #1# #2# 换成实际值;超出范围的占位保留原样。"""
    def rep(m):
        i = int(m.group(1)) - 1
        if 0 <= i < len(vals):
            return str(vals[i])
        return m.group(0)
    return re.sub(r'#(\d+)#', rep, template)


def plain(text):
    """剥掉 {C:red} / {X:mult,C:white} / {} 这类富文本标记,留纯文字。"""
    return re.sub(r'\{[^}]*\}', '', text)


def join_text(v, sep=' '):
    if isinstance(v, str):
        return v
    if isinstance(v, list):
        return sep.join(join_text(x, sep) for x in v)
    return ''


def flat_config(cfg, prefix=''):
    out = []
    for k in sorted(cfg or {}):
        v = cfg[k]
        if isinstance(v, dict):
            out += flat_config(v, prefix + k + '.')
        else:
            out.append('%s%s=%s' % (prefix, k, v))
    return out


# ---------------------------------------------------------------- 主流程

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '源码')
    cfg_dir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, '配置')
    txt_dir = sys.argv[3] if len(sys.argv) > 3 else os.path.join(ROOT, '文本')

    jokers = json.load(io.open(os.path.join(cfg_dir, '配置JSON', 'P_CENTERS.Joker.json'),
                               encoding='utf-8'))
    card_lua = io.open(os.path.join(src, 'card.lua'), encoding='utf-8', errors='replace').read()
    loc = {}
    for lg in ('zh_CN', 'en-us'):
        loc[lg] = json.load(io.open(os.path.join(txt_dir, '%s.json' % lg), encoding='utf-8'))

    names = {v['name']: k for k, v in jokers.items() if v.get('name')}
    loc_vars = parse_loc_vars(card_lua)
    contexts, generic_ctx = parse_contexts(card_lua, set(names))

    # 描述链的行号区间,外部引用扫描要跳过它
    card_lines = card_lua.split('\n')
    chain_a = next(i for i, l in enumerate(card_lines, 1)
                   if "elseif self.ability.set == 'Joker' then" in l)
    chain_b = next(i for i, l in enumerate(card_lines, 1)
                   if i > chain_a and l.startswith('function Card:get_nominal'))
    refs = scan_external_refs(src, set(names), (chain_a, chain_b))
    generic_desc = {tag: desc for tag, _, desc in GENERIC_RULES}

    rows, no_vars, no_ctx = [], [], []
    for key in sorted(jokers, key=lambda k: jokers[k].get('order', 0)):
        j = jokers[key]
        cfg = j.get('config') or {}
        en = j.get('name', '')
        zh_d = (loc['zh_CN']['descriptions']['Joker'].get(key) or {})
        en_d = (loc['en-us']['descriptions']['Joker'].get(key) or {})

        expr = loc_vars.get(en)
        args = split_args(expr) if expr else []
        vals = [resolve_expr(a, cfg, j) for a in args]
        if en not in loc_vars:
            no_vars.append(key)

        ctx = [PATH_ALIAS.get(p, p) for p in contexts.get(en, [])]
        if ctx:
            how, rule, note = 'calculate_joker 按名字', '', ''
        else:
            tag = match_generic(cfg, j.get('effect'))
            if tag:
                how, rule, note = '通用规则', tag, generic_desc[tag]
                ctx = [PATH_ALIAS.get(p, p) for p in generic_ctx.get(tag, [])]
            else:
                how, rule, note = '外部引用', '', ''
                no_ctx.append(key)

        tpl_zh = join_text(zh_d.get('text'))
        tpl_en = join_text(en_d.get('text'))
        # 成长型:描述里出现「当前」/(currently 或 loc_vars 引用了运行时累加器
        growing = ('当前' in plain(tpl_zh) or 'currently' in plain(tpl_en).lower()
                   or any('<运行时' in str(v) for v in vals))

        rows.append({
            'key': key,
            '中文名': zh_d.get('name', ''),
            '英文名': en,
            '稀有度': '%d-%s' % (j.get('rarity', 0), RARITY_CN.get(j.get('rarity'), '?')),
            '售价': j.get('cost', ''),
            '卖价': math.floor((j.get('cost') or 0) / 2),
            '效果类型': j.get('effect', ''),
            '生效方式': how,
            '通用规则': rule,
            '通用规则说明': note,
            '触发时机': ' | '.join(ctx),
            '成长型': '是' if growing else '',
            '中文描述': plain(fill(tpl_zh, vals)),
            '英文描述': plain(fill(tpl_en, vals)),
            '数值参数': '; '.join(flat_config(cfg)),
            '占位变量取值': ' | '.join('#%d#=%s' % (i + 1, v) for i, v in enumerate(vals)),
            'loc_vars原式': expr or '',
            '蓝图可复制': '' if j.get('blueprint_compat') is False else '是',
            '永恒可': '' if j.get('eternal_compat') is False else '是',
            '易腐可': '' if j.get('perishable_compat') is False else '是',
            '默认解锁': '是' if j.get('unlocked') is True else '',
            '解锁条件类型': (j.get('unlock_condition') or {}).get('type', ''),
            '解锁条件': plain(join_text(zh_d.get('unlock'))),
            'order': j.get('order', ''),
            '代码出处': ' ; '.join(refs.get(en, [])),
            '图片': '图片资源/Joker/%s.png' % key,
            '描述模板_中文': tpl_zh,
        })

    cols = list(rows[0].keys())
    out_csv = os.path.join(cfg_dir, '配置CSV', '_小丑总表.csv')
    with io.open(out_csv, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)
    with io.open(os.path.join(cfg_dir, '配置JSON', '_小丑总表.json'), 'w', encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False, indent=1)

    print('小丑总表 %d 行 x %d 列 -> %s' % (len(rows), len(cols), out_csv))
    print('  无 loc_vars 分支(纯静态描述) %d 个: %s' % (len(no_vars), ', '.join(no_vars[:8])))
    print('  calculate_joker 里找不到触发点 %d 个: %s' % (len(no_ctx), ', '.join(no_ctx[:8])))
    import collections
    print('  稀有度', dict(collections.Counter(r['稀有度'] for r in rows)))
    print('  成长型 %d 个' % sum(1 for r in rows if r['成长型']))
    unresolved = [r['key'] for r in rows if '<运行时' in r['占位变量取值']]
    print('  含运行时变量的占位 %d 个' % len(unresolved))


if __name__ == '__main__':
    main()
