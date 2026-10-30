# 提交检查测试.ps1 — 提交检查 hook(PreToolUse:Bash/PowerShell 拦 git commit/push/merge)
# 的命令面演练矩阵。经 hook演练.ps1 按 harness 方式(stdin JSON、同引擎)喂伪造输入,断言
# allow/deny。
#
# 本 hook 要跑 rev-parse / diff --cached / diff HEAD,所以必须有真 git 夹具仓。夹具仓按**仓形**
# 被判通道,不必注入配置:leaf 等于 ServerDirName 即服务端,其余即客户端。
#
# 隔离:$env:LOCALAPPDATA 指到夹具内,故 hook 子进程的批准标记与遥测都落夹具、不碰真
# claude-wf-3b(hook函数库 WfStateRoot 由该环境变量派生)。
#
# 判据:deny = stdout 出现 permissionDecision:"deny"(hook 协议:deny 靠 JSON,退出码恒 0);
# allow = 无该决定。deny 原因经 permissionDecisionReason 区分——ConvertTo-Json 把中文转义成
# \uXXXX,故断言前先解码(Expand-JsonUnicode)。
[CmdletBinding(PositionalBinding=$false)]
param()
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
$drill = Join-Path $dfDir "hooks\hook演练.ps1"

$fx = Join-Path $env:TEMP ("flowtest-commitgate-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $fx | Out-Null
$script:fx = $fx

# 隔离必须早于任何 hook 子进程调用:遥测跟随本变量。
$env:LOCALAPPDATA = Join-Path $fx "lad"

function Expand-JsonUnicode([string]$S) {
  # ConvertTo-Json 把非 ASCII 转义为 \uXXXX;还原后断言才能直接写中文。
  return [regex]::Replace($S, '\\u([0-9a-fA-F]{4})', {
    param($m) [string][char][Convert]::ToInt32($m.Groups[1].Value, 16)
  })
}

function New-GatePayload([string]$Command, [string]$Cwd) {
  $ti = @{ command = $Command }
  $payload = @{ session_id = "drill"; tool_name = "PowerShell"; cwd = $Cwd; tool_input = $ti }
  return ($payload | ConvertTo-Json -Depth 4 -Compress)
}
function Invoke-PayloadDrill([string]$Name, [string]$Payload) {
  $j = Join-Path $fx ($Name + ".json")
  [System.IO.File]::WriteAllText($j, $Payload, (New-Object System.Text.UTF8Encoding($false)))
  $out = @(& (Get-FlowEngine) -NoProfile -File $drill -Hook "提交检查" -Json $j 2>&1 | ForEach-Object { [string]$_ })
  return (Expand-JsonUnicode ($out -join "`n"))
}
function Invoke-GateDrill([string]$Name, [string]$Command, [string]$Cwd) {
  return (Invoke-PayloadDrill $Name (New-GatePayload $Command $Cwd))
}
# ---------- 夹具 ----------
# 客户端形态:leaf 非 Fantasy。
$mainRepo = Join-Path $fx "MainRepo"
New-GitRepo $mainRepo
Write-F $mainRepo ".gitignore" ".gate/`n"
G $mainRepo "add -A" | Out-Null
G $mainRepo "commit -q -m ignore" | Out-Null

# 服务端形态:leaf 等于 flow-config ServerDirName。
$srvRepo = Join-Path $fx "Fantasy"
New-GitRepo $srvRepo
Write-F $srvRepo ".gitignore" ".gate/`n"
G $srvRepo "add -A" | Out-Null
G $srvRepo "commit -q -m ignore" | Out-Null

function Stage([string]$Root, [string]$Rel, [string]$Text) {
  Write-F $Root $Rel $Text
  G $Root ("add -- `"" + $Rel + "`"") | Out-Null
}
function Unstage([string]$Root) { G $Root "reset -q" | Out-Null }

$qm = '"' + $mainRepo + '"'
$qv = '"' + $srvRepo + '"'

Write-Host "== 提交检查 演练矩阵 =="
try {
  # ---------- C1 表源改动无字段说明 -> deny ----------
  Stage $mainRepo "Configs/GameConfig/Datas/tbdemo.xlsx" "x"
  $o = Invoke-GateDrill "c1" ("git -C " + $qm + " commit -m `"data: demo table`"") $mainRepo
  Assert-True (Test-Denied $o) "C1 表源无说明文档 -> deny"
  Assert-True ($o -match '表文档同步' -and $o -match 'tbdemo\.xlsx') "C1 拒因是表文档且点名 xlsx"

  # ---------- C2 表源 + 说明文档同改 -> 放行到后续检查 ----------
  Stage $mainRepo "Configs/GameConfig/Datas/配置表说明.md" "field notes`n"
  $o = Invoke-GateDrill "c2" ("git -C " + $qm + " commit -m `"data: demo table with doc`"") $mainRepo
  Assert-True (-not (Test-Denied $o)) "C2 表源+说明文档 -> allow"

  # ---------- C3 逃生口:提交信息标注「表文档无关」 ----------
  Unstage $mainRepo
  Stage $mainRepo "Configs/GameConfig/Datas/tbdemo.xlsx" "xy"
  $o = Invoke-GateDrill "c3" ("git -C " + $qm + " commit -m `"data: restyle [表文档无关:仅列宽]`"") $mainRepo
  Assert-True (-not (Test-Denied $o)) "C3 表文档无关标注 -> allow"

  # ---------- C4 说明文档转述表数据 -> deny ----------
  Unstage $mainRepo
  Stage $mainRepo "Configs/GameConfig/Datas/配置表说明.md" "field notes`n`n| 10006 | 占卜之心 | 600 |`n"
  $o = Invoke-GateDrill "c4" ("git -C " + $qm + " commit -m `"docs: 现行数据`"") $mainRepo
  Assert-True (Test-Denied $o) "C4 说明文档新增数据行 -> deny"
  Assert-True ($o -match '表数据转述探测') "C4 拒因是表数据转述"

  # ---------- C4b 逃生口:提交信息标注「数据快照」 ----------
  $o = Invoke-GateDrill "c4b" ("git -C " + $qm + " commit -m `"docs: 固化一份 [数据快照:排障基线]`"") $mainRepo
  Assert-True (-not (Test-Denied $o)) "C4b 数据快照标注 -> allow"

  # ---------- C4c 指路行与字段说明行不误报(首列非纯数字 id) ----------
  Unstage $mainRepo
  Stage $mainRepo "Configs/GameConfig/Datas/配置表说明.md" "> 现行配置直接看 demo.xlsx`n`n| level | int | 账号等级 |`n| 1 | 一档 |`n"
  $o = Invoke-GateDrill "c4c" ("git -C " + $qm + " commit -m `"docs: 指路与字段表`"") $mainRepo
  Assert-True (-not (Test-Denied $o)) "C4c 指路行/字段表/短枚举值 -> allow"

  # ---------- C5 普通文档提交 -> allow ----------
  Unstage $mainRepo
  Stage $mainRepo "docs/note.md" "note`n"
  $o = Invoke-GateDrill "c5" ("git -C " + $qm + " commit -m `"docs: note`"") $mainRepo
  Assert-True (-not (Test-Denied $o)) "C5 普通文档 -> allow"

  # ---------- C6 add 与 commit 同命令 -> deny ----------
  $o = Invoke-GateDrill "c6" ("git -C " + $qm + " add -A; git -C " + $qm + " commit -m `"x`"") $mainRepo
  Assert-True (Test-Denied $o) "C6 add+commit 同命令 -> deny"

  # ---------- C7 非 git 命令 -> 不干预 ----------
  $o = Invoke-GateDrill "c7" "Get-ChildItem -Path ." $mainRepo
  Assert-True (-not (Test-Denied $o)) "C7 非 git 命令 -> allow"
  Unstage $mainRepo

  # ---------- B4 run_tests -Suite 单套件不触发全量确认(覆盖 ask 段豁免) ----------
  $o = Invoke-GateDrill "b4" "& powershell.exe -NoProfile -File 'D:\x\run_tests.ps1' -Suite 看板CLI" $mainRepo
  Assert-True (-not (Test-Denied $o)) "B4 run_tests -Suite 单套件 -> allow"

  # ---------- B5/B6 快速路径不吞策略:载荷不含 git 时 run_tests 仍走全量判定 ----------
  # 夹具路径(cwd)与命令都不含 git;C7 即走快速路径的放行样本。
  $o = Invoke-GateDrill "b5" "& powershell.exe -NoProfile -File 'D:\x\RUN_TESTS.ps1'" $mainRepo
  Assert-True ($o -match '"permissionDecision":"ask"') "B5 无 git 的全量矩阵启动(大小写不敏感)-> ask"
  $b6 = (New-GatePayload "& powershell.exe -NoProfile -File 'D:\x\run_tests.ps1'" $mainRepo).Replace('run_tests', 'run_\u0074ests')
  $o = Invoke-PayloadDrill "b6" $b6
  Assert-True ($o -match '"permissionDecision":"ask"') "B6 载荷以 \u00XX 转义 ASCII 字母 -> 走全量路径,照判 ask"

  # ---------- P1 主仓 push -> allow(commit 才是咽喉) ----------
  $o = Invoke-GateDrill "p1" ("git -C " + $qm + " push origin main") $mainRepo
  Assert-True (-not (Test-Denied $o)) "P1 push(无 force)-> allow"

  # ---------- F1 force push -> 无条件 deny ----------
  $o = Invoke-GateDrill "f1" ("git -C " + $qm + " push --force origin main") $mainRepo
  Assert-True (Test-Denied $o) "F1 force push -> deny"
  Assert-True ($o -match 'force push') "F1 拒因是 force push"

  # S1~S4 只在服务端通道开着时成立(leaf 等于 ServerDirName 才算服务端仓);关闭时名为 Fantasy 的仓就是普通主仓,
  # 服务端验票分支整段不走,改核关闭态:提交不在客户端验证面的 .cs 照常放行。
  if (-not (Test-ServerEnabled)) {
    Stage $srvRepo "APP/Entity/Foo.cs" "class Foo {}`n"
    $o = Invoke-GateDrill "s0" ("git -C " + $qv + " commit -m `"feat: foo`"") $srvRepo
    Assert-True (-not (Test-Denied $o)) "S0 服务端通道关闭:名为 Fantasy 的仓按主客户端判,不在验证面的 .cs 提交 -> allow"
    Unstage $srvRepo
    Write-Host "SKIP S1~S4 服务端验票用例:服务端通道关闭(flow-config ServerDirName 留空)"
  } else {
  # ---------- S1 服务端 .cs 无票 -> deny ----------
  Stage $srvRepo "APP/Entity/Foo.cs" "class Foo {}`n"
  $o = Invoke-GateDrill "s1" ("git -C " + $qv + " commit -m `"feat: foo`"") $srvRepo
  Assert-True (Test-Denied $o) "S1 服务端 .cs 无票 -> deny"
  Assert-True ($o -match '服务端验凭据') "S1 拒因是服务端验凭据"

  # ---------- S2 服务端有票且无验证面漂移 -> allow 且不带警示 ----------
  New-Ticket $srvRepo
  $o = Invoke-GateDrill "s2" ("git -C " + $qv + " commit -m `"feat: foo`"") $srvRepo
  Assert-True (-not (Test-Denied $o)) "S2 服务端有票 -> allow"
  Assert-True ($o -notmatch '验证面内存在') "S2 无漂移则不发警示"

  # ---------- S3 部分提交盲区:票树==工作树,但提交集不含验证面内另一未提交 .cs ----------
  # 复刻实发事故:协议重导结果留工作树未提交、消费它的 handler 已入库,票照发、提交照过,
  # 而产出的树(HEAD+本次文件集)缺那份生成物,干净检出即编译失败。
  Write-F $srvRepo "APP/Entity/Generate/Bar.cs" "class Bar {}`n"
  New-Ticket $srvRepo   # 票树含 Bar.cs,故验凭据仍 match(漂移不在票树与工作树之间)
  $o = Invoke-GateDrill "s3" ("git -C " + $qv + " commit -m `"feat: foo`"") $srvRepo
  Assert-True (-not (Test-Denied $o)) "S3 验证面漂移仍放行(警示不拒)"
  Assert-True ($o -match '服务端验证面内存在不属于本次提交的未提交改动') "S3 点名服务端验证面漂移"
  Assert-True ($o -match 'Bar\.cs') "S3 警示点名漂移文件"

  # ---------- S4 非验证面文件不算漂移(仅 .cs/.csproj/.sln/.props/.targets 入面) ----------
  [System.IO.File]::Delete((Join-Path $srvRepo "APP/Entity/Generate/Bar.cs"))
  Write-F $srvRepo "docs/readme.md" "notes`n"
  New-Ticket $srvRepo
  $o = Invoke-GateDrill "s4" ("git -C " + $qv + " commit -m `"feat: foo`"") $srvRepo
  Assert-True (-not (Test-Denied $o)) "S4 非验证面漂移 -> allow"
  Assert-True ($o -notmatch '验证面内存在') "S4 md 不算服务端验证面漂移"

  }

  # ================= 命令面复合形态:分段判定 =================
  # 夹具:客户端仓 GateMain(a.cs 已入库、工作树有未暂存改动、无凭据)。
  $gm = Join-Path $fx "GateMain"
  New-GitRepo $gm
  Write-F $gm ".gitignore" ".gate/`n"
  Write-F $gm "Demo/Assets/GameScripts/a.cs" "class A {}`n"
  G $gm "add -A" | Out-Null
  G $gm "commit -q -m base" | Out-Null
  Write-F $gm "Demo/Assets/GameScripts/a.cs" "class A { int x; }`n"
  $qg = '"' + $gm + '"'
  $csRel = "Demo/Assets/GameScripts/a.cs"

  # ---------- H1 merge 与 commit 同命令:commit 段照检 ----------
  $o = Invoke-GateDrill "h1" ("git -C " + $qg + " merge origin/main; git -C " + $qg + " commit -a -m x") $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "H1 merge+commit 同命令 -> commit 段验凭据 deny"

  # ---------- H3 路径提交不带 -- / -o / -i ----------
  $o = Invoke-GateDrill "h3a" ("git -C " + $qg + " commit -m x " + $csRel) $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "H3a commit -m x <path>(无 --)-> deny"
  $o = Invoke-GateDrill "h3b" ("git -C " + $qg + " commit -o " + $csRel + " -m x") $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "H3b commit -o <path> -> deny"
  $o = Invoke-GateDrill "h3c" ("git -C " + $qg + " commit -i " + $csRel + " -m x") $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "H3c commit -i <path> -> deny"

  # ---------- H4 -a 合写短选项 ----------
  $o = Invoke-GateDrill "h4a" ("git -C " + $qg + " commit -av -m x") $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "H4a commit -av -> deny"
  $o = Invoke-GateDrill "h4b" ("git -C " + $qg + " commit -qam x") $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "H4b commit -qam -> deny"

  # ---------- M1 引号内的 git(cmd /c、powershell -Command)----------
  $o = Invoke-GateDrill "m1a" ("cmd /c `"git -C " + $gm + " commit -a -m x`"") $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "M1a cmd /c `"git commit`" -> deny"
  $o = Invoke-GateDrill "m1b" ("powershell -NoProfile -Command `"git -C '" + $gm + "' commit -a -m x`"") $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "M1b powershell -Command `"git commit`" -> deny"

  # ---------- M2 命令里的 cd / Set-Location 改变仓根 ----------
  $o = Invoke-GateDrill "m2a" ("cd " + $qg + "; git commit -a -m x") $mainRepo
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "M2a cd 后 commit 按 cd 目标仓判 -> deny"
  $o = Invoke-GateDrill "m2b" ("Set-Location -Path " + $qg + " && git commit -a -m x") $mainRepo
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "M2b Set-Location 后 commit -> deny"

  # ---------- M3 force push 的 +refspec 与合写 -uf ----------
  $o = Invoke-GateDrill "m3a" ("git -C " + $qg + " push origin +main") $gm
  Assert-True ((Test-Denied $o) -and ($o -match 'force push')) "M3a +refspec -> force deny"
  $o = Invoke-GateDrill "m3b" ("git -C " + $qg + " push -uf origin main") $gm
  Assert-True ((Test-Denied $o) -and ($o -match 'force push')) "M3b -uf -> force deny"

  # ---------- M4 合并类动词不再验凭据(槽位池已拆,没有未推送的槽位分支可引入) ----------
  $o = Invoke-GateDrill "m4a" ("git -C " + $qg + " merge refs/heads/agent/dev2") $gm
  Assert-True (-not (Test-Denied $o)) "M4a merge 本地分支 -> allow"
  $o = Invoke-GateDrill "m4c" ("git -C " + $qg + " pull . agent/dev2") $gm
  Assert-True (-not (Test-Denied $o)) "M4c pull . <本地分支> -> allow"

  # ---------- M5 全量矩阵 ask:-Suite 须在同一段 ----------
  $o = Invoke-GateDrill "m5" ("git -C " + $qg + " status; & powershell.exe -NoProfile -File 'D:\x\run_tests.ps1'; Write-Host -Suite") $gm
  Assert-True ($o -match '"permissionDecision":"ask"') "M5 别段的 -Suite 不豁免全量矩阵 -> ask"

  # ---------- 合法组合命令不误拦 ----------
  $o = Invoke-GateDrill "a1" ("git -C " + $qg + " status; git -C " + $qg + " log --oneline -1") $gm
  Assert-True (-not (Test-Denied $o)) "A1 git status; git log -> allow"
  $o = Invoke-GateDrill "a2" ("git -C " + $qg + " commit -m `"docs; git push --force origin main`"") $gm
  Assert-True (-not (Test-Denied $o)) "A2 提交信息里的 ; 与 --force 不算命令 -> allow"
  G $gm ("add -- " + $csRel) | Out-Null
  $o = Invoke-GateDrill "a3" ("git -C " + $qg + " commit -m x 2>&1 | Out-Null") $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "A3 重定向不被当成路径(暂存集照检)-> deny"
  $o = Invoke-GateDrill "a4" ("if (`$true) { git -C " + $qg + " commit -m x }") $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "A4 脚本块括号不被当成路径 -> deny"
  $o = Invoke-GateDrill "a4b" ("git -C " + $qg + " commit -F - <<'EOF'`ndocs: x`n`ngit push --force origin main`nEOF") $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "A4b heredoc 正文不当命令、占位不当路径(暂存集照检)-> deny"
  Unstage $gm
  New-Ticket $gm
  $o = Invoke-GateDrill "a5" ("git -C " + $qg + " add " + $csRel + "; git -C " + $qg + " commit -m x -- " + $csRel) $gm
  Assert-True (-not (Test-Denied $o)) "A5 有凭据时 add; commit -- <path> -> allow"
  [System.IO.File]::Delete((Join-Path $gm ".gate\ticket.json"))
  Write-F $gm "Demo/Assets/GameScripts/c.cs" "class C {}`n"
  $o = Invoke-GateDrill "a6" ("git -C " + $qg + " add Demo/Assets/GameScripts/c.cs; git -C " + $qg + " commit -m x -- Demo/Assets/GameScripts/c.cs") $gm
  Assert-True ((Test-Denied $o) -and ($o -match '验凭据')) "A6 同命令 add 新文件再路径提交,无凭据 -> 验凭据 deny"

  # ---------- 活性:全矩阵无内部异常放行 ----------
  # hook 内部异常走失败放行(exit 0 = allow),allow 类断言会被它静默满足;故核遥测 error 行为零。
  $telDir = Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry"
  $errLines = @()
  if (Test-Path $telDir) { $errLines = @(Get-ChildItem $telDir -Filter *.jsonl | ForEach-Object { Get-Content $_.FullName -Encoding UTF8 } | Where-Object { $_ -match '"decision":"error"' }) }
  Assert-True ($errLines.Count -eq 0) ("L1 遥测无 error 行(失败放行未触发)" + $(if ($errLines.Count) { ": " + $errLines[0] } else { "" }))
}
finally { Remove-Fixture }

Write-Host ""
Exit-TestSuite
