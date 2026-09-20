# Balatro 1.0.1o web 复刻

Label: wayfinder:map

## Destination

一个跑在 localhost 的 Balatro 1.0.1o web 复刻件，基于 Phaser 3 + Vite + TS
（模版 https://github.com/phaserjs/template-vite-ts），**四条轴全部对齐**：
机制与数值一致、同 seed 同局（可对拍）、像素级外观、音效与音乐。

地图走完 = 这个复刻件可玩，且四条轴各有验收手段。

## Notes

- **领域**：游戏复刻。源引擎 LÖVE 2D / Lua 5.1，目标 Phaser 3 + Vite + TS。
- **执行带进地图**（覆盖 wayfinder 的 plan-don't-do 默认）：destination 是一个可玩的交付物，
  不是一份规格。决策票仍先行，但 task 票会真的动手写代码。
- **每个 session 必读**：grilling、domain-modeling。
- **版本口径固定为 Balatro 1.0.1o**，不把结论推广到其他版本。
- **只跑 localhost，不部署、不分发**。这是原素材可用的前提，反转它整张图要重画。
- **证据源**（均在本仓库内）：
  - 源码 `参考/产物/Balatro_1.0.1o/源码/` —— 34 个 Lua 文件，35,876 行，全量游戏逻辑
  - 配置 `参考/产物/Balatro_1.0.1o/配置/配置CSV/`、`配置JSON/`
  - 素材 `参考/产物/Balatro_1.0.1o/图片资源/`、`资源/`、`本地化/`
  - 分析 `参考/结论/Balatro_1.0.1o/` 5 篇，尤其 `出牌结算管线.md`
- **仓库落位**：新开顶层 `复刻/`，与 `参考/`（研究）、`新游戏/`（原创）平级。

## Decisions so far

<!-- 一行一张已关闭的票：够判断相关性，细节点链接进票里看 -->

- **1:1 的轴与工程落位**（charting 时裁定）—— 四条轴全要；工程落在仓库新顶层 `复刻/`；只跑 localhost
- [Lua 到 TS 的翻译策略](issues/03-Lua到TS的翻译策略.md) —— **直译，含事件队列**。
  实测发现队列回调里调用 `pseudoseed`，RNG 消费顺序由队列执行顺序决定，
  队列因此属于逻辑层而非表现层；只有渲染与输入按 TS 惯例重写。
- [LuaJIT RNG 复刻口径](issues/02-LuaJIT-RNG-复刻口径.md) —— **可行，16/16 外部真值对拍通过**。
  发生器是 LuaJIT TW223（LÖVE 未覆盖 `math.random`），四个状态常量已在本仓库的
  `liblove.so` 里核实命中。`%.13f` 要用 BigInt 精确展开，不能用 `toFixed` 或
  `round(x*1e13)/1e13`。留下 16 条测试向量作为 CI 资产。
- [shader 能否移植到 Phaser](issues/05-shader能否移植到Phaser.md) —— **Balatro 一侧可行**
  （19 个 `.fs`，90% 机械替换，3D 倾斜是 vertex 阶段改 `w` 分量）；
  **Phaser 一侧的结论作废**：证据基于 Phaser 3，而模版已 pin v4.0.0。另查明
  **本产物是移动版构建**（`PROD_mobile`），CRT 30 而非桌面的 70、卡牌不倾斜。
- [Phaser 版本选型与渲染 API 复核](issues/11-Phaser版本选型与渲染API复核.md) —— **pin `phaser@4.2.1`**。
  v4 确已移除 Pipeline 体系；per-instance uniform 经源码验证**成立**，
  但走 `Shader` GameObject 而非 Filter——**卡牌要建模成 `Shader` 而不是 `Sprite`**。
  仍是 WebGL 1。CRT 走 `CaptureFrame` + 全屏 Shader。
- [工程骨架落地](issues/01-工程骨架落地.md) —— 工程在 `复刻/Balatro/`，dev/test/build 全通。
  **npm（非 pnpm）/ 端口 8080 / Phaser 4.2.1**。RNG 核心已落地，
  **24 个测试全绿，其中 16 条是外部真值**。
- [第一个可玩里程碑的切片边界](issues/07-第一个可玩里程碑的切片边界.md) ——
  **纵切到「用红牌组打过 Ante 1 的小盲注」**（300 分 / 8 张手牌 / 4 出牌 / 3 弃牌）。
  无小丑、无商店、无强化。连带把 [原版对拍基准](issues/04-原版对拍基准能否导出.md)
  拉回关键路径：本切片的 RNG 消费点是洗牌，现有 16 条向量覆盖不到。
- [原版对拍基准能否导出](issues/04-原版对拍基准能否导出.md) —— **社区工具拿不到洗牌真值**
  （它们全是 seed-search 模型，不建模洗牌）。裁定走**结构性验证**：
  独立重推一遍 Fisher–Yates 逐位比对，不动实机。`pseudoshuffle` 已落地，全仓 32 个测试绿。
- [Phaser 4 渲染路线 spike](issues/13-Phaser4渲染路线spike.md) —— **路线成立**，真机实测。
  per-instance uniform 确认独立（40 个各异的 uniform，有截图）；`dissolve.fs` 移植成功。
  **性能不是风险**：40 张牌 p50 仅 0.2ms，且全屏背景几乎免费——上一张票
  「风险在 fill-rate」的判断被推翻，开销其实线性于对象数。工作量维持 9–16 人日但不确定性大降。
- [素材与配置的接入方式](issues/06-素材与配置的接入方式.md) ——
  **素材拷进 `public/assets/` 并入库**（只拷用得上的，第一个切片 288K；字体只带拉丁）；
  **配置从 Lua 直译，不碰 `配置CSV/`**（那是派生的研究产物，且只覆盖 13% 的小丑行为）。
  图集元数据纯可推导，不手写 atlas JSON。

## Not yet specified

- **局内手感的还原口径**。卡牌物理、缓动曲线、抽牌/计分的节奏与停顿——
  Balatro 的「爽」有很大一块在这里，但说不清要还原到什么粒度，
  得等 [shader 能否移植到 Phaser](issues/05-shader能否移植到Phaser.md) 有结论才看得清。
- **存档格式**。要不要与原版存档互通，还是自己一套。取决于翻译策略。
- **本地化接入**。`本地化/` 有全量文本，但多语言要不要进第一版没定。
- **性能预算**。Balatro 的 shader 在浏览器上的开销未知，可能反向约束外观轴。
- **验收的自动化程度**。RNG 层已有 16 条向量可进 CI（见 [工程骨架落地](issues/01-工程骨架落地.md)），
  但**整局**的对拍怎么自动化仍不清楚，等对拍基准那张票落地再说。
- **弱类型的边界**。直译会带进大量 `any`（`self.ability` 在 `calculate_joker` 里被引用 379 次）。
  哪些地方值得补类型、哪些认了，等第一段直译落地后才看得出来。
- **重复触发的实现形态**。蓝图 / 头脑风暴 / 双子座这类「代跑另一张小丑」的效果
  在直译下是递归调用 `calculate_joker`，深度与终止条件要单独核，但现在说不清要核什么。

## 已知的坑

<!-- 不是待决策，是后面每个 session 都该记着的事实 -->

- **产物是移动版构建**。`源码/version.jkr` 为 `PROD_mobile`，`info.txt` 为
  `Singular-v12.11.0`（2026-01-26 构建）。已知差异：CRT 强度 30（桌面 70，`globals.lua:231`）、
  卡牌 3D 倾斜恒关（`touch_collide_tilt` 在 `Card` 上从不设置，但盲注与标签会倾斜）。
  基准口径见 [外观基准是移动版还是桌面版](issues/12-外观基准是移动版还是桌面版.md)。
- **`参考/产物/Balatro_1.0.1o/` 的目录名没有记录「移动版」这件事**，
  而 `AGENTS.md` 写着「版本以目录名为准」。这是**参考层**的问题，本图不处理，
  但 5 篇 Balatro 结论文档都建立在这份产物上，值得单独提给用户。
- **别抄 Immolate 系的 `round(x*1e13)/1e13`** 做 `%.13f`，实测 0.042% 偏差。
- **FMA 收缩**是 RNG 的残留风险。若整条链对不上，第一个试 FMA 版。
- **Phaser 4 的 Filter 体系没有自定义 shader 入口**。24 个 filter 全是内置的，
  19 个 Balatro shader 一个都进不去，全部走 `Shader` GameObject。
- **`#pragma phaserTemplate` 不是给用户着色器分节用的**。`vertexSource` 整体替换模板，
  自定义着色器要写完整程序，遵守 `uProjectionMatrix` / `inPosition` / `inTexCoord` / `outTexCoord` 契约，
  并 `setUniform('uMainSampler', 0)` 绑纹理单元。
- **`Shader` GameObject 不会自动应用 spritesheet 的帧**，`outTexCoord` 默认跨整张纹理。
  必须显式调 `setTextureCoordinatesFromFrame(frame, texture)`，否则整张图集会被画进每个 quad。
- **复刻件的配置源头是 `源码/` 里的 Lua，不是 `配置CSV/`**。后者是派生的研究产物，
  且装不下行为（`_小丑总表.csv` 配置驱动仅 19/150）。
- **Phaser 4 的 `outTexCoord.y` 方向与 LÖVE 相反**。影响 `dissolve_mask` 的 borders
  上下不对称逻辑——翻 uv 或翻 borders，二选一。
- **性能数据来自 RTX 3060**，只说明桌面端够用，不能外推到移动端。
- **`Shader` GameObject 的 `setAlpha` 是 NOOP**，alpha 必须走 shader uniform；
  它也不带 Animation / Tint / Input 组件，交互要自己挂 hit area。
- **用 npm，不要用 pnpm**。pnpm 装 `esbuild` 时稳定复现 `ERR_PNPM_EPERM`。
- **模版的 `log.js` 已删**。它每次 dev/build 都会向 `gryzor.co` 上报项目名与 Phaser 版本。
- **改 `src/core/rng/` 之前先跑 `npm test`**。那 24 个测试是后面每一步直译的底座。
- **「结算管线做全但不要小丑」是自相矛盾的**。15 步里第 6、11、15 步全是小丑遍历，
  管线的难度恰恰在小丑，零小丑时这三步空跑、测不到。
- **洗牌顺序没有外部真值**，只做了结构性验证。别把它当对拍结果引用。
  实机挂钩子那条路没废，只是没走——真要走的话它能一次性服务所有里程碑。
- **UI 占全仓 28%**（`UI_definitions.lua` 6,607 行 + `button_callbacks.lua` 3,314 行），
  而按直译裁定这部分是**重写**不是直译。估工作量时别把它算进那 35,876 行里。

## Out of scope

<!-- 越过 destination 的工作；关闭后不再回到 frontier -->

- **Brotato 与 Block 的 web 复刻件**。本图只到 Balatro。三个复刻件是长期目的，
  但 Brotato 是连续存活制、Block 是服务端驱动，技术形状与 Balatro 差太远，
  共用一张图会让 frontier 失焦。Balatro 这张图走完后另起新图。
- **Block 的「完整」1:1**。定义上不成立：真实发牌是「端上 TFLite → 服务端推理 → 兜底权重」
  三层，包内只有兜底层（见 `AGENTS.md`）。任何 Block 复刻最多只能复刻兜底层。
- **公开部署与分发**。已裁定只跑 localhost。机制与数值不受版权保护，
  但美术、音频、文案受保护，而本仓库用的正是原素材——一旦对外可访问即构成侵权。
