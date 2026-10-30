---
name: devflow
description: 三段式开发主流程,产品代码与资产改动的默认入口。触发:改动落 Unity 工程 Demo/Assets 下的产品代码或资产时默认进入,或显式 /devflow 任务描述;走人工入库通道(Demo/.claude/ 下全部与 CLAUDE.md / 新游戏/ 设计文档 / 工程文件,范围正本 = CLAUDE.md「devflow 适用面」)的,不进本流程。
---

# devflow — 三段式开发主流程

`/devflow` 三步主流程:**需求审计 → 主工作树实现 → 自检提交**。单线开发:一次只做一个任务,直接在主工作树 `Demo/` 上实现,不开 worktree、不领槽位、不并行。Agent 负责需求判断、实现与提交前自审;检查与提交由 `客户端自检.ps1` 与 `单仓提交.ps1` 承载。本作没有服务端,脚本里的服务端通道按 flow-config `ServerDirName` 留空关闭。
> 理由见 .claude/devflow/rationale.md#single-tree-sequential

## 第一步:需求审计(理解需求 → 需求级方案)

要达成四件事:

1. **目的**:一句话回答「为什么做」,且不是需求复述。目的不明先问目的,不问细节。
2. **前提查证**:需求成立的前提(要加的东西是否已存在 / 现有行为来自哪里 / 玩法名词对应规则文档哪一节、代码哪个实体 / 落在规则核心、表现层还是 UI)对代码与 `新游戏/设计/3B核心规则.md` 坐实,结论附可 grep 复核的锚点;记忆里的实现状态先验只作线索,不采信。产物只含事实判断,不含实现级改法——改哪个类/方法由实现段现场推导,代码是唯一事实源。
3. **异议**:撞不撞规则文档与既有工程决策(`新游戏/工程计划.md`)、规则没写的机制是不是该先提规则改动(CLAUDE.md「产品设计基准」)、异常路径 / 存量存档失配后要不要清本地存档(判据见 CLAUDE.md「开发阶段无线上玩家」条)。只报有真实后果的问题,具体到文件/行为/后果;「无异议」是合法结论;措辞级意见不阻塞。
4. **裁定与出口**:只问审计产生的真疑问,能出选择题不出开放题。代决策边界照 CLAUDE.md「轻量无人值守」。其余实质异议 / 多种合理解读 / 难回退改动 → 阻塞呈报(附替代案)。审计干净或轻量选择已定 → 一句话通报「目的 + 方案」直通第二步。审计发现的缺口补进需求须向用户呈现,不静默扩需求。

**前序草稿**:输入是 `devflow-explore` 出口、经用户认可的简报草稿文件时,草稿里已裁决的议题不重问,锚点抽核即可。

**出口产物 = 简报(self-contained)**:目的 + 需求与方案(含用户裁决结论、代决策与模式例外,记法照 CLAUDE.md「轻量无人值守」;落表数值按「产品设计基准」标「待定标」)+ 用户视角验收点(只写照目的跑一遍看不出对错的可观测点,常规功能写「同目的」;"适当处理 X"类空话不算)+ 调查摘要(事实判断 + 锚点,「无」合法)。成文模板正本 = `.claude/devflow/templates/简报模板.md`。简报默认留在会话里;要交接给另一个会话或跨会话续接时落成文件,先跑 `.claude\devflow\简报校验.ps1 -BriefFile <文件>` 过结构机判。交实现段前自查无自相矛盾、无两读歧义、单轮装得下(装不下先拆解)。
> 理由见 .claude/devflow/rationale.md#brief-gate-machine-checked

## 第二步:实现(调子 skill)

按 target 用 **Skill 工具在会话内调用**对应实现段(不开新上下文),简报是唯一接口;子 skill 的工作流/禁止事项在其卡里,简报不复述。

**开工前**:看一眼 `git status`。主工作树上已有与本任务范围重叠的未提交改动(上一轮没收尾、或用户正在手改)时先呈报,不在别人的半成品上叠改。Unity 交互打主工程编辑器实例,绑定与落点纪律见 `unity-check` 卡。

**按 target 分派**(工作根 = 主工作树 `Demo/`):

- 含新 UI 窗口或 prefab 时先调 `devflow-ui` 搭 prefab + 生成绑定,再调 `devflow-client` 填业务逻辑;新建 Part 的类文件与绑定归 `devflow-client` 段(窗的类由生成器产,在 ui 段闭环)。
- 其余客户端代码与资产改动直接调 `devflow-client`。

**多任务**(用户单条消息派发多个任务):按派发顺序逐个走完整 devflow(审计 → 实现 → 自审 → 提交 → 呈报),一个提交完再开下一个;不拆子会话并行。

**实现段承载不变量:客户端业务代码只在 `devflow-client` 段内产生**——ui 段结束、「再来一轮」返工,凡接下来要写代码,一律先用 Skill 工具调 `devflow-client`,不在主流程语境里直接编码;改动小不豁免。装载面 = 实现前先 Read 对应实现段卡。

**范围承载不变量:简报目的 = 本轮改动范围上限**——范围以目的层界定,不以文件清单界定:任务派生的必要改动(改调用方、连锁编译修复、重命名波及)自由做、不申报;与目的无关的界外发现**只报不做**,不建持久挂账文件。唯一例外:本轮改动范围内文件上的一行级顺手修,须在 commit message 点名。新公共接口 / 新文件 / 新窗口类 / 新程序集超出微观取舍,回主流程补审或在呈报标注为简报外新增。
> 理由见 .claude/devflow/rationale.md#out-of-scope-no-gate

**升级通道**:实现段查证确认需求层错误且实现层绕不过 → 回第一步重审(带上查证),实现段不越界自改需求。

## 第三步:自审 → 自检 → 提交 → 呈报

1. **自审**:实现完成后先跑 `.claude\devflow\自审触发判定.ps1 -ProjectDir <仓根>\Demo -MessageFile <提交信息>` 取本轮触发项(判据正本 = 该脚本头部判据表及其所指,卡内不复述;脚本除 INFRA(exit 2)外恒 exit 0,`required` 项按下面处置)。改动面 = 主工作树相对 HEAD 的全部未提交改动,含别人留下的;不属于本轮的命中项在呈报里说明跳过。再做:
   - 两项轻核对(恒做):①改动是否越出简报目的(简报外改动须已点名);②修复类改动的根治/补丁定性(定义见 CLAUDE.md「修复前先定性」):`FIX-QUALIFY: required` 时按脚本输出补进提交正文(`单仓提交.ps1` 同判据拒绝,缺则 `DENIED-qualify`)。
   - 目视核对(`UI-EVIDENCE: required` 时):提交前在编辑器按 devflow-ui 卡「目视自检证据」的开窗方式实看改动节点,位置与层级(谁盖住谁)都核;只读坐标判不出遮挡。
   - **合并丢失核对**(本轮以 merge 落地时,如同步上游、升级第三方框架):跑 `.claude\devflow\合并丢失核对.ps1 -Merge <合并提交> [-RepoDir <仓>]`,逐条确认是有意裁决还是真丢失;真丢失补回并在提交信息写明(FAIL 语义见脚本头注)。
   - 安全审查(`SECURITY-REVIEW: required` 时):按 [references/security-review.md](references/security-review.md) 手工审本轮 diff,脚本列出的命中文件是起点不是终点,定级与处置见该清单。不调内置 `/security-review`。
   - 按需篇核对(`RULES: required` 时):逐篇 Read,对照本轮 diff 核一遍其条款(专项深审仍归下条的每日审查);判为不适用的篇在呈报写一句理由。
   - 正确性审查不在提交前跑:由用户手动 `/daily-code-review` 承载(程序正本 = `.claude/skills/daily-code-review`)。
   > 理由见 .claude/devflow/rationale.md#security-review-cwd-locked、.claude/devflow/rationale.md#correctness-review-to-nightly、.claude/devflow/rationale.md#rules-named-by-script
2. **自检**:`.claude\devflow\客户端自检.ps1 -ProjectDir <仓根>\Demo`。含新增资产的先等编辑器导入收敛再跑(见 devflow-client「含新增资产」条)。PASS 后若本轮建过临时测试,跑 `.claude\devflow\临时测试清理.ps1 -ProjectDir <仓根>\Demo`;非 PASS 按「停机呈报」办,修完重跑自检。
3. **提交**:`.claude\devflow\单仓提交.ps1 -PathListFile <本轮改过的文件清单> -MessageFile <提交信息>`。清单只列本轮改动(路径以仓根为基、带 `Demo/` 前缀,每行一项,UTF-8 文件),**禁 `-All` 与全选提交**:主工作树上常有用户或别的会话的未提交改动。不推送;推送由用户自己决定。
   - **提交主题格式**(机器校验):首行 `【动词】范围: 描述`,无范围时 `【动词】描述`,方括号是全角【】。动词只取七词,写别的当场 `DENIED-subject`(判定正本 = `.claude/devflow/hooks/校验库.ps1` `$script:SubjectRe`):**新增**(目标行为此前不存在)/ **修复**(原来是错的)/ **变更**(原来没错,有意改口径、数值、外观、文案)/ **重构**(外部行为不变)/ **删除** / **配置**(非业务面的工程设施)/ **文档**。描述段要能独立说清改了什么。
   - **正文**写为什么这么改、放弃了哪些方案、根治还是补丁;白名单标注见「禁止事项」。
   > 理由见 .claude/devflow/rationale.md#no-staging-path-commit
4. **呈报交接**:只写 commit message 没有的信息——提交主题一行(挂 `-MessageFile` 文件链接)、待执行验证点(口径正本 = devflow-client「申报口径」)、待裁定项(未完成项 / 待定标数值 / 安全审查存疑 / 简报外改动 / 界外发现)、RULES 点名而判不适用的篇(各一句理由)。`UI-EVIDENCE: required` 时附目视证据(正本 = devflow-ui 卡「目视自检证据」)。
   > 理由见 .claude/devflow/rationale.md#report-exception-only

**停机呈报**:`客户端自检.ps1` 按出口码处置——`0` PASS 往下走,`1` FAIL 按下面 `judge` 办,`3` STALE(检查期间树变了)重跑一次、再 STALE 转 `halt`,`2` INFRA 按 `halt` 办。`单仓提交.ps1` 的处置档位由末行 `VERDICT:` 尾部 `next=` 字段给出,按字段照做,不另比对类别清单(判据正本 = `.claude/devflow/hooks/hook函数库.ps1` `Get-VerdictNext`):

- `next=go` —— 成功,继续往下。
- `next=fix-retry` —— 确定性可修:按返回点名修**输入文件**(提交信息 / 清单)后重跑一次,二次仍败转 `halt`;呈报留痕首跑失败与修复。
- `next=judge` —— 根因自明(自检道次点名具体违规、修法无歧义)按 `fix-retry` 办,不自明按 `halt` 办。
- `next=halt` —— 立即停下,呈报返回原文、失败现象与建议处置,等用户指示;不自行重试、重调或循环。
> 理由见 .claude/devflow/rationale.md#deterministic-fail-one-retry

**git 规则**:检查与提交只经 `客户端自检.ps1` + `单仓提交.ps1`;不手打 `git add` / `git commit`、不绕脚本、禁 force push、不推送。义务台账见 `.claude/devflow/obligation-ledger.md`。

## 四类归因(合并后缺陷)

需求属「修一个已提交的缺陷」时,修复前按 [references/defect-attribution.md](references/defect-attribution.md) 归因,修法与修复同轮落地,呈报必含归因结论。同类问题第二次出现必经本节。

## 再来一轮

用户看呈报/diff 不满意 → 反馈作为新简报回第二步;反馈动到需求本身 → 回第一步重审。不设自动轮次上限。被阻塞时改动保留在主工作树未提交,等待处置。

## 禁止事项

- 新增本地持久化调用(PlayerPrefs / 文件写)须提交信息带「[本地白名单:理由]」,由提交校验机判。这条随 block-client 搬来、立条前提是服务端权威,本作单机下的去留待裁定(见义务台账同名行),裁定前照写标签。接入 Luban 后,改表源须同步字段说明(无字段语义变化时提交信息带「[表文档无关:理由]」),同样机判。
- 不建仓内过程状态文件、不写 design-docs;续接依据在 git 与会话简报;`.claude/devflow/rationale.md` 记录工作流设计理由,不受本条约束。玩法规则与工程计划的改动走 `新游戏/` 下的设计文档(人工入库通道),不是本条所指的过程状态文件。
