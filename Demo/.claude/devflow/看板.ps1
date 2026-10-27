# 看板.ps1 — devflow 任务看板读写(机械层;判断留会话)。
# 看板 = 仓外运行态文件,物理路径取 hook函数库 Get-BoardPath(相对路径正本 = flow-config.psd1 BoardRelPath;
# MSIX 容器内外落同一文件的解析判据见 Resolve-WfStatePath),
# 行 = 键(槽位 devN 或自定键)-> { topic, stage, note, sessionId, updatedAt }。
# sessionId = 桌面端会话身份(Claude Code 的 CLAUDE_CODE_HOST_SESSION_ID / DeepSeek Harness(DSH)的
# DSH_SESSION_ID,任一存在即取),每次写行自动刷新;会话名不存这里,由 占用面板 按该 id 去双 store
# (Claude 仓 / DSH 仓)现读(名字可被用户随时改;DSH 仓 zstd 压缩不可直读,降级只显短 id + 活跃时间)。
# 定位:补 git 推导不出的流程态(任务走到哪一步、被什么阻塞);占用权威在 git,
# 本文件非权威、可丢(丢失可从 git 与会话重建),与 git 矛盾时以 git 为准
# (占用面板 对账标注 STALE/未登记)。
# 用法:
#   看板.ps1 -Slot <N|键名|槽位路径> -Stage <阶段> [-Topic <主题>] [-Note <备注>]  # 登记看板/更新
#   看板.ps1 -Slot <N|键名|槽位路径> -StageFile <阶段文件> [-TopicFile ..] [-NoteFile ..]  # 同上,会话侧形态
#   看板.ps1 -Slot <N|键名|槽位路径> -Close                                        # 清行(任务闭环)
#   看板.ps1 -List                                                                 # 打印全部行
# 会话侧(经 powershell.exe -File 命令行)传阶段 / 主题 / 备注一律用 -StageFile / -TopicFile / -NoteFile
# (UTF-8,整份读入、换行折成空格):它们含中文与引号,不以字符串穿进程边界(shell-conventions「文本走文件」)。
# 字符串形态供脚本间调用;同一项的两种形态互斥,都给按参数错误拒。
# 阶段为自由字符串,建议词汇:实现中 / 交付中 / 待修复 / 阻塞:<一句原因>。
# 挂接正本:登记 = 槽位领取(经其内核)内置,就绪失败且占位未回滚时另记 阻塞:;流转 = 槽位交付(非成功出口记 阻塞:)
# 与 集成交付 内置;闭环清行 = 集成交付 内置;放弃槽位清行 = 槽位领取 -Abandon 内置(devflow 卡 references/slot-protocol.md「任务看板」)。
# 退出码:0 成功;2 参数错误。
#
# 读方(占用面板 / 槽位领取内核)只做 JSON 解析,故写出只需合法 JSON + UTF-8 无 BOM;
# 文本格式(缩进/键序)不构成契约。行为契约由 CLI 层测试 tests\看板CLI测试.ps1 锚定。
# 遥测:板文件在场时的解析是护栏步骤(护栏名 board-parse):解析成了记 guard-ok;解析失败按空板重建 = 降级,照打原 WARN、
# 另经 hook函数库 Write-Degraded 记 degraded(key board-parse-failed)。板文件缺失与顶层非对象(按空板、不打 WARN)两样都不记。
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Slot,
  [string]$Stage,
  [string]$Topic,
  [string]$Note,
  [string]$StageFile,
  [string]$TopicFile,
  [string]$NoteFile,
  [switch]$Close,
  [switch]$List
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

function Resolve-TextArg([string]$Name, [string]$Value, [string]$File) {
  # 字符串形态与文件形态二选一;文件形态读成一行。不合法即按参数错误退出(exit 2)。
  if (-not $File) { return $Value }
  if ($Value) { Write-Host ("ABORT: -" + $Name + " 与 -" + $Name + "File 互斥,二选一"); exit 2 }
  $text = Read-OneLineTextFile $File
  if ($null -eq $text) { Write-Host ("ABORT: " + $Name + "File not found: " + $File); exit 2 }
  return $text
}
$Stage = Resolve-TextArg "Stage" $Stage $StageFile
$Topic = Resolve-TextArg "Topic" $Topic $TopicFile
$Note  = Resolve-TextArg "Note"  $Note  $NoteFile

function Read-Board([string]$Path) {
  # 返回 OrderedDictionary(键序 = 文件内顺序);缺失 / 解析失败 / 非对象一律空板。
  $empty = [ordered]@{}
  if (-not (Test-Path $Path)) { return $empty }
  try {
    $obj = [System.IO.File]::ReadAllText($Path) | ConvertFrom-Json
  } catch {
    # 解析失败:备份 .bad,按空板重建。原 WARN 以「WARN:」起头,Write-Degraded 自带的 WARN 行以 6>$null 收掉,只取遥测。
    $why = $_.Exception.Message
    try { [System.IO.File]::Copy($Path, $Path + ".bad", $true) } catch {}
    Write-Host "WARN: board.json 解析失败,按空板重建(原文件已存 $Path.bad)"
    Write-Degraded "board-parse-failed" ($Path + " | " + $why) -Guard "board-parse" 6>$null
    return $empty
  }
  # 顶层非对象(数组 / 标量)按空板——ConvertFrom-Json 对 '[]' 回数组、对 '"x"' 回字符串
  if ($null -eq $obj -or -not ($obj -is [System.Management.Automation.PSCustomObject])) { return $empty }
  Write-GuardOk "board-parse"
  $board = [ordered]@{}
  foreach ($p in $obj.PSObject.Properties) { $board[$p.Name] = $p.Value }
  return $board
}

function Write-Board([string]$Path, $Board) {
  $dir = Split-Path $Path -Parent
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  # 空板写字面 {}:ConvertTo-Json 对空对象产出带空行的 "{`n`n}",无谓噪音
  $text = if ($Board.Count -gt 0) { $Board | ConvertTo-Json -Depth 5 } else { "{}" }
  # 临时文件 + 替换覆盖:不产生半截 JSON。临时名按进程唯一:固定名 .tmp 在两个写方交错时一方的 Replace
  # 会拿走另一方的临时件、后者 Replace 抛异常。读改写整段另由调用方持 board 锁串行(见下方主流程)。
  # File.Move 在 .NET Framework(PS 5.1)无 overwrite 重载,故存在时走 File.Replace。
  # 备份名必须传 [NullString]::Value 而非 $null——PowerShell 把 $null 绑到 .NET [string]
  # 形参时强制成空串,空串不是合法路径,Replace 会抛 "The path is not of a legal form."。
  $tmp = $Path + "." + $PID + "." + [Guid]::NewGuid().ToString("N").Substring(0, 8) + ".tmp"
  [System.IO.File]::WriteAllText($tmp, $text, (New-Object System.Text.UTF8Encoding($false)))
  if (Test-Path $Path) { [System.IO.File]::Replace($tmp, $Path, [NullString]::Value) }
  else                 { [System.IO.File]::Move($tmp, $Path) }
}

function Get-SortedKeysOrdinal($Board) {
  # Ordinal 排序:Sort-Object 的字符串比较是区域感知的,'-' 等标点与大小写的先后随区域设置变
  $keys = @($Board.Keys)
  [Array]::Sort($keys, [System.StringComparer]::Ordinal)
  return $keys
}

$path = Get-BoardPath

if ($List) {
  $b = Read-Board $path
  if ($b.Count -eq 0) { Write-Host "(看板为空)"; exit 0 }
  foreach ($k in (Get-SortedKeysOrdinal $b)) {
    $r = $b[$k]
    Write-Host ("{0,-8} {1,-14} {2}  ({3})" -f $k, [string]$r.stage, [string]$r.topic, [string]$r.updatedAt)
    if ($r.note) { Write-Host ("{0,-8} note: {1}" -f "", [string]$r.note) }
  }
  exit 0
}

if (-not $Slot) {
  Write-Host "usage: 看板.ps1 -Slot <N|键名|槽位路径> (-Stage <阶段> [-Topic ..] [-Note ..] | -Close) | -List"
  exit 2
}

# 键推导:数字→devN;路径形态(含分隔符)→从目录名折叠出 devN;其余按字面自定键
# (分隔符前提防串键:自定键即使以 dev<数字> 结尾也不折叠,如 mail-dev2 保持原样)
$slotArg = $Slot
$devMatch = [regex]::Match($slotArg, 'dev(\d+)[\\/]?$')
if ($slotArg -match '^\d+$') { $key = "dev" + $slotArg }
elseif (($slotArg.Contains('\') -or $slotArg.Contains('/')) -and $devMatch.Success) { $key = "dev" + $devMatch.Groups[1].Value }
else { $key = $slotArg }

# 读改写整段持 board 锁:无锁时两个会话同刻各读旧板、各写回,后写者抹掉先写者的行(清行丢失 / 行复活)。
# 锁取不到不阻断(看板非权威):照旧写,最多丢一次更新,与无锁时同一退化。
$boardLock = Enter-FlowLock "board" (Split-Path $path -Parent) ("看板 " + $Slot) 30
$b = Read-Board $path
if ($Close) {
  if ($b.Contains($key)) {
    $b.Remove($key)
    Write-Board $path $b
    Write-Host "CLOSED  $key"
  } else {
    Write-Host "NO-ROW  $key(看板无此行,无需清)"
  }
  Exit-FlowLock $boardLock
  exit 0
}

if (-not $Stage) {
  Exit-FlowLock $boardLock
  Write-Host "ABORT: 需要 -Stage(或 -Close / -List)"
  exit 2
}

$old = if ($b.Contains($key)) { $b[$key] } else { $null }
$keepTopic = if ($Topic) { $Topic } elseif ($old -and $old.topic) { [string]$old.topic } else { "" }
# sessionId:领取/续接的桌面端会话身份,取环境变量(会话调用本脚本时由 harness 注入;
# 双源取法正本 = hook函数库 Get-HostSessionId),每次写行自动刷新 —— 跳会话续接时无需额外挂接点即接管。
# 均缺失(Unity 子进程 / CLI 直调)时保留旧值,不擦除:读取侧靠它去 store 取会话名。
# 本文件可丢,故同一 id 在领取时另落 claim 提交 trailer 作兜底(见 槽位领取内核.ps1)。
$envSession = Get-HostSessionId
$keepSession = if ($envSession) { $envSession } elseif ($old -and $old.sessionId) { [string]$old.sessionId } else { "" }
$b[$key] = [ordered]@{
  topic     = $keepTopic
  stage     = $Stage
  note      = if ($Note) { $Note } else { "" }
  sessionId = $keepSession
  updatedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
}
Write-Board $path $b
Exit-FlowLock $boardLock
Write-Host ("BOARD   {0} -> {1}{2}" -f $key, $Stage, $(if ($Topic) { "($Topic)" } else { "" }))
exit 0
