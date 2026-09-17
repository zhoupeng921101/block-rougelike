# -*- coding: utf-8 -*-
"""Brotato(土豆兄弟) APK -> 资源/ + 图片资源/ + 音频/ + 安卓壳/

包里**没有任何加密**：Godot 3.5.1 导出的 Android 包把 PCK 摊开成了 `assets/` 目录树，
`.tres`/`.tscn`/`.import` 全是明文，只有三类要解：
  - `.gdc`  GDScript 字节码       -> `brotato_gdc.py`
  - `.stex` StreamTexture(内嵌 WebP) -> 本脚本
  - `.sample`/`.mp3str`/`.oggstr` 音频   -> 本脚本
资源本体都躺在扁平的 `assets/.import/` 下，原始路径写在各自的 `*.import` 文本里。

用法:
    python brotato_unpack.py [apk路径] [输出目录] [--dry]
"""
import os
import re
import sys
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import struct

from brotato_common import APK, ROOT, Progress, ensure, setup_stdout, write_csv
from godot_fmt import BinResource, stex_payload

TEXT_EXT = ('.tres', '.tscn', '.import', '.gd', '.remap', '.json', '.gdshader',
            '.cfg', '.txt', '.md', '.csv')


def parse_import(text):
    """`*.import` -> (源 res 路径, 落盘 res 路径)"""
    m = re.search(r'^path="([^"]+)"', text, re.M)
    if not m:
        m = re.search(r'^path\.s3tc="([^"]+)"', text, re.M)
    s = re.search(r'^source_file="([^"]+)"', text, re.M)
    if not m or not s:
        return None
    return s.group(1), m.group(1)


def sample_to_wav(props):
    """AudioStreamSample -> WAV 字节。format: 0=8bit 1=16bit 2=IMA-ADPCM"""
    data = props.get('data') or b''
    fmt = props.get('format', 1)
    rate = props.get('mix_rate', 44100)
    stereo = 2 if props.get('stereo') else 1
    if fmt == 0:
        bits = 8
    elif fmt == 1:
        bits = 16
    else:
        raise ValueError('IMA-ADPCM 未解码')
    byte_rate = rate * stereo * bits // 8
    block = stereo * bits // 8
    hdr = b'RIFF' + struct.pack('<I', 36 + len(data)) + b'WAVEfmt ' + \
        struct.pack('<IHHIIHH', 16, 1, stereo, rate, byte_rate, block, bits) + \
        b'data' + struct.pack('<I', len(data))
    return hdr + data


def run(apk, out_dir, dry=False):
    setup_stdout()
    z = zipfile.ZipFile(apk)
    names = z.namelist()
    res_dir = os.path.join(out_dir, '资源')
    img_dir = os.path.join(out_dir, '图片资源')
    aud_dir = os.path.join(out_dir, '音频')
    shell_dir = os.path.join(out_dir, '安卓壳')
    rows = []
    errs = []

    # 1. 资源树（.import/ 下的二进制本体单独处理，不进 资源/）
    tree = [n for n in names
            if n.startswith('assets/') and not n.startswith('assets/.import/')
            and not n.endswith('/')]
    print('资源树 %d 个文件' % len(tree))
    pg = Progress(len(tree), '还原资源树')
    for n in tree:
        rel = n[len('assets/'):]
        b = z.read(n)
        if not dry:
            dst = os.path.join(res_dir, rel.replace('/', os.sep))
            ensure(os.path.dirname(dst))
            with open(dst, 'wb') as f:
                f.write(b)
        rows.append(['资源/' + rel, os.path.splitext(rel)[1] or '(无)', len(b), '原样'])
        pg.tick()

    # 2. 建 .import 映射：res://.import/xxx.stex -> 原始 res:// 路径
    imports = {}
    for n in tree:
        if n.endswith('.import'):
            pair = parse_import(z.read(n).decode('utf-8', 'replace'))
            if pair:
                src, dest = pair
                imports[dest] = src
    print('.import 映射 %d 条' % len(imports))

    # 3. 图片：.stex -> png
    stex = [n for n in names if n.endswith('.stex')]
    pg = Progress(len(stex), '解纹理')
    n_png = 0
    for n in stex:
        res = 'res://.import/' + n.split('/')[-1]
        src = imports.get(res)
        if not src:
            errs.append('%s\t没有对应的 .import 源路径' % n)
            pg.tick()
            continue
        rel = src[len('res://'):]
        try:
            w, h, payload, ext = stex_payload(z.read(n))
            if not dry:
                dst = os.path.join(img_dir, os.path.splitext(rel)[0].replace('/', os.sep) + '.png')
                ensure(os.path.dirname(dst))
                if ext == '.png':
                    with open(dst, 'wb') as f:
                        f.write(payload)
                else:
                    import io as _io
                    from PIL import Image
                    Image.open(_io.BytesIO(payload)).save(dst)
            rows.append(['图片资源/' + os.path.splitext(rel)[0] + '.png', '.png',
                         len(payload), 'stex%s %dx%d' % (ext, w, h)])
            n_png += 1
        except Exception as e:
            errs.append('%s\t%s' % (n, e))
        pg.tick()

    # 4. 音频
    audio = [n for n in names if n.endswith(('.sample', '.mp3str', '.oggstr'))]
    pg = Progress(len(audio), '解音频')
    n_aud = 0
    for n in audio:
        res = 'res://.import/' + n.split('/')[-1]
        src = imports.get(res)
        if not src:
            errs.append('%s\t没有对应的 .import 源路径' % n)
            pg.tick()
            continue
        rel = src[len('res://'):]
        try:
            br = BinResource(z.read(n))
            p = br.main
            if n.endswith('.sample'):
                blob, ext = sample_to_wav(p), '.wav'
            else:
                blob = p.get('data') or b''
                ext = '.mp3' if n.endswith('.mp3str') else '.ogg'
            if not dry:
                dst = os.path.join(aud_dir, os.path.splitext(rel)[0].replace('/', os.sep) + ext)
                ensure(os.path.dirname(dst))
                with open(dst, 'wb') as f:
                    f.write(blob)
            rows.append(['音频/' + os.path.splitext(rel)[0] + ext, ext, len(blob), br.type])
            n_aud += 1
        except Exception as e:
            errs.append('%s\t%s' % (n, e))
        pg.tick()

    # 5. 安卓壳
    shell = [n for n in names
             if n in ('AndroidManifest.xml', 'resources.arsc', 'kotlin-tooling-metadata.json')
             or n.endswith('.dex') or n.startswith('lib/')]
    for n in shell:
        b = z.read(n)
        if not dry:
            dst = os.path.join(shell_dir, n.replace('/', os.sep))
            ensure(os.path.dirname(dst))
            with open(dst, 'wb') as f:
                f.write(b)
        rows.append(['安卓壳/' + n, os.path.splitext(n)[1] or '(无)', len(b), '原样'])

    rows.sort()
    if not dry:
        write_csv(os.path.join(out_dir, '_索引.csv'),
                  ['落盘路径', '扩展名', '字节', '来源'], rows)
        with open(os.path.join(out_dir, '_错误.txt'), 'w', encoding='utf-8') as f:
            f.write('\n'.join(errs))
    print('资源树 %d，图片 %d，音频 %d，安卓壳 %d，错误 %d'
          % (len(tree), n_png, n_aud, len(shell), len(errs)))
    return rows, errs


def main(argv):
    apk = argv[0] if argv and not argv[0].startswith('--') else APK
    rest = [a for a in argv[1:] if not a.startswith('--')]
    out = rest[0] if rest else ROOT
    run(apk, out, dry='--dry' in argv)


if __name__ == '__main__':
    main(sys.argv[1:])
