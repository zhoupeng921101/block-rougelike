# -*- coding: utf-8 -*-
"""Balatro 1.0.1o 数值配置抽取。

把 game.lua 里的纯字面量原型表(P_CENTERS / P_BLINDS / P_TAGS / P_STAKES /
P_SEALS / P_CARDS)与 init_game_object 里的牌型表(hands)在 lupa 沙箱里求值,
落成 配置JSON/ 与 配置CSV/。不碰 APK,只吃 源码/ 下的明文 Lua。

用法: python balatro_config.py [源码目录] [配置输出目录]
"""
import io
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if hasattr(sys.stdout, 'reconfigure'):   # Windows 控制台默认 GBK
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import lupa

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _slice(text, start_marker, end_marker):
    """取 [start_marker 行, end_marker 行) 之间的原文。"""
    lines = text.split('\n')
    a = b = None
    for i, ln in enumerate(lines):
        if a is None and start_marker in ln:
            a = i
        elif a is not None and end_marker in ln:
            b = i
            break
    if a is None or b is None:
        raise RuntimeError('找不到区间 %r .. %r' % (start_marker, end_marker))
    return '\n'.join(lines[a:b])


def _balanced(text, start_marker):
    """从 start_marker 处的 '{' 起,按花括号配平取出整张表(含外层括号)。

    表里只有字符串字面量与注释可能带干扰花括号,逐字符扫时要跳过。
    """
    i = text.index(start_marker)
    i = text.index('{', i)
    depth = 0
    j = i
    while j < len(text):
        c = text[j]
        if c in '\'"':
            q = c
            j += 1
            while j < len(text) and text[j] != q:
                j += 2 if text[j] == '\\' else 1
        elif c == '-' and text[j:j + 2] == '--':
            j = text.find('\n', j)
            if j < 0:
                break
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return text[i:j + 1]
        j += 1
    raise RuntimeError('花括号不配平: %r' % start_marker)


def lua_to_py(v, depth=0):
    """lupa 表 -> dict/list;数组段转 list。"""
    if depth > 40:
        return '<深度超限>'
    if not lupa.lua_type(v) == 'table':
        return v
    d = {}
    for k, val in v.items():
        d[k] = lua_to_py(val, depth + 1)
    keys = list(d.keys())
    if keys and all(isinstance(k, int) for k in keys) and \
            sorted(keys) == list(range(1, len(keys) + 1)):
        return [d[i] for i in range(1, len(keys) + 1)]
    return d


def extract(src_dir):
    game = io.open(os.path.join(src_dir, 'game.lua'), encoding='utf-8', errors='replace').read()
    protos = _slice(game, 'self.P_SEALS = self.P_SEALS or {', 'self.P_CENTER_POOLS = {')
    hands = _balanced(game, '        hands = {')
    lua = lupa.LuaRuntime(unpack_returned_tuples=True)
    lua.execute('self = {}')
    # 原型表里少量字段调 localize(...) 取本地化串;沙箱里没有语言包,
    # 回填成 "localize:<参数>" 占位,后面再按 本地化/*.lua 补名称列
    lua.execute('function localize(a, b) '
                'return "localize:" .. tostring(a) .. (b and ("/" .. tostring(b)) or "") end')
    # 盲注的 boss_colour 写成 HEX('56789D') 形式,照 misc_functions.lua 的实现补上
    lua.execute('''function HEX(hex)
        if #hex <= 6 then hex = hex .. "FF" end
        local _,_,r,g,b,a = hex:find("(%x%x)(%x%x)(%x%x)(%x%x)")
        return {tonumber(r,16)/255, tonumber(g,16)/255, tonumber(b,16)/255, tonumber(a,16)/255}
    end''')
    lua.execute(protos)
    lua.execute('self.HANDS = ' + hands)

    g = lua.globals().self
    out = {}
    for name in ('P_SEALS', 'P_TAGS', 'P_STAKES', 'P_BLINDS', 'P_CARDS', 'P_CENTERS', 'HANDS'):
        out[name] = lua_to_py(g[name])
    return out


# ---- CSV 落盘 ---------------------------------------------------------------

def flatten(d, prefix=''):
    """一层套一层的 config 拍平成 config.xxx 列。"""
    flat = {}
    for k, v in d.items():
        key = '%s%s' % (prefix, k)
        if isinstance(v, dict):
            flat.update(flatten(v, key + '.'))
        elif isinstance(v, list):
            if all(not isinstance(x, (dict, list)) for x in v):
                flat[key] = '|'.join(str(x) for x in v)
            else:
                flat[key] = json.dumps(v, ensure_ascii=False)
        else:
            flat[key] = v
    return flat


def write_csv(path, rows, key_name='key'):
    """列顺序必须**确定**:lua_to_py 是按 Lua 表的迭代序取字段的,而 Lua 的哈希部分
    每次跑出来的顺序可能不同。按出现先后攒列名会让同样的输入产出列序不同的 CSV
    (逐字节比对时全是假差异)。所以固定成:key -> 名称列 -> 其余按字母序。
    """
    import csv
    seen = set()
    for _, r in rows:
        seen.update(r)
    pinned = [c for c in (key_name, '中文名', '英文名') if c == key_name or c in seen]
    cols = pinned + sorted(c for c in seen if c not in pinned)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with io.open(path, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction='ignore')
        w.writeheader()
        for k, r in rows:
            row = dict(r)
            row[key_name] = k
            w.writerow(row)
    return len(rows), len(cols)


def load_locale(src_dir, lang):
    """本地化 Lua -> dict(名称/描述)。返回 (misc, descriptions)。"""
    p = os.path.join(src_dir, '..', '本地化', '%s.lua' % lang)
    if not os.path.exists(p):
        return {}, {}
    text = io.open(p, encoding='utf-8', errors='replace').read()
    text = re.sub(r'^\s*return\s*', 'LOC = ', text, count=1)
    lua = lupa.LuaRuntime(unpack_returned_tuples=True)
    lua.execute(text)
    loc = lua_to_py(lua.globals().LOC)
    return loc.get('misc', {}), loc.get('descriptions', {})


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '源码')
    dst = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, '配置')
    data = extract(src)

    js_dir = os.path.join(dst, '配置JSON')
    csv_dir = os.path.join(dst, '配置CSV')
    os.makedirs(js_dir, exist_ok=True)

    # 中英文名称,挂到每一行上
    names = {}
    for lang, suffix in (('en-us', '英文名'), ('zh_CN', '中文名')):
        _, descs = load_locale(src, lang)
        for _set, items in (descs or {}).items():
            for key, v in items.items():
                names.setdefault(key, {})[suffix] = (v or {}).get('name', '')

    # P_CENTERS 按 set 拆表
    centers = data['P_CENTERS']
    by_set = {}
    for key, v in centers.items():
        if not isinstance(v, dict):
            continue
        by_set.setdefault(v.get('set', '未分类'), {})[key] = v

    summary = []
    for name, tbl in list(data.items()) + [('P_CENTERS.' + s, t) for s, t in by_set.items()]:
        with io.open(os.path.join(js_dir, name + '.json'), 'w', encoding='utf-8') as f:
            json.dump(tbl, f, ensure_ascii=False, indent=1, sort_keys=True)
        if isinstance(tbl, dict):
            rows = []
            for k in sorted(tbl):
                v = tbl[k]
                if not isinstance(v, dict):
                    continue
                r = flatten(v)
                r.update(names.get(k, {}))
                rows.append((k, r))
            if rows:
                n, c = write_csv(os.path.join(csv_dir, name + '.csv'), rows)
                summary.append((name, n, c))
    for name, n, c in summary:
        print('%-28s %4d 行 x %3d 列' % (name, n, c))


if __name__ == '__main__':
    main()
