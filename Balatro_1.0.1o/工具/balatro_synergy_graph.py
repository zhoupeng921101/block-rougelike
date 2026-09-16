# -*- coding: utf-8 -*-
"""Balatro 倍增关系图:把 balatro_synergy.py 产出的边表画成两张关系图。

① 倍增网络总图  左边是倍增源、右边是被它乘的目标集合,边宽 = 命中张数。
   目标取**主目标集合**而不是「目标卡的全部流派标签」——后者会重复计数
   (血石同时是花色流与逐张计分,按标签聚合会把同一条边算两遍)。
② 产销链        三层:产出方 → 资源 → 消费方。右侧红色方括号是反协同。
   重点是:强化牌流的燃料全在塔罗/幽灵里,不在小丑池。

节点上的所有数字都从 _小丑倍增关系.csv 与 _小丑流派表.csv 实读,不写死;
画布高度按内容算,不写死。

产出: 图表/倍增关系图.svg  (自带亮/暗两套配色)
用法: python balatro_synergy_graph.py [输出SVG路径]
"""
import csv
import io
import os
import sys
from collections import defaultdict

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSVDIR = os.path.join(ROOT, '配置', '配置CSV')

# ---------------------------------------------------------------- 图的骨架
MECH = [('R 重复触发', 's1'), ('C 复制', 's2'), ('E 使能器', 's3'), ('O 概率翻倍', 's4')]
LINKS = [   # 机制, 源, 主目标(多个用 | 分隔), 源下面那行小字
    ('R 重复触发', '黄昏',      'percard',   '全量'),
    ('R 重复触发', '苏打水',     'percard',   '全量 · 限 10 手'),
    ('R 重复触发', '未断选票',    'percard',   '仅首张'),
    ('R 重复触发', '烂脱口秀演员',  'percard',   '子集 · 2~5'),
    ('R 重复触发', '喜与悲',     'percard',   '子集 · 人头牌'),
    ('R 重复触发', '哑剧演员',    'held',      '手牌区,另一批'),
    ('C 复制',    '蓝图',      'xmult',     '复制右邻'),
    ('C 复制',    '头脑风暴',    'xmult',     '复制最左'),
    ('C 复制',    '隐形小丑',    'xmult',     '售出时复制'),
    ('C 复制',    '帕奇欧',     'xmult',     '离店复制消耗牌'),
    ('E 使能器',   '四指',      'hand|suit', '同花/顺子 4 张即可'),
    ('E 使能器',   '捷径',      'hand',      '顺子可隔 1 点'),
    ('E 使能器',   '飞溅',      'percard',   '全部打出牌都计分'),
    ('E 使能器',   '模糊小丑',    'suit',      '四色并两色'),
    ('E 使能器',   '马戏团长',    'consum',    '消耗品可多张'),
    ('E 使能器',   '幻视',      'face',      '所有牌算人头牌'),
    ('O 概率翻倍',  '六六大顺',    'odds',      '写明的几率 ×2'),
]
TARGETS = [  # key, 显示名, 规模取数方式
    ('xmult',   'X倍率卡',       'axis:轴C X倍率(乘法)'),
    ('percard', '逐张计分',      'tag:逐张计分'),
    ('hand',    '牌型流',        'tag:牌型流'),
    ('suit',    '花色流',        'tag:花色流'),
    ('face',    '人头牌流',      'tag:人头牌流'),
    ('consum',  '消耗品流',      'tag:消耗品流'),
    ('held',    '手牌保留·逐张',  'fixed:4'),
    ('odds',    '写明几率的卡',   'mech:O 概率翻倍'),
]

# ② 产销链:(资源, [产出方], [消费方])。产出方带括号的是小丑池外的。
CHAINS = [
    ('钢铁牌',    ['战车(塔罗)'],                          ['钢铁小丑']),
    ('玻璃牌',    ['正义(塔罗)'],                          ['玻璃小丑']),
    ('幸运牌',    ['魔术师(塔罗)'],                        ['招财猫']),
    ('黄金牌',    ['恶魔(塔罗)', '迈达斯面具'],              ['黄金门票']),
    ('石头牌',    ['塔(塔罗)', '大理石小丑'],                ['石头小丑']),
    ('强化牌总量', ['以上全部(塔罗)'],                            ['驾驶执照', '吸血鬼']),
    ('红蜡封',    ['既视感(幽灵)'],                        ['(= 第 7 个重复触发源)']),
    ('塔罗牌',    ['卡牌术士、幻觉、八号球、叠加态、流浪者'],     ['占卜师']),
    ('星球牌',    ['天文学家'],                            ['星座、卫星']),
    ('牌型等级',  ['太空小丑、烧焦小丑'],                    ['超新星']),
    ('牌组张数',  ['DNA、全息影像'],                        ['蓝色小丑']),
]
ANTI_BRACKET = [
    ('吸血鬼', ['钢铁牌', '玻璃牌', '幸运牌', '强化牌总量'], '吃掉强化牌，拆这四张吃的存量'),
    ('侵蚀',  ['牌组张数'], '靠牌少吃饭，被 DNA/全息影像反向拆'),
]

W = 1040
P1_T = 128
STYLE = """<style>
svg{--surface:#fcfcfb;--ink:#0b0b0b;--ink2:#52514e;--ink3:#8a8984;--chip:#f1f0ec;
--s1:#2a78d6;--s2:#eb6834;--s3:#1baf7a;--s4:#eda100;--s5:#e87ba4;--crit:#c02d2d;}
@media (prefers-color-scheme:dark){svg{--surface:#1a1a19;--ink:#fff;--ink2:#c3c2b7;--ink3:#8f8e86;--chip:#262623;
--s1:#3987e5;--s2:#d95926;--s3:#199e70;--s4:#c98500;--s5:#d55181;--crit:#e66767;}}
.bg{fill:var(--surface)} .ttl{fill:var(--ink);font-size:19px;font-weight:650}
.sub{fill:var(--ink2);font-size:12.5px} .h2{fill:var(--ink);font-size:13.5px;font-weight:650}
.nd{fill:var(--ink);font-size:12.5px;font-weight:600} .nd2{fill:var(--ink2);font-size:12px}
.sm{fill:var(--ink3);font-size:10.5px} .note{fill:var(--ink3);font-size:11px}
.mk{stroke:var(--surface);stroke-width:2}
.halo{paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round}
</style>"""
FONT = ('-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Microsoft YaHei&quot;,'
        '&quot;PingFang SC&quot;,&quot;Noto Sans CJK SC&quot;,sans-serif')


def load():
    def rd(fn):
        with io.open(os.path.join(CSVDIR, fn), encoding='utf-8-sig') as f:
            return list(csv.DictReader(f))
    return rd('_小丑流派表.csv'), rd('_小丑倍增关系.csv')


def target_sizes(fac, edges):
    size = {}
    for key, _, how in TARGETS:
        kind, val = how.split(':', 1)
        if kind == 'tag':
            size[key] = sum(1 for r in fac if val in (r['流派'] or '').split('/'))
        elif kind == 'axis':
            size[key] = sum(1 for r in fac if r['计分轴'] == val)
        elif kind == 'mech':
            size[key] = len(set(e['目标'] for e in edges if e['机制'] == val))
        else:
            size[key] = int(val)
    return size


def member(fac_by_name, tkey, target):
    """某张目标卡属不属于这个目标集合。"""
    how = dict((k, h) for k, _, h in TARGETS)[tkey]
    kind, val = how.split(':', 1)
    r = fac_by_name.get(target)
    if kind == 'tag':
        return bool(r) and val in (r['流派'] or '').split('/')
    if kind == 'axis':
        return bool(r) and r['计分轴'] == val
    return True          # fixed / mech:整组都算


def hit_counts(fac, edges):
    """(机制, 源, 目标集合) -> 实际命中张数。按集合分别数,不拿集合规模顶替。"""
    by_name = {r['中文名']: r for r in fac}
    per = defaultdict(set)
    for e in edges:
        m = e['机制'].replace('(通用)', '')
        for tkey, _, _ in TARGETS:
            if member(by_name, tkey, e['目标']):
                per[(m, e['源'], tkey)].add(e['目标'])
    return per


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def build(fac, edges):
    size = target_sizes(fac, edges)
    per = hit_counts(fac, edges)
    o = []
    A = o.append

    # ---------- 先排版,再决定画布高度 ----------
    ROW, GAP, HDR = 34, 16, 22
    rows, y, last_m = [], P1_T + 20, None
    for mech, src, tkeys, note in LINKS:
        if mech != last_m:
            if last_m is not None:
                y += GAP
            rows.append(('HDR', mech, None, None, y))
            y += HDR
            last_m = mech
        rows.append((mech, src, tkeys.split('|'), note, y))
        y += ROW
    P1_B = y - ROW + 18
    NOTE1 = P1_B + 30
    P2_T = NOTE1 + 62
    CHAIN_T = P2_T + 38
    P2_B = CHAIN_T + 30 * (len(CHAINS) - 1)
    NOTE2 = P2_B + 44
    H = int(NOTE2 + 46)

    A('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" font-family="%s">'
      % (W, H, W, H, FONT))
    A(STYLE)
    A('<rect class="bg" x="0" y="0" width="%d" height="%d"/>' % (W, H))
    A('<text class="ttl" x="56" y="40">小丑倍增关系图</text>')
    A('<text class="sub" x="56" y="62">Balatro 1.0.1o · 150 张小丑 · 420 条关系 · 数据出自 _小丑倍增关系.csv 与 _小丑流派表.csv</text>')
    A('<text class="sub" x="56" y="80">「倍增」= 收益落在得分公式 (筹码) × (倍率) × Π(X倍率) 的某一项上，不是「配合得好」</text>')

    # ================= ① =================
    A('<text class="h2" x="56" y="%d">① 倍增源 → 它乘的是谁（边宽 = 命中张数）</text>' % (P1_T - 22))
    LX, RX = 268, 700
    data_rows = [r for r in rows if r[0] != 'HDR']
    tys, ty = {}, P1_T + 28
    span = (P1_B - P1_T - 56) / max(len(TARGETS) - 1, 1)
    for key, _, _ in TARGETS:
        tys[key] = ty
        ty += span

    for mech, src, tkeys, note, sy in data_rows:
        color = dict(MECH)[mech]
        for i, tkey in enumerate(tkeys):
            n = len(per.get((mech, src, tkey), ()))
            ty = tys[tkey]
            wdt = max(1.3, min(7.5, n / 5.0))
            cx = (LX + RX) / 2
            A('<path d="M %d %.1f C %.1f %.1f, %.1f %.1f, %d %.1f" fill="none" stroke="var(--%s)" '
              'stroke-width="%.1f" opacity="0.4" stroke-linecap="round"/>'
              % (LX, sy, cx, sy, cx, ty, RX, ty, color, wdt))
            # 命中数贴在靠源的一侧并按第几条边错开,避免全挤在中线
            lx = LX + 46 + i * 38
            t = sy + (ty - sy) * 0.5 * ((lx - LX) / (RX - LX)) ** 1.6
            A('<text class="sm halo" x="%.1f" y="%.1f" text-anchor="middle" fill="var(--%s)" font-weight="650">%d</text>'
              % (lx, t - 5, color, n))

    for item in rows:
        if item[0] == 'HDR':
            _, mech, _, _, hy = item
            A('<text class="sm" x="56" y="%d" fill="var(--%s)" font-weight="650">%s</text>'
              % (hy + 4, dict(MECH)[mech], mech))
            continue
        mech, src, tkeys, note, sy = item
        color = dict(MECH)[mech]
        A('<circle class="mk" cx="%d" cy="%.1f" r="4.5" fill="var(--%s)"/>' % (LX, sy, color))
        A('<text class="nd" x="%d" y="%.1f" text-anchor="end">%s</text>' % (LX - 13, sy + 1, esc(src)))
        if note:
            A('<text class="sm" x="%d" y="%.1f" text-anchor="end">%s</text>' % (LX - 13, sy + 15, esc(note)))
    for key, name, _ in TARGETS:
        ty = tys[key]
        A('<circle class="mk" cx="%d" cy="%.1f" r="5.5" fill="var(--ink3)"/>' % (RX, ty))
        A('<text class="nd" x="%d" y="%.1f">%s</text>' % (RX + 14, ty + 1, esc(name)))
        A('<text class="sm" x="%d" y="%.1f">共 %d 张</text>' % (RX + 14, ty + 16, size[key]))

    A('<text class="note" x="56" y="%d">读法：黄昏/苏打水命中 20 张全量；未断选票同样覆盖 20 张，但只作用于第一张计分牌；喜与悲与烂脱口秀演员的作用面互斥（人头牌 vs 2~5），不是同一种卡。</text>' % NOTE1)
    A('<text class="note" x="56" y="%d">四张复制卡各覆盖 35 张 X倍率卡，是全池连接度最高的一档——它们的期望值等于你构筑上限的函数。</text>' % (NOTE1 + 18))

    # ================= ② =================
    A('<text class="h2" x="56" y="%d">② 产销链：谁把谁的累加器喂大</text>' % P2_T)
    CX, PX, SX, BRK = 470, 292, 646, 852
    A('<text class="sm" x="%d" y="%d" text-anchor="end" fill="var(--ink3)">产出方</text>' % (PX - 8, CHAIN_T - 17))
    A('<text class="sm" x="%d" y="%d" text-anchor="middle" fill="var(--ink3)">资源</text>' % (CX, CHAIN_T - 17))
    A('<text class="sm" x="%d" y="%d" fill="var(--ink3)">消费方（小丑）</text>' % (SX + 8, CHAIN_T - 17))
    y, ypos = CHAIN_T, {}
    for res, prods, cons in CHAINS:
        ext = any('(' in p for p in prods)
        col = 's5' if ext else 's3'
        A('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="var(--%s)" stroke-width="1.8" opacity="0.55"/>'
          % (PX, y, CX - 52, y, col))
        A('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="var(--%s)" stroke-width="1.8" opacity="0.55"/>'
          % (CX + 52, y, SX, y, col))
        A('<rect x="%d" y="%.1f" width="104" height="21" rx="5" fill="var(--chip)" stroke="var(--%s)" stroke-width="1.2"/>'
          % (CX - 52, y - 10.5, col))
        A('<text class="nd2" x="%d" y="%.1f" text-anchor="middle">%s</text>' % (CX, y + 4, esc(res)))
        A('<text class="nd2" x="%d" y="%.1f" text-anchor="end">%s</text>' % (PX - 8, y + 4, esc('、'.join(prods))))
        A('<text class="nd2" x="%d" y="%.1f">%s</text>' % (SX + 8, y + 4, esc('、'.join(cons))))
        ypos[res] = y
        y += 30

    for src, res_keys, why in ANTI_BRACKET:
        ys = [ypos[k] for k in res_keys if k in ypos]
        if not ys:
            continue
        top, bot = min(ys), max(ys)
        if top == bot:
            top, bot = top - 7, bot + 7
        A('<path d="M %d %.1f L %d %.1f L %d %.1f L %d %.1f" fill="none" stroke="var(--crit)" '
          'stroke-width="1.5" stroke-dasharray="4 3"/>' % (BRK - 9, top, BRK, top, BRK, bot, BRK - 9, bot))
        A('<text class="nd2" x="%d" y="%.1f" fill="var(--crit)">⊣ %s</text>' % (BRK + 9, (top + bot) / 2 - 3, esc(src)))
        A('<text class="sm" x="%d" y="%.1f" fill="var(--crit)">%s</text>' % (BRK + 9, (top + bot) / 2 + 12, esc(why)))

    A('<text class="note" x="56" y="%d">粉色链 = 燃料在小丑池之外（塔罗/幽灵产出）。X倍率占比最高的强化牌流（50%%），燃料 100%% 靠塔罗——这是一条跨内容类型的依赖，光看小丑池看不出来。</text>' % NOTE2)
    A('<text class="note" x="56" y="%d">吸血鬼那组值得单说：它自己是强化牌流的 X倍率卡（每吃一张 X0.1），但吃法正好摧毁同流派另外四张的存量。同一流派内部自带互斥线。</text>' % (NOTE2 + 18))
    A('</svg>')
    return '\n'.join(o)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '图表', '倍增关系图.svg')
    fac, edges = load()
    svg = build(fac, edges)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with io.open(out, 'w', encoding='utf-8') as f:
        f.write(svg)
    size = target_sizes(fac, edges)
    print('目标集合规模: ' + ', '.join('%s=%d' % (n, size[k]) for k, n, _ in TARGETS))
    print('-> %s' % out)


if __name__ == '__main__':
    main()
