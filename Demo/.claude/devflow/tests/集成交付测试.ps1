# 集成交付测试.ps1 - 集成交付.ps1 假仓回归矩阵(script-authoring 验收检查承载)。
# 夹具复刻真实拓扑:槽位是主仓的真 worktree(共享对象库),槽位分支 agent/dev7,基线
# 均 main(客户端仓 / Fantasy 仓各自的 main);夹具落 %TEMP%、绝不触真仓;裸 git 仅夹具搭建。跑法同 单仓提交测试。
# LOCALAPPDATA 一并隔离(看板与遥测落夹具内,不触真 claude-wf-3b),接线与理由见下方隔离段;
# 隔离生效由末尾 D13 / D13b 断言守着。遥测字段(detail / blockers / phases)读隔离遥测断言(D3b / D24b / D26e)。
$ErrorActionPreference = "Stop"

# ---- LOCALAPPDATA 隔离:必须先于下面那行 dot-source ----
# hook函数库 在载入时一次性把 $script:WfStateRoot 定成 <LOCALAPPDATA>\claude-wf-3b,载入后再改
# 环境变量对它不生效(与 hook函数库测试 同一约束),故批准标记/遥测的隔离只能在 source 前完成。
# 看板另走运行时读取(看板.ps1 每次经 Get-BoardPath 由 $env:LOCALAPPDATA 解析),被调子进程
# 继承本处设置即落隔离。缺了这段的后果是实测过的:矩阵运行的数分钟窗口内,真 board.json 里
# 存在一条 dev7 假占用行,此时看面板或读看板做判断都会读到不存在的槽位占用。
# 夹具路径按次唯一(GUID),收尾即删:固定路径 + 只在开跑清一次的老形态,遇上 git 句柄
# 短暂滞留导致清理失败时,会带着半残夹具往下跑并从中段起成片假失败(连跑两次即可复现)。
$oldLad = $env:LOCALAPPDATA
$fx = Join-Path $env:TEMP ("flowtest-fx-deliver-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $fx | Out-Null
$env:LOCALAPPDATA = Join-Path $fx "AppData"
New-Item -ItemType Directory -Force -Path $env:LOCALAPPDATA | Out-Null

. (Join-Path (Split-Path (Split-Path $PSCommandPath -Parent) -Parent) "hooks\hook函数库.ps1")
$engine = Get-FlowEngine
$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent   # .claude/devflow
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
$dfDir = Get-ServerFlowDir $dfDir $fx   # 服务端通道关闭时换成启用服务端的 devflow 副本(见夹具库同名函数)
$flowDeliver = Join-Path $dfDir "集成交付.ps1"
# 真 flow-config 驱动:主/槽位服务端夹具目录名均须与 ServerDirName 同名(见 单仓提交测试 同处注释)。
$srvDir = (Import-PowerShellDataFile (Join-Path $dfDir "flow-config.psd1")).ServerDirName
$hookLib = Join-Path $dfDir "hooks\hook函数库.ps1"
# ---- 隔离守卫(每次 Run-FD 后采样,末尾 D13 / D13b 判)----
# 只盯夹具槽位在看板上的那一行,不比整个真 board.json:并发的 devflow 会话会合法改写真看板里
# 各自的行,按整文件写入时刻判,别的会话一活跃就假失败。夹具键须留在真槽位池(flow-config
# SlotCount)之外,真会话才不会写这一行。集成交付 每次运行都写这一行(先置「交付中」,
# DELIVERED 清行,其余结论停在对应阶段不清),故采样判据是:
#   D13  真看板的夹具行与开跑前逐字相同;
#   D13b 隔离看板至少一次见到夹具行 —— 证明采样点上确有夹具行可见。缺了这条正向证据,
#        D13 在「套件不再写看板」时恒真,守卫形同虚设。
$fxBoardKey = "dev7"   # 夹具槽位 Blk-dev7(下方 $slotDir)在看板上的键;改槽位号须同改,漏改 D13b 转红
$boardRel = (Import-PowerShellDataFile (Join-Path $dfDir "flow-config.psd1")).BoardRelPath
$realBoard = Resolve-WfStatePath $boardRel $oldLad   # 真看板的物理真身(MSIX 包内),同 看板.ps1 的解析
$isoBoard = Resolve-WfStatePath $boardRel
function Get-BoardRow([string]$Path, [string]$Key) {
  # 该行的规范化 JSON 文本,供逐字比对;"<absent>" = 无文件或无此行。别的会话写真看板走
  # 临时文件 + File.Replace,替换瞬间可能读到共享冲突,故读失败短暂重试,仍失败回 "<unreadable>"。
  for ($i = 0; $i -lt 20; $i++) {
    try {
      if (-not (Test-Path $Path)) { return "<absent>" }
      $p = ([System.IO.File]::ReadAllText($Path) | ConvertFrom-Json).PSObject.Properties[$Key]
      if (-not $p) { return "<absent>" }
      return ($p.Value | ConvertTo-Json -Compress -Depth 5)
    } catch { Start-Sleep -Milliseconds 50 }
  }
  return "<unreadable>"
}
$realRowBase = Get-BoardRow $realBoard $fxBoardKey
$script:RealRowLeak = ""   # 真看板夹具行首次变化的现场(行文本 @ 当次 VERDICT);空 = 未变
$script:IsoRowSeen = $false
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")

function Run-FD([string[]]$FdArgs, [string]$Script = $flowDeliver) {
  # $Script:缺省跑真入口;部署点用例(D24 起)传夹具内的入口副本(服务端自检 / 服务端重启 换桩)。
  $out = & $engine -NoProfile -File $Script @FdArgs 2>&1 | ForEach-Object { [string]$_ }
  $code = $LASTEXITCODE
  $verdict = @($out | Where-Object { $_ -match '^VERDICT: ' } | Select-Object -Last 1)
  $v = if ($verdict.Count -gt 0) { $verdict[0] } else { "" }
  # 隔离采样:看板由 集成交付 进程内调 看板.ps1 同步写,子进程退出即全部落盘
  if ((Get-BoardRow $isoBoard $fxBoardKey) -like '{*') { $script:IsoRowSeen = $true }
  $realRow = Get-BoardRow $realBoard $fxBoardKey
  if ($realRow -ne $realRowBase -and -not $script:RealRowLeak) { $script:RealRowLeak = $realRow + " @ " + $v }
  return @{ code = $code; out = $out; verdict = $v }
}
function Expected([string]$Name, [string]$SlotDir, [string]$SlotFx) {
  # current ahead hashes of both slot repos -> expected file
  $lines = @()
  $lines += G $SlotDir "log --format=%H main..HEAD"
  $lines += G $SlotFx "log --format=%H main..HEAD"
  $lines = @($lines | Where-Object { $_ -match '^[0-9a-f]{40}$' })
  $p = Join-Path $fx $Name
  [System.IO.File]::WriteAllLines($p, [string[]]$lines, (New-Object System.Text.UTF8Encoding($false)))
  return $p
}

# ---------- fixtures: main pair + bare origins + slot worktree pair ----------
$mainC = Join-Path $fx "Main"; $bareC = Join-Path $fx "origin-c.git"
$mainF = Join-Path $fx $srvDir; $bareF = Join-Path $fx "origin-f.git"
$slotDir = Join-Path $fx "Blk-dev7"; $slotFx = Join-Path $slotDir $srvDir

New-Item -ItemType Directory -Force -Path $mainC | Out-Null
G $mainC "init -q -b main" | Out-Null
G $mainC "config user.email t@t.t" | Out-Null; G $mainC "config user.name t" | Out-Null
Write-F $mainC "README.md" "readme`n"
Write-F $mainC ".gitignore" ".gate/`n/$srvDir/`n"
Write-F $mainC "Demo/ProjectSettings/ProjectVersion.txt" "m_EditorVersion: 2022.3.0f1`n"
G $mainC "add -A" | Out-Null; G $mainC "commit -q -m init" | Out-Null
git init -q --bare $bareC
G $mainC ("remote add origin `"" + $bareC + "`"") | Out-Null
G $mainC "push -q -u origin main" | Out-Null

New-Item -ItemType Directory -Force -Path $mainF | Out-Null
G $mainF "init -q -b main" | Out-Null
G $mainF "config user.email t@t.t" | Out-Null; G $mainF "config user.name t" | Out-Null
Write-F $mainF "README.md" "fantasy`n"
Write-F $mainF ".gitignore" ".gate/`n"
G $mainF "add -A" | Out-Null; G $mainF "commit -q -m init" | Out-Null
git init -q --bare $bareF
G $mainF ("remote add origin `"" + $bareF + "`"") | Out-Null
G $mainF "push -q -u origin main" | Out-Null

G $mainC ("worktree add `"" + $slotDir + "`" -b agent/dev7") | Out-Null
G $mainF ("worktree add `"" + $slotFx + "`" -b agent/dev7") | Out-Null

$common = @("-RepoRoot", $mainC, "-FantasyRoot", $mainF, "-NoDeploy", "-Slot", $slotDir)

# ---------- D1 client-only happy path ----------
G $slotDir "commit -q --allow-empty -m `"claim: d1`"" | Out-Null
Write-F $slotDir "Demo/Assets/GameScripts/HotFix/GameLogic/W.cs" "public class W {}`n"
Write-F $slotDir "docs/d.md" "doc`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"feat: d1 work`"" | Out-Null
New-Ticket $slotDir
$e1 = Expected "e1.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e1))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED .*pushed=yes deployed=n/a') "D1 client-only delivered"
Assert-True ((G $mainC "log --format=%s -3") -join "|" -match 'd1 work') "D1 main contains work commit"
$lt = (G $mainC "rev-parse HEAD")[0]; $rt = (G $bareC "rev-parse refs/heads/main")[0]
Assert-True ($lt -eq $rt) "D1 main pushed to origin"
Assert-True (((G $slotDir "rev-parse origin/agent/dev7")[0]) -match '^[0-9a-f]{40}$') "D1 slot branch pushed"
Assert-True ($r.verdict -match ' report=') "D1 verdict carries report="
$mPath = ($r.verdict -replace '^.* report=', '')
Assert-True ((Test-Path $mPath)) "D1 delivery manifest exists"
$mTxt = if (Test-Path $mPath) { [System.IO.File]::ReadAllText($mPath) } else { "" }
Assert-True ($mTxt -match 'W\.cs') "D1 manifest lists W.cs"

# ---------- D2 idempotent re-run ----------
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e1))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') "D2 re-run idempotent DELIVERED"

# ---------- D3 provenance blocker then fixed ----------
G $slotDir "merge -q main" | Out-Null   # align slot with merged baseline (ff)
Write-F $slotDir "Demo/Assets/GameScripts/HotFix/GameLogic/W2.cs" "public class W2 {}`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"feat: d3 work`"" | Out-Null
New-Ticket $slotDir
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e1))
Assert-True ($r.code -eq 3 -and $r.verdict -match 'BLOCKED-PRECHECK') "D3 unexpected commit -> precheck blocker"
# 遥测(隔离 LOCALAPPDATA):BLOCKED-PRECHECK 那行记 合并预检 判出 blocker 的段别与 detail;直接调用(非 槽位交付)无 run 字段。
function Get-FdTelLast {
  $tdir = Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry"
  $rows = @(Get-ChildItem $tdir -Filter "wf-*.jsonl" -EA SilentlyContinue | ForEach-Object { [System.IO.File]::ReadAllLines($_.FullName) } |
            Where-Object { $_ -match '"event":"集成交付"' -and $_ -match '"verdict":' } | ForEach-Object { $_ | ConvertFrom-Json })
  if ($rows.Count -eq 0) { return $null }
  return $rows[-1]
}
$t3 = Get-FdTelLast
Assert-True ($t3 -and $t3.verdict -eq "BLOCKED-PRECHECK" -and (@($t3.blockers) -contains "A2") -and $t3.detail -match 'blocker' -and $null -ne $t3.phases.precheck -and -not $t3.PSObject.Properties["run"]) ("D3b 遥测:blockers 段别(A2)/ detail / precheck 段;直接调用无 run:" + (@($t3.blockers) -join ","))
$e3 = Expected "e3.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e3))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') "D3 fixed expected list -> delivered"

# ---------- D4 ticket denial ----------
G $slotDir "merge -q main" | Out-Null
Write-F $slotDir "Demo/Assets/GameScripts/HotFix/GameLogic/W3.cs" "public class W3 {}`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"feat: d4 work`"" | Out-Null
Remove-Item (Join-Path $slotDir ".gate\ticket.json") -Force -ErrorAction SilentlyContinue
$e4 = Expected "e4.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e4))
Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-ticket-no-ticket') "D4 no ticket -> denied at push point"

# ---------- D5 ticket restored -> re-run delivers (resumes D4) ----------
# 临时测试目录被 .gitignore 忽略(真仓 .gitignore 与 Demo/.gitignore 各一条),git 里不存在
# 「删测 commit」,集成交付 不再有删测 / 自动识别删测提交两支;临时测试清理 由 槽位交付 在检查 PASS 后调用。
New-Ticket $slotDir
$e5 = Expected "e5.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e5))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') "D5 ticket restored -> delivered"
Assert-True ((G $mainC "log --format=%s -3") -join "|" -match 'd4 work') "D5 main contains the resumed d4 commit"

# ---------- D6 fantasy-only change ----------
G $slotDir "merge -q main" | Out-Null
G $slotFx "merge -q main" | Out-Null
Write-F $slotFx "Server/S.cs" "public class S {}`n"
G $slotFx "add -A" | Out-Null; G $slotFx "commit -q -m `"feat: d6 server`"" | Out-Null
$e6 = Expected "e6.txt" $slotDir $slotFx
# 槽位 Fantasy 提交自由,服务端票在 push 点验(严格树):无票 -> 拒且不推
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e6))
Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-server-ticket-no-ticket') "D6a 槽位 Fantasy 含 .cs 无票 -> push 点拒"
Assert-True (@(G $slotFx "rev-parse --verify --quiet origin/agent/dev7").Count -eq 0 -or (G $slotFx "rev-parse HEAD")[0] -ne (G $slotFx "rev-parse origin/agent/dev7")[0]) "D6a 拒时槽位 Fantasy 未 push"
New-Ticket $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e6))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED merged=[0-9a-f]+,[0-9a-f]+ pushed=yes deployed=skipped') "D6 fantasy delivered, deploy skipped"
Assert-True ((G $mainF "log --format=%s -3") -join "|" -match 'd6 server') "D6 main Fantasy contains server commit"
$lt = (G $mainF "rev-parse HEAD")[0]; $rt = (G $bareF "rev-parse refs/heads/main")[0]
Assert-True ($lt -eq $rt) "D6 main Fantasy pushed"
$mTxt6 = [System.IO.File]::ReadAllText(($r.verdict -replace '^.* report=', ''))
Assert-True ($mTxt6 -match 'S\.cs') "D6 manifest lists fantasy S.cs"

# ---------- D7 binary conflict -> abort + fantasy compensation ----------
Write-F $mainC "Demo/Assets/AssetRaw/UI/x.prefab" "MAIN-SIDE`n"
G $mainC "add -A" | Out-Null; G $mainC "commit -q -m `"art: main side prefab`"" | Out-Null
G $slotDir "merge -q origin/main" | Out-Null   # align to last pushed baseline (not the new local commit)
Write-F $slotDir "Demo/Assets/AssetRaw/UI/x.prefab" "SLOT-SIDE`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"art: slot side prefab`"" | Out-Null
New-Ticket $slotDir
G $slotFx "merge -q main" | Out-Null
Write-F $slotFx "Server/S2.cs" "public class S2 {}`n"
G $slotFx "add -A" | Out-Null; G $slotFx "commit -q -m `"feat: d7 server`"" | Out-Null
New-Ticket $slotFx
$fxTipBefore = (G $mainF "rev-parse HEAD")[0]
$e7 = Expected "e7.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e7))
Assert-True ($r.code -eq 3 -and $r.verdict -match 'BLOCKED-BINARY') "D7 binary conflict -> blocked"
Assert-True ($r.verdict -match '补偿撤销') "D7 fantasy merge compensated"
Assert-True (-not (Test-Path (Join-Path $mainC ".git\MERGE_HEAD"))) "D7 client merge aborted"
Assert-True (((G $mainF "rev-parse HEAD")[0]) -eq $fxTipBefore) "D7 main Fantasy reset to pre-merge"
# user decision simulated: make main side content equal -> re-run resolves cleanly
Write-F $mainC "Demo/Assets/AssetRaw/UI/x.prefab" "SLOT-SIDE`n"
G $mainC "add -A" | Out-Null; G $mainC "commit -q -m `"art: adopt slot prefab`"" | Out-Null
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e7))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') "D7b re-run after user fix -> delivered"

# ---------- D8 code conflict -> resolve files only -> re-entry concludes ----------
Write-F $mainC "Demo/Assets/GameScripts/HotFix/GameLogic/C.cs" "public class C { /* MAIN */ }`n"
G $mainC "add -A" | Out-Null; G $mainC "commit -q -m `"feat: main side C`"" | Out-Null
G $slotDir "merge -q origin/main" | Out-Null
Write-F $slotDir "Demo/Assets/GameScripts/HotFix/GameLogic/C.cs" "public class C { /* SLOT */ }`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"feat: slot side C`"" | Out-Null
New-Ticket $slotDir
$e8 = Expected "e8.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e8))
Assert-True ($r.code -eq 3 -and $r.verdict -match '^VERDICT: CONFLICT ') "D8 code conflict -> CONFLICT verdict"
Assert-True (Test-Path (Join-Path $mainC ".git\MERGE_HEAD")) "D8 MERGE_HEAD kept for session resolution"
Write-F $mainC "Demo/Assets/GameScripts/HotFix/GameLogic/C.cs" "public class C { /* RESOLVED */ }`n"
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e8))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') "D8 re-entry after file-only resolution -> delivered"
$final = [System.IO.File]::ReadAllText((Join-Path $mainC "Demo\Assets\GameScripts\HotFix\GameLogic\C.cs"))
Assert-True ($final -match 'RESOLVED') "D8 resolved content survived"

# ---------- D9 protocol undeclared -> fail-closed ----------
G $slotDir "merge -q origin/main" | Out-Null
Write-F $slotDir "Demo/Assets/GameScripts/HotFix/Network/NetworkProtocol/P.cs" "public class P {}`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"proto: gen change`"" | Out-Null
New-Ticket $slotDir
$e9 = Expected "e9.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e9))
Assert-True ($r.code -eq 3 -and $r.verdict -match 'BLOCKED-PROTOCOL-UNDECLARED') "D9 protocol footprint without -Protocol -> fail-closed"

# ---------- D10 deploy-catchup: main Fantasy ahead of last-deployed sha -> client-only re-run still deploys ----------
# 模拟上一轮已合并推送 Fantasy 却崩在部署前(deployed-sha.txt 停在更早 sha),本轮 client-only 重入应 needDeploy 补部署。
$fxGate = Join-Path $mainF ".gate"
New-Item -ItemType Directory -Force -Path $fxGate | Out-Null
$staleFxSha = (G $mainF "rev-parse HEAD~1")[0].Trim()   # 比当前 main Fantasy HEAD 旧(上轮部署停在这)
[System.IO.File]::WriteAllText((Join-Path $fxGate "deployed-sha.txt"), $staleFxSha, (New-Object System.Text.UTF8Encoding($false)))
G $slotDir "reset -q --hard origin/main" | Out-Null   # 丢弃 D9 blocked 遗留的未交付 proto 提交,回干净基线
Write-F $slotDir "Demo/Assets/GameScripts/HotFix/GameLogic/W10.cs" "public class W10 {}`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"feat: d10 client`"" | Out-Null
New-Ticket $slotDir
$e10 = Expected "e10.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e10))
Assert-True ($r.code -eq 0 -and $r.verdict -match 'deployed=skipped') "D10 catchup: client-only but Fantasy ahead of deployed-sha -> needDeploy (skipped under -NoDeploy)"
# 反证:deployed-sha 追平当前 HEAD 后,同样 client-only 回到 n/a(不把所有 client-only 误判为需部署)
[System.IO.File]::WriteAllText((Join-Path $fxGate "deployed-sha.txt"), ((G $mainF "rev-parse HEAD")[0].Trim()), (New-Object System.Text.UTF8Encoding($false)))
G $slotDir "reset -q --hard origin/main" | Out-Null
Write-F $slotDir "Demo/Assets/GameScripts/HotFix/GameLogic/W10b.cs" "public class W10b {}`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"feat: d10b client`"" | Out-Null
New-Ticket $slotDir
$e10b = Expected "e10b.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e10b))
Assert-True ($r.code -eq 0 -and $r.verdict -match 'deployed=n/a') "D10b no-catchup: deployed-sha at HEAD -> client-only back to n/a"

# ---------- D11 Fantasy 侧 Luban 生成物冲突 -> 机械取 ours 分流 -> 不停机 ----------
# 同一份表源导出到双端,任一侧的生成物冲突都不该停给会话(客户端侧由 D8 之外的分流路径覆盖,此处锁 Fantasy 侧)。
# 两侧都动过表域 -> 第 8 步按合并树重导表:主仓放导表桩(零产出),锚「判据命中且重导跑到」,产物仍是 ours。
$lubanF = "examples/Server/APP/Entity/Generate/GameConfigBytes/item_tbitemdef.bytes"
$cfgD = Import-PowerShellDataFile (Join-Path $dfDir "flow-config.psd1")
Write-F $mainC $cfgD.LubanGenClientBat "@echo off`r`nexit /b 0`r`n"
Write-F $mainC $cfgD.LubanGenServerBat "@echo off`r`nexit /b 0`r`n"
G $mainC "add -A" | Out-Null; G $mainC "commit -q -m `"cfg: luban export stubs`"" | Out-Null
G $slotDir "reset -q --hard origin/main" | Out-Null
G $slotFx "merge -q main" | Out-Null          # 先对齐当前 Fantasy 基线,再各自分叉造冲突
Write-F $mainF $lubanF "MAIN-BYTES`n"
G $mainF "add -A" | Out-Null; G $mainF "commit -q -m `"cfg: main side luban export`"" | Out-Null
Write-F $slotFx $lubanF "SLOT-BYTES`n"
G $slotFx "add -A" | Out-Null; G $slotFx "commit -q -m `"cfg: slot side luban export`"" | Out-Null
Write-F $slotDir "Demo/Assets/GameScripts/HotFix/GameLogic/W11.cs" "public class W11 {}`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"feat: d11 client`"" | Out-Null
New-Ticket $slotDir
$e11 = Expected "e11.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e11))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') "D11 fantasy luban conflict auto-resolved -> delivered"
Assert-True (-not (Test-Path (Join-Path $mainF ".git\MERGE_HEAD"))) "D11 fantasy merge concluded (no MERGE_HEAD left)"
$d11Txt = ""
$d11Abs = Join-Path $mainF ($lubanF -replace '/', '\')
if (Test-Path $d11Abs) { $d11Txt = [System.IO.File]::ReadAllText($d11Abs) }
Assert-True ($d11Txt -match 'MAIN-BYTES') "D11 fantasy luban took ours (main side, re-export wins later)"
Assert-True (@($r.out | Where-Object { $_ -match 'INFO 合并后重导:main 与槽位都动过的生成域 = 表' }).Count -eq 1) "D11 两侧都动过表域 -> 合并后重导表"

# ---------- D12 客户端侧 Luban 生成物冲突 -> 机械取 ours 分流 -> 不停机(与 D11 对称) ----------
$lubanC = "Demo/Assets/AssetRaw/Configs/bytes/item_tbitemdef.bytes"
G $slotDir "merge -q main" | Out-Null
Write-F $mainC $lubanC "MAIN-CLIENT-BYTES`n"
G $mainC "add -A" | Out-Null; G $mainC "commit -q -m `"cfg: main side client luban`"" | Out-Null
G $slotDir "merge -q origin/main" | Out-Null   # 对齐到已推送基线(不含 main 的新提交),使两侧分叉
Write-F $slotDir $lubanC "SLOT-CLIENT-BYTES`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"cfg: slot side client luban`"" | Out-Null
New-Ticket $slotDir
$e12 = Expected "e12.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e12))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') "D12 client luban conflict auto-resolved -> delivered"
$d12Txt = ""
$d12Abs = Join-Path $mainC ($lubanC -replace '/', '\')
if (Test-Path $d12Abs) { $d12Txt = [System.IO.File]::ReadAllText($d12Abs) }
Assert-True ($d12Txt -match 'MAIN-CLIENT-BYTES') "D12 client luban took ours (main side)"

# ---------- D22 main 在槽位分叉后被推进、两侧都改表 -> 指纹冲突取 ours 后按合并树重导覆盖 ----------
# 此前第 8 步只按 -Protocol 重导协议:表产物冲突取了 main 侧就无人重导,本轮表改动的产物丢在 main 上。
$stampRel = "Configs/GameConfig/export-stamp.json"
G $slotDir "merge -q main" | Out-Null
# 导表桩另把一份入库 LF、属性 eol=lf 的生成物按 CRLF 重写(内容不变):锚合并后重导不在主树留行尾幻影。
$d22Phantom = "Demo/Assets/GameScripts/HotFix/GameProto/GameConfig/EolPhantom.cs"
Write-F $mainC $cfgD.LubanGenClientBat "@echo off`r`n> `"%~dp0export-stamp.json`" echo regenerated`r`n(echo a& echo b)> `"%~dp0..\..\Demo\Assets\GameScripts\HotFix\GameProto\GameConfig\EolPhantom.cs`"`r`nexit /b 0`r`n"
Write-F $mainC ".gitattributes" "Demo/Assets/GameScripts/HotFix/GameProto/GameConfig/*.cs text eol=lf`n"
Write-F $mainC $d22Phantom "a`nb`n"
Write-F $mainC $stampRel "base`n"
G $mainC "add -A" | Out-Null; G $mainC "commit -q -m `"cfg: d22 regen stub`"" | Out-Null
G $slotDir "merge -q main" | Out-Null
Write-F $mainC "Configs/GameConfig/Datas/up22.xlsx" "v-main`n"
Write-F $mainC $stampRel "main`n"
G $mainC "add -A" | Out-Null; G $mainC "commit -q -m `"cfg: d22 upstream table`"" | Out-Null
Write-F $slotDir "Configs/GameConfig/Datas/slot22.xlsx" "v-slot`n"
Write-F $slotDir $stampRel "slot`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"cfg: d22 slot table [表文档无关:夹具]`"" | Out-Null
New-Ticket $slotDir
$e22 = Expected "e22.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e22))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') ("D22 两侧都改表的真合并照常交付(" + $r.verdict + ")")
$d22Stamp = ""
$d22Abs = Join-Path $mainC ($stampRel -replace '/', '\')
if (Test-Path $d22Abs) { $d22Stamp = ([System.IO.File]::ReadAllText($d22Abs)).Trim() }
Assert-True ($d22Stamp -eq "regenerated") ("D22 main 上的指纹是合并后重导重写的那份(实为「" + $d22Stamp + "」)")
Assert-True ((@(G $mainC "log --format=%s -5" | Where-Object { $_ -match '^【流程】合并后重导表收尾' })).Count -eq 1) "D22 重导产物以【流程】收尾提交进 main"
Assert-True ((Test-Path (Join-Path $mainC "Configs\GameConfig\Datas\up22.xlsx")) -and (Test-Path (Join-Path $mainC "Configs\GameConfig\Datas\slot22.xlsx"))) "D22 两侧的表改动都在 main"
Assert-True (((G $mainC "rev-parse HEAD")[0]) -eq ((G $bareC "rev-parse refs/heads/main")[0])) "D22 重导收尾提交已推送"
Assert-True (@(G $mainC "status --porcelain" | Where-Object { $_ -match 'EolPhantom' }).Count -eq 0) "D22 合并后重导写出的行尾幻影已归一,主树不留 tracked 假脏"

# ---------- D14 push 点验票面 = 客户端验证面(校验库 ClientSurfaceRe,与 槽位交付 跑检查同口径) ----------
# 只改 prefab 的分支曾在 push 点免验票(验票只认 GameScripts|Launcher 的 .cs/.asmdef)。
G $slotDir "merge -q main" | Out-Null
Write-F $slotDir "Demo/Assets/AssetRaw/UI/D14.prefab" "prefab`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"art: d14 prefab only`"" | Out-Null
Remove-Item (Join-Path $slotDir ".gate\ticket.json") -Force -ErrorAction SilentlyContinue
$e14 = Expected "e14.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e14))
Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-ticket-no-ticket') "D14 只改 prefab 的分支无票 -> push 点拒"
# D14b 面外改动(纯文档)无票照常交付:不虚构客户端自检义务
G $slotDir "reset -q --hard origin/main" | Out-Null
Write-F $slotDir "docs/d14b.md" "doc`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"docs: d14b doc only`"" | Out-Null
$e14b = Expected "e14b.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e14b))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') "D14b 面外改动(纯文档)无票照常交付"

# ---------- D15 检查后改中文名面内文件 -> 凭据作废 ----------
# git 缺省把非 ASCII 路径转义加引号,前缀锚定的面正则对它失配,这类漂移曾被读成面外而放行。
# block-client 用的是中文名表文件;本作未接 Luban、表目录不在客户端验证面,改用面内的中文名 prefab(文本截断核对 的读取面)。
G $slotDir "merge -q main" | Out-Null
$cnTbl = "Demo/Assets/AssetRaw/UI/Prefabs/演示面板.prefab"
Write-F $slotDir $cnTbl "v1`n"
$m15 = Join-Path $fx "m15.txt"
[System.IO.File]::WriteAllText($m15, "cfg: d15 cn table`n`n[表文档无关:夹具]", (New-Object System.Text.UTF8Encoding($false)))
G $slotDir "add -A" | Out-Null; G $slotDir ("commit -q -F `"" + $m15 + "`"") | Out-Null
New-Ticket $slotDir
Write-F $slotDir $cnTbl "v2`n"
$e15 = Expected "e15.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e15))
Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-ticket-tree-mismatch') "D15 检查后改中文名表文件 -> 凭据作废,push 点拒"

# ---------- D16 主客户端仓有他方发起的合并中途态 -> 拒收尾、零写入 ----------
# 用户手动合并上游到一半(无冲突、MERGE_HEAD 在)。曾经见 MERGE_HEAD 就当本槽合并去收尾,替他提交掉。
G $slotDir "reset -q --hard origin/main" | Out-Null
G $mainC "checkout -q -b upstream-c" | Out-Null
Write-F $mainC "docs/up16.md" "upstream`n"
G $mainC "add -A" | Out-Null; G $mainC "commit -q -m `"docs: upstream c`"" | Out-Null
G $mainC "checkout -q main" | Out-Null
G $mainC "merge -q --no-ff --no-commit upstream-c" | Out-Null
$foreignC = (G $mainC "rev-parse MERGE_HEAD")[0].Trim()
$headC16 = (G $mainC "rev-parse HEAD")[0].Trim()
Write-F $slotDir "Demo/Assets/GameScripts/HotFix/GameLogic/W16.cs" "public class W16 {}`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"feat: d16 client`"" | Out-Null
New-Ticket $slotDir
$tip16 = (G $slotDir "rev-parse HEAD")[0].Trim()
$e16 = Expected "e16.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e16))
Assert-True ($r.code -eq 3 -and $r.verdict -match '^VERDICT: BLOCKED-PRECHECK .*MERGE_HEAD=' -and $r.verdict.Contains($foreignC) -and $r.verdict.Contains($tip16)) "D16 客户端他方合并中途 -> BLOCKED-PRECHECK 点名 MERGE_HEAD 与本槽 tip"
Assert-True ((Test-Path (Join-Path $mainC ".git\MERGE_HEAD")) -and ((G $mainC "rev-parse HEAD")[0].Trim() -eq $headC16)) "D16 他方合并现场原样(MERGE_HEAD 在、HEAD 未动)"
$ot16 = @(G $slotDir "rev-parse --verify --quiet origin/agent/dev7")
Assert-True ($ot16.Count -eq 0 -or $ot16[0].Trim() -ne $tip16) "D16 零写入(槽位分支未 push)"
G $mainC "merge --abort" | Out-Null
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e16))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') "D16b 他方合并撤销后重跑 -> delivered"

# ---------- D17 主 Fantasy 有他方发起的合并中途态 -> 拒收尾、零写入 ----------
G $slotDir "merge -q main" | Out-Null
G $mainF "checkout -q -b upstream-f" | Out-Null
Write-F $mainF "Server/Up17.cs" "public class Up17 {}`n"
G $mainF "add -A" | Out-Null; G $mainF "commit -q -m `"feat: upstream f`"" | Out-Null
G $mainF "checkout -q main" | Out-Null
G $mainF "merge -q --no-ff --no-commit upstream-f" | Out-Null
$foreignF = (G $mainF "rev-parse MERGE_HEAD")[0].Trim()
$headF17 = (G $mainF "rev-parse HEAD")[0].Trim()
Write-F $slotDir "Demo/Assets/GameScripts/HotFix/GameLogic/W17.cs" "public class W17 {}`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"feat: d17 client`"" | Out-Null
New-Ticket $slotDir
$e17 = Expected "e17.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e17))
Assert-True ($r.code -eq 3 -and $r.verdict -match '^VERDICT: BLOCKED-PRECHECK .*主 Fantasy' -and $r.verdict.Contains($foreignF)) "D17 Fantasy 他方合并中途 -> BLOCKED-PRECHECK 点名 MERGE_HEAD"
Assert-True ((Test-Path (Join-Path $mainF ".git\MERGE_HEAD")) -and ((G $mainF "rev-parse HEAD")[0].Trim() -eq $headF17)) "D17 Fantasy 他方合并现场原样"
G $mainF "merge --abort" | Out-Null
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e17))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') "D17b 他方合并撤销后重跑 -> delivered"

# ---------- D18 Fantasy 本槽合并冲突 -> 只改文件 -> 重入收尾(MERGE_HEAD 属本槽的正向路径) ----------
G $slotDir "merge -q main" | Out-Null
G $slotFx "merge -q main" | Out-Null
Write-F $mainF "Server/F18.cs" "public class F18 { /* MAIN */ }`n"
G $mainF "add -A" | Out-Null; G $mainF "commit -q -m `"feat: main side F18`"" | Out-Null
Write-F $slotFx "Server/F18.cs" "public class F18 { /* SLOT */ }`n"
G $slotFx "add -A" | Out-Null; G $slotFx "commit -q -m `"feat: slot side F18`"" | Out-Null
New-Ticket $slotFx
$tipF18 = (G $slotFx "rev-parse HEAD")[0].Trim()
$e18 = Expected "e18.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e18))
Assert-True ($r.code -eq 3 -and $r.verdict -match '^VERDICT: CONFLICT-FANTASY ') "D18 Fantasy 代码冲突 -> CONFLICT-FANTASY"
Write-F $mainF "Server/F18.cs" "public class F18 { /* RESOLVED */ }`n"
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e18))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED') "D18 本槽 MERGE_HEAD 重入 -> 收尾 delivered"
# 父提交取 %P 而非 HEAD^2:G 经 cmd /c,^ 是 cmd 转义符会被吃掉
Assert-True ((((G $mainF "log -1 --format=%P HEAD")[0].Trim() -split ' ')[1] -eq $tipF18) -and ([System.IO.File]::ReadAllText((Join-Path $mainF "Server\F18.cs")) -match 'RESOLVED')) "D18 收尾提交第二父 = 本槽 tip,解决内容保留"

# ---------- D19 主 Fantasy 检出在非主分支 -> 合并前停机 ----------
G $slotFx "merge -q main" | Out-Null
G $mainF "checkout -q -b side-f" | Out-Null
$sideF19 = (G $mainF "rev-parse HEAD")[0].Trim()
Write-F $slotFx "Server/S19.cs" "public class S19 {}`n"
G $slotFx "add -A" | Out-Null; G $slotFx "commit -q -m `"feat: d19 server`"" | Out-Null
New-Ticket $slotFx
$e19 = Expected "e19.txt" $slotDir $slotFx
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e19))
Assert-True ($r.code -eq 2 -and $r.verdict -match '主 Fantasy 当前分支不是 main') "D19 主 Fantasy 在非 main 分支 -> 停机"
Assert-True (((G $mainF "rev-parse HEAD")[0].Trim() -eq $sideF19) -and -not (Test-Path (Join-Path $mainF ".git\MERGE_HEAD"))) "D19 非主分支未被合并"
G $mainF "checkout -q main" | Out-Null
$r = Run-FD ($common + @("-ExpectedCommitsFile", $e19))
Assert-True ($r.code -eq 0 -and ((G $mainF "log --format=%s -3") -join "|") -match 'd19 server') "D19b 切回 main 重跑 -> 合进 main"

# ---------- 部署点入口副本(D21 / D24-D26f 共用) ----------
# 部署点真跑要构建与起服,故经夹具内的入口副本跑:服务端自检 换成按计划文件逐次出码的桩(3 = STALE 且先往
# 主 Fantasy 提交一条,扮演并发合并;3u = STALE 但 HEAD 不动;0 = PASS;2 = INFRA;其余 = FAIL),每次调用记
# 「步骤 + 开工时的 HEAD」;服务端重启 换成只记 stop / start 的桩,不碰本机进程。
$stubDf = Join-Path $fx "stubroot\Demo\.claude\devflow"
New-Item -ItemType Directory -Force -Path (Join-Path $stubDf "hooks") | Out-Null
Copy-Item (Join-Path $dfDir "*.ps1") $stubDf -Force
Copy-Item (Join-Path $dfDir "flow-config.psd1") $stubDf -Force
Copy-Item (Join-Path $dfDir "hooks\*.ps1") (Join-Path $stubDf "hooks") -Force
$stubDeliver = Join-Path $stubDf "集成交付.ps1"
$gatePlan = Join-Path $stubDf "server-gate.plan"
$gateLog = Join-Path $stubDf "server-gate.log"
$restartLog = Join-Path $stubDf "restart.log"
$gatePlanStub = @'
param([string]$FantasyRoot)
$plan = Join-Path $PSScriptRoot 'server-gate.plan'
$log = Join-Path $PSScriptRoot 'server-gate.log'
$steps = @(); if (Test-Path $plan) { $steps = @([System.IO.File]::ReadAllLines($plan) | Where-Object { $_ }) }
$n = 0; if (Test-Path $log) { $n = @([System.IO.File]::ReadAllLines($log) | Where-Object { $_ }).Count }
$step = '0'; if ($n -lt $steps.Count) { $step = $steps[$n] }
$head = ([string](cmd /c "git -C `"$FantasyRoot`" rev-parse HEAD 2>nul")).Trim()
[System.IO.File]::AppendAllText($log, ($step + ' ' + $head + "`n"))
if ($step -eq '3') {
  $f = Join-Path $FantasyRoot ('docs\concurrent-' + [Guid]::NewGuid().ToString('N') + '.txt')
  [System.IO.Directory]::CreateDirectory((Split-Path $f -Parent)) | Out-Null
  [System.IO.File]::WriteAllText($f, 'x')
  cmd /c "git -C `"$FantasyRoot`" add -- docs 2>&1" | Out-Null
  cmd /c "git -C `"$FantasyRoot`" commit -q -m concurrent-merge 2>&1" | Out-Null
}
if ($step -like '3*') { Write-Host 'VERDICT : PASS   (stub build ok)'; Write-Host 'VERDICT : STALE  - working tree changed during the run; PASS voided, re-run the gate.'; exit 3 }
if ($step -eq '0') { Write-Host 'VERDICT : PASS   (stub build ok)'; exit 0 }
if ($step -eq '2') { Write-Host 'VERDICT : INFRA - build exit 1 with only file-lock / restore errors (stub)'; exit 2 }
Write-Host 'VERDICT : FAIL   (stub build errors)'; exit 1
'@
$restartStub = @'
param([switch]$StopOnly, [switch]$CheckOnly, [string]$FantasyRoot, [int]$SettleSec)
[System.IO.File]::AppendAllText((Join-Path $PSScriptRoot 'restart.log'), ($(if ($StopOnly) { 'stop' } else { 'start' }) + "`n"))
exit 0
'@
[System.IO.File]::WriteAllText((Join-Path $stubDf "服务端自检.ps1"), $gatePlanStub, (New-Object System.Text.UTF8Encoding($true)))
[System.IO.File]::WriteAllText((Join-Path $stubDf "服务端重启.ps1"), $restartStub, (New-Object System.Text.UTF8Encoding($true)))
# 「本仓开发服在不在跑」换成按标记文件回答的桩(追加在库副本末尾,后定义的生效):部署点只看个数,
# 用例因此不必起一个名叫 Main、路径落在夹具里的真进程。真函数的路径判据由 服务端重启测试 M 段锁。
$devServerFlag = Join-Path $stubDf "devserver.running"
$devServerStub = @'

function Get-DevServerProcs([string]$FantasyRoot) {
  if (Test-Path -LiteralPath (Join-Path (Split-Path $PSScriptRoot -Parent) 'devserver.running')) { return @('stub-dev-server') }
  return @()
}
'@
[System.IO.File]::AppendAllText((Join-Path $stubDf "hooks\hook函数库.ps1"), $devServerStub, (New-Object System.Text.UTF8Encoding($false)))
$commonDeploy = @("-RepoRoot", $mainC, "-FantasyRoot", $mainF, "-Slot", $slotDir)
$deployShaFile = Join-Path $mainF ".gate\deployed-sha.txt"
function Set-GatePlan([string[]]$Steps) {
  [System.IO.File]::WriteAllLines($gatePlan, [string[]]$Steps, (New-Object System.Text.UTF8Encoding($false)))
  foreach ($p in @($gateLog, $restartLog)) { if (Test-Path $p) { [System.IO.File]::Delete($p) } }
}
function Get-LogLines([string]$Path) {
  if (-not (Test-Path $Path)) { return , @() }
  return , @([System.IO.File]::ReadAllLines($Path) | Where-Object { $_ })
}
function New-ServerDelivery([string]$Tag) {
  # 槽位 Fantasy 落一条服务端提交并签票,回期望清单文件(serverInvolved -> 部署点必到)。
  G $slotDir "merge -q main" | Out-Null
  G $slotFx "merge -q main" | Out-Null
  Write-F $slotFx ("Server/S" + $Tag + ".cs") ("public class S" + $Tag + " {}`n")
  G $slotFx "add -A" | Out-Null; G $slotFx ("commit -q -m `"feat: d" + $Tag + " server`"") | Out-Null
  New-Ticket $slotFx | Out-Null
  return (Expected ("e" + $Tag + ".txt") $slotDir $slotFx)
}

# ---------- D21 部署点等锁期间被并发交付部署覆盖 -> 跳过重启,不停服不构建 ----------
# 复刻 2026-09-24 并发交付:本进程代持部署锁(扮演正在部署的另一交付),被测交付排到部署点等锁;
# 等待期间写 deployed-sha = 含本轮合并的 main Fantasy HEAD 再放锁。「开发服在跑」由入口副本里的桩按
# 标记文件给出,不起任何进程。跳过与否看两个桩的调用记录:跳过 = 服务端重启 与 服务端自检 一次都没被调。
# D21b 是反面:deployed-sha 同样覆盖、但开发服不在跑 -> 不得跳过(否则开发服停着却报已部署)。
function Read-Shared([string]$Path) {
  # 子进程仍持写句柄时 File.ReadAllText 报共享冲突,按 ReadWrite 共享打开读。
  if (-not (Test-Path $Path)) { return "" }
  $fs = [System.IO.File]::Open($Path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
  try { return (New-Object System.IO.StreamReader($fs, [System.Text.Encoding]::UTF8)).ReadToEnd() } finally { $fs.Dispose() }
}
function Invoke-CoveredRace([string]$Tag, [bool]$ServerRunning) {
  $expected = New-ServerDelivery $Tag
  Set-GatePlan @("0")
  if ($ServerRunning) { [System.IO.File]::WriteAllText($devServerFlag, "1") }
  elseif (Test-Path $devServerFlag) { [System.IO.File]::Delete($devServerFlag) }
  $lk = Enter-DeployLock $mainF ("D" + $Tag + "-holder")
  $env:FLOW_DEPLOY_LOCK = $null   # 不让被测子进程继承本进程的锁
  $outFile = Join-Path $fx ("d" + $Tag + "-out.txt")
  $proc = Start-Process -FilePath $engine -WindowStyle Hidden -PassThru -RedirectStandardOutput $outFile -ArgumentList @(
    "-NoProfile", "-File", "`"$stubDeliver`"", "-RepoRoot", "`"$mainC`"", "-FantasyRoot", "`"$mainF`"", "-Slot", "`"$slotDir`"", "-ExpectedCommitsFile", "`"$expected`"")
  [void]$proc.Handle   # 先取句柄:Start-Process -PassThru 的进程不取句柄,退出后 ExitCode 读回空
  $sawWait = $false
  for ($i = 0; $i -lt 240 -and -not $proc.HasExited; $i++) {
    if ((Read-Shared $outFile) -match 'DEPLOY-LOCK wait') { $sawWait = $true; break }
    Start-Sleep -Milliseconds 500
  }
  $head = (G $mainF "rev-parse HEAD")[0].Trim()
  [System.IO.File]::WriteAllText((Join-Path $mainF ".gate\deployed-sha.txt"), $head, (New-Object System.Text.UTF8Encoding($false)))
  Exit-DeployLock $lk | Out-Null
  [void]$proc.WaitForExit(120000)
  if (Test-Path $devServerFlag) { [System.IO.File]::Delete($devServerFlag) }
  $txt = Read-Shared $outFile
  $v = @($txt -split "`r?`n" | Where-Object { $_ -match '^VERDICT: ' } | Select-Object -Last 1)
  return @{
    sawWait = $sawWait; exited = $proc.HasExited; code = $proc.ExitCode; txt = $txt; head = $head
    verdict = $(if ($v.Count -gt 0) { $v[0] } else { "(no verdict)" })
    restart = ((Get-LogLines $restartLog) -join ","); gate = (Get-LogLines $gateLog).Count
  }
}
$d21 = Invoke-CoveredRace "21" $true
Assert-True $d21.sawWait "D21 前置:被测交付在部署点等锁(DEPLOY-LOCK wait)"
Assert-True ($d21.exited -and $d21.code -eq 0 -and $d21.verdict -match ('deployed=covered:' + $d21.head.Substring(0, 8))) ("D21 等锁期间已被覆盖 -> deployed=covered:<sha>:" + $d21.verdict)
Assert-True ($d21.restart -eq "" -and $d21.gate -eq 0 -and $d21.txt -notmatch '服务端自检 构建') ("D21 跳过时不停开发服、不构建(重启桩调用=[" + $d21.restart + "],构建桩调用=" + $d21.gate + ")")
$d21b = Invoke-CoveredRace "21b" $false
Assert-True ($d21b.sawWait -and $d21b.exited -and $d21b.code -eq 0 -and $d21b.verdict -match 'deployed=yes') ("D21b deployed-sha 已覆盖但开发服不在跑 -> 不跳过,照常部署:" + $d21b.verdict)
Assert-True ($d21b.restart -eq "stop,start" -and $d21b.gate -eq 1) ("D21b 停旧、构建、起新各一次(重启桩调用=[" + $d21b.restart + "],构建桩调用=" + $d21b.gate + ")")

# ---------- D23 集成锁:另一交付在合并阶段时,被测交付在第 1 步前排队,零写入;放锁后照常交付 ----------
# 无锁时的读码推演:对方冲突留下 MERGE_HEAD,本方第 6/7 步重入分支替它收尾;对方补偿撤销按 ORIG_HEAD 撤掉本方合并。
G $slotDir "merge -q main" | Out-Null
Write-F $slotDir "Demo/Assets/GameScripts/HotFix/GameLogic/W23.cs" "public class W23 {}`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"feat: d23 client`"" | Out-Null
New-Ticket $slotDir
$e23 = Expected "e23.txt" $slotDir $slotFx
$headC23 = (G $mainC "rev-parse HEAD")[0].Trim()
$lk23 = Enter-FlowLock "integrate" $mainC "D23-holder"
[Environment]::SetEnvironmentVariable("FLOW_INTEGRATE_LOCK", $null)   # 不让被测子进程继承本进程的锁
$out23 = Join-Path $fx "d23-out.txt"
$fd23 = Start-Process -FilePath $engine -WindowStyle Hidden -PassThru -RedirectStandardOutput $out23 -ArgumentList @(
  "-NoProfile", "-File", "`"$flowDeliver`"", "-RepoRoot", "`"$mainC`"", "-FantasyRoot", "`"$mainF`"", "-NoDeploy", "-Slot", "`"$slotDir`"", "-ExpectedCommitsFile", "`"$e23`"")
[void]$fd23.Handle
$sawWait23 = $false
for ($i = 0; $i -lt 240 -and -not $fd23.HasExited; $i++) {
  if ((Read-Shared $out23) -match 'INTEGRATE-LOCK wait') { $sawWait23 = $true; break }
  Start-Sleep -Milliseconds 500
}
Start-Sleep -Milliseconds 1500
$headDuring = (G $mainC "rev-parse HEAD")[0].Trim()
$pushedDuring = ((G $slotDir "rev-parse --verify --quiet origin/agent/dev7") -join "") -eq ((G $slotDir "rev-parse HEAD")[0].Trim())
Exit-FlowLock $lk23
[void]$fd23.WaitForExit(120000)
$txt23 = Read-Shared $out23
$v23 = @($txt23 -split "`r?`n" | Where-Object { $_ -match '^VERDICT: ' } | Select-Object -Last 1)
$v23s = if ($v23.Count -gt 0) { $v23[0] } else { "(no verdict)" }
Assert-True $sawWait23 "D23 前置:被测交付在集成锁前排队(INTEGRATE-LOCK wait)"
Assert-True ($headDuring -eq $headC23 -and -not $pushedDuring) "D23 等锁期间零写入:main 未合并、槽位分支未推"
Assert-True ($fd23.HasExited -and $fd23.ExitCode -eq 0 -and $v23s -match '^VERDICT: DELIVERED') ("D23 放锁后照常交付:" + $v23s)
Assert-True (-not (Test-Path (Join-Path $mainC ".gate\integrate-lock.txt"))) "D23 交付结束持有方信息已清"

# ---------- D24-D26 部署点构建的出口分流:STALE(并发合并)持锁重跑,FAIL 不重跑 ----------
# 复刻 2026-10-08 两发:部署点构建期间并发交付把提交合进主 Fantasy,服务端自检 作废已得的 PASS,
# 部署点把它当构建失败停机(开发服已停、无可裁定内容)。经上方「部署点入口副本」跑(桩的出码计划见那里)。
# 出口码契约本身(真门 STALE = 3)由 客户端自检测试 S10 锚定。

# D24 首次 STALE(构建期间并发合并)、重跑通过 -> 照常重启,deployed-sha 记的是通过那次构建前的 HEAD
$e24 = New-ServerDelivery "24"
Set-GatePlan @("3", "0")
$r = Run-FD ($commonDeploy + @("-ExpectedCommitsFile", $e24)) $stubDeliver
$g24 = Get-LogLines $gateLog
$head24 = (G $mainF "rev-parse HEAD")[0].Trim()
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED .*deployed=yes') ("D24 部署点 STALE 一次后重跑通过 -> DELIVERED deployed=yes:" + $r.verdict)
Assert-True ($g24.Count -eq 2 -and $g24[0] -match '^3 ' -and $g24[1] -match '^0 ') ("D24 服务端自检跑两次(STALE -> PASS),实得 " + ($g24 -join " | "))
Assert-True ($g24.Count -eq 2 -and ($g24[0] -split ' ')[1] -ne ($g24[1] -split ' ')[1] -and ($g24[1] -split ' ')[1] -eq $head24) "D24 重跑构建的是并发合并后的新 HEAD"
Assert-True ((Test-Path $deployShaFile) -and ([System.IO.File]::ReadAllText($deployShaFile)).Trim() -eq $head24) "D24 deployed-sha = 通过那次构建前的 HEAD(含并发合入的提交)"
Assert-True (((Get-LogLines $restartLog) -join ",") -eq "stop,start") ("D24 停旧一次、起新一次(实得 " + ((Get-LogLines $restartLog) -join ",") + ")")
Assert-True (@($r.out | Where-Object { $_ -match 'STALE 重跑 1/2' }).Count -eq 1 -and @($r.out | Where-Object { $_ -match '期间有提交合入' }).Count -eq 1) "D24 明细点名 STALE 重跑与 HEAD 推进"
$t24 = Get-FdTelLast
Assert-True ($t24 -and $t24.verdict -eq "DELIVERED" -and $null -ne $t24.phases.deploy_build -and $null -ne $t24.phases.restart -and $null -ne $t24.phases.lockwait) ("D24b 遥测 phases 记部署点构建(含 STALE 重跑)/ 停起 / 锁等待:" + $(if ($t24) { $t24.phases | ConvertTo-Json -Compress } else { "无" }))

# D25 重跑用尽仍 STALE -> 停机,VERDICT 点名并发改动而非构建失败;不重启、不记 deployed-sha
$e25 = New-ServerDelivery "25"
Set-GatePlan @("3", "3u", "3")
$r = Run-FD ($commonDeploy + @("-ExpectedCommitsFile", $e25)) $stubDeliver
Assert-True ($r.code -eq 2 -and $r.verdict -match '^VERDICT: INFRA \| 部署点 服务端自检 连续 3 次构建通过' -and $r.verdict -match 'STALE' -and $r.verdict -match '不是构建失败') ("D25 三次都 STALE -> INFRA 点名并发改动:" + $r.verdict)
Assert-True ($r.verdict -notmatch '构建失败:不重启') "D25 不报成构建失败"
Assert-True ($r.verdict -match '期间有提交合入' -and $r.verdict -match '未提交改动在变') "D25 逐次点名树是怎么变的(HEAD 推进 / HEAD 未动)"
Assert-True ((Get-LogLines $gateLog).Count -eq 3) ("D25 首跑 + 重跑 2 次即止(实得 " + (Get-LogLines $gateLog).Count + " 次)")
Assert-True (((Get-LogLines $restartLog) -join ",") -eq "stop") "D25 停机时未起新服"
Assert-True (([System.IO.File]::ReadAllText($deployShaFile)).Trim() -eq $head24) "D25 deployed-sha 未动(下一轮补部署)"
# D25b 并发改动停下后重跑同一交付 -> 按 deployed-sha 落后补部署
Set-GatePlan @("0")
$r = Run-FD ($commonDeploy + @("-ExpectedCommitsFile", $e25)) $stubDeliver
Assert-True ($r.code -eq 0 -and $r.verdict -match 'deployed=yes' -and ([System.IO.File]::ReadAllText($deployShaFile)).Trim() -eq (G $mainF "rev-parse HEAD")[0].Trim()) ("D25b 重跑补部署:" + $r.verdict)

# D26 真构建失败(出口码 1)-> 不重跑,照报构建失败
$e26 = New-ServerDelivery "26"
Set-GatePlan @("1", "0")
$r = Run-FD ($commonDeploy + @("-ExpectedCommitsFile", $e26)) $stubDeliver
Assert-True ($r.code -eq 2 -and $r.verdict -match '^VERDICT: INFRA \| 部署点 服务端自检 构建失败') ("D26 构建真失败 -> INFRA 构建失败:" + $r.verdict)
Assert-True ((Get-LogLines $gateLog).Count -eq 1 -and ((Get-LogLines $restartLog) -join ",") -eq "stop") "D26 FAIL 不重跑、不起新服"

# D26b 服务端自检 判 INFRA(出口码 2:构建错误行全是文件锁 / restore 类)-> 不重跑,VERDICT 说环境问题、不说构建失败
# (曾与出口码 1 同报「构建失败」,会让人去改没问题的代码)。
$e26b = New-ServerDelivery "26b"
Set-GatePlan @("2", "0")
$r = Run-FD ($commonDeploy + @("-ExpectedCommitsFile", $e26b)) $stubDeliver
Assert-True ($r.code -eq 2 -and $r.verdict -match '^VERDICT: INFRA \| 部署点 服务端自检 判 INFRA' -and $r.verdict -match '环境问题' -and $r.verdict -notmatch '构建失败') ("D26b 部署点构建判 INFRA -> 报环境问题而非构建失败:" + $r.verdict)
Assert-True ((Get-LogLines $gateLog).Count -eq 1 -and ((Get-LogLines $restartLog) -join ",") -eq "stop") "D26c INFRA 不重跑、不起新服"
# 收尾:这条服务端交付已合并推送,补一次部署把 deployed-sha 追平,免得后续用例按落后补部署
Set-GatePlan @("0")
$r = Run-FD ($commonDeploy + @("-ExpectedCommitsFile", $e26b)) $stubDeliver
Assert-True ($r.code -eq 0 -and $r.verdict -match 'deployed=yes') ("D26d 处置后重跑补部署:" + $r.verdict)

# D26e 合并后重导收尾构建判 INFRA(出口码 2)-> 同样报环境问题、不说「构建未过」;D26f 处置后重跑同一交付续走。
# 两侧都改表 -> 合并后重导表;导表桩往主 Fantasy 的表产物写一份新内容,Fantasy 收尾就先跑 服务端自检(桩按计划出码)。
G $slotDir "merge -q main" | Out-Null
G $slotFx "merge -q main" | Out-Null
Write-F $mainC $cfgD.LubanGenServerBat ("@echo off`r`n(echo regen-f-26e)> `"%~dp0..\..\..\" + $srvDir + "\" + ($lubanF -replace '/', '\') + "`"`r`nexit /b 0`r`n")
G $mainC "add -A" | Out-Null; G $mainC "commit -q -m `"cfg: d26e server regen stub`"" | Out-Null
G $slotDir "merge -q main" | Out-Null
Write-F $mainC "Configs/GameConfig/Datas/up26e.xlsx" "v-main`n"
G $mainC "add -A" | Out-Null; G $mainC "commit -q -m `"cfg: d26e upstream table`"" | Out-Null
Write-F $slotDir "Configs/GameConfig/Datas/slot26e.xlsx" "v-slot`n"
G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"cfg: d26e slot table [表文档无关:夹具]`"" | Out-Null
New-Ticket $slotDir
$e26e = Expected "e26e.txt" $slotDir $slotFx
Set-GatePlan @("2")
$r = Run-FD ($commonDeploy + @("-ExpectedCommitsFile", $e26e)) $stubDeliver
Assert-True ($r.code -eq 2 -and $r.verdict -match '^VERDICT: INFRA \| 重导后 服务端自检 判 INFRA' -and $r.verdict -match '环境问题' -and $r.verdict -notmatch '构建未过') ("D26e 重导收尾构建判 INFRA -> 报环境问题而非构建未过:" + $r.verdict)
$fx26e = @(G $mainF "-c core.quotepath=false status --porcelain" | Where-Object { $_ -match 'GameConfigBytes/item_tbitemdef\.bytes' })
$t26e = Get-FdTelLast
Assert-True ((Get-LogLines $gateLog).Count -eq 1 -and $fx26e.Count -eq 1 -and $t26e -and $t26e.verdict -eq "INFRA" -and $null -ne $t26e.phases.regen_build) ("D26e 只构建一次;Fantasy 收尾未提交(重导产物留在工作树);遥测记 regen_build 段:" + $(if ($t26e) { $t26e.phases | ConvertTo-Json -Compress } else { "无" }))
Set-GatePlan @("0")
$r = Run-FD ($commonDeploy + @("-ExpectedCommitsFile", $e26e)) $stubDeliver
$fxSubj26f = @(G $mainF "log --format=%s -3" | Where-Object { $_ -match '^【流程】合并后重导表收尾' })
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: DELIVERED .*deployed=yes' -and $fxSubj26f.Count -eq 1 -and @(G $mainF "status --porcelain" | Where-Object { $_ }).Count -eq 0) ("D26f 处置后重跑:重导收尾构建通过、Fantasy 收尾提交并部署:" + $r.verdict)

# ---------- D20 合并后重导协议作用在 -FantasyRoot 指定的主 Fantasy(不落 flow-config 真仓) ----------
# 静态守卫先行:未传 -FantasyRoot 时动态用例会对真仓跑协议导出,故静态不过即不跑动态段。
$fdSrc = [System.IO.File]::ReadAllText($flowDeliver)
$m1Static = $fdSrc -match 'Invoke-GenReExport\s+\$mainClient\s+\$mainFantasy'
Assert-True $m1Static "D20 合并后重导传主仓两根(`$mainClient / `$mainFantasy)"
# 动态段要真调 协议导出.ps1;本作删了它(没有服务端协议),只留上面的静态守卫。
if (-not (Test-Path (Join-Path $dfDir "协议导出.ps1"))) { Write-Host "SKIP D20 动态段:协议导出.ps1 不在本工程(服务端通道已移除)" }
elseif ($m1Static) {
  G $slotDir "merge -q main" | Out-Null
  G $slotFx "merge -q main" | Out-Null
  # 假导出工具:dll 在、ExporterSettings.json 缺 -> 协议导出 exit 2 并在输出里报出工具目录
  Write-F $mainF "Tools/ProtocolExportTool/Fantasy.ProtocolExportTool.dll" "fake`n"
  [System.IO.File]::AppendAllText((Join-Path $mainF ".git\info\exclude"), "`nTools/`n")
  # main 在槽位分叉后被推进、两侧各改一份协议源 -> 并入是真合并且两侧都动过协议域 -> 第 8 步重导协议。
  Write-F $mainF "examples/Config/NetworkProtocol/Outer/Up20.proto" "message Up20 {}`n"
  G $mainF "add -f -- examples/Config/NetworkProtocol/Outer/Up20.proto" | Out-Null; G $mainF "commit -q -m `"proto: d20 upstream`"" | Out-Null
  Write-F $slotFx "examples/Config/NetworkProtocol/Outer/Slot20.proto" "message Slot20 {}`n"
  G $slotFx "add -f -- examples/Config/NetworkProtocol/Outer/Slot20.proto" | Out-Null; G $slotFx "commit -q -m `"proto: d20 slot`"" | Out-Null
  Assert-True ((@(G $mainF "log -1 --format=%s")[0] -eq "proto: d20 upstream") -and (@(G $slotFx "log -1 --format=%s")[0] -eq "proto: d20 slot")) "D20 前置:两侧协议源提交都已落地"
  Write-F $slotDir "Demo/Assets/GameScripts/HotFix/GameLogic/W20.cs" "public class W20 {}`n"
  G $slotDir "add -A" | Out-Null; G $slotDir "commit -q -m `"feat: d20 client`"" | Out-Null
  New-Ticket $slotDir
  $e20 = Expected "e20.txt" $slotDir $slotFx
  $r = Run-FD ($common + @("-Protocol", "-ExpectedCommitsFile", $e20))
  Assert-True ($r.code -eq 2 -and $r.verdict -match '合并后重导协议失败' -and $r.verdict -match '协议导出 失败' -and $r.verdict.Contains((Join-Path $mainF "Tools\ProtocolExportTool"))) ("D20 合并后重导协议落在夹具主 Fantasy(" + $r.verdict + ")")
}

# ---------- 隔离验证(采样在 Run-FD,判据见顶部隔离守卫段) + cleanup: 夹具树 ----------
# 防回退断言:顶部隔离一旦被改坏,D13 / D13b 立刻转红。不要在此回头 `看板.ps1 -Slot 7 -Close`
# 清真看板:那是掩盖而非隔离(污染在矩阵运行的数分钟窗口内对任何读看板的人/脚本都可见)。
if ($script:RealRowLeak) { Write-Host ("INFO 真看板 " + $fxBoardKey + " 行 开跑前=" + $realRowBase + " 首次变化=" + $script:RealRowLeak) }
Assert-True (-not $script:RealRowLeak) "D13 全程未写真 board.json 的夹具行 $fxBoardKey(隔离生效)"
Assert-True $script:IsoRowSeen "D13b 隔离看板见到夹具行 $fxBoardKey(D13 采样有效)"
$env:LOCALAPPDATA = $oldLad
# 全通过才删夹具;有失败则留盘供排查(路径见上方 $fx,GUID 命名不会与下一轮冲突)
if ($script:TestFail -eq 0) { Remove-FixtureTree $fx } else { Write-Host ("INFO 夹具保留供排查:" + $fx) }

Write-Host ""
Exit-TestSuite
