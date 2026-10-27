# 单仓提交测试.ps1 - 单仓提交.ps1 假仓回归矩阵(script-authoring「验收检查」里涉 devflow 脚本
# 回归的承载之一)。夹具落 %TEMP%、绝不触真仓;此处裸 git 是夹具搭建、非交付路径。
# 跑法:powershell.exe -File tests\单仓提交测试.ps1;末行 RESULT 全通过为过。
# 遥测(读隔离 LOCALAPPDATA,按 JSON 解析):S9b / S13 / S13b 锁图集还原护栏(没得剔两样都不记 / 还原成了 guard-ok /
# 还原没成 degraded),R0-R2 锁交付关联号(无号不写 run,有号时结论行与异常行都带)。
$ErrorActionPreference = "Stop"

# 夹具路径按次唯一(GUID),收尾即删——理由同 集成交付测试:固定路径 + 只在开跑清一次,
# 遇 git 句柄短暂滞留导致清理失败时会带着半残夹具往下跑、成片假失败。
$fx = Join-Path $env:TEMP ("flowtest-fx-commit-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $fx | Out-Null

# LOCALAPPDATA 隔离必须早于下方 dot-source,且早于任何 Run-FC:hook函数库 在载入时一次性把
# $script:WfStateRoot 定成 <LOCALAPPDATA>\claude-wf-3b,载入后再改本变量对当前进程不生效;
# 子进程(Run-FC 起的 单仓提交.ps1)则按启动时的环境变量取值。不隔离的话被测脚本的遥测
# 直写真 claude-wf-3b——run_tests 的 LEAK 守卫抓的正是这个。
$oldLad = $env:LOCALAPPDATA
$env:LOCALAPPDATA = Join-Path $fx "lad"

. (Join-Path (Split-Path (Split-Path $PSCommandPath -Parent) -Parent) "hooks\hook函数库.ps1")
$engine = Get-FlowEngine
$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent   # .claude/devflow
$flowCommit = Join-Path $dfDir "单仓提交.ps1"
# 本矩阵用真 flow-config(不注入合成配置),服务端夹具目录名须与 ServerDirName 同名,
# 否则被测脚本的服务端通道判定(仓根 leaf)不命中,S10 之类会假通过。
$srvDir = (Import-PowerShellDataFile (Join-Path $dfDir "flow-config.psd1")).ServerDirName
$hookLib = Join-Path $dfDir "hooks\hook函数库.ps1"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")

function Run-FC([string[]]$FcArgs) {
  # 函数内降为 Continue:子进程 stderr 经 2>&1 成 ErrorRecord,Stop 下会炸掉整个套件而非落成一条 FAIL。
  # tel = 这一次新增的遥测行(隔离 LOCALAPPDATA,按 JSON 解析;读取 = 夹具库 Get-TelRows)。
  $ErrorActionPreference = "Continue"
  $n0 = @(Get-TelRows).Count
  $out = & $engine -NoProfile -File $flowCommit @FcArgs 2>&1 | ForEach-Object { [string]$_ }
  $code = $LASTEXITCODE
  $verdict = @($out | Where-Object { $_ -match '^VERDICT: ' } | Select-Object -Last 1)
  $v = if ($verdict.Count -gt 0) { $verdict[0] } else { "" }
  return @{ code = $code; out = $out; verdict = $v; tel = @(Get-TelRows | Select-Object -Skip $n0) }
}
function Get-AtlasGuard($R) { return @($R.tel | Where-Object { $_.guard -eq "slot-atlas-restore" }) }
# 交付关联号:本套件只在 R1 显式设,其余用例一律在无该变量的环境里跑(防外层环境带进来)。
$script:OldRunId = $env:FLOW_DELIVER_RUN
Remove-Item Env:\FLOW_DELIVER_RUN -ErrorAction SilentlyContinue
# ---------- fixtures ----------
$mainRepo = Join-Path $fx "MainRepo"
$bare = Join-Path $fx "origin-main.git"
New-Item -ItemType Directory -Force -Path $mainRepo | Out-Null
G $mainRepo "init -q -b main" | Out-Null
G $mainRepo "config user.email t@t.t" | Out-Null
G $mainRepo "config user.name t" | Out-Null
[System.IO.File]::WriteAllText((Join-Path $mainRepo "README.md"), "readme`n")
[System.IO.File]::WriteAllText((Join-Path $mainRepo ".gitignore"), ".gate/`n")
G $mainRepo "add -A" | Out-Null
G $mainRepo "commit -q -m init" | Out-Null
git init -q --bare $bare
G $mainRepo ("remote add origin `"" + $bare + "`"") | Out-Null
G $mainRepo "push -q -u origin main" | Out-Null

function W([string]$Rel, [string]$Content) {
  $p = Join-Path $mainRepo $Rel
  New-Item -ItemType Directory -Force -Path (Split-Path $p -Parent) | Out-Null
  [System.IO.File]::WriteAllText($p, $Content, (New-Object System.Text.UTF8Encoding($false)))
}
function L([string]$Name, [string[]]$Paths) {
  $p = Join-Path $fx $Name
  [System.IO.File]::WriteAllLines($p, [string[]]$Paths, (New-Object System.Text.UTF8Encoding($false)))
  return $p
}
function M([string]$Name, [string]$Text) {
  $p = Join-Path $fx $Name
  [System.IO.File]::WriteAllText($p, $Text, (New-Object System.Text.UTF8Encoding($false)))
  return $p
}

# ---------- S0 仓处于合并中途态 -> BLOCKED-MERGING,零写入(不代收尾、回滚也不清掉对方合并态) ----------
W "s0.md" "s0`n"
$mhS0 = Join-Path $mainRepo ".git\MERGE_HEAD"
[System.IO.File]::WriteAllText($mhS0, ((G $mainRepo "rev-parse HEAD")[0].Trim() + "`n"))
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m-s0.txt" "【文档】s0: 合并中途态"), "-PathListFile", (L "l-s0.txt" @("s0.md")))
Assert-True ($r.code -eq 1 -and $r.verdict -match '^VERDICT: BLOCKED-MERGING' -and $r.verdict -match 'next=halt') ("S0 合并中途态拒提交:" + $r.verdict)
Assert-True ((Test-Path $mhS0) -and ((G $mainRepo "status --porcelain") -join "|") -match '\?\? s0\.md') "S0 MERGE_HEAD 原样保留、清单文件未被登记"
[System.IO.File]::Delete($mhS0)
[System.IO.File]::Delete((Join-Path $mainRepo "s0.md"))

# ---------- S1 提交信息缺失 ----------
$r = Run-FC @("-RepoDir", $mainRepo, "-PathListFile", (L "l0.txt" @("README.md")))
Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-message') "S1 no-message denied"

# ---------- S2 主题格式校验(格式判定正本 = 校验库 Get-SubjectFormatGap) ----------
# 覆盖不合规各类:历史遗留的 conventional 形态、半角括号、空动词、非中文动词、只有动词没有
# 描述、无前缀,以及词表外的动词——词表闭合后「词表外」重新成为拒因,含放开期用过的高频词
# (改进/移除/清理/调整)与前缀匹配但不等于词表项的词(新增中的「新增补」),防正则写成非锚定。
# 格式校验排在文件集之前,故这些用例即便清单路径无差异也必须以 DENIED-subject 先行返回。
$badSubjects = @("feat(UI): 旧 conventional 形态", "重构(订单): 半角括号", "【】空动词", "【x】非中文动词",
                 "【改进】订单: 词表外动词", "【移除】订单: 词表外动词", "【清理】订单: 词表外动词",
                 "【调整】订单: 词表外动词", "【新增补】订单: 前缀匹配但非词表项", "【新增】", "无任何前缀的主题")
for ($i = 0; $i -lt $badSubjects.Count; $i++) {
  $r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M ("m2-" + $i + ".txt") $badSubjects[$i]), "-PathListFile", (L "l0b.txt" @("README.md")))
  Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-subject') ("S2 主题不合格式被拒:" + $badSubjects[$i])
}
# S2b 词表七词逐个放行(README.md 无差异 -> 过了格式校验就落到 NOTHING-TO-COMMIT,足以证明
# 未被格式拒)。词表增删须同步改这一行,漏改则新词无回归覆盖。
foreach ($v in @("新增", "修复", "变更", "重构", "删除", "配置", "文档")) {
  $r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M ("m2v-" + $v + ".txt") ("【" + $v + "】订单: 词表内动词放行")), "-PathListFile", (L "l0c.txt" @("README.md")))
  Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: NOTHING-TO-COMMIT') ("S2b 词表内动词放行:" + $v)
}
# S2c 机器保留词【流程】(集成交付 的删测/协议收尾提交用)不在人写词表内,人写路径写不出它
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m2r.txt" "【流程】保留词不给人写路径用"), "-PathListFile", (L "l0d.txt" @("README.md")))
Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-subject') "S2c 保留词【流程】不被人写路径接受"
# S2d 主题只校首个非空行,正文自由(白名单/表文档标注等仍按各自校验走)
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m2m.txt" "【修复】订单: 多行信息`n`n正文里出现 feat(x): 这种旧形态不该影响判定"), "-PathListFile", (L "l0e.txt" @("README.md")))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: NOTHING-TO-COMMIT') "S2d 正文不参与主题格式判定"

# ---------- S3 doc commit + push + trailer(推送须显式 -Push) ----------
W "docs/note.md" "note v1`n"
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m3.txt" "【新增】docs: doc commit"), "-PathListFile", (L "l3.txt" @("docs/note.md")), "-Push")
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED .*pushed=yes') "S3 doc commit pushed"
$body = (G $mainRepo "log -1 --format=%B") -join "`n"
Assert-True ($body -match 'Co-Authored-By: agent-zp <zhoupengzy@163\.com>') "S3 trailer auto-appended"
$lt = (G $mainRepo "rev-parse HEAD")[0]; $rt = (G $bare "rev-parse refs/heads/main")[0]
Assert-True ($lt -eq $rt) "S3 origin tip matches"

# ---------- S3b 缺省不推:主仓不给 -Push 只提交,origin 留在原处 ----------
W "docs/note2.md" "note2 v1`n"
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m3b.txt" "【新增】docs: doc commit without push"), "-PathListFile", (L "l3b.txt" @("docs/note2.md")))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED .*pushed=no') "S3b main repo defaults to no push"
$lt2 = (G $mainRepo "rev-parse HEAD")[0]; $rt2 = (G $bare "rev-parse refs/heads/main")[0]
Assert-True ($lt2 -ne $rt2) "S3b origin tip not advanced"

# ---------- S4 gated no ticket -> denied + add -N rollback ----------
W "Demo/Assets/GameScripts/HotFix/GameLogic/A.cs" "public class A {}`n"
$l4 = L "l4.txt" @("Demo/Assets/GameScripts/HotFix/GameLogic/A.cs")
$m4 = M "m4.txt" "【新增】GameLogic: gated file"
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", $m4, "-PathListFile", $l4)
Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-ticket-no-ticket') "S4 gated no-ticket denied"
$st = (G $mainRepo "status --porcelain -- Demo/Assets/GameScripts/HotFix/GameLogic/A.cs") -join ""
Assert-True ($st -match '^\?\?') "S4 add -N rolled back (file untracked again)"

# ---------- S5 gated with valid ticket -> committed ----------
New-Ticket $mainRepo
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", $m4, "-PathListFile", $l4)
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED') "S5 gated with ticket committed"

# ---------- S14 表源改动须伴随字段说明 ----------
W "Configs/GameConfig/Datas/tbdemo.xlsx" "x"
$l14 = L "l14.txt" @("Configs/GameConfig/Datas/tbdemo.xlsx")
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m14.txt" "【新增】表: demo table"), "-PathListFile", $l14)
Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-tabledoc') "S14 table source without doc denied"
Assert-True ($r.verdict -match 'tbdemo\.xlsx') "S14 deny names the offending source"
# 逃生口:提交信息标注「表文档无关」放行
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m14b.txt" "【变更】表: demo table [table-doc-exempt: style only]`n`n表文档无关:仅列宽调整"), "-PathListFile", $l14)
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED') "S14b exempt tag lets it through"
# 表源 + 说明文档同改 -> 放行
W "Configs/GameConfig/Datas/tbdemo.xlsx" "xy"
W "Configs/GameConfig/Datas/配置表说明.md" "field notes"
$l14c = L "l14c.txt" @("Configs/GameConfig/Datas/tbdemo.xlsx", "Configs/GameConfig/Datas/配置表说明.md")
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m14c.txt" "【新增】表: demo table with doc"), "-PathListFile", $l14c)
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED') "S14c table + doc committed"

# ---------- S8 persistence probe ----------
W "Demo/Assets/GameScripts/HotFix/GameLogic/A.cs" "public class A { void F() { PlayerPrefs.SetInt(`"k`", 1); } }`n"
$l8 = L "l8.txt" @("Demo/Assets/GameScripts/HotFix/GameLogic/A.cs")
if (-not (Test-ServerEnabled)) {
  # 服务端通道关闭:本地持久化探测停用(校验库 PersistRe 恒不命中),不带白名单标签照常提交。
  New-Ticket $mainRepo
  $r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m8.txt" "【新增】GameLogic: persist without tag"), "-PathListFile", $l8)
  Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED') "S8 服务端通道关闭:持久化调用不带白名单标签 -> COMMITTED(探测停用)"
} else {
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m8.txt" "【新增】GameLogic: persist without tag"), "-PathListFile", $l8)
Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-persist') "S8 persist without tag denied"
New-Ticket $mainRepo
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m8b.txt" "【新增】GameLogic: persist [本地白名单:测试假仓论证]"), "-PathListFile", $l8)
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED') "S8 persist with tag + ticket committed"
# S8c 未跟踪新文件:校验在 add -N 之前跑,新文件不在 diff 里,其新增行须从盘上取,不得漏判
W "Demo/Assets/GameScripts/HotFix/GameLogic/N.cs" "public class N { void F() { PlayerPrefs.SetInt(`"k`", 1); } }`n"
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m8c.txt" "【新增】GameLogic: new file persist"), "-PathListFile", (L "l8c.txt" @("Demo/Assets/GameScripts/HotFix/GameLogic/N.cs")), "-CheckOnly")
Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-persist') "S8c 未跟踪新文件的持久化调用同样被拒"
[System.IO.File]::Delete((Join-Path $mainRepo "Demo\Assets\GameScripts\HotFix\GameLogic\N.cs"))
}

# ---------- S9 slot client free commit, no push ----------
$slotRepo = Join-Path $fx "Fake-dev1"
New-Item -ItemType Directory -Force -Path $slotRepo | Out-Null
G $slotRepo "init -q -b agent/dev1" | Out-Null
G $slotRepo "config user.email t@t.t" | Out-Null
G $slotRepo "config user.name t" | Out-Null
[System.IO.File]::WriteAllText((Join-Path $slotRepo ".gitignore"), ".gate/`n")
G $slotRepo "add -A" | Out-Null
G $slotRepo "commit -q -m init" | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $slotRepo "Demo\Assets\GameScripts\HotFix\GameLogic") | Out-Null
[System.IO.File]::WriteAllText((Join-Path $slotRepo "Demo\Assets\GameScripts\HotFix\GameLogic\S.cs"), "public class S {}`n")
$r = Run-FC @("-RepoDir", $slotRepo, "-MessageFile", (M "m9.txt" "【新增】槽位: wip free commit"), "-All")
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED .*pushed=no') "S9 slot free commit no ticket, no push"
Assert-True (@(Get-AtlasGuard $r).Count -eq 0) "S9b 没有要剔的已跟踪图集 -> 图集还原护栏两样都不记"

# S10 / S10b / S15 / S15b 只在服务端通道开着时成立(ServerDirName 留空时没有服务端仓可建夹具),关闭时整段跳过。
if (-not $srvDir) {
  Write-Host "SKIP S10~S15b 服务端仓用例:服务端通道关闭(flow-config ServerDirName 留空)"
} else {
# ---------- S10 slot fantasy: free commit (server ticket binds at the push point, 集成交付) ----------
# 槽位交付 先提交、再合基线、再自检;提交点验票会把自检逼到同步之前(实发 2026-09-29 dev1)。
$slotFantasy = Join-Path $slotRepo $srvDir
New-Item -ItemType Directory -Force -Path $slotFantasy | Out-Null
G $slotFantasy "init -q -b agent/dev1" | Out-Null
G $slotFantasy "config user.email t@t.t" | Out-Null
G $slotFantasy "config user.name t" | Out-Null
[System.IO.File]::WriteAllText((Join-Path $slotFantasy ".gitignore"), ".gate/`n")
G $slotFantasy "add -A" | Out-Null
G $slotFantasy "commit -q -m init" | Out-Null
[System.IO.File]::WriteAllText((Join-Path $slotFantasy "B.cs"), "public class B {}`n")
$m10 = M "m10.txt" "【新增】服务端: change"
$r = Run-FC @("-RepoDir", $slotFantasy, "-MessageFile", $m10, "-All")
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED .*pushed=no') "S10 slot fantasy .cs no ticket -> free commit, no push"

# ---------- S10b main fantasy: strict server ticket ----------
$mainFantasy = Join-Path $fx $srvDir
New-Item -ItemType Directory -Force -Path $mainFantasy | Out-Null
G $mainFantasy "init -q -b main" | Out-Null
G $mainFantasy "config user.email t@t.t" | Out-Null
G $mainFantasy "config user.name t" | Out-Null
[System.IO.File]::WriteAllText((Join-Path $mainFantasy ".gitignore"), ".gate/`n")
G $mainFantasy "add -A" | Out-Null
G $mainFantasy "commit -q -m init" | Out-Null
[System.IO.File]::WriteAllText((Join-Path $mainFantasy "B.cs"), "public class B {}`n")
$l10b = L "l10b.txt" @("B.cs")
$r = Run-FC @("-RepoDir", $mainFantasy, "-MessageFile", $m10, "-PathListFile", $l10b)
Assert-True ($r.code -eq 1 -and $r.verdict -match 'DENIED-server-ticket-no-ticket') "S10b main fantasy .cs no ticket denied"
New-Ticket $mainFantasy
$r = Run-FC @("-RepoDir", $mainFantasy, "-MessageFile", $m10, "-PathListFile", $l10b)
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED .*pushed=no') "S10b main fantasy with ticket, no push"

# ---------- S15 服务端验证面漂移(与 hook 服务端分支同源):票树==工作树,但提交集
# 不含验证面内另一未提交 .cs -> 放行并警示。复刻实发事故:协议重导结果留工作树未提交,
# 消费它的 handler 已入库,票照发、提交照过,产出的树缺生成物、干净检出即编译失败。
[System.IO.File]::WriteAllText((Join-Path $mainFantasy "C.cs"), "public class C {}`n")
[System.IO.File]::WriteAllText((Join-Path $mainFantasy "D.cs"), "public class D {}`n")
New-Ticket $mainFantasy
$r = Run-FC @("-RepoDir", $mainFantasy, "-MessageFile", (M "m15.txt" "【新增】服务端: partial"), "-PathListFile", (L "l15.txt" @("C.cs")))
$out15 = ($r.out -join "`n")
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED') "S15 服务端部分提交 -> 放行"
Assert-True ($out15 -match '服务端验证面内存在不属于本次提交的未提交改动') "S15 点名服务端验证面漂移"
Assert-True ($out15 -match 'D\.cs') "S15 警示点名漂移文件"

# ---------- S15b 非验证面文件不算漂移 ----------
G $mainFantasy "add -A" | Out-Null
G $mainFantasy "commit -q -m rest" | Out-Null
[System.IO.File]::WriteAllText((Join-Path $mainFantasy "E.cs"), "public class E {}`n")
[System.IO.File]::WriteAllText((Join-Path $mainFantasy "notes.md"), "notes`n")
New-Ticket $mainFantasy
$r = Run-FC @("-RepoDir", $mainFantasy, "-MessageFile", (M "m15b.txt" "【新增】服务端: with md"), "-PathListFile", (L "l15b.txt" @("E.cs")))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED') "S15b 仅 md 漂移 -> 放行"
Assert-True ((($r.out -join "`n")) -notmatch '验证面内存在') "S15b md 不算服务端验证面漂移"
}

# ---------- S13 slot commit strips tracked .spriteatlasv2 churn, keeps new atlas (连 .meta) ----------
# 先造一个「已跟踪」图集并入库(模拟基线里已存在的图集)
New-Item -ItemType Directory -Force -Path (Join-Path $slotRepo "Demo\Assets\AssetArt\Atlas") | Out-Null
$trackedAtlasRel = "Demo/Assets/AssetArt/Atlas/Tracked.spriteatlasv2"
$trackedAtlasAbs = Join-Path $slotRepo ($trackedAtlasRel -replace '/', '\')
[System.IO.File]::WriteAllText($trackedAtlasAbs, "packables:`n- a`n")
G $slotRepo "add -- $trackedAtlasRel" | Out-Null
G $slotRepo "commit -q -m baseline-atlas" | Out-Null
# 本轮:已跟踪图集追加一行(churn) + 全新图集文件 + 一段代码
[System.IO.File]::WriteAllText($trackedAtlasAbs, "packables:`n- a`n- b`n")
$newAtlasRel = "Demo/Assets/AssetArt/Atlas/New.spriteatlasv2"
[System.IO.File]::WriteAllText((Join-Path $slotRepo ($newAtlasRel -replace '/', '\')), "packables:`n- c`n")
[System.IO.File]::WriteAllText((Join-Path $slotRepo (($newAtlasRel + ".meta") -replace '/', '\')), "guid: 0f6d`n")
[System.IO.File]::WriteAllText((Join-Path $slotRepo "Demo\Assets\GameScripts\HotFix\GameLogic\S13.cs"), "public class S13 {}`n")
$r = Run-FC @("-RepoDir", $slotRepo, "-MessageFile", (M "m13.txt" "【新增】槽位: code plus atlas"), "-All")
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED') "S13 slot commit with code+atlas committed"
$committed = (G $slotRepo "show --name-only --format= HEAD") -join "`n"
Assert-True ($committed -notmatch 'Tracked\.spriteatlasv2') "S13 tracked atlas churn not in commit"
Assert-True ($committed -match 'S13\.cs') "S13 code file in commit"
# 已跟踪图集:还原到 HEAD -> 工作树干净(无该路径 dirty)
$stTracked = (G $slotRepo "status --porcelain -- $trackedAtlasRel") -join ""
Assert-True ($stTracked.Trim().Length -eq 0) "S13 tracked atlas restored (worktree clean)"
# 全新图集:本体与 .meta 一并入提交,不留未跟踪残留(guid 创建时定下;留盘会在主树补提后挡槽位合基线)
Assert-True (($committed -match 'New\.spriteatlasv2(\r?\n|$)') -and ($committed -match 'New\.spriteatlasv2\.meta')) "S13 new atlas committed together with its .meta"
$stNew = (G $slotRepo "status --porcelain -- $newAtlasRel $newAtlasRel.meta") -join ""
Assert-True ($stNew.Trim().Length -eq 0) "S13 new atlas leaves no untracked residue"
$ag = @(Get-AtlasGuard $r)
Assert-True ($ag.Count -eq 1 -and $ag[0].event -eq "guard-ok" -and $ag[0].src -eq "单仓提交") ("S13 图集还原成了 -> 记一行 guard-ok(guard slot-atlas-restore,来源 单仓提交),实得 " + $ag.Count + " 行")

# ---------- S13b 图集还原没成(index.lock 占着)-> 原 WARN 照打、照常收尾,记 degraded ----------
# 只有图集改动、没有别的可提交:走 NOTHING-TO-COMMIT 前的还原分支(不 add -A,只读查询不受 index.lock 影响)。
[System.IO.File]::WriteAllText($trackedAtlasAbs, "packables:`n- a`n- lock`n")
$lockS13 = Join-Path $slotRepo ".git\index.lock"
[System.IO.File]::WriteAllText($lockS13, "")
try { $r = Run-FC @("-RepoDir", $slotRepo, "-MessageFile", (M "m13b.txt" "【变更】槽位: atlas only"), "-All") }
finally { [System.IO.File]::Delete($lockS13) }
$ag = @(Get-AtlasGuard $r)
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: NOTHING-TO-COMMIT' -and (($r.out -join "`n") -match '(?m)^WARN 图集还原到 HEAD 失败\(改动留在工作树,未入提交\):')) ("S13b 还原失败:原 WARN 文案照打,结论不变(" + $r.verdict + ")")
Assert-True ($ag.Count -eq 1 -and $ag[0].event -eq "degraded" -and $ag[0].key -eq "slot-atlas-restore-failed" -and $ag[0].detail -match 'index\.lock') ("S13b 记一行 degraded(key slot-atlas-restore-failed),不记 guard-ok | " + $(if ($ag.Count) { $ag[0].event + " " + $ag[0].detail } else { "无" }))
G $slotRepo ("checkout -q -- " + $trackedAtlasRel) | Out-Null

# ---------- S11 CheckOnly zero-write ----------
W "docs/check.md" "check`n"
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m11.txt" "【新增】docs: check"), "-PathListFile", (L "l11.txt" @("docs/check.md")), "-CheckOnly")
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: CHECK-PASS') "S11 CheckOnly passes"
$st = (G $mainRepo "status --porcelain -- docs/check.md") -join ""
Assert-True ($st -match '^\?\?') "S11 CheckOnly leaves file untracked (add -N rolled back)"

# ---------- S12 nothing to commit ----------
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m12.txt" "【文档】docs: noop"), "-PathListFile", (L "l12.txt" @("docs/note.md")))
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: NOTHING-TO-COMMIT') "S12 unchanged path -> nothing to commit"
$v12 = @($r.tel | Where-Object { $_.event -eq "单仓提交" -and $_.verdict -eq "NOTHING-TO-COMMIT" })
Assert-True ($v12.Count -eq 1 -and -not $v12[0].PSObject.Properties["run"]) "R0 无交付关联号(直接调用)-> 结论行遥测不带 run 字段"

# ---------- R1 经 槽位交付 调用(环境里有交付关联号)-> 各遥测行带 run ----------
$env:FLOW_DELIVER_RUN = "commitrun0001"
try { $r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m12r.txt" "【文档】docs: noop with run"), "-PathListFile", (L "l12r.txt" @("docs/note.md"))) }
finally { Remove-Item Env:\FLOW_DELIVER_RUN -ErrorAction SilentlyContinue }
$v12 = @($r.tel | Where-Object { $_.event -eq "单仓提交" })
Assert-True ($r.verdict -match '^VERDICT: NOTHING-TO-COMMIT' -and $v12.Count -eq 1 -and $v12[0].run -eq "commitrun0001") ("R1 有交付关联号 -> 结论行带 run=<该号>(实得 " + $(if ($v12.Count) { [string]$v12[0].run } else { "无行" }) + ")")

# ---------- S16 长清单:清单不得拼进命令行 ----------
# 复刻实发:pathspec 拼进 cmd /c 超 8191 字符,cmd 报「命令行太长」,查询静默得空 -> 误报
# NOTHING-TO-COMMIT。150 条长路径 + 10 条含空格中文路径,拼接长度远超上限。
$longList = @()
for ($i = 0; $i -lt 150; $i++) {
  $rel = "docs/long-pathspec-list/" + ("segment-" * 6) + ("{0:D3}" -f $i) + ".md"
  W $rel ("v1 " + $i + "`n"); $longList += $rel
}
for ($i = 0; $i -lt 10; $i++) {
  $rel = "docs/中文 目录/说明文件-" + $i + ".md"
  W $rel ("v1 " + $i + "`n"); $longList += $rel
}
$l16 = L "l16.txt" $longList
Assert-True (((@($longList | ForEach-Object { '"' + $_ + '"' }) -join ' ').Length) -gt 8191) "S16 夹具清单拼接长度超 cmd 上限"
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m16.txt" "【新增】docs: long list"), "-PathListFile", $l16)
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: COMMITTED') "S16 长清单提交成功(不误报 NOTHING-TO-COMMIT)"
$c16 = @((G $mainRepo "-c core.quotepath=false show --name-only --format= HEAD") | Where-Object { ([string]$_).Trim() })
Assert-True ($c16.Count -eq 160) ("S16 提交集含全部 160 项(实得 " + $c16.Count + ")")
Assert-True (@($c16 | Where-Object { $_ -match '中文 目录' }).Count -eq 10) "S16 中文含空格路径全部入提交"
Assert-True ((($r.out -join "`n")) -notmatch '预期外路径') "S16 提交集与清单一致"
foreach ($rel in $longList) { W $rel "v2`n" }
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m16b.txt" "【变更】docs: long list check"), "-PathListFile", $l16, "-CheckOnly")
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: CHECK-PASS .*160 项') "S16b 长清单 CheckOnly 取到全部 160 项"
G $mainRepo "checkout -q -- docs/long-pathspec-list" | Out-Null
G $mainRepo "checkout -q -- `"docs/中文 目录`"" | Out-Null

# ---------- S17 CheckOnly 真零写:索引与工作树逐字节不变 ----------
# 快照前先把工作树 mtime 拨回 1 小时并刷新索引:同秒写入的文件是 racy 条目,任何只读 git 查询
# 都可能顺手重写索引,那是 git 自身行为、不是被测脚本的写动作,不拨回会让本断言偶发假失败。
function Settle([string]$Repo) {
  $old = (Get-Date).ToUniversalTime().AddHours(-1)
  Get-ChildItem -LiteralPath $Repo -Recurse -File -Force | Where-Object { $_.FullName -notmatch '[\\/]\.git([\\/]|$)' } |
    ForEach-Object { [System.IO.File]::SetLastWriteTimeUtc($_.FullName, $old) }
  G $Repo "status --porcelain" | Out-Null
}
function Snap([string]$Repo, [string[]]$Rels) {
  $sha = [System.Security.Cryptography.SHA256]::Create()
  $parts = @()
  foreach ($f in @(".git\index") + @($Rels | ForEach-Object { $_ -replace '/', '\' })) {
    $p = Join-Path $Repo $f
    if (Test-Path -LiteralPath $p) { $parts += ($f + "=" + [BitConverter]::ToString($sha.ComputeHash([System.IO.File]::ReadAllBytes($p)))) }
    else { $parts += ($f + "=<missing>") }
  }
  $parts += ("status=" + ((G $Repo "-c core.quotepath=false status --porcelain") -join "|"))
  return ($parts -join "`n")
}
# S17 主仓清单形态:清单含已跟踪改动 + 新文件 + 未提交图集改动
W "Demo/Assets/AssetArt/Atlas/Main.spriteatlasv2" "packables:`n- a`n"
W "docs/co-tracked.md" "t1`n"
G $mainRepo "add -- Demo/Assets/AssetArt/Atlas/Main.spriteatlasv2 docs/co-tracked.md" | Out-Null
G $mainRepo "commit -q -m baseline-s17" | Out-Null
W "Demo/Assets/AssetArt/Atlas/Main.spriteatlasv2" "packables:`n- a`n- z`n"
W "docs/co-tracked.md" "t2`n"
W "docs/co-new.md" "new`n"
$rels17 = @("Demo/Assets/AssetArt/Atlas/Main.spriteatlasv2", "docs/co-tracked.md", "docs/co-new.md")
Settle $mainRepo
$before = Snap $mainRepo $rels17
$r = Run-FC @("-RepoDir", $mainRepo, "-MessageFile", (M "m17.txt" "【变更】docs: check only"), "-PathListFile", (L "l17.txt" $rels17), "-CheckOnly")
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: CHECK-PASS .*3 项') "S17 主仓 CheckOnly 通过且文件集含新文件"
Assert-True ((Snap $mainRepo $rels17) -eq $before) "S17 主仓 CheckOnly 前后索引与工作树逐字节不变"

# S17b 槽位 -All 形态:未提交的已跟踪图集改动在 CheckOnly 下绝不被还原
[System.IO.File]::WriteAllText($trackedAtlasAbs, "packables:`n- a`n- uncommitted`n")
[System.IO.File]::WriteAllText((Join-Path $slotRepo "Demo\Assets\GameScripts\HotFix\GameLogic\S17.cs"), "public class S17 {}`n")
$rels17b = @($trackedAtlasRel, $newAtlasRel, "Demo/Assets/GameScripts/HotFix/GameLogic/S17.cs")
Settle $slotRepo
$before = Snap $slotRepo $rels17b
$r = Run-FC @("-RepoDir", $slotRepo, "-MessageFile", (M "m17b.txt" "【新增】槽位: check only"), "-All", "-CheckOnly")
Assert-True ($r.code -eq 0 -and $r.verdict -match '^VERDICT: CHECK-PASS') "S17b 槽位 -All CheckOnly 通过"
Assert-True ((Snap $slotRepo $rels17b) -eq $before) "S17b 槽位 CheckOnly 前后索引与工作树(含图集改动)逐字节不变"
Assert-True (([System.IO.File]::ReadAllText($trackedAtlasAbs)) -match 'uncommitted') "S17b 未提交图集改动未被还原"

# ---------- S18 git 查询失败不得静默当空 -> INFRA ----------
# 未诞生 HEAD 的仓:rev-parse 能解析仓根,但 diff HEAD / ls-tree HEAD 非零退出。修前被当作空输出,
# 落成 NOTHING-TO-COMMIT + exit 0,会话据此以为「无事可提」继续走。
$unborn = Join-Path $fx "Unborn"
New-Item -ItemType Directory -Force -Path $unborn | Out-Null
G $unborn "init -q -b main" | Out-Null
[System.IO.File]::WriteAllText((Join-Path $unborn "a.md"), "a`n")
$r = Run-FC @("-RepoDir", $unborn, "-MessageFile", (M "m18.txt" "【新增】docs: unborn"), "-PathListFile", (L "l18.txt" @("a.md")))
Assert-True ($r.code -eq 2 -and $r.verdict -match '^VERDICT: INFRA') ("S18 git 查询失败判 INFRA(实得 " + $r.verdict + ")")
# R2 内部异常那一行与结论行走同一出口:有交付关联号时都带 run
$env:FLOW_DELIVER_RUN = "commitrun0002"
try { $r = Run-FC @("-RepoDir", $unborn, "-MessageFile", (M "m18r.txt" "【新增】docs: unborn with run"), "-PathListFile", (L "l18r.txt" @("a.md"))) }
finally { Remove-Item Env:\FLOW_DELIVER_RUN -ErrorAction SilentlyContinue }
$e18 = @($r.tel | Where-Object { $_.event -eq "单仓提交" })
Assert-True ($r.code -eq 2 -and $e18.Count -eq 2 -and @($e18 | Where-Object { $_.run -eq "commitrun0002" }).Count -eq 2 -and @($e18 | Where-Object { $_.decision -eq "error" }).Count -eq 1) ("R2 异常行与结论行都带 run(实得 " + $e18.Count + " 行)")

# 全通过才删夹具;有失败则留盘供排查(GUID 命名不会与下一轮冲突)
if ($script:TestFail -eq 0) { Remove-FixtureTree $fx } else { Write-Host ("INFO 夹具保留供排查:" + $fx) }
$env:LOCALAPPDATA = $oldLad
if ($null -ne $script:OldRunId) { $env:FLOW_DELIVER_RUN = $script:OldRunId }
Write-Host ""
Exit-TestSuite
