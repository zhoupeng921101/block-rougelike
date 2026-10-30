# 进程编码核对.ps1 - 编辑器工具捕获子进程输出的静态扫描(纯文本,只读)。
# 准入: Since=2026-09-20 | Basis=存量 | Origin=f18cb2e6f 入库;头注记实发三次(BuildServer 靠英文输出绕过等) | Retire=编辑器工具起子进程全部收口到共用原语、原语外调用点清零满 30 天时
#
# 不变量两条,按「扫描面 → 该面的共用原语」成对适用:
#   ①原语外不自建:面内除该面的原语文件外,任何 .cs 不得自建带
#     RedirectStandardOutput / RedirectStandardError 的 ProcessStartInfo。
#   ②原语自身不漏编码:原语文件里开了 Redirect 的 psi 必须显式设
#     StandardOutputEncoding / StandardErrorEncoding。
#
# 两个面各有各的原语,因为跨不了程序集边界(不是重复,是分层的必然):
#   Assets/Editor       → EditorProcess.cs(落 predefined 的 Assembly-CSharp-Editor)
#   Assets/TEngine/Editor → ShellHelper.cs(落 TEngine.Editor.asmdef)
# asmdef 程序集引用不到 predefined 程序集,故 TEngine 侧无法调用 EditorProcess(实测 CS0103)。
#
# 为什么:不设编码时 .NET 按本机 OEM 码页解子进程输出(简中机器上是 GBK),而 ssh / git /
# dotnet / python 这批工具输出的是 UTF-8 字节,解出来的中文全是乱码。它不报错、不影响退出码,
# 只让诊断文本失真——真正的失败原因被掩盖在乱码里,排查时先被带去查「文件是不是损坏了」。
# 已实发三次:BuildServer 当年靠强制 dotnet 英文输出(DOTNET_CLI_UI_LANGUAGE=en)绕过去、
# 没修根因;CheckOnlineUpdateMode 再犯,把「私钥路径格式不对」显示成密钥文件名乱码;
# 本道首版上线后,另一轮交付又在同一文件上用「就地补两行编码」的补丁改法修了一次。
#
# 判「有没有设编码」拦不住第三次:三处各写一份 psi,每份都得自己记得设,规则本身没被执行化。
# 故不变量从「编码设没设」提到「是不是走了共用原语」——口径只留一份,新增捕获点无从漏设。
# 正确做法:走 Assets/Editor/BlockBlast/EditorProcess.cs——Run 收得住的直接用,要自管超时 /
# 环境变量 / 异步读取的用 NewStartInfo 取 psi(读取方式仍由调用方自管,只有 psi 构造收归共用)。
#
# 豁免位每面一个,按**文件名**认(不写死路径,原语换目录照常生效)。
# 代价:将来若新增同名文件会意外获得豁免——可接受,这两个名字在本仓都是专名。
# **没有行内逃生舱**是有意的:留了口子就会被当成「自建 + 标一行理由」的常规写法,
# 而本道要守的恰恰是「不自建」。真出现原语承载不了的场景,应当扩原语(先例:两个原语的
# NewStartInfo 都是这么加出来的)或在此加一道有名有姓的豁免,不是给每个调用点发通行证。
#
# 编码该钉哪一页**不由本道判**,它取决于子进程,不取决于调用方在哪:ssh / git / python /
# powershell 按 UTF-8 写输出,cmd.exe / dotnet CLI / robocopy / where 按控制台 OEM 页写。
# EditorProcess 钉死 UTF-8、ShellHelper 缺省 OEM 页而编码可传,两者各自正确(后者是本仓
# e87644093「bat 去中文、子进程输出按 OEM 代码页解码」的结论)。本道只管「有没有走原语」,
# 把该取哪一页的判断收到原语这一层去,不在每个调用点重判——那正是漏设的来源。
#
# 扫描面 = 上表两个根下的全部 .cs(都由本仓维护:ShellHelper 最近三次改动皆本仓,
# XcodeProjectShareSync 由本仓 43c8d10cc 新增)。业务运行时代码不纳入:移动端起不了子进程,
# 实测零命中,纳入只会把 Plugins 里的 vendored 代码拖进来。
#
# 「带 Redirect」= RedirectStandardOutput / RedirectStandardError 被赋了字面 false 以外的值
# (变量、表达式在运行期可能为真,按会重定向判;口径见 $redirectRe 处注释)。
#
# 判法两级,都在剔掉注释后判:
#   ①块级(主判据):以 `new ProcessStartInfo` 起,按大括号配平取到对象初始化器末尾。
#     非原语文件:块内有 Redirect 即违规(outside-primitive)。
#     原语文件:  块内有 Redirect 而无 Encoding 才违规(no-encoding)。
#   ②文件级(兜底):块外的 Redirect 赋值(先建对象、再逐句 psi.X = 的写法)。
#     非原语文件:逐行违规。原语文件:该文件通篇没有 Encoding 才算。
#     原语侧粒度粗是有意的,方向偏漏报不偏误报。
#
# 出口码: 0 PASS(两条不变量均无违规)
#         1 FAIL(至少一处)
#         2 INFRA(两个扫描根都不在,或某个面在而它的原语不见了)
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # 受检的 Demo
)
$ErrorActionPreference = "Stop"

# 面与原语成对登记;加面即在此加一行,判定逻辑不动。
$surfaces = @(
  @{ Root = "Assets\Editor";           Primitive = "EditorProcess.cs" },
  @{ Root = "Assets\TEngine\Editor";   Primitive = "ShellHelper.cs" }
)

# 「开了 Redirect」的口径 = 右值不是字面 false。`= capture` / `= a && b` 这类变量或表达式在运行期
# 可能为真,静态判不出就按「会重定向」算(方向偏误报不偏漏报:真要条件重定向,走原语的 NewStartInfo
# 同样能表达);只认字面 true 会让这类写法整条逃出两条不变量。
$redirectRe = 'RedirectStandard(Output|Error)\s*=(?!=)\s*(?!false\b)\S'
$encodingRe = 'Standard(Output|Error)Encoding\s*='

$files = @()          # @{ Info; Primitive }:每个文件连同它所属面的原语名一起带下去
$missing = @()        # 面在、原语不见了 -> INFRA(豁免位与 FIX 指引都挂在原语上)
$liveRoots = 0

foreach ($s in $surfaces) {
  $abs = Join-Path $ProjectDir $s.Root
  if (-not (Test-Path -LiteralPath $abs)) { continue }
  $liveRoots++

  $found = @(Get-ChildItem -LiteralPath $abs -Recurse -Filter *.cs -File -ErrorAction SilentlyContinue)
  if (-not ($found | Where-Object { $_.Name -eq $s.Primitive })) {
    $missing += ($s.Root + " -> " + $s.Primitive)
    continue
  }
  foreach ($x in $found) { $files += @{ Info = $x; Primitive = $s.Primitive } }
}

if ($liveRoots -eq 0) {
  Write-Host "VERDICT : INFRA - none of the scan roots exist under '$ProjectDir' ($(($surfaces | ForEach-Object { $_.Root }) -join ', '))"
  exit 2
}
if ($missing.Count -gt 0) {
  Write-Host ("VERDICT : INFRA - shared primitive missing (renamed or moved out of its surface; the exemption and the FIX hint both hang on it): " + ($missing -join "; "))
  exit 2
}

$bad = @()

foreach ($entry in $files) {
  $f = $entry.Info
  $lines = [System.IO.File]::ReadAllLines($f.FullName, [System.Text.Encoding]::UTF8)
  $n = $lines.Length
  if ($n -eq 0) { continue }

  # 剔注释后的并行副本:行号与 $lines 一一对应,报告时回取原行。字符串字面量里的 // 会让该行
  # 被误剔 —— 与 shader取用核对 同一取舍,方向安全(漏报不误报)。
  $code = New-Object string[] $n
  for ($i = 0; $i -lt $n; $i++) {
    $t = $lines[$i]
    $slash = $t.IndexOf("//", [System.StringComparison]::Ordinal)
    if ($slash -ge 0) { $t = $t.Substring(0, $slash) }
    if ($t.TrimStart().StartsWith("*", [System.StringComparison]::Ordinal)) { $t = "" }   # 块注释续行
    $code[$i] = $t
  }

  $fileHasEncoding = $false
  foreach ($c in $code) { if ($c -match $encodingRe) { $fileHasEncoding = $true; break } }

  $inBlock = New-Object bool[] $n          # 已被某个 psi 块吃掉的行,不再进文件级兜底
  $rel = $f.FullName.Substring($ProjectDir.Length).TrimStart("\")
  $isPrimitive = ($f.Name -eq $entry.Primitive)

  $i = 0
  while ($i -lt $n) {
    # 命名空间前缀可选:工程里 new System.Diagnostics.ProcessStartInfo 的全限定写法确实存在,
    # 只认短名会让那些块落进文件级兜底、报成孤立的 Redirect 行而不指向块首。
    if ($code[$i] -notmatch 'new\s+(?:[\w.]+\.)?ProcessStartInfo') { $i++; continue }

    # 块范围:先找对象初始化器的 `{`;在它之前先遇到 `;` 说明这句没有初始化器,块止于本行。
    $j = $i
    $depth = 0
    $sawBrace = $false
    while ($j -lt $n) {
      $l = $code[$j]
      if (-not $sawBrace) {
        if ($l.Contains("{")) { $sawBrace = $true }
        elseif ($l.Contains(";")) { $j++; break }
      }
      if ($sawBrace) {
        $depth += ([regex]::Matches($l, '\{').Count - [regex]::Matches($l, '\}').Count)
        if ($depth -le 0) { $j++; break }
      }
      $j++
    }

    $hasRedirect = $false
    $hasEncoding = $false
    for ($k = $i; $k -lt $j; $k++) {
      $inBlock[$k] = $true
      if ($code[$k] -match $redirectRe) { $hasRedirect = $true }
      if ($code[$k] -match $encodingRe) { $hasEncoding = $true }
    }

    if ($hasRedirect) {
      if (-not $isPrimitive) {
        $bad += [pscustomobject]@{ Path = $rel; Line = $i + 1; Text = $lines[$i].Trim(); Kind = "outside-primitive" }
      }
      elseif (-not $hasEncoding) {
        $bad += [pscustomobject]@{ Path = $rel; Line = $i + 1; Text = $lines[$i].Trim(); Kind = "no-encoding" }
      }
    }
    $i = $j
  }

  # 块外的分散赋值。非原语文件逐行判;原语文件沿用文件级兜底(通篇无编码才算)。
  if (-not $isPrimitive -or -not $fileHasEncoding) {
    $looseKind = if ($isPrimitive) { "no-encoding" } else { "outside-primitive" }
    for ($i = 0; $i -lt $n; $i++) {
      if ($inBlock[$i]) { continue }
      if ($code[$i] -match $redirectRe) {
        $bad += [pscustomobject]@{ Path = $rel; Line = $i + 1; Text = $lines[$i].Trim(); Kind = $looseKind }
      }
    }
  }
}

if ($bad.Count -gt 0) {
  Write-Host "VIOLATION 进程编码核对: child-process output capture must go through the shared primitive of its own assembly (the encoding choice is made there once, not re-decided per call site)"
  foreach ($b in $bad) {
    Write-Host ("  " + $b.Path + ":" + $b.Line + "  [" + $b.Kind + "]  " + $b.Text)
  }
  Write-Host "FIX [outside-primitive]: take the psi from the primitive of the assembly you are in - Assets/Editor -> EditorProcess.NewStartInfo, Assets/TEngine/Editor -> ShellHelper.NewStartInfo (or the Run/RunCommand form when a plain synchronous read is enough). Do not hand-roll a redirected ProcessStartInfo; the two primitives are separate because an asmdef assembly cannot reference the predefined one."
  Write-Host "FIX [no-encoding]: inside the primitive itself, pin StandardOutputEncoding / StandardErrorEncoding. Which codepage is the subprocess's call, not the caller's: UTF-8 for ssh / git / python, the console OEM page for cmd.exe / dotnet CLI / robocopy / where."
  exit 1
}

$names = ($surfaces | ForEach-Object { $_.Primitive }) -join ' / '
Write-Host ("OK  进程编码核对: " + $files.Count + " .cs scanned across " + $liveRoots + " surface(s), capture goes through " + $names + " only")
exit 0
