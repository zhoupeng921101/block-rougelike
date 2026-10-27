# 提交前绑定核对测试.ps1 — git 提交前钩子(hooks\提交前绑定核对.ps1)与其安装脚本(提交钩子安装.ps1)的契约测试。
# 夹具 = %TEMP% 下的假仓,自造最小 _Gen.g.cs / impl / prefab,不读真工程、不碰真仓的钩子目录。
# 钩子体两种驱动:直调(cwd = 假仓根,索引即假仓的默认索引)覆盖判据分支;装上垫片后真跑 git commit 覆盖
# 「git -> sh 垫片 -> powershell -> 钩子体」整条链(含垫片里的中文路径)。
# 承重用例:
#   H4 / H5 — 判的是索引不是工作树。H4:_Gen 加了字段并进了提交,绑好的 prefab 只在工作树里 -> 仍拦;
#             H5:工作树里的 prefab 是坏的但没进提交 -> 不拦。改成扫工作树,这两条同时翻。
#   H6 / H7 — 槽位与合并收尾不拦。删掉任一条跳过,槽位交付 的提交或 main 上的合并收尾会被钩子打断。
#   I5      — 不覆盖别处写的钩子。
# 放行类用例一律同时断言输出里没有 WARN:钩子体出错也是退出码 0,只看退出码分不清「判了放行」与「没跑成」。
# 护栏遥测(读隔离 LOCALAPPDATA,按 JSON 解析):扫描给出结论(H1 放行 / H2 拒)记 guard-ok,没跑成放行(H8)记
#   degraded(guard precommit-uibind / key precommit-uibind-error),跳过的(H3 / H6 / H7)两样都不记。
#   入账函数缺失不改判决:载不进 校验库 照打 WARN 放行(H8c);库里缺 Write-GuardOk 时拒照拒、放行照放行(H8d / H8e)。
# 跑法:提交前绑定核对测试.ps1 [-Target <钩子体路径>] [-Installer <安装脚本路径>]
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = "",
  [string]$Installer = ""
)
$ErrorActionPreference = "Stop"
# LOCALAPPDATA 隔离须早于载入 hook函数库(经夹具库)与任何子进程:钩子体每次判决都记一条遥测,不隔离就写进真 claude-wf-3b。
$script:OldLad = $env:LOCALAPPDATA
$script:LadDir = Join-Path $env:TEMP ("flowtest-precommit-lad-" + [Guid]::NewGuid().ToString("N"))
$env:LOCALAPPDATA = $script:LadDir
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "hooks\提交前绑定核对.ps1" }
if (-not $Installer) { $Installer = Join-Path $dfDir "提交钩子安装.ps1" }
foreach ($need in @($Target, $Installer)) {
  if (-not (Test-Path $need)) { Write-Host "INFRA: target not found: $need"; exit 2 }
}

$script:UiRel     = "Demo/Assets/GameScripts/HotFix/GameLogic/UI"
$script:PrefabRel = "Demo/Assets/AssetRaw/UI/Prefabs/UIFooPanel.prefab"
$script:WinGuid   = "0123456789abcdef0123456789abcdef"

function Get-GenSource([string[]]$Fields) {
  $body = ($Fields | ForEach-Object { "`t[SerializeField] private Button " + $_ + " = null!;" }) -join "`n"
  return ("public partial class UIFooPanel : UIPanelMono`n{`n" + $body + "`n}`n")
}

# $Bound = 字段名 -> fileID;每个字段同时落一个同名节点。fileID 给 "0" 即未绑定。
function Get-PrefabSource([hashtable]$Bound) {
  $text = "%YAML 1.1`n"
  $n = 100
  foreach ($k in ($Bound.Keys | Sort-Object)) { $n++; $text += ("--- !u!1 &" + $n + "`nGameObject:`n  m_Name: " + $k + "`n") }
  $text += ("--- !u!114 &900`nMonoBehaviour:`n  m_Script: {fileID: 11500000, guid: " + $script:WinGuid + ", type: 3}`n")
  foreach ($k in ($Bound.Keys | Sort-Object)) { $text += ("  " + $k + ": {fileID: " + $Bound[$k] + "}`n") }
  return $text
}

# 一个绑定完整的假仓:窗 UIFooPanel 一个字段 m_btn_A,已绑。$Leaf 决定仓根目录名(槽位判定看它)。
function New-Fixture([string]$Leaf = "repo") {
  Remove-Fixture
  $script:fx = Join-Path $env:TEMP ("flowtest-precommit-" + [Guid]::NewGuid().ToString("N"))
  $repo = Join-Path $script:fx $Leaf
  New-GitRepo $repo
  G $repo "config core.autocrlf false" | Out-Null
  Write-F $repo ($script:UiRel + "/Gen/UIFooPanel_Gen.g.cs") (Get-GenSource @("m_btn_A"))
  Write-F $repo ($script:UiRel + "/UIFooPanel.cs") "[Window(UILayer.Window, location : `"UIFooPanel`")]`npublic partial class UIFooPanel { }`n"
  Write-F $repo ($script:UiRel + "/UIFooPanel.cs.meta") ("fileFormatVersion: 2`nguid: " + $script:WinGuid + "`n")
  Write-F $repo $script:PrefabRel (Get-PrefabSource @{ m_btn_A = "101" })
  Write-F $repo "docs/note.txt" "n`n"
  G $repo "add -A" | Out-Null
  G $repo "commit -q -m base" | Out-Null
  return $repo
}

# 直调钩子体:cwd = 仓根,与 git 调钩子时一致。guard = 这一次新增的护栏行(precommit-uibind 的 guard-ok / degraded;
# 遥测读取 = 夹具库 Get-TelRows,按 JSON 解析)。
function Invoke-HookBody([string]$Repo, [string]$Script = $Target) {
  $ErrorActionPreference = "Continue"
  $n0 = @(Get-TelRows).Count
  Push-Location $Repo
  try {
    $lines = @(& (Get-FlowEngine) -NoProfile -File $Script 2>&1 | ForEach-Object { [string]$_ })
    $code = $LASTEXITCODE
  } finally { Pop-Location }
  $guard = @(Get-TelRows | Select-Object -Skip $n0 | Where-Object { $_.guard -eq "precommit-uibind" })
  return @{ code = $code; out = ($lines -join "`n"); guard = $guard }
}

# 「库比钩子体旧」的驱动形态(H8d / H8e):钩子体副本 + 校验库 桩(先点源被测钩子体旁的真 校验库,再删掉
# 护栏入账函数 Write-GuardOk)+ UI绑定核对 副本(钩子体按自身位置的上一级找它)。落在当前 $script:fx 下,回副本钩子体路径。
function New-OldLibHook {
  $hookDir = Split-Path $Target -Parent
  $root = Join-Path $script:fx "oldlib"
  New-Item -ItemType Directory -Force -Path (Join-Path $root "hooks") | Out-Null
  Copy-Item -LiteralPath $Target -Destination (Join-Path $root "hooks")
  Copy-Item -LiteralPath (Join-Path (Split-Path $hookDir -Parent) "UI绑定核对.ps1") -Destination $root
  $realLib = (Join-Path $hookDir "校验库.ps1") -replace "'", "''"
  $stub = ". '" + $realLib + "'`r`nRemove-Item -LiteralPath Function:\Write-GuardOk`r`n"
  # 桩里有中文路径字面量:须 UTF-8 BOM,否则 5.1 按 ANSI 解码、点源路径打乱。
  [System.IO.File]::WriteAllText((Join-Path $root "hooks\校验库.ps1"), $stub, (New-Object System.Text.UTF8Encoding($true)))
  return (Join-Path $root ("hooks\" + [System.IO.Path]::GetFileName($Target)))
}

function Invoke-Installer([string]$Repo, [string[]]$Extra = @()) {
  $ErrorActionPreference = "Continue"
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Installer -RepoDir $Repo @Extra 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}

# 钩子体起过几次:它每次判决(放行 / 跳过 / 拒绝 / 出错)都留一条 event=提交前绑定核对,垫片快路径放行的不留。
# 只数这个事件:同一来源的护栏行(guard-ok / degraded,src 同名)不算判决。遥测落隔离的 LOCALAPPDATA。
function Get-BodyRunCount { return @(Get-TelRows | Where-Object { $_.event -eq "提交前绑定核对" }).Count }

function Get-ScratchCount { return @(Get-ChildItem -Path $env:TEMP -Filter "flow-precommit-uibind-*" -ErrorAction SilentlyContinue).Count }

try {
  $scratchBefore = Get-ScratchCount

  # ---------------- 钩子体 ----------------
  $repo = New-Fixture
  Write-F $repo ($script:UiRel + "/UIFooPanel.cs") "[Window(UILayer.Window, location : `"UIFooPanel`")]`npublic partial class UIFooPanel { /* x */ }`n"
  G $repo "add -A" | Out-Null
  $r = Invoke-HookBody $repo
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'WARN') "H1 碰读取面、绑定完整 -> 放行"
  Assert-True ($r.guard.Count -eq 1 -and $r.guard[0].event -eq "guard-ok" -and $r.guard[0].src -eq "提交前绑定核对") ("H1b 扫描判了放行 -> 记一行 guard-ok(来源 提交前绑定核对),实得 " + $r.guard.Count + " 行")

  $repo = New-Fixture
  Write-F $repo $script:PrefabRel (Get-PrefabSource @{ m_btn_A = "0" })
  G $repo "add -A" | Out-Null
  $r = Invoke-HookBody $repo
  Assert-True ($r.code -eq 1 -and $r.out -match 'UNBOUND' -and $r.out -match 'm_btn_A') "H2 prefab 把字段解绑并进了提交 -> 拦,点名字段"
  Assert-True ($r.out -match 'no-verify') "H2b 拦下时给出单次绕过的写法"
  Assert-True ($r.guard.Count -eq 1 -and $r.guard[0].event -eq "guard-ok") ("H2c 扫描判了拒 -> 同样记 guard-ok(护栏跑成了),实得 " + $r.guard.Count + " 行")

  # 违规已在 HEAD 里(钩子装上之前留下的),本次提交不碰读取面 -> 不拦:不拿存量挡无关提交。
  G $repo "commit -q -m broken" | Out-Null
  Write-F $repo "docs/note.txt" "n2`n"
  G $repo "add -A" | Out-Null
  $r = Invoke-HookBody $repo
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'WARN') "H3 存量违规在、本次提交没碰读取面 -> 放行"
  Assert-True ($r.guard.Count -eq 0) ("H3b 没碰读取面(跳过,走不到扫描)-> guard-ok / degraded 都不记,实得 " + $r.guard.Count + " 行")

  $repo = New-Fixture
  Write-F $repo ($script:UiRel + "/Gen/UIFooPanel_Gen.g.cs") (Get-GenSource @("m_btn_A", "m_btn_B"))
  G $repo ("add -- `"" + $script:UiRel + "/Gen/UIFooPanel_Gen.g.cs`"") | Out-Null
  Write-F $repo $script:PrefabRel (Get-PrefabSource @{ m_btn_A = "101"; m_btn_B = "102" })   # 只在工作树,未 add
  $r = Invoke-HookBody $repo
  Assert-True ($r.code -eq 1 -and $r.out -match 'm_btn_B') "H4 _Gen 加字段进了提交、绑好的 prefab 只在工作树 -> 仍拦(判索引)"

  $repo = New-Fixture
  Write-F $repo $script:PrefabRel (Get-PrefabSource @{ m_btn_A = "0" })                      # 坏的只在工作树,未 add
  Write-F $repo ($script:UiRel + "/UIFooPanel.cs") "[Window(UILayer.Window, location : `"UIFooPanel`")]`npublic partial class UIFooPanel { /* y */ }`n"
  G $repo ("add -- `"" + $script:UiRel + "/UIFooPanel.cs`"") | Out-Null
  $r = Invoke-HookBody $repo
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'WARN') "H5 工作树里的 prefab 是坏的但没进提交 -> 放行(判索引)"

  $repo = New-Fixture "proj-dev1"
  Write-F $repo $script:PrefabRel (Get-PrefabSource @{ m_btn_A = "0" })
  G $repo "add -A" | Out-Null
  $r = Invoke-HookBody $repo
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'WARN') "H6 槽位工作树(仓根名命中 SlotRootRe)-> 不拦"
  Assert-True ($r.guard.Count -eq 0) "H6b 槽位跳过 -> 护栏行两样都不记"

  $repo = New-Fixture
  Write-F $repo $script:PrefabRel (Get-PrefabSource @{ m_btn_A = "0" })
  G $repo "add -A" | Out-Null
  $headSha = (G $repo "rev-parse HEAD")[0].Trim()
  Write-F $repo ".git/MERGE_HEAD" ($headSha + "`n")
  $r = Invoke-HookBody $repo
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'WARN') "H7 合并收尾提交(MERGE_HEAD 在)-> 不拦"
  Assert-True ($r.guard.Count -eq 0) "H7b 合并收尾跳过 -> 护栏行两样都不记"

  # 扫描自己跑不成(索引里没有 UI 源码目录 -> UI绑定核对 报 INFRA)-> 打 WARN 放行,不拿检查的故障挡提交。
  Remove-Fixture
  $script:fx = Join-Path $env:TEMP ("flowtest-precommit-" + [Guid]::NewGuid().ToString("N"))
  $repo = Join-Path $script:fx "repo"
  New-GitRepo $repo
  Write-F $repo $script:PrefabRel (Get-PrefabSource @{ m_btn_A = "0" })
  G $repo "add -A" | Out-Null
  $r = Invoke-HookBody $repo
  Assert-True ($r.code -eq 0 -and $r.out -match '(?m)^WARN 提交前 UI 绑定核对没跑成,本次提交不拦:UI绑定核对 未能给出结论') "H8 扫描报 INFRA -> WARN 放行(文案原样)"
  $g8 = @($r.guard)
  Assert-True ($g8.Count -eq 1 -and $g8[0].event -eq "degraded" -and $g8[0].key -eq "precommit-uibind-error" -and $g8[0].src -eq "提交前绑定核对" -and $g8[0].detail -match '^UI绑定核对 未能给出结论') ("H8b 没跑成放行 -> 记一行 degraded(guard precommit-uibind),不记 guard-ok | " + $(if ($g8.Count) { $g8[0].event + " " + $g8[0].detail } else { "无" }))

  # 降级入账本身失败不得改判:钩子体旁边没有 校验库(Write-Degraded / Write-Telemetry 都不在)时照打原 WARN 放行。
  $noLib = Join-Path $script:fx "nolib\hooks"
  New-Item -ItemType Directory -Force -Path $noLib | Out-Null
  Copy-Item -LiteralPath $Target -Destination $noLib
  $r = Invoke-HookBody $repo (Join-Path $noLib ([System.IO.Path]::GetFileName($Target)))
  Assert-True ($r.code -eq 0 -and $r.out -match '(?m)^WARN 提交前 UI 绑定核对没跑成,本次提交不拦:' -and $r.guard.Count -eq 0) ("H8c 载不进 校验库(入账函数都不在)-> 照打原 WARN、exit 0 放行 | exit " + $r.code)

  # 库比钩子体旧(护栏入账函数 Write-GuardOk 还不在)时判决照旧:入账那一调用抛错不得落进外层「没跑成」放行。
  # H8d 承重:入账调用不包住时,本该拒的提交在这里被放行。
  $repo = New-Fixture
  Write-F $repo $script:PrefabRel (Get-PrefabSource @{ m_btn_A = "0" })
  G $repo "add -A" | Out-Null
  $r = Invoke-HookBody $repo (New-OldLibHook)
  Assert-True ($r.code -eq 1 -and $r.out -match 'UNBOUND' -and $r.out -match 'm_btn_A' -and $r.out -notmatch 'WARN' -and $r.guard.Count -eq 0) ("H8d 库里没有 Write-GuardOk、扫描判拒 -> 照拒(exit 1、不打 WARN),护栏行不记 | exit " + $r.code)

  $repo = New-Fixture
  Write-F $repo ($script:UiRel + "/UIFooPanel.cs") "[Window(UILayer.Window, location : `"UIFooPanel`")]`npublic partial class UIFooPanel { /* z */ }`n"
  G $repo "add -A" | Out-Null
  $r = Invoke-HookBody $repo (New-OldLibHook)
  Assert-True ($r.code -eq 0 -and $r.out -notmatch 'WARN' -and $r.guard.Count -eq 0) ("H8e 库里没有 Write-GuardOk、扫描判放行 -> 照放行、不打 WARN,护栏行不记 | exit " + $r.code)

  # H10 底座层 GameBase/UI 同在读取面:只改了底座层的窗、prefab 未绑 -> 照拦
  $repo = New-Fixture
  $baseUi = $script:UiRel -replace '/GameLogic/', '/GameBase/'
  $baseGuid = "fedcba9876543210fedcba9876543210"
  Write-F $repo ($baseUi + "/Gen/UIBasePanel_Gen.g.cs") ((Get-GenSource @("m_btn_A")) -replace 'UIFooPanel', 'UIBasePanel')
  Write-F $repo ($baseUi + "/UIBasePanel.cs") "public partial class UIBasePanel { }`n"
  Write-F $repo ($baseUi + "/UIBasePanel.cs.meta") ("fileFormatVersion: 2`nguid: " + $baseGuid + "`n")
  Write-F $repo "Demo/Assets/AssetRaw/UI/Prefabs/UIBasePanel.prefab" ((Get-PrefabSource @{ m_btn_A = "0" }) -replace $script:WinGuid, $baseGuid)
  G $repo "add -A" | Out-Null
  $r = Invoke-HookBody $repo
  Assert-True ($r.code -eq 1 -and $r.out -match 'UIBasePanel\.prefab' -and $r.out -match 'UNBOUND') ("H10 底座层窗未绑并进提交 -> 拦 | exit " + $r.code)

  Assert-True ((Get-ScratchCount) -eq $scratchBefore) "H9 临时导出目录全部收掉"

  # ---------------- 安装脚本 ----------------
  $repo = New-Fixture
  $hookFile = Join-Path $repo ".git\hooks\pre-commit"
  $r = Invoke-Installer $repo @("-CheckOnly")
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: CHECK-NOT-INSTALLED' -and -not (Test-Path $hookFile)) "I1 -CheckOnly 未装:只报现状,零写入"

  $r = Invoke-Installer $repo
  $bytes = if (Test-Path $hookFile) { [System.IO.File]::ReadAllBytes($hookFile) } else { [byte[]]@() }
  $shebangOk = ($bytes.Length -gt 2 -and $bytes[0] -eq 0x23 -and $bytes[1] -eq 0x21)   # "#!":首字节不是 BOM
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: INSTALLED' -and $shebangOk -and ($bytes -notcontains 13)) "I2 装上:垫片以 #! 开头、无 BOM、无 CR"

  $r = Invoke-Installer $repo
  Assert-True ($r.code -eq 0 -and $r.out -match 'VERDICT: UP-TO-DATE') "I3 重跑:已是当前版本,不重写"

  # 整条链:git commit -> sh 垫片 -> 钩子体。
  # E0 / E3 是一对:没碰读取面时垫片自己放行、不起钩子体;垫片取不到正则时不许自己放行,得交给钩子体。
  # 把 E3 的回落删掉,垫片读不到登记的那天所有提交都不再核对,而且没有任何报错。
  $runs = Get-BodyRunCount
  Write-F $repo "docs/note.txt" "fast`n"
  G $repo "add -A" | Out-Null
  $c = Invoke-GitMerged $repo "commit -q -m offsurface"
  Assert-True ($c.code -eq 0 -and (Get-BodyRunCount) -eq $runs) "E0 真提交:没碰读取面 -> 垫片快路径放行,不起钩子体"

  $before = (G $repo "rev-parse HEAD")[0].Trim()
  $runs = Get-BodyRunCount
  Write-F $repo $script:PrefabRel (Get-PrefabSource @{ m_btn_A = "0" })
  G $repo "add -A" | Out-Null
  $c = Invoke-GitMerged $repo "commit -q -m broken"
  $after = (G $repo "rev-parse HEAD")[0].Trim()
  Assert-True ($c.code -ne 0 -and $after -eq $before -and (($c.lines -join "`n") -match 'UNBOUND') -and (Get-BodyRunCount) -gt $runs) "E1 真提交:违规 -> 提交失败、HEAD 不动、明细打出"
  Write-F $repo $script:PrefabRel (Get-PrefabSource @{ m_btn_A = "101" })
  Write-F $repo "docs/note.txt" "n3`n"
  G $repo "add -A" | Out-Null
  $c = Invoke-GitMerged $repo "commit -q -m fixed"
  $after = (G $repo "rev-parse HEAD")[0].Trim()
  Assert-True ($c.code -eq 0 -and $after -ne $before) "E2 真提交:改好后 -> 提交成功"

  $ours = [System.IO.File]::ReadAllText($hookFile)
  [System.IO.File]::WriteAllText($hookFile, $ours.Replace("校验库.ps1", "no-such-lib.ps1"), (New-Object System.Text.UTF8Encoding($false)))
  $runs = Get-BodyRunCount
  Write-F $repo "docs/note.txt" "fallback`n"
  G $repo "add -A" | Out-Null
  $c = Invoke-GitMerged $repo "commit -q -m nolib"
  Assert-True ($c.code -eq 0 -and (Get-BodyRunCount) -gt $runs) "E3 真提交:垫片取不到读取面正则 -> 交给钩子体判(照样放行),不自己跳过"
  [System.IO.File]::WriteAllText($hookFile, $ours, (New-Object System.Text.UTF8Encoding($false)))

  [System.IO.File]::WriteAllText($hookFile, $ours.Replace("提交前绑定核对.ps1", "moved-away.ps1"), (New-Object System.Text.UTF8Encoding($false)))
  $r = Invoke-Installer $repo @("-CheckOnly")
  $r2 = Invoke-Installer $repo
  Assert-True ($r.out -match 'VERDICT: CHECK-OUTDATED' -and $r2.out -match 'VERDICT: UPDATED' -and ([System.IO.File]::ReadAllText($hookFile) -ceq $ours)) "I4 带标记的旧垫片:-CheckOnly 报过期,重跑更新回当前内容"

  $foreign = "#!/bin/sh`necho someone-else`n"
  [System.IO.File]::WriteAllText($hookFile, $foreign, (New-Object System.Text.UTF8Encoding($false)))
  $r = Invoke-Installer $repo
  $r2 = Invoke-Installer $repo @("-Remove")
  Assert-True ($r.code -eq 1 -and $r.out -match 'VERDICT: DENIED-foreign-hook' -and $r2.code -eq 1 -and ([System.IO.File]::ReadAllText($hookFile) -ceq $foreign)) "I5 别处写的钩子:装与卸都拒,原样保留"

  [System.IO.File]::WriteAllText($hookFile, $ours, (New-Object System.Text.UTF8Encoding($false)))
  $r = Invoke-Installer $repo @("-Remove")
  $r2 = Invoke-Installer $repo @("-Remove")
  Assert-True ($r.out -match 'VERDICT: REMOVED' -and -not (Test-Path $hookFile) -and $r2.out -match 'VERDICT: NOT-INSTALLED') "I6 -Remove:卸掉自己装的;再卸报本就没有"
} finally {
  Remove-Fixture
  $env:LOCALAPPDATA = $script:OldLad
  Remove-FixtureTree $script:LadDir
}
Exit-TestSuite
