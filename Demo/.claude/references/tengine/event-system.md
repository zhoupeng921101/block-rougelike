# 事件系统

> **适用场景**：客户端变更通知的机制选型(新增通知点先读「选哪条通知路径」)、GameEvent/AddUIEvent/GameEventMgr 使用、事件 ID 定义(`GameEventID` 手写常量表)、事件监听清理 | **关联文档**：[ui-lifecycle.md](ui-lifecycle.md)（AddUIEvent 自动清理）、[event-antipatterns.md](event-antipatterns.md)（避坑）、[naming-rules.md](naming-rules.md)（事件命名）

## 选哪条通知路径

客户端有多套变更通知机制并存,各有明确适用面。**新增通知点按「谁通知谁」选,不按顺手选**;不新增第五套。

| 发起方 → 接收方 | 用什么 | 附带约束 |
|---|---|---|
| 服务模块 → 订阅它的 UI | 服务对象上的 `event Action` | 窗内经 `UIPanelMono.AddServiceEvent` 登记,随窗销毁自动解绑(见 [ui-lifecycle.md](ui-lifecycle.md));裸 Mono 部件仍手写成对解绑 |
| 跨模块,且发送方不该认识接收方 | `GameEvent` 总线 | 事件 ID 取自 `GameEventID` 常量表 |
| 玩法态 → 窗内表现 | 玩法态上的静态事件;须延后到下一拍重绘的(动画进位期间不能立即重画)用脏标记 + 窗轮询消费 | 静态事件必须成对解绑,否则泄漏已销毁的窗引用 |
| 单一订阅者的直接回调 | 裸 `public Action` 字段 | 只作回调槽、不作广播;出现第二个订阅者即改走上面某条 |

判据是「这条通知的发起方与接收方各是什么角色」,不是「哪个写起来快」。

> 规则核心程序集(阶段 3 建,不依赖 UnityEngine)对表现层的通知走它自己的事件,不碰 `GameEvent`——后者在 `TEngine.Runtime` 里,规则核心引用不到。表现层订阅规则核心事件,按「玩法态 → 窗内表现」一行处理。

**同一件事只走一条路**:两条路径写同一份状态会产生先后不定的竞态,且判定逻辑会散到两处。需要两份输入才能得出的结论(如既要局内状态又要局外存档),把输入汇集到判定方,不要让一方算完结论再推给另一方——那会让本不该懂该语义的一方承担它。

## 架构概览

| 组件 | 类型 | 职责 |
|------|------|------|
| **GameEventID** | 手写常量表,一张:`GameLogic/Event/GameEventID.cs`(全局命名空间;本作还没有事件,第一个事件随任务建此文件) | 事件 ID 只在这张表里定义,`const int` 字面量,按号段分业务(见下方号段规则) |
| **GameEvent** | 全局静态门面 | 持有 `static readonly EventMgr _eventMgr`，所有方法委托给内部 EventMgr 实例 |
| **GameEventMgr** | 局部作用域管理器 | 实现 `IMemory`，用于 UI 面板等需要随生命周期自动解绑的场景，只有 `AddEvent` + `Clear()` |
| **EventDispatcher / EventDelegateData** | 底层分发 | `Dictionary<int, EventDelegateData>` 按 ID 存回调;拒绝重复注册、遍历期增删延迟合入 |

**唯一收发姿势**:发送 `GameEvent.Send(GameEventID.OnXxx, args...)`,监听 `AddUIEvent(GameEventID.OnXxx, ...)`(UI 内)/ `GameEventMgr.AddEvent(...)`(非 UI)。事件 ID 无运行期注册步骤——`const int` 在编译期内联到调用点。

---

## 事件 ID 定义

新增事件 = 在 `GameEventID` 对应业务号段末尾续一个 `const int`,并写全注释;新业务先开一段。

```csharp
public static class GameEventID
{
    #region 商店 10000-10099

    /// <summary>
    /// 商店货架刚按本次刷新结果重绘完。
    /// 发送方 = 商店面板;监听方 = 结算侧的金币显示(据此刷新余额,不必再问商店)。
    /// 参数:<c>int gold</c>
    /// </summary>
    public const int OnShopRefreshed = 10000;

    #endregion
}
```

> 上例只示范注释格式与号段写法,号与名都不是已登记的事件。

**注释四项缺一不可**:事件语义、发送方、监听方、**参数**。参数行是发送侧与监听侧泛参对齐的唯一依据——泛参不一致时分发器静默跳过回调,不抛错也不记日志,写错的表现是「监听方永远收不到」而非报错。

> 泛参个数与类型没有编译期校验(工程里没有事件 analyzer),由注释 + 人工核对承担。

**号段规则**:

| 规则 | 说明 |
|------|------|
| 分段 | 每个业务占一段(10000 起,每段 100 个号),段在表里以 `#region <业务> <起>-<止>` 标出,段内留空档 |
| 保留段 | 10000 以下保留给框架 |
| 不回收 | 号一旦发出即不复用,包括已删除事件的号——使旧号在日志与外部记录里恒指向同一件事 |
| 命名 | `On` + 过去式动词 + 名词:`OnShopRefreshed`、`OnHandDealt` |
| 禁止 | 在 `GameEventID` 之外另定事件 ID;跨段借号 |

---

## 核心 API

### GameEvent 静态方法

#### Send（发送事件）

```csharp
// 支持 0~6 个泛型参数
GameEvent.Send(int eventType);
GameEvent.Send<T1>(int eventType, T1 arg1);
GameEvent.Send<T1,T2>(int eventType, T1 arg1, T2 arg2);
// ... 最多 Send<T1,T2,T3,T4,T5,T6>
```

#### AddEventListener（监听事件）

返回 `bool`（是否监听成功）。UI 内用 `AddUIEvent`（自动清理，无需关心返回值）。

```csharp
bool GameEvent.AddEventListener(int eventType, Action handler);
bool GameEvent.AddEventListener<T1>(int eventType, Action<T1> handler);
// ... 最多 AddEventListener<T1,T2,T3,T4,T5,T6>
```

#### RemoveEventListener（移除监听）

```csharp
GameEvent.RemoveEventListener(int eventType, Action handler);
GameEvent.RemoveEventListener<T1>(int eventType, Action<T1> handler);
// ... 最多 RemoveEventListener<T1,T2,T3,T4,T5>
GameEvent.RemoveEventListener(int eventType, Delegate handler);  // Delegate 重载
```

#### Shutdown（清除所有事件注册）

```csharp
// 仅在游戏退出时调用，内部调用 _eventMgr.Init() 重置分发表
GameEvent.Shutdown();
```

> **注意**：不存在 `UnRegisterAll<T>()` / `UnRegisterAll()`。需要清除时用 `Shutdown()`（全局）或 `GameEventMgr.Clear()`（局部）。

### GameEventMgr 局部管理器

实现 `IMemory`，仅支持 `int` eventType，最多 5 个泛型参数。没有 `RemoveEvent`，通过 `Clear()` 一次性移除所有已注册事件。

```csharp
private readonly GameEventMgr _eventMgr = new();

// 注册（仅在 AddEventListener 返回 true 时才记录到内部列表）
_eventMgr.AddEvent(int eventType, Action handler);
_eventMgr.AddEvent<T1>(int eventType, Action<T1> handler);
// ... 最多 AddEvent<T1,T2,T3,T4,T5>

// 一次性移除所有
_eventMgr.Clear();
```

---

## 使用模式

```csharp
// 发送
GameEvent.Send(GameEventID.OnHandDealt);
GameEvent.Send<int, int>(GameEventID.OnScoreChanged, score, delta);

// 监听（UI 内用 AddUIEvent，随窗销毁自动清理）
protected override void RegisterEvent()
{
    AddUIEvent(GameEventID.OnHandDealt, OnHandDealt);
    AddUIEvent<int, int>(GameEventID.OnScoreChanged, OnScoreChanged);
}

// 非 UI 类：用 GameEventMgr 批量管理，Dispose 时一次清理
private readonly GameEventMgr _eventMgr = new();
public void Init()    => _eventMgr.AddEvent<int, int>(GameEventID.OnScoreChanged, OnScoreChanged);
public void Dispose() => _eventMgr.Clear();
```

发送与监听的泛型参数必须与 `GameEventID` 该常量注释的「参数」行完全一致。

---

## 常见错误

### 1. UI 外部使用 AddEventListener（内存泄漏）

```csharp
// 错误：退出窗口不会自动清理
void SomeMethod()
    => GameEvent.AddEventListener<int, int>(GameEventID.OnScoreChanged, OnScoreChanged);

// 正确：窗口中用 AddUIEvent（自动清理）
protected override void RegisterEvent()
    => AddUIEvent<int, int>(GameEventID.OnScoreChanged, OnScoreChanged);

// 正确：非 UI 类用 GameEventMgr
private readonly GameEventMgr _eventMgr = new();
public void Dispose() => _eventMgr.Clear();
```

### 2. 在 GameEventID 之外定事件 ID

```csharp
// 错误：模块内私藏一个事件号
private const int MY_EVENT = 10001;   // 与商店段撞号，且总表看不到

// 正确：进 GameEventID 对应号段，带全注释
```

### 3. 事件回调签名不匹配

```csharp
// 错误：发送 int，监听 string -> 回调静默不执行，无任何日志
GameEvent.Send<int>(GameEventID.OnScoreChanged, score);
AddUIEvent<string>(GameEventID.OnScoreChanged, OnScore);

// 正确：两侧都对齐常量注释的「参数」行
GameEvent.Send<int, int>(GameEventID.OnScoreChanged, score, delta);
AddUIEvent<int, int>(GameEventID.OnScoreChanged, OnScoreChanged);
```

### 4. 非 UI 类忘记移除监听

```csharp
// 错误：销毁时不移除，回调引用已释放对象
public class PlayerSystem
{
    public void Init() => GameEvent.AddEventListener(GameEventID.OnXxx, OnXxx);
    // 没有 RemoveEventListener -> 泄漏
}

// 正确：使用 GameEventMgr 批量清理
private readonly GameEventMgr _eventMgr = new();
public void Init()    => _eventMgr.AddEvent(GameEventID.OnXxx, OnXxx);
public void Dispose() => _eventMgr.Clear();
```

### 5. 误用不存在的 API

```csharp
// 以下均不存在：
GameEvent.UnRegisterAll();
GameEvent.RegisterListener<ITrade>(impl);
GameEvent.Get<IBattleEvent>();          // 接口派发已整体移除

// 正确替代：
GameEvent.RemoveEventListener(eventId, handler);  // 移除单个
GameEventMgr.Clear();                             // 局部批量清除
GameEvent.Shutdown();                             // 全局清除（仅游戏退出）
```

---

## 交叉引用

| 相关文档 | 内容 |
|---------|------|
| ui-lifecycle.md | AddUIEvent 在窗口生命周期中的自动清理机制 |
| modules.md | GameModule 事件相关模块 |
| event-antipatterns.md | 事件系统反模式与避坑指南 |
| naming-rules.md | 事件常量的命名约定 |
| troubleshooting.md | 「监听收不到」的排查顺序 |
