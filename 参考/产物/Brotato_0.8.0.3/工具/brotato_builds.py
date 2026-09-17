# -*- coding: utf-8 -*-
"""角色构筑分析：把 38 个角色的"能吃什么、不能吃什么"从效果资源里推出来。

Brotato 的角色不是"一堆数值加成"，而是**改写伤害乘区的开关**。三个机制决定一个角色
能玩什么流派（全部出自 `源码/`，不是玩法经验）：

1. `stat_gains_modification_effect` 改的是 `gain_<stat>`，而
   `run_data.gd:537` 的 `get_stat(x) = effects[x] * (1 + effects["gain_"+x]/100)`。
   所以 `gain = -100` 不是"减少 100 点"，是**把这条属性整条乘成 0** —— 那条属性的
   全部道具对该角色等于废纸。这是判断"死属性"的唯一依据。
2. `weapon_service.gd:112-121` 的伤害乘区是
   `damage × (1 + percent_damage/100 + [爆炸武器] explosion_damage/100)`，
   两项**加在同一个括号里**。所以 `stat_percent_damage = -100` 把乘区打到 0，
   而 `explosion_damage` 能把它单独加回来 —— 只对爆炸武器。
   同一段还有 `if is_structure: percent_dmg_bonus = 1`：**构筑物（炮台）完全不吃这个乘区**，
   所以 `-100% 伤害` 的角色照样能靠工程学出伤害。
3. `class_bonus_effect` 的 `set_id` 指定"用某套装武器时额外给某属性"，
   是角色与武器套装之间唯一的硬绑定。

产出：
    配置CSV/_角色构筑总表.csv    一角色一行，全部是推导结果，附推导依据
    配置CSV/_属性道具表.csv      属性 -> 供给该属性的道具（按每材料收益排序）
    配置CSV/_套装武器表.csv      套装 -> 成员武器 + 2/4/6 件效果
    角色构筑指南.md              分组读法（由本脚本生成表、人写结论的那份在仓库根）

用法:
    python brotato_builds.py [资源目录] [文本目录] [配置目录]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import collections

from brotato_common import ROOT, ensure, setup_stdout, write_dict_csv, write_json
from brotato_config import (SC_CHAR, SC_ITEM, SC_SET, SC_WEAPON, Loc, TIER, WTYPE,
                            short)
from brotato_tres import Project

# 武器 scaling_stats 只会引用这几条；前四条是"可投入的主伤害属性"
SCALING_STATS = ['stat_melee_damage', 'stat_ranged_damage', 'stat_elemental_damage',
                 'stat_engineering', 'stat_max_hp', 'stat_range', 'stat_luck']
MAIN_DMG = SCALING_STATS[:4]
DMG_STATS = SCALING_STATS + ['stat_percent_damage']

W_AMPLIFIED = 2.0      # 角色放大了这条属性（gain > 0）或有可观的白给
W_NORMAL = 1.0
W_DEAD = 0.0           # gain <= -100，整条乘成 0

# 模拟用的参考投入：把 BUDGET 点均分给该角色"活着"的主伤害属性，
# 再给 PCT_BUDGET 点百分比伤害。数值是为了把武器排出高下，不代表实战配装。
BUDGET = 60
PCT_BUDGET = 30
LINK_BUDGET = 30       # 角色有"某属性→伤害"联动时，额外投给那条源属性


def _basename(s):
    return os.path.basename(s or '')[:-3]


class Char(object):
    """一个角色的全部推导结果。"""

    def __init__(self, proj, path, loc):
        self.path = path
        d = proj.flat(path, depth=3)
        self.raw = d
        self.id = d.get('my_id', '')
        self.name_key = d.get('name', '')
        self.cn = loc.name(self.name_key)
        self.en = loc.t(self.name_key, 'en')
        self.default_unlocked = bool(d.get('unlocked_by_default'))
        self.wanted_tags = list(d.get('wanted_tags') or [])
        self.start_weapons = []
        for w in d.get('starting_weapons') or []:
            if isinstance(w, dict):
                self.start_weapons.append(w.get('my_id', ''))

        self.gain = collections.defaultdict(int)   # stat -> gain%
        self.flat = collections.defaultdict(int)   # key -> 白给的点数
        self.custom = []                           # (custom_key, key, value)
        self.links = []                            # (得到, 每N, 来源属性, 每次+多少)
        self.class_bonus = None                    # (set_id, 属性, 值)
        self.special = []                          # 特殊效果类

        for e in d.get('effects') or []:
            if not isinstance(e, dict):
                continue
            cls = _basename(e.get('@脚本'))
            key = e.get('key') or ''
            val = e.get('value', 0)
            ck = e.get('custom_key') or ''
            if cls == 'stat_gains_modification_effect':
                for s in e.get('stats_modified') or []:
                    self.gain[s] += val
            elif cls == 'class_bonus_effect':
                self.class_bonus = (e.get('set_id', ''), e.get('stat_displayed_name', ''), val)
            elif cls == 'gain_stat_for_every_stat_effect':
                self.links.append((key, e.get('nb_stat_scaled', 1), e.get('stat_scaled', ''), val))
            elif cls in ('effect', 'null_effect'):
                if ck:
                    self.custom.append((ck, key, val))
                else:
                    self.flat[key] += val
            else:
                self.special.append((cls, key, val, ck))

    # ---- 推导 ----
    @property
    def dead_stats(self):
        """gain <= -100 -> 该属性被整条乘成 0。"""
        return sorted(s for s, g in self.gain.items() if g <= -100)

    @property
    def amplified(self):
        return sorted((s, g) for s, g in self.gain.items() if g > 0)

    @property
    def weakened(self):
        return sorted((s, g) for s, g in self.gain.items() if -100 < g < 0)

    @property
    def limits(self):
        out = []
        f = self.flat
        if f.get('no_melee_weapons'):
            out.append('不能装近战')
        if f.get('no_ranged_weapons'):
            out.append('不能装远程')
        if 'weapon_slot' in f:
            n = 6 + f['weapon_slot'] if f['weapon_slot'] != 0 else 0
            out.append('武器栏 %d 格' % n if n else '完全不能装武器')
        if f.get('min_weapon_tier'):
            out.append('只能用 %s 及以上武器' % TIER.get(f['min_weapon_tier'], f['min_weapon_tier']))
        if 'max_weapon_tier' in f:
            out.append('只能用 %s 及以下武器' % TIER.get(f['max_weapon_tier'], f['max_weapon_tier']))
        if f.get('max_melee_weapons', 999) < 999:
            out.append('近战最多 %d 把' % f['max_melee_weapons'])
        if f.get('max_ranged_weapons', 999) < 999:
            out.append('远程最多 %d 把' % f['max_ranged_weapons'])
        if f.get('can_attack_while_moving') == 0:
            out.append('移动时不能攻击')
        if f.get('stat_percent_damage', 0) <= -100:
            out.append('**%伤害乘区归零**')
        if f.get('lose_hp_per_second'):
            out.append('每秒掉 %d 血' % f['lose_hp_per_second'])
        if 'dodge_cap' in f:
            out.append('闪避上限 %d%%' % f['dodge_cap'])
        if f.get('destroy_weapons'):
            out.append('进商店武器全毁')
        if f.get('hp_shop'):
            out.append('用血买东西')
        return out

    def stat_weight(self, stat):
        g = self.gain.get(stat, 0)
        if g <= -100:
            return W_DEAD
        if g > 0:
            return W_AMPLIFIED
        flat = self.flat.get(stat, 0)
        if flat <= -100:
            return W_DEAD          # 白给成 -100（如幽灵的护甲）也等于这条路走不通
        if flat > 0:
            return W_AMPLIFIED
        # 被 link 引用（如骑士 armor -> melee）也算放大
        for _got, _n, src, _v in self.links:
            if src == stat:
                return W_AMPLIFIED
        if flat < 0:
            return max(0.0, W_NORMAL + flat / 100.0)
        if g < 0:
            return W_NORMAL * (1 + g / 100.0)
        return W_NORMAL

    @property
    def live_main(self):
        """还活着的主伤害属性（近战/远程/元素/工程学），预算就均分给它们。"""
        out = [s for s in MAIN_DMG if self.stat_weight(s) > 0]
        return out or MAIN_DMG          # 全死也得给个池子，免得除零

    @property
    def link_sources(self):
        """联动的源属性（骑士的护甲、飞毛腿的速度…），要额外投预算。"""
        return sorted({src for _g, _n, src, _v in self.links
                       if src.startswith('stat_')})

    @property
    def core_stats(self):
        """这个角色真正吃的伤害属性，按权重降序。"""
        out = [s for s in DMG_STATS if self.stat_weight(s) >= W_AMPLIFIED]
        if self.flat.get('explosion_damage', 0) > 0 or self.gain.get('explosion_damage', 0) > 0:
            out.append('explosion_damage')
        if self.class_bonus:
            out.append('套装:' + self.class_bonus[0])
        return out

    def sim_stats(self):
        """参考属性向量：白给 + 均分预算，再过一遍 gain 乘区，最后结算联动。"""
        live = self.live_main
        srcs = self.link_sources
        s = {}
        for k in set(SCALING_STATS + ['stat_percent_damage', 'stat_attack_speed',
                                      'explosion_damage', 'stat_armor', 'stat_speed',
                                      'stat_crit_chance'] + srcs):
            inv = 0.0
            if k in live:
                inv += BUDGET / float(len(live))
            if k == 'stat_percent_damage':
                inv += PCT_BUDGET
            if k in srcs and k not in live:
                inv += LINK_BUDGET
            s[k] = (self.flat.get(k, 0) + inv) * (1 + self.gain.get(k, 0) / 100.0)
        for got, n, src, v in self.links:
            if n and src in s:
                s[got] = s.get(got, 0) + (s[src] // n) * v
        return s

    @property
    def archetype(self):
        """流派归类。按"最能决定配装的那条机制"逐级判，判据都写在返回值里。"""
        f = self.flat
        amp = [s for s, _ in self.amplified]
        dead = set(self.dead_stats)
        CN = {'stat_melee_damage': '近战', 'stat_ranged_damage': '远程',
              'stat_elemental_damage': '元素', 'stat_engineering': '工程学',
              'stat_armor': '护甲', 'stat_speed': '速度', 'stat_range': '射程',
              'stat_max_hp': '最大生命', 'stat_luck': '幸运',
              'stat_crit_chance': '暴击率', 'stat_harvesting': '收获',
              'stat_percent_damage': '%伤害', 'materials': '材料',
              'stat_lifesteal': '吸血', 'structure': '构筑物'}

        # 1) 装备位被改写的，先于一切
        if f.get('weapon_slot', 1) == 0:
            return '无武器 / 受击反伤'
        if f.get('weapon_slot', 0) <= -5:
            return '单武器 / 极限攻速'
        if f.get('weapon_slot', 0) >= 6:
            return '多武器铺场（每多一把 -%伤害）'
        if f.get('can_attack_while_moving') == 0:
            return '站桩输出'
        if f.get('destroy_weapons'):
            return '武器每波重买（军火商式）'

        # 2) %伤害乘区被打到 0 的，只剩三条出路
        if f.get('stat_percent_damage', 0) <= -100:
            if f.get('explosion_damage', 0) > 0 or self.gain.get('explosion_damage', 0) > 0:
                return '爆炸专精（乘区被爆炸接管）'
            if f.get('pacifist', 0) > 0:
                return '不杀怪 / 存活收租'
            if any(ck == 'temp_stats_on_hit' for ck, _k, _v in self.custom):
                return '挨打叠增伤（%伤害从 -100 爬回来）'
            return '%伤害归零 → 只能走炮台'

        # 3) 属性联动是配装主轴的
        srcs = [l[2] for l in self.links]
        if 'materials' in srcs:
            return '囤材料换属性'
        if len(self.links) >= 2 and set(srcs) & {'stat_melee_damage', 'stat_ranged_damage'}:
            return '近远互喂（双修）'
        for got, _n, src, _v in self.links:
            if src in CN and got in ('stat_melee_damage', 'stat_ranged_damage',
                                     'stat_percent_damage'):
                return '%s 转伤害' % CN[src]

        # 4) 套装硬绑定
        if self.class_bonus:
            return '套装绑定（%s → %s）' % (self.class_bonus[0],
                                       CN.get(self.class_bonus[1], self.class_bonus[1]))

        # 5) 单一伤害属性被放大 / 其余被杀
        alive = [s for s in MAIN_DMG if s not in dead]
        if len(alive) == 1:
            return '%s 单修（其余伤害属性被乘成 0）' % CN[alive[0]]
        boosted = [s for s in MAIN_DMG if s in amp]
        if len(boosted) == 1:
            return CN[boosted[0]]
        if len(boosted) >= 3:
            return '全伤害属性通用增伤'

        # 6) 经济 / 规则类
        if f.get('no_ranged_weapons'):
            return '纯近战'
        if f.get('no_melee_weapons'):
            return '纯远程'
        if 'stat_harvesting' in amp or f.get('stat_harvesting', 0) >= 15:
            return '收获 / 滚雪球经济'
        if 'stat_luck' in amp or f.get('stat_luck', 0) >= 50:
            return '幸运 / 掉落'
        if f.get('stat_lifesteal', 0) >= 10 or f.get('lose_hp_per_second', 0):
            return '吸血 / 续航'
        if f.get('xp_gain', 0) >= 100:
            return '等级 / 升级卡'
        if f.get('hp_shop'):
            return '血换资源'
        if f.get('number_of_enemies', 0) or f.get('enemy_health', 0) or f.get('map_size', 0):
            return '改刷怪规则'
        return '通用'


def build_weapon_index(proj, loc):
    """武器族 -> 各 tier 的数值 + 裸 DPS（周期含出手动画，公式见 数值设计报告 4.6）。"""
    rows = []
    for p in proj.by_script(SC_WEAPON):
        d = proj.flat(p, depth=2)
        st = d.get('stats') or {}
        if not isinstance(st, dict):
            st = {}
        cd = st.get('cooldown', 0) or 0
        rd = st.get('recoil_duration', 0.1) or 0.1
        typ = d.get('type', 0)
        rng = st.get('max_range', 0) or 0
        if typ == 1:
            period = rd * 2 + cd / 60.0
        else:
            period = max(0.01, 0.2) / 2 + 0.2 + rd + cd / 60.0 + (rng / 70.0) * 0.15 / 2
        n = st.get('nb_projectiles', 1) or 1
        dmg = (st.get('damage', 0) or 0) * (n if typ == 1 else 1)
        scaling = []
        for s in st.get('scaling_stats') or []:
            if isinstance(s, list) and len(s) >= 2:
                scaling.append((s[0], float(s[1])))
        sets = []
        for s in d.get('sets') or []:
            if isinstance(s, dict):
                sets.append(s.get('my_id', ''))
        exploding = any(_basename(e.get('@脚本')) in ('exploding_effect', 'item_exploding_effect')
                        for e in (d.get('effects') or []) if isinstance(e, dict))
        rows.append({
            'id': d.get('my_id', ''),
            '族': d.get('weapon_id', '') or d.get('my_id', ''),
            '中文名': loc.name(d.get('name', '')),
            'tier': d.get('tier', 0),
            '类型': WTYPE.get(typ, typ),
            '基础伤害': st.get('damage', 0) or 0, '弹数': n,
            '冷却': cd, '后坐时长': rd, '爆炸': exploding,
            '伤害': dmg, '周期': round(period, 3),
            'DPS': round(dmg / period, 1) if period else 0,
            '射程': rng, 'scaling': scaling, 'sets': sets,
            '出处': short(p),
        })
    return rows


def build_item_index(proj, loc):
    """道具 -> 它供给哪些 key、各多少点。"""
    rows = []
    for p in proj.by_script(SC_ITEM):
        d = proj.flat(p, depth=2)
        gives = collections.Counter()
        classes = set()
        for e in d.get('effects') or []:
            if not isinstance(e, dict):
                continue
            cls = _basename(e.get('@脚本'))
            classes.add(cls)
            k = e.get('key') or ''
            ck = e.get('custom_key') or ''
            if cls == 'stat_gains_modification_effect':
                for s in e.get('stats_modified') or []:
                    gives['gain_' + s] += e.get('value', 0)
            elif ck:
                gives['%s[%s]' % (ck, k)] += e.get('value', 0)
            else:
                gives[k] += e.get('value', 0)
        rows.append({
            'id': d.get('my_id', ''), '中文名': loc.name(d.get('name', '')),
            '稀有度': TIER.get(d.get('tier', 0), d.get('tier')),
            '价格': d.get('value', 0), '上限': d.get('max_nb', -1),
            '标签': list(d.get('tags') or []),
            'gives': dict(gives), '效果类': sorted(classes),
            '出处': short(p),
        })
    return rows


def weapon_usable(ch, w):
    if ch.flat.get('weapon_slot', 1) == 0:
        return False
    if ch.flat.get('no_melee_weapons') and w['类型'] == '近战':
        return False
    if ch.flat.get('no_ranged_weapons') and w['类型'] == '远程':
        return False
    mx = ch.flat.get('max_weapon_tier')
    if mx is not None and w['tier'] > mx:
        return False
    if w['tier'] < ch.flat.get('min_weapon_tier', 0):
        return False
    return True


def sim_dps(ch, w, stats):
    """照 weapon_service.init_*_stats 的顺序算这把武器在参考属性下的 DPS。

    伤害 = max(1, 基础 + Σ(属性×coef)) × (1 + %伤害/100 [+ 爆炸武器: 爆炸伤害/100])
    冷却 = max(2, cd / (1+攻速))，攻速含套装绑定给的 attack_speed_mod
    周期 = 冷却/60 + 出手动画（近战另算，见 数值设计报告 4.6）
    """
    dmg = w['基础伤害'] + sum(stats.get(s, 0) * c for s, c in w['scaling'])
    mult = 1 + stats.get('stat_percent_damage', 0) / 100.0
    if w['爆炸']:
        mult += stats.get('explosion_damage', 0) / 100.0
    dmg = max(1.0, round(dmg * mult))

    atk_spd = stats.get('stat_attack_speed', 0) / 100.0
    rng = w['射程']
    if ch.class_bonus and ch.class_bonus[0] in w['sets']:
        sid, sname, val = ch.class_bonus
        if sname in ('stat_attack_speed', 'attack_speed_mod'):
            atk_spd += val / 100.0
        elif sname in ('stat_damage', 'damage'):
            dmg += val
        elif sname in ('stat_range', 'max_range'):
            rng += val
    cd = w['冷却'] / (1 + atk_spd) if atk_spd > 0 else w['冷却'] * (1 + abs(atk_spd))
    cd = max(2, cd)
    rd = w['后坐时长'] / (1 + atk_spd) if atk_spd > 0 else w['后坐时长']
    if w['类型'] == '远程':
        period = rd * 2 + cd / 60.0
    else:
        atk_dur = max(0.01, 0.2 - atk_spd / 10.0) + (rng / max(70.0, min(120.0, 70 * (1 + atk_spd / 3)))) * 0.15
        back = 0.2 / (1 + atk_spd * 3) if atk_spd > 0 else 0.2
        period = atk_dur / 2 + back + rd + cd / 60.0
    return dmg * w['弹数'] / period if period else 0


def recommend_weapons(ch, weapons, topn=6):
    """同族只留该角色能拿到的最高 tier，按模拟 DPS 排序。"""
    stats = ch.sim_stats()
    best = {}
    for w in weapons:
        if not weapon_usable(ch, w):
            continue
        prev = best.get(w['族'])
        if prev is None or w['tier'] > prev['tier']:
            best[w['族']] = w
    out = []
    for w in best.values():
        out.append(dict(w, sim=round(sim_dps(ch, w, stats), 1)))
    out.sort(key=lambda r: -r['sim'])
    return out[:topn]


def item_score(ch, it):
    """道具对本角色的绝对得分 = Σ(点数 × 该 key 的权重)；死属性记负分。"""
    s = 0.0
    dead = 0.0
    for k, v in it['gives'].items():
        base = k[5:] if k.startswith('gain_') else k
        w = 0.0
        if base.startswith('stat_'):
            w = ch.stat_weight(base)
            if base in ('stat_max_hp', 'stat_armor', 'stat_hp_regeneration',
                        'stat_dodge', 'stat_lifesteal', 'stat_speed'):
                w = max(w, 0.6)          # 生存属性对谁都有基础价值
        elif base in ('explosion_damage', 'explosion_size'):
            w = W_AMPLIFIED if 'explosion_damage' in ch.core_stats else 0.5
        elif base in ('pickup_range', 'xp_gain', 'items_price', 'gold_drops',
                      'chance_double_gold', 'item_box_gold', 'recycling_gains'):
            w = 0.5
        if w <= 0 and base.startswith('stat_') and v > 0:
            dead += v
            continue
        s += v * w
    if set(it['标签']) & set(ch.wanted_tags):
        s *= 1.2                          # 偏好标签有 5% 定向出货，等于更容易吃到
    return s / max(1, it['价格']) * 100, dead


def recommend_items(ch, items, all_scores, topn=8):
    """**差异化**推荐：角色得分 ÷ 全角色均分。

    不这么做的话，献血/眼镜这种对谁都强的白板道具会霸占所有角色的推荐位，
    等于没推荐。比值 > 1 才是"这个角色特别吃"的东西。

    分母近 0 时比值会爆（正负效果互相抵消的道具，如毒污泥 +2元素/-2闪避），
    所以再加一道绝对分门槛：至少要有本角色最高分的 25%。
    """
    scored = [(item_score(ch, it)[0], it) for it in items]
    top = max([s for s, _ in scored] or [0])
    out = []
    for s, it in scored:
        avg = all_scores.get(it['id'], 0)
        if s <= 0 or avg <= 0.2 or s < top * 0.25:
            continue
        out.append((round(s / avg, 2), round(s, 1), it))
    out.sort(key=lambda x: (-x[0], -x[1]))
    return [o for o in out if o[0] > 1.05][:topn]


def set_weapons(ch, weapons, topn=6):
    """角色被 class_bonus 绑到某套装时，那套装里它能用的武器（套装奖励已计入 DPS）。"""
    if not ch.class_bonus:
        return []
    sid = ch.class_bonus[0]
    stats = ch.sim_stats()
    best = {}
    for w in weapons:
        if sid not in w['sets'] or not weapon_usable(ch, w):
            continue
        prev = best.get(w['族'])
        if prev is None or w['tier'] > prev['tier']:
            best[w['族']] = w
    out = [dict(w, sim=round(sim_dps(ch, w, stats), 1)) for w in best.values()]
    out.sort(key=lambda r: -r['sim'])
    return out[:topn]


def top_items(ch, items, topn=8):
    """按"每 100 材料买到多少加权属性点"排，含对谁都强的白板；与差异化那列互补。"""
    out = [(round(item_score(ch, it)[0], 1), it) for it in items]
    out = [o for o in out if o[0] > 0]
    out.sort(key=lambda x: -x[0])
    return out[:topn]


def useless_items(ch, items, topn=10):
    """对该角色**完全是废纸**的道具：它给的属性点全落在被乘成 0 的属性上。"""
    if not ch.dead_stats:
        return []
    out = []
    for it in items:
        gives = {(k[5:] if k.startswith('gain_') else k): v for k, v in it['gives'].items()}
        pos = {k: v for k, v in gives.items() if v > 0}
        if not pos:
            continue
        if all(k in ch.dead_stats for k in pos):
            out.append(it)
    out.sort(key=lambda it: -it['价格'])
    return out[:topn]


def run(res_dir, text_dir, cfg_dir):
    setup_stdout()
    proj = Project(res_dir)
    loc = Loc(text_dir, os.path.join(os.path.dirname(res_dir), '源码', 'singletons', 'text.gd'))
    loc.load_sets(proj)
    print('载入 %d 个文本资源' % len(proj.files))

    weapons = build_weapon_index(proj, loc)
    items = build_item_index(proj, loc)
    chars = [Char(proj, p, loc) for p in proj.by_script(SC_CHAR)]
    chars.sort(key=lambda c: c.id)
    print('角色 %d，武器 %d，道具 %d' % (len(chars), len(weapons), len(items)))

    csv_dir = os.path.join(cfg_dir, '配置CSV')
    json_dir = os.path.join(cfg_dir, '配置JSON')
    ensure(csv_dir)
    ensure(json_dir)

    # 先算每件道具在 38 个角色上的平均分，供差异化推荐做分母
    tot = collections.defaultdict(float)
    for c in chars:
        for it in items:
            tot[it['id']] += item_score(c, it)[0]
    avg = {k: v / len(chars) for k, v in tot.items()}

    # ---- 角色构筑总表 ----
    rows = []
    for c in chars:
        rw = recommend_weapons(c, weapons)
        rset = set_weapons(c, weapons)
        ri = recommend_items(c, items, avg)
        rabs = top_items(c, items)
        bad = useless_items(c, items)
        rows.append({
            'id': c.id, '中文名': c.cn, '英文名': c.en,
            '默认解锁': c.default_unlocked,
            '流派': c.archetype,
            '核心属性': ' / '.join(c.core_stats),
            '放大属性': ' / '.join('%s+%d%%' % (s, g) for s, g in c.amplified),
            '削弱属性': ' / '.join('%s%d%%' % (s, g) for s, g in c.weakened),
            '死属性(乘成0)': ' / '.join(c.dead_stats),
            '硬限制': ' / '.join(c.limits),
            '套装绑定': ('%s → %s+%d' % c.class_bonus) if c.class_bonus else '',
            '属性联动': ' / '.join('每%d %s → %+d %s' % (n, src, v, got)
                                 for got, n, src, v in c.links),
            '偏好标签': ' / '.join(c.wanted_tags),
            '白给属性': ' / '.join('%s%+d' % (k, v) for k, v in sorted(c.flat.items())
                                if k.startswith('stat_') and v),
            '特殊机制': ' / '.join('%s(%s=%s)' % (cls, k, v) for cls, k, v, _ in c.special),
            '起始武器池': '%d 把: %s' % (len(c.start_weapons), ' / '.join(c.start_weapons[:6])
                                    + (' …' if len(c.start_weapons) > 6 else '')),
            '推荐武器(模拟DPS)': ' / '.join('%s %s %.0f' % (w['中文名'], w['类型'], w['sim'])
                                       for w in rw),
            '套装契合武器': ' / '.join('%s %.0f' % (w['中文名'], w['sim']) for w in rset),
            '性价比道具(每百材料)': ' / '.join('%s %.0f' % (it['中文名'], sc) for sc, it in rabs),
            '特吃的道具(倍率)': ' / '.join('%s×%.1f' % (it['中文名'], r) for r, _s, it in ri),
            '对它无效的道具': ' / '.join(it['中文名'] for it in bad),
            '出处': short(c.path),
        })
    write_dict_csv(os.path.join(csv_dir, '_角色构筑总表.csv'), rows)
    write_json(os.path.join(json_dir, '_角色构筑总表.json'), rows)
    print('  _角色构筑总表   %d 行' % len(rows))

    # ---- 属性 -> 道具 ----
    srows = []
    for it in items:
        for k, v in sorted(it['gives'].items()):
            if not v:
                continue
            srows.append({
                '属性key': k, '道具id': it['id'], '道具': it['中文名'],
                '点数': v, '稀有度': it['稀有度'], '价格': it['价格'],
                '每百材料点数': round(v / max(1, it['价格']) * 100, 1),
                '上限': it['上限'], '标签': ' / '.join(it['标签']),
                '效果类': ' / '.join(it['效果类']), '出处': it['出处'],
            })
    srows.sort(key=lambda r: (r['属性key'], -r['每百材料点数']))
    write_dict_csv(os.path.join(csv_dir, '_属性道具表.csv'), srows)
    print('  _属性道具表     %d 行' % len(srows))

    # ---- 套装 -> 武器 ----
    set_bonus = {}
    for p in proj.by_script(SC_SET):
        d = proj.flat(p, depth=2)
        tiers = {}
        for i, tier in enumerate(d.get('set_bonuses') or []):
            if tier:
                tiers[i + 2] = ' / '.join(
                    '%s%+d' % (e.get('key', ''), e.get('value', 0))
                    for e in tier if isinstance(e, dict))
        set_bonus[d.get('my_id', '')] = (loc.name(d.get('name', '')), tiers)
    members = collections.defaultdict(set)
    for w in weapons:
        for s in w['sets']:
            members[s].add(w['中文名'])
    wrows = []
    for sid, (cn, tiers) in sorted(set_bonus.items()):
        wrows.append({
            '套装id': sid, '中文名': cn,
            '成员武器族数': len(members.get(sid, ())),
            '成员武器': '、'.join(sorted(members.get(sid, ()))),
            '2件': tiers.get(2, ''), '3件': tiers.get(3, ''), '4件': tiers.get(4, ''),
            '5件': tiers.get(5, ''), '6件': tiers.get(6, ''),
            '绑定角色': ' / '.join(c.cn for c in chars
                                if c.class_bonus and c.class_bonus[0] == sid),
        })
    write_dict_csv(os.path.join(csv_dir, '_套装武器表.csv'), wrows)
    print('  _套装武器表     %d 行' % len(wrows))
    return rows, srows, wrows


def main(argv):
    res = argv[0] if len(argv) > 0 else os.path.join(ROOT, '资源')
    txt = argv[1] if len(argv) > 1 else os.path.join(ROOT, '文本')
    cfg = argv[2] if len(argv) > 2 else os.path.join(ROOT, '配置')
    run(res, txt, cfg)


if __name__ == '__main__':
    main(sys.argv[1:])
