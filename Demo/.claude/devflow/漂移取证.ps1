# 漂移取证.ps1 — UnityMCP 实例漂移的现场采集与判定
#
# 【要回答的问题】漂移那一刻,被 MCP 选中的实例,是 status 文件 mtime 最新的,还是 last_heartbeat 最新的?
# 这两条对应 mcpforunityserver 里两条不同的静默回退路径(read_status_file 的 hash 穿透 /
# _resolve_instance_id 的 using most recent),答案决定该修哪一条、或给上游报哪一条。
# **抓到一次即可停**,它不是常驻基建。
#
# 【入口全名】.claude\devflow\漂移取证.ps1
#
# 【三种用法】三个参数集互斥,必须选一个:
#   1) 采集(后台常驻,漂移发生前就要先跑起来):
#        powershell.exe -NoProfile -ExecutionPolicy Bypass -File "<本脚本>" -Watch
#      可选 -IntervalSec <秒,默认 1> -MaxMinutes <分钟,默认 240,到点自停不留孤儿进程>
#   2) 打标(会话侧发现落点不对时立刻调,给采集流插一条对齐锚点):
#        ... -File "<本脚本>" -Mark -Expected "Demo@db978ef4" -Actual "D:/work/block-rougelike-dev3/Demo/Assets"
#   3) 判定(事后读采集流出结论):
#        ... -File "<本脚本>" -Report
#      默认取最后一条标记的时刻;要看别的时刻传 -Around "2026-08-25T20:03:43".
#
# 【前置条件】无需 Unity 或 MCP 在跑;采集源是 %USERPROFILE%\.unity-mcp\ 下的 status/port 文件,
#   由 Unity 侧插件自行维护。目录不存在时采集照跑并记空快照(那本身就是一种现场)。
#
# 【副作用】只写一个仓外日志文件(缺省 %LOCALAPPDATA%\UnityMCP\Logs\drift-watch.jsonl,可用 -LogPath 改),
#   追加写、不轮转、不删除既有内容;不碰仓库、不碰 Unity、不发网络请求。采集是纯只读探测。
#
# 【调用后动作】-Watch 会一直占住当前进程,须放后台跑;-Mark 与 -Report 秒回。
#   典型序列:先 -Watch 起后台 → 照常干活 → 撞见落点不对立刻 -Mark → 随后 -Report 出结论 → 停掉后台。
#
# 【配套入口】占用面板.ps1(看槽位与实例占用全景)、unity-check skill(连接自检与绑定诊断)。

[CmdletBinding(PositionalBinding = $false, DefaultParameterSetName = "Watch")]
param(
  [Parameter(ParameterSetName = "Watch", Mandatory = $true)][switch]$Watch,
  [Parameter(ParameterSetName = "Watch")][ValidateRange(1, 60)][int]$IntervalSec = 1,
  [Parameter(ParameterSetName = "Watch")][ValidateRange(1, 1440)][int]$MaxMinutes = 240,

  [Parameter(ParameterSetName = "Mark", Mandatory = $true)][switch]$Mark,
  [Parameter(ParameterSetName = "Mark", Mandatory = $true)][string]$Expected,
  [Parameter(ParameterSetName = "Mark", Mandatory = $true)][string]$Actual,

  [Parameter(ParameterSetName = "Report", Mandatory = $true)][switch]$Report,
  [Parameter(ParameterSetName = "Report")][string]$Around,

  [string]$LogPath = ""
)

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

# 只读诊断脚本,不走 devflow 入口的 VERDICT 返回契约:失败直接报错退出。
function Stop-WithError([string]$Message) {
  Write-Host ("错误: " + $Message)
  exit 2
}

function Get-LogPath {
  if ($LogPath) { return $LogPath }
  $dir = Join-Path $env:LOCALAPPDATA "UnityMCP\Logs"
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  return (Join-Path $dir "drift-watch.jsonl")
}

function Get-StatusDir { return (Join-Path $env:USERPROFILE ".unity-mcp") }

# 落点路径是不是落在某个实例的工程路径下。比较固定 OrdinalIgnoreCase:
# Windows 上盘符与目录名不区分大小写,但判定不能落到当前区域的大小写规则上。
function Test-UnderPath([string]$Candidate, [string]$Base) {
  if (-not $Candidate -or -not $Base) { return $false }
  $c = ($Candidate -replace '\\', '/').TrimEnd('/')
  $b = ($Base -replace '\\', '/').TrimEnd('/')
  return $c.StartsWith($b, [System.StringComparison]::OrdinalIgnoreCase)
}

# 一次快照:每个 status 文件的 mtime + 内容关键字段,外加同 hash 的 port 文件(陈旧 port 条目是另一条嫌疑线)。
function Get-Snapshot {
  $dir = Get-StatusDir
  $items = @()
  if (-not (Test-Path $dir)) { return $items }

  foreach ($f in @(Get-ChildItem -Path $dir -Filter "unity-mcp-status-*.json" -ErrorAction SilentlyContinue)) {
    $hash = $f.BaseName -replace '^unity-mcp-status-', ''
    $obj = $null
    try { $obj = Get-Content -Path $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json } catch { $obj = $null }

    $portFile = Join-Path $dir ("unity-mcp-port-" + $hash + ".json")
    $portMtime = ""; $portValue = ""
    if (Test-Path $portFile) {
      $pf = Get-Item $portFile
      $portMtime = $pf.LastWriteTimeUtc.ToString("o")
      try { $portValue = ([string](Get-Content -Path $portFile -Raw -Encoding UTF8 | ConvertFrom-Json).unity_port) } catch { $portValue = "" }
    }

    $items += [ordered]@{
      hash         = $hash
      statusMtime  = $f.LastWriteTimeUtc.ToString("o")
      port         = if ($obj) { [string]$obj.unity_port } else { "" }
      reloading    = if ($obj) { [bool]$obj.reloading } else { $null }
      reason       = if ($obj) { [string]$obj.reason } else { "" }
      heartbeat    = if ($obj) { [string]$obj.last_heartbeat } else { "" }
      path         = if ($obj) { [string]$obj.project_path } else { "" }
      portFileMtime = $portMtime
      portFilePort  = $portValue
    }
  }
  return $items
}

function Write-Line([hashtable]$Row) {
  $json = ($Row | ConvertTo-Json -Depth 6 -Compress)
  Add-Content -Path (Get-LogPath) -Value $json -Encoding utf8
}

# ── 采集 ───────────────────────────────────────────────────────
if ($Watch) {
  $log = Get-LogPath
  $deadline = (Get-Date).AddMinutes($MaxMinutes)
  Write-Host ("采集中 -> " + $log)
  Write-Host ("间隔 " + $IntervalSec + " 秒,最长 " + $MaxMinutes + " 分钟(到点自停)。Ctrl+C 可随时停。")
  while ((Get-Date) -lt $deadline) {
    Write-Line @{ t = (Get-Date).ToUniversalTime().ToString("o"); kind = "tick"; inst = @(Get-Snapshot) }
    Start-Sleep -Seconds $IntervalSec
  }
  Write-Host "到达 -MaxMinutes 上限,已停止采集。"
  exit 0
}

# ── 打标 ───────────────────────────────────────────────────────
if ($Mark) {
  Write-Line @{
    t = (Get-Date).ToUniversalTime().ToString("o"); kind = "mark"
    expected = $Expected; actual = $Actual; inst = @(Get-Snapshot)
  }
  Write-Host ("已打标: 期望 " + $Expected + " / 实际 " + $Actual)
  exit 0
}

# ── 判定 ───────────────────────────────────────────────────────
$log = Get-LogPath
if (-not (Test-Path $log)) { Stop-WithError ("INFRA | 采集日志不存在:" + $log + " —— 先用 -Watch 起采集") }

$rows = @()
foreach ($line in (Get-Content -Path $log -Encoding UTF8)) {
  if (-not $line.Trim()) { continue }
  try { $rows += ($line | ConvertFrom-Json) } catch { }
}
if ($rows.Count -eq 0) { Stop-WithError "INFRA | 采集日志为空" }

# 两侧统一折成 UTC 再相减:DateTime 相减不看 Kind,一侧本地一侧 UTC 就差出整个本地偏移(东八区实发
# 偏 28800 秒,选中相邻行)。行的 t 是 UTC 往返串,5.1 的 ConvertFrom-Json 原样给字符串、7 给 DateTime,
# 两形都接。-Around 不带偏移时按本机时区理解(DateTimeOffset.Parse 缺省即此),带 Z/偏移时按其所写。
function ConvertTo-UtcStamp($Value) {
  if ($Value -is [datetime]) { return $Value.ToUniversalTime() }
  return [DateTimeOffset]::Parse([string]$Value, [System.Globalization.CultureInfo]::InvariantCulture).UtcDateTime
}

$target = $null
if ($Around) {
  try { $want = ConvertTo-UtcStamp $Around } catch { Stop-WithError ("-Around 解析不出时刻:" + $Around) }
  $target = $rows | Where-Object { $_.t } | Sort-Object { [Math]::Abs(((ConvertTo-UtcStamp $_.t) - $want).TotalSeconds) } | Select-Object -First 1
} else {
  $target = $rows | Where-Object { $_.kind -eq "mark" } | Select-Object -Last 1
  if (-not $target) { Stop-WithError "INFRA | 日志里没有标记行 —— 漂移发生时请先用 -Mark 打标,或用 -Around 指定时刻" }
}

$inst = @($target.inst)
if ($inst.Count -eq 0) { Stop-WithError "INFRA | 该时刻没有采到任何实例(status 目录为空?)" }

Write-Host ""
Write-Host ("时刻: " + $target.t)
if ($target.kind -eq "mark") {
  Write-Host ("期望: " + $target.expected)
  Write-Host ("实际: " + $target.actual)
}
Write-Host ""
Write-Host "各实例(按 status mtime 倒序):"
foreach ($i in ($inst | Sort-Object statusMtime -Descending)) {
  Write-Host ("  " + $i.hash + "  port=" + $i.port + "  reloading=" + $i.reloading + "/" + $i.reason +
              "  mtime=" + $i.statusMtime + "  hb=" + $i.heartbeat + "  portFile=" + $i.portFilePort + "@" + $i.portFileMtime)
  Write-Host ("      " + $i.path)
}

$byMtime = @($inst | Sort-Object statusMtime -Descending)[0]
$byHb = @($inst | Sort-Object heartbeat -Descending)[0]
Write-Host ""
Write-Host ("status mtime 最新 = " + $byMtime.hash + "  (" + $byMtime.path + ")")
Write-Host ("heartbeat 最新    = " + $byHb.hash + "  (" + $byHb.path + ")")

if ($target.kind -eq "mark" -and $target.actual) {
  $hitMtime = Test-UnderPath ([string]$target.actual) ([string]$byMtime.path)
  $hitHb = Test-UnderPath ([string]$target.actual) ([string]$byHb.path)
  Write-Host ""
  if ($hitMtime -and -not $hitHb) {
    Write-Host "判定: 落点 = status mtime 最新的那个 —— 指向 read_status_file 的 hash 穿透(unity_connection.py:301)"
  } elseif ($hitHb -and -not $hitMtime) {
    Write-Host "判定: 落点 = heartbeat 最新的那个 —— 指向 _resolve_instance_id 的 using most recent(unity_connection.py:562)"
  } elseif ($hitMtime -and $hitHb) {
    Write-Host "判定: 两个判据指向同一个实例,本次现场区分不开 —— 需要再抓一次两者分叉时的漂移"
  } else {
    Write-Host "判定: 落点既不是 mtime 最新也不是 heartbeat 最新 —— 两条已知回退都解释不了,另有路径(值得贴给上游)"
  }
}
Write-Host ""
exit 0
