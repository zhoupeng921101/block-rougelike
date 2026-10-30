# hook函数库测试.ps1 — devflow 共享函数库(hooks\hook函数库.ps1)单元测试。
# 覆盖:Resolve-FlowRoots(缺省推导 / 显式值优先)、Get-FlowConfig、
#   Get-GitLines(0/1/N 行恒为数组、单元素不解包——该保证曾是 hook 失败放行 事故的拦截)、
#   Get-GitLinesRaw(保留空行)、Get-GitOne、Invoke-GitMerged(合并 stderr + 退出码)、
#   Get-PorcelainPaths(rename 两端 / 去引号)、Invoke-MergeAbort(abort 成败按现场核实,未生效不报已中止)、
#   Write-Telemetry(隔离 LOCALAPPDATA,不触真 claude-wf-3b)、
#   Resolve-WfStatePath + Get-ClaudePackageDirs(MSIX 包目录优先、首次写直落包内、多包取舍)、
#   Get-VerdictNext + Format-VerdictLine(VERDICT 续接档位派生与幂等拼装;承重点 = DENIED- 不通配)、
#   Invoke-FlowChild(子进程 stderr 不抛、参数原样)、Get-ContentDirtyPaths(行尾幻影不算脏)、
#   Get-WorkTreeHash(种子路与空索引路逐例相等、真实索引不动、racy 改动照样识别、种子不可用时退回),
#   Repair-EolPhantomPaths(行尾幻影归一:范围内零内容差异的才 checkout,真改动 / CRLF 入库 / 范围外不碰)、
#   New-FlowTempFile + Remove-FlowTempFiles(只删登记过的临时件)、
#   Enter-DeployLock + Exit-DeployLock(本机部署锁:跨进程互斥与超时点名、子进程继承、abandoned 不留残锁)、
#   Unity 程序集实扫(Test-UnityIgnoredPath / Get-UnityAsmScan / Find-UnityAsmdefByName /
#   Get-UnityAsmdefExpectSet / Get-UnityPredefinedEditorSet:忽略目录、asmref 接管、Plugins/Editor 归 firstpass、
#   按 name 精确定位、Assets 根 asmdef;Get-UnityEmbeddedPackageScan:只收含 package.json 的包目录、前缀 Packages/)、
#   Read-HookStdin + Read-HookInput -Raw(剥 BOM;新进程载入本库并读 stdin 不自动加载模块——命令面 hook 快速路径的耗时前提)、
#   遥测共用构件(Get-VerdictTelemetryFields / New-PhaseClock 分段计时 / Write-Degraded /
#   Write-GuardOk / Write-GateRunTelemetry 拼装出错不外抛)、Publish-GateTicket 判 STALE 时的 DRIFT 行与 driftPaths。
# 夹具落 %TEMP%,不触真仓。
[CmdletBinding(PositionalBinding=$false)]
param()
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent

# LOCALAPPDATA 必须在下方 dot-source **之前**隔离:hook函数库 在载入时一次性把
# $script:WfStateRoot 定成 <LOCALAPPDATA>\claude-wf-3b,载入后再改环境变量不生效
# (生产中 LOCALAPPDATA 不会中途变,故只是测试约束)。
# 上面 测试夹具库 已间接载入过一次 hook函数库(那次用的是真 LOCALAPPDATA),下方这次重载
# 才是本套件生效的那份——顺序不可调换。
$oldLad = $env:LOCALAPPDATA
$fx = Join-Path $env:TEMP ("flowtest-hooklib-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $fx | Out-Null
$env:LOCALAPPDATA = Join-Path $fx "AppData"

. (Join-Path $dfDir "hooks\hook函数库.ps1")

Write-Host "== hook函数库 单元测试 =="
try {
  # ---- Resolve-FlowRoots ----
  $cfg = Resolve-FlowRoots @{} "C:\w\block-client\Demo\.claude\devflow\hooks"
  Assert-True ($cfg.RepoRoot -eq "C:\w\block-client") "R1 缺省按位置推导仓根(上溯四级)"

  $cfg3 = Resolve-FlowRoots @{ RepoRoot = "D:\explicit" } "C:\w\block-client\Demo\.claude\devflow\hooks"
  Assert-True ($cfg3.RepoRoot -eq "D:\explicit") "R4 配置显式值优先(测试注入靠此)"

  $cfg4 = Resolve-FlowRoots @{ RepoRoot = "D:\r"; ServerDirName = "srv" } "C:\w\x\y\z\hooks"
  Assert-True ($cfg4.FantasyRoot -eq "D:\r\srv") "R5 FantasyRoot = RepoRoot\ServerDirName"

  $real = Get-FlowConfig
  # ServerDirName 留空是合法配置(服务端通道关闭),不算关键键;它与 Test-ServerEnabled 同口径。
  Assert-True ([bool]$real.RepoRoot -and [bool]$real.ClientBaseline -and ((Test-ServerEnabled) -eq [bool]$real.ServerDirName)) "R6 Get-FlowConfig 读到真配置关键键,服务端开关与 ServerDirName 同口径"
  $cfg5 = Resolve-FlowRoots @{ RepoRoot = "D:\r"; ServerDirName = "" } "C:\w\x\y\z\hooks"
  Assert-True (-not $cfg5.FantasyRoot) "R5b ServerDirName 留空 -> 不推导 FantasyRoot(服务端通道关闭)"

  # ---- git 薄封装 ----
  $repo = Join-Path $fx "repo"
  New-Item -ItemType Directory -Force -Path $repo | Out-Null
  cmd /c "git -C ""$repo"" init -q 2>&1" | Out-Null
  cmd /c "git -C ""$repo"" config user.name flowtest 2>&1" | Out-Null
  cmd /c "git -C ""$repo"" config user.email f@e.com 2>&1" | Out-Null
  cmd /c "git -C ""$repo"" config commit.gpgsign false 2>&1" | Out-Null
  Write-F $repo "a.txt" "a`n" | Out-Null
  cmd /c "git -C ""$repo"" add -A 2>&1" | Out-Null
  cmd /c "git -C ""$repo"" commit -q -m one 2>&1" | Out-Null
  Write-F $repo "b.txt" "b`n" | Out-Null
  cmd /c "git -C ""$repo"" add -A 2>&1" | Out-Null
  cmd /c "git -C ""$repo"" commit -q -m two 2>&1" | Out-Null

  $zero = Get-GitLines $repo "log --format=%H -n 0"
  $one  = Get-GitLines $repo "log --format=%H -n 1"
  $many = Get-GitLines $repo "log --format=%H -n 2"
  Assert-True ($zero -is [array] -and $zero.Count -eq 0) "G1 0 行 -> 空数组"
  Assert-True ($one -is [array] -and $one.Count -eq 1 -and $one[0] -is [string] -and $one[0].Length -eq 40) "G2 1 行仍是数组、[0] 是字符串(防 失败放行 事故的保证)"
  Assert-True ($many.Count -eq 2) "G3 N 行"
  Assert-True ((Get-GitOne $repo "log -1 --format=%s") -eq "two") "G4 Get-GitOne 取首行并 trim"
  Assert-True ((Get-GitOne $repo "log -1 --format=%s nonexistent-ref-xyz") -eq "") "G5 无输出 -> 空串"

  $rawEmpty = Get-GitLinesRaw $repo "log -1 --format=%b"
  Assert-True ($rawEmpty -is [array]) "G6 Get-GitLinesRaw 恒为数组"

  $okRun = Invoke-GitMerged $repo "status --porcelain"
  $badRun = Invoke-GitMerged $repo "no-such-subcommand"
  Assert-True ($okRun.code -eq 0) "G7 Invoke-GitMerged 成功回 code 0"
  Assert-True ($badRun.code -ne 0 -and (($badRun.lines -join " ") -match "no-such-subcommand|not a git command")) "G8 失败回非 0 且合并了 stderr"

  # ---- Get-PorcelainPaths ----
  $paths = Get-PorcelainPaths @(" M a/x.cs", "?? b/y.cs", "R  old/p.cs -> new/q.cs", '?? "带空格 的.cs"', "", "xy")
  Assert-True ($paths -contains "a/x.cs" -and $paths -contains "b/y.cs") "P1 常规路径"
  Assert-True ($paths -contains "old/p.cs" -and $paths -contains "new/q.cs") "P2 rename 两端都出"
  Assert-True ($paths -contains "带空格 的.cs") "P3 去引号"
  Assert-True (-not ($paths -contains "")) "P4 丢弃过短/空行"

  # ---- Invoke-MergeAbort(冲突停机前撤销合并态) ----
  # 承重点:note 与现场一致。abort 失败时不得报「已 merge --abort」(2026-09-23 dev3 实发:VERDICT 称
  # 已 abort,槽位 Fantasy 仍在合并态)。失败用 index.lock 占位制造——git 此时拒绝改索引、合并态保留。
  $abR = Join-Path $fx "abortrepo"
  New-GitRepo $abR
  Write-F $abR "c.txt" "base`n"
  G $abR "add -A" | Out-Null
  G $abR "commit -q -m base" | Out-Null
  G $abR "checkout -q -b side" | Out-Null
  Write-F $abR "c.txt" "side`n"
  G $abR "commit -q -am side" | Out-Null
  G $abR "checkout -q -" | Out-Null
  Write-F $abR "c.txt" "ours`n"
  G $abR "commit -q -am ours" | Out-Null
  G $abR "merge side" | Out-Null
  Assert-True ((Invoke-GitMerged $abR "rev-parse -q --verify MERGE_HEAD").code -eq 0) "A0 前置:撞冲突进入合并态"
  $lock = Join-Path $abR ".git\index.lock"
  [System.IO.File]::WriteAllText($lock, "")
  $abBad = Invoke-MergeAbort $abR
  [System.IO.File]::Delete($lock)
  $stillMerging = ((Invoke-GitMerged $abR "rev-parse -q --verify MERGE_HEAD").code -eq 0)
  Assert-True ($stillMerging -and -not $abBad.ok) "A1 abort 未生效 -> ok=false(现场确在合并态)"
  Assert-True ($abBad.note -match '^merge --abort 未生效' -and $abBad.note -match 'MERGE_HEAD 仍在' -and $abBad.note -match 'index\.lock' -and $abBad.note -notmatch '已 merge --abort') "A2 note 如实报未中止并带 git 原文,不写「已 merge --abort」"
  $abOk = Invoke-MergeAbort $abR
  Assert-True ($abOk.ok -and $abOk.note -eq "已 merge --abort" -and (Invoke-GitMerged $abR "rev-parse -q --verify MERGE_HEAD").code -ne 0 -and (Get-GitLines $abR "status --porcelain").Count -eq 0) "A3 abort 生效 -> ok=true、MERGE_HEAD 清、树回到干净"

  # ---- Unity 程序集实扫(消费方 = 重建csproj + Editor程序集编译;两处曾各写一份并分叉) ----
  $ua = Join-Path $fx "unity\Assets"
  Write-F $ua "Game/Game.asmdef" '{ "name": "Game", "references": [] }'
  Write-F $ua "Game/A.cs" "class A {}"
  Write-F $ua "Game/Editor/GE.cs" "class GE {}"                 # asmdef 子树内的 Editor 归该 asmdef
  Write-F $ua "Game/Samples~/I.cs" "class I {}"                 # ~ 结尾目录:Unity 忽略
  Write-F $ua "Game/Samples~/Dup.asmdef" '{ "name": "Game" }'   # 忽略目录里的同名 asmdef 不算
  Write-F $ua "Game/.hidden/H.cs" "class H {}"                  # . 开头目录:Unity 忽略
  Write-F $ua "Game/Sub/Sub.asmdef" '{ "name": "Sub" }'
  Write-F $ua "Game/Sub/S.cs" "class S {}"
  Write-F $ua "Game/Ref/x.asmref" '{ "reference": "Sub" }'
  Write-F $ua "Game/Ref/R.cs" "class R {}"                      # asmref 接管:不归 Game
  Write-F $ua "Tools/Editor/E.cs" "class E {}"
  Write-F $ua "Tools/Docs~/Editor/Z.cs" "class Z {}"
  Write-F $ua "Misc/editor/L.cs" "class L {}"                   # 小写 editor 不是 Editor 目录(另起父目录:NTFS 不分大小写)
  Write-F $ua "Plugins/Foo/Editor/P.cs" "class P {}"            # Plugins 下的 Editor 归 firstpass
  Write-F $ua "Ext/Ext.asmdef" '{ "name": "Ext" }'
  Write-F $ua "Ext/Editor/X.cs" "class X {}"                    # asmdef 子树内,不进 predefined
  Write-F $ua "N1/n1.asmdef" '{ "Name": "Game" }'               # 键名大小写不符:不是 name 字段
  Write-F $ua "N2/n2.asmdef" '{ "name": "game" }'               # 值大小写不符:另一个程序集
  Write-F $ua "N3/n3.asmdef" '{ "name": "N3", "versionDefines": [ { "name": "Game", "expression": "", "define": "X" } ] }'  # 嵌套 name 不算
  $us = Get-UnityAsmScan $ua
  $srt = { param($a) (Sort-Ordinal $a) -join "," }

  Assert-True ((Test-UnityIgnoredPath "Game/Samples~/I.cs") -and (Test-UnityIgnoredPath "Game/.hidden/H.cs") -and (Test-UnityIgnoredPath ".x/")) "U1 忽略规则:~ 结尾 / . 开头的段"
  Assert-True (-not (Test-UnityIgnoredPath "Game/A.cs") -and -not (Test-UnityIgnoredPath "") -and -not (Test-UnityIgnoredPath "Game/a~b/c.cs")) "U2 非忽略路径(~ 只在段尾才算)"
  Assert-True (-not (@($us.AllCs) -contains "Game/Samples~/I.cs") -and -not (@($us.AllCs) -contains "Game/.hidden/H.cs")) "U3 实扫剔除忽略目录的 .cs"
  $g = Find-UnityAsmdefByName $us "Game"
  Assert-True ($g.Count -eq 1 -and $g[0].RelDir -eq "Game/") "U4 按 name 定位:顶层 name 精确、区分大小写,忽略目录 / 键名异写 / 嵌套 name 均不命中"
  Assert-True ((Find-UnityAsmdefByName $us "game").Count -eq 1 -and (Find-UnityAsmdefByName $us "Nope").Count -eq 0) "U5 值大小写不同是另一个程序集;无命中回空数组"
  Assert-True ((& $srt (Get-UnityAsmdefExpectSet $us "Game/")) -eq "Assets/Game/A.cs,Assets/Game/Editor/GE.cs") "U6 asmdef 期望集:剔更深 asmdef、asmref 接管子树、剔忽略目录"
  Assert-True ((& $srt (Get-UnityAsmdefExpectSet $us "Game/Sub/")) -eq "Assets/Game/Sub/S.cs") "U7 更深 asmdef 自己的子树"
  $ed = Get-UnityPredefinedEditorSet $us
  Assert-True ($ed -is [array] -and (& $srt $ed) -eq "Assets/Tools/Editor/E.cs") "U8 predefined Editor 集:剔 asmdef 子树 / 忽略目录 / 小写 editor / Plugins 下的 Editor"
  Assert-True ((& $srt (Get-UnityPredefinedEditorSet $us -FirstPass)) -eq "Assets/Plugins/Foo/Editor/P.cs") "U9 -FirstPass 取 Plugins/**/Editor"

  # asmdef 落 Assets 根:owner 为空串 = 整棵 Assets 被接管(曾因去重函数丢空串而漏掉的形态)
  $ua2 = Join-Path $fx "unity2\Assets"
  Write-F $ua2 "Root.asmdef" '{ "name": "Root" }'
  Write-F $ua2 "Editor/E.cs" "class E {}"
  $us2 = Get-UnityAsmScan $ua2
  $e2 = Get-UnityPredefinedEditorSet $us2
  Assert-True ($e2 -is [array] -and $e2.Count -eq 0 -and (Find-UnityAsmdefByName $us2 "Root")[0].RelDir -eq "") "U10 Assets 根 asmdef 接管全树,predefined 集为空数组"
  Assert-True ((& $srt (Get-UnityAsmdefExpectSet $us2 "")) -eq "Assets/Editor/E.cs") "U11 Assets 根 asmdef 期望集"

  # 工程内嵌包底数:只收 Packages 下直接含 package.json 的目录;路径相对 Packages,期望集前缀 Packages/
  $up = Join-Path $fx "unity3"
  Write-F $up "Packages/manifest.json" '{}'
  Write-F $up "Packages/MyPkg/package.json" '{ "name": "com.x.mypkg" }'
  Write-F $up "Packages/MyPkg/Runtime/Pkg.asmdef" '{ "name": "Pkg" }'
  Write-F $up "Packages/MyPkg/Runtime/P.cs" "class P {}"
  Write-F $up "Packages/MyPkg/Runtime/Samples~/I.cs" "class I {}"
  Write-F $up "Packages/MyPkg/Runtime/Inner/Inner.asmdef" '{ "name": "Inner" }'
  Write-F $up "Packages/MyPkg/Runtime/Inner/N.cs" "class N {}"
  Write-F $up "Packages/MyPkg/Loose/L.cs" "class L {}"
  Write-F $up "Packages/NotPkg/Fake.asmdef" '{ "name": "Fake" }'    # 无 package.json:Unity 不认它是包
  Write-F $up "Packages/NotPkg/F.cs" "class F {}"
  Write-F $up "Packages/Stray.asmdef" '{ "name": "Stray" }'          # Packages 根上的 asmdef 不属任何包
  $ps = Get-UnityEmbeddedPackageScan $up
  $pk = Find-UnityAsmdefByName $ps "Pkg"
  Assert-True ($pk.Count -eq 1 -and $pk[0].RelDir -eq "MyPkg/Runtime/" -and (Find-UnityAsmdefByName $ps "Fake").Count -eq 0 -and (Find-UnityAsmdefByName $ps "Stray").Count -eq 0) "U12 内嵌包底数:只收含 package.json 的一级目录下的 asmdef"
  Assert-True ((& $srt $ps.AllCs) -eq "MyPkg/Loose/L.cs,MyPkg/Runtime/Inner/N.cs,MyPkg/Runtime/P.cs" -and -not (@($ps.OwnerDirs) -contains "")) "U13 内嵌包底数:.cs 剔忽略目录与非包目录,Packages 根不作 owner"
  Assert-True ((& $srt (Get-UnityAsmdefExpectSet $ps "MyPkg/Runtime/")) -eq "Packages/MyPkg/Runtime/P.cs") "U14 内嵌包 asmdef 期望集:前缀 Packages/,剔更深 asmdef 与忽略目录"
  $pe = Get-UnityEmbeddedPackageScan (Join-Path $fx "unity2")
  Assert-True (@($pe.Asmdefs).Count -eq 0 -and @($pe.AllCs).Count -eq 0 -and (Find-UnityAsmdefByName $pe "Pkg").Count -eq 0) "U15 没有 Packages 目录 -> 空底数,按名查回空数组"

  # ---- Write-Telemetry(LOCALAPPDATA 已在载入前隔离) ----
  $tag = "hooklibtest-" + [Guid]::NewGuid().ToString("N")
  Write-Telemetry @{ event = "unit-test"; note = $tag; 中文 = "值" }
  $tf = @(Get-ChildItem (Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry") -Filter "wf-*.jsonl" -EA SilentlyContinue)
  $hit = $false; $line = ""
  foreach ($f in $tf) {
    foreach ($l in [System.IO.File]::ReadAllLines($f.FullName)) { if ($l -match [regex]::Escape($tag)) { $hit = $true; $line = $l } }
  }
  Assert-True $hit "T1 遥测落隔离 LOCALAPPDATA"
  Assert-True ($line -match '"ts":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}"') "T2 自动补 ts 字段"
  Assert-True ($line -match "中文") "T3 中文不转义(UTF-8 无 BOM 追加)"

  # 失败不抛:目标不可写时静默(遥测不阻断主流程)。WfStateRoot 载入时已定,
  # 故这里直接改 script 作用域变量模拟不可写目标。
  $saved = $script:WfStateRoot
  $script:WfStateRoot = "\\?\invalid-root-for-telemetry"
  $threw = $false
  try { Write-Telemetry @{ event = "unit-test-fail" } } catch { $threw = $true }
  $script:WfStateRoot = $saved
  Assert-True (-not $threw) "T4 写入失败静默不抛"

  # ---- 遥测共用构件(入口 VERDICT 遥测 / 分段计时 / 降级留痕 / claim 关联;消费方 = 两个 Agent 入口、集成交付、两端自检)----
  function Read-TelEvent([string]$EventName, [string]$Field, [string]$Value) {
    # 隔离遥测里 event = $EventName 且 <$Field> = $Value 的最后一行(解析后的对象);没有回 $null。
    $tdir = Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry"
    $hits = @(Get-ChildItem $tdir -Filter "wf-*.jsonl" -EA SilentlyContinue | ForEach-Object { [System.IO.File]::ReadAllLines($_.FullName) } |
              Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json } | Where-Object { $_.event -eq $EventName -and [string]$_.$Field -eq $Value })
    if ($hits.Count -eq 0) { return $null }
    return $hits[-1]
  }
  $vf = Get-VerdictTelemetryFields "DENIED-BRIEF | missing sections"
  Assert-True ($vf.verdict -eq "DENIED-BRIEF" -and $vf.next -eq "fix-retry" -and $vf.detail -eq "missing sections") ("TV1 抬头首词 / 档位 / 正文拆开:" + $vf.verdict + " " + $vf.next + " " + $vf.detail)
  $vf = Get-VerdictTelemetryFields ("GATE-FAIL | " + ("x" * 300) + " next=judge")
  Assert-True ($vf.next -eq "judge" -and $vf.detail.Length -eq 200 -and $vf.detail -notmatch 'next=') "TV2 已带 next 后缀:档位取后缀,正文截 200 字且不含后缀"
  $vf = Get-VerdictTelemetryFields "DELIVERED merged=ab12 pushed=yes"
  Assert-True ($vf.verdict -eq "DELIVERED" -and $vf.next -eq "go" -and $vf.detail -eq "merged=ab12 pushed=yes") "TV3 无竖线的正文照拆"

  $clk = New-PhaseClock
  Enter-Phase $clk "a"; Start-Sleep -Milliseconds 120
  Enter-Phase $clk "b"; Start-Sleep -Milliseconds 30
  Enter-Phase $clk "a"; Start-Sleep -Milliseconds 60
  Enter-Phase $clk ""
  Add-PhaseMs $clk "lockwait" 1500
  $ps = Get-PhaseSecs $clk
  Assert-True ((@($ps.Keys) -join ",") -eq "a,b,lockwait" -and $ps["a"] -ge 0.1 -and $ps["lockwait"] -eq 1.5) ("TP1 段按首次进入的次序、同名累加、直接记的一笔照收:" + ((@($ps.Keys) | ForEach-Object { $_ + "=" + $ps[$_] }) -join ","))
  $clk2 = New-PhaseClock
  Enter-Phase $clk2 "run"; Start-Sleep -Milliseconds 50
  $p2 = Get-PhaseSecs $clk2
  Assert-True ($p2.Contains("run") -and $clk2.Cur -eq "run" -and $clk2.Ms.Count -eq 0 -and -not (Get-PhaseSecs $null).Count) "TP2 正在走的段计到此刻;读不改时钟;空时钟回空表"

  $wd = @(Write-Degraded "unit-degrade" "slot=1 | refused:x" 6>&1 | ForEach-Object { [string]$_ })
  $dg = Read-TelEvent "degraded" "key" "unit-degrade"
  Assert-True ($wd.Count -eq 1 -and $wd[0] -eq "WARN unit-degrade | slot=1 | refused:x") ("TD1 WARN 行 = WARN <键> | <现场>:" + ($wd -join " / "))
  Assert-True ($dg -and $dg.src -eq "hook函数库测试" -and $dg.detail -eq "slot=1 | refused:x") ("TD2 同时写 event=degraded,来源缺省取调用点所在脚本名:" + $(if ($dg) { $dg.src } else { "无" }))
  $wd = @(Write-Degraded "unit-degrade-msg" "why" "原样文案(保留既有措辞)" "单仓提交" 6>&1 | ForEach-Object { [string]$_ })
  $dg = Read-TelEvent "degraded" "key" "unit-degrade-msg"
  Assert-True ($wd.Count -eq 1 -and $wd[0] -eq "WARN 原样文案(保留既有措辞)" -and $dg -and $dg.src -eq "单仓提交" -and $dg.detail -eq "why") "TD3 给了文案就原样打;显式来源照写"
  $wd = @(Write-Degraded "unit-degrade-guard" "g" -Guard "unit-guard" 6>&1 | ForEach-Object { [string]$_ })
  $dg = Read-TelEvent "degraded" "key" "unit-degrade-guard"
  $dgNo = Read-TelEvent "degraded" "key" "unit-degrade"
  Assert-True ($wd.Count -eq 1 -and $dg -and $dg.guard -eq "unit-guard" -and $dgNo -and -not $dgNo.PSObject.Properties["guard"]) "TD4 给了护栏名写进 guard 字段;没给的不写该字段"
  # Write-GuardOk:护栏走到且没降级,只写遥测(检查命中面板疑似恒降级的分母),不打输出;护栏名为空不写。
  function Get-TelCount([string]$EventName) {
    $tdir = Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry"
    return @(Get-ChildItem $tdir -Filter "wf-*.jsonl" -EA SilentlyContinue | ForEach-Object { [System.IO.File]::ReadAllLines($_.FullName) } |
             Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json } | Where-Object { $_.event -eq $EventName }).Count
  }
  $go = @(Write-GuardOk "unit-guard" 6>&1 | ForEach-Object { [string]$_ })
  $gk = Read-TelEvent "guard-ok" "guard" "unit-guard"
  Assert-True ($go.Count -eq 0 -and $gk -and $gk.src -eq "hook函数库测试") ("TG1 写 event=guard-ok(guard / 来源缺省取调用点脚本名),不打输出:" + ($go -join " / "))
  $okBefore = Get-TelCount "guard-ok"
  Write-GuardOk ""
  Assert-True ((Get-TelCount "guard-ok") -eq $okBefore) "TG2 护栏名为空不写"
  # 交付关联号与护栏名规整:有 FLOW_DELIVER_RUN 时两函数都带 run,没有时不写;< > & ' " 换成 _(防面板按正则读时同名拆两份)。
  Assert-True (-not $gk.PSObject.Properties["run"] -and -not $dg.PSObject.Properties["run"]) "TR1 无交付关联号时护栏行不带 run"
  $env:FLOW_DELIVER_RUN = "unitrun0002"
  try {
    Write-GuardOk "unit-guard-run<a>&'b" 6>$null
    Write-Degraded "unit-degrade-run" "d" -Guard "unit-guard-run<a>&'b" 6>$null
  } finally { Remove-Item Env:\FLOW_DELIVER_RUN -ErrorAction SilentlyContinue }
  $gkr = Read-TelEvent "guard-ok" "guard" "unit-guard-run_a___b"
  $dgr = Read-TelEvent "degraded" "key" "unit-degrade-run"
  Assert-True ($gkr -and $gkr.run -eq "unitrun0002" -and $dgr -and $dgr.run -eq "unitrun0002" -and $dgr.guard -eq "unit-guard-run_a___b") "TR2 有交付关联号时 guard-ok / degraded 都带 run,护栏名特殊字符规整为 _"
  # gate-run 拼装抛异常不得外抛:它排在 FAIL / INFRA 出口的 VERDICT 行之前(pscustomobject 没有 ContainsKey,拼 scanms 处必抛)。
  $badRun = New-GateRun "unit-gate-bad" "x"
  $badRun.Scans = @([pscustomobject]@{ Tag = "x"; Async = $false })
  $threwG = $false
  try { Write-GateRunTelemetry $badRun "FAIL-x" $false } catch { $threwG = $true }
  Assert-True (-not $threwG) "TW1 gate-run 遥测拼装出错整体吞掉,不影响自检出口"

  # ---- Resolve-WfStatePath + Get-ClaudePackageDirs(MSIX 容器内外落同一物理文件) ----
  # 每例一个独立的假 LOCALAPPDATA(经 $Lad 显式传),模拟 Packages\Claude_*\LocalCache\Local 与普通路径并存。
  function New-PkgLocal([string]$Lad, [string]$Pkg) {
    $p = Join-Path $Lad ("Packages\" + $Pkg + "\LocalCache\Local")
    [System.IO.Directory]::CreateDirectory($p) | Out-Null
    return $p
  }
  function Set-Age([string]$Path, [int]$Minutes) {
    # 目录连同直接子项一并回拨,Resolve-WfStatePath 比的是二者的最大 mtime
    $t = (Get-Date).AddMinutes(-$Minutes)
    foreach ($e in @(Get-ChildItem -LiteralPath $Path -Force)) { $e.LastWriteTime = $t }
    (Get-Item -LiteralPath $Path).LastWriteTime = $t
  }
  $bRel = "claude-wf-3b\board.json"

  $l1 = Join-Path $fx "lad-none"
  [System.IO.Directory]::CreateDirectory($l1) | Out-Null
  Assert-True ((Resolve-WfStatePath $bRel $l1) -eq (Join-Path $l1 $bRel)) "W1 无 Packages -> 普通路径"

  $l2 = Join-Path $fx "lad-other"
  New-PkgLocal $l2 "Microsoft.Foo_1" | Out-Null
  New-PkgLocal $l2 "ClaudeX" | Out-Null
  [System.IO.Directory]::CreateDirectory((Join-Path $l2 "Packages\Claude_nolocal")) | Out-Null
  Assert-True ((Resolve-WfStatePath $bRel $l2) -eq (Join-Path $l2 $bRel)) "W2 只有非 Claude_* 包 / 无 LocalCache\Local 的 Claude_* 包 -> 普通路径"

  $l3 = Join-Path $fx "lad-first"
  $p3 = New-PkgLocal $l3 "Claude_abc"
  Write-F $l3 $bRel '{"dev3":{"stage":"旧"}}' | Out-Null   # 容器外写出的旧真文件
  Assert-True ((Resolve-WfStatePath $bRel $l3) -eq (Join-Path $p3 $bRel)) "W3 包内尚无 claude-wf-3b -> 首次写直落包内,不读普通路径上的旧真文件"

  Write-F $p3 $bRel "{}" | Out-Null
  $r4 = Resolve-WfStatePath $bRel $l3
  Assert-True ($r4 -eq (Join-Path $p3 $bRel) -and (Split-Path $r4 -Parent) -eq (Resolve-WfStatePath "claude-wf-3b" $l3)) "W4 包内已有 -> 包内;看板与运行态根同根"

  $l5 = Join-Path $fx "lad-multi"
  $pa = New-PkgLocal $l5 "Claude_a"
  $pb = New-PkgLocal $l5 "Claude_b"
  New-PkgLocal $l5 "ClaudeX" | Out-Null
  $dirs = Get-ClaudePackageDirs $l5
  Assert-True ($dirs.Count -eq 2 -and (Split-Path $dirs[0] -Leaf) -eq "Claude_a" -and (Split-Path $dirs[1] -Leaf) -eq "Claude_b") "W5 Get-ClaudePackageDirs 只取 Claude_* 且 Ordinal 序"
  Set-Age $pa 60; Set-Age $pb 5
  Assert-True ((Resolve-WfStatePath $bRel $l5) -eq (Join-Path $pb $bRel)) "W6 多包都无 claude-wf-3b -> 取 LocalCache\Local 较新者"
  Write-F $pa $bRel "{}" | Out-Null
  Set-Age (Join-Path $pa "claude-wf-3b") 120
  Set-Age $pb 1
  Assert-True ((Resolve-WfStatePath $bRel $l5) -eq (Join-Path $pa $bRel)) "W7 多包只一家有 claude-wf-3b -> 取它,不看另一家更新"
  Write-F $pb $bRel "{}" | Out-Null
  Set-Age (Join-Path $pb "claude-wf-3b") 30
  Assert-True ((Resolve-WfStatePath $bRel $l5) -eq (Join-Path $pb $bRel)) "W8 多包都有 -> 取最近活动者"
  [System.IO.File]::WriteAllText((Join-Path $pa $bRel), '{"dev1":{}}')
  Assert-True ((Resolve-WfStatePath $bRel $l5) -eq (Join-Path $pa $bRel)) "W9 活动看直接子项 mtime(board.json 刚写即翻转)"

  Assert-True ($script:WfStateRoot -eq (Join-Path $env:LOCALAPPDATA "claude-wf-3b")) "W10 缺省由 `$env:LOCALAPPDATA 派生(隔离夹具无 Packages -> 落夹具内)"

  # ---- Invoke-FlowChild(拉起子脚本收输出) ----
  # 承重点:调用方 EAP=Stop(本套件即是)下子进程写 stderr 不抛,退出码与 VERDICT 行照常取回;
  # 参数含空格与 % 原样到达子进程(不经 cmd 解析)。
  $childPs = Join-Path $fx "child.ps1"
  [System.IO.File]::WriteAllText($childPs, "param([string]`$A)`r`nWrite-Host ('out-' + `$A)`r`n[Console]::Error.WriteLine('err-line')`r`nWrite-Host 'VERDICT: X'`r`nexit 3`r`n", (New-Object System.Text.UTF8Encoding($true)))
  $threwC = $false; $rc = $null
  try { $rc = Invoke-FlowChild $childPs @("-A", "a b%c") } catch { $threwC = $true }
  Assert-True (-not $threwC -and $rc.code -eq 3) "X1 子进程写 stderr 不抛,退出码取回"
  $rcLines = @($rc.lines)
  Assert-True (($rcLines -contains 'out-a b%c') -and ($rcLines -contains 'err-line') -and ($rcLines[$rcLines.Count - 1] -eq 'VERDICT: X')) "X2 stdout / stderr 行按序收回,参数原样到达"
  $rcE = Invoke-FlowChild $childPs @("-A", "e") -Echo
  Assert-True ($rcE.code -eq 3 -and @($rcE.lines) -contains 'out-e') "X3 -Echo 边回显边收,返回形态不变"

  # ---- Get-ContentDirtyPaths(内容视角判脏) ----
  # 幻影脏:入库 blob 为 CRLF、.gitattributes 要求 eol=lf,工作树内容未动 —— status 判 M,内容零差异
  # (实发:协议重导后主 Fantasy 的 OuterMessage.cs,见合并预检 B 段注释)。
  $eolRepo = Join-Path $fx "eolrepo"
  New-GitRepo $eolRepo
  G $eolRepo "config core.autocrlf false" | Out-Null
  [System.IO.File]::WriteAllText((Join-Path $eolRepo "Gen.cs"), "a`r`nb`r`n")
  G $eolRepo "add Gen.cs" | Out-Null
  G $eolRepo "commit -q -m crlf" | Out-Null
  Write-F $eolRepo ".gitattributes" "* text eol=lf`n"
  G $eolRepo "add .gitattributes" | Out-Null
  G $eolRepo "commit -q -m attrs" | Out-Null
  (Get-Item (Join-Path $eolRepo "Gen.cs")).LastWriteTime = (Get-Date).AddMinutes(1)
  Assert-True ((Get-GitLines $eolRepo "status --porcelain").Count -gt 0) "Y0 前置:status 把行尾幻影判成脏"
  Assert-True ((Get-ContentDirtyPaths $eolRepo).Count -eq 0) "Y1 行尾幻影不算脏"
  Write-F $eolRepo "seed.txt" "changed`n"
  Write-F $eolRepo "新文件.txt" "n`n"
  $cd = Get-ContentDirtyPaths $eolRepo
  Assert-True ($cd.Count -eq 2 -and ($cd -contains "seed.txt") -and ($cd -contains "新文件.txt")) "Y2 真改动与未跟踪照计(中文路径不转义)"

  # ---- Repair-EolPhantomPaths(重导后行尾幻影归一;协议导出 与 Invoke-GenReExport 共用) ----
  # 入库 LF、属性 eol=lf 的生成物被导出器按 CRLF / 混合行尾重写而内容不变:体积变了,status 恒判 M、
  # update-index --refresh 刷不掉(实发 2026-09-26 dev1/dev3 槽位交付后留 tracked 假脏,领取 FULL)。
  $phRepo = Join-Path $fx "phantomrepo"
  New-GitRepo $phRepo
  G $phRepo "config core.autocrlf false" | Out-Null
  [System.IO.Directory]::CreateDirectory((Join-Path $phRepo "Gen")) | Out-Null
  [System.IO.File]::WriteAllText((Join-Path $phRepo "Gen\Crlf.cs"), "d`r`n")   # 入库 blob 自身为 CRLF(Get-ContentDirtyPaths ②)
  # mtime 回拨:否则它在索引里是 racily clean,下面挂属性后的 add -A 会按内容复核并把它归一成 LF 重新入库
  (Get-Item (Join-Path $phRepo "Gen\Crlf.cs")).LastWriteTime = (Get-Date).AddMinutes(-5)
  G $phRepo "add Gen/Crlf.cs" | Out-Null
  G $phRepo "commit -q -m crlf-blob" | Out-Null
  Write-F $phRepo ".gitattributes" "*.cs text eol=lf`n"
  foreach ($f in @("Gen/A.cs", "Gen/中文.cs", "Gen/Real.cs", "Other/C.cs")) { Write-F $phRepo $f "a`nb`n" }
  G $phRepo "add -A" | Out-Null
  G $phRepo "commit -q -m lf-gen" | Out-Null
  foreach ($f in @("Gen\A.cs", "Gen\中文.cs", "Other\C.cs")) { [System.IO.File]::WriteAllText((Join-Path $phRepo $f), "a`r`nb`n") }
  [System.IO.File]::WriteAllText((Join-Path $phRepo "Gen\Real.cs"), "a`r`nB`r`n")
  (Get-Item (Join-Path $phRepo "Gen\Crlf.cs")).LastWriteTime = (Get-Date).AddMinutes(1)
  G $phRepo "update-index -q --refresh" | Out-Null
  $phDirty = Get-PorcelainPaths (Get-GitLines $phRepo "-c core.quotepath=false status --porcelain")
  Assert-True ($phDirty.Count -eq 5) ("Z0 前置:五个文件 status 全判 M,refresh 刷不掉(实为 " + ($phDirty -join ", ") + ")")
  $z = Repair-EolPhantomPaths $phRepo '^Gen/'
  $zFixed = @($z.fixed)
  Assert-True ($z.ok -and $zFixed.Count -eq 2 -and ($zFixed -contains "Gen/A.cs") -and ($zFixed -contains "Gen/中文.cs")) ("Z1 范围内的幻影归一(中文路径经清单文件到达)(实为 " + ($zFixed -join ", ") + ")")
  $phLeft = Get-PorcelainPaths (Get-GitLines $phRepo "-c core.quotepath=false status --porcelain")
  Assert-True (($phLeft -notcontains "Gen/A.cs") -and ($phLeft -notcontains "Gen/中文.cs")) "Z2 归一后 status 不再判脏"
  Assert-True (($phLeft -contains "Gen/Real.cs") -and [System.IO.File]::ReadAllText((Join-Path $phRepo "Gen\Real.cs")) -eq "a`r`nB`r`n") "Z3 真内容差异不碰"
  Assert-True (($phLeft -contains "Gen/Crlf.cs") -and ($phLeft -contains "Other/C.cs")) "Z4 入库 blob 为 CRLF 的与范围外的不碰"
  Assert-True ([System.IO.File]::ReadAllText((Join-Path $phRepo "Gen\A.cs")) -eq "a`nb`n") "Z5 幻影文件回到检出形态(LF)"
  $z2 = Repair-EolPhantomPaths $phRepo '^Gen/'
  Assert-True ($z2.ok -and @($z2.fixed).Count -eq 0) "Z6 重跑幂等"
  $z3 = Repair-EolPhantomPaths (Join-Path $fx "not-a-repo") ''
  Assert-True (-not $z3.ok -and $z3.note) "Z7 git 查询失败回 ok=false 带说明,不当成「无幻影」"

  # ---- Get-WorkTreeHash(检查凭据的树哈希;种子路与空索引路 -NoSeed 须逐例相等) ----
  # 种子路从真实索引拷贝起步,暂存区里的一切(已暂存新增 / 强加的忽略文件 / add -N / 未合并条目)都不得带进结果。
  $hRepo = Join-Path $fx "hashrepo"
  New-GitRepo $hRepo
  G $hRepo "config core.autocrlf false" | Out-Null
  Write-F $hRepo ".gitignore" "ig/`n"
  foreach ($f in @("keep.txt", "mod.txt", "del.txt", "中文.txt")) { Write-F $hRepo $f "v1`n" }
  G $hRepo "add -A" | Out-Null
  G $hRepo "commit -q -m base" | Out-Null
  $hClean = Get-WorkTreeHash $hRepo
  Assert-True ($hClean -match '^[0-9a-f]{40}$' -and $hClean -eq (Get-GitOne $hRepo "log -1 --format=%T")) "H1 干净树的哈希 = HEAD 的树"
  Write-F $hRepo "mod.txt" "v2-longer`n"
  [System.IO.File]::Delete((Join-Path $hRepo "del.txt"))
  Write-F $hRepo "untracked/新.txt" "u`n"
  Write-F $hRepo "staged-then-gone.txt" "s`n"
  Write-F $hRepo "ig/forced.txt" "i`n"
  Write-F $hRepo "intent.txt" "n`n"
  G $hRepo "add staged-then-gone.txt" | Out-Null
  G $hRepo "add -f ig/forced.txt" | Out-Null
  G $hRepo "add -N intent.txt" | Out-Null
  [System.IO.File]::Delete((Join-Path $hRepo "staged-then-gone.txt"))
  $hIdx = Join-Path $hRepo ".git\index"
  $hStatBefore = (Get-GitLines $hRepo "-c core.quotepath=false status --porcelain") -join "|"   # 先于取索引字节:status 自己会刷新索引
  $hIdxBefore = [System.BitConverter]::ToString([System.IO.File]::ReadAllBytes($hIdx))
  $hSeed = Get-WorkTreeHash $hRepo
  $hFresh = Get-WorkTreeHash $hRepo -NoSeed
  Assert-True ($hSeed -match '^[0-9a-f]{40}$' -and $hSeed -eq $hFresh -and $hSeed -ne $hClean) "H2 改 / 删 / 未跟踪 / 暂存区杂项并存:种子路 = 空索引路"
  $hTreeFiles = Get-GitLines $hRepo ("-c core.quotepath=false ls-tree -r --name-only " + $hSeed)
  Assert-True (($hTreeFiles -contains "untracked/新.txt") -and ($hTreeFiles -contains "intent.txt") -and ($hTreeFiles -notcontains "del.txt") -and ($hTreeFiles -notcontains "staged-then-gone.txt") -and ($hTreeFiles -notcontains "ig/forced.txt")) "H3 结果只反映工作树:暂存后删掉的与强加的忽略文件不入树"
  Assert-True ([System.BitConverter]::ToString([System.IO.File]::ReadAllBytes($hIdx)) -eq $hIdxBefore -and ((Get-GitLines $hRepo "-c core.quotepath=false status --porcelain") -join "|") -eq $hStatBefore -and -not $env:GIT_INDEX_FILE) "H4 真实索引逐字节未动,GIT_INDEX_FILE 不外泄"
  Write-F $hRepo ".gate/ticket.json" "{}"
  Assert-True ((Get-WorkTreeHash $hRepo) -eq $hSeed) "H5 .gate 未被忽略时也不入哈希"
  Write-F $hRepo "keep.txt" "v9`n"
  $hChanged = Get-WorkTreeHash $hRepo
  Write-F $hRepo "keep.txt" "v1`n"
  Assert-True ($hChanged -ne $hSeed -and (Get-WorkTreeHash $hRepo) -eq $hSeed) "H6 内容变则哈希变,同字节写回则复原"
  # racy:文件与索引同刻写出、之后同大小改内容且 mtime 不变,stat 完全对得上,只有「条目 mtime 不早于
  # 索引 mtime 就按内容复核」这条规则认得出。拷贝种子时丢了索引 mtime(变成拷贝时刻)这条规则就不触发。
  G $hRepo "reset -q --hard HEAD" | Out-Null
  $hT = (Get-Date).AddMinutes(-10)
  $hRacy = Join-Path $hRepo "keep.txt"
  (Get-Item $hRacy).LastWriteTime = $hT
  G $hRepo "update-index -q --refresh" | Out-Null
  $hPreRacy = Get-WorkTreeHash $hRepo
  [System.IO.File]::WriteAllText($hRacy, "v7`n")
  (Get-Item $hRacy).LastWriteTime = $hT
  (Get-Item $hIdx).LastWriteTime = $hT
  $hRacySeed = Get-WorkTreeHash $hRepo
  Assert-True ($hRacySeed -eq (Get-WorkTreeHash $hRepo -NoSeed) -and $hRacySeed -ne $hPreRacy) "H7 与索引同刻、同大小同 mtime 的改动照样识别(种子保留索引 mtime)"
  # 未合并条目:主仓处于合并冲突中途时照样出哈希(read-tree --reset 丢弃未合并条目,-m 会直接失败)
  G $hRepo "reset -q --hard HEAD" | Out-Null
  G $hRepo "checkout -q -b side" | Out-Null
  Write-F $hRepo "mod.txt" "side`n"
  G $hRepo "commit -q -am side" | Out-Null
  G $hRepo "checkout -q main" | Out-Null
  Write-F $hRepo "mod.txt" "main`n"
  G $hRepo "commit -q -am main" | Out-Null
  $hMerge = Invoke-GitMerged $hRepo "merge side"
  $hUnmerged = Get-GitLines $hRepo "diff --name-only --diff-filter=U"
  $hConflict = Get-WorkTreeHash $hRepo
  Assert-True ($hMerge.code -ne 0 -and $hUnmerged.Count -eq 1 -and $hConflict -match '^[0-9a-f]{40}$' -and $hConflict -eq (Get-WorkTreeHash $hRepo -NoSeed)) "H8 索引含未合并条目:种子路 = 空索引路"
  G $hRepo "merge --abort" | Out-Null
  # 种子不可用 → 退回空索引起步,结果不变;调用方预设的 GIT_INDEX_FILE 原样还回
  $hExpect = Get-WorkTreeHash $hRepo -NoSeed
  $hMissing = Join-Path $fx "no-such-index"
  $env:GIT_INDEX_FILE = $hMissing
  try { $hFallback = Get-WorkTreeHash $hRepo; $hEnvAfter = $env:GIT_INDEX_FILE }
  finally { Remove-Item Env:\GIT_INDEX_FILE -ErrorAction SilentlyContinue }
  Assert-True ($hFallback -match '^[0-9a-f]{40}$' -and $hFallback -eq $hExpect -and $hEnvAfter -eq $hMissing) "H9 取不到种子索引时退回空索引起步,预设的 GIT_INDEX_FILE 还原"
  # H10 Publish-GateTicket 判 STALE:首尾两棵树都在对象库里,DRIFT 行点名变了的路径(先于 STALE 的 VERDICT 行),$Out 收 driftPaths
  $hT0 = Get-WorkTreeHash $hRepo
  Write-F $hRepo "drift-added.txt" "d`n"
  $hOut = @{}
  $hPub = @(Publish-GateTicket $hRepo $hT0 "unit-gate" @{} $hOut 6>&1 | ForEach-Object { [string]$_ })
  $hDriftAt = [Array]::IndexOf($hPub, "DRIFT   : A drift-added.txt")
  $hStaleAt = @(for ($i = 0; $i -lt $hPub.Count; $i++) { if ($hPub[$i] -match '^VERDICT : STALE') { $i } })
  Assert-True ($hDriftAt -ge 0 -and $hStaleAt.Count -eq 1 -and $hStaleAt[0] -gt $hDriftAt -and ($hPub -contains "False")) ("H10 STALE 先打 DRIFT 行再打 VERDICT,回假:" + ($hPub -join " / "))
  $hTicket = Join-Path $hRepo ".gate\ticket.json"
  $hTicketTxt = if (Test-Path $hTicket) { [System.IO.File]::ReadAllText($hTicket) } else { "" }
  Assert-True (@($hOut.driftPaths).Count -eq 1 -and $hOut.driftPaths[0] -eq "A drift-added.txt" -and $hTicketTxt -notmatch 'unit-gate') "H10b driftPaths = 那一条;不签票"
  [System.IO.File]::Delete((Join-Path $hRepo "drift-added.txt"))

  # ---- New-FlowTempFile / Remove-FlowTempFiles(脚本自建临时件在出口统一清) ----
  $t1 = New-FlowTempFile "unit-tmp"
  [System.IO.File]::WriteAllText($t1, "x")
  $t2 = New-FlowTempFile "unit-tmp-never-written"
  $keep = Join-Path $fx "caller-owned.txt"
  [System.IO.File]::WriteAllText($keep, "y")
  Assert-True ($t1 -ne $t2 -and (Split-Path $t1 -Parent) -eq ([System.IO.Path]::GetFullPath($env:TEMP).TrimEnd('\'))) "F1 临时件落 %TEMP%、每次唯一"
  $threwF = $false
  try { Remove-FlowTempFiles; Remove-FlowTempFiles } catch { $threwF = $true }
  Assert-True (-not $threwF -and -not (Test-Path $t1)) "F2 登记过的临时件被删(未落盘的与重复清理均不抛)"
  Assert-True (Test-Path $keep) "F3 未登记的文件(调用方传入)不碰"

  # ---- Enter-DeployLock / Exit-DeployLock(本机部署锁:跨进程互斥、子进程继承、持有方崩溃不留残锁) ----
  # 锁按 FantasyRoot 折名,夹具根每轮随机,不与真开发服的锁相撞。对端一律起独立进程:Mutex 按线程归属,同进程再取恒成功。
  $lkRoot = Join-Path $fx "fantasy-lock"
  $hookLib = Join-Path $dfDir "hooks\hook函数库.ps1"
  function Invoke-LockPeer([string]$Body) {
    $out = @(& (Get-FlowEngine) -NoProfile -Command (". '$hookLib'; " + $Body) 2>&1 | ForEach-Object { [string]$_ })
    return ($out -join "`n")
  }
  $lk = Enter-DeployLock $lkRoot "unit-holder"
  Assert-True ($lk.ok -and -not $lk.inherited -and $env:FLOW_DEPLOY_LOCK -eq (Get-DeployLockName $lkRoot) -and (Test-Path (Join-Path $lkRoot ".gate\deploy-lock.txt"))) "L1 取得锁:登记环境变量与持有方信息"
  $peer = Invoke-LockPeer ("`$env:FLOW_DEPLOY_LOCK = `$null; `$l = Enter-DeployLock '$lkRoot' 'peer' 1; 'OK=' + `$l.ok + ' HOLDER=' + (`$l.note -match 'pid=$PID unit-holder')")
  Assert-True ($peer -match 'OK=False HOLDER=True') ("L2 他进程等锁超时 ok=false,且点名持有方:" + $peer)
  $peer = Invoke-LockPeer ("`$l = Enter-DeployLock '$lkRoot' 'child' 1; 'OK=' + `$l.ok + ' INH=' + `$l.inherited")
  Assert-True ($peer -match 'OK=True INH=True') ("L3 持锁进程拉起的子进程经环境变量继承,不自取(否则等到超时):" + $peer)
  Exit-DeployLock $lk
  Exit-DeployLock $lk
  Assert-True (-not $env:FLOW_DEPLOY_LOCK -and -not (Test-Path (Join-Path $lkRoot ".gate\deploy-lock.txt"))) "L4 释放幂等:环境变量与持有方信息一并清"
  $peer = Invoke-LockPeer ("`$l = Enter-DeployLock '$lkRoot' 'crash' 1; 'OK=' + `$l.ok; exit 0")
  Assert-True ($peer -match 'OK=True') ("L5 前置:释放后他进程立即取得:" + $peer)
  $lk2 = Enter-DeployLock $lkRoot "after-crash" 5
  Assert-True ($lk2.ok -and $lk2.waitedSec -lt 5) "L6 持有方未释放即退出(abandoned)不留残锁,下一个立即取得"
  Exit-DeployLock $lk2
  Assert-True ((Get-DeployLockName $lkRoot) -eq (Get-DeployLockName ($lkRoot.ToUpperInvariant() + "\"))) "L7 锁名对大小写与尾斜杠归一(同一 FantasyRoot 不分叉成两把锁)"

  # ---- Read-HookStdin / Read-HookInput -Raw(hook 读载荷;提交检查 / 命令通路检查 快速路径先取原文再判要不要全量检查) ----
  # 承重点 I2:首个 cmdlet 调用会自动加载其模块(Utility ~0.5 s、Management ~0.2 s),载入期语句或
  # Read-HookStdin 里混进一个 cmdlet,每次 Bash/PowerShell 工具调用都多等这么久且不报错。故起新进程
  # 载入本库、读一次 stdin,核两模块都未加载。stdin 经 cmd 管道喂(同 hook演练.ps1)。
  $inJson = Join-Path $fx "hook-input.json"
  [System.IO.File]::WriteAllText($inJson, '{"k":"v"}', (New-Object System.Text.UTF8Encoding($true)))
  $probe = Join-Path $fx "load-probe.ps1"
  [System.IO.File]::WriteAllText($probe, (". '" + $hookLib + "'`r`n'RAW=' + (Read-HookStdin)`r`n'MODS=' + ((Get-Module | ForEach-Object { `$_.Name }) -join ',')`r`n"), (New-Object System.Text.UTF8Encoding($true)))
  $engine = Get-FlowEngine
  $po = @(cmd /c "type `"$inJson`" | `"$engine`" -NoProfile -ExecutionPolicy Bypass -File `"$probe`"" | ForEach-Object { [string]$_ })
  Assert-True ($po -contains 'RAW={"k":"v"}') ("I1 Read-HookStdin 读 stdin 原文并剥 BOM:" + ($po -join ' | '))
  $mods = @($po | Where-Object { $_.StartsWith('MODS=', [StringComparison]::Ordinal) })
  Assert-True ($mods.Count -eq 1 -and $mods[0] -notmatch 'Microsoft\.PowerShell\.(Utility|Management)') ("I2 载入本库 + Read-HookStdin 不自动加载 Utility / Management 模块:" + ($mods -join ' | '))
  Assert-True ((Read-HookInput -Raw '{"a":1}').a -eq 1) "I3 -Raw 解析调用方已取的载荷,不再读 stdin"
  Assert-True ($null -eq (Read-HookInput -Raw '') -and $null -eq (Read-HookInput -Raw 'not json')) "I4 -Raw 空串 / 非 JSON 回 null(调用方据此放行)"
}
finally {
  $env:LOCALAPPDATA = $oldLad
  if (Test-Path $fx) { Remove-FixtureTree $fx }
}

# ---- Get-VerdictNext / Format-VerdictLine(VERDICT 续接档位;纯函数,无夹具) ----
# 档位表的承重点是**否定面**:DENIED- 前缀不通配。DENIED-tabledoc / DENIED-persist /
# DENIED-ticket-* 与例外面的 DENIED-BRIEF / DENIED-subject / DENIED-qualify 同前缀,但修法要现场判断,
# 必须落 halt——若被误派成 fix-retry,会话会拿着「改输入文件重跑一次」的授权去撞一个
# 本该交用户裁定的拒绝,而卡侧已不再留类别清单可供人工纠偏。
$verdictCases = @(
  @{ Line = "DELIVERED merged=ab12 pushed=yes deployed=yes"; Next = "go" },
  @{ Line = "ACQUIRED slot=1 mcp_instance=x";                Next = "go" },
  @{ Line = "UNITY-READY slot=2";                            Next = "go" },
  @{ Line = "ABANDONED | slot=2 | client-dropped=3";         Next = "go" },
  @{ Line = "COMMITTED sha=ab12 pushed=no";                  Next = "go" },
  @{ Line = "NOTHING-TO-COMMIT";                             Next = "go" },
  @{ Line = "CHECK-PASS | zero write";                       Next = "go" },
  @{ Line = "QUEUE dev2";                                    Next = "serial" },
  @{ Line = "DENIED-BRIEF | missing sections";               Next = "fix-retry" },
  @{ Line = "DENIED-subject | bad subject";                  Next = "fix-retry" },
  @{ Line = "DENIED-qualify | fix without 根治/补丁";         Next = "fix-retry" },
  @{ Line = "GATE-FAIL | client gate failed";                Next = "judge" },
  @{ Line = "DENIED-tabledoc | table doc gap";               Next = "halt" },
  @{ Line = "DENIED-persist | no whitelist";                 Next = "halt" },
  @{ Line = "DENIED-ticket-STALE | stale ticket";            Next = "halt" },
  @{ Line = "BLOCKED-OVERLAP | main tree dirty";             Next = "halt" },
  @{ Line = "BLOCKED-BASELINE-CONFLICT | real conflict";     Next = "halt" },
  @{ Line = "BLOCKED-PROVENANCE | foreign commit";           Next = "halt" },
  @{ Line = "CONFLICT | merge conflict";                     Next = "halt" },
  @{ Line = "CONFLICT-FANTASY | fantasy conflict";           Next = "halt" },
  @{ Line = "BLOCKED-BINARY | atlas";                        Next = "halt" },
  @{ Line = "BLOCKED-PORT | pid=1 path=x ports=11001";       Next = "halt" },
  @{ Line = "BLOCKED-UNITYMCP | slot=2 | project=x";         Next = "halt" },
  @{ Line = "BLOCKED-UNITY-DIALOG | slot=3 | pid=1 | dialog=Unity is running as administrator."; Next = "halt" },
  @{ Line = "INFRA | missing flow-config key";               Next = "halt" },
  @{ Line = "FULL";                                          Next = "halt" }
)
$badNext = @($verdictCases | Where-Object { (Get-VerdictNext $_.Line) -ne $_.Next })
$badDetail = if ($badNext.Count -gt 0) { ":" + ((@($badNext | ForEach-Object { ($_.Line -split '[\s|]+')[0] + " -> " + (Get-VerdictNext $_.Line) + "(期望 " + $_.Next + ")" })) -join ", ") } else { "" }
Assert-True ($badNext.Count -eq 0) ("V1 档位派生全表命中(" + $verdictCases.Count + " 例)" + $badDetail)

Assert-True ((Format-VerdictLine "DELIVERED merged=ab12") -eq "DELIVERED merged=ab12 next=go") "V2 next 附在行尾"
$once = Format-VerdictLine "GATE-FAIL | gate failed"
Assert-True ((Format-VerdictLine $once) -eq $once) "V3 二次拼装幂等(槽位交付透传集成交付 verdict 时不重复追加)"
Assert-True ((Format-VerdictLine "  INFRA | x  ") -eq "INFRA | x next=halt") "V4 首尾空白归一"
Assert-True ((Format-VerdictLine "DELIVERED x") -match '^DELIVERED ') "V5 正文前缀不被改写(消费方 ^VERDICT: XXX 前缀匹配不受影响)"

Write-Host ""
Exit-TestSuite
