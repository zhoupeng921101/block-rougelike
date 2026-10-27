# 热更程序集核对测试.ps1 — 热更程序集核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 覆盖四条不变量各自的违规路径:白名单多项 / 缺项、热更与 AOT 互斥、双文件逐项同步、
# HybridCLRSettings 侧旁路列表(hotUpdateAssemblyDefinitions / preserveHotUpdateAssemblies)须为空。
# 另覆盖解析边界:键重复(只取首处会漏看后一处)、流式非空列表(按空解会放过)、键缺失与 asset 缺失 INFRA。
# 夹具自造最小两个 asset,不读真工程——结论不随真工程清单漂移。
# 跑法:热更程序集核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 热更程序集核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "热更程序集核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-hotasm-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

$script:Hot    = @("GameLogic.dll")   # 与被测脚本 $Whitelist 同值(本作只有 GameLogic 一个热更程序集)
$script:Aot    = @("mscorlib.dll", "TEngine.Runtime.dll")
$script:AsmRef = "{fileID: 5897886265953266890, guid: 0123456789abcdef0123456789abcdef, type: 3}"

# YAML 列表块:$null = 整键不写;@() = `Key: []`;字符串 = 原样作键值(模拟流式写法)。
function Format-YamlList([string]$Key, $Items) {
  if ($null -eq $Items) { return "" }
  if ($Items -is [string]) { return "  ${Key}: $Items`n" }
  $arr = @($Items)
  if ($arr.Count -eq 0) { return "  ${Key}: []`n" }
  $s = "  ${Key}:`n"
  foreach ($i in $arr) { $s += "  - $i`n" }
  return $s
}

# 缺省即合规基线;各参数覆盖对应列表。$UsExtra / $HcExtra 追加在文件末尾(造重复键用)。
function New-Proj {
  param($Hot = $script:Hot, $Aot = $script:Aot,
        $HcHot = "__derive", $HcAot = "__derive",
        $HcDefs = @(), $HcPreserve = @(),
        [string]$UsExtra = "", [string]$HcExtra = "", [switch]$NoHcAsset)
  if ($HcHot -is [string] -and $HcHot -eq "__derive") { $HcHot = @(@($Hot) | ForEach-Object { $_ -replace '\.dll$', '' }) }
  if ($HcAot -is [string] -and $HcAot -eq "__derive") { $HcAot = $Aot }
  $proj = Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))
  $us = "%YAML 1.1`n--- !u!114 &11400000`nMonoBehaviour:`n  m_Name: UpdateSetting`n" +
        (Format-YamlList "HotUpdateAssemblies" $Hot) + (Format-YamlList "AOTMetaAssemblies" $Aot) +
        "  LogicMainDllName: GameLogic.dll`n" + $UsExtra
  Write-Src (Join-Path $proj "Assets\TEngine\Settings\UpdateSetting.asset") $us
  if (-not $NoHcAsset) {
    $hc = "%YAML 1.1`n--- !u!114 &1`nMonoBehaviour:`n  enable: 1`n" +
          (Format-YamlList "hotUpdateAssemblyDefinitions" $HcDefs) + (Format-YamlList "hotUpdateAssemblies" $HcHot) +
          (Format-YamlList "preserveHotUpdateAssemblies" $HcPreserve) +
          "  hotUpdateDllCompileOutputRootDir: HybridCLRData/HotUpdateDlls`n" +
          (Format-YamlList "patchAOTAssemblies" $HcAot) + "  maxGenericReferenceIteration: 10`n" + $HcExtra
    Write-Src (Join-Path $proj "ProjectSettings\HybridCLRSettings.asset") $hc
  }
  return $proj
}

Write-Host "== 热更程序集核对 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 基线:白名单恰好、互斥、双文件同步、旁路列表为空
  $r = Invoke-ScanCheck $Target (New-Proj)
  Assert-True ($r.code -eq 0 -and $r.out -match 'OK') "T1 合规基线 -> PASS"

  # T2 / T3 不变量①:白名单多项 / 缺项(HybridCLRSettings 同步派生,只让①触发)
  $r = Invoke-ScanCheck $Target (New-Proj -Hot ($script:Hot + "Extra.dll"))
  Assert-True ($r.code -eq 1 -and $r.out -match 'Extra\.dll') "T2 白名单外的项 -> FAIL"
  $r = Invoke-ScanCheck $Target (New-Proj -Hot @())
  Assert-True ($r.code -eq 1 -and $r.out -match 'GameLogic\.dll') "T3 缺白名单项 -> FAIL"

  # T4 不变量②:同一 dll 两列表同在
  $r = Invoke-ScanCheck $Target (New-Proj -Aot ($script:Aot + "GameLogic.dll"))
  Assert-True ($r.code -eq 1 -and $r.out -match 'GameLogic\.dll') "T4 热更与 AOT 同列 -> FAIL"

  # T5 / T6 不变量③:派生物与事实源失配
  $r = Invoke-ScanCheck $Target (New-Proj -HcHot @("GameConfig", "GameLogic"))
  Assert-True ($r.code -eq 1 -and $r.out -match 'hotUpdateAssemblies') "T5 hotUpdateAssemblies 失配 -> FAIL"
  $r = Invoke-ScanCheck $Target (New-Proj -HcAot @("mscorlib.dll"))
  Assert-True ($r.code -eq 1 -and $r.out -match 'patchAOTAssemblies') "T6 patchAOTAssemblies 失配 -> FAIL"

  # T7 / T8 不变量④:HybridCLR 面板可在事实源之外加热更程序集(asmdef 形态 / preserve 名单),
  # ForceUpdateAssemblies 不写这两项,白名单与双文件同步都看不见它们——须恒为空。
  $r = Invoke-ScanCheck $Target (New-Proj -HcDefs @($script:AsmRef))
  Assert-True ($r.code -eq 1 -and $r.out -match 'hotUpdateAssemblyDefinitions') "T7 hotUpdateAssemblyDefinitions 非空 -> FAIL"
  $r = Invoke-ScanCheck $Target (New-Proj -HcPreserve @("Sneaky"))
  Assert-True ($r.code -eq 1 -and $r.out -match 'preserveHotUpdateAssemblies') "T8 preserveHotUpdateAssemblies 非空 -> FAIL"

  # T9 旁路键整个缺失:判不了是否为空,INFRA 而非放过
  $r = Invoke-ScanCheck $Target (New-Proj -HcDefs $null)
  Assert-True ($r.code -eq 2 -and $r.out -match 'hotUpdateAssemblyDefinitions') "T9 旁路键缺失 -> INFRA"

  # T10 键重复:只取首处会拿合规的第一份放过后一份。无法判定哪份生效,INFRA 点名该键。
  $dup = "  HotUpdateAssemblies:`n  - GameConfig.dll`n  - Extra.dll`n"
  $r = Invoke-ScanCheck $Target (New-Proj -UsExtra $dup)
  Assert-True ($r.code -eq 2 -and $r.out -match 'HotUpdateAssemblies') "T10 键重复 -> INFRA"

  # T11 流式非空列表:按块列表解析会得到空集并放过,须报解析不出
  $r = Invoke-ScanCheck $Target (New-Proj -Aot "[mscorlib.dll]" -HcAot "[mscorlib.dll]")
  Assert-True ($r.code -eq 2 -and $r.out -match 'AOTMetaAssemblies') "T11 流式非空列表 -> INFRA"

  # T12 键名区分大小写:HybridCLRSettings 的小写 hotUpdateAssemblies 不得被 UpdateSetting 的大写键命中
  # (反之亦然);在 UpdateSetting 里放一个小写同名键,不应干扰大写键的唯一性判定。
  $r = Invoke-ScanCheck $Target (New-Proj -UsExtra "  hotUpdateAssemblies: []`n")
  Assert-True ($r.code -eq 0) "T12 键名大小写不同 -> 不算重复"

  # T13 INFRA:asset 缺失
  $r = Invoke-ScanCheck $Target (New-Proj -NoHcAsset)
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T13 HybridCLRSettings 缺失 -> INFRA"
}
finally {
  Remove-FixtureTree $script:fx
}
Exit-TestSuite
