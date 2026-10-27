# 崩溃栈符号化.ps1 - 把 Android 原生崩溃栈里的地址还原成函数名(只读)。
#
# 解决什么:IL2CPP 包的 tombstone 只给 `#01 pc 00000000048652c0 .../libil2cpp.so`,读不出崩在
# 哪个函数。装进设备的 so 是 strip 过的,但同一次构建在 Library\Bee 下留着未剥离的那份,本脚本
# 用它把偏移映射回符号。实测把「堆栈 87 层全在 libil2cpp.so、根源未定位」变成了确切调用链。
#
# 防呆(本脚本存在的主要理由):符号化前强制比对 BuildId。装的包与本地构建产物不同源时,地址
# 照样能映射出函数名,但全是错的、且从结果里看不出错——那比没有结论更坏。BuildId 不匹配即停,
# 取不到 BuildId(日志里没有、也没给 -BuildId)同样停,不出结果。要绕这道闸只能显式加
# -SkipBuildIdCheck;本地候选多于一个时还须 -SoPath 指定用哪份。
#
# 用法(本机 PS 5.1):
#   崩溃栈符号化.ps1 -LogFile D:\tmp\crash.txt          从崩溃日志提地址,自动认 ABI 与 BuildId
#   崩溃栈符号化.ps1 -LogFile ... -Top 25               只符号化最内层 25 帧
#   崩溃栈符号化.ps1 -LogFile ... -Library libunity.so  换一个库(缺省 libil2cpp.so)
#   崩溃栈符号化.ps1 -Address 048652c0,048fa513 -BuildId 5fe6fd65...   手工给地址
#   崩溃栈符号化.ps1 -LogFile ... -SoPath D:\...\libil2cpp.so -SkipBuildIdCheck
#
# 参数语义:
#   -LogFile   崩溃日志文本。tombstone 原文、Unity 的 [E] CRASH 转发、logcat 落盘三种都认。
#   -Address   直接给逗号分隔的十六进制偏移(不带 0x),与 -LogFile 二选一。
#   -Library   要符号化的 so 名,只处理栈里属于它的帧。缺省 libil2cpp.so。
#   -Abi       arm64-v8a / x86_64 / armeabi-v7a / x86。缺省从日志 `ABI: 'xxx'` 行读,读不到用 arm64-v8a。
#   -BuildId   -Address 形态下用它选 so;-LogFile 形态下从日志读,显式给了则以本参数为准。
#   -SoPath    直接指定未剥离 so,跳过探测(仍校 BuildId,除非另加 -SkipBuildIdCheck)。
#   -ProjectDir  Demo 目录,缺省按脚本位置上推两级。
#   -UnityEditorDir  指定取 NDK 的 Unity 安装(版本目录如 ...\Hub\Editor\6000.3.19f1,或其下 Editor
#              目录)。缺省在 C/D 盘 Unity Hub 的 Editor 目录下按版本名降序取第一个带 NDK 的。
#   -Top       只取最内层 N 帧,0 = 全部。
#
# 前置:本机装有 Unity(NDK 里的 llvm-nm / llvm-readelf / llvm-cxxfilt 由此取);工程构建过对应
#   ABI 且 Library\Bee 未被清理。从 APK 里解出来的 so 是 strip 过的,喂给本脚本得不到符号。
# 副作用:只读。符号表缓存到 %TEMP%\unity-sym-cache\,键 = BuildId + so 路径/大小/修改时间的
#   哈希;nm 失败或导出为空不写缓存。不写工程、不动构建产物。单个缓存文件可达数十 MB,清理直接删该目录。
# 调用后:无需其它动作,结论是文字输出,不落工程文件。
# 配套:抓日志用同目录 模拟器日志.ps1(-Level Error 会放行 native crash 行)。
# 退出码:0 出了结果;1 BuildId 不匹配 / 取不到 BuildId 且未跳过校验 / 一个符号都没映射到 /
#         so 无代码符号;2 环境问题(缺 NDK、找不到 so、nm 失败、日志里没有该库的帧、
#         跳过校验时候选多于一个)。
[CmdletBinding()]
param(
  [string]$LogFile,
  [string]$Address,
  [string]$Library = "libil2cpp.so",
  [ValidateSet("arm64-v8a","x86_64","armeabi-v7a","x86")][string]$Abi,
  [string]$BuildId,
  [string]$SoPath,
  [switch]$SkipBuildIdCheck,
  [string]$ProjectDir,
  [string]$UnityEditorDir,
  [int]$Top = 0
)
$ErrorActionPreference = "Stop"

# 编码单点:点源共享库钉 UTF-8,不在本脚本另设一份(script-authoring R7)。不钉则经 Bash 等
# 管道调用时中文按 OEM 页写出成乱码。
. (Join-Path $PSScriptRoot "..\devflow\hooks\hook函数库.ps1")

function Fail([int]$code, [string]$msg) { Write-Host $msg; exit $code }

if (-not $LogFile -and -not $Address) { Fail 2 "环境问题: 须给 -LogFile 或 -Address 其一" }
if (-not $ProjectDir) { $ProjectDir = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent }
if (-not (Test-Path -LiteralPath (Join-Path $ProjectDir "ProjectSettings\ProjectVersion.txt"))) {
  Fail 2 "环境问题: '$ProjectDir' 不是 Unity 工程(ProjectVersion.txt 不在),用 -ProjectDir 指定"
}

# ---- 1. 取地址、BuildId、ABI ----
$frames = @()
if ($LogFile) {
  if (-not (Test-Path -LiteralPath $LogFile)) { Fail 2 "环境问题: 日志文件不存在 '$LogFile'" }
  $text = Get-Content -LiteralPath $LogFile -Raw
  $libRe = [regex]::Escape($Library)
  foreach ($m in [regex]::Matches($text, "#(?<no>\d+)\s+pc\s+(?<addr>[0-9a-fA-F]+)\s+\S*$libRe")) {
    $a = $m.Groups["addr"].Value.TrimStart("0")
    if ($a -eq "") { $a = "0" }
    $frames += @{ No = $m.Groups["no"].Value; Addr = $a }
  }
  if (-not $BuildId) {
    $bm = [regex]::Match($text, "$libRe[^\r\n]*?BuildId:\s*(?<id>[0-9a-fA-F]+)")
    if ($bm.Success) { $BuildId = $bm.Groups["id"].Value }
  }
  if (-not $Abi) {
    $am = [regex]::Match($text, "ABI:\s*'(?<abi>[^']+)'")
    if ($am.Success) {
      $raw = $am.Groups["abi"].Value
      if ($raw -eq "arm64") { $Abi = "arm64-v8a" }
      elseif ($raw -eq "arm") { $Abi = "armeabi-v7a" }
      else { $Abi = $raw }
    }
  }
  # 同一崩溃常被打印两遍(Unity 转发一份 + 系统 tombstone 一份),按帧号去重保留首见
  $seen = @{}
  $uniq = @()
  foreach ($f in $frames) {
    if (-not $seen.ContainsKey($f.No)) { $seen[$f.No] = $true; $uniq += $f }
  }
  $frames = $uniq
  if ($frames.Count -eq 0) { Fail 2 "环境问题: 日志里没有属于 $Library 的帧(-Library 给对了吗?)" }
} else {
  $i = 0
  foreach ($a in ($Address -split "[,\s]+" | Where-Object { $_ })) {
    $h = $a -replace "^0[xX]", ""
    $h = $h.TrimStart("0")
    if ($h -eq "") { $h = "0" }
    $frames += @{ No = ("{0:D2}" -f $i); Addr = $h }
    $i++
  }
}
if (-not $Abi) { $Abi = "arm64-v8a" }
if ($Top -gt 0 -and $frames.Count -gt $Top) { $frames = $frames[0..($Top - 1)] }

# ---- 2. 找 NDK 工具 ----
# Unity 的 Editor\Data 目录列表:给了 -UnityEditorDir 只认它(版本目录或其 Editor 子目录都收),
# 否则扫 Unity Hub 缺省安装位置、按版本名降序。
$dataDirs = @()
if ($UnityEditorDir) {
  foreach ($d in @((Join-Path $UnityEditorDir "Editor\Data"), (Join-Path $UnityEditorDir "Data"))) {
    if (Test-Path -LiteralPath $d) { $dataDirs += $d; break }
  }
  if ($dataDirs.Count -eq 0) { Fail 2 "环境问题: -UnityEditorDir '$UnityEditorDir' 下既无 Editor\Data 也无 Data,不是 Unity 安装目录" }
} else {
  foreach ($hub in @("C:\Program Files\Unity\Hub\Editor", "D:\Program Files\Unity\Hub\Editor")) {
    if (Test-Path -LiteralPath $hub) {
      foreach ($v in (Get-ChildItem -LiteralPath $hub -Directory | Sort-Object Name -Descending)) {
        $dataDirs += (Join-Path $v.FullName "Editor\Data")
      }
    }
  }
}
$ndkRoots = @()
foreach ($d in $dataDirs) {
  $p = Join-Path $d "PlaybackEngines\AndroidPlayer\NDK"
  if (Test-Path -LiteralPath $p) { $ndkRoots += $p }
}
if ($ndkRoots.Count -eq 0) { Fail 2 "环境问题: 找不到 Unity 自带 NDK(查过 $(if ($UnityEditorDir) { $UnityEditorDir } else { 'Unity Hub 的 Editor 目录' });可用 -UnityEditorDir 指定)" }
$binDir = $null
foreach ($r in $ndkRoots) {
  $b = Join-Path $r "toolchains\llvm\prebuilt\windows-x86_64\bin"
  if (Test-Path -LiteralPath (Join-Path $b "llvm-nm.exe")) { $binDir = $b; break }
}
if (-not $binDir) { Fail 2 "环境问题: NDK 里没有 llvm-nm.exe(查过 $($ndkRoots -join '; '))" }
$nm      = Join-Path $binDir "llvm-nm.exe"
$readelf = Join-Path $binDir "llvm-readelf.exe"
$cxxfilt = Join-Path $binDir "llvm-cxxfilt.exe"

function Get-SoBuildId([string]$path) {
  # EAP=Stop 下 5.1 会把原生进程写 stderr(如文件不是合法 ELF)抛成终止错误;这里读不出即返回空,
  # 交给调用侧按「取不到 BuildId」处置。函数内赋值是局部作用域。
  $ErrorActionPreference = "Continue"
  $out = & $readelf -n $path 2>$null
  $m = [regex]::Match(($out -join "`n"), "Build ID:\s*(?<id>[0-9a-fA-F]+)")
  if ($m.Success) { return $m.Groups["id"].Value }
  return ""
}

# ---- 3. 定位未剥离 so ----
function Show-Candidates($list) {
  foreach ($c in $list) {
    $id = Get-SoBuildId $c
    if (-not $id) { $id = "(无 BuildId)" }
    Write-Host ("  {0}  <- {1}" -f $id, $c)
  }
}
$noIdHint = "取不到崩溃包的 BuildId: 日志里没有 `"$Library (BuildId: ...)`" 字样,也没给 -BuildId。" +
            "`n  提供 BuildId: 用带 BuildId 的 tombstone 原文作 -LogFile,或 -BuildId <十六进制>(装机包内 so 上跑 llvm-readelf -n 可得)。" +
            "`n  或显式跳过校验(结果不可信): 加 -SkipBuildIdCheck;候选多于一个时再加 -SoPath 指定其一。"
$skipWarn = "警告: 已按 -SkipBuildIdCheck 跳过 BuildId 校验。so 与崩溃包不同源时下面的函数名全错且看不出来,只作线索。"

if (-not $SoPath) {
  $bee = Join-Path $ProjectDir "Library\Bee\Android\Prj\IL2CPP\Gradle"
  $cands = @()
  foreach ($sub in @(
      "unityLibrary\build\intermediates\merged_native_libs\release\mergeReleaseNativeLibs\out\lib\$Abi",
      "launcher\build\intermediates\merged_native_libs\release\mergeReleaseNativeLibs\out\lib\$Abi",
      "unityLibrary\src\main\jniLibs\$Abi")) {
    $p = Join-Path $bee (Join-Path $sub $Library)
    if (Test-Path -LiteralPath $p) { $cands += $p }
  }
  if ($cands.Count -eq 0) {
    $beeAlt = Join-Path $ProjectDir "Library\Bee"
    if (Test-Path -LiteralPath $beeAlt) {
      $cands = @(Get-ChildItem -LiteralPath $beeAlt -Recurse -Filter $Library -ErrorAction SilentlyContinue |
                 Where-Object { $_.FullName -like "*$Abi*" } | ForEach-Object { $_.FullName })
    }
  }
  if ($cands.Count -eq 0) {
    Fail 2 "环境问题: 在 Library\Bee 下找不到 $Abi 的 $Library。这个 ABI 构建过吗?Library 被清过吗?"
  }
  if ($SkipBuildIdCheck) {
    if ($cands.Count -gt 1) {
      Write-Host "本地有 $($cands.Count) 个 $Abi 的 $Library 候选,跳过校验时无从替你挑:"
      Show-Candidates $cands
      Fail 2 "环境问题: 用 -SoPath 指定其中一份(连同 -SkipBuildIdCheck)。"
    }
    $SoPath = $cands[0]
    Write-Host $skipWarn
  } elseif (-not $BuildId) {
    Write-Host "本地候选($Abi):"
    Show-Candidates $cands
    Fail 1 "停下不出结果: $noIdHint"
  } else {
    foreach ($c in $cands) {
      if ((Get-SoBuildId $c) -eq $BuildId) { $SoPath = $c; break }
    }
    if (-not $SoPath) {
      Write-Host "BuildId 不匹配: 崩溃日志是 $BuildId,本地候选都不是产出该包的那次构建:"
      Show-Candidates $cands
      Fail 1 "停下不出结果: 用不同源的 so 符号化会得到看不出错的错误函数名。请用产出该包的那次构建,或显式 -SoPath 加 -SkipBuildIdCheck。"
    }
  }
} else {
  if (-not (Test-Path -LiteralPath $SoPath)) { Fail 2 "环境问题: -SoPath 不存在 '$SoPath'" }
  if ($SkipBuildIdCheck) {
    Write-Host $skipWarn
  } elseif (-not $BuildId) {
    Fail 1 "停下不出结果: $noIdHint"
  } else {
    $actual = Get-SoBuildId $SoPath
    if ($actual -ne $BuildId) {
      Fail 1 "BuildId 不匹配: 日志 $BuildId,-SoPath 给的是 $actual。加 -SkipBuildIdCheck 可强行继续(结果不可信)。"
    }
  }
}

# ---- 4. 符号表(缓存) ----
# 缓存键 = BuildId + so 身份哈希(全路径/大小/修改时间)。只按 BuildId 键会让同 BuildId 的 strip
# 版与未剥离版共用一份,无 BuildId 的同名 so 也会互相串。
$SoPath = (Resolve-Path -LiteralPath $SoPath).ProviderPath
$soId = Get-SoBuildId $SoPath
$soFile = Get-Item -LiteralPath $SoPath
$sha = [System.Security.Cryptography.SHA1]::Create()
$ident = "{0}|{1}|{2}" -f $soFile.FullName.ToLowerInvariant(), $soFile.Length, $soFile.LastWriteTimeUtc.Ticks
$identHash = ([BitConverter]::ToString($sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($ident))) -replace "-", "").Substring(0, 12).ToLowerInvariant()
$idPart = if ($soId) { $soId } else { "nobuildid-" + $soFile.Name }
$cacheDir = Join-Path $env:TEMP "unity-sym-cache"
if (-not (Test-Path -LiteralPath $cacheDir)) { New-Item -ItemType Directory -Path $cacheDir | Out-Null }
$cache = Join-Path $cacheDir "$idPart-$identHash.syms"

function Invoke-Nm([string]$path) {
  # 同 Get-SoBuildId:nm 写 stderr 不该在这里抛,失败由退出码判。
  $ErrorActionPreference = "Continue"
  $out = @(& $nm --defined-only --numeric-sort $path 2>$null)
  return @{ Code = $LASTEXITCODE; Lines = $out }
}

$lines = @()
if (Test-Path -LiteralPath $cache) {
  # 空缓存文件(旧版 nm 失败遗留、写一半被打断)视同不存在,删掉重导,不让它冒充「已 strip」。
  $lines = [System.IO.File]::ReadAllLines($cache)
  if ($lines.Count -eq 0) { [System.IO.File]::Delete($cache) }
}
if ($lines.Count -eq 0) {
  Write-Host "导符号表(首次较慢,之后按缓存复用): $($soFile.Name)"
  $r = Invoke-Nm $SoPath
  if ($r.Code -ne 0) { Fail 2 "环境问题: llvm-nm 读 '$SoPath' 失败(退出码 $($r.Code)),文件损坏或不是 ELF?未写缓存。" }
  $lines = [string[]]$r.Lines
  # 空输出(strip 过的 so)不缓存:下次照样重跑,不留一份会让同键后来者误判「已 strip」的空表。
  if ($lines.Count -gt 0) {
    $tmp = "$cache.$PID.tmp"
    [System.IO.File]::WriteAllLines($tmp, $lines, (New-Object System.Text.UTF8Encoding($false)))
    try { [System.IO.File]::Move($tmp, $cache) } catch { [System.IO.File]::Delete($tmp) }   # 并发时别人已写好,用那份
  }
}
$addrs = New-Object 'System.Collections.Generic.List[UInt64]'
$names = New-Object 'System.Collections.Generic.List[String]'
# 按空白切分:地址列宽随 ELF 位数变(64 位 16 位十六进制,32 位 8 位),不能按定宽取。
$symRe = [regex]'^\s*(?<addr>[0-9a-fA-F]+)\s+(?<type>[tTwW])\s+(?<name>\S.*)$'
foreach ($ln in $lines) {
  $m = $symRe.Match($ln)
  if (-not $m.Success) { continue }
  $addrs.Add([Convert]::ToUInt64($m.Groups["addr"].Value, 16))
  $names.Add($m.Groups["name"].Value)
}
if ($addrs.Count -eq 0) {
  Fail 1 "符号表里没有代码符号: $SoPath 可能已被 strip(从 APK 里解出来的那份就是)"
}

# ---- 5. 二分映射 ----
$rows = @()
foreach ($f in $frames) {
  $target = [Convert]::ToUInt64($f.Addr, 16)
  $lo = 0
  $hi = $addrs.Count - 1
  $best = -1
  while ($lo -le $hi) {
    $mid = [int](($lo + $hi) / 2)
    if ($addrs[$mid] -le $target) { $best = $mid; $lo = $mid + 1 } else { $hi = $mid - 1 }
  }
  if ($best -ge 0) {
    $rows += [pscustomobject]@{ No = $f.No; Addr = $f.Addr; Off = ("0x{0:x}" -f ($target - $addrs[$best])); Sym = $names[$best] }
  } else {
    $rows += [pscustomobject]@{ No = $f.No; Addr = $f.Addr; Off = ""; Sym = "??" }
  }
}
$hit = @($rows | Where-Object { $_.Sym -ne "??" }).Count
if ($hit -eq 0) { Fail 1 "一个符号都没映射到: 地址与该 so 对不上,确认 -Abi / -Library 选对没有" }

# demangle:一次性批处理,逐个起进程在 87 帧上会明显拖慢
$demangled = @{}
$mangled = @($rows | Where-Object { $_.Sym -like "_Z*" } | ForEach-Object { $_.Sym } | Select-Object -Unique)
if ($mangled.Count -gt 0 -and (Test-Path -LiteralPath $cxxfilt)) {
  $res = @($mangled | & $cxxfilt 2>$null)
  for ($i = 0; $i -lt $mangled.Count -and $i -lt $res.Count; $i++) { $demangled[$mangled[$i]] = $res[$i] }
}

Write-Host ""
Write-Host "so      : $SoPath"
Write-Host ("BuildId : " + $(if ($soId) { $soId } else { "(无)" }) + $(if ($SkipBuildIdCheck) { "   [未校验,结果只作线索]" } else { "   [已与崩溃包比对一致]" }))
Write-Host "ABI     : $Abi   帧数: $($rows.Count)   命中: $hit"
Write-Host ("-" * 100)
foreach ($r in $rows) {
  $s = $r.Sym
  if ($demangled.ContainsKey($s)) { $s = $demangled[$s] }
  Write-Host ("#{0} {1,10}  +{2,-8} {3}" -f $r.No, $r.Addr, $r.Off, $s)
}
Write-Host ("-" * 100)
Write-Host "读法: 栈自内向外,#00 最内。IL2CPP 的托管方法名形如 Foo_Bar_mXXXX,前半是 类名_方法名。"
exit 0
