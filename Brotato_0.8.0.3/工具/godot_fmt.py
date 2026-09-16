# -*- coding: utf-8 -*-
"""Godot 3.5 的几种私有二进制格式读取器（只读，不写回）。

覆盖三件事：
  1. marshalls 版 decode_variant —— `.gdc` 常量表用的就是这套（网络/序列化格式）
  2. RSRC 二进制资源（`.translation` / `.sample` / `.mp3str` / `.oggstr` / `.scn`）
     —— 与 1 是**两套不同的 variant 编码**，别混用
  3. StreamTexture（`.stex`）—— 取出内嵌的 PNG/WebP 字节
  4. PHashTranslation —— 只存 key 的哈希，查词必须先有 key 名单

出处对应 Godot 3.5.1 的 core/io/marshalls.cpp、core/io/resource_format_binary.cpp、
scene/resources/texture.cpp、core/translation.cpp、thirdparty/misc/smaz.c。
"""
import struct

# ---------------------------------------------------------------- Variant 类型号
(NIL, BOOL, INT, REAL, STRING, VECTOR2, RECT2, VECTOR3, TRANSFORM2D, PLANE,
 QUAT, AABB, BASIS, TRANSFORM, COLOR, NODE_PATH, _RID, OBJECT, DICTIONARY, ARRAY,
 POOL_BYTE_ARRAY, POOL_INT_ARRAY, POOL_REAL_ARRAY, POOL_STRING_ARRAY,
 POOL_VECTOR2_ARRAY, POOL_VECTOR3_ARRAY, POOL_COLOR_ARRAY) = range(27)

ENCODE_MASK = 0xFF
ENCODE_FLAG_64 = 1 << 16


class _R(object):
    """小端顺序读游标。"""

    def __init__(self, data, pos=0):
        self.d = data
        self.p = pos

    def u8(self):
        v = self.d[self.p]
        self.p += 1
        return v

    def u16(self):
        v = struct.unpack_from('<H', self.d, self.p)[0]
        self.p += 2
        return v

    def u32(self):
        v = struct.unpack_from('<I', self.d, self.p)[0]
        self.p += 4
        return v

    def i32(self):
        v = struct.unpack_from('<i', self.d, self.p)[0]
        self.p += 4
        return v

    def u64(self):
        v = struct.unpack_from('<Q', self.d, self.p)[0]
        self.p += 8
        return v

    def i64(self):
        v = struct.unpack_from('<q', self.d, self.p)[0]
        self.p += 8
        return v

    def f32(self):
        v = struct.unpack_from('<f', self.d, self.p)[0]
        self.p += 4
        return v

    def f64(self):
        v = struct.unpack_from('<d', self.d, self.p)[0]
        self.p += 8
        return v

    def raw(self, n):
        v = self.d[self.p:self.p + n]
        self.p += n
        return v

    def pad4(self, n):
        extra = 4 - (n % 4)
        if extra < 4:
            self.p += extra


def _clean(f):
    """-0.0 / 整值 float 打印得好看一点。"""
    if f == int(f) and abs(f) < 1e15:
        return int(f)
    return round(f, 6)


# ---------------------------------------------------------------- 1. marshalls
def decode_variant(r):
    """core/io/marshalls.cpp::decode_variant。`.gdc` 常量表用这套。"""
    t = r.u32()
    ty = t & ENCODE_MASK
    f64 = bool(t & ENCODE_FLAG_64)
    if ty == NIL:
        return None
    if ty == BOOL:
        return bool(r.u32())
    if ty == INT:
        return r.i64() if f64 else r.i32()
    if ty == REAL:
        return _clean(r.f64() if f64 else r.f32())
    if ty == STRING:
        n = r.u32()
        s = r.raw(n).decode('utf-8', 'replace')
        r.pad4(n)
        return s
    if ty == VECTOR2:
        return ('Vector2', _clean(r.f32()), _clean(r.f32()))
    if ty == RECT2:
        return ('Rect2',) + tuple(_clean(r.f32()) for _ in range(4))
    if ty == VECTOR3:
        return ('Vector3',) + tuple(_clean(r.f32()) for _ in range(3))
    if ty == TRANSFORM2D:
        return ('Transform2D',) + tuple(_clean(r.f32()) for _ in range(6))
    if ty == PLANE:
        return ('Plane',) + tuple(_clean(r.f32()) for _ in range(4))
    if ty == QUAT:
        return ('Quat',) + tuple(_clean(r.f32()) for _ in range(4))
    if ty == AABB:
        return ('AABB',) + tuple(_clean(r.f32()) for _ in range(6))
    if ty == BASIS:
        return ('Basis',) + tuple(_clean(r.f32()) for _ in range(9))
    if ty == TRANSFORM:
        return ('Transform',) + tuple(_clean(r.f32()) for _ in range(12))
    if ty == COLOR:
        return ('Color',) + tuple(_clean(r.f32()) for _ in range(4))
    if ty == NODE_PATH:
        strlen = r.u32()
        if strlen & 0x80000000:
            namecount = strlen & 0x7FFFFFFF
            subnamecount = r.u32()
            flags = r.u32()
            absolute = bool(flags & 1)
            parts = []
            for _ in range(namecount + subnamecount):
                n = r.u32()
                parts.append(r.raw(n).decode('utf-8', 'replace'))
                r.pad4(n)
            p = '/'.join(parts[:namecount])
            if subnamecount:
                p += ':' + ':'.join(parts[namecount:])
            return ('NodePath', ('/' if absolute else '') + p)
        s = r.raw(strlen).decode('utf-8', 'replace')
        r.pad4(strlen)
        return ('NodePath', s)
    if ty == _RID:
        return ('RID', r.u32())
    if ty == OBJECT:
        return ('Object', r.u64() if f64 else r.u32())
    if ty == DICTIONARY:
        n = r.u32() & 0x7FFFFFFF
        d = {}
        for _ in range(n):
            k = decode_variant(r)
            v = decode_variant(r)
            d[k if isinstance(k, (str, int, float, bool)) else repr(k)] = v
        return d
    if ty == ARRAY:
        n = r.u32() & 0x7FFFFFFF
        return [decode_variant(r) for _ in range(n)]
    if ty == POOL_BYTE_ARRAY:
        n = r.u32()
        b = r.raw(n)
        r.pad4(n)
        return ('PoolByteArray', list(b))
    if ty == POOL_INT_ARRAY:
        n = r.u32()
        return ('PoolIntArray', [r.i32() for _ in range(n)])
    if ty == POOL_REAL_ARRAY:
        n = r.u32()
        return ('PoolRealArray', [_clean(r.f32()) for _ in range(n)])
    if ty == POOL_STRING_ARRAY:
        n = r.u32()
        out = []
        for _ in range(n):
            ln = r.u32()
            out.append(r.raw(ln).decode('utf-8', 'replace'))
            r.pad4(ln)
        return ('PoolStringArray', out)
    if ty == POOL_VECTOR2_ARRAY:
        n = r.u32()
        return ('PoolVector2Array', [(_clean(r.f32()), _clean(r.f32())) for _ in range(n)])
    if ty == POOL_VECTOR3_ARRAY:
        n = r.u32()
        return ('PoolVector3Array', [tuple(_clean(r.f32()) for _ in range(3)) for _ in range(n)])
    if ty == POOL_COLOR_ARRAY:
        n = r.u32()
        return ('PoolColorArray', [tuple(_clean(r.f32()) for _ in range(4)) for _ in range(n)])
    raise ValueError('未知 variant 类型 %d' % ty)


# ---------------------------------------------------------------- 2. RSRC
V_NIL, V_BOOL, V_INT, V_REAL, V_STRING = 1, 2, 3, 4, 5
V_VECTOR2, V_RECT2, V_VECTOR3, V_PLANE, V_QUAT = 10, 11, 12, 13, 14
V_AABB, V_MATRIX3, V_TRANSFORM, V_MATRIX32 = 15, 16, 17, 18
V_COLOR, V_IMAGE, V_NODE_PATH, V_RID, V_OBJECT = 20, 21, 22, 23, 24
V_INPUT_EVENT, V_DICTIONARY = 25, 26
V_ARRAY, V_RAW_ARRAY, V_INT_ARRAY, V_REAL_ARRAY = 30, 31, 32, 33
V_STRING_ARRAY, V_VECTOR3_ARRAY, V_COLOR_ARRAY, V_VECTOR2_ARRAY = 34, 35, 36, 37
V_INT64, V_DOUBLE = 40, 41

OBJ_EMPTY, OBJ_EXT, OBJ_INT, OBJ_EXT_INDEX = 0, 1, 2, 3


class BinResource(object):
    """core/io/resource_format_binary.cpp 的读侧。

    读完后：
      .type      顶层资源类型名
      .ext       [(type, path), ...]
      .resources [(type, {属性名: 值}), ...]  最后一个是主资源
    """

    def __init__(self, data):
        if data[:4] == b'RSCC':
            raise NotImplementedError('RSCC(LZ4 压缩的二进制资源) 本包没出现，未实现')
        if data[:4] != b'RSRC':
            raise ValueError('不是 RSRC 二进制资源: %r' % data[:4])
        r = _R(data, 4)
        self.big_endian = r.u32()
        self.use_real64 = r.u32()
        self.ver_major = r.u32()
        self.ver_minor = r.u32()
        self.ver_format = r.u32()
        self.type = self._ustr(r)
        self.importmd_ofs = r.u64()
        self.flags = r.u32()
        for _ in range(13):
            r.u32()
        n = r.u32()
        self.string_map = [self._ustr(r) for _ in range(n)]
        n = r.u32()
        self.ext = [(self._ustr(r), self._ustr(r)) for _ in range(n)]
        n = r.u32()
        self.internal = [(self._ustr(r), r.u64()) for _ in range(n)]
        self.resources = []
        for path, off in self.internal:
            rr = _R(data, off)
            rtype = self._ustr(rr)
            pc = rr.u32()
            props = {}
            for _ in range(pc):
                name = self._str(rr)
                props[name] = self._var(rr)
            self.resources.append((rtype, props))

    @property
    def main(self):
        return self.resources[-1][1] if self.resources else {}

    @staticmethod
    def _ustr(r):
        n = r.u32()
        if n == 0:
            return ''
        b = r.raw(n)
        return b.split(b'\x00', 1)[0].decode('utf-8', 'replace')

    def _str(self, r):
        i = r.u32()
        if i & 0x80000000:
            n = i & 0x7FFFFFFF
            if n == 0:
                return ''
            return r.raw(n).split(b'\x00', 1)[0].decode('utf-8', 'replace')
        return self.string_map[i]

    def _real(self, r):
        return r.f64() if self.use_real64 else r.f32()

    def _var(self, r):
        t = r.u32()
        if t == V_NIL:
            return None
        if t == V_BOOL:
            return bool(r.u32())
        if t == V_INT:
            return r.i32()
        if t == V_INT64:
            return r.i64()
        if t == V_REAL:
            return _clean(self._real(r))
        if t == V_DOUBLE:
            return _clean(r.f64())
        if t == V_STRING:
            return self._ustr(r)
        if t == V_VECTOR2:
            return ('Vector2', _clean(self._real(r)), _clean(self._real(r)))
        if t == V_RECT2:
            return ('Rect2',) + tuple(_clean(self._real(r)) for _ in range(4))
        if t == V_VECTOR3:
            return ('Vector3',) + tuple(_clean(self._real(r)) for _ in range(3))
        if t == V_PLANE:
            return ('Plane',) + tuple(_clean(self._real(r)) for _ in range(4))
        if t == V_QUAT:
            return ('Quat',) + tuple(_clean(self._real(r)) for _ in range(4))
        if t == V_AABB:
            return ('AABB',) + tuple(_clean(self._real(r)) for _ in range(6))
        if t == V_MATRIX32:
            return ('Transform2D',) + tuple(_clean(self._real(r)) for _ in range(6))
        if t == V_MATRIX3:
            return ('Basis',) + tuple(_clean(self._real(r)) for _ in range(9))
        if t == V_TRANSFORM:
            return ('Transform',) + tuple(_clean(self._real(r)) for _ in range(12))
        if t == V_COLOR:
            return ('Color',) + tuple(_clean(r.f32()) for _ in range(4))
        if t == V_NODE_PATH:
            namecount = r.u16()
            subnamecount = r.u16()
            absolute = bool(subnamecount & 0x8000)
            subnamecount &= 0x7FFF
            if self.ver_format <= 1:
                subnamecount += 1
            names = [self._str(r) for _ in range(namecount)]
            subs = [self._str(r) for _ in range(subnamecount)]
            p = ('/' if absolute else '') + '/'.join(names)
            if subs:
                p += ':' + ':'.join(subs)
            return ('NodePath', p)
        if t == V_RID:
            return ('RID', r.u32())
        if t == V_OBJECT:
            ot = r.u32()
            if ot == OBJ_EMPTY:
                return None
            if ot == OBJ_INT:
                return ('SubResource', r.u32())
            if ot == OBJ_EXT:
                return ('ExtResource', self._ustr(r), self._ustr(r))
            if ot == OBJ_EXT_INDEX:
                i = r.u32()
                if i < len(self.ext):
                    return ('ExtResource', self.ext[i][0], self.ext[i][1])
                return ('ExtResource', i)
            raise ValueError('未知 object 子类型 %d' % ot)
        if t == V_DICTIONARY:
            n = r.u32() & 0x7FFFFFFF
            d = {}
            for _ in range(n):
                k = self._var(r)
                v = self._var(r)
                d[k if isinstance(k, (str, int, float, bool)) else repr(k)] = v
            return d
        if t == V_ARRAY:
            n = r.u32() & 0x7FFFFFFF
            return [self._var(r) for _ in range(n)]
        if t == V_RAW_ARRAY:
            n = r.u32()
            b = r.raw(n)
            r.pad4(n)
            return b
        if t == V_INT_ARRAY:
            n = r.u32()
            return [r.i32() for _ in range(n)]
        if t == V_REAL_ARRAY:
            n = r.u32()
            return [_clean(r.f32()) for _ in range(n)]
        if t == V_STRING_ARRAY:
            n = r.u32()
            return [self._ustr(r) for _ in range(n)]
        if t == V_VECTOR2_ARRAY:
            n = r.u32()
            return [(_clean(r.f32()), _clean(r.f32())) for _ in range(n)]
        if t == V_VECTOR3_ARRAY:
            n = r.u32()
            return [tuple(_clean(r.f32()) for _ in range(3)) for _ in range(n)]
        if t == V_COLOR_ARRAY:
            n = r.u32()
            return [tuple(_clean(r.f32()) for _ in range(4)) for _ in range(n)]
        raise ValueError('未知 RSRC variant 类型 %d @%d' % (t, r.p))


# ---------------------------------------------------------------- 3. StreamTexture
def stex_payload(data):
    """`.stex` -> (宽, 高, 图片字节, 后缀)。只处理内嵌 PNG/WebP 的无损/有损分支。"""
    if data[:4] != b'GDST':
        raise ValueError('不是 GDST: %r' % data[:4])
    w = struct.unpack_from('<H', data, 4)[0]
    h = struct.unpack_from('<H', data, 8)[0]
    df = struct.unpack_from('<I', data, 16)[0]
    lossless = bool(df & (1 << 20))
    lossy = bool(df & (1 << 21))
    if not (lossless or lossy):
        raise ValueError('未压缩/VRAM 压缩的 stex，本包未出现 (df=0x%08x)' % df)
    # 20 之后是 mipmaps(4) + size(4)，随后 4 字节是 Godot 打的 'PNG '/'WEBP' 幌子
    png_sig = b'\x89PNG\r\n\x1a\n'
    i = data.find(png_sig, 24)
    if i >= 0:
        j = data.find(b'IEND', i)
        return w, h, data[i:j + 8], '.png'
    i = data.find(b'RIFF', 24)
    if i >= 0:
        size = struct.unpack_from('<I', data, i + 4)[0]
        return w, h, data[i:i + 8 + size], '.webp'
    raise ValueError('stex 里找不到 PNG/WebP 载荷')


# ---------------------------------------------------------------- 4. PHashTranslation
SMAZ_RCB = [
    " ", "the", "e", "t", "a", "of", "o", "and", "i", "n", "s", "e ", "r", " th",
    " t", "in", "he", "th", "h", "he ", "to", "\r\n", "l", "s ", "d", " a", "an",
    "er", "c", " o", "d ", "on", " of", "re", "of ", "t ", ", ", "is", "u", "at",
    "   ", "n ", "or", "which", "f", "m", "as", "it", "that", "\n", "was", "en",
    "  ", " w", "es", " an", " i", "\r", "f ", "g", "p", "nd", " s", "nd ", "ed ",
    "w", "ed", "http://", "for", "te", "ing", "y ", "The", " c", "ti", "r ", "his",
    "st", " in", "ar", "nt", ",", " to", "y", "ng", " h", "with", "le", "al", "to ",
    "b", "ou", "be", "were", " b", "se", "o ", "ent", "ha", "ng ", "their", "\"",
    "hi", "from", " f", "in ", "de", "ion", "me", "v", ".", "ve", "all", "re ",
    "ri", "ro", "is ", "co", "f t", "are", "ea", ". ", "her", " m", "er ", " p",
    "es ", "by", "they", "di", "ra", "ic", "not", "s, ", "d t", "at ", "ce", "la",
    "h ", "ne", "as ", "tio", "on ", "n t", "io", "we", " a ", "om", ", a", "s o",
    "ur", "li", "ll", "ch", "had", "this", "e t", "g ", "e\r\n", " wh", "ere",
    " co", "e o", "a ", "us", " d", "ss", "\n\r\n", "\r\n\r", "=\"", " be", " e",
    "s a", "ma", "one", "t t", "or ", "but", "el", "so", "l ", "e s", "s,", "no",
    "ter", " wa", "iv", "ho", "e a", " r", "hat", "s t", "ns", "ch ", "wh", "tr",
    "ut", "/", "have", "ly ", "ta", " ha", " on", "tha", "-", " l", "ati", "en ",
    "pe", " re", "there", "ass", "si", " fo", "wa", "ec", "our", "who", "its", "z",
    "fo", "rs", ">", "ot", "un", "<", "im", "th ", "nc", "ate", "><", "ver", "ad",
    " we", "ly", "ee", " n", "id", " cl", "ac", "il", "</", "rt", " wi", "div",
    "e, ", " it", "whi", " ma", "ge", "x", "e c", "men", ".com",
]


def smaz_decompress(buf):
    out = bytearray()
    i = 0
    n = len(buf)
    while i < n:
        c = buf[i]
        if c == 254:
            out.append(buf[i + 1])
            i += 2
        elif c == 255:
            ln = buf[i + 1] + 1
            out += buf[i + 2:i + 2 + ln]
            i += 2 + ln
        else:
            out += SMAZ_RCB[c].encode('latin-1')
            i += 1
    return bytes(out)


def _ph(d, s):
    """core/translation.cpp::PHashTranslation::hash"""
    if d == 0:
        d = 0x1000193
    for ch in s:
        d = ((d * 0x1000193) & 0xFFFFFFFF) ^ ch
    return d & 0xFFFFFFFF


class PHashTranslation(object):
    """哈希表式翻译：**只存 key 的哈希，不存 key 本身**，所以必须先有 key 名单。"""

    def __init__(self, data):
        br = BinResource(data)
        p = br.main
        self.locale = p.get('locale', '')
        self.hash_table = p.get('hash_table') or []
        self.bucket_table = p.get('bucket_table') or []
        self.strings = p.get('strings') or b''

    def get(self, key):
        htsize = len(self.hash_table)
        if htsize == 0:
            return None
        kb = key.encode('utf-8')
        h = _ph(0, kb)
        p = self.hash_table[h % htsize] & 0xFFFFFFFF
        if p == 0xFFFFFFFF:
            return None
        bt = self.bucket_table
        size = bt[p]
        func = bt[p + 1] & 0xFFFFFFFF
        h = _ph(func, kb)
        for i in range(size):
            base = p + 2 + i * 4
            if (bt[base] & 0xFFFFFFFF) == h:
                off = bt[base + 1] & 0xFFFFFFFF
                comp = bt[base + 2] & 0xFFFFFFFF
                unc = bt[base + 3] & 0xFFFFFFFF
                raw = self.strings[off:off + comp]
                if comp == unc:
                    return raw.split(b'\x00', 1)[0].decode('utf-8', 'replace')
                return smaz_decompress(raw)[:unc].decode('utf-8', 'replace')
        return None
