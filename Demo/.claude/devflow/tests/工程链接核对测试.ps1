# 工程链接核对测试.ps1 — 工程链接核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,真 git 仓)。
# 覆盖:基线 clean / 属性展开后的 Compile Link 断链(回归位)/ ProjectReference 断链 /
#   通配项基目录缺失与存在 / 展不开的属性跳过不判 / 已忽略 csproj 在面外、未跟踪未忽略的在面内 /
#   已删未提交跳过 / 非法 XML、非 git 检出、git 报错三类 INFRA。
# 真 git 仓是必要的:本道扫入仓候选(已跟踪 + 未跟踪未忽略)的 csproj,Unity 生成的那批靠 .gitignore 排除。
# T2 是回归位:OfferCfgCheck.csproj 在 GameConfigBB.cs 整类删除后仍链接它,两端导表中止(814bc76e8)。
# 跑法:工程链接核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 工程链接核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "工程链接核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-csprojlink-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

# 客户端仓夹具:$Tracked 写入并提交,$Untracked 只落盘。返回 Demo 路径(扫描入参)。
function New-Repo([hashtable]$Tracked = @{}, [hashtable]$Untracked = @{}) {
  $root = Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))
  New-GitRepo $root "Demo/Assets/seed.txt"
  foreach ($rel in $Tracked.Keys) { Write-F $root $rel $Tracked[$rel] }
  G $root "add -A" | Out-Null
  G $root "commit -q -m fixture" | Out-Null
  foreach ($rel in $Untracked.Keys) { Write-F $root $rel $Untracked[$rel] }
  return (Join-Path $root "Demo")
}

# OfferCfgCheck 的真实形态:属性定义源根,<Compile Include="$(Src)\X.cs" Link=...>
function Proj([string]$Items) {
  return "<Project Sdk=`"Microsoft.NET.Sdk`">`n  <PropertyGroup>`n    <UPRoot>..\..</UPRoot>`n    <Src>`$(UPRoot)\Assets\Code</Src>`n  </PropertyGroup>`n  <ItemGroup>`n$Items`n  </ItemGroup>`n</Project>`n"
}

try {
  # T1 基线:本地文件 + 属性展开后的链接 + 通配项,目标全在
  $pd = New-Repo @{
    "Demo/Assets/Code/A.cs" = "class A {}`n"
    "Demo/Configs/Tool/Program.cs"  = "class P {}`n"
    "Demo/Configs/Tool/Tool.csproj" = (Proj "    <Compile Include=`"Program.cs`" />`n    <Compile Include=`"`$(Src)\A.cs`" Link=`"L\A.cs`" />`n    <Compile Include=`"`$(Src)\*.cs`" Link=`"L\%(Filename)%(Extension)`" />")
  }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0 -and $r.out -match 'OK\s+工程链接核对.*3 linked items') "T1 链接目标全在 -> PASS"

  # T2 回归位:链接的源文件已删
  $pd = New-Repo @{
    "Demo/Configs/Tool/Tool.csproj" = (Proj "    <Compile Include=`"`$(Src)\GameConfigBB.cs`" Link=`"L\GameConfigBB.cs`" />")
  }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 1 -and $r.out -match 'Tool\.csproj' -and $r.out -match 'GameConfigBB\.cs') "T2 Compile 链接的源已删 -> FAIL 并点名"

  # T3 ProjectReference 指向不存在的工程
  $pd = New-Repo @{ "Demo/Tools/X/X.csproj" = "<Project>`n  <ItemGroup>`n    <ProjectReference Include=`"..\Gone\Gone.csproj`" />`n  </ItemGroup>`n</Project>`n" }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 1 -and $r.out -match 'ProjectReference' -and $r.out -match 'Gone\.csproj') "T3 ProjectReference 断链 -> FAIL"

  # T4 通配项的基目录整个没了
  $pd = New-Repo @{ "Demo/Tools/X/X.csproj" = "<Project>`n  <ItemGroup>`n    <Compile Include=`"../Analyzer/Extension/*.cs`" />`n  </ItemGroup>`n</Project>`n" }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 1 -and $r.out -match 'wildcard base dir') "T4 通配基目录缺失 -> FAIL"

  # T5 展不开的属性(外部 props 定义)跳过打 NOTE,不判违规
  $pd = New-Repo @{ "Demo/Tools/X/X.csproj" = "<Project>`n  <ItemGroup>`n    <Compile Include=`"`$(ExternalRoot)\Y.cs`" />`n  </ItemGroup>`n</Project>`n" }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0 -and $r.out -match 'NOTE.*unresolved property') "T5 未解析属性 -> 跳过 PASS"

  # T6 面外:已忽略的 csproj(Unity 生成的那批即此形态:Demo/.gitignore 忽略 *.csproj)
  $pd = New-Repo @{ "Demo/.gitignore" = "*.csproj`n" } @{ "Demo/GameLogic.csproj" = "<Project>`n  <ItemGroup>`n    <Compile Include=`"Assets\Gone.cs`" />`n  </ItemGroup>`n</Project>`n" }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0) "T6a 已忽略的 csproj -> PASS"
  # T6b 面内:未跟踪未忽略的新工具工程(主工程/人工入库通道先自检、再 add,只扫已跟踪会放它断链入仓)
  $pd = New-Repo @{} @{ "Demo/Tools/新工具/New.csproj" = "<Project>`n  <ItemGroup>`n    <Compile Include=`"..\Gone.cs`" />`n  </ItemGroup>`n</Project>`n" }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 1 -and $r.out -match '新工具/New\.csproj' -and $r.out -match 'Gone\.cs') "T6b 未跟踪未忽略的中文路径 csproj 断链 -> FAIL 并点名"
  # T6c 已删除但仍在索引的 csproj 跳过
  $pd = New-Repo @{ "Demo/Tools/X/X.csproj" = "<Project>`n  <ItemGroup>`n    <Compile Include=`"..\Gone.cs`" />`n  </ItemGroup>`n</Project>`n" }
  [System.IO.File]::Delete((Join-Path (Split-Path $pd -Parent) "Demo\Tools\X\X.csproj"))
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 0) "T6c 已删未提交的 csproj -> PASS"

  # T7 INFRA:csproj 非法 XML / 目标不是 git 检出
  $pd = New-Repo @{ "Demo/Tools/X/X.csproj" = "<Project><ItemGroup>`n" }
  $r = Invoke-ScanCheck $Target $pd
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA.*not valid XML') "T7a 非法 XML -> INFRA"
  $bare = Join-Path $script:fx "notgit"
  New-Item -ItemType Directory -Force -Path (Join-Path $bare "Demo") | Out-Null
  $r = Invoke-ScanCheck $Target (Join-Path $bare "Demo")
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA.*not a git checkout') "T7b 非 git 检出 -> INFRA"
  # T7c git 本身报错(.git 指向不存在的 gitdir):须 INFRA,不得当空清单放行
  $broken = Join-Path $script:fx "brokengit"
  New-Item -ItemType Directory -Force -Path (Join-Path $broken "Demo") | Out-Null
  Write-F $broken ".git" "gitdir: ./nowhere`n"
  # 被测脚本若把 git 的 stderr 漏到自己的 stderr,本进程 EAP=Stop 下会抛出——同样记为本条 FAIL,不让套件中断
  try { $r = Invoke-ScanCheck $Target (Join-Path $broken "Demo") } catch { $r = @{ code = -1; out = [string]$_ } }
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T7c git 报错 -> INFRA"
}
finally {
  Remove-FixtureTree $script:fx
}
Exit-TestSuite
