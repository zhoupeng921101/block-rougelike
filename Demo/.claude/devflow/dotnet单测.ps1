# dotnet单测.ps1 - 规则核心(纯 C# 程序集 GameRules)的 dotnet 单测:restore 后 dotnet test DotNet\Tests\Tests.csproj。
# 准入: Since=2026-10-27 | Basis=用户裁定 | Origin=2026-10-26 工程计划阶段 2「客户端自检加一道规则核心的 dotnet 单测」 | Retire=规则核心与文本表的校验改由别的机判承接时
#
# 拦三类:
#   ①Unity 编不过的写法(init、record、C# 10 以上语法、.NET 6 以上 API、using UnityEngine):镜像库
#     DotNet\GameRules 锁 netstandard2.1 + C# 9,通配链接 Assets 下的正本,编不过即 FAIL——这算代码违规;
#   ②规则核心单测失败(含随机流测试向量,常量出自另一个进程,本身即一项跨进程比对);
#   ③源码禁用清单(非确定来源、NextDouble、#if UNITY_*):清单写在测试工程的用例里,不在本脚本。
# 编译口径对齐 Unity 的依据与布局见 DotNet\GameRules\GameRules.csproj 头注;约束正本 = tengine-conventions.md「规则核心」。
#
# 包版本钉在本机 NuGet 缓存已有的版本上,首次 restore 不联网;换机器首跑要联网,离线即 INFRA。
# 产物落 DotNet\**\bin|obj(已在 .gitignore),不改工作树哈希。关 MSBuild 常驻节点,免得常驻进程锁住 obj\ 里的文件。
# 内置于 客户端自检.ps1(并行道),一般不单独调用。
#
# 出口码: 0 PASS(镜像库编过,用例全过且至少跑了一个)
#         1 FAIL(编译失败 / 任一用例失败 / 一个用例都没跑)
#         2 INFRA(找不到 dotnet / 找不到测试工程 / restore 失败 / 只有文件锁类错误)
[CmdletBinding(PositionalBinding=$false)]
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # 槽位的 Demo
)
$ErrorActionPreference = "Stop"

$testProj = Join-Path $ProjectDir "DotNet\Tests\Tests.csproj"
if (-not (Test-Path -LiteralPath $testProj)) {
  Write-Host "DOTNET TEST : INFRA - test project missing: '$testProj'"; exit 2
}
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
  Write-Host "DOTNET TEST : INFRA - dotnet SDK not on PATH"; exit 2
}

# 输出钉成英文,下面按 Failed / Total: 解析;只在本脚本运行期间生效。
$envKeys = @("DOTNET_CLI_UI_LANGUAGE", "DOTNET_NOLOGO", "DOTNET_CLI_TELEMETRY_OPTOUT", "MSBUILDDISABLENODEREUSE")
$envSaved = @{}
foreach ($k in $envKeys) { $envSaved[$k] = [Environment]::GetEnvironmentVariable($k) }
$sw = [System.Diagnostics.Stopwatch]::StartNew()
try {
  $env:DOTNET_CLI_UI_LANGUAGE = "en"
  $env:DOTNET_NOLOGO = "1"
  $env:DOTNET_CLI_TELEMETRY_OPTOUT = "1"
  $env:MSBUILDDISABLENODEREUSE = "1"
  # cmd /c 捕获原生命令 stderr:口径同 Editor程序集编译 的真编译段。
  $restoreOut = cmd /c ("dotnet restore `"" + $testProj + "`" -nodeReuse:false -v q 2>&1")
  $restoreCode = $LASTEXITCODE
  if ($restoreCode -eq 0) {
    # -v q 也会把测试的控制台 logger 压成只剩摘要,失败用例名与断言消息要单给 logger 定 minimal。
    $testOut = cmd /c ("dotnet test `"" + $testProj + "`" --no-restore -nodeReuse:false -v q --logger `"console;verbosity=minimal`" 2>&1")
    $testCode = $LASTEXITCODE
  }
}
finally {
  foreach ($k in $envKeys) { [Environment]::SetEnvironmentVariable($k, $envSaved[$k]) }
}
$secs = [math]::Round($sw.Elapsed.TotalSeconds, 1)

if ($restoreCode -ne 0) {
  Write-Host ("DOTNET TEST : INFRA - dotnet restore exit {0} (多半是离线且本机 NuGet 缓存里没有测试工程钉的包版本);联网后重跑" -f $restoreCode)
  foreach ($line in @(@($restoreOut) | Where-Object { [string]$_ -match '\b(error|NU\d{4})\b' } | Select-Object -Unique -First 10)) { Write-Host ("    " + $line) }
  exit 2
}

$lines = @($testOut | ForEach-Object { [string]$_ })
$errLines = @($lines | Where-Object { $_ -match ':\s*error\s' } | Select-Object -Unique)
# 文件锁 / restore 类错误是环境问题,口径同 Editor程序集编译:全部错误行都属此类才判 INFRA。
$infraErr = @($errLines | Where-Object { $_ -match ':\s*error\s+(MSB3027|MSB3021|CS2012|NU\d{4})\b' })
if ($testCode -ne 0 -and $errLines.Count -gt 0 -and $infraErr.Count -eq $errLines.Count) {
  Write-Host ("DOTNET TEST : INFRA - dotnet test exit {0} with only file-lock / restore errors (not a code problem)" -f $testCode)
  foreach ($line in $infraErr) { Write-Host ("    " + $line) }
  exit 2
}
if ($errLines.Count -gt 0) {
  Write-Host ("DOTNET TEST : compile errors ({0}s) - 镜像库 netstandard2.1 + C# 9 编不过 = Unity 也编不过,或测试工程本身有错" -f $secs)
  foreach ($line in $errLines) { Write-Host ("    " + $line) }
  exit 1
}

# 失败用例:打出用例名与断言消息的前几行(到堆栈为止)。
$failed = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -notmatch '^\s*Failed\s+(\S+)') { continue }
  $failed.Add("    " + $lines[$i].Trim())
  for ($j = $i + 1; $j -lt $lines.Count -and $j -le $i + 8; $j++) {
    if ($lines[$j] -match '^\s*(Stack Trace:|Failed\s|Passed\s)') { break }
    if ($lines[$j].Trim() -ne "" -and $lines[$j] -notmatch '^\s*Error Message:') { $failed.Add("      " + $lines[$j].Trim()) }
  }
}
$summary = @($lines | Where-Object { $_ -match 'Total:\s*\d+' } | Select-Object -Last 1)
$total = 0
if ($summary.Count -gt 0) { $total = [int]([regex]::Match($summary[0], 'Total:\s*(\d+)').Groups[1].Value) }

if ($testCode -ne 0 -or $failed.Count -gt 0) {
  Write-Host ("DOTNET TEST : test failures ({0}s, exit {1})" -f $secs, $testCode)
  if ($summary.Count -gt 0) { Write-Host ("    " + $summary[0].Trim()) }
  if ($failed.Count -gt 0) { foreach ($l in $failed) { Write-Host $l } }
  else { foreach ($line in ($lines | Select-Object -Last 20)) { Write-Host ("    " + $line) } }   # 认不出失败行时回显尾部,不猜
  exit 1
}
if ($total -lt 1) {
  Write-Host ("DOTNET TEST : no test ran ({0}s) - 测试工程一个用例都没发现,等于没测" -f $secs)
  foreach ($line in ($lines | Select-Object -Last 10)) { Write-Host ("    " + $line) }
  exit 1
}

Write-Host ("OK  dotnet单测: " + $summary[0].Trim() + " (" + $secs + "s)")
exit 0
