# 启动器字体核对.ps1 - 启动器源码用字是否都在启动器子集字体里的静态扫描(读 .cs 文本 + 解析字体 cmap 表,只读)。
# 准入: Since=2026-10-08 | Basis=用户裁定 | Origin=2026-10-08 用户裁定加检查;实发 1cae062e5(字体收窄后同期合入的文案带进 39 个缺字),同日加载界面清理缓存按钮的新文案又差 6 字、靠手工核对才拦下 | Retire=启动器改用完整字库,或子集字体改由构建时自动生成时 | Reviewed=2026-10-21
#
# 不变量:Assets/Launcher 下每个 .cs 里出现的每个字符(回车、换行、制表符除外),都能在
#   Assets/Launcher/Resources/Fonts/LauncherFont.otf 的 cmap 表里查到字形。
#
# 为什么:启动器跑在主包里,取不到热更资源里的完整字库,用的是一份只收「启动器源码里出现过的字」的
#   子集字体(生成脚本见下)。于是「启动器文案」与「字体覆盖」成了一对要手工同步的东西:加一句中文
#   文案而不重生成字体,新字在启动器界面上不渲染——不报错、不显示方块,就是空白(1cae062e5 记载)。
#   编辑器里也看不出来:Font.HasCharacter 对不在字体里的字照样返回真(2026-10-08 本机实测)。
#
# 口径与生成脚本一致:按整个文件的用字算,注释里的字也算。不去分辨字符串字面量与注释——那需要
#   一个 C# 词法器,判错的方向是漏报;代价是注释里用了新字也得重生成字体(或换个说法)。
#
# 不覆盖:
#   - 只烤在 prefab 里、不出现在任何 .cs 的字。生成脚本同样不扫 prefab,这类字进不了字体;
#     启动器界面的文案要在 .cs 里出现(常量赋值即可)。
#   - 运行时拼进界面的动态串(异常信息、YooAsset 错误串、下载文件名),目前都是 ASCII。
#   - 字体里多出来的字不算违规。
#
# 修法(判违规时):按当下源码重新生成字体,连同源码改动一起提交 .otf。在出违规的那个 Demo 根下跑:
#   python .claude\scripts\subset_launcher_font.py
#   (缺省改写脚本所在检出的字体,槽位里跑槽位那份即可;需要 python 与 fonttools。原地覆盖 .otf,不动 .meta。
#    参数与副作用见该脚本头注。)
#
# 只认 cmap 的 format 4 与 format 12 两种子表(当前字体两张 Unicode 子表都是 format 4)。
#
# 出口码: 0 PASS(源码用字全部被字体覆盖)
#         1 FAIL(有字不在字体里,逐字列出首次出现位置)
#         2 INFRA(Assets\Launcher 或字体文件不存在 / 字体没有 cmap 表或没有可用的 Unicode 子表)
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # 一个 Demo 根(含 Assets\)
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")   # 只为它点源处的输出编码钉:违规时要把缺的字原样打出来

$ProjectDir  = $ProjectDir.TrimEnd('\')
$launcherDir = Join-Path $ProjectDir "Assets\Launcher"
$fontRel     = "Assets\Launcher\Resources\Fonts\LauncherFont.otf"
$fontPath    = Join-Path $ProjectDir $fontRel

if (-not (Test-Path -LiteralPath $launcherDir)) {
  Write-Host "VERDICT : INFRA - '$launcherDir' not found (layout changed? sync 启动器字体核对.ps1)"; exit 2
}
if (-not (Test-Path -LiteralPath $fontPath)) {
  Write-Host "VERDICT : INFRA - launcher font '$fontPath' not found (layout changed? sync 启动器字体核对.ps1)"; exit 2
}

function Get-U16([byte[]]$B, [int]$O) { return (([int]$B[$O]) -shl 8) -bor ([int]$B[$O + 1]) }
function Get-U32([byte[]]$B, [int]$O) {
  return (([long]$B[$O]) -shl 24) -bor (([long]$B[$O + 1]) -shl 16) -bor (([long]$B[$O + 2]) -shl 8) -bor ([long]$B[$O + 3])
}

function Read-FontCodepoints([string]$Path) {
  # 回字体 cmap 里有字形的码位集合(HashSet[int]);读不出来抛异常,由调用处判 INFRA。
  $b = [System.IO.File]::ReadAllBytes($Path)
  if ($b.Length -lt 12) { throw "file too short to be a font" }
  $numTables = Get-U16 $b 4
  $cmapOff = -1
  for ($i = 0; $i -lt $numTables; $i++) {
    $rec = 12 + 16 * $i
    if ($rec + 16 -gt $b.Length) { throw "table directory runs past end of file" }
    if ([System.Text.Encoding]::ASCII.GetString($b, $rec, 4) -eq "cmap") { $cmapOff = [int](Get-U32 $b ($rec + 8)); break }
  }
  if ($cmapOff -lt 0) { throw "no cmap table" }
  if ($cmapOff + 4 -gt $b.Length) { throw "cmap table offset past end of file" }

  $set = New-Object 'System.Collections.Generic.HashSet[int]'
  $seen = @()
  $nSub = Get-U16 $b ($cmapOff + 2)
  for ($i = 0; $i -lt $nSub; $i++) {
    $er = $cmapOff + 4 + 8 * $i
    if ($er + 8 -gt $b.Length) { throw "cmap encoding records run past end of file" }
    $plat = Get-U16 $b $er
    $enc  = Get-U16 $b ($er + 2)
    # Unicode 子表:平台 0(编码 5 是变体选择符表,不是码位映射);平台 3 的编码 1(BMP)与 10(全码位)。
    if (-not (($plat -eq 0 -and $enc -ne 5) -or ($plat -eq 3 -and ($enc -eq 1 -or $enc -eq 10)))) { continue }
    $st = $cmapOff + [int](Get-U32 $b ($er + 4))
    if ($st + 16 -gt $b.Length) { throw "cmap subtable offset past end of file" }
    $fmt = Get-U16 $b $st
    $seen += $fmt
    if ($fmt -eq 4) {
      $segX2  = Get-U16 $b ($st + 6)
      $endO   = $st + 14
      $startO = $endO + $segX2 + 2
      $deltaO = $startO + $segX2
      $rangeO = $deltaO + $segX2
      if ($rangeO + $segX2 -gt $b.Length) { throw "cmap format 4 segment arrays run past end of file" }
      for ($s = 0; $s -lt ($segX2 -shr 1); $s++) {
        $end   = Get-U16 $b ($endO + 2 * $s)
        $start = Get-U16 $b ($startO + 2 * $s)
        $delta = Get-U16 $b ($deltaO + 2 * $s)
        $ro    = Get-U16 $b ($rangeO + 2 * $s)
        for ($c = $start; $c -le $end; $c++) {
          if ($c -eq 0xFFFF) { continue }
          if ($ro -eq 0) { $gid = ($c + $delta) -band 0xFFFF }
          else {
            $ga = $rangeO + 2 * $s + $ro + 2 * ($c - $start)
            if ($ga + 2 -gt $b.Length) { throw "cmap format 4 glyph index runs past end of file" }
            $gid = Get-U16 $b $ga
            if ($gid -ne 0) { $gid = ($gid + $delta) -band 0xFFFF }
          }
          if ($gid -ne 0) { [void]$set.Add($c) }
        }
      }
    }
    elseif ($fmt -eq 12) {
      $nGroups = [int](Get-U32 $b ($st + 12))
      if ($st + 16 + 12 * $nGroups -gt $b.Length) { throw "cmap format 12 groups run past end of file" }
      for ($g = 0; $g -lt $nGroups; $g++) {
        $go = $st + 16 + 12 * $g
        $cs = Get-U32 $b $go
        $ce = Get-U32 $b ($go + 4)
        $gs = Get-U32 $b ($go + 8)
        if ($cs -gt $ce -or $ce -gt 0x10FFFF) { throw "cmap format 12 group out of range" }
        for ($c = $cs; $c -le $ce; $c++) { if (($gs + ($c - $cs)) -ne 0) { [void]$set.Add([int]$c) } }
      }
    }
  }
  if ($set.Count -eq 0) {
    throw ("cmap has no usable Unicode subtable (formats seen: " + $(if ($seen.Count) { $seen -join ", " } else { "none" }) + "; supported: 4, 12)")
  }
  return , $set
}

try { $fontSet = Read-FontCodepoints $fontPath }
catch {
  Write-Host ("VERDICT : INFRA - launcher font '" + $fontRel + "' unparsable: " + $_.Exception.Message); exit 2
}

# ── 逐文件取用字 ──────────────────────────────────────────
# 先把整份文本收成去重字符集再逐字比:生成物 AOTGenericReferences.cs 有数百万字符,逐字符循环要好几秒。
$files = @([System.IO.Directory]::GetFiles($launcherDir, "*.cs", [System.IO.SearchOption]::AllDirectories) | Sort-Object)
$sourceSet = New-Object 'System.Collections.Generic.HashSet[int]'
# 缺字按首次出现的顺序收,另用一个集合去重。不用 [ordered] 字典:它的下标遇到整数键会当成位置。
$missing = New-Object 'System.Collections.Generic.List[object]'
$missingSeen = New-Object 'System.Collections.Generic.HashSet[int]'

function Add-Missing([int]$Cp, [string]$Text, [int]$Index, [string]$Rel) {
  if (-not $missingSeen.Add($Cp)) { return }
  $line = ($Text.Substring(0, $Index) -split "`n").Count
  $missing.Add([pscustomobject]@{ Cp = $Cp; Char = [char]::ConvertFromUtf32($Cp); Rel = $Rel; Line = $line })
}

foreach ($file in $files) {
  $rel  = $file.Substring($ProjectDir.Length + 1) -replace '\\', '/'
  $text = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)   # 自动去掉文件头 BOM
  $distinct = New-Object 'System.Collections.Generic.HashSet[char]' -ArgumentList (, $text.ToCharArray())
  $hasSurrogate = $false
  foreach ($ch in $distinct) {
    if ($ch -eq "`r" -or $ch -eq "`n" -or $ch -eq "`t") { continue }
    if ([char]::IsSurrogate($ch)) { $hasSurrogate = $true; continue }
    $cp = [int]$ch
    [void]$sourceSet.Add($cp)
    if (-not $fontSet.Contains($cp)) { Add-Missing $cp $text $text.IndexOf([string]$ch, [System.StringComparison]::Ordinal) $rel }
  }
  if ($hasSurrogate) {
    # BMP 之外的字(表情等)在 UTF-16 里是一对代理项,按码位合起来比。
    foreach ($m in [regex]::Matches($text, '[\uD800-\uDBFF][\uDC00-\uDFFF]')) {
      $cp = [char]::ConvertToUtf32($m.Value, 0)
      [void]$sourceSet.Add($cp)
      if (-not $fontSet.Contains($cp)) { Add-Missing $cp $text $m.Index $rel }
    }
  }
}

if ($missing.Count -gt 0) {
  Write-Host ("VIOLATION 启动器字体核对: 启动器源码里有 " + $missing.Count + " 个字不在子集字体 " + ($fontRel -replace '\\', '/') + " 里(这些字在启动器界面上不渲染,不报错)")
  Write-Host ("  缺字: " + (@($missing | ForEach-Object { $_.Char }) -join ""))
  foreach ($m in $missing) {
    Write-Host ("  '" + $m.Char + "' U+" + $m.Cp.ToString("X4") + "  首次出现: " + $m.Rel + ":" + $m.Line)
  }
  Write-Host "FIX: 按当下源码重新生成字体并一起提交 .otf —— 在本 Demo 根下跑 python .claude\scripts\subset_launcher_font.py(需 fonttools;缺省改写脚本所在检出的字体)。字只出现在注释里也算:换个说法,或同样重生成。"
  exit 1
}

Write-Host ("OK  启动器字体核对: " + $files.Count + " .cs, " + $sourceSet.Count + " distinct chars in source, all covered by LauncherFont.otf (" + $fontSet.Count + " mapped)")
exit 0
