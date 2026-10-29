---
name: devflow
description: 三段式开发主流程,产品代码与资产改动的默认入口。触发:改动落 Unity 工程 Demo/Assets 下的产品代码或资产时默认进入,或显式 /devflow 任务描述;走人工入库通道(Demo/.claude/ 下全部与 CLAUDE.md / 新游戏/ 设计文档 / 工程文件,范围正本 = CLAUDE.md「devflow 适用面」)或用户显式指定主工程通道的,不进本流程。
---

# devflow — 三段式开发主流程

`/devflow` 三步主流程:**需求审计 → 槽位实现 → 槽位交付**。Agent 负责需求判断、实现与交付前自审;槽位同步、编辑器与 UnityMCP 启动、检查、提交、推送、合并均由两个入口脚本承载。所有 devflow 任务都在固定槽位池内落地;多任务可经子会话并行(见第二步「并行分派」)。本作没有服务端,脚本里的服务端通道按 flow-config `ServerDirName` 留空关闭。

## 第一步:需求审计(理解需求 → 需求级方案)

要达成四件事:

1. **目的**:一句话回答「为什么做」,且不是需求复述。目的不明先问目的,不问细节。
2. **前提查证**:需求成立的前提(要加的东西是否已存在 / 现有行为来自哪里 / 玩法名词对应规则文档哪一节、代码哪个实体 / 落在规则核心、表现层还是 UI)对代码与 `新游戏/设计/3B核心规则.md` 坐实,结论附可 grep 复核的锚点;记忆里的实现状态先验只作线索,不采信。产物只含事实判断,不含实现级改法——改哪个类/方法由实现段现场推导,代码是唯一事实源。
3. **异议**:撞不撞规则文档与既有工程决策(`新游戏/工程计划.md`)、规则没写的机制是不是该先提规则改动(CLAUDE.md「产品设计基准」)、异常路径 / 存量存档失配后要不要清本地存档(判据见 CLAUDE.md「开发阶段无线上玩家」条)。只报有真实后果的问题,具体到文件/行为/后果;「无异议」是合法结论;措辞级意见不阻塞。
4. **裁定与出口**:只问审计产生的真疑问,能出选择题不出开放题。代决策边界照 CLAUDE.md「轻量无人值守」。其余实质异议 / 多种合理解读 / 难回退改动 → 阻塞呈报(附替代案)。审计干净或轻量选择已定 → 一句话通报「目的 + 方案」直通第二步。审计发现的缺口补进需求须向用户呈现,不静默扩需求。

**前序草稿**:输入是 `devflow-explore` 出口、经用户认可的简报草稿文件时,草稿里已裁决的议题不重问,锚点抽核即可。

**出口产物 = 简报(self-contained)**:目的 + 需求与方案(含用户裁决结论、代决策与模式例外,记法照 CLAUDE.md「轻量无人值守」;落表数值按「产品设计基准」标「待定标」)+ 用户视角验收点(只写照目的跑一遍看不出对错的可观测点,常规功能写「同目的」;"适当处理 X"类空话不算)+ 调查摘要(事实判断 + 锚点,「无」合法;多任务或有其他占用槽位时另起 `## 改动范围` 段列预计触碰的目录,供领取入口重叠比对,标「调度参照,非范围承诺」)。成文模板正本 = `.claude/devflow/templates/简报模板.md`(段标题即 `简报校验.ps1` 在领取入口的机判面);交实现段前自查无自相矛盾、无两读歧义、单轮装得下(装不下先拆解)。
> 理由见 .claude/devflow/rationale.md#brief-gate-machine-checked

## 第二步:实现(调子 skill)

按 target 用 **Skill 工具在会话内调用**对应实现段(不开新上下文),简报是唯一接口;子 skill 的工作流/禁止事项在其卡里,简报不复述。

**领取槽位(先于 target)**:调用 `.claude\devflow\槽位领取.ps1 -Topic <主题> -BriefFile <简报文件> [-PathsFile <路径清单文件>] [-Slot <N>] [-NoUnity]`。脚本内部行为不由 Agent 重做或逐步复核。

- 清单与简报走文件(shell-conventions·文本走文件);清单路径以仓根为基、带 `Demo/` 前缀。简报落入 claim 占位提交 body 作跨会话续接源。
- **免启 `-NoUnity`**:本次不会新增文件、不动 prefab、不需要编辑器才产出的派生物时传(只改已有 `.cs`)。新增任何 `Assets/` 下文件不能免启(`.meta` 由编辑器生成)。领取输出 csproj 须编辑器重生成的 WARN 时(此时 `-NoUnity` 不生效,判据见 `槽位领取.ps1` 头注),按 WARN 在槽位编辑器重生成 csproj 再实现。转需编辑器时调 `槽位领取.ps1 -StartUnity -Slot <N>` 补就绪,**不重领**(重领会 reset 未提交改动)。
- **选槽**:Agent 不选槽,由脚本承载;`FULL` = 池满,换 `-NoUnity` 也领不到。槽位首次领取超出就绪等待窗口回 `BLOCKED-UNITYMCP`(next=halt)不是槽位坏了:呈报注明首次导入未完成,经指示后重跑同一入口。`BLOCKED-UNITY-DIALOG`(next=halt)= 槽位编辑器停在启动期对话框上等人处置:呈报照抄 `pid` / `dialog` / `need` 三个字段,不代点按钮、不杀进程、不删场景备份(处置见 `unity-check` 卡「边界」),用户处置后经指示重跑同一入口。
- **返回处置**:`ACQUIRED` 返回槽位根、Unity 工程根与 UnityMCP 实例 id 后开工,其上方「开工前读」点名的篇先 Read;其余按末行 `next=` 处置(见「停机呈报」)。
- **放弃 `-Abandon -Slot <N>`**:丢弃该槽全部领先提交与 tracked 改动、清看板行,回 `ABANDONED`。不可逆,**只在用户明确授权放弃该槽后调用**;用于交付走不下去、决定在新基线重做(不放弃的话同范围重领会 `QUEUE` 到这个槽上死等)。形态与判据见 slot-protocol「主动收槽」。

**按 target 分派**(工作根 = 槽位 Demo):

- 含新 UI 窗口或 prefab 时先调 `devflow-ui` 搭 prefab + 生成绑定,再调 `devflow-client` 填业务逻辑;新建 Part 的类文件与绑定归 `devflow-client` 段(窗的类由生成器产,在 ui 段闭环)。
- 其余客户端代码与资产改动直接调 `devflow-client`。一个槽位承载整个任务。

**并行分派**(经子会话;会话机制、分组、消息约定与 QUEUE 处置正本 = slot-protocol「并行分派与 QUEUE 处置」):

- **多任务**(用户单条消息派发多个任务):本会话当协调者,范围重叠或碰同一串行资源的任务归一组、组内串行;分出两组以上时每组开一个子会话,各领一个槽位走完整 devflow(审计 → 实现 → 自审 → 交付 → 呈报)。
- **单任务不拆**:UI 段与客户端段共用槽位编辑器,客户端改 `.cs` 触发的编译会打断 UI 段在同一编辑器上的 MCP 搭建与按名绑定,两段顺序做。
> 理由见 .claude/devflow/rationale.md#parallel-subsession-dispatch

**实现段承载不变量:客户端业务代码只在 `devflow-client` 段内产生**——ui 段结束、「再来一轮」返工,凡接下来要写代码,一律先用 Skill 工具调 `devflow-client`,不在主流程语境里直接编码;改动小不豁免。装载面 = 实现前先 Read 对应实现段卡;位置面 = 实现产物只写槽位。

**范围承载不变量:简报目的 = 本轮改动范围上限**——范围以目的层界定,不以文件清单界定:任务派生的必要改动(改调用方、连锁编译修复、重命名波及)自由做、不申报;与目的无关的界外发现**只报不做**,不建持久挂账文件。唯一例外:本轮改动范围内文件上的一行级顺手修,须在 commit message 点名。新公共接口 / 新文件 / 新窗口类 / 新程序集超出微观取舍,回主流程补审或在呈报标注为简报外新增。
> 理由见 .claude/devflow/rationale.md#out-of-scope-no-gate

**升级通道**:实现段查证确认需求层错误且实现层绕不过 → 回第一步重审(带上查证),实现段不越界自改需求。

## 槽位协议(并行开发工作区)

**机械细节正本 = [references/slot-protocol.md](references/slot-protocol.md)**,仅在并行分派、跨会话续接、交付非 `DELIVERED` 后就地处置、呈报取证时按需 Read。

**总约束**:领取和交付脚本是槽位生命周期的唯一写入口,Agent 只消费其末行 `VERDICT:`。在本流程内主工作树只由交付脚本在预检通过后触碰;主工程通道的直接改动不进本流程(通道判据正本 = CLAUDE.md「devflow 适用面」条款)。

**停机呈报**(两脚本共用的返回契约):处置档位由末行 `VERDICT:` 尾部 `next=` 字段给出,按字段照做,不另比对类别清单(判据正本 = `.claude/devflow/hooks/hook函数库.ps1` `Get-VerdictNext`):

- `next=go` —— 成功,继续往下。
- `next=serial` —— 计划内排队:排队对象是本会话前一任务或同一协调者分派的兄弟组,按 slot-protocol「并行分派与 QUEUE 处置」接做;否则按 `halt` 办。
- `next=fix-retry` —— 确定性可修:按返回点名修**输入文件**(简报 / 提交信息)后重跑一次,二次仍败转 `halt`;呈报留痕首跑失败与修复。
- `next=judge` —— 根因自明(自检道次点名具体违规、修法无歧义)按 `fix-retry` 办,不自明按 `halt` 办。
- `next=halt` —— 立即停下,呈报返回原文、失败现象与建议处置,等用户指示;不自行重试、重调或循环。
> 理由见 .claude/devflow/rationale.md#deterministic-fail-one-retry

- 产品代码与资产只改槽位副本;领用时 reset 对齐基线,槽位不是暂存工作的地方。占用真值在 git 提交层,看板非权威;全景速览用只读 `.claude/devflow/占用面板.ps1`。
- 领用时把调查摘要的改动范围交 `-PathsFile`;`QUEUE` 处置与跨会话续接见 slot-protocol 同名节。
- **交付入口**:`.claude\devflow\槽位交付.ps1 -Slot <N> -MessageFile <提交信息>`;`DELIVERED` 外即停机呈报。交付会把槽位分支与 `main` 推到 `origin`(GitHub),第一次交付前须经用户确认可以推送(CLAUDE.md「devflow 适用面」)。脚本可重入;须后台调(前台由 hook 拒,hook 未拦时同样;被杀在半截时重跑同一入口收尾,见 slot-protocol「槽位交付」)。经用户指示就地处置冲突前必读 slot-protocol「冲突分流」。
  - **提交主题格式**(`-MessageFile` 必填,机器校验):首行 `【动词】范围: 描述`,无范围时 `【动词】描述`,方括号是全角【】。动词只取七词,写别的当场 `DENIED-subject`(判定正本 = `.claude/devflow/hooks/校验库.ps1` `$script:SubjectRe`):**新增**(目标行为此前不存在)/ **修复**(原来是错的)/ **变更**(原来没错,有意改口径、数值、外观、文案)/ **重构**(外部行为不变)/ **删除** / **配置**(非业务面的工程设施)/ **文档**。描述段要能独立说清改了什么。
  - **正文**写为什么这么改、放弃了哪些方案、根治还是补丁;白名单标注见「禁止事项」。

## 第三步: 自审 → 呈报交接

1. **自审**:实现完成后、调用交付前,先跑 `.claude\devflow\自审触发判定.ps1 -Slot <N> -MessageFile <提交信息>` 取本轮触发项(判据正本 = 该脚本头部判据表及其所指,卡内不复述;脚本除 INFRA(exit 2)外恒 exit 0,`required` 项按下面处置),再做:
   - 两项轻核对(恒做):①改动是否越出简报目的(简报外改动须已点名);②修复类改动的根治/补丁定性(定义见 CLAUDE.md「修复前先定性」):`FIX-QUALIFY: required` 时按脚本输出补进提交正文(交付入口同判据前置拒绝,缺则 `DENIED-qualify`)。
   - 目视核对(`UI-EVIDENCE: required` 时):交付前在槽位编辑器按 devflow-ui 卡「目视自检证据」的开窗方式实看改动节点,位置与层级(谁盖住谁)都核;只读坐标判不出遮挡。不能留到交付后在主工程补看——那时缺陷已合入。
   - **合并丢失核对**(本轮以 merge 落地时,如同步上游、升级第三方框架):跑 `.claude\devflow\合并丢失核对.ps1 -Merge <合并提交> [-RepoDir <仓>]`,逐条确认是有意裁决还是真丢失;真丢失补回并在提交信息写明(FAIL 语义见脚本头注)。槽位交付的日常合并不适用。
   - 安全审查(`SECURITY-REVIEW: required` 时):按 [references/security-review.md](references/security-review.md) 手工审槽位 current diff,脚本列出的命中文件是起点不是终点,定级与处置见该清单。不调内置 `/security-review`。
   - 按需篇核对(`RULES: required` 时):逐篇 Read,对照本轮 diff 核一遍其条款(交付前自核;专项深审仍归下条的每日审查);判为不适用的篇在呈报写一句理由。
   - 正确性审查不在交付前跑:由用户手动 `/daily-code-review` 承载(程序正本 = `.claude/skills/daily-code-review`)。
   > 理由见 .claude/devflow/rationale.md#security-review-cwd-locked、.claude/devflow/rationale.md#correctness-review-to-nightly、.claude/devflow/rationale.md#rules-named-by-script
2. **调用槽位交付**:`槽位交付.ps1 -Slot <N> -MessageFile <提交信息>`。`DELIVERED` 进入呈报;其余按「停机呈报」办。
3. **呈报交接**:只写 commit message 与交付清单(`DELIVERED` 尾部 `report=` 指向)没有的信息——提交主题一行(挂 `-MessageFile` 文件链接)、待执行验证点(口径正本 = devflow-client「申报口径」)、待裁定项(未完成项 / 待定标数值 / 安全审查存疑 / 简报外改动 / 界外发现)、RULES 点名而判不适用的篇(各一句理由)。`UI-EVIDENCE: required` 时附目视证据(正本 = devflow-ui 卡「目视自检证据」)。
   > 理由见 .claude/devflow/rationale.md#report-exception-only

**git 规则(单通道)**:Agent 不执行槽位生命周期的 git 写操作,检查、提交、推送、合并只经 `槽位交付.ps1`;任何失败不绕脚本、禁 force push。义务台账见 `.claude/devflow/obligation-ledger.md`。
> 理由见 .claude/devflow/rationale.md#no-staging-path-commit

## 四类归因(合并后缺陷)

需求属「修一个已合并交付的缺陷」时,修复前按 [references/defect-attribution.md](references/defect-attribution.md) 归因,修法与修复同轮落地,呈报必含归因结论。同类问题第二次出现必经本节。

## 再来一轮

用户看呈报/diff 不满意 → 反馈作为新简报回第二步;反馈动到需求本身 → 回第一步重审。不设自动轮次上限。被阻塞时改动保留在槽位等待处置。

## 禁止事项

- 新增本地持久化调用(PlayerPrefs / 文件写)须提交信息带「[本地白名单:理由]」,由提交校验机判。这条随 block-client 搬来、立条前提是服务端权威,本作单机下的去留待裁定(见义务台账同名行),裁定前照写标签。接入 Luban 后,改表源须同步字段说明(无字段语义变化时提交信息带「[表文档无关:理由]」),同样机判。
- 不建仓内过程状态文件、不写 design-docs;流程态仓外载体 = 看板(见「槽位协议」),续接依据在 git;`.claude/devflow/rationale.md` 记录工作流设计理由,不受本条约束。玩法规则与工程计划的改动走 `新游戏/` 下的设计文档(人工入库通道),不是本条所指的过程状态文件。
