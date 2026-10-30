# .claude/devflow 脚本索引

devflow 工作流的机械层。Agent 面入口是 `客户端自检.ps1` 与 `单仓提交.ps1`(devflow 与人工入库通道共用),其余脚本是内部构件或卡里点名直调的辅助件。2026-10-30 起不再有槽位池,开发直接在主工作树上单线进行(理由见 [rationale.md](rationale.md#single-tree-sequential))。

脚本从 block-client 整套搬来,双仓共用的服务端分支(Fantasy worktree、服务端凭据、协议导出、部署)留在脚本里,按 flow-config `ServerDirName` 留空整段关闭(判据单源 = `hooks/hook函数库.ps1` `Test-ServerEnabled`)。本 README 只写客户端单端形态。

**正本分工**(本 README 不复述这三处的内容,只给指针):
- 机器常量(仓根 / 基线 / 服务端开关):[flow-config.psd1](flow-config.psd1)。路径类键(RepoRoot)留空即由加载器按脚本自身位置推导,故配置里不存本机绝对路径;显式值优先。`FantasyRoot` / `ServerDirName` / `FantasyBaseline` 与 `LubanGen*Bat` 是服务端通道与 Luban 的预留键,本作留空。
- 义务 → 绑定事件 → 保证等级:[obligation-ledger.md](obligation-ledger.md)。
- 各段流程与判断规则:`.claude/skills/devflow*` 各卡。

## 怎么执行

全部脚本为 **Windows PowerShell 5.1**(`powershell.exe`)。共享层 = `hooks/hook函数库.ps1`(配置、git 薄封装、遥测、工作树哈希、凭据签发等单源);测试侧共享层 = `tests/测试夹具库.ps1`(dot-source 前者,反向不成立);`hooks/xlsx读取库.ps1` 是只读 xlsx 解析库,留给接入 Luban 后读表源的检查脚本用,现无检查消费它。单源由 `静态扫描.ps1` 强制。含非 ASCII 的脚本一律 UTF-8 BOM(见 `.claude/rules-ondemand/script-authoring.md`「编码与语法自检」)。

调用形态:脚本内起子脚本用 `Get-FlowEngine`(不写死引擎路径),同进程内直调 `& <脚本.ps1> -Param ...`;会话调用形态见 `.claude/rules/shell-conventions.md`。

### hooks —— harness 事件自动触发

hook 脚本注册在 [../settings.json](../settings.json) 的 `hooks` 段,harness 按下表事件与 matcher 自动执行,形如:

```
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${CLAUDE_PROJECT_DIR}\.claude\devflow\hooks\提交检查.ps1"
```

| hook | 注册事件(matcher) |
|---|---|
| hooks/提交检查.ps1 | PreToolUse:`Bash` / `PowerShell`,`if` 预筛命令含 `git`(Bash 另列 `Git` / `GIT`)或 `run_tests` |
| hooks/命令通路检查.ps1 | PreToolUse:`Bash` / `PowerShell`(与提交检查并行),`if` 预筛 Bash 含 powershell / pwsh / `.bat` / `.cmd`(各列常见大小写写法)、PowerShell 含 `.bat` / `.cmd` |
| hooks/写入补BOM.ps1 | PostToolUse:`Write` / `Edit`,`if` 限 `*.ps1` / `*.psd1` |

- **预筛**:`if` 是 harness 对命令文本的子串匹配,只省掉不相关调用的进程启动,不承担判据;脚本内快速路径仍是第二层。`if` 只写一条规则,「或」靠同一脚本注册多条;matcher 里的小写工具名 `bash` / `pwsh` 另组无条件注册。**改 hook 判据先看预筛**:新增拦截类或改触发字样,先加宽该 hook 的 `if`;覆盖由 `tests/命令通路检查测试.ps1` S 段按本 hook 拒绝样例 + 提交检查代表形态核。实测行为(2026-10-20 演练):Bash 侧区分大小写;同一命令命中多条不去重,各起一个进程;harness 判不出命令(如 `$()`)时全部 handler 照跑。
- **输入**:harness 把工具调用打成 JSON 经 **stdin** 传入,脚本经 `Read-HookInput` 读(裸字节 + UTF8 解码)。
- **回执**:退出码 + stdout JSON。拦截输出 `permissionDecision: deny`;放行空输出、退出 0;`run_tests.ps1` 全量矩阵回 `ask`;验证面漂移回带 `additionalContext` 警示的 allow。

## 共同约定

- **状态与遥测**:所有运行态与留痕落仓外 `%LOCALAPPDATA%\claude-wf-3b`(检查凭据 `.gate/` 除外,落仓根)。装有桌面端时物理位置在 `Packages\Claude_*\LocalCache\Local\claude-wf-3b`,容器内外同一份;路径一律经 `hook函数库.ps1` `Resolve-WfStatePath` 取(判据见其注释,静态扫描 R18 拦直拼)。遥测事件:单仓提交 结论行、客户端自检 `gate-run`,护栏降级 `degraded`、护栏走到且没降级 `guard-ok`(检查命中面板算降级占比的分母);字段说明在各构造函数头注(`Write-Degraded` / `Write-GuardOk`;gate-run 的在 hook函数库「自检编排的共用出口」节头注)。
- **退出码惯例**:`0` 成功;`1` 检查失败/校验拒绝;`2` 参数或基础设施错误;`3` 阻塞(客户端自检的 STALE、单仓提交的已提交未推送)。Agent 以入口末行 `VERDICT:` 为准。
- **VERDICT 续接档位**:`单仓提交` 在 `VERDICT:` 行尾附 `next=<go|fix-retry|judge|halt>`,会话按该字段处置,不自行归类。派生判据单源 = `hooks/hook函数库.ps1` `Get-VerdictNext`;各档语义正本 = devflow 卡「停机呈报」条。客户端自检按出口码处置(同条)。
- **参数缺省**:凡涉仓根/基线的参数,缺省即读 flow-config.psd1;脚本内一律经 `Get-FlowConfig` 读,不裸读 psd1。

## 检查(gate:跑校验、发检查凭据)

检查凭据 = `<仓根>\.gate\ticket.json`,由检查脚本首尾双哈希核树后签发(另记受检 HEAD sha),供 `提交检查.ps1` 验凭据;树中途变化(STALE)不发票。客户端自检的 STALE 单列出口码 `3`,与 FAIL 的 `1` 分开;正本 = 脚本头注出口码表。

**客户端自检的触发面 = 各道扫描的读取面之并**:登记在 `hooks/校验库.ps1` `ClientGateScanSurface`,拼出客户端验证面 `ClientSurfaceRe`(详见 客户端自检.ps1 头注)。`单仓提交.ps1` 的验凭据只认 `Assets/GameScripts|Launcher` 的 `.cs/.asmdef`(`GatedRe`)。下表各道除注明外均内置于 客户端自检.ps1(道次顺序以其扫描数组为准),一般不单独调用。block-client 的 Luban 四道(配置预载 / 配置表前缀 / 表间引用 / 导表指纹)没有搬,等本作接入 Luban 时随第一张表一起搬回。

| 脚本 | 职责 | 调用 | 退出码 |
|---|---|---|---|
| [客户端自检.ps1](客户端自检.ps1) | 客户端提交前检查:十五道(十三道静态扫描 + 规则核心 dotnet 单测 + 末道 Editor 程序集真编译),直跑给定 Demo,不启动 Unity、需 dotnet SDK;耗时的几道并行跑(哪几道、执行形态与失败时的收尾见脚本头注);子道抛异常或未知退出码判 INFRA;各道均过但树在检查期间变了判 STALE(出口码 3,DRIFT 行点名变了的路径)。devflow 卡第三步调用。 | `-ProjectDir <Demo>` | 0/1/2/3 |
| [命名空间扫描.ps1](命名空间扫描.ps1) | 命名空间规约 + 程序集归属(无 asmdef 覆盖的 .cs)静态扫描;归属判定取 hook函数库「Unity 程序集实扫」。规约正本 = `tengine-conventions.md`「客户端命名空间」「程序集归属」。 | `命名空间扫描.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [平台宏核对.ps1](平台宏核对.ps1) | 平台脚本宏策略静态扫描:按 `ProjectSettings/PlatformDefinePolicy.json` 核各平台 define(required 在位、exclusive 不越界);清单与编辑器菜单 `TEngine/Platform Define Symbols/*` 共用。 | `平台宏核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [文本截断核对.ps1](文本截断核对.ps1) | UGUI 文本截断静态扫描:`m_VerticalOverflow=Truncate` 的 Text 高度须 ≥ 字号 × 1.5;垂直拉伸锚点与 BestFit 节点跳过。 | `文本截断核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [UI绑定核对.ps1](UI绑定核对.ps1) | UI prefab 绑定完整性静态扫描,分窗档(`_Gen.g.cs` 的 `m_` 字段)与 Part 档(`*Part.cs` 的对象引用字段);代码根 = `GameLogic/UI`(缺则 INFRA),脚本里另登记的底座层 `GameBase/UI` 根本作没有,缺省跳过;判据、分报类别与不覆盖面见脚本头注。 | `UI绑定核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [安全区结构核对.ps1](安全区结构核对.ps1) | UI 安全区节点结构静态扫描:挂 `UISafeArea` 的节点名须以「安全区」起头,`m_btn_Mask` 不得在安全区子树内(豁免与局限见头注);guid 按 `UISafeArea.cs.meta` 取,缺则 PASS 跳过——本作 PC 首发、暂无该组件,现为空转。 | `安全区结构核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [图集子图组件核对.ps1](图集子图组件核对.ps1) | 图集子图组件静态扫描:`Assets/AssetRaw/UI` 下 prefab 的图片,Source Image 是图集成员的,须是绑了图集的 `ExImage`,且 `ExImage` 绑的图集须仍在;原生 Image / 缺图集 / 被多图集打包 / 绑定悬空四类分报(判据、修法与不覆盖面见头注)。按 `ExImage.cs.meta` 取 guid,缺则 PASS 跳过——本作暂无 ExImage,现为空转。 | `图集子图组件核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [bat编码核对.ps1](bat编码核对.ps1) | `.bat` 纯 ASCII 静态扫描(纯字节):`Demo/` 下入仓候选的 `.bat` 不得含 >= 0x80 字节,`chcp 65001` 不豁免。 | `bat编码核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [热更程序集核对.ps1](热更程序集核对.ps1) | 热更程序集清单静态扫描:`UpdateSetting.asset` 白名单(正本 = 脚本内 `$Whitelist`,本作为 `GameRules.dll`、`GameLogic.dll`)与 `HybridCLRSettings.asset` 双文件同步(四条不变量见头注)。HybridCLR 暂关不影响本道:清单照样要同步,开热更时才不出错。 | `热更程序集核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [机器路径核对.ps1](机器路径核对.ps1) | 机器绝对路径静态扫描:`Demo/` 下入仓候选的非注释行不得含盘符 / Git-Bash 盘符形态的绝对路径(扫描面与三类豁免见头注)。 | `机器路径核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [工程链接核对.ps1](工程链接核对.ps1) | 工具 csproj 链接目标存在性静态扫描:`Demo/` 下入仓 `.csproj` 的 `<Compile>` / `<ProjectReference>` 目标须存在;展不开的属性与 `@(` / `%(` 项跳过打 NOTE。 | `工程链接核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [进程编码核对.ps1](进程编码核对.ps1) | 编辑器工具捕获子进程输出静态扫描:`Assets/Editor` / `Assets/TEngine/Editor` 两面须走本面共用原语(`EditorProcess.cs` / `ShellHelper.cs`),原语自身须设编码(判据见头注)。 | `进程编码核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [启动器字体核对.ps1](启动器字体核对.ps1) | 启动器子集字体覆盖静态扫描:`Assets/Launcher` 下 `.cs` 的全部用字(含注释,与字体生成脚本同口径)须在 `LauncherFont.otf` 的 cmap 里;不覆盖面与修法(重跑 `.claude/scripts/subset_launcher_font.py`)见头注。 | `启动器字体核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [占位素材核对.ps1](占位素材核对.ps1) | 占位素材目录与 `ZooPlaceholder/占位登记表.md` 两边一致的静态扫描(判据见头注),不拦出包。 | `占位素材核对.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [dotnet单测.ps1](dotnet单测.ps1) | 规则核心单测、文本表校验、战斗演出排期与局内存档文件层(链接编译的 GameLogic 文件见头注):restore 后 `dotnet test DotNet/Tests/Tests.csproj`;镜像库编不过、用例失败或一个用例都没跑判 FAIL,restore 失败判 INFRA(见头注)。 | `dotnet单测.ps1 -ProjectDir <Demo>` | 0/1/2 |
| [Editor程序集编译.ps1](Editor程序集编译.ps1) | 客户端自检唯一编译道:Assembly-CSharp-Editor 连带引用闭包真编一遍,再按 `PlatformDefinePolicy.json` 各出包平台的 define 并行编运行时程序集,工具宏另编一遍(见头注)。闭包里 Assets 与工程内嵌包下有 asmdef 的 csproj 过期先按实扫写临时副本再编;须编辑器重生成或纯环境类错误判 INFRA。比对面、INFRA 各类与「排除 csproj 过期」的给法见头注。 | `Editor程序集编译.ps1 -ProjectDir <Demo>` | 0/1/2 |

## 提交前自审(会话调用,不发凭据)

Agent 在跑客户端自检之前跑一次,判本轮触发了哪几项自审义务。判定器不是拦截器:恒 exit 0(INFRA 与 `-CheckRuleTable` 自检除外);事前触发不在覆盖内(见脚本头注)。

| 脚本 | 职责 | 调用 | 退出码 |
|---|---|---|---|
| [自审触发判定.ps1](自审触发判定.ps1) | 扫改动面(含未提交与 untracked)判五项触发:SECURITY-REVIEW / ASSET-SETTLE / UI-EVIDENCE / FIX-QUALIFY / RULES(按需篇点名),判据见头注;`-CheckRuleTable` 只读自检判据表。 | `-ProjectDir <Demo> [-MessageFile ..]` / `-CheckRuleTable [-ProjectDir ..]` | 0/1/2 |

## 提交

| 脚本 | 职责 | 调用 | 退出码 |
|---|---|---|---|
| [单仓提交.ps1](单仓提交.ps1) | 清单式按路径提交(devflow 与人工入库通道的 Agent 入口)。主题格式与【修复】定性的拒绝口径见头注(`DENIED-subject` / `DENIED-qualify`)。清单路径带 `Demo/` 前缀。 | `[-RepoDir <仓>] -MessageFile <文件> -PathListFile <文件> [-Push] [-CheckOnly]`(缺省不推) | 0/1/2/3 |
| [简报校验.ps1](简报校验.ps1) | 简报结构机判(段齐全 / 验收点空话 / 占位探测;必填段由模板 `## ` 标题解析,模板正本 = [templates/简报模板.md](templates/简报模板.md));简报落文件交接时自跑。 | `简报校验.ps1 -BriefFile <文件> [-TemplateFile <模板>]` | 0/1/2 |
| [提交钩子安装.ps1](提交钩子安装.ps1) | 把 git 提交前钩子(sh 垫片,调 `hooks/提交前绑定核对.ps1`)装进仓的钩子目录;钩子不入库,新克隆 / 换机器后跑一次。不覆盖别处写的钩子。 | `提交钩子安装.ps1 [-RepoDir <仓>] [-CheckOnly\|-Remove]` | 0/1/2 |

## 提交收尾(机械操作)

| 脚本 | 职责 | 调用 | 退出码 |
|---|---|---|---|
| [临时测试清理.ps1](临时测试清理.ps1) | 检查通过后清理临时测试(只删 `Assets\Editor\Tests` 及其 `.meta`),devflow 卡第三步在客户端自检 PASS 后调用;删前验票(PASS 且票树覆盖当前树),不跑 git。 | `-ProjectDir <Demo> [-CheckOnly]` | 0/1/2 |

## 自检工具

统一启动器 [test.bat](test.bat):Windows 双击即用的薄 ASCII 壳,中文套件名的分派交给 [run_tests.ps1](run_tests.ps1)。用法:

| 命令 | 跑什么 |
|---|---|
| 双击 / `test`(无参) | 全量回归矩阵(tests\ 下全部套件,含端到端串联) |
| `test <套件>` | 单套件,`<套件>` 传中文短名,如 `test 单仓提交` → `tests\单仓提交测试.ps1` |

脚本索引:

| 脚本 | 职责 | 调用 | 退出码 |
|---|---|---|---|
| [test.bat](test.bat) | 测试启动器薄 ASCII 壳(双击即用),按模式分派到下方测试入口。 | `test [<套件>]` | 透传 |
| [run_tests.ps1](run_tests.ps1) | 测试入口:无参跑静态前置(静态扫描)+ 全量矩阵(成员清单为其内 `$Suites`,单一事实源),`-Suite <中文短名>` 跑单套件。开跑前打 `MEM:` 水位行;未通过的套件另点名崩溃退出(`CRASH:`)与运行期间的内存耗尽(`ENV-SUSPECT:`),只点名不改判,判据见头注。 | `[-Suite <名>]` | 0/1/2(`-Suite` 套件崩溃时透传子进程退出码) |
| [静态扫描.ps1](静态扫描.ps1) | `.claude` 下脚本(不含直属 `worktrees/`)的结构性静态检查(纯解析):共享库副本、区域敏感比较、孤儿脚本、写死引擎路径、写入口约束等 R 规则(清单与判据见头注;R6-R11 规约正本 = `script-authoring.md`)。新增同类规则加进本脚本。 | `静态扫描.ps1 [-Root <扫描根>]` | 0/1/2 |
| [tests/测试夹具库.ps1](tests/测试夹具库.ps1) | 测试侧共享层(仅供 tests\ dot-source):断言与收尾、git 封装、夹具写文件、假仓、凭据伪造、夹具清理、隔离遥测读取(`Get-TelRows`)。自 dot-source hook函数库.ps1。 | 被 dot-source | — |
| [语法自检.ps1](语法自检.ps1) | 脚本语法自检(`.ps1`/`.psd1` 走 .NET Parser、`.py` 走 `py_compile`;`.psd1` 另过 `Import-PowerShellDataFile`);任何脚本改动收尾必跑。无参 = 全量检查 .claude 下 ps1/psd1/py(不含直属 `worktrees/`)。 | `[-Path <文件或目录> ...]` | 0/1/2 |
| [重建csproj.ps1](重建csproj.ps1) | 判 csproj 是否过期(目标程序集及其引用闭包(含工程内嵌包)的 `<Compile>` vs 磁盘实扫,另判引用集与宏);`-InPlace` 就地重写 `<Compile>` 列表,引用集与宏只能回编辑器重生成。不碰 `.cs`、git 只读、不编译。 | `重建csproj.ps1 -ProjectRoot <Unity 工程根> -Assembly <程序集名> [-InPlace]` | 0 FRESH/FIXED · 1 STALE · 2 INFRA · 3 STALE-REGEN |
| [漂移取证.ps1](漂移取证.ps1) | UnityMCP 实例漂移的现场采集与判定(只读诊断,非常驻,抓到一次即可停):`-Watch` 采集、`-Mark` 打锚点、`-Report` 判定;日志落仓外。 | `漂移取证.ps1 -Watch [-IntervalSec <秒>] [-MaxMinutes <分>]` / `-Mark -Expected <id> -Actual <路径>` / `-Report [-Around <时刻>]` | 0/2 |
| [tests/单仓提交测试.ps1](tests/单仓提交测试.ps1) | 单仓提交.ps1 假仓回归矩阵(夹具落 %TEMP%、不触真仓)。改 单仓提交 / 校验库 后跑。 | `powershell.exe -File tests\单仓提交测试.ps1` | 0/1 |
| [tests/自审触发判定测试.ps1](tests/自审触发判定测试.ps1) | 自审触发判定.ps1 假仓回归(五项触发各一正一反)与 `-CheckRuleTable`(含对主仓的只读一例),覆盖面见套件头注。改 自审触发判定或判据表后跑。 | `powershell.exe -File tests\自审触发判定测试.ps1` | 0/1 |
| [tests/简报校验测试.ps1](tests/简报校验测试.ps1) | 简报校验 CLI 层契约(覆盖面见套件头注)。改 简报校验 或 简报模板 后跑。 | `powershell.exe -File tests\简报校验测试.ps1` | 0/1 |
| [tests/临时测试清理测试.ps1](tests/临时测试清理测试.ps1) | 临时测试清理 CLI 层契约(验票各拒绝形态与 `-CheckOnly`,覆盖面见套件头注)。改 临时测试清理 后跑。 | `powershell.exe -File tests\临时测试清理测试.ps1` | 0/1 |
| [tests/平台宏核对测试.ps1](tests/平台宏核对测试.ps1) | 平台宏核对 CLI 层契约(夹具自造工程,覆盖面见套件头注)。改 平台宏核对 或策略清单结构后跑。 | `powershell.exe -File tests\平台宏核对测试.ps1` | 0/1 |
| [tests/热更程序集核对测试.ps1](tests/热更程序集核对测试.ps1) | 热更程序集核对 CLI 层契约(四条不变量与解析边界,夹具自造)。改 热更程序集核对 后跑。 | `powershell.exe -File tests\热更程序集核对测试.ps1` | 0/1 |
| `tests/<道名>测试.ps1`(客户端自检其余各道) | 客户端自检各道的 CLI 层契约,套件名 = 道名 + `测试`,并非每道都有;改某道后有同名套件即跑。现役成员以 `run_tests.ps1` 的 `$Suites` 为准。 | `run_tests.ps1 -Suite <道名>` | 0/1/2(套件崩溃时透传) |
| [tests/hook函数库测试.ps1](tests/hook函数库测试.ps1) | 共享库单元测试(覆盖面见套件头注)。改 hook函数库 后跑。 | `powershell.exe -File tests\hook函数库测试.ps1` | 0/1 |
| [tests/xlsx读取库测试.ps1](tests/xlsx读取库测试.ps1) | xlsx读取库 单元测试(同进程 dot-source),直接锁读取层契约。改 xlsx读取库 后跑。 | `powershell.exe -File tests\xlsx读取库测试.ps1` | 0/1 |
| [tests/静态扫描测试.ps1](tests/静态扫描测试.ps1) | 静态扫描 CLI 层契约(覆盖面见套件头注)。改 静态扫描 后跑。 | `powershell.exe -File tests\静态扫描测试.ps1` | 0/1 |
| [tests/语法自检测试.ps1](tests/语法自检测试.ps1) | 语法自检 CLI 层契约(覆盖面见套件头注)。改 语法自检 后跑。 | `powershell.exe -File tests\语法自检测试.ps1` | 0/1 |
| [tests/理由对齐核对测试.ps1](tests/理由对齐核对测试.ps1) | 理由对齐核对 CLI 层契约(复制进假 .claude 树跑)。改 理由对齐核对 后跑。 | `powershell.exe -File tests\理由对齐核对测试.ps1` | 0/1 |
| [tests/记忆索引核对测试.ps1](tests/记忆索引核对测试.ps1) | 记忆索引核对 CLI 层契约(一律显式 `-MemDir` 指假目录)。改 记忆索引核对 后跑。 | `powershell.exe -File tests\记忆索引核对测试.ps1` | 0/1 |
| [tests/提交检查测试.ps1](tests/提交检查测试.ps1) | 提交检查 hook 的命令面演练矩阵(表文档两项、add+commit 同命令、force push、验凭据、漂移警示不拒等)。改 提交检查 或 校验库 后跑。 | `powershell.exe -File tests\提交检查测试.ps1` | 0/1 |
| [tests/测试入口环境取证测试.ps1](tests/测试入口环境取证测试.ps1) | run_tests.ps1 自身的 CLI 层契约:开跑前水位提示、未通过时的崩溃退出码与内存耗尽点名(假套件 + 探针经环境变量注入,不读本机真实水位与事件日志;覆盖面见套件头注)。改 run_tests 后跑。 | `powershell.exe -File tests\测试入口环境取证测试.ps1` | 0/1 |
| [tests/合并丢失核对测试.ps1](tests/合并丢失核对测试.ps1) | 合并丢失核对 CLI 层契约(假仓落 %TEMP%,覆盖面见套件头注)。改 合并丢失核对 后跑。 | `powershell.exe -File tests\合并丢失核对测试.ps1` | 0/1 |
| [tests/漂移取证测试.ps1](tests/漂移取证测试.ps1) | 漂移取证 `-Report` CLI 层契约(日志夹具落 %TEMP%,零 git,覆盖面见套件头注)。改 漂移取证 后跑。 | `powershell.exe -File tests\漂移取证测试.ps1` | 0/1 |
| [tests/检查命中面板测试.ps1](tests/检查命中面板测试.ps1) | 检查命中面板 CLI 层契约(假自检 + 假登记行 + 隔离遥测,覆盖面见套件头注)。改 检查命中面板 或准入登记读取后跑。 | `powershell.exe -File tests\检查命中面板测试.ps1` | 0/1 |
| [记忆索引核对.ps1](记忆索引核对.ps1) | 记忆索引-文件一致性核对(无主 / 悬空失配),由 /rules-audit 卡 M1 判项调用;范围 = user 级项目记忆(仓外,缺省目录)。 | `记忆索引核对.ps1 [-MemDir <目录>]` | 0/1/2 |
| [理由对齐核对.ps1](理由对齐核对.ps1) | 理由外移的指针 ↔ rationale 条目双向对齐核对(无无主理由、无悬空指针);由 devflow-check 与 /rules-audit 调用。PAIRS 清单维护于脚本内。 | `理由对齐核对.ps1` | 0/1/2 |
| [合并丢失核对.ps1](合并丢失核对.ps1) | 合并提交「静默丢失」人审清单:两侧都改过的文件三方比对,列出某侧独有却未进合并结果的行(声明形标 [声明])。完备清单而非精确闸,判据见头注;devflow 卡第三步「自审」条件项,亦可手动。 | `合并丢失核对.ps1 [-Merge <合并提交ish>] [-RepoDir <仓>] [-Full] [-MaxSample <n>]` | 0/1/2 |
| [归因留痕.ps1](归因留痕.ps1) | 逃逸缺陷归因留痕(四类归因 + 预期取舍简化归因),每归因缺陷跑一次。写遥测 claude-wf-3b。 | `归因留痕.ps1 -Route <路由> -NoteFile <说明文件>` | 0/2 |
| [检查命中面板.ps1](检查命中面板.ps1) | 客户端自检各道的命中统计(按 gate-run 的 fails 计)、道耗时 p50/p90 与零命中复核候选,另列疑似恒降级的护栏(按走到次数算占比;只读零写入;数据源与判据见头注),devflow-check 检查项 5 调用。裁定保留的道在登记行记 `Reviewed=<裁定日>`,其后运行够数才再列为候选。 | `检查命中面板.ps1 [-MinRuns <N>]` | 0/2 |

## hooks(harness 事件自动触发)

由 `settings.json` 注册在 PreToolUse / PostToolUse,一般不手动调用(演练除外);行为契约由 `tests/` 下同名测试套件锚定。内部异常一律 失败放行 并记 error 遥测(提交检查 有两条 失败即停 例外:配置加载失败、commit/push 仓根解析不出)。绑定与保证等级见 obligation-ledger.md。

| 脚本 | 触发 | 职责 |
|---|---|---|
| [hooks/提交检查.ps1](hooks/提交检查.ps1) | PreToolUse:Bash/PowerShell | 命令面强制检查:拦 `git commit`/`push`/`merge`。force-push 无条件拒;逐项校验客户端凭据、表文档同步、表数据转述、本地持久化白名单标签、集成分支 merge(服务端凭据一项随服务端通道关闭);`run_tests.ps1` 全量矩阵升为 ask。校验函数在 校验库.ps1。 |
| [hooks/命令通路检查.ps1](hooks/命令通路检查.ps1) | PreToolUse:Bash/PowerShell | 拦两类命令通路:Bash 里拉起 powershell/pwsh(吞 `$`/`\`、GBK 乱码)、`cmd` 裸名调 bat(`NoDefaultCurrentDirectoryInExePath` 下找不到)。拒绝理由即改写法,判据见头注。 |
| [hooks/写入补BOM.ps1](hooks/写入补BOM.ps1) | PostToolUse:Write/Edit(`*.ps1`/`*.psd1`) | 写完含非 ASCII 且无 BOM 的 PowerShell 文件,原字节前补 UTF-8 BOM 并经 additionalContext 回报;非 UTF-8 字节不动只回报。 |
| [hooks/提交前绑定核对.ps1](hooks/提交前绑定核对.ps1) | git pre-commit(非 harness;经 `提交钩子安装.ps1` 装的垫片) | 会话外手动提交碰到 UI 绑定面时,对本次提交的索引跑 `UI绑定核对.ps1`,违规拒绝提交。合并收尾不拦,自身出错放行;判据与绕过见头注。 |
| [hooks/校验库.ps1](hooks/校验库.ps1) | 被 dot-source | 提交检查校验函数库(单一校验正本):验证面正则(`ClientSurfaceRe` 由 `ClientGateScanSurface` 拼出)、生成域正则与生成域登记 `GenDomains`、验凭据与表文档判定、按需篇点名判据表 `RuleReadTable`(自审触发判定 / 槽位领取 共用)等。提交检查与 单仓提交 共用。自 dot-source hook函数库.ps1。 |
| [hooks/hook函数库.ps1](hooks/hook函数库.ps1) | 被 dot-source | hooks 与检查脚本共享函数库:配置懒加载、服务端通道开关 `Test-ServerEnabled`、stdin 读取、遥测(含入口 VERDICT 遥测与降级留痕 `Write-Degraded` / `Write-GuardOk`)、工作树哈希、凭据签发、自检的编排出口、合并冲突机械分流、Luban junction 复核、C# 去噪等。加载时只钉一次进程编码,无其他副作用。 |
| [hooks/hook演练.ps1](hooks/hook演练.ps1) | 手动 | 检查演练:按 harness 方式(stdin)把伪造的 hook 输入喂给 hook 脚本回归验证;须从 `powershell.exe` 调用才与 harness 同引擎。调用 `-Hook <名\|路径> -Json <输入文件>`。 |
| [hooks/xlsx读取库.ps1](hooks/xlsx读取库.ps1) | 被 dot-source | xlsx 只读解析库(零写入、不依赖 Excel COM),留给接入 Luban 后读表源的检查脚本取行列;读取异常先打一行真因再返 `$null`。 |
