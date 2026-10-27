# UI绑定核对.ps1 - static check: every m_ field a window's _Gen.g.cs declares, and every object-reference
#   [SerializeField] of a hand-written Part, is actually bound in the UI prefabs.
# 准入: Since=2026-08-21 | Basis=存量 | Origin=cd4cd9f12 入库,引入事故无记载 | Retire=UI 绑定改由生成器构造保证、缺绑在窗创建时即显形时
# Invariant: UI node references are stored as prefab serialization (bind-by-node-name), never resolved at
#   runtime. There is no compile-time link between a generated [SerializeField] field and the prefab, so a
#   field that never got bound compiles clean, looks clean in the editor, and throws NullReferenceException
#   the moment the panel opens - on whoever opens it, which may well be a player on a shipped build.
# Why a gate check: the binding step is a separate manual action (Inspector button / menu
#   `TEngine/UI 绑定/全量绑定并校验 UI prefab 引用`) run after the class compiles. Skipping it, or renaming a
#   node after running it, leaves no trace anywhere the compiler or the other gate passes can see.
# Three failure modes, reported separately because the fixes differ:
#   NO-NODE  - the reference is dead AND no same-named node exists -> node tree changed but _Gen was not
#              regenerated, or the node was renamed. Fix: regenerate _Gen (isGenImp:false), recompile, re-bind.
#   MISSING  - field has no serialized entry in the prefab -> component not attached, or prefab not
#              re-serialized after the field was added. Fix: attach the component / re-run binding.
#   UNBOUND  - entry reads {fileID: 0} -> binding never ran for this field. Fix: re-run binding.
# Deliberately NOT reported: a live reference (fileID != 0) whose node carries a different name. That panel
#   works at runtime - the reference points at a real object - and only breaks the NEXT time bind-by-name
#   runs. Flagging it would fire on every hand-bound field, and this scan reports only present-tense faults.
# Scope, two tiers:
#   windows - fields enumerated from _Gen.g.cs, checked against the window component's block (all of the above).
#   Both UI roots are scanned: GameBase/UI (base layer) and GameLogic/UI (game layer), each with its own UI/Gen.
#   Parts   - hand-written `XxxPart.cs` under either UI root (no _Gen; same naming rule as the menu tool:
#             class name ends in "Part"). Every object-reference [SerializeField] field is checked in every
#             LOCAL component block of that script across all UI prefabs - the Part's own prefab and any
#             unpacked copy of it inside a window. MISSING / UNBOUND only; NO-NODE does not apply (Part
#             fields are often hand-dragged and need not match a node name). The case this tier exists for:
#             a field added to the class and wired only in the Part's own prefab, while unpacked copies in
#             windows never get the entry (fd70177df -> UIPetIntimacyPanel NRE; earlier 0c37cc254 m_frame).
#             Not covered: nested prefab instances (their values live in the source prefab, which is itself
#             checked) and per-instance overrides that null a field out.
#   A field counts as an object reference unless its declared type is a known value type / collection, or
#   some prefab serializes it as a scalar (enum, struct) - so a brand-new field nobody has serialized yet is
#   still checked.
# Runs pre-Unity inside the client gate (客户端自检.ps1, main project and slots alike); pure text scan.
# Exit codes: 0 clean, 1 violation (printed), 2 Gen / prefab directory missing.
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # a Demo root (has Assets/)
)
$ErrorActionPreference = "Stop"

$ProjectDir = $ProjectDir.TrimEnd('\')
$hotfixDir  = Join-Path $ProjectDir "Assets/GameScripts/HotFix"
$prefabRoot = Join-Path $ProjectDir "Assets/AssetRaw/UI"

# UI 代码根:底座层 GameBase 与游戏层 GameLogic 各一份 <程序集>/UI,生成物在各自的 UI/Gen。
# 游戏层是生成器的缺省根,它的 UI 或 Gen 不在 = 目录布局变了,判 INFRA;底座层的 UI / Gen 不在只是还没有窗或件下沉,跳过。
$uiRoots = New-Object System.Collections.Generic.List[string]
$genRoots = New-Object System.Collections.Generic.List[string]
foreach ($asm in @("GameBase", "GameLogic")) {
  $ui = Join-Path $hotfixDir "$asm/UI"
  $gen = Join-Path $ui "Gen"
  if ($asm -eq "GameLogic") {
    foreach ($p in @($ui, $gen)) {
      if (-not (Test-Path $p)) { Write-Host "UI BINDING CHECK : INFRA - '$p' not found (layout changed? sync UI绑定核对.ps1)"; exit 2 }
    }
  }
  if (Test-Path $ui) { $uiRoots.Add($ui) }
  if (Test-Path $gen) { $genRoots.Add($gen) }
}
if (-not (Test-Path $prefabRoot)) { Write-Host "UI BINDING CHECK : INFRA - '$prefabRoot' not found (layout changed? sync UI绑定核对.ps1)"; exit 2 }

# _Gen.g.cs 里字段的生成形态：  [SerializeField] private Button m_btn_Close = null!;
# 类型段允许泛型与命名空间限定（LoopGridView / UnityEngine.UI.Button / List<T>）。
$fieldRe = '\[SerializeField\]\s+private\s+[\w\.\<\>\[\]]+\s+(?<field>m_\w+)'

# impl partial 上的 [Window(... location : "UIXxxPanel" ...)] —— 省略 location 时类名即 location。

$locationRe = 'location\s*:\s*"(?<loc>[^"]+)"'

$violations = New-Object System.Collections.Generic.List[string]
$checkedPanels = 0
$checkedFields = 0

# ---------------- 一次取全 ----------------
# 目录只枚举一遍、每个 prefab 只读一遍只切一遍,两档共用。原先逐窗递归找一次 prefab、逐字段对整份 prefab
# 跑两条正则,真工程(118 窗 / 1252 字段 / 143 个 prefab)要 6 秒以上;这道既在客户端自检里跑,也挂在
# git 提交前钩子上,后者是人在等。
# 「同名取第一个」的次序 = 递归枚举的次序,与原先逐个 -Filter 递归查找取到的是同一个。

# impl 源码:文件名(不分大小写)-> 第一份不在 Gen\ 下的。两个根都在全局命名空间,同名类编不过,不会两根各有一份。
$implByName = New-Object 'System.Collections.Generic.Dictionary[string,object]' ([System.StringComparer]::OrdinalIgnoreCase)
$partSources = New-Object System.Collections.Generic.List[object]
foreach ($src in ($uiRoots | ForEach-Object { Get-ChildItem -Path $_ -Filter '*.cs' -Recurse -File })) {
  if ($src.FullName -match '\\Gen\\') { continue }
  if ($src.Extension -ne '.cs') { continue }   # -Filter '*.cs' 按 8.3 规则也会带出 .csproj 之类
  if (-not $implByName.ContainsKey($src.Name)) { $implByName[$src.Name] = $src }
  if ($src.Name -like '*Part.cs') { $partSources.Add($src) }
}

# prefab:文件名(不分大小写)-> 第一份;全量清单留给 Part 档。
$prefabFiles = @(Get-ChildItem -Path $prefabRoot -Filter '*.prefab' -Recurse -File | Where-Object { $_.Extension -eq '.prefab' })
$prefabByName = New-Object 'System.Collections.Generic.Dictionary[string,object]' ([System.StringComparer]::OrdinalIgnoreCase)
foreach ($pf in $prefabFiles) { if (-not $prefabByName.ContainsKey($pf.Name)) { $prefabByName[$pf.Name] = $pf } }

$docHead = "--- !u!"
# 行首空白写成后顾:正则以字面量开头,引擎才能先按字面量跳着找,再回头验行首;写成 ^\s+ 起头要逐行试,慢一个量级。
$scriptLineRe = New-Object regex '(?m)(?<=^\s+)(?<k>m_Script):\s*\{fileID:\s*11500000,\s*guid:\s*(?<g>[0-9a-fA-F]+)\s*,'
$prefabCache = @{}   # 全路径 -> Get-PrefabInfo 的结果

# 读一个 prefab 并切成 YAML 文档。回 @{ Text; Starts; Scripts }:
#   Starts  - 各文档在 Text 里的起点(升序)。文档 = 行首 "--- !u!" 起到下一个同样的行首之前;首个 "--- !u!"
#             之前的文件头(%YAML / %TAG)自成一段,与按 (?m)^(?=--- !u!) 切出来的分段逐一对应。
#   Scripts - 全文里每条 m_Script 行:@{ Doc = 所在文档序号; Guid = 小写 guid },按出现次序。
function Get-PrefabInfo($File) {
  if ($prefabCache.ContainsKey($File.FullName)) { return $prefabCache[$File.FullName] }
  $text = [System.IO.File]::ReadAllText($File.FullName)
  $starts = New-Object System.Collections.Generic.List[int]
  $starts.Add(0)
  $i = $text.IndexOf($docHead, [System.StringComparison]::Ordinal)
  while ($i -ge 0) {
    if ($i -gt 0 -and $text[$i - 1] -eq "`n") { $starts.Add($i) }
    $i = $text.IndexOf($docHead, $i + 1, [System.StringComparison]::Ordinal)
  }
  $startArr = $starts.ToArray()
  $scripts = New-Object System.Collections.Generic.List[object]
  foreach ($m in $scriptLineRe.Matches($text)) {
    $d = [System.Array]::BinarySearch($startArr, $m.Groups['k'].Index)
    if ($d -lt 0) { $d = (-bnot $d) - 1 }
    $scripts.Add(@{ Doc = $d; Guid = $m.Groups['g'].Value.ToLowerInvariant() })
  }
  $info = @{ Text = $text; Starts = $startArr; Scripts = $scripts }
  $prefabCache[$File.FullName] = $info
  return $info
}

function Get-PrefabDoc($Info, [int]$Index) {
  $from = $Info.Starts[$Index]
  $to = if ($Index + 1 -lt $Info.Starts.Length) { $Info.Starts[$Index + 1] } else { $Info.Text.Length }
  return $Info.Text.Substring($from, $to - $from)
}

# ---------------- 窗档 ----------------
# 节点名一遍取全:  m_Name: m_btn_Close  —— 取单个词的名字入集,字段名不含空白,带空格的节点名不可能是它。
$nodeNameRe  = New-Object regex '(?im)(?<=^\s*)m_Name:\s*(?<n>\S*)\s*$'
# 窗组件块里的引用项一遍取全:  m_btn_Close: {fileID: 3507644079373831382}
$entryLineRe = New-Object regex '(?m)^\s+(?<k>\w+):\s*\{fileID:\s*(?<id>-?\d+)'

foreach ($gen in ($genRoots | ForEach-Object { Get-ChildItem -Path $_ -Filter '*_Gen.g.cs' -File })) {
  $className = $gen.Name -replace '_Gen\.g\.cs$', ''
  $genText   = [System.IO.File]::ReadAllText($gen.FullName)

  $fields = @([regex]::Matches($genText, $fieldRe) | ForEach-Object { $_.Groups['field'].Value } | Select-Object -Unique)
  if ($fields.Count -eq 0) { continue }   # 生成物无绑定字段（空面板），无可核对项

  # location：优先取 impl partial 的 [Window] 特性，取不到用类名（生成器默认约定）。
  # 窗组件的 script guid 取 impl 源码的 .meta:Unity 按「文件名 = 类名」的那份源码挂 MonoBehaviour。
  $loc = $className
  $winGuid = $null
  $impl = $null
  if ($implByName.ContainsKey("$className.cs")) { $impl = $implByName["$className.cs"] }
  if ($null -ne $impl) {
    $lm = [regex]::Match([System.IO.File]::ReadAllText($impl.FullName), $locationRe)
    if ($lm.Success) { $loc = $lm.Groups['loc'].Value }
    $meta = $impl.FullName + ".meta"
    if (Test-Path -LiteralPath $meta) {
      $gm = [regex]::Match([System.IO.File]::ReadAllText($meta), '(?m)^guid:\s*(?<g>[0-9a-fA-F]+)\s*$')
      if ($gm.Success) { $winGuid = $gm.Groups['g'].Value }
    }
  }

  if (-not $prefabByName.ContainsKey("$loc.prefab")) {
    $violations.Add("$($gen.Name) : prefab '$loc.prefab' not found under Assets/AssetRaw/UI")
    continue
  }

  $checkedPanels++
  $info = Get-PrefabInfo $prefabByName["$loc.prefab"]
  $prefabText = $info.Text

  $nodeNames = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
  foreach ($m in $nodeNameRe.Matches($prefabText)) { [void]$nodeNames.Add($m.Groups['n'].Value) }

  # 字段序列化项只在窗组件自己的 MonoBehaviour 块里取:窗内子节点的 Part 组件常有同名字段
  # (m_btn_Close 等),整文件取第一个同名条目会拿到 Part 的项,窗漏绑被放过或已绑被误报。
  # 取不到 guid(impl 缺失或无 .meta)时退回整文件取项;取到 guid 而 prefab 里没有该块 =
  # 窗组件没挂,各字段按无序列化项处理(MISSING / NO-NODE)。
  $entries = $null   # 字段名 -> 窗组件块里第一条同名引用项的 fileID;$null = 退回整文件逐字段取
  if ($winGuid) {
    $entries = New-Object 'System.Collections.Generic.Dictionary[string,string]' ([System.StringComparer]::Ordinal)
    $want = $winGuid.ToLowerInvariant()
    foreach ($s in $info.Scripts) {
      if ($s.Guid -ne $want) { continue }
      foreach ($m in $entryLineRe.Matches((Get-PrefabDoc $info $s.Doc))) {
        $k = $m.Groups['k'].Value
        if (-not $entries.ContainsKey($k)) { $entries[$k] = $m.Groups['id'].Value }
      }
      break
    }
  }

  foreach ($f in $fields) {
    $checkedFields++

    $hasNode = $nodeNames.Contains($f)
    $entryId = $null
    if ($null -ne $entries) {
      if ($entries.ContainsKey($f)) { $entryId = $entries[$f] }
    } else {
      $em = [regex]::Match($prefabText, '(?m)^\s+' + [regex]::Escape($f) + ':\s*\{fileID:\s*(?<id>-?\d+)')
      if ($em.Success) { $entryId = $em.Groups['id'].Value }
    }

    if ($null -eq $entryId) {
      if (-not $hasNode) {
        $violations.Add("$loc.prefab : NO-NODE  $f - no node named '$f' and no serialized entry; regenerate _Gen then re-run binding")
      } else {
        $violations.Add("$loc.prefab : MISSING  $f - node exists but field has no serialized entry; attach the component / re-run binding")
      }
      continue
    }
    if ($entryId -eq '0') {
      if (-not $hasNode) {
        $violations.Add("$loc.prefab : NO-NODE  $f - entry is {fileID: 0} and no node named '$f' exists; node renamed or deleted after binding")
      } else {
        $violations.Add("$loc.prefab : UNBOUND  $f - entry is {fileID: 0}; re-run 'TEngine/UI 绑定/全量绑定并校验 UI prefab 引用'")
      }
    }
  }
}

# ---------------- Part 档 ----------------
# Part 源码里的字段形态:  [SerializeField] private AvatarViewPart _avatarView = null!;
# 特性可带参数或多个连写([SerializeField, FormerlySerializedAs("x")] / 另起一行的 [FormerlySerializedAs]),
# 字段名不限 m_ 前缀(手拖字段)。
$partFieldRe = '\[SerializeField[^\]]*\](?:\s*\[[^\]]*\])*\s*(?:(?:private|protected|public|internal|readonly)\s+)*(?<type>[\w\.]+(?:<[^;=]*?>)?(?:\[\])?)\s+(?<field>\w+)\s*(?:=|;)'
# 声明类型即可断定不是对象引用的:值类型、字符串、集合(集合元素不逐个核)。
$valueTypeRe = '^(?:System\.)?(?:bool|byte|sbyte|short|ushort|int|uint|long|ulong|float|double|decimal|char|string|Boolean|Int32|Int64|Single|Double|String|Color|Color32|Vector2|Vector3|Vector4|Vector2Int|Vector3Int|Quaternion|Rect|RectOffset|Bounds|LayerMask|AnimationCurve|Gradient)$|\[\]$|^(?:List|IList|Dictionary)<'

$parts = @{}   # script guid -> @{ Name; Fields = [ordered]@{ field -> type } }
foreach ($src in $partSources) {
  $meta = $src.FullName + ".meta"
  if (-not (Test-Path -LiteralPath $meta)) { continue }
  $gm = [regex]::Match([System.IO.File]::ReadAllText($meta), '(?m)^guid:\s*(?<g>[0-9a-fA-F]+)\s*$')
  if (-not $gm.Success) { continue }
  $fields = [ordered]@{}
  foreach ($m in [regex]::Matches([System.IO.File]::ReadAllText($src.FullName), $partFieldRe)) {
    $t = $m.Groups['type'].Value
    if ($t -match $valueTypeRe) { continue }
    $fields[$m.Groups['field'].Value] = $t
  }
  if ($fields.Count -gt 0) { $parts[$gm.Groups['g'].Value.ToLowerInvariant()] = @{ Name = $src.BaseName; Fields = $fields } }
}

# 逐 prefab 取本地(非 stripped)MonoBehaviour 块;嵌套实例的块是 stripped、不带字段,值在源 prefab 里另行被核。
$partBlocks = New-Object System.Collections.Generic.List[object]
$scalarSeen = @{}   # "guid|field" -> 有 prefab 把它序列化成非 {fileID} 形态(枚举 / 结构体),不按引用核
$checkedPartBlocks = 0
if ($parts.Count -gt 0) {
  foreach ($pf in $prefabFiles) {
    $info = Get-PrefabInfo $pf
    $goNames = $null   # GameObject fileID -> 节点名;本 prefab 里出现第一个 Part 块时才建
    $lastDoc = -1
    foreach ($s in $info.Scripts) {
      if ($s.Doc -eq $lastDoc) { continue }   # 一个块只认它的第一条 m_Script
      $lastDoc = $s.Doc
      $g = $s.Guid
      if (-not $parts.ContainsKey($g)) { continue }
      $doc = Get-PrefabDoc $info $s.Doc
      if ($doc -notmatch '^--- !u!114 &-?\d+\s*\r?\n') { continue }   # stripped 头带后缀,不命中
      if ($null -eq $goNames) {
        $goNames = @{}
        for ($d = 0; $d -lt $info.Starts.Length; $d++) {
          if ([string]::CompareOrdinal($info.Text, $info.Starts[$d], "--- !u!1 &", 0, 10) -ne 0) { continue }
          $goDoc = Get-PrefabDoc $info $d
          $gh = [regex]::Match($goDoc, '^--- !u!1 &(?<id>-?\d+)\s*\r?\n')
          if ($gh.Success) {
            $nm = [regex]::Match($goDoc, '(?m)^\s+m_Name:\s*(?<n>.*?)\s*$')
            if ($nm.Success) { $goNames[$gh.Groups['id'].Value] = $nm.Groups['n'].Value }
          }
        }
      }
      $goId = [regex]::Match($doc, '(?m)^\s+m_GameObject:\s*\{fileID:\s*(?<id>-?\d+)').Groups['id'].Value
      $node = if ($goNames.ContainsKey($goId)) { $goNames[$goId] } else { "?" }
      $rel = $pf.FullName.Substring($prefabRoot.Length).TrimStart('\', '/')
      $partBlocks.Add(@{ Guid = $g; Prefab = $rel; Node = $node; Doc = $doc })
      foreach ($f in $parts[$g].Fields.Keys) {
        $em = [regex]::Match($doc, '(?m)^  ' + [regex]::Escape($f) + ':[ \t]*(?<v>.*?)\s*$')
        if ($em.Success -and $em.Groups['v'].Value -notmatch '^\{fileID:') { $scalarSeen["$g|$f"] = $true }
      }
    }
  }
}

foreach ($b in $partBlocks) {
  $checkedPartBlocks++
  $cls = $parts[$b.Guid].Name
  foreach ($f in $parts[$b.Guid].Fields.Keys) {
    if ($scalarSeen.ContainsKey("$($b.Guid)|$f")) { continue }
    $em = [regex]::Match($b.Doc, '(?m)^  ' + [regex]::Escape($f) + ':\s*\{fileID:\s*(?<id>-?\d+)')
    if (-not $em.Success) {
      $violations.Add("$($b.Prefab) : MISSING  $cls.$f @ '$($b.Node)' - component block has no entry for the field; an unpacked copy of the Part prefab (replace it with a nested instance) or never re-serialized")
    } elseif ($em.Groups['id'].Value -eq '0') {
      $violations.Add("$($b.Prefab) : UNBOUND  $cls.$f @ '$($b.Node)' - entry is {fileID: 0}; drag the reference / re-run 'TEngine/UI 绑定/全量绑定并校验 UI prefab 引用'")
    }
  }
}

if ($violations.Count -gt 0) {
  Write-Host "UI BINDING CHECK : FAIL - $($violations.Count) unbound / stale field(s); each one is a NullReferenceException on panel open"
  foreach ($v in $violations) { Write-Host "  - $v" }
  exit 1
}

Write-Host "UI BINDING CHECK : PASS ($checkedFields field(s) across $checkedPanels panel(s) bound; $checkedPartBlocks Part component(s) across $($parts.Count) Part class(es) bound)"
exit 0
