# 占用面板.ps1 — devflow 工作面只读占用面板。
# 一次快照(占用真值在 git,不写任何地方):
#   - 固定槽位池(<SlotDirPrefix>1..SlotCount,来自 flow-config.psd1):
#     客户端 worktree(对 ClientBaseline)+ Fantasy worktree(对 FantasyBaseline)——ahead 提交、
#     dirty 文件;空闲判据见 Test-SlotIdle(与 槽位领取内核 同口径:领先提交或 tracked 改动即占用)。
#   - board 拼接:每槽位带其任务看板行(topic/stage,见 看板.ps1);失配标注——git IDLE+board 行
#     ="board:STALE",git 占用+无行="board:未登记"。冲突以 git 为准,看板仅参考。
#   - session 拼接:每占用槽位带其桌面端会话(会话名现读双 store:Claude 仓
#     %APPDATA%\Claude\claude-code-sessions + DSH 仓 %USERPROFILE%\.dsh\sessions)
#     ——用途是「看到槽位被占,知道该切回哪个会话窗口」;名字可被用户改故不快照,读不到回落短 id。
#     id 两源:board.json 的 sessionId 优先(续接后即时刷新、准),看板行丢失时回落 claim 提交的
#     Session-Id trailer(与占用真值同处 git、不会丢,但是领取时那个会话,续接后可能过时,标 [git])。
# 输出:
#   默认   :人读文本;-Files 附每仓文件范围(领用时的重叠比对由 槽位领取 内置,此处供人工排查)
#   -Json  :机器快照到 stdout(总含改动范围)——渲染层的单一推导源(现唯一渲染层 =
#           Unity 编辑器窗口 Assets/Editor/DevFlow/DevFlowDashboardWindow.cs);warnings 在 json 内;
#           watch = 渲染层挂文件监听的点(看板 + 各仓分支 ref),状态跃迁时据此自动重拉
# 退出码:0;2 配置加载失败。
[CmdletBinding(PositionalBinding=$false)]
param(
  [string[]]$Slots,
  [switch]$Files,
  [switch]$Json
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

function Get-Stamp { return (Get-Date -Format "yyyy-MM-ddTHH:mm:ss") }

function Get-BoardRow($Row) {
  return [ordered]@{
    stage     = [string]$Row.stage
    topic     = [string]$Row.topic
    note      = [string]$Row.note
    updatedAt = [string]$Row.updatedAt
  }
}

$script:StoreIndex = $null
function Get-StoreIndex {
  # 桌面端会话 store 双仓索引(会话 id -> 条目),整脚本只扫一次供各槽位复用。
  # Claude 仓:%APPDATA%\Claude\claude-code-sessions,文件 local_*.json 明文,含 title/lastActivityAt;
  #   根下有两层 uuid 目录(账号/工作区),含义不明且未来可能变,故不写死路径,按文件名递归定位。
  # DSH 仓:%USERPROFILE%\.dsh\sessions\<项目目录>\<sessionId>\session.jsonl.zstd,zstd 压缩
  #   (标题不可直读,降级只显短 id + 活跃时间=文件 mtime);sessionId = 会话目录名。
  if ($null -ne $script:StoreIndex) { return $script:StoreIndex }
  $idx = @{}
  # Claude 仓两条根并扫,缺一则会话名在半数调用方恒空:
  #   ①%APPDATA%\Claude\claude-code-sessions —— 桌面端是 MSIX 打包应用,这条是**包容器内**才看得见的
  #     虚拟视图(Claude Code 的 shell 在容器内,故手跑脚本一切正常);
  #   ②%LOCALAPPDATA%\Packages\Claude_*\LocalCache\Roaming\Claude\claude-code-sessions —— 同一批文件的
  #     物理真身,容器内外都看得见。Unity 槽位面板由编辑器进程调本脚本,那是**容器外**:①整条路径连
  #     Test-Path 都是 False(不是权限问题,是重定向),只留①的话面板的会话名/活跃时间恒空、只剩短 id。
  #   包目录枚举单源于 hook函数库 Get-ClaudePackageDirs。两根命中同一 id 时后者覆盖,指向同一物理文件,无差别。
  #   (看板走另一条:hook函数库 Resolve-WfStatePath 直接解析出唯一物理路径,不双根并扫——它有写方。)
  $roots = @(Join-Path $env:APPDATA "Claude\claude-code-sessions")
  foreach ($pkg in (Get-ClaudePackageDirs)) {
    $roots += (Join-Path $pkg "LocalCache\Roaming\Claude\claude-code-sessions")
  }
  foreach ($root in $roots) {
    if (-not (Test-Path $root)) { continue }
    foreach ($f in (Get-ChildItem -Path $root -Filter "local_*.json" -File -Recurse -ErrorAction SilentlyContinue)) {
      $idx[$f.BaseName] = @{ kind = "claude"; path = $f.FullName; mtime = $f.LastWriteTime }
    }
  }
  $dshRoot = Join-Path $env:USERPROFILE ".dsh\sessions"
  if (Test-Path $dshRoot) {
    foreach ($d in (Get-ChildItem -Path $dshRoot -Directory -Recurse -ErrorAction SilentlyContinue)) {
      $file = Join-Path $d.FullName "session.jsonl.zstd"
      if (Test-Path $file) {
        $idx[$d.Name] = @{ kind = "dsh"; path = $d.FullName; mtime = (Get-Item $file).LastWriteTime }
      }
    }
  }
  $script:StoreIndex = $idx
  return $idx
}

function Get-RelativeTime([datetime]$When) {
  $span = (Get-Date) - $When
  if ($span.TotalMinutes -lt 1)  { return "刚刚" }
  if ($span.TotalMinutes -lt 60) { return ([int]$span.TotalMinutes).ToString() + " 分钟前" }
  if ($span.TotalHours -lt 24)   { return ([int]$span.TotalHours).ToString() + " 小时前" }
  return ([int]$span.TotalDays).ToString() + " 天前"
}

function Get-SessionShortId([string]$SessionId) {
  # 两种 id 形态都剥前缀取 8 位:Claude 仓 local_<uuid>、DSH 仓 session-<uuid>;无前缀按原样截。
  $short = ($SessionId -replace '^(local_|session-)', '')
  if ($short.Length -gt 8) { $short = $short.Substring(0, 8) }
  return $short
}

function Get-SessionInfo([string]$SessionId, [string]$Source) {
  # 槽位 -> 桌面端会话(用途:看到槽位被占,知道该切回哪个会话窗口)。
  # id 两源(取用优先级见调用处):board.json 的 sessionId(领取/续接时由 看板.ps1 写)、
  #   claim 提交的 Session-Id trailer(领取时由 槽位领取内核 写,看板行丢失时兜底)。
  # title 现读 store,不快照 —— 会话名可被用户随时改(titleSource auto/user),快照必然过期。
  # store 不可达(非桌面端环境 / 会话已删)时 title 留空,渲染侧回落只显短 id。
  # 「窗口是否还开着」store 里没有字段可判(无 isRunning),故只给最后活动时间,不做已关判定。
  # Claude 仓给 title + lastActivityAt(明文 JSON);DSH 仓 zstd 压缩标题不可直读,降级:
  #   活跃时间取 session.jsonl.zstd 的 mtime,标题留空(用户已裁定,不引解压依赖)。
  if (-not $SessionId) { return $null }
  # 键名 shortId 而非 short:short 是 C# 关键字,渲染层(Unity 面板)的字段须与 json 键逐字同名
  $info = [ordered]@{ id = $SessionId; shortId = (Get-SessionShortId $SessionId); title = ""
                      lastActivityAt = ""; lastActivity = ""; source = $Source }
  $entry = (Get-StoreIndex)[$SessionId]
  if (-not $entry) { return $info }
  if ($entry.kind -eq "claude") {
    try { $o = [System.IO.File]::ReadAllText($entry.path) | ConvertFrom-Json } catch { return $info }
    $info.title = [string]$o.title
    if ($o.lastActivityAt) {
      # store 存 epoch 毫秒;转本地时间后同时给机器可读(ISO)与人读(相对)两种形态,
      # 渲染层(Unity 面板)只取人读那个,维持其零推导。
      $dt = [DateTimeOffset]::FromUnixTimeMilliseconds([long]$o.lastActivityAt).ToLocalTime()
      $info.lastActivityAt = $dt.ToString("yyyy-MM-ddTHH:mm:ss")
      $info.lastActivity = Get-RelativeTime $dt.DateTime
    }
  } else {
    # DSH 仓:标题不可直读,活跃时间取文件 mtime(写盘即活跃),形态与 Claude 仓一致
    $info.lastActivityAt = $entry.mtime.ToString("yyyy-MM-ddTHH:mm:ss")
    $info.lastActivity = Get-RelativeTime $entry.mtime
  }
  return $info
}

function Get-SessionDisplay($Info) {
  # 显示形态:名字 + 8 位短 id(名字给人认、id 是硬标识且不唯一名字会撞);读不到名字回落只显 id。
  # 兜底源(git)加 [git] 标注:那是**领取时**的会话,跨会话续接后会过时,不与看板源混同。
  if ($null -eq $Info) { return "" }
  $s = if ($Info.title) { $Info.title + " (" + $Info.shortId + ")" } else { $Info.shortId }
  if ($Info.lastActivity) { $s += " · " + $Info.lastActivity }
  if ($Info.source -eq "git") { $s += " [git]" }
  return $s
}

function Get-ClaimInfo([string]$Slot, [string]$Baseline, [string]$Branch) {
  # 最早 claim 占位提交的 body 拆解 -> @{ brief = 第一步简报; sessionId = 领取时的会话身份 }。
  # 两者同出一条提交,一次 git 调用取回;拆解(剥 Session-Id trailer)单源于 hook函数库 Split-ClaimBody。
  # subject 恒 `claim: …`;非 claim 或无 body 两项均空。
  $empty = @{ brief = ""; sessionId = "" }
  $hashes = Get-GitLines $Slot "log --format=%H $Baseline..$Branch"
  if ($hashes.Count -eq 0) { return $empty }
  $oldest = ([string]$hashes[$hashes.Count - 1]).Trim()   # log 最新在前,最末为最早的 claim 占位
  $subj = Get-GitOne $Slot "log -1 --format=%s $oldest"
  if (-not $subj.StartsWith("claim:", [System.StringComparison]::Ordinal)) { return $empty }
  return (Split-ClaimBody (((Get-GitLinesRaw $Slot "log -1 --format=%b $oldest") -join "`n")))
}

function Get-NextAction([object]$BoardRow, [bool]$Idle) {
  # 续接指引(机器可判的三分支;详版处置正本 = slot-protocol「跨会话续接」与 devflow 卡「停机呈报」)
  if ($Idle) { return "" }
  $stage = ""
  if ($BoardRow) { $stage = [string]$BoardRow.stage }
  if ($stage -match '^阻塞:') { return "呈报用户等指示(原因见 stage);解卡后 看板.ps1 改回 实现中" }
  if ($stage -eq "交付中") { return "勿动:集成状态机在途,结果以 槽位交付 VERDICT 为准" }
  return "续接:读 claim 简报 + ahead 提交(进度真值),按 devflow 卡第二步调对应实现段卡继续;新决策落 commit message"
}

try { $cfg = Get-FlowConfig }
catch {
  Write-Host "ABORT: flow-config.psd1 load failed - fix it (语法自检.ps1 covers psd1) and rerun"
  exit 2
}

# Where-Object 过滤是必需的:未传 -Slots 时 $Slots 是 $null,而 @($null).Count 为 1(单个 null 元素),
# 直接 @($Slots) 会跳过默认池构建、再对 null 调方法。
$slotList = @($Slots | Where-Object { $_ })
if ($slotList.Count -eq 0) {
  $slotList = @(1..([int]$cfg.SlotCount) | ForEach-Object { Join-Path $cfg.SlotBaseDir ($cfg.SlotDirPrefix + $_) })
}
$baseC = $cfg.ClientBaseline
$baseF = $cfg.FantasyBaseline
$warnings = New-Object System.Collections.Generic.List[string]

$board = $null
$boardPath = Get-BoardPath
if (Test-Path $boardPath) {
  try {
    $obj = [System.IO.File]::ReadAllText($boardPath) | ConvertFrom-Json
    if ($obj -is [System.Management.Automation.PSCustomObject]) { $board = $obj }
  } catch {
    $warnings.Add("board.json unreadable - continuing git-only")
  }
}
function Test-BoardKey([string]$Key) {
  if ($null -eq $board) { return $false }
  return [bool]($board.PSObject.Properties.Name -contains $Key)
}
$seenKeys = New-Object System.Collections.Generic.List[string]

# 变更监听点:渲染层据此挂文件监听、事件驱动重拉快照,路径推导只在本脚本一处(看板物理路径须经
# Resolve-WfStatePath,渲染层自算会重演容器内外分裂)。只收低频且标志状态跃迁的点——看板写行
# (领取/阶段切换)、分支 ref 移动(槽位提交/交付合并);工作树 dirty 随每次编辑变,不收,否则刷新不停。
# git 目录取自槽位本身(worktree 的 common dir),不取配置仓根:-Slots 显式传池时两者可以不同。
$gitDirs = New-Object System.Collections.Generic.List[string]
function Add-GitWatchDir([string]$Root) {
  $d = Get-GitOne $Root "rev-parse --path-format=absolute --git-common-dir"
  if (-not $d) { return }
  $d = [System.IO.Path]::GetFullPath($d)
  if (-not $gitDirs.Contains($d)) { $gitDirs.Add($d) }
}

$slotObjs = New-Object System.Collections.Generic.List[object]
foreach ($slot in $slotList) {
  $name = Split-Path ($slot.TrimEnd('\', '/')) -Leaf
  if (-not (Test-Path $slot)) {
    $slotObjs.Add([ordered]@{ name = $name; path = $slot; absent = $true })
    continue
  }
  $bRow = $null
  $mk = [regex]::Match($name, 'dev(\d+)$')
  $bKey = if ($mk.Success) { "dev" + $mk.Groups[1].Value } else { $null }
  if ($bKey -and (Test-BoardKey $bKey)) { $bRow = $board.$bKey; $seenKeys.Add($bKey) }

  if ($Json) { Add-GitWatchDir $slot }
  $branch = Get-GitOne $slot "branch --show-current"
  $ahead =Get-GitLines $slot "log --oneline $baseC..$branch"
  # -uall:porcelain 缺省把整棵未跟踪新目录折叠成一条目录条目(?? Configs/),footprint 输出
  # (-Files/-Json)吃这份清单,须逐文件列出(口径同 槽位交付 Get-ChangedPaths);dirty 计数随之按文件计。
  $dirty = Get-GitLines $slot "status --porcelain -uall"
  # ServerDirName 留空 = 无服务端仓;此时不能拼路径(Join-Path 空串即槽位本身,会把客户端当服务端再数一遍)。
  $fx = if ($cfg.ServerDirName) { Join-Path $slot $cfg.ServerDirName } else { "" }
  $fxBranch = ""; $fxAhead = @(); $fxDirty = @()
  if ($fx -and (Test-Path (Join-Path $fx ".git"))) {
    if ($Json) { Add-GitWatchDir $fx }
    $fxBranch =Get-GitOne $fx "branch --show-current"
    $fxAhead = Get-GitLines $fx "log --oneline $baseF..$fxBranch"
    $fxDirty = Get-GitLines $fx "status --porcelain -uall"
  }
  $idle = Test-SlotIdle $ahead $dirty $fxAhead $fxDirty
  $boardFlag = $null
  if ($bRow) { $boardFlag = if ($idle) { "stale" } else { "ok" } }
  elseif (-not $idle) { $boardFlag = "unregistered" }

  $lastClient = ""; $lastFantasy = ""
  if ($ahead.Count -gt 0)   { $lastClient  = Get-GitOne $slot "log -1 --format=""%h %s (%cr)"" $branch" }
  if ($fxAhead.Count -gt 0) { $lastFantasy = Get-GitOne $fx  "log -1 --format=""%h %s (%cr)"" $fxBranch" }

  $foot = $null
  if ((-not $idle) -and ($Files -or $Json)) {
    $cDiff = Get-GitLines $slot "diff $baseC...HEAD --name-only"
    $fDiff = if ($fxBranch) { Get-GitLines $fx "diff $baseF...HEAD --name-only" } else { @() }
    $foot = [ordered]@{ client = (Get-RepoFootprint $cDiff $dirty); fantasy = (Get-RepoFootprint $fDiff $fxDirty) }
  }
  # session 与 board 并列而非塞进 board:board 是 board.json 的镜像,而 title/lastActivity
  # 来自另一个数据源(桌面端 store),混居会让人以为名字也存在 board.json 里。
  #
  # id 两源,看板优先、git 兜底:
  #   看板行(board.json)—— 每次写行按当前环境变量刷新,故跨会话续接后是**当前**接手的会话,准;
  #   claim 提交 trailer —— 领取时那个会话,续接后会过时,但与占用真值同处 git,看板丢行也在。
  # 故仅在看板取不到时回落 git:准确性优先,可得性兜底(两者都无 -> 与改造前同,不显示会话行)。
  # 来源经 source 字段透出,渲染层可据其标注(Unity 面板与 PS 文本形态都标 [git])。
  $claimInfo = if (-not $idle) { Get-ClaimInfo $slot $baseC $branch } else { @{ brief = ""; sessionId = "" } }
  $sessId = if ($bRow) { [string]$bRow.sessionId } else { "" }
  $sessSource = if ($sessId) { "board" } else { "git" }
  if (-not $sessId) { $sessId = [string]$claimInfo.sessionId }
  $sessInfo = if (-not $idle) { Get-SessionInfo $sessId $sessSource } else { $null }
  $slotObjs.Add([ordered]@{
    name = $name; path = $slot; absent = $false; idle = $idle
    client  = [ordered]@{ branch = $branch;   ahead = $ahead.Count;   dirty = $dirty.Count }
    fantasy = [ordered]@{ branch = $fxBranch; ahead = $fxAhead.Count; dirty = $fxDirty.Count }
    lastClient = $lastClient; lastFantasy = $lastFantasy
    board = if ($bRow) { Get-BoardRow $bRow } else { $null }
    session = $sessInfo
    boardFlag = $boardFlag; footprint = $foot
    claimBrief = [string]$claimInfo.brief
    next = Get-NextAction $bRow $idle
  })
}

$extraBoard = New-Object System.Collections.Generic.List[object]
if ($null -ne $board) {
  # 显式排 null:空 PSCustomObject 的 Properties.Name 为 $null,而 $null 经管道进
  # Where-Object 会被原样传出(条件对 $null 成立),导致多出一个空的 extraBoard 行。
  $allKeys = @($board.PSObject.Properties.Name | Where-Object { $null -ne $_ -and ($seenKeys -notcontains $_) })
  foreach ($k in (Sort-Ordinal $allKeys)) {
    $r = [ordered]@{ key = $k }
    foreach ($kv in (Get-BoardRow $board.$k).GetEnumerator()) { $r[$kv.Key] = $kv.Value }
    $extraBoard.Add($r)
  }
}

if ($Json) {
  # 用 .ToArray() 而非 @($list):当 List 的元素是 OrderedDictionary 时,PS 5.1 的数组子表达式
  # @() 会抛 "Argument types do not match";ToArray() 直接给 Object[],序列化形态(空 -> [])不变。
  # watch 每项 = 一个监听点:dir 下名字匹配 filter 的文件有写入/改名即视为状态可能变了。
  # filter 带尾 *:看板与 packed-refs 都是先写临时件再改名覆盖,临时件名以正式名为前缀。
  # dir 不存在(看板从未写过)照样列出,由渲染层跳过。
  $watch = New-Object System.Collections.Generic.List[object]
  $watch.Add([ordered]@{ dir = (Split-Path $boardPath -Parent); filter = ((Split-Path $boardPath -Leaf) + "*"); recursive = $false })
  foreach ($d in $gitDirs) {
    $watch.Add([ordered]@{ dir = (Join-Path $d "refs\heads"); filter = "*"; recursive = $true })
    $watch.Add([ordered]@{ dir = $d; filter = "packed-refs*"; recursive = $false })
  }
  $snapshot = [ordered]@{
    generatedAt = (Get-Stamp)
    warnings = $warnings.ToArray()
    slots = $slotObjs.ToArray()
    extraBoard = $extraBoard.ToArray()
    watch = $watch.ToArray()
  }
  # 直写 Console 而非 Write-Host:绕开 host 层的编码转换。stdout 编码单源在 hooks\hook函数库.ps1
  # (点源即钉 UTF-8),消费方 = Unity 面板 DevFlowDashboardWindow,按 UTF8Encoding 解码本输出。
  [Console]::Out.WriteLine(($snapshot | ConvertTo-Json -Depth 12))
  [Console]::Out.Flush()
  exit 0
}

# ---- text ----
foreach ($w in $warnings) { Write-Host "WARN: $w" }
Write-Host "== SLOTS =="
foreach ($s in $slotObjs) {
  if ($s.absent) { Write-Host ("{0,-22} (absent)" -f $s.name); continue }
  if ($s.idle) {
    $bNote = ""
    if ($s.board) { $bNote = " | board:STALE(" + $s.board.stage + " " + $s.board.topic + ",行未清,git 为准)" }
    Write-Host ("{0,-22} IDLE     (client:{1} fantasy:{2}){3}" -f $s.name, $s.client.branch, $s.fantasy.branch, $bNote)
  } else {
    $bNote = " | board:未登记"
    if ($s.board) { $bNote = " | board:" + $s.board.stage + " " + $s.board.topic + " @" + $s.board.updatedAt }
    Write-Host ("{0,-22} OCCUPIED client({1}) ahead={2} dirty={3} | fantasy({4}) ahead={5} dirty={6}{7}" -f `
      $s.name, $s.client.branch, $s.client.ahead, $s.client.dirty, $s.fantasy.branch, $s.fantasy.ahead, $s.fantasy.dirty, $bNote)
    if ($s.lastClient)  { Write-Host ("{0,-22}   client last: {1}" -f "", $s.lastClient) }
    if ($s.lastFantasy) { Write-Host ("{0,-22}   fantasy last: {1}" -f "", $s.lastFantasy) }
    $sd = Get-SessionDisplay $s.session
    if ($sd) { Write-Host ("{0,-22}   session: {1}" -f "", $sd) }
    if ($s.claimBrief) {
      $bl = @($s.claimBrief -split "`n")
      Write-Host ("{0,-22}   claim 简报(续接源):" -f "")
      foreach ($x in ($bl | Select-Object -First 8)) { Write-Host ("{0,-22}     {1}" -f "", $x) }
      if ($bl.Count -gt 8) { Write-Host ("{0,-22}     (+{1} 行,git log --format=%B 看全)" -f "", ($bl.Count - 8)) }
    }
    if ($s.next) { Write-Host ("{0,-22}   next: {1}" -f "", $s.next) }
    if ($Files -and $s.footprint) {
      foreach ($k in @("client", "fantasy")) {
        $lst = @($s.footprint[$k])
        if ($lst.Count -eq 0) { continue }
        Write-Host ("{0,-22}   {1} footprint ({2}):" -f "", $k, $lst.Count)
        foreach ($x in ($lst | Select-Object -First 60)) { Write-Host ("{0,-22}     {1}" -f "", $x) }
        if ($lst.Count -gt 60) { Write-Host ("{0,-22}     (+{1} more)" -f "", ($lst.Count - 60)) }
      }
    }
  }
}
if ($extraBoard.Count -gt 0) {
  Write-Host "== BOARD (rows without a listed slot) =="
  foreach ($r in $extraBoard) {
    Write-Host ("{0,-22} {1} {2}  ({3})" -f $r.key, $r.stage, $r.topic, $r.updatedAt)
  }
}
exit 0
