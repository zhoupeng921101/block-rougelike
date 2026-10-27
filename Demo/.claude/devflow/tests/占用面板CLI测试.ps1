# 占用面板CLI测试.ps1 — 只读占用面板的 CLI 层测试(黑盒断言,不依赖内部实现)。
# 覆盖:IDLE 无看板行(boardFlag 空)、git 占用但无行(unregistered)、空闲但留行(stale)、
#   占用且有行(ok)、槽位目录缺失(absent)、看板有行无对应槽位(extraBoard)、
#   改动范围合并去重去引号排序(footprint)、空闲口径(tracked 改动占用 / 仅 untracked 空闲,与领取内核同口径)。
# 夹具 = %TEMP% 下真 git 仓 + 配对 worktree + 隔离 LOCALAPPDATA;经 -Slots 显式传池,不改配置。
# 跑法:占用面板CLI测试.ps1 [-Target <实现路径>]   缺省 = 上级目录的 占用面板.ps1
[CmdletBinding(PositionalBinding=$false)]
param([string]$Target = "")
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
# 服务端通道关闭时换成启用服务端的 devflow 副本(见夹具库同名函数);副本落套件级临时目录,收尾删。
$srvDf = Join-Path $env:TEMP ("flowtest-srvdf-" + [Guid]::NewGuid().ToString("N"))
$dfDir = Get-ServerFlowDir $dfDir $srvDf
if (-not $Target) { $Target = Join-Path $dfDir "占用面板.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }
$cfg = Import-PowerShellDataFile (Join-Path $dfDir "flow-config.psd1")
$srvDir = $cfg.ServerDirName

function Get-Snapshot([string[]]$SlotPaths) {
  $lit = ($SlotPaths | ForEach-Object { "'" + $_.Replace("'", "''") + "'" }) -join ","
  $raw = (& (Get-FlowEngine) -NoProfile -Command "& '$Target' -Json -Slots $lit" 2>&1 | Out-String)
  return ($raw | ConvertFrom-Json)
}
function Get-Slot($Snap, [string]$DevN) {
  return @($Snap.slots | Where-Object { $_.name -like "*$DevN" })[0]
}

$script:fx = $null
$script:oldLad = $env:LOCALAPPDATA
function New-Fixture {
  $tmp = Join-Path $env:TEMP ("flowtest-status-" + [Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $tmp | Out-Null
  $script:fx = $tmp
  $env:LOCALAPPDATA = Join-Path $tmp "AppData"
  $mainC = Join-Path $tmp "main-client"; New-GitRepo $mainC
  $mainF = Join-Path $tmp "main-fantasy"; New-GitRepo $mainF
  # 客户端仓须忽略服务端目录(与真仓同形):Fantasy worktree 建在槽位内,不忽略则该目录
  # 成为客户端仓的未跟踪路径,槽位永远算不上 IDLE。
  Write-F $mainC ".gitignore" "$srvDir/`n"
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m ""chore: ignore server dir""" | Out-Null
  $slots = @()
  foreach ($n in 1, 2) {
    $s = Join-Path $tmp "slots\block-client-dev$n"
    G $mainC "worktree add -q -b agent/dev$n ""$s"" main" | Out-Null
    G $mainF "worktree add -q -b agent/dev$n ""$(Join-Path $s $srvDir)"" main" | Out-Null
    $slots += $s
  }
  return @{ tmp = $tmp; mainC = $mainC; mainF = $mainF; slots = $slots }
}
function Set-Board([hashtable]$Rows) {
  $bp = Join-Path $env:LOCALAPPDATA "claude-wf-3b\board.json"
  New-Item -ItemType Directory -Force -Path (Split-Path $bp -Parent) | Out-Null
  $o = [ordered]@{}
  foreach ($k in $Rows.Keys) { $o[$k] = $Rows[$k] }
  [System.IO.File]::WriteAllText($bp, ($o | ConvertTo-Json -Depth 6), (New-Object System.Text.UTF8Encoding($false)))
}

Write-Host "== 占用面板 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # 1. IDLE 且无看板行
  $F = New-Fixture
  $s1 = Get-Slot (Get-Snapshot $F.slots) "dev1"
  Assert-True ($s1.idle -eq $true -and $null -eq $s1.boardFlag) "1 IDLE 且无看板行 -> boardFlag 空"
  Remove-Fixture

  # 2. git 占用但看板无行 -> unregistered
  $F = New-Fixture
  G $F.slots[1] "commit -q --allow-empty -m ""feat: 真活""" | Out-Null
  $s2 = Get-Slot (Get-Snapshot $F.slots) "dev2"
  Assert-True ($s2.idle -eq $false -and $s2.client.ahead -eq 1 -and $s2.boardFlag -eq "unregistered") "2 占用无行 -> unregistered"
  Remove-Fixture

  # 2b. 会话身份的 git 兜底:看板行丢失(unregistered)时改从 claim 提交的 Session-Id trailer 取。
  # 这正是「git 显示被占、看板无行」——最需要知道该切回哪个会话、而看板恰恰给不出的场景。
  $F = New-Fixture
  # 多个 -m(git 以空行连接)而非嵌换行:换行穿 cmd 命令行不可靠(shell-conventions·文本走文件)
  G $F.slots[1] "commit -q --allow-empty -m ""claim: 带身份的活"" -m ""简报正文"" -m ""Session-Id: local_fallback_7c7c""" | Out-Null
  $s2 = Get-Slot (Get-Snapshot $F.slots) "dev2"
  Assert-True ($s2.boardFlag -eq "unregistered" -and $s2.session.id -eq "local_fallback_7c7c" -and $s2.session.shortId -eq "fallback" -and $s2.session.source -eq "git") "2b 看板无行 -> 会话身份回落 claim trailer 并标源 git"
  Assert-True ($s2.claimBrief -eq "简报正文") "2c 兜底路径下简报仍剥净 trailer"
  Remove-Fixture

  # 2d. 看板行有 sessionId 时以它为准(续接后看板即时刷新,claim trailer 是领取时那个、会过时)
  $F = New-Fixture
  G $F.slots[0] "commit -q --allow-empty -m ""claim: 活"" -m ""Session-Id: local_old_claim""" | Out-Null
  Set-Board @{ dev1 = [ordered]@{ topic = "在做"; stage = "实现中"; note = ""; sessionId = "local_new_board"; updatedAt = "t" } }
  $s1 = Get-Slot (Get-Snapshot $F.slots) "dev1"
  Assert-True ($s1.session.id -eq "local_new_board" -and $s1.session.source -eq "board") "2d 看板有 sessionId -> 优先看板、不被 claim trailer 覆盖"
  Remove-Fixture

  # 3. 空闲但看板留行 -> stale
  $F = New-Fixture
  Set-Board @{ dev1 = [ordered]@{ topic = "旧任务"; stage = "实现中"; note = ""; updatedAt = "t" } }
  $s1 = Get-Slot (Get-Snapshot $F.slots) "dev1"
  Assert-True ($s1.idle -eq $true -and $s1.boardFlag -eq "stale") "3 空闲留行 -> stale"
  Remove-Fixture

  # 4. 占用且有行 -> ok
  $F = New-Fixture
  G $F.slots[0] "commit -q --allow-empty -m ""feat: 干活""" | Out-Null
  Set-Board @{ dev1 = [ordered]@{ topic = "在做"; stage = "实现中"; note = ""; updatedAt = "t" } }
  $s1 = Get-Slot (Get-Snapshot $F.slots) "dev1"
  Assert-True ($s1.boardFlag -eq "ok") "4 占用有行 -> ok"
  Remove-Fixture

  # 5. 槽位目录缺失 -> absent
  $F = New-Fixture
  G $F.mainC "worktree remove --force ""$($F.slots[1])""" | Out-Null
  if (Test-Path $F.slots[1]) { [System.IO.Directory]::Delete($F.slots[1], $true) }
  $s2 = Get-Slot (Get-Snapshot $F.slots) "dev2"
  Assert-True ($s2.absent -eq $true) "5 槽位目录缺失 -> absent"
  Remove-Fixture

  # 6. 看板有行但无对应槽位 -> extraBoard
  $F = New-Fixture
  Set-Board @{ dev9 = [ordered]@{ topic = "无对应槽"; stage = "x"; note = ""; updatedAt = "t" } }
  $snap = Get-Snapshot $F.slots
  Assert-True (@($snap.extraBoard | ForEach-Object { $_.key }) -contains "dev9") "6 无对应槽的看板行 -> extraBoard"
  Remove-Fixture

  # 7. 改动范围:提交改动 + 未提交改动合并去重排序
  $F = New-Fixture
  Write-F $F.slots[0] "Demo/Assets/GameLogic/x.cs" "x`n"
  G $F.slots[0] "add -A" | Out-Null
  G $F.slots[0] "commit -q -m ""feat: x""" | Out-Null
  Write-F $F.slots[0] "Demo/Assets/GameLogic/y.cs" "y`n"   # untracked
  $s1 = Get-Slot (Get-Snapshot $F.slots) "dev1"
  $fpc = @($s1.footprint.client)
  Assert-True ($fpc -contains "Demo/Assets/GameLogic/x.cs" -and $fpc -contains "Demo/Assets/GameLogic/y.cs" -and $fpc.Count -eq 2) "7 改动范围合并提交改动与未提交改动"
  Remove-Fixture

  # 8/9/10. 空闲口径与 槽位领取内核 一致(内核套件 11/12/13 断言同一组形态):
  # tracked 未提交改动(任一仓)= 占用;只有 untracked = 空闲(领用的 reset --hard 不动 untracked)。
  $F = New-Fixture
  Write-F $F.slots[0] "seed.txt" "modified`n"
  Write-F $F.slots[1] "scratch.txt" "leftover`n"
  $snap = Get-Snapshot $F.slots
  $s1 = Get-Slot $snap "dev1"; $s2 = Get-Slot $snap "dev2"
  Assert-True ($s1.idle -eq $false -and $s1.client.ahead -eq 0 -and $s1.client.dirty -eq 1) "8 仅客户端 tracked 未提交改动 -> 占用"
  Assert-True ($s2.idle -eq $true) "9 仅 untracked -> 空闲"
  Remove-Fixture

  $F = New-Fixture
  Write-F (Join-Path $F.slots[0] $srvDir) "seed.txt" "modified`n"
  $s1 = Get-Slot (Get-Snapshot $F.slots) "dev1"
  Assert-True ($s1.idle -eq $false -and $s1.fantasy.dirty -eq 1) "10 仅 Fantasy tracked 未提交改动 -> 占用"
  Remove-Fixture

  # 11. watch 清单:看板点 + 两仓各一组 ref 点,git 目录取自槽位的 common dir(各槽共用,去重)
  $F = New-Fixture
  $snap = Get-Snapshot $F.slots
  $w = @($snap.watch)
  $dirs = @($w | ForEach-Object { [System.IO.Path]::GetFullPath($_.dir).TrimEnd('\') })
  $gitC = [System.IO.Path]::GetFullPath((Join-Path $F.mainC ".git"))
  $gitF = [System.IO.Path]::GetFullPath((Join-Path $F.mainF ".git"))
  Assert-True ($w.Count -eq 5) "11a watch 共 5 点(看板 1 + 两仓各 2,槽位间去重)"
  Assert-True (@($w | Where-Object { $_.filter -eq "board.json*" }).Count -eq 1) "11b 看板点 filter 带尾 *"
  Assert-True ($dirs -contains (Join-Path $gitC "refs\heads") -and $dirs -contains (Join-Path $gitF "refs\heads")) "11c 两仓 refs\heads 均在列"
  Assert-True ($dirs -contains $gitC -and $dirs -contains $gitF) "11d 两仓 packed-refs 点均在列"
  Remove-Fixture
}
finally {
  Remove-Fixture
  Remove-FixtureTree $srvDf
  $env:LOCALAPPDATA = $script:oldLad
}

Write-Host ""
Exit-TestSuite
