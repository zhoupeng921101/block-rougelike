# 语法自检.ps1 - script syntax self-check (script-authoring acceptance gate:
# mandatory after ANY .ps1/.psd1/.py change). Parses the given files, or with no argument
# every .ps1/.psd1/.py under the .claude\ this script lives in (minus its top-level worktrees\), and reports per-file OK / parse
# errors. .ps1/.psd1 use the PowerShell [Parser]; .py go through `python -B -m py_compile`
# (-B 不落 .pyc;用模块而非内联代码,免 PowerShell 内联 python 的引号嵌套。devflow 自身已无 python,
# 该分支服务 skills 下的少量 py 工具)。psd1 coverage is load-bearing: a syntax-broken flow-config.psd1
# turns into a 提交检查 fail-closed deny, and this check is the pre-commit net that
# catches it. Exit codes: 0 all parse clean; 1 at least one file has parse errors; 2 bad arguments.
param(
  [string[]]$Path = @()   # files or directories; default = main project .claude\
)
$ErrorActionPreference = "Stop"

# 缺省扫描域 = 本脚本所在 .claude(本文件恒在 <.claude>\devflow\),不写死机器路径。
# 其直属的 worktrees\ 不进域、也不下探(口径同 静态扫描.ps1 $ScanExcludeDirs,改一处同步另一处):
# 那里是桌面端会话 worktree 的整仓检出,扫进来既把 .claude 副本重复检查一遍,也把副本里 .claude 以外的
# 脚本带进本检查。副本由该 worktree 内自跑本脚本覆盖;显式传 -Path 的目录不受此限。
$exts = @(".ps1", ".psd1", ".py")
$files = @()
if ($Path.Count -eq 0) {
  foreach ($top in (Get-ChildItem -LiteralPath ([System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))))) {
    if ($top.PSIsContainer) { if ($top.Name -ne "worktrees") { $Path += $top.FullName } }
    elseif ($exts -contains $top.Extension) { $files += $top.FullName }
  }
}
foreach ($p in $Path) {
  if (-not (Test-Path $p)) { Write-Host "ABORT: path not found: $p"; exit 2 }
  $item = Get-Item $p
  if ($item.PSIsContainer) { $files += @(Get-ChildItem $p -Recurse -File | Where-Object { $exts -contains $_.Extension } | Select-Object -ExpandProperty FullName) }
  else { $files += $item.FullName }
}
if ($files.Count -eq 0) { Write-Host "ABORT: no .ps1/.psd1/.py files found"; exit 2 }

$bad = 0
foreach ($f in ($files | Sort-Object -Unique)) {
  if ($f -match '\.py$') {
    # 经 cmd 合并 stderr:PS 5.1 对原生进程用 2>&1 会把 stderr 包成 ErrorRecord,
    # EAP=Stop 下 py_compile 的语法错回溯就直接抛出来了(shell-conventions 成型解法)。
    $out = @(cmd /c "python -B -m py_compile ""$f"" 2>&1")
    if ($LASTEXITCODE -ne 0) {
      $bad++
      Write-Host ("FAIL {0} (python syntax)" -f $f)
      $out | Select-Object -First 5 | ForEach-Object { Write-Host ("  {0}" -f $_) }
    } else {
      Write-Host ("OK   {0}" -f $f)
    }
    continue
  }
  # BOM 检查先于 parse:[Parser] 是否按 UTF-8 解码随引擎而定,按 UTF-8 解码的引擎上无 BOM 也
  # parse 通过;而执行侧入口固定 powershell.exe(5.1,无 BOM 按 ANSI 解码 → 中文字面量打乱 →
  # ParserError)。只 parse 的话,含中文且无 BOM 的脚本会在这里报 OK、到 5.1 下才炸(先例:
  # 占用面板.ps1 在 Unity 槽位面板里 ParserError 退出码 1)。故 BOM 单独判,不依赖当前引擎的解码行为。
  $bytes = [System.IO.File]::ReadAllBytes($f)
  $hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
  $hasNonAscii = $false
  foreach ($b in $bytes) { if ($b -gt 0x7F) { $hasNonAscii = $true; break } }
  if ($hasNonAscii -and -not $hasBom) {
    $bad++
    Write-Host ("FAIL {0} (non-ASCII without UTF-8 BOM)" -f $f)
    Write-Host "  script-authoring:含非 ASCII 的 .ps1/.psd1 一律 UTF-8 BOM,否则 PS 5.1 按 ANSI 解码后解析失败。"
    continue
  }
  $tokens = $null; $errors = $null
  [System.Management.Automation.Language.Parser]::ParseFile($f, [ref]$tokens, [ref]$errors) | Out-Null
  if ($errors.Count) {
    $bad++
    Write-Host ("FAIL {0} ({1} error(s))" -f $f, $errors.Count)
    $errors | Select-Object -First 5 | ForEach-Object { Write-Host ("  line {0}: {1}" -f $_.Extent.StartLineNumber, $_.Message) }
    continue
  }
  # psd1 另过一次 Import-PowerShellDataFile:Parser 只管语法,`(Get-Date)` 这类非常量表达式或顶层
  # 非哈希表都能 parse,却会被消费侧(Get-FlowConfig 等)的数据文件加载拒收。
  $importErr = $null
  if ($f -match '\.psd1$') {
    try { [void](Import-PowerShellDataFile -LiteralPath $f -ErrorAction Stop) }
    catch { $importErr = $_.Exception.Message }
  }
  if ($importErr) {
    $bad++
    Write-Host ("FAIL {0} (psd1 data load)" -f $f)
    Write-Host ("  {0}" -f $importErr)
  } else {
    Write-Host ("OK   {0}" -f $f)
  }
}
if ($bad) { exit 1 }
exit 0
