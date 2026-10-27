# 命名空间扫描测试.ps1 — 命名空间扫描.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 覆盖 A 段(命名空间规约):GameScripts/Editor 期望全局、Launcher 期望 Launcher、
#   生成物与 vendored 按前缀排除、AssemblyInfo.cs 跳过、扫描根缺失报违规(非 INFRA)。
# 覆盖 B 段(asmdef 归属):无 asmdef 覆盖判违规、asmdef 子树内合规、Assets 根 asmdef 覆盖整棵树、
#   Editor 路径与 Plugins/ 前缀排除在覆盖检查外。
# 另覆盖 Assets 缺失的 INFRA。夹具自造最小 Assets 树,不读真工程。
# 跑法:命名空间扫描测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 命名空间扫描.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "命名空间扫描.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-nsscan-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

# 三个扫描根都须存在,否则各自报 "scan root missing"。$Files = Assets 相对路径 -> 源码文本。
# $Asmdefs = 要落 .asmdef 的 Assets 相对目录($null 时给三个根各落一个,使基线在 B 段也干净)。
function New-Proj([hashtable]$Files, [string[]]$Asmdefs, [switch]$NoAssets, [switch]$NoLauncherRoot) {
  $proj = Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))
  if ($NoAssets) { New-Item -ItemType Directory -Force -Path $proj | Out-Null; return $proj }
  $assets = Join-Path $proj "Assets"
  foreach ($r in @("GameScripts", "Editor")) { New-Item -ItemType Directory -Force -Path (Join-Path $assets $r) | Out-Null }
  if (-not $NoLauncherRoot) { New-Item -ItemType Directory -Force -Path (Join-Path $assets "Launcher") | Out-Null }

  $dirs = if ($null -ne $Asmdefs) { $Asmdefs } else { @("GameScripts", "Launcher") }
  foreach ($d in $dirs) {
    $p = if ($d -eq "") { Join-Path $assets "root.asmdef" } else { Join-Path (Join-Path $assets $d) ((Split-Path $d -Leaf) + ".asmdef") }
    Write-Src $p '{ "name": "Fixture" }'
  }
  if ($Files) { foreach ($rel in $Files.Keys) { Write-Src (Join-Path $assets $rel) $Files[$rel] } }
  return $proj
}

$script:Global = 'public class Foo { }'
$script:Named  = 'namespace Some.Thing { public class Foo { } }'

Write-Host "== 命名空间扫描 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 基线:GameScripts/Editor 全局命名空间、Launcher 用 Launcher,且运行时代码有 asmdef 覆盖
  $files = @{
    "GameScripts\A.cs" = $script:Global
    "Launcher\B.cs"    = 'namespace Launcher { public class B { } }'
    "Editor\C.cs"      = $script:Global
  }
  $r = Invoke-ScanCheck $Target (New-Proj $files $null)
  Assert-True ($r.code -eq 0 -and $r.out -match 'clean') "T1 三根均合规 -> clean"

  # T2 GameScripts 下声明命名空间(期望全局)
  $files = @{ "GameScripts\A.cs" = $script:Named; "Launcher\B.cs" = 'namespace Launcher { public class B { } }'; "Editor\C.cs" = $script:Global }
  $r = Invoke-ScanCheck $Target (New-Proj $files $null)
  Assert-True ($r.code -eq 1 -and $r.out -match "GameScripts/A.cs : namespace 'Some.Thing', expected '\(none\)'") "T2 运行时代码带命名空间 -> 违规"

  # T3 Launcher 下未用 Launcher 命名空间
  $files = @{ "GameScripts\A.cs" = $script:Global; "Launcher\B.cs" = $script:Global; "Editor\C.cs" = $script:Global }
  $r = Invoke-ScanCheck $Target (New-Proj $files $null)
  Assert-True ($r.code -eq 1 -and $r.out -match "Launcher/B.cs : namespace '\(none\)', expected 'Launcher'") "T3 AOT 域缺 Launcher 命名空间 -> 违规"

  # T4 Editor 下声明命名空间(期望全局)
  $files = @{ "GameScripts\A.cs" = $script:Global; "Launcher\B.cs" = 'namespace Launcher { public class B { } }'; "Editor\C.cs" = $script:Named }
  $r = Invoke-ScanCheck $Target (New-Proj $files $null)
  Assert-True ($r.code -eq 1 -and $r.out -match "Editor/C.cs : namespace 'Some.Thing'") "T4 Editor 工具带命名空间 -> 违规"

  # T5 Luban 生成物按前缀排除,保留自己的命名空间
  $files = @{
    "GameScripts\HotFix\GameProto\GameConfig\Gen.cs" = 'namespace GameConfig { public class T { } }'
    "GameScripts\A.cs" = $script:Global
    "Launcher\B.cs"    = 'namespace Launcher { public class B { } }'
    "Editor\C.cs"      = $script:Global
  }
  $r = Invoke-ScanCheck $Target (New-Proj $files $null)
  Assert-True ($r.code -eq 0 -and $r.out -match 'clean') "T5 生成物按前缀排除 -> 不受管"

  # T6 AssemblyInfo.cs 按设计不带命名空间,跳过
  $files = @{
    "GameScripts\AssemblyInfo.cs" = 'using System.Reflection;'
    "GameScripts\A.cs" = $script:Global
    "Launcher\B.cs"    = 'namespace Launcher { public class B { } }'
    "Editor\C.cs"      = $script:Global
  }
  $r = Invoke-ScanCheck $Target (New-Proj $files $null)
  Assert-True ($r.code -eq 0) "T6 AssemblyInfo.cs 跳过"

  # T7 B 段:运行时代码不在任何 asmdef 子树内 -> 编进 predefined Assembly-CSharp
  $files = @{ "GameScripts\A.cs" = $script:Global; "Launcher\B.cs" = 'namespace Launcher { public class B { } }'; "Editor\C.cs" = $script:Global }
  $r = Invoke-ScanCheck $Target (New-Proj $files @("Launcher"))
  Assert-True ($r.code -eq 1 -and $r.out -match 'GameScripts/A.cs : no asmdef coverage') "T7 无 asmdef 覆盖 -> 违规"

  # T8 asmdef 落在 Assets 根 -> 整棵树被覆盖
  $r = Invoke-ScanCheck $Target (New-Proj $files @(""))
  Assert-True ($r.code -eq 0) "T8 Assets 根 asmdef -> 整树覆盖"

  # T9 Editor 路径不参与 asmdef 覆盖检查(编进 Assembly-CSharp-Editor,不涉热更边界)
  $files = @{ "GameScripts\A.cs" = $script:Global; "Launcher\B.cs" = 'namespace Launcher { public class B { } }'; "Editor\C.cs" = $script:Global }
  $r = Invoke-ScanCheck $Target (New-Proj $files @("GameScripts", "Launcher"))
  Assert-True ($r.code -eq 0) "T9 Editor 路径不受 asmdef 覆盖检查"

  # T10 Plugins/ 前缀排除(Unity firstpass 特殊目录)
  $files["Plugins\Vendor.cs"] = $script:Global
  $r = Invoke-ScanCheck $Target (New-Proj $files @("GameScripts", "Launcher"))
  Assert-True ($r.code -eq 0) "T10 Plugins/ 前缀排除在覆盖检查外"

  # T11 扫描根缺失报违规(不是 INFRA):工程布局变了要同步脚本
  $files = @{ "GameScripts\A.cs" = $script:Global; "Editor\C.cs" = $script:Global }
  $r = Invoke-ScanCheck $Target (New-Proj $files @("GameScripts") -NoLauncherRoot)
  Assert-True ($r.code -eq 1 -and $r.out -match 'Assets/Launcher: scan root missing') "T11 扫描根缺失 -> 违规"

  # T12 INFRA:Assets 整个不存在
  $r = Invoke-ScanCheck $Target (New-Proj @{} $null -NoAssets)
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T12 Assets 缺失 -> INFRA"

  # T13/T14 一对:asmref 与 asmdef 同效。Unity 把 asmref 所在目录及其子树并入被引用的 asmdef,
  # 第三方包常用「一个 asmdef + 多个 asmref」组织。两例只差一个 asmref 文件,
  # 负例在场才能证明 T13 测的是 asmref 本身,而不是该目录碰巧被别的规则放过。
  $files = @{ "GameScripts\A.cs" = $script:Global; "Launcher\B.cs" = 'namespace Launcher { public class B { } }'; "Editor\C.cs" = $script:Global }

  $proj = New-Proj $files @("GameScripts", "Launcher")
  Write-Src (Join-Path $proj "Assets\Vendor\Sub\V.cs") $script:Global
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 1 -and $r.out -match 'Vendor/Sub/V.cs : no asmdef coverage') "T13 负例:无 asmref 的第三方目录 -> 违规"

  $proj = New-Proj $files @("GameScripts", "Launcher")
  Write-Src (Join-Path $proj "Assets\Vendor\Sub\V.cs") $script:Global
  Write-Src (Join-Path $proj "Assets\Vendor\Sub\Vendor.asmref") '{ "reference": "GUID:0123456789abcdef0123456789abcdef" }'
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 0) "T14 asmref 目录 -> 视为已覆盖"

  # T15 Unity 忽略目录(段以 . 开头或以 ~ 结尾)里的 .cs 对 Unity 不存在、不编进任何程序集,
  # 不判未覆盖;同树里的非忽略目录照判,证明放过的是忽略规则而不是整棵 Vendor。
  $proj = New-Proj $files @("GameScripts", "Launcher")
  Write-Src (Join-Path $proj "Assets\Vendor\Samples~\Demo\S.cs") $script:Global
  Write-Src (Join-Path $proj "Assets\Vendor\.hidden\H.cs") $script:Global
  Write-Src (Join-Path $proj "Assets\Vendor\Live\L.cs") $script:Global
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 1 -and $r.out -match 'Vendor/Live/L.cs : no asmdef coverage' -and
               $r.out -notmatch 'Samples~' -and $r.out -notmatch '\.hidden') "T15 忽略目录的 .cs 不判未覆盖"
}
finally {
  Remove-FixtureTree $script:fx
}
Exit-TestSuite
