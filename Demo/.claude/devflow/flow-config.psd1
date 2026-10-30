# flow-config.psd1 - devflow 机器常量配置表(单一事实源)。
# 消费者 = .claude/devflow 下脚本与 hooks(Import-PowerShellDataFile 读取;hooks 经
# hook函数库 Get-FlowConfig 懒加载,加载失败走各 hook 既有 失败放行 + error 遥测路径)。
# 只收机器消费的常量;判断类流程定义在 devflow 各 skill 卡,不入本表。
# 注释含中文,须保持 UTF-8 BOM(script-authoring);值保持 ASCII。
@{
  # 仓库根(客户端主仓根 / 服务端主仓)。留空 = 由加载器按脚本自身位置推导(客户端仓根 =
  # hooks\hook函数库.ps1 上溯四级;服务端根 = <RepoRoot>\<ServerDirName>),
  # 故整棵目录树换盘符/换路径无需改配置。填了显式值则显式值优先(测试夹具与非常规布局用)。
  # 推导正本 = hooks\hook函数库.ps1 的 Resolve-FlowRoots。
  RepoRoot         = ''
  FantasyRoot      = ''

  # Unity 工程目录名在脚本里写死为 Demo(与 block-client 写死 UnityProject 同形),不进本表:
  # 从 block-client 搬 devflow 修复时,把 UnityProject 换成 Demo、TEngine_block 换成 block-rougelike 即可对齐。

  # 服务端仓目录名。留空 = 本作没有服务端仓,双仓共用脚本里的服务端分支全部停用
  # (判据单源 = hook函数库 Test-ServerEnabled)。填上目录名才启用服务端通道。
  ServerDirName    = ''

  # 基线(自审 diff 与提交检查的集成分支;FantasyBaseline 只在启用服务端通道时读)
  ClientBaseline   = 'main'
  FantasyBaseline  = 'main'

  # Luban 导表入口(相对客户端仓根;消费者 = 校验库 生成域登记的导出命令核对)。
  # 留空 = 本作还没接 Luban。
  LubanGenClientBat = ''
  LubanGenServerBat = ''
}
