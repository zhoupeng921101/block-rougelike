# 槽位领取就绪检查测试.ps1 - Test-BridgePortOpen 正向可达探针 + Get-CsprojRegenNeed 须重生成判定
# + 启动期模态对话框判别(清单匹配与计时状态机)单测。
# 经 SLOT_ACQUIRE_NOEXEC=1 dot-source 槽位领取.ps1 只加载函数、不跑领取主流程,
# 再对「真起的 TcpListener 端口(可连)」与「未监听端口(不可连)」断言探针返回;
# 对 %TEMP% 下假 Unity 工程断言须重生成判定(引用集过期 / 宏过期 / 不过期 / 判定跑不成按未过期并带原因);
# 对话框判别喂注入的(pid, 窗口标题, 时刻)样本,不起窗口、不读编辑器进程。
# 场景备份清理(S 段):夹具 = %TEMP% 下的假槽位池(主仓 + 槽位各带 Demo\Temp\__Backupscenes),配置以哈希表注入;
# 覆盖路径校验的否定面、槽位池是盘根的布局(纯路径串)、删净与不碰旁物、目录不存在、删不掉不抛、目录联接不跟进。接线(W 段)起子进程跑真的
# Invoke-UnityReadySequence:假 Unity.exe 是空文件(启动必然失败,子进程据此打 START-ATTEMPTED 退出,不执行任何东西),
# 「已有编辑器在跑」用占住 Temp\UnityLockfile 模拟(此时不启动,就绪必然超时、以 BLOCKED-UNITYMCP 收尾);子进程自带隔离 LOCALAPPDATA。
# 免启领取的收尾清理(W6 / W7)由同一个子进程直接调 Invoke-NoUnityClaimSceneBackupClear;它在入口主流程里的位置由 W0b 静态核对。
# W8 读子进程的隔离遥测:场景备份没清成记 event=degraded(guard)、清成记 guard-ok、没走到不记,就绪超时出口记 entry-verdict;
# CS 段同一子进程喂合成的 csproj 判定结果,核输出与 degraded / guard-ok。K 段在本进程单测内核拒绝分支的遥测关联字段
# (Set-KernelRefusalTelemetry),W0c 静态核领取路径上分段计时与 claim 的接线次序(那条路径要真内核,不进动态矩阵)。
# 不覆盖:按 pid 读真窗口标题后置顶那一段(要有可见窗口的进程,不放进矩阵),对话框判别在就绪循环里的接线。
# 不触真槽 / 真编辑器 / 真 claude-wf-3b。
$ErrorActionPreference = "Stop"
$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
$acquireScript = Join-Path $dfDir "槽位领取.ps1"

. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")

$old = $env:SLOT_ACQUIRE_NOEXEC
try {
  $env:SLOT_ACQUIRE_NOEXEC = '1'
  . $acquireScript -Topic 'noexec-probe'   # dot-source:测试钩子使其只定义函数即返回;-Topic 占位满足强制参数绑定
  Assert-True ((Get-Command Test-BridgePortOpen -ErrorAction SilentlyContinue) -ne $null) "probe function loaded via test hook"

  # -- Case 1 · 端口有监听 -> 可连 --
  $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
  $listener.Start()
  $openPort = ([System.Net.IPEndPoint]$listener.LocalEndpoint).Port
  try {
    Assert-True (Test-BridgePortOpen $openPort 1000) "case1: listening port reported OPEN"
  } finally {
    $listener.Stop()
  }

  # -- Case 2 · 同端口停止监听后 -> 不可连 --
  Assert-True (-not (Test-BridgePortOpen $openPort 500)) "case2: stopped port reported CLOSED"

  # -- Case 3 · 非法端口 0 -> 直接假,不抛 --
  Assert-True (-not (Test-BridgePortOpen 0 500)) "case3: port 0 short-circuits false"

  # -- Case D1-D9 · 启动期模态对话框判别 --
  # 承重点是否定面:清单外的标题一律不判。误判会把正在导入的编辑器报成要人处置并回滚占位,
  # 漏判只是回落到原来的 BLOCKED-UNITYMCP。
  $adminTitle = "Unity is running as administrator."
  $recoverTitle = "Recovering Scene Backups"
  $normalTitle = "Administrator: Demo - main - Windows, Mac, Linux - Unity 6.3 LTS (6000.3.19f1) <DX11>"
  Assert-True ((Get-UnityStartupDialog $adminTitle).Title -eq $adminTitle -and (Get-UnityStartupDialog $recoverTitle).Title -eq $recoverTitle) "caseD1: 两个实发过的对话框标题命中清单"
  Assert-True ((Get-UnityStartupDialog ("  " + $adminTitle + " ")).Title -eq $adminTitle) "caseD2: 标题首尾空白不影响命中"
  $notDialog = @($normalTitle, "", "Unity", "Importing Assets", "Hold on...", "Compiling Scripts", "unity is running as administrator.", ("Administrator: " + $recoverTitle), ($recoverTitle + " - Demo"))
  $wrongHit = @($notDialog | Where-Object { $null -ne (Get-UnityStartupDialog $_) })
  Assert-True ($wrongHit.Count -eq 0) ("caseD3: 正常主窗口 / 空标题 / 进度窗 / 大小写或前后缀不同的标题都不判 " + ($wrongHit -join " | "))
  $needGap = @(Get-UnityStartupDialogCatalog | Where-Object { -not $_.Title -or -not $_.Need -or ([string]$_.Need).Contains("|") })
  Assert-True ($needGap.Count -eq 0) "caseD4: 清单每项都有标题与 need 文案,文案不含 VERDICT 的字段分隔符"

  $t0 = [DateTime]::new(2026, 10, 9, 15, 0, 47, [DateTimeKind]::Utc)
  $w = New-StartupDialogWatch
  $s1 = Step-StartupDialogWatch $w 52656 $adminTitle $t0 20
  $s2 = Step-StartupDialogWatch $w 52656 $adminTitle $t0.AddSeconds(10) 20
  $s3 = Step-StartupDialogWatch $w 52656 $adminTitle $t0.AddSeconds(20) 20
  Assert-True ($s1.Event -eq "seen" -and $s2.Event -eq "pending" -and $s3.Event -eq "stuck" -and $s3.Seconds -eq 20 -and $s3.Title -eq $adminTitle -and $s3.Need -and $w.EditorPid -eq 52656) ("caseD5: 同一对话框连续在场:首见 seen、宽限内 pending、满宽限 stuck 并带标题与 need " + $s1.Event + "/" + $s2.Event + "/" + $s3.Event)

  $w = New-StartupDialogWatch
  [void](Step-StartupDialogWatch $w 67892 $recoverTitle $t0 20)
  $c1 = Step-StartupDialogWatch $w 67892 $normalTitle $t0.AddSeconds(8) 20
  $c2 = Step-StartupDialogWatch $w 67892 $normalTitle $t0.AddSeconds(10) 20
  $c3 = Step-StartupDialogWatch $w 67892 $recoverTitle $t0.AddSeconds(30) 20
  Assert-True ($c1.Event -eq "cleared" -and $c1.Title -eq $recoverTitle -and $c1.Seconds -eq 8 -and $c2.Event -eq "none" -and $c3.Event -eq "seen" -and $c3.Seconds -eq 0) ("caseD6: 宽限内被人处置 -> cleared 一次后回 none;再弹从零计时,不沿用旧时刻 " + $c1.Event + "/" + $c2.Event + "/" + $c3.Event)

  $w = New-StartupDialogWatch
  [void](Step-StartupDialogWatch $w 100 $adminTitle $t0 20)
  $p1 = Step-StartupDialogWatch $w 200 $adminTitle $t0.AddSeconds(19) 20
  $p2 = Step-StartupDialogWatch $w 200 $recoverTitle $t0.AddSeconds(38) 20
  Assert-True ($p1.Event -eq "seen" -and $p1.Seconds -eq 0 -and $p2.Event -eq "seen" -and $p2.Title -eq $recoverTitle) ("caseD7: 换了进程或换了对话框都重新计时(两个各 19 秒不拼成一个 38 秒)" + $p1.Event + "/" + $p2.Event)

  $w = New-StartupDialogWatch
  $z1 = Step-StartupDialogWatch $w 1 $adminTitle $t0 0
  $z2 = Step-StartupDialogWatch (New-StartupDialogWatch) 1 $normalTitle $t0 0
  Assert-True ($z1.Event -eq "stuck" -and $z2.Event -eq "none") "caseD8: 宽限 0 首见即 stuck;没有对话框时宽限 0 也不判"

  $noProc = 0x7FFFFFF0
  Assert-True ($null -eq (Get-ProcessMainWindow $noProc) -and $null -eq (Get-ProcessMainWindow 0) -and -not (Set-WindowTopmostNoActivate ([IntPtr]::Zero))) "caseD9a: 进程不在回 null、零句柄置顶回假,都不抛"
  $ghost = Join-Path $env:TEMP ("flowtest-noeditor-" + [Guid]::NewGuid().ToString("N"))
  $gp = Invoke-StartupDialogProbe (New-StartupDialogWatch) $ghost $noProc 20
  Assert-True (@(Get-UnityProjectProcesses $ghost).Count -eq 0 -and $gp.Event -eq "none") "caseD9b: 没有编辑器进程指向该工程 -> 探测回 none(回落到原有就绪超时出口)"

  # -- Case S1-S8 · 场景备份清理(路径校验 + 删除)--
  # 承重点是否定面:校验不过必须零删除。删错地方(主仓、别的槽位、联接指向的目录)不可恢复。
  $script:sbx = Join-Path $env:TEMP ("flowtest-scenebak-" + [Guid]::NewGuid().ToString("N"))
  $pool = Join-Path $script:sbx "pool"
  $mainRoot = Join-Path $pool "block-rougelike"
  $sbCfg = @{ SlotBaseDir = $pool; RepoRoot = $mainRoot; SlotDirPrefix = "block-rougelike-dev"; SlotCount = "3" }
  function Get-SlotRootFx([int]$N) { return (Join-Path $pool ("block-rougelike-dev" + $N)) }
  function New-BackupFx([string]$Root) {
    # 在 <Root>\Demo 下造:Temp\__Backupscenes(2 个文件 + 子目录里 1 个只读文件)、Temp 下的旁物、Assets\_Recovery。
    Write-F $Root "Demo/Temp/__Backupscenes/0.backup" "scene-a"
    Write-F $Root "Demo/Temp/__Backupscenes/1.backup" "scene-b"
    Write-F $Root "Demo/Temp/__Backupscenes/sub/2.backup" "scene-c"
    [System.IO.File]::SetAttributes((Join-Path $Root "Demo\Temp\__Backupscenes\sub\2.backup"), [System.IO.FileAttributes]::ReadOnly)
    Write-F $Root "Demo/Temp/other/keep.txt" "keep"
    Write-F $Root "Demo/Temp/keep.txt" "keep"
    Write-F $Root "Demo/Assets/_Recovery/0.unity" "keep"
  }
  function Get-BackupDirFx([string]$Root) { return (Join-Path $Root "Demo\Temp\__Backupscenes") }
  function Test-NeighborsFx([string]$Root) {
    return ((Test-Path (Join-Path $Root "Demo\Temp\other\keep.txt")) -and (Test-Path (Join-Path $Root "Demo\Temp\keep.txt")) -and (Test-Path (Join-Path $Root "Demo\Assets\_Recovery\0.unity")))
  }
  $slot1 = Get-SlotRootFx 1; $slot2 = Get-SlotRootFx 2
  New-BackupFx $mainRoot; New-BackupFx $slot1; New-BackupFx $slot2

  $ok = Resolve-SlotSceneBackupDir $slot2 (Join-Path $slot2 "Demo") $sbCfg
  Assert-True ($ok.Path -eq (Get-BackupDirFx $slot2) -and -not $ok.Why) ("caseS1: 池内槽位 + 其 Demo -> 放行,目标恰是该槽位工程的 Temp\__Backupscenes " + $ok.Why)

  $otherBase = Join-Path $script:sbx "elsewhere"
  $refuse = @(
    @{ Name = "主仓当槽位根";            Slot = $mainRoot;                                   Proj = (Join-Path $mainRoot "Demo") },
    @{ Name = "编号 0";                  Slot = (Get-SlotRootFx 0);                          Proj = (Join-Path (Get-SlotRootFx 0) "Demo") },
    @{ Name = "编号超出 SlotCount";      Slot = (Get-SlotRootFx 9);                          Proj = (Join-Path (Get-SlotRootFx 9) "Demo") },
    @{ Name = "目录名多一截";            Slot = ($slot2 + "x");                              Proj = (Join-Path ($slot2 + "x") "Demo") },
    @{ Name = "不在槽位池目录下";        Slot = (Join-Path $otherBase "block-rougelike-dev1"); Proj = (Join-Path $otherBase "block-rougelike-dev1\Demo") },
    @{ Name = "槽位池的孙目录";          Slot = (Join-Path $pool "x\block-rougelike-dev1");    Proj = (Join-Path $pool "x\block-rougelike-dev1\Demo") },
    @{ Name = "工程根是别的槽位的";      Slot = $slot2;                                      Proj = (Join-Path $slot1 "Demo") },
    @{ Name = "工程根是子目录";          Slot = $slot2;                                      Proj = (Join-Path $slot2 "Demo\Sub") },
    @{ Name = "工程根用 .. 绕到主仓";    Slot = $slot2;                                      Proj = (Join-Path $slot2 "Demo\..\..\block-rougelike\Demo") },
    @{ Name = "工程根就是槽位根";        Slot = $slot2;                                      Proj = $slot2 }
  )
  $leaked = @($refuse | Where-Object { (Resolve-SlotSceneBackupDir $_.Slot $_.Proj $sbCfg).Path } | ForEach-Object { $_.Name })
  Assert-True ($leaked.Count -eq 0) ("caseS2: 路径校验否定面(" + $refuse.Count + " 例)全部拒绝 " + ($leaked -join " | "))
  $noCfg = Resolve-SlotSceneBackupDir $slot2 (Join-Path $slot2 "Demo") $null
  $badCfg = Resolve-SlotSceneBackupDir $slot2 (Join-Path $slot2 "Demo") @{ SlotBaseDir = $pool; RepoRoot = $mainRoot; SlotDirPrefix = ""; SlotCount = "3" }
  Assert-True (-not $noCfg.Path -and $noCfg.Why -and -not $badCfg.Path) "caseS3: 配置缺失或前缀为空 -> 拒绝且不抛"

  # 盘根布局:主仓在盘根下一级时,SlotBaseDir 留空经 Resolve-FlowRoots 推导为盘根(本机 = E:\)。校验是纯路径运算、
  # 不碰磁盘,这里取 %TEMP% 所在盘的根造路径串。旧写法单侧删尾斜杠得 'E:',与 GetDirectoryName 回的 'E:\' 恒不等、恒拒。
  $drv = [System.IO.Path]::GetPathRoot([System.IO.Path]::GetFullPath($env:TEMP))
  $rootCfg = Resolve-FlowRoots @{ SlotDirPrefix = "block-rougelike-dev"; SlotCount = "3" } (Join-Path $drv "block-rougelike\Demo\.claude\devflow\hooks")
  $rSlot = Join-Path $drv "block-rougelike-dev1"
  $rOk = Resolve-SlotSceneBackupDir $rSlot (Join-Path $rSlot "Demo") $rootCfg
  $rSlash = Resolve-SlotSceneBackupDir ($rSlot + "\") (Join-Path $rSlot "Demo\") @{ SlotBaseDir = $drv; RepoRoot = (Join-Path $drv "block-rougelike\"); SlotDirPrefix = "block-rougelike-dev"; SlotCount = "3" }
  $poolSlash = Resolve-SlotSceneBackupDir $slot2 (Join-Path $slot2 "Demo") @{ SlotBaseDir = ($pool + "\"); RepoRoot = $mainRoot; SlotDirPrefix = "block-rougelike-dev"; SlotCount = "3" }
  Assert-True ($rootCfg.SlotBaseDir -eq $drv -and $rOk.Path -eq (Join-Path $rSlot "Demo\Temp\__Backupscenes") -and -not $rOk.Why -and $rSlash.Path -eq $rOk.Path -and $poolSlash.Path -eq (Get-BackupDirFx $slot2)) ("caseS9a: 槽位池是盘根 -> 放行;槽位根 / 工程根 / 池目录带不带尾斜杠结果一致 base=" + $rootCfg.SlotBaseDir + " " + $rOk.Why + $rSlash.Why + $poolSlash.Why)
  $rRefuse = @(
    @{ Name = "盘根下的主仓";     Slot = $rootCfg.RepoRoot;                         Proj = (Join-Path $rootCfg.RepoRoot "Demo") },
    @{ Name = "盘根的孙目录";     Slot = (Join-Path $drv "x\block-rougelike-dev1");   Proj = (Join-Path $drv "x\block-rougelike-dev1\Demo") },
    @{ Name = "槽位根就是盘根";   Slot = $drv;                                      Proj = (Join-Path $drv "Demo") },
    @{ Name = "编号超出";         Slot = (Join-Path $drv "block-rougelike-dev9");     Proj = (Join-Path $drv "block-rougelike-dev9\Demo") },
    @{ Name = "工程根绕到主仓";   Slot = $rSlot;                                    Proj = (Join-Path $rSlot "..\block-rougelike\Demo") }
  )
  $rLeaked = @($rRefuse | Where-Object { (Resolve-SlotSceneBackupDir $_.Slot $_.Proj $rootCfg).Path } | ForEach-Object { $_.Name })
  Assert-True ($rLeaked.Count -eq 0) ("caseS9b: 盘根布局的否定面(" + $rRefuse.Count + " 例)全部拒绝 " + ($rLeaked -join " | "))

  $rMain = Clear-SlotSceneBackups $mainRoot (Join-Path $mainRoot "Demo") $sbCfg
  $rEsc = Clear-SlotSceneBackups $slot2 (Join-Path $slot2 "Demo\..\..\block-rougelike\Demo") $sbCfg
  Assert-True ($rMain.State -eq "refused" -and $rEsc.State -eq "refused" -and $rMain.Deleted -eq 0 -and @(Get-ChildItem (Get-BackupDirFx $mainRoot) -Recurse -File).Count -eq 3) "caseS4: 校验不过 -> refused,零删除(主仓的备份原样在)"

  $rClear = Clear-SlotSceneBackups $slot2 (Join-Path $slot2 "Demo") $sbCfg
  Assert-True ($rClear.State -eq "cleared" -and $rClear.Deleted -eq 3 -and $rClear.Failed -eq 0 -and $rClear.Dir -eq (Get-BackupDirFx $slot2) -and -not (Test-Path (Get-BackupDirFx $slot2))) ("caseS5a: 删净(含子目录里的只读文件)并删掉目录本身,回报文件数 " + $rClear.State + "/" + $rClear.Deleted + "/" + $rClear.Note)
  Assert-True ((Test-NeighborsFx $slot2) -and @(Get-ChildItem (Get-BackupDirFx $slot1) -Recurse -File).Count -eq 3 -and @(Get-ChildItem (Get-BackupDirFx $mainRoot) -Recurse -File).Count -eq 3) "caseS5b: 只动本槽位这一个目录:Temp 下旁物、Assets\_Recovery、别的槽位与主仓的备份都没动"

  $rAgain = Clear-SlotSceneBackups $slot2 (Join-Path $slot2 "Demo") $sbCfg
  $slot3 = Get-SlotRootFx 3
  [System.IO.Directory]::CreateDirectory((Join-Path $slot3 "Demo")) | Out-Null
  $rNoTemp = Clear-SlotSceneBackups $slot3 (Join-Path $slot3 "Demo") $sbCfg
  Assert-True ($rAgain.State -eq "absent" -and $rNoTemp.State -eq "absent" -and -not (Test-Path (Join-Path $slot3 "Demo\Temp"))) "caseS6: 目录不存在 -> absent,不建任何东西"

  $held = [System.IO.File]::Open((Join-Path (Get-BackupDirFx $slot1) "0.backup"), [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::None)
  try { $rPart = Clear-SlotSceneBackups $slot1 (Join-Path $slot1 "Demo") $sbCfg } finally { $held.Dispose() }
  Assert-True ($rPart.State -eq "partial" -and $rPart.Failed -eq 1 -and $rPart.Deleted -eq 2 -and $rPart.Note -and (Test-Path (Join-Path (Get-BackupDirFx $slot1) "0.backup"))) ("caseS7a: 有文件被占用 -> partial,不抛,其余照删 " + $rPart.State + "/" + $rPart.Deleted + "/" + $rPart.Failed)
  $rPart2 = Clear-SlotSceneBackups $slot1 (Join-Path $slot1 "Demo") $sbCfg
  Assert-True ($rPart2.State -eq "cleared" -and $rPart2.Deleted -eq 1 -and -not (Test-Path (Get-BackupDirFx $slot1))) "caseS7b: 占用解除后再清 -> cleared"

  # 目录联接:目标放在夹具内的另一处。整个备份目录是联接 -> 拒绝;备份目录里的子目录是联接 -> 只摘链接,目标内容不动。
  $outside = Join-Path $script:sbx "outside"
  Write-F $outside "precious.txt" "must-survive"
  $jRoot = Get-BackupDirFx $slot1
  cmd /c "mklink /J `"$jRoot`" `"$outside`"" | Out-Null
  $rJRoot = Clear-SlotSceneBackups $slot1 (Join-Path $slot1 "Demo") $sbCfg
  $jRootOk = ($rJRoot.State -eq "refused" -and (Test-Path (Join-Path $outside "precious.txt")) -and (Test-Path $jRoot))
  [System.IO.Directory]::Delete($jRoot, $false)
  Write-F $slot1 "Demo/Temp/__Backupscenes/3.backup" "scene-d"
  $jSub = Join-Path $jRoot "linked"
  cmd /c "mklink /J `"$jSub`" `"$outside`"" | Out-Null
  $jMade = Test-Path (Join-Path $jSub "precious.txt")
  $rJSub = Clear-SlotSceneBackups $slot1 (Join-Path $slot1 "Demo") $sbCfg
  Assert-True ($jRootOk -and $jMade -and $rJSub.State -eq "cleared" -and $rJSub.Deleted -eq 1 -and -not (Test-Path $jRoot) -and (Test-Path (Join-Path $outside "precious.txt"))) ("caseS8: 目录联接不跟进:整目录是联接 -> refused;子目录是联接 -> 只摘链接,指向的目录内容还在 " + $rJRoot.State + "/" + $rJSub.State + "/" + $rJSub.Deleted)

  # -- Case W0-W3 · 清理在就绪序列里的接线 --
  # W0 静态:入口脚本里恰有两处调 Invoke-UnityReadySequence,常规领取那处(RollbackOnFail 真)带 -ClearSceneBackups $true,
  # -StartUnity 那处(RollbackOnFail 假)不带。两处传反了的后果是 -StartUnity 删掉进行中工作的场景备份。
  $ast = [System.Management.Automation.Language.Parser]::ParseFile($acquireScript, [ref]$null, [ref]$null)
  $calls = @($ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.CommandAst] -and $n.GetCommandName() -eq 'Invoke-UnityReadySequence' }, $true) | ForEach-Object { $_.Extent.Text })
  $claimCalls = @($calls | Where-Object { $_ -match '\$true\s+-ClearSceneBackups\s+\$true\s*$' })
  $startCalls = @($calls | Where-Object { $_ -match '\$false\s*$' -and $_ -notmatch 'ClearSceneBackups' })
  Assert-True ($calls.Count -eq 2 -and $claimCalls.Count -eq 1 -and $startCalls.Count -eq 1) ("caseW0: 两处调用点:常规领取带 -ClearSceneBackups `$true,-StartUnity 不带(共 " + $calls.Count + " 处)")
  # W0b 静态:免启领取的清理恰有一处调用,且在「免启且 csproj 不过期」那个分支里(挪到别处 = 常规领取或 -StartUnity 多清一次);
  # 删除只有一个出口:Clear-SlotSceneBackups 只被 Invoke-ClaimSceneBackupClear 调一次,后者只被就绪序列与免启收尾各调一次。
  function Get-CallAsts([string]$Name) { return @($ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.CommandAst] -and $n.GetCommandName() -eq $Name }.GetNewClosure(), $true)) }
  $noUnityCalls = Get-CallAsts 'Invoke-NoUnityClaimSceneBackupClear'
  $inNoUnityBranch = $false
  if ($noUnityCalls.Count -eq 1) {
    for ($up = $noUnityCalls[0].Parent; $up; $up = $up.Parent) {
      if ($up -is [System.Management.Automation.Language.IfStatementAst] -and $up.Clauses[0].Item1.Extent.Text -match '^\$NoUnity -and -not \$regen\.Stale$') { $inNoUnityBranch = $true; break }
    }
  }
  Assert-True ($noUnityCalls.Count -eq 1 -and $inNoUnityBranch -and (Get-CallAsts 'Invoke-ClaimSceneBackupClear').Count -eq 2 -and (Get-CallAsts 'Clear-SlotSceneBackups').Count -eq 1) ("caseW0b: 免启领取的清理只在免启分支里调一处;删除只有一个出口(免启处 " + $noUnityCalls.Count + " / 共用入口 " + (Get-CallAsts 'Invoke-ClaimSceneBackupClear').Count + " / 删除函数 " + (Get-CallAsts 'Clear-SlotSceneBackups').Count + ")")
  # W0c 静态:领取路径上 entry-verdict 遥测的分段与 claim 接线次序(这条路径要真内核与真槽位池,不进动态矩阵):
  # kernel 段紧贴内核调用 -> 拒绝分支经 Set-KernelRefusalTelemetry 取关联字段 -> 解析 ACQUIRED 后、就绪序列前取 claim
  # (就绪失败会回滚占位,之后取不到)-> csproj 段紧贴判定、判定后经 Write-CsprojRegenNotice 出结果 -> unity_ready 段紧贴常规领取的就绪序列。
  $acqSrc = [System.IO.File]::ReadAllText($acquireScript)
  $wireSeq = @(
    ([regex]::Escape('Enter-Phase $script:TelCtx.Clock "kernel"') + '\s+' + [regex]::Escape('$ir = Invoke-FlowChild (Join-Path $PSScriptRoot "槽位领取内核.ps1") $kernelArgs')),
    [regex]::Escape('Set-KernelRefusalTelemetry $script:TelCtx $headline[0] $inner'),
    [regex]::Escape("`$m = [regex]::Match(`$headline[0], '^ACQUIRED"),
    [regex]::Escape('$script:TelCtx.Claim = Get-ClaimSha $slotRoot $cfg.ClientBaseline'),
    ([regex]::Escape('Enter-Phase $script:TelCtx.Clock "csproj"') + '\s+' + [regex]::Escape('$regen = Get-CsprojRegenNeed $projectDir')),
    [regex]::Escape('Write-CsprojRegenNotice $regen ([bool]$NoUnity)'),
    ([regex]::Escape('Enter-Phase $script:TelCtx.Clock "unity_ready"') + '\s+' + [regex]::Escape('$r = Invoke-UnityReadySequence $slotN ') + '.*-ClearSceneBackups \$true'))
  $wireAt = 0; $wireMiss = @()
  foreach ($p in $wireSeq) {
    $mm = ([regex]$p).Match($acqSrc, $wireAt)
    if ($mm.Success) { $wireAt = $mm.Index + $mm.Length } else { $wireMiss += $p; break }
  }
  Assert-True ($wireMiss.Count -eq 0) ("caseW0c: 领取路径的分段 / claim / 拒绝关联字段按序接线,未按序找到:" + ($wireMiss -join " | "))

  # K1-K3 · 内核非零出口的遥测关联字段(Set-KernelRefusalTelemetry;喂抬头与明细行,不起内核)。
  # 承重点是 FULL:它的抬头逐个列被占槽位,按「抬头里第一个 devN」取会把 FULL 记成 slot=1。
  $kq = @{ Slot = ""; Files = @() }
  Set-KernelRefusalTelemetry $kq "QUEUE dev2 某进行中主题" @("QUEUE dev2 某进行中主题", "INFO overlap: 前缀 Demo/Assets/A <-> Demo/Assets/A/X.cs", "INFO overlap: 前缀 Demo/Assets/A <-> Demo/Assets/A/Y.cs", "INFO 处置:排 dev2 队尾")
  Assert-True ($kq.Slot -eq "2" -and @($kq.Files).Count -eq 2 -and $kq.Files[0] -eq "Demo/Assets/A/X.cs" -and $kq.Files[1] -eq "Demo/Assets/A/Y.cs") ("caseK1: QUEUE 记挡路的槽号与 overlap 点名的文件 slot=" + $kq.Slot + " files=" + (@($kq.Files) -join ","))
  $kf = @{ Slot = ""; Files = @() }
  Set-KernelRefusalTelemetry $kf "FULL dev1 c+1/d0 f+0/d0; dev2 c+2/d1 f+0/d0" @("FULL dev1 c+1/d0 f+0/d0; dev2 c+2/d1 f+0/d0", "INFO 固定槽位池共 3 个;等待占用任务交付或处置异常残留,不扩容")
  $kf3 = @{ Slot = "3"; Files = @() }
  Set-KernelRefusalTelemetry $kf3 "FULL dev1 c+1/d0 f+0/d0" @("FULL dev1 c+1/d0 f+0/d0")
  Assert-True ($kf.Slot -eq "" -and @($kf.Files).Count -eq 0 -and $kf3.Slot -eq "3") ("caseK2: FULL 不取抬头里的被占槽号(没给 -Slot 留空,给了保留)slot=" + $kf.Slot + "/" + $kf3.Slot)
  $kd = @{ Slot = ""; Files = @() }
  Set-KernelRefusalTelemetry $kd "ABORT duplicate-claim dev3 已持有同主题占位「claim: x」,同一任务不领第二个槽位" @()
  $kp = @{ Slot = ""; Files = @() }
  Set-KernelRefusalTelemetry $kp "ABORT pinned slot occupied: E:\block-rougelike-dev2 client ahead=1 dirty=0 fantasy ahead=0 dirty=0" @()
  Assert-True ($kd.Slot -eq "3" -and $kp.Slot -eq "") ("caseK3: duplicate-claim 记已持有占位的槽;其余 ABORT 不从路径里抠槽号 slot=" + $kd.Slot + "/" + $kp.Slot)

  $wfx = Join-Path $script:sbx "wire"
  $fakeVer = "0.0.0flowtest"
  $fakePf = Join-Path $wfx "pf"
  $fakeUnity = Join-Path $fakePf ("Unity\Hub\Editor\" + $fakeVer + "\Editor\Unity.exe")
  # 假编辑器是个空文件:Resolve-UnityEditor 只看它存在,轮到启动时 Start-Process 必然失败,子进程据此打一行
  # START-ATTEMPTED 退出。这样「走没走到启动」「清理在启动之前还是之后」都看得出,又不真的执行任何东西。
  # 不要改成现编一个 exe 再启动:本机安全软件拦过(先拒绝执行,再把整棵测试进程树结束掉)。
  [System.IO.Directory]::CreateDirectory((Split-Path $fakeUnity -Parent)) | Out-Null
  [System.IO.File]::WriteAllBytes($fakeUnity, (New-Object byte[] 0))
  $wPool = Join-Path $wfx "pool"
  $childPs1 = Join-Path $wfx "ready-child.ps1"
  $childText = @'
param([string]$Acquire, [string]$Fx, [string]$Pool, [string]$SlotRoot, [string]$Clear, [string]$Mode = "ready")
$env:LOCALAPPDATA = Join-Path $Fx "AppData"
[System.IO.Directory]::CreateDirectory($env:LOCALAPPDATA) | Out-Null
$env:ProgramFiles = Join-Path $Fx "pf"
$env:SLOT_ACQUIRE_NOEXEC = "1"
. $Acquire -Topic "ready-child"
$script:FlowCfg = @{ SlotBaseDir = $Pool; RepoRoot = (Join-Path $Pool "block-rougelike"); SlotDirPrefix = "block-rougelike-dev"; SlotCount = "3"; BoardRelPath = "claude-wf-3b\board.json" }
if ($Mode -like "csproj-*") {
  $regen = @{ Stale = $false; Lines = @(); Undetermined = "" }
  if ($Mode -eq "csproj-undet") { $regen.Undetermined = "csproj 不存在:Fx.csproj" }
  if ($Mode -eq "csproj-stale-nounity") { $regen.Stale = $true; $regen.Lines = @("STALE-REFS Fx -> NewMod") }
  Write-CsprojRegenNotice $regen ($Mode -eq "csproj-stale-nounity")
  Write-Host "CSPROJ-DONE"
  exit 0
}
if ($Mode -eq "nounity") {
  Invoke-NoUnityClaimSceneBackupClear "1" $SlotRoot (Join-Path $SlotRoot "Demo")
  Write-Host "NOUNITY-DONE"
  exit 0
}
try {
  [void](Invoke-UnityReadySequence "1" $SlotRoot (Join-Path $SlotRoot "Demo") 2 $false 20 ($Clear -eq "yes"))
} catch {
  Write-Host ("START-ATTEMPTED " + $_.Exception.Message)
  exit 9
}
'@
  [System.IO.File]::WriteAllText($childPs1, $childText, (New-Object System.Text.UTF8Encoding($true)))
  function New-WireSlot([string]$Name) {
    $root = Join-Path $wPool $Name
    Write-F $root "Demo/ProjectSettings/ProjectVersion.txt" ("m_EditorVersion: " + $fakeVer + "`n")
    Write-F $root "Demo/Temp/__Backupscenes/0.backup" "scene-a"
    Write-F $root "Demo/Temp/__Backupscenes/1.backup" "scene-b"
    return $root
  }
  function Invoke-ReadyChild([string]$SlotRoot, [string]$Clear, [string]$Mode = "ready") {
    $cr = Invoke-FlowChild $childPs1 @("-Acquire", $acquireScript, "-Fx", $wfx, "-Pool", $wPool, "-SlotRoot", $SlotRoot, "-Clear", $Clear, "-Mode", $Mode)
    return @{ code = $cr.code; out = ($cr.lines -join "`n") }
  }
  # 输出里某个模式首次出现的位置(没有回 -1):用来断言「清理那行在 START-ATTEMPTED 之前」。
  function Get-OutPos([string]$Text, [string]$Pattern) { $m = [regex]::Match($Text, $Pattern); if ($m.Success) { return $m.Index }; return -1 }

  $w1 = New-WireSlot "block-rougelike-dev1"
  $r1 = Invoke-ReadyChild $w1 "yes"
  $c1 = Get-OutPos $r1.out 'INFO scene-backups-cleared \| slot=1 \| dir=.+__Backupscenes \| files=2'
  $s1 = Get-OutPos $r1.out 'START-ATTEMPTED '
  Assert-True ($r1.code -eq 9 -and $c1 -ge 0 -and $s1 -gt $c1 -and -not (Test-Path (Get-BackupDirFx $w1))) ("caseW1: 要清 + 没有编辑器在跑 -> 先清(打一行 INFO 带槽位 / 目录 / 文件数),后才走到启动 code=" + $r1.code + " cleared@" + $c1 + " start@" + $s1)

  $w2 = New-WireSlot "block-rougelike-dev2"
  $lockPath = Join-Path $w2 "Demo\Temp\UnityLockfile"
  [System.IO.File]::WriteAllText($lockPath, "")
  $lockHeld = [System.IO.File]::Open($lockPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
  try { $r2 = Invoke-ReadyChild $w2 "yes" } finally { $lockHeld.Dispose() }
  Assert-True ($r2.code -eq 3 -and $r2.out -match 'VERDICT: BLOCKED-UNITYMCP ' -and $r2.out -notmatch 'scene-backups' -and $r2.out -notmatch 'START-ATTEMPTED' -and @(Get-ChildItem (Get-BackupDirFx $w2) -File).Count -eq 2) ("caseW2: 要清 + 已有编辑器在跑(锁文件被占)-> 不启动、不清,备份原样在,照常等就绪 code=" + $r2.code)

  $w3 = New-WireSlot "block-rougelike-dev3"
  $r3 = Invoke-ReadyChild $w3 "no"
  Assert-True ($r3.code -eq 9 -and $r3.out -match 'START-ATTEMPTED ' -and $r3.out -notmatch 'scene-backups' -and @(Get-ChildItem (Get-BackupDirFx $w3) -File).Count -eq 2) ("caseW3: 不清(-StartUnity 的传法)+ 没有编辑器在跑 -> 直接走到启动,备份原样在 code=" + $r3.code)

  # W4 复用 dev3 的槽位(W3 没动它的备份):占住其中一个文件再要求清。
  $busy = [System.IO.File]::Open((Join-Path (Get-BackupDirFx $w3) "0.backup"), [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::None)
  try { $r4 = Invoke-ReadyChild $w3 "yes" } finally { $busy.Dispose() }
  $p4 = Get-OutPos $r4.out 'WARN scene-backups-partial \| slot=1 \| dir=.+ \| deleted=1 \| failed=1 \| '
  Assert-True ($r4.code -eq 9 -and $p4 -ge 0 -and (Get-OutPos $r4.out 'START-ATTEMPTED ') -gt $p4) ("caseW4: 清不干净(文件被占)-> 打 WARN 点名删了几个 / 没删掉几个,仍走到启动,不因此停下 code=" + $r4.code)

  $stray = Join-Path $wfx "elsewhere\block-rougelike-dev1"
  Write-F $stray "Demo/ProjectSettings/ProjectVersion.txt" ("m_EditorVersion: " + $fakeVer + "`n")
  Write-F $stray "Demo/Temp/__Backupscenes/0.backup" "scene-a"
  $r5 = Invoke-ReadyChild $stray "yes"
  $p5 = Get-OutPos $r5.out 'WARN scene-backups-skipped \| slot=1 \| refused:'
  Assert-True ($r5.code -eq 9 -and $p5 -ge 0 -and (Get-OutPos $r5.out 'START-ATTEMPTED ') -gt $p5 -and $r5.out -notmatch 'scene-backups-cleared' -and (Test-Path (Join-Path $stray "Demo\Temp\__Backupscenes\0.backup"))) ("caseW5: 槽位根不在槽位池目录下 -> 拒绝并打 WARN,零删除,仍走到启动 code=" + $r5.code)

  # W6 / W7 · 免启领取的收尾清理(子进程直接调 Invoke-NoUnityClaimSceneBackupClear;这条路径不启动编辑器)。
  # 复用 dev2 的槽位:W2 没动它的备份,锁文件还在但已放开(= 编辑器不在跑)。
  $r6 = Invoke-ReadyChild $w2 "yes" "nounity"
  Assert-True ($r6.code -eq 0 -and $r6.out -match 'INFO scene-backups-cleared \| slot=1 \| dir=.+__Backupscenes \| files=2' -and $r6.out -match 'NOUNITY-DONE' -and $r6.out -notmatch 'START-ATTEMPTED' -and -not (Test-Path (Get-BackupDirFx $w2))) ("caseW6: 免启领取 + 没有编辑器在跑 -> 清掉并打一行 INFO,不启动任何东西 code=" + $r6.code)

  Write-F $w2 "Demo/Temp/__Backupscenes/0.backup" "scene-a"
  Write-F $w2 "Demo/Temp/__Backupscenes/1.backup" "scene-b"
  $lockHeld = [System.IO.File]::Open($lockPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
  try { $r7 = Invoke-ReadyChild $w2 "yes" "nounity" } finally { $lockHeld.Dispose() }
  Assert-True ($r7.code -eq 0 -and $r7.out -match 'NOUNITY-DONE' -and $r7.out -notmatch 'scene-backups' -and @(Get-ChildItem (Get-BackupDirFx $w2) -File).Count -eq 2) ("caseW7: 免启领取 + 已有编辑器在跑(锁文件被占)-> 不清,备份原样在 code=" + $r7.code)

  # CS1-CS3 · csproj 判定结果的输出与护栏遥测(同一子进程夹具,喂合成的判定结果,不跑 重建csproj):
  # 没判成 -> WARN + degraded(guard=csproj-regen);判成了(不过期 / 过期)-> guard-ok,过期另打 WARN 点名过期项。
  $rcU = Invoke-ReadyChild $wfx "no" "csproj-undet"
  $rcF = Invoke-ReadyChild $wfx "no" "csproj-fresh"
  $rcS = Invoke-ReadyChild $wfx "no" "csproj-stale-nounity"

  # W8 · 遥测(子进程的隔离 LOCALAPPDATA = <wfx>\AppData):W4 / W5 两种降级 WARN 同时记 event=degraded(来源 = 槽位领取,
  # guard = scene-backups,检查命中面板据此判「疑似恒降级」);W2 的就绪超时出口照常写一行 entry-verdict。
  $wTel = @(Get-ChildItem (Join-Path $wfx "AppData\claude-wf-3b\telemetry") -Filter "wf-*.jsonl" -EA SilentlyContinue |
            ForEach-Object { [System.IO.File]::ReadAllLines($_.FullName) } | Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json })
  $wSkip = @($wTel | Where-Object { $_.event -eq "degraded" -and $_.key -eq "scene-backups-skipped" })
  $wPart = @($wTel | Where-Object { $_.event -eq "degraded" -and $_.key -eq "scene-backups-partial" })
  Assert-True ($wSkip.Count -eq 1 -and $wSkip[0].src -eq "槽位领取" -and $wSkip[0].detail -match '^slot=1 \| refused:' -and $wPart.Count -eq 1 -and $wPart[0].src -eq "槽位领取") ("caseW8: 场景备份没清成的两种 WARN 各记一行 degraded(来源 槽位领取)skipped=" + $wSkip.Count + " partial=" + $wPart.Count + $(if ($wSkip.Count) { " src=" + $wSkip[0].src } else { "" }))
  $wEv = @($wTel | Where-Object { $_.event -eq "entry-verdict" -and $_.verdict -eq "BLOCKED-UNITYMCP" })
  Assert-True ($wEv.Count -eq 1 -and $wEv[0].entry -eq "槽位领取" -and $wEv[0].next -eq "halt" -and $wEv[0].exit -eq 3 -and $wEv[0].detail -match '^slot=1 \| project=') ("caseW8b: 就绪超时出口写 entry-verdict(next=halt / exit=3 / detail)实得 " + $wEv.Count)
  # W8c · 场景备份护栏的走到次数:清理真跑了的 4 次(W1 / W6 清成 -> guard-ok;W4 / W5 降级 -> degraded 带 guard),
  # 没走到的 3 次(W2 / W7 编辑器在跑、W3 不清)两样都不写。分母因此只含走到的那几次。
  $wSbOk = @($wTel | Where-Object { $_.event -eq "guard-ok" -and $_.guard -eq "scene-backups" })
  Assert-True ($wSbOk.Count -eq 2 -and @($wSbOk | Where-Object { $_.src -eq "槽位领取" }).Count -eq 2 -and $wSkip.Count -eq 1 -and $wSkip[0].guard -eq "scene-backups" -and $wPart.Count -eq 1 -and $wPart[0].guard -eq "scene-backups") ("caseW8c: 清成记 guard-ok、降级带 guard=scene-backups,没走到的不记(guard-ok " + $wSbOk.Count + " 行)")

  $csDeg = @($wTel | Where-Object { $_.event -eq "degraded" -and $_.key -eq "csproj-regen-undetermined" })
  $csOk = @($wTel | Where-Object { $_.event -eq "guard-ok" -and $_.guard -eq "csproj-regen" })
  Assert-True ($rcU.code -eq 0 -and $rcU.out -match 'WARN csproj 是否须编辑器重生成没判成\(csproj 不存在:Fx\.csproj\):按未过期处理、领取照常' -and $csDeg.Count -eq 1 -and $csDeg[0].guard -eq "csproj-regen" -and $csDeg[0].src -eq "槽位领取" -and $csDeg[0].detail -eq "csproj 不存在:Fx.csproj") ("caseCS1: 判定没判成 -> WARN 原文案 + degraded(key csproj-regen-undetermined / guard csproj-regen)实得 " + $csDeg.Count)
  Assert-True ($rcF.code -eq 0 -and $rcF.out -match 'CSPROJ-DONE' -and $rcF.out -notmatch 'WARN' -and $rcS.out -match 'WARN STALE-REFS Fx -> NewMod' -and $rcS.out -match 'WARN csproj 须编辑器重生成\(引用集 / 宏过期\),-NoUnity 不生效' -and $csOk.Count -eq 2 -and $csDeg.Count -eq 1) ("caseCS2: 判成了(不过期不出声 / 过期打 WARN 并注明 -NoUnity 不生效)各记一行 guard-ok,不记 degraded(guard-ok " + $csOk.Count + " 行)")

  # -- Case 4-7 · csproj 须重生成判定(假 Unity 工程:GameLogic 引 GameConfig,csproj 已引)--
  # 判定起点是 predefined 的 Assembly-CSharp-Editor(无 asmdef),夹具须有它的 csproj 并引到 GameLogic,
  # 否则判定回 INFRA、全程没跑成;「不过期」用例一并断言 Undetermined 为空,免得因没判成而照过。
  $script:fx = Join-Path $env:TEMP ("flowtest-acqrefs-" + [Guid]::NewGuid().ToString("N"))
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  function Write-Proj([string]$Rel, [string]$Text) {
    $p = Join-Path $script:fx $Rel
    [System.IO.Directory]::CreateDirectory((Split-Path $p -Parent)) | Out-Null
    [System.IO.File]::WriteAllText($p, $Text, $utf8)
  }
  Write-Proj "Assets\GameLogic\GameLogic.asmdef" '{ "name": "GameLogic", "references": [ "GameConfig" ] }'
  Write-Proj "Assets\GameLogic\L.cs" "class L {}"
  Write-Proj "Assets\GameConfig\GameConfig.asmdef" '{ "name": "GameConfig" }'
  Write-Proj "Assets\GameConfig\C.cs" "class C {}"
  Write-Proj "GameLogic.csproj" "<Project><ItemGroup><Compile Include=`"Assets\GameLogic\L.cs`" /></ItemGroup><ItemGroup><ProjectReference Include=`"GameConfig.csproj`" /></ItemGroup></Project>"
  Write-Proj "GameConfig.csproj" "<Project><ItemGroup><Compile Include=`"Assets\GameConfig\C.cs`" /></ItemGroup></Project>"
  Write-Proj "Assets\Editor\Ed.cs" "class Ed {}"
  Write-Proj "Assembly-CSharp-Editor.csproj" "<Project><ItemGroup><Compile Include=`"Assets\Editor\Ed.cs`" /></ItemGroup><ItemGroup><ProjectReference Include=`"GameLogic.csproj`" /></ItemGroup></Project>"
  $fresh = Get-CsprojRegenNeed $script:fx
  Assert-True (-not $fresh.Stale -and -not $fresh.Undetermined) ("case4: 引用齐全 -> 判定跑成且不过期 " + $fresh.Undetermined)

  Write-Proj "Assets\NewMod\NewMod.asmdef" '{ "name": "NewMod" }'
  Write-Proj "Assets\GameLogic\GameLogic.asmdef" '{ "name": "GameLogic", "references": [ "GameConfig", "NewMod" ] }'
  $stale = Get-CsprojRegenNeed $script:fx
  Assert-True ($stale.Stale -and (@($stale.Lines) -join "`n") -match 'NewMod') "case5: 基线新增 asmdef 未进 csproj -> 过期并点名"

  Write-Proj "Assets\GameLogic\GameLogic.asmdef" '{ "name": "GameLogic", "references": [ "GameConfig" ] }'
  Write-Proj "ProjectSettings\ProjectSettings.asset" "PlayerSettings:`r`n  scriptingDefineSymbols:`r`n    Standalone: FOO;BAR`r`n  additionalCompilerArguments: {}`r`n"
  Write-Proj "GameLogic.csproj" "<Project><PropertyGroup><DefineConstants>UNITY_EDITOR;UNITY_STANDALONE;FOO</DefineConstants></PropertyGroup><ItemGroup><Compile Include=`"Assets\GameLogic\L.cs`" /></ItemGroup><ItemGroup><ProjectReference Include=`"GameConfig.csproj`" /></ItemGroup></Project>"
  $defStale = Get-CsprojRegenNeed $script:fx
  Assert-True ($defStale.Stale -and (@($defStale.Lines) -join "`n") -match 'STALE-DEFINES.*BAR') "case6: 全局宏过期 -> 过期并点名"

  [System.IO.File]::Delete((Join-Path $script:fx "GameLogic.csproj"))
  $noProj = Get-CsprojRegenNeed $script:fx
  Assert-True (-not $noProj.Stale -and $noProj.Undetermined -match 'csproj 不存在.*GameLogic\.csproj') ("case7: 判定跑不成(无 csproj)-> 按未过期、不拦领取,原因点名缺的 csproj " + $noProj.Undetermined)
} finally {
  $env:SLOT_ACQUIRE_NOEXEC = $old
  if ($script:fx -and (Test-Path -LiteralPath $script:fx)) { [System.IO.Directory]::Delete($script:fx, $true) }
  if ($script:sbx -and (Test-Path -LiteralPath $script:sbx)) {
    # 先摘掉可能残留的目录联接(用例中途失败时),再整树删:联接指向夹具内的 outside,摘链接不动其内容。
    foreach ($j in @(Get-ChildItem -LiteralPath $script:sbx -Recurse -Directory -Force -ErrorAction SilentlyContinue | Where-Object { ($_.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0 })) {
      try { [System.IO.Directory]::Delete($j.FullName, $false) } catch {}
    }
    Remove-FixtureTree $script:sbx
  }
}

Exit-TestSuite
