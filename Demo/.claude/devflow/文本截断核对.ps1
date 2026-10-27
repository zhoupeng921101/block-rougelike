# 文本截断核对.ps1 - static check for UGUI Text nodes whose RectTransform is too short to fit one line.
# 准入: Since=2026-08-14 | Basis=存量 | Origin=b14e3850e 随交付合并入库,引入事故无记载 | Retire=UGUI 文本统一改由自适应组件承载、不再手配截断时
# Invariant: a Text with m_VerticalOverflow=Truncate must have enough height for one line, otherwise the
#   TextGenerator truncates the ONLY line away and emits an empty mesh - the component stays active,
#   enabled, alpha=1, cull=false and holds the right string, but nothing is drawn.
# Why a gate check: this failure is invisible to every "check the state" reflex. UITopHudPanel's energy
# countdown (2026-08-14) was dark for exactly this reason - rect height 40 against GBK.otf's
# preferredHeight 44 at fontSize 30. Four pixels, and no error, warning or log anywhere.
# Ratio 1.5 is the threshold: the measured GBK.otf line height / fontSize is ~1.47, so 1.5 leaves margin
# without flagging normally-proportioned nodes.
# Skipped (cannot be decided from the file alone): vertically stretched anchors, where the runtime height
#   is parent height + sizeDelta.y; and BestFit nodes, which shrink the font to fit instead of truncating.
# Runs pre-Unity inside the client gate (客户端自检.ps1, main project and slots alike); pure text scan.
# Exit codes: 0 clean, 1 violation (printed), 2 Assets/ missing.
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # a Demo root (has Assets/)
)
$ErrorActionPreference = "Stop"

$ProjectDir = $ProjectDir.TrimEnd('\')
$assetsDir  = Join-Path $ProjectDir "Assets"
if (-not (Test-Path $assetsDir)) {
  Write-Host "TEXT TRUNCATE CHECK : INFRA - '$assetsDir' not found (layout changed? sync 文本截断核对.ps1)"; exit 2
}

# UnityEngine.UI.Text 的内置脚本 guid。按 guid 判定而非 m_EditorClassIdentifier:后者是编辑器缓存字段,
# 重命名 / 重构后可能滞留旧值甚至缺席,guid 是序列化引用的实际依据。
$TextScriptGuid = "5f7201a12d95ffc409449d95f23cf332"
$HeightRatio    = 1.5

$violations = New-Object System.Collections.Generic.List[string]

# vendored 第三方资产不扫:这些 prefab 由包作者维护、随包升级整体覆盖,本项目既不该改也改不住,
# 报出来只是每次交付都要重新无视的噪声。判据与 命名空间扫描.ps1 B 段的 vendored 排除同口径。
# 新导入第三方包若落在别的顶层目录,在此加前缀。
$vendoredExcludes = @("ThirdParty/")
$assetsNorm = (Resolve-Path $assetsDir).Path.Replace('\','/')

foreach ($file in Get-ChildItem -Path $assetsDir -Filter *.prefab -Recurse -File) {
  $rel = $file.FullName.Replace('\','/').Substring($assetsNorm.Length + 1)
  $skipVendored = $false
  foreach ($ex in $vendoredExcludes) {
    if ($rel.StartsWith($ex, [System.StringComparison]::Ordinal)) { $skipVendored = $true; break }
  }
  if ($skipVendored) { continue }

  # .NET ReadAllLines 按 UTF-8 解析并自动剥离 BOM;prefab 里的中文节点名经 PS 5.1 的 Get-Content 会按 ANSI 误解码。
  $lines = [System.IO.File]::ReadAllLines($file.FullName, [System.Text.Encoding]::UTF8)

  $goNames   = @{}   # GameObject fileID -> m_Name
  $rectByGo  = @{}   # GameObject fileID -> @{ SizeY; AnchorMinY; AnchorMaxY }
  $textNodes = New-Object System.Collections.Generic.List[hashtable]

  $blockClass = ""            # 当前块的 !u! 类号
  $cur        = $null         # 当前块累积的字段
  $isText     = $false        # 当前 114 块是否为 UI.Text

  # 块结束时归档:RectTransform 与 Text 都按其 m_GameObject 关联,一个 GameObject 至多一个 RectTransform。
  $flush = {
    if ($null -eq $cur) { return }
    switch ($blockClass) {
      "1"   { if ($cur.ContainsKey("Id") -and $cur.ContainsKey("Name")) { $goNames[$cur.Id] = $cur.Name } }
      "224" { if ($cur.ContainsKey("Go")) { $rectByGo[$cur.Go] = $cur } }
      "114" { if ($isText -and $cur.ContainsKey("Go")) { $textNodes.Add($cur) } }
    }
  }

  foreach ($line in $lines) {
    if ($line -match '^--- !u!(?<cls>\d+) &(?<id>\d+)') {
      & $flush
      $blockClass = $Matches.cls
      $isText     = $false
      $cur        = @{ Id = $Matches.id }
      continue
    }
    if ($null -eq $cur) { continue }

    switch ($blockClass) {
      "1" {
        if ($line -match '^  m_Name:\s*(?<n>.*)$') { $cur.Name = $Matches.n.Trim() }
      }
      "224" {
        if ($line -match '^  m_GameObject:\s*\{fileID:\s*(?<g>\d+)\}') { $cur.Go = $Matches.g }
        elseif ($line -match '^  m_SizeDelta:\s*\{x:\s*[^,]+,\s*y:\s*(?<y>[-\d.eE+]+)\}') { $cur.SizeY = [double]$Matches.y }
        elseif ($line -match '^  m_AnchorMin:\s*\{x:\s*[^,]+,\s*y:\s*(?<y>[-\d.eE+]+)\}') { $cur.AnchorMinY = [double]$Matches.y }
        elseif ($line -match '^  m_AnchorMax:\s*\{x:\s*[^,]+,\s*y:\s*(?<y>[-\d.eE+]+)\}') { $cur.AnchorMaxY = [double]$Matches.y }
      }
      "114" {
        if ($line -match "guid:\s*$TextScriptGuid") { $isText = $true }
        elseif ($line -match '^  m_GameObject:\s*\{fileID:\s*(?<g>\d+)\}') { $cur.Go = $Matches.g }
        elseif ($line -match '^    m_FontSize:\s*(?<v>\d+)') { $cur.FontSize = [int]$Matches.v }
        elseif ($line -match '^    m_BestFit:\s*(?<v>\d+)') { $cur.BestFit = [int]$Matches.v }
        elseif ($line -match '^    m_VerticalOverflow:\s*(?<v>\d+)') { $cur.VOverflow = [int]$Matches.v }
      }
    }
  }
  & $flush

  foreach ($t in $textNodes) {
    if (-not $t.ContainsKey("VOverflow") -or $t.VOverflow -ne 0) { continue }   # 只管 Truncate
    if ($t.ContainsKey("BestFit") -and $t.BestFit -ne 0) { continue }           # BestFit 自行缩字,不会截没
    if (-not $t.ContainsKey("FontSize") -or $t.FontSize -le 0) { continue }
    if (-not $rectByGo.ContainsKey($t.Go)) { continue }

    $rect = $rectByGo[$t.Go]
    if (-not $rect.ContainsKey("SizeY")) { continue }
    # 垂直拉伸锚点:运行时高度 = 父高 + sizeDelta.y,单文件判不出,跳过。
    if ($rect.ContainsKey("AnchorMinY") -and $rect.ContainsKey("AnchorMaxY") -and $rect.AnchorMinY -ne $rect.AnchorMaxY) { continue }

    $need = $t.FontSize * $HeightRatio
    if ($rect.SizeY -lt $need) {
      $name = if ($goNames.ContainsKey($t.Go)) { $goNames[$t.Go] } else { "fileID:" + $t.Go }
      $rel  = $file.FullName.Substring($ProjectDir.Length).TrimStart('\')
      $violations.Add("$rel :: $name - height $($rect.SizeY) < fontSize $($t.FontSize) x $HeightRatio = $need (Truncate drops the only line)")
    }
  }
}

if ($violations.Count -gt 0) {
  Write-Host "TEXT TRUNCATE CHECK : $($violations.Count) violation(s)"
  $violations | ForEach-Object { Write-Host "  $_" }
  Write-Host "  fix: raise the RectTransform height above fontSize x $HeightRatio, or lower the font size."
  Write-Host "  (switching m_VerticalOverflow to Overflow also renders, but lets any future overflow spill onto neighbours)"
  exit 1
}
Write-Host "TEXT TRUNCATE CHECK : clean"
exit 0
