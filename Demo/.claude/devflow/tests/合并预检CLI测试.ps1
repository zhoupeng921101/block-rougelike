# 合并预检CLI测试.ps1 — 合并前只读预检的 CLI 层测试(黑盒断言,不依赖内部实现)。
# 覆盖:缺槽 ABORT(2)、双仓 0 ahead=nothing-to-merge(1)、client ahead+全清=NO BLOCKERS(0)、
#   槽位 dirty blocker(1)、主客户端工作树范围重叠 blocker(1)、
#   出处清单机械比对(匹配=0 / 有外来提交=1 / 文件缺失或空清单=2)、主 Fantasy 行尾幻影不判脏、
#   有 blocker 时末尾的 BLOCKER-SEGMENTS 段别行(A / A2 / B / C / D 各一例,无 blocker 不出)。
# 夹具 = %TEMP% 下的真 git 仓 + 配对 worktree;不触真仓。经显式 -RepoRoot/-FantasyRoot/
# -Slot <全路径> 注入,不需要改配置。
# 跑法:合并预检CLI测试.ps1 [-Target <实现路径>]   缺省 = 上级目录的 合并预检.ps1
[CmdletBinding(PositionalBinding=$false)]
param([string]$Target = "")
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
# 服务端通道关闭时换成启用服务端的 devflow 副本(见夹具库同名函数);副本落套件级临时目录,收尾删。
$srvDf = Join-Path $env:TEMP ("flowtest-srvdf-" + [Guid]::NewGuid().ToString("N"))
$dfDir = Get-ServerFlowDir $dfDir $srvDf
if (-not $Target) { $Target = Join-Path $dfDir "合并预检.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }
$cfg = Import-PowerShellDataFile (Join-Path $dfDir "flow-config.psd1")
$srvDir = $cfg.ServerDirName

function Invoke-Precheck([hashtable]$Opt) {
  $argv = @()
  if ($Opt.ContainsKey('Slot'))     { $argv += @('-Slot', [string]$Opt.Slot) }
  if ($Opt.ContainsKey('RepoRoot')) { $argv += @('-RepoRoot', [string]$Opt.RepoRoot) }
  if ($Opt.ContainsKey('FxRoot'))   { $argv += @('-FantasyRoot', [string]$Opt.FxRoot) }
  if ($Opt.ContainsKey('Expected')) { $argv += @('-ExpectedCommits', [string]$Opt.Expected) }
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target @argv 2>&1 | ForEach-Object { [string]$_ })
  $code = $LASTEXITCODE
  return @{ code = $code; out = ($lines -join "`n") }
}


$script:fx = $null
function New-Fixture {
  # 回 @{ tmp; mainC; mainF; slot }
  $tmp = Join-Path $env:TEMP ("flowtest-precheck-" + [Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $tmp | Out-Null
  $script:fx = $tmp
  $mainC = Join-Path $tmp "main-client"
  $mainF = Join-Path $tmp "main-fantasy"
  New-GitRepo $mainC "Demo\Assets\GameLogic\Seed.cs"
  New-GitRepo $mainF "examples\Server\Seed.cs"
  $slot = Join-Path $tmp "slots\block-client-dev1"
  G $mainC "worktree add -q -b agent/dev1 ""$slot"" main" | Out-Null
  G $mainF "worktree add -q -b agent/dev1 ""$(Join-Path $slot $srvDir)"" main" | Out-Null
  return @{ tmp = $tmp; mainC = $mainC; mainF = $mainF; slot = $slot }
}
function Add-AheadCommit([hashtable]$F, [string]$Subject = "feat: 客户端改动") {
  Write-F $F.slot "Demo\Assets\GameLogic\Foo.cs" "public class Foo {}`n" | Out-Null
  G $F.slot "add -A" | Out-Null
  G $F.slot "commit -q -m ""$Subject""" | Out-Null
  return (G $F.slot "rev-parse HEAD")[0].Trim()
}

Write-Host "== 合并预检 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # 1. 缺槽
  $F = New-Fixture
  $r = Invoke-Precheck @{ Slot = (Join-Path $F.tmp "no-such-dev1"); RepoRoot = $F.mainC; FxRoot = $F.mainF }
  Assert-True ($r.code -eq 2 -and $r.out -match "ABORT") "1 缺槽 -> ABORT exit 2"
  Remove-Fixture

  # 2. 双仓 0 ahead
  $F = New-Fixture
  $r = Invoke-Precheck @{ Slot = $F.slot; RepoRoot = $F.mainC; FxRoot = $F.mainF }
  Assert-True ($r.code -eq 1 -and $r.out -match "nothing to merge") "2 双仓 0 ahead -> nothing to merge exit 1"
  # 夹具里槽位 Fantasy worktree 在槽位客户端看来是未跟踪目录,B 段同时报 dirty,故只断言段别行首位是 A。
  Assert-True ($r.out -match '(?m)^BLOCKER-SEGMENTS: A( |\s*$)') "2b blocker 段别行按首次出现的次序点名,首位 A(集成交付 据此记遥测 blockers)"
  Remove-Fixture

  # 3. client ahead + 全清
  $F = New-Fixture
  Add-AheadCommit $F | Out-Null
  $r = Invoke-Precheck @{ Slot = $F.slot; RepoRoot = $F.mainC; FxRoot = $F.mainF }
  Assert-True ($r.code -eq 0 -and $r.out -match "NO BLOCKERS") "3 client ahead 全清 -> NO BLOCKERS exit 0"
  Assert-True ($r.out -notmatch 'BLOCKER-SEGMENTS') "3b 无 blocker 时不出段别行"
  Remove-Fixture

  # 4. 槽位 dirty
  $F = New-Fixture
  Add-AheadCommit $F | Out-Null
  Write-F $F.slot "Demo\Assets\GameLogic\Dirty.cs" "// 未提交`n" | Out-Null
  $r = Invoke-Precheck @{ Slot = $F.slot; RepoRoot = $F.mainC; FxRoot = $F.mainF }
  Assert-True ($r.code -eq 1 -and $r.out -match "uncommitted") "4 槽位 dirty -> blocker exit 1"
  Assert-True ($r.out -match '(?m)^BLOCKER-SEGMENTS: B\s*$') "4b 段别行点名 B"
  Remove-Fixture

  # 5. 主客户端范围重叠
  $F = New-Fixture
  Add-AheadCommit $F | Out-Null
  Write-F $F.mainC "Demo\Assets\GameLogic\Foo.cs" "// 主仓未提交改动`n" | Out-Null
  $r = Invoke-Precheck @{ Slot = $F.slot; RepoRoot = $F.mainC; FxRoot = $F.mainF }
  Assert-True ($r.code -eq 1 -and $r.out.ToLowerInvariant() -match "overlap") "5 主仓范围重叠 -> blocker exit 1"
  Remove-Fixture

  # 6. 出处清单匹配
  $F = New-Fixture
  $h = Add-AheadCommit $F
  Write-F $F.tmp "expected.txt" ($h + "`n")
  $lst = Join-Path $F.tmp "expected.txt"
  $r = Invoke-Precheck @{ Slot = $F.slot; RepoRoot = $F.mainC; FxRoot = $F.mainF; Expected = $lst }
  Assert-True ($r.code -eq 0 -and $r.out -match "NO BLOCKERS") "6 出处清单匹配 -> exit 0"
  Remove-Fixture

  # 7. 有外来提交
  $F = New-Fixture
  Add-AheadCommit $F | Out-Null
  Write-F $F.tmp "expected.txt" "abcdef1234`n"
  $lst = Join-Path $F.tmp "expected.txt"
  $r = Invoke-Precheck @{ Slot = $F.slot; RepoRoot = $F.mainC; FxRoot = $F.mainF; Expected = $lst }
  Assert-True ($r.code -eq 1 -and $r.out -match "provenance") "7 外来提交 -> provenance blocker exit 1"
  Assert-True ($r.out -match '(?m)^BLOCKER-SEGMENTS: A2\s*$') "7b 段别行点名 A2"
  Remove-Fixture

  # 8. 清单文件缺失
  $F = New-Fixture
  Add-AheadCommit $F | Out-Null
  $r = Invoke-Precheck @{ Slot = $F.slot; RepoRoot = $F.mainC; FxRoot = $F.mainF; Expected = (Join-Path $F.tmp "no.txt") }
  Assert-True ($r.code -eq 2 -and $r.out -match "ABORT") "8 清单文件缺失 -> ABORT exit 2"
  Remove-Fixture

  # 9. 空清单
  $F = New-Fixture
  Add-AheadCommit $F | Out-Null
  Write-F $F.tmp "empty.txt" "# 没有 hash`n"
  $lst = Join-Path $F.tmp "empty.txt"
  $r = Invoke-Precheck @{ Slot = $F.slot; RepoRoot = $F.mainC; FxRoot = $F.mainF; Expected = $lst }
  Assert-True ($r.code -eq 2 -and $r.out -match "ABORT") "9 空清单 -> ABORT exit 2"
  Remove-Fixture

  # 10. 漏检样本回归(2026-07-28 事故):槽位仅一个空提交(零文件改动)+ 主树 dirty 的文件落在
  # 基线领先提交里。旧判据(三点 diff)只看槽位侧改动,算出空集并放行,而 git merge 以
  # 「Your local changes would be overwritten by merge」拒绝,Fantasy 侧却已合并成半完成状态。
  # 新判据(两点 diff)覆盖 merge 的整个触碰面,须在预检阶段就报 overlap。
  # 提交消息用纯 ASCII 无空格:G(经 Invoke-GitMerged)把参数串直接拼进 cmd /c,带中文或空格的 -m 会在该层被打散,
  # 提交因而没产生、槽位 0 ahead,预检报的就成了 nothing-to-merge——用例会测到别的东西上去。
  $F = New-Fixture
  G $F.slot "commit -q --allow-empty -m claim-placeholder" | Out-Null
  # 前置条件自证:槽位确有 1 个空提交。缺了这道,用例会在 nothing-to-merge 上假通过。
  $aheadN = "$((G $F.slot "rev-list --count main..HEAD")[0])".Trim()
  Assert-True ($aheadN -eq "1") "10a 前置:槽位有 1 个空提交(ahead=$aheadN)"
  Write-F $F.mainC "Demo\Assets\GameLogic\Bar.cs" "public class Bar {}`n" | Out-Null
  G $F.mainC "add -A" | Out-Null
  G $F.mainC "commit -q -m baseline-ahead" | Out-Null
  Write-F $F.mainC "Demo\Assets\GameLogic\Bar.cs" "public class Bar { int x; }`n" | Out-Null
  $r = Invoke-Precheck @{ Slot = $F.slot; RepoRoot = $F.mainC; FxRoot = $F.mainF }
  # 断言用 blocker 文案而非 "overlap":后者是 D 段标题词、恒在输出里,拿它做断言恒真。
  Assert-True ($r.code -eq 1 -and $r.out -match "inside the merge footprint") "10 槽位零改动 + 主树 dirty 落在基线领先提交 -> overlap blocker"
  Assert-True ($r.out -match '(?m)^BLOCKER-SEGMENTS: (\S+ )*D\s*$') "10b 段别行点名 D(同 2b,夹具的未跟踪 Fantasy 目录另报 B)"
  Remove-Fixture

  # 11. 主 Fantasy 行尾幻影脏(C 段须与 B 段同取内容视角):入库 blob 为 CRLF、.gitattributes 要求
  # eol=lf,工作树内容未动 —— status 恒判 M 而内容零差异(实发:协议重导后主 Fantasy 的 OuterMessage.cs,
  # 下一轮交付被判主树不净而停机)。幻影不拦,真改动照拦。
  $F = New-Fixture
  G $F.mainF "config core.autocrlf false" | Out-Null
  [System.IO.File]::WriteAllText((Join-Path $F.mainF "OuterMessage.cs"), "a`r`nb`r`n")
  G $F.mainF "add OuterMessage.cs" | Out-Null
  G $F.mainF "commit -q -m crlf-blob" | Out-Null
  Write-F $F.mainF ".gitattributes" "* text eol=lf`n"
  G $F.mainF "add .gitattributes" | Out-Null
  G $F.mainF "commit -q -m eol-attrs" | Out-Null
  (Get-Item (Join-Path $F.mainF "OuterMessage.cs")).LastWriteTime = (Get-Date).AddMinutes(1)
  $slotFx = Join-Path $F.slot $srvDir
  Write-F $slotFx "examples\Server\Svc.cs" "class Svc {}`n"
  G $slotFx "add -A" | Out-Null
  G $slotFx "commit -q -m feat-server" | Out-Null
  # 槽位 Fantasy worktree 带了提交后,git 把它当嵌套仓报成槽位客户端的未跟踪 `<服务端目录>/`;真客户端仓
  # 的 .gitignore 忽略它,夹具经公共 info/exclude 对齐(各 worktree 共用),免得 B 段误报掩盖 C 段断言。
  [System.IO.File]::AppendAllText((Join-Path $F.mainC ".git\info\exclude"), "`n/$srvDir/`n")
  Assert-True (@(G $F.mainF "status --porcelain" | Where-Object { $_ -match 'OuterMessage' }).Count -gt 0) "11a 前置:status 把行尾幻影判成脏"
  $r = Invoke-Precheck @{ Slot = $F.slot; RepoRoot = $F.mainC; FxRoot = $F.mainF }
  Assert-True ($r.code -eq 0 -and $r.out -notmatch "main Fantasy tree not clean") "11 主 Fantasy 行尾幻影不判脏 -> NO BLOCKERS"
  Write-F $F.mainF "examples\Server\Seed.cs" "changed`n"
  $r = Invoke-Precheck @{ Slot = $F.slot; RepoRoot = $F.mainC; FxRoot = $F.mainF }
  Assert-True ($r.code -eq 1 -and $r.out -match "main Fantasy tree not clean") "11b 主 Fantasy 真改动照拦"
  Assert-True ($r.out -match '(?m)^BLOCKER-SEGMENTS: C\s*$') "11c 段别行点名 C"
  Remove-Fixture
}
finally { Remove-Fixture; Remove-FixtureTree $srvDf }

Write-Host ""
Exit-TestSuite
