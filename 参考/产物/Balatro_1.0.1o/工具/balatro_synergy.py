# -*- coding: utf-8 -*-
"""Balatro 小丑流派聚类与倍增关系:把 150 张小丑按「靠什么条件触发」分流派,
再按「谁把谁的收益乘上去」生成倍增关系边表。

和别的脚本不同,这份里有**人工判断**:流派标签与资源产销表是照着
_小丑总表.csv 的描述逐张读出来的,不是纯正则能得出的结论,所以全部集中在
TAGS / AXIS / PRODUCE / CONSUME 四张表里,改判断只动那四张表。

边表是**推导出来的**,不是手写的。定向边(一对一,具体):
  R 重复触发   RETRIGGER 的 scope × PERCARD_KEY 的计分键求交集 —— 碰不上的不算边,
               所以「喜与悲 × 斐波那契」(人头牌 vs A2358)这种假组合不会出现
  P 产销       PRODUCE 的产出资源 × CONSUME 的消耗资源
  P 外部燃料   塔罗/幽灵总表实读的产出 × CONSUME —— 强化牌与蜡封不在小丑池里
  O 概率翻倍   六六大顺 × 所有写明几率的卡(含自毁类的反效果)
通用边(源是跟谁都能配的枢纽,单独看才有意义):
  C 复制       copy 标签 × 全部 X倍率卡
  E 使能器     ENABLER_OPENS 的 opens 集合 × 对应流派
另有 INSURANCE 一类不进边表:它们不放大收益,只防构筑被 Boss 掐断。

产出:
  配置/配置CSV/_小丑流派表.csv     150 行,一行一张,带流派/轴/产销标签
  配置/配置CSV/_小丑倍增关系.csv   边表,一行一条关系,带覆盖程度

用法: python balatro_synergy.py
"""
import csv
import io
import os
import sys
from collections import Counter, defaultdict

if hasattr(sys.stdout, 'reconfigure'):   # Windows 控制台默认 GBK
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSVDIR = os.path.join(ROOT, '配置', '配置CSV')

# ---------------------------------------------------------------- 流派标签
# key: 中文名 -> 标签集合。标签含义见 LABELS。一张可挂多个。
LABELS = {
    'suit':      '花色流',
    'hand':      '牌型流',
    'rank':      '点数流',
    'face':      '人头牌流',
    'enh':       '强化牌流',
    'discard':   '弃牌流',
    'held':      '手牌保留流',
    'econ':      '经济流',
    'consum':    '消耗品流',
    'decksize':  '牌组体积流',
    'selfgrow':  '自增成长型',
    'retrigger': '重复触发源',
    'copy':      '复制源',
    'enabler':   '使能器',
    'percard':   '逐张计分',      # 会被重复触发放大的那一类
    'slot':      '槽位规则',
}

TAGS = {
    '小丑': ['hand'], '贪婪小丑': ['suit', 'percard'], '色欲小丑': ['suit', 'percard'],
    '愤怒小丑': ['suit', 'percard'], '暴食小丑': ['suit', 'percard'],
    '开心小丑': ['hand'], '古怪小丑': ['hand'], '疯狂小丑': ['hand'],
    '狂野小丑': ['hand'], '滑稽小丑': ['hand'], '奸诈小丑': ['hand'],
    '狡猾小丑': ['hand'], '聪敏小丑': ['hand'], '阴险小丑': ['hand'],
    '精明小丑': ['hand'], '半张小丑': ['hand'],
    '模具小丑': ['slot'], '四指': ['enabler'], '哑剧演员': ['retrigger', 'held'],
    '信用卡': ['econ'], '仪式匕首': ['selfgrow'], '旗帜': ['discard'],
    '神秘之峰': ['discard'], '大理石小丑': ['enh', 'decksize'], '积分卡': ['selfgrow'],
    '八号球': ['rank', 'consum'], '印错小丑': ['slot'], '黄昏': ['retrigger'],
    '致胜之拳': ['held'], '混沌小丑': ['econ'], '斐波那契': ['rank', 'percard'],
    '钢铁小丑': ['enh'], '恐怖面孔': ['face', 'percard'], '抽象小丑': ['slot'],
    '延迟满足': ['discard', 'econ'], '烂脱口秀演员': ['retrigger', 'rank'],
    '幻视': ['enabler'], '大麦克香蕉': ['selfgrow'], '偶数史蒂文': ['rank', 'percard'],
    '奇数托德': ['rank', 'percard'], '学者': ['rank', 'percard'], '名片': ['face', 'econ'],
    '超新星': ['hand', 'selfgrow'], '搭乘巴士': ['face', 'selfgrow'],
    '太空小丑': ['hand', 'consum'], '鸡蛋': ['econ'], '窃贼': ['discard'],
    '黑板': ['suit', 'held'], '跑步选手': ['hand', 'selfgrow'], '冰淇淋': ['selfgrow'],
    'DNA': ['decksize'], '飞溅': ['enabler'], '蓝色小丑': ['decksize'],
    '第六感': ['rank', 'consum'], '星座': ['consum', 'selfgrow'],
    '徒步者': ['percard', 'selfgrow'], '无面小丑': ['face', 'discard', 'econ'],
    '绿色小丑': ['selfgrow'], '叠加态': ['rank', 'hand', 'consum'],
    '待办清单': ['hand', 'econ'], '卡文迪什': ['hand'], '老千小丑': ['hand'],
    '红牌': ['selfgrow'], '疯狂': ['selfgrow'], '方形小丑': ['hand', 'selfgrow'],
    '通灵': ['hand', 'consum'], '乌合之众': ['slot'], '吸血鬼': ['enh', 'selfgrow'],
    '捷径': ['enabler'], '全息影像': ['decksize', 'selfgrow'], '流浪者': ['econ', 'consum'],
    '男爵': ['rank', 'held'], '9霄云外': ['rank', 'econ'], '火箭': ['econ'],
    '方尖石塔': ['hand', 'selfgrow'], '迈达斯面具': ['face', 'enh'], '摔跤手': ['enabler'],
    '照片': ['face'], '礼品卡': ['econ'], '黑龟豆': ['held'], '侵蚀': ['decksize'],
    '私人车位': ['face', 'held', 'econ'], '邮件回扣': ['rank', 'discard', 'econ'],
    '冲向月球': ['econ'], '幻觉': ['consum'], '占卜师': ['consum', 'selfgrow'],
    '杂耍师': ['held'], '醉汉': ['discard'], '石头小丑': ['enh'], '黄金小丑': ['econ'],
    '招财猫': ['enh', 'selfgrow'], '棒球卡': ['slot'], '斗牛': ['econ'],
    '零糖可乐': ['econ'], '交易卡': ['discard', 'econ'], '闪示卡': ['econ', 'selfgrow'],
    '爆米花': ['selfgrow'], '备用裤子': ['hand', 'selfgrow'], '古老小丑': ['suit', 'percard'],
    '拉面': ['discard'], '对讲机': ['rank', 'percard'], '苏打水': ['retrigger'],
    '城堡': ['suit', 'discard', 'selfgrow'], '微笑表情': ['face', 'percard'],
    '篝火': ['selfgrow'], '黄金门票': ['enh', 'econ'], '骷髅先生': ['slot'],
    '杂技演员': ['hand'], '喜与悲': ['retrigger', 'face'], '侠盗': ['slot', 'econ'],
    '游吟诗人': ['held'], '证书': ['enh'], '模糊小丑': ['enabler'], '回溯': ['selfgrow'],
    '未断选票': ['retrigger'], '璞玉': ['suit', 'percard', 'econ'],
    '血石': ['suit', 'percard'], '箭头': ['suit', 'percard'], '缟玛瑙': ['suit', 'percard'],
    '玻璃小丑': ['enh', 'selfgrow'], '马戏团长': ['enabler', 'consum'],
    '花盆': ['suit'], '蓝图': ['copy'], '小小丑': ['rank', 'percard', 'selfgrow'],
    '快乐安迪': ['discard', 'held'], '六六大顺': ['enabler'], '偶像': ['suit', 'rank', 'percard'],
    '重影': ['suit'], '斗牛士': ['econ'], '上路吧杰克': ['rank', 'discard', 'selfgrow'],
    '二重奏': ['hand'], '三重奏': ['hand'], '一家人': ['hand'], '秩序': ['hand'],
    '部落': ['hand'], '特技演员': ['held'], '隐形小丑': ['copy'], '头脑风暴': ['copy'],
    '射月': ['rank', 'held'], '驾驶执照': ['enh'], '卡牌术士': ['consum'],
    '天文学家': ['consum', 'econ'], '烧焦小丑': ['hand', 'discard'], '提靴带': ['econ'],
    '卡尼奥': ['face', 'selfgrow'], '特里布莱': ['rank', 'face', 'percard'],
    '约里克': ['discard', 'selfgrow'], '希科': ['enabler'], '帕奇欧': ['copy', 'consum'],
    '卫星': ['consum', 'econ'],
}

# 计分轴:这张卡把收益加在公式的哪一项上
AXIS = {
    'chips': '轴A 筹码(加法)', 'mult': '轴B 倍率(加法)', 'xmult': '轴C X倍率(乘法)',
    'money': '经济', 'util': '功能/规则',
}
XMULT = set("""模具小丑 积分卡 钢铁小丑 黑板 星座 卡文迪什 老千小丑 疯狂 吸血鬼 全息影像 男爵
方尖石塔 照片 招财猫 棒球卡 古老小丑 拉面 篝火 杂技演员 回溯 血石 玻璃小丑 花盆 偶像 重影
上路吧杰克 二重奏 三重奏 一家人 秩序 部落 驾驶执照 卡尼奥 特里布莱 约里克""".split())
CHIPS = set("""奸诈小丑 狡猾小丑 聪敏小丑 阴险小丑 精明小丑 旗帜 恐怖面孔 跑步选手 冰淇淋 蓝色小丑
徒步者 方形小丑 奇数托德 石头小丑 斗牛 箭头 小小丑 特技演员 城堡""".split())
MONEY = set("""信用卡 延迟满足 名片 鸡蛋 无面小丑 待办清单 9霄云外 火箭 礼品卡 私人车位 邮件回扣
冲向月球 黄金小丑 零糖可乐 交易卡 黄金门票 斗牛士 天文学家 卫星 混沌小丑 流浪者 璞玉""".split())
UTIL = set("""四指 哑剧演员 大理石小丑 八号球 印错小丑 黄昏 抽象小丑 烂脱口秀演员 幻视 太空小丑
窃贼 DNA 飞溅 第六感 叠加态 乌合之众 捷径 迈达斯面具 摔跤手 黑龟豆 杂耍师 醉汉 骷髅先生
喜与悲 侠盗 游吟诗人 证书 模糊小丑 未断选票 马戏团长 蓝图 快乐安迪 六六大顺 隐形小丑 头脑风暴
卡牌术士 烧焦小丑 希科 帕奇欧 苏打水""".split())

# ---------------------------------------------------------------- 资源产销
# 「谁造出了什么」「谁靠什么吃饭」——生产者→消费者的边由这两张表对撞生成
PRODUCE = {
    '大理石小丑': ['石头牌'], '迈达斯面具': ['黄金牌'], '证书': ['蜡封'],
    'DNA': ['牌组张数'], '全息影像': ['牌组张数'],
    '卡牌术士': ['塔罗牌'], '幻觉': ['塔罗牌'], '八号球': ['塔罗牌'],
    '叠加态': ['塔罗牌'], '流浪者': ['塔罗牌'],
    '第六感': ['幽灵牌'], '通灵': ['幽灵牌'],
    '太空小丑': ['牌型等级'], '烧焦小丑': ['牌型等级'],
    '帕奇欧': ['消耗牌'], '天文学家': ['星球牌'],
}
CONSUME = {
    '石头小丑': ['石头牌'], '黄金门票': ['黄金牌'], '蓝色小丑': ['牌组张数'],
    '侵蚀': ['牌组张数(反向)'], '占卜师': ['塔罗牌'], '星座': ['星球牌'],
    '卫星': ['星球牌'], '超新星': ['牌型等级'], '钢铁小丑': ['钢铁牌'],
    '玻璃小丑': ['玻璃牌'], '招财猫': ['幸运牌'], '驾驶执照': ['强化牌'],
    '吸血鬼': ['强化牌'], '哑剧演员': ['手牌保留效果'], '男爵': ['手牌保留效果'],
    '射月': ['手牌保留效果'], '黑板': ['手牌保留效果'],
}

# 使能器打开的是哪些流派的触发面
ENABLER_OPENS = {
    '幻视':   (['face'], '所有牌视为人头牌,人头牌流从「看运气摸到」变成每张都触发'),
    '飞溅':   (['percard'], '所有打出的牌都计分,逐张计分类的触发张数从 2~3 拉满到 5'),
    '四指':   (['hand', 'suit'], '同花/顺子只要 4 张,同花与顺子系的触发率大涨'),
    '捷径':   (['hand'], '顺子可隔 1 点,顺子系的触发率大涨'),
    '模糊小丑': (['suit'], '红桃=方片、黑桃=梅花,同花系的触发率大涨'),
    '马戏团长': (['consum'], '消耗品可同时出现复数张,消耗品流的吞吐翻倍'),
}
# 不是倍增,是保险:它们不放大收益,只是防止构筑被 Boss 整个掐断。单独列,不进边表。
INSURANCE = {
    '希科': '所有 Boss 限制消失——条件流的通用保险',
    '摔跤手': '卖掉即解除当前回合 Boss 限制——一次性版的希科',
    '骷髅先生': '差 25% 以内不判负——分数不够时的兜底',
}

# 反协同:同时装会互相拆台。这几条不是产销表能推出来的(冲突点在「消耗」这个动作本身,
# 不在产出资源上),所以单列。
ANTI = [
    ('吸血鬼', '钢铁小丑', '吸血鬼每吃一张强化牌就移除其强化,钢铁小丑吃的正是钢铁牌存量'),
    ('吸血鬼', '玻璃小丑', '同上,吸血鬼会把玻璃牌的强化吃掉'),
    ('吸血鬼', '招财猫', '同上,幸运牌被吃掉就不再触发'),
    ('吸血鬼', '驾驶执照', '驾驶执照要牌组里 ≥16 张强化牌,吸血鬼在反向拆'),
    ('DNA', '侵蚀', 'DNA 往牌组加牌,侵蚀靠牌少吃饭'),
    ('全息影像', '侵蚀', '同上'),
    ('模糊小丑', '花盆', '花盆要四种花色各一张,模糊小丑把四色并成两色'),
    ('六六大顺', '大麦克香蕉', '自毁几率 1/6 -> 1/3'),
    ('六六大顺', '卡文迪什', '自毁几率 1/1000 -> 1/500'),
    ('模具小丑', '(任何满槽构筑)', '模具小丑按空槽算 X 倍率,装满小丑等于把它废掉'),
]

# 外部燃料:强化牌与蜡封根本不在小丑池里,由塔罗/幽灵牌产出。
# 产出方从 _塔罗总表.csv 的「转换目标」列与 _幽灵总表.csv 的描述实读,不写死。
MOD_NAME = {'m_lucky': '幸运牌', 'm_mult': '倍率牌', 'm_bonus': '奖励牌', 'm_wild': '万能牌',
            'm_steel': '钢铁牌', 'm_glass': '玻璃牌', 'm_gold': '黄金牌', 'm_stone': '石头牌'}
SEAL_KW = [('红色蜡封', '红蜡封'), ('金色蜡封', '金蜡封'), ('蓝色蜡封', '蓝蜡封'), ('紫色蜡封', '紫蜡封')]
# 重复触发源的**作用面**。这是这份脚本里最要紧的一张表:
# 六个重复触发源的覆盖范围完全不同,不区分就会把「喜与悲 × 斐波那契」这种
# 根本碰不上的组合也算成倍增。scope 的取值见 covered()。
RETRIGGER = {
    '黄昏':     ('played_all',  '每回合最后一次出牌,全部打出的牌各多触发 1 次'),
    '苏打水':    ('played_all',  '接下来 10 次出牌,全部打出的牌各多触发 1 次'),
    '未断选票':   ('played_first', '只作用于第一张计分牌,额外触发 2 次'),
    '喜与悲':    ('face',        '只作用于打出的人头牌'),
    '烂脱口秀演员': ('rank2345',    '只作用于打出的 2/3/4/5'),
    '哑剧演员':   ('held',        '作用于留在手牌中的牌,和「打出的牌」是两批'),
}
# 逐张计分类小丑的**计分键**:它按什么挑牌。用来和上面的 scope 求交集。
PERCARD_KEY = {
    '贪婪小丑': 'suit', '色欲小丑': 'suit', '愤怒小丑': 'suit', '暴食小丑': 'suit',
    '箭头': 'suit', '缟玛瑙': 'suit', '血石': 'suit', '璞玉': 'suit',
    '偶像': 'suit', '古老小丑': 'suit',
    '恐怖面孔': 'face', '微笑表情': 'face', '特里布莱': 'face',
    '斐波那契': set('A 2 3 5 8'.split()), '偶数史蒂文': set('2 4 6 8 10'.split()),
    '奇数托德': set('A 3 5 7 9'.split()), '对讲机': set('4 10'.split()),
    '小小丑': {'2'}, '学者': {'A'}, '徒步者': 'any',
}
# 手牌保留流里真正「逐张手牌结算」的那几张——哑剧演员只对这批有效。
# 杂耍师/黑龟豆/游吟诗人/特技演员/快乐安迪 改的是手牌上限,黑板是整手条件,都不被重复触发。
HELD_PERCARD = {'男爵': '手牌里每张 K 给 X1.5', '射月': '手牌里每张 Q 给 +13 倍率',
                '致胜之拳': '手牌里最小牌点数 ×2 加进倍率', '私人车位': '手牌里每张人头牌 1/2 给 $1'}
FACE_RANKS = {'J', 'Q', 'K'}
R2345 = set('2 3 4 5'.split())


def covered(scope, key):
    """重复触发源的 scope 打不打得到某张逐张计分卡。返回 (能否, 覆盖程度)。"""
    if scope == 'played_all':
        return True, '全量'
    if scope == 'played_first':
        return True, '仅首张'
    if scope == 'held':
        return False, ''          # 手牌区,和打出的牌不是一批
    if scope == 'face':
        if key == 'face':
            return True, '全量'
        if key in ('suit', 'any'):
            return True, '子集(只有人头牌那几张)'
        return (False, '') if not (key & FACE_RANKS) else (True, '子集')
    if scope == 'rank2345':
        if key == 'face':
            return False, ''      # 人头牌是 J/Q/K,和 2~5 没有交集
        if key in ('suit', 'any'):
            return True, '子集(只有 2~5 那几张)'
        return (True, '子集') if (key & R2345) else (False, '')
    return False, ''


# 带「几率」的卡,六六大顺直接把它们的期望翻倍(含自毁类的反效果)
ODDS_CARDS = {
    '血石': '1/2 给 X1.5 -> 必定触发', '招财猫': '幸运牌触发率翻倍',
    '八号球': '1/4 生成塔罗 -> 1/2', '名片': '1/2 给 $2 -> 必定',
    '私人车位': '1/2 给 $1 -> 必定', '太空小丑': '1/4 升级牌型 -> 1/2',
    '幻觉': '开包生成塔罗的几率翻倍',
    '大麦克香蕉': '⚠ 1/6 自毁 -> 1/3,反效果', '卡文迪什': '⚠ 1/1000 自毁 -> 1/500,反效果',
}


def axis_of(name):
    if name in XMULT:
        return 'xmult'
    if name in CHIPS:
        return 'chips'
    if name in MONEY:
        return 'money'
    if name in UTIL:
        return 'util'
    return 'mult'


def load_csv(fn):
    with io.open(os.path.join(CSVDIR, fn), encoding='utf-8-sig') as f:
        return list(csv.DictReader(f))


def external_producers():
    """从塔罗/幽灵总表实读:谁产出强化牌与蜡封。返回 [(牌名, 类别, 产出资源)]。"""
    out = []
    for r in load_csv('_塔罗总表.csv'):
        tgt = (r.get('转换目标') or '').strip()
        if tgt in MOD_NAME:
            out.append((r['中文名'], '塔罗', MOD_NAME[tgt]))
    for r in load_csv('_幽灵总表.csv'):
        d = r['中文描述'] or ''
        for kw, res in SEAL_KW:
            if kw in d:
                out.append((r['中文名'], '幽灵', res))
    return out


def build_edges(rows):
    """按机制推导倍增关系边。返回 (机制, 源, 目标, 说明) 列表。

    机制分「定向」与「通用」两类:定向边是具体的一对一(产销、重复触发、概率),
    通用边的源是那几张跟谁都能配的枢纽卡(复制、使能器),单独看才有意义。
    """
    by_tag = defaultdict(list)
    name_of = {}
    for r in rows:
        n = r['中文名']
        name_of[n] = r
        for t in TAGS.get(n, []):
            by_tag[t].append(n)

    edges = []
    # R 重复触发 × 逐张计分:按各自的作用面求交集,碰不上的不算边
    for src, (scope, why) in RETRIGGER.items():
        if scope == 'held':      # 哑剧演员只对「逐张手牌结算」的卡有效
            for dst, what in HELD_PERCARD.items():
                if src != dst:
                    edges.append(('R 重复触发', src, dst, '%s|全量(%s)' % (why, what)))
            continue
        for dst, key in PERCARD_KEY.items():
            ok, degree = covered(scope, key)
            if ok and src != dst:
                edges.append(('R 重复触发', src, dst, '%s|覆盖 %s' % (why, degree)))
    # P 生产者 → 消费者(定向)。先小丑内部,再接外部燃料
    for src, outs in PRODUCE.items():
        for dst, ins in CONSUME.items():
            hit = set(outs) & set(x.replace('(反向)', '') for x in ins)
            if hit and src != dst:
                rev = any('(反向)' in x for x in ins)
                edges.append(('P 产销' if not rev else 'P 产销(反向)', src, dst,
                              ('%s 产出%s,%s 直接吃这个存量' % (src, '/'.join(hit), dst)) if not rev
                              else ('⚠ %s 产出%s,反而削弱 %s' % (src, '/'.join(hit), dst))))
    for pname, kind, res in external_producers():
        for dst, ins in CONSUME.items():
            if res in ins or (res in ('钢铁牌', '玻璃牌', '黄金牌', '石头牌', '幸运牌',
                                      '倍率牌', '奖励牌', '万能牌') and '强化牌' in ins):
                edges.append(('P 外部燃料', '%s(%s)' % (pname, kind), dst,
                              '%s 不在小丑池里,%s 的燃料只能靠它产出' % (res, dst)))
    # A 反协同(定向,负向)
    for src, dst, why in ANTI:
        edges.append(('A 反协同', src, dst, '⚠ ' + why))
    # O 概率翻倍(定向)
    for dst, why in ODDS_CARDS.items():
        edges.append(('O 概率翻倍', '六六大顺', dst, why))
    # C 复制 × X倍率(通用枢纽)
    for src in by_tag['copy']:
        for dst in sorted(XMULT):
            if dst in name_of and src != dst:
                edges.append(('C 复制(通用)', src, dst,
                              '%s 复制 %s,X 倍率直接进 Π 项再乘一次' % (src, dst)))
    # E 使能器 × 条件卡(通用枢纽)
    for src, (opens, why) in ENABLER_OPENS.items():
        for t in opens:
            for dst in by_tag[t]:
                if src == dst:
                    continue
                edges.append(('E 使能器(通用)', src, dst, why))
    return edges


DIRECTED = ('R 重复触发', 'P 产销', 'P 产销(反向)', 'P 外部燃料', 'O 概率翻倍', 'A 反协同')


def main():
    rows = load_csv('_小丑总表.csv')
    missing = [r['中文名'] for r in rows if r['中文名'] not in TAGS]
    if missing:
        print('⚠ 未打标签:', missing)
    tagged = {k for k, v in TAGS.items() if 'percard' in v}
    if tagged != set(PERCARD_KEY):
        print('⚠ percard 标签与 PERCARD_KEY 对不上 —— 两边都要改:')
        print('   只在 PERCARD_KEY:', set(PERCARD_KEY) - tagged)
        print('   只在 TAGS:', tagged - set(PERCARD_KEY))

    # ---- 产物 1:流派表 ----
    out1 = os.path.join(CSVDIR, '_小丑流派表.csv')
    with io.open(out1, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        w.writerow(['key', '中文名', '稀有度', '售价', '流派', '流派标签', '计分轴',
                    '产出资源', '消耗资源', '中文描述'])
        for r in rows:
            n = r['中文名']
            tg = TAGS.get(n, [])
            w.writerow([r['key'], n, r['稀有度'], r['售价'],
                        '/'.join(LABELS[t] for t in tg), '/'.join(tg),
                        AXIS[axis_of(n)], '/'.join(PRODUCE.get(n, [])),
                        '/'.join(CONSUME.get(n, [])), r['中文描述']])

    # ---- 产物 2:倍增关系边表 ----
    edges = build_edges(rows)
    out2 = os.path.join(CSVDIR, '_小丑倍增关系.csv')
    with io.open(out2, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        w.writerow(['机制', '源', '目标', '说明'])
        for e in sorted(edges):
            w.writerow(e)

    # ---- 控制台小结 ----
    cnt = Counter(t for n in TAGS for t in TAGS[n])
    print('=== 流派规模(一张可多挂) ===')
    for t, c in cnt.most_common():
        print('  %-9s %-6s %3d' % (t, LABELS[t], c))

    print('\n=== 倍增关系边 %d 条,按机制 ===' % len(edges))
    for m, c in Counter(e[0] for e in edges).most_common():
        print('  %-14s %3d  %s' % (m, c, '定向' if m in DIRECTED else '通用枢纽'))

    dir_edges = [e for e in edges if e[0] in DIRECTED]
    deg = Counter()
    for m, s, d, _ in dir_edges:
        deg[s] += 1
        deg[d] += 1
    print('\n=== 定向倍增网络里连接度最高的 12 个节点 ===')
    for n, c in deg.most_common(12):
        print('  %-14s %3d  [%s]' % (n, c, '/'.join(LABELS[t] for t in TAGS.get(n, [])) or '外部'))

    print('\n=== 通用枢纽(跟谁都能配,单独看) ===')
    for src in sorted(set(e[1] for e in edges if e[0] not in DIRECTED)):
        n = sum(1 for e in edges if e[1] == src and e[0] not in DIRECTED)
        why = ENABLER_OPENS.get(src, (None, 'X 倍率直接进 Π 项再乘一次'))[1]
        print('  %-8s 覆盖 %3d 张  %s' % (src, n, why))

    print('\n=== 保险类(不放大收益,只防被掐断) ===')
    for n, why in INSURANCE.items():
        print('  %-8s %s' % (n, why))

    ext = external_producers()
    print('\n=== 外部燃料:强化牌/蜡封全部由塔罗与幽灵产出,不在小丑池 ===')
    for res in sorted(set(r for _, _, r in ext)):
        who = ['%s(%s)' % (n, k) for n, k, r in ext if r == res]
        print('  %-6s <- %s' % (res, '、'.join(who)))

    print('\n-> %s\n-> %s' % (out1, out2))
    return rows, edges, cnt, deg


if __name__ == '__main__':
    main()
