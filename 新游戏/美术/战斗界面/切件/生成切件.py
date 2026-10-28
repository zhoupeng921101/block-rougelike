# -*- coding: utf-8 -*-
"""战斗界面的程序切件：方块砖、空格、面板九宫格、字标。颜色和尺寸量自认可图 成品/战斗界面_v3A.png（1536 宽，×1.25 换成 1920×1080 的设计像素）。

  python -X utf8 生成切件.py            # 出到同目录的 方块/ 面板/ 字标/，另出 预览_切件.png

像素画的件（方块、空格、字标）按「1 格 = 5 个设计像素」出两份：原尺寸（16×16 这类，进工程用 Point 过滤放大）和 ×5 的预览。
面板是平滑的矢量件：按设计像素直接画（4 倍超采样再缩，边是抗锯齿的），九宫格边距写在 切件清单.json。
"""
import json, os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
def out(*p):
    path = os.path.join(HERE, *p)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return path

def hx(s): s = s.lstrip("#"); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))
def mix(a, b, t): return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
def mul(a, k, cool=0.0):
    # 压暗；cool > 0 时暗部往蓝紫偏（戴夫：暗部换色相）
    r, g, b = (c * k for c in a)
    return (round(r * (1 - cool)), round(g * (1 - cool * 0.5)), round(min(255, b + 40 * cool)))

清单 = {"说明": "设计分辨率 1920×1080；像素件 1 格 = 5 设计像素，导入用 Point 过滤、不压缩；面板件是平滑的，导入用 Bilinear，按 border 切九宫格", "件": {}}

# ---------- 方块砖：16×16 ----------
方块色 = {"I": "#3fd0e8", "O": "#f2c53d", "T": "#a46cf5", "S": "#4cd06a", "Z": "#f05454", "J": "#3e7bff", "L": "#ff9a3c"}

def 砖(base):
    base = hx(base)
    light, dark = mix(base, (255, 255, 255), 0.36), mul(base, 0.66, 0.10)
    edge, spark = mul(base, 0.30, 0.35), mix(base, (255, 255, 255), 0.65)
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    px = im.load()
    for y in range(16):
        for x in range(16):
            if (x in (0, 15)) and (y in (0, 15)):
                continue                                   # 四角各缺一格，圆一点
            if x in (0, 15) or y in (0, 15):
                c = edge                                   # 一圈本色最暗的轮廓，不用纯黑
            else:
                top, left = y <= 2, x <= 2
                bot, right = y >= 13, x >= 13
                if (top and right) or (bot and left):      # 右上、左下两个角按对角线分亮暗
                    c = light if (x + y) < 15 else dark
                elif top or left:
                    c = light
                elif bot or right:
                    c = dark
                else:
                    c = base
            px[x, y] = c + (255,)
    for x, y in ((4, 4), (5, 4), (4, 5), (5, 5)):  # 左上一颗 2×2 的小高光
        px[x, y] = spark + (255,)
    return im

def 存像素件(im, name, sub):
    im.save(out(sub, name + ".png"))
    im.resize((im.width * 5, im.height * 5), Image.NEAREST).save(out(sub, "预览x5", name + ".png"))
    清单["件"][sub + "/" + name + ".png"] = {"尺寸": list(im.size), "显示": [im.width * 5, im.height * 5], "过滤": "Point"}

for k, c in 方块色.items():
    存像素件(砖(c), "方块_" + k, "方块")

# 空格：盘上的空位，一圈暗缝
def 空格():
    im = Image.new("RGBA", (16, 16), hx("#08121a") + (255,))
    d = ImageDraw.Draw(im)
    d.rectangle((1, 1, 14, 14), fill=hx("#0f1d28") + (255,))
    d.line((1, 1, 14, 1), fill=hx("#132332") + (255,))
    d.line((1, 1, 1, 14), fill=hx("#132332") + (255,))
    return im
存像素件(空格(), "空格", "方块")

# 落点虚影的四角括号：白色，代码按方块色染
def 虚影角标():
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    px = im.load()
    for (x0, y0, dx, dy) in ((1, 1, 1, 1), (14, 1, -1, 1), (1, 14, 1, -1), (14, 14, -1, -1)):
        for i in range(4):
            px[x0 + dx * i, y0] = (255, 255, 255, 255)
            px[x0, y0 + dy * i] = (255, 255, 255, 255)
    return im
存像素件(虚影角标(), "虚影角标", "方块")

# ---------- 面板：平滑九宫格 ----------
SS = 4
def 圆角框(w, h, r, fill, border=None, bw=0, dash=None):
    W, H, R, BW = w * SS, h * SS, r * SS, bw * SS
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if border and not dash:
        d.rounded_rectangle((0, 0, W - 1, H - 1), R, fill=hx(border) + (255,))
        if fill:
            d.rounded_rectangle((BW, BW, W - 1 - BW, H - 1 - BW), max(0, R - BW), fill=hx(fill) + (255,))
        else:
            d.rounded_rectangle((BW, BW, W - 1 - BW, H - 1 - BW), max(0, R - BW), fill=(0, 0, 0, 0))
    elif fill:
        d.rounded_rectangle((0, 0, W - 1, H - 1), R, fill=hx(fill) + (255,))
    if dash:
        seg, gap = dash[0] * SS, dash[1] * SS
        ring = Image.new("L", (W, H), 0)
        dr = ImageDraw.Draw(ring)
        dr.rounded_rectangle((0, 0, W - 1, H - 1), R, fill=255)
        dr.rounded_rectangle((BW, BW, W - 1 - BW, H - 1 - BW), max(0, R - BW), fill=0)
        mask = Image.new("L", (W, H), 0)
        dm = ImageDraw.Draw(mask)
        per = seg + gap
        for x in range(0, W, per):                                  # 上下两条
            dm.rectangle((x, 0, x + seg, BW * 2), fill=255); dm.rectangle((x, H - 1 - BW * 2, x + seg, H - 1), fill=255)
        for y in range(0, H, per):                                  # 左右两条
            dm.rectangle((0, y, BW * 2, y + seg), fill=255); dm.rectangle((W - 1 - BW * 2, y, W - 1, y + seg), fill=255)
        col = Image.new("RGBA", (W, H), hx(border) + (255,))
        im.paste(col, (0, 0), Image.fromarray(__import__("numpy").minimum(__import__("numpy").asarray(ring), __import__("numpy").asarray(mask))))
    return im.resize((w, h), Image.LANCZOS)

面板 = [
    # 名, 宽, 高, 圆角, 底, 边, 边宽, 九宫格边距, 用在哪
    ("面板", 48, 48, 12, "#0a141c", "#3b5d71", 4, 16, "所有面板：盲注信息、方块库、类型表、累计分、基因栏、道具栏、返回按钮、弃置区"),
    ("凹槽", 40, 40, 10, "#071017", "#4d7489", 3, 13, "托盘槽、基因槽、道具槽"),
    ("盘井", 40, 40, 10, "#070f16", "#3c6680", 4, 14, "盘框（8×8 网格的底）"),
    ("高亮行", 32, 32, 6, "#163948", "#5fe8f0", 3, 9, "类型表里命中的那一行"),
    ("徽章", 32, 32, 8, "#08191f", "#6efbf7", 3, 11, "拖动时的预览徽章"),
    ("进度槽", 48, 24, 12, "#09131b", "#2e4f61", 3, 12, "累计分进度条的槽（横向拉伸）"),
    ("进度填充", 24, 16, 8, "#47abfe", None, 0, 8, "累计分进度条的填充（横向拉伸）"),
    ("键帽", 24, 24, 5, "#0a141c", "#8fa3b0", 2, 7, "返回按钮旁的 Esc 键帽"),
    ("弃置区_悬停", 48, 48, 12, "#0e2430", "#5fe8f0", 4, 16, "块悬在弃置区上"),
]
for name, w, h, r, fill, border, bw, slice_, use in 面板:
    圆角框(w, h, r, fill, border, bw).save(out("面板", name + ".png"))
    清单["件"]["面板/%s.png" % name] = {"尺寸": [w, h], "九宫格": [slice_] * 4, "过滤": "Bilinear", "用在": use}

# 托盘空槽（块在手上）：虚线框，固定 150×160 不拉伸
圆角框(150, 160, 10, None, "#9fb3c0", 3, dash=(12, 8)).save(out("面板", "托盘空槽_虚线.png"))
清单["件"]["面板/托盘空槽_虚线.png"] = {"尺寸": [150, 160], "过滤": "Bilinear", "用在": "托盘里块被拿起时的空槽，不拉伸"}

# 弃置次数用完：斜纹，平铺叠在弃置区上
st = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
ds = ImageDraw.Draw(st)
for k in range(-32, 64, 16):
    ds.polygon([(k, 0), (k + 6, 0), (k + 6 - 32, 32), (k - 32, 32)], fill=(143, 163, 176, 46))
st.save(out("面板", "弃置区_斜纹.png"))
清单["件"]["面板/弃置区_斜纹.png"] = {"尺寸": [32, 32], "平铺": True, "过滤": "Bilinear", "用在": "弃置次数用完时叠在弃置区上"}

# 盲注信息左端的目标星球头像框：亮青色圆环，里面透明（头像图另放一层）
ring = Image.new("RGBA", (78 * SS, 78 * SS), (0, 0, 0, 0))
ImageDraw.Draw(ring).ellipse((0, 0, 78 * SS - 1, 78 * SS - 1), outline=hx("#5fe0ff") + (255,), width=3 * SS)
ring.resize((78, 78), Image.LANCZOS).save(out("面板", "头像框_圆环.png"))
清单["件"]["面板/头像框_圆环.png"] = {"尺寸": [78, 78], "过滤": "Bilinear", "用在": "盲注信息左端的目标星球头像框，不拉伸；头像 图标/目标星球_头像.png 放在环里（约 70×70）"}

# ---------- 字标「3B」：像素字，1 格 = 6 设计像素 ----------
G = {"3": [".######.", "########", "##....##", "......##", "..#####.", "..#####.", "......##", "##....##", "########", ".######."],
     "B": ["#######.", "########", "##....##", "##....##", "#######.", "#######.", "##....##", "##....##", "########", "#######."]}
face, low, shadow = hx("#ffc83d"), hx("#e39a24"), hx("#1d3f8f")
gw, gh, gap = 8, 10, 2
logo = Image.new("RGBA", (gw * 2 + gap + 1, gh + 1), (0, 0, 0, 0))
lp = logo.load()
for gi, ch in enumerate("3B"):
    ox = gi * (gw + gap)
    rows = G[ch]
    for y in range(gh):                                             # 先画右下错开一格的深蓝投影
        for x in range(gw):
            if rows[y][x] == "#":
                lp[ox + x + 1, y + 1] = shadow + (255,)
    for y in range(gh):
        for x in range(gw):
            if rows[y][x] == "#":
                below = y + 1 < gh and rows[y + 1][x] == "#"
                lp[ox + x, y] = (face if below else low) + (255,)   # 每一笔的下沿暗一档
logo.save(out("字标", "字标_3B.png"))
logo.resize((logo.width * 6, logo.height * 6), Image.NEAREST).save(out("字标", "预览x6", "字标_3B.png"))
清单["件"]["字标/字标_3B.png"] = {"尺寸": list(logo.size), "显示": [logo.width * 6, logo.height * 6], "过滤": "Point", "用在": "左上标题区；旁边的 BLACK BLOCK 用字"}

# 不是本脚本画的两件：背景由 拼回预览.py 从改图出的纯背景裁出，头像是从 v3A 裁的
清单["件"]["图标/目标星球_头像.png"] = {"尺寸": [66, 68], "过滤": "Bilinear", "用在": "盲注信息左端的目标星球头像，从 v3A 头像框里裁的圆形，透明底"}
清单["件"]["背景/背景_1920x1080.png"] = {"尺寸": [1920, 1080], "过滤": "Bilinear", "用在": "战斗窗最底层的全屏背景；改图出的纯背景（出图/背景_v1.png）裁 y 89-953 再放大 1.25 倍；16:10 下按 Envelope 铺满、两边各裁掉一点"}
json.dump(清单, open(out("切件清单.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# ---------- 预览板 ----------
pv = Image.new("RGBA", (980, 420), hx("#1e2b34") + (255,))
x = 20
for k in list(方块色) + ["空格"]:
    t = Image.open(out("方块", "预览x5", ("方块_" + k if k != "空格" else "空格") + ".png"))
    pv.alpha_composite(t, (x, 20)); x += 90
gh5 = Image.open(out("方块", "预览x5", "方块_O.png")).copy(); gh5.putalpha(gh5.getchannel("A").point(lambda a: a * 45 // 100))
pv.alpha_composite(gh5, (x, 20)); pv.alpha_composite(Image.open(out("方块", "预览x5", "虚影角标.png")), (x, 20))
x, y = 20, 130
for name, w, h, *_ in 面板:
    im = Image.open(out("面板", name + ".png"))
    big = im.resize((w * 2, h * 2), Image.LANCZOS) if w < 40 else im
    pv.alpha_composite(big, (x, y)); x += big.width + 20
pv.alpha_composite(Image.open(out("面板", "托盘空槽_虚线.png")), (20, 230))
pv.alpha_composite(Image.open(out("字标", "预览x6", "字标_3B.png")), (200, 240))
pv.save(out("预览_切件.png"))
print("出好", len(清单["件"]), "件")
