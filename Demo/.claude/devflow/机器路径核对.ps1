# 机器路径核对.ps1 - 入仓脚本与 Editor 工具源码里的机器绝对路径静态扫描(纯文本,只读)。
# 准入: Since=2026-09-14 | Basis=存量 | Origin=9e5e37f25 私钥默认值写成本机绝对路径 | Retire=入仓脚本一律经配置 / 环境变量取路径且有构造保证时 | Reviewed=2026-10-08
#
# 不变量:入仓候选(已跟踪 + 未跟踪未忽略)的文件,其非注释行不含指向某一台具体机器的绝对路径。
#
# 为什么需要这道:入仓的文件跟着仓走,而绝对路径只在写它的那台机器上成立。换盘符、换机器、
# 开一个槽位 worktree,那条路径就指向不存在的位置——且几乎都不在写入时报错,而是在某次构建
# 或部署时才失败,报的还是下游症状(「文件不存在」「连不上」),要回溯几层才找到是一条被冻结
# 的路径。本仓已复发四次:BuildPipelineWindow 的私钥默认值(/d/work/...)、deploy.local.sh 的
# SSH_KEY(/e/... 且此前刚把 /d/ 订正过一次)、FantasyServerWindow 的 LegacyPrefRoot(注释自述
# 「工程搬家后仍指向旧目录」)、BuildCLI/path_define.bat(G:/github/TEngine,框架作者的机器)。
# 前三次都是就地把路径值改对的补丁,第四次仍在仓里——说明这类问题靠人看拦不住,只能机判。
#
# 判据只有一条:非注释行里出现绝对路径形态,且不在系统标准位置白名单内。不判路径是否存在
# ——存在与否恰恰因机而异,那正是要禁的东西。
#
# 豁免三类:
#   ① 注释行(行注释与块注释均识别)——注释里的路径是给人看的示例,不参与执行;
#   ② 系统标准位置(C:\Program Files、C:\Windows 等)——所有 Windows 机器同一位置,不是
#      个人目录布局。先例:deploy.bat 与 BuildPipelineWindow 都在 where git 失败后回落到
#      C:\Program Files\Git\bin\bash.exe,那是合法兜底;
#   ③ 行内标记 machine-path-ok:<理由> ——逃生舱。纯 ASCII 是有意的:.bat 受 bat编码核对
#      约束必须纯 ASCII,标记若含中文就在 .bat 里用不了。
#
# 扫描面(两端各扫自己那个仓,与 配置表前缀核对/跨端配置核对 同一姿态:只改一端的交付只跑
# 该端自检,单点挂载必漏):
#   客户端仓  只扫 Demo/ 下(仓里其余层不归本工程):
#             *.sh *.bat *.cmd *.ps1(排除 Demo/.claude/,那里由 静态扫描.ps1 的 R6
#             管引擎路径,且测试夹具本就该用虚构路径)
#             + Assets/Editor/ 与 Assets/TEngine/Editor/ 下的 *.cs
#             业务运行时 .cs 不在面内:病的载体是构建/部署/工具代码,实测全仓业务侧零命中,
#             纳入只会把 Plugins/Packages 里的 vendored 代码一起拖进来。
#   服务端仓  *.sh *.bat *.cmd *.ps1(排除 .claude/)+ 全部 *.cs(实测零命中,不预设排除)
#
# 挂载点 = 客户端自检.ps1 与 服务端自检.ps1 各自调用(两道都调,不是二选一)。
#
# 出口码: 0 PASS
#         1 FAIL(至少一处未豁免的机器绝对路径)
#         2 INFRA(仓根推不出 / 不是 git 检出 / git 列文件报错)
[CmdletBinding(PositionalBinding=$false)]
param(
  # 二者给其一即可(两个调用方各自持有其中一个),决定扫哪个仓、用哪组路径过滤。
  [string]$ProjectDir = "",    # <根>\Demo —— 客户端自检以 -ProjectDir 统一传参
  [string]$FantasyRoot = ""    # <根>\Fantasy      —— 服务端自检持有此值
)
$ErrorActionPreference = "Stop"

# ── 仓根与扫描面 ──────────────────────────────────────────
# 客户端仓根 = Demo 的父目录(Demo 是仓内子目录,Configs 与 Tools 与它同层);
# 服务端仓根 = Fantasy 目录本身(独立仓)。槽位是仓根级 worktree,同一推导对主仓与槽位都成立。
if ($ProjectDir) {
  $repoRoot = Split-Path $ProjectDir -Parent
  $side     = "client"
} elseif ($FantasyRoot) {
  $repoRoot = $FantasyRoot
  $side     = "server"
} else {
  Write-Host "VERDICT : INFRA - 需给 -ProjectDir 或 -FantasyRoot 之一(用于推导仓根)"; exit 2
}

if (-not (Test-Path -LiteralPath (Join-Path $repoRoot ".git"))) {
  Write-Host "VERDICT : INFRA - repo root '$repoRoot' is not a git checkout (.git missing)"; exit 2
}

# 路径过滤在 PowerShell 侧做,不写进 git pathspec:排除语法 :(exclude) 含括号、:! 含叹号,
# 穿 cmd /c 的字符串要逐层转义,过滤规则读起来也不如这里直白。
function Test-InScanSurface([string]$rel) {
  $ext = [System.IO.Path]::GetExtension($rel).ToLowerInvariant()
  if ($ext -eq ".cs") {
    if ($side -eq "server") { return $true }
    return ($rel -like "Demo/Assets/Editor/*" -or $rel -like "Demo/Assets/TEngine/Editor/*")
  }
  if ($ext -notin @(".sh", ".bat", ".cmd", ".ps1")) { return $false }
  # .claude 下的脚本不在面内(理由见头注扫描面节)。两端的 .claude 位置不同,故两条都判。
  if ($rel -like "Demo/.claude/*" -or $rel -like ".claude/*") { return $false }
  return $true
}

# ── 入仓候选清单 ──────────────────────────────────────────
# 面 = 已跟踪 + 未跟踪未忽略(扩展名过滤在 git 侧,目录过滤在 Test-InScanSurface)。
# 主工程与人工入库通道是「先自检、再提交」,新建未 add 的文件此刻只在 --others 里,
# 只看已跟踪会让它自检照过后入仓。已删未提交的仍在索引里,下方逐个 Test-Path 跳过。
# -z 输出以 NUL 分隔、不做引号转义(中文名原样),stdout / stderr 各落临时文件再按 UTF-8 解:
# 直接接管道会按控制台代码页解码,中文文件名(仓内确有)解成乱码路径、后续读文件全落空。
# git 非零退出一律 INFRA——`>` 重定向会先建出空文件,不看退出码就把「git 报错」读成「空清单」放行。
$listFile = Join-Path $env:TEMP ("machinepath-scan-" + [Guid]::NewGuid().ToString("N") + ".txt")
$errFile  = $listFile + ".err"
# 客户端仓只扫 Demo/ 下:仓里其余层(研究资料、复刻件)不归本工程的 devflow,槽位稀疏检出后也没有它们。
$specPrefix = if ($side -eq "client") { "Demo/" } else { "" }
$pathspec = (@("*.sh", "*.bat", "*.cmd", "*.ps1", "*.cs") | ForEach-Object { $specPrefix + $_ }) -join " "
try {
  & cmd /c "cd /d `"$repoRoot`" && git -c core.quotepath=false ls-files -z --cached --others --exclude-standard -- $pathspec > `"$listFile`" 2> `"$errFile`""
  $gitCode = $LASTEXITCODE
  if ($gitCode -ne 0 -or -not (Test-Path -LiteralPath $listFile)) {
    $err = if (Test-Path -LiteralPath $errFile) { ([System.IO.File]::ReadAllText($errFile, [System.Text.Encoding]::UTF8)).Trim() } else { "" }
    Write-Host "VERDICT : INFRA - git ls-files failed (exit $gitCode): $err"; exit 2
  }
  # 未合并路径在 --cached 下按 stage 重复列出,去重
  $rels = @(([System.IO.File]::ReadAllText($listFile, [System.Text.Encoding]::UTF8) -split "`0") |
            Where-Object { $_ -and (Test-InScanSurface $_) } | Sort-Object -Unique)
} finally {
  foreach ($f in @($listFile, $errFile)) { if (Test-Path -LiteralPath $f) { [System.IO.File]::Delete($f) } }
}

if ($rels.Count -eq 0) { Write-Host "OK  机器路径核对: no file in scan surface"; exit 0 }

# ── 判据 ──────────────────────────────────────────────────
# 绝对路径两形态:Windows 盘符(D:\ 或 D:/)与 Git-Bash 盘符(/d/)。后向断言挡掉 URL——
# "https://x" 里的 "s:/" 前是字母,不算盘符;"//download" 不是 /<单字母>/ 形态。
$pathRe = [regex]'(?<![A-Za-z0-9_])(?<p>[A-Za-z]:[\\/][^\s"''<>|]*|/[a-z]/[A-Za-z0-9_][^\s"''<>|]*)'
# 白名单按「匹配位置起的整行剩余部分」比前缀,不按提取出的路径串:后者遇空格即止,
# "C:\Program Files\Git" 会被截成 "C:\Program",比不上带空格的前缀。
$systemPrefixes = @(
  'C:\Program Files', 'C:\Program Files (x86)', 'C:\Windows', 'C:\ProgramData',
  '/c/Program Files', '/c/Program Files (x86)', '/c/Windows', '/c/ProgramData'
)
$exemptMark = 'machine-path-ok:'

# 行注释标记按扩展名分派;块注释按扩展名给起止对(.bat / .sh 没有块注释形态)。
function Get-CommentSyntax([string]$ext) {
  switch ($ext) {
    ".cs"  { return @{ Line = @('//');        BlockOpen = '/*';  BlockClose = '*/' } }
    ".ps1" { return @{ Line = @('#');         BlockOpen = '<#';  BlockClose = '#>' } }
    ".sh"  { return @{ Line = @('#');         BlockOpen = $null; BlockClose = $null } }
    default { return @{ Line = @('rem ', '::', '@rem '); BlockOpen = $null; BlockClose = $null } }
  }
}

$bad = @()
foreach ($rel in $rels) {
  $full = Join-Path $repoRoot ($rel -replace '/', '\')
  if (-not (Test-Path -LiteralPath $full)) { continue }   # 已删未提交,不是本道的事
  $text = [System.IO.File]::ReadAllText($full, [System.Text.Encoding]::UTF8)
  if (-not $pathRe.IsMatch($text)) { continue }           # 全文无候选,跳过逐行精判

  $ext = [System.IO.Path]::GetExtension($rel).ToLowerInvariant()
  $syn = Get-CommentSyntax $ext
  $lines = $text -split "`r?`n"
  $inBlock = $false
  $lineNo = 0
  foreach ($line in $lines) {
    $lineNo++
    $trimmed = $line.TrimStart()

    # 块注释状态推进先于命中判定:开在本行的块,本行余下部分已是注释。
    if ($inBlock) {
      if ($syn.BlockClose -and $line.Contains($syn.BlockClose)) { $inBlock = $false }
      continue
    }
    if ($syn.BlockOpen -and $trimmed.StartsWith($syn.BlockOpen, [System.StringComparison]::Ordinal)) {
      if (-not $line.Contains($syn.BlockClose)) { $inBlock = $true }
      continue
    }

    $isComment = $false
    foreach ($mark in $syn.Line) {
      if ($trimmed.ToLowerInvariant().StartsWith($mark, [System.StringComparison]::Ordinal)) { $isComment = $true; break }
    }
    if ($isComment) { continue }
    if ($line.Contains($exemptMark)) { continue }

    foreach ($m in $pathRe.Matches($line)) {
      $rest = $line.Substring($m.Index)
      $isSystem = $false
      foreach ($prefix in $systemPrefixes) {
        if ($rest.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) { $isSystem = $true; break }
      }
      if ($isSystem) { continue }
      $bad += [pscustomobject]@{ Path = $rel; Line = $lineNo; Text = $m.Groups['p'].Value }
    }
  }
}

if ($bad.Count -gt 0) {
  Write-Host "VIOLATION 机器路径核对: repo files must not carry machine-specific absolute paths"
  foreach ($b in @($bad | Select-Object -First 20)) {
    Write-Host ("  " + $b.Path + ":" + $b.Line + "  " + $b.Text)
  }
  if ($bad.Count -gt 20) { Write-Host ("  (+" + ($bad.Count - 20) + " more)") }
  Write-Host "FIX: derive the path at run time (script location / project root), take it from a"
  Write-Host "     gitignored local config, or accept it as an input parameter. If the path is a"
  Write-Host "     genuine system-wide location, add it to `$systemPrefixes in this script; for a"
  Write-Host "     one-off exception put 'machine-path-ok: <reason>' on the line."
  exit 1
}

Write-Host ("OK  机器路径核对: " + $rels.Count + " files, tracked + untracked (" + $side + "), no machine-specific path")
exit 0
