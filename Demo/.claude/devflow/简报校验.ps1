# 简报校验.ps1 - 简报结构机判(纯文本、零 git、无状态)。
# 由 槽位领取.ps1 在调内核前强制调用;也可单独调用自查。只判结构层:
#   1 必填段齐全且非空(必填段清单 = 模板文件的 `## ` 标题,模板即正本)
#   2 无占位符:独立的 TODO / TBD(区分大小写,前后紧邻 ASCII 字母数字下划线的不算,故 todo / TODOs / myTODO
#     放行;紧邻中文仍算),以及 填写指引(模板指引行未替换的探测点)。「待定」「待补」是正常产品用语,不算占位
#     (理由见 .claude/devflow/rationale.md#brief-gate-machine-checked)。每个命中行各出一条,同段多处全列。
#   3 验收点段无空话(适当处理/妥善处理/酌情处理)
# 语义层(自相矛盾/两读歧义)机判不可靠,不在此判,仍归第一步自查。
# 第 3 项专项检查与模板段名(验收点)耦合,模板改名须同步本脚本。
# 简报中多出模板之外的段(如 改动范围)合法,占位符探测仍覆盖。
# 输出:BRIEF-ISSUE 明细行 + 末行 VERDICT: PASS|FAIL|INFRA。占位行写出命中词,形如
#   `BRIEF-ISSUE: 占位「TODO」: [段名] 行原文`(一行命中多个词时连写「TODO」「TBD」)。
# 退出码:0 合规;1 不合规;2 模板缺失/内部错误。
[CmdletBinding(PositionalBinding = $false)]
param(
  [Parameter(Mandatory = $true)][string]$BriefFile,
  [string]$TemplateFile = ""
)
$ErrorActionPreference = "Stop"
try {
  if (-not $TemplateFile) { $TemplateFile = Join-Path $PSScriptRoot "templates\简报模板.md" }
  if (-not (Test-Path -LiteralPath $TemplateFile)) {
    Write-Host ("VERDICT: INFRA | template not found: " + $TemplateFile)
    exit 2
  }
  if (-not (Test-Path -LiteralPath $BriefFile)) {
    Write-Host ("VERDICT: FAIL | brief not found: " + $BriefFile)
    exit 1
  }

  $required = @()
  foreach ($l in [System.IO.File]::ReadAllLines($TemplateFile)) {
    $m = [regex]::Match($l, '^##\s+(.+?)\s*$')
    if ($m.Success) { $required += $m.Groups[1].Value }
  }
  if ($required.Count -eq 0) {
    Write-Host ("VERDICT: INFRA | template has no '## ' sections: " + $TemplateFile)
    exit 2
  }

  # 简报按 `## ` 标题切段;段首标题前的引言行不属任何段,不参与检查。
  $sections = @{}
  $order = @()
  $cur = ""
  foreach ($l in [System.IO.File]::ReadAllLines($BriefFile)) {
    $m = [regex]::Match($l, '^##\s+(.+?)\s*$')
    if ($m.Success) {
      $cur = $m.Groups[1].Value
      if (-not $sections.ContainsKey($cur)) { $sections[$cur] = New-Object System.Collections.Generic.List[string]; $order += $cur }
      continue
    }
    if ($cur) { $sections[$cur].Add($l) }
  }

  $problems = New-Object System.Collections.Generic.List[string]

  foreach ($name in $required) {
    if (-not $sections.ContainsKey($name)) { $problems.Add("缺段: " + $name); continue }
    if (@($sections[$name] | Where-Object { $_.Trim() }).Count -eq 0) { $problems.Add("空段: " + $name) }
  }

  # [regex]::Matches 区分大小写(-match 不区分,不可换用)。
  $phRe = '(?<![A-Za-z0-9_])(?:TODO|TBD)(?![A-Za-z0-9_])|填写指引'
  foreach ($name in $order) {
    foreach ($l in $sections[$name]) {
      $hits = @([regex]::Matches($l, $phRe) | ForEach-Object { $_.Value } | Select-Object -Unique)
      if ($hits.Count -eq 0) { continue }
      $words = ($hits | ForEach-Object { "「" + $_ + "」" }) -join ""
      $problems.Add("占位" + $words + ": [" + $name + "] " + $l.Trim())
    }
  }

  if ($sections.ContainsKey("验收点")) {
    foreach ($l in $sections["验收点"]) {
      if ($l -match '适当处理|妥善处理|酌情处理') { $problems.Add("验收点空话: " + $l.Trim()) }
    }
  }

  if ($problems.Count -gt 0) {
    foreach ($p in $problems) { Write-Host ("BRIEF-ISSUE: " + $p) }
    Write-Host ("VERDICT: FAIL | " + $problems.Count + " issue(s); 模板正本 = " + $TemplateFile)
    exit 1
  }
  Write-Host ("VERDICT: PASS | sections=" + $required.Count)
  exit 0
} catch {
  Write-Host ("VERDICT: INFRA | " + $_.Exception.Message)
  exit 2
}
