# 槽位领取内核.ps1 — 固定槽位池的 git 领用内核。Agent 入口是同目录 槽位领取.ps1;
# 本脚本只承载 git / 看板机械步骤,Unity 与 UnityMCP 就绪由外层入口负责。
#
# 首行判定(四选一):
#   ACQUIRED <N> <槽位根> <槽位Fantasy根>   领用成功(退出码 0)
#   QUEUE dev<N> <topic>                    范围重叠 -> 排该槽位队尾串行接做(退出码 3)
#   FULL <占用摘要>                          固定池各槽均占用(退出码 4)
#   ABORT <原因>                            同主题已占槽 / 钉住槽被占 / 对齐失败 / 竞态耗尽等(退出码 1)
# 收槽模式首行:-Release 回 RELEASED(退 0)/ABORT(退 1);-Abandon 回 ABANDONED(退 0,附 INFO dropped 逐条)/ABORT(退 1)。
# 明细行:INFO/CLEANED/WARN(WARN = 不阻断领用但会话须知,外层入口成功路径也透传)。
# 护栏遥测:三处「没做成、降级继续」的 WARN 另经 hook函数库 Write-Degraded 记 event=degraded,同一步走到且没降级记
#   guard-ok(检查命中面板「疑似恒降级」按护栏算占比),走不到该步两样都不记:
#   slot-state-query/dev<N>  槽位现场查询(Get-SlotState)失败按不可用槽处置;目录或 Fantasy worktree 缺失直接判 broken,不算走到;
#   luban-junction/dev<N>    领用后 Tools\Luban junction 复核重建失败;主仓侧目标缺失(skipped)不算走到。WARN 行照旧排在首行判定之后;
#   abandon-merge-abort      -Abandon 撤残留合并态没生效(随后 reset --hard 照做);没有 MERGE_HEAD 不算走到。
#
# 机械判据(脚本内机械执行,不留会话判断;正本 = devflow 卡 references/slot-protocol.md):
#   陈旧占位清理三条件:客户端恰领先 1 条 ^claim: 空提交(tree==父tree)、Fantasy 无领先、
#   占位龄 > flow-config StaleClaimHours —— 全中才 reset 清理;任一不中按占用对待
#   (判据外状态不代为裁决)。三条件全中但双仓有 tracked 未提交改动(Test-SlotIdle 同口径)
#   -> 不 reset,跳过该槽并出 WARN 点名(自动清理不代丢改动)。
#   两种主动收槽:-Release = 就绪失败事务回滚,只收「恰 1 条空 claim」形态,形状不符即拒;
#   -Abandon = 显式放弃,丢弃双仓全部领先提交与 tracked 改动(经用户授权才调,入口 槽位领取.ps1 -Abandon)。
#   空闲判据(Test-SlotIdle,与 占用面板 同口径):双仓无领先提交且无 tracked 未提交改动——
#   tracked 改动会被领用的 reset --hard 抹掉,故算占用;untracked 不受 reset 影响,不参与判定。
#   占有原子化:判空闲前记分支尖,占位提交经 commit-tree 造好后以 update-ref CAS 争用分支 ref,
#   成功者才 reset;失败者判被抢换槽,不碰该槽(竞态详见 Invoke-Claim 注释)。
#   同主题拦截:池内任一占用槽的最早提交 subject == `claim: <topic>` -> ABORT duplicate-claim,先于重叠比对。
#   重叠比对:入参前缀 vs 占用槽双仓改动范围(基线三点 diff + dirty),目录边界双向前缀匹配。
#   槽位池固定为 flow-config SlotCount,不扫描、不扩容。
# 退出码:0 / 1 / 2(参数或配置错)/ 3 / 4。
#
# 行为契约由 tests\槽位领取内核CLI测试.ps1 锚定(CLI 层黑盒断言,不依赖内部实现形态)。
# 提交信息一律走文件(-F):简报是多行含中文文本,穿命令行必出事故(shell-conventions·文本走文件)。
# 树比对用 `log -1 --format=%T`,不用 `<sha>^{tree}`——`^` 是 cmd 的转义字符,经 cmd /c 会被吃掉。
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Topic,                    # ASCII 兼容入口
  [string]$TopicFile,                # UTF-8 主题文件(外层入口使用)
  [string]$BriefFile,                # UTF-8 简报文件(可选;写入 claim 提交 body 作持久续接源)
  [string[]]$Paths = @(),            # 客户端仓改动范围前缀(含 Demo/ 前缀);多条只在 PS 表达式调用下可用
  [string[]]$FantasyPaths = @(),     # Fantasy 仓改动范围前缀(以其仓根为基);同上
  [string]$PathsFile,                # UTF-8 清单文件(每行一条),客户端仓;经 -File 起子进程时的唯一可靠通道
  [string]$FantasyPathsFile,         # 同上,Fantasy 仓
  [string]$Slot,                     # 钉住指定槽位(排队后同槽位接做)
  [switch]$PreferNoUnity,            # 免 Unity 任务:候选槽全池反序扫(N..1),不受 NormalSlotMax 约束
  [string]$Release,                  # 槽位根路径:就绪失败时回滚该槽刚打的空 claim
  [string]$Abandon                   # 槽位根路径:显式放弃该槽(双仓 reset --hard 基线 + 清看板行)
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

function Get-SlotNum([string]$Path) {
  $m = [regex]::Match([System.IO.Path]::GetFileName($Path.TrimEnd('\', '/')), 'dev(\d+)$')
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

function Invoke-BoardCall([string[]]$BoardArgs) {
  # 链式调同目录 看板.ps1;失败不抛(看板非权威)
  try {
    & (Get-FlowEngine) -NoProfile -File (Join-Path $PSScriptRoot "看板.ps1") @BoardArgs 2>&1 | Out-Null
    return ($LASTEXITCODE -eq 0)
  } catch { return $false }
}

function Wait-TestClaimGate {
  # 测试注入点(仅 tests\槽位领取内核CLI测试.ps1 设 FLOW_TEST_CLAIM_GATE):空闲判定之后、争用占有之前
  # 落 reached 标记并等 go 标记,让测试在这个窗口里插入另一次领取,确定性复现并发领同一槽。
  # 生产环境不设该变量,本函数零动作。
  $gate = $env:FLOW_TEST_CLAIM_GATE
  if (-not $gate) { return }
  [System.IO.File]::WriteAllText((Join-Path $gate "reached"), "1")
  $deadline = [DateTime]::UtcNow.AddSeconds(60)
  while (-not (Test-Path (Join-Path $gate "go")) -and [DateTime]::UtcNow -lt $deadline) { Start-Sleep -Milliseconds 100 }
}

function Get-SlotState([string]$SlotPath, [string]$BaseC, [string]$BaseF, $Cfg) {
  # 单槽位现场态;idle 判据见 Test-SlotIdle(与 占用面板 同口径)。
  # 服务端通道关闭时 fx 为空串、fx_ahead / fx_dirty 恒空,槽位只看客户端 worktree。
  $server = Test-ServerEnabled
  $fx = if ($server) { Join-Path $SlotPath $Cfg.ServerDirName } else { "" }
  if (-not (Test-Path $SlotPath -PathType Container) -or ($server -and -not (Test-Path (Join-Path $fx ".git")))) {
    return @{ path = $SlotPath; fx = $fx; broken = $true }
  }
  $branch = Get-GitOne $SlotPath "branch --show-current"
  # Get-GitLines 回的是逗号包裹的数组,直接接管道会整份作为一个对象流过,ForEach 里 [string] 把全部哈希
  # 拼成一个空格串,ahead 恒 ≤1 条;先用括号求值再入管道才逐条展开。
  # 四项查询走 Get-GitLinesChecked:空清单在这里 = 「无领先 / 无改动」= 空闲可领,查询失败若回空,
  # 有人在用的槽会被判空闲、领走并 reset。失败按不可用槽处置(broken),领取换槽,显式模式报 ABORT。
  # 护栏名按槽位分(slot-state-query/dev<N>):一个槽位次次查不成时,与别的槽位合算会被摊薄而看不出来。
  $guard = "slot-state-query"
  $sn = Get-SlotNum $SlotPath
  if ($sn) { $guard = $guard + "/dev" + $sn }
  try {
    $ahead = @((Get-GitLinesChecked $SlotPath "log --format=%H $BaseC..$branch") | ForEach-Object { ([string]$_).Trim() } | Where-Object { $_ })
    # -uall:porcelain 缺省把整棵未跟踪新目录折叠成一条目录条目(?? Configs/),此清单经
    # Get-Footprint 喂领用前重叠比对,须逐文件列出(口径同 槽位交付 Get-ChangedPaths)。
    $dirty = Get-GitLinesChecked $SlotPath "status --porcelain -uall"
    $fxAhead = @(); $fxDirty = @()
    if ($server) {
      $fxBranch = Get-GitOne $fx "branch --show-current"
      $fxAhead = @((Get-GitLinesChecked $fx "log --format=%H $BaseF..$fxBranch") | ForEach-Object { ([string]$_).Trim() } | Where-Object { $_ })
      $fxDirty = Get-GitLinesChecked $fx "status --porcelain -uall"
    }
  } catch {
    $why = $_.Exception.Message
    Write-Degraded "slot-state-query-failed" ($SlotPath + " : " + $why) ("slot-state-query-failed " + $SlotPath + " : " + $why) -Guard $guard
    return @{ path = $SlotPath; fx = $fx; broken = $true }
  }
  Write-GuardOk $guard
  return @{
    path = $SlotPath; fx = $fx; broken = $false; branch = $branch
    ahead = $ahead; dirty = $dirty; fx_ahead = $fxAhead; fx_dirty = $fxDirty
    idle = (Test-SlotIdle $ahead $dirty $fxAhead $fxDirty)
  }
}

function Test-CleanSingleClaim($St) {
  # 可回收形态:客户端 ahead 恰 1 条 + subject 前缀 claim: + tree==父tree + Fantasy 无领先。
  # 不问 dirty:-Release 带 dirty 照 reset(刚领到即回滚,槽内尚无会话改动);
  # 陈旧占位清理另在 Invoke-StaleClean 拦 tracked dirty。
  if ($St.broken) { return $false }
  if ($St.ahead.Count -ne 1 -or $St.fx_ahead.Count -gt 0) { return $false }
  $sha = $St.ahead[0]
  $subject = Get-GitOne $St.path "log -1 --format=%s $sha"
  if (-not $subject.StartsWith("claim:", [System.StringComparison]::Ordinal)) { return $false }
  $tree = Get-GitOne $St.path "log -1 --format=%T $sha"
  $parentTree = Get-GitOne $St.path "log -1 --format=%T $sha~1"
  return ([bool]$tree -and $tree -eq $parentTree)
}

function Assert-InSlotPool([string]$Path, [string]$BaseDir, [string]$Prefix, [int]$SlotCount) {
  # 便宜护栏:reset --hard 前校验路径确在槽位池内的 devN 目录,防参数错传毁真仓
  $root = [System.IO.Path]::GetFullPath($Path).TrimEnd('\', '/')
  foreach ($n in 1..$SlotCount) {
    $expected = [System.IO.Path]::GetFullPath((Join-Path $BaseDir ($Prefix + $n))).TrimEnd('\', '/')
    if ($root.ToLowerInvariant() -eq $expected.ToLowerInvariant()) { return }
  }
  throw "refusing to reset non-slot path: $root"
}

function Invoke-StaleClean($St, [string]$BaseC, [double]$StaleHours, $Notes) {
  # 陈旧占位:可回收形态 + 龄超阈 -> reset 清理 + 清看板行,回 $true(槽转空闲)
  if ($St.broken -or $St.idle) { return $false }
  if (-not (Test-CleanSingleClaim $St)) { return $false }
  $sha = $St.ahead[0]
  $subject = Get-GitOne $St.path "log -1 --format=%s $sha"
  $ct = Get-GitOne $St.path "log -1 --format=%ct $sha"
  if ($ct -notmatch '^\d+$') { return $false }
  $ageH = ([DateTimeOffset]::UtcNow.ToUnixTimeSeconds() - [int64]$ct) / 3600.0
  if ($ageH -le $StaleHours) { return $false }
  $n = Get-SlotNum $St.path
  # 自动清理不代丢改动:tracked 未提交改动(口径同 Test-SlotIdle,双仓)会被 reset --hard 抹掉,
  # 跳过该槽留人工处置;槽保持占用,领取继续找别的空闲槽。untracked 不受 reset 影响,不拦。
  $tracked = @(@($St.dirty) + @($St.fx_dirty) | Where-Object { $_ -and -not ([string]$_).StartsWith("??", [System.StringComparison]::Ordinal) })
  if ($tracked.Count -gt 0) {
    $Notes.Add(("WARN stale-claim-dirty dev{0} tracked-dirty={1} age={2:F0}h subject='{3}' 陈旧占位带未提交改动,未自动清理、已跳过该槽;人工确认改动去留后 reset --hard 基线 + 看板 -Close" -f $n, $tracked.Count, $ageH, $subject))
    return $false
  }
  # 先按 CAS 把分支 ref 从这条 claim 挪回基线,再 reset:判定到 reset 之间占位的主人若回来提交了,ref 已
  # 不是 $sha,CAS 失败即放弃清理,不抹掉新提交(与 Invoke-Claim 的占有 CAS 同一手法)。
  $baseSha = Get-GitOne $St.path "rev-parse $BaseC"
  if (-not $baseSha -or -not $St.branch) { return $false }
  if ((Invoke-GitMerged $St.path "update-ref refs/heads/$($St.branch) $baseSha $sha").code -ne 0) {
    $Notes.Add("INFO 陈旧占位清理放弃:dev$n 分支尖在判定后已变(占位主人回来提交了?),未动该槽")
    return $false
  }
  $r = Invoke-GitMerged $St.path "reset --hard $BaseC"
  if ($r.code -ne 0) {
    $Notes.Add("INFO 陈旧占位清理失败(reset 非 0,分支 ref 已挪回基线、工作树未复原):$($St.path)")
    return $false
  }
  if ($n) { [void](Invoke-BoardCall @("-Slot", $n, "-Close")) }
  $Notes.Add(("CLEANED dev{0} stale-claim age={1:F0}h subject='{2}'" -f $n, $ageH, $subject))
  return $true
}

function Get-Footprint($St, [string]$BaseC, [string]$BaseF) {
  # 占用槽双仓改动范围 = 对两个仓各跑一次单仓口径(Get-RepoFootprint,与 占用面板.ps1
  # -Files 共用同一实现,口径由代码而非注释保证一致)。
  return @{
    client  = (Get-RepoFootprint (Get-GitLines $St.path "diff $BaseC...HEAD --name-only") $St.dirty)
    fantasy = $(if ($St.fx) { Get-RepoFootprint (Get-GitLines $St.fx "diff $BaseF...HEAD --name-only") $St.fx_dirty } else { , @() })
  }
}

function Get-OverlapHits([string[]]$Prefixes, [string[]]$Files) {
  # 目录边界双向前缀匹配:命中的 (前缀, 文件) 对
  $hits = New-Object System.Collections.Generic.List[object]
  foreach ($p in $Prefixes) {
    if ($null -eq $p) { continue }
    $pn = ([string]$p).Replace('\', '/').Trim().TrimEnd('/').ToLowerInvariant()
    if (-not $pn) { continue }
    foreach ($f in $Files) {
      # 与 $pn 对称去尾斜杠:porcelain 的折叠目录条目(?? Configs/)带尾斜杠,留着会让下面的
      # 反向分支拼出 `configs//`、永不匹配;Get-SlotState 已加 -uall 展开成逐文件,此处留作防御。
      $fn = ([string]$f).Replace('\', '/').TrimEnd('/').ToLowerInvariant()
      if ($fn -eq $pn -or $fn.StartsWith($pn + "/", [System.StringComparison]::Ordinal) -or $pn.StartsWith($fn + "/", [System.StringComparison]::Ordinal)) {
        $hits.Add(@{ prefix = $p; file = $f })
      }
    }
  }
  return , $hits
}

function Get-BoardTopic([string]$Key) {
  try {
    $path = Get-BoardPath
    if (-not (Test-Path $path)) { return "" }
    $obj = [System.IO.File]::ReadAllText($path) | ConvertFrom-Json
    if ($obj.PSObject.Properties.Name -contains $Key) { return [string]$obj.$Key.topic }
    return ""
  } catch { return "" }
}

function ConvertTo-CleanMessage([string]$Text) {
  # 等价 `git commit --cleanup=whitespace`(commit-tree 不做任何清理):去行尾空白、折叠连续空行、
  # 去首尾空行、末尾恰一个换行。不删 `#` 行——简报里的 markdown 标题要原样保留。
  $out = New-Object System.Collections.Generic.List[string]
  foreach ($line in ($Text -replace "`r`n", "`n").Split("`n")) {
    $l = $line.TrimEnd()
    if (-not $l -and ($out.Count -eq 0 -or -not $out[$out.Count - 1])) { continue }
    $out.Add($l)
  }
  while ($out.Count -gt 0 -and -not $out[$out.Count - 1]) { $out.RemoveAt($out.Count - 1) }
  return (($out -join "`n") + "`n")
}

function Invoke-Claim($St, [string]$BaseC, [string]$BaseF, [string]$TopicArg, [string]$BriefArg,
                      $Notes, [string]$BaseDir, [string]$Prefix, [int]$SlotCount, $Cfg) {
  # 领用一个已判空闲的槽:记分支尖 -> 复核 idle -> 造占位提交(不动 ref)-> CAS 争用分支 ref
  # -> 争用成功者才做领用复原(双仓 reset --hard)。回 "ok" / "yielded"(被抢,可换槽)/ "abort:<原因>"。
  #
  # 占有必须原子:旧序「reset --hard 基线 -> 打占位 -> 复核叠放」里,后到者的 reset 会把先到者
  # 已通过复核的占位直接抹掉,两边都 ACQUIRED。现以 `update-ref <ref> <新> <旧>` 争用——git 持
  # <ref>.lock 独占比对,分支尖已不是判空闲时读到的那个就失败;失败方从未改过 ref 与工作树。
  # 分支尖须在判空闲**之前**读:之后再读会读到别人刚占的尖,CAS 便会覆盖他人占位。
  $slot = $St.path; $fx = $St.fx
  try { Assert-InSlotPool $slot $BaseDir $Prefix $SlotCount }
  catch { return "abort:$($_.Exception.Message)" }
  $branch = Get-GitOne $slot "branch --show-current"
  if (-not $branch) { return "abort:slot HEAD is detached (expect branch checkout): $slot" }
  $ref = "refs/heads/$branch"
  $oldTip = Get-GitOne $slot "rev-parse --verify $ref"
  $fresh = Get-SlotState $slot $BaseC $BaseF $Cfg
  if ($fresh.broken -or -not $fresh.idle -or $fresh.branch -ne $branch) { return "yielded" }   # 窗口内被他人占走
  $baseSha = Get-GitOne $slot "rev-parse --verify $BaseC"
  $baseTree = Get-GitOne $slot "log -1 --format=%T $baseSha"
  if ($oldTip -notmatch '^[0-9a-f]{40}$' -or $baseSha -notmatch '^[0-9a-f]{40}$' -or $baseTree -notmatch '^[0-9a-f]{40}$') {
    return "abort:cannot resolve branch tip / baseline (tip='$oldTip' base='$baseSha')"
  }
  Wait-TestClaimGate

  # 占位 = 以基线为父、树同基线的空提交。subject 恒为 `claim: {topic}`(所有解析处用 --format=%s
  # 只读 subject,不受 body 影响);第一步简报写入 body,使 git 成为持久续接源;body 末尾另附
  # `Session-Id:` trailer(会话身份,占用面板在看板行丢失时据此兜底显示会话名;剥离与解析单源于
  # hook函数库 Split-ClaimBody)。commit-tree 只造对象不动 ref,争用前无任何可见副作用。
  $msgFile = Join-Path $env:TEMP ("flow-claim-" + [Guid]::NewGuid().ToString("N") + ".txt")
  $msg = if ($BriefArg) { "claim: $TopicArg`n`n$BriefArg" } else { "claim: $TopicArg" }
  $msg = ConvertTo-CleanMessage (Add-ClaimSessionTrailer $msg (Get-HostSessionId))
  [System.IO.File]::WriteAllText($msgFile, $msg, (New-Object System.Text.UTF8Encoding($false)))
  try {
    $ct = Invoke-GitMerged $slot "commit-tree $baseTree -p $baseSha -F ""$msgFile"""
  } finally {
    try { [System.IO.File]::Delete($msgFile) } catch {}
  }
  $claimSha = @($ct.lines | ForEach-Object { $_.Trim() } | Where-Object { $_ -match '^[0-9a-f]{40}$' }) | Select-Object -Last 1
  if ($ct.code -ne 0 -or -not $claimSha) { return "abort:claim commit-tree failed: $($ct.lines -join ' ')" }

  if ((Invoke-GitMerged $slot "update-ref $ref $claimSha $oldTip").code -ne 0) {
    $Notes.Add("INFO contention-yielded:$([System.IO.Path]::GetFileName($slot)) 占位争用失败(分支尖已被并发领用者改动),未动该槽 ref 与工作树,换下一空闲槽")
    return "yielded"
  }

  # 争用成功,槽已归本会话:领用复原。复原失败把 ref 按 CAS 还回,不留本会话的占位。
  # 还原失败要点名:占位留在 ref 上,该槽在人工处置前一直显示被本会话占着。
  if ((Invoke-GitMerged $slot "reset --hard $claimSha").code -ne 0) {
    $rb = Invoke-GitMerged $slot "update-ref $ref $oldTip $claimSha"
    $rbNote = if ($rb.code -eq 0) { "" } else { "; ref rollback also failed, claim left on " + $ref + ": " + ($rb.lines -join ' ') }
    return ("abort:client reset --hard failed (index/worktree lock?)" + $rbNote)
  }
  if ($fx -and (Invoke-GitMerged $fx "reset --hard $BaseF").code -ne 0) {
    $rb = Invoke-GitMerged $slot "update-ref $ref $baseSha $claimSha"
    $rbNote = if ($rb.code -eq 0) { "" } else { "; ref rollback also failed, claim left on " + $ref + ": " + ($rb.lines -join ' ') }
    return ("abort:fantasy reset --hard failed (index/worktree lock?)" + $rbNote)
  }

  # Tools\Luban junction 复核(理由见 hook函数库 Repair-LubanJunction)。放在 reset 之后:junction
  # 缺失时 reset 会按入库的 about.txt 重建出实体目录。重建失败不阻断领用(多数任务不导表),
  # 以 WARN 行经外层入口透传给会话。主仓侧目标缺失(skipped)不属槽位问题,不出行。
  # 重建失败 = 护栏降级:WARN 照旧进 $Notes(排在首行判定之后),Write-Degraded 自带的那行以 6>$null 收掉,只取遥测。
  $j = Repair-LubanJunction $slot (Join-Path $Cfg.RepoRoot "Tools\Luban")
  $jGuard = "luban-junction/dev" + (Get-SlotNum $slot)
  if ($j.state -eq "created") { $Notes.Add("INFO luban-junction 已重建:$($j.detail)") }
  if ($j.state -eq "failed")  {
    $jWarn = "luban-junction 重建失败,本槽导表 bat 会报 Luban.dll 不存在:$($j.detail)"
    $Notes.Add("WARN " + $jWarn)
    Write-Degraded "luban-junction-failed" ([string]$j.detail) $jWarn -Guard $jGuard 6>$null
  }
  if ($j.state -in @("ok", "created")) { Write-GuardOk $jGuard }
  if ($j.state -in @("created", "failed")) {
    Write-Telemetry @{ event = "luban-junction"; slot = (Get-SlotNum $slot); state = $j.state; detail = $j.detail }
  }
  return "ok"
}

function Invoke-Release([string]$SlotPath, [string]$BaseC, [string]$BaseF, $Cfg) {
  # 就绪失败事务回滚:仅当形态为『恰 1 条空 claim 占位 + Fantasy 无领先』时 reset 到 BaseC。
  # 形状不符则拒绝、不动任何东西。首行判定:RELEASED(退 0)/ABORT(退 1)。
  $SlotPath = [System.IO.Path]::GetFullPath($SlotPath)
  $st = Get-SlotState $SlotPath $BaseC $BaseF $Cfg
  if ($st.broken) { Write-Host "ABORT release: slot broken (missing dir/Fantasy worktree): $SlotPath"; return 1 }
  if ($st.idle)   { Write-Host "RELEASED already-idle $SlotPath"; return 0 }
  if (-not (Test-CleanSingleClaim $st)) {
    $sha = if ($st.ahead.Count -gt 0) { $st.ahead[0] } else { "" }
    $subject = if ($sha) { Get-GitOne $SlotPath "log -1 --format=%s $sha" } else { "" }
    if ($st.ahead.Count -ne 1) {
      Write-Host "ABORT release: client ahead=$($st.ahead.Count) (expect 1) fantasy ahead=$($st.fx_ahead.Count) - nothing removed"
    } elseif ($st.fx_ahead.Count -gt 0) {
      Write-Host "ABORT release: fantasy has $($st.fx_ahead.Count) ahead commits - nothing removed"
    } elseif (-not $subject.StartsWith("claim:", [System.StringComparison]::Ordinal)) {
      Write-Host "ABORT release: single ahead commit is not a claim placeholder (subject='$subject') - nothing removed"
    } else {
      Write-Host "ABORT release: claim commit is not empty (tree != parent) - nothing removed"
    }
    return 1
  }
  $sha = $st.ahead[0]
  $subject = Get-GitOne $SlotPath "log -1 --format=%s $sha"
  if ((Invoke-GitMerged $SlotPath "reset --hard $BaseC").code -ne 0) {
    Write-Host "ABORT release: reset --hard $BaseC failed - resolve manually"
    return 1
  }
  $n = Get-SlotNum $SlotPath
  if ($n) { [void](Invoke-BoardCall @("-Slot", $n, "-Close")) }
  Write-Telemetry @{ event = "slot-release"; slot = $n; subject = $subject }
  Write-Host "RELEASED dev$n rolled-back-claim subject='$subject'"
  return 0
}

function Invoke-Abandon([string]$SlotPath, [string]$BaseC, [string]$BaseF, $Cfg) {
  # 显式放弃:双仓撤未完结合并态 -> reset --hard 各自基线 -> 清看板行。首行判定 ABANDONED(退 0)/ABORT(退 1)。
  # 与 -Release 的分工:Release 是就绪失败的事务回滚,只认空 claim 形态;本函数不看形态,丢弃双仓全部
  # 领先提交与 tracked 改动。用途是交付走不下去、决定在新基线重做时收回槽位——没有它,同范围重领会
  # QUEUE 到自己这个交付不了的槽上,形成死等(实发 2026-09-23 dev2)。untracked 不动(同领用复原口径)。
  # 丢弃的提交逐条列出,并留在 reflog 里可找回。
  $SlotPath = [System.IO.Path]::GetFullPath($SlotPath).TrimEnd('\', '/')
  # 护栏:reset --hard 前确认目标是槽位 worktree——目录名合 SlotDirPrefix<N>,且双仓都是链接 worktree
  # (.git 是文件而非目录),参数错传成主仓根时后一条必不成立。不用 Assert-InSlotPool:它按真
  # SlotBaseDir 比对,夹具测试的槽位在 %TEMP% 下过不了。
  $leaf = [System.IO.Path]::GetFileName($SlotPath)
  if ($leaf -notmatch ('^' + [regex]::Escape([string]$Cfg.SlotDirPrefix) + '\d+$')) {
    Write-Host "ABORT abandon: not a slot directory (expect $($Cfg.SlotDirPrefix)<N>): $SlotPath"; return 1
  }
  $st = Get-SlotState $SlotPath $BaseC $BaseF $Cfg
  if ($st.broken) { Write-Host "ABORT abandon: slot broken (missing dir/Fantasy worktree): $SlotPath"; return 1 }
  foreach ($repo in @(@($SlotPath, $st.fx) | Where-Object { $_ })) {
    if (-not (Test-Path -LiteralPath (Join-Path $repo ".git") -PathType Leaf)) {
      Write-Host "ABORT abandon: not a linked worktree (refusing to reset a main repo): $repo"; return 1
    }
  }
  $n = Get-SlotNum $SlotPath
  $tracked = @(@($st.dirty) + @($st.fx_dirty) | Where-Object { $_ -and -not ([string]$_).StartsWith("??", [System.StringComparison]::Ordinal) })
  $dropped = @()
  foreach ($x in $st.ahead)    { $dropped += ("client " + (Get-GitOne $SlotPath "log -1 --format=""%h %s"" $x")) }
  foreach ($x in $st.fx_ahead) { $dropped += ("fantasy " + (Get-GitOne $st.fx "log -1 --format=""%h %s"" $x")) }
  $pairs = @(, @($SlotPath, $BaseC, "client"))
  if ($st.fx) { $pairs += , @($st.fx, $BaseF, "fantasy") }
  foreach ($pair in $pairs) {
    $repo = $pair[0]
    # 残留合并态会让 reset 之后仍有 MERGE_HEAD,下一次领用或交付照样卡住,先撤。
    # abort 走唯一出口 Invoke-MergeAbort;其成败不单独停机:紧随的 reset --hard 本身也清合并态,失败由它报。
    if ((Invoke-GitMerged $repo "rev-parse -q --verify MERGE_HEAD").code -eq 0) {
      $ab = Invoke-MergeAbort $repo
      if (-not $ab.ok) { Write-Degraded "abandon-merge-abort-failed" ($pair[2] + " " + $ab.note) ("abandon: " + $pair[2] + " " + $ab.note) -Guard "abandon-merge-abort" }
      else { Write-GuardOk "abandon-merge-abort" }
    }
    if ((Invoke-GitMerged $repo ("reset --hard " + $pair[1])).code -ne 0) {
      Write-Host "ABORT abandon: $($pair[2]) reset --hard $($pair[1]) failed (index/worktree lock?) - slot left partially reset: $repo"
      return 1
    }
  }
  if ($n) { [void](Invoke-BoardCall @("-Slot", $n, "-Close")) }
  Write-Telemetry @{ event = "slot-abandon"; slot = $n; dropped = $dropped.Count; tracked_dirty = $tracked.Count }
  Write-Host ("ABANDONED dev{0} client-dropped={1} fantasy-dropped={2} tracked-dirty={3}" -f $n, $st.ahead.Count, $st.fx_ahead.Count, $tracked.Count)
  foreach ($d in $dropped) { Write-Host "INFO dropped: $d" }
  return 0
}

# ---------------- 主流程 ----------------

# -- release 模式:先于 topic 要求短路(回滚不需 topic) --
if ($Release) {
  try { $cfg = Get-FlowConfig } catch { Write-Host "ABORT config load failed: $($_.Exception.Message)"; exit 2 }
  exit (Invoke-Release $Release $cfg.ClientBaseline $cfg.FantasyBaseline $cfg)
}
if ($Abandon) {
  try { $cfg = Get-FlowConfig } catch { Write-Host "ABORT config load failed: $($_.Exception.Message)"; exit 2 }
  exit (Invoke-Abandon $Abandon $cfg.ClientBaseline $cfg.FantasyBaseline $cfg)
}

if ([bool]$Topic -eq [bool]$TopicFile) {
  Write-Host "ABORT exactly one of -Topic or -TopicFile is required"; exit 2
}
if ($TopicFile) {
  try { $topicArg = ([System.IO.File]::ReadAllText($TopicFile)).Trim() }
  catch { Write-Host "ABORT topic-file read failed: $($_.Exception.Message)"; exit 2 }
} else {
  $topicArg = $Topic.Trim()
}
if (-not $topicArg) { Write-Host "ABORT topic is empty"; exit 2 }
$briefArg = ""
if ($BriefFile) {
  try { $briefArg = ([System.IO.File]::ReadAllText($BriefFile)).Trim() }
  catch { Write-Host "ABORT brief-file read failed: $($_.Exception.Message)"; exit 2 }
}

# 改动范围清单一律可经文件送入:经 -File 起子进程时,命令行实参绑定到 [string[]] **不按逗号拆分**
# (逗号拆分只发生在 PS 表达式语法里),含空格的路径更会被拆成多个 argv、错绑成参数名。清单走文件是
# shell-conventions·文本走文件对本入口的落法,也是外层 槽位领取.ps1 唯一使用的通道。
if ($PathsFile) {
  if (-not (Test-Path -LiteralPath $PathsFile)) { Write-Host "ABORT paths-file not found: $PathsFile"; exit 2 }
  try { $Paths = @($Paths) + @([System.IO.File]::ReadAllLines($PathsFile) | ForEach-Object { $_.Trim() } | Where-Object { $_ }) }
  catch { Write-Host "ABORT paths-file read failed: $($_.Exception.Message)"; exit 2 }
}
if ($FantasyPathsFile) {
  if (-not (Test-Path -LiteralPath $FantasyPathsFile)) { Write-Host "ABORT fantasy-paths-file not found: $FantasyPathsFile"; exit 2 }
  try { $FantasyPaths = @($FantasyPaths) + @([System.IO.File]::ReadAllLines($FantasyPathsFile) | ForEach-Object { $_.Trim() } | Where-Object { $_ }) }
  catch { Write-Host "ABORT fantasy-paths-file read failed: $($_.Exception.Message)"; exit 2 }
}

try {
  $cfg = Get-FlowConfig
  $baseC = $cfg.ClientBaseline; $baseF = $cfg.FantasyBaseline
  $staleHours = [double]$cfg.StaleClaimHours
  $baseDir = $cfg.SlotBaseDir; $prefix = $cfg.SlotDirPrefix
  $slotCount = [int]$cfg.SlotCount
  # 缺键按不设上限处理(= 旧的全池正序行为),使配置表未同步的旧副本仍可运行。
  $normalMax = if ($cfg.ContainsKey('NormalSlotMax')) { [int]$cfg.NormalSlotMax } else { $slotCount }
  if ($normalMax -lt 1 -or $normalMax -gt $slotCount) {
    throw "NormalSlotMax=$normalMax 越界,须在 1..$slotCount"
  }
} catch { Write-Host "ABORT config load failed: $($_.Exception.Message)"; exit 2 }

$notes = New-Object System.Collections.Generic.List[string]

# -- 固定槽位池:只认 1..SlotCount,不扫描目录、不动态扩容 --
if ($Slot -and ($Slot -notmatch '^\d+$' -or [int]$Slot -lt 1 -or [int]$Slot -gt $slotCount)) {
  Write-Host "ABORT slot must be an integer in 1..$slotCount"; exit 2
}
# 候选序:常规任务 1..$normalMax 正序,-PreferNoUnity(免启)N..1 全池反序。缺可选键
# NormalSlotMax 时 $normalMax = SlotCount,两侧都覆盖全池、不产生隔离。
# 配上该键才有**单向隔离**:常规任务不越 NormalSlotMax,那几个槽占满即 FULL,不向高号槽延伸;
# 免启任务不受限,借得到低号槽。理由是两类任务留下的痕迹不对称——免启任务不启编辑器、
# 领完就走,占低号槽只是路过;常规任务落到高号槽会把一个编辑器实例长期留在那儿,
# 与「低号常驻编辑器、高号免启」的布局意图相悖,而这一点靠相向扫描的自然倾向拦不住。
$slotOrder = if ($PreferNoUnity) { @($slotCount..1) } else { @(1..$normalMax) }
$candidates = if ($Slot) { @(Join-Path $baseDir ($prefix + $Slot)) }
              else { @($slotOrder | ForEach-Object { Join-Path $baseDir ($prefix + $_) }) }

$states = New-Object System.Collections.Generic.List[object]
foreach ($c in $candidates) { $states.Add((Get-SlotState $c $baseC $baseF $cfg)) }

# -- 陈旧占位自动清理(条件全中才清) --
for ($i = 0; $i -lt $states.Count; $i++) {
  if (Invoke-StaleClean $states[$i] $baseC $staleHours $notes) {
    $states[$i] = Get-SlotState $states[$i].path $baseC $baseF $cfg
  }
}

# -- 同主题重复领取拦截:一个任务只占一个槽位 --
# 判据 = 占用槽最早一条提交的 subject 与本次 `claim: <topic>` 逐字相等。全池扫、不限候选序:钉槽与
# NormalSlotMax 下候选只是池的子集,已有占位可能落在候选之外。先于重叠比对:占位一旦有了改动范围,
# 同范围的重复领取会被 QUEUE 到自己的前一个占位上死等。不看会话身份:换会话接同一任务也该续接原槽。
# 实发 2026-09-26:会话以为已停掉的后台排队轮询仍在跑,会话在前台领 dev2 一分钟后它又领走 dev3。
$expectSubject = ("claim: " + $topicArg).Split("`n")[0].TrimEnd()
foreach ($pn in 1..$slotCount) {
  $pp = Join-Path $baseDir ($prefix + $pn)
  $st = @($states | Where-Object { $_.path -eq $pp }) | Select-Object -First 1
  if (-not $st) { $st = Get-SlotState $pp $baseC $baseF $cfg }
  if ($st.broken -or @($st.ahead).Count -eq 0) { continue }
  $claimSha = @($st.ahead)[-1]   # log 最新在前,最末为最早的 claim 占位
  if ((Get-GitOne $st.path "log -1 --format=%s $claimSha") -cne $expectSubject) { continue }
  $sid = (Split-ClaimBody ((Get-GitLinesRaw $st.path "log -1 --format=%b $claimSha") -join "`n")).sessionId
  $mine = [bool]$sid -and $sid -eq (Get-HostSessionId)
  Write-Host "ABORT duplicate-claim dev$pn 已持有同主题占位「$expectSubject」,同一任务不领第二个槽位"
  foreach ($note in $notes) { Write-Host $note }
  if ($mine) {
    Write-Host "INFO 该占位属本会话(session=$sid):本次是重复触发的领取(重试 / 未真正停掉的后台轮询),直接在 dev$pn 续接"
  } else {
    $who = if ($sid) { "session=$sid" } else { "领取时无会话身份" }
    Write-Host "INFO 该占位属其他会话($who):到原会话续接,或换本会话接手时直接在 dev$pn 续接"
  }
  Write-Host "INFO 处置:编辑器未就绪用 -StartUnity -Slot $pn 补就绪;该槽作废须经用户授权 -Abandon -Slot $pn 后再领"
  Write-Telemetry @{ event = "槽位领取"; verdict = "ABORT-duplicate"; slot = $pn; topic = $topicArg; same_session = $mine }
  exit 1
}

# -- 重叠比对(仅当给了改动范围前缀;命中 -> QUEUE 指示) --
if ($Paths.Count -gt 0 -or $FantasyPaths.Count -gt 0) {
  foreach ($st in $states) {
    if ($st.broken -or $st.idle) { continue }
    $fp = Get-Footprint $st $baseC $baseF
    $hits = New-Object System.Collections.Generic.List[object]
    foreach ($h in (Get-OverlapHits $Paths $fp.client))         { $hits.Add($h) }
    foreach ($h in (Get-OverlapHits $FantasyPaths $fp.fantasy)) { $hits.Add($h) }
    if ($hits.Count -gt 0) {
      $n = Get-SlotNum $st.path
      $topic = Get-BoardTopic "dev$n"
      if (-not $topic) { $topic = Get-GitOne $st.path "log -1 --format=%s" }
      Write-Host "QUEUE dev$n $topic"
      foreach ($note in $notes) { Write-Host $note }
      foreach ($h in ($hits | Select-Object -First 12)) { Write-Host "INFO overlap: 前缀 $($h.prefix) <-> $($h.file)" }
      Write-Host "INFO 处置:排 dev$n 队尾,待其合并、快进对齐后在同一槽位串行接做(-Slot $n 重领);不另开槽位并行"
      Write-Telemetry @{ event = "槽位领取"; verdict = "QUEUE"; slot = $n; topic = $topicArg }
      exit 3
    }
  }
}

# -- 选槽 + 领用(竞态让位自动换下一空闲槽,每槽至多试一次) --
if ($Slot) {
  $st = $states[0]
  if ($st.broken) { Write-Host "ABORT pinned slot broken (missing dir/Fantasy worktree): $($st.path)"; exit 1 }
  if (-not $st.idle) {
    Write-Host "ABORT pinned slot occupied: $($st.path) client ahead=$($st.ahead.Count) dirty=$($st.dirty.Count) fantasy ahead=$($st.fx_ahead.Count) dirty=$($st.fx_dirty.Count)"
    foreach ($note in $notes) { Write-Host $note }
    foreach ($x in (@($st.ahead | Select-Object -First 3) + @($st.fx_ahead | Select-Object -First 3))) {
      $line = Get-GitOne $st.path "log -1 --format=""%h %s"" $x"
      if (-not $line) { $line = $x }
      Write-Host "INFO ahead: $line"
    }
    exit 1
  }
  $idleQueue = @($st)
} else {
  $idleQueue = @($states | Where-Object { -not $_.broken -and $_.idle })
}

if ($idleQueue.Count -eq 0) {
  $occupied = @($states | Where-Object { -not $_.broken -and -not $_.idle })
  $broken = @($states | Where-Object { $_.broken })
  $summary = (@($occupied | ForEach-Object {
    "dev$(Get-SlotNum $_.path) c+$($_.ahead.Count)/d$($_.dirty.Count) f+$($_.fx_ahead.Count)/d$($_.fx_dirty.Count)"
  }) -join "; ")
  if (-not $summary) { $summary = "无可用槽位目录" }
  Write-Host "FULL $summary"
  foreach ($note in $notes) { Write-Host $note }
  foreach ($s in $broken) { Write-Host "INFO broken: $($s.path)(目录或 Fantasy worktree 缺失,跳过)" }
  if (-not $PreferNoUnity -and $normalMax -lt $slotCount) {
    # 高号槽可能空着却不在候选序里,不说清楚会让人以为脚本漏扫了。
    Write-Host "INFO 固定槽位池共 $slotCount 个;常规任务只在 dev1..dev$normalMax 里选(NormalSlotMax),不向高号槽延伸"
    Write-Host "INFO 高号槽留给免启任务(-NoUnity);本次任务确实不需要编辑器就加 -NoUnity 重领,否则等占用任务交付"
  } else {
    Write-Host "INFO 固定槽位池共 $slotCount 个;等待占用任务交付或处置异常残留,不扩容"
  }
  Write-Telemetry @{ event = "槽位领取"; verdict = "FULL"; topic = $topicArg }
  exit 4
}

$acquired = $null
foreach ($st in $idleQueue) {
  $res = Invoke-Claim $st $baseC $baseF $topicArg $briefArg $notes $baseDir $prefix $slotCount $cfg
  if ($res -eq "ok") { $acquired = $st; break }
  if ($res -eq "yielded") { continue }
  Write-Host "ABORT $($res.Substring(6))"
  foreach ($note in $notes) { Write-Host $note }
  exit 1
}
if ($null -eq $acquired) {
  Write-Host "ABORT 空闲候选耗尽(全部被并发抢先领走)——重跑一次或呈报排队"
  foreach ($note in $notes) { Write-Host $note }
  Write-Telemetry @{ event = "槽位领取"; verdict = "ABORT-contention"; topic = $topicArg }
  exit 1
}

$slotPath = $acquired.path; $fxPath = $acquired.fx; $n = Get-SlotNum $slotPath
if (Invoke-BoardCall @("-Slot", $n, "-Topic", $topicArg, "-Stage", "实现中")) {
  $notes.Add("INFO board 已登记看板(实现中)")
} else {
  $notes.Add("INFO board 登记看板失败——看板非权威,不影响领用;可手跑 看板.ps1 补登")
}
Write-Host "ACQUIRED $n $slotPath $fxPath"
if ($fxPath) {
  Write-Host ("INFO aligned client={0}@{1} fantasy={2}@{3}" -f `
    $baseC, (Get-GitOne $slotPath "rev-parse --short $baseC"),
    $baseF, (Get-GitOne $fxPath "rev-parse --short $baseF"))
} else {
  Write-Host ("INFO aligned client={0}@{1}" -f $baseC, (Get-GitOne $slotPath "rev-parse --short $baseC"))
}
foreach ($note in $notes) { Write-Host $note }
Write-Telemetry @{ event = "槽位领取"; verdict = "ACQUIRED"; slot = $n; topic = $topicArg
                   cleaned = @($notes | Where-Object { $_.StartsWith("CLEANED", [System.StringComparison]::Ordinal) }).Count }
exit 0
