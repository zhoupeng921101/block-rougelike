# -*- coding: utf-8 -*-
"""武器搭配与套装组合分析：6 个武器格到底该怎么填。

三条机制决定了答案（全部出自 `源码/`）：

1. **套装按"持有的武器件数"计数，不是按武器族**
   （`源码/singletons/run_data.gd:401-423`：`for weapon in weapons: for set in weapon.sets: active_sets[id] += 1`）。
   所以 6 把同款也能把套装堆满，而且**一把武器最多属于 2 个套装**——
   6 把双套装武器 = 两套同时 6 件，这是套装收益的唯一上限走法。
2. **套装奖励是"当前件数那一档的绝对值"，不累加**
   （同上 419 行：`set_bonuses[min(count-2, size-1)]`，只取一档）。
   件数 >6 也只按 6 件算，所以第 7 把往后对套装零收益。
3. **合成会吃掉件数**（`run_data.gd:549-556`：2 把同 `my_id` 合成 1 把高一级）。
   要套装就别合，要 tier 就得拆套装——这是 6 个格子上唯一的真取舍。

产出：
    配置CSV/_套装交集表.csv    22 对有交集的套装 + 哪几族武器同时属于两套
    配置CSV/_武器协同表.csv    49 族武器的套装/加成属性/特殊效果/协同对象
    配置CSV/_最优套装组合.csv  按目标属性穷举出来的最优 6 格选法（两种口径）

用法:
    python brotato_loadouts.py [资源目录] [文本目录] [配置目录]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import collections
import itertools

from brotato_common import ROOT, ensure, setup_stdout, write_dict_csv, write_json
from brotato_config import SC_SET, SC_WEAPON, Loc, TIER, WTYPE, short
from brotato_tres import Project

SLOTS = 6            # 默认武器栏（run_data.gd:927 的 weapon_slot = 6）

SET_CN = {'set_blade': '利器', 'set_blunt': '钝器', 'set_elemental': '元素',
          'set_ethereal': '虚灵', 'set_explosive': '爆炸', 'set_gun': '枪械',
          'set_heavy': '重型', 'set_medical': '医疗', 'set_medieval': '中世纪',
          'set_precise': '精准', 'set_primitive': '原始', 'set_support': '辅助',
          'set_tool': '工具', 'set_unarmed': '徒手'}

# 特殊效果类 -> 它靠哪条属性放大、和什么东西协同
EFFECT_NOTE = {
    'burning_effect': ('stat_elemental_damage',
                       '燃烧伤害 = 武器值 + 全局 burn_chance 值 + 元素伤害，再乘 (1+%伤害/100)'
                       '（weapon_service.gd:148-167）'),
    'exploding_effect': ('explosion_damage',
                         '爆炸武器的伤害乘区变成 (1+%伤害/100 + 爆炸伤害/100)，'
                         '是 %伤害归零角色唯一还能出伤害的武器（weapon_service.gd:112-121）'),
    'projectiles_on_hit_effect': ('副弹自己的 scaling',
                                  '副投射物有独立的 scaling_stats —— 近战武器吃远程/元素属性的后门'),
    'gain_stat_every_killed_enemies_effect': ('击杀数', '每杀 N 只永久+某属性，波内叠加，越久越强'),
    'weapon_stack_effect': ('同款持有数', '每多一把同款同族武器加一次，和套装堆同款完全同向'),
    'turret_effect': ('stat_engineering',
                      '炮台不吃 %伤害乘区也不吃暴击（weapon_service.gd:115,125），'
                      '只吃工程学'),
    'structure_effect': ('stat_engineering', '同上，构筑物走工程学'),
    'slow_in_zone_effect': ('—', '减速场，和高频攻击/近战贴脸配'),
    'null_effect': ('—', '挂在武器上的条件效果（暴击穿透/暴击弹跳/暴击掉金）'),
    'effect': ('—', '直接给玩家属性的白板效果'),
}


def _bn(s):
    return os.path.basename(s or '')[:-3]


def load(res_dir, text_dir):
    proj = Project(res_dir)
    loc = Loc(text_dir, os.path.join(os.path.dirname(res_dir), '源码',
                                     'singletons', 'text.gd'))
    loc.load_sets(proj)

    # 套装分档奖励：set_id -> {件数: {stat: value}}
    bonus = collections.defaultdict(dict)
    for p in proj.by_script(SC_SET):
        d = proj.flat(p, depth=2)
        for i, tier in enumerate(d.get('set_bonuses') or []):
            if not tier:
                continue
            agg = collections.Counter()
            for e in tier:
                if isinstance(e, dict):
                    agg[e.get('key', '')] += e.get('value', 0)
            bonus[d.get('my_id', '')][i + 2] = dict(agg)

    # 武器族 -> 各 tier
    fams = collections.defaultdict(dict)
    for p in proj.by_script(SC_WEAPON):
        d = proj.flat(p, depth=3)
        fid = d.get('weapon_id') or d.get('my_id')
        fams[fid][d.get('tier', 0)] = d
    return proj, loc, bonus, fams


def weapon_rows(loc, fams):
    """一族一行：套装、加成属性、特殊效果、协同对象。"""
    rows = []
    by_scaling = collections.defaultdict(list)
    by_effect = collections.defaultdict(list)
    info = {}
    for fid, tiers in fams.items():
        top = tiers[max(tiers)]
        st = top.get('stats') or {}
        if not isinstance(st, dict):
            st = {}
        scaling = [(s[0], s[1]) for s in (st.get('scaling_stats') or [])
                   if isinstance(s, list) and len(s) >= 2]
        sets = [s.get('my_id', '') for s in (top.get('sets') or []) if isinstance(s, dict)]
        effs = []
        for e in top.get('effects') or []:
            if isinstance(e, dict):
                effs.append(_bn(e.get('@脚本')))
        info[fid] = (loc.name(top.get('name', '')), sets, scaling, effs, top, st, tiers)
        for s, _c in scaling:
            by_scaling[s].append(loc.name(top.get('name', '')))
        for e in effs:
            if e not in ('effect', 'null_effect'):
                by_effect[e].append(loc.name(top.get('name', '')))

    for fid, (cn, sets, scaling, effs, top, st, tiers) in sorted(info.items()):
        partners = set()
        for s, _c in scaling:
            partners.update(by_scaling.get(s, ()))
        for e in effs:
            partners.update(by_effect.get(e, ()))
        partners.discard(cn)
        main_eff = [e for e in effs if e not in ('effect', 'null_effect')]
        note = EFFECT_NOTE.get(main_eff[0], ('', ''))[1] if main_eff else ''
        feeds = EFFECT_NOTE.get(main_eff[0], ('', ''))[0] if main_eff else ''
        cd = st.get('cooldown')
        rows.append({
            '武器族': fid, '中文名': cn, '类型': WTYPE.get(top.get('type', 0), ''),
            '最高档': TIER.get(top.get('tier', 0), ''), '有几档': len(tiers),
            '套装': ' + '.join(SET_CN.get(s, s) for s in sets) or '（无套装）',
            '套装数': len(sets),
            '加成属性': ' / '.join('%s×%s' % (s, c) for s, c in scaling),
            '最高档伤害': st.get('damage', ''), '冷却帧': cd,
            '射程': st.get('max_range', ''),
            '特殊效果': ' / '.join(main_eff) or '',
            '效果吃哪条属性': feeds,
            '效果要点': note,
            '同类协同(共享属性或效果)': '、'.join(sorted(partners)[:12]),
            '出处': short(top.get('@路径', '')),
        })
    return rows


def set_pairs(fams, bonus, loc):
    """两两套装的交集：交集非空 = 6 把同款就能把两套都堆到 6 件。"""
    mem = collections.defaultdict(set)
    name = {}
    for fid, tiers in fams.items():
        top = tiers[max(tiers)]
        cn = loc.name(top.get('name', ''))
        name[fid] = cn
        for s in (top.get('sets') or []):
            if isinstance(s, dict):
                mem[s.get('my_id', '')].add(cn)

    def bonus_txt(sid, n):
        return ' / '.join('%s%+d' % (k, v) for k, v in sorted(bonus[sid].get(n, {}).items()))

    rows = []
    for a, b in itertools.combinations(sorted(mem), 2):
        inter = mem[a] & mem[b]
        if not inter:
            continue
        rows.append({
            '套装A': SET_CN.get(a, a), '套装B': SET_CN.get(b, b),
            '共有族数': len(inter), '共有武器': '、'.join(sorted(inter)),
            'A满6件': bonus_txt(a, 6), 'B满6件': bonus_txt(b, 6),
            '备注': '带这 %d 族里任一把 ×6 就能同时点满两套' % len(inter),
        })
    rows.sort(key=lambda r: (-r['共有族数'], r['套装A']))
    return rows, mem


def optimal_loadouts(fams, bonus, loc):
    """穷举 6 格的最优选法。两种口径：允许同款重复 / 6 把必须不同族。"""
    sig = {}
    for fid, tiers in fams.items():
        top = tiers[max(tiers)]
        s = frozenset(x.get('my_id', '') for x in (top.get('sets') or [])
                      if isinstance(x, dict))
        sig[loc.name(top.get('name', ''))] = s

    def totals(counter):
        tot = collections.Counter()
        for sid, c in counter.items():
            if c >= 2:
                tot.update(bonus[sid].get(min(c, SLOTS), {}))
        return tot

    # --- 口径一：同款可重复。只有套装签名有意义，49 族压成 34 种签名 ---
    sig2name = collections.defaultdict(list)
    for cn, s in sig.items():
        sig2name[s].append(cn)
    sigs = sorted(sig2name, key=lambda s: sorted(s))
    best_rep = {}
    for combo in itertools.combinations_with_replacement(range(len(sigs)), SLOTS):
        cnt = collections.Counter()
        for i in combo:
            for s in sigs[i]:
                cnt[s] += 1
        tot = totals(cnt)
        pts = sum(v for v in tot.values() if v > 0)
        for k, v in list(tot.items()) + [('@正收益点数合计', pts)]:
            if v > best_rep.get(k, (-10 ** 9,))[0]:
                best_rep[k] = (v, combo, dict(cnt))

    # --- 口径二：6 把全不同族 ---
    names = sorted(sig)
    best_uniq = {}
    best_breadth = (0, 0, None)
    for combo in itertools.combinations(names, SLOTS):
        cnt = collections.Counter()
        for f in combo:
            for s in sig[f]:
                cnt[s] += 1
        tot = totals(cnt)
        pts = sum(v for v in tot.values() if v > 0)
        n_sets = sum(1 for c in cnt.values() if c >= 2)
        if (n_sets, pts) > best_breadth[:2]:
            best_breadth = (n_sets, pts, combo)
        for k, v in list(tot.items()) + [('@正收益点数合计', pts)]:
            if v > best_uniq.get(k, (-10 ** 9,))[0]:
                best_uniq[k] = (v, combo, dict(cnt))

    def fmt(cnt):
        # 次键必须显式给 —— 件数相同的套装若只按 -c 排，落盘顺序会随 set 的哈希顺序变
        return ' + '.join('%s%d件' % (SET_CN.get(s, s), min(c, SLOTS))
                          for s, c in sorted(cnt.items(), key=lambda x: (-x[1], x[0]))
                          if c >= 2)

    rows = []
    for k in sorted(set(best_rep) | set(best_uniq),
                    key=lambda k: (-max(best_rep.get(k, (0,))[0],
                                        best_uniq.get(k, (0,))[0]), k)):
        if k in best_rep:
            v, combo, cnt = best_rep[k]
            c = collections.Counter(sig2name[sigs[i]][0] for i in combo)
            rows.append({'目标': k, '口径': '同款可重复', '最优值': v,
                         '选法': '、'.join('%s×%d' % (n, m) for n, m in c.most_common()),
                         '激活套装': fmt(cnt),
                         '同款最多几把': max(c.values()),
                         '备注': '负向项：钝器是唯一带 stat_speed 负值的套装' if k == 'stat_speed' else ''})
        if k in best_uniq:
            v, combo, cnt = best_uniq[k]
            rows.append({'目标': k, '口径': '6 把全不同族', '最优值': v,
                         '选法': '、'.join(combo), '激活套装': fmt(cnt),
                         '同款最多几把': 1,
                         '备注': '负向项：钝器是唯一带 stat_speed 负值的套装' if k == 'stat_speed' else ''})
    n, pts, combo = best_breadth
    cnt = collections.Counter()
    for f in combo:
        for s in sig[f]:
            cnt[s] += 1
    rows.append({'目标': '@同时激活最多套装', '口径': '6 把全不同族', '最优值': n,
                 '选法': '、'.join(combo), '激活套装': fmt(cnt), '同款最多几把': 1,
                 '备注': '6 套 ×2 件一共只有 %d 点，远不如两套满配的 75 点 —— 广度不如深度' % pts})
    return rows


def run(res_dir, text_dir, cfg_dir):
    setup_stdout()
    proj, loc, bonus, fams = load(res_dir, text_dir)
    print('武器族 %d，套装 %d' % (len(fams), len(bonus)))
    csv_dir = os.path.join(cfg_dir, '配置CSV')
    json_dir = os.path.join(cfg_dir, '配置JSON')
    ensure(csv_dir)
    ensure(json_dir)

    wrows = weapon_rows(loc, fams)
    write_dict_csv(os.path.join(csv_dir, '_武器协同表.csv'), wrows)
    write_json(os.path.join(json_dir, '_武器协同表.json'), wrows)
    print('  _武器协同表     %d 行' % len(wrows))

    prows, mem = set_pairs(fams, bonus, loc)
    write_dict_csv(os.path.join(csv_dir, '_套装交集表.csv'), prows)
    print('  _套装交集表     %d 行' % len(prows))

    print('  穷举 6 格组合中（两种口径，约 1 分钟）…')
    orows = optimal_loadouts(fams, bonus, loc)
    write_dict_csv(os.path.join(csv_dir, '_最优套装组合.csv'), orows)
    print('  _最优套装组合   %d 行' % len(orows))
    return wrows, prows, orows


def main(argv):
    res = argv[0] if len(argv) > 0 else os.path.join(ROOT, '资源')
    txt = argv[1] if len(argv) > 1 else os.path.join(ROOT, '文本')
    cfg = argv[2] if len(argv) > 2 else os.path.join(ROOT, '配置')
    run(res, txt, cfg)


if __name__ == '__main__':
    main(sys.argv[1:])
