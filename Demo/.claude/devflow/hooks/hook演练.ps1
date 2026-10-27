# hook演练.ps1 - feed a fabricated hook-input JSON file to a hook script the way
# the harness does (stdin). Engine = Get-FlowEngine = the engine running THIS script, not a
# fixed one. settings.json registers hooks under powershell.exe (5.1), and session commands are
# 5.1 too (shell-conventions), so the drill matches the harness only when launched from
# powershell.exe - launching it from pwsh drills the hook under pwsh instead. Not pinned to
# powershell.exe here on purpose: script-authoring R6 routes every child-engine choice through
# Get-FlowEngine (single source), and a local `Get-Command powershell.exe` would be a second one.
# Uses the cmd|type pipe form: piping from PowerShell 5.1
# directly does not reliably reach the child's stdin (hook then fail-opens silently).
# Exit code: the hook's exit code. Empty output = the hook allowed the call.
[CmdletBinding(PositionalBinding=$false)]
param(
  [Parameter(Mandatory = $true)][string]$Hook,   # hook name ("提交检查") or full path
  [Parameter(Mandatory = $true)][string]$Json    # path to the drill input JSON file
)
$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "hook函数库.ps1")
$engine = Get-FlowEngine
$hookPath = if (Test-Path $Hook) { $Hook } else { Join-Path $PSScriptRoot "$Hook.ps1" }
if (-not (Test-Path $hookPath)) { Write-Host "ABORT: hook '$Hook' not found"; exit 2 }
if (-not (Test-Path $Json))     { Write-Host "ABORT: json '$Json' not found"; exit 2 }

cmd /c "type `"$Json`" | `"$engine`" -NoProfile -ExecutionPolicy Bypass -File `"$hookPath`""
$rc = $LASTEXITCODE
Write-Host ""
Write-Host "(hook exit=$rc; empty output above = allow)"
exit $rc
