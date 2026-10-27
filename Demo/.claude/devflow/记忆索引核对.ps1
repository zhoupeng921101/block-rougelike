# 记忆索引核对.ps1 — user 级项目自动记忆的「索引-文件一致性」确定性核对
#
# 背景:一条记忆的增/删要同时动两处——memory 文件本体 + MEMORY.md 索引行。
# 手工比对易漏一处(实发 2 次:删索引行留文件、删文件失败留索引),造成无主/悬空失配。
# 本脚本机械列目录 ∆ 索引链接,当场逮住失配,供 /rules-audit 记忆层审查 M1 判项调用。
#
# 退出码:0 = 一致;1 = 有无主或悬空(失配,含索引缺失),非零供检查/流程判失败;2 = 记忆目录不存在(INFRA)。
param(
    # 记忆目录;留空 = 按仓根推导(见下),不硬编码用户名与项目名
    [string]$MemDir = ""
)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

if (-not $MemDir) {
    # user 级项目自动记忆目录 = <USERPROFILE>\.claude\projects\<仓根 slug>\memory。
    # slug 是 harness 对仓根绝对路径的编码:非字母数字字符(盘符冒号、路径分隔符)全换 '-'
    # (C:\...\block-client -> C--Users-...-block-client)。仓根取 flow-config(留空则自推导),
    # 故换机器/换路径无需改本脚本。编码规则属 harness 侧,推导结果不存在时下方显式报错,
    # 不静默保障扫描——错目录上跑一致性核对会给出假通过。
    $slug = [regex]::Replace((Get-FlowConfig).RepoRoot, '[^A-Za-z0-9]', '-')
    $MemDir = Join-Path $env:USERPROFILE (Join-Path ".claude\projects" (Join-Path $slug "memory"))
}

# 目录不存在 = 推导或传参指错了地方,不是失配:判 INFRA,不在错目录上给结论。
if (-not (Test-Path -LiteralPath $MemDir -PathType Container)) {
    Write-Host "[INFRA] 记忆目录不存在:$MemDir"
    exit 2
}

$indexPath = Join-Path $MemDir 'MEMORY.md'
if (-not (Test-Path $indexPath)) {
    Write-Host "[FAIL] 索引不存在:$indexPath"
    exit 1
}

# 磁盘上的 memory 文件(排除索引本体)
$files = @(Get-ChildItem -Path $MemDir -Filter '*.md' -File |
    Where-Object { $_.Extension -eq '.md' -and $_.Name -ne 'MEMORY.md' } |
    ForEach-Object { $_.Name })

# MEMORY.md 里引用的 .md 链接目标(markdown 链接 ](xxx.md))
$indexText = [System.IO.File]::ReadAllText($indexPath)
$linked = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($m in [regex]::Matches($indexText, '\]\(([^)]+\.md)\)')) {
    [void]$linked.Add(($m.Groups[1].Value -split '[\\/]')[-1])
}

# 无主:有文件、索引无链接
$orphans = @($files | Where-Object { -not $linked.Contains($_) })
# 悬空:索引有链接、无文件
$fileSet = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($f in $files) { [void]$fileSet.Add($f) }
$dangling = @($linked | Where-Object { -not $fileSet.Contains($_) })

$ok = $true
if ($orphans.Count -gt 0) {
    $ok = $false
    Write-Host "[无主] 有文件、MEMORY.md 无索引行(共 $($orphans.Count)):"
    $orphans | ForEach-Object { Write-Host "  - $_" }
}
if ($dangling.Count -gt 0) {
    $ok = $false
    Write-Host "[悬空] MEMORY.md 有索引行、无对应文件(共 $($dangling.Count)):"
    $dangling | ForEach-Object { Write-Host "  - $_" }
}

if ($ok) {
    Write-Host "[OK] 索引-文件一致:$($files.Count) 文件 = $($linked.Count) 索引行"
    exit 0
} else {
    Write-Host "[FAIL] 索引-文件失配,成对处置(删文件必删索引行、反之亦然)"
    exit 1
}
