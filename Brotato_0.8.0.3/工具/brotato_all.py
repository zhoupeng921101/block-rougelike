# -*- coding: utf-8 -*-
"""一键重跑整条链路：APK -> 全部产物。

按依赖顺序跑 7 步，单步失败即停并报是哪一步。产物幂等，可用 md5 比对验证改动。

    python brotato_all.py                  # 全量
    python brotato_all.py --skip=unpack    # 资源已在盘上
    python brotato_all.py --only=config,index
    python brotato_all.py --dry            # 只列计划
"""
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from brotato_common import APK, ROOT, setup_stdout

STEPS = [
    ('unpack', 'APK -> 资源/ + 图片资源/ + 音频/ + 安卓壳/', 'brotato_unpack', []),
    ('gdc', '.gdc 字节码 -> 源码/', 'brotato_gdc', []),
    ('text', '13 语言 .translation -> 文本/', 'brotato_text', []),
    ('config', '.tres -> 配置/配置JSON + 配置CSV', 'brotato_config', []),
    ('builds', '角色构筑推导 -> 构筑/属性道具/套装武器 三张表', 'brotato_builds', []),
    ('loadouts', '武器搭配与套装组合穷举 -> 协同/交集/最优组合 三张表', 'brotato_loadouts', []),
    ('index', '配置CSV -> 配置/总表索引.md', 'brotato_index', []),
]


def main(argv):
    setup_stdout()
    skip = set()
    only = set()
    for a in argv:
        if a.startswith('--skip='):
            skip = set(a.split('=', 1)[1].split(','))
        elif a.startswith('--only='):
            only = set(a.split('=', 1)[1].split(','))
    dry = '--dry' in argv

    plan = [s for s in STEPS if s[0] not in skip and (not only or s[0] in only)]
    print('计划 %d 步：%s' % (len(plan), ' -> '.join(s[0] for s in plan)))
    if dry:
        for name, desc, mod, _ in plan:
            print('  %-8s %-46s (%s.py)' % (name, desc, mod))
        return 0
    if not os.path.exists(APK):
        print('找不到 APK: %s' % APK)
        return 2

    t0 = time.time()
    for name, desc, mod, args in plan:
        print('\n===== [%s] %s' % (name, desc))
        t = time.time()
        try:
            m = __import__(mod)
            m.main(list(args))
        except Exception as e:
            print('\n!! 第 [%s] 步失败: %s: %s' % (name, type(e).__name__, e))
            import traceback
            traceback.print_exc()
            return 1
        print('----- [%s] 完成，%.1fs' % (name, time.time() - t))
    print('\n全部完成，总计 %.1fs，产物在 %s' % (time.time() - t0, ROOT))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
