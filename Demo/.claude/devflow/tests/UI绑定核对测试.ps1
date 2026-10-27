# UI绑定核对测试.ps1 — UI绑定核对.ps1 的 CLI 层契约测试(黑盒断言,夹具落 %TEMP%,零 git)。
# 覆盖三类违规各自的判定路径(UNBOUND / MISSING / NO-NODE 两种成因)、有意不报的一类
# (活引用 + 节点改名)、location 显式指定、prefab 缺失、无字段的空生成物、递归寻 prefab,
# 以及 Gen / prefab 目录缺失两类 INFRA;Part 档(T17-T21)覆盖解包副本缺项 MISSING、漏拖 UNBOUND、
# 嵌套实例 stripped 块不核、值类型与标量字段不按引用核;T22-T24 覆盖底座层 GameBase/UI 根(窗档、location、Part 档)。
# 「有意不报」那条(T6)是承重用例:它锁住的是判据边界而不是功能——把它改成报,每个手工绑定
# 的字段都会误触;把整条删掉,下次有人「顺手补全」判据时不会有任何东西拦住。
# 夹具自造最小 _Gen.g.cs 与 prefab,不读真工程——结论不随真工程的窗与 prefab 漂移。
# 跑法:UI绑定核对测试.ps1 [-Target <实现路径>]   缺省 = 同目录上级的 UI绑定核对.ps1
[CmdletBinding(PositionalBinding=$false)]
param(
  [string]$Target = ""
)
$ErrorActionPreference = "Stop"
. (Join-Path (Split-Path $PSCommandPath -Parent) "测试夹具库.ps1")
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dfDir = Split-Path (Split-Path $PSCommandPath -Parent) -Parent
if (-not $Target) { $Target = Join-Path $dfDir "UI绑定核对.ps1" }
if (-not (Test-Path $Target)) { Write-Host "INFRA: target not found: $Target"; exit 2 }

$script:fx = Join-Path $env:TEMP ("flowtest-uibind-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $script:fx | Out-Null

$script:UIRel     = "Assets\GameScripts\HotFix\GameLogic\UI"
$script:GenRel    = "Assets\GameScripts\HotFix\GameLogic\UI\Gen"
$script:PrefabRel = "Assets\AssetRaw\UI"

# 最小 _Gen.g.cs:实现只按 `[SerializeField] private <类型> <m_字段>` 取字段名。
function New-GenText([string]$ClassName, [string[]]$Fields) {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine("public partial class $ClassName : UIPanelMono")
  [void]$sb.AppendLine("{")
  foreach ($f in $Fields) { [void]$sb.AppendLine("`t[SerializeField] private Button $f = null!;") }
  [void]$sb.AppendLine("}")
  return $sb.ToString()
}

# 最小 prefab:$Nodes = 节点名数组(产 `m_Name: X` 行);$Entries = 字段名 -> fileID 值
# (产 `  <字段>: {fileID: N}` 行,值给 "0" 即模拟未绑定;字段不在表里即模拟无序列化项)。
# $Comps(可选)= 按序落盘的 MonoBehaviour 块 @(@{ Guid; Entries }),给了就替代缺省那一块——
# 用来造「窗组件 + 子节点 Part 组件同有一个字段名」的多组件 prefab。
function New-PrefabText([string[]]$Nodes, [hashtable]$Entries, [array]$Comps) {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine("%YAML 1.1")
  $i = 100
  foreach ($n in $Nodes) {
    $i++
    [void]$sb.AppendLine("--- !u!1 &$i")
    [void]$sb.AppendLine("GameObject:")
    [void]$sb.AppendLine("  m_Name: $n")
  }
  if (-not $Comps) { $Comps = @(@{ Guid = "deadbeef"; Entries = $Entries }) }
  $c = 900
  foreach ($comp in $Comps) {
    $c++
    # Stripped = 嵌套 prefab 实例的组件块(头带 stripped 后缀、无字段);Raw = 原样落盘的字段行(造标量项)
    $suffix = if ($comp.Stripped) { " stripped" } else { "" }
    [void]$sb.AppendLine("--- !u!114 &$c$suffix")
    [void]$sb.AppendLine("MonoBehaviour:")
    [void]$sb.AppendLine("  m_GameObject: {fileID: 101}")
    [void]$sb.AppendLine("  m_Script: {fileID: 11500000, guid: $($comp.Guid), type: 3}")
    if ($comp.Entries) {
      foreach ($k in $comp.Entries.Keys) { [void]$sb.AppendLine("  ${k}: {fileID: $($comp.Entries[$k])}") }
    }
    if ($comp.Raw) { foreach ($line in $comp.Raw) { [void]$sb.AppendLine("  $line") } }
  }
  return $sb.ToString()
}

# 窗 impl 源码的 .meta:Unity 按它的 guid 把 MonoBehaviour 块挂到窗类上。
function New-MetaText([string]$Guid) { return "fileFormatVersion: 2`nguid: $Guid`nMonoImporter:`n  serializedVersion: 2`n" }

# $Gens = Gen 相对路径 -> 字段数组;$Impls = UI 相对路径 -> 源码;$Prefabs = prefab 相对路径 -> @{Nodes;Entries}
function New-Proj([hashtable]$Gens, [hashtable]$Impls, [hashtable]$Prefabs, [switch]$NoGenDir, [switch]$NoPrefabDir) {
  $proj = Join-Path $script:fx ([Guid]::NewGuid().ToString("N").Substring(0, 8))
  New-Item -ItemType Directory -Force -Path (Join-Path $proj $script:UIRel) | Out-Null
  if (-not $NoGenDir) { New-Item -ItemType Directory -Force -Path (Join-Path $proj $script:GenRel) | Out-Null }
  if (-not $NoPrefabDir) { New-Item -ItemType Directory -Force -Path (Join-Path $proj $script:PrefabRel) | Out-Null }
  if ($Gens) {
    foreach ($rel in $Gens.Keys) {
      $cls = $rel -replace '_Gen\.g\.cs$', ''
      Write-Src (Join-Path (Join-Path $proj $script:GenRel) $rel) (New-GenText $cls $Gens[$rel])
    }
  }
  if ($Impls) { foreach ($rel in $Impls.Keys) { Write-Src (Join-Path (Join-Path $proj $script:UIRel) $rel) $Impls[$rel] } }
  if ($Prefabs) {
    foreach ($rel in $Prefabs.Keys) {
      $spec = $Prefabs[$rel]
      Write-Src (Join-Path (Join-Path $proj $script:PrefabRel) $rel) (New-PrefabText $spec.Nodes $spec.Entries $spec.Comps)
    }
  }
  return $proj
}

Write-Host "== UI绑定核对 CLI 测试 target=$([System.IO.Path]::GetFileName($Target)) =="
try {
  # T1 基线:两个字段都有节点、都绑上了
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close', 'm_btn_Ok') } @{} @{
    "UIFooPanel.prefab" = @{ Nodes = @('Root', 'm_btn_Close', 'm_btn_Ok')
                             Entries = @{ m_btn_Close = "111"; m_btn_Ok = "222" } } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 0 -and $r.out -match 'PASS') "T1 字段全绑定 -> PASS"

  # T2 UNBOUND:节点在,序列化项是 {fileID: 0} —— 绑定没跑
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } @{} @{
    "UIFooPanel.prefab" = @{ Nodes = @('Root', 'm_btn_Close'); Entries = @{ m_btn_Close = "0" } } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 1 -and $r.out -match 'UNBOUND\s+m_btn_Close') "T2 节点在但 fileID 0 -> UNBOUND"

  # T3 MISSING:节点在,但 prefab 里根本没有该字段的序列化项 —— 组件没挂 / 没重序列化
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } @{} @{
    "UIFooPanel.prefab" = @{ Nodes = @('Root', 'm_btn_Close'); Entries = @{} } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 1 -and $r.out -match 'MISSING\s+m_btn_Close') "T3 节点在但无序列化项 -> MISSING"

  # T4 NO-NODE(成因一):序列化项是 0,且同名节点也不在 —— 节点改名或删了
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } @{} @{
    "UIFooPanel.prefab" = @{ Nodes = @('Root', 'm_btn_Renamed'); Entries = @{ m_btn_Close = "0" } } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 1 -and $r.out -match 'NO-NODE\s+m_btn_Close') "T4 fileID 0 且无同名节点 -> NO-NODE"

  # T5 NO-NODE(成因二):既无序列化项也无同名节点 —— 改了节点树没重生成 _Gen
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } @{} @{
    "UIFooPanel.prefab" = @{ Nodes = @('Root'); Entries = @{} } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 1 -and $r.out -match 'NO-NODE\s+m_btn_Close') "T5 无项且无节点 -> NO-NODE"

  # T6 有意不报:引用是活的,只是节点名对不上。运行时正常,只在下次重绑时显形。
  # 改成报 = 每个手工绑定字段都会误触(判据边界,不是漏判)。
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } @{} @{
    "UIFooPanel.prefab" = @{ Nodes = @('Root', 'm_btn_Renamed'); Entries = @{ m_btn_Close = "333" } } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 0 -and $r.out -match 'PASS') "T6 活引用 + 节点改名 -> 有意不报"

  # T7 location 显式指定时按它找 prefab,不按类名
  $impl = 'using TEngine; [Window(UILayer.Window, location : "UIRenamedPanel")] public partial class UIFooPanel { }'
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } @{ "UIFooPanel.cs" = $impl } @{
    "UIRenamedPanel.prefab" = @{ Nodes = @('m_btn_Close'); Entries = @{ m_btn_Close = "111" } } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 0 -and $r.out -match 'PASS') "T7 location 显式 -> 按 location 找 prefab"

  # T8 prefab 整个找不到
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } @{} @{}
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 1 -and $r.out -match "prefab 'UIFooPanel.prefab' not found") "T8 prefab 缺失 -> 违规"

  # T9 无绑定字段的生成物:没有可核对项,不因此判违规(也不去找 prefab)
  $p = New-Proj @{ "UIEmptyPanel_Gen.g.cs" = @() } @{} @{}
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 0 -and $r.out -match 'PASS') "T9 空生成物 -> 跳过"

  # T10 prefab 在子目录下也能递归找到
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } @{} @{
    "Prefabs\Sub\UIFooPanel.prefab" = @{ Nodes = @('m_btn_Close'); Entries = @{ m_btn_Close = "111" } } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 0 -and $r.out -match 'PASS') "T10 prefab 位于子目录 -> 递归可寻"

  # T13-T16 字段按组件归属取:窗 prefab 里内嵌的 Part 组件常与窗同名字段(m_btn_Close),
  # 整文件取第一个同名条目会拿到 Part 的。窗组件 = m_Script guid 等于窗 impl 源码 .meta guid 的块。
  $winGuid  = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  $partGuid = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  $implSrc  = 'public partial class UIFooPanel { }'
  $impls    = @{ "UIFooPanel.cs" = $implSrc; "UIFooPanel.cs.meta" = (New-MetaText $winGuid) }

  # T13 Part 在前且已绑、窗自己的项是 0 -> 窗的字段没绑(整文件首条会误判 PASS)
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } $impls @{
    "UIFooPanel.prefab" = @{ Nodes = @('Root', 'm_btn_Close')
                             Comps = @(@{ Guid = $partGuid; Entries = @{ m_btn_Close = "111" } },
                                       @{ Guid = $winGuid;  Entries = @{ m_btn_Close = "0" } }) } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 1 -and $r.out -match 'UNBOUND\s+m_btn_Close') "T13 Part 同名字段在前、窗未绑 -> UNBOUND"

  # T14 反向:Part 在前且是 0、窗已绑 -> 窗正常(整文件首条会误报 UNBOUND)
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } $impls @{
    "UIFooPanel.prefab" = @{ Nodes = @('Root', 'm_btn_Close')
                             Comps = @(@{ Guid = $partGuid; Entries = @{ m_btn_Close = "0" } },
                                       @{ Guid = $winGuid;  Entries = @{ m_btn_Close = "222" } }) } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 0 -and $r.out -match 'PASS') "T14 Part 同名字段未绑、窗已绑 -> PASS"

  # T15 窗组件根本没挂,只有 Part 带同名字段 -> MISSING(不借 Part 的项放过)
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } $impls @{
    "UIFooPanel.prefab" = @{ Nodes = @('Root', 'm_btn_Close')
                             Comps = @(@{ Guid = $partGuid; Entries = @{ m_btn_Close = "111" } }) } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 1 -and $r.out -match 'MISSING\s+m_btn_Close') "T15 窗组件未挂、仅 Part 有同名项 -> MISSING"

  # T16 窗 impl 无 .meta(取不到 guid):退回整文件取项,不因此误报
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } @{ "UIFooPanel.cs" = $implSrc } @{
    "UIFooPanel.prefab" = @{ Nodes = @('Root', 'm_btn_Close')
                             Comps = @(@{ Guid = $winGuid; Entries = @{ m_btn_Close = "111" } }) } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 0 -and $r.out -match 'PASS') "T16 impl 无 .meta -> 退回整文件取项"

  # T17-T21 Part 档:手写 XxxPart.cs 无 _Gen,字段从源码取,逐个本地组件块核。
  # 承重场景 = 给 Part 加字段后只在 Part 自己的 prefab 接线,窗里的解包副本没有该项(T18)。
  $fooGuid = "cccccccccccccccccccccccccccccccc"
  $fooSrc  = @'
public sealed class FooPart : MonoBehaviour
{
    [SerializeField] private Image m_icon;
    // 手拖字段不带 m_ 前缀,特性另起一行
    [FormerlySerializedAs("m_part_Avatar")]
    [SerializeField] private AvatarViewPart _avatarView = null!;
    [SerializeField] private int m_count;
    [SerializeField] private FooKind m_kind;
}
'@
  $partImpls = @{ "Part\FooPart.cs" = $fooSrc; "Part\FooPart.cs.meta" = (New-MetaText $fooGuid) }
  $kindRaw   = @('m_count: 3', 'm_kind: 1')

  # T17 基线:Part 自己的 prefab 与窗里的副本都绑全
  $p = New-Proj @{} $partImpls @{
    "Parts\Foo.prefab"  = @{ Nodes = @('Foo'); Comps = @(@{ Guid = $fooGuid; Entries = @{ m_icon = "11"; _avatarView = "12" }; Raw = $kindRaw }) }
    "UIBarPanel.prefab" = @{ Nodes = @('Cell'); Comps = @(@{ Guid = $fooGuid; Entries = @{ m_icon = "21"; _avatarView = "22" }; Raw = $kindRaw }) } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 0 -and $r.out -match 'PASS' -and $r.out -match '2 Part component') "T17 Part 字段全绑 -> PASS"

  # T18 MISSING:窗里的解包副本没有新加字段的项(fd70177df 事故形态)
  $p = New-Proj @{} $partImpls @{
    "Parts\Foo.prefab"  = @{ Nodes = @('Foo'); Comps = @(@{ Guid = $fooGuid; Entries = @{ m_icon = "11"; _avatarView = "12" }; Raw = $kindRaw }) }
    "UIBarPanel.prefab" = @{ Nodes = @('Cell'); Comps = @(@{ Guid = $fooGuid; Entries = @{ m_icon = "21" }; Raw = $kindRaw }) } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 1 -and $r.out -match 'UIBarPanel\.prefab : MISSING\s+FooPart\._avatarView' -and $r.out -notmatch 'Foo\.prefab : MISSING') "T18 解包副本缺项 -> MISSING(只报副本)"

  # T19 UNBOUND:项在但是 {fileID: 0}(0c37cc254 m_frame 漏拖形态)
  $p = New-Proj @{} $partImpls @{
    "UIBarPanel.prefab" = @{ Nodes = @('Cell'); Comps = @(@{ Guid = $fooGuid; Entries = @{ m_icon = "0"; _avatarView = "22" }; Raw = $kindRaw }) } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 1 -and $r.out -match 'UNBOUND\s+FooPart\.m_icon') "T19 Part 字段 fileID 0 -> UNBOUND"

  # T20 嵌套实例(stripped 块)不带字段,值在源 prefab 里另核,不报
  $p = New-Proj @{} $partImpls @{
    "Parts\Foo.prefab"  = @{ Nodes = @('Foo'); Comps = @(@{ Guid = $fooGuid; Entries = @{ m_icon = "11"; _avatarView = "12" }; Raw = $kindRaw }) }
    "UIBarPanel.prefab" = @{ Nodes = @('Cell'); Comps = @(@{ Guid = $fooGuid; Stripped = $true }) } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 0 -and $r.out -match 'PASS') "T20 嵌套实例 stripped 块 -> 不核"

  # T21 值类型(int)与被序列化成标量的字段(枚举)不按引用核;某块缺了它们也不报
  $p = New-Proj @{} $partImpls @{
    "Parts\Foo.prefab"  = @{ Nodes = @('Foo'); Comps = @(@{ Guid = $fooGuid; Entries = @{ m_icon = "11"; _avatarView = "12" }; Raw = $kindRaw }) }
    "UIBarPanel.prefab" = @{ Nodes = @('Cell'); Comps = @(@{ Guid = $fooGuid; Entries = @{ m_icon = "21"; _avatarView = "22" } }) } }
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 0 -and $r.out -match 'PASS') "T21 值类型 / 标量字段 -> 不核"

  # T22-T24 底座层 UI 根(GameBase/UI 与其 Gen)同样在扫描面内;它不在不算 INFRA(上面各例都没建它)。
  $baseUI  = "Assets\GameScripts\HotFix\GameBase\UI"
  $baseGen = "Assets\GameScripts\HotFix\GameBase\UI\Gen"

  # T22 窗下沉到底座:Gen 与 impl 都在 GameBase,窗字段未绑照报
  $p = New-Proj @{} @{} @{
    "UIBasePanel.prefab" = @{ Nodes = @('Root', 'm_btn_Close'); Comps = @(@{ Guid = $winGuid; Entries = @{ m_btn_Close = "0" } }) } }
  Write-Src (Join-Path (Join-Path $p $baseGen) "UIBasePanel_Gen.g.cs") (New-GenText "UIBasePanel" @('m_btn_Close'))
  Write-Src (Join-Path (Join-Path $p $baseUI) "UIBasePanel.cs") 'public partial class UIBasePanel { }'
  Write-Src (Join-Path (Join-Path $p $baseUI) "UIBasePanel.cs.meta") (New-MetaText $winGuid)
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 1 -and $r.out -match 'UIBasePanel\.prefab : UNBOUND\s+m_btn_Close') "T22 底座层窗未绑 -> UNBOUND"

  # T23 底座层窗的 location 取自底座层 impl
  $p = New-Proj @{} @{} @{
    "UIBaseRenamed.prefab" = @{ Nodes = @('m_btn_Close'); Entries = @{ m_btn_Close = "111" } } }
  Write-Src (Join-Path (Join-Path $p $baseGen) "UIBasePanel_Gen.g.cs") (New-GenText "UIBasePanel" @('m_btn_Close'))
  Write-Src (Join-Path (Join-Path $p $baseUI) "UIBasePanel.cs") 'using TEngine; [Window(UILayer.Window, location : "UIBaseRenamed")] public partial class UIBasePanel { }'
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 0 -and $r.out -match 'PASS') "T23 底座层 impl 的 location -> 按它找 prefab"

  # T24 底座层 Part 档:窗里的解包副本缺项照报
  $p = New-Proj @{} @{} @{
    "UIBarPanel.prefab" = @{ Nodes = @('Cell'); Comps = @(@{ Guid = $fooGuid; Entries = @{ m_icon = "21" }; Raw = $kindRaw }) } }
  Write-Src (Join-Path (Join-Path $p $baseUI) "Part\FooPart.cs") $fooSrc
  Write-Src (Join-Path (Join-Path $p $baseUI) "Part\FooPart.cs.meta") (New-MetaText $fooGuid)
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 1 -and $r.out -match 'UIBarPanel\.prefab : MISSING\s+FooPart\._avatarView') "T24 底座层 Part 缺项 -> MISSING"

  # T11 INFRA:Gen 目录缺失
  $p = New-Proj @{} @{} @{} -NoGenDir
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T11 Gen 目录缺失 -> INFRA"

  # T12 INFRA:prefab 目录缺失
  $p = New-Proj @{ "UIFooPanel_Gen.g.cs" = @('m_btn_Close') } @{} @{} -NoPrefabDir
  $r = Invoke-ScanCheck $Target $p
  Assert-True ($r.code -eq 2 -and $r.out -match 'INFRA') "T12 prefab 目录缺失 -> INFRA"
}
finally {
  Remove-FixtureTree $script:fx
}
Exit-TestSuite
