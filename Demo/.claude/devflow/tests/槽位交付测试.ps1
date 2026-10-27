# 槽位交付测试.ps1 - Agent-facing delivery entry point smoke matrix.
# Uses isolated git repositories and an isolated LOCALAPPDATA board; no real slot is touched.
# 交付经夹具内的入口副本跑,客户端自检换成记录调用的桩(理由见副本搭建处)。
# 入口遥测(entry-verdict:前置拒绝 / 成功 / 基线冲突 / 预检停机四种出口)与 集成交付 那行的 run 关联读隔离 LOCALAPPDATA 断言。
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
. (Join-Path (Split-Path (Split-Path $PSCommandPath -Parent) -Parent) "hooks\hook函数库.ps1")
$engine = Get-FlowEngine
$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
$fx = Join-Path $env:TEMP ("flowtest-slot-deliver-" + [Guid]::NewGuid().ToString("N"))
$tempRoot = [System.IO.Path]::GetFullPath($env:TEMP).TrimEnd('\')
$resolvedFx = [System.IO.Path]::GetFullPath($fx)
if (-not $resolvedFx.StartsWith($tempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "fixture path escaped TEMP"
}
[System.IO.Directory]::CreateDirectory($resolvedFx) | Out-Null
$dfDir = Get-ServerFlowDir $dfDir $resolvedFx   # 服务端通道关闭时换成启用服务端的 devflow 副本(见夹具库同名函数)
# 真 flow-config 驱动:夹具的服务端目录名与槽位目录名都须与真配置同形(见 槽位领取测试 同处注释)。
$cfgT = Import-PowerShellDataFile (Join-Path $dfDir "flow-config.psd1")
$srvDir = $cfgT.ServerDirName
$slotName1 = $cfgT.SlotDirPrefix + "1"

# 路径域登记(校验库 单源)的纯正则断言,不起子进程。
. (Join-Path (Split-Path (Split-Path $PSCommandPath -Parent) -Parent) "hooks\校验库.ps1")
# Editor程序集编译 经 Assembly-CSharp-Editor 的 ProjectReference 连带编 Packages 下的程序集(如 MCPForUnity.Editor);
# 其 .cs 由 工程链接核对 的宽登记兜住,asmdef 须在本道登记里,否则只改它的交付不跑检查、也不作废凭据。
Assert-True ('Demo/Packages/MCPForUnity/Editor/MCPForUnity.Editor.asmdef' -match $script:ClientSurfaceRe) "Packages 下 asmdef 在客户端验证面内"
Assert-True (-not [string]::IsNullOrEmpty($script:ProtocolGenClientRe) -and -not [string]::IsNullOrEmpty($script:ProtocolGenFantasyRe)) "协议生成域正则由校验库单源提供"
Assert-True (('Demo/Assets/GameScripts/HotFix/Network/NetworkProtocol/OuterMessage.cs' -match $script:ProtocolGenClientRe) -and ('examples/Server/APP/Entity/Generate/NetworkProtocol/OuterMessage.cs' -match $script:ProtocolGenFantasyRe) -and ('examples/Config/NetworkProtocol/Outer/X.proto' -match $script:ProtocolGenFantasyRe) -and -not ('examples/Server/APP/Entity/Generate/GameConfig/Tb.cs' -match $script:ProtocolGenFantasyRe)) "协议生成域正则命中两端生成物、不串到 Luban 生成域"
# 两条正则的生成物段须与导出工具配置逐字对齐:正本(ExporterSettings.json)搬家而这里没跟,两段恒不
# 命中,集成交付 的 BLOCKED-PROTOCOL-UNDECLARED 闸与重导收尾提交面静默失效(实发,字面断言查不出——
# 旧断言写的就是旧路径,与正则一同失配还一直 PASS)。故从正本反算路径再对,不在本文件另抄一份拼写。
# 正本在真服务端仓里;服务端通道关闭(没有服务端仓)时无从对起,整段跳过。
$expSettings = if ((Get-FlowConfig).FantasyRoot) { Join-Path (Get-FlowConfig).FantasyRoot "Tools\ProtocolExportTool\ExporterSettings.json" } else { "" }
if (-not $expSettings) { Write-Host "SKIP 协议生成域正则与导出配置对齐:服务端通道关闭,没有导出工具配置正本" }
else { Assert-True (Test-Path $expSettings) "导出配置正本可达($expSettings)" }
if ($expSettings -and (Test-Path $expSettings)) {
  $expToolDir = Split-Path $expSettings -Parent
  $expJson = Get-Content -Raw -Encoding UTF8 $expSettings | ConvertFrom-Json
  $expFantasyFull = [System.IO.Path]::GetFullPath((Get-FlowConfig).FantasyRoot).TrimEnd('\')
  $expRepoFull = [System.IO.Path]::GetFullPath((Get-FlowConfig).RepoRoot).TrimEnd('\')
  foreach ($pair in @(
      @($expJson.Export.NetworkProtocolServerDirectory.Value, $script:ProtocolOutFantasyRe, "服务端"),
      @($expJson.Export.NetworkProtocolClientDirectory.Value, $script:ProtocolGenClientRe, "客户端"))) {
    $dir = [System.IO.Path]::GetFullPath((Join-Path $expToolDir $pair[0])).TrimEnd('\')
    $root = if ($dir.StartsWith($expFantasyFull, [System.StringComparison]::OrdinalIgnoreCase)) { $expFantasyFull } else { $expRepoFull }
    $rel = $dir.Substring($root.Length).TrimStart('\').Replace('\', '/') + '/'
    Assert-True ($rel -match $pair[1]) ("协议生成域正则与导出配置对齐(" + $pair[2] + "侧输出 " + $rel + ")")
  }
}
# 钉死已退役拼写:客户端旧值指向已删除的 Assets/Fantasy/Generate/、服务端旧值漏 APP/Entity/ 两级。
Assert-True ((-not ('Demo/Assets/Fantasy/Generate/OuterMessage.cs' -match $script:ProtocolGenClientRe)) -and (-not ('examples/Server/Generate/NetworkProtocol/Outer.cs' -match $script:ProtocolGenFantasyRe))) "协议生成域正则不再命中已退役的导出目录"

# ---- 生成域不变量矩阵(校验库 GenDomains;纯函数,不起子进程) ----
# 按「域 × 本侧动的面 × 上游动的面」全组合断言重导判定,不按事故逐例补:判据漏掉的组合在这张表里
# 直接转红。每域的样本面覆盖两仓的源与产物;跨域、单侧、双空都不得命中。
$genSamples = [ordered]@{
  "表" = @(
    @{ side = "C"; path = "Configs/GameConfig/Datas/x.xlsx" },
    @{ side = "C"; path = "Configs/GameConfig/export-stamp.json" },
    @{ side = "C"; path = "Demo/Assets/AssetRaw/Configs/bytes/tb_x.bytes" },
    @{ side = "C"; path = "Demo/Assets/GameScripts/HotFix/GameProto/GameConfig/Tables.cs" },
    @{ side = "F"; path = "examples/Server/APP/Entity/Generate/GameConfig/Tables.cs" })
  "协议" = @(
    @{ side = "F"; path = "examples/Config/NetworkProtocol/Outer/X.proto" },
    @{ side = "F"; path = "examples/Server/APP/Entity/Generate/NetworkProtocol/OuterMessage.cs" },
    @{ side = "C"; path = "Demo/Assets/GameScripts/HotFix/Network/NetworkProtocol/OuterMessage.cs" })
}
function Select-ByMatrix($Ours, $Theirs) {
  $co = @($Ours | Where-Object { $_.side -eq "C" } | ForEach-Object { $_.path }); $fo = @($Ours | Where-Object { $_.side -eq "F" } | ForEach-Object { $_.path })
  $ct = @($Theirs | Where-Object { $_.side -eq "C" } | ForEach-Object { $_.path }); $ft = @($Theirs | Where-Object { $_.side -eq "F" } | ForEach-Object { $_.path })
  return (@(Select-GenDomainsBothTouched $co $ct $fo $ft | ForEach-Object { $_.Name }) -join "+")
}
$matrixBad = @()
$matrixN = 0
foreach ($dn in $genSamples.Keys) {
  foreach ($o in $genSamples[$dn]) {
    foreach ($t in $genSamples[$dn]) {
      $matrixN++
      $got = Select-ByMatrix @($o) @($t)
      if ($got -ne $dn) { $matrixBad += ($dn + " 两侧都动:" + $o.path + " / " + $t.path + " -> [" + $got + "]") }
    }
    foreach ($single in @(@(@($o), @()), @(@(), @($o)))) {
      $matrixN++
      $got = Select-ByMatrix $single[0] $single[1]
      if ($got) { $matrixBad += ($dn + " 只一侧动:" + $o.path + " -> [" + $got + "]") }
    }
    foreach ($on in $genSamples.Keys) {
      if ($on -eq $dn) { continue }
      foreach ($t in $genSamples[$on]) {
        $matrixN++
        $got = Select-ByMatrix @($o) @($t)
        if ($got) { $matrixBad += ("跨域:" + $o.path + " / " + $t.path + " -> [" + $got + "]") }
      }
    }
  }
}
Assert-True ($matrixBad.Count -eq 0) ("生成域重导判定矩阵 " + $matrixN + " 例全中" + $(if ($matrixBad.Count) { ":" + (($matrixBad | Select-Object -First 5) -join "; ") } else { "" }))
Assert-True ((Select-ByMatrix @(@{ side = "C"; path = "docs/a.md" }) @(@{ side = "F"; path = "examples/Server/A.cs" })) -eq "") "两侧只动非生成域 -> 不重导"
# 冲突无条件取 ours 的前提 = 产物 ⊆ 动过判据;反过来,源与账本不得落进产物(取 ours 会吞掉对侧的源改动)。
foreach ($side in @("Client", "Fantasy")) {
  $outRe = Get-GenOutputRe $side
  foreach ($d in $script:GenDomains) {
    Assert-True ((Get-GenDomainRe @($d) $side -Surface) -match [regex]::Escape($d[$side + "Gen"])) ("「" + $d.Name + "」" + $side + " 产物含在动过判据里")
  }
  $srcHit = @(@("Configs/GameConfig/Datas/x.xlsx", "Configs/GameConfig/Datas/配置表说明.md", "Configs/GameConfig/gen_code_bin_to_server.bat", "examples/Config/NetworkProtocol/Outer/X.proto", "examples/Config/NetworkProtocol/OpCode.Lock/dev1.json", "Tools/NetworkProtocol/a.cs") | Where-Object { $_ -match $outRe })
  Assert-True ($srcHit.Count -eq 0) ($side + " 冲突取 ours 的产物面不含源与账本(" + ($srcHit -join ", ") + ")")
}

$oldLocalAppData = $env:LOCALAPPDATA
$oldTemp = $env:TEMP; $oldTmp = $env:TMP
try {
  $env:LOCALAPPDATA = Join-Path $resolvedFx "AppData"
  [System.IO.Directory]::CreateDirectory($env:LOCALAPPDATA) | Out-Null
  # 临时件隔离:入口与其子流程(集成交付)自建的清单 / 提交信息文件落这里,末尾数残留。
  $isoTemp = Join-Path $resolvedFx "tmp"
  [System.IO.Directory]::CreateDirectory($isoTemp) | Out-Null
  $env:TEMP = $isoTemp; $env:TMP = $isoTemp

  $mainC = Join-Path $resolvedFx "Main"
  $mainF = Join-Path $resolvedFx "FantasyMain"
  $bareC = Join-Path $resolvedFx "origin-c.git"
  $bareF = Join-Path $resolvedFx "origin-f.git"
  $slotBase = Join-Path $resolvedFx "slots"
  $slot = Join-Path $slotBase $slotName1
  $slotF = Join-Path $slot $srvDir

  [System.IO.Directory]::CreateDirectory($mainC) | Out-Null
  G $mainC "init -q -b main" | Out-Null
  G $mainC "config user.email test@example.invalid" | Out-Null
  G $mainC "config user.name test" | Out-Null
  Write-F $mainC "README.md" "client`n"
  Write-F $mainC ".gitignore" ".gate/`n/$srvDir/`n"
  Write-F $mainC "Demo/ProjectSettings/ProjectVersion.txt" "m_EditorVersion: 6000.3.19f1`n"
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m init" | Out-Null
  git init -q --bare $bareC
  G $mainC ("remote add origin " + $bareC) | Out-Null
  G $mainC "push -q -u origin main" | Out-Null

  [System.IO.Directory]::CreateDirectory($mainF) | Out-Null
  G $mainF "init -q -b main" | Out-Null
  G $mainF "config user.email test@example.invalid" | Out-Null
  G $mainF "config user.name test" | Out-Null
  Write-F $mainF "README.md" "server`n"
  Write-F $mainF ".gitignore" ".gate/`n"
  G $mainF "add -A" | Out-Null
  G $mainF "commit -q -m init" | Out-Null
  git init -q --bare $bareF
  G $mainF ("remote add origin " + $bareF) | Out-Null
  G $mainF "push -q -u origin main" | Out-Null

  [System.IO.Directory]::CreateDirectory($slotBase) | Out-Null
  G $mainC ("worktree add " + $slot + " -b agent/dev1") | Out-Null
  G $mainF ("worktree add " + $slotF + " -b agent/dev1") | Out-Null
  G $slot "config user.email test@example.invalid" | Out-Null
  G $slot "config user.name test" | Out-Null
  G $slotF "config user.email test@example.invalid" | Out-Null
  G $slotF "config user.name test" | Out-Null
  G $slot "commit -q --allow-empty -m `"claim: wrapper smoke`"" | Out-Null
  Write-F $slot "docs/automatic-delivery.txt" "delivered`n"

  function MsgFile([string]$Name, [string]$Text) {
    $p = Join-Path $resolvedFx $Name
    [System.IO.File]::WriteAllText($p, $Text, (New-Object System.Text.UTF8Encoding($false)))
    return $p
  }

  # 入口副本:门脚本经 $PSScriptRoot 定位,故把入口连同依赖复制一份到夹具,把门换成桩——真 客户端自检
  # 要完整的 Unity 工程与表,夹具只有 ProjectVersion.txt。副本放在 <根>\Demo\.claude\devflow 下,
  # 使 Resolve-FlowRoots 推导出的仓根落在夹具内(入口其余路径由显式参数给定)。
  $stubDf = Join-Path $resolvedFx "stubroot\Demo\.claude\devflow"
  [System.IO.Directory]::CreateDirectory((Join-Path $stubDf "hooks")) | Out-Null
  Copy-Item (Join-Path $dfDir "*.ps1") $stubDf -Force
  Copy-Item (Join-Path $dfDir "flow-config.psd1") $stubDf -Force
  Copy-Item (Join-Path $dfDir "hooks\*.ps1") (Join-Path $stubDf "hooks") -Force
  $entry = Join-Path $stubDf "槽位交付.ps1"

  # 扫描数组 ↔ 读取面登记互核(客户端自检 启动时;登记 = 校验库 ClientGateScanSurface)。换桩前先用副本里的
  # 真门跑夹具工程:互核放行后首道扫描因夹具无 Assets 判 INFRA——止于扫描而非互核,即证现役扫描数组与
  # 登记一致。再删一条登记,须在任何扫描之前 INFRA 并点名该道。
  $realGate = Join-Path $stubDf "客户端自检.ps1"
  $slotProject = Join-Path $slot "Demo"
  $outR = @(& $engine -NoProfile -File $realGate -ProjectDir $slotProject 2>&1 | ForEach-Object { [string]$_ })
  $codeR = $LASTEXITCODE
  Assert-True ($codeR -eq 2 -and ($outR -join "`n") -match 'namespace scan could not run') "现役扫描数组与读取面登记一致(互核放行,止于夹具缺 Assets 的首道扫描)"
  $libCopy = Join-Path $stubDf "hooks\校验库.ps1"
  $libText = [System.IO.File]::ReadAllText($libCopy)
  [System.IO.File]::WriteAllText($libCopy, ($libText -replace '(?m)^\s*"bat编码核对\.ps1"\s*=.*\r?\n', ''), (New-Object System.Text.UTF8Encoding($true)))
  $outGap = @(& $engine -NoProfile -File $realGate -ProjectDir $slotProject 2>&1 | ForEach-Object { [string]$_ })
  $codeGap = $LASTEXITCODE
  $txtGap = $outGap -join "`n"
  Assert-True ($codeGap -eq 2 -and $txtGap -match 'ClientGateScanSurface' -and $txtGap -match 'bat编码核对\.ps1') "漏登记读取面的道次 -> 客户端自检 INFRA 并点名该道"
  Assert-True ($txtGap -notmatch 'namespace scan') "互核先于任何扫描"
  Copy-Item (Join-Path $dfDir "hooks\校验库.ps1") $libCopy -Force

  # 客户端自检桩:记一次调用(client-gate.log),client-gate.fail 在则判 FAIL,否则照真门签发凭据
  # (集成交付 push 点要验)。client-gate.expect 在则逐行(<仓根相对路径>`t<正则>)核被检树里的文件
  # 内容,不中即 FAIL——模拟真编译撞上缺字段的生成物。
  $clientGateStub = @'
param([string]$ProjectDir)
. (Join-Path $PSScriptRoot 'hooks\hook函数库.ps1')
[System.IO.File]::AppendAllText((Join-Path $PSScriptRoot 'client-gate.log'), $ProjectDir + "`n")
if (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'client-gate.fail')) { Write-Host 'VERDICT : FAIL   (stub client gate)'; exit 1 }
$root = Split-Path $ProjectDir -Parent
$expect = Join-Path $PSScriptRoot 'client-gate.expect'
if (Test-Path -LiteralPath $expect) {
  foreach ($l in [System.IO.File]::ReadAllLines($expect)) {
    $kv = $l -split "`t", 2
    $f = Join-Path $root ($kv[0] -replace '/', '\')
    if (-not (Test-Path -LiteralPath $f) -or [System.IO.File]::ReadAllText($f) -notmatch $kv[1]) { Write-Host ('VERDICT : FAIL   (stub compile: ' + $kv[0] + ' lacks ' + $kv[1] + ')'); exit 1 }
  }
}
if (-not (Publish-GateTicket $root (Get-WorkTreeHash $root) 'stub-client-gate' @{})) { exit 1 }
Write-Host 'VERDICT : PASS   (stub client gate)'
exit 0
'@
  [System.IO.File]::WriteAllText($realGate, $clientGateStub, (New-Object System.Text.UTF8Encoding($true)))
  $gateLog = Join-Path $stubDf "client-gate.log"
  $gateFailFlag = Join-Path $stubDf "client-gate.fail"
  function Get-GateCalls {
    if (-not (Test-Path -LiteralPath $gateLog)) { return 0 }
    return @([System.IO.File]::ReadAllLines($gateLog) | Where-Object { $_ }).Count
  }

  # 主题格式前置校验:不合格式在协议导出/双端自检之前就拒(把一次不合格主题的代价压到零),
  # 且零 git 写——槽位工作树的待提交改动必须原样留着。
  $badMsg = MsgFile "msg-bad.txt" "chore(task): 旧格式主题"
  $outB = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $badMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeB = $LASTEXITCODE
  $verdictB = @($outB | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1)
  Assert-True ($codeB -eq 1 -and $verdictB.Count -eq 1 -and $verdictB[0] -match '^VERDICT: DENIED-subject') "不合格式的提交主题在交付入口前置被拒"
  Assert-True ($verdictB[0] -match ' next=fix-retry$') "格式拒绝附 next=fix-retry(会话据此改提交信息重跑一次)"
  Assert-True ((G $slot "status --porcelain").Count -gt 0) "格式拒绝时零 git 写(槽位改动原样留存)"
  # 入口遥测(隔离 LOCALAPPDATA):每个 VERDICT 出口一行 event=entry-verdict;子流程那行带同一个交付关联号 run。
  function Get-LastDeliverTel([string]$EventName) {
    $tdir = Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry"
    $rows = @(Get-ChildItem $tdir -Filter "wf-*.jsonl" -EA SilentlyContinue | ForEach-Object { [System.IO.File]::ReadAllLines($_.FullName) } |
              Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json } | Where-Object { $_.event -eq $EventName -and $_.PSObject.Properties["verdict"] })
    if ($rows.Count -eq 0) { return $null }
    return $rows[-1]
  }
  $evB = Get-LastDeliverTel "entry-verdict"
  Assert-True ($evB -and $evB.entry -eq "槽位交付" -and $evB.verdict -eq "DENIED-subject" -and $evB.next -eq "fix-retry" -and $evB.exit -eq 1 -and $evB.slot -eq "1" -and $null -ne $evB.phases.precheck -and $evB.run) "入口遥测:前置拒绝也写 entry-verdict(抬头 / next / exit / slot / precheck 段 / run)"

  # 修复类定性前置校验:【修复】主题而正文没有根治 / 补丁结论,或定根治而没写不变量 → DENIED-qualify,
  # 同为入口前置、零 git 写、归 fix-retry。判据与 自审触发判定 的 FIX-QUALIFY 同源(校验库 Get-FixQualifyGap),
  # 逐形态的判定在下方纯函数表里锁,入口层只证「接上了」。
  foreach ($q in @(
      @{ Name = "msg-fix-noqual.txt"; Text = "【修复】订单: 奖励重复发放`n`n改了发放时机。`n"; Hint = '没有定性结论'; Label = "缺定性结论" },
      @{ Name = "msg-fix-root.txt";   Text = "【修复】订单: 奖励重复发放`n`n定性:根治`n";       Hint = '定性为根治';   Label = "根治缺不变量" })) {
    $outQ = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile (MsgFile $q.Name $q.Text) 2>&1 | ForEach-Object { [string]$_ })
    $codeQ = $LASTEXITCODE
    $vQ = @($outQ | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1)
    $lineQ = if ($vQ.Count -gt 0) { $vQ[0] } else { "" }
    Assert-True ($codeQ -eq 1 -and $lineQ -match '^VERDICT: DENIED-qualify' -and $lineQ -match $q.Hint) ("修复类提交" + $q.Label + "在交付入口前置被拒(" + $lineQ + ")")
    Assert-True ($lineQ -match ' next=fix-retry$') ("定性拒绝(" + $q.Label + ")附 next=fix-retry")
    Assert-True ((G $slot "status --porcelain").Count -gt 0) ("定性拒绝(" + $q.Label + ")时零 git 写")
  }
  $qualCases = @(
    @{ Text = "【修复】订单: x`n`n改了时机`n";                                Fix = $true;  Gap = "no-qual" },
    @{ Text = "`n`n【修复】订单: 空行开头`n`n正文`n";                         Fix = $true;  Gap = "no-qual" },
    @{ Text = "【修复】订单: x`n`n定性:根治`n";                              Fix = $true;  Gap = "root-no-invariant" },
    @{ Text = "【修复】订单: x`n`n定性:根治。不变量:发放只在落账后`n";      Fix = $true;  Gap = "" },
    @{ Text = "【修复】订单: x`n`n定性:补丁,根源未知`n";                    Fix = $true;  Gap = "" },
    @{ Text = "【修复】订单: x`n`n根治还是补丁:补丁。根治须另立任务`n";      Fix = $true;  Gap = "" },
    @{ Text = "【变更】订单: 调数值`n`n正文`n";                               Fix = $false; Gap = "" },
    @{ Text = "";                                                             Fix = $false; Gap = "" })
  $qualBad = @($qualCases | Where-Object { $g = Get-FixQualifyGap $_.Text; ($g.Gap -ne $_.Gap) -or ($g.IsFix -ne $_.Fix) })
  Assert-True ($qualBad.Count -eq 0) ("修复类定性缺口判定 " + $qualCases.Count + " 例全中" + $(if ($qualBad.Count) { ":" + ((@($qualBad | ForEach-Object { ($_.Text -replace "`r?`n", "\n") + " -> " + (Get-FixQualifyGap $_.Text).Gap })) -join "; ") } else { "" }))

  $goodMsg = MsgFile "msg-good.txt" "【新增】docs: 自动交付烟测"
  $callsDoc = Get-GateCalls
  $out = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $goodMsg 2>&1 | ForEach-Object { [string]$_ })
  $code = $LASTEXITCODE
  $verdict = @($out | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1)
  Assert-True ($code -eq 0 -and $verdict.Count -eq 1 -and $verdict[0] -match '^VERDICT: DELIVERED') "wrapper delivered a documentation-only task"
  Assert-True ((Get-GateCalls) -eq $callsDoc) "纯文档改动不碰客户端验证面 -> 不跑客户端自检"
  Assert-True ($verdict[0] -match ' next=go$') "成功交付附 next=go(透传集成交付 verdict 时拼装一次、不重复)"
  Assert-True (Test-Path (Join-Path $mainC "docs\automatic-delivery.txt")) "wrapper committed and merged pending client changes"
  Assert-True ((G $slot "status --porcelain").Count -eq 0) "slot client tree is clean"
  Assert-True (((G $mainC "rev-parse HEAD")[0]) -eq ((G $bareC "rev-parse refs/heads/main")[0])) "integrated client branch was pushed"
  $evD = Get-LastDeliverTel "entry-verdict"
  $fdD = Get-LastDeliverTel "集成交付"
  $claimSubj = if ($evD -and $evD.claim) { [string](G $mainC ("log -1 --format=%s " + $evD.claim))[0] } else { "" }
  Assert-True ($evD -and $evD.verdict -eq "DELIVERED" -and $evD.next -eq "go" -and $evD.exit -eq 0 -and $evD.topic -eq "wrapper smoke" -and $claimSubj -eq "claim: wrapper smoke") ("入口遥测:交付成功行带 topic 与 claim 占位 sha(与领取那行对上):" + $claimSubj)
  Assert-True ($evD -and $null -ne $evD.phases.commit -and $null -ne $evD.phases.integrate -and $null -eq $evD.phases.cgate -and $null -eq $evD.phases.sgate) "入口遥测:phases 只记走到的段(纯文档交付无两端自检段)"
  Assert-True ($evD -and $fdD -and $fdD.verdict -eq "DELIVERED" -and $evD.run -and $fdD.run -eq $evD.run) "入口遥测:集成交付 那行带同一个交付关联号 run"

  # 协议分支回归:-Protocol 强制走 协议导出 调用点。夹具无导出工具,协议导出 稳定回 exit 2
  # (ABORT: export tool missing),故本例锚的是「该调用点被执行到且以 GATE-FAIL 收口」——
  # 曾因入口内一处悬空变量($script:PwshExe 赋值被删、调用点漏改)崩成 INFRA,整条协议交付
  # 通道不可用,而当时的用例只跑纯文档交付、走不到这里。
  $outP = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -Protocol -MessageFile $goodMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeP = $LASTEXITCODE
  $verdictP = @($outP | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1)
  $lineP = if ($verdictP.Count -gt 0) { $verdictP[0] } else { "" }
  Assert-True ($codeP -eq 1 -and $lineP -match '^VERDICT: GATE-FAIL \| protocol export failed') "protocol 分支执行到导出调用点并以 GATE-FAIL 收口"
  Assert-True ($lineP -notmatch 'INFRA') "protocol 分支不因入口自身异常崩成 INFRA"
  Assert-True ($lineP -match ' next=judge$') "GATE-FAIL 附 next=judge(会话先判根因是否自明)"

  # 基线同步「落后即做」回归:上游领先的提交与本轮改动都不含 Luban 面 → 仍自动 merge 基线。
  # 锚的是判据本身:检查跑在落后基线的旧树上时,全仓类扫描道次会被 main 上早已修好、槽位尚未
  # 同步的存量违规拦下(判据见 槽位交付.ps1「基线同步判定」①;义务登记 = obligation-ledger.md「落后基线的槽位不带旧基线交付」行)。
  # 同时锚「不误触发重导」:上游没动表源时不该平添一次全量导表与一个零信息量的【流程】提交。
  Write-F $mainC "docs/upstream-plain.txt" "v-main`n"
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m upstream-plain" | Out-Null
  G $mainC "push -q origin main" | Out-Null
  Write-F $slot "docs/slot-plain.txt" "v-slot`n"
  # Fantasy 同时落后且本任务不碰它:同步客户端基线时一并快进(跨端类检查读槽位 Fantasy 源码对照客户端表,
  # 停在旧基线会被上游成对退役的配置 id 误拦;实发 2026-09-22 dev2)。快进不产生提交,不把它拖进合并流程。
  Write-F $mainF "docs/upstream-server.txt" "v-main`n"
  G $mainF "add -A" | Out-Null
  G $mainF "commit -q -m upstream-server" | Out-Null
  G $mainF "push -q origin main" | Out-Null
  $plainMsg = MsgFile "msg-plain.txt" "【新增】文档: 非 Luban 落后基线烟测"
  $outB = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $plainMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeB = $LASTEXITCODE
  $verdictB = @($outB | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1)
  Assert-True ($codeB -eq 0 -and $verdictB.Count -eq 1 -and $verdictB[0] -match '^VERDICT: DELIVERED') "落后基线但不含 Luban 面时照样交付"
  Assert-True ((@($outB | Where-Object { $_ -match '基线同步' })).Count -gt 0) "不含 Luban 面也执行基线同步(INFO 基线同步)"
  Assert-True (Test-Path (Join-Path $mainC "docs\upstream-plain.txt")) "上游非表改动保留"
  Assert-True (Test-Path (Join-Path $mainC "docs\slot-plain.txt")) "本轮改动交付"
  Assert-True ((@(G $mainC "log --format=%s" | Where-Object { $_ -match '^【流程】基线同步后重导表' })).Count -eq 0) "上游未动表源时不触发重导(无【流程】重导提交)"
  Assert-True ((G $slot "status --porcelain").Count -eq 0) "同步后槽位树干净"
  Assert-True ((([string](G $slotF "rev-parse HEAD")).Trim()) -eq (([string](G $mainF "rev-parse main")).Trim())) "Fantasy 落后且无本分支提交时快进到基线"
  Assert-True ((([string](G $slotF "rev-list --count main..HEAD")).Trim()) -eq "0") "Fantasy 快进不产生本分支提交"

  # 基线自动同步回归:main 领先且改过 Luban 面、槽位也改表 → 自动 merge + 重导(stub bat)+
  # 【流程】提交 → DELIVERED。stub bat 写在槽位树内同名相对路径(flow-config LubanGen*Bat 按
  # 客户端仓根解析),夹具无真导表工具,天然由 stub 注入。
  Write-F $mainC "Configs/GameConfig/Datas/base.xlsx" "v-main`n"
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m upstream-table" | Out-Null
  G $mainC "push -q origin main" | Out-Null
  # 标记文件落 EditorBytes(命中 LubanSurfaceRe 进【流程】提交)。
  $stubClient = "@echo off`r`nmkdir `"%~dp0EditorBytes`" 2>nul`r`necho stubgen> `"%~dp0EditorBytes\stubgen.txt`"`r`nexit /b 0`r`n"
  Write-F $slot "Configs/GameConfig/gen_code_bin_to_project_lazyload.bat" $stubClient
  Write-F $slot "Configs/GameConfig/gen_code_bin_to_server.bat" "@echo off`r`nexit /b 0`r`n"
  Write-F $slot "Configs/GameConfig/Datas/slot.xlsx" "v-slot`n"
  $tblMsg = MsgFile "msg-table.txt" "【新增】表: 基线同步烟测`n`n[表文档无关:夹具烟测]"
  $callsS = Get-GateCalls
  $outS = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $tblMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeS = $LASTEXITCODE
  $verdictS = @($outS | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1)
  Assert-True ($codeS -eq 0 -and $verdictS.Count -eq 1 -and $verdictS[0] -match '^VERDICT: DELIVERED') "基线落后含表改动时自动同步并交付(不再 DENIED-BASELINE)"
  # 期望随本工程的客户端验证面走:表源与导表 bat 落在面内才触发(block-client 在面内;本作未接 Luban,不在面内)。
  $expS = if (@("Configs/GameConfig/Datas/slot.xlsx", "Configs/GameConfig/gen_code_bin_to_server.bat") | Where-Object { $_ -match $script:ClientSurfaceRe }) { 1 } else { 0 }
  Assert-True ((Get-GateCalls) -eq ($callsS + $expS)) "表源与导表 bat 改动:落在客户端验证面内才触发客户端自检(期望 $expS 次)"
  Assert-True ((@($outS | Where-Object { $_ -match '基线同步' })).Count -gt 0) "自动同步路径被执行(INFO 基线同步)"
  Assert-True (Test-Path (Join-Path $mainC "Configs\GameConfig\Datas\base.xlsx")) "上游表改动保留(未被回滚)"
  Assert-True (Test-Path (Join-Path $mainC "Configs\GameConfig\Datas\slot.xlsx")) "本轮表改动交付"
  Assert-True (Test-Path (Join-Path $mainC "Configs\GameConfig\EditorBytes\stubgen.txt")) "重导产物(stub 标记文件)进入 main"
  Assert-True ((@(G $mainC "log --format=%s" | Where-Object { $_ -match '^【流程】基线同步后重导表' })).Count -gt 0) "重导产物以【流程】保留词提交"
  Assert-True ((G $slot "status --porcelain").Count -eq 0) "自动同步后槽位树干净"

  # 基线同步真实冲突:同一表源两侧都改 → abort + BLOCKED-BASELINE-CONFLICT(exit 3),合并态已清
  Write-F $mainC "Configs/GameConfig/Datas/conflict.xlsx" "v-main`n"
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m upstream-conflict" | Out-Null
  G $mainC "push -q origin main" | Out-Null
  Write-F $slot "Configs/GameConfig/Datas/conflict.xlsx" "v-slot`n"
  $outC2 = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $tblMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeC2 = $LASTEXITCODE
  $verdictC2 = @($outC2 | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1)
  $lineC2 = if ($verdictC2.Count -gt 0) { $verdictC2[0] } else { "" }
  Assert-True ($codeC2 -eq 3 -and $lineC2 -match '^VERDICT: BLOCKED-BASELINE-CONFLICT' -and $lineC2 -match 'conflict\.xlsx') "表源真实冲突停机并点名文件"
  Assert-True ($lineC2 -match ' next=halt$') "基线真实冲突附 next=halt(不授权自行重跑)"
  Assert-True ((G $slot "rev-parse -q --verify MERGE_HEAD").Count -eq 0) "冲突停机时合并态已 abort(无 MERGE_HEAD 残留)"
  # 括注与现场一致:abort 成功才写「已 merge --abort」(失败分支的文案由 hook函数库测试 A1/A2 锚定)
  Assert-True ($lineC2 -match '(已 merge --abort)' -and $lineC2 -notmatch '未生效') "VERDICT 括注经现场核实为已中止"
  # 重放指引不得让会话在同步前重导:入口同步后自动双端重导,会话先导是白做
  Assert-True ($lineC2 -match '不要在槽位重导表' -and $lineC2 -match '-TableSourceReplayed') "表源冲突指引:只重放编辑、不在槽位重导,带开关重跑"
  $evC2 = Get-LastDeliverTel "entry-verdict"
  Assert-True ($evC2 -and $evC2.verdict -eq "BLOCKED-BASELINE-CONFLICT" -and $evC2.next -eq "halt" -and (@($evC2.files) -contains "Configs/GameConfig/Datas/conflict.xlsx") -and $null -ne $evC2.phases.sync) ("入口遥测:基线冲突停机记冲突路径(files)与 sync 段(此类停机此前完全不进遥测):" + (@($evC2.files) -join ","))

  # 导表指纹冲突自动化解:本轮与上游各改一张不相干的表,指纹两侧改相邻行而 hunk 重叠 → 按生成物取 ours、
  # 同步后重导重写 → 照常交付,不停机、不要求重放(实发 2026-09-23 dev2:本轮改 __enums__、上游改紧邻的 __tables__)。
  G $slot "reset -q --hard main" | Out-Null
  G $slot "clean -qfd" | Out-Null
  Write-F $mainC "Configs/GameConfig/export-stamp.json" "a.xlsx: 0`nb.xlsx: 0`n"
  # 行尾幻影回归位(实发 2026-09-26 dev1/dev3):入库为 LF、属性 eol=lf 的生成物,下方导表桩按 CRLF 重写且内容不变。
  $phantomRel = "Demo/Assets/GameScripts/HotFix/GameProto/GameConfig/EolPhantom.cs"
  Write-F $mainC ".gitattributes" "Demo/Assets/GameScripts/HotFix/GameProto/GameConfig/*.cs text eol=lf`n"
  Write-F $mainC $phantomRel "a`nb`n"
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m stamp-base" | Out-Null
  G $mainC "push -q origin main" | Out-Null
  G $slot "reset -q --hard main" | Out-Null
  G $slot "commit -q --allow-empty -m `"claim: stamp conflict smoke`"" | Out-Null
  Write-F $mainC "Configs/GameConfig/Datas/a.xlsx" "v-main`n"
  Write-F $mainC "Configs/GameConfig/export-stamp.json" "a.xlsx: 1`nb.xlsx: 0`n"
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m upstream-a" | Out-Null
  G $mainC "push -q origin main" | Out-Null
  Write-F $slot "Configs/GameConfig/Datas/b.xlsx" "v-slot`n"
  Write-F $slot "Configs/GameConfig/export-stamp.json" "a.xlsx: 0`nb.xlsx: 2`n"
  # 导表桩改写指纹,模拟真导表按合并后的表源整份重写它;另把幻影文件按 CRLF 重写(cmd echo 行尾即 CRLF)
  Write-F $slot "Configs/GameConfig/gen_code_bin_to_project_lazyload.bat" "@echo off`r`n> `"%~dp0export-stamp.json`" echo regenerated`r`n(echo a& echo b)> `"%~dp0..\..\Demo\Assets\GameScripts\HotFix\GameProto\GameConfig\EolPhantom.cs`"`r`nexit /b 0`r`n"
  $outT = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $tblMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeT = $LASTEXITCODE
  $vT = @($outT | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1)
  $lineT = if ($vT.Count -gt 0) { $vT[0] } else { "" }
  Assert-True ($codeT -eq 0 -and $lineT -match '^VERDICT: DELIVERED') ("导表指纹冲突不停机,自动化解后交付(" + $lineT + ")")
  Assert-True ((@($outT | Where-Object { $_ -match '取 ours' -and $_ -match 'export-stamp\.json' })).Count -gt 0) "指纹按生成物取 ours(未要求 -TableSourceReplayed)"
  Assert-True ((Test-Path (Join-Path $mainC "Configs\GameConfig\Datas\a.xlsx")) -and (Test-Path (Join-Path $mainC "Configs\GameConfig\Datas\b.xlsx"))) "上游与本轮的表改动都进 main"
  Assert-True (([System.IO.File]::ReadAllText((Join-Path $mainC "Configs\GameConfig\export-stamp.json"))).Trim() -eq "regenerated") "进 main 的指纹是同步后重导重写的那份"
  # 修前:重导写出的 CRLF 版体积变了而内容零差异,既不进【流程】提交也刷不掉 stat 缓存,槽位永久判占用。
  Assert-True (@(G $slot "status --porcelain" | Where-Object { $_ -match 'EolPhantom' }).Count -eq 0) "同步后重导写出的行尾幻影已归一,槽位不留 tracked 假脏"
  Assert-True ([System.IO.File]::ReadAllText((Join-Path $slot ($phantomRel -replace '/', '\'))) -eq "a`nb`n") "幻影文件归一回检出形态(LF),内容不变"

  # 超范围改动拦截:改动含 ProjectSettings.asset 而简报与提交信息均未声明 → DENIED-SCOPE(exit 1)、零 git 写。
  # 拦的是槽位编辑器把旧 PlayerSettings 内存写回磁盘产生的回退改动(实发三次,末次 9abe97032
  # 经完整 devflow 流程进 main、抹掉已交付的应用图标配置)。先重置工作树,与上一 case 解耦。
  # 上一 case 在 merge --abort 之前已做过候选提交,槽位 ahead 首条不是 claim,出处校验(先于
  # 范围闸)会拒;故先 reset 回基线再打新 claim,让本 case 从干净的领取态起跑。
  G $slot "reset -q --hard main" | Out-Null
  G $slot "clean -qfd" | Out-Null
  G $slot "commit -q --allow-empty -m `"claim: scope guard smoke`"" | Out-Null
  Write-F $slot "Demo/ProjectSettings/ProjectSettings.asset" "productName: Unity`n"
  $scopeBad = MsgFile "msg-scope-bad.txt" "【新增】商城: 售价类型加 FREE"
  $outS1 = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $scopeBad 2>&1 | ForEach-Object { [string]$_ })
  $codeS1 = $LASTEXITCODE
  $vS1 = @($outS1 | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1)
  $lineS1 = if ($vS1.Count -gt 0) { $vS1[0] } else { "" }
  Assert-True ($codeS1 -eq 1 -and $lineS1 -match '^VERDICT: DENIED-SCOPE') "未声明的工程配置改动被范围闸拒"
  Assert-True ($lineS1 -match 'ProjectSettings\.asset') "范围拒绝点名具体文件"
  Assert-True ((G $slot "status --porcelain").Count -gt 0) "范围拒绝时零 git 写(槽位改动原样留存)"

  # 同一改动 + 提交信息里显式声明 ProjectSettings → 放行(闸判「有人写下来」,不判精确匹配简报)
  $scopeOk = MsgFile "msg-scope-ok.txt" "【配置】工程配置: ProjectSettings 改 productName"
  $callsS2 = Get-GateCalls
  $outS2 = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $scopeOk 2>&1 | ForEach-Object { [string]$_ })
  $codeS2 = $LASTEXITCODE
  $vS2 = @($outS2 | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1)
  $lineS2 = if ($vS2.Count -gt 0) { $vS2[0] } else { "" }
  Assert-True ($lineS2 -notmatch 'DENIED-SCOPE') "提交信息显式声明后不再被范围闸拦"
  Assert-True ($codeS2 -eq 0 -and $lineS2 -match '^VERDICT: DELIVERED') "声明后正常交付"
  Assert-True (Test-Path (Join-Path $mainC "Demo\ProjectSettings\ProjectSettings.asset")) "已声明的工程配置改动进入 main"
  Assert-True ((Get-GateCalls) -eq ($callsS2 + 1)) "ProjectSettings.asset(平台宏核对的读取面)改动触发客户端自检"

  # 客户端自检触发面按各道读取面判,不按「改没改代码」判:只改 prefab(文本截断核对 / UI绑定核对 的读取面)
  # 的交付曾一道扫描都不跑就合并。桩判 FAIL 时须停在 GATE-FAIL、改动不进 main——只看「调没调」证明不了
  # 门的结论生效。
  G $slot "reset -q --hard main" | Out-Null
  G $slot "clean -qfd" | Out-Null
  G $slot "commit -q --allow-empty -m `"claim: gate surface smoke`"" | Out-Null
  $prefabRel = "Demo/Assets/AssetRaw/UI/UIGateSmoke.prefab"
  Write-F $slot $prefabRel "--- !u!1 &1`nGameObject:`n  m_Name: UIGateSmoke`n"
  [System.IO.File]::WriteAllText($gateFailFlag, "fail`n")
  $prefabMsg = MsgFile "msg-prefab.txt" "【变更】UI: 只改 prefab 触发客户端自检烟测"
  $callsP = Get-GateCalls
  $outP1 = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $prefabMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeP1 = $LASTEXITCODE
  $lineP1 = [string](@($outP1 | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
  Assert-True ($codeP1 -eq 1 -and $lineP1 -match '^VERDICT: GATE-FAIL \| FAIL\s+\(stub client gate\)') "只改 prefab -> 客户端自检被触发,门判 FAIL 即 GATE-FAIL"
  Assert-True ((Get-GateCalls) -eq ($callsP + 1)) "只改 prefab 时客户端自检恰被调用一次"
  Assert-True (-not (Test-Path (Join-Path $mainC ($prefabRel -replace '/', '\')))) "门 FAIL 时 prefab 未进 main"
  [System.IO.File]::Delete($gateFailFlag)
  $outP2 = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $prefabMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeP2 = $LASTEXITCODE
  $lineP2 = [string](@($outP2 | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
  Assert-True ($codeP2 -eq 0 -and $lineP2 -match '^VERDICT: DELIVERED') "门转 PASS 后只改 prefab 的交付照常交付(凭据经 push 点验过)"
  Assert-True (Test-Path (Join-Path $mainC ($prefabRel -replace '/', '\'))) "门 PASS 后 prefab 进入 main"

  # 只改表数据(配置表前缀核对 / 表间引用核对 等道的读取面)同样触发。
  G $slot "reset -q --hard main" | Out-Null
  G $slot "commit -q --allow-empty -m `"claim: table surface smoke`"" | Out-Null
  Write-F $slot "Configs/GameConfig/Datas/gate_only.xlsx" "v-slot`n"
  $tblOnlyMsg = MsgFile "msg-table-only.txt" "【配置】表: 只改表数据触发客户端自检烟测`n`n[表文档无关:夹具烟测]"
  $callsT = Get-GateCalls
  $outT = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $tblOnlyMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeT = $LASTEXITCODE
  $lineT = [string](@($outT | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
  Assert-True ($codeT -eq 0 -and $lineT -match '^VERDICT: DELIVERED') "只改表数据的交付照常交付"
  $expT = if ("Configs/GameConfig/Datas/gate_only.xlsx" -match $script:ClientSurfaceRe) { 1 } else { 0 }
  Assert-True ((Get-GateCalls) -eq ($callsT + $expT)) "只改表数据 -> 落在客户端验证面内才触发客户端自检(期望 $expT 次)"

  # 临时件出口清理:以上各轮覆盖了成功交付、基线同步重导(两份【流程】提交信息 + 路径清单)、冲突停机、
  # 范围拒绝与门失败,入口与 集成交付 自建的临时件都应在各自出口删掉(修前每轮交付在 %TEMP% 留一至数份)。
  $leftTmp = @([System.IO.Directory]::GetFiles($isoTemp) | Where-Object { (Split-Path $_ -Leaf) -match '^(slot-deliver|flow-deliver|flow-commitmsg)-' })
  Assert-True ($leftTmp.Count -eq 0) ("入口与集成交付的自建临时件在出口清掉(残留 " + $leftTmp.Count + ")")
  Assert-True ((Test-Path $goodMsg) -and (Test-Path $tblMsg)) "调用方传入的提交信息文件不删"

  # 自检门失败的末行回归:两道自检门写 `VERDICT : `(冒号前有空格),入口曾只认 `VERDICT:`,门一
  # 失败末行恒为「GATE-FAIL | no verdict returned」。本例在入口副本里把 服务端自检 也换成桩:桩先打
  # 一行扫描自己的 verdict 与一行明细(须照常透传),末行才是门的 verdict(须提进入口末行、不在明细里重复)。
  $gateStub = "param([string]`$FantasyRoot)`r`nWrite-Host 'stub-detail-line'`r`nWrite-Host 'VERDICT : FAIL   (stub-scan 2 violations)'`r`nWrite-Host 'VERDICT : FAIL   (x)'`r`nexit 1`r`n"
  [System.IO.File]::WriteAllText((Join-Path $stubDf "服务端自检.ps1"), $gateStub, (New-Object System.Text.UTF8Encoding($true)))
  Write-F $slotF "examples/Server/GateStub.cs" "class GateStub {}`n"
  $gateMsg = MsgFile "msg-gate.txt" "【变更】服务端: 自检门失败末行烟测"
  $outG = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $gateMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeG = $LASTEXITCODE
  $lineG = [string](@($outG | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
  Assert-True ($codeG -eq 1 -and $lineG -match '^VERDICT: GATE-FAIL \| FAIL\s+\(x\)') "自检门失败 -> 末行带门自己的判定(GATE-FAIL | FAIL (x)),不再是 no verdict returned"
  Assert-True (@($outG | Where-Object { $_ -match '\(x\)' }).Count -eq 1) "门的 verdict 行只出现在末行,不在明细里重复"
  Assert-True ((@($outG | Where-Object { $_ -eq 'stub-detail-line' }).Count -eq 1) -and (@($outG | Where-Object { $_ -match 'stub-scan 2 violations' }).Count -eq 1)) "门内明细与各道扫描自己的 verdict 行照常透传"

  # 子流程写 stderr 回归:入口在 EAP=Stop 下以 `& 引擎 ... 2>&1` 收子进程输出时,子进程任一行 stderr
  # 都被 5.1 包成 ErrorRecord 抛出,子流程的 VERDICT 丢失、末行被读成 INFRA。桩先写一行 stderr 再给正常 verdict。
  $gateStubErr = "param([string]`$FantasyRoot)`r`n[Console]::Error.WriteLine('stub-stderr-line')`r`nWrite-Host 'VERDICT : FAIL   (stderr-x)'`r`nexit 1`r`n"
  [System.IO.File]::WriteAllText((Join-Path $stubDf "服务端自检.ps1"), $gateStubErr, (New-Object System.Text.UTF8Encoding($true)))
  $outE = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $gateMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeE = $LASTEXITCODE
  $lineE = [string](@($outE | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
  Assert-True ($codeE -eq 1 -and $lineE -match '^VERDICT: GATE-FAIL \| FAIL\s+\(stderr-x\)') "子流程写 stderr 不致入口抛异常:末行仍是子流程自己的 verdict(非 INFRA)"
  Assert-True (@($outE | Where-Object { $_ -match 'stub-stderr-line' }).Count -eq 1) "子流程 stderr 行随明细透传"

  # 出处比对回归:槽位分支经第二父并入了一条既不在基线、也不是本分支自己提交的外来提交(如误把别的
  # 槽位分支合进来)。期望清单取本分支一父链,外来提交只经合并的第二父可达 → 合并预检 A2 判 extra、
  # BLOCKED-PRECHECK;外来改动不进 main。修前期望清单与比对对象同取 ahead 全集,恒过、照常交付。
  G $slotF "reset -q --hard main" | Out-Null
  G $slotF "clean -qfd" | Out-Null
  G $slot "reset -q --hard main" | Out-Null
  G $slot "clean -qfd" | Out-Null
  G $slot "commit -q --allow-empty -m `"claim: provenance smoke`"" | Out-Null
  G $slot "checkout -q -b foreign-x main" | Out-Null
  Write-F $slot "docs/foreign.txt" "foreign`n"
  G $slot "add -A" | Out-Null
  G $slot "commit -q -m foreign-work" | Out-Null
  G $slot "checkout -q agent/dev1" | Out-Null
  G $slot "merge -q --no-ff -m foreign-merge foreign-x" | Out-Null
  Write-F $slot "docs/provenance-own.txt" "own`n"
  $provMsg = MsgFile "msg-prov.txt" "【新增】文档: 出处比对烟测"
  $outV = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $provMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeV = $LASTEXITCODE
  $lineV = [string](@($outV | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
  Assert-True ($codeV -eq 3 -and $lineV -match '^VERDICT: BLOCKED-PRECHECK') "经第二父并入的外来提交 -> 出处比对拦下(BLOCKED-PRECHECK)"
  Assert-True (@($outV | Where-Object { $_ -match "provenance: client commit .*'foreign-work'" }).Count -eq 1) "出处 blocker 点名外来提交,且只点它(本分支一父链全在期望清单内)"
  Assert-True (-not (Test-Path (Join-Path $mainC "docs\foreign.txt"))) "外来改动未进 main"
  $evV = Get-LastDeliverTel "entry-verdict"
  $fdV = Get-LastDeliverTel "集成交付"
  Assert-True ($evV -and $fdV -and $evV.verdict -eq "BLOCKED-PRECHECK" -and $fdV.verdict -eq "BLOCKED-PRECHECK" -and (@($fdV.blockers) -contains "A2") -and $fdV.run -eq $evV.run -and $fdV.detail -match 'blocker') ("入口遥测:预检停机时 集成交付 那行记 blocker 段别(A2)与 detail,与入口那行同一 run:" + (@($fdV.blockers) -join ","))

  # 基线同步后重导协议回归(实发 2026-09-23 C5):两仓协议生成物挂 merge=genours,两侧都改过的生成物
  # 同步时整份保留本侧、.proto 却照常文本合并 → 生成物缺上游新字段,客户端自检真编译失败。修前入口只在
  # 同步之前导出,同步后无重导。genours 属性取自两真仓 .gitattributes(属性被改掉时本例随之失去意义,
  # 故先断言它在);驱动是仓库本地配置,夹具照 .gitattributes 注释的一次性命令配上。
  $cfgReal = Get-FlowConfig
  if ($cfgReal.FantasyRoot) {
    $genoursC = @([System.IO.File]::ReadAllLines((Join-Path $cfgReal.RepoRoot ".gitattributes")) | Where-Object { $_ -match '^[^#].*\bmerge=genours\b' })
    $genoursF = @([System.IO.File]::ReadAllLines((Join-Path $cfgReal.FantasyRoot ".gitattributes")) | Where-Object { $_ -match '^[^#].*\bmerge=genours\b' })
    Assert-True ($genoursC.Count -gt 0 -and $genoursF.Count -gt 0) "两真仓协议生成物挂 merge=genours(本例前提)"
  } else {
    # 服务端通道关闭的工程没有协议生成物、两仓也没有这条属性:本例测的是停用的协议分支(经启用服务端的 devflow 副本),
    # 夹具改用 block-client 两仓的原属性行。
    $genoursC = @("Demo/Assets/GameScripts/HotFix/Network/NetworkProtocol/*.cs text eol=lf merge=genours -diff")
    $genoursF = @("examples/Server/APP/Entity/Generate/NetworkProtocol/** text eol=lf merge=genours -diff")
  }
  $protoRel = "examples/Config/NetworkProtocol/Outer/OuterMessage.proto"
  $genCRel = "Demo/Assets/GameScripts/HotFix/Network/NetworkProtocol/OuterMessage.cs"
  $genFRel = "examples/Server/APP/Entity/Generate/NetworkProtocol/OuterMessage.cs"
  Assert-True (($genCRel -match $script:ProtocolGenClientRe) -and ($genFRel -match $script:ProtocolGenFantasyRe) -and ($protoRel -match $script:ProtocolGenFantasyRe)) "夹具协议路径落在协议生成域内"
  # 协议导出桩:把 Fantasy 下全部 .proto 拼成两端生成物(内容 = 源的逐字拷贝,字段缺失即可见)。客户端仓 =
  # FantasyRoot 的上一级(与真导出工具同口径);主仓 Fantasy 在夹具里不嵌在客户端仓下,上一级不是仓就不写。
  # 按 LF 写出(与真导出工具同):源在 autocrlf 下检出为 CRLF,原样拷贝会写出混合行尾,真导出不产生这种形态。
  $exportStub = @'
param([string]$FantasyRoot)
$src = (@(Get-ChildItem -LiteralPath (Join-Path $FantasyRoot 'examples\Config\NetworkProtocol') -Recurse -Filter *.proto | Sort-Object FullName | ForEach-Object { [System.IO.File]::ReadAllText($_.FullName) }) -join '') -replace "`r`n", "`n"
$utf8 = New-Object System.Text.UTF8Encoding($false)
$targets = @(Join-Path $FantasyRoot 'examples\Server\APP\Entity\Generate\NetworkProtocol\OuterMessage.cs')
$clientRepo = Split-Path $FantasyRoot -Parent
if (Test-Path -LiteralPath (Join-Path $clientRepo '.git')) { $targets += Join-Path $clientRepo 'Demo\Assets\GameScripts\HotFix\Network\NetworkProtocol\OuterMessage.cs' }
foreach ($t in $targets) { [System.IO.Directory]::CreateDirectory((Split-Path $t -Parent)) | Out-Null; [System.IO.File]::WriteAllText($t, "// generated`n" + $src, $utf8) }
Write-Host 'EXPORT OK (stub)'
exit 0
'@
  [System.IO.File]::WriteAllText((Join-Path $stubDf "协议导出.ps1"), $exportStub, (New-Object System.Text.UTF8Encoding($true)))
  # 服务端自检换成照真门签发凭据的通过桩(上方两例留下的是失败桩);服务端重启 换成空桩,不碰本机进程。
  $serverPassStub = "param([string]`$FantasyRoot)`r`n. (Join-Path `$PSScriptRoot 'hooks\hook函数库.ps1')`r`nif (-not (Publish-GateTicket `$FantasyRoot (Get-WorkTreeHash `$FantasyRoot) 'stub-server-gate' `$null)) { exit 1 }`r`nWrite-Host 'VERDICT : PASS   (stub server gate)'`r`nexit 0`r`n"
  [System.IO.File]::WriteAllText((Join-Path $stubDf "服务端自检.ps1"), $serverPassStub, (New-Object System.Text.UTF8Encoding($true)))
  [System.IO.File]::WriteAllText((Join-Path $stubDf "服务端重启.ps1"), "param([switch]`$StopOnly, [string]`$FantasyRoot)`r`nexit 0`r`n", (New-Object System.Text.UTF8Encoding($true)))

  G $mainC "config merge.genours.driver true" | Out-Null
  G $mainF "config merge.genours.driver true" | Out-Null
  # 基线:协议源首尾各一个消息,中间隔几行,使两侧改动落在不同 hunk、.proto 能干净文本合并。
  $protoBase = "message A2C_Login {`n}`n// a`n// b`n// c`n// d`nmessage C2G_Ping {`n}`n"
  Write-F $mainF ".gitattributes" (($genoursF -join "`n") + "`n")
  Write-F $mainF $protoRel $protoBase
  Write-F $mainF $genFRel ("// generated`n" + $protoBase)
  G $mainF "add -A" | Out-Null
  G $mainF "commit -q -m proto-base" | Out-Null
  G $mainF "push -q origin main" | Out-Null
  Write-F $mainC ".gitattributes" (($genoursC -join "`n") + "`n")
  Write-F $mainC $genCRel ("// generated`n" + $protoBase)
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m proto-gen-base" | Out-Null
  G $mainC "push -q origin main" | Out-Null
  G $slotF "reset -q --hard main" | Out-Null
  G $slotF "clean -qfd" | Out-Null
  G $slot "reset -q --hard main" | Out-Null
  G $slot "clean -qfd" | Out-Null
  # 上一例停机前已把含外来合并的槽位分支推上 origin,重置后再推是非快进;删掉远端分支,让本例从新领取态起跑。
  G $slot "push -q origin --delete agent/dev1" | Out-Null
  G $slotF "push -q origin --delete agent/dev1" | Out-Null
  G $slot "commit -q --allow-empty -m `"claim: protocol resync smoke`"" | Out-Null
  # 本轮(C5):在协议源末尾加消息,生成物交给入口同步前的那次导出。
  Write-F $slotF $protoRel ($protoBase + "message BuffInfo {`n}`n")
  # 上游(C10)在槽位领取之后改了协议源首条消息并随之重导两端生成物。
  $protoMain = $protoBase -replace 'message A2C_Login \{', 'message A2C_Login { BoundChannels; AccountDeleteAtMs;'
  Write-F $mainF $protoRel $protoMain
  Write-F $mainF $genFRel ("// generated`n" + $protoMain)
  G $mainF "add -A" | Out-Null
  G $mainF "commit -q -m upstream-proto" | Out-Null
  G $mainF "push -q origin main" | Out-Null
  Write-F $mainC $genCRel ("// generated`n" + $protoMain)
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m upstream-proto-gen" | Out-Null
  G $mainC "push -q origin main" | Out-Null
  $expectFile = Join-Path $stubDf "client-gate.expect"
  [System.IO.File]::WriteAllLines($expectFile, [string[]]@(($genCRel + "`tBoundChannels"), ($genCRel + "`tBuffInfo")), (New-Object System.Text.UTF8Encoding($false)))
  $protoMsg = MsgFile "msg-proto.txt" "【新增】Buff: 基线同步后重导协议烟测"
  $callsR = Get-GateCalls
  $outR2 = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $protoMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeR2 = $LASTEXITCODE
  $lineR2 = [string](@($outR2 | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
  [System.IO.File]::Delete($expectFile)
  Assert-True ($codeR2 -eq 0 -and $lineR2 -match '^VERDICT: DELIVERED') ("上游改过协议、本轮也涉协议 -> 同步后自动重导,客户端自检过、照常交付(" + $lineR2 + ")")
  Assert-True ((Get-GateCalls) -eq ($callsR + 1)) "客户端自检只跑一次,且跑在重导之后的树上"
  $slotGenC = (G $slot ("show agent/dev1:" + $genCRel)) -join "`n"
  $slotGenF = (G $slotF ("show agent/dev1:" + $genFRel)) -join "`n"
  Assert-True (($slotGenC -match 'BoundChannels') -and ($slotGenC -match 'BuffInfo')) "槽位分支的客户端生成物同时含上游新字段与本轮新消息(未停在 genours 保留的本侧旧版)"
  Assert-True (($slotGenF -match 'BoundChannels') -and ($slotGenF -match 'BuffInfo')) "槽位分支的服务端生成物同样重导到位"
  Assert-True ((@(G $mainC "log --format=%s" | Where-Object { $_ -match '^【流程】基线同步后重导协议' })).Count -gt 0) "客户端重导产物以【流程】保留词提交并进 main"
  Assert-True ((@(G $mainF "log --format=%s" | Where-Object { $_ -match '^【流程】基线同步后重导协议' })).Count -gt 0) "Fantasy 重导产物铸票后以【流程】保留词提交并进 main"
  $mainGenC = [System.IO.File]::ReadAllText((Join-Path $mainC ($genCRel -replace '/', '\')))
  Assert-True (($mainGenC -match 'BoundChannels') -and ($mainGenC -match 'BuffInfo')) "进 main 的客户端生成物含两侧改动"
  Assert-True ((G $slot "status --porcelain").Count -eq 0 -and (G $slotF "status --porcelain").Count -eq 0) "重导收口后两仓槽位树干净"

  # 只有 Fantasy 落后回归:客户端与基线齐平、上游只合了纯服务端改动。修前同步块以客户端落后为入口,
  # 整块不进,服务端自检跑在旧 Fantasy 基线上。本例槽位 Fantasy 有本分支提交 → 须 merge 基线,
  # 自检(上例留下的通过桩)跑在合并后的树上并铸票;客户端不产生基线合并提交。
  G $slotF "reset -q --hard main" | Out-Null
  G $slotF "clean -qfd" | Out-Null
  G $slot "reset -q --hard main" | Out-Null
  G $slot "clean -qfd" | Out-Null
  G $slot "commit -q --allow-empty -m `"claim: fantasy-only behind smoke`"" | Out-Null
  $claimFo = ([string](G $slot "rev-parse HEAD")).Trim()
  Write-F $slot "docs/fonly-client.txt" "v-slot`n"
  Write-F $slotF "examples/Server/FOnly.cs" "class FOnly {}`n"
  Write-F $mainF "docs/upstream-fonly.txt" "v-main`n"
  G $mainF "add -A" | Out-Null
  G $mainF "commit -q -m upstream-fantasy-only" | Out-Null
  G $mainF "push -q origin main" | Out-Null
  $upF = ([string](G $mainF "rev-parse main")).Trim()
  Assert-True ((([string](G $slot "rev-list --count HEAD..main")).Trim()) -eq "0") "本例前提:客户端与基线齐平"
  $fOnlyMsg = MsgFile "msg-fonly.txt" "【新增】服务端: 只有 Fantasy 落后烟测"
  $outFo = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $fOnlyMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeFo = $LASTEXITCODE
  $lineFo = [string](@($outFo | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
  Assert-True ($codeFo -eq 0 -and $lineFo -match '^VERDICT: DELIVERED') ("只有 Fantasy 落后时照常交付(" + $lineFo + ")")
  Assert-True (@($outFo | Where-Object { $_ -match 'INFO 基线同步:Fantasy 落后' }).Count -eq 1) "只有 Fantasy 落后也进同步块并同步 Fantasy"
  Assert-True (@($outFo | Where-Object { $_ -match 'INFO 基线同步:git merge' }).Count -eq 0) "客户端齐平时不做客户端基线 merge"
  Assert-True ((Invoke-GitMerged $slotF ("merge-base --is-ancestor " + $upF + " agent/dev1")).code -eq 0) "槽位 Fantasy 分支已含上游提交(交付前在槽位内合了基线)"
  Assert-True ((G $slot ("log --merges --format=%s " + $claimFo + "..agent/dev1")).Count -eq 0) "客户端分支无基线合并提交"
  Assert-True ((Test-Path (Join-Path $mainF "examples\Server\FOnly.cs")) -and (Test-Path (Join-Path $mainF "docs\upstream-fonly.txt"))) "本轮服务端改动与上游改动都在 main"

  # 基线新增检查锚点回归(实发 2026-09-29 dev1):上游刚合入 AbTables.cs 与依赖它的核对道,槽位 Fantasy 落后
  # 且有未提交改动。修前服务端自检跑在同步之前(槽位 Fantasy 提交点要票),核对道找不到锚点判 INFRA,
  # 改输入文件修不了。自检桩按真门的锚点缺失口径:锚点不在即 INFRA exit 2;每次调用记下所见树有无锚点。
  $anchorRel = "examples/Server/Gate/Ab/AbTables.cs"
  $anchorLog = Join-Path $stubDf "anchor-gate.log"
  $serverAnchorStub = "param([string]`$FantasyRoot)`r`n. (Join-Path `$PSScriptRoot 'hooks\hook函数库.ps1')`r`n`$has = Test-Path (Join-Path `$FantasyRoot '" + ($anchorRel -replace '/', '\') + "')`r`n[System.IO.File]::AppendAllText('" + $anchorLog + "', ('anchor=' + `$has + [Environment]::NewLine))`r`nif (-not `$has) { Write-Host 'VERDICT : INFRA - A/B whitelisted table scan could not run (AbTables anchor missing)'; exit 2 }`r`nif (-not (Publish-GateTicket `$FantasyRoot (Get-WorkTreeHash `$FantasyRoot) 'stub-server-gate' `$null)) { exit 1 }`r`nWrite-Host 'VERDICT : PASS   (stub anchor gate)'`r`nexit 0`r`n"
  [System.IO.File]::WriteAllText((Join-Path $stubDf "服务端自检.ps1"), $serverAnchorStub, (New-Object System.Text.UTF8Encoding($true)))
  G $slotF "reset -q --hard main" | Out-Null
  G $slotF "clean -qfd" | Out-Null
  G $slot "reset -q --hard main" | Out-Null
  G $slot "clean -qfd" | Out-Null
  G $slot "commit -q --allow-empty -m `"claim: baseline anchor smoke`"" | Out-Null
  Write-F $slotF "examples/Server/Hotfix/Anchor29.cs" "class Anchor29 {}`n"
  Write-F $mainF $anchorRel "public static class AbTables {}`n"
  G $mainF "add -A" | Out-Null
  G $mainF "commit -q -m upstream-ab-anchor" | Out-Null
  G $mainF "push -q origin main" | Out-Null
  Assert-True (-not (Test-Path (Join-Path $slotF ($anchorRel -replace '/', '\')))) "本例前提:锚点尚未进槽位 Fantasy"
  $anchorMsg = MsgFile "msg-anchor.txt" "【变更】服务端: 基线新增锚点烟测"
  $outAn = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $anchorMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeAn = $LASTEXITCODE
  $lineAn = [string](@($outAn | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
  $anchorSeen = @()
  if (Test-Path $anchorLog) { $anchorSeen = @([System.IO.File]::ReadAllLines($anchorLog)); [System.IO.File]::Delete($anchorLog) }
  Assert-True ($codeAn -eq 0 -and $lineAn -match '^VERDICT: DELIVERED') ("基线新增锚点、槽位 Fantasy 落后且有未提交改动 -> 先同步再自检,照常交付(" + $lineAn + ")")
  Assert-True ($anchorSeen.Count -eq 1 -and $anchorSeen[0] -eq 'anchor=True') ("服务端自检只跑一次且跑在含锚点的同步后树上(实得 " + ($anchorSeen -join ",") + ")")
  Assert-True ((Test-Path (Join-Path $mainF "examples\Server\Hotfix\Anchor29.cs")) -and (Test-Path (Join-Path $mainF ($anchorRel -replace '/', '\')))) "本轮服务端改动与上游锚点都在 main"
  [System.IO.File]::WriteAllText((Join-Path $stubDf "服务端自检.ps1"), $serverPassStub, (New-Object System.Text.UTF8Encoding($true)))

  # 重导表与重导协议同轮回归(实发 2026-09-24 C26 dev1):上游(C28)同批改了表与协议并带上消费新协议类型的
  # 服务端代码,本轮也改表、涉协议。修前重导表的提交收口先跑 服务端自检,那时协议还停在 genours 保留的本侧旧版
  # ——合进来的上游服务端代码引用的类型不在生成物里,真编译 13 处报错;重导协议排在其后,轮不到。
  # 服务端自检换成「编译」桩:服务端源码里 uses:<名> 标记的类型须出现在协议生成物里。
  $serverCompileStub = @'
param([string]$FantasyRoot)
. (Join-Path $PSScriptRoot 'hooks\hook函数库.ps1')
$gen = Join-Path $FantasyRoot 'examples\Server\APP\Entity\Generate\NetworkProtocol\OuterMessage.cs'
$genText = if (Test-Path -LiteralPath $gen) { [System.IO.File]::ReadAllText($gen) } else { '' }
$srcDir = Join-Path $FantasyRoot 'examples\Server'
if (Test-Path -LiteralPath $srcDir) {
  foreach ($f in @(Get-ChildItem -LiteralPath $srcDir -Recurse -Filter *.cs | Where-Object { $_.FullName -notmatch '\\Generate\\' })) {
    foreach ($m in [regex]::Matches([System.IO.File]::ReadAllText($f.FullName), 'uses:(\w+)')) {
      if ($genText -notmatch $m.Groups[1].Value) { Write-Host ('VERDICT : FAIL   (stub compile: ' + $f.Name + ' needs ' + $m.Groups[1].Value + ')'); exit 1 }
    }
  }
}
if (-not (Publish-GateTicket $FantasyRoot (Get-WorkTreeHash $FantasyRoot) 'stub-server-gate' $null)) { exit 1 }
Write-Host 'VERDICT : PASS   (stub server gate)'
exit 0
'@
  [System.IO.File]::WriteAllText((Join-Path $stubDf "服务端自检.ps1"), $serverCompileStub, (New-Object System.Text.UTF8Encoding($true)))
  G $slotF "reset -q --hard main" | Out-Null
  G $slotF "clean -qfd" | Out-Null
  G $slot "reset -q --hard main" | Out-Null
  G $slot "clean -qfd" | Out-Null
  G $slot "commit -q --allow-empty -m `"claim: table+protocol resync smoke`"" | Out-Null
  # 本轮(C26):改表 + 在协议源末尾加消息(生成物交给入口同步前的那次导出);服务端导表桩改写 Fantasy 表生成物,
  # 使重导表在 Fantasy 侧有 diff、走到铸票自检。
  Write-F $slot "Configs/GameConfig/Datas/wheel.xlsx" "v-slot`n"
  Write-F $slot "Configs/GameConfig/gen_code_bin_to_project_lazyload.bat" "@echo off`r`nexit /b 0`r`n"
  $tblGenF = $srvDir + "\examples\Server\APP\Entity\Generate\GameConfig"
  Write-F $slot "Configs/GameConfig/gen_code_bin_to_server.bat" ("@echo off`r`nmkdir `"%~dp0..\..\" + $tblGenF + "`" 2>nul`r`necho regenerated> `"%~dp0..\..\" + $tblGenF + "\Tables.cs`"`r`nexit /b 0`r`n")
  $protoNow = [System.IO.File]::ReadAllText((Join-Path $mainF ($protoRel -replace '/', '\')))
  Write-F $slotF $protoRel ($protoNow + "message WheelPack {`n}`n")
  # 本轮改动先提交,模拟上一轮停在基线冲突后的重跑现场:涉协议判定须认本分支已提交的改动,不只看工作树。
  G $slot "add -A" | Out-Null
  G $slot "commit -q -m `"【新增】转盘: 上一轮候选提交`"" | Out-Null
  G $slotF "add -A" | Out-Null
  G $slotF "commit -q -m `"【新增】转盘: 上一轮候选提交`"" | Out-Null
  # 上游(C28):改表、协议源首条消息加新类型并重导两端生成物,另带引用该类型的服务端代码。
  $protoFund = $protoNow -replace 'AccountDeleteAtMs;', 'AccountDeleteAtMs; GrowthFund;'
  Write-F $mainF $protoRel $protoFund
  Write-F $mainF $genFRel ("// generated`n" + ($protoFund -replace "`r`n", "`n"))
  Write-F $mainF "examples/Server/GrowthFundHandler.cs" "// uses:GrowthFund`n"
  G $mainF "add -A" | Out-Null
  G $mainF "commit -q -m upstream-fund-proto" | Out-Null
  G $mainF "push -q origin main" | Out-Null
  Write-F $mainC "Configs/GameConfig/Datas/fund.xlsx" "v-main`n"
  Write-F $mainC $genCRel ("// generated`n" + ($protoFund -replace "`r`n", "`n"))
  G $mainC "add -A" | Out-Null
  G $mainC "commit -q -m upstream-fund" | Out-Null
  G $mainC "push -q origin main" | Out-Null
  $tpMsg = MsgFile "msg-table-proto.txt" "【新增】转盘: 重导表与重导协议同轮烟测`n`n[表文档无关:夹具烟测]"
  $outTp = @(& $engine -NoProfile -File $entry -Slot 1 -SlotBase $slotBase -RepoRoot $mainC -FantasyRoot $mainF -NoDeploy -MessageFile $tpMsg 2>&1 | ForEach-Object { [string]$_ })
  $codeTp = $LASTEXITCODE
  $lineTp = [string](@($outTp | Where-Object { $_ -match '^VERDICT:' } | Select-Object -Last 1) | Select-Object -First 1)
  Assert-True ($codeTp -eq 0 -and $lineTp -match '^VERDICT: DELIVERED') ("同轮既重导表又重导协议 -> 服务端自检跑在两者都落地之后,照常交付(" + $lineTp + ")")
  Assert-True (@($outTp | Where-Object { $_ -match 'INFO 基线同步:本轮与基线都动过的生成域 = 表与协议' }).Count -eq 1) "协议改动已在本分支提交里、工作树无协议改动时仍判两侧都动过协议域并同步后重导"
  $slotGenTp = (G $slotF ("show agent/dev1:" + $genFRel)) -join "`n"
  Assert-True (($slotGenTp -match 'GrowthFund') -and ($slotGenTp -match 'WheelPack')) "槽位 Fantasy 协议生成物同时含上游新类型与本轮新消息"
  Assert-True (Test-Path (Join-Path $mainF "examples\Server\APP\Entity\Generate\GameConfig\Tables.cs")) "Fantasy 表重导产物进 main"
  Assert-True ((@(G $mainF "log --format=%s" | Where-Object { $_ -match '^【流程】基线同步后重导表与协议' })).Count -eq 1) "Fantasy 两类重导产物合为一个【流程】提交(只铸一次票)"
} finally {
  $env:LOCALAPPDATA = $oldLocalAppData
  $env:TEMP = $oldTemp; $env:TMP = $oldTmp
  # 全通过才删夹具;有失败则留盘供排查(GUID 命名不会与下一轮冲突)
  if ($script:TestFail -eq 0) { Remove-FixtureTree $resolvedFx } else { Write-Host ("INFO 夹具保留供排查:" + $resolvedFx) }
}

Exit-TestSuite

