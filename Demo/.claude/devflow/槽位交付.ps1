# 槽位交付.ps1 - Agent-facing slot delivery entry point.
# The implementing Agent calls this once after intent/security review. This script owns
# protocol export, required gates, pending commits, baseline auto-sync (merge; re-export of
# every generated domain both sides touched, per 校验库 GenDomains), provenance capture (the slot
# branch's first-parent chain, see the expected-list block below), push, merge,
# integration closure, and deployment through 集成交付.ps1.
# Order: protocol export -> pending commits (both repos) -> baseline sync + re-export -> server gate
# -> client gate -> 集成交付. Both gates run on the synced tree; this needs slot commits to be free on
# BOTH repos (tickets bind at the push point in 集成交付 / 提交检查), since the merge needs a clean tree.
# Pre-checks before any git write (each rejects with exit 1): DENIED-subject = subject line not
# `【动词】范围: 描述`; DENIED-qualify = 【修复】 subject whose body carries no 根治/补丁 conclusion,
# or concludes 根治 without naming the 不变量 (校验库 Get-FixQualifyGap); DENIED-SCOPE =
# ProjectSettings.asset changed but declared in neither the brief nor the commit message.
# Temp files this script creates (expected list, re-export commit messages / path lists) are
# registered via New-FlowTempFile and removed in the outer finally; caller files are never touched.
# -MessageFile is mandatory: the subject format (`【动词】范围: 描述`, 校验库 Get-SubjectFormatGap,
# pre-checked here and again in 单仓提交.ps1) needs a verb only the author can pick. The old fallback synthesised
# `chore(task): <claim topic>`, which the format check would reject anyway - and which
# carried no information about what the change actually did.
# Telemetry (only side effect: appends to the out-of-repo telemetry\wf-YYYYMM.jsonl): every VERDICT exit writes one
# event=entry-verdict line (fields and phases: see $script:TelCtx below); a per-run id exported as FLOW_DELIVER_RUN
# ties the children's gate-run / 集成交付 lines to it. VERDICT text and exit codes are unaffected.
[CmdletBinding(PositionalBinding=$false)]
param(
  [Parameter(Mandatory = $true)][string]$Slot,
  [Parameter(Mandatory = $true)][string]$MessageFile,
  [switch]$Protocol,
  [switch]$NoDeploy,
  [switch]$TableSourceReplayed,
  [string]$RepoRoot = "",
  [string]$FantasyRoot = "",
  [string]$SlotBase = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\校验库.ps1")

$script:SlotN = ""
$script:NeedBaselineSync = $false

# 遥测:每个 VERDICT 出口写一行 event=entry-verdict(entry=槽位交付;字段与构造 = hook函数库 Write-EntryVerdictTelemetry),
# 前置拒绝、基线冲突停机、门失败都看得到。phases 分段:precheck(配置 / 主题 / 出处 / 范围 / 落差等前置)/ export(协议导出)/
# commit(候选提交)/ sync(基线合并)/ reexport(同步后重导与收口提交)/ sgate / cgate(两端自检,cgate 含临时测试清理)/
# integrate(集成交付 整段);没走到的段不写。集成交付 内部的 lockwait / deploy_build / restart 记在它自己那行遥测里:
# 本入口开跑即生成一个交付关联号(环境变量 FLOW_DELIVER_RUN,hook函数库 Get-DeliverRunId),子流程继承,
# 集成交付 与两端自检的遥测行都带 run=<该号>,与本行一一对上。files = 基线冲突 / 范围拒绝点名的路径。
# 只记不改:VERDICT 文本与出口码不因遥测变化,写不进也不影响结论。
$script:TelCtx = @{ Clock = (New-PhaseClock); Slot = ""; Topic = ""; Claim = ""; Files = @() }
[Environment]::SetEnvironmentVariable($script:DeliverRunEnv, [Guid]::NewGuid().ToString("N").Substring(0, 12))

# 非 DELIVERED 返回统一前置的处置指引(与 CLAUDE.md 停机契约、devflow 主卡「停机呈报」同源;VERDICT 行保持末行供解析)。
# 档位本身由 VERDICT 行尾的 next= 承载(判据 = hook函数库 Get-VerdictNext),本文案只解释各档做什么,不重复归类。
$script:StopNote = "NOTE: 处置按下方 VERDICT 行尾的 next= 字段:halt = 立即停下、向用户呈报 VERDICT 原文与现场、等指示;fix-retry = 修输入文件后重跑一次;judge = 先判根因是否自明。VERDICT 正文内嵌的「…后重跑」类指引是步骤说明,不单独构成执行授权。"

function Write-Verdict([string]$Line, [int]$Code) {
  try {
    if ($script:SlotN) {
      # 前缀用中文「阻塞:」:词汇表正本 = 看板.ps1 头注,占用面板 Get-NextAction 按该前缀判续接指引分支
      & (Join-Path $PSScriptRoot "看板.ps1") -Slot $script:SlotN -Stage ("阻塞:" + (($Line -split '\s+')[0])) 2>&1 | Out-Null
    }
  } catch {}
  Write-Host $script:StopNote
  Write-Host ("VERDICT: " + (Format-VerdictLine $Line))
  Write-EntryVerdictTelemetry "槽位交付" $Line $Code $script:TelCtx
  exit $Code
}

function Invoke-Flow([string]$ScriptName, [object[]]$Arguments) {
  # 同目录子流程的薄转调;收输出与 stderr 不抛的实现单源 = hook函数库 Invoke-FlowChild。
  return (Invoke-FlowChild (Join-Path $PSScriptRoot $ScriptName) $Arguments)
}

# 子流程 verdict 行有两种形态:入口类(集成交付 / 单仓提交)写 `VERDICT: `,两道自检门与其下各道
# 扫描写 `VERDICT : `(冒号前有空格)。只认前者时,门失败的末行恒为「GATE-FAIL | no verdict
# returned」,真实判定只散在上方明细里。
$script:VerdictLineRe = '^VERDICT\s*:'

# 子流程失败时把捕获到的诊断明细透传给用户(Invoke-Flow 捕获了子流程全部 stdout,不回显则
# 用户只见末行 VERDICT、看不到「明细见上」指向的实际内容)。跳过子流程自己的 `VERDICT:` 行、
# StopNote,以及被 Get-LastVerdict 提进末行的那一行,父脚本统一补权威末行 VERDICT。自检门里
# 各道扫描自己的 `VERDICT : ` 行照常透传:它带违规数与判据指针,本身就是明细。
function Show-Detail([string[]]$Lines) {
  $promoted = -1
  for ($i = $Lines.Count - 1; $i -ge 0; $i--) {
    if ([string]$Lines[$i] -match $script:VerdictLineRe) { $promoted = $i; break }
  }
  for ($i = 0; $i -lt $Lines.Count; $i++) {
    $s = [string]$Lines[$i]
    if ($i -eq $promoted -or $s -match '^VERDICT:' -or $s -eq $script:StopNote) { continue }
    Write-Host $s
  }
}

function Get-ChangedPaths([string]$Repo, [string]$Base) {
  # 改动全集 = 基线三点 diff + 工作树现状(porcelain 一次覆盖已暂存/未暂存/未跟踪,rename 两端都出);
  # 合并去重的口径单源 = hook函数库 Get-RepoFootprint(与 槽位领取内核 / 占用面板 同一实现)。
  # 消费方全部按正则匹配路径,porcelain 对非 ASCII 段的转义不影响 ASCII 前缀/后缀判定。
  # -uall:porcelain 缺省把整棵未跟踪新目录折叠成一条目录条目(?? Configs/),深前缀正则
  # (LubanSurfaceRe / ClientSurfaceRe)对折叠条目失配——基线同步判定与涉端识别都吃这份清单,须逐文件列出。
  return , (Get-RepoFootprint (Get-GitLines $Repo ("-c core.quotepath=false diff " + $Base + "...HEAD --name-only")) (Get-GitLines $Repo "status --porcelain -uall"))
}

function Get-LastVerdict([string[]]$Lines) {
  $v = @($Lines | Where-Object { $_ -match $script:VerdictLineRe } | Select-Object -Last 1)
  if ($v.Count -eq 0) { return "no verdict returned" }
  return ($v[0] -replace '^VERDICT\s*:\s*', '')
}

# 基线同步后重导产物的提交收口(同轮各类重导全部落地后调一次,$Kind 为各类名以「与」连接)。客户端只提交落在 $ClientRe 的脏路径(零变更
# 即跳过,重导幂等);Fantasy 暂存区有差异时直接提交。只提交不自检:双端自检都在同步块之后对最终树跑一次。
function Save-SyncReExport([string]$ClientRoot, [string]$FantasyDir, [string]$Kind, [string]$ClientRe) {
  $subject = "【流程】基线同步后重导" + $Kind + "(槽位 dev" + $script:SlotN + ")"
  $cDirty = @()
  $cDirty += Get-GitLines $ClientRoot "-c core.quotepath=false diff --name-only HEAD"
  $cDirty += Get-GitLines $ClientRoot "-c core.quotepath=false ls-files --others --exclude-standard"
  $cHit = @($cDirty | ForEach-Object { ([string]$_).Trim() } | Where-Object { $_ -match $ClientRe } | Select-Object -Unique)
  if ($cHit.Count -gt 0) {
    foreach ($p in $cHit) { Invoke-GitMerged $ClientRoot ("add -N -- `"" + $p + "`"") | Out-Null }
    $psList = New-FlowTempFile "slot-deliver-basesync"
    [System.IO.File]::WriteAllLines($psList, [string[]]$cHit, (New-Object System.Text.UTF8Encoding($false)))
    $r = Invoke-GitMerged $ClientRoot ("commit -F `"" + (New-FlowCommitMsgFile $subject) + "`" --pathspec-from-file=`"" + $psList + "`"")
    if ($r.code -ne 0) { Write-Verdict ("INFRA | 基线同步客户端重导" + $Kind + "提交失败:" + (($r.lines | Select-Object -Last 3) -join " | ")) 2 }
    Write-Host ("INFO 基线同步:客户端重导" + $Kind + "产物已提交(" + $cHit.Count + " 项)")
  } else { Write-Host ("INFO 基线同步:客户端重导" + $Kind + "零 diff") }
  if ((Get-GitLines $FantasyDir "status --porcelain").Count -eq 0) { return }
  $r = Invoke-GitMerged $FantasyDir "add -A"
  if ($r.code -ne 0) { Write-Verdict ("INFRA | 基线同步 Fantasy add 失败:" + ($r.lines -join " ")) 2 }
  # status 报脏不等于真有差异:重导重写文件会让 stat 缓存失效,行尾归一化的文件也照报 M,
  # 两者 add 之后暂存区都是空的。此时无从提交——commit 会以 "nothing to commit" 非零退出,
  # 当成失败就把一次正常的零 diff 重导判成 INFRA(客户端侧同一情形由 $cHit 空清单挡在前面,
  # Fantasy 侧的门槛是 status,挡不住)。判暂存区,不判 status。
  $staged = Invoke-GitMerged $FantasyDir "diff --cached --quiet"   # 0 = 无暂存差异
  if ($staged.code -eq 0) { Write-Host ("INFO 基线同步:Fantasy 重导" + $Kind + "零 diff"); return }
  $r = Invoke-GitMerged $FantasyDir ("commit -F `"" + (New-FlowCommitMsgFile $subject) + "`"")
  if ($r.code -ne 0) { Write-Verdict ("INFRA | 基线同步 Fantasy 重导" + $Kind + "提交失败:" + (($r.lines | Select-Object -Last 3) -join " | ")) 2 }
  Write-Host ("INFO 基线同步:Fantasy 重导" + $Kind + "产物已提交")
}

try {
  Enter-Phase $script:TelCtx.Clock "precheck"
  $cfg = Get-FlowConfig
  # 服务端通道关闭(hook函数库 Test-ServerEnabled)时,下文碰槽位服务端 worktree 的各步一律跳过:
  # 服务端侧视同无改动、不落后、无协议、无服务端自检。
  $script:Server = Test-ServerEnabled
  $needKeys = @("SlotCount", "SlotBaseDir", "SlotDirPrefix", "ClientBaseline")
  if ($script:Server) { $needKeys += @("ServerDirName", "FantasyBaseline") }
  foreach ($key in $needKeys) {
    if (-not $cfg[$key]) { Write-Verdict ("INFRA | missing flow-config key " + $key) 2 }
  }
  if ($Slot -notmatch '^\d+$' -or [int]$Slot -lt 1 -or [int]$Slot -gt [int]$cfg.SlotCount) {
    Write-Verdict ("DENIED | slot must be in 1.." + $cfg.SlotCount) 1
  }
  $script:SlotN = $Slot
  $script:TelCtx.Slot = $Slot
  $slotBaseDir = if ($SlotBase) { $SlotBase } else { $cfg.SlotBaseDir }
  $slotRoot = Join-Path $slotBaseDir ($cfg.SlotDirPrefix + $Slot)
  $slotFantasy = if ($script:Server) { Join-Path $slotRoot $cfg.ServerDirName } else { "" }
  $projectDir = Join-Path $slotRoot "Demo"
  if (-not (Test-Path $projectDir) -or ($script:Server -and -not (Test-Path (Join-Path $slotFantasy ".git")))) {
    Write-Verdict ("INFRA | incomplete slot pair at " + $slotRoot) 2
  }

  # 提交信息前置校验:格式判定与 单仓提交.ps1 同源(校验库),但在此先跑一遍——真正的提交
  # 发生在协议导出与双端自检之后,若留到那时才拒,一次不合格的主题要赔上整轮自检的时间。
  if (-not (Test-Path $MessageFile)) { Write-Verdict ("INFRA | message file not found: " + $MessageFile) 2 }
  $msgText = [System.IO.File]::ReadAllText($MessageFile, [System.Text.Encoding]::UTF8)
  $badSubject = Get-SubjectFormatGap $msgText
  if ($badSubject) {
    Write-Verdict ("DENIED-subject | 提交主题不合格式:「" + $badSubject + "」。须写成 【动词】范围: 描述(无范围时 【动词】描述);动词只取七词之一:新增/修复/变更/重构/删除/配置/文档,括号是全角【】,范围后半角冒号加空格;【流程】是机器提交保留词,人写路径不可用") 1
  }
  # 修复类定性前置校验:判据与 自审触发判定.ps1 的 FIX-QUALIFY 同源(校验库 Get-FixQualifyGap)。
  # 那边只报不拦,而这一项的产物就是提交正文——拒了改一行输入文件即可重跑,不存在「误判堵死流程」;
  # 只留在自审一步时,会话跳过那一步,缺定性的修复提交照样合进 main。自审的另外四项(安全审查 /
  # 资产落定 / 目视证据 / 按需篇点名)没有可机判的产物,不在此拦。位置同主题校验:零 git 写。
  $qual = Get-FixQualifyGap $msgText
  if ($qual.Gap -eq "no-qual") {
    Write-Verdict ("DENIED-qualify | 修复类提交「" + $qual.Subject + "」的正文没有定性结论。按 CLAUDE.md「修复前先定性」在提交信息正文写明根治还是补丁(补丁写明根源,未知标注未知;根治写明所立的不变量)后重跑本入口") 1
  }
  if ($qual.Gap -eq "root-no-invariant") {
    Write-Verdict ("DENIED-qualify | 修复类提交「" + $qual.Subject + "」定性为根治,但正文没写它立住的不变量。补写本修复立住的不变量,及按「换个地方再发生」排查过的反例时序 / 路径后重跑本入口") 1
  }

  $baseC = $cfg.ClientBaseline
  $baseF = $cfg.FantasyBaseline
  $clientAhead = Get-GitLines $slotRoot ("log --format=%H " + $baseC + "..HEAD")
  # 分支提交主题(最早在前):供出处校验认「最早一条是 claim 占位」。只看本分支一父链(与下方出处期望
  # 清单同口径):不加 --first-parent 时按提交时间排序,经合并并入的外来提交若与 claim 同秒或更早,会被
  # 排到最前,把本该由出处比对点名的外来提交误报成「claim 缺失」。
  $clientSubjects = @()
  if ($clientAhead.Count -gt 0) {
    $clientSubjects = Get-GitLines $slotRoot ("log --first-parent --reverse --format=%s " + $baseC + "..HEAD")
    if ($clientSubjects.Count -eq 0 -or $clientSubjects[0] -notmatch '^claim:\s*') {
      Write-Verdict "BLOCKED-PROVENANCE | oldest client commit is not a slot claim" 3
    }
    # 遥测关联:claim 占位的 sha 与主题(与领取那行 entry-verdict 对上)。
    $script:TelCtx.Claim = Get-ClaimSha $slotRoot $baseC
    $script:TelCtx.Topic = ($clientSubjects[0] -replace '^claim:\s*', '')
  }

  $clientPaths = Get-ChangedPaths $slotRoot $baseC
  $fantasyPaths = if ($script:Server) { Get-ChangedPaths $slotFantasy $baseF } else { @() }

  # ---- 超范围改动拦截:工程配置文件须在简报或提交信息里显式声明 ----
  # 各槽位编辑器各持一份 PlayerSettings 内存副本,领取的 reset 只改磁盘、内存不跟随;编辑器
  # 随后任何一次 Save Project 就把旧内存写回槽位磁盘,产生与任务无关的回退改动(实测形态:
  # 删掉 Android 图标的 24 个纹理 guid 引用 + productName 退回默认值),随交付合并进 main。
  # 三次实发(2026-09-03 da4134b33 / 2e9418896 / 9abe97032),末次经完整 devflow 流程进来
  # ——作者侧的范围自审看不见它(diff 里它和真实改动混在一起),故补机判。
  # 判据取「有人显式写下来」而非精确匹配简报:真要改这个文件的任务,简报或提交信息里必然
  # 提到它;编辑器写回的噪音则不会。位置在候选提交与检查之前,拒时零 git 写。
  $scopeGuarded = @($clientPaths | Where-Object { $_ -match 'ProjectSettings/ProjectSettings\.asset$' })
  if ($scopeGuarded.Count -gt 0) {
    $declared = [System.IO.File]::ReadAllText($MessageFile, [System.Text.Encoding]::UTF8)
    if ($clientAhead.Count -gt 0) {
      $declared += "`n" + ((Get-GitLines $slotRoot ("log --format=%B " + $baseC + "..HEAD")) -join "`n")
    }
    if ($declared -notmatch 'ProjectSettings') {
      $script:TelCtx.Files = $scopeGuarded
      Write-Verdict ("DENIED-SCOPE | 本轮改动含工程配置文件,但简报与提交信息均未声明要改它:" + ($scopeGuarded -join ", ") + "。最常见成因是槽位编辑器把旧 PlayerSettings 内存写回磁盘,产生与本任务无关的回退改动(已三次抹掉已交付的应用图标配置)。确属本任务范围则在提交信息里写明 ProjectSettings 与改动理由后重跑;否则在槽位执行 git checkout -- ProjectSettings/ProjectSettings.asset 清除该文件后重跑本入口") 1
    }
  }

  # ---- 基线同步判定(两条独立判据,分别驱动下方同步块的两段) ----
  # ① 同步基线本身:任一仓落后基线即做,无附加条件(客户端落后 merge 客户端,Fantasy 落后见 ③)。
  #    检查必须跑在同步后的树上,才等于「这堆改动合进 main 之后的样子」。原先此块只在 Luban
  #    场景触发,于是全仓类扫描道次(bat编码核对 / 命名空间扫描 / UI绑定核对等,扫的是整个仓
  #    而非本轮改动面)在落后基线的槽位上,会被 main 上早已修好的存量违规拦下——违规文件根本
  #    不在本轮改动里,报错指向的地方与作者无关,只能靠人识破再手动合基线(实发两次,取证见 git log;
  #    义务登记 = obligation-ledger.md「落后基线的槽位不带旧基线交付」行)。
  #    判据取「落后即同步」而非「某类文件落后才同步」:全仓类扫描的扫描面无法逐类枚举,按类
  #    枚举等于每加一道新扫描就要补一次判据,漏补即重演(这正是它重演的方式——bat 闸是新加的)。
  #    服务端自检同理,且更硬:基线新增的服务端代码或检查锚点,在落后的槽位里根本不存在,检查只能判
  #    INFRA / FAIL(实发 2026-09-29 dev1:基线刚合入 A/B 实验二期的 AbTables.cs 与核对道,槽位 Fantasy
  #    落后 1 提交,AB白名单表访问核对 找不到 class AbTables 锚点判 INFRA,改输入文件修不了)。它原先
  #    跑在同步之前,是因为槽位 Fantasy 提交点验票:候选提交要票、merge 要干净树,自检只能先于同步。
  #    现两仓槽位提交一律自由、验票都在 push 点(集成交付 / 提交检查),双端自检统一排在同步块之后。
  # ② 同步后重导:只重导两侧都动过的生成域(判据 = 校验库 GenDomains 不变量),不随 ① 放宽——
  #    无条件重导会给每次落后基线的交付平添一次全量导表(分钟级)与一个零信息量的【流程】提交。
  #
  # ③ Fantasy 侧基线同步:Fantasy 落后即做,不以客户端落后为前提,实现在下方同步块内、重导之前。
  #    原先挂在客户端同步之下,客户端已齐平、只有 Fantasy 落后时(上游只合了纯服务端交付;或上一轮
  #    客户端已同步、停在 Fantasy 冲突后重跑)整块不进,服务端自检与跨端类检查跑在旧 Fantasy 基线上。
  #    Fantasy 无本分支提交(纯客户端任务)时只快进——不产生提交,集成交付 仍不进它的合并流程;
  #    有本分支提交时 merge。
  #
  # 落差取 rev-list --count 的数字,不数 log 的行数:行数判据要跨 cmd → PS 的输出捕获,
  # 空输出与多行拼接都会把 Count 变成 1(实发 2026-08-19,连续误拦六次含 Luban 的交付)。
  # --count 直接返回一个十进制数,不合数字形态即判 INFRA——查不出落差时不能假定为 0 放行。
  $behindRaw = Get-GitOne $slotRoot ("rev-list --count HEAD.." + $baseC)
  if ($behindRaw -notmatch '^\d+$') {
    Write-Verdict ("INFRA | 基线落差查询未返回数字(rev-list --count 输出「" + $behindRaw + "」),无法判定是否需要先同步基线") 2
  }
  $clientBehindN = [int]$behindRaw
  $fBehindRaw = if ($script:Server) { Get-GitOne $slotFantasy ("rev-list --count HEAD.." + $baseF) } else { "0" }
  if ($fBehindRaw -notmatch '^\d+$') {
    Write-Verdict ("INFRA | Fantasy 基线落差查询未返回数字(rev-list --count 输出「" + $fBehindRaw + "」),无法判定是否需要先同步基线") 2
  }
  $fantasyBehindN = [int]$fBehindRaw
  $script:NeedBaselineSync = ($clientBehindN -gt 0) -or ($fantasyBehindN -gt 0)
  if ($script:NeedBaselineSync) {
    Write-Host ("INFO 基线同步待执行:客户端落后 " + $baseC + " " + $clientBehindN + " 个提交、Fantasy 落后 " + $baseF + " " + $fantasyBehindN + " 个提交——检查须跑在同步后的树上,候选提交后自动合基线")
  }

  # 协议生成域正则单源 = hooks\校验库.ps1(ProtocolGenClientRe / ProtocolGenFantasyRe)
  # 改动面含本分支已提交部分(Get-ChangedPaths 的三点 diff),重跑时候选提交已落也照判。
  # 协议导出写服务端仓,服务端通道关闭时没有协议可导。
  $protocolInvolved = $script:Server -and ([bool]$Protocol -or
    (@($clientPaths | Where-Object { $_ -match $script:ProtocolGenClientRe }).Count -gt 0) -or
    (@($fantasyPaths | Where-Object { $_ -match $script:ProtocolGenFantasyRe }).Count -gt 0))

  if ($protocolInvolved) {
    Enter-Phase $script:TelCtx.Clock "export"
    $export = Invoke-Flow "协议导出.ps1" @("-FantasyRoot", $slotFantasy)
    if ($export.code -ne 0) { Write-Verdict ("GATE-FAIL | protocol export failed: " + ($export.lines -join " | ")) 1 }
  }

  # 候选提交先于基线同步(merge 要干净树)、先于双端自检(自检须跑在同步后的树上,见判定块 ①);
  # 两仓槽位提交都不验票,凭据由同步后的自检签发、在 集成交付 push 点验。
  # -MessageFile 的存在性与主题格式已在流程开头前置校验
  Enter-Phase $script:TelCtx.Clock "commit"
  if ($script:Server -and (Get-GitLines $slotFantasy "status --porcelain").Count -gt 0) {
    $commit = Invoke-Flow "单仓提交.ps1" @("-RepoDir", $slotFantasy, "-MessageFile", $MessageFile, "-All")
    if ($commit.code -ne 0) { Show-Detail $commit.lines; Write-Verdict ("BLOCKED-COMMIT | fantasy | " + (Get-LastVerdict $commit.lines)) $commit.code }
  }
  if ((Get-GitLines $slotRoot "status --porcelain").Count -gt 0) {
    $commit = Invoke-Flow "单仓提交.ps1" @("-RepoDir", $slotRoot, "-MessageFile", $MessageFile, "-All")
    if ($commit.code -ne 0) { Show-Detail $commit.lines; Write-Verdict ("BLOCKED-COMMIT | client | " + (Get-LastVerdict $commit.lines)) $commit.code }
  }

  # ---- 基线自动同步(任一仓落后即执行;根因见上方「基线同步判定」①) ----
  # 序列:判两侧都动过的生成域 →(客户端落后时)客户端 merge 基线 →(Fantasy 落后时)Fantasy 同步
  # → 重导命中的生成域 → 重导产物合为一次【流程】提交。
  # 客户端落后即 merge;Fantasy 落后即同步(无本分支提交快进,有则 merge;判据见上方判定块 ③)。
  # 位置在候选提交之后、双端自检之前:merge 需要干净树,而自检凭据须锚定同步后的最终树。
  # 冲突分流用共享库 Resolve-MergeConflicts(hooks\hook函数库.ps1),与 集成交付 的合并阶段
  # 同一份实现——同一个冲突在「同步基线」与「合并进 main」两处遇上,结局必须一致。此前本块
  # 自带一套弱分流(只认 Luban 生成物,其余一律停机),放宽触发条件后那套会把合并阶段本可
  # 自动化解的冲突提前拦成停机,故一并换掉。
  if ($script:NeedBaselineSync) {
    Enter-Phase $script:TelCtx.Clock "sync"
    # 合并前判重导哪些生成域:两侧 = 合并前的 HEAD(候选提交已落)与基线。不落后的仓 merge-base 即基线,
    # 基线侧为空,不贡献命中。产物冲突随后无条件取 ours,由这里判出的重导覆盖(不变量见 校验库 GenDomains)。
    # 这道判据不可由自检替代:旧表源导出的旧表名在槽位内完全自洽,前缀核对与跨端核对都判 PASS
    # (实发 2026-08-19 dev1:落后 6 个提交,重导把双端生成物退回旧表名,自检全 PASS)。
    $sideC = Get-MergeSidePaths $slotRoot "HEAD" $baseC
    if (-not $sideC.ok) { Write-Verdict ("INFRA | 生成域改动面查询失败:" + $sideC.note + ",无法判定同步后要重导哪些生成物") 2 }
    $sideF = if ($script:Server) { Get-MergeSidePaths $slotFantasy "HEAD" $baseF } else { @{ ok = $true; ours = @(); theirs = @(); note = "" } }
    if (-not $sideF.ok) { Write-Verdict ("INFRA | 生成域改动面查询失败:" + $sideF.note + ",无法判定同步后要重导哪些生成物") 2 }
    $reDomains = Select-GenDomainsBothTouched $sideC.ours $sideC.theirs $sideF.ours $sideF.theirs
    $reKinds = (@($reDomains | ForEach-Object { $_.Name }) -join "与")
    if ($reDomains.Count -gt 0) { Write-Host ("INFO 基线同步:本轮与基线都动过的生成域 = " + $reKinds + ",同步后按合并树重导") }
    if ($clientBehindN -gt 0) {
      $mh = Invoke-GitMerged $slotRoot "rev-parse -q --verify MERGE_HEAD"
      if ($mh.code -eq 0) {
        Write-Verdict "INFRA | 槽位残留未完结的合并态(MERGE_HEAD 在),人工 git merge --abort 后重跑本入口" 2
      }
      Write-Host ("INFO 基线同步:git merge " + $baseC)
      $mg = Invoke-GitMerged $slotRoot ("merge --no-edit " + $baseC)
      $unmerged = Get-GitLines $slotRoot "-c core.quotepath=false diff --name-only --diff-filter=U"
      if ($mg.code -ne 0 -and $unmerged.Count -eq 0) {
        Write-Verdict ("INFRA | 基线 merge 失败且无冲突清单:" + (($mg.lines | Select-Object -Last 3) -join " | ")) 2
      }
      if ($unmerged.Count -gt 0) {
        # $AllowMarkerResolve = $false:本块的冲突恒是新鲜的(merge 刚发生),不存在「会话已解决、
        # 等脚本收尾」的重入路径,故不认「无标记 = 已解决」——那会误吞 delete/modify 类冲突。
        # -TableSourceReplayed 才把表源正则(含 配置表说明.md)递进去(缺省空 = 这类冲突照常停机)。
        $tableRe = ""
        if ($TableSourceReplayed) { $tableRe = $script:LubanTableSourceRe }
        $flow = Resolve-MergeConflicts $slotRoot (Get-GenOutputRe "Client") $false $script:BinaryAssetRe $tableRe
        if ($flow -ne "") {
          # abort 成败按现场核实,括注如实写进 VERDICT(判据与实发见 hook函数库 Invoke-MergeAbort)
          $ab = Invoke-MergeAbort $slotRoot
          if ($flow -eq "INFRA-RESOLVE") {
            Write-Verdict ("INFRA | 基线同步冲突分流时 git 执行失败(" + $ab.note + ")") 2
          } elseif ($flow -like "BINARY|*") {
            $script:TelCtx.Files = @($flow.Substring(7) -split ',\s*')
            Write-Verdict ("BLOCKED-BASELINE-CONFLICT | 基线同步撞二进制资产冲突(" + $ab.note + "):" + $flow.Substring(7) + "。二进制无法机械化解,交用户裁定后重跑本入口") 3
          } else {
            # 表源/表文档在清单里时补出完整的下一步命令:重放之后仍会撞同一个冲突(xlsx 是二进制,
            # 配置表说明.md 则因本轮改动与基线侧改动行段紧邻而 hunk 重叠;两者 git 判冲突都只看两边
            # 相对祖先都变了,不看 ours 是否已是 theirs 的超集),必须带 -TableSourceReplayed
            # 重跑才化解得掉。不写出来的话调用方会照上一版文案重放、重跑、再撞同一处(实发两次)。
            # 重放**不含重导**:同步基线后本入口按生成域判据自己双端重导,会话在同步前重导是白做,
            # 且把一份基于未同步树的生成物塞进候选提交、徒增一轮取 ours 冲突分流。
            $rest = $flow.Substring(5)
            $script:TelCtx.Files = @($rest -split ',\s*')
            $hint = "。表源与配置表说明.md 的冲突以 " + $baseC + " 版为基重放本轮改动(git checkout " + $baseC + " -- <冲突文件> 后在其上重做本轮编辑;不要在槽位重导表——本入口同步基线后自动双端重导),代码冲突按现场裁定;处置后重跑本入口"
            if (@($rest -split ',\s*') | Where-Object { $_ -match $script:LubanTableSourceRe }) {
              $hint = $hint + " 并加 -TableSourceReplayed(重放使 ours 成为基线版的超集,该开关据此声明取 ours 无损;未重放就加 = 丢掉基线侧的表改动)"
            }
            Write-Verdict ("BLOCKED-BASELINE-CONFLICT | 基线同步撞真实冲突(" + $ab.note + "):" + $rest + $hint) 3
          }
        }
        $cm = Invoke-GitMerged $slotRoot "commit --no-edit"
        if ($cm.code -ne 0) { Write-Verdict ("INFRA | 基线 merge 提交失败:" + (($cm.lines | Select-Object -Last 3) -join " | ")) 2 }
        Write-Host "INFO 基线同步:冲突已机械化解并收尾"
      }
    }
    # ---- Fantasy 侧基线同步(Fantasy 落后即做;判据 ③ 见上方判定块)----
    # 重导按客户端新表源产出 Fantasy 生成物,而落后基线的 Fantasy 分支上,服务端业务代码仍在
    # 读旧表的字段名——新生成物 + 旧消费方 = 服务端自检编译失败,且报错文件与本轮改动毫无关系,
    # 只能靠人识破再手动合基线(实发:剧情重构把 story_node 的 card_id 换成 segment_id 合进
    # 客户端 main,槽位 Fantasy 落后两提交,StoryReadServiceHelper 仍读 node.CardId,五处 CS1061)。
    # 不重导也要同步:跨端类检查(跨端配置核对等)读槽位 Fantasy 源码对照客户端表,客户端合进新表而
    # Fantasy 停在旧基线时,上游已成对退役的 global id 会在旧服务端代码里被判「id 不在表里」
    # (实发 2026-09-22 dev2:纯客户端任务,Fantasy 落后 3 提交,MultiClearHarvestPercent2~4 三处误拦)。
    # Fantasy 无本分支提交时只快进:不产生提交、不进合并流程、树即基线本身。有本分支提交时 merge。
    # 必须早于重导:重导后 Fantasy 树变脏,merge 会被 git 直接拒。
    # 落差沿用判定块的查询:其间只有候选提交,只加在 HEAD 一侧,不改 HEAD..基线 的落差。
    if ($fantasyBehindN -gt 0) {
      $fAheadRaw = Get-GitOne $slotFantasy ("rev-list --count " + $baseF + "..HEAD")
      if ($fAheadRaw -notmatch '^\d+$') {
        Write-Verdict ("INFRA | Fantasy 本分支提交数查询未返回数字(rev-list --count 输出「" + $fAheadRaw + "」),无法判定快进还是合并") 2
      }
      if ([int]$fAheadRaw -eq 0) {
        Write-Host ("INFO 基线同步:Fantasy 落后 " + $baseF + " " + $fBehindRaw + " 个提交且无本分支提交,快进")
        $fff = Invoke-GitMerged $slotFantasy ("merge --ff-only " + $baseF)
        if ($fff.code -ne 0) { Write-Verdict ("INFRA | Fantasy 基线快进失败:" + (($fff.lines | Select-Object -Last 3) -join " | ")) 2 }
      } else {
        $fmh = Invoke-GitMerged $slotFantasy "rev-parse -q --verify MERGE_HEAD"
        if ($fmh.code -eq 0) {
          Write-Verdict "INFRA | Fantasy 槽位残留未完结的合并态(MERGE_HEAD 在),人工 git merge --abort 后重跑本入口" 2
        }
        Write-Host ("INFO 基线同步:Fantasy 落后 " + $baseF + " " + $fBehindRaw + " 个提交,git merge " + $baseF)
        $fmg = Invoke-GitMerged $slotFantasy ("merge --no-edit " + $baseF)
        $fUnmerged = Get-GitLines $slotFantasy "-c core.quotepath=false diff --name-only --diff-filter=U"
        if ($fmg.code -ne 0 -and $fUnmerged.Count -eq 0) {
          Write-Verdict ("INFRA | Fantasy 基线 merge 失败且无冲突清单:" + (($fmg.lines | Select-Object -Last 3) -join " | ")) 2
        }
        if ($fUnmerged.Count -gt 0) {
          # 表源不在 Fantasy 仓,末位传空。
          $fflow = Resolve-MergeConflicts $slotFantasy (Get-GenOutputRe "Fantasy") $false $script:BinaryAssetRe ""
          if ($fflow -ne "") {
            $fab = Invoke-MergeAbort $slotFantasy
            if ($fflow -eq "INFRA-RESOLVE") {
              Write-Verdict ("INFRA | Fantasy 基线同步冲突分流时 git 执行失败(" + $fab.note + ")") 2
            } elseif ($fflow -like "BINARY|*") {
              $script:TelCtx.Files = @($fflow.Substring(7) -split ',\s*')
              Write-Verdict ("BLOCKED-BASELINE-CONFLICT | Fantasy 基线同步撞二进制冲突(" + $fab.note + "):" + $fflow.Substring(7) + "。二进制无法机械化解,交用户裁定后重跑本入口") 3
            } else {
              $script:TelCtx.Files = @($fflow.Substring(5) -split ',\s*')
              Write-Verdict ("BLOCKED-BASELINE-CONFLICT | Fantasy 基线同步撞真实冲突(" + $fab.note + "):" + $fflow.Substring(5) + "。按现场裁定后重跑本入口") 3
            }
          }
          $fcm = Invoke-GitMerged $slotFantasy "commit --no-edit"
          if ($fcm.code -ne 0) { Write-Verdict ("INFRA | Fantasy 基线 merge 提交失败:" + (($fcm.lines | Select-Object -Last 3) -join " | ")) 2 }
          Write-Host "INFO 基线同步:Fantasy 冲突已机械化解并收尾"
        }
      }
    }
    # ---- 同步后重导命中的生成域 → 一次收口提交 ----
    # 各域先全部重导落地,再经 Save-SyncReExport 一次提交:下方 服务端自检 编译的是整棵 Fantasy 树,任一域
    # 还没重导,合进来的上游服务端代码就会撞上本侧旧生成物(实发 2026-09-24 C26 dev1:按类各收口、表在前
    # 时,收口里的自检撞上协议仍是本侧旧版)。客户端提交面 = 命中域的源 ∪ 产物(导表 bat
    # 另 copy ConfigSystem.cs 邻位的 ExternalTypeUtil.cs,只有 GenClientRe 的 GameProto/ 前缀盖得住它)。
    if ($reDomains.Count -gt 0) {
      Enter-Phase $script:TelCtx.Clock "reexport"
      $reErr = Invoke-GenReExport $slotRoot $slotFantasy $reDomains
      if ($reErr) { Write-Verdict ("GATE-FAIL | 基线同步后重导" + $reKinds + "失败:" + $reErr) 1 }
      Save-SyncReExport $slotRoot $slotFantasy $reKinds (Get-GenDomainRe $reDomains "Client" -Surface)
    }
  }

  # ---- 双端自检(同步后的最终树;根因见判定块 ①)----
  # 服务端:本分支(候选提交 + 基线同步重导)相对基线有改动即跑,签发的凭据由 集成交付 在 push 点严格验树。
  # 快进同步的纯客户端任务 Fantasy 三点 diff 为空,不跑。
  $fantasyPaths = if ($script:Server) { Get-ChangedPaths $slotFantasy $baseF } else { @() }
  if ($fantasyPaths.Count -gt 0) {
    Enter-Phase $script:TelCtx.Clock "sgate"
    $serverGate = Invoke-Flow "服务端自检.ps1" @("-FantasyRoot", $slotFantasy)
    if ($serverGate.code -ne 0) { Show-Detail $serverGate.lines; Write-Verdict ("GATE-FAIL | " + (Get-LastVerdict $serverGate.lines)) 1 }
  }

  $clientPaths = Get-ChangedPaths $slotRoot $baseC
  # 跑不跑客户端自检按「改动碰没碰各道扫描的读取面」判(客户端验证面 = 校验库 ClientSurfaceRe,与
  # 集成交付 push 点验票同口径),不按「改没改代码」判:多数道次读的是 prefab / 表数据 / ProjectSettings /
  # .bat 等非代码文件,按代码判时只改这些的交付一道扫描都不跑就合并。
  $clientGateRequired = @($clientPaths | Where-Object { $_ -match $script:ClientSurfaceRe }).Count -gt 0
  if ($clientGateRequired) {
    Enter-Phase $script:TelCtx.Clock "cgate"
    $clientGate = Invoke-Flow "客户端自检.ps1" @("-ProjectDir", $projectDir)
    if ($clientGate.code -ne 0) { Show-Detail $clientGate.lines; Write-Verdict ("GATE-FAIL | " + (Get-LastVerdict $clientGate.lines)) 1 }
    # 「测试代码一律临时」条款(正本 = devflow-client 卡「自检」节)的执行点:删除时机 = 检查真
    # 通过,故紧跟自检 PASS 之后。
    # 测试目录被 .gitignore 忽略,删除不产生 git 变更、无需补提交;清理防的是槽位内逐批累积
    # (累积的旧测试会随代码演进失效,届时以「与本次改动无关的失败」卡住交付并指错排查方向)。
    # 树漂移由验凭据的临时测试删除容忍度承接(单一源 = 校验库 ScratchRe / Test-TicketCoversTree)。
    $cleanup = Invoke-Flow "临时测试清理.ps1" @("-ProjectDir", $projectDir)
    if ($cleanup.code -ne 0) { Show-Detail $cleanup.lines; Write-Verdict ("INFRA | temporary test cleanup failed: " + (($cleanup.lines | Select-Object -Last 1))) 2 }
  }

  # ---- 出处期望清单 = 双仓本分支的一父链(--first-parent) ----
  # 合并预检 A2 拿它与 ahead 全集比对。清单若同取 ahead 全集,比对对象与期望出自同一次 git 查询,
  # 恒过、形同虚设(此前即如此)。一父链是本分支自己落下的提交:claim 占位、会话实现、本入口的候选
  # 提交与基线同步合并/重导提交都在链上;基线同步合并的第二父侧全在基线内,不入 ahead。于是 ahead
  # 超出一父链的部分 = 只经某次合并的第二父才可达、又不在基线里的提交——即从别的分支(如另一个槽位
  # 分支、未入基线的上游)并进来的外来提交,预检判 blocker 停机。
  # 拦不住的(结构上无独立记录可比):直接提交在本分支一父链上的外来提交(如别的会话误在本槽位里
  # commit)。客户端侧另有「最早一条须是 claim 占位」的前置校验(见上方 BLOCKED-PROVENANCE)。
  Enter-Phase $script:TelCtx.Clock "integrate"   # 出处清单 + 集成交付 整段
  $expectedFile = New-FlowTempFile "slot-deliver-expected"
  $expected = @()
  foreach ($hash in (Get-GitLines $slotRoot ("log --first-parent --format=%H " + $baseC + "..HEAD"))) { $expected += [string]$hash }
  if ($script:Server) {
    foreach ($hash in (Get-GitLines $slotFantasy ("log --first-parent --format=%H " + $baseF + "..HEAD"))) { $expected += [string]$hash }
  }
  [System.IO.File]::WriteAllLines($expectedFile, [string[]]$expected, (New-Object System.Text.UTF8Encoding($false)))

  $deliverArgs = @("-Slot", $Slot, "-ExpectedCommitsFile", $expectedFile)
  if ($protocolInvolved) { $deliverArgs += "-Protocol" }
  if ($NoDeploy) { $deliverArgs += "-NoDeploy" }
  if ($RepoRoot) { $deliverArgs += @("-RepoRoot", $RepoRoot) }
  if ($FantasyRoot) { $deliverArgs += @("-FantasyRoot", $FantasyRoot) }
  if ($SlotBase) { $deliverArgs += @("-SlotBase", $SlotBase) }
  $delivery = Invoke-Flow "集成交付.ps1" $deliverArgs
  if ($delivery.code -ne 0) {
    Show-Detail $delivery.lines
    Write-Host $script:StopNote
  }
  $deliveryLine = Get-LastVerdict $delivery.lines
  Write-Host ("VERDICT: " + (Format-VerdictLine $deliveryLine))
  Write-EntryVerdictTelemetry "槽位交付" $deliveryLine $delivery.code $script:TelCtx
  exit $delivery.code
} catch {
  Write-Verdict ("INFRA | " + $_.Exception.Message) 2
} finally {
  # 各出口(Write-Verdict 的 exit 亦然)都经此删本脚本自建的临时件;子流程 集成交付 早已退出,不再读它们。
  Remove-FlowTempFiles
}

