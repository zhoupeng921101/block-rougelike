---
name: unity-check
description: UnityMCP 连接自检。对 Unity 执行操作前确认 MCP 连到正确实例;或交互中工具突然报错、怀疑连接掉线/绑错实例时手动诊断。触发:/unity-check、"Unity 连不上/连接自检/绑错实例"。
---

# UnityMCP 连接自检

对 Unity 执行任何操作前先确认三件事:MCP server 正在运行、所绑定的 Unity 实例存活并可响应、绑定的是正确工程。三步探针,全是廉价调用,按序执行。

**目标 = 当前应绑定的实例,id 一律按工程路径解析:devflow 中为领取结果的槽位 Demo(领取脚本已保证其编辑器启动并向 UnityMCP 注册就绪;`-NoUnity` 免启领取的任务无实例,转需编辑器时经 `槽位领取.ps1 -StartUnity -Slot <N>` 补就绪,判据正本 = devflow 卡第二步「免启」条),独立诊断时为当前工作的编辑器。** 本卡只校验调用路由与响应性。客户端自检不经 MCP,也不需要活编辑器。

## 绑定机制:先解析当前 id 再绑

`set_active_instance` 只认 `Name@hash` / hash 前缀 / 端口号,**不认裸工程名**(传工程名会报 "does not match any running Unity editors")。而 hash 随工程副本/重开变、端口随启动顺序变。故绑定前先读 `mcpforunity://instances` 解析当前 `id`,解析键一律按路径:

- 主工程与全部槽位实例同名 `Demo`(`id` 形如 `Demo@<hash>`),不可按名认:找 `path` 以 `<槽位根>/Demo/Assets` 结尾的条目(`<槽位根>` = 领取结果里返回的槽位客户端仓根,形如 `.../block-rougelike-devN`),取该条目 `id`。绑定后以 path 复核目标;不符时立即重绑。

## 三步

1. **server 在 + 绑的是不是目标实例** — `debug_request_context`
   - 读 `session_state.active_instance`:等于按路径解析出的目标实例 id(主编辑器或槽位)→ 身份对,进第 2 步验活;为 `null` 或指向其它实例 → 身份错,直接进第 3 步重绑。
   - 此调用本身报错 = 领取后的基础设施状态失效;停止 Unity 操作并按领取入口的 `BLOCKED-UNITYMCP` 路由处理,不手工拼编辑器启动命令(工具整批缺席的会话侧拨号超时另见「边界」)。

   > 身份只能靠 active_instance 的 path 判——`get_active` 的返回分不出绑的是哪个实例。
   > 理由见 .claude/devflow/rationale.md#instance-binding-path-only

2. **绑定的 Unity 是否响应** — `manage_scene` action=`get_active`
   - 成功返回当前场景 = 绑定实例在响应,自检通过。
   - 失败/超时 = 绑定实例已断开或无响应 → 进第 3 步。

3. **修正绑定** — 按「绑定机制」从 `mcpforunity://instances` 解析目标实例当前 `id`,`set_active_instance` instance=该 id,再跑一次第 2 步
   - 重绑后第 2 步通过 = 之前绑错/未绑,已修正到目标。
   - instances 里没有目标条目,或重绑后仍失败 = 目标实例已崩溃或正在域重载;短暂重试后仍失败则按基础设施阻塞返回。

## 边界

「绑错实例」由第 3 步自动修;server 或编辑器失效由本卡定位,恢复动作交槽位领取脚本契约,Agent 不接管槽位启动细节。

「Unity 没响应」(第 2/3 步失败)再分三种,处置不同。取证只读进程的 `Id` / `StartTime` / `Responding` / `MainWindowTitle` / CPU 时间,不打印进程命令行(主编辑器的启动参数里带访问令牌):
- **停在启动期对话框**:进程在、`Responding=True`、累计 CPU 时间不涨、不写 MCP 状态文件,`MainWindowTitle` 是对话框标题而不是「…<工程> - <场景> - <平台> - Unity …」(已见过 `Unity is running as administrator.`、`Recovering Scene Backups`;清单正本 = `槽位领取.ps1` `Get-UnityStartupDialogCatalog`)。领取与 `-StartUnity` 判出时回 `BLOCKED-UNITY-DIALOG`。处置:停下呈报 pid 与对话框标题,由用户本人在那个窗口上处置;不代点按钮、不发按键、不杀进程、不删 `Temp\__Backupscenes`。`Recovering Scene Backups` 在哪些情形下会出现(领取何时清掉场景备份、何时不清、没清成时打什么)见 `槽位领取.ps1` 头注「场景备份」段;备份里可能有没存盘的场景改动,留不留由用户在那个窗口上定。那个窗口可能被别的窗口挡住,VERDICT 里 `raised=no` 时提醒用户到任务栏找。标题不在清单里的同法取证后停下,报出标题以便补清单。
- **进程冻结**:`Get-Process Unity` 见 `Responding=False` → 编辑器无响应,人工重启。
- **桥会话未注册**(更常见):进程与 `mcp-for-unity` 桥都活、`Responding=True`,但 `mcpforunity://instances` 里无目标条目 = 编辑器未向桥注册会话、握手未完成,而非进程冻结。处置:人工在 Unity 端重连桥,而非盲目重启。

**会话侧拨号超时**(与上三种不同:会话启动时 UnityMCP 报 `CONNECT_TIMEOUT`、工具整批缺席,MCP 服务端与编辑器都活着):该连接器会话内重连不了,只能用户在 /mcp 里重连。不必停机等待——用 python 把用户级 MCP 配置里的同一条 stdio 服务端命令起成子进程,按 MCP stdio 逐行 JSON-RPC(`initialize` → `notifications/initialized` → `tools/call`)自己调 `set_active_instance` 与 `execute_code`;实例 id 用领取结果的 `mcp_instance`,`execute_code` 首行照旧置落点守卫。手拨的 MCP 服务端进程由本会话独占,其 `active_instance` 不被并发会话覆盖。手拨也初始化不了 = MCP 服务端真失效,回第 1 步的 `BLOCKED-UNITYMCP` 路由。

> **`Unity.ILPP.Runner` 不指示编译状态**:它是常驻复用进程、可跨天存活,不能据其存在判定编辑器「停在编译/域重载阶段」。判某改动是否已被编译见下方「槽位分工与占用」的落点守卫条;代码本身有无编译错误由交付闸的编译判,实现期不另起构建(见 `devflow-client` 卡「自检」节)。诊断编辑器「像是卡住」时先核一件事:改完代码若未显式 refresh,它不会自己重试编译——看着像卡死,实为无人触发。

> `active_instance` 是 MCP server 进程级全局共享的,第 1 步身份校验不可省。

## 槽位分工与占用

- **客户端自检不经 MCP、也不经编辑器**:槽位交付脚本调用 `客户端自检.ps1 -ProjectDir <槽位工程>`,不启动 Unity;执行形态与出口码语义见 `.claude/devflow/客户端自检.ps1` 头注。编辑器只用于实现期交互与自行确认编译。
- **交互只打当前通道的目标实例**(devflow 下 = 领取结果的槽位实例;主工程通道 = 主工程实例):id 按路径解析,`set_active_instance` 后使用。每个会话用前自绑,用完不恢复先前绑定:`active_instance` 全局共享,恢复会把并发会话刚绑好的实例改回去。
- **进 Play 直接到主界面**:本作单机、无登录,启动器进热更入口 `GameApp` 后直接开主界面,槽位与主工程同路,不需要测试号或调试开关;各编辑器之间也没有共用的账号状态可争。
- **落点守卫是唯一可靠防护**:`set_active_instance` 返回成功不等于后续调用落在该实例——多个同名槽位编辑器常并存,绑定被并发会话覆盖且不报错;逐调用传 `unity_instance` 经实测同样不生效,不能替代守卫。故 `execute_code` 每次首行置守卫:`Application.dataPath` 不含目标工程目录(devflow 下即目标槽位目录)即原样返回、不执行任何动作;命中失配即重绑重试,不绕过。
  - **守卫覆盖只读调用**,不只写操作:落到别的槽位的读会把别人的状态当本槽结论,比写错更难发现。
  - **加不了守卫的工具**(`read_console` / `manage_editor` / `refresh_unity` 等无 per-call 路由又不跑任意代码的)其返回值随时可能来自别的槽位,不单独作判定依据;要据其结果下结论,先用带守卫的 `execute_code` 确认当前落点,失配则重绑后重取。
  - **落错的不止返回值,还有副作用**:`refresh_unity` 的导入与编译、`manage_editor` 的状态切换都是**动作**,落到别的槽位就是「你以为触发了、目标槽位其实什么也没发生」。返回值那条防不住它——工具照常回成功,只是成功在别处。**首选不用它**:导入与编译在带守卫的 `execute_code` 里自己做(`AssetDatabase.Refresh(ImportAssetOptions.ForceUpdate)` + `CompilationPipeline.RequestScriptCompilation()`),守卫在首行,落点从源头保证。
    - 确实要用 `refresh_unity`(图它的 `wait_for_ready`,`execute_code` 同步返回给不了)时,**事后必跑一次带守卫的 `execute_code` 复验**:一验落点(`dataPath` 命中目标槽位),二验这次改动真的进了程序集(反射读新增的方法/字段/特性,不看 Console)。两者任一不成立 = 那次 refresh 落在别处,改用上一条在守卫内自做。
    - 复发依据见 .claude/devflow/rationale.md#refresh-unity-drift-evidence(本仓实测过一次)。
  - **能绕开路由的验证优先绕开**:文件系统读(Read / Grep 槽位磁盘)不受路由影响;判定「槽位是否已编译某改动」优先在守卫内用反射读程序集(方法签名 / 成员存在性),不依赖 Console 文本。编译中断时 `execute_code` 自身也编译不过、反射法随之失效,此时退用文件系统信号:比对 `Library/ScriptAssemblies/<程序集>.dll` 与源文件的时间戳,dll 缺失或滞后即未编译。
  - **调用只在目标槽位存在的类型须走反射,不直接 `using`**:守卫是运行期首行,而直接引用该类型会让代码在其它槽位**编译期**就失败——守卫根本没机会执行,失配表现成一条 "type does not exist" 编译错误而非守卫返回。经 `AppDomain.CurrentDomain.GetAssemblies()` 取类型再 `Invoke`,守卫才在失配时如常报出落点。

