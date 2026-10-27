# 安全区结构核对测试.ps1 — 安全区结构核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 覆盖:基线 clean / 组件挂业务名节点判违规 / 安全区后缀名放行 / 中文名 \uXXXX 转义解码 /
#   mask 嵌在安全区子树判违规(直接子 + 隔层) / mask 与安全区平级放行 / 同 prefab 多安全区节点
#   只报违规那个 / 非 UISafeArea 的 114 块不误判 / guid 取自 meta 而非写死 / meta 缺失跳过 /
#   Assets 缺失 INFRA / vendored 前缀跳过。
# 夹具的 guid 是自造值(不是工程里 UISafeArea 的真 guid):实现若把 guid 写死,全部用例当场失败。
# 跑法:安全区结构核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 安全区结构核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "安全区结构核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-safearea-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

# 自造 guid:与工程里 UISafeArea 的真 guid 无关,用来证明实现是从 meta 读的。
$script:FakeGuid = "aaaabbbbccccddddeeeeffff00001111"

# 安全区节点名的 \uXXXX 转义形态(Unity 对非 ASCII 的 m_Name 就是这么写的)。
$script:SafeEsc       = '"安全区"'                          # 安全区
$script:SafeSuffixEsc = '"安全区_跳过钮"'       # 安全区_跳过钮
$script:BizEsc        = '"主面板"'                          # 主面板

# 造「GameObject + RectTransform(+ 可选 MonoBehaviour)」的最小 prefab 块。
# GoId 是 GameObject fileID,其 RectTransform 恒为 GoId+1、MonoBehaviour 恒为 GoId+2,
# 故 Father 传的是父节点的 GoId+1(父 transform 的 fileID),根节点传 0。
function New-NodeText([hashtable]$O) {
  $go     = $O.GoId
  $father = if ($O.ContainsKey('Father')) { $O.Father } else { 0 }
  $guid   = if ($O.ContainsKey('Guid')) { $O.Guid } else { $script:FakeGuid }
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine("--- !u!1 &$go")
  [void]$sb.AppendLine("GameObject:")
  [void]$sb.AppendLine("  m_Name: $($O.Name)")
  [void]$sb.AppendLine("--- !u!224 &" + ($go + 1))
  [void]$sb.AppendLine("RectTransform:")
  [void]$sb.AppendLine("  m_GameObject: {fileID: $go}")
  [void]$sb.AppendLine("  m_Father: {fileID: $father}")
  [void]$sb.AppendLine("  m_AnchorMin: {x: 0, y: 0}")
  [void]$sb.AppendLine("  m_AnchorMax: {x: 1, y: 1}")
  if ($O.ContainsKey('SafeArea') -and $O.SafeArea) {
    [void]$sb.AppendLine("--- !u!114 &" + ($go + 2))
    [void]$sb.AppendLine("MonoBehaviour:")
    [void]$sb.AppendLine("  m_GameObject: {fileID: $go}")
    [void]$sb.AppendLine("  m_Script: {fileID: 11500000, guid: $guid, type: 3}")
    [void]$sb.AppendLine("    _top: 1")
    [void]$sb.AppendLine("    _bottom: 1")
  }
  return $sb.ToString()
}

function New-Proj([array]$Nodes, [switch]$NoAssets, [switch]$NoMeta, [string]$SubDir = "AssetRaw\UI") {
  $proj = Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))
  if ($NoAssets) { New-Item -ItemType Directory -Force -Path $proj | Out-Null; return $proj }
  $dir = Join-Path $proj (Join-Path "Assets" $SubDir)
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  if (-not $NoMeta) {
    $scriptDir = Join-Path $proj "Assets\GameScripts"
    New-Item -ItemType Directory -Force -Path $scriptDir | Out-Null
    [System.IO.File]::WriteAllText((Join-Path $scriptDir "UISafeArea.cs.meta"),
      "fileFormatVersion: 2`nguid: $script:FakeGuid`n",
      (New-Object System.Text.UTF8Encoding($false)))
  }
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine("%YAML 1.1")
  foreach ($n in $Nodes) { [void]$sb.Append((New-NodeText $n)) }
  [System.IO.File]::WriteAllText((Join-Path $dir "UIFooPanel.prefab"), $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
  return $proj
}

# 窗根恒为 GoId 100(其 transform = 101);其余节点按需挂在 101 或更深。
function Root() { return @{ GoId = 100; Name = 'UIFooPanel' } }

Write-Host "== 安全区结构核对 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 基线:安全区节点名合规、mask 与它平级挂在窗根下
  $r = Invoke-ScanCheck $Target (New-Proj @(
    (Root),
    @{ GoId = 200; Name = $script:SafeEsc; Father = 101; SafeArea = $true },
    @{ GoId = 300; Name = 'm_btn_Mask';    Father = 101 }
  ))
  Assert-True ($r.code -eq 0 -and $r.out -match 'clean') "T1 安全区命名合规 + mask 平级 -> clean"

  # T2 组件挂在业务名节点上:边界不可辨,这是本道的首要不变量
  $r = Invoke-ScanCheck $Target (New-Proj @(
    (Root),
    @{ GoId = 200; Name = $script:BizEsc; Father = 101; SafeArea = $true }
  ))
  Assert-True ($r.code -eq 1 -and $r.out -match '主面板') "T2 组件挂业务名节点 -> 违规且报出该名"

  # T3 后缀名放行(UIStoryDialogPanel 的 安全区_跳过钮 就是这个形态:同窗多个安全区子树)
  $r = Invoke-ScanCheck $Target (New-Proj @(
    (Root),
    @{ GoId = 200; Name = $script:SafeSuffixEsc; Father = 101; SafeArea = $true }
  ))
  Assert-True ($r.code -eq 0) "T3 安全区带后缀 -> 放行"

  # T4 mask 直接落在安全区节点下
  $r = Invoke-ScanCheck $Target (New-Proj @(
    (Root),
    @{ GoId = 200; Name = $script:SafeEsc; Father = 101; SafeArea = $true },
    @{ GoId = 300; Name = 'm_btn_Mask';    Father = 201 }
  ))
  Assert-True ($r.code -eq 1 -and $r.out -match 'm_btn_Mask') "T4 mask 在安全区下 -> 违规"

  # T5 隔一层也要抓到:上溯不能只看直接父节点
  $r = Invoke-ScanCheck $Target (New-Proj @(
    (Root),
    @{ GoId = 200; Name = $script:SafeEsc; Father = 101; SafeArea = $true },
    @{ GoId = 300; Name = 'Middle';        Father = 201 },
    @{ GoId = 400; Name = 'm_btn_Mask';    Father = 301 }
  ))
  Assert-True ($r.code -eq 1 -and $r.out -match 'm_btn_Mask') "T5 mask 隔层嵌在安全区下 -> 违规"

  # T6 mask 挂在安全区的同级更深处(不在其子树内)不算违规
  $r = Invoke-ScanCheck $Target (New-Proj @(
    (Root),
    @{ GoId = 200; Name = $script:SafeEsc; Father = 101; SafeArea = $true },
    @{ GoId = 300; Name = 'Other';         Father = 101 },
    @{ GoId = 400; Name = 'm_btn_Mask';    Father = 301 }
  ))
  Assert-True ($r.code -eq 0) "T6 mask 在安全区的兄弟子树内 -> 放行"

  # T7 同 prefab 两个安全区节点,只报不合规那个
  $r = Invoke-ScanCheck $Target (New-Proj @(
    (Root),
    @{ GoId = 200; Name = $script:SafeEsc; Father = 101; SafeArea = $true },
    @{ GoId = 300; Name = $script:BizEsc;  Father = 101; SafeArea = $true }
  ))
  Assert-True ($r.code -eq 1 -and $r.out -match '主面板' -and ($r.out -notmatch "安全区 - UISafeArea")) "T7 多安全区节点混排 -> 只报违规那个"

  # T8 别的组件挂在业务名节点上不误判(guid 不同)
  $r = Invoke-ScanCheck $Target (New-Proj @(
    (Root),
    @{ GoId = 200; Name = $script:BizEsc; Father = 101; SafeArea = $true; Guid = '0000000000000000f000000000000000' }
  ))
  Assert-True ($r.code -eq 0) "T8 非 UISafeArea 的 114 块 -> 不误判"

  # T9 meta 里的 guid 换一个,prefab 仍引用旧 guid:实现按 meta 认,故此例不再判为安全区节点
  $proj = New-Proj @(
    (Root),
    @{ GoId = 200; Name = $script:BizEsc; Father = 101; SafeArea = $true }
  )
  [System.IO.File]::WriteAllText((Join-Path $proj "Assets\GameScripts\UISafeArea.cs.meta"),
    "fileFormatVersion: 2`nguid: 99998888777766665555444433332222`n",
    (New-Object System.Text.UTF8Encoding($false)))
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 0) "T9 guid 取自 meta(换 guid 后同一 prefab 不再命中)"

  # T10 meta 缺失 = 该分支没有这个组件,跳过而非 INFRA
  $r = Invoke-ScanCheck $Target (New-Proj @(
    (Root),
    @{ GoId = 200; Name = $script:BizEsc; Father = 101; SafeArea = $true }
  ) -NoMeta)
  Assert-True ($r.code -eq 0 -and $r.out -match 'not found') "T10 meta 缺失 -> 跳过"

  # T11 INFRA:Assets 缺失
  $r = Invoke-ScanCheck $Target (New-Proj @() -NoAssets)
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T11 Assets 缺失 -> INFRA"

  # T12 vendored 前缀排除:节点数据与 T2 逐字相同,只有路径不同
  $r = Invoke-ScanCheck $Target (New-Proj @(
    (Root),
    @{ GoId = 200; Name = $script:BizEsc; Father = 101; SafeArea = $true }
  ) -SubDir "ThirdParty\Foo")
  Assert-True ($r.code -eq 0) "T12 vendored 前缀 ThirdParty/ -> 跳过"
}
finally {
  Remove-FixtureTree $script:fx
}
Exit-TestSuite
