# 启动器字体核对测试.ps1 — 启动器字体核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%)。
# 覆盖:基线覆盖 / 新文案带进缺字(回归位)/ 注释里的字也算 / 回车换行制表与文件头 BOM 不计 /
#   BMP 之外的字 / format 4 经 glyphIdArray 的段 / 扫描面边界(子目录扫、非 .cs 与 Launcher 之外不扫)/
#   字体缺失、无 cmap、子表格式不支持、文件截断、Launcher 目录缺失五类 INFRA。
# 夹具字体是手拼的最小字节串(sfnt 头 + 一条表目录 + cmap 表):被测件只读表目录与 cmap,
#   不需要一份真字体,测试也就不依赖 python / fonttools。
# T2 是回归位:1cae062e5 —— 字体收窄后同期合入的文案带进 39 个缺字,界面上静默空白。
# 跑法:启动器字体核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 启动器字体核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "启动器字体核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-launcherfont-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

function Add-BE16($List, [int]$V) { $List.Add([byte](($V -shr 8) -band 0xFF)); $List.Add([byte]($V -band 0xFF)) }
function Add-BE32($List, [long]$V) { Add-BE16 $List ([int](($V -shr 16) -band 0xFFFF)); Add-BE16 $List ([int]($V -band 0xFFFF)) }

# 把一张 cmap 子表包成最小字体。$TableTag 可改写表目录里的标签(造「无 cmap 表」用)。
function New-FontFromSubtable([byte[]]$Sub, [int]$EncodingId, [string]$TableTag = "cmap") {
  $f = New-Object 'System.Collections.Generic.List[byte]'
  $f.AddRange([System.Text.Encoding]::ASCII.GetBytes("OTTO"))
  Add-BE16 $f 1; Add-BE16 $f 0; Add-BE16 $f 0; Add-BE16 $f 0                    # numTables = 1
  $f.AddRange([System.Text.Encoding]::ASCII.GetBytes($TableTag))
  Add-BE32 $f 0; Add-BE32 $f 28; Add-BE32 $f (12 + $Sub.Length)                # checksum / offset / length
  Add-BE16 $f 0; Add-BE16 $f 1                                                  # cmap 头:version / numTables
  Add-BE16 $f 3; Add-BE16 $f $EncodingId; Add-BE32 $f 12                        # 编码记录:平台 3
  $f.AddRange($Sub)
  return , $f.ToArray()
}

# format 4:每个码位各占一段、idRangeOffset 全 0,末尾补 0xFFFF 终止段。
function New-Font4([int[]]$Codepoints) {
  $cps = @($Codepoints | Sort-Object -Unique)
  $seg = $cps.Count + 1
  $s = New-Object 'System.Collections.Generic.List[byte]'
  Add-BE16 $s 4; Add-BE16 $s (16 + 8 * $seg); Add-BE16 $s 0
  Add-BE16 $s (2 * $seg); Add-BE16 $s 0; Add-BE16 $s 0; Add-BE16 $s 0
  foreach ($c in $cps) { Add-BE16 $s $c }; Add-BE16 $s 0xFFFF                   # endCode
  Add-BE16 $s 0                                                                 # reservedPad
  foreach ($c in $cps) { Add-BE16 $s $c }; Add-BE16 $s 0xFFFF                   # startCode
  $gid = 1
  foreach ($c in $cps) { Add-BE16 $s (($gid - $c) -band 0xFFFF); $gid++ }; Add-BE16 $s 1   # idDelta
  for ($i = 0; $i -lt $seg; $i++) { Add-BE16 $s 0 }                             # idRangeOffset
  return , (New-FontFromSubtable $s.ToArray() 1)
}

# format 4:一段连续码位经 glyphIdArray 取字形号,数组里记 0 的码位 = 字体里没有这个字。
function New-Font4ViaArray([int]$Start, [int[]]$GlyphIds) {
  $s = New-Object 'System.Collections.Generic.List[byte]'
  Add-BE16 $s 4; Add-BE16 $s (16 + 8 * 2 + 2 * $GlyphIds.Count); Add-BE16 $s 0
  Add-BE16 $s 4; Add-BE16 $s 0; Add-BE16 $s 0; Add-BE16 $s 0                    # segCountX2 = 4(两段)
  Add-BE16 $s ($Start + $GlyphIds.Count - 1); Add-BE16 $s 0xFFFF                # endCode
  Add-BE16 $s 0
  Add-BE16 $s $Start; Add-BE16 $s 0xFFFF                                        # startCode
  Add-BE16 $s 0; Add-BE16 $s 1                                                  # idDelta
  Add-BE16 $s 4; Add-BE16 $s 0                                                  # idRangeOffset:第 0 段指向紧随其后的 glyphIdArray
  foreach ($g in $GlyphIds) { Add-BE16 $s $g }
  return , (New-FontFromSubtable $s.ToArray() 1)
}

# format 12:每个码位一组,能装 BMP 之外的字。
function New-Font12([int[]]$Codepoints) {
  $cps = @($Codepoints | Sort-Object -Unique)
  $s = New-Object 'System.Collections.Generic.List[byte]'
  Add-BE16 $s 12; Add-BE16 $s 0
  Add-BE32 $s (16 + 12 * $cps.Count); Add-BE32 $s 0; Add-BE32 $s $cps.Count
  $gid = 1
  foreach ($c in $cps) { Add-BE32 $s $c; Add-BE32 $s $c; Add-BE32 $s $gid; $gid++ }
  return , (New-FontFromSubtable $s.ToArray() 10)
}

# 文本里的全部码位(回车换行制表除外),喂给字体夹具当「恰好覆盖」的字符集。
function Get-Cps([string]$Text) {
  $out = @()
  for ($i = 0; $i -lt $Text.Length; $i++) {
    $ch = $Text[$i]
    if ($ch -eq "`r" -or $ch -eq "`n" -or $ch -eq "`t") { continue }
    if ([char]::IsHighSurrogate($ch) -and $i + 1 -lt $Text.Length) { $out += [char]::ConvertToUtf32($ch, $Text[$i + 1]); $i++ }
    else { $out += [int]$ch }
  }
  return $out
}

# 夹具工程:<root>\Demo\Assets\Launcher 下按相对路径放源文件,字体可缺省不放。返回 Demo 路径。
function New-Fx([hashtable]$Sources, [byte[]]$Font) {
  $pd = Join-Path (Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))) "Demo"
  New-Item -ItemType Directory -Force -Path (Join-Path $pd "Assets\Launcher") | Out-Null
  foreach ($rel in $Sources.Keys) { Write-Src (Join-Path $pd ("Assets\Launcher\" + $rel)) $Sources[$rel] }
  if ($Font) {
    $fp = Join-Path $pd "Assets\Launcher\Resources\Fonts\LauncherFont.otf"
    New-Item -ItemType Directory -Force -Path (Split-Path $fp -Parent) | Out-Null
    [System.IO.File]::WriteAllBytes($fp, $Font)
  }
  return $pd
}

try {
  # 基线源码自带一行注释,好让注释符本身在字体里:后面各例只多出要验的那一个字。
  $base = "// A`nclass A {`n  string s = `"确定`";`n}`n"
  $baseCps = Get-Cps $base

  # T1 基线:源码用字恰好都在字体里
  $pd = New-Fx @{ "Scripts\A.cs" = $base } (New-Font4 $baseCps)
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0 -and $r.out -match 'OK\s+启动器字体核对: 1 \.cs') "T1 源码用字全在字体里 -> PASS"

  # T2 回归位:加了新文案没重生成字体(1cae062e5 的同形态)
  $pd = New-Fx @{ "Scripts\A.cs" = $base; "Scripts\B.cs" = "class A {`n  string s = `"吗`";`n}`n" } (New-Font4 $baseCps)
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 1 -and $r.out -match "'吗' U\+5417" -and $r.out -match 'Assets/Launcher/Scripts/B\.cs:2') "T2 新文案带进缺字 -> FAIL 并点名字与首次出现的文件行"
  Assert-True ($r.out -match 'subset_launcher_font\.py') "T2b 违规输出给出字体生成脚本"

  # T3 注释里的字也算(与生成脚本同口径:整文件用字)
  $pd = New-Fx @{ "Scripts\A.cs" = ($base + "// 键`n") } (New-Font4 $baseCps)
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 1 -and $r.out -match "'键'") "T3 只出现在注释里的字 -> FAIL"

  # T4 回车 / 换行 / 制表符与文件头 BOM 不计入用字
  $pd = New-Fx @{} (New-Font4 $baseCps)
  $crlf = ($base -replace "`n", "`r`n") -replace "  ", "`t"
  $withBom = (New-Object System.Text.UTF8Encoding($true)).GetPreamble() + [System.Text.Encoding]::UTF8.GetBytes($crlf)
  New-Item -ItemType Directory -Force -Path (Join-Path $pd "Assets\Launcher\Scripts") | Out-Null
  [System.IO.File]::WriteAllBytes((Join-Path $pd "Assets\Launcher\Scripts\A.cs"), $withBom)
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0) "T4 CRLF / 制表符 / 文件头 BOM -> 不计入 PASS"

  # T5 BMP 之外的字(UTF-16 里是一对代理项):字体里有 -> 过;没有 -> 按码位点名
  $emoji = [char]::ConvertFromUtf32(0x1F600)
  $withEmoji = $base + "// " + $emoji + "`n"
  $pd = New-Fx @{ "Scripts\A.cs" = $withEmoji } (New-Font12 (Get-Cps $withEmoji))
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0) "T5a BMP 之外的字在 format 12 字体里 -> PASS"
  $pd = New-Fx @{ "Scripts\A.cs" = $withEmoji } (New-Font12 $baseCps)
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 1 -and $r.out -match 'U\+1F600' -and $r.out -match 'A\.cs:5') "T5b BMP 之外的字不在字体里 -> FAIL 并按码位点名"

  # T6 format 4 经 glyphIdArray 的段:数组里记 0 的码位算缺字
  $viaArray = New-Font4ViaArray 0x41 @(5, 0, 7)    # A 有、B 无、C 有
  $pd = New-Fx @{ "Scripts\A.cs" = "AC" } $viaArray
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0) "T6a glyphIdArray 里有字形号的码位 -> PASS"
  $pd = New-Fx @{ "Scripts\A.cs" = "ABC" } $viaArray
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 1 -and $r.out -match "'B' U\+0042" -and $r.out -notmatch "'A' U\+0041") "T6b glyphIdArray 里记 0 的码位 -> FAIL 且只点名它"

  # T7 扫描面:Launcher 的子目录也扫;非 .cs 与 Launcher 之外的 .cs 不扫
  $pd = New-Fx @{ "Scripts\A.cs" = $base; "Procedure\Sub\C.cs" = "// 稍`n" } (New-Font4 $baseCps)
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 1 -and $r.out -match 'Assets/Launcher/Procedure/Sub/C\.cs:1') "T7a 子目录里的 .cs -> 在面内 FAIL"
  $pd = New-Fx @{ "Scripts\A.cs" = $base; "Resources\UIWindow\X.prefab" = "m_Text: 稍`n" } (New-Font4 $baseCps)
  Write-Src (Join-Path $pd "Assets\GameScripts\HotFix\GameLogic\Y.cs") "// 稍`n"
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0) "T7b prefab 与 Launcher 之外的 .cs -> 不在面内 PASS"

  # T8 INFRA:字体文件不存在
  $pd = New-Fx @{ "Scripts\A.cs" = $base } $null
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA.*launcher font.*not found') "T8 字体缺失 -> INFRA"

  # T9 INFRA:字体里没有 cmap 表 / 只有不支持的子表格式 / 文件截断
  $noCmap = New-FontFromSubtable ([byte[]]@(0, 4, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)) 1 "head"
  $pd = New-Fx @{ "Scripts\A.cs" = $base } $noCmap
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA.*no cmap table') "T9a 无 cmap 表 -> INFRA"
  $fmt6 = New-FontFromSubtable ([byte[]]@(0, 6, 0, 16, 0, 0, 0, 0x41, 0, 1, 0, 5, 0, 0, 0, 0)) 1
  $pd = New-Fx @{ "Scripts\A.cs" = $base } $fmt6
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA.*no usable Unicode subtable.*formats seen: 6') "T9b 只有不支持的子表格式 -> INFRA 并报出见到的格式"
  $pd = New-Fx @{ "Scripts\A.cs" = $base } ([byte[]]@(0x4F, 0x54, 0x54, 0x4F, 0, 1))
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA.*unparsable') "T9c 字体文件截断 -> INFRA"

  # T10 INFRA:Assets\Launcher 目录不存在
  $pd = Join-Path (Join-Path $script:fx "nolauncher") "Demo"
  New-Item -ItemType Directory -Force -Path (Join-Path $pd "Assets") | Out-Null
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA.*Launcher.*not found') "T10 Launcher 目录缺失 -> INFRA"
}
finally {
  Remove-FixtureTree $script:fx
}
Exit-TestSuite
