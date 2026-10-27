# 图集子图组件核对.ps1 - static check: every UI prefab image whose Source Image is a SpriteAtlas member
#   must be an ExImage that carries an atlas - and every atlas an ExImage carries must still exist.
# 准入: Since=2026-09-29 | Basis=复发 | Origin=820b4006c 怪兽消消乐 15 个图位、070265bdd 进度回馈任务图标,两次实发(修复 f7853b38c);DANGLING 一类另起于 2026-10-08 删图集留下两处悬空绑定(修复 31dc6c88b),本类首跑另查出 69784cd48 删图集留下的一处(修复 99a30e336) | Retire=UI 搭建工具直接产出绑图集的 ExImage、或 SpriteBind 不再依赖节点类型即可按名取图集子图时
# Invariant: an atlas sub-sprite (AssetRaw/UI/NewAtlas/* and the like) is not addressable - it lives only
#   inside its SpriteAtlas, and the one runtime path that can fetch it by name is ExImage (SpriteName /
#   SpriteBind's atlas fallback, both read the atlas serialized on the node). A plain UnityEngine.UI.Image
#   showing such a sprite looks fine in the editor and at runtime - until code rebinds it by name. Then
#   SpriteBind finds no location, has no atlas to fall back to, hides the node and logs an Error. Nothing
#   before that moment says the node is wrong: it compiles, it binds, the prefab renders.
# Why a gate check: the convention (ui-tools.md: build with Image, convert before publishing via
#   `UITools/UI 图片批量校正（图集补绑 / 尺寸修正）`) was written down and even named in SpriteBind's error
#   text, and still got skipped twice - the publish step is a manual menu no delivery path runs. This scan
#   makes the unconverted state visible at delivery instead of on the first panel open.
# Deliberately prefab-wide, not "only nodes code rebinds": which node gets rebound by name is decided in
#   code (Find("任务图标"), locals, table-driven names) and cannot be linked to a prefab node by text.
#   Converting every atlas-sprite image is what the menu already does, with zero visual change.
# Reported, four kinds (the fix differs):
#   IMAGE    - plain Image whose Source Image is in exactly one atlas. Fix: run the menu (tab ①).
#   NO-ATLAS - ExImage with spriteAtlas {fileID: 0} whose Source Image is in an atlas. Fix: same menu.
#   MULTI    - Source Image packed by more than one atlas. The menu skips these (cannot pick an atlas);
#              fix the atlas layout first so the texture belongs to one atlas, then run the menu.
#   DANGLING - ExImage.spriteAtlas (on the component, or as a prefab-instance override) names a guid no
#              atlas under Assets carries: the atlas was deleted, or lost its .meta and got a new guid.
#              Unity loads such a reference as null, so the node behaves like NO-ATLAS at runtime while
#              the prefab text still looks bound - and the dead guid stays in the prefab's dependency
#              list. Reported whatever the Source Image is (none, loose texture, atlas member alike).
#              Seen 2026-10-08: Atlas_UIInvitePanel deleted, two panels copied from the invite panel
#              still bound it, and the next YooAsset build stopped on `Found invalid asset` naming that
#              atlas (the two prefabs were the only dependency-cache entries holding the guid; a rebuild
#              after the fix has not been observed yet, so the build link is evidence, not proof). The
#              first run of this kind found a third: UIActivitySeasonPanel's quest-card Icon, bound to an
#              atlas deleted on 2026-09-24 (69784cd48); rebound in 99a30e336.
#              Fix: the menu rebinds it when the Source Image is in exactly one atlas (it treats a missing
#              atlas as empty - by reading ExImageConverterWindow, not by running it); otherwise set or
#              clear Sprite Atlas on the node by hand.
# Deliberately NOT reported: an ExImage whose bound atlas differs from its Source Image's atlas. The
#   bound atlas serves runtime SpriteName swaps and may legitimately differ (ExImageConverterWindow keeps
#   it for the same reason).
# Not covered: images with no Source Image that receive atlas names at runtime (no text evidence of an
#   atlas); nested prefab instances and variant overrides (their components live in the source prefab,
#   which is scanned itself; an override that swaps m_Sprite in the outer prefab is not - only a
#   spriteAtlas override is read, for DANGLING, and it is matched by property name alone: the overridden
#   component's type is not in the outer prefab's text, and ExImage is the one component with a field of
#   that name); folder-form atlas packables (the project's atlases list each texture -
#   EditorSpriteSaveInfo writes that form); atlas references held by anything other than
#   ExImage.spriteAtlas, and prefabs outside Assets/AssetRaw/UI (none carry the field today).
# Membership = packables, plus - for textures no packables list yet - the atlas the editor WILL pack them
#   into by the folder rules in ProjectSettings/AtlasConfiguration.asset (port of EditorSpriteSaveInfo
#   ResolveAtlasName / ShouldProcess). Needed because slot delivery reverts tracked atlas churn before the
#   gate runs, so a sprite newly dropped into an atlas folder is in no packables at gate time.
# Runs pre-Unity inside the client gate (客户端自检.ps1, main project and slots alike); pure text scan.
# Exit codes: 0 clean, 1 violation (printed), 2 Assets/ or ExImage meta unreadable.
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # a Demo root (has Assets/)
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")   # ConvertFrom-YamlName

$ProjectDir = $ProjectDir.TrimEnd('\')
$assetsDir  = Join-Path $ProjectDir "Assets"
$uiDir      = Join-Path $assetsDir "AssetRaw\UI"
$atlasDir   = Join-Path $assetsDir "AssetArt\Atlas"
if (-not (Test-Path $assetsDir)) {
  Write-Host "ATLAS IMAGE CHECK : INFRA - '$assetsDir' not found (layout changed? sync 图集子图组件核对.ps1)"; exit 2
}
# 扫描面 = 批量校正菜单的缺省扫描目录与图集目录(ExImageConverterWindow DefaultScanDir / AtlasDir),
# 两边口径一致,本道报的每一处菜单缺省就能转掉。
if (-not (Test-Path $uiDir) -or -not (Test-Path $atlasDir)) {
  Write-Host "ATLAS IMAGE CHECK : clean (Assets/AssetRaw/UI or Assets/AssetArt/Atlas absent - nothing to check)"; exit 0
}

# UGUI Image 的脚本 guid 由 com.unity.ugui 包定死、各工程同值,包文件不在 Assets 下,故写死。
$ImageGuid = "fe87c0e1cc204ed48ad3b37840f39efc"

# ExImage guid 不写死:按文件名找 ExImage.cs.meta 取,脚本挪路径后本道照常生效。
# 找不到 = 该分支没有 ExImage,无从转换,PASS 跳过(同 安全区结构核对.ps1 对 UISafeArea 的处置)。
$exMeta = Get-ChildItem -Path $assetsDir -Filter "ExImage.cs.meta" -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1
if ($null -eq $exMeta) {
  Write-Host "ATLAS IMAGE CHECK : clean (ExImage.cs.meta not found - component absent from this branch, nothing to check)"; exit 0
}
$ExImageGuid = ""
foreach ($l in [System.IO.File]::ReadAllLines($exMeta.FullName, [System.Text.Encoding]::UTF8)) {
  if ($l -match '^guid:\s*(?<g>[0-9a-fA-F]{32})\s*$') { $ExImageGuid = $Matches.g.ToLowerInvariant(); break }
}
if ([string]::IsNullOrEmpty($ExImageGuid)) {
  Write-Host "ATLAS IMAGE CHECK : INFRA - no guid line in '$($exMeta.FullName)' (meta corrupt?)"; exit 2
}

# 贴图 guid -> 所属图集名集合。只收 packables 列表项:其后的 m_MasterAtlas 之类引用不算成员。
$texToAtlases = @{}
$atlasFiles = @(Get-ChildItem -Path $atlasDir -File | Where-Object { $_.Extension -eq ".spriteatlasv2" -or $_.Extension -eq ".spriteatlas" })
foreach ($af in $atlasFiles) {
  $inPackables = $false
  foreach ($l in [System.IO.File]::ReadAllLines($af.FullName, [System.Text.Encoding]::UTF8)) {
    if ($l -match '^\s+packables:') { $inPackables = $true; continue }
    if (-not $inPackables) { continue }
    if ($l -match '^\s+-\s*\{fileID:\s*-?\d+,\s*guid:\s*(?<g>[0-9a-fA-F]{32})') {
      $g = $Matches.g.ToLowerInvariant()
      if (-not $texToAtlases.ContainsKey($g)) { $texToAtlases[$g] = New-Object System.Collections.Generic.List[string] }
      if (-not $texToAtlases[$g].Contains($af.BaseName)) { $texToAtlases[$g].Add($af.BaseName) }
      continue
    }
    $inPackables = $false
  }
}

# 目录推断:packables 是编辑器导入期按目录重算的产物,会滞后于源图——槽位交付把已跟踪图集的改动
# 剔出提交、还原到 HEAD 后才跑自检(单仓提交.ps1 图集剔除节),新放进图集目录的子图此时不在任何
# packables 里,只读 packables 会把「一入主树就成图集子图」的节点放过(实发 2026-09-29:m_btn_task/Icon
# 换 NewAtlas/hudentry 新图未绑图集,主树补提图集后才报 NO-ATLAS)。故 packables 未收的贴图,再按
# ProjectSettings/AtlasConfiguration.asset 的目录规则推断其归属,口径逐条对齐编辑器侧单一事实源
# EditorSpriteSaveInfo.ShouldProcess / ResolveAtlasName(扩展名、excludeFolder、excludeKeywords、
# 源根直属不成图集、single / rootChild 两种粒度)。autoGenerate 关 = 编辑器不重算,不推断;配置缺失同理。
$cfgPath = Join-Path $ProjectDir "ProjectSettings\AtlasConfiguration.asset"
$inferred = 0
if (Test-Path $cfgPath) {
  $cfg = @{}; $listKey = $null; $autoGen = $false
  foreach ($l in [System.IO.File]::ReadAllLines($cfgPath, [System.Text.Encoding]::UTF8)) {
    if ($l -match '^  (?<k>\w+):\s*(?<v>.*)$') {
      $listKey = $null
      if ($Matches.k -eq 'autoGenerate') { $autoGen = $Matches.v.Trim() -eq '1' }
      elseif ($Matches.v.Trim() -eq '' -or $Matches.v.Trim() -eq '[]') { $listKey = $Matches.k; $cfg[$listKey] = New-Object System.Collections.Generic.List[string] }
      continue
    }
    if ($listKey -and $l -match '^  -\s*(?<v>.+?)\s*$') { $cfg[$listKey].Add($Matches.v.Replace('\', '/').TrimEnd('/')); continue }
    $listKey = $null
  }
  $listOf = { param($k) if ($cfg.ContainsKey($k)) { @($cfg[$k]) } else { @() } }
  $srcRoots = & $listOf 'sourceAtlasRootDir'; $childRoots = & $listOf 'rootChildAtlasDir'
  $singleRoots = & $listOf 'singleAtlasDir'; $exFolders = & $listOf 'excludeFolder'; $exKeys = & $listOf 'excludeKeywords'
  $under = { param($p, $root) $p.StartsWith($root + '/', [System.StringComparison]::OrdinalIgnoreCase) }
  $resolve = {
    param([string]$p)   # Assets/... 相对路径,/ 分隔
    $ext = [System.IO.Path]::GetExtension($p).ToLowerInvariant()
    if ($ext -ne '.png' -and $ext -ne '.jpg' -and $ext -ne '.jpeg') { return $null }
    foreach ($r in $exFolders) { if (& $under $p $r) { return $null } }
    foreach ($k in $exKeys) { if ($k -and $p.IndexOf($k, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) { return $null } }
    $name = $null
    foreach ($r in @($srcRoots + $childRoots)) {
      if (-not (& $under $p $r)) { continue }
      $parts = $p.Substring($r.Length + 1).Split('/')
      if ($parts.Count -lt 2) { return $null }   # 源根直属不成图集
      $name = [System.IO.Path]::GetFileName($r) + '_' + (($parts[0..($parts.Count - 2)]) -join '_')
      break
    }
    if (-not $name) { return $null }
    if (@($singleRoots | Where-Object { & $under $p $_ }).Count -gt 0) {
      foreach ($r in $srcRoots) {
        if (-not (& $under $p $r)) { continue }
        $parts = $p.Substring($r.Length + 1).Split('/')
        if ($parts.Count -lt 2) { return $null }
        $parts[$parts.Count - 1] = [System.IO.Path]::GetFileNameWithoutExtension($p)
        return [System.IO.Path]::GetFileName($r) + '_' + ($parts -join '_')
      }
      return $null
    }
    if (@($childRoots | Where-Object { & $under $p $_ }).Count -gt 0) {
      foreach ($r in $childRoots) {
        if (-not (& $under $p $r)) { continue }
        $rel = $p.Substring($r.Length + 1)
        $i = $rel.IndexOf('/', [System.StringComparison]::Ordinal)
        if ($i -le 0) { return $null }
        return [System.IO.Path]::GetFileName($r) + '_' + $rel.Substring(0, $i)
      }
      return $null
    }
    return $name
  }
  if ($autoGen) {
    $projNorm = (Resolve-Path $ProjectDir).Path.Replace('\', '/')
    foreach ($r in @($srcRoots + $childRoots)) {
      $abs = Join-Path $ProjectDir $r
      if (-not (Test-Path $abs)) { continue }
      foreach ($m in Get-ChildItem -Path $abs -Filter *.meta -Recurse -File) {
        $assetRel = $m.FullName.Replace('\', '/').Substring($projNorm.Length + 1)
        $assetRel = $assetRel.Substring(0, $assetRel.Length - 5)
        $atlasName = & $resolve $assetRel
        if (-not $atlasName) { continue }
        $g = ""
        foreach ($ml in [System.IO.File]::ReadLines($m.FullName)) { if ($ml -match '^guid:\s*(?<g>[0-9a-fA-F]{32})') { $g = $Matches.g.ToLowerInvariant(); break } }
        if (-not $g -or $texToAtlases.ContainsKey($g)) { continue }
        $texToAtlases[$g] = New-Object System.Collections.Generic.List[string]
        $texToAtlases[$g].Add($atlasName + " (by folder, packables not yet regenerated)")
        $inferred++
      }
    }
  }
}

# 在役图集 guid 集合(DANGLING 判据):本体与 .meta 都在才算——缺 meta 的图集会被编辑器另发新 guid,
# 缺本体的 meta 会被编辑器清掉,两种情形下旧 guid 都已无主。取整个 Assets 而非只取图集目录:判悬空要的是
# 「哪儿都解析不到」,只查图集目录会把放在别处的图集误报成悬空。
$atlasGuids = New-Object System.Collections.Generic.HashSet[string]
foreach ($pat in @("*.spriteatlasv2.meta", "*.spriteatlas.meta")) {
  foreach ($m in Get-ChildItem -Path $assetsDir -Filter $pat -Recurse -File -ErrorAction SilentlyContinue) {
    if (-not (Test-Path -LiteralPath $m.FullName.Substring(0, $m.FullName.Length - 5))) { continue }
    foreach ($ml in [System.IO.File]::ReadAllLines($m.FullName, [System.Text.Encoding]::UTF8)) {
      if ($ml -match '^guid:\s*(?<g>[0-9a-fA-F]{32})') { [void]$atlasGuids.Add($Matches.g.ToLowerInvariant()); break }
    }
  }
}

$violations = New-Object System.Collections.Generic.List[string]
$checked = 0
$assetsNorm = (Resolve-Path $assetsDir).Path.Replace('\','/')

foreach ($file in Get-ChildItem -Path $uiDir -Filter *.prefab -Recurse -File) {
  $rel = "Assets/" + $file.FullName.Replace('\','/').Substring($assetsNorm.Length + 1)
  # .NET ReadAllLines 按 UTF-8 解析并剥离 BOM;prefab 经 PS 5.1 的 Get-Content 会按 ANSI 误解码。
  $lines = [System.IO.File]::ReadAllLines($file.FullName, [System.Text.Encoding]::UTF8)

  $goNames = @{}   # GameObject fileID -> 解码后的 m_Name
  $comps   = New-Object System.Collections.Generic.List[hashtable]
  $cls = ""; $cur = $null
  $ovTarget = ""; $ovPending = $false   # 嵌套实例覆写:当前条目的 target 与「propertyPath 是 spriteAtlas」标记

  foreach ($line in $lines) {
    if ($line -match '^--- !u!(?<cls>\d+) &(?<id>-?\d+)(?<stripped> stripped)?') {
      if ($cls -eq "114" -and $null -ne $cur) { $comps.Add($cur) }
      $cls = $Matches.cls; $ovTarget = ""; $ovPending = $false
      # stripped 块是嵌套实例 / 变体继承来的组件占位,没有自己的 m_Script 与字段,归源 prefab 扫。
      $cur = if ($Matches.stripped) { $null } else { @{ Id = $Matches.id } }
      continue
    }
    if ($null -eq $cur) { continue }
    if ($cls -eq "1") {
      if ($line -match '^  m_Name:\s*(?<n>.*)$') { $goNames[$cur.Id] = ConvertFrom-YamlName $Matches.n }
    }
    elseif ($cls -eq "114") {
      if ($line -match '^  m_GameObject:\s*\{fileID:\s*(?<g>-?\d+)\}') { $cur.Go = $Matches.g }
      elseif ($line -match '^  m_Script:\s*\{fileID:\s*\d+,\s*guid:\s*(?<g>[0-9a-fA-F]{32})') { $cur.Script = $Matches.g.ToLowerInvariant() }
      elseif ($line -match '^  m_Sprite:\s*\{fileID:\s*-?\d+,\s*guid:\s*(?<g>[0-9a-fA-F]{32})') { $cur.Sprite = $Matches.g.ToLowerInvariant() }
      elseif ($line -match '^  spriteAtlas:\s*\{fileID:\s*(?<f>-?\d+)(?:,\s*guid:\s*(?<g>[0-9a-fA-F]{32}))?') {
        $cur.AtlasFid = $Matches.f
        if ($Matches.g) { $cur.AtlasGuid = $Matches.g.ToLowerInvariant() }
      }
    }
    elseif ($cls -eq "1001") {
      # m_Modifications 条目固定为 target / propertyPath / value / objectReference 四行一组。
      if ($line -match '^\s+-\s*target:\s*\{fileID:\s*(?<f>-?\d+)') { $ovTarget = $Matches.f; $ovPending = $false }
      elseif ($line -match '^\s+propertyPath:\s*(?<p>.*?)\s*$') { $ovPending = $Matches.p -eq 'spriteAtlas' }
      elseif ($ovPending -and $line -match '^\s+objectReference:\s*\{fileID:\s*-?\d+,\s*guid:\s*(?<g>[0-9a-fA-F]{32})') {
        $ovPending = $false
        $g = $Matches.g.ToLowerInvariant()
        if (-not $atlasGuids.Contains($g)) {
          $violations.Add("DANGLING $rel :: override on nested instance (target fileID $ovTarget) - spriteAtlas guid $g matches no atlas under Assets")
        }
      }
    }
  }
  if ($cls -eq "114" -and $null -ne $cur) { $comps.Add($cur) }

  foreach ($c in $comps) {
    if (-not $c.ContainsKey("Script")) { continue }
    $isImage = $c.Script -eq $ImageGuid
    $isEx    = $c.Script -eq $ExImageGuid
    if (-not $isImage -and -not $isEx) { continue }
    $node = if ($c.ContainsKey("Go") -and $goNames.ContainsKey($c.Go)) { $goNames[$c.Go] } else { "component:" + $c.Id }
    # 悬空绑定先于 Source Image 判:它与图位显示什么无关,无 Source Image 的按名换图节点同样要报。
    # 报过即止,不再落到 NO-ATLAS——同一节点一处缺陷只报一条。
    if ($isEx -and $c.ContainsKey("AtlasGuid") -and -not $atlasGuids.Contains($c.AtlasGuid)) {
      $violations.Add("DANGLING $rel :: $node - spriteAtlas guid $($c.AtlasGuid) matches no atlas under Assets")
      continue
    }
    if (-not $c.ContainsKey("Sprite")) { continue }
    if (-not $texToAtlases.ContainsKey($c.Sprite)) { continue }
    $checked++
    # ExImage 缺 spriteAtlas 键(旧序列化)与写成 {fileID: 0} 同义:都没有图集可取。
    $exMissingAtlas = $isEx -and (-not $c.ContainsKey("AtlasFid") -or $c.AtlasFid -eq "0")
    if ($isEx -and -not $exMissingAtlas) { continue }

    $atlases = $texToAtlases[$c.Sprite]
    if ($atlases.Count -gt 1) {
      $violations.Add("MULTI    $rel :: $node - Source Image packed by several atlases (" + ($atlases -join ", ") + ")")
    }
    elseif ($isImage) {
      $violations.Add("IMAGE    $rel :: $node - plain Image showing a sub-sprite of " + $atlases[0])
    }
    else {
      $violations.Add("NO-ATLAS $rel :: $node - ExImage without spriteAtlas, Source Image is in " + $atlases[0])
    }
  }
}

if ($violations.Count -gt 0) {
  Write-Host "ATLAS IMAGE CHECK : $($violations.Count) violation(s)"
  $violations | ForEach-Object { Write-Host "  $_" }
  Write-Host "  why: atlas sub-sprites are not addressable; only an ExImage with its atlas can swap them by name at runtime"
  Write-Host "       (a plain Image rebound via SpriteBind hides itself and logs '寻址不到')."
  Write-Host "  fix (IMAGE / NO-ATLAS): in the editor run menu 'UITools/UI 图片批量校正（图集补绑 / 尺寸修正）', tab ①,"
  Write-Host "       Scan then Apply (default folder Assets/AssetRaw/UI). Zero visual change; only the script and atlas ref change."
  Write-Host "  fix (MULTI): make the texture belong to one atlas (move it out of the extra atlas folder), then run the menu."
  Write-Host "  fix (DANGLING): the bound atlas is gone (deleted, or its .meta was lost and it got a new guid). Same menu rebinds"
  Write-Host "       nodes whose Source Image is in exactly one atlas; for the rest set or clear Sprite Atlas on the node by hand."
  exit 1
}
Write-Host "ATLAS IMAGE CHECK : clean ($checked atlas-sprite image(s) checked, $($atlasFiles.Count) atlas file(s), $($atlasGuids.Count) atlas guid(s), $inferred texture(s) by folder rule)"
exit 0
