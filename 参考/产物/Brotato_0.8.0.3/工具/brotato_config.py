# -*- coding: utf-8 -*-
"""把 2527 个 `.tres` 拆成分类总表：配置JSON/ + 配置CSV/。

Brotato 的数值不是"一张大表"，是**一物一文件**、再靠 `ExtResource` 互指
（道具 -> 效果 -> 数值，角色 -> 起始武器 -> 武器数值）。本脚本按脚本类型把它们归堆，
把引用摊平成一行，并把本地化 key 换成中英文。

效果描述的拼法照抄 `源码/singletons/text.gd`：`tr(text_key or key)` 里的 `{0}` 换成数值、
`{1}` 换成 `tr(key)`；模板里没有 `{0}` 且该 key 在 `keys_needing_operator` 里时，
数值补在最前面。正负号与百分号两张名单**直接从 text.gd 现读**，不在这里抄第二份。

用法:
    python brotato_config.py [资源目录] [文本目录] [配置输出目录]
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from brotato_common import (ROOT, ensure, read_json, setup_stdout, write_csv,
                            write_dict_csv, write_json)
from brotato_tres import Project

S = 'res://'
SC_ITEM = S + 'items/global/item_data.gd'
SC_CHAR = S + 'items/characters/character_data.gd'
SC_WEAPON = S + 'items/global/weapon_data.gd'
SC_UPGRADE = S + 'items/upgrades/upgrade_data.gd'
SC_CHALLENGE = S + 'challenges/global/challenge_data.gd'
SC_SET = S + 'items/sets/set_data.gd'
SC_STATS = S + 'entities/units/unit/stats.gd'
SC_WAVE = S + 'zones/wave_data.gd'
SC_GROUP = S + 'zones/wave_group_data.gd'
SC_UNIT = S + 'zones/wave_unit_data.gd'
SC_ZONE = S + 'zones/zone_data.gd'
SC_DIFF = S + 'items/difficulties/difficulty_data.gd'
SC_CONSUM = S + 'items/consumables/consumable_data.gd'
SC_STATDEF = S + 'items/upgrades/stat_data.gd'
SC_ENEMY = S + 'entities/units/enemies/enemy_data.gd'
SC_BG = S + 'zones/backgrounds/background_data.gd'

TIER = {0: 'I 普通', 1: 'II 罕见', 2: 'III 稀有', 3: 'IV 传奇', 4: '危险4', 5: '危险5'}
WTYPE = {0: '近战', 1: '远程'}
REWARD = {0: '道具', 1: '武器', 2: '区域', 3: '起始武器', 4: '消耗品', 5: '升级',
          6: '角色', 7: '难度'}
UNIT_TYPE = {0: '玩家', 1: '敌人', 2: '中立', 3: '建筑', 4: 'Boss'}
STORAGE = {0: '累加', 1: '键值表', 2: '替换'}
SIGN = {0: '正', 1: '负', 2: '中性', 3: '看数值', 4: '看参数'}


# ---------------------------------------------------------------- 文本
RT = '«运行期»'          # 只有开局后才算得出来的量（依赖玩家当前属性/持有武器）


class Loc(object):
    def __init__(self, text_dir, text_gd):
        self.en = read_json(os.path.join(text_dir, 'en.json'))
        self.zh = read_json(os.path.join(text_dir, 'zh.json'))
        self.op, self.pct = self._parse_text_gd(text_gd)
        self.set_names = {}          # set_id -> 文本 key，由 load_sets() 填

    @staticmethod
    def _parse_text_gd(path):
        """从 text.gd 现读 keys_needing_operator / keys_needing_percent。"""
        with open(path, 'r', encoding='utf-8') as f:
            src = f.read()
        out = []
        for name in ('keys_needing_operator', 'keys_needing_percent'):
            m = re.search(r'var %s\s*:?=\s*\{(.*?)\n\}' % name, src, re.S)
            d = {}
            if m:
                for km in re.finditer(r'"([^"]+)"\s*:\s*\[([^\]]*)\]', m.group(1)):
                    idxs = [int(x) for x in re.findall(r'\d+', km.group(2))]
                    d[km.group(1)] = idxs
            out.append(d)
        return out[0], out[1]

    def t(self, key, lang='zh'):
        if not key:
            return ''
        tbl = self.zh if lang == 'zh' else self.en
        return tbl.get(key.upper(), tbl.get(key, ''))

    def name(self, key):
        return self.t(key, 'zh') or self.t(key, 'en') or key

    def load_sets(self, proj):
        for p in proj.by_script(SC_SET):
            t = proj.get(p)
            self.set_names[t.resource.get('my_id', '')] = t.resource.get('name', '')

    def effect_args(self, eff, lang):
        """逐个照抄各效果子类的 `get_args()`（见 `源码/effects/`）。

        基类 `effect.gd` 是 `[value, tr(key)]`；子类各不相同，**不能一律套基类**，
        否则 `{1}` 会被塞成模板自己（`tr("effect_projectiles_on_hit")`）。
        依赖玩家当前状态的量填 RT。
        """
        cls = os.path.basename(eff.get('@脚本', '') or '')[:-3]
        key = eff.get('key') or ''
        val = eff.get('value', 0)

        def T(k):
            return self.t(str(k).upper(), lang) or str(k)

        def stats_of(name):
            s = eff.get(name)
            return s if isinstance(s, dict) else {}

        if cls == 'stat_gains_modification_effect':
            return [T(eff.get('stat_displayed', '')), str(abs(val))]
        if cls == 'gain_stat_for_every_stat_effect':
            return [str(val), T(key), str(eff.get('nb_stat_scaled', 0)),
                    T(eff.get('stat_scaled', '')), RT]
        if cls == 'class_bonus_effect':
            return [str(val), T(eff.get('stat_displayed_name', '')),
                    T(self.set_names.get(eff.get('set_id', ''), eff.get('set_id', '')))]
        if cls == 'convert_stat_effect':
            return [str(eff.get('pct_converted', 1)), T(key), T(eff.get('to_stat', '')),
                    str(val), str(eff.get('to_value', 0))]
        if cls == 'stat_with_max_effect':
            return [str(val), T(key), str(eff.get('max_value', 0))]
        if cls == 'weapon_stack_effect':
            return [str(val), T(eff.get('stat_displayed_name', '')),
                    T(eff.get('weapon_stacked_name', '')), RT]
        if cls == 'gain_stat_every_killed_enemies_effect':
            return [str(eff.get('stat_nb', 1)), T(eff.get('stat', '')), str(val)]
        if cls == 'exploding_effect':
            return [str(int(round((eff.get('chance', 1) or 0) * 100)))]
        if cls == 'chance_stat_damage_effect':
            return [str(eff.get('chance', 3)), RT, T(key)]
        if cls == 'item_exploding_effect':
            return [str(int(round((eff.get('chance', 1) or 0) * 100))), RT, RT]
        if cls in ('projectile_effect', 'projectiles_on_hit_effect'):
            ws = stats_of('weapon_stats')
            b = ws.get('bounce')
            return [str(val), str(ws.get('damage', RT)),
                    str(b + 1) if isinstance(b, int) else RT, RT,
                    str(eff.get('cooldown', ''))]
        if cls == 'structure_effect':
            st = stats_of('stats')
            return [str(val), str(eff.get('spawn_cooldown', RT)),
                    str(st.get('damage', RT)), RT]
        if cls == 'turret_effect':
            st = stats_of('stats')
            if eff.get('is_burning'):
                return [RT, RT, RT]
            if eff.get('is_spawning'):
                cd = st.get('cooldown')
                return [str(int(cd / 60)) if isinstance(cd, (int, float)) else RT]
            return [str(st.get('damage', RT)), RT,
                    str(st.get('nb_projectiles', 1)), str(st.get('bounce', 0))]
        if cls in ('burning_effect', 'burn_chance_effect'):
            bd = stats_of('burning_data')
            base = [str(bd.get('damage', RT)), str(bd.get('duration', RT)), RT]
            if cls == 'burn_chance_effect':
                c = bd.get('chance')
                return [str(int(round(c * 100))) if isinstance(c, (int, float)) else RT] + base
            return base
        if cls == 'stat_cap_effect':
            return [str(val)]
        if cls == 'slow_in_zone_effect':
            return []
        # effect.gd / null_effect.gd / healing_effect.gd 走基类
        dk = key
        if eff.get('custom_key') == 'starting_weapon' and len(key) > 2:
            dk = key[:-2]
        return [str(val), T(dk)]

    def effect_text(self, eff, lang='zh'):
        """照 text.gd 的规则渲染一条效果描述。"""
        key = (eff.get('key') or '')
        text_key = (eff.get('text_key') or '')
        shown = (text_key or key).upper()
        tpl = self.t(shown, lang)
        if not tpl:
            return ''
        ops = self.op.get(shown.lower(), [])
        pcts = self.pct.get(shown.lower(), [])
        if ops and '{0}' not in tpl:
            tpl = '{0} ' + tpl
        args = self.effect_args(eff, lang)
        for i, a in enumerate(args):
            s = a
            if i in ops and s != RT:
                try:
                    s = ('+' if int(float(s)) >= 0 else '') + s
                except ValueError:
                    pass
            if i in pcts and s != RT:
                s += '%'
            tpl = tpl.replace('{%d}' % i, s)
        tpl = re.sub(r'\{\d+\}', RT, tpl)
        return re.sub(r'\[/?[^\]]+\]', '', tpl).strip()


# ---------------------------------------------------------------- 小工具
def eff_brief(loc, effects, lang='zh'):
    """效果列表 -> 一行描述。"""
    out = []
    for e in effects or []:
        if not isinstance(e, dict):
            continue
        t = loc.effect_text(e, lang)
        if not t:
            t = '%s=%s' % (e.get('key', '?'), e.get('value', ''))
        out.append(t)
    return ' / '.join(out)


def eff_raw(effects):
    """效果列表 -> `key=value` 原始串，供做归因用。"""
    out = []
    for e in effects or []:
        if not isinstance(e, dict):
            continue
        k = e.get('key', '')
        if e.get('custom_key'):
            k = '%s[%s]' % (e['custom_key'], k)
        out.append('%s=%s' % (k, e.get('value', '')))
    return ' / '.join(out)


def eff_class(effects):
    cls = []
    for e in effects or []:
        if isinstance(e, dict):
            s = e.get('@脚本', '')
            cls.append(os.path.basename(s)[:-3] if s else '')
    return ' / '.join(sorted(set(c for c in cls if c)))


def names_of(lst):
    out = []
    for x in lst or []:
        if isinstance(x, dict):
            out.append(x.get('my_id') or x.get('name') or x.get('@路径', ''))
        elif isinstance(x, str):
            out.append(x)
    return ' / '.join(out)


def short(p):
    return p[len(S):] if isinstance(p, str) and p.startswith(S) else p


# ---------------------------------------------------------------- 各张总表
def t_items(proj, loc):
    rows = []
    for p in proj.by_script(SC_ITEM):
        d = proj.flat(p, depth=2)
        rows.append({
            'id': d.get('my_id', ''), '中文名': loc.name(d.get('name', '')),
            '英文名': loc.t(d.get('name', ''), 'en'), '文本key': d.get('name', ''),
            '稀有度': TIER.get(d.get('tier', 0), d.get('tier')), '基础价格': d.get('value', ''),
            '默认解锁': d.get('unlocked_by_default', ''), '上限': d.get('max_nb', ''),
            '标签': ' / '.join(d.get('tags') or []),
            '效果(中)': eff_brief(loc, d.get('effects'), 'zh'),
            '效果(英)': eff_brief(loc, d.get('effects'), 'en'),
            '效果原始': eff_raw(d.get('effects')),
            '效果类': eff_class(d.get('effects')),
            '追踪文案': d.get('tracking_text', ''),
            '出处': short(p),
        })
    rows.sort(key=lambda r: (str(r['稀有度']), str(r['id'])))
    return rows


def t_characters(proj, loc):
    rows = []
    for p in proj.by_script(SC_CHAR):
        d = proj.flat(p, depth=2)
        rows.append({
            'id': d.get('my_id', ''), '中文名': loc.name(d.get('name', '')),
            '英文名': loc.t(d.get('name', ''), 'en'),
            '默认解锁': d.get('unlocked_by_default', ''),
            '效果(中)': eff_brief(loc, d.get('effects'), 'zh'),
            '效果(英)': eff_brief(loc, d.get('effects'), 'en'),
            '效果原始': eff_raw(d.get('effects')),
            '偏好标签': ' / '.join(d.get('wanted_tags') or []),
            '起始武器数': len(d.get('starting_weapons') or []),
            '起始武器': names_of(d.get('starting_weapons')),
            '出处': short(p),
        })
    rows.sort(key=lambda r: str(r['id']))
    return rows


def t_weapons(proj, loc):
    rows = []
    for p in proj.by_script(SC_WEAPON):
        d = proj.flat(p, depth=2)
        st = d.get('stats') or {}
        if not isinstance(st, dict):
            st = {}
        scaling = st.get('scaling_stats') or []
        sc = ' / '.join('%s x%s' % (s[0], s[1]) for s in scaling
                        if isinstance(s, list) and len(s) >= 2)
        up = d.get('upgrades_into')
        cd = st.get('cooldown')
        rows.append({
            'id': d.get('my_id', ''),
            '武器族': d.get('weapon_id', '') or d.get('my_id', ''),
            '中文名': loc.name(d.get('name', '')), '英文名': loc.t(d.get('name', ''), 'en'),
            '稀有度': TIER.get(d.get('tier', 0), d.get('tier')),
            '类型': WTYPE.get(d.get('type', 0), d.get('type')),
            '基础价格': d.get('value', ''),
            '伤害': st.get('damage', ''), '冷却帧': cd,
            '冷却秒': round(cd / 60.0, 3) if isinstance(cd, (int, float)) else '',
            '暴击率': st.get('crit_chance', ''), '暴击倍率': st.get('crit_damage', ''),
            '射程': st.get('max_range', ''), '击退': st.get('knockback', ''),
            '精准': st.get('accuracy', ''), '吸血': st.get('lifesteal', ''),
            '弹数': st.get('nb_projectiles', ''), '穿透': st.get('piercing', ''),
            '弹跳': st.get('bounce', ''), '弹速': st.get('projectile_speed', ''),
            '加成属性': sc,
            '套装': names_of(d.get('sets')),
            '升级为': (up.get('my_id') if isinstance(up, dict) else short(up)) or '',
            '效果(中)': eff_brief(loc, d.get('effects'), 'zh'),
            '效果原始': eff_raw(d.get('effects')),
            '出处': short(p),
        })
    rows.sort(key=lambda r: (str(r['武器族']), str(r['稀有度'])))
    return rows


def t_enemies(proj, loc):
    rows = []
    for p in proj.by_script(SC_STATS):
        d = proj.flat(p, depth=1)
        rel = short(p)
        rows.append({
            '编号': rel.split('/')[-2] if '/' in rel else '',
            '资源': rel,
            '生命': d.get('health', ''), '每波+生命': d.get('health_increase_each_wave', ''),
            '伤害': d.get('damage', ''), '每波+伤害': d.get('damage_increase_each_wave', ''),
            '护甲': d.get('armor', ''), '每波+护甲': d.get('armor_increase_each_wave', ''),
            '速度': d.get('speed', ''), '速度抖动': d.get('speed_randomization', ''),
            '攻击CD帧': d.get('attack_cd', ''), '材料价值': d.get('value', ''),
            '击退抗性': d.get('knockback_resistance', ''),
            '金币散布': d.get('gold_spread', ''),
            '可掉消耗品': d.get('can_drop_consumables', ''),
            '必掉消耗品': d.get('always_drop_consumables', ''),
            '掉落率': d.get('base_drop_chance', ''), '掉道具率': d.get('item_drop_chance', ''),
        })
    rows.sort(key=lambda r: r['资源'])
    return rows


def t_waves(proj, loc):
    """一波一行；每波的 group 与 unit 另出两张明细。"""
    waves, groups, units = [], [], []
    for p in proj.by_script(SC_WAVE):
        d = proj.flat(p, depth=3)
        rel = short(p)
        parts = rel.split('/')
        zone = parts[1] if len(parts) > 2 else ''
        wave_no = parts[2] if len(parts) > 3 else ''
        gs = d.get('groups_data') or []
        waves.append({'区域': zone, '波次': wave_no, '资源': rel,
                      '时长秒': d.get('wave_duration', ''),
                      '场上上限': d.get('max_enemies', ''),
                      '刷怪组数': len(gs),
                      '刷怪组': ' / '.join(short(g.get('@路径', '')) if isinstance(g, dict) else short(g)
                                         for g in gs)})
        for g in gs:
            if not isinstance(g, dict):
                continue
            us = g.get('wave_units_data') or []
            groups.append({
                '区域': zone, '波次': wave_no, '组': short(g.get('@路径', '')),
                '出现概率': g.get('spawn_chance', ''), '出现时机秒': g.get('spawn_timing', ''),
                '重复次数': g.get('repeating', ''), '重复间隔': g.get('repeating_interval', ''),
                '间隔递减': g.get('reduce_repeating_interval', ''),
                '最小间隔': g.get('min_repeating_interval', ''),
                '最低难度': g.get('min_difficulty', ''), '最低波次': g.get('min_wave', ''),
                '中立': g.get('is_neutral', ''), 'Boss': g.get('is_boss', ''),
                '兽潮': g.get('is_horde', ''), '沿边缘刷': g.get('spawn_edge_of_map', ''),
                '单位种数': len(us),
            })
            for u in us:
                if not isinstance(u, dict):
                    continue
                units.append({
                    '区域': zone, '波次': wave_no, '组': short(g.get('@路径', '')),
                    '单位': short(u.get('@路径', '')),
                    '类型': UNIT_TYPE.get(u.get('type', 1), u.get('type')),
                    '场景': short(u.get('unit_scene', '')),
                    '最少': u.get('min_number', ''), '最多': u.get('max_number', ''),
                    '概率': u.get('spawn_chance', ''),
                })
    key = lambda r: (r['区域'], r['波次'])
    waves.sort(key=key)
    groups.sort(key=key)
    units.sort(key=key)
    return waves, groups, units


def t_sets(proj, loc):
    rows = []
    for p in proj.by_script(SC_SET):
        d = proj.flat(p, depth=2)
        bonuses = d.get('set_bonuses') or []
        for i, tier in enumerate(bonuses):
            if not tier:
                continue
            rows.append({
                'id': d.get('my_id', ''), '中文名': loc.name(d.get('name', '')),
                '英文名': loc.t(d.get('name', ''), 'en'),
                '件数': i + 2,
                '效果(中)': eff_brief(loc, tier, 'zh'),
                '效果(英)': eff_brief(loc, tier, 'en'),
                '效果原始': eff_raw(tier),
                '出处': short(p),
            })
    rows.sort(key=lambda r: (str(r['id']), r['件数']))
    return rows


def t_upgrades(proj, loc):
    rows = []
    for p in proj.by_script(SC_UPGRADE):
        d = proj.flat(p, depth=2)
        rows.append({
            'id': d.get('my_id', ''), '升级id': d.get('upgrade_id', ''),
            '中文名': loc.name(d.get('name', '')), '英文名': loc.t(d.get('name', ''), 'en'),
            '稀有度': TIER.get(d.get('tier', 0), d.get('tier')),
            '默认解锁': d.get('unlocked_by_default', ''),
            '效果(中)': eff_brief(loc, d.get('effects'), 'zh'),
            '效果原始': eff_raw(d.get('effects')),
            '出处': short(p),
        })
    rows.sort(key=lambda r: (str(r['稀有度']), str(r['id'])))
    return rows


def t_challenges(proj, loc):
    rows = []
    for p in proj.by_script(SC_CHALLENGE):
        d = proj.flat(p, depth=2)
        rw = d.get('reward')
        rows.append({
            'id': d.get('my_id', ''),
            '标题key': d.get('name', ''), '中文标题': loc.name(d.get('name', '')),
            '英文标题': loc.t(d.get('name', ''), 'en'),
            '描述key': d.get('description', ''),
            '中文描述': loc.name(d.get('description', '')),
            '英文描述': loc.t(d.get('description', ''), 'en'),
            '统计项': d.get('stat', ''), '阈值(number)': d.get('number', ''),
            '数值(value)': d.get('value', ''),
            '奖励类型': REWARD.get(d.get('reward_type', 0), d.get('reward_type')),
            '奖励': (rw.get('my_id') or rw.get('name')) if isinstance(rw, dict) else short(rw or ''),
            '附加参数': ' / '.join(str(x) for x in (d.get('additional_args') or [])),
            '出处': short(p),
        })
    rows.sort(key=lambda r: str(r['id']))
    return rows


def t_difficulties(proj, loc):
    rows = []
    for p in proj.by_script(SC_DIFF):
        d = proj.flat(p, depth=2)
        rows.append({
            'id': d.get('my_id', ''),
            '中文名': loc.name(d.get('name', '')).replace('{0}', str(d.get('value', ''))),
            '英文名': loc.t(d.get('name', ''), 'en').replace('{0}', str(d.get('value', ''))),
            '难度值': d.get('value', ''), '稀有度槽': d.get('tier', ''),
            '默认解锁': d.get('unlocked_by_default', ''),
            '效果(中)': eff_brief(loc, d.get('effects'), 'zh'),
            '效果原始': eff_raw(d.get('effects')),
            '出处': short(p),
        })
    rows.sort(key=lambda r: str(r['难度值']))
    return rows


def t_consumables(proj, loc):
    rows = []
    for p in proj.by_script(SC_CONSUM):
        d = proj.flat(p, depth=2)
        rows.append({
            'id': d.get('my_id', ''), '中文名': loc.name(d.get('name', '')),
            '英文名': loc.t(d.get('name', ''), 'en'),
            '稀有度': TIER.get(d.get('tier', 0), d.get('tier')), '价值': d.get('value', ''),
            '效果(中)': eff_brief(loc, d.get('effects'), 'zh'),
            '效果原始': eff_raw(d.get('effects')), '出处': short(p),
        })
    return sorted(rows, key=lambda r: str(r['id']))


def t_effects(proj, loc):
    """708 条 effect.tres 的全量清单——做效果归因时查这张。"""
    rows = []
    for p, t in sorted(proj.files.items()):
        sc = t.script
        if not sc.startswith(S + 'effects/') and sc != S + 'items/global/effect.gd':
            continue
        d = proj.flat(p, depth=1)
        extra = {k: v for k, v in d.items()
                 if k not in ('@路径', '@脚本', 'key', 'text_key', 'value', 'custom_key',
                              'storage_method', 'effect_sign', 'custom_args')}
        rows.append({
            '资源': short(p), '效果类': os.path.basename(sc)[:-3],
            'key': d.get('key', ''), '数值': d.get('value', ''),
            '文本key': d.get('text_key', ''), '自定义key': d.get('custom_key', ''),
            '存储方式': STORAGE.get(d.get('storage_method', 0), d.get('storage_method')),
            '正负号': SIGN.get(d.get('effect_sign', 3), d.get('effect_sign')),
            '中文描述': loc.effect_text(d, 'zh'), '英文描述': loc.effect_text(d, 'en'),
            '额外字段': ' / '.join('%s=%s' % (k, v) for k, v in sorted(extra.items())
                                 if not isinstance(v, (list, dict))),
        })
    return rows


def t_stats(proj, loc):
    rows = []
    for p in proj.by_script(SC_STATDEF):
        d = proj.flat(p, depth=1)
        key = d.get('stat_name', '')
        rows.append({'属性key': key, '中文名': loc.t(key.upper(), 'zh'),
                     '英文名': loc.t(key.upper(), 'en'), '出处': short(p)})
    return sorted(rows, key=lambda r: r['属性key'])


def t_zones(proj, loc):
    rows = []
    for p in proj.by_script(SC_ZONE):
        d = proj.flat(p, depth=1)
        rows.append({'id': d.get('my_id', ''), '中文名': loc.name(d.get('name', '')),
                     '英文名': loc.t(d.get('name', ''), 'en'),
                     '宽': d.get('width', ''), '高': d.get('height', ''),
                     '默认解锁': d.get('unlocked_by_default', ''),
                     '波次数': len(d.get('waves_data') or []), '出处': short(p)})
    return sorted(rows, key=lambda r: str(r['id']))


# ---------------------------------------------------------------- 主流程
TABLES = [
    ('_道具总表', t_items), ('_角色总表', t_characters), ('_武器总表', t_weapons),
    ('_敌人总表', t_enemies), ('_套装总表', t_sets), ('_升级总表', t_upgrades),
    ('_挑战总表', t_challenges), ('_难度总表', t_difficulties),
    ('_消耗品总表', t_consumables), ('_效果总表', t_effects),
    ('_属性总表', t_stats), ('_区域总表', t_zones),
]


def run(res_dir, text_dir, out_dir):
    setup_stdout()
    proj = Project(res_dir)
    print('载入 %d 个文本资源' % len(proj.files))
    loc = Loc(text_dir, os.path.join(os.path.dirname(res_dir), '源码',
                                     'singletons', 'text.gd'))
    loc.load_sets(proj)
    csv_dir = os.path.join(out_dir, '配置CSV')
    json_dir = os.path.join(out_dir, '配置JSON')
    ensure(csv_dir)
    ensure(json_dir)
    summary = []
    for name, fn in TABLES:
        rows = fn(proj, loc)
        write_dict_csv(os.path.join(csv_dir, name + '.csv'), rows)
        write_json(os.path.join(json_dir, name + '.json'), rows)
        summary.append([name, len(rows)])
        print('  %-12s %d 行' % (name, len(rows)))
    waves, groups, units = t_waves(proj, loc)
    for name, rows in (('_波次总表', waves), ('_波次刷怪组', groups), ('_波次单位', units)):
        write_dict_csv(os.path.join(csv_dir, name + '.csv'), rows)
        write_json(os.path.join(json_dir, name + '.json'), rows)
        summary.append([name, len(rows)])
        print('  %-12s %d 行' % (name, len(rows)))
    write_csv(os.path.join(out_dir, '_总表清单.csv'), ['总表', '行数'], sorted(summary))
    return summary


def main(argv):
    res = argv[0] if len(argv) > 0 else os.path.join(ROOT, '资源')
    txt = argv[1] if len(argv) > 1 else os.path.join(ROOT, '文本')
    out = argv[2] if len(argv) > 2 else os.path.join(ROOT, '配置')
    run(res, txt, out)


if __name__ == '__main__':
    main(sys.argv[1:])
