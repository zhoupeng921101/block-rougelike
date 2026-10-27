# 图集子图组件核对测试.ps1 — 图集子图组件核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 覆盖:基线 clean(绑图集的 ExImage)/ 原生 Image 显示图集子图判 IMAGE 并报中文节点名 /
#   ExImage 缺图集判 NO-ATLAS(写成 {fileID: 0} 与缺键两形)/ 贴图被多图集打包判 MULTI /
#   ExImage 绑的图集与 Source Image 所属图集不同放行 / 非图集贴图的原生 Image 放行 /
#   packables 之后的 m_MasterAtlas 引用不算成员 / stripped 块不误判 / 其它 MonoBehaviour 不误判 /
#   ExImage guid 取自 meta 而非写死 / meta 缺失跳过 / 扫描面外的 prefab 不扫 / Assets 缺失 INFRA /
#   packables 未收的图集目录新图按 AtlasConfiguration 目录规则推断成员(源根直属 / exclude / autoGenerate 关 /
#   非图片不推断,single / rootChild 粒度,packables 优先)/
#   ExImage 绑的图集 guid 无主判 DANGLING(图集整个没了 / 本体在 meta 缺 / meta 在本体缺,与 Source Image 无关;
#   嵌套实例覆写同判)/ 图集放在图集目录外照样解析得到 / 别的组件的同名字段不判。
# 夹具的 ExImage guid 是自造值(不是工程里 ExImage 的真 guid):实现若把它写死,相关用例当场失败。
# 跑法:图集子图组件核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 图集子图组件核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "图集子图组件核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-atlasimg-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

$script:ImageGuid = "fe87c0e1cc204ed48ad3b37840f39efc"   # UGUI Image(包定死,实现允许写死)
$script:ExGuid    = "aaaabbbbccccddddeeeeffff00002222"   # 自造:证明实现从 ExImage.cs.meta 读
$script:OtherGuid = "0000000000000000f000000000000123"   # 别的 MonoBehaviour
$script:TexA      = "11111111111111111111111111111111"   # 只在 AtlasA
$script:TexB      = "22222222222222222222222222222222"   # 只在 AtlasB
$script:TexAB     = "33333333333333333333333333333333"   # 同时在 AtlasA / AtlasB
$script:TexLoose  = "44444444444444444444444444444444"   # 不在任何图集
$script:TexMaster = "55555555555555555555555555555555"   # 只出现在 packables 之后的 m_MasterAtlas 位
$script:AtlasAId  = "a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0"
$script:AtlasBId  = "b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0"
$script:AtlasGone = "d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0"   # 没有任何图集带这个 guid
$script:AtlasFar  = "e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0"   # 放在图集目录之外的图集
$script:IconEsc   = '"任务图标"'           # 任务图标

$script:Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function New-AtlasText([string[]]$Packables, [string]$After = "") {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine("%YAML 1.1")
  [void]$sb.AppendLine("--- !u!612988286 &1")
  [void]$sb.AppendLine("SpriteAtlasAsset:")
  [void]$sb.AppendLine("  m_MasterAtlas: {fileID: 0}")
  [void]$sb.AppendLine("  m_ImporterData:")
  [void]$sb.AppendLine("    packables:")
  foreach ($g in $Packables) { [void]$sb.AppendLine("    - {fileID: 21300000, guid: $g, type: 3}") }
  [void]$sb.AppendLine("  m_IsVariant: 0")
  if ($After) { [void]$sb.AppendLine($After) }
  return $sb.ToString()
}

# 一个 GameObject + 一个图片组件。Kind: Image / Ex(绑 AtlasGuid 指向的图集)/ ExNoAtlas / ExNoKey / Other
#   (带 AtlasGuid 时同样写 spriteAtlas 字段)/ Override(嵌套实例对 spriteAtlas 的覆写,无 GameObject)。
# Tex 缺省 = 不写 m_Sprite(无 Source Image 的按名换图节点)。
function New-NodeText([hashtable]$O) {
  $go = $O.GoId
  $sb = New-Object System.Text.StringBuilder
  if ($O.Kind -eq 'Override') {
    $ref = if ($O.AtlasGuid) { "{fileID: 100100200, guid: $($O.AtlasGuid), type: 3}" } else { "{fileID: 0}" }
    [void]$sb.AppendLine("--- !u!1001 &$go")
    [void]$sb.AppendLine("PrefabInstance:")
    [void]$sb.AppendLine("  m_Modification:")
    [void]$sb.AppendLine("    m_Modifications:")
    [void]$sb.AppendLine("    - target: {fileID: 777, guid: 99999999999999999999999999999999, type: 3}")
    [void]$sb.AppendLine("      propertyPath: m_Sprite")
    [void]$sb.AppendLine("      value: ")
    [void]$sb.AppendLine("      objectReference: {fileID: 21300000, guid: $script:AtlasGone, type: 3}")
    [void]$sb.AppendLine("    - target: {fileID: 778, guid: 99999999999999999999999999999999, type: 3}")
    [void]$sb.AppendLine("      propertyPath: spriteAtlas")
    [void]$sb.AppendLine("      value: ")
    [void]$sb.AppendLine("      objectReference: $ref")
    return $sb.ToString()
  }
  [void]$sb.AppendLine("--- !u!1 &$go")
  [void]$sb.AppendLine("GameObject:")
  [void]$sb.AppendLine("  m_Name: $($O.Name)")
  if ($O.ContainsKey('Stripped') -and $O.Stripped) {
    [void]$sb.AppendLine("--- !u!114 &" + ($go + 1) + " stripped")
    [void]$sb.AppendLine("MonoBehaviour:")
    [void]$sb.AppendLine("  m_CorrespondingSourceObject: {fileID: 42, guid: 99999999999999999999999999999999, type: 3}")
    return $sb.ToString()
  }
  $script = switch ($O.Kind) { 'Image' { $script:ImageGuid } 'Other' { $script:OtherGuid } default { $script:ExGuid } }
  [void]$sb.AppendLine("--- !u!114 &" + ($go + 1))
  [void]$sb.AppendLine("MonoBehaviour:")
  [void]$sb.AppendLine("  m_GameObject: {fileID: $go}")
  [void]$sb.AppendLine("  m_Script: {fileID: 11500000, guid: $script, type: 3}")
  if ($O.Tex) { [void]$sb.AppendLine("  m_Sprite: {fileID: 21300000, guid: $($O.Tex), type: 3}") }
  switch ($O.Kind) {
    'Ex'        { [void]$sb.AppendLine("  spriteAtlas: {fileID: 100100200, guid: $($O.AtlasGuid), type: 3}") }
    'Other'     { if ($O.AtlasGuid) { [void]$sb.AppendLine("  spriteAtlas: {fileID: 100100200, guid: $($O.AtlasGuid), type: 3}") } }
    'ExNoAtlas' { [void]$sb.AppendLine("  spriteAtlas: {fileID: 0}") }
  }
  return $sb.ToString()
}

function New-Proj([array]$Nodes, [switch]$NoAssets, [switch]$NoMeta, [string]$SubDir = "AssetRaw\UI\Prefabs", [string]$MasterTex = "") {
  $proj = Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))
  if ($NoAssets) { New-Item -ItemType Directory -Force -Path $proj | Out-Null; return $proj }
  $atlasDir = Join-Path $proj "Assets\AssetArt\Atlas"
  New-Item -ItemType Directory -Force -Path $atlasDir | Out-Null
  $after = if ($MasterTex) { "  m_SomeRef: {fileID: 21300000, guid: $MasterTex, type: 3}" } else { "" }
  [System.IO.File]::WriteAllText((Join-Path $atlasDir "NewAtlas_a.spriteatlasv2"), (New-AtlasText @($script:TexA, $script:TexAB) $after), $script:Utf8NoBom)
  [System.IO.File]::WriteAllText((Join-Path $atlasDir "NewAtlas_b.spriteatlasv2"), (New-AtlasText @($script:TexB, $script:TexAB)), $script:Utf8NoBom)
  [System.IO.File]::WriteAllText((Join-Path $atlasDir "NewAtlas_a.spriteatlasv2.meta"), "fileFormatVersion: 2`nguid: $script:AtlasAId`n", $script:Utf8NoBom)
  [System.IO.File]::WriteAllText((Join-Path $atlasDir "NewAtlas_b.spriteatlasv2.meta"), "fileFormatVersion: 2`nguid: $script:AtlasBId`n", $script:Utf8NoBom)
  if (-not $NoMeta) {
    $scriptDir = Join-Path $proj "Assets\GameScripts\UGUIExtension"
    New-Item -ItemType Directory -Force -Path $scriptDir | Out-Null
    [System.IO.File]::WriteAllText((Join-Path $scriptDir "ExImage.cs.meta"), "fileFormatVersion: 2`nguid: $script:ExGuid`n", $script:Utf8NoBom)
  }
  New-Item -ItemType Directory -Force -Path (Join-Path $proj "Assets\AssetRaw\UI") | Out-Null
  $dir = Join-Path $proj (Join-Path "Assets" $SubDir)
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine("%YAML 1.1")
  foreach ($n in $Nodes) { [void]$sb.Append((New-NodeText $n)) }
  [System.IO.File]::WriteAllText((Join-Path $dir "UIFooPanel.prefab"), $sb.ToString(), $script:Utf8NoBom)
  return $proj
}

# 目录推断夹具:给工程补 AtlasConfiguration.asset 与若干贴图 meta(贴图本体不需要,实现只读 meta)。
function Add-FolderRule([string]$Proj, [string]$AutoGen = "1", [string[]]$Src = @("Assets/AssetRaw/UI/NewAtlas"),
                        [string[]]$Single = @(), [string[]]$Child = @(), [string[]]$Exclude = @(), [string[]]$Keys = @(), [array]$Tex = @()) {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine("%YAML 1.1")
  [void]$sb.AppendLine("--- !u!114 &1")
  [void]$sb.AppendLine("MonoBehaviour:")
  [void]$sb.AppendLine("  outputAtlasDir: Assets/AssetArt/Atlas")
  foreach ($pair in @(@('sourceAtlasRootDir', $Src), @('rootChildAtlasDir', $Child), @('singleAtlasDir', $Single), @('excludeFolder', $Exclude))) {
    if ($pair[1].Count -eq 0) { [void]$sb.AppendLine("  $($pair[0]): []"); continue }
    [void]$sb.AppendLine("  $($pair[0]):")
    foreach ($v in $pair[1]) { [void]$sb.AppendLine("  - $v") }
  }
  [void]$sb.AppendLine("  padding: 4")
  [void]$sb.AppendLine("  autoGenerate: $AutoGen")
  if ($Keys.Count -eq 0) { [void]$sb.AppendLine("  excludeKeywords: []") }
  else { [void]$sb.AppendLine("  excludeKeywords:"); foreach ($k in $Keys) { [void]$sb.AppendLine("  - $k") } }
  $ps = Join-Path $Proj "ProjectSettings"
  New-Item -ItemType Directory -Force -Path $ps | Out-Null
  [System.IO.File]::WriteAllText((Join-Path $ps "AtlasConfiguration.asset"), $sb.ToString(), $script:Utf8NoBom)
  foreach ($t in $Tex) {
    $full = Join-Path $Proj ($t.Rel.Replace('/', '\'))
    New-Item -ItemType Directory -Force -Path (Split-Path $full -Parent) | Out-Null
    [System.IO.File]::WriteAllText($full + ".meta", "fileFormatVersion: 2`nguid: $($t.Guid)`nTextureImporter:`n", $script:Utf8NoBom)
  }
  return $Proj
}
$script:TexNew = "66666666666666666666666666666666"   # 图集目录下的新图,尚未进任何 packables

Write-Host "== 图集子图组件核对 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 基线:图集子图挂在绑了图集的 ExImage 上
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'Ex'; Tex = $script:TexA; AtlasGuid = $script:AtlasAId }))
  Assert-True ($r.code -eq 0 -and $r.out -match 'clean') "T1 绑图集的 ExImage -> clean"

  # T2 原生 Image 显示图集子图:本道的首要缺陷,报出解码后的中文节点名与所属图集
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = $script:IconEsc; Kind = 'Image'; Tex = $script:TexA }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'IMAGE' -and $r.out -match '任务图标' -and $r.out -match 'NewAtlas_a') "T2 原生 Image + 图集子图 -> IMAGE,报节点名与图集"

  # T3 ExImage 的 spriteAtlas 写成 {fileID: 0}
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'ExNoAtlas'; Tex = $script:TexB }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'NO-ATLAS' -and $r.out -match 'NewAtlas_b') "T3 ExImage 图集为空 -> NO-ATLAS"

  # T4 ExImage 缺 spriteAtlas 键(旧序列化)与写成 0 同义
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'ExNoKey'; Tex = $script:TexB }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'NO-ATLAS') "T4 ExImage 缺 spriteAtlas 键 -> NO-ATLAS"

  # T5 贴图被两个图集打包:菜单跳过这类,单独报 MULTI 并列出两个图集
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'Image'; Tex = $script:TexAB }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'MULTI' -and $r.out -match 'NewAtlas_a' -and $r.out -match 'NewAtlas_b') "T5 多图集打包 -> MULTI"

  # T6 ExImage 绑的图集与 Source Image 所属图集不同:运行时换图用的图集可以故意不同,放行
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'Ex'; Tex = $script:TexA; AtlasGuid = $script:AtlasBId }))
  Assert-True ($r.code -eq 0) "T6 ExImage 绑别的图集 -> 放行"

  # T7 原生 Image 显示非图集贴图(散图 / Texture):不在本道面内
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Bg'; Kind = 'Image'; Tex = $script:TexLoose }))
  Assert-True ($r.code -eq 0) "T7 非图集贴图的原生 Image -> 放行"

  # T8 packables 列表之后的引用不算图集成员
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Bg'; Kind = 'Image'; Tex = $script:TexMaster }) -MasterTex $script:TexMaster)
  Assert-True ($r.code -eq 0) "T8 packables 段外的 guid -> 不算成员"

  # T9 stripped 块(嵌套实例占位)不误判;其它 MonoBehaviour 带 m_Sprite 也不误判
  $r = Invoke-ScanCheck $Target (New-Proj @(
    @{ GoId = 100; Name = 'Nested'; Stripped = $true },
    @{ GoId = 200; Name = 'Custom'; Kind = 'Other'; Tex = $script:TexA }
  ))
  Assert-True ($r.code -eq 0) "T9 stripped 块 / 非 Image 组件 -> 不误判"

  # T10 同 prefab 混排:只报违规那个
  $r = Invoke-ScanCheck $Target (New-Proj @(
    @{ GoId = 100; Name = 'Good'; Kind = 'Ex'; Tex = $script:TexA; AtlasGuid = $script:AtlasAId },
    @{ GoId = 200; Name = 'Bad';  Kind = 'Image'; Tex = $script:TexB }
  ))
  Assert-True ($r.code -eq 1 -and $r.out -match 'Bad' -and $r.out -notmatch ':: Good') "T10 混排 -> 只报违规节点"

  # T11 ExImage guid 取自 meta:meta 换 guid 后,原本合规的 ExImage 不再被认作 ExImage,也不是 Image,故放行
  $proj = New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'ExNoAtlas'; Tex = $script:TexA })
  [System.IO.File]::WriteAllText((Join-Path $proj "Assets\GameScripts\UGUIExtension\ExImage.cs.meta"),
    "fileFormatVersion: 2`nguid: 99998888777766665555444433332222`n", $script:Utf8NoBom)
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 0) "T11 ExImage guid 取自 meta(换 guid 后同一 prefab 不再命中)"

  # T12 meta 缺失 = 该分支没有 ExImage,跳过而非 INFRA
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'Image'; Tex = $script:TexA }) -NoMeta)
  Assert-True ($r.code -eq 0 -and $r.out -match 'not found') "T12 ExImage meta 缺失 -> 跳过"

  # T13 扫描面外(AssetRaw/UI 之外)的 prefab 不扫:与批量校正菜单的缺省扫描目录同口径
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'Image'; Tex = $script:TexA }) -SubDir "AssetRaw\Effects")
  Assert-True ($r.code -eq 0) "T13 AssetRaw/UI 之外 -> 不扫"

  # T14 INFRA:Assets 缺失
  $r = Invoke-ScanCheck $Target (New-Proj @() -NoAssets)
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T14 Assets 缺失 -> INFRA"

  # --- 目录推断:packables 滞后(槽位交付剔除图集改动后跑自检)时按 AtlasConfiguration 目录规则认成员 ---
  $newNode = @(@{ GoId = 100; Name = 'Icon'; Kind = 'ExNoAtlas'; Tex = $script:TexNew })
  $texHud  = @(@{ Rel = 'Assets/AssetRaw/UI/NewAtlas/hudentry/hud_task_icon.png'; Guid = $script:TexNew })

  # T15 实发形态:新图落在 NewAtlas/hudentry、packables 未收,ExImage 未绑图集 -> NO-ATLAS,报推断的图集名
  $r = Invoke-ScanCheck $Target (Add-FolderRule (New-Proj $newNode) -Tex $texHud)
  Assert-True ($r.code -eq 1 -and $r.out -match 'NO-ATLAS' -and $r.out -match 'NewAtlas_hudentry' -and $r.out -match 'by folder') "T15 packables 未收的图集目录新图 + 未绑 ExImage -> NO-ATLAS"

  # T16 同一新图挂原生 Image -> IMAGE
  $r = Invoke-ScanCheck $Target (Add-FolderRule (New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'Image'; Tex = $script:TexNew })) -Tex $texHud)
  Assert-True ($r.code -eq 1 -and $r.out -match 'IMAGE' -and $r.out -match 'NewAtlas_hudentry') "T16 目录推断成员 + 原生 Image -> IMAGE"

  # T17 源根直属的图不成图集(编辑器 GetAtlasName 返回 null)
  $r = Invoke-ScanCheck $Target (Add-FolderRule (New-Proj $newNode) -Tex @(@{ Rel = 'Assets/AssetRaw/UI/NewAtlas/loose.png'; Guid = $script:TexNew }))
  Assert-True ($r.code -eq 0) "T17 源根直属 -> 不推断"

  # T18 excludeFolder / excludeKeywords 下的图不推断
  $r = Invoke-ScanCheck $Target (Add-FolderRule (New-Proj $newNode) -Exclude @('Assets/AssetRaw/UI/NewAtlas/hudentry') -Tex $texHud)
  Assert-True ($r.code -eq 0) "T18a excludeFolder -> 不推断"
  $r = Invoke-ScanCheck $Target (Add-FolderRule (New-Proj $newNode) -Keys @('_task_') -Tex $texHud)
  Assert-True ($r.code -eq 0) "T18b excludeKeywords -> 不推断"

  # T19 autoGenerate 关 = 编辑器不重算 packables,不推断;配置文件缺失同理(T3 等用例即无配置)
  $r = Invoke-ScanCheck $Target (Add-FolderRule (New-Proj $newNode) -AutoGen "0" -Tex $texHud)
  Assert-True ($r.code -eq 0) "T19 autoGenerate 0 -> 不推断"

  # T20 非图片扩展名不推断
  $r = Invoke-ScanCheck $Target (Add-FolderRule (New-Proj $newNode) -Tex @(@{ Rel = 'Assets/AssetRaw/UI/NewAtlas/hudentry/x.psd'; Guid = $script:TexNew }))
  Assert-True ($r.code -eq 0) "T20 非 png/jpg -> 不推断"

  # T21 粒度:singleAtlasDir 一图一集(名含文件名),rootChildAtlasDir 取根下第一级目录
  $r = Invoke-ScanCheck $Target (Add-FolderRule (New-Proj $newNode) -Single @('Assets/AssetRaw/UI/NewAtlas/bg') -Tex @(@{ Rel = 'Assets/AssetRaw/UI/NewAtlas/bg/big.png'; Guid = $script:TexNew }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'NewAtlas_bg_big') "T21a singleAtlasDir -> 图集名含文件名"
  $r = Invoke-ScanCheck $Target (Add-FolderRule (New-Proj $newNode) -Src @() -Child @('Assets/AssetRaw/UI/Child') -Tex @(@{ Rel = 'Assets/AssetRaw/UI/Child/a/b/c.png'; Guid = $script:TexNew }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'Child_a ' -and $r.out -notmatch 'Child_a_b') "T21b rootChildAtlasDir -> 取第一级目录"

  # T22 packables 已收的图以 packables 为准,不被目录推断覆盖(报 packables 的图集名,不报推断名)
  $r = Invoke-ScanCheck $Target (Add-FolderRule (New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'Image'; Tex = $script:TexA })) -Tex @(@{ Rel = 'Assets/AssetRaw/UI/NewAtlas/other/a.png'; Guid = $script:TexA }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'NewAtlas_a' -and $r.out -notmatch 'NewAtlas_other') "T22 packables 优先于目录推断"

  # --- 悬空绑定:ExImage.spriteAtlas 的 guid 在 Assets 下无主 ---
  # T23 实发形态:Source Image 在别的图集里、绑的图集已删 -> DANGLING,报节点名与 guid,不重复报 NO-ATLAS
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = $script:IconEsc; Kind = 'Ex'; Tex = $script:TexA; AtlasGuid = $script:AtlasGone }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'DANGLING' -and $r.out -match '任务图标' -and $r.out -match $script:AtlasGone -and $r.out -notmatch 'NO-ATLAS\s+Assets/') "T23 绑的图集已删 -> DANGLING,报节点名与 guid"

  # T24 与 Source Image 无关:散图、无 Source Image 的按名换图节点同样报
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Bg'; Kind = 'Ex'; Tex = $script:TexLoose; AtlasGuid = $script:AtlasGone }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'DANGLING') "T24a Source Image 是散图 -> 仍判 DANGLING"
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Slot'; Kind = 'Ex'; AtlasGuid = $script:AtlasGone }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'DANGLING') "T24b 无 Source Image -> 仍判 DANGLING"

  # T25 guid 有主须本体与 meta 都在:缺 meta 的图集会另发新 guid,缺本体的 meta 会被清掉
  $proj = New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'Ex'; Tex = $script:TexA; AtlasGuid = $script:AtlasBId })
  [System.IO.File]::Delete((Join-Path $proj "Assets\AssetArt\Atlas\NewAtlas_b.spriteatlasv2.meta"))
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 1 -and $r.out -match 'DANGLING') "T25a 图集本体在、meta 缺 -> DANGLING"
  $proj = New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'Ex'; Tex = $script:TexA; AtlasGuid = $script:AtlasBId })
  [System.IO.File]::Delete((Join-Path $proj "Assets\AssetArt\Atlas\NewAtlas_b.spriteatlasv2"))
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 1 -and $r.out -match 'DANGLING') "T25b meta 在、图集本体缺 -> DANGLING"

  # T26 图集放在图集目录之外:guid 仍解析得到,不误报
  $proj = New-Proj @(@{ GoId = 100; Name = 'Icon'; Kind = 'Ex'; Tex = $script:TexA; AtlasGuid = $script:AtlasFar })
  $farDir = Join-Path $proj "Assets\ThirdParty\Skin"
  New-Item -ItemType Directory -Force -Path $farDir | Out-Null
  [System.IO.File]::WriteAllText((Join-Path $farDir "Far.spriteatlas"), (New-AtlasText @()), $script:Utf8NoBom)
  [System.IO.File]::WriteAllText((Join-Path $farDir "Far.spriteatlas.meta"), "fileFormatVersion: 2`nguid: $script:AtlasFar`n", $script:Utf8NoBom)
  $r = Invoke-ScanCheck $Target $proj
  Assert-True ($r.code -eq 0) "T26 图集在图集目录之外 -> 解析得到,放行"

  # T27 嵌套实例对 spriteAtlas 的覆写:悬空判 DANGLING;有主 / 覆写成空放行;同组里别的属性的引用不算
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Kind = 'Override'; AtlasGuid = $script:AtlasGone }))
  Assert-True ($r.code -eq 1 -and $r.out -match 'DANGLING' -and $r.out -match 'override' -and $r.out -match '778') "T27a 覆写指向已删图集 -> DANGLING,报 target"
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Kind = 'Override'; AtlasGuid = $script:AtlasAId }))
  Assert-True ($r.code -eq 0) "T27b 覆写指向在役图集 -> 放行(m_Sprite 覆写的无主 guid 不算)"
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Kind = 'Override' }))
  Assert-True ($r.code -eq 0) "T27c 覆写成空 -> 放行"

  # T28 别的组件恰有同名字段:类型不由本道认定,不判
  $r = Invoke-ScanCheck $Target (New-Proj @(@{ GoId = 100; Name = 'Custom'; Kind = 'Other'; Tex = $script:TexLoose; AtlasGuid = $script:AtlasGone }))
  Assert-True ($r.code -eq 0) "T28 非 ExImage 组件的 spriteAtlas 字段 -> 不判"
}
finally {
  Remove-FixtureTree $script:fx
}
Exit-TestSuite
