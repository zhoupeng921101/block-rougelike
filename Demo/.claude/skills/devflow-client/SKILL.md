---
name: devflow-client
description: devflow 客户端实现段:在主工作树 Unity 工程实现功能。只由 devflow 主流程在 client 段用 Skill 工具调用;用户直接要求做客户端功能时进 devflow,不进本卡。
---

# devflow · 客户端实现段

基于简报在 Unity 工程实现功能,过自检后产出。无独立 test 角色、无用户手测,自检是提交前唯一自动拦截。工作根 = 主工作树 `Demo\`;自检与提交由主流程第三步执行。

## 输入

主流程第一步产出的 self-contained 简报即规格:**目的 + 需求与方案 + 用户视角验收点**。实现中的微观取舍以「目的」对准方向,不只对字面需求。

> 代码是单一事实源,简报调查摘要只作核实起点。需求层错且实现层绕不过的才回主流程第一步重审,不自改需求;与目的无关的界外发现只报不做(正本 = 主卡「范围承载不变量」)。

## 取篇 / 编码禁止事项(全部引用正本,不复制)

- **开工无条件 Read `.claude/rules-ondemand/tengine-conventions.md` 全篇**。TEngine 知识篇按 CLAUDE.md「TEngine 框架知识路由」表按任务类型取。
- 编码禁止事项唯一信息源:`.claude/rules-ondemand/tengine-conventions.md`「核心禁止事项」。
- 本段最高频两类落点(易漏,提醒查正本、不在此复述规则):①涉热更边界(程序集划分、`GameApp` 入口、启动器与 `Assets/Launcher`)→ `.claude/references/tengine/hotfix-workflow.md`(HybridCLR 暂关,热更分层照守);②写 MonoBehaviour(挂 GameObject 的表现组件 / UI Part)→ `.claude/references/tengine/ui-patterns.md` 的「Inspector 公开约定」「prefab 静态挂载优先」两节。

## 开工前

表现/UI 类落点(建 Text/Image/面板、选字体、用图集、加开关窗动画)先查工程既有构建设施(工厂/基类/公共配置,如 `GameLogic/Module/UIModule` 的 `UIModule` / `UIPanelMono` / `UIPartFactory`、`GameLogic/UI/VFX` 的开关窗动画、`GameLogic/UI/Common` 的 `CountdownBinder`),有则直接使用,不以引擎默认组件、内置资源重新实现设施已覆盖的功能。设施缺位时(如工程还没有业务用中文字体,`LauncherFont` 只给启动器)先补设施再用,不退回引擎内置资源。
> 理由见 .claude/devflow/rationale.md#reuse-project-ui-facilities

**新建 Part 的类文件与绑定归本段**(Part 类无生成器一档,ui 段只交节点树与节点清单):手写 `XxxPart.cs`(类声明 + `[SerializeField]` 字段 + `Awake()` 事件挂载,字段名与节点名逐字恒等)→ 等编译 → prefab 根挂该组件并跑菜单 `TEngine/UI 绑定/全量绑定并校验 UI prefab 引用`,以该菜单报出的空引用清单为绑定完整性的验收证据。交付闸 `UI绑定核对.ps1` 的 Part 档另核缺项 / 空引用(覆盖面与不覆盖面见其头注 Scope);报 MISSING 多半是窗里有该 Part 的解包副本:换成嵌套实例,不逐个补项。

经 UnityMCP 与编辑器交互时(确认编译、跑 Test Runner、读 Console),路由纪律与编译判定手段(落点守卫、反射读签名而非 Console)正本 = `unity-check` 卡「实例路由与落点」。

## 自检(提交前必过)

本段只完成实现,不执行 git 写。自审、客户端自检与提交由主流程第三步执行;自检 FAIL 回本段修复后重跑;处置分档与留痕义务正本 = devflow 卡「停机呈报」条。

**客户端自检口径**:`客户端自检.ps1` 各道均无违规(道次清单与各道职责正本 = `.claude/devflow/README.md`「检查」节,此处不枚举)。执行正本 = `.claude/devflow/客户端自检.ps1`;STALE 与出口码语义见其头注。

**自检会连带编热更程序集 GameLogic**(editor define 一套,再按 `PlatformDefinePolicy.json` 各出包平台 define 各编一遍运行时程序集(本作现只覆盖 Standalone),工具宏清单 `$ToolDefines` 非空时逐宏再编一遍(现为空);define 边界正本 = `客户端自检.ps1` 头注)。**实现期不另跑 `dotnet build`**:编译验证由自检承担;提交前要确认编译就看编辑器(判定手段见上节 `unity-check` 指针)。涉 IL 后处理(开热更后的 HybridCLR 注入)、asmdef 的平台与 define 约束、资产导入与派生物落定时,须回编辑器确认——这些 MSBuild 不做。

> **csproj 的 `<Compile>` 列表过期不用手动修**:自检的编译道编译前按磁盘实扫自行处理(做法见 `Editor程序集编译.ps1` 头注)。asmdef 的引用集或 define 变了(自检编译道的 INFRA 会点名;单独判定可跑 `.claude\devflow\重建csproj.ps1 -ProjectRoot <Demo> -Assembly <程序集>`,语义见其头注)须回编辑器重生成:在带首行落点守卫的 `execute_code` 里 `AssetDatabase.Refresh(ImportAssetOptions.ForceUpdate)`,首选不用 `refresh_unity`(例外与事后复验见 `unity-check` 卡「落错的不止返回值,还有副作用」条)。

本段保留的义务:

- **测试代码一律临时,工程不保留常驻测试套件;建测与否按需自行裁量**(「重开发轻测试」策略,理由见 .claude/devflow/rationale.md#light-test-policy):
  - **建不建**:验收点可枚举的纯逻辑实现优先建测;选择不建时,呈报按下条口径列「未执行验证的验收点」。
  - **申报口径:只列静态验证结构上够不到的**,三类——①**须清本地存档才能验收的改动**(字段退役、类型变更、结构重组使存量存档失配:清档动作由用户执行或授权);②**并发 / 时序路径**(异步加载、动画回调、退出重进接局);③**依赖出包或外部环境才显形的**(Windows Mono 包里的行为、IL 后处理、资产导入派生物)。常规功能点**不列**。空则整项省略。
  - **落点**:`Assets/Editor/Tests/`(已被 .gitignore 忽略,不入库、不进检查凭据)。
  - **谁跑**:自检不执行这些测试;建了测须自行在编辑器 Test Runner 跑一遍并把结果写进呈报。
  - **谁删**:客户端自检 PASS 后由主流程跑 `临时测试清理.ps1` 删除,未通过保留现场。
  - **例外:规则核心**(`Assets/GameScripts/HotFix/GameRules/`)的单测常驻入库,写进 `Demo/DotNet/Tests/`,由客户端自检的 `dotnet单测` 那一道跑;编码约束见 `tengine-conventions.md`「规则核心」。上面几条只管其余代码的临时测试。
- **含新增资产的提交先落定派生物**(触发 = `自审触发判定.ps1` 报 `ASSET-SETTLE: required`,判据在该脚本):先让活编辑器把资产导入收敛(sprite atlas 等派生物重序列化)再跑客户端自检;落定须发生在检查运行窗口之外,否则界外 churn 使检查判 STALE。

> 理由见 .claude/devflow/rationale.md#temp-test-delete-after-gate、.claude/devflow/rationale.md#newasset-settle-before-gate-premise
