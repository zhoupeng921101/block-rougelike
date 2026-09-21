#!/usr/bin/env python3
"""描述解析的外部真值（22 号票）：原作 `loc_parse_string`（`misc_functions.lua:1619`）对 en-us.lua 里
每一条 descriptions 的每一行跑一遍，导出解析结果。`src/ui/localize.test.ts` 逐行比。

    python tools/loc-oracle.py      # 写 src/ui/loc-oracle.generated.json
"""
import json
import pathlib

from lupa import luajit21

ROOT = pathlib.Path(__file__).resolve().parents[3]
SRC = ROOT / '参考/产物/Balatro_1.0.1o/源码'
LOC = ROOT / '参考/产物/Balatro_1.0.1o/本地化/en-us.lua'
OUT = pathlib.Path(__file__).resolve().parents[1] / 'src/ui/loc-oracle.generated.json'


def to_py(t):
    if hasattr(t, 'items'):
        keys = list(t.keys())
        if keys and all(isinstance(k, int) for k in keys):
            return [to_py(t[k]) for k in sorted(keys)]
        return {k: to_py(v) for k, v in t.items()}
    return t


def main():
    lua = luajit21.LuaRuntime(unpack_returned_tuples=True)
    misc = (SRC / 'functions/misc_functions.lua').read_text(encoding='utf-8')
    # 只要 loc_parse_string 这一个函数，整文件加载会碰到不相干的全局
    start = misc.index('function loc_parse_string(line)')
    end = misc.index('--UTF8 handler', start)
    lua.execute(misc[start:end])
    loc = lua.execute(LOC.read_text(encoding='utf-8'))
    parse = lua.globals().loc_parse_string
    out = {}
    for set_name, entries in loc['descriptions'].items():
        for key, e in entries.items():
            if e['text'] is None:
                continue
            lines = [e['text'][k] for k in sorted(e['text'].keys())]
            out[f'{set_name}/{key}'] = [to_py(parse(line)) or [] for line in lines]
    OUT.write_text(json.dumps(dict(sorted(out.items())), ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f'{OUT.name}: {len(out)} entries')


if __name__ == '__main__':
    main()
