# CLAUDE.md

## 项目结构
- 单仓 block-rougelike:Unity 工程在 `Demo/`(TEngine 框架,主工作目录,会话在这里开);本作是单机买断制,**没有服务端仓**(devflow 的服务端通道按 `.claude/devflow/flow-config.psd1` `ServerDirName` 留空关闭)。仓里另有研究层 `参考/`、`复刻/` 与设计层 `新游戏/`,三层分工与协作约定见仓根 `AGENTS.md`;devflow 只管 `Demo/`。
- Unity 实例:单线开发,devflow 任务直接在主工作树 `Demo/` 上做(不开 worktree、不并行);UnityMCP 绑主工程编辑器实例(实例名形如 `Demo@<hash>`,按工程路径认)。新资产先等编辑器导入与派生物落定,再跑客户端自检。流程见 `devflow` skill;绑定异常见 `unity-check` skill。
  > 理由见 .claude/rules-archive/rules-rationale.md#no-isolated-unity-copy
- 构建入口:`.claude/devflow/客户端自检.ps1`(道次清单正本 = `.claude/devflow/README.md`「检查」节,此处不枚举;静态扫描各道 + 末道真编译,需要 dotnet SDK、不启动 Unity;编译的覆盖面与其 define 边界、以及不在覆盖内的测试,见 `devflow-client` 卡「自检」节)。devflow 通道由 Agent 在提交前直接调用。出 Windows 包走菜单 `3B/出 Windows 包`(`WindowsBuild.Build`)。

## 产品设计基准

- 玩法规则正本 = `新游戏/设计/3B核心规则.md`;立项裁定与工程路线 = `新游戏/工程计划.md`。规则里没写的机制,先在规则文档提出改动并写明取舍,不在代码里自定。
- 参考作品(Balatro、Brotato、Block)的研究结论在 `参考/结论/`,引用时带上游戏与版本;**Block 不是肉鸽**,借它的做法先说明目标差异(见 `AGENTS.md`「研究与回答原则」)。`复刻/` 的代码不搬进 Demo。
- 数值一个都还没定标:要落表的数值按规则文档与参考结论折候选,标「待定标」并在收尾汇总,不阻塞。
- 美术沿规则 §8 草图的太空像素风,新图走 AI 出图(`chatgpt-image` skill)或工程自有素材;参考作品的拆包素材(`参考/产物/`、`复刻/` 里用到的原作资源)一律不进 Demo。

## TEngine 框架知识路由

回答或查证 TEngine 框架**怎么用**(API 用法、生命周期、资源与事件规约、热更边界)时,事实源是下表篇目,不直接扫 `Assets/` 框架源码推导用法。本工程**业务现状**(某功能有无、数值多少)事实源是代码,直读。下表未覆盖或与代码存疑才读源码。本条覆盖裸会话问答,不限于 devflow 内。

篇目目录 = `.claude/references/tengine/`。写/改客户端 TEngine 代码时另遵 `.claude/rules-ondemand/tengine-conventions.md`:按下表取篇 → 编码 → 自检;编码红线见其「核心禁止事项」节,命名空间与程序集归属规约同在该文件。**注释规约见其「注释准入」节**。

| 任务类型 | 必读文档 | 进阶文档 |
|---------|---------|---------|
| UI 开发 | ui-lifecycle.md | ui-patterns.md |
| 事件系统 | event-system.md | event-antipatterns.md |
| 资源加载 | resource-api.md | resource-patterns.md |
| 模块使用 | modules.md | — |
| 热更代码 | hotfix-workflow.md | — |
| 代码规范 | naming-rules.md | — |
| Luban 配置 | luban-config.md | — |
| 项目结构 | architecture.md | — |
| 问题排查 | troubleshooting.md | — |
| MCP 场景/GO/UI/脚本/Editor | mcp-tools.md | — |
| MCP 材质/Shader/动画/VFX | mcp-visual.md | — |

本作的工程形态与这些篇目的出入(它们写于 block-client):热更程序集只有规则核心 `GameRules`(纯 C#)与业务层 `GameLogic` 两个,没有底座层 `GameBase`、联网层与登录启动管线,UI 框架(UIModule / UIPanelMono)在 `GameLogic/Module/UIModule`;HybridCLR 暂关、Windows 走 Mono;Luban 尚未接入。以 `新游戏/工程计划.md`「阶段 1 落地时定的」为准。

## 按需规则路由

触及下表场景时先 Read 对应篇再动手。篇目目录 = `.claude/rules-ondemand/`,各篇头部「适用」节是命中与否的最终判据。

| 触发场景 | 必读篇 |
|---------|-------|
| 新增或修改供他人调用的工具、脚本入口、公开 API | tool-usage-doc.md |
| 写持久文档 | file-conventions.md |
| 写或改 `.claude` 下脚本 | script-authoring.md |
| 新增或修改常驻指令 | rule-authoring.md |
| 新增或改动全屏拦截层:遮罩、闸窗、引导遮罩 | ui-blocking-layer.md |
| 新增、替换或搬动 UI 图片;给节点接按名换图 | ui-image-assets.md |

## 沟通与协作
- 评估提案:反对意见具体到文件/行为/后果;「没发现问题」是合法答案。
- **开发阶段无线上玩家,设计缺陷在结构上改**:该改数据结构就改、该退役字段就退役、该删旧分支就删,不写兼容层、不留双读双写、不为旧数据保留废弃字段或死代码。「会让已有存量存档失配」不构成保留次优设计的理由。两条边界:①**清本地存档这个动作本身**须在呈报里点名,由用户执行或明确授权后再做,不自行清(用户可能正在该存档上验收);②新结构自身的正确性要求不放松(字段缺失与零值的区分、首次运行显式写入、时间锚初值)。
- 修复前先定性(根治/补丁):判据 = 同类问题换个地方再发生,这个修复是否仍有效。补丁须声明并写明根源(未知标注未知);同类问题第二次出现禁止再补,须根因分析、在源头修。只在出包运行时显形的缺陷(原生崩溃、热更加载等),未在该环境取得「改前复现、改后不复现」的对照前,成因只算假设:定性照上述判据给出并附「成因待实测」,不据此加构建闸、机判或把因果写成注释断言。
  > 理由见 .claude/rules-archive/rules-rationale.md#device-only-cause-unverified
- 裁定项结构化:先按下节「轻量无人值守」判断是否需要用户裁定;仍需裁定的离散选项用 AskUserQuestion(或当前环境的提问工具)收齐互不依赖的项,附推荐选项与理由,不写成长文末尾的开放问题。
- 规范性反馈(以后必须/禁止怎么做)落规则文档——已有条款在管则改那份,没有则新建;不落记忆。记忆只收偏好与线索类反馈。

## 轻量无人值守

- **默认开启**:本项目所有任务默认使用轻量无人值守,无需用户额外声明。代决策仅限各任务已授权范围,不自动扩展任务。用户可随时关闭或收窄授权,按其指定范围和期限执行;未指定期限的关闭仅限当前任务,新任务恢复默认。交接或跨会话续接时,将用户对本任务的关闭或收窄要求记入简报「需求与方案」,以用户最新指示为准;没有例外要求即按默认模式。
- **可代决策范围**:目标和验收标准明确,且选择同时满足已授权范围内、影响局部、容易撤回时,Agent 自行决定并继续;有现有规范或实现依据的沿用,无先例的(如效果图未定的间距、层级、切图取用)也自行定,收尾列出所定项与依据。适用命名、文件组织、沿用既有惯例及不改变验收结果的局部实现选择;有多个合格方案时选影响小、撤回成本低的方案。改动行数少或主观信心高不构成授权依据。
- **保留裁定边界**:改变玩法规则、数值、数据归属、需求范围或验收标准,以及清本地存档、覆盖他人改动、真实合并冲突,均不由本模式代为授权;已有明确授权按其范围执行。数值例外:按「产品设计基准」折的候选数值可先落表,标「待定标」并在收尾汇总,不阻塞;规则文档没写的新机制、新资源种类仍属改变玩法。其他规则明确要求用户确认的动作,仅在该规则显式接入本模式时才可代决策。devflow 通道、检查、重试次数与 `next=halt` 停机契约照旧,工具权限也不因开启本模式扩大。
- **呈报与阻塞**:轻量选择不逐项询问或播报;收尾只汇总影响用户理解或后续维护的代决策及依据,简报里与用户裁决区分标注。需要裁定时按「裁定项结构化」收齐问题;等待期间可继续不依赖该答案且不受停机契约约束的已授权工作,不默认用户沉默为同意。

## devflow 适用面
- **产品代码与资产 → 默认 `/devflow`**(需求审计 → 主工作树实现 → 自检提交)。范围 = `Demo/Assets/` 下的代码与资产、prefab、(接入后的)Luban 表与生成物。需求明确时压缩的是审计深度,不是通道。在主工作树实现;收尾跑客户端自检并 PASS → `单仓提交.ps1 -PathListFile` 清单式提交;不推送。**一次只跑一个任务**。
- **人工入库通道**:范围 = `Demo/.claude/` 下全部 + 本 CLAUDE.md、`新游戏/` 下的设计文档、工程文件(工程配置:`Demo/ProjectSettings/`、`Demo/Packages/`、asmdef / asmref;单独改动走本通道,作为产品功能一部分一并改的随该任务走 devflow)。在主工程直接改,改完 `单仓提交.ps1 -PathListFile <本次改过的文件清单> -MessageFile <提交信息>` 提交,不推送;**仓根是 block-rougelike,清单路径要带 `Demo/` 前缀**。改动落在客户端自检读取面(正本 = `.claude/devflow/hooks/校验库.ps1` `ClientGateScanSurface`)的先跑客户端自检并 PASS。**清单只列本次改过的文件,禁 `-All` 或全选提交**:主工作树常有并发会话的进行中改动。
- `参考/`、`复刻/` 与仓根 `AGENTS.md` / `README.md` 不归 devflow,按 `AGENTS.md` 的约定改。无仓内写入的工作(问答、只读调查、scratchpad 临时件)不涉本条。
  > 理由见 .claude/rules-archive/rules-rationale.md#main-repo-channel
- 检查与提交只经 `客户端自检.ps1` 与 `单仓提交.ps1`;`单仓提交` 按末行 `VERDICT:` 尾部 `next=` 字段处置,不自行归类:`halt` 立即停下,呈报原文与现场,等用户指示;`fix-retry` 修输入文件重跑一次;`judge` 先做一次会话判断再定续走或转 `halt`;自检按出口码处置(各档见 devflow 卡「停机呈报」)。
  > 理由见 .claude/rules-archive/rules-rationale.md#verdict-stop-await-user
- 推送由用户自己决定,Agent 不推。
