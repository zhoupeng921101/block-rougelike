# TEngine 架构与项目结构

> **适用场景**：理解项目分层架构、程序集划分、目录结构、启动流程 | **关联文档**：[modules.md](modules.md)、[hotfix-workflow.md](hotfix-workflow.md)、[resource-api.md](resource-api.md)

## 核心架构

### 分层架构

工程按职责分层，与 AOT / 热更 / Editor 三个编译域正交。两条轴都是硬约束：职责决定代码归属，编译域决定它能被谁引用。

| 层 | 程序集 | 根命名空间 | 编译域 | 职责 |
|---|---|---|---|---|
| 插件层·Runtime | 各插件自有 | 上游原名 | AOT | vendored 第三方运行时（YooAsset、UniTask、DOTween、HybridCLR 等） |
| 框架层 | `TEngine.Runtime` | `TEngine` | AOT | ModuleSystem / EventSystem / ResourceModule 等框架核心 |
| 启动器层 | `Launcher` | `Launcher` | AOT | 启动器 UI、主包流程状态机、热更程序集加载引导 |
| 配置层 | `GameConfig`（**未建**） | `GameConfig` | 热更 | Luban 生成的配置表与序列化库；随第一张配置表建 |
| 规则核心层 | `GameRules` | `GameRules` | 热更 | 不依赖 UnityEngine 的纯 C# 玩法规则（随机流、盘面、计分、事件）；`Demo/DotNet/` 下另有镜像库与单测工程链接同一份源码（编码约束见 [tengine-conventions.md](../../rules-ondemand/tengine-conventions.md)「规则核心」） |
| 业务层 | `GameLogic` | 无（全局） | 热更 | 表现层：UI 框架（UIModule / UIPanelMono）、各界面与玩法表现，热更主入口 |
| 框架工具层 | `TEngine.Editor` | `TEngine.Editor` | Editor | 框架自带编辑器扩展 |
| 业务工具层 | `Assembly-CSharp-Editor`（`Assets/Editor/` 下无 asmdef，落 Unity predefined） | 无（全局） | Editor | 项目自有编辑器工具（UI 脚本生成器、出包入口等） |
| 插件层·Editor | 各插件自有 | 上游原名 | Editor | vendored 第三方编辑器扩展 |

配置层「未建」的规划见 `新游戏/工程计划.md`「阶段 1 落地时定的」；建之前不要为它预留空 asmdef（空程序集 Unity 不产出 dll）。

### 命名规则

1. 程序集名 = `<职责名>[.Editor]`，`.Editor` 后缀当且仅当 `includePlatforms: [Editor]`
2. 业务层与业务工具层不声明命名空间；框架层、启动器层、配置层、规则核心层的根命名空间 = 程序集名（落点表正本 = [tengine-conventions.md](../../rules-ondemand/tengine-conventions.md)「客户端命名空间」）

规则的用处是从名字反推层与编译域，不必查 asmdef 或 HybridCLR 配置：

| 名字形态 | 层 | 编译域 |
|---|---|---|
| `TEngine.Runtime` | 框架层 | AOT |
| `TEngine.Editor` | 框架工具层 | Editor |
| `Launcher` | 启动器层 | AOT |
| `Game*`，无 `.Editor` 后缀 | 配置层 / 规则核心层 / 业务层 | **热更** |
| 落 `Assets/Editor/`、无 asmdef | 业务工具层 | Editor |
| 其余 | 插件层 | 按 `.Editor` 后缀判 |

三处例外：

- **插件层**保上游原名，不受规则 1、2 约束。
- **条件编译段落**：规则 2 约束的是打包产物中实际存在的类型，`#if UNITY_EDITOR` 一类条件段排除掉的类型不受约束，但其命名空间须标明被排除的条件——`TEngine.Runtime` 内的 `TEngine.Editor` 段即此形态。
- **目录名不参与规则**：程序集归属以 asmdef 为准，不看目录名（接 Luban 后配置程序集的目录由生成器输出路径锁定，同理）。

---

### 依赖规则

| 依赖方 | 可依赖 |
|---|---|
| 插件层·Runtime | — |
| 框架层 | 插件层·Runtime |
| 启动器层 | 框架层、插件层·Runtime |
| 配置层 | 框架层、插件层·Runtime |
| 规则核心层 | 不依赖 UnityEngine，故也不依赖框架层（纯 C#，要能在 Unity 外批量跑局） |
| 业务层 | 配置层、规则核心层、框架层、插件层·Runtime |
| 框架工具层 | 框架层、插件层 |
| 业务工具层 | 全部（Editor 是依赖图的汇点） |

三条硬禁止：

1. **框架层 ✗→ 业务层 / 配置层**。上游框架依赖本工程业务，框架升级即冲突。
2. **AOT 层（框架层 / 启动器层）✗→ 热更层（业务层 / 配置层 / 规则核心层）**。AOT 编译期引用热更程序集，打包时 AOT dll 内嵌对热更 dll 的引用，开热更后加载顺序失效。HybridCLR 暂关期间这条照守，否则以后开热更要拆引用。无工具拦这条：asmdef 之间的引用本就一律显式，AOT 程序集的 `references` 里出现 `GameLogic` / `GameConfig` / `GameRules` 即越界，改 asmdef 时自己看。
3. **任何 Runtime 层 ✗→ 业务工具层 / 框架工具层**。Editor 程序集不进包。

热更代码另不得引用主包 internal 类型。

**程序集新增边界**：程序集按上表的层划分，不按业务模块新增。业务模块的划分用目录，不用程序集——每多一个热更程序集，热更程序集清单、link.xml、AOT 泛型引用都要跟着维护，且模块间循环依赖会立刻变成编译错误。规划中的配置层与规则核心层是按层占位，不构成本条的反例。

> 热更程序集清单增减须重出整包：启动器按主包内的清单加载，旧整包不认新程序集。

---

### 设计与当前落点的差距

下列代码的实际编译归属与分层表不符，写代码时按实际归属判断可见性：

| 代码 | 设计归属 | 当前落点 |
|---|---|---|
| `Assets/Editor/` 下项目自有工具 | 业务工具层 | Assembly-CSharp-Editor |

运行时侧无隐式程序集：`Assets` 下每个非 Editor 的 .cs 都落在某个 asmdef 子树内，由客户端自检的程序集归属扫描守恒（白名单见 `命名空间扫描.ps1` 的 `$coverageExcludes`）。`GameLogic` 为 `autoReferenced: true`，被 Editor 侧默认程序集自动持有引用。

---

### 目录结构

```
block-rougelike/Demo/Assets/
├── AssetRaw/                 # 热更资源目录（YooAsset 打包来源）
│   ├── Audios/ Configs/ Effects/ Fonts/
│   ├── Materials/ Scenes/ Shaders/
│   └── UI/Prefabs/ UI/Texture/
├── AssetArt/Atlas/           # 图集产物（TEngine 图集工具生成，YooAsset UIAtlas 组收集）
├── Launcher/                 # 启动器模块（AOT，含主包流程）
│   ├── Scripts/              # GameEntry、LauncherMgr、加载 UI 等
│   ├── Procedure/            # 主包流程状态机
│   └── AotPreserve/link.xml  # 手写 AOT 保活；HybridCLR 生成物输出到 Launcher/HybridCLRGenerate/（开热更后才有）
├── TEngine/                  # 框架核心代码
│   ├── Editor/               # 编辑器工具
│   ├── Runtime/              # 运行时核心（Core/ Extension/ Module/）
│   └── Settings/             # UpdateSetting、ProcedureSetting、GameEntry / UIRoot 预制等
├── Plugins/                  # DOTween 等框架依赖（AOT）
├── Editor/                   # 项目自有编辑器工具（UIScriptGenerator、Build/WindowsBuild 等）
├── ThirdParty/               # vendored 第三方插件（TextMesh Pro）
└── GameScripts/HotFix/       # 热更代码（GameScripts 下别无他物）
    ├── GameRules/            # 规则核心程序集（纯 C#，noEngineReferences；只被 GameLogic 引用）
    └── GameLogic/            # 业务层程序集
        ├── GameApp.cs        # 热更主入口
        ├── GameModule.cs     # 模块统一访问入口
        ├── Module/UIModule/  # UI 框架（UIModule、UIPanelMono、WindowAttribute、资源加载器、错误日志窗）
        └── UI/               # 界面代码（Gen/ 生成绑定、Common/、VFX/ 开关窗动画）
```

YooAsset、UniTask、HybridCLR 以 UPM 包形式在 `Demo/Packages/` 或 `manifest.json` 里，不在 `Assets` 下。

---

### 启动流程

```
GameEntry.Awake()
  ├── ModuleSystem.GetModule<IUpdateDriver>()    // 帧驱动
  ├── ModuleSystem.GetModule<IResourceModule>()  // 资源系统
  ├── ModuleSystem.GetModule<IDebuggerModule>()  // 调试器
  ├── ModuleSystem.GetModule<IFsmModule>()       // 状态机
  ├── Settings.ProcedureSetting.StartProcedure().Forget()  // 启动流程
  └── DontDestroyOnLoad(this)

主包流程（不可热更，全部在 Assets/Launcher/Procedure/）：
ProcedureLaunch → ProcedureSplash → ProcedureInitPackage → ProcedureInitResources
→ ProcedureCreateDownloader → ProcedureDownloadFile → ProcedureDownloadOver
→ ProcedureClearCache → ProcedureLoadAssembly → ProcedureStartGame

链上分支，跳过下游或回退重试：
  InitResources     非联机模式或 WebGL             → 直接跳 LoadAssembly
                    联机模式且边玩边下载           → 跳过整包下载三步,进 ClearCache
                    更新失败后离线进本地版本       → 直接跳 LoadAssembly
  CreateDownloader  TotalDownloadCount == 0 → 直接跳 DownloadOver
  DownloadFile      下载出错、弹框选重试   → 回 CreateDownloader

本作出包用离线模式（主场景 GameEntry 设 OfflinePlayMode），编辑器走编辑器模拟模式，
都从 InitResources 直接跳 LoadAssembly；下载三步留给以后移植手机开 CDN 时用。

热更入口：ProcedureLoadAssembly 取到 GameLogic 程序集后通过反射调用
  （HybridCLR 关闭或编辑器模拟模式下走非热更分支，直接取已加载的程序集，不读 DLL 字节）
  GameApp.Entrance(object[] objects)
  ├── 保存热更程序集列表              // 1. objects[0] 为 List<Assembly>
  │                                   //    objects[1] 启动器界面的关闭回调(Action)
  │                                   //    objects[2]、[3] 清理缓存的两步,本作离线不用;须按长度取
  ├── Utility.Unity.AddDestroyListener(Release)  // 2. 注册销毁回调
  └── StartGameLogic()                // 3. 启动游戏逻辑（打开主界面，开出来后才关启动器界面）
```

---

## 使用模式

### 资源目录组织

```
Assets/AssetRaw/              # 所有热更资源的根目录
├── Audios/                   # 音频
├── Configs/                  # 配置数据（接 Luban 后放导表产物）
├── Effects/                  # 粒子特效
├── Scenes/                   # 场景
├── UI/Prefabs/ UI/Texture/   # UI 预制与独立贴图
└── ...
```

- 资源 location 等于文件名（不含路径和扩展名），YooAsset 按 `Editor/AssetBundleCollector/AssetBundleCollectorSetting.asset` 的分组自动收集
- **禁止** `Resources.Load()`，所有资源通过 `AssetRaw/` + YooAsset 管理

---

## 常见错误

| 错误 | 原因 | 修复 |
|------|------|------|
| 热更入口签名写错 | 文档写 `Entrance(Assembly[])` | 实际为 `Entrance(object[])`，objects[0] 强转为 List<Assembly> |
| 流程链遗漏 ProcedureSplash | 直接从 ProcedureLaunch 跳到 ProcedureInitResources | ProcedureLaunch → ProcedureSplash 才是正确的下一步 |
| 为规划中的程序集先建空 asmdef | 想提前占位 | 空程序集 Unity 不产出 dll，热更清单与启动器加载会找不到；随第一批代码一起建 |

---

## 交叉引用

- 模块 API 见 [modules.md](modules.md)
- 热更开发见 [hotfix-workflow.md](hotfix-workflow.md)
- 事件系统见 [event-system.md](event-system.md)
- 资源加载见 [resource-api.md](resource-api.md)
