# -*- coding: utf-8 -*-
"""Balatro 图集切片:按 pos 把 Jokers.png 等图集切成一物一图的 PNG。

图集网格来自 game.lua 的 asset_atli / animation_atli(px x py 每格),
贴图选取规则来自 card.lua:165:
    _center.atlas or ((set=='Joker' or consumeable or set=='Voucher') and set) or 'centers'
Planet / Spectral 两个图集在 game.lua:1086 被别名到 Tarot。

用法: python balatro_sprites.py [配置JSON目录] [资源目录] [输出目录] [--scale=2]
"""
import csv
import io
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if hasattr(sys.stdout, 'reconfigure'):   # Windows 控制台默认 GBK
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# name -> (相对 资源/ 的路径, 格宽, 格高)  —— 1x 的尺寸,2x 自动翻倍
ATLAS = {
    'cards_1':   ('textures/{s}x/8BitDeck.png', 71, 95),
    'cards_2':   ('textures/{s}x/8BitDeck_opt2.png', 71, 95),
    'centers':   ('textures/{s}x/Enhancers.png', 71, 95),
    'Joker':     ('textures/{s}x/Jokers.png', 71, 95),
    'Tarot':     ('textures/{s}x/Tarots.png', 71, 95),
    'Planet':    ('textures/{s}x/Tarots.png', 71, 95),
    'Spectral':  ('textures/{s}x/Tarots.png', 71, 95),
    'Voucher':   ('textures/{s}x/Vouchers.png', 71, 95),
    'Booster':   ('textures/{s}x/boosters.png', 71, 95),
    'stickers':  ('textures/{s}x/stickers.png', 71, 95),
    'tags':      ('textures/{s}x/tags.png', 34, 34),
    'blind_chips': ('textures/{s}x/BlindChips.png', 34, 34),
    'chips':     ('textures/{s}x/chips.png', 29, 29),
    'icons':     ('textures/{s}x/icons.png', 66, 66),
    'ui_1':      ('textures/{s}x/ui_assets.png', 18, 18),
    'ui_2':      ('textures/{s}x/ui_assets_opt2.png', 18, 18),
    'gamepad_ui': ('textures/{s}x/gamepad_ui.png', 32, 32),
}

CONSUMEABLE = {'Tarot', 'Planet', 'Spectral'}


def pick_atlas(center):
    """照 card.lua 的规则挑图集。"""
    if center.get('atlas'):
        return center['atlas']
    s = center.get('set')
    if s == 'Joker' or s == 'Voucher' or s in CONSUMEABLE:
        return s
    return 'centers'


class Cutter(object):
    def __init__(self, res_dir, scale):
        self.res_dir = res_dir
        self.scale = scale
        self.cache = {}

    def cut(self, atlas_name, x, y):
        if atlas_name not in ATLAS:
            return None, '未知图集 %s' % atlas_name
        rel, pw, ph = ATLAS[atlas_name]
        path = os.path.join(self.res_dir, rel.format(s=self.scale).replace('/', os.sep))
        if path not in self.cache:
            if not os.path.exists(path):
                return None, '图集文件缺失 %s' % rel
            self.cache[path] = Image.open(path).convert('RGBA')
        img = self.cache[path]
        pw, ph = pw * self.scale, ph * self.scale
        left, top = int(x) * pw, int(y) * ph
        if left + pw > img.width or top + ph > img.height:
            return None, '越界 pos=(%s,%s) 图集 %dx%d' % (x, y, img.width, img.height)
        return img.crop((left, top, left + pw, top + ph)), ''


def main():
    cfg = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '配置', '配置JSON')
    res = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, '资源')
    out = sys.argv[3] if len(sys.argv) > 3 else os.path.join(ROOT, '图片资源')
    scale = 2
    for a in sys.argv[1:]:
        if a.startswith('--scale='):
            scale = int(a.split('=')[1])

    load = lambda n: json.load(io.open(os.path.join(cfg, n), encoding='utf-8'))
    centers, tags, blinds = load('P_CENTERS.json'), load('P_TAGS.json'), load('P_BLINDS.json')

    # 名称列:中英文都挂上,便于人工核对
    names = {}
    for lang, col in (('en-us', '英文名'), ('zh_CN', '中文名')):
        p = os.path.join(ROOT, '本地化', '%s.lua' % lang)
        if not os.path.exists(p):
            continue
        import lupa
        import re
        text = re.sub(r'^\s*return\s*', 'LOC = ', io.open(p, encoding='utf-8').read(), count=1)
        L = lupa.LuaRuntime()
        L.execute(text)
        loc = L.globals().LOC
        for _set in ('Joker', 'Tarot', 'Planet', 'Spectral', 'Voucher', 'Back',
                     'Enhanced', 'Edition', 'Booster', 'Tag', 'Blind', 'Other', 'Stake'):
            tbl = loc.descriptions[_set] if loc.descriptions[_set] is not None else None
            if tbl is None:
                continue
            for k, v in tbl.items():
                names.setdefault(k, {})[col] = v['name'] or ''

    cutter = Cutter(res, scale)
    rows, errs = [], []

    def emit(key, group, atlas_name, pos, extra=''):
        if not isinstance(pos, dict):
            errs.append('%s\t无 pos' % key)
            return
        img, err = cutter.cut(atlas_name, pos.get('x', 0), pos.get('y', 0))
        if img is None:
            errs.append('%s\t%s' % (key, err))
            return
        d = os.path.join(out, group)
        os.makedirs(d, exist_ok=True)
        fn = '%s.png' % key
        img.save(os.path.join(d, fn))
        n = names.get(key, {})
        rows.append([key, group, n.get('英文名', ''), n.get('中文名', ''), atlas_name,
                     pos.get('x', 0), pos.get('y', 0), '%dx%d' % img.size, extra,
                     '%s/%s' % (group, fn)])

    for key in sorted(centers):
        v = centers[key]
        if not isinstance(v, dict) or not isinstance(v.get('pos'), dict):
            continue
        group = v.get('set') or '其它'
        emit(key, group, pick_atlas(v), v['pos'])
        if isinstance(v.get('soul_pos'), dict):     # 传奇小丑的浮空层
            emit(key + '_soul', group + '_soul', 'Joker', v['soul_pos'], '浮空层')

    for key in sorted(tags):
        emit(key, 'Tag', 'tags', tags[key].get('pos'))

    for key in sorted(blinds):
        v = blinds[key]
        if not isinstance(v.get('pos'), dict):
            continue
        # 盲注筹码是 21 帧动画,只取第 1 帧作代表
        emit(key, 'Blind', 'blind_chips', {'x': 0, 'y': v['pos'].get('y', 0)}, '动画首帧/共21帧')

    os.makedirs(out, exist_ok=True)
    with io.open(os.path.join(out, '_索引.csv'), 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f)
        w.writerow(['key', '分组', '英文名', '中文名', '图集', 'pos.x', 'pos.y', '尺寸', '备注', '落盘位置'])
        w.writerows(rows)
    with io.open(os.path.join(out, '_错误.txt'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(errs))

    print('切出 %d 张, 失败 %d 条 (%dx)' % (len(rows), len(errs), scale))
    import collections
    for g, n in sorted(collections.Counter(r[1] for r in rows).items()):
        print('  %-14s %d' % (g, n))


if __name__ == '__main__':
    main()
