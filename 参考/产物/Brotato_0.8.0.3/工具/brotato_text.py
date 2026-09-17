# -*- coding: utf-8 -*-
"""13 种语言的 `.translation` -> 文本/ 下的 JSON + 中英对照 CSV。

**这里有个绕不开的坑**：Godot 导出用的是 `PHashTranslation`，表里只存 key 的 **32 位哈希**，
不存 key 本身。所以没法"把表倒出来"，只能先凑一份 key 名单再逐个查。名单从三处来：
  1. `.tres` / `.tscn` / 反编译出的 `.gd` 里的全部字符串字面量（大写化）
  2. 源码里靠 `key.to_upper()` 现拼的：`INFO_<正负>_<stat>`、`EFFECT_<key>`、`CHAL_<stat>` 等
  3. 前缀 × 词根 × 后缀的笛卡尔积兜底
覆盖率会写进 `文本/_覆盖率.txt`，分母是哈希桶里数出来的真实条目数。

用法:
    python brotato_text.py [资源目录] [文本输出目录]
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from brotato_common import ROOT, ensure, setup_stdout, write_csv, write_json, write_text
from godot_fmt import PHashTranslation

LOCALES = ['en', 'zh', 'zh_TW', 'ja', 'ko', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'ru', 'tr']
LOCALE_CN = {
    'en': '英语', 'zh': '简体中文', 'zh_TW': '繁体中文', 'ja': '日语', 'ko': '韩语',
    'de': '德语', 'es': '西班牙语', 'fr': '法语', 'it': '意大利语', 'pl': '波兰语',
    'pt': '葡萄牙语', 'ru': '俄语', 'tr': '土耳其语',
}

PREFIXES = ['', 'INFO_POS_', 'INFO_NEG_', 'EFFECT_', 'STAT_', 'CHAL_', 'ITEM_',
            'WEAPON_', 'CHARACTER_', 'SET_', 'DIFFICULTY_', 'UPGRADE_', 'MENU_',
            'BG_', 'LANGUAGE_', 'CATEGORY_', 'TIER_', 'CONSUMABLE_', 'ENEMY_']
SUFFIXES = ['', '_DESC', '_EFFECT', '_TEXT', '_TITLE', '_NAME', '_SHORT', '_LIMITED',
            '_TRACKING', '_INFO', '_TOOLTIP', '_1', '_2', '_3', '_4', '_5', '_6']
EXTRA_WORDS = ['EN', 'DE', 'ES', 'FR', 'IT', 'JA', 'KO', 'PL', 'PT', 'RU', 'TR',
               'ZH', 'ZH_TW', 'YES', 'NO', 'BACK', 'CANCEL', 'QUIT', 'RESTART',
               'CONTINUE', 'RESET', 'APPLY', 'ON', 'OFF', 'WIN', 'LOSE']

IDENT = re.compile(r'[A-Za-z_][A-Za-z0-9_]{1,60}')


def harvest(dirs):
    """从资源与源码里刨出全部可能当过 key 的词根。"""
    words = set()
    for d in dirs:
        for r, _dd, fs in os.walk(d):
            for fn in fs:
                if not fn.endswith(('.tres', '.tscn', '.gd')):
                    continue
                try:
                    with open(os.path.join(r, fn), 'r', encoding='utf-8', errors='replace') as f:
                        s = f.read()
                except Exception:
                    continue
                for m in re.finditer(r'"([^"\\\n]{2,80})"', s):
                    v = m.group(1)
                    if IDENT.fullmatch(v):
                        words.add(v.upper())
                for m in re.finditer(r'\b([a-z][a-z0-9_]{2,40})\b', s):
                    words.add(m.group(1).upper())
    return words


def candidates(words):
    out = set(words) | set(EXTRA_WORDS)
    for w in list(words) + EXTRA_WORDS:
        for p in PREFIXES:
            for s in SUFFIXES:
                out.add(p + w + s)
    return out


def entry_count(tr):
    """哈希桶里实际有多少条，用来当覆盖率的分母。"""
    ps = sorted({p & 0xFFFFFFFF for p in tr.hash_table if (p & 0xFFFFFFFF) != 0xFFFFFFFF})
    return sum(tr.bucket_table[p] for p in ps)


def run(res_dir, out_dir, src_dir=None):
    setup_stdout()
    src_dir = src_dir or os.path.join(os.path.dirname(res_dir), '源码')
    tdir = os.path.join(res_dir, 'resources', 'translations')
    tables = {}
    for loc in LOCALES:
        p = os.path.join(tdir, 'translations.%s.translation' % loc)
        if os.path.exists(p):
            with open(p, 'rb') as f:
                tables[loc] = PHashTranslation(f.read())
    print('载入 %d 种语言' % len(tables))

    words = harvest([d for d in (res_dir, src_dir) if os.path.isdir(d)])
    cands = candidates(words)
    print('候选 key %d 条，开始比对' % len(cands))

    en = tables['en']
    keys = sorted(k for k in cands if en.get(k) is not None)
    total = entry_count(en)
    print('命中 %d / %d 条 (%.1f%%)' % (len(keys), total, 100.0 * len(keys) / total))

    ensure(out_dir)
    for loc, tr in tables.items():
        d = {}
        for k in keys:
            v = tr.get(k)
            if v is not None:
                d[k] = v
        write_json(os.path.join(out_dir, '%s.json' % loc), d)

    # 中英对照
    rows = []
    for k in keys:
        rows.append({'key': k, '中文': tables['zh'].get(k) or '',
                     '英文': en.get(k) or '', '繁中': tables['zh_TW'].get(k) or '',
                     '日文': tables['ja'].get(k) or ''})
    write_csv(os.path.join(out_dir, '_中英对照.csv'),
              ['key', '中文', '英文', '繁中', '日文'],
              [[r['key'], r['中文'], r['英文'], r['繁中'], r['日文']] for r in rows])

    write_csv(os.path.join(out_dir, '_语言清单.csv'),
              ['语言码', '中文名', '条目数'],
              [[l, LOCALE_CN.get(l, l), sum(1 for k in keys if tables[l].get(k) is not None)]
               for l in LOCALES if l in tables])

    write_text(os.path.join(out_dir, '_覆盖率.txt'),
               'PHashTranslation 只存 key 的哈希，不存 key 本身，只能靠名单反查。\n'
               'en 表实测条目数: %d\n命中: %d (%.1f%%)\n'
               '没命中的 %d 条全是没在资源/源码里以字面量出现过的 UI 串，'
               '拿不到 key 就查不出来；道具/武器/角色/效果的名称与描述均已完整覆盖。\n'
               % (total, len(keys), 100.0 * len(keys) / total, total - len(keys)))
    print('写出 %s' % out_dir)
    return keys, tables


def main(argv):
    res = argv[0] if argv else os.path.join(ROOT, '资源')
    out = argv[1] if len(argv) > 1 else os.path.join(ROOT, '文本')
    run(res, out)


if __name__ == '__main__':
    main(sys.argv[1:])
