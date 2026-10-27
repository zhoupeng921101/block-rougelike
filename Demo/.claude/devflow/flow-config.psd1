# flow-config.psd1 - devflow 机器常量配置表(单一事实源)。
# 消费者 = .claude/devflow 下脚本与 hooks(Import-PowerShellDataFile 读取;hooks 经
# hook函数库 Get-FlowConfig 懒加载,加载失败走各 hook 既有 失败放行 + error 遥测路径)。
# 只收机器消费的常量;判断类流程定义在 devflow 各 skill 卡,不入本表。
# 注释含中文,须保持 UTF-8 BOM(script-authoring);值保持 ASCII。
@{
  # 仓库根(客户端主仓根 / 服务端主仓)。留空 = 由加载器按脚本自身位置推导(客户端仓根 =
  # hooks\hook函数库.ps1 上溯四级并做槽位归一;服务端根 = <RepoRoot>\<ServerDirName>),
  # 故整棵目录树换盘符/换路径无需改配置。填了显式值则显式值优先(测试夹具与非常规布局用)。
  # 推导正本 = hooks\hook函数库.ps1 的 Resolve-FlowRoots。
  RepoRoot         = ''
  FantasyRoot      = ''

  # Unity 工程目录名在脚本里写死为 Demo(与 block-client 写死 UnityProject 同形),不进本表:
  # 从 block-client 搬 devflow 修复时,把 UnityProject 换成 Demo、TEngine_block 换成 block-rougelike 即可对齐。

  # 服务端仓目录名。留空 = 本作没有服务端仓,双仓共用脚本里的服务端分支全部停用
  # (判据单源 = hook函数库 Test-ServerEnabled)。填上目录名才启用服务端通道。
  ServerDirName    = ''

  # 槽位布局:槽位目录 = <SlotBaseDir>\<SlotDirPrefix><N>(目录名须以 dev<N> 结尾,
  # 分支推导依赖此形态),客户端常驻分支 = <SlotBranchPrefix><N>。
  # SlotBaseDir 留空 = 推导为 RepoRoot 的父目录(槽位与主仓同级);SlotDirPrefix 是项目
  # 标识而非机器路径,保持显式(改仓目录名时须同改此值与槽位目录名)。
  SlotBaseDir      = ''
  SlotDirPrefix    = 'block-rougelike-dev'
  # 每个槽位常驻一个 Unity 编辑器,池大小按本机能同时开几个编辑器定。
  SlotCount        = '2'
  SlotBranchPrefix = 'agent/dev'
  # 上界须与 SlotCount 同值(静态扫描 R12 机判);形态换出 [1-N] 字符类时 R12 会报解析不出上界。
  SlotRootRe       = '-dev[1-2]$'         # 仅固定 dev1..dev2 按槽位仓处理

  # 槽位 worktree 只检出这些顶层目录(git sparse-checkout cone 模式,相对仓根,逗号分隔)。
  # 仓里其余目录(参考/、复刻/ 等拆包资料)体量大且与实现无关,不复制进每个槽位。留空 = 全量检出。
  SlotSparseDirs   = 'Demo,新游戏'

  # NormalSlotMax(常规任务候选槽上界)有意不配:池大小 = 该上界时它不产生任何隔离,留着只会
  # 被读成池大小。缺键时 槽位领取内核.ps1 按不设上限处理 —— 常规任务全池正序、免启任务全池反序。

  # 领用入口等待目标 Unity 编辑器在本机 UnityMCP 就绪(读编辑器侧状态文件)的最长秒数。
  UnityReadyTimeoutSeconds = '300'

  # 合并基线(客户端槽位分支相对 ClientBaseline;FantasyBaseline 只在启用服务端通道时读)
  ClientBaseline   = 'main'
  FantasyBaseline  = 'main'

  # 陈旧占位判龄(小时;引号形态,与同族标量一致。消费者 = 槽位领取内核.ps1,
  # 判据正文在 devflow 卡 references/slot-protocol.md「陈旧占位清理」)
  StaleClaimHours  = '24'

  # 任务看板(仓外运行态,相对 %LOCALAPPDATA%,物理路径经 hook函数库 Get-BoardPath 解析;git 为占用权威,看板只记流程态)。
  # 首段 claude-wf-3b 与运行态根同名(hook函数库 $script:WfStateRoot),与其他工程的 devflow 运行态分开。
  BoardRelPath     = 'claude-wf-3b\board.json'

  # Luban 导表入口(相对客户端仓根;消费者 = 槽位交付.ps1 Luban 基线自动同步的重导步)。
  # 留空 = 本作还没接 Luban,重导步跳过。
  LubanGenClientBat = ''
  LubanGenServerBat = ''
}
