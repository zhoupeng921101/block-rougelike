# 自审触发判定测试.ps1 - 自审触发判定.ps1 假仓回归(五项触发各至少一正一反),连同按需篇判据表(校验库 RuleReadTable)
# 的另一个消费方 槽位领取「开工前读」与判据表自检 -CheckRuleTable。改 自审触发判定、判据表或 槽位领取 的开工前读后跑。
# 夹具落 %TEMP%、写动作绝不触真仓;此处裸 git 是夹具搭建、非交付路径。唯一读真仓的是 CT1:对主仓跑 -CheckRuleTable
# (只读 git ls-files 与文件原文),锁「判据表没有随产品代码改名漂移」——它红了,修判据表,不改用例。所在树没有服务端仓
# (Claude Code worktree 不带 Fantasy)时 CT1 改为直调 Get-RuleReadTableGap 只核客户端侧,不把环境缺件报成红。
# 跑法:powershell.exe -NoProfile -ExecutionPolicy Bypass -File tests\自审触发判定测试.ps1;末行 RESULT 全通过为过。
#
# 重点覆盖三处曾静默漏判的形态:
#   ①服务端 MongoDB 驱动写接口(UpdateOneAsync 等)只在内容里出现、路径不命中任何路径规则;
#   ②中文文件名进了**已提交** diff——git 缺省 core.quotepath 把它转成带引号的八进制转义串,
#     扩展名判据被尾引号挡住,ASSET-SETTLE / UI-EVIDENCE 漏判;
#   ③提交信息首行是空行——主题须取第一个非空行(与 校验库 Get-SubjectFormatGap 同口径)。
# RULES(R 段)另锁:路径判据(已提交的中文名图)、内容判据的三条输入路(已提交 .cs、已提交 .prefab、untracked .cs)、
# hunk 里以 +++ 开头的新增行照算内容、只看新增行(文件里早有的写法不算)、两端各自的判据;没命中时恰一行 not-required;
# 服务端功能代码面认 GameBase 与 Entity/Game Examples、不认 Entity/Generate(R7b / R10);untracked 文件读不到只 WARN 不 INFRA(N9)。
# 判据表自检(CT 段)另锁逐支核着落:同字段别的元素命中不抵一支落空、元素含顶层 | 单报(CT4c);.cs 只在注释 / 字面量里
# 命中的元素报零命中、.prefab 按原文(CT4d)。
# 开工前读(PW 段)经 SLOT_ACQUIRE_NOEXEC=1 dot-source 槽位领取.ps1 调 Get-PreworkRuleLines:新目录靠 DirRe(含服务端 GameBase)、
# 已有目录按已跟踪文件展开、前缀不分大小写与 \ /、两端都给、一篇没中、没给前缀、判不成走 degraded;PW5 静态核两处 ACQUIRED 出口之前都打。
# diff 基点护栏(DB 段,读隔离 LOCALAPPDATA 按 JSON 解析):两端算出分叉点各记 guard-ok、只给一端只记那一端、
# 无共同祖先回落记 degraded 且原 WARN 照打、参数 INFRA 两样都不记。
$ErrorActionPreference = "Stop"

$fx = Join-Path $env:TEMP ("flowtest-fx-selfreview-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $fx | Out-Null
# LOCALAPPDATA 隔离须早于 dot-source(理由同 单仓提交测试 同名段)。
$oldLad = $env:LOCALAPPDATA
$env:LOCALAPPDATA = Join-Path $fx "lad"

. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
$engine = Get-FlowEngine
$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
$target = Join-Path $dfDir "自审触发判定.ps1"
# 被测脚本按真 flow-config 取基线(ClientBaseline / FantasyBaseline),夹具分支名跟它走。
# 变量名不取 $flowCfg:PowerShell 变量名不分大小写,套件顶层的 $flowCfg 就是点源进来的 hook函数库 的缓存
# $script:FlowCfg,赋成裸表后本进程的 Get-FlowConfig 都拿到没解析路径的原表。
$suiteCfg = Import-PowerShellDataFile (Join-Path $dfDir "flow-config.psd1")
$cBase = $suiteCfg.ClientBaseline
$sBase = $suiteCfg.FantasyBaseline

function New-BranchRepo([string]$Path, [string]$Baseline) {
  New-GitRepo $Path
  if ($Baseline -ne "main") { G $Path ("branch -M " + $Baseline) | Out-Null }
}
function Commit-All([string]$Root, [string]$Msg) {
  G $Root "add -A" | Out-Null
  G $Root ("commit -q -m " + $Msg) | Out-Null
}
function Run-SR([string]$Client, [string]$Server, [string]$MsgText) {
  # $MsgText 空 = 不传 -MessageFile;非空则落夹具根下的提交信息文件(文本走文件,不穿 argv)。$Server 空 = 只判客户端。
  $ErrorActionPreference = "Continue"
  $a = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $target, "-ProjectDir", $Client)
  if ($Server) { $a += @("-FantasyRoot", $Server) }
  if ($MsgText) {
    Write-F $fx "commit-msg.txt" $MsgText
    $a += @("-MessageFile", (Join-Path $fx "commit-msg.txt"))
  }
  $n0 = @(Get-TelRows).Count
  $out = @(& $engine @a 2>&1 | ForEach-Object { [string]$_ })
  $code = $LASTEXITCODE
  # tel = 这一次新增的 diff 基点护栏行(self-review-diffbase/<端>)
  $tel = @(Get-TelRows | Select-Object -Skip $n0 | Where-Object { ([string]$_.guard).StartsWith("self-review-diffbase/", [System.StringComparison]::Ordinal) })
  return @{ code = $code; out = $out; text = ($out -join "`n"); tel = $tel }
}
function Get-Tel($R, [string]$Event, [string]$Guard) { return @($R.tel | Where-Object { $_.event -eq $Event -and $_.guard -eq $Guard }) }
function Verdict($R, [string]$Name) {
  # 回 "required" / "not-required" / ""(该行缺失)。
  $l = @($R.out | Where-Object { $_ -match ('^' + [regex]::Escape($Name) + '\s*:') } | Select-Object -First 1)
  if ($l.Count -eq 0) { return "" }
  if ($l[0] -match ':\s*not-required') { return "not-required" }
  if ($l[0] -match ':\s*required') { return "required" }
  return ""
}
function Rules($R) {
  # RULES 的全部行(每篇一行 required,或恰一行 not-required)。
  return @($R.out | Where-Object { $_ -match '^RULES\s*:' })
}
function Rule-Line($R, [string]$DocLeaf) {
  # 点名某篇的那行 required(按篇文件名找),没有回空串。
  $l = @(Rules $R | Where-Object { $_ -match ':\s*required\s' -and $_ -match ('/' + [regex]::Escape($DocLeaf) + ' <- ') } | Select-Object -First 1)
  if ($l.Count -eq 0) { return "" }
  return [string]$l[0]
}
function Run-CT([string[]]$Extra) {
  $ErrorActionPreference = "Continue"
  $a = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $target, "-CheckRuleTable") + @($Extra)
  $out = @(& $engine @a 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = $out; text = ($out -join "`n") }
}

$srvSub = "examples/Server/APP/Hotfix/Game Examples/Gate/Player"

try {
  # ================= 夹具 P(正例):各触发项都应命中 =================
  $pRoot = Join-Path $fx "P"
  $pClientRepo = Join-Path $pRoot "client"
  $pClient = Join-Path $pClientRepo "Demo"
  $pServer = Join-Path $pRoot "Fantasy"
  $shopDir = "Demo/Assets/GameScripts/HotFix/GameLogic/Module/Shop"
  New-BranchRepo $pClientRepo $cBase
  Write-F $pClientRepo "Demo/Assets/UI/订单卡.prefab" "prefab v1`n"
  Write-F $pClientRepo "$shopDir/ShopView.cs" "class ShopView {`n}`n"
  Write-F $pClientRepo "$shopDir/ShopSeenStore.cs" "class ShopSeenStore { }`n"   # 只在基线:PW 段按已跟踪文件展开前缀
  Commit-All $pClientRepo "base"
  G $pClientRepo "checkout -q -b feat" | Out-Null
  # 已提交:新增中文名 png + 修改既有中文名 prefab(②的主形态)
  Write-F $pClientRepo "Demo/Assets/Art/中文图.png" "png`n"
  Write-F $pClientRepo "Demo/Assets/UI/订单卡.prefab" "prefab v2`n  m_Name: m_btn_Mask`n"
  # RULES:AssetRaw/UI 下新增中文名图(路径判据);已提交 .cs 的新增行,其中一行以 ++ 开头(diff 里成了 +++ 开头)
  Write-F $pClientRepo "Demo/Assets/AssetRaw/UI/NewAtlas/demo/图标.png" "png`n"
  Write-F $pClientRepo "$shopDir/ShopView.cs" "class ShopView {`n  // m_btn_Mask 开关`n++n; img.SpriteBind = b;`n}`n"
  Commit-All $pClientRepo "feat"
  # 未提交 untracked:中文名 png(porcelain 路径)
  Write-F $pClientRepo "Demo/Assets/Art/新图标.png" "png`n"
  # RULES:untracked .cs 整份算新增
  Write-F $pClientRepo "$shopDir/ShopRewardRow.cs" "class ShopRewardRow { void T() { img.SpriteName = `"x`"; } }`n"

  # 服务端夹具(路径带空格):安全面内容判据按本作单机口径——文件读写、外部数据反序列化、起外部进程。
  New-BranchRepo $pServer $sBase
  Write-F $pServer "$srvSub/GiftPackEvalHelper.cs" "class A { void F() { } }`n"
  Commit-All $pServer "base"
  G $pServer "checkout -q -b feat" | Out-Null
  Write-F $pServer "$srvSub/GiftPackEvalHelper.cs" "class A { void F() { File.WriteAllText(p, s); } }`n"
  Write-F $pServer "$srvSub/InsertHelper.cs" "class B { void F() { var t = JsonConvert.DeserializeObject<T>(s); } }`n"
  Write-F $pServer "$srvSub/ReplaceHelper.cs" "class C { void F() { var t = JsonUtility.FromJson<T>(s); } }`n"
  Write-F $pServer "$srvSub/DeleteHelper.cs" "class D { void F() { Process.Start(exe); } }`n"
  Commit-All $pServer "feat"

  $r = Run-SR $pClient $pServer ""
  Assert-True ($r.code -eq 0) "P0 exit 0"
  # diff 基点护栏:两端都算出分叉点 -> 各记一行 guard-ok(来源 自审触发判定),不记 degraded
  Assert-True (@(Get-Tel $r "guard-ok" "self-review-diffbase/client").Count -eq 1 -and @(Get-Tel $r "guard-ok" "self-review-diffbase/server").Count -eq 1 -and @($r.tel | Where-Object { $_.event -eq "degraded" -or $_.src -ne "自审触发判定" }).Count -eq 0) ("DB1 两端分叉点都算出 -> 各记 guard-ok、不记 degraded(新增 " + $r.tel.Count + " 行)")
  Assert-True ((Verdict $r "SECURITY-REVIEW") -eq "required") "P1 SECURITY-REVIEW required on file IO / deserialization / process APIs"
  foreach ($f in @("GiftPackEvalHelper.cs", "InsertHelper.cs", "ReplaceHelper.cs", "DeleteHelper.cs")) {
    Assert-True ($r.text -match [regex]::Escape($f)) "P1 security hit lists $f"
  }
  Assert-True ((Verdict $r "ASSET-SETTLE") -eq "required") "P2 ASSET-SETTLE required on CJK png"
  Assert-True ($r.text -match 'Demo/Assets/Art/中文图\.png(\r?\n|$)') "P2 committed CJK png listed unquoted/unescaped"
  Assert-True ($r.text -match 'Demo/Assets/Art/新图标\.png(\r?\n|$)') "P2 untracked CJK png listed unquoted/unescaped"
  Assert-True ($r.text -notmatch '\\[0-7]{3}') "P2 no octal-escaped path in output"
  Assert-True ((Verdict $r "UI-EVIDENCE") -eq "required") "P3 UI-EVIDENCE required on committed CJK prefab"

  # ---- RULES(⑤):每篇一行,<- 后是第一个命中文件,另有命中注 (+N more) ----
  Assert-True ((Rule-Line $r "ui-image-assets.md") -match '<- Demo/Assets/AssetRaw/UI/NewAtlas/demo/图标\.png') ("R1 路径判据:AssetRaw/UI 下的中文名图点名 ui-image-assets | " + (Rule-Line $r "ui-image-assets.md"))
  Assert-True ((Rule-Line $r "ui-blocking-layer.md") -match '<- Demo/Assets/GameScripts/HotFix/GameLogic/Module/Shop/ShopView\.cs \(\+1 more\)$') ("R2 内容判据:已提交 .cs 与已提交 .prefab 的新增行都算 | " + (Rule-Line $r "ui-blocking-layer.md"))
  # ui-image-assets 的另两个命中只能来自内容判据:ShopView.cs 里以 ++ 开头的新增行(diff 里成了 +++ 开头,SpriteBind)
  # 与 untracked 的 ShopRewardRow.cs(SpriteName,整份算新增)。两条各贡献一个,少一个计数即对不上。
  Assert-True ((Rule-Line $r "ui-image-assets.md") -match '图标\.png \(\+2 more\)$') ("R3/R4 hunk 里以 +++ 开头的新增行照算内容、untracked .cs 整份算新增 | " + (Rule-Line $r "ui-image-assets.md"))
  Assert-True ((Rule-Line $r "ui-lifecycle.md") -eq "" -and (Rule-Line $r "ui-patterns.md") -eq "") "R8 没碰的面不点名(ui-lifecycle / ui-patterns:没有 Panel / Window / Part 件)"
  Assert-True ((Rule-Line $r "tengine-conventions.md") -match '<- Demo/Assets/GameScripts/HotFix/GameLogic/Module/Shop/\S+\.cs') ("R11 碰客户端脚本即点名 tengine-conventions | " + (Rule-Line $r "tengine-conventions.md"))
  # 本作判据表没有服务端篇(服务端通道已移除):服务端夹具的改动只进安全面,不点名任何按需篇。
  $badRules = @(Rules $r | Where-Object { $_ -notmatch '^RULES\s*:\s*required\s+\.claude/\S+\.md <- \S' })
  Assert-True ($badRules.Count -eq 0 -and (Rules $r).Count -eq 3) ("R9 有命中时每行都是 required <篇> <- <文件>,没有 not-required 行,恰三篇 | " + ((Rules $r) -join " / "))

  # FIX-QUALIFY:首行空行(③)
  $r = Run-SR $pClient $pServer "`r`n【修复】订单: 空行开头的修复主题`r`n`r`n正文没有结论`r`n"
  Assert-True ((Verdict $r "FIX-QUALIFY") -eq "required") "P4 FIX-QUALIFY required when subject follows a blank first line"
  $r = Run-SR $pClient $pServer "【修复】订单: 结论是根治但没写那个词`n`n定性:根治`n"
  Assert-True ((Verdict $r "FIX-QUALIFY") -eq "required") "P5 FIX-QUALIFY required on 根治 without 不变量"
  $r = Run-SR $pClient $pServer "`n`n【修复】订单: 空行开头但已定性`n`n定性:补丁,根源未知`n"
  Assert-True ((Verdict $r "FIX-QUALIFY") -eq "not-required") "N4 FIX-QUALIFY not-required when blank-led fix carries 补丁"
  $r = Run-SR $pClient $pServer "`n【新增】订单: 非修复类`n"
  Assert-True ((Verdict $r "FIX-QUALIFY") -eq "not-required") "N5 FIX-QUALIFY not-required on non-fix verb"

  # ================= 夹具 N(反例):各触发项都不应命中 =================
  $nRoot = Join-Path $fx "N"
  $nClientRepo = Join-Path $nRoot "client"
  $nClient = Join-Path $nClientRepo "Demo"
  $nServer = Join-Path $nRoot "Fantasy"
  New-BranchRepo $nClientRepo $cBase
  Write-F $nClientRepo "Demo/Assets/Art/旧图.png" "png v1`n"
  # 文件里早就有 SpriteName,本轮只改另一行:RULES 只看新增行,不该点名 ui-image-assets。
  # 放在 GameScripts 外(编辑器代码):GameScripts / Launcher 下的 .cs 一律点名 tengine-conventions,本夹具要一篇不中。
  $legacyCs = "Demo/Assets/Editor/Shop/ShopLegacy.cs"
  Write-F $nClientRepo $legacyCs "class L {`n  void A() { img.SpriteName = `"a`"; }`n  void B() { }`n}`n"
  Commit-All $nClientRepo "base"
  G $nClientRepo "checkout -q -b feat" | Out-Null
  # 改既有 png(非新增)+ 新增非资产文本:ASSET-SETTLE / UI-EVIDENCE 都不该触发
  Write-F $nClientRepo "Demo/Assets/Art/旧图.png" "png v2`n"
  Write-F $nClientRepo "Demo/说明.txt" "doc`n"
  Write-F $nClientRepo $legacyCs "class L {`n  void A() { img.SpriteName = `"a`"; }`n  void B() { var x = 1; }`n}`n"
  Commit-All $nClientRepo "feat"

  New-BranchRepo $nServer $sBase
  Write-F $nServer "$srvSub/PlainHelper.cs" "class E { }`n"
  Commit-All $nServer "base"
  G $nServer "checkout -q -b feat" | Out-Null
  # 形似但不是安全面调用:MyFile.WriteAllText(前无词界)/ 自有方法名 / 普通 Find( 不应命中内容判据
  Write-F $nServer "$srvSub/PlainHelper.cs" "class E { void UpdateOneThing() { } void G() { list.Find(x => x > 0); MyFile.WriteAllText(p); UpdateOneThing(); } }`n"
  Commit-All $nServer "feat"

  $r = Run-SR $nClient $nServer ""
  Assert-True ($r.code -eq 0) "N0 exit 0"
  Assert-True ((Verdict $r "SECURITY-REVIEW") -eq "not-required") "N1 SECURITY-REVIEW not-required on look-alike names"
  Assert-True ((Verdict $r "ASSET-SETTLE") -eq "not-required") "N2 ASSET-SETTLE not-required on modified asset / new txt"
  Assert-True ((Verdict $r "UI-EVIDENCE") -eq "not-required") "N3 UI-EVIDENCE not-required without prefab"
  Assert-True ((Verdict $r "FIX-QUALIFY") -eq "not-required") "N6 FIX-QUALIFY not-required without -MessageFile"
  $n7 = @(Rules $r)
  Assert-True ((Rule-Line $r "ui-image-assets.md") -eq "" -and $n7.Count -eq 1 -and $n7[0] -match 'not-required') ("N7 客户端早有的 SpriteName 不算本轮;服务端改动在本作判据表里一篇不点名 | " + ($n7 -join " / "))
  $r = Run-SR $nClient "" ""
  $nr = @(Rules $r)
  Assert-True ($r.code -eq 0 -and $nr.Count -eq 1 -and $nr[0] -match '^RULES\s*:\s*not-required\b') ("N8 只判客户端、一篇没中:恰一行 RULES not-required | " + ($nr -join " / "))
  Assert-True ($r.tel.Count -eq 1 -and @(Get-Tel $r "guard-ok" "self-review-diffbase/client").Count -eq 1) ("DB1b 只给客户端 -> 只有客户端那一步走到(服务端两样都不记),实得 " + $r.tel.Count + " 行")

  # DB2 算不出分叉点(HEAD 与基线无共同祖先)-> 原 WARN 照打、回落按分支 tip 比照常出判定;记 degraded,不记 guard-ok
  $oClientRepo = Join-Path $fx "O\client"
  New-BranchRepo $oClientRepo $cBase
  G $oClientRepo "checkout -q --orphan feat" | Out-Null
  Write-F $oClientRepo "Demo/说明.txt" "orphan`n"
  Commit-All $oClientRepo "orphan"
  $r = Run-SR (Join-Path $oClientRepo "Demo") "" ""
  $dbDeg = @(Get-Tel $r "degraded" "self-review-diffbase/client")
  Assert-True ($r.code -eq 0 -and $r.text -match ("(?m)^SELF-REVIEW TRIGGERS : WARN - 算不出 HEAD 与 '" + [regex]::Escape($cBase) + "' 的分叉点") -and (Verdict $r "SECURITY-REVIEW") -ne "") ("DB2 算不出分叉点:原 WARN 照打、五项照判 exit 0 | code=" + $r.code)
  Assert-True ($dbDeg.Count -eq 1 -and $dbDeg[0].key -eq "self-review-diffbase-fallback" -and $dbDeg[0].src -eq "自审触发判定" -and $dbDeg[0].detail -match ('baseline=' + [regex]::Escape($cBase) + '$') -and @(Get-Tel $r "guard-ok" "self-review-diffbase/client").Count -eq 0) ("DB2b 记一行 degraded(key self-review-diffbase-fallback),不记 guard-ok | " + $(if ($dbDeg.Count) { $dbDeg[0].detail } else { "无" }))
  Assert-True (@([regex]::Matches($r.text, '(?m)^WARN ')).Count -eq 0) "DB2c 入账不另打一行「WARN 」(Write-Degraded 自带那行已收掉)"

  # N9 untracked .cs 被独占打开、读不到:RULES 内容判据跳过它并打 WARN,不升 INFRA,其余照判
  $lockRel = "Demo/Assets/Editor/Shop/ShopLocked.cs"
  Write-F $nClientRepo $lockRel "class K { void F() { FeatureGateBinder.PassGate(1); } }`n"
  $lockFs = [System.IO.File]::Open((Join-Path $nClientRepo $lockRel), [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::None)
  try { $r = Run-SR $nClient "" "" } finally { $lockFs.Dispose() }
  [System.IO.File]::Delete((Join-Path $nClientRepo $lockRel))
  $nr = @(Rules $r)
  Assert-True ($r.code -eq 0 -and $r.text -match '(?m)^SELF-REVIEW TRIGGERS : WARN - 读不到 untracked 文件 .*ShopLocked\.cs' -and $r.text -notmatch 'INFRA' -and $nr.Count -eq 1 -and $nr[0] -match 'not-required' -and (Verdict $r "ASSET-SETTLE") -eq "required") ("N9 untracked 文件读不到:打 WARN、跳过该文件,exit 0、其余四项照判 | code=" + $r.code + " | " + ($nr -join " / "))

  # ================= 夹具 G:服务端功能代码面 = Hotfix + GameBase(+ Entity/Game Examples),导出生成物不算 =================
  $gServer = Join-Path $fx "G-Fantasy"
  New-BranchRepo $gServer $sBase
  Write-F $gServer "examples/Server/APP/GameBase/Gate/Player/LedgerHelper.cs" "class LedgerHelper { }`n"
  Write-F $gServer "examples/Server/APP/Entity/Generate/GameConfig/shop.TbShop.cs" "class TbShop { }`n"
  Commit-All $gServer "base"
  G $gServer "checkout -q -b feat" | Out-Null
  Write-F $gServer "examples/Server/APP/GameBase/Gate/Player/LedgerHelper.cs" "class LedgerHelper { int n; }`n"
  Write-F $gServer "examples/Server/APP/Entity/Generate/GameConfig/shop.TbShop.cs" "class TbShop { int id; }`n"
  Commit-All $gServer "feat"
  # 客户端用 N 夹具(N8 已证它一篇不点名),RULES 行全部出自服务端;Generate 排序在 GameBase 前,误中就成第一个命中
  $r = Run-SR $nClient $gServer ""
  $gr = @(Rules $r)
  Assert-True ($r.code -eq 0 -and $gr.Count -eq 1 -and $gr[0] -match 'not-required') ("R10 本作判据表没有服务端篇:服务端 GameBase / Entity 改动一篇不点名 | " + ($gr -join " / "))

  # ================= CT:判据表自检 -CheckRuleTable =================
  # CT1 唯一读真仓的用例(只读):主仓上判据表每篇存在、每支判据有命中。红了 = 产品代码改名 / 搬家让判据表漂移,修判据表。
  # 所在树没有服务端仓(Claude Code worktree 不带 Fantasy)时入口会判 INFRA——那是环境缺件不是漂移,改为直调只核客户端侧。
  $realCfg = Get-FlowConfig
  $realFantasy = [string]$realCfg.FantasyRoot
  if ($realFantasy -and (Test-Path -LiteralPath (Join-Path $realFantasy ".git"))) {
    $ct = Run-CT @()
    Assert-True ($ct.code -eq 0 -and $ct.text -match '(?m)^RULE-TABLE\s*:\s*PASS') ("CT1 主仓判据表零漂移 | " + $ct.text)
  } else {
    $realDoc = Join-Path ([string]$realCfg.RepoRoot) "Demo"
    $realClient = if (Test-Path -LiteralPath (Join-Path $realDoc ".git")) { $realDoc } else { [string]$realCfg.RepoRoot }
    $ctClient = & {
      . (Join-Path $dfDir "hooks\校验库.ps1")
      $rows = @($script:RuleReadTable | Where-Object { $_.Side -eq "client" })
      Get-RuleReadTableGap $realClient "" $realDoc $rows
    }
    Assert-True ($ctClient.Count -eq 0) ("CT1 主仓判据表零漂移(服务端仓不在:" + $realFantasy + ",只核客户端侧) | " + ($ctClient -join " / "))
  }
  # CT2 反例:N 夹具里没有篇、绝大多数判据也零命中 -> exit 1,逐条列缺口
  $ct = Run-CT @("-ProjectDir", $nClient, "-FantasyRoot", $nServer)
  Assert-True ($ct.code -eq 1 -and $ct.text -match '(?m)^RULE-TABLE\s*:\s*FAIL' -and $ct.text -match '(?m)^RULE-TABLE GAP\s*:.*篇不存在' -and $ct.text -match '(?m)^RULE-TABLE GAP\s*:.*零命中') ("CT2 缺篇 / 零命中逐条报、exit 1 | code=" + $ct.code)
  $telBefore = @(Get-TelRows).Count
  $ct = Run-CT @("-Slot", "1")
  Assert-True ($ct.code -eq 2 -and $ct.text -match 'INFRA') "CT3 -CheckRuleTable 混入 -Slot 判 INFRA"
  Assert-True (@(Get-TelRows | Select-Object -Skip $telBefore | Where-Object { $_.guard -like "self-review-diffbase/*" }).Count -eq 0) "CT3b 参数 INFRA(走不到 diff 基点)-> 护栏行两样都不记"
  # CT3c flow-config 缺基线键 -> INFRA 点名该键,不回落成写死的 main。被测脚本经 $PSScriptRoot 找配置,
  # 故把它连同 hooks 复制进夹具、换一份删掉 ClientBaseline 的配置再跑。
  $stubDf = Join-Path $fx "stubcfg\Demo\.claude\devflow"
  [System.IO.Directory]::CreateDirectory((Join-Path $stubDf "hooks")) | Out-Null
  Copy-Item $target $stubDf -Force
  Copy-Item (Join-Path $dfDir "hooks\*.ps1") (Join-Path $stubDf "hooks") -Force
  $cfgText = [System.IO.File]::ReadAllText((Join-Path $dfDir "flow-config.psd1"))
  [System.IO.File]::WriteAllText((Join-Path $stubDf "flow-config.psd1"), ($cfgText -replace '(?m)^\s*ClientBaseline\s*=.*\r?\n', ''), (New-Object System.Text.UTF8Encoding($true)))
  $telBefore = @(Get-TelRows).Count
  $stubOut = @(& $engine -NoProfile -ExecutionPolicy Bypass -File (Join-Path $stubDf "自审触发判定.ps1") -ProjectDir $nClient -FantasyRoot $nServer 2>&1 | ForEach-Object { [string]$_ })
  $stubCode = $LASTEXITCODE
  Assert-True ($stubCode -eq 2 -and ($stubOut -join "`n") -match 'INFRA - missing flow-config key ClientBaseline') ("CT3c 缺 ClientBaseline -> INFRA 点名该键 | code=" + $stubCode)
  Assert-True (@(Get-TelRows | Select-Object -Skip $telBefore | Where-Object { $_.guard -like "self-review-diffbase/*" }).Count -eq 0) "CT3d 配置 INFRA(走不到 diff 基点)-> 护栏行两样都不记"
  # CT4 注入小表直测 Get-RuleReadTableGap(校验库):正例全有着落;反例各缺一类各报一条
  $tRoot = Join-Path $fx "CT"
  $tClientRepo = Join-Path $tRoot "client"; $tServer = Join-Path $tRoot "Fantasy"
  New-BranchRepo $tClientRepo $cBase
  Write-F $tClientRepo "Demo/Assets/X/A.cs" "class A { void F() { FooApi.Go(); } }`n"
  # CT4d 用:旧名只留在注释与字面量里(代码里已改名),prefab 原文照认
  Write-F $tClientRepo "Demo/Assets/X/C.cs" "// LineOnlyApi.Go()`n/* BlockOnlyApi */ class C { string s = `"StrOnlyApi`"; void G() { NewApi.Go(); } }`n"
  Write-F $tClientRepo "Demo/Assets/X/P.prefab" "m_Name: PrefabOnlyApi`n"
  Write-F $tClientRepo "Demo/.claude/a.md" "a`n"
  Write-F $tClientRepo "Demo/.claude/b.md" "b`n"
  Commit-All $tClientRepo "base"
  New-BranchRepo $tServer $sBase
  Write-F $tServer "srv/Hotfix/B.cs" "class B { }`n"
  Commit-All $tServer "base"
  $tDocRoot = Join-Path $tClientRepo "Demo"
  # 判据字段既给数组(判据表的写法)也给单串(当一元素数组),两种都认。
  $tTable = @(
    @{ Doc = '.claude/a.md'; Side = 'client'; PathRe = @('^Demo/Assets/X/.*\.cs$'); DirRe = @(); ContentRe = @('\bFooApi\b', '\bF\(\)') },
    @{ Doc = '.claude/b.md'; Side = 'server'; PathRe = ''; DirRe = '^srv/Hotfix(/|$)'; ContentRe = '' })
  $tBad = @(
    @{ Doc = '.claude/a.md'; Side = 'client'; PathRe = '^Demo/Assets/Gone/'; DirRe = ''; ContentRe = '\bBarApi\b' },
    @{ Doc = '.claude/missing.md'; Side = 'server'; PathRe = ''; DirRe = '^srv/Gone(/|$)'; ContentRe = '' })
  # 逐支核:同一字段里别的元素命中不抵这一支落空;元素含顶层 | 直接报(括号 / 字符类里的 | 与转义的 \| 不算)
  $tAlt = @(
    @{ Doc = '.claude/a.md'; Side = 'client'
       PathRe = @('^Demo/Assets/X/.*\.cs$', '^Demo/Assets/Renamed/.*\.cs$')
       DirRe = @('^Demo/Assets/(X|Y)(/|$)', '^Demo/Assets/[|]X(/|$)|^Demo/Assets/X(/|$)')
       ContentRe = @('\bFooApi\b', '\bOldApi\b', 'Foo\|Api|\bFooApi\b') })
  # 只在 .cs 注释 / 字面量里命中的元素报零命中;代码里的与 .prefab 原文里的照算着落
  $tCmt = @(
    @{ Doc = '.claude/a.md'; Side = 'client'; PathRe = @(); DirRe = @()
       ContentRe = @('\bNewApi\b', '\bLineOnlyApi\b', '\bBlockOnlyApi\b', '\bStrOnlyApi\b', '\bPrefabOnlyApi\b') })
  $ctRes = & {
    . (Join-Path $dfDir "hooks\校验库.ps1")
    # 不套 @():被调函数以 `return , $x` 回数组,外面再套 @() 得「元素是数组的 1 元数组」(静态扫描 R15 同款)。
    @{ Good = (Get-RuleReadTableGap $tClientRepo $tServer $tDocRoot $tTable); Bad = (Get-RuleReadTableGap $tClientRepo $tServer $tDocRoot $tBad)
       Alt = (Get-RuleReadTableGap $tClientRepo "" $tDocRoot $tAlt); Cmt = (Get-RuleReadTableGap $tClientRepo "" $tDocRoot $tCmt) }
  }
  Assert-True ($ctRes.Good.Count -eq 0) ("CT4a 路径 / 目录 / 内容判据都有着落、篇都在 -> 零缺口 | " + ($ctRes.Good -join " / "))
  $bt = $ctRes.Bad -join "`n"
  Assert-True ($ctRes.Bad.Count -eq 4 -and $bt -match 'missing\.md 篇不存在' -and $bt -match 'PathRe\[0\] .*零命中' -and $bt -match 'DirRe\[0\] .*零命中' -and $bt -match 'ContentRe\[0\] .*零命中') ("CT4b 缺篇 / PathRe / DirRe / ContentRe 各报一条 | " + $bt)
  $at = $ctRes.Alt -join "`n"
  $altWant = @("PathRe\[1\] '\^Demo/Assets/Renamed/.*零命中", "ContentRe\[1\] '\\bOldApi\\b' .*零命中", "DirRe\[1\] .*含顶层 \|", "ContentRe\[2\] .*含顶层 \|")
  $altOk = ($ctRes.Alt.Count -eq $altWant.Count)
  foreach ($w in $altWant) { if ($at -notmatch $w) { $altOk = $false } }
  Assert-True $altOk ("CT4c 同字段别的元素命中不抵一支落空、顶层 | 单报(括号与字符类里的不算) | " + $at)
  $mt = $ctRes.Cmt -join "`n"
  $cmtWant = @("ContentRe\[1\] '\\bLineOnlyApi\\b' .*零命中", "ContentRe\[2\] '\\bBlockOnlyApi\\b' .*零命中", "ContentRe\[3\] '\\bStrOnlyApi\\b' .*零命中")
  $cmtOk = ($ctRes.Cmt.Count -eq $cmtWant.Count)
  foreach ($w in $cmtWant) { if ($mt -notmatch $w) { $cmtOk = $false } }
  Assert-True $cmtOk ("CT4d .cs 只在注释 / 字面量里命中的元素报零命中,代码与 .prefab 原文里的照算着落 | " + $mt)

  # ================= PW:槽位领取「开工前读」(同一张判据表的事前口径) =================
  $acquireScript = Join-Path $dfDir "槽位领取.ps1"
  $pw = & {
    $oldNoExec = $env:SLOT_ACQUIRE_NOEXEC
    try {
      $env:SLOT_ACQUIRE_NOEXEC = '1'
      . $acquireScript -Topic 'noexec-probe'
      @{
        # 同上,不套 @()
        Both  = (Get-PreworkRuleLines $pClientRepo $pServer @("Demo/Assets/AssetRaw/UI/NewAtlas/NewThing/", "unityproject\assets\gamescripts\hotfix\gamelogic\module\shop") @("examples/Server/APP/Hotfix/Game Examples/Gate/Player"))
        Miss  = (Get-PreworkRuleLines $pClientRepo "" @("Demo/说明.txt") @())
        GBase = (Get-PreworkRuleLines $pClientRepo $pServer @() @("examples/Server/APP/GameBase/Gate/NewThing", "examples/Server/APP/GameBase/Gate/Quest/NewThing"))
        Empty = (Get-PreworkRuleLines $pClientRepo $pServer @() @(" "))
        Bad   = (Get-PreworkRuleLines (Join-Path $fx "no-such-repo") "" @("Demo/Assets/X") @())
      }
    } finally { $env:SLOT_ACQUIRE_NOEXEC = $oldNoExec }
  }
  $want = @(
    '^开工前读:\.claude/rules-ondemand/tengine-conventions\.md <- unityproject\\assets\\gamescripts\\hotfix\\gamelogic\\module\\shop$',
    '^开工前读:\.claude/rules-ondemand/ui-image-assets\.md <- Demo/Assets/AssetRaw/UI/NewAtlas/NewThing/$',
    '^开工前读:\.claude/references/systems/local-storage\.md <- unityproject\\assets\\gamescripts\\hotfix\\gamelogic\\module\\shop$',
    '^开工前读:\.claude/rules-ondemand/server-perf\.md <- examples/Server/APP/Hotfix/Game Examples/Gate/Player$')
  $pwOk = ($pw.Both.Count -eq $want.Count)
  for ($i = 0; $pwOk -and $i -lt $want.Count; $i++) { if ($pw.Both[$i] -notmatch $want[$i]) { $pwOk = $false } }
  Assert-True $pwOk ("PW1 新目录靠 DirRe、已有目录按已跟踪文件展开(大小写与 \ 不计)、两端都给,客户端在前 | " + ($pw.Both -join " / "))
  Assert-True ($pw.Miss.Count -eq 1 -and $pw.Miss[0] -match '^开工前读:无') ("PW2 所给前缀一篇没中:恰一行「开工前读:无」 | " + ($pw.Miss -join " / "))
  Assert-True ($pw.Empty.Count -eq 0) "PW3 没给前缀(空白不算)不打任何行"
  Assert-True ($pw.GBase.Count -eq 2 -and $pw.GBase[0] -match '^开工前读:\.claude/references/systems/quest-stat\.md <- examples/Server/APP/GameBase/Gate/Quest/NewThing$' -and $pw.GBase[1] -match '^开工前读:\.claude/rules-ondemand/server-perf\.md <- examples/Server/APP/GameBase/Gate/NewThing\(另 1 条前缀\)$') ("PW6 服务端 GameBase 下的新目录靠 DirRe 点名 server-perf、其 Quest 子目录另点 quest-stat | " + ($pw.GBase -join " / "))
  $pwTel = @(Get-ChildItem (Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry") -Filter "wf-*.jsonl" -EA SilentlyContinue |
             ForEach-Object { [System.IO.File]::ReadAllLines($_.FullName) } | Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json } |
             Where-Object { $_.guard -eq "rules-prework" })
  $pwDeg = @($pwTel | Where-Object { $_.event -eq "degraded" -and $_.key -eq "rules-prework-undetermined" })
  $pwOkEv = @($pwTel | Where-Object { $_.event -eq "guard-ok" })
  Assert-True ($pw.Bad.Count -eq 0 -and $pwDeg.Count -eq 1 -and $pwOkEv.Count -eq 3) ("PW4 判不成:不抛、不打开工前读行,记一次 degraded;判成的三次记 guard-ok、没给前缀的不记(degraded " + $pwDeg.Count + " / guard-ok " + $pwOkEv.Count + ")")
  # PW5 静态:两处 ACQUIRED 出口之前都打开工前读,且行在 csproj 判定之后、免启分支之前算好(就绪失败的出口不打)
  $acqSrc = [System.IO.File]::ReadAllText($acquireScript)
  $printAt = [regex]::Matches($acqSrc, [regex]::Escape('foreach ($l in $prework) { Write-Host $l }') + '\s+' + [regex]::Escape('Write-Verdict ("ACQUIRED | slot="'))
  $calcRe = [regex]::Escape('Write-CsprojRegenNotice $regen ([bool]$NoUnity)') + '[\s\S]{0,200}?' + [regex]::Escape('$prework = Get-PreworkRuleLines $slotRoot $fantasyRoot $Paths $FantasyPaths') + '\s+' + [regex]::Escape('if ($NoUnity -and -not $regen.Stale)')
  Assert-True ($printAt.Count -eq 2 -and [regex]::IsMatch($acqSrc, $calcRe) -and [regex]::Matches($acqSrc, [regex]::Escape('= Get-PreworkRuleLines ')).Count -eq 1) ("PW5 两处 ACQUIRED 之前各打一次、计算恰一处且在 csproj 判定之后(打印处 " + $printAt.Count + ")")
}
finally {
  $env:LOCALAPPDATA = $oldLad
  Remove-FixtureTree $fx
}
Exit-TestSuite
