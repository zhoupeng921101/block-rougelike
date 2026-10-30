# 提交.ps1 - DeepSeek(DSH)侧的提交入口。
# 为什么存在:Claude 侧 .claude/settings.json 的 hooks 在命令面自动兜三件事(提交检查 / 命令通路检查 /
# 写文件补 BOM),DSH 没有 hook 机制;本脚本把其中两件收编成一个入口:补 BOM -> 可选客户端自检 ->
# 单仓提交.ps1。判据不在这里重写:提交校验仍由 单仓提交.ps1 同源执行(校验正本 =
# .claude/devflow/hooks/校验库.ps1),本脚本只管 BOM 与调用顺序。命令通路检查没有对应物:DSH 侧
# 不存在「Bash 拉 powershell」「cmd 裸名调 bat」两条通路,脚本调用一律 powershell.exe -File。
#
# 用法:
#   .dsh\scripts\提交.ps1 -RepoDir <仓> -MessageFile <信息文件> -PathListFile <清单文件> [-Gate] [-CheckOnly]
# -RepoDir 缺省 = 当前目录;仓根由 git 解析。
# 不提供 -Push:本入口服务 devflow 与人工入库通道,两条通道都不推送(判据正本 = CLAUDE.md
# 「devflow 适用面」)。
# BOM 面 = 本次提交的文件集里的 .ps1 / .psd1:含非 ASCII、是合法 UTF-8 且无 BOM 时于原字节前补
# EF BB BF(判据同 hooks\写入补BOM.ps1);非法 UTF-8 的只报不动。-CheckOnly 下只报 BOM 候选、不写。
# -Gate 先跑 客户端自检.ps1(-ProjectDir <仓根>\Demo,分钟级):不过即停、不提交,末行补
# `VERDICT: GATE-FAIL ...`。长跑建议调用方放后台作业。
# 出口码:沿用 单仓提交.ps1(0 已提交 / CHECK-PASS,1 校验拒绝,2 infra,3 已提交但 push 失败)与
#         客户端自检.ps1(-Gate 时 1 FAIL / 2 INFRA / 3 STALE);末行 VERDICT 原样透传。
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$RepoDir = "",
  [Parameter(Mandatory = $true)][string]$MessageFile,
  [string]$PathListFile = "",
  [switch]$Gate,
  [switch]$CheckOnly
)
$ErrorActionPreference = "Stop"

$script:FlowDir = Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) "Demo\.claude\devflow"
. (Join-Path $script:FlowDir "hooks\校验库.ps1")

function Write-Verdict([string]$Line, [int]$Code) {
  Write-Host ""
  Write-Host ("VERDICT: " + (Format-VerdictLine $Line))
  exit $Code
}

# 仓根:与 单仓提交.ps1 同法(git rev-parse),失败即停。
$base = if ($RepoDir) { $RepoDir } else { (Get-Location).Path }
$root = $null
try { $root = [string](& git -C $base rev-parse --show-toplevel 2>$null | Select-Object -First 1) } catch {}
if (-not $root) { Write-Verdict ("DENIED-repo-unresolved | 无法解析 git 仓根(-RepoDir/cwd = " + $base + ")") 2 }

# 本次提交的文件集:BOM 面据此枚举。给不出清单时交给 单仓提交 拒绝,本脚本不代判。
$relPaths = @()
if ($PathListFile) {
  if (-not (Test-Path -LiteralPath $PathListFile)) { Write-Verdict ("DENIED-fileset | 清单文件不存在:" + $PathListFile) 2 }
  $relPaths = @(Get-Content -LiteralPath $PathListFile -Encoding UTF8 | ForEach-Object { ([string]$_).Trim() } | Where-Object { $_ })
}

# 补 BOM:含非 ASCII 的 .ps1 / .psd1 无 BOM 时 5.1 按 GBK 解析。只补不转码,非法 UTF-8 只报。
foreach ($rel in $relPaths) {
  if ($rel -notmatch '(?i)\.ps(d?)1$') { continue }
  $full = Join-Path $root ($rel -replace '/', '\')
  if (-not [System.IO.File]::Exists($full)) { continue }
  $bytes = [System.IO.File]::ReadAllBytes($full)
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) { continue }
  $nonAscii = $false
  foreach ($x in $bytes) { if ($x -ge 0x80) { $nonAscii = $true; break } }
  if (-not $nonAscii) { continue }
  try { $null = (New-Object System.Text.UTF8Encoding($false, $true)).GetString($bytes) }
  catch {
    Write-Host ("BOM: skip (not utf-8) " + $rel)
    continue
  }
  if ($CheckOnly) { Write-Host ("BOM: would add " + $rel); continue }
  $withBom = New-Object byte[] ($bytes.Length + 3)
  $withBom[0] = 0xEF; $withBom[1] = 0xBB; $withBom[2] = 0xBF
  [Array]::Copy($bytes, 0, $withBom, 3, $bytes.Length)
  [System.IO.File]::WriteAllBytes($full, $withBom)
  Write-Host ("BOM: added " + $rel)
}

# -Gate:先在当前树上跑客户端自检。BOM 之后再跑,否则补 BOM 改树会让凭据判 STALE。
if ($Gate) {
  $projectDir = Join-Path $root "Demo"
  if (-not (Test-Path -LiteralPath (Join-Path $projectDir "ProjectSettings\ProjectVersion.txt"))) {
    Write-Verdict ("DENIED-gate | 不是 Unity 工程:" + $projectDir) 2
  }
  Write-Host "GATE: 客户端自检 ..."
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $script:FlowDir "客户端自检.ps1") -ProjectDir $projectDir
  $gateCode = $LASTEXITCODE
  if ($gateCode -ne 0) {
    Write-Verdict ("GATE-FAIL | 客户端自检 exit=" + $gateCode + ";本次未提交") $gateCode
  }
}

# 提交:全部校验由 单仓提交.ps1 同源执行(脚本信道,失败即停)。
$cli = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", (Join-Path $script:FlowDir "单仓提交.ps1"),
  "-RepoDir", $root, "-MessageFile", $MessageFile)
if ($PathListFile) { $cli += @("-PathListFile", $PathListFile) }
if ($CheckOnly) { $cli += "-CheckOnly" }
& powershell.exe @cli
exit $LASTEXITCODE
