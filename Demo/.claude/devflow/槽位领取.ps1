# 槽位领取.ps1 - Agent-facing slot acquisition entry point.
# The caller supplies task intent and optional footprint prefixes. This script owns the
# complete slot preparation sequence: fixed-pool claim, baseline alignment, Unity launch,
# and UnityMCP registration verification. The final line is the complete caller contract;
# on success, kernel WARN lines (non-blocking, e.g. Tools\Luban junction repair failed) are
# echoed above it.
# 会话侧(经 powershell.exe -File 命令行)传路径清单一律用 -PathsFile/-FantasyPathsFile(每行一条,
# UTF-8):外层 PowerShell 把数组传给原生进程时在 argv 层展平,-File 侧多余 token 会按位置
# 错绑到后续参数(数组结构不可恢复);-Paths/-FantasyPaths 数组形态仅限 PowerShell 进程内调用。
# PositionalBinding=$false 使溢出 token 就地报「不接受位置参数」,不静默错绑。
# 主题同样有文件形态 -TopicFile(与 -Topic 互斥,二选一):主题含中文与英文引号,拼进命令行
# 字符串的调用方(如 Unity 看板窗口 DevFlowDashboardWindow)一个引号就能破坏引号结构
# (shell-conventions「文本走文件」);会话内联调用继续用 -Topic。
# 三个附加模式:-NoUnity = 免启领取,跳过 Unity 启动与就绪等待(verdict 的 mcp_instance=none、
# unity_port=0,其余领取序列不变),并把候选槽序反过来扫 N..1(常规任务正序扫 1..N;两侧都覆盖
# 全池,可选键 NormalSlotMax 配上时才给常规侧设上界);基线对齐后槽位 csproj 的引用集或宏过期(判定
# 正本 = 重建csproj.ps1 STALE-REGEN)时 -NoUnity 不生效、照常启动编辑器,verdict 与常规领取同形,并在其
# 上方打 WARN 点名过期项与重生成做法——常规领取判中同样打这组 WARN;该判定没跑成(槽位缺 csproj 等)时按
# 未过期处理、不拦领取也不改 -NoUnity,只打一行 WARN 带原因;-StartUnity -Slot <N> = 免启领取后
# 中途转需客户端实现时的补就绪模式,只对已领取槽位执行启动+就绪确认,零 git 动作、不打
# 不动 claim,成功回 UNITY-READY,失败沿用 BLOCKED-UNITY/BLOCKED-UNITYMCP(不回滚,无新
# claim 可回滚);与领取参数(-Topic/-BriefFile/清单)互斥;-Abandon -Slot <N> = 显式放弃槽位,
# 双仓 reset --hard 基线、清看板行,丢弃该槽全部领先提交与 tracked 改动,成功回 ABANDONED(不可逆,
# 只在用户授权放弃该槽后调用),与领取参数及 -StartUnity 互斥。判据与处置正本 = devflow 卡
# 第二步「领取槽位」与「停机呈报」。
# 等就绪期间另探一件事:槽位编辑器是否停在启动期模态对话框上(清单 = Get-UnityStartupDialogCatalog,
# 按主窗口标题精确匹配)。命中即把该窗口置顶(不激活、不抢键盘焦点)并打一行 INFO;连续命中满
# $DialogGraceSeconds 仍在就不再等满就绪窗口,回 BLOCKED-UNITY-DIALOG(带 pid、对话框标题、需要谁做什么),
# 其余语义同 BLOCKED-UNITYMCP(领取路径回滚占位,-StartUnity 路径 no_claim_change,next=halt)。
# 脚本对该窗口只做置顶:不点按钮、不发按键、不杀进程、不删 Temp\__Backupscenes;探测自身出错按没探到处理,
# 回落到原来的 BLOCKED-UNITYMCP。清单外的窗口(导入进度窗等)不判,同样回落。
# 场景备份:领取(常规或免启)把槽位 reset 到基线后,清掉本槽位工程的 Temp\__Backupscenes(上次编辑器异常退出
# 留下的,留着新进程会停在「Recovering Scene Backups」上;槽位刚 reset,这份备份没有保留价值),清了打一行
# INFO scene-backups-cleared(槽位、目录、文件数)。常规领取在新启编辑器之前清,免启领取在收尾前清(之后
# -StartUnity 补就绪时就不会被它卡住)。不清的情形:该槽位已有编辑器在跑(Temp 归那个进程,两种领取同一判法);
# -StartUnity(槽位里是进行中的工作,备份里可能有没存盘的场景改动,留不留是使用者的事);-Abandon。
# 只删这一个目录,路径先过 Resolve-SlotSceneBackupDir 校验;清不掉只打 WARN、领取照常,由上面的对话框判别兜底。
# 开工前读:领取时给了改动范围前缀(-PathsFile / -FantasyPathsFile,或进程内的 -Paths / -FantasyPaths)的,成功出口在
# ACQUIRED 之上按 校验库 的按需篇判据表(RuleReadTable,与 自审触发判定 的 RULES 行共用一份)逐篇打一行
# 「开工前读:<篇> <- <命中前缀>」,一篇没中打一行「开工前读:无(...)」;没给前缀不打。只读,不改 VERDICT 与出口码;
# 前缀怎么判见 Get-PreworkRuleLines。会话处置 = 开工前先 Read 点名的篇(devflow 卡第二步「返回处置」)。
# 遥测(副作用仅追加仓外 telemetry\wf-YYYYMM.jsonl):每个 VERDICT 出口写一行 event=entry-verdict(字段见 $script:TelCtx 处);
# 场景备份没清成、csproj 判定没判成、开工前读没判成这三类 WARN 是护栏降级,另记 event=degraded(guard = scene-backups /
# csproj-regen / rules-prework);这几步走到且没降级时记 event=guard-ok,检查命中面板据此按「走到该步骤的次数」算降级占比。
# VERDICT 文本与出口码不受影响。
[CmdletBinding(PositionalBinding = $false)]
param(
  [string]$Topic = "",
  [string]$TopicFile = "",
  [string[]]$Paths = @(),
  [string[]]$FantasyPaths = @(),
  [string]$PathsFile = "",
  [string]$FantasyPathsFile = "",
  [string]$BriefFile = "",
  [string]$Slot = "",
  [int]$ReadyTimeoutSeconds = 0,
  [switch]$NoUnity,
  [switch]$StartUnity,
  [switch]$Abandon
)
$ErrorActionPreference = "Stop"
# 配置一律经 Get-FlowConfig 取(不裸读 psd1):路径类键留空时由该入口推导补齐。
# 载 校验库(它自带 dot-source hook函数库):「开工前读」的按需篇判据表在那里,与 自审触发判定 共用一份。
. (Join-Path $PSScriptRoot "hooks\校验库.ps1")

# 遥测:每个 VERDICT 出口写一行 event=entry-verdict(entry=槽位领取;字段与构造 = hook函数库 Write-EntryVerdictTelemetry),
# 停机、拒绝、就绪失败都看得到。phases 分段:brief(简报校验)/ kernel(领用内核)/ csproj(重生成判定)/
# unity_ready(启动与就绪等待),没走到的段不写;slot / topic / claim 随流程推进逐步填上,files = 排队时内核点名的重叠文件。
# 只记不改:VERDICT 文本与出口码不因遥测变化,写不进也不影响结论。
$script:TelCtx = @{ Clock = (New-PhaseClock); Slot = $Slot; Topic = ""; Claim = ""; Files = @() }

function Write-Verdict([string]$Line, [int]$Code) {
  Write-Host ("VERDICT: " + (Format-VerdictLine $Line))
  Write-EntryVerdictTelemetry "槽位领取" $Line $Code $script:TelCtx
  exit $Code
}

# 读路径清单文件(每行一条路径,UTF-8,空行忽略)。文件参数为空返回空数组;给了路径但文件
# 不存在按 DENIED 拒绝(调用方契约错误,非基础设施故障)。
function Read-PathListFile([string]$File, [string]$ParamName) {
  if (-not $File) { return @() }
  if (-not (Test-Path -LiteralPath $File)) {
    Write-Verdict ("DENIED | " + $ParamName + " not found: " + $File) 1
  }
  return @([System.IO.File]::ReadAllLines($File) | ForEach-Object { $_.Trim() } | Where-Object { $_ })
}

# 领取失败时把内核捕获的诊断明细透传给用户($inner 里的 INFO overlap/处置/ahead/broken 等行,
# 不回显则用户只见 QUEUE/FULL/ABORT 抬头、不知具体卡在哪)。跳过抬头行(它已进 VERDICT)。
function Show-Inner([string[]]$Lines, [string]$Headline) {
  foreach ($l in $Lines) {
    $s = [string]$l
    if ($Headline -and $s -eq $Headline) { continue }
    Write-Host $s
  }
}

function Get-ProjectHash([string]$ProjectDir) {
  $dataPath = ([System.IO.Path]::GetFullPath((Join-Path $ProjectDir "Assets"))) -replace '\\', '/'
  $sha = [System.Security.Cryptography.SHA1]::Create()
  try {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($dataPath)
    $hash = $sha.ComputeHash($bytes)
    return (($hash | ForEach-Object { $_.ToString("x2") }) -join "").Substring(0, 16)
  } finally {
    $sha.Dispose()
  }
}

# 枚举命令行指向该工程的 Unity.exe 进程,回 @{ Pid; IsWorker } 列表。IsWorker = 编辑器派生的
# AssetImportWorker 子进程(无窗口)。命令行只在本函数内用于匹配,不外传、不打印(启动参数里可能带访问令牌)。
function Get-UnityProjectProcesses([string]$ProjectDir) {
  $needle = [System.IO.Path]::GetFullPath($ProjectDir).TrimEnd('\')
  $found = @()
  foreach ($proc in @(Get-CimInstance Win32_Process -Filter "Name='Unity.exe'" -ErrorAction SilentlyContinue)) {
    $line = [string]$proc.CommandLine
    if ($line -and $line.IndexOf($needle, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
      $found += @{ Pid = [int]$proc.ProcessId; IsWorker = ($line.IndexOf("AssetImportWorker", [System.StringComparison]::OrdinalIgnoreCase) -ge 0) }
    }
  }
  return $found
}

function Test-UnityEditorRunning([string]$ProjectDir) {
  $lockFile = Join-Path $ProjectDir "Temp\UnityLockfile"
  if (Test-Path $lockFile) {
    try {
      $stream = [System.IO.File]::Open($lockFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
      $stream.Dispose()
    } catch [System.IO.IOException] {
      return $true
    } catch [System.UnauthorizedAccessException] {
      return $true
    }
  }
  return (@(Get-UnityProjectProcesses $ProjectDir).Count -gt 0)
}

# 已知的编辑器启动期模态对话框(弹出时编辑器不导入、不向桥注册,等人点)。按主窗口标题精确匹配:
# 实测这时 Get-Process 的 MainWindowTitle 就是对话框标题,正常编辑器的是「…<工程> - <场景> - <平台> - Unity …」。
# 只收标题固定、确知要人处置的窗口;导入进度窗之类标题没实测过的不收(漏判只是回落到 BLOCKED-UNITYMCP,
# 误判却会把正在导入的编辑器报成要人处置)。Seen = 本机实发过;没实发的标题取自 Unity.dll 里的窗口文案。
# Need 进 VERDICT 的 need= 字段,写给人看:谁、在哪个窗口上、决定什么。
function Get-UnityStartupDialogCatalog {
  return @(
    @{ Title = "Unity is running as administrator."; Seen = $true
       Need = "用户本人在该窗口的两个按钮里选一个(脚本不代点、不杀进程)" },
    @{ Title = "Recovering Scene Backups"; Seen = $true
       Need = "用户本人在该窗口上决定留不留上次异常退出的场景备份(脚本不代点、不删 Temp\__Backupscenes)" },
    @{ Title = "Unity Editor Software Terms"; Seen = $false
       Need = "用户本人在该窗口上决定是否接受编辑器软件条款(脚本不代点)" }
  )
}

# 窗口标题 -> 清单项;不在清单里回 $null。
function Get-UnityStartupDialog([string]$WindowTitle) {
  $t = ([string]$WindowTitle).Trim()
  if (-not $t) { return $null }
  foreach ($d in (Get-UnityStartupDialogCatalog)) {
    if ([string]::Equals($t, [string]$d.Title, [System.StringComparison]::Ordinal)) { return $d }
  }
  return $null
}

function New-StartupDialogWatch {
  return @{ Title = ""; EditorPid = 0; SinceUtc = [DateTime]::MinValue; LastPid = 0; Handle = [IntPtr]::Zero; CpuSeconds = -1 }
}

# 对话框探测的状态机(纯函数:不读进程、不看时钟,样本由调用方喂)。每轮喂一个(编辑器 pid, 主窗口标题, 时刻):
#   seen    —— 这一轮首次看到清单里的对话框(或换了一个 / 换了进程),开始计时
#   pending —— 同一个对话框还在,未满 $GraceSeconds
#   stuck   —— 同一个对话框连续在场满 $GraceSeconds:该停下报人了
#   cleared —— 上一轮还在的对话框这一轮没了(有人处置了,或进程换了窗口),计时清零
#   none    —— 没有对话框
# 回 @{ Event; Title; Seconds; Need }。宽限的用处:人在场时几秒就点掉了,不该因此回滚占位。
function Step-StartupDialogWatch([hashtable]$Watch, [int]$EditorPid, [string]$WindowTitle, [DateTime]$NowUtc, [int]$GraceSeconds) {
  $hit = Get-UnityStartupDialog $WindowTitle
  if (-not $hit) {
    if (-not $Watch.Title) { return @{ Event = "none"; Title = ""; Seconds = 0; Need = "" } }
    $gone = @{ Event = "cleared"; Title = $Watch.Title; Seconds = [int]($NowUtc - $Watch.SinceUtc).TotalSeconds; Need = "" }
    $Watch.Title = ""; $Watch.EditorPid = 0; $Watch.SinceUtc = [DateTime]::MinValue
    return $gone
  }
  $same = ([string]::Equals([string]$Watch.Title, [string]$hit.Title, [System.StringComparison]::Ordinal) -and $Watch.EditorPid -eq $EditorPid)
  if (-not $same) {
    $Watch.Title = [string]$hit.Title; $Watch.EditorPid = $EditorPid; $Watch.SinceUtc = $NowUtc
  }
  $sec = [int]($NowUtc - $Watch.SinceUtc).TotalSeconds
  $ev = "pending"
  if ($sec -ge $GraceSeconds) { $ev = "stuck" } elseif (-not $same) { $ev = "seen" }
  return @{ Event = $ev; Title = [string]$hit.Title; Seconds = $sec; Need = [string]$hit.Need }
}

# 读进程主窗口:回 @{ Title; Handle; CpuSeconds },进程不在回 $null。CpuSeconds 读不到记 -1。
function Get-ProcessMainWindow([int]$ProcessId) {
  if ($ProcessId -le 0) { return $null }
  try {
    $p = Get-Process -Id $ProcessId -ErrorAction Stop
    $cpu = -1
    try { $cpu = [int]$p.TotalProcessorTime.TotalSeconds } catch {}
    return @{ Title = [string]$p.MainWindowTitle; Handle = $p.MainWindowHandle; CpuSeconds = $cpu }
  } catch { return $null }
}

# 把窗口提到最前并保持置顶。只调 SetWindowPos(SWP_NOSIZE | SWP_NOMOVE | SWP_NOACTIVATE):不激活窗口、
# 不抢键盘焦点——抢了焦点,用户正在别处敲的回车 / 空格会落到对话框的默认按钮上,等于替他点了。
# 不发任何点击或按键。回值 = 置顶是否真的生效:SetWindowPos 回真不算数,要回读窗口的 WS_EX_TOPMOST 位
# ——本进程没有前台权限时系统会回真却不执行(实测同一段代码时成时不成,随当时谁在前台而变)。
# 所以置顶只是尽力而为;没成、句柄失效、Add-Type 编不过都回假,不影响判定。
function Set-WindowTopmostNoActivate([IntPtr]$Handle) {
  if ($Handle -eq [IntPtr]::Zero) { return $false }
  try {
    if (-not ("DevflowWin32.WindowZOrder" -as [type])) {
      Add-Type -Namespace DevflowWin32 -Name WindowZOrder -MemberDefinition @'
[DllImport("user32.dll", SetLastError = true)] public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);
[DllImport("user32.dll", EntryPoint = "GetWindowLongW")] public static extern int GetWindowLong(IntPtr hWnd, int nIndex);
'@
    }
    [void][DevflowWin32.WindowZOrder]::SetWindowPos($Handle, [IntPtr](-1), 0, 0, 0, 0, 0x0013)
    return (([DevflowWin32.WindowZOrder]::GetWindowLong($Handle, -20) -band 0x8) -ne 0)
  } catch { return $false }
}

# 探一轮:定位该工程的编辑器主进程(优先上一轮的 pid,其次本次新启的,都不在了才按工程路径重找),读它的
# 主窗口标题喂状态机。同一工程有多个非 worker 进程时取窗口标题在清单里的那个。回值同 Step-StartupDialogWatch,
# 另把 pid / 句柄 / CPU 秒数记进 $Watch 供出口用。任何异常按 none 处理(探测是附加判别,不能反过来拖垮领取)。
function Invoke-StartupDialogProbe([hashtable]$Watch, [string]$ProjectDir, [int]$StartedPid, [int]$GraceSeconds) {
  try {
    $candidates = @()
    foreach ($id in @($Watch.LastPid, $StartedPid)) {
      if ($id -gt 0 -and $candidates -notcontains $id -and (Get-ProcessMainWindow $id)) { $candidates += $id }
    }
    if ($candidates.Count -eq 0) {
      $candidates = @(Get-UnityProjectProcesses $ProjectDir | Where-Object { -not $_.IsWorker } | ForEach-Object { [int]$_.Pid })
    }
    $pick = 0; $win = $null
    foreach ($id in $candidates) {
      $w = Get-ProcessMainWindow $id
      if (-not $w) { continue }
      if (-not $win) { $pick = $id; $win = $w }
      if (Get-UnityStartupDialog $w.Title) { $pick = $id; $win = $w; break }
    }
    $title = ""
    if ($win) { $title = [string]$win.Title }
    $Watch.LastPid = $pick
    $r = Step-StartupDialogWatch $Watch $pick $title ([DateTime]::UtcNow) $GraceSeconds
    if ($win -and $r.Event -ne "none" -and $r.Event -ne "cleared") {
      $Watch.Handle = $win.Handle; $Watch.CpuSeconds = $win.CpuSeconds
    }
    return $r
  } catch {
    return @{ Event = "none"; Title = ""; Seconds = 0; Need = "" }
  }
}

function Resolve-UnityEditor([string]$ProjectDir) {
  $versionFile = Join-Path $ProjectDir "ProjectSettings\ProjectVersion.txt"
  if (-not (Test-Path $versionFile)) { return "" }
  $match = [regex]::Match([System.IO.File]::ReadAllText($versionFile), 'm_EditorVersion:\s*([^\r\n]+)')
  if (-not $match.Success) { return "" }
  $version = $match.Groups[1].Value.Trim()
  $candidate = Join-Path $env:ProgramFiles ("Unity\Hub\Editor\" + $version + "\Editor\Unity.exe")
  if (Test-Path $candidate) { return $candidate }
  return ""
}

# TCP 探测编辑器桥端口是否在监听接受连接。桥端口 OPEN 是 UnityMCP server 能路由到该实例的前置条件:
# 广播文件 reason==ready 可能早于桥稳定就绪 / server 完成连接注册,单凭状态文件放行会让 ACQUIRED
# 早于路由可达(实测空档期 execute_code 误落别的活槽)。返回端口是否可连。
function Test-BridgePortOpen([int]$Port, [int]$TimeoutMs = 1000) {
  if ($Port -le 0) { return $false }
  $client = New-Object System.Net.Sockets.TcpClient
  try {
    $iar = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
    $ok = $iar.AsyncWaitHandle.WaitOne($TimeoutMs)
    return ($ok -and $client.Connected)
  } catch {
    return $false
  } finally {
    $client.Close()
  }
}

function Set-BoardBlocked([string]$SlotN, [string]$Reason) {
  try {
    # 前缀用中文「阻塞:」:词汇表正本 = 看板.ps1 头注,占用面板 Get-NextAction 按该前缀判续接指引分支
    & (Join-Path $PSScriptRoot "看板.ps1") -Slot $SlotN -Stage ("阻塞:" + $Reason) 2>&1 | Out-Null
  } catch {}
}

# 就绪失败事务回滚:经 槽位领取内核.ps1 受控 git 回滚刚打的空 claim 占位(裸 git 受提交检查拦,
# 故走内部构件)。返回是否已回滚(RELEASED);形状不符会被内核拒绝、返回假,由调用方保留占位。
function Invoke-SlotRelease([string]$SlotRoot) {
  try {
    $out = @(& (Get-FlowEngine) -NoProfile -File (Join-Path $PSScriptRoot "槽位领取内核.ps1") -Release $SlotRoot 2>&1 | ForEach-Object { [string]$_ })
    return (@($out | Where-Object { $_ -match '^RELEASED ' }).Count -gt 0)
  } catch { return $false }
}

# 就绪失败统一出口:常规领取路径($RollbackOnFail 真)先回滚刚打的 claim 占位;-StartUnity
# 补就绪路径($RollbackOnFail 假)无新 claim 可回滚,只置看板阻塞、尾标 no_claim_change。
function Write-ReadyFailVerdict([string]$Kind, [string]$Detail, [string]$SlotN, [string]$SlotRoot, [string]$BoardReason, [bool]$RollbackOnFail) {
  if ($RollbackOnFail) {
    $released = Invoke-SlotRelease $SlotRoot
    if (-not $released) { Set-BoardBlocked $SlotN $BoardReason }
    $tail = if ($released) { " | rolled_back_claim" } else { " | claim_retained(release_failed)" }
  } else {
    Set-BoardBlocked $SlotN $BoardReason
    $tail = " | no_claim_change"
  }
  Write-Verdict ($Kind + " | slot=" + $SlotN + " | " + $Detail + $tail) 3
}

# 编辑器停在启动期模态对话框上的出口:再置顶一次,报 BLOCKED-UNITY-DIALOG。字段:pid = 编辑器进程、
# dialog = 对话框标题、shown = 已连续在场秒数、cpu = 该进程累计 CPU 秒数(读不到为 -1;停在对话框上时基本不涨)、
# raised = 置顶成没成、need = 需要谁做什么;尾部的回滚标记与 BLOCKED-UNITYMCP 同一出口。
function Write-StartupDialogVerdict([hashtable]$Watch, [hashtable]$Probe, [string]$SlotN, [string]$SlotRoot, [string]$ProjectDir, [bool]$RollbackOnFail) {
  $raised = "no"
  if (Set-WindowTopmostNoActivate $Watch.Handle) { $raised = "yes" }
  $detail = "pid=" + $Watch.EditorPid + " | dialog=" + $Probe.Title + " | shown=" + $Probe.Seconds + "s | cpu=" + $Watch.CpuSeconds + "s | raised=" + $raised +
            " | need=" + $Probe.Need + " | project=" + $ProjectDir
  Write-ReadyFailVerdict "BLOCKED-UNITY-DIALOG" $detail $SlotN $SlotRoot ("Unity 启动对话框待处置:" + $Probe.Title) $RollbackOnFail
}

# 路径比较用的规范形:全路径去掉尾部 '\',盘根保留为 'E:\'(单删尾斜杠会得 'E:',与 GetDirectoryName 回的盘根恒不等)。
# 不碰磁盘;空串或非法路径照 GetFullPath 抛出,由调用方的 try 接住。
function ConvertTo-ComparablePath([string]$P) {
  $full = [System.IO.Path]::GetFullPath($P)
  $root = [System.IO.Path]::GetPathRoot($full)
  $trimmed = $full.TrimEnd('\')
  if ($trimmed.Length -lt $root.Length) { return $root }
  return $trimmed
}

# 槽位工程的场景备份目录(<槽位根>\Demo\Temp\__Backupscenes)。回 @{ Path; Why }:校验不过时 Path 为空、
# Why 写原因。校验的是「要删的确实在本次领取的那个槽位工程的 Temp 之下」:槽位根须是槽位池目录的直接子目录、
# 目录名 = 槽位前缀 + 1..SlotCount、不是主仓;工程根须恰是 <槽位根>\Demo;规范化后的目标仍在其 Temp\ 之下。
# $Cfg 取 Get-FlowConfig 的结果(用到 SlotBaseDir / RepoRoot / SlotDirPrefix / SlotCount);缺键按校验不过处理。
# 参与比较的路径一律先过 ConvertTo-ComparablePath,含 GetDirectoryName 的结果:槽位池是盘根(E:\)时两侧才同形。
function Resolve-SlotSceneBackupDir([string]$SlotRoot, [string]$ProjectDir, [hashtable]$Cfg) {
  try {
    $ic = [System.StringComparison]::OrdinalIgnoreCase
    $slot = ConvertTo-ComparablePath $SlotRoot
    $proj = ConvertTo-ComparablePath $ProjectDir
    $base = ConvertTo-ComparablePath ([string]$Cfg.SlotBaseDir)
    $main = ConvertTo-ComparablePath ([string]$Cfg.RepoRoot)
    if ([string]::Equals($slot, $main, $ic)) { return @{ Path = ""; Why = "槽位根是主仓" } }
    $parent = [System.IO.Path]::GetDirectoryName($slot)
    if (-not $parent -or -not [string]::Equals((ConvertTo-ComparablePath $parent), $base, $ic)) { return @{ Path = ""; Why = "槽位根不是槽位池目录的直接子目录" } }
    $m = [regex]::Match([System.IO.Path]::GetFileName($slot), '^' + [regex]::Escape([string]$Cfg.SlotDirPrefix) + '(\d{1,4})$', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if (-not $m.Success -or -not [string]$Cfg.SlotDirPrefix -or [int]$m.Groups[1].Value -lt 1 -or [int]$m.Groups[1].Value -gt [int]$Cfg.SlotCount) {
      return @{ Path = ""; Why = "槽位根目录名不是池内槽位" }
    }
    if (-not [string]::Equals($proj, [System.IO.Path]::Combine($slot, 'Demo'), $ic)) { return @{ Path = ""; Why = "工程根不是 <槽位根>\Demo" } }
    $temp = [System.IO.Path]::Combine($proj, 'Temp')
    $target = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($temp, '__Backupscenes'))
    if (-not $target.StartsWith($temp + '\', [System.StringComparison]::OrdinalIgnoreCase)) { return @{ Path = ""; Why = "目标不在工程 Temp 之下" } }
    return @{ Path = $target; Why = "" }
  } catch {
    return @{ Path = ""; Why = "路径解析失败:" + $_.Exception.Message }
  }
}

# 清掉槽位工程的场景备份目录。调用时机只有一个:常规领取要新启编辑器、且尚未启动时(见 Invoke-UnityReadySequence)。
# 副作用:逐文件删除该目录下全部内容并删掉目录本身(.NET API,只读文件先去属性),不进回收站、不可恢复;
# 目录本身或其上一级 Temp 是目录联接 / 符号链接即拒绝,子目录是联接的只摘链接、不进去删。别的目录一概不碰。
# 回 @{ State; Dir; Deleted; Failed; Note }:State = absent(没有这个目录)/ cleared / partial(有删不掉的)/
# refused(路径校验不过,零删除)/ failed(意外异常)。函数不抛:清不掉不该让领取失败。
function Clear-SlotSceneBackups([string]$SlotRoot, [string]$ProjectDir, [hashtable]$Cfg) {
  $res = @{ State = "absent"; Dir = ""; Deleted = 0; Failed = 0; Note = "" }
  try {
    $loc = Resolve-SlotSceneBackupDir $SlotRoot $ProjectDir $Cfg
    if (-not $loc.Path) { $res.State = "refused"; $res.Note = [string]$loc.Why; return $res }
    $res.Dir = [string]$loc.Path
    if (-not [System.IO.Directory]::Exists($res.Dir)) { return $res }
    $link = [System.IO.FileAttributes]::ReparsePoint
    foreach ($d in @($res.Dir, [System.IO.Path]::GetDirectoryName($res.Dir))) {
      if (([System.IO.File]::GetAttributes($d) -band $link) -ne 0) {
        $res.State = "refused"; $res.Note = "是目录联接或符号链接:" + $d; return $res
      }
    }
    $pending = New-Object System.Collections.Generic.Stack[string]
    $visited = New-Object System.Collections.Generic.List[string]
    $pending.Push($res.Dir)
    while ($pending.Count -gt 0) {
      $cur = $pending.Pop()
      $visited.Add($cur)
      foreach ($f in [System.IO.Directory]::GetFiles($cur)) {
        try {
          [System.IO.File]::SetAttributes($f, [System.IO.FileAttributes]::Normal)
          [System.IO.File]::Delete($f)
          $res.Deleted++
        } catch { $res.Failed++; if (-not $res.Note) { $res.Note = $_.Exception.Message } }
      }
      foreach ($sub in [System.IO.Directory]::GetDirectories($cur)) {
        if (([System.IO.File]::GetAttributes($sub) -band $link) -ne 0) {
          try { [System.IO.Directory]::Delete($sub, $false) } catch { $res.Failed++; if (-not $res.Note) { $res.Note = $_.Exception.Message } }
        } else { $pending.Push($sub) }
      }
    }
    # 父目录恒先于子目录入列,倒着删即先子后父;里面还有删不掉的文件时这一步自然失败,计在 partial 里。
    for ($i = $visited.Count - 1; $i -ge 0; $i--) {
      try { [System.IO.Directory]::Delete($visited[$i], $false) } catch { if (-not $res.Note) { $res.Note = $_.Exception.Message } }
    }
    if ($res.Failed -gt 0 -or [System.IO.Directory]::Exists($res.Dir)) { $res.State = "partial" } else { $res.State = "cleared" }
    return $res
  } catch {
    $res.State = "failed"; $res.Note = $_.Exception.Message
    return $res
  }
}

# 场景备份清理的可见输出:清了(含空目录)打 INFO,没清干净或没清打 WARN;目录本来就不存在不出声。
function Write-SceneBackupClearLine([string]$SlotN, [hashtable]$Res) {
  $fallback = "领取照常;编辑器若停在恢复场景对话框上由 BLOCKED-UNITY-DIALOG 报出"
  # 两种 WARN 是护栏降级:经 hook函数库 Write-Degraded 同时写 event=degraded 遥测(guard=scene-backups);清成或本来就没有
  # 记 guard-ok。走到这里即该护栏走到了一次,检查命中面板按两者合计算降级占比,看出「恒降级」。
  if ($Res.State -eq "cleared") {
    Write-Host ("INFO scene-backups-cleared | slot=" + $SlotN + " | dir=" + $Res.Dir + " | files=" + $Res.Deleted)
    Write-GuardOk "scene-backups"
  } elseif ($Res.State -eq "partial") {
    Write-Degraded "scene-backups-partial" ("slot=" + $SlotN + " | dir=" + $Res.Dir + " | deleted=" + $Res.Deleted + " | failed=" + $Res.Failed + " | " + $Res.Note + " | " + $fallback) -Guard "scene-backups"
  } elseif ($Res.State -eq "refused" -or $Res.State -eq "failed") {
    Write-Degraded "scene-backups-skipped" ("slot=" + $SlotN + " | " + $Res.State + ":" + $Res.Note + " | 没有删任何东西;" + $fallback) -Guard "scene-backups"
  } else {
    Write-GuardOk "scene-backups"
  }
}

# 领取路径上清本槽位的场景备份并打可见输出(两种领取共用这一处)。调用方须已确认该槽位没有编辑器在跑:
# 常规领取在就绪序列的启动分支里调,免启领取经 Invoke-NoUnityClaimSceneBackupClear 调。配置取不到按校验不过处理。
function Invoke-ClaimSceneBackupClear([string]$SlotN, [string]$SlotRoot, [string]$ProjectDir) {
  $flowCfg = $null
  try { $flowCfg = Get-FlowConfig } catch {}
  Write-SceneBackupClearLine $SlotN (Clear-SlotSceneBackups $SlotRoot $ProjectDir $flowCfg)
}

# 免启领取收尾前的清理:该槽位没有编辑器在跑才清(判法同就绪序列,Test-UnityEditorRunning);判不出来按在跑处理、不清。
# 不抛:清不清都不改领取结果。
function Invoke-NoUnityClaimSceneBackupClear([string]$SlotN, [string]$SlotRoot, [string]$ProjectDir) {
  try {
    if (Test-UnityEditorRunning $ProjectDir) { return }
    Invoke-ClaimSceneBackupClear $SlotN $SlotRoot $ProjectDir
  } catch {}
}

# 启动槽位编辑器(未运行时)并等待 UnityMCP 就绪。成功返回 @{ Hash8; UnityPort };失败经
# Write-ReadyFailVerdict 直接退出。常规领取与 -StartUnity 补就绪共用本序列。
# $DialogGraceSeconds = 启动期对话框连续在场多久才停下报人(见头注);编辑器是本次新启的还是早已在跑的都探。
# $ClearSceneBackups = 新启编辑器之前清不清本槽位的场景备份:只有常规领取传真(槽位刚 reset 到基线),-StartUnity 不传。
# 编辑器已在跑时不走启动分支,也就不清。
function Invoke-UnityReadySequence([string]$SlotN, [string]$SlotRoot, [string]$ProjectDir, [int]$TimeoutSeconds, [bool]$RollbackOnFail, [int]$DialogGraceSeconds = 20, [bool]$ClearSceneBackups = $false) {
  $startedPid = 0
  if (-not (Test-UnityEditorRunning $ProjectDir)) {
    $unityExe = Resolve-UnityEditor $ProjectDir
    if (-not $unityExe) {
      Write-ReadyFailVerdict "BLOCKED-UNITY" ("editor executable not found for " + $ProjectDir) $SlotN $SlotRoot "Unity editor missing" $RollbackOnFail
    }
    if ($ClearSceneBackups) { Invoke-ClaimSceneBackupClear $SlotN $SlotRoot $ProjectDir }
    $started = Start-Process -FilePath $unityExe -ArgumentList @("-projectPath", $ProjectDir) -PassThru
    if ($started) { $startedPid = [int]$started.Id }
  }
  $dialogWatch = New-StartupDialogWatch

  # 就绪检查:主源读编辑器侧端口广播文件 ~/.unity-mcp/unity-mcp-status-<hash8>.json(传输无关,
  # stdio/HTTP 皆写);8080 HTTP 实例表仅 HTTP 传输环境有内容,退为后备手段。hash8 = 16 位工程 hash 前 8 位。
  # 两源命中后都再过 Test-BridgePortOpen 正向可达检查(桥端口 TCP 稳定可连),才放行。
  $expectedHash = Get-ProjectHash $ProjectDir
  $hash8 = $expectedHash.Substring(0, 8)
  $statusFile = Join-Path $env:USERPROFILE (".unity-mcp\unity-mcp-status-" + $hash8 + ".json")
  $expectedAssets = (([System.IO.Path]::GetFullPath((Join-Path $ProjectDir "Assets"))) -replace '\\', '/').TrimEnd('/')
  $deadline = [DateTime]::UtcNow.AddSeconds($TimeoutSeconds)
  $unityPort = ""
  $ready = $false
  while ([DateTime]::UtcNow -lt $deadline) {
    if (Test-Path $statusFile) {
      try {
        $raw = Get-Content -LiteralPath $statusFile -Raw -Encoding UTF8
        $st = $raw | ConvertFrom-Json
        $pathOk = (([string]$st.project_path).TrimEnd('/') -ieq $expectedAssets)
        $stateOk = (([string]$st.reason -eq 'ready') -and (-not [bool]$st.reloading))
        # heartbeat 从原始 JSON 文本抽:ConvertFrom-Json 把带 Z 的 ISO 时间强转本地 DateTime
        # (PS5.1/7 不一致),回转丢时区标记会错算 8h。正则取原串 + AssumeUniversal 按 UTC 解析。
        $freshOk = $false
        $hbMatch = [regex]::Match($raw, '"last_heartbeat"\s*:\s*"([^"]+)"')
        if ($hbMatch.Success) {
          try {
            $hb = [DateTimeOffset]::Parse($hbMatch.Groups[1].Value, [System.Globalization.CultureInfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::AssumeUniversal).UtcDateTime
            $freshOk = (([DateTime]::UtcNow - $hb).TotalSeconds -le 120)
          } catch {}
        }
        if ($pathOk -and $stateOk -and $freshOk) {
          # 追加正向可达检查:桥端口须 TCP 可连,且短 settle 后复探仍可连(稳定监听),才认路由可达。
          # 关闭「状态文件 ready 早于桥/server 就绪」的空档;残余 server 侧发现滞后由 Agent 侧
          # unity-check 的 set_active + dataPath 往返复核保障。
          $port = 0
          [int]::TryParse([string]$st.unity_port, [ref]$port) | Out-Null
          if (Test-BridgePortOpen $port) {
            Start-Sleep -Milliseconds 1500
            if (Test-BridgePortOpen $port) {
              $unityPort = [string]$port
              $ready = $true
              break
            }
          }
        }
      } catch {}
    }
    try {
      $response = Invoke-RestMethod -Method Get -Uri "http://127.0.0.1:8080/api/instances" -TimeoutSec 3
      foreach ($instance in @($response.instances)) {
        if ([string]$instance.hash -eq $expectedHash) {
          $port = 0
          if ($instance.unity_port) { [int]::TryParse([string]$instance.unity_port, [ref]$port) | Out-Null }
          elseif ($instance.port) { [int]::TryParse([string]$instance.port, [ref]$port) | Out-Null }
          if (Test-BridgePortOpen $port) {
            $unityPort = [string]$port
            $ready = $true
          }
          break
        }
      }
      if ($ready) { break }
    } catch {}
    # 没就绪:看编辑器是不是停在启动期对话框上。首次看到先置顶,给在场的人宽限时间处置;宽限满了仍在就停下报人。
    $dlg = Invoke-StartupDialogProbe $dialogWatch $ProjectDir $startedPid $DialogGraceSeconds
    if ($dlg.Event -eq "stuck") {
      Write-StartupDialogVerdict $dialogWatch $dlg $SlotN $SlotRoot $ProjectDir $RollbackOnFail
    } elseif ($dlg.Event -eq "seen") {
      $up = "no"
      if (Set-WindowTopmostNoActivate $dialogWatch.Handle) { $up = "yes" }
      Write-Host ("INFO startup-dialog-seen | slot=" + $SlotN + " | pid=" + $dialogWatch.EditorPid + " | dialog=" + $dlg.Title + " | raised=" + $up + " | 宽限 " + $DialogGraceSeconds + "s 内有人处置则继续等就绪")
    } elseif ($dlg.Event -eq "cleared") {
      Write-Host ("INFO startup-dialog-cleared | slot=" + $SlotN + " | dialog=" + $dlg.Title + " | shown=" + $dlg.Seconds + "s | 继续等就绪")
    }
    Start-Sleep -Seconds 2
  }
  if (-not $ready) {
    # 就绪窗口耗尽时对话框刚出现、宽限还没满的,同样按对话框报:原因已经看得见,不必退成看不出原因的那一种。
    if ($dialogWatch.Title) {
      $last = @{ Title = $dialogWatch.Title; Seconds = [int]([DateTime]::UtcNow - $dialogWatch.SinceUtc).TotalSeconds; Need = [string](Get-UnityStartupDialog $dialogWatch.Title).Need }
      Write-StartupDialogVerdict $dialogWatch $last $SlotN $SlotRoot $ProjectDir $RollbackOnFail
    }
    Write-ReadyFailVerdict "BLOCKED-UNITYMCP" ("project=" + $ProjectDir + " | expected_hash=" + $expectedHash + " | status_file=" + $statusFile) $SlotN $SlotRoot "UnityMCP not ready" $RollbackOnFail
  }
  return @{ Hash8 = $hash8; UnityPort = $unityPort }
}

# 判槽位工程的 csproj 是否须编辑器重生成(引用集或宏过期;正本 = 重建csproj.ps1 的 STALE-REGEN,exit 3)。
# 回 @{ Stale; Lines; Undetermined },Lines 为判中时该脚本点名过期项的明细行。以 Assembly-CSharp-Editor 为判定起点:它的
# ProjectReference 闭包覆盖热更程序集与 Launcher 等其余 Assets 程序集,交付闸 Editor程序集编译 同一起点。
# 判定本身跑不成(该脚本回 INFRA:闭包里缺 csproj、asmdef 重名等;或没出 VERDICT 行)时 Stale 为假、不拦领取,
# Undetermined 带原因(判定跑成时为空串)。「没过期」与「没判成」靠它区分:两者都回 Stale 为假,只看 Stale 的
# 调用方与测试分不出判定是否真的跑过(已实发:起点改成 Editor 程序集后测试夹具没跟,判定全程 INFRA,
# 「不过期」用例照过)。
function Get-CsprojRegenNeed([string]$ProjectDir) {
  $rc = Invoke-FlowChild (Join-Path $PSScriptRoot "重建csproj.ps1") @("-ProjectRoot", $ProjectDir, "-Assembly", "Assembly-CSharp-Editor")
  $detail = @($rc.lines | Where-Object { $_ -match '^STALE-(REFS|DEFINES) ' })
  $verdict = [string](@($rc.lines | Where-Object { $_ -match '^VERDICT: ' } | Select-Object -Last 1) | Select-Object -First 1)
  $why = ""
  if ($verdict -notmatch '^VERDICT: (FRESH|STALE|STALE-REGEN) ') {
    if ($verdict) { $why = ($verdict -replace '^VERDICT:\s*(INFRA\s*\|\s*)?', '') }
    else { $why = "重建csproj.ps1 没出 VERDICT 行(exit=" + $rc.code + ")" }
  }
  return @{ Stale = (-not $why -and $rc.code -eq 3); Lines = $detail; Undetermined = $why }
}

# 基线对齐后 csproj 判定结果的可见输出(调用点 = 领取主流程判定之后,常规与免启同一处):过期打 WARN 点名过期项与
# 重生成做法($NoUnityMode 时注明 -NoUnity 不生效);判定没跑成按未过期放行 = 护栏降级,经 Write-Degraded 记
# event=degraded(guard=csproj-regen),判成了(过期与否)记 guard-ok。
function Write-CsprojRegenNotice($Regen, [bool]$NoUnityMode) {
  if ($Regen.Stale) {
    foreach ($l in $Regen.Lines) { Write-Host ("WARN " + $l) }
    $upgrade = ""
    if ($NoUnityMode) { $upgrade = ",-NoUnity 不生效、照常启动编辑器" }
    Write-Host ("WARN csproj 须编辑器重生成(引用集 / 宏过期)" + $upgrade + ":实现与交付前在槽位编辑器里执行 AssetDatabase.Refresh(ImportAssetOptions.ForceUpdate) + Unity.CodeEditor.CodeEditor.CurrentEditor.SyncAll(),否则交付闸 Editor程序集编译 判 INFRA")
  }
  if ($Regen.Undetermined) {
    Write-Degraded "csproj-regen-undetermined" $Regen.Undetermined ("csproj 是否须编辑器重生成没判成(" + $Regen.Undetermined + "):按未过期处理、领取照常;引用集 / 宏过期与否未知,交付前先按该原因处置") -Guard "csproj-regen"
  } else {
    Write-GuardOk "csproj-regen"
  }
}

# 内核非零出口的遥测关联字段,写进 $Ctx(= $script:TelCtx;调用点 = 领取主流程内核拒绝分支)。
# Slot 只在抬头点名的就是那个槽位时改写:QUEUE devN(排队挡路的槽)、ABORT duplicate-claim devN(已持有同主题占位的槽)。
# FULL 的抬头列的是全部被占槽位,pinned slot 那类 ABORT 带的是路径,都不改,保留调用方给的 -Slot(没给就不写)。
# Files = 内核 INFO overlap 行点名的重叠文件(只有 QUEUE 有)。
function Set-KernelRefusalTelemetry($Ctx, [string]$Headline, [string[]]$Inner) {
  $dm = [regex]::Match($Headline, '^(?:QUEUE|ABORT duplicate-claim) dev(\d+)(?:\s|$)')
  if ($dm.Success) { $Ctx.Slot = $dm.Groups[1].Value }
  $Ctx.Files = @(@($Inner) | ForEach-Object { [regex]::Match([string]$_, '^INFO overlap: .+ <-> (.+)$') } | Where-Object { $_.Success } | ForEach-Object { $_.Groups[1].Value })
}

# 「开工前读」的行(调用点 = 领取主流程 csproj 判定之后;打印在两处 ACQUIRED 出口之前,就绪失败的出口不打)。
# 前缀读法同领取重叠比对(目录边界、不分大小写、\ 与 / 等价),按槽位双仓已跟踪文件展开后再判(槽位此刻已对齐基线),
# 还没有文件的新目录靠判据表的 DirRe;判据与匹配 = 校验库 Get-RuleReadPrefixHits。回行数组:每篇一行
# 「开工前读:<篇> <- <第一条命中前缀>(另 N 条前缀)」(篇的次序:客户端在前、同端按判据表),一篇没中回一行「开工前读:无(...)」,
# 两端都没给前缀回空数组。不抛:判不成(git 查询失败等)经 Write-Degraded 打 WARN 并记 degraded(guard=rules-prework)、回空数组;
# 判成了记 guard-ok;没给前缀不算走到该护栏,两样都不记。
function Get-PreworkRuleLines([string]$SlotRoot, [string]$FantasyRoot, [string[]]$ClientPrefixes, [string[]]$FantasyPrefixes) {
  $cp = @(@($ClientPrefixes) | Where-Object { $_ -and ([string]$_).Trim() })
  $fp = @(@($FantasyPrefixes) | Where-Object { $_ -and ([string]$_).Trim() })
  if ($cp.Count -eq 0 -and $fp.Count -eq 0) { return , @() }
  try {
    $hits = [ordered]@{}
    if ($cp.Count -gt 0) { $hits = Get-RuleReadPrefixHits "client" $cp (Get-RepoTrackedPaths $SlotRoot) $hits }
    if ($fp.Count -gt 0) { $hits = Get-RuleReadPrefixHits "server" $fp (Get-RepoTrackedPaths $FantasyRoot) $hits }
    $lines = New-Object System.Collections.Generic.List[string]
    foreach ($doc in $hits.Keys) {
      $h = $hits[$doc]
      $more = ""
      if ($h.Count -gt 1) { $more = "(另 " + ($h.Count - 1) + " 条前缀)" }
      $lines.Add("开工前读:" + $doc + " <- " + $h[0] + $more)
    }
    if ($lines.Count -eq 0) { $lines.Add("开工前读:无(所给改动范围没命中按需篇判据表;表外的面按 CLAUDE.md 路由表自认)") }
    Write-GuardOk "rules-prework"
    return , $lines.ToArray()
  } catch {
    $why = $_.Exception.Message
    Write-Degraded "rules-prework-undetermined" $why ("开工前读没判成(" + $why + "):领取照常;该先读哪些按需篇按 CLAUDE.md 路由表自认,自审时 自审触发判定 的 RULES 行照常点名") -Guard "rules-prework"
    return , @()
  }
}

# 测试钩子:置 SLOT_ACQUIRE_NOEXEC=1 时只加载函数定义、不执行领取主流程
# (供假仓单测 dot-source 后直接调 Test-BridgePortOpen 等探针函数)。
if ($env:SLOT_ACQUIRE_NOEXEC -eq '1') { return }

try {
  $cfg = Get-FlowConfig
  foreach ($key in @("SlotCount", "UnityReadyTimeoutSeconds")) {
    if (-not $cfg[$key]) { Write-Verdict ("INFRA | missing flow-config key " + $key) 2 }
  }
  if ($ReadyTimeoutSeconds -le 0) { $ReadyTimeoutSeconds = [int]$cfg.UnityReadyTimeoutSeconds }

  # -Abandon 放弃模式:经内核丢弃槽位现场,不领取、不碰编辑器。与其余一切模式互斥,防一次调用
  # 既放弃又领取(放弃是不可逆动作,须单独、显式地发生)。
  if ($Abandon) {
    if ($StartUnity -or $NoUnity -or $Topic -or $TopicFile -or $BriefFile -or $PathsFile -or $FantasyPathsFile -or $Paths.Count -gt 0 -or $FantasyPaths.Count -gt 0) {
      Write-Verdict "DENIED | -Abandon 只认 -Slot(放弃模式不领取;放弃后另起一次领取)" 1
    }
    if (-not $Slot) { Write-Verdict "DENIED | -Abandon 需要 -Slot <N>" 1 }
    if ($Slot -notmatch '^\d+$' -or [int]$Slot -lt 1 -or [int]$Slot -gt [int]$cfg.SlotCount) {
      Write-Verdict ("DENIED | slot must be in 1.." + $cfg.SlotCount) 1
    }
    $slotRoot = Join-Path $cfg.SlotBaseDir ($cfg.SlotDirPrefix + $Slot)
    $script:TelCtx.Claim = Get-ClaimSha $slotRoot $cfg.ClientBaseline   # 放弃前取:之后占位就没了
    Enter-Phase $script:TelCtx.Clock "kernel"
    $ir = Invoke-FlowChild (Join-Path $PSScriptRoot "槽位领取内核.ps1") @("-Abandon", $slotRoot)
    $inner = $ir.lines; $innerCode = $ir.code
    $headline = @($inner | Where-Object { $_ -match '^(ABANDONED|ABORT) ' } | Select-Object -First 1)
    if ($headline.Count -eq 0) {
      Show-Inner $inner ""
      Write-Verdict ("INFRA | slot abandon returned no contract line (exit=" + $innerCode + ")") 2
    }
    Show-Inner $inner $headline[0]
    if ($innerCode -ne 0) { Write-Verdict ("ABORT | " + $headline[0]) 1 }
    Write-Verdict ("ABANDONED | slot=" + $Slot + " | " + ($headline[0] -replace '^ABANDONED\s+', '')) 0
  }

  # -StartUnity 补就绪模式:不领取、零 git 动作,只对已领取槽位跑启动+就绪。与领取参数互斥,
  # 防被误当领取入口用。
  if ($StartUnity) {
    if ($NoUnity) { Write-Verdict "DENIED | -StartUnity 与 -NoUnity 互斥" 1 }
    if ($Topic -or $TopicFile -or $BriefFile -or $PathsFile -or $FantasyPathsFile -or $Paths.Count -gt 0 -or $FantasyPaths.Count -gt 0) {
      Write-Verdict "DENIED | -StartUnity 只认 -Slot 与 -ReadyTimeoutSeconds(补就绪模式,不领取)" 1
    }
    if (-not $Slot) { Write-Verdict "DENIED | -StartUnity 需要 -Slot <N>" 1 }
    $slotRoot = Join-Path $cfg.SlotBaseDir ($cfg.SlotDirPrefix + $Slot)
    $projectDir = Join-Path $slotRoot "Demo"
    if (-not (Test-Path -LiteralPath $projectDir)) { Write-Verdict ("INFRA | slot project not found: " + $projectDir) 2 }
    $script:TelCtx.Claim = Get-ClaimSha $slotRoot $cfg.ClientBaseline
    Enter-Phase $script:TelCtx.Clock "unity_ready"
    $r = Invoke-UnityReadySequence $Slot $slotRoot $projectDir $ReadyTimeoutSeconds $false
    Write-Verdict ("UNITY-READY | slot=" + $Slot + " | unity=" + $projectDir + " | mcp_instance=Demo@" + $r.Hash8 + " | unity_port=" + $r.UnityPort) 0
  }

  # 主题二选一:两个都给按调用方契约错误拒(不猜哪个优先)。TopicFile 用 .NET ReadAllText 读
  # ——它按 UTF-8 解码并剥 BOM,不像 PS 5.1 的 Get-Content 会把无 BOM 的 UTF-8 按 ANSI 猜。
  if ($Topic -and $TopicFile) { Write-Verdict "DENIED | -Topic 与 -TopicFile 互斥,只给其一" 1 }
  if ($TopicFile) {
    if (-not (Test-Path -LiteralPath $TopicFile)) { Write-Verdict ("DENIED | TopicFile not found: " + $TopicFile) 1 }
    $Topic = ([System.IO.File]::ReadAllText($TopicFile)).Trim()
  }
  if (-not $Topic.Trim()) { Write-Verdict "DENIED | topic is empty (-Topic 与 -TopicFile 须给其一且非空)" 1 }
  $script:TelCtx.Topic = $Topic.Trim()
  if (-not $BriefFile) { Write-Verdict "DENIED-BRIEF | -BriefFile is required (简报模板正本: .claude/devflow/templates/简报模板.md)" 1 }
  $Paths = @($Paths) + (Read-PathListFile $PathsFile "PathsFile")
  $FantasyPaths = @($FantasyPaths) + (Read-PathListFile $FantasyPathsFile "FantasyPathsFile")

  # 主题 / 清单转写文件登记待清(hook函数库 New-FlowTempFile),出口 finally 统一删;调用方传入的文件不登记、不删。
  $topicFile = New-FlowTempFile "slot-acquire-topic"
  [System.IO.File]::WriteAllText($topicFile, $Topic.Trim(), (New-Object System.Text.UTF8Encoding($false)))
  $kernelArgs = @("-TopicFile", $topicFile)
  if (-not (Test-Path -LiteralPath $BriefFile)) { Write-Verdict ("DENIED-BRIEF | BriefFile not found: " + $BriefFile) 1 }
  # 简报结构机判(模板正本 = templates\简报模板.md;语义层仍归第一步自查)。DENIED-BRIEF 属调用方
  # 可修错误:按缺项清单修简报后重试一次,二次仍败停下呈报(处置正本 = devflow 卡「停机呈报」fix-retry 档)。
  Enter-Phase $script:TelCtx.Clock "brief"
  $bvr = Invoke-FlowChild (Join-Path $PSScriptRoot "简报校验.ps1") @("-BriefFile", $BriefFile)
  $bv = $bvr.lines; $bvCode = $bvr.code
  if ($bvCode -ne 0) {
    foreach ($l in $bv) { if ($l -notmatch '^VERDICT:') { Write-Host $l } }
    $bvTail = @($bv | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1)
    $tailTxt = "brief validation failed"
    if ($bvTail.Count -gt 0) { $tailTxt = ($bvTail[0] -replace '^VERDICT:\s*', '') }
    if ($bvCode -eq 2) { Write-Verdict ("INFRA | 简报校验: " + $tailTxt) 2 }
    Write-Verdict ("DENIED-BRIEF | " + $tailTxt) 1
  }
  $kernelArgs += "-BriefFile"; $kernelArgs += $BriefFile
  # 清单走文件传给内核(shell-conventions·文本走文件)。曾以逗号连接成单实参,但经 -File 起子进程时
  # 命令行实参绑定到 [string[]] 并不按逗号拆分(逗号拆分只发生在 PS 表达式语法里),内核侧又无拆包,
  # 于是多条路径退化成一个含逗号的长串、前缀匹配恒不命中,重叠比对整体失效;含空格的路径还会被拆成
  # 多个 argv、错绑成参数名而直接绑定失败。落文件同时解掉这两条,且路径含逗号也不再有歧义。
  if ($Paths.Count -gt 0) {
    $clientPathsFile = New-FlowTempFile "slot-acquire-paths"
    [System.IO.File]::WriteAllLines($clientPathsFile, [string[]]$Paths, (New-Object System.Text.UTF8Encoding($false)))
    $kernelArgs += "-PathsFile"; $kernelArgs += $clientPathsFile
  }
  if ($FantasyPaths.Count -gt 0) {
    $fantasyPathsFile = New-FlowTempFile "slot-acquire-fxpaths"
    [System.IO.File]::WriteAllLines($fantasyPathsFile, [string[]]$FantasyPaths, (New-Object System.Text.UTF8Encoding($false)))
    $kernelArgs += "-FantasyPathsFile"; $kernelArgs += $fantasyPathsFile
  }
  if ($Slot) { $kernelArgs += "-Slot"; $kernelArgs += $Slot }
  if ($NoUnity) { $kernelArgs += "-PreferNoUnity" }

  Enter-Phase $script:TelCtx.Clock "kernel"
  $ir = Invoke-FlowChild (Join-Path $PSScriptRoot "槽位领取内核.ps1") $kernelArgs
  $inner = $ir.lines; $innerCode = $ir.code
  $headline = @($inner | Where-Object { $_ -match '^(ACQUIRED|QUEUE|FULL|ABORT) ' } | Select-Object -First 1)
  if ($headline.Count -eq 0) {
    Show-Inner $inner ""
    Write-Verdict ("INFRA | slot claim returned no contract line (exit=" + $innerCode + ")") 2
  }
  if ($innerCode -ne 0) {
    $kind = ($headline[0] -split '\s+', 2)[0]
    Set-KernelRefusalTelemetry $script:TelCtx $headline[0] $inner
    Show-Inner $inner $headline[0]
    Write-Verdict ($kind + " | " + $headline[0]) $innerCode
  }

  # 第三段(槽位 Fantasy 根)在服务端通道关闭时为空,内核行以槽位根收尾。
  $m = [regex]::Match($headline[0], '^ACQUIRED\s+(\d+)\s+(\S+)(?:\s+(\S+))?\s*$')
  if (-not $m.Success) { Write-Verdict ("INFRA | malformed acquisition result: " + $headline[0]) 2 }
  $slotN = $m.Groups[1].Value
  $slotRoot = $m.Groups[2].Value
  $fantasyRoot = $m.Groups[3].Value
  $projectDir = Join-Path $slotRoot "Demo"
  $script:TelCtx.Slot = $slotN
  $script:TelCtx.Claim = Get-ClaimSha $slotRoot $cfg.ClientBaseline   # 就绪失败回滚后占位就没了,先取
  # 成功路径只透传内核 WARN 行(不阻断领用但会话须知,如 Tools\Luban junction 重建失败);
  # INFO 明细照旧只在失败时经 Show-Inner 透传。
  foreach ($w in @($inner | Where-Object { $_ -match '^WARN ' })) { Write-Host $w }

  # 基线带进来的新 asmdef、asmdef 新加的引用、全局宏或 versionDefines 的变化,只有编辑器重生成 csproj
  # 才进得来;脚本侧(重建csproj.ps1 -InPlace、交付闸 Editor程序集编译)只会重建 Compile 列表。编辑器已在跑时
  # 也不会因工作树被 reset 自己刷新,重生成须 Agent 在编辑器里触发,故判中时两条路径都打 WARN 交代做法。
  Enter-Phase $script:TelCtx.Clock "csproj"
  $regen = Get-CsprojRegenNeed $projectDir
  Enter-Phase $script:TelCtx.Clock ""
  Write-CsprojRegenNotice $regen ([bool]$NoUnity)
  # 开工前读:槽位刚对齐基线,此刻按它展开前缀;行留到 ACQUIRED 之前再打(就绪失败没领成,不打)。
  $prework = Get-PreworkRuleLines $slotRoot $fantasyRoot $Paths $FantasyPaths

  if ($NoUnity -and -not $regen.Stale) {
    # 纯服务端(且不涉协议)任务免启编辑器:客户端自检全程不需要活编辑器(它有一道会编
    # Editor 程序集,csproj 的 Compile 列表过期时自己按磁盘实扫重建;引用集 / 宏过期它补不了,
    # 已由上面的判定改走启动编辑器),交付序列同理。
    # 中途转需客户端实现时用 -StartUnity -Slot <N> 补就绪,不重领(重领会 reset 掉未提交改动)。
    # 免启领取同样刚 reset 到基线:该槽位没有编辑器在跑就清掉场景备份,之后补就绪时新进程不至于停在恢复场景对话框上。
    Invoke-NoUnityClaimSceneBackupClear $slotN $slotRoot $projectDir
    foreach ($l in $prework) { Write-Host $l }
    Write-Verdict ("ACQUIRED | slot=" + $slotN + " | root=" + $slotRoot + " | fantasy=" + $fantasyRoot + " | unity=" + $projectDir + " | mcp_instance=none | unity_port=0") 0
  }

  # 这一处是常规领取:槽位刚被内核 reset 到基线,新启编辑器前清场景备份(-StartUnity 那一处不传,不清)。
  Enter-Phase $script:TelCtx.Clock "unity_ready"
  $r = Invoke-UnityReadySequence $slotN $slotRoot $projectDir $ReadyTimeoutSeconds $true -ClearSceneBackups $true

  # mcp_instance 用 8 位 hash:UnityMCP server 路由表与 set_active_instance 认 8 位形态,
  # 给 16 位全 hash 会被判 not-found(非 8 位 id 的前缀,匹配不上)。
  foreach ($l in $prework) { Write-Host $l }
  Write-Verdict ("ACQUIRED | slot=" + $slotN + " | root=" + $slotRoot + " | fantasy=" + $fantasyRoot + " | unity=" + $projectDir + " | mcp_instance=Demo@" + $r.Hash8 + " | unity_port=" + $r.UnityPort) 0
} catch {
  Write-Verdict ("INFRA | " + $_.Exception.Message) 2
} finally {
  # 各出口(Write-Verdict 的 exit 亦然)删本脚本自建的临时件;内核子进程早已退出,不再读它们。
  Remove-FlowTempFiles
}

