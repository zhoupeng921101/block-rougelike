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

## Not yet specified

- **执行票的切分**。规则核心、盘面移植、表现层、存档接线各拆几张 task 票、谁先谁后，
  要等数据模型、工程形态两张票落定才排得出来（切片边界已定）。
- **消除演出的节奏**。Balatro 式逐格跳分和 block-client 的整行爆破怎么合在一起、事件流里要不要带演出时长，
  等结算管线定了再看。
- **Unity 侧的确定性复核**。dotnet 侧同种子一致，不代表 Mono 包里也一致（浮点、字典遍历序）。
  要不要在包里再对拍一次、比什么，等存档定了才知道。随机流这一侧已经裁成全整数（[种子与随机流的口径](issues/08-种子与随机流.md)），
  剩下的风险在计分的数值类型和遍历序。

## Out of scope

- 定标（阶段 6）：目标分曲线、各消除类型基础值、经济。本图只用占位。
- 基因、科技、改造三张清单，以及标签、首领、补给包、优惠券。本图只留钩子。
- 局外循环（阶段 5）：难度选择、分层地图、商店、结算。
- 正式美术与音频；手机移植；HybridCLR / IL2CPP。
- 基因栏在战斗界面放哪（审计 §2.6）。本图没有基因。
- 启动器文案的双语。`LoadText.cs` 在热更程序集之前就跑，用不上 key 表，首发前要单独处理（见 [文本 key 表的接法](issues/14-文本key表的接法.md)）。
- 强化 4 种与版本 3 种的效果，包括万态「可填入任意空格」怎么落子。本图只在块实例上留槽、在逐格段留触发点（见切片边界票）。
- 阶段 2 的收尾：devflow 回归矩阵转绿、置备槽位、用小任务走通领取 → 交付。本图走主工程通道、不用槽位，属工程计划阶段 2 的验收（见 [阶段 2 的落地状态](issues/01-阶段2的落地状态.md)）。

## 已知的坑

<!-- 不是待决策，是后面每个 session 都该记着的事实 -->

- **阶段 2 已入库（c49c2609），但验收没跑**（已解决的旧坑：开图时 208 个文件卡在暂存区）。
  devflow 回归矩阵没全绿、没置备槽位；主工程通道用到的客户端自检与单仓提交在真工程上跑通过。
  03 号票要求的 `Demo/.gitignore` 三行现在可以加了。
- **在仓根起的会话挂不上 devflow 的 hook**。`Demo/.claude/settings.json` 的提交检查、命令通路检查、写入补 BOM
  都按 `${CLAUDE_PROJECT_DIR}\.claude\devflow\hooks\…` 取路径，仓根没有 `.claude/settings.json`。task 票的会话要在 `Demo/` 起。
- **auto 模式会拒 `-ExecutionPolicy Bypass`**（分类器判 Security Weaken）。本机 CurrentUser 策略是 RemoteSigned，
  跑 devflow 脚本用 `powershell.exe -NoProfile -File <脚本>` 即可。
- **`BinaryBoard` 只记占没占**（64 位掩码），不记格属于哪一块。
  3B 按格计点数、按格触发强化、判同形态，都要「格 → 块实例」。
- **block-client 已有旋转**：`BlockShapeMap.GetRotated` 与 `RotateCell` 同源（注释里写了两处各写一份公式的教训）。
  按原始朝向给格编号、不随旋转变，正好是逐格触发要的编号，正本在 `BoardHandDealer.PlaceShape`。
  `PendingPiece.Elements` 已在 block-client b4a37eb0e 删掉，那三处提到它的注释是过期的。
- **PC 上的拖拽器不分鼠标按键**：右键也能把块拖起来，移植时必改。
- **block-client 的计分文件本来就双端编译**：`BlockScoring.cs` 被服务端 csproj 链接编入，所以不得引入引擎类型。规则核心可以照这个先例。
- **`BoardGestureFlow.cs` 有 1108 行**，耦合 `BlockGameState`（单例）、`BoardPlayFlow`、`ServerDealSync`、`MergeOrderState`，不是拿来就能用的。
