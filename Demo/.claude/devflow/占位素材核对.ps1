# 占位素材核对.ps1 - 占位素材目录与登记表的一致性静态扫描(读文件系统 + 解析登记表,只读)。
# 准入: Since=2026-10-28 | Basis=用户裁定 | Origin=2026-10-28 用户裁定(地图「3B 首个可玩盲注」31 号票第 5 项):动物乐园的特效音效当占位搬进来,集中放、登记成表,客户端自检核对目录与表两边一致、不拦出包 | Retire=阶段 6 占位素材全部替换、占位目录清空、登记表删除时
#
# 不变量:登记表(Assets/AssetRaw/Effects/ZooPlaceholder/占位登记表.md)「占位目录」一节列出的每个目录里,
#   每个文件(不含 .meta 与登记表本身)都在「登记」表某一行的「文件」格里;表里列的每个文件都存在,且落在某个占位目录下。
#   每行七格齐全,「件」「调用方」两格不空。
#
# 为什么:占位素材是借来的(竞品拆包与参考工程的美术,团队声明有使用权),阶段 6 要逐件换掉。不登记的文件会被忘在包里,
#   登记了却已删的行会让人以为还有一件没换。目录与表各改各的不报错,只能对账。
#
# 「文件」格:路径相对 Assets/AssetRaw/,多个用 <br> 分隔;同一文件可出现在多行(共用的材质、贴图)。
# 只核一致性:不看文件内容、不看 guid 引用、不拦出包(出包脚本不调本道)。调用方格只核不空,能否从代码倒查靠人。
#
# 出口码: 0 PASS(两边一致)
#         1 FAIL(有文件没登记 / 登记的文件不在 / 行不完整 / 登记的文件不在任何占位目录下 / 占位目录不存在)
#         2 INFRA(登记表不在 / 读不出「占位目录」或「登记」节)
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # 一个 Demo 根(含 Assets\)
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")   # 只为它点源处的输出编码钉:违规时要把中文文件名原样打出来

$ProjectDir = $ProjectDir.TrimEnd('\')
$rawDir     = Join-Path $ProjectDir "Assets\AssetRaw"
$registerRel = "Effects/ZooPlaceholder/占位登记表.md"
$register   = Join-Path $rawDir ($registerRel -replace '/', '\')

if (-not (Test-Path -LiteralPath $register)) {
  Write-Host "VERDICT : INFRA - placeholder register '$register' not found (layout changed? sync 占位素材核对.ps1)"; exit 2
}

# ── 解析登记表 ────────────────────────────────────────────
$lines = [System.IO.File]::ReadAllLines($register, [System.Text.Encoding]::UTF8)
$section = ""
$roots = @()
$rows = @()
$headerSeen = $false
for ($i = 0; $i -lt $lines.Length; $i++) {
  $ln = $lines[$i]
  if ($ln -match '^##\s+(.+?)\s*$') { $section = $Matches[1]; continue }
  if ($section -eq "占位目录" -and $ln -match '^-\s+`([^`]+)`') {
    $roots += ($Matches[1].TrimEnd('/') -replace '^Assets/AssetRaw/', '')
    continue
  }
  if ($section -eq "登记" -and $ln.StartsWith("|", [System.StringComparison]::Ordinal)) {
    if (-not $headerSeen) { $headerSeen = $true; continue }   # 表头
    if ($ln -match '^\|\s*-') { continue }                     # 分隔行
    $rows += [pscustomobject]@{ Line = $i + 1; Text = $ln }
  }
}
if ($roots.Count -eq 0) { Write-Host "VERDICT : INFRA - register has no「占位目录」entries (format changed? sync 占位素材核对.ps1)"; exit 2 }
if (-not $headerSeen)   { Write-Host "VERDICT : INFRA - register has no「登记」table (format changed? sync 占位素材核对.ps1)"; exit 2 }

$problems = New-Object System.Collections.Generic.List[string]
$listed = @{}   # 相对 AssetRaw 的路径(小写比对,原样留给报错) -> 首次出现的行号

foreach ($row in $rows) {
  # 首尾的 | 去掉后按 | 切;格里不含 |(表里的说明文字不用竖线)
  $cells = @($row.Text.Trim().Trim('|').Split('|') | ForEach-Object { $_.Trim() })
  if ($cells.Count -ne 7) { $problems.Add("line " + $row.Line + ": row has " + $cells.Count + " cells, expected 7"); continue }
  if (-not $cells[0]) { $problems.Add("line " + $row.Line + ": empty「件」cell") }
  if (-not $cells[5]) { $problems.Add("line " + $row.Line + ": empty「调用方」cell") }
  $files = @($cells[1] -split '<br>' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  if ($files.Count -eq 0) { $problems.Add("line " + $row.Line + ": empty「文件」cell"); continue }
  foreach ($f in $files) {
    $rel = $f -replace '\\', '/'
    $underRoot = $false
    foreach ($r in $roots) { if ($rel.StartsWith($r + "/", [System.StringComparison]::OrdinalIgnoreCase)) { $underRoot = $true; break } }
    if (-not $underRoot) { $problems.Add("line " + $row.Line + ": '" + $rel + "' is not under any placeholder root"); continue }
    if (-not (Test-Path -LiteralPath (Join-Path $rawDir ($rel -replace '/', '\')) -PathType Leaf)) {
      $problems.Add("line " + $row.Line + ": listed file missing on disk: " + $rel)
    }
    $key = $rel.ToLowerInvariant()
    if (-not $listed.ContainsKey($key)) { $listed[$key] = $row.Line }
  }
}

# ── 扫占位目录 ────────────────────────────────────────────
$onDisk = 0
foreach ($r in $roots) {
  $dir = Join-Path $rawDir ($r -replace '/', '\')
  if (-not (Test-Path -LiteralPath $dir -PathType Container)) { $problems.Add("placeholder root listed but missing: Assets/AssetRaw/" + $r); continue }
  foreach ($file in [System.IO.Directory]::EnumerateFiles($dir, "*", [System.IO.SearchOption]::AllDirectories)) {
    if ($file.EndsWith(".meta", [System.StringComparison]::OrdinalIgnoreCase)) { continue }
    $rel = $file.Substring($rawDir.Length + 1) -replace '\\', '/'
    if ([string]::Equals($rel, $registerRel, [System.StringComparison]::OrdinalIgnoreCase)) { continue }
    $onDisk++
    if (-not $listed.ContainsKey($rel.ToLowerInvariant())) { $problems.Add("file not in register: Assets/AssetRaw/" + $rel) }
  }
}

if ($problems.Count -gt 0) {
  Write-Host ("VIOLATION 占位素材核对: placeholder dirs and " + $registerRel + " disagree (" + $problems.Count + ")")
  foreach ($p in $problems) { Write-Host ("  " + $p) }
  Write-Host "FIX: add a row (or extend a row's「文件」cell) for each unregistered file, delete rows / entries whose file is gone. Format: see the register's header."
  exit 1
}

Write-Host ("OK  占位素材核对: " + $roots.Count + " placeholder root(s), " + $onDisk + " files, " + $rows.Count + " rows, all consistent")
exit 0
