# 合并丢失核对.ps1 - 核对一个合并提交有没有把某一侧的内容「静默吃掉」:两侧都改过的文件里,
# 某一侧独有的内容大部分进了合并结果、却有少数几行凭空消失。只读,不改仓、不跑 dotnet。
#
# 为什么需要这道:git 自动合并在双方都改过的区域会择一侧而取,取错不报错。若被丢掉的那几行
# 当时没有引用点,编译照过、测试照过,丢失就此潜伏,直到某天别处新增代码去引用它才炸出来。
# 本仓实发两次,同一文件同一处:
#   2026-08 前 合并 031fefa2(Merge branch 'github_main' into main_test)丢掉上游
#     CSharpExporter.cs 的 hasErrorCodeField 守卫(上游侧父有 3 处引用、本仓侧父 0 处,合并取本仓侧)。
#     当时上游尚无引用它的代码,编译照过,无人察觉。
#   2026-09-07 同步上游 2026.1.2001 时,上游新增的深拷贝生成代码引用了它,才以 CS0103 暴露。
# 靠编译暴露等于靠运气:同形态的其它丢失只要暂时没有引用点撞上去,就一直看不见。本道把它变成
# 每次同步后可机判的一步。
#
# 判据:对文件 F 的某一侧 X,取 X 相对另一侧 Y 独有的行,看合并结果 M 吃进多少。
#   kept = |onlyX ∩ M|   lost = |onlyX - M|
#   lost > 0 即报,两侧各判一次 —— 上游侧丢失多见(同步场景),本仓侧丢失同样要抓
#   (自己的私有补丁被上游覆盖)。按 kept 是否为 0 分成「部分丢失」与「整侧丢弃」两组,
#   **这两组只是描述合并形态、便于人审时归类,不承担优先级,任一非空即 FAIL**。
#
# 为什么不按 kept 分优先级(这里踩过一次,留痕免得后人再试):初版设计成
# 「kept>0 = 静默丢失判 FAIL / kept=0 = 人为整侧裁决只列不判错」,理由是整侧弃掉像是有意为之。
# 拿 031fefa2 做验收,该假设当场被证伪:真正出事的 CSharpExporter.cs 恰好落在 kept=0 一侧
# (上游侧独有 7 行全没进合并),按初版判据它只会出现在低优先列表里,不 FAIL —— 也就是说
# 这道检查对它要防的那次事故本身是失效的。而同一轮里 kept>0 的条目多是版本号字面量升位
# 这类无害改动。kept 与「是否危险」不相关,甚至反相关,故不用它做判据。
#
# 由此本道的定位是**完备的人审清单**,不是精确的自动闸:它保证没有一处丢失能不被列出,
# 不保证列出的每一处都是问题。逐条确认「有意裁决」还是「丢失」是人的活,机器只负责不漏。
# 行归一化:去首尾空白、丢空行、丢纯括号行(`{` `}` `(` `)` 及其组合)。这三类是合并噪音,
# 计入会让 kept/lost 失真。**按行集合比对而非按序**:同一行在文件里挪了位置不算丢失。
#
# 声明形标注:丢失行里匹配声明形状的(var/字段/属性/方法/类型/using/预处理指令)标 [声明],
# 它们的丢失最可能是静默且有后果的 —— hasErrorCodeField 正是 `var x = ...` 这一形。
# 标注只影响展示排序,不影响判定:非声明行的丢失同样进 kept/lost 计数。
#
# 二进制与派生物不核:按 git numstat 判二进制(numstat 对二进制给 "-"),另按 $SkipRe 跳过
# 预编译产物与生成物目录 —— 它们的正确形态由「重建/重导」保证,逐行比对只会刷屏。
#
# 用法:
#   合并丢失核对.ps1 [-Merge <合并提交ish>] [-RepoDir <仓>] [-Full] [-MaxSample <n>]
#   -Merge     缺省 HEAD。须是恰好两个父的合并提交;非合并提交或章鱼合并判 INFRA。
#   -RepoDir   缺省 cwd 所在 git 仓根。跨仓核对时给(如在客户端仓里核服务端仓的合并)。
#   -Full      每条丢失逐行全列(缺省每条按 -MaxSample 截断)。
#   -MaxSample 每条最多展示几行样本,缺省 5;-Full 下不截断。
# 副作用:无。只跑 git 只读查询,blob 经 %TEMP% 中转后即删(避免 cmd 代码页把中文压坏)。
# 调用后:FAIL 的每一条都要人看 —— 确认是有意裁决就无事,确认是丢失则补回并在提交信息里写明。
#   同一处第二次出现禁止再补,须按 CLAUDE.md「修复前先定性」在源头修。
#
# 挂载点 = devflow 卡第三步「自审」的条件项(本轮以 merge 落地时做),亦可手动调用。
# 不挂进两端自检:它的输入是「一个合并提交」,而自检的输入是工作树,两者取数口径不同;
# 日常槽位交付的合并也不走本道,那条路的冲突由 合并预检.ps1 与冲突分流承载。
#
# 出口码: 0 PASS  (两侧独有内容全部进了合并,无一行丢失)
#         1 FAIL  (有丢失待人审;确认全部为有意裁决后即可继续,本道不记忆确认结果)
#         2 INFRA (仓根推不出 / -Merge 解析不出或不是双亲合并 / git 查询失败)
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Merge = "HEAD",
  [string]$RepoDir = "",
  [switch]$Full,
  [int]$MaxSample = 5
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

# 派生物与预编译产物:正确形态由重建/重导保证,不逐行核。
$SkipRe = '(?i)(/|^)(Generate|nupkg|bin|obj)/|\.(dll|pdb|exe|nupkg|so|dylib|meta|png|jpg|jpeg|gif|bmp|ico|ttf|otf|wav|mp3|ogg|fbx|asset|prefab|unity)$'

function Write-Verdict([string]$Line, [int]$Code) {
  Write-Host ""
  Write-Host ("VERDICT : " + $Line)
  exit $Code
}

# ── 仓根与合并提交 ────────────────────────────────────────
$base = if ($RepoDir) { $RepoDir } else { (Get-Location).Path }
$rootLines = Get-GitLines $base "rev-parse --show-toplevel"
if ($rootLines.Count -eq 0) { Write-Verdict ("INFRA - 无法解析 git 仓根(-RepoDir/cwd = " + $base + ")") 2 }
$root = $rootLines[0].Trim()

# 用 rev-list 而非 `rev-parse --verify <ish>^{commit}`:git 查询经 cmd /c 下发(Get-GitLines),
# cmd 把 `^` 当转义符吃掉,`^{commit}` 到 git 手上已残缺、解析必失败。
$mergeSha = Get-GitOne $root ("rev-list -n 1 " + $Merge)
if (-not $mergeSha) { Write-Verdict ("INFRA - -Merge 解析不出提交:" + $Merge) 2 }

$pl = Get-GitOne $root ("rev-list --parents -n 1 " + $mergeSha)
$parts = @($pl -split '\s+' | Where-Object { $_ })
if ($parts.Count -ne 3) {
  Write-Verdict ("INFRA - " + $Merge + " (" + $mergeSha.Substring(0,8) + ") 不是恰好两个父的合并提交(父数 = " + ($parts.Count - 1) + ");本道只核双亲合并") 2
}
$p1 = $parts[1]; $p2 = $parts[2]
$mbase = Get-GitOne $root ("merge-base " + $p1 + " " + $p2)
if (-not $mbase) { Write-Verdict "INFRA - 两个父推不出 merge-base" 2 }

$p1Sub = Get-GitOne $root ("log --format=%s -1 " + $p1)
$p2Sub = Get-GitOne $root ("log --format=%s -1 " + $p2)

Write-Host "==== 合并丢失核对 ===="
Write-Host ("仓      : " + $root)
Write-Host ("合并    : " + $mergeSha.Substring(0,8) + "  " + (Get-GitOne $root ("log --format=%s -1 " + $mergeSha)))
Write-Host ("父1     : " + $p1.Substring(0,8) + "  " + $p1Sub)
Write-Host ("父2     : " + $p2.Substring(0,8) + "  " + $p2Sub)
Write-Host ("基线    : " + $mbase.Substring(0,8))
Write-Host ""

# ── 两侧都改过的文件 ──────────────────────────────────────
# 下面三条查询的空结果是合法答案(某侧没改文件),Get-GitLines 又把 stderr 与退出码一并吞掉,
# 失败与「无改动」在输出上无从区分:对象库残缺时两侧清单皆空、交集为空,整道判 PASS。
# 故逐条核 git 退出码(cmd /c 把 git 的退出码透成 $LASTEXITCODE),非零即 INFRA。
function Get-GitLinesOrInfra([string]$GitArgs) {
  # 失败判据单源 = hook函数库 Get-GitLinesChecked;本脚本在此把它的抛出折成自己的 INFRA 出口。
  try { $lines = Get-GitLinesChecked $root $GitArgs } catch { Write-Verdict ("INFRA - " + $_.Exception.Message) 2 }
  return , $lines
}
# 直接赋值,不套 @():Get-GitLines 以 `, $arr` 防解包返回,外面再套 @() 会得到「元素是数组的
# 1 元数组」,Count 恒为 1(同 单仓提交.ps1 里记的同一个坑;本脚本首版实发,353 行被当成 1 行)。
$f1 = Get-GitLinesOrInfra ("-c core.quotepath=false diff --name-only " + $mbase + " " + $p1)
$f2 = Get-GitLinesOrInfra ("-c core.quotepath=false diff --name-only " + $mbase + " " + $p2)
$set2 = @{}
foreach ($f in $f2) { $set2[$f] = $true }
$overlap = @($f1 | Where-Object { $set2.ContainsKey($_) } | Sort-Object)

# 二进制:numstat 对二进制两列给 "-"
$binSet = @{}
$numstat = Get-GitLinesOrInfra ("-c core.quotepath=false diff --numstat " + $mbase + " " + $mergeSha)
foreach ($ln in $numstat) {
  # 用 [regex]::Match 而非 `-match` + $Matches:后者在左值意外是数组时降级为过滤运算,
  # 不设 $Matches,下一行索引就撞「无法对 Null 数组进行索引」(本脚本实发)。
  $m = [regex]::Match([string]$ln, '^-\s+-\s+(.+)$')
  if ($m.Success) { $binSet[$m.Groups[1].Value] = $true }
}

$cand = @($overlap | Where-Object { -not $binSet.ContainsKey($_) -and $_ -notmatch $SkipRe })
$skipped = $overlap.Count - $cand.Count
Write-Host ("两侧都改过的文件:" + $overlap.Count + " 个;核 " + $cand.Count + " 个,跳过 " + $skipped + " 个(二进制/派生物/预编译产物)")
Write-Host ""

# ── blob 取行(经临时文件,避开 cmd 代码页压坏非 ASCII)────
$tmpDir = Join-Path $env:TEMP ("flow-mergeloss-" + [Guid]::NewGuid().ToString("N"))
[System.IO.Directory]::CreateDirectory($tmpDir) | Out-Null

function Get-BlobLines([string]$Rev, [string]$Path) {
  # 回 @{ exists = $bool; set = HashSet[string]; }。归一:去首尾空白、丢空行、丢纯括号行。
  $tmp = Join-Path $tmpDir ([Guid]::NewGuid().ToString("N") + ".blob")
  cmd /c "git -C `"$root`" show `"$Rev`:$Path`" > `"$tmp`" 2>nul" | Out-Null
  $ok = ($LASTEXITCODE -eq 0) -and (Test-Path $tmp)
  $set = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::Ordinal)
  if ($ok) {
    foreach ($raw in [System.IO.File]::ReadAllLines($tmp, [System.Text.Encoding]::UTF8)) {
      $t = ([string]$raw).Trim()
      if ($t.Length -eq 0) { continue }
      if ($t -match '^[\{\}\(\)\[\];,]+$') { continue }
      [void]$set.Add($t)
    }
  }
  if (Test-Path $tmp) { [System.IO.File]::Delete($tmp) }
  return @{ exists = $ok; set = $set }
}

function Test-DeclShape([string]$Line) {
  if ($Line -match '^\s*(public|private|protected|internal|static|readonly|const|var|async|override|virtual|sealed|abstract|partial|extern)\b') { return $true }
  if ($Line -match '^\s*(class|struct|interface|enum|record|namespace|using|delegate|event)\b') { return $true }
  if ($Line -match '^\s*#\s*(if|elif|else|endif|define|undef|region|pragma)\b') { return $true }
  if ($Line -match '^\s*\[[A-Za-z_][\w\.]*') { return $true }   # 特性
  if ($Line -match '^\s*<[A-Za-z]+>.*</[A-Za-z]+>\s*$') { return $true }  # csproj 元素
  return $false
}

# ── 逐文件比对 ────────────────────────────────────────────
$mixed = New-Object System.Collections.ArrayList   # 部分丢失(kept > 0)
$whole = New-Object System.Collections.ArrayList   # 整侧丢弃(kept = 0)

foreach ($path in $cand) {
  $bM  = Get-BlobLines $mergeSha $path
  $b1  = Get-BlobLines $p1 $path
  $b2  = Get-BlobLines $p2 $path
  if (-not $bM.exists) { continue }   # 合并结果里没这个文件(被删),归属另一类问题,本道不判

  foreach ($side in @(
      @{ name = "父1(" + $p1.Substring(0,8) + ")"; me = $b1; other = $b2 },
      @{ name = "父2(" + $p2.Substring(0,8) + ")"; me = $b2; other = $b1 })) {
    if (-not $side.me.exists) { continue }
    $only = New-Object 'System.Collections.Generic.List[string]'
    foreach ($l in $side.me.set) { if (-not $side.other.set.Contains($l)) { [void]$only.Add($l) } }
    if ($only.Count -eq 0) { continue }
    $kept = 0
    $lost = New-Object 'System.Collections.Generic.List[string]'
    foreach ($l in $only) { if ($bM.set.Contains($l)) { $kept++ } else { [void]$lost.Add($l) } }
    if ($lost.Count -eq 0) { continue }
    $item = @{ path = $path; side = $side.name; kept = $kept; lost = $lost }
    if ($kept -gt 0) { [void]$mixed.Add($item) } else { [void]$whole.Add($item) }
  }
}

[System.IO.Directory]::Delete($tmpDir, $true)

function Show-Item($It, [int]$Max, [bool]$NoCap) {
  Write-Host ("  " + $It.path)
  Write-Host ("    " + $It.side + " 独有行:进了 " + $It.kept + " 行,丢了 " + $It.lost.Count + " 行")
  # 声明形排前:它们的丢失最可能静默且有后果,截断时优先保留在样本里。
  $decl = @($It.lost | Where-Object { Test-DeclShape $_ })
  $rest = @($It.lost | Where-Object { -not (Test-DeclShape $_) })
  $n = 0
  foreach ($l in @($decl) + @($rest)) {
    if (-not $NoCap -and $n -ge $Max) { Write-Host ("      ... 另有 " + ($It.lost.Count - $Max) + " 行(加 -Full 全列)"); break }
    $tag = "        "
    if (Test-DeclShape $l) { $tag = "  [声明] " }
    $show = $l
    if ($show.Length -gt 140) { $show = $show.Substring(0,140) + " ..." }
    Write-Host ($tag + $show)
    $n++
  }
  Write-Host ""
}

$noCap = [bool]$Full

Write-Host ("---- 部分丢失(该侧大部分内容进了合并,少数行没进)---- 共 " + $mixed.Count + " 条")
if ($mixed.Count -eq 0) { Write-Host "  无"; Write-Host "" }
else { foreach ($it in $mixed) { Show-Item $it $MaxSample $noCap } }

Write-Host ("---- 整侧丢弃(该侧独有内容整个没进合并)---- 共 " + $whole.Count + " 条")
if ($whole.Count -eq 0) { Write-Host "  无"; Write-Host "" }
else { foreach ($it in $whole) { Show-Item $it $MaxSample $noCap } }

$total = $mixed.Count + $whole.Count
if ($total -gt 0) {
  Write-Host "逐条确认是「有意裁决」还是「丢失」:丢失须补回并在提交信息里写明来龙去脉;"
  Write-Host "同一处第二次出现禁止再补,按 CLAUDE.md「修复前先定性」在源头修。"
  Write-Verdict ("FAIL   (" + $total + " 条丢失待人审:部分丢失 " + $mixed.Count + " / 整侧丢弃 " + $whole.Count + ")") 1
}
Write-Verdict "PASS   (两侧独有内容全部进了合并,无一行丢失)" 0
