# 理由对齐核对.ps1 — 高频文件指针 <-> 对应 rationale 文件条目双向对齐检查。
#
# 高频加载文件(工作流族技能卡、每会话必载的 CLAUDE.md 与 .claude/rules 文件)及已移出注入路径的
# 按需规则(.claude/rules-ondemand)的审计期理由外移到并列 rationale 文件后,原文件留
# `理由见 <...>/rationale.md#<slug>` 指针。本脚本按 (rationale 文件, 引用它的文件清单) 对逐对核对:
#   - 悬空指针:引用文件引了某 slug,rationale 文件没有对应 `## <slug>` 条目。
#   - 无主理由:rationale 文件有 `## <slug>` 条目,却没有任何文件引用它。
#
# 任一失配 -> 退出码 1 并列明细;全通过 -> 退出码 0;$pairs 登记的 rationale / 引用文件缺失 -> 退出码 2
# (INFRA:清单与现状脱节,失配结论不可信,优先于失配报出)。无状态、纯文本核对,不改文件。
# 推广到新文件时在 $pairs 追加。
[CmdletBinding(PositionalBinding=$false)]
param()
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")   # Sort-Ordinal 等共享工具;载入无副作用

$devFlowDir = $PSScriptRoot
$claudeDir  = [System.IO.Path]::GetFullPath((Join-Path $devFlowDir ".."))
$skills     = Join-Path $claudeDir "skills"
$rules      = Join-Path $claudeDir "rules"
$ondemand   = Join-Path $claudeDir "rules-ondemand"

# slug 规约小写:正则大小写敏感(.NET 默认),含大写的 slug 不被识别
$headingRe = [regex]'(?m)^##[ \t]+([a-z0-9][a-z0-9-]*)[ \t]*$'

# 每对:rationale 文件 + 用于匹配指向它的指针的路径标记(forward-slash)+ 引用它的文件清单。
$pairs = @(
  @{
    Rationale = Join-Path $devFlowDir "rationale.md"
    Marker    = "devflow/rationale.md"
    Refs      = @(
      (Join-Path $skills "devflow\SKILL.md"),
      (Join-Path $skills "devflow\references\slot-protocol.md"),
      (Join-Path $skills "devflow\references\defect-attribution.md"),
      (Join-Path $skills "devflow\references\script-consolidation.md"),
      (Join-Path $skills "devflow\references\security-review.md"),
      (Join-Path $skills "devflow-client\SKILL.md"),
      (Join-Path $skills "devflow-ui\SKILL.md"),
      (Join-Path $skills "devflow-check\SKILL.md"),
      (Join-Path $skills "unity-check\SKILL.md"),
      (Join-Path $devFlowDir "obligation-ledger.md")
    )
  },
  @{
    Rationale = Join-Path $claudeDir "rules-archive\rules-rationale.md"
    Marker    = "rules-archive/rules-rationale.md"
    Refs      = @(
      ([System.IO.Path]::GetFullPath((Join-Path $claudeDir "..\CLAUDE.md"))),
      (Join-Path $ondemand "rule-authoring.md"),
      (Join-Path $ondemand "tengine-conventions.md"),
      (Join-Path $ondemand "script-authoring.md"),
      (Join-Path $ondemand "ui-image-assets.md"),
      (Join-Path $rules "shell-conventions.md"),
      (Join-Path $ondemand "file-conventions.md")
    )
  }
)

$problems = New-Object System.Collections.Generic.List[string]
$infra    = New-Object System.Collections.Generic.List[string]   # 文件缺失:清单配置问题,不是对齐失配

function Read-NormalizedText([string]$Path) {
  # CRLF 归一成 LF:.NET 的 ReadAllText 原样返回 \r\n,而 (?m) 下的 `$` 只在 \n 前匹配,
  # 行尾的 \r 会让 `[ \t]*$` 之类的锚定全部失配(本检查曾因此把全部指针误报为悬空)。
  return ([System.IO.File]::ReadAllText($Path) -replace "`r`n", "`n")
}

function Test-Pair($Pair) {
  # 回 @(指针 slug 数, 条目 slug 数);失配写入外层 $problems
  $rp = $Pair.Rationale
  if (-not (Test-Path $rp -PathType Leaf)) {
    $infra.Add("找不到 rationale 文件: $rp")
    return @(0, 0)
  }
  $headings = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::Ordinal)
  foreach ($m in $headingRe.Matches((Read-NormalizedText $rp))) {
    [void]$headings.Add($m.Groups[1].Value)
  }
  $ptrRe = [regex]([regex]::Escape($Pair.Marker) + '#([a-z0-9][a-z0-9-]*)')

  # slug -> 引用它的文件名清单(键序 = 首次出现序,打印时另按 Ordinal 排)
  $referenced = [ordered]@{}
  foreach ($ref in $Pair.Refs) {
    if (-not (Test-Path $ref -PathType Leaf)) {
      $infra.Add("找不到引用文件: $ref")
      continue
    }
    foreach ($m in $ptrRe.Matches((Read-NormalizedText $ref))) {
      $slug = $m.Groups[1].Value
      if (-not $referenced.Contains($slug)) { $referenced[$slug] = New-Object System.Collections.Generic.List[string] }
      $referenced[$slug].Add([System.IO.Path]::GetFileName($ref))
    }
  }

  foreach ($slug in (Sort-Ordinal @($referenced.Keys))) {
    if (-not $headings.Contains($slug)) {
      $who = ($referenced[$slug] -join ", ")
      $problems.Add("[$($Pair.Marker)] 悬空指针: $who 引用 #$slug,但无 ``## $slug`` 条目")
    }
  }
  foreach ($slug in (Sort-Ordinal @($headings))) {
    if (-not $referenced.Contains($slug)) {
      $problems.Add("[$($Pair.Marker)] 无主理由: ``## $slug`` 无任何文件引用")
    }
  }
  return @($referenced.Count, $headings.Count)
}

$totalPtr = 0
$totalHead = 0
foreach ($pair in $pairs) {
  $r = Test-Pair $pair
  $totalPtr  += $r[0]
  $totalHead += $r[1]
}

if ($infra.Count -gt 0) {
  Write-Host "[INFRA] `$pairs 登记的文件缺失 $($infra.Count) 项(改名 / 删除后未同步清单):"
  foreach ($pr in $infra) { Write-Host "  - $pr" }
  foreach ($pr in $problems) { Write-Host "  - (参考,清单修复前不可信)$pr" }
  exit 2
}
if ($problems.Count -gt 0) {
  Write-Host "[FAIL] rationale 对齐失配 $($problems.Count) 项:"
  foreach ($pr in $problems) { Write-Host "  - $pr" }
  exit 1
}
Write-Host "[OK] rationale 对齐:$($pairs.Count) 对,指针 $totalPtr 条 / 条目 $totalHead 条,双向齐。"
exit 0
