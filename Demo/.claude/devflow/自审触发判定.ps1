# 自审触发判定.ps1 - 交付前自审的五项触发条件,由脚本判而不是由会话逐条自问。
# 判的是「本轮要不要做 X」,不是「X 做得对不对」——后者归各 gate 道次。故本脚本恒 exit 0
# (INFRA 与 -CheckRuleTable 模式除外):它是判定器不是拦截器,拦截误判会把流程堵死,而漏一次触发只是回到没有它的状态。
# 五项里只有 FIX-QUALIFY 另有拦截点:它的产物就是提交正文,判据(校验库 Get-FixQualifyGap)由
# 槽位交付.ps1 在入口同源前置校验,缺则 DENIED-qualify;本脚本这一行仍只报不拦。
# 第五项 RULES 点名本轮改动面命中的按需篇:每篇一行 `RULES : required <篇路径> <- <命中文件>`(同篇多个命中只列
# 第一个并注明另有几个),一篇没中则一行 `RULES : not-required`。判据表正本 = 校验库 `$script:RuleReadTable`(路径判据
# 看改动面,内容判据看改动到的 .cs / .prefab 的新增行),与 槽位领取 的「开工前读」共用;表外的面仍按 CLAUDE.md 路由表自认。
# 处置正本 = devflow 卡第三步「自审」。
# -CheckRuleTable(只读自检,与其余参数中只认 -ProjectDir / -FantasyRoot):核判据表没有随改名漂移——每篇存在、路径 /
# 目录 / 内容判据的每个元素(一支)在仓内已跟踪文件里至少命中一个(内容判据在 .cs 只认代码)、没有元素含顶层 `|`
# (口径见 校验库 Get-RuleReadTableGap 头注)。缺省核主仓(flow-config RepoRoot 下的 Demo 与 FantasyRoot);
# 给 -ProjectDir / -FantasyRoot 则核所给的树(篇也从
# -ProjectDir 下找)。两端都核,服务端仓不在(如不带 Fantasy 的 Claude Code worktree)判 INFRA,不降成只核一端。每个缺口
# 一行 `RULE-TABLE GAP : ...`,末行 `RULE-TABLE : PASS (...)` 或 `RULE-TABLE : FAIL (N gap(s))`。调用方 = devflow-check 检查项 6。
#
# 为什么值得成脚本:前四项的触发条件原先写在 devflow 卡里由会话每次自己比对
# (「改动触及 server 鉴权 / 网络 / 持久化…」「新增 Unity 资产时…」),而判错没有任何显形路径
# ——安全审查漏做不报错、不留痕,下一个读代码的人也看不出这轮审没审过。改动面在自审那一刻
# 已经是 diff,机器判得比人稳,且顺带把命中的具体文件列出来,省掉「审哪里」的二次判断。
#
# 事前触发(要不要调 devflow-ui、传不传 -NoUnity、是不是修已合并缺陷)判不了:那些在需求层
# 决定,diff 尚不存在。本脚本只覆盖事后触发;按需篇的事前点名由 槽位领取「开工前读」按同一张判据表做。
#
# 改动面 = 相对基线**分叉点**的全部差异(已提交 + 工作区未提交 + untracked),因为自审发生在提交之前。
# 分叉点(merge-base)而不是基线分支的 tip:两者只要不同步,tip 差集就会混进不属于本轮的改动 ——
# 主干有本轮之后合入的提交时混入别人的改动,本地基线分支有未推送提交时混入那些提交。
# 两个方向都实发过(2026-08-23 同一天两次:先是 origin/main 超前槽位,后是本地 main 超前 origin/main),
# 症状相同——UI-EVIDENCE 报出本轮根本没碰过的 prefab、安全审查范围虚高到十几个没改的文件,
# 于是「审哪里」这个本该由脚本消掉的二次判断又回到了人身上。
#
# 出口码: 0 判定完成(输出五项判定,无论 required 与否);-CheckRuleTable 模式 = 判据表无缺口
#         1 仅 -CheckRuleTable 模式:判据表有缺口(逐条列出)
#         2 INFRA(路径解析不出 / 不是 git 仓 / git 查询失败 / 参数组合不认 / flow-config 缺基线键)。untracked 文件读不到(被占用、无权限)
#           不算:RULES 内容判据跳过该文件并打一行 WARN,其余照判。
# 遥测:diff 基点取分叉点是护栏步骤,两端各算一步(护栏名 self-review-diffbase/client、self-review-diffbase/server):
#   算出分叉点记 guard-ok;算不出而回落按分支 tip 比(结果可能虚高)照打原 WARN、经 hook函数库 Write-Degraded 记 degraded
#   (key self-review-diffbase-fallback)。-CheckRuleTable、参数 / 配置 INFRA、该端路径不在而跳过的,两样都不记。
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Slot,                             # 槽位通道:1..flow-config SlotCount,双仓路径按 flow-config 推导
  [string]$ProjectDir,                       # 主工程通道:显式客户端 Demo
  [string]$FantasyRoot,                      # 主工程通道:显式服务端仓根(可省)
  [string]$MessageFile,                      # 提交信息文件(可省;省则跳过 FIX-QUALIFY 判定)
  [switch]$CheckRuleTable                    # 只读自检按需篇判据表(见头注),不判本轮改动
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\校验库.ps1")   # 自带 dot-source hook函数库;FIX-QUALIFY 判据与按需篇判据表在这里

# ---- 判据表(改判据改这里;每条都要能说出「命中意味着什么」) ----

# 安全面:路径模式。正本口径 = devflow 卡 references/security-review.md 的单机安全面:存档读写、
# 由外部字符串拼路径、外部输入(存档 / 配置 / 导入文件)反序列化,外加调试特权入口与(将来接的)平台鉴权 / 网络。
# 这里宽于窄:required 的代价是审一遍 diff,漏判的代价是漏审。
$SecurityPathRules = @(
  @{ Re = '[/\\](Save|Saves|Persistence|Storage)[/\\]';   Why = 'save data read / write' },
  @{ Re = '(Save|Persist)[A-Za-z]*\.cs$';                 Why = 'save data code' },
  @{ Re = '[/\\](Gm|Cheat|DevTools)[/\\]';                Why = 'privileged / debug path (must not ship enabled)' },
  @{ Re = '[/\\](Account|Auth|Login|Token|Session)[/\\]'; Why = 'authentication / session' },
  @{ Re = '[/\\](Network|Net)[/\\]';                      Why = 'network layer' }
)
# 安全面:内容模式(只扫改动到的 .cs,量小)。抓的是路径看不出的文件读写、外部数据反序列化与起外部进程。
# 要求后随 `(` 且前有词界:只按方法调用计,形似的自有方法名不误中。
$SecurityContentRe = 'PlayerPrefs\.|\bFile\.(WriteAll|AppendAll|ReadAll|Open|Create|Delete|Move|Copy|Replace)\w*\s*\(|\bDirectory\.(Delete|Move)\s*\(|\bJsonConvert\.DeserializeObject\b|\bJsonUtility\.(FromJson|FromJsonOverwrite)\b|\bBinaryFormatter\b|\bProcess\.Start\s*\('

# 新增资产:这些扩展名的新文件需要活编辑器把导入与派生物(atlas 重序列化等)收敛后再交付。
$NewAssetExtRe = '\.(prefab|png|jpg|jpeg|tga|psd|asset|mat|anim|controller|bytes|cs|ttf|otf|shader|spriteatlas)$'
# UI 目视证据:prefab 动过就要目视,不分新增与修改。
$UiEvidenceExtRe = '\.prefab$'
# 修复类定性(FIX-QUALIFY)的判据不在本表:正本 = hooks/校验库.ps1 Get-FixQualifyGap,与 槽位交付 共用。
# 按需篇点名(RULES)的判据也不在本表:正本 = hooks/校验库.ps1 $script:RuleReadTable,与 槽位领取「开工前读」共用。

# ---- 改动面采集 ----

# `--untracked-files=all` 是判据成立的前提,不是可选优化:缺省的 normal 模式对整个未跟踪的
# 目录只报目录名一行(`?? Assets/Gate/`),不展开到文件。而新资产恰恰常常连同新目录一起出现
# ——目录名既没有扩展名也未必含关键词,四项判定于是对「新建整个功能目录」这类改动全部静默漏判。
# `-c core.quotepath=false` 同为前提:缺省下 git 把非 ASCII 路径输出成带引号的八进制转义串
# (`"Demo/Assets/\344\270\255.png"`),去引号也只剩转义串,且已提交 diff 那一路原先连引号都
# 不去——扩展名判据被尾引号挡住,中文名 prefab / png 进了已提交 diff 就让 UI-EVIDENCE / ASSET-SETTLE
# 静默漏判,而本工程美术资产大量是中文名。
$QuoteOff = "-c core.quotepath=false"
$PorcelainArgs = "$QuoteOff status --porcelain --untracked-files=all"

# 两个采集函数的拼装与规整(diff 行去引号 + porcelain 解析 + Ordinal 去重排序)都交给共享库
# Get-RepoFootprint,与 槽位领取内核 同口径,不在本脚本另留一份副本。
function Get-ChangedPaths([string]$Root, [string]$Baseline) {
  # 相对基线的全部改动面:已提交 + 工作区已跟踪(`diff <baseline>` 比的是工作区 vs baseline,
  # 两者一次覆盖)+ porcelain 全部行(含 untracked)。
  if (-not (Test-Path (Join-Path $Root ".git"))) { return $null }
  $tracked = Get-GitLinesChecked $Root "$QuoteOff diff --name-only $Baseline"
  # 先赋值再 `, ` 包装(同 hook函数库 Sort-* 的写法)。`return , @(Get-RepoFootprint ...)`
  # 会多套一层:被调函数自身已带 `, ` 包装,在表达式上下文里那层不解开,调用方拿到的是
  # 「长度 1、元素是数组」——foreach 于是把整个数组当成一个路径,后续 Join-Path 就地炸。
  $all = Get-RepoFootprint $tracked (Get-GitLinesChecked $Root $PorcelainArgs)
  return , @($all)
}

function Get-AddedPaths([string]$Root, [string]$Baseline) {
  # 只要新增(A)与 untracked——落定派生物针对的是新资产,改已有资产不触发。
  # porcelain 先滤到 `??` 行再交给 Get-RepoFootprint,dirty 一侧于是只剩 untracked。
  if (-not (Test-Path (Join-Path $Root ".git"))) { return @() }
  $added = Get-GitLinesChecked $Root "$QuoteOff diff --name-only --diff-filter=A $Baseline"
  $untracked = @((Get-GitLinesChecked $Root $PorcelainArgs) | Where-Object { $_ -match '^\?\?' })
  $all = Get-RepoFootprint $added $untracked
  return , @($all)
}

function Get-DiffBase([string]$Root, [string]$Baseline, [string]$Side) {
  # 本仓当前 HEAD 与基线分支的分叉点,作 diff 基点(理由见文件头「改动面」条)。$Side = client / server,只用于护栏名。
  # 回落 $Baseline 而不是报错:算不出分叉点的成因是基线分支不存在、仓是浅克隆、或 HEAD 与它
  # 无共同祖先——都不该让判定器整个失效。判定器不是拦截器,退回旧行为(可能虚高)也好过不判。
  # 回落即护栏降级(头注「遥测」条):原 WARN 不以「WARN 」起头,Write-Degraded 自带的那行以 6>$null 收掉,只取遥测。
  $guard = "self-review-diffbase/" + $Side
  $base = Get-GitOne $Root "merge-base HEAD $Baseline"
  if ($base) { Write-GuardOk $guard; return $base }
  Write-Host "SELF-REVIEW TRIGGERS : WARN - 算不出 HEAD 与 '$Baseline' 的分叉点($Root),回落按分支 tip 比 diff"
  Write-Degraded "self-review-diffbase-fallback" ($Root + " | baseline=" + $Baseline) -Guard $guard 6>$null
  return $Baseline
}

function Add-AddedContent([string]$Root, [string]$Baseline, [string]$Side, [hashtable]$Map) {
  # RULES 内容判据的输入:相对分叉点新增的行,按文件归进 $Map(键 "<Side>|<仓根相对路径>",值 List[string]),只收
  # .cs / .prefab(校验库 RuleReadContentExtRe)。只看新增行而不看整份文件:文件里早就有、本轮没碰的写法不算本轮触发。
  # 已跟踪改动取 `diff -U0` 的 + 行;头部形态钉死同 校验库 Get-AddedLinesInDomain(noprefix / mnemonicprefix 会让
  # `+++ b/` 失配,quotepath 会把中文路径转义);按「diff --git → +++ → @@」逐段走,hunk 里以 +++ 开头的新增行
  # 不会被认成文件头。含空格的路径 git 在 +++ 行尾补一个 TAB,去掉。untracked 文件整份算新增;读不到的跳过并打 WARN,
  # 不往上抛——这里在调用方的 INFRA try 里,一个被占用的文件不该让五项判定全部作废(同脚本 SECURITY 内容扫描读不到也是跳过)。
  $diff = Get-GitLinesChecked $Root ("-c diff.noprefix=false -c diff.mnemonicprefix=false $QuoteOff diff --no-color --no-ext-diff -U0 " + $Baseline + ' -- "*.cs" "*.prefab"')
  $cur = $null; $inHunk = $false
  foreach ($l in $diff) {
    if ($l.StartsWith("diff --git ", [System.StringComparison]::Ordinal)) { $cur = $null; $inHunk = $false; continue }
    if (-not $inHunk) {
      if ($l.StartsWith("+++ ", [System.StringComparison]::Ordinal)) {
        $p = $l.Substring(4).TrimEnd("`t").Trim('"')
        $cur = $null
        if ($p.StartsWith("b/", [System.StringComparison]::Ordinal)) {
          $cur = $Side + "|" + $p.Substring(2)
          if (-not $Map.ContainsKey($cur)) { $Map[$cur] = New-Object System.Collections.Generic.List[string] }
        }
      } elseif ($l.StartsWith("@@", [System.StringComparison]::Ordinal)) { $inHunk = $true }
      continue
    }
    if ($l.StartsWith("@@", [System.StringComparison]::Ordinal)) { continue }
    if ($cur -and $l.StartsWith("+", [System.StringComparison]::Ordinal)) { $Map[$cur].Add($l.Substring(1)) }
  }
  $untracked = @((Get-GitLinesChecked $Root $PorcelainArgs) | Where-Object { $_ -match '^\?\?' })
  foreach ($p in (Get-PorcelainPaths $untracked)) {
    if ($p -notmatch $script:RuleReadContentExtRe) { continue }
    $full = Join-Path $Root $p
    if (-not [System.IO.File]::Exists($full)) { continue }
    $key = $Side + "|" + $p
    $list = New-Object System.Collections.Generic.List[string]
    try { foreach ($x in [System.IO.File]::ReadAllLines($full)) { $list.Add($x) } }
    catch { Write-Host ("SELF-REVIEW TRIGGERS : WARN - 读不到 untracked 文件 " + $p + "(" + $_.Exception.Message.Trim() + "),RULES 内容判据跳过它"); continue }
    $Map[$key] = $list
  }
}

$cfg = Get-FlowConfig

# ---- -CheckRuleTable:只读自检按需篇判据表(语义见头注),不判本轮改动 ----
if ($CheckRuleTable) {
  if ($Slot -or $MessageFile) { Write-Host "SELF-REVIEW TRIGGERS : INFRA - -CheckRuleTable 只认 -ProjectDir / -FantasyRoot"; exit 2 }
  $docRoot = if ($ProjectDir) { $ProjectDir } else { Join-Path $cfg.RepoRoot "Demo" }
  $clientRepo = $docRoot
  if (-not (Test-Path (Join-Path $clientRepo ".git"))) { $clientRepo = Split-Path $docRoot -Parent }
  $serverRepo = if ($FantasyRoot) { $FantasyRoot } else { [string]$cfg.FantasyRoot }
  try { $gaps = Get-RuleReadTableGap $clientRepo $serverRepo $docRoot }
  catch { Write-Host ("SELF-REVIEW TRIGGERS : INFRA - " + $_.Exception.Message); exit 2 }
  foreach ($g in $gaps) { Write-Host ("RULE-TABLE GAP  : " + $g) }
  $docCount = @($script:RuleReadTable | ForEach-Object { $_.Doc } | Select-Object -Unique).Count
  $branchCount = @($script:RuleReadTable | ForEach-Object { @($_.PathRe; $_.DirRe; $_.ContentRe) } | Where-Object { $_ }).Count
  $aheadCount = @($script:RuleReadTable | ForEach-Object { @($_.Ahead) } | Where-Object { $_ }).Count
  if ($gaps.Count -gt 0) { Write-Host ("RULE-TABLE      : FAIL (" + $gaps.Count + " gap(s);改判据表跟上改名 / 搬家,正本 = hooks/校验库.ps1 RuleReadTable)"); exit 1 }
  Write-Host ("RULE-TABLE      : PASS (" + $script:RuleReadTable.Count + " 条判据 / " + $branchCount + " 支 / " + $docCount + " 篇;每篇存在,每支判据在仓内已跟踪文件里有命中;" + $aheadCount + " 支 Ahead 预置、尚无着落)")
  exit 0
}
# 基线双端分列(正本 = flow-config ClientBaseline / FantasyBaseline),不合成一个值:
# 两端各自的基线是独立配置项,合并会在两者取值分叉时静默按错的一端比 diff。
# 缺键判 INFRA(同 槽位交付 / 提交检查),不回落成写死的分支名:回落会在配置缺键时静默按错的基线比 diff。
foreach ($key in @("ClientBaseline", "FantasyBaseline")) {
  if (-not $cfg[$key]) { Write-Host ("SELF-REVIEW TRIGGERS : INFRA - missing flow-config key " + $key); exit 2 }
}
$clientBaseline  = $cfg.ClientBaseline
$fantasyBaseline = $cfg.FantasyBaseline

$roots = @()   # @{ Name; Path; Baseline }
if ($Slot) {
  # 槽位号的合法区间来自 flow-config,param 块的 ValidateSet 拿不到它——写死过一次,槽位池扩到 5
  # 之后 dev4/dev5 上本脚本直接参数验证失败,而自审是交付前必经一步。校验形态同 槽位交付 / 槽位置备。
  if ($Slot -notmatch '^\d+$' -or [int]$Slot -lt 1 -or [int]$Slot -gt [int]$cfg.SlotCount) {
    Write-Host "SELF-REVIEW TRIGGERS : INFRA - slot must be in 1..$($cfg.SlotCount)"; exit 2
  }
  $slotRoot = Join-Path $cfg.SlotBaseDir ("$($cfg.SlotDirPrefix)$Slot")
  if (-not (Test-Path $slotRoot)) { Write-Host "SELF-REVIEW TRIGGERS : INFRA - slot root '$slotRoot' not found"; exit 2 }
  $roots += @{ Name = "client"; Path = (Join-Path $slotRoot "Demo"); Baseline = $clientBaseline }
  if ($cfg.ServerDirName) { $roots += @{ Name = "server"; Path = (Join-Path $slotRoot $cfg.ServerDirName); Baseline = $fantasyBaseline } }
}
else {
  if (-not $ProjectDir) { Write-Host "SELF-REVIEW TRIGGERS : INFRA - pass -Slot <N>, or -ProjectDir (and optionally -FantasyRoot)"; exit 2 }
  $roots += @{ Name = "client"; Path = $ProjectDir; Baseline = $clientBaseline }
  if ($FantasyRoot) { $roots += @{ Name = "server"; Path = $FantasyRoot; Baseline = $fantasyBaseline } }
}

$allChanged = New-Object System.Collections.Generic.List[object]
$allAdded   = New-Object System.Collections.Generic.List[object]
$addedContent = @{}   # RULES 内容判据的输入(Add-AddedContent)
foreach ($r in $roots) {
  if (-not (Test-Path $r.Path)) { continue }
  # 客户端仓根是 Demo 的父目录(.git 在那儿);服务端仓根即给定路径。
  $repo = $r.Path
  if (-not (Test-Path (Join-Path $repo ".git"))) { $repo = Split-Path $r.Path -Parent }
  # 分叉点算一次、两处共用:两个采集函数吃同一个基点,各算各的只会多一次 git 往返。
  $diffBase = Get-DiffBase $repo $r.Baseline $r.Name
  # 查询失败判 INFRA,不当成「无改动」:那会让本该触发的自审静默不触发(采集用 Get-GitLinesChecked)。
  try {
    $changed = Get-ChangedPaths $repo $diffBase
    if ($null -eq $changed) { continue }
    foreach ($p in $changed) { $allChanged.Add(@{ Side = $r.Name; Path = $p }) }
    foreach ($p in (Get-AddedPaths $repo $diffBase)) { $allAdded.Add(@{ Side = $r.Name; Path = $p }) }
    if ($changed.Count -gt 0) { Add-AddedContent $repo $diffBase $r.Name $addedContent }
  } catch { Write-Host ("SELF-REVIEW TRIGGERS : INFRA - " + $_.Exception.Message); exit 2 }
}

if ($allChanged.Count -eq 0) {
  Write-Host "SELF-REVIEW TRIGGERS : no change against baseline - nothing to judge"
  exit 0
}

# ---- 五项判定 ----

function Format-Verdict([string]$Name, [bool]$Required, [string]$Detail) {
  $tag = if ($Required) { "required    " } else { "not-required" }
  Write-Host ("{0,-16}: {1} {2}" -f $Name, $tag, $Detail)
}

# ① SECURITY-REVIEW
$secHits = New-Object System.Collections.Generic.List[string]
foreach ($c in $allChanged) {
  foreach ($rule in $SecurityPathRules) {
    if ($c.Path -match $rule.Re) { $secHits.Add("$($c.Path) [$($rule.Why)]"); break }
  }
}
foreach ($r in $roots) {
  if (-not (Test-Path $r.Path)) { continue }
  foreach ($c in ($allChanged | Where-Object { $_.Side -eq $r.Name -and $_.Path -match '\.cs$' })) {
    $repo = $r.Path
    if (-not (Test-Path (Join-Path $repo ".git"))) { $repo = Split-Path $r.Path -Parent }
    $full = Join-Path $repo $c.Path
    if (-not (Test-Path $full)) { continue }   # 删除的文件
    if ((Get-Content $full -Raw -ErrorAction SilentlyContinue) -match $SecurityContentRe) {
      $already = $secHits | Where-Object { $_ -like "$($c.Path)*" }
      if (-not $already) { $secHits.Add("$($c.Path) [direct persistence / local storage call]") }
    }
  }
}
$secHits = @($secHits | Select-Object -Unique)
Format-Verdict "SECURITY-REVIEW" ($secHits.Count -gt 0) $(
  if ($secHits.Count -gt 0) { "($($secHits.Count) file(s); audit per references/security-review.md)" } else { "" })
foreach ($h in ($secHits | Select-Object -First 12)) { Write-Host "    - $h" }
if ($secHits.Count -gt 12) { Write-Host "    ... and $($secHits.Count - 12) more" }

# ② ASSET-SETTLE
$newAssets = @($allAdded | Where-Object { $_.Side -eq 'client' -and $_.Path -match $NewAssetExtRe } | ForEach-Object { $_.Path })
Format-Verdict "ASSET-SETTLE" ($newAssets.Count -gt 0) $(
  if ($newAssets.Count -gt 0) { "($($newAssets.Count) new asset(s); let the editor finish importing before 槽位交付)" } else { "" })
foreach ($a in ($newAssets | Select-Object -First 8)) { Write-Host "    - $a" }
if ($newAssets.Count -gt 8) { Write-Host "    ... and $($newAssets.Count - 8) more" }

# ③ UI-EVIDENCE
$prefabs = @($allChanged | Where-Object { $_.Path -match $UiEvidenceExtRe } | ForEach-Object { $_.Path })
Format-Verdict "UI-EVIDENCE" ($prefabs.Count -gt 0) $(
  if ($prefabs.Count -gt 0) { "($($prefabs.Count) prefab(s) touched; 交付前在槽位编辑器目视位置与遮挡,呈报附证据)" } else { "" })

# ④ FIX-QUALIFY
if ($MessageFile -and (Test-Path $MessageFile)) {
  $qual    = Get-FixQualifyGap ([System.IO.File]::ReadAllText($MessageFile))
  $subject = $qual.Subject
  $detail = if (-not $qual.IsFix) { "(subject verb is not a fix verb)" }
            elseif ($qual.Gap -eq "no-qual") { "(subject '$subject' is a fix, but body carries NO 根治/补丁 结论 - add it before 槽位交付)" }
            elseif ($qual.Gap -eq "root-no-invariant") { "(subject '$subject' concludes 根治 but names no 不变量 - 写明本修复立住的不变量,及按「换个地方再发生」排查过的反例时序 / 路径)" }
            else { "(subject '$subject' is a fix; body already carries 根治/补丁 结论)" }
  Format-Verdict "FIX-QUALIFY" ($qual.Gap -ne "") $detail
}
else {
  Format-Verdict "FIX-QUALIFY" $false "(no -MessageFile given; judge by hand per CLAUDE.md 修复前先定性)"
}

# ⑤ RULES:本轮改动面命中的按需篇,每篇一行(判据表在校验库,见头注)
$ruleHits = Get-RuleReadHits $allChanged $addedContent
if ($ruleHits.Count -eq 0) {
  Format-Verdict "RULES" $false "(按需篇判据表未命中;表外的面仍按 CLAUDE.md 路由表自认)"
}
foreach ($doc in $ruleHits.Keys) {
  $h = $ruleHits[$doc]
  $more = if ($h.Count -gt 1) { " (+" + ($h.Count - 1) + " more)" } else { "" }
  Format-Verdict "RULES" $true ($doc + " <- " + $h[0] + $more)
}

exit 0
