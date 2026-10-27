# 校验库.ps1 - the commit gate's check functions as a shared library (single source).
# Consumers: hooks/提交检查.ps1 (lexical-trigger channel: bare git verbs on the session
# command surface) and the approved delivery scripts 单仓提交.ps1 / 集成交付.ps1
# (script channel: controlled git sequences with the SAME checks built in, fail-closed).
# Extracting these out of the hook body is what makes the script channel possible without
# copy-paste drift: one check source, two trigger channels.
# 其余消费方只取共享判据、不走提交校验(以 dot-source 引用为准,不在此枚举);其中按需篇判据表的两个消费方 =
# 自审触发判定.ps1(RULES 行)与 槽位领取.ps1(「开工前读」);判据表与其匹配 / 自检函数在本文件末节。
#
# Contract:
#   - Dot-source this file; it dot-sources hook函数库.ps1 itself (WfStateRoot, Get-WorkTreeHash,
#     Get-FlowConfig, telemetry). Loading has no side effect beyond the process-wide
#     encoding pin hook函数库.ps1 applies on load (the single sanctioned pin, see R7).
#   - Functions here NEVER deny/exit; they return values. Deny/exit policy stays with each
#     consumer (hook: Deny-ToolUse fail-open posture; flow scripts: VERDICT + fail-closed).
# PS 5.1-compatible; that is also the engine hooks and flow scripts actually run under.

. (Join-Path $PSScriptRoot "hook函数库.ps1")
# devflow 脚本目录(本库在其 hooks\ 下;Invoke-GenReExport 据此调同目录的 协议导出.ps1)
$script:FlowScriptDir = Split-Path $PSScriptRoot -Parent

$script:ScratchRe = '^Demo/Assets/Editor/Tests(\.meta$|/)'
# 客户端验证面 ClientSurfaceRe = 客户端自检各道扫描实际读取的路径之并(仓根相对路径)。一条正则两个用途:
#   ①触发面:改动碰到它就须过客户端自检——槽位交付 跑不跑检查、集成交付 push 点验不验票都按它判;
#   ②漂移容忍面:凭据只被面内漂移作废。面外漂移(.claude 规则与记忆、docs、Fantasy、没有道次读的
#     资产)改不了扫描结论,检查到提交之间可容忍;主工作树上并发会话常翻动这些文件,整树凭据会被
#     反复作废。消费方 = 提交检查 / 单仓提交 / 集成交付 的验凭据,及 Get-SurfaceDrift。
# 两用途都该等于读取面:容忍面窄了,检查后改面内文件不作废凭据,未受检的改动照样过;触发面窄了,改那些
# 路径的交付不跑检查。主工作树通道的验凭据触发面仍是更窄的 GatedRe(缺口见其注释)。
# 按道登记、由登记拼出,不手写总正则:手写那条只按最早的道次界定,后加的道次没有一道回来扩它,只改
# prefab / 表数据 / .bat / ProjectSettings 的交付一道扫描都不跑就合并。登记键 = 客户端自检.ps1 扫描
# 数组的 File,该脚本启动时经 Get-ClientGateSurfaceGap 互核,缺登记或多登记即 INFRA——这是机器登记
# 而非文档副本,加道漏登记在头一次跑检查时就响。值写该道读取面的路径形态,读的是被检工作树(槽位
# 交付检的是槽位;检查脚本自身与 flow-config 取自主工作树,不在面内)。按内容挑表的道次(自带登记表
# 或按表名模式找)登记整个 Datas 的 xlsx:逐表列名等于把各道的登记表在这里再抄一份。
# 服务端通道不传验证面 -> 严格(任何非临测漂移都作废),不变。
$script:ClientGateScanSurface = [ordered]@{
  "命名空间扫描.ps1"     = '^Demo/Assets/.*\.(cs|asmdef|asmref)$'
  "平台宏核对.ps1"       = '^Demo/ProjectSettings/(PlatformDefinePolicy\.json|ProjectSettings\.asset)$'
  "文本截断核对.ps1"     = '^Demo/Assets/.*\.prefab$'
  "UI绑定核对.ps1"       = '^(Demo/Assets/GameScripts/HotFix/(GameBase|GameLogic)/UI/.*\.cs|Demo/Assets/AssetRaw/UI/.*\.prefab)$'
  "安全区结构核对.ps1"   = '^(Demo/Assets/.*\.prefab|Demo/Assets/.*/UISafeArea\.cs\.meta)$'
  "图集子图组件核对.ps1" = '^Demo/Assets/(AssetRaw/UI/.*\.prefab|.*\.spriteatlas(v2)?(\.meta)?|.*/ExImage\.cs\.meta)$'
  "bat编码核对.ps1"      = '^Demo/.*\.bat$'
  "热更程序集核对.ps1"   = '^Demo/(Assets/TEngine/Settings/UpdateSetting\.asset|ProjectSettings/HybridCLRSettings\.asset)$'
  "机器路径核对.ps1"     = '^Demo/(?!\.claude/).*\.(sh|bat|cmd|ps1)$|^Demo/Assets/(Editor|TEngine/Editor)/.*\.cs$'
  "工程链接核对.ps1"     = '^Demo/.*\.(cs|csproj)$'
  "进程编码核对.ps1"     = '^Demo/Assets/(Editor|TEngine/Editor)/.*\.cs$'
  "启动器字体核对.ps1"   = '^Demo/Assets/Launcher/(.*\.cs|Resources/Fonts/LauncherFont\.otf)$'
  # 规则核心正本(镜像库通配链接它)+ DotNet 下的镜像库、测试工程与其 props。
  "dotnet单测.ps1"       = '^Demo/(Assets/GameScripts/HotFix/GameRules/.*\.(cs|asmdef)|DotNet/.*\.(cs|csproj|props|targets))$'
  # 面比这道自己改的文件宽得多:它拦的是「热更程序集改签名,坏的是 Editor 程序集的调用点」,
  # 触发改动与报错文件恒不在一处,故 Assets 下任一 .cs / asmdef / asmref 都得让它跑一遍。
  # 另含 Packages 下入库的程序集定义:Assembly-CSharp-Editor 经 ProjectReference 连带编嵌入包(如
  # MCPForUnity.Editor),其 .cs 已由 工程链接核对 的宽登记盖住,asmdef / asmref 此前不在任何登记里。
  # 出包平台 define 那一遍另读平台清单与各平台组全局宏(ProjectSettings 两文件)。
  "Editor程序集编译.ps1" = '^Demo/(Assets/.*\.(cs|asmdef|asmref)|Packages/.*\.(asmdef|asmref)|ProjectSettings/(PlatformDefinePolicy\.json|ProjectSettings\.asset))$'
}
$script:ClientSurfaceRe = (@($script:ClientGateScanSurface.Values | ForEach-Object { '(?:' + $_ + ')' }) -join '|')
# Server gate verification surface: what `dotnet build Server.sln` actually compiles.
# Narrower than the whole repo so that docs/config churn in the Fantasy tree does not
# read as drift, wide enough to include generated protocol sources - a protocol
# re-export left uncommitted while its consuming handlers are committed is exactly the
# drift this surface must catch.
$script:ServerSurfaceRe = '\.(cs|csproj|sln|props|targets)$'
# 本地持久化探测(新增 PlayerPrefs / 文件写的提交须带「本地白名单」论证)的前提是「玩家数据归服务端」:
# 服务端通道关闭的单机工程里本地存档就是正当的持久化,探测正则换成恒不命中的 (?!),各消费点(提交检查 /
# 单仓提交 / 集成交付)随之不拦,不逐处加分支。配置读不出时按开着算(宁严)。
$script:PersistRe = 'PlayerPrefs\s*\.\s*(Set|Delete)|File\s*\.\s*(WriteAll|AppendAll)'
try { if (-not (Test-ServerEnabled)) { $script:PersistRe = '(?!)' } } catch {}
# Local-persistence probe domain: hand-written hot-update code, i.e. the business layer
# (GameLogic) and the game base layer (GameBase). Generated / protocol assemblies are out.
$script:PersistScanSpec = '"Demo/Assets/GameScripts/HotFix/GameLogic" "Demo/Assets/GameScripts/HotFix/GameBase"'
# +++-header form of the same domain, for pathspec commits where the domain filter
# cannot ride the pathspec (git has no pathspec-intersection syntax).
$script:PersistScanHdrRe = '^\+\+\+ b/Demo/Assets/GameScripts/HotFix/(GameLogic|GameBase)/'
# 主工作树通道的验凭据触发面(提交检查 主仓 commit 分支 / 单仓提交 主客户端):只认客户端代码。槽位
# 通道按上方 ClientSurfaceRe 判;这里有意不随之放宽:人工入库通道也在主工作树提交 ProjectSettings、
# .claude 下的 .bat 等工程文件,放宽即要求这些提交先过客户端自检,须连同 CLAUDE.md「devflow 适用面」
# 人工入库条一并评估。缺口:主工作树上只改其余读取面的提交不验票,先跑自检只靠 CLAUDE.md 两条通道条款
# 装载(主工程通道收尾 / 人工入库改读取面),非机判(见台账卷首)。
$script:GatedRe = '^Demo/Assets/(GameScripts|Launcher)/.*\.(cs|asmdef)$'
# Luban table sources and the field-semantics doc that must move with them. The doc is the
# only place designers read field meanings from, so a table edit that leaves it behind goes
# stale silently and only surfaces as a misconfigured table later. The rule lived in
# luban-dev's skill card, which reaches agents only - tables hand-edited and committed by a
# human never loaded it (stageLevels shipped undocumented 2026-07-28, after an earlier
# 4-field drift repair), so the second exposure moves it onto the commit gate, which both
# paths pass through.
$script:TableSrcRe = '^Configs/GameConfig/Datas/.*\.xlsx$'
$script:TableDocRe = '^Configs/GameConfig/Datas/配置表说明\.md$'
# The same doc must not TRANSCRIBE table data: a hand-copied "现行数据" table drifts the
# moment the xlsx changes, and nothing compares the two - the doc gate above only requires
# that the doc moved, never that its contents match. Three such drifts surfaced within three
# delivery rounds (a deleted activity id still listed, an activity rename not followed, an
# id roster naming two rows that never existed), so the transcribing itself is what gets
# denied. Judged on ADDED lines only: existing prose is not re-litigated, and the check
# cannot be satisfied by rewording - a markdown row whose first cell is a bare 4+ digit id
# is what data transcription looks like here (field-semantics tables lead with a field name,
# enum tables with 1-2 digit values). +++-header form, since the doc path is non-ASCII and
# riding it in a pathspec would need quoting that git config can silently reshape.
$script:TableDocHdrRe = '^\+\+\+ b/Configs/GameConfig/Datas/配置表说明\.md$'
$script:DocDataRowRe = '^\+\s*\|\s*[0-9]{4,}\s*\|'
# Luban 域路径正则族(单源;曾散落 槽位交付/集成交付 各持拼写,一次路径迁移要跨文件同步四处):
#   LubanSurfaceRe    客户端仓的整个 Luban 面(表源 + 生成物落在客户端仓的部分 + Editor 工具生成物)。
#                     消费方 = 下方生成域登记「表」的客户端源面。
#   LubanGenClientRe  客户端侧生成物域(bytes 资产 + GameProto 生成域)。消费方 = 生成域登记「表」的客户端产物。
#   LubanGenFantasyRe Fantasy 侧生成物域(Entity/Generate/GameConfig 与 GameConfigBytes,
#                     前缀匹配同时盖住两者)。消费方 = 生成域登记「表」的 Fantasy 产物。
#   LubanTableSourceRe 表源本体(Datas/ 下的 .xlsx,含 __tables__/__beans__/__enums__ 这几张 schema
#                     表——它们同样由人编辑,重放语义一致),外加同目录的 配置表说明.md。消费方 =
#                     槽位交付 基线同步块,且**仅在 -TableSourceReplayed 声明下**启用。独立成一条而不
#                     复用 LubanSurfaceRe:后者盖住整个 Configs/ 目录(含 .bat / .conf / 模板),按它
#                     取 ours 会连带吞掉基线侧对导表脚本与模板的改动。
#                     配置表说明.md 纳入本条的理由:改 xlsx 必须同改它(提交检查强制),两者永远同批
#                     改动、同批撞冲突,重放做法也完全相同(checkout 基线版后重做本轮编辑 → ours 成
#                     超集)。不纳入时表源那侧化解了、文档这侧仍停机,调用方被迫绕脚本手工 merge
#                     (实发一次:同一轮交付连撞三次,第三次才认出是覆盖面缺口而非基线竞态)。
#   LubanStampRe      导表指纹 export-stamp.json。导表入口写的产物(逐行记每张表的哈希),归生成域登记「表」
#                     的客户端产物,不归表源:两侧改的表按字母序相邻就 hunk 重叠,本轮与上游各改一张不相干
#                     的表也撞(实发 2026-09-23 dev2),按产物处置即由合并后重导重写,不需重放声明。
# OpCode.Lock 账本的显式排除留在消费方(编号冲突必须被看见,属分流政策而非路径分类)。
$script:LubanSurfaceRe    = '^(Configs/GameConfig/|Demo/Assets/AssetRaw/Configs/bytes/|Demo/Assets/GameScripts/HotFix/GameProto/(GameConfig/|ConfigSystem\.cs$)|Demo/Assets/Editor/GameConfigEditor/)'
$script:LubanGenClientRe  = '^Demo/Assets/(AssetRaw/Configs/|GameScripts/HotFix/GameProto/)'
$script:LubanGenFantasyRe = '^examples/Server/APP/Entity/Generate/GameConfig'
$script:LubanTableSourceRe = '^Configs/GameConfig/Datas/([^/]+\.xlsx|配置表说明\.md)$'
$script:LubanStampRe      = '^Configs/GameConfig/export-stamp\.json$'
# 协议生成域正则(单源;曾在 槽位交付 涉协议判定、集成交付 协议交叉核验与重导收尾三处各持拼写)。
# 生成物路径正本 = 导出工具 Tools\ProtocolExportTool\ExporterSettings.json 的两个输出目录,副证 =
# 两仓 .gitattributes 的 merge=genours 条(路径与之逐字对齐)。导出目录搬家须同改这里:本组曾停在
# 客户端已删除的 Assets/Fantasy/Generate/ 与服务端漏两级的 examples/Server/Generate/NetworkProtocol/,
# 两段都恒不命中,集成交付 的 BLOCKED-PROTOCOL-UNDECLARED 闸与重导收尾提交面随之静默失效
# (槽位交付 涉协议判定因 ProtocolGenFantasyRe 首段 examples/Config/NetworkProtocol 仍有效而没暴露)。
#   ProtocolGenClientRe  客户端仓的协议生成物(导出工具写入的客户端目录,FantasyNetwork 程序集下)。
#                        消费方 = 槽位交付 涉协议判定、集成交付 协议交叉核验 + 重导收尾的提交面。
#   ProtocolGenFantasyRe Fantasy 仓的协议面(协议定义源 + 导出工具 + 服务端生成物)。
#                        消费方 = 槽位交付 涉协议判定。与 LubanGenFantasyRe(Entity/Generate/GameConfig)
#                        不相交:同在 Entity/Generate/ 下,靠末级目录名分开。
#   ProtocolOutFantasyRe Fantasy 仓的协议生成物本身(ProtocolGenFantasyRe 去掉 .proto 源与导出工具)。
#                        消费方 = 生成域登记「协议」的 Fantasy 产物(冲突取 ours 的范围,不得含源)。
$script:ProtocolGenClientRe  = '^Demo/Assets/GameScripts/HotFix/Network/NetworkProtocol/'
$script:ProtocolGenFantasyRe = '^(examples/Config/NetworkProtocol|Tools/NetworkProtocol|examples/Server/APP/Entity/Generate/NetworkProtocol)/'
$script:ProtocolOutFantasyRe = '^examples/Server/APP/Entity/Generate/NetworkProtocol/'

# ---- 生成域登记(单源) ----
# 生成物是「源 → 导出命令」的计算结果,不按文本合并的结果为准。一条不变量管两个合并点(槽位交付 基线
# 同步 / 集成交付 并入 main):
#   合并两侧自共同祖先以来都动过某域(源或产物,两仓合看)→ 两仓都合完后按合并树重导该域;
#   产物冲突一律取 ours、不附条件:冲突只可能出在两侧都改过的产物上,那正是重导命中的条件,
#   取到的 ours 必被重导覆盖(前提 = 产物 ⊆ 动过判据,Get-GenDomainRe 按构造保证);
#   只一侧动过时 git 整份采用那一侧,源与产物自洽,不重导。
# 两侧改的是同域不同文件也重导:Tables.cs 这类汇总产物文本合并干净,内容却可能不自洽。
# 此前按「哪仓落后 × 哪类文件 × 冲突在哪」逐组合写判据,漏组合即实发一次(2026-09-22~24 六次:
# 纯客户端任务不同步 Fantasy、只 Fantasy 落后、协议 genours 留本侧旧版、导表指纹冲突、表与协议分次铸票互撞)。
# 不在产物之列:表源 xlsx(二进制两侧都改分不出谁是超集,走 -TableSourceReplayed 声明)、OpCode.Lock 账本。
# 协议产物另挂 merge=genours(两仓 .gitattributes),冲突在 git 层就取了 ours,与本处同一语义。
# 增一个域 = 在此登记一行 + Invoke-GenReExport 补对应导出分支。
#   Name  提交主题里的类名;ClientSrc / FantasySrc 源面;ClientGen / FantasyGen 产物('(?!)' = 该仓无)。
$script:GenDomains = @(
  @{ Name = "表"; ClientSrc = $script:LubanSurfaceRe; FantasySrc = '(?!)'
     ClientGen = '(?:' + $script:LubanGenClientRe + ')|(?:' + $script:LubanStampRe + ')'; FantasyGen = $script:LubanGenFantasyRe },
  @{ Name = "协议"; ClientSrc = '(?!)'; FantasySrc = $script:ProtocolGenFantasyRe
     ClientGen = $script:ProtocolGenClientRe; FantasyGen = $script:ProtocolOutFantasyRe }
)

function Get-GenDomainRe($Domains, [string]$Side, [switch]$Surface) {
  # 所给域在一仓($Side = Client / Fantasy)的产物正则之并;-Surface 取「动过判据」= 源 ∪ 产物。
  $parts = @()
  foreach ($d in $Domains) {
    $parts += $d[$Side + "Gen"]
    if ($Surface) { $parts += $d[$Side + "Src"] }
  }
  if ($parts.Count -eq 0) { return '(?!)' }
  return ('(?:' + ($parts -join ')|(?:') + ')')
}

function Get-GenOutputRe([string]$Side) {
  # 一仓全部生成物(冲突无条件取 ours 的范围),合并点的冲突分流用。
  return (Get-GenDomainRe $script:GenDomains $Side)
}

function Select-GenDomainsBothTouched($ClientOurs, $ClientTheirs, $FantasyOurs, $FantasyTheirs) {
  # 纯函数:两仓各自 merge-base→ours / merge-base→theirs 的路径清单 → 两侧都动过的域(登记顺序)。
  $hit = @()
  foreach ($d in $script:GenDomains) {
    $cRe = Get-GenDomainRe @($d) "Client" -Surface
    $fRe = Get-GenDomainRe @($d) "Fantasy" -Surface
    $o = (@($ClientOurs | Where-Object { $_ -match $cRe }).Count + @($FantasyOurs | Where-Object { $_ -match $fRe }).Count) -gt 0
    $t = (@($ClientTheirs | Where-Object { $_ -match $cRe }).Count + @($FantasyTheirs | Where-Object { $_ -match $fRe }).Count) -gt 0
    if ($o -and $t) { $hit += , $d }
  }
  return , $hit
}

function Get-MergeSidePaths([string]$Repo, [string]$Ours, [string]$Theirs) {
  # 一次合并两侧自 merge-base 起各自改过的路径。回 @{ ok; ours; theirs; note }。查询失败回 ok=$false,
  # 调用方判 INFRA:空清单会被读成「没动过」而静默跳过重导,正是这道判据最不能出的错。
  $mb = Invoke-GitMerged $Repo ("merge-base " + $Ours + " " + $Theirs)
  if ($mb.code -ne 0 -or $mb.lines.Count -eq 0) {
    return @{ ok = $false; ours = @(); theirs = @(); note = ("merge-base " + $Ours + " " + $Theirs + " 失败(" + $Repo + "):" + (($mb.lines | Select-Object -Last 2) -join " | ")) }
  }
  $base = ([string]$mb.lines[0]).Trim()
  $side = @{}
  foreach ($k in @(@("ours", $Ours), @("theirs", $Theirs))) {
    $r = Invoke-GitMerged $Repo ("-c core.quotepath=false diff --name-only " + $base + " " + $k[1])
    if ($r.code -ne 0) {
      return @{ ok = $false; ours = @(); theirs = @(); note = ("diff --name-only " + $base + " " + $k[1] + " 失败(" + $Repo + "):" + (($r.lines | Select-Object -Last 2) -join " | ")) }
    }
    $side[$k[0]] = @($r.lines | ForEach-Object { ([string]$_).Trim().Trim('"') } | Where-Object { $_ })
  }
  return @{ ok = $true; ours = $side.ours; theirs = $side.theirs; note = "" }
}

function Invoke-GenReExport([string]$ClientRoot, [string]$FantasyRoot, $Domains) {
  # 按登记顺序重导所给域,两仓写入(导表 bat 写客户端 + Fantasy,协议导出 写 Fantasy + 其上一级客户端仓)。
  # 回 "" = 全部成功;否则一句失败说明,调用方拼进 VERDICT。不提交:提交与铸票归调用方(槽位 / 主仓收口不同)。
  # 导完在两仓所给域的动过面上归一行尾幻影(hook函数库 Repair-EolPhantomPaths):调用方的提交收口只收有内容
  # 差异的路径,幻影不归一就永久留在树上。放在这里而非各收口,两个合并点与今后新登记的域都走同一处。
  $cfg = Get-FlowConfig
  $flowDir = $script:FlowScriptDir
  foreach ($d in $Domains) {
    switch ($d.Name) {
      "表" {
        foreach ($batRel in @($cfg.LubanGenClientBat, $cfg.LubanGenServerBat)) {
          if (-not $batRel) { return "flow-config 缺 LubanGenClientBat / LubanGenServerBat 键" }
          $bat = Join-Path $ClientRoot (([string]$batRel) -replace '/', '\')
          if (-not (Test-Path $bat)) { return ("导表入口不存在:" + $bat) }
          Write-Host ("INFO 重导表:" + $batRel)
          $env:AI_MODE = "1"
          $genOut = cmd /c "call `"$bat`" 2>&1"
          if ($LASTEXITCODE -ne 0) { return ("重导表失败(" + $batRel + " 退出码 " + $LASTEXITCODE + "):" + ((@($genOut) | ForEach-Object { [string]$_ } | Select-Object -Last 5) -join " | ")) }
        }
      }
      "协议" {
        Write-Host "INFO 重导协议:协议导出.ps1"
        $r = Invoke-FlowChild (Join-Path $flowDir "协议导出.ps1") @("-FantasyRoot", $FantasyRoot)
        if ($r.code -ne 0) { return ("协议导出 失败:" + ($r.lines -join " | ")) }
      }
      default { return ("生成域「" + $d.Name + "」已登记但无导出分支") }
    }
  }
  foreach ($t in @(@($ClientRoot, "Client"), @($FantasyRoot, "Fantasy"))) {
    $n = Repair-EolPhantomPaths $t[0] (Get-GenDomainRe $Domains $t[1] -Surface)
    if (-not $n.ok) { return ("重导后行尾归一失败:" + $n.note) }
    if ($n.fixed.Count -gt 0) { Write-Host ("INFO 重导后行尾归一(内容零差异,checkout 回检出形态)" + $n.fixed.Count + " 项:" + (@($n.fixed | Select-Object -First 5) -join ", ")) }
  }
  return ""
}
# 机器提交署名 trailer(单源)。署名为项目固定的 agent 身份,不含模型名——模型随会话变,写死任一个都会
# 在换模型后失配。消费方 = 槽位交付 基线同步重导提交、集成交付 合并后重导收尾提交(经下方
# New-FlowCommitMsgFile)、单仓提交.ps1 给人写的提交信息缺署名时补署名。
$script:FlowCoAuthorTrailer = 'Co-Authored-By: agent-zp <zhoupengzy@163.com>'

function New-FlowCommitMsgFile([string]$Subject) {
  # 机器提交的提交信息文件:主题 + 空行 + 署名 trailer,UTF-8 无 BOM;落 %TEMP% 并登记待清
  # (hook函数库 New-FlowTempFile,调用脚本出口 finally 调 Remove-FlowTempFiles)。
  $p = New-FlowTempFile "flow-commitmsg"
  [System.IO.File]::WriteAllText($p, $Subject + "`n`n" + $script:FlowCoAuthorTrailer, (New-Object System.Text.UTF8Encoding($false)))
  return $p
}
# Commit subject format (single source). Human-authored subjects must read
# `【动词】范围: 描述`, or `【动词】描述` when there is no scope. Rationale: main's history
# had accumulated five parallel shapes (feat(UI):, fix(玩法):, refactor(订单):, 重构(订单):,
# bare 提交) because the format lived nowhere but each agent's conventional-commit habit;
# a doc-only rule would keep drifting, so the format is enforced at the one gate every
# script-channel commit passes through (单仓提交.ps1).
# Deliberately NOT covered, and not reachable from here: `claim:` placeholders (打自
# 槽位领取内核.ps1) are a git search anchor over 311 commits of history and must stay
# verbatim; merge commits are produced by git itself in 集成交付.ps1; and 集成交付.ps1's
# own machine-authored commits (合并后重导收尾; 槽位交付's 基线同步重导 likewise) carry the reserved word 【流程】,
# which keeps them visually separable from human changes in main's history. None of the
# three routes through 单仓提交.ps1, so all are exempt by construction rather than by a
# bypass flag - and 【流程】 stays outside the human word list below precisely so that a
# human cannot borrow the machine's word to slip past the check.
#
# 词表闭合。自拟动词下 601 条提交长出 121 种动词、70 种只用过一次,动词位退化成描述的第一
# 个词,按动词检索或分类不可能。放开时(2026-08-20)所指的取整缺口——"有意改既有行为、原来
# 没错"只能报成【改进】——由【变更】一档承载。不合词表返回 DENIED-subject,零 git 写且归
# fix-retry,赔的是一次脚本调用而非一轮检查。
# 各词的适用边界见 .claude/skills/devflow/SKILL.md「提交主题格式」,此处只判定不释义。
# 词表增删须同步这几处(各自有存在理由,不收编为指针:撞闸文案要当场告诉作者能写什么、
# 测试要逐词覆盖、判定要分类):devflow/SKILL.md 边界表、单仓提交.ps1 与 槽位交付.ps1 的
# DENIED-subject 文案、tests\单仓提交测试.ps1 S2/S2b、下方 $script:FixVerbRe(新词算不算修复类)。
# 交付弹窗(Assets/Editor/DevFlow/DevFlowDashboardWindow.cs)不持副本,运行期解析下一行取判据,
# 词表增删无需跟改;改这行的形态(单行、单引号赋值)须同步其 SubjectAssignRe。
$script:SubjectRe = '^【(新增|修复|变更|重构|删除|配置|文档)】\s*\S'

function Get-SubjectFormatGap([string]$MsgText) {
  # Empty string when the subject line is well-formed; otherwise the offending subject line
  # (or a placeholder when the message has no non-blank line) so the deny message can echo it.
  # Only the subject is checked - the body is free-form (briefs, 白名单 arguments, trailers).
  $lines = @($MsgText -split "`r?`n")
  $subject = ""
  foreach ($l in $lines) { if (([string]$l).Trim()) { $subject = ([string]$l).Trim(); break } }
  if (-not $subject) { return "(空信息)" }
  if ($subject -match $script:SubjectRe) { return "" }
  return $subject
}

# 修复类提交的定性缺口(single source)。消费方 = 自审触发判定.ps1 的 FIX-QUALIFY 行(只报不拦)
# 与 槽位交付.ps1 的入口前置校验(DENIED-qualify,零 git 写,归 fix-retry)。只判在场不判质量:
# 定性写得对不对、补丁的根源写没写,仍靠人。
# 修复类主题动词:词表闭合后只有【修复】属这一类。词表加词时须回来核一遍新词算不算修复类
# ——少判是漏一条定性义务。
$script:FixVerbRe = '^【修复】'
# 定性结论:正文里「根治 / 补丁」任一在场即算已下结论。
$script:QualRe = '根治|补丁'
# 结论取「根治还是补丁」「定性」标记后的第一个结论词,正文没有标记时取首次出现的那个。
# 不按「根治」二字在不在判:惯用小标题「根治还是补丁:补丁」、补丁正文里的「根治须另立任务」都带它,
# 按在场判会把补丁结论当成根治、逼它补写不变量——误报一多,真正该抓的那类也会被一并忽略。
$script:QualMarkerRe = '(根治还是补丁|定性)\s*[::]?\s*(?<c>根治|补丁)'
# 定「根治」须同时写出它立住的不变量。定性判据(CLAUDE.md「修复前先定性」)问「同类问题换个地方
# 再发生,修复是否仍有效」,答这句的前提是先说出修复靠什么成立;只写「定性:根治」时这个前提没人检过,
# 同类缺陷就会带着「根治」的结论第二次暴露。
$script:InvariantRe = '不变量'

function Get-FixQualifyGap([string]$MsgText) {
  # 返回 @{ Subject; IsFix; Gap }。Gap:'' 无缺口(含非修复类)/ 'no-qual' 修复类而全文无根治、补丁结论 /
  # 'root-no-invariant' 结论为根治而未写不变量。主题 = 第一个非空行,与 Get-SubjectFormatGap 同口径
  # (取首行时信息以空行开头主题就是空串,修复类判不出)。
  $subject = ""
  foreach ($l in @($MsgText -split "`r?`n")) { if (([string]$l).Trim()) { $subject = ([string]$l).Trim(); break } }
  $isFix = $subject -match $script:FixVerbRe
  $gap = ""
  if ($isFix) {
    $hasQual = $MsgText -match $script:QualRe
    $marker = [regex]::Match($MsgText, $script:QualMarkerRe)
    $conclusion = if ($marker.Success) { $marker.Groups['c'].Value }
                  elseif ($hasQual) { [regex]::Match($MsgText, $script:QualRe).Value }
                  else { '' }
    if (-not $hasQual) { $gap = "no-qual" }
    elseif (($conclusion -eq '根治') -and -not ($MsgText -match $script:InvariantRe)) { $gap = "root-no-invariant" }
  }
  return @{ Subject = $subject; IsFix = [bool]$isFix; Gap = $gap }
}

function Get-TableDocGap([string[]]$Paths) {
  # Table sources changed without the field-semantics doc moving too; empty when the doc is
  # in the same set, or when no table source was touched. Returns the offending sources so
  # the deny message can name them.
  $src = @($Paths | Where-Object { $_ -match $script:TableSrcRe })
  if ($src.Count -eq 0) { return , @() }
  if (@($Paths | Where-Object { $_ -match $script:TableDocRe }).Count -gt 0) { return , @() }
  return , $src
}

function Get-AddedLines([string]$Root, [string]$DiffArgs) {
  $lines = Get-GitLines $Root ("diff " + $DiffArgs)
  return , @($lines | Where-Object { $_ -match '^\+' -and $_ -notmatch '^\+\+\+' })
}

function Get-AddedLinesInDomain([string]$Dir, [string]$DiffArgs, [string]$HdrRe) {
  # Added lines kept only while the enclosing file's +++ header matches $HdrRe: the
  # pathspec-commit variant of Get-AddedLines, where the domain filter moves out of the
  # pathspec (see PersistScanHdrRe) and onto the diff headers. Header shape is pinned
  # against user diff config (noprefix/mnemonicPrefix would silently blind the filter,
  # quotepath would wrap non-ASCII paths in quotes).
  $lines = Get-GitLines $Dir ("-c diff.noprefix=false -c diff.mnemonicprefix=false -c core.quotepath=false diff " + $DiffArgs)
  $out = @(); $inDom = $false
  foreach ($l in $lines) {
    if ($l -match '^\+\+\+ ') { $inDom = ($l -match $HdrRe); continue }
    if ($inDom -and $l -match '^\+' -and $l -notmatch '^\+\+\+') { $out += $l }
  }
  return , $out
}

function ConvertTo-WinRepoPath([string]$P) {
  # Fold MSYS/Git-Bash (/d/work/...) and cygwin (/cygdrive/d/work/...) unix-style paths back
  # to the Windows drive-letter form (D:/work/...). A git command issued through the Bash
  # tool carries such a path in `-C`; the hook resolves the repo via `cmd /c git -C <path>`,
  # which has no MSYS path-translation layer, so a leading-slash unix path fails rev-parse
  # (exit 128) and lands in the repo-unresolved path instead of the real repo checks - when
  # that path was fail-open this was a total gate bypass for every Bash-tool commit/push
  # (live incident 2026-07-17; repo-unresolved is now a fail-closed deny in 提交检查).
  # Windows paths (drive-letter or forward-slash) and relative paths carry no leading
  # `/drive/` and pass through untouched.
  if ([string]::IsNullOrWhiteSpace($P)) { return $P }
  if ($P -match '^/cygdrive/([a-zA-Z])(/.*)?$') { return ($Matches[1].ToUpperInvariant() + ':' + $Matches[2]) }
  if ($P -match '^/([a-zA-Z])(/.*)?$') { return ($Matches[1].ToUpperInvariant() + ':' + $Matches[2]) }
  return $P
}

function Test-TicketCoversTree([string]$Root, [string]$TicketTree, [string]$SurfaceRe = "") {
  # "match" | "exempt-diff" | "tree-mismatch" | "hash-failed"
  # A ticket certifies the gate's verdict over its VERIFICATION SURFACE.
  # Per differing file between ticket tree and current tree:
  #   - temp-test deletion (Assets/Editor/Tests) -> exempt (temp tests never ship);
  #   - with $SurfaceRe (client channels): out-of-surface drift -> exempt (the gate never
  #     reads it, so it can't invalidate the verdict); in-surface drift -> void;
  #   - without $SurfaceRe (server channel): any non-scratch drift -> void (strict).
  $cur = Get-WorkTreeHash $Root
  if (-not $cur) { return "hash-failed" }
  if ($cur -eq $TicketTree) { return "match" }
  # core.quotepath=false:缺省把非 ASCII 路径转义加引号,前缀锚定的面正则对它失配——带中文备注后缀
  # 的表文件漂移会被读成面外而放行。rename 两端都判:从面内移到面外,面内同样少了一个文件。
  $diffLines = Get-GitLines $Root ("-c core.quotepath=false diff --name-status " + $TicketTree + " " + $cur)
  if ($diffLines.Count -eq 0) { return "tree-mismatch" }
  foreach ($l in $diffLines) {
    $f = $l -split "`t"
    if ($f.Count -lt 2) { return "tree-mismatch" }
    $st = $f[0].Substring(0, 1)
    $paths = @($f[1..($f.Count - 1)] | ForEach-Object { ([string]$_).Trim('"') })
    if ($st -eq "D" -and $paths[0] -match $script:ScratchRe) { continue }
    if ($SurfaceRe -and @($paths | Where-Object { $_ -match $SurfaceRe }).Count -eq 0) { continue }
    return "tree-mismatch"
  }
  return "exempt-diff"
}

function Read-Ticket([string]$Root) {
  $ticketPath = Join-Path $Root ".gate\ticket.json"
  if (-not (Test-Path $ticketPath)) { return $null }
  try { return (Get-Content $ticketPath -Raw -Encoding UTF8 | ConvertFrom-Json) } catch { return $null }
}

function Get-TicketVerdict([string]$Root, [string]$SurfaceRe = "") {
  # 验凭据判定的单一正本(消费方:提交检查 的命令面三处 + 单仓提交 / 集成交付 的脚本面三处)。
  # 回 why:"match"/"exempt-diff" = 通过,其余("no-ticket"/"ticket-not-pass"/"tree-mismatch"/
  # "hash-failed")= 拒。$SurfaceRe 给客户端通道的验证面容差,服务端通道不传即严格。
  # 拒绝文案与 deny/VERDICT 姿态留各消费方:两条信道的措辞和失败姿态本就不同。
  $t = Read-Ticket $Root
  if (-not $t) { return "no-ticket" }
  if ([string]$t.result -ne "PASS") { return "ticket-not-pass" }
  return (Test-TicketCoversTree $Root ([string]$t.tree) $SurfaceRe)
}

function Test-TicketVerdictPass([string]$Why) {
  return ($Why -eq "match" -or $Why -eq "exempt-diff")
}

function Get-SurfaceDrift([string]$Root, [string]$SurfaceRe, $CommittedPaths) {
  # 「验证面内、不属于本次提交文件集的未提交改动」的单一正本(消费方:提交检查 的客户端与
  # 服务端两分支 + 单仓提交 的同两分支)。
  # 部分提交盲区:票认证的是整棵工作树,而提交记录的是 HEAD + 本次文件集。两者不等价时,
  # 产出的树从未以该形态受测——检查编译时读到的未提交文件不在提交里,推送后的树可能编译
  # 失败(实发:协议重导结果留在工作树未提交,而消费它的 handler 已入库,main 上任何干净
  # 检出编译失败 13 处,而提交时本仓工作树确实能构建、票照发)。
  # 回路径清单;警示/拒绝姿态与文案留各消费方(hook 走 allow-with-note,脚本走 WARN)。
  $out = @()
  $wt = @()
  # quotepath 理由同 Test-TicketCoversTree;调用方的 $CommittedPaths 也按 quotepath=false 取,转义形态
  # 会让已提交的中文名文件对不上、被误报为漂移。
  $wt += Get-GitLines $Root "-c core.quotepath=false diff --name-only HEAD"
  $wt += Get-GitLines $Root "-c core.quotepath=false ls-files --others --exclude-standard"
  foreach ($l in $wt) {
    $p = ([string]$l).Trim().Trim('"')
    if (-not $p) { continue }
    if ($SurfaceRe -and ($p -notmatch $SurfaceRe)) { continue }
    if ($p -match $script:ScratchRe) { continue }
    if ($CommittedPaths -contains $p) { continue }
    $out += $p
  }
  return , $out
}

function Get-ClientGateSurfaceGap([string[]]$ScanFiles) {
  # 客户端自检扫描数组 ↔ ClientGateScanSurface 登记的互核(消费方:客户端自检 启动时;理由见登记处)。
  # 回缺口描述数组,空 = 一致。缺登记:该道读的路径进不了触发面与容忍面;多登记:死登记平白扩面。
  $gap = @()
  foreach ($f in $ScanFiles) {
    if (-not $script:ClientGateScanSurface.Contains($f)) { $gap += ($f + " 在扫描数组里但未登记读取面") }
  }
  foreach ($k in $script:ClientGateScanSurface.Keys) {
    if ($ScanFiles -notcontains $k) { $gap += ($k + " 登记了读取面但不在扫描数组里") }
  }
  return , $gap
}

function Test-AllScratchDeletion($Entries) {
  # 「本次文件集全是临时测试删除」判定的单一正本(消费方:提交检查 的豁免分支、单仓提交 的
  # 客户端验凭据豁免)。空集回 $true,调用方自行先判空。
  foreach ($e in $Entries) {
    if ($e.status -ne "D") { return $false }
    foreach ($p in $e.paths) { if ($p -notmatch $script:ScratchRe) { return $false } }
  }
  return $true
}

function ConvertTo-Entries($lines) {
  # name-status diff lines -> {status, paths} entries. Library placement guarantees the
  # definition precedes every call site (a mid-file definition once left the hook's earlier
  # slot-push branch calling an unknown name and fail-opening every slot-push check, caught
  # 2026-07-15 via the telemetry error line "ConvertTo-Entries").
  $result = @()
  foreach ($l in $lines) {
    $f = $l -split "`t"
    if ($f.Count -lt 2) { continue }
    $st = $f[0].Substring(0, 1)
    $paths = @($f[1..($f.Count - 1)])
    $result += , @{ status = $st; paths = $paths }
  }
  return , $result
}

# ---- 按需篇点名判据表(单源;消费方 = 自审触发判定.ps1 的 RULES 行(事后:改动面 + 新增行)、
# 槽位领取.ps1 的「开工前读」行(事前:-PathsFile / -FantasyPathsFile 给的改动范围前缀)) ----
# 为什么由脚本点名:按需规则篇与 TEngine 知识篇命中与否原先全靠会话对照 CLAUDE.md 路由表自认,命中触发面
# 却无人点名时整篇读率约 1/6~2/5;同期由本脚本族报 SECURITY-REVIEW: required 的,security-review.md 读率近九成。
# 一行 = 一条触发,命中即点名 Doc;同一篇可占多行。字段:
#   Doc       篇路径,相对 Demo(规则栈从主工程读,写法同 CLAUDE.md 路由表)
#   Side      client = 客户端仓(路径以仓根为基,带 Demo/ 前缀)/ server = Fantasy 仓(以其仓根为基)
#   PathRe    路径判据,事前事后都用;@() = 不按路径判
#   DirRe     目录判据,只在事前用:改动范围前缀落在该目录面内即命中(新建目录下还没有文件时靠它);@() = 无
#   ContentRe 内容判据,只在事后用:改动到的 .cs / .prefab 的新增行(untracked 文件整份算新增);@() = 不按内容判
#   Ahead     预置支(可缺省):上三个字段里**原样**列出的元素串,本工程还没有该类代码 / 资产、防漂移自检暂免零命中。
#             点名照常生效——新工程第一次写出这类件正是该读篇的时候,删支会让点名在最需要时落空。该支一有着落,
#             自检即报缺口要求从 Ahead 撤掉(转回常规防漂移核);Ahead 里列了表里没有的串也报缺口。
# 三个判据字段都是正则数组,任一元素命中即算该字段命中;一个元素 = 一支能单独改名失效的判据:本工程的目录、文件名词干、
# 类名 / API 名各占一个元素,扩展名、可选后缀(Docs?、Async)、外部 API 族(MongoDB 驱动写方法、Unity PlayerPrefs)这类
# 形态变体留在同一元素里。拆开是为了让防漂移自检逐支核着落——写成一条 `A|B` 时 B 改名失效、A 仍命中,自检照报 PASS。
# 元素里出现顶层 `|` 由自检直接报缺口。
# 口径:命中的最终判据——按需规则篇看其头部「适用」节(tengine-conventions 无此节,看 CLAUDE.md「TEngine 框架知识路由」
# 节「写/改客户端 TEngine 代码时另遵」句),知识篇与底座篇看 CLAUDE.md「TEngine 框架知识路由」「工程底座系统路由」两张表;
# 本表是它们的机器近似,取宽不取窄——误点名的代价是多读一篇,漏点名就退回会话自认。匹配不分大小写。改篇名、搬目录、改判据所指的 API 名须同改本表;
# 漂移由 Get-RuleReadTableGap 核(经 自审触发判定.ps1 -CheckRuleTable,devflow-check 检查项 6 调它)。
# 服务端的「功能代码」面 = APP 下两个热重载工程 Hotfix 与 GameBase(同一个可卸载加载上下文,玩家数据层在 GameBase)
# 加两个不热重载的数据工程里的手写实体:Entity/Game Examples(底座)与 BlockEntity(游戏层,整个工程都是手写实体);
# Entity/Generate(导出生成物)、Entity 根与 Main 的启动件不算。
# 表外的面(仍靠会话按路由表自认):路由表其余篇(事件、资源、模块、命名、Luban、架构…);给配置表加图名列
# (xlsx 不看内容);不叫 m_btn_Mask、也不实现 ICanvasRaycastFilter 的全屏吃点击节点;玩家持久数据的归属
# (data-authority,需求审计段判)。
$script:RuleReadContentExtRe = '\.(cs|prefab)$'
$script:RuleReadTable = @(
  # 客户端 TEngine 代码规约:devflow-client 卡写着开工无条件读,但卡内祈使句读率只有约一半,故凡碰客户端脚本即点名。
  @{ Doc = '.claude/rules-ondemand/tengine-conventions.md'; Side = 'client'
     PathRe = @('^Demo/Assets/GameScripts/.*\.cs$', '^Demo/Assets/Launcher/.*\.cs$')
     DirRe = @('^Demo/Assets/GameScripts(/|$)', '^Demo/Assets/Launcher(/|$)'); ContentRe = @() },
  @{ Doc = '.claude/rules-ondemand/ui-image-assets.md'; Side = 'client'
     PathRe = @('^Demo/Assets/AssetRaw/UI/.*\.(png|jpe?g|tga|psd)$')
     DirRe = @('^Demo/Assets/AssetRaw/UI/Atlas(/|$)', '^Demo/Assets/AssetRaw/UI/Texture(/|$)')
     ContentRe = @('\bSpriteName\b', '\bSpriteBind\b')
     Ahead = @('^Demo/Assets/AssetRaw/UI/.*\.(png|jpe?g|tga|psd)$', '^Demo/Assets/AssetRaw/UI/Atlas(/|$)', '\bSpriteBind\b') },
  @{ Doc = '.claude/rules-ondemand/ui-blocking-layer.md'; Side = 'client'
     PathRe = @('^Demo/Assets/GameScripts/.*Mask[^/]*\.cs$'); DirRe = @()
     ContentRe = @('\bm_btn_Mask\b', '\[Window\s*\(\s*UILayer\.', '\bICanvasRaycastFilter\b', '\bfullScreen\s*:')
     Ahead = @('^Demo/Assets/GameScripts/.*Mask[^/]*\.cs$', '\bm_btn_Mask\b', '\bICanvasRaycastFilter\b') },
  @{ Doc = '.claude/references/tengine/hotfix-workflow.md'; Side = 'client'
     PathRe = @('^Demo/Assets/GameScripts/.*\.asmdef$', '^Demo/Assets/GameScripts/HotFix/GameLogic/GameApp[^/]*\.cs$',
                '^Demo/Assets/Launcher/.*\.cs$', '^Demo/Assets/TEngine/Settings/UpdateSetting\.asset$',
                '^Demo/ProjectSettings/HybridCLRSettings\.asset$')
     DirRe = @(); ContentRe = @() },
  @{ Doc = '.claude/references/tengine/ui-lifecycle.md'; Side = 'client'
     PathRe = @('^Demo/Assets/GameScripts/HotFix/[^/]+/UI/(.*/)?[^/]*Panel[^/]*\.cs$', '^Demo/Assets/GameScripts/HotFix/[^/]+/UI/(.*/)?[^/]*Window[^/]*\.cs$')
     DirRe = @('^Demo/Assets/GameScripts/HotFix/GameLogic/UI(/|$)'); ContentRe = @() },
  @{ Doc = '.claude/references/tengine/ui-patterns.md'; Side = 'client'
     PathRe = @('^Demo/Assets/GameScripts/.*Part\.cs$')
     DirRe = @('^Demo/Assets/GameScripts/HotFix/GameLogic/UI/(.*/)?Part(/|$)', '^Demo/Assets/AssetRaw/UI/Prefabs/Parts(/|$)'); ContentRe = @()
     Ahead = @('^Demo/Assets/GameScripts/.*Part\.cs$', '^Demo/Assets/GameScripts/HotFix/GameLogic/UI/(.*/)?Part(/|$)', '^Demo/Assets/AssetRaw/UI/Prefabs/Parts(/|$)') }
)

function Get-RuleReadMatchers($Table = $null) {
  # 判据表 -> 预编译的匹配器(不分大小写)。表里的正则多于 .NET 静态正则缓存的 15 条,前缀展开时逐文件按串调
  # [regex]::IsMatch 会反复重编。$Table 缺省 = RuleReadTable。每个字段编两份:Path / Dir / Content = 各元素以
  # (?:..)|(?:..) 合成的一条(匹配用,$null = 该字段为空);Parts.<字段> = 逐元素的正则数组(防漂移自检逐支核着落用)。
  # 字段给单串也认(当一元素数组),空串与 $null 元素略去。
  if ($null -eq $Table) { $Table = $script:RuleReadTable }
  $opt = [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::CultureInvariant
  $out = New-Object System.Collections.Generic.List[object]
  foreach ($r in $Table) {
    $m = @{ Rule = $r; Path = $null; Dir = $null; Content = $null; Parts = @{} }
    foreach ($k in @("Path", "Dir", "Content")) {
      $src = @(@($r[$k + "Re"]) | Where-Object { $_ } | ForEach-Object { [string]$_ })
      $parts = New-Object System.Collections.Generic.List[object]
      foreach ($s in $src) { $parts.Add((New-Object System.Text.RegularExpressions.Regex $s, $opt)) }
      $m.Parts[$k] = $parts.ToArray()
      if ($src.Count -gt 0) { $m[$k] = New-Object System.Text.RegularExpressions.Regex (($src | ForEach-Object { "(?:" + $_ + ")" }) -join "|"), $opt }
    }
    $out.Add($m)
  }
  return , $out.ToArray()
}

function Test-RegexTopLevelAlternation([string]$Re) {
  # 正则串里有没有顶层(括号与字符类之外、未转义)的 `|`。判据表元素约定为单支(见判据表注释),有则自检报缺口。
  $depth = 0; $inClass = $false
  for ($i = 0; $i -lt $Re.Length; $i++) {
    $ch = $Re[$i]
    if ($ch -eq [char]'\') { $i++; continue }
    if ($inClass) { if ($ch -eq [char]']') { $inClass = $false }; continue }
    if ($ch -eq [char]'[') { $inClass = $true }
    elseif ($ch -eq [char]'(') { $depth++ }
    elseif ($ch -eq [char]')') { $depth-- }
    elseif ($ch -eq [char]'|' -and $depth -eq 0) { return $true }
  }
  return $false
}

function Add-RuleReadHit($Out, [string]$Doc, [string]$Hit) {
  # 命中记账:篇 -> List[string](同篇同一命中项只记一次)。$Out 是 [ordered] 表,篇的次序 = 首次命中的次序。
  if (-not $Out.Contains($Doc)) { $Out[$Doc] = New-Object System.Collections.Generic.List[string] }
  if (-not $Out[$Doc].Contains($Hit)) { $Out[$Doc].Add($Hit) }
}

function Get-RuleReadHits($Changes, $AddedLines, $Table = $null) {
  # 事后口径(消费方 = 自审触发判定 RULES 行)。$Changes = @{ Side; Path } 列表(相对基线分叉点的改动面,含删除);
  # $AddedLines = 哈希表 "<Side>|<Path>" -> 新增行列表(只收 RuleReadContentExtRe 的文件;$null = 不判内容)。
  # 回 [ordered] 表:篇 -> List[string] 命中文件;篇按判据表次序,同篇的文件按改动面次序。
  $out = [ordered]@{}
  foreach ($m in (Get-RuleReadMatchers $Table)) {
    # 不套 @():5.1 对 List[object] 形参套 @() 会在绑定器里抛「Argument types do not match」;$null 时 foreach 零次。
    foreach ($c in $Changes) {
      if ($null -eq $c) { continue }
      if ([string]$c.Side -ne [string]$m.Rule.Side) { continue }
      $p = [string]$c.Path
      $hit = ($null -ne $m.Path -and $m.Path.IsMatch($p))
      if (-not $hit -and $null -ne $m.Content -and $null -ne $AddedLines) {
        $lines = $AddedLines[[string]$c.Side + "|" + $p]
        if ($null -ne $lines) { foreach ($l in $lines) { if ($m.Content.IsMatch([string]$l)) { $hit = $true; break } } }
      }
      if ($hit) { Add-RuleReadHit $out ([string]$m.Rule.Doc) $p }
    }
  }
  return $out
}

function Get-RuleReadPrefixHits([string]$Side, [string[]]$Prefixes, [string[]]$Tracked, $Out = $null, $Table = $null) {
  # 事前口径(消费方 = 槽位领取「开工前读」)。$Prefixes = 调用方给的该仓改动范围前缀,读法同领取重叠比对:目录边界、
  # 不分大小写、\ 与 / 等价、尾斜杠不计;$Tracked = 该仓已跟踪文件(git ls-files,仓根相对)。一条前缀命中某条判据 =
  # 前缀本身或其下任一已跟踪文件命中 PathRe,或前缀落在 DirRe 面内;不看内容(事前没有 diff)。命中项记调用方给的前缀原文。
  # 结果并进 $Out(缺省新建),形态同 Get-RuleReadHits;两仓各调一次、共用一个 $Out 即得双仓合并结果(篇按调用先后,
  # 同一次调用内按判据表次序)。
  if ($null -eq $Out) { $Out = [ordered]@{} }
  $items = New-Object System.Collections.Generic.List[object]
  foreach ($p in @($Prefixes)) {
    $raw = ([string]$p).Trim()
    $pn = $raw.Replace('\', '/').TrimEnd('/')
    if (-not $pn) { continue }
    $under = New-Object System.Collections.Generic.List[string]
    foreach ($f in @($Tracked)) {
      $fs = [string]$f
      if ($fs -and ([string]::Equals($fs, $pn, [System.StringComparison]::OrdinalIgnoreCase) -or $fs.StartsWith($pn + "/", [System.StringComparison]::OrdinalIgnoreCase))) { $under.Add($fs) }
    }
    $items.Add(@{ Raw = $raw; Norm = $pn; Under = $under })
  }
  if ($items.Count -eq 0) { return $Out }
  foreach ($m in (Get-RuleReadMatchers $Table)) {
    if ([string]$m.Rule.Side -ne $Side) { continue }
    foreach ($it in $items) {
      $hit = ($null -ne $m.Dir -and $m.Dir.IsMatch($it.Norm))
      if (-not $hit -and $null -ne $m.Path) {
        $hit = $m.Path.IsMatch($it.Norm)
        if (-not $hit) { foreach ($f in $it.Under) { if ($m.Path.IsMatch($f)) { $hit = $true; break } } }
      }
      if ($hit) { Add-RuleReadHit $Out ([string]$m.Rule.Doc) $it.Raw }
    }
  }
  return $Out
}

function Get-RepoTrackedPaths([string]$Root) {
  # 该仓已跟踪文件(仓根相对,非 ASCII 不转义、去引号)。查询失败照 Get-GitLinesChecked 抛。
  $lines = Get-GitLinesChecked $Root "-c core.quotepath=false ls-files"
  $out = New-Object System.Collections.Generic.List[string]
  foreach ($l in $lines) { $v = ([string]$l).Trim().Trim('"'); if ($v) { $out.Add($v) } }
  return , $out.ToArray()
}

function Get-RuleReadTableGap([string]$ClientRepo, [string]$FantasyRepo, [string]$DocRoot, $Table = $null) {
  # 判据表防改名漂移的自检(消费方 = 自审触发判定.ps1 -CheckRuleTable)。只读:两仓各一次 git ls-files,再读已跟踪的
  # .cs / .prefab 找内容判据的命中(先 .cs 后 .prefab,各支都有着落即停)。.cs 只认**代码**:经 hook函数库
  # ConvertTo-CsCodeOnly 抹掉注释与字面量后再匹配——API 改名后注释常留着旧名,按原文核会让这一支靠旧注释照报 PASS;
  # .prefab 按原文。$DocRoot = 篇路径的基(主工程 Demo);$Table 缺省 = RuleReadTable(测试注入小表用)。
  # 回缺口描述数组,空 = 每篇存在,且 PathRe / DirRe / ContentRe 的**每个元素**在其所属仓的已跟踪文件里至少命中一个
  # (内容判据按上句口径;按元素核,不按字段核:字段内别的元素命中不抵这一支落空),且没有元素含顶层 `|`
  # (该拆成两个元素)。Ahead 预置支反过来:零命中放过,有命中报缺口(该撤标了);Ahead 里列了表里没有的串报缺口。
  # 仓不存在、git 查询失败抛出,由调用方判 INFRA。
  if ($null -eq $Table) { $Table = $script:RuleReadTable }
  $gap = New-Object System.Collections.Generic.List[string]
  foreach ($doc in @($Table | ForEach-Object { [string]$_.Doc } | Select-Object -Unique)) {
    if (-not [System.IO.File]::Exists((Join-Path $DocRoot $doc))) { $gap.Add($doc + " 篇不存在(相对 " + $DocRoot + ")") }
  }
  foreach ($r in $Table) {
    $all = @(foreach ($k in @("PathRe", "DirRe", "ContentRe")) { @($r[$k]) | Where-Object { $_ } | ForEach-Object { [string]$_ } })
    foreach ($a in @(@($r.Ahead) | Where-Object { $_ } | ForEach-Object { [string]$_ })) {
      if ($all -cnotcontains $a) { $gap.Add([string]$r.Doc + " Ahead 列的 '" + $a + "' 不是本条判据里的元素(原样照抄判据串)") }
    }
  }
  $repos = @{ client = $ClientRepo; server = $FantasyRepo }
  $matchers = Get-RuleReadMatchers $Table
  foreach ($side in @("client", "server")) {
    $mine = @($matchers | Where-Object { [string]$_.Rule.Side -eq $side })
    if ($mine.Count -eq 0) { continue }
    $root = [string]$repos[$side]
    if (-not $root -or -not (Test-Path -LiteralPath (Join-Path $root ".git"))) { throw ($side + " 仓不在或不是 git 仓:" + $root) }
    $tracked = Get-RepoTrackedPaths $root
    $pending = New-Object System.Collections.Generic.List[object]
    foreach ($m in $mine) {
      $tag = [string]$m.Rule.Doc + " [" + $side + "] "
      $ahead = @(@($m.Rule.Ahead) | Where-Object { $_ } | ForEach-Object { [string]$_ })
      foreach ($k in @("Path", "Dir", "Content")) {
        $parts = $m.Parts[$k]
        for ($i = 0; $i -lt $parts.Count; $i++) {
          $rx = $parts[$i]
          $label = $k + "Re[" + $i + "] '" + $rx.ToString() + "'"
          $isAhead = $ahead -ccontains $rx.ToString()
          $aheadMsg = $tag + $label + " 是 Ahead 预置支但已有着落:从 Ahead 撤掉"
          if (Test-RegexTopLevelAlternation $rx.ToString()) { $gap.Add($tag + $label + " 含顶层 |:拆成两个元素,每支单独核着落") }
          if ($k -eq "Content") { $pending.Add(@{ Rx = $rx; Ahead = $isAhead; AheadMsg = $aheadMsg; Msg = ($tag + $label + " 在已跟踪的 .cs(代码,不含注释与字面量)/ .prefab 里零命中") }); continue }
          $found = $false
          foreach ($f in $tracked) { if ($rx.IsMatch($f)) { $found = $true; break } }
          if ($isAhead) { if ($found) { $gap.Add($aheadMsg) } }
          elseif (-not $found) { $gap.Add($tag + $label + " 在已跟踪文件里零命中") }
        }
      }
    }
    if ($pending.Count -eq 0) { continue }
    $files = @($tracked | Where-Object { $_ -match '\.cs$' }) + @($tracked | Where-Object { $_ -match '\.prefab$' })
    foreach ($f in $files) {
      if ($pending.Count -eq 0) { break }
      $full = Join-Path $root $f
      if (-not [System.IO.File]::Exists($full)) { continue }
      $text = ""
      try { $text = [System.IO.File]::ReadAllText($full) } catch { continue }
      # 原文先筛:原文里一支都不中的文件不再去噪,省掉逐文件去噪(它按每段注释 / 字面量回调一次)。去噪只把注释 /
      # 字面量换成空格,含 \s* 的判据在跨注释才连上的写法(如 [Window(/*x*/UILayer.X)])会因此漏认,方向是多报缺口。
      $any = $false
      foreach ($p in $pending) { if ($p.Rx.IsMatch($text)) { $any = $true; break } }
      if (-not $any) { continue }
      if ($f -match '\.cs$') { $text = ConvertTo-CsCodeOnly $text }
      for ($i = $pending.Count - 1; $i -ge 0; $i--) {
        if ($pending[$i].Rx.IsMatch($text)) { if ($pending[$i].Ahead) { $gap.Add([string]$pending[$i].AheadMsg) }; $pending.RemoveAt($i) }
      }
    }
    foreach ($p in $pending) { if (-not $p.Ahead) { $gap.Add([string]$p.Msg) } }
  }
  return , $gap.ToArray()
}
