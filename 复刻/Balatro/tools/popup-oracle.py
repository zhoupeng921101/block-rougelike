#!/usr/bin/env python3
"""卡牌提示框的外部真值（22 号票）：原样调用原作的 `Card:generate_UIBox_ability_table`（card.lua）、
`generate_card_ui`（common_events.lua）与 `G.UIDEF.card_h_popup`，导出

- `texts`：每张小丑 / 塔罗 / 星球 / 幽灵 / 优惠券 / 补充包 / 强化，按默认 ability 与一份固定的 G.GAME，
  提示框主体（name + main + info）逐行拼成的纯文本
- `layouts`：几张代表卡的整个提示框 UIBox 布局（每个元素的矩形与文字）

    python tools/popup-oracle.py     # 写 src/ui/popup-oracle.generated.json
"""
import importlib.util
import json
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('ui_oracle', HERE / 'ui-oracle.py')
ui_oracle = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ui_oracle)

SRC = ui_oracle.SRC
LOC = SRC.parent / '本地化/en-us.lua'
OUT = HERE.parent / 'src/ui/popup-oracle.generated.json'

SETUP = r'''
  G.C.GREEN = HEX("4BC292"); G.C.GREY = HEX("5f7377"); G.C.PURPLE = HEX('8867a5'); G.C.GOLD = HEX('eac058')
  G.C.FILTER = HEX('ff9a00'); G.C.L_BLACK = HEX("4f6367"); G.C.MULT = HEX('FE5F55'); G.C.CHIPS = HEX("009dff")
  G.C.EDITION = {1,1,1,1}; G.C.DARK_EDITION = {0,0,0,1}; G.C.BOOSTER = HEX("646eb7")
  G.C.ETERNAL = HEX('c75985'); G.C.PERISHABLE = HEX('4f5da1'); G.C.RENTAL = HEX('b18f43')
  G.C.SUITS = { Hearts = HEX('FE5F55'), Diamonds = HEX('FE5F55'), Spades = HEX("374649"), Clubs = HEX("424e54") }
  G.C.UI.TEXT_DARK = HEX("4F6367"); G.C.UI.TEXT_INACTIVE = HEX("88888899"); G.C.UI.BACKGROUND_WHITE = {1,1,1,1}
  G.C.SET = { Default = HEX("cdd9dc"), Enhanced = HEX("cdd9dc"), Joker = HEX('424e54'), Tarot = HEX('424e54'), Planet = HEX("424e54"), Spectral = HEX('424e54'), Voucher = HEX("424e54") }
  G.C.SECONDARY_SET = { Default = HEX("9bb6bdFF"), Enhanced = HEX("8389DDFF"), Joker = HEX('708b91'), Tarot = HEX('a782d1'), Planet = HEX('13afce'), Spectral = HEX('4584fa'), Voucher = HEX("fd682b"), Edition = HEX("4ca893") }
  G.C.RARITY = { HEX('009dff'), HEX("4BC292"), HEX('fe5f55'), HEX("b26cbb") }
  G.C.HAND_LEVELS = { HEX("efefef"), HEX("95acff"), HEX("65efaf"), HEX('fae37e'), HEX('ffc052'), HEX('f87d75'), HEX('caa0ef') }
  G.LANG.font.DESCSCALE = 1
  G.F_MOBILE = false
  G.ARGS.LOC_COLOURS = nil
'''

GAME = r'''
  local hands = {}
  for _, h in ipairs({'Flush Five','Flush House','Five of a Kind','Straight Flush','Four of a Kind','Full House','Flush','Straight','Three of a Kind','Two Pair','Pair','High Card'}) do
    hands[h] = { level = 1, l_mult = 2, l_chips = 20, visible = true }
  end
  hands['Pair'].level = 3
  G.GAME = {
    probabilities = { normal = 1 }, hands = hands, dollars = 12, starting_deck_size = 52,
    consumeable_usage_total = { tarot = 2 }, consumeable_usage = { c_pluto = { set = 'Planet' }, c_mars = { set = 'Planet' }, c_fool = { set = 'Tarot' } },
    current_round = { idol_card = { rank = 'Ace', suit = 'Hearts' }, ancient_card = { suit = 'Clubs' }, castle_card = { suit = 'Spades' }, mail_card = { rank = 'King' } },
    last_tarot_planet = 'c_mars', ecto_minus = 1,
  }
  G.playing_cards = {}; for i = 1, 50 do G.playing_cards[i] = {} end
  G.deck = { cards = {} }; for i = 1, 44 do G.deck.cards[i] = { base = { id = 11, suit = 'Diamonds' } } end
  G.jokers = { cards = { { ability = { set = 'Joker' }, sell_cost = 3 }, { ability = { set = 'Joker' }, sell_cost = 2 } }, config = { type = 'joker', card_limit = 5 } }
  G.consumeables = { cards = {}, config = { type = 'joker', card_limit = 2 } }
  G.GAME.blind = nil
'''

CARDS = r'''
  function MAKE_CARD(key, opts)
    opts = opts or {}
    local center = G.P_CENTERS[key]
    local card = setmetatable({ config = { center = center, center_key = key }, params = {}, T = {x=0,y=0,w=1,h=1} }, { __index = Card })
    card.ability = {
      name = center.name, effect = center.effect, set = center.set,
      mult = center.config.mult or 0, h_mult = center.config.h_mult or 0, h_x_mult = center.config.h_x_mult or 0,
      h_dollars = center.config.h_dollars or 0, p_dollars = center.config.p_dollars or 0, t_mult = center.config.t_mult or 0,
      t_chips = center.config.t_chips or 0, x_mult = center.config.Xmult or 1, h_size = center.config.h_size or 0,
      d_size = center.config.d_size or 0, extra = copy_table(center.config.extra) or nil, extra_value = 0,
      type = center.config.type or '', order = center.order or nil, perma_bonus = 0,
    }
    card.ability.bonus = center.config.bonus or 0
    if center.consumeable then card.ability.consumeable = center.config end
    if card.ability.name == 'Invisible Joker' then card.ability.invis_rounds = 0 end
    if card.ability.name == 'To Do List' then card.ability.to_do_poker_hand = 'Flush' end
    if card.ability.name == 'Caino' then card.ability.caino_xmult = 1 end
    if card.ability.name == 'Yorick' then card.ability.yorick_discards = card.ability.extra.discards end
    if card.ability.name == 'Loyalty Card' then card.ability.loyalty_remaining = card.ability.extra.every end
    card.bypass_lock = true
    card.bypass_discovery_ui = true
    card.bypass_discovery_center = true
    center.discovered = true
    card.area = opts.area
    if opts.base then card.base = opts.base; card.base.colour = G.C.SUITS[opts.base.suit] end
    if opts.edition then card.edition = { type = opts.edition, [opts.edition] = true } end
    card.seal = opts.seal
    card.debuff = opts.debuff
    return card
  end
  local function flat_node(n, out)
    if n.n == G.UIT.T then out[#out+1] = n.config.text or ''
    elseif n.n == G.UIT.O and n.config.object and n.config.object.strings then
      for _, s in ipairs(n.config.object.strings) do out[#out+1] = s.string end
    end
    for _, c in ipairs(n.nodes or {}) do flat_node(c, out) end
  end
  function ROW_TEXT(row)
    local out = {}
    for _, n in ipairs(row) do flat_node(n, out) end
    return table.concat(out)
  end
  function CARD_TEXT(card)
    local AUT = card:generate_UIBox_ability_table()
    local t = { name = (type(AUT.name) == 'table') and ROW_TEXT(AUT.name) or '', main = {}, info = {} }
    for _, row in ipairs(AUT.main) do t.main[#t.main+1] = ROW_TEXT(row) end
    for _, box in ipairs(AUT.info) do
      local b = { name = box.name or '', rows = {} }
      for _, row in ipairs(box) do b.rows[#b.rows+1] = ROW_TEXT(row) end
      t.info[#t.info+1] = b
    end
    return t
  end
  function POPUP(card)
    card.ability_UIBox_table = card:generate_UIBox_ability_table()
    local def = G.UIDEF.card_h_popup(card)
    def.nodes[1].config.func = nil
    def.nodes[1].config.object = nil
    def.nodes[1].config.ref_table = nil
    def.nodes[1].config.id = 'h_popup_main'
    local box = UIBox{ definition = def, config = { align = 'cm', offset = {x = 0, y = 0}, major = Moveable(5, 3, 2, 3) } }
    return box
  end
  function DUMP2(box)
    local out = {}
    local function walk(e)
      local text = ''
      if e.UIT == G.UIT.T then text = e.config.text or '' end
      if e.UIT == G.UIT.O and e.config.object and e.config.object.strings then
        for _, s in ipairs(e.config.object.strings) do text = text..s.string end
      end
      out[#out + 1] = { e.UIT, text, e.T.x, e.T.y, e.T.w, e.T.h }
      for _, c in ipairs(e.children) do walk(c) end
    end
    walk(box.UIRoot)
    return out
  end
'''


def main():
    lua = ui_oracle.make_runtime()
    lua.execute(SETUP)
    for f in ['functions/common_events.lua', 'card.lua', 'game.lua']:
        lua.execute("package.preload['engine/platform'] = function() return {} end")
        lua.execute((SRC / f).read_text(encoding='utf-8'))
    lua.execute('''
      G.FUNCS = setmetatable({}, {__index = function() return function() end end})
      FAKE = setmetatable({ save_progress = function() end }, {__index = Game})
      local real_localize = localize
      pcall(FAKE.init_item_prototypes, FAKE)
      G.P_CENTERS = FAKE.P_CENTERS; G.P_TAGS = FAKE.P_TAGS
      for k, v in pairs(G.P_CENTERS) do v.key = k end
      for k, v in pairs(G.P_TAGS) do v.key = k end
    ''')
    lua.globals().LOC_TABLE = lua.execute(LOC.read_text(encoding='utf-8'))
    # misc_functions.lua 里的 localize 被 ui-oracle 的桩覆盖过，这里重新加载原文
    misc = (SRC / 'functions/misc_functions.lua').read_text(encoding='utf-8')
    lua.execute(misc[misc.index('function loc_colour'):misc.index('function playing_card_joker_effects')])
    lua.execute(misc[misc.index('function loc_parse_string'):misc.index('--UTF8 handler')])
    lua.execute(misc[misc.index('function localize(args, misc_cat)'):])
    lua.execute('G.localization = LOC_TABLE; init_localization()')
    lua.execute(GAME)
    lua.execute(CARDS)

    texts = {}
    keys = sorted(k for k, v in lua.eval('G.P_CENTERS').items()
                  if v['set'] in ('Joker', 'Tarot', 'Planet', 'Spectral', 'Voucher', 'Booster', 'Enhanced') and v['name'] is not None)
    for key in keys:
        base = ', base = {value = "7", suit = "Hearts", nominal = 7}' if key.startswith('m_') else ''
        ok, res = lua.eval(f'pcall(CARD_TEXT, MAKE_CARD("{key}", {{area = G.jokers{base}}}))')
        if not ok:
            raise RuntimeError(f'{key}: {res}')
        texts[key] = ui_oracle.to_py(res)

    layouts = {}
    cases = {
        'joker': 'MAKE_CARD("j_joker", {area = G.jokers})',
        'lucky_cat_foil': 'MAKE_CARD("j_lucky_cat", {area = G.jokers, edition = "foil"})',
        'tarot_magician': 'MAKE_CARD("c_magician", {area = G.consumeables})',
        'planet_mercury': 'MAKE_CARD("c_mercury", {area = G.consumeables})',
        'voucher': 'MAKE_CARD("v_overstock_norm")',
        'booster': 'MAKE_CARD("p_arcana_normal_1")',
        'card_ace': 'MAKE_CARD("c_base", {base = {value = "Ace", suit = "Spades", nominal = 11}})',
        'card_bonus_red_seal': 'MAKE_CARD("m_bonus", {base = {value = "7", suit = "Hearts", nominal = 7}, seal = "Red"})',
    }
    for name, expr in cases.items():
        layouts[name] = ui_oracle.to_py(lua.eval(f'DUMP2(POPUP({expr}))'))

    OUT.write_text(json.dumps({'texts': texts, 'layouts': layouts}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f'{OUT.name}: {len(texts)} texts, {len(layouts)} layouts')


if __name__ == '__main__':
    main()
