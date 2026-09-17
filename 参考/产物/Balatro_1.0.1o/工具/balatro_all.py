# -*- coding: utf-8 -*-
r"""Balatro 全流程一键重跑:APK -> 全部产物。

按依赖顺序跑完下面这些步骤,每步一个子进程,单步失败就停(后面的步骤都依赖前面的产物)。

    unpack   balatro_unpack.py    APK -> 源码/ 本地化/ 资源/ 原生库/ 安卓壳/ + _索引.csv
    config   balatro_config.py    game.lua 原型表 -> 配置JSON/ + 配置CSV/     [其余全部依赖它]
    text     balatro_text.py      15 语言本地化 + challenges -> 文本/ + 配置/
    sprites  balatro_sprites.py   图集切成一物一图 -> 图片资源/
    jokers   balatro_jokers.py    小丑总表
    cards    balatro_cards.py     塔罗/幽灵/优惠券总表
    meta     balatro_meta.py      牌组/标签/盲注总表
    packs    balatro_packs.py     补充包/强化牌总表
    mods     balatro_mods.py      版本/蜡封总表
    index    balatro_index.py     11 张总表 -> 总表索引.md + _总表索引.csv
    jadx     (外部)               classes.dex -> 安卓壳/jadx/   **默认不跑**,加 --jadx 才跑

依赖关系只有两条硬的:`config` 必须在 `text` 之前(text 要往 配置JSON/ 写
CHALLENGES),其余总表脚本都吃 `config` 的产物;`index` 必须最后。

用法:
    python balatro_all.py                     # 全量重跑(不含 jadx)
    python balatro_all.py --jadx              # 连 classes.dex 也重新反编译
    python balatro_all.py --skip=unpack       # 源码已在盘上,跳过解包
    python balatro_all.py --only=jokers,index # 只跑这几步
    python balatro_all.py --dry               # 只列要跑什么,不执行
    python balatro_all.py --apk=D:\x.apk      # 换输入 APK
"""
import io
import os
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if hasattr(sys.stdout, 'reconfigure'):   # Windows 控制台默认 GBK
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
REPO = os.path.dirname(os.path.dirname(os.path.dirname(ROOT)))  # 仓库根（参考/产物/<游戏>/ 往上三层）

# (步骤名, 脚本, 说明)
STEPS = [
    ('unpack',  'balatro_unpack.py',  'APK 解包'),
    ('config',  'balatro_config.py',  '原型表 -> 配置JSON/CSV'),
    ('text',    'balatro_text.py',    '本地化 15 语言 + 挑战'),
    ('sprites', 'balatro_sprites.py', '图集切片 -> 图片资源/'),
    ('jokers',  'balatro_jokers.py',  '小丑总表'),
    ('cards',   'balatro_cards.py',   '塔罗/幽灵/优惠券总表'),
    ('meta',    'balatro_meta.py',    '牌组/标签/盲注总表'),
    ('packs',   'balatro_packs.py',   '补充包/强化牌总表'),
    ('mods',    'balatro_mods.py',    '版本/蜡封总表'),
    ('index',   'balatro_index.py',   '总表索引'),
]

JADX = os.path.join(REPO, '_工具缓存', 'jadx', 'bin', 'jadx.bat')


def arg_value(flag, default=None):
    for a in sys.argv[1:]:
        if a.startswith(flag + '='):
            return a.split('=', 1)[1]
    return default


def run(cmd, label):
    t0 = time.time()
    print('\n>>> %s' % label)
    print('    $ %s' % ' '.join(os.path.basename(c) for c in cmd))
    p = subprocess.run(cmd, cwd=ROOT)
    dt = time.time() - t0
    ok = p.returncode == 0
    print('    %s  %.1fs' % ('OK' if ok else '失败 (exit %d)' % p.returncode, dt))
    return ok, dt


def run_jadx():
    dex = os.path.join(ROOT, '安卓壳', 'classes.dex')
    out = os.path.join(ROOT, '安卓壳', 'jadx')
    if not os.path.exists(JADX):
        print('    跳过:找不到 jadx (%s)' % JADX)
        return None, 0.0
    if not os.path.exists(dex):
        print('    跳过:还没解包出 classes.dex')
        return None, 0.0
    return run([JADX, '-d', out, '--no-res', '-q', dex], 'jadx  反编译 classes.dex')


def main():
    only = [s.strip() for s in (arg_value('--only') or '').split(',') if s.strip()]
    skip = [s.strip() for s in (arg_value('--skip') or '').split(',') if s.strip()]
    apk = arg_value('--apk')
    dry = '--dry' in sys.argv
    want_jadx = '--jadx' in sys.argv

    plan = []
    for name, script, note in STEPS:
        if only and name not in only:
            continue
        if name in skip:
            continue
        cmd = [sys.executable, os.path.join(HERE, script)]
        if name == 'unpack' and apk:
            cmd.append(apk)
        plan.append((name, cmd, note))

    unknown = set(only + skip) - {s[0] for s in STEPS} - {'jadx'}
    if unknown:
        print('!! 未知步骤名:%s' % ', '.join(sorted(unknown)))
        return 2

    print('Balatro 全流程  工作目录 %s' % ROOT)
    print('计划 %d 步%s:' % (len(plan), ' + jadx' if want_jadx else ''))
    for i, (name, _, note) in enumerate(plan, 1):
        print('  %2d. %-8s %s' % (i, name, note))
    if want_jadx:
        print('  %2d. %-8s %s' % (len(plan) + 1, 'jadx', '反编译 classes.dex(慢)'))
    if dry:
        print('\n--dry,不执行。')
        return 0

    t0 = time.time()
    results = []
    for name, cmd, note in plan:
        ok, dt = run(cmd, '%-8s %s' % (name, note))
        results.append((name, ok, dt))
        if not ok:
            print('\n!! %s 失败,后面的步骤依赖它,停止。' % name)
            break
    else:
        if want_jadx:
            ok, dt = run_jadx()
            if ok is not None:
                results.append(('jadx', ok, dt))

    total = time.time() - t0
    print('\n' + '=' * 56)
    for name, ok, dt in results:
        print('  %-8s %-4s %6.1fs' % (name, 'OK' if ok else '失败', dt))
    failed = [n for n, ok, _ in results if not ok]
    print('  %-8s %-4s %6.1fs' % ('合计', '', total))
    print('=' * 56)

    if failed:
        print('失败步骤:%s' % ', '.join(failed))
        return 1

    # 收尾:把索引里的统计回显一遍,一眼看出产物对不对
    idx = os.path.join(ROOT, '配置', '配置CSV', '_总表索引.csv')
    if os.path.exists(idx):
        import csv
        with io.open(idx, encoding='utf-8-sig', newline='') as f:
            rows = list(csv.DictReader(f))
        print('产物:%d 张总表 / %d 条内容条目'
              % (len(rows), sum(int(r['条目数']) for r in rows)))
    print('全部完成。数值结论见 数值设计报告.md,导航见 配置/总表索引.md')
    return 0


if __name__ == '__main__':
    sys.exit(main())
