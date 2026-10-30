# -*- coding: utf-8 -*-
"""结算屏的切件与拼回预览。

  python -X utf8 拼回预览.py

件来源：共用件（面板 / 内格 / 按钮 / 键帽 / 图标 / 方块库 / 星空底）在 `../共用/切件/`；
结算专属件是这里的 `图标/头像_碎星.png`——从认可图 v2A 的头像框里裁圆，再叠共用件的 `头像框.png`。
拼回按 `../布局_结算.json`（1920×1280，界面件占 y 100–1180）逐件摆，字用微软雅黑代替（正式字体没定）。
"""
import json, os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
UP = os.path.dirname(HERE)                       # 结算/
SHARED = os.path.join(os.path.dirname(UP), "共用", "切件")
P = lambda *a: os.path.join(HERE, *a)
S = lambda *a: os.path.join(SHARED, *a)
def hx(s): s = s.lstrip("#"); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))

布局 = json.load(open(os.path.join(UP, "布局_结算.json"), encoding="utf-8"))
配色 = 布局["配色"]
DY = 100                                          # 布局 1280 高，界面件在 y 100–1180

# ---------- 结算专属：打碎的目标星球头像 ----------
# 布局里的圆是 (620,375) r=92（1280 坐标）；认可图是 1920×1280 按 0.8 缩的 1536×1024
ref = Image.open(os.path.join(UP, "成品", "结算_v2A.png")).convert("RGBA")
cx, cy, r = 620 * 0.8, 375 * 0.8, 92 * 0.8
box = (round(cx - r), round(cy - r), round(cx + r), round(cy + r))
头像 = ref.crop(box)
mask = Image.new("L", 头像.size, 0)
ImageDraw.Draw(mask).ellipse((0, 0, 头像.width - 1, 头像.height - 1), fill=255)
头像.putalpha(mask)
头像 = 头像.resize((176, 176), Image.LANCZOS)
os.makedirs(P("图标"), exist_ok=True)
头像.save(P("图标", "头像_碎星.png"))

清单 = {
    "说明": "结算屏专属件；共用件见 ../../共用/切件/切件清单.json",
    "件": {
        "图标/头像_碎星.png": {"尺寸": [176, 176], "过滤": "Bilinear",
                            "用在": "结算面板头部：被打碎的目标星球，从认可图 v2A 头像框里裁圆；外面叠共用件的 头像框.png(184×184)"},
    },
}
json.dump(清单, open(P("切件清单.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# ---------- 拼回 ----------
bg = Image.open(S("背景", "背景_1920x1080.png")).convert("RGB").resize((1920, 1080), Image.LANCZOS)
canvas = Image.new("RGBA", (1920, 1280), (0, 0, 0, 0))
canvas.paste(bg, (0, DY))                         # 1080 的背景按布局的偏移贴，界面件占 y 100–1180

def nine(path, w, h, b):
    src = Image.open(path).convert("RGBA")
    sw, sh = src.size
    o = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    xs, ys = [0, b, sw - b, sw], [0, b, sh - b, sh]
    XS, YS = [0, b, w - b, w], [0, b, h - b, h]
    for i in range(3):
        for j in range(3):
            piece = src.crop((xs[i], ys[j], xs[i + 1], ys[j + 1]))
            tw, th = XS[i + 1] - XS[i], YS[j + 1] - YS[j]
            if tw > 0 and th > 0:
                o.alpha_composite(piece.resize((tw, th), Image.BILINEAR), (XS[i], YS[j]))
    return o

九宫 = {"面板": (S("面板.png"), 16), "内格": (S("内格.png"), 10), "商店钮": (S("按钮_蓝.png"), 16)}

def 摆块(b):
    x0, y0, x1, y1 = b["块"]
    w, h = x1 - x0, y1 - y0
    色 = b.get("色")
    if 色 in 九宫:
        path, sl = 九宫[色]
        canvas.alpha_composite(nine(path, w, h, sl), (x0, y0))
    else:
        d = ImageDraw.Draw(canvas)
        d.rounded_rectangle((x0, y0, x1, y1), b.get("圆角", 0), fill=hx(配色.get(色, 色)) + (255,))
        if b.get("边"):
            d.rounded_rectangle((x0, y0, x1, y1), b.get("圆角", 0), outline=hx(配色[b["边"]]) + (255,), width=b.get("边宽", 2))

def 摆圆(b):
    x, y, r = b["圆"]
    d = ImageDraw.Draw(canvas)
    d.ellipse((x - r, y - r, x + r, y + r), fill=hx(配色.get(b.get("色"), b.get("色"))) + (255,))
    if b.get("边"):
        d.ellipse((x - r, y - r, x + r, y + r), outline=hx(配色[b["边"]]) + (255,), width=b.get("边宽", 2))

def 摆线(b):
    x0, y0, x1, y1 = b["线"]
    ImageDraw.Draw(canvas).line((x0, y0, x1, y1), fill=hx(配色.get(b.get("色"), b.get("色"))) + (255,), width=b.get("宽", 2))

def 摆方(b):
    x0, y0, x1, y1 = b["方"]
    ImageDraw.Draw(canvas).rectangle((x0, y0, x1, y1), fill=hx(配色.get(b.get("色"), b.get("色"))) + (255,))

F = r"C:\Windows\Fonts\msyhbd.ttc"; FR = r"C:\Windows\Fonts\msyh.ttc"

def 摆字(b):
    x, y = b["在"]
    font = ImageFont.truetype(F if b.get("粗") else FR, b["号"])
    anchor = {"左": "lm", "右": "rm", "中": "mm"}.get(b.get("对齐"), "mm")
    ImageDraw.Draw(canvas).text((x, y), b["字"], font=font, fill=hx(配色.get(b.get("色"), b.get("色"))) + (255,),
                                anchor=anchor)

科技图标 = ["科技_单轴", "科技_双轨", "科技_折轨"]
科技序号 = 0

def 摆占位(b):
    global 科技序号
    x, y = b["在"]
    name = b["占位"]
    if name == "科技图标":
        path = S("图标", 科技图标[科技序号 % 3] + ".png"); 科技序号 += 1
    elif name == "基因包":
        path = S("图标", "补给_基因.png")
    elif name == "科技包":
        path = S("图标", "补给_科技.png")
    elif name == "金色票券":
        path = S("图标", "券_金色.png")
    elif name == "被打碎的目标星球":
        canvas.alpha_composite(头像, (round(x - 88), round(y - 88)))
        canvas.alpha_composite(Image.open(S("头像框.png")).convert("RGBA"), (round(x - 92), round(y - 92)))
        return
    else:
        return                                   # 空槽：格子本身已经画了内格
    canvas.alpha_composite(Image.open(path).convert("RGBA").resize((40, 40), Image.LANCZOS), (round(x - 20), round(y - 20)))

for b in 布局["块"]:
    if "块" in b: 摆块(b)
for b in 布局["块"]:
    if "圆" in b: 摆圆(b)
for b in 布局["块"]:
    if "字" in b: 摆字(b)
for b in 布局["块"]:
    if "线" in b: 摆线(b)
    elif "占位" in b: 摆占位(b)

# 方块库的迷你骨牌：库格是 80×82 的内格，按 (行, 列) 顺序摆 7 种骨牌，盖掉布局里那些单色「方」
库块 = {k: Image.open(S("库块", "库块_" + k + ".png")).convert("RGBA") for k in "IOTSZJL"}
格 = [b["块"] for b in 布局["块"] if "块" in b and b.get("色") == "内格"
      and 78 <= b["块"][2] - b["块"][0] <= 82 and 80 <= b["块"][3] - b["块"][1] <= 84]
格.sort(key=lambda r: (r[1], r[0]))
for i, (x0, y0, x1, y1) in enumerate(格[:7]):
    k = "IOTSZJL"[i]
    block = 库块[k]
    canvas.alpha_composite(block, (x0 + (x1 - x0 - block.width) // 2, y0 + (y1 - y0 - block.height) // 2 - 4))

# 结算屏竖向裁剪：界面件占 y 100–1180（1280 坐标）
拼回 = canvas.crop((0, DY, 1920, DY + 1080)).convert("RGB")
拼回.save(P("预览_拼回.png"))

ref16 = Image.open(os.path.join(UP, "成品", "结算_v2A_16x9.png")).convert("RGB").resize((1920, 1080), Image.LANCZOS)
sheet = Image.new("RGB", (1920, 2180), (255, 255, 255))
sheet.paste(拼回, (0, 0))
sheet.paste(ref16, (0, 1100))
d = ImageDraw.Draw(sheet)
d.text((10, 1082), "上：切件拼回（字用微软雅黑代替）   下：认可的效果图 v2A（16:9 裁切放大到 1920×1080）",
       font=ImageFont.truetype(FR, 14), fill=(0, 0, 0))
sheet.resize((960, 1090), Image.LANCZOS).save(P("对照_拼回vs效果图.jpg"), quality=90)
print("ok")
