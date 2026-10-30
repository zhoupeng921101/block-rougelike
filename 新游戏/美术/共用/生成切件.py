# -*- coding: utf-8 -*-
"""局外三屏（选关 / 结算 / 商店）共用的程序切件：面板、内格、按钮、键帽、虚线、科技/补给/券图标、方块库小方块、星空底。

  python -X utf8 生成切件.py            # 出到 切件/ 下，另出 预览_切件.png

口径（2026-10-30 定）：颜色与尺寸量自认可图（结算 v2A / 选关 v2A / 商店 v2B，都是 1536 宽，布局文件按 1920×1280 写、
界面件占 y 100–1180）。像素图标按 20 格手绘（1 格 = 1 艺术像素），面板类平滑件按设计像素直接画（4 倍超采样再缩）。
导入：平滑件 Bilinear、九宫格边距写进切件清单；图标按原生 20×20 入库，显示 40（2 倍）。
"""
import json, os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
def out(*p):
    path = os.path.join(HERE, "切件", *p)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return path

def hx(s): s = s.lstrip("#"); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))
def mix(a, b, t): return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))

# 配色正本 = 布局_结算.json 的「配色」节（三屏共用同一套）
C = {
    "面板": "#141d25", "面板边": "#3a5262", "内格": "#0c141a", "暗边": "#26363f",
    "底": "#101c26", "底2": "#1b2832", "正文": "#e8eef2", "次字": "#8fa3b0",
    "金": "#ffc83d", "底注": "#4fb3ff", "倍率": "#ff4d6a", "高亮边": "#5fe0ff",
}

清单 = {"说明": "设计分辨率 1920×1080；面板件平滑九宫格、Bilinear；图标 20×20 原生、显示 40（2 倍）、Bilinear；"
                "颜色与尺寸量自认可效果图（结算 v2A / 选关 v2A / 商店 v2B）", "件": {}}

SS = 4

def 圆角框(w, h, r, fill, border=None, bw=0, top=None, dash=None):
    """平滑圆角框：4 倍超采样后缩回，边是抗锯齿的。dash=(实,空) 画虚线边。"""
    W, H, R, BW = w * SS, h * SS, r * SS, bw * SS
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if border and not dash:
        d.rounded_rectangle((0, 0, W - 1, H - 1), R, fill=hx(border) + (255,))
        if fill:
            d.rounded_rectangle((BW, BW, W - 1 - BW, H - 1 - BW), max(0, R - BW), fill=hx(fill) + (255,))
    elif fill:
        d.rounded_rectangle((0, 0, W - 1, H - 1), R, fill=hx(fill) + (255,))
    if top:                                                   # 按钮：上亮下暗的竖直渐变，戴夫式塑料钮
        d.rounded_rectangle((0, 0, W - 1, H - 1), R, fill=hx(fill) + (255,))
        mask = Image.new("L", (W, H), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, W - 1, H - 1), R, fill=255)
        grad = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        gd = ImageDraw.Draw(grad)
        for y in range(H):
            t = y / max(1, H - 1)
            gd.line((0, y, W, y), fill=mix(hx(top), hx(fill), min(1.0, t * 2.4)) + (255,))
        im.paste(grad, (0, 0), mask)
    if dash:
        seg, gap = dash[0] * SS, dash[1] * SS
        ring = Image.new("L", (W, H), 0)
        dr = ImageDraw.Draw(ring)
        dr.rounded_rectangle((0, 0, W - 1, H - 1), R, fill=255)
        dr.rounded_rectangle((BW, BW, W - 1 - BW, H - 1 - BW), max(0, R - BW), fill=0)
        mask = Image.new("L", (W, H), 0)
        dm = ImageDraw.Draw(mask)
        per = seg + gap
        for x in range(0, W, per):
            dm.rectangle((x, 0, x + seg, BW * 2), fill=255)
            dm.rectangle((x, H - 1 - BW * 2, x + seg, H - 1), fill=255)
        for y in range(0, H, per):
            dm.rectangle((0, y, BW * 2, y + seg), fill=255)
            dm.rectangle((W - 1 - BW * 2, y, W - 1, y + seg), fill=255)
        import numpy
        col = Image.new("RGBA", (W, H), hx(border) + (255,))
        im.paste(col, (0, 0), Image.fromarray(numpy.minimum(numpy.asarray(ring), numpy.asarray(mask))))
    return im.resize((w, h), Image.LANCZOS)

def 存平滑(im, name, sub, border=None, use=""):
    im.save(out(sub, name + ".png"))
    件 = {"尺寸": list(im.size), "过滤": "Bilinear"}
    if border:
        件["九宫格"] = [border] * 4
    if use:
        件["用在"] = use
    清单["件"][(sub + "/" if sub else "") + name + ".png"] = 件
    return im

# ---------- 面板类（平滑九宫格） ----------
存平滑(圆角框(48, 48, 12, C["面板"], C["面板边"], 3), "面板", "", 16,
      "所有面板底：顶栏、左栏类型表、右栏背包、结算面板、货架、按钮底")
存平滑(圆角框(24, 24, 8, C["内格"]), "内格", "", 10,
      "面板里的格子：科技图标格、补给/券格、方块库格、分布格、Esc 键帽底")
存平滑(圆角框(48, 48, 10, None, C["暗边"], 2, dash=(6, 5)), "内格_虚线", "", 14,
      "空槽（虚线框）：补给包/券的空格、背包空格")
存平滑(圆角框(48, 48, 12, "#3e8fe0", top="#5aa9f2"), "按钮_蓝", "", 16,
      "主按钮：进入商店、刷新、购买、挑战")
存平滑(圆角框(48, 48, 12, C["内格"], C["面板边"], 3), "按钮_灰", "", 16,
      "次按钮：跳过、返回主界面、离开商店")
存平滑(圆角框(20, 20, 6, C["内格"], C["面板边"], 2), "键帽", "", 8, "Esc 键帽")
存平滑(圆角框(40, 8, 3, C["底注"]), "杆_亮", "", None, "科技等级条的一格（已点亮）")
存平滑(圆角框(40, 8, 3, C["内格"], C["暗边"], 1), "杆_暗", "", None, "科技等级条的一格（未点亮）")

# 虚线分隔（横线）：平铺用，实 8 空 10
虚 = Image.new("RGBA", (18, 2), (0, 0, 0, 0))
ImageDraw.Draw(虚).rectangle((0, 0, 7, 1), fill=hx(C["面板边"]) + (255,))
虚.save(out("虚线.png"))
清单["件"]["虚线.png"] = {"尺寸": [18, 2], "平铺": True, "过滤": "Bilinear", "用在": "结算面板里奖励与合计之间那条虚线，平铺"}
虚线 = 虚

# 头像框：亮青色圆环，内圈透明（结算头部、选关节点都能用）
头像框 = Image.new("RGBA", (184 * SS, 184 * SS), (0, 0, 0, 0))
ImageDraw.Draw(头像框).ellipse((0, 0, 184 * SS - 1, 184 * SS - 1), outline=hx(C["高亮边"]) + (255,), width=4 * SS)
存平滑(头像框.resize((184, 184), Image.LANCZOS), "头像框", "", None, "结算头部目标星球外圈；不拉伸，直接放")

# ---------- 图标：20×20 手绘 ----------
# 每个图标一张调色板 + 一个画法；都是 20×20，1 格 = 1 艺术像素，显示 40（2 倍）。
def 存图标(im, name, use):
    im.save(out("图标", name + ".png"))
    清单["件"]["图标/" + name + ".png"] = {"尺寸": list(im.size), "显示": [40, 40], "过滤": "Bilinear", "用在": use}

def 像素图标(draw_fn):
    im = Image.new("RGBA", (20, 20), (0, 0, 0, 0))
    draw_fn(im.load())
    return im

def 矩形(px, x0, y0, x1, y1, c):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if 0 <= x < 20 and 0 <= y < 20:
                px[x, y] = c + (255,)

def 圆(px, cx, cy, r, c):
    for y in range(20):
        for x in range(20):
            if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                px[x, y] = c + (255,)

def 描(px, pts, c):
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        dx, dy = abs(x1 - x0), abs(y1 - y0)
        sx, sy = (1 if x0 < x1 else -1), (1 if y0 < y1 else -1)
        err = dx - dy
        while True:
            if 0 <= x0 < 20 and 0 <= y0 < 20:
                px[x0, y0] = c + (255,)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 > -dy: err -= dy; x0 += sx
            if e2 < dx: err += dx; y0 += sy

# 单轴科技：青色芯片，四边各三根引脚，中心一块亮芯
def 芯片(px):
    body, edge, core, pin = hx("#2f7f9c"), hx("#16323f"), hx("#5fe0ff"), hx("#8fa3b0")
    矩形(px, 4, 4, 15, 15, edge)
    矩形(px, 5, 5, 14, 14, body)
    矩形(px, 8, 8, 11, 11, core)
    for i in (6, 9, 12):
        矩形(px, i, 1, i + 1, 3, pin); 矩形(px, i, 16, i + 1, 18, pin)
        矩形(px, 1, i, 3, i + 1, pin); 矩形(px, 16, i, 18, i + 1, pin)

# 双轨科技：橙色齿轮，八齿 + 中孔
def 齿轮(px):
    body, shade, hub = hx("#ffb03a"), hx("#c9771a"), hx("#0c141a")
    圆(px, 10, 10, 7, body)
    for x, y in ((9, 1), (9, 17), (1, 9), (17, 9), (3, 3), (14, 14), (3, 14), (14, 3)):
        矩形(px, x, y, x + 1, y + 1, body)
    圆(px, 10, 10, 5, shade)
    圆(px, 10, 10, 2, hub)

# 折轨科技：紫色卫星天线——碗口朝右上，焦点一点亮，右下一条支架
def 天线(px):
    dish, edge, glow, stand = hx("#a46cf5"), hx("#6c3fc0"), hx("#e6d8ff"), hx("#8fa3b0")
    cx, cy, R = 8, 9, 7
    for y in range(20):
        for x in range(20):
            dx, dy = x - cx, y - cy
            r2 = dx * dx + dy * dy
            if dx - dy > 1:                                     # 只留朝左上那半圈（碗口朝右下）
                continue
            if 16 <= r2 <= R * R:
                px[x, y] = (edge if r2 >= 33 else dish) + (255,)
    for y in range(20):
        for x in range(20):                                     # 焦点
        # 焦点在碗口方向上，一点亮
            if (x - 12) ** 2 + (y - 5) ** 2 <= 2:
                px[x, y] = glow + (255,)
    描(px, [(cx, cy + 1), (cx, 15), (cx + 3, 17)], stand)
    矩形(px, cx - 1, 17, cx + 4, 18, stand)

存图标(像素图标(芯片), "科技_单轴", "右栏科技的图标：单轴科技")
存图标(像素图标(齿轮), "科技_双轨", "右栏科技的图标：双轨科技")
存图标(像素图标(天线), "科技_折轨", "右栏科技的图标：折轨科技")

# 补给包：礼物箱，缎带十字 + 蝴蝶结
def 补给箱(body, shade, ribbon):
    def draw(px):
        矩形(px, 3, 7, 16, 17, shade)          # 箱体
        矩形(px, 4, 8, 15, 16, body)
        矩形(px, 2, 5, 17, 7, body)            # 盖子
        矩形(px, 2, 5, 17, 5, shade)
        矩形(px, 9, 5, 10, 17, ribbon)         # 竖缎带
        矩形(px, 3, 10, 16, 11, ribbon)        # 横缎带
        矩形(px, 7, 2, 8, 4, ribbon); 矩形(px, 11, 2, 12, 4, ribbon)   # 蝴蝶结
    return draw

存图标(像素图标(补给箱(hx("#4cd06a"), hx("#2a8f45"), hx("#bff5cc"))), "补给_基因", "右栏补给包：基因补给包")
存图标(像素图标(补给箱(hx("#4fb3ff"), hx("#2a6fb0"), hx("#cfeaff"))), "补给_科技", "右栏补给包：科技补给包")

# 优惠券：金色票券，中间「3B」
def 票券(px):
    body, shade, ink = hx("#ffc83d"), hx("#c98f1a"), hx("#5a3d05")
    矩形(px, 2, 6, 17, 15, shade)
    矩形(px, 2, 6, 17, 6, body)
    矩形(px, 3, 7, 16, 14, body)
    矩形(px, 2, 9, 2, 12, (0, 0, 0))        # 左右缺口
    矩形(px, 17, 9, 17, 12, (0, 0, 0))
    for y in range(6, 16):
        px[2, y] = (0, 0, 0, 0); px[17, y] = (0, 0, 0, 0)
    # 「3B」各 3×5
    G = {"3": ["###", "..#", "###", "..#", "###"], "B": ["##.", "#.#", "##.", "#.#", "##."]}
    ox = 5
    for ch in "3B":
        rows = G[ch]
        for y, row in enumerate(rows):
            for x, v in enumerate(row):
                if v == "#":
                    px[ox + x, 8 + y] = ink + (255,)
        ox += 4

存图标(像素图标(票券), "券_金色", "右栏优惠券：金色票券")

# ---------- 方块库：4 格拼成的迷你骨牌（1 格 = 14 设计像素） ----------
方块色 = {"I": "#3fd0e8", "O": "#f2c53d", "T": "#a46cf5", "S": "#4cd06a", "Z": "#f05454", "J": "#3e7bff", "L": "#ff9a3c"}
形状 = {
    "I": [(0, 0), (0, 1), (0, 2), (0, 3)],
    "O": [(0, 0), (0, 1), (1, 0), (1, 1)],
    "T": [(0, 0), (0, 1), (0, 2), (1, 1)],
    "S": [(0, 1), (0, 2), (1, 0), (1, 1)],
    "Z": [(0, 0), (0, 1), (1, 1), (1, 2)],
    "J": [(0, 0), (1, 0), (1, 1), (1, 2)],
    "L": [(0, 2), (1, 0), (1, 1), (1, 2)],
}
CELL = 14
for k, cells in 形状.items():
    im = Image.new("RGBA", (4 * CELL, 4 * CELL), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    base = hx(方块色[k])
    light, dark = mix(base, (255, 255, 255), 0.4), mix(base, (0, 0, 0), 0.35)
    for (r, c) in cells:
        x, y = c * CELL, r * CELL
        d.rectangle((x, y, x + CELL - 1, y + CELL - 1), fill=base + (255,))
        d.line((x, y, x + CELL - 1, y), fill=light + (255,))
        d.line((x, y, x, y + CELL - 1), fill=light + (255,))
        d.line((x, y + CELL - 1, x + CELL - 1, y + CELL - 1), fill=dark + (255,))
        d.line((x + CELL - 1, y, x + CELL - 1, y + CELL - 1), fill=dark + (255,))
    im.save(out("库块", "库块_" + k + ".png"))
    清单["件"]["库块/库块_%s.png" % k] = {"尺寸": list(im.size), "显示": [56, 56], "过滤": "Bilinear",
                                     "用在": "右栏方块库格里的迷你骨牌（4 格 × 14）；数量由文字画"}

# ---------- 星空底（局外三屏共用一张，进 Texture 不进图集） ----------
import random
rnd = random.Random(3)
bg = Image.new("RGBA", (1920, 1080), hx(C["底"]) + (255,))
d = ImageDraw.Draw(bg)
for y in range(1080):                                        # 上暗下亮一点点的竖直渐变
    t = y / 1079
    d.line((0, y, 1920, y), fill=mix(hx(C["底"]), hx("#16242f"), t) + (255,))
for _ in range(520):                                         # 星：大小三档，大星带十字光
    x, y = rnd.randrange(1920), rnd.randrange(1080)
    r = rnd.choice((1, 1, 1, 2, 2, 3))
    a = rnd.randrange(120, 255)
    c = (255, 255, 255, a) if rnd.random() < 0.75 else (190, 225, 255, a)
    d.ellipse((x - r, y - r, x + r, y + r), fill=c)
    if r == 3:
        d.line((x - 7, y, x + 7, y), fill=(255, 255, 255, 70))
        d.line((x, y - 7, x, y + 7), fill=(255, 255, 255, 70))
bg.convert("RGB").save(out("背景", "背景_1920x1080.png"))
清单["件"]["背景/背景_1920x1080.png"] = {"尺寸": [1920, 1080], "过滤": "Bilinear", "进图集": False,
                                    "用在": "局外三屏的全屏星空底（不进图集，放 UI/Texture；16:10 按 Envelope 两边各裁一点）"}

json.dump(清单, open(out("切件清单.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# ---------- 预览板 ----------
pv = Image.new("RGBA", (1200, 560), hx("#182530") + (255,))
x, y = 20, 20
for name in ("面板", "内格", "内格_虚线", "按钮_蓝", "按钮_灰", "键帽"):
    im = Image.open(out(name + ".png"))
    pv.alpha_composite(im.resize((im.width * 2, im.height * 2), Image.LANCZOS), (x, y)); x += 110
x = 20
for name in ("科技_单轴", "科技_双轨", "科技_折轨", "补给_基因", "补给_科技", "券_金色"):
    im = Image.open(out("图标", name + ".png"))
    pv.alpha_composite(im.resize((80, 80), Image.NEAREST), (x, y + 130)); x += 100
x = 20
for k in 形状:
    pv.alpha_composite(Image.open(out("库块", "库块_" + k + ".png")), (x, y + 240)); x += 80
pv.alpha_composite(Image.open(out("头像框.png")), (700, y + 120))
pv.save(out("预览_切件.png"))
print("出好", len(清单["件"]), "件")
