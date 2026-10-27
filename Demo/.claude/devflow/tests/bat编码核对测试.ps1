# bat编码核对测试.ps1 — bat编码核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,真 git 仓)。
# 覆盖:基线纯 ASCII / 已跟踪 .bat 含中文 -> 点名行号 / 已忽略 .bat 在面外 / 未跟踪未忽略的新 .bat
#   (含中文名)在面内 / 已删未提交跳过 / 仓根下 Demo/ 之外的 .bat 在面外 / 非 git 检出、git 报错两类 INFRA。
# 真 git 仓是必要的:扫描面 = 入仓候选(已跟踪 + 未跟踪未忽略),忽略规则与索引都要真 git 才成立。
# T4 与 T7 是回归位:主工程/人工入库通道先自检、再 add,旧实现只扫已跟踪,新建的中文 .bat 自检照过后入仓;
#   git 报错时旧实现的 `>` 重定向先建出空清单文件,读到空清单直接 PASS,头注的 INFRA 分支走不到。
# 跑法:bat编码核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 bat编码核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "bat编码核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-batenc-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

# 客户端仓夹具:$Ignore 非空时写成仓根 .gitignore,$Tracked 写入并提交,$Untracked 只落盘。
# 返回 Demo 路径(扫描入参)。
function New-Repo([hashtable]$Tracked = @{}, [hashtable]$Untracked = @{}, [string]$Ignore = "") {
  $root = Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))
  New-GitRepo $root "Demo/Assets/seed.txt"
  if ($Ignore) { Write-F $root ".gitignore" $Ignore }
  foreach ($rel in $Tracked.Keys) { Write-F $root $rel $Tracked[$rel] }
  G $root "add -A" | Out-Null
  G $root "commit -q -m fixture" | Out-Null
  foreach ($rel in $Untracked.Keys) { Write-F $root $rel $Untracked[$rel] }
  return (Join-Path $root "Demo")
}

try {
  # T1 基线:已跟踪 .bat 纯 ASCII
  $pd = New-Repo @{ "Demo/Tools/gen.bat" = "@echo off`r`nrem see gen.md`r`necho hi`r`n" }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0 -and $r.out -match 'OK\s+bat编码核对: 1 ') "T1 纯 ASCII -> PASS"

  # T2 已跟踪 .bat 第 2 行含中文
  $pd = New-Repo @{ "Demo/Configs/GameConfig/gen.bat" = "@echo off`r`nrem 导表`r`necho hi`r`n" }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 1 -and $r.out -match 'gen\.bat\s+non-ASCII at line: 2') "T2 已跟踪 .bat 含中文 -> FAIL 并点名行号"

  # T3 面外:已忽略的 .bat(本地私有,不会入仓)
  $pd = New-Repo @{} @{ "Demo/Tools/run.local.bat" = "rem 本地`r`n" } "*.local.bat`n"
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0) "T3 已忽略的 .bat -> PASS"

  # T4 回归位:未跟踪未忽略、中文文件名的新 .bat(清单须按 UTF-8 解,-z 不转义)
  $pd = New-Repo @{} @{ "Demo/Tools/导表.bat" = "@echo off`r`nrem 中文注释`r`n" }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 1 -and $r.out -match 'Demo/Tools/导表\.bat\s+non-ASCII at line: 2') "T4 未跟踪未忽略的中文 .bat -> FAIL 并点名"

  # T5 已删除但仍在索引的 .bat 跳过(工作区没有它,不是本道的事)
  $pd = New-Repo @{ "Demo/Tools/gone.bat" = "rem 已删`r`n" }
  [System.IO.File]::Delete((Join-Path (Split-Path $pd -Parent) "Demo\Tools\gone.bat"))
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0) "T5 已删未提交的 .bat -> PASS"

  # T5b 面外:仓根下 Demo/ 之外的 .bat(本仓另有 参考/、复刻/ 等非工程目录,含中文的 bat 不归本道)
  $pd = New-Repo @{ "参考/tools/导出.bat" = "rem 参考工具`r`n" } @{ "复刻/run.bat" = "rem 复刻`r`n" }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0) "T5b Demo/ 之外的 .bat(已跟踪与未跟踪)不在面内 -> PASS"

  # T6 INFRA:目标不是 git 检出
  $bare = Join-Path $script:fx "notgit"
  New-Item -ItemType Directory -Force -Path (Join-Path $bare "Demo") | Out-Null
  $r = Invoke-ScanCheck $Target (Join-Path $bare "Demo")
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA.*not a git checkout') "T6 非 git 检出 -> INFRA"

  # T7 回归位:git 本身报错(.git 指向不存在的 gitdir)须 INFRA,不得当空清单放行
  $broken = Join-Path $script:fx "brokengit"
  New-Item -ItemType Directory -Force -Path (Join-Path $broken "Demo") | Out-Null
  Write-F $broken ".git" "gitdir: ./nowhere`n"
  Write-F $broken "Demo/Tools/x.bat" "rem 中文`r`n"
  # 被测脚本若把 git 的 stderr 漏到自己的 stderr,本进程 EAP=Stop 下会抛出——同样记为本条 FAIL,不让套件中断
  try { $r = Invoke-ScanCheck $Target (Join-Path $broken "Demo") } catch { $r = @{ code = -1; out = [string]$_ } }
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T7 git 报错 -> INFRA"
}
finally {
  Remove-FixtureTree $script:fx
}
Exit-TestSuite
