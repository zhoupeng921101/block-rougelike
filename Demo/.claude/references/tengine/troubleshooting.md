# TEngine 常见问题排障

> **适用场景**：编译报错/热更失败/资源加载失败/UI 不显示/事件无响应/性能问题/Luban 配置问题排查 | **关联文档**：[resource-api.md](resource-api.md)、[event-system.md](event-system.md)、[hotfix-workflow.md](hotfix-workflow.md)

> 本篇描述与代码不符时:当轮按代码写对并在呈报中点名,修正另起一轮走 `/refs-check`(口径见 [tengine-conventions.md](../../rules-ondemand/tengine-conventions.md)「references 与代码不符时」)

## 核心 API

### 场景索引

| 场景 | 常见问题 |
|------|---------|
| 编译/热更 | AOT 泛型、Editor 正常真机报错、DLL 加载失败、Assembly.Load 原生闪退、iOS 链接失败（以上开热更后才有）、生命周期签名错误 |
| 资源加载 | location 无效、内存增长、缓存未更新、SetSprite callback 类型错误 |
| UI | 界面空白、Part 复用异常、事件销毁后触发、生命周期签名错误 |
| 事件 | 接口事件无响应、监听收不到、UnRegisterAll 不存在 |
| 内存/性能 | GC 频繁、启动慢、DrawCall 高 |
| Luban（接入后） | 生成报错、Tables 为 null、ConfigSystem 找不到 |
| UniTask | 异常被吞、await 后对象为 null |

---

## 使用模式

### 编译/热更问题

HybridCLR 暂关：编辑器与 Windows Mono 包都走 `ProcedureLoadAssembly` 的非热更分支，直接取已加载的 `GameLogic`，本节前五条都不会出现。它们在开热更（IL2CPP + HybridCLR，移植手机或 PC 改 IL2CPP）后才适用，开法见 `新游戏/工程计划.md`「阶段 1 落地时定的」。

#### AOT 泛型异常：`ExecutionEngineException`

热更代码使用了主包没有 AOT 实例的泛型。菜单 `HybridCLR → Generate → AOT Generic References` 重新生成（输出 `Launcher/HybridCLRGenerate/AOTGenericReferences.cs`），若仍缺失则在其中手动添加占位引用：
```csharp
static void UseCustomGenericType() { _ = new List<MyCustomType>(); }
```

#### Editor 正常，真机报错

开热更后 Editor 仍走 Mono，真机走 IL2CPP + HybridCLR。检查是否有 `dynamic`/`Emit` 等不支持特性，反射代码是否受限。开启 `Development Build` + `Script Debugging` 获取完整堆栈。

#### 热更 DLL 加载失败

1. `UpdateSetting.asset` 的 `HotUpdateAssemblies` 与 `HybridCLRSettings.asset` 的 `hotUpdateAssemblies` 是否一致（客户端自检 `热更程序集核对` 一道拦）
2. 热更 DLL 是否已拷进 `UpdateSetting` 的 `AssemblyTextAssetPath`（`AssetRaw/DLL`）并被 YooAsset 收集——关热更时去掉了 DLL 收集分组，开热更要加回
3. `ProcedureLoadAssembly.cs` 加载的 DLL 名与实际一致

#### 热更程序集 `Assembly.Load` 处原生闪退

（开热更后的 Android 包）症状:日志止于某热更程序集的 `LoadAssetSuccess`,没有配对的 `Assembly [ xxx ] loaded`,进程 SIGABRT 或 SIGSEGV,托管 try/catch 拦不到。编辑器不走 `Assembly.Load`,恒无症状。

1. 先符号化再立假设:`.claude/scripts/崩溃栈符号化.ps1`(须用与装机包同 BuildId 的未剥离 libil2cpp.so)。
2. 栈落在 `VTableSetUp::ComputAotTypeVtables → GlobalMetadata::GetMethodHandleFromVTableSlot`:先核 HybridCLR 包版本。8.8.0 为 Unity 6000.3 配的 il2cpp_plus 不处理抽象方法的 NoData 虚表槽,凡热更类型继承带抽象方法的 AOT 基类(`MemoryPackFormatter<T>`、`JsonConverter`、`Stream` 等)即崩,8.14.0 起修复;工程现钉 `#v8.14.1`(`Packages/manifest.json`)。改包版本后须重跑 `HybridCLR/Installer` 并重出 Player,已发出的包无法经热更修复。
3. 另一种形态要分开:栈只有两帧、落在 libc `memcpy`、日志止于 `LoadMetadataAssetSuccess`,是补充元数据与本包 AOT 不同源(装错包,或资源与包不配套)。带 AOT 指纹闸的包会在加载元数据之前弹「客户端版本过旧」,走不到这里。

#### iOS 链接失败

Burst/IL2CPP 裁剪了代码。在手写保活文件 `Assets/Launcher/AotPreserve/link.xml` 中保留需要的类型（`Launcher/HybridCLRGenerate/link.xml` 是生成物，每次 Generate 覆盖，不手改）：
```xml
<linker><assembly fullname="UnityEngine"><type fullname="UnityEngine.Rigidbody" preserve="all"/></assembly></linker>
```

---

### 资源加载问题

#### location 无效

1. `AssetBundleCollector` 是否收集该资产
2. location 不含路径和扩展名（`HeroPrefab` 而非 `Actor/Hero/HeroPrefab.prefab`）
3. `GameModule.Resource.CheckLocationValid("location")` 返回 false 说明未收集
4. 重新打包资源（Editor 模拟器可能引用旧清单）

#### 内存持续增长

调试器（`~` 键）查看资源引用计数。常见原因：忘记 `UnloadAsset`、静态变量持有引用、窗内 Part 持有的 Asset 未释放、异步加载完成后对象已销毁导致 `OnDestroyWindow` 未执行释放。API 详情见 [resource-api.md](resource-api.md)，生命周期模式见 [resource-patterns.md](resource-patterns.md)。

#### 包里资源是旧的

本作首发离线、资源全部随包：改了资源后要重出包（`3B/出 Windows 包` 会重打资源）。开 CDN 后另查：

1. CDN 资源版本文件是否更新
2. `RequestPackageVersionAsync` 是否获取到新版本号
3. 本地测试清空 `Application.persistentDataPath` 缓存

---

### UI 问题

#### 界面空白/节点找不到

1. `[Window]` 特性 location 与 Prefab 文件名一致
2. Prefab 在 `AssetRaw/UI/Prefabs/` 且 YooAsset 已收集
3. `ScriptGenerator` 路径与 Prefab 节点层级一致
4. `FindChild` 返回 null 时加日志

#### UI 事件销毁后仍触发

在 `RegisterEvent()` 外使用 `GameEvent.AddEventListener` 不会自动清理。必须用 `AddUIEvent`。详见 [event-system.md](event-system.md)。

---

### 事件系统问题

#### 监听收不到（本类问题的头号成因）

`Send<T>` 与 `AddUIEvent<T>` / `AddEventListener<T>` 的泛型参数必须完全一致——个数与类型都算。
不一致时分发器静默跳过该回调（`EventDelegateData.Callback<T>` 的 `d is Action<T>` 不成立即不执行），
**不抛异常、不记日志**，表现为「事件发出去了但监听方毫无反应」。

排查顺序：

1. 对照事件 ID 表 `GameEventID` 中该常量的注释「参数」一行，核对发送侧与监听侧的泛参
2. 确认发送与监听用的是同一个常量（不是号相近的邻居）
3. 确认监听注册确实执行了（`RegisterEvent()` 被调用、窗口已创建）

> 泛参比对没有编译期检查（工程里没有事件 analyzer），只能人工核对。

---

### 内存/性能问题

#### GC 频繁

Profiler 查看 GC Alloc 热点。常见：字符串拼接改 `StringBuilder`、闭包捕获避免 Lambda、Linq 改 `for` 循环、频繁 `new` 改 `MemoryPool.Acquire<T>()`。

#### 启动慢

精简 `GameApp.StartGameLogic` 里主界面开出来之前做的事、用进度回调展示、大型 Prefab 异步实例化。

#### DrawCall 高

Frame Debugger 查看合批。UI 同 Atlas 同 Canvas、3D 用 GPU Instancing/Static Batching、确认材质 Shader 一致。

---

### Luban 问题（接入后适用）

本作尚未接入 Luban，接入状态与计划见 [luban-config.md](luban-config.md)。

#### 生成报错

`##type` 行类型拼写正确（`int`/`string`/`float`，区分大小写）；容器写 `(list#sep=,),int` 形态；Bean 先在 `__beans__.xlsx` 定义；`value_type` 与 Bean 类型名一致。

#### Tables 为 null

1. `ConfigSystem.Instance.Load()` 已调用（入口接线里调；`Tables` getter 首访也会懒调）
2. `.bytes` 在 `AssetRaw/Configs/` 下且 YooAsset 已收集
3. 若沿用 block-client 的预载模板：表名在 `ConfigSystem.TableAssetNames` 预载清单内（出包运行时未预载的表取字节直接抛异常）

#### ConfigSystem.cs 找不到

`ConfigSystem.cs` 不在 Assets 默认目录中，需从 Luban CustomTemplate 模板生成。详见 [luban-config.md](luban-config.md)。

---

### UniTask 问题

#### 异常被吞

`UniTaskVoid` 异常不传播。方法内 try-catch，或设置全局回调：
```csharp
UniTaskScheduler.UnobservedExceptionHandler = e => Log.Error($"未处理 UniTask 异常: {e}");
```

#### await 后对象为 null

await 期间对象被销毁。返回后检查：
```csharp
if (this == null || _imgIcon == null) return;
```

---

## 常见错误

| 错误 | 原因 | 修复 |
|------|------|------|
| 窗口 `OnCreate(object userData)` 编译失败 | 生命周期方法无参数 | `OnCreate()` 无参，数据通过 `UserData` 属性获取 |
| 窗口 `OnRefresh(object userData)` 编译失败 | 同上 | `OnRefresh()` 无参 |
| `override void OnDestroy()` 编译失败或不生效 | `UIPanelMono.OnDestroy` 是 private 的 Unity 魔法回调，子类覆盖不到 | 销毁清理写在 `OnDestroyWindow()`（`protected virtual`，无参） |
| `SetSprite` callback 写成 `Action<Sprite>` | callback 参数类型不是 Sprite | 实际为 `Action<Image>`，回调参数是设置完 Sprite 后的 Image 组件 |
| `GameEvent.UnRegisterAll()` 编译失败 | GameEvent 中不存在此方法 | 使用 `GameEvent.RemoveEventListener(eventType, handler)` 或 `GameEventMgr.Clear()` |
| `SetSprite` callback 写成 `Action<SpriteRenderer>` | SpriteRenderer 重载的 callback 是 `Action<SpriteRenderer>` | Image 版和 SpriteRenderer 版 callback 类型不同，按需使用 |

### 窗口生命周期签名速查

```csharp
// ✅ 正确签名（UIPanelMono 中定义，全部无参）
protected virtual void OnCreate()
protected virtual void OnRefresh()
protected virtual void OnUpdate()
protected virtual void OnDestroyWindow()   // 销毁回调，不是 OnDestroy

// ❌ 常见错误签名
protected override void OnCreate(object userData)   // 不存在此签名，数据取 UserData 属性
protected override void OnDestroy()                 // 基类中是 private 魔法回调，覆盖不到
protected override void OnDestroy(bool isShutdown)  // 这是 ProcedureBase 的签名
```

### SetSprite callback 签名速查

`SetSprite` 的 callback 类型是 `Action<Image>`（Image 扩展）或 `Action<SpriteRenderer>`（SpriteRenderer 扩展），**不是** `Action<Sprite>`。完整签名见 [resource-api.md](resource-api.md#setsprite-扩展方法2-个签名)。

### GameEvent 清理方法速查

```csharp
// ✅ UI 内部事件自动清理（AddUIEvent 在 OnDestroy 时自动 RemoveAllUIEvent）
AddUIEvent(eventType, handler);

// ✅ 手动移除单个事件监听
GameEvent.RemoveEventListener(eventType, handler);

// ✅ 清理 UI 内所有事件（窗口销毁时由框架调用）
RemoveAllUIEvent();           // UIPanelMono 的 protected 方法，内部经 MemoryPool.Release 归还 GameEventMgr
// 或
EventMgr.Clear();             // GameEventMgr 实例方法

// ❌ 不存在的方法
GameEvent.UnRegisterAll();    // 编译错误：GameEvent 无此方法
```

---

## 交叉引用

- UI 生命周期见 [ui-lifecycle.md](ui-lifecycle.md)
- 事件系统见 [event-system.md](event-system.md)
- 资源加载见 [resource-api.md](resource-api.md)
- 热更开发见 [hotfix-workflow.md](hotfix-workflow.md)
- Luban 配置见 [luban-config.md](luban-config.md)
- 架构总览见 [architecture.md](architecture.md)
