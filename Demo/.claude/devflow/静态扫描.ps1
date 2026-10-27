# 静态扫描.ps1 — .claude 下 PowerShell 脚本的结构性静态检查(秒级、纯解析、不跑任何被测逻辑)。
# 承载「规则文档写了但此前无机器强制」的那几条:副本禁令与区域敏感比较禁令。新增同类规则往里加,
# 不另开脚本——静态检查散成多个入口后,漏挂哪个都不会有人发现。
#
# 规则:
#   R1 影子定义 — 非库文件定义了共享库已有的函数名。副本必与正本漂移(实发:槽位交付 内联
#                 复制 Get-FlowEngine 时丢了引擎取不到时的回退分支)。
#   R2 同体副本 — 同一段函数体出现在两个及以上文件。
#   R3 区域敏感比较 — 字符串定位/大小写转换未固定为 Ordinal / Invariant。
#   R4 悬空变量   — 引用了全树从未赋值的 $script: 变量(重构删了赋值、漏改引用点)。
#   R5 孤儿脚本   — 脚本无任何调用点。写好却没接上调用点的脚本永不执行,它承载的义务静默落空,
#                 而台账与头注仍宣称它在生效(实发:临时测试清理 功能完整、退出码齐备、提交检查
#                 甚至为它留了树漂移容忍度,但交付流程从未调用它,临时测试逐批累积在槽位里)。
#                 「调用点」只认:另一脚本的代码(非注释)里出现其文件名、.bat / settings*.json 引用、
#                 在 $EntryAllow(会话 / 人工直接调用的入口,附理由)里;测试套件只认 run_tests 的
#                 $Suites 登记。文档、台账、注释里的提及不算——那正是上面实发的形态(台账写着、头注
#                 写着、就是没人调);测试套件对被测脚本的调用也不算生产调用点。
#   R6 写死引擎路径 — 脚本里出现带盘符 / Program Files 的 pwsh|powershell 全路径字面量。
#                 写死的路径一旦在别的机器上不存在,子进程调用整片静默失效;取引擎一律 Get-FlowEngine。
#   R7 编码钉散落 — 共享库以外的脚本自行赋 [Console]::OutputEncoding。该属性在 5.1 下同时管
#                 解码与编码,只钉部分脚本会在脚本边界打破往返抵消、反而暴露乱码(实发:占用面板 -Json)。
#   R8 位置绑定未关 — 写入口缺 [CmdletBinding(PositionalBinding=$false)]。不关则裸 token 静默
#                 绑到首个参数(交付脚本上就是推错仓 / 交付错槽)。
#   R9 CheckOnly 覆盖 — 写入口既不在 $CheckOnlyRequired 也不在 $CheckOnlyExempt 里 = 新增入口
#                 未就「要不要 -CheckOnly」做决定;登记为 Required 却没有该参数同样违规。
#   R10 非 .ps1 脚本 — devflow 下新增 .bat/.sh/.py/.cmd(既有两个 .bat 在 $NonPs1Allow 里豁免)。
#   R11 清单参数无文件形态 — 会话直接调用的写入口有 [string[]] 参数却无配对的 -XxxFile。
#                 数组传给原生进程时在 argv 层展平、结构不可恢复(先例:槽位领取 -PathsFile)。
#   R12 槽位上界失配 — flow-config 的 SlotCount 与 SlotRootRe 字符类上界不同值。两者是同一事实
#                 的两份表达(前者定槽位数,后者定哪些 -devN 目录按受管槽位处理),漏改一处的症状是
#                 高号槽位被当成主仓:提交检查与单仓提交按主仓通道判,槽位归一也失效。
#   R13 绕过唯一出口 — 登记表($SoleExitRules)里声明的模块中,除唯一出口函数外还有别处直接调
#                 那个被封装的底层写调用。收敛出口是为了让保护自动生效,绕过它不报错、静默
#                 损坏照旧(实发:luban_helper 的 openpyxl 存盘会清空公式单元格的缓存值,而
#                 Luban 与各静态扫描读的正是缓存值,building 的 zone_id 110 行里 100 行变空)。
#                 本条是全脚本唯一扫 .py 的规则:被收敛的出口在哪种语言里,判据就得跟到哪。
#   R14 EAP=Stop 直调收 stderr — 顶层 EAP=Stop 的脚本里 `& <子进程> ... 2>&1`,不在 try 块内、所在函数
#                 也没把 EAP 降为 Continue。5.1 下子进程任一行 stderr 即抛 NativeCommandError,子流程的
#                 VERDICT 随之丢失、被读成 INFRA(实发 0039a335d)。起子脚本走 hook函数库 Invoke-FlowChild。
#   R15 逗号包裹返回接管道 — 以 `return , $x` 防解包的函数(全树自动收集),其结果直接作多段管道的首段,
#                 或作 @() 的唯一内容。前者整组当一个对象流过(ForEach 里 [string] 拼成一个空格串、
#                 Where-Object 整组放行),后者得「元素是数组的 1 元数组」,Count 恒 1(实发 8565e6e03、
#                 提交检查 未跟踪清单)。先括号求值再入管道:`(Get-GitLines ...) | ...`;直接赋值不套 @()。
#   R16 merge --abort 绕过出口 — git 参数串以 `merge --abort` 开头而不在 Invoke-MergeAbort 里。abort 成败
#                 须按现场核实(MERGE_HEAD 与未合并路径),丢掉结果照报「已中止」会让会话落在半合并的树上
#                 (实发 ecd9b29ea)。R14-R16 / R18 只扫 devflow 产品脚本,tests\ 下夹具有意制造这些形态。
#   R17 文档副本回涨 — devflow\README.md 与 obligation-ledger.md 的表格行超过行长上限($DocRowCaps)。
#                 本条是全脚本唯一扫 .md 的规则:它防的是文档复述脚本行为,判据只能落在文档上。
#   R18 运行态路径绕过解析 — 读 $env:LOCALAPPDATA 而不在 hook函数库 Resolve-WfStatePath / Get-ClaudePackageDirs
#                 里(豁免表 $LadReadAllow)。桌面端 MSIX 容器把容器内的新建项重定向进包目录,直拼的路径在
#                 容器内外是两份文件,看板 / 遥测无声分裂(实发 2026-09-27:Unity 槽位面板恒读旧看板)。
#
# R6-R11 的规约正本 = .claude/rules-ondemand/script-authoring.md;此处只承载判据。
# R12 判的是 flow-config 内部一致性,R13 判的是登记模块的出口收敛,判据与规约均同在此处。
# R8/R9/R11 的「写入口」= devflow 根目录下、代码里有写动作($GitWriteRe 等,见 Get-WriteEvidence)
# 或文件名不含只读类字样($ReadOnlyNameRe)的脚本。内容判定为主:名字带「检查」的写脚本不再躲得过
# (实发:工作流通路检查 有写动作,PositionalBinding 靠手工补上)。文件名字典只作辅助,
# 只能把脚本加进视野、不能把有写动作的脚本豁免出去——内容判定看不穿间接写(经子脚本、经未登记的
# 封装函数),名字非只读的脚本仍按写入口处理。
#
# R1/R2 判重按「参数表 + 函数体」的 token 流(去注释、归一空白),不按函数名:
#   - Write-F / WF / Write-File 这类同体异名会被判重(它们就是副本);
#   - New-Fixture 这类同名异体不误报(各套件建各自的夹具,同名是巧合不是重复)。
#   只抓完全同体;改了个键名的近似副本 token 流已不同,仍要靠人审。
#
# R3 的由来:String 的 StartsWith/EndsWith/IndexOf/LastIndexOf(string 重载)与 ToLower/ToUpper
#   默认按**当前区域**比较,同一段代码在不同 .NET 实现上给不同答案。实测 交付历史 的排序键:
#   `$key.IndexOf("`0")` 在 PS 5.1(.NET Framework / NLS)回 10、在 pwsh 7(.NET / ICU,NUL 属
#   可忽略字符)回 0,后者把路径整体切错。它在 5.1 上碰巧正确,等于把「引擎永远是 5.1」当成了
#   正确性前提。故一律显式传 StringComparison / 用 Invariant 变体。
#
# 用法: 静态扫描.ps1 [-Root <扫描根>]   缺省 = 本脚本上级目录(.claude)
# 扫描面:$Root 下全部文件,不含 $Root 直属的 worktrees\(见 $ScanExcludeDirs)。
# 退出码:0 无违规;1 有违规;2 infra 错。
[CmdletBinding(PositionalBinding=$false)]
param([string]$Root = "")
$ErrorActionPreference = "Stop"

if (-not $Root) { $Root = Split-Path $PSScriptRoot -Parent }
if (-not (Test-Path $Root)) { Write-Host "STATIC SCAN : INFRA - root not found: $Root"; exit 2 }
$Root = [System.IO.Path]::GetFullPath($Root)

# 扫描面的唯一枚举入口:各规则一律从 $scanFiles / $ps1Files 取文件,不各自对 $Root 递归枚举——
# 枚举散在各规则里时,排除口径漏改哪一处都不会有人发现。
# $Root 直属的 worktrees\ 整目录不进扫描面、也不下探:桌面端给会话开的 git worktree 落在
# .claude\worktrees\<名>\,是带整份 .claude 副本的整仓检出,扫进来每个函数都成「主仓一份 + 副本一份」
# (实发 2026-10-07:主工作树报 628 条,其中 627 条来自副本)。副本由该 worktree 内自跑本脚本覆盖。
# 语法自检.ps1 无参全量取同一口径,改这里时同步改那边。
$ScanExcludeDirs = @("worktrees")
$scanFiles = New-Object System.Collections.Generic.List[System.IO.FileInfo]
foreach ($top in (Get-ChildItem -LiteralPath $Root)) {
  if (-not $top.PSIsContainer) { $scanFiles.Add($top); continue }
  if ($ScanExcludeDirs -contains $top.Name) { continue }
  foreach ($f in (Get-ChildItem -LiteralPath $top.FullName -Recurse -File)) { $scanFiles.Add($f) }
}
$ps1Files = @($scanFiles | Where-Object { $_.Extension -eq ".ps1" } | Sort-Object FullName)

# 共享库正本(相对 $Root)。新增共享库须在此登记,否则它的函数会被 R2 当成普通重复。
$LibRel = @(
  "devflow\hooks\hook函数库.ps1",
  "devflow\hooks\校验库.ps1",
  "devflow\hooks\xlsx读取库.ps1",
  "devflow\tests\测试夹具库.ps1"
)
$libFull = @($LibRel | ForEach-Object { [System.IO.Path]::GetFullPath((Join-Path $Root $_)) })

# 函数体过短的不判重:`{ return $x }` 一类一行封装撞车是巧合,报出来只是噪音。
$MinTokens = 8

# R3 覆盖面:前四个须显式传 StringComparison,后两个须换 Invariant 变体。
$CompareMembers = @("StartsWith", "EndsWith", "IndexOf", "LastIndexOf")
$CaseMembers    = @("ToLower", "ToUpper")

# R6:只禁带盘符 / Program Files 的引擎全路径;裸 `powershell.exe` 是合法写法(settings.json 的
# hook 入口与内联命令模板都用裸名,靠 PATH 解析,换机不失效)。
$EngineLiteralRe = '(?i)([a-z]:\\[^"'']*(pwsh|powershell)\.exe|program files[^"'']*(pwsh|powershell)\.exe)'

# R7:编码钉的唯一正本。tests\ 下另行豁免:各套件点源夹具库(经它点源本库,已钉)之后又各自钉一次,
# 属存量冗余;撤豁免须先删掉这些自钉。
$EncodingPinAllow = @("devflow\hooks\hook函数库.ps1")

# R18:可直读 $env:LOCALAPPDATA 的出口函数与豁免文件(值 = 理由)。豁免只收不取 claude-wf-3b 运行态路径的用法。
$LadExitFuncs = @("Resolve-WfStatePath", "Get-ClaudePackageDirs")
$LadReadAllow = @{
  "devflow\run_tests.ps1" = "哨兵隔离:换 / 还原 LOCALAPPDATA 本身"
  "devflow\漂移取证.ps1"  = "UnityMCP 日志目录,不属 claude-wf-3b,读写同在会话侧"
}

# R8/R9/R11 的入口面辅助判据:文件名不含只读类字样的 devflow 根目录脚本按写入口处理;名字含只读字样的
# 仍要过 Get-WriteEvidence 的内容判定,有写动作即进视野。词典收的是只读语义的动词。「判定」与「核对/检查/校验」同类(读现状、出结论、不落写),
# 2026-08-21 补入——在此之前 自审触发判定.ps1 被判成写入口、要求登记 R9 CheckOnly,而登记
# 到那张表会把一个纯只读脚本错标成有写动作。词典漏词的修法是补词,不是给只读脚本挂豁免。
# 词典同收英文同义词(panel):被纯 ASCII 的 .bat 调用的脚本,文件名也得是 ASCII(判据见
# bat编码核对.ps1),用不上中文词——先例 slots-panel.ps1。
# 「测试」只认后缀:测试套件名以它结尾,而 临时测试清理.ps1 名中含它却是有删除动作的写入口,
# 按子串匹配会把它滤出 R8/R9/R11 的视野。
$ReadOnlyNameRe = '(自检|扫描|核对|预检|面板|panel|历史|演练|检查|校验|测试$|判定|^run_tests$)'
# 须提供 -CheckOnly 的写入口(会话直接调用的入口 + 认可交付脚本)。
$CheckOnlyRequired = @("单仓提交.ps1", "集成交付.ps1", "槽位置备.ps1", "服务端重启.ps1", "临时测试清理.ps1", "提交钩子安装.ps1")
# 豁免 -CheckOnly 的写入口,值 = 理由(script-authoring「脚本接口设计」的两类不加)。
# 新增写入口必须进这两张表之一,否则 R9 报未登记——这是让「加不加 CheckOnly」成为显式决定。
$CheckOnlyExempt = @{
  "协议导出.ps1"     = "入口内部构件,兼会话直调(devflow-server 实现期先导协议);写的是可重跑覆盖的生成物,无不可逆动作可供 -CheckOnly 预演"
  "归因留痕.ps1"     = "唯一写动作是追加一条遥测,无不可逆动作可供 -CheckOnly 预演"
  "看板.ps1"         = "入口内部构件,兼会话直调(记阻塞);写的是可丢的仓外看板,无不可逆动作可供 -CheckOnly 预演"
  "槽位领取内核.ps1" = "入口内部构件(槽位领取 的实现体,子进程调用)"
  "槽位领取.ps1"     = "探查面由 占用面板.ps1 覆盖,不造第二份"
  "槽位交付.ps1"     = "合并面探查由 合并预检.ps1 覆盖"
  "漂移取证.ps1"     = "只读诊断:唯一写动作是追加自己的仓外日志,无不可逆动作可供 -CheckOnly 预演"
  "重建csproj.ps1"   = "缺省即只判零写入;唯一写动作是 -InPlace 显式重写过期 csproj(gitignore 的 Unity 生成物),不碰源码与 git"
  "工作流通路检查.ps1" = "真环境 canary:写动作(真领取 / 释放槽位、落临时简报)即被测通路本身,-CheckOnly 无可预演"
  "投放可达性核对.ps1" = "只读核对,唯一写动作是按调用方显式传的 -Json 落报告文件"
  "Editor程序集编译.ps1" = "客户端自检的一道(只读检查),唯一写动作是编译产物落 gitignore 的 Temp/obj;无不可逆动作可供 -CheckOnly 预演,加了反而稀释「带 -CheckOnly = 有副作用」这一信号"
}
# R11 只管会话直接调用的入口:内部构件由父脚本按自己的约定传参,不经会话侧 argv,不要求 File 形态。
# (曾以「槽位领取 把清单以逗号连成单实参喂 槽位领取内核」作先例,该走法已废——经 -File 起子进程时
# [string[]] 绑定不按逗号拆分,多条路径会退化成一条长串使重叠比对恒不命中;清单现走 -PathsFile。)
$EntryInternal = @("槽位领取内核.ps1")

# R10:devflow 下既有的两个 .bat(人工双击入口),规则只拦新增。
$NonPs1Allow = @("test.bat", "槽位.bat")
$NonPs1ScriptExt = @(".bat", ".cmd", ".sh", ".py", ".js")

# R8/R9/R11 内容判据:写动作三类——git 写子命令、文件系统写、调用已知写入口。
# git 子命令只认子命令位(native git 跳过 -C/-c 等前置选项;封装函数看字符串实参的开头),
# 故 merge-base / merge-tree / log 这类只读子命令不误判。
$GitWriteRe = '^(commit|push|pull|merge|reset|checkout|switch|restore|rebase|cherry-pick|revert|stash|clean|rm|mv|add|am|apply|tag|update-ref|worktree\s+(add|remove|prune|move|repair)|branch\s+-\S*[dDmMcCf])(\s|$)'
$GitCallers = @("git", "git.exe", "Invoke-GitMerged", "Get-GitLines", "Get-GitLinesRaw", "Get-GitOne")
# 不收 Publish-GateTicket:检查凭据是自检类的产出物(落 gitignore 的 .gate/),script-authoring 明示
# 自检 / 扫描 / 核对类为只读脚本、不加 -CheckOnly;收进来会把 客户端自检 / 服务端自检 判成写入口。
$FileWriteCmdlets = @("Set-Content", "Add-Content", "Out-File", "Clear-Content", "Remove-Item", "Move-Item",
                      "Rename-Item", "Copy-Item", "New-Item", "Export-Csv", "Export-Clixml")
# 文件写的目标若源自临时目录(只读检查常把 git 输出落临时文件再删)不算写动作。
$TempMarkerRe = '(?i)(\$env:(TEMP|TMP)\b|GetTempPath|GetTempFileName|New-TemporaryFile)'
# 输出类命令里出现写入口的名字是提示文案,不是调用。
$MessageCmdlets = @("Write-Host", "Write-Output", "Write-Warning", "Write-Error", "Write-Verbose", "Write-Information")
$IoWriteMembers = @("WriteAllText", "WriteAllLines", "WriteAllBytes", "AppendAllText", "AppendAllLines", "AppendText",
                    "Delete", "Move", "Copy", "Replace", "CreateDirectory", "Create", "CreateText")
# 已知写入口:调用它们的脚本本身即有写动作。成员 = 有 -CheckOnly 的入口 + 交付 / 领取两入口与其内核。
$KnownWriteEntries = @($CheckOnlyRequired) + @("槽位交付.ps1", "槽位领取.ps1", "槽位领取内核.ps1", "协议导出.ps1")
# 内容判定的已知假阳性:写目标确属临时区、但经函数参数传递,临时来源追踪(单函数内赋值链)追不到。
# 登记后该脚本回落到文件名判据;值 = 为什么它的写动作不算。只收经核实的,不作为绕过口。
$WriteEvidenceIgnore = @{
  "run_tests.ps1" = "唯一写动作是 %TEMP% 下哨兵 LOCALAPPDATA 的建删(New-SentinelLad / Remove-Sentinel 经参数传递)"
}

# R5 显式入口白名单:由会话 / 人工 / skill 卡直接调用、没有脚本调用点的入口。值 = 调用方。
# 新增入口须在此登记——让「这个脚本由谁调」成为显式决定,文档提及不再能冒充调用点。
$EntryAllow = @{
  "槽位领取.ps1"       = "devflow 通道 Agent 入口"
  "槽位交付.ps1"       = "devflow 通道 Agent 入口"
  "单仓提交.ps1"       = "主工程 / 人工入库通道 Agent 入口"
  "客户端自检.ps1"     = "主工程通道 Agent 入口(槽位交付 亦调用)"
  "服务端自检.ps1"     = "主工程通道 Agent 入口"
  "语法自检.ps1"       = "script-authoring 收尾必跑"
  "静态扫描.ps1"       = "run_tests 静态前置 / 人工"
  "简报校验.ps1"       = "devflow 卡需求审计段"
  "自审触发判定.ps1"   = "devflow 卡自审段 / devflow-check 检查项 6"
  "合并丢失核对.ps1"   = "devflow 卡自审条件项 / 人工"
  "归因留痕.ps1"       = "devflow 卡四类归因(defect-attribution 留痕)"
  "理由对齐核对.ps1"   = "devflow-check / rules-audit 卡"
  "记忆索引核对.ps1"   = "rules-audit 卡 M1"
  "重建csproj.ps1"     = "devflow-client 卡自检节(单独判定)"
  "漂移取证.ps1"       = "unity-check 卡诊断 / 人工"
  "交付历史.ps1"       = "人工 / 会话查询"
  "检查命中面板.ps1"   = "devflow-check 卡检查项 5(零命中与护栏恒降级复核)/ 人工"
  "占用面板.ps1"       = "会话查询(slots-panel 亦调用)"
  "合并预检.ps1"       = "会话查询"
  "服务端重启.ps1"     = "人工(集成交付 亦调用)"
  "槽位置备.ps1"       = "人工一次性置备"
  "提交钩子安装.ps1"   = "人工一次性安装(新克隆 / 换机器后装 git 提交前钩子)"
  "hook演练.ps1"       = "script-authoring 验收:hook 回归演练"
  "崩溃栈符号化.ps1"   = "人工排障工具(troubleshooting.md)"
  "热更AOT体检.ps1"    = "人工出包前体检工具(scripts/README.md)"
}

# 返回写动作证据串(首个命中,形如 "git commit @L12");无写动作返回空串。
function Get-TempVarNames($Ast) {
  # 源自临时目录的变量名集合:赋值右侧(或 foreach 的集合)含临时目录标记、或引用了已知临时变量,
  # 迭代到不动点(`$tmp = Join-Path $env:TEMP ..; $f = Join-Path $tmp ..` 两级都收)。
  $pairs = New-Object System.Collections.Generic.List[object]
  foreach ($a in $Ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.AssignmentStatementAst] }, $true)) {
    if ($a.Left -is [System.Management.Automation.Language.VariableExpressionAst]) {
      $pairs.Add(@([string]$a.Left.VariablePath.UserPath, $a.Right.Extent.Text))
    }
  }
  foreach ($fe in $Ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.ForEachStatementAst] }, $true)) {
    $pairs.Add(@([string]$fe.Variable.VariablePath.UserPath, $fe.Condition.Extent.Text))
  }
  $temp = New-Object System.Collections.Generic.HashSet[string] ([System.StringComparer]::OrdinalIgnoreCase)
  do {
    $grew = $false
    foreach ($p in $pairs) {
      if ($temp.Contains($p[0])) { continue }
      if (Test-TempText $p[1] $temp) { [void]$temp.Add($p[0]); $grew = $true }
    }
  } while ($grew)
  return , $temp
}
function Test-TempText([string]$Text, $TempVars) {
  if ($Text -match $TempMarkerRe) { return $true }
  foreach ($m in [regex]::Matches($Text, '\$(?:script:|local:)?([A-Za-z_]\w*)')) {
    if ($TempVars.Contains($m.Groups[1].Value)) { return $true }
  }
  return $false
}

function Get-WriteEvidence($Ast, [string]$SelfName) {
  $tempVars = Get-TempVarNames $Ast
  $cmds = $Ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.CommandAst] }, $true)
  foreach ($c in $cmds) {
    $name = $c.GetCommandName()
    if (-not $name) { continue }
    $line = $c.Extent.StartLineNumber
    if ($FileWriteCmdlets -contains $name) {
      $argText = (@($c.CommandElements | Select-Object -Skip 1 | ForEach-Object { $_.Extent.Text }) -join " ")
      if (Test-TempText $argText $tempVars) { continue }
      return ($name + " @L" + $line)
    }
    $els = @($c.CommandElements)
    if ($name -eq "git" -or $name -eq "git.exe") {
      # 跳过前置选项(-C <dir> / -c <k=v> 带值,其余 -x 不带值),取子命令位及其后。
      $i = 1
      while ($i -lt $els.Count) {
        $t = $els[$i].Extent.Text
        if ($t -eq "-C" -or $t -eq "-c") { $i += 2; continue }
        if ($t.StartsWith("-", [System.StringComparison]::Ordinal)) { $i++; continue }
        break
      }
      if ($i -lt $els.Count) {
        $rest = (@($els[$i..($els.Count - 1)] | ForEach-Object { $_.Extent.Text.Trim('"', "'") }) -join " ")
        if ($rest -match $GitWriteRe) { return ("git " + ($rest -split '\s+')[0] + " @L" + $line) }
      }
      continue
    }
    if ($GitCallers -contains $name -or $name -eq "cmd" -or $name -eq "cmd.exe") {
      foreach ($e in $els) {
        $v = $null
        if ($e -is [System.Management.Automation.Language.StringConstantExpressionAst] -or
            $e -is [System.Management.Automation.Language.ExpandableStringExpressionAst]) { $v = [string]$e.Value }
        if (-not $v) { continue }
        if ($name -like "cmd*") {
          $m = [regex]::Match($v, '\bgit(?:\.exe)?\s+(?:-[Cc]\s+\S+\s+)*(?<sub>.*)$')
          if ($m.Success -and $m.Groups['sub'].Value -match $GitWriteRe) { return ("git " + ($m.Groups['sub'].Value -split '\s+')[0] + " @L" + $line) }
        }
        else {
          $sub = ($v.Trim() -replace '^(-[Cc]\s+\S+\s+)+', '')
          if ($sub -match $GitWriteRe) { return ("git " + ($sub -split '\s+')[0] + " @L" + $line) }
        }
      }
    }
  }
  $members = $Ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.InvokeMemberExpressionAst] }, $true)
  foreach ($mb in $members) {
    if (-not $mb.Static) { continue }
    $member = [string]$mb.Member.Value
    if ($IoWriteMembers -notcontains $member) { continue }
    $typeName = ""
    if ($mb.Expression -is [System.Management.Automation.Language.TypeExpressionAst]) { $typeName = $mb.Expression.TypeName.FullName }
    if ($typeName -match '^(System\.)?(IO\.)?(File|Directory)$') {
      $argText = ""
      if ($mb.Arguments -and $mb.Arguments.Count -gt 0) { $argText = $mb.Arguments[0].Extent.Text }
      if (Test-TempText $argText $tempVars) { continue }
      return ("[" + $typeName + "]::" + $member + " @L" + $mb.Extent.StartLineNumber)
    }
  }
  # 已知写入口的名字只在「命令调用的上下文」里算调用(& / -File / Join-Path 实参),
  # 登记表、哈希键、提示文案里的同名字符串不算。
  $strs = $Ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.StringConstantExpressionAst] -or
                                   $n -is [System.Management.Automation.Language.ExpandableStringExpressionAst] }, $true)
  foreach ($s in $strs) {
    $cmdAnc = $s.Parent
    while ($cmdAnc -and -not ($cmdAnc -is [System.Management.Automation.Language.CommandAst])) { $cmdAnc = $cmdAnc.Parent }
    if (-not $cmdAnc) { continue }
    if ($MessageCmdlets -contains $cmdAnc.GetCommandName()) { continue }
    $v = [string]$s.Value
    foreach ($we in $KnownWriteEntries) {
      if ($we -eq $SelfName) { continue }
      if ($v.IndexOf($we, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) { return ("调用 " + $we + " @L" + $s.Extent.StartLineNumber) }
    }
  }
  return ""
}

function Get-TokenText([string]$Snippet) {
  $t = $null; $e = $null
  [void][System.Management.Automation.Language.Parser]::ParseInput($Snippet, [ref]$t, [ref]$e)
  $keep = @($t | Where-Object { $_.Kind -ne 'Comment' -and $_.Kind -ne 'NewLine' -and $_.Kind -ne 'EndOfInput' } |
    ForEach-Object { $_.Text })
  return , $keep
}

$entries = New-Object System.Collections.Generic.List[object]
$cultureHits = New-Object System.Collections.Generic.List[object]
$svReads = New-Object System.Collections.Generic.List[object]   # R4:$script: 变量的读取点
$svWritten = @{}                                                # R4:全扫描范围内被赋过值的名字
$engineHits = New-Object System.Collections.Generic.List[object]  # R6
$encHits    = New-Object System.Collections.Generic.List[object]  # R7
$entryFacts = New-Object System.Collections.Generic.List[object]  # R8/R9/R11:写入口的 param 契约
$codeTexts  = @{}                                                 # R5:各脚本去注释后的代码文本
$stderrHits = New-Object System.Collections.Generic.List[object]  # R14
$commaFuncs = @{}                                                 # R15:以 `return ,` 返回的函数名
$commaUses  = New-Object System.Collections.Generic.List[object]  # R15:候选使用点(循环后按 $commaFuncs 过滤)
$abortHits  = New-Object System.Collections.Generic.List[object]  # R16
$ladHits    = New-Object System.Collections.Generic.List[object]  # R18
function Get-EnclosingFunc($Node) {
  $n = $Node.Parent
  while ($n) { if ($n -is [System.Management.Automation.Language.FunctionDefinitionAst]) { return $n }; $n = $n.Parent }
  return $null
}
function Test-InTry($Node) {
  $n = $Node.Parent
  while ($n) {
    if ($n -is [System.Management.Automation.Language.TryStatementAst]) { return $true }
    if ($n -is [System.Management.Automation.Language.FunctionDefinitionAst]) { return $false }
    $n = $n.Parent
  }
  return $false
}

foreach ($file in $ps1Files) {
  $rel = $file.FullName.Substring($Root.Length).TrimStart('\')
  $tok = $null; $err = $null
  $ast = [System.Management.Automation.Language.Parser]::ParseFile($file.FullName, [ref]$tok, [ref]$err)
  if ($err -and $err.Count -gt 0) {
    Write-Host ("STATIC SCAN : INFRA - parse failed: " + $file.FullName)
    exit 2
  }

  # --- R1/R2 素材:函数定义 ---
  $funcs = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] }, $true)
  foreach ($fn in $funcs) {
    $sigTokens = New-Object System.Collections.Generic.List[string]
    foreach ($p in @($fn.Parameters)) { if ($p) { $sigTokens.AddRange([string[]](Get-TokenText $p.Extent.Text)) } }
    $sigTokens.AddRange([string[]](Get-TokenText $fn.Body.Extent.Text))
    $entries.Add([pscustomobject]@{
      File  = $file.FullName
      Rel   = $rel
      Name  = $fn.Name
      Line  = $fn.Extent.StartLineNumber
      IsLib = ($libFull -contains $file.FullName)
      Count = $sigTokens.Count
      Sig   = ($sigTokens -join ' ')
    })
  }

  # --- R3 素材:实例方法调用 ---
  # 只看实例调用:[Array]::IndexOf 之类的静态调用不是字符串比较,不在此规则内。
  $calls = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.InvokeMemberExpressionAst] }, $true)
  foreach ($c in $calls) {
    if ($c.Static) { continue }
    $member = [string]$c.Member.Value
    if (-not $member) { continue }
    $argText = ""
    if ($c.Arguments) { $argText = (@($c.Arguments | ForEach-Object { $_.Extent.Text }) -join ",") }
    if ($CompareMembers -contains $member) {
      if ($argText -notmatch 'StringComparison') {
        $cultureHits.Add([pscustomobject]@{
          Rel = $rel; Line = $c.Extent.StartLineNumber; Member = $member
          Fix = "补 [System.StringComparison]::Ordinal(或 OrdinalIgnoreCase)"
        })
      }
    }
    elseif ($CaseMembers -contains $member) {
      $cultureHits.Add([pscustomobject]@{
        Rel = $rel; Line = $c.Extent.StartLineNumber; Member = $member
        Fix = "改用 " + $member + "Invariant()"
      })
    }
  }

  # --- R4 素材:$script: 变量的读写点 ---
  # 赋值左侧的变量节点按偏移量记下,其余同名节点即为读取点。
  $writeOffsets = @{}
  $assigns = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.AssignmentStatementAst] }, $true)
  foreach ($a in $assigns) {
    if ($a.Left -is [System.Management.Automation.Language.VariableExpressionAst]) {
      $writeOffsets[$a.Left.Extent.StartOffset] = $true
    }
  }
  $vars = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.VariableExpressionAst] }, $true)
  foreach ($v in $vars) {
    $up = [string]$v.VariablePath.UserPath
    if ($up -notmatch '^script:') { continue }
    $name = $up.Substring(7)
    if (-not $name) { continue }
    if ($writeOffsets.ContainsKey($v.Extent.StartOffset)) { $svWritten[$name] = $true; continue }
    $svReads.Add([pscustomobject]@{ Rel = $rel; Line = $v.Extent.StartLineNumber; Name = $name })
  }

  # --- R6/R7 素材:token 流(排除注释——注释里写出路径或提及 OutputEncoding 不构成违规)---
  foreach ($tk in @($tok | Where-Object { $_.Kind -ne 'Comment' })) {
    if ($tk.Text -match $EngineLiteralRe) {
      $engineHits.Add([pscustomobject]@{ Rel = $rel; Line = $tk.Extent.StartLineNumber; Text = $tk.Text })
    }
    if ($tk.Text -eq 'OutputEncoding' -and ($EncodingPinAllow -notcontains $rel) -and
        ($rel.IndexOf("devflow\tests\", [System.StringComparison]::OrdinalIgnoreCase) -ne 0)) {
      $encHits.Add([pscustomobject]@{ Rel = $rel; Line = $tk.Extent.StartLineNumber })
    }
  }

  # --- R15 素材:逗号包裹返回的函数名(全树,含库与 tests)---
  foreach ($fn in $funcs) {
    $rets = $fn.Body.FindAll({ param($n) $n -is [System.Management.Automation.Language.ReturnStatementAst] }, $true)
    foreach ($r in $rets) {
      if ($r.Pipeline -and ($r.Pipeline.Extent.Text -match '^\s*,')) { $commaFuncs[$fn.Name] = $true; break }
    }
  }

  # --- R14 / R15 / R16 素材:只扫 devflow 产品脚本 ---
  if ($rel -match '^devflow\\' -and $rel -notmatch '^devflow\\tests\\') {
    $fileText = $ast.Extent.Text
    $topStop = ($fileText -match '(?m)^\$ErrorActionPreference\s*=\s*"Stop"')
    if ($topStop) {
      $cmds = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.CommandAst] }, $true)
      foreach ($c in $cmds) {
        if ($c.InvocationOperator -ne 'Ampersand') { continue }
        $merge = @($c.Redirections | Where-Object { $_ -is [System.Management.Automation.Language.MergingRedirectionAst] -and [string]$_.FromStream -eq 'Error' })
        if ($merge.Count -eq 0) { continue }
        if (Test-InTry $c) { continue }
        $fn = Get-EnclosingFunc $c
        if ($fn -and ($fn.Name -eq 'Invoke-FlowChild' -or $fn.Body.Extent.Text -match '\$ErrorActionPreference\s*=\s*"(Continue|SilentlyContinue)"')) { continue }
        $stderrHits.Add([pscustomobject]@{ Rel = $rel; Line = $c.Extent.StartLineNumber })
      }
    }
    $pipes = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.PipelineAst] }, $true)
    foreach ($pl in $pipes) {
      $first = $pl.PipelineElements[0]
      if (-not ($first -is [System.Management.Automation.Language.CommandAst])) { continue }
      $cn = $first.GetCommandName()
      if (-not $cn) { continue }
      if ($pl.PipelineElements.Count -ge 2) {
        $commaUses.Add([pscustomobject]@{ Rel = $rel; Line = $pl.Extent.StartLineNumber; Name = $cn; Kind = "直接接管道" })
        continue
      }
      $par = $pl.Parent
      if ($par -is [System.Management.Automation.Language.StatementBlockAst] -and $par.Statements.Count -eq 1 -and
          $par.Parent -is [System.Management.Automation.Language.ArrayExpressionAst]) {
        $commaUses.Add([pscustomobject]@{ Rel = $rel; Line = $pl.Extent.StartLineNumber; Name = $cn; Kind = "被 @() 包裹" })
      }
    }
    $strs = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.StringConstantExpressionAst] -or $n -is [System.Management.Automation.Language.ExpandableStringExpressionAst] }, $true)
    foreach ($st in $strs) {
      if ([string]$st.Value -notmatch '^\s*merge\s+--abort(\s|$)') { continue }
      $fn = Get-EnclosingFunc $st
      if ($fn -and $fn.Name -eq 'Invoke-MergeAbort') { continue }
      $abortHits.Add([pscustomobject]@{ Rel = $rel; Line = $st.Extent.StartLineNumber })
    }
    if (-not $LadReadAllow.ContainsKey($rel)) {
      $ladVars = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.VariableExpressionAst] -and
                                          [string]$n.VariablePath.UserPath -match '^env:LOCALAPPDATA$' }, $true)
      foreach ($lv in $ladVars) {
        $fn = Get-EnclosingFunc $lv
        if ($fn -and $LadExitFuncs -contains $fn.Name) { continue }
        $ladHits.Add([pscustomobject]@{ Rel = $rel; Line = $lv.Extent.StartLineNumber })
      }
    }
  }

  # --- R5 素材:本脚本的代码文本(去注释)。别的脚本名出现在这里才算调用点 ---
  $codeTexts[$file.FullName] = (@($tok | Where-Object { $_.Kind -ne 'Comment' } | ForEach-Object { $_.Text }) -join "`n")

  # --- R8/R9/R11 素材:devflow 根目录写入口的 param 契约 ---
  $writeEv = ""
  $isEntry = $false
  if ($rel -match '^devflow\\[^\\]+\.ps1$') {
    if (-not $WriteEvidenceIgnore.ContainsKey($file.Name)) { $writeEv = Get-WriteEvidence $ast $file.Name }
    $isEntry = ($writeEv -or $file.BaseName -notmatch $ReadOnlyNameRe)
  }
  if ($isEntry) {
    $pnames = New-Object System.Collections.Generic.List[string]
    $arrays = New-Object System.Collections.Generic.List[string]
    if ($ast.ParamBlock) {
      foreach ($p in @($ast.ParamBlock.Parameters)) {
        $pn = [string]$p.Name.VariablePath.UserPath
        $pnames.Add($pn)
        if ($p.StaticType -and $p.StaticType.IsArray) { $arrays.Add($pn) }
      }
    }
    $posOff = $false
    if ($ast.ParamBlock) {
      foreach ($at in @($ast.ParamBlock.Attributes)) {
        $flat = ($at.Extent.Text -replace '\s', '')
        if ($flat -match '(?i)CmdletBinding\(.*PositionalBinding=\$false') { $posOff = $true }
      }
    }
    $entryFacts.Add([pscustomobject]@{
      Rel = $rel; Name = $file.Name; Params = $pnames; Arrays = $arrays; PosOff = $posOff
      Why = $(if ($writeEv) { "写动作:" + $writeEv } else { "文件名非只读类" })
    })
  }
}

# --- R5 素材:非脚本的调用来源(.bat 与 settings*.json)---
# 文档(.md)不收:提及不是调用点。.bat 去掉 rem / :: 注释行。脚本侧的调用来源 = $codeTexts(已去注释)。
$launcherTexts = @{}
foreach ($f in $scanFiles) {
  $isBat =(@(".bat", ".cmd") -contains $f.Extension.ToLowerInvariant())
  $isSettings = ($f.Extension -eq ".json" -and $f.Name -like "settings*")
  if (-not $isBat -and -not $isSettings) { continue }
  try { $txt = [System.IO.File]::ReadAllText($f.FullName) } catch { $txt = "" }
  if ($isBat) { $txt = (@($txt -split "`n" | Where-Object { $_ -notmatch '^\s*(@?rem\b|::)' }) -join "`n") }
  $launcherTexts[$f.FullName] = $txt
}

$violations = 0

# --- R1 影子定义 ---
$libByName = @{}
foreach ($e in $entries) {
  if (-not $e.IsLib) { continue }
  if (-not $libByName.ContainsKey($e.Name)) { $libByName[$e.Name] = $e }
}
$shadows = @($entries | Where-Object { -not $_.IsLib -and $libByName.ContainsKey($_.Name) })
if ($shadows.Count -gt 0) {
  Write-Host ("R1 影子定义:" + $shadows.Count + " 处非库文件重定义了共享库已有的函数名")
  foreach ($s in ($shadows | Sort-Object Name, Rel)) {
    $src = $libByName[$s.Name]
    Write-Host ("  " + $s.Rel + ":" + $s.Line + "  " + $s.Name + "  (正本 " + $src.Rel + ":" + $src.Line + ")")
  }
  $violations += $shadows.Count
}

# --- R2 同体副本 ---
$dupGroups = @($entries |
  Where-Object { $_.Count -ge $MinTokens } |
  Group-Object Sig |
  Where-Object { @($_.Group | Select-Object -ExpandProperty File -Unique).Count -ge 2 })
if ($dupGroups.Count -gt 0) {
  Write-Host ("R2 同体副本:" + $dupGroups.Count + " 组函数体在多个文件中重复")
  foreach ($g in $dupGroups) {
    $names = @($g.Group | Select-Object -ExpandProperty Name -Unique | Sort-Object) -join " / "
    Write-Host ("  [" + $names + "] " + $g.Group.Count + " 处:")
    foreach ($m in ($g.Group | Sort-Object Rel, Line)) {
      Write-Host ("      " + $m.Rel + ":" + $m.Line + "  " + $m.Name)
    }
  }
  $violations += $dupGroups.Count
}

# --- R3 区域敏感比较 ---
if ($cultureHits.Count -gt 0) {
  Write-Host ("R3 区域敏感比较:" + $cultureHits.Count + " 处字符串调用未固定比较规则")
  foreach ($h in ($cultureHits | Sort-Object Rel, Line)) {
    Write-Host ("  " + $h.Rel + ":" + $h.Line + "  ." + $h.Member + "()  -> " + $h.Fix)
  }
  $violations += $cultureHits.Count
}

# --- R4 悬空 $script: 变量 ---
# 已赋值集合取「扫描范围内全部文件」的并集,不按单文件判:$script:GatedRe(校验库 定义、
# 消费方引用)这类跨文件契约变量在单文件视角下会被误报。
# 本规则抓的是赋值被整个删掉、全树无人再赋的形态——重构删变量却漏改引用点即此形态,
# 它在语法自检下合法、在运行期才炸成 `& $null`(实发:槽位交付 的协议导出调用点)。
$dangling = @($svReads | Where-Object { -not $svWritten.ContainsKey($_.Name) })
if ($dangling.Count -gt 0) {
  Write-Host ("R4 悬空变量:" + $dangling.Count + " 处引用了全树从未赋值的 `$script: 变量")
  foreach ($d in ($dangling | Sort-Object Rel, Line)) {
    Write-Host ("  " + $d.Rel + ":" + $d.Line + "  `$script:" + $d.Name)
  }
  $violations += $dangling.Count
}

# --- R5 孤儿脚本 ---
# 套件的唯一调用点:run_tests.ps1 的 $Suites 存**不带扩展名的中文短名**,调用时才拼成 tests\<名>.ps1,
# 故解析该数组得登记名单。不放宽成「基名匹配」——「看板」这类到处出现的基名会把真孤儿盖住。
$dynamicCited = New-Object System.Collections.Generic.HashSet[string]
# 按文件名在扫描面里找而不是拼死路径:$Root 是扫描根(通常 .claude),run_tests.ps1 住在其下的 devflow\。
$runTestsFile = $ps1Files | Where-Object { $_.Name -eq "run_tests.ps1" } | Select-Object -First 1
if ($runTestsFile) {
  $rtText = [System.IO.File]::ReadAllText($runTestsFile.FullName)
  $suitesMatch = [regex]::Match($rtText, '\$Suites\s*=\s*@\((?<body>[\s\S]*?)\n\)')
  if ($suitesMatch.Success) {
    foreach ($q in [regex]::Matches($suitesMatch.Groups['body'].Value, '"([^"]+)"')) {
      [void]$dynamicCited.Add(($q.Groups[1].Value + ".ps1"))
    }
  }
}

# 测试目录内的脚本分两类:套件(名以「测试」结尾)只认 $Suites;其余(夹具库)按调用点判。
# 测试目录里的调用只算给测试目录内的目标:套件调被测脚本不是生产调用点。
$testsDirRe = '(^|\\)devflow\\tests\\'
$orphans = @()
foreach ($file in $ps1Files) {
  $rel = $file.FullName.Substring($Root.Length).TrimStart('\')
  $inTests =($rel -match $testsDirRe)
  if ($inTests -and $file.BaseName -match '测试$') {
    if (-not $dynamicCited.Contains($file.Name)) { $orphans += ($rel + "  (套件未登记 run_tests `$Suites)") }
    continue
  }
  if ($EntryAllow.ContainsKey($file.Name)) { continue }
  $cited = $false
  foreach ($src in $codeTexts.Keys) {
    if ($src -eq $file.FullName) { continue }   # 自身提到自己的名字不算调用点
    if (-not $inTests -and ($src.Substring($Root.Length).TrimStart('\') -match $testsDirRe)) { continue }
    if ($codeTexts[$src].IndexOf($file.Name, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) { $cited = $true; break }
  }
  if (-not $cited) {
    foreach ($src in $launcherTexts.Keys) {
      if ($launcherTexts[$src].IndexOf($file.Name, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) { $cited = $true; break }
    }
  }
  if (-not $cited) { $orphans += ($rel + "  (无调用点:脚本代码 / .bat / settings 均未引用,也不在 `$EntryAllow)") }
}
if ($orphans.Count -gt 0) {
  Write-Host ("R5 孤儿脚本:" + $orphans.Count + " 个脚本无调用点")
  foreach ($o in ($orphans | Sort-Object)) { Write-Host ("  " + $o) }
  $violations += $orphans.Count
}

# --- R6 写死引擎路径 ---
if ($engineHits.Count -gt 0) {
  Write-Host ("R6 写死引擎路径:" + $engineHits.Count + " 处引擎全路径字面量")
  foreach ($h in ($engineHits | Sort-Object Rel, Line)) {
    Write-Host ("  " + $h.Rel + ":" + $h.Line + "  " + $h.Text + "  -> 改用 Get-FlowEngine")
  }
  $violations += $engineHits.Count
}

# --- R7 编码钉散落 ---
if ($encHits.Count -gt 0) {
  Write-Host ("R7 编码钉散落:" + $encHits.Count + " 处在共享库以外动 OutputEncoding")
  foreach ($h in ($encHits | Sort-Object Rel, Line)) {
    Write-Host ("  " + $h.Rel + ":" + $h.Line + "  -> 点源 " + $EncodingPinAllow[0] + " 取,勿单独钉")
  }
  $violations += $encHits.Count
}

# --- R8 位置绑定未关 ---
$posGaps = @($entryFacts | Where-Object { -not $_.PosOff } | Sort-Object Rel)
if ($posGaps.Count -gt 0) {
  Write-Host ("R8 位置绑定未关:" + $posGaps.Count + " 个写入口缺 PositionalBinding=`$false")
  foreach ($e in $posGaps) { Write-Host ("  " + $e.Rel + "  (" + $e.Why + ")") }
  $violations += $posGaps.Count
}

# --- R9 CheckOnly 覆盖 ---
$coGaps = New-Object System.Collections.Generic.List[string]
foreach ($e in ($entryFacts | Sort-Object Rel)) {
  $required = ($CheckOnlyRequired -contains $e.Name)
  $exempt   = $CheckOnlyExempt.ContainsKey($e.Name)
  if (-not $required -and -not $exempt) {
    $coGaps.Add($e.Rel + "  未登记:新增写入口须进 `$CheckOnlyRequired 或 `$CheckOnlyExempt(附理由)(" + $e.Why + ")")
    continue
  }
  if ($required -and -not ($e.Params -contains "CheckOnly")) {
    $coGaps.Add($e.Rel + "  登记为须提供 -CheckOnly,但 param 里没有")
  }
}
if ($coGaps.Count -gt 0) {
  Write-Host ("R9 CheckOnly 覆盖:" + $coGaps.Count + " 处")
  foreach ($g in $coGaps) { Write-Host ("  " + $g) }
  $violations += $coGaps.Count
}

# --- R10 非 .ps1 脚本 ---
$devFlowPrefix = (Join-Path $Root "devflow") + '\'
$alienFiles = @($scanFiles |
  Where-Object { $_.FullName.StartsWith($devFlowPrefix, [System.StringComparison]::OrdinalIgnoreCase) -and
                 $NonPs1ScriptExt -contains $_.Extension.ToLowerInvariant() -and $NonPs1Allow -notcontains $_.Name } |
  ForEach-Object { $_.FullName.Substring($Root.Length).TrimStart('\') })
if ($alienFiles.Count -gt 0) {
  Write-Host ("R10 非 .ps1 脚本:" + $alienFiles.Count + " 个(devflow 下不新增其他语言)")
  foreach ($a in ($alienFiles | Sort-Object)) { Write-Host ("  " + $a) }
  $violations += $alienFiles.Count
}

# --- R11 清单参数无文件形态 ---
$arrGaps = New-Object System.Collections.Generic.List[string]
foreach ($e in ($entryFacts | Sort-Object Rel)) {
  if ($EntryInternal -contains $e.Name) { continue }
  foreach ($a in $e.Arrays) {
    if (-not ($e.Params -contains ($a + "File"))) {
      $arrGaps.Add($e.Rel + "  -" + $a + " 是数组却无配对的 -" + $a + "File")
    }
  }
}
if ($arrGaps.Count -gt 0) {
  Write-Host ("R11 清单参数无文件形态:" + $arrGaps.Count + " 处")
  foreach ($g in $arrGaps) { Write-Host ("  " + $g) }
  $violations += $arrGaps.Count
}

# --- R12 槽位上界失配 ---
# 唯一一条判配置而非判脚本的规则。psd1 是数据文件,Import-PowerShellDataFile 只解析不执行,
# 不违背本脚本「不跑被测逻辑」的前提。-Root 指向别处(测试夹具)时配置不存在,整条跳过。
# SlotRootRe 换成非 [1-N] 形态时报出来而不是静默放过:解析不出上界 = 本条失去机判能力,
# 那正是需要人知道的时刻。
$flowCfgPath = Join-Path $Root "devflow\flow-config.psd1"
if (Test-Path $flowCfgPath) {
  $flowCfgData = Import-PowerShellDataFile $flowCfgPath
  if ($flowCfgData.SlotCount -and $flowCfgData.SlotRootRe) {
    $reText = [string]$flowCfgData.SlotRootRe
    $upperM = [regex]::Match($reText, '\[1-(\d+)\]')
    if (-not $upperM.Success) {
      Write-Host ("R12 槽位上界:SlotRootRe = '" + $reText + "' 不是 [1-N] 字符类,解析不出上界")
      Write-Host ("  devflow\flow-config.psd1  -> 改回 [1-N] 形态,或同步改本条判据")
      $violations += 1
    }
    elseif ([int]$upperM.Groups[1].Value -ne [int]$flowCfgData.SlotCount) {
      Write-Host ("R12 槽位上界:SlotRootRe 上界 " + $upperM.Groups[1].Value + " != SlotCount " + $flowCfgData.SlotCount)
      Write-Host ("  devflow\flow-config.psd1  -> 两处须同值,否则高号槽位不按受管槽位处理")
      $violations += 1
    }
  }
}

# --- R13 绕过唯一出口 ---
# 某个底层写调用被收敛成模块内唯一出口后,新代码直接调那个底层调用就绕过了出口里的保护,
# 而绕过不会报错——正是收敛想防的那类静默损坏又回来了。登记表逐项声明「哪个文件、禁止裸调
# 什么、允许出现在哪个函数体内」;$Root 指向测试夹具时文件不存在,整条跳过。
$SoleExitRules = @(
  @{ File = "skills\luban-dev\scripts\luban_helper.py"; Banned = '\.save\s*\('; BannedDesc = "wb.save()"
     ExitFunc = "_save_workbook"
     Why = "openpyxl 直接存盘会丢掉公式单元格的缓存值,而 Luban 与各静态扫描读的正是缓存值(含公式的列会静默变空)" }
)
foreach ($rule in $SoleExitRules) {
  $rulePath = Join-Path $Root $rule.File
  if (-not (Test-Path $rulePath)) { continue }
  $curFunc = ""
  $lineNo = 0
  foreach ($line in (Get-Content -LiteralPath $rulePath -Encoding UTF8)) {
    $lineNo++
    $defM = [regex]::Match($line, '^\s*def\s+([A-Za-z_]\w*)')
    if ($defM.Success) { $curFunc = $defM.Groups[1].Value }
    $code = ($line -replace '#.*$', '')
    if ($code -notmatch $rule.Banned) { continue }
    if ($curFunc -eq $rule.ExitFunc) { continue }
    Write-Host ("R13 绕过唯一出口:" + $rule.File + ":" + $lineNo + " 在 " +
                $(if ($curFunc) { "$($curFunc)()" } else { "模块层" }) + " 里直接调了 " + $rule.BannedDesc)
    Write-Host ("  -> 改走 " + $rule.ExitFunc + "();" + $rule.Why)
    $violations += 1
  }
}

# --- R14 EAP=Stop 直调收 stderr ---
if ($stderrHits.Count -gt 0) {
  Write-Host ("R14 EAP=Stop 直调收 stderr:" + $stderrHits.Count + " 处(子进程写 stderr 即抛,VERDICT 丢失;改走 Invoke-FlowChild,或置于 try 内)")
  foreach ($h in $stderrHits) { Write-Host ("  " + $h.Rel + ":" + $h.Line) }
  $violations += $stderrHits.Count
}

# --- R15 逗号包裹返回接管道 ---
$commaHits = @($commaUses | Where-Object { $commaFuncs.ContainsKey($_.Name) })
if ($commaHits.Count -gt 0) {
  Write-Host ("R15 逗号包裹返回接管道:" + $commaHits.Count + " 处(整组当一个对象;改为 (函数 ...) | ...,或直接赋值不套 @())")
  foreach ($h in $commaHits) { Write-Host ("  " + $h.Rel + ":" + $h.Line + "  " + $h.Name + " " + $h.Kind) }
  $violations += $commaHits.Count
}

# --- R16 merge --abort 绕过出口 ---
if ($abortHits.Count -gt 0) {
  Write-Host ("R16 merge --abort 绕过出口:" + $abortHits.Count + " 处(改走 hook函数库 Invoke-MergeAbort,按现场核实成败)")
  foreach ($h in $abortHits) { Write-Host ("  " + $h.Rel + ":" + $h.Line) }
  $violations += $abortHits.Count
}

# --- R18 运行态路径绕过解析 ---
if ($ladHits.Count -gt 0) {
  Write-Host ("R18 运行态路径绕过解析:" + $ladHits.Count + " 处直读 `$env:LOCALAPPDATA(改走 hook函数库 Resolve-WfStatePath / Get-BoardPath / `$script:WfStateRoot;非运行态用途登记 `$LadReadAllow 附理由)")
  foreach ($h in $ladHits) { Write-Host ("  " + $h.Rel + ":" + $h.Line) }
  $violations += $ladHits.Count
}

# --- R17 文档副本回涨 ---
# 脚本索引与义务台账的表格行只写是什么 / 用法 / 出口码(台账:义务 / 绑定对象 / 保证等级 / 未覆盖面),
# 判据与步骤的正本在脚本头注(规约 = rules-ondemand/file-conventions.md 第 2 条)。行一长就是又在复述脚本:
# 压缩前平均 421 字、最长 1906 字,脚本每改一处就要同步一次(近 5 周 README 83 次提交、台账 62 次)。
# 文件不在(-Root 指向测试夹具)即跳过该文件。
$DocRowCaps = @(
  @{ Rel = "devflow\README.md";            Cap = 320 },
  @{ Rel = "devflow\obligation-ledger.md"; Cap = 450 }
)
$longRows = New-Object System.Collections.Generic.List[object]
foreach ($dc in $DocRowCaps) {
  $dp = Join-Path $Root $dc.Rel
  if (-not (Test-Path -LiteralPath $dp)) { continue }
  $ln = 0
  foreach ($row in [System.IO.File]::ReadAllLines($dp, [System.Text.Encoding]::UTF8)) {
    $ln++
    if (-not $row.StartsWith("|", [System.StringComparison]::Ordinal) -or $row -match '^\|[\s|:-]+\|?\s*$') { continue }
    if ($row.Length -gt $dc.Cap) { $longRows.Add([pscustomobject]@{ Rel = $dc.Rel; Line = $ln; Len = $row.Length; Cap = $dc.Cap }) }
  }
}
if ($longRows.Count -gt 0) {
  Write-Host ("R17 文档副本回涨:" + $longRows.Count + " 行超长(行为与判据写回脚本头注,这里只留是什么 / 用法 / 出口码与指针)")
  foreach ($h in $longRows) { Write-Host ("  " + $h.Rel + ":" + $h.Line + "  " + $h.Len + " > " + $h.Cap) }
  $violations += $longRows.Count
}

if ($violations -gt 0) {
  Write-Host ""
  Write-Host ("STATIC SCAN : " + $violations + " violation(s)")
  exit 1
}
Write-Host ("STATIC SCAN : clean (" + $entries.Count + " functions, " + $ps1Files.Count + " files)")
exit 0
