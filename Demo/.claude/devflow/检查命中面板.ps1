# 检查命中面板.ps1 — 客户端自检 / 服务端自检 各道的命中统计与零命中复核候选,外加护栏「疑似恒降级」一栏(只读,零写入)。
# 数据两源:各道脚本头注的「# 准入:」登记(判据正本 = hooks\hook函数库.ps1 Get-GateAdmissionGap),
# 与遥测(<运行态根 WfStateRoot>\telemetry\wf-*.jsonl)。
# 每道给:登记日以来该自检的运行次数、本道命中次数、最近一次命中、登记的退役条件、道耗时 p50/p90。
# 「命中」= 该次 gate-run 的 fails 字段含本道(fails = 本次判违规的全部道,含已跑完的并行道,字段构造 = hook函数库
# Write-GateRunTelemetry);没有 fails 字段的老记录回落到 verdict = FAIL-<Tag>(只认结论点名的那一道)。
# 「道耗时」= gate-run 的 scanms 字段(该道毫秒;并行道含起子进程约一秒),只统计带该字段的运行。
# 「运行次数」按该自检整体计:前面的道先失败时后面的道没跑到,故是上界,零命中判断偏保守(不会误把
# 跑得少的道当成零命中的常客)。
# 复核候选 = 零命中且运行次数 >= -MinRuns:只列出、附退役条件,撤不撤由人裁定(devflow-check 取舍类)。
# 裁定保留的道在其登记行记 Reviewed=<裁定日>(可选字段,判据同在 Get-GateAdmissionGap):候选改按「复核日之后」的
# 运行次数计,不满 -MinRuns 不再列为候选、改列「已复核暂不列」,够数且仍零命中才重新列出。没有这个字段时
# 裁定无处落,同一批零命中的道每次跑面板都原样再列一遍(2026-10-08 八道裁定全留后即如此)。
# 疑似恒降级:护栏在真环境里次次走降级分支、等于没生效(实发:场景备份清理 10 天恒 skipped 无人察觉)。两种分母:
#   带 guard 的降级(hook函数库 Write-Degraded -Guard)按护栏归并:该护栏的 degraded 与 guard-ok(Write-GuardOk,走到
#     且没降级)合起来按时刻取最近 $DegradeWindow 次,降级占比 >= $DegradeRatio 即列出(分母 = 走到该步骤的次数);
#   不带 guard 的按键归并,对照来源脚本的运行记录(entry-verdict 的 entry / gate-run 的 gate / 集成交付 / 单仓提交
#     的结论行)取最近 $DegradeWindow 次运行。这个分母含走不到该步骤的运行(如 槽位领取 的 DENIED / QUEUE / FULL),
#     次次降级的护栏占比也会低于阈值、可能漏报;新接的降级点应带 guard 并在没降级时记 guard-ok。
# 走到次数 / 来源运行记录不足 $DegradeWindow 次的只列次数、暂不判。一个护栏 / 键都没判到时该栏报「未判」,
# 与「判过、没有可疑的」(报「无」并带已判个数)分开:从没走满窗口、或埋点失效的护栏不该读成都已生效。
# 由来:撤过的道次都靠事后手数零命中(206007ad3「800+ 次运行零命中」),而在役的道没有地方看命中。
#
# 用法:检查命中面板.ps1 [-MinRuns <N>]   缺省 300
# 退出码:0(报告);2 配置或自检脚本读不到。
[CmdletBinding(PositionalBinding=$false)]
param([int]$MinRuns = 300)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

$DegradeWindow = 10
$DegradeRatio = 0.8

# 两道自检的扫描数组即道次正本;只抽 File / Tag,不抄第二份清单。
$gates = @(@("客户端自检", "客户端自检.ps1"), @("服务端自检", "服务端自检.ps1"))
$rows = New-Object System.Collections.Generic.List[object]
foreach ($g in $gates) {
  $gp = Join-Path $PSScriptRoot $g[1]
  if (-not (Test-Path -LiteralPath $gp)) { Write-Host ("ABORT 自检脚本读不到:" + $gp); exit 2 }
  foreach ($m in [regex]::Matches([System.IO.File]::ReadAllText($gp), 'File\s*=\s*"([^"]+\.ps1)"\s*;\s*Tag\s*=\s*"([^"]+)"')) {
    $file = $m.Groups[1].Value
    $adm = Read-GateAdmission (Join-Path $PSScriptRoot $file)
    $rows.Add([pscustomobject]@{ Gate = $g[0]; File = $file; Tag = $m.Groups[2].Value
      Since = [string]$adm.Since; Basis = [string]$adm.Basis; Retire = [string]$adm.Retire
      Reviewed = [string]$adm.Reviewed; Runs = 0; RunsAfter = 0; Hits = 0; LastHit = ""
      Ms = (New-Object System.Collections.Generic.List[int]) })
  }
}

# 遥测一次扫完:gate-run 按自检分组记每次运行(日期 / verdict / fails / scanms);各来源脚本的运行时刻、degraded 事件
# 与护栏走到记录(带 guard 的 degraded + guard-ok)另记。只对 gate-run 与 degraded 两类整行解析 JSON(要取嵌套字段),
# 其余记录只用正则取 ts / entry / guard,遥测量大时不拖慢。
$runs = @{ "客户端自检" = New-Object System.Collections.Generic.List[object]; "服务端自检" = New-Object System.Collections.Generic.List[object] }
$srcRuns = @{}
$degraded = @{}
$guards = @{}
function Add-GuardReach([string]$Guard, [string]$Src, [string]$Ts, [string]$Key, [string]$Detail) {
  # 护栏走到一次:$Key 空 = 没降级(guard-ok),非空 = 降级键。
  if (-not $Guard -or -not $Ts) { return }
  if (-not $guards.ContainsKey($Guard)) { $guards[$Guard] = @{ Src = $Src; Ev = (New-Object System.Collections.Generic.List[object]); Detail = "" } }
  $guards[$Guard].Ev.Add([pscustomobject]@{ Ts = $Ts; Key = $Key })
  if ($Key) { $guards[$Guard].Detail = $Detail }
}
function Add-SrcRun([string]$Src, [string]$Ts) {
  if (-not $Src -or -not $Ts) { return }
  if (-not $srcRuns.ContainsKey($Src)) { $srcRuns[$Src] = New-Object System.Collections.Generic.List[string] }
  $srcRuns[$Src].Add($Ts)
}
function Get-JsonStr([string]$Line, [string]$Name) {
  $mm = [regex]::Match($Line, '"' + $Name + '":"([^"]*)"')
  if ($mm.Success) { return $mm.Groups[1].Value }
  return ""
}
$telDir = Join-Path $script:WfStateRoot "telemetry"
if (Test-Path -LiteralPath $telDir) {
  foreach ($tf in (Get-ChildItem -LiteralPath $telDir -Filter "wf-*.jsonl" -File | Sort-Object Name)) {
    foreach ($line in [System.IO.File]::ReadAllLines($tf.FullName)) {
      $ev = Get-JsonStr $line "event"
      if (-not $ev) { continue }
      if ($ev -eq "gate-run") {
        try { $e = $line | ConvertFrom-Json } catch { continue }
        Add-SrcRun ([string]$e.gate) ([string]$e.ts)
        if (-not $runs.ContainsKey([string]$e.gate)) { continue }
        $fails = $null
        if ($e.PSObject.Properties["fails"]) { $fails = @($e.fails | ForEach-Object { [string]$_ }) }
        $ms = @{}
        if ($e.PSObject.Properties["scanms"] -and $e.scanms) {
          foreach ($p in $e.scanms.PSObject.Properties) { $ms[[string]$p.Name] = [int]$p.Value }
        }
        $runs[[string]$e.gate].Add([pscustomobject]@{ Day = ([string]$e.ts).Substring(0, 10); Verdict = [string]$e.verdict; Fails = $fails; Ms = $ms })
      } elseif ($ev -eq "degraded") {
        try { $e = $line | ConvertFrom-Json } catch { continue }
        $k = [string]$e.key
        if (-not $k) { continue }
        if ($e.PSObject.Properties["guard"] -and [string]$e.guard) {
          Add-GuardReach ([string]$e.guard) ([string]$e.src) ([string]$e.ts) $k ([string]$e.detail)
          continue
        }
        if (-not $degraded.ContainsKey($k)) { $degraded[$k] = @{ Src = [string]$e.src; Ts = (New-Object System.Collections.Generic.List[string]); Detail = "" } }
        $degraded[$k].Ts.Add([string]$e.ts)
        $degraded[$k].Detail = [string]$e.detail
      } elseif ($ev -eq "guard-ok") {
        Add-GuardReach (Get-JsonStr $line "guard") (Get-JsonStr $line "src") (Get-JsonStr $line "ts") "" ""
      } elseif ($ev -eq "entry-verdict") {
        Add-SrcRun (Get-JsonStr $line "entry") (Get-JsonStr $line "ts")
      } elseif (($ev -eq "集成交付" -or $ev -eq "单仓提交") -and $line.IndexOf('"verdict":', [System.StringComparison]::Ordinal) -ge 0) {
        Add-SrcRun $ev (Get-JsonStr $line "ts")
      }
    }
  }
}
foreach ($r in $rows) {
  foreach ($x in $runs[$r.Gate]) {
    if ($r.Since -and [string]::CompareOrdinal($x.Day, $r.Since) -lt 0) { continue }
    $r.Runs++
    # 复核日当天的运行不计入「其后」:裁定依据的就是截至那天的数据。
    if (-not $r.Reviewed -or [string]::CompareOrdinal($x.Day, $r.Reviewed) -gt 0) { $r.RunsAfter++ }
    $hit = $false
    if ($null -ne $x.Fails) { $hit = ($x.Fails -contains $r.Tag) } else { $hit = ($x.Verdict -eq ("FAIL-" + $r.Tag)) }
    if ($hit) {
      $r.Hits++
      if ([string]::CompareOrdinal($x.Day, $r.LastHit) -gt 0) { $r.LastHit = $x.Day }
    }
    if ($x.Ms.ContainsKey($r.Tag) -and $x.Ms[$r.Tag] -ge 0) { $r.Ms.Add([int]$x.Ms[$r.Tag]) }
  }
}
function Get-Pct($Values, [double]$P) {
  # 最近秩百分位(秒,一位小数);无数据回 "-"。
  if ($Values.Count -eq 0) { return "-" }
  $a = $Values.ToArray()
  [Array]::Sort($a)
  $i = [int][Math]::Ceiling($P * $a.Length) - 1
  if ($i -lt 0) { $i = 0 }
  return ([Math]::Round($a[$i] / 1000.0, 1)).ToString("0.0", [System.Globalization.CultureInfo]::InvariantCulture)
}

Write-Host ("== 检查命中面板(遥测 " + $telDir + ";复核阈值 MinRuns=" + $MinRuns + ";p50/p90 = 道耗时秒数)==")
foreach ($r in ($rows | Sort-Object Gate, Hits, File)) {
  $last = if ($r.LastHit) { $r.LastHit } else { "-" }
  $rev = if ($r.Reviewed) { "  reviewed " + $r.Reviewed } else { "" }
  $pct = "  p50/p90 " + (Get-Pct $r.Ms 0.5) + "/" + (Get-Pct $r.Ms 0.9) + "s"
  Write-Host (("{0,-6} {1,-18} since {2,-10} runs {3,5}  hits {4,4}  last {5}" -f $r.Gate.Substring(0, 3), $r.File, $r.Since, $r.Runs, $r.Hits, $last) + $rev + $pct)
}
$cands = @($rows | Where-Object { $_.Hits -eq 0 -and $_.RunsAfter -ge $MinRuns })
$held = @($rows | Where-Object { $_.Hits -eq 0 -and $_.Runs -ge $MinRuns -and $_.RunsAfter -lt $MinRuns })
Write-Host ""
if ($cands.Count -eq 0) { Write-Host "复核候选:无(零命中且运行 >= $MinRuns 次的道)" }
else {
  Write-Host ("复核候选(零命中且运行 >= " + $MinRuns + " 次;撤不撤由人对照退役条件裁定):")
  foreach ($c in $cands) {
    $prev = if ($c.Reviewed) { "(上次复核 " + $c.Reviewed + ",其后运行 " + $c.RunsAfter + " 次)" } else { "" }
    Write-Host ("  " + $c.Gate + " " + $c.File + "  runs " + $c.Runs + $prev + "  退役条件:" + $c.Retire)
  }
  Write-Host ("  裁定保留的:在该道头注「# 准入:」行尾记 ` | Reviewed=<裁定日 yyyy-MM-dd>`(已有则改日期),其后运行满 " + $MinRuns + " 次且仍零命中才再列出。")
}
if ($held.Count -gt 0) {
  Write-Host ""
  Write-Host ("已复核暂不列(零命中;复核后运行不足 " + $MinRuns + " 次,够数后重新列为候选):")
  foreach ($h in $held) { Write-Host ("  " + $h.Gate + " " + $h.File + "  复核 " + $h.Reviewed + "  其后运行 " + $h.RunsAfter + " 次") }
}

# ---- 疑似恒降级 ----
$suspect = New-Object System.Collections.Generic.List[string]
$thin = New-Object System.Collections.Generic.List[string]
$needN = [Math]::Ceiling($DegradeRatio * $DegradeWindow)
$judged = 0   # 走满窗口、真判了的护栏 / 键个数
# 带 guard 的:分母 = 该护栏最近走到的 $DegradeWindow 次(按时刻;同一秒内的先后不细分)。
foreach ($g in (Sort-Ordinal ([string[]]@($guards.Keys)))) {
  $gd = $guards[$g]
  $all = @($gd.Ev | Sort-Object { $_.Ts })
  $degN = @($all | Where-Object { $_.Key }).Count
  if ($all.Count -lt $DegradeWindow) {
    $thin.Add("  " + $g + "(护栏)  来源 " + $gd.Src + "  走到 " + $all.Count + " 次  降级 " + $degN + " 次")
    continue
  }
  $judged++
  $win = @($all | Select-Object -Last $DegradeWindow)
  $hitEv = @($win | Where-Object { $_.Key })
  if ($hitEv.Count -ge $needN) {
    $byKey = (@($hitEv | Group-Object Key | Sort-Object Name | ForEach-Object { $_.Name + "×" + $_.Count }) -join " / ")
    $suspect.Add("  " + $g + "(护栏;" + $byKey + ")  来源 " + $gd.Src + "  最近走到 " + $DegradeWindow + " 次里降级 " + $hitEv.Count + " 次  最近一次 " + $hitEv[-1].Ts + "  " + $gd.Detail)
  }
}
# 不带 guard 的:分母退回来源脚本的运行记录(口径与局限见头注)。
foreach ($k in (Sort-Ordinal ([string[]]@($degraded.Keys)))) {
  $d = $degraded[$k]
  $list = $null
  if ($srcRuns.ContainsKey($d.Src)) { $list = $srcRuns[$d.Src] }
  if ($null -eq $list -or $list.Count -lt $DegradeWindow) {
    $n = 0; if ($null -ne $list) { $n = $list.Count }
    $thin.Add("  " + $k + "  来源 " + $d.Src + "  运行 " + $n + " 次  降级 " + $d.Ts.Count + " 次")
    continue
  }
  $judged++
  $sorted = Sort-Ordinal ([string[]]$list.ToArray())
  $upper = $sorted[$sorted.Length - 1]
  $lower = ""
  if ($sorted.Length -gt $DegradeWindow) { $lower = $sorted[$sorted.Length - $DegradeWindow - 1] }
  $hitN = @($d.Ts | Where-Object { [string]::CompareOrdinal($_, $lower) -gt 0 -and [string]::CompareOrdinal($_, $upper) -le 0 }).Count
  if ($hitN -gt $DegradeWindow) { $hitN = $DegradeWindow }
  if ($hitN -ge $needN) {
    $lastTs = (Sort-Ordinal ([string[]]$d.Ts.ToArray()))[-1]
    $suspect.Add("  " + $k + "  来源 " + $d.Src + "  最近 " + $DegradeWindow + " 次运行里 " + $hitN + " 次  最近一次 " + $lastTs + "  " + $d.Detail)
  }
}
$rule = "护栏最近走到 " + $DegradeWindow + " 次 / 无护栏名的键按来源脚本最近 " + $DegradeWindow + " 次运行,降级占 >= " + ($DegradeRatio * 100) + "%"
Write-Host ""
if ($suspect.Count -eq 0 -and $judged -eq 0) { Write-Host ("疑似恒降级:未判(没有护栏 / 键走到满 " + $DegradeWindow + " 次,不能当作护栏都已生效)") }
elseif ($suspect.Count -eq 0) { Write-Host ("疑似恒降级:无(已判 " + $judged + " 个护栏 / 键;" + $rule + ")") }
else {
  Write-Host ("疑似恒降级(" + $rule + ";该护栏在真环境里可能恒不生效,查降级原因):")
  foreach ($s in $suspect) { Write-Host $s }
}
if ($thin.Count -gt 0) {
  Write-Host ""
  Write-Host ("走到次数 / 来源运行记录不足 " + $DegradeWindow + " 次,暂不判(只列次数):")
  foreach ($t in $thin) { Write-Host $t }
}
exit 0
