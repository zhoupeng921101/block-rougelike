# 交付历史.ps1 — devflow 交付历史只读视图(git 派生,零持久态)。
# 定位:交付完成后看板行被清、槽位回 IDLE,但每次交付的记录永久留在客户端 main——
#   claim 空占位提交(subject=`claim:<topic>`,body=领用简报)= 任务锚 + 标识 + 简报。
#   本视图以 claim 提交为锚枚举历次交付,给出 topic / 简报 / 客户端改动统计 / 时间;
#   不写任何存储、不碰看板遥测。
#
# 客户端「改了什么」的区间算法(按交付方式分流):
#   claim 是否落在 main 的 first-parent 链上,区分两种交付——
#   1) 快进(ff)交付:claim 与工作提交直接在 fp 链上。改动 =
#        git log --first-parent --no-merges --numstat <claim>..<下一 fp claim | main> 聚合。
#        --first-parent + --no-merges 跳过「merge main into branch」类合并,排除开发期拉入
#        分支的他处 main 改动(否则端点净差会把它误并入本任务)。
#   2) 合并交付:claim 在 side-branch,经 `Merge branch '<SlotBranchPrefix>N'` 并入 main。改动 =
#        git diff <交付合并>^1 <交付合并> 的净引入(= 分支相对合并前 main 的贡献,天然排除
#        开发期拉入的 main 改动)。交付合并 = ancestry-path 上最靠近 claim 的槽位分支合并。
#   不用「日期相邻 claim」作区间边界:并行槽位交付时不同槽位的 claim 互为兄弟、非祖先后代,
#   该区间拓扑无意义(实测输出为空)。
#
# 服务端(Fantasy)侧:Fantasy main 无 claim 锚(占位只写客户端分支,已核实),故服务端改动
#   按 claim 的 topic 子串匹配 Fantasy 提交主题——best-effort、可能不全(agent 开发期已提交
#   的服务端工作用自有 conventional-commit 主题、不含 topic 时匹配不到),输出显式标注;全栈
#   任务的精确服务端明细以 `git -C <Fantasy> log` 为准。
#
# 已知近似(claim 边界法的固有局限,非本工具缺陷):
#   1) 绕过 devflow 的手工提交(无 claim 锚,如批量 `上传`/目录重排)落在某任务 claim 与下一
#      claim 之间时,会被并入该任务的改动——拓扑上它与任务工作提交无从区分。缓解:文件按改动量
#      降序排,任务真实改动(有实际 ±行)浮前,纯重命名/图集噪声(+0/-0、Bin)沉底并被截断。
#   2) 同一交付合并若并入多个 claim(单分支多任务,罕见)会共享同一 diff;numstat 聚合对同文件
#      多次改动逐次求和(非最终净值)。以上对「看改了哪些文件」的主用途无实质影响。
# 只读 git、不写状态。退出码:0;2 配置加载失败。
#
# 字段分隔用 git 的 %x1f 占位符(而非把 0x1F 原字符放进命令行):控制字符穿 cmd 命令行不可靠。
# 占位符前留一个空格(%H %x1f):紧挨着的 %H%x1f 含成对的 %H%,环境变量 H 存在时会被 cmd /c 展开;
# 空格让成对段变成 %H %,取值处 Trim 掉(守卫见 hook函数库 Assert-CmdSafeArgs)。
[CmdletBinding(PositionalBinding=$false)]
param(
  [int]$Limit = 20,          # 显示最近 N 条交付(默认 20)
  [string]$RepoRoot,         # 客户端仓根(缺省读 flow-config)
  [string]$FantasyRoot,      # Fantasy 仓根(缺省读 flow-config)
  [switch]$NoFantasy         # 跳过服务端 topic 匹配
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

$US = [char]0x1f
$BRIEF_MAX = 6
$FILE_MAX = 40

function Format-Stamp($Ct) {
  try { return [DateTimeOffset]::FromUnixTimeSeconds([int64]$Ct).LocalDateTime.ToString("yyyy-MM-dd HH:mm") }
  catch { return "?" }
}

function Get-Claims([string]$Repo, [string]$Baseline, [int]$N) {
  # 最近 N 个 claim 提交(newest-first):@(@{h;ct;topic})
  # 名额在本侧按「subject 起头」过滤后计,不交给 git 的 -n:--grep 的 ^ 锚的是消息里任一行的行首,
  # 正文行首写着 claim: 的提交照样命中,-n 让它占名额就少显示真锚。--grep 只作预筛;参数整体加引号,
  # 否则 cmd /c 把 ^ 当转义符吃掉,预筛退化成全文子串匹配(实发)。
  $out = New-Object System.Collections.Generic.List[hashtable]
  foreach ($ln in (Get-GitLines $Repo "log $Baseline ""--grep=^claim:"" ""--format=%H %x1f%ct %x1f%s""")) {
    if ($out.Count -ge $N) { break }
    $parts = [string]$ln -split $US
    if ($parts.Count -lt 3) { continue }
    $subj = ($parts[2..($parts.Count - 1)] -join $US)
    if (-not $subj.StartsWith("claim:", [System.StringComparison]::Ordinal)) { continue }
    $out.Add(@{ h = $parts[0].Trim(); ct = $parts[1].Trim(); topic = $subj.Substring("claim:".Length).Trim() })
  }
  return , $out
}

function Get-FirstParentIndex([string]$Repo, [string]$Baseline) {
  # main first-parent 链:@{ Set; Claims(newest->oldest); Pos }
  $set = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::Ordinal)
  $claims = New-Object System.Collections.Generic.List[string]
  foreach ($ln in (Get-GitLines $Repo "log --first-parent $Baseline ""--format=%H %x1f%s""")) {
    $parts = [string]$ln -split $US
    if ($parts.Count -lt 2) { continue }
    [void]$set.Add($parts[0].Trim())
    $subj = ($parts[1..($parts.Count - 1)] -join $US)
    if ($subj.StartsWith("claim:", [System.StringComparison]::Ordinal)) { $claims.Add($parts[0].Trim()) }
  }
  $pos = @{}
  for ($i = 0; $i -lt $claims.Count; $i++) { $pos[$claims[$i]] = $i }
  return @{ Set = $set; Claims = $claims; Pos = $pos }
}

function Find-DeliveryMerge([string]$Repo, [string]$Baseline, [string]$Claim) {
  # ancestry-path 上最靠近 claim 的 `Merge branch '<SlotBranchPrefix>N'` 交付合并;无则空串
  $matched = New-Object System.Collections.Generic.List[string]
  foreach ($ln in (Get-GitLines $Repo "log --merges --ancestry-path ""--format=%H %x1f%s"" $Claim..$Baseline")) {
    $parts = [string]$ln -split $US
    if ($parts.Count -lt 2) { continue }
    $subj = ($parts[1..($parts.Count - 1)] -join $US)
    if ($subj.StartsWith($DELIVER_MERGE_PREFIX, [System.StringComparison]::Ordinal)) { $matched.Add($parts[0].Trim()) }
  }
  if ($matched.Count -gt 0) { return $matched[$matched.Count - 1] }  # newest->oldest,末项最靠近 claim
  return ""
}

function Get-NumstatAgg([string[]]$Lines) {
  # --numstat 行聚合:path -> @{ add; del; bin }
  $agg = @{}
  foreach ($ln in $Lines) {
    $parts = [string]$ln -split "`t"
    if ($parts.Count -lt 3) { continue }
    $a = $parts[0]; $d = $parts[1]
    $p = ($parts[2..($parts.Count - 1)] -join "`t")
    if (-not $p) { continue }
    $binary = ($a -eq "-" -or $d -eq "-")
    if (-not $agg.ContainsKey($p)) { $agg[$p] = @{ add = 0; del = 0; bin = $false } }
    if ($binary) { $agg[$p].bin = $true }
    else {
      if ($a -match '^\d+$') { $agg[$p].add += [int]$a }
      if ($d -match '^\d+$') { $agg[$p].del += [int]$d }
    }
  }
  return $agg
}

function Get-ClientChanges([string]$Repo, [string]$Baseline, [string]$Claim, $Fp) {
  # 回 @{ agg; note }:按 ff / 合并交付分流
  if ($Fp.Set.Contains($Claim)) {
    $j = $Fp.Pos[$Claim]
    $end = if ($null -ne $j -and $j -gt 0) { $Fp.Claims[$j - 1] } else { $Baseline }
    $raw = Get-GitLines $Repo "log --first-parent --no-merges --numstat --format= $Claim..$end"
    return @{ agg = (Get-NumstatAgg $raw); note = "" }
  }
  $m = Find-DeliveryMerge $Repo $Baseline $Claim
  if ($m) {
    # 用 ~1 而非 ^1(同为第一父):^ 是 cmd 的转义字符,cmd /c 剥引号后会吃掉后一个字符
    $raw = Get-GitLines $Repo "diff --numstat $m~1 $m"
    return @{ agg = (Get-NumstatAgg $raw); note = "" }
  }
  return @{ agg = @{}; note = " (交付点未定位)" }
}

function Get-FantasyMatches([string]$FRepo, [string]$FBaseline, [string]$Topic) {
  $out = New-Object System.Collections.Generic.List[hashtable]
  if ($Topic.Length -lt 3) { return , $out }
  foreach ($ln in (Get-GitLines $FRepo "log $FBaseline --fixed-strings ""--grep=$Topic"" ""--format=%H %x1f%s""")) {
    $parts = [string]$ln -split $US
    if ($parts.Count -ge 2 -and $parts[0].Trim()) {
      $out.Add(@{ h = $parts[0].Trim(); subj = ($parts[1..($parts.Count - 1)] -join $US) })
    }
  }
  return , $out
}

function Get-FantasyShortstat([string]$FRepo, [string]$H) {
  foreach ($ln in (Get-GitLines $FRepo "diff --shortstat $H~1 $H")) {   # ~1 同 ^,避 cmd 的 ^ 转义
    $s = ([string]$ln).Trim()
    if ($s) { return $s }
  }
  return ""
}

function Show-Changes($Agg, [string]$Note) {
  if ($Agg.Count -eq 0) {
    Write-Host "  客户端改动: (无 / 仅占位$Note)"
    return
  }
  $nfiles = $Agg.Count
  $tadd = 0; $tdel = 0
  foreach ($v in $Agg.Values) { $tadd += $v.add; $tdel += $v.del }
  Write-Host ("  客户端改动 ({0} 文件, +{1}/-{2}):" -f $nfiles, $tadd, $tdel)
  # 按改动量降序,同量按路径 Ordinal 升序:任务真实改动浮前,纯重命名/图集噪声沉底后被截断。
  # 复合键 + Ordinal 数组排序,不用 Sort-Object:后者的字符串比较是区域感知的(同改动量的
  # 文件其先后随区域设置变),且 PS 5.1 无 -Stable、无法靠二次排序补救。
  # 降序数值用 (10^10-1 - total) 定宽补零,使整键的 Ordinal 升序等价于「量降序 + 路径升序」。
  $keys = New-Object string[] $Agg.Count
  $i = 0
  foreach ($k in $Agg.Keys) {
    $total = $Agg[$k].add + $Agg[$k].del
    $keys[$i] = ('{0:D10}' -f (9999999999 - $total)) + "`0" + $k
    $i++
  }
  [Array]::Sort($keys, [System.StringComparer]::Ordinal)
  foreach ($ck in ($keys | Select-Object -First $FILE_MAX)) {
    # Ordinal 是承重的:String.IndexOf(string) 默认按区域比较,而 ICU(.NET Core / pwsh 7)
    # 把 NUL 当可忽略字符、在位置 0 就"匹配"上,切出的路径整体错位、查不到聚合项。
    # 5.1 的 NLS 恰好返回真实位置,故此处在 5.1 下不发作——但那是把引擎当成了正确性前提。
    $path = $ck.Substring($ck.IndexOf("`0", [System.StringComparison]::Ordinal) + 1)
    $v = $Agg[$path]
    $stat = if ($v.bin -and $v.add -eq 0 -and $v.del -eq 0) { "Bin" } else { "+{0}/-{1}" -f $v.add, $v.del }
    Write-Host ("    {0} | {1}" -f $path, $stat)
  }
  if ($nfiles -gt $FILE_MAX) {
    Write-Host ("    (+{0} 个文件按改动量截断,含重命名/可能的非本任务手工提交,git log 看全)" -f ($nfiles - $FILE_MAX))
  }
}

try { $cfg = Get-FlowConfig }
catch {
  Write-Host "ABORT: flow-config.psd1 load failed - fix it (语法自检.ps1 covers psd1) and rerun"
  exit 2
}

$client = if ($RepoRoot) { $RepoRoot } else { $cfg.RepoRoot }
$fantasy = if ($FantasyRoot) { $FantasyRoot } else { $cfg.FantasyRoot }
$baseC = $cfg.ClientBaseline
$baseF = $cfg.FantasyBaseline
# 交付合并主题前缀按 flow-config SlotBranchPrefix 拼(集成交付 用同一键拼槽位分支名),不写死:
# 前缀一改,写死的字面量会让合并交付全部匹配不到、改动统计静默变空。
if (-not $cfg.SlotBranchPrefix) { Write-Host "ABORT: flow-config.psd1 缺键 SlotBranchPrefix"; exit 2 }
$DELIVER_MERGE_PREFIX = "Merge branch '" + $cfg.SlotBranchPrefix
$lim = [Math]::Max(1, $Limit)
$showFantasy = (-not $NoFantasy) -and [bool]$fantasy -and (Test-Path (Join-Path $fantasy ".git"))

$claims = Get-Claims $client $baseC $lim
if ($claims.Count -eq 0) {
  Write-Host "(无交付历史:$baseC 上没有 claim 提交)"
  exit 0
}
$fp = Get-FirstParentIndex $client $baseC

Write-Host ("== devflow 交付历史(最近 {0} 条;git 派生只读;时间=领用时刻,同会话≈交付)==" -f $claims.Count)
foreach ($c in $claims) {
  Write-Host ""
  $topicShown = if ($c.topic) { $c.topic } else { "(无 topic)" }
  Write-Host ("[{0}] {1}  ({2})" -f (Format-Stamp $c.ct), $topicShown, $c.h.Substring(0, 9))

  # 剥掉 Session-Id trailer(领取时写入的会话身份;对读历史的人是噪音,拆解单源于 Split-ClaimBody)
  $brief = [string](Split-ClaimBody (((Get-GitLinesRaw $client "log -1 --format=%b $($c.h)") -join "`n"))).brief
  if ($brief) {
    $bl = @($brief -split "`n")
    Write-Host "  简报:"
    foreach ($x in ($bl | Select-Object -First $BRIEF_MAX)) { Write-Host ("    " + $x) }
    if ($bl.Count -gt $BRIEF_MAX) {
      Write-Host ("    (+{0} 行,git log -1 --format=%b {1} 看全)" -f ($bl.Count - $BRIEF_MAX), $c.h.Substring(0, 9))
    }
  }

  $r = Get-ClientChanges $client $baseC $c.h $fp
  Show-Changes $r.agg $r.note

  if ($showFantasy) {
    $fm = Get-FantasyMatches $fantasy $baseF $c.topic
    if ($fm.Count -gt 0) {
      Write-Host "  服务端改动(按主题匹配,可能不全 -> 精确以 git -C Fantasy log 为准):"
      foreach ($x in $fm) {
        $fss = Get-FantasyShortstat $fantasy $x.h
        $tail = if ($fss) { "($fss)" } else { "" }
        Write-Host ("    {0} {1}  {2}" -f $x.h.Substring(0, 9), $x.subj, $tail)
      }
    }
  }
}
exit 0
