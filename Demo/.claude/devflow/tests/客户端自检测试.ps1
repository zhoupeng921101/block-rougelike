# 客户端自检测试.ps1 — 自检编排层 + Editor程序集编译.ps1 出口分类的 CLI 契约测试(黑盒断言)。
# 覆盖 客户端自检.ps1 的扫描编排;服务端自检.ps1 的构建前置扫描编排与之同构,同套件一并覆盖。
# 背景:子道抛未捕获异常时冒泡成 exit 1 且不打自检自己的 VERDICT、不写遥测,槽位交付取最后一行 VERDICT
#   会把前一道的输出当结论;子道返回 0/1/2 以外的码被当通过;Editor程序集编译 把文件锁 / restore 失败判 FAIL。
# 夹具:
#   - 编排层:经测试注入点 DEVFLOW_TEST_GATE_SCAN_DIR 把各道换成假子道(文件名取自被测脚本的扫描数组,
#     客户端的读取面互核照常通过);假子道各自落一个以序号命名的标记文件,借此断言哪些道跑过。
#     标记各落各的、不共用一份追加日志:客户端的编译道在子进程里与静态各道并行,共写一个文件会撞共享冲突。
#     客户端 = 假仓(git)+ 假 Demo;服务端 = 假 FantasyRoot(空 Server.sln)。
#   - 构建出口分类(Editor程序集编译 / 服务端自检构建阶段):PATH 最前放假 dotnet.cmd(回放指定输出与
#     退出码),不真编译;服务端另锚凭据出口(PASS 签票 / 树中途变判 STALE 且出口码与 FAIL 分开);前者另搭最小多程序集工程(引用图含传递引用、工程内嵌包里的程序集与仓外包的
#     比对面外程序集)。
#   - gate-run 遥测(两端共用构造 = hook函数库 Write-GateRunTelemetry):scanms 只记跑到的道、fails 记全判违规的道
#     (含已跑完的并行道,结论不变)、STALE 的 DRIFT 行与 driftPaths、服务端 scanSecs / buildSecs 与 INFRA 出口的实耗;
#     服务端首哈希先于前置扫描(S11:扫描期间改树判 STALE)。
# 写落隔离 LOCALAPPDATA(%TEMP% 下),不触真 claude-wf-3b。
# 跑法:客户端自检测试.ps1 [-Target <客户端自检>] [-ServerTarget <服务端自检>] [-BuildTarget <Editor程序集编译>]
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = "",
  [string]$ServerTarget = "",
  [string]$BuildTarget = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "客户端自检.ps1" }
if (-not $ServerTarget) { $ServerTarget = Join-Path $dfDir "服务端自检.ps1" }
if (-not $BuildTarget) { $BuildTarget = Join-Path $dfDir "Editor程序集编译.ps1" }
foreach ($t in @($Target, $BuildTarget)) { if (-not (Test-Path $t)) { Write-Host "INFRA: target not found: $t"; exit 2 } }
# 服务端自检 只在有服务端通道的工程里存在;没有时服务端编排各例(S / SP 段)整段跳过。
$hasServerGate = Test-Path $ServerTarget
# 工具宏那一遍(E24~E26)只在 Editor程序集编译 的 $ToolDefines 非空时有东西可测。
$toolDefinesSrc = [regex]::Match([System.IO.File]::ReadAllText($BuildTarget), '(?m)^\$ToolDefines\s*=\s*@\(([^)]*)\)').Groups[1].Value
$hasToolDefines = [bool]($toolDefinesSrc.Trim())

# 扫描数组的文件名从被测脚本读,不在测试里抄一份(抄的那份会随加道漂移)。
function Get-ScanFiles([string]$Script) {
  return @([regex]::Matches([System.IO.File]::ReadAllText($Script), 'File\s*=\s*"([^"]+\.ps1)"') |
           ForEach-Object { $_.Groups[1].Value })
}
$clientScans = Get-ScanFiles $Target
$serverScans = if ($hasServerGate) { Get-ScanFiles $ServerTarget } else { @() }
# 客户端的并行道(扫描数组里带 Async 的道)开跑即起,别的道中途出局时它们照样跑完,断言「哪些道跑过」时恒在其中。
# $clientAsync = 编译道的序号;$clientAsyncAll = 全部并行道的序号(从被测脚本读,不抄)。
$clientAsync = [Array]::IndexOf($clientScans, (Split-Path $BuildTarget -Leaf))
$clientAsyncAll = @()
$clientTags = @()
$scanEntryIdx = 0
foreach ($m in [regex]::Matches([System.IO.File]::ReadAllText($Target), '(?m)^.*File\s*=\s*"[^"]+\.ps1".*$')) {
  if ($m.Value -match 'Async\s*=\s*\$true') { $clientAsyncAll += $scanEntryIdx }
  $clientTags += [regex]::Match($m.Value, 'Tag\s*=\s*"([^"]+)"').Groups[1].Value
  $scanEntryIdx++
}
# 「在本进程跑到了 $Sync 这几道」时应见到的标记全集(并上全部并行道),升序拼成与 Get-RanScans 同形的串。
function Join-Ran([int[]]$Sync) { return (@(@($Sync) + @($clientAsyncAll) | Sort-Object -Unique) -join ",") }
# 服务端前置扫描同理:并行道序号与各道 Tag 从被测脚本读。
$serverAsyncAll = @()
$serverTags = @()
foreach ($m in $(if ($hasServerGate) { [regex]::Matches([System.IO.File]::ReadAllText($ServerTarget), '(?m)^.*File\s*=\s*"[^"]+\.ps1".*$') } else { @() })) {
  if ($m.Value -match 'Async\s*=\s*\$true') { $serverAsyncAll += $serverTags.Count }
  $serverTags += [regex]::Match($m.Value, 'Tag\s*=\s*"([^"]+)"').Groups[1].Value
}
function Join-RanS([int[]]$Sync) { return (@(@($Sync) + @($serverAsyncAll) | Sort-Object -Unique) -join ",") }

$script:fx = $null
function New-FxRoot([string]$Kind) {
  $script:fx = Join-Path $env:TEMP ("flowtest-" + $Kind + "-" + [Guid]::NewGuid().ToString("N"))
  $env:LOCALAPPDATA = Join-Path $script:fx "AppData"
}
function Write-FakeScans([string[]]$Files, [string]$ParamName, [hashtable]$Bodies) {
  # $Bodies:扫描序号(0 起)-> 假子道脚本体;未列的道 = exit 0。
  $scanDir = Join-Path $script:fx "scans"
  $script:scanLog = Join-Path $script:fx "ran"
  New-Item -ItemType Directory -Force -Path $script:scanLog | Out-Null
  for ($i = 0; $i -lt $Files.Count; $i++) {
    $body = if ($Bodies.ContainsKey($i)) { $Bodies[$i] } else { "exit 0" }
    # 假子道同样带准入登记行(编排层启动时逐道核,缺即 INFRA;判据另由 C-adm 例锚定)。
    Write-Src (Join-Path $scanDir $Files[$i]) ("# 准入: Since=2026-01-01 | Basis=存量 | Origin=fake0001 夹具 | Retire=夹具`r`n" +
      "param([string]`$" + $ParamName + ")`r`n" +
      "[System.IO.File]::WriteAllText('" + $script:scanLog + "\" + $i + "', '')`r`n" + $body + "`r`n")
  }
  $env:DEVFLOW_TEST_GATE_SCAN_DIR = $scanDir
}
function New-ClientFixture([hashtable]$Bodies) {
  New-FxRoot "cgate"
  $repo = Join-Path $script:fx "repo"
  New-GitRepo $repo
  Write-F $repo "Demo/ProjectSettings/ProjectVersion.txt" "m_EditorVersion: 2022.3.0f1`n"
  G $repo "add -A" | Out-Null
  G $repo "commit -q -m fx" | Out-Null
  Write-FakeScans $clientScans "ProjectDir" $Bodies
  return (Join-Path $repo "Demo")
}
function New-ServerFixture([hashtable]$Bodies) {
  New-FxRoot "sgate"
  $root = Join-Path $script:fx "Fantasy"
  Write-F $root "examples/Server/Server.sln" ""
  Write-FakeScans $serverScans "FantasyRoot" $Bodies
  return $root
}
function Invoke-Cli([string]$Script, [string]$ArgName, [string]$ArgVal) {
  $ErrorActionPreference = 'Continue'   # 被测脚本写 stderr 时,2>&1 在 Stop 下会让测试进程自己抛出
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Script $ArgName $ArgVal 2>&1 | ForEach-Object { [string]$_ })
  $v = @($lines | Where-Object { $_ -match '^VERDICT' })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n"); last = $(if ($v.Count) { $v[-1] } else { "" }) }
}
function Get-RanScans {
  # 跑过的道的序号,升序。
  if (-not (Test-Path $script:scanLog)) { return @() }
  return @(Get-ChildItem -LiteralPath $script:scanLog -File | ForEach-Object { [int]$_.Name } | Sort-Object)
}
function Get-LastGateTelemetry([string]$Gate) {
  $dir = Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry"
  $rows = @(Get-ChildItem $dir -Filter "wf-*.jsonl" -EA SilentlyContinue | ForEach-Object { [System.IO.File]::ReadAllLines($_.FullName) } |
            Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json } | Where-Object { $_.gate -eq $Gate })
  if ($rows.Count -eq 0) { return $null }
  return $rows[-1]
}

# ---- Editor程序集编译 夹具:csproj 与磁盘一致;假 dotnet 回放输出 ----
# 引用图照本仓形态:Editor 直引 GameLogic / Launcher / Pkg / Ext,GameLogic 再引 GameConfig / FantasyNetwork
# (后两者只经传递闭包可达),Launcher 也引 Pkg。Pkg = 工程内嵌包(Packages\MyPkg,有 package.json)里的
# 程序集,在比对面内;Ext = 落仓外的 file: 包(照 Fantasy.Unity:csproj 按仓外绝对路径列源,Assets 与内嵌包下
# 都无同名 asmdef)= 比对面外。
function Write-FxCsproj([string]$Proj, [string]$Name, [string[]]$Compile, [string[]]$Refs) {
  $body = "<Project>`r`n  <ItemGroup>`r`n"
  foreach ($c in $Compile) { $body += "    <Compile Include=`"" + $c + "`" />`r`n" }
  $body += "  </ItemGroup>`r`n  <ItemGroup>`r`n"
  foreach ($r in $Refs) { $body += "    <ProjectReference Include=`"" + $r + ".csproj`" />`r`n" }
  $body += "  </ItemGroup>`r`n</Project>`r`n"
  Write-F $Proj ($Name + ".csproj") $body
}
function New-BuildFixture([string]$FakeOut, [int]$FakeRc) {
  New-FxRoot "edbuild"
  $proj = Join-Path $script:fx "Demo"
  Write-F $proj "Assets/Editor/E.cs" "class E {}"
  Write-FxCsproj $proj "Assembly-CSharp-Editor" @("Assets\Editor\E.cs") @("GameLogic", "Launcher", "Pkg", "Ext")
  $refs = @{ GameLogic = @("GameConfig", "FantasyNetwork"); GameConfig = @(); FantasyNetwork = @(); Launcher = @("Pkg") }
  foreach ($n in @("GameLogic", "GameConfig", "FantasyNetwork", "Launcher")) {
    Write-F $proj ("Assets/" + $n + "/" + $n + ".asmdef") ('{ "name": "' + $n + '" }')
    Write-F $proj ("Assets/" + $n + "/" + $n + "Src.cs") ("class " + $n + "Src {}")
    Write-FxCsproj $proj $n @("Assets\" + $n + "\" + $n + "Src.cs") $refs[$n]
  }
  Write-F $proj "Packages/MyPkg/package.json" '{ "name": "com.x.mypkg", "version": "1.0.0" }'
  Write-F $proj "Packages/MyPkg/Runtime/Pkg.asmdef" '{ "name": "Pkg" }'
  Write-F $proj "Packages/MyPkg/Runtime/P.cs" "class P {}"
  Write-FxCsproj $proj "Pkg" @("Packages\MyPkg\Runtime\P.cs") @()
  Write-FxCsproj $proj "Ext" @("C:\ext\Fantasy.Unity\Runtime\X.cs") @()
  # 出包平台 define 那一遍的备料:平台清单 + 各平台组全局宏(缺即 INFRA)。
  Write-F $proj "ProjectSettings/PlatformDefinePolicy.json" '{ "coveredPlatforms": [ "Android", "WebGL" ], "rules": [] }'
  Write-F $proj "ProjectSettings/ProjectSettings.asset" "PlayerSettings:`r`n  scriptingDefineSymbols:`r`n    Android: FOO`r`n    WebGL: FOO;FANTASY_WEBGL`r`n  additionalCompilerArguments: {}`r`n"
  Set-FakeDotnet $FakeOut $FakeRc
  return $proj
}
# 假 dotnet 按命令行分流:参数含 <平台>\swap.props 的那次回放 $PdOut / $PdRc(出包平台那一遍),其余回放 out.txt 并 exit 0。
# findstr 里反斜杠是转义符,字面反斜杠须写成 \\ 并加 /l。
function Set-FakeDotnetPd([string]$Platform, [string]$PdOut, [int]$PdRc) {
  $bin = Join-Path $script:fx "fakebin"
  Write-F $bin "out.txt" ""
  Write-F $bin "pd.txt" $PdOut
  Write-F $bin "dotnet.cmd" ("@echo off`r`necho %* | findstr /l /c:`"" + $Platform + "\\swap.props`" >nul && (type `"%~dp0pd.txt`" & exit /b " + $PdRc + ")`r`ntype `"%~dp0out.txt`"`r`nexit /b 0`r`n")
  $env:PATH = $bin + ";" + $script:origPath
}
# PATH 最前放假 dotnet.cmd:任何 dotnet 调用都回放 $FakeOut 并以 $FakeRc 退出(服务端自检的
# build-server shutdown 同样命中,其输出被丢弃,不影响断言)。$Pre = 回放前先执行的 cmd 行(取证用)。
function Set-FakeDotnet([string]$FakeOut, [int]$FakeRc, [string]$Pre = "") {
  $bin = Join-Path $script:fx "fakebin"
  Write-F $bin "out.txt" $FakeOut
  Write-F $bin "dotnet.cmd" ("@echo off`r`n" + $Pre + "type `"%~dp0out.txt`"`r`nexit /b " + $FakeRc + "`r`n")
  $env:PATH = $bin + ";" + $script:origPath
}

$oldLad = $env:LOCALAPPDATA
$script:origPath = $env:PATH
$oldScanDir = $env:DEVFLOW_TEST_GATE_SCAN_DIR
$lockedMsg = "The process cannot access the file x.prefab because it is being used by another process."
Write-Host "== 自检编排 + Editor程序集编译 出口分类 CLI 测试 (客户端 $($clientScans.Count) 道 / 服务端前置 $($serverScans.Count) 道) =="
try {
  Assert-True ($clientScans.Count -ge 2 -and (-not $hasServerGate -or $serverScans.Count -ge 2)) "C0 从被测脚本读到扫描数组"
  Assert-True ($clientAsync -eq $clientScans.Count - 1) "C0b 编译道在客户端扫描数组末位(结论优先级最后)"
  Assert-True ($scanEntryIdx -eq $clientScans.Count -and ($clientAsyncAll -contains $clientAsync) -and $clientAsyncAll.Count -ge 2 -and ($clientAsyncAll -notcontains 0) -and ($clientAsyncAll -notcontains 1) -and ($clientAsyncAll -notcontains 2)) ("C0c 读到并行道序号(含编译道;头三道在本进程跑,下面各例借它们造出局):" + ($clientAsyncAll -join ","))

  # ==== 客户端自检 ====
  # ---- C1 全过 -> PASS、签票、遥测 PASS ----
  $pd = New-ClientFixture @{}
  # 经 槽位交付 调用时环境里有交付关联号(FLOW_DELIVER_RUN),gate-run 行带上它;本例模拟那个环境。
  $env:FLOW_DELIVER_RUN = "gaterun0001"
  try { $r = Invoke-Cli $Target "-ProjectDir" $pd } finally { Remove-Item Env:\FLOW_DELIVER_RUN -ErrorAction SilentlyContinue }
  $tel = Get-LastGateTelemetry "客户端自检"
  Assert-True ($r.code -eq 0 -and $r.last -match '^VERDICT : PASS') "C1 假子道全过 -> exit 0,末行 VERDICT PASS"
  Assert-True ($tel -and $tel.run -eq "gaterun0001") "C1e 环境里有交付关联号时 gate-run 带 run(与 槽位交付 的 entry-verdict 对上)"
  Assert-True ((Get-RanScans).Count -eq $clientScans.Count) "C1b 各道都跑到"
  Assert-True ($tel -and $tel.verdict -eq "PASS") "C1c 遥测 verdict=PASS"
  $c1Ms = if ($tel -and $tel.scanms) { @($tel.scanms.PSObject.Properties | ForEach-Object { $_.Name }) } else { @() }
  Assert-True (($c1Ms -join ",") -eq ($clientTags -join ",") -and -not $tel.PSObject.Properties["fails"]) ("C1d 遥测 scanms 按数组顺序记全部各道毫秒,全过时无 fails:" + ($c1Ms -join ","))
  Remove-Fixture

  # ---- A 准入登记(判据正本 = hook函数库 Get-GateAdmissionGap) ----
  # A1 现役各道的真脚本登记齐全且合判据(两端并集;同一道挂两端时登记只在该道一处)
  $admBad = @()
  foreach ($f in @($clientScans + $serverScans | Select-Object -Unique)) {
    $g = Get-GateAdmissionGap (Join-Path $dfDir $f)
    if ($g.Count -gt 0) { $admBad += ($f + ":" + ($g -join ";")) }
  }
  Assert-True ($admBad.Count -eq 0) ("A1 现役各道准入登记齐全且合判据" + $(if ($admBad.Count) { ":" + ($admBad -join " / ") } else { "" }))
  # A2 判据:新道次(登记日 >= cutover)不可用 存量;复发要两处证据;实测根因 / 用户裁定要一处;缺字段 / 无登记行即缺口
  $admDir = Join-Path $env:TEMP ("flowtest-adm-" + [Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $admDir | Out-Null
  $cut = $script:GateAdmissionCutover
  $admCases = @(
    @{ L = "# 准入: Since=2026-01-01 | Basis=存量 | Origin=abc1234 旧道 | Retire=x"; Ok = $true;  N = "登记前的存量道" },
    @{ L = ("# 准入: Since=" + $cut + " | Basis=存量 | Origin=abc1234 | Retire=x"); Ok = $false; N = "新道次用存量" },
    @{ L = ("# 准入: Since=" + $cut + " | Basis=复发 | Origin=abc1234 一次 | Retire=x"); Ok = $false; N = "复发只一处证据" },
    @{ L = ("# 准入: Since=" + $cut + " | Basis=复发 | Origin=abc1234 与 2026-09-20 两次 | Retire=x"); Ok = $true; N = "复发两处证据" },
    @{ L = ("# 准入: Since=" + $cut + " | Basis=实测根因 | Origin=成因推断未复现 | Retire=x"); Ok = $false; N = "实测根因无证据" },
    @{ L = ("# 准入: Since=" + $cut + " | Basis=用户裁定 | Origin=2026-09-24 裁定 | Retire=x"); Ok = $true; N = "用户裁定带日期" },
    @{ L = "# 准入: Since=2026-01-01 | Basis=存量 | Origin=abc1234"; Ok = $false; N = "缺 Retire" },
    @{ L = "# 准入: Since=2026-01-01 | Basis=存量 | Origin=abc1234 | Retire=x | Reviewed=2026-02-01"; Ok = $true; N = "带复核日(可选字段)" },
    @{ L = "# 准入: Since=2026-01-01 | Basis=存量 | Origin=abc1234 | Retire=x | Reviewed=10-08"; Ok = $false; N = "复核日不是 yyyy-MM-dd" },
    @{ L = "# 准入: Since=2026-01-01 | Basis=存量 | Origin=abc1234 | Retire=x | Reviewed="; Ok = $false; N = "复核日为空" },
    @{ L = "# 准入: Since=2026-01-01 | Basis=存量 | Origin=abc1234 | Retire=x | Reviewed=2025-12-31"; Ok = $false; N = "复核日早于登记日" },
    @{ L = "# 说明:没有登记行"; Ok = $false; N = "无登记行" })
  $i = 0
  foreach ($c in $admCases) {
    $p = Join-Path $admDir ("s" + $i + ".ps1"); $i++
    [System.IO.File]::WriteAllText($p, ($c.L + "`nexit 0`n"), (New-Object System.Text.UTF8Encoding($true)))
    $g = Get-GateAdmissionGap $p
    Assert-True (($g.Count -eq 0) -eq $c.Ok) ("A2 " + $c.N + " -> " + $(if ($c.Ok) { "合判据" } else { "缺口" }) + $(if ($g.Count) { "(" + ($g -join ";") + ")" } else { "" }))
  }
  [System.IO.Directory]::Delete($admDir, $true)
  # A3 编排:某道登记不合判据 -> 该道不跑、整道自检 INFRA 点名该道
  $pd = New-ClientFixture @{}
  $badScan = Join-Path (Join-Path $script:fx "scans") $clientScans[1]
  Write-Src $badScan ("# 准入: Since=" + $cut + " | Basis=存量 | Origin=x | Retire=x`r`nparam([string]`$ProjectDir)`r`n[System.IO.File]::WriteAllText('" + $script:scanLog + "\1', '')`r`nexit 0`r`n")
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.last -match '^VERDICT : INFRA' -and $r.last -match '准入登记' -and $r.last -match [regex]::Escape($clientScans[1])) ("A3 登记不合判据 -> INFRA 点名该道:" + $r.last)
  Assert-True ((Get-RanScans).Count -eq 0) "A3b 各道开跑前先核登记:一道都不跑(含并行的编译道)"
  Remove-Fixture

  # ---- C2 第 3 道抛 IOException(实发形态:文件被锁 ReadAllText 抛);前一道自己打过 VERDICT PASS ----
  $pd = New-ClientFixture @{
    1 = 'Write-Host "VERDICT : PASS   (sub-scan own line)"; exit 0'
    2 = ('throw (New-Object System.IO.IOException "' + $lockedMsg + '")') }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  $tel = Get-LastGateTelemetry "客户端自检"
  Assert-True ($r.code -eq 2) "C2 子道抛异常 -> exit 2 INFRA(不是冒泡成 1)"
  Assert-True ($r.last -match '^VERDICT : INFRA' -and $r.last -match [regex]::Escape($clientScans[2]) -and $r.last -match 'IOException') "C2b 末行是自检自己的 INFRA,点名该道与异常类型"
  Assert-True ((@(Get-RanScans) -join ",") -eq (Join-Ran @(0, 1, 2))) "C2c INFRA 后本进程里后续的道不再跑(并行道已起,照样跑完)"
  Assert-True ($tel -and $tel.verdict -match '^INFRA-') "C2d 异常出口也写遥测"
  Remove-Fixture

  # ---- C3 子道返回未知退出码 5 ----
  $pd = New-ClientFixture @{ 0 = 'exit 5' }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  $tel = Get-LastGateTelemetry "客户端自检"
  Assert-True ($r.code -eq 2 -and $r.last -match '^VERDICT : INFRA' -and $r.last -match 'exit code 5') "C3 未知退出码 5 -> INFRA exit 2,不按通过处理"
  Assert-True ((@(Get-RanScans) -join ",") -eq (Join-Ran @(0))) "C3b 本进程里后续的道不再跑"
  Assert-True ($tel -and $tel.verdict -match '^INFRA-') "C3c 遥测记 INFRA"
  Remove-Fixture

  # ---- C4 回归:子道判违规 exit 1 -> FAIL ----
  $pd = New-ClientFixture @{ 1 = 'exit 1' }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  $tel = Get-LastGateTelemetry "客户端自检"
  Assert-True ($r.code -eq 1 -and $r.last -match '^VERDICT : FAIL') "C4 子道 exit 1 -> FAIL exit 1"
  Assert-True ($tel -and $tel.verdict -match '^FAIL-') "C4b 遥测 FAIL-<tag>"
  $c4Ms = if ($tel -and $tel.scanms) { @($tel.scanms.PSObject.Properties | ForEach-Object { $_.Name }) } else { @() }
  Assert-True ((@($tel.fails) -join ",") -eq $clientTags[1] -and ($c4Ms -contains $clientTags[0]) -and ($c4Ms -contains $clientTags[1]) -and ($c4Ms -notcontains $clientTags[2])) ("C4c fails = 判违规的那道;scanms 只记跑到的道(出局后的本进程道不记):" + (@($tel.fails) -join ",") + " / " + ($c4Ms -join ","))
  Remove-Fixture

  # ---- C5 回归:子道 exit 2 -> INFRA,且现在也写遥测 ----
  $pd = New-ClientFixture @{ 0 = 'exit 2' }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  $tel = Get-LastGateTelemetry "客户端自检"
  Assert-True ($r.code -eq 2 -and $r.last -match '^VERDICT : INFRA') "C5 子道 exit 2 -> INFRA exit 2"
  Assert-True ($tel -and $tel.verdict -match '^INFRA-') "C5b INFRA 出口写遥测"
  Remove-Fixture

  # ---- C6 各道均过但树在检查期间变了(某道往仓里落一个未跟踪文件)-> STALE exit 3,与 FAIL 的 1 分开 ----
  $pd = New-ClientFixture @{ 1 = "[System.IO.File]::WriteAllText((Join-Path (Split-Path `$ProjectDir -Parent) 'mid-run.txt'), 'x'); exit 0" }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  $tel = Get-LastGateTelemetry "客户端自检"
  Assert-True ($r.code -eq 3 -and $r.last -match '^VERDICT : STALE') ("C6 各道均过但树中途变 -> STALE exit 3(不与 FAIL 的 1 同码):" + $r.code + " " + $r.last)
  Assert-True ((Get-RanScans).Count -eq $clientScans.Count -and -not (Test-Path (Join-Path (Split-Path $pd -Parent) ".gate\ticket.json"))) "C6b 各道都跑到,不签票"
  Assert-True ($tel -and $tel.verdict -eq "STALE") "C6c 遥测 verdict=STALE"
  $c6Lines = @($r.out -split "`n")
  $c6Drift = [Array]::IndexOf($c6Lines, "DRIFT   : A mid-run.txt")
  $c6Stale = [Array]::IndexOf($c6Lines, $r.last)
  Assert-True ($c6Drift -ge 0 -and $c6Stale -gt $c6Drift -and (@($tel.driftPaths) -contains "A mid-run.txt")) ("C6d STALE 点名漂移路径:DRIFT 行在末行 VERDICT 之前,遥测 driftPaths 同列:" + (@($tel.driftPaths) -join ","))
  Remove-Fixture

  # ---- P 并行道(数组里带 Async 的道各起一个子进程;轮到它时收结果,输出回放在它的数组位置)----
  # P1 静态道判违规时编译已在跑:等它跑完才退出(不留还在跑的编译),结论点名静态道,编译道的输出照样回放
  $p1Mark = Join-Path $env:TEMP ("flowtest-p1-done-" + [Guid]::NewGuid().ToString("N") + ".txt")
  $pd = New-ClientFixture @{
    1 = 'Write-Host "STATIC-DETAIL-P1"; exit 1'
    $clientAsync = ("Start-Sleep -Seconds 3; [System.IO.File]::WriteAllText('" + $p1Mark + "', 'x'); Write-Host 'BUILD-DETAIL-P1'; exit 0") }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  $tel = Get-LastGateTelemetry "客户端自检"
  $p1Done = Test-Path $p1Mark
  if ($p1Done) { [System.IO.File]::Delete($p1Mark) }
  Assert-True ($r.code -eq 1 -and $r.last -match '^VERDICT : FAIL' -and $tel.verdict -match '^FAIL-' -and $tel.verdict -ne 'FAIL-editorasmbuild') ("P1 静态道违规 -> FAIL 点名静态道:" + $r.last)
  Assert-True ($p1Done -and (@(Get-RanScans) -join ",") -eq (Join-Ran @(0, 1))) "P1b 退出前编译道已跑完,本进程里后续的道不再跑"
  $p1Static = $r.out.IndexOf('STATIC-DETAIL-P1', [System.StringComparison]::Ordinal)
  $p1Build = $r.out.IndexOf('BUILD-DETAIL-P1', [System.StringComparison]::Ordinal)
  $p1Verdict = $r.out.LastIndexOf('VERDICT : FAIL', [System.StringComparison]::Ordinal)
  Assert-True ($p1Static -ge 0 -and $p1Build -gt $p1Static -and $p1Verdict -gt $p1Build) "P1c 输出次序:静态道明细 -> 编译道回放 -> 自检末行"
  Remove-Fixture

  # P2 静态全过、编译道判违规 -> FAIL 点名编译道;中文输出经管道回放不乱码(假子道文件无 BOM,中文用码点拼,不写字面量)
  $pd = New-ClientFixture @{ $clientAsync = 'Write-Host ([string][char]0x7F16 + [char]0x8BD1 + " CS0103"); Write-Host "VERDICT : FAIL   (sub-scan own line)"; exit 1' }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  $tel = Get-LastGateTelemetry "客户端自检"
  Assert-True ($r.code -eq 1 -and $r.last -match '^VERDICT : FAIL' -and $r.last -match 'slot=' -and $tel.verdict -eq 'FAIL-editorasmbuild') ("P2 编译道违规 -> FAIL-editorasmbuild,末行是自检自己的:" + $r.last)
  Assert-True ($r.out -match '编译 CS0103' -and (Get-RanScans).Count -eq $clientScans.Count) "P2b 编译道输出原样回放(中文不乱码),静态各道都跑到"
  Remove-Fixture

  # P3 编译道抛未捕获异常:子进程里只会变成 exit 1(与违规同码),须仍判 INFRA 并点名异常类型
  $pd = New-ClientFixture @{ $clientAsync = ('throw (New-Object System.IO.IOException "' + $lockedMsg + '")') }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  $tel = Get-LastGateTelemetry "客户端自检"
  Assert-True ($r.code -eq 2 -and $r.last -match '^VERDICT : INFRA' -and $r.last -match [regex]::Escape($clientScans[$clientAsync]) -and $r.last -match 'IOException' -and $tel.verdict -eq 'INFRA-editorasmbuild') ("P3 编译道抛异常 -> INFRA 点名该道与异常类型:" + $r.code + " " + $r.last)
  Assert-True ($r.out -notmatch 'GATE-ASYNC-SCAN-THREW') "P3b 内部标记行不外露"
  Remove-Fixture

  # P4 编译道 exit 2 / 未知退出码 -> INFRA(与静态道同口径)
  $pd = New-ClientFixture @{ $clientAsync = 'exit 2' }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.last -match '^VERDICT : INFRA' -and $r.last -match 'editor assembly build could not run') ("P4 编译道 exit 2 -> INFRA:" + $r.last)
  Remove-Fixture
  $pd = New-ClientFixture @{ $clientAsync = 'exit 5' }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.last -match '^VERDICT : INFRA' -and $r.last -match 'exit code 5') ("P4b 编译道未知退出码 5 -> INFRA:" + $r.last)
  Remove-Fixture

  # P5 静态道与编译道都判违规 -> 结论按数组顺序点名静态道,两边的明细都在输出里
  $pd = New-ClientFixture @{ 2 = 'Write-Host "STATIC-DETAIL-P5"; exit 1'; $clientAsync = 'Write-Host "BUILD-DETAIL-P5"; exit 1' }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  $tel = Get-LastGateTelemetry "客户端自检"
  Assert-True ($r.code -eq 1 -and $tel.verdict -match '^FAIL-' -and $tel.verdict -ne 'FAIL-editorasmbuild' -and $r.out -match 'STATIC-DETAIL-P5' -and $r.out -match 'BUILD-DETAIL-P5') ("P5 两边都违规 -> 点名静态道,两份明细都回显:" + $tel.verdict)
  Assert-True ($tel.verdict -eq ("FAIL-" + $clientTags[2]) -and (@($tel.fails) -join ",") -eq ($clientTags[2] + ",editorasmbuild")) ("P5b 遥测 fails 记全本次判违规的道(含已跑完的并行道),结论仍点名数组里靠前的那道:" + (@($tel.fails) -join ","))
  Remove-Fixture

  # P6 路径含空格与单引号:子进程命令不经命令行转义,编译道拿到原样的 -ProjectDir
  New-FxRoot "cgate"
  $repo = Join-Path $script:fx "re po's"
  New-GitRepo $repo
  Write-F $repo "Demo/ProjectSettings/ProjectVersion.txt" "m_EditorVersion: 2022.3.0f1`n"
  G $repo "add -A" | Out-Null
  G $repo "commit -q -m fx" | Out-Null
  Write-FakeScans $clientScans "ProjectDir" @{ $clientAsync = 'if (-not (Test-Path -LiteralPath (Join-Path $ProjectDir "ProjectSettings\ProjectVersion.txt"))) { exit 1 }; exit 0' }
  $r = Invoke-Cli $Target "-ProjectDir" (Join-Path $repo "Demo")
  Assert-True ($r.code -eq 0 -and $r.last -match '^VERDICT : PASS' -and (Get-RanScans).Count -eq $clientScans.Count) ("P6 工程路径含空格与单引号 -> 编译道照样跑到:" + $r.code + " " + $r.last)
  Remove-Fixture

  # P7 并行的静态道与数组里排在它后面的本进程道都判违规 -> 结论点名数组里靠前的那道(并行道),其后的本进程道不再跑
  $aIdx = @($clientAsyncAll | Where-Object { $_ -ne $clientAsync })[0]
  $syncAfter = @(($aIdx + 1)..($clientScans.Count - 1) | Where-Object { $clientAsyncAll -notcontains $_ })[0]
  $syncBefore = @(0..($aIdx - 1))
  $pd = New-ClientFixture @{ $aIdx = 'Write-Host "ASYNC-STATIC-DETAIL-P7"; exit 1'; $syncAfter = 'exit 1' }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  Assert-True ($r.code -eq 1 -and $r.last -match '^VERDICT : FAIL' -and $r.out -match 'ASYNC-STATIC-DETAIL-P7') ("P7 并行的静态道违规 -> FAIL:" + $r.last)
  Assert-True ((@(Get-RanScans) -join ",") -eq (Join-Ran $syncBefore)) ("P7b 数组里排在它后面的本进程道不再跑(序号 " + $syncAfter + "):" + (@(Get-RanScans) -join ","))
  Remove-Fixture

  # P8 并行道的输出回放在它的数组位置:前一道本进程道 -> 并行道 -> 后一道本进程道
  $pd = New-ClientFixture @{ ($aIdx - 1) = 'Write-Host "OUT-BEFORE-P8"; exit 0'; $aIdx = 'Start-Sleep -Seconds 2; Write-Host "OUT-ASYNC-P8"; exit 0'; $syncAfter = 'Write-Host "OUT-AFTER-P8"; exit 0' }
  $r = Invoke-Cli $Target "-ProjectDir" $pd
  $p8a = $r.out.IndexOf('OUT-BEFORE-P8', [System.StringComparison]::Ordinal)
  $p8b = $r.out.IndexOf('OUT-ASYNC-P8', [System.StringComparison]::Ordinal)
  $p8c = $r.out.IndexOf('OUT-AFTER-P8', [System.StringComparison]::Ordinal)
  Assert-True ($r.code -eq 0 -and $p8a -ge 0 -and $p8b -gt $p8a -and $p8c -gt $p8b) ("P8 输出按数组顺序:" + $p8a + " < " + $p8b + " < " + $p8c)
  Assert-True ((Get-RanScans).Count -eq $clientScans.Count) "P8b 各道都跑到"
  Remove-Fixture

  if ($hasServerGate) {
  # ==== 服务端自检 构建前置扫描(同构编排)====
  Assert-True ($serverTags.Count -eq $serverScans.Count -and $serverAsyncAll.Count -ge 1 -and ($serverAsyncAll -notcontains 0) -and ($serverAsyncAll -notcontains 1)) ("S0 读到服务端并行道序号(头两道在本进程跑,下面各例借它们造出局):" + ($serverAsyncAll -join ","))
  $root = New-ServerFixture @{
    0 = 'Write-Host "VERDICT : PASS   (sub-scan own line)"; exit 0'
    1 = ('throw (New-Object System.IO.IOException "' + $lockedMsg + '")') }
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  Assert-True ($r.code -eq 2) "S1 子道抛异常 -> exit 2 INFRA(不是冒泡成 1)"
  Assert-True ($r.last -match '^VERDICT : INFRA' -and $r.last -match [regex]::Escape($serverScans[1]) -and $r.last -match 'IOException') "S1b 末行是自检自己的 INFRA,点名该道与异常类型"
  Assert-True ((@(Get-RanScans) -join ",") -eq (Join-RanS @(0, 1))) "S1c 终止,本进程里后续的道不再跑(并行道已起,照样跑完)"
  Assert-True ($tel -and $tel.verdict -match '^INFRA-') "S1d 异常出口写遥测"
  Remove-Fixture

  $root = New-ServerFixture @{ 0 = 'exit 5' }
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  Assert-True ($r.code -eq 2 -and $r.last -match '^VERDICT : INFRA' -and $r.last -match 'exit code 5') "S2 未知退出码 5 -> INFRA exit 2,不按通过处理"
  Assert-True ((@(Get-RanScans) -join ",") -eq (Join-RanS @(0))) "S2b 本进程里后续的道不再跑(未走到构建)"
  Assert-True ($tel -and $tel.verdict -match '^INFRA-') "S2c 遥测记 INFRA"
  Remove-Fixture

  $root = New-ServerFixture @{ 1 = 'exit 1' }
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  Assert-True ($r.code -eq 1 -and $r.last -match '^VERDICT : FAIL') "S3 回归:子道 exit 1 -> FAIL exit 1"
  Assert-True ($tel -and $tel.verdict -match '^FAIL-') "S3b 遥测 FAIL-<tag>"
  Assert-True ($tel -and $tel.PSObject.Properties["scanSecs"] -and -not $tel.PSObject.Properties["buildSecs"] -and $tel.scanms) "S3c 扫描期出口:遥测拆出 scanSecs、没走到构建不写 buildSecs,带 scanms"
  Remove-Fixture

  $root = New-ServerFixture @{ 0 = 'exit 2' }
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  Assert-True ($r.code -eq 2 -and $r.last -match '^VERDICT : INFRA') "S4 回归:子道 exit 2 -> INFRA exit 2"
  Assert-True ($tel -and $tel.verdict -match '^INFRA-') "S4b INFRA 出口写遥测"
  Remove-Fixture

  # ---- SP 服务端并行道(起与收和客户端 P 段是同一套共享实现,这里只锚服务端编排接上了它)----
  $sA = $serverAsyncAll[0]
  $sAfter = @(($sA + 1)..($serverScans.Count - 1) | Where-Object { $serverAsyncAll -notcontains $_ })[0]
  # SP1 并行道与数组里排在它后面的本进程道都判违规 -> 结论点名并行道,其后的本进程道不再跑
  $root = New-ServerFixture @{ $sA = 'Write-Host "ASYNC-DETAIL-SP1"; exit 1'; $sAfter = 'exit 1' }
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  Assert-True ($r.code -eq 1 -and $r.last -match '^VERDICT : FAIL' -and $tel.verdict -eq ("FAIL-" + $serverTags[$sA]) -and $r.out -match 'ASYNC-DETAIL-SP1') ("SP1 并行道违规 -> FAIL 点名该道,明细回放:" + $tel.verdict)
  Assert-True ((@(Get-RanScans) -join ",") -eq (Join-RanS @(0..($sA - 1)))) ("SP1b 数组里排在它后面的本进程道不再跑(序号 " + $sAfter + "):" + (@(Get-RanScans) -join ","))
  Remove-Fixture

  # SP2 并行道抛未捕获异常 -> INFRA 点名该道与异常类型,内部标记行不外露
  $root = New-ServerFixture @{ $sA = ('throw (New-Object System.IO.IOException "' + $lockedMsg + '")') }
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  Assert-True ($r.code -eq 2 -and $r.last -match '^VERDICT : INFRA' -and $r.last -match [regex]::Escape($serverScans[$sA]) -and $r.last -match 'IOException' -and $tel.verdict -eq ("INFRA-" + $serverTags[$sA])) ("SP2 并行道抛异常 -> INFRA 点名该道与异常类型:" + $r.code + " " + $r.last)
  Assert-True ($r.out -notmatch 'GATE-ASYNC-SCAN-THREW') "SP2b 内部标记行不外露"
  Remove-Fixture

  # SP3 本进程道判违规时并行道还在跑 -> 等它跑完才退出,结论点名本进程那道
  $sp3Mark = Join-Path $env:TEMP ("flowtest-sp3-done-" + [Guid]::NewGuid().ToString("N") + ".txt")
  $root = New-ServerFixture @{ 0 = 'exit 1'; $sA = ("Start-Sleep -Seconds 2; [System.IO.File]::WriteAllText('" + $sp3Mark + "', 'x'); exit 0") }
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  $sp3Done = Test-Path $sp3Mark
  if ($sp3Done) { [System.IO.File]::Delete($sp3Mark) }
  Assert-True ($r.code -eq 1 -and $tel.verdict -eq ("FAIL-" + $serverTags[0]) -and $sp3Done) ("SP3 本进程道违规 -> 等并行道跑完才退出,点名本进程那道:" + $tel.verdict)
  Assert-True ((@(Get-RanScans) -join ",") -eq (Join-RanS @(0))) "SP3b 本进程里后续的道不再跑"
  Remove-Fixture

  # SP4 本进程道与并行道都判违规 -> 结论与出口照旧点名本进程那道,遥测 fails 把已跑完的并行道一并记上
  $root = New-ServerFixture @{ 0 = 'exit 1'; $sA = 'exit 1' }
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  Assert-True ($r.code -eq 1 -and $r.last -match '^VERDICT : FAIL' -and $tel.verdict -eq ("FAIL-" + $serverTags[0]) -and (@($tel.fails) -join ",") -eq ($serverTags[0] + "," + $serverTags[$sA])) ("SP4 fails 含已跑完的并行道,结论不变:" + $tel.verdict + " / " + (@($tel.fails) -join ","))
  Remove-Fixture

  # ---- 服务端构建阶段:前置扫描全过,假 dotnet 回放构建输出;错误行分类与 Editor程序集编译 同口径 ----
  # 假 dotnet 每次调用先等约 2 秒(ping 本机),构建段的耗时因此可测:INFRA 出口的 secs 曾写死为 0(F9)。
  $root = New-ServerFixture @{}
  Set-FakeDotnet ("C:\x\Server.csproj : error MSB3027: Could not copy `"obj\Fantasy.SourceGenerator.dll`". Exceeded retry count of 10. The file is locked by: `"MSBuild.exe (1234)`"`r`n" +
                  "C:\x\Server.csproj : warning MSB3026: Could not copy `"obj\Fantasy.SourceGenerator.dll`". Beginning retry 1 in 1000ms.`r`n") 1 "ping -n 3 127.0.0.1 >nul`r`n"
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  Assert-True ($r.code -eq 2 -and $r.last -match '^VERDICT : INFRA' -and $r.last -match 'file-lock') "S5 构建错误行全是 MSB3027 -> INFRA exit 2"
  Assert-True ($tel -and $tel.verdict -match '^INFRA-') "S5b 遥测记 INFRA"
  Assert-True ($tel -and $tel.secs -ge 1 -and $tel.buildSecs -ge 1 -and $tel.PSObject.Properties["scanSecs"]) ("S5c 构建期 INFRA 出口的 secs 记构建段实耗(不再写死 0),另拆 scanSecs / buildSecs:secs=" + $tel.secs + " build=" + $tel.buildSecs + " scan=" + $tel.scanSecs)
  Remove-Fixture

  $root = New-ServerFixture @{}
  Set-FakeDotnet "C:\x\Server.csproj : error NU1301: Unable to load the service index for source https://api.nuget.org/v3/index.json.`r`n" 1
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  Assert-True ($r.code -eq 2 -and $r.last -match '^VERDICT : INFRA' -and $r.last -match 'file-lock') "S6 构建错误行全是 NU* -> INFRA exit 2"
  Remove-Fixture

  $root = New-ServerFixture @{}
  Set-FakeDotnet ("C:\x\Foo.cs(1,1): error CS0103: The name 'Foo' does not exist in the current context [C:\x\Server.csproj]`r`n" +
                  "C:\x\Server.csproj : error MSB3027: Could not copy `"obj\Fantasy.SourceGenerator.dll`". Exceeded retry count of 10.`r`n") 1
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  Assert-True ($r.code -eq 1 -and $r.last -match '^VERDICT : FAIL' -and $r.out -match 'CS0103') "S7 真编译错误夹文件锁 -> FAIL exit 1"
  Remove-Fixture

  $root = New-ServerFixture @{}
  Set-FakeDotnet "Build FAILED.`r`n" 1
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  Assert-True ($r.code -eq 1 -and $r.last -match '^VERDICT : FAIL') "S8 非零却认不出错误行 -> 维持 FAIL,不猜成环境问题"
  Remove-Fixture

  # S12 构建走全量重编:增量构建跳过已是最新的工程、不重报其警告(2026-10-26 4b 槽位空跑 PASS,部署点才报 CS8618)。
  # 假 dotnet 把每次调用的参数记到 fakebin(仓外,不动受检的树)。
  $root = New-ServerFixture @{}
  Set-FakeDotnet "Build FAILED.`r`n" 1 "echo %*>>`"%~dp0args.txt`"`r`n"
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $argsFile = Join-Path (Join-Path $script:fx "fakebin") "args.txt"
  $buildCalls = @(if (Test-Path $argsFile) { Get-Content $argsFile | Where-Object { $_ -match '^build\s' } })
  Assert-True ($buildCalls.Count -eq 1 -and $buildCalls[0] -match '(^|\s)--no-incremental(\s|$)') ("S12 构建命令带 --no-incremental:" + ($buildCalls -join " | "))
  Remove-Fixture

  # ---- 服务端凭据出口:PASS = 0 签票;STALE(构建通过、树在检查期间变了)= 3,与 FAIL 的 1 分开 ----
  # 两者曾同为 1:集成交付 部署点分不出「构建有错」与「并发合并改了树」,后者被报成构建失败停机(2026-10-08 两发)。
  # 首尾双哈希要 git 仓,故这两例的假 FantasyRoot 建成仓(上面各例走不到签票,用的是裸目录)。
  $root = New-ServerFixture @{}
  New-GitRepo $root
  Set-FakeDotnet "" 0
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  Assert-True ($r.code -eq 0 -and $r.last -match '^VERDICT : PASS' -and (Test-Path (Join-Path $root ".gate\ticket.json"))) ("S9 构建通过且树未变 -> PASS exit 0 并签票:" + $r.code + " " + $r.last)
  Assert-True ($tel -and $tel.verdict -eq "PASS" -and $tel.ticket -eq $true) "S9b 遥测 verdict=PASS ticket=true"
  $s9Ms = if ($tel -and $tel.scanms) { @($tel.scanms.PSObject.Properties | ForEach-Object { $_.Name }) } else { @() }
  Assert-True (($s9Ms -join ",") -eq ($serverTags -join ",") -and $tel.PSObject.Properties["scanSecs"] -and $tel.PSObject.Properties["buildSecs"] -and -not $tel.PSObject.Properties["fails"]) ("S9c PASS 遥测:七道 scanms 齐、scanSecs / buildSecs 两段都在、无 fails:" + ($s9Ms -join ","))
  Remove-Fixture

  # S11 首哈希取在前置扫描之前(B-1①):扫描道往仓里落文件 = 检查期间树变了 -> STALE exit 3,DRIFT 点名该文件。
  # 修前首哈希取在扫描之后,扫描期间的改动发现不了,照样 PASS 签票(「扫的 = 交付的」对服务端扫描不成立)。
  $root = New-ServerFixture @{ 0 = "[System.IO.File]::WriteAllText((Join-Path `$FantasyRoot 'scan-time.txt'), 'x'); exit 0" }
  New-GitRepo $root
  Set-FakeDotnet "" 0
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  Assert-True ($r.code -eq 3 -and $r.last -match '^VERDICT : STALE' -and -not (Test-Path (Join-Path $root ".gate\ticket.json"))) ("S11 扫描期间改树 -> STALE exit 3、不签票:" + $r.code + " " + $r.last)
  Assert-True ($r.out -match '(?m)^DRIFT   : A scan-time\.txt' -and (@($tel.driftPaths) -contains "A scan-time.txt") -and $tel.verdict -eq "STALE") ("S11b DRIFT 行与遥测 driftPaths 点名扫描期间落的文件:" + (@($tel.driftPaths) -join ","))
  Remove-Fixture

  # 假 dotnet 每次被调都往仓里落一个未跟踪文件(起哈希之后的首次调用即 build-server shutdown)= 检查期间树变了。
  $root = New-ServerFixture @{}
  New-GitRepo $root
  Set-FakeDotnet "" 0 ("echo x> `"" + $root + "\mid-run.txt`"`r`n")
  $r = Invoke-Cli $ServerTarget "-FantasyRoot" $root
  $tel = Get-LastGateTelemetry "服务端自检"
  Assert-True ($r.code -eq 3 -and $r.last -match '^VERDICT : STALE') ("S10 构建通过但树中途变 -> STALE exit 3(不与 FAIL 的 1 同码):" + $r.code + " " + $r.last)
  Assert-True ($r.out -match 'VERDICT : PASS\s+\(\d+s, exit=0, errors=0, warnings=0\)' -and -not (Test-Path (Join-Path $root ".gate\ticket.json"))) "S10b 构建结论照常打印(0 错 0 警),不签票"
  Assert-True ($tel -and $tel.verdict -eq "STALE" -and $tel.ticket -eq $false) "S10c 遥测 verdict=STALE ticket=false"
  Remove-Fixture
  } else { Write-Host "SKIP S0~S11 / SP 服务端自检编排:本工程没有 服务端自检.ps1(服务端通道已移除)" }
  $env:PATH = $script:origPath
  $env:DEVFLOW_TEST_GATE_SCAN_DIR = $oldScanDir

  # ==== Editor程序集编译:构建非零时按错误行分类 ====
  $pd = New-BuildFixture ("C:\x\GameLogic.csproj : error MSB3027: Could not copy `"obj\GameLogic.dll`" to `"Temp\GameLogic.dll`". Exceeded retry count of 10. The file is locked by: `"Unity Editor (1234)`"`r`n" +
                          "C:\x\GameLogic.csproj : warning MSB3026: Could not copy `"obj\GameLogic.dll`". Beginning retry 1 in 1000ms.`r`n") 1
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "E1 MSB3027 文件锁 -> INFRA exit 2"
  Remove-Fixture

  $pd = New-BuildFixture "C:\x\GameLogic.csproj : error NU1301: Unable to load the service index for source https://api.nuget.org/v3/index.json.`r`n" 1
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "E2 restore 失败(NU1301) -> INFRA exit 2"
  Remove-Fixture

  $pd = New-BuildFixture "CSC : error CS2012: Cannot open 'C:\x\Temp\bin\GameLogic.dll' for writing -- The process cannot access the file because it is being used by another process.`r`n" 1
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "E3 CS2012 输出被占 -> INFRA exit 2"
  Remove-Fixture

  $pd = New-BuildFixture ("C:\x\Assets\Editor\E.cs(1,1): error CS0103: The name 'Foo' does not exist in the current context [C:\x\Assembly-CSharp-Editor.csproj]`r`n" +
                          "C:\x\GameLogic.csproj : error MSB3027: Could not copy `"obj\GameLogic.dll`". Exceeded retry count of 10.`r`n") 1
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 1) "E4 真编译错误与文件锁并存 -> 真错误优先,FAIL exit 1"
  Assert-True ($r.out -match '排除 csproj 过期这一假失败来源') "E4b 报错全落在比对面内且 csproj 一致 -> 给排除结论"
  Remove-Fixture

  $pd = New-BuildFixture "C:\x\Assets\Editor\E.cs(1,1): error CS0103: The name 'Foo' does not exist in the current context`r`n" 1
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 1 -and $r.out -match 'CS0103') "E5 回归:纯编译错误 -> FAIL exit 1 并回显"
  Assert-True ($r.out -match '不排除 csproj 过期' -and $r.out -match '1 行报错认不出所属 csproj') "E5b 错误行无 [xxx.csproj] 归属 -> 不给排除结论"
  Remove-Fixture

  $pd = New-BuildFixture "" 0
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 0 -and $r.out -match '0 errors') "E6 回归:构建通过 -> exit 0"
  Remove-Fixture

  # E7 csproj 引用集过期(基线新增 asmdef 被 GameLogic 引用,csproj 未引用):不编,INFRA 点名缺的引用
  $pd = New-BuildFixture "C:\x\Assets\GameLogic\GameLogicSrc.cs(1,1): error CS1061: 'RectTransform' does not contain a definition for 'DOAnchorPos'`r`n" 1
  Write-F $pd "Assets/NewMod/NewMod.asmdef" '{ "name": "NewMod" }'
  Write-F $pd "Assets/GameLogic/GameLogic.asmdef" '{ "name": "GameLogic", "references": [ "NewMod" ] }'
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.out -match '须编辑器重生成' -and $r.out -match 'STALE-REFS.*NewMod' -and $r.out -notmatch 'CS1061') "E7 引用集过期 -> INFRA exit 2 点名缺引用,不跑编译"
  Remove-Fixture

  # E8 宏过期(ProjectSettings WebGL 组新增 BAR,GameLogic.csproj 未生成):不编,INFRA 点名缺的宏
  $pd = New-BuildFixture "C:\x\Assets\GameLogic\GameLogicSrc.cs(1,1): error CS0103: The name 'Bar' does not exist`r`n" 1
  Write-F $pd "ProjectSettings/ProjectSettings.asset" "PlayerSettings:`r`n  scriptingDefineSymbols:`r`n    WebGL: FOO;BAR`r`n  additionalCompilerArguments: {}`r`n"
  Write-F $pd "GameLogic.csproj" "<Project>`r`n  <PropertyGroup><DefineConstants>UNITY_EDITOR;UNITY_WEBGL;FOO</DefineConstants></PropertyGroup>`r`n  <ItemGroup>`r`n    <Compile Include=`"Assets\GameLogic\GameLogicSrc.cs`" />`r`n  </ItemGroup>`r`n</Project>`r`n"
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'STALE-DEFINES.*缺全局宏 BAR' -and $r.out -notmatch 'CS0103') "E8 宏过期 -> INFRA exit 2 点名缺的宏,不跑编译"
  Remove-Fixture

  # ==== Editor程序集编译:比对面 = Editor csproj 的 ProjectReference 闭包里 Assets 或工程内嵌包下有 asmdef 者 ====
  # E9 实发形态(2026-09-27 槽位 2):基线删了 Launcher 下的文件,Launcher.csproj 仍列着 -> 识别过期、按实扫重建再编
  $pd = New-BuildFixture "" 0
  Write-FxCsproj $pd "Launcher" @("Assets\Launcher\LauncherSrc.cs", "Assets\Launcher\Procedure\ProcedurePreload.cs") @("Pkg")
  $cap = Join-Path $script:fx "cap"
  New-Item -ItemType Directory -Force -Path $cap | Out-Null
  Set-FakeDotnet "" 0 ("copy /y `"" + $pd + "\Launcher.gate.csproj`" `"" + $cap + "\Launcher.csproj`" >nul`r`n" +
                       "copy /y `"" + $pd + "\Assembly-CSharp-Editor.gate.csproj`" `"" + $cap + "\Editor.csproj`" >nul`r`n")
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 0 -and $r.out -match 'Launcher\.csproj 过期' -and $r.out -match 'csproj 多列.*ProcedurePreload\.cs') ("E9 Launcher.csproj 多列已删文件 -> 识别过期并照编:" + $r.code)
  $capL = Join-Path $cap "Launcher.csproj"; $capE = Join-Path $cap "Editor.csproj"
  $gl = if (Test-Path $capL) { [System.IO.File]::ReadAllText($capL) } else { "" }
  $ge = if (Test-Path $capE) { [System.IO.File]::ReadAllText($capE) } else { "" }
  Assert-True ($gl -match 'LauncherSrc\.cs' -and $gl -notmatch 'ProcedurePreload' -and $gl -match 'Include="Pkg\.gate\.csproj"') "E9b 编的 Launcher gate 副本按实扫重建 Compile、引用已重定向"
  Assert-True ($ge -match 'Include="Launcher\.gate\.csproj"') "E9c Editor gate 副本引的是 Launcher 的 gate 副本"
  Assert-True (-not (Test-Path (Join-Path $pd "Launcher.gate.csproj"))) "E9d 临时 gate csproj 用完即删"
  # E9e / E9f gate 副本的时间戳:内容不变沿用上次(不然 MSBuild 次次整编),内容变了取新的。copy 保留源文件修改时间。
  $t1 = [System.IO.File]::GetLastWriteTimeUtc($capL)
  Start-Sleep -Milliseconds 300
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 0 -and [System.IO.File]::GetLastWriteTimeUtc($capL) -eq $t1) "E9e 重跑、gate 副本内容不变 -> 时间戳沿用上次"
  Write-F $pd "Assets/Launcher/Added.cs" "class Added {}"
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 0 -and [System.IO.File]::GetLastWriteTimeUtc($capL) -gt $t1) "E9f gate 副本内容变了 -> 取新时间戳"
  Remove-Fixture

  # E10只经传递闭包可达的 GameConfig(Editor -> GameLogic -> GameConfig)缺列新文件 -> 同样识别过期
  $pd = New-BuildFixture "" 0
  Write-F $pd "Assets/GameConfig/TbNew.cs" "class TbNew {}"
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 0 -and $r.out -match 'GameConfig\.csproj 过期' -and $r.out -match 'csproj 缺列.*TbNew\.cs') "E10 传递闭包内程序集缺列 -> 识别过期"
  Remove-Fixture

  # E11 报错落在比对面外(Ext = 仓外 file: 包,Assets 与内嵌包下都无同名 asmdef)-> 照判 FAIL,但不给排除结论并点名
  $pd = New-BuildFixture "CSC : error CS2001: Source file 'C:\ext\Fantasy.Unity\Runtime\Gone.cs' could not be found. [C:\x\Ext.csproj]`r`n" 1
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 1 -and $r.out -match '不排除 csproj 过期' -and $r.out -match '比对面外的 Ext\.csproj' -and $r.out -notmatch '排除 csproj 过期这一假失败来源') "E11 报错落在仓外包(比对面外)-> 不给排除结论,点名该 csproj"
  Remove-Fixture

  # E11b 内嵌包的程序集在比对面内:csproj 一致、报错落在它上面 -> 给排除结论,不再点名为面外
  $pd = New-BuildFixture "C:\x\Packages\MyPkg\Runtime\P.cs(1,1): error CS0103: The name 'Foo' does not exist [C:\x\Pkg.csproj]`r`n" 1
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 1 -and $r.out -match '排除 csproj 过期这一假失败来源' -and $r.out -notmatch '不排除 csproj 过期' -and $r.out -notmatch 'csproj 过期\(磁盘') "E11b 报错落在内嵌包程序集(比对面内、csproj 一致)-> 给排除结论"
  Remove-Fixture

  # E11c Packages 下没有 package.json 的目录不是包:其程序集仍在比对面外(源不在 Assets 下,也不判残留 INFRA)
  $pd = New-BuildFixture "CSC : error CS2001: Source file 'C:\x\Packages\NotPkg\Gone.cs' could not be found. [C:\x\Loose.csproj]`r`n" 1
  Write-F $pd "Packages/NotPkg/Loose.asmdef" '{ "name": "Loose" }'
  Write-F $pd "Packages/NotPkg/L.cs" "class L {}"
  Write-FxCsproj $pd "Loose" @("Packages\NotPkg\L.cs", "Packages\NotPkg\Gone.cs") @()
  Write-FxCsproj $pd "Assembly-CSharp-Editor" @("Assets\Editor\E.cs") @("GameLogic", "Launcher", "Pkg", "Ext", "Loose")
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 1 -and $r.out -match '比对面外的 Loose\.csproj' -and $r.out -notmatch 'Loose\.csproj 过期' -and $r.out -notmatch '排除 csproj 过期这一假失败来源') ("E11c 无 package.json 的 Packages 目录不算内嵌包 -> 比对面外,点名:" + $r.code)
  Remove-Fixture

  # E12 比对面内过期已重建,报错落在其 gate 副本上 -> 归回原名,仍在比对面内,给排除结论
  $pd = New-BuildFixture "C:\x\Assets\Launcher\LauncherSrc.cs(1,1): error CS0103: The name 'Foo' does not exist [C:\x\Launcher.gate.csproj]`r`n" 1
  Write-FxCsproj $pd "Launcher" @("Assets\Launcher\LauncherSrc.cs", "Assets\Launcher\Gone.cs") @("Pkg")
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 1 -and $r.out -match 'Launcher\.csproj 过期' -and $r.out -match '排除 csproj 过期这一假失败来源') "E12 报错在重建过的 gate 副本上 -> 归回比对面内,给排除结论"
  Remove-Fixture

  # E13 asmdef 已删、csproj 残留(实发:658f7eb8d 删 HtmlToUGUI 后 Xxhq.Htmltougui.csproj 仍被引)-> INFRA,不编
  $pd = New-BuildFixture "CSC : error CS2001: Source file 'C:\x\Assets\Gone\G.cs' could not be found. [C:\x\Gone.csproj]`r`n" 1
  Write-FxCsproj $pd "Gone" @("Assets\Gone\G.cs") @()
  Write-FxCsproj $pd "Assembly-CSharp-Editor" @("Assets\Editor\E.cs") @("GameLogic", "Launcher", "Pkg", "Gone")
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.out -match '须编辑器重生成' -and $r.out -match 'Gone\.csproj' -and $r.out -notmatch 'CS2001') "E13 闭包里 csproj 的 asmdef 已删 -> INFRA exit 2 点名,不跑编译"
  Remove-Fixture

  # E14 predefined 程序集(Assembly-CSharp)没有 asmdef 是常态,不算残留
  $pd = New-BuildFixture "" 0
  Write-F $pd "Assets/Scripts/A.cs" "class A {}"
  Write-FxCsproj $pd "Assembly-CSharp" @("Assets\Scripts\A.cs") @()
  Write-FxCsproj $pd "Assembly-CSharp-Editor" @("Assets\Editor\E.cs") @("GameLogic", "Launcher", "Pkg", "Assembly-CSharp")
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 0) ("E14 Assembly-CSharp 无 asmdef 不判残留 -> exit 0:" + $r.code)
  Remove-Fixture

  # ==== Editor程序集编译:工程内嵌包的程序集在比对面内 ====
  # E20 实发形态(2026-10-05 槽位 dev3,基线 9774fe35c 新增包内 .cs):Pkg.csproj 缺列 -> 识别过期、按包内实扫重建再编。
  # 不该算进 Pkg 的:忽略目录、包内更深 asmdef 的子树。
  $pd = New-BuildFixture "" 0
  Write-F $pd "Packages/MyPkg/Runtime/Ops/PrefetchOp.cs" "class PrefetchOp {}"
  Write-F $pd "Packages/MyPkg/Runtime/Samples~/Ig.cs" "class Ig {}"
  Write-F $pd "Packages/MyPkg/Runtime/Inner/Inner.asmdef" '{ "name": "Inner" }'
  Write-F $pd "Packages/MyPkg/Runtime/Inner/N.cs" "class N {}"
  $cap = Join-Path $script:fx "cap"
  New-Item -ItemType Directory -Force -Path $cap | Out-Null
  $capCmd = ""
  foreach ($n in @("Pkg", "Launcher", "Ext")) { $capCmd += "copy /y `"" + $pd + "\" + $n + ".gate.csproj`" `"" + $cap + "\" + $n + ".csproj`" >nul`r`n" }
  Set-FakeDotnet "" 0 $capCmd
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 0 -and $r.out -match 'Pkg\.csproj 过期' -and $r.out -match 'csproj 缺列.*Packages/MyPkg/Runtime/Ops/PrefetchOp\.cs' -and $r.out -match 'csproj 过期: Pkg,已按实扫重建列表编') ("E20 内嵌包 csproj 缺列新增文件 -> 识别过期并照编:" + $r.code)
  $gp = if (Test-Path (Join-Path $cap "Pkg.csproj")) { [System.IO.File]::ReadAllText((Join-Path $cap "Pkg.csproj")) } else { "" }
  $gl = if (Test-Path (Join-Path $cap "Launcher.csproj")) { [System.IO.File]::ReadAllText((Join-Path $cap "Launcher.csproj")) } else { "" }
  $gx = if (Test-Path (Join-Path $cap "Ext.csproj")) { [System.IO.File]::ReadAllText((Join-Path $cap "Ext.csproj")) } else { "" }
  Assert-True ($gp -match 'Packages\\MyPkg\\Runtime\\Ops\\PrefetchOp\.cs' -and $gp -match 'Runtime\\P\.cs' -and $gp -notmatch 'Ig\.cs|Inner') "E20b 编的 Pkg gate 副本按包内实扫重建:补上新文件,不收忽略目录与更深 asmdef 的子树"
  Assert-True ($gl -match 'Include="Pkg\.gate\.csproj"' -and $gl -match 'LauncherSrc\.cs') "E20c 引用方(Launcher)编的是 Pkg 的 gate 副本,自己的 Compile 不动"
  Assert-True ($gx -match 'C:\\ext\\Fantasy\.Unity\\Runtime\\X\.cs') "E20d 比对面外的仓外包 gate 副本原样复制"
  Assert-True (-not (Test-Path (Join-Path $pd "Pkg.gate.csproj"))) "E20e 临时 gate csproj 用完即删"
  Remove-Fixture

  # E21 包内多列:基线删了包内文件,Pkg.csproj 仍列着 -> 识别过期,重建后的副本不再列它
  $pd = New-BuildFixture "" 0
  Write-FxCsproj $pd "Pkg" @("Packages\MyPkg\Runtime\P.cs", "Packages\MyPkg\Runtime\Gone.cs") @()
  $cap = Join-Path $script:fx "cap"
  New-Item -ItemType Directory -Force -Path $cap | Out-Null
  Set-FakeDotnet "" 0 ("copy /y `"" + $pd + "\Pkg.gate.csproj`" `"" + $cap + "\Pkg.csproj`" >nul`r`n")
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  $gp = if (Test-Path (Join-Path $cap "Pkg.csproj")) { [System.IO.File]::ReadAllText((Join-Path $cap "Pkg.csproj")) } else { "" }
  Assert-True ($r.code -eq 0 -and $r.out -match 'Pkg\.csproj 过期' -and $r.out -match 'csproj 多列.*Packages/MyPkg/Runtime/Gone\.cs') ("E21 内嵌包 csproj 多列已删文件 -> 识别过期并照编:" + $r.code)
  Assert-True ($gp -match 'Runtime\\P\.cs' -and $gp -notmatch 'Gone\.cs') "E21b 编的 Pkg gate 副本不再列已删文件"
  Remove-Fixture

  # E22 实发后果形态:包内缺列时报错落在**引用方**(比对面内)的 csproj 上——过期的那份须先被识别并重建,
  # 之后给出的排除结论才成立(旧行为:Pkg 在面外不比对,照着过期 csproj 编,仍给排除结论)
  $pd = New-BuildFixture "C:\x\Assets\Launcher\LauncherSrc.cs(1,1): error CS0246: The type or namespace name 'PrefetchOp' could not be found [C:\x\Launcher.gate.csproj]`r`n" 1
  Write-F $pd "Packages/MyPkg/Runtime/Ops/PrefetchOp.cs" "class PrefetchOp {}"
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 1 -and $r.out -match 'Pkg\.csproj 过期\(磁盘 2 项 / csproj 列 1 项\),按实扫重建' -and $r.out -match '排除 csproj 过期这一假失败来源') "E22 包内缺列、报错在引用方 -> 先识别并重建 Pkg,再给排除结论"
  Remove-Fixture

  # E23 Assets 与内嵌包里同名 asmdef -> INFRA,不编
  $pd = New-BuildFixture "C:\x\Assets\Editor\E.cs(1,1): error CS0103: The name 'Foo' does not exist`r`n" 1
  Write-F $pd "Assets/Dup/Dup.asmdef" '{ "name": "Pkg" }'
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'Pkg\.asmdef 得 2 个\(Assets 1 / 内嵌包 1\)' -and $r.out -notmatch 'CS0103') ("E23 Assets 与内嵌包同名 asmdef -> INFRA exit 2,不跑编译:" + $r.code)
  Remove-Fixture

  # ==== Editor程序集编译:出包平台 define 那一遍(实发:a5093aa42 迁走方法,#elif UNITY_WEBGL 分支漏改,2171b2077 修)====
  # E15 编辑器那遍编过、只有 WebGL 那遍报 CS0103 -> FAIL exit 1,点名 WebGL、不点名 Android
  $pd = New-BuildFixture "" 0
  Set-FakeDotnetPd "WebGL" "C:\x\Assets\GameLogic\GameLogicSrc.cs(9,9): error CS0103: The name 'RelogFromScratch' does not exist in the current context [C:\x\GameLogic.csproj]`r`n" 1
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 1 -and $r.out -match '出包平台 define 下编译失败:WebGL' -and $r.out -match '\[WebGL\].*CS0103' -and $r.out -notmatch '\[Android\]') ("E15 只 WebGL 那遍失败 -> FAIL exit 1 按平台点名:" + $r.code)
  Remove-Fixture

  # E16 出包平台那遍只有文件锁错误 -> INFRA exit 2
  $pd = New-BuildFixture "" 0
  Set-FakeDotnetPd "Android" "C:\x\GameLogic.csproj : error MSB3027: Could not copy `"obj\GameLogic.dll`". Exceeded retry count of 10.`r`n" 1
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA' -and $r.out -match '\[Android\].*MSB3027') ("E16 出包平台那遍只有文件锁 -> INFRA exit 2:" + $r.code)
  Remove-Fixture

  # E17 coveredPlatforms 含本道无内置宏映射的平台 -> INFRA exit 2 点名,不编
  $pd = New-BuildFixture "C:\x\Assets\Editor\E.cs(1,1): error CS0103: The name 'Foo' does not exist`r`n" 1
  Write-F $pd "ProjectSettings/PlatformDefinePolicy.json" '{ "coveredPlatforms": [ "Android", "PS5" ], "rules": [] }'
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'PS5' -and $r.out -notmatch 'CS0103') ("E17 未映射平台 -> INFRA exit 2 点名,不编:" + $r.code)
  Remove-Fixture

  # E18 编译根按 asmdef 平台约束取舍:纯编辑器 / 测试程序集不编,includePlatforms 只列 WebGL 的只进 WebGL 那遍
  $pd = New-BuildFixture "" 0
  foreach ($n in @("EdOnly", "WebOnly", "PlayTests")) { Write-F $pd ("Assets/" + $n + "/" + $n + "Src.cs") ("class " + $n + "Src {}"); Write-FxCsproj $pd $n @("Assets\" + $n + "\" + $n + "Src.cs") @() }
  Write-F $pd "Assets/EdOnly/EdOnly.asmdef" '{ "name": "EdOnly", "includePlatforms": [ "Editor" ] }'
  Write-F $pd "Assets/WebOnly/WebOnly.asmdef" '{ "name": "WebOnly", "includePlatforms": [ "WebGL" ] }'
  Write-F $pd "Assets/PlayTests/PlayTests.asmdef" '{ "name": "PlayTests", "defineConstraints": [ "UNITY_INCLUDE_TESTS" ] }'
  Write-FxCsproj $pd "Assembly-CSharp-Editor" @("Assets\Editor\E.cs") @("GameLogic", "Launcher", "Pkg", "Ext", "EdOnly", "WebOnly", "PlayTests")
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  $pa = [System.IO.File]::ReadAllText((Join-Path $pd "Temp\PlayerDefineBuild\Android\build.proj"))
  $pw = [System.IO.File]::ReadAllText((Join-Path $pd "Temp\PlayerDefineBuild\WebGL\build.proj"))
  Assert-True ($r.code -eq 0 -and $pa -match 'GameLogic\.csproj' -and $pa -match 'GameConfig\.csproj' -and $pa -match 'Launcher\.csproj') ("E18 运行时程序集进各平台编译根:" + $r.code)
  Assert-True ($pa -notmatch 'EdOnly|PlayTests|Pkg\.csproj|Ext\.csproj|Assembly-CSharp-Editor' -and $pw -notmatch 'Pkg\.csproj|Ext\.csproj' -and $pa -notmatch 'WebOnly' -and $pw -match 'WebOnly\.csproj') "E18b 纯编辑器 / 测试 / 内嵌包(在比对面内但不作编译根)/ 比对面外不编;includePlatforms 只列 WebGL 的只进 WebGL"

  # E19 swap.props 经真 MSBuild 求值:剥编辑器宏、别的平台内置宏与全局宏,加回目标平台的;产物改落 PlayerDefineBuild
  $env:PATH = $script:origPath
  if (Get-Command dotnet -ErrorAction SilentlyContinue) {
    Write-F $pd "Mini.csproj" ("<Project ToolsVersion=`"4.0`" xmlns=`"http://schemas.microsoft.com/developer/msbuild/2003`">`r`n" +
      "  <PropertyGroup><DefineConstants>UNITY_EDITOR;UNITY_EDITOR_WIN;UNITY_WEBGL;UNITY_WEBGL_API;PLATFORM_WEBGL;FANTASY_WEBGL;FOO;KEEP</DefineConstants><OutputPath>Temp\Bin\Mini\</OutputPath></PropertyGroup>`r`n" +
      "  <Import Project=`"`$(MSBuildToolsPath)\Microsoft.CSharp.targets`" />`r`n</Project>`r`n")
    $ErrorActionPreference = 'Continue'
    $ev = (& dotnet msbuild (Join-Path $pd "Mini.csproj") -getProperty:DefineConstants -getProperty:OutputPath ("-p:CustomBeforeMicrosoftCommonTargets=" + (Join-Path $pd "Temp\PlayerDefineBuild\Android\swap.props")) 2>&1 | Out-String)
    $ErrorActionPreference = 'Stop'
    $dm = [regex]::Match($ev, '"DefineConstants":\s*"([^"]*)"')
    $got = @($dm.Groups[1].Value -split ';' | Where-Object { $_ } | Sort-Object)
    $want = @("FOO", "KEEP", "PLATFORM_ANDROID", "UNITY_ANDROID", "UNITY_ANDROID_API" | Sort-Object)
    Assert-True ($dm.Success -and (($got -join ';') -ceq ($want -join ';'))) ("E19 Android 宏替换:得 " + ($got -join ';'))
    Assert-True ($ev -match 'PlayerDefineBuild\\\\Android\\\\bin\\\\Mini') "E19b 产物改落 Temp\PlayerDefineBuild\<平台>\bin"
  } else {
    Write-Host "  SKIP E19 本机无 dotnet"
  }
  Remove-Fixture

  if ($hasToolDefines) {
  # ==== Editor程序集编译:工具宏那一遍(默认不定义的 AUTOPLAY 包住的代码,前两遍都不编)====
  # E24 编辑器与出包平台都编过、只有带 AUTOPLAY 那遍报 CS1061 -> FAIL exit 1,按宏点名、不点名平台
  $pd = New-BuildFixture "" 0
  Set-FakeDotnetPd "AUTOPLAY" "C:\x\Assets\GameLogic\GameLogicSrc.cs(9,9): error CS1061: 'OrderSync' does not contain a definition for 'OnDeliverFailed' [C:\x\GameLogic.csproj]`r`n" 1
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 1 -and $r.out -match '工具宏下编译失败:AUTOPLAY' -and $r.out -match '\[AUTOPLAY\].*CS1061' -and $r.out -notmatch '出包平台 define 下编译失败') ("E24 只工具宏那遍失败 -> FAIL exit 1 按宏点名:" + $r.code)
  Remove-Fixture

  # E25 工具宏那遍只有文件锁错误 -> INFRA exit 2
  $pd = New-BuildFixture "" 0
  Set-FakeDotnetPd "AUTOPLAY" "C:\x\GameLogic.csproj : error MSB3027: Could not copy `"obj\GameLogic.dll`". Exceeded retry count of 10.`r`n" 1
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA' -and $r.out -match '\[AUTOPLAY\].*MSB3027') ("E25 工具宏那遍只有文件锁 -> INFRA exit 2:" + $r.code)
  Remove-Fixture

  # E26 全过时摘要点名工具宏;swap.props 经真 MSBuild 求值:原宏原样保留、追加 AUTOPLAY,产物改落 ToolDefineBuild
  $pd = New-BuildFixture "" 0
  $r = Invoke-Cli $BuildTarget "-ProjectDir" $pd
  Assert-True ($r.code -eq 0 -and $r.out -match '工具宏 AUTOPLAY 0 errors') ("E26 全过摘要点名工具宏:" + $r.code)
  $env:PATH = $script:origPath
  if (Get-Command dotnet -ErrorAction SilentlyContinue) {
    Write-F $pd "Mini.csproj" ("<Project ToolsVersion=`"4.0`" xmlns=`"http://schemas.microsoft.com/developer/msbuild/2003`">`r`n" +
      "  <PropertyGroup><DefineConstants>UNITY_EDITOR;UNITY_WEBGL;FOO</DefineConstants><OutputPath>Temp\Bin\Mini\</OutputPath></PropertyGroup>`r`n" +
      "  <Import Project=`"`$(MSBuildToolsPath)\Microsoft.CSharp.targets`" />`r`n</Project>`r`n")
    $ErrorActionPreference = 'Continue'
    $ev = (& dotnet msbuild (Join-Path $pd "Mini.csproj") -getProperty:DefineConstants -getProperty:OutputPath ("-p:CustomBeforeMicrosoftCommonTargets=" + (Join-Path $pd "Temp\ToolDefineBuild\AUTOPLAY\swap.props")) 2>&1 | Out-String)
    $ErrorActionPreference = 'Stop'
    $dm = [regex]::Match($ev, '"DefineConstants":\s*"([^"]*)"')
    $got = @($dm.Groups[1].Value -split ';' | Where-Object { $_ } | Sort-Object)
    $want = @("AUTOPLAY", "FOO", "UNITY_EDITOR", "UNITY_WEBGL" | Sort-Object)
    Assert-True ($dm.Success -and (($got -join ';') -ceq ($want -join ';'))) ("E26b 工具宏追加、原宏不剥:得 " + ($got -join ';'))
    Assert-True ($ev -match 'ToolDefineBuild\\\\AUTOPLAY\\\\bin\\\\Mini') "E26c 产物改落 Temp\ToolDefineBuild\<宏>\bin"
  } else {
    Write-Host "  SKIP E26b 本机无 dotnet"
  }
  Remove-Fixture
  } else { Write-Host "SKIP E24~E26 工具宏那一遍:Editor程序集编译 的 `$ToolDefines 为空" }
}
finally {
  Remove-Fixture
  $env:LOCALAPPDATA = $oldLad
  $env:PATH = $script:origPath
  $env:DEVFLOW_TEST_GATE_SCAN_DIR = $oldScanDir
}

Write-Host ""
Exit-TestSuite
