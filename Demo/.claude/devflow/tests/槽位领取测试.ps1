# 槽位领取测试.ps1 - 槽位领取内核.ps1 -Release (就绪失败事务回滚) 与 -Abandon (显式放弃,case9*) 假仓矩阵;
# 末例 case8 验领取入口出口清理自建临时件(走 DENIED-BRIEF 出口,不调内核);case11 验入口各 VERDICT 出口的 entry-verdict 遥测。
# -Abandon 撤残留合并态的护栏遥测(guard abandon-merge-abort,读隔离 LOCALAPPDATA 按 JSON 解析):没有合并态两样都不记(case9)、
# 撤成记 guard-ok(case9b)、没撤成记 degraded 且 reset --hard 照做(case9e)。
# 隔离 git 仓 + 隔离 LOCALAPPDATA 看板;不触真槽。内核 -Release 只吃槽位根路径参数,
# 基线(ClientBaseline / FantasyBaseline)从真 flow-config 读(均 "main":客户端仓 / Fantasy 仓各自的 main),夹具用同名分支即可无需覆盖配置。
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
$fx = Join-Path $env:TEMP ("flowtest-slot-acquire-" + [Guid]::NewGuid().ToString("N"))
$tempRoot = [System.IO.Path]::GetFullPath($env:TEMP).TrimEnd('\')
$resolvedFx = [System.IO.Path]::GetFullPath($fx)
if (-not $resolvedFx.StartsWith($tempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "fixture path escaped TEMP"
}
[System.IO.Directory]::CreateDirectory($resolvedFx) | Out-Null
$dfDir = Get-ServerFlowDir $dfDir $resolvedFx   # 服务端通道关闭时换成启用服务端的 devflow 副本(见夹具库同名函数)
$slotAcquireKernel = Join-Path $dfDir "槽位领取内核.ps1"
# 真 flow-config 驱动:夹具的服务端目录名与槽位目录名都须与真配置同形,否则被测脚本
# 按配置拼出的路径落在夹具之外(服务端通道判定 / 槽位号折算都会失配)。
$cfgT = Import-PowerShellDataFile (Join-Path $dfDir "flow-config.psd1")
$srvDir = $cfgT.ServerDirName
$slotName1 = $cfgT.SlotDirPrefix + "1"

function Ahead([string]$Root) { return [int]((G $Root "rev-list --count main..HEAD")[0]) }
# 跑一次内核 -Abandon,另回这一次新增的 abandon-merge-abort 护栏行(遥测读取 = 夹具库 Get-TelRows)。
function Abandon([string]$Slot) {
  $n0 = @(Get-TelRows).Count
  $out = @(& (Get-FlowEngine) -NoProfile -File $slotAcquireKernel -Abandon $Slot 2>&1 | ForEach-Object { [string]$_ })
  $code = $LASTEXITCODE
  $g = @(Get-TelRows | Select-Object -Skip $n0 | Where-Object { $_.guard -eq "abandon-merge-abort" })
  return [pscustomobject]@{ Code = $code; Out = ($out -join "`n"); Guard = $g }
}
function Clean([string]$Root) { return ((G $Root "status --porcelain").Count -eq 0) }
function Release([string]$Slot) {
  $out = @(& (Get-FlowEngine) -NoProfile -File $slotAcquireKernel -Release $Slot 2>&1 | ForEach-Object { [string]$_ })
  return [pscustomobject]@{ Code = $LASTEXITCODE; Out = ($out -join "`n") }
}

$oldLocalAppData = $env:LOCALAPPDATA
try {
  $env:LOCALAPPDATA = Join-Path $resolvedFx "AppData"
  [System.IO.Directory]::CreateDirectory($env:LOCALAPPDATA) | Out-Null

  $mainC = Join-Path $resolvedFx "Main"
  $mainF = Join-Path $resolvedFx "FantasyMain"
  $slotBase = Join-Path $resolvedFx "slots"
  $slot = Join-Path $slotBase $slotName1
  $slotF = Join-Path $slot $srvDir

  # -- 客户端主仓(main)+ Fantasy 主仓(main) --
  [System.IO.Directory]::CreateDirectory($mainC) | Out-Null
  G $mainC "init -q -b main" | Out-Null
  G $mainC "config user.email test@example.invalid" | Out-Null
  G $mainC "config user.name test" | Out-Null
  Write-F $mainC "README.md" "client`n"
  Write-F $mainC ".gitignore" ".gate/`n/$srvDir/`n"   # 真客户端仓忽略服务端 worktree 目录,否则它会以未跟踪身份污染 status
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m init" | Out-Null

  [System.IO.Directory]::CreateDirectory($mainF) | Out-Null
  G $mainF "init -q -b main" | Out-Null
  G $mainF "config user.email test@example.invalid" | Out-Null
  G $mainF "config user.name test" | Out-Null
  Write-F $mainF "README.md" "server`n"
  G $mainF "add -A" | Out-Null
  G $mainF "commit -q -m init" | Out-Null

  # -- 槽位 worktree(客户端 + Fantasy 各一支 agent/dev1) --
  [System.IO.Directory]::CreateDirectory($slotBase) | Out-Null
  G $mainC ("worktree add " + $slot + " -b agent/dev1") | Out-Null
  G $mainF ("worktree add " + $slotF + " -b agent/dev1") | Out-Null
  foreach ($r in @($slot, $slotF)) {
    G $r "config user.email test@example.invalid" | Out-Null
    G $r "config user.name test" | Out-Null
  }

  # -- Case 1 · 回滚成功:恰 1 条空 claim 占位 -> RELEASED + 槽回空闲 --
  G $slot "commit -q --allow-empty -m `"claim: acquire smoke`"" | Out-Null
  Assert-True ((Ahead $slot) -eq 1) "case1 setup: 1 empty claim ahead"
  $r = Release $slot
  Assert-True ($r.Code -eq 0 -and $r.Out -match 'RELEASED ') "case1: release rolls back the claim (RELEASED, exit 0)"
  Assert-True ((Ahead $slot) -eq 0 -and (Clean $slot)) "case1: slot reset to main (0 ahead, clean)"

  # -- Case 2 · 幂等:已空闲再回滚 -> RELEASED already-idle,不动 --
  $r = Release $slot
  Assert-True ($r.Code -eq 0 -and $r.Out -match 'already-idle') "case2: idempotent on idle slot (RELEASED already-idle)"
  Assert-True ((Ahead $slot) -eq 0) "case2: idle slot unchanged"

  # -- Case 3 · dirty 允许回滚(untracked):1 空 claim + untracked 文件 -> RELEASED,claim 抹掉,untracked 保留 --
  # 新语义:dirty 不再阻塞回滚(idle 只看 ahead);reset --hard 只动 tracked,untracked 不碰。
  G $slot "commit -q --allow-empty -m `"claim: acquire smoke`"" | Out-Null
  Write-F $slot "scratch.txt" "uncommitted`n"
  $r = Release $slot
  Assert-True ($r.Code -eq 0 -and $r.Out -match 'RELEASED ') "case3: untracked-dirty slot rolls back (RELEASED)"
  Assert-True ((Ahead $slot) -eq 0) "case3: claim abolished by rollback"
  Assert-True ((Test-Path (Join-Path $slot "scratch.txt"))) "case3: untracked file preserved by reset --hard"
  [System.IO.File]::Delete((Join-Path $slot "scratch.txt"))

  # -- Case 3b · dirty 允许回滚(tracked modified):1 空 claim + 已跟踪文件被改 -> RELEASED,tracked 恢复到基线 --
  G $slot "commit -q --allow-empty -m `"claim: acquire smoke`"" | Out-Null
  Write-F $slot "README.md" "modified by agent`n"       # README.md 是 tracked;此写改动它
  Assert-True (-not (Clean $slot)) "case3b setup: tracked file is modified (dirty)"
  $r = Release $slot
  Assert-True ($r.Code -eq 0 -and $r.Out -match 'RELEASED ') "case3b: tracked-dirty slot rolls back (RELEASED)"
  Assert-True ((Ahead $slot) -eq 0 -and (Clean $slot)) "case3b: tracked file restored, slot clean"

  # -- Case 4 · 非 claim 守卫:1 条 subject 非 claim: 的空提交 -> ABORT,提交保留 --
  G $slot "commit -q --allow-empty -m `"wip: not a claim`"" | Out-Null
  $r = Release $slot
  Assert-True ($r.Code -eq 1 -and $r.Out -match 'not a claim placeholder') "case4: non-claim commit refused (ABORT)"
  Assert-True ((Ahead $slot) -eq 1) "case4: non-claim commit retained"
  G $slot "reset -q --hard main" | Out-Null

  # -- Case 5 · 真活守卫:1 空 claim + 1 条非空真提交(ahead=2) -> ABORT,全保留 --
  G $slot "commit -q --allow-empty -m `"claim: acquire smoke`"" | Out-Null
  Write-F $slot "work.txt" "real work`n"
  G $slot "add -A" | Out-Null
  G $slot "commit -q -m `"feat: real work`"" | Out-Null
  Assert-True ((Ahead $slot) -eq 2) "case5 setup: 2 ahead (claim + real work)"
  $r = Release $slot
  Assert-True ($r.Code -eq 1 -and $r.Out -match 'ABORT release') "case5: real work refused (ABORT)"
  Assert-True ((Ahead $slot) -eq 2) "case5: nothing removed when real work present"
  G $slot "reset -q --hard main" | Out-Null

  # -- Case 6 · Fantasy 领先守卫:客户端 1 空 claim + Fantasy 侧 1 真提交 -> ABORT,全保留 --
  # fx_ahead 仍是占用信号:Fantasy 有真活时 Invoke-Release 拒绝(Test-CleanSingleClaim 里 fx_ahead 须空)。
  G $slot "commit -q --allow-empty -m `"claim: acquire smoke`"" | Out-Null
  Write-F $slotF "server.txt" "server work`n"
  G $slotF "add -A" | Out-Null
  G $slotF "commit -q -m `"feat: server work`"" | Out-Null
  Assert-True ((Ahead $slotF) -eq 1) "case6 setup: fantasy ahead=1"
  $r = Release $slot
  Assert-True ($r.Code -eq 1 -and $r.Out -match 'fantasy has 1 ahead') "case6: fantasy ahead refused (ABORT)"
  Assert-True ((Ahead $slot) -eq 1 -and (Ahead $slotF) -eq 1) "case6: nothing removed when fantasy has work"
  G $slot "reset -q --hard main" | Out-Null
  G $slotF "reset -q --hard main" | Out-Null      # agent/dev1 回到 main 位置,fx_ahead 归 0

  # -- Case 7 · Fantasy 侧 dirty(未提交)+ fx_ahead=0 + 客户端 1 空 claim -> RELEASED --
  # 关键新语义:Fantasy dirty(tracked)不再阻塞回滚;Fantasy 侧不做 reset(Invoke-Release 只 reset 客户端仓),
  # 所以 Fantasy 的 dirty 会保留;客户端 claim 被抹。
  G $slot "commit -q --allow-empty -m `"claim: acquire smoke`"" | Out-Null
  Write-F $slotF "README.md" "server modified`n"
  Assert-True (-not (Clean $slotF)) "case7 setup: fantasy dirty (tracked modified)"
  $r = Release $slot
  Assert-True ($r.Code -eq 0 -and $r.Out -match 'RELEASED ') "case7: fantasy-dirty (no ahead) allows client rollback (RELEASED)"
  Assert-True ((Ahead $slot) -eq 0) "case7: client claim abolished"
  Assert-True (-not (Clean $slotF)) "case7: fantasy dirty preserved (Invoke-Release only touches client)"
  G $slotF "checkout -q -- README.md" | Out-Null

  # -- Case 9 · 显式放弃:客户端 claim + 真提交 + tracked 改动、Fantasy 真提交 + tracked 改动 -> ABANDONED,双仓回基线 --
  # -Release 在 case5/case6 拒绝的形态,-Abandon 照收;untracked 保留(同领用复原口径);丢弃的提交逐条列出。
  G $slot "commit -q --allow-empty -m `"claim: abandon smoke`"" | Out-Null
  Write-F $slot "work.txt" "real work`n"
  G $slot "add -A" | Out-Null
  G $slot "commit -q -m `"feat: client work`"" | Out-Null
  Write-F $slot "README.md" "tracked edit`n"
  Write-F $slot "keep-untracked.txt" "untracked`n"
  Write-F $slotF "server.txt" "server work`n"
  G $slotF "add -A" | Out-Null
  G $slotF "commit -q -m `"feat: server work`"" | Out-Null
  Write-F $slotF "README.md" "server tracked edit`n"
  $ab9 = Abandon $slot
  $code = $ab9.Code; $txt = $ab9.Out
  $ok9 = ($code -eq 0 -and $txt -match 'ABANDONED dev1 client-dropped=2 fantasy-dropped=1 tracked-dirty=2')
  Assert-True $ok9 ("case9: abandon drops both repos (ABANDONED, exit 0)" + $(if (-not $ok9) { " | " + $txt } else { "" }))
  Assert-True ($ab9.Guard.Count -eq 0) "case9: no residual merge -> abandon-merge-abort guard not reached (no guard-ok / degraded)"
  Assert-True ($txt -match 'INFO dropped: client [0-9a-f]+ feat: client work' -and $txt -match 'INFO dropped: fantasy [0-9a-f]+ feat: server work') "case9: dropped commits listed"
  Assert-True ((Ahead $slot) -eq 0 -and (Ahead $slotF) -eq 0 -and (Clean $slotF)) "case9: both repos back at baseline, fantasy clean"
  Assert-True (((G $slot "status --porcelain") -join "|") -eq "?? keep-untracked.txt") "case9: client tracked reset, untracked preserved"
  [System.IO.File]::Delete((Join-Path $slot "keep-untracked.txt"))

  # -- Case 9b · 放弃撤残留合并态:Fantasy 停在冲突合并中 -> ABANDONED 且 MERGE_HEAD 消失 --
  G $slot "commit -q --allow-empty -m `"claim: merge residue`"" | Out-Null
  Write-F $mainF "README.md" "main side`n"; G $mainF "commit -q -am main-side" | Out-Null
  Write-F $slotF "README.md" "slot side`n"; G $slotF "commit -q -am slot-side" | Out-Null
  G $slotF "merge main" | Out-Null   # 冲突,留下 MERGE_HEAD
  $mhBefore = @(G $slotF "rev-parse -q --verify MERGE_HEAD" | Where-Object { $_ }).Count -gt 0
  $ab9b = Abandon $slot
  $code = $ab9b.Code
  $mhAfter = @(G $slotF "rev-parse -q --verify MERGE_HEAD" | Where-Object { $_ }).Count -gt 0
  Assert-True ($mhBefore -and $code -eq 0 -and -not $mhAfter -and (Ahead $slotF) -eq 0 -and (Clean $slotF)) "case9b: residual merge aborted, fantasy reset to baseline"
  Assert-True ($ab9b.Guard.Count -eq 1 -and $ab9b.Guard[0].event -eq "guard-ok" -and $ab9b.Guard[0].src -eq "槽位领取内核") ("case9b: abort took effect -> one guard-ok (guard abandon-merge-abort), got " + $ab9b.Guard.Count)

  # -- Case 9c · 护栏:目录名不合 SlotDirPrefix<N> -> ABORT,不动 --
  $out = @(& (Get-FlowEngine) -NoProfile -File $slotAcquireKernel -Abandon $mainC 2>&1 | ForEach-Object { [string]$_ })
  Assert-True ($LASTEXITCODE -eq 1 -and ($out -join "`n") -match 'not a slot directory') "case9c: non-slot path refused"

  # -- Case 9d · 已空闲 -> ABANDONED 零丢弃(幂等) --
  $out = @(& (Get-FlowEngine) -NoProfile -File $slotAcquireKernel -Abandon $slot 2>&1 | ForEach-Object { [string]$_ })
  Assert-True ($LASTEXITCODE -eq 0 -and ($out -join "`n") -match 'client-dropped=0 fantasy-dropped=0') "case9d: idle slot abandon is a no-op"

  # -- Case 9e · 撤残留合并态没生效(干净合入的文件又有未暂存改动,merge --abort 拒)-> 原 WARN 照打、reset --hard 照做,
  # 记 degraded(key abandon-merge-abort-failed / guard abandon-merge-abort),不记 guard-ok --
  G $slot "commit -q --allow-empty -m `"claim: abort fails`"" | Out-Null
  Write-F $mainF "other.txt" "base`n"; G $mainF "add -A" | Out-Null; G $mainF "commit -q -m other-base" | Out-Null
  G $slotF "merge -q --ff-only main" | Out-Null
  Write-F $mainF "README.md" "main side 9e`n"; Write-F $mainF "other.txt" "main-b`n"; G $mainF "commit -q -am main-9e" | Out-Null
  Write-F $slotF "README.md" "slot side 9e`n"; G $slotF "commit -q -am slot-9e" | Out-Null
  G $slotF "merge main" | Out-Null                                  # README 冲突;other.txt 干净合入、已暂存
  Write-F $slotF "other.txt" "edited after merge`n"                 # 未暂存改动 -> merge --abort(reset --merge)拒
  $ab9e = Abandon $slot
  $mh9e = @(G $slotF "rev-parse -q --verify MERGE_HEAD" | Where-Object { $_ }).Count -gt 0
  Assert-True ($ab9e.Code -eq 0 -and $ab9e.Out -match '(?m)^WARN abandon: fantasy merge --abort 未生效' -and $ab9e.Out -match 'ABANDONED dev1' -and -not $mh9e -and (Ahead $slotF) -eq 0 -and (Clean $slotF)) ("case9e: abort failed -> original WARN, reset --hard still clears the merge (ABANDONED) | " + $ab9e.Out)
  Assert-True ($ab9e.Guard.Count -eq 1 -and $ab9e.Guard[0].event -eq "degraded" -and $ab9e.Guard[0].key -eq "abandon-merge-abort-failed" -and ([string]$ab9e.Guard[0].detail).StartsWith("fantasy merge --abort 未生效", [System.StringComparison]::Ordinal)) ("case9e: one degraded row, no guard-ok | " + $(if ($ab9e.Guard.Count) { $ab9e.Guard[0].event + " " + $ab9e.Guard[0].detail } else { "none" }))

  # -- Case 10 · 领取入口 -Abandon 参数闸:缺 -Slot / 混入领取参数 / 越界 -> DENIED,均在调内核之前拒 --
  # 入口按真 flow-config 拼槽位根,本例只走拒绝分支,不触真槽。
  foreach ($c in @(
      @{ Args = @("-Abandon");                                  Pat = '需要 -Slot';     Name = "缺 -Slot" },
      @{ Args = @("-Abandon", "-Slot", "1", "-Topic", "x");     Pat = '只认 -Slot';     Name = "混入领取参数" },
      @{ Args = @("-Abandon", "-Slot", "1", "-StartUnity");     Pat = '只认 -Slot';     Name = "混入 -StartUnity" },
      @{ Args = @("-Abandon", "-Slot", "99");                   Pat = 'slot must be in'; Name = "越界" })) {
    $a = $c.Args
    $o = @(& (Get-FlowEngine) -NoProfile -File (Join-Path $dfDir "槽位领取.ps1") @a 2>&1 | ForEach-Object { [string]$_ })
    $v = [string](@($o | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
    Assert-True ($LASTEXITCODE -eq 1 -and $v -match '^VERDICT: DENIED' -and $v -match $c.Pat -and $v -match 'next=halt$') ("case10: -Abandon " + $c.Name + " -> DENIED")
  }

  # -- Case 8 · 领取入口出口清理自建临时件(主题 / 清单转写文件),不碰调用方传入的文件 --
  # 走 DENIED-BRIEF 出口:主题转写文件已建、内核未调,真槽位与真配置之外零动作。
  # TEMP/TMP 指到夹具内,出口后按前缀数残留;修前每次领取在 %TEMP% 留一份,永不删除。
  $isoTemp = Join-Path $resolvedFx "tmp"
  [System.IO.Directory]::CreateDirectory($isoTemp) | Out-Null
  $callerBrief = Join-Path $resolvedFx "brief-bad.md"
  $callerPaths = Join-Path $resolvedFx "paths.txt"
  [System.IO.File]::WriteAllText($callerBrief, "no sections`n", (New-Object System.Text.UTF8Encoding($false)))
  [System.IO.File]::WriteAllText($callerPaths, "Demo/Assets/X.cs`n", (New-Object System.Text.UTF8Encoding($false)))
  $oldTemp = $env:TEMP; $oldTmp = $env:TMP
  try {
    $env:TEMP = $isoTemp; $env:TMP = $isoTemp
    $acqOut = @(& (Get-FlowEngine) -NoProfile -File (Join-Path $dfDir "槽位领取.ps1") -Topic "临时件清理烟测" -BriefFile $callerBrief -PathsFile $callerPaths -NoUnity 2>&1 | ForEach-Object { [string]$_ })
  } finally { $env:TEMP = $oldTemp; $env:TMP = $oldTmp }
  $acqV = [string](@($acqOut | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
  Assert-True ($acqV -match '^VERDICT: DENIED-BRIEF') "case8 setup: 不合规简报在内核之前被拒"
  $leftover = @([System.IO.Directory]::GetFiles($isoTemp, "slot-acquire-*"))
  Assert-True ($leftover.Count -eq 0) ("case8: 出口清掉自建临时件(残留 " + $leftover.Count + ")")
  Assert-True ((Test-Path $callerBrief) -and (Test-Path $callerPaths)) "case8: 调用方传入的简报与清单不删"

  # -- Case 11 · 入口遥测:每个 VERDICT 出口写一行 event=entry-verdict(case10 四次 DENIED + case8 一次 DENIED-BRIEF,
  # 子进程继承本套件的隔离 LOCALAPPDATA);VERDICT 文本与出口码不变由上面各例锁着。
  $telRows = @(Get-ChildItem (Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry") -Filter "wf-*.jsonl" -EA SilentlyContinue |
               ForEach-Object { [System.IO.File]::ReadAllLines($_.FullName) } | Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json } |
               Where-Object { $_.event -eq "entry-verdict" -and $_.entry -eq "槽位领取" })
  $denRows = @($telRows | Where-Object { $_.verdict -eq "DENIED" })
  $briefRows = @($telRows | Where-Object { $_.verdict -eq "DENIED-BRIEF" })
  Assert-True ($denRows.Count -eq 4 -and @($denRows | Where-Object { $_.next -eq "halt" -and $_.exit -eq 1 -and $_.detail -and $_.secs -ge 0 }).Count -eq 4) ("case11: 参数闸的 DENIED 出口各写一行(next=halt / exit=1 / detail / secs),实得 " + $denRows.Count)
  Assert-True (@($denRows | Where-Object { $_.slot -eq "99" -and $_.detail -match 'slot must be in' }).Count -eq 1) "case11b: 越界那次带调用方给的槽号与正文"
  Assert-True ($briefRows.Count -eq 1 -and $briefRows[0].next -eq "fix-retry" -and $briefRows[0].topic -eq "临时件清理烟测" -and $null -ne $briefRows[0].phases.brief -and -not $briefRows[0].phases.kernel) ("case11c: 简报被拒的出口带主题与 brief 段耗时,没走到的 kernel 段不写:" + $(if ($briefRows.Count) { ($briefRows[0].phases | ConvertTo-Json -Compress) } else { "无" }))
} finally {
  $env:LOCALAPPDATA = $oldLocalAppData
  # 全通过才删夹具;有失败则留盘供排查(GUID 命名不会与下一轮冲突)
  if ($script:TestFail -eq 0) { Remove-FixtureTree $resolvedFx } else { Write-Host ("INFO 夹具保留供排查:" + $resolvedFx) }
}

Exit-TestSuite
