# 工程链接核对.ps1 - 仓内工具 csproj 的链接目标存在性静态扫描(纯文本 + XML 解析,只读)。
# 准入: Since=2026-09-19 | Basis=存量 | Origin=0535b5c1b 工具 csproj 链接了已删源文件,实发一次 | Retire=工具 csproj 改为通配引入、不再逐文件链接时 | Reviewed=2026-10-08
#
# 不变量:入仓候选(已跟踪 + 未跟踪未忽略)的每个 .csproj,其 <Compile Include> 与 <ProjectReference Include> 指向的
# 文件都存在;带通配符的项,通配符之前的目录存在。
#
# 为什么:Configs / Tools 下的工具工程(OfferCfgCheck 等)以 <Compile Include ... Link> 链接
# Demo 里的源文件,与运行时编译同一份源。删源文件时 Unity 侧编译照过——这些工程不在
# Unity 与服务端自检的编译面里——断链只在下次有人导表(导表脚本会编 OfferCfgCheck)时以 CS2001
# 中止显形,且报在与本次改动无关的会话里。实发一次:GameConfigBB.cs 整类删除后 OfferCfgCheck
# 仍链接它,main 上两端导表中止(见 814bc76e8 正文)。
#
# 属性展开:只认本文件 <PropertyGroup> 内定义的属性与 MSBuildThisFileDirectory /
# MSBuildProjectDirectory 两个内置属性;展不开的项跳过并打 NOTE(不判违规——判不了的不拦)。
# 含 @( / %( 的项同样跳过。Unity 生成的 csproj 被 .gitignore 忽略,不在面内;Fantasy 仓的工程由
# 服务端自检的 dotnet build 覆盖,本道只扫客户端仓。
#
# 出口码: 0 PASS(全部链接目标存在)
#         1 FAIL(至少一个链接目标缺失)
#         2 INFRA(仓根推不出 / git 列文件报错 / csproj 不是合法 XML)
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # 槽位的 Demo,仓根 = 其父目录
)
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path $ProjectDir -Parent
if (-not (Test-Path -LiteralPath (Join-Path $repoRoot ".git"))) {
  Write-Host "VERDICT : INFRA - repo root '$repoRoot' is not a git checkout (.git missing)"; exit 2
}

# ── 入仓候选清单 ──────────────────────────────────────────
# 面 = 已跟踪 + 未跟踪未忽略(*.csproj;Unity 生成的那批由 Demo/.gitignore 排除)。
# 主工程与人工入库通道是「先自检、再提交」,新建未 add 的文件此刻只在 --others 里,
# 只看已跟踪会让它自检照过后入仓。已删未提交的仍在索引里,下方逐个 Test-Path 跳过。
# -z 输出以 NUL 分隔、不做引号转义(中文名原样),stdout / stderr 各落临时文件再按 UTF-8 解:
# 直接接管道会按控制台代码页解码,中文文件名(仓内确有)解成乱码路径、后续读文件全落空。
# git 非零退出一律 INFRA——`>` 重定向会先建出空文件,不看退出码就把「git 报错」读成「空清单」放行。
$listFile = Join-Path $env:TEMP ("csproj-scan-" + [Guid]::NewGuid().ToString("N") + ".txt")
$errFile  = $listFile + ".err"
try {
  & cmd /c "cd /d `"$repoRoot`" && git -c core.quotepath=false ls-files -z --cached --others --exclude-standard -- Demo/*.csproj > `"$listFile`" 2> `"$errFile`""
  $gitCode = $LASTEXITCODE
  if ($gitCode -ne 0 -or -not (Test-Path -LiteralPath $listFile)) {
    $err = if (Test-Path -LiteralPath $errFile) { ([System.IO.File]::ReadAllText($errFile, [System.Text.Encoding]::UTF8)).Trim() } else { "" }
    Write-Host "VERDICT : INFRA - git ls-files failed (exit $gitCode): $err"; exit 2
  }
  # 未合并路径在 --cached 下按 stage 重复列出,去重
  $rels = @(([System.IO.File]::ReadAllText($listFile, [System.Text.Encoding]::UTF8) -split "`0") |
            Where-Object { $_ } | Sort-Object -Unique)
} finally {
  foreach ($f in @($listFile, $errFile)) { if (Test-Path -LiteralPath $f) { [System.IO.File]::Delete($f) } }
}

if ($rels.Count -eq 0) { Write-Host "OK  工程链接核对: no .csproj in repo (tracked + untracked)"; exit 0 }

function Expand-Props([string]$Text, [hashtable]$Props) {
  for ($i = 0; $i -lt 10 -and $Text -match '\$\(([^)]+)\)'; $i++) {
    $Text = [regex]::Replace($Text, '\$\(([^)]+)\)', {
      param($m)
      $k = $m.Groups[1].Value
      if ($Props.ContainsKey($k)) { $Props[$k] } else { $m.Value }
    })
  }
  return $Text
}

$bad = @()
$notes = @()
$checked = 0
foreach ($rel in $rels) {
  $full = Join-Path $repoRoot ($rel -replace '/', '\')
  if (-not (Test-Path -LiteralPath $full)) { continue }   # 已删未提交,不是本道的事
  $dir = Split-Path $full -Parent
  try { $xml = [xml][System.IO.File]::ReadAllText($full, [System.Text.Encoding]::UTF8) }
  catch { Write-Host "VERDICT : INFRA - $rel is not valid XML: $($_.Exception.Message)"; exit 2 }

  $props = @{ MSBuildThisFileDirectory = ($dir + '\'); MSBuildProjectDirectory = $dir }
  foreach ($pg in @($xml.GetElementsByTagName("PropertyGroup"))) {
    foreach ($p in @($pg.ChildNodes)) {
      if ($p.NodeType -eq [System.Xml.XmlNodeType]::Element) { $props[$p.LocalName] = $p.InnerText.Trim() }
    }
  }

  foreach ($kind in @("Compile", "ProjectReference")) {
    foreach ($item in @($xml.GetElementsByTagName($kind))) {
      $inc = $item.GetAttribute("Include")
      if (-not $inc) { continue }
      foreach ($raw in ($inc -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ })) {
        if ($raw -match '@\(|%\(') { $notes += "$rel  $kind '$raw' uses item/metadata expansion, skipped"; continue }
        $val = Expand-Props $raw $props
        if ($val -match '\$\(') { $notes += "$rel  $kind '$raw' has unresolved property, skipped"; continue }
        $val = $val -replace '/', '\'
        $target = if ([System.IO.Path]::IsPathRooted($val)) { $val } else { Join-Path $dir $val }
        $checked++
        if ($target -match '[*?]') {
          # 通配项:匹配空集时 MSBuild 不报错,只核通配符之前的目录还在
          $segs = $target -split '\\'
          $baseSegs = @()
          foreach ($s in $segs) { if ($s -match '[*?]') { break }; $baseSegs += $s }
          $base = $baseSegs -join '\'
          if (-not (Test-Path -LiteralPath $base -PathType Container)) {
            $bad += [pscustomobject]@{ Proj = $rel; Kind = $kind; Raw = $raw; Missing = $base + '\ (wildcard base dir)' }
          }
        } elseif (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
          $bad += [pscustomobject]@{ Proj = $rel; Kind = $kind; Raw = $raw; Missing = [System.IO.Path]::GetFullPath($target) }
        }
      }
    }
  }
}

foreach ($n in $notes) { Write-Host ("NOTE " + $n) }

if ($bad.Count -gt 0) {
  Write-Host "VIOLATION 工程链接核对: tracked .csproj links a file that does not exist (tool build breaks with CS2001 / MSB9008)"
  foreach ($b in $bad) {
    Write-Host ("  " + $b.Proj + "  <" + $b.Kind + " Include=`"" + $b.Raw + "`">  missing: " + $b.Missing)
  }
  Write-Host "FIX: the source was deleted or moved - remove or repoint the item in that .csproj in the same change."
  exit 1
}

Write-Host ("OK  工程链接核对: " + $rels.Count + " .csproj (tracked + untracked), " + $checked + " linked items all present")
exit 0
