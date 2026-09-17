# Balatro 1.0.1o 拆包工作区

`com.playstack.balatro.android.apk`（63MB）的完整拆包产物与工具链。
游戏本体版本 `1.0.1o-FULL [M]` / `PROD_mobile`，Android 壳 12.11.0（构建 2026-01-26）。

**这个包没有壳**：LÖVE(Love2D) + LuaJIT，`assets/` 下就是明文 `.lua` 与资源，
没有加密、没有字节码、没有热更。所有数值写死在客户端，**没有服务端配置下发** ——
这一点和本工作区另外三个包（Gossip Harbor / 守护世界 / Block）相反，
所以结论不需要带「服务端可覆盖」的前提。

---

## 快速开始

```bash
python 工具/balatro_all.py
```

一条命令从 APK 跑到全部产物，约 3 秒。常用开关：

```bash
python 工具/balatro_all.py --dry               # 只列计划，不执行
python 工具/balatro_all.py --skip=unpack       # 源码已在盘上，跳过解包
python 工具/balatro_all.py --only=jokers,index # 只重跑某几步
python 工具/balatro_all.py --jadx              # 连 classes.dex 一起反编译（慢，默认不跑）
python 工具/balatro_all.py --apk=D:\other.apk  # 换输入 APK
```

**产物是幂等的**：连跑两次，492 个文件逐字节相同。
所以改了脚本可以直接 `md5sum` 前后比对来确认影响面。

依赖：Python 3.12 + `lupa`（Lua 沙箱）+ `Pillow`（图集切片）；`--jadx` 需要 Java。

---

## 入口

| 想做什么 | 看哪份 |
|---|---|
| 查数值结论（曲线、经济、掉率、权重） | [数值设计报告.md](数值设计报告.md) |
| 看玩法设计怎么搭起来的（结构、张力、流派、元进程） | [肉鸽玩法设计分析.md](肉鸽玩法设计分析.md) |
| 查某个 Boss 盲注做什么、压哪些流派、怎么绕 | [Boss盲注专题.md](Boss盲注专题.md) |
| 查出牌之后按什么顺序结算（小丑顺序、乘区、重复触发） | [出牌结算管线.md](出牌结算管线.md) |
| 查 20 个挑战各改了什么规则、怎么解锁 | [挑战模式.md](挑战模式.md) |
| 查某一类内容的具体条目 | [配置/总表索引.md](配置/总表索引.md) → 对应总表 |
| 和 Brotato 的机制对比 | [../Balatro与Brotato横向对比.md](../Balatro与Brotato横向对比.md) |
| 改脚本 / 排查解析问题 | [../工具文档/Balatro技术细节.md](../工具文档/Balatro技术细节.md) |

---

## 流程

10 步，按依赖顺序。硬依赖只有两条：`config` 必须在 `text` 之前（text 要往
`配置JSON/` 写 `CHALLENGES.*`），`index` 必须最后。

| # | 步骤 | 脚本 | 输入 | 输出 |
|--:|---|---|---|---|
| 1 | unpack | `balatro_unpack.py` | APK | `源码/` `本地化/` `资源/` `原生库/` `安卓壳/` + `_索引.csv` |
| 2 | config | `balatro_config.py` | `源码/game.lua` | 18 张原型表，`配置/配置JSON/` + `配置/配置CSV/` 各一份 |
| 3 | text | `balatro_text.py` | `本地化/` `源码/challenges.lua` | `文本/`(15 语言 + 中英对照) + `CHALLENGES.*` |
| 4 | sprites | `balatro_sprites.py` | `配置JSON/` `资源/` | `图片资源/` 359 张一物一图 PNG |
| 5 | jokers | `balatro_jokers.py` | `配置JSON/` `文本/` `源码/card.lua` | `_小丑总表.csv` |
| 6 | cards | `balatro_cards.py` | 同上 + `common_events.lua` | `_塔罗总表` `_幽灵总表` `_优惠券总表` |
| 7 | meta | `balatro_meta.py` | 同上 + `back.lua` `tag.lua` `blind.lua` | `_牌组总表` `_标签总表` `_盲注总表` |
| 8 | packs | `balatro_packs.py` | 同上 | `_补充包总表` `_强化牌总表` |
| 9 | mods | `balatro_mods.py` | 同上 | `_版本总表` `_蜡封总表` |
| 10 | index | `balatro_index.py` | 11 张总表 | `配置/总表索引.md` + `_总表索引.csv` |

`--jadx` 会在最后追加一步，把 `安卓壳/classes.dex` 反编译到 `安卓壳/jadx/`。

### 每步在干什么

- **unpack** — `zipfile` 直读，按用途分流到中文目录。`assets/dexopt/` 是 ART profile，跳过
- **config** — `game.lua` 的 `init_item_prototypes()` 是一整段纯字面量，切出来喂 lupa 求值。
  沙箱要先补 `localize` 与 `HEX` 两个桩，牌型表 `hands` 埋在另一个函数体中间、得按花括号配平单独取
- **text** — 15 个语言包都是 `return {…}` 的纯表，把 `return` 换成赋值即可 execute
- **sprites** — 按 `pos` 从图集切格子。挑哪张图集照 `card.lua:165` 的原式，
  `Planet`/`Spectral` 两个图集名被别名到 `Tarot`
- **jokers / cards / meta / packs / mods** — 五个脚本产出 11 张总表，见下
- **index** — 行数列数全部从 CSV 实读，不写死，所以改了任何一张总表重跑就能刷新

---

## 十一张总表

共 **341 条**内容条目，都在 `配置/配置CSV/_*总表.csv`。
每张一行一个条目，**描述列的占位符已填成实际数值**、富文本标记已剥。

| 总表 | 条目 | 配置驱动 |
|---|--:|---|
| `_小丑总表.csv` | 150 | 13% |
| `_塔罗总表.csv` | 22 | 77% |
| `_幽灵总表.csv` | 18 | 22% |
| `_优惠券总表.csv` | 32 | 0/32 |
| `_牌组总表.csv` | 16 | 100% |
| `_标签总表.csv` | 24 | `config.type` 全驱动 |
| `_盲注总表.csv` | 30 | 20% |
| `_补充包总表.csv` | 32 | 100% |
| `_强化牌总表.csv` | 8 | 63% |
| `_版本总表.csv` | 5 | 3/5（含一个死字段） |
| `_蜡封总表.csv` | 4 | 0/4，连 config 都没有 |

「配置驱动」指这一类里有多少条目的效果是**纯靠 config 字段**跑通的、
代码里不出现它的名字。比例从 100%（牌组、补充包）一路到 0（蜡封），
是这套拆解里最有用的一条横向结论：**越是「同一种效果换参数」的内容配置化程度越高**，
改数值时前者动 CSV 就够，后者必须动 Lua。详见报告的「横向」一节。

> 用表前注意：成长型条目（小丑里有 43 张）描述里填的是**初始值**，
> 实际强度要按「触发次数 × 增量」估。

---

## 目录

| 目录 | 内容 |
|---|---|
| [源码/](源码/) | 37 个明文 `.lua` 1.9MB。大头 `game.lua`(261KB 原型表+状态机)、`card.lua`(251KB 全部结算逻辑)、`functions/UI_definitions.lua`(366KB) |
| [本地化/](本地化/) | 15 种语言的原始语言包 |
| [文本/](文本/) | 15 份转出的 JSON + `_中英对照.csv`（380 条名称/描述/解锁条件并排） |
| [配置/](配置/) | `配置JSON/` 30 张（18 原型表 + 11 总表 + 挑战）、`配置CSV/` 32 张（18 原型表 + 11 总表 + 2 挑战 + 1 索引） |
| [图片资源/](图片资源/) | 359 张一物一图 PNG（2x），按 set 分组，附 `_索引.csv` |
| [资源/](资源/) | 244 个原件：图集 1x/2x、OGG 音频、18 个 GLSL 着色器、7 个字体 |
| [安卓壳/](安卓壳/) | `classes.dex` / `AndroidManifest.xml` / `resources.arsc`；`jadx/` 下 1839 个 Java 文件 |
| [原生库/](原生库/) | 7 个 `.so`，**只有 arm64-v8a** |
| [报告/](报告/) | `Balatro肉鸽设计分析.html` —— 自包含单文件报告（两张图已内联），由 `balatro_report.py` 从分析 md 打包 |
| [图表/](图表/) | 分析用图 2 张：`成长曲线对照.svg`、`倍增关系图.svg`（都自带亮/暗两套配色，可直接嵌进 Markdown） |
| 配置CSV 里另外两张 | `_小丑流派表.csv`(150 行，16 个流派标签) 与 `_小丑倍增关系.csv`(420 条关系)，由 `balatro_synergy.py` 产出，**不在 11 张总表之内** |
| [工具/](工具/) | 15 个脚本，全部无参可跑，默认路径从脚本上一级拼。`balatro_curve.py`、`balatro_synergy.py`、`balatro_synergy_graph.py`、`balatro_report.py` 四个是分析脚本，不在 `balatro_all.py` 的 10 步链路里，要单独跑（graph 依赖 synergy 的产物，report 依赖两张图） |

共 114MB（含 jadx 输出）。

---

## 几条容易踩的

- **`安卓壳/jadx/` 里全是第三方 SDK**（Firebase / Play Services / Playstack / 广告），
  与玩法数值无关，别在里面找配置
- `main.lua` 第 1 行在 arm 上 `jit.off()`，移动端不开 JIT
- `assets/version.jkr` 是游戏版本、`assets/info.txt` 是 Playstack 壳的构建信息，
  **两个版本号不是一回事**，目录名用的是前者
- `assets/AVConfig.json`(176KB) 是广告 SDK 配置，不是游戏数值
- CSV 一律 UTF-8 BOM（Excel 直开）；脚本自带 stdout 编码修正（Windows 控制台默认 GBK）
- 从 Lua 表转出来的东西要落盘，**列序/键序必须显式定死** ——
  Lua 哈希部分的迭代顺序每次可能不同，不定死就会产出假差异
