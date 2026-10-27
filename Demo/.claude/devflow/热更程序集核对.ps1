# 热更程序集核对.ps1 - 热更程序集清单白名单与双文件同步静态扫描(纯文本,只读)。
# 准入: Since=2026-09-04 | Basis=存量 | Origin=5ba8454c0 FantasyClient 被夹带移进热更,出包 SIGSEGV | Retire=热更程序集清单改由构建脚本单源生成、两文件不再手工同步时
#
# 不变量(四条):
#   ① UpdateSetting.asset 的 HotUpdateAssemblies 恰为白名单(成员正本 = 本脚本的 $Whitelist,
#      此处不复述——枚举一份副本必随白名单增删失配);
#   ② 同一个 dll 不同时出现在 HotUpdateAssemblies 与 AOTMetaAssemblies;
#   ③ HybridCLRSettings.asset 的 hotUpdateAssemblies / patchAOTAssemblies 与 UpdateSetting
#      的两个列表逐项一致(前者去 .dll 后缀);
#   ④ HybridCLRSettings.asset 的 hotUpdateAssemblyDefinitions / preserveHotUpdateAssemblies 为空。
#      HybridCLR 把这两项同样算作热更程序集,但它们不在事实源里、ForceUpdateAssemblies 也不写,
#      在 HybridCLR 面板以 asmdef 形态或 preserve 名单加进来的程序集,①③都看不见。
#
# 为什么:UpdateSetting.asset 是热更程序集清单的事实源,HybridCLRSettings.asset 是它经
# UpdateSettingEditor.ForceUpdateAssemblies 产出的派生物。两处都没有编译期或运行期校验,
# 配错的症状全部落在出包之后:
#   - 白名单外的程序集进热更列表 -> 该程序集改走 HybridCLR 解释器加载,配错在编辑器里
#     看不出来(编辑器下 ProcedureLoadAssembly 走 GetMainLogicAssembly() 而非 Assembly.Load)。
#   - 双文件失配 -> 打包读派生物、运行期读事实源,两边对不上,dll 拷不进包或加载不到。
# 编辑器内存持有的 UpdateSetting 旧快照在保存时回写磁盘是已知的夹带路径,人工 review
# 拦不住(改动混在无关提交里),故以静态扫描承接。
#
# 白名单是有意硬编码的:新增热更程序集需要实测出包验证,改这里应当是显式动作。
#
# 内置于 客户端自检.ps1(道次顺序以该脚本内扫描数组为准),一般不单独调用。
#
# 出口码: 0 PASS(四条不变量均成立)
#         1 FAIL(任一不变量被破坏)
#         2 INFRA(两个 asset 任一缺失,或某列表键缺失 / 重复 / 解析不出)
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # 槽位的 Demo
)
$ErrorActionPreference = "Stop"

# 本作的热更程序集:规则核心 GameRules(纯 C#,被 GameLogic 引用)与业务层 GameLogic;Luban 配置程序集建出来时随之加入,
# 加入前须实测出包(见新游戏/工程计划.md Luban 接入)。
$Whitelist = @("GameRules.dll", "GameLogic.dll")

# 返回 @{ Items; Err }:Err 非空 = 该键判不了(缺失 / 重复 / 写法解析不出),调用方判 INFRA。
# 键名区分大小写(两个 asset 里有只差大小写的同名键)。键出现多于一处即报重复:只取首处会拿
# 第一份判定而放过后一份。非空流式写法(`Key: [a, b]`)报解析不出:按块列表读会得到空集放过。
function Get-YamlList {
  param([string[]]$Lines, [string]$Key)
  $keyRe = "^\s*" + [regex]::Escape($Key) + ":\s*(.*)$"
  $hits = @()
  for ($i = 0; $i -lt $Lines.Count; $i++) { if ($Lines[$i] -cmatch $keyRe) { $hits += $i } }
  if ($hits.Count -eq 0) { return @{ Items = $null; Err = "not found" } }
  if ($hits.Count -gt 1) { return @{ Items = $null; Err = ("appears " + $hits.Count + " times") } }
  $i = $hits[0]
  $rest = ([regex]::Match($Lines[$i], $keyRe)).Groups[1].Value.Trim()
  if ($rest -eq "[]") { return @{ Items = @(); Err = $null } }
  if ($rest -ne "") { return @{ Items = $null; Err = ("unparsable value '" + $rest + "'") } }
  $out = @()
  for ($j = $i + 1; $j -lt $Lines.Count; $j++) {
    if ($Lines[$j] -match "^\s*-\s+(.+?)\s*$") { $out += $Matches[1] } else { break }
  }
  return @{ Items = $out; Err = $null }
}

$usPath = Join-Path $ProjectDir "Assets\TEngine\Settings\UpdateSetting.asset"
$hcPath = Join-Path $ProjectDir "ProjectSettings\HybridCLRSettings.asset"
foreach ($p in @($usPath, $hcPath)) {
  if (-not (Test-Path -LiteralPath $p)) {
    Write-Host "VERDICT : INFRA - required asset missing: '$p'"; exit 2
  }
}

$usLines = [System.IO.File]::ReadAllLines($usPath, [System.Text.Encoding]::UTF8)
$hcLines = [System.IO.File]::ReadAllLines($hcPath, [System.Text.Encoding]::UTF8)

$lists = @{}
foreach ($src in @(@("UpdateSetting", "HotUpdateAssemblies"), @("UpdateSetting", "AOTMetaAssemblies"),
                   @("HybridCLRSettings", "hotUpdateAssemblies"), @("HybridCLRSettings", "patchAOTAssemblies"),
                   @("HybridCLRSettings", "hotUpdateAssemblyDefinitions"),
                   @("HybridCLRSettings", "preserveHotUpdateAssemblies"))) {
  $lines = if ($src[0] -eq "UpdateSetting") { $usLines } else { $hcLines }
  $r = Get-YamlList $lines $src[1]
  if ($r.Err) { Write-Host ("VERDICT : INFRA - " + $src[0] + " key '" + $src[1] + "' " + $r.Err); exit 2 }
  $lists[$src[0] + "/" + $src[1]] = $r.Items
}
$hot    = $lists["UpdateSetting/HotUpdateAssemblies"]
$aot    = $lists["UpdateSetting/AOTMetaAssemblies"]
$hcHot  = $lists["HybridCLRSettings/hotUpdateAssemblies"]
$hcAot  = $lists["HybridCLRSettings/patchAOTAssemblies"]
$hcDefs = $lists["HybridCLRSettings/hotUpdateAssemblyDefinitions"]
$hcKeep = $lists["HybridCLRSettings/preserveHotUpdateAssemblies"]

$bad = @()

# 不变量①:白名单
$extra   = @($hot | Where-Object { $Whitelist -notcontains $_ })
$missing = @($Whitelist | Where-Object { $hot -notcontains $_ })
foreach ($e in $extra) { $bad += ("HotUpdateAssemblies 含白名单外的项: " + $e) }
foreach ($m in $missing) { $bad += ("HotUpdateAssemblies 缺白名单项: " + $m) }

# 不变量②:两列表互斥
foreach ($h in $hot) { if ($aot -contains $h) { $bad += ("同时出现在两个列表: " + $h) } }

# 不变量③:双文件同步
$expectHcHot = @($hot | ForEach-Object { $_ -replace "\.dll$", "" })
if (($expectHcHot -join ",") -ne ($hcHot -join ",")) {
  $bad += ("hotUpdateAssemblies 与事实源失配: HybridCLRSettings=[" + ($hcHot -join ",") + "] 应为 [" + ($expectHcHot -join ",") + "]")
}
if (($aot -join ",") -ne ($hcAot -join ",")) {
  $bad += ("patchAOTAssemblies 与事实源失配: HybridCLRSettings " + $hcAot.Count + " 项,UpdateSetting " + $aot.Count + " 项")
}

# 不变量④:事实源之外的热更入口为空
foreach ($e in $hcDefs) { $bad += ("hotUpdateAssemblyDefinitions 非空(asmdef 形态的热更程序集,旁路白名单): " + $e) }
foreach ($e in $hcKeep) { $bad += ("preserveHotUpdateAssemblies 非空(preserve 形态的热更程序集,旁路白名单): " + $e) }

if ($bad.Count -gt 0) {
  Write-Host "VIOLATION 热更程序集核对: hot-update assembly list broken"
  foreach ($b in $bad) { Write-Host ("  " + $b) }
  Write-Host "FIX: 改 Assets\TEngine\Settings\UpdateSetting.asset(事实源),再跑 TEngine.Editor.UpdateSettingEditor.ForceUpdateAssemblies() 同步派生物;不直接改 HybridCLRSettings.asset。"
  Write-Host "     hotUpdateAssemblyDefinitions / preserveHotUpdateAssemblies 不经同步写入,在 HybridCLR 面板清空(热更程序集只经 UpdateSetting 加)。"
  Write-Host "     新增热更程序集是重大决策(需实测出包验证),确认后改本脚本的白名单常量。"
  exit 1
}

Write-Host ("OK  热更程序集核对: hot=[" + ($hot -join ",") + "] aot=" + $aot.Count + " 项,双文件同步")
exit 0
