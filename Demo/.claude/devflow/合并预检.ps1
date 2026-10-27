# 合并预检.ps1 - READ-ONLY checks before merging a slot branch (devflow slot
# protocol, "merge" step). Runs no state-changing git verb; the merge itself and all
# judgment stay with the session/user. Reports:
#   A. commits ahead on both slot repos (hash/author/date/subject). With
#      -ExpectedCommits the provenance compare is mechanical in-script: every ahead
#      commit must match a hash in the expected list, extras are blockers. Without
#      the flag the session reviews the list; exit 0 then does NOT certify provenance.
#      The compare is only as good as the list: 槽位交付 passes each slot branch's
#      first-parent chain, so an extra = a commit reachable only through a merge's second
#      parent and outside the baseline (a foreign branch merged in). A list derived from the
#      same ahead set it is compared against would always match and prove nothing.
#   B. slot working trees clean? (uncommitted slot changes would not be merged)
#   C. main Fantasy tree clean? (agent may execute the fantasy merge only when clean)
#      B and C judge by content (Get-ContentDirtyPaths), not by `status` - see section B.
#   D. main client worktree uncommitted files vs slot merge footprint - overlap list
#      (blocker for an agent-executed client merge)
#   E. info: how far each baseline advanced past the slot branch (true-merge preview)
# Exit codes: 0 no blockers found; 1 blockers reported; 2 bad arguments.
# With exit 1 the BLOCKERS list is followed by `BLOCKER-SEGMENTS: <A|A2|B|C|D ...>` (sections that raised a
# blocker, first-seen order, deduplicated); 集成交付 copies it into its BLOCKED-PRECHECK telemetry.
#
# 配置与 git 薄封装都取 hooks\hook函数库.ps1(全 devflow 脚本 + hooks 共享的单一事实源):
# Get-FlowConfig 读 flow-config.psd1 标量并补齐路径键,Get-GitLines/Get-GitOne/
# Get-PorcelainPaths 是只读 git 查询的正本(单元素不解包,见其头注记录的实发事故)。
[CmdletBinding(PositionalBinding=$false)]
param(
  [Parameter(Mandatory=$true)][string]$Slot,   # 槽位号("1")或完整路径
  [string]$RepoRoot,
  [string]$FantasyRoot,
  [string]$ExpectedCommits                     # 每行一个前导 hash 的清单文件
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

$cfg = Get-FlowConfig
if (-not $RepoRoot)    { $RepoRoot    = $cfg.RepoRoot }
if (-not $FantasyRoot) { $FantasyRoot = $cfg.FantasyRoot }
$baseC = $cfg.ClientBaseline
$baseF = $cfg.FantasyBaseline

if ($Slot -match '^\d+$') { $slotDir = Join-Path $cfg.SlotBaseDir ($cfg.SlotDirPrefix + $Slot) }
else { $slotDir = $Slot.TrimEnd('\') }
# 服务端通道关闭(hook函数库 Test-ServerEnabled)时只核客户端:Fantasy 侧各段(A / A2 / B / C / E)跳过。
$server = Test-ServerEnabled
$fx = if ($server) { Join-Path $slotDir $cfg.ServerDirName } else { "" }
if (-not (Test-Path $slotDir) -or ($server -and -not (Test-Path (Join-Path $fx ".git")))) {
  Write-Host "ABORT: slot '$slotDir' or its Fantasy worktree is missing"; exit 2
}

$blockers = New-Object System.Collections.Generic.List[string]
# 各 blocker 出自哪一段(A / A2 / B / C / D),去重后在 BLOCKERS 清单末尾打一行 `BLOCKER-SEGMENTS: <段别…>`
# (输出契约:集成交付 据此把段别写进 BLOCKED-PRECHECK 的遥测 blockers 字段)。
$blockerSegs = New-Object System.Collections.Generic.List[string]
function Add-Blocker([string]$Seg, [string]$Text) {
  $blockers.Add($Text)
  if (-not $blockerSegs.Contains($Seg)) { $blockerSegs.Add($Seg) }
}
$logFmt = '--format="%h %an %ad %s"'

# -- A. commits ahead (provenance) --
$branch = Get-GitOne $slotDir "branch --show-current"
$ahead = Get-GitLines $slotDir "log $logFmt --date=short $baseC..$branch"
$fxBranch = ""; $fxAhead = @()
if ($server) {
  $fxBranch = Get-GitOne $fx "branch --show-current"
  $fxAhead = Get-GitLines $fx "log $logFmt --date=short $baseF..$fxBranch"
}
Write-Host "== A. commits ahead (review for foreign commits) =="
Write-Host "client  $baseC..$branch`: $($ahead.Count) commit(s)"
foreach ($e in $ahead) { Write-Host "  $e" }
if ($server) {
  Write-Host "fantasy $baseF..$fxBranch`: $($fxAhead.Count) commit(s)"
  foreach ($e in $fxAhead) { Write-Host "  $e" }
}
if ($ahead.Count -eq 0 -and $fxAhead.Count -eq 0) {
  Add-Blocker "A" "nothing to merge: both slot repos have 0 commits ahead"
}

# -- A2. mechanical provenance compare (only with -ExpectedCommits) --
if ($ExpectedCommits) {
  if (-not (Test-Path $ExpectedCommits)) {
    Write-Host "ABORT: expected-commits file not found: $ExpectedCommits"; exit 2
  }
  $expected = New-Object System.Collections.Generic.List[string]
  $text = ([System.IO.File]::ReadAllText($ExpectedCommits) -replace "`r`n", "`n")
  foreach ($line in ($text -split "`n")) {
    $m = [regex]::Match($line, '^\s*([0-9a-fA-F]{7,40})\b')
    if ($m.Success) { $expected.Add($m.Groups[1].Value.ToLowerInvariant()) }
  }
  Write-Host "== A2. provenance compare (expected list: $($expected.Count) hash(es)) =="
  if ($expected.Count -eq 0) {
    Write-Host "ABORT: no commit hashes parsed from '$ExpectedCommits' (one leading hash per line)"; exit 2
  }
  $matchedTokens = [ordered]@{}
  $sites = @(@{ Name = "client"; Repo = $slotDir; Range = "$baseC..$branch" })
  if ($server) { $sites += @{ Name = "fantasy"; Repo = $fx; Range = "$baseF..$fxBranch" } }
  foreach ($site in $sites) {
    foreach ($entry in (Get-GitLines $site.Repo "log --format=""%H %s"" $($site.Range)")) {
      $parts = [string]$entry -split ' ', 2
      $full = $parts[0].ToLowerInvariant()
      $subject = if ($parts.Count -gt 1) { $parts[1] } else { "" }
      $tok = $null
      foreach ($t in $expected) { if ($full.StartsWith($t, [System.StringComparison]::Ordinal)) { $tok = $t; break } }
      if ($tok) { $matchedTokens[$tok] = $true }
      else {
        Add-Blocker "A2" "provenance: $($site.Name) commit $($full.Substring(0, [Math]::Min(9, $full.Length))) '$subject' is not in the expected list"
      }
    }
  }
  $unmatched = @($expected | Where-Object { -not $matchedTokens.Contains($_) })
  $extra = @($blockers | Where-Object { $_.StartsWith("provenance:", [System.StringComparison]::Ordinal) }).Count
  Write-Host "matched=$($matchedTokens.Count)  extra-ahead=$extra(blockers)  expected-without-ahead-match=$($unmatched.Count)(info)"
  foreach ($t in $unmatched) {
    Write-Host "  info: expected '$t' not found among ahead commits (already merged, or wrong list)"
  }
}

# -- B. slot trees clean --
# 判据取内容视角(hook函数库 Get-ContentDirtyPaths:diff vs HEAD 忽略行尾 CR + 未跟踪),不取
# `status --porcelain`——后者把 Luban 生成物的混合行尾、入库 blob 与 eol 属性不符这两类零内容差异
# 的文件恒判 M,合并预检随之恒 BLOCKED,而它们提交进去是零内容变化(两类成因与取舍见该函数头注)。
# C 段主 Fantasy 与 集成交付 合并前置同用此函数,三处口径一致。
$slotDirty = Get-ContentDirtyPaths $slotDir
$fxDirty = if ($server) { Get-ContentDirtyPaths $fx } else { @() }
Write-Host "== B. slot working trees =="
Write-Host ("client dirty=$($slotDirty.Count)" + $(if ($server) { "  fantasy dirty=$($fxDirty.Count)" } else { "" }))
if ($slotDirty.Count -gt 0) { Add-Blocker "B" "slot client tree has $($slotDirty.Count) uncommitted change(s) - they would not be merged" }
if ($fxDirty.Count -gt 0)   { Add-Blocker "B" "slot fantasy tree has $($fxDirty.Count) uncommitted change(s) - they would not be merged" }

# -- C. main Fantasy clean (precondition for agent-executed fantasy merge) --
if ($server) {
  $mainFxDirty = Get-ContentDirtyPaths $FantasyRoot   # 内容视角,口径同 B 段
  Write-Host "== C. main Fantasy tree =="
  Write-Host "dirty=$($mainFxDirty.Count)"
  if ($mainFxDirty.Count -gt 0 -and $fxAhead.Count -gt 0) {
    Add-Blocker "C" "main Fantasy tree not clean ($($mainFxDirty.Count) entries) - report, do not merge fantasy side"
    foreach ($line in ($mainFxDirty | Select-Object -First 10)) { Write-Host "  $line" }
  }
}

# -- D. main client uncommitted files vs merge touch set --
# 判定单源 = hooks\hook函数库.ps1 Get-MergeOverlap(与 集成交付 执行点复核共用同一实现;
# 两点/三点 diff 之辨与 2026-07-28 事故记录见该函数头注)。
$d = Get-MergeOverlap $RepoRoot $slotDir $baseC
Write-Host "== D. main client worktree overlap =="
Write-Host "main uncommitted=$($d.mainDirty)  merge touch=$($d.touch)  overlap=$($d.overlap.Count)"
if ($d.overlap.Count -gt 0) {
  Add-Blocker "D" "main worktree has uncommitted changes on $($d.overlap.Count) file(s) inside the merge footprint - agent must not execute the client merge"
  foreach ($p in ($d.overlap | Select-Object -First 20)) { Write-Host "  $p" }
}

# -- E. info: baseline advance since fork (true-merge preview, not a blocker) --
$behind = Get-GitOne $slotDir "rev-list --count $branch..$baseC"
Write-Host "== E. baseline advance since fork (info) =="
if ($server) {
  $fxBehind = Get-GitOne $fx "rev-list --count $fxBranch..$baseF"
  Write-Host "$baseC ahead of $branch`: $behind commit(s); Fantasy $baseF ahead of $fxBranch`: $fxBehind commit(s)"
} else {
  Write-Host "$baseC ahead of $branch`: $behind commit(s)"
}

Write-Host ""
if ($blockers.Count -gt 0) {
  Write-Host "BLOCKERS:"
  foreach ($b in $blockers) { Write-Host "  - $b" }
  Write-Host ("BLOCKER-SEGMENTS: " + ($blockerSegs -join " "))
  exit 1
}
if ($ExpectedCommits) {
  Write-Host "NO BLOCKERS (provenance mechanically compared against the expected list in A2)"
} else {
  Write-Host "NO BLOCKERS (no -ExpectedCommits given: commit provenance in section A is session judgment)"
}
exit 0
