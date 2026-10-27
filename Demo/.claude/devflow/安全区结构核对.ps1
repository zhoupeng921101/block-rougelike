# 安全区结构核对.ps1 - static check for the UI safe-area node convention in prefabs.
# 准入: Since=2026-09-12 | Basis=存量 | Origin=7d9009819 安全区挂在业务容器上,实发五例 | Retire=安全区节点改由窗口模板构造、业务 prefab 不再手挂时 | Reviewed=2026-10-08
# Two invariants, both invisible until the build runs on a notched device:
#   1. A node carrying UISafeArea must be NAMED with the 安全区 prefix. The component shrinks its node
#      into Screen.safeArea by rewriting anchors, so whatever sits under that node moves with the notch.
#      When the component rides a business container instead (Panel / 主面板 / 窗体 / 面板底 /
#      m_rect_DetailGroup were the five found on 2026-09-12), nothing in the prefab says so - reading the
#      hierarchy gives no hint that this particular container is the safe-area boundary, and neither does
#      any scan. Naming it is what makes the boundary locatable, by a human and by invariant 2 below.
#   2. The full-screen popup mask m_btn_Mask must NOT sit inside a safe-area subtree. Its job is to cover
#      the whole screen and swallow clicks aimed at the window underneath; shrunk into the safe area it
#      leaves an uncovered strip at the notch and the home indicator, where taps fall through to the
#      window below. All 27 mask-bearing windows satisfy this today - the check exists to keep it that
#      way, because this is exactly the property that makes a "reverse expand back to full screen"
#      mechanism unnecessary. Lose it silently and the fix is 27 nodes, not one.
# Deliberately NOT required: that the safe-area node be a direct child of the window root. UIGuidePanel
#   keeps its 安全区 under m_go_ForeLayer on purpose - that node carries the Canvas whose sortingOrder
#   UIGuidePanel rewrites per target window, and hoisting the subtree out would drop the guide bubble and
#   skip button back to the panel's own sorting order, where the target window can cover them silently.
# Not checked (cannot be decided from the file alone): whether a full-screen BACKGROUND sits inside a
#   safe-area subtree. "Full-screen background" has no machine-decidable form - UIActivitySeasonPanel's
#   premit_bg is stretch-anchored yet inset 28px per side and 170px at the top, making it panel art
#   rather than a backdrop. That one stays a human judgement in the devflow-ui card.
# Nested prefab instances are invisible to this scan (their nodes live in PrefabInstance blocks, not
#   !u!1 / !u!224), same limitation as 文本截断核对.ps1.
# Runs pre-Unity inside the client gate (客户端自检.ps1, main project and slots alike); pure text scan.
# Exit codes: 0 clean, 1 violation (printed), 2 Assets/ or meta unreadable.
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # a Demo root (has Assets/)
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")   # ConvertFrom-YamlName

$ProjectDir = $ProjectDir.TrimEnd('\')
$assetsDir  = Join-Path $ProjectDir "Assets"
if (-not (Test-Path $assetsDir)) {
  Write-Host "SAFE AREA CHECK : INFRA - '$assetsDir' not found (layout changed? sync 安全区结构核对.ps1)"; exit 2
}

$SafeAreaPrefix = "安全区"
# 与 ScriptAutoGenerator.MaskNodeName / UIPanelMono.MaskNodeName 同值。三处各持一份是既有状态
# (Editor 程序集不引用热更程序集,本脚本又在两者之外),改名要三处一起改。
$MaskNodeName = "m_btn_Mask"

# Unity 把含非 ASCII 的 m_Name 写成带引号的 \uXXXX 转义串,节点名一律经 hook函数库 ConvertFrom-YamlName 解码再比对。

# guid 不写死:按文件名找 UISafeArea.cs.meta 取当前 guid,组件被移动路径后本道照常生效。
# 找不到 = 该分支没有这个组件(重构掉了 / 尚未引入),PASS 跳过而非 INFRA——道次不该因为
# 一个业务件的存废把所有交付堵死。
$metaFile = Get-ChildItem -Path $assetsDir -Filter "UISafeArea.cs.meta" -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1
if ($null -eq $metaFile) {
  Write-Host "SAFE AREA CHECK : clean (UISafeArea.cs.meta not found - component absent from this branch, nothing to check)"
  exit 0
}
$SafeAreaGuid = ""
foreach ($l in [System.IO.File]::ReadAllLines($metaFile.FullName, [System.Text.Encoding]::UTF8)) {
  if ($l -match '^guid:\s*(?<g>[0-9a-fA-F]{32})\s*$') { $SafeAreaGuid = $Matches.g; break }
}
if ([string]::IsNullOrEmpty($SafeAreaGuid)) {
  Write-Host "SAFE AREA CHECK : INFRA - no guid line in '$($metaFile.FullName)' (meta corrupt?)"; exit 2
}

$violations = New-Object System.Collections.Generic.List[string]
$safeAreaNodeCount = 0
$maskNodeCount = 0

# vendored 第三方资产不扫:随包升级整体覆盖,本项目既不该改也改不住。与 文本截断核对.ps1 同口径。
$vendoredExcludes = @("ThirdParty/")
$assetsNorm = (Resolve-Path $assetsDir).Path.Replace('\','/')

foreach ($file in Get-ChildItem -Path $assetsDir -Filter *.prefab -Recurse -File) {
  $rel = $file.FullName.Replace('\','/').Substring($assetsNorm.Length + 1)
  $skipVendored = $false
  foreach ($ex in $vendoredExcludes) {
    if ($rel.StartsWith($ex, [System.StringComparison]::Ordinal)) { $skipVendored = $true; break }
  }
  if ($skipVendored) { continue }

  # .NET ReadAllLines 按 UTF-8 解析并剥离 BOM;prefab 经 PS 5.1 的 Get-Content 会按 ANSI 误解码。
  $lines = [System.IO.File]::ReadAllLines($file.FullName, [System.Text.Encoding]::UTF8)

  $goNames  = @{}   # GameObject fileID -> 解码后的 m_Name
  $tGo      = @{}   # Transform fileID  -> GameObject fileID
  $tFather  = @{}   # Transform fileID  -> father Transform fileID ("0" = 根)
  $goT      = @{}   # GameObject fileID -> Transform fileID
  $safeGos  = @{}   # GameObject fileID -> $true,挂了 UISafeArea 的节点
  $maskGos  = New-Object System.Collections.Generic.List[string]

  $blockClass = ""
  $cur        = $null
  $isSafeArea = $false

  $flush = {
    if ($null -eq $cur) { return }
    switch ($blockClass) {
      "1" {
        if ($cur.ContainsKey("Id") -and $cur.ContainsKey("Name")) {
          $goNames[$cur.Id] = $cur.Name
          if ($cur.Name -ceq $MaskNodeName) { $maskGos.Add($cur.Id) }
        }
      }
      "4"   { if ($cur.ContainsKey("Go")) { $tGo[$cur.Id] = $cur.Go; $goT[$cur.Go] = $cur.Id; if ($cur.ContainsKey("Father")) { $tFather[$cur.Id] = $cur.Father } } }
      "224" { if ($cur.ContainsKey("Go")) { $tGo[$cur.Id] = $cur.Go; $goT[$cur.Go] = $cur.Id; if ($cur.ContainsKey("Father")) { $tFather[$cur.Id] = $cur.Father } } }
      "114" { if ($isSafeArea -and $cur.ContainsKey("Go")) { $safeGos[$cur.Go] = $true } }
    }
  }

  foreach ($line in $lines) {
    if ($line -match '^--- !u!(?<cls>\d+) &(?<id>\d+)') {
      & $flush
      $blockClass = $Matches.cls
      $isSafeArea = $false
      $cur        = @{ Id = $Matches.id }
      continue
    }
    if ($null -eq $cur) { continue }

    switch ($blockClass) {
      "1" {
        if ($line -match '^  m_Name:\s*(?<n>.*)$') { $cur.Name = ConvertFrom-YamlName $Matches.n }
      }
      "4" {
        if ($line -match '^  m_GameObject:\s*\{fileID:\s*(?<g>\d+)\}') { $cur.Go = $Matches.g }
        elseif ($line -match '^  m_Father:\s*\{fileID:\s*(?<f>\d+)\}') { $cur.Father = $Matches.f }
      }
      "224" {
        if ($line -match '^  m_GameObject:\s*\{fileID:\s*(?<g>\d+)\}') { $cur.Go = $Matches.g }
        elseif ($line -match '^  m_Father:\s*\{fileID:\s*(?<f>\d+)\}') { $cur.Father = $Matches.f }
      }
      "114" {
        if ($line -match "guid:\s*$SafeAreaGuid") { $isSafeArea = $true }
        elseif ($line -match '^  m_GameObject:\s*\{fileID:\s*(?<g>\d+)\}') { $cur.Go = $Matches.g }
      }
    }
  }
  & $flush

  # 不变量 1:挂 UISafeArea 的节点须以 安全区 起头
  foreach ($go in $safeGos.Keys) {
    $safeAreaNodeCount++
    $name = if ($goNames.ContainsKey($go)) { $goNames[$go] } else { "fileID:" + $go }
    if (-not $name.StartsWith($SafeAreaPrefix, [System.StringComparison]::Ordinal)) {
      $violations.Add("$rel :: $name - UISafeArea on a node not named '$SafeAreaPrefix*' (safe-area boundary unlocatable)")
    }
  }

  # 不变量 2:m_btn_Mask 不得落在任一安全区子树内。hop 上限 64 兼作环形父链的兜底。
  foreach ($mgo in $maskGos) {
    $maskNodeCount++
    if (-not $goT.ContainsKey($mgo)) { continue }
    $t = $goT[$mgo]
    $hops = 0
    while ($tFather.ContainsKey($t) -and $tFather[$t] -ne "0" -and $hops -lt 64) {
      $t = $tFather[$t]
      $hops++
      if (-not $tGo.ContainsKey($t)) { break }
      $ancestorGo = $tGo[$t]
      if ($safeGos.ContainsKey($ancestorGo)) {
        $aname = if ($goNames.ContainsKey($ancestorGo)) { $goNames[$ancestorGo] } else { "fileID:" + $ancestorGo }
        $violations.Add("$rel :: $MaskNodeName - nested under safe-area node '$aname' (mask shrinks off the notch strip, taps fall through)")
        break
      }
    }
  }
}

if ($violations.Count -gt 0) {
  $suffixSample = $SafeAreaPrefix + "_跳过钮"
  Write-Host "SAFE AREA CHECK : $($violations.Count) violation(s)"
  $violations | ForEach-Object { Write-Host "  $_" }
  Write-Host "  fix (naming): rename the node carrying UISafeArea to '$SafeAreaPrefix' (suffixes are fine: '$suffixSample')."
  Write-Host "                If its current name is an m_ binding field, do NOT rename it - insert a '$SafeAreaPrefix' node,"
  Write-Host "                move the bound node under it, and move the component there."
  Write-Host "  fix (mask):   move $MaskNodeName out to the window root, as a sibling of the safe-area node."
  exit 1
}
Write-Host "SAFE AREA CHECK : clean ($safeAreaNodeCount safe-area node(s), $maskNodeCount mask node(s))"
exit 0
