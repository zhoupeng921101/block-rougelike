# 事件系统反模式与避坑指南

> **适用场景**：事件内存泄漏排查、监听收不到的定位、事件风暴问题 | **关联文档**：[event-system.md](event-system.md)（核心 API 与事件 ID 定义）、[ui-lifecycle.md](ui-lifecycle.md)（AddUIEvent 自动清理）、[troubleshooting.md](troubleshooting.md)（排查顺序）

> 本文档是 [event-system.md](event-system.md) 的进阶补充，聚焦于难以排查的陷阱和反模式。

---

## 一、内存泄漏反模式

### 反模式 1：窗口内在 RegisterEvent 外直接 AddEventListener

```csharp
// ❌ 错误：退出窗口后监听不清理，回调引用已销毁的对象
public partial class UIBagPanel : UIPanelMono
{
    protected override void OnCreate()
    {
        // 在 OnCreate 而非 RegisterEvent 中注册，且用了全局方法
        GameEvent.AddEventListener<int>(GameEventID.OnItemChanged, OnItemChanged);
    }
}

// ✅ 正确：RegisterEvent 内使用 AddUIEvent，随窗口销毁自动清理
public partial class UIBagPanel : UIPanelMono
{
    protected override void RegisterEvent()
    {
        AddUIEvent<int>(GameEventID.OnItemChanged, OnItemChanged);
    }
}
```

**为何危险**：`AddUIEvent` 在 `RemoveAllUIEvent()` 时批量清理（窗口销毁流程自动调用）。`GameEvent.AddEventListener` 不会自动清理，窗口销毁后仍持有回调引用，导致访问已销毁 GameObject。

---

### 反模式 2：非 UI 类不清理监听

```csharp
// ❌ 错误：系统类注册事件但从不移除
public class PlayerSystem
{
    public void Init()
    {
        GameEvent.AddEventListener(GameEventID.OnLevelUp, OnLevelUp);
        GameEvent.AddEventListener<int>(GameEventID.OnHpChanged, OnHpChanged);
        // 没有对应的 Remove
    }
}

// ✅ 正确：用 GameEventMgr 统一管理，Dispose 时一次清理
public class PlayerSystem
{
    private readonly GameEventMgr _eventMgr = new();

    public void Init()
    {
        _eventMgr.AddEvent(GameEventID.OnLevelUp, OnLevelUp);
        _eventMgr.AddEvent<int>(GameEventID.OnHpChanged, OnHpChanged);
    }

    public void Dispose() => _eventMgr.Clear();
}
```

---

### 反模式 3：Lambda 捕获导致泄漏

```csharp
// ❌ 错误：Lambda 无法用 RemoveEventListener 移除（引用不同）
public void Init()
{
    GameEvent.AddEventListener<int>(GameEventID.OnHpChanged, hp => { _textHp.text = hp.ToString(); });
    // 后续 RemoveEventListener 传入新 Lambda，无法匹配
}

// ✅ 正确：命名方法，可精确移除；或改用 GameEventMgr/AddUIEvent
private void OnHpChanged(int hp) => _textHp.text = hp.ToString();

public void Init()   => _eventMgr.AddEvent<int>(GameEventID.OnHpChanged, OnHpChanged);
public void Dispose() => _eventMgr.Clear();
```

---

## 二、事件 ID 反模式

### 反模式 4：在事件 ID 表之外定事件 ID

```csharp
// ❌ 错误：模块内私藏事件号
public class ShopSystem
{
    private const int EVT_SHOP_REFRESHED = 10001;   // 与商店段既有号相撞，且总表里查不到
}

// ✅ 正确：进事件 ID 表 GameEventID 对应业务号段，带全注释
```

**为何危险**：撞号的两个事件共用一个分发槽位，双方的回调会被对方的 `Send` 触发。表现取决于泛参是否恰好兼容——不兼容则静默不执行，兼容则收到语义完全错误的数据。事件 ID 只在 `GameEventID` 一张表里定义、按号段分业务(见 [event-system.md](event-system.md)「号段规则」)，这是撞号唯一的检出场所。

---

### 反模式 5：复用已删除事件的号

```csharp
// ❌ 错误：某事件下线后，把它的号让给新事件
public const int OnGeneBought = 10001;   // 10001 原属已下线的 OnShopRefreshed

// ✅ 正确：在号段末尾续新号，旧号留空不复用
```

**为何危险**：号一旦出现在日志、埋点或外部记录里就成了历史数据的一部分。复用会让同一个数值在时间轴上指向两件事，事后追查无法区分。

---

## 三、类型不匹配导致监听静默失效

### 反模式 6：Send 与监听侧泛型参数不一致

```csharp
// ❌ 错误：发送 int，监听 float → 回调静默不执行
GameEvent.Send<int>(GameEventID.OnHpChanged, 100);
AddUIEvent<float>(GameEventID.OnHpChanged, OnHpChanged);

// ❌ 错误：发送 (int, string)，监听 (string, int) → 同样静默
GameEvent.Send<int, string>(GameEventID.OnItemAcquired, 1, "sword");
AddUIEvent<string, int>(GameEventID.OnItemAcquired, OnItemAcquired);

// ✅ 正确：两侧都对齐 GameEventID 该常量注释的「参数」行
GameEvent.Send<int>(GameEventID.OnHpChanged, 100);
AddUIEvent<int>(GameEventID.OnHpChanged, OnHpChanged);
```

**为何最难排查**：`EventDelegateData.Callback<T>` 遍历回调时用 `d is Action<T> action` 做类型模式匹配，不成立就跳过——**不抛异常、不记日志、不计数**。表现是「事件确实发出去了，监听方毫无反应，Console 干净」。

这是本事件系统排查成本最高的一类错误，且**没有自动化拦截**：唯一防线是事件 ID 表 `GameEventID` 常量注释的「参数」行——写新事件时必须写全，用既有事件时必须对照。

---

## 四、事件风暴反模式

### 反模式 7：事件回调中触发同类事件

```csharp
// ❌ 危险：OnGoldChanged 回调中又发送 OnGoldChanged → 无限递归
private void OnGoldChanged(int gold)
{
    _textGold.text = gold.ToString();
    if (gold > 1000)
    {
        GameEvent.Send<int>(GameEventID.OnGoldChanged, gold - 100);  // 递归！
    }
}

// ✅ 正确：事件回调只更新 UI，业务逻辑由系统层控制
private void OnGoldChanged(int gold)
{
    _textGold.text = gold.ToString();
}
```

---

### 反模式 8：高频事件直接更新 UI

```csharp
// ❌ 错误：每帧都发送并直接更新 UI，产生大量 UI 重绘
void Update()
{
    GameEvent.Send<Vector3>(GameEventID.OnPositionChanged, _hero.position);
}

// ✅ 正确：高频数据用 Timer 轮询或 OnUpdate 节流
int _timerId;

protected override void OnCreate()
{
    _timerId = GameModule.Timer.AddTimer(RefreshPosition, time: 0.1f, isLoop: true);
}

protected override void OnDestroyWindow()
{
    GameModule.Timer.RemoveTimer(_timerId);
}

private void RefreshPosition() => _textPos.text = _hero.position.ToString();
```

---

## 五、生命周期时序陷阱

### 反模式 9：在 OnCreate 之前访问数据

```csharp
// 窗口生命周期顺序：ScriptGenerator → RegisterEvent → OnCreate → OnRefresh
// RegisterEvent 在 OnCreate 之前执行，此时数据可能未就绪

// ❌ 错误：RegisterEvent 中直接访问需在 OnCreate 初始化的数据
protected override void RegisterEvent()
{
    AddUIEvent<int>(GameEventID.OnHpChanged, RefreshHp);
    RefreshHp(_currentHp);   // _currentHp 在 OnCreate 中初始化，此时为默认值
}

// ✅ 正确：RegisterEvent 只注册，OnRefresh 做刷新
protected override void RegisterEvent()
{
    AddUIEvent<int>(GameEventID.OnHpChanged, RefreshHp);
}

protected override void OnRefresh()
{
    RefreshHp(PlayerData.Hp);   // 每次 ShowUIAsync 时刷新
}
```

---

## 六、不存在的 API（AI 常见幻觉）

```csharp
// ❌ 以下 API 均不存在，编译失败：
GameEvent.UnRegisterAll();                    // 不存在
GameEvent.UnRegisterAll<int>(eventId);        // 不存在
GameEvent.RegisterListener<ITrade>(impl);     // 不存在
GameEvent.ClearAll();                         // 不存在
GameEvent.RemoveAll(eventId);                 // 不存在
GameEvent.Get<IBattleEvent>();                // 接口派发已整体移除
GameEventHelper.Init();                       // 源生成器已删除，此类不再存在

// ✅ 正确替代：
GameEvent.RemoveEventListener(eventId, handler);   // 移除单个监听
GameEventMgr.Clear();                              // 局部批量清除
GameEvent.Shutdown();                              // 全局清除（仅游戏退出时）
```

---

## 交叉引用

| 主题 | 文档 |
|------|------|
| 事件系统核心 API 与 ID 定义 | [event-system.md](event-system.md) |
| 窗口生命周期与 AddUIEvent | [ui-lifecycle.md](ui-lifecycle.md) |
| Timer 替代高频事件 | [modules.md](modules.md) |
| 「监听收不到」排查顺序 | [troubleshooting.md](troubleshooting.md) |
