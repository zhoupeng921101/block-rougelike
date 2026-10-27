# 槽位置备.ps1 — 固定池槽位(dev1..dev<SlotCount>)的初始建置/修复工具。
# 建配对 worktree + Tools\Luban junction:
#   1. client:  git -C <RepoRoot> worktree add -b agent/devN <slotDir> main
#      flow-config SlotSparseDirs 非空时改为 --no-checkout 建、sparse-checkout cone 只设这些目录、再检出
#      (仓根散文件照常检出;sparse 配置按 worktree 分存,主仓仍是全量)
#   2. fantasy: git -C <FantasyRoot> worktree add -b agent/devN <slotDir>\<ServerDirName> main
#      (<slotDir>\<ServerDirName> 处的残留 junction 先 unlink——仅移除链接、不动目标内容;
#       真实目录则中止)。服务端通道关闭(Test-ServerEnabled)时整步跳过
#   3. Luban:   删 checked-out <slotDir>\Tools\Luban,junction 回 <RepoRoot>\Tools\Luban
#               (Luban 运行时 DLL 不入库)。实现 = hook函数库 Repair-LubanJunction,槽位领取内核
#               每次领用同函数复核,故已置备的槽位丢了 junction 不需重跑本脚本。主仓没有 Tools\Luban 时跳过
# 日常任务不得调用本脚本;槽位领取.ps1 会负责同步基线并启动 Unity/UnityMCP。
# 预条件不满足带明细中止。中途失败不自动回滚——输出已建内容,清理留会话。
# -CheckOnly:只跑预条件并报将建的三项,零 git 写、零删除、零 junction
#   (script-authoring·脚本接口设计)。
# 退出码:0 建置(或 -CheckOnly 报告完成);1 预条件/步骤失败;2 参数错误。
[CmdletBinding(PositionalBinding=$false)]
param(
  [Parameter(Mandatory=$true)][string]$Slot,   # 固定槽位号:1..flow-config SlotCount
  [string]$RepoRoot,      # 缺省 = flow-config RepoRoot
  [string]$FantasyRoot,   # 缺省 = flow-config FantasyRoot
  [switch]$CheckOnly
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

# Get-FlowConfig 内含 Resolve-FlowRoots:flow-config 的 RepoRoot/FantasyRoot/SlotBaseDir 留空按位置推导
$cfg = Get-FlowConfig
if (-not $RepoRoot)    { $RepoRoot    = $cfg.RepoRoot }
if (-not $FantasyRoot) { $FantasyRoot = $cfg.FantasyRoot }
$baseC = $cfg.ClientBaseline
$baseF = $cfg.FantasyBaseline

function Test-Reparse([string]$Path) {
  try { return [bool]((Get-Item $Path -Force).Attributes -band [System.IO.FileAttributes]::ReparsePoint) }
  catch { return $false }
}

$slotCount = [int]$cfg.SlotCount
if ($Slot -notmatch '^\d+$' -or [int]$Slot -lt 1 -or [int]$Slot -gt $slotCount) {
  Write-Host "ABORT: slot must be an integer in 1..$slotCount"; exit 2
}
$slotNumber = [string][int]$Slot
$slotDir = Join-Path $cfg.SlotBaseDir ($cfg.SlotDirPrefix + $slotNumber)
$branch = $cfg.SlotBranchPrefix + $slotNumber
$lubanTarget = Join-Path $RepoRoot "Tools\Luban"
$hasLuban = Test-Path $lubanTarget
$server = Test-ServerEnabled
$sparse = @(($cfg.SlotSparseDirs -split ',') | ForEach-Object { $_.Trim() } | Where-Object { $_ })

# -- 预条件(建任何东西前 all-or-nothing 报告) --
$problems = New-Object System.Collections.Generic.List[string]
if (Test-Path $slotDir) { $problems.Add("slot dir already exists: $slotDir (re-provisioning an existing slot is session judgment)") }
if ((Get-GitLines $RepoRoot    "branch --list $branch").Count -gt 0) { $problems.Add("client branch '$branch' already exists in $RepoRoot") }
if ($server -and (Get-GitLines $FantasyRoot "branch --list $branch").Count -gt 0) { $problems.Add("fantasy branch '$branch' already exists in $FantasyRoot") }
# worktree list --porcelain 打印正斜杠路径;以该形式比较
$slotDirFwd = $slotDir.Replace('\', '/')
if ((Get-GitLines $RepoRoot "worktree list --porcelain") -match ('(?i)^worktree ' + [regex]::Escape($slotDirFwd) + '$')) {
  $problems.Add("client worktree registration already points at $slotDir (stale? see 'git worktree prune')")
}
if ($server) {
  $fxDirFwd = (Join-Path $slotDir $cfg.ServerDirName).Replace('\', '/')
  if ((Get-GitLines $FantasyRoot "worktree list --porcelain") -match ('(?i)^worktree ' + [regex]::Escape($fxDirFwd) + '$')) {
    $problems.Add("fantasy worktree registration already points at $fxDirFwd (stale? see 'git worktree prune' in $FantasyRoot)")
  }
}
if ($problems.Count -gt 0) {
  Write-Host "ABORT: preconditions not met -"
  foreach ($p in $problems) { Write-Host "  $p" }
  exit 1
}

if ($CheckOnly) {
  Write-Host "CHECK-ONLY  preconditions met; would create:"
  Write-Host ("  1. client worktree  {0}  ({1} @ {2}){3}" -f $slotDir, $branch, $baseC, $(if ($sparse.Count) { "  sparse: " + ($sparse -join ", ") } else { "" }))
  if ($server) { Write-Host ("  2. fantasy worktree {0}  ({1} @ {2})" -f (Join-Path $slotDir $cfg.ServerDirName), $branch, $baseF) }
  else { Write-Host "  2. fantasy worktree  (skipped: server channel disabled)" }
  if ($hasLuban) { Write-Host ("  3. junction         {0} -> {1}" -f (Join-Path $slotDir "Tools\Luban"), $lubanTarget) }
  else { Write-Host "  3. junction          (skipped: $lubanTarget missing)" }
  Write-Host "CHECK-ONLY: nothing created"
  exit 0
}

# -- 1. client worktree(稀疏:先不检出,设好 cone 再检出) --
$addArgs = if ($sparse.Count) { "worktree add --no-checkout -b $branch ""$slotDir"" $baseC" } else { "worktree add -b $branch ""$slotDir"" $baseC" }
$r = Invoke-GitMerged $RepoRoot $addArgs
if ($r.code -ne 0) {
  Write-Host "ABORT: client worktree add failed (nothing created):"
  foreach ($l in $r.lines) { Write-Host "  $l" }
  exit 1
}
if ($sparse.Count) {
  $r = Invoke-GitMerged $slotDir ("sparse-checkout set --cone " + (($sparse | ForEach-Object { '"' + $_ + '"' }) -join " "))
  if ($r.code -eq 0) { $r = Invoke-GitMerged $slotDir "checkout -q" }
  if ($r.code -ne 0) {
    Write-Host "ABORT: sparse checkout failed. Client worktree WAS created (unpopulated); cleanup is session judgment:"
    foreach ($l in $r.lines) { Write-Host "  $l" }
    exit 1
  }
}
Write-Host ("OK  client worktree: $slotDir ($branch @ $baseC)" + $(if ($sparse.Count) { " sparse: " + ($sparse -join ", ") } else { "" }))

if (-not $server) {
  Write-Host "SKIP fantasy worktree: server channel disabled"
} else {
# -- 2. fantasy worktree(先 unlink 残留 junction;真实目录中止) --
$fx = Join-Path $slotDir $cfg.ServerDirName
if (Test-Path $fx) {
  if (Test-Reparse $fx) {
    [System.IO.Directory]::Delete($fx, $false)   # 仅 unlink,目标不动
    Write-Host "OK  removed leftover junction at $fx"
  } elseif (@(Get-ChildItem $fx -Force -ErrorAction SilentlyContinue).Count -eq 0) {
    [System.IO.Directory]::Delete($fx, $false)
  } else {
    Write-Host "ABORT: $fx is a real non-empty directory - not touching it. Client worktree WAS created; cleanup is session judgment."
    exit 1
  }
}
$r = Invoke-GitMerged $FantasyRoot "worktree add -b $branch ""$fx"" $baseF"
if ($r.code -ne 0) {
  Write-Host "ABORT: fantasy worktree add failed. Client worktree WAS created; cleanup is session judgment:"
  foreach ($l in $r.lines) { Write-Host "  $l" }
  exit 1
}
Write-Host "OK  fantasy worktree: $fx ($branch @ $baseF)"
}

# -- 3. Tools\Luban junction(替换 checked-out 副本) --
if (-not $hasLuban) {
  Write-Host "SKIP junction: $lubanTarget missing"
} else {
  $j = Repair-LubanJunction $slotDir $lubanTarget
  if ($j.state -notin @("ok", "created")) {
    Write-Host "ABORT: Tools\Luban junction $($j.state). Worktrees WERE created; cleanup is session judgment:"
    Write-Host "  $($j.detail)"
    exit 1
  }
  Write-Host "OK  junction: $($j.detail)"
}

$dirty = Get-GitLines $slotDir "status --porcelain"
Write-Host ("PROVISIONED  {0}  (client status: {1} dirty entries - expect 0)" -f $slotDir, $dirty.Count)
Write-Host "READY: future tasks use 槽位领取.ps1; it starts Unity and UnityMCP automatically."
exit 0
