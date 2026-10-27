# 机器路径核对测试.ps1 — 机器路径核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,真 git 仓)。
# 覆盖:两端基线 clean / 客户端 .bat 与 Editor .cs 违规 / 三类豁免(注释四形态、系统路径白名单、
#   行内标记)/ 三类面外(业务运行时 .cs、.claude 下脚本、已忽略文件)/ 未跟踪未忽略的新文件
#   (含中文名)在面内 / 已删未提交跳过 / URL 不误报 / 服务端侧经 -FantasyRoot 命中 /
#   非 git 检出、缺参、git 报错三类 INFRA。
# 真 git 仓是必要的:扫描面 = 入仓候选(已跟踪 + 未跟踪未忽略),忽略规则与索引都要真 git 才成立。
# T3 是回归位:那串 /d/work/... 正是 BuildPipelineWindow 私钥默认值曾经的值,本道上线前无人拦。
# 跑法:机器路径核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 机器路径核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "机器路径核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-machinepath-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

# 建一个双仓夹具:<root> 是客户端仓(内含 Demo/),<root>/Fantasy 是独立的服务端仓。
# $Tracked 的每一项 rel->text 写入并提交;$Untracked 的只落盘不提交(用于「只扫入仓」那条)。
function New-Repo([hashtable]$Tracked = @{}, [hashtable]$Untracked = @{}, [hashtable]$ServerTracked = @{}) {
  $root = Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))
  New-GitRepo $root "Demo/Assets/seed.txt"
  # Fantasy 是客户端仓 .gitignore 里的独立仓(与真实工程同构),否则它会被客户端仓一并跟踪。
  Write-F $root ".gitignore" "Fantasy/`n"
  foreach ($rel in $Tracked.Keys) { Write-F $root $rel $Tracked[$rel] }
  G $root "add -A" | Out-Null
  G $root "commit -q -m fixture" | Out-Null
  foreach ($rel in $Untracked.Keys) { Write-F $root $rel $Untracked[$rel] }

  $server = Join-Path $root "Fantasy"
  New-GitRepo $server "examples/seed.txt"
  foreach ($rel in $ServerTracked.Keys) { Write-F $server $rel $ServerTracked[$rel] }
  G $server "add -A" | Out-Null
  G $server "commit -q -m fixture" | Out-Null
  return $root
}

try {
  # T1 两端基线:面内有文件但都不含机器路径
  $root = New-Repo @{ "Demo/Tools/ok.sh" = "echo hi`n" } @{} @{ "examples/ok.sh" = "echo hi`n" }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 0 -and $r.out -match 'OK\s+机器路径核对') "T1a 客户端基线 clean -> PASS"
  $r = Invoke-DualScanCheck $Target $root -ViaFantasy
  Assert-True ($r.code -eq 0 -and $r.out -match 'OK\s+机器路径核对') "T1b 服务端基线 clean -> PASS"

  # T2 客户端 .bat 里的盘符路径(BuildCLI/path_define.bat 的真实形态)
  $root = New-Repo @{ "Demo/BuildCLI/path_define.bat" = "set WORKSPACE=G:/github/TEngine/Demo`n" }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 1 -and $r.out -match 'path_define\.bat:1' -and $r.out -match 'G:/github/TEngine') "T2 .bat 机器路径 -> FAIL 并点名行号"

  # T3 回归位:Editor 工具 .cs 里的 Git-Bash 形态私钥默认值(本道上线前四次复发之一)
  $root = New-Repo @{ "Demo/Assets/TEngine/Editor/X.cs" = "class X { string k = `"/d/work/block-rougelike/Fantasy/k.pem`"; }`n" }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 1 -and $r.out -match '/d/work/block-rougelike') "T3 Editor .cs 的 /d/ 形态路径 -> FAIL(漏检样本回归)"

  # T4 面外:业务运行时 .cs 不在客户端扫描面内
  $root = New-Repo @{ "Demo/Assets/GameScripts/HotFix/GameLogic/Y.cs" = "class Y { string k = `"D:/mine/x.txt`"; }`n" }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 0) "T4 业务运行时 .cs 在面外 -> PASS"

  # T5 面外:.claude 下的脚本(测试夹具本就用虚构路径,且 R6 另有静态扫描管)
  $root = New-Repo @{ "Demo/.claude/devflow/t.ps1" = "`$p = 'D:\explicit\r'`n" }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 0) "T5 .claude 下脚本在面外 -> PASS"

  # T6 豁免一:注释四形态(sh 行注释 / cs 行注释 / cs 块注释 / bat rem)
  $root = New-Repo @{
    "Demo/Tools/c.sh"                         = "# 例: SSH_KEY=/c/Users/pc/Desktop/k.pem`necho hi`n"
    "Demo/Assets/Editor/A.cs"          = "// D:\a\b -> /d/a/b`nclass A {}`n"
    "Demo/Assets/Editor/B.cs"          = "/*`nExample:`n    G:/UnityEditor/2021.3/Editor`n*/`nclass B {}`n"
    "Demo/Tools/c.bat"                        = "rem set W=G:/github/TEngine`necho hi`n"
  }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 0) "T6 注释四形态全豁免 -> PASS"

  # T7 豁免二:系统标准位置(where git 失败后的合法回落,deploy.bat 与 BuildPipelineWindow 都用)
  $root = New-Repo @{ "Demo/Tools/g.bat" = "set BASH=C:\Program Files\Git\bin\bash.exe`n" }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 0) "T7 C:\Program Files 白名单 -> PASS"

  # T8 豁免三:行内逃生舱标记
  $root = New-Repo @{ "Demo/Tools/e.sh" = "KEY=/d/x/y.pem # machine-path-ok: fixture`n" }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 0) "T8 machine-path-ok 标记 -> PASS"

  # T9 面外:被 .gitignore 忽略的本地私有文件(那才是机器路径的推荐去处)
  $root = New-Repo @{ ".gitignore" = "Fantasy/`n*.local.sh`n" } @{ "Demo/Tools/deploy.local.sh" = "KEY=/e/block-rougelike/Fantasy/k.pem`n" }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 0) "T9a 已忽略的未跟踪文件 -> PASS"
  # T9b 面内:未跟踪且未忽略 = 待 add 的新文件。主工程/人工入库通道先自检、再提交,只扫已跟踪会让它自检照过后入仓
  $root = New-Repo @{} @{ "Demo/Tools/local.sh" = "KEY=/e/block-rougelike/Fantasy/k.pem`n" }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 1 -and $r.out -match 'local\.sh:1') "T9b 未跟踪未忽略的新文件 -> FAIL"
  # T9c 中文文件名的未跟踪新文件(清单须按 UTF-8 解,-z 不转义)
  $root = New-Repo @{} @{ "Demo/Tools/部署.sh" = "KEY=/d/x/k.pem`n" }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 1 -and $r.out -match '部署\.sh:1') "T9c 中文名未跟踪新文件 -> FAIL 并点名"
  # T9d 已删除但仍在索引的文件跳过(工作区没有它,不是本道的事)
  $root = New-Repo @{ "Demo/Tools/gone.sh" = "KEY=/d/x/k.pem`n" }
  [System.IO.File]::Delete((Join-Path $root "Demo\Tools\gone.sh"))
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 0) "T9d 已删未提交的文件 -> PASS"

  # T10 URL 不误报:https:// 里的 "s:/" 前是字母,//download 不是 /<单字母>/ 形态
  $root = New-Repo @{ "Demo/Tools/u.sh" = "curl https://dotnet.microsoft.com/download/dotnet/8.0`n" }
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 0) "T10 URL 不误报 -> PASS"

  # T11 服务端侧:deploy.local.sh 的真实形态,经 -FantasyRoot 驱动
  $root = New-Repo @{} @{} @{ "examples/Server/APP/deploy/deploy.local.sh" = "export SSH_KEY=`"/e/block-rougelike/Fantasy/k.pem`"`n" }
  $r = Invoke-DualScanCheck $Target $root -ViaFantasy
  Assert-True ($r.code -eq 1 -and $r.out -match 'deploy\.local\.sh:1') "T11 服务端 SSH_KEY -> FAIL"
  $r = Invoke-DualScanCheck $Target $root
  Assert-True ($r.code -eq 0) "T11b 同一夹具从客户端侧看不到服务端仓 -> PASS"

  # T12 INFRA:目标不是 git 检出 / 两个参数都没给
  $bare = Join-Path $script:fx "notgit"
  New-Item -ItemType Directory -Force -Path (Join-Path $bare "Demo") | Out-Null
  $r = Invoke-ScanCheck $Target (Join-Path $bare "Demo")
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA.*not a git checkout') "T12a 非 git 检出 -> INFRA"
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target 2>&1 | ForEach-Object { [string]$_ })
  Assert-True ($LASTEXITCODE -eq 2 -and ($lines -join "`n") -match 'INFRA') "T12b 缺两个根参数 -> INFRA"
  # T12c git 本身报错(.git 指向不存在的 gitdir):须 INFRA,不得当空清单放行
  $broken = Join-Path $script:fx "brokengit"
  New-Item -ItemType Directory -Force -Path (Join-Path $broken "Demo") | Out-Null
  Write-F $broken ".git" "gitdir: ./nowhere`n"
  Write-F $broken "Demo/Tools/x.sh" "KEY=/d/x/k.pem`n"
  # 被测脚本若把 git 的 stderr 漏到自己的 stderr,本进程 EAP=Stop 下会抛出——同样记为本条 FAIL,不让套件中断
  try { $r = Invoke-ScanCheck $Target (Join-Path $broken "Demo") } catch { $r = @{ code = -1; out = [string]$_ } }
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T12c git 报错 -> INFRA"
}
finally {
  Remove-FixtureTree $script:fx
}
Exit-TestSuite
