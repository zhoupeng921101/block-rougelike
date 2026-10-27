# 交付历史CLI测试.ps1 — 只读交付历史视图的 CLI 层测试(黑盒断言,不依赖内部实现)。
# 覆盖:空历史优雅退出;ff 交付归属(含自有文件);合并交付归属(净引入排除前序任务);
#   服务端 topic best-effort 匹配 / 短 topic 跳过;numstat 聚合的二进制与求和呈现;limit 截断;
#   主题中段或正文行首含 claim: 的非锚提交不占 limit 名额。
# 假仓落 %TEMP%,不触真仓。经显式 -RepoRoot/-FantasyRoot 注入,不改配置。
# 跑法:交付历史CLI测试.ps1 [-Target <实现路径>]   缺省 = 上级目录的 交付历史.ps1
[CmdletBinding(PositionalBinding=$false)]
param([string]$Target = "")
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "交付历史.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

function Invoke-History([hashtable]$Opt) {
  $argv = @()
  if ($Opt.ContainsKey('Limit'))    { $argv += @('-Limit', [string]$Opt.Limit) }
  if ($Opt.ContainsKey('RepoRoot')) { $argv += @('-RepoRoot', [string]$Opt.RepoRoot) }
  if ($Opt.ContainsKey('FxRoot'))   { $argv += @('-FantasyRoot', [string]$Opt.FxRoot) }
  if ($Opt.NoFantasy)               { $argv += '-NoFantasy' }
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target @argv 2>&1 | ForEach-Object { [string]$_ })
  $code = $LASTEXITCODE
  return @{ code = $code; out = ($lines -join "`n") }
}

$script:fx = $null
function New-Fixture {
  $tmp = Join-Path $env:TEMP ("flowtest-history-" + [Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $tmp | Out-Null
  $script:fx = $tmp
  $mainC = Join-Path $tmp "main-client"; New-GitRepo $mainC
  $mainF = Join-Path $tmp "main-fantasy"; New-GitRepo $mainF
  return @{ tmp = $tmp; mainC = $mainC; mainF = $mainF }
}
function Add-FfTask([string]$Repo, [string]$Topic, [hashtable]$Files) {
  G $Repo "commit -q --allow-empty -m ""claim: $Topic""" | Out-Null
  foreach ($k in $Files.Keys) { Write-F $Repo $k $Files[$k] }
  G $Repo "add -A" | Out-Null
  G $Repo "commit -q -m ""feat: $Topic""" | Out-Null
}
function Add-MergeTask([string]$Repo, [string]$Topic, [hashtable]$Files, [string]$Dev) {
  G $Repo "checkout -q -b $Dev" | Out-Null
  G $Repo "commit -q --allow-empty -m ""claim: $Topic""" | Out-Null
  foreach ($k in $Files.Keys) { Write-F $Repo $k $Files[$k] }
  G $Repo "add -A" | Out-Null
  G $Repo "commit -q -m ""feat: $Topic""" | Out-Null
  G $Repo "checkout -q main" | Out-Null
  G $Repo "merge --no-ff --no-edit -q $Dev" | Out-Null
}

Write-Host "== 交付历史 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # 1. 空历史
  $F = New-Fixture
  $r = Invoke-History @{ RepoRoot = $F.mainC; FxRoot = $F.mainF; NoFantasy = $true }
  Assert-True ($r.code -eq 0 -and $r.out -match "没有 claim 提交") "1 空历史 -> exit 0 优雅退出"
  Remove-Fixture

  # 2. ff 交付归属
  $F = New-Fixture
  Add-FfTask $F.mainC "alpha" @{ "Demo/Assets/GameLogic/a.cs" = "a1`na2`n" }
  $r = Invoke-History @{ RepoRoot = $F.mainC; FxRoot = $F.mainF; NoFantasy = $true }
  Assert-True ($r.code -eq 0 -and $r.out -match "alpha" -and $r.out -match "a\.cs") "2 ff 交付 -> 含自有文件"
  Remove-Fixture

  # 3. 合并交付净引入排除前序任务
  $F = New-Fixture
  Add-FfTask $F.mainC "alpha" @{ "Demo/Assets/GameLogic/a.cs" = "a1`n" }
  Add-MergeTask $F.mainC "beta" @{ "Demo/Assets/GameLogic/b.cs" = "b1`nb2`n" } "agent/dev2"
  $r = Invoke-History @{ RepoRoot = $F.mainC; FxRoot = $F.mainF; NoFantasy = $true }
  # 按内容定位 beta 段落,不假设它排在首位:alpha/beta 提交落在同一秒时 git log 顺序会翻转
  $betaBlock = @($r.out -split "(?m)^\[" | Where-Object { $_ -match "beta" })[0]
  Assert-True ($null -ne $betaBlock -and $betaBlock -match "b\.cs" -and $betaBlock -notmatch "a\.cs") "3 合并交付 -> 净引入排除前序任务文件"
  Remove-Fixture

  # 4. 二进制文件呈现 Bin
  $F = New-Fixture
  G $F.mainC "commit -q --allow-empty -m ""claim: 二进制任务""" | Out-Null
  $binPath = Join-Path $F.mainC "Demo/Assets/img.png"
  New-Item -ItemType Directory -Force -Path (Split-Path $binPath -Parent) | Out-Null
  [System.IO.File]::WriteAllBytes($binPath, [byte[]](0x89,0x50,0x4E,0x47,0x00,0x01,0x02,0x03))
  G $F.mainC "add -A" | Out-Null
  G $F.mainC "commit -q -m ""feat: 二进制""" | Out-Null
  $r = Invoke-History @{ RepoRoot = $F.mainC; FxRoot = $F.mainF; NoFantasy = $true }
  Assert-True ($r.out -match "img\.png \| Bin") "4 二进制文件 -> 呈现 Bin"
  Remove-Fixture

  # 5. 服务端 topic best-effort 匹配
  $F = New-Fixture
  Add-FfTask $F.mainC "服务端活儿A" @{ "Demo/Assets/GameLogic/c.cs" = "c`n" }
  Write-F $F.mainF "svc.cs" "x`n"
  G $F.mainF "add -A" | Out-Null
  G $F.mainF "commit -q -m ""chore(task): 服务端活儿A""" | Out-Null
  $r = Invoke-History @{ RepoRoot = $F.mainC; FxRoot = $F.mainF }
  Assert-True ($r.out -match "服务端改动" -and $r.out -match "chore\(task\)") "5 服务端 topic 匹配命中"
  Remove-Fixture

  # 6. 短 topic(<3 字符)不做服务端匹配
  $F = New-Fixture
  Add-FfTask $F.mainC "ab" @{ "Demo/Assets/GameLogic/d.cs" = "d`n" }
  Write-F $F.mainF "svc2.cs" "y`n"
  G $F.mainF "add -A" | Out-Null
  G $F.mainF "commit -q -m ""chore: ab 相关""" | Out-Null
  $r = Invoke-History @{ RepoRoot = $F.mainC; FxRoot = $F.mainF }
  Assert-True ($r.out -notmatch "服务端改动") "6 短 topic -> 跳过服务端匹配"
  Remove-Fixture

  # 7. limit 截断
  $F = New-Fixture
  Add-FfTask $F.mainC "t1" @{ "Demo/Assets/GameLogic/t1.cs" = "1`n" }
  Add-FfTask $F.mainC "t2" @{ "Demo/Assets/GameLogic/t2.cs" = "2`n" }
  Add-FfTask $F.mainC "t3" @{ "Demo/Assets/GameLogic/t3.cs" = "3`n" }
  $r = Invoke-History @{ RepoRoot = $F.mainC; FxRoot = $F.mainF; NoFantasy = $true; Limit = 2 }
  Assert-True ($r.out -match "最近 2 条" -and $r.out -match "t3" -and $r.out -notmatch "\bt1\b") "7 limit 截断取最近 N 条"
  Remove-Fixture

  # 8. 主题/正文里含 claim: 的非锚提交不占 limit 名额(^ 锚点须真到 git 手上,且正文行首的 claim: 也不算)
  $F = New-Fixture
  Add-FfTask $F.mainC "真任务" @{ "Demo/Assets/GameLogic/r.cs" = "r`n" }
  Write-F $F.mainC "Demo/Assets/GameLogic/n1.cs" "n1`n"
  G $F.mainC "add -A" | Out-Null
  G $F.mainC "commit -q -m ""fix: 主题中段提到 claim: 格式""" | Out-Null
  Write-F $F.mainC "Demo/Assets/GameLogic/n2.cs" "n2`n"
  G $F.mainC "add -A" | Out-Null
  G $F.mainC "commit -q -m ""docs: 正文提到锚"" -m ""claim: 只是正文""" | Out-Null
  $r = Invoke-History @{ RepoRoot = $F.mainC; FxRoot = $F.mainF; NoFantasy = $true; Limit = 1 }
  Assert-True ($r.code -eq 0 -and $r.out -match "最近 1 条" -and $r.out -match "真任务") "8 含 claim: 的非锚提交不占 limit 名额"
  Remove-Fixture
}
finally { Remove-Fixture }

Write-Host ""
Exit-TestSuite
