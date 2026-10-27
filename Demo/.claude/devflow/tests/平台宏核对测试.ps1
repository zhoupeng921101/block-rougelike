# 平台宏核对测试.ps1 — 平台宏核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 覆盖:基线 clean / required 缺失 / 平台键整行缺席 / iOS->iPhone 序列化键名映射 /
#   exclusive 越界 / exclusive 归属平台自身不误判 / 宏名大小写敏感 /
#   未知 policy、规则引用越界平台、清单 JSON 损坏、清单缺失、defines 段缺失 五类 INFRA /
#   中文 reason 不乱码。
# 夹具自造最小 ProjectSettings.asset 与清单,不读真工程——测试结论不随真工程的宏配置漂移。
# 跑法:平台宏核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 平台宏核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
# PS 5.1 捕获被测子 powershell 输出按 [Console]::OutputEncoding 解码,不置 UTF-8 中文断言假失败。
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "平台宏核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-pdefine-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null
$enc = New-Object System.Text.UTF8Encoding($true)

# 最小 ProjectSettings.asset:只需 scriptingDefineSymbols 段可解析,前后各留一个同级键验证段边界。
function New-SettingsText([hashtable]$DefinesByKey) {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine("%YAML 1.1")
  [void]$sb.AppendLine("--- !u!129 &1")
  [void]$sb.AppendLine("PlayerSettings:")
  [void]$sb.AppendLine("  m_ObjectHideFlags: 0")
  [void]$sb.AppendLine("  scriptingDefineSymbols:")
  foreach ($k in $DefinesByKey.Keys) { [void]$sb.AppendLine("    ${k}: $($DefinesByKey[$k])") }
  [void]$sb.AppendLine("  additionalCompilerArguments: {}")
  return $sb.ToString()
}

function Get-GoodDefines {
  return [ordered]@{
    "Android"    = "ENABLE_LOG;FANTASY_UNITY;ENABLE_HYBRIDCLR"
    "Standalone" = "ENABLE_LOG;FANTASY_UNITY;ENABLE_HYBRIDCLR"
    "WebGL"      = "ENABLE_LOG;FANTASY_UNITY;ENABLE_HYBRIDCLR;FANTASY_WEBGL"
    "iPhone"     = "ENABLE_LOG;FANTASY_UNITY;ENABLE_HYBRIDCLR"
  }
}

function Get-GoodManifest {
  return @'
{
  "coveredPlatforms": [ "Standalone", "Android", "iOS", "WebGL" ],
  "rules": [
    {
      "symbol": "FANTASY_UNITY",
      "policy": "required",
      "platforms": [ "Standalone", "Android", "iOS", "WebGL" ],
      "reason": "框架双端编译的总开关"
    },
    {
      "symbol": "FANTASY_WEBGL",
      "policy": "exclusive",
      "platforms": [ "WebGL" ],
      "reason": "单线程实现开关"
    }
  ]
}
'@
}

# 每个用例一套独立工程目录,互不串味。
function New-Proj([hashtable]$DefinesByKey, [string]$ManifestText) {
  $root = Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))
  $ps = Join-Path $root "ProjectSettings"
  New-Item -ItemType Directory -Force -Path $ps | Out-Null
  if ($null -ne $DefinesByKey) {
    [System.IO.File]::WriteAllText((Join-Path $ps "ProjectSettings.asset"), (New-SettingsText $DefinesByKey), $enc)
  }
  # 传 $null / "" 表示不落清单文件([string] 形参会把 $null 归一成空串,故按空串判)。
  if (-not [string]::IsNullOrEmpty($ManifestText)) {
    [System.IO.File]::WriteAllText((Join-Path $ps "PlatformDefinePolicy.json"), $ManifestText, $enc)
  }
  return $root
}

Write-Host "== 平台宏核对 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 基线合规
  $r = Invoke-ScanCheck $Target (New-Proj (Get-GoodDefines) (Get-GoodManifest))
  Assert-True ($r.code -eq 0 -and $r.out -match 'clean') "T1 合规配置 -> clean"

  # T2 required 缺失,且验 iOS -> iPhone 序列化键名映射(清单写 iOS,资产键写 iPhone)
  $d = Get-GoodDefines; $d["iPhone"] = "ENABLE_LOG;ENABLE_HYBRIDCLR"
  $r = Invoke-ScanCheck $Target (New-Proj $d (Get-GoodManifest))
  Assert-True ($r.code -eq 1 -and $r.out -match "\[iOS\] 'FANTASY_UNITY' is required but missing") "T2 iOS 缺 required 宏 -> 违规(键名映射生效)"

  # T3 平台键整行缺席 = 该平台无任何宏,同样判 required 缺失
  $d = Get-GoodDefines; $d.Remove("iPhone")
  $r = Invoke-ScanCheck $Target (New-Proj $d (Get-GoodManifest))
  Assert-True ($r.code -eq 1 -and $r.out -match "\[iOS\] 'FANTASY_UNITY' is required but missing") "T3 平台键整行缺席 -> 违规"

  # T4 exclusive 越界
  $d = Get-GoodDefines; $d["Standalone"] = $d["Standalone"] + ";FANTASY_WEBGL"
  $r = Invoke-ScanCheck $Target (New-Proj $d (Get-GoodManifest))
  Assert-True ($r.code -eq 1 -and $r.out -match "\[Standalone\] 'FANTASY_WEBGL' is exclusive") "T4 exclusive 宏越界 -> 违规"

  # T5 exclusive 宏在其归属平台上不判违规(T1 已含 WebGL 持有该宏,此处单独固化语义)
  $d = Get-GoodDefines; $d["WebGL"] = "FANTASY_UNITY;ENABLE_HYBRIDCLR;FANTASY_WEBGL"
  $r = Invoke-ScanCheck $Target (New-Proj $d (Get-GoodManifest))
  Assert-True ($r.code -eq 0) "T5 exclusive 宏在归属平台 -> clean"

  # T6 宏名大小写敏感:fantasy_unity 不算 FANTASY_UNITY
  $d = Get-GoodDefines; $d["Android"] = "ENABLE_LOG;fantasy_unity;ENABLE_HYBRIDCLR"
  $r = Invoke-ScanCheck $Target (New-Proj $d (Get-GoodManifest))
  Assert-True ($r.code -eq 1 -and $r.out -match "\[Android\] 'FANTASY_UNITY' is required but missing") "T6 宏名大小写敏感"

  # T7 未知 policy -> INFRA
  $m = (Get-GoodManifest) -replace '"policy": "exclusive"', '"policy": "forbidden"'
  $r = Invoke-ScanCheck $Target (New-Proj (Get-GoodDefines) $m)
  Assert-True ($r.code -eq 2 -and $r.out -match 'unknown policy') "T7 未知 policy -> INFRA"

  # T8 规则引用 coveredPlatforms 之外的平台 -> INFRA
  $m = (Get-GoodManifest) -replace '(?s)("symbol": "FANTASY_WEBGL".*?"platforms": \[ )"WebGL"', '$1"Switch"'
  $r = Invoke-ScanCheck $Target (New-Proj (Get-GoodDefines) $m)
  Assert-True ($r.code -eq 2 -and $r.out -match 'outside coveredPlatforms') "T8 规则引用越界平台 -> INFRA"

  # T9 清单 JSON 损坏 -> INFRA
  $r = Invoke-ScanCheck $Target (New-Proj (Get-GoodDefines) "{ this is not json")
  Assert-True ($r.code -eq 2 -and $r.out -match 'not valid JSON') "T9 清单 JSON 损坏 -> INFRA"

  # T10 清单缺失 -> INFRA
  $r = Invoke-ScanCheck $Target (New-Proj (Get-GoodDefines) $null)
  Assert-True ($r.code -eq 2 -and $r.out -match 'not found') "T10 清单缺失 -> INFRA"

  # T11 ProjectSettings.asset 缺失 -> INFRA
  $r = Invoke-ScanCheck $Target (New-Proj $null (Get-GoodManifest))
  Assert-True ($r.code -eq 2 -and $r.out -match 'not found') "T11 ProjectSettings.asset 缺失 -> INFRA"

  # T12 scriptingDefineSymbols 段缺失 -> INFRA
  $root = New-Proj (Get-GoodDefines) (Get-GoodManifest)
  $p = Join-Path $root "ProjectSettings\ProjectSettings.asset"
  $t = [System.IO.File]::ReadAllText($p) -replace '(?m)^  scriptingDefineSymbols:', '  someOtherKey:'
  [System.IO.File]::WriteAllText($p, $t, $enc)
  $r = Invoke-ScanCheck $Target $root
  Assert-True ($r.code -eq 2 -and $r.out -match 'section not found') "T12 defines 段缺失 -> INFRA"

  # T13 清单里的中文 reason 原样输出,不乱码
  $d = Get-GoodDefines; $d["iPhone"] = "ENABLE_LOG;ENABLE_HYBRIDCLR"
  $r = Invoke-ScanCheck $Target (New-Proj $d (Get-GoodManifest))
  Assert-True ($r.out -match '框架双端编译的总开关') "T13 中文 reason 不乱码"

  # T14 空 coveredPlatforms -> INFRA
  $m = (Get-GoodManifest) -replace '"coveredPlatforms": \[ "Standalone", "Android", "iOS", "WebGL" \]', '"coveredPlatforms": []'
  $r = Invoke-ScanCheck $Target (New-Proj (Get-GoodDefines) $m)
  Assert-True ($r.code -eq 2 -and $r.out -match 'no coveredPlatforms') "T14 空 coveredPlatforms -> INFRA"
}
finally {
  Remove-Fixture
}

Write-Host ""
Exit-TestSuite
