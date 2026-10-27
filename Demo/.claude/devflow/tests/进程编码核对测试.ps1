# 进程编码核对测试.ps1 — 进程编码核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 本道有两个扫描面,各自一个共用原语(跨不了程序集边界,不是重复):
#   Assets/Editor         -> EditorProcess.cs
#   Assets/TEngine/Editor -> ShellHelper.cs
# 覆盖两条不变量:
#   ①原语外不自建:面内除该面原语外自建带 Redirect 的 psi 即违规,**设了编码也不放行**
#     (T2 是收紧后的核心位:首版判据在这里放行,于是同一处被「就地补两行编码」的补丁改法修过一次);
#     短名 / 全限定 / 分散赋值三种写法都判;豁免位认的是**本面**的原语(T11)。
#   ②原语自身不漏编码:原语文件里开了 Redirect 的 psi 必须设编码,块级 + 文件级兜底两档。
# 另覆盖:不重定向放行 / 注释里的 Redirect 不算 / 业务运行时代码在面外 / 同文件多块逐块报 /
#   原语按文件名认(换目录仍豁免)/ 某面原语缺失与两根皆无两类 INFRA /
#   Redirect 右值非字面 true(变量 / 表达式)按会重定向判、字面 false 放行。
# 跑法:进程编码核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 进程编码核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "进程编码核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-procenc-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

$script:EditorPrimitive  = "Editor\BlockBlast\EditorProcess.cs"
$script:TEnginePrimitive = "TEngine\Editor\Utility\ShellHelper.cs"

# 合规原语样本:自建 psi 且设了编码——唯一被豁免的形态。两个面共用同一份正文,文件名区分。
$script:PrimitiveOk = @'
internal static class Primitive
{
    internal static ProcessStartInfo NewStartInfo(string exe, string args, string workDir)
    {
        return new ProcessStartInfo(exe, args)
        {
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            StandardOutputEncoding = new UTF8Encoding(false),
            StandardErrorEncoding = new UTF8Encoding(false),
        };
    }
}
'@

# 造 Demo 夹具。$Files 的键 = Assets 下相对路径。
# 缺省两面齐备(各放一份合规原语);开关用于造 INFRA 与换位用例。
function New-Proj([hashtable]$Files, [switch]$NoRoots, [switch]$NoEditorPrimitive,
                  [switch]$NoTEnginePrimitive, [string]$EditorPrimitiveAt = "") {
  $proj = Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))
  if ($NoRoots) {
    New-Item -ItemType Directory -Force -Path (Join-Path $proj "Assets") | Out-Null
    return $proj
  }
  New-Item -ItemType Directory -Force -Path (Join-Path $proj "Assets\Editor") | Out-Null
  New-Item -ItemType Directory -Force -Path (Join-Path $proj "Assets\TEngine\Editor") | Out-Null
  if (-not $NoEditorPrimitive) {
    $at = if ($EditorPrimitiveAt) { $EditorPrimitiveAt } else { $script:EditorPrimitive }
    Write-Src (Join-Path $proj (Join-Path "Assets" $at)) $script:PrimitiveOk
  }
  if (-not $NoTEnginePrimitive) {
    Write-Src (Join-Path $proj (Join-Path "Assets" $script:TEnginePrimitive)) $script:PrimitiveOk
  }
  foreach ($rel in $Files.Keys) {
    Write-Src (Join-Path $proj (Join-Path "Assets" $rel)) $Files[$rel]
  }
  return $proj
}

# 对象初始化器形态的 psi。$Enc 决定带不带编码行;$New 可换成全限定的 new 表达式。
function Psi([bool]$Enc, [string]$New = "new ProcessStartInfo") {
  $encLines = if ($Enc) {
@'
            StandardOutputEncoding = new UTF8Encoding(false),
            StandardErrorEncoding = new UTF8Encoding(false),
'@
  } else { "" }
@"
class Foo
{
    void Bar()
    {
        var psi = $New
        {
            FileName = "git",
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
$encLines
            CreateNoWindow = true,
        };
    }
}
"@
}

# 只数违规明细行(形如 `  路径:行号  [kind]  源码`),不数末尾那两行按 kind 分述的 FIX 指引——
# 它们同样带方括号标注,裸匹配 [kind] 会把每类多算一条。
function Count-Kind([string]$Out, [string]$Kind) {
  $re = '^\s+\S+:\d+\s+' + [regex]::Escape("[$Kind]")
  return @($Out -split "`n" | Where-Object { $_ -match $re }).Count
}

Write-Host "== 进程编码核对 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 基线:两面各有合规原语
  $r = Invoke-ScanCheck $Target (New-Proj @{})
  Assert-True ($r.code -eq 0 -and $r.out -match 'OK\s+进程编码核对' -and $r.out -match '2 surface') "T1 两面各有合规原语 -> PASS"

  # T2 收紧核心:原语外自建,**即使编码设对了**也不放行。
  #    首版判据在这里放行,于是同一处被补丁改法(就地补两行编码)修过一次,口径仍是两份。
  $r = Invoke-ScanCheck $Target (New-Proj @{ "Editor\Tool\A.cs" = (Psi $true) })
  Assert-True ($r.code -eq 1 -and $r.out -match '\[outside-primitive\]' -and $r.out -match 'A\.cs') "T2 原语外自建(带编码) -> FAIL [outside-primitive]"

  # T3 原语外自建且漏编码:同一条不变量拦下,归类仍是 outside-primitive
  $r = Invoke-ScanCheck $Target (New-Proj @{ "Editor\Tool\A.cs" = (Psi $false) })
  Assert-True ($r.code -eq 1 -and (Count-Kind $r.out 'outside-primitive') -eq 1 -and (Count-Kind $r.out 'no-encoding') -eq 0) "T3 原语外自建(漏编码) -> 仍归 outside-primitive"

  # T4 不重定向的 psi(起进程但不收输出)不受本道约束
  $r = Invoke-ScanCheck $Target (New-Proj @{ "Editor\Tool\A.cs" = @'
class Foo
{
    void Bar()
    {
        var psi = new ProcessStartInfo { FileName = "git", UseShellExecute = true };
    }
}
'@ })
  Assert-True ($r.code -eq 0) "T4 不重定向 -> PASS"

  # T5 注释里提到 Redirect 不算违规(本道自己的头注就会这么写)
  $r = Invoke-ScanCheck $Target (New-Proj @{ "Editor\Tool\A.cs" = @'
class Foo
{
    // 这里本来要 RedirectStandardOutput = true,后来改走原语了。
    /*
     * RedirectStandardError = true 也一样。
     */
    void Bar() { }
}
'@ })
  Assert-True ($r.code -eq 0) "T5 注释里的 Redirect -> 不算违规"

  # T6 全限定 new:BuildPipelineWindow 就是这个写法。只认短名会让它落进文件级兜底、
  #    报成孤立的 Redirect 行而不指向块首。
  $r = Invoke-ScanCheck $Target (New-Proj @{ "Editor\Tool\A.cs" = (Psi $true "new System.Diagnostics.ProcessStartInfo") })
  Assert-True ($r.code -eq 1 -and (Count-Kind $r.out 'outside-primitive') -eq 1 -and $r.out -match 'var psi = new System\.Diagnostics\.ProcessStartInfo') "T6 全限定 new -> 一条,指向块首"

  # T7 分散赋值(先建对象再逐句赋):原语外一律判,文件里有没有编码都不改结论
  $r = Invoke-ScanCheck $Target (New-Proj @{ "Editor\Tool\A.cs" = @'
class Foo
{
    void Bar()
    {
        var psi = new ProcessStartInfo("git", "status");
        psi.RedirectStandardOutput = true;
        psi.StandardOutputEncoding = new UTF8Encoding(false);
    }
}
'@ })
  Assert-True ($r.code -eq 1 -and $r.out -match '\[outside-primitive\]') "T7 原语外分散赋值(有编码) -> 仍 FAIL"

  # T8 Assets/Editor 面的原语自身漏编码:第二条不变量
  $proj = New-Proj @{} -NoEditorPrimitive
  Write-Src (Join-Path $proj (Join-Path "Assets" $script:EditorPrimitive)) (Psi $false)
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 1 -and $r.out -match '\[no-encoding\]' -and $r.out -match 'EditorProcess\.cs') "T8 EditorProcess 漏编码 -> FAIL [no-encoding]"

  # T9 原语分散赋值且通篇无编码 -> 文件级兜底拦下
  $proj = New-Proj @{} -NoEditorPrimitive
  Write-Src (Join-Path $proj (Join-Path "Assets" $script:EditorPrimitive)) @'
internal static class EditorProcess
{
    static void Make()
    {
        var psi = new ProcessStartInfo("git", "status");
        psi.RedirectStandardOutput = true;
    }
}
'@
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 1 -and $r.out -match '\[no-encoding\]') "T9 原语分散赋值且无编码 -> 文件级兜底 FAIL"

  # T10 TEngine 面内自建:该面在扫描面内(此前被整个排除,依据是「不由本仓维护」,不成立)
  $r = Invoke-ScanCheck $Target (New-Proj @{ "TEngine\Editor\ReleaseTools\B.cs" = (Psi $true) })
  Assert-True ($r.code -eq 1 -and $r.out -match '\[outside-primitive\]' -and $r.out -match 'B\.cs') "T10 TEngine 面内自建 -> FAIL(面内)"

  # T11 豁免认的是**本面**的原语:EditorProcess.cs 放进 TEngine 面不享受豁免
  $r = Invoke-ScanCheck $Target (New-Proj @{ "TEngine\Editor\Utility\EditorProcess.cs" = (Psi $true) })
  Assert-True ($r.code -eq 1 -and $r.out -match '\[outside-primitive\]') "T11 跨面同名原语 -> 不豁免"

  # T12 TEngine 面的原语自身漏编码
  $proj = New-Proj @{} -NoTEnginePrimitive
  Write-Src (Join-Path $proj (Join-Path "Assets" $script:TEnginePrimitive)) (Psi $false)
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 1 -and $r.out -match '\[no-encoding\]' -and $r.out -match 'ShellHelper\.cs') "T12 ShellHelper 漏编码 -> FAIL [no-encoding]"

  # T13 面外:业务运行时代码(移动端起不了子进程,纳入只会把 Plugins 里的 vendored 代码拖进来)
  $r = Invoke-ScanCheck $Target (New-Proj @{ "GameScripts\HotFix\B.cs" = (Psi $false) })
  Assert-True ($r.code -eq 0) "T13 业务运行时代码 -> 面外 PASS"

  # T14 同文件两块,逐块报
  $r = Invoke-ScanCheck $Target (New-Proj @{ "Editor\Tool\A.cs" = @'
class Foo
{
    void One()
    {
        var a = new ProcessStartInfo
        {
            RedirectStandardOutput = true,
            StandardOutputEncoding = new UTF8Encoding(false),
        };
    }

    void Two()
    {
        var b = new ProcessStartInfo
        {
            RedirectStandardError = true,
        };
    }
}
'@ })
  Assert-True ($r.code -eq 1 -and (Count-Kind $r.out 'outside-primitive') -eq 2) "T14 同文件两块 -> 逐块报 2 条"

  # T15 豁免按文件名认,不写死路径:原语换个目录照常豁免
  $r = Invoke-ScanCheck $Target (New-Proj @{} -EditorPrimitiveAt "Editor\Infra\Proc\EditorProcess.cs")
  Assert-True ($r.code -eq 0) "T15 原语换目录 -> 仍豁免 PASS"

  # T16 某个面在、它的原语不见了:豁免位与 FIX 指引都挂在原语上,不能静默放行
  $r = Invoke-ScanCheck $Target (New-Proj @{ "Editor\Tool\A.cs" = (Psi $true) } -NoEditorPrimitive)
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA' -and $r.out -match 'EditorProcess\.cs') "T16 面在但原语缺失 -> INFRA 并点名"
  $r = Invoke-ScanCheck $Target (New-Proj @{} -NoTEnginePrimitive)
  Assert-True ($r.code -eq 2 -and $r.out -match 'ShellHelper\.cs') "T16b TEngine 面原语缺失 -> INFRA 并点名"

  # T17 两个扫描根都不在
  $r = Invoke-ScanCheck $Target (New-Proj @{} -NoRoots)
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T17 两根皆无 -> INFRA"

  # T18 Redirect 右值不是字面 true(变量 / 表达式):运行期可能为真,按「会重定向」判,
  #     块内与分散赋值两种写法都拦;只有字面 false 放行
  $r = Invoke-ScanCheck $Target (New-Proj @{ "Editor\Tool\A.cs" = @'
class Foo
{
    void Bar(bool capture)
    {
        var a = new ProcessStartInfo
        {
            RedirectStandardOutput = capture,
        };
        var b = new ProcessStartInfo("git", "status");
        b.RedirectStandardError = capture && verbose;
    }
}
'@ })
  Assert-True ($r.code -eq 1 -and (Count-Kind $r.out 'outside-primitive') -eq 2) "T18 非字面 true 的 Redirect(块内 + 分散) -> 逐处 FAIL"
  $r = Invoke-ScanCheck $Target (New-Proj @{ "Editor\Tool\A.cs" = @'
class Foo
{
    void Bar()
    {
        var a = new ProcessStartInfo { RedirectStandardOutput = false, UseShellExecute = true };
    }
}
'@ })
  Assert-True ($r.code -eq 0) "T18b 字面 false -> 不算重定向 PASS"
  $proj = New-Proj @{} -NoEditorPrimitive
  Write-Src (Join-Path $proj (Join-Path "Assets" $script:EditorPrimitive)) ((Psi $false) -replace 'RedirectStandard(Output|Error) = true', 'RedirectStandard$1 = capture')
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 1 -and $r.out -match '\[no-encoding\]') "T18c 原语内非字面 true 且漏编码 -> FAIL [no-encoding]"
}
finally {
  Remove-FixtureTree $script:fx
}
Exit-TestSuite
