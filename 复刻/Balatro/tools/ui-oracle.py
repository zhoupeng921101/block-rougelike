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
  ORANGE = HEX("fda200"), WHITE = {1,1,1,1}, CLEAR = {0,0,0,0}, BLACK = HEX("374244"),
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

    OUT.write_text(json.dumps(cases, indent=1), encoding='utf-8')
    print(f'{OUT.name}: ' + ', '.join(f"{c['name']} {len(c['elements'])} elements" for c in cases))


if __name__ == '__main__':
    main()
