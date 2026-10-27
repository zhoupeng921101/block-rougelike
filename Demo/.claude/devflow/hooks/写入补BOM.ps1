# 写入补BOM.ps1 - PostToolUse hook on Write/Edit(settings.json 以 if 限定 *.ps1 / *.psd1):
# 写完的 PowerShell 文件含非 ASCII 字节且无 UTF-8 BOM 时,原字节前补 EF BB BF。
# 为什么:5.1 把无 BOM 文件按系统 ANSI(GBK)读,中文字面量打乱成解析错,hook 脚本则以失败放行
# 静默失效(rules-rationale#shell-bom-fail-open)。Write 工具新建文件不写 BOM,覆盖已有 BOM 的文件
# 也会把 BOM 去掉(2026-09-27 实测;Edit 保留原 BOM,但给纯 ASCII 文件加中文时同样缺 BOM)。
# 覆盖面:经 Write/Edit 写入的 .ps1/.psd1,含仓外 scratchpad。未覆盖:经命令写入(heredoc、
# Set-Content、python 等)——那条路径仍靠 语法自检.ps1 与 shell-conventions 的补 BOM 写法。
# 只补 BOM、不转码:文件本身若不是 UTF-8(如 GBK 字节),补 BOM 会让它按 UTF-8 解成乱码,故非法
# UTF-8 序列时不动并回报。回报走 additionalContext,让会话知道文件被改过。
# 失败放行:内部异常 exit 0 并记遥测 error 行。
$ErrorActionPreference = "Continue"
. (Join-Path $PSScriptRoot "hook函数库.ps1")

function Write-PostNote([string]$Note) {
  $obj = @{ hookSpecificOutput = @{ hookEventName = "PostToolUse"; additionalContext = $Note } }
  $bytes = [System.Text.Encoding]::UTF8.GetBytes(($obj | ConvertTo-Json -Depth 5 -Compress))
  $out = [Console]::OpenStandardOutput()
  $out.Write($bytes, 0, $bytes.Length); $out.Flush()
}

try {
  $in = Read-HookInput
  if (-not $in -or -not $in.tool_input) { exit 0 }
  $fp = [string]$in.tool_input.file_path
  if (-not $fp -or $fp -notmatch '(?i)\.ps(d?)1$') { exit 0 }
  if (-not [System.IO.File]::Exists($fp)) { exit 0 }
  $b = [System.IO.File]::ReadAllBytes($fp)
  if ($b.Length -ge 3 -and $b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF) { exit 0 }
  $nonAscii = $false
  foreach ($x in $b) { if ($x -ge 0x80) { $nonAscii = $true; break } }
  if (-not $nonAscii) { exit 0 }
  $sid = [string]$in.session_id
  try {
    $null = (New-Object System.Text.UTF8Encoding($false, $true)).GetString($b)
  } catch {
    Write-Telemetry @{ event = "写入补BOM"; decision = "skip"; reason = "not-utf8"; file = $fp; sid = $sid }
    Write-PostNote ("【写入补BOM】" + $fp + " 含非 UTF-8 字节,未补 BOM。PowerShell 5.1 会按 GBK 读它;确认编码后改成 UTF-8 BOM。")
    exit 0
  }
  $withBom = New-Object byte[] ($b.Length + 3)
  $withBom[0] = 0xEF; $withBom[1] = 0xBB; $withBom[2] = 0xBF
  [Array]::Copy($b, 0, $withBom, 3, $b.Length)
  [System.IO.File]::WriteAllBytes($fp, $withBom)
  Write-Telemetry @{ event = "写入补BOM"; decision = "fixed"; tool = [string]$in.tool_name; file = $fp; sid = $sid }
  Write-PostNote ("【写入补BOM】已给 " + $fp + " 补 UTF-8 BOM(含中文的 .ps1/.psd1 无 BOM 时 5.1 按 GBK 解析)。内容未变。")
  exit 0
} catch {
  Write-Telemetry @{ event = "写入补BOM"; decision = "error"; error = [string]$_ }
  exit 0
}
