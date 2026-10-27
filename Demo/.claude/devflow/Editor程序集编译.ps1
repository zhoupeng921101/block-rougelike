# Editor程序集编译.ps1 - 把 Assembly-CSharp-Editor 真编一遍,编过后再按各出包平台的 define 编运行时程序集
# (客户端自检唯一一道会编译的检查;第二遍见下文「出包平台 define」节)。
# 准入: Since=2026-09-20 | Basis=存量 | Origin=c370ae69e 改了热更签名漏改 Editor 调用点 | Retire=Editor 程序集编译并入 Unity 真编译自检时
#
# 不变量:**热更程序集的签名改动不得把 Editor 程序集编崩**。
#
# 为什么要单独一道:Unity 只要有任一程序集编译不过就不完成域反载 —— 编辑器里进不了游戏,
# 任何要跑起来的验收都做不了。而这条崩法有两个特点,使它能一路穿过既有的全部拦截:
#   ①它由**别处**的改动引发。改的是热更程序集里的一个签名,坏的是 Assets/Editor 下的调用点,
#     报错文件与本次改动毫无关系,作者不会想到去看。
#   ②别的验证够不到它:单编热更程序集(`dotnet build <热更程序集>.csproj`)编不到调用点
#     (GameLogic.csproj 不含 Assets/Editor);客户端自检其余各道按其头注是「纯文本扫描,
#     不启动 Unity」,不编译。
# 已实发一次:60cd4e0ed 退役 OfferSession.NextHand 的 highScore 形参,漏改 Assets/Editor/BlockBlast
# 下 4 个调用点,main 上编辑器域反载持续崩着,直到有人去开编辑器才发现(9eb0efec5 修)。
#
# ── 第二遍:出包平台 define(2026-09-30 用户裁定加入)───────────────────────────────
# 不变量二:**编辑器编得过的运行时代码,换成各出包平台的 define 也编得过**。
# Unity 生成的 csproj 只带编辑器那套 define,`#if UNITY_EDITOR ... #elif UNITY_WEBGL` 这类玩家侧分支在
# 编辑器与第一遍里都不参与编译,错了只在打包时暴露。实发:a5093aa42 把 RelogFromScratch 迁进 AppRestart,
# ConnectionFlow.QuitGame 的 WebGL 分支漏改,WebGL 出包 CS0103(2171b2077 修);本遍对该提交实测复现。
# 做法:第一遍编过后,对 PlatformDefinePolicy.json coveredPlatforms 的每个平台各编一遍运行时程序集。
#   - 宏:经 CustomBeforeMicrosoftCommonTargets 给每个 csproj 注入 swap.props,在原 DefineConstants 上剥掉
#     编辑器宏(UNITY_EDITOR*)、各平台引擎内置宏与 ProjectSettings 各平台组的全局宏,再加回目标平台的内置宏
#     (本脚本 PlayerPlatformSpec)与该平台组全局宏。asmdef versionDefines 等逐程序集的宏原样保留。
#   - 编译根:比对面内 Assets 下有 asmdef、非纯编辑器、非测试的程序集,按 include/excludePlatforms 逐平台取舍;
#     引用的程序集随之按同一套宏编。csproj 过期时编的是第一遍的 gate 副本(故本遍在副本删除前跑)。
#     工程内嵌包的程序集虽在比对面内,不作编译根:被编译根引用的照旧连带编(过期的同样编 gate 副本),
#     没被任何编译根引用的本遍不编——包内代码按出包平台 define 单独起编不在本遍原有覆盖内,接比对面时不顺带扩。
#   - 各平台一个 dotnet 进程并行编,产物与日志落 Temp\PlayerDefineBuild\<平台>\,与第一遍分开。
#   不覆盖:引用集仍是编辑器那套(UnityEditor.dll 在引用里,玩家侧代码误用编辑器 API 本遍编得过);IL 后处理;
#   全局宏与某 asmdef versionDefines 同名时该宏会被剥掉(本仓当前无此形态);没被编译根引用的内嵌包运行时程序集。
# 编译失败按平台点名、判 FAIL;错误行全是文件锁 / restore 类判 INFRA(同第一遍口径)。平台清单新增了
# PlayerPlatformSpec 没有的平台判 INFRA,补映射后重跑。
#
# ── 第三遍:工具宏(2026-10-09 用户裁定加入)──────────────────────────────────────
# 不变量三:**工程默认不定义、整段包在 `#if <宏>` 里的工具代码,开了该宏也编得过**。
# 这类代码在前两遍里都不参与编译(宏不在任何平台组的全局宏里),业务侧改了它引用的签名,它就静默烂掉,
# 直到有人开宏才发现。清单 = 本脚本 $ToolDefines(本作当前没有这类宏,清单为空、本遍不跑)。
# 实发(block-client):自动试玩宏 2026-08-26 起无人开,10-09 重新启用时靠会话手工带宏另编才确认它还编得过。
# 做法:第一遍编过后,对清单里每个宏把 Editor 程序集(连带引用闭包)再编一遍,宏在原 DefineConstants 上追加、
# 不剥任何东西;与第二遍各平台同批并行,产物与日志落 Temp\ToolDefineBuild\<宏>\。csproj 过期时编 gate 副本。
# 不覆盖:只证明编得过。工具跑起来对不对(自动试玩的落点几何等)只有开宏实跑能验。
# 新增一个默认不开的工具宏时把它加进 $ToolDefines;宏已进某平台组全局宏的不必加(前两遍已覆盖)。
#
# **本道使客户端自检不再是纯静态检查**:它要有 dotnet SDK、要跑真编译(第一遍冷约 10s、增量约 4s;
# 第二遍四平台并行,冷约 25s、增量约 4s;第三遍与第二遍同批并行)。
# 其余各道仍为纯文本扫描,该性质的正本表述在 客户端自检.ps1 头注与 README「检查」节,改本道须同步。
# 编译产物落 <ProjectDir>\Temp\ 与 obj\,两者均在 .gitignore 内 —— 实测跑前跑后
# Get-WorkTreeHash 不变,故不会把凭据判成 STALE。
#
# ── csproj 过期:本道最大的假失败来源,故编译**之前**先判 ───────────────────────
# csproj 的文件列表由 Unity 生成,而槽位领取会把工作树 reset 到新基线;基线期间别处的文件增删
# 一律不反映进去。两个方向各有各的症状,都指向与本次改动毫不相干的文件:
#   - csproj 多列了已删的文件 → CS2001。CSC 在读源文件阶段即中止,语法分析根本不跑,
#     本次改动的真错误一条都不会出现 —— 看起来编译失败,实则没编。
#   - csproj 缺了新增的文件 → CS0246 / CS0103 / CS0234。
# 把这两种判成 FAIL 会让人去改根本没问题的代码,故本道先比对再编译。
# 不一致时**不判 INFRA、也不照原样编**,而是就地按实扫重建一份 <Compile> 列表再编:
# 实扫口径已验证与 Unity 生成物逐项相等,重建后编的就是正确的文件集;而判 INFRA 会把免启槽位
# (槽位领取 -NoUnity,没有编辑器可重生成 csproj)的交付整个卡死 —— 那恰是最需要本道的场合之一
# (免启槽位的作者连打开编辑器都不会做,更不会发现 Editor 程序集崩了)。重建的临时 csproj 落工程根
# (路径相对它自己的目录解析,挪走即失效)、用完即删;同目录 *.csproj 是 Unity 生成物、在 .gitignore 内。
#
# **引用集 / 宏过期救不回,判 INFRA**:基线新增的 asmdef、asmdef 新加的引用、全局宏与 versionDefines 的
# 变化只有编辑器重生成 csproj 才进得来,重建 Compile 列表补不了;照编只会报一片与改动无关的错误(已实发:
# DOTween.Modules 建 asmdef 后,免启槽位交付报 46 条 CS1061),宏过期时还可能该失败的编过。判定正本 =
# 重建csproj.ps1 的 STALE-REGEN,编译前先调;判中出 INFRA 并点名过期项与重生成做法。
# STALE-REGEN 以本道编的 Assembly-CSharp-Editor 为起点,判定面与下述 Compile 列表比对面相同
# (内嵌包的程序集它只比对 <Compile>,引用集 / 宏不判,见其头注「不判」)。
# 同属此类、由本道自判(覆盖整个 Editor 引用闭包)的一种:闭包里某 csproj 收录的 .cs 全在 Assets 下、
# Assets 与内嵌包下却都无同名 asmdef(predefined 的 Assembly-CSharp* 除外)——asmdef 已删或改名,引用方的
# ProjectReference 与这份 csproj 都是残留,照编报 CS2001(已实发:658f7eb8d 删 HtmlToUGUI 整包后,
# 主工程与槽位 2、3 的 Editor csproj 仍引着 Xxhq.Htmltougui(.Editor).csproj)。
#
# ── 比对面 = 本道编的那个程序集 + 它 ProjectReference 闭包里 Assets 或工程内嵌包下有 asmdef 的全部程序集 ──
# 内嵌包 = <工程根>\Packages 下直接含 package.json 的目录(本仓 YooAsset / UniTask / MCPForUnity):源码在仓里、
# 随基线增删文件,与 Assets 下的同样会过期。
# 只判 Assembly-CSharp-Editor 自己那一份不够:**被引用方的 csproj 过期时,编译照样崩在与本次改动
# 无关的文件上**。已实发三次:
#   - 并发会话合入新 Luban 表并提交了 GameProto/GameConfig/quest.TbActivityGas.cs,主工作树
#     GameConfig.csproj 未刷新,本道报 `CS0234 不存在类型或命名空间名 TbActivityGas`,读起来像真缺陷,
#     实则假失败(2026-09-20,见 rules-archive/audit-log.md 该日段)。
#   - 当时比对面只列三个热更程序集,理由是其余引用「几乎不随业务改动 churn」。2026-09-27 槽位 2 交付在
#     基线同步里合入 073ba6ae5(删 Assets/Launcher/Procedure/ProcedurePreload.cs),槽位 Launcher.csproj
#     仍列着它,本道报 CS2001 判 FAIL,还打印「四个 csproj 均与磁盘一致」误导排查。Launcher 随业务增删文件,
#     那条理由不成立。
#   - 当时比对面只取 Assets 下有 asmdef 的,内嵌包在面外。2026-10-05 槽位 dev3 的基线 9774fe35c 新增
#     Packages/YooAsset/RuntimeExtension/ExtensionOperation/PrefetchBundleOperation.cs,
#     YooAsset.RuntimeExtension.csproj 缺列,build 报 CS0246——行尾归属却是**引用方** [TEngine.Runtime.csproj]
#     (比对面内)。该次发在实现期的 重建csproj.ps1(当时同样不判包,回 FRESH);换到本道,按下文的归属规则
#     会给出「排除 csproj 过期」并判 FAIL,结论是错的。过期的是被引用方、报错落在引用方,归属规则兜不住,
#     只能把被引用方收进比对面(2026-10-06)。
# 故比对面不再枚举,按 Editor csproj 的 ProjectReference 递归闭包取,闭包里在 Assets 与内嵌包两份底数里
# 合计恰有一个同名 asmdef 的一律比对(与 重建csproj.ps1 的判定面同口径,起点换成 predefined 的 Editor 程序集);
# 合计多于一个(含 Assets 与内嵌包各一个)判 INFRA,无从确定按哪份实扫。
# **只要有任一过期,就为工程根下每份 csproj 各写一份 gate csproj**(见下文重建处),比对面内的按实扫
# 重建 <Compile>,并把 ProjectReference 一律重定向到 .gate.csproj —— 少重定向一处,那一处就仍编着过期的那份。
#
# 「这个程序集该含哪些文件」按 Unity 的程序集划分规则实扫,不读 csproj。两类规则:
#   - predefined(Assembly-CSharp-Editor):Assets 下路径含 /Editor/ 目录、不落在任何 asmdef /
#     asmref 子树内、且不在顶层 Plugins / Standard Assets / Pro Standard Assets 下的 .cs。
#   - asmdef(闭包里其余比对面内的程序集):该 asmdef 所在目录子树下的全部 .cs,减去更深的
#     asmdef / asmref 子树(更深的那个接管其子树);子树内的 Editor 目录仍归该 asmdef。Assets 下与内嵌包下
#     同一条规则、各用各的底数(Get-UnityAsmScan / Get-UnityEmbeddedPackageScan),路径前缀分别是 Assets/ 与
#     Packages/,与 csproj <Compile> 同形。
# 两类都剔除 Unity 忽略路径(段以 . 开头或以 ~ 结尾,如 Samples~)。实扫口径的正本 =
# hooks\hook函数库.ps1「Unity 程序集实扫」节(Get-UnityAsmScan / Get-UnityEmbeddedPackageScan /
# Find-UnityAsmdefByName / Get-UnityAsmdefExpectSet / Get-UnityPredefinedEditorSet),与 重建csproj.ps1 同源,
# 本脚本不留副本。
# 本仓实测(2026-09-27,槽位 2):Editor 与闭包内 13 个 Assets asmdef 程序集(含子树内有 Editor 目录的
# spine-unity-editor)同 Unity 生成的 csproj 逐项相等、双向零差异。共享实扫不把别处 asmref 的子树
# 并回它所引的 asmdef,本仓 Assets 下当前无 asmref。
# 内嵌包实测(2026-10-06,主工程):闭包内 13 个内嵌包程序集(YooAsset 5 / UniTask 6 / MCPForUnity 2)同样
# 双向零差异,本道整道 PASS;闭包里留在比对面外的只剩 Fantasy.Unity / Fantasy.Editor。
#
# 比对面外(不比对、不重建;gate 副本逐行原样复制、只重定向引用),它们过期时本道看不到:
#   - 闭包里 Assets 与内嵌包下都没有同名 asmdef 的:落在 Packages 目录外的 file: 包(Fantasy.Unity /
#     Fantasy.Editor,csproj 按仓外绝对路径列源)、Packages 下没有 package.json 的目录,以及内嵌包里 asmdef
#     已删或改名留下的残留 csproj(上文的残留判定只认源全在 Assets 下的,包内残留不判 INFRA);
#   - firstpass:顶层 Plugins 等目录下的 Editor 目录归 Assembly-CSharp-Editor-**firstpass**(无 asmdef 的
#     另一个 predefined 程序集),共享实扫已把它剔出本道的 predefined 集。本仓当前无此形态。
# 故编译失败时「排除 csproj 过期」的结论只在报错全部落在比对面内的 csproj 上时给(按 dotnet 错误行尾
# 的 [xxx.csproj] 归属);落在比对面外或认不出归属的,改点名那些 csproj、提示先重生成再判。
#
# 出口码: 0 PASS(三遍均零错误;比对面内 csproj 过期的,按实扫重建后编过)
#         1 FAIL(任一遍编译有错误 —— 本道要拦的就是它)
#         2 INFRA(工程根 / 闭包内 csproj 缺失、dotnet 不可用、同名 asmdef 不唯一(Assets 与内嵌包合计)、csproj 形态不符无从重建、
#                 PlatformDefinePolicy.json / ProjectSettings.asset 缺失或平台无内置宏映射、
#                 csproj 引用集 / 宏过期或 asmdef 已删留下残留 csproj(须编辑器重生成),
#                 或构建失败而错误行全是文件锁 / restore 类(MSB3027/MSB3021/CS2012/NUxxxx):都不是代码问题)
# 关位置绑定:本道虽是检查,却有真写副作用(编译产物),按写入口口径办(R8)。
[CmdletBinding(PositionalBinding=$false)]
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # 槽位的 Demo
)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "hooks\hook函数库.ps1")

$ASM = "Assembly-CSharp-Editor"

# 出包平台 -> Unity 按构建目标自动定义的内置宏(不在 ProjectSettings 里,属引擎事实)、ProjectSettings
# scriptingDefineSymbols 的组名、asmdef include/excludePlatforms 里的平台名。键 = PlatformDefinePolicy.json
# coveredPlatforms 的写法;清单新增平台而此表未补时判 INFRA。Standalone 按 Windows 编(本仓出包机)。
$PlayerPlatformSpec = [ordered]@{
  Standalone = @{ Key = "Standalone"; Builtin = "UNITY_STANDALONE;UNITY_STANDALONE_WIN;PLATFORM_STANDALONE;PLATFORM_STANDALONE_WIN"; Asmdef = @("WindowsStandalone64", "WindowsStandalone32") }
  Android    = @{ Key = "Android";    Builtin = "UNITY_ANDROID;UNITY_ANDROID_API;PLATFORM_ANDROID"; Asmdef = @("Android") }
  iOS        = @{ Key = "iPhone";     Builtin = "UNITY_IOS;UNITY_IPHONE;UNITY_IPHONE_API;PLATFORM_IOS"; Asmdef = @("iOS") }
  WebGL      = @{ Key = "WebGL";      Builtin = "UNITY_WEBGL;UNITY_WEBGL_API;PLATFORM_WEBGL"; Asmdef = @("WebGL") }
}

# 第三遍要各编一遍的工具宏(见头注「第三遍」)。
$ToolDefines = @()

$root = $ProjectDir.TrimEnd('\')
$assets = Join-Path $root "Assets"
if (-not (Test-Path -LiteralPath $assets)) {
  Write-Host "EDITOR ASM BUILD : INFRA - Assets dir missing under '$root'"; exit 2
}
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
  Write-Host "EDITOR ASM BUILD : INFRA - dotnet SDK not on PATH; this gate compiles, it cannot fall back to a text scan"; exit 2
}

# 实扫一次,比对面内各程序集共用(正本 = hook函数库「Unity 程序集实扫」节):Assets 与工程内嵌包各一份底数。
$scan = Get-UnityAsmScan $assets
$pkgScan = Get-UnityEmbeddedPackageScan $root

# ── 比对面:沿 Editor csproj 的 ProjectReference 递归取闭包,Assets 或内嵌包下有 asmdef 的入 $specs ────
$editorCsproj = Join-Path $root ($ASM + ".csproj")
if (-not (Test-Path -LiteralPath $editorCsproj)) {
  Write-Host "EDITOR ASM BUILD : INFRA - $ASM.csproj missing at '$editorCsproj' (let the editor regenerate project files)"; exit 2
}
$specs = New-Object System.Collections.Generic.List[object]
$orphans = New-Object System.Collections.Generic.List[string]
$queue = New-Object System.Collections.Generic.Queue[string]
$seen = New-Object System.Collections.Generic.HashSet[string]
$queue.Enqueue($ASM); [void]$seen.Add($ASM)
while ($queue.Count -gt 0) {
  $name = $queue.Dequeue()
  $cp = Join-Path $root ($name + ".csproj")
  if (-not (Test-Path -LiteralPath $cp)) {
    Write-Host ("EDITOR ASM BUILD : INFRA - {0}.csproj missing at '{1}' (let the editor regenerate project files)" -f $name, $cp); exit 2
  }
  $text = [System.IO.File]::ReadAllText($cp)
  foreach ($m in [regex]::Matches($text, '<ProjectReference\s+Include="([^"]+)\.csproj"')) {
    $ref = [System.IO.Path]::GetFileName($m.Groups[1].Value)
    if ($seen.Add($ref)) { $queue.Enqueue($ref) }
  }
  $asmdefPath = $null
  if ($name -ceq $ASM) {
    $expect = Get-UnityPredefinedEditorSet $scan
  } else {
    $ad = Find-UnityAsmdefByName $scan $name
    $pkgAd = Find-UnityAsmdefByName $pkgScan $name
    $adCount = $ad.Count + $pkgAd.Count
    if ($adCount -eq 0) {
      # 收录的 .cs 全在 Assets 下、又不是 predefined 程序集 = asmdef 已删或改名,csproj 是残留;
      # 其余(仓外 file: 包、内嵌包里已无同名 asmdef 的源)属比对面外(见头注)。
      $srcs = @([regex]::Matches($text, '<Compile\s+Include="([^"]+)"') | ForEach-Object { $_.Groups[1].Value.Replace('\', '/') })
      $inAssets = @($srcs | Where-Object { $_.StartsWith("Assets/", [System.StringComparison]::OrdinalIgnoreCase) })
      if ($srcs.Count -gt 0 -and $inAssets.Count -eq $srcs.Count -and $name -cnotmatch '^Assembly-CSharp(-Editor)?(-firstpass)?$') { $orphans.Add($name) }
      continue
    }
    if ($adCount -gt 1) {
      Write-Host ("EDITOR ASM BUILD : INFRA - 按 name 定位 {0}.asmdef 得 {1} 个(Assets {2} / 内嵌包 {3}),期望 1 个" -f $name, $adCount, $ad.Count, $pkgAd.Count); exit 2
    }
    if ($ad.Count -eq 1) {
      $expect = Get-UnityAsmdefExpectSet $scan $ad[0].RelDir
      $asmdefPath = $ad[0].Path
    } else {
      # 内嵌包的程序集:只进 <Compile> 比对与重建;Asmdef 留空 = 不作出包平台那一遍的编译根(见头注该节)。
      $expect = Get-UnityAsmdefExpectSet $pkgScan $pkgAd[0].RelDir
    }
  }
  $specs.Add([pscustomobject]@{ Name = $name; Csproj = $cp; Text = $text; Expect = $expect; Asmdef = $asmdefPath })
}
if ($orphans.Count -gt 0) {
  Write-Host ("EDITOR ASM BUILD : INFRA - csproj 须编辑器重生成:" + (($orphans | ForEach-Object { $_ + ".csproj" }) -join " / ") + " 收录 Assets 下的 .cs,Assets 下却已无同名 asmdef(已删或改名),引用图随之过期,重建 Compile 列表补不了;在槽位编辑器重生成 csproj 后重跑(免启槽位先 槽位领取.ps1 -StartUnity -Slot <N>)")
  exit 2
}

# 引用集 / 宏过期先判(见头注),只认 exit 3;其余出口(Compile 列表过期 / INFRA)由本道下文自己处理。
$regenCheck = Invoke-FlowChild (Join-Path $PSScriptRoot "重建csproj.ps1") @("-ProjectRoot", $root, "-Assembly", $ASM)
if ($regenCheck.code -eq 3) {
  Write-Host "EDITOR ASM BUILD : INFRA - csproj 须编辑器重生成(引用集 / 宏过期),重建 Compile 列表也编不准;在槽位编辑器重生成 csproj 后重跑(免启槽位先 槽位领取.ps1 -StartUnity -Slot <N>)"
  foreach ($l in @($regenCheck.lines | Where-Object { $_ -match '^(STALE-REFS|STALE-DEFINES|VERDICT:)' })) { Write-Host ("    " + $l) }
  exit 2
}

# 路径大小写在 Windows 上不区分,比对同口径,免把纯大小写差异判成过期。
$cmp = [System.StringComparer]::OrdinalIgnoreCase
$anyStale = $false
foreach ($s in $specs) {
  $listed = @([regex]::Matches($s.Text, '<Compile\s+Include="([^"]+)"') |
              ForEach-Object { $_.Groups[1].Value.Replace('\', '/') })
  $expectSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$s.Expect, $cmp)
  $listedSet = [System.Collections.Generic.HashSet[string]]::new([string[]]$listed, $cmp)
  $onlyDisk = @([string[]]$s.Expect | Where-Object { -not $listedSet.Contains($_) })
  $onlyProj = @([string[]]$listed | Where-Object { -not $expectSet.Contains($_) })
  Add-Member -InputObject $s -NotePropertyName Listed   -NotePropertyValue $listed
  Add-Member -InputObject $s -NotePropertyName OnlyDisk -NotePropertyValue $onlyDisk
  Add-Member -InputObject $s -NotePropertyName OnlyProj -NotePropertyValue $onlyProj
  Add-Member -InputObject $s -NotePropertyName Stale    -NotePropertyValue ($onlyDisk.Count -gt 0 -or $onlyProj.Count -gt 0)
  if ($s.Stale) {
    $anyStale = $true
    Write-Host ("EDITOR ASM BUILD : {0}.csproj 过期(磁盘 {1} 项 / csproj 列 {2} 项),按实扫重建 Compile 列表后再编" -f $s.Name, $s.Expect.Count, $listed.Count)
    foreach ($p in @($onlyProj | Select-Object -First 5)) { Write-Host ("    csproj 多列(文件已不在磁盘上): " + $p) }
    foreach ($p in @($onlyDisk | Select-Object -First 5)) { Write-Host ("    csproj 缺列(磁盘上有而未收录): " + $p) }
  }
}

# ── 有任一过期:工程根下每份 csproj 各写一份 gate csproj,并把彼此的 ProjectReference 一律重定向 ────
$buildTarget = $editorCsproj
$rebuilt = New-Object System.Collections.Generic.List[string]
if ($anyStale) {
  # 临时 csproj 必须落在工程根:csproj 里的路径是相对它自己的目录解析的,挪走即全部失效。
  # 同目录的 *.csproj 是 Unity 生成物、在 .gitignore 内,故不进工作树哈希、不影响凭据。
  #
  # **工程根下每一份 csproj 都写一份 gate 副本**,而不只写比对面内那些:引用图上还有闭包外的
  # csproj 互引(本仓 GameLogic.Tests.Editor 引着 GameLogic / GameConfig)。
  # 少重定向任何一份,MSBuild 就会沿那一份把**原来那个过期的 csproj** 拉进同一次构建,
  # 重建过的那几份白做(已实测:只重定向当时比对的四个时,错误仍报在 GameConfig.csproj 上)。
  # 全量重定向不需要再按引用图筛,也不改动任何原文件 —— 除比对面内的程序集重建 <Compile> 列表外,
  # 其余各份逐行原样复制,只改 ProjectReference 的指向。
  $allCsproj = @(Get-ChildItem -LiteralPath $root -Filter *.csproj -File |
                 Where-Object { $_.Name -notlike "*.gate.csproj" })
  $specByName = @{}
  foreach ($s in $specs) { $specByName[$s.Name] = $s }
  $gateKeepDir = Join-Path $root "Temp\GateCsproj"
  [void][System.IO.Directory]::CreateDirectory($gateKeepDir)

  foreach ($f in $allCsproj) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
    $spec = $specByName[$baseName]
    $lines = [System.IO.File]::ReadAllLines($f.FullName)
    $out2 = New-Object System.Collections.Generic.List[string]
    $emitted = $false
    foreach ($line in $lines) {
      if ($spec -and [regex]::IsMatch($line, '<Compile\s+Include="')) {
        if (-not $emitted) {
          foreach ($r in $spec.Expect) { $out2.Add('    <Compile Include="' + $r.Replace('/', '\') + '" />') }
          $emitted = $true
        }
        continue
      }
      $redirected = $line
      foreach ($g in $allCsproj) {
        $n = [System.IO.Path]::GetFileNameWithoutExtension($g.Name)
        $redirected = $redirected.Replace('Include="' + $n + '.csproj"', 'Include="' + $n + '.gate.csproj"')
      }
      $out2.Add($redirected)
    }
    if ($spec -and -not $emitted) {
      Write-Host ("EDITOR ASM BUILD : INFRA - {0}.csproj 无 <Compile> 条目,形态不符,无从重建" -f $baseName)
      foreach ($p in $rebuilt) { if (Test-Path -LiteralPath $p) { [System.IO.File]::Delete($p) } }
      exit 2
    }
    $path = Join-Path $root ($baseName + ".gate.csproj")
    [System.IO.File]::WriteAllLines($path, $out2, (New-Object System.Text.UTF8Encoding($true)))
    $rebuilt.Add($path)
    # 内容与上次相同就沿用上次的时间戳:工程文件计入 MSBuildAllProjects,副本每次现写现删、时间戳恒新,
    # 不沿用则三遍里的全部程序集次次整编(实测 dev2 树无改动:36~47s -> 14s)。上次的内容留底在 Temp\GateCsproj\;
    # 内容变了(Compile 列表或引用有变)即换底、取新时间戳,照常重编。留底读写失败只退回整编,不影响判定。
    try {
      $keep = Join-Path $gateKeepDir ($baseName + ".gate.csproj")
      if (-not (Test-Path -LiteralPath $keep) -or [System.IO.File]::ReadAllText($keep) -cne [System.IO.File]::ReadAllText($path)) {
        [System.IO.File]::Copy($path, $keep, $true)
      }
      [System.IO.File]::SetLastWriteTimeUtc($path, [System.IO.File]::GetLastWriteTimeUtc($keep))
    } catch {}
  }
  $buildTarget = Join-Path $root ($ASM + ".gate.csproj")
}

# ── 出包平台 define 编译的备料(编译前备齐,缺料即 INFRA,不白编一遍)────────────────
# 平台清单取 PlatformDefinePolicy.json 的 coveredPlatforms(与 平台宏核对 同一清单,不另列)。
function Exit-PdInfra([string]$Msg) {
  foreach ($p in $rebuilt) { if (Test-Path -LiteralPath $p) { [System.IO.File]::Delete($p) } }
  Write-Host ("EDITOR ASM BUILD : INFRA - " + $Msg); exit 2
}
$policyPath = Join-Path $root "ProjectSettings\PlatformDefinePolicy.json"
$settingsPath = Join-Path $root "ProjectSettings\ProjectSettings.asset"
foreach ($p in @($policyPath, $settingsPath)) {
  if (-not (Test-Path -LiteralPath $p)) { Exit-PdInfra ("出包平台 define 编译缺料:'" + $p + "' 不存在") }
}
try { $pdPlatforms = @(([System.IO.File]::ReadAllText($policyPath) | ConvertFrom-Json).coveredPlatforms | Where-Object { $_ }) }
catch { Exit-PdInfra ("PlatformDefinePolicy.json 解析失败:" + $_.Exception.Message) }
if ($pdPlatforms.Count -eq 0) { Exit-PdInfra "PlatformDefinePolicy.json 未声明 coveredPlatforms" }
$pdUnknown = @($pdPlatforms | Where-Object { -not $PlayerPlatformSpec.Contains([string]$_) })
if ($pdUnknown.Count -gt 0) {
  Exit-PdInfra ("coveredPlatforms 含本道没有内置宏映射的平台:" + ($pdUnknown -join " / ") + "(在本脚本 PlayerPlatformSpec 补该平台的引擎内置宏与 asmdef 平台名)")
}
$globals = Read-UnityGlobalDefines $root
# 要剥掉的宏:编辑器宏、各平台的引擎内置宏、各平台组的全局宏(目标平台的那组随后加回)。
$globalUnion = @($globals.Values | ForEach-Object { $_ } | Where-Object { $_ } | Sort-Object -Unique)
$pdStripRe = 'UNITY_EDITOR\w*|UNITY_(?:STANDALONE|ANDROID|IOS|IPHONE|WEBGL|TVOS|VISIONOS|WSA)\w*|PLATFORM_\w+'
if ($globalUnion.Count -gt 0) { $pdStripRe += '|' + (($globalUnion | ForEach-Object { [regex]::Escape($_) }) -join '|') }

# 编译根:比对面内、Assets 下有 asmdef 的运行时程序集,按 asmdef 的平台约束逐平台取舍。
# Asmdef 为空的两种不取:predefined 的 Editor 程序集、内嵌包的程序集(被编译根引用的随引用连带编)。
# 纯编辑器(includePlatforms 只有 Editor)与测试程序集(defineConstraints 含 UNITY_INCLUDE_TESTS)不进包,不编。
$pdRoots = @{}
foreach ($pf in $pdPlatforms) { $pdRoots[[string]$pf] = New-Object System.Collections.Generic.List[string] }
foreach ($s in $specs) {
  if (-not $s.Asmdef) { continue }
  try { $aj = [System.IO.File]::ReadAllText($s.Asmdef) | ConvertFrom-Json }
  catch { Exit-PdInfra ("asmdef 解析失败:" + $s.Asmdef) }
  $inc = @($aj.includePlatforms | Where-Object { $_ })
  $exc = @($aj.excludePlatforms | Where-Object { $_ })
  if ($inc.Count -eq 1 -and [string]$inc[0] -ceq "Editor") { continue }
  if (@($aj.defineConstraints) -contains "UNITY_INCLUDE_TESTS") { continue }
  foreach ($pf in $pdPlatforms) {
    $names = $PlayerPlatformSpec[[string]$pf].Asmdef
    if ($inc.Count -gt 0 -and -not @($inc | Where-Object { $names -contains $_ })) { continue }
    if (@($exc | Where-Object { $names -contains $_ }).Count -gt 0) { continue }
    $pdRoots[[string]$pf].Add($s.Name)
  }
}

# 每平台一份:swap.props(经 CustomBeforeMicrosoftCommonTargets 注入每个 csproj,在其 DefineConstants
# 已定、派生路径未算之前改写宏与输出路径)+ build.proj(并行编该平台全部编译根)+ build.log。
# 全落 <ProjectDir>\Temp\PlayerDefineBuild\<平台>\(.gitignore 内),产物与编辑器那一遍分目录:
# 共用输出目录会让编辑器那遍的增量编译拿玩家宏的 dll 当引用。
$pdDir = Join-Path $root "Temp\PlayerDefineBuild"
$pdJobs = New-Object System.Collections.Generic.List[object]
foreach ($pf in $pdPlatforms) {
  $pfs = [string]$pf
  if ($pdRoots[$pfs].Count -eq 0) { continue }
  $spec = $PlayerPlatformSpec[$pfs]
  $dir = Join-Path $pdDir $pfs
  [void][System.IO.Directory]::CreateDirectory($dir)
  $add = @($spec.Builtin -split ';') + @($globals[$spec.Key] | Where-Object { $_ })
  $esc = { param($v) [System.Security.SecurityElement]::Escape($v) }
  $props = "<Project>`r`n  <PropertyGroup>`r`n" +
    "    <DefineConstants>" + (& $esc ("`$([System.Text.RegularExpressions.Regex]::Replace(';`$(DefineConstants);', ';(?:" + $pdStripRe + ")(?=;)', '').Trim(';'));" + ($add -join ';'))) + "</DefineConstants>`r`n" +
    "    <OutputPath>" + (& $esc ($dir + "\bin\`$(MSBuildProjectName)\")) + "</OutputPath>`r`n" +
    "    <IntermediateOutputPath>" + (& $esc ($dir + "\obj\`$(MSBuildProjectName)\")) + "</IntermediateOutputPath>`r`n" +
    "  </PropertyGroup>`r`n</Project>`r`n"
  $propsPath = Join-Path $dir "swap.props"
  # 内容不变不重写:它被导入进每个 csproj、计入 MSBuildAllProjects,时间戳一动全部程序集整编(实测 5s -> 20s)。
  if (-not (Test-Path -LiteralPath $propsPath) -or [System.IO.File]::ReadAllText($propsPath) -cne $props) {
    [System.IO.File]::WriteAllText($propsPath, $props, (New-Object System.Text.UTF8Encoding($false)))
  }
  $sfx = if ($anyStale) { ".gate.csproj" } else { ".csproj" }
  $items = @($pdRoots[$pfs] | ForEach-Object { '    <PdRoot Include="' + (& $esc (Join-Path $root ($_ + $sfx))) + '" />' })
  $proj = "<Project DefaultTargets=`"Build`">`r`n  <ItemGroup>`r`n" + ($items -join "`r`n") + "`r`n  </ItemGroup>`r`n" +
    "  <Target Name=`"Build`">`r`n    <MSBuild Projects=`"@(PdRoot)`" Targets=`"Build`" BuildInParallel=`"true`" />`r`n  </Target>`r`n</Project>`r`n"
  $projPath = Join-Path $dir "build.proj"
  [System.IO.File]::WriteAllText($projPath, $proj, (New-Object System.Text.UTF8Encoding($false)))
  $pdJobs.Add([pscustomobject]@{ Platform = $pfs; Proj = $projPath; Props = $propsPath; Log = (Join-Path $dir "build.log"); Roots = $pdRoots[$pfs].ToArray() })
}

# ── 工具宏那一遍的备料:每个宏一份 swap.props(原 DefineConstants 上追加该宏,产物改落自己的目录),
# 编译目标就是第一遍那个 Editor 程序集。作业形态与出包平台的相同,共用下面的并行执行。
$tdDir = Join-Path $root "Temp\ToolDefineBuild"
$tdJobs = New-Object System.Collections.Generic.List[object]
foreach ($td in $ToolDefines) {
  $dir = Join-Path $tdDir $td
  [void][System.IO.Directory]::CreateDirectory($dir)
  $dirEsc = [System.Security.SecurityElement]::Escape($dir)
  $props = "<Project>`r`n  <PropertyGroup>`r`n" +
    "    <DefineConstants>`$(DefineConstants);" + $td + "</DefineConstants>`r`n" +
    "    <OutputPath>" + $dirEsc + "\bin\`$(MSBuildProjectName)\</OutputPath>`r`n" +
    "    <IntermediateOutputPath>" + $dirEsc + "\obj\`$(MSBuildProjectName)\</IntermediateOutputPath>`r`n" +
    "  </PropertyGroup>`r`n</Project>`r`n"
  $propsPath = Join-Path $dir "swap.props"
  # 内容不变不重写,理由同出包平台那份。
  if (-not (Test-Path -LiteralPath $propsPath) -or [System.IO.File]::ReadAllText($propsPath) -cne $props) {
    [System.IO.File]::WriteAllText($propsPath, $props, (New-Object System.Text.UTF8Encoding($false)))
  }
  $tdJobs.Add([pscustomobject]@{ Platform = $td; Proj = $buildTarget; Props = $propsPath; Log = (Join-Path $dir "build.log"); Roots = @($ASM) })
}

# 各平台各起一个 dotnet 进程并行编(产物分目录互不相干),日志各落一份,错误按平台归属。
# chcp 65001:子进程拿到的是新控制台(默认 OEM 代码页),不钉 UTF-8 则中文报错写进日志即成乱码。
function Invoke-PlayerDefineBuilds($Jobs) {
  $procs = @()
  foreach ($j in $Jobs) {
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $env:ComSpec
    $psi.Arguments = '/d /s /c "chcp 65001 >nul & dotnet build "' + $j.Proj + '" -m -v q --nologo "-p:CustomBeforeMicrosoftCommonTargets=' + $j.Props + '" > "' + $j.Log + '" 2>&1"'
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $procs += [pscustomobject]@{ Job = $j; Proc = [System.Diagnostics.Process]::Start($psi) }
  }
  foreach ($p in $procs) {
    $p.Proc.WaitForExit()
    $lines = if (Test-Path -LiteralPath $p.Job.Log) { @([System.IO.File]::ReadAllLines($p.Job.Log, [System.Text.Encoding]::UTF8)) } else { @() }
    Add-Member -InputObject $p.Job -NotePropertyName Code -NotePropertyValue $p.Proc.ExitCode -Force
    Add-Member -InputObject $p.Job -NotePropertyName Lines -NotePropertyValue $lines -Force
  }
}

# ── 真编译 ───────────────────────────────────────────────────────────────
# cmd /c 捕获原生命令 stderr:PS 5.1 的 2>&1 会把 stderr 包成 ErrorRecord,在
# ErrorActionPreference=Stop 下抛出(口径同 hook函数库 Get-WorkTreeHash)。
# 出包平台与工具宏两遍只在编辑器那遍编过后跑(编辑器都编不过时它们只会重复报同一批错),且须在 gate 副本删除之前。
try {
  $out = cmd /c ("dotnet build `"" + $buildTarget + "`" -v q --nologo 2>&1")
  $code = $LASTEXITCODE
  # 逐个 Add 而不是 @($a) + @($b):5.1 下对 List[object] 做数组相加抛「Argument types do not match」。
  $laterJobs = New-Object System.Collections.Generic.List[object]
  foreach ($j in $pdJobs) { $laterJobs.Add($j) }
  foreach ($j in $tdJobs) { $laterJobs.Add($j) }
  if ($code -eq 0 -and $laterJobs.Count -gt 0) { Invoke-PlayerDefineBuilds $laterJobs }
}
finally {
  # 临时 csproj 用完即删(.NET API,不用 Remove-Item:shell-conventions「内联命令」)。
  foreach ($p in $rebuilt) { if (Test-Path -LiteralPath $p) { [System.IO.File]::Delete($p) } }
}

$editorSpec = $specs[0]
# 构建非零不一定是代码错:文件锁(MSB3027 复制重试耗尽 / MSB3021 拒绝访问 / CS2012 输出被占)与
# restore 失败(NUxxxx)都是环境问题,判 FAIL 会让人去改没问题的代码。口径同 服务端自检 对
# MSB3026/27 的排除(那边排的是警告,这里重试耗尽已升为 error,故按 INFRA 出)。
# 只有**全部**错误行都属此类才判 INFRA;夹着任何一条真编译错误即照判 FAIL,不让锁掩盖真错。
# 非零却一条错误行都认不出时,维持 FAIL(不猜成环境问题)。出包平台那一遍同口径。
$infraErrRe = ':\s*error\s+(MSB3027|MSB3021|CS2012|NU\d{4})\b'
if ($code -ne 0) {
  $errLines = @(@($out) | Where-Object { [string]$_ -match ':\s*error\s' })
  $infraErr = @($errLines | Where-Object { [string]$_ -match $infraErrRe })
  if ($errLines.Count -gt 0 -and $infraErr.Count -eq $errLines.Count) {
    Write-Host ("EDITOR ASM BUILD : INFRA - build exit {0} with only file-lock / restore errors (not a code problem); close the locking process or fix the feed and re-run" -f $code)
    foreach ($line in @($infraErr | Select-Object -Unique)) { Write-Host ("    " + $line) }
    exit 2
  }
}
if ($code -ne 0) {
  Write-Host ("EDITOR ASM BUILD : compile errors in {0} ({1} .cs) - Unity 不会完成域反载,编辑器里进不了游戏" -f $ASM, $editorSpec.Expect.Count)
  # 「排除 csproj 过期」只对比对面内的 csproj 成立(已与磁盘一致,或已按实扫重建)。按错误行尾的
  # [xxx.csproj] 归属,没有行尾标注而出处本身是 csproj 的(`xxx.csproj : error ...`)按出处归属;
  # gate 副本去掉 .gate 回原名。全部落在比对面内才给这个结论,否则点名面外的。
  $specNames = New-Object System.Collections.Generic.HashSet[string]([System.StringComparer]::OrdinalIgnoreCase)
  foreach ($s in $specs) { [void]$specNames.Add($s.Name) }
  $outside = New-Object System.Collections.Generic.List[string]
  $unowned = 0
  foreach ($l in $errLines) {
    $om = [regex]::Match([string]$l, '\[([^\[\]]+?)\.csproj(?:::[^\]]*)?\]\s*$')
    if (-not $om.Success) { $om = [regex]::Match([string]$l, '^\s*(.+?)\.csproj\s*:\s*error\s') }
    if (-not $om.Success) { $unowned++; continue }
    $owner = [System.IO.Path]::GetFileName($om.Groups[1].Value) -replace '\.gate$', ''
    if (-not $specNames.Contains($owner) -and -not $outside.Contains($owner)) { $outside.Add($owner) }
  }
  if ($errLines.Count -gt 0 -and $outside.Count -eq 0 -and $unowned -eq 0) {
    Write-Host ("    (报错所在 csproj 均在比对面内({0} 个,已与磁盘一致或已按实扫重建),排除 csproj 过期这一假失败来源)" -f $specs.Count)
  } else {
    $where = @()
    if ($outside.Count -gt 0) { $where += ("报错落在比对面外的 " + (($outside | ForEach-Object { $_ + ".csproj" }) -join " / ") + " 上(Assets 与内嵌包下都无同名 asmdef,本道不比对)") }
    if ($unowned -gt 0) { $where += ("{0} 行报错认不出所属 csproj" -f $unowned) }
    if ($errLines.Count -eq 0) { $where += "认不出任何错误行" }
    Write-Host ("    (不排除 csproj 过期:" + ($where -join ";") + "。报错指向与本次改动无关的文件、尤其 CS2001 时,先在槽位编辑器重生成 csproj 再重跑)")
  }
  # 全量回显,不摘录:漏掉哪一条都可能正是根因那条。
  foreach ($line in @($out)) { Write-Host ("    " + $line) }
  exit 1
}

$note = ""
if ($anyStale) {
  $staleNames = @($specs | Where-Object { $_.Stale } | ForEach-Object { $_.Name })
  $note = "(csproj 过期: " + ($staleNames -join " / ") + ",已按实扫重建列表编)"
}

# ── 出包平台那一遍的判定:错误按平台归属,分类口径同上 ─────────────────────────
$pdFailed = @($pdJobs | Where-Object { $_.Code -ne 0 })
if ($pdFailed.Count -gt 0) {
  $pdErr = @($pdFailed | ForEach-Object { $pf = $_.Platform; @($_.Lines | Where-Object { $_ -match ':\s*error\s' } | Select-Object -Unique | ForEach-Object { "[" + $pf + "] " + $_ }) })
  $pdInfra = @($pdErr | Where-Object { $_ -match $infraErrRe })
  if ($pdErr.Count -gt 0 -and $pdInfra.Count -eq $pdErr.Count) {
    Write-Host ("EDITOR ASM BUILD : INFRA - 出包平台 define 那一遍({0})只有文件锁 / restore 类错误(不是代码问题);关掉占用进程或修好源后重跑" -f (($pdFailed | ForEach-Object { $_.Platform }) -join " / "))
    foreach ($line in $pdInfra) { Write-Host ("    " + $line) }
    exit 2
  }
  Write-Host ("EDITOR ASM BUILD : 出包平台 define 下编译失败:{0} - 编辑器里编得过,打这些平台的包编不过(编辑器 define 下不参与编译的 #if / #elif 分支){1}" -f (($pdFailed | ForEach-Object { $_.Platform }) -join " / "), $note)
  Write-Host "    (csproj 过期已由编辑器那一遍排除或重建,此处报错即代码问题)"
  foreach ($j in $pdFailed) {
    $el = @($j.Lines | Where-Object { $_ -match ':\s*error\s' } | Select-Object -Unique)
    if ($el.Count -eq 0) { $el = @($j.Lines) }   # 认不出错误行时全量回显,不猜
    foreach ($line in $el) { Write-Host ("    [" + $j.Platform + "] " + $line) }
    Write-Host ("    [" + $j.Platform + "] 完整日志:" + $j.Log)
  }
  exit 1
}

# ── 工具宏那一遍的判定:错误按宏归属,分类口径同上 ───────────────────────────────
$tdFailed = @($tdJobs | Where-Object { $_.Code -ne 0 })
if ($tdFailed.Count -gt 0) {
  $tdErr = @($tdFailed | ForEach-Object { $td = $_.Platform; @($_.Lines | Where-Object { $_ -match ':\s*error\s' } | Select-Object -Unique | ForEach-Object { "[" + $td + "] " + $_ }) })
  $tdInfra = @($tdErr | Where-Object { $_ -match $infraErrRe })
  if ($tdErr.Count -gt 0 -and $tdInfra.Count -eq $tdErr.Count) {
    Write-Host ("EDITOR ASM BUILD : INFRA - 工具宏那一遍({0})只有文件锁 / restore 类错误(不是代码问题);关掉占用进程或修好源后重跑" -f (($tdFailed | ForEach-Object { $_.Platform }) -join " / "))
    foreach ($line in $tdInfra) { Write-Host ("    " + $line) }
    exit 2
  }
  Write-Host ("EDITOR ASM BUILD : 工具宏下编译失败:{0} - 默认 define 下编得过,开了该宏编不过(#if 该宏包住的代码没跟上它引用的签名){1}" -f (($tdFailed | ForEach-Object { $_.Platform }) -join " / "), $note)
  Write-Host "    (csproj 过期已由编辑器那一遍排除或重建,此处报错即代码问题)"
  foreach ($j in $tdFailed) {
    $el = @($j.Lines | Where-Object { $_ -match ':\s*error\s' } | Select-Object -Unique)
    if ($el.Count -eq 0) { $el = @($j.Lines) }   # 认不出错误行时全量回显,不猜
    foreach ($line in $el) { Write-Host ("    [" + $j.Platform + "] " + $line) }
    Write-Host ("    [" + $j.Platform + "] 完整日志:" + $j.Log)
  }
  exit 1
}
$pdSummary = if ($pdJobs.Count -gt 0) { ";出包平台 define " + (($pdJobs | ForEach-Object { $_.Platform + "(" + $_.Roots.Count + ")" }) -join " / ") + " 0 errors" } else { "" }
$tdSummary = if ($tdJobs.Count -gt 0) { ";工具宏 " + (($tdJobs | ForEach-Object { $_.Platform }) -join " / ") + " 0 errors" } else { "" }
Write-Host ("OK  Editor程序集编译: {0} .cs in {1}, 0 errors{2}{3}{4}" -f $editorSpec.Expect.Count, $ASM, $pdSummary, $tdSummary, $note)
exit 0
