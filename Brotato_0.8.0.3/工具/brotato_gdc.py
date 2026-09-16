# -*- coding: utf-8 -*-
"""GDScript 字节码(`.gdc`) -> 可读源码。

Godot 3.x 的 `.gdc` **不是虚拟机字节码，是 tokenizer 的输出**（一串 token + 标识符表 +
常量表 + 行号表），所以"反编译"实质是逆 token 化，能还原到接近原文的程度；丢的只有注释、
空行和字面量的原始写法（`0x10` 会变成 `16`）。

三张表(token 名序、内置函数序、内置类型序)不是凭记忆写的，是从本包自带的
`lib/arm64-v8a/libgodot_android.so`(Godot 3.5.1.stable) 的 .rodata 指针数组里读出来的，
复现方式见 `dump_tables()`。这点很重要：3.5 的 27 号内置函数是 `decimals`、
28 号才是 `step_decimals`，凭 Godot 4 的印象写会整体错位一格。

用法:
    python brotato_gdc.py <资源目录> <源码输出目录>
    python brotato_gdc.py --tables <libgodot_android.so>   # 重新核对三张表
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import struct

from brotato_common import ensure, setup_stdout, write_csv, Progress
from godot_fmt import _R, decode_variant

BYTECODE_VERSION = 13
TOKEN_BYTE_MASK = 0x80
TOKEN_BITS = 8
TOKEN_MASK = (1 << TOKEN_BITS) - 1

# --- token 序：libgodot_android.so 的 GDScriptTokenizer::token_names[]，98 项 -----
TK = [
    'Empty', 'Identifier', 'Constant', 'self', 'BuiltInType', 'BuiltInFunc', 'in',
    '==', '!=', '<', '<=', '>', '>=', 'and', 'or', 'not',
    '+', '-', '*', '/', '%', '<<', '>>',
    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '|=', '^=',
    '&', '|', '^', '~',
    'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'pass', 'return', 'match',
    'func', 'class', 'class_name', 'extends', 'is', 'onready', 'tool', 'static', 'export',
    'setget', 'const', 'var', 'as', 'void', 'enum', 'preload', 'assert', 'yield', 'signal',
    'breakpoint', 'remote', 'sync', 'master', 'puppet', 'slave', 'remotesync', 'mastersync',
    'puppetsync',
    '[', ']', '{', '}', '(', ')', ',', ';', '.', '?', ':', '$', '->', 'NEWLINE',
    'PI', 'TAU', '_', 'INF', 'NAN', 'Error', 'EOF', 'Cursor',
]
(T_EMPTY, T_IDENT, T_CONST, T_SELF, T_TYPE, T_FUNC, T_IN) = range(7)
T_NOT = 15
T_SUB = 17
T_IF, T_ELIF, T_ELSE = 38, 39, 40
T_PR_FUNCTION, T_PR_CLASS = 48, 49
T_PR_EXPORT = 56
T_PR_ENUM = 62
T_BRACKET_OPEN, T_BRACKET_CLOSE = 76, 77
T_CURLY_OPEN, T_CURLY_CLOSE = 78, 79
T_PAREN_OPEN, T_PAREN_CLOSE = 80, 81
T_COMMA, T_SEMICOLON, T_PERIOD, T_QUESTION, T_COLON, T_DOLLAR, T_ARROW = 82, 83, 84, 85, 86, 87, 88
T_NEWLINE = 89
T_ERROR, T_EOF, T_CURSOR = 95, 96, 97

# --- 内置函数序：GDScriptFunctions 的名表，90 项(sin..deep_equal) ----------------
BUILTIN_FUNCS = [
    'sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'asin', 'acos', 'atan', 'atan2',
    'sqrt', 'fmod', 'fposmod', 'posmod', 'floor', 'ceil', 'round', 'abs', 'sign',
    'pow', 'log', 'exp', 'is_nan', 'is_inf', 'is_equal_approx', 'is_zero_approx',
    'ease', 'decimals', 'step_decimals', 'stepify', 'lerp', 'lerp_angle',
    'inverse_lerp', 'range_lerp', 'smoothstep', 'move_toward', 'dectime',
    'randomize', 'randi', 'randf', 'rand_range', 'seed', 'rand_seed', 'deg2rad',
    'rad2deg', 'linear2db', 'db2linear', 'polar2cartesian', 'cartesian2polar',
    'wrapi', 'wrapf', 'max', 'min', 'clamp', 'nearest_po2', 'weakref', 'funcref',
    'convert', 'typeof', 'type_exists', 'char', 'ord', 'str', 'print', 'printt',
    'prints', 'printerr', 'printraw', 'print_debug', 'push_error', 'push_warning',
    'var2str', 'str2var', 'var2bytes', 'bytes2var', 'range', 'load', 'inst2dict',
    'dict2inst', 'validate_json', 'parse_json', 'to_json', 'hash', 'Color8',
    'ColorN', 'print_stack', 'get_stack', 'instance_from_id', 'len',
    'is_instance_valid', 'deep_equal',
]

# --- 内置类型序：Variant::Type **枚举**顺序(不是 tokenizer 的关键字表顺序) -------
BUILTIN_TYPES = [
    'null', 'bool', 'int', 'float', 'String', 'Vector2', 'Rect2', 'Vector3',
    'Transform2D', 'Plane', 'Quat', 'AABB', 'Basis', 'Transform', 'Color',
    'NodePath', 'RID', 'Object', 'Dictionary', 'Array', 'PoolByteArray',
    'PoolIntArray', 'PoolRealArray', 'PoolStringArray', 'PoolVector2Array',
    'PoolVector3Array', 'PoolColorArray',
]


# ------------------------------------------------------------------ 读字节码
class GDC(object):
    def __init__(self, data):
        if data[:4] != b'GDSC':
            raise ValueError('不是 GDSC: %r' % data[:4])
        self.version = struct.unpack_from('<I', data, 4)[0]
        n_ident, n_const, n_line, n_tok = struct.unpack_from('<4I', data, 8)
        r = _R(data, 24)
        self.identifiers = []
        for _ in range(n_ident):
            ln = r.u32()
            b = bytes(c ^ 0xB6 for c in r.raw(ln))     # 标识符逐字节异或 0xB6
            self.identifiers.append(b.split(b'\x00', 1)[0].decode('utf-8', 'replace'))
        self.constants = [decode_variant(r) for _ in range(n_const)]
        self.lines = {}
        for _ in range(n_line):
            t = r.u32()
            self.lines[t] = r.u32()
        self.tokens = []
        while len(self.tokens) < n_tok:
            if r.d[r.p] & TOKEN_BYTE_MASK:
                self.tokens.append(r.u32() & ~TOKEN_BYTE_MASK)
            else:
                self.tokens.append(r.u8())

    def kind(self, i):
        return self.tokens[i] & TOKEN_MASK

    def val(self, i):
        return self.tokens[i] >> TOKEN_BITS


# ------------------------------------------------------------------ 字面量
_ESC = {'\\': '\\\\', '"': '\\"', '\n': '\\n', '\t': '\\t', '\r': '\\r'}


def _quote(s):
    return '"' + ''.join(_ESC.get(c, c) for c in s) + '"'


def literal(v):
    if v is None:
        return 'null'
    if v is True:
        return 'true'
    if v is False:
        return 'false'
    if isinstance(v, str):
        return _quote(v)
    if isinstance(v, float):
        t = repr(v)
        return t
    if isinstance(v, int):
        return str(v)
    if isinstance(v, list):
        return '[ ' + ', '.join(literal(x) for x in v) + ' ]' if v else '[  ]'
    if isinstance(v, dict):
        if not v:
            return '{  }'
        return '{ ' + ', '.join('%s: %s' % (literal(k), literal(x)) for k, x in v.items()) + ' }'
    if isinstance(v, tuple):
        head = v[0]
        if head == 'NodePath':
            return '@' + _quote(v[1])
        if head in ('PoolByteArray', 'PoolIntArray', 'PoolRealArray', 'PoolStringArray',
                    'PoolVector2Array', 'PoolVector3Array', 'PoolColorArray'):
            return '%s( %s )' % (head, ', '.join(literal(x) for x in v[1]))
        return '%s( %s )' % (head, ', '.join(literal(x) for x in v[1:]))
    return repr(v)


# ------------------------------------------------------------------ 拼回源码
_NO_SPACE_BEFORE = {T_COMMA, T_SEMICOLON, T_PERIOD, T_COLON, T_PAREN_CLOSE,
                    T_BRACKET_CLOSE, T_CURLY_CLOSE, T_QUESTION}
_NO_SPACE_AFTER = {T_PERIOD, T_DOLLAR, T_PAREN_OPEN, T_BRACKET_OPEN, T_CURLY_OPEN}
T_RETURN = 46
T_ADD = 16
T_ASSIGN = 23
# 跟在这些 token 后面的 '-' / '+' 是一元号：后面不留空格
_UNARY_CTX = ({T_COMMA, T_COLON, T_PAREN_OPEN, T_BRACKET_OPEN, T_CURLY_OPEN, T_ARROW,
               T_NEWLINE, T_RETURN, T_IN, T_NOT}
              | set(range(7, 38)))          # 所有运算符


def text_of(g, i):
    k = g.kind(i)
    if k == T_IDENT:
        return g.identifiers[g.val(i)]
    if k == T_CONST:
        return literal(g.constants[g.val(i)])
    if k == T_TYPE:
        v = g.val(i)
        return BUILTIN_TYPES[v] if v < len(BUILTIN_TYPES) else 'Type%d' % v
    if k == T_FUNC:
        v = g.val(i)
        return BUILTIN_FUNCS[v] if v < len(BUILTIN_FUNCS) else 'func%d' % v
    if k == T_ERROR:
        return '<错误>'
    if k < len(TK):
        return TK[k]
    return '<tk%d>' % k


def decompile(data):
    g = GDC(data)
    out = []
    line = []
    indent = 0
    prev = T_NEWLINE
    for i in range(len(g.tokens)):
        k = g.kind(i)
        if k == T_EOF:
            break
        if k == T_NEWLINE:
            out.append('\t' * indent + ''.join(line).rstrip() if line else '')
            line = []
            indent = g.val(i)
            prev = T_NEWLINE
            continue
        if k in (T_EMPTY, T_CURSOR):
            continue
        t = text_of(g, i)
        if line:
            sp = True
            if k == T_PERIOD:
                # `a.b` 不留空格，但 `= .get_x()`(父类调用) 的点前要留
                sp = prev not in (T_IDENT, T_CONST, T_SELF, T_TYPE, T_FUNC,
                                  T_PAREN_CLOSE, T_BRACKET_CLOSE, T_CURLY_CLOSE)
            elif k == T_ASSIGN and prev == T_COLON:
                sp = False                     # 与下面一条合起来把 `var x: = 1` 写成 `var x := 1`
            elif k == T_COLON and i + 1 < len(g.tokens) and g.kind(i + 1) == T_ASSIGN:
                sp = True
            elif k in _NO_SPACE_BEFORE or prev in _NO_SPACE_AFTER:
                sp = False
            elif k in (T_PAREN_OPEN, T_BRACKET_OPEN):
                # 调用/下标紧贴前面的名字；`in (`、`if (` 之类留空格
                if prev in (T_IDENT, T_FUNC, T_TYPE, T_SELF, T_PAREN_CLOSE,
                            T_BRACKET_CLOSE, T_PR_EXPORT):
                    sp = False
            if sp:
                line.append(' ')
        line.append(t)
        # 一元 +/- 后面不留空格：借用"句点"的后置语义
        if k in (T_ADD, T_SUB) and prev in _UNARY_CTX:
            prev = T_PERIOD
        else:
            prev = k
    if line:
        out.append('\t' * indent + ''.join(line).rstrip())
    while out and not out[-1].strip():
        out.pop()
    return '\n'.join(out) + '\n'


# ------------------------------------------------------------------ 表的复现
def dump_tables(so_path):
    """从 libgodot_android.so 重新读出三张表，核对本文件里硬编码的常量。"""
    with open(so_path, 'rb') as f:
        d = f.read()

    def cstr(va, maxlen=60):
        if va <= 0 or va >= len(d):
            return None
        j = d.find(b'\x00', va)
        if j < 0 or j - va > maxlen:
            return None
        try:
            return d[va:j].decode('utf-8')
        except Exception:
            return None

    def table_at(anchor_str, back, count):
        i = d.find(b'\x00' + anchor_str + b'\x00') + 1
        needle = struct.pack('<Q', i)
        j = d.find(needle)
        base = j - back * 24            # 表是 24 字节步长的结构数组，名字在 +16
        return [cstr(struct.unpack_from('<Q', d, base + k * 24)[0]) for k in range(count)]

    funcs = table_at(b'polar2cartesian', 47, 90)
    toks = table_at(b"'=='", 7, 98)
    print('内置函数 %d 项，与硬编码一致: %s' % (len(funcs), funcs == BUILTIN_FUNCS))
    if funcs != BUILTIN_FUNCS:
        for a, b in zip(funcs, BUILTIN_FUNCS):
            if a != b:
                print('  差异 %r != %r' % (a, b))
    print('token 名 %d 项，首尾: %r .. %r' % (len(toks), toks[0], toks[-1]))
    return funcs, toks


# ------------------------------------------------------------------ 批量
def run(src_dir, out_dir):
    setup_stdout()
    ensure(out_dir)
    targets = []
    for root, _dirs, files in os.walk(src_dir):
        for fn in files:
            if fn.endswith('.gdc'):
                targets.append(os.path.join(root, fn))
    targets.sort()
    rows = []
    errs = []
    pg = Progress(len(targets), '反编译')
    for p in targets:
        rel = os.path.relpath(p, src_dir).replace('\\', '/')
        dst = os.path.join(out_dir, rel[:-4] + '.gd')
        ensure(os.path.dirname(dst))
        try:
            with open(p, 'rb') as f:
                data = f.read()
            src = decompile(data)
            with open(dst, 'w', encoding='utf-8', newline='\n') as f:
                f.write(src)
            g = GDC(data)
            rows.append([rel[:-4] + '.gd', len(src.splitlines()), len(g.identifiers),
                         len(g.constants), len(g.tokens)])
        except Exception as e:
            errs.append('%s\t%s' % (rel, e))
        pg.tick()
    # 明文随包发的 .gd 一起搬过去（导出时漏编译的那几个）
    plain = 0
    for root, _dirs, files in os.walk(src_dir):
        for fn in files:
            if fn.endswith('.gd'):
                p = os.path.join(root, fn)
                rel = os.path.relpath(p, src_dir).replace('\\', '/')
                dst = os.path.join(out_dir, rel)
                ensure(os.path.dirname(dst))
                with open(p, 'rb') as f:
                    b = f.read()
                with open(dst, 'wb') as f:
                    f.write(b)
                rows.append([rel, len(b.decode('utf-8', 'replace').splitlines()), '', '', '明文'])
                plain += 1
    rows.sort()
    write_csv(os.path.join(out_dir, '_索引.csv'),
              ['脚本', '行数', '标识符数', '常量数', 'token数'], rows)
    with open(os.path.join(out_dir, '_错误.txt'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(errs))
    print('反编译 %d 个 .gdc，随包明文 .gd %d 个，失败 %d' % (len(targets) - len(errs), plain, len(errs)))
    return rows


def main(argv):
    setup_stdout()
    if argv and argv[0] == '--tables':
        dump_tables(argv[1])
        return
    from brotato_common import ROOT
    src = argv[0] if argv else os.path.join(ROOT, '资源')
    out = argv[1] if len(argv) > 1 else os.path.join(ROOT, '源码')
    run(src, out)


if __name__ == '__main__':
    main(sys.argv[1:])
