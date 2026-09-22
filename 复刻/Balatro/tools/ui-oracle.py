#!/usr/bin/env python3
"""UI 布局的外部真值（22 号票）：拿**原作的 Lua 引擎本身**跑 UI 定义，导出每个元素的矩形。

原样加载 `参考/产物/Balatro_1.0.1o/源码/` 里的
engine/object.lua、node.lua、moveable.lua、ui.lua、text.lua、functions/misc_functions.lua、UI_definitions.lua，
只桩掉 LÖVE（`love.graphics.newText`）与几个跟布局无关的全局（控制器、实例表）。

字体度量两边用同一个模型（逐字前进宽度 × 200/1024 按 FreeType 逢半进一、行高 200），
所以这组向量验的是**布局算法**，不是字体。字体本身另有 Pillow 的交叉验证（见 src/ui/font.ts）。

    python tools/ui-oracle.py        # 写 src/ui/oracle.generated.json

依赖：lupa（带 LuaJIT 2.1）。与 参考/产物/Balatro_1.0.1o/工具/ 里那套流水线用的是同一个包。
"""
import json
import pathlib

from lupa import luajit21

ROOT = pathlib.Path(__file__).resolve().parents[3]
SRC = ROOT / '参考/产物/Balatro_1.0.1o/源码'
FONT = pathlib.Path(__file__).resolve().parents[1] / 'public/assets/fonts/m6x11plus.ttf'
OUT = pathlib.Path(__file__).resolve().parents[1] / 'src/ui/oracle.generated.json'


def advances():
    from fontTools.ttLib import TTFont
    f = TTFont(str(FONT))
    hm = f['hmtx']
    return {c: hm[g][0] for c, g in f.getBestCmap().items()}, f['head'].unitsPerEm


def dictionary():
    lua = luajit21.LuaRuntime(unpack_returned_tuples=True)
    loc = lua.execute((SRC.parent / '本地化/en-us.lua').read_text(encoding='utf-8'))
    d = loc['misc']['dictionary']
    return {k: v for k, v in d.items() if isinstance(v, str)}


PRELUDE = r'''
love = { graphics = { newText = function() return {} end } }
G = {
  TILESIZE = 20, TILESCALE = 3.65, ID = 1,
  MOVEABLES = {}, I = setmetatable({}, {__index = function(t, k) t[k] = {}; return t[k] end}),
  SETTINGS = { paused = false, GRAPHICS = { shadows = 'On' }, reduced_motion = false },
  TIMERS = { REAL = 0, TOTAL = 0 },
  exp_times = { xy = 0, scale = 0, r = 0, max_vel = 1000 },
  FUNCS = setmetatable({}, {__index = function() return function() end end}),
  CONTROLLER = { add_to_registry = function() end, snap_to = function() end },
  UIT = { T=1, B=2, C=3, R=4, O=5, ROOT=7, S=8, I=9, padding = 0 },
  F_GUIDE = false,
  STAGE = 1, STAGE_OBJECT_INTERRUPT = true, FRAMES = { DRAW = 0, MOVE = 0 }, ARGS = {},
}
'''

COLOURS = r'''
G.C = {
  BLUE = HEX("009dff"), RED = HEX('FE5F55'), MONEY = HEX('f3b958'), IMPORTANT = HEX("ff9a00"),
  ORANGE = HEX("fda200"), WHITE = {1,1,1,1}, CLEAR = {0,0,0,0}, BLACK = HEX("374244"), JOKER_GREY = HEX('bfc7d5'),
  DYN_UI = { MAIN = HEX('374244'), DARK = HEX('374244'), BOSS_MAIN = HEX('374244'), BOSS_DARK = HEX('374244'), BOSS_PALE = HEX('374244') },
  UI = { TEXT_LIGHT = {1,1,1,1}, BACKGROUND_DARK = HEX("7A9E9F"), OUTLINE_LIGHT = HEX("D8D8D8"), TRANSPARENT_DARK = HEX("22222222") },
}
G.C.UI_CHIPS = copy_table(G.C.BLUE)
G.C.UI_MULT = copy_table(G.C.RED)
'''


def make_runtime():
    lua = luajit21.LuaRuntime(unpack_returned_tuples=True)
    lua.execute(PRELUDE)
    adv, upem = advances()
    lua_adv = lua.table_from({int(k): v for k, v in adv.items()})
    lua.globals().ADV = lua_adv
    lua.globals().UPEM = upem
    lua.execute(r'''
      local function w(text)
        text = tostring(text)
        local total = 0
        for _, c in utf8.chars(text) do
          local cp = 0
          -- utf8.chars 给的是字节串，这里只处理 ASCII 与两字节序列（HUD 用不到更多）
          local b1, b2 = c:byte(1, 2)
          if #c == 1 then cp = b1 else cp = (b1 % 32) * 64 + (b2 % 64) end
          local a = ADV[cp]
          if a then total = total + math.floor(a * 200 / UPEM + 0.5) end
        end
        return total
      end
      FONT = { getWidth = function(self, text) return w(text) end, getHeight = function() return 200 end }
    ''')
    for f in ['engine/object.lua', 'engine/node.lua', 'engine/moveable.lua', 'engine/ui.lua', 'engine/text.lua',
              'functions/misc_functions.lua', 'functions/UI_definitions.lua']:
        lua.execute((SRC / f).read_text(encoding='utf-8'))
    lua.execute(COLOURS)
    lua.globals().DICT = lua.table_from(dictionary())
    lua.execute(r'''
      local font = { FONT = FONT, TEXT_HEIGHT_SCALE = 0.83, TEXT_OFFSET = {x=10, y=-20}, FONTSCALE = 0.1, squish = 1, render_scale = 200 }
      G.LANG = { font = font }
      G.LANGUAGES = { ['en-us'] = { font = font } }
      localize = function(key) return DICT[key] or 'ERROR' end
      get_stake_sprite = function(_stake, _scale) return Moveable(0, 0, _scale, _scale) end
      G.ROOM = nil
      G.ROOM_ATTACH = Moveable{T = {x = 0, y = 0, w = 21, h = 11.2}}
    ''')
    return lua


DUMP = r'''
function DUMP(box)
  local out = { box = { box.T.x, box.T.y, box.T.w, box.T.h }, elements = {} }
  local function walk(e)
    out.elements[#out.elements + 1] = { e.UIT, e.config.id or '', e.T.x, e.T.y, e.T.w, e.T.h }
    for _, c in ipairs(e.children) do walk(c) end
  end
  walk(box.UIRoot)
  return out
end
'''


def to_py(t):
    if hasattr(t, 'items'):
        keys = list(t.keys())
        if keys and all(isinstance(k, int) for k in keys):
            return [to_py(t[k]) for k in sorted(keys)]
        return {k: to_py(v) for k, v in t.items()}
    return t


def main():
    cases = []

    lua = make_runtime()
    lua.execute(DUMP)
    lua.execute(r'''
      G.GAME = {
        dollars = 4, round = 0, win_ante = 8, chips_text = '0', stake = 1,
        current_round = { hands_left = 4, discards_left = 4,
          current_hand = { handname_text = '', chip_total_text = '', hand_level = '', chip_text = '0', mult_text = '0' } },
        round_resets = { ante = 1 },
      }
      HUD = UIBox{ definition = create_UIBox_HUD(), config = {align = ('cli'), offset = {x = -0.7, y = 0}, major = G.ROOM_ATTACH} }
    ''')
    cases.append({'name': 'hud', **to_py(lua.eval('DUMP(HUD)'))})

    # cardarea.lua:289 的 area_uibox，定义原文照抄；区域位置按 set_screen_positions 算
    lua.execute(r'''
      function AREA_BOX(x, y, w, h, align, count, limit)
        local self = Moveable{T = {x = x, y = y, w = w, h = h}}
        self.config = {card_count = count, card_limit = limit}
        local card_count = {n=G.UIT.R, config={align = align, padding = 0.03, no_fill = true}, nodes={
            {n=G.UIT.B, config={w = 0.1,h=0.1}},
            {n=G.UIT.T, config={ref_table = self.config, ref_value = 'card_count', scale = 0.3, lang = G.LANGUAGES['en-us'], colour = G.C.WHITE}},
            {n=G.UIT.T, config={text = '/', scale = 0.3, lang = G.LANGUAGES['en-us'], colour = G.C.WHITE}},
            {n=G.UIT.T, config={ref_table = self.config, ref_value = 'card_limit', scale = 0.3, lang = G.LANGUAGES['en-us'], colour = G.C.WHITE}},
            {n=G.UIT.B, config={w = 0.1,h=0.1}}
        }}
        return UIBox{
          definition = {n=G.UIT.ROOT, config = {align = 'cm', colour = G.C.CLEAR}, nodes={
            {n=G.UIT.R, config={minw = self.T.w,minh = self.T.h,align = "cm", padding = 0.1, mid = true, r = 0.1, colour = {0,0,0,0.1}, ref_table = self}, nodes={}},
            card_count
          }},
          config = { align = 'cm', offset = {x=0,y=0}, major = self, parent = self}
        }
      end
      local CW, CH = 2.4*35/41, 2.4*47/41
      local hw, hh = 6*CW, 0.95*CH
      local hx, hy = 21 - hw - 3.55, 11.2 - hh
      local jw = 4.9*CW
      AREA_JOKERS = AREA_BOX(hx - 0.1, 0, jw, 0.95*CH, 'cl', 0, 5)
      AREA_CONS = AREA_BOX(hx - 0.1 + jw + 0.8, 0, 2.3*CW, 0.95*CH, 'cr', 0, 2)
      AREA_HAND = AREA_BOX(hx, hy, hw, hh, 'cm', 8, 8)
      AREA_DECK = AREA_BOX(21 - 1.1*CW - 0.5, 11.2 - 0.95*CH, 1.1*CW, 0.95*CH, 'cr', 44, 52)
    ''')
    for name, var in [('area_jokers', 'AREA_JOKERS'), ('area_consumeables', 'AREA_CONS'),
                      ('area_hand', 'AREA_HAND'), ('area_deck', 'AREA_DECK')]:
        cases.append({'name': name, **to_py(lua.eval(f'DUMP({var})'))})

    # game.lua:3408 的 G.buttons：挂在选牌状态（上移 1.9）的 G.hand 下面；移动版、出牌在左
    lua.execute(r'''
      G.F_MOBILE = true
      G.SETTINGS.play_button_pos = 2
      local CW, CH = 2.4*35/41, 2.4*47/41
      local hw, hh = 6*CW, 0.95*CH
      G.hand = Moveable{T = {x = 21 - hw - 3.55, y = 11.2 - hh - 1.9, w = hw, h = hh}}
      BUTTONS = UIBox{ definition = create_UIBox_buttons(), config = {align="bm", offset = {x=0,y=0.3},major = G.hand, bond = 'Weak'} }
    ''')
    cases.append({'name': 'buttons_mobile', **to_py(lua.eval('DUMP(BUTTONS)'))})

    # create_UIBox_HUD_blind：挂在 HUD 的 row_blind 上（game.lua:2617，动画落定后 offset = 0）。
    # G.FUNCS 用 button_callbacks.lua 里的原文；G.GAME.blind 是只带面板所需字段的桩（尺寸 1.5×1.5）
    lua.execute((SRC / 'functions/button_callbacks.lua').read_text(encoding='utf-8'))
    lua.execute(r'''
      G.GAME.probabilities = { normal = 1 }
      G.GAME.modifiers = {}
      function MAKE_HUD_BLIND(name, chips, lines)
        G.GAME.blind = Moveable(0, 0, 1.5, 1.5)
        G.GAME.blind.change_dim = function() end
        G.GAME.blind.name = name
        G.GAME.blind.loc_name = name
        G.GAME.blind.chips = chips
        G.GAME.blind.chip_text = number_format(chips)
        G.GAME.blind.loc_debuff_lines = { lines[1] or '', lines[2] or '' }
        G.GAME.blind.loc_debuff_text = (lines[1] or '')..' '..(lines[2] or '')
        if not lines[1] then G.GAME.blind.loc_debuff_text = '' end
        G.GAME.current_round.dollars_to_be_earned = '$$$'
        return UIBox{ definition = create_UIBox_HUD_blind(),
          config = {major = HUD:get_UIE_by_ID('row_blind'), align = 'cm', offset = {x=0,y=0}, bond = 'Weak'} }
      end
      HUD_BLIND_SMALL = MAKE_HUD_BLIND('Small Blind', 300, {})
      -- 让每帧跑的 func（HUD_blind_debuff 等）跑一遍，就像画第一帧之前那样
      local function run_funcs(e) if e.config.func then G.FUNCS[e.config.func](e) end; for _, c in ipairs(e.children) do run_funcs(c) end end
      run_funcs(HUD_BLIND_SMALL.UIRoot)
      HUD_BLIND_SMALL.UIRoot:initialize_VT()
      HUD_BLIND_HEAD = MAKE_HUD_BLIND('The Head', 600, {'All Heart cards', 'are debuffed'})
      run_funcs(HUD_BLIND_HEAD.UIRoot)
      HUD_BLIND_HEAD.UIRoot:initialize_VT()
    ''')
    cases.append({'name': 'hud_blind_small', **to_py(lua.eval('DUMP(HUD_BLIND_SMALL)'))})
    cases.append({'name': 'hud_blind_head', **to_py(lua.eval('DUMP(HUD_BLIND_HEAD)'))})

    # create_UIBox_blind_select（game.lua:3645）：TESTSEED 开局的选盲注界面，小盲注轮到、大盲与 Boss 待定。
    # 三张卡各是一个嵌套 UIBox（O 节点里装 UIBox），另导出；左侧的「Choose your next Blind」提示框也导出。
    # 桩：盲注表只留三条、动画精灵与标签精灵换成同尺寸的 Moveable、localize 的表形式按原文取描述。
    # 动画落定后的状态：G.blind_select 的 offset 已改成终值、blind_choice_handler 跑过、三张卡按新 offset 重新对齐
    lua.execute(r'''
      G.C.L_BLACK = HEX("4f6367"); G.C.FILTER = HEX('ff9a00'); G.C.GREY = HEX("5f7377"); G.C.CHANCE = HEX("4BC292")
      G.C.GOLD = HEX('eac058')
      G.C.UI.TEXT_INACTIVE = HEX("88888899"); G.C.UI.BACKGROUND_INACTIVE = HEX("666666FF")
      G.C.DYN_UI.BOSS_DARK = HEX('374244')
      G.ANIMATION_ATLAS = { blind_chips = {} }
      G.ASSET_ATLAS = { tags = {} }
      G.P_BLINDS = {
        bl_small = { key = 'bl_small', name = 'Small Blind', mult = 1, dollars = 3, pos = {x=0, y=0} },
        bl_big = { key = 'bl_big', name = 'Big Blind', mult = 1.5, dollars = 4, pos = {x=0, y=1} },
        bl_head = { key = 'bl_head', name = 'The Head', mult = 2, dollars = 5, pos = {x=0, y=7}, boss = {min = 1, max = 10}, boss_colour = HEX('ac9db4') },
      }
      AnimatedSprite = function(x, y, w, h) local s = Moveable(x, y, w, h); s.define_draw_steps = function() end; return s end
      Tag = function(key)
        local tag = { key = key }
        function tag:generate_UI(_size)
          _size = _size or 0.8
          local s = Moveable(0, 0, _size, _size)
          s.config = { tag = self, force_focus = true }
          return {n=G.UIT.C, config={align = "cm", ref_table = self}, nodes={
            {n=G.UIT.O, config={w=_size*1,h=_size*1, colour = G.C.BLUE, object = s, focus_with_object = true}},
          }}, s
        end
        return tag
      end
      pseudoseed = function() return 0 end
      pseudorandom_element = function(t) return t[1] end
      local plain_localize = localize
      local BLIND_TEXT = {
        bl_small = { name = 'Small Blind', text = {} },
        bl_big = { name = 'Big Blind', text = {} },
        bl_head = { name = 'The Head', text = {'All Heart cards', 'are debuffed'} },
      }
      localize = function(args, misc_cat)
        if type(args) ~= 'table' then return plain_localize(args) end
        if args.type == 'raw_descriptions' then return BLIND_TEXT[args.key].text end
        if args.type == 'name_text' then return BLIND_TEXT[args.key].name end
        return 'ERROR'
      end
      G.SETTINGS.tutorial_complete = true
      G.SETTINGS.tutorial_progress = { completed_parts = {} }
      G.GAME.used_vouchers = {}
      G.GAME.hands = { ['High Card'] = { visible = true } }
      G.GAME.current_round.most_played_poker_hand = 'High Card'
      G.GAME.starting_params = { ante_scaling = 1 }
      G.GAME.round_resets.blind_states = { Small = 'Select', Big = 'Upcoming', Boss = 'Upcoming' }
      G.GAME.round_resets.loc_blind_states = { Small = 'Select', Big = 'Upcoming', Boss = 'Upcoming' }
      G.GAME.round_resets.blind_choices = { Small = 'bl_small', Big = 'bl_big', Boss = 'bl_head' }
      G.GAME.round_resets.blind_tags = { Small = 'tag_economy', Big = 'tag_investment' }
      G.GAME.blind_on_deck = nil
      G.ROOM = { T = { x = 0, y = 0, w = 21, h = 11.2 } }
      G.HUD = HUD
      G.E_MANAGER = { add_event = function() end }
      Event = function(t) return t end

      local CW, CH = 2.4*35/41, 2.4*47/41
      local hw, hh = 6*CW, 0.95*CH
      G.hand = Moveable{T = {x = 21 - hw - 3.55, y = 11.2 - hh, w = hw, h = hh}}
      G.jokers = Moveable{T = {x = 21 - hw - 3.55 - 0.1, y = 0, w = 4.9*CW, h = 0.95*CH}}

      G.blind_select = UIBox{ definition = create_UIBox_blind_select(),
        config = {align="bmi", offset = {x=0,y=G.ROOM.T.y + 29}, major = G.hand, bond = 'Weak'} }
      G.blind_select.alignment.offset.y = 0.8-(G.hand.T.y - G.jokers.T.y) + G.blind_select.T.h
      G.blind_select.alignment.offset.x = 0
      local function settle(box)
        box.alignment.prev_type = ''
        box:align_to_major()
        box.T.x = box.role.major.T.x + box.role.offset.x
        box.T.y = box.role.major.T.y + box.role.offset.y
        box.UIRoot:initialize_VT()
      end
      settle(G.blind_select)
      local function run_funcs(e) if e.config.func then G.FUNCS[e.config.func](e) end; for _, c in ipairs(e.children) do run_funcs(c) end end
      for _, k in ipairs({'small', 'big', 'boss'}) do run_funcs(G.blind_select_opts[k].UIRoot) end
      for _, k in ipairs({'small', 'big', 'boss'}) do settle(G.blind_select_opts[k]) end

      G.blind_prompt_box.alignment.offset.y = 0
      settle(G.blind_prompt_box)
    ''')
    cases.append({'name': 'blind_select', **to_py(lua.eval('DUMP(G.blind_select)'))})
    for k in ['small', 'big', 'boss']:
        cases.append({'name': f'blind_choice_{k}', **to_py(lua.eval(f'DUMP(G.blind_select_opts.{k})'))})
    cases.append({'name': 'blind_prompt', **to_py(lua.eval('DUMP(G.blind_prompt_box)'))})
    # 跳过那一格的「SKIPPED」戳（blind_choice_handler：create_UIBox_card_alert，tmi 挂在卡片的 UIBox 上、下移 2.2）
    lua.execute(r'''
      SKIPPED = UIBox{
        definition = create_UIBox_card_alert({text_rot = -0.35, no_bg = true, text = localize('k_skipped_cap'), bump_amount = 1, scale = 0.9, maxw = 3.4}),
        config = { align = 'tmi', offset = {x = 0, y = 2.2}, major = G.blind_select_opts.small, parent = G.blind_select_opts.small } }
    ''')
    cases.append({'name': 'skipped_alert', **to_py(lua.eval('DUMP(SKIPPED)'))})
    # 兑换过 Director's Cut：提示框下面多一个 UIBox_button（Reroll Boss / $10）
    lua.execute(r'''
      G.GAME.used_vouchers = { v_directors_cut = true }
      G.GAME.bankrupt_at = 0
      create_UIBox_blind_select()
      G.blind_prompt_box.alignment.offset.y = 0
      G.blind_prompt_box.alignment.prev_type = ''
      G.blind_prompt_box:align_to_major()
      G.blind_prompt_box.T.x = G.blind_prompt_box.role.major.T.x + G.blind_prompt_box.role.offset.x
      G.blind_prompt_box.T.y = G.blind_prompt_box.role.major.T.y + G.blind_prompt_box.role.offset.y
      G.blind_prompt_box.UIRoot:initialize_VT()
      G.GAME.used_vouchers = {}
    ''')
    cases.append({'name': 'blind_prompt_reroll', **to_py(lua.eval('DUMP(G.blind_prompt_box)'))})

    # 回合结算：create_UIBox_round_evaluation 挂在手牌区下（game.lua:3678，offset 落定在 -7.8），
    # 再用原文 add_round_eval_row 一行行加（common_events.lua 原样加载，事件排队后按序执行、delay 空转）。
    # 第一组是 TESTSEED 第二局的实机局面（盲注 $3、剩 2 手），第二组多一行利息
    lua.execute("package.preload['engine/platform'] = function() return {} end")
    lua.execute((SRC / 'functions/common_events.lua').read_text(encoding='utf-8'))
    lua.execute(r'''
      -- 事件先排队、全部 add_round_eval_row 调完再按序执行：evaluate_round 就是一口气排好整串事件的，
      -- 所以每一行的 width（G.round_eval.T.w - 0.51）取的都是空面板的宽度
      local QUEUE = {}
      G.E_MANAGER = { add_event = function(self, e) QUEUE[#QUEUE + 1] = e end }
      function RUN_QUEUE() local q = QUEUE; QUEUE = {}; for _, e in ipairs(q) do e.func() end end
      delay = function() end
      play_sound = function() end
      check_for_unlock = function() end
      G.VIBRATION = 0
      G.PROFILES = { [1] = { career_stats = { c_round_interest_cap_streak = 0 } } }
      G.SETTINGS.profile = 1
      G.GAME.seeded = true
      G.GAME.interest_amount = 1; G.GAME.interest_cap = 25
      local V = { remaining_hand_money = "Remaining Hands ($#1# each)", interest = "#1# interest per $#2# (#3# max)" }
      local plain = localize
      localize = function(args, misc_cat)
        if type(args) == 'table' and args.type == 'variable' then
          local s = V[args.key]
          for i, v in ipairs(args.vars) do s = s:gsub('#'..i..'#', tostring(v)) end
          return s
        end
        return plain(args, misc_cat)
      end
      G.GAME.blind = Moveable(0, 0, 1.5, 1.5)
      G.GAME.blind.juice_up = function() end
      G.GAME.blind.pos = { x = 0, y = 0 }
      G.GAME.blind.chips = 300
      G.GAME.blind.chip_text = '300'
      G.GAME.current_round.dollars_to_be_earned = '$$$'
      function MAKE_EVAL(rows)
        G.round_eval = UIBox{ definition = create_UIBox_round_evaluation(),
          config = {align="bm", offset = {x=0,y=-7.8}, major = G.hand, bond = 'Weak'} }
        G.round_eval.alignment.prev_type = ''
        G.round_eval:align_to_major()
        G.round_eval.T.x = G.hand.T.x + G.round_eval.role.offset.x
        G.round_eval.T.y = G.hand.T.y + G.round_eval.role.offset.y
        G.round_eval.UIRoot:initialize_VT()
        local n0 = #G.I.UIBOX
        local total = 0
        for _, r in ipairs(rows) do add_round_eval_row(r); total = total + r.dollars end
        add_round_eval_row({name = 'bottom', dollars = total})
        RUN_QUEUE()
        local cash = G.I.UIBOX[#G.I.UIBOX]
        cash.alignment.prev_type = ''
        cash:align_to_major()
        cash.T.x = G.round_eval.T.x + cash.role.offset.x
        cash.T.y = G.round_eval.T.y + cash.role.offset.y
        cash.UIRoot:initialize_VT()
        G.round_eval.UIRoot:initialize_VT()
        return G.round_eval, cash
      end
      EVAL_A, CASH_A = MAKE_EVAL({
        {dollars = 3, name = 'blind1', pitch = 0.95},
        {dollars = 2, disp = 2, bonus = true, name = 'hands', pitch = 1.01},
      })
      EVAL_B, CASH_B = MAKE_EVAL({
        {dollars = 3, name = 'blind1', pitch = 0.95},
        {dollars = 3, disp = 3, bonus = true, name = 'hands', pitch = 1.01},
        {dollars = 1, bonus = true, name = 'interest', pitch = 1.07},
      })
    ''')
    for name, var in [('round_eval_a', 'EVAL_A'), ('cash_out_a', 'CASH_A'), ('round_eval_b', 'EVAL_B'), ('cash_out_b', 'CASH_B')]:
        cases.append({'name': name, **to_py(lua.eval(f'DUMP({var})'))})

    # 商店：G.UIDEF.shop 挂在手牌区上（game.lua:3438，offset 落定在 -5.3），三个 CardArea 换成同尺寸的 Moveable；
    # G.SHOP_SIGN 挂在 row_blind 上；再给一张小丑（$5）跑 create_shop_card_ui，导出它的价签
    lua.execute(r'''
      CardArea = function(x, y, w, h, cfg) local a = Moveable(x, y, w, h); a.config = cfg; a.cards = {}; return a end
      G.CARD_W, G.CARD_H = 2.4*35/41, 2.4*47/41
      G.GAME.shop = { joker_max = 2 }
      G.GAME.bankrupt_at = 0
      G.GAME.current_round.reroll_cost = 5
      G.ANIMATION_ATLAS.shop_sign = {}
      local plain2 = localize
      localize = function(args, misc_cat)
        if type(args) == 'table' and args.key == 'ante_x_voucher' then return 'ANTE '..args.vars[1]..' VOUCHER' end
        return plain2(args, misc_cat)
      end
      local function settle(box)
        box.alignment.prev_type = ''
        box:align_to_major()
        box.T.x = box.role.major.T.x + box.role.offset.x
        box.T.y = box.role.major.T.y + box.role.offset.y
        box.UIRoot:initialize_VT()
      end
      SHOP = UIBox{ definition = G.UIDEF.shop(), config = {align='tmi', offset = {x=0,y=-5.3}, major = G.hand, bond = 'Weak'} }
      RUN_QUEUE()
      settle(SHOP)
      settle(G.SHOP_SIGN)
      local CW, CH = 2.4*35/41, 2.4*47/41
      local card = Moveable(8, 4, CW, CH)
      card.ability = { set = 'Joker' }
      card.cost = 5
      card.children = {}
      create_shop_card_ui(card)
      RUN_QUEUE()
      PRICE = card.children.price
      settle(PRICE)
    ''')
    for name, var in [('shop', 'SHOP'), ('shop_sign', 'G.SHOP_SIGN'), ('price_tag', 'PRICE')]:
        cases.append({'name': name, **to_py(lua.eval(f'DUMP({var})'))})

    # 开包界面：create_UIBox_*_pack 挂在手牌区上（game.lua:3727，tmi，offset 落定在 -2.2）。
    # 五个口味只差标题与 G.pack_cards 的宽度，取四个有代表性的：奥秘 3、天体 3、小丑 2、巨型标准 5
    lua.execute(r'''
      function MAKE_PACK(fn, size, choices)
        G.GAME.pack_size = size
        G.GAME.pack_choices = choices
        local box = UIBox{ definition = fn(), config = {align='tmi', offset = {x=0,y=G.ROOM.T.y + 9}, major = G.hand, bond = 'Weak'} }
        box.alignment.offset.y = -2.2
        local function settle(b)
          b.alignment.prev_type = ''
          b:align_to_major()
          b.T.x = b.role.major.T.x + b.role.offset.x
          b.T.y = b.role.major.T.y + b.role.offset.y
          b.UIRoot:initialize_VT()
        end
        settle(box)
        return box
      end
      PACK_ARCANA = MAKE_PACK(create_UIBox_arcana_pack, 3, 1)
      PACK_CELESTIAL = MAKE_PACK(create_UIBox_celestial_pack, 3, 1)
      PACK_BUFFOON = MAKE_PACK(create_UIBox_buffoon_pack, 2, 1)
      PACK_STANDARD = MAKE_PACK(create_UIBox_standard_pack, 5, 2)
    ''')
    for name, var in [('pack_arcana', 'PACK_ARCANA'), ('pack_celestial', 'PACK_CELESTIAL'),
                      ('pack_buffoon', 'PACK_BUFFOON'), ('pack_standard', 'PACK_STANDARD')]:
        cases.append({'name': name, **to_py(lua.eval(f'DUMP({var})'))})

    # 选中一张卡之后挂在它身上的按钮：use_and_sell_buttons（挂法照 Card:highlight）与 create_shop_card_ui 的 t2 / t3。
    # 卡是 (8, 4) 处一张标准尺寸的 Moveable，只带按钮定义读的那几项
    lua.execute(r'''
      G.C.GREEN = HEX("4BC292"); G.C.UI.BACKGROUND_INACTIVE = HEX("666666FF"); G.C.SECONDARY_SET = { Voucher = HEX("fd682b") }
      local CW, CH = 2.4*35/41, 2.4*47/41
      local function settle(b)
        b.alignment.prev_type = ''
        b:align_to_major()
        b.T.x = b.role.major.T.x + b.role.offset.x
        b.T.y = b.role.major.T.y + b.role.offset.y
        b.UIRoot:initialize_VT()
      end
      G.jokers = { config = { type = 'joker' } }
      G.consumeables = { config = { type = 'joker' } }
      G.pack_cards = { config = { type = 'consumeable' } }
      function MAKE_CARD(area, set, consumeable)
        local card = Moveable(8, 4, CW, CH)
        card.area = area
        card.ability = { set = set, consumeable = consumeable and {} or nil }
        card.sell_cost_label = 3
        card.cost = 5
        card.children = {}
        card.can_sell_card = function() return true end
        card.can_use_consumeable = function() return true end
        return card
      end
      G.jokers.cards = {}; G.jokers.config.card_limit = 5
      function USE_SELL(card)
        local x_off = card.ability.consumeable and -0.1 or 0
        local box = UIBox{ definition = G.UIDEF.use_and_sell_buttons(card), config = {
          align = ((card.area == G.jokers) or (card.area == G.consumeables)) and "cr" or "bmi",
          offset = ((card.area == G.jokers) or (card.area == G.consumeables)) and {x = x_off - 0.4, y = 0} or {x = 0, y = 0.65},
          parent = card, major = card } }
        settle(box)
        return box
      end
      BTN_JOKER = USE_SELL(MAKE_CARD(G.jokers, 'Joker', false))
      BTN_CONS = USE_SELL(MAKE_CARD(G.consumeables, 'Tarot', true))
      BTN_PACK_CONS = USE_SELL(MAKE_CARD(G.pack_cards, 'Tarot', true))
      BTN_PACK_JOKER = USE_SELL(MAKE_CARD(G.pack_cards, 'Joker', false))
      local captured = {}
      local real_UIBox = UIBox
      function SHOP_BUTTONS(set, consumeable)
        local card = MAKE_CARD({ config = { type = 'shop' } }, set, consumeable)
        create_shop_card_ui(card)
        RUN_QUEUE()
        settle(card.children.buy_button)
        if card.children.buy_and_use_button then settle(card.children.buy_and_use_button) end
        return card
      end
      SHOP_JOKER = SHOP_BUTTONS('Joker', false)
      SHOP_VOUCHER = SHOP_BUTTONS('Voucher', false)
      SHOP_BOOSTER = SHOP_BUTTONS('Booster', false)
      SHOP_TAROT = SHOP_BUTTONS('Tarot', true)
    ''')
    for name, var in [('btn_joker', 'BTN_JOKER'), ('btn_consumeable', 'BTN_CONS'), ('btn_pack_consumeable', 'BTN_PACK_CONS'),
                      ('btn_pack_joker', 'BTN_PACK_JOKER'), ('btn_shop_buy', 'SHOP_JOKER.children.buy_button'),
                      ('btn_shop_redeem', 'SHOP_VOUCHER.children.buy_button'), ('btn_shop_open', 'SHOP_BOOSTER.children.buy_button'),
                      ('btn_shop_buy_and_use', 'SHOP_TAROT.children.buy_and_use_button')]:
        cases.append({'name': name, **to_py(lua.eval(f'DUMP({var})'))})

    # 游戏结束 / 胜利界面：G.FUNCS.overlay_menu 挂在 G.ROOM_ATTACH 上（cm，offset 从 y=10 落定到 0）。
    # 局面：TESTSEED 风格的指定 seed 对局，Ante 2 第 5 轮、输给 The Head；胜利那张用同一份统计
    lua.execute(r'''
      G.C.EDITION = {1,1,1,1}
      Sprite = function(x, y, w, h) return Moveable(x, y, w, h) end
      ease_value = function() end
      local prev_localize = localize
      localize = function(args, misc_cat)
        if misc_cat == 'poker_hands' or misc_cat == 'blind_states' then return args end  -- en-us 里两张表都与键同名
        return prev_localize(args, misc_cat)
      end
      G.GAME.round_resets.ante = 2
      G.GAME.round = 5
      G.GAME.seeded = true
      G.GAME.pseudorandom = { seed = 'TESTSEED' }
      G.GAME.round_scores = {
        furthest_ante = {label = 'Ante', amt = 2}, furthest_round = {label = 'Round', amt = 5},
        hand = {label = 'Best Hand', amt = 1234}, poker_hand = {label = 'Most Played Hand', amt = 0},
        new_collection = {label = 'New Discoveries', amt = 0}, cards_played = {label = 'Cards Played', amt = 42},
        cards_discarded = {label = 'Cards Discarded', amt = 17}, times_rerolled = {label = 'Times Rerolled', amt = 3},
        cards_purchased = {label = 'Cards Purchased', amt = 6},
      }
      G.GAME.hand_usage = { TwoPair = { count = 5, order = 'Two Pair' }, Flush = { count = 2, order = 'Flush' } }
      G.GAME.blind = { config = { blind = G.P_BLINDS.bl_head } }
      function OVERLAY(def)
        local box = UIBox{ definition = def, config = {align = 'cm', offset = {x=0,y=10}, major = G.ROOM_ATTACH, bond = 'Weak'} }
        box.alignment.offset.y = 0
        box.alignment.prev_type = ''
        box:align_to_major()
        box.T.x = box.role.major.T.x + box.role.offset.x
        box.T.y = box.role.major.T.y + box.role.offset.y
        box.UIRoot:initialize_VT()
        return box
      end
      GAME_OVER = OVERLAY(create_UIBox_game_over())
      WIN = OVERLAY(create_UIBox_win())
    ''')
    for name, var in [('game_over', 'GAME_OVER'), ('win', 'WIN')]:
        cases.append({'name': name, **to_py(lua.eval(f'DUMP({var})'))})

    # Run Info：overlay_menu 挂 G.ROOM_ATTACH，第一页 Poker Hands。牌型：Pair 3 级打过 4 次，三个五张同点的没露过脸
    lua.execute(r'''
      G.C.HAND_LEVELS = { HEX("efefef"), HEX("95acff"), HEX("65efaf"), HEX('fae37e'), HEX('ffc052'), HEX('f87d75'), HEX('caa0ef') }
      G.C.CHIPS = HEX('009dff'); G.C.MULT = HEX('FE5F55'); G.C.UI.TEXT_DARK = HEX("4F6367")
      G.GAME.stake = 1
      local rows = {
        {'Flush Five', 160, 16, false}, {'Flush House', 140, 14, false}, {'Five of a Kind', 120, 12, false},
        {'Straight Flush', 100, 8, true}, {'Four of a Kind', 60, 7, true}, {'Full House', 40, 4, true}, {'Flush', 35, 4, true},
        {'Straight', 30, 4, true}, {'Three of a Kind', 30, 3, true}, {'Two Pair', 20, 2, true}, {'Pair', 40, 4, true}, {'High Card', 5, 1, true},
      }
      G.GAME.hands = {}
      for _, r in ipairs(rows) do
        G.GAME.hands[r[1]] = { chips = r[2], mult = r[3], visible = r[4], level = r[1] == 'Pair' and 3 or 1, played = r[1] == 'Pair' and 4 or 0 }
      end
      RUN_INFO = OVERLAY(G.UIDEF.run_info())
    ''')
    cases.append({'name': 'run_info', **to_py(lua.eval('DUMP(RUN_INFO)'))})
    cases.append({'name': 'run_info_hands', **to_py(lua.eval("DUMP(RUN_INFO:get_UIE_by_ID('tab_contents').config.object)"))})
    # 第二页 Blinds：原文 change_tab（换掉 tab_contents 里的盒子、整盒重排）。选盲注那组状态：小盲注跳过、大盲注当前
    lua.execute(r'''
      G.OVERLAY_MENU = RUN_INFO
      G.STAGE_OBJECTS = setmetatable({}, {__index = function(t, k) t[k] = {}; return t[k] end})
      for _, k in ipairs({'clicked', 'hovering', 'dragging', 'released_on', 'focused', 'cursor_down', 'cursor_up', 'cursor_hover'}) do G.CONTROLLER[k] = G.CONTROLLER[k] or {} end
      G.GAME.round_resets.blind_states = { Small = 'Skipped', Big = 'Select', Boss = 'Upcoming' }
      G.GAME.blind_on_deck = 'Big'
      G.FUNCS.change_tab(RUN_INFO:get_UIE_by_ID('tab_but_Blinds'))
      RUN_INFO.alignment.prev_type = ''
      RUN_INFO:align_to_major()
      RUN_INFO.T.x = RUN_INFO.role.major.T.x + RUN_INFO.role.offset.x
      RUN_INFO.T.y = RUN_INFO.role.major.T.y + RUN_INFO.role.offset.y
      RUN_INFO.UIRoot:initialize_VT()
    ''')
    cases.append({'name': 'run_info_blinds_outer', **to_py(lua.eval('DUMP(RUN_INFO)'))})
    cases.append({'name': 'run_info_blinds', **to_py(lua.eval("DUMP(RUN_INFO:get_UIE_by_ID('tab_contents').config.object)"))})
    # 第三页 Vouchers：兑换过 Overstock、Clearance Sale、Grabber、Wasteful（四格一行）。CardArea / Card 只桩出尺寸
    import re
    vsrc = (pathlib.Path(__file__).resolve().parents[1] / 'src/core/vouchers.generated.ts').read_text(encoding='utf-8')
    pool = sorted(((int(o), k) for k, o in re.findall(r'(v_\w+): \{"order":(\d+)', vsrc)))
    lua.execute('VOUCHER_POOL = {' + ','.join(f"{{key='{k}', order={o}}}" for o, k in pool) + '}')
    lua.execute(r'''
      G.P_CENTER_POOLS = { Voucher = VOUCHER_POOL }
      G.P_CENTERS = {}
      for _, v in ipairs(VOUCHER_POOL) do G.P_CENTERS[v.key] = v end
      G.CARD_W, G.CARD_H = 2.4*35/41, 2.4*47/41
      G.ROOM = { T = { x = 0, y = 0, w = 21, h = 11.2 } }
      CardArea = function(x, y, w, h, cfg) local a = Moveable(x, y, w, h); a.emplace = function() end; return a end
      Card = function(x, y, w, h) local c = Moveable(x, y, w, h); c.ability = {}; c.start_materialize = function() end; return c end
      G.GAME.used_vouchers = { v_overstock_norm = true, v_clearance_sale = true, v_grabber = true, v_wasteful = true }
      G.FUNCS.change_tab(RUN_INFO:get_UIE_by_ID('tab_but_Vouchers'))
      RUN_INFO.alignment.prev_type = ''
      RUN_INFO:align_to_major()
      RUN_INFO.T.x = RUN_INFO.role.major.T.x + RUN_INFO.role.offset.x
      RUN_INFO.T.y = RUN_INFO.role.major.T.y + RUN_INFO.role.offset.y
      RUN_INFO.UIRoot:initialize_VT()
      G.GAME.used_vouchers = {}
    ''')
    cases.append({'name': 'run_info_vouchers_outer', **to_py(lua.eval('DUMP(RUN_INFO)'))})
    cases.append({'name': 'run_info_vouchers', **to_py(lua.eval("DUMP(RUN_INFO:get_UIE_by_ID('tab_contents').config.object)"))})

    # 牌型行的悬停说明：UIElement:hover 的 on_demand_tooltip → create_popup_UIBox_tooltip（filler = create_UIBox_hand_tip），
    # 挂在一行上（行在上半屏 bm、下移 0.1）
    lua.execute(r'''
      G.GAME.hands['Pair'].example = {{'S_K', false},{'S_9', true},{'D_9', true},{'H_6', false},{'D_3', false}}
      G.P_CARDS = setmetatable({}, {__index = function() return {} end})
      G.P_CENTERS.c_base = {}
      Card = function(x, y, w, h) local c = Moveable(x, y, w, h); c.juice_up = function() end; return c end
      play_sound = function() end
      local row = Moveable(6, 3, 11.7, 0.62)
      TIP = UIBox{ definition = create_popup_UIBox_tooltip({text = {'2 cards that share the same rank. They may', 'be played with up to 3 other unscored cards'}, filler = {func = create_UIBox_hand_tip, args = 'Pair'}}),
        config = { align = 'bm', offset = {x = 0, y = 0.1}, parent = row } }
    ''')
    cases.append({'name': 'hand_tip', **to_py(lua.eval('DUMP(TIP)'))})

    # 悬停牌堆的 deck_preview（UI_definitions.lua:498）。一副标准牌：点数 id 2..14、四花色；
    # 用例一：摸走 8 张（手里）；用例二：再加两张石头牌（一张在牌堆）、一张万能牌、两张盖着摸进手里的
    lua.globals().VDICT = lua.table_from({
        'deck_preview_wheel_plural': 'Numbers may be lower due to the #1# cards drawn face down',
        'deck_preview_wheel_singular': 'Numbers may be lower due to the #1# card drawn face down',
    })
    lua.execute(r'''
      G.C.SUITS = { Hearts = HEX('FE5F55'), Diamonds = HEX('FE5F55'), Spades = HEX('374649'), Clubs = HEX('424e54') }
      G.C.UI.TRANSPARENT_LIGHT = HEX('eeeeee22')
      G.ASSET_ATLAS = setmetatable({}, {__index = function() return {} end})
      G.SETTINGS.colourblind_option = false
      G.deck = {}; G.hand = {}
      local plain = localize
      localize = function(a)
        if type(a) == 'table' then return (VDICT[a.key]:gsub('#1#', tostring(a.vars[1]))) end
        return plain(a)
      end
      local SN = { Spades = 4, Hearts = 3, Clubs = 2, Diamonds = 1 }
      function PCARD(suit, id, area, effect, name)
        local c = { base = { suit = suit, id = id }, ability = { effect = effect or '', name = name or '' }, area = area, debuff = false }
        c.get_nominal = function(self) return SN[suit] * 100 + id end
        c.is_suit = function(self, s)
          if self.debuff then return end
          if self.ability.effect == 'Stone Card' then return false end
          if self.ability.name == 'Wild Card' then return true end
          return self.base.suit == s
        end
        return c
      end
      function DECK(extra)
        G.playing_cards = {}
        local n = 0
        for _, suit in ipairs({'Spades', 'Hearts', 'Clubs', 'Diamonds'}) do
          for id = 2, 14 do
            n = n + 1
            G.playing_cards[#G.playing_cards + 1] = PCARD(suit, id, (n % 6 == 0 and n <= 48) and G.hand or G.deck)
          end
        end
        if extra then extra() end
      end
      DECK()
      PREVIEW1 = UIBox{ definition = G.UIDEF.deck_preview(), config = { align = 'tm', offset = {x = 0, y = -0.8}, major = G.ROOM_ATTACH } }
      DECK(function()
        local pc = G.playing_cards
        pc[#pc + 1] = PCARD('Hearts', 5, G.deck, 'Stone Card')
        pc[#pc + 1] = PCARD('Clubs', 9, G.hand, 'Stone Card')
        pc[#pc + 1] = PCARD('Spades', 12, G.deck, '', 'Wild Card')
        pc[6].ability.wheel_flipped = true
        pc[12].ability.wheel_flipped = true
      end)
      PREVIEW2 = UIBox{ definition = G.UIDEF.deck_preview(), config = { align = 'tm', offset = {x = 0, y = -0.8}, major = G.ROOM_ATTACH } }
    ''')
    cases.append({'name': 'deck_preview', **to_py(lua.eval('DUMP(PREVIEW1)'))})
    cases.append({'name': 'deck_preview_mixed', **to_py(lua.eval('DUMP(PREVIEW2)'))})

    OUT.write_text(json.dumps(cases, indent=1), encoding='utf-8')
    print(f'{OUT.name}: ' + ', '.join(f"{c['name']} {len(c['elements'])} elements" for c in cases))


if __name__ == '__main__':
    main()
