# run_tests.ps1 — devflow 测试入口(全部套件均为 .ps1;假仓 + 隔离 LOCALAPPDATA 落 %TEMP%,
# 不触真仓 / 真 claude-wf-3b)。
#   无参        : 静态前置(静态扫描.ps1)+ 全量回归矩阵(下方 $Suites)
#   -Suite <名> : 单套件,传中文短名,如 -Suite 看板CLI  ->  tests\看板CLI测试.ps1
#   -Canary     : 真环境 canary 通路检查(工作流通路检查.ps1,需活 Unity 编辑器;透传其余参数)
#
# 「不触真 claude-wf-3b」由本脚本兜底并验证,不靠各套件自觉:每个套件(及静态前置)都在一次性哨兵
# LOCALAPPDATA(%TEMP%\flowtest-lad-<GUID>)下启动,漏隔离的套件只写得进哨兵、写不到真目录;跑完
# 哨兵里出现 claude-wf-3b 即打 LEAK 行点名该套件并使退出码非零(New-SentinelLad / Test-SentinelClean)。
# 干净的哨兵跑完即删,LEAK 的留盘供排查(路径见 LEAK 行,查完可删)。各套件的隔离是各自手写的,
# 漏一个就静默污染,而静态检查抓不到——实发过:矩阵运行的数分钟窗口内真看板出现假占用行。
#
# 内存见底的未通过单独点名(见下方「环境取证」段):开跑前打一行 MEM(可用提交内存,低了加 WARN
# low-commit,只提示不拦);套件未通过时,套件进程是崩溃退出的打 CRASH,运行期间系统记了内存耗尽的
# 打 ENV-SUSPECT(矩阵末尾另有 ENV-SUMMARY)。只点名:未通过照计未通过、退出码不变、不重试。
# 退出码:0 全通过;1 有失败或有泄漏;2 参数/套件不存在;单套件模式下套件进程崩溃时原样透传其退出码;
# -Canary 原样透传 工作流通路检查.ps1 的退出码(各码含义见其头注)。
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Suite = "",
  [switch]$Canary,
  [Parameter(ValueFromRemainingArguments=$true)][string[]]$Rest = @()
)
$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
$testsDir = Join-Path $here "tests"
. (Join-Path $here "hooks\hook函数库.ps1")
$engine = Get-FlowEngine

# 全量矩阵成员(单一事实源;新增套件在此登记)
$Suites = @(
  "hook函数库测试",          # 共享库单元
  "xlsx读取库测试",          # 共享库单元(xlsx 读取)
  "静态扫描测试",            # 以下四项 = 元检查(脚本 / 规则栈自身的结构核对)
  "语法自检测试",
  "理由对齐核对测试",
  "记忆索引核对测试",
  "提交检查测试",           # 命令面 git commit/push/merge 拦截演练
  "提交前绑定核对测试",     # git 提交前钩子(会话外手动提交的 UI 绑定核对)+ 其安装脚本
  "命令通路检查测试",       # 命令面 Bash 嵌 powershell / cmd 裸名调 bat / 前台调交付入口 拦截演练
  "写入补BOM测试",          # PostToolUse:Write/Edit 后补 UTF-8 BOM
  "单仓提交测试",
  "集成交付测试",
  "槽位交付测试",
  "槽位领取测试",            # -Release 事务回滚 / -Abandon 显式放弃
  "槽位领取就绪检查测试",
  "简报校验测试",
  "自审触发判定测试",
  "客户端自检测试",          # 自检编排:子道异常/未知退出码/Editor 编译出口分类
  "命名空间扫描测试",        # 以下各项 = 客户端自检各道扫描的 CLI 契约,按道次排列
  "平台宏核对测试",
  "文本截断核对测试",
  "UI绑定核对测试",
  "安全区结构核对测试",
  "图集子图组件核对测试",
  "bat编码核对测试",
  "热更程序集核对测试",
  "机器路径核对测试",
  "工程链接核对测试",
  "进程编码核对测试",
  "启动器字体核对测试",
  "临时测试清理测试",
  "重建csproj测试",          # csproj 过期判定与就地修复(假 Unity 工程)
  "合并丢失核对测试",        # 工具类:合并提交静默吃行核对
  "漂移取证测试",            # 工具类:UnityMCP 实例漂移取证 -Report
  "检查命中面板测试",        # 工具类:自检各道零命中复核候选(Reviewed 抑制 / 复列)
  "看板CLI测试",
  "合并预检CLI测试",
  "交付历史CLI测试",
  "占用面板CLI测试",
  "测试入口环境取证测试",    # run_tests 自身:开跑前水位提示 / 未通过时的崩溃与内存耗尽点名
  "槽位领取内核CLI测试",     # acquire 主路径
  "工作流端到端CLI测试"      # 领取->实现->交付 跨段串联,置末(最慢、最高层)
)

# ---- 泄漏守卫:一次性哨兵 LOCALAPPDATA ----
# 不比对真 claude-wf-3b 的前后指纹:真目录由并发的 devflow 会话持续合法写入(看板行、遥测),一有别的
# 会话活跃就报假 LEAK。哨兵只有被测进程树写得到,判定与并发无关;每个套件一个哨兵,迟到的写入
# 也落在自己的哨兵里,不会算到下一个套件头上。
# 前提:仓外运行态路径一律经 hook函数库 Resolve-WfStatePath 由 $env:LOCALAPPDATA 派生(WfStateRoot /
# Get-BoardPath;静态扫描 R18 拦绕过者)。哨兵下没有 Packages\Claude_*,解析即落哨兵内普通路径;
# 绕开环境变量取路径的写入(如 [Environment]::GetFolderPath)不在视野内。
$realLad = $env:LOCALAPPDATA
# 目录名从 BoardRelPath 的父段推导,与 flow-config 单源(运行态根正本 = hook函数库 $script:WfStateRoot)
$wfRel = Split-Path (Get-FlowConfig).BoardRelPath -Parent

function New-SentinelLad {
  $p = Join-Path $env:TEMP ("flowtest-lad-" + [Guid]::NewGuid().ToString("N"))
  [System.IO.Directory]::CreateDirectory($p) | Out-Null
  return $p
}

function Test-SentinelClean([string]$Sentinel, [string]$Label, [switch]$Late) {
  # $true = 哨兵里没有 claude-wf-3b 写入。脏的打 LEAK 并留盘供排查,干净的由调用方删。
  $wf = Join-Path $Sentinel $wfRel
  $files = @(if (Test-Path $wf) { Get-ChildItem $wf -Recurse -File -Force -ErrorAction SilentlyContinue })
  if ($files.Count -eq 0) { return $true }
  $when = if ($Late) { "(套件退出后才落盘,矩阵末尾复查截获)" } else { "" }
  Write-Host ("LEAK: $Label 未隔离 `$env:LOCALAPPDATA,写进了 claude-wf-3b$when —— 已被哨兵截住,真目录未动;" +
              "该套件须在载入 hook函数库、拉起子进程之前把 `$env:LOCALAPPDATA 指到夹具内")
  foreach ($f in ($files | Select-Object -First 12)) {
    Write-Host ("      " + $f.FullName.Substring($wf.Length) + " (" + $f.Length + " B)")
  }
  if ($files.Count -gt 12) { Write-Host ("      (+" + ($files.Count - 12) + " 项)") }
  Write-Host ("      哨兵留盘:" + $Sentinel)
  return $false
}

function Remove-Sentinel([string]$Sentinel) {
  # 尽力而为:哨兵落在 %TEMP%,删不掉不影响判定
  try { [System.IO.Directory]::Delete($Sentinel, $true) } catch {}
}

# ---- 环境取证:整机提交内存见底时的未通过单独点名 ----
# 本机常开多个 Unity 编辑器,可用提交内存(提交上限 - 已提交)会瞬时见底。见底的那一两秒里,套件起的
# 子进程起不来(The shell cannot be started / Program 'powershell.exe' failed to run)、进程以
# OutOfMemoryException 退出、或给栈扩页时拿不到内存而被报成 StackOverflowException(退出码 0xC00000FD)
# ——三种死法同一个原因,落在哪个用例只取决于见底的时刻。还有一种是子进程死了、套件照常出 [FAIL] 与
# RESULT 行,从输出上与真的断言失败分不出来(实发 2026-10-10 一天三次,取证与复现的要点记在
# .claude/rules-archive/audit-log.md 同日「测试入口点名内存见底」一段)。所以判别不扫套件输出,看两样
# 旁证:套件进程自己的退出码,与套件运行那段时间里系统自己记下的内存耗尽事件。
# 只点名、不改判:未通过照计未通过,退出码不变,**不重试**——重试会把真失败一起盖掉。
# 开跑前的水位只是提示,不拦:见底是瞬时的,开跑时宽裕不代表全程宽裕,反过来也一样。
$LowCommitWarnMB = 4096   # 低于此值打 WARN low-commit(2026-10-10 三次失败前后采到 2.3~2.4 GB,4.1 GB 那次通过)
# 套件自己退出只有 0(全过)/ 1(有断言失败或未捕获的脚本错误)/ 2(参数或被测目标缺失);别的码 = 进程
# 不是自己退出的。表里是见过的几种,给人看的说明;没列的照样点名,只打十六进制。
$CrashExitNotes = @{
  -1073741571 = "0xC00000FD 栈溢出(提交内存见底时栈扩不了页也报这个)"
  -532462766  = "0xE0434352 未处理的 .NET 异常(内存见底时多为 OutOfMemoryException)"
  -2146232797 = "0x80131623 .NET FailFast"
  -1073741801 = "0xC0000017 内存不足"
}

function Get-MemProbe {
  # 回 @{ freeMB; limitMB }(可用提交内存 / 提交上限)。取不到回 -1:内存见底时 WMI 自己也会失败,
  # 调用方按「未知」处理,不当成低。
  # 测试注入:FLOW_TEST_MEM_PROBE = 可用 MB(仅 tests\测试入口环境取证测试.ps1 设;生产不设)。
  if ($env:FLOW_TEST_MEM_PROBE) { return @{ freeMB = [int]$env:FLOW_TEST_MEM_PROBE; limitMB = -1 } }
  try {
    $os = Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
    return @{ freeMB = [int]($os.FreeVirtualMemory / 1024); limitMB = [int]($os.TotalVirtualMemorySize / 1024) }
  } catch { return @{ freeMB = -1; limitMB = -1 } }
}

function Get-ExhaustionEvents([DateTime]$From, [DateTime]$To) {
  # 窗口(前后各放 30 秒)里系统自己记下的内存耗尽,回说明串数组,没有回空数组。两个来源:
  # 系统日志 Resource-Exhaustion-Detector 2004(「Windows 成功诊断出虚拟内存不足」),与应用日志
  # .NET Runtime 1025/1026 里的 OutOfMemoryException——后者不限进程:别的会话的进程因内存死掉,
  # 同样说明那一刻整机见底。日志读不到按「没有」处理(取证是旁证,不能反过来拦住测试)。
  # 测试注入:FLOW_TEST_EXHAUSTION = 说明串(分号分隔),"none" = 明确没有;设了就不读本机日志。
  if ($env:FLOW_TEST_EXHAUSTION) {
    if ($env:FLOW_TEST_EXHAUSTION -eq "none") { return @() }
    return @($env:FLOW_TEST_EXHAUSTION -split ';')
  }
  $found = @()
  $s = $From.AddSeconds(-30)
  $e = $To.AddSeconds(30)
  try {
    $n = @(Get-WinEvent -FilterHashtable @{ LogName = "System"; ProviderName = "Microsoft-Windows-Resource-Exhaustion-Detector"; Id = 2004; StartTime = $s; EndTime = $e } -ErrorAction SilentlyContinue).Count
    if ($n -gt 0) { $found += "系统日志记了 $n 条虚拟内存不足(Resource-Exhaustion-Detector 2004)" }
  } catch {}
  try {
    $n = @(Get-WinEvent -FilterHashtable @{ LogName = "Application"; ProviderName = ".NET Runtime"; Id = 1025, 1026; StartTime = $s; EndTime = $e } -ErrorAction SilentlyContinue |
      Where-Object { $_.Message -match "OutOfMemoryException" }).Count
    if ($n -gt 0) { $found += "$n 个进程以 OutOfMemoryException 终止(应用日志 .NET Runtime)" }
  } catch {}
  return $found
}

function Write-MemPreflight {
  $m = Get-MemProbe
  if ($m.freeMB -lt 0) { Write-Host "MEM: 可用提交内存读不到(不影响运行)"; return }
  $lim = if ($m.limitMB -gt 0) { "(上限 {0:N1} GB)" -f ($m.limitMB / 1024) } else { "" }
  Write-Host ("MEM: 可用提交内存 {0:N1} GB{1}" -f ($m.freeMB / 1024), $lim)
  if ($m.freeMB -lt $LowCommitWarnMB) {
    Write-Host (("WARN low-commit: 可用提交内存低于 {0:N0} GB。" -f ($LowCommitWarnMB / 1024)) +
                "套件靠成批起子进程干活,整机提交内存瞬时见底时子进程起不来或进程崩溃,未通过的结果不可信;" +
                "能等就先腾内存再跑(只是提示,不拦)")
  }
}

function Write-SuiteOutcome([string]$Label, [int]$Code, [DateTime]$From) {
  # 套件跑完后调。未通过时点名两样:套件进程是不是崩溃退出(CRASH),运行期间有没有内存耗尽旁证
  # (ENV-SUSPECT)。回 $true = 有旁证(矩阵据此计 ENV-SUMMARY)。通过的套件不查、不点名。
  if ($Code -eq 0) { return $false }
  if ($Code -ne 1 -and $Code -ne 2) {
    $why = if ($CrashExitNotes.ContainsKey($Code)) { $CrashExitNotes[$Code] } else { "0x{0:X8}" -f $Code }
    Write-Host ("CRASH: $Label 的套件进程不是自己退出的:" + $why + " —— 套件没跑完,这不是断言结论")
  }
  $ev = @(Get-ExhaustionEvents $From (Get-Date))
  if ($ev.Count -eq 0) { return $false }
  $m = Get-MemProbe
  $now = if ($m.freeMB -ge 0) { ";此刻可用提交内存 {0:N1} GB" -f ($m.freeMB / 1024) } else { "" }
  Write-Host ("ENV-SUSPECT: $Label 运行期间整机提交内存见底(" + ($ev -join ";") + $now +
              ")—— 本次未通过不能当回归结论,内存宽裕后用 -Suite 单独重跑")
  return $true
}

if ($Canary) {
  & $engine -NoProfile -File (Join-Path $here "工作流通路检查.ps1") @Rest
  exit $LASTEXITCODE
}

if ($Suite) {
  $path = Join-Path $testsDir ($Suite + "测试.ps1")
  if (-not (Test-Path $path)) {
    Write-Host "ABORT: 找不到套件 $path(单套件传中文短名,如 -Suite 看板CLI)"
    exit 2
  }
  Write-MemPreflight
  # 单套件模式同样守:漏隔离要在单独跑该套件时就能被抓到,不能只在全量矩阵下暴露。
  # 子进程继承本进程环境,故只在它运行期间把 LOCALAPPDATA 换成哨兵,跑完即还原。
  $sentinel = New-SentinelLad
  $env:LOCALAPPDATA = $sentinel
  $t0 = Get-Date
  & $engine -NoProfile -File $path
  $code = $LASTEXITCODE
  $env:LOCALAPPDATA = $realLad
  [void](Write-SuiteOutcome $Suite $code $t0)
  if (Test-SentinelClean $sentinel $Suite) { Remove-Sentinel $sentinel } else { $code = 1 }
  exit $code
}

$fails = 0
$leaks = 0
$envSuspects = 0        # 未通过且运行期间有内存耗尽旁证的套件数(已含在 $fails 里,不另减)
$cleanSentinels = @()   # 当场干净的哨兵,矩阵末尾复查一次:抓套件退出后才落盘的写入
Write-MemPreflight

# 静态前置:共享层单源与区域敏感比较。放在假仓套件之前——都是纯解析就能判的结构问题,
# 秒级出结果,不必等跑完矩阵。
Write-Host ""
Write-Host "=== 静态扫描 ==="
$sentinel = New-SentinelLad
$env:LOCALAPPDATA = $sentinel
& $engine -NoProfile -File (Join-Path $here "静态扫描.ps1")
if ($LASTEXITCODE -ne 0) { $fails++ }
$env:LOCALAPPDATA = $realLad
if (Test-SentinelClean $sentinel "静态扫描") { $cleanSentinels += , @("静态扫描", $sentinel) } else { $leaks++ }

foreach ($t in $Suites) {
  $path = Join-Path $testsDir ($t + ".ps1")
  Write-Host ""
  Write-Host "=== $t.ps1 ==="
  if (-not (Test-Path $path)) { Write-Host "MISSING: $path"; $fails++; continue }
  $sentinel = New-SentinelLad
  $env:LOCALAPPDATA = $sentinel
  $t0 = Get-Date
  & $engine -NoProfile -File $path
  $code = $LASTEXITCODE
  if ($code -ne 0) { $fails++ }
  $env:LOCALAPPDATA = $realLad
  if (Write-SuiteOutcome $t $code $t0) { $envSuspects++ }
  # 泄漏与断言失败分开计:混进 $fails 会让下方 MATRIX 的 passed 数算成负值。
  if (Test-SentinelClean $sentinel $t) { $cleanSentinels += , @($t, $sentinel) } else { $leaks++ }
}
foreach ($c in $cleanSentinels) {
  if (Test-SentinelClean $c[1] $c[0] -Late) { Remove-Sentinel $c[1] } else { $leaks++ }
}
Write-Host ""
Write-Host ("MATRIX: {0}/{1} passed(含静态前置)" -f (($Suites.Count + 1) - $fails), ($Suites.Count + 1))
if ($leaks -gt 0) {
  Write-Host ("LEAK-SUMMARY: {0} 个套件写进了未隔离的 LOCALAPPDATA(逐个见上方 LEAK 行;真 claude-wf-3b 已由哨兵挡住)" -f $leaks)
}
if ($envSuspects -gt 0) {
  Write-Host (("ENV-SUMMARY: 未通过的套件里有 {0} 个在运行期间撞上整机提交内存见底(逐个见上方 ENV-SUSPECT 行);" -f $envSuspects) +
              "这几个不能当回归结论,内存宽裕后逐个 -Suite 重跑")
}
if ($fails -gt 0 -or $leaks -gt 0) { exit 1 }
exit 0
