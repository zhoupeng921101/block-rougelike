# -*- coding: utf-8 -*-
"""Balatro 总表索引:把 配置CSV/_*总表.csv 汇成一张导航表。

行数/列数/列名一律**从 CSV 实读**,不写死,所以重跑任何一个总表脚本后再跑这个,
索引不会和产物对不上。每张表的类别/主键/脚本/出处/配置驱动比例是人工整理的元信息,
放在 META 里。

产出:
  配置/配置CSV/_总表索引.csv   一表一行,可排序可筛
  配置/总表索引.md             同一份内容的可读版,带各表的特有列与一句话要点

用法: python balatro_index.py [配置目录]
"""
import csv
import glob
import io
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if hasattr(sys.stdout, 'reconfigure'):   # Windows 控制台默认 GBK
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 人工元信息。顺序即索引里的排列顺序(按「玩家最常问」粗排)
META = [
    # 文件名(无扩展), 类别, 主键, 生成脚本, 原型数据来源, 效果逻辑出处, 配置驱动, 要点
    ('_小丑总表', '小丑 Joker', 'key (j_*)', 'balatro_jokers.py',
     'game.lua P_CENTERS(set=Joker)', 'card.lua Card:calculate_joker(2294-4066)',
     '19/150 = 13%',
     '生效方式分三类:按名字 106 / 通用规则 19 / 外部引用 25;43 张成长型填的是初始值'),
    ('_塔罗总表', '塔罗 Tarot', 'key (c_*)', 'balatro_cards.py',
     'game.lua P_CENTERS(set=Tarot)', 'card.lua Card:use_consumeable(1092)',
     '17/22 = 77%',
     '模板化内容:转强化 10 / 转花色 4,加一张同族只填 config;统一售价 $3'),
    ('_幽灵总表', '幽灵 Spectral', 'key (c_*)', 'balatro_cards.py',
     'game.lua P_CENTERS(set=Spectral)', 'card.lua Card:use_consumeable(1092)',
     '4/18 = 22%',
     '与塔罗相反,14 张各写各的;统一售价 $4,散卡 spectral_rate=0 只能靠幽灵包'),
    ('_优惠券总表', '优惠券 Voucher', 'key (v_*)', 'balatro_cards.py',
     'game.lua P_CENTERS(set=Voucher)', 'card.lua Card:apply_to_run(1882-1974)',
     '0/32',
     '严格 16 对基础/升级,全 $10;27 张买下即改全局,5 张靠 used_vouchers 被动查询'),
    ('_牌组总表', '牌组 Back', 'key (b_*)', 'balatro_meta.py',
     'game.lua P_CENTERS(set=Back)', 'back.lua Back:apply_to_run(176)',
     '16/16 = 100%',
     '全包配置化最高的一类,一个按名字的分支都没有;没有配了不被消费的字段'),
    ('_标签总表', '标签 Tag', 'key (tag_*)', 'balatro_meta.py',
     'game.lua P_TAGS', 'tag.lua Tag:apply_to_run(115)',
     'config.type 全驱动',
     'config.type 就是触发时机(10 种);9 张锁 min_ante=2'),
    ('_盲注总表', '盲注 Blind', 'key (bl_*)', 'balatro_meta.py',
     'game.lua P_BLINDS', 'blind.lua 的 9 个方法',
     '6/30 = 20%',
     '22 条按名字 / 6 条 debuff 配置驱动 / 2 条(小盲大盲)只有分数倍率'),
    ('_补充包总表', '补充包 Booster', 'key (p_*)', 'balatro_packs.py',
     'game.lua P_CENTERS(set=Booster)', 'game.lua update_*_pack 各状态机',
     '32/32 = 100%',
     '5 种 × 3 档;weight 出货权重只在原型表里;描述在 descriptions.Other'),
    ('_强化牌总表', '强化牌 Enhanced', 'key (m_*)', 'balatro_packs.py',
     'game.lua P_CENTERS(set=Enhanced)', 'card.lua 的 get_chip_* / get_p_dollars',
     '5/8 = 63%',
     '5 张靠通用 getter 读 config;石头牌/幸运牌比 effect、万能牌比 name'),
    ('_版本总表', '版本 Edition', 'key (e_*)', 'balatro_mods.py',
     'game.lua P_CENTERS(set=Edition)', 'card.lua Card:set_edition(390-417)',
     '3/5(负片那条是死字段)',
     '掉率/售价加成都不在 config;e_negative.config.extra 全树无人读'),
    ('_蜡封总表', '蜡封 Seal', 'key (Gold/Red/…)', 'balatro_mods.py',
     'game.lua P_SEALS', 'card.lua 多处 self.seal == …',
     '0/4,连 config 字段都没有',
     '配置化程度的地板;文案在 descriptions.Other.<小写>_seal,没有 Seal 集合'),
]

# 每张表值得点名的特有列(通用列如 key/中文名/描述/图片 不重复列)
HIGHLIGHT = {
    '_小丑总表': ['稀有度', '生效方式', '通用规则', '触发时机', '成长型', '蓝图可复制', '代码出处'],
    '_塔罗总表': ['作用类型', '生效方式', '需选牌数', '转换目标', '消耗所选牌'],
    '_幽灵总表': ['作用类型', '生效方式', '需选牌数', '转换目标', '消耗所选牌'],
    '_优惠券总表': ['档位', '前置券', '升级为', '生效方式', '生效字段', '查询点'],
    '_牌组总表': ['生效字段', '未被 apply_to_run 认的字段', '解锁条件类型', '解锁条件'],
    '_标签总表': ['触发类型', '触发时机', '最低底注', '依赖资产'],
    '_盲注总表': ['类型', '分数倍率', '通关奖励$', '最低出场Ante', '生效方式', 'debuff判据', '生效方法'],
    '_补充包总表': ['种类', '档位', '可选数', '候选数', '每张成本', '出货权重', '权重占比%'],
    '_强化牌总表': ['effect', '附加筹码', '生效方式', '数值消费点', '名字出现处'],
    '_版本总表': ['效果类型', '效果数值', '掉率_基础%', '掉率_保底包%', '售价加成$', '数值消费点'],
    '_蜡封总表': ['触发时机', '效果', '数值来源', '实现说明', '生效点', '文案键'],
}


def read_csv_shape(path):
    """返回 (行数, 列数, 列名列表)。CSV 是 utf-8-sig。"""
    with io.open(path, encoding='utf-8-sig', newline='') as f:
        r = csv.reader(f)
        header = next(r, [])
        n = sum(1 for _ in r)
    return n, len(header), header


def main():
    cfg_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '配置')
    csv_dir = os.path.join(cfg_dir, '配置CSV')

    on_disk = {os.path.splitext(os.path.basename(p))[0]
               for p in glob.glob(os.path.join(csv_dir, '_*总表.csv'))}
    known = {m[0] for m in META}
    missing = known - on_disk
    extra = on_disk - known - {'_总表索引'}
    if missing:
        print('!! META 里有但盘上没有:', ', '.join(sorted(missing)))
    if extra:
        print('!! 盘上有但 META 没登记:', ', '.join(sorted(extra)))

    rows, total = [], 0
    for i, (name, cate, pk, script, proto, logic, driven, note) in enumerate(META, 1):
        path = os.path.join(csv_dir, name + '.csv')
        if not os.path.exists(path):
            continue
        n, ncol, header = read_csv_shape(path)
        total += n
        cols = [c for c in HIGHLIGHT.get(name, []) if c in header]
        rows.append({
            '序号': i,
            '总表': name + '.csv',
            '类别': cate,
            '条目数': n,
            '列数': ncol,
            '主键': pk,
            '生成脚本': script,
            '原型数据来源': proto,
            '效果逻辑出处': logic,
            '配置驱动': driven,
            '特有列': '; '.join(cols),
            '要点': note,
        })

    out_csv = os.path.join(csv_dir, '_总表索引.csv')
    cols = list(rows[0].keys())
    with io.open(out_csv, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)

    # ---- Markdown 可读版 ----
    md = []
    md.append('# Balatro 1.0.1o 总表索引\n')
    md.append('`配置/配置CSV/` 下 %d 张总表，共 **%d 条**内容条目。'
              '这份索引由 `工具/balatro_index.py` 从 CSV 实读生成，'
              '改了任何一张总表后重跑即可刷新。\n' % (len(rows), total))
    md.append('数值结论看 [数值设计报告.md](../数值设计报告.md)，'
              '解析细节看 [工具文档/Balatro技术细节.md](../../工具文档/Balatro技术细节.md)。\n')
    md.append('## 一览\n')
    md.append('| # | 总表 | 类别 | 条目 | 列 | 生成脚本 | 配置驱动 |')
    md.append('|--:|---|---|--:|--:|---|---|')
    for r in rows:
        md.append('| %d | [%s](配置CSV/%s) | %s | %d | %d | `%s` | %s |' % (
            r['序号'], r['总表'], r['总表'], r['类别'], r['条目数'],
            r['列数'], r['生成脚本'], r['配置驱动']))
    md.append('\n合计 **%d 条**。\n' % total)

    md.append('## 逐表说明\n')
    for r in rows:
        md.append('### %d. %s —— %s（%d 条）\n' % (
            r['序号'], r['总表'], r['类别'], r['条目数']))
        md.append('- **主键**：`%s`' % r['主键'])
        md.append('- **原型数据**：`%s`' % r['原型数据来源'])
        md.append('- **效果逻辑**：`%s`' % r['效果逻辑出处'])
        md.append('- **配置驱动**：%s' % r['配置驱动'])
        if r['特有列']:
            md.append('- **特有列**：%s' % '、'.join(
                '`%s`' % c for c in r['特有列'].split('; ')))
        md.append('- **要点**：%s\n' % r['要点'])

    md.append('## 通用列\n')
    md.append('每张表都有这几列，含义一致：\n')
    md.append('| 列 | 说明 |')
    md.append('|---|---|')
    md.append('| `key` | 资产键，与 `配置JSON/` 和 `图片资源/` 对得上 |')
    md.append('| `中文名` / `英文名` | 取自 `文本/zh_CN.json`、`en-us.json` |')
    md.append('| `中文描述` / `英文描述` | **占位符已填成实际数值**，富文本标记已剥 |')
    md.append('| `数值参数` | 原型表 `config` 拍平成 `k=v` |')
    md.append('| `占位变量取值` | `#1#` `#2#` 各取自哪个字段、值是多少 |')
    md.append('| `order` | 游戏内排序 |')
    md.append('| `图片` | 对应 `图片资源/` 下的 PNG 相对路径 |')
    md.append('\n> 成长型条目（小丑里有 43 张）描述里填的是**初始值**，'
              '实际强度要按「触发次数 × 增量」估。\n')

    out_md = os.path.join(cfg_dir, '总表索引.md')
    io.open(out_md, 'w', encoding='utf-8', newline='\n').write('\n'.join(md))

    print('索引 %d 张表 / %d 条内容' % (len(rows), total))
    print('  ->', out_csv)
    print('  ->', out_md)


if __name__ == '__main__':
    main()
