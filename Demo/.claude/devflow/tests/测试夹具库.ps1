# 测试夹具库.ps1 — devflow 测试的共享夹具工具(仅供 tests\ 下脚本 dot-source,不参与生产路径)。
# 依赖方向单向:本库 dot-source 生产共享层 hooks\hook函数库.ps1,故各套件拿到 Get-FlowEngine /
# Invoke-GitMerged 无需各自 source;反向不成立——测试专用工具不进生产库的依赖面。
#
# 提供:断言与收尾(Assert-True / Exit-TestSuite)、git 只读封装(G)、夹具写文件(Write-F / Write-Src)、
# 扫描类 CLI 驱动(Invoke-ScanCheck / Invoke-DualScanCheck)、隔离遥测读取(Get-TelRows)、
# 假仓搭建(New-GitRepo)、检查凭据伪造(New-Ticket)、夹具树删除(Remove-FixtureTree)。
# 套件专属的 New-Fixture(各建各的拓扑)留在各套件内,不入本库;收夹具的 Remove-Fixture 按 $script:fx
# 约定通用,在本库。

. (Join-Path (Split-Path $PSScriptRoot -Parent) "hooks\hook函数库.ps1")

$script:TestLibDfDir = Split-Path $PSScriptRoot -Parent
$script:TestPass = 0
$script:TestFail = 0

function Assert-True([bool]$Cond, [string]$Name) {
  if ($Cond) { Write-Host "[PASS] $Name"; $script:TestPass++ }
  else { Write-Host "[FAIL] $Name"; $script:TestFail++ }
}

function Exit-TestSuite {
  # 各套件统一收尾:末行 RESULT 供人眼读,退出码 0/1 供 run_tests 矩阵判。
  $total = $script:TestPass + $script:TestFail
  Write-Host ("RESULT: " + $script:TestPass + "/" + $total + " passed, " + $script:TestFail + " failed")
  if ($script:TestFail -gt 0) { exit 1 }
  exit 0
}

function Test-Denied([string]$Out) {
  # hook 演练输出的 deny 判据(提交检查演练用):PreToolUse 协议下 deny 由
  # stdout JSON 表达、退出码恒 0,故只认这个决定字段,不看退出码。
  return ($Out -match '"permissionDecision":"deny"')
}

function G([string]$Root, [string]$GitArgs) {
  # 夹具搭建用的 git 封装:回行数组(已合并 stderr)。要退出码的场景直接用 Invoke-GitMerged。
  # `, @(...)` 是承重的:单行输出在函数边界会解包成标量字符串,调用方 [0] 会取到首字符。
  return , @((Invoke-GitMerged $Root $GitArgs).lines)
}

function Write-F([string]$Root, [string]$Rel, [string]$Text) {
  # 写夹具文件(UTF-8 无 BOM,自动建父目录)。**不回路径**:未被消费的返回值会污染调用方的
  # 输出流(尤其是在函数体内调用时),而 67 个调用点里只有个位数需要路径——那几处自己 Join-Path。
  $p = Join-Path $Root ($Rel -replace '/', '\')
  New-Item -ItemType Directory -Force -Path (Split-Path $p -Parent) | Out-Null
  [System.IO.File]::WriteAllText($p, $Text, (New-Object System.Text.UTF8Encoding($false)))
}

function Add-FantasyFile([string]$Case, [string]$Rel, [string]$Text, [switch]$Untracked) {
  # 双仓夹具(<Case>\Fantasy 为 git 仓)里补一个服务端文件并提交;-Untracked 只写不提交,
  # 供「未跟踪新文件也在扫描面内」一类用例。消费方:服务端自检前置扫描的 CLI 测试。
  $repo = Join-Path $Case "Fantasy"
  Write-F $repo $Rel $Text
  if (-not $Untracked) {
    G $repo "add -A" | Out-Null
    G $repo "commit -q -m extra" | Out-Null
  }
}

function Add-ClassMember([string]$Class, [string]$Extra) {
  # 在 C# 夹具类文本的末尾 } 之前追加成员。$Extra 以换行开头时,追加的首行落在「原类末尾 } 所在行号 + 1」
  # (原 } 那一行变空行;各套件据此断言行号)。消费方:服务端自检前置扫描的 CLI 测试。
  return $Class.TrimEnd().TrimEnd('}') + $Extra + "`r`n}`r`n"
}

function New-GitRepo([string]$Path, [string]$Seed = "seed.txt") {
  # 空白假仓:main 分支 + 一条 seed 提交。gpgsign 关掉,否则本机签名配置会让夹具提交失败。
  New-Item -ItemType Directory -Force -Path $Path | Out-Null
  G $Path "init -q" | Out-Null
  G $Path "config user.name flowtest" | Out-Null
  G $Path "config user.email flowtest@example.com" | Out-Null
  G $Path "config commit.gpgsign false" | Out-Null
  Write-F $Path $Seed "seed`n"
  G $Path "add -A" | Out-Null
  G $Path "commit -q -m seed" | Out-Null
  G $Path "branch -M main" | Out-Null
}

function New-Ticket([string]$Root) {
  # 伪造 PASS 检查凭据,绕过真 Unity 检查。树哈希与验凭据方同源(hook函数库 Get-WorkTreeHash)。
  # 走子进程是必要的:凭据须按被测仓当下的树算,且不能让被测库状态渗进本进程。
  $hookLib = Join-Path $script:TestLibDfDir "hooks\hook函数库.ps1"
  & (Get-FlowEngine) -NoProfile -Command ". '$hookLib'; `$t = Get-WorkTreeHash '$Root'; `$obj = @{ result = 'PASS'; tree = `$t }; New-Item -ItemType Directory -Force -Path (Join-Path '$Root' '.gate') | Out-Null; [System.IO.File]::WriteAllText((Join-Path '$Root' '.gate\ticket.json'), (`$obj | ConvertTo-Json -Compress), (New-Object System.Text.UTF8Encoding(`$false)))"
}

function Write-Src([string]$Path, [string]$Text) {
  New-Item -ItemType Directory -Force -Path (Split-Path $Path -Parent) | Out-Null
  [System.IO.File]::WriteAllText($Path, $Text, (New-Object System.Text.UTF8Encoding($false)))
}

# 各道静态扫描的 CLI 契约测试共用的两种调用形态(道数以 客户端自检.ps1 的扫描数组为准,此处不复述)。
# **显式收脚本路径**($Script),不读调用方的 $Target
# ——点源进来的函数确实能沿作用域链拿到它,但那是隐式契约:哪个套件忘了定义 $Target,报的会是
# 「找不到 -File 的参数」这种离现场很远的错。
function Invoke-ScanCheck([string]$Script, [string]$ProjectDir) {
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Script -ProjectDir $ProjectDir 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}

# 双端扫描(配置表前缀 / 跨端配置):同一个脚本按 -ProjectDir 或 -FantasyRoot 各跑一次,
# 两端各挂一次是有意的(见 obligation-ledger 对应行),故测试也要能从两侧驱动。
function Invoke-DualScanCheck([string]$Script, [string]$Root, [switch]$ViaFantasy) {
  $argName = if ($ViaFantasy) { "-FantasyRoot" } else { "-ProjectDir" }
  $argVal = if ($ViaFantasy) { Join-Path $Root "Fantasy" } else { Join-Path $Root "Demo" }
  $lines = @(& (Get-FlowEngine) -NoProfile -File $Script $argName $argVal 2>&1 | ForEach-Object { [string]$_ })
  return @{ code = $LASTEXITCODE; out = ($lines -join "`n") }
}

function Get-TelRows {
  # 当前 $env:LOCALAPPDATA(套件须已隔离)下的全部遥测行,按 JSON 解析成对象数组,文件按月份名排序、行按写入次序;
  # 中文字段按属性比对,不按原文匹配。每次调用现取环境变量(各夹具换 LOCALAPPDATA 的套件同样适用),物理路径同生产侧
  # 经 Resolve-WfStatePath 解析。取「某次调用之后新增的行」:调用前记 @(Get-TelRows).Count,调用后 Select-Object -Skip 它。
  # 无行时回空。调用方一律 @(Get-TelRows ...) 再取 .Count:单行时函数出口会把数组解包成对象,PS 5.1 的对象没有 Count。
  $dir = Resolve-WfStatePath "claude-wf-3b\telemetry"
  if (-not (Test-Path -LiteralPath $dir)) { return @() }
  return @(Get-ChildItem -LiteralPath $dir -Filter "wf-*.jsonl" -File | Sort-Object Name |
           ForEach-Object { [System.IO.File]::ReadAllLines($_.FullName, [System.Text.Encoding]::UTF8) } |
           Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json })
}

function Remove-Fixture {
  # 按 $script:fx 约定收夹具:各套件的 New-Fixture 把本轮夹具根写进 $script:fx,本函数删它并置空。
  # 幂等,可在用例间与 finally 里重复调。
  if ($script:fx -and (Test-Path $script:fx)) { Remove-FixtureTree $script:fx }
  $script:fx = $null
}

function Get-ServerFlowDir([string]$DfDir, [string]$Fx) {
  # 测服务端 / Luban 重导分支的套件用的 devflow 目录。真配置已开服务端通道时原样返回 $DfDir;关闭时(ServerDirName
  # 留空)把 devflow 整目录拷进夹具 <Fx>\devflow-srv,配置副本按 block-client 形态补齐:ServerDirName = Fantasy,
  # 导表入口 LubanGen*Bat 填回 block-client 的相对路径。套件改从副本调被测脚本、读副本配置建夹具——这两类本作停用的
  # 分支照 block-client 原样受测(脚本与它保持同形,以后好搬修复),关闭态的主路径另由 工作流端到端CLI测试 覆盖。
  # 副本按位置推导的 RepoRoot 落在夹具里,故只给显式传仓根的套件用。
  $cfgPath = Join-Path $DfDir "flow-config.psd1"
  if ((Import-PowerShellDataFile $cfgPath).ServerDirName) { return $DfDir }
  $copy = Join-Path $Fx "devflow-srv"
  if (-not (Test-Path (Join-Path $copy "flow-config.psd1"))) {
    New-Item -ItemType Directory -Force -Path $copy | Out-Null
    Get-ChildItem -LiteralPath $DfDir -Force | Where-Object { $_.Name -ne "tests" } |
      ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination $copy -Recurse -Force }
    $copyCfg = Join-Path $copy "flow-config.psd1"
    $text = [System.IO.File]::ReadAllText($copyCfg)
    $text = [regex]::Replace($text, "(?m)^(\s*ServerDirName\s*=\s*)''", "`$1'Fantasy'")
    $text = [regex]::Replace($text, "(?m)^(\s*LubanGenClientBat\s*=\s*)''", "`$1'Configs/GameConfig/gen_code_bin_to_project_lazyload.bat'")
    $text = [regex]::Replace($text, "(?m)^(\s*LubanGenServerBat\s*=\s*)''", "`$1'Configs/GameConfig/gen_code_bin_to_server.bat'")
    [System.IO.File]::WriteAllText($copyCfg, $text, (New-Object System.Text.UTF8Encoding($true)))
    $c = Import-PowerShellDataFile $copyCfg
    if (-not $c.ServerDirName -or -not $c.LubanGenClientBat -or -not $c.LubanGenServerBat) { throw "Get-ServerFlowDir: 副本配置未能补齐服务端与导表键" }
  }
  return $copy
}

function Remove-FixtureTree([string]$Path) {
  # 稳妥删除测试夹具树。
  # git worktree / 对象库里的文件带只读属性,[System.IO.Directory]::Delete($p, $true) 会失败;
  # 若调用方再把异常 catch 掉,夹具就静默残留在 %TEMP%,与使用固定路径夹具的套件相互干扰
  # (实发:残留累积到数百个目录后,单仓提交 / 集成交付 两套固定路径夹具的用例成片失败,
  #  而两者单独跑全通过)。故先去只读属性再整树删。
  if (-not $Path -or -not (Test-Path $Path)) { return }
  cmd /c "attrib -r -s -h ""$Path\*"" /s /d" | Out-Null
  cmd /c "rmdir /s /q ""$Path""" | Out-Null
}

function New-XlsxFixture([string]$Path, [array]$Rows) {
  # 造最小 .xlsx 夹具:zip 内只放 xl/worksheets/sheet1.xml,值一律用 inlineStr 形态。
  # 够用的理由 = 读取侧(hooks\xlsx读取库.ps1)只取 sheet1 与可选 sharedStrings,不校验
  # [Content_Types].xml / workbook.xml,故不造那些条目;夹具是喂读取库的,不求 Excel 能打开。
  # $Rows = 哈希表数组,每个哈希为「列字母 -> 单元格文本」,如 @{ A=''; B='block.TbFoo'; E='foo.xlsx' }。
  # 值为空串的列照写(空单元格与缺列在读取侧语义不同:前者 Trim 后入表,后者 ContainsKey 为假)。
  Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction Stop
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.Append('<?xml version="1.0" encoding="UTF-8"?><worksheet><sheetData>')
  $rn = 0
  foreach ($row in $Rows) {
    $rn++
    [void]$sb.Append('<row r="' + $rn + '">')
    foreach ($col in ($row.Keys | Sort-Object)) {
      $v = [string]$row[$col]
      $esc = $v.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;')
      [void]$sb.Append('<c r="' + $col + $rn + '" t="inlineStr"><is><t>' + $esc + '</t></is></c>')
    }
    [void]$sb.Append('</row>')
  }
  [void]$sb.Append('</sheetData></worksheet>')

  New-Item -ItemType Directory -Force -Path (Split-Path $Path -Parent) | Out-Null
  if (Test-Path -LiteralPath $Path) { [System.IO.File]::Delete($Path) }
  $zip = [System.IO.Compression.ZipFile]::Open($Path, 'Create')
  try {
    $entry = $zip.CreateEntry('xl/worksheets/sheet1.xml')
    $sw = New-Object System.IO.StreamWriter($entry.Open(), (New-Object System.Text.UTF8Encoding($false)))
    try { $sw.Write($sb.ToString()) } finally { $sw.Close() }
  } finally { $zip.Dispose() }
}
