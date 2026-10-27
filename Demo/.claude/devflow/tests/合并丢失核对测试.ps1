# 合并丢失核对测试.ps1 — 合并丢失核对.ps1 的 CLI 层契约测试(黑盒断言,假仓落 %TEMP%,不触真仓)。
# 覆盖:干净合并 PASS / 一侧独有行被合并吃掉 FAIL 并点名 / 非合并提交 INFRA /
#   git 查询失败(对象库缺树对象,diff 读不出)判 INFRA 而非空结果 PASS。
# 跑法:合并丢失核对测试.ps1 [-Target <实现路径>]   缺省 = 上级目录的 合并丢失核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param([string]$Target = "")
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "合并丢失核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = $null

function Invoke-Check([string]$Repo, [string]$Merge = "HEAD") {
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target -RepoDir $Repo -Merge $Merge 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}

# 基线 a.cs 三行 -> side 分支加一行、main 加另一行 -> 合并。$Drop 时合并结果丢掉 side 独有行。
function New-MergeFixture([bool]$Drop) {
  $script:fx = Join-Path $env:TEMP ("flowtest-mergeloss-" + [Guid]::NewGuid().ToString("N"))
  $repo = Join-Path $script:fx "repo"
  New-GitRepo $repo
  Write-F $repo "src/a.cs" "line1`nline2`nline3`n"
  G $repo "add -A" | Out-Null
  G $repo "commit -q -m base" | Out-Null
  G $repo "checkout -q -b side" | Out-Null
  Write-F $repo "src/a.cs" "line1`nline2`nline3`nvar sideOnly = 1;`n"
  G $repo "commit -q -am side" | Out-Null
  G $repo "checkout -q main" | Out-Null
  Write-F $repo "src/a.cs" "line0`nline1`nline2`nline3`n"
  G $repo "commit -q -am mainside" | Out-Null
  G $repo "merge -q --no-ff --no-commit side" | Out-Null
  if ($Drop) { Write-F $repo "src/a.cs" "line0`nline1`nline2`nline3`n"; G $repo "add -A" | Out-Null }
  G $repo "commit -q -m merged" | Out-Null
  return $repo
}

Write-Host "== 合并丢失核对 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # M1 干净合并
  $repo = New-MergeFixture $false
  $r = Invoke-Check $repo
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT : PASS') "M1 两侧内容都进了合并 -> PASS"
  Remove-Fixture

  # M2 side 独有行被吃掉
  $repo = New-MergeFixture $true
  $r = Invoke-Check $repo
  Assert-True ($r.code -eq 1 -and $r.out -match 'VERDICT : FAIL' -and $r.out -match 'sideOnly') "M2 一侧独有行丢失 -> FAIL 并点名该行"
  Remove-Fixture

  # M3 非合并提交
  $repo = New-MergeFixture $false
  $r = Invoke-Check $repo "HEAD~1"
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "M3 非合并提交 -> INFRA"
  Remove-Fixture

  # M4 git 查询失败:删掉父1(main 侧)的根树对象,两侧改动清单那步 diff 读不出树。
  # 修前 Get-GitLines 吞掉退出码得空清单,两侧交集为空,判 PASS。
  $repo = New-MergeFixture $true
  $tree = ([string](G $repo "log -1 --format=%T HEAD~1")[0]).Trim()
  $obj = Join-Path $repo (".git\objects\" + $tree.Substring(0, 2) + "\" + $tree.Substring(2))
  if (-not (Test-Path $obj)) { throw "fixture: loose tree object not found: $obj" }
  [System.IO.File]::SetAttributes($obj, [System.IO.FileAttributes]::Normal)
  [System.IO.File]::Delete($obj)
  $r = Invoke-Check $repo
  Assert-True ($r.code -eq 2 -and $r.out -match 'VERDICT : INFRA' -and $r.out -notmatch 'VERDICT : PASS') "M4 git 查询失败 -> INFRA(不静默判 PASS)"
  Remove-Fixture
}
finally { Remove-Fixture }

Write-Host ""
Exit-TestSuite
