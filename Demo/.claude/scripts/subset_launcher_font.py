# -*- coding: utf-8 -*-
"""subset_launcher_font.py - 重新生成启动器专用子集字体 LauncherFont.otf。

用途
    启动器(热更前的启动 / 更新界面)跑在主包里,取不到热更资源里的 GBK.otf,字体必须随包发出。
    为省包体,LauncherFont.otf 只收启动器实际会显示的字,不是完整中文字库。

何时必须重跑
    给启动器加了新字时 —— 改 Assets/Launcher/ 下任何 .cs 引入了字体里没有的字(文案常量、
    ShowUI / ShowMessageBox 的参数,注释里的字也算)。不重跑的症状是新字静默不渲染:不报错、
    不显示方块,就是空白。
    漏跑由客户端自检的「启动器字体核对」拦下(.claude/devflow/启动器字体核对.ps1):它判
    「Assets/Launcher 下 .cs 的全部用字都在字体里」,判违规时的修法就是跑本脚本。

    只烤在 prefab 里、不出现在任何 .cs 的字进不了字体:本脚本只扫 .cs。启动器界面的文案要在
    .cs 里出现(常量赋值即可)。

前置条件
    python 与 fonttools(pip install fonttools)。
    源字体 Assets/AssetRaw/Fonts/GBK.otf 存在(思源黑体 SC,OFL 授权允许子集化再分发)。

用法
    python .claude/scripts/subset_launcher_font.py [<Demo 绝对路径>] [<输出 .otf 路径>]
    两个参数都可省:缺省改写**本脚本所在检出**的 Demo —— 在槽位里跑槽位那份脚本,
    改的就是槽位的字体。要改别的检出,第一个参数传那个 Demo。
    第二个参数可把产物输出到别处(先看体积或做比对),不动工程。

副作用
    原地覆盖 <Demo>/Assets/Launcher/Resources/Fonts/LauncherFont.otf 的内容。
    **不动同目录的 .meta**,所以 guid 不变,启动器两个 prefab 里的字体引用不需要跟着改。
    源码用字没变时重跑,产物与原文件逐字节相同,不产生改动。

调用后要做的事
    1. 字体改动与引入新字的源码改动放进同一次提交(产品资产,按 CLAUDE.md 的通道规则走)。
    2. 开着编辑器的话让它重新导入(失焦再聚焦,或 Assets > Refresh)。

字符集构成(改这里就改下面的 build_charset)
    ASCII 可打印          数字、MB/KB 单位、文件名、mm:ss、<color=#RRGGBB> 标签
    启动器源码全部字符    Assets/Launcher 下所有 .cs 的整文件用字(回车、换行、制表符除外)
    常用全角标点          文案改动时的常见增量,先备着
    界面上的动态插值不需要额外覆盖:异常 Message、YooAsset Error、下载文件名全是英文。
    「启动器源码全部字符」这一项的扫描面与排除字符就是 启动器字体核对.ps1 的判据,两边须一致。
"""
import glob
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

FAMILY = "LauncherFont"
REL_SRC = os.path.join("Assets", "AssetRaw", "Fonts", "GBK.otf")
REL_OUT = os.path.join("Assets", "Launcher", "Resources", "Fonts", "LauncherFont.otf")
REL_SCAN = os.path.join("Assets", "Launcher")


def build_charset(unity_root):
    chars = set(chr(c) for c in range(0x20, 0x7F))
    for path in glob.glob(os.path.join(unity_root, REL_SCAN, "**", "*.cs"), recursive=True):
        with open(path, "r", encoding="utf-8-sig") as fh:
            for ch in fh.read():
                if ch not in "\r\n\t":
                    chars.add(ch)
    chars.update("　·—…‘’“”《》【】%‰")
    return chars


def main():
    # 本脚本在 <Demo>/.claude/scripts/ 下,往上两级即所在检出的 Demo。
    here = os.path.dirname(os.path.abspath(__file__))
    default_root = os.path.dirname(os.path.dirname(here))
    unity_root = sys.argv[1] if len(sys.argv) > 1 else default_root
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(unity_root, REL_OUT)
    src = os.path.join(unity_root, REL_SRC)

    if not os.path.isfile(src):
        sys.exit("source font not found: " + src)

    text = "".join(sorted(build_charset(unity_root)))

    opts = subset.Options()
    opts.layout_features = []          # Legacy UGUI Text 不用 OpenType 排版特性
    opts.name_IDs = ["*"]
    opts.name_legacy = True
    opts.notdef_outline = True
    opts.recalc_bounds = True
    opts.drop_tables += ["DSIG"]
    opts.desubroutinize = True         # CFF 去子程序化,避免子集后字形引用残缺

    font = subset.load_font(src, opts)
    subsetter = subset.Subsetter(options=opts)
    subsetter.populate(text=text)
    subsetter.subset(font)

    # 改 family name,与 bundle 里的 GBK.otf(Source Han Sans SC)区分,避免同名互相 fallback
    for rec in font["name"].names:
        if rec.nameID in (1, 16):
            rec.string = FAMILY
        elif rec.nameID == 6:
            rec.string = FAMILY + "-Regular"
        elif rec.nameID in (3, 4):
            rec.string = FAMILY + " Regular"

    os.makedirs(os.path.dirname(out), exist_ok=True)
    subset.save_font(font, out, opts)
    font.close()

    check = TTFont(out)
    cmap = check.getBestCmap()
    missing = [c for c in text if ord(c) not in cmap]
    check.close()

    print("charset: %d  glyph-mapped: %d  bytes: %d" % (len(text), len(cmap), os.path.getsize(out)))
    print("out: " + out)
    if missing:
        print("MISSING: " + "".join(missing))
        sys.exit(1)
    print("missing: (none)")


if __name__ == "__main__":
    main()
