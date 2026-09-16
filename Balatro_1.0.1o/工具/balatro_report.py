# -*- coding: utf-8 -*-
"""把 肉鸽玩法设计分析.md 打包成一份自包含的 HTML 报告。

自包含的意思:两张 SVG 图**内联**进 HTML(不是外链),所以单个文件拷到哪都能看,
且图自带的亮/暗两套配色照常生效。内联时会把 SVG 里的 CSS 选择器加上 #figN 前缀,
否则两张图的 `svg{--s1:...}` 会互相串台。

Markdown 里指向仓库内文件的链接在单文件报告里点不开,一律降级成等宽的路径文本,
出处信息保留、不假装可点。

产出: 报告/Balatro肉鸽设计分析.html
用法: python balatro_report.py [输出HTML路径]
"""
import io
import os
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '肉鸽玩法设计分析.md')

CN_NUM = '零一二三四五六七八九十'


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def inline(t):
    """行内标记:代码 > 图片/链接 > 粗体。代码先抽出来占位,免得内部的 * 被当粗体。"""
    stash = []

    def keep(html):
        stash.append(html)
        return '\x00%d\x00' % (len(stash) - 1)

    t = re.sub(r'`([^`]+)`', lambda m: keep('<code>%s</code>' % esc(m.group(1))), t)
    # 仓库内链接点不开,降级成路径文本;外链保留
    def link(m):
        label, href = m.group(1), m.group(2)
        if href.startswith(('http://', 'https://')):
            return keep('<a href="%s" target="_blank" rel="noopener">%s</a>' % (esc(href), esc(label)))
        return keep('<code class="path">%s</code>' % esc(label))
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, t)
    t = esc(t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', t)
    return re.sub(r'\x00(\d+)\x00', lambda m: stash[int(m.group(1))], t)


def embed_svg(path, fid):
    """读 SVG,把它的 CSS 选择器都限定到 #figN 下,避免两张图互相覆盖变量。"""
    s = io.open(path, encoding='utf-8').read()
    s = re.sub(r'\s*(width|height)="\d+"', '', s, count=2)
    s = s.replace('<svg ', '<svg id="%s" ' % fid, 1)

    def scope(m):
        css = m.group(1)
        out = []
        for rule in re.split(r'(?<=\})', css):
            if not rule.strip():
                continue
            if rule.lstrip().startswith('@media'):
                head, _, body = rule.partition('{')
                body = re.sub(r'(^|\})\s*(svg|\.[\w-]+)\s*\{',
                              lambda n: '%s#%s%s{' % (n.group(1), fid,
                                                      '' if n.group(2) == 'svg' else ' ' + n.group(2)), body)
                out.append(head + '{' + body)
            else:
                out.append(re.sub(r'^\s*(svg|\.[\w-]+)\s*\{',
                                  lambda n: '#%s%s{' % (fid, '' if n.group(1) == 'svg' else ' ' + n.group(1)),
                                  rule))
        return '<style>%s</style>' % ''.join(out)

    return re.sub(r'<style>(.*?)</style>', scope, s, flags=re.S)


def convert(md):
    """够用的 Markdown 子集:标题/表格/代码块/列表/引用/分隔线/图片。"""
    lines = md.split('\n')
    out, i, n_fig = [], 0, 0
    sec_open = False
    while i < len(lines):
        ln = lines[i]

        if ln.startswith('```'):
            buf = []
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                buf.append(lines[i])
                i += 1
            out.append('<pre><code>%s</code></pre>' % esc('\n'.join(buf)))
            i += 1
            continue

        m = re.match(r'!\[([^\]]*)\]\(([^)]+)\)', ln.strip())
        if m:
            n_fig += 1
            p = os.path.join(ROOT, m.group(2).replace('/', os.sep))
            out.append('<figure class="fig"><div class="fig-scroll">%s</div>'
                       '<figcaption>图 %d · %s</figcaption></figure>'
                       % (embed_svg(p, 'fig%d' % n_fig), n_fig, esc(m.group(1))))
            i += 1
            continue

        if ln.startswith('|'):
            tbl = []
            while i < len(lines) and lines[i].startswith('|'):
                tbl.append(lines[i])
                i += 1
            out.append(table(tbl))
            continue

        if ln.strip() == '---':
            i += 1
            continue

        if ln.startswith('## '):
            if sec_open:
                out.append('</section>')
            title = ln[3:].strip()
            mm = re.match(r'^([%s]+)、(.*)$' % CN_NUM, title)
            eyebrow, head = (mm.group(1), mm.group(2)) if mm else ('', title)
            sid = 's%d' % (len(re.findall(r'<section', ''.join(out))) + 1)
            out.append('<section id="%s">' % sid)
            out.append('<h2><span class="eyebrow">%s</span>%s</h2>'
                       % (esc(eyebrow) if eyebrow else '', inline(head)))
            sec_open = True
            i += 1
            continue

        if ln.startswith('### '):
            out.append('<h3>%s</h3>' % inline(ln[4:].strip()))
            i += 1
            continue

        if ln.startswith('# '):
            i += 1
            continue

        if ln.startswith('> '):
            buf = []
            while i < len(lines) and lines[i].startswith('> '):
                buf.append(lines[i][2:])
                i += 1
            out.append('<blockquote>%s</blockquote>' % inline(' '.join(buf)))
            continue

        if re.match(r'^[-*] ', ln) or re.match(r'^\d+\. ', ln):
            ordered = bool(re.match(r'^\d+\. ', ln))
            items = []
            while i < len(lines) and (re.match(r'^[-*] ', lines[i]) or re.match(r'^\d+\. ', lines[i])
                                      or (items and lines[i].startswith('   ') and lines[i].strip())):
                if lines[i].startswith('   ') and not re.match(r'^\s*[-*\d]', lines[i].strip()[:2]):
                    items[-1] += ' ' + lines[i].strip()
                else:
                    items.append(re.sub(r'^([-*]|\d+\.) ', '', lines[i]))
                i += 1
            tag = 'ol' if ordered else 'ul'
            out.append('<%s>%s</%s>' % (tag, ''.join('<li>%s</li>' % inline(x) for x in items), tag))
            continue

        if ln.strip():
            buf = []
            while i < len(lines) and lines[i].strip() and not re.match(
                    r'^(\||#{1,3} |```|> |[-*] |\d+\. |!\[|---$)', lines[i]):
                buf.append(lines[i].strip())
                i += 1
            out.append('<p>%s</p>' % inline(' '.join(buf)))
            continue
        i += 1

    if sec_open:
        out.append('</section>')
    return '\n'.join(out)


def table(rows):
    def cells(r):
        return [c.strip() for c in r.strip().strip('|').split('|')]
    head = cells(rows[0])
    align = []
    for c in cells(rows[1]) if len(rows) > 1 else []:
        align.append('right' if c.endswith(':') and not c.startswith(':')
                     else 'center' if c.startswith(':') and c.endswith(':') else 'left')
    align += ['left'] * (len(head) - len(align))
    h = ''.join('<th style="text-align:%s">%s</th>' % (align[j], inline(c)) for j, c in enumerate(head))
    body = []
    for r in rows[2:]:
        cs = cells(r)
        body.append('<tr>%s</tr>' % ''.join(
            '<td style="text-align:%s">%s</td>' % (align[j] if j < len(align) else 'left', inline(c))
            for j, c in enumerate(cs)))
    return ('<div class="tw"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div>'
            % (h, ''.join(body)))


def toc(body):
    items = []
    for m in re.finditer(r'<section id="(s\d+)">\s*<h2><span class="eyebrow">([^<]*)</span>(.*?)</h2>', body, re.S):
        label = re.sub(r'<[^>]+>', '', m.group(3))
        items.append('<a href="#%s"><span class="tn">%s</span>%s</a>' % (m.group(1), m.group(2) or '·', label))
    return ''.join(items)


HEAD = '''<title>方块与倍率</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700&family=IBM+Plex+Mono:wght@400;600&display=swap">
<style>
:root{
  --paper:#f5f6f7; --card:#fffffe; --ink:#14171c; --ink2:#454c56; --ink3:#7b838f;
  --rule:#dfe2e6; --rule2:#eceef0;
  --chip:#1668b8;          /* Balatro 的筹码是蓝的 */
  --mult:#cf4034;          /* 倍率是红的 */
  --chip-soft:#e7f0fa; --mult-soft:#fbeae8;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#101317; --card:#171b21; --ink:#f2f4f6; --ink2:#b4bcc6; --ink3:#7e8792;
  --rule:#272d35; --rule2:#1e242b;
  --chip:#57a8f0; --mult:#f0685a; --chip-soft:#16283a; --mult-soft:#331d1b;
}}
:root[data-theme="dark"]{
  --paper:#101317; --card:#171b21; --ink:#f2f4f6; --ink2:#b4bcc6; --ink3:#7e8792;
  --rule:#272d35; --rule2:#1e242b;
  --chip:#57a8f0; --mult:#f0685a; --chip-soft:#16283a; --mult-soft:#331d1b;
}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font-family:"PingFang SC","Microsoft YaHei","Noto Sans SC","Hiragino Sans GB",system-ui,sans-serif;
  font-size:15px;line-height:1.85;-webkit-font-smoothing:antialiased}
.wrap{display:grid;grid-template-columns:1fr;gap:0;max-width:1180px;margin:0 auto;padding-inline:20px;padding-block:0 72px}
@media(min-width:1080px){.wrap{grid-template-columns:212px minmax(0,1fr);gap:48px;padding-inline:32px}}

/* ---------- 抬头 ---------- */
header.mast{grid-column:1/-1;padding-block:56px 34px;border-bottom:2px solid var(--ink)}
.kicker{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11.5px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--ink3);margin-bottom:14px}
h1{font-family:"Noto Serif SC",Georgia,serif;font-weight:700;font-size:clamp(30px,5.4vw,46px);
  line-height:1.25;margin:0 0 16px;text-wrap:balance;letter-spacing:-.01em}
h1 em{font-style:normal;color:var(--mult)}
.standfirst{max-width:62ch;color:var(--ink2);font-size:16px;margin:0}
.meta{display:flex;flex-wrap:wrap;gap:8px 22px;margin-top:22px;
  font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11.5px;color:var(--ink3)}

/* ---------- 关键数字 ---------- */
.stats{grid-column:1/-1;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
  gap:1px;background:var(--rule);border:1px solid var(--rule);margin-block:28px 0}
.stat{background:var(--card);padding:18px 16px}
.stat b{display:block;font-family:"IBM Plex Mono",ui-monospace,monospace;font-weight:600;
  font-size:24px;line-height:1.15;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.stat.c b{color:var(--chip)} .stat.m b{color:var(--mult)}
.stat span{display:block;margin-top:7px;font-size:12px;color:var(--ink3);line-height:1.5}

/* ---------- 目录 ---------- */
nav.toc{display:none}
@media(min-width:1080px){nav.toc{display:block;position:sticky;top:calc(env(safe-area-inset-top,0px) + 24px);
  align-self:start;max-height:calc(100vh - 60px);overflow-y:auto;padding-block:20px 20px;font-size:12.5px}}
nav.toc a{display:flex;gap:9px;padding:5px 0;color:var(--ink2);text-decoration:none;line-height:1.45;
  border-left:2px solid transparent;padding-left:11px;margin-left:-13px}
nav.toc a:hover{color:var(--mult);border-left-color:var(--mult)}
nav.toc .tn{font-family:"Noto Serif SC",serif;color:var(--ink3);flex:none;width:1.1em}
.toc-h{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:10.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--ink3);margin-bottom:12px}

/* ---------- 正文 ---------- */
main{min-width:0;padding-block:12px 0}
section{padding-block:4px 38px;border-bottom:1px solid var(--rule2)}
section:last-child{border-bottom:0}
h2{font-family:"Noto Serif SC",Georgia,serif;font-weight:700;font-size:clamp(21px,3vw,27px);
  line-height:1.35;margin:34px 0 20px;display:flex;gap:14px;align-items:baseline;text-wrap:balance}
h2 .eyebrow{font-size:.72em;color:var(--mult);flex:none;font-weight:500}
h3{font-family:"Noto Serif SC",Georgia,serif;font-weight:500;font-size:17px;margin:34px 0 12px;
  padding-bottom:7px;border-bottom:1px solid var(--rule);text-wrap:balance}
p{margin:0 0 15px;max-width:68ch}
ul,ol{margin:0 0 16px;padding-left:1.3em;max-width:68ch}
li{margin-bottom:8px}
strong{font-weight:600;color:var(--ink)}
a{color:var(--chip)}
blockquote{margin:20px 0;padding:13px 17px;background:var(--chip-soft);border-left:3px solid var(--chip);
  color:var(--ink2);font-size:13.5px;max-width:68ch}
code{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,monospace;font-size:.86em;
  background:var(--rule2);padding:1px 5px;border-radius:3px;word-break:break-word}
code.path{background:none;padding:0;color:var(--ink3);font-size:.84em}
pre{background:var(--card);border:1px solid var(--rule);padding:16px;overflow-x:auto;margin:0 0 20px;
  font-size:12.5px;line-height:1.7}
pre code{background:none;padding:0;font-size:1em;color:var(--ink2)}

/* ---------- 表格 ---------- */
.tw{overflow-x:auto;margin:0 0 24px;border:1px solid var(--rule);background:var(--card)}
table{border-collapse:collapse;width:100%;min-width:min(100%,460px);font-size:13px}
th,td{padding:8px 13px;border-bottom:1px solid var(--rule2);vertical-align:top;line-height:1.6}
thead th{background:var(--rule2);font-weight:600;font-size:11.5px;letter-spacing:.03em;
  color:var(--ink2);white-space:nowrap;border-bottom:1px solid var(--rule)}
tbody tr:last-child td{border-bottom:0}
td{font-variant-numeric:tabular-nums}
tbody tr:hover{background:var(--rule2)}

/* ---------- 图 ---------- */
.fig{margin:0 0 28px}
.fig-scroll{overflow-x:auto;border:1px solid var(--rule);background:var(--card);padding:10px}
.fig svg{display:block;width:100%;height:auto;min-width:620px}
figcaption{margin-top:10px;font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11.5px;
  color:var(--ink3);line-height:1.6}

footer{grid-column:1/-1;margin-top:44px;padding-top:22px;border-top:2px solid var(--ink);
  font-size:12px;color:var(--ink3);line-height:1.75}
footer b{color:var(--ink2);font-weight:600}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
:focus-visible{outline:2px solid var(--mult);outline-offset:2px}
</style>'''

STATS = [
    ('m', '2.08–2.53×', '需求曲线每个 Ante 的增长，8 个 Ante 共 167–667 倍'),
    ('c', '5', '小丑槽位——唯一的指数轴被它卡死'),
    ('m', '2 / 61', '普通池里的 X 倍率卡；稀有池是 11 / 20'),
    ('c', '420', '条倍增关系，分六类机制'),
]


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '报告', 'Balatro肉鸽设计分析.html')
    md = io.open(SRC, encoding='utf-8').read()
    # 抬头单独做,正文从「零、」开始
    body = convert(md[md.index('## 零、'):])
    stats = ''.join('<div class="stat %s"><b>%s</b><span>%s</span></div>' % s for s in STATS)
    html = '\n'.join([
        HEAD,
        '<div class="wrap">',
        '<header class="mast">',
        '<div class="kicker">拆包分析 · Balatro 1.0.1o · PROD_mobile</div>',
        '<h1>方块与倍率：<em>一场写成乘式的军备竞赛</em></h1>',
        '<p class="standfirst">Balatro 把肉鸽的构筑成长压缩成了 <code>得分 = 筹码 × 倍率</code> 这一个指标，'
        '再让需求曲线以每个 Ante 约 2.1–2.5 倍的速度在后面追。这份报告拆的是：'
        '这套乘式是怎么把稀有度、槽位、经济、Boss 和注码全部串成一条线的。</p>',
        '<div class="meta"><span>37 个明文 Lua · 2.0MB</span><span>341 条内容条目</span>'
        '<span>150 张小丑 / 16 个流派</span><span>无服务端下发</span></div>',
        '</header>',
        '<div class="stats">%s</div>' % stats,
        '<nav class="toc"><div class="toc-h">目录</div>%s</nav>' % toc(body),
        '<main>', body, '</main>',
        '<footer><b>口径说明。</b>需求曲线、经济、掉率、权重全部出自包内明文 Lua 与拆出的 11 张总表，'
        '可逐条回溯到 <code>文件:行号</code>。第二节的四种构筑、第四节的流派标签与资源产销表是<b>建模与人工判断</b>，'
        '不是拆包事实——口径写在生成脚本里，改判断只动那几张表。文中的路径指向拆包工作区，'
        '在这份单文件报告里不可点。<br>两张图由 <code>balatro_curve.py</code> 与 '
        '<code>balatro_synergy_graph.py</code> 生成，数字均为实读；本页由 <code>balatro_report.py</code> 打包。</footer>',
        '</div>',
    ])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    io.open(out, 'w', encoding='utf-8').write(html)
    print('段落 %d · 表格 %d · 图 %d · %.0f KB'
          % (html.count('<p>'), html.count('<table'), html.count('<figure'), len(html.encode('utf-8')) / 1024))
    print('-> %s' % out)


if __name__ == '__main__':
    main()
