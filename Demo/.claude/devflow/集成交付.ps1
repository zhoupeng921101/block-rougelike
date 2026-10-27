# 集成交付.ps1 - 交付段一键收尾:devflow 认可交付脚本之一(另一个是 单仓提交.ps1)。
# devflow 任务只由 槽位交付.ps1 在检查 PASS 后内部调用,不属于 Agent 面入口。它替代手打的
# push 槽位分支 → 合并预检 → 双仓合并 → 合并后重导 → 推送闭环 → 部署 → 清看板 全序列。
# 临时测试不在本脚本:其目录被 .gitignore 忽略、从不入库,删除由 槽位交付 在检查 PASS 后调
# 临时测试清理 完成,不产生 git 变更,故这里既无删测提交、也无需在出处比对里认它。检查由外层 槽位交付.ps1 承载;自审仍是 Agent 职责。本脚本只验凭据
# (与提交检查同源,hooks/校验库.ps1)。姿态 失败即停:校验不过或异常即停。
#
# 可重入状态机:每次运行从 git 现场推导已完成步骤并跳过(幂等),故 BLOCKED/CONFLICT
# 处置后重跑本脚本即续走。断点续走约定:
#   - CONFLICT / CONFLICT-FANTASY:会话解决冲突文件(只改文件不跑 git)后重跑,脚本
#     检测 MERGE_HEAD 在且无未合并路径则补合并收尾提交续走;
#   - BLOCKED-BINARY:脚本 merge --abort 并核实现场(未生效则 VERDICT 如实写明、合并态留在现场;
#     并按条件补偿撤销本轮 Fantasy 合并),交用户裁定;
#   - 部署判据兼顾遗留:除本轮 serverInvolved 外,还比对 main Fantasy HEAD 与上次成功部署 sha
#     (<Fantasy>\.gate\deployed-sha.txt);上一轮崩在部署前的已合并改动,本轮 client-only 重入也会补部署。
#     部署/重导收尾构建前先停旧开发服,消除"旧服务器锁 Bin 输出"的构建失败。
#     停服到验活整段持本机部署锁(hook函数库 Enter-DeployLock),并发交付的部署点排队;排到时
#     开发服在跑且已部署 sha 以本轮 HEAD 为祖先则跳过重启(deployed=covered:<sha>)。
#     部署点构建被并发合并判 STALE(服务端自检 出口码 3)时持锁对新 HEAD 重跑,次数上限与理由见第 10 步注释。
#
# 合并冲突机械分流(正本 = devflow 卡 references/slot-protocol.md「槽位交付·冲突分流」):生成物(校验库
# GenDomains 登记的各域产物;协议产物另由 genours 驱动在 git 层取 ours)冲突一律取 ours,由第 8 步按合并树
# 重导覆盖,双仓同口径;OpCode.Lock 账本不设驱动,冲突照常留会话(编号冲突必须被看见);二进制资产 abort;
# 其余代码文件留现场交会话解决。
#
# 用法:集成交付.ps1 -Slot <N|路径> -ExpectedCommitsFile <hash清单文件>
#                        [-Protocol] [-CheckOnly]
#   -ExpectedCommitsFile:预期提交清单(每行一个 hash),原样交 合并预检 A2 做出处比对;
#     槽位交付 传的是双仓本分支一父链(构成与能拦 / 拦不住什么见 槽位交付 该块注释)。
#   -Protocol:交接件「涉及端」含协议时传入(每次重跑都要传);未传而分支 diff 命中
#     协议生成域 → 失败即停 中止列证据。它只管声明核验与服务端涉及判定,合并后重导与否按第 8 步的生成域判据。
# 退出码:0 DELIVERED / CHECK-PASS;1 push 点校验拒绝;2 infra/参数/git 执行错;
#         3 BLOCKED/CONFLICT(明细+下一步,判断回会话)。末行恒为 `VERDICT: ...`。
[CmdletBinding(PositionalBinding=$false)]
param(
  [Parameter(Mandatory = $true)][string]$Slot,
  [string]$ExpectedCommitsFile = "",
  [switch]$Protocol,
  [switch]$CheckOnly,
  [switch]$NoDeploy,       # 跳过部署点(服务端自检/服务端重启 由会话手动跑;测试亦用)
  [string]$RepoRoot = "",  # 缺省读 flow-config(参数缺省惯例,与 合并预检 同款)
  [string]$FantasyRoot = "",
  [string]$SlotBase = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\校验库.ps1")

$script:SlotN = ""
$script:FantasyMergedThisRun = $false
$script:BoardOk = $true
# 遥测(event=集成交付,每个 VERDICT 出口一行):verdict(抬头首词)/ slot / exit 之外记 detail(正文前 200 字)、
# phases(lockwait = 集成锁与部署锁的等待合计 / precheck = 合并预检 / regen_build = 合并后重导收尾构建 /
# deploy_build = 部署点构建,含 STALE 重跑 / restart = 部署点停旧与起新;没走到的段不写)、files(冲突或重叠路径,
# 至多 10 条)、blockers(BLOCKED-PRECHECK 时合并预检判出 blocker 的段别 A / A2 / B / C / D)、run(交付关联号,
# 经 槽位交付 调用时才有,见 hook函数库 Get-DeliverRunId)。只记不改,写不进也不影响结论。
$script:TelClock = New-PhaseClock
$script:TelFiles = @()
$script:TelBlockers = @()

function Set-Board([string]$Stage) {
  # 看板非权威,失败不阻断(BoardOk 只用于末尾提示);CheckOnly 零副作用不登记看板
  if ($CheckOnly) { return }
  try {
    & (Join-Path $PSScriptRoot "看板.ps1") -Slot $script:SlotN -Stage $Stage 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { $script:BoardOk = $false }
  } catch { $script:BoardOk = $false }
}

function Close-Board {
  try {
    & (Join-Path $PSScriptRoot "看板.ps1") -Slot $script:SlotN -Close 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { $script:BoardOk = $false }
  } catch { $script:BoardOk = $false }
}

function Undo-FantasyMergeIfSafe {
  # 半合并补偿:仅撤销「本轮刚执行、主 Fantasy 树 clean、且未推送」的合并(规范正本 = devflow 卡
  # references/slot-protocol.md「合并原则」)。
  # 回到本轮合并前记下的 sha,且只在 HEAD 的一父正是它时(= HEAD 就是本轮那次合并):不用 ORIG_HEAD——
  # 任何 reset / merge 都会改写它,指向的未必是本轮合并之前。
  # $mainFantasy / $baseF 取主流程顶层(= script 作用域)的赋值;本函数只在合并已执行
  # (FantasyMergedThisRun 为真)时才走到实体逻辑,那时两者必已赋值。
  if (-not $script:FantasyMergedThisRun) { return "" }
  $fx = $mainFantasy
  $pre = $script:FantasyPreMergeHead
  try { $dirty = Get-GitLinesChecked $fx "status --porcelain" } catch { return ("Fantasy 合并未撤销(状态查询失败:" + $_.Exception.Message + ")") }
  if ($dirty.Count -gt 0) { return "Fantasy 合并未撤销(树不 clean)" }
  $local = Get-GitOne $fx "rev-parse HEAD"
  $originMain = Get-GitOne $fx ("rev-parse origin/" + $baseF)
  if ($originMain -and $local -eq $originMain) { return "Fantasy 合并未撤销(已推送,不回退)" }
  # 本轮合并的两种形态:真合并(HEAD 一父 = 合并前)或快进(HEAD = 槽位 Fantasy tip)。都不是即 HEAD 已被别处改动。
  $parent1 = Get-GitOne $fx "rev-parse HEAD~1"
  $slotTip = Get-GitOne $slotFantasy "rev-parse HEAD"
  if (-not $pre -or ($parent1 -ne $pre -and $local -ne $slotTip)) { return ("Fantasy 合并未撤销(HEAD 已不是本轮合并:HEAD " + $local + ",合并前 " + $pre + ")") }
  $r = Invoke-GitMerged $fx ("reset --hard " + $pre)
  if ($r.code -eq 0) { $script:FantasyMergedThisRun = $false; return ("已补偿撤销本轮 Fantasy 合并(reset --hard 合并前 " + $pre.Substring(0, 8) + ")") }
  return ("Fantasy 合并补偿失败:" + ($r.lines -join " "))
}

function Invoke-PushRetry([string]$Repo, [string]$GitArgs, [string]$Label, [string]$BoardStage, [string]$Tail = "") {
  # 三个推送点同一姿态:失败重试一次,仍失败即停(不强推,处置后重跑本脚本续走)
  $r = Invoke-GitMerged $Repo $GitArgs
  if ($r.code -eq 0) { return }
  $r = Invoke-GitMerged $Repo $GitArgs
  if ($r.code -ne 0) { Write-Verdict ("BLOCKED-PUSH | " + $Label + " push 两次失败:" + ($r.lines -join " ") + $Tail) 3 $BoardStage }
}

function Write-Verdict([string]$Line, [int]$Code, [string]$BoardStage = "") {
  if ($BoardStage) { Set-Board $BoardStage }
  try {
    $tel = @{ event = "集成交付"; verdict = ($Line -split '\s')[0]; slot = $script:SlotN; exit = $Code }
    $vf = Get-VerdictTelemetryFields $Line
    if ($vf.detail) { $tel.detail = $vf.detail }
    $ph = Get-PhaseSecs $script:TelClock
    if ($ph.Count -gt 0) { $tel.phases = $ph }
    $tf = @(@($script:TelFiles) | Where-Object { $_ } | Select-Object -First 10 | ForEach-Object { ([string]$_).Trim() })
    if ($tf.Count -gt 0) { $tel.files = $tf }
    if (@($script:TelBlockers).Count -gt 0) { $tel.blockers = @($script:TelBlockers) }
    $runId = Get-DeliverRunId
    if ($runId) { $tel.run = $runId }
    Write-Telemetry $tel
  } catch {}
  if (-not $script:BoardOk) { Write-Host "INFO 看板更新失败(非权威,不影响交付结论)" }
  Write-Host ""
  Write-Host ("VERDICT: " + $Line)
  exit $Code
}

# ---- 合并冲突分流 ----
# 实现已下沉共享库 hooks\hook函数库.ps1(Resolve-MergeConflicts / Resolve-GenConflicts /
# Add-MarkerResolved + $script:OpLockRe / $script:BinaryAssetRe),本脚本经点源链取用。
# 下沉理由:槽位交付.ps1 的基线同步块要同一套分流——同一类冲突在「合并进 main」与「同步基线」
# 两个时机遇上,处置只能有一种。路径规则与裁决语义正本 = slot-protocol「槽位交付·冲突分流」。

function Get-Ahead([string]$Repo, [string]$Base) { return (Get-GitLinesChecked $Repo ("log --format=%H " + $Base + "..HEAD")) }

function Get-SlotMergeSides([string]$Repo, [string]$SlotRepo, [string]$Base) {
  # 主仓并入本槽分支的那次真合并的两侧改动面(一父 = 并入前的 main,二父 = 槽位 tip);快进或本仓未并入 →
  # 两侧空。从一父链现场找回、不靠进程内状态:第 8 步中途崩了重跑,合并提交仍在链上,判据照样算得出。
  # 只找未推送段(origin/<基线>..HEAD):槽位 tip 没动的后续交付(如这轮只交 Fantasy)不会认回上一轮已推送的合并。
  # 格式只取 %P(单个 %):参数经 cmd /c,成对的 % 会被当环境变量展开。
  $tip = Get-GitOne $SlotRepo "rev-parse HEAD"
  if (-not $tip) { return @{ ok = $false; ours = @(); theirs = @(); note = ("槽位 HEAD 取不到(" + $SlotRepo + ")") } }
  foreach ($l in (Get-GitLines $Repo ("log --first-parent --merges --format=%P origin/" + $Base + "..HEAD"))) {
    $p = @(([string]$l).Trim() -split '\s+')
    if ($p.Count -ge 2 -and $p[1] -eq $tip) { return (Get-MergeSidePaths $Repo $p[0] $p[1]) }
  }
  return @{ ok = $true; ours = @(); theirs = @(); note = "" }
}

try {
  # --- 0. 解析槽位与配置 ---
  $cfg = Get-FlowConfig
  # 服务端通道关闭(hook函数库 Test-ServerEnabled)时,下文碰服务端仓的各步一律跳过:服务端侧视同无改动、无票、无部署。
  $script:Server = Test-ServerEnabled
  $needKeys = @("RepoRoot", "SlotBaseDir", "SlotDirPrefix", "SlotBranchPrefix", "ClientBaseline")
  if ($script:Server) { $needKeys += @("FantasyRoot", "FantasyBaseline") }
  foreach ($k in $needKeys) {
    if (-not $cfg[$k]) { Write-Verdict ("INFRA | flow-config.psd1 缺键 " + $k) 2 }
  }
  $slotBaseDir = if ($SlotBase) { $SlotBase } else { $cfg.SlotBaseDir }
  if ($Slot -match '^\d+$') {
    $slotDir = Join-Path $slotBaseDir ($cfg.SlotDirPrefix + $Slot)
    $script:SlotN = $Slot
  } else {
    $slotDir = $Slot.TrimEnd('\', '/')
    if ((Split-Path $slotDir -Leaf) -match 'dev(\d+)$') { $script:SlotN = $Matches[1] }
    else { Write-Verdict ("INFRA | 槽位路径无法折出编号:" + $slotDir) 2 }
  }
  $slotFantasy = if ($script:Server) { Join-Path $slotDir $cfg.ServerDirName } else { "" }
  $branch = $cfg.SlotBranchPrefix + $script:SlotN
  $mainClient = if ($RepoRoot) { $RepoRoot } else { $cfg.RepoRoot }
  $mainFantasy = if (-not $script:Server) { "" } elseif ($FantasyRoot) { $FantasyRoot } else { $cfg.FantasyRoot }
  $baseC = $cfg.ClientBaseline
  $baseF = $cfg.FantasyBaseline
  if (-not (Test-Path $slotDir) -or ($script:Server -and -not (Test-Path (Join-Path $slotFantasy ".git")))) {
    Write-Verdict ("INFRA | 槽位或其 Fantasy worktree 缺失:" + $slotDir) 2
  }
  $branchPairs = @(, @($slotDir, $branch))
  if ($script:Server) { $branchPairs += , @($slotFantasy, $branch) }
  foreach ($pair in $branchPairs) {
    $cb = Get-GitLines $pair[0] "branch --show-current"
    if ($cb.Count -eq 0 -or $cb[0].Trim() -ne $pair[1]) {
      Write-Verdict ("INFRA | " + $pair[0] + " 当前分支不是 " + $pair[1]) 2
    }
  }
  if (-not $ExpectedCommitsFile -or -not (Test-Path $ExpectedCommitsFile)) {
    Write-Verdict "INFRA | 须传 -ExpectedCommitsFile(交接件预期提交清单,每行一个 hash)" 2
  }
  if (-not $CheckOnly) { Set-Board "交付中" }

  # --- 0.5 集成锁(第 1 步归属核验到第 9 步推送闭环整段;理由与锁序见 hook函数库 本机互斥锁节) ---
  # 取锁在一切现场推导之前:排到锁时别的交付可能已合并推送,ahead / MERGE_HEAD / main 前进都须在锁内读。
  # 第 10 步部署点前放锁(部署另持 deploy 锁)。-CheckOnly 零写入不取锁。
  $script:IntegrateLock = $null
  if (-not $CheckOnly) {
    $script:IntegrateLock = Enter-FlowLock "integrate" $mainClient ("集成交付 dev" + $script:SlotN)
    Add-PhaseMs $script:TelClock "lockwait" ([double]$script:IntegrateLock.waitedSec * 1000)
    if (-not $script:IntegrateLock.ok) { Write-Verdict ("INFRA | 集成未开始(零写入):" + $script:IntegrateLock.note + "。持有方完成或异常退出后重跑本交付") 2 "阻塞:集成锁超时" }
  }

  # --- 1. 现场态推导(可重入基石) ---
  $clientAhead = Get-Ahead $slotDir $baseC
  $fantasyAhead = @(); $mainFxAheadOrigin = @()
  if ($script:Server) {
    $fantasyAhead = Get-Ahead $slotFantasy $baseF
    # 注意:Get-GitLines 以逗号保护返回数组,再套 @() 会双重包裹(空数组变单元素),勿加
    $mainFxAheadOrigin = Get-GitLinesChecked $mainFantasy ("log --format=%H origin/" + $baseF + ".." + $baseF)
  }
  $serverInvolved = ($fantasyAhead.Count -gt 0) -or ($mainFxAheadOrigin.Count -gt 0) -or [bool]$Protocol
  Write-Host ("INFO slot=" + $script:SlotN + " clientAhead=" + $clientAhead.Count + " fantasyAhead=" + $fantasyAhead.Count + " serverInvolved=" + $serverInvolved + " protocol=" + [bool]$Protocol)

  # 合并中途态归属核验(先于一切写动作):下游第 5 步见 MERGE_HEAD 即跳过预检、第 6/7 步把无冲突
  # 标记的文件 add 后提交。MERGE_HEAD 不是本槽分支 tip(用户在主仓手动合并上游到一半等)时,
  # 照走就会替发起方把那次合并提交掉,故双仓逐一核对,不符即停,不碰现场。
  $mergeSides = @(, @($mainClient, $slotDir, "客户端主仓"))
  if ($script:Server) { $mergeSides += , @($mainFantasy, $slotFantasy, "主 Fantasy") }
  foreach ($side in $mergeSides) {
    $mhPath = Join-Path $side[0] ".git\MERGE_HEAD"
    if (-not (Test-Path $mhPath)) { continue }
    $mh = @([System.IO.File]::ReadAllLines($mhPath) | ForEach-Object { ([string]$_).Trim() } | Where-Object { $_ })
    $tip = (Get-GitLines $side[1] "rev-parse HEAD")[0].Trim()
    if ($mh.Count -ne 1 -or $mh[0] -ne $tip) {
      Write-Verdict ("BLOCKED-PRECHECK | " + $side[2] + " 处于非本槽发起的合并中途态:MERGE_HEAD=" + ($mh -join ",") + " 不是本槽 " + $branch + " tip=" + $tip + "。未做任何写动作;由该合并的发起方完成或 merge --abort 后重跑本脚本") 3 "阻塞:他方合并中途"
    }
  }

  # 协议交叉核验(失败即停):未声明 -Protocol 而分支改动范围命中协议生成域
  if (-not $Protocol -and $clientAhead.Count -gt 0) {
    $footprint = Get-GitLinesChecked $slotDir ("-c core.quotepath=false diff " + $baseC + "...HEAD --name-only")
    $protoHit = @($footprint | Where-Object { $_ -match $script:ProtocolGenClientRe })
    if ($protoHit.Count -gt 0) {
      Write-Verdict ("BLOCKED-PROTOCOL-UNDECLARED | 分支改动范围命中协议生成域(如 " + (@($protoHit | Select-Object -First 3) -join ", ") + ")而未传 -Protocol;请带 -Protocol 重跑(重导收尾按协议路径走)") 3 "阻塞:协议未声明"
    }
  }

  # --- 2.5 交付清单(呈报证据机械产出;消费方 = devflow 卡「呈报交接」证据条) ---
  # 双仓分支改动范围(基线三点 diff;临测增删相抵不入列)写 <slot>\.gate\deliver-manifest.json,
  # DELIVERED verdict 尾部以 report= 指向,呈报只抄不另跑 git。重入尾轮(ahead 均 0)
  # 保留早轮清单不覆盖;.gate 已被仓库 ignore,不入树。
  $manifestPath = Join-Path $slotDir ".gate\deliver-manifest.json"
  if (-not $CheckOnly -and ($clientAhead.Count -gt 0 -or $fantasyAhead.Count -gt 0)) {
    $cFiles = Get-GitLines $slotDir ("-c core.quotepath=false diff --name-status " + $baseC + "...HEAD")
    $fFiles = @()
    $manifest = [ordered]@{
      slot = $script:SlotN; branch = $branch; protocol = [bool]$Protocol
      client = [ordered]@{
        tip = (Get-GitLines $slotDir "rev-parse HEAD")[0].Trim()
        subjects = (Get-GitLines $slotDir ("log --reverse --format=%s " + $baseC + "..HEAD"))
        files = @($cFiles)
      }
    }
    if ($script:Server) {
      $fFiles = Get-GitLines $slotFantasy ("-c core.quotepath=false diff --name-status " + $baseF + "...HEAD")
      $manifest.fantasy = [ordered]@{
        tip = (Get-GitLines $slotFantasy "rev-parse HEAD")[0].Trim()
        subjects = (Get-GitLines $slotFantasy ("log --reverse --format=%s " + $baseF + "..HEAD"))
        files = @($fFiles)
      }
    }
    New-Item -ItemType Directory -Force -Path (Split-Path $manifestPath -Parent) | Out-Null
    [System.IO.File]::WriteAllText($manifestPath, ($manifest | ConvertTo-Json -Depth 5), (New-Object System.Text.UTF8Encoding($false)))
    Write-Host ("INFO 交付清单已写 " + $manifestPath + "(client " + $cFiles.Count + " 项 / fantasy " + $fFiles.Count + " 项)")
  }

  # --- 3. 槽位客户端 push 点校验 + push(重入:local==origin 即跳过) ---
  if ($clientAhead.Count -gt 0) {
    $localTip = (Get-GitLines $slotDir "rev-parse HEAD")[0].Trim()
    $originTip = ""
    $ot = Get-GitLines $slotDir ("rev-parse --verify --quiet origin/" + $branch)
    if ($ot.Count -gt 0) { $originTip = $ot[0].Trim() }
    if ($localTip -ne $originTip) {
      $branchPaths = @()
      foreach ($e in (ConvertTo-Entries (Get-GitLines $slotDir ("-c core.quotepath=false diff --name-status " + $baseC + "...HEAD")))) { $branchPaths += $e.paths }
      $branchMsgs = (Get-GitLines $slotDir ("log " + $baseC + "..HEAD --format=%B")) -join "`n"
      # 表源改动须伴随字段说明更新(与 hook push 分支同源)
      $docGap = Get-TableDocGap $branchPaths
      if ($docGap.Count -gt 0 -and $branchMsgs -notmatch '表文档无关') {
        Write-Verdict ("DENIED-tabledoc | 分支改了表源(" + (@($docGap | Select-Object -First 4) -join ", ") + ")但未同步 Configs/GameConfig/Datas/配置表说明.md。补上对应节后重跑;确无字段语义变化时在任一提交信息补「[表文档无关:理由]」") 1 "阻塞:表文档未同步"
      }
      # 说明文档不得转述表数据(与 hook push 分支同源)
      $docAdded = Get-AddedLinesInDomain $slotDir ("-U0 " + $baseC + "...HEAD") $script:TableDocHdrRe
      $docRows = @($docAdded | Where-Object { $_ -match $script:DocDataRowRe })
      if ($docRows.Count -gt 0 -and $branchMsgs -notmatch '数据快照') {
        Write-Verdict ("DENIED-docdatarow | 分支给 配置表说明.md 新增了逐行罗列表数据的表格行(" + (@($docRows | Select-Object -First 3 | ForEach-Object { $_.TrimStart('+').Trim() }) -join "  /  ") + ")。抄进文档的表数据无闸校验其与 xlsx 一致,表一改即静默过时;改为一行指向源表后重跑,确需固化时在任一提交信息补「[数据快照:理由]」") 1 "阻塞:文档转述表数据"
      }
      # 本地持久化探测(分支新增行 + 分支提交信息找白名单标注)
      $added = Get-AddedLines $slotDir ("-U0 " + $baseC + "...HEAD -- " + $script:PersistScanSpec)
      if (@($added | Where-Object { $_ -match $script:PersistRe }).Count -gt 0) {
        if ($branchMsgs -notmatch '本地白名单') {
          Write-Verdict "DENIED-persist | 分支新增代码含本地持久化调用而提交信息无「本地白名单」论证(可补一个说明性空提交后重跑)" 1 "阻塞:持久化白名单缺失"
        }
      }
      # 分支改动碰到客户端验证面(校验库 ClientSurfaceRe = 客户端自检各道读取面)才验凭据,与 槽位交付
      # 跑不跑检查同口径;claim / 文档 / 规则栈等面外提交不虚构客户端自检义务。
      $surfaceHit = @($branchPaths | Where-Object { $_ -match $script:ClientSurfaceRe })
      if ($surfaceHit.Count -gt 0) {
        $why = Get-TicketVerdict $slotDir $script:ClientSurfaceRe
        if (-not (Test-TicketVerdictPass $why)) {
          Write-Verdict ("DENIED-ticket-" + $why + " | 槽位检查凭据无效(" + $why + ")。先跑 客户端自检(PASS 发票)再重跑本脚本") 1 "待修复"
        }
      }
      if ($CheckOnly) { Write-Host "INFO CheckOnly:push 点校验通过(未 push)" }
      else {
        Invoke-PushRetry $slotDir ("push origin " + $branch) "槽位客户端" "阻塞:push 失败"
        Write-Host "INFO 槽位客户端已 push(验凭据通过)"
      }
    } else { Write-Host "INFO 槽位客户端已推平(跳过 push 点)" }
  }

  # --- 4. 槽位 Fantasy push 点验凭据 + push(重入:推平即跳过) ---
  # 槽位 Fantasy 提交自由(同槽位客户端),服务端验凭据绑在这里:槽位交付 先提交、再合基线、再自检,
  # 提交点验票会把自检逼到同步之前、跑在缺基线新增代码与锚点的树上(根因见 槽位交付 基线同步判定 ①)。
  # 分支改动碰服务端验证面(校验库 ServerSurfaceRe = 构建实际编译的面)才验;验树严格,与主仓提交点同口径。
  if ($fantasyAhead.Count -gt 0) {
    $localTip = (Get-GitLines $slotFantasy "rev-parse HEAD")[0].Trim()
    $originTip = ""
    $ot = Get-GitLines $slotFantasy ("rev-parse --verify --quiet origin/" + $branch)
    if ($ot.Count -gt 0) { $originTip = $ot[0].Trim() }
    if ($localTip -ne $originTip) {
      $fBranchPaths = Get-GitLines $slotFantasy ("-c core.quotepath=false diff --name-only " + $baseF + "...HEAD")
      $fSurfaceHit = @($fBranchPaths | Where-Object { $_ -match $script:ServerSurfaceRe })
      if ($fSurfaceHit.Count -gt 0) {
        $why = Get-TicketVerdict $slotFantasy
        if (-not (Test-TicketVerdictPass $why)) {
          Write-Verdict ("DENIED-server-ticket-" + $why + " | 槽位 Fantasy 分支含 " + $fSurfaceHit.Count + " 个服务端验证面文件而无有效服务端自检票(" + $why + ")。先跑 服务端自检.ps1 -FantasyRoot `"" + $slotFantasy + "`"(0 错 0 警发票;检查后任何改动作废票)再重跑本脚本") 1 "待修复"
        }
      }
      if ($CheckOnly) { Write-Host "INFO CheckOnly:槽位 Fantasy push 点校验通过(未 push)" }
      else {
        Invoke-PushRetry $slotFantasy ("push origin " + $branch) "槽位 Fantasy" "阻塞:push 失败"
        Write-Host "INFO 槽位 Fantasy 已 push(验凭据通过)"
      }
    } else { Write-Host "INFO 槽位 Fantasy 已推平(跳过)" }
  }

  # --- 5. 合并预检(出处比对;重入:双仓 ahead 均 0 = 已合并,跳过;任一主仓处于
  # MERGE_HEAD 中途态 = 已过预检点正在收尾,跳过——中途态的主树 porcelain 必脏,
  # 重跑预检会被 D 节误挡;MERGE_HEAD 属本槽已在第 1 步末核过) ---
  $midMerge = (Test-Path (Join-Path $mainClient ".git\MERGE_HEAD")) -or ($script:Server -and (Test-Path (Join-Path $mainFantasy ".git\MERGE_HEAD")))
  if (-not $midMerge -and ($clientAhead.Count -gt 0 -or $fantasyAhead.Count -gt 0)) {
    Write-Host "INFO 合并预检(合并预检.ps1,出处机械比对)"
    $pcSw = [System.Diagnostics.Stopwatch]::StartNew()
    $pcArgs = @("-Slot", $slotDir, "-RepoRoot", $mainClient, "-ExpectedCommits", $ExpectedCommitsFile)
    if ($script:Server) { $pcArgs += @("-FantasyRoot", $mainFantasy) }
    $pc = Invoke-FlowChild (Join-Path $PSScriptRoot "合并预检.ps1") $pcArgs
    Add-PhaseMs $script:TelClock "precheck" $pcSw.Elapsed.TotalMilliseconds
    foreach ($l in $pc.lines) { Write-Host $l }
    if ($pc.code -eq 2) { Write-Verdict "INFRA | 合并预检 参数/环境错误(输出见上)" 2 "阻塞:预检 infra" }
    if ($pc.code -ne 0) {
      # blocker 段别取自 合并预检 的 BLOCKER-SEGMENTS 行(该脚本的输出契约),进遥测 blockers 字段。
      $seg = @($pc.lines | Where-Object { ([string]$_) -match '^BLOCKER-SEGMENTS:' } | Select-Object -Last 1)
      if ($seg.Count -gt 0) { $script:TelBlockers = @((([string]$seg[0]) -replace '^BLOCKER-SEGMENTS:\s*', '') -split '\s+' | Where-Object { $_ }) }
      Write-Verdict "BLOCKED-PRECHECK | 预检有 blocker(明细见上),交用户裁定;处置后重跑本脚本" 3 "阻塞:预检 blocker"
    }
  } elseif ($midMerge) { Write-Host "INFO 主仓处于合并中途态(MERGE_HEAD),跳过预检直接收尾" }
  else { Write-Host "INFO 双仓 ahead 均 0(已合并),跳过预检与合并" }

  if ($CheckOnly) { Write-Verdict "CHECK-PASS | 校验与预检通过,零写入(合并及之后步骤未执行)" 0 }

  # --- 6. Fantasy 侧合并(重入:ahead 0 或 MERGE_HEAD 收尾;分流与客户端侧共用 Resolve-MergeConflicts) ---
  if ($script:Server -and (Test-Path (Join-Path $mainFantasy ".git\MERGE_HEAD"))) {
    $flow = Resolve-MergeConflicts $mainFantasy (Get-GenOutputRe "Fantasy") $true ""
    if ($flow -eq "") {
      $r = Invoke-GitMerged $mainFantasy "commit --no-edit"
      if ($r.code -ne 0) { Write-Verdict ("INFRA | Fantasy 合并收尾提交失败:" + ($r.lines -join " ")) 2 }
      Write-Host "INFO Fantasy 合并收尾提交完成(重入)"
    } elseif ($flow -like "CODE|*") {
      $script:TelFiles = @($flow.Substring(5) -split ',\s*')
      Write-Verdict ("CONFLICT-FANTASY | 主 Fantasy 合并冲突未解(仍含冲突标记):" + $flow.Substring(5) + "。会话解决冲突文件(只改文件)后重跑本脚本收尾") 3 "阻塞:Fantasy 冲突"
    } else { Write-Verdict "INFRA | Fantasy Luban 冲突自动分流失败" 2 }
  } elseif ($fantasyAhead.Count -gt 0) {
    # 与客户端侧同一前置:第 9 步只推 $baseF,合进别的分支会报 DELIVERED 而改动不在主分支
    $fb = (Get-GitLines $mainFantasy "branch --show-current")
    if ($fb.Count -eq 0 -or $fb[0].Trim() -ne $baseF) { Write-Verdict ("INFRA | 主 Fantasy 当前分支不是 " + $baseF) 2 }
    # 内容视角判脏(hook函数库 Get-ContentDirtyPaths,与 合并预检 B/C 段同源):status 会把行尾幻影
    # (内容零差异,如协议重导后的 OuterMessage.cs)判成脏,在这里停机即整轮交付白停。
    $dirty = Get-ContentDirtyPaths $mainFantasy
    if ($dirty.Count -gt 0) { $script:TelFiles = $dirty; Write-Verdict ("BLOCKED-OVERLAP | 主 Fantasy 树不 clean(" + $dirty.Count + " 项:" + (@($dirty | Select-Object -First 5) -join ", ") + "),不执行合并;呈报处置后重跑") 3 "阻塞:主Fantasy不净" }
    $slotTip = (Get-GitLines $slotFantasy "rev-parse HEAD")[0].Trim()
    $originTip = (Get-GitLines $slotFantasy ("rev-parse --verify --quiet origin/" + $branch))
    if ($originTip.Count -eq 0 -or $originTip[0].Trim() -ne $slotTip) { Write-Verdict "INFRA | Fantasy 分支未推平(merge 前置断言失败)" 2 }
    $script:FantasyPreMergeHead = Get-GitOne $mainFantasy "rev-parse HEAD"
    $r = Invoke-GitMerged $mainFantasy ("merge " + $branch)
    if ($r.code -ne 0) {
      # merge 失败先分「真冲突」与「git 直接拒绝(没进合并态)」:后者若走冲突分流,会以「无未合并
      # 路径」返回空串、被读作「已全部化解」而去做收尾提交,git 的真实拒绝原因被「空提交消息」类
      # 报错整条吞掉(客户端侧 2026-07-28 事故的判法,两侧对齐)。
      if (-not (Test-Path (Join-Path $mainFantasy ".git\MERGE_HEAD"))) {
        Write-Verdict ("INFRA | Fantasy merge 未能开始(git 拒绝,非冲突):" + ($r.lines -join " ") + "。呈报处置后重跑") 2
      }
      $flow = Resolve-MergeConflicts $mainFantasy (Get-GenOutputRe "Fantasy") $false ""
      if ($flow -eq "") {
        $rc = Invoke-GitMerged $mainFantasy "commit --no-edit"
        if ($rc.code -ne 0) { Write-Verdict ("INFRA | Fantasy 合并收尾提交失败:" + ($rc.lines -join " ")) 2 }
      } elseif ($flow -like "CODE|*") {
        $script:TelFiles = @($flow.Substring(5) -split ',\s*')
        Write-Verdict ("CONFLICT-FANTASY | 主 Fantasy 合并冲突:" + $flow.Substring(5) + "。会话解决后重跑本脚本") 3 "阻塞:Fantasy 冲突"
      } else { Write-Verdict "INFRA | Fantasy Luban 冲突自动分流失败" 2 }
    }
    $script:FantasyMergedThisRun = $true
    Write-Host ("INFO Fantasy 侧已合并 " + $branch)
  }

  # --- 7. 客户端侧合并(重入:ahead 0 或 MERGE_HEAD 收尾;冲突机械分流) ---
  if (Test-Path (Join-Path $mainClient ".git\MERGE_HEAD")) {
    $flow = Resolve-MergeConflicts $mainClient (Get-GenOutputRe "Client") $true $script:BinaryAssetRe
    if ($flow -eq "") {
      $r = Invoke-GitMerged $mainClient "commit --no-edit"
      if ($r.code -ne 0) { Write-Verdict ("INFRA | 客户端合并收尾提交失败:" + ($r.lines -join " ")) 2 }
      Write-Host "INFO 客户端合并收尾提交完成(重入)"
    } elseif ($flow -like "BINARY|*") {
      $ab = Invoke-MergeAbort $mainClient
      $comp = Undo-FantasyMergeIfSafe
      $script:TelFiles = @($flow.Substring(7) -split ',\s*')
      Write-Verdict ("BLOCKED-BINARY | 二进制资产冲突:" + $flow.Substring(7) + "。" + $ab.note + "。" + $comp + " 交用户裁定") 3 "阻塞:二进制冲突"
    } elseif ($flow -like "CODE|*") {
      $script:TelFiles = @($flow.Substring(5) -split ',\s*')
      Write-Verdict ("CONFLICT | 客户端合并冲突待解:" + $flow.Substring(5) + "。会话解决冲突文件(只改文件)后重跑本脚本") 3 "阻塞:客户端冲突"
    } else { Write-Verdict "INFRA | 冲突自动分流失败" 2 }
  } elseif ($clientAhead.Count -gt 0) {
    $cb = (Get-GitLines $mainClient "branch --show-current")
    if ($cb.Count -eq 0 -or $cb[0].Trim() -ne $baseC) { Write-Verdict ("INFRA | 主工作树当前分支不是 " + $baseC) 2 }
    # 执行点复核:主树未提交改动与合并触碰面重叠(预检 D 已算,此处窄窗复核)。
    # 判定单源 = hook函数库 Get-MergeOverlap(与 合并预检 D 段共用同一实现;两点/三点 diff
    # 之辨与 2026-07-28 事故记录见该函数头注)。
    $ov = Get-MergeOverlap $mainClient $slotDir $baseC
    if ($ov.overlap.Count -gt 0) {
      $script:TelFiles = $ov.overlap
      $comp = Undo-FantasyMergeIfSafe
      Write-Verdict ("BLOCKED-OVERLAP | 主树未提交改动与合并范围重叠:" + (@($ov.overlap | Select-Object -First 8) -join ", ") + "。" + $comp + " 呈报处置后重跑") 3 "阻塞:主树范围重叠"
    }
    $slotTip = (Get-GitLines $slotDir "rev-parse HEAD")[0].Trim()
    $originTip = (Get-GitLines $slotDir ("rev-parse --verify --quiet origin/" + $branch))
    if ($originTip.Count -eq 0 -or $originTip[0].Trim() -ne $slotTip) { Write-Verdict "INFRA | 客户端分支未推平(merge 前置断言失败)" 2 }
    $r = Invoke-GitMerged $mainClient ("merge " + $branch)
    if ($r.code -ne 0) {
      # merge 失败分两种,须先分开:①已进入合并态(MERGE_HEAD 在)= 真冲突,交下面的机械分流;
      # ②根本没进合并态 = git 直接拒绝(本地改动会被覆盖、前置条件不满足等)。②若也走冲突分流,
      # 分流会以「无未合并路径」返回空串、被上层读作「冲突已全部化解」,进而去做收尾提交,
      # 而此时并无 MERGE_MSG,报出的是「空提交消息」——git 的真实拒绝原因被整条吞掉
      # (2026-07-28 事故:主树未提交 .claude 改动阻断合并,VERDICT 却报 empty commit message)。
      # 同 Fantasy 侧(本脚本第 6 节)已有的判法,两侧对齐。
      if (-not (Test-Path (Join-Path $mainClient ".git\MERGE_HEAD"))) {
        $comp = Undo-FantasyMergeIfSafe
        Write-Verdict ("INFRA | 客户端 merge 未能开始(git 拒绝,非冲突):" + ($r.lines -join " ") + "。" + $comp + " 呈报处置后重跑") 2
      }
      $flow = Resolve-MergeConflicts $mainClient (Get-GenOutputRe "Client") $false $script:BinaryAssetRe
      if ($flow -eq "") {
        $r2 = Invoke-GitMerged $mainClient "commit --no-edit"
        if ($r2.code -ne 0) { Write-Verdict ("INFRA | 客户端合并收尾提交失败:" + ($r2.lines -join " ")) 2 }
        Write-Host "INFO 客户端合并冲突已全部机械化解并收尾"
      } elseif ($flow -like "BINARY|*") {
        $ab = Invoke-MergeAbort $mainClient
        $comp = Undo-FantasyMergeIfSafe
        $script:TelFiles = @($flow.Substring(7) -split ',\s*')
        Write-Verdict ("BLOCKED-BINARY | 二进制资产冲突:" + $flow.Substring(7) + "。" + $ab.note + "。" + $comp + " 交用户裁定") 3 "阻塞:二进制冲突"
      } elseif ($flow -like "CODE|*") {
        $script:TelFiles = @($flow.Substring(5) -split ',\s*')
        Write-Verdict ("CONFLICT | 客户端合并冲突:" + $flow.Substring(5) + "。会话解决冲突文件(只改文件)后重跑本脚本收尾续走") 3 "阻塞:客户端冲突"
      } else { Write-Verdict "INFRA | 冲突自动分流失败" 2 }
    } else { Write-Host ("INFO 客户端侧已合并 " + $branch) }
  }

  # --- 8. 合并后重导收尾(判据 = 校验库 GenDomains 不变量;重入安全:重导幂等,无 diff 即跳过提交) ---
  # 并入 main 是真合并(槽位同步基线后 main 又被并发交付推进)且两侧都动过某生成域时,合并树的产物可能
  # 缺一侧(冲突取了 ours = main 侧,或文本合并拼出不自洽的汇总产物),按合并树重导。槽位已同步到最新
  # main 时并入是快进,两侧之一为空,不命中。此前这里只按 -Protocol 重导协议,表的产物冲突取 main 侧后
  # 无人重导,本轮表改动的产物会丢(读码推得的缺口,未见实发)。
  $reSides = @{ F = @{ ok = $true; ours = @(); theirs = @(); note = "" } }
  $reRepos = @(, @("C", $mainClient, $slotDir, $baseC))
  if ($script:Server) { $reRepos += , @("F", $mainFantasy, $slotFantasy, $baseF) }
  foreach ($t in $reRepos) {
    $s = Get-SlotMergeSides $t[1] $t[2] $t[3]
    if (-not $s.ok) { Write-Verdict ("INFRA | 合并后重导判定失败:" + $s.note) 2 "阻塞:重导失败" }
    $reSides[$t[0]] = $s
  }
  $reDomains = Select-GenDomainsBothTouched $reSides.C.ours $reSides.C.theirs $reSides.F.ours $reSides.F.theirs
  if ($reDomains.Count -gt 0) {
    $reKinds = (@($reDomains | ForEach-Object { $_.Name }) -join "与")
    Write-Host ("INFO 合并后重导:main 与槽位都动过的生成域 = " + $reKinds + ",按合并树重导覆盖")
    $reErr = Invoke-GenReExport $mainClient $mainFantasy $reDomains
    if ($reErr) { Write-Verdict ("INFRA | 合并后重导" + $reKinds + "失败:" + $reErr) 2 "阻塞:重导失败" }
    $reSubject = "【流程】合并后重导" + $reKinds + "收尾(槽位 dev" + $script:SlotN + ")"
    # 客户端收尾:重导触及的 dirty 路径(命中域的源 ∪ 产物)
    $reClientRe = Get-GenDomainRe $reDomains "Client" -Surface
    $cDirty = @()
    $cDirty += Get-GitLinesChecked $mainClient "-c core.quotepath=false diff --name-only HEAD"
    $cDirty += Get-GitLinesChecked $mainClient "-c core.quotepath=false ls-files --others --exclude-standard"
    $cGen = @($cDirty | ForEach-Object { ([string]$_).Trim() } | Where-Object { $_ -match $reClientRe } | Select-Object -Unique)
    # Fantasy 侧只收命中域的路径,按内容视角判脏(Get-ContentDirtyPaths:行尾幻影不算)。域外的脏改动
    # (主工程通道的手工编辑等)不代提交也不带着它去构建铸票:停下交人工,不 add -A 扫进收尾提交。
    $reFantasyRe = Get-GenDomainRe $reDomains "Fantasy" -Surface
    $fDirtyAll = if ($script:Server) { Get-ContentDirtyPaths $mainFantasy } else { @() }
    $fDirty = @($fDirtyAll | Where-Object { $_ -match $reFantasyRe })
    $fForeign = @($fDirtyAll | Where-Object { $_ -notmatch $reFantasyRe })
    if ($fForeign.Count -gt 0) {
      $script:TelFiles = $fForeign
      Write-Verdict ("BLOCKED-OVERLAP | 合并后重导前主 Fantasy 有生成域外的未提交改动(" + $fForeign.Count + " 项:" + (@($fForeign | Select-Object -First 5) -join ", ") + "),不代提交;处置后重跑本脚本续走") 3 "阻塞:主Fantasy不净"
    }
    if ($cGen.Count -gt 0 -or $fDirty.Count -gt 0) {
      if ($cGen.Count -gt 0) {
        foreach ($p in $cGen) { Invoke-GitMerged $mainClient ("add -N -- `"" + $p + "`"") | Out-Null }
        $psList = New-FlowTempFile "flow-deliver-regen"
        [System.IO.File]::WriteAllLines($psList, [string[]]$cGen, (New-Object System.Text.UTF8Encoding($false)))
        $cMsg = New-FlowCommitMsgFile $reSubject
        $r = Invoke-GitMerged $mainClient ("commit -F `"" + $cMsg + "`" --pathspec-from-file=`"" + $psList + "`"")
        if ($r.code -ne 0) { Write-Verdict ("INFRA | 客户端重导收尾提交失败:" + ($r.lines -join " ")) 2 }
        Write-Host ("INFO 客户端重导收尾提交完成(" + $cGen.Count + " 项)")
      }
      if ($fDirty.Count -gt 0) {
        # Fantasy 收尾含 .cs:先跑 服务端自检 铸新凭据(post-export 树),一举兼作部署构建。
        # 构建前先停旧开发服:重导收尾构建同样锁 examples\Bin 输出(见部署点 MSB3021 文件锁注释)。
        Write-Host "INFO Fantasy 重导收尾:先停旧开发服,再 服务端自检 铸票(0 错 0 警)"
        # 停服 + 构建持部署锁:否则会停掉并发交付验活窗口里的新服,或撞它新服的 Bin 文件锁(见 hook函数库 Enter-DeployLock)。
        $regenLock = Enter-DeployLock $mainFantasy ("集成交付 dev" + $script:SlotN + " 重导收尾构建")
        Add-PhaseMs $script:TelClock "lockwait" ([double]$regenLock.waitedSec * 1000)
        if (-not $regenLock.ok) { Write-Verdict ("INFRA | 重导收尾构建未开始:" + $regenLock.note + "。持有方完成或异常退出后重跑本交付续走") 2 "阻塞:部署锁超时" }
        try {
          & (Get-FlowEngine) -NoProfile -File (Join-Path $PSScriptRoot "服务端重启.ps1") -StopOnly -FantasyRoot $mainFantasy | Out-Null
          $regenSw = [System.Diagnostics.Stopwatch]::StartNew()
          & (Get-FlowEngine) -NoProfile -File (Join-Path $PSScriptRoot "服务端自检.ps1") -FantasyRoot $mainFantasy
          $regenBuildCode = $LASTEXITCODE
          Add-PhaseMs $script:TelClock "regen_build" $regenSw.Elapsed.TotalMilliseconds
        } finally { Exit-DeployLock $regenLock }
        # 出口码 3 = STALE(构建通过、树在构建期间变了)。这里不重跑:集成锁在手,并发交付合不进来,树变只能
        # 来自交付之外对主 Fantasy 的直接改动,上面「域外无未提交改动」的前提已不保,带着它重跑会把它一并铸进票。
        if ($regenBuildCode -eq 3) { Write-Verdict "INFRA | 重导后 服务端自检 构建通过(0 错 0 警)却被判 STALE:主 Fantasy 工作树在构建期间被改动(交付之外的直接改动),不是构建失败;未签凭据,不提交 Fantasy 收尾。确认主 Fantasy 无他方进行中改动后重跑本交付续走" 2 "阻塞:重导期并发改动" }
        # 出口码 2 = 服务端自检 判 INFRA(环境类,说法分流的理由见部署点同处注释),不说成构建未过。
        if ($regenBuildCode -eq 2) { Write-Verdict "INFRA | 重导后 服务端自检 判 INFRA(环境问题,不是代码错误:构建错误行全是文件锁 / restore 类,或前置扫描自身跑不起来;原因见上方明细),未签凭据,不提交 Fantasy 收尾。文件锁类先关掉占用 Bin / 生成器 dll 的进程,restore 类先修源,再重跑本交付续走" 2 "阻塞:重导构建环境问题" }
        if ($regenBuildCode -ne 0) { Write-Verdict "INFRA | 重导后 服务端自检 构建未过(0 错 0 警),不提交 Fantasy 收尾;交人工" 2 "阻塞:重导构建失败" }
        $fList = New-FlowTempFile "flow-deliver-regen-f"
        [System.IO.File]::WriteAllLines($fList, [string[]]$fDirty, (New-Object System.Text.UTF8Encoding($false)))
        $r = Invoke-GitMerged $mainFantasy ("add --pathspec-from-file=`"" + $fList + "`"")
        if ($r.code -ne 0) { Write-Verdict ("INFRA | Fantasy 收尾 add 失败:" + ($r.lines -join " ")) 2 }
        if ((Invoke-GitMerged $mainFantasy "diff --cached --quiet").code -eq 0) {
          Write-Host "INFO Fantasy 重导零暂存差异(重写文件只动了 stat),无收尾提交"
        } else {
          $fMsg = New-FlowCommitMsgFile $reSubject
          $r = Invoke-GitMerged $mainFantasy ("commit -F `"" + $fMsg + "`"")
          if ($r.code -ne 0) { Write-Verdict ("INFRA | Fantasy 重导收尾提交失败:" + ($r.lines -join " ")) 2 }
          # 纯客户端交付也可能在这里产出 Fantasy 提交(表重导写两端):第 9 步推送与第 10 步部署按它判。
          $serverInvolved = $true
          Write-Host "INFO Fantasy 重导收尾提交完成"
        }
      }
    } else { Write-Host "INFO 重导零 diff(生成物已一致),无收尾提交" }
  }

  # --- 9. 推送闭环(重入:领先才推;失败重试一次) ---
  $pushRepos = @(, @($mainClient, $baseC, "客户端主仓"))
  if ($script:Server) { $pushRepos += , @($mainFantasy, $baseF, "主 Fantasy") }
  foreach ($t in $pushRepos) {
    $repo = $t[0]; $b = $t[1]; $label = $t[2]
    if ($repo -eq $mainFantasy -and -not $serverInvolved) { continue }
    $aheadO = Get-GitLinesChecked $repo ("log --format=%H origin/" + $b + ".." + $b)
    if ($aheadO.Count -eq 0) { Write-Host ("INFO " + $label + " 无待推送提交"); continue }
    Invoke-PushRetry $repo "push" $label "阻塞:主分支 push 失败" "。不强推,呈报处理后重跑"
    Write-Host ("INFO " + $label + " 已推送(" + $aheadO.Count + " 提交)")
  }

  Exit-FlowLock $script:IntegrateLock   # 合并与推送已闭环;部署点另持 deploy 锁,慢构建不拖住别人的合并

  # --- 10. 部署点(有未部署的服务端改动就部署:停旧服务器 -> 服务端自检 构建 -> 服务端重启) ---
  # 判据不只看本轮 serverInvolved,还比对 main Fantasy HEAD 与上次成功部署 sha(<Fantasy>\.gate\deployed-sha.txt):
  # 上一轮已合并推送 Fantasy 却崩在部署前、本轮 client-only 重入时 serverInvolved=false 会漏部署,故补 HEAD≠已部署 sha 一支。
  # 服务端通道关闭时没有开发服可部署,整段跳过(deployed=n/a)。
  $deployed = "n/a"
  $needDeploy = $false
  if ($script:Server) {
    $deployStateFile = Join-Path $mainFantasy ".gate\deployed-sha.txt"
    $lastDeployed = if (Test-Path $deployStateFile) { ([string](Get-Content $deployStateFile -Raw)).Trim() } else { "" }
    $mainFantasyHead = (Get-GitLines $mainFantasy "rev-parse HEAD")[0].Trim()
    $needDeploy = $serverInvolved -or ($lastDeployed -ne "" -and $mainFantasyHead -ne $lastDeployed)
  }
  if ($needDeploy -and $NoDeploy) { $deployed = "skipped"; Write-Host "INFO 部署点按 -NoDeploy 跳过(服务端自检/服务端重启 由会话手动跑)" }
  elseif ($needDeploy) {
    # 停旧 → 构建 → 起新 → 验活 整段持部署锁(hook函数库 Enter-DeployLock):两次交付的部署点并发时,
    # 各自的「无旧服 / 端口空闲」核对都过,后起的 Main.exe 绑端口失败 Exit(1),被报 INFRA 重启失败。
    # 子进程 服务端重启 经环境变量继承本锁,不再自取。
    $deployLock = Enter-DeployLock $mainFantasy ("集成交付 dev" + $script:SlotN + " 部署点")
    Add-PhaseMs $script:TelClock "lockwait" ([double]$deployLock.waitedSec * 1000)
    if (-not $deployLock.ok) { Write-Verdict ("INFRA | 部署点未开始(开发服未动):" + $deployLock.note + "。持有方完成或异常退出后重跑本交付续走(deployed-sha 未记,会补部署)") 2 "阻塞:部署锁超时" }
    try {
      # 持锁后重判:等锁期间并发交付可能已把含本轮提交的 HEAD 部署上去(它记的 deployed-sha 以本轮 HEAD
      # 为祖先)且开发服在跑,再停再起只是重复。deployed-sha 只在重启成功后写,记的是构建前读的 HEAD,
      # 构建中途才合入的提交不会被它覆盖,故按祖先判不会把未构建的改动判成已部署。
      $lastDeployed = if (Test-Path $deployStateFile) { ([string](Get-Content $deployStateFile -Raw)).Trim() } else { "" }
      $coveredBy = ""
      if ($lastDeployed -and (Get-DevServerProcs $mainFantasy).Count -gt 0) {
        $anc = Invoke-GitMerged $mainFantasy ("merge-base --is-ancestor " + $mainFantasyHead + " " + $lastDeployed)
        if ($anc.code -eq 0) { $coveredBy = $lastDeployed }
      }
      if ($coveredBy) {
        Write-Host ("INFO 部署点跳过:开发服在跑且已部署 " + $coveredBy.Substring(0, 8) + ",含本轮 Fantasy HEAD " + $mainFantasyHead.Substring(0, 8))
        $deployed = "covered:" + $coveredBy.Substring(0, 8)
      } else {
        # 构建前先停旧开发服:它锁 examples\Bin 输出(dll/pdb),否则 服务端自检 构建触发 MSB3021 文件锁
        # (连续两次服务端交付,第二次构建必被第一次起的开发服锁)。-StopOnly 只停不起。
        Write-Host "INFO 部署点:先停旧开发服(释放构建输出锁)"
        $stopSw = [System.Diagnostics.Stopwatch]::StartNew()
        & (Get-FlowEngine) -NoProfile -File (Join-Path $PSScriptRoot "服务端重启.ps1") -StopOnly -FantasyRoot $mainFantasy | Out-Null
        Add-PhaseMs $script:TelClock "restart" $stopSw.Elapsed.TotalMilliseconds
        # 无条件构建,不按 $Protocol 分叉。曾写作 `if (-not $Protocol)`,依据是「协议交付已由上面的
        # Fantasy 重导收尾构建过」——但那一支挂在 `$fDirty.Count -gt 0` 上:槽位里已经导过协议时,
        # 合并到主仓重导产出相同结果、无 .cs 变化,收尾整支跳过。于是两支各自假设对方会构建,
        # 一次都没构建,重启把旧 dll 拉起来,而 VERDICT 照报 deployed=yes(2026-08-20 实际显形:
        # 服务端代码已合并,开发服跑的还是两小时前的构建,症状是新加的活动入口在客户端不出现)。
        # 代价只是协议且收尾非空时多跑一次构建(服务端自检全量重编,约 30s),远小于「报已部署却跑旧代码」。
        #
        # STALE(服务端自检 出口码 3)持锁重跑,至多 $deployStaleRetryMax 次:部署锁只串行部署点、不挡合并
        # (集成锁已在第 9 步后放掉,慢构建不拖住别人的合并),构建的二三十秒里并发交付可以把提交合进
        # 主 Fantasy。自检首尾双哈希发现树变了即作废已得的 PASS——构建本身 0 错 0 警,只是受检的树已不是
        # 现在的树,没有要人工裁定的内容,对新 HEAD 再构建一遍即可。曾把非零出口一律报「构建失败」停机
        # (2026-10-08 同日两发:开发服停着等人工,而后到的那次交付排到部署锁后自己会重建重启)。
        # 重跑仍 STALE 才停机,VERDICT 点名是并发改动而非构建失败;FAIL / INFRA 不重跑。
        # 每次构建前重读 HEAD:deployed-sha 记的须是「通过的那次构建」开工前的 HEAD(等锁或上一次构建期间
        # 别的交付可能已推进 main Fantasy)。那次构建 PASS 即树全程未变,开工后才合入的提交不会被记成已部署。
        $deployStaleRetryMax = 2
        $gateCode = -1
        $staleNotes = @()
        for ($attempt = 0; $attempt -le $deployStaleRetryMax; $attempt++) {
          $mainFantasyHead = (Get-GitLines $mainFantasy "rev-parse HEAD")[0].Trim()
          if ($attempt -eq 0) { Write-Host "INFO 部署点:服务端自检 构建" }
          else { Write-Host ("INFO 部署点:服务端自检 构建(STALE 重跑 " + $attempt + "/" + $deployStaleRetryMax + ",HEAD " + $mainFantasyHead.Substring(0, 8) + ")") }
          $buildSw = [System.Diagnostics.Stopwatch]::StartNew()
          & (Get-FlowEngine) -NoProfile -File (Join-Path $PSScriptRoot "服务端自检.ps1") -FantasyRoot $mainFantasy
          $gateCode = $LASTEXITCODE
          Add-PhaseMs $script:TelClock "deploy_build" $buildSw.Elapsed.TotalMilliseconds
          if ($gateCode -ne 3) { break }
          # 点名树是怎么变的:HEAD 动了 = 期间有提交合入(并发交付的合并);HEAD 没动 = 有人在改主 Fantasy 的未提交文件。
          $headAfter = (Get-GitLines $mainFantasy "rev-parse HEAD")[0].Trim()
          if ($headAfter -ne $mainFantasyHead) { $staleNote = "HEAD " + $mainFantasyHead.Substring(0, 8) + " -> " + $headAfter.Substring(0, 8) + ",期间有提交合入" }
          else { $staleNote = "HEAD " + $mainFantasyHead.Substring(0, 8) + " 未动,未提交改动在变" }
          $staleNotes += $staleNote
          Write-Host ("INFO 部署点:构建通过但主 Fantasy 工作树在构建期间被改动(" + $staleNote + "),本次 PASS 作废")
        }
        if ($gateCode -eq 3) {
          Write-Verdict ("INFRA | 部署点 服务端自检 连续 " + $staleNotes.Count + " 次构建通过(0 错 0 警)却被判 STALE:主 Fantasy 工作树每次都在构建期间被并发改动(" + ($staleNotes -join ";") + "),不是构建失败。未重启(开发服已停),deployed-sha 未记:并发改动停下后重跑本交付即补部署,后到的交付排到部署锁时也会一并构建部署") 2 "阻塞:部署期并发改动"
        }
        # 按 服务端自检 出口码分说法:1 才是构建(或前置扫描)判出了要改的东西;2 是环境类(构建错误行全是文件锁 /
        # restore 类,或前置扫描自身跑不起来),曾同样报成「构建失败」,会让人去改没问题的代码(审计时服务端自检的
        # 13 次 INFRA 里 12 次是构建跑完才判出的锁)。重导收尾构建那处同样分流。
        if ($gateCode -eq 2) { Write-Verdict "INFRA | 部署点 服务端自检 判 INFRA(环境问题,不是代码错误:构建错误行全是文件锁 / restore 类,或前置扫描自身跑不起来;原因见上方明细):不重启(开发服已停),deployed-sha 未记。文件锁类先关掉占用 Bin / 生成器 dll 的进程,restore 类先修源,再重跑本交付补部署" 2 "阻塞:部署构建环境问题" }
        if ($gateCode -ne 0) { Write-Verdict "INFRA | 部署点 服务端自检 构建失败:不重启(开发服已停),交人工裁定修复或回滚" 2 "阻塞:部署构建失败" }
        Write-Host "INFO 部署点:服务端重启 更新重启开发服"
        # 边回显边捕获:退出码 3 = Fantasy.config 端口被本仓以外的进程占着(停服只按本仓路径匹配,
        # 另一份检出起的开发服停不到),其 PORT-OWNER 行(pid/路径/端口)要进 VERDICT 正文,不能只留在明细里。
        $startSw = [System.Diagnostics.Stopwatch]::StartNew()
        $restartOut = @(& (Get-FlowEngine) -NoProfile -File (Join-Path $PSScriptRoot "服务端重启.ps1") -FantasyRoot $mainFantasy |
          ForEach-Object { $s = [string]$_; Write-Host $s; $s })
        $restartCode = $LASTEXITCODE
        Add-PhaseMs $script:TelClock "restart" $startSw.Elapsed.TotalMilliseconds
        if ($restartCode -eq 3) {
          $owners = @($restartOut | Where-Object { $_ -match '^PORT-OWNER ' } | ForEach-Object { $_ -replace '^PORT-OWNER\s+', '' })
          Write-Verdict ("BLOCKED-PORT | 开发服端口被本仓以外的进程占用,新服未起(构建已成):" + ($owners -join ";") + "。停不停该进程由人工裁定,脚本不代停。占用解除后跑 服务端重启.ps1 即可起服(deployed-sha 未记,下次交付会再补一次部署);改为重跑本交付的,先经 占用面板.ps1 确认该槽未被重领——此刻双仓已合并,槽位按 git 判据已空闲") 3 "阻塞:端口被占"
        }
        if ($restartCode -ne 0) { Write-Verdict "INFRA | 服务端重启 失败(构建已成,未完成重启;原因见上方 服务端重启 明细),交人工处置" 2 "阻塞:重启失败" }
        # 部署成功:记本次部署的 Fantasy sha,供下轮判"是否已部署"(修上一轮崩在部署前的漏部署)。
        New-Item -ItemType Directory -Force -Path (Split-Path $deployStateFile -Parent) | Out-Null
        [System.IO.File]::WriteAllText($deployStateFile, $mainFantasyHead, (New-Object System.Text.UTF8Encoding($false)))
        $deployed = "yes"
      }
    } finally { Exit-DeployLock $deployLock }
  }

  # --- 11. 清看板 + 收尾 ---
  Close-Board
  $cSha = (Get-GitLines $mainClient "rev-parse --short HEAD")[0].Trim()
  $verdictLine = "DELIVERED merged=" + $cSha
  if ($serverInvolved) { $verdictLine += "," + (Get-GitLines $mainFantasy "rev-parse --short HEAD")[0].Trim() }
  $verdictLine += " pushed=yes deployed=" + $deployed
  if (Test-Path $manifestPath) { $verdictLine += " report=" + $manifestPath }
  Write-Verdict $verdictLine 0
} catch {
  try { Write-Telemetry @{ event = "集成交付"; decision = "error"; error = [string]$_; slot = $script:SlotN } } catch {}
  Write-Verdict ("INFRA | 内部异常:" + [string]$_) 2
} finally {
  # 各出口(Write-Verdict 的 exit 亦然)删本脚本自建的临时件、放集成锁(幂等);调用方传入的 -ExpectedCommitsFile 不碰。
  Exit-FlowLock $script:IntegrateLock
  Remove-FlowTempFiles
}

