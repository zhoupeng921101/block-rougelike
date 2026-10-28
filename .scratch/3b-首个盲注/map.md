# 3B 首个可玩盲注

Label: wayfinder:map

## Destination

`Demo/` 出的 Windows 包里，从主界面进战斗，用默认方块库**打完一个盲注**（达标即胜，预算抽完或放不下即败），
中途退出重进能接着打。规则按 [3B核心规则.md](../../新游戏/设计/3B核心规则.md) §2.1–§2.4、§3，
对应 [工程计划.md](../../新游戏/工程计划.md) 阶段 3（规则核心）+ 阶段 4（战斗表现）的验收。

地图走完 = 两条验收都过：dotnet 单测全绿、同一种子跑同一局两次逐项一致；Windows 包里能打完一个盲注、能续玩。

## Notes

- **领域**：Unity 6000.3.19f1 + TEngine 的 C# 工程。规则核心是不依赖 UnityEngine 的纯 C# 程序集，表现层订阅它的事件（工程计划已裁）。
- **执行带进地图**（覆盖 wayfinder 的 plan-don't-do 默认，2026-10-27 用户选定）：决策票先行，task 票真写代码。
  代码落地走 `Demo/` 的 devflow **主工程通道**（`Demo/CLAUDE.md`「devflow 适用面」：主工作树实现、客户端自检 PASS 后 `单仓提交.ps1`，不推送；一次只跑一个任务）。
  产品代码默认本该走槽位 `/devflow`，主工程通道要用户明确指定——用户定目的地时选的选项写明了「走 devflow 主工程通道」，据此启用；要改回槽位流程，改这一条即可。
  asmdef、`ProjectSettings/` 单独改动走人工入库通道。前提见 [阶段 2 的落地状态](issues/01-阶段2的落地状态.md)。
- **自行裁决**：grilling 票按用户授权由 agent 自裁，把「据此裁定」与依据写进 Answer，便于事后推翻；
  只有改变目的地或产品形状的取舍才回去问。追问方法见 `.agents/skills/grilling/SKILL.md`。
- **规则以 3B核心规则.md 为准**。票里裁出的规则空白要回写进规则文档（新游戏/README：规则改动直接改主文档），不只留在票里。
- **数值一律占位**：集中一处、标明占位。定标是阶段 6，不在本图。
- **block-client** = `E:\TEngine_block\UnityProject`（main@4cb5dc49f），同团队自有代码，可以移植。
  盘面核心在 `Assets/GameScripts/HotFix/GameLogic/Module/BlockBlast/Core/`，手势与盘面表现在 `UI/GameUI/`。
  `复刻/` 下的代码不搬（AGENTS.md「做复刻时」）。
- **证据源**：Balatro 1.0.1o 的计分口径见 [出牌结算管线.md](../../参考/结论/Balatro_1.0.1o/出牌结算管线.md)；
  `复刻/Balatro/` 可以验证「原作怎么算」，代码不搬。
- **不动 git 暂存区里别人的东西**（开图时阶段 2 的 208 个文件就是这样卡住的，已由 01 号票落地）。提交本图的文件用 `git commit -- <路径>` 只提交自己的路径。
- **谁派执行票**（2026-10-27 用户裁定，同日改过一次）：task 票由最初的调度会话派，开工前先认领，防止同一张票两个会话同时写（16 号票撞过一次）。
  16、19 是「单机玩法新项目计划 (fork)」那一路做的；那个会话已不在，之后不再从那边派。
  主工程通道一次只跑一个任务（`Demo/CLAUDE.md`），所以写主工作树的执行票一张一张派。

## Decisions so far

<!-- 一行一张已关闭的票：够判断相关性，细节点链接进票里看 -->

- **目的地**（charting 时裁定）—— 阶段 3 + 4 一起做到「Windows 包里打完一个盲注、能续玩」；执行带进地图；数值占位，定标与内容清单不在本图。
- [block-client 盘面与手势的可移植面](issues/02-block-client盘面与手势的可移植面.md) —— **纯核心原样拷**（`Core/` 五个文件 + `PortableRng.cs`，C# 9 零依赖），
  `BlockShapeMap` 裁到七种骨牌的 19 个朝向、id 不变；只缺一个「死格挡格」的落子判定入口。
  **玩法层一个文件都不拷**，只借四个做法（平行格层单口清格、按原始朝向给格编号、一步推进结果、卡死判定）。
  表现层拷 3 个、裁 5 个，`BoardGestureFlow` 只有约 310 行相关，按段摘抄重写。
  DragonBones、序列帧、Spine 特效是竞品素材，**一律不搬**。
- [中英文本表在本工程里的载体](issues/04-本地化文本表的载体.md) —— **Demo 里什么都没有**：TEngine 6.0.0 无本地化模块，
  block-client 是硬编码中文常量，Luban 的 `text` 只校验 key、不管运行时查表与切语言，TMP 字体一个汉字都没有。
  推荐自建 `[{key, zh, en}]` JSON（即 Luban 文本表格式，阶段 5 直接登记成 `TbText`）+ GameLogic 查表；字体补思源黑体 SC。
- [纯 C# 规则核心怎么同时进 Unity 和 dotnet test](issues/03-规则核心的双端编译与单测.md) —— **推荐：源码正本在 `Assets/` 下的独立 asmdef（`noEngineReferences`），
  `Demo/DotNet/` 放一个只做通配链接的镜像库，锁 `netstandard2.1` + C# 9**（Unity 6000.3 的实际编译口径），测试与跑局工程都引它。
  实测 9 种 Unity 编不过的写法镜像库全拦；照 block-client 先例直接链进 net8.0 只拦 1 种。
  `Demo/.gitignore` 必须改三行，否则测试工程入不了库。CoreCLR 字符串哈希每个进程不同，「逐项一致」要有一项跨进程比对。
- [首个可玩盲注的切片边界](issues/05-首个可玩盲注的切片边界.md) —— **一局只有一个普通盲注**：主界面「开始 / 继续 / 语言」→ 占位盲注 → 结果浮层 → 回主界面，不做 §8.6 结算页。
  §2.1–§2.4 盲注内规则与 §3 计分做全（11 种类型全做、连击只记数、拖动预览只显示类型本级的底注与倍率）；
  强化、版本、死格、基因段、科技等级只留钩子，用单测里的测试替身验。补了规则 §2.2、§2.4、§8.5 三处空白。
- [文本 key 表的接法](issues/14-文本key表的接法.md) —— **自建 `[{key, zh, en}]` JSON**（`AssetRaw/Configs/l10n/texts.json`，即 Luban 文本表格式），
  GameLogic 里放 `TextTable` 查表、`LocalizedText` 绑定组件；key 按 `ui.<界面>.<元素>` / `<概念>.<值>.<属性>` 分域，整句带 `{n}` 占位。
  规则核心只吐枚举和数，映射放在一个不依赖引擎的 `TextKeys.cs` 里，由 dotnet 测试链接核对；语言存 PlayerPrefs，只在主界面热切。
  文字一律 TMP，主字体用思源黑体 SC Bold 做动态 SDF 资产，各组件直接引用、不改 TMP 默认字体；像素中文字体留给美术定。
- [种子与随机流的口径](issues/08-种子与随机流.md) —— **原样用 `XorShift128PlusRng`，一个键一条流**：子流种子 = FNV-1a 64(`种子文本/键`)，第一次用到时派生；
  本图唯一的键 `shuffle@段.层`（按层分，跳过节点不改后面的洗牌）。规则核心只取整数 `Next`，不碰 `NextDouble`；
  洗牌先按实例 id 升序排，再从后往前做 Fisher–Yates。主种子是 8 位种子文本（32 字符表）。
  存档存种子文本加各流 `(s0, s1)`，抽牌顺序作为结果一起存，退出重进不重摇。测试向量见 [research/08](research/08-随机流向量.md)。
- [阶段 2 的落地状态](issues/01-阶段2的落地状态.md) —— **已落地 c49c2609**（用户裁定）：暂存的 208 个全是阶段 2 移植件，原会话「单机玩法新项目计划」没做完就卡在请求超时。
  落地前主工作树客户端自检 PASS，按人工入库通道单仓提交、未推送；工程计划登记「移植入库，验收未跑」。
  本图的 task 票现在可以往 `Demo/` 提交；回归矩阵转绿与槽位验收不在本图。
- [PC 上的落子、旋转与弃置操作](issues/12-PC上的落子与旋转操作.md) —— **只做左键拖拽**：块心贴着指针（偏移 0、倍率 1.0），不做点选式拾取。
  旋转随时可转：右键、R、滚轮下、托盘上原地单击都是顺时针，滚轮上是逆时针；拖着时转手上那块，没拖时转悬停的那块。
  弃置是拖进弃置区松手，不设快捷键、不弹确认。虚影和吸附照 block-client 原样；预览和虚影一起出现，成线才显示类型，缓存键加上 rot。
  置灰的块仍能拿起去弃置。结算演出期间锁托盘，不锁 Esc。Esc 在拖拽中是取消，否则直接回主界面。`BoardGestureFlow` 重写为新类。
- [盘面与方块实例的数据模型](issues/06-盘面与方块实例的数据模型.md) —— **块实例只装永久属性**（id、可改写的种类、点数、强化、版本），不存形状 id、朝向、所在区；
  id 由局上计数器从 1 发起、计数器进存档。盘面三层：占用、格 → 实例 id（`int[64]`）、死格掩码，只经「落子 / 清一格」两个口子写，存档不存占用；
  `Core/` 一行不改，死格经「占用 | 死格」影子盘挡落子。各区挂在盲注上、只按 id 引用方块库，盲注结束丢掉盲注状态就是「洗回」；
  最后一格被消才离场；待放置区定长不挪位，rot 0..3 存在槽上，改朝向不算步；同形态比种类。补了规则 §2.1、§3.3 两句。
- [规则核心的工程形态与跑局测试](issues/10-规则核心的工程形态与跑局测试.md) —— **程序集 `GameRules`**：正本放 `Assets/GameScripts/HotFix/GameRules/`，命名空间 `GameRules`，进热更清单、排在 GameLogic 前。
  `Demo/DotNet/` 放镜像库、唯一的测试工程 `Tests/`（NUnit，包已在本机缓存里）和跑局工程 `Sim/`。客户端自检加第十四道 `dotnet单测.ps1`，restore 失败判 INFRA。
  跑局用贪心和 `sim.policy` 随机两种策略，比的是规范化轨迹的全文：每步事件，加终局的存档快照。四路比对：同进程两次（其中一次换成 `tr-TR`）、子进程一次、存读续跑。不入库基准轨迹。
- [首个盲注的占位数值](issues/11-占位数值.md) —— **28 块（七种骨牌 × 1–4 点各一块，按种类序取号）、弃 3、目标 350**；类型底注从单线 10 到清屏 60 每级 +5，倍率 ×1 / ×2 / ×3 / ×4 四档，全是整数。
  一次性模拟里一步贪心七成过、整组规划九成以上、乱放两成。数放规则核心里的一份代码常量，只有开新局、单测、`Sim` 三处引用，**不建 Luban 表**，阶段 5 再迁。
  弃置对认真玩的人几乎不起作用、类型的出现频率与优先级不一致，记下来留给定标；真代码回测另开一张票。
- [一步落子的结算管线与事件流](issues/07-结算管线与事件流.md) —— **一步同步算完，返回有序事件**：不做事件队列，不回调表现层，事件不带演出时长但自带块属性。
  **逐格按线走**：先行后列，行内左→右、列内上→下，交叉格归行；重触发以格为单位连着重走，定类型和基因段不重来。
  **分数全整数**：底分、倍率 `long`，独立倍率千分值逐项乘、向下取整，相乘时负值截 0、溢出饱和。钩子六个挂点，只返回数据，注册表是开局配置。
  预览就是管线前半段的同一个纯函数，不加试算开关；完整试走用 `Clone`。入账、清格后先判胜、再发组、再判负。回写了规则 §2.4、§3.1、§3.2；
  三区最后才乘一次，所以同区内先后不改变得分、基因换位分量比 Balatro 轻，记给阶段 5。
- [战斗界面线框](issues/13-战斗界面线框.md) —— **用户选 A「三栏·草图向」**：左栏常驻 11 种类型表（拖动时高亮命中行），盘上方累计分 / 目标分，顶部盲注信息与方块库剩余，
  右栏预留基因栏 6 槽、道具栏 3 格，托盘在盘下、弃置区在右下（离 5 槽托盘 245px）。格 80，按 1920×1080 定了各区坐标与锚点，作表现层蓝本。
  用户另定：点数只标在托盘块上；预览徽章贴手上那块上沿，接受竖向消除时压住被消列一段（放宽 12 的约束）。回写了规则 §8.5 两句。
- [局内存档的形态与时机](issues/09-局内存档的形态与时机.md) —— **全量快照，不存操作日志**：开新局与每一步被接受后同步写（`StepResult` 返回、开演之前），转动置脏、防抖 0.5 秒或失焦 / 退出时写；结局先写终局快照再删档。
  规范 JSON（ASCII、LF、成员次序固定、64 位写字符串、枚举写名字），**规则核心自写整数 JSON 子集读写器、不引 Newtonsoft**；读档严格对形状，不认就挪成 `.bad`。
  `schema` 首发前恒为 1，发包后改形状即升版本写迁移；不加校验和，读档校验与单测每步断言共用 `RunState.Validate()`。
  文件在 `persistentDataPath/save/run.json`，`.tmp` 原子替换、留 `.bak`。回写了规则 §8.1 一条：退出重进不能撤回已落下的一步。
- [消除演出的节奏](issues/21-消除演出的节奏.md) —— **先把整份事件排成时间表再播**：被消线接着预览光带一起亮，再按 07 的次序逐格跳「+点数」，每格跳完就退场；计数框就是落了位的预览徽章，入账时合成得分，飞进累计分。
  每格 0.06 秒，逐格段封顶 1 秒、超出就等比压缩：单线 0.67 秒解锁、1.47 秒演完，最大 1.25 秒解锁；一个盲注约锁 6–7 秒，Balatro 1.0.1o 约 30 秒。
  **用户选定**：托盘在最后一格退场时解锁，尾巴和下一手并行（改了 12 的锁止点）；本图不做快进和速度档，只留 `Speed` 倍率。不成线、弃置、发组都不锁。时长放表现层 `ClearPacing` 常量表，占位。
- [规则核心的工程骨架](issues/16-规则核心的工程骨架.md) —— **已落地 520ca0ec / 28934a64 / 5e4b0d75**：`GameRules` 程序集（命名空间 `GameRules`，进热更清单、排在 GameLogic 前）和第一批随机件（`RngStreams` / `SeedText` / `RngKeys` / `RngOps`）都已入库；
  `Demo/DotNet/` 下的镜像库和 NUnit 测试工程已建，research/08 向量表与源码禁用清单都已成用例。客户端自检第十四道 `dotnet单测` 冷跑 4.2 秒、热跑 1.9 秒，首次 restore 没联网。
  五种故意出错都让自检变红；Windows 包带 `GameRules.dll`，能进主界面。tengine-conventions 新开「规则核心」一节。
- [规则核心：盘面、方块实例与区](issues/19-规则核心-盘面方块实例与区.md) —— **已落地 055db9dc**：`Core/` 五个文件原样包进命名空间，`BlockShapeMap` 裁到 19 个朝向；`BoardState` 三层只有两个写口和 `SetDead`，`BoardCells` 是唯一的位序换算；`RunState` / `BlindState` 带 `Clone`、只读视图和 `Validate()`（id、盘面不变式、区守恒）。
  开盲注按 id 排序后用 `shuffle@1.1` 洗、从槽 0 发组。满列在 `FullLines()` 里已排成升序，`ClearType` 枚举序不是优先级。自检 PASS，单测 76 个（新加 36 个）。编辑器 Console 还没看：主工程编辑器没刷新。
- [规则核心：一步的推进与结算管线](issues/20-规则核心-一步的推进与结算管线.md) —— **已落地 198e7784**：`Place` / `Discard` 返回 `StepResult`（被拒不改状态），`StartBlind` 也返回事件；17 段管线、13 种事件类只有整数、枚举、布尔和有序 int 列表。
  判线定类型是只读的 `ResolveClear`，预览和真落子共用；计分全整数、千分值逐项取整、饱和；六个钩子挂点与按（来源，id）查的注册表，本图为空。
  默认库三个种子用最简策略都打得完，胜、预算耗尽、放不下三种结局都走到了。自检 PASS，单测 121 个（新加 45 个）；编辑器 Console 没看。给 22 补了两条约束（基因校验、等级上限）。
- [规则核心：局内存档快照](issues/22-规则核心-局内存档快照.md) —— **已落地 36f96a77**。编辑器 Console 是事后补验的：主工程编辑器关着 Auto Refresh，手拨 MCP 触发重编后，`GameRules` 0 错误，19、20 的代码也一并编过了。
  `RunSnapshot.Write` / `Read` 出入规范 JSON，成员与次序同 09 的 v1 样例；自写的读写器只认整数子集，1 MiB、16 层，读档不抛异常、报错误码加成员路径。错误码 11 种，形状从严。
  `Validate()` 补齐 09 §5；随机流的四条改在 `Read` 构造之前查。样档 `Tests/GameRules/Samples/run-v1.json`。任一步后存读接着打与不中断的一局逐步相同。自检 PASS，单测 190 个（新加 69 个）。
- [文本表与字体的基础件](issues/15-文本表与字体的基础件.md) —— **已落地 5c5e41bb / 97e0765f**：`texts.json` 先放主界面三个 key；`TextTable` 在主界面打开前异步读表，切语言重读、发 `LanguageChanged`；`LocalizedText`（字段 `_textKey`）、`TextKeys` 都已建；主字体是思源黑体 SC Bold 动态多图集 TMP 资产，入库的是清空态。
  主界面加了「按钮列」和语言按钮，编辑器里中英热切、删偏好后按系统语言取默认值都验过；Windows 包中文正常，主字体只在 YooAsset 的一个包里（15 MB）。
  `DotNet/Tests/L10n` 做了 14 第 8 条的五项，另加一项「主字体资产不带动态数据」：编辑器存盘会把图集写进资产（7.7 KB → 2 MB 多），这项拦。四种故意出错都红。自检 PASS，单测 208 个（新加 18 个）。
- [表现层：战斗窗的静态呈现](issues/28-表现层-战斗窗的静态呈现.md) —— **已落地 a449d5a7**：`UIBattlePanel` 照线框 A 搭好；辅助件连 `.meta` 拷，Part 按 02 裁；全量刷新入口是 `Refresh(IRunView)`。`ClearPacing` 已建，21 号票的常量全填了；「开始游戏」走 `RunLauncher.NewRun()`，「返回主界面」和 Esc 回主界面。
  F5 / F6 / F7 是调试键（只在编辑器与开发包里有）。走了 20 步，每步把画面与规则核心逐项比，全部一致；两种分辨率、中英两种语言都截了图。真键盘没按过。两个预览 shader 没搬（来源待确认），交 29。
  **更正 13**：UIRoot 的 CanvasScaler 是 Expand，16:10 下画布是 1920×1200，不是 1728×1080。自检 PASS，单测 208 个。
- [同种子跑局测试](issues/17-同种子跑局测试.md) —— **已落地 d33b4cf3**，阶段 3 验收第二条过了：`DotNet/Sim` 有 `greedy`、`random` 两种策略和规范化轨迹（`Sim --seeds … --policy …` 只写 stdout），`Tests/Run` 做 A、B、C、D 四路比对，8 个种子 × 两种策略全文一致。
  四种故意出错分别让 B、C、D、B 变红。为了拦住其中两种，**改了 10 号票的两处做法**：B 用夸大过的 tr-TR（数字每位一组，因为分数到不了 1000，`N0` 在哪个区域都一样）；D 两种策略都跑（贪心一次都不弃置），存读时把策略状态拷给续跑的那一局。
  每局平均 24.3 步，种子数没减，`dotnet单测` 热跑 3.5–4.1 秒。自检 PASS，单测 241 个（新加 33 个）。`.claude` 里三处说明跑局测试的措辞没跟着改。
- [用真规则核心回测占位数值](issues/18-用真规则核心回测占位数值.md) —— **回测全部达标，占位数值不改**。在独立 worktree 做，提交 3bafb222，经用户同意合进 main（fde435d1）。
  目标 350、28 块、弃 3：一步贪心 71.2%、整组规划 93.3%（束宽 8）、`random` 7.4%，都在门槛内。`Sim` 新增 `--batch` 批量模式（卡死率、分位数、胜率、类型频率），阶段 6 批量跑局的雏形。合并后 main 上 `dotnet test` 252 个全过。

## Not yet specified

（暂无。执行票都已成票；Unity 侧的确定性复核转成了 [Unity 侧的确定性复核](issues/24-Unity侧的确定性复核.md)。）

## Out of scope

- 定标（阶段 6）：目标分曲线、各消除类型基础值、经济。本图只用占位。
- 基因、科技、改造三张清单，以及标签、首领、补给包、优惠券。本图只留钩子。
- 局外循环（阶段 5）：难度选择、分层地图、商店、结算。
- 正式美术与音频；手机移植；HybridCLR / IL2CPP。
- 基因栏在战斗界面放哪（审计 §2.6）。本图没有基因。
- 手柄与 Steam Deck 操作、点选式拾取、改键。本图只做鼠标加键盘；它们和拖拽吐同一组事件，以后只在输入层补（见 [PC 操作](issues/12-PC上的落子与旋转操作.md)）。
- 启动器文案的双语。`LoadText.cs` 在热更程序集之前就跑，用不上 key 表，首发前要单独处理（见 [文本 key 表的接法](issues/14-文本key表的接法.md)）。
- 分发时把第三方许可放进包目录。思源黑体的 OFL 全文现在只被 Fonts 组打成一个 YooAsset 包随包带走，玩家看不到；本图的目的地是能玩，不是分发（见 [文本表与字体的基础件](issues/15-文本表与字体的基础件.md)）。
- 强化 4 种与版本 3 种的效果，包括万态「可填入任意空格」怎么落子。本图只在块实例上留槽、在逐格段留触发点（见切片边界票）。
- 阶段 2 的收尾：devflow 回归矩阵转绿、置备槽位、用小任务走通领取 → 交付。本图走主工程通道、不用槽位，属工程计划阶段 2 的验收（见 [阶段 2 的落地状态](issues/01-阶段2的落地状态.md)）。

## 已知的坑

<!-- 不是待决策，是后面每个 session 都该记着的事实 -->

- **阶段 2 已完成**（4e025276）：移植件 c49c2609，回归矩阵 43/43 转绿（e6b539f8），槽位 dev1、dev2 已置备，
  验收任务「主界面右下角显示版本号」走通领取 → 交付（47ef0219，**交付会推送到 origin**）。
  本图仍走主工程通道（不推送）。03 号票要求的 `Demo/.gitignore` 三行现在可以加了。
- **在仓根起的会话挂不上 devflow 的 hook**。`Demo/.claude/settings.json` 的提交检查、命令通路检查、写入补 BOM
  都按 `${CLAUDE_PROJECT_DIR}\.claude\devflow\hooks\…` 取路径，仓根没有 `.claude/settings.json`。task 票的会话要在 `Demo/` 起。
- **auto 模式会拒 `-ExecutionPolicy Bypass`**（分类器判 Security Weaken）。本机 CurrentUser 策略是 RemoteSigned，
  跑 devflow 脚本用 `powershell.exe -NoProfile -File <脚本>` 即可。
- **`BinaryBoard` 只记占没占**（64 位掩码），不记格属于哪一块（已由[数据模型](issues/06-盘面与方块实例的数据模型.md)加格层解决）。
  仍要记住两件：`CanClearRowCols(doClear: true)` 只清占用、不清格层，规则核心里不许用；
  格层数组按 `row*8 + col`，掩码的位是 `row*8 + (7 - col)`（最左列是行内最高位），换算只放一个助手。
- **block-client 已有旋转**：`BlockShapeMap.GetRotated` 与 `RotateCell` 同源（注释里写了两处各写一份公式的教训）。
  按原始朝向给格编号、不随旋转变，正好是逐格触发要的编号，正本在 `BoardHandDealer.PlaceShape`。
  `PendingPiece.Elements` 已在 block-client b4a37eb0e 删掉，那三处提到它的注释是过期的。
- **PC 上的拖拽器不分鼠标按键**：右键也能把块拖起来，移植时必改。
- **block-client 的计分文件本来就双端编译**：`BlockScoring.cs` 被服务端 csproj 链接编入，所以不得引入引擎类型。规则核心可以照这个先例。
- **`BoardGestureFlow.cs` 有 1108 行**，耦合 `BlockGameState`（单例）、`BoardPlayFlow`、`ServerDealSync`、`MergeOrderState`，不是拿来就能用的。
- **主工程编辑器关着 Auto Refresh**（`kAutoRefreshMode=0`，22 号票查到）：改完代码切到前台不会重编，`Library/ScriptAssemblies/GameRules.dll` 的时间不动。
  执行票要看编辑器编译结果：会话没有 UnityMCP 时，按 unity-check「会话侧拨号超时」手拨 `uvx --from mcpforunityserver==9.7.3 mcp-for-unity`，
  绑 `Demo@<hash>`（按路径 `E:/block-rougelike/Demo/Assets` 认），在带落点守卫的 `execute_code` 里 Refresh + `RequestScriptCompilation()`，
  再查 `EditorUtility.scriptCompilationFailed` 和 `read_console`。手拨要用户授权（22 号票这样做过一次）。
- **主字体资产会被编辑器写脏**（15 号票实测）：Play 或预制体里出过字之后，任何一次 SaveAssets 都会把图集像素和字形表写进 `SourceHanSansSC-Bold SDF.asset`（7.7 KB → 2 MB 多），`dotnet单测` 会红。
  清法：在 Inspector 里对它右键 Clear Dynamic Data 再保存，或者 git checkout。出包时 TMP 自己会清回同样的状态，不产生 diff。
- **经 MCP 触发出包**，用 `EditorApplication.update` 挂一次性回调来调 `WindowsBuild.Build()`。用 `delayCall` 编辑器在后台时迟迟不触发，过后会再出一次包（15 号票因此出了两次，`PackageVersion.json` 多加了一次）。
- **新建的 TMP 组件默认挂 LiberationSans**（无中文），要改挂主字体资产 `AssetRaw/Fonts/SourceHanSansSC-Bold SDF.asset`；自检按 guid 拦。
- **主工程编辑器的 Game 视图是竖屏 1080×1920**（28 号票实测），直接截 GameView 拿不到横屏画面。截战斗窗的做法：把 UICamera 的 `targetTexture` 换成目标尺寸的 RT，等一帧让 CanvasScaler 重算，再 `Render` 读回。
  MCP 的 `execute_code` 返回的中文会乱码（GBK），要先转成 `\uXXXX` 再返回。`EditorApplication.ExitPlaymode` 被 MCP 的安全检查拦，退出 Play 改用 `isPlaying = false`。
- **Outline 不能挂在透明底的 Image 上**（28 号票）：它是把底图错位重画四份，底一透明，四份就把整框涂满。框线要用 Outline 的，底色一律不透明。
- **Windows 包的画面截得到**（23 号票）：PowerShell 起 `3B.exe`，按 `MainWindowHandle` 取客户区（`GetClientRect` + `ClientToScreen`，先 `SetProcessDPIAware`），`Graphics.CopyFromScreen` 只截那一块（窗口 1280×720）。别截全屏，会把用户的桌面一起截进来。
  **编辑器和包共用一个存档目录** `%USERPROFILE%\AppData\LocalLow\block-rougelike\3B\save\`：编辑器里 Play 会写包读的那份档，手测前后都看一眼目录。`Player.log` 每次启动重写，上一次的在 `Player-prev.log`，写档耗时就记在里面。
