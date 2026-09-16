# -*- coding: utf-8 -*-
"""Balatro 文本与挑战抽取。

本地化/*.lua 是 `return {descriptions=..., misc=...}` 的纯表,直接在 lupa 里求值;
descriptions 的 text 是分行数组,带 {C:attention} / {X:mult} 这类富文本标记,
导 CSV 时按行拼成一段,标记原样保留(要对齐游戏内显示就别剥)。

challenges.lua 是 `G.CHALLENGES = {...}` 的数组,同样直接求值。

用法: python balatro_text.py [源码目录] [输出目录]
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

import lupa

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def lua_to_py(v, depth=0):
    if depth > 40 or lupa.lua_type(v) != 'table':
        return v
    d = {k: lua_to_py(val, depth + 1) for k, val in v.items()}
    keys = list(d.keys())
    if keys and all(isinstance(k, int) for k in keys) and \
            sorted(keys) == list(range(1, len(keys) + 1)):
        return [d[i] for i in range(1, len(keys) + 1)]
    return d


def read_locale(path):
    text = io.open(path, encoding='utf-8', errors='replace').read()
    text = re.sub(r'^\s*return\s*', 'LOC = ', text, count=1)
    L = lupa.LuaRuntime(unpack_returned_tuples=True)
    L.execute(text)
    return lua_to_py(L.globals().LOC)


def join_text(v):
    """descriptions 里的 text 可能是 [行] 或 [[行]](多页),拼成一段。"""
    if isinstance(v, str):
        return v
    if isinstance(v, list):
        return '\n'.join(join_text(x) for x in v)
    if isinstance(v, dict):
        return json.dumps(v, ensure_ascii=False)
    return '' if v is None else str(v)


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '源码')
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, '文本')
    loc_dir = os.path.join(ROOT, '本地化')
    os.makedirs(out, exist_ok=True)

    langs = sorted(f[:-4] for f in os.listdir(loc_dir) if f.endswith('.lua'))
    data = {}
    for lg in langs:
        data[lg] = read_locale(os.path.join(loc_dir, '%s.lua' % lg))
        with io.open(os.path.join(out, '%s.json' % lg), 'w', encoding='utf-8') as f:
            json.dump(data[lg], f, ensure_ascii=False, indent=1, sort_keys=True)

    # 对照表:一个 key 一行,中/英名称与描述并排
    pri = [lg for lg in ('zh_CN', 'en-us') if lg in data]
    rows = []
    for _set in sorted(data[pri[0]].get('descriptions', {})):
        for key in sorted(data[pri[0]]['descriptions'][_set]):
            r = {'key': key, '集合': _set}
            for lg in pri:
                item = (data[lg].get('descriptions', {}).get(_set, {}) or {}).get(key) or {}
                r['%s.名称' % lg] = item.get('name', '')
                r['%s.描述' % lg] = join_text(item.get('text'))
                if item.get('unlock'):
                    r['%s.解锁条件' % lg] = join_text(item['unlock'])
            rows.append(r)
    cols = ['key', '集合']
    for r in rows:
        for c in r:
            if c not in cols:
                cols.append(c)
    with io.open(os.path.join(out, '_中英对照.csv'), 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction='ignore')
        w.writeheader()
        w.writerows(rows)
    print('本地化 %d 语言, 对照表 %d 行 x %d 列' % (len(langs), len(rows), len(cols)))

    # ---- 挑战 ----
    ch_src = io.open(os.path.join(src, 'challenges.lua'), encoding='utf-8', errors='replace').read()
    L = lupa.LuaRuntime(unpack_returned_tuples=True)
    L.execute('G = {}')
    L.execute(ch_src)
    challenges = lua_to_py(L.globals().G.CHALLENGES)
    cdir = os.path.join(ROOT, '配置')
    with io.open(os.path.join(cdir, '配置JSON', 'CHALLENGES.json'), 'w', encoding='utf-8') as f:
        json.dump(challenges, f, ensure_ascii=False, indent=1, sort_keys=True)

    # 挑战主表 + 规则明细表
    crows, rrows = [], []
    ch_names = (data.get('zh_CN', {}).get('misc', {}) or {}).get('challenge_names', {}) or {}
    for c in challenges:
        cid = c.get('id', '')
        rules = c.get('rules', {}) or {}
        crows.append({
            'id': cid, '英文名': c.get('name', ''), '中文名': ch_names.get(cid, ''),
            '自定义规则数': len(rules.get('custom', []) or []),
            '数值修正数': len(rules.get('modifiers', []) or []),
            '禁用物品数': len(c.get('restrictions', {}).get('banned_cards', []) or []) +
                          len(c.get('restrictions', {}).get('banned_tags', []) or []) +
                          len(c.get('restrictions', {}).get('banned_other', []) or []),
            '起始物品数': len(((c.get('jokers') or []) + (c.get('consumeables') or []))),
            '牌组张数': len(c.get('deck', {}).get('cards', []) or []) or '默认',
        })
        for kind in ('custom', 'modifiers'):
            for r in rules.get(kind, []) or []:
                rrows.append({'挑战id': cid, '类别': kind, 'id': r.get('id', ''),
                              'value': r.get('value', '')})
        for kind, lst in (('banned_cards', c.get('restrictions', {}).get('banned_cards')),
                          ('banned_tags', c.get('restrictions', {}).get('banned_tags')),
                          ('banned_other', c.get('restrictions', {}).get('banned_other'))):
            for r in lst or []:
                rrows.append({'挑战id': cid, '类别': kind, 'id': r.get('id', ''),
                              'value': r.get('type', '')})

    def dump(name, rows_):
        if not rows_:
            return
        cols_ = []
        for r in rows_:
            for c in r:
                if c not in cols_:
                    cols_.append(c)
        with io.open(os.path.join(cdir, '配置CSV', name), 'w', newline='', encoding='utf-8-sig') as f:
            w = csv.DictWriter(f, fieldnames=cols_, extrasaction='ignore')
            w.writeheader()
            w.writerows(rows_)

    dump('CHALLENGES.csv', crows)
    dump('CHALLENGES_规则明细.csv', rrows)
    print('挑战 %d 个, 规则明细 %d 条' % (len(crows), len(rrows)))


if __name__ == '__main__':
    main()
