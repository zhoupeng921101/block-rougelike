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

# ---------- 基因 / 道具图标：20×20 手绘，照 v3A 的基因槽画成物件 ----------
# 激光炮：炮管朝右，炮身深灰蓝，炮口一点青光
def 激光炮(px):
    body, edge, glow = hx("#5c7f96"), hx("#2a4152"), hx("#7ff0ff")
    矩形(px, 2, 8, 9, 13, edge)
    矩形(px, 3, 9, 8, 12, body)
    矩形(px, 9, 9, 16, 11, edge)
    矩形(px, 10, 10, 15, 10, body)
    矩形(px, 16, 8, 18, 12, edge)
    矩形(px, 17, 9, 18, 11, glow)
    矩形(px, 4, 14, 7, 15, edge)

# 陨石：一块带棱角的岩石，右上一条火尾
def 陨石(px):
    rock, edge, fire, hot = hx("#8a6a55"), hx("#4a3527"), hx("#ff8a2a"), hx("#ffd84a")
    for y in range(8, 18):
        for x in range(3, 14):
            if (x - 8) ** 2 * 0.8 + (y - 13) ** 2 <= 30:
                px[x, y] = rock + (255,)
    for x, y in ((4, 10), (5, 9), (6, 8), (7, 7), (8, 6), (9, 5), (10, 4), (11, 3), (12, 2)):
        px[x, y] = fire + (255,)
        px[x + 1, y + 1] = hot + (255,)
    矩形(px, 5, 12, 6, 13, edge); 矩形(px, 10, 14, 11, 15, edge); 矩形(px, 9, 11, 10, 12, edge)

# 黑洞：外圈紫环，里面全黑，中心一点亮
def 黑洞(px):
    ring, dim, core = hx("#a46cf5"), hx("#4b2f7a"), hx("#e6d8ff")
    for y in range(20):
        for x in range(20):
            r2 = (x - 10) ** 2 + (y - 10) ** 2
            if 20 <= r2 <= 46:
                px[x, y] = (ring if r2 >= 33 else dim) + (255,)
            elif r2 < 20:
                px[x, y] = (6, 4, 12, 255)
    px[10, 10] = core + (255,); px[9, 10] = core + (255,); px[10, 9] = core + (255,)

# 导弹：竖着的火箭，尾焰朝下
def 导弹(px):
    body, edge, fin, flame = hx("#d9e3ea"), hx("#6d7f8c"), hx("#ff4d6a"), hx("#ffc83d")
    矩形(px, 8, 4, 11, 13, edge)
    矩形(px, 9, 5, 10, 13, body)
    矩形(px, 8, 3, 11, 3, edge)
    矩形(px, 7, 9, 7, 13, fin); 矩形(px, 12, 9, 12, 13, fin)
    矩形(px, 9, 14, 10, 15, flame); px[9, 16] = (255, 200, 61, 255)
    矩形(px, 9, 6, 10, 7, hx("#3e8fe0"))

存图标(像素图标(激光炮), "基因_激光炮", "基因图标：激光炮（v3A 基因槽的武器画法）")
存图标(像素图标(陨石), "基因_陨石", "基因图标：陨石")
存图标(像素图标(黑洞), "基因_黑洞", "基因图标：黑洞")
存图标(像素图标(导弹), "基因_导弹", "基因图标：导弹")

# ---------- 选关屏的星球节点：20×20，八种底子 ----------
def 星球(px, body, light, dark, craters, lava=False, ring=None, shattered=False):
    cx, cy, R = 10, 10, 9
    for y in range(20):
        for x in range(20):
            dx, dy = x - cx, y - cy
            if dx * dx + dy * dy > R * R:
                continue
            t = (dx + dy) / (2.2 * R)                    # 右上暗、左上亮
            c = mix(body, light, max(0.0, -t) * 0.9) if t < 0 else mix(body, dark, min(1.0, t) * 0.9)
            px[x, y] = c + (255,)
    if ring:                                             # 星环：上半天被球挡住，下半天横过球前
        for x in range(0, 20):
            y = round(cy + (x - cx) * 0.34)
            for k in (0, 1):
                yy = y + k
                if not (0 <= yy < 20):
                    continue
                if yy < cy and (x - cx) ** 2 + (yy - cy) ** 2 <= R * R:
                    continue                                  # 被球挡住的那半
                px[x, yy] = ring + (255,) if k == 0 else mix(ring, body, 0.45) + (255,)
    for (x, y, r) in craters:
        for yy in range(-r, r + 1):
            for xx in range(-r, r + 1):
                gx, gy = cx + x + xx, cy + y + yy
                if xx * xx + yy * yy <= r * r and 0 <= gx < 20 and 0 <= gy < 20 \
                        and (gx - cx) ** 2 + (gy - cy) ** 2 <= R * R:
                    px[gx, gy] = dark + (255,)
        gx, gy = cx + x, cy + y - r
        if 0 <= gx < 20 and 0 <= gy < 20 and (gx - cx) ** 2 + (gy - cy) ** 2 <= R * R:
            px[gx, gy] = mix(dark, light, 0.5) + (255,)
    if lava:                                             # 岩浆缝：几道亮橙
        for x0, y0, x1, y1 in ((-4, -4, 1, 0), (1, 0, -1, 4), (2, -5, 4, -1)):
            描(px, [(cx + x0, cy + y0), (cx + x1, cy + y1)], hx("#ff7a2a"))
    if shattered:                                        # 打碎：右下缺一块 + 几块碎屑
        for y in range(20):
            for x in range(20):
                if (x - 15) ** 2 + (y - 15) ** 2 <= 16:
                    px[x, y] = (0, 0, 0, 0)
        for x, y in ((15, 14), (17, 12), (13, 18), (18, 17)):
            px[x, y] = dark + (255,)

星球底子 = [
    ("灰岩", hx("#8d97a3"), hx("#dfe7ee"), hx("#4a535e"), [(-3, -2, 2), (2, 2, 2), (4, -3, 1)], {}),
    ("橙褐", hx("#b8763f"), hx("#f0bd7a"), hx("#5e3517"), [(-3, 2, 2), (3, -1, 2)], {}),
    ("熔岩", hx("#8e3a2a"), hx("#e8754a"), hx("#3a120c"), [(-2, -3, 2), (3, 3, 2)], {"lava": True}),
    ("暗红", hx("#7a2b32"), hx("#c45a5a"), hx("#2c0d12"), [(0, 0, 3), (4, -2, 1)], {}),
    ("冰蓝", hx("#6fa8c8"), hx("#d8f2ff"), hx("#2c4c62"), [(-4, -1, 1), (2, 3, 2)], {}),
    ("紫晶", hx("#8a6bd0"), hx("#d9c7ff"), hx("#3b2966"), [(-2, 1, 2)], {"ring": hx("#c9a8ff")}),
    ("翠绿", hx("#4f9a6a"), hx("#c9f2d4"), hx("#204a2f"), [(1, -2, 2), (-3, 3, 1)], {}),
    ("碎块", hx("#7f7268"), hx("#cfc6bb"), hx("#3a322c"), [(-3, -2, 2), (2, 1, 1)], {"shattered": True}),
]
for name, body, light, dark, craters, opts in 星球底子:
    im = 像素图标(lambda px, b=body, l=light, dk=dark, c=craters, o=opts: 星球(px, b, l, dk, c, **o))
    im.save(out("图标", "星球_" + name + ".png"))
    清单["件"]["图标/星球_%s.png" % name] = {"尺寸": [20, 20], "显示": [60, 60], "过滤": "Bilinear",
                                       "用在": "选关屏地图节点里的目标星球（60 = 3 倍）；按节点绑一色一图"}

# 节点状态环 + 打勾：平滑件，环 72×72、勾 16×16
for name, col, use in (("节点环_可打", C["高亮边"], "选关：目前能打的节点外圈"),
                       ("节点环_已打", "#4cd06a", "选关：打过的节点外圈"),
                       ("节点环_首领", C["倍率"], "选关：首领节点外圈")):
    im = Image.new("RGBA", (72 * SS, 72 * SS), (0, 0, 0, 0))
    ImageDraw.Draw(im).ellipse((0, 0, 72 * SS - 1, 72 * SS - 1), outline=hx(col) + (255,), width=3 * SS)
    存平滑(im.resize((72, 72), Image.LANCZOS), name, "", None, use)

勾 = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
描(勾.load(), [(3, 9), (7, 13), (13, 3)], hx("#4cd06a"))
描(勾.load(), [(3, 10), (7, 14), (13, 4)], hx("#bff5cc"))
勾.save(out("图标", "勾.png"))
清单["件"]["图标/勾.png"] = {"尺寸": [16, 16], "显示": [32, 32], "过滤": "Bilinear", "用在": "选关：打过的节点右上角打勾"}

# ---------- 第二批基因 / 道具图标：给商店货架与基因槽凑够可区分的种类 ----------
# 水晶：七彩基因那类「稀有 / 多彩」的东西
def 水晶(px):
    body, light, dark = hx("#a46cf5"), hx("#e6d8ff"), hx("#4b2f7a")
    for y in range(4, 17):
        half = max(1, round((y - 3) * 0.55))
        for x in range(10 - half, 10 + half):
            px[x, y] = body + (255,)
    for y in range(5, 15):
        px[8, y] = light + (255,)
    for y in range(5, 17):
        px[11, y] = dark + (255,)
    矩形(px, 9, 3, 10, 4, light)

# 铁芯改造：金属块，中间一颗红核
def 铁芯(px):
    shell, edge, core, hot = hx("#8a97a3"), hx("#3d4650"), hx("#ff4d6a"), hx("#ffb3c0")
    矩形(px, 3, 4, 16, 16, edge)
    矩形(px, 4, 5, 15, 15, shell)
    矩形(px, 5, 6, 14, 6, hx("#b6c2cc"))          # 顶面亮边
    矩形(px, 8, 9, 11, 12, edge)
    矩形(px, 9, 10, 10, 11, core)
    px[9, 10] = hot + (255,)
    矩形(px, 12, 13, 13, 14, edge)

# 时钟：延迟 / 计时类
def 时钟(px):
    face, edge, hand = hx("#e8eef2"), hx("#3a5262"), hx("#ffc83d")
    圆(px, 10, 10, 7, edge)
    圆(px, 10, 10, 6, face)
    for i in range(6):
        px[10, 5 + i] = edge + (255,)
    描(px, [(10, 10), (10, 6)], hand)
    描(px, [(10, 10), (13, 11)], hand)
    矩形(px, 9, 2, 10, 3, edge)

# 盾：防护 / 免死类
def 盾(px):
    body, light, edge = hx("#4fb3ff"), hx("#cfeaff"), hx("#173a5e")
    for y in range(4, 17):
        half = 6 if y < 12 else max(1, 6 - (y - 11) * 1)
        for x in range(10 - half, 10 + half):
            px[x, y] = body + (255,)
    for y in range(4, 17):
        half = 6 if y < 12 else max(1, 6 - (y - 11) * 1)
        px[10 - half, y] = edge + (255,)
        px[10 + half - 1, y] = edge + (255,)
    描(px, [(6, 6), (10, 4), (13, 6)], light)

# 硬币：经济类
def 硬币(px):
    rim, face, ink = hx("#c98f1a"), hx("#ffc83d"), hx("#5a3d05")
    圆(px, 10, 10, 7, rim)
    圆(px, 10, 10, 5, face)
    矩形(px, 9, 7, 10, 12, ink)
    矩形(px, 8, 8, 8, 10, ink)
    矩形(px, 11, 11, 11, 12, ink)

# 星：稀有 / 传说标记
def 星(px):
    body, light = hx("#ffc83d"), hx("#fff2b0")
    for (x, y) in ((9, 3), (10, 3), (9, 4), (10, 4)):
        px[x, y] = light + (255,)
    for i in range(4, 16):
        half = max(0, 6 - abs(i - 10))
        for x in range(10 - half, 10 + half):
            px[x, i] = body + (255,)
    for i in range(1, 5):
        px[10 - i, 10 - i] = body + (255,)
        px[10 + i - 1, 10 - i] = body + (255,)
        px[10 - i, 10 + i] = light + (255,)

# 方块包：补给包里的「方块包」
def 方块包(px):
    box, edge, face = hx("#a46cf5"), hx("#3b2966"), hx("#e6d8ff")
    矩形(px, 3, 7, 16, 17, edge)
    矩形(px, 4, 8, 15, 16, box)
    矩形(px, 2, 5, 17, 7, box)
    矩形(px, 2, 5, 17, 5, edge)
    矩形(px, 7, 10, 9, 12, face)
    矩形(px, 11, 10, 13, 12, face)
    矩形(px, 9, 13, 11, 15, face)

存图标(像素图标(水晶), "基因_水晶", "基因图标：稀有 / 多彩那类（商店货架按 id 取）")
存图标(像素图标(铁芯), "改造_铁芯", "改造图标：铁芯改造（一块变成铁芯方块）")
存图标(像素图标(时钟), "道具_时钟", "道具图标：延迟 / 计时类")
存图标(像素图标(盾), "道具_盾", "道具图标：防护 / 免死类")
存图标(像素图标(硬币), "道具_硬币", "图标：经济类")
存图标(像素图标(星), "道具_星", "图标：稀有 / 传说标记")
存图标(像素图标(方块包), "道具_方块包", "补给包图标：方块包")


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
