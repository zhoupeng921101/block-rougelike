# 平台宏核对.ps1 - static check of per-platform scripting define symbols against the policy manifest.
# 准入: Since=2026-08-04 | Basis=存量 | Origin=1f41646ec 入库,引入事故无记载 | Retire=平台宏改由构建脚本单点注入、PlatformDefinePolicy 退役时
# Invariant: every rule in ProjectSettings/PlatformDefinePolicy.json holds across the covered platforms —
#   required  : the symbol must be present on each listed platform
#   exclusive : the symbol may appear ONLY on the listed platforms (absent on every other covered platform)
# Why a gate check: the platform define strings are independent hand-maintained lists with nothing tying
# them together, so a missing symbol only surfaces when someone switches to that build target. iOS
# silently lacked FANTASY_UNITY (2026-08-04): Fantasy.Unity is excluded by its
# defineConstraints there, breaking GameLogic and Launcher reference resolution on that target.
#
# The manifest is the single source of truth and is shared with TEngine.Editor.PlatformDefinePolicy
# (editor menu TEngine/Platform Define Symbols/*, which can auto-align). This script must NOT carry a
# symbol list of its own - a second copy is exactly the failure mode the manifest exists to remove.
# Runs pre-Unity inside the client gate (客户端自检.ps1, main project and slots alike); pure text scan.
# Exit codes: 0 clean, 1 violation (printed), 2 manifest / ProjectSettings missing or unparsable.
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # a Demo root (has ProjectSettings/)
)
$ErrorActionPreference = "Stop"

$ProjectDir   = $ProjectDir.TrimEnd('\')
$manifestPath = Join-Path $ProjectDir "ProjectSettings/PlatformDefinePolicy.json"
$settingsPath = Join-Path $ProjectDir "ProjectSettings/ProjectSettings.asset"

foreach ($p in @($manifestPath, $settingsPath)) {
  if (-not (Test-Path $p)) { Write-Host "PLATFORM DEFINE CHECK : INFRA - '$p' not found (layout changed? sync 平台宏核对.ps1)"; exit 2 }
}

# BuildTargetGroup 枚举名(清单里的写法) -> ProjectSettings.asset 的序列化键名。
# 二者多数同名,少数是 Unity 的历史遗留序列化名;这是文件格式适配,不是业务策略。
# 未列出的平台按同名处理。
$PlatformKeyOverride = @{ "iOS" = "iPhone"; "WSA" = "Windows Store Apps" }

# .NET ReadAllText 自动识别并剥离 BOM;清单含中文 reason,PS 5.1 的 Get-Content 在无 BOM 时会按 ANSI 误解码。
try { $manifest = [System.IO.File]::ReadAllText($manifestPath) | ConvertFrom-Json }
catch { Write-Host "PLATFORM DEFINE CHECK : INFRA - manifest is not valid JSON ($($_.Exception.Message))"; exit 2 }

if (-not $manifest.coveredPlatforms -or $manifest.coveredPlatforms.Count -eq 0) {
  Write-Host "PLATFORM DEFINE CHECK : INFRA - manifest declares no coveredPlatforms"; exit 2
}
if ($null -eq $manifest.rules) {
  Write-Host "PLATFORM DEFINE CHECK : INFRA - manifest declares no rules"; exit 2
}

# 解析 ProjectSettings.asset 的 scriptingDefineSymbols 段:
#   段首为 2 空格缩进的 "scriptingDefineSymbols:",条目为 4 空格缩进的 "<Key>: <a;b;c>",
#   遇到下一个 2 空格缩进的键即段末。平台键缺席 = 该平台无任何自定义宏(合法,按空集处理)。
$definesByKey = @{}
$inSection = $false
foreach ($line in [System.IO.File]::ReadAllLines($settingsPath)) {
  if (-not $inSection) {
    if ($line -match '^  scriptingDefineSymbols:\s*$') { $inSection = $true }
    continue
  }
  if ($line -match '^    (?<key>[^:]+):(?<val>.*)$') {
    $definesByKey[$Matches.key.Trim()] = @(
      $Matches.val.Trim() -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' })
    continue
  }
  if ($line -match '^  \S') { break }   # 下一个同级键 = 段结束
}
if (-not $inSection) {
  Write-Host "PLATFORM DEFINE CHECK : INFRA - scriptingDefineSymbols section not found in ProjectSettings.asset"; exit 2
}

function Get-PlatformKey([string]$Platform) {
  if ($PlatformKeyOverride.ContainsKey($Platform)) { return $PlatformKeyOverride[$Platform] }
  return $Platform
}

function Test-HasSymbol([string]$Platform, [string]$Symbol) {
  $key = Get-PlatformKey $Platform
  if (-not $definesByKey.ContainsKey($key)) { return $false }
  return ($definesByKey[$key] -ccontains $Symbol)   # 宏名大小写敏感
}

$violations = New-Object System.Collections.Generic.List[string]

foreach ($rule in $manifest.rules) {
  if ([string]::IsNullOrWhiteSpace($rule.symbol)) {
    Write-Host "PLATFORM DEFINE CHECK : INFRA - manifest has a rule with an empty symbol"; exit 2
  }
  if ($null -eq $rule.platforms -or $rule.platforms.Count -eq 0) {
    Write-Host "PLATFORM DEFINE CHECK : INFRA - rule '$($rule.symbol)' lists no platforms"; exit 2
  }
  foreach ($p in $rule.platforms) {
    if ($manifest.coveredPlatforms -notcontains $p) {
      Write-Host "PLATFORM DEFINE CHECK : INFRA - rule '$($rule.symbol)' references platform '$p' outside coveredPlatforms"; exit 2
    }
  }

  switch ($rule.policy) {
    "required" {
      foreach ($p in $rule.platforms) {
        if (-not (Test-HasSymbol $p $rule.symbol)) {
          $violations.Add("[$p] '$($rule.symbol)' is required but missing - $($rule.reason)")
        }
      }
    }
    "exclusive" {
      foreach ($p in $manifest.coveredPlatforms) {
        if ($rule.platforms -contains $p) { continue }
        if (Test-HasSymbol $p $rule.symbol) {
          $violations.Add("[$p] '$($rule.symbol)' is exclusive to [$($rule.platforms -join ', ')] but present here - $($rule.reason)")
        }
      }
    }
    default {
      Write-Host "PLATFORM DEFINE CHECK : INFRA - rule '$($rule.symbol)' has unknown policy '$($rule.policy)' (expected 'required' or 'exclusive')"; exit 2
    }
  }
}

if ($violations.Count -gt 0) {
  Write-Host "PLATFORM DEFINE CHECK : $($violations.Count) violation(s)"
  $violations | ForEach-Object { Write-Host "  $_" }
  Write-Host "  fix: Unity menu TEngine/Platform Define Symbols/Align To Policy (or edit the manifest if the policy itself changed)"
  exit 1
}
Write-Host "PLATFORM DEFINE CHECK : clean"
exit 0
