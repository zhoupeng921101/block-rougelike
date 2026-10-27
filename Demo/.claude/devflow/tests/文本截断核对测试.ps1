# 文本截断核对测试.ps1 — 文本截断核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 覆盖:基线 clean / 高度不足判违规 / 边界值(恰好等于阈值不判) / Overflow 不受管 /
#   BestFit 跳过 / 垂直拉伸锚点跳过 / 无 RectTransform 跳过 / 非 UI.Text 的 114 块不误判 /
#   违规信息带节点名 / 混排时只报违规节点 / Assets 缺失 INFRA / vendored 前缀跳过。
# 夹具自造最小 prefab YAML(块头、缩进、guid 都按真实序列化形态),不读真工程。
# 跑法:文本截断核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 文本截断核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "文本截断核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-texttrunc-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

# UnityEngine.UI.Text 的内置脚本 guid(实现按 guid 判定,不按 m_EditorClassIdentifier)。
$script:TextGuid = "5f7201a12d95ffc409449d95f23cf332"

# 造一个「GameObject + RectTransform + Text」三块的最小 prefab 文本。
# 缩进按真实序列化形态:m_GameObject / m_SizeDelta 等 2 空格,Text 的字段 4 空格。
function New-TextNodeText([hashtable]$O) {
  $name    = $O.Name
  $sizeY   = $O.SizeY
  $font    = $O.FontSize
  $vover   = if ($O.ContainsKey('VOverflow')) { $O.VOverflow } else { 0 }
  $bestfit = if ($O.ContainsKey('BestFit'))   { $O.BestFit }   else { 0 }
  $aminY   = if ($O.ContainsKey('AnchorMinY')) { $O.AnchorMinY } else { 0.5 }
  $amaxY   = if ($O.ContainsKey('AnchorMaxY')) { $O.AnchorMaxY } else { 0.5 }
  $guid    = if ($O.ContainsKey('Guid')) { $O.Guid } else { $script:TextGuid }
  $go = $O.GoId
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine("--- !u!1 &$go")
  [void]$sb.AppendLine("GameObject:")
  [void]$sb.AppendLine("  m_Name: $name")
  if (-not $O.ContainsKey('NoRect')) {
    [void]$sb.AppendLine("--- !u!224 &" + ($go + 1))
    [void]$sb.AppendLine("RectTransform:")
    [void]$sb.AppendLine("  m_GameObject: {fileID: $go}")
    [void]$sb.AppendLine("  m_AnchorMin: {x: 0.5, y: $aminY}")
    [void]$sb.AppendLine("  m_AnchorMax: {x: 0.5, y: $amaxY}")
    [void]$sb.AppendLine("  m_SizeDelta: {x: 200, y: $sizeY}")
  }
  [void]$sb.AppendLine("--- !u!114 &" + ($go + 2))
  [void]$sb.AppendLine("MonoBehaviour:")
  [void]$sb.AppendLine("  m_GameObject: {fileID: $go}")
  [void]$sb.AppendLine("  m_Script: {fileID: 708705254, guid: $guid, type: 3}")
  [void]$sb.AppendLine("    m_FontSize: $font")
  [void]$sb.AppendLine("    m_BestFit: $bestfit")
  [void]$sb.AppendLine("    m_VerticalOverflow: $vover")
  return $sb.ToString()
}

# SubDir:prefab 落在 Assets 下的哪个子目录。缺省是本项目自有的 UI 目录;传 vendored 前缀
# (ThirdParty\...)即可测排除面,判定逻辑与节点数据完全不变。
function New-Proj([array]$Nodes, [switch]$NoAssets, [string]$SubDir = "AssetRaw\UI") {
  $proj = Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))
  if ($NoAssets) { New-Item -ItemType Directory -Force -Path $proj | Out-Null; return $proj }
  $dir = Join-Path $proj (Join-Path "Assets" $SubDir)
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine("%YAML 1.1")
  $id = 100
  foreach ($n in $Nodes) { $n.GoId = $id; [void]$sb.Append((New-TextNodeText $n)); $id += 10 }
  [System.IO.File]::WriteAllText((Join-Path $dir "UIFooPanel.prefab"), $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
  return $proj
}

Write-Host "== 文本截断核对 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 基线:fontSize 24 需 36,高度 40 够
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ Name='TitleText'; SizeY=40; FontSize=24 }))
  Assert-True ($r.code -eq 0 -and $r.out -match 'clean') "T1 高度充足 -> clean"

  # T2 高度不足:Truncate 会把唯一一行整行截掉,产出空网格且无任何报错
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ Name='TitleText'; SizeY=30; FontSize=24 }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'height 30 < fontSize 24') "T2 高度不足 -> 违规"

  # T3 边界:恰好等于 fontSize x 1.5 不判违规(实现用 -lt)
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ Name='TitleText'; SizeY=36; FontSize=24 }))
  Assert-True ($r.code -eq 0) "T3 高度恰好等于阈值 -> 不判违规"

  # T4 Overflow(m_VerticalOverflow=1)不在本道管辖内
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ Name='TitleText'; SizeY=10; FontSize=24; VOverflow=1 }))
  Assert-True ($r.code -eq 0) "T4 Overflow 模式 -> 不受管"

  # T5 BestFit 自行缩字,不会截没
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ Name='TitleText'; SizeY=10; FontSize=24; BestFit=1 }))
  Assert-True ($r.code -eq 0) "T5 BestFit -> 跳过"

  # T6 垂直拉伸锚点:运行时高度 = 父高 + sizeDelta.y,单文件判不出
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ Name='TitleText'; SizeY=10; FontSize=24; AnchorMinY=0; AnchorMaxY=1 }))
  Assert-True ($r.code -eq 0) "T6 垂直拉伸锚点 -> 跳过"

  # T7 无 RectTransform 的 Text 无从判高度
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ Name='TitleText'; SizeY=10; FontSize=24; NoRect=$true }))
  Assert-True ($r.code -eq 0) "T7 无 RectTransform -> 跳过"

  # T8 非 UI.Text 的 114 块(别的组件)不误判
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ Name='SomeComp'; SizeY=10; FontSize=24; Guid='0000000000000000f000000000000000' }))
  Assert-True ($r.code -eq 0) "T8 非 UI.Text 组件 -> 不误判"

  # T9 违规信息带节点名,便于定位
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ Name='SubTitleText'; SizeY=10; FontSize=24 }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'SubTitleText') "T9 违规信息带节点名"

  # T10 多节点:合规与违规混排时只报违规那个
  $r = Invoke-ScanCheck $Target (New-Proj @(
    @{ Name='OkText';  SizeY=40; FontSize=24 },
    @{ Name='BadText'; SizeY=10; FontSize=24 }
  ))
  Assert-True ($r.code -eq 1 -and $r.out -match 'BadText' -and $r.out -notmatch 'OkText') "T10 混排时只报违规节点"

  # T11 INFRA:Assets 缺失
  $r = Invoke-ScanCheck $Target (New-Proj @() -NoAssets)
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T11 Assets 缺失 -> INFRA"

  # T12 vendored 前缀排除:节点数据与 T2(判违规那例)逐字相同,只有路径不同。
  # 与 T2 对照才证明跳过的依据是路径前缀,而不是判定逻辑对这组尺寸失效了。
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ Name='TitleText'; SizeY=30; FontSize=24 }) -SubDir "ThirdParty\Foo")
  Assert-True ($r.code -eq 0) "T12 vendored 前缀 ThirdParty/ -> 跳过"
}
finally {
  Remove-FixtureTree $script:fx
}
Exit-TestSuite
