---
name: devflow-check
description: devflow 工作流规则族的一致性检查(分钟级、无状态全量);机械问题直接修,取舍类报用户裁定。触发:/devflow-check;改完本卡「检查范围」所列的工作流族文件(族内卡片、CLAUDE.md 工作流条款、`.claude/devflow/` 脚本与 README、台账与 hooks)后按「执行档位」选范围。全栈审计归 /rules-audit。
---

# devflow-check — 工作流规则族一致性检查

工作流规则族的交叉核对,分钟级、无状态全量(族文件总量小,不做增量、不建基线)。
> 理由见 .claude/devflow/rationale.md#devflow-check-why-exists

**与 `/rules-audit` 的边界**:本 skill 只管工作流族内部一致性,不写 audit 账本;越出工作流族的发现只在报告里建议跑 `/rules-audit`。

## 执行档位

用户未指定档位时:纯规则文本改动默认只做文本核对;涉及脚本行为或测试矩阵时问一次(不跑 / 只文本核对 / 含全量测试矩阵)。其余照 CLAUDE.md「轻量无人值守」;全量矩阵遵 `.claude/rules-ondemand/script-authoring.md` 的授权要求。

## 检查范围(工作流族清单)

默认根 = 主工程;被显式指定其他根时按该根检查。

- 卡片:`devflow`、`devflow-client`、`devflow-ui`、`daily-code-review`、`unity-check`、`playtest`、`devflow-explore`、`refs-check`、`dotween-effects`、`luban-dev`(各取 SKILL.md)。纳入判据 = 该卡承载了族内不变量的出现点。每日审查若注册了定时任务(本作现未注册),其 backing 文件在用户全局目录、仓外不入本检查,但须是只读仓内正本的 shim,内联程序副本即 finding。
- CLAUDE.md 的工作流条款:「devflow 适用面」、「轻量无人值守」、裁定项结构化行、Unity 槽位分工行、构建入口行。
- 脚本与索引:`.claude/devflow/` 下全部现役 `.ps1`(以目录现场枚举为准)与 `README.md`。
- 检查与台账:`.claude/devflow/obligation-ledger.md`、`.claude/devflow/hooks/*.ps1`、`.claude/settings.json` hooks 节——卡片对检查行为的断言以 hook 脚本实际实现为准。

## 检查项

1. **不变量矩阵**(正本唯一,他处只许指针或一致摘要):逐条核对下列不变量在各出现点的表述互不矛盾;与正本冲突、或出现第二份详细正本即 finding。本表不复述正本内容,规则内容一律读「正本」列。

   | 不变量 | 正本 | 出现点 |
   |---|---|---|
   | devflow 适用面(三通道触发条件与义务集) | CLAUDE.md「devflow 适用面」条款 | devflow 卡 description 与「槽位协议」总约束;本卡「禁止事项」git 条;daily-code-review 步骤 6 落地表述;refs-check「禁止事项」git 条;dotween-effects「禁止事项」`Modules/` 模块开关条 |
   | 轻量无人值守(默认开启、代决策边界与例外续接) | CLAUDE.md「轻量无人值守」 | devflow 第一步「裁定与出口」「出口产物」;本卡「执行档位」 |
   | 槽位绑定(自检执行形态、MCP 实例路由、落点守卫;卡内 `execute_code` 范式代码首行必带落点守卫) | unity-check「槽位分工与占用」 | CLAUDE.md、devflow-ui、devflow-client(开工前路由段 + 自检节 csproj 重生成条)、playtest「目标实例」「落点守卫」 |
   | git 权限(受控脚本单通道,无绕脚本的裸 git 授权) | devflow「git 规则(单通道)」+「槽位协议」 | CLAUDE.md、devflow-client「自检」 |
   | 自检口径(道次清单唯一枚举正本;他处出现逐道副本或道数字面量即 finding,机器登记 `校验库.ps1` `ClientGateScanSurface`(受 客户端自检 启动互核约束)、obligation-ledger 按道的义务行(按义务逐行登记绑定,不作道次清单正本、不写顺序)两处除外;临时测试一律临时) | README「检查」节 + 客户端自检.ps1 头注;临时测试 = devflow-client「自检」 | devflow「停机呈报」judge 档、devflow-client 自检节、CLAUDE.md 构建入口、dotween-effects「自检」、luban-dev「新增配置表流程」(点名单道作后果说明,不算副本)、luban-dev「配置管理禁止事项」模板条(点名单道作拦截指针) |
   | 实现段承载(客户端业务代码只在 devflow-client 段产生) | devflow 第二步「实现段承载不变量」 | devflow-ui 导语/不做、devflow-client 导语、devflow 第三步待裁定项 |
   | 范围承载(简报目的 = 范围上限,界外只报不做) | devflow 第二步「范围承载不变量」 | devflow-client 输入节导语、devflow 第三步自审与待裁定项 |
   | 正确性审查归属(交付前审什么、正确性交每日审查、不调内置 `/security-review`) | devflow 第三步「自审」;程序 = daily-code-review;清单 = devflow `references/security-review.md` | devflow 第三步、daily-code-review 定位段、obligation-ledger 每日审查行 |
   | 自审触发判定(判据正本在脚本;卡内只写触发名与处置,不复述判据) | `自审触发判定.ps1` 头部判据表;FIX-QUALIFY = `校验库.ps1` `Get-FixQualifyGap`(`槽位交付.ps1` 同源前置拒绝);RULES = `校验库.ps1` `RuleReadTable`(`槽位领取.ps1`「开工前读」同源) | devflow 第三步「自审」与第二步「返回处置」、devflow-client「含新增资产的交付先落定派生物」与「取篇」条、README「交付前自审」 |
   | 固定序列脚本化 | devflow `references/script-consolidation.md`(入站指针 = shell-conventions「引擎」节) | slot-protocol「领用」「槽位交付」、devflow「git 规则」、obligation-ledger 承载行 |
   | 提交检查与检查凭据(拦截面与校验单源 校验库.ps1;hook 挂载状态以台账卷首为准) | obligation-ledger.md | devflow「git 规则」「槽位协议」禁止事项、devflow-client「自检」、luban-dev「配置管理禁止事项」表文档条(台账↔卡双向;放行标注写法可详略不同) |
   | 任务看板(占用权威、登记流转脚本、阶段词汇) | slot-protocol「任务看板」 | devflow 禁止事项、「槽位协议」首条(占用真值 / 看板非权威)与领用条跨会话续接指针、看板.ps1 / 占用面板.ps1 头注、obligation-ledger 看板行 |
   | 机器常量单源(槽位数、池成员、目录前缀、分支前缀、稀疏检出目录) | `flow-config.psd1` | 各 `.ps1` 消费者、slot-protocol「布局」、CLAUDE.md Unity 槽位分工行、`Assets/` 下指名 `.claude` 脚本的引用点(经检查项 2 反向段取样;block-client 的 `Assets/Editor/DevFlow/` 槽位面板没有搬,本作现无此类引用点) |
   | 检查边界(本卡 / refs-check / rules-audit 分界;refs-check 带引号复述本卡检查项 2 原文须逐字一致) | 本卡「检查项」+ 卷首边界段 | refs-check 边界段、「禁止事项」、「输入与写入面」核验目标表 |

2. **引用完整性**(范围 = 规则栈内部:`.claude/` 下、CLAUDE.md、`.gitignore`;规则栈文件里出现的 `Assets/` 等工程实体路径不验存在,代码现实由开发与自检覆盖):族内文件提到的规则栈路径、脚本、skill 名、节标题内链逐一验存在。未跟踪文件被引用 → 提示同批入库。另跑 `.claude/devflow/理由对齐核对.ps1`,非零即 finding。

   **反向(工程代码 → 规则栈)**:`Assets/` 下以字符串指名的 `.claude` 脚本逐一验存在,并核调用处参数形态与脚本 `param` 块一致;这批引用点里复述 flow-config 值的注释与字面量须与配置现值一致并给出正本指针,写死数字而无指针即 finding(扫描面限在这批文件,不放开成全仓 grep)。命中的修复对象是产品代码,走 devflow。
   > 理由见 .claude/devflow/rationale.md#reverse-ref-code-to-rulestack
3. **脚本↔卡片/README 声明同步**:卡片与 README 对脚本行为的断言(出口码、道次前置、执行形态、票落点)对脚本头注与实现抽核;以脚本为准,表述过时即 finding。修法是把该处复述收成指向脚本头注的指针,不改写成新一版复述(改写即再造一份待同步的副本)。
4. **脚本回退拦截**:运行 `.claude/devflow/run_tests.ps1` 全量矩阵,非零即 finding;矩阵成员正本 = 其 `$Suites`。canary(`-Canary`,需活 Unity)不在本检查内。是否执行按「执行档位」已定结果,中途不再二次询问;未选矩阵档时本项记「未执行」,不计入通过。
   > 理由见 .claude/devflow/rationale.md#test-matrix-catches-logic-regression
5. **检查道次零命中与护栏恒降级复核**:运行 `.claude/devflow/检查命中面板.ps1`,「复核候选」逐项列入报告的待裁定,附其登记的退役条件与现状是否已满足;撤不撤由用户裁定,本卡不代撤(取舍类)。同一输出的「疑似恒降级」各条(护栏名或键、来源、最近一次现场)也列入待裁定:护栏在真环境恒走降级分支等于没装,附查到的成因,修不修由用户定;该栏报「未判」时报告如实记未判,不计入通过;「只列次数」段不进报告。
6. **按需篇判据表着落**:运行 `.claude/devflow/自审触发判定.ps1 -CheckRuleTable`,非零即 finding。核按需篇判据表没有随产品代码改名漂移(判据见该脚本头注),防点名静默落空;它核的是机判输入的着落,与检查项 2 免验的文档内工程路径不同。判据所指的面整个没了的,删不删那一支报用户裁定;报「Ahead 预置支已有着落」的是机械项,从该条 `Ahead` 撤掉即可。

## 处置分流

- **机械类**(断链、节改名未同步、过时表述、脚本与卡不符时的卡侧措辞、多余副本——与正本一致的,以及 README / 台账 / 卡里对**脚本行为**的复述与脚本失配的,一律收编为指针;检查项 6 的判据表跟产品代码改名 / 搬家,不改判据所指的面,改后跑 `.claude/devflow/tests/自审触发判定测试.ps1`)→ 直接修复,遵 `.claude/rules-ondemand/file-conventions.md`;报告列明每处。
- **取舍类**(规则文档之间正本冲突的副本、条款实质冲突、疑似该删的规则、涉检查定义/脚本行为的变更)→ 只报不动文件,附选项与建议,用户裁定。

## 报告格式

已修复(文件 + 改法)/ 待裁定(问题 + 后果 + 选项)/ 核对通过。

## 禁止事项

- 不动 `.claude/rules/` 正文与 audit 账本(属 `/rules-audit`);越出本 skill 范围的发现只建议执行 `/rules-audit`,不代为执行。
- git:修复经呈报后由 `单仓提交.ps1 -PathListFile` 清单式提交、不推送(判据正本 = CLAUDE.md「devflow 适用面」条款)。
