# -*- coding: utf-8 -*-
"""Godot 文本资源(`.tres` / `.tscn`)解析器 + 全库解引用。

Brotato 的数值全在 `.tres` 里，一张表就是一个文件、一个字段一行，靠 `ExtResource( n )`
互相引用（道具 -> 效果 -> 数值；角色 -> 起始武器 -> 武器数值）。所以拆数值的关键不是
解析单个文件，而是**跨文件把引用摊平**，这就是 `Project.deref()` 干的事。

递归有环（武器 tier1 -> upgrades_into tier2 -> ... 以及套装 <-> 道具互指），
`deref` 用 `max_depth` 和"路径栈"两道闸挡住。

用法:
    python brotato_tres.py <资源目录> <JSON输出目录>     # 全量转 JSON
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from brotato_common import Progress, ensure, setup_stdout, write_json

SECTION = re.compile(r'^\[([a-zA-Z_]+)([^\]]*)\]\s*$')
ATTR = re.compile(r'([a-zA-Z_][\w/]*)\s*=\s*("(?:[^"\\]|\\.)*"|[^\s\]]+)')


def _unesc(s):
    return s.replace('\\"', '"').replace('\\n', '\n').replace('\\t', '\t').replace('\\\\', '\\')


class _P(object):
    """值的递归下降解析。Godot 的写法是 GDScript 字面量的子集。"""

    def __init__(self, s):
        self.s = s
        self.i = 0

    def ws(self):
        while self.i < len(self.s) and self.s[self.i] in ' \t\r\n':
            self.i += 1

    def value(self):
        self.ws()
        if self.i >= len(self.s):
            return None
        c = self.s[self.i]
        if c == '"':
            j = self.i + 1
            out = []
            while j < len(self.s):
                if self.s[j] == '\\':
                    out.append(self.s[j:j + 2])
                    j += 2
                    continue
                if self.s[j] == '"':
                    break
                out.append(self.s[j])
                j += 1
            self.i = j + 1
            return _unesc(''.join(out))
        if c == '[':
            self.i += 1
            out = []
            while True:
                self.ws()
                if self.i >= len(self.s):
                    break
                if self.s[self.i] == ']':
                    self.i += 1
                    break
                out.append(self.value())
                self.ws()
                if self.i < len(self.s) and self.s[self.i] == ',':
                    self.i += 1
            return out
        if c == '{':
            self.i += 1
            out = {}
            while True:
                self.ws()
                if self.i >= len(self.s):
                    break
                if self.s[self.i] == '}':
                    self.i += 1
                    break
                k = self.value()
                self.ws()
                if self.i < len(self.s) and self.s[self.i] == ':':
                    self.i += 1
                v = self.value()
                out[k if isinstance(k, str) else str(k)] = v
                self.ws()
                if self.i < len(self.s) and self.s[self.i] == ',':
                    self.i += 1
            return out
        m = re.match(r'([A-Za-z_][\w]*)\s*\(', self.s[self.i:])
        if m:
            name = m.group(1)
            self.i += m.end()
            args = []
            while True:
                self.ws()
                if self.i >= len(self.s):
                    break
                if self.s[self.i] == ')':
                    self.i += 1
                    break
                args.append(self.value())
                self.ws()
                if self.i < len(self.s) and self.s[self.i] == ',':
                    self.i += 1
            if name in ('ExtResource', 'SubResource'):
                return {'@' + name: args[0] if args else None}
            return {'@' + name: args}
        m = re.match(r'[^\s,\)\]\}:]+', self.s[self.i:])
        if not m:
            self.i += 1
            return None
        tok = m.group()
        self.i += m.end()
        if tok == 'true':
            return True
        if tok == 'false':
            return False
        if tok in ('null', 'Null'):
            return None
        if tok == 'inf':
            return float('inf')
        if tok == '-inf':
            return float('-inf')
        if tok == 'nan':
            return float('nan')
        try:
            if re.fullmatch(r'-?\d+', tok):
                return int(tok)
            return float(tok)
        except ValueError:
            return tok


def parse_value(s):
    return _P(s).value()


class Tres(object):
    """一个 `.tres` / `.tscn` 文件。"""

    def __init__(self, text, path=''):
        self.path = path
        self.kind = ''
        self.header = {}
        self.ext = {}          # id -> {'path','type'}
        self.sub = {}          # id -> {'@type':..., 属性}
        self.resource = {}     # [resource] 段
        self.nodes = []        # [node ...] 段（.tscn）
        self.connections = []
        cur = None
        buf = []
        lines = text.splitlines()

        def flush():
            if cur is None:
                return
            body = '\n'.join(buf)
            props = {}
            for m in re.finditer(r'^([a-zA-Z_][\w/]*)\s*=\s*', body, re.M):
                p = _P(body)
                p.i = m.end()
                props[m.group(1)] = p.value()
            kind, attrs = cur
            if kind in ('gd_resource', 'gd_scene'):
                self.kind = kind
                self.header = attrs
            elif kind == 'ext_resource':
                self.ext[int(attrs.get('id', 0))] = attrs
            elif kind == 'sub_resource':
                d = {'@type': attrs.get('type', '')}
                d.update(props)
                self.sub[int(attrs.get('id', 0))] = d
            elif kind == 'resource':
                self.resource = props
            elif kind == 'node':
                d = dict(attrs)
                d['属性'] = props
                self.nodes.append(d)
            elif kind == 'connection':
                self.connections.append(attrs)

        for ln in lines:
            m = SECTION.match(ln)
            if m:
                flush()
                attrs = {}
                for a in ATTR.finditer(m.group(2)):
                    v = a.group(2)
                    attrs[a.group(1)] = _unesc(v[1:-1]) if v.startswith('"') else parse_value(v)
                cur = (m.group(1), attrs)
                buf = []
            else:
                buf.append(ln)
        flush()

    @property
    def script(self):
        """[resource] 挂的脚本的 res:// 路径。"""
        s = self.resource.get('script')
        if isinstance(s, dict) and '@ExtResource' in s:
            e = self.ext.get(s['@ExtResource'])
            if e:
                return e.get('path', '')
        return ''

    def ext_path(self, i):
        e = self.ext.get(i)
        return e.get('path', '') if e else ''


class Project(object):
    """整棵资源树，按 `res://` 路径索引，支持跨文件解引用。"""

    def __init__(self, res_dir):
        self.res_dir = res_dir
        self.files = {}          # res 路径 -> Tres
        self._cache = {}
        for root, _d, fns in os.walk(res_dir):
            for fn in fns:
                if fn.endswith(('.tres', '.tscn')):
                    p = os.path.join(root, fn)
                    rel = os.path.relpath(p, res_dir).replace('\\', '/')
                    try:
                        with open(p, 'r', encoding='utf-8') as f:
                            self.files['res://' + rel] = Tres(f.read(), 'res://' + rel)
                    except Exception:
                        pass

    def get(self, res_path):
        return self.files.get(res_path)

    def deref(self, value, owner, depth=3, stack=None):
        """把 `ExtResource( n )` / `SubResource( n )` 递归换成实际内容。

        depth 用完就只留 `res://` 路径字符串；stack 防环。
        """
        stack = stack or ()
        if isinstance(value, list):
            return [self.deref(v, owner, depth, stack) for v in value]
        if isinstance(value, dict):
            if '@ExtResource' in value:
                p = owner.ext_path(value['@ExtResource'])
                if depth <= 0 or p in stack or not p.endswith(('.tres', '.tscn')):
                    return p
                t = self.get(p)
                if t is None:
                    return p
                out = {'@路径': p}
                for k, v in t.resource.items():
                    if k == 'script':
                        out['@脚本'] = t.script
                        continue
                    out[k] = self.deref(v, t, depth - 1, stack + (p,))
                return out
            if '@SubResource' in value:
                s = owner.sub.get(value['@SubResource'])
                if s is None or depth <= 0:
                    return 'SubResource(%s)' % value['@SubResource']
                return {k: self.deref(v, owner, depth - 1, stack) for k, v in s.items()}
            return {k: self.deref(v, owner, depth, stack) for k, v in value.items()}
        return value

    def flat(self, res_path, depth=3):
        """读一个资源并把它的属性摊平成普通 dict。"""
        t = self.get(res_path)
        if t is None:
            return None
        out = {'@路径': res_path, '@脚本': t.script}
        for k, v in t.resource.items():
            if k == 'script':
                continue
            out[k] = self.deref(v, t, depth)
        return out

    def by_script(self, script_res):
        """所有挂了指定脚本的资源，按路径排序。"""
        return sorted(p for p, t in self.files.items() if t.script == script_res)


def main(argv):
    setup_stdout()
    from brotato_common import ROOT
    res = argv[0] if argv else os.path.join(ROOT, '资源')
    out = argv[1] if len(argv) > 1 else os.path.join(ROOT, '配置', '资源JSON')
    proj = Project(res)
    print('载入 %d 个文本资源' % len(proj.files))
    ensure(out)
    pg = Progress(len(proj.files), '转 JSON')
    for p, t in sorted(proj.files.items()):
        rel = p[len('res://'):]
        dst = os.path.join(out, os.path.splitext(rel)[0].replace('/', os.sep) + '.json')
        obj = {'类型': t.header.get('type', t.kind), '脚本': t.script,
               '外部引用': {str(k): v.get('path', '') for k, v in sorted(t.ext.items())},
               '属性': t.resource}
        if t.nodes:
            obj['节点'] = t.nodes
        if t.sub:
            obj['内部资源'] = {str(k): v for k, v in sorted(t.sub.items())}
        write_json(dst, obj)
        pg.tick()
    print('写出 %d 个 JSON -> %s' % (len(proj.files), out))


if __name__ == '__main__':
    main(sys.argv[1:])
