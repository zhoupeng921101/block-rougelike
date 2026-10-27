# 漂移取证测试.ps1 — 漂移取证.ps1 -Report 的 CLI 层契约测试(黑盒断言,日志夹具落 %TEMP%,零 git)。
# 覆盖:-Around 按真实时刻选行(日志 t 是 UTC ISO 串、-Around 是不带偏移的本地时刻,两侧须同一时基比较)/
#   -Around 带 Z 的 UTC 串同样命中 / 无 -Around 取最后一条标记行 / 日志缺失 INFRA exit 2。
# 时区依赖:错时基的缺陷只在本机时区非 UTC 时显形(偏移量 = 本地 UTC 偏移);UTC 机上 A1 修前修后都过。
# 跑法:漂移取证测试.ps1 [-Target <实现路径>]   缺省 = 上级目录的 漂移取证.ps1
[CmdletBinding(PositionalBinding=$false)]
param([string]$Target = "")
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "漂移取证.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-drift-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

function Invoke-Report([string]$Log, [string]$Around) {
  $argv = @('-Report', '-LogPath', $Log)
  if ($Around) { $argv += @('-Around', $Around) }
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target @argv 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}

# 一行采集记录:t 取 UTC 往返格式(与 -Watch/-Mark 写入同形),inst 放一个可辨认的实例。
function New-Row([datetime]$Utc, [string]$Kind, [string]$Hash) {
  $row = [ordered]@{
    t = $Utc.ToString("o"); kind = $Kind
    inst = @([ordered]@{ hash = $Hash; statusMtime = $Utc.ToString("o"); port = "6400"; reloading = $false; reason = "";
                         heartbeat = $Utc.ToString("o"); path = "D:/fx/$Hash/Demo"; portFileMtime = ""; portFilePort = "" })
  }
  if ($Kind -eq "mark") { $row.expected = "E@$Hash"; $row.actual = "D:/fx/$Hash/Demo/Assets" }
  return ($row | ConvertTo-Json -Depth 6 -Compress)
}

Write-Host "== 漂移取证 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # 三行相隔 8 小时(= 东八区偏移):错时基时选中的会是相邻行,不会落回正确行。
  $base = [datetime]::SpecifyKind([datetime]"2026-08-25T04:00:00", [System.DateTimeKind]::Utc)
  $log = Join-Path $script:fx "drift.jsonl"
  $rows = @(
    (New-Row $base "tick" "aaaa1111"),
    (New-Row $base.AddHours(8) "tick" "bbbb2222"),
    (New-Row $base.AddHours(16) "mark" "cccc3333")
  )
  [System.IO.File]::WriteAllLines($log, [string[]]$rows, (New-Object System.Text.UTF8Encoding($false)))

  # A1 -Around 给本地时刻(无偏移),须选中与之同一瞬间的 B 行
  $aroundLocal = $base.AddHours(8).ToLocalTime().ToString("yyyy-MM-ddTHH:mm:ss")
  $r = Invoke-Report $log $aroundLocal
  Assert-True ($r.code -eq 0 -and $r.out -match 'bbbb2222' -and $r.out -notmatch 'aaaa1111|cccc3333') "A1 -Around 本地时刻 -> 选中同一瞬间的行(不偏本地 UTC 偏移)"

  # A2 -Around 给带 Z 的 UTC 串,同样选中 B 行
  $r = Invoke-Report $log $base.AddHours(8).ToString("yyyy-MM-ddTHH:mm:ssZ")
  Assert-True ($r.code -eq 0 -and $r.out -match 'bbbb2222' -and $r.out -notmatch 'aaaa1111|cccc3333') "A2 -Around UTC 串 -> 选中同一瞬间的行"

  # A3 -Around 落在两行之间偏 A 一侧,选最近的 A 行
  $r = Invoke-Report $log $base.AddHours(1).ToLocalTime().ToString("yyyy-MM-ddTHH:mm:ss")
  Assert-True ($r.code -eq 0 -and $r.out -match 'aaaa1111' -and $r.out -notmatch 'bbbb2222|cccc3333') "A3 -Around 两行之间 -> 取最近行"

  # A4 无 -Around:取最后一条标记行并出判定
  $r = Invoke-Report $log ""
  Assert-True ($r.code -eq 0 -and $r.out -match 'cccc3333' -and $r.out -match '判定') "A4 缺省取最后标记行并判定"

  # A5 日志缺失 -> INFRA exit 2
  $r = Invoke-Report (Join-Path $script:fx "missing.jsonl") ""
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "A5 日志缺失 -> INFRA exit 2"
}
finally { Remove-Fixture }

Write-Host ""
Exit-TestSuite
