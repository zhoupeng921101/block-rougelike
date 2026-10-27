# 归因留痕.ps1 — 逃逸缺陷归因协议的遥测留痕(devflow 卡:四类归因 + 预期取舍简化归因)。
# 由会话直接调用,每归因一个逃逸缺陷跑一次(简化归因:每缺陷类每批一次):
#   归因留痕.ps1 -Route not-loaded -NoteFile <说明文件>
# 说明走文件(-NoteFile,UTF-8,整份读入、换行折成空格):它含中文与引号,不以字符串穿进程边界
# (shell-conventions「文本走文件」)。-Note 只供 PowerShell 进程内调用,两者互斥。
# 唯一写动作是追加一条遥测;参数不合法 exit 2,其余 exit 0。
# 遥测经 hooks\hook函数库.ps1 的 Write-Telemetry(单一正本,与 hooks / 检查共用同一写入实现)。
[CmdletBinding(PositionalBinding=$false)]
param(
  [Parameter(Mandatory=$true)]
  [ValidateSet("rule-missing", "not-loaded", "not-followed", "check-gap", "accepted-tradeoff")]
  [string]$Route,
  [string]$Note = "",
  [string]$NoteFile = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

if ($Note -and $NoteFile) {
  Write-Host "ERROR: -Note 与 -NoteFile 互斥,二选一"
  exit 2
}
if ($NoteFile) {
  $Note = Read-OneLineTextFile $NoteFile
  if ($null -eq $Note) {
    Write-Host ("ERROR: NoteFile not found: " + $NoteFile)
    exit 2
  }
}

Write-Telemetry @{ event = "escape-defect"; route = $Route; note = $Note }
Write-Host "attribution logged: $Route - $Note"
exit 0
