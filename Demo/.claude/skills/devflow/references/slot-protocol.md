# 槽位协议 · 机械细节

devflow 卡「槽位协议」节的机械细节正本。卡内保留会话面接口(总约束、落地面、领用职责、升级通道),本文承载**两个入口脚本的内部判据与处置矩阵**,以及三类低频分支的处置口径——会话不逐步复核这些内容,只在下列分支下按需 Read:

- 用户一次派发多个任务,或领取返回 `QUEUE`(见「并行分派与 QUEUE 处置」)
- 跨会话续接,接手一个进行中的槽位(见「跨会话续接」)
- 交付返回非 `DELIVERED`,经用户指示后就地处置(尤其冲突分流),或决定放弃槽位重做(见「主动收槽」)
- 呈报需要说明合并与推送发生了什么

机器常量(槽位路径、分支名、基线、稀疏检出目录)正本恒在 `.claude/devflow/flow-config.psd1`,本文不复制具体值。脚本里双仓共用的服务端分支(槽位 Fantasy worktree、协议导出、服务端自检、部署点)随 `ServerDirName` 留空整段关闭,本文只写单仓形态。

## 布局

槽位池固定为 `dev1..dev<SlotCount>`(数量取自 `flow-config.psd1`),运行期不动态扩容;增减槽位是改配置 + 跑 `槽位置备.ps1 -Slot <N>` 的人工动作。选槽方向与上界由领取脚本承载(可选上界键 `NormalSlotMax`,缺键即全池;配否与口径见 `flow-config.psd1` 该键注释);首次领取与免启转客户端任务的处置见 devflow 卡第二步「领取槽位」。每个槽位是主仓的一个 worktree = `<SlotBaseDir>\<SlotDirPrefix>N`(常驻分支 `<SlotBranchPrefix>N`,基线 = `<ClientBaseline>`),按 `<SlotSparseDirs>` 稀疏检出(只有 `Demo/` 与 `新游戏/`,`参考/`、`复刻/` 不进槽位);Unity 工程根 = 槽位下的 `Demo`。尖括号值均取自 `flow-config.psd1` 同名键(机器常量单一事实源,不在本文复制)。脚本另会复核 `Tools\Luban` junction(指回主仓,Luban 运行时 DLL 不入库);主仓没有 `Tools\Luban` 时跳过,本作接 Luban 前恒跳过。

## 空闲判据(以 git 为准,看板不作占用判据)

**空闲 = 无领先提交且无 tracked 未提交改动**——槽位分支相对基线无领先提交(`git log <ClientBaseline>..<SlotBranchPrefix>N` 为空),且 `git status --porcelain` 除 untracked(`??`)外无条目。有未合并提交(含占位提交)或 tracked 未提交改动 = 占用:领用要 `reset --hard` 到基线,tracked 改动会被抹掉,故不判空闲、不领(钉槽回 `ABORT`);untracked 不受 reset 影响、保留在槽内,不参与判定。领取内核与只读看板 `.claude/devflow/占用面板.ps1` 用同一判据(两脚本共用 `.claude/devflow/hooks/hook函数库.ps1` 的 `Test-SlotIdle`);面板另做现场推导各槽位占用、拼接任务看板流程态,两者矛盾以 git 为准并标注 STALE/未登记,脚本不落任何账。

**占有原子化**:内核在判空闲**之前**记下槽位分支尖,判空闲后用 `commit-tree` 造好占位提交(以基线为父、树同基线,不动 ref),再以 `git update-ref refs/heads/<分支> <占位> <判空闲前的尖>` CAS 争用——git 持 ref 锁比对,分支尖已变即失败。争用成功者才 `reset --hard`;失败者判被抢(`contention-yielded`)、从未改过该槽 ref 与工作树,换下一空闲槽,候选耗尽回 `ABORT`。旧序「先 reset 再打占位再复核」下后到者的 reset 会抹掉先到者已通过复核的占位,两边都 `ACQUIRED`。

## 陈旧占位清理(槽位领取 内置自动执行)

槽位分支仅领先**一个 `claim:` 占位空提交**(tree == 父 tree)且占位龄超 `flow-config` `StaleClaimHours` = 崩溃遗留,领用扫描时自动 reset 清除并清看板行(空提交零损失);任一条件不中按占用对待、不自动清理(有工作提交的槽位由会话呈报用户处置)。条件全中但有 tracked 未提交改动(口径同空闲判据)时也不清:跳过该槽、改动原样保留,输出 `WARN stale-claim-dirty dev<N> tracked-dirty=<数>` 提示人工处置,领取继续找其他空闲槽(无则照常 `FULL`)。

## 主动收槽(两种,形态判据不同)

- **就绪失败回滚**(领取入口内部自动,内核 `-Release`):只收「恰 1 条空 `claim:` 占位」,带 dirty 照收(刚领到即回滚,槽内尚无会话改动);形态不符即 `ABORT`、不动任何东西——它不是放弃槽位的手段。
- **显式放弃**(`槽位领取.ps1 -Abandon -Slot <N>`):不看形态,撤残留合并态、`reset --hard` 到基线、清看板行,丢弃该槽全部领先提交与 tracked 改动(untracked 保留;丢弃的提交逐条列出,reflog 可找回),成功回 `ABANDONED`。**不可逆,只在用户明确授权放弃该槽后调用**。典型场景:交付走不下去、决定在新基线重做——此时同范围重领会 `QUEUE` 到自己这个交付不了的槽上死等,须先放弃再领。

## 领用前重叠检查(槽位领取 内置比对)

冲突判据是**文件范围重叠**(目录前缀双向匹配),不是功能名目;它只是预判、不保零冲突,串行资源也走同一比对。比对之外的强制拦截只有占位提交:固定池占满回 `FULL`、钉槽被占回 `ABORT`、池内已有同主题占位(最早提交 subject 逐字等于 `claim: <topic>`,不论哪个会话打的)回 `ABORT duplicate-claim dev<N>`——一个任务只占一个槽位,续接原槽,原槽作废经用户授权 `-Abandon` 后再领。同主题拦截先于重叠比对,否则有改动的原占位会让重复领取 `QUEUE` 到它自己身上。

**路径清单写到文件级**:只改某目录下几个文件时逐文件列出,不写目录。写目录会与别的会话占着的子目录文件判重叠回 `QUEUE`(处置见「并行分派与 QUEUE 处置」)。

**串行资源**(只要已有槽位在改动该类资源即一律排队,不在「合并阶段能顺利化解冲突」的预期下并行开工):同一 prefab/图集等二进制资产、共享枚举/注册表/asmdef 类多任务都要改的文件;接入 Luban 后其生成物同列。

> 理由见 .claude/devflow/rationale.md#merge-early-small-tasks

## 领用

`槽位领取.ps1` 是 Agent 唯一入口,内部完成扫描、清理、比对、reset 对齐基线、占位、登记看板、Unity 启动与 UnityMCP 就绪确认;Agent 只消费末行 `VERDICT:`,不手动启动、重连或推测实例。`FULL` = 固定池各槽均占用,等待交付或处置异常残留,不临时扩容;就绪失败回 `BLOCKED-UNITY`(找不到编辑器可执行文件)/ `BLOCKED-UNITYMCP`(等满就绪窗口桥仍未就绪)/ `BLOCKED-UNITY-DIALOG`(编辑器停在启动期对话框上,判出即回、不等满窗口;带 `pid` / `dialog` / `need`),三者都是 `next=halt`,领取路径回滚占位、`-StartUnity` 路径不动占位;对话框的判别与处置见 `unity-check` 卡「边界」。领取把槽位 reset 到基线后清掉本槽位工程的 `Temp\__Backupscenes`(上次异常退出留下的场景备份不留)并打一行 `INFO scene-backups-cleared`:常规领取在新启编辑器之前清,免启领取在收尾前清;该槽位已有编辑器在跑、`-StartUnity` 都不清(判据与路径校验见 `槽位领取.ps1` 头注)。`-NoUnity` / `-StartUnity` 判据见 devflow 卡第二步「领取槽位」。

> 理由见 .claude/devflow/rationale.md#placeholder-commit-claim-race
> 理由见 .claude/devflow/rationale.md#slot-acquire-one-call

## 并行分派与 QUEUE 处置

**会话机制**:

- 子会话用 `start_session` 开:`initiation` "user_asked"(用户派发 devflow 任务即并行授权)、`context` "fresh"、`use_worktree` false,权限模式不另设——两会话权限模式不同时,来信要等用户批准才进对方上下文。子会话起在主工程 Demo(cwd 不在其下装载不到实现段卡),产物只写槽位,主工作树仍只由交付脚本触碰。
- 子会话 `prompt` 必带:组内各任务的用户原话 + 已裁定项 + 协调者会话名。
- 开不出子会话(工具不可用或被拒)→ 本会话按原顺序串行做,不阻塞。

**多任务**:

- 分组:协调者按各任务预计触碰的路径粗分(完整审计在各组子会话内做),路径重叠(目录前缀双向)或碰同一串行资源(见「领用前重叠检查」)的归一组,组内按派发顺序串行。同时在跑的组数不超过空闲槽位数,多出的组等前面的组交付后再开;只分出一组时本会话自己做。
- 各组子会话走完整 devflow 并在自己会话里呈报;要用户裁定或停机时照常在本会话提问 / 呈报,另给协调者发一行「待裁定:<一句>」或「停机:<VERDICT 首段>」。协调者向用户转述并附会话链接,不代答裁定项。
- 「取下一个空号」类编号(事件 id、配置表 id、存档字段号等)领取比对管不到:取号前 `git grep` 各 `<SlotBranchPrefix>N` 分支避开已占号,撞了由后合并方改号。
- 各组交付的并发由交付脚本承载(合并预检、集成锁、STALE 重跑)。各组都结束后,协调者向用户汇总各组提交主题、待裁定项与会话链接,不复述各组呈报。

**同一任务不拆子会话**:UI 段与客户端段共用槽位编辑器,客户端改 `.cs` 触发的编译与域重载会打断 UI 段的 MCP 搭建与按名绑定,客户端段还要往 UI 段生成的 impl partial 里填逻辑——一个任务由领槽位的会话从头做到交付。

**QUEUE 处置**(领取返回 `QUEUE`):

- 排队对象是本会话前一任务(组内串行)→ 计划内,前者交付后 `-Slot <N>` 同槽位重领接做,不请示。
- 排队对象是同一协调者分派的另一组(分组漏判重叠)→ 不等,给协调者发「QUEUE 于 dev<N>」后结束本轮;协调者在那组交付后通知它 `-Slot <N>` 重领。
- 排队对象是本会话一个交付不了、已决定重做的槽位 → 那个槽等不到合并,经用户授权 `-Abandon` 放弃后再领(见「主动收槽」)。
- 其余 → 停机呈报。

交付返回按末行 `next=` 字段处置(档位表见卡「停机呈报」)。

> 理由见 .claude/devflow/rationale.md#parallel-subsession-dispatch

## 跨会话续接(全在 git,无独立交接文件)

不建仓外交接文件,接手进行中的槽位按下列来源重建(尽力而为、不设检查):①**计划** = claim 占位提交 body 里的简报(`占用面板.ps1 -Json` 或 `git log <槽位> --format=%B` 读);②**进度真值** = ahead 提交;③**决策** = commit message;④**阻塞** = 看板 stage(把 `阻塞:<原因>` 写进文件,跑 `看板.ps1 -Slot <N> -StageFile <文件>`;解卡同法改回 `实现中`)。占用真值在 git 的 claim 提交,看板仅粗索引。

## 任务看板(流程态)

仓外 `%LOCALAPPDATA%\<BoardRelPath>`(相对路径正本 = `flow-config.psd1`,物理路径经 `hook函数库.ps1` `Get-BoardPath` 解析,桌面端 MSIX 容器内外同一文件);登记看板由领取脚本承载,流转与清行由交付脚本承载,放弃槽位(`-Abandon`)的清行由领取脚本承载。看板非权威、可丢,占用真值恒在 git,行失配由 `占用面板.ps1` 对账标注。阶段词汇正本 = `看板.ps1` 头注(自由字符串;`阻塞:<原因>` 前缀供占用面板分支续接指引)。

> 理由见 .claude/devflow/rationale.md#board-process-state

## 槽位交付

调用 `.claude\devflow\槽位交付.ps1 -Slot <N> -MessageFile <提交信息>`(主题格式见 devflow 卡「槽位协议」)。脚本可重入;非成功返回先停机呈报,经用户指示处置后重跑同一入口。槽位落后基线时脚本自动同步,两侧都动过的生成域同步后重导,冲突分流与合并阶段同一份实现。自检恒跑在候选提交与基线同步之后的树上,故槽位提交不验票,凭据在 集成交付 push 点验(序列正本 = 脚本头注 Order 行)。交付成功会把槽位分支与 `main` 推到 `origin`(GitHub)。

前台调用由 hook `命令通路检查` 拒;它失败放行或没认出调用形态时仍须后台调,否则撞 600 秒上限被杀在「已合并、未推送」之间,重跑同一入口收尾。后台输出到结束才落文件,中途看进度查进程与 `git log`,不据空输出判卡死。

> 理由见 .claude/devflow/rationale.md#foreground-deliver-hook

**`BLOCKED-BASELINE-CONFLICT`**(同步基线撞真实冲突,脚本 abort 并核实现场;括注为「merge --abort 未生效」时合并态仍留在槽位,呈报时点明):代码冲突按现场裁定后重跑。接入 Luban 后的表源冲突要两步——①照 VERDICT 指引以基线版为基重放本轮改动(`git checkout <基线> -- <冲突文件>` 后在其上重做本轮编辑),**不在槽位重导表**:同步基线后入口自动重导,会话先导是白做;②带 `-TableSourceReplayed` 重跑入口。只重放不加开关会撞同一处停机;**未重放就加该开关 = 整体丢掉基线侧的表改动,自检核不出**。

> 理由见 .claude/devflow/rationale.md#merge-machine-gate-no-reverify
> 理由见 .claude/devflow/rationale.md#one-call-delivery

### 合并原则(规范正本;机械序列 = 脚本头注)

预检零阻塞 → 直接合并不等批准,结果并入呈报(事后通报);任一 blocker(出处超出清单即外来提交 / 树不 clean / 合并改动范围与主树未提交改动重叠)→ 停,呈报用户裁定,不自行合并、不自行剔除提交。

### 冲突分流(裁决语义正本;机械执行在 集成交付 合并阶段与 槽位交付 基线同步块,共用一份实现)

代码文件 → 先停机呈报待用户指示(契约见卡「槽位协议·总约束」),经指示后会话就地解决(只改文件不跑 git,文件无冲突标记后重跑脚本收尾);生成物(登记与判据正本 = 校验库 `GenDomains`;本作接 Luban 前没有会撞的生成域)→ 一律取本侧,重导覆盖为准(**生成物不按文本合并结果交付**):合并两侧都动过某域时,槽位交付 基线同步后与 集成交付 真合并进 main 后各按合并树重导该域;prefab / 图集 / 其他二进制性资产 → 脚本 `merge --abort` 呈报裁决;基线同步真实冲突(`BLOCKED-BASELINE-CONFLICT`)→ 停机呈报,处置见上,处置后重跑交付入口。

### 合并后

合并完成后槽位分支不删,于下次领用时 `reset --hard` 对齐回基线。
