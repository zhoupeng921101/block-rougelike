# 看板CLI测试.ps1 — 看板读写机械层的 CLI 层测试(黑盒断言,不依赖内部实现)。
# 为什么在 CLI 层而不在函数层:调用方(槽位领取 / 槽位交付 / 集成交付)只经 CLI 用它,CLI 是
# 真正的契约面;函数层测试绑死实现细节,重构即作废。
# 覆盖:板文件缺失/往返/空板 {} /损坏→.bad/非对象、键推导(数字→devN / 路径→devN /
#   字面自定键不折叠)、登记看板与 topic 保留、close/NO-ROW、list、参数守卫、文件形态参数。
#   板文件解析护栏遥测(读隔离 LOCALAPPDATA,按 JSON 解析):缺失不记 / 解析成 guard-ok / 损坏 degraded / 非对象不记。
# 写落隔离 LOCALAPPDATA(%TEMP% 下),不触真 claude-wf-3b。
# 跑法:看板CLI测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 看板.ps1
# (-Target 供对隔离副本跑同一套契约断言)
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
# PS 5.1 捕获原生进程(含被测子 powershell)输出按 [Console]::OutputEncoding(默认 OEM 代码页)
# 解码,不置 UTF-8 则中文断言全部假失败。
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "看板.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

function Invoke-Board([hashtable]$Opt) {
  $argv = @()
  if ($Opt.ContainsKey('Slot'))  { $argv += @('-Slot',  [string]$Opt.Slot) }
  if ($Opt.ContainsKey('Stage')) { $argv += @('-Stage', [string]$Opt.Stage) }
  if ($Opt.ContainsKey('Topic')) { $argv += @('-Topic', [string]$Opt.Topic) }
  if ($Opt.ContainsKey('Note'))  { $argv += @('-Note',  [string]$Opt.Note) }
  foreach ($k in @('StageFile', 'TopicFile', 'NoteFile')) {
    if ($Opt.ContainsKey($k)) { $argv += @(('-' + $k), [string]$Opt[$k]) }
  }
  if ($Opt.Close) { $argv += '-Close' }
  if ($Opt.List)  { $argv += '-List' }
  $n0 = @(Get-TelRows).Count
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target @argv 2>&1 | ForEach-Object { [string]$_ })
  $code = $LASTEXITCODE
  $guard = @(Get-TelRows | Select-Object -Skip $n0 | Where-Object { $_.guard -eq "board-parse" })
  return @{ code = $code; out = ($lines -join "`n"); guard = $guard }
}

$script:fx = $null
function New-Fixture {
  $script:fx = Join-Path $env:TEMP ("flowtest-board-" + [Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $script:fx | Out-Null
  $env:LOCALAPPDATA = Join-Path $script:fx "AppData"
  return (Join-Path $env:LOCALAPPDATA "claude-wf-3b\board.json")
}
function Get-Row([string]$Path, [string]$Key) {
  if (-not (Test-Path $Path)) { return $null }
  $obj = [System.IO.File]::ReadAllText($Path) | ConvertFrom-Json
  return $obj.$Key
}
function Test-HasKey([string]$Path, [string]$Key) {
  if (-not (Test-Path $Path)) { return $false }
  $obj = [System.IO.File]::ReadAllText($Path) | ConvertFrom-Json
  return [bool]($obj.PSObject.Properties.Name -contains $Key)
}

$oldLad = $env:LOCALAPPDATA
Write-Host "== 看板 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # ---- 板文件 IO ----
  $bp = New-Fixture
  $r = Invoke-Board @{ List = $true }
  Assert-True ($r.code -eq 0 -and $r.out -match "看板为空") "IO1 板文件缺失 -> 看板为空 exit 0"
  Assert-True ($r.guard.Count -eq 0) "IO1b 板文件缺失(走不到解析)-> board-parse 两样都不记"
  Remove-Fixture

  $bp = New-Fixture
  Invoke-Board @{ Slot = "1"; Stage = "实现中"; Topic = "邮件" } | Out-Null
  $row = Get-Row $bp "dev1"
  Assert-True ($row -and $row.stage -eq "实现中" -and $row.topic -eq "邮件" -and $row.note -eq "" -and $row.updatedAt) "IO2 往返:四字段齐备(含中文)"
  Assert-True (-not (Test-Path ($bp + ".tmp"))) "IO2b 原子写:不留 .tmp"
  Remove-Fixture

  $bp = New-Fixture
  Invoke-Board @{ Slot = "1"; Stage = "实现中" } | Out-Null
  $r = Invoke-Board @{ Slot = "1"; Close = $true }
  Assert-True (([System.IO.File]::ReadAllText($bp)).Trim() -eq "{}") "IO3 空板写字面 {}"
  Assert-True ($r.guard.Count -eq 1 -and $r.guard[0].event -eq "guard-ok" -and $r.guard[0].src -eq "看板") ("IO3b 板文件在场且解析成了 -> 记一行 guard-ok(guard board-parse,来源 看板),实得 " + $r.guard.Count)
  Remove-Fixture

  $bp = New-Fixture
  New-Item -ItemType Directory -Force -Path (Split-Path $bp -Parent) | Out-Null
  [System.IO.File]::WriteAllText($bp, "{oops", (New-Object System.Text.UTF8Encoding($false)))
  $r = Invoke-Board @{ List = $true }
  Assert-True ($r.out -match '(?m)^WARN: board\.json 解析失败,按空板重建\(原文件已存 ' -and (Test-Path ($bp + ".bad"))) "IO4 损坏 -> WARN(文案原样)+ 备份 .bad"
  Assert-True ($r.out -match "看板为空") "IO4b 损坏 -> 按空板续跑"
  $g4 = @($r.guard)
  Assert-True ($g4.Count -eq 1 -and $g4[0].event -eq "degraded" -and $g4[0].key -eq "board-parse-failed" -and ([string]$g4[0].detail).StartsWith($bp, [System.StringComparison]::OrdinalIgnoreCase)) ("IO4c 解析失败按空板重建 -> 记一行 degraded(guard board-parse),不记 guard-ok | " + $(if ($g4.Count) { $g4[0].event + " " + $g4[0].detail } else { "无" }))
  Assert-True (@([regex]::Matches($r.out, '(?m)^WARN')).Count -eq 1) "IO4d 只打原来那一行 WARN(入账不另出一行)"
  Remove-Fixture

  $bp = New-Fixture
  New-Item -ItemType Directory -Force -Path (Split-Path $bp -Parent) | Out-Null
  [System.IO.File]::WriteAllText($bp, "[]", (New-Object System.Text.UTF8Encoding($false)))
  $r = Invoke-Board @{ List = $true }
  Assert-True ($r.code -eq 0 -and $r.out -match "看板为空") "IO5 非对象(数组) -> 按空板"
  Assert-True ($r.guard.Count -eq 0) "IO5b 顶层非对象(不打 WARN 的那一支)-> board-parse 两样都不记"
  Remove-Fixture

  # ---- 键推导 ----
  $bp = New-Fixture
  Invoke-Board @{ Slot = "1"; Stage = "实现中" } | Out-Null
  Assert-True (Test-HasKey $bp "dev1") "K1 数字 -> devN"
  Remove-Fixture

  $bp = New-Fixture
  Invoke-Board @{ Slot = "D:\work\block-rougelike-dev2"; Stage = "实现中" } | Out-Null
  Assert-True (Test-HasKey $bp "dev2") "K2 槽位路径 -> devN"
  Remove-Fixture

  $bp = New-Fixture
  Invoke-Board @{ Slot = "mail-dev2"; Stage = "实现中" } | Out-Null
  Assert-True ((Test-HasKey $bp "mail-dev2") -and -not (Test-HasKey $bp "dev2")) "K3 无分隔符自定键不折叠(mail-dev2)"
  Remove-Fixture

  $bp = New-Fixture
  Invoke-Board @{ Slot = "hotfix-x"; Stage = "实现中" } | Out-Null
  Assert-True (Test-HasKey $bp "hotfix-x") "K4 字面自定键"
  Remove-Fixture

  # ---- 登记看板 / 更新 ----
  $bp = New-Fixture
  $r = Invoke-Board @{ Slot = "1"; Stage = "实现中"; Topic = "邮件系统" }
  Assert-True ($r.code -eq 0 -and $r.out -match "BOARD") "U1 登记看板输出 BOARD"
  Remove-Fixture

  $bp = New-Fixture
  Invoke-Board @{ Slot = "1"; Stage = "实现中"; Topic = "原主题" } | Out-Null
  Invoke-Board @{ Slot = "1"; Stage = "交付中" } | Out-Null
  $row = Get-Row $bp "dev1"
  Assert-True ($row.stage -eq "交付中" -and $row.topic -eq "原主题") "U2 省略 -Topic 时保留旧 topic"
  Remove-Fixture

  $bp = New-Fixture
  Invoke-Board @{ Slot = "1"; Stage = "阻塞:等编辑器"; Note = "备注一句" } | Out-Null
  $row = Get-Row $bp "dev1"
  Assert-True ($row.stage -eq "阻塞:等编辑器" -and $row.note -eq "备注一句") "U3 note 与含冒号的中文 stage"
  Remove-Fixture

  # ---- close ----
  $bp = New-Fixture
  Invoke-Board @{ Slot = "1"; Stage = "实现中" } | Out-Null
  $r = Invoke-Board @{ Slot = "1"; Close = $true }
  Assert-True ($r.code -eq 0 -and $r.out -match "CLOSED" -and -not (Test-HasKey $bp "dev1")) "C1 close 清行"
  Remove-Fixture

  $bp = New-Fixture
  $r = Invoke-Board @{ Slot = "1"; Close = $true }
  Assert-True ($r.code -eq 0 -and $r.out -match "NO-ROW") "C2 close 不存在的行 -> NO-ROW exit 0"
  Remove-Fixture

  # ---- list ----
  $bp = New-Fixture
  Invoke-Board @{ Slot = "1"; Stage = "实现中"; Topic = "A" } | Out-Null
  $r = Invoke-Board @{ List = $true }
  Assert-True ($r.code -eq 0 -and $r.out -match "dev1" -and $r.out -match "实现中") "L1 list 打印行"
  Remove-Fixture

  # ---- 参数守卫 ----
  $bp = New-Fixture
  $r = Invoke-Board @{ Slot = "1" }
  Assert-True ($r.code -eq 2 -and $r.out -match "ABORT") "G1 有 slot 无 stage -> ABORT exit 2"
  Remove-Fixture

  $bp = New-Fixture
  $r = Invoke-Board @{}
  Assert-True ($r.code -eq 2 -and $r.out -match "usage") "G2 无参 -> usage exit 2"
  Remove-Fixture

  # ---- 文件形态(会话侧:文本走文件) ----
  $bp = New-Fixture
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  $sf = Join-Path $script:fx "stage.txt"; $tf = Join-Path $script:fx "topic.txt"; $nf = Join-Path $script:fx "note.txt"
  [System.IO.File]::WriteAllText($sf, "阻塞:等用户裁定`n", $utf8)
  [System.IO.File]::WriteAllText($tf, "邮件 `"二期`"", $utf8)
  [System.IO.File]::WriteAllText($nf, "  第一行`r`n`r`n第二行  ", $utf8)
  $r = Invoke-Board @{ Slot = "2"; StageFile = $sf; TopicFile = $tf; NoteFile = $nf }
  $row = Get-Row $bp "dev2"
  Assert-True ($r.code -eq 0 -and $row -and $row.stage -eq "阻塞:等用户裁定" -and $row.topic -eq '邮件 "二期"' -and $row.note -eq "第一行 第二行") "F1 三个文件形态:中文与引号原样入行,多行折成一行"

  $r = Invoke-Board @{ Slot = "2"; Stage = "实现中"; StageFile = $sf }
  Assert-True ($r.code -eq 2 -and $r.out -match "互斥" -and (Get-Row $bp "dev2").stage -eq "阻塞:等用户裁定") "F2 同一项两种形态都给 -> ABORT exit 2,不改行"

  $r = Invoke-Board @{ Slot = "2"; StageFile = (Join-Path $script:fx "nope.txt") }
  Assert-True ($r.code -eq 2 -and $r.out -match "not found") "F3 文件不存在 -> ABORT exit 2"
  Remove-Fixture
}
finally {
  Remove-Fixture
  $env:LOCALAPPDATA = $oldLad
}

Write-Host ""
Exit-TestSuite
