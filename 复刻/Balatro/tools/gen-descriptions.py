#!/usr/bin/env python3
"""卡牌提示框要的本地化（22 号票）：用 LuaJIT 原样加载 `本地化/en-us.lua`，导出

- `descriptions`：每个 set（Joker / Tarot / Planet / Spectral / Voucher / Edition / Enhanced / Other / Tag / Back …）
  每个 key 的 `name` 与 `text`（原文，`{C:mult}+#1#` 这些控制码不解析——解析在 `src/ui/localize.ts` 里直译 `loc_parse_string`）
- `misc` 里提示框会查的几张表：labels / poker_hands / suits_singular / suits_plural / ranks

    python tools/gen-descriptions.py      # 写 src/ui/descriptions.generated.ts

依赖：lupa（带 LuaJIT 2.1），与 `tools/ui-oracle.py` 同一个包。
"""
import json
import pathlib

from lupa import luajit21

ROOT = pathlib.Path(__file__).resolve().parents[3]
LOC = ROOT / '参考/产物/Balatro_1.0.1o/本地化/en-us.lua'
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
    misc = {}
    for cat in ['labels', 'poker_hands', 'suits_singular', 'suits_plural', 'ranks']:
        misc[cat] = dict(sorted((k, v) for k, v in loc['misc'][cat].items() if isinstance(v, str)))
    body = (
        '// 由 tools/gen-descriptions.py 从 本地化/en-us.lua 生成，不要手改。\n'
        '/** `G.localization.descriptions`：`name` 是字符串或多行，`text` 按行（控制码原样） */\n'
        'export const DESCRIPTIONS: Readonly<Record<string, Readonly<Record<string, { name: string | string[] | null; text?: string[] }>>>> = '
        + json.dumps(dict(sorted(desc.items())), ensure_ascii=False, indent=1) + ';\n\n'
        '/** `G.localization.misc` 里提示框会查的几张表（`localize(key, cat)`） */\n'
        'export const MISC: Readonly<Record<string, Readonly<Record<string, string>>>> = '
        + json.dumps(misc, ensure_ascii=False, indent=1) + ';\n'
    )
    OUT.write_text(body, encoding='utf-8')
    print(f'{OUT.name}: ' + ', '.join(f'{k} {len(v)}' for k, v in sorted(desc.items())))


if __name__ == '__main__':
    main()
