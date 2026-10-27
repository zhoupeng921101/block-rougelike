# 静态扫描测试.ps1 — 静态扫描.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 覆盖:干净夹具 PASS;R5 孤儿判定只认调用点(文档 / 注释提及不算、测试调用不算、套件以 $Suites 为准、
#   入口白名单放行);R8/R9 写入口按内容判(名带「检查」但有 git 写子命令 / 文件写的脚本进入视野,
#   只读 git 子命令与读文件不误判);R14 / R15 / R16 / R18 各锚一个正例与其豁免形态;-Root 不存在与脚本解析失败 INFRA;
#   扫描面不含 $Root 直属的 worktrees\(同一份副本换目录名照报)。
# 跑法:静态扫描测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 静态扫描.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
# PS 5.1 捕获被测子 powershell 输出按 [Console]::OutputEncoding 解码,不置 UTF-8 中文断言假失败。
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "静态扫描.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = $null

function Write-Bom([string]$Root, [string]$Rel, [string]$Text) {
  # 夹具脚本带 BOM:被测扫描器在 5.1 下 ParseFile,无 BOM 的中文字面量会按 ANSI 解码。
  $p = Join-Path $Root ($Rel -replace '/', '\')
  New-Item -ItemType Directory -Force -Path (Split-Path $p -Parent) | Out-Null
  [System.IO.File]::WriteAllText($p, $Text, (New-Object System.Text.UTF8Encoding($true)))
}

# 最小干净树:<fx>\devflow\{run_tests.ps1, test.bat, tests\a测试.ps1}。run_tests 由 test.bat 调用,
# a测试 登记在 $Suites,两者都有调用点;全部内容只读。
function New-Fixture {
  Remove-Fixture
  $script:fx = Join-Path $env:TEMP ("flowtest-scan-" + [Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $script:fx | Out-Null
  Write-Bom $script:fx "devflow\run_tests.ps1" "param([string]`$Suite = `"`")`n`$Suites = @(`n  `"a测试`"`n)`nforeach (`$s in `$Suites) { Write-Host `$s }`n"
  Write-F $script:fx "devflow\test.bat" "@echo off`r`npowershell.exe -NoProfile -File `"%~dp0run_tests.ps1`" %*`r`n"
  Write-Bom $script:fx "devflow\tests\a测试.ps1" "Write-Host ok`n"
  return $script:fx
}
function Invoke-Scan([string]$Root) {
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Target -Root $Root 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}
# 取某条规则段落(从 "Rn " 标题到下一个空行或下一条规则标题)里的文本,断言只看该段。
function Get-RuleBlock([string]$Out, [string]$Rule) {
  $m = [regex]::Match($Out, '(?ms)^' + [regex]::Escape($Rule) + ' .*?(?=^R\d+ |^\s*$|^STATIC SCAN)')
  if ($m.Success) { return $m.Value }
  return ""
}

Write-Host "== 静态扫描 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 干净夹具
  $fx = New-Fixture
  $r = Invoke-Scan $fx
  Assert-True ($r.code -eq 0 -and $r.out -match 'STATIC SCAN : clean') "T1 干净夹具 -> clean exit 0"

  # T2 R5:只被文档(台账 .md)与他人注释提及、无调用点 -> 孤儿
  $fx = New-Fixture
  Write-Bom $fx "devflow\孤儿样本核对.ps1" "Write-Host x`n"
  Write-F $fx "devflow\obligation-ledger.md" "| 义务 | 孤儿样本核对.ps1 负责 |`n"
  Write-Bom $fx "devflow\tests\a测试.ps1" "# 交付流程会调用 孤儿样本核对.ps1`nWrite-Host ok`n"
  $r = Invoke-Scan $fx
  Assert-True ($r.code -eq 1 -and (Get-RuleBlock $r.out 'R5') -match '孤儿样本核对\.ps1') "T2 仅文档/注释提及 -> R5 孤儿"

  # T3 R5:被另一生产脚本在代码里调用 -> 非孤儿
  $fx = New-Fixture
  Write-Bom $fx "devflow\被调用样本核对.ps1" "Write-Host x`n"
  Write-Bom $fx "devflow\run_tests.ps1" "param([string]`$Suite = `"`")`n`$Suites = @(`n  `"a测试`"`n)`n& (Join-Path `$PSScriptRoot `"被调用样本核对.ps1`")`n"
  $r = Invoke-Scan $fx
  Assert-True ($r.code -eq 0 -and $r.out -notmatch '被调用样本核对') "T3 代码调用点 -> 非孤儿,clean"

  # T4 R5:只被测试套件调用 -> 仍是孤儿(测试调用不是生产调用点)
  $fx = New-Fixture
  Write-Bom $fx "devflow\只测样本核对.ps1" "Write-Host x`n"
  Write-Bom $fx "devflow\tests\a测试.ps1" "& (Join-Path `$PSScriptRoot `"..\只测样本核对.ps1`")`n"
  $r = Invoke-Scan $fx
  Assert-True ($r.code -eq 1 -and (Get-RuleBlock $r.out 'R5') -match '只测样本核对\.ps1') "T4 仅测试调用 -> R5 孤儿"

  # T5 R5:tests 下套件未进 $Suites、只被文档提及 -> 孤儿
  $fx = New-Fixture
  Write-Bom $fx "devflow\tests\b测试.ps1" "Write-Host ok`n"
  Write-F $fx "devflow\README.md" "| tests/b测试.ps1 | 回归 |`n"
  $r = Invoke-Scan $fx
  Assert-True ($r.code -eq 1 -and (Get-RuleBlock $r.out 'R5') -match 'b测试\.ps1') "T5 套件未登记 `$Suites -> R5 孤儿"

  # T6 R5:显式入口白名单里的脚本即使无调用点也放行
  $fx = New-Fixture
  Write-Bom $fx "devflow\合并丢失核对.ps1" "Write-Host x`n"
  $r = Invoke-Scan $fx
  Assert-True ($r.code -eq 0 -and $r.out -notmatch '合并丢失核对') "T6 入口白名单 -> 非孤儿"

  # T7 R8/R9:名带「检查」但有 git 写子命令 -> 进写入口视野,缺 PositionalBinding 与 R9 登记均报
  $fx = New-Fixture
  Write-Bom $fx "devflow\提交样本检查.ps1" "param([string]`$Root)`ngit -C `$Root commit -q -m x`n"
  Write-Bom $fx "devflow\run_tests.ps1" "param([string]`$Suite = `"`")`n`$Suites = @(`n  `"a测试`"`n)`n& (Join-Path `$PSScriptRoot `"提交样本检查.ps1`")`n"
  $r = Invoke-Scan $fx
  Assert-True ($r.code -eq 1 -and (Get-RuleBlock $r.out 'R8') -match '提交样本检查\.ps1') "T7a 名带检查 + git commit -> R8"
  Assert-True ((Get-RuleBlock $r.out 'R9') -match '提交样本检查\.ps1') "T7b 同上 -> R9 未登记"

  # T8 R8:经 git 封装的写子命令(push)与文件写(WriteAllText)同样判写
  $fx = New-Fixture
  Write-Bom $fx "devflow\推送样本核对.ps1" "param([string]`$Root)`n`$null = Invoke-GitMerged `$Root `"push origin main`"`n"
  Write-Bom $fx "devflow\落盘样本校验.ps1" "param([string]`$P)`n[System.IO.File]::WriteAllText(`$P, 'x')`n"
  Write-Bom $fx "devflow\run_tests.ps1" "param([string]`$Suite = `"`")`n`$Suites = @(`n  `"a测试`"`n)`n& (Join-Path `$PSScriptRoot `"推送样本核对.ps1`")`n& (Join-Path `$PSScriptRoot `"落盘样本校验.ps1`")`n"
  $r = Invoke-Scan $fx
  $r8 = Get-RuleBlock $r.out 'R8'
  Assert-True ($r8 -match '推送样本核对\.ps1' -and $r8 -match '落盘样本校验\.ps1') "T8 封装 push / WriteAllText -> R8"

  # T9 只读脚本不误判:git 只读子命令(log / merge-base)、读文件、临时文件的建删、提示文案里的写入口名
  $fx = New-Fixture
  Write-Bom $fx "devflow\只读样本核对.ps1" ("param([string]`$Root)`ngit -C `$Root log --oneline -1`n`$null = Invoke-GitMerged `$Root `"merge-base a b`"`n" +
    "`$t = [System.IO.File]::ReadAllText(`$Root)`n`$tmp = Join-Path `$env:TEMP `"x.txt`"`n`$lst = Join-Path `$tmp `"y`"`n" +
    "foreach (`$f in @(`$tmp, `$lst)) { [System.IO.File]::Delete(`$f) }`nWrite-Host `"下一步请跑 单仓提交.ps1`"`n")
  Write-Bom $fx "devflow\run_tests.ps1" "param([string]`$Suite = `"`")`n`$Suites = @(`n  `"a测试`"`n)`n& (Join-Path `$PSScriptRoot `"只读样本核对.ps1`")`n"
  $r = Invoke-Scan $fx
  Assert-True ($r.code -eq 0 -and $r.out -notmatch '只读样本核对') "T9 只读 git / 读文件 -> 不进写入口,clean"

  # T10 INFRA:-Root 不存在
  $r = Invoke-Scan (Join-Path $env:TEMP ("flowtest-scan-none-" + [Guid]::NewGuid().ToString("N")))
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T10 -Root 不存在 -> INFRA exit 2"

  # T11 INFRA:扫描面内脚本解析失败
  $fx = New-Fixture
  Write-Bom $fx "devflow\坏样本.ps1" "function {`n"
  $r = Invoke-Scan $fx
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA - parse failed') "T11 解析失败 -> INFRA exit 2"

  # T12 R14:EAP=Stop 下 `& x 2>&1` 直调 -> 报;try 内 / 降 EAP 的函数内 / 非 Stop 脚本 -> 不报
  $fx = New-Fixture
  Write-Bom $fx "devflow\直调样本核对.ps1" @'
$ErrorActionPreference = "Stop"
$bad = & powershell.exe -NoProfile -File a.ps1 2>&1
try { $ok1 = & powershell.exe -NoProfile -File a.ps1 2>&1 } catch {}
function Invoke-Quiet { $ErrorActionPreference = "Continue"; $ok2 = & powershell.exe -NoProfile -File a.ps1 2>&1 }
$ok3 = cmd /c "powershell.exe -File a.ps1 2>&1"
'@
  Write-Bom $fx "devflow\宽松样本核对.ps1" "`$x = & powershell.exe -NoProfile -File a.ps1 2>&1`n"
  $r = Invoke-Scan $fx
  $b14 = Get-RuleBlock $r.out 'R14'
  Assert-True ($b14 -match '直调样本核对\.ps1:2\b' -and @([regex]::Matches($b14, '直调样本核对')).Count -eq 1 -and $b14 -notmatch '宽松样本') ("T12 R14 只报 Stop 脚本里裸直调的那一处:" + $b14)

  # T13 R15:逗号包裹返回的函数接管道 / 被 @() 包裹 -> 报;括号求值 / 直接赋值 / 普通函数 -> 不报
  $fx = New-Fixture
  Write-Bom $fx "devflow\包裹样本核对.ps1" @'
function Get-Wrapped { return , @("a", "b") }
function Get-Plain { return @("a", "b") }
$bad1 = Get-Wrapped | ForEach-Object { [string]$_ }
$bad2 = @(Get-Wrapped)
$ok1 = (Get-Wrapped) | ForEach-Object { [string]$_ }
$ok2 = Get-Wrapped
$ok3 = Get-Plain | ForEach-Object { $_ }
$ok4 = @(Get-Plain)
'@
  $r = Invoke-Scan $fx
  $b15 = Get-RuleBlock $r.out 'R15'
  Assert-True ($b15 -match '包裹样本核对\.ps1:3 +Get-Wrapped 直接接管道' -and $b15 -match '包裹样本核对\.ps1:4 +Get-Wrapped 被 @\(\) 包裹' -and $b15 -notmatch 'Get-Plain' -and @([regex]::Matches($b15, '包裹样本核对')).Count -eq 2) ("T13 R15 只报两处误用:" + $b15)

  # T14 R16:merge --abort 不经 Invoke-MergeAbort -> 报;出口函数内 / 提示文案里的「git merge --abort」-> 不报
  $fx = New-Fixture
  Write-Bom $fx "devflow\中止样本核对.ps1" @'
function Invoke-MergeAbort([string]$Repo) { return (Invoke-GitMerged $Repo "merge --abort") }
$x = Invoke-GitMerged "C:\r" "merge --abort"
Write-Host "人工 git merge --abort 后重跑"
'@
  $r = Invoke-Scan $fx
  $b16 = Get-RuleBlock $r.out 'R16'
  Assert-True ($b16 -match '中止样本核对\.ps1:2\b' -and @([regex]::Matches($b16, '中止样本核对')).Count -eq 1) ("T14 R16 只报出口外的裸 abort:" + $b16)

  # T15 R17:脚本索引表格行超长 -> 报;分隔行、表外段落、上限内的行 -> 不报
  $fx = New-Fixture
  $longCell = "长" * 330
  Write-Bom $fx "devflow\README.md" ("# 索引`n`n" + $longCell + "`n`n| 脚本 | 职责 |`n|---|---|`n| a.ps1 | 短 |`n| b.ps1 | " + $longCell + " |`n")
  $r = Invoke-Scan $fx
  $b17 = Get-RuleBlock $r.out 'R17'
  Assert-True ($b17 -match 'devflow\\README\.md:8 ' -and @([regex]::Matches($b17, 'README\.md:')).Count -eq 1) ("T15 R17 只报表格里的超长行:" + $b17)

  # T16 R18:产品脚本直读 $env:LOCALAPPDATA(大小写不敏感)-> 报;出口函数内 / 注释 / 豁免文件 / tests 下 -> 不报
  $fx = New-Fixture
  Write-Bom $fx "devflow\hooks\路径样本库.ps1" @'
function Resolve-WfStatePath([string]$Rel, [string]$Lad = $env:LOCALAPPDATA) { return (Join-Path $Lad $Rel) }
$bad = Join-Path $env:localappdata "claude-wf-3b\board.json"
# 注释里写 $env:LOCALAPPDATA 不算
$ok = Resolve-WfStatePath "claude-wf-3b"
'@
  Write-Bom $fx "devflow\run_tests.ps1" "param([string]`$Suite = `"`")`n`$Suites = @(`n  `"a测试`"`n)`n`$real = `$env:LOCALAPPDATA`n"
  Write-Bom $fx "devflow\tests\a测试.ps1" "`$env:LOCALAPPDATA = 'x'`nWrite-Host ok`n"
  $r = Invoke-Scan $fx
  $b18 = Get-RuleBlock $r.out 'R18'
  Assert-True ($b18 -match '路径样本库\.ps1:2\b' -and @([regex]::Matches($b18, '\.ps1:')).Count -eq 1) ("T16 R18 只报出口外的直读:" + $b18)

  # T17 扫描面:$Root 直属 worktrees\ 下的整仓副本(重复定义 + 区域敏感比较 + 孤儿脚本 + .bat)不进扫描面;
  #   同一份副本换个目录名照报 -> 证明放行的是目录口径,不是夹具本身无害
  $dupFn = "function Get-CopySample([string]`$A) { if (`$A) { return (`$A + `"-x`") }; return `"none`" }`n"
  $mainRt = "param([string]`$Suite = `"`")`n`$Suites = @(`n  `"a测试`"`n)`n" + $dupFn
  foreach ($case in @(@{ Dir = "othertrees"; Clean = $false }, @{ Dir = "worktrees"; Clean = $true })) {
    $fx = New-Fixture
    Write-Bom $fx "devflow\run_tests.ps1" $mainRt
    $copy = $case.Dir + "\x\Demo\.claude\devflow"
    Write-Bom $fx ($copy + "\run_tests.ps1") $mainRt
    Write-Bom $fx ($copy + "\副本样本核对.ps1") "`$i = 'a/b'.IndexOf('/')`n"
    Write-F $fx ($copy + "\副本.bat") "@echo off`r`n"
    $r = Invoke-Scan $fx
    if ($case.Clean) {
      Assert-True ($r.code -eq 0 -and $r.out -match 'STATIC SCAN : clean \(1 functions, 2 files\)' -and $r.out -notmatch 'worktrees') ("T17b worktrees\ 下的副本 -> 不进扫描面,clean:" + $r.out)
    }
    else {
      Assert-True ($r.code -eq 1 -and (Get-RuleBlock $r.out 'R2') -match 'Get-CopySample' -and (Get-RuleBlock $r.out 'R3') -match '副本样本核对\.ps1:1\b') ("T17a 同一份副本在别的目录名下 -> 照报 R2 / R3:" + $r.out)
    }
  }
}
finally {
  Remove-Fixture
}
Exit-TestSuite
