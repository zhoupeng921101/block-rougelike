# 临时测试清理测试.ps1 — 临时测试清理.ps1 的 CLI 层契约测试(黑盒断言,夹具假仓落 %TEMP%,不触真仓)。
# 覆盖:非 Unity 工程 ABORT / 无可清 / 无票 REFUSED / 票非 PASS REFUSED /
#   -CheckOnly 列文件但不删 / -CheckOnly 不绕过验票 / 不带 -CheckOnly 正常删除 /
#   旧票(签发后验证面内有改动)REFUSED 且 -CheckOnly 同拒 / 缺树哈希的 PASS 票 REFUSED /
#   验证面外漂移不作废票(与 集成交付 push 点验票同口径)。
# 被测脚本验「PASS + 票树覆盖当前树」,故夹具是真 git 仓,PASS 票经夹具库 New-Ticket 按当下树签发。
# 跑法:临时测试清理测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 临时测试清理.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
# PS 5.1 捕获被测子 powershell 输出按 [Console]::OutputEncoding 解码,不置 UTF-8 中文断言假失败。
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "临时测试清理.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-tmptests-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

# 造一个仓样夹具:<root> 是 git 仓根,<root>\Demo 是工程根,票落 <root>\.gate\ticket.json。
# WithTests:建 Assets\Editor\Tests\A.cs 与同级 Tests.meta(未入库)。
# Ticket:"" = 不写票;"real" = 按当下树签发真 PASS 票;其余 = 原文写入(伪造票)。
function New-Case([bool]$WithTests, [string]$Ticket) {
  $root = Join-Path $script:fx ("case-" + [Guid]::NewGuid().ToString("N"))
  New-GitRepo $root
  Write-F $root ".gitignore" ".gate/`n"
  Write-F $root "Demo/ProjectSettings/ProjectVersion.txt" "m_EditorVersion: 2022.3.0f1`n"
  Write-F $root "Demo/Assets/GameScripts/Logic.cs" "class Logic {}`n"
  G $root "add -A" | Out-Null
  G $root "commit -q -m project" | Out-Null
  $proj = Join-Path $root "Demo"
  if ($WithTests) {
    Write-F $proj "Assets/Editor/Tests/A.cs" "// temp test`n"
    Write-F $proj "Assets/Editor/Tests.meta" "fileFormatVersion: 2`n"
  }
  if ($Ticket -eq "real") { New-Ticket $root | Out-Null }
  elseif ($Ticket) { Write-F $root ".gate/ticket.json" $Ticket }
  return $proj
}

function Invoke-Clean([string]$ProjectDir, [bool]$CheckOnly) {
  $argv = @('-ProjectDir', $ProjectDir)
  if ($CheckOnly) { $argv += '-CheckOnly' }
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target @argv 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}

function Test-TestsPresent([string]$ProjectDir) {
  return ((Test-Path (Join-Path $ProjectDir "Assets\Editor\Tests")) -and
          (Test-Path (Join-Path $ProjectDir "Assets\Editor\Tests.meta")))
}

Write-Host "== 临时测试清理 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 非 Unity 工程(无 ProjectVersion.txt)
  $bare = Join-Path $script:fx "not-a-project"
  New-Item -ItemType Directory -Force -Path $bare | Out-Null
  $r = Invoke-Clean $bare $false
  Assert-True ($r.code -eq 2 -and $r.out -match 'ABORT') "T1 非 Unity 工程 -> ABORT exit 2"

  # T2 无临时测试目录:早于验票返回,无票也算通过
  $proj = New-Case $false ""
  $r = Invoke-Clean $proj $false
  Assert-True ($r.code -eq 0 -and $r.out -match 'NOTHING TO CLEAN') "T2 无可清 -> exit 0"

  # T3 有测试但无票
  $proj = New-Case $true ""
  $r = Invoke-Clean $proj $false
  Assert-True ($r.code -eq 1 -and $r.out -match 'REFUSED') "T3 无票 -> REFUSED exit 1"
  Assert-True (Test-TestsPresent $proj) "T3 拒绝时测试目录原样保留"

  # T4 票存在但非 PASS
  $proj = New-Case $true '{"result":"FAIL"}'
  $r = Invoke-Clean $proj $false
  Assert-True ($r.code -eq 1 -and $r.out -match "not PASS") "T4 票非 PASS -> REFUSED exit 1"
  Assert-True (Test-TestsPresent $proj) "T4 非 PASS 时测试目录原样保留"

  # T5 -CheckOnly + PASS 票:列出将删文件,零删除
  $proj = New-Case $true "real"
  $r = Invoke-Clean $proj $true
  Assert-True ($r.code -eq 0 -and $r.out -match 'CHECK-ONLY would delete 1 file') "T5 CheckOnly 报将删数量"
  Assert-True ($r.out -match 'A\.cs') "T5 CheckOnly 点名文件"
  Assert-True ($r.out -notmatch '(?m)^DELETING ') "T5 CheckOnly 不打印删除动作行"
  Assert-True (Test-TestsPresent $proj) "T5 CheckOnly 后目录与 .meta 均在"

  # T6 -CheckOnly 不绕过验票(分流点在验票之后)
  $proj = New-Case $true ""
  $r = Invoke-Clean $proj $true
  Assert-True ($r.code -eq 1 -and $r.out -match 'REFUSED') "T6 CheckOnly 无票同样 REFUSED"
  Assert-True ($r.out -notmatch 'CHECK-ONLY') "T6 验票未过时不出 CheckOnly 报告"

  # T7 不带 -CheckOnly:正常删除(回归,确认探查分支未夺走真实路径)
  $proj = New-Case $true "real"
  $r = Invoke-Clean $proj $false
  Assert-True ($r.code -eq 0 -and $r.out -match 'CLEANED') "T7 正常清理 -> exit 0"
  Assert-True (-not (Test-Path (Join-Path $proj "Assets\Editor\Tests"))) "T7 测试目录已删"
  Assert-True (-not (Test-Path (Join-Path $proj "Assets\Editor\Tests.meta"))) "T7 .meta 已删"

  # T8 旧票:签发后验证面内有改动(票认证的已不是当前树)-> 拒删
  $proj = New-Case $true "real"
  Write-F $proj "Assets/GameScripts/Logic.cs" "class Logic { int x; }`n"
  $r = Invoke-Clean $proj $false
  Assert-True ($r.code -eq 1 -and $r.out -match 'REFUSED' -and $r.out -match 'tree-mismatch') "T8 旧票(面内漂移)-> REFUSED exit 1 并点明树不符"
  Assert-True (Test-TestsPresent $proj) "T8 旧票拒绝时测试目录原样保留"

  # T9 旧票 + -CheckOnly 同样拒
  $r = Invoke-Clean $proj $true
  Assert-True ($r.code -eq 1 -and $r.out -match 'REFUSED' -and $r.out -notmatch 'CHECK-ONLY') "T9 CheckOnly 不绕过票树核对"

  # T10 PASS 票缺树哈希(只有 result 字段)-> 拒删
  $proj = New-Case $true '{"result":"PASS"}'
  $r = Invoke-Clean $proj $false
  Assert-True ($r.code -eq 1 -and $r.out -match 'REFUSED') "T10 缺树哈希的 PASS 票 -> REFUSED"
  Assert-True (Test-TestsPresent $proj) "T10 拒绝时测试目录原样保留"

  # T11 验证面外漂移(文档)不作废票:与 集成交付 push 点验票同一容忍面
  $proj = New-Case $true "real"
  Write-F (Split-Path $proj -Parent) "docs/note.md" "note`n"
  $r = Invoke-Clean $proj $false
  Assert-True ($r.code -eq 0 -and $r.out -match 'CLEANED') "T11 面外漂移 -> 照常清理"
}
finally {
  Remove-Fixture
}

Write-Host ""
Exit-TestSuite
