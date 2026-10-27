# 语法自检测试.ps1 — 语法自检.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 覆盖:合规 ps1 + psd1 PASS;ps1 语法错 FAIL;psd1 能过 Parser 但 Import-PowerShellDataFile 拒收
#   (非常量表达式)FAIL;含非 ASCII 无 BOM FAIL;路径不存在 / 目录下无脚本 INFRA;
#   无参全量不含扫描域直属的 worktrees\(显式 -Path 不受限)。
# 跑法:语法自检测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 语法自检.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
# PS 5.1 捕获被测子 powershell 输出按 [Console]::OutputEncoding 解码,不置 UTF-8 中文断言假失败。
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "语法自检.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-syntax-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

function New-Case([string]$Name, [string]$Text, [switch]$Bom) {
  $d = Join-Path $script:fx ([Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $d | Out-Null
  $p = Join-Path $d $Name
  [System.IO.File]::WriteAllText($p, $Text, (New-Object System.Text.UTF8Encoding([bool]$Bom)))
  return $p
}
function Invoke-Syntax([string[]]$Paths) {
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target -Path $Paths 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}

Write-Host "== 语法自检 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 合规 ps1 + psd1(含嵌套哈希、数组、布尔、负数 —— Import-PowerShellDataFile 允许的常量形态)
  $ps1 = New-Case "good.ps1" "param([string]`$A)`nWrite-Host `$A`n"
  $r = Invoke-Syntax @($ps1)
  Assert-True ($r.code -eq 0 -and $r.out -match 'OK ') "T1a 合规 ps1 -> exit 0"
  $psd = New-Case "good.psd1" "@{`n  A = 'x'`n  B = @(1, -2)`n  C = @{ D = `$true }`n}`n"
  $r = Invoke-Syntax @($psd)
  Assert-True ($r.code -eq 0 -and $r.out -match 'OK ') "T1b 合规 psd1 -> exit 0"

  # T2 ps1 语法错
  $r = Invoke-Syntax @((New-Case "bad.ps1" "function {`n"))
  Assert-True ($r.code -eq 1 -and $r.out -match 'FAIL .*bad\.ps1') "T2 ps1 语法错 -> FAIL exit 1"

  # T3 psd1 能 parse、但含非常量表达式(Import-PowerShellDataFile 拒收)
  $r = Invoke-Syntax @((New-Case "dyn.psd1" "@{`n  A = (Get-Date)`n}`n"))
  Assert-True ($r.code -eq 1 -and $r.out -match 'FAIL .*dyn\.psd1') "T3 psd1 非常量表达式 -> FAIL exit 1"

  # T4 psd1 顶层不是哈希表
  $r = Invoke-Syntax @((New-Case "arr.psd1" "@(1, 2)`n"))
  Assert-True ($r.code -eq 1 -and $r.out -match 'FAIL .*arr\.psd1') "T4 psd1 顶层非哈希表 -> FAIL exit 1"

  # T5 含非 ASCII 无 BOM
  $r = Invoke-Syntax @((New-Case "nobom.ps1" "Write-Host '中文'`n"))
  Assert-True ($r.code -eq 1 -and $r.out -match 'non-ASCII without UTF-8 BOM') "T5 非 ASCII 无 BOM -> FAIL"

  # T6 含非 ASCII 有 BOM 的 psd1 照常 PASS(Import 不因中文值误拒)
  $r = Invoke-Syntax @((New-Case "cn.psd1" "@{ Name = '中文' }`n" -Bom))
  Assert-True ($r.code -eq 0) "T6 BOM psd1 含中文值 -> exit 0"

  # T7 INFRA:路径不存在
  $r = Invoke-Syntax @((Join-Path $script:fx "no-such.ps1"))
  Assert-True ($r.code -eq 2 -and $r.out -match 'path not found') "T7 路径不存在 -> INFRA exit 2"

  # T8 INFRA:目录下无脚本
  $empty = Join-Path $script:fx "empty"
  New-Item -ItemType Directory -Force -Path $empty | Out-Null
  $r = Invoke-Syntax @($empty)
  Assert-True ($r.code -eq 2 -and $r.out -match 'no .ps1') "T8 目录无脚本 -> INFRA exit 2"

  # T9 无参全量:扫描域 = 被测脚本所在的 <根>\devflow 的上级,其直属 worktrees\ 不进域;显式 -Path 指过去照查
  $root = Join-Path $script:fx "claude-root"
  $wt = Join-Path $root "worktrees\x"
  New-Item -ItemType Directory -Force -Path (Join-Path $root "devflow"), $wt | Out-Null
  $copied = Join-Path $root "devflow\语法自检.ps1"
  [System.IO.File]::Copy($Target, $copied)
  [System.IO.File]::WriteAllText((Join-Path $root "top.psd1"), "@{ A = 1 }`n")
  [System.IO.File]::WriteAllText((Join-Path $root "settings.json"), "{ not powershell }`n")
  [System.IO.File]::WriteAllText((Join-Path $wt "bad.ps1"), "function {`n")
  $lines = @(& (Get-FlowEngine) -NoProfile -File $copied 2>&1 | ForEach-Object { [string]$_ })
  $out = $lines -join "`n"
  Assert-True ($LASTEXITCODE -eq 0 -and $out -match 'OK .*top\.psd1' -and $out -match 'OK .*语法自检\.ps1' -and $out -notmatch 'worktrees|settings\.json') ("T9a 无参 -> 根直属脚本与子目录照查,worktrees\ 不进域:" + $out)
  $r = Invoke-Syntax @($wt)
  Assert-True ($r.code -eq 1 -and $r.out -match 'FAIL .*bad\.ps1') "T9b 显式 -Path 指向 worktrees 下目录 -> 照查 FAIL"
}
finally {
  Remove-Fixture
}
Exit-TestSuite
