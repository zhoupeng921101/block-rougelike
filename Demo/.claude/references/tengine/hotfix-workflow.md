# 热更代码开发与热更包管理

> **适用场景**：热更边界划分、GameApp 热更入口、程序集加载流程、HybridCLR 开启后的 AOT 泛型补全 | **关联文档**：[architecture.md](architecture.md)（程序集划分）、[modules.md](modules.md)（GameModule 访问）

## 本作现状

- **热更程序集只有 `GameLogic` 一个**（`Assets/GameScripts/HotFix/GameLogic/`，asmdef 同名）。配置程序集 `GameConfig` 随第一张 Luban 表建，纯 C# 规则核心程序集随阶段 3 建，见 [architecture.md](architecture.md) 层表。
- **HybridCLR 暂关**（`ProjectSettings/HybridCLRSettings.asset` 的 `enable: 0`）：本机没有 C++ 工具链，Windows 出不了 IL2CPP 包，Windows 走 Mono 后端。编辑器与 Mono 包都走启动器 `ProcedureLoadAssembly` 的非热更分支，直接取已加载的 `GameLogic` 程序集，不读 DLL 字节。
- **热更分层照留**：`GameLogic` 仍登记在热更清单里，移植手机或 PC 改 IL2CPP 时打开即可，不改结构。开法见 `新游戏/工程计划.md`「阶段 1 落地时定的」。
- 资源首发离线（`OfflinePlayMode`，资源全部随包），不连 CDN；下文「热更包下载流程」是开 CDN 后才走的链路。

## 核心 API

### 热更代码目录

```
GameScripts/HotFix/
└── GameLogic/          # 唯一的热更程序集（主开发区域）
    ├── GameApp.cs                  # 热更主入口（partial class）
    ├── GameModule.cs               # 模块统一访问入口
    ├── Module/UIModule/            # UI 框架：UIModule、UIPanelMono、WindowAttribute、
    │                               #   IUIResourceLoader、UIPartFactory、ErrorLogger / UILogPanel
    └── UI/                         # 界面代码
        ├── Gen/                    # UI 生成器产出的绑定（勿手改）
        ├── Common/                 # 通用 UI 件（CountdownBinder 等）
        └── VFX/                    # 开关窗动画（WindowPopIn / WindowPopInAnim / WindowPopOut / UIWindowOpenAnim）
```

新模块按目录划分（`Module/<模块名>/`、`UI/<功能名>/`），不新建程序集，判据见 [architecture.md](architecture.md)「程序集新增边界」。

热更程序集列表正本 = `Assets/TEngine/Settings/UpdateSetting.asset` 的 `HotUpdateAssemblies`（项带 `.dll` 后缀，现为 `GameLogic.dll`），编辑器单向同步到 `ProjectSettings/HybridCLRSettings.asset` 的 `hotUpdateAssemblies`——直接改后者会被下次同步覆盖。新增热更程序集须在正本登记，否则运行期加载不到。两处一致性由客户端自检的 `热更程序集核对` 一道拦。

---

### GameApp 入口

```csharp
// GameApp.cs（partial class）
public partial class GameApp
{
    private static List<Assembly> _hotfixAssembly;
    private static Action _releaseLauncherUI;

    /// <summary>
    /// 热更域App主入口。由 ProcedureLoadAssembly 通过反射调用。
    /// </summary>
    public static void Entrance(object[] objects)
    {
        _hotfixAssembly = (List<Assembly>)objects[0];                  // 1. 保存热更程序集
        _releaseLauncherUI = objects.Length > 1 ? objects[1] as Action : null;  // 2. 启动器界面的关闭回调
        Utility.Unity.AddDestroyListener(Release);                     // 3. 注册销毁回调
        StartGameLogic().Forget();                                     // 4. 启动游戏逻辑
    }

    private static async UniTaskVoid StartGameLogic()
    {
        // 入口接线：注册系统、订阅事件、打开首个窗口；主界面开出来后才关启动器界面，不露黑屏
    }

    private static void Release()
    {
        SingletonSystem.Release();                                     // 释放单例
    }
}
```

**关键约束**：
- 入口无事件系统初始化步骤：事件 ID 是手写 `const int`，编译期内联，无运行期注册（见 [event-system.md](event-system.md)）
- `Entrance` 参数类型是 `object[]`，不是 `Assembly[]`——由 `ProcedureLoadAssembly` 反射调用时传入；`objects[2]`、`[3]` 是清理缓存的两步，本作离线不用，取参一律按长度判
- 主界面打开失败时保留启动器界面并记 Error，不调关闭回调——否则玩家看到的是黑屏而不是可读的错误
- 可通过 `partial class GameApp` 拓展入口逻辑（如注册系统）

---

### 流程状态机

流程类全部在**启动器层**（`Assets/Launcher/Procedure/`，AOT 域），继承 `Launcher.ProcedureBase`（派生自 `TEngine.ProcedureBase`，额外带 `protected readonly IResourceModule _resourceModule`）。热更域 `GameScripts/` 下没有流程类，也不能有：AOT 层不得引用热更程序集，流程里取不到 `GameModule`，界面走 `LauncherMgr`。

```csharp
using TEngine;
using ProcedureOwner = TEngine.IFsm<TEngine.IProcedureModule>;

namespace Launcher
{
    public class ProcedureClearCache : ProcedureBase
    {
        public override bool UseNativeDialog { get; }

        private ProcedureOwner _procedureOwner;

        protected override void OnEnter(ProcedureOwner procedureOwner)
        {
            _procedureOwner = procedureOwner;      // 后续切换要用，自己缓存
            LauncherMgr.ShowUI<LoadUpdateUI>("清理未使用的缓存文件...");

            var operation = _resourceModule.ClearCacheFilesAsync();
            operation.Completed += Operation_Completed;
        }

        private void Operation_Completed(YooAsset.AsyncOperationBase obj)
        {
            ChangeState<ProcedureLoadAssembly>(_procedureOwner);
        }
    }
}
```

流程切换只能在流程类内部经 `ChangeState<T>(procedureOwner)` 发起：`IProcedureModule` 上没有 `ChangeState`，只有 `StartProcedure<T>()` / `HasProcedure<T>()` / `GetProcedure<T>()` / `RestartProcedure()`。

---

### HybridCLR 注意事项（开热更后适用）

HybridCLR 暂关期间热更代码跑在 Mono 上，下面这些限制不显形；但代码照样按它们写，否则开热更那天要返工。

```csharp
// ❌ 热更代码不能引用主包 internal 类型
// ❌ 避免 System.Reflection 大量使用（AOT 限制多）
// ❌ 不支持：dynamic、Expression<T> 编译、部分 Emit、Marshal/P-Invoke
```

#### AOT 泛型补充

```
HybridCLR → Generate → AOT Generic References → 生成 Launcher/HybridCLRGenerate/AOTGenericReferences.cs
如出现 ExecutionEngineException，手动添加对应泛型使用后重新打包
```

常见需补充：`List<自定义类型>`、`Dictionary<K,V>` 新组合、`UniTask<自定义类型>`、`Action<自定义类型>`

---

## 使用模式

### 热更包下载流程（开 CDN 后适用）

主包流程驱动，不可热更（分支跳转见 [architecture.md](architecture.md) 启动流程节）：

```
ProcedureLaunch → ProcedureSplash → ProcedureInitPackage → ProcedureInitResources
→ ProcedureCreateDownloader → ProcedureDownloadFile → ProcedureDownloadOver
→ ProcedureClearCache → ProcedureLoadAssembly → ProcedureStartGame
```

离线模式下 `ProcedureInitResources` 直接跳 `ProcedureLoadAssembly`，中间的下载三步不走。

#### 核心代码

```csharp
public async UniTask CheckAndDownloadUpdate()
{
    // 1. 请求远端版本
    var versionOp = GameModule.Resource.RequestPackageVersionAsync();
    await versionOp.Task;
    // 2. 更新 Manifest
    var manifestOp = GameModule.Resource.UpdatePackageManifestAsync(versionOp.PackageVersion);
    await manifestOp.Task;
    // 3. 创建下载器
    var downloader = GameModule.Resource.CreateResourceDownloader();
    if (downloader.TotalDownloadCount == 0) return;
    // 4. 下载
    downloader.OnDownloadProgressCallback = OnProgress;
    downloader.BeginDownload();
    await downloader.Task;
    // 5. 清理旧缓存
    await GameModule.Resource.ClearCacheFilesAsync();
}
```

#### API 速查

| 方法 | 说明 |
|------|------|
| `GetPackageVersion()` | 本地资源包版本号 |
| `RequestPackageVersionAsync()` | 请求远端版本号 |
| `UpdatePackageManifestAsync(ver)` | 更新资源清单 |
| `CreateResourceDownloader()` | 创建差量下载器 |
| `downloader.TotalDownloadCount` | 待下载文件数 |
| `downloader.TotalDownloadBytes` | 待下载总字节 |
| `ClearCacheFilesAsync()` | 清理冗余缓存 |

---

### 日常开发步骤

```
1. 在 GameScripts/HotFix/GameLogic/ 下修改/添加代码
2. 编辑器：直接 Play（编辑器模拟模式，直接取已编译的 GameLogic 程序集）
3. 出 Windows 包：菜单 3B/出 Windows 包（WindowsBuild.Build），产物 Demo/Build/Windows/3B.exe；
   Mono 包同样走非热更分支，不需要 HybridCLR Generate
```

#### 新功能开发

```
1. Event/ 定义事件 ID 常量（跨模块通信时，见 event-system.md）
2. UI/ 创建 UIPanelMono 子类（[Window] 特性）
3. Module/ 实现业务模块
4. partial class GameApp 拓展入口初始化逻辑
5. 入口接线写在 GameApp.StartGameLogic 内（注册系统 / 订阅事件 / 决定首个窗口），不新增流程类
```

---

## 常见错误

| 错误 | 原因 | 修复 |
|------|------|------|
| `GameApp_RegisterSystem` 不存在 | 文档描述了不存在的文件 | GameLogic 下无此文件，使用 partial class GameApp 拓展 |
| `Entrance(Assembly[])` 签名错误 | 文档与源码不一致 | 实际为 `Entrance(object[])`，objects[0] 是 `List<Assembly>` |
| 热更代码找不到 GameApp.Entrance | 主包反射调用失败 | 确认 `UpdateSetting` 中 `LogicMainDllName` 指向 GameLogic.dll |
| 流程链错误 | 文档遗漏 ProcedureSplash | 正确链路从 ProcedureLaunch 开始，经过 ProcedureSplash |
| 在热更域新建流程类 / 入口里做 ChangeState | 流程链在启动器层，`GameApp` 不是流程 | 流程链止于 `ProcedureStartGame`（终态，不再切换；启动器界面由热更侧经入口参数里的关闭回调关）；热更侧接线全在 `GameApp.StartGameLogic` |
| 为了出 Windows 包去跑 HybridCLR Generate | 以为出包必须先生成 | HybridCLR 关着时 Generate 无用；出包只走 `3B/出 Windows 包` |

---

## 交叉引用

- 架构总览见 [architecture.md](architecture.md)
- 事件系统见 [event-system.md](event-system.md)
- 资源加载见 [resource-api.md](resource-api.md)
- UI 生命周期见 [ui-lifecycle.md](ui-lifecycle.md)
