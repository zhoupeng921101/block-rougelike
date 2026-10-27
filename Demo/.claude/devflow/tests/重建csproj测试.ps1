# 重建csproj测试.ps1 — 重建csproj.ps1 的 CLI 层契约测试(假 Unity 工程落 %TEMP%;T20、T21d 在夹具里建临时 git 仓,不触真仓)。
# 覆盖:FRESH / 多列 STALE / 缺列 STALE / 引用方过期 / -InPlace 修复且保留非 Compile 行 /
#   Unity 忽略目录 / asmref 接管子树 / INFRA(无 csproj、无 asmdef) /
#   STALE-REGEN 引用集(按名、按 GUID 引用缺项,-InPlace 也零写入;已引用的两种形态、平台约束、
#   宏底数算不出时的 define 约束、解析不到的 GUID 不判;defineConstraints 求值后该有没有、不该有却有)/
#   STALE-REGEN 宏(全局宏缺 / 多、本 asmdef versionDefines 产出的不算多、版本宏缺、包未装的不判、
#   平台组认不出不判;版本表达式按 Unity 区间语法求值:开闭区间、一端空、[x]、SemVer 预发布、file: 与 git
#   包取版本、name=Unity 按编辑器版本,解析不了 / 版本取不到 / 只差版本类型后缀的不判;残留宏按同平台组
#   csproj 对照:包卸载 / 表达式不成立 / 条目已删判中,条件成立、求不了值、人人都有、不足两份不判;
#   各平台组都已删的全局宏按 git 历史认;Assets/csc.rsp 宏缺 / 各写法解析 / 平台组已无但 rsp 仍定义 / 已从 rsp
#   删掉;T20、T21d 在夹具里建临时 git 仓,其余用例零 git)/
#   predefined 起点 Assembly-CSharp-Editor(判定面含不在 Game 闭包里的程序集、自身比对并修 Compile;残留宏按
#   纯编辑器与其余两类分组对照,两类内置宏不同不误报,同类内残留照判)/
#   工程内嵌包(Packages 下含 package.json 的目录):包内程序集进判定面、缺列 / 多列判中、-InPlace 修好、闭包穿过
#   包往下取、可作 -Assembly 起点;它的引用集 / 宏与指向它的引用不判;无 package.json 的目录不算包;两处同名 INFRA。
# 跑法:重建csproj测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 重建csproj.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "重建csproj.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-csproj-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null
$utf8 = New-Object System.Text.UTF8Encoding($false)
# 被测脚本在 git 仓内会写运行态缓存(claude-wf-3b\csproj-rsp-paths.json):隔离到夹具里,不碰真的运行态目录。
$oldLad = $env:LOCALAPPDATA
$env:LOCALAPPDATA = Join-Path $script:fx "lad"
New-Item -ItemType Directory -Force -Path $env:LOCALAPPDATA | Out-Null

function Write-Fx([string]$Rel, [string]$Text) {
  $p = Join-Path $script:proj $Rel
  $d = Split-Path $p -Parent
  if (-not (Test-Path $d)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
  [System.IO.File]::WriteAllText($p, $Text, $utf8)
}
function New-Csproj([string[]]$Compile, [string[]]$Refs) {
  $l = @('<Project>', '  <ItemGroup>')
  foreach ($c in $Compile) { $l += ('    <Compile Include="' + $c + '" />') }
  $l += @('  </ItemGroup>', '  <ItemGroup>')
  foreach ($r in $Refs) { $l += ('    <ProjectReference Include="' + $r + '.csproj" />') }
  $l += @('  </ItemGroup>', '  <PropertyGroup><DefineConstants>KEEP_ME</DefineConstants></PropertyGroup>', '</Project>')
  return ($l -join "`r`n")
}
# 基准工程:Game(A.cs, B.cs;Sub 子树归 Sub;Ref 子树经 asmref 归 Sub;Samples~ 忽略)引 Sub。
function New-Project {
  $script:proj = Join-Path $script:fx ("p-" + [Guid]::NewGuid().ToString("N"))
  Write-Fx "Assets\Game\Game.asmdef" '{ "name": "Game", "references": [ "Sub" ] }'
  Write-Fx "Assets\Game\A.cs" "class A {}"
  Write-Fx "Assets\Game\B.cs" "class B {}"
  Write-Fx "Assets\Game\Samples~\Ignored.cs" "class I {}"
  Write-Fx "Assets\Game\Sub\Sub.asmdef" '{ "name": "Sub" }'
  Write-Fx "Assets\Game\Sub\S.cs" "class S {}"
  Write-Fx "Assets\Game\Ref\x.asmref" '{ "reference": "Sub" }'
  Write-Fx "Assets\Game\Ref\R.cs" "class R {}"
  Write-Fx "Game.csproj" (New-Csproj @('Assets\Game\A.cs', 'Assets\Game\B.cs') @('Sub'))
  Write-Fx "Sub.csproj" (New-Csproj @('Assets\Game\Sub\S.cs') @())
}
function Invoke-Rebuild([string[]]$Extra, [string]$Asm = 'Game') {
  $argv = @('-ProjectRoot', $script:proj, '-Assembly', $Asm) + $Extra
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target @argv 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}

Write-Host "== 重建csproj CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 一致(忽略目录、asmref 子树不算进 Game)
  New-Project
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: FRESH \| Game,Sub') "T1 一致 -> FRESH,判定面含引用方 Sub"

  # T2 多列:csproj 列着已删文件
  New-Project
  [System.IO.File]::Delete((Join-Path $script:proj "Assets\Game\B.cs"))
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 1 -and $r.out -match '多列.*B\.cs' -and $r.out -match 'VERDICT: STALE \| Game') "T2 多列 -> STALE exit 1 点名文件"

  # T3 缺列:磁盘新增文件未收录
  New-Project
  Write-Fx "Assets\Game\C.cs" "class C {}"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 1 -and $r.out -match '缺列.*C\.cs') "T3 缺列 -> STALE exit 1 点名文件"

  # T4 引用方过期:只有 Sub 缺列
  New-Project
  Write-Fx "Assets\Game\Sub\S2.cs" "class S2 {}"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 1 -and $r.out -match 'VERDICT: STALE \| Sub \|') "T4 引用方过期 -> STALE 点名 Sub"

  # T5 -InPlace 修复两向,保留非 Compile 行,复判 FRESH
  New-Project
  [System.IO.File]::Delete((Join-Path $script:proj "Assets\Game\B.cs"))
  Write-Fx "Assets\Game\C.cs" "class C {}"
  Write-Fx "Assets\Game\Sub\S2.cs" "class S2 {}"
  $r = Invoke-Rebuild @('-InPlace')
  $txt = [System.IO.File]::ReadAllText((Join-Path $script:proj "Game.csproj"))
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: FIXED \| Game,Sub') "T5a -InPlace -> FIXED 两个程序集"
  Assert-True ($txt -match 'Game\\C\.cs' -and $txt -notmatch 'Game\\B\.cs' -and $txt -match 'KEEP_ME' -and $txt -match 'ProjectReference') "T5b 重写只动 Compile 列表"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: FRESH') "T5c 修复后复判 FRESH"

  # T6 未加 -InPlace 零写入
  New-Project
  Write-Fx "Assets\Game\C.cs" "class C {}"
  $before = [System.IO.File]::ReadAllText((Join-Path $script:proj "Game.csproj"))
  [void](Invoke-Rebuild @())
  Assert-True ($before -eq [System.IO.File]::ReadAllText((Join-Path $script:proj "Game.csproj"))) "T6 缺省只判不写"

  # T7 INFRA:引用方 csproj 缺失
  New-Project
  [System.IO.File]::Delete((Join-Path $script:proj "Sub.csproj"))
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 2 -and $r.out -match 'VERDICT: INFRA.*Sub\.csproj') "T7 csproj 缺失 -> INFRA exit 2"

  # T8 INFRA:无该 name 的 asmdef
  New-Project
  [System.IO.File]::Delete((Join-Path $script:proj "Assets\Game\Game.asmdef"))
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 2 -and $r.out -match 'VERDICT: INFRA.*name=Game') "T8 asmdef 缺失 -> INFRA exit 2"

  # T9 引用集缺项(按名):基线新增 asmdef 被 Game 引用,csproj 未引用;-InPlace 也零写入
  New-Project
  Write-Fx "Assets\Extra\Extra.asmdef" '{ "name": "Extra" }'
  Write-Fx "Assets\Extra\X.cs" "class X {}"
  Write-Fx "Assets\Game\Game.asmdef" '{ "name": "Game", "references": [ "Sub", "Extra" ] }'
  Write-Fx "Assets\Game\C.cs" "class C {}"
  $before = [System.IO.File]::ReadAllText((Join-Path $script:proj "Game.csproj"))
  $r = Invoke-Rebuild @('-InPlace')
  Assert-True ($r.code -eq 3 -and $r.out -match 'STALE-REFS Game\.csproj: asmdef 引用 Extra' -and $r.out -match 'Extra\.csproj 也不存在' -and $r.out -match 'VERDICT: STALE-REGEN \| Game \|') "T9a 按名引用缺项 -> STALE-REGEN exit 3 点名"
  Assert-True ($before -eq [System.IO.File]::ReadAllText((Join-Path $script:proj "Game.csproj"))) "T9b STALE-REFS 时 -InPlace 零写入"

  # T10 引用集缺项(按 GUID,大小写不敏感)
  New-Project
  Write-Fx "Assets\Extra\Extra.asmdef" '{ "name": "Extra" }'
  Write-Fx "Assets\Extra\Extra.asmdef.meta" "fileFormatVersion: 2`r`nguid: 0123456789abcdef0123456789abcdef`r`n"
  Write-Fx "Assets\Game\Game.asmdef" '{ "name": "Game", "references": [ "Sub", "GUID:0123456789ABCDEF0123456789abcdef" ] }'
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match 'asmdef 引用 Extra') "T10 GUID 引用缺项 -> STALE-REFS 解析出名字"

  # T11 已引用的 <Reference Include> 形态不判(ProjectReference 形态由 T1 的 Sub 覆盖)
  New-Project
  Write-Fx "Assets\Extra\Extra.asmdef" '{ "name": "Extra" }'
  Write-Fx "Assets\Game\Game.asmdef" '{ "name": "Game", "references": [ "Sub", "Extra" ] }'
  $gp = Join-Path $script:proj "Game.csproj"
  [System.IO.File]::WriteAllText($gp, ([System.IO.File]::ReadAllText($gp) -replace '</Project>', "  <ItemGroup><Reference Include=`"Extra`"><HintPath>Library\ScriptAssemblies\Extra.dll</HintPath></Reference></ItemGroup>`r`n</Project>"), $utf8)
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: FRESH') "T11 <Reference Include> 形态算已引用 -> FRESH"

  # T12 被引方不一定编进 Editor(平台限定 / 排除 Editor / define 约束)与解析不到的 GUID:不判
  foreach ($c in @(
      @{ J = '{ "name": "Extra", "includePlatforms": [ "Android" ] }'; N = "includePlatforms 不含 Editor" },
      @{ J = '{ "name": "Extra", "excludePlatforms": [ "Editor" ] }'; N = "excludePlatforms 含 Editor" },
      @{ J = '{ "name": "Extra", "defineConstraints": [ "FOO" ] }'; N = "defineConstraints(宏底数算不出)" })) {
    New-Project
    Write-Fx "Assets\Extra\Extra.asmdef" $c.J
    Write-Fx "Assets\Game\Game.asmdef" '{ "name": "Game", "references": [ "Sub", "Extra" ] }'
    $r = Invoke-Rebuild @()
    Assert-True ($r.code -eq 0 -and $r.out -notmatch 'STALE-REFS') ("T12 " + $c.N + " -> 不判")
  }
  New-Project
  Write-Fx "Assets\Game\Game.asmdef" '{ "name": "Game", "references": [ "Sub", "GUID:ffffffffffffffffffffffffffffffff", "Some.Package" ] }'
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'STALE-REFS') "T12 解析不到的 GUID / 不在 Assets 下的名字 -> 不判"

  # ---- 宏:Game.csproj 换成带平台宏的 DefineConstants,ProjectSettings 给两个平台组 ----
  function Write-Settings([string]$WebGL, [string]$Android) {
    Write-Fx "ProjectSettings\ProjectSettings.asset" ("PlayerSettings:`r`n  scriptingDefineSymbols:`r`n    Android: " + $Android + "`r`n    WebGL: " + $WebGL + "`r`n  additionalCompilerArguments: {}`r`n")
  }
  function Set-GameDefines([string]$Defs) {
    $gp = Join-Path $script:proj "Game.csproj"
    [System.IO.File]::WriteAllText($gp, ([System.IO.File]::ReadAllText($gp) -replace '<DefineConstants>[^<]*</DefineConstants>', ('<DefineConstants>' + $Defs + '</DefineConstants>')), $utf8)
  }

  # T13 全局宏缺:WebGL 组新增 BAR,csproj 未生成
  New-Project; Write-Settings "FOO;BAR" "FOO"; Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match 'STALE-DEFINES Game\.csproj: 缺全局宏 BAR\(ProjectSettings WebGL' -and $r.out -match 'VERDICT: STALE-REGEN \| Game \|') "T13 全局宏缺 -> STALE-REGEN 点名宏与平台组"

  # T14 全局宏多:WebGL 组已无 ANDROID_ONLY(Android 组仍有),csproj 还带着
  New-Project; Write-Settings "FOO" "FOO;ANDROID_ONLY"; Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;ANDROID_ONLY"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match '多出全局宏 ANDROID_ONLY') "T14a 全局宏多 -> STALE-REGEN"
  New-Project; Write-Settings "FOO" "FOO;ANDROID_ONLY"; Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;ANDROID_ONLY"
  Write-Fx "Assets\Game\Game.asmdef" '{ "name": "Game", "references": [ "Sub" ], "versionDefines": [ { "name": "com.x.pkg", "expression": "", "define": "ANDROID_ONLY" } ] }'
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'STALE-') "T14b 本 asmdef versionDefines 产出的宏不算多"

  # T15 平台组认不出(无 UNITY_WEBGL/ANDROID/IOS/STANDALONE)-> 全局宏不判
  New-Project; Write-Settings "FOO;BAR" "FOO"; Set-GameDefines "UNITY_EDITOR;FOO"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'STALE-') "T15 平台组认不出 -> 不判"

  # T16 版本宏:包已装、表达式为空 -> csproj 须有;带表达式 / 包未装 -> 不判
  New-Project; Write-Settings "FOO" "FOO"; Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO"
  Write-Fx "Packages\packages-lock.json" '{ "dependencies": { "com.x.pkg": { "version": "1.0.0" }, "com.y.pkg": { "version": "2.0.0" } } }'
  Write-Fx "Assets\Game\Game.asmdef" '{ "name": "Game", "references": [ "Sub" ], "versionDefines": [ { "name": "com.x.pkg", "expression": "", "define": "HAS_X" }, { "name": "com.y.pkg", "expression": "[3.0,4.0)", "define": "HAS_Y3" }, { "name": "com.z.pkg", "expression": "", "define": "HAS_Z" } ] }'
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match '缺版本宏 HAS_X' -and $r.out -notmatch 'HAS_Y3' -and $r.out -notmatch 'HAS_Z') "T16 版本宏缺:条件成立才判,表达式不成立 / 包未装不判"

  # T18 版本表达式求值:成立(Hit)则 csproj 缺宏须判中;不成立或无从求值不判
  $reg = '"com.x.pkg": { "version": "1.5.0", "source": "registry" }'
  foreach ($c in @(
      @{ Lock = $reg; Name = "com.x.pkg"; Expr = "1.2"; Hit = $true; N = "下限 x 成立" },
      @{ Lock = $reg; Name = "com.x.pkg"; Expr = "2.0"; Hit = $false; N = "下限 x 不成立" },
      @{ Lock = $reg; Name = "com.x.pkg"; Expr = "[1.0,2.0)"; Hit = $true; N = "闭开区间内" },
      @{ Lock = $reg; Name = "com.x.pkg"; Expr = "(1.5.0,2.0]"; Hit = $false; N = "开下界等于版本" },
      @{ Lock = $reg; Name = "com.x.pkg"; Expr = "[1.0,1.5.0)"; Hit = $false; N = "开上界等于版本" },
      @{ Lock = $reg; Name = "com.x.pkg"; Expr = "[1.5.0]"; Hit = $true; N = "[x] 恰为" },
      @{ Lock = $reg; Name = "com.x.pkg"; Expr = "[1.0,)"; Hit = $true; N = "上界空" },
      @{ Lock = $reg; Name = "com.x.pkg"; Expr = "(,1.4]"; Hit = $false; N = "下界空、超上界" },
      @{ Lock = $reg; Name = "com.x.pkg"; Expr = "not-a-range"; Hit = $false; N = "解析不了 -> 不判" },
      @{ Lock = '"com.x.pkg": { "version": "2.0.0-pre.3", "source": "registry" }'; Name = "com.x.pkg"; Expr = "[2.0.0-pre.2,2.0.0)"; Hit = $true; N = "预发布版落在区间内" },
      @{ Lock = '"com.x.pkg": { "version": "2.0.0-pre.3", "source": "registry" }'; Name = "com.x.pkg"; Expr = "2.0.0"; Hit = $false; N = "预发布版低于正式版" },
      @{ Lock = '"com.f.pkg": { "version": "file:MyPkg", "source": "embedded" }'; Name = "com.f.pkg"; Expr = "3.0"; Files = @{ "Packages\MyPkg\package.json" = '{ "version": "3.1.0" }' }; Hit = $true; N = "file: 包读 package.json" },
      @{ Lock = '"com.g.pkg": { "version": "https://x.git#v1", "source": "git" }'; Name = "com.g.pkg"; Expr = "[4.0,5.0)"; Files = @{ "Library\PackageCache\com.g.pkg@abc123\package.json" = '{ "version": "4.2.0" }' }; Hit = $true; N = "git 包读 PackageCache" },
      @{ Lock = '"com.g.pkg": { "version": "https://x.git#v1", "source": "git" }'; Name = "com.g.pkg"; Expr = "[4.0,5.0)"; Hit = $false; N = "git 包版本取不到 -> 不判" },
      @{ Lock = ''; Name = "Unity"; Expr = "6000.0"; Hit = $true; N = "Unity 下限成立" },
      @{ Lock = ''; Name = "Unity"; Expr = "[6000.4,)"; Hit = $false; N = "Unity 下限不成立" },
      @{ Lock = ''; Name = "Unity"; Expr = "6000.3.19f2"; Hit = $false; N = "Unity 同类型后缀按序号比" },
      @{ Lock = ''; Name = "Unity"; Expr = "[6000.3.19f1]"; Hit = $true; N = "Unity 恰为" },
      @{ Lock = ''; Name = "Unity"; Expr = "6000.3.19"; Hit = $false; N = "Unity 只差后缀 -> 无从判定不判" })) {
    New-Project; Write-Settings "FOO" "FOO"; Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO"
    Write-Fx "Packages\packages-lock.json" ('{ "dependencies": { ' + $c.Lock + ' } }')
    Write-Fx "ProjectSettings\ProjectVersion.txt" "m_EditorVersion: 6000.3.19f1`r`n"
    if ($c.Files) { foreach ($k in $c.Files.Keys) { Write-Fx $k $c.Files[$k] } }
    Write-Fx "Assets\Game\Game.asmdef" ('{ "name": "Game", "references": [ "Sub" ], "versionDefines": [ { "name": "' + $c.Name + '", "expression": "' + $c.Expr + '", "define": "VDEF" } ] }')
    $r = Invoke-Rebuild @()
    if ($c.Hit) { $ok = ($r.code -eq 3 -and $r.out -match '缺版本宏 VDEF') } else { $ok = ($r.code -eq 0 -and $r.out -notmatch 'STALE-') }
    Assert-True $ok ("T18 " + $c.N + "(" + $c.Name + " " + $c.Expr + ")")
  }

  # T19 残留宏:与同平台组其余 csproj(Sub)对照,独有且不来自当前成立 / 求不了值的 versionDefines 即残留
  function Set-SubDefines([string]$Defs) {
    $sp = Join-Path $script:proj "Sub.csproj"
    [System.IO.File]::WriteAllText($sp, ([System.IO.File]::ReadAllText($sp) -replace '<DefineConstants>[^<]*</DefineConstants>', ('<DefineConstants>' + $Defs + '</DefineConstants>')), $utf8)
  }
  $gitLock = '"com.g.pkg": { "version": "https://x.git#v1", "source": "git" }'
  foreach ($c in @(
      @{ Lock = '"com.y.pkg": { "version": "1.0.0" }'; VD = '{ "name": "com.x.pkg", "expression": "", "define": "LEFT" }'; Game = "LEFT"; Sub = ""; Hit = $true; N = "包已卸载、宏还在 -> 残留" },
      @{ Lock = '"com.x.pkg": { "version": "1.0.0" }'; VD = '{ "name": "com.x.pkg", "expression": "[2.0,)", "define": "LEFT" }'; Game = "LEFT"; Sub = ""; Hit = $true; N = "表达式已不成立、宏还在 -> 残留" },
      @{ Lock = '"com.x.pkg": { "version": "1.0.0" }'; VD = ''; Game = "LEFT"; Sub = ""; Hit = $true; N = "versionDefines 条目已删、宏还在 -> 残留" },
      @{ Lock = '"com.x.pkg": { "version": "1.0.0" }'; VD = '{ "name": "com.x.pkg", "expression": "", "define": "LEFT" }'; Game = "LEFT"; Sub = ""; Hit = $false; N = "条件成立 -> 不算残留" },
      @{ Lock = $gitLock; VD = '{ "name": "com.g.pkg", "expression": "[4.0,5.0)", "define": "LEFT" }'; Game = "LEFT"; Sub = ""; Hit = $false; N = "条件求不了值 -> 不算残留" },
      @{ Lock = '"com.y.pkg": { "version": "1.0.0" }'; VD = ''; Game = "LEFT"; Sub = ";LEFT"; Hit = $false; N = "同平台 csproj 人人都有 -> 与内置宏无从区分不判" })) {
    New-Project; Write-Settings "FOO" "FOO"
    Write-Fx "Packages\packages-lock.json" ('{ "dependencies": { ' + $c.Lock + ' } }')
    $vds = ""; if ($c.VD) { $vds = ', "versionDefines": [ ' + $c.VD + ' ]' }
    Write-Fx "Assets\Game\Game.asmdef" ('{ "name": "Game", "references": [ "Sub" ]' + $vds + ' }')
    Set-GameDefines ("UNITY_EDITOR;UNITY_WEBGL;FOO;" + $c.Game)
    Set-SubDefines ("UNITY_EDITOR;UNITY_WEBGL;FOO" + $c.Sub)
    $r = Invoke-Rebuild @()
    if ($c.Hit) { $ok = ($r.code -eq 3 -and $r.out -match 'STALE-DEFINES Game\.csproj: 残留宏 LEFT') } else { $ok = ($r.code -eq 0 -and $r.out -notmatch 'STALE-') }
    Assert-True $ok ("T19 " + $c.N)
  }
  # 同平台组只有一份 csproj(Sub 认不出平台)-> 无从对照不判
  New-Project; Write-Settings "FOO" "FOO"
  Write-Fx "Packages\packages-lock.json" '{ "dependencies": { } }'
  Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;LEFT"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'STALE-') "T19 同平台组不足两份 csproj -> 不判"

  # T20 各平台组都已删掉的全局宏:夹具建临时 git 仓,ProjectSettings 先有 OLD 后删
  foreach ($c in @(
      @{ Git = $true; VD = ''; Code = 3; Pat = '多出全局宏 OLD\(ProjectSettings 各平台组都已删除'; N = "历史里有、各组都已删、csproj 还在 -> 判中" },
      @{ Git = $true; VD = ', "versionDefines": [ { "name": "com.x.pkg", "expression": "", "define": "OLD" } ]'; Code = 0; Pat = 'VERDICT: FRESH'; N = "由本 asmdef 成立的 versionDefines 产出 -> 不判" },
      @{ Git = $false; VD = ''; Code = 0; Pat = 'VERDICT: FRESH'; N = "不在 git 仓内 -> 无历史可对照不判" })) {
    New-Project; Write-Settings "FOO;OLD" "FOO"
    Write-Fx "Packages\packages-lock.json" '{ "dependencies": { "com.x.pkg": { "version": "1.0.0" } } }'
    if ($c.Git) {
      New-GitRepo $script:proj
      Write-Settings "FOO" "FOO"
      G $script:proj "add -A" | Out-Null
      G $script:proj "commit -q -m drop-old" | Out-Null
    } else {
      Write-Settings "FOO" "FOO"
    }
    Write-Fx "Assets\Game\Game.asmdef" ('{ "name": "Game", "references": [ "Sub" ]' + $c.VD + ' }')
    Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;OLD"
    $r = Invoke-Rebuild @()
    Assert-True ($r.code -eq $c.Code -and $r.out -match $c.Pat) ("T20 " + $c.N)
  }

  # T21 Assets/csc.rsp 的宏
  New-Project; Write-Settings "FOO" "FOO"
  Write-Fx "Assets\csc.rsp" "-define:RSP1;RSP2`r`n"
  Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;RSP1"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match 'STALE-DEFINES Game\.csproj: 缺 csc\.rsp 宏 RSP2' -and $r.out -notmatch 'Game\.csproj: 缺 csc\.rsp 宏 RSP1') "T21a csc.rsp 宏缺 -> 判中,已有的不报"

  New-Project; Write-Settings "FOO" "FOO"
  Write-Fx "Assets\csc.rsp" "# -define:IGNORED`r`n/define:A`r`n-d:B -nowarn:0169`r`n-define:`"C,D`"`r`n/D:E`r`n"
  Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;A;B;C;D;E"; Set-SubDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;A;B;C;D;E"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'STALE-') "T21b 各写法(/define: -d: 引号 逗号 大小写)与注释行解析对"

  New-Project; Write-Settings "FOO" "FOO;BOTH"
  Write-Fx "Assets\csc.rsp" "-define:BOTH`r`n"
  Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;BOTH"; Set-SubDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;BOTH"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'STALE-') "T21c 平台组已无但 csc.rsp 仍定义 -> 不算多出全局宏"

  New-Project; Write-Settings "FOO" "FOO"
  Write-Fx "Assets\csc.rsp" "-define:OLDR`r`n"
  New-GitRepo $script:proj
  [System.IO.File]::Delete((Join-Path $script:proj "Assets\csc.rsp"))
  G $script:proj "add -A" | Out-Null
  G $script:proj "commit -q -m drop-rsp" | Out-Null
  Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;OLDR"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match 'STALE-DEFINES Game\.csproj: 多出 csc\.rsp 宏 OLDR\(该程序集当前没有生效的 csc\.rsp') "T21d 已从 csc.rsp 删掉、csproj 还在 -> 判中"

  # T17 defineConstraints 按宏求值:成立则须引、不成立则不得引
  foreach ($c in @(
      @{ C = '[ "FOO" ]'; Ref = $false; Code = 3; Pat = 'asmdef 引用 Extra,csproj 未引用'; N = "约束成立而未引 -> 缺" },
      @{ C = '[ "!BAR || BAZ" ]'; Ref = $false; Code = 3; Pat = 'asmdef 引用 Extra,csproj 未引用'; N = "! 与 || 求值成立而未引 -> 缺" },
      @{ C = '[ "BAR" ]'; Ref = $true; Code = 3; Pat = 'defineConstraints 在当前宏下不成立'; N = "约束不成立却引着 -> 多" },
      @{ C = '[ "BAR" ]'; Ref = $false; Code = 0; Pat = 'VERDICT: FRESH'; N = "约束不成立且未引 -> 不判" },
      @{ C = '[ "HAS_X" ], "versionDefines": [ { "name": "com.x.pkg", "expression": "", "define": "HAS_X" } ]'; Ref = $false; Code = 3; Pat = 'asmdef 引用 Extra,csproj 未引用'; N = "约束靠被引方自己成立的 versionDefines 满足 -> 须引" })) {
    New-Project; Write-Settings "FOO" "FOO"; Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO"
    Write-Fx "Packages\packages-lock.json" '{ "dependencies": { "com.x.pkg": { "version": "1.0.0" } } }'
    Write-Fx "Assets\Extra\Extra.asmdef" ('{ "name": "Extra", "defineConstraints": ' + $c.C + ' }')
    Write-Fx "Assets\Game\Game.asmdef" '{ "name": "Game", "references": [ "Sub", "Extra" ] }'
    if ($c.Ref) {
      $gp = Join-Path $script:proj "Game.csproj"
      [System.IO.File]::WriteAllText($gp, ([System.IO.File]::ReadAllText($gp) -replace '</Project>', "  <ItemGroup><Reference Include=`"Extra`" /></ItemGroup>`r`n</Project>"), $utf8)
    }
    $r = Invoke-Rebuild @()
    Assert-True ($r.code -eq $c.Code -and $r.out -match $c.Pat) ("T17 " + $c.N)
  }

  # ---- predefined 起点:Assembly-CSharp-Editor 引 Game(闭包含 Sub)与 Launch(不在 Game 闭包里)----
  function New-EditorRootProject([string[]]$EditorRefs) {
    New-Project
    Write-Fx "Assets\Editor\Ed.cs" "class Ed {}"
    Write-Fx "Assets\Launch\Launch.asmdef" '{ "name": "Launch" }'
    Write-Fx "Assets\Launch\L.cs" "class L {}"
    Write-Fx "Launch.csproj" (New-Csproj @('Assets\Launch\L.cs') @())
    Write-Fx "Assembly-CSharp-Editor.csproj" (New-Csproj @('Assets\Editor\Ed.cs') $EditorRefs)
  }
  function Set-CsprojDefines([string]$Name, [string]$Defs) {
    $p = Join-Path $script:proj ($Name + ".csproj")
    [System.IO.File]::WriteAllText($p, ([System.IO.File]::ReadAllText($p) -replace '<DefineConstants>[^<]*</DefineConstants>', ('<DefineConstants>' + $Defs + '</DefineConstants>')), $utf8)
  }

  # T22a 一致 -> FRESH,判定面 = Editor 自己 + 整个引用闭包
  New-EditorRootProject @('Game', 'Launch')
  $r = Invoke-Rebuild @() 'Assembly-CSharp-Editor'
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: FRESH \| Assembly-CSharp-Editor,Game,Launch,Sub') ("T22a predefined 起点 -> FRESH,判定面含闭包:" + ($r.out -split "`n")[-1])
  # T22b Launch 的 asmdef 新引 Extra 而 csproj 未引:以 Game 为起点看不到,以 Editor 为起点判中
  New-EditorRootProject @('Game', 'Launch')
  Write-Fx "Assets\Extra\Extra.asmdef" '{ "name": "Extra" }'
  Write-Fx "Assets\Launch\Launch.asmdef" '{ "name": "Launch", "references": [ "Extra" ] }'
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0) "T22b 以 Game 为起点:Launch 不在闭包里,看不到"
  $r = Invoke-Rebuild @() 'Assembly-CSharp-Editor'
  Assert-True ($r.code -eq 3 -and $r.out -match 'STALE-REFS Launch\.csproj: asmdef 引用 Extra') "T22c 以 Editor 为起点 -> Launch 引用集过期判中"
  # T22d Editor 自己的 Compile 列表缺列 -> STALE;-InPlace 修
  New-EditorRootProject @('Game', 'Launch')
  Write-Fx "Assets\Editor\Ed2.cs" "class Ed2 {}"
  $r = Invoke-Rebuild @() 'Assembly-CSharp-Editor'
  Assert-True ($r.code -eq 1 -and $r.out -match '缺列.*Editor/Ed2\.cs' -and $r.out -match 'VERDICT: STALE \| Assembly-CSharp-Editor \|') "T22d predefined 起点自身缺列 -> STALE"
  $r = Invoke-Rebuild @('-InPlace') 'Assembly-CSharp-Editor'
  $txt = [System.IO.File]::ReadAllText((Join-Path $script:proj "Assembly-CSharp-Editor.csproj"))
  Assert-True ($r.code -eq 0 -and $txt -match 'Editor\\Ed2\.cs' -and $txt -match 'ProjectReference') "T22e -InPlace 修 predefined 起点的 Compile 列表"

  # T23 残留宏按类对照:纯编辑器 asmdef(EdA / EdB)与其余(Game / Sub)内置宏不同,混在一起取交集会全数误报
  $player = "UNITY_EDITOR;UNITY_WEBGL;FOO;NET_STANDARD;NETSTANDARD2_1"
  $editor = "UNITY_EDITOR;UNITY_WEBGL;FOO;NET_4_6;UNITY_EDITOR_ONLY_COMPILATION"
  foreach ($c in @(@{ Extra = ""; Hit = $false; N = "两类各自一致 -> 不误报" }, @{ Extra = ";LEFT"; Hit = $true; N = "纯编辑器类内独有 LEFT -> 残留照判" })) {
    New-EditorRootProject @('Game', 'EdA', 'EdB'); Write-Settings "FOO" "FOO"
    Write-Fx "Packages\packages-lock.json" '{ "dependencies": { } }'
    foreach ($n in @('EdA', 'EdB')) {
      Write-Fx ("Assets\" + $n + "\" + $n + ".asmdef") ('{ "name": "' + $n + '", "includePlatforms": [ "Editor" ] }')
      Write-Fx ("Assets\" + $n + "\" + $n + ".cs") "class X {}"
      Write-Fx ($n + ".csproj") (New-Csproj @("Assets\" + $n + "\" + $n + ".cs") @())
    }
    Set-CsprojDefines "Game" $player; Set-CsprojDefines "Sub" $player
    Set-CsprojDefines "EdA" ($editor + $c.Extra); Set-CsprojDefines "EdB" $editor
    $r = Invoke-Rebuild @() 'Assembly-CSharp-Editor'
    if ($c.Hit) { $ok = ($r.code -eq 3 -and $r.out -match 'STALE-DEFINES EdA\.csproj: 残留宏 LEFT' -and $r.out -notmatch '残留宏 (NET_|NETSTANDARD|UNITY_EDITOR_ONLY)') }
    else { $ok = ($r.code -eq 0 -and $r.out -notmatch 'STALE-') }
    Assert-True $ok ("T23 " + $c.N)
  }

  # T24 asmdef 旁的 csc.rsp:只对该 asmdef 生效,替代(不叠加)根目录那份,不向上逐级找(Sub 在 Game 子目录下也不吃它)
  New-Project; Write-Settings "FOO" "FOO"
  Write-Fx "Assets\csc.rsp" "-define:ROOT`r`n"
  Write-Fx "Assets\Game\csc.rsp" "-define:LOCAL`r`n"
  Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;LOCAL"; Set-SubDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;ROOT"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'STALE-') "T24a 本地 rsp 替代根 rsp、子目录 asmdef 不继承 -> 一致"
  Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match 'STALE-DEFINES Game\.csproj: 缺 csc\.rsp 宏 LOCAL\(Assets/Game/csc\.rsp 有\)' -and $r.out -notmatch 'Game\.csproj: 缺 csc\.rsp 宏 ROOT') "T24b 缺本地 rsp 宏 -> 判中,且不要求根 rsp 宏"

  New-Project; Write-Settings "FOO" "FOO"
  Write-Fx "Assets\csc.rsp" "-define:ROOT`r`n"
  New-GitRepo $script:proj
  Write-Fx "Assets\Game\csc.rsp" "-define:LOCAL`r`n"
  G $script:proj "add -A" | Out-Null
  G $script:proj "commit -q -m add-local-rsp" | Out-Null
  Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;ROOT;LOCAL"; Set-SubDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;ROOT"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match 'STALE-DEFINES Game\.csproj: 多出 csc\.rsp 宏 ROOT\(该程序集生效的 Assets/Game/csc\.rsp 里没有' -and $r.out -notmatch 'Sub\.csproj: 多出') "T24c 新加本地 rsp 后仍带根 rsp 宏 -> 判中(Sub 仍吃根 rsp 不报)"

  New-Project; Write-Settings "FOO" "FOO"
  Write-Fx "Assets\mcs.rsp" "-define:OLDSTYLE`r`n"
  Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match 'STALE-DEFINES Game\.csproj: 缺 csc\.rsp 宏 OLDSTYLE\(Assets/mcs\.rsp 有\)') "T24d 无 csc.rsp 时回退旧名 mcs.rsp"
  Write-Fx "Assets\csc.rsp" "-define:FOO`r`n"
  Set-SubDefines "UNITY_EDITOR;UNITY_WEBGL;FOO"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'OLDSTYLE') "T24e 有 csc.rsp 时不再读 mcs.rsp"

  # T25 挪过目录的 asmdef:旧目录下的 csc.rsp 随之删掉,csproj 还带着它的宏;历史 rsp 路径集走运行态缓存
  New-Project; Write-Settings "FOO" "FOO"
  Write-Fx "Assets\OldGame\csc.rsp" "-define:MOVED`r`n"
  New-GitRepo $script:proj
  [System.IO.File]::Delete((Join-Path $script:proj "Assets\OldGame\csc.rsp"))
  G $script:proj "add -A" | Out-Null
  G $script:proj "commit -q -m move-asmdef" | Out-Null
  Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;MOVED"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match 'STALE-DEFINES Game\.csproj: 多出 csc\.rsp 宏 MOVED') "T25a 旧目录 rsp 的宏残留 -> 判中"
  $cacheFile = Join-Path $env:LOCALAPPDATA "claude-wf-3b\csproj-rsp-paths.json"
  Assert-True ((Test-Path $cacheFile) -and ([System.IO.File]::ReadAllText($cacheFile) -match 'Assets/OldGame/csc\.rsp')) "T25b 历史 rsp 路径集写进运行态缓存"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match '多出 csc\.rsp 宏 MOVED') "T25c 走缓存复跑照判"

  Write-Fx "Assets\Other\csc.rsp" "-define:NEWER`r`n"
  G $script:proj "add -A" | Out-Null; G $script:proj "commit -q -m add-other" | Out-Null
  [System.IO.File]::Delete((Join-Path $script:proj "Assets\Other\csc.rsp"))
  G $script:proj "add -A" | Out-Null; G $script:proj "commit -q -m drop-other" | Out-Null
  Set-GameDefines "UNITY_EDITOR;UNITY_WEBGL;FOO;MOVED;NEWER"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match '多出 csc\.rsp 宏 MOVED' -and $r.out -match '多出 csc\.rsp 宏 NEWER') "T25d 增量扫到缓存之后的新提交"

  $common = (@(G $script:proj "rev-parse --path-format=absolute --git-common-dir"))[0]
  [System.IO.File]::WriteAllText($cacheFile, ('{ "' + $common.Replace('\', '\\') + '": { "heads": [ "0000000000000000000000000000000000000001" ], "paths": [ ] } }'), $utf8)
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match '多出 csc\.rsp 宏 MOVED' -and $r.out -match '多出 csc\.rsp 宏 NEWER') "T25e 缓存记的 HEAD 已不存在 -> 退回全量照判"
  [System.IO.File]::WriteAllText($cacheFile, "{ not json", $utf8)
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 3 -and $r.out -match '多出 csc\.rsp 宏 MOVED') "T25f 缓存损坏 -> 退回全量照判"

  # ---- 工程内嵌包:Game 引 Pkg(Packages\MyPkg,有 package.json);Pkg 引 Assets 下的 Deep(Game 自己不引)----
  # 不该算进 Pkg 的:忽略目录、更深 asmdef(Inner)的子树、包内别的 asmdef(PkgEd)、不落 asmdef 的 .cs;
  # NotPkg 没有 package.json 不是包,Game.csproj 引着 Fake 也不进判定面(Fake.csproj 不存在亦不判 INFRA)。
  function New-PackageProject {
    New-Project
    Write-Fx "Packages\MyPkg\package.json" '{ "name": "com.x.mypkg", "version": "1.0.0" }'
    Write-Fx "Packages\MyPkg\Runtime\Pkg.asmdef" '{ "name": "Pkg", "references": [ "Deep" ] }'
    Write-Fx "Packages\MyPkg\Runtime\P.cs" "class P {}"
    Write-Fx "Packages\MyPkg\Runtime\Q.cs" "class Q {}"
    Write-Fx "Packages\MyPkg\Runtime\Samples~\Ig.cs" "class Ig {}"
    Write-Fx "Packages\MyPkg\Runtime\Inner\Inner.asmdef" '{ "name": "Inner" }'
    Write-Fx "Packages\MyPkg\Runtime\Inner\N.cs" "class N {}"
    Write-Fx "Packages\MyPkg\Editor\PkgEd.asmdef" '{ "name": "PkgEd" }'
    Write-Fx "Packages\MyPkg\Editor\PE.cs" "class PE {}"
    Write-Fx "Packages\MyPkg\Loose\NoAsm.cs" "class NoAsm {}"
    Write-Fx "Packages\NotPkg\Fake.asmdef" '{ "name": "Fake" }'
    Write-Fx "Packages\NotPkg\F.cs" "class F {}"
    Write-Fx "Assets\Deep\Deep.asmdef" '{ "name": "Deep" }'
    Write-Fx "Assets\Deep\D.cs" "class D {}"
    Write-Fx "Game.csproj" (New-Csproj @('Assets\Game\A.cs', 'Assets\Game\B.cs') @('Sub', 'Pkg', 'Fake'))
    Write-Fx "Pkg.csproj" (New-Csproj @('Packages\MyPkg\Runtime\P.cs', 'Packages\MyPkg\Runtime\Q.cs') @('Deep'))
    Write-Fx "Deep.csproj" (New-Csproj @('Assets\Deep\D.cs') @())
  }

  # T26a 一致 -> FRESH;判定面含内嵌包的 Pkg,并穿过它取到 Deep
  New-PackageProject
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: FRESH \| Game,Sub,Pkg,Deep\s*$') ("T26a 内嵌包程序集进判定面、闭包穿过它往下取;无 package.json 的目录不算包:" + ($r.out -split "`n")[-1])

  # T26b 缺列:包内 asmdef 目录多一个 .cs 而 csproj 未列(2026-10-05 槽位 dev3 实发形态)
  New-PackageProject
  Write-Fx "Packages\MyPkg\Runtime\Ops\New.cs" "class New {}"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 1 -and $r.out -match '缺列.*Packages/MyPkg/Runtime/Ops/New\.cs' -and $r.out -match 'VERDICT: STALE \| Pkg \|') "T26b 包内缺列 -> STALE exit 1 点名文件与 Pkg"

  # T26c 多列:csproj 列着包内已删的文件
  New-PackageProject
  [System.IO.File]::Delete((Join-Path $script:proj "Packages\MyPkg\Runtime\Q.cs"))
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 1 -and $r.out -match '多列.*Packages/MyPkg/Runtime/Q\.cs' -and $r.out -match 'VERDICT: STALE \| Pkg \|') "T26c 包内多列 -> STALE exit 1 点名文件与 Pkg"

  # T26d -InPlace 修两向,只动 Pkg.csproj 的 Compile 列表,复判 FRESH
  New-PackageProject
  Write-Fx "Packages\MyPkg\Runtime\Ops\New.cs" "class New {}"
  [System.IO.File]::Delete((Join-Path $script:proj "Packages\MyPkg\Runtime\Q.cs"))
  $gameBefore = [System.IO.File]::ReadAllText((Join-Path $script:proj "Game.csproj"))
  $r = Invoke-Rebuild @('-InPlace')
  $txt = [System.IO.File]::ReadAllText((Join-Path $script:proj "Pkg.csproj"))
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: FIXED \| Pkg\s*$') "T26d -InPlace -> FIXED 只点名 Pkg"
  Assert-True ($txt -match 'Packages\\MyPkg\\Runtime\\Ops\\New\.cs' -and $txt -match 'Runtime\\P\.cs' -and $txt -notmatch 'Runtime\\Q\.cs' -and $txt -notmatch 'Inner|Samples~|Loose|PE\.cs' -and $txt -match 'KEEP_ME' -and $txt -match 'ProjectReference Include="Deep\.csproj"') "T26e 重写按包内实扫:反斜杠路径、补新删旧、不收别的子树,非 Compile 行保留"
  Assert-True ($gameBefore -eq [System.IO.File]::ReadAllText((Join-Path $script:proj "Game.csproj"))) "T26f 没过期的 Game.csproj 不动"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: FRESH') "T26g 修复后复判 FRESH"

  # T26h 只经内嵌包才引到的 Assets 程序集过期 -> 判中(闭包穿过包)
  New-PackageProject
  Write-Fx "Assets\Deep\D2.cs" "class D2 {}"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 1 -and $r.out -match 'VERDICT: STALE \| Deep \|') "T26h 经内嵌包引到的 Deep 过期 -> STALE 点名 Deep"

  # T26i 内嵌包只比对 Compile:它自己的引用集 / 宏不判,别人指向包内 asmdef 的引用也不判
  New-PackageProject; Write-Settings "FOO;BAR" "FOO"
  Write-Fx "Assets\Extra\Extra.asmdef" '{ "name": "Extra" }'
  Write-Fx "Packages\MyPkg\Runtime\Pkg.asmdef" '{ "name": "Pkg", "references": [ "Deep", "Extra" ], "versionDefines": [ { "name": "Unity", "expression": "", "define": "PKG_VD" } ] }'
  Write-Fx "Assets\Game\Game.asmdef" '{ "name": "Game", "references": [ "Sub", "Pkg", "PkgEd" ] }'
  Set-CsprojDefines "Pkg" "UNITY_EDITOR;UNITY_WEBGL;FOO"
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'STALE-') "T26i 包内程序集的引用集 / 全局宏 / 版本宏、指向包内 asmdef 的引用 -> 不判"

  # T26j 内嵌包的程序集名可作 -Assembly 起点
  New-PackageProject
  Write-Fx "Packages\MyPkg\Runtime\Ops\New.cs" "class New {}"
  $r = Invoke-Rebuild @() 'Pkg'
  Assert-True ($r.code -eq 1 -and $r.out -match 'VERDICT: STALE \| Pkg \|') "T26j 以内嵌包程序集为起点 -> 照判"

  # T26k Assets 与内嵌包里同名 asmdef -> INFRA(Unity 自己也会报重名)
  New-PackageProject
  Write-Fx "Assets\Dup\Dup.asmdef" '{ "name": "Pkg" }'
  $r = Invoke-Rebuild @()
  Assert-True ($r.code -eq 2 -and $r.out -match 'VERDICT: INFRA.*name=Pkg 的 asmdef 有 2 个') "T26k 两处同名 asmdef -> INFRA exit 2"
}
finally {
  $env:LOCALAPPDATA = $oldLad
  Remove-Fixture
}

Write-Host ""
Exit-TestSuite
