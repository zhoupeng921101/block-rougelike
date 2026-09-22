#!/usr/bin/env python3
"""卡牌提示框要的本地化（22 号票）：用 LuaJIT 原样加载 `本地化/en-us.lua`，导出

- `descriptions`：每个 set（Joker / Tarot / Planet / Spectral / Voucher / Edition / Enhanced / Other / Tag / Back …）
  每个 key 的 `name` 与 `text`（原文，`{C:mult}+#1#` 这些控制码不解析——解析在 `src/ui/localize.ts` 里直译 `loc_parse_string`）
- `misc` 里提示框会查的几张表：labels / poker_hands / suits_singular / suits_plural / ranks

    python tools/gen-descriptions.py      # 写 src/ui/descriptions.generated.ts

依赖：lupa（带 LuaJIT 2.1），与 `tools/ui-oracle.py` 同一个包。
"""
import json
import re
import pathlib

from lupa import luajit21

ROOT = pathlib.Path(__file__).resolve().parents[3]
LOC = ROOT / '参考/产物/Balatro_1.0.1o/本地化/en-us.lua'
SRC_DIR = ROOT / '参考/产物/Balatro_1.0.1o/源码'
OUT = pathlib.Path(__file__).resolve().parents[1] / 'src/ui/descriptions.generated.ts'


def seq(t):
    return [t[k] for k in sorted(t.keys())] if t is not None else None


def main():
    lua = luajit21.LuaRuntime(unpack_returned_tuples=True)
    loc = lua.execute(LOC.read_text(encoding='utf-8'))
    desc = {}
    for set_name, entries in loc['descriptions'].items():
        out = {}
        for key, e in entries.items():
            name = e['name']
            if name is not None and not isinstance(name, str):
                name = seq(name)
            item = {'name': name}
            if e['text'] is not None:
                item['text'] = seq(e['text'])
            out[key] = item
        desc[set_name] = dict(sorted(out.items()))
    # G.P_CENTERS / G.P_TAGS：原样跑 Game:init_item_prototypes（桩掉 save_progress 与读档用的全局）
    lua.execute('''
      Object = {}; Object.__index = Object
      function Object:extend() local c = {}; for k, v in pairs(self) do if k:find('__') == 1 then c[k] = v end end
        c.__index = c; c.super = self; setmetatable(c, self); return c end
      function HEX(hex) local r = {}; for i = 1, 4 do r[i] = tonumber((hex..'FF'):sub(2*i-1, 2*i), 16)/255 end return r end
    ''')
    lua.execute((SRC_DIR / 'game.lua').read_text(encoding='utf-8'))
    lua.execute('''
      localize = function(k) return k end
      G = {}; FAKE = setmetatable({ save_progress = function() end }, {__index = Game})
      pcall(FAKE.init_item_prototypes, FAKE)  -- 读档那段（love.mod_filesystem）会炸，表在它之前就建好了
    ''')
    keep = ['name', 'set', 'effect', 'rarity', 'order', 'config', 'consumeable', 'unlocked', 'discovered']

    def plain(v):
        if hasattr(v, 'items'):
            keys = list(v.keys())
            if keys and all(isinstance(k, int) for k in keys):
                return [plain(v[k]) for k in sorted(keys)]
            return {k: plain(x) for k, x in v.items()}
        return v

    centers = {}
    for key, c in lua.eval('FAKE.P_CENTERS').items():
        if c['name'] is None:
            continue  # soul / undiscovered_* 这些只有 pos 的占位
        centers[key] = {k: plain(c[k]) for k in keep if c[k] is not None}
        centers[key].setdefault('config', {})
        if 'consumeable' in centers[key]:
            centers[key]['consumeable'] = True
    tags = {key: {'config': {}, **{k: plain(c[k]) for k in ['name', 'set', 'config', 'order'] if c[k] is not None}}
            for key, c in lua.eval('FAKE.P_TAGS').items()}

    misc = {}
    for cat in ['labels', 'poker_hands', 'suits_singular', 'suits_plural', 'ranks']:
        misc[cat] = dict(sorted((k, v) for k, v in loc['misc'][cat].items() if isinstance(v, str)))
    # lq_* 输了、wq_* 赢了、dq_* 终局 Boss
    quips = {k: plain(v) for k, v in sorted(loc['misc']['quips'].items())}
    # Run Info 牌型行的悬停说明（misc.poker_hand_descriptions）与示例牌（game.lua 的 G.GAME.hands[*].example）
    hand_desc = {k: plain(v) for k, v in sorted(loc['misc']['poker_hand_descriptions'].items())}
    game_src = (SRC_DIR / 'game.lua').read_text(encoding='utf-8')
    hand_examples = {}
    for name, ex in re.findall(r'\["([^"]+)"\] = +\{visible.*?example = \{(.*?)\}\}', game_src):
        hand_examples[name] = [[k, flag == 'true'] for k, flag in re.findall(r"\{'(\w_\w+)', (true|false)", ex)]
    body = (
        '// 由 tools/gen-descriptions.py 从 本地化/en-us.lua 生成，不要手改。\n'
        '/** `G.localization.descriptions`：`name` 是字符串或多行，`text` 按行（控制码原样） */\n'
        'export const DESCRIPTIONS: Readonly<Record<string, Readonly<Record<string, { name: string | string[] | null; text?: string[] }>>>> = '
        + json.dumps(dict(sorted(desc.items())), ensure_ascii=False, indent=1) + ';\n\n'
        '/** `G.localization.misc` 里提示框会查的几张表（`localize(key, cat)`） */\n'
        'export const MISC: Readonly<Record<string, Readonly<Record<string, string>>>> = '
        + json.dumps(misc, ensure_ascii=False, indent=1) + ';\n\n'
        '/** `G.localization.misc.poker_hand_descriptions`：Run Info 牌型行悬停时的说明 */\n'
        'export const HAND_DESCRIPTIONS: Readonly<Record<string, readonly string[]>> = '
        + json.dumps(hand_desc, ensure_ascii=False, indent=1) + ';\n\n'
        '/** `G.GAME.hands[*].example`（game.lua:2212）：示例牌 `[牌 key, 是否计分]` */\n'
        'export const HAND_EXAMPLES: Readonly<Record<string, ReadonlyArray<readonly [string, boolean]>>> = '
        + json.dumps(hand_examples, ensure_ascii=False) + ';\n\n'
        "/** `G.localization.misc.quips`（`localize{type = 'quips'}`）：Jimbo 的俏皮话，每条按行 */\n"
        'export const QUIPS: Readonly<Record<string, readonly string[]>> = '
        + json.dumps(quips, ensure_ascii=False, indent=1) + ';\n\n'
        '/** `G.P_CENTERS`（`Game:init_item_prototypes` 原样跑出来的）：提示框读 name / set / effect / rarity / config */\n'
        'export const P_CENTERS: Readonly<Record<string, PCenter>> = '
        + json.dumps(dict(sorted(centers.items())), ensure_ascii=False, separators=(',', ':'), sort_keys=True) + ';\n\n'
        '/** `G.P_TAGS` */\n'
        'export const P_TAGS: Readonly<Record<string, PCenter>> = '
        + json.dumps(dict(sorted(tags.items())), ensure_ascii=False, separators=(',', ':'), sort_keys=True) + ';\n'
    )
    body = ('/* eslint-disable */\nexport type PCenter = { name: string; set: string; effect?: string; rarity?: number; order?: number; '
            '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n'
            'config: Record<string, any>; consumeable?: boolean; unlocked?: boolean; discovered?: boolean };\n\n' + body)
    OUT.write_text(body, encoding='utf-8')
    print(f'{OUT.name}: ' + ', '.join(f'{k} {len(v)}' for k, v in sorted(desc.items())) + f'; centers {len(centers)}, tags {len(tags)}')


if __name__ == '__main__':
    main()
