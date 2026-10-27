# 客户端自检.ps1 - devflow 客户端交付检查:十四道(十二道静态扫描 + 规则核心单测 + Editor 程序集真编译)(命名空间规约 +
# 程序集归属 / 平台宏策略 / UGUI 文本截断 / UI 绑定完整性 / UI 安全区节点结构 / 图集子图须挂绑图集的 ExImage /
# 仓内 bat 纯 ASCII / 热更程序集清单 / 入仓文件的机器绝对路径 / 工具 csproj 链接目标存在 / 编辑器工具起子进程走共用原语 /
# 启动器源码用字被子集字体覆盖 / 规则核心的 dotnet 单测 / Editor 程序集与各出包平台 define 下的运行时程序集能否编过),
# 直跑槽位工作树的 Demo。
# 不启动 Unity、不需要活编辑器、不经 UnityMCP,因而无 BLOCKED 出口:任何布局正确的槽位上都能立即出结论。
# **前十二道是静态扫描,后两道真跑 dotnet**:dotnet单测 编规则核心的镜像库并跑 DotNet\Tests;Editor程序集编译 真编
# Editor 程序集(编辑器一遍 + 出包平台与工具宏并行一遍)。故本检查需要 dotnet SDK。
# **耗时的道并行跑**(扫描数组里带 Async 的:单测道、编译道,与各要两秒以上的几道静态扫描,多为逐 prefab 解析):开跑即各起一个
# 子进程,其余各道在本进程照数组顺序跑;轮到并行道时等它退出、把它的输出原样回放在该位置。输出次序与结论优先级
# 因此仍同数组顺序(几道都不过时,结论点名数组里最靠前的那道)。
# 代价:某道不过时并行道已经在跑,要等它们跑完才退出——不中途杀:编译道在工程根落临时 csproj、在 obj\ 写增量产物,
# 杀在半途会留下残件与半写的 dll,下一次编译拿它们当现成产物用。换来的是各道的问题一次都报出来。
# 给一道加 Async 的判据:单道稳定在两秒以上(起子进程本身约一秒),且不依赖本进程里别的道留下的状态。
# 编译产物落 Temp\ 与 obj\(均在 .gitignore 内),实测不动工作树哈希,不会把凭据判成 STALE。
#
# 检查内容以十四道各自的规约表为准(命名空间扫描.ps1 / 平台宏核对.ps1 / 文本截断核对.ps1 / UI绑定核对.ps1 /
# 安全区结构核对.ps1 / 图集子图组件核对.ps1 / bat编码核对.ps1 / 热更程序集核对.ps1 / 机器路径核对.ps1 /
# 工程链接核对.ps1 / 进程编码核对.ps1 / 启动器字体核对.ps1 / dotnet单测.ps1 / Editor程序集编译.ps1),十四道均为必跑。
# 与 block-client 的同名脚本相比少了 Luban 四道(配置预载 / 配置表前缀 / 表间引用 / 导表指纹)与 shader 取用、
# 功能开关、登记表、引导锚点、投放可达性、跨端配置六道:前者等本作接入 Luban 时随表一起搬回,后者核的是本作没有的
# 底座件与服务端。
# bat编码核对 / 机器路径核对 / 工程链接核对 三道按入仓候选(已跟踪 + 未跟踪未忽略)枚举,范围限 Demo/ 下:
# 仓里其余层(研究资料、复刻件)不归本工程的 devflow,槽位稀疏检出后也没有它们。机器路径核对的面是 Demo 下的
# .sh / .bat / .cmd / .ps1 与 Assets/Editor 下的工具 .cs;工程链接核对核 Demo 下入仓 .csproj 的链接目标仍在。
# 编译覆盖的边界:本检查编 Assembly-CSharp-Editor,而它经 ProjectReference 连热更程序集 GameLogic 一起编 ——
# 故热更侧的编译错误本检查**拦得到**,不止拦「改了热更签名、漏改 Assets/Editor 下调用点」那一类。
# define 边界:Unity 生成的 csproj 带的是 UNITY_EDITOR 一套,玩家侧 define 后面的分支(`#if UNITY_ANDROID`、
# `#elif UNITY_WEBGL` 等)在它下面不参与编译;Editor程序集编译 在编辑器那遍编过后,再按 PlatformDefinePolicy.json
# coveredPlatforms 各平台的 define 把运行时程序集各编一遍,这类分支由此拦得到(做法与不覆盖面见该道头注)。
# 工程默认不定义的工具宏包住的代码同样两遍都不编,该道另按其 $ToolDefines 清单逐宏再编一遍 Editor 程序集。
# 仍不在覆盖内:玩家侧误用编辑器 API(引用集仍是编辑器那套)、IL 后处理(HybridCLR 注入),
# 由实现期与出包实测承接(手段见 devflow-client 卡「自检」节)。
# 测试只覆盖规则核心(dotnet单测 跑 DotNet\Tests);其余代码的测试不在覆盖内,正确性缺陷由每日审查(daily-code-review)承接。
#
# 各道读取面按道登记在 hooks\校验库.ps1 ClientGateScanSurface,拼出客户端验证面:槽位交付 跑不跑本检查、
# 集成交付 push 点验不验票、凭据容忍哪些漂移,都按它判。加道须同批登记;启动时互核扫描数组与登记,
# 缺一即 INFRA(不然新道读的路径改了,交付照样不跑本检查)。
#
# PASS 且工作树首尾哈希一致 → 签发 <slotRoot>\.gate\ticket.json,供 提交检查 hook 与
# 单仓提交 / 集成交付 在 push 点验凭据(签发正本 = hooks\hook函数库.ps1 Publish-GateTicket)。
# 首尾哈希不一致 = STALE,不发票。
#
# 槽位 = 客户端仓的 git worktree(<SlotBaseDir>\<SlotDirPrefix>N,如 ...\block-rougelike-dev1),
# 内含 Demo、配对的 Fantasy worktree 与回主检出的 Tools\Luban junction。布局正本 =
# devflow 卡 references/slot-protocol.md。
#
# 出口码: 0 PASS(十四道均无违规,已签发凭据)
#         1 FAIL(扫描判违规)
#         2 INFRA(ProjectDir 不是 Unity 工程 / 扫描数组与读取面登记不符 / 扫描脚本缺失或自身跑不起来:
#                 子道抛未捕获异常、或返回 0/1/2 以外的退出码,都归此档:后续在本进程跑的道不再跑,已起的并行道等它们跑完再退出)
#         3 STALE(各道均过,但工作树在检查期间变了:PASS 作废、无凭据;代码没有要改的,重跑即可。
#                 VERDICT 行之前的 DRIFT 行点名首尾两棵树之间变了哪些路径,至多 10 条)
# STALE 与 FAIL 分码同 服务端自检(曾同为 1,调用方分不出「有违规」与「树被并发改动」):
# 槽位交付 只分零 / 非零,STALE 照旧落 GATE-FAIL(next=judge,会话重跑);工作流通路检查 按码分报。
# 除「不是 Unity 工程」那一处(遥测库尚未加载)外,各出口都以本脚本自己的 VERDICT 行收尾并写遥测:
# 槽位交付取输出里最后一行 VERDICT 当结论,子道自己打的 VERDICT 行不能成为末行。
#
# 测试注入点:环境变量 DEVFLOW_TEST_GATE_SCAN_DIR 非空时,各道脚本改从该目录取(文件名与道次不变,
# 读取面互核照常),供 tests\客户端自检测试.ps1 放假子道;未设 = 零动作。设了会打一行 NOTE 提示。
param(
  [Parameter(Mandatory=$true)][string]$ProjectDir  # 槽位的 Demo,如 ...\block-rougelike-dev1\Demo
)
$ErrorActionPreference = "Stop"

if (-not (Test-Path (Join-Path $ProjectDir "ProjectSettings\ProjectVersion.txt"))) {
  Write-Host "VERDICT : INFRA - '$ProjectDir' is not a Unity project (ProjectVersion.txt missing)"; exit 2
}
$slotName = Split-Path (Split-Path $ProjectDir -Parent) -Leaf

# 凭据接线:跑前取树哈希,PASS 后由 Publish-GateTicket 复取比对,一致才签发(双哈希)。
# 点源 校验库(它再点源 hook函数库):凭据与遥测函数在后者,读取面登记与互核在前者。
. (Join-Path $PSScriptRoot "hooks\校验库.ps1")
$repoRoot  = Split-Path $ProjectDir -Parent
$treeStart = Get-WorkTreeHash $repoRoot
$mode = "static+build"   # 十二道静态 + 两道真跑 dotnet(无编辑器形态);保留为遥测字段

# 编排的运行上下文(出口、遥测与扫描循环的实现在 hook函数库「自检编排的共用出口」节,服务端自检同用):
# gate-run 遥测的固定字段在此给一次,各出口只给 verdict / ticket。遥测在 verdict / secs 之外另记各道毫秒
# (scanms)、本次判违规的全部道(fails,含已跑完的并行道)与 STALE 时的漂移路径(driftPaths)。
$gateRun = New-GateRun "客户端自检" $repoRoot @{ mode = $mode; slot = $slotName } ("; slot=" + $slotName)

# 静态扫描道次 = 下面数组:任一违规即判检查未过。每道自带其规约/不变量表,本脚本只做编排与判决。
# Async = 起成子进程并行跑的道(判据与收结果的次序见头注)。
$scans = @(
    @{ File = "命名空间扫描.ps1";   Tag = "nsscan";      Fail = "namespace convention / asmdef coverage scan"; Infra = "namespace scan could not run (bad project dir)" },
    @{ File = "平台宏核对.ps1";   Tag = "definescan";  Fail = "platform define policy scan"; Infra = "platform define scan could not run (manifest or ProjectSettings missing)" },
    @{ File = "文本截断核对.ps1"; Tag = "truncscan";   Fail = "UGUI text truncation scan"; Infra = "text truncation scan could not run (Assets dir missing)" },
    @{ File = "UI绑定核对.ps1"; Tag = "uibindscan"; Fail = "UI prefab binding completeness scan"; Infra = "UI binding scan could not run (Gen or prefab dir missing)"; Async = $true },
    @{ File = "安全区结构核对.ps1"; Tag = "safeareascan"; Fail = "UI safe-area node structure scan"; Infra = "safe area scan could not run (Assets dir missing or UISafeArea.cs.meta corrupt)"; Async = $true },
    @{ File = "图集子图组件核对.ps1"; Tag = "atlasimgscan"; Fail = "atlas sub-sprite on non-ExImage / atlas-less ExImage scan"; Infra = "atlas image scan could not run (Assets dir missing or ExImage.cs.meta corrupt)"; Async = $true },
    @{ File = "bat编码核对.ps1"; Tag = "batasciiscan"; Fail = "repo .bat pure-ASCII scan"; Infra = "bat encoding scan could not run (repo root not a git checkout)" },
    @{ File = "热更程序集核对.ps1"; Tag = "hotasmscan"; Fail = "hot-update assembly whitelist / dual-file sync scan"; Infra = "hot-update assembly scan could not run (UpdateSetting or HybridCLRSettings missing/unparsable)" },
    @{ File = "机器路径核对.ps1"; Tag = "machinepathscan"; Fail = "machine-specific absolute path scan"; Infra = "machine path scan could not run (repo root not a git checkout)" },
    @{ File = "工程链接核对.ps1"; Tag = "csprojlinkscan"; Fail = "tool csproj linked-file existence scan"; Infra = "csproj link scan could not run (repo root not a git checkout or csproj unparsable)" },
    @{ File = "进程编码核对.ps1"; Tag = "procencscan"; Fail = "child-process capture via shared primitive"; Infra = "process encoding scan could not run (Assets\Editor dir missing or the shared primitive is gone)" },
    @{ File = "启动器字体核对.ps1"; Tag = "launcherfontscan"; Fail = "launcher source chars vs subset font coverage scan"; Infra = "launcher font scan could not run (Assets\Launcher or LauncherFont.otf missing, or font cmap unparsable)" },
    @{ File = "dotnet单测.ps1"; Tag = "dotnettest"; Fail = "GameRules dotnet unit tests (netstandard2.1 mirror build + NUnit)"; Infra = "dotnet unit tests could not run (dotnet missing, test project missing, or restore failed)"; Async = $true },
    # 编 Editor 程序集的一道排最后,结论优先级也最后(单测道只编规则核心镜像库与测试工程)。
    @{ File = "Editor程序集编译.ps1"; Tag = "editorasmbuild"; Fail = "Assembly-CSharp-Editor / per-platform player-define compile"; Infra = "editor assembly build could not run (dotnet missing, csproj missing or stale, or platform define policy unusable)"; Async = $true })
$gateRun.Scans = $scans
$gateRun.Sw = [System.Diagnostics.Stopwatch]::StartNew()
# 兜底:编排自身(互核 / 取哈希 / 签票)抛出的异常同样落 INFRA,不冒泡成 exit 1、不缺 VERDICT 末行。
trap { Exit-GateInfra $gateRun "unhandled" ("gate orchestration threw " + $_.Exception.GetType().Name + ": " + ($_.Exception.Message -replace '\s+', ' ')) }

$surfaceGap = Get-ClientGateSurfaceGap @($scans | ForEach-Object { $_.File })
if ($surfaceGap.Count -gt 0) {
  Exit-GateInfra $gateRun "surface" ("scan list and read-surface registry (hooks\校验库.ps1 ClientGateScanSurface) disagree: " + ($surfaceGap -join "; "))
}
$scanDir = $PSScriptRoot
if ($env:DEVFLOW_TEST_GATE_SCAN_DIR) {
  $scanDir = $env:DEVFLOW_TEST_GATE_SCAN_DIR
  Write-Host "NOTE    : scans loaded from DEVFLOW_TEST_GATE_SCAN_DIR='$scanDir' (test injection point)"
}
# 开跑前把各道先核一遍(脚本在位 + 准入登记,判据正本 = hook函数库 Get-GateAdmissionGap):缺任一项整道自检判
# INFRA、一道都不跑。并行道开跑即起,核对留到轮到该道时才做的话,前面各道与并行道都已白跑。
foreach ($scan in $scans) {
  $scan.Path = Join-Path $scanDir $scan.File
  if (-not (Test-Path $scan.Path)) { Exit-GateInfra $gateRun $scan.Tag ($scan.File + " missing at '" + $scan.Path + "' (scan is mandatory for every gate)") }
  $admGap = Get-GateAdmissionGap $scan.Path
  if ($admGap.Count -gt 0) { Exit-GateInfra $gateRun "admission" ($scan.File + " 准入登记不合判据:" + ($admGap -join "; ")) }
}

# 跑各道(并行道开跑即起、其余照数组顺序在本进程跑;结局判定 = hook函数库 Resolve-ScanOutcome):
# 违规 / 跑不起来时在里面以本脚本自己的 VERDICT 退出,全过才回到这里。
Invoke-GateScans $gateRun "ProjectDir" $ProjectDir
$gateRun.Sw.Stop(); $secs = [int]$gateRun.Sw.Elapsed.TotalSeconds

$verdict = "PASS"
Write-Host "===================================="
Write-Host "VERDICT : $verdict   (${secs}s, mode=$mode, slot=$slotName)"
Write-Host ("DETAIL  : checks clean (" + (@($scans | ForEach-Object { $_.Fail -replace ' scan$', '' }) -join " + ") + ")")

# 凭据签发:PASS + 树未变才发。树中途变 = STALE,verdict 降级、不发票,漂移路径进遥测 driftPaths。
$stale = @{}
$ticket = Publish-GateTicket $repoRoot $treeStart "客户端自检" @{ slot = $slotName } $stale
if (-not $ticket) { $verdict = "STALE"; if ($stale.driftPaths) { $gateRun.Extra.driftPaths = $stale.driftPaths } }
Write-GateRunTelemetry $gateRun $verdict $ticket
if ($verdict -eq "PASS") { exit 0 }
exit 3   # 走到这里的非 PASS 只有 STALE(各道违规在扫描循环内已 exit 1)
