# hook函数库.ps1 - shared functions for devflow hooks & gates (PS 5.1).
# On load: functions, one state-root variable, one compiled regex (C# noise stripper, near the
# end), and one process-wide encoding pin (below).
# Load-time statements (and Read-HookStdin) stay cmdlet-free, pure .NET: under -NoProfile the
# first cmdlet call autoloads its module (Utility ~0.5 s, Management ~0.2 s, measured 2026-09-27),
# and the command-surface hooks (提交检查 / 命令通路检查) dot-source this library on every
# Bash/PowerShell tool call their settings.json `if` prefilter lets through, just to decide
# whether the call needs checking at all (fast path).
# Cmdlets inside functions are fine: they load when called.
# stdin is consumed solely by Read-HookStdin (directly or via Read-HookInput), so gate scripts
# may dot-source this without touching stdin. State/telemetry live OUTSIDE the repo
# (LOCALAPPDATA) so worktrees/slots share nothing via git and slot .claude copies stay
# untouched; the physical location is resolved by Resolve-WfStatePath (MSIX container split,
# see there).

# 文本编码单点:全族 devflow 脚本经点源本库统一钉 UTF-8,不各自设一份。
# [Console]::OutputEncoding 在 PS 5.1 同时管两个方向,两端必须同口径:
#   解码 —— Get-GitLines 等用 cmd /c 起 git,PS 按本值解其 stdout。git 输出 UTF-8,按缺省
#     OEM 页(中文机 936/GBK)解会得到 mojibake 串(每个 UTF-8 字节当一个 GBK 字符)。
#   编码 —— 本进程写 stdout 也用本值。mojibake 串按 GBK 写出恰好还原原字节,故缺省下终端
#     看着正常 —— 是往返抵消而非解对了,且抵消只在两端同为 OEM 页时成立。
# 只在部分脚本钉必然在脚本边界打破抵消(实发:占用面板 -Json 单独钉 UTF-8 后,Unity 面板上
# git 来源的 commit 主题从抵消态变显式乱码),故钉在共享层而非各脚本。消费方一律按 UTF-8
# 读:Unity 面板 DevFlowDashboardWindow 的 StandardOutputEncoding、槽位.bat 的 chcp 65001、
# tests\看板CLI测试.ps1 顶部同设。
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

function Get-ClaudePackageDirs([string]$Lad = $env:LOCALAPPDATA) {
  # 桌面端 MSIX 包目录 <Lad>\Packages\Claude_*,按 Ordinal 排序(多包并存时各进程枚举顺序一致)。
  # 包名后缀(如 pzs8sxrjxfjjc)是发布者哈希,不写死。消费方 = Resolve-WfStatePath、占用面板 Get-StoreIndex。
  # 本函数与 Resolve-WfStatePath 在载入期执行,只用 .NET(见头注)。
  $root = [System.IO.Path]::Combine($Lad, "Packages")
  try {
    if (-not [System.IO.Directory]::Exists($root)) { return , @() }
    $dirs = [System.IO.Directory]::GetDirectories($root, "Claude_*")
  } catch { return , @() }
  [Array]::Sort($dirs, [System.StringComparer]::Ordinal)
  return , $dirs
}

function Resolve-WfStatePath([string]$Rel, [string]$Lad = $env:LOCALAPPDATA) {
  # 仓外运行态路径(相对 LOCALAPPDATA,如 claude-wf-3b\board.json)-> 物理路径,容器内外调用落同一文件。
  # 成因:桌面端是 MSIX 打包应用,Claude Code 的 shell(含 pwsh)跑在包容器内,在 %LOCALAPPDATA% 下新建的项
  # 被重定向进 <Lad>\Packages\Claude_*\LocalCache\Local\;容器外进程(Unity 编辑器调 占用面板 / 看板 /
  # 槽位领取)看不到那份,同名路径是另一份真实文件——看板、遥测、看板锁一并无声分裂(实发 2026-09-27:
  # Unity 槽位面板恒读 2026-08 的旧看板)。LocalCache\Local 这条物理路径则容器内外读写都直达、不再重定向
  # (同日两侧互写互见实测)。
  # 判据按首段(claude-wf-3b)整体定根,看板 / 遥测 / 锁同根不拆:
  #   ①有 Claude_* 包:落包内 LocalCache\Local。多包时先取已有该首段的,再取最近活动者(首段及其直接子项的
  #     最大 mtime;都没有该首段时比 LocalCache\Local 本身),同分取 Ordinal 序在前。首次写(包内还没有该段)
  #     也直落包内而不经普通路径:容器内写普通路径会被重定向进包内,容器外写却落真文件,结果取决于哪侧先写;
  #     直写物理路径与写方在哪侧无关。此时普通路径上的旧真文件不读——它正是分裂出去的那份。
  #   ②无 Claude_* 包(没有容器,不会分裂):<Lad>\<Rel>。
  # 一律由 $Lad(缺省 $env:LOCALAPPDATA)派生:测试隔离与 run_tests 哨兵靠换这个环境变量生效。
  $top = ($Rel -split '[\\/]', 2)[0]
  $best = $null; $bestHas = $false; $bestTick = [long]-1
  foreach ($pkg in (Get-ClaudePackageDirs $Lad)) {
    $local = [System.IO.Path]::Combine($pkg, "LocalCache\Local")
    if (-not [System.IO.Directory]::Exists($local)) { continue }
    $seg = [System.IO.Path]::Combine($local, $top)
    $has = [System.IO.Directory]::Exists($seg) -or [System.IO.File]::Exists($seg)
    if ($bestHas -and -not $has) { continue }
    $tick = [long]0
    try {
      $probe = if ($has) { $seg } else { $local }
      if ([System.IO.Directory]::Exists($probe)) {
        $di = [System.IO.DirectoryInfo]::new($probe)
        $tick = $di.LastWriteTimeUtc.Ticks
        foreach ($e in $di.GetFileSystemInfos()) { if ($e.LastWriteTimeUtc.Ticks -gt $tick) { $tick = $e.LastWriteTimeUtc.Ticks } }
      } else { $tick = [System.IO.FileInfo]::new($probe).LastWriteTimeUtc.Ticks }
    } catch {}
    if ($null -eq $best -or ($has -and -not $bestHas) -or $tick -gt $bestTick) { $best = $local; $bestHas = $has; $bestTick = $tick }
  }
  if ($best) { return [System.IO.Path]::Combine($best, $Rel) }
  return [System.IO.Path]::Combine($Lad, $Rel)
}

$script:WfStateRoot = Resolve-WfStatePath "claude-wf-3b"

function Resolve-FlowRoots([hashtable]$Cfg, [string]$Here) {
  # Fill in the path keys (RepoRoot / FantasyRoot) whenever the config leaves them empty;
  # an explicit value in the psd1 always wins (test fixtures rely on that).
  # Anchor: this library always sits at <repoRoot>\Demo\.claude\devflow\hooks, so
  # four levels up is the repo root.
  $root = [System.IO.Path]::GetFullPath((Join-Path $Here "..\..\..\.."))
  if (-not $Cfg.RepoRoot)    { $Cfg.RepoRoot = $root }
  if (-not $Cfg.FantasyRoot -and $Cfg.ServerDirName) { $Cfg.FantasyRoot = (Join-Path $Cfg.RepoRoot $Cfg.ServerDirName) }
  return $Cfg
}

function Get-FlowConfig {
  # devflow machine constants (single source = ..\flow-config.psd1). Lazy + cached.
  # -ErrorAction Stop is load-bearing: hooks run under EAP=Continue, where a missing/
  # broken psd1 is a NON-terminating error - without Stop this returns $null silently
  # and null-propagation disarms downstream checks (live-verified: `-match $null` is
  # always true, so 提交检查 judged the MAIN repo as a slot and skipped the ticket and
  # persistence checks with zero error telemetry). With Stop it throws even under
  # Continue; callers decide fail-open (card hooks) vs fail-closed (提交检查).
  if (-not $script:FlowCfg) {
    $script:FlowCfg = Import-PowerShellDataFile (Join-Path $PSScriptRoot "..\flow-config.psd1") -ErrorAction Stop
    if (-not $script:FlowCfg) { throw "flow-config.psd1 loaded empty" }
    $script:FlowCfg = Resolve-FlowRoots $script:FlowCfg $PSScriptRoot
  }
  return $script:FlowCfg
}

function Test-ServerEnabled {
  # 服务端通道开关(单源):flow-config ServerDirName 非空才有服务端仓。本作没有服务端,双仓共用脚本里
  # 碰服务端仓的分支一律先问它;关闭时服务端侧视同「无改动、无票要求、无部署」。
  return [bool](Get-FlowConfig).ServerDirName
}

function Get-FlowEngine {
  # PowerShell engine used to spawn devflow child scripts: the CURRENT engine, so a child
  # runs under whatever launched its parent (Windows PowerShell 5.1 in practice).
  # This is only safe because every devflow .ps1/.psd1 carries a UTF-8 BOM - 5.1 reads
  # BOM-less UTF-8 as ANSI and mangles the Chinese literals (see script-authoring).
  # Single source: callers must not hardcode an engine path, or a machine whose engine
  # lives elsewhere fails silently.
  if (-not $script:FlowEngine) {
    $cur = (Get-Process -Id $PID).Path
    if ($cur) { $script:FlowEngine = $cur }
    else { $script:FlowEngine = (Get-Command powershell.exe -ErrorAction Stop).Source }
  }
  return $script:FlowEngine
}

function Read-HookStdin {
  # Hook payload as text. Raw-byte read + UTF8 decode: immune to console codepage (Chinese
  # Windows GBK) mangling. Pure .NET (see header): the hook fast paths call it before any
  # module loads.
  try {
    $ms = [System.IO.MemoryStream]::new()
    [Console]::OpenStandardInput().CopyTo($ms)
    # Strip a UTF-8 BOM if present: a BOM-prefixed payload fails ConvertFrom-Json and the
    # hook would fail-open silently (bit a drill fed from a BOM'd file, 2026-07-15).
    return [System.Text.Encoding]::UTF8.GetString($ms.ToArray()).TrimStart([char]0xFEFF)
  } catch { return $null }
}

function Read-HookInput([string]$Raw) {
  # -Raw: payload a hook already took with Read-HookStdin (stdin can be read only once);
  # omitted = read stdin here.
  if (-not $PSBoundParameters.ContainsKey('Raw')) { $Raw = Read-HookStdin }
  if (-not $Raw) { return $null }
  try { return ($Raw | ConvertFrom-Json) } catch { return $null }
}

function Write-Telemetry([hashtable]$Fields) {
  try {
    $dir = Join-Path $script:WfStateRoot "telemetry"
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $f = Join-Path $dir ("wf-" + (Get-Date -Format "yyyyMM") + ".jsonl")
    $Fields["ts"] = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
    $line = ($Fields | ConvertTo-Json -Compress -Depth 4)
    [System.IO.File]::AppendAllText($f, $line + "`n", (New-Object System.Text.UTF8Encoding($false)))
  } catch {}
}

# ---- 遥测的共用构件(消费方 = 两个 Agent 入口的 VERDICT 出口、两端自检、集成交付、检查命中面板)----
# 交付关联号:槽位交付 每次运行生成一个,经环境变量传给它拉起的子流程(集成交付、两端自检,含部署点那次构建),
# 子流程的遥测行带 run=<该号>,与入口那行 entry-verdict 一一对上;不经 槽位交付 直接调的运行没有这个字段。
$script:DeliverRunEnv = "FLOW_DELIVER_RUN"
function Get-DeliverRunId { return [string][Environment]::GetEnvironmentVariable($script:DeliverRunEnv) }

function Write-Degraded([string]$Key, [string]$Detail = "", [string]$Message = "", [string]$Source = "", [string]$Guard = "") {
  # 护栏降级的统一出口:检查没跑成而按缺省放行、清理没做成而照常继续这一类。打一行 WARN 给人看,同时写一行
  # event=degraded 遥测(key / src / detail / guard),检查命中面板的「疑似恒降级」按它统计:某护栏最近几次走到时
  # 几乎次次降级 = 它在真环境里恒不生效(实发:582df1e06 修的场景备份清理恒走 skipped,10 天没人察觉)。
  #   $Key     稳定的机读名(如 scene-backups-skipped),面板按它归并;
  #   $Detail  本次的现场(进遥测,前 200 字);
  #   $Message 非空时 WARN 行原样打它(保留既有文案);空则打 "<Key> | <Detail>"(无 Detail 只打 Key);
  #   $Source  来源脚本名,缺省取调用点所在脚本的文件名(去扩展名);
  #   $Guard   该键所属护栏步骤的名字(一个步骤可有多个降级键,如 scene-backups 的 skipped / partial)。给了它,
  #            该步骤没降级的那些次须调 Write-GuardOk <同名>,面板的分母 = 该护栏最近走到的次数(降级 + 没降级);
  #            不给时分母退回来源脚本的运行记录(entry-verdict 的 entry / gate-run 的 gate / 集成交付 / 单仓提交),
  #            含走不到该步骤的运行,占比偏低、可能漏报,对不上来源的只列次数。
  # 不抛:遥测写不进不影响调用方。
  $text = $Message
  if (-not $text) { $text = $Key; if ($Detail) { $text = $Key + " | " + $Detail } }
  Write-Host ("WARN " + $text)
  try {
    $src = $Source
    if (-not $src) { $src = [System.IO.Path]::GetFileNameWithoutExtension([string]$MyInvocation.PSCommandPath) }
    $d = $Detail
    if (-not $d) { $d = $text }
    if ($d.Length -gt 200) { $d = $d.Substring(0, 200) }
    $f = @{ event = "degraded"; key = (ConvertTo-GuardName $Key); src = $src; detail = $d }
    if ($Guard) { $f["guard"] = (ConvertTo-GuardName $Guard) }
    $run = Get-DeliverRunId
    if ($run) { $f["run"] = $run }
    Write-Telemetry $f
  } catch {}
}

function ConvertTo-GuardName([string]$Name) {
  # 护栏名 / 降级键进遥测前把 < > & ' " 换成 _:PS 5.1 的 ConvertTo-Json 会把前四个写成 \u00XX,而检查命中面板
  # 按正则读 guard-ok 行、不反转义,同一护栏会被拆成两个名字。
  return [regex]::Replace([string]$Name, '[<>&''"]', '_')
}

function Write-GuardOk([string]$Guard, [string]$Source = "") {
  # 护栏步骤走到且没降级:写一行 event=guard-ok(guard / src),不打任何输出。与 Write-Degraded -Guard 配对,
  # 给检查命中面板「疑似恒降级」算「最近走到该护栏的 N 次里降级几次」的分母;走不到该步骤的运行两样都不写。
  # $Source 缺省取调用点所在脚本的文件名。两函数都在有交付关联号时带 run,护栏名经 ConvertTo-GuardName 规整。不抛。
  try {
    if (-not $Guard) { return }
    $src = $Source
    if (-not $src) { $src = [System.IO.Path]::GetFileNameWithoutExtension([string]$MyInvocation.PSCommandPath) }
    $f = @{ event = "guard-ok"; guard = (ConvertTo-GuardName $Guard); src = $src }
    $run = Get-DeliverRunId
    if ($run) { $f["run"] = $run }
    Write-Telemetry $f
  } catch {}
}

function Get-VerdictTelemetryFields([string]$Line) {
  # VERDICT 正文(带不带 next= 后缀都可)-> @{ verdict = 抬头首词; next = 档位; detail = 抬头之后的正文前 200 字 }。
  # next 取 Format-VerdictLine 拼出的那个(即会话在末行实际看到的档位,含透传内层后缀的情形)。
  $full = Format-VerdictLine $Line
  $m = [regex]::Match($full, '\snext=(go|serial|fix-retry|judge|halt)$')
  $next = ""
  if ($m.Success) { $next = $m.Groups[1].Value; $full = $full.Substring(0, $m.Index) }
  $parts = $full.Trim() -split '[\s|]+', 2
  $body = ""
  if ($parts.Count -gt 1) { $body = ([string]$parts[1]).Trim() }
  if ($body.Length -gt 200) { $body = $body.Substring(0, 200) }
  return @{ verdict = [string]$parts[0]; next = $next; detail = $body }
}

# 分段计时(消费方 = 两个 Agent 入口与 集成交付 的遥测 phases 字段)。只读时钟、不改控制流:出口时把已走过的段
# 连同正在走的那段一并记下,没走到的段不出现。同名段多次进入时耗时累加。
function New-PhaseClock {
  return @{ Sw = [System.Diagnostics.Stopwatch]::StartNew(); Cur = ""; Mark = [long]0; Ms = [ordered]@{} }
}

function Add-PhaseMs($Clock, [string]$Name, [double]$Ms) {
  # 直接给某段记一笔(段不是顺序走的,如锁等待、部署点的一次构建)。
  if ($null -eq $Clock -or -not $Name) { return }
  $prev = 0.0
  if ($Clock.Ms.Contains($Name)) { $prev = [double]$Clock.Ms[$Name] }
  $Clock.Ms[$Name] = $prev + $Ms
}

function Enter-Phase($Clock, [string]$Name) {
  # 收掉当前段、进入 $Name 段;$Name 空 = 只收不进(之后的耗时不归任何段)。
  if ($null -eq $Clock) { return }
  $now = [long]$Clock.Sw.ElapsedMilliseconds
  if ($Clock.Cur) { Add-PhaseMs $Clock $Clock.Cur ($now - $Clock.Mark) }
  $Clock.Cur = $Name
  $Clock.Mark = $now
}

function Get-PhaseSecs($Clock) {
  # 各段秒数(一位小数),按首次进入的次序;正在走的段计到此刻。不改时钟状态。
  $out = [ordered]@{}
  if ($null -eq $Clock) { return $out }
  foreach ($k in $Clock.Ms.Keys) { $out[$k] = [double]$Clock.Ms[$k] }
  if ($Clock.Cur) {
    $prev = 0.0
    if ($out.Contains($Clock.Cur)) { $prev = [double]$out[$Clock.Cur] }
    $out[$Clock.Cur] = $prev + ([long]$Clock.Sw.ElapsedMilliseconds - $Clock.Mark)
  }
  foreach ($k in @($out.Keys)) { $out[$k] = [Math]::Round([double]$out[$k] / 1000.0, 1) }
  return $out
}

function Deny-ToolUse([string]$Reason, [string]$EventName) {
  # Emit PreToolUse deny as raw UTF-8 bytes on stdout (codepage-safe for Chinese text).
  if (-not $EventName) { $EventName = "PreToolUse" }
  $obj = @{ hookSpecificOutput = @{ hookEventName = $EventName; permissionDecision = "deny"; permissionDecisionReason = $Reason } }
  $json  = $obj | ConvertTo-Json -Depth 5 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $out = [Console]::OpenStandardOutput()
  $out.Write($bytes, 0, $bytes.Length); $out.Flush()
  exit 0
}

function Ask-ToolUse([string]$Reason, [string]$EventName) {
  # PreToolUse 的第三档判决:不放行也不拒绝,交 harness 弹权限对话框由用户裁定。
  # 与 Deny-ToolUse 同走裸 UTF-8 stdout(中文理由经代码页会乱码)。
  # 用于「不该由 agent 自己决定跑不跑」的动作 —— agent 无法伪造用户的点击,故强制力不靠自律。
  if (-not $EventName) { $EventName = "PreToolUse" }
  $obj = @{ hookSpecificOutput = @{ hookEventName = $EventName; permissionDecision = "ask"; permissionDecisionReason = $Reason } }
  $json  = $obj | ConvertTo-Json -Depth 5 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $out = [Console]::OpenStandardOutput()
  $out.Write($bytes, 0, $bytes.Length); $out.Flush()
  exit 0
}

function Get-VerdictNext([string]$Line) {
  # VERDICT 续接档位的判据单源:Agent 面入口在末行附 `next=<档位>`,会话按该字段处置,
  # 不在卡里另记一份类别清单(卡侧只描述五个档位各做什么)。
  # 档位:go 成功继续 / serial 计划内排队 / fix-retry 确定性可修(修后重跑一次) /
  #       judge 需先判根因是否自明 / halt 停机呈报等用户指示。
  # 例外面只认下方 switch 明列的类别,DENIED- 不通配——DENIED-tabledoc / DENIED-persist /
  # DENIED-ticket-* 同为 DENIED 前缀但修法要现场判断,落 halt。
  $head = (([string]$Line).Trim() -split '[\s|]+')[0]
  switch -Regex ($head) {
    '^(ACQUIRED|DELIVERED|UNITY-READY|ABANDONED|COMMITTED|NOTHING-TO-COMMIT|CHECK-PASS|PASS)$' { return "go" }
    '^QUEUE$'                         { return "serial" }
    '^(DENIED-BRIEF|DENIED-subject|DENIED-qualify)$' { return "fix-retry" }
    '^GATE-FAIL$'                     { return "judge" }
    default                           { return "halt" }
  }
}

function Format-VerdictLine([string]$Line) {
  # VERDICT 正文 -> 带 next= 后缀的完整行(幂等:已带后缀的原样返回,供透传路径二次拼装)。
  # 后缀恒在行尾,消费方的前缀匹配(`^VERDICT: XXX`)不受影响。
  # 幂等的前提:行尾 next= 与本行抬头一致。外层把内层 VERDICT 正文包进自己的行时(槽位交付
  # `BLOCKED-COMMIT | <单仓提交 verdict>`、`GATE-FAIL | <自检 / 协议导出 输出>`),内层若带 next=
  # 会被原样继承,档位随内层而非外层抬头。现役包装点不触发:单仓提交 里能带出非 halt 档的失败只有
  # DENIED-subject(fix-retry),已被 槽位交付 开头同源的主题前置校验挡掉,其余失败内层与外层同为 halt;
  # 自检与 协议导出 的输出不经本函数、不带 next=。新增包装点若包的是会带 next= 的入口,须先剥内层后缀。
  $s = ([string]$Line).Trim()
  if ($s -match '\snext=(go|serial|fix-retry|judge|halt)$') { return $s }
  return ($s + " next=" + (Get-VerdictNext $s))
}

function Assert-CmdSafeArgs([string]$CmdArgs) {
  # 经 cmd /c 的 git 参数里,成对的 %名% 在该环境变量存在时会被 cmd 展开(git --format 的 %H%x1f%ct 就含
  # %H% / %ct% 两对),查询静默变形而不报错。本机未定义同名变量时原样保留,故只在「真会被展开」时抛,
  # 把静默变形变成当场失败。三个 cmd 型 git 封装入口处调用;需要这类格式的调用点改走不经 cmd 的路子。
  foreach ($m in [regex]::Matches($CmdArgs, '%([^%\r\n]+)%')) {
    $name = $m.Groups[1].Value
    if ([Environment]::GetEnvironmentVariable($name)) {
      throw ("git 参数含 %" + $name + "%,而环境变量 " + $name + " 已定义,经 cmd /c 会被展开:git " + $CmdArgs)
    }
  }
}

function Get-GitLines([string]$Root, [string]$GitArgs) {
  # git 只读查询的行数组(单一事实源:校验库 / 认可交付脚本 / 机械脚本共用本函数)。
  # Always returns a real array: PS unrolls single-element pipeline output to a scalar
  # string, on which [0] indexes a Char (live incident: .Trim() on Char crashed the hook
  # into fail-open and let an unticketed commit through).
  # stderr 交给 cmd 的 2>nul:PS 5.1 对原生进程用 2>$null 会把 stderr 包成 ErrorRecord,
  # 调用方 EAP=Stop 时抛。
  #
  # 归一化三道,缺一道就会让「行数」这个判据失真(实发 2026-08-19:槽位交付的 Luban 基线闸
  # 用 Count -gt 0 判落后,零落差时收到 1 个空元素、真落后 3 个提交时收到 1 行拼接串,
  # 两种情形都算成「落后 1 个提交」——含 Luban 的交付因此恒被拒):
  #   ①$null 归一为空串再过滤。`@($null)` 在 PS 里是长度 1 的数组,靠真值转换
  #     (`Where-Object { $_ -and ... }`)滤它并不可靠——cmd 的返回在某些上下文里不是干净的
  #     $null/字符串。显式转字符串再判长度,不依赖真值转换。
  #   ②按换行显式再拆一次。PS 捕获原生进程 stdout 时不保证已按行拆开,整块 stdout 可能
  #     作为单个元素回来,多行被当成一行。对已拆好的输入再拆是幂等的,不改变正常路径。
  #   ③用显式循环 + List[string] 收集,不用管道。管道里 `-split` 每次返回 String[],
  #     元素是数组时外层 `@()` 会留下嵌套(实测元素 GetType().Name = Object[]),
  #     嵌套一出现 Count 就不再等于行数——这正是本函数要给的东西。返回类型钉死 string[]。
  Assert-CmdSafeArgs $GitArgs
  $out = cmd /c "git -C `"$Root`" $GitArgs 2>nul"
  $lines = New-Object System.Collections.Generic.List[string]
  foreach ($item in @($out)) {
    if ($null -eq $item) { continue }
    foreach ($seg in ([string]$item -split "`r?`n")) {
      if ($seg.Trim().Length -gt 0) { [void]$lines.Add($seg) }
    }
  }
  return , $lines.ToArray()
}

function Get-GitLinesRaw([string]$Root, [string]$GitArgs) {
  # 同 Get-GitLines,但不过滤空行——取提交信息正文(--format=%b)等需保留段落空行的场景用;
  # 状态/哈希清单类查询仍用 Get-GitLines(空行是噪音)。
  Assert-CmdSafeArgs $GitArgs
  $out = cmd /c "git -C `"$Root`" $GitArgs 2>nul"
  return , @(@($out) | ForEach-Object { [string]$_ })
}

function Get-GitOne([string]$Root, [string]$GitArgs) {
  # 单行 git 输出(trim);无输出回空串。
  $lines = Get-GitLines $Root $GitArgs
  if ($lines.Count -gt 0) { return ([string]$lines[0]).Trim() }
  return ""
}

function Get-GitLinesChecked([string]$Root, [string]$GitArgs) {
  # 决策用的只读查询:Get-GitLines 吞 stderr、不回退出码,git 非零退出或 cmd 自身报错(如命令行超 8191
  # 字符)都成「无输出」——「空清单」被读成「没有改动 / 没有落后 / 已推平」,决策静默走错(实发:单仓提交
  # 落成 NOTHING-TO-COMMIT + next=go)。非零即抛,由调用方外层判 INFRA。空结果是合法答案的查询用它;
  # 非零本身是合法答案的(rev-parse --verify --quiet、diff --quiet)仍用 Get-GitLines / Invoke-GitMerged。
  $lines = Get-GitLines $Root $GitArgs
  if ($LASTEXITCODE -ne 0) { throw ("git 查询失败(exit " + $LASTEXITCODE + "):git -C " + $Root + " " + $GitArgs) }
  return , $lines
}

function Invoke-GitMerged([string]$Root, [string]$GitArgs) {
  # 状态改变类 git:合并 stdout+stderr,回 @{ code; lines }。只读查询用 Get-GitLines。
  Assert-CmdSafeArgs $GitArgs
  $out = cmd /c "git -C `"$Root`" $GitArgs 2>&1"
  return @{ code = $LASTEXITCODE; lines = @(@($out) | ForEach-Object { [string]$_ }) }
}

function Invoke-FlowChild([string]$ScriptPath, [object[]]$Arguments = @(), [switch]$Echo) {
  # 起一个 devflow 子脚本并收它的全部输出行,回 @{ code; lines }(消费方:槽位交付 的各子流程调用点、
  # 工作流通路检查)。-Echo 边收边回显(canary 要实时看进度);缺省静默收,由调用方决定透传哪些。
  # 函数内局部降 EAP:5.1 在 Stop 下把 2>&1 收到的子进程 stderr 行包成 ErrorRecord 并抛出,子流程的
  # VERDICT 随之丢失、被读成 INFRA(canary 则以未捕获异常退出、槽位不释放)。判定只看退出码与 VERDICT 行。
  # 不套 cmd /c:参数含调用方给的路径与中文主题,经 cmd 解析会遭 % & ^ 元字符改写;直调保持 argv 原样。
  $ErrorActionPreference = "Continue"
  $lines = @(& (Get-FlowEngine) -NoProfile -File $ScriptPath @Arguments 2>&1 | ForEach-Object {
    $s = [string]$_
    if ($Echo) { Write-Host $s }
    $s
  })
  return @{ code = $LASTEXITCODE; lines = $lines }
}

function Get-ContentDirtyPaths([string]$Root) {
  # 内容视角的未提交改动清单(相对 HEAD 忽略行尾 CR 的 diff + 未跟踪未忽略),消费方 = 合并预检 B/C 段、
  # 集成交付 主 Fantasy 合并前置。不取 `status --porcelain`:status 在 stat 不符时按「清洗后内容 vs
  # 入库 blob」判 M,两类零内容差异的文件会恒报脏——①Luban 生成物写出混合行尾(N 个 CRLF + 1 个裸 LF),
  # 与按 eol 检出的统一行尾字节永不相等;②入库 blob 本身是 CRLF 而 .gitattributes 要求 eol=lf(协议
  # 重导后主 Fantasy 的 OuterMessage.cs 实发,下一轮交付被判主树不净停机)。②在普通 diff 里仍是整文件
  # 行尾差异,故加 --ignore-cr-at-eol。eol 属性设 lf 或 crlf 都消不掉①(两侧实测),Luban 的 lineEnding
  # 选项也不改变输出,故适配在判据侧:要拦的是「内容真有差异」的改动,不是「stat 对不上」的文件。
  # 只差行尾的真改动因此不计脏:它合并时若与合并面相交,由 git merge 自己拒(调用方按「merge 未能开始」处置)。
  $acc = New-Object System.Collections.Generic.List[string]
  foreach ($src in @("-c core.quotepath=false diff --ignore-cr-at-eol --name-only HEAD", "-c core.quotepath=false ls-files --others --exclude-standard")) {
    foreach ($p in (Get-GitLines $Root $src)) {
      if ($p) { [void]$acc.Add([string]$p) }
    }
  }
  return , $acc.ToArray()
}

function Repair-EolPhantomPaths([string]$Root, [string]$PathRe = "") {
  # 行尾幻影归一:「status 判 M 而内容零差异」的已跟踪文件 checkout 回检出形态,回 @{ ok; fixed; note }。
  # 消费方 = 协议导出 输出目录、校验库 Invoke-GenReExport 重导收口。$PathRe = 仓根相对路径正则,空 = 不限。
  # 成因:导出器写出的行尾与检出形态不同(Luban 的混合行尾见上方 Get-ContentDirtyPaths ①;属性挂空时受
  # core.autocrlf 左右),清洗后内容与入库 blob 相同、体积却变了。git 对体积不符的条目直接判 modified 不比内容,
  # status 与 update-index --refresh 都刷不掉这份 stat 缓存,只有 add 或检出会重写它。提交收口只收有内容差异
  # 的路径,幻影就一直留着:已交付槽位被判占用(实发 2026-09-26 dev1/dev3,领取连返 FULL),合并碰到它时
  # git 也拒绝覆盖。判据 = status 的「 M」减去 diff 有内容差异的:diff 走 clean 过滤,为空即内容零差异,
  # checkout 只改行尾。不加 --ignore-cr-at-eol:入库 blob 自身为 CRLF 而属性要求 eol=lf(上方 ②)在 git
  # 看来是真差异,下次 add 就改写 blob,不归本函数动。
  $none = @{ ok = $true; fixed = @(); note = "" }
  # 取 Get-GitLines* 的结果直接赋值或 foreach,不套 @():它回 `, 数组`,套一层即成单元素嵌套数组,
  # 下方 -cnotcontains 随之恒真,真改动也会被当成幻影 checkout 掉。
  try {
    $cand = New-Object System.Collections.Generic.List[string]
    foreach ($line in (Get-GitLinesChecked $Root "-c core.quotepath=false status --porcelain -uno")) {
      if ($line.Length -lt 4 -or $line.Substring(0, 2) -ne " M") { continue }
      $p = $line.Substring(3).Trim('"')
      if (-not $PathRe -or $p -match $PathRe) { [void]$cand.Add($p) }
    }
    if ($cand.Count -eq 0) { return $none }
    $real = Get-GitLinesChecked $Root "-c core.quotepath=false diff --name-only"
  } catch { return @{ ok = $false; fixed = @(); note = $_.Exception.Message } }
  $phantom = @($cand | Where-Object { $real -cnotcontains $_ })
  if ($phantom.Count -eq 0) { return $none }
  $list = New-FlowTempFile "eol-phantom"
  try {
    [System.IO.File]::WriteAllLines($list, [string[]]$phantom, (New-Object System.Text.UTF8Encoding($false)))
    $r = Invoke-GitMerged $Root ("--literal-pathspecs checkout -q --pathspec-from-file=`"" + $list + "`"")
  } finally { try { [System.IO.File]::Delete($list) } catch {} }
  if ($r.code -ne 0) { return @{ ok = $false; fixed = @(); note = ("checkout 失败(" + $Root + "):" + (($r.lines | Select-Object -Last 2) -join " | ")) } }
  return @{ ok = $true; fixed = $phantom; note = "" }
}

function Read-OneLineTextFile([string]$File) {
  # 「文本走文件」的读取侧:会话把含中文 / 引号的短文本写进 UTF-8 文件,以 -XxxFile 传进来。
  # 整份读入,各行去首尾空白、丢空行后以空格连成一行;文件不存在返回 $null(调用方自定报错文案与出口码)。
  if (-not (Test-Path -LiteralPath $File -PathType Leaf)) { return $null }
  $raw = [System.IO.File]::ReadAllText($File, [System.Text.Encoding]::UTF8)
  return ((($raw -split "\r?\n") | ForEach-Object { $_.Trim() } | Where-Object { $_ }) -join " ")
}

function New-FlowTempFile([string]$Prefix) {
  # 脚本自建临时文件(%TEMP% 下,前缀 + GUID)的路径,并登记待清;脚本出口的 finally 调
  # Remove-FlowTempFiles 统一删。只登记本脚本自己建的——调用方传入的文件不经这里,也就不会被删。
  # 登记表懒建:本库被多处重复点源时不因重载清空已登记的路径。
  if ($null -eq $script:FlowTempFiles) { $script:FlowTempFiles = New-Object System.Collections.Generic.List[string] }
  $p = Join-Path ([System.IO.Path]::GetFullPath($env:TEMP).TrimEnd('\')) ($Prefix + "-" + [Guid]::NewGuid().ToString("N") + ".txt")
  [void]$script:FlowTempFiles.Add($p)
  return $p
}

function Remove-FlowTempFiles {
  # 删 New-FlowTempFile 登记过的临时文件;不存在的跳过,删失败静默(清理不改变脚本结论)。
  # 不向 stdout 写任何东西:调用点在 finally,入口末行须仍是 VERDICT。
  if ($null -eq $script:FlowTempFiles) { return }
  foreach ($p in @($script:FlowTempFiles.ToArray())) {
    try { if ([System.IO.File]::Exists($p)) { [System.IO.File]::Delete($p) } } catch {}
  }
  $script:FlowTempFiles.Clear()
}

# ---- 检查道次的准入登记(消费方 = 客户端自检 / 服务端自检 启动时逐道核;检查命中面板 汇总命中) ----
# 每道扫描脚本在头注里写一行机读登记,正本就在该道自己身上(同一道挂两端自检时不出第二份):
#   # 准入: Since=<yyyy-MM-dd> | Basis=<复发|实测根因|用户裁定|存量> | Origin=<依据> | Retire=<退役条件>[ | Reviewed=<yyyy-MM-dd>]
# 由来:近两月「加了又撤」的检查都在前提未坐实时上线——成因未实测(裁剪致空槽断言,真因是 HybridCLR
# 缺陷)、产品裁定未定(热更白名单成员五改)、只发生过一次;撤掉时又说不清当初凭什么加、到什么程度可撤。
# 判据(登记日 >= GateAdmissionCutover 的新道次):
#   复发     Origin 至少两处证据(提交 sha 或日期)—— 即 CLAUDE.md「同类问题第二次出现」;
#   实测根因 至少一处证据 —— 出包运行时才显形的缺陷须有「改前复现、改后不复现」的对照才算;
#   用户裁定 至少一处证据(裁定的提交或日期)。
#   存量     只给登记制度前已在役的道次;新道次不可用。
# Retire 写「到什么程度可撤」,供零命中复核对照(命中数据来自 gate-run 遥测,见 检查命中面板.ps1)。
# Reviewed 可选:最近一次零命中复核裁定「保留」的日期。写了它,检查命中面板 按该日之后的运行次数判候选
# (语义正本 = 该脚本头注)。在场时须是 yyyy-MM-dd 且不早于 Since,否则同样算登记不合判据。
$script:GateAdmissionCutover = "2026-09-25"
$script:GateBasisSet = @("复发", "实测根因", "用户裁定", "存量")

function Read-GateAdmission([string]$ScriptPath) {
  # 回登记字段 hashtable;无登记行回空表。只读前 80 行(登记在头注)。
  $f = @{}
  if (-not (Test-Path -LiteralPath $ScriptPath)) { return $f }
  # 显式 StreamReader + Dispose:File.ReadLines 的枚举器在 foreach 里 break 不释放句柄,被读的道次脚本
  # 会一直被本进程占着(测试删夹具时实测报「被另一进程使用」)。
  $sr = New-Object System.IO.StreamReader($ScriptPath, [System.Text.Encoding]::UTF8)
  try {
    for ($n = 0; $n -lt 80; $n++) {
      $line = $sr.ReadLine()
      if ($null -eq $line) { break }
      $m = [regex]::Match($line, '^\s*#\s*准入:\s*(.+)$')
      if (-not $m.Success) { continue }
      foreach ($part in ($m.Groups[1].Value -split '\s+\|\s+')) {
        $kv = [regex]::Match($part, '^\s*(\w+)=(.*)$')
        if ($kv.Success) { $f[$kv.Groups[1].Value] = $kv.Groups[2].Value.Trim() }
      }
      break
    }
  } finally { $sr.Dispose() }
  return $f
}

function Get-GateAdmissionGap([string]$ScriptPath) {
  # 回缺口描述数组,空 = 登记齐全且合判据。
  $a = Read-GateAdmission $ScriptPath
  $gap = @()
  if ($a.Count -eq 0) { return , @("无「# 准入:」登记行") }
  foreach ($k in @("Since", "Basis", "Origin", "Retire")) { if (-not $a[$k]) { $gap += ("缺 " + $k) } }
  if ($a.Since -and $a.Since -notmatch '^\d{4}-\d{2}-\d{2}$') { $gap += ("Since 不是 yyyy-MM-dd:" + $a.Since) }
  if ($a.Basis -and $script:GateBasisSet -notcontains $a.Basis) { $gap += ("Basis 不在 " + ($script:GateBasisSet -join "/") + " 之内:" + $a.Basis) }
  $ev = [regex]::Matches([string]$a.Origin, '\b[0-9a-f]{7,40}\b|\b\d{4}-\d{2}-\d{2}\b').Count
  if ($a.Basis -eq "复发" -and $ev -lt 2) { $gap += "Basis=复发 须在 Origin 列至少两处证据(提交 sha 或日期)" }
  if (($a.Basis -eq "实测根因" -or $a.Basis -eq "用户裁定") -and $ev -lt 1) { $gap += ("Basis=" + $a.Basis + " 须在 Origin 列至少一处证据(提交 sha 或日期)") }
  if ($a.Basis -eq "存量" -and $a.Since -and [string]::CompareOrdinal([string]$a.Since, $script:GateAdmissionCutover) -ge 0) {
    $gap += ("Basis=存量 只给 " + $script:GateAdmissionCutover + " 前已在役的道次;新道次按 复发 / 实测根因 / 用户裁定 登记")
  }
  if ($a.ContainsKey("Reviewed")) {
    if ($a.Reviewed -notmatch '^\d{4}-\d{2}-\d{2}$') { $gap += ("Reviewed 不是 yyyy-MM-dd:" + $a.Reviewed) }
    elseif ($a.Since -match '^\d{4}-\d{2}-\d{2}$' -and [string]::CompareOrdinal([string]$a.Reviewed, [string]$a.Since) -lt 0) { $gap += ("Reviewed 早于 Since:" + $a.Reviewed + " < " + $a.Since) }
  }
  return , $gap
}

# ---- 自检并行道(消费方 = 客户端自检 / 服务端自检:扫描数组里带 Async 的道各起一个子进程)----
# 子进程里的调用形态与在自检进程内跑的道相同(& 脚本 -<参数名> <值>,取 $LASTEXITCODE),出口码原样带回;
# 未捕获异常在子进程里只会变成 exit 1,与「判违规」同码,故在子进程内接住、打一行标记并以专用码退出,
# 父进程据此仍判 INFRA 并点名异常类型。调用写进一份临时包装脚本、以 -File 起:路径含中文与空格,不过命令行转义;
# 不用 -EncodedCommand——管道重定向下它把 stderr 序列化成 CLIXML(进度与每条 Write-Host 记录各抄一份,
# -OutputFormat Text 压不住),回放出来是一屏 XML。
$script:GateAsyncThrewMark = "GATE-ASYNC-SCAN-THREW"
$script:GateAsyncThrewCode = 97

function Start-GateAsyncScan([string]$ScanPath, [string]$ArgName, [string]$ArgValue, [string]$WrapPath) {
  # 起一道并行道,回它的运行记录(交 Complete-GateAsyncRun 收)。$WrapPath = 包装脚本落点,调用方保证各道不重名。
  $quote = { param([string]$s) "'" + $s.Replace("'", "''") + "'" }
  $cmd = ". " + (& $quote (Join-Path $PSScriptRoot "hook函数库.ps1")) + "`n" +
         "`$ErrorActionPreference = 'Stop'`n`$global:LASTEXITCODE = 0`n" +
         "try { & " + (& $quote $ScanPath) + " -" + $ArgName + " " + (& $quote $ArgValue) + "; exit `$LASTEXITCODE }`n" +
         "catch { Write-Host ('" + $script:GateAsyncThrewMark + " ' + `$_.Exception.GetType().Name + ': ' + (`$_.Exception.Message -replace '\s+', ' ')); exit " + $script:GateAsyncThrewCode + " }"
  [System.IO.File]::WriteAllText($WrapPath, $cmd, (New-Object System.Text.UTF8Encoding($true)))
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = Get-FlowEngine
  $psi.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"" + $WrapPath + "`""
  $psi.WorkingDirectory = (Get-Location).ProviderPath
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
  $psi.StandardErrorEncoding = [System.Text.Encoding]::UTF8
  $proc = [System.Diagnostics.Process]::Start($psi)
  # 两条管道都异步读到底:同步读其一,另一条写满缓冲时子进程就卡死。
  return @{ Proc = $proc; Wrap = $WrapPath; Out = $proc.StandardOutput.ReadToEndAsync(); Err = $proc.StandardError.ReadToEndAsync(); Done = $false; Rc = 0; Threw = "" }
}

function Complete-GateAsyncRun($Run) {
  # 收一道并行道:等退出、删包装脚本、回放输出(标记行不回放),结果写回 $Run.Rc / $Run.Threw。幂等。
  # 另记该道耗时 $Run.Ms(子进程起止时刻之差,含起引擎约一秒;读不到记 -1),供 gate-run 遥测 scanms。
  if ($Run.Done) { return }
  $Run.Done = $true
  $Run.Proc.WaitForExit()
  $Run.Rc = $Run.Proc.ExitCode
  $Run.Ms = -1
  try { $Run.Ms = [int]($Run.Proc.ExitTime - $Run.Proc.StartTime).TotalMilliseconds } catch {}
  try { [System.IO.File]::Delete($Run.Wrap) } catch {}
  $text = $Run.Out.GetAwaiter().GetResult() + $Run.Err.GetAwaiter().GetResult()
  $text = $text.TrimStart([char]0xFEFF).TrimEnd("`r", "`n")
  if (-not $text) { return }
  foreach ($line in ($text -split "`r?`n")) {
    if ($line.StartsWith($script:GateAsyncThrewMark + " ", [System.StringComparison]::Ordinal)) { $Run.Threw = $line.Substring($script:GateAsyncThrewMark.Length + 1); continue }
    Write-Host $line
  }
  if ($Run.Threw -and $Run.Rc -ne $script:GateAsyncThrewCode) { $Run.Threw = "" }
}

function Complete-GateAsyncRuns($Runs) {
  # 收齐还没收的并行道(按起的次序 = 扫描数组顺序)。自检的任何出口退出前都先经它,不留还在跑的子进程。
  foreach ($run in $Runs) { Complete-GateAsyncRun $run }
}

# ---- 自检编排的共用出口(消费方 = 客户端自检 / 服务端自检)----
# 两端曾各写一份 Exit-GateInfra / Resolve-ScanOutcome 且已漂移(服务端 INFRA 出口的耗时写死为 0,
# 13 次服务端 INFRA 全记 0 秒),故收成一份,差异经运行上下文($Run,New-GateRun 建)传入:
#   Gate / Repo / Fields   gate-run 遥测的 gate、repo 与各端自有的固定字段(客户端 mode / slot);
#   Suffix                 本端 VERDICT 行的尾注(客户端 "; slot=devN",服务端空);
#   Sw                     遥测 secs 取它的读数(调用方按阶段换:服务端扫描期 = 扫描计时、构建期 = 构建计时);
#   PhaseSw                额外按段出的秒数字段名 -> 计时器(服务端 scanSecs / buildSecs);
#   Scans                  扫描数组(各道 File / Tag / Fail / Infra / Async / Path);Extra = 其余附加字段(STALE 的 driftPaths)。
# 遥测在原有字段上另记 scanms(跑到的各道毫秒,按数组顺序)与 fails(本次判违规的全部道,含已跑完的并行道;
# 结论与出口不变,仍是数组里最靠前的那道,只是把已有结果记全——命中面板据此不再低估排在后面的道)。
function New-GateRun([string]$Gate, [string]$Repo, [hashtable]$Fields = @{}, [string]$Suffix = "") {
  return @{ Gate = $Gate; Repo = $Repo; Fields = $Fields; Suffix = $Suffix; Sw = $null; PhaseSw = [ordered]@{}
            Scans = @(); Extra = @{}; AsyncRuns = (New-Object System.Collections.Generic.List[object])
            WrapBase = (Join-Path ([System.IO.Path]::GetFullPath($env:TEMP).TrimEnd('\')) ("gate-async-" + [Guid]::NewGuid().ToString("N"))) }
}

function Get-GateRunFails($Run) {
  # 本次判违规(出口码 1)的道 Tag,按扫描数组顺序:结局为违规的那道 + 已收齐、出口码为 1 且没抛异常的并行道。
  $out = New-Object System.Collections.Generic.List[string]
  foreach ($s in @($Run.Scans)) {
    if ($s.Failed) { $out.Add([string]$s.Tag); continue }
    if ($s.Async -and $s.Run -and $s.Run.Done -and -not $s.Run.Threw -and $s.Run.Rc -eq 1) { $out.Add([string]$s.Tag) }
  }
  return , $out.ToArray()
}

function Write-GateRunTelemetry($Run, [string]$Verdict, [bool]$Ticket) {
  # gate-run 遥测的唯一构造点(两端各出口都经此)。整体吞异常:它排在 FAIL / INFRA 出口的 VERDICT 行之前,
  # 拼装一抛就会经兜底 trap 再进 Exit-GateInfra、再抛一次,自检丢了末行 VERDICT;遥测失败不得影响结论与出口。
  try {
    $f = @{ event = "gate-run"; gate = $Run.Gate; verdict = $Verdict; secs = 0; ticket = $Ticket; repo = $Run.Repo }
    if ($Run.Sw) { $f.secs = [int]$Run.Sw.Elapsed.TotalSeconds }
    foreach ($k in @($Run.Fields.Keys)) { $f[$k] = $Run.Fields[$k] }
    foreach ($k in @($Run.PhaseSw.Keys)) { $f[$k] = [Math]::Round($Run.PhaseSw[$k].Elapsed.TotalSeconds, 1) }
    $ms = [ordered]@{}
    foreach ($s in @($Run.Scans)) {
      if ($s.Async -and $s.Run -and $s.Run.Done) { $ms[[string]$s.Tag] = [int]$s.Run.Ms }
      elseif ($s.ContainsKey("Ms")) { $ms[[string]$s.Tag] = [int]$s.Ms }
    }
    if ($ms.Count -gt 0) { $f.scanms = $ms }
    $fails = Get-GateRunFails $Run
    if ($fails.Count -gt 0) { $f.fails = $fails }
    foreach ($k in @($Run.Extra.Keys)) { $f[$k] = $Run.Extra[$k] }
    $runId = Get-DeliverRunId
    if ($runId) { $f.run = $runId }
    Write-Telemetry $f
  } catch {}
}

function Exit-GateInfra($Run, [string]$Tag, [string]$Reason) {
  # INFRA 出口单一收口:收齐并行道 + 遥测(secs 取 $Run.Sw 此刻读数,未起计时记 0)+ 本端 VERDICT 行 + exit 2。
  if ($null -eq $Run) { $Run = New-GateRun "?" "" }   # 上下文建好之前就出事(兜底 trap)时仍出 VERDICT 行
  try { Complete-GateAsyncRuns $Run.AsyncRuns } catch {}
  if ($Run.Sw) { $Run.Sw.Stop() }
  foreach ($k in @($Run.PhaseSw.Keys)) { $Run.PhaseSw[$k].Stop() }
  Write-GateRunTelemetry $Run ("INFRA-" + $Tag) $false
  Write-Host ("VERDICT : INFRA - " + $Reason + $Run.Suffix)
  exit 2
}

function Resolve-ScanOutcome($Run, $Scan, [int]$Rc, [string]$Threw) {
  # 一道的结局:通过即返回;违规 / 跑不起来则收齐并行道后以本端自己的 VERDICT 退出。
  # $Threw 非空 = 该道抛了未捕获异常(道自身跑不起来,不是代码违规)。各道的 Infra 文案自带收尾括号。
  if ($Threw) { Exit-GateInfra $Run $Scan.Tag ($Scan.File + " threw " + $Threw) }
  if ($Rc -eq 1) {
    $Scan.Failed = $true
    Complete-GateAsyncRuns $Run.AsyncRuns
    if ($Run.Sw) { $Run.Sw.Stop() }
    foreach ($k in @($Run.PhaseSw.Keys)) { $Run.PhaseSw[$k].Stop() }
    Write-GateRunTelemetry $Run ("FAIL-" + $Scan.Tag) $false
    Write-Host ("VERDICT : FAIL   (" + $Scan.Fail + $Run.Suffix + ")")
    exit 1
  }
  if ($Rc -eq 2) { Exit-GateInfra $Run $Scan.Tag $Scan.Infra }
  if ($Rc -ne 0) { Exit-GateInfra $Run $Scan.Tag ($Scan.File + " returned unexpected exit code " + $Rc + " (contract is 0/1/2)") }
}

function Invoke-GateScans($Run, [string]$ArgName, [string]$ArgValue) {
  # 跑 $Run.Scans(各道 Path 已由调用方核过在位与准入登记):带 Async 的道开跑即各起一个子进程,其余各道在本进程
  # 照数组顺序跑;轮到并行道时等它退出、把它的输出原样回放在该位置,故输出次序与结论优先级同数组顺序。
  # 本进程道的调用形态 = & <道> -<ArgName> <ArgValue>,取 $LASTEXITCODE;跑前清零退出码(子道若未显式 exit,
  # 不能沿用上一道残留的码),未捕获异常接住后交 Resolve-ScanOutcome 判 INFRA。各道耗时记进 Ms。
  foreach ($scan in @($Run.Scans)) {
    if (-not $scan.Async) { continue }
    try {
      $scan.Run = Start-GateAsyncScan $scan.Path $ArgName $ArgValue ($Run.WrapBase + "-" + $scan.Tag + ".ps1")
      $Run.AsyncRuns.Add($scan.Run)
    }
    catch { Exit-GateInfra $Run $scan.Tag ($scan.File + " could not be started as a child process: " + ($_.Exception.Message -replace '\s+', ' ')) }
  }
  $splat = @{ $ArgName = $ArgValue }
  foreach ($scan in @($Run.Scans)) {
    if ($scan.Async) {
      Complete-GateAsyncRun $scan.Run
      Resolve-ScanOutcome $Run $scan $scan.Run.Rc $scan.Run.Threw
      continue
    }
    $global:LASTEXITCODE = 0
    $scanRc = 0
    $scanThrew = ""
    $lane = [System.Diagnostics.Stopwatch]::StartNew()
    try { & $scan.Path @splat; $scanRc = $LASTEXITCODE }
    catch { $scanThrew = $_.Exception.GetType().Name + ": " + ($_.Exception.Message -replace '\s+', ' ') }
    $scan.Ms = [int]$lane.ElapsedMilliseconds
    Resolve-ScanOutcome $Run $scan $scanRc $scanThrew
  }
}

# ---- 本机开发服进程匹配与本机互斥锁(消费方 = 服务端重启 / 集成交付) ----
function Test-DevServerExePath([string]$ExePath, [string]$FantasyRoot) {
  # 可执行路径是否落在 <FantasyRoot>\examples 下(Get-DevServerProcs 的判据;拆出来是为了不起进程也能测)。
  if (-not $ExePath) { return $false }
  $prefix = (Join-Path $FantasyRoot "examples").TrimEnd('\') + '\'
  return $ExePath.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)
}

function Get-DevServerProcs([string]$FantasyRoot) {
  # 本仓开发服进程:按可执行路径落在 <FantasyRoot>\examples 下匹配,不按进程名单凭——别的检出起的
  # Main.exe 不在其列(那类占用由 服务端重启 的端口核对点名)。
  return @(Get-Process -Name Main -ErrorAction SilentlyContinue |
    Where-Object { Test-DevServerExePath $_.Path $FantasyRoot })
}

# 本机互斥锁(命名 Mutex,按 Kind + 根路径分):
#   deploy    — 停旧 → 构建 → 起新 → 验活 整段对同一 FantasyRoot 串行。无锁时两次交付的部署点相距不足
#               一分钟,各自的「无旧服 / 端口空闲」核对都过、先后起两个 Main.exe,后绑端口者 SocketException
#               10048 → Program.cs Exit(1),被报 INFRA 重启失败(2026-09-24 C23 pid 115868,双起实测复现);
#               停旧那步还会杀掉对方验活中的新服,构建会撞对方新服的 Bin 文件锁。
#   integrate — 集成交付 从合并中途态归属核验到推送闭环整段对同一主客户端仓串行。无锁时 A 冲突留下
#               MERGE_HEAD、B 的重入分支替 A 把合并提交掉却报自己 DELIVERED;A 的补偿撤销按 ORIG_HEAD
#               会撤掉 B 的合并(读码推得,未见实发)。部署点不在其内(另持 deploy),慢构建不拖住别人的合并。
#   锁序固定 integrate → deploy;只取 deploy 的路径(服务端重启 单独调用)从不取 integrate,无死锁。
# 命名 Mutex 而非锁文件:持有进程异常退出时 OS 放弃所有权,下一个等待者照常取得(AbandonedMutexException),
# 无残锁可清。锁名按根路径全路径折哈希,不同检出互不相干。
# 跨子进程:持锁进程把锁名写进环境变量 FLOW_<KIND>_LOCK,由它拉起的子脚本继承后不再自取——
# Mutex 归父进程所有,子进程去取只会等到超时。持有方信息落 <Root>\.gate\<kind>-lock.txt,只供等待方呈报。
$script:FlowLockLabel = @{ deploy = "部署锁"; integrate = "集成锁" }

function Get-FlowLockName([string]$Kind, [string]$Root) {
  $norm = [System.IO.Path]::GetFullPath($Root).TrimEnd('\').ToLowerInvariant()
  $sha = [System.Security.Cryptography.SHA1]::Create()
  try { $hex = (($sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($norm)) | ForEach-Object { $_.ToString("x2") }) -join "") }
  finally { $sha.Dispose() }
  return ("Global\devflow-" + $Kind + "-" + $hex.Substring(0, 16))
}

function Enter-FlowLock([string]$Kind, [string]$Root, [string]$Holder, [int]$TimeoutSec = 900) {
  # -> @{ ok; inherited; waitedSec; note; ... }。ok=$false 仅在等满 TimeoutSec 仍未取得时,note 点名持有方。
  $name = Get-FlowLockName $Kind $Root
  $envName = "FLOW_" + $Kind.ToUpperInvariant() + "_LOCK"
  $tag = $Kind.ToUpperInvariant() + "-LOCK"
  $label = $script:FlowLockLabel[$Kind]
  if (-not $label) { $label = $Kind + " 锁" }
  $info = Join-Path $Root (".gate\" + $Kind + "-lock.txt")
  if ([Environment]::GetEnvironmentVariable($envName) -eq $name) { return @{ ok = $true; inherited = $true; waitedSec = 0; note = "" } }
  $m = New-Object System.Threading.Mutex($false, $name)
  $t0 = Get-Date
  $got = $false
  try {
    $got = $m.WaitOne(0)
    if (-not $got) {
      $who = "?"
      try { if (Test-Path $info) { $who = ([string][System.IO.File]::ReadAllText($info)).Trim() } } catch {}
      Write-Host ($tag + " wait: held by " + $who + " (timeout " + $TimeoutSec + "s)")
      $got = $m.WaitOne($TimeoutSec * 1000)
    }
  } catch [System.Threading.AbandonedMutexException] { $got = $true }
  $waited = [int]((Get-Date) - $t0).TotalSeconds
  if (-not $got) {
    $who = "?"
    try { if (Test-Path $info) { $who = ([string][System.IO.File]::ReadAllText($info)).Trim() } } catch {}
    $m.Dispose()
    return @{ ok = $false; inherited = $false; waitedSec = $waited; note = ($label + "等待 " + $TimeoutSec + "s 超时,持有方:" + $who) }
  }
  [Environment]::SetEnvironmentVariable($envName, $name)
  try {
    New-Item -ItemType Directory -Force -Path (Split-Path $info -Parent) | Out-Null
    [System.IO.File]::WriteAllText($info, ("pid=" + $PID + " " + $Holder + " since=" + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")), (New-Object System.Text.UTF8Encoding($false)))
  } catch {}
  if ($waited -gt 0) { Write-Host ($tag + " acquired after " + $waited + "s") }
  return @{ ok = $true; inherited = $false; waitedSec = $waited; note = ""; mutex = $m; info = $info; envName = $envName }
}

function Exit-FlowLock($Lock) {
  # 幂等;继承来的锁不由本进程释放。持有方信息先删后放锁:放锁后下一持有方随即写入,晚删会删掉它的。
  if ($null -eq $Lock -or -not $Lock.ok -or $Lock.inherited -or $null -eq $Lock.mutex) { return }
  try { if ([System.IO.File]::Exists($Lock.info)) { [System.IO.File]::Delete($Lock.info) } } catch {}
  [Environment]::SetEnvironmentVariable($Lock.envName, $null)
  try { $Lock.mutex.ReleaseMutex() } catch {}
  $Lock.mutex.Dispose()
  $Lock.mutex = $null
}

# 部署锁的具名入口(消费方 = 服务端重启 / 集成交付 部署点与重导收尾构建;测试 L 段按此名锚定)。
# 编辑器的启动 / 停止 / 热更服务端取同一把锁,锁名与持有方记录在 C# 侧另有一份
# (Demo/Assets/Editor/Deploy/DevServerDeployLock.cs):改 Get-FlowLockName 或 <Root>\.gate 记录格式须同步。
function Get-DeployLockName([string]$FantasyRoot) { return (Get-FlowLockName "deploy" $FantasyRoot) }
function Enter-DeployLock([string]$FantasyRoot, [string]$Holder, [int]$TimeoutSec = 900) { return (Enter-FlowLock "deploy" $FantasyRoot $Holder $TimeoutSec) }
function Exit-DeployLock($Lock) { Exit-FlowLock $Lock }

# ---- 合并冲突机械分流(双仓 / 双调用点共用;裁决语义正本 = devflow 卡 references/slot-protocol.md
# 「槽位交付·冲突分流」)----
# 消费方两处:集成交付.ps1 的双仓合并阶段,与 槽位交付.ps1 的基线同步块。两处必须同口径——
# 同一类冲突在「合并进 main」与「同步基线」两个时机遇上,处置只能有一种,否则同一个冲突按遇到的
# 时机不同得到不同结局(基线同步块早期只自动处理 Luban 生成物、其余一律停机,比合并阶段弱一档,
# 于是提前遇到反而更容易被拦)。同口径由共用这一份实现保证,不靠两段平行代码。
# 生成物正则由调用方传入(校验库.ps1 Get-GenOutputRe,生成域登记在其上层),本库不反向依赖上层变量。

# OpCode 保号账本:目录 OpCode.Lock/ 下每个分配域一个 json(旧形态为单文件 OpCode.Lock.json,两种都认)。
$script:OpLockRe = 'OpCode\.Lock(/[^/]+)?\.json$'
# 二进制资产:合并冲突无法机械化解(无行级语义),一律 abort 交人裁定。
$script:BinaryAssetRe = '\.(prefab|unity|asset|mat|png|jpg|jpeg|tga|psd|fbx|anim|controller|overrideController|spriteatlas|renderTexture|cubemap|exr|wav|mp3|ogg|dll)$'

function Add-MarkerResolved([string]$Repo, $Paths) {
  # 冲突已解的机械判据:未合并文件在工作树已无冲突标记 => 会话已解决(slot-protocol「冲突分流」
  # 的代码文件路径:只改文件不跑 git),由脚本代为 git add 清 unmerged 态;仍带标记 => 未解,停等。
  $added = 0
  foreach ($p in $Paths) {
    $abs = Join-Path $Repo (([string]$p) -replace '/', '\')
    if (-not (Test-Path $abs)) { continue }
    $txt = ""
    try { $txt = [System.IO.File]::ReadAllText($abs, [System.Text.Encoding]::UTF8) } catch { continue }
    if ($txt -match '(?m)^(<{7}|={7}|>{7})') { continue }
    $r = Invoke-GitMerged $Repo ("add -- `"" + $p + "`"")
    if ($r.code -eq 0) { $added++ }
  }
  return $added
}

function Resolve-GenConflicts([string]$Repo, [string]$GenRe, $Unmerged) {
  # 生成物冲突取 ours 标记 resolved,双仓共用。无条件取 ours 的前提 = 校验库 GenDomains 不变量:冲突只出在
  # 两侧都改过的产物上,那正是合并后重导命中的条件,取到的 ours 必被重导覆盖。
  # 返回处理条数;-1 = git 执行失败(调用方按 INFRA 处置)。OpCode.Lock 账本显式排除:编号冲突必须被看见。
  $gen = @($Unmerged | Where-Object { $_ -match $GenRe -and $_ -notmatch $script:OpLockRe })
  if ($gen.Count -eq 0) { return 0 }
  foreach ($p in $gen) {
    $r1 = Invoke-GitMerged $Repo ("checkout --ours -- `"" + $p + "`"")
    $r2 = Invoke-GitMerged $Repo ("add -- `"" + $p + "`"")
    if ($r1.code -ne 0 -or $r2.code -ne 0) { return -1 }
  }
  Write-Host ("INFO 生成物冲突取 ours 标记 resolved(合并后重导覆盖为准):" + ($gen -join ", "))
  return $gen.Count
}

function Resolve-TableSourceConflicts([string]$Repo, [string]$TableRe, $Unmerged) {
  # Luban 表源(.xlsx)冲突取 ours 标记 resolved。返回处理条数;-1 = git 执行失败(调用方按 INFRA 处置)。
  #
  # **只在调用方显式声明「本轮表改动已在基线版之上重放」时启用**($TableRe 非空即为该声明)。
  # 为什么不像生成物那样恒自动:xlsx 是二进制,git 无法三方合并——只要两个分支都动过同一张表,
  # 无论 ours 是否已是 theirs 的超集都判冲突。而「重放」(git checkout <基线> -- <表> 后重做本轮
  # 编辑)恰恰使 ours 成为超集,此时取 ours 无损;没重放就取 ours 则整体丢掉基线侧的表改动,而且
  # 双端自检核不出(它只核槽位内部自洽)。两种情形在 git 层长得一模一样,机器分不出——分出来要解析
  # xlsx 逐单元格比对,而 .claude 下不引入第二种语言(rules-ondemand/script-authoring.md「语言与
  # 共享层」),故以调用方的显式声明为凭据,并把实际取 ours 的清单打出来供人核对。
  $tables = @($Unmerged | Where-Object { $_ -match $TableRe })
  if ($tables.Count -eq 0) { return 0 }
  foreach ($p in $tables) {
    $r1 = Invoke-GitMerged $Repo ("checkout --ours -- `"" + $p + "`"")
    $r2 = Invoke-GitMerged $Repo ("add -- `"" + $p + "`"")
    if ($r1.code -ne 0 -or $r2.code -ne 0) { return -1 }
  }
  Write-Host ("INFO 表源冲突按调用方声明(已重放)取 ours:" + ($tables -join ", "))
  return $tables.Count
}

function Resolve-MergeConflicts([string]$Repo, [string]$GenRe, [bool]$AllowMarkerResolve, [string]$BinaryPat, [string]$TableSourceRe = "") {
  # 双仓共用的冲突分流循环。返回 "" = 全部解决;"INFRA-RESOLVE" = git 执行失败;
  # "BINARY|<清单>"(仅当给了 $BinaryPat;Fantasy 侧传空串即无二进制分流,其仓为纯代码);
  # "CODE|<清单>" = 剩余代码冲突留会话。$AllowMarkerResolve 仅重入路径为真:新鲜冲突中
  # delete/modify 类工作树文件天然无标记,不得被「无标记=已解决」误吞。
  # $TableSourceRe 缺省空 = 不碰表源(表源冲突照常落进 CODE 清单停机);非空 = 调用方声明本轮表改动
  # 已重放,匹配到的表源取 ours(判据与理由见 Resolve-TableSourceConflicts)。
  while ($true) {
    $unmerged = Get-GitLines $Repo "-c core.quotepath=false diff --name-only --diff-filter=U"
    if ($unmerged.Count -eq 0) { return "" }
    $n = Resolve-GenConflicts $Repo $GenRe $unmerged
    if ($n -lt 0) { return "INFRA-RESOLVE" }
    if ($n -gt 0) { continue }
    if ($TableSourceRe) {
      # 位置在生成物之后、二进制之前:表源不匹配 BinaryAssetRe(.xlsx 不在其中),但若将来加进去,
      # 这个顺序保证「已声明重放」仍优先于「二进制一律停机」。
      $t = Resolve-TableSourceConflicts $Repo $TableSourceRe $unmerged
      if ($t -lt 0) { return "INFRA-RESOLVE" }
      if ($t -gt 0) { continue }
    }
    if ($BinaryPat) {
      $binary = @($unmerged | Where-Object { $_ -match $BinaryPat -and $_ -notmatch $GenRe })
      if ($binary.Count -gt 0) { return ("BINARY|" + ($binary -join ", ")) }
    }
    if ($AllowMarkerResolve -and (Add-MarkerResolved $Repo $unmerged) -gt 0) { continue }
    return ("CODE|" + ($unmerged -join ", "))
  }
}

function Invoke-MergeAbort([string]$Repo) {
  # 冲突停机前撤销合并态,回 @{ ok; note }:note 是按现场核实的一句实情,调用方原样拼进 VERDICT。
  # 消费方:槽位交付 基线同步双仓两处、集成交付 客户端二进制冲突两处。
  # 成败看现场不看退出码:MERGE_HEAD 已消失且无未合并路径才算中止;退出码 0 而合并态仍在同样判失败。
  # 此前各调用点把 abort 结果 `| Out-Null` 丢掉、VERDICT 写死「已 merge --abort」,abort 没生效时
  # VERDICT 与现场相反,会话照「已中止」去改文件重跑,落在半合并的树上(实发 2026-09-23 dev3:Fantasy
  # 基线同步冲突,VERDICT 称已 abort,槽位 Fantasy 仍有 MERGE_HEAD 与两个 UU;git 输出被丢弃,abort
  # 失败的成因未知)。失败时 note 带 git 输出末 3 行供定位。
  $r = Invoke-GitMerged $Repo "merge --abort"
  $mh = Invoke-GitMerged $Repo "rev-parse -q --verify MERGE_HEAD"
  $un = Get-GitLines $Repo "-c core.quotepath=false diff --name-only --diff-filter=U"
  if ($r.code -eq 0 -and $mh.code -ne 0 -and $un.Count -eq 0) { return @{ ok = $true; note = "已 merge --abort" } }
  $state = @()
  if ($mh.code -eq 0) { $state += "MERGE_HEAD 仍在" }
  if ($un.Count -gt 0) { $state += ("未合并路径 " + $un.Count + " 个") }
  if ($state.Count -eq 0) { $state += "合并态已不在,工作树可能只回退了一部分" }
  $tail = (@($r.lines | Where-Object { ([string]$_).Trim() } | Select-Object -Last 3) -join " | ")
  if (-not $tail) { $tail = "git 无输出" }
  return @{ ok = $false; note = ("merge --abort 未生效(退出码 " + $r.code + "," + ($state -join "、") + "):" + $tail + "。合并态留在现场,须人工 git -C `"" + $Repo + "`" merge --abort 并核实后再处置") }
}

function Get-PorcelainPaths([string[]]$Porcelain) {
  # git status --porcelain 行 -> 受影响路径(rename 两端都出,去引号)。
  $paths = New-Object System.Collections.Generic.List[string]
  foreach ($line in $Porcelain) {
    if ($null -eq $line -or $line.Length -lt 4) { continue }
    $p = $line.Substring(3)
    $m = [regex]::Match($p, '^(.*) -> (.*)$')
    if ($m.Success) { $paths.Add($m.Groups[1].Value); $paths.Add($m.Groups[2].Value) }
    else { $paths.Add($p) }
  }
  return , @($paths | ForEach-Object { $_.Trim('"') })
}

function Sort-Ordinal([string[]]$Items) {
  # Ordinal 排序(不去重)。`, $arr` 而非 $arr 是承重的:函数输出的数组在边界解包,
  # 单元素结果会退化成标量字符串,序列化后消费方(Unity 面板的 string[] 字段)把它当字符串逐字符遍历。
  $arr = @($Items)
  [Array]::Sort($arr, [System.StringComparer]::Ordinal)
  return , $arr
}

function Sort-UniqueOrdinal([string[]]$Items) {
  # Ordinal 去重 + Ordinal 排序,空串丢弃。不用 Sort-Object -Unique:后者是区域排序且
  # 大小写不敏感去重,会把仅大小写不同的条目并成一个并按区域规则重排。
  $set = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::Ordinal)
  foreach ($x in $Items) { if ($x) { [void]$set.Add([string]$x) } }
  $arr = @($set)
  [Array]::Sort($arr, [System.StringComparer]::Ordinal)
  return , $arr
}

function Get-RepoFootprint([string[]]$DiffLines, [string[]]$Dirty) {
  # 单仓改动范围:基线 diff 行(去 git 加的引号)+ dirty 路径,Ordinal 去重排序。
  # 双仓调用方(槽位领取内核)对客户端 / Fantasy 各调一次,使两处口径同源而非靠注释约定。
  $items = New-Object System.Collections.Generic.List[string]
  foreach ($x in $DiffLines) { $v = ([string]$x).Trim('"'); if ($v) { $items.Add($v) } }
  foreach ($x in (Get-PorcelainPaths $Dirty)) { if ($x) { $items.Add([string]$x) } }
  return , (Sort-UniqueOrdinal $items)
}

function Get-WorkTreeHash([string]$RepoRoot, [switch]$NoSeed) {
  # Full working-tree content hash (tracked changes + untracked non-ignored files) via a
  # throwaway index; never touches the real index. `.gate/` is force-excluded so the ticket
  # file itself can never perturb the hash it certifies (belt for slots that predate the
  # .gitignore entry). cmd /c wrappers: PS 5.1 wraps native stderr into ErrorRecords under
  # 2>$null, which throws when callers run with ErrorActionPreference=Stop.
  #
  # 临时索引以真实索引的拷贝为种子,再 `read-tree --reset HEAD` 归到 HEAD:条目集与从空索引
  # `read-tree HEAD` 起步完全相同,但内容与 HEAD 一致的条目保留 stat 缓存,`add -A` 只重读变过的文件。
  # 从空索引起步时每个条目都没有 stat,`add -A` 要把整棵工作树重读重算一遍(客户端仓 1.1 万文件,
  # 实测 7.8s 对 0.1s;一次客户端交付算三次)。拷贝用 File.Copy:它保留源文件 mtime,git 的 racy 判定
  # 以索引文件 mtime 为界,丢了它会把「索引写出同刻改过、大小没变」的文件误信为未变。
  # 与空索引起步唯一的差别:stat 判未变的文件沿用索引里的 blob,不重新过 clean 过滤——入库 blob 与
  # 行尾属性不合的文件(Get-ContentDirtyPaths 头注②)被同字节重写时,哈希会跟着变一次。
  # 种子不可用(取不到索引路径 / 拷贝撞锁 / split index 等致 read-tree 失败)即退回空索引起步;
  # -NoSeed 强制走这条退路,供测试比对两条路结果一致。
  $tmp = Join-Path $env:TEMP ("wfidx-" + [Guid]::NewGuid().ToString("N"))
  $old = $env:GIT_INDEX_FILE
  try {
    $seeded = $false
    if (-not $NoSeed) {
      try {
        # 先于改 GIT_INDEX_FILE 取路径:该变量一设,--git-path index 回的就是它。
        $real = ([string](cmd /c "git -C `"$RepoRoot`" rev-parse --git-path index 2>nul")).Trim()
        if ($real -and -not [System.IO.Path]::IsPathRooted($real)) { $real = Join-Path $RepoRoot $real }
        if ($real -and (Test-Path -LiteralPath $real)) {
          [System.IO.File]::Copy($real, $tmp, $true)
          $env:GIT_INDEX_FILE = $tmp
          cmd /c "git -C `"$RepoRoot`" read-tree --reset HEAD 2>nul" | Out-Null
          $seeded = ($LASTEXITCODE -eq 0)
        }
      } catch { $seeded = $false }
    }
    $env:GIT_INDEX_FILE = $tmp
    if (-not $seeded) {
      Remove-Item $tmp -Force -ErrorAction SilentlyContinue
      cmd /c "git -C `"$RepoRoot`" read-tree HEAD 2>nul" | Out-Null
    }
    cmd /c "git -C `"$RepoRoot`" add -A 2>nul" | Out-Null
    cmd /c "git -C `"$RepoRoot`" rm -r --cached --ignore-unmatch -q .gate 2>nul" | Out-Null
    $h = cmd /c "git -C `"$RepoRoot`" write-tree 2>nul"
    if ($h -is [System.Array]) { $h = $h[-1] }
    if ($h) { return ([string]$h).Trim() }
    return ""
  } catch { return "" }
  finally {
    if ($null -ne $old) { $env:GIT_INDEX_FILE = $old } else { Remove-Item Env:\GIT_INDEX_FILE -ErrorAction SilentlyContinue }
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  }
}

function Publish-GateTicket([string]$Root, [string]$TreeStart, [string]$GateName, [hashtable]$Extra, [hashtable]$Out = $null) {
  # 检查凭据签发的单一正本(消费方:客户端自检 / 服务端自检)。首尾双哈希核树:PASS 后树未变
  # 才签发、回 $true;树中途变(或起哈希取不到)= STALE,不发票、回 $false,调用方据此把
  # verdict 改 STALE。票的字段形态是 提交检查 与 校验库 Read-Ticket 的读取契约,两处各自构造
  # 必然漂移,故只在此构造。$Extra 收各检查自有的补充字段(slot / log 等)。
  # STALE 且首尾两棵树都取到时,先打 DRIFT 行点名变了哪些路径(两棵树 git diff --name-status 前 10 条:
  # Get-WorkTreeHash 经 write-tree 把两棵树都写进了对象库,比对零额外成本),再打 STALE 的 VERDICT 行(仍是末行)。
  # $Out(可选)收 driftPaths = 那 10 条("<状态> <路径>"),供调用方写进 gate-run 遥测。
  $treeEnd = Get-WorkTreeHash $Root
  if (-not $TreeStart -or $treeEnd -ne $TreeStart) {
    if ($TreeStart -and $treeEnd) {
      try {
        $diff = Get-GitLines $Root ("-c core.quotepath=false diff --name-status " + $TreeStart + " " + $treeEnd)
        $drift = @($diff | Select-Object -First 10 | ForEach-Object { ([string]$_) -replace "`t", " " })
        foreach ($d in $drift) { Write-Host ("DRIFT   : " + $d) }
        if ($diff.Count -gt $drift.Count) { Write-Host ("DRIFT   : ...(共 " + $diff.Count + " 条,只列前 " + $drift.Count + " 条)") }
        if ($null -ne $Out) { $Out.driftPaths = $drift }
      } catch {}
    }
    Write-Host "VERDICT : STALE  - working tree changed during the run; PASS voided, re-run the gate."
    return $false
  }
  $gateDir = Join-Path $Root ".gate"
  if (-not (Test-Path $gateDir)) { New-Item -ItemType Directory -Force -Path $gateDir | Out-Null }
  # head = 认证时刻的 HEAD sha,作「受认证工作树坐在哪个提交上」的查证锚(票本身认证树内容)
  $headSha = ""
  try { $headSha = ([string](cmd /c "git -C `"$Root`" rev-parse HEAD 2>nul")).Trim() } catch {}
  $ticket = @{ tree = $treeEnd; head = $headSha; result = "PASS"; gate = $GateName; ts = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss") }
  if ($Extra) { foreach ($k in $Extra.Keys) { $ticket[$k] = $Extra[$k] } }
  $ticket | ConvertTo-Json -Compress | Set-Content -Path (Join-Path $gateDir "ticket.json") -Encoding UTF8
  Write-Host ("TICKET  : written (" + $treeEnd.Substring(0, 12) + "...) - commit now, any edit voids it")
  return $true
}

# ── Unity YAML 节点名解码(单一正本)──────────────────────────────────────────
# Unity 把含非 ASCII 的 m_Name 写成带引号的 \uXXXX 转义串,直接比对中文字面量永远不相等、报告里也不可读。
# 消费方:安全区结构核对.ps1(按「安全区」前缀判节点)、图集子图组件核对.ps1(报告节点名)。
function ConvertFrom-YamlName([string]$raw) {
  $s = $raw.Trim()
  if ($s.Length -ge 2 -and $s.StartsWith('"', [System.StringComparison]::Ordinal) -and $s.EndsWith('"', [System.StringComparison]::Ordinal)) { $s = $s.Substring(1, $s.Length - 2) }
  if ($s.Contains('\u')) {
    $s = [regex]::Replace($s, '\\u([0-9a-fA-F]{4})', { param($m) [string][char][int]("0x" + $m.Groups[1].Value) })
  }
  return $s.Replace('\"', '"').Replace('\\', '\')
}

# ── Unity 程序集实扫(单一正本)──────────────────────────────────────────────
# 「某程序集按 Unity 划分规则该含哪些 .cs」的唯一实现。消费方:重建csproj.ps1(实现期 csproj
# 过期判定)、Editor程序集编译.ps1(客户端自检编译前的 csproj 过期判定)、命名空间扫描.ps1(owner 目录
# 与 .cs 清单)、shader取用核对.ps1(编辑器专属代码按程序集归属判定)。前两处曾各写一份并已分叉
# (一份剔 Unity 忽略目录一份不剔、按 name 定位 asmdef 的正则一宽一窄),不再各自造副本。
# 路径口径:相对 Assets、正斜杠;目录形态带尾斜杠,落 Assets 根时为空串(StartsWith("") 恒真 =
# 整棵 Assets 被覆盖,语义正确)。返回给调用方的文件路径带 "Assets/" 前缀,与 csproj <Compile> 同形。
# 工程内嵌包另取 Get-UnityEmbeddedPackageScan:底数同形,路径相对 Packages、返回前缀 "Packages/"
# (消费方:重建csproj.ps1、Editor程序集编译.ps1)。两份底数各扫各的根,互不并入;Get-UnityAsmScan 的缺省行为不含包。

function Test-UnityIgnoredPath([string]$Rel) {
  # Unity 导入时忽略的路径:任一段(目录或文件名)以 . 开头或以 ~ 结尾(如 Samples~、.hidden)。
  # 不覆盖 Unity 另两条冷门忽略规则(名为 cvs 的目录、.tmp 扩展名),.cs 实扫碰不到。
  foreach ($seg in $Rel.Split('/')) {
    if ($seg.Length -eq 0) { continue }
    if ($seg.StartsWith('.', [System.StringComparison]::Ordinal) -or $seg.EndsWith('~', [System.StringComparison]::Ordinal)) { return $true }
  }
  return $false
}

function ConvertTo-UnityRelDir([string]$AssetsNorm, [string]$FullDir) {
  $d = $FullDir.Replace('\', '/')
  if ($d.Length -le $AssetsNorm.Length) { return "" }
  return $d.Substring($AssetsNorm.Length + 1) + "/"
}

function Get-UnityAsmScan([string]$AssetsDir, [string]$Prefix = "Assets/") {
  # 一次扫盘,产出后续各函数共用的实扫底数(调用方扫一次、按程序集多次取集,不重复扫盘):
  #   Asmdefs   = @(@{ Name; RelDir; Path }),Name 取 JSON 顶层 "name" 字段(区分键名大小写;
  #               解析失败或无该字段的 asmdef 记 Name=$null——Unity 同样认不出它)
  #   OwnerDirs = asmdef / asmref 所在目录(去重),asmref 与 asmdef 同效:Unity 把 asmref 所在
  #               子树并入它引用的那个 asmdef,对「谁接管这棵子树」而言两者无差别
  #   AllCs     = Assets 下全部 .cs 相对路径
  #   Prefix    = Get-UnityAsmdefExpectSet 给返回路径加的前缀(扫描根相对工程根的形态)
  # 前三者都已剔除 Unity 忽略路径:忽略目录里的 asmdef / asmref / .cs 对 Unity 不存在。
  # -Prefix 只供 Get-UnityEmbeddedPackageScan 扫 Packages 根时换前缀,其余调用方不传。
  $assetsNorm = $AssetsDir.TrimEnd('\', '/').Replace('\', '/')
  $all = [System.IO.SearchOption]::AllDirectories
  $asmdefs = New-Object System.Collections.Generic.List[object]
  $owners = New-Object System.Collections.Generic.List[string]
  foreach ($f in [System.IO.Directory]::GetFiles($AssetsDir, "*.asmdef", $all)) {
    if ([System.IO.Path]::GetExtension($f) -ne ".asmdef") { continue }
    $relDir = ConvertTo-UnityRelDir $assetsNorm ([System.IO.Path]::GetDirectoryName($f))
    if (Test-UnityIgnoredPath $relDir) { continue }
    $name = $null
    try {
      $j = [System.IO.File]::ReadAllText($f) | ConvertFrom-Json
      # PSCustomObject 的属性访问不分大小写($j.name 会命中 "Name"),故按键名 -ceq 精确取。
      $p = @($j.PSObject.Properties | Where-Object { $_.Name -ceq "name" })
      if ($p.Count -eq 1 -and $p[0].Value -is [string]) { $name = $p[0].Value }
    } catch {}
    $asmdefs.Add([pscustomobject]@{ Name = $name; RelDir = $relDir; Path = $f })
    $owners.Add($relDir)
  }
  foreach ($f in [System.IO.Directory]::GetFiles($AssetsDir, "*.asmref", $all)) {
    if ([System.IO.Path]::GetExtension($f) -ne ".asmref") { continue }
    $relDir = ConvertTo-UnityRelDir $assetsNorm ([System.IO.Path]::GetDirectoryName($f))
    if (-not (Test-UnityIgnoredPath $relDir)) { $owners.Add($relDir) }
  }
  $cs = New-Object System.Collections.Generic.List[string]
  foreach ($f in [System.IO.Directory]::GetFiles($AssetsDir, "*.cs", $all)) {
    $rel = $f.Replace('\', '/').Substring($assetsNorm.Length + 1)
    if (-not (Test-UnityIgnoredPath $rel)) { $cs.Add($rel) }
  }
  # 去重不用 Sort-UniqueOrdinal:它丢空串,而空串 = asmdef 落 Assets 根,是合法 owner。
  $ownerSet = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::Ordinal)
  foreach ($d in $owners) { [void]$ownerSet.Add($d) }
  return @{ Asmdefs = $asmdefs.ToArray(); OwnerDirs = @($ownerSet); AllCs = $cs.ToArray(); Prefix = $Prefix }
}

function Get-UnityEmbeddedPackageScan([string]$ProjectRoot) {
  # 工程内嵌包的实扫底数,与 Get-UnityAsmScan 同形(Prefix = "Packages/",路径相对 Packages),可直接交给
  # Find-UnityAsmdefByName / Get-UnityAsmdefExpectSet。内嵌包 = <工程根>\Packages 下直接含 package.json 的
  # 一级目录:源码在仓里、随基线增删文件,csproj 的 <Compile> 按物理路径 Packages\<目录>\... 列它。
  # 不含:Library\PackageCache 的只读包、落在 Packages 目录外的 file: 包、Packages 下没有 package.json 的目录
  # (Unity 不认它是包)。没有 Packages 目录或没有内嵌包时回空底数。包里没有 predefined 程序集(不落 asmdef
  # 的 .cs Unity 不编),故这份底数不交给 Get-UnityPredefinedEditorSet。
  $prefix = "Packages/"
  $empty = @{ Asmdefs = @(); OwnerDirs = @(); AllCs = @(); Prefix = $prefix }
  $pk = Join-Path $ProjectRoot.TrimEnd('\', '/') "Packages"
  if (-not (Test-Path -LiteralPath $pk)) { return $empty }
  $roots = @([System.IO.Directory]::GetDirectories($pk) |
             Where-Object { Test-Path -LiteralPath (Join-Path $_ "package.json") } |
             ForEach-Object { [System.IO.Path]::GetFileName($_) + "/" })
  if ($roots.Count -eq 0) { return $empty }
  $scan = Get-UnityAsmScan $pk $prefix
  $inPkg = { param([string]$Rel) foreach ($r in $roots) { if ($Rel.StartsWith($r, [System.StringComparison]::Ordinal)) { return $true } }; return $false }
  return @{
    Asmdefs   = @($scan.Asmdefs | Where-Object { & $inPkg $_.RelDir })
    OwnerDirs = @($scan.OwnerDirs | Where-Object { & $inPkg $_ })
    AllCs     = @($scan.AllCs | Where-Object { & $inPkg $_ })
    Prefix    = $prefix
  }
}

function Find-UnityAsmdefByName($Scan, [string]$Name) {
  # 按 asmdef 的 JSON 顶层 "name" 字段精确匹配,区分大小写:Unity 按该字符串原样解析程序集
  # 引用与命名 csproj,大小写不同即是另一个程序集。返回全部命中(调用方判 0 / 多个)。
  return , @($Scan.Asmdefs | Where-Object { $_.Name -ceq $Name })
}

function Get-UnityAsmdefExpectSet($Scan, [string]$BaseRel) {
  # asmdef 程序集应含的 .cs:BaseRel(该 asmdef 目录)子树下全部 .cs,减去更深的 asmdef /
  # asmref 子树(更深的那个接管其子树)。子树内的 Editor 目录仍归该 asmdef(Unity asmdef 语义)。
  $deeper = @($Scan.OwnerDirs | Where-Object {
      $_ -ne $BaseRel -and $_.Length -gt $BaseRel.Length -and $_.StartsWith($BaseRel, [System.StringComparison]::Ordinal) })
  $out = New-Object System.Collections.Generic.List[string]
  foreach ($rel in $Scan.AllCs) {
    if (-not $rel.StartsWith($BaseRel, [System.StringComparison]::Ordinal)) { continue }
    $taken = $false
    foreach ($d in $deeper) { if ($rel.StartsWith($d, [System.StringComparison]::Ordinal)) { $taken = $true; break } }
    if (-not $taken) { $out.Add($Scan.Prefix + $rel) }
  }
  return , $out.ToArray()
}

function Read-UnityGlobalDefines([string]$Root) {
  # ProjectSettings 的 scriptingDefineSymbols,按平台组(Standalone / Android / iPhone / WebGL ...)成表。
  # 消费方:重建csproj.ps1(宏过期判定)、Editor程序集编译.ps1(出包平台 define 替换)。
  # 文件缺失回空表,由调用方决定算不算 INFRA;平台组缺席 = 该组无自定义宏。
  $map = @{}
  $p = Join-Path $Root "ProjectSettings\ProjectSettings.asset"
  if (-not (Test-Path -LiteralPath $p)) { return $map }
  $in = $false
  foreach ($line in [System.IO.File]::ReadAllLines($p)) {
    if (-not $in) { if ($line -match '^\s*scriptingDefineSymbols:\s*$') { $in = $true }; continue }
    $m = [regex]::Match($line, '^\s{4}([^:]+):\s*(.*)$')
    if (-not $m.Success) { break }
    $map[$m.Groups[1].Value.Trim()] = @($m.Groups[2].Value -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  }
  return $map
}

function Get-UnityPredefinedEditorSet($Scan, [switch]$FirstPass) {
  # predefined Editor 程序集应含的 .cs:路径含名为 Editor 的目录段、且不落任何 asmdef / asmref
  # 子树。按 Unity 规则再分两份:顶层 Plugins / Standard Assets / Pro Standard Assets 下的归
  # Assembly-CSharp-Editor-firstpass(给 -FirstPass 取这份),其余归 Assembly-CSharp-Editor。
  # 目录名判定区分大小写:Unity 只认恰好叫 Editor 的目录。
  $out = New-Object System.Collections.Generic.List[string]
  foreach ($rel in $Scan.AllCs) {
    if (-not (("/" + $rel) -cmatch "/Editor/")) { continue }
    $covered = $false
    foreach ($d in $Scan.OwnerDirs) { if ($rel.StartsWith($d, [System.StringComparison]::Ordinal)) { $covered = $true; break } }
    if ($covered) { continue }
    $isFirstPass = $rel.StartsWith("Plugins/", [System.StringComparison]::Ordinal) -or
                   $rel.StartsWith("Standard Assets/", [System.StringComparison]::Ordinal) -or
                   $rel.StartsWith("Pro Standard Assets/", [System.StringComparison]::Ordinal)
    if ($isFirstPass -eq [bool]$FirstPass) { $out.Add("Assets/" + $rel) }
  }
  return , $out.ToArray()
}

# ── C# 源码去噪(单一正本)──────────────────────────────────────────────────
# 消费方:shader取用核对.ps1、功能开关同步核对.ps1、校验库.ps1 Get-RuleReadTableGap(注释 / 字面量里提到的名字不算代码引用)。
# 把 // 行注释、/* */ 块注释、字符串("..."、@"..."、$"..."、$@"...")与字符字面量的每个非换行字符
# 换成空格,只留代码(行号不变)。单遍正则自左向右、谁先起头谁生效,故字符串里的 // 不被当注释、
# 注释里的引号也开不出字符串。已知局限:内插字符串 {…} 洞里的代码随字符串一并抹掉(漏报方向);
# C# 11 原始字符串不识别。
$script:CsNoiseRe = [regex]::new('//[^\r\n]*|/\*[\s\S]*?(?:\*/|$)|(?:@\$?|\$@)"(?:[^"]|"")*"?|\$?"(?:[^"\\\r\n]|\\.)*"?|''(?:[^''\\\r\n]|\\.)*''?')
function ConvertTo-CsCodeOnly([string]$Text) {
  return $script:CsNoiseRe.Replace($Text, { param($m) [regex]::Replace($m.Value, '[^\r\n]', ' ') })
}
