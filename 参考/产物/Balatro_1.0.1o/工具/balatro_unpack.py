# -*- coding: utf-8 -*-
"""Balatro APK 解包。

LÖVE(Love2D) 打的包,`assets/` 下就是明文 `.lua` 与资源,没有任何加密,
`zipfile` 直读即可。按用途分流到中文目录:

    assets/resources/*     -> 资源/
    assets/localization/*  -> 本地化/
    assets/*.lua 等其余    -> 源码/
    lib/*                  -> 原生库/
    classes.dex / AndroidManifest.xml / resources.arsc -> 安卓壳/

`assets/dexopt/` 是 ART profile,跳过。索引写 `_索引.csv`。

用法: python balatro_unpack.py [apk路径] [输出目录] [--dry]
"""
import collections
import csv
import io
import os
import sys
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if hasattr(sys.stdout, 'reconfigure'):   # Windows 控制台默认 GBK
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(os.path.dirname(os.path.dirname(ROOT)))  # 仓库根（参考/产物/<游戏>/ 往上三层）
DEFAULT_APK = os.path.join(REPO, '源包', 'com.playstack.balatro.android.apk')

SHELL_FILES = {'AndroidManifest.xml', 'resources.arsc', 'classes.dex'}


def route(name):
    """APK 内路径 -> (落盘相对路径, 分类)。不要的返回 None。"""
    if name.endswith('/') or name.startswith('assets/dexopt/'):
        return None
    if name.startswith('assets/resources/'):
        return os.path.join('资源', name[len('assets/resources/'):]), '资源'
    if name.startswith('assets/localization/'):
        return os.path.join('本地化', name[len('assets/localization/'):]), '本地化'
    if name.startswith('assets/'):
        return os.path.join('源码', name[len('assets/'):]), '源码'
    if name.startswith('lib/'):
        return os.path.join('原生库', name[len('lib/'):]), '原生库'
    if name in SHELL_FILES:
        return os.path.join('安卓壳', name), '安卓壳'
    return None


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    dry = '--dry' in sys.argv
    apk = args[0] if args else DEFAULT_APK
    out = args[1] if len(args) > 1 else ROOT

    if not os.path.exists(apk):
        print('找不到 APK: %s' % apk)
        return 1

    z = zipfile.ZipFile(apk)
    rows = []
    for name in z.namelist():
        r = route(name)
        if not r:
            continue
        rel, cate = r
        dst = os.path.join(out, rel)
        data = z.read(name)
        if not dry:
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            with open(dst, 'wb') as f:
                f.write(data)
        rows.append((name, cate, len(data), rel.replace(os.sep, '/')))

    if not dry:
        os.makedirs(out, exist_ok=True)
        with io.open(os.path.join(out, '_索引.csv'), 'w', newline='',
                     encoding='utf-8-sig') as f:
            w = csv.writer(f)
            w.writerow(['APK内路径', '分类', '字节', '落盘位置'])
            w.writerows(sorted(rows))

    c = collections.Counter(r[1] for r in rows)
    print('%s %d 个文件 %.1f MB' % ('[dry] 将解出' if dry else '解出',
                                    len(rows), sum(r[2] for r in rows) / 1048576.0))
    for k in ('源码', '本地化', '资源', '原生库', '安卓壳'):
        if c[k]:
            print('  %-6s %d' % (k, c[k]))
    return 0


if __name__ == '__main__':
    sys.exit(main())
