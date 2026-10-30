# -*- coding: utf-8 -*-
"""像素规整：把出图模型画的「伪像素」图标压成真像素件（N×N、一格一色、颜色数受控），和程序画的方块同一个格子。

  python -X utf8 像素规整.py 输入.png [--裁 x0,y0,x1,y1] [--格 20] [--色 12] [--描边 无|内|外] [--出 目录] [--名 名字]
  python -X utf8 像素规整.py 输入.png --量格        # 只量这张图的像素格大小，不出件

做法：
  1. 去底：有透明通道就用；没有就从四边往里漫水，和边缘颜色相近的算底（--容差 调）。出图时让模型给纯色底最省事。
  2. 取主体外框，补成正方形，四周各留 1 格（给外描边腾位置）。
  3. 在原尺寸上把主体的颜色聚成 --色 种（Pillow 中位切分），再按格取众数，不取平均——取平均会出糊色。
  4. 格里不透明的像素过半才算实格，透明度二值化。
  5. 去孤点：周围 8 格都没有同色的格改成周围最多的颜色（--留孤点 关掉）。
  6. 描边：「内」把挨着透明的实格换成本色深一档；「外」在实格外面加一圈本色深一档；默认不加，原图多半自带轮廓。
格数：图标默认 20（v3A 里图标约 20 格宽，压到 16 会丢窗口、尾焰这类细节）；方块是 16，但方块是程序画的，不走这里。

深一档的算法和 战斗界面/切件/生成切件.py 的 mul 一样（压暗，暗部往蓝紫偏），照戴夫「轮廓本色深一档、不用纯黑」。

出两份：原尺寸（进工程，Point 过滤）和 ×5 预览；另打一行检查：颜色数、孤立像素数。
"""
import argparse, os
from collections import Counter
from PIL import Image

def mul(a, k, cool=0.0):
    r, g, b = (c * k for c in a)
    return (round(r * (1 - cool)), round(g * (1 - cool * 0.5)), round(min(255, b + 40 * cool)))

def dist(a, b): return sum((a[i] - b[i]) ** 2 for i in range(3)) ** 0.5

def 去底(im, 容差):
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    if any(px[x, y][3] < 255 for x, y in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))):
        return im                                          # 自带透明通道
    边 = [px[x, y][:3] for x in range(w) for y in (0, h - 1)] + [px[x, y][:3] for y in range(h) for x in (0, w - 1)]
    底 = tuple(sorted(c[i] for c in 边)[len(边) // 2] for i in range(3))
    seen = bytearray(w * h)
    stack = [(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)]
    while stack:
        x, y = stack.pop()
        if not (0 <= x < w and 0 <= y < h) or seen[y * w + x]:
            continue
        seen[y * w + x] = 1
        if dist(px[x, y][:3], 底) > 容差:
            continue
        px[x, y] = (0, 0, 0, 0)
        stack += ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1))
    return im

def 规整(im, 格, 色数, 描边, 去孤点=True):
    bbox = im.getchannel("A").point(lambda a: 255 if a >= 128 else 0).getbbox()
    if not bbox:
        raise SystemExit("去底后什么都没剩，调大 --容差 的反面：调小它")
    x0, y0, x1, y1 = bbox
    边长 = max(x1 - x0, y1 - y0) * 格 / (格 - 2)             # 主体占 格-2，四周各留 1 格
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    sx, sy = cx - 边长 / 2, cy - 边长 / 2
    step = 边长 / 格

    rgb = Image.new("RGB", im.size, (0, 0, 0))
    rgb.paste(im, mask=im.getchannel("A"))
    q = rgb.quantize(colors=色数 + 1, method=Image.Quantize.MEDIANCUT)   # +1 留给黑底
    pal = q.getpalette()
    qp, ap = q.load(), im.getchannel("A").load()
    W, H = im.size

    out = Image.new("RGBA", (格, 格), (0, 0, 0, 0))
    op = out.load()
    for gy in range(格):
        for gx in range(格):
            cnt, total = Counter(), 0
            for y in range(int(sy + gy * step), int(sy + (gy + 1) * step)):
                for x in range(int(sx + gx * step), int(sx + (gx + 1) * step)):
                    total += 1
                    if 0 <= x < W and 0 <= y < H and ap[x, y] >= 128:
                        cnt[qp[x, y]] += 1
            if total and sum(cnt.values()) * 2 > total:
                i = cnt.most_common(1)[0][0]
                op[gx, gy] = tuple(pal[i * 3:i * 3 + 3]) + (255,)

    def 实(x, y): return 0 <= x < 格 and 0 <= y < 格 and op[x, y][3]
    邻 = ((1, 0), (-1, 0), (0, 1), (0, -1))
    if 去孤点:
        # 周围 8 格都没有同色的格，改成周围最多的颜色：原图的抗锯齿和光晕规整后多半变成这种碎点。
        # 只看上下左右会把斜向的一格细线（星环、引脚）也当碎点吃掉，所以看 8 格
        改 = {}
        for y in range(格):
            for x in range(格):
                if not 实(x, y):
                    continue
                周围 = Counter(op[x + dx, y + dy] for dx in (-1, 0, 1) for dy in (-1, 0, 1) if (dx or dy) and 实(x + dx, y + dy))
                if 周围 and op[x, y] not in 周围:
                        改[x, y] = 周围.most_common(1)[0][0]
        for k, c in 改.items():
            op[k] = c
    if 描边 == "内":
        边格 = [(x, y) for y in range(格) for x in range(格) if 实(x, y) and any(not 实(x + dx, y + dy) for dx, dy in 邻)]
        for x, y in 边格:
            op[x, y] = mul(op[x, y][:3], 0.55, 0.3) + (255,)
    elif 描边 == "外":
        加 = {}
        for y in range(格):
            for x in range(格):
                if not 实(x, y):
                    ns = [op[x + dx, y + dy][:3] for dx, dy in 邻 if 实(x + dx, y + dy)]
                    if ns:
                        加[x, y] = mul(min(ns, key=sum), 0.55, 0.3)
        for (x, y), c in 加.items():
            op[x, y] = c + (255,)
    return out

def 检查(im):
    px, (w, h) = im.load(), im.size
    颜色 = {px[x, y][:3] for y in range(h) for x in range(w) if px[x, y][3]}
    孤立 = 0
    for y in range(h):
        for x in range(w):
            if not px[x, y][3]:
                continue
            ns = [px[x + dx, y + dy] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if 0 <= x + dx < w and 0 <= y + dy < h]
            if all(n[:3] != px[x, y][:3] or not n[3] for n in ns):
                孤立 += 1
    return len(颜色), 孤立

def 量格(im):
    """看横竖两个方向上「同色连续段」的长度分布：真像素图的段长都是格宽的整数倍，众数就是格宽。"""
    rgb = im.convert("RGB")
    px, (w, h) = rgb.load(), rgb.size
    runs = Counter()
    for y in range(0, h, 3):
        n = 1
        for x in range(1, w):
            if dist(px[x, y], px[x - 1, y]) < 12: n += 1
            else: runs[n] += 1; n = 1
    for x in range(0, w, 3):
        n = 1
        for y in range(1, h):
            if dist(px[x, y], px[x, y - 1]) < 12: n += 1
            else: runs[n] += 1; n = 1
    短段 = sum(v for k, v in runs.items() if k <= 2)
    total = sum(runs.values())
    候选 = [(k, v) for k, v in runs.most_common() if k >= 3][:5]
    return 候选, 短段 / max(total, 1)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("输入")
    ap.add_argument("--裁", help="x0,y0,x1,y1，先裁再做")
    ap.add_argument("--格", type=int, default=20)
    ap.add_argument("--色", type=int, default=12)
    ap.add_argument("--描边", choices=("无", "内", "外"), default="无")
    ap.add_argument("--容差", type=float, default=40)
    ap.add_argument("--出", default=".")
    ap.add_argument("--名")
    ap.add_argument("--留孤点", action="store_true", help="不做去孤点")
    ap.add_argument("--量格", action="store_true")
    a = ap.parse_args()

    im = Image.open(a.输入)
    if a.裁:
        im = im.crop(tuple(int(v) for v in a.裁.split(",")))
    if a.量格:
        候选, 碎 = 量格(im)
        print("段长众数（格宽候选）:", "  ".join(f"{k}px×{v}" for k, v in 候选), f"｜1~2px 的碎段占 {碎:.0%}（越高越不像真像素）")
        return
    件 = 规整(去底(im, a.容差), a.格, a.色, a.描边, not a.留孤点)
    名 = a.名 or os.path.splitext(os.path.basename(a.输入))[0]
    os.makedirs(os.path.join(a.出, "预览x5"), exist_ok=True)
    件.save(os.path.join(a.出, 名 + ".png"))
    件.resize((a.格 * 5, a.格 * 5), Image.NEAREST).save(os.path.join(a.出, "预览x5", 名 + ".png"))
    n, iso = 检查(件)
    print(f"{名}: {a.格}×{a.格}，{n} 色，孤立像素 {iso}")

if __name__ == "__main__":
    main()
