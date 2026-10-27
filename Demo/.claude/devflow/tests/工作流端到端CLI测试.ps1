# 工作流端到端CLI测试.ps1 — devflow 机械层端到端假仓串联(领取 → 实现 → 交付)。
# 补的是各段已分测、但「领取产出被交付正确消费」这个跨段接缝没测的唯一机械缺口:
#   1. 跑 槽位领取内核.ps1 acquire(devflow 副本 + 显式 flow-config 注入假池)-> 真领取 + 登记看板
#   2. 假仓里模拟一次客户端实现(claim + work 提交)
#   3. 造 PASS 伪造凭据(经 测试夹具库 New-Ticket,树哈希与验凭据方同源),绕过真 Unity 检查
#   4. 调 集成交付.ps1(-RepoRoot/-Slot 覆盖指向假仓)-> 真交付
#   5. 验跨段契约:claim+work 合并进 main、双仓 push、看板行被交付清掉
# 真环境的检查/MCP/Unity 启动不在此(设计上无法无头),由 工作流通路检查.ps1 canary 覆盖。
# 夹具落 %TEMP%,不触真仓 / 真 claude-wf-3b。
[CmdletBinding(PositionalBinding=$false)]
param()
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
$cfgReal = Import-PowerShellDataFile (Join-Path $dfDir "flow-config.psd1")
$prefix = $cfgReal.SlotDirPrefix
$srvDir = $cfgReal.ServerDirName

function Add-Origin([string]$Repo, [string]$BarePath) {
  New-Item -ItemType Directory -Force -Path $BarePath | Out-Null
  cmd /c "git init -q --bare ""$BarePath"" 2>&1" | Out-Null
  G $Repo "remote add origin ""$BarePath""" | Out-Null
  G $Repo "push -q -u origin main" | Out-Null
}
function Get-Board {
  $p = Join-Path $env:LOCALAPPDATA "claude-wf-3b\board.json"
  if (-not (Test-Path $p)) { return $null }
  try { return ([System.IO.File]::ReadAllText($p) | ConvertFrom-Json) } catch { return $null }
}
function Test-BoardHas([string]$Key) {
  $b = Get-Board
  if ($null -eq $b) { return $false }
  return [bool]($b.PSObject.Properties.Name -contains $Key)
}

$script:fx = $null
$oldLad = $env:LOCALAPPDATA
Write-Host "== 工作流端到端 CLI 测试(领取 -> 实现 -> 交付) =="
try {
  $tmp = Join-Path $env:TEMP ("flowtest-e2e-" + [Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $tmp | Out-Null
  $script:fx = $tmp
  $env:LOCALAPPDATA = Join-Path $tmp "AppData"

  $mainC = Join-Path $tmp "main-client"
  $mainF = Join-Path $tmp "main-fantasy"
  New-GitRepo $mainC "Demo/Assets/GameScripts/HotFix/GameLogic/.gitkeep"
  New-GitRepo $mainF "examples/Server/.gitkeep"
  Write-F $mainC ".gitignore" "$srvDir/`n.gate/`n" | Out-Null
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m ""chore: ignore server dir and gate""" | Out-Null
  Add-Origin $mainC (Join-Path $tmp "origin-c.git")
  Add-Origin $mainF (Join-Path $tmp "origin-f.git")

  $pool = Join-Path $tmp "slots"
  $slots = @()
  foreach ($n in 1..3) {
    $s = Join-Path $pool ($prefix + $n)
    G $mainC "worktree add -q -b agent/dev$n ""$s"" main" | Out-Null
    G $mainF "worktree add -q -b agent/dev$n ""$(Join-Path $s $srvDir)"" main" | Out-Null
    $slots += $s
  }
  $slot = $slots[0]

  # devflow 副本 + 显式配置(领取内核按其所在目录读配置)
  $df = Join-Path $tmp "devflow"
  New-Item -ItemType Directory -Force -Path (Join-Path $df "hooks") | Out-Null
  Copy-Item (Join-Path $dfDir "hooks\hook函数库.ps1") (Join-Path $df "hooks") -Force
  Copy-Item (Join-Path $dfDir "看板.ps1") $df -Force
  Copy-Item (Join-Path $dfDir "槽位领取内核.ps1") $df -Force
  $cfgText = @"
@{
  RepoRoot         = '$($mainC -replace "'","''")'
  FantasyRoot      = '$($mainF -replace "'","''")'
  ServerDirName    = '$srvDir'
  SlotBaseDir      = '$($pool -replace "'","''")'
  SlotDirPrefix    = '$prefix'
  SlotCount        = '3'
  SlotBranchPrefix = 'agent/dev'
  SlotRootRe       = '-dev[1-3]$'
  ClientBaseline   = 'main'
  FantasyBaseline  = 'main'
  StaleClaimHours  = '24'
  BoardRelPath     = 'claude-wf-3b\board.json'
}
"@
  [System.IO.File]::WriteAllText((Join-Path $df "flow-config.psd1"), $cfgText, (New-Object System.Text.UTF8Encoding($true)))

  # -- 1. 真领取 --
  # 清单走文件:经 -File 起子进程时 [string[]] 绑定不按逗号拆分,单条尚可、多条会退化成一条长串,
  # 留着这种形态等于把已修掉的失效面重新种回测试里。
  $e2ePathsFile = Join-Path $df "e2e-paths.txt"
  [System.IO.File]::WriteAllLines($e2ePathsFile, [string[]]@("Demo/Assets/GameScripts/HotFix/GameLogic"), (New-Object System.Text.UTF8Encoding($false)))
  $acq = @(& (Get-FlowEngine) -NoProfile -File (Join-Path $df "槽位领取内核.ps1") `
             -Topic "端到端 canary" -PathsFile $e2ePathsFile 2>&1 |
           ForEach-Object { [string]$_ })
  $acqCode = $LASTEXITCODE
  $acqOut = $acq -join "`n"
  Assert-True ($acqCode -eq 0 -and $acqOut -match "ACQUIRED 1") "1 领取 dev1 -> ACQUIRED"
  $b = Get-Board
  Assert-True ((Test-BoardHas "dev1") -and $b.dev1.stage -eq "实现中") "2 领取登记看板 dev1 stage=实现中"

  # -- 2. 假仓模拟客户端实现 --
  Write-F $slot "Demo/Assets/GameScripts/HotFix/GameLogic/EndToEnd.cs" "public class EndToEnd {}`n" | Out-Null
  G $slot "add -A" | Out-Null
  G $slot "commit -q -m ""【新增】e2e: work""" | Out-Null

  # -- 3. 造 PASS 伪造凭据(经夹具库,与其余套件同一造法) --
  # 必须走 New-Ticket 而非在本进程算树哈希:hook函数库 由夹具库单向引入,套件自行再 dot-source
  # 会把被测库状态带进本进程,算出的树与交付侧校验值不一致(表现为 DENIED-ticket-tree-mismatch)。
  New-Ticket $slot

  # -- 4. expected-commits(槽位全 ahead) --
  # 括号不可省:G 用 `return , $arr` 防单元素解包,直接把函数放进管道会把整个数组当作一个元素传下去
  $hashes = @((G $slot "log --format=%H main..HEAD") | ForEach-Object { ([string]$_).Trim() } | Where-Object { $_.Length -eq 40 })
  $expected = Join-Path $tmp "expected.txt"
  [System.IO.File]::WriteAllText($expected, (($hashes -join "`n") + "`n"), (New-Object System.Text.UTF8Encoding($false)))

  # -- 5. 真交付 --
  $del = @(& (Get-FlowEngine) -NoProfile -File (Join-Path $dfDir "集成交付.ps1") `
             -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -Slot $slot -ExpectedCommitsFile $expected 2>&1 |
           ForEach-Object { [string]$_ })
  $delCode = $LASTEXITCODE
  $delOut = $del -join "`n"
  Assert-True ($delCode -eq 0 -and $delOut -match "VERDICT: DELIVERED") "3 集成交付 -> DELIVERED"

  # -- 6. 跨段契约 --
  $mainTree = (G $mainC "ls-tree -r --name-only HEAD") -join "`n"
  Assert-True ($mainTree -match "GameScripts/HotFix/GameLogic/EndToEnd\.cs") "4 work 提交已合并进 main"
  $localTip = (G $mainC "rev-parse HEAD")[0].Trim()
  $originTip = (G $mainC "rev-parse refs/remotes/origin/main")[0].Trim()
  Assert-True ($localTip -eq $originTip) "5 合并后的 main 已 push 到 origin"
  $slotPushed = (G $slot "rev-parse origin/agent/dev1")[0].Trim()
  Assert-True ($slotPushed -match '^[0-9a-f]{40}$') "6 槽位分支已 push 到 origin"
  Assert-True (-not (Test-BoardHas "dev1")) "7 交付合并闭环清掉看板行"

  if ($script:TestFail -gt 0) { Write-Host "--- 领取输出 ---"; Write-Host $acqOut; Write-Host "--- 交付输出 ---"; Write-Host $delOut }
}
finally {
  if ($script:fx -and (Test-Path $script:fx)) { Remove-FixtureTree $script:fx }
  $env:LOCALAPPDATA = $oldLad
}

Write-Host ""
Exit-TestSuite
