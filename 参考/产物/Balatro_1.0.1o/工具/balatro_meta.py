# -*- coding: utf-8 -*-
"""Balatro 牌组 / 标签 / 盲注总表。

三类各有各的生效机制,列也各不相同:

牌组 Back —— `back.lua` 的 `Back:apply_to_run`(176) 是**纯 config 分派**:
    `if self.effect.config.<字段> then ...`,一个字段一种改动,没有按名字开的分支。
    所以「生效字段」列直接列这张牌组 config 里被 apply_to_run 认的字段。
    描述占位来自 `Back:generate_UI`(26) 里 `name_to_check == 'X' then loc_args = {...}`,
    读的是 `effect_config.*`(就是 center.config)。

标签 Tag —— `tag.lua` 的 `Tag:apply_to_run(_context)`(115) 先比
    `self.config.type == _context.type` 再按名字细分,所以 `config.type` 就是触发时机,
    10 种。描述占位来自 `Tag:get_uibox_table`(546),读 `self.config.*`。

盲注 Blind —— `blind.lua` 没有集中入口,一个 Boss 的效果散在 `set_blind` /
    `press_play` / `debuff_hand` / `debuff_card` / `drawn_to_hand` / `stay_flipped` /
    `modify_hand` / `disable` / `defeat` 这些方法里,按 `self.name == 'X'` 认。
    「生效方法」列就是扫出来的方法名,能一眼看出这个 Boss 是「改分数」还是「废牌」。

用法: python balatro_meta.py [源码目录] [配置目录] [文本目录]
"""
import csv
import io
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if hasattr(sys.stdout, 'reconfigure'):   # Windows 控制台默认 GBK
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from balatro_jokers import fill, flat_config, join_text, plain, split_args, strip_comment

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Tag 的 config.type -> 触发时机(照 tag.lua:115 起各 _context.type 分支的语义)
TAG_TYPE_CN = {
    'store_joker_create': '进商店时,生成一张指定小丑',
    'store_joker_modify': '进商店时,给一张小丑加版本',
    'eval': '回合结算时判定',
    'voucher_add': '商店里多出一张优惠券',
    'new_blind_choice': '跳过盲注后,直接开一个补充包',
    'immediate': '领取当场立即结算',
    'shop_final_pass': '离开商店前触发',
    'tag_add': '再给一个标签',
    'round_start_bonus': '本回合开始时给增益',
    'shop_start': '进商店时触发',
}

# Boss 也有一层「配置驱动」:P_BLINDS 的 debuff 表,字段决定废牌/废手的判据。
# 判据消费点在 blind.lua 的 debuff_card(624) 与 debuff_hand(519),都不看名字。
DEBUFF_RULES = {
    'suit': ('废除指定花色的牌', 'debuff_card'),
    'is_face': ('废除人头牌', 'debuff_card'),
    'value': ('废除指定点数的牌', 'debuff_card'),
    'nominal': ('废除指定面值的牌', 'debuff_card'),
    'hand': ('打出指定牌型即整手作废', 'debuff_hand'),
    'h_size_ge': ('出牌少于 N 张即整手作废', 'debuff_hand'),
    'h_size_le': ('出牌多于 N 张即整手作废', 'debuff_hand'),
}

# blind.lua 里各方法的语义,给「生效方法」列配人话
BLIND_METHOD_CN = {
    'set_blind': '选定盲注时',
    'press_play': '出牌瞬间',
    'debuff_hand': '判定整手牌是否被废',
    'debuff_card': '判定单张牌是否被废',
    'drawn_to_hand': '抽到手牌时',
    'stay_flipped': '发牌保持背面',
    'modify_hand': '改本次出牌的筹码/倍率',
    'disable': '被解除时',
    'defeat': '被击败时',
    'get_loc_debuff_text': '效果文案',
}


def parse_name_branches(text, start_pat, end_pat, name_expr):
    """通用的「名字 -> 分支体」链解析。

    start_pat / end_pat 是函数(或区段)的起止行正则,name_expr 是认名字的正则。
    返回 {名字: 分支体原文}。
    """
    lines = text.split('\n')
    start = next(i for i, l in enumerate(lines) if re.search(start_pat, l))
    end = next(i for i, l in enumerate(lines) if i > start and re.search(end_pat, l))
    name_re = re.compile(name_expr)
    branch_re = re.compile(r"^\s*(?:els)?e?if\s+.*==\s*['\"]")

    out, cur = {}, None
    for l in lines[start + 1:end]:
        s = strip_comment(l)
        names = [a or b for a, b in name_re.findall(s)] if name_re.groups == 2 \
            else name_re.findall(s)
        if branch_re.match(s) and names:
            if cur:
                out[tuple(cur['names'])] = '\n'.join(cur['body'])
            cur = {'names': names, 'body': [s]}
            continue
        if cur is not None:
            cur['names'] += names
            cur['body'].append(s)
    if cur:
        out[tuple(cur['names'])] = '\n'.join(cur['body'])

    flat = {}
    for names, body in out.items():
        for n in names:
            flat[n] = body
    return flat


def grab_braced(body, anchor):
    """抠出 `<anchor> = {...}` 的花括号内容。"""
    m = re.search(re.escape(anchor) + r'\s*=\s*\{', body)
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


def make_resolver(prefix, key_names):
    """造一个把 `<prefix>.<字段>` 解成实际值的函数。prefix 如 'effect_config'。"""
    field_re = re.compile(re.escape(prefix) + r"\.([\w.]+)")

    def resolve(expr, cfg):
        e = expr.strip()
        if not e:
            return ''
        m = re.search(r"key\s*=\s*['\"]([\w]+)['\"]", e)      # localize{key='v_crystal_ball'}
        if m:
            return key_names.get(m.group(1), m.group(1))
        m = re.search(r"key\s*=\s*(" + re.escape(prefix) + r"\.[\w.]+)", e)
        if m:
            return resolve(m.group(1), cfg)
        if e.startswith('localize'):
            lit = re.search(r"['\"]([^'\"]+)['\"]", e)
            return key_names.get(lit.group(1), lit.group(1)) if lit else e
        if re.match(r"^['\"].*['\"]$", e):
            return e.strip('\'"')

        def sub(m2):
            v = cfg
            for p in m2.group(1).split('.'):
                v = v.get(p) if isinstance(v, dict) else None
            if v is None:
                return '<无此字段>'
            return repr(v) if not isinstance(v, str) else "'%s'" % v
        e2 = field_re.sub(sub, e)
        if 'G.' in e2:
            return '<运行时>'
        if '<无此字段>' in e2 or prefix in e2 or 'self.' in e2:
            return e2
        try:
            v = eval(e2, {'__builtins__': {}}, {})
            if isinstance(v, float) and v == int(v):
                v = int(v)
            return v
        except Exception:
            return e2.strip('\'"')
    return resolve


def load_key_names(txt_dir):
    """资产 key / 花色 / 牌型 -> 中文名。"""
    loc = json.load(io.open(os.path.join(txt_dir, 'zh_CN.json'), encoding='utf-8'))
    names = {}
    for _set, items in loc['descriptions'].items():
        for k, v in (items or {}).items():
            if isinstance(v, dict) and v.get('name'):
                names.setdefault(k, v['name'])
    for tbl in ('suits_plural', 'suits_singular', 'poker_hands'):
        for k, v in (loc['misc'].get(tbl) or {}).items():
            names.setdefault(k, v)
    return names


def write_table(cfg_dir, out_name, rows, label):
    cols = list(rows[0].keys())
    with io.open(os.path.join(cfg_dir, '配置CSV', out_name + '.csv'), 'w',
                 newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction='ignore')
        w.writeheader()
        w.writerows(rows)
    with io.open(os.path.join(cfg_dir, '配置JSON', out_name + '.json'), 'w',
                 encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False, indent=1)
    print('%-8s %3d 行 x %2d 列 -> %s.csv' % (label, len(rows), len(cols), out_name))


# ---------------------------------------------------------------- 牌组

def build_backs(src, cfg_dir, txt_dir, key_names, loc_zh, loc_en):
    back_lua = io.open(os.path.join(src, 'back.lua'), encoding='utf-8', errors='replace').read()
    items = json.load(io.open(os.path.join(cfg_dir, '配置JSON', 'P_CENTERS.Back.json'),
                              encoding='utf-8'))
    branches = parse_name_branches(back_lua, r'^function Back:generate_UI',
                                   r'^\s*localize\{type = .descriptions., key = back_config',
                                   r"name_to_check == '([^']+)'")
    # apply_to_run / trigger_effect 认哪些 config 字段
    seg = back_lua[back_lua.index('function Back:trigger_effect'):]
    consumed = set(re.findall(r"self\.effect\.config\.(\w+)", seg))
    resolve = make_resolver('effect_config', key_names)

    rows = []
    for key in sorted(items, key=lambda k: items[k].get('order', 0)):
        it = items[key]
        cfg = it.get('config') or {}
        en = it.get('name', '')
        zh_d = loc_zh['descriptions']['Back'].get(key) or {}
        en_d = loc_en['descriptions']['Back'].get(key) or {}
        expr = grab_braced(branches.get(en, ''), 'loc_args')
        vals = [resolve(a, cfg) for a in split_args(expr)] if expr else []

        uc = it.get('unlock_condition') or {}
        rows.append({
            'key': key,
            '中文名': zh_d.get('name', ''),
            '英文名': en,
            '中文描述': plain(fill(join_text(zh_d.get('text')), vals)),
            '英文描述': plain(fill(join_text(en_d.get('text')), vals)),
            '数值参数': '; '.join(flat_config(cfg)),
            '生效字段': '; '.join(sorted(k for k in cfg if k in consumed)) or '(无,靠专属逻辑)',
            '未被 apply_to_run 认的字段': '; '.join(sorted(k for k in cfg if k not in consumed)),
            '占位变量取值': ' | '.join('#%d#=%s' % (i + 1, v) for i, v in enumerate(vals)),
            'loc_args原式': (expr or '').strip(),
            '默认解锁': '是' if it.get('unlocked') is True else '',
            '解锁条件类型': uc.get('type', ''),
            '解锁条件': plain(join_text(zh_d.get('unlock'))),
            'order': it.get('order', ''),
            '图片': '图片资源/Back/%s.png' % key,
        })
    write_table(cfg_dir, '_牌组总表', rows, '牌组')
    return rows


# ---------------------------------------------------------------- 标签

def build_tags(src, cfg_dir, txt_dir, key_names, loc_zh, loc_en):
    tag_lua = io.open(os.path.join(src, 'tag.lua'), encoding='utf-8', errors='replace').read()
    items = json.load(io.open(os.path.join(cfg_dir, '配置JSON', 'P_TAGS.json'),
                              encoding='utf-8'))
    branches = parse_name_branches(tag_lua, r'^function Tag:get_uibox_table',
                                   r'^\s*tag_sprite\.ability_UIBox_table',
                                   r"name_to_check == '([^']+)'")
    resolve = make_resolver('self.config', key_names)

    rows = []
    for key in sorted(items, key=lambda k: items[k].get('order', 0)):
        it = items[key]
        cfg = it.get('config') or {}
        en = it.get('name', '')
        zh_d = loc_zh['descriptions']['Tag'].get(key) or {}
        en_d = loc_en['descriptions']['Tag'].get(key) or {}
        expr = grab_braced(branches.get(en, ''), 'loc_vars')
        vals = [resolve(a, cfg) for a in split_args(expr)] if expr else []

        t = cfg.get('type', '')
        rows.append({
            'key': key,
            '中文名': zh_d.get('name', ''),
            '英文名': en,
            '触发类型': t,
            '触发时机': TAG_TYPE_CN.get(t, t),
            '最低底注': it.get('min_ante') or 1,
            '依赖资产': it.get('requires', ''),
            '中文描述': plain(fill(join_text(zh_d.get('text')), vals)),
            '英文描述': plain(fill(join_text(en_d.get('text')), vals)),
            '数值参数': '; '.join(flat_config(cfg)),
            '占位变量取值': ' | '.join('#%d#=%s' % (i + 1, v) for i, v in enumerate(vals)),
            'loc_vars原式': (expr or '').strip(),
            'order': it.get('order', ''),
            '图片': '图片资源/Tag/%s.png' % key,
        })
    write_table(cfg_dir, '_标签总表', rows, '标签')
    return rows


# ---------------------------------------------------------------- 盲注

# 这些方法只做分类/绘制/存档,里面提到名字不代表有玩法效果,不进「生效方法」
BLIND_BOOKKEEPING = {
    'get_type', 'set_text', 'change_colour', 'init', 'save', 'load', 'align',
    'draw', 'hover', 'stop_hover', 'move', 'change_dim', 'wiggle', 'juice_up',
}


def parse_blind_methods(blind_lua):
    """扫 blind.lua,每个 `self.name == 'X'` 归到它所在的 Blind: 方法。"""
    lines = blind_lua.split('\n')
    cur_fn, out = None, {}
    fn_re = re.compile(r'^function Blind:(\w+)')
    # blind.lua 里单双引号混用("The Hook" / 'The Pillar'),只认一种会漏掉 7 个 Boss
    name_re = re.compile(r"""self\.name\s*==\s*(?:"([^"]+)"|'([^']+)')""")
    for l in lines:
        m = fn_re.match(l)
        if m:
            cur_fn = m.group(1)
            continue
        for a, b in name_re.findall(strip_comment(l)):
            n = a or b
            if not n:
                continue
            out.setdefault(n, [])
            if cur_fn and cur_fn not in BLIND_BOOKKEEPING and cur_fn not in out[n]:
                out[n].append(cur_fn)
    return out


def build_blinds(src, cfg_dir, txt_dir, key_names, loc_zh, loc_en):
    blind_lua = io.open(os.path.join(src, 'blind.lua'), encoding='utf-8',
                        errors='replace').read()
    items = json.load(io.open(os.path.join(cfg_dir, '配置JSON', 'P_BLINDS.json'),
                              encoding='utf-8'))
    methods = parse_blind_methods(blind_lua)

    rows = []
    for key in sorted(items, key=lambda k: items[k].get('order', 0)):
        it = items[key]
        en = it.get('name', '')
        boss = it.get('boss') or {}
        zh_d = loc_zh['descriptions']['Blind'].get(key) or {}
        en_d = loc_en['descriptions']['Blind'].get(key) or {}
        # P_BLINDS 的 vars 多数为空;bl_ox 那条在原型表里就是 localize 占位
        vals = [key_names.get(str(v), v) for v in (it.get('vars') or [])]

        if boss.get('showdown'):
            kind = '终局Boss'
        elif boss:
            kind = 'Boss'
        elif key == 'bl_small':
            kind = '小盲'
        elif key == 'bl_big':
            kind = '大盲'
        else:
            kind = '其它'

        ms = methods.get(en, [])
        debuff = it.get('debuff') or {}
        rules = [(k, v) for k, v in sorted(debuff.items()) if k in DEBUFF_RULES]
        if rules and ms:
            how = '配置驱动 + 按名字'
        elif rules:
            how = 'debuff 配置驱动'
        elif ms:
            how = 'blind.lua 按名字'
        else:
            how = '无特殊效果'
        rows.append({
            'key': key,
            '中文名': zh_d.get('name', ''),
            '英文名': en,
            '类型': kind,
            '分数倍率': it.get('mult', ''),
            '通关奖励$': it.get('dollars', ''),
            '最低出场Ante': boss.get('min', ''),
            '最高出场Ante': boss.get('max', ''),
            '中文描述': plain(fill(join_text(zh_d.get('text')), vals)),
            '英文描述': plain(fill(join_text(en_d.get('text')), vals)),
            '生效方式': how,
            'debuff配置': '; '.join('%s=%s' % (k, v) for k, v in rules),
            'debuff判据': ' ; '.join(DEBUFF_RULES[k][0] for k, _ in rules),
            '生效方法': ' ; '.join(ms),
            '生效时机': ' ; '.join(BLIND_METHOD_CN.get(m, m) for m in ms),
            'vars原式': ' | '.join(str(v) for v in (it.get('vars') or [])),
            'boss_colour': it.get('boss_colour', ''),
            'order': it.get('order', ''),
            '图片': '图片资源/Blind/%s.png' % key,
        })
    write_table(cfg_dir, '_盲注总表', rows, '盲注')
    return rows


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '源码')
    cfg_dir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, '配置')
    txt_dir = sys.argv[3] if len(sys.argv) > 3 else os.path.join(ROOT, '文本')

    key_names = load_key_names(txt_dir)
    loc_zh = json.load(io.open(os.path.join(txt_dir, 'zh_CN.json'), encoding='utf-8'))
    loc_en = json.load(io.open(os.path.join(txt_dir, 'en-us.json'), encoding='utf-8'))

    build_backs(src, cfg_dir, txt_dir, key_names, loc_zh, loc_en)
    build_tags(src, cfg_dir, txt_dir, key_names, loc_zh, loc_en)
    build_blinds(src, cfg_dir, txt_dir, key_names, loc_zh, loc_en)


if __name__ == '__main__':
    main()
