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
- [仓库三层结构的约定更新](issues/08-仓库三层结构的约定更新.md) —— `README.md` / `AGENTS.md` /
  `参考/README.md` 已加 `复刻/` 层，新写 `复刻/README.md`。
  两条新约定入册：**复刻不得对外部署**、**研究查 CSV 复刻读源码**。
- [坐标驱动排序的解耦](issues/10-坐标驱动排序的解耦.md) —— **原样直译，TS 侧也维护 `T.x`**。
  本票原先的担忧不成立：`T` 是目标变换、`VT` 才是动画插值的，逻辑从不读 `VT`；
  没被拖的牌 `T.x` 每帧由下标重算，排序只是拖拽提交进数组的方式。
  **硬约束：`T` 全程用 tile 单位，像素换算只允许出现在渲染/输入边界。**
- [外观基准是移动版还是桌面版](issues/12-外观基准是移动版还是桌面版.md) ——
  **机制与数值对齐本产物（移动版），纯观感的四个常数取桌面值**（CRT 70、文字 ×1 等），
  集中配置、逐条留痕。卡牌悬停倾斜在本产物里是死代码（`touch_collide_tilt` 在 `Card` 上
  从不设置，**与 `F_MOBILE` 无关**），但照桌面观感实现——它是 Balatro 最具辨识度的动作。
- [事件队列调度语义的复刻口径](issues/09-事件队列调度语义的复刻口径.md) ——
  **对 RNG 而言 `delay` 不影响顺序**，复刻件可把动画 delay 压成 0，
  只需保持 `base` 队列的 FIFO 与 blocking 语义。全仓 270 个 `add_event` 块里
  11 个消费 RNG，6 个有 delay/blockable 风险，但**第一个切片零命中**。
- [CRT 全屏链路验证](issues/14-CRT全屏链路验证.md) —— **链路跑通**，
  `setForceComposite` + `captureFrame` + 全屏 `Shader` 采样具名纹理即可。
  CRT.fs 移植成功，**开销约 +0.5ms**。剥掉 `bloom_fac` 与 `glitch_intensity` 两段死码
  （原作硬编码为 0），有效代码从 153 行降到约 60 行。

- [第二个里程碑的切片边界](issues/15-第二个里程碑的切片边界.md) ——
  **纵切到「带小丑打过 Ante 1」**：小盲注 → 商店 → 大盲注 → 商店 → Boss 盲注。
  小丑接**全部 61 张 rarity 1** + 形状需要的少量 rarity 2/3；Ante 1 的 Boss 池是 8 个，
  八个 debuff 全要实现（它们是管线第 2/5/8 步的唯一内容）。
  同时裁定 `calculate_joker` 的翻译形状：**context 分支照抄、分支内按名字查表**，
  但 main 分支前四条（含三条泛化判定）必须按原序写死在查表之前。

> **第一个里程碑已交付**（红牌组打小盲注，可玩，带动画/shader/音效）。
> 第二个里程碑在做：**小丑进结算管线已落地**（172 个测试绿，其中 66 条小丑用例），
> 经济层 / 商店 / Boss 盲注还没有。

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

- **产物是移动版构建**（`PROD_mobile`，`Singular-v12.11.0`，2026-01-26）。
  全仓 `F_MOBILE` 分支已枚举，与玩法有关的只有四条纯观感常数：
  CRT 30/70（`globals.lua:231`）、FPS 60/200（`main.lua:85`）、
  卡面文字 ×1.45/×1（`card.lua:767`）、描述文字 ×1.45/×1（`misc_functions.lua:1747`）。
  **复刻件取桌面值，集中配置、逐条留痕**，见
  [外观基准](issues/12-外观基准是移动版还是桌面版.md)。
- **卡牌悬停倾斜在本产物里是死代码**，且**与 `F_MOBILE` 无关**：
  `Card` 设了 `hover_tilt = 1`，但 shader 条件还要 `touch_collide_tilt`，
  而那个标志全仓只在盲注与标签上设置。复刻件仍要实现它（Balatro 最具辨识度的动作），
  这是全图唯一一处有意偏离产物的地方。
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
- **「delay 可以压成 0」这条结论不能带过第一个里程碑。** 消耗品与补充包路径上有 5 处
  带 delay / `blockable=false` 的 RNG 消费，第二个里程碑就会进范围，那时虚拟时钟必须如实复刻。
  **在 `Round` 内部它仍然成立**——那 5 处都不在一局盲注里面，等接商店时再核。
- **`ease_dollars` 在原作里是入队延迟的，本复刻是同步立即的。** 后果：
  `G.GAME.dollar_buffer` 这个字段在复刻件里**必须恒为 0**。它在原作里的唯一用途是
  让同一次结算里后面的小丑（只有 `Bull`）看到「在路上的钱」；同步加钱之下
  `dollars` 本身已经最新，再往 buffer 里加就是把同一笔算两遍。
- **小丑区遍历的顺序会改分数。** `[Joker, Cavendish]` 是 `(2+4)×3 = 18`，
  `[Cavendish, Joker]` 是 `2×3+4 = 10`。所以小丑区的数组顺序是逻辑状态，不是展示顺序。
- **打出去的牌在结算时已经不在手牌区了。** 原作 `play_cards_from_highlighted` 先把牌
  移到 `G.play`，再跑 `evaluate_play`，所以管线第 10 步（手牌区遍历）看不到它们。
  `Raised Fist` / `Baron` / `Shoot the Moon` 全吃这个差别——`Round.play()` 里
  `moveOut` 必须在 `evaluatePlay` **之前**。
- **`calculate_joker` 里有 6 张小丑在结算中途消费 RNG**
  （Misprint / Business Card / Reserved Parking / Space Joker / 8 Ball / Bloodstone）。
  掷点的**位置**有语义：Business Card 是「先判人头牌、再掷」，所以非人头牌不消耗 RNG；
  Reserved Parking 反过来是「先掷、再判 debuff」。搞反了整条 seed 链就分叉。
- **小丑的 `base.nominal` 是 0。** `set_base(P_CARDS.empty)` 匹配不到任何点数，
  所以 `get_chip_bonus` 对小丑返回 0、`ret.chips` 不会被写。重复触发那一问
  （拿小丑问 `cardarea = G.play`）靠这条才成为空转，不是靠调用方少传字段。
- **`T` 是目标变换，`VT` 是动画插值的那个。逻辑只读 `T`，绝不读 `VT`。**
  全仓九处按 `T.x` 排序（`align_cards` 六处 + `state_events` 三处），
  外加 `cardarea.lua:534` 的 pinned 特例（`-100*sort_id` 强制排前），直译时别简化掉。
- **`T.x` / `T.y` 的单位是 tile 不是像素**（`TILESIZE=20`、`CARD_W≈2.05` tile）。
  `align_cards` 里那堆手调常数全是 tile 尺度的，用像素维护 `T` 会让它们一个都不能用。
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
