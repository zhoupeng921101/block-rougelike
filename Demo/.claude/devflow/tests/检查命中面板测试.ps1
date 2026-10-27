# 检查命中面板测试.ps1 — 检查命中面板.ps1 的 CLI 层契约(黑盒断言):复核候选的判定与 Reviewed 字段的抑制 / 复列;
#   命中按 fails 计(老记录回落 verdict)、道耗时 p50/p90、疑似恒降级(带护栏名的按走到次数作分母、guard-ok 计入;
#   不带的按来源运行记录;两种不足 10 次都只列次数;一个都没判到报「未判」,判过且没可疑的报「无」并带已判个数)。
# 背景:零命中的道被裁定保留后无处落裁定,每次跑面板都原样再列为候选;加 Reviewed=<裁定日> 后候选改按
#   复核日之后的运行次数计。登记行字段的格式判据(Get-GateAdmissionGap)由 客户端自检测试 A2 锚定,不在此重复。
# 夹具:面板与 hooks 复制进临时 devflow 目录;两道自检换成只含扫描数组文本的假脚本(面板只按正则抽 File / Tag),
#   各道换成只有登记行的假脚本;遥测写进隔离 LOCALAPPDATA(%TEMP% 下),不读真 claude-wf-3b。
# 跑法:检查命中面板测试.ps1
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
$oldLad = $env:LOCALAPPDATA
$script:fx = Join-Path $env:TEMP ("flowtest-gatehits-" + [Guid]::NewGuid().ToString("N"))
$df = Join-Path $script:fx "devflow"
$bom = New-Object System.Text.UTF8Encoding($true)

function Write-Gate([string]$Name, [string[]]$Scans) {
  # 假自检:只留面板要抽的扫描数组形态(File / Tag 成对)。
  $body = "`$scans = @(`r`n" + (($Scans | ForEach-Object { '  @{ File = "' + $_ + '.ps1"; Tag = "t' + $_ + '" }' }) -join ",`r`n") + ")`r`n"
  [System.IO.File]::WriteAllText((Join-Path $df ($Name + ".ps1")), $body, $bom)
}
function Write-Scan([string]$Name, [string]$Reviewed) {
  $line = "# 准入: Since=2026-09-01 | Basis=存量 | Origin=fake0001 夹具 | Retire=退役条件-" + $Name
  if ($Reviewed) { $line += " | Reviewed=" + $Reviewed }
  [System.IO.File]::WriteAllText((Join-Path $df ($Name + ".ps1")), ($line + "`r`nexit 0`r`n"), $bom)
}
function Invoke-Panel([int]$MinRuns) {
  $lines = @(& (Get-FlowEngine) -NoProfile -File (Join-Path $df "检查命中面板.ps1") -MinRuns $MinRuns 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; lines = $lines }
}
function Get-Section([string[]]$Lines, [string]$HeadPrefix) {
  # 取以 $HeadPrefix 起头的那一行之后、到下一个空行为止的各行。
  $out = @(); $in = $false
  foreach ($l in $Lines) {
    if (-not $in) { if ($l.StartsWith($HeadPrefix, [System.StringComparison]::Ordinal)) { $in = $true }; continue }
    if (-not $l.Trim()) { break }
    $out += $l
  }
  return , $out
}

Write-Host "== 检查命中面板 CLI 测试 =="
try {
  New-Item -ItemType Directory -Force -Path (Join-Path $df "hooks") | Out-Null
  Copy-Item (Join-Path $dfDir "检查命中面板.ps1") $df -Force
  Copy-Item (Join-Path $dfDir "flow-config.psd1") $df -Force
  Copy-Item (Join-Path $dfDir "hooks\*.ps1") (Join-Path $df "hooks") -Force
  Write-Gate "客户端自检" @("a", "b", "c", "d")
  Write-Gate "服务端自检" @("e")
  Write-Scan "a" ""               # 从未复核
  Write-Scan "b" "2026-09-20"     # 复核后只跑了 2 次
  Write-Scan "c" "2026-09-05"     # 复核后又跑了 5 次
  Write-Scan "d" ""               # 有命中
  Write-Scan "e" ""               # 服务端:零运行

  # 遥测:客户端自检 6 次运行(09-02 / 09-10 / 09-12 / 09-20 / 09-21 / 09-22),其中 09-10 那次是 d 道命中,09-20 是 b 的复核日当天。
  $env:LOCALAPPDATA = Join-Path $script:fx "AppData"
  $telDir = Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry"
  New-Item -ItemType Directory -Force -Path $telDir | Out-Null
  $tel = @()
  foreach ($d in @(@("2026-09-02", "PASS"), @("2026-09-10", "FAIL-td"), @("2026-09-12", "PASS"), @("2026-09-20", "PASS"), @("2026-09-21", "PASS"), @("2026-09-22", "STALE"))) {
    $tel += (@{ event = "gate-run"; gate = "客户端自检"; verdict = $d[1]; ts = ($d[0] + "T10:00:00") } | ConvertTo-Json -Compress)
  }
  [System.IO.File]::WriteAllLines((Join-Path $telDir "wf-202609.jsonl"), [string[]]$tel, (New-Object System.Text.UTF8Encoding($false)))

  # ---- P1 阈值 3:a(未复核,6 次)与 c(复核后 5 次)是候选;b(复核后 2 次)暂不列;d 有命中不列 ----
  $r = Invoke-Panel 3
  $cand = Get-Section $r.lines "复核候选"
  $held = Get-Section $r.lines "已复核暂不列"
  $candGates = @($cand | Where-Object { $_ -match '^\s+\S+自检 ' })
  Assert-True ($r.code -eq 0) ("P1 面板 exit 0(实得 " + $r.code + ")")
  Assert-True ($candGates.Count -eq 2 -and @($candGates | Where-Object { $_ -match ' a\.ps1 ' }).Count -eq 1 -and @($candGates | Where-Object { $_ -match ' c\.ps1 ' }).Count -eq 1) ("P1b 候选 = a 与 c:" + ($candGates -join " / "))
  Assert-True (@($candGates | Where-Object { $_ -match ' c\.ps1 .*上次复核 2026-09-05,其后运行 5 次' }).Count -eq 1 -and @($candGates | Where-Object { $_ -match ' a\.ps1 ' -and $_ -notmatch '上次复核' }).Count -eq 1) "P1c 复核过又够数的道注明上次复核日与其后运行次数,未复核的不注"
  Assert-True ($held.Count -eq 1 -and $held[0] -match ' b\.ps1 +复核 2026-09-20 +其后运行 2 次') ("P1d 已复核、其后运行不足阈值的道改列「已复核暂不列」(复核日当天那次不计):" + ($held -join " / "))
  Assert-True (@($cand | Where-Object { $_ -match 'Reviewed=<裁定日 yyyy-MM-dd>' }).Count -eq 1) "P1e 候选段给出记 Reviewed 的写法"
  Assert-True (@($r.lines | Where-Object { $_ -match ' b\.ps1 .*reviewed 2026-09-20' }).Count -eq 1 -and @($r.lines | Where-Object { $_ -match ' d\.ps1 .*hits +1 +last 2026-09-10' }).Count -eq 1) "P1f 明细表带复核日;有命中的道照常计数"

  # ---- P2 阈值 2:b 复核后的运行够数 -> 重新列为候选 ----
  $r = Invoke-Panel 2
  $cand = Get-Section $r.lines "复核候选"
  $held = Get-Section $r.lines "已复核暂不列"
  Assert-True (@($cand | Where-Object { $_ -match ' b\.ps1 .*上次复核 2026-09-20,其后运行 2 次' }).Count -eq 1 -and $held.Count -eq 0) "P2 复核后运行满阈值且仍零命中 -> 重新列为候选"

  # ---- P3 阈值 100:谁都不够数 -> 无候选,也不出「已复核暂不列」段 ----
  $r = Invoke-Panel 100
  Assert-True (@($r.lines | Where-Object { $_ -match '^复核候选:无' }).Count -eq 1 -and @($r.lines | Where-Object { $_ -match '^已复核暂不列' }).Count -eq 0) "P3 运行次数都不到阈值 -> 无候选、无暂不列段"
  Assert-True (@($r.lines | Where-Object { $_ -match '^疑似恒降级:未判' }).Count -eq 1 -and @($r.lines | Where-Object { $_ -match '^疑似恒降级:无' }).Count -eq 0) "P3b 没有护栏 / 键走满 10 次 -> 疑似恒降级:未判(不报「无」)"
  # P3c 有护栏走满 10 次且没降级 -> 无(带已判个数);另放一份遥测,判完即删,不影响后面各例
  $okTel = Join-Path $telDir "wf-202608.jsonl"
  $ok = @()
  foreach ($i in 0..9) { $ok += (@{ event = "guard-ok"; guard = "g-healthy"; src = "来源丙"; ts = ("2026-08-30T10:0" + $i + ":00") } | ConvertTo-Json -Compress) }
  [System.IO.File]::WriteAllLines($okTel, [string[]]$ok, (New-Object System.Text.UTF8Encoding($false)))
  $r = Invoke-Panel 100
  [System.IO.File]::Delete($okTel)
  Assert-True (@($r.lines | Where-Object { $_ -match '^疑似恒降级:无\(已判 1 个' }).Count -eq 1 -and @($r.lines | Where-Object { $_ -match 'g-healthy' }).Count -eq 0) ("P3c 护栏走满 10 次且没降级 -> 无(已判 1 个),不进只列次数段:" + (@($r.lines | Where-Object { $_ -match '疑似恒降级' }) -join " / "))
  # P3d 不带 guard 的键:来源运行满 10 次、降级只 2 次 -> 也算判过,报无(已判 1 个);同法另放一份遥测
  $ok = @()
  foreach ($i in 0..9) { $ok += (@{ event = "entry-verdict"; entry = "来源丁"; verdict = "ACQUIRED"; ts = ("2026-08-30T11:0" + $i + ":00") } | ConvertTo-Json -Compress) }
  foreach ($i in 1..2) { $ok += (@{ event = "degraded"; key = "k-rare"; src = "来源丁"; detail = "x"; ts = ("2026-08-30T11:0" + $i + ":30") } | ConvertTo-Json -Compress) }
  [System.IO.File]::WriteAllLines($okTel, [string[]]$ok, (New-Object System.Text.UTF8Encoding($false)))
  $r = Invoke-Panel 100
  [System.IO.File]::Delete($okTel)
  Assert-True (@($r.lines | Where-Object { $_ -match '^疑似恒降级:无\(已判 1 个' }).Count -eq 1 -and @($r.lines | Where-Object { $_ -match 'k-rare' }).Count -eq 0) ("P3d 不带 guard 的键按来源运行满 10 次判过 -> 无(已判 1 个):" + (@($r.lines | Where-Object { $_ -match '疑似恒降级' }) -join " / "))

  # ---- 新形态遥测:fails / scanms / entry-verdict / degraded(换一份遥测,上面各例的数据不再参与)----
  [System.IO.File]::Delete((Join-Path $telDir "wf-202609.jsonl"))
  $tel = @()
  # 客户端 5 次:3 次 fails = [ta, tc](结论点名 ta,并行道 tc 同次判违规);1 次老记录无 fails、verdict = FAIL-tb;1 次 PASS。
  foreach ($i in 1..3) {
    $tel += (@{ event = "gate-run"; gate = "客户端自检"; verdict = "FAIL-ta"; fails = @("ta", "tc"); scanms = @{ ta = (1000 * $i); tb = 2000 }; ts = ("2026-10-0" + $i + "T09:00:00") } | ConvertTo-Json -Compress)
  }
  $tel += (@{ event = "gate-run"; gate = "客户端自检"; verdict = "FAIL-tb"; ts = "2026-10-04T09:00:00" } | ConvertTo-Json -Compress)
  $tel += (@{ event = "gate-run"; gate = "客户端自检"; verdict = "PASS"; ts = "2026-10-05T09:00:00" } | ConvertTo-Json -Compress)
  # 槽位领取 12 次运行(entry-verdict);k-always 在最近 10 次里次次出现,k-rare 只 3 次,k-orphan 的来源没有运行记录。
  foreach ($i in 0..11) {
    $ts = "2026-10-06T10:" + $i.ToString("00", [System.Globalization.CultureInfo]::InvariantCulture) + ":00"
    $tel += (@{ event = "entry-verdict"; entry = "槽位领取"; verdict = "ACQUIRED"; ts = $ts } | ConvertTo-Json -Compress)
    if ($i -ge 2) { $tel += (@{ event = "degraded"; key = "k-always"; src = "槽位领取"; detail = "refused:x"; ts = $ts } | ConvertTo-Json -Compress) }
    if ($i -ge 9) { $tel += (@{ event = "degraded"; key = "k-rare"; src = "槽位领取"; detail = "y"; ts = $ts } | ConvertTo-Json -Compress) }
    $tel += (@{ event = "degraded"; key = "k-orphan"; src = "无此来源"; detail = "z"; ts = $ts } | ConvertTo-Json -Compress)
  }
  # 带护栏名的(来源 来源乙,运行 20 次,只有隔一次的 10 次走到护栏):
  #   g-sparse 走到的 10 次次次降级 —— 按来源运行计只有 10 次里 5 次,按走到计是 10 次里 10 次;
  #   g-mixed 走到 15 次(12 次降级),最近 10 次里 7 次降级、3 次 guard-ok —— guard-ok 不计进分母的话最近 10 次全是降级;
  #   g-few 只走到 5 次(全降级),只列次数。
  foreach ($i in 0..19) {
    $ts = "2026-10-07T11:" + $i.ToString("00", [System.Globalization.CultureInfo]::InvariantCulture) + ":00"
    $tel += (@{ event = "entry-verdict"; entry = "来源乙"; verdict = "DENIED"; ts = $ts } | ConvertTo-Json -Compress)
    if ($i % 2 -eq 1) { $tel += (@{ event = "degraded"; key = "gk-sparse"; guard = "g-sparse"; src = "来源乙"; detail = "sparse-x"; ts = $ts } | ConvertTo-Json -Compress) }
  }
  foreach ($i in 0..14) {
    $ts = "2026-10-07T12:" + $i.ToString("00", [System.Globalization.CultureInfo]::InvariantCulture) + ":00"
    if ($i -in @(7, 11, 14)) { $tel += (@{ event = "guard-ok"; guard = "g-mixed"; src = "来源乙"; ts = $ts } | ConvertTo-Json -Compress) }
    else { $tel += (@{ event = "degraded"; key = "gk-mixed"; guard = "g-mixed"; src = "来源乙"; detail = "m"; ts = $ts } | ConvertTo-Json -Compress) }
  }
  foreach ($i in 0..4) {
    $tel += (@{ event = "degraded"; key = "gk-few"; guard = "g-few"; src = "来源乙"; detail = "f"; ts = ("2026-10-07T13:0" + $i + ":00") } | ConvertTo-Json -Compress)
  }
  [System.IO.File]::WriteAllLines((Join-Path $telDir "wf-202610.jsonl"), [string[]]$tel, (New-Object System.Text.UTF8Encoding($false)))
  $r = Invoke-Panel 100

  # ---- P4 命中按 fails 计(含并行道),老记录没有 fails 时回落到 verdict 的道名 ----
  Assert-True (@($r.lines | Where-Object { $_ -match ' a\.ps1 .*hits +3 ' }).Count -eq 1 -and @($r.lines | Where-Object { $_ -match ' c\.ps1 .*hits +3 ' }).Count -eq 1) "P4 fails 里的每道都计命中(c 是同次判违规的并行道,结论没点名它)"
  Assert-True (@($r.lines | Where-Object { $_ -match ' b\.ps1 .*hits +1 +last 2026-10-04' }).Count -eq 1 -and @($r.lines | Where-Object { $_ -match ' d\.ps1 .*hits +0 ' }).Count -eq 1) "P4b 无 fails 的老记录按 verdict 的道名计;没命中的道 0"

  # ---- P5 道耗时 p50/p90(scanms,秒)----
  Assert-True (@($r.lines | Where-Object { $_ -match ' a\.ps1 .*p50/p90 2\.0/3\.0s' }).Count -eq 1 -and @($r.lines | Where-Object { $_ -match ' b\.ps1 .*p50/p90 2\.0/2\.0s' }).Count -eq 1 -and @($r.lines | Where-Object { $_ -match ' d\.ps1 .*p50/p90 -/-s' }).Count -eq 1) "P5 道耗时按 scanms 取 p50/p90;没有数据的道记 -"

  # ---- P6 疑似恒降级(不带护栏名的键):来源最近 10 次运行里占比 >= 80% 才列;来源没有运行记录的只列次数 ----
  $sus = Get-Section $r.lines "疑似恒降级("
  $thin = Get-Section $r.lines "走到次数 / 来源运行记录不足"
  $susK = @($sus | Where-Object { $_ -match '^\s+k-' })
  Assert-True ($susK.Count -eq 1 -and $susK[0] -match 'k-always +来源 槽位领取 +最近 10 次运行里 10 次' -and $susK[0] -match 'refused:x') ("P6 k-always(最近 10 次里 10 次)列为疑似恒降级:" + ($sus -join " / "))
  Assert-True (@($r.lines | Where-Object { $_ -match 'k-rare' }).Count -eq 0) "P6b k-rare(10 次里 3 次)不列"
  Assert-True (@($thin | Where-Object { $_ -match '^\s+k-orphan +来源 无此来源 +运行 0 次 +降级 12 次' }).Count -eq 1) ("P6c 来源无运行记录的键只列次数、不判:" + ($thin -join " / "))

  # ---- P7 带护栏名的降级:分母 = 该护栏最近走到的 10 次(degraded + guard-ok),不看来源脚本的运行次数 ----
  Assert-True (@($sus | Where-Object { $_ -match '^\s+g-sparse\(护栏;gk-sparse×10\) +来源 来源乙 +最近走到 10 次里降级 10 次' -and $_ -match 'sparse-x' }).Count -eq 1) ("P7 走到就降级的护栏列出(按来源运行计只有一半,会漏报):" + ($sus -join " / "))
  Assert-True (@($r.lines | Where-Object { $_ -match 'g-mixed' }).Count -eq 0) "P7b guard-ok 计进分母:最近 10 次走到里 7 次降级,不列也不进只列次数段"
  Assert-True (@($thin | Where-Object { $_ -match '^\s+g-few\(护栏\) +来源 来源乙 +走到 5 次 +降级 5 次' }).Count -eq 1) ("P7c 走到不足 10 次的护栏只列次数:" + ($thin -join " / "))
  Assert-True (@($r.lines | Where-Object { $_ -match '^\s+gk-' }).Count -eq 0) "P7d 带护栏名的键不再按键走来源运行记录那一路"
}
finally {
  $env:LOCALAPPDATA = $oldLad
  Remove-Fixture
}

Write-Host ""
Exit-TestSuite
