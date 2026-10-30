# -*- coding: utf-8 -*-
"""把 ZooPlaceholder 里那些静态的占位图换成自绘的像素件（阶段 6）：

  python -X utf8 生成替换.py        # 出到 替换/ 下，另出 对照_旧新.png

覆盖四类、共 29 张（文件名与像素尺寸都与原图一致，换掉后引用的布局不用改）：
  tierword/  评价字 4 词 × 4 色 = 16 张 + 星光 tier_star
  scorefx/   得分数字 0–9 与「+」= 11 张
  boardfx/   柔光团 boardfx_glow_soft（128×128）
  BurstFx/   碎块点 fx_soft_dot（64×64）

画法：评价字与数字用 5×7 的点阵字（全大写，字块按目标画布取整数倍），
填色 + 深一档描边 + 右下错一格的投影，和 3B 字标同一套；光团与光点保持平滑
（工程计划「光效平滑」这条照戴夫来的规矩）。
"""
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "替换")
DEMO = os.path.abspath(os.path.join(HERE, "..", "..", "..", "Demo", "Assets", "AssetRaw", "Effects", "ZooPlaceholder"))

FONT = {
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "B": ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
    "C": ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
    "D": ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    "F": ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
    "G": ["01110", "10001", "10000", "10111", "10001", "10001", "01110"],
    "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    "I": ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
    "J": ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
    "K": ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
    "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    "M": ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
    "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "P": ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    "Q": ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
    "V": ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
    "W": ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
    "X": ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
    "Y": ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
    "Z": ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
    "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
    "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
    "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
    "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
    "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
    "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
    "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
    "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
    "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
    "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
    "+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
    "!": ["00100", "00100", "00100", "00100", "00100", "00000", "00100"],
}

# 四档评价字的配色：填色、暗一档（投影）、描边
TIER_COLORS = {
    "blue": ("#8fd3ff", "#3e7fd0", "#12305e"),
    "green": ("#8bf0a8", "#35a862", "#0e3a22"),
    "orange": ("#ffc47a", "#d97a2a", "#4a2208"),
    "purple": ("#d7a6ff", "#8a4fd0", "#2e1150"),
}
WORDS = {"good": "GOOD!", "great": "GREAT!", "excellent": "EXCELLENT!", "unbelievable": "UNBELIEVABLE!"}


def hx(s):
    s = s.lstrip("#")
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def text_mask(text, scale):
    """把一串字排成 0/1 掩码；字宽 5、字距 1。"""
    cols = len(text) * 6 - 1
    mask = [[0] * cols for _ in range(7)]
    for i, ch in enumerate(text):
        rows = FONT[ch]
        for y in range(7):
            for x in range(5):
                if rows[y][x] == "1":
                    mask[y][i * 6 + x] = 1
    return mask


def render_text(text, size, fill, shade, edge, pad=4, ink=80):
    """在 size 的画布上居中排一串字。

    字号按「字身高 = ink 像素」定（描边、投影各占 1 格不算在内），再按画布宽度往下收；
    这样和代码里的 SourceInkHeight（评价字 80、得分数字 120）对得上，换图后屏上大小不变。
    """
    W, H = size
    scale = max(1, round(ink / 7))
    cells = len(text) * 6 - 1
    while scale > 1 and (cells + 2) * scale > W - 2 * pad:
        scale -= 1
    mask = text_mask(text, scale)
    mw, mh = len(mask[0]), len(mask)
    art_w, art_h = mw + 2, mh + 2                      # 留一圈给描边
    im = Image.new("RGBA", (art_w * scale, art_h * scale), (0, 0, 0, 0))
    px = im.load()

    def put(gx, gy, color):
        for yy in range(scale):
            for xx in range(scale):
                X, Y = gx * scale + xx, gy * scale + yy
                if 0 <= X < im.width and 0 <= Y < im.height:
                    px[X, Y] = color + (255,)

    # 投影（右下角错一格）
    for y in range(mh):
        for x in range(mw):
            if mask[y][x]:
                put(x + 2, y + 2, shade)
    # 描边（八邻域）
    for y in range(mh):
        for x in range(mw):
            if not mask[y][x]:
                continue
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    if dx or dy:
                        put(x + 1 + dx, y + 1 + dy, edge)
    # 字面
    for y in range(mh):
        for x in range(mw):
            if mask[y][x]:
                put(x + 1, y + 1, fill)

    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.alpha_composite(im.resize((im.width, im.height), Image.NEAREST),
                        ((W - im.width) // 2, (H - im.height) // 2))
    return out


def old_path(*parts):
    return os.path.join(DEMO, *parts)


def size_of(path):
    # 占位图可能已经被搬走(E 盘工程里换成了 Pixel/ 下的新图),这时读同名的替换件取尺寸
    if os.path.exists(path):
        return Image.open(path).size
    rel = os.path.relpath(path, DEMO)
    return Image.open(os.path.join(OUT, rel)).size


def save(im, *parts):
    path = os.path.join(OUT, *parts)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path)
    return im


pairs = []          # (旧图, 新图) 供对照板用

# ---------- 评价字 16 张 ----------
for tier, word in WORDS.items():
    for color, (fill, shade, edge) in TIER_COLORS.items():
        name = "tier_%s_%s.png" % (tier, color)
        src = old_path("tierword", name)
        im = render_text(word, size_of(src), hx(fill), hx(shade), hx(edge), ink=80)
        save(im, "tierword", name)
        pairs.append((src, os.path.join(OUT, "tierword", name)))

# ---------- 星光 ----------
star_path = old_path("tierword", "tier_star.png")
W, H = size_of(star_path)
star = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(star)
cx, cy = W // 2, H // 2
for i in range(min(W, H) // 2):
    t = i / (min(W, H) // 2)
    a = int(255 * (1 - t) ** 2)
    d.ellipse((cx - i, cy - i, cx + i, cy + i), fill=(255, 248, 200, a))
for i in range(min(W, H) // 4):
    t = i / (min(W, H) // 4)
    a = int(255 * (1 - t))
    d.line((0, cy - i, W, cy - i), fill=(255, 255, 255, 40))
    d.line((0, cy + i, W, cy + i), fill=(255, 255, 255, 40))
    d.line((cx - i, 0, cx - i, H), fill=(255, 255, 255, 40))
    d.line((cx + i, 0, cx + i, H), fill=(255, 255, 255, 40))
save(star, "tierword", "tier_star.png")
pairs.append((star_path, os.path.join(OUT, "tierword", "tier_star.png")))

# ---------- 得分数字 11 张 ----------
GOLD, GOLD_SHADE, GOLD_EDGE = hx("#ffe08a"), hx("#d99a1c"), hx("#4a2c05")
for ch, name in [(str(i), "score_num_normal_%d.png" % i) for i in range(10)] + [("+", "score_num_normal_plus.png")]:
    src = old_path("scorefx", name)
    im = render_text(ch, size_of(src), GOLD, GOLD_SHADE, GOLD_EDGE, pad=6, ink=120)
    save(im, "scorefx", name)
    pairs.append((src, os.path.join(OUT, "scorefx", name)))

# ---------- 柔光团 128×128 ----------
glow_src = old_path("boardfx", "boardfx_glow_soft.png")
W, H = size_of(glow_src)
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gpx = glow.load()
for y in range(H):
    for x in range(W):
        dx, dy = (x - W / 2) / (W / 2), (y - H / 2) / (H / 2)
        r = min(1.0, (dx * dx + dy * dy) ** 0.5)
        a = int(200 * (1 - r) ** 2.2)
        if a > 0:
            gpx[x, y] = (206, 244, 255, a)
save(glow, "boardfx", "boardfx_glow_soft.png")
pairs.append((glow_src, os.path.join(OUT, "boardfx", "boardfx_glow_soft.png")))

# ---------- 碎块点 64×64 ----------
dot_src = old_path("BurstFx", "fx_soft_dot.png")
W, H = size_of(dot_src)
dot = Image.new("RGBA", (W, H), (0, 0, 0, 0))
dpx = dot.load()
for y in range(H):
    for x in range(W):
        r = ((x - W / 2) ** 2 + (y - H / 2) ** 2) ** 0.5 / (W / 2)
        a = int(255 * max(0.0, 1 - r) ** 1.6)
        if a > 0:
            dpx[x, y] = (255, 255, 255, a)
save(dot, "BurstFx", "fx_soft_dot.png")
pairs.append((dot_src, os.path.join(OUT, "BurstFx", "fx_soft_dot.png")))

# ---------- 续玩扫描线：横向光带（替掉 db_FHQPD 的骨骼动画） ----------
# 512×96，中间一条亮线、上下柔和衰减、两头略淡；位移与淡出由代码驱动，素材只管长得像一条光。
W, H = 512, 96
band = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bpx = band.load()
for y in range(H):
    t = abs((y - H / 2) / (H / 2))
    a = int(230 * max(0.0, 1 - t) ** 2.6)
    for x in range(W):
        edge = min(1.0, min(x, W - 1 - x) / 48.0)
        aa = int(a * (0.35 + 0.65 * edge))
        if aa > 0:
            bpx[x, y] = (206, 244, 255, aa)
save(band, "sweep", "sweep_band.png")

# ---------- 消行光束：一张白色横光带（代码按骨牌色染）+ 一张彩虹版 ----------
# 512×64：中间一条亮核、上下柔和衰减、两头渐隐；行方向直接用，列方向由代码转 90 度。
W, H = 512, 64


def 横光带(color_at):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = im.load()
    for y in range(H):
        t = abs((y - H / 2) / (H / 2))
        a = int(255 * max(0.0, 1 - t) ** 2.2)
        for x in range(W):
            edge = min(1.0, min(x, W - 1 - x) / 56.0)
            aa = int(a * (0.25 + 0.75 * edge))
            if aa > 0:
                px[x, y] = color_at(x) + (aa,)
    return im


save(横光带(lambda x: (255, 255, 255)), "beam", "beam_line.png")
彩虹 = [(255, 90, 90), (255, 170, 60), (255, 235, 90), (110, 235, 130), (90, 200, 255), (150, 120, 255), (240, 120, 220)]
save(横光带(lambda x: 彩虹[min(len(彩虹) - 1, x * len(彩虹) // W)]), "beam", "beam_rainbow.png")

# ---------- 对照板：一对一对排 ----------
show = pairs[:12]
cell_w, cell_h = 420, 130
sheet = Image.new("RGB", (cell_w * 2 + 30, cell_h * len(show) + 30), (24, 37, 48))
d = ImageDraw.Draw(sheet)
for i, (old, new) in enumerate(show):
    if not os.path.exists(old):
        continue
    y = 15 + i * cell_h
    o = Image.open(old).convert("RGBA")
    n = Image.open(new).convert("RGBA")
    for j, im in enumerate((o, n)):
        k = min((cell_w - 10) / im.width, (cell_h - 30) / im.height, 1.0)
        im2 = im.resize((max(1, int(im.width * k)), max(1, int(im.height * k))), Image.LANCZOS)
        sheet.paste(im2, (15 + j * cell_w, y + 20), im2)
    d.text((15, y + 2), os.path.basename(old) + "   （左：旧   右：新）", fill=(200, 210, 220))
sheet.save(os.path.join(HERE, "对照_旧新.png"))
print("出好", len(pairs), "张，覆盖：tierword / scorefx / boardfx / BurstFx")
