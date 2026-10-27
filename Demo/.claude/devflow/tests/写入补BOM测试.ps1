# 写入补BOM测试.ps1 — 写入补BOM hook(PostToolUse:Write/Edit,*.ps1 / *.psd1)的演练矩阵。
# 经 hook演练.ps1 按 harness 方式(stdin JSON、同引擎)喂伪造输入,断言文件字节与回报。
# 覆盖:无 BOM 含中文的 .ps1 / .psd1 / 大写扩展名 -> 补 BOM 且其余字节不变、回报 additionalContext;
#   已有 BOM、纯 ASCII、非 PowerShell 扩展名、文件不存在 -> 不动且静默;非法 UTF-8(GBK 字节)-> 不动并回报。
# 隔离:$env:LOCALAPPDATA 指到夹具内,遥测落夹具;末尾核遥测 error 行为零(失败放行未触发)。
[CmdletBinding(PositionalBinding=$false)]
param()
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
$drill = Join-Path $dfDir "hooks\hook演练.ps1"

$fx = Join-Path $env:TEMP ("flowtest-bomfix-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $fx | Out-Null
$script:fx = $fx
$env:LOCALAPPDATA = Join-Path $fx "lad"

$script:n = 0
function Invoke-BomDrill([string]$FilePath, [string]$Tool = "Write") {
  $script:n++
  $payload = @{ session_id = "drill"; hook_event_name = "PostToolUse"; tool_name = $Tool; cwd = $fx; tool_input = @{ file_path = $FilePath } }
  $j = Join-Path $fx ("d" + $script:n + ".json")
  [System.IO.File]::WriteAllText($j, ($payload | ConvertTo-Json -Depth 4 -Compress), (New-Object System.Text.UTF8Encoding($false)))
  return ((@(& (Get-FlowEngine) -NoProfile -File $drill -Hook "写入补BOM" -Json $j 2>&1 | ForEach-Object { [string]$_ })) -join "`n")
}
function Test-Bom([string]$Path) {
  $b = [System.IO.File]::ReadAllBytes($Path)
  return ($b.Length -ge 3 -and $b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF)
}
function New-File([string]$Name, [byte[]]$Bytes) {
  $p = Join-Path $fx $Name
  [System.IO.File]::WriteAllBytes($p, $Bytes)
  return $p
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$cnBytes = $utf8NoBom.GetBytes("# 中文注释`r`nWrite-Host '好'`r`n")

try {
  # ---------- F:应补 ----------
  foreach ($name in @("a.ps1", "b.psd1", "C.PS1")) {
    $p = New-File $name $cnBytes
    $o = Invoke-BomDrill $p
    $after = [System.IO.File]::ReadAllBytes($p)
    $rest = New-Object byte[] ($after.Length - 3)
    [Array]::Copy($after, 3, $rest, 0, $rest.Length)
    Assert-True ((Test-Bom $p) -and ([Convert]::ToBase64String($rest) -eq [Convert]::ToBase64String($cnBytes))) ("F $name 无 BOM 含中文 -> 补 BOM,其余字节不变")
    Assert-True ($o -match '"additionalContext"' -and $o -match '补 UTF-8 BOM') ("F $name 回报 additionalContext")
  }
  $p = New-File "edit.ps1" $cnBytes
  [void](Invoke-BomDrill $p "Edit")
  Assert-True (Test-Bom $p) "F-edit Edit 工具同样补"

  # ---------- K:不动 ----------
  $bom = [byte[]](0xEF, 0xBB, 0xBF) + $cnBytes
  $p = New-File "has.ps1" $bom
  $o = Invoke-BomDrill $p
  Assert-True (([Convert]::ToBase64String([System.IO.File]::ReadAllBytes($p)) -eq [Convert]::ToBase64String($bom)) -and ($o -notmatch 'additionalContext')) "K1 已有 BOM -> 不动、静默"
  $ascii = [System.Text.Encoding]::ASCII.GetBytes("Write-Host 'hi'`r`n")
  $p = New-File "ascii.ps1" $ascii
  $o = Invoke-BomDrill $p
  Assert-True ((-not (Test-Bom $p)) -and ($o -notmatch 'additionalContext')) "K2 纯 ASCII -> 不补、静默"
  $p = New-File "doc.md" $cnBytes
  [void](Invoke-BomDrill $p)
  Assert-True (-not (Test-Bom $p)) "K3 非 PowerShell 扩展名 -> 不动"
  $o = Invoke-BomDrill (Join-Path $fx "missing.ps1")
  Assert-True ($o -notmatch 'additionalContext') "K4 文件不存在 -> 静默"
  $gbk = [byte[]](0x23, 0x20, 0xD6, 0xD0, 0xCE, 0xC4, 0x0D, 0x0A)
  $p = New-File "gbk.ps1" $gbk
  $o = Invoke-BomDrill $p
  Assert-True ((-not (Test-Bom $p)) -and ($o -match '非 UTF-8')) "K5 GBK 字节 -> 不补并回报"

  # ---------- 活性 ----------
  $telDir = Join-Path $env:LOCALAPPDATA "claude-wf-3b\telemetry"
  $errLines = @()
  if (Test-Path $telDir) { $errLines = @(Get-ChildItem $telDir -Filter *.jsonl | ForEach-Object { Get-Content $_.FullName -Encoding UTF8 } | Where-Object { $_ -match '"decision":"error"' }) }
  Assert-True ($errLines.Count -eq 0) ("L1 遥测无 error 行(失败放行未触发)" + $(if ($errLines.Count) { ": " + $errLines[0] } else { "" }))
}
finally { Remove-Fixture }

Write-Host ""
Exit-TestSuite
