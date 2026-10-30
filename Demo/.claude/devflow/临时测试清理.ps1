# 临时测试清理.ps1 — 检查通过后临时测试清理(「测试代码一律临时」条款,正本 = devflow-client 卡
# 「自检(交付前必过)」节;删除时机 = 检查真通过)。
# 测试本身由实现段自行在编辑器 Test Runner 执行,检查不运行测试;本脚本只承担「PASS 在手才删」。
# 验凭据(票 PASS 且票树覆盖当前树)后只删 <ProjectDir>\Assets\Editor\Tests 及其 .meta——别无其他。
# 删除范围由构造保证(脚本永远只碰这一个目录),堵住手删路径打偏、无机器核对的缺口。
# 票树核对与容忍度单一源 = hooks\校验库.ps1(ScratchRe / ClientSurfaceRe / Test-TicketCoversTree)。
# 不跑任何 git 动词:测试目录被 .gitignore 忽略,从不入库,删除不产生 git 变更、无需提交;删除造成的
# 工作树漂移由验凭据的临时测试删除容忍度承接。调用点 = devflow 卡第三步,客户端自检 PASS 之后、单仓提交之前。
# -CheckOnly:验票并列出将删文件,不删任何东西(script-authoring·脚本接口设计)。
# 退出码:0 已清理 / 无可清 / -CheckOnly 报告完成;1 票缺失 / 不可读 / 非 PASS / 缺树哈希 / 票树不覆盖当前树;2 参数错。
[CmdletBinding(PositionalBinding=$false)]
param(
  [Parameter(Mandatory = $true)][string]$ProjectDir,   # Demo 根(主工程或槽位)
  [switch]$CheckOnly
)
$ErrorActionPreference = "Stop"

$ProjectDir = $ProjectDir.TrimEnd('\')
if (-not (Test-Path (Join-Path $ProjectDir "ProjectSettings\ProjectVersion.txt"))) {
  Write-Host "ABORT: '$ProjectDir' is not a Unity project (ProjectVersion.txt missing)"; exit 2
}
$testsDir  = Join-Path $ProjectDir "Assets\Editor\Tests"
$testsMeta = $testsDir + ".meta"
if (-not (Test-Path $testsDir) -and -not (Test-Path $testsMeta)) {
  Write-Host "NOTHING TO CLEAN: no temporary tests at '$testsDir'"; exit 0
}

$repoRoot   = Split-Path $ProjectDir -Parent
$ticketPath = Join-Path $repoRoot ".gate\ticket.json"
if (-not (Test-Path $ticketPath)) {
  Write-Host "REFUSED: no gate ticket at '$ticketPath' - green the gate first (客户端自检.ps1); deletion timing = gate actually green"; exit 1
}
# 票读取与票树核对走 校验库 单一正本(Read-Ticket / Test-TicketCoversTree),口径 = 单仓提交 提交点验票
# (客户端验证面 ClientSurfaceRe:面外漂移不作废、临时测试删除豁免)。只看 result 时,上一轮留下的 PASS 票
# 在其后改过代码、检查未重跑的树上照样放行删除——「PASS 在手才删」就失去了「在手」的含义。
# 校验库 在验票需要时才加载:它会钉进程输出编码,早于验票的 ABORT / NOTHING TO CLEAN 路径不受影响。
. (Join-Path $PSScriptRoot "hooks\校验库.ps1")
$ticket = Read-Ticket $repoRoot
if (-not $ticket) {
  Write-Host "REFUSED: gate ticket at '$ticketPath' is unreadable - re-run the gate (客户端自检.ps1)"; exit 1
}
if ([string]$ticket.result -ne "PASS") {
  Write-Host "REFUSED: ticket at '$ticketPath' is '$($ticket.result)', not PASS"; exit 1
}
if (-not [string]$ticket.tree) {
  Write-Host "REFUSED: ticket at '$ticketPath' carries no tree hash - cannot tell which tree it certifies; re-run the gate"; exit 1
}
$cover = Test-TicketCoversTree $repoRoot ([string]$ticket.tree) $script:ClientSurfaceRe
if (-not (Test-TicketVerdictPass $cover)) {
  Write-Host "REFUSED: ticket at '$ticketPath' does not certify the current tree ($cover) - the tree changed after the gate passed; re-run the gate (客户端自检.ps1)"; exit 1
}

$files = @()
if (Test-Path $testsDir) { $files = @(Get-ChildItem $testsDir -Recurse -File | Select-Object -ExpandProperty FullName) }
$verb = if ($CheckOnly) { "CHECK-ONLY would delete" } else { "DELETING" }
Write-Host ("{0} {1} file(s) under {2}" -f $verb, $files.Count, $testsDir)
$files | ForEach-Object { Write-Host "  $_" }
if ($CheckOnly) { Write-Host "CHECK-ONLY: ticket is PASS, nothing removed"; exit 0 }
if (Test-Path $testsDir)  { [System.IO.Directory]::Delete($testsDir, $true) }
if (Test-Path $testsMeta) { [System.IO.File]::Delete($testsMeta) }
Write-Host "CLEANED: temporary tests removed (ignored by .gitignore - no commit needed)"
exit 0
