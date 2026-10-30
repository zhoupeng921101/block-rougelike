---
name: playtest
description: AI 验收跑测:在 Play 模式真实操作游戏、核对功能是否达成目标。触发:用户要求在编辑器里实测 / 验收 / 自行测试已交付的功能,或显式 `/playtest <验收目标>`。只观察与报告,不改产品代码。
---

# playtest — AI 验收跑测

代替人工「开编辑器点一遍确认效果」。经 `execute_code` 调用 Editor 侧代理 `AutoTestAgent`,在 Play 模式注入真实指针事件、回读结构化状态。

**代理尚未搬入本作**:`Assets/Editor/AutoTest/AutoTestAgent.cs` 目前不存在,下文接口表是 block-client 版代理的形态。搬入走 devflow(Editor 代码),盘面类接口按 3B 规则核心重写、业务专属接口删掉;搬入前探针恒返回 `AGENT_MISSING`,处置见「落点守卫」。

**边界**:本卡只验收,不改产品代码。发现问题 → 报告 + 只读定位到嫌疑 `file:line`,修复另走 devflow。验收结果不进交付门。

**触发面**:用户要求在编辑器里实测 / 验收 / 自行测试时装载本卡,或显式 `/playtest <验收目标>`。有本卡代理时不另手搭驱动(反射调按钮 `onClick`、直调落子入口)——那样绕过 EventSystem 射线与拖拽手势,点击 / 拖拽类验收点测不到,截图也拿不到。交付收尾等场景用户没要求实测的,至多在呈报中提示可跑,不自行开跑。

**一次性**:验收脚本随需求变,不沉淀用例库、不建常驻测试资产。

## 目标实例:恒主工程

**只在主工程跑**,无提交动作(本卡不写产品代码,不属 devflow 适用面)。

固定在主工程使守卫判别串恒为 `block-rougelike/Demo`。本作单机、无登录,进 Play 即从启动器走到主界面,没有账号或服务端要核。

## 开跑前(四项核对,缺一不跑)

1. **被验改动已交付到主工程** — 验收目标涉及的代码 / 资产须在主工程定位得到(grep 关键符号或文件)。定位不到 → **停下提醒用户「该改动不在主工程里,现在验会跑在旧代码上」,等指示**。在旧代码上验收会得出「功能不存在 / 没生效」的假结论,比跑不起来更有害——后者一眼可见,前者会被当成真实缺陷上报。
2. **编辑器已编译到最新** — 源码定位得到不等于编辑器在跑它:编辑器未 refresh 时程序集停在旧版本,同样得出假结论。比对 `Library/ScriptAssemblies/GameLogic.dll` 与 `Assets/GameScripts/HotFix` 下最新 `.cs` 的修改时间,dll 较旧 → 非 Play 时在带守卫的 `execute_code` 内 refresh + 请求编译(做法与落点纪律见 `unity-check`「实例路由与落点」),等 dll 时间更新、再用反射确认被验改动的符号在程序集里,才进 Play。
3. **落点与代理可用性** — 见下节守卫探针。
4. **Play 与走帧** — 代理各接口在非 Play 模式返回 `ok:false, reason:"不在 Play 模式"`。进 Play 后读 `EditorApplication.isPaused` 与间隔两次的 `Time.frameCount`:暂停(Error Pause 或手动暂停)时接口照常返回、游戏却不走帧,表现为「操作了没反应」;处于暂停则置 `isPaused = false` 再继续。之后「连续无进展」时先复查这两项,再判卡在业务上。没到目标界面时先报告现状、请示是否代为操作。

## 落点守卫(每次 execute_code 首行)

多个编辑器并存时 MCP 落点会失配,机制与守卫纪律正本见 `unity-check` 卡,本卡不复述。两条本场景要点:

**判别串恒为 `block-rougelike/Demo`,斜杠不可省**:各工程根互为前缀,`Contains("block-rougelike")` 对旧槽位 worktree `block-rougelike-dev2` 同样为真、守卫形同虚设,验收会静默跑在别的副本上。

**首次调用**用纯反射探针,确认落点与代理都就位。不可直接 `using` 该类型——目标工程之外编译期即失败,守卫来不及执行(理由见 unity-check「调用只在目标槽位存在的类型须走反射」):

```csharp
if(!Application.dataPath.Contains("block-rougelike/Demo")) return "WRONG_INSTANCE:"+Application.dataPath;
var t = System.AppDomain.CurrentDomain.GetAssemblies().Select(a=>a.GetType("AutoTestAgent")).FirstOrDefault(x=>x!=null);
return t==null ? "AGENT_MISSING(该工程尚未同步代理代码)" : "OK "+Application.dataPath;
```

返回 `AGENT_MISSING` → 停下报告,建议先经 devflow 搬入代理。用户要求先看一眼的,只做非交互验收(带守卫的 `execute_code` 反射读状态 + 截 Game 视图),点击 / 拖拽类验收点一律列入「未验证」。

**探针通过后**可直接调用,守卫仍每次首行置:

```csharp
if(!Application.dataPath.Contains("block-rougelike/Demo")) return "WRONG_INSTANCE:"+Application.dataPath;
return AutoTestAgent.Snapshot();
```

代理每个返回都带 `dataPath`,是守卫之外的第二道:**每次读结果先扫一眼它指向哪个工程**,不符即重绑重取,该轮结论作废。

## 调用契约

`execute_code` 用 codedom 编译,**C# 6 语法上限** —— 不可用 `out var`、模式匹配、局部函数、`switch` 表达式;LINQ 与字符串插值可用。代理接口全部收基元类型参数、返回单个 JSON 字符串,调用侧无需构造对象。

下表列接口名与用途备查,**签名正本 = `Assets/Editor/AutoTest/AutoTestAgent.cs`**(搬入后);参数个数或行为存疑时以源码为准,不以本表为准。

| 接口 | 用途 |
|---|---|
| `Snapshot()` / `Snapshot(nameContains)` | 窗栈 + 可交互控件清单(id/类型/文本/interactable/reachable/屏幕矩形)。控件常有数十个,**优先带 `nameContains` 收窄** |
| `Detail(id)` | 单控件全量,含层级路径与组件清单 |
| `Click(id)` | 注入点击 |
| `Drag(id, toX, toY, steps)` | 注入拖拽到屏幕点 |
| `Board()` | 战斗盘面 + 候选块各朝向的合法落点(搬入时按 3B 规则核心重写) |
| `Place(slot, col, row, rot, steps)` | 按格按朝向落子;`rot` 取 `Board()` 里的朝向号,-1 = 当前朝向,不同时注入点击转块 |
| `Read(typeName, memberPath)` | 现场读任意业务状态,如 `Read("<窗类名>","<字段>.<成员>")` |
| `Logs(sinceSeq, errorsOnly)` | 取 `sinceSeq` 之后的日志。每个返回都带当前 `logSeq`,下轮传回即得增量 |
| `Shot(fileName)` | 截 Game View 到工程根 `Captures/`,返回绝对路径 |

### 三条接口层注意

- **控件 id 不跨 UI 重建有效**:窗重开后 id 全变,`Click` 会返回「控件 id 不存在」。每次窗切换后重取快照,不缓存 id。
- **拖拽三段在单次调用内走完**:注入的按住状态不跨调用留存,分两次调用时业务侧会在间隙复位。`Drag`/`Place` 已封装,自行拼拖拽时须遵此。
- **截图有一帧延迟**:`Shot` 返回时文件可能未落盘。再调一次任意接口过帧后再 Read 该路径。

## 状态读取

代理只预置高频快照。需要的字段没有 → 用 `Read(typeName, memberPath)` 现场取,**不为此改代理代码**。`memberPath` 支持点号逐级下钻,私有字段可直接取。

**数据类验收点以规则核心的状态为准**(分数、牌库、货币等),界面文本只是它的投影,可能滞后或被表现层动画延迟刷新。

**中间产物恒落 `E:/block-rougelike/playtest/`**:验收中 dump 出来的日志切片、prefab 探针输出等写这个目录(已在仓根 `.gitignore`),**不写仓根**——写仓根会在 `git status` 里显形、被后续交付预检当成未提交改动。截图不适用本条,`Shot()` 自有落点 `Captures/`。

## 操作纪律

- **存档默认沿用当前本地存档**。需要干净存档(验首次运行、当前存档正被用户使用)时停下请示:清本地存档由用户执行或明确授权后再做(CLAUDE.md「沟通与协作」)。用户正在玩的存档不跑——两边同时改档,结论分不清是谁造成的。
- **调试命令**:本作还没有调试命令集。代理搬入后若带,加资源、解锁类可自行执行以把存档推到待验状态;删档类停下请人工操作。
- **单轮上限 40 步**(一步 = 一次 `Click` / `Drag` / `Place`);**连续 3 步无可观测变化即停**并报告卡在哪一步。
- **长流程目标**(整局循环、多关推进这类要数百步的):有调试命令时先推到待验节点附近,只在节点前后实操;仍超 40 步的分轮跑,每轮末写一行进度(步数 + 关键数值前后值)再续下一轮,硬停点照旧。经调试命令快进跳过的环节在回报里列入「未验证」,不写通过。
- **硬停点(命中即停,报告后等指示)**:① 需要不可逆操作才能继续;② 出现**新的** Error/Exception——进到待验界面、第一步操作之前,用 `Logs(0, true)` 取一次已有错误作基线,之后只有首行文本不在基线里的才算新,同文案重复出现不算(回报里列出基线条目);③ 连续无进展。

## 回报格式

**结论 + 逐条证据**,每条验收点独立成行,证据是接口返回的实际字段值或截图,不是复述操作过程。

**证据等级强制标注**(不带标注 = 实际读到,达不到该档前置 [推断] / [猜测]):

- 只有实际读到预期状态变化才写**不带标注的「通过」**;凭接口返回推断的写 **[推断]**,没有直接证据的写 **[猜测]**。
- **「没看到报错」不得写成「验证通过」** —— 未观察到失败信号不等于功能达成;此时如实写「未观察到 X,但未直接验证 Y」。
- 未能验到的验收点单列「未验证」,写明卡在哪。

**本轮状态变更强制披露**(防当前存档被渐进污染):列出执行过的全部调试命令、落子等改变存档的操作,以及关键数值的前后值。验收目标达成与否,这段都要有。

**关键节点截图**:进入待验界面、操作后、最终态各一张,随结论附上。
