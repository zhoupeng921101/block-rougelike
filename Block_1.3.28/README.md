# Block v1.3.28 拆包工作区

`block.apk`（153MB）的完整拆包产物。**Cocos Creator 2.x（cocos2d-jsb）** 的小游戏合集，
`org.cocos2dx.javascript`，`G_Cfg.baseVersion = "1.3.28"`、
`publishPlatform = "block_android_online"`。产物 214MB。

资源走 **HEK 加密**（xxtea/XOR + gzip/brotli），已破，`common/cocos.py` + `block_unpack.py`
一步还原。结构就是 APK 里 `assets/` 的原样还原。

---

## 两个入口

| 想做什么 | 看哪份 |
|---|---|
| 查数值结论（发牌算法、决策链、权重、章节 A/B、Trait 包） | [数值设计报告.md](数值设计报告.md) |
| 和 Balatro / Brotato 的机制对比 | [../横向对比.md](../横向对比.md)（Block 只进 §0、§4、§5、§8、§9、§10） |
| 改 `block_*.py`，排查 HEK/骨架/ETC1 | **工具链与技术细节文档都没带进本仓库**，见下方「快速开始」；另两款的技术细节在 [../工具文档/](../工具文档/) |

---

## 快速开始

> **脚本不在本仓库。** 这些 `block_*.py` 原先放在同一个大工作区的 `GossipHarbor_3.97.0/工具/` 下，
> 本仓库只挑了 Block 的产物带过来，没带工具链。下面的命令保留下来说明产物是怎么来的，**直接跑不了**；
> 要重跑得先把那批脚本找回来。

**没有一键脚本**，五条链路各自独立：

```bash
python block_unpack.py   <apk> Block_1.3.28 [--dry]   # HEK 解密拆包，--dry 只统计
python block_config.py   Block_1.3.28 配置             # cc.JsonAsset / cc.TextAsset
python block_jsconfig.py Block_1.3.28 配置             # bundle JS 里的内联数值表
python block_enums.py    Block_1.3.28 配置             # TS 枚举与枚举映射表
python block_anim.py     Block_1.3.28 [动画目录]        # 骨架动画与特效
python block_render.py   --all 动画 [--force]          # 预览，约 100 秒
python block_player.py   [动画目录] [--serve]           # 浏览器里真播
```

> **预览渲完再跑一次 `block_anim.py`**，画廊里就带缩略图（静态图，不会动）。

---

## 产物目录

| 目录 | 内容 |
|---|---|
| [数值设计报告.md](数值设计报告.md) | **先读这个**。508 种发牌算法名册、三层发牌决策链、发牌权重 17 档、兴趣曲线低谷触发、章节三套 A/B、皮肤 8 种解锁口径、290 个 Trait 包与单向门、13 个小游戏矩阵 |
| [assets/](assets/) | **312 个 Addressables 式 bundle**。`config.*.json` 是清单（paths/uuids/deps/isZip/encrypted），`import/<xx>/<uuid>.json` 是资产数据，`native/<xx>/<uuid>.png\|bin` 是贴图与二进制。绝大多数 bundle 名是 `*Trait` 形式的 A/B 开关包 |
| [src/](src/) | `cocos2d-jsb.js`(1.6MB) 引擎、`settings.js`(164KB) 构建设置、`G_Cfg.js`（登录 URL / 渠道 / 版本）、`libs/`、`modules/atomengine4/` |
| [配置/](配置/) | 数值表抽取结果，共 852 张表，见下 |
| [动画/](动画/) | 215 套骨架、1094 个动画、72 个特效资产 |
| [_索引.csv](_索引.csv) | 8266 行：路径 / 来源（hek 或 jsc 或 明文）/ 密文字节 / 明文字节 |

### `配置/` 的五条子链路

| 子目录 | 内容 |
|---|---|
| `配置JSON/` + `配置CSV/` | 345 张 `cc.JsonAsset`，其中 205 张扁平表转了 CSV。没出 CSV 的 140 张是嵌套结构（104 张章节棋盘、11 张纯数组） |
| `文本/` | 22 个 `cc.TextAsset`（字体授权、`.atlas`、README 之类，没有数值） |
| `JS数值表/` + `JS数值表CSV/` | **507 张写死在 bundle JS 里的表**，249 张同时出了 CSV |
| `枚举/` + `枚举CSV/` + `枚举映射/` | 385 个 TS 枚举。核心是 `main/OFFER_TYPE`（**508 个发牌算法**） |
| `_算法总表.csv` | id / 常量名 / 显示名 / 真实名 四列汇总，**做算法归因就查这张** |

几张核心表：`main/RatioConfig.ratioConfig`(527 行 score/id/weight/color)、
`main/NewRatioV1Config`(714 行)、`NewUserBoardDiffTrait/…BOARD_WEIGHTS`(2000)、
`class/UCBInitBoardConfig.UCBInitBoardList`(803)、
`main/TraitServerOneWayDoorConfig.oneWayDoor*`（单向门开关名单）。

`枚举映射/main/OFFER_TYPE_STRINGS.csv` 与 `OFFER_TYPE_REAL_STRINGS.csv` 各 507 条中文名，
**43 条两者不一致** —— 上报口径把具体算法收敛成了笼统大类。

### `动画/`

- `骨架/<bundle>/<资产目录>/` 是可直接拖进编辑器的三件套。
  DragonBones 是 `<名>_ske.json` + `<名>_tex.json` + 图集页；
  Spine 是 `<名>.json`（或 `.skel`）+ `.atlas` + 图集页
- `_索引.csv`(215) / `_动画清单.csv`(1094) / `_特效索引.csv`（25 `cc.EffectAsset` +
  31 `cc.Material` + 16 `cc.AnimationClip`）/ `_引用.csv`（232 条 prefab→骨架，
  185/215 能对上 prefab，其余 30 套是代码动态加载）
- `_预览/` 214 张核对图（166 setup pose + 48 动画帧）+ `_预览总览.png` 接触表
- `动画播放器.html` / `启动播放器.bat` / `_runtime/`：深链 `#<bundle>/<资产路径>`
  直接开某一套，`?selftest` 依次开完全部并报加载成败

---

## 几条容易踩的

- **看动画双击 `动画/启动播放器.bat`**。`动画画廊.html` 不会动，
  `动画播放器.html` 才是真播；直接双击 html 没用，`file://` 下会拦掉骨架文件读取
- **根层一批广告 SDK 素材不是游戏内容**（`PA_*.html`、`*mraid.js`、`aps_*`、
  `nedata.db`、`dic` 等），在 `_索引.csv` 里标为「明文」。
  `assets/` 里的 `audience_network/` `ad-viewer/` `lotties/` 同理，`block_unpack.py` 已跳过
- **`block.base.bundle` 是 Hermes 字节码**（`c6 1f bc 03`），属于包里那套 React Native
  （`libreactnative.so` / `libhermes.so`），与 Cocos 主体无关
- `lib/` 只有 `armeabi-v7a`，没有 arm64
- `动画/_错误.txt` 1 条：`class/dragonbones/combo/comb_ske` 的 import 文件根本不在包里
  （只有清单登记），走热更
- 棋盘配置里的道具串形如 `pb#c#oc#adv_witch_tar_9`，`pb#`/`c#`/`oc#` 是前缀标记，
  解析时要剥前缀
- **服务端可动态覆盖本地值**，所有本地数值都只是客户端默认值，结论里要带这个前提
