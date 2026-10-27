# bat编码核对.ps1 - 仓内 .bat 纯 ASCII 静态扫描(纯字节,只读)。
# 准入: Since=2026-08-24 | Basis=存量 | Origin=750c9342d 入库,引入事故无记载 | Retire=仓内不再有 .bat 入口时
#
# 不变量:入仓候选(已跟踪 + 未跟踪未忽略)的每个 .bat,文件内容不含任何 >= 0x80 的字节。
#
# 为什么:cmd.exe 按系统 ANSI 代码页(简体中文 Windows 为 936/GBK)读取 .bat,而仓内文件是
# UTF-8。一个中文字符 UTF-8 占 3 字节、GBK 解成 2 字节,cmd 的文件读取指针每遇一个中文
# 字符累积 1 字节偏移,后续行从行中间开始被当命令执行。偏移量随中文字符数变化:落在注释
# 上只是噪音,落在 set 或 if 上就是变量没赋值、条件分支整块失效——两者都不报错,只在跑起来
# 才显形。已实测:Configs/GameConfig 的导表脚本(d6d56c05)注释被当命令执行。
#
# `chcp 65001` 不豁免:实测(chcp 65001 + 中文注释的探针 bat)仍然跑飞,故判据只有纯 ASCII
# 一条,不设 chcp 例外。中文注释写到同目录的 .md 里,bat 内留一行 ASCII 指路。
#
# 只查文件内容,不查文件名——文件名由文件系统处理,不经 cmd 的 bat 解析器。
#
# 出口码: 0 PASS(全部 .bat 纯 ASCII)
#         1 FAIL(至少一个 .bat 含非 ASCII 字节)
#         2 INFRA(仓根推不出 / git 列文件报错)
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # 槽位的 Demo,仓根 = 其父目录
)
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path $ProjectDir -Parent
if (-not (Test-Path -LiteralPath (Join-Path $repoRoot ".git"))) {
  Write-Host "VERDICT : INFRA - repo root '$repoRoot' is not a git checkout (.git missing)"; exit 2
}

# ── 入仓候选清单 ──────────────────────────────────────────
# 面 = 已跟踪 + 未跟踪未忽略(*.bat)。
# 主工程与人工入库通道是「先自检、再提交」,新建未 add 的文件此刻只在 --others 里,
# 只看已跟踪会让它自检照过后入仓。已删未提交的仍在索引里,下方逐个 Test-Path 跳过。
# -z 输出以 NUL 分隔、不做引号转义(中文名原样),stdout / stderr 各落临时文件再按 UTF-8 解:
# 直接接管道会按控制台代码页解码,中文文件名(仓内确有)解成乱码路径、后续读文件全落空。
# git 非零退出一律 INFRA——`>` 重定向会先建出空文件,不看退出码就把「git 报错」读成「空清单」放行。
$listFile = Join-Path $env:TEMP ("bat-scan-" + [Guid]::NewGuid().ToString("N") + ".txt")
$errFile  = $listFile + ".err"
try {
  & cmd /c "cd /d `"$repoRoot`" && git -c core.quotepath=false ls-files -z --cached --others --exclude-standard -- Demo/*.bat > `"$listFile`" 2> `"$errFile`""
  $gitCode = $LASTEXITCODE
  if ($gitCode -ne 0 -or -not (Test-Path -LiteralPath $listFile)) {
    $err = if (Test-Path -LiteralPath $errFile) { ([System.IO.File]::ReadAllText($errFile, [System.Text.Encoding]::UTF8)).Trim() } else { "" }
    Write-Host "VERDICT : INFRA - git ls-files failed (exit $gitCode): $err"; exit 2
  }
  # 未合并路径在 --cached 下按 stage 重复列出,去重
  $rels = @(([System.IO.File]::ReadAllText($listFile, [System.Text.Encoding]::UTF8) -split "`0") |
            Where-Object { $_ } | Sort-Object -Unique)
} finally {
  foreach ($f in @($listFile, $errFile)) { if (Test-Path -LiteralPath $f) { [System.IO.File]::Delete($f) } }
}

if ($rels.Count -eq 0) { Write-Host "OK  bat编码核对: no .bat in repo (tracked + untracked)"; exit 0 }

$bad = @()
foreach ($rel in $rels) {
  $full = Join-Path $repoRoot ($rel -replace '/', '\')
  if (-not (Test-Path -LiteralPath $full)) { continue }   # 已删未提交,不是本道的事
  $bytes = [System.IO.File]::ReadAllBytes($full)
  $line = 1
  $hits = @()
  foreach ($b in $bytes) {
    if ($b -eq 0x0A) { $line++ }
    elseif ($b -ge 0x80 -and $hits -notcontains $line) { $hits += $line }
  }
  if ($hits.Count -gt 0) { $bad += [pscustomobject]@{ Path = $rel; Lines = $hits } }
}

if ($bad.Count -gt 0) {
  Write-Host "VIOLATION bat编码核对: .bat files must be pure ASCII (cmd read-pointer drift)"
  foreach ($b in $bad) {
    $shown = @($b.Lines | Select-Object -First 12) -join ", "
    $more = if ($b.Lines.Count -gt 12) { " (+" + ($b.Lines.Count - 12) + " more)" } else { "" }
    Write-Host ("  " + $b.Path + "  non-ASCII at line: " + $shown + $more)
  }
  Write-Host "FIX: move the Chinese text into a .md next to the script, leave an ASCII pointer line in the .bat."
  exit 1
}

Write-Host ("OK  bat编码核对: " + $rels.Count + " .bat files, all pure ASCII")
exit 0
