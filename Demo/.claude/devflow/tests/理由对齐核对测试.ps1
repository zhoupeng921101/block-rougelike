# 理由对齐核对测试.ps1 — 理由对齐核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 被测脚本按自身位置($PSScriptRoot)定位 .claude 树、无路径参数,故把它与共享库复制进假 .claude 树跑。
# 覆盖:rationale / 引用文件缺失 INFRA;双向齐 PASS(含 CRLF 行尾);悬空指针 FAIL;无主理由 FAIL。
# 引用文件清单不在此复写(正本 = 被测脚本 $pairs):先在空树上跑一次,按 INFRA 明细补齐。
# 跑法:理由对齐核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 理由对齐核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
# PS 5.1 捕获被测子 powershell 输出按 [Console]::OutputEncoding 解码,不置 UTF-8 中文断言假失败。
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "理由对齐核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-rationale-" + [Guid]::NewGuid().ToString("N"))
$claude = Join-Path $script:fx ".claude"
$fxDf = Join-Path $claude "devflow"
New-Item -ItemType Directory -Force -Path (Join-Path $fxDf "hooks") | Out-Null
Copy-Item -LiteralPath $Target -Destination (Join-Path $fxDf "理由对齐核对.ps1")
Copy-Item -LiteralPath (Join-Path $dfDir "hooks\hook函数库.ps1") -Destination (Join-Path $fxDf "hooks\hook函数库.ps1")
$fxTarget = Join-Path $fxDf "理由对齐核对.ps1"

function Invoke-Align {
  $lines = @(& (Get-FlowEngine) -NoProfile -File $fxTarget 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}

Write-Host "== 理由对齐核对 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 空树:rationale 与引用文件全缺 -> INFRA(清单配置失效,不是对齐失配)
  $r = Invoke-Align
  $missing = @([regex]::Matches($r.out, '(?m)找不到(?:引用文件| rationale 文件): (.+?)\s*$') | ForEach-Object { $_.Groups[1].Value })
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA' -and $missing.Count -ge 1) "T1 文件缺失 -> INFRA exit 2(明细 $($missing.Count) 项)"

  # 按明细补齐(rationale 缺失时该对不再列引用文件,故循环到明细为空):全部建空文件,
  # 再写一对双向齐的指针 / 条目(两个 rationale 各一)
  $all = @()
  for ($round = 0; $round -lt 4 -and $missing.Count -gt 0; $round++) {
    foreach ($m in $missing) { Write-Src $m "# stub`n" }
    $all += $missing
    $r = Invoke-Align
    $missing = @([regex]::Matches($r.out, '(?m)找不到(?:引用文件| rationale 文件): (.+?)\s*$') | ForEach-Object { $_.Groups[1].Value })
  }
  $missing = $all
  $devRat  = Join-Path $fxDf "rationale.md"
  $ruleRat = Join-Path $claude "rules-archive\rules-rationale.md"
  $devRef  = @($missing | Where-Object { $_ -like "*skills*devflow*SKILL.md" } | Select-Object -First 1)[0]
  $ruleRef = @($missing | Where-Object { $_ -like "*CLAUDE.md" } | Select-Object -First 1)[0]
  Write-Src $devRat "# r`r`n`r`n## slug-dev`r`n理由`r`n"      # CRLF:标题锚定须不受行尾影响
  Write-Src $ruleRat "# r`n`n## slug-rule`n理由`n"
  Write-Src $devRef "规则 > 理由见 .claude/devflow/rationale.md#slug-dev`n"
  Write-Src $ruleRef "规则 > 理由见 .claude/rules-archive/rules-rationale.md#slug-rule`n"

  # T2 双向齐
  $r = Invoke-Align
  Assert-True ($r.code -eq 0 -and $r.out -match '\[OK\]') "T2 双向齐(含 CRLF)-> OK exit 0"

  # T3 悬空指针
  Write-Src $ruleRef "规则 > 理由见 .claude/rules-archive/rules-rationale.md#slug-rule`n另 > 理由见 .claude/rules-archive/rules-rationale.md#no-such`n"
  $r = Invoke-Align
  Assert-True ($r.code -eq 1 -and $r.out -match '悬空指针.*#no-such') "T3 悬空指针 -> FAIL exit 1"

  # T4 无主理由
  Write-Src $ruleRef "规则 > 理由见 .claude/rules-archive/rules-rationale.md#slug-rule`n"
  Write-Src $devRat "# r`n`n## slug-dev`n理由`n`n## unused-slug`n孤儿`n"
  $r = Invoke-Align
  Assert-True ($r.code -eq 1 -and $r.out -match '无主理由.*unused-slug') "T4 无主理由 -> FAIL exit 1"

  # T5 失配与缺文件并存时 INFRA 优先(清单坏了,失配结论不可信)
  [System.IO.File]::Delete($ruleRat)
  $r = Invoke-Align
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T5 缺文件 + 失配 -> INFRA exit 2"
}
finally {
  Remove-Fixture
}
Exit-TestSuite
