# UI 生命周期与核心 API

> **适用场景**：窗生命周期、层级（UILayer）、ShowUIAsync/CloseUI API、节点绑定 | **关联文档**：[event-system.md](event-system.md)（AddUIEvent）、[ui-patterns.md](ui-patterns.md)（绑定与创建口径、Part 判据）、[naming-rules.md](naming-rules.md)（节点前缀）

---

## 一、核心 API

### UILayer 层级

枚举值即渲染顺序（`Depth = 层值 * UIModule.LAYER_DEEP`），值大者压在值小者之上。

| 值 | 层级 | 栈 | 用途 |
|----|------|------|------|
| 0 | Bottom | | 主玩法、主菜单 |
| 1 | UI | | 功能页（由入口进入、铺满屏的界面）|
| 2 | Top | | 常驻覆盖层：跨界面常显的 HUD |
| 3 | **Window** | ✅ | **弹窗层**：落本层的窗必须含全屏遮罩节点 `m_btn_Mask`，点它即关窗。父子弹窗、多级弹窗链一律落本层 |
| 4 | Tips | | 提示层（Toast、飘字），以及须与下层窗同时可见的弹框（判据见下「弹框落提示层」）。压在弹窗之上，使弹窗内操作的反馈可见 |
| 5 | System | | 系统层：错误日志窗（`UILogPanel`）等须压在一切之上的窗 |

#### 栈层：同层只显示栈顶

`Window` 是**栈层**（判据 `UIModule.IsStackedLayer`）：同层可共存多个窗，只有最上面那个可见，其余隐藏保留；
关掉栈顶自动露出下面一个，并对它重跑一次 `OnRefresh`。其余各层保持叠加语义。

- **父子弹窗同层即可**：列表点开详情、详情里再弹奖励，三级链全落 `Window` 层，逐层关闭一路退回。不必为
  「能同时在场」把子窗另放一层。例外只有一种，见下「弹框落提示层」。
- **被压住的窗仍然活着**：`Visible=false` 只切 GameObject.layer 与 raycaster，不是停用——事件监听照收、
  协程照跑，只有 `OnUpdate` 被拦。写窗内逻辑时不能假设「看不见就不会被调到」。
- **不设栈深上限**。

#### 弹框落提示层

判据：**下层窗被藏掉，玩家还看得懂这个弹框在说什么吗？** 看不懂就落 `Tips`，看得懂就落 `Window`。

- 落 `Tips`：弹框不铺满屏，文案或操作指向下层窗里的具体内容——哪一档、哪一行、哪件物品。入栈会把下层窗压住，
  弹框背后只剩更下面的界面。典型如通用确认框、在商店某件商品的「购买」上弹出的二次确认。
- 落 `Window`：子窗开出来就取代父窗成为玩家的注意力所在（详情页、下一级功能窗、结算窗），父窗此时可见与否不影响理解。

落 `Tips` 的弹框失去弹窗层的四项层默认，逐项补：

| 失去的 | 补法 | 漏了的症状 |
|--------|------|-----------|
| 缩放弹入 | prefab 窗根挂 `WindowPopInAnim`，其遮罩引用指向 `m_btn_Mask` 的 Graphic | 弹框硬切出现 |
| 缺遮罩节点时的创建期报错 | 照样放 `m_btn_Mask`（绑定与点遮罩关窗不看层，照常生效） | 不报错，下层窗的按钮可被点穿 |
| 被动入口的排队 | 只由玩家操作经手动入口开出（见「选哪个打开入口」） | 记 Error 并立即弹出，盖住玩家正在操作的界面 |
| 计入 HUD 收起判据（`UIModule.IsHudCollapsed`） | 下层有弹窗层 / 功能页层的窗在场时无须处理 | 直接压在常驻界面上时按钮区不收起 |

提示层里弹框按打开次序从波段起点逐个往上排；Toast、飘字这类覆盖件本作还没有，加进来时要定它们与弹框的上下次序（失败提示须压在弹框之上才看得见）。

改层另须过一遍 `.claude/rules-ondemand/ui-blocking-layer.md` 的两道核对。

**层是弹窗身份的唯一判据**，没有第二个标记。点遮罩关窗因而是层的机制而非各窗自选：遮罩绑定由
UI 生成器产出（`BindMask(m_btn_Mask);`，不产 `OnClick_MaskBtn`），关闭动作在 `UIPanelMono`，业务代码不写回调。

- 要禁掉点遮罩关闭（必须二选一的确认框）：覆写 `protected virtual bool DismissOnMask => false`，**不是不放遮罩节点**（遮罩另一半职责是挡住下层点击）。
- 要改「怎么关」（如先播退场动画再关）：覆写 `protected virtual void DismissByMask()`。
- **开窗防误点是框架的固定规则，窗不声明、没有覆写口**（玩家常在窗弹出的那一下还在连点上一个界面）。两条，时长同为 `UIModule.OpenGuardSeconds`（0.5s）：①任何带遮罩的窗，开窗后这段时间内点遮罩不收场——覆写过的 `DismissByMask` 同样被拦下，遮罩照样挡下层点击，窗内按钮不受影响；②被动入口弹出的窗另加整屏不收点击，连窗内按钮一起挡（见「选哪个打开入口」表）。某个窗觉得该锁更久或不该锁，改的是这条规则本身，不是给那个窗加例外。
- 弹窗层的窗缺遮罩节点：窗创建时 `Log.Error`（判据 = `UIPanelMono.IsPopupLayer`），窗一开即报。节点本身由 UI 生成器（`ScriptAutoGenerator`）产出，正常路径不会缺。
- **入场动画的层默认也按弹窗层给**（缩放弹入 `WindowPopIn`，退场镜像 `WindowPopOut`）。其余层的窗没有层默认，要动画就在 prefab 窗根挂 `UIWindowOpenAnim` 子类——现有 `WindowPopInAnim`（同一套缩放弹入，缩的是窗根、轴心在屏幕中心，只适合居中弹框）；滑入、分区入场等别的形态本作还没有，要用时新写子类。prefab 挂载优先于层默认。铺满背景的全屏页不要用层默认的整窗缩放——缩小时会露出下层，过冲时会裁掉页面边缘。要关掉入场 / 退场，覆写 `EnableOpenAnim` / `EnableExitAnim`。
- **开窗不播音效**：框架里的开窗音效与按钮点击音已剪掉（等音频表接入再补），窗上没有对应的覆写口。
- **弹窗层 / 功能页层的窗在场时，`UIModule.IsHudCollapsed` 置真**（翻转经 `HudCollapseChanged` 通知；常驻界面订阅它收起按钮区，订阅方负责成对解绑）。开着也要露出常驻按钮的窗，覆写 `protected virtual bool CollapseHudWhileOpen => false`。

### WindowAttribute 窗口标记

每个 `UIPanelMono` 子类必须标记 `[Window]` 特性，构造只有两种形态：
`(UILayer windowLayer, string location = "", bool fullScreen = false)` 与
`(UILayer windowLayer, bool fromResources, bool fullScreen = false)`（内置资源窗如 UILogPanel 用后者）：

```csharp
[Window(UILayer.Window, location: "UIShopPanel")]
public partial class UIShopPanel : UIPanelMono { }

[Window(UILayer.Bottom, fullScreen: true)]          // location 缺省 = 类名，现例 UIMainMenuPanel
public class UIMainMenuPanel : UIPanelMono { }
```

**location** 即 Prefab 资源地址（`AssetRaw/UI/` 树下的文件名，不含目录与扩展名）。收集范围是整个 `AssetRaw/UI`、寻址规则 `AddressByFileName`，故子目录不参与寻址、文件名须在该树下全局唯一；目录归属规约见 [ui-patterns.md](ui-patterns.md)§一。

### 窗生命周期

```
ShowUIAsync<T>()
    │
    ▼
ScriptGenerator()     ← 首次：挂事件回调（引用已由 [SerializeField] 序列化就位）
    │
    ▼
RegisterEvent()       ← 首次：注册 UI 事件（随窗口销毁自动清理）
    │
    ▼
OnCreate()            ← 首次：窗口创建初始化（仅一次）
    │
    ▼
OnRefresh()           ← 每次 ShowUIAsync 都执行（刷新显示数据）
    │
    ▼
OnUpdate()            ← 每帧更新（仅对可见窗驱动；子类 override 才有行为）
    │
    ▼
CloseUI()             ← 关闭流程：
    RemoveAllUIEvent()     ← 自动清理所有 UI 事件监听
        │
        ▼
    OnDestroyWindow()      ← 窗口自身销毁前清理（用户可重写）
        │
        ▼
    Destroy(gameObject)    ← 销毁 GameObject，窗内 Part 随子树一并销毁
                              （有入场动画的可见窗先留作外壳播镜像退场，播完再销毁，见下条）
```

**关键规则**：
- `ScriptGenerator` / `RegisterEvent` / `OnCreate` 只执行一次
- `OnRefresh` 每次 Show 都执行
- `OnUpdate` 只对可见窗驱动；尽量避免使用，改用 `GameModule.Timer`
- **关窗逻辑当帧生效，退场只是表现**：`CloseUI` 当帧出栈、跑 `OnDestroyWindow`、置 `IsDestroyed`、露出下层窗；有入场动画的可见窗再留 GameObject 作外壳播约 0.3s 的镜像退场（`UIWindowOpenAnim.PlayExit`，默认 `WindowPopOut`），期间锁全局输入（系统层的窗除外），该层排队的被动弹窗等外壳播完才接上。所以关窗后立刻判在不在、立刻重开同类型窗都照旧成立。已关闭的窗再调 `Close()` 不做任何事。自带退场演出、演完窗上已无可见内容的窗用 `CloseWithoutExit()`；`CloseAll` 一律当帧清掉、不播退场
- 用户可重写的销毁回调是 `OnDestroyWindow()`，不是 Unity 魔法名 `OnDestroy`（后者被基类占用作外部销毁的兜底），也不存在 `OnClose`
- 窗内 Part 不进框架托管：没有子部件注册表，也没有递归销毁，随窗的 GameObject 子树被 Unity 回收
- 完整前缀表见 [naming-rules.md](naming-rules.md#ui-节点命名规范)

### UIModule 核心 API

```csharp
// 打开窗口（fire and forget；已开着的窗重复调用 = 置顶复用并触发 OnRefresh）
GameModule.UI.ShowUIAsync<UIShopPanel>();
GameModule.UI.ShowUIAsync<UIGeneDetailPanel>(geneId);          // 携带用户数据（面板经 UserData 读）

// 系统自发弹出（非玩家操作触发）：栈层还有窗在场时排队等待，不打断玩家
GameModule.UI.ShowUIPassiveAsync<UIUnlockTipPanel>();

// 关闭
GameModule.UI.CloseUI<UIShopPanel>();   // 关闭：逻辑当帧生效，有入场动画的窗另播退场后销毁外壳
GameModule.UI.CloseAll();               // 关闭所有

// 查询 / 取已开窗
bool exists = GameModule.UI.HasWindow<UIShopPanel>();
var win = await GameModule.UI.GetUIAsyncAwait<UIShopPanel>();   // 取已打开的窗,未加载完则等它;不在栈中返 null,不触发打开
GameModule.UI.GetUIAsync<UIShopPanel>(w => { /* 就绪后回调 */ });

// 刚请求打开、prefab 还在加载的窗(此时不在栈里,上面两个拿到 null):先 ShowUIAsync 再等
GameModule.UI.ShowUIAsync<UIShopPanel>();
var opened = await GameModule.UI.WaitOpenedAsync(typeof(UIShopPanel));   // 开出来给实例;加载失败 / 途中被关 / 没人开它 / 被动入口还在排队 → null。不带超时,要上限自己套
```

#### 选哪个打开入口

判据是**这次打开玩家在不在等着看**，不是调用点在哪个文件。

| | 入口 | 行为 |
|---|---|---|
| 玩家点了按钮、或玩家正等着这个窗出现 | `ShowUIAsync` | 压栈顶，立即显示，盖住同层当前那个窗 |
| 系统流程自发弹出（解锁提示、成就达成这类玩家没在等的展示）| `ShowUIPassiveAsync` | 栈层有窗在场时排队，等该层清空才开出；窗出现后 0.5s 内锁全局输入（系统层窗除外），防玩家连点误触窗内按钮 |

- **默认是手动**：绝大多数调用点不需要改，只有自发触发点走被动入口。
- **流程编排代码里也可能是手动**：代码替玩家开出他接下来要操作的窗（如一局结束后进结算窗），玩家正等着它出现，走 `ShowUIAsync`；
  编排方若开窗后轮询 `GetUIPanel` 等它就绪，走被动会排队、排队即判失败。
- **用错的症状**：该弹的窗一直不弹（误用被动），或自发弹窗突然盖住玩家正在操作的界面（误用手动）。
- **排队中的窗没有实例**：`HasWindow` / `GetUIPanel` 对它返回「不存在」。要看某层此刻的占用与排队现场，
  诊断用 `UIModule.DescribeQueueStateFor`（只读，业务不消费）。
- 两条路汇进同一个静态入口的，来源由调用方经 `passive` 参数传入——中转层自己判不出来。
- **被动语义只对栈层（Window）成立**：非栈层（Tips 等）没有队列、`HoldPassive` 也管不到，被动入口打开非栈层窗会记
  Error 并立即弹出。系统自发的展示因此放进弹窗层的窗里，不落 Tips 层。

### 窗内部件（Part）

窗内部件是裸 `MonoBehaviour`，不进框架托管、没有框架生命周期：静态内嵌的由窗 `[SerializeField]` 直接持有，
数量数据驱动的由窗 `Instantiate` 自己序列化的 prefab 模板建出。创建口径与销毁归属见
[ui-patterns.md](ui-patterns.md)§一。

---

## 二、使用模式

### UI 内部事件（AddUIEvent）

在 `RegisterEvent()` 中使用，事件监听随窗口销毁**自动清理**：

```csharp
protected override void RegisterEvent()
{
    // 无泛型参数
    AddUIEvent(GameEventID.OnGoldChanged, OnGoldChanged);
    // 1 个泛型参数
    AddUIEvent<int>(GameEventID.OnHpChanged, OnHpChanged);
    // 2 个泛型参数
    AddUIEvent<int, string>(GameEventID.OnItemAcquired, OnItemAcquired);
    // 3 个泛型参数
    AddUIEvent<int, string, float>(GameEventID.OnAttrModified, OnAttrModified);
}
```

**AddUIEvent 支持 0~3 个泛型参数**：`AddUIEvent`、`AddUIEvent<T>`、`AddUIEvent<T,U>`、`AddUIEvent<T,U,V>`。

### 服务事件订阅（AddServiceEvent）

`AddUIEvent` 只管 GameEvent 总线；订阅**服务对象自身的 `event Action`**（判据见
[event-system.md](event-system.md)「选哪条通知路径」）走基类登记表，随窗销毁自动解绑：

```csharp
protected void AddServiceEvent(Action attach, Action detach)   // attach 立即执行；detach 登记，窗销毁统一执行
```

解绑时机先于 `OnDestroyWindow`（与 `AddUIEvent` 同）：销毁回调里改服务状态触发的事件不会再回到本窗。

```csharp
protected override void OnCreate()
{
    var shop = ShopService.Instance;   // 示意：任一持有 event Action 的服务对象
    AddServiceEvent(() => shop.OnStockChanged += OnStockChanged,
                    () => shop.OnStockChanged -= OnStockChanged);
}
```

- 闭包捕获**服务实例快照**：detach 解的恒是挂上去的那个实例，开新局换服务实例也不会解错对象。
- 静态事件同样适用（attach/detach 里写静态事件的 `+=` / `-=` 即可）。
- 撤销时点在 `OnDestroyWindow` **之后**，框架显式关闭与 GameObject 被外部销毁两条路径都执行。
- 裸 `MonoBehaviour` 的 Part 无基类设施，仍须手写成对解绑（自身 `OnDestroy` 里）。

### 窗生命周期令牌（LifetimeToken）

```csharp
protected CancellationToken LifetimeToken   // 首访建取消源；窗销毁时 Cancel + Dispose
```

窗生命周期内的异步操作（图标 `SetSprite` 等）传它，不再各窗手写「建 CTS / 销毁 Cancel+Dispose」三段：

```csharp
m_img_Preview.SetSprite(entry.PreviewPic, false, null, LifetimeToken);
```

边界：令牌随窗**一次性**。「每次刷新换代、取消上一批在途加载」的场景（防上轮迟到的图落到已被
复用的格子上）语义不同，仍自持 `CancellationTokenSource` 逐轮重建。

### 只关一次与主倒计时（CloseOnce / BindCountdown）

限时窗的关窗来源不止一个（到点、局面判已结束、买完），同一帧撞上时只能关一次、提示一次；
它的主倒计时要在关窗与窗销毁时停表。这两件事由基类承担，不再各窗手写「已在关标志 + 关窗函数 + 倒计时字段 + 销毁停表」：

```csharp
protected bool IsClosing { get; }            // CloseOnce 置位；每次 OnRefresh 之前由基类复位
protected void CloseOnce(string tip = null)  // 只关一次；tip 非空先出一条提示（经 UIPanelMono.TipPresenter，
                                             // 本作尚未注入，未注入时提示丢弃并记 Error）；同时停主倒计时

// 基类持有的主倒计时：重复调用先停旧表；已在关则不起；关窗 / 窗销毁自动停。参数同 CountdownBinder
protected void BindCountdown(Action<string> write, Func<long> remainMs, Func<long, string> format,
    string expiredText, Action onExpired)
// 常用形：到点文本与关窗提示是同一句，到点即 CloseOnce(expiredTip)
protected void BindExpiryCountdown(Action<string> write, Func<long> remainMs, Func<long, string> format,
    string expiredTip)
protected void UnbindCountdown()             // 只停不起（如「无剩余时间整块隐藏」的提前返回路径）
```

```csharp
protected override void OnRefresh()
{
    Refresh();
    BindExpiryCountdown(text => m_text_Countdown.text = text, RemainMs,
        remain => "本轮剩余: " + (remain / 1000) + " 秒", "本轮已结束");
}

private void Refresh()
{
    if (IsClosing) return;
    if (View == null) { CloseOnce("本轮已结束"); return; }
    // …
}
```

- 主倒计时一窗一块。窗里的第二块表（如解锁倒计时）仍自持 `CountdownBinder`，在 `OnDestroyWindow` 里停。
- 关窗时要停的补间不必在关窗处另写：`CloseUI` 当帧跑 `OnDestroyWindow`，在那里停一次即可。
- 不是窗的组合件（关窗走宿主递进的委托）无基类设施，仍自持标志与表。

### 典型窗口实现

```csharp
[Window(UILayer.UI, "UIShopPanel")]
public partial class UIShopPanel : UIPanelMono
{
    private List<ShopSlotPart> _slots = new();

    protected override void ScriptGenerator()
    {
        // 绑定 UI 节点引用
    }

    protected override void RegisterEvent()
    {
        AddUIEvent<int>(GameEventID.OnItemChanged, OnItemChanged);
    }

    protected override void OnCreate()
    {
        // 一次性初始化（建 Part 等）
    }

    protected override void OnRefresh()
    {
        // 每次 Show 时刷新数据
    }

    // 仅在需要每帧更新时 override；只对可见窗驱动
    // protected override void OnUpdate() { }

    protected override void OnDestroyWindow()
    {
        // 销毁前清理（窗内 Part 随 GameObject 子树被 Unity 回收，不需在此逐个处理）
    }
}
```

---

## 三、常见错误

| 错误 | 正确做法 |
|------|---------|
| 在 `RegisterEvent` 外使用 `GameEvent.AddEventListener` | 使用 `AddUIEvent`（自动随窗口销毁清理），详见 [event-system.md](event-system.md#常见错误) |
| 服务事件手写「`+=` / `OnDestroyWindow` 里 `-=`」镜像对 | 用 `AddServiceEvent(attach, detach)`——手写漏 detach 不报错只泄漏，登记表随窗销毁统一解绑 |
| 限时窗手写「`_closing` 标志 + `CloseWith` + 倒计时字段 + 销毁停表」 | 用 `CloseOnce` 与 `BindExpiryCountdown` / `BindCountdown`——漏停的表会在已销毁的窗上继续写文本 |
| override `OnUpdate` 但忘记实际需要每帧更新 | 优先使用 `GameModule.Timer`，避免不必要的每帧计算 |
| 使用不存在的 `OnClose` 方法 | 销毁回调为 `OnDestroyWindow()`（`protected virtual`）|
| override `OnDestroy()` 做清理 | 用 `OnDestroyWindow()`；`OnDestroy` 是 Unity 魔法回调，在 `UIPanelMono` 中为 `private` 且被 `IsDestroyed` 守卫防双触发，子类覆盖不到 |
| 在 `OnDestroyWindow` 中逐个销毁窗内 Part | 不需要；Part 随宿主 GameObject 子树被 Unity 回收 |

---

## 四、交叉引用

| 主题 | 文档 |
|------|------|
| 事件系统详细用法与避坑 | [event-system.md](event-system.md) |
| UI 进阶模式（绑定与创建口径、Part 判据） | [ui-patterns.md](ui-patterns.md) |
| 资源加载与生命周期 | [resource-api.md](resource-api.md) |
| 命名规范与节点前缀 | [naming-rules.md](naming-rules.md) |
| 模块 API（Timer 等） | [modules.md](modules.md) |
