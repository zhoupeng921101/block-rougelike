# -*- coding: utf-8 -*-
"""Brotato(土豆兄弟) 拆包工具的公共件。自带 stdout 编码修正，不依赖其它包的 common/。"""
import csv
import io
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # Brotato_0.8.0.3/
REPO = os.path.dirname(os.path.dirname(os.path.dirname(ROOT)))       # 仓库根（参考/产物/<游戏>/ 往上三层）
APK = os.path.join(REPO, '源包', 'tudouxiongdi.apk')


def setup_stdout():
    """Windows 控制台默认 GBK，中文/表情会炸。"""
    for s in ('stdout', 'stderr'):
        st = getattr(sys, s)
        if hasattr(st, 'reconfigure'):
            try:
                st.reconfigure(encoding='utf-8', errors='replace')
            except Exception:
                pass


def ensure(path):
    if path:
        os.makedirs(path, exist_ok=True)
    return path


def write_csv(path, header, rows):
    """UTF-8 BOM，Excel 直开。"""
    ensure(os.path.dirname(path))
    with io.open(path, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        if header:
            w.writerow(header)
        w.writerows(rows)
    return len(rows)


def write_dict_csv(path, rows, header=None):
    if header is None:
        header = []
        for r in rows:
            for k in r:
                if k not in header:
                    header.append(k)
    ensure(os.path.dirname(path))
    with io.open(path, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=header, extrasaction='ignore')
        w.writeheader()
        for r in rows:
            w.writerow(r)
    return len(rows)


def write_json(path, obj, indent=2):
    import json
    ensure(os.path.dirname(path))
    with io.open(path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=indent)
    return path


def read_json(path):
    import json
    with io.open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def write_text(path, text):
    ensure(os.path.dirname(path))
    with io.open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)
    return path


class Progress(object):
    def __init__(self, total, label='', step=None):
        self.total = total
        self.label = label
        self.n = 0
        self.step = step or max(1, total // 20)

    def tick(self, extra=''):
        self.n += 1
        if self.n % self.step == 0 or self.n == self.total:
            print('  [%d/%d] %s %s' % (self.n, self.total, self.label, extra))


def res_to_rel(res_path):
    """res://a/b.png -> a/b.png"""
    if res_path.startswith('res://'):
        return res_path[6:]
    return res_path.lstrip('/')
