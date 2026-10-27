# 命名空间扫描.ps1 - static convention scan for project-owned C# sources, two checks:
# 准入: Since=2026-07-27 | Basis=存量 | Origin=e419773f1 随 .claude 首批入库,引入事故无记载 | Retire=命名空间与程序集归属改由编译期约束(asmdef 规则 / 生成器)构造保证时
#   A. namespace convention  (which namespace does this file declare)
#   B. asmdef coverage       (which assembly does this file compile into)
# 同族约定「这段代码归哪个容器」,故同脚本承载;脚本名沿用(引用面宽,改名是纯成本)。
# Convention source of truth: .claude/rules-ondemand/tengine-conventions.md, "客户端命名空间".
# $rules 只覆盖规约中已落地的部分:
#   runtime (GameScripts incl. GameProto handwritten/tests) -> none (global namespace)
#     except HotFix/Network/ -> FantasyNetwork (网络边界层,见该规则的 Overrides 注释)
#   AOT launcher domain (Assets/Launcher)                   -> Launcher
#   project-owned editor tools (Assets/Editor)              -> none (global namespace)
#   generated code and vendored third-party: excluded by path, keep their own namespaces.
# 规约中尚未纳入强制的一项(随对应代码改造写入 $rules):
#   Assets/TEngine -> TEngine  (先在 $rules 列净刻意的全局例外:扩展方法类与个别 Editor 工具类)
# Runs pre-Unity inside the client gate (客户端自检.ps1, main project and slots alike); pure text scan.
# Exit codes: 0 clean, 1 violations (printed), 2 bad ProjectDir.
#
# expected 成员比对大小写不敏感(PowerShell -contains 默认语义);Excludes/Overrides 前缀
# StartsWith 大小写敏感;文件枚举按全路径 Ordinal 排序(确定性,与违规打印顺序绑定)。
[CmdletBinding(PositionalBinding=$false)]
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # a Demo root (has Assets/)
)
$ErrorActionPreference = "Stop"
$assets = (Join-Path $ProjectDir "Assets")
if (-not (Test-Path $assets -PathType Container)) { Write-Host "NAMESPACE SCAN : INFRA - '$assets' not found"; exit 2 }
$assetsNorm = (Resolve-Path $assets).Path.Replace('\','/')

# "(none)" = 该路径下的代码不声明命名空间(类型落全局命名空间),与 $actual 的缺省值同字面。
$rules = @(
  @{ Root = "GameScripts"; Expected = @("(none)")
     Excludes = @("GameScripts/HotFix/GameProto/GameConfig/",  # Luban generated (GameConfig.*)
                  "GameScripts/HotFix/GameProto/LubanLib/")    # Luban runtime lib (Luban)
     # 网络边界层:代码从已删除的 FantasyClient 程序集(Assets/Fantasy/)迁来,留在
     # FantasyNetwork 命名空间不落全局 —— 它与业务侧有三对同名 DTO(QuestEntryView /
     # QuestRedDotView / ActivityQuestRedDotView,字段逐字节相同),靠命名空间分隔,同落
     # 全局即 CS0101。该目录自成 FantasyNetwork 程序集(HotFix/Network/FantasyNetwork.asmdef),
     # B 段覆盖检查由该 asmdef 满足。
     # 协议生成物落 Network/NetworkProtocol/,命名空间 Fantasy 由导出模板写入(改它须改模板)。
     # 前缀更长者须排在前:匹配到即 break。
     Overrides = @(@{ Prefix = "GameScripts/HotFix/Network/NetworkProtocol/"; Expected = @("Fantasy") },
                   @{ Prefix = "GameScripts/HotFix/Network/"; Expected = @("FantasyNetwork") }) },
  @{ Root = "Launcher"; Expected = @("Launcher")
     Excludes = @("Launcher/HybridCLRGenerate/")               # HybridCLR generated (global namespace)
     Overrides = @() },
  @{ Root = "Editor"; Expected = @("(none)")
     Excludes = @("Editor/ToolbarExtender/ToolbarCallback.cs", # vendored (UnityToolbarExtender core)
                  "Editor/ToolbarExtender/ToolbarExtender.cs", # vendored (UnityToolbarExtender core)
                  "Editor/GameConfigEditor/")                  # Luban generated (GameConfigEditor.*)
     Overrides = @() }
)

$decl = [regex]'(?m)^\s*namespace\s+([\w.]+)'
$violations = New-Object System.Collections.Generic.List[string]

foreach ($rule in $rules) {
  $rootPath = Join-Path $assets $rule.Root
  if (-not (Test-Path $rootPath -PathType Container)) {
    $violations.Add("Assets/$($rule.Root): scan root missing - project layout changed, sync 命名空间扫描.ps1")
    continue
  }
  # -Filter 先窄化(大树上远快于全枚举),Extension 再精确判 —— 封 Windows 通配符经短名
  # 误命中 *.cs 以外扩展名的老问题。排序用 Ordinal:文件系统枚举顺序不保证稳定。
  $files = @(Get-ChildItem $rootPath -Recurse -Filter *.cs -File |
             Where-Object { $_.Extension -eq ".cs" } |
             ForEach-Object { $_.FullName })
  [Array]::Sort($files, [System.StringComparer]::Ordinal)

  foreach ($full in $files) {
    $rel = $full.Replace('\','/').Substring($assetsNorm.Length + 1)
    if ([System.IO.Path]::GetFileName($full) -eq "AssemblyInfo.cs") { continue }  # assembly-attribute file, no namespace by design

    $skip = $false
    foreach ($ex in $rule.Excludes) { if ($rel.StartsWith($ex, [System.StringComparison]::Ordinal)) { $skip = $true; break } }
    if ($skip) { continue }

    $expected = $rule.Expected
    foreach ($ov in $rule.Overrides) { if ($rel.StartsWith($ov.Prefix, [System.StringComparison]::Ordinal)) { $expected = $ov.Expected; break } }

    $m = $decl.Match([System.IO.File]::ReadAllText($full))
    $actual = "(none)"
    if ($m.Success) { $actual = $m.Groups[1].Value }
    if ($expected -notcontains $actual) {
      $violations.Add("Assets/$rel : namespace '$actual', expected '$($expected -join "' or '")'")
    }
  }
}

# --- B. asmdef coverage:防隐式 predefined 程序集(Assembly-CSharp / -firstpass)复活 ---
# Unity 规则:不落在任何 asmdef 子树内的 .cs 编进 predefined 程序集。这类代码没有显式引用
# 清单,且 Assembly-CSharp 恒在 AOT 侧——业务代码误落其中会绕开热更边界,编译期无症状、
# 出包才暴露。两类排除:①路径含 Editor 目录(→ Assembly-CSharp-Editor,不打包、不涉热更
# 边界,命名空间由上面 Editor 规则管);②vendored 白名单(第三方包自带,不由本项目维护)。
# 前缀比对全部 Ordinal 大小写敏感,与 A 段 Excludes/Overrides 同口径。
$coverageExcludes = @("Plugins/")   # Unity firstpass 特殊目录;现仅 UniTask 包自带的 assembly 属性文件

# owner 目录与 .cs 清单取 hook函数库「Unity 程序集实扫」正本(Get-UnityAsmScan),不自造副本:
# asmdef / asmref 同效计 owner(Unity 把 asmref 子树并入它引用的 asmdef,本段只判「有没有归属」、
# 不判归属到哪个程序集,故不解析 reference GUID);Assets 根的 owner 是空串,StartsWith("") 恒真 =
# 整棵 Assets 被覆盖;Unity 忽略目录(段以 . 开头或以 ~ 结尾)里的 asmdef / asmref / .cs 对 Unity
# 不存在,一并不计。
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")
$scan = Get-UnityAsmScan $assetsNorm
$asmdefDirs = $scan.OwnerDirs
$allCs = @($scan.AllCs)
[Array]::Sort($allCs, [System.StringComparer]::Ordinal)

foreach ($rel in $allCs) {
  if (("/" + $rel) -cmatch "/Editor/") { continue }

  $skip = $false
  foreach ($ex in $coverageExcludes) { if ($rel.StartsWith($ex, [System.StringComparison]::Ordinal)) { $skip = $true; break } }
  if ($skip) { continue }

  $covered = $false
  foreach ($d in $asmdefDirs) { if ($rel.StartsWith($d, [System.StringComparison]::Ordinal)) { $covered = $true; break } }
  if (-not $covered) {
    $violations.Add("Assets/$rel : no asmdef coverage - compiles into predefined Assembly-CSharp (implicit AOT side, no explicit reference list)")
  }
}

if ($violations.Count -gt 0) {
  Write-Host "NAMESPACE SCAN : $($violations.Count) violation(s) - tengine-conventions.md '客户端命名空间' / asmdef coverage"
  foreach ($v in $violations) { Write-Host "  $v" }
  exit 1
}
Write-Host "NAMESPACE SCAN : clean"
exit 0
