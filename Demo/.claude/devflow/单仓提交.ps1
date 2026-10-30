# 单仓提交.ps1 - 一键提交(+按通道推送):devflow 与人工入库通道的 Agent 提交入口。
# 它替代手打 git 序列(add -N / commit -F --pathspec-from-file /
# show --stat 核对 / push);提交检查的全部校验经 hooks/校验库.ps1 在脚本内同源执行,
# 脚本信道不绕过检查(单一校验正本,双触发信道:hook 拦命令面裸 git,本脚本内置校验)。
# 姿态 失败即停:任一校验不过或内部异常,在 git 写动作之前停下(hook 保持 失败放行
# 是怕误杀用户手敲命令;本脚本是自动化路径,无此顾虑)。
#
# 通道(按仓形判定,与 提交检查 同源):
#   主客户端(客户端仓根)            :清单式按路径提交;验凭据(客户端面容差)+ 表文档两项 +
#                                       持久化探测
#   槽位客户端(仓根命中 SlotRootRe) :自由 commit(槽位池已拆,残留 worktree 清掉前保留此通道)
#   槽位服务端(槽位根下的 Fantasy)   :自由 commit(同上,服务端通道关闭时不可达)
#   主服务端(仓根 leaf = ServerDirName):含 .cs 须 服务端自检 检查凭据(严格树校验)
# 推送:所有通道一律缺省不推,须显式 -Push。误推是不可回退的对外动作,缺省不承担它。
# 用法:
#   单仓提交.ps1 [-RepoDir <仓>] -MessageFile <信息文件> -PathListFile <清单文件>
#   单仓提交.ps1 [-RepoDir <仓>] -MessageFile <信息文件> -All        (仅槽位仓)
#   -Push 才推送;-CheckOnly 只跑全部校验、零 git 写(索引与工作树均不动)。
# PathListFile:每行一个路径,相对仓根(正反斜杠均可),按字面匹配(不作通配)。文件集由只读查询
# 取全仓现状后在脚本内按清单过滤;全部校验通过后才写:清单内未跟踪文件 add -N 登记、-All 的
# add -A 与图集剔除,提交失败则回滚登记。清单不拼进命令行:写入的 git 调用一律经
# --pathspec-from-file(NUL 分隔 UTF-8)传。提交信息一律走 -MessageFile(文本走文件:含中文/引号/
# 多行的信息穿命令行必出编码与引号事故;格式规范要求主题含全角【】,已无 ASCII 形态可用)。
# 主题行须为 `【动词】范围: 描述`,判定正本 = 校验库 Get-SubjectFormatGap;【修复】类须在正文写
# 根治 / 补丁结论(根治另写不变量),判定正本 = 校验库 Get-FixQualifyGap,缺则 DENIED-qualify。
# 缺 Co-Authored-By trailer 时自动补。
# 退出码:0 = 已提交(或 NOTHING-TO-COMMIT / CHECK-PASS);1 = 校验拒绝(零 git 写);
#         2 = 参数/infra/git 执行错;3 = 已提交但 push 失败(提交已留在本地)。
# 末行恒为 `VERDICT: <词> ...`,agent 只读末行,失败再读上文明细。
# 遥测(event=单仓提交,结论行 / 验证面漂移 / 内部异常各一行)经 Write-CommitTelemetry 一处写:环境里有
# 交付关联号时带 run(hook函数库 Get-DeliverRunId),没有时不写该字段。槽位图集还原(-All 形态剔除已跟踪图集)是护栏
# 步骤:还原成了记 guard-ok,没还原成(改动留在工作树)经 hook函数库 Write-Degraded 记 degraded,护栏名均为
# slot-atlas-restore;没有要剔的图集时两样都不记。
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$RepoDir = "",
  [string]$MessageFile = "",
  [string]$PathListFile = "",
  [switch]$All,
  [switch]$Push,
  [switch]$CheckOnly
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\校验库.ps1")

$script:Root = ""
$script:AddedNFile = ""     # 本脚本 add -N 登记所用的 pathspec 文件(未提交即退出时据此回滚)
$script:DidAddAll = $false  # -All 形态曾 add -A(未提交即退出时 reset 回滚)
$script:Committed = $false
$script:TempFiles = @()     # 本脚本建的临时文件,出口统一删

function Undo-Staging {
  if ($script:Committed -or -not $script:Root) { return }
  try {
    if ($script:DidAddAll) { cmd /c "git -C `"$script:Root`" reset -q 2>nul" | Out-Null }
    if ($script:AddedNFile) { cmd /c "git -C `"$script:Root`" --literal-pathspecs reset -q --pathspec-from-file=`"$script:AddedNFile`" --pathspec-file-nul 2>nul" | Out-Null }
  } catch {}
  $script:AddedNFile = ""; $script:DidAddAll = $false
}

function Write-CommitTelemetry([hashtable]$Fields) {
  # 本脚本 event=单仓提交 各行的唯一出口:有交付关联号时补 run 字段,为空不写。不抛。
  try {
    $run = Get-DeliverRunId
    if ($run) { $Fields["run"] = $run }
    Write-Telemetry $Fields
  } catch {}
}

function Write-Verdict([string]$Line, [int]$Code) {
  Undo-Staging
  foreach ($t in $script:TempFiles) { try { [System.IO.File]::Delete($t) } catch {} }
  try { Write-CommitTelemetry @{ event = "单仓提交"; verdict = ($Line -split '\s')[0]; repo = $script:Root; exit = $Code } } catch {}
  Write-Host ""
  Write-Host ("VERDICT: " + (Format-VerdictLine $Line))
  exit $Code
}

function New-PathspecFile([string[]]$Paths) {
  # 供 --pathspec-from-file --pathspec-file-nul 读的清单:NUL 分隔、UTF-8 无 BOM(git 按字节读路径,
  # 不做 quotepath 反转义,中文与空格原样)。路径不进命令行,长度无上限。
  $f = Join-Path $env:TEMP ("flow-commit-pathspec-" + [Guid]::NewGuid().ToString("N") + ".txt")
  $script:TempFiles += $f
  [System.IO.File]::WriteAllText($f, (($Paths -join "`0") + "`0"), (New-Object System.Text.UTF8Encoding($false)))
  return $f
}

function Add-PathWithAncestors($Set, [string]$Path) {
  # 路径及其各级父目录入集:清单项可以是目录,按 git pathspec 语义前缀匹配其下文件。
  $p = $Path.TrimEnd('/')
  while ($p) {
    if (-not $Set.Add($p)) { return }
    $i = $p.LastIndexOf('/', [System.StringComparison]::Ordinal)
    $p = if ($i -gt 0) { $p.Substring(0, $i) } else { "" }
  }
}

function Test-UnderList([string]$Path) {
  # 路径本身或其任一父目录在清单里 = 命中(git 字面 pathspec 的匹配语义)。
  $p = $Path.TrimEnd('/')
  while ($p) {
    if ($script:ListSet.Contains($p)) { return $true }
    $i = $p.LastIndexOf('/', [System.StringComparison]::Ordinal)
    $p = if ($i -gt 0) { $p.Substring(0, $i) } else { "" }
  }
  return $false
}

function Get-ListAddedLines([string]$Root, $Entries, $NewSet, [string]$HdrRe) {
  # 清单形态的「文件集内、域内新增行」。git diff 不支持 --pathspec-from-file,故先按合成的
  # `+++ b/<路径>` 头在脚本内筛出域内候选(常为零个,零则不发查询),已跟踪候选分批(每批命令
  # 行远低于 cmd 上限)交 校验库 Get-AddedLinesInDomain;未跟踪新文件尚未 add -N、不在 diff 里,
  # 其全部行即新增行,直接读盘。
  $out = @()
  $tracked = @()
  foreach ($e in $Entries) {
    if ($e.status -eq 'D') { continue }
    foreach ($p in $e.paths) {
      if (("+++ b/" + $p) -notmatch $HdrRe) { continue }
      if ($NewSet.Contains($p)) {
        foreach ($l in [System.IO.File]::ReadAllLines((Join-Path $Root ($p -replace '/', '\')), [System.Text.Encoding]::UTF8)) { $out += ("+" + $l) }
      } else {
        $tracked += $p
      }
    }
  }
  $i = 0
  while ($i -lt $tracked.Count) {
    $chunk = ""
    while ($i -lt $tracked.Count -and ($chunk.Length -eq 0 -or $chunk.Length + $tracked[$i].Length -lt 4000)) {
      $chunk += (' "' + $tracked[$i] + '"'); $i++
    }
    $out += Get-AddedLinesInDomain $Root ("-U0 HEAD --" + $chunk) $HdrRe
    if ($LASTEXITCODE -ne 0) { throw ("git 查询失败(exit " + $LASTEXITCODE + "):git diff -U0 HEAD --" + $chunk) }
  }
  return , $out
}

function Remove-SlotAtlasChanges([string]$Root, $AtlasEntries, [bool]$Staged) {
  # 槽位图集剔除的写动作(理由见文件集一节 -All 分支注释):入参只有 HEAD 里有的图集(M/D/T),
  # 已暂存的撤出暂存,再还原到 HEAD。只在 CheckOnly 早退之后调用。
  $all = @(); foreach ($e in $AtlasEntries) { $all += $e.paths[0] }
  if ($all.Count -eq 0) { return }
  if ($Staged) {
    $r = Invoke-GitMerged $Root ("--literal-pathspecs reset -q --pathspec-from-file=`"" + (New-PathspecFile $all) + "`" --pathspec-file-nul")
    if ($r.code -ne 0) { throw ("图集撤出暂存失败:" + ($r.lines -join " ")) }
  }
  $r = Invoke-GitMerged $Root ("--literal-pathspecs checkout -q HEAD --pathspec-from-file=`"" + (New-PathspecFile $all) + "`" --pathspec-file-nul")
  # 还原没成 = 护栏降级(剔除照常、提交照常,改动留在工作树占着槽位):经 Write-Degraded 打原 WARN 并记 degraded。
  if ($r.code -ne 0) {
    $gitOut = ($r.lines -join " ")
    Write-Degraded "slot-atlas-restore-failed" $gitOut ("图集还原到 HEAD 失败(改动留在工作树,未入提交):" + $gitOut) -Guard "slot-atlas-restore"
  } else {
    Write-GuardOk "slot-atlas-restore"
  }
}

try {
  # --- 0. 仓根与配置(加载失败 = 失败即停 exit 2) ---
  $base = if ($RepoDir) { ConvertTo-WinRepoPath $RepoDir } else { (Get-Location).Path }
  $rootLines = Get-GitLines $base "rev-parse --show-toplevel"
  if ($rootLines.Count -eq 0) { Write-Verdict ("DENIED-repo-unresolved | 无法解析 git 仓根(-RepoDir/cwd = " + $base + ")") 2 }
  $script:Root = $rootLines[0].Trim()
  $root = $script:Root
  $cfg = Get-FlowConfig
  if (-not $cfg.SlotRootRe) { Write-Verdict "DENIED-config | flow-config.psd1 关键键缺失(SlotRootRe)" 2 }
  # 仓处于合并中途态(别的交付撞冲突留在现场、或人工合并到一半)时不提交:-All 会把那次合并连同冲突现场
  # 一并提交,失败回滚的 reset 又会清掉它的合并态。发起方收尾或 merge --abort 后再提。先于一切暂存动作,零写入。
  if ((Invoke-GitMerged $root "rev-parse -q --verify MERGE_HEAD").code -eq 0) {
    Write-Verdict ("BLOCKED-MERGING | 仓处于合并中途态(MERGE_HEAD 在):" + $root + "。本脚本不代收尾也不提交;由该合并的发起方完成或 merge --abort 后重跑") 1
  }

  # 服务端仓判定与 提交检查 同源:仓根 leaf 等于 ServerDirName;服务端通道关闭(ServerDirName 留空)时没有服务端仓。
  $isServer      = ((Test-ServerEnabled) -and ($root -match ('[/\\]' + [regex]::Escape($cfg.ServerDirName) + '$')))
  $isSlotClient  = ($root -match $cfg.SlotRootRe)
  $parentDir     = Split-Path $root -Parent
  $isSlotFantasy = ($isServer -and ($parentDir -match $cfg.SlotRootRe))
  $isMainClient  = (-not $isServer -and -not $isSlotClient)

  # --- 1. 提交信息(文本走文件;主题行须合格式) ---
  if (-not $MessageFile) { Write-Verdict "DENIED-message | 须给 -MessageFile(提交信息一律走文件)" 1 }
  if (-not (Test-Path $MessageFile)) { Write-Verdict ("DENIED-message | 信息文件不存在:" + $MessageFile) 2 }
  $msgText = [System.IO.File]::ReadAllText($MessageFile, [System.Text.Encoding]::UTF8)
  if (-not $msgText.Trim()) { Write-Verdict "DENIED-message | 信息文件为空" 1 }
  $badSubject = Get-SubjectFormatGap $msgText
  if ($badSubject) {
    Write-Verdict ("DENIED-subject | 提交主题不合格式:「" + $badSubject + "」。须写成 【动词】范围: 描述(无范围时 【动词】描述);动词只取七词之一:新增/修复/变更/重构/删除/配置/文档,括号是全角【】,范围后半角冒号加空格;【流程】是机器提交保留词,人写路径不可用") 1
  }
  $qual = Get-FixQualifyGap $msgText
  if ($qual.Gap -eq "no-qual") {
    Write-Verdict "DENIED-qualify | 【修复】类提交正文须写根治 / 补丁结论(判据见 CLAUDE.md「修复前先定性」;补丁另写根源)" 1
  }
  if ($qual.Gap -eq "root-no-invariant") {
    Write-Verdict "DENIED-qualify | 定性为根治须同时写出它立住的不变量(正文含「不变量」)" 1
  }
  if ($msgText -notmatch 'Co-Authored-By:') {
    # 署名单源 = 校验库 $script:FlowCoAuthorTrailer。
    $msgText = $msgText.TrimEnd() + "`n`n" + $script:FlowCoAuthorTrailer
  }
  $msgTmp = Join-Path $env:TEMP ("flow-commit-msg-" + [Guid]::NewGuid().ToString("N") + ".txt")
  $script:TempFiles += $msgTmp
  [System.IO.File]::WriteAllText($msgTmp, $msgText, (New-Object System.Text.UTF8Encoding($false)))

  # --- 2. 文件集(与提交形态一致取集,镜像 提交检查) ---
  if ($All -and $PathListFile) { Write-Verdict "DENIED-fileset | -All 与 -PathListFile 只取其一" 1 }
  if (-not $All -and -not $PathListFile) { Write-Verdict "DENIED-fileset | 须给 -PathListFile(主仓协议)或 -All(仅槽位仓)" 1 }
  if ($All -and -not ($isSlotClient -or $isSlotFantasy)) {
    Write-Verdict "DENIED-fileset | -All 只允许槽位仓(agent 专属树);主仓走共享暂存区保护协议,必须 -PathListFile 按路径提交" 1
  }

  # 只读取集,零 git 写:全仓现状各取一次(索引 / 未跟踪 / 相对 HEAD 的改动),在脚本内按清单过滤。
  # 不把清单拼进 git 命令行——ls-files / ls-tree / diff 都不支持 --pathspec-from-file,拼接超 cmd
  # 8191 字符即静默取空(实发:150 条清单误报 NOTHING-TO-COMMIT)。写动作(add -N / add -A / 图集
  # 剔除)一律挪到 CheckOnly 早退之后,故校验拒绝与 CheckOnly 都不碰索引与工作树。
  # 相对 HEAD 取 --no-renames:过滤按单路径判,重命名拆成 D + A,路径集合与判重命名时一致。
  # 逐条 += 累加,不写 @(Get-GitLines ...) + @(Get-GitLines ...):Get-GitLines 以 `, $arr`
  # 防解包返回,外面再套 @() 会得到「元素是数组的 1 元数组」(与 hook函数库 Get-GitLines 头注同一族边界)。
  $ro = "--no-optional-locks -c core.quotepath=false "
  $diffEntries = ConvertTo-Entries (Get-GitLinesChecked $root ($ro + "diff HEAD --name-status --no-renames"))
  $untracked = Get-GitLinesChecked $root ($ro + "ls-files --others --exclude-standard")
  $entries = @()
  $newFiles = @()       # 清单形态:文件集内的未跟踪文件,校验通过后 add -N 登记
  $atlasEntries = @()   # -All 形态:从槽位提交剔除的已跟踪图集条目
  $listPaths = @()
  $script:ListSet = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::Ordinal)
  if ($PathListFile) {
    if (-not (Test-Path $PathListFile)) { Write-Verdict ("DENIED-fileset | 清单文件不存在:" + $PathListFile) 2 }
    $listPaths = @(Get-Content $PathListFile -Encoding UTF8 | ForEach-Object { (([string]$_).Trim() -replace '\\', '/').TrimEnd('/') } | Where-Object { $_ })
    if ($listPaths.Count -eq 0) { Write-Verdict "DENIED-fileset | 清单文件为空" 1 }
    foreach ($p in $listPaths) { [void]$script:ListSet.Add($p) }
    # 逐路径校验:git 已跟踪 或 磁盘存在;两者皆否 = 清单笔误,拒。「已跟踪」取索引 ∪ HEAD
    # 而非只取索引:删除项一旦被(本会话或共享暂存区上的并行会话)先行 stage,它就不在索引里了,
    # 而盘上也没有——只看索引会把这个合法的删除项误判成笔误。重命名的旧名正是此形态。
    # 真笔误在索引/HEAD/磁盘三处皆无,仍被拒。集合含各级父目录,清单项可以是目录。
    $idxSet = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    foreach ($t in (Get-GitLinesChecked $root ($ro + "ls-files"))) { Add-PathWithAncestors $idxSet ([string]$t).Trim() }
    $untrackedSet = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    foreach ($u in $untracked) { Add-PathWithAncestors $untrackedSet ([string]$u).Trim() }
    $headSet = $null
    $missing = @(); $ignored = @()
    foreach ($p in $listPaths) {
      if ($idxSet.Contains($p)) { continue }
      $fsPath = Join-Path $root ($p -replace '/', '\')
      if (Test-Path -LiteralPath $fsPath) {
        # 盘上有、索引无:未忽略的未跟踪文件进文件集;被 .gitignore 忽略的单文件 add -N 必失败,在此先拒
        if (-not $untrackedSet.Contains($p) -and (Test-Path -LiteralPath $fsPath -PathType Leaf)) { $ignored += $p }
        continue
      }
      if ($null -eq $headSet) {
        $headSet = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
        foreach ($t in (Get-GitLinesChecked $root ($ro + "ls-tree -r --name-only HEAD"))) { Add-PathWithAncestors $headSet ([string]$t).Trim() }
      }
      if (-not $headSet.Contains($p)) { $missing += $p }
    }
    if ($missing.Count -gt 0) { Write-Verdict ("DENIED-fileset | 清单路径既未被 git 跟踪也不在磁盘上(疑笔误):" + ($missing -join ", ")) 1 }
    if ($ignored.Count -gt 0) { Write-Verdict ("DENIED-fileset | 清单路径被 .gitignore 忽略、无法登记:" + ($ignored -join ", ")) 1 }
    foreach ($e in $diffEntries) { if (Test-UnderList $e.paths[0]) { $entries += , $e } }
    foreach ($u in $untracked) {
      $u = ([string]$u).Trim()
      if ($u -and (Test-UnderList $u)) { $newFiles += $u; $entries += , @{ status = "A"; paths = @($u) } }
    }
  } else {
    # 已跟踪图集 .spriteatlasv2 的改动从槽位提交剔除:它是导入期按目录自动重算的产物(成员由
    # EditorSpriteSaveInfo 按 ProjectSettings/AtlasConfiguration.asset 的 sourceAtlasRootDir
    # 逐张收集),多槽并发往同一目录加图会各自重算同一份 packables,合并必在同一处冲突,且检查/
    # 合并无收尾机制。这类改动还原到 HEAD(不留脏工作树 -> 不占 idle、无后续同步残留),入库路径
    # 是主工作树让编辑器导入重算后经 -PathListFile 清单式提交收口。还原是写动作,在 CheckOnly
    # 早退之后执行(见 Remove-SlotAtlasChanges 调用处);此处只把它排出校验用的文件集。
    # 全新图集(A)连同 .meta 随本槽位提交,不剔:图集 guid 在创建时定下,prefab 上 ExImage.spriteAtlas
    # 按 guid 引用它。剔掉本体只提 .meta 的旧做法会在基线留下无本体的 .meta,主编辑器导入时删掉它、
    # 重建图集换出新 guid,槽位 prefab 的引用静默断开;留在盘上的本体又在主树补提后挡住槽位合基线
    # (实发 2026-09-26 dev2:guid f52e 被换成 4a95,未跟踪图集挡 merge 报 INFRA)。
    $allEntries = @($diffEntries)
    foreach ($u in $untracked) { $u = ([string]$u).Trim(); if ($u) { $allEntries += , @{ status = "A"; paths = @($u) } } }
    foreach ($e in $allEntries) {
      if ($e.status -ne 'A' -and $e.paths[0] -match '\.spriteatlasv2$') { $atlasEntries += , $e } else { $entries += , $e }
    }
  }
  if ($entries.Count -eq 0) {
    if (-not $CheckOnly -and $atlasEntries.Count -gt 0) { Remove-SlotAtlasChanges $root $atlasEntries $false }
    Write-Verdict "NOTHING-TO-COMMIT | 文件集为空(清单路径相对 HEAD 无差异)" 0
  }
  $allPaths = @(); foreach ($e in $entries) { $allPaths += $e.paths }

  # --- 3. 校验(全部通过才动 git;任一不过 -> 拒,零写入) ---

  # 3a. 表源改动须伴随说明文档(槽位客户端在 push 点由 集成交付 承载,其余仓在 commit 点)
  if (-not $isSlotClient) {
    $docGap = Get-TableDocGap $allPaths
    if ($docGap.Count -gt 0 -and $msgText -notmatch '表文档无关') {
      Write-Verdict ("DENIED-tabledoc | 表源改动未伴随字段说明更新:" + (@($docGap | Select-Object -First 4) -join ", ") + "。同步 Configs/GameConfig/Datas/配置表说明.md 对应节(字段名/类型/说明/枚举取值)后重提;确无字段语义变化(仅样式/格式)时提交信息补「[表文档无关:理由]」") 1
    }
  }
  # 3a2. 说明文档不得转述表数据(同 3a 的承载分工:槽位客户端在 push 点由 集成交付 承载)
  $newSet = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::Ordinal)
  foreach ($n in $newFiles) { [void]$newSet.Add($n) }
  if (-not $isSlotClient -and $PathListFile) {
    $docAdded = Get-ListAddedLines $root $entries $newSet $script:TableDocHdrRe
    $docRows = @($docAdded | Where-Object { $_ -match $script:DocDataRowRe })
    if ($docRows.Count -gt 0 -and $msgText -notmatch '数据快照') {
      Write-Verdict ("DENIED-docdatarow | 配置表说明.md 新增了逐行罗列表数据的表格行(" + (@($docRows | Select-Object -First 3 | ForEach-Object { $_.TrimStart('+').Trim() }) -join "  /  ") + ")。抄进文档的表数据无闸校验其与 xlsx 一致,表一改即静默过时;改为一行指向源表后重提,确需固化时提交信息补「[数据快照:理由]」") 1
    }
  }
  # 3b. 本地持久化探测(仅主客户端;槽位在 push 点)
  if ($isMainClient -and $PathListFile) {
    $added = Get-ListAddedLines $root $entries $newSet $script:PersistScanHdrRe
    if (@($added | Where-Object { $_ -match $script:PersistRe }).Count -gt 0) {
      if ($msgText -notmatch '本地白名单') {
        Write-Verdict "DENIED-persist | 热更业务代码(GameLogic / GameBase)新增行含本地持久化调用(PlayerPrefs 写 / File 写),提交信息须含「[本地白名单:理由]」论证(data-authority);数据不可从服务端重建的应改走服务端权威" 1
      }
    }
  }
  # 3c. 验凭据(槽位服务端同槽位客户端:commit 自由,验凭据绑 push 点)
  if ($isServer -and -not $isSlotFantasy) {
    $srvGated = @($allPaths | Where-Object { $_ -match '\.cs$' })
    if ($srvGated.Count -gt 0) {
      $why = Get-TicketVerdict $root
      if (-not (Test-TicketVerdictPass $why)) {
        Write-Verdict ("DENIED-server-ticket-" + $why + " | 含 " + $srvGated.Count + " 个 .cs 而无有效服务端自检票。先跑 服务端自检.ps1 -FantasyRoot `"" + $root + "`"(0 错 0 警发票;检查后任何改动作废票)") 1
      }
    }
  } elseif ($isMainClient) {
    $gatedHit = @($allPaths | Where-Object { $_ -match $script:GatedRe })
    if ($gatedHit.Count -gt 0) {
      if (-not (Test-AllScratchDeletion $entries)) {
        $why = Get-TicketVerdict $root $script:ClientSurfaceRe
        if (-not (Test-TicketVerdictPass $why)) {
          Write-Verdict ("DENIED-ticket-" + $why + " | 含 " + $gatedHit.Count + " 个客户端代码文件而检查凭据无效(" + $why + ")。先通过检查:客户端自检.ps1 -ProjectDir <受测工程>(PASS 发票;检查后除删临时测试外改动作废票)") 1
        }
      }
    }
  }
  # 槽位客户端 / 槽位服务端:commit 自由(验凭据/表文档/持久化绑 push 点)

  if ($CheckOnly) { Write-Verdict ("CHECK-PASS | 全部校验通过,零 git 写(文件集 " + $allPaths.Count + " 项)") 0 }

  # --- 4. 暂存与提交(本节起才有 git 写;CheckOnly 与校验拒绝都到不了这里) ---
  if ($PathListFile) {
    # 清单内未跟踪文件 add -N 登记(commit --pathspec-from-file 只认 git 已知路径);提交失败时回滚
    if ($newFiles.Count -gt 0) {
      $addNFile = New-PathspecFile $newFiles
      $r = Invoke-GitMerged $root ("--literal-pathspecs add -N --pathspec-from-file=`"" + $addNFile + "`" --pathspec-file-nul")
      if ($r.code -ne 0) { Write-Verdict ("DENIED-fileset | add -N 登记失败 | " + ($r.lines -join " ")) 2 }
      $script:AddedNFile = $addNFile
    }
    $commitArgs = "--literal-pathspecs commit -F `"" + $msgTmp + "`" --pathspec-from-file=`"" + (New-PathspecFile $listPaths) + "`" --pathspec-file-nul"
  } else {
    $r = Invoke-GitMerged $root "add -A"
    if ($r.code -ne 0) { Write-Verdict ("DENIED-fileset | add -A 失败 | " + ($r.lines -join " ")) 2 }
    $script:DidAddAll = $true
    if ($atlasEntries.Count -gt 0) { Remove-SlotAtlasChanges $root $atlasEntries $true }
    $commitArgs = "commit -F `"" + $msgTmp + "`""
  }
  $r = Invoke-GitMerged $root $commitArgs
  if ($r.code -ne 0) { Write-Verdict ("GIT-COMMIT-FAILED | " + ($r.lines -join " ")) 2 }
  $script:Committed = $true
  $shaLines = Get-GitLines $root "rev-parse --short HEAD"
  $sha = if ($shaLines.Count -gt 0) { $shaLines[0].Trim() } else { "?" }

  # --- 5. 提交后核对(git show --stat 留痕 + 提交集 vs 清单机械比对) ---
  foreach ($l in (Get-GitLines $root "show --stat --format=medium HEAD")) { Write-Host $l }
  if ($PathListFile) {
    $committedPaths = Get-GitLines $root "-c core.quotepath=false show --name-only --format= HEAD"
    foreach ($cp in $committedPaths) {
      $c = ([string]$cp).Trim()
      if ($c -and ($allPaths -notcontains $c)) { Write-Host ("WARN 提交集含预期外路径:" + $c) }
    }
  }

  # --- 6. 验证面失配警示(主客户端与主服务端仓;同 hook 的 surface-drift,警示不拒) ---
  # 判定正本 = 校验库 Get-SurfaceDrift;两通道只在验证面正则与文案措辞上不同。槽位两仓提交点不验票,无从警示。
  $driftSurface = if ($isMainClient) { $script:ClientSurfaceRe } elseif ($isServer -and -not $isSlotFantasy) { $script:ServerSurfaceRe } else { "" }
  if ($driftSurface) {
    $driftPaths = Get-SurfaceDrift $root $driftSurface $allPaths
    if ($driftPaths.Count -gt 0) {
      $ch = if ($isServer) { "服务端" } else { "客户端" }
      Write-Host ("WARN " + $ch + "验证面内存在不属于本次提交的未提交改动(" + $driftPaths.Count + " 个,如 " + (@($driftPaths | Select-Object -First 4) -join ", ") + "):检查凭据认证整棵树,本提交产出的树未单独受测;若被提交代码依赖这些文件,推送后可能编译失败。呈报中点名或一并入库。")
      try { Write-CommitTelemetry @{ event = "单仓提交"; action = "commit"; decision = "allow"; reason = "surface-drift-warn"; repo = $root; files = $driftPaths.Count } } catch {}
    }
  }

  # --- 7. 推送(缺省一律不推,须显式 -Push) ---
  if ($Push) {
    $r = Invoke-GitMerged $root "push"
    if ($r.code -ne 0) { Write-Verdict ("PUSH-FAILED sha=" + $sha + " | 提交已留在本地,push 失败:" + ($r.lines -join " ") + " | 不强推;处置(重试/呈报)回会话") 3 }
    Write-Verdict ("COMMITTED sha=" + $sha + " pushed=yes") 0
  }
  Write-Verdict ("COMMITTED sha=" + $sha + " pushed=no") 0
} catch {
  try { Write-CommitTelemetry @{ event = "单仓提交"; decision = "error"; error = [string]$_; repo = $script:Root } } catch {}
  Write-Verdict ("INFRA | 内部异常:" + [string]$_) 2
}

