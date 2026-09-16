# -*- coding: utf-8 -*-
"""从实际产出的 CSV 反读，生成 `配置/总表索引.md`。

改了任何一张总表后重跑本脚本刷新索引；索引里的行数/列名都是实读的，不手写。

用法:
    python brotato_index.py [配置目录]
"""
import csv
import io
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from brotato_common import ROOT, setup_stdout, write_text

# 每张表：主键列 / 生成脚本 / 数据出处 / 逻辑出处
META = {
    '_道具总表': ('id', 'brotato_config.py', '资源/items/all/*/\\*_data.tres',
                '源码/items/global/item_data.gd + effect.gd'),
    '_角色总表': ('id', 'brotato_config.py', '资源/items/characters/*/\\*_data.tres',
                '源码/items/characters/character_data.gd'),
    '_武器总表': ('id', 'brotato_config.py', '资源/weapons/{melee,ranged}/*/<tier>/\\*_data.tres + \\*_stats.tres',
                '源码/weapons/weapon_stats/*.gd + 源码/singletons/weapon_service.gd'),
    '_敌人总表': ('资源', 'brotato_config.py', '资源/entities/units/**/\\*_stats.tres',
                '源码/entities/units/unit/unit.gd(每波成长在这)'),
    '_套装总表': ('id+件数', 'brotato_config.py', '资源/items/sets/*/\\*_set_data.tres',
                '源码/items/sets/set_data.gd'),
    '_升级总表': ('id', 'brotato_config.py', '资源/items/upgrades/**/\\*.tres',
                '源码/singletons/item_service.gd::get_upgrade_data'),
    '_挑战总表': ('id', 'brotato_config.py', '资源/challenges/\\*_data.tres',
                '源码/singletons/challenge_service.gd'),
    '_难度总表': ('id', 'brotato_config.py', '资源/items/difficulties/*/\\*.tres',
                '源码/singletons/run_data.gd::init_elites_spawn'),
    '_消耗品总表': ('id', 'brotato_config.py', '资源/items/consumables/*/\\*_data.tres',
                 '源码/main.gd::spawn_consumables'),
    '_效果总表': ('资源', 'brotato_config.py', '资源/**/\\*effect\\*.tres',
                '源码/effects/**/*.gd（每个子类的 get_args 决定描述怎么填）'),
    '_属性总表': ('属性key', 'brotato_config.py', '资源/items/upgrades/stats/\\*.tres',
                '源码/singletons/run_data.gd::init_stats'),
    '_区域总表': ('id', 'brotato_config.py', '资源/zones/zone_*/zone_*_data.tres',
                '源码/zones/zone_service.gd'),
    '_角色构筑总表': ('id', 'brotato_builds.py', '资源/items/characters/*/\*_data.tres + 全部武器/道具',
                  '源码/singletons/run_data.gd::get_stat(gain 乘区) + weapon_service.gd:110-127(伤害乘区)'),
    '_属性道具表': ('属性key+道具id', 'brotato_builds.py', '资源/items/all/*/\*_data.tres',
                 '源码/items/global/effect.gd::apply'),
    '_套装武器表': ('套装id', 'brotato_builds.py', '资源/items/sets/*/\*_set_data.tres + 武器的 sets 字段',
                 '源码/singletons/weapon_service.gd:60-67(class_bonus 怎么加到武器上)'),
    '_武器协同表': ('武器族', 'brotato_loadouts.py', '资源/weapons/**/\*_data.tres + \*_stats.tres',
                 '源码/singletons/weapon_service.gd:56-67(武器加成) + 各 effects 子类'),
    '_套装交集表': ('套装A+套装B', 'brotato_loadouts.py', '武器的 sets 字段两两求交',
                 '源码/singletons/run_data.gd:401-423(套装按件数计数)'),
    '_最优套装组合': ('目标+口径', 'brotato_loadouts.py', '穷举 6 格（同款可重复 / 全不同两种口径）',
                  '源码/singletons/run_data.gd:419(只取当前件数那一档，>6 件封顶)'),
    '_波次总表': ('区域+波次', 'brotato_config.py', '资源/zones/zone_1/0NN/wave_N.tres',
                '源码/zones/wave_manager.gd'),
    '_波次刷怪组': ('区域+波次+组', 'brotato_config.py', '资源/zones/zone_1/0NN/group_\\*.tres',
                 '源码/zones/wave_group_data.gd'),
    '_波次单位': ('区域+波次+单位', 'brotato_config.py', '资源/zones/zone_1/0NN/\\*_unit_\\*.tres',
                '源码/zones/wave_unit_data.gd'),
}

# 每张表独有、别处查不到的列
SPECIAL = {
    '_道具总表': '标签（决定角色 wanted_tags 的 5% 定向出货）、上限（max_nb）、效果类',
    '_武器总表': '冷却帧/冷却秒（60 帧=1 秒）、加成属性（scaling_stats）、升级为、套装',
    '_敌人总表': '每波+生命 / 每波+伤害 / 每波+护甲（线性成长斜率）、材料价值',
    '_挑战总表': '统计项 + 阈值 + 奖励类型/奖励（解锁链就靠这两列串）',
    '_套装总表': '件数（2~6 件分档）',
    '_波次刷怪组': '出现时机秒 / 重复间隔 / 间隔递减 / 最低难度',
    '_效果总表': '效果类 + 额外字段（子类特有的 burning_data、stats、chance 等）',
    '_角色构筑总表': '流派 / 死属性(乘成0) / 硬限制 / 套装绑定 / 属性联动 / 推荐武器(模拟DPS) / 对它无效的道具',
    '_属性道具表': '每百材料点数（配装的"物价"，射程 41 最便宜、远程伤害 3.9 最贵）',
    '_套装武器表': '成员武器族 + 2~6 件分档效果 + 绑定角色',
    '_武器协同表': '特殊效果 / 效果吃哪条属性 / 效果要点 / 同类协同（共享 scaling 属性或同类效果的武器）',
    '_套装交集表': '共有武器（6 把这一族就能同时点满两套 6 件）',
    '_最优套装组合': '两种口径的穷举上限：同款可重复 vs 6 把全不同族',
}


def run(cfg_dir):
    setup_stdout()
    csv_dir = os.path.join(cfg_dir, '配置CSV')
    lines = ['# 总表索引', '',
             '由 `工具/brotato_index.py` 从 `配置CSV/` 实读生成，改表后重跑刷新。', '']
    rows = []
    for fn in sorted(os.listdir(csv_dir)):
        if not fn.startswith('_') or not fn.endswith('.csv'):
            continue
        name = fn[:-4]
        with io.open(os.path.join(csv_dir, fn), encoding='utf-8-sig') as f:
            r = list(csv.reader(f))
        header = r[0] if r else []
        rows.append((name, len(r) - 1, header))
    lines.append('| 总表 | 条目数 | 主键 | 生成脚本 | 列数 |')
    lines.append('|---|---:|---|---|---:|')
    for name, n, header in rows:
        pk, script, _src, _logic = META.get(name, ('', 'brotato_config.py', '', ''))
        lines.append('| `配置CSV/%s.csv` | %d | %s | `%s` | %d |' % (name, n, pk, script, len(header)))
    lines.append('')
    for name, n, header in rows:
        pk, script, src, logic = META.get(name, ('', '', '', ''))
        lines.append('## %s（%d 条）' % (name, n))
        lines.append('')
        lines.append('- 主键：%s' % (pk or '—'))
        lines.append('- 原始数据：`%s`' % (src or '—'))
        lines.append('- 逻辑出处：`%s`' % (logic or '—'))
        if name in SPECIAL:
            lines.append('- 特有列：%s' % SPECIAL[name])
        lines.append('- 全部列：%s' % ' / '.join('`%s`' % h for h in header))
        lines.append('')
    write_text(os.path.join(cfg_dir, '总表索引.md'), '\n'.join(lines))
    print('索引写出 %d 张表 -> %s' % (len(rows), os.path.join(cfg_dir, '总表索引.md')))


def main(argv):
    run(argv[0] if argv else os.path.join(ROOT, '配置'))


if __name__ == '__main__':
    main(sys.argv[1:])
