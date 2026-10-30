"""成品裁 16:9: python -X utf8 裁16x9.py 成品/结算_v1A.png ...

按面板描边色（接近 #3a5262）量出界面件的上下边，各留 6 像素裁出来；
高不超过 864 就以界面件为中心直接裁 1536×864，超了就等比缩到 864 高、左右用两边的太空补齐。
"""
import sys
import numpy as np
from PIL import Image

W, H, PAD = 1536, 864, 6

for p in sys.argv[1:]:
    im = Image.open(p).convert("RGB")
    a = np.asarray(im).astype(int)
    edge = np.abs(a - np.array([0x3a, 0x52, 0x62])).sum(2) < 60
    rows = np.where(edge.sum(1) > 40)[0]
    y0, y1 = rows.min() - PAD, rows.max() + PAD
    if y1 - y0 <= H:
        top = max(0, min(im.height - H, (y0 + y1 - H) // 2))
        out = im.crop((0, top, W, top + H))
    else:
        part = im.crop((0, y0, W, y1))
        w = round(W * H / (y1 - y0))
        part = part.resize((w, H), Image.LANCZOS)
        out = Image.new("RGB", (W, H))
        side = (W - w) // 2
        out.paste(part, (side, 0))
        # 左右补的条：取两侧最外 4 列太空的逐行中值横向铺开（镜像会把面板边也镜过来）
        pa = np.asarray(part)
        for x0, x1, cols in ((0, side, pa[:, :4]), (side + w, W, pa[:, -4:])):
            fill = np.median(cols, axis=1).astype(np.uint8)[:, None, :].repeat(x1 - x0, 1)
            out.paste(Image.fromarray(fill), (x0, 0))
    dst = p[:-4] + "_16x9.png"
    out.save(dst)
    print(dst, "界面件", rows.min(), rows.max(), "高", y1 - y0)
