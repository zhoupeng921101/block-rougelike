# -*- coding: utf-8 -*-
"""用切件按 13 号票布局 A（1920×1080）拼一张战斗界面，和认可图 v3A 的 16:9 裁切并排对照。字用微软雅黑代替（正式字体没定）。

  python -X utf8 拼回预览.py      # 出 背景/背景_1920x1080.png、预览_拼回.png、对照_拼回vs效果图.jpg
"""
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
UP = os.path.dirname(HERE)
P = lambda *a: os.path.join(HERE, *a)
def hx(s): s = s.lstrip("#"); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))

# 背景：改图出的 1536×1024，裁和 v3A 16:9 同一条（y 89–953），×1.25 到 1920×1080
bg = Image.open(os.path.join(UP, "出图", "背景_v1.png")).convert("RGB").crop((0, 89, 1536, 953)).resize((1920, 1080), Image.LANCZOS)
os.makedirs(P("背景"), exist_ok=True)
bg.save(P("背景", "背景_1920x1080.png"))
canvas = bg.convert("RGBA")

def nine(name, w, h, b):
    src = Image.open(P("面板", name + ".png")).convert("RGBA")
    sw, sh = src.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    xs, ys = [0, b, sw - b, sw], [0, b, sh - b, sh]
    XS, YS = [0, b, w - b, w], [0, b, h - b, h]
    for i in range(3):
        for j in range(3):
            piece = src.crop((xs[i], ys[j], xs[i + 1], ys[j + 1]))
            tw, th = XS[i + 1] - XS[i], YS[j + 1] - YS[j]
            if tw > 0 and th > 0:
                out.alpha_composite(piece.resize((tw, th), Image.BILINEAR), (XS[i], YS[j]))
    return out
SL = {"面板": 16, "凹槽": 13, "盘井": 14, "高亮行": 9, "徽章": 11, "进度槽": 12, "进度填充": 8, "键帽": 7}
def panel(name, x, y, w, h): canvas.alpha_composite(nine(name, w, h, SL[name]), (x, y))
def tile(name, x, y, size):
    t = Image.open(P("方块", name + ".png")).convert("RGBA").resize((size, size), Image.NEAREST)
    canvas.alpha_composite(t, (x, y))

F = r"C:\Windows\Fonts\msyhbd.ttc"; FR = r"C:\Windows\Fonts\msyh.ttc"
d = ImageDraw.Draw(canvas)
def text(s, x, y, size, color, bold=True, anchor="lm"):
    d.text((x, y), s, font=ImageFont.truetype(F if bold else FR, size), fill=hx(color), anchor=anchor)

# 标题区
logo = Image.open(P("字标", "字标_3B.png")).convert("RGBA")
canvas.alpha_composite(logo.resize((logo.width * 6, logo.height * 6), Image.NEAREST), (52, 40))
text("BLACK BLOCK", 190, 82, 24, "#8fa3b0")
# 盲注信息（加了目标星球头像）
panel("面板", 600, 24, 720, 96)
d.ellipse((620, 33, 698, 111), outline=hx("#5fe0ff"), width=3)
av = Image.open(P("图标", "目标星球_头像.png")).convert("RGBA").resize((70, 70), Image.LANCZOS)
canvas.alpha_composite(av, (624, 37))
text("第 1 段 · 第 2 层 · 普通盲注", 716, 72, 32, "#e8eef2")
text("目标分", 1110, 72, 22, "#8fa3b0", False); text("350", 1180, 72, 40, "#ffc83d")
# 方块库剩余
panel("面板", 1500, 24, 380, 96)
text("方块库剩余", 1524, 72, 22, "#8fa3b0", False); text("13", 1745, 72, 50, "#e8eef2", anchor="rm"); text("/ 28 块", 1755, 74, 22, "#8fa3b0", False)
# 类型表
panel("面板", 40, 150, 420, 710)
text("消除类型 · 本级", 64, 185, 20, "#8fa3b0", False); text("底注 × 倍率", 436, 185, 20, "#8fa3b0", False, "rm")
d.line((56, 208, 444, 208), fill=hx("#3e6375"), width=2)
rows = [("清屏", 1, 60, 4), ("五线", 1, 55, 4), ("同形态十字", 1, 50, 4), ("多线", 1, 45, 3), ("同形态", 1, 40, 3), ("三线", 1, 35, 3),
        ("拐角", 1, 30, 2), ("十字", 1, 25, 2), ("平行线", 1, 20, 2), ("双线", 2, 30, 3), ("单线", 1, 10, 1)]
for i, (n, lv, b, m) in enumerate(rows):
    cy = 240 + 56 * i
    if n == "平行线": panel("高亮行", 56, cy - 27, 388, 54); d = ImageDraw.Draw(canvas)
    text(n, 64, cy, 26, "#e8eef2"); text("Lv%d" % lv, 290, cy, 18, "#8fa3b0", False, "mm")
    text(str(b), 362, cy, 26, "#4fb3ff", anchor="mm"); text("×%d" % m, 418, cy, 26, "#ff4d6a", anchor="mm")
# 累计分
panel("面板", 640, 140, 640, 76)
text("累计分", 660, 178, 22, "#8fa3b0", False); text("106", 740, 178, 44, "#e8eef2")
panel("进度槽", 855, 166, 300, 24); panel("进度填充", 859, 170, 92, 16); d = ImageDraw.Draw(canvas)
text("/ 350", 1166, 178, 22, "#8fa3b0", False)
# 盘
panel("盘井", 626, 216, 668, 668)
board = {}
def put(k, cells):
    for c in cells: board[c] = k
put("O", [(1, 1), (1, 2), (2, 1), (2, 2)]); put("T", [(3, 5), (3, 6), (3, 7), (2, 6)]); put("S", [(6, 3), (5, 3), (5, 4), (4, 4)])
put("L", [(5, 6), (6, 6), (7, 6), (7, 7)]); put("T", [(5, 7), (6, 7)]); put("J", [(5, 0), (6, 0), (6, 1), (6, 2)]); put("I", [(7, 0), (7, 1), (7, 2), (7, 3)])
for r in range(8):
    for c in range(8):
        x, y = 640 + 80 * c, 230 + 80 * r
        tile("空格", x, y, 80)
        k = board.get((r, c))
        if k: tile("方块_" + k, x, y, 80)
for (r, c) in [(6, 4), (6, 5), (7, 4), (7, 5)]:                     # 落点虚影：方块砖压透明 + 四角括号
    x, y = 640 + 80 * c, 230 + 80 * r
    t = Image.open(P("方块", "方块_O.png")).convert("RGBA").resize((80, 80), Image.NEAREST)
    t.putalpha(t.getchannel("A").point(lambda a: a * 40 // 100)); canvas.alpha_composite(t, (x, y))
    br = Image.open(P("方块", "虚影角标.png")).convert("RGBA").resize((80, 80), Image.NEAREST)
    yb = Image.new("RGBA", br.size, hx("#ffe14d") + (255,)); yb.putalpha(br.getchannel("A")); canvas.alpha_composite(yb, (x, y))
glow = Image.new("RGBA", (680, 200), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)
gd.rounded_rectangle((10, 10, 669, 189), 10, outline=hx("#5fe0ff") + (255,), width=5)
from PIL import ImageFilter
canvas.alpha_composite(glow.filter(ImageFilter.GaussianBlur(5)), (630, 700)); canvas.alpha_composite(glow, (630, 700))
d = ImageDraw.Draw(canvas)
panel("徽章", 840, 634, 400, 66); d = ImageDraw.Draw(canvas)
text("平行线", 864, 667, 26, "#e8eef2"); text("Lv1", 1060, 667, 18, "#8fa3b0", False, "mm"); text("20", 1130, 667, 26, "#4fb3ff", anchor="mm"); text("×2", 1196, 667, 26, "#ff4d6a", anchor="mm")
# 基因栏、道具栏（空槽）
panel("面板", 1500, 150, 380, 400); text("基因", 1524, 178, 20, "#8fa3b0", False)
for i in range(6):
    panel("凹槽", 1512 + 182 * (i % 2), 196 + 117 * (i // 2), 174, 108)
panel("面板", 1500, 570, 380, 170); d = ImageDraw.Draw(canvas); text("道具", 1524, 595, 20, "#8fa3b0", False)
for i in range(3):
    panel("凹槽", 1512 + 122 * i, 616, 112, 110)
# 返回
panel("面板", 40, 950, 300, 90); panel("键帽", 256, 980, 60, 30); d = ImageDraw.Draw(canvas)
text("返回主界面", 160, 995, 28, "#e8eef2", anchor="mm"); text("Esc", 286, 995, 18, "#8fa3b0", False, "mm")
# 托盘
for i, x in enumerate((715, 885, 1055)):
    if i == 1:
        canvas.alpha_composite(Image.open(P("面板", "托盘空槽_虚线.png")).convert("RGBA"), (x, 900))
    else:
        panel("凹槽", x, 900, 150, 160)
def mini(cx, cy, k, cells, cell=28):
    w = (max(c for _, c in cells) + 1) * cell; h = (max(r for r, _ in cells) + 1) * cell
    for r, c in cells: tile("方块_" + k, round(cx - w / 2 + c * cell), round(cy - h / 2 + r * cell), cell)
mini(790, 972, "T", [(0, 0), (0, 1), (0, 2), (1, 1)]); mini(1130, 972, "Z", [(0, 0), (0, 1), (1, 1), (1, 2)])
d = ImageDraw.Draw(canvas); text("5 点", 848, 1040, 18, "#e8eef2", anchor="rm"); text("3 点", 1188, 1040, 18, "#e8eef2", anchor="rm")
# 弃置区
panel("面板", 1620, 890, 260, 170); d = ImageDraw.Draw(canvas)
text("弃置区", 1750, 932, 24, "#e8eef2", anchor="mm"); text("2", 1750, 982, 58, "#ffc83d", anchor="mm"); text("剩余弃置次数", 1750, 1028, 18, "#8fa3b0", False, "mm")

canvas.convert("RGB").save(P("预览_拼回.png"))
ref = Image.open(os.path.join(UP, "成品", "战斗界面_v3A_16比9.png")).convert("RGB").resize((1920, 1080), Image.LANCZOS)
sheet = Image.new("RGB", (1920, 2180), (255, 255, 255))
sheet.paste(canvas.convert("RGB"), (0, 0)); sheet.paste(ref, (0, 1100))
dd = ImageDraw.Draw(sheet)
dd.text((10, 1082), "上：切件拼回（字用微软雅黑代替）   下：认可的效果图 v3A（16:9 裁切放大到 1920×1080）", font=ImageFont.truetype(FR, 14), fill=(0, 0, 0))
sheet.resize((960, 1090), Image.LANCZOS).save(P("对照_拼回vs效果图.jpg"), quality=90)
print("ok")
