# 重建csproj.ps1 - 判定 Unity 生成的 csproj 是否过期(<Compile> 列表 vs 磁盘实扫),可就地修复。
# 调用方:槽位领取.ps1(领取时判是否须编辑器重生成)、Editor程序集编译.ps1(编译前判 STALE-REGEN)、会话单独判定;
# 免启编辑器的槽位(槽位领取.ps1 -NoUnity)与编辑器未刷新的工程同样适用。
#
# 判定面:-Assembly 指定的程序集,加上它经 <ProjectReference> 递归引用、且在 Assets 或工程内嵌包下有同名
# asmdef 的程序集(引用方过期同样使编译崩在无关文件上)。内嵌包 = <工程根>\Packages 下直接含 package.json
# 的目录(本仓 YooAsset / UniTask / MCPForUnity):源码在仓里、随基线增删文件,与 Assets 下的同样会过期。
# 已实发(2026-10-05,槽位 dev3):基线 9774fe35c 新增 Packages/YooAsset/RuntimeExtension/ExtensionOperation/
# PrefetchBundleOperation.cs,当时包内程序集不在判定面,本脚本回 FRESH,随后 build 在 TEngine.Runtime.csproj 上
# 报 CS0246。内嵌包的程序集只比对 <Compile>(-InPlace 可修),引用集 / 宏不判(见下文「不判」);闭包照常
# 穿过它往下取(如 UniTask.DOTween 引着 Assets 下的 DOTween.Modules)。
# Library\PackageCache 的只读包、落在 Packages 目录外的 file: 包(Fantasy.Unity)与无 asmdef 的引用不判。
# -Assembly 也可给 predefined 的 Assembly-CSharp-Editor(无 asmdef):它自己只比对 <Compile>(实扫取
# Get-UnityPredefinedEditorSet),引用集 / 宏不判(无 asmdef 可对照),作用是把判定面扩到它引的整个闭包——
# Launcher、TEngine.Editor 等不在任何热更程序集闭包里的也进来。
# 每个程序集两个方向都判:
#   - csproj 多列(文件已不在磁盘上)-> dotnet build 报 CS2001,CSC 读源阶段即中止,真错误不出现。
#   - csproj 缺列(磁盘上有而未收录)-> 报「未能找到类型或命名空间名」。
#
# 实扫口径:asmdef 按 JSON 顶层 "name" 字段精确定位;该 asmdef 目录子树下全部 .cs,减去更深的
# asmdef / asmref 子树,减去 Unity 忽略路径。正本 = hooks\hook函数库.ps1「Unity 程序集实扫」节
# (Get-UnityAsmScan / Get-UnityEmbeddedPackageScan / Find-UnityAsmdefByName / Get-UnityAsmdefExpectSet),
# 与 Editor程序集编译.ps1 同源(它的比对面同样取 Assets 与内嵌包两份底数)。
# 本仓实测(2026-10-06,主工程,起点 Assembly-CSharp-Editor):闭包内 13 个内嵌包程序集(YooAsset 5 /
# UniTask 6 / MCPForUnity 2)的实扫与 Unity 生成的 csproj 逐项相等、双向零差异。
#
# 须编辑器重生成的两类另判(先于 <Compile> 比对;判中即 STALE-REGEN,-InPlace 修不了、零写入)。
# 基线带来的这两类变化只有编辑器重生成 csproj 才进得来,照编只会在调用点报一片与改动无关的错误:
#   - 引用集(明细行 STALE-REFS):判定面内每个 asmdef 声明的引用(按名或 GUID:),凡指向 Assets 下、
#     平台含 Editor 的 asmdef——若它有 defineConstraints,按该程序集应有的宏求值(条目间与、条目内 || 或、
#     ! 非)——Unity 会编它则 csproj 须有对应 <ProjectReference> / <Reference>,不会编它则不得有。
#   - 宏(明细行 STALE-DEFINES):从 csproj 的 UNITY_WEBGL / UNITY_ANDROID / UNITY_IOS / UNITY_STANDALONE 认出
#     生成时的平台组,ProjectSettings 该组 scriptingDefineSymbols 的每个宏 csproj 须有;别的平台组才有、
#     该组已无的宏 csproj 不得有(该 asmdef 自己 versionDefines 产出的与它生效的 csc.rsp 仍定义的除外);它生效的
#     csc.rsp 的 -define: / /define: / -d: 宏 csproj 须有;各平台组都已删掉的全局宏与不在它生效的 csc.rsp 里的历史
#     rsp 宏——git 历史(HEAD 可达)里出现过、当前各组都没有——csproj 同样不得有(同上除外)。「生效的 csc.rsp」按
#     Unity 口径(6000.3 UnityEditor.CoreModule ResponseFileProvider.Get / GetDefaultResponseFiles 的 IL 实读):
#     asmdef 所在目录有 csc.rsp 则只用它,替代而非叠加根目录那份、也不向上逐级找;否则 Assets/csc.rsp;再否则旧名
#     Assets/mcs.rsp。csproj 生成走同一口径(ScriptAssembly.GetResponseFiles);rsp 历史面 = HEAD 历史里出现过的全部
#     csc.rsp / mcs.rsp(含挪走、删掉的 asmdef 目录下的)——凡在任何 rsp 里定义过的宏都不是 Unity 内置宏,某程序集
#     的 csproj 带着而它生效的那份 rsp 里没有,即过期。asmdef versionDefines 里
#     条件成立的条目,其宏 csproj 须有。条件:包在 packages-lock.json(name=Unity 指编辑器本身),表达式为空
#     或按 Unity 区间语法求值成立——x = 不低于 x;[x,y] / (x,y) / [x,y) / (x,y] 闭开区间,一端可空;[x] = 恰为 x。
#     包版本:注册表 / 内置包取锁文件 version,file: 包读其 package.json,git 包读 Library/PackageCache 里
#     唯一那份 package.json;按 SemVer 比较(缺省段按 0,预发布版低于正式版)。编辑器版本取
#     ProjectSettings/ProjectVersion.txt,比到只差 a / b / f / p 这类版本类型后缀时无从判定。
#     残留宏:同一次生成的 csproj 里 Unity 内置宏与全局宏人人都有,只有各 asmdef 的 versionDefines 让它们
#     不同;故某 csproj 独有(判定面内同平台组、同类其余 csproj 都没有)、不是全局宏、也不来自本 asmdef 条件成立
#     或求不了值的 versionDefines 的宏,即条件已不成立或条目已删的 versionDefines 残留,csproj 不得有。
#     「同类」= 按 asmdef 是否纯编辑器(includePlatforms 只有 Editor)分两类:两类的内置宏本就不同(纯编辑器的
#     按 .NET Framework 编,带 NET_4_6 / NET_UNITY_4_8 / UNITY_EDITOR_ONLY_COMPILATION;其余按玩家 API 兼容级别,
#     本仓为 NET_STANDARD* 一组),混在一起取交集会把每份的内置宏都判成残留(2026-09-27 判定面扩到 Editor
#     闭包时实测:新鲜 csproj 上 11 个程序集全数误报)。
# 不判(判了会误报或无从求值):包缓存里的 asmdef;内嵌包程序集自己的引用集与宏,以及别人指向内嵌包 asmdef
# 的引用(内嵌包只进 <Compile> 比对);csproj 多出的普通引用(多引不致编译失败);
# 认不出平台组、或 ProjectSettings 无该组时的全局宏与 defineConstraints(认不出平台组时残留宏也不判);
# 工程不在 git 仓内时已删掉的全局宏与 csc.rsp 宏(无历史可对照);versionDefines 里版本取不到、表达式解析不了
# 或比较无从判定的条目(其宏缺也不判、在也不算残留);判定面内同平台组同类 csproj 不足两份时的残留宏,以及同平台组
# 同类 csproj 人人都带着的残留宏(与内置宏无从区分)。
# 消费方:槽位领取.ps1(判中则免启改启编辑器 + WARN)、Editor程序集编译.ps1(判中则 INFRA),两者都以
# Assembly-CSharp-Editor 为起点。
#
# 参数:
#   -ProjectRoot  Unity 工程根(含 <程序集>.csproj 的那一级)。必填,不设缺省以免静默指向主工程。
#   -Assembly     程序集名,如 GameLogic / GameConfig / FantasyNetwork,或 Assembly-CSharp-Editor(见判定面);
#                 内嵌包的程序集名(如 YooAsset)也可作起点。
#   -InPlace      对判为过期的每个 csproj 就地重写 <Compile> 列表(其余行原样保留)。
#                 不给 = 只判定、零写入。
#
# 输出末行:
#   VERDICT: FRESH | <判定的程序集>                 -> csproj 与磁盘一致,可编
#   VERDICT: STALE | <过期的程序集> | ...           -> 重跑加 -InPlace,或回编辑器重生成
#   VERDICT: FIXED | <已重写的程序集>              -> 已与磁盘一致,可编
#   VERDICT: STALE-REGEN | <过期的程序集> | ...   -> 回槽位编辑器 AssetDatabase.Refresh + CodeEditor SyncAll
#   VERDICT: INFRA | <原因>
# 退出码:0 FRESH / FIXED;1 STALE(未加 -InPlace);2 INFRA(工程根 / csproj / asmdef 缺失或不唯一、
#         csproj 无 <Compile> 条目);3 STALE-REGEN(给了 -InPlace 也零写入,重生成后 Compile 列表随之更新)。
#
# 不覆盖:analyzer 与 csc.rsp 里 -define 以外选项的变化——同样须回编辑器重生成 csproj,本脚本看不出来。
#
# 副作用:仅 -InPlace 且非 STALE-REGEN 时重写 csproj(Unity 生成物,在 .gitignore 内)。不碰 .cs、asmdef,
# git 只读(取 ProjectSettings 与各 csc.rsp / mcs.rsp 的历史),不编译。另写仓外运行态缓存
# claude-wf-3b\csproj-rsp-paths.json(历史 rsp 路径集,按 git 公共目录分条;删掉只会让下次全量重扫)。
[CmdletBinding(PositionalBinding=$false)]
param(
  [Parameter(Mandatory=$true)][string]$ProjectRoot,
  [Parameter(Mandatory=$true)][string]$Assembly,
  [switch]$InPlace
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

function Exit-Infra([string]$Why) { Write-Host ("VERDICT: INFRA | " + $Why); exit 2 }

function Read-AsmdefJson([string]$Path) {
  try { return ([System.IO.File]::ReadAllText($Path) | ConvertFrom-Json) } catch { return $null }
}

# 被引 asmdef 的平台是否含 Editor:带平台限定不含 Editor、或排除 Editor 的,Unity 不一定为它生成引用,不判。
function Test-AsmdefEditorPlatform($Json) {
  $inc = @($Json.includePlatforms | Where-Object { $_ })
  $exc = @($Json.excludePlatforms | Where-Object { $_ })
  if ($inc.Count -gt 0 -and $inc -notcontains "Editor") { return $false }
  return ($exc -notcontains "Editor")
}

# 残留宏对照的「类」(见头注):纯编辑器 asmdef(includePlatforms 只有 Editor)与其余的内置宏不同。
function Get-PeerKind($Json) {
  $inc = @($Json.includePlatforms | Where-Object { $_ })
  if ($inc.Count -eq 1 -and [string]$inc[0] -ceq "Editor") { return "editor" }
  return "player"
}

# 若干文件在 git 历史(HEAD 可达)各版本里匹配 $Patterns 的行(-i,带其后 $After 行)。log 取改过这些文件的
# 提交,git grep 一次扫多个版本(分批,免命令行超长;比 log -p 拉满上下文快一倍)。不在 git 仓内或取不到时回空数组。
# $Paths 为工程根相对路径。耗时主要在 log 按路径遍历全仓历史:本仓已建带变更路径过滤的 commit-graph(v2,配置
# commitGraph.changedPathsVersion=2,gc 重写时沿用)约 0.1s,没有该图约 1.5s。
function Get-HistoryGrepLines([string]$Root, [string[]]$Paths, [string[]]$Patterns, [int]$After) {
  $out = New-Object System.Collections.Generic.List[string]
  $spec = ($Paths | ForEach-Object { '"' + $_ + '"' }) -join ' '
  try { $revs = Get-GitLines $Root ("log --format=%H -- " + $spec) } catch { return , $out.ToArray() }
  $opt = "grep -h -i"
  if ($After -gt 0) { $opt += " -A " + $After }
  foreach ($p in $Patterns) { $opt += " -e " + $p }
  for ($i = 0; $i -lt $revs.Count; $i += 80) {
    $batch = ($revs[$i..([Math]::Min($i + 79, $revs.Count - 1))]) -join ' '
    try { $lines = Get-GitLines $Root ($opt + " " + $batch + " -- " + $spec) } catch { continue }
    foreach ($l in $lines) { $out.Add($l) }
  }
  return , $out.ToArray()
}

# HEAD 历史里出现过的全部 csc.rsp / mcs.rsp 路径(工程根相对;含挪走、删掉的 asmdef 目录下的)。通配 pathspec
# 用不上 commit-graph 的变更路径过滤,全量扫本仓约 2.5s,故按 git 公共目录在运行态目录缓存「扫过的 HEAD 集合 +
# 路径集」,之后只扫 HEAD --not <扫过的各 HEAD>(槽位间来回换基线也不重扫);缓存读不了、或记下的 HEAD 已不存在
# 时全量重扫。路径集是历次所见的并集,可能含别的分支才有的路径——取内容时只 grep HEAD 可达的版本,不影响判定。
function Get-HistoricalRspPaths([string]$Root) {
  $paths = New-Object System.Collections.Generic.HashSet[string]
  try {
    # [string] 去掉 PSObject 包装:作字典键时 ConvertTo-Json 只认纯字符串键,否则写回整段失败。
    $cl = Get-GitLines $Root "rev-parse --path-format=absolute --git-common-dir"
    $hl = Get-GitLines $Root "rev-parse HEAD"
    $common = ""; $head = ""
    if ($cl.Count -gt 0) { $common = [string]$cl[0] }
    if ($hl.Count -gt 0) { $head = [string]$hl[0] }
  } catch { return , @() }
  if (-not $common -or -not $head) { return , @() }
  $cacheFile = Join-Path $script:WfStateRoot "csproj-rsp-paths.json"
  $cache = @{}
  try {
    if (Test-Path -LiteralPath $cacheFile) {
      foreach ($p in ([System.IO.File]::ReadAllText($cacheFile) | ConvertFrom-Json).PSObject.Properties) { $cache[$p.Name] = $p.Value }
    }
  } catch { $cache = @{} }
  $heads = New-Object System.Collections.Generic.List[string]
  $entry = $cache[$common]
  if ($entry) {
    foreach ($h in @($entry.heads)) { if ($h) { $heads.Add([string]$h) } }
    foreach ($p in @($entry.paths)) { if ($p) { [void]$paths.Add([string]$p) } }
  }
  $glob = ' -- ":(glob)**/csc.rsp" ":(glob)**/mcs.rsp"'
  $scan = "log --format= --name-only --relative HEAD"
  if ($heads.Count -gt 0) { $scan += " --not " + ($heads -join ' ') }
  # 要退出码(Get-GitLines 吞掉它):记下的 HEAD 有已不存在的(被 gc 掉)时 --not 整条报错,退回全量。
  try { $r = Invoke-GitMerged $Root ($scan + $glob) } catch { return , @() }
  if ($r.code -ne 0 -and $heads.Count -gt 0) {
    $paths.Clear(); $heads.Clear()
    try { $r = Invoke-GitMerged $Root ("log --format= --name-only --relative HEAD" + $glob) } catch { return , @() }
  }
  if ($r.code -ne 0) { return , @() }
  foreach ($p in @($r.lines)) { if ($p.Trim() -match '(?i)(^|/)(csc|mcs)\.rsp$') { [void]$paths.Add($p.Trim()) } }
  if ($heads -notcontains $head) { $heads.Add($head) }
  while ($heads.Count -gt 30) { $heads.RemoveAt(0) }
  # 写回:先写临时文件再替换,并发的另一进程至多读到旧版(退回全量,慢而不错);顺手剔除公共目录已不在的条目。
  try {
    $cache[$common] = [pscustomobject]@{ heads = $heads.ToArray(); paths = @($paths) }
    $out = [ordered]@{}
    foreach ($k in $cache.Keys) { if (Test-Path -LiteralPath $k) { $out[[string]$k] = $cache[$k] } }
    [System.IO.Directory]::CreateDirectory((Split-Path $cacheFile -Parent)) | Out-Null
    $tmp = $cacheFile + "." + [Guid]::NewGuid().ToString("N") + ".tmp"
    [System.IO.File]::WriteAllText($tmp, ($out | ConvertTo-Json -Depth 5), (New-Object System.Text.UTF8Encoding($false)))
    # 备份路径传 [NullString]::Value:PowerShell 把 $null 转成空串传给 .NET,Replace 会报路径不合法。
    if (Test-Path -LiteralPath $cacheFile) { [System.IO.File]::Replace($tmp, $cacheFile, [NullString]::Value) } else { [System.IO.File]::Move($tmp, $cacheFile) }
  } catch {
    if ($tmp -and (Test-Path -LiteralPath $tmp)) { try { [System.IO.File]::Delete($tmp) } catch {} }
  }
  return , @($paths)
}

# git 历史里 ProjectSettings 各版本 scriptingDefineSymbols 出现过的宏(全部平台组并集)。
function Read-HistoricalGlobalDefines([string]$Root) {
  $set = New-Object System.Collections.Generic.HashSet[string]
  $in = $false
  foreach ($line in (Get-HistoryGrepLines $Root @("ProjectSettings/ProjectSettings.asset") @("scriptingDefineSymbols:") 40)) {
    if (-not $in) { if ($line -match '^\s*scriptingDefineSymbols:\s*$') { $in = $true }; continue }
    $m = [regex]::Match($line, '^\s{4}([^:]+):\s*(.*)$')
    if (-not $m.Success) { $in = ($line -match '^\s*scriptingDefineSymbols:\s*$'); continue }
    foreach ($d in ($m.Groups[2].Value -split ';')) { if ($d.Trim()) { [void]$set.Add($d.Trim()) } }
  }
  return , $set
}

# csc.rsp 行里 -define: / /define: / -d: / /d: 定义的宏(不分大小写;值内 ; 或 , 分隔,可带引号);# 起头的行是注释。
function Get-RspDefines([string[]]$Lines) {
  $set = New-Object System.Collections.Generic.HashSet[string]
  foreach ($line in $Lines) {
    $t = $line.Trim()
    if (-not $t -or $t.StartsWith('#', [System.StringComparison]::Ordinal)) { continue }
    foreach ($m in [regex]::Matches($t, '(?i)(?:^|\s)[-/](?:define|d):("[^"]*"|\S+)')) {
      foreach ($d in ($m.Groups[1].Value.Trim('"') -split '[;,]')) { if ($d.Trim()) { [void]$set.Add($d.Trim()) } }
    }
  }
  return , $set
}

# 路径相对工程根的形态(正斜杠),供报告与 git pathspec 用。
function Get-RootRel([string]$Root, [string]$Full) {
  return [System.IO.Path]::GetFullPath($Full).Substring([System.IO.Path]::GetFullPath($Root).TrimEnd('\').Length + 1).Replace('\', '/')
}

# 某 asmdef 程序集实际生效的 response file(口径见头注):asmdef 所在目录有 csc.rsp 则只用它;否则 Assets/csc.rsp;
# 再否则旧名 Assets/mcs.rsp。回 @{ Rel = 工程根相对路径(都没有则空串); Defines = 其宏集合 }。
function Get-EffectiveRsp([string]$Root, [string]$AsmdefPath) {
  $cands = @((Join-Path (Split-Path $AsmdefPath -Parent) "csc.rsp"), (Join-Path $Root "Assets\csc.rsp"), (Join-Path $Root "Assets\mcs.rsp"))
  foreach ($p in $cands) {
    if (Test-Path -LiteralPath $p) { return @{ Rel = (Get-RootRel $Root $p); Defines = (Get-RspDefines ([System.IO.File]::ReadAllLines($p))) } }
  }
  return @{ Rel = ""; Defines = (New-Object System.Collections.Generic.HashSet[string]) }
}

function Get-CsprojDefines([string]$Text) {
  $m = [regex]::Match($Text, '<DefineConstants>([^<]*)</DefineConstants>')
  if (-not $m.Success) { return $null }
  return , @($m.Groups[1].Value -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
}

# csproj 生成时编辑器所在的平台组(ProjectSettings 的组名);认不出回空串。
function Get-DefineGroup([string[]]$Defines) {
  if ($Defines -contains "UNITY_WEBGL") { return "WebGL" }
  if ($Defines -contains "UNITY_ANDROID") { return "Android" }
  if ($Defines -contains "UNITY_IOS") { return "iPhone" }
  if ($Defines -contains "UNITY_STANDALONE") { return "Standalone" }
  return ""
}

# packages-lock.json 的 dependencies,包名 -> 锁条目;没有锁文件回 $null(包的 versionDefines 一律不判)。
function Read-PackageLock([string]$Root) {
  $p = Join-Path $Root "Packages\packages-lock.json"
  if (-not (Test-Path -LiteralPath $p)) { return $null }
  try { $j = [System.IO.File]::ReadAllText($p) | ConvertFrom-Json } catch { return $null }
  $map = @{}
  foreach ($prop in @($j.dependencies.PSObject.Properties)) { $map[$prop.Name] = $prop.Value }
  return $map
}

# 包的实际版本:file: 包读其 package.json;git 包读 Library/PackageCache 里唯一那份 package.json;
# 其余(注册表 / 内置)取锁条目 version。取不到回 $null。
function Get-PackageVersion([string]$Root, [string]$Name, $Entry) {
  $v = [string]$Entry.version
  $pj = $null
  $fm = [regex]::Match($v, '^file:(.+)$')
  if ($fm.Success) {
    $pj = Join-Path (Join-Path $Root "Packages") (Join-Path $fm.Groups[1].Value "package.json")
  } elseif ([string]$Entry.source -eq "git") {
    $cache = Join-Path $Root "Library\PackageCache"
    if (Test-Path -LiteralPath $cache) {
      $dirs = @([System.IO.Directory]::GetDirectories($cache, $Name + "@*"))
      if ($dirs.Count -eq 1) { $pj = Join-Path $dirs[0] "package.json" }
    }
  } else {
    return $v
  }
  if (-not $pj -or -not (Test-Path -LiteralPath $pj)) { return $null }
  try { return [string](([System.IO.File]::ReadAllText($pj) | ConvertFrom-Json).version) } catch { return $null }
}

function Read-EditorVersion([string]$Root) {
  $p = Join-Path $Root "ProjectSettings\ProjectVersion.txt"
  if (-not (Test-Path -LiteralPath $p)) { return $null }
  $m = [regex]::Match([System.IO.File]::ReadAllText($p), '(?m)^m_EditorVersion:\s*(\S+)')
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

# SemVer 2.0 版本:缺省的次 / 修订号按 0;构建元数据忽略。解析不了回 $null。
function ConvertTo-SemVer([string]$V) {
  $m = [regex]::Match($V.Trim(), '^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$')
  if (-not $m.Success) { return $null }
  $n = @([long]0, [long]0, [long]0)
  for ($i = 1; $i -le 3; $i++) { if ($m.Groups[$i].Success) { $n[$i - 1] = [long]$m.Groups[$i].Value } }
  $pre = @()
  if ($m.Groups[4].Success) { $pre = @($m.Groups[4].Value -split '\.') }
  return @{ Num = $n; Pre = $pre }
}

# SemVer 优先级:-1 / 0 / 1。预发布版低于同号正式版;预发布段逐段比,纯数字按数值、低于字母段。
function Compare-SemVer($A, $B) {
  for ($i = 0; $i -lt 3; $i++) { if ($A.Num[$i] -ne $B.Num[$i]) { return [Math]::Sign($A.Num[$i] - $B.Num[$i]) } }
  $pa = @($A.Pre); $pb = @($B.Pre)
  if ($pa.Count -eq 0 -or $pb.Count -eq 0) { return [Math]::Sign($pb.Count - $pa.Count) }
  for ($i = 0; $i -lt [Math]::Min($pa.Count, $pb.Count); $i++) {
    $xn = $pa[$i] -match '^\d+$'; $yn = $pb[$i] -match '^\d+$'
    if ($xn -and $yn) { $c = [Math]::Sign([long]$pa[$i] - [long]$pb[$i]) }
    elseif ($xn) { $c = -1 }
    elseif ($yn) { $c = 1 }
    else { $c = [Math]::Sign([string]::CompareOrdinal($pa[$i], $pb[$i])) }
    if ($c -ne 0) { return $c }
  }
  return [Math]::Sign($pa.Count - $pb.Count)
}

# Unity 编辑器版本(如 6000.3.19f1):数字段同 SemVer,尾部 a / b / c / f / p / x 加序号为版本类型。
function ConvertTo-UnityVer([string]$V) {
  $m = [regex]::Match($V.Trim(), '^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:([abcfpx])(\d+))?$')
  if (-not $m.Success) { return $null }
  $n = @([long]0, [long]0, [long]0)
  for ($i = 1; $i -le 3; $i++) { if ($m.Groups[$i].Success) { $n[$i - 1] = [long]$m.Groups[$i].Value } }
  $t = ""; $tn = [long]0
  if ($m.Groups[4].Success) { $t = $m.Groups[4].Value; $tn = [long]$m.Groups[5].Value }
  return @{ Num = $n; Type = $t; TypeNum = $tn }
}

# 数字段相同时只比同类型的序号;版本类型不同或一方缺省——Unity 在这里的排序口径未核实——回 $null。
function Compare-UnityVer($A, $B) {
  for ($i = 0; $i -lt 3; $i++) { if ($A.Num[$i] -ne $B.Num[$i]) { return [Math]::Sign($A.Num[$i] - $B.Num[$i]) } }
  if ($A.Type -ceq $B.Type) { return [Math]::Sign($A.TypeNum - $B.TypeNum) }
  return $null
}

# versionDefines 表达式求值(Unity 区间语法,见头注)。成立 $true、不成立 $false、解析不了或无从判定 $null。
function Test-VersionExpression([string]$Expr, [string]$Version, [scriptblock]$Parse, [scriptblock]$Compare) {
  $ver = & $Parse $Version
  if ($null -eq $ver) { return $null }
  $e = $Expr.Trim()
  $m = [regex]::Match($e, '^([\[\(])\s*([^,\]\)]*?)\s*(?:,\s*([^\]\)]*?)\s*)?([\]\)])$')
  if (-not $m.Success) {
    $x = & $Parse $e
    if ($null -eq $x) { return $null }
    $c = & $Compare $ver $x
    if ($null -eq $c) { return $null }
    return ($c -ge 0)
  }
  $openL = $m.Groups[1].Value; $lo = $m.Groups[2].Value; $closeR = $m.Groups[4].Value
  if (-not $m.Groups[3].Success) {
    if ($openL -ne '[' -or $closeR -ne ']' -or -not $lo) { return $null }
    $x = & $Parse $lo
    if ($null -eq $x) { return $null }
    $c = & $Compare $ver $x
    if ($null -eq $c) { return $null }
    return ($c -eq 0)
  }
  $hi = $m.Groups[3].Value
  if (-not $lo -and -not $hi) { return $null }
  if ($lo) {
    $x = & $Parse $lo
    if ($null -eq $x) { return $null }
    $c = & $Compare $ver $x
    if ($null -eq $c) { return $null }
    if (($openL -eq '[' -and $c -lt 0) -or ($openL -eq '(' -and $c -le 0)) { return $false }
  }
  if ($hi) {
    $y = & $Parse $hi
    if ($null -eq $y) { return $null }
    $c = & $Compare $ver $y
    if ($null -eq $c) { return $null }
    if (($closeR -eq ']' -and $c -gt 0) -or ($closeR -eq ')' -and $c -ge 0)) { return $false }
  }
  return $true
}

# asmdef 每条 versionDefines 的条件求值(口径见头注):回 @{ Define; State },State = $true 成立 /
# $false 不成立(含包未安装)/ $null 求不了值(无锁文件、版本取不到、表达式解析不了或无从判定)。
function Get-VersionDefineStates($Json, $Lock, [string]$Root, [string]$EditorVersion) {
  $out = New-Object System.Collections.Generic.List[object]
  foreach ($v in @($Json.versionDefines | Where-Object { $_ })) {
    $define = [string]$v.define; $name = [string]$v.name; $expr = [string]$v.expression
    if (-not $define -or -not $name) { continue }
    $st = $null
    if ($name -ceq "Unity") {
      if (-not $expr) { $st = $true }
      elseif ($EditorVersion) { $st = Test-VersionExpression $expr $EditorVersion ${function:ConvertTo-UnityVer} ${function:Compare-UnityVer} }
    } elseif ($null -ne $Lock) {
      if (-not $Lock.ContainsKey($name)) { $st = $false }
      elseif (-not $expr) { $st = $true }
      else {
        $pv = Get-PackageVersion $Root $name $Lock[$name]
        if ($pv) { $st = Test-VersionExpression $expr $pv ${function:ConvertTo-SemVer} ${function:Compare-SemVer} }
      }
    }
    $out.Add([pscustomobject]@{ Define = $define; State = $st })
  }
  return , $out.ToArray()
}

# asmdef versionDefines 里一定生效的宏(条件求值为成立的条目)。
function Get-SureVersionDefines($Json, $Lock, [string]$Root, [string]$EditorVersion) {
  return , @((Get-VersionDefineStates $Json $Lock $Root $EditorVersion) | Where-Object { $_.State -eq $true } | ForEach-Object { $_.Define })
}

# defineConstraints 求值:条目间取与,条目内 || 取或,前缀 ! 取反。
function Test-DefineConstraints([string[]]$Constraints, $DefineSet) {
  foreach ($c in $Constraints) {
    $any = $false
    foreach ($t in ($c -split '\|\|')) {
      $t = $t.Trim()
      if (-not $t) { continue }
      if ($t.StartsWith('!', [System.StringComparison]::Ordinal)) { $hit = -not $DefineSet.Contains($t.Substring(1).Trim()) } else { $hit = $DefineSet.Contains($t) }
      if ($hit) { $any = $true; break }
    }
    if (-not $any) { return $false }
  }
  return $true
}

$root = $ProjectRoot.TrimEnd('\', '/')
$assets = Join-Path $root "Assets"
if (-not (Test-Path -LiteralPath $assets)) { Exit-Infra ("不像 Unity 工程根(无 Assets): " + $root) }
$scan = Get-UnityAsmScan $assets
$pkgScan = Get-UnityEmbeddedPackageScan $root

# 按 name 在 Assets 与内嵌包两份底数里找 asmdef,回全部命中(调用方判 0 / 多个):@{ Def; Scan; Embedded }。
function Find-ClosureAsmdef([string]$Name) {
  $hits = New-Object System.Collections.Generic.List[object]
  foreach ($d in (Find-UnityAsmdefByName $scan $Name)) { $hits.Add([pscustomobject]@{ Def = $d; Scan = $scan; Embedded = $false }) }
  foreach ($d in (Find-UnityAsmdefByName $pkgScan $Name)) { $hits.Add([pscustomobject]@{ Def = $d; Scan = $pkgScan; Embedded = $true }) }
  return , $hits.ToArray()
}

# ── 判定面:目标 + ProjectReference 递归闭包中 Assets 或内嵌包下有 asmdef 的程序集 ───────
# predefined 起点与内嵌包的程序集(见头注):Asmdef 记 $null,下文引用集 / 宏与残留宏对照都跳过它们,只比对 <Compile>。
$PredefinedRoot = "Assembly-CSharp-Editor"
if ($Assembly -cne $PredefinedRoot -and (Find-ClosureAsmdef $Assembly).Count -eq 0) { Exit-Infra ("Assets 与内嵌包下都找不到 name=" + $Assembly + " 的 asmdef") }
$queue = New-Object System.Collections.Generic.Queue[string]
$seen = New-Object System.Collections.Generic.HashSet[string]
$queue.Enqueue($Assembly); [void]$seen.Add($Assembly)
$specs = New-Object System.Collections.Generic.List[object]
while ($queue.Count -gt 0) {
  $name = $queue.Dequeue()
  $cp = Join-Path $root ($name + ".csproj")
  if (-not (Test-Path -LiteralPath $cp)) { Exit-Infra ("csproj 不存在: " + $cp + "(回编辑器生成工程文件)") }
  $text = [System.IO.File]::ReadAllText($cp)
  if ($name -ceq $PredefinedRoot) {
    $specs.Add([pscustomobject]@{ Name = $name; Csproj = $cp; Text = $text; Asmdef = $null; Expect = (Get-UnityPredefinedEditorSet $scan) })
  } else {
    $defs = Find-ClosureAsmdef $name
    if ($defs.Count -ne 1) { Exit-Infra ("name=" + $name + " 的 asmdef 有 " + $defs.Count + " 个(Assets 与内嵌包合计),期望 1 个") }
    $asmdef = $null
    if (-not $defs[0].Embedded) { $asmdef = $defs[0].Def.Path }
    $specs.Add([pscustomobject]@{ Name = $name; Csproj = $cp; Text = $text; Asmdef = $asmdef; Expect = (Get-UnityAsmdefExpectSet $defs[0].Scan $defs[0].Def.RelDir) })
  }
  foreach ($m in [regex]::Matches($text, '<ProjectReference\s+Include="([^"]+)\.csproj"')) {
    $ref = [System.IO.Path]::GetFileName($m.Groups[1].Value)
    if ((Find-ClosureAsmdef $ref).Count -gt 0 -and $seen.Add($ref)) { $queue.Enqueue($ref) }
  }
}

# ── 须编辑器重生成:引用集与宏(判中即出,零写入)───────────────────────────────
$globals = Read-UnityGlobalDefines $root
$universe = New-Object System.Collections.Generic.HashSet[string]
foreach ($k in $globals.Keys) { foreach ($d in $globals[$k]) { [void]$universe.Add($d) } }
# 已删掉的全局宏 / 不再生效的 csc.rsp 宏:git 历史里出现过、当前哪个平台组都没有(rsp 宏另按各程序集实际生效
# 的那份 rsp 逐个扣除,见下文 $linger)。它们在同批 csproj 里往往人人都有,文件层面与 Unity 内置宏分不开,只能凭
# 「曾经写在 scriptingDefineSymbols / csc.rsp 里」认出来(内置宏不会写在那里)。$histGlobalOnly 与 $histRspOnly
# 互不重叠(两处都有的记前者),并集为候选,后者只决定报告措辞。rsp 的历史面 = 根目录 csc.rsp / mcs.rsp、判定面内
# 各 asmdef 目录下的 csc.rsp,并上 HEAD 历史里出现过的全部 rsp 路径(Get-HistoricalRspPaths)。
$histGlobalOnly = New-Object System.Collections.Generic.HashSet[string]
$histRspOnly = New-Object System.Collections.Generic.HashSet[string]
foreach ($d in (Read-HistoricalGlobalDefines $root)) { if (-not $universe.Contains($d)) { [void]$histGlobalOnly.Add($d) } }
$rspPaths = New-Object System.Collections.Generic.List[string]
$rspPaths.Add("Assets/csc.rsp"); $rspPaths.Add("Assets/mcs.rsp")
foreach ($s in $specs) {
  if (-not $s.Asmdef) { continue }
  $rp = Get-RootRel $root (Join-Path (Split-Path $s.Asmdef -Parent) "csc.rsp")
  if (-not $rspPaths.Contains($rp)) { $rspPaths.Add($rp) }
}
foreach ($rp in (Get-HistoricalRspPaths $root)) { if (-not $rspPaths.Contains($rp)) { $rspPaths.Add($rp) } }
foreach ($d in (Get-RspDefines (Get-HistoryGrepLines $root $rspPaths.ToArray() @("define:", "[-/]d:") 0))) {
  if (-not $universe.Contains($d) -and -not $histGlobalOnly.Contains($d)) { [void]$histRspOnly.Add($d) }
}
$lock = Read-PackageLock $root
$editorVer = Read-EditorVersion $root
$guidToName = @{}
foreach ($a in $scan.Asmdefs) {
  $meta = $a.Path + ".meta"
  if (-not $a.Name -or -not (Test-Path -LiteralPath $meta)) { continue }
  $gm = [regex]::Match([System.IO.File]::ReadAllText($meta), '(?m)^guid:\s*([0-9a-fA-F]{32})')
  if ($gm.Success) { $guidToName[$gm.Groups[1].Value.ToLowerInvariant()] = $a.Name }
}
# 同平台组、同类 csproj 的公共宏(残留宏判定的对照,键 = 平台组|类,类见 Get-PeerKind):同一次生成的同类
# csproj 里 Unity 内置宏与全局宏人人都有,只有各 asmdef 自己的 versionDefines 让它们不同。认不出平台组(无从
# 确认是同一平台的一批)或某键下不足两份 csproj 时无从对照,不收。
$peerCommon = @{}
$byGroup = @{}
foreach ($s in $specs) {
  if (-not $s.Asmdef) { continue }
  $j = Read-AsmdefJson $s.Asmdef
  if (-not $j) { continue }
  $d = Get-CsprojDefines $s.Text
  if ($null -eq $d) { continue }
  $g = Get-DefineGroup $d
  if (-not $g) { continue }
  $g = $g + "|" + (Get-PeerKind $j)
  if (-not $byGroup.ContainsKey($g)) { $byGroup[$g] = New-Object System.Collections.Generic.List[object] }
  $byGroup[$g].Add($d)
}
foreach ($g in @($byGroup.Keys)) {
  if ($byGroup[$g].Count -lt 2) { continue }
  $set = New-Object System.Collections.Generic.HashSet[string]
  foreach ($d in $byGroup[$g][0]) { [void]$set.Add($d) }
  for ($i = 1; $i -lt $byGroup[$g].Count; $i++) { $set.IntersectWith([string[]]$byGroup[$g][$i]) }
  $peerCommon[$g] = $set
}

$regen = New-Object System.Collections.Generic.List[string]
foreach ($s in $specs) {
  if (-not $s.Asmdef) { continue }
  $j = Read-AsmdefJson $s.Asmdef
  if (-not $j) { continue }
  $defs = Get-CsprojDefines $s.Text
  # 该程序集实际生效的 rsp 及其宏;$linger = 历史里有过、当前平台组没有、也不在这份 rsp 里的宏(csproj 不得有)。
  $rsp = Get-EffectiveRsp $root $s.Asmdef
  $rspDefs = $rsp.Defines
  $linger = New-Object System.Collections.Generic.HashSet[string]
  foreach ($d in $histGlobalOnly) { if (-not $rspDefs.Contains($d)) { [void]$linger.Add($d) } }
  foreach ($d in $histRspOnly) { if (-not $rspDefs.Contains($d)) { [void]$linger.Add($d) } }

  # 宏。$base = 该程序集按现值应有的宏里与被引方共用的那部分(csproj 里的 Unity 内置宏 + 当前平台组全局宏),
  # 给被引方 defineConstraints 求值用;平台组认不出时为 $null,带 defineConstraints 的被引方随之不判。
  $base = $null
  if ($null -ne $defs) {
    $group = Get-DefineGroup $defs
    if ($group -and $globals.ContainsKey($group)) {
      $expect = @($globals[$group])
      $own = @($j.versionDefines | Where-Object { $_ } | ForEach-Object { [string]$_.define } | Where-Object { $_ })
      foreach ($d in $expect) {
        if ($defs -notcontains $d) {
          $regen.Add($s.Name); Write-Host ("STALE-DEFINES {0}.csproj: 缺全局宏 {1}(ProjectSettings {2} 组有)" -f $s.Name, $d, $group)
        }
      }
      foreach ($d in $defs) {
        if ($universe.Contains($d) -and $expect -notcontains $d -and $own -notcontains $d -and -not $rspDefs.Contains($d)) {
          $regen.Add($s.Name); Write-Host ("STALE-DEFINES {0}.csproj: 多出全局宏 {1}(ProjectSettings {2} 组已无)" -f $s.Name, $d, $group)
        }
      }
      # 本程序集生效的 rsp 宏并入底数(与 csproj 的实际宏同口径)。
      $base = New-Object System.Collections.Generic.HashSet[string]
      foreach ($d in $defs) { if (-not $universe.Contains($d) -and -not $linger.Contains($d) -and -not $rspDefs.Contains($d) -and $own -notcontains $d) { [void]$base.Add($d) } }
      foreach ($d in $expect) { [void]$base.Add($d) }
      foreach ($d in $rspDefs) { [void]$base.Add($d) }
    }
    foreach ($d in $rspDefs) {
      if ($defs -notcontains $d) {
        $regen.Add($s.Name); Write-Host ("STALE-DEFINES {0}.csproj: 缺 csc.rsp 宏 {1}({2} 有)" -f $s.Name, $d, $rsp.Rel)
      }
    }
    $states = Get-VersionDefineStates $j $lock $root $editorVer
    foreach ($d in @($states | Where-Object { $_.State -eq $true } | ForEach-Object { $_.Define })) {
      if ($defs -notcontains $d) {
        $regen.Add($s.Name); Write-Host ("STALE-DEFINES {0}.csproj: 缺版本宏 {1}(asmdef versionDefines 条件成立)" -f $s.Name, $d)
      }
    }
    $allowed = @($states | Where-Object { $_.State -ne $false } | ForEach-Object { $_.Define })
    foreach ($d in $defs) {
      if ($linger.Contains($d) -and $allowed -notcontains $d) {
        $regen.Add($s.Name)
        if ($histRspOnly.Contains($d)) {
          $where = "该程序集当前没有生效的 csc.rsp"
          if ($rsp.Rel) { $where = "该程序集生效的 " + $rsp.Rel + " 里没有" }
          Write-Host ("STALE-DEFINES {0}.csproj: 多出 csc.rsp 宏 {1}({2},git 历史里有过)" -f $s.Name, $d, $where)
        }
        else { Write-Host ("STALE-DEFINES {0}.csproj: 多出全局宏 {1}(ProjectSettings 各平台组都已删除,git 历史里有过)" -f $s.Name, $d) }
      }
    }
    # 残留宏:本 csproj 独有(同平台组其余 csproj 都没有)、又不是全局宏(全局宏由上面各向判)、也不来自本
    # asmdef 条件成立或求不了值的 versionDefines——多半是条件已不成立或条目已删的 versionDefines 留下的。
    $peers = $null
    $pg = Get-DefineGroup $defs
    if ($pg) { $peers = $peerCommon[$pg + "|" + (Get-PeerKind $j)] }
    if ($null -ne $peers) {
      foreach ($d in $defs) {
        if ($peers.Contains($d) -or $universe.Contains($d) -or $linger.Contains($d) -or $rspDefs.Contains($d) -or $allowed -contains $d) { continue }
        $regen.Add($s.Name); Write-Host ("STALE-DEFINES {0}.csproj: 残留宏 {1}(同平台其余 csproj 都没有,也不来自该 asmdef 当前成立的 versionDefines)" -f $s.Name, $d)
      }
    }
  }

  # 引用集
  foreach ($r in @($j.references | Where-Object { $_ })) {
    $ref = [string]$r
    $gr = [regex]::Match($ref, '^GUID:([0-9a-fA-F]{32})$')
    if ($gr.Success) { $ref = $guidToName[$gr.Groups[1].Value.ToLowerInvariant()] }
    if (-not $ref) { continue }
    $target = Find-UnityAsmdefByName $scan $ref
    if ($target.Count -ne 1) { continue }
    $tj = Read-AsmdefJson $target[0].Path
    if (-not $tj -or -not (Test-AsmdefEditorPlatform $tj)) { continue }
    $dc = @($tj.defineConstraints | Where-Object { $_ } | ForEach-Object { [string]$_ })
    $compiled = $true
    if ($dc.Count -gt 0) {
      if ($null -eq $base) { continue }
      $tset = New-Object System.Collections.Generic.HashSet[string]
      foreach ($d in $base) { [void]$tset.Add($d) }
      foreach ($d in (Get-SureVersionDefines $tj $lock $root $editorVer)) { [void]$tset.Add($d) }
      $compiled = Test-DefineConstraints $dc $tset
    }
    $e = [regex]::Escape($ref)
    $listed = ([regex]::IsMatch($s.Text, '<ProjectReference\s+Include="(?:[^"]*[\\/])?' + $e + '\.csproj"') -or
               [regex]::IsMatch($s.Text, '<Reference\s+Include="' + $e + '"'))
    if ($compiled -and -not $listed) {
      $hint = ""
      if (-not (Test-Path -LiteralPath (Join-Path $root ($ref + ".csproj")))) { $hint = "(" + $ref + ".csproj 也不存在)" }
      $regen.Add($s.Name); Write-Host ("STALE-REFS {0}.csproj: asmdef 引用 {1},csproj 未引用{2}" -f $s.Name, $ref, $hint)
    } elseif (-not $compiled -and $listed) {
      $regen.Add($s.Name); Write-Host ("STALE-REFS {0}.csproj: 引用 {1},但它的 defineConstraints 在当前宏下不成立,Unity 不编它" -f $s.Name, $ref)
    }
  }
}
if ($regen.Count -gt 0) {
  $names = (@($regen) | Select-Object -Unique) -join ","
  Write-Host ("VERDICT: STALE-REGEN | " + $names + " | 引用集 / 宏只能由编辑器重生成:槽位编辑器里 AssetDatabase.Refresh(ImportAssetOptions.ForceUpdate) + Unity.CodeEditor.CodeEditor.CurrentEditor.SyncAll(),-InPlace 不修这一类")
  exit 3
}

# ── 比对 ───────────────────────────────────────────────────────────────────
$cmp = [System.StringComparer]::OrdinalIgnoreCase
$stale = New-Object System.Collections.Generic.List[object]
foreach ($s in $specs) {
  $listed = @([regex]::Matches($s.Text, '<Compile\s+Include="([^"]+)"') | ForEach-Object { $_.Groups[1].Value.Replace('\', '/') })
  if ($listed.Count -eq 0) { Exit-Infra ($s.Name + ".csproj 无 <Compile> 条目,形态不符") }
  $expectSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$s.Expect, $cmp)
  $listedSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$listed, $cmp)
  $onlyProj = @($listed | Where-Object { -not $expectSet.Contains($_) })
  $onlyDisk = @($s.Expect | Where-Object { -not $listedSet.Contains($_) })
  if ($onlyProj.Count -eq 0 -and $onlyDisk.Count -eq 0) { continue }
  $stale.Add($s)
  Write-Host ("STALE {0}.csproj: 磁盘 {1} 项 / csproj 列 {2} 项" -f $s.Name, $s.Expect.Count, $listed.Count)
  foreach ($p in @($onlyProj | Select-Object -First 5)) { Write-Host ("    csproj 多列(文件已不在磁盘上,CS2001): " + $p) }
  foreach ($p in @($onlyDisk | Select-Object -First 5)) { Write-Host ("    csproj 缺列(磁盘上有而未收录): " + $p) }
}

$checked = ($specs | ForEach-Object { $_.Name }) -join ","
if ($stale.Count -eq 0) { Write-Host ("VERDICT: FRESH | " + $checked); exit 0 }
$staleNames = ($stale | ForEach-Object { $_.Name }) -join ","
if (-not $InPlace) {
  Write-Host ("VERDICT: STALE | " + $staleNames + " | 重跑加 -InPlace 就地修复 <Compile> 列表,或回编辑器重生成")
  exit 1
}

# ── -InPlace:重写过期 csproj 的 <Compile> 列表 ───────────────────────────────
foreach ($s in $stale) {
  $out = New-Object System.Collections.Generic.List[string]
  $emitted = $false
  foreach ($line in [System.IO.File]::ReadAllLines($s.Csproj)) {
    if ([regex]::IsMatch($line, '<Compile\s+Include="')) {
      if (-not $emitted) {
        foreach ($r in $s.Expect) { $out.Add('    <Compile Include="' + $r.Replace('/', '\') + '" />') }
        $emitted = $true
      }
      continue
    }
    $out.Add($line)
  }
  [System.IO.File]::WriteAllLines($s.Csproj, $out, (New-Object System.Text.UTF8Encoding($true)))
}
Write-Host ("VERDICT: FIXED | " + $staleNames)
exit 0
