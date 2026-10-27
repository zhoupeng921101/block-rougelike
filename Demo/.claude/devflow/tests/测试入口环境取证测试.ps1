# 测试入口环境取证测试.ps1 — run_tests.ps1 自身的 CLI 层契约:开跑前的内存水位提示,与套件未通过时的
# 崩溃退出 / 内存耗尽点名(黑盒断言,不依赖内部实现)。
# 覆盖:MEM 行 / WARN low-commit 只提示不拦 / 水位读不到不当成低 / 通过的套件不点名(有旁证也不点)/
#   断言失败且无旁证不点名 / 断言失败 + 内存耗尽旁证 -> ENV-SUSPECT 且退出码不变 / 套件进程以崩溃码退出
#   -> CRASH 且退出码原样透传 / 两样并存 / 表外的崩溃码照样点名。
# 夹具:%TEMP% 下一份只含 run_tests.ps1 + hooks\hook函数库.ps1 + 显式 flow-config.psd1 的 devflow 副本,
#   tests\ 里放四个假套件(通过 / 断言失败 / 以 0xC00000FD 退出 / 以表外的码退出)。假套件只打一行就退出,
#   不真的崩:要验的是入口怎么读退出码,不是怎么把进程弄崩。
# 两处探针经环境变量注入(FLOW_TEST_MEM_PROBE / FLOW_TEST_EXHAUSTION),不读本机真实水位与事件日志——
#   读真的,用例结果就随开跑那一刻的机器状态变,而这正是本套件要防的那类不稳。
# 只走 -Suite 通路:矩阵通路与它共用同一个 Write-SuiteOutcome,多出来的只是计数与一行汇总。
# 不触真仓、不触真 claude-wf-3b(LOCALAPPDATA 一并隔离)。
# 跑法:测试入口环境取证测试.ps1 [-Target <实现路径>]   缺省 = 上级目录的 run_tests.ps1
[CmdletBinding(PositionalBinding=$false)]
param([string]$Target = "")
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "run_tests.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = $null
$script:oldLad = $env:LOCALAPPDATA
$script:oldProbe = $env:FLOW_TEST_MEM_PROBE
$script:oldExh = $env:FLOW_TEST_EXHAUSTION

function New-Fixture {
  $tmp = Join-Path $env:TEMP ("flowtest-entryenv-" + [Guid]::NewGuid().ToString("N"))
  $script:fx = $tmp
  $df = Join-Path $tmp "devflow"
  New-Item -ItemType Directory -Force -Path (Join-Path $df "hooks") | Out-Null
  New-Item -ItemType Directory -Force -Path (Join-Path $df "tests") | Out-Null
  $env:LOCALAPPDATA = Join-Path $tmp "AppData"
  New-Item -ItemType Directory -Force -Path $env:LOCALAPPDATA | Out-Null
  Copy-Item (Join-Path $dfDir "hooks\hook函数库.ps1") (Join-Path $df "hooks") -Force
  Copy-Item $Target (Join-Path $df "run_tests.ps1") -Force
  # 入口只读 BoardRelPath(推哨兵里的运行态目录名);其余键给全是因为配置加载时会补路径键。
  $cfg = @"
@{
  RepoRoot         = '$($tmp -replace "'","''")'
  FantasyRoot      = '$($tmp -replace "'","''")'
  ServerDirName    = 'block-server'
  SlotBaseDir      = '$($tmp -replace "'","''")'
  SlotDirPrefix    = 'block-client-dev'
  SlotCount        = '3'
  SlotBranchPrefix = 'agent/dev'
  SlotRootRe       = '-dev[1-9]$'
  ClientBaseline   = 'main'
  FantasyBaseline  = 'main'
  StaleClaimHours  = '24'
  BoardRelPath     = 'claude-wf-3b\board.json'
}
"@
  [System.IO.File]::WriteAllText((Join-Path $df "flow-config.psd1"), $cfg, (New-Object System.Text.UTF8Encoding($true)))
  # 假套件:文件名带中文(入口按「<短名>测试.ps1」找),内容纯 ASCII。
  $suites = @{
    "假通过测试.ps1"   = "Write-Host '[PASS] ok'`nWrite-Host 'RESULT: 1/1 passed, 0 failed'`nexit 0`n"
    "假失败测试.ps1"   = "Write-Host '[FAIL] nope'`nWrite-Host 'RESULT: 0/1 passed, 1 failed'`nexit 1`n"
    "假栈溢出测试.ps1" = "Write-Host '[PASS] first'`nexit -1073741571`n"
    "假怪码测试.ps1"   = "Write-Host '[PASS] first'`nexit 77`n"
  }
  foreach ($k in $suites.Keys) {
    [System.IO.File]::WriteAllText((Join-Path $df ("tests\" + $k)), $suites[$k], (New-Object System.Text.UTF8Encoding($true)))
  }
  return @{ tmp = $tmp; df = $df }
}

function Invoke-Entry($F, [string]$SuiteName, [string]$FreeMB, [string]$Exhaustion) {
  # 探针注入随子进程环境继承;每次调用显式设,不留上一例的值。
  $env:FLOW_TEST_MEM_PROBE = $FreeMB
  $env:FLOW_TEST_EXHAUSTION = $Exhaustion
  $r = Invoke-FlowChild (Join-Path $F.df "run_tests.ps1") @("-Suite", $SuiteName)
  return @{ code = $r.code; out = ($r.lines -join "`n") }
}

Write-Host "== 测试入口 环境取证 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  $F = New-Fixture
  $evid = "系统日志记了 1 条虚拟内存不足(注入)"

  # E1. 水位宽裕 + 套件通过:只有 MEM 行,别的都不出
  $r = Invoke-Entry $F "假通过" "9000" "none"
  Assert-True ($r.code -eq 0 -and $r.out -match "MEM: 可用提交内存 8\.8 GB" -and $r.out -match "RESULT: 1/1 passed" `
    -and $r.out -notmatch "WARN low-commit" -and $r.out -notmatch "CRASH:" -and $r.out -notmatch "ENV-SUSPECT") `
    "E1 水位宽裕、套件通过 -> 只打 MEM 行,exit 0"

  # E2. 水位低:提示,但套件照跑、结论照出(只提示不拦)
  $r = Invoke-Entry $F "假通过" "2000" "none"
  Assert-True ($r.code -eq 0 -and $r.out -match "WARN low-commit" -and $r.out -match "RESULT: 1/1 passed") `
    "E2 水位低于阈值 -> WARN low-commit,套件照跑,exit 0"

  # E3. 水位读不到:说明读不到,不当成低
  $r = Invoke-Entry $F "假通过" "-1" "none"
  Assert-True ($r.code -eq 0 -and $r.out -match "MEM: 可用提交内存读不到" -and $r.out -notmatch "WARN low-commit" -and $r.out -match "RESULT: 1/1 passed") `
    "E3 水位读不到 -> 照实说,不打 WARN,套件照跑"

  # E4. 通过的套件即使运行期间有内存耗尽旁证也不点名:点名只为了解释「未通过」
  $r = Invoke-Entry $F "假通过" "9000" $evid
  Assert-True ($r.code -eq 0 -and $r.out -notmatch "ENV-SUSPECT" -and $r.out -notmatch "CRASH:") `
    "E4 套件通过 + 有内存耗尽旁证 -> 不点名"

  # E5. 断言失败且无旁证:就是普通失败,不往环境上推
  $r = Invoke-Entry $F "假失败" "9000" "none"
  Assert-True ($r.code -eq 1 -and $r.out -match "RESULT: 0/1 passed" -and $r.out -notmatch "ENV-SUSPECT" -and $r.out -notmatch "CRASH:") `
    "E5 断言失败、无旁证 -> 不点名,exit 1"

  # E6. 断言失败 + 旁证:点名并带上旁证原文;仍是未通过,退出码不变
  $r = Invoke-Entry $F "假失败" "9000" $evid
  Assert-True ($r.code -eq 1 -and $r.out -match "ENV-SUSPECT: 假失败 " -and $r.out -match "注入" -and $r.out -match "此刻可用提交内存 8\.8 GB" `
    -and $r.out -match "-Suite 单独重跑" -and $r.out -notmatch "CRASH:") `
    "E6 断言失败 + 内存耗尽旁证 -> ENV-SUSPECT 带旁证,exit 仍为 1"

  # E7. 套件进程以栈溢出码退出、无旁证:点名崩溃并说明是哪种;不推到环境上;退出码原样透传
  $r = Invoke-Entry $F "假栈溢出" "9000" "none"
  Assert-True ($r.code -eq -1073741571 -and $r.out -match "CRASH: 假栈溢出 " -and $r.out -match "0xC00000FD" -and $r.out -match "不是断言结论" `
    -and $r.out -notmatch "ENV-SUSPECT") `
    "E7 套件进程以 0xC00000FD 退出 -> CRASH 点名,退出码透传($($r.code))"

  # E8. 崩溃码 + 旁证:两行都出
  $r = Invoke-Entry $F "假栈溢出" "1500" $evid
  Assert-True ($r.code -eq -1073741571 -and $r.out -match "CRASH: 假栈溢出 " -and $r.out -match "ENV-SUSPECT: 假栈溢出 " -and $r.out -match "WARN low-commit") `
    "E8 崩溃码 + 旁证 + 低水位 -> WARN、CRASH、ENV-SUSPECT 都出"

  # E9. 表外的退出码:照样点名,只打十六进制
  $r = Invoke-Entry $F "假怪码" "9000" "none"
  Assert-True ($r.code -eq 77 -and $r.out -match "CRASH: 假怪码 " -and $r.out -match "0x0000004D") `
    "E9 表外的退出码 77 -> CRASH 点名并打十六进制"

  # E10. 套件不存在:老行为不变(exit 2),不打 MEM、不取证
  $r = Invoke-Entry $F "没有这个" "9000" $evid
  Assert-True ($r.code -eq 2 -and $r.out -match "ABORT: 找不到套件" -and $r.out -notmatch "MEM:" -and $r.out -notmatch "ENV-SUSPECT") `
    "E10 套件不存在 -> ABORT exit 2,不打 MEM 不取证"

  # E11. 入口进程自己(探针、取证)不往 LOCALAPPDATA 写运行态:上面十次调用里入口继承的是本套件
  # 隔离的 LOCALAPPDATA,跑完那里不该出现 claude-wf-3b。
  $wf = Join-Path $env:LOCALAPPDATA "claude-wf-3b"
  Assert-True (-not (Test-Path $wf)) "E11 入口的水位探针与取证不写运行态目录"
  Remove-Fixture
}
finally {
  Remove-Fixture
  $env:LOCALAPPDATA = $script:oldLad
  $env:FLOW_TEST_MEM_PROBE = $script:oldProbe
  $env:FLOW_TEST_EXHAUSTION = $script:oldExh
}

Write-Host ""
Exit-TestSuite
