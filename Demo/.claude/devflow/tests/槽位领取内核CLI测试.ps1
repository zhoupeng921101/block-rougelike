# 槽位领取内核CLI测试.ps1 — 固定槽位池 git 领用内核的 CLI 层测试(黑盒断言,不依赖内部实现)。
# 覆盖 acquire 主路径:ACQUIRED / 简报入 body / FULL / QUEUE(范围重叠)/ 钉槽(空闲·占用·越界)/
#   陈旧占位清理(龄超阈·tracked dirty 跳过·untracked 照清)/ 龄未到不清 / untracked 保留领取 / tracked 未提交改动(双仓)判占用 /
#   并发领同一槽仅一方成功(FLOW_TEST_CLAIM_GATE 注入点)/ 同主题重复领取拦截(同会话·钉槽·异主题·先于 QUEUE)/
#   Fantasy 有领先则拒 / topic 守卫(缺·双给·空·来自文件)/ Tools\Luban junction 复核(实体目录·已正确·指错·重建失败)。
# 护栏遥测(读各夹具隔离 LOCALAPPDATA,按 JSON 解析):现场查询查成记 guard-ok、查不成记 degraded、槽位缺件判 broken
#   走不到查询两样都不记(1b / 1q / 1r,护栏名按槽位分),
#   junction 复核重建成 / 已正确记 guard-ok、重建失败记 degraded、目标缺失两样都不记(19b / 20b / 21b / 1c)。
# (-Release 回滚路径由 tests\槽位领取测试.ps1 覆盖,本套专注 acquire。)
#
# 配置注入点:把被测内核与其依赖复制到 %TEMP% 下的一份 devflow 副本,并写一份**显式**
# flow-config.psd1(Resolve-FlowRoots 对显式值一律优先,这是既定的测试注入方式)。
# 不触真仓、不触真 claude-wf-3b(LOCALAPPDATA 一并隔离)。
# 跑法:槽位领取内核CLI测试.ps1 [-Target <实现路径>]   缺省 = 上级目录的 槽位领取内核.ps1
[CmdletBinding(PositionalBinding=$false)]
param([string]$Target = "")
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "槽位领取内核.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }
$targetLeaf = [System.IO.Path]::GetFileName($Target)

function Add-Commit([string]$Root, [string]$Subject, [switch]$Empty, [double]$WhenEpoch = 0) {
  if (-not $Empty) { G $Root "add -A" | Out-Null }
  $old = $env:GIT_COMMITTER_DATE
  if ($WhenEpoch -gt 0) { $env:GIT_COMMITTER_DATE = ([int64]$WhenEpoch).ToString() + " +0000" }
  try {
    $e = if ($Empty) { "--allow-empty " } else { "" }
    G $Root "commit -q $e-m ""$Subject""" | Out-Null
  } finally {
    if ($null -eq $old) { Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue } else { $env:GIT_COMMITTER_DATE = $old }
  }
}

$script:fx = $null
$script:oldLad = $env:LOCALAPPDATA
# $NormalSlotMax:0 = 不写该键(验证缺键兜底 = 全池正序,旧行为);> 0 = 写入,验证常规任务硬限。
function New-Fixture([int]$SlotCount = 3, [int]$NormalSlotMax = 0) {
  $tmp = Join-Path $env:TEMP ("flowtest-acquire-" + [Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $tmp | Out-Null
  $script:fx = $tmp
  $env:LOCALAPPDATA = Join-Path $tmp "AppData"

  $mainC = Join-Path $tmp "main-client"
  $mainF = Join-Path $tmp "main-fantasy"
  New-GitRepo $mainC "Demo/Assets/GameLogic/.gitkeep"
  New-GitRepo $mainF "examples/Server/.gitkeep"
  Write-F $mainC ".gitignore" "block-server/`n" | Out-Null
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m ""chore: ignore server dir""" | Out-Null

  $pool = Join-Path $tmp "slots"
  $slots = @()
  foreach ($n in 1..$SlotCount) {
    $s = Join-Path $pool "block-client-dev$n"
    G $mainC "worktree add -q -b agent/dev$n ""$s"" main" | Out-Null
    G $mainF "worktree add -q -b agent/dev$n ""$(Join-Path $s 'block-server')"" main" | Out-Null
    $slots += $s
  }

  # devflow 副本 + 显式配置
  $df = Join-Path $tmp "devflow"
  New-Item -ItemType Directory -Force -Path (Join-Path $df "hooks") | Out-Null
  Copy-Item (Join-Path $dfDir "hooks\hook函数库.ps1") (Join-Path $df "hooks") -Force
  foreach ($f in @("看板.ps1", "槽位领取内核.ps1")) {
    $src = Join-Path $dfDir $f
    if (Test-Path $src) { Copy-Item $src $df -Force }
  }
  $cfg = @"
@{
  RepoRoot         = '$($mainC -replace "'","''")'
  FantasyRoot      = '$($mainF -replace "'","''")'
  ServerDirName    = 'block-server'
  SlotBaseDir      = '$($pool -replace "'","''")'
  SlotDirPrefix    = 'block-client-dev'
  SlotCount        = '$SlotCount'
  SlotBranchPrefix = 'agent/dev'
  SlotRootRe       = '-dev[1-9]$'
  ClientBaseline   = 'main'
  FantasyBaseline  = 'main'
  StaleClaimHours  = '24'
  BoardRelPath     = 'claude-wf-3b\board.json'
$(if ($NormalSlotMax -gt 0) { "  NormalSlotMax    = '$NormalSlotMax'`n" })}
"@
  [System.IO.File]::WriteAllText((Join-Path $df "flow-config.psd1"), $cfg, (New-Object System.Text.UTF8Encoding($true)))
  return @{ tmp = $tmp; mainC = $mainC; mainF = $mainF; pool = $pool; slots = $slots; df = $df }
}

function Invoke-Kernel($F, [hashtable]$Opt) {
  $exe = Join-Path $F.df $targetLeaf
  $argv = @()
  if ($Opt.ContainsKey('Topic'))     { $argv += @('-Topic', [string]$Opt.Topic) }
  if ($Opt.ContainsKey('TopicFile')) { $argv += @('-TopicFile', [string]$Opt.TopicFile) }
  if ($Opt.ContainsKey('BriefFile')) { $argv += @('-BriefFile', [string]$Opt.BriefFile) }
  if ($Opt.ContainsKey('Slot'))      { $argv += @('-Slot', [string]$Opt.Slot) }
  if ($Opt.ContainsKey('PreferNoUnity') -and $Opt.PreferNoUnity) { $argv += '-PreferNoUnity' }
  # 清单走文件 —— 锚定外层 槽位领取.ps1 实际使用的通道。曾以逗号连接成单实参,而经 -File 起子进程时
  # [string[]] 绑定不按逗号拆分,多条路径会退化成一条含逗号的长串;当时用例每次只传一条,长串与单条
  # 等价,故测试全绿而真实多条路径的重叠比对恒不命中。
  if ($Opt.ContainsKey('Paths')) {
    $pf = Join-Path $F.tmp ("paths-" + [Guid]::NewGuid().ToString("N") + ".txt")
    [System.IO.File]::WriteAllLines($pf, [string[]]@($Opt.Paths), (New-Object System.Text.UTF8Encoding($false)))
    $argv += @('-PathsFile', $pf)
  }
  if ($Opt.ContainsKey('FantasyPaths')) {
    $ff = Join-Path $F.tmp ("fxpaths-" + [Guid]::NewGuid().ToString("N") + ".txt")
    [System.IO.File]::WriteAllLines($ff, [string[]]@($Opt.FantasyPaths), (New-Object System.Text.UTF8Encoding($false)))
    $argv += @('-FantasyPathsFile', $ff)
  }
  $lines = @(& (Get-FlowEngine) -NoProfile -File $exe @argv 2>&1 | ForEach-Object { [string]$_ })
  $code = $LASTEXITCODE
  return @{ code = $code; out = ($lines -join "`n") }
}
function Get-AheadSubjects([string]$Slot) {
  return @((G $Slot "log --format=%s main..HEAD") | Where-Object { $_ -and $_.Trim() })
}
# 跑一次内核,另回这一次新增的护栏行(degraded / guard-ok;读当前夹具的隔离 LOCALAPPDATA,经夹具库 Get-TelRows)。
function Invoke-KernelTel($F, [hashtable]$Opt) {
  $n0 = @(Get-TelRows).Count
  $r = Invoke-Kernel $F $Opt
  $rows = @(Get-TelRows | Select-Object -Skip $n0 | Where-Object { $_.event -eq "degraded" -or $_.event -eq "guard-ok" })
  return @{ code = $r.code; out = $r.out; guard = $rows }
}
function Get-GuardRows($R, [string]$Event, [string]$GuardPrefix) {
  return @($R.guard | Where-Object { $_.event -eq $Event -and ([string]$_.guard).StartsWith($GuardPrefix, [System.StringComparison]::Ordinal) })
}

Write-Host "== 槽位领取内核 CLI 测试 target=$targetLeaf =="
try {
  # 1. 领取首个空闲槽
  $F = New-Fixture
  $r = Invoke-KernelTel $F @{ Topic = "领取测试" }
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED" -and (Get-AheadSubjects $F.slots[0]) -join "|" -eq "claim: 领取测试") "1 领取首个空闲槽 -> ACQUIRED + 恰 1 条 claim"
  # 护栏遥测:三个候选槽的现场查询都走到且查成 -> 各记 guard-ok(护栏名按槽位分);夹具主仓没有 Tools\Luban(skipped)
  # -> junction 复核两样都不记;没有 degraded。
  $sqOk = @(Get-GuardRows $r "guard-ok" "slot-state-query/")
  $sqGuards = @($sqOk | ForEach-Object { [string]$_.guard } | Sort-Object -Unique)
  Assert-True ($sqGuards.Count -eq 3 -and ($sqGuards -join ",") -eq "slot-state-query/dev1,slot-state-query/dev2,slot-state-query/dev3" -and @($sqOk | Where-Object { $_.src -ne "槽位领取内核" }).Count -eq 0) ("1b 槽位现场查询查成 -> 每个槽一个护栏名记 guard-ok(来源 槽位领取内核)| " + ($sqGuards -join ","))
  Assert-True (@($r.guard | Where-Object { $_.event -eq "degraded" }).Count -eq 0 -and @(Get-GuardRows $r "guard-ok" "luban-junction/").Count -eq 0) "1c 没有降级;junction 目标缺失(skipped)不算走到,不记"
  Remove-Fixture

  # 1q. 槽位现场查询失败(dev1 索引损坏,status 报错)-> 按不可用槽处置、领 dev2;原 WARN 照打,另记 degraded
  # (key slot-state-query-failed / guard slot-state-query/dev1),dev2 那次查询照记 guard-ok。
  $F = New-Fixture
  $idx = Join-Path ((G $F.slots[0] "rev-parse --absolute-git-dir")[0].Trim()) "index"
  [System.IO.File]::WriteAllBytes($idx, [byte[]](1..24))
  $r = Invoke-KernelTel $F @{ Topic = "查询失败换槽" }
  $sqDeg = @(Get-GuardRows $r "degraded" "slot-state-query/dev1")
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 2 " -and $r.out -match ("(?m)^WARN slot-state-query-failed " + [regex]::Escape($F.slots[0]) + " : ")) "1q 查询失败:原 WARN 文案照打,换领 dev2"
  Assert-True ($sqDeg.Count -ge 1 -and $sqDeg[0].key -eq "slot-state-query-failed" -and ([string]$sqDeg[0].detail).StartsWith($F.slots[0], [System.StringComparison]::OrdinalIgnoreCase) -and @(Get-GuardRows $r "guard-ok" "slot-state-query/dev1").Count -eq 0) ("1q2 记 degraded(guard slot-state-query/dev1)且该槽不记 guard-ok | " + $(if ($sqDeg.Count) { $sqDeg[0].detail } else { "无" }))
  Assert-True (@(Get-GuardRows $r "guard-ok" "slot-state-query/dev2").Count -ge 1) "1q3 别的槽查成照记 guard-ok"
  Remove-Fixture

  # 1r. 候选槽的 Fantasy worktree 缺失(删掉 dev1 的 block-server\.git)-> 直接判 broken、领 dev2;现场查询走不到,
  # dev1 的 slot-state-query 两样都不记,别的槽照记 guard-ok,整次没有 degraded。
  $F = New-Fixture
  [System.IO.File]::Delete((Join-Path $F.slots[0] "block-server\.git"))
  $r = Invoke-KernelTel $F @{ Topic = "缺服务端换槽" }
  # 领成时 broken 槽静默跳过(INFO broken 只在 FULL 时列),dev1 本是首个空闲槽,换领 dev2 即判了 broken。
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 2 " -and $r.out -notmatch 'WARN') "1r Fantasy worktree 缺失:判 broken 跳过、不打 WARN,换领 dev2"
  $sq1 = @(Get-GuardRows $r "guard-ok" "slot-state-query/dev1") + @(Get-GuardRows $r "degraded" "slot-state-query/dev1")
  Assert-True ($sq1.Count -eq 0 -and @(Get-GuardRows $r "degraded" "slot-state-query/").Count -eq 0 -and @(Get-GuardRows $r "guard-ok" "slot-state-query/dev2").Count -ge 1) ("1r2 走不到现场查询 -> dev1 两样都不记、整次无 degraded,dev2 照记 guard-ok | dev1 行数 " + $sq1.Count)
  Remove-Fixture

  # 1b/1c/1d. 免启任务反序扫槽,与常规任务相向取槽。免启侧**不隔离**:高号槽占满时必须能
  # 一路回落到低号槽,否则「这头满了那头空着却领不到」——那正是分池要避免的。
  # (常规侧的单向硬限另见 1e/1f;此三例的夹具不写 NormalSlotMax,同时兼作缺键兜底的回归。)
  $F = New-Fixture 4
  $r = Invoke-Kernel $F @{ Topic = "常规任务" }
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 1 ") "1b 不传 -PreferNoUnity -> 正序扫,选 dev1"
  Remove-Fixture

  $F = New-Fixture 4
  $r = Invoke-Kernel $F @{ Topic = "免启任务"; PreferNoUnity = $true }
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 4 ") "1c 传 -PreferNoUnity -> 反序扫,选 dev4"
  Remove-Fixture

  $F = New-Fixture 4
  foreach ($n in 1..3) { Add-Commit $F.slots[$n] "wip: 真活" -Empty }
  $r = Invoke-Kernel $F @{ Topic = "免启任务"; PreferNoUnity = $true }
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 1 ") "1d 高号端占满 -> 一路回落到 dev1(非隔离)"
  Remove-Fixture

  # 1e/1f. NormalSlotMax 单向硬限:常规任务不越界(占满即 FULL,哪怕高号槽空着),
  # 免启任务不受该键约束。两条成对——只测前者会让「免启也被限住」这种反向回归漏网。
  $F = New-Fixture 4 2
  foreach ($n in 0..1) { Add-Commit $F.slots[$n] "wip: 真活" -Empty }
  $r = Invoke-Kernel $F @{ Topic = "常规任务" }
  Assert-True ($r.code -eq 4 -and $r.out -match "FULL" -and $r.out -match "dev1\.\.dev2") `
    "1e 常规任务在 dev1..NormalSlotMax 占满 -> FULL,不延伸到空着的 dev3/dev4"
  Remove-Fixture

  $F = New-Fixture 4 2
  foreach ($n in 0..1) { Add-Commit $F.slots[$n] "wip: 真活" -Empty }
  $r = Invoke-Kernel $F @{ Topic = "免启任务"; PreferNoUnity = $true }
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 4 ") "1f 同配置下免启任务不受硬限,仍反序取 dev4"
  Remove-Fixture

  # 2. 简报写入 claim body(含 # 标题;占位仍为空提交)
  $F = New-Fixture
  Write-F $F.tmp "brief.txt" "目的:验证续接源`n## 方案`n带 # markdown 标题的简报正文"
  $bf = Join-Path $F.tmp "brief.txt"
  $r = Invoke-Kernel $F @{ Topic = "带简报"; BriefFile = $bf }
  $body = ((G $F.slots[0] "log -1 --format=%b HEAD") -join "`n").Trim()
  $treeSame = (((G $F.slots[0] "diff --name-only HEAD~1 HEAD") | Where-Object { $_ -and $_.Trim() }).Count -eq 0)
  Assert-True ($r.code -eq 0 -and (Get-AheadSubjects $F.slots[0]) -join "|" -eq "claim: 带简报" -and $body -match "目的:验证续接源" -and $body -match "## 方案" -and $treeSame) "2 简报入 body(# 标题保留)且占位仍为空提交"
  Remove-Fixture

  # 2b/2c. 会话身份 trailer 随 claim 落 git(看板行丢失时占用面板据此兜底显示会话名)。
  # 环境变量显式设/清:内核经子进程继承本进程环境,不控就随「测试跑在哪个 harness 里」飘。
  $savedClaudeSid = $env:CLAUDE_CODE_HOST_SESSION_ID
  $savedDshSid    = $env:DSH_SESSION_ID
  try {
    $env:DSH_SESSION_ID = $null
    $env:CLAUDE_CODE_HOST_SESSION_ID = "local_ut_session_9f9f"
    $F = New-Fixture
    Write-F $F.tmp "brief.txt" "目的:验证身份落 git`n## 方案`n正文"
    $r = Invoke-Kernel $F @{ Topic = "带身份"; BriefFile = (Join-Path $F.tmp "brief.txt") }
    $body = ((G $F.slots[0] "log -1 --format=%b HEAD") -join "`n")
    $split = Split-ClaimBody $body
    $treeSame = (((G $F.slots[0] "diff --name-only HEAD~1 HEAD") | Where-Object { $_ -and $_.Trim() }).Count -eq 0)
    Assert-True ($r.code -eq 0 -and $split.sessionId -eq "local_ut_session_9f9f" -and $split.brief -match "目的:验证身份落 git" -and $split.brief -notmatch "Session-Id" -and $treeSame) "2b 会话身份入 claim body 且可原样剥回简报(占位仍为空提交)"
    Remove-Fixture

    $env:CLAUDE_CODE_HOST_SESSION_ID = $null
    $F = New-Fixture
    $r = Invoke-Kernel $F @{ Topic = "无身份" }
    $body = ((G $F.slots[0] "log -1 --format=%b HEAD") -join "`n")
    Assert-True ($r.code -eq 0 -and $body -notmatch "Session-Id") "2c 无 harness 注入(CLI 直调)-> 不写空 trailer"
    Remove-Fixture
  } finally {
    $env:CLAUDE_CODE_HOST_SESSION_ID = $savedClaudeSid
    $env:DSH_SESSION_ID = $savedDshSid
  }

  # 3. 满池
  $F = New-Fixture
  foreach ($s in $F.slots) { Add-Commit $s "wip: 真活" -Empty }
  $r = Invoke-Kernel $F @{ Topic = "T" }
  Assert-True ($r.code -eq 4 -and $r.out -match "FULL") "3 三槽全占 -> FULL exit 4"
  Remove-Fixture

  # 4. 范围重叠 -> QUEUE
  $F = New-Fixture
  Write-F $F.slots[0] "Demo/Assets/GameLogic/Mail.cs" "public class Mail {}`n" | Out-Null
  Add-Commit $F.slots[0] "feat: 邮件"
  $r = Invoke-Kernel $F @{ Topic = "T"; Paths = @("Demo/Assets/GameLogic") }
  Assert-True ($r.code -eq 3 -and $r.out -match "QUEUE dev1") "4 范围重叠 -> QUEUE dev1 exit 3"
  Remove-Fixture

  # 4a. 重叠只落在占用槽的未提交改动上 -> 仍须 QUEUE
  # footprint = 基线三点 diff + dirty,dirty 分支此前无用例;串行资源(Luban 表等)在别的会话
  # 尚未提交时就该拦住,否则两个槽位并行改同一张二进制表、合并时只能取一边。
  $F = New-Fixture
  Write-F $F.slots[0] "Demo/Assets/GameLogic/Mail.cs" "public class Mail {}`n" | Out-Null
  Add-Commit $F.slots[0] "feat: 占位"
  Write-F $F.slots[0] "Configs/GameConfig/Datas/itemdef.xlsx" "binary-ish`n" | Out-Null
  $r = Invoke-Kernel $F @{ Topic = "T"; Paths = @("Configs/GameConfig/Datas") }
  Assert-True ($r.code -eq 3 -and $r.out -match "QUEUE dev1") "4a 重叠落在占用槽未提交改动 -> QUEUE dev1 exit 3"
  Remove-Fixture

  # 4b. 多条路径,重叠只落在末条 -> 仍须 QUEUE
  # 真实调用一次给十来条前缀;此前每个用例只给一条,恰好绕开了「多条退化成一条长串」的失效面。
  $F = New-Fixture
  Add-Commit $F.slots[0] "claim: 占位" -Empty
  Write-F $F.slots[0] "Demo/Assets/AssetRaw/UI/Prefabs/UIMergeOrderPanel.prefab" "prefab-ish`n" | Out-Null
  $r = Invoke-Kernel $F @{ Topic = "T"; Paths = @(
    "Demo/Assets/GameScripts/HotFix/GameLogic/Config",
    "Configs/GameConfig",
    "Demo/Assets/AssetRaw/UI/Prefabs/UIMergeOrderPanel.prefab") }
  Assert-True ($r.code -eq 3 -and $r.out -match "QUEUE dev1") "4b 多条路径末条重叠 -> QUEUE dev1 exit 3"
  Remove-Fixture

  # 4c. 路径含空格 -> 仍须 QUEUE(且不得因参数绑定失败而崩)
  # 含空格的实参经 -File 会被拆成多个 argv,后半段错绑成参数名;走文件通道后不再有这一层。
  $F = New-Fixture
  Add-Commit $F.slots[0] "claim: 占位" -Empty
  Write-F $F.slots[0] "Demo/Assets/Project Files/Data/Characters/C1.asset" "asset-ish`n" | Out-Null
  $r = Invoke-Kernel $F @{ Topic = "T"; Paths = @(
    "Demo/Assets/GameScripts/HotFix/GameLogic/Config",
    "Demo/Assets/Project Files/Data") }
  Assert-True ($r.code -eq 3 -and $r.out -match "QUEUE dev1") "4c 含空格路径重叠 -> QUEUE dev1 exit 3"
  Remove-Fixture

  # 5. 钉槽:空闲
  $F = New-Fixture
  $r = Invoke-Kernel $F @{ Topic = "T"; Slot = "2" }
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 2" -and (Get-AheadSubjects $F.slots[1]) -join "|" -eq "claim: T") "5 钉槽空闲 -> ACQUIRED 2"
  Remove-Fixture

  # 6. 钉槽:占用
  $F = New-Fixture
  Add-Commit $F.slots[0] "wip: 真活" -Empty
  $r = Invoke-Kernel $F @{ Topic = "T"; Slot = "1" }
  Assert-True ($r.code -eq 1 -and $r.out -match "pinned slot occupied") "6 钉槽占用 -> ABORT exit 1"
  Remove-Fixture

  # 7. 钉槽:越界
  $F = New-Fixture
  $r = Invoke-Kernel $F @{ Topic = "T"; Slot = "9" }
  Assert-True ($r.code -eq 2 -and $r.out -match "1\.\.3") "7 钉槽越界 -> exit 2"
  Remove-Fixture

  # 8. 陈旧占位清理
  $F = New-Fixture
  $old = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() - 100 * 3600
  Add-Commit $F.slots[0] "claim: 陈旧占位" -Empty -WhenEpoch $old
  $r = Invoke-Kernel $F @{ Topic = "新任务" }
  Assert-True ($r.code -eq 0 -and $r.out -match "CLEANED dev1") "8 陈旧占位(龄超阈)-> 自动清理后领取"
  Remove-Fixture

  # 9/9b/9c/9d. 陈旧占位 + tracked 未提交改动 -> 不 reset(自动清理不代丢改动):跳过该槽、改动保留、
  # WARN 点名槽位与 dirty 数,领取落到别的空闲槽;池里没别的空闲槽 -> 既有 FULL。untracked 不受
  # reset 影响,不算 dirty,照清(同 Test-SlotIdle 口径)。-Release 是显式放弃,带 dirty 照 reset(槽位领取测试 case3b/7)。
  $F = New-Fixture
  $old = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() - 100 * 3600
  Add-Commit $F.slots[0] "claim: 陈旧占位" -Empty -WhenEpoch $old
  Write-F $F.slots[0] "Demo/Assets/GameLogic/.gitkeep" "modified while stale`n" | Out-Null
  $r = Invoke-Kernel $F @{ Topic = "新任务" }
  $kept = ([System.IO.File]::ReadAllText((Join-Path $F.slots[0] "Demo/Assets/GameLogic/.gitkeep"))) -match "modified while stale"
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 2 " -and $r.out -notmatch "CLEANED dev1" -and $r.out -match "WARN stale-claim-dirty dev1 tracked-dirty=1" `
    -and $kept -and (Get-AheadSubjects $F.slots[0]) -join "|" -eq "claim: 陈旧占位") "9 陈旧占位带 tracked dirty -> 不清理、改动与占位保留、WARN 点名,领 dev2"
  Remove-Fixture

  $F = New-Fixture
  $old = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() - 100 * 3600
  Add-Commit $F.slots[0] "claim: 陈旧占位" -Empty -WhenEpoch $old
  Write-F (Join-Path $F.slots[0] "block-server") "examples/Server/.gitkeep" "fx modified`n" | Out-Null
  $r = Invoke-Kernel $F @{ Topic = "新任务" }
  $kept = ([System.IO.File]::ReadAllText((Join-Path $F.slots[0] "block-server/examples/Server/.gitkeep"))) -match "fx modified"
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 2 " -and $r.out -match "WARN stale-claim-dirty dev1 tracked-dirty=1" -and $kept) `
    "9b 陈旧占位仅 Fantasy 侧 tracked dirty -> 同样跳过(双仓都看)"
  Remove-Fixture

  $F = New-Fixture
  $old = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() - 100 * 3600
  Add-Commit $F.slots[0] "claim: 陈旧占位" -Empty -WhenEpoch $old
  Write-F $F.slots[0] "Demo/Assets/GameLogic/.gitkeep" "modified while stale`n" | Out-Null
  foreach ($n in 1..2) { Add-Commit $F.slots[$n] "wip: 真活" -Empty }
  $r = Invoke-Kernel $F @{ Topic = "新任务" }
  Assert-True ($r.code -eq 4 -and $r.out -match "FULL" -and $r.out -match "WARN stale-claim-dirty dev1" -and (Get-AheadSubjects $F.slots[0]) -join "|" -eq "claim: 陈旧占位") `
    "9c 陈旧 dirty 槽 + 其余全占 -> FULL,dirty 槽不动且 WARN 点名"
  Remove-Fixture

  $F = New-Fixture
  $old = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() - 100 * 3600
  Add-Commit $F.slots[0] "claim: 陈旧占位" -Empty -WhenEpoch $old
  Write-F $F.slots[0] "scratch.txt" "leftover`n" | Out-Null
  $r = Invoke-Kernel $F @{ Topic = "新任务" }
  Assert-True ($r.code -eq 0 -and $r.out -match "CLEANED dev1" -and $r.out -match "ACQUIRED 1 " -and (Test-Path (Join-Path $F.slots[0] "scratch.txt"))) `
    "9d 陈旧占位仅 untracked -> 照清并领 dev1,untracked 保留"
  Remove-Fixture

  # 10. 龄未到不清
  $F = New-Fixture
  Add-Commit $F.slots[0] "claim: 刚打的占位" -Empty
  $r = Invoke-Kernel $F @{ Topic = "T"; Slot = "1" }
  Assert-True ($r.code -eq 1 -and $r.out -match "pinned slot occupied") "10 新鲜占位 -> 不清理、仍算占用"
  Remove-Fixture

  # 11. 领用复原:untracked 保留
  $F = New-Fixture
  Write-F $F.slots[0] "scratch.txt" "leftover`n" | Out-Null
  $r = Invoke-Kernel $F @{ Topic = "自愈领取" }
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED" -and (Test-Path (Join-Path $F.slots[0] "scratch.txt"))) "11 领用复原:untracked 保留"
  Remove-Fixture

  # 12/12b/13. tracked 未提交改动 = 占用:领用的 reset --hard 会丢掉它们,故不判空闲、不领、不动
  # (口径与 占用面板 同一判据;untracked 不受 reset 影响,见 11)。
  $F = New-Fixture
  Write-F $F.slots[0] "Demo/Assets/GameLogic/.gitkeep" "modified`n" | Out-Null
  $r = Invoke-Kernel $F @{ Topic = "跳过脏槽" }
  $kept = ((Get-Content (Join-Path $F.slots[0] "Demo\Assets\GameLogic\.gitkeep") -Raw) -match "modified")
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 2 " -and $kept -and (Get-AheadSubjects $F.slots[0]).Count -eq 0) `
    "12 客户端 tracked 未提交改动 -> 不判空闲,改领 dev2,dev1 改动原样保留"
  $r = Invoke-Kernel $F @{ Topic = "钉脏槽"; Slot = "1" }
  $kept = ((Get-Content (Join-Path $F.slots[0] "Demo\Assets\GameLogic\.gitkeep") -Raw) -match "modified")
  Assert-True ($r.code -eq 1 -and $r.out -match "pinned slot occupied" -and $kept) "12b 钉住有 tracked 改动的槽 -> ABORT 占用,改动保留"
  Remove-Fixture

  $F = New-Fixture
  $fxDir = Join-Path $F.slots[0] "block-server"
  Write-F $fxDir "examples/Server/.gitkeep" "modified by fixture`n" | Out-Null
  $r = Invoke-Kernel $F @{ Topic = "服务端脏槽" }
  $fxKept = ((Get-Content (Join-Path $fxDir "examples\Server\.gitkeep") -Raw) -match "modified by fixture")
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 2 " -and $fxKept) "13 Fantasy tracked 未提交改动 -> 不判空闲,改领 dev2,改动保留"
  Remove-Fixture

  # 22. 并发领同一空闲槽只能一方成功。A 经测试注入点停在「判空闲之后、占有之前」,B 在该窗口里
  # 完整领走同一槽,再放行 A。旧协议(reset --hard 基线 -> 打占位 -> 复核叠放)下 A 的 reset 会抹掉
  # B 已通过复核的占位,两边都 ACQUIRED;占有须原子化,A 必须判被抢、不动 B 的现场。
  $F = New-Fixture
  $gate = Join-Path $F.tmp "gate"
  New-Item -ItemType Directory -Force -Path $gate | Out-Null
  $outA = Join-Path $F.tmp "a.out"
  $env:FLOW_TEST_CLAIM_GATE = $gate
  try {
    $pA = Start-Process -FilePath (Get-FlowEngine) -NoNewWindow -PassThru -RedirectStandardOutput $outA `
      -ArgumentList @('-NoProfile', '-File', ('"' + (Join-Path $F.df $targetLeaf) + '"'), '-Topic', 'raceA', '-Slot', '1')
    $null = $pA.Handle   # 5.1 须先取句柄,ExitCode 才可读
  } finally { Remove-Item Env:\FLOW_TEST_CLAIM_GATE -ErrorAction SilentlyContinue }
  $deadline = [DateTime]::UtcNow.AddSeconds(60)
  while (-not (Test-Path (Join-Path $gate "reached")) -and [DateTime]::UtcNow -lt $deadline) { Start-Sleep -Milliseconds 100 }
  $rB = Invoke-Kernel $F @{ Topic = "raceB"; Slot = "1" }
  [System.IO.File]::WriteAllText((Join-Path $gate "go"), "1")
  [void]$pA.WaitForExit(60000)
  $outAText = if (Test-Path $outA) { [System.IO.File]::ReadAllText($outA) } else { "" }
  $aAcq = ($pA.ExitCode -eq 0 -and $outAText -match "ACQUIRED")
  $bAcq = ($rB.code -eq 0 -and $rB.out -match "ACQUIRED")
  $subjects = (Get-AheadSubjects $F.slots[0]) -join "|"
  Assert-True ($bAcq -and -not $aAcq -and $pA.ExitCode -eq 1 -and $subjects -eq "claim: raceB") `
    "22 并发领同一槽 -> 仅先占者 ACQUIRED,后到者判被抢 ABORT 且不抹先占者占位(A=$($pA.ExitCode) B=$($rB.code) ahead=[$subjects])"
  Remove-Fixture

  # 23-23d. 同主题重复领取拦截:一个任务只占一个槽位(实发 2026-09-26 同会话同主题连领 dev2、dev3)。
  $savedClaudeSid = $env:CLAUDE_CODE_HOST_SESSION_ID
  $savedDshSid    = $env:DSH_SESSION_ID
  try {
    $env:DSH_SESSION_ID = $null
    $env:CLAUDE_CODE_HOST_SESSION_ID = "local_ut_dup_session"
    $F = New-Fixture
    $r1 = Invoke-Kernel $F @{ Topic = "金矿热潮R1" }
    $r2 = Invoke-Kernel $F @{ Topic = "金矿热潮R1" }
    Assert-True ($r1.code -eq 0 -and $r2.code -eq 1 -and $r2.out -match "ABORT duplicate-claim dev1" -and $r2.out -match "属本会话" `
      -and (Get-AheadSubjects $F.slots[1]).Count -eq 0 -and (Get-AheadSubjects $F.slots[2]).Count -eq 0) `
      "23 同会话同主题再领 -> ABORT duplicate-claim dev1 点明属本会话,不占第二个槽"

    $r = Invoke-Kernel $F @{ Topic = "金矿热潮R1"; Slot = "3" }
    Assert-True ($r.code -eq 1 -and $r.out -match "ABORT duplicate-claim dev1" -and (Get-AheadSubjects $F.slots[2]).Count -eq 0) `
      "23b 钉到空闲 dev3 也拦(全池扫,不限候选)"

    $r = Invoke-Kernel $F @{ Topic = "金矿热潮R2" }
    Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED 2 ") "23c 主题不同 -> 照常领 dev2(不误拦)"
    Remove-Fixture

    # 占位已有改动、范围与本次重叠:须报重复而非 QUEUE 到自己的占位上死等;占位属其他会话时点明。
    $F = New-Fixture
    Add-Commit $F.slots[0] "claim: 邮件系统" -Empty
    Write-F $F.slots[0] "Demo/Assets/GameLogic/Mail.cs" "public class Mail {}`n" | Out-Null
    $r = Invoke-Kernel $F @{ Topic = "邮件系统"; Paths = @("Demo/Assets/GameLogic") }
    Assert-True ($r.code -eq 1 -and $r.out -match "ABORT duplicate-claim dev1" -and $r.out -notmatch "QUEUE" -and $r.out -match "属其他会话") `
      "23d 同主题占位有重叠改动 -> 报重复而非 QUEUE,点明属其他会话"
    Remove-Fixture
  } finally {
    $env:CLAUDE_CODE_HOST_SESSION_ID = $savedClaudeSid
    $env:DSH_SESSION_ID = $savedDshSid
  }

  # 14. Fantasy 有领先 -> 拒
  $F = New-Fixture
  Write-F (Join-Path $F.slots[0] "block-server") "server.txt" "real`n" | Out-Null
  Add-Commit (Join-Path $F.slots[0] "block-server") "feat: server work"
  $r = Invoke-Kernel $F @{ Topic = "T"; Slot = "1" }
  Assert-True ($r.code -eq 1 -and $r.out -match "pinned slot occupied") "14 Fantasy 有领先提交 -> 钉槽被拒"
  Remove-Fixture

  # 15-18. topic 守卫
  $F = New-Fixture
  $r = Invoke-Kernel $F @{}
  Assert-True ($r.code -eq 2 -and $r.out -match "exactly one of") "15 缺 topic -> exit 2"
  Write-F $F.tmp "t.txt" "文件主题"
  $tf = Join-Path $F.tmp "t.txt"
  $r = Invoke-Kernel $F @{ Topic = "T"; TopicFile = $tf }
  Assert-True ($r.code -eq 2 -and $r.out -match "exactly one of") "16 topic 与 topic-file 同给 -> exit 2"
  $r = Invoke-Kernel $F @{ Topic = "   " }
  Assert-True ($r.code -eq 2 -and $r.out -match "topic is empty") "17 空 topic -> exit 2"
  Write-F $F.tmp "t2.txt" "来自文件的主题"
  $tf2 = Join-Path $F.tmp "t2.txt"
  $r = Invoke-Kernel $F @{ TopicFile = $tf2 }
  Assert-True ($r.code -eq 0 -and $r.out -match "ACQUIRED" -and (Get-AheadSubjects $F.slots[0]) -join "|" -eq "claim: 来自文件的主题") "18 topic-file 领取"
  Remove-Fixture

  # 19-21. Tools\Luban junction 复核。拓扑照真仓:about.txt 入库、目录其余内容 ignored 只在主仓。
  # 主仓这条提交晚于槽位建出,领用的 reset --hard 会在槽位里按入库文件建出实体目录——
  # 正是 2026-09-10 迁移后三个槽位的形态,领用须把它换回 junction。
  $F = New-Fixture
  Write-F $F.mainC ".gitignore" "block-server/`nTools/Luban/`n"
  # 不带换行:主仓这份是夹具直写,槽位那份经 git 检出(autocrlf 下 LF 转 CRLF),两边长度不同 git 就
  # 不比内容、直接判 M。真仓两侧都是 git 检出,字节相同,没有这一层。
  Write-F $F.mainC "Tools/Luban/about.txt" "about"
  G $F.mainC "add -f Tools/Luban/about.txt" | Out-Null
  Add-Commit $F.mainC "chore: luban about"
  Write-F $F.mainC "Tools/Luban/Luban.dll" "bin`n"
  $lubanMain = Join-Path $F.mainC "Tools\Luban"
  $jLink = Join-Path $F.slots[0] "Tools\Luban"
  $r = Invoke-KernelTel $F @{ Topic = "导表任务"; Slot = "1" }
  $isJ = (Test-Path $jLink) -and ([bool]((Get-Item $jLink -Force).Attributes -band [System.IO.FileAttributes]::ReparsePoint))
  $clean = (((G $F.slots[0] "status --porcelain") | Where-Object { $_ -and $_.Trim() }).Count -eq 0)
  Assert-True ($r.code -eq 0 -and $r.out -match "luban-junction 已重建" -and $isJ -and (Test-Path (Join-Path $jLink "Luban.dll")) -and $clean) `
    "19 reset 建出实体 Tools\Luban -> 领用换成指回主仓的 junction,槽位树 clean"
  Assert-True (@(Get-GuardRows $r "guard-ok" "luban-junction/dev1").Count -eq 1 -and @(Get-GuardRows $r "degraded" "luban-junction/").Count -eq 0) "19b 重建成了 -> 记 guard-ok(guard luban-junction/dev1)"

  # 20. 已是正确 junction:再领不重建,且领用的 reset --hard 不破坏它
  G $F.slots[0] "reset -q --hard main" | Out-Null
  $r = Invoke-KernelTel $F @{ Topic = "再领"; Slot = "1" }
  $isJ = [bool]((Get-Item $jLink -Force).Attributes -band [System.IO.FileAttributes]::ReparsePoint)
  Assert-True ($r.code -eq 0 -and $r.out -notmatch "luban-junction" -and $isJ -and (Test-Path (Join-Path $lubanMain "Luban.dll"))) `
    "20 junction 已正确 -> 不出行不重建,reset --hard 后仍是 junction、主仓目标完好"
  Assert-True (@(Get-GuardRows $r "guard-ok" "luban-junction/dev1").Count -eq 1) "20b 已正确(走到、没降级)-> 同样记 guard-ok"

  # 21. junction 指向别处(迁移保留了链接却指着旧位置)-> 仅 unlink 重指,旧目标内容不动
  $stale = Join-Path $F.tmp "old-luban"
  Write-F $stale "keep.txt" "old`n"
  $jLink2 = Join-Path $F.slots[1] "Tools\Luban"
  New-Item -ItemType Directory -Force -Path (Split-Path $jLink2 -Parent) | Out-Null
  if (Test-Path $jLink2) { [System.IO.Directory]::Delete($jLink2, $true) }
  New-Item -ItemType Junction -Path $jLink2 -Target $stale | Out-Null
  $r = Invoke-Kernel $F @{ Topic = "指错"; Slot = "2" }
  $tgt = [string](@((Get-Item $jLink2 -Force).Target) | Select-Object -First 1)
  Assert-True ($r.code -eq 0 -and $r.out -match "luban-junction 已重建" -and $tgt.TrimEnd('\') -ieq $lubanMain -and (Test-Path (Join-Path $stale "keep.txt"))) `
    "21 junction 指错 -> 重指回主仓,旧目标内容保留"

  # 21b. 重建失败(实体目录里有只读的 ignored 文件,整删抛)-> 领用照常;原 WARN 照旧排在首行判定之后,
  # 另记 degraded(key luban-junction-failed / guard luban-junction/dev3),该槽不记 guard-ok。
  $roFile = Join-Path $F.slots[2] "Tools\Luban\locked.bin"
  Write-F $F.slots[2] "Tools/Luban/locked.bin" "ro"
  [System.IO.File]::SetAttributes($roFile, [System.IO.FileAttributes]::ReadOnly)
  $r = Invoke-KernelTel $F @{ Topic = "重建失败"; Slot = "3" }
  $outLines = @($r.out -split "`n")
  $warnAt = -1; for ($i = 0; $i -lt $outLines.Count; $i++) { if ($outLines[$i] -match '^WARN luban-junction 重建失败,本槽导表 bat 会报 Luban\.dll 不存在:') { $warnAt = $i; break } }
  $jDeg = @(Get-GuardRows $r "degraded" "luban-junction/dev3")
  Assert-True ($r.code -eq 0 -and $outLines[0] -match '^ACQUIRED 3 ' -and $warnAt -gt 0) ("21b 重建失败:领用照常、首行仍是 ACQUIRED,原 WARN 在其后(第 " + $warnAt + " 行)")
  Assert-True ($jDeg.Count -eq 1 -and $jDeg[0].key -eq "luban-junction-failed" -and $jDeg[0].src -eq "槽位领取内核" -and $jDeg[0].detail -and @(Get-GuardRows $r "guard-ok" "luban-junction/dev3").Count -eq 0) ("21b2 记 degraded、不记 guard-ok | " + $(if ($jDeg.Count) { $jDeg[0].detail } else { "无" }))
  if (Test-Path -LiteralPath $roFile) { [System.IO.File]::SetAttributes($roFile, [System.IO.FileAttributes]::Normal) }
  Remove-Fixture
}
finally {
  Remove-Fixture
  $env:LOCALAPPDATA = $script:oldLad
}

Write-Host ""
Exit-TestSuite
