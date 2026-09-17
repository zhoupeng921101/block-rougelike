# -*- coding: utf-8 -*-
"""Brotato 曲线图：把波次需求与四条单自变量曲线画成两张 SVG。

产出两张图（配色跟 Balatro 的 图表/ 保持一致，自带亮/暗两套，可直接嵌进 Markdown）：

  图表/需求曲线.svg        ① 每波场上敌人总血量  ② 每波所需平均 DPS（= ①÷波次时长）
  图表/单自变量四曲线.svg  波次时长 / 材料掉落率 / 商店档位分布 / 收获复利，横轴都是 wave

数据全部实读，不写死：
  配置CSV/_波次总表.csv     每波时长
  配置CSV/_波次刷怪组.csv   每组的出现时机、重复次数/间隔/递减、难度门控
  配置CSV/_波次单位.csv     每组刷哪些敌人、数量区间、出现概率
  配置CSV/_敌人总表.csv     每个敌人的基础血量与每波斜率
  配置CSV/_难度总表.csv     危险等级的 enemy_health 加成

写死的只有三处，都是**表里查不到、挂在 main.tscn 上的东西**（见 敌人与威胁设计.md §5.2）：
  ALL_WAVE_GROUPS   全波次常驻组：树 + 宝箱怪 013
  TIERS             商店/升级卡档位参数（item_service.gd:60-66）
  DROP / HARVEST    掉落率与收获复利公式（main.gd:455-462 / main.gd:899-917）

口径与已知偏差写在 §MODEL 注释里。用法：python brotato_curve.py [输出目录]
"""
import csv
import io
import math
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):   # Windows 控制台默认 GBK
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSVD = os.path.join(ROOT, '配置', '配置CSV')

# ---------------------------------------------------------------- §MODEL 口径
# 1. 数量取 [最少, 最多] 的均值，再乘该单位的「概率」列与该组的「出现概率」列 —— 算的是期望值。
# 2. 重复触发按 wave_manager.gd:106-131 逐次模拟：首次在 spawn_timing 秒，
#    之后每次间隔 max(最小间隔, 上次间隔 - 间隔递减)，超出波次时长即停。
# 3. 敌人血量 = (生命 + 每波+生命 × (wave-1)) × (1 + enemy_health/100)。
# 4. **不含精英与兽潮**：它们按 RunData.elites_spawn 随机落在 11~18 波之间，不是每波都有。
# 5. **不含召唤链**（016 死亡分裂 3 只 017、023 孵 024、022 召唤），所以是下界。
# 6. 第 20 波危险 5 的双 Boss 各打 75 折（boss.gd:init），已计入。
ZONE = 'zone_1'
DANGERS = [(0, 0, '危险 0'), (5, 40, '危险 5')]   # (难度值, enemy_health, 标签)

# main.tscn 的 WaveManager.groups_data_in_all_waves —— 每一波都会追加，CSV 里没有
ALL_WAVE_GROUPS = [
    # (敌人编号, 数量下限, 数量上限, 单位概率, 组出现概率, 出现时机秒, 重复次数, 间隔, 递减, 最小间隔)
    ('neutral', 1, 2, 0.33, 1.0, 10, 999, 10, 0, 1),   # 树（中立，不计入敌人血量，仅供核对）
    ('013',     1, 1, 0.10, 1.0, 25,   3, 15, 0, 1),   # 宝箱怪
]
COUNT_TREES = False    # 树是中立物，不算进"要打掉的血量"

# item_service.gd:60-66 的 _tiers_data：[MIN_WAVE, BASE_CHANCE, WAVE_BONUS, MAX_CHANCE]
TIERS = [(0, 1.0, 0.0, 1.0), (0, 0.0, 0.06, 0.60),
         (2, 0.0, 0.02, 0.25), (6, 0.0, 0.0023, 0.08)]
TIER_NAMES = ['I 普通', 'II 罕见', 'III 稀有', 'IV 传奇']

NB_WAVES = 20                  # RunData.nb_of_waves
HARVEST_GROWTH = 0.05          # run_data.gd:929  harvesting_growth = 5
HARVEST_DECAY = 0.10           # run_data.gd:13   ENDLESS_HARVESTING_DECREASE = 10
BOSS_DPS_LINE = 332            # 29900 血 ÷ 90 秒，见 数值设计报告.md §2


# ---------------------------------------------------------------- 读表
def rows(name):
    with io.open(os.path.join(CSVD, name), encoding='utf-8-sig') as f:
        return list(csv.DictReader(f))


def num(s, d=0.0):
    try:
        return float(s)
    except (TypeError, ValueError):
        return d


def load():
    waves = {}
    for r in rows('_波次总表.csv'):
        if r['区域'] != ZONE or not r['波次'].isdigit():
            continue
        waves[int(r['波次'])] = num(r['时长秒'])

    enemies = {}
    for r in rows('_敌人总表.csv'):
        enemies[r['编号']] = (num(r['生命']), num(r['每波+生命']), num(r['材料价值']))

    groups, units = {}, {}
    for r in rows('_波次刷怪组.csv'):
        if r['区域'] != ZONE or not r['波次'].isdigit():
            continue
        groups.setdefault(int(r['波次']), []).append(r)
    for r in rows('_波次单位.csv'):
        if r['区域'] != ZONE or not r['波次'].isdigit():
            continue
        units.setdefault(r['组'], []).append(r)
    return waves, enemies, groups, units


def trigger_count(duration, timing, repeating, interval, reduce_, min_int):
    """按 wave_manager.gd 逐次模拟，返回这一波内该组实际触发几次。"""
    if timing > duration:
        return 0
    n, t, iv = 1, timing, interval
    if repeating <= 0:
        return n
    while n < repeating + 1:
        iv = max(min_int, iv - reduce_) if n > 1 else interval
        t += iv
        if t > duration:
            break
        n += 1
    return n


def enemy_no(scene):
    """从「场景」列里抠出敌人编号，如 res://entities/units/enemies/014/14.tscn -> 014。"""
    import re
    m = re.search(r'enemies/(\d+)/', str(scene))
    return m.group(1) if m else None


def wave_hp(w, waves, enemies, groups, units, danger, hp_bonus):
    """某一波、某个危险等级下，场上会刷出来的敌人总血量（期望）。"""
    dur = waves.get(w, 60.0)
    total, count = 0.0, 0.0

    def add(no, lo, hi, p_unit, p_group, timing, rep, iv, red, mn, boss=False):
        nonlocal total, count
        if no not in enemies:
            return
        base, slope, _ = enemies[no]
        hp = (base + slope * (w - 1)) * (1 + hp_bonus / 100.0)
        if boss and danger >= 5:
            hp *= 0.75                       # boss.gd:init 的 double_boss 折扣
        n = trigger_count(dur, timing, rep, iv, red, mn)
        nb = n * ((lo + hi) / 2.0) * p_unit * p_group
        total += nb * hp
        count += nb

    for g in groups.get(w, []):
        if int(num(g['最低难度'])) > danger:
            continue
        is_boss = g['Boss'] == 'True'
        for u in units.get(g['组'], []):
            no = enemy_no(u['场景'])
            if no is None:
                continue
            lo, hi = num(u['最少'], 1), num(u['最多'], 1)
            # 第 20 波非 double_boss 时，Boss 组的两个单位只随机保留一个
            pg = num(g['出现概率'], 1.0)
            if is_boss and w == NB_WAVES and danger < 5:
                pg *= 0.5
            add(no, lo, hi, num(u['概率'], 1.0), pg,
                num(g['出现时机秒']), int(num(g['重复次数'])), num(g['重复间隔']),
                num(g['间隔递减']), num(g['最小间隔'], 1), boss=is_boss)

    for (no, lo, hi, pu, pg, timing, rep, iv, red, mn) in ALL_WAVE_GROUPS:
        if no == 'neutral' and not COUNT_TREES:
            continue
        add(no, lo, hi, pu, pg, timing, rep, iv, red, mn)

    return total, count, dur


# ---------------------------------------------------------------- 四条曲线
def drop_chance(w):
    """材料掉落概率（main.gd:455-461，无任何玩家加成）。"""
    wf = w * (0.015 if w <= NB_WAVES else 0.025)
    return 1.0 if w < 5 else max(0.25, 1.0 - wf)


def tier_dist(w, luck=0.0):
    """get_tier_from_wave(w) 的实际档位分布（相邻档累计概率相减）。"""
    c = []
    for mn, base, bonus, mx in TIERS:
        wb = max(0.0, (w - 1 - mn)) * bonus
        c.append(min(base + wb * (1 + luck), mx))
    return [max(0.0, 1 - max(c[1], c[2], c[3])),
            max(0.0, c[1] - max(c[2], c[3])),
            max(0.0, c[2] - c[3]), c[3]]


def harvest_mult(w):
    """收获属性相对第 1 波的倍数：前 20 波每波 ×1.05，之后每波 ×0.9。"""
    if w <= NB_WAVES:
        return (1 + HARVEST_GROWTH) ** (w - 1)
    return (1 + HARVEST_GROWTH) ** (NB_WAVES - 1) * (1 - HARVEST_DECAY) ** (w - NB_WAVES)


# ---------------------------------------------------------------- SVG 公共件
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


def head(w, h):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" font-family="%s">'
            % (w, h, w, h, FONT)) + STYLE + ('<rect class="bg" x="0" y="0" width="%d" height="%d"/>' % (w, h))


def path(pts):
    return 'M ' + ' L '.join('%.1f %.1f' % p for p in pts)


def fmt(v):
    if v >= 1e6:
        return '%.2fM' % (v / 1e6)
    return '%.0fk' % (v / 1e3) if v >= 1e3 else '%.0f' % v


# ---------------------------------------------------------------- 图 1：需求曲线
W1, H1 = 960, 700
M1 = dict(l=86, r=136, t=96, b=44)
PW1 = W1 - M1['l'] - M1['r']
P1A_T, P1A_H = 118, 236
P1B_T, P1B_H = 430, 190


def svg_demand(ws, series):
    def xs(w):
        return M1['l'] + (w - 1) / (len(ws) - 1) * PW1

    def mky(top, h, lo, hi):
        l0, l1 = math.log10(lo), math.log10(hi)
        return lambda v: top + h - (math.log10(max(v, lo)) - l0) / (l1 - l0) * h

    ya = mky(P1A_T, P1A_H, 10, 1e6)
    yb = mky(P1B_T, P1B_H, 1, 3000)

    o = [head(W1, H1)]
    A = o.append
    A('<text class="ttl" x="%d" y="38">每波要打掉多少血，以及那意味着多少 DPS</text>' % M1['l'])
    A('<text class="sub" x="%d" y="60">Brotato 0.8.0.3 · zone_1 · 数量取区间均值×出现概率的期望 · 不含精英/兽潮/召唤链（故为下界）· 纵轴对数</text>' % M1['l'])
    A('<text class="sub" x="%d" y="78">第 20 波的跳变来自双 Boss（各 29900 血）；危险 5 时两只都上但各打 75 折，合计 1.5 倍而不是 2 倍</text>' % M1['l'])

    # ① 总血量
    A('<text class="lbl" x="%d" y="%d" fill="var(--ink)">① 一波之内刷出来的敌人总血量</text>' % (M1['l'], P1A_T - 16))
    for gv in (1e2, 1e3, 1e4, 1e5, 1e6):
        yy = ya(gv)
        A('<line class="gl" x1="%d" y1="%.1f" x2="%d" y2="%.1f"/>' % (M1['l'], yy, M1['l'] + PW1, yy))
        A('<text class="axm" x="%d" y="%.1f" text-anchor="end">%s</text>' % (M1['l'] - 10, yy + 4, fmt(gv)))
    for si, (lab, hp, dps) in enumerate(series):
        pts = [(xs(w), ya(hp[i])) for i, w in enumerate(ws)]
        A('<path class="ln" d="%s" stroke="var(--s%d)"/>' % (path(pts), si + 1))
        for px, py in pts:
            A('<circle class="mk" cx="%.1f" cy="%.1f" r="3.4" fill="var(--s%d)"/>' % (px, py, si + 1))
        ly = P1A_T + 6 + si * 34                      # 图例固定在右边距，不跟线尾走
        A('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="var(--s%d)" stroke-width="2.4"/>'
          % (M1['l'] + PW1 + 10, ly - 4, M1['l'] + PW1 + 28, ly - 4, si + 1))
        A('<text class="lbl" x="%d" y="%.1f" fill="var(--s%d)">%s</text>' % (M1['l'] + PW1 + 34, ly, si + 1, lab))
        A('<text class="axm" x="%d" y="%.1f">第 20 波 %s</text>' % (M1['l'] + PW1 + 10, ly + 15, fmt(hp[-1])))
    for w in ws:
        if w % 2 == 1 or w == 20:
            A('<text class="ax" x="%.1f" y="%d" text-anchor="middle">%d</text>' % (xs(w), P1A_T + P1A_H + 20, w))
    A('<text class="axm" x="%d" y="%d" text-anchor="middle">波次</text>' % (M1['l'] + PW1 / 2, P1A_T + P1A_H + 38))

    # ② 所需 DPS
    A('<text class="lbl" x="%d" y="%d" fill="var(--ink)">② 打光它需要的平均 DPS（总血量 ÷ 波次时长）</text>' % (M1['l'], P1B_T - 16))
    for gv in (1, 10, 100, 1000, 3000):
        yy = yb(gv)
        A('<line class="gl" x1="%d" y1="%.1f" x2="%d" y2="%.1f"/>' % (M1['l'], yy, M1['l'] + PW1, yy))
        A('<text class="axm" x="%d" y="%.1f" text-anchor="end">%s</text>' % (M1['l'] - 10, yy + 4, fmt(gv)))
    yr = yb(BOSS_DPS_LINE)
    A('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="var(--crit)" stroke-width="1.6" stroke-dasharray="6 4"/>'
      % (M1['l'], yr, M1['l'] + PW1, yr))
    A('<text class="axm halo" x="%.1f" y="%.1f" fill="var(--crit)">Boss 检定线 %d DPS（29900 血 ÷ 90 秒）</text>'
      % (M1['l'] + 8, yr - 8, BOSS_DPS_LINE))
    y108 = yb(108)
    A('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="var(--rule)" stroke-width="1.4" stroke-dasharray="3 4"/>'
      % (M1['l'], y108, M1['l'] + PW1, y108))
    A('<text class="axm halo" x="%.1f" y="%.1f" fill="var(--bandtxt)">T4 武器裸 DPS 上限 108</text>' % (M1['l'] + 8, y108 - 7))
    for si, (lab, hp, dps) in enumerate(series):
        pts = [(xs(w), yb(dps[i])) for i, w in enumerate(ws)]
        A('<path class="ln" d="%s" stroke="var(--s%d)"/>' % (path(pts), si + 1))
        for px, py in pts:
            A('<circle class="mk" cx="%.1f" cy="%.1f" r="3.0" fill="var(--s%d)"/>' % (px, py, si + 1))
        ly = P1B_T + 6 + si * 34
        A('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="var(--s%d)" stroke-width="2.4"/>'
          % (M1['l'] + PW1 + 10, ly - 4, M1['l'] + PW1 + 28, ly - 4, si + 1))
        A('<text class="lbl" x="%d" y="%.1f" fill="var(--s%d)">%s</text>' % (M1['l'] + PW1 + 34, ly, si + 1, lab))
        A('<text class="axm" x="%d" y="%.1f">峰值 %.0f</text>' % (M1['l'] + PW1 + 10, ly + 15, max(dps)))
    # 标出 DPS 需求的峰值波（多半不是第 20 波）
    lab0, _, dps0 = series[0]
    pk = max(range(len(ws)), key=lambda i: dps0[i])
    A('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="var(--rule)" stroke-width="1"/>'
      % (xs(ws[pk]), yb(dps0[pk]) - 6, xs(ws[pk]), yb(dps0[pk]) - 20))
    A('<text class="axm halo" x="%.1f" y="%.1f" text-anchor="middle" fill="var(--bandtxt)">峰值在第 %d 波，不是第 20 波</text>'
      % (xs(ws[pk]), yb(dps0[pk]) - 25, ws[pk]))
    for w in ws:
        if w % 2 == 1 or w == 20:
            A('<text class="ax" x="%.1f" y="%d" text-anchor="middle">%d</text>' % (xs(w), P1B_T + P1B_H + 20, w))
    A('<text class="axm" x="%d" y="%d" text-anchor="middle">波次</text>' % (M1['l'] + PW1 / 2, P1B_T + P1B_H + 38))

    A('<text class="note" x="%d" y="%d">⚠ ② 是「把这一波刷出来的怪全部打光」所需的 DPS，杂兵波并不要求做到（可以靠走位躲到时间结束）；只有第 20 波的 Boss 是必须打死的硬检定。</text>' % (M1['l'], H1 - 46))
    A('<text class="note" x="%d" y="%d">口径 — 数量按「最少/最多」均值 × 单位概率 × 组出现概率；重复次数按 wave_manager.gd 逐次模拟（间隔每次减「间隔递减」，下限「最小间隔」）。</text>' % (M1['l'], H1 - 30))
    A('<text class="note" x="%d" y="%d">血量 =（生命 + 每波+生命 ×(波次-1)）×(1 + enemy_health/100)。危险 5 的 enemy_health = +40。不含精英、兽潮与死亡召唤，真实值高于此线。</text>' % (M1['l'], H1 - 14))
    A('</svg>')
    return '\n'.join(o)


# ---------------------------------------------------------------- 图 2：四曲线
W2, H2 = 960, 720
M2 = dict(l=70, r=54)
PW2 = W2 - M2['l'] - M2['r']
PANEL_H, PANEL_GAP, PANEL_T0 = 118, 154, 112


def svg_four(ws):
    def xs(w):
        return M2['l'] + (w - 1) / (len(ws) - 1) * PW2

    o = [head(W2, H2)]
    A = o.append
    A('<text class="ttl" x="%d" y="38">一个自变量（wave）驱动的四条曲线</text>' % M2['l'])
    A('<text class="sub" x="%d" y="60">Brotato 0.8.0.3 · 玩家侧的幸运 / 收获 / 物价只改斜率，不改形状 · 竖线为第 20 波（无尽分界）</text>' % M2['l'])
    A('<text class="sub" x="%d" y="78">四条曲线的拐点全部对齐在「前 10 波成长 / 10-20 波兑现 / 20+ 波清算」这三段上</text>' % M2['l'])

    panels = [
        ('① 波次时长（秒）', lambda w: WAVE_DUR.get(w, 60.0), 0, 95, 's1', lambda v: '%.0f' % v,
         '20 起步、每波 +5、第 9 波封顶 60，第 20 波破例给 90'),
        ('② 材料掉落概率', drop_chance, 0, 1.05, 's2', lambda v: '%.0f%%' % (v * 100),
         '前 4 波 100%，第 5 波起 −1.5%/波，无尽期斜率翻成 −2.5%/波、第 30 波触 25% 地板'),
        ('③ 商店 / 升级卡的档位分布（堆叠）', None, 0, 1.0, None, None,
         '罕见在第 11 波封顶 60%，稀有在 15.5 波封顶 25%，此后普通永久锁死 40%'),
        ('④ 收获属性相对第 1 波的倍数', harvest_mult, 0, 2.8, 's4', lambda v: '%.2f×' % v,
         '前 20 波每波 ×1.05（累计 ×2.53），一进无尽立刻翻成每波 ×0.9'),
    ]
    for pi, (title, fn, lo, hi, slot, tick, note) in enumerate(panels):
        top = PANEL_T0 + pi * PANEL_GAP
        A('<text class="lbl" x="%d" y="%d" fill="var(--ink)">%s</text>' % (M2['l'], top - 14, title))
        A('<text class="note" x="%d" y="%d">%s</text>' % (M2['l'], top + PANEL_H + 30, note))

        def y(v):
            return top + PANEL_H - (v - lo) / (hi - lo) * PANEL_H

        for f in (0.0, 0.5, 1.0):
            yy = top + PANEL_H - f * PANEL_H
            A('<line class="gl" x1="%d" y1="%.1f" x2="%d" y2="%.1f"/>' % (M2['l'], yy, M2['l'] + PW2, yy))
            if tick:
                A('<text class="axm" x="%d" y="%.1f" text-anchor="end">%s</text>'
                  % (M2['l'] - 8, yy + 4, tick(lo + f * (hi - lo))))
        xv = xs(NB_WAVES)
        A('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="var(--crit)" stroke-width="1.2" stroke-dasharray="4 4"/>'
          % (xv, top, xv, top + PANEL_H))

        if pi == 2:      # 堆叠面积
            acc = [0.0] * len(ws)
            for ti in range(4):
                nxt = [acc[i] + tier_dist(w)[ti] for i, w in enumerate(ws)]
                up = [(xs(w), y(nxt[i])) for i, w in enumerate(ws)]
                dn = [(xs(w), y(acc[i])) for i, w in enumerate(ws)][::-1]
                A('<path d="%s L %s Z" fill="var(--s%d)" opacity="%.2f"/>'
                  % (path(up), path(dn)[2:], ti + 1, 0.85 - ti * 0.06))
                mid = (acc[-1] + nxt[-1]) / 2
                A('<text class="axm halo" x="%.1f" y="%.1f" fill="var(--ink2)">%s %.0f%%</text>'
                  % (M2['l'] + PW2 + 6, y(mid) + 4, TIER_NAMES[ti].split()[0], tier_dist(ws[-1])[ti] * 100))
                acc = nxt
        else:
            pts = [(xs(w), y(min(hi, fn(w)))) for w in ws]
            A('<path class="ln" d="%s" stroke="var(--%s)"/>' % (path(pts), slot))
            for w in ws:
                if w % 5 == 0 or w == 1:
                    A('<circle class="mk" cx="%.1f" cy="%.1f" r="3.4" fill="var(--%s)"/>' % (xs(w), y(min(hi, fn(w))), slot))
            ex, ey = pts[-1]
            A('<text class="axm halo" x="%.1f" y="%.1f" fill="var(--%s)">%s</text>' % (ex + 6, ey + 4, slot, tick(fn(ws[-1]))))

        for w in ws:
            if w % 5 == 0 or w == 1:
                A('<text class="ax" x="%.1f" y="%d" text-anchor="middle">%d</text>' % (xs(w), top + PANEL_H + 16, w))
    A('</svg>')
    return '\n'.join(o)


WAVE_DUR = {}


# ---------------------------------------------------------------- main
def main():
    outdir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '图表')
    waves, enemies, groups, units = load()
    WAVE_DUR.update(waves)
    ws = list(range(1, NB_WAVES + 1))

    series = []
    for danger, hpb, label in DANGERS:
        hp, dps = [], []
        for w in ws:
            t, c, dur = wave_hp(w, waves, enemies, groups, units, danger, hpb)
            hp.append(t)
            dps.append(t / dur if dur else 0)
        series.append((label, hp, dps))

    print('%4s %6s | %s' % ('波次', '时长', ' | '.join('%-22s' % s[0] for s in series)))
    for i, w in enumerate(ws):
        cells = ['%10s 血  %5.0f DPS' % ('{:,.0f}'.format(s[1][i]), s[2][i]) for s in series]
        print('%4d %5.0fs | %s' % (w, waves.get(w, 60), ' | '.join(cells)))
    print()
    print('四条曲线抽样：')
    print('%5s %8s %10s %10s %10s' % ('波次', '时长', '掉落率', '传奇档', '收获倍数'))
    for w in (1, 5, 10, 11, 15, 16, 20, 25, 30):
        print('%5d %7.0fs %9.1f%% %9.2f%% %9.2f×'
              % (w, waves.get(w, 60), drop_chance(w) * 100, tier_dist(w)[3] * 100, harvest_mult(w)))

    os.makedirs(outdir, exist_ok=True)
    for name, body in (('需求曲线.svg', svg_demand(ws, series)),
                       ('单自变量四曲线.svg', svg_four(list(range(1, 31))))):
        p = os.path.join(outdir, name)
        with io.open(p, 'w', encoding='utf-8') as f:
            f.write(body)
        print('-> %s' % p)


if __name__ == '__main__':
    main()
