# -*- coding: utf-8 -*-
"""Balatro 成长曲线对照图:把盲注需求曲线和四种构筑原型的得分能力画在一张图上。

需求曲线来自 misc_functions.lua 的 get_blind_amount() 写死的前 8 个 Ante(三档 scaling),
乘 P_BLINDS 里普通 Boss 的 mult=2。牌型数值从 配置/配置CSV/HANDS.csv 实读,不写死。

四种构筑原型是**建模**不是拆包事实,口径全部集中在 BUILDS 里,改参数只动那一段:
  A 裸奔基线       无小丑、无星球
  B 纯加法流       每 Ante +1 张普通加法小丑,满 5 槽封顶,牌型不升级
  C 二次流(星球)   主力牌型每 Ante 升 2 级 + 3 张加法小丑
  D 指数流(X倍率)  牌型每 Ante 升 1 级 + 2 张加法小丑 + X2/X3/X3 于 Ante 4/6/7 到位

产出:
  图表/成长曲线对照.svg   自带亮/暗两套配色(prefers-color-scheme),可直接嵌进 Markdown

用法: python balatro_curve.py [输出SVG路径]
"""
import csv
import io
import math
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):   # Windows 控制台默认 GBK
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------- 输入数据
# get_blind_amount() 写死的前 8 个 Ante,按 G.GAME.modifiers.scaling 分三档
BASE = {1: [300, 300, 300],       2: [800, 900, 1000],
        3: [2000, 2600, 3200],    4: [5000, 8000, 9000],
        5: [11000, 20000, 25000], 6: [20000, 36000, 60000],
        7: [35000, 60000, 110000], 8: [50000, 100000, 200000]}
BOSS_MULT = 2.0    # P_BLINDS 普通 Boss 的 mult
HANDS = 4          # 初始出牌次数 get_starting_params
CARD_CHIPS = 40    # 5 张计分牌的面值筹码(均值约 8/张)
MAIN_HAND = 'Full House'   # 建模用的主力牌型


def load_hand(path):
    """从 HANDS.csv 读主力牌型的 1 级值与每级增量。"""
    with io.open(path, encoding='utf-8-sig') as f:
        for r in csv.DictReader(f):
            if r['key'] == MAIN_HAND:
                return (float(r['chips']), float(r['mult']),
                        float(r['l_chips']), float(r['l_mult']))
    raise SystemExit('HANDS.csv 里找不到 ' + MAIN_HAND)


# ---------------------------------------------------------------- 构筑原型
# (名称, 牌型每 Ante 升几级, 加法小丑上限, 每张加法小丑的 +筹码/+倍率, X倍率到位表)
BUILDS = [
    ('A 裸奔基线',      0, 0, (0,  0), {}),
    ('B 纯加法流',      0, 5, (40, 5), {}),
    ('C 二次流 · 星球', 2, 3, (40, 5), {}),
    ('D 指数流 · X倍率', 1, 2, (40, 5), {4: 2.0, 6: 3.0, 7: 3.0}),
]
SLOT = ['s1', 's2', 's3', 's4']          # 对应 CSS 变量里的分类色槽


def capability(build, ante, hand):
    """某构筑在某 Ante 的每场得分能力(4 次出牌满打)。"""
    _, lv_per_ante, jmax, (jc, jm), xtab = build
    h_chips, h_mult, l_chips, l_mult = hand
    lv = 1 + lv_per_ante * (ante - 1)
    n = min(ante, jmax)
    chips = h_chips + l_chips * (lv - 1) + CARD_CHIPS + jc * n
    mult = h_mult + l_mult * (lv - 1) + jm * n
    x = 1.0
    for at, v in xtab.items():
        if ante >= at:
            x *= v
    return chips * mult * x * HANDS


# ---------------------------------------------------------------- 画布布局
W, H = 960, 824
M = dict(l=78, r=150, t=96, b=44)
P1_T, P1_H = 118, 372          # 面板① 顶/高
P2_T, P2_H = 566, 158          # 面板② 顶/高
PW = W - M['l'] - M['r']

STYLE = """<style>
svg{--surface:#fcfcfb;--ink:#0b0b0b;--ink2:#52514e;--ink3:#8a8984;--grid:#e8e7e3;--band:#dedcd6;--bandtxt:#6b6a65;
--s1:#2a78d6;--s2:#eb6834;--s3:#1baf7a;--s4:#eda100;--crit:#c02d2d;--rule:#9a9994;}
@media (prefers-color-scheme:dark){svg{--surface:#1a1a19;--ink:#fff;--ink2:#c3c2b7;--ink3:#8f8e86;--grid:#2e2e2c;--band:#333330;--bandtxt:#a5a49b;
--s1:#3987e5;--s2:#d95926;--s3:#199e70;--s4:#c98500;--crit:#e66767;--rule:#6d6c66;}}
.bg{fill:var(--surface)} .ttl{fill:var(--ink);font-size:19px;font-weight:650}
.sub{fill:var(--ink2);font-size:12.5px} .ax{fill:var(--ink2);font-size:11.5px}
.axm{fill:var(--ink3);font-size:11px} .lbl{font-size:12.5px;font-weight:600}
.note{fill:var(--ink3);font-size:11px}
.halo{paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round}
.gl{stroke:var(--grid);stroke-width:1} .ln{fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
.mk{stroke:var(--surface);stroke-width:2}
</style>"""
FONT = ('-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Microsoft YaHei&quot;,'
        '&quot;PingFang SC&quot;,&quot;Noto Sans CJK SC&quot;,sans-serif')


def build_svg(antes, demand, caps, names):
    def xs(a):
        return M['l'] + (a - 1) / (len(antes) - 1) * PW

    def mk_y(top, h, lo, hi):
        l0, l1 = math.log10(lo), math.log10(hi)
        return lambda v: top + h - (math.log10(max(v, lo)) - l0) / (l1 - l0) * h

    y1 = mk_y(P1_T, P1_H, 300, 1e6)
    y2 = mk_y(P2_T, P2_H, 0.01, 10)

    def path(pts):
        return 'M ' + ' L '.join('%.1f %.1f' % p for p in pts)

    def fmt(v):
        if v >= 1e6:
            return ('%.1fM' % (v / 1e6)).replace('.0M', 'M')
        return '%.0fk' % (v / 1e3) if v >= 1e3 else '%.0f' % v

    o = []
    A = o.append
    A('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" font-family="%s">'
      % (W, H, W, H, FONT))
    A(STYLE)
    A('<rect class="bg" x="0" y="0" width="%d" height="%d"/>' % (W, H))

    A('<text class="ttl" x="%d" y="38">盲注需求曲线 vs 四种构筑的成长曲线</text>' % M['l'])
    A('<text class="sub" x="%d" y="60">Balatro 1.0.1o · 以 Boss 盲注(×2)为准 · 每 Ante 按 4 次出牌满打建模 · 纵轴为对数刻度</text>' % M['l'])
    A('<text class="sub" x="%d" y="78">灰带 = 白注到金注的需求区间；线跌入灰带即该注码下打不过去</text>' % M['l'])

    # ---------------- 面板①：绝对值 ----------------
    A('<text class="lbl" x="%d" y="%d" fill="var(--ink)">① 每场 Boss 盲注的得分能力（绝对值）</text>' % (M['l'], P1_T - 16))
    for gv in (1e3, 1e4, 1e5, 1e6):
        yy = y1(gv)
        A('<line class="gl" x1="%d" y1="%.1f" x2="%d" y2="%.1f"/>' % (M['l'], yy, M['l'] + PW, yy))
        A('<text class="axm" x="%d" y="%.1f" text-anchor="end">%s</text>' % (M['l'] - 10, yy + 4, fmt(gv)))

    top = [(xs(a), y1(demand[i][2])) for i, a in enumerate(antes)]
    bot = [(xs(a), y1(demand[i][0])) for i, a in enumerate(antes)]
    A('<path d="%s L %s Z" fill="var(--band)" opacity="0.72"/>' % (path(top), path(list(reversed(bot)))[2:]))
    for edge in (bot, top):
        A('<path class="ln" d="%s" stroke="var(--rule)" stroke-dasharray="5 4" stroke-width="1.6"/>' % path(edge))
    # 两条边界各自引线标注,避开数据线
    uy, ly = y1(demand[1][2]), y1(demand[2][0] + (demand[3][0] - demand[2][0]) * 0.2)
    A('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="var(--rule)" stroke-width="1"/>' % (xs(2.0), uy - 6, xs(2.0), uy - 19))
    A('<text class="axm halo" x="%.1f" y="%.1f" text-anchor="middle" fill="var(--bandtxt)">紫/金注需求(上沿)</text>' % (xs(2.0), uy - 24))
    A('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="var(--rule)" stroke-width="1"/>' % (xs(3.2), ly + 6, xs(3.2), ly + 20))
    A('<text class="axm halo" x="%.1f" y="%.1f" text-anchor="middle" fill="var(--bandtxt)">白/红注需求(下沿)</text>' % (xs(3.2), ly + 32))

    lbl_dy = [0, 0, -4, 4]
    for bi in range(len(names)):
        pts = [(xs(a), y1(caps[i][bi])) for i, a in enumerate(antes)]
        A('<path class="ln" d="%s" stroke="var(--%s)"/>' % (path(pts), SLOT[bi]))
        for px, py in pts:
            A('<circle class="mk" cx="%.1f" cy="%.1f" r="4.2" fill="var(--%s)"/>' % (px, py, SLOT[bi]))
        lx, ly2 = pts[-1]
        A('<text class="lbl" x="%.1f" y="%.1f" fill="var(--%s)">%s</text>' % (lx + 13, ly2 + 4 + lbl_dy[bi], SLOT[bi], names[bi]))
        A('<text class="axm" x="%.1f" y="%.1f">%s</text>' % (lx + 13, ly2 + 19 + lbl_dy[bi], fmt(caps[-1][bi])))
    # 白注下第一次被需求追上的点
    for bi in range(len(names)):
        for i, a in enumerate(antes):
            if caps[i][bi] < demand[i][0]:
                px, py = xs(a), y1(caps[i][bi])
                A('<g stroke="var(--crit)" stroke-width="2.4" stroke-linecap="round">'
                  '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/><line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/></g>'
                  % (px - 6, py - 6, px + 6, py + 6, px + 6, py - 6, px - 6, py + 6))
                A('<text class="axm halo" x="%.1f" y="%.1f" text-anchor="middle" fill="var(--crit)">白注挂</text>' % (px, py + 25))
                break
    for a in antes:
        A('<text class="ax" x="%.1f" y="%d" text-anchor="middle">Ante %d</text>' % (xs(a), P1_T + P1_H + 22, a))

    # ---------------- 面板②：相对余量 ----------------
    A('<text class="lbl" x="%d" y="%d" fill="var(--ink)">② 相对白注需求的余量（能力 ÷ 白注 Boss 目标，1.0 = 刚好打过）</text>' % (M['l'], P2_T - 16))
    for gv, gt in ((10, '10×'), (1, '1.0×'), (0.1, '0.1×'), (0.01, '0.01×')):
        yy = y2(gv)
        A('<line class="gl" x1="%d" y1="%.1f" x2="%d" y2="%.1f"/>' % (M['l'], yy, M['l'] + PW, yy))
        A('<text class="axm" x="%d" y="%.1f" text-anchor="end">%s</text>' % (M['l'] - 10, yy + 4, gt))
    yr = y2(1.0)
    A('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="var(--crit)" stroke-width="1.6" stroke-dasharray="6 4"/>' % (M['l'], yr, M['l'] + PW, yr))
    A('<text class="axm halo" x="%.1f" y="%.1f" text-anchor="middle" fill="var(--crit)">生死线 1.0×</text>' % (xs(4), yr - 8))
    for bi in range(len(names)):
        pts = [(xs(a), y2(caps[i][bi] / demand[i][0])) for i, a in enumerate(antes)]
        A('<path class="ln" d="%s" stroke="var(--%s)"/>' % (path(pts), SLOT[bi]))
        for px, py in pts:
            A('<circle class="mk" cx="%.1f" cy="%.1f" r="3.6" fill="var(--%s)"/>' % (px, py, SLOT[bi]))
        ex, ey = pts[-1]
        A('<text class="lbl" x="%.1f" y="%.1f" fill="var(--%s)">%s</text>' % (ex + 12, ey + 4, SLOT[bi], names[bi][0]))
        A('<text class="axm" x="%.1f" y="%.1f">%.2f×</text>' % (ex + 24, ey + 4, caps[-1][bi] / demand[-1][0]))
    for a in antes:
        A('<text class="ax" x="%.1f" y="%d" text-anchor="middle">Ante %d</text>' % (xs(a), P2_T + P2_H + 22, a))
    dv = min(range(len(antes)), key=lambda i: caps[i][3] / demand[i][0])
    A('<text class="axm halo" x="%.1f" y="%.1f" text-anchor="middle" fill="var(--s4)">D 的中期低谷</text>'
      % (xs(antes[dv]), y2(caps[dv][3] / demand[dv][0]) - 13))

    A('<text class="note" x="%d" y="%d">构筑口径 — A：无小丑无星球。B：每 Ante +1 张普通加法小丑(+40 筹码/+5 倍率)，满 5 槽封顶，牌型不升级。C：主力牌型每 Ante 升 2 级 + 3 张加法小丑。</text>' % (M['l'], H - 30))
    A('<text class="note" x="%d" y="%d">D：牌型每 Ante 升 1 级 + 2 张加法小丑 + X2/X3/X3 分别于 Ante 4/6/7 到位。三者同取葫芦，5 张计分牌面值按 40 筹码计。需求出自 get_blind_amount 写死的前 8 个 Ante。</text>' % (M['l'], H - 14))
    A('</svg>')
    return '\n'.join(o)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '图表', '成长曲线对照.svg')
    hand = load_hand(os.path.join(ROOT, '配置', '配置CSV', 'HANDS.csv'))

    antes = sorted(BASE)
    demand = [[BASE[a][i] * BOSS_MULT for i in range(3)] for a in antes]
    caps = [[capability(b, a, hand) for b in BUILDS] for a in antes]
    names = [b[0] for b in BUILDS]

    # 控制台也打一份,方便核对
    print('%4s | %9s %9s %9s | %s' % ('Ante', '需求s1', 's2', 's3',
                                      ' '.join('%14s' % n for n in names)))
    for i, a in enumerate(antes):
        print('%4d | %9s %9s %9s | %s'
              % (a, '{:,.0f}'.format(demand[i][0]), '{:,.0f}'.format(demand[i][1]),
                 '{:,.0f}'.format(demand[i][2]),
                 ' '.join('{:>14,.0f}'.format(c) for c in caps[i])))
    print()
    for bi, n in enumerate(names):
        line = []
        for si, sn in enumerate(('白/红', '绿~蓝', '紫/金')):
            died = next((a for i, a in enumerate(antes) if caps[i][bi] < demand[i][si]), None)
            line.append('%s:%s' % (sn, ('Ante %d 挂' % died) if died else '通关'))
        print('  %-16s %s' % (n, '  '.join(line)))

    os.makedirs(os.path.dirname(out), exist_ok=True)
    with io.open(out, 'w', encoding='utf-8') as f:
        f.write(build_svg(antes, demand, caps, names))
    print('\n-> %s' % out)


if __name__ == '__main__':
    main()
