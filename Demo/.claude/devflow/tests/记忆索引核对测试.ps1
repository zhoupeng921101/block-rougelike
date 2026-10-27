# 记忆索引核对测试.ps1 — 记忆索引核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 一律显式传 -MemDir 指向假目录:不读、不写真记忆目录(缺省推导出的 user 级目录)。
# 覆盖:索引与文件一致 PASS;无主文件 FAIL;悬空索引行 FAIL;索引缺失 FAIL;目录不存在 INFRA。
# 跑法:记忆索引核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 记忆索引核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
# PS 5.1 捕获被测子 powershell 输出按 [Console]::OutputEncoding 解码,不置 UTF-8 中文断言假失败。
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "记忆索引核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-memidx-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

# 建一个假记忆目录:$Index = MEMORY.md 正文($null = 不建索引),$Files = 记忆文件名。
function New-MemDir([string]$Index, [string[]]$Files) {
  $d = Join-Path $script:fx ([Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $d | Out-Null
  if ($null -ne $Index) { Write-F $d "MEMORY.md" $Index }
  foreach ($f in $Files) { Write-F $d $f "---`nname: x`n---`n" }
  return $d
}
function Invoke-MemCheck([string]$Dir) {
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target -MemDir $Dir 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}

Write-Host "== 记忆索引核对 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 一致
  $d = New-MemDir "- [甲](a.md) — x`n- [乙](b.md) — y`n" @("a.md", "b.md")
  $r = Invoke-MemCheck $d
  Assert-True ($r.code -eq 0 -and $r.out -match '\[OK\].*2 文件 = 2 索引行') "T1 一致 -> OK exit 0"

  # T2 无主文件
  $d = New-MemDir "- [甲](a.md) — x`n" @("a.md", "orphan.md")
  $r = Invoke-MemCheck $d
  Assert-True ($r.code -eq 1 -and $r.out -match '\[无主\]' -and $r.out -match 'orphan\.md') "T2 无主文件 -> FAIL exit 1"

  # T3 悬空索引行
  $d = New-MemDir "- [甲](a.md) — x`n- [丙](gone.md) — z`n" @("a.md")
  $r = Invoke-MemCheck $d
  Assert-True ($r.code -eq 1 -and $r.out -match '\[悬空\]' -and $r.out -match 'gone\.md') "T3 悬空索引 -> FAIL exit 1"

  # T4 目录在、索引缺失(有记忆文件却无索引 = 失配)
  $d = New-MemDir $null @("a.md")
  $r = Invoke-MemCheck $d
  Assert-True ($r.code -eq 1 -and $r.out -match '\[FAIL\]') "T4 索引缺失 -> FAIL exit 1"

  # T5 目录不存在 -> INFRA(错目录上的核对无意义,不给假结论)
  $r = Invoke-MemCheck (Join-Path $script:fx "no-such-dir")
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T5 目录不存在 -> INFRA exit 2"
}
finally {
  Remove-Fixture
}
Exit-TestSuite
