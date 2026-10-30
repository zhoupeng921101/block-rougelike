# 提交前绑定核对.ps1 - git pre-commit 钩子体:会话外的手动提交碰到 UI 绑定面时,对「本次提交之后的树」跑 UI绑定核对.ps1。
# 为什么要有:UI 绑定核对原先只在客户端自检里跑(devflow 提交前必跑、代码提交验票)。在 git 客户端或终端里直接
#   提交一个 prefab 不经过其中任何一处,带绑定前缀的节点被删了组件 / 改了名就直接进 main;之后每个碰界面的任务
#   都在这条不属于它的违规上自检 FAIL(实发 ece05559b:UIMealGiftPanel 的 m_img_PanelBg)。
# 入口:git 经钩子目录下的 pre-commit(sh 垫片,由 提交钩子安装.ps1 生成)调用,无参数;cwd = 工作树根,
#   GIT_INDEX_FILE 指向本次提交的索引(-a / 按路径提交时是 git 临时建的那份),本脚本起的 git 子进程继承它。
# 触发:本次提交相对 HEAD 改动的路径命中 UI绑定核对 的读取面(登记正本 = 校验库.ps1 ClientGateScanSurface),否则直接放行。
#   垫片里有同一判据的快路径(没命中就不起本脚本,省掉约 2 秒的 PowerShell 启动与载库),所以没碰读取面的提交
#   通常到不了这里、也不留遥测;本脚本仍自己判一遍,垫片取不到正则或出错时走的就是这里。
# 判的是索引,不是工作树:把索引里读取面内的文件(连同 .meta)导出到 %TEMP% 的临时目录再扫。
#   - 改好了但没加进这次提交的 prefab 不算数:进 main 的是提交进去的树。
#   - 工作树里别的会话没提交的半成品也不算数:不会因为它拦住这次提交。
# 不拦的两种情形(直接放行):
#   - 合并 / 拣选 / 回退的收尾提交(MERGE_HEAD / CHERRY_PICK_HEAD / REVERT_HEAD 在):内容来自别处已有的提交;
#     交付脚本在 main 上收尾合并时被拦会把仓留在合并中途态。
#   - 没碰读取面的提交。
# 姿态:违规才拒;自身出错(读不到配置、导出失败、扫描报 INFRA)一律打 WARN 放行——这是用户手敲提交的路径,
#   不拿检查自己的故障挡提交。
# 遥测:每次判决一行 event=提交前绑定核对(decision);另按护栏记一行(护栏名 precommit-uibind,检查命中面板「疑似恒降级」
#   据此看出「钩子次次没跑成」):扫描给出结论(放行 / 拒)记 guard-ok,出错放行经 hook函数库 Write-Degraded 记 degraded
#   (key precommit-uibind-error),各种跳过(decision = skip-*)两样都不记。hook函数库 经 校验库 点源,不另加载;校验库 本身载不进时
#   Write-Degraded 不在,退回只打原 WARN 行,照样放行;库比钩子体旧、只缺 Write-GuardOk 时放行 / 拒照判,只少那行 guard-ok。
# 退出码:0 = 放行;1 = 拒绝提交(违规明细打在上方)。单次绕过:git commit --no-verify。
# 副作用:%TEMP%\flow-precommit-uibind-<guid> 临时目录,出口删除;不写索引、不写工作树。
# 配套入口:提交钩子安装.ps1(装 / 查 / 卸垫片);判据本身在 UI绑定核对.ps1。
$ErrorActionPreference = "Stop"
$script:ExportDir = ""
$script:ListFile = ""

function Remove-Scratch {
  try { if ($script:ListFile -and (Test-Path -LiteralPath $script:ListFile)) { [System.IO.File]::Delete($script:ListFile) } } catch {}
  try { if ($script:ExportDir -and (Test-Path -LiteralPath $script:ExportDir)) { [System.IO.Directory]::Delete($script:ExportDir, $true) } } catch {}
}

function Exit-Hook([int]$Code, [string]$Decision, [string]$Root) {
  Remove-Scratch
  try { Write-Telemetry @{ event = "提交前绑定核对"; decision = $Decision; repo = $Root; exit = $Code } } catch {}
  exit $Code
}

$root = ""
try {
  . (Join-Path $PSScriptRoot "校验库.ps1")

  # 两项一次问完:每起一次 git 要过一层 cmd,近 0.1 秒。
  $where = Get-GitLines (Get-Location).Path "rev-parse --show-toplevel --absolute-git-dir"
  if ($where.Count -lt 2) { Exit-Hook 0 "skip-no-repo" "" }
  $root = ([string]$where[0]).Trim()
  $gitDir = ([string]$where[1]).Trim()

  foreach ($head in @("MERGE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD")) {
    if ($gitDir -and (Test-Path -LiteralPath (Join-Path $gitDir $head))) { Exit-Hook 0 "skip-sequencer" $root }
  }

  $scanName = "UI绑定核对.ps1"
  $surfaceRe = [string]$script:ClientGateScanSurface[$scanName]
  if (-not $surfaceRe) { throw ("校验库 ClientGateScanSurface 里没有 " + $scanName + " 的读取面登记") }

  $ro = "--no-optional-locks -c core.quotepath=false "
  $staged = Get-GitLinesChecked $root ($ro + "diff --cached --name-only --no-renames")
  $hit = @($staged | ForEach-Object { ([string]$_).Trim() } | Where-Object { $_ -match $surfaceRe })
  if ($hit.Count -eq 0) { Exit-Hook 0 "skip-off-surface" $root }

  # 导出索引里读取面内的文件。.meta 不在登记的读取面里,但扫描按源码的 .meta 取组件 guid,一并带上。
  $metaSuffix = ".meta"
  $export = New-Object System.Collections.Generic.List[string]
  foreach ($line in (Get-GitLinesChecked $root ($ro + "ls-files"))) {
    $p = ([string]$line).Trim()
    if (-not $p) { continue }
    $base = $p
    if ($p.EndsWith($metaSuffix, [System.StringComparison]::Ordinal)) { $base = $p.Substring(0, $p.Length - $metaSuffix.Length) }
    if ($p -match $surfaceRe -or $base -match $surfaceRe) { [void]$export.Add($p) }
  }
  if ($export.Count -eq 0) { Exit-Hook 0 "skip-empty-surface" $root }

  $script:ExportDir = Join-Path $env:TEMP ("flow-precommit-uibind-" + [Guid]::NewGuid().ToString("N"))
  [void][System.IO.Directory]::CreateDirectory($script:ExportDir)
  $script:ListFile = $script:ExportDir + ".list"
  [System.IO.File]::WriteAllText($script:ListFile, (($export.ToArray() -join "`0") + "`0"), (New-Object System.Text.UTF8Encoding($false)))
  $prefix = $script:ExportDir.Replace('\', '/') + "/"
  $r = Invoke-GitMerged $root ("checkout-index -q -z --stdin --prefix=`"" + $prefix + "`" < `"" + $script:ListFile + "`"")
  if ($r.code -ne 0) { throw ("索引导出失败:" + (($r.lines | Select-Object -Last 3) -join " | ")) }

  # 同进程直调,不另起 PowerShell(又是近 1 秒)。被调脚本里的 exit 只结束它自己,退出码落在 $LASTEXITCODE;
  # 它用 Write-Host 出结果,走的是信息流,6>&1 才收得到。它抛的异常由外层 catch 接住,照「没跑成」放行。
  $scanScript = Join-Path (Split-Path $PSScriptRoot -Parent) $scanName
  $scanLines = @(& $scanScript -ProjectDir (Join-Path $script:ExportDir "Demo") 6>&1 | ForEach-Object { [string]$_ })
  $scanCode = $LASTEXITCODE
  # guard-ok 入账包 try:库比钩子体旧、Write-GuardOk 还不在时这一调用即抛,不包住会落进外层 catch,把拒判成放行。
  if ($scanCode -eq 0) { try { Write-GuardOk "precommit-uibind" } catch {}; Exit-Hook 0 "allow" $root }
  if ($scanCode -ne 1) { throw ("UI绑定核对 未能给出结论(exit " + $scanCode + "):" + (($scanLines | Select-Object -Last 2) -join " | ")) }
  try { Write-GuardOk "precommit-uibind" } catch {}

  Write-Host "[提交已拦下] 这次提交之后,下面这些 UI 绑定是空的或已失效(开窗即空引用):"
  foreach ($l in $scanLines) { if ($l -match '^\s+-\s') { Write-Host $l } }
  Write-Host "怎么处理:在编辑器里重跑菜单「TEngine/UI 绑定/全量绑定并校验 UI prefab 引用」(节点删了 / 改了名的先重新生成 _Gen),"
  Write-Host "          再把改好的 prefab 与 _Gen 一起加进这次提交。"
  Write-Host "判的是这次提交的内容:工作树里改好了但没加进提交的文件不算数。"
  Write-Host "确认就是要这样提交:git commit --no-verify"
  Exit-Hook 1 "deny" $root
} catch {
  $err = [string]$_
  $warnText = "提交前 UI 绑定核对没跑成,本次提交不拦:" + $err
  # 校验库 载不进(Write-Degraded 未定义)时那一调用即抛,落到内层 catch 只打原 WARN 行;Write-Degraded 自身不抛。
  try { Write-Degraded "precommit-uibind-error" $err $warnText -Guard "precommit-uibind" } catch { Write-Host ("WARN " + $warnText) }
  try { Write-Telemetry @{ event = "提交前绑定核对"; decision = "error"; error = $err; repo = $root } } catch {}
  Remove-Scratch
  exit 0
}
