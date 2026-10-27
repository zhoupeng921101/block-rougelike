# UI 开发模式与模板

> **适用场景**:窗与 Part 的两档划分、引用绑定与创建口径、Inspector 公开参数、prefab 静态挂载优先、提示出口 | **关联文档**:[ui-lifecycle.md](ui-lifecycle.md)(生命周期)、[naming-rules.md](naming-rules.md)(节点前缀)

## 一、引用绑定与创建口径

### 引用绑定:序列化,不做运行时查找

窗与 Part 的节点引用一律 `[SerializeField]` 字段 + prefab 序列化就位,字段名与节点名恒等(MPrefix 风格)。
**字段从哪来按档分**:窗的字段与事件挂载由 `ScriptGenerator` 生成进 `_Gen.g.cs`(落 `GameLogic/UI/Gen/`);**Part 是手写单文件**,字段与 `Awake()` 里的挂载自己写在 `XxxPart.cs` 内,不产生成物。
两档的绑定都由 `UIBindingService`(`Assets/Editor/UIScriptGenerator/`)按节点名写回——它反射扫类型上的 `[SerializeField]` 特性,与字段写在哪个文件无关。
不用运行时按路径查找——路径拼错要跑到那行才炸,序列化引用漏拖则由 `TEngine/UI 绑定/只校验 UI prefab 引用(不改动)` 全量扫出。

**一个节点只能有一个名字,故 `m_part_` 自动绑不是恒能用**:节点名已被别的用途占住(如盘面区节点要以 `m_rect_BoardLayer` 的身份供几何计算取用)时,该 Part 的引用退回手拖的普通 `[SerializeField]` 字段,不进 `_Gen`。此时字段名与节点名不再恒等,**自动绑定不覆盖它**(绑定按前缀逐字段精确匹配),但**漏拖仍会被校验扫出**——反查空引用的范围比绑定宽,凡对象引用型的序列化字段都查,不限命中绑定前缀的那些。

```csharp
// UIBattlePanel_Gen.g.cs(生成物,勿手改;示意)
public partial class UIBattlePanel : UIPanelMono
{
    [SerializeField] private RectTransform m_rect_BoardLayer = null!;
    [SerializeField] private Button m_btn_Discard = null!;
    [SerializeField] private HandAreaPart m_part_HandArea = null!;

    protected override void ScriptGenerator()   // 窗档独有;Part 手写,挂载写在自己的 Awake() 里
    {
        m_btn_Discard.onClick.RemoveAllListeners();
        m_btn_Discard.onClick.AddListener(OnClick_DiscardBtn);
    }
}
```

### 创建口径:默认拍平内嵌,命中判据才切独立 prefab

先判这个 Part 要不要切成独立 prefab 资产,命中任一则切:

1. **获取方式是按名加载** —— YooAsset 按 location 名异步加载(`LoadGameObjectAsync`)
2. **被 ≥2 个宿主引用** —— 宿主 = 持有它的 Panel 或 Part,数法是数持有它的 `[SerializeField]` 字段或嵌它的容器有几处,**与这些宿主是否同处一个父 prefab 无关**
3. **作列表 / 网格的复制模板** —— 单处嵌入同样适用:模板独立成资产才能单独打开编辑,改它也照样传播到各嵌入处

**三条是默认推定,不是机械判决**:拿不准,或有判据未覆盖的理由(将来的复用预期、需要单独打开编辑),切不切由人裁定,不照判据自动执行。

三条都不命中的拍平进父 prefab:节点树静态摆好、宿主 `[SerializeField]` 直接持有(`m_part_` 前缀可自动绑),**不留独立 prefab 文件**。

**切不切资产、份数归谁管,是两个各判各的问题**。份数由数据决定的,宿主持模板(`[SerializeField] GameObject`)+ `UIPartFactory.Create<T>` 逐个建、并自行负责复用与销毁(见下方示例与 §二 第 5 条)。

> block-client 用一个 `ItemContainer` 组件管「同一容器下的份数」(模板放容器索引 0,`SetCount(n, onBind)` 不足克隆、多余停用留池),本作没有搬入,生成器的 `m_container_` 前缀因此不能用(见 [naming-rules.md](naming-rules.md#ui-节点命名规范))。同类需求第二次出现时考虑搬它,不在各窗各写一套「克隆 + 记账 + 清理」。

> 嵌套进父 prefab 的模板若自身带 `m_` 前缀子节点(判据看模板自己的 Part 类里有没有 `m_` 前缀的 `[SerializeField]` 字段;零字段的不算),模板节点名必须用 `m_part_` 前缀:生成器只在 `m_part_` / `m_item_` 处停止下钻,否则模板内部的子节点会被一并扫成宿主自己的字段。

> 不复用却保留独立资产、又只嵌一次,两边成本同时承担:改一处要开两个资产,prefab override 让「实例值 vs 资产值」出现两处真值,资产列表也看不出它到底复不复用。

**切出来的 prefab 放哪**:`Assets/AssetRaw/UI/Prefabs/` **根只放 Panel**(顶层窗口),Part、特效模板、按名加载的格模板一律进子目录 `Assets/AssetRaw/UI/Prefabs/Parts/`(第一个 Part 时建)。判据与 Panel/Part 两档同一条:是不是顶层窗口。**文件名须在 `AssetRaw/UI` 树下唯一**,重名即 location 撞车。

> 目录不参与寻址:collector 组 `UIPrefab` 收 `Assets/AssetRaw/UI` 整树的 prefab、寻址规则 `AddressByFileName`,故 location 只由文件名决定。两条约束的性质不同——**文件名唯一有构建期兜底**(`EnableAddressable` 开启时,收集期检出重复地址即抛 `The address is existed`,构建失败);**目录归属没有任何机制反馈**,放错既不报错也不影响加载,只影响人读,不主动核对就不会暴露。

模板走序列化引用而非按名加载:依赖随宿主 prefab 一并进 bundle 并驻留,`Instantiate` 是纯实例化、零资源 LOAD,
且漏拖在编辑期就被扫出,不必靠手维护的字符串清单兜底。

```csharp
public sealed class HandAreaPart : MonoBehaviour
{
    [SerializeField] private GameObject _blockPrefab;

    private void BuildCell(RectTransform pieceRoot /* , … */)
    {
        var cell = UIPartFactory.Create<BlockCellPart>(_blockPrefab, pieceRoot, nameof(HandAreaPart));
        if (cell == null) return;   // 失败原因已由 UIPartFactory 记录
        // 摆位、贴皮…
    }
}
```

**销毁**:动态建的由宿主 `Destroy(part.gameObject)`;静态内嵌的随宿主子树被 Unity 回收,不需登记。
Part 是裸 `MonoBehaviour`,没有 `rectTransform` 便捷属性,需要就在类内写一行
`public RectTransform rectTransform => (RectTransform)transform;`。

---

## 二、常见错误

1. **异步续体缺销毁守卫**:窗/Part 内 `await`(资源加载、延时、演出)之后的续体要触碰窗内控件或状态时,先 `if (IsDestroyed) return;` 再触碰——await 常晚于玩家关窗,续体在已销毁对象上取组件(尤其 `GetComponentInChildren`,序列化字段的 fake-null 判空挡不住它)会抛 MissingReferenceException,游离的提示与事件也会凭空出现。守卫放在「全局副作用」(提示、GameEvent 广播——它们不依赖本窗存活,结果须照常送达监听方)之后、触碰本窗之前。只触碰全局服务、不碰窗内状态的续体不必加。
   > 复发依据:block-client 相邻两日各漏一次(2026-07-31 / 08-01 夜审)。
2. **Part 的清理钩子写成框架回调**:Part 不进框架托管,没有框架销毁回调,清理一律写 Unity 的 `OnDestroy`。
3. **`m_part_` 节点上挂了多个 `*Part` 组件**:生成器无从判定该绑哪个,直接报错不生成字段。一个节点一个 Part。
4. **改了节点树忘了重绑**:窗侧重生成 `_Gen`(不碰 impl)、Part 侧手改 `XxxPart.cs` 里的字段 → 等编译 → 跑 `TEngine/UI 绑定/全量绑定并校验 UI prefab 引用`。字段名与节点名恒等是绑定的前提,改名两边同步。
5. **绑定时读 `rect` 算尺寸**:LayoutGroup 下的格子尺寸由布局写入,prefab 里存盘为 0;刚克隆出的份在绑定回调里还没布局,`rect` 是 0 甚至为负(四边内缩的子节点),之后布局改列宽还会再变。格内要按格子大小摆的子节点用锚点按比例铺(要保方形套 `AspectRatioFitter`),不在绑定时量像素;非量不可的放到布局之后。
   > 复发依据:block-client 的形状层绑定时量图标 rect,固定尺寸格里正常,换到动态网格即画不出(2026-09-29)。

---

## 三、UI 两档:Panel / Part(选哪个基类)

挂在 GameObject 上的 UI 脚本只有两档:

| 档 | 基类 | 托管性 | 用于 |
|---|---|---|------|
| Panel | `UIPanelMono` | 框架托管窗口(生命周期由 `UIModule` 驱动) | 顶层窗口 |
| Part | 裸 `MonoBehaviour` | 非托管、宿主自持 | 窗内一切部件 |

**判据只有一条:是不是顶层窗口**。是 → `UIPanelMono`;其余一律裸 `MonoBehaviour`——窗内子部件、表现组件(`UI/VFX/` 下的开关窗动画)、交互 handler(拖拽落子等)都在此档,不存在需要另行判定的中间层。

**Part 的生命周期归宿主**:静态内嵌的由宿主 `[SerializeField]` 直接持有;数量数据驱动的由宿主 `UIPartFactory.Create<T>` 逐个建。销毁随宿主子树被 Unity 回收,需要清理钩子就写 Unity 的 `OnDestroy`。窗关闭时 `UIPanelMono.InternalDestroy` 销毁自身 GameObject,窗内 Part 随之一并销毁,无需注册。

**命名**:一律 `Part` 后缀。生成器的 `m_part_` 前缀按「类名以 `Part` 结尾」反射推导字段类型,不守这条命名的类绑不上。

**新建 Part 前先查重**:`Glob **/*Part.cs`,有可复用的先复用,不重复造。本作现在还没有 Part;block-client 的盘面部件(棋盘格、候选块、拖拽件)按工程计划随阶段 4 移植,届时以移植后的实际为准。

### 窗内视图逻辑不一定要挂 GameObject

上面两档说的是**挂在 GameObject 上**的脚本。一段视图逻辑要不要挂,先问它用不用得上 MonoBehaviour 的五项收益:

1. `m_part_` 自动绑定(要节点名以 `m_part_` 起头、类名以 `Part` 结尾)
2. `[SerializeField]` 手感参数有 prefab 载体可调(§四)
3. Unity 生命周期回调(`OnEnable` / `OnDisable` / `OnDestroy`)
4. 能被 `GetComponentsInChildren<T>` 按接口发现
5. 能挂在运行时克隆的模板上,由 `UIPartFactory` 逐个建

**五项一项都用不上 → 写成普通类**,宿主持节点的绑定字段、`Init` 时 `new` 出视图并把根 `RectTransform` 传进去,
节点仍由 prefab 静态摆好。此时 MonoBehaviour 外壳是纯负担:prefab 上多一个可漏挂的组件,类还被序列化面绑住。

> `m_item_` 前缀本身就是信号:它绑的是 `GameObject`、且是生成器的下钻边界(见 [naming-rules.md](naming-rules.md#ui-节点命名规范)),
> 往这种节点上挂 Part 与该前缀的语义冲突——挂 Part 的前缀是 `m_part_`。

**硬限制:普通类没有 Unity 回调**。凡「节点被停用 / 销毁时要收尾」的逻辑一律留在 Part 档:
解服务对象的事件订阅、释放运行时 `new` 的材质、取消在途的异步加载与补间(加载令牌取自 `GetCancellationTokenOnDestroy`、补间在 `OnDestroy` 里 `DOKill`)。
这类收尾漏做不报错——宿主已销毁而服务仍握着回调,下一次触发才炸在一个不存在的对象上。
视图类的清理只能由宿主在自己的销毁路径上显式调,漏调没有任何机制兜底。

**参数归宿主**:视图类没有 prefab 载体,手感参数按 §四「前提:参数得有序列化载体」的同一论证,
放到宿主窗的 `[SerializeField]` 上,由宿主读了传进来或经委托现取。

---

## 四、可挂载脚本的可视化参数(Inspector 公开约定)

写 MonoBehaviour 脚本(UI widget,及挂在 GameObject 上的表现组件如 `UI/VFX/` 下的开关窗动画)时,设计师要靠手感调的参数用 `[SerializeField]` 公开到 Inspector,不写死成 `const`。

- **该公开**:时长、缓动量、速度、频率、摆幅、颜色、偏移、阈值、缩放系数;以及编辑器里要拖的引用(目标 Transform、特效 prefab)。
- **不公开(留 `private`/`const`)**:运行时可变状态(缓存组件、相位计数器)、可从别的值推导的量、改动会破坏不变量的结构性常量(是契约,不是调参)。

判据不是「是不是数值」,而是「这个值是否要靠手感调」:要调 → `[SerializeField]`;是不该被动的契约 → `const`。

**前提:参数得有序列化载体**。上面这条判据只问值的性质,还有一个前置条件——`[SerializeField]` 的调参能力来自 prefab 上那份资产数据。组件只由运行时 `AddComponent` 创建、不挂在任何 prefab 上时,没有资产承载覆写值:编辑期该节点上根本没有这个组件、无从调,Play 态改了也不回写。此时字段值仍只由字段初始化器决定(实测 `AddComponent` 建出的实例读到的就是初始化器的值,非 type default),公开等于零收益,只多出热更程序集的序列化面——**参数留 `const`**。

无载体的组件有两种形态,都适用本条:

- **一次性动作**——`AddComponent` 即开播,播完 `Destroy` 掉自己或所在 GameObject,没有等待触发的状态;挂 prefab 上会在实例化那一刻就播一次,不是「不想挂」而是挂不了。`WindowPopIn` / `WindowPopOut`(层默认的缩放弹入与退场,由框架在窗根 `AddComponent`)属此档,手感参数一律 `const`。
- **常驻但运行时挂载**——`gameObject.GetOrAddComponent<T>()`(TEngine `UnityExtension`,内部显式 `== null`)取或加,播完转空闲、不自毁,留给同节点下一次复用,随宿主 GameObject 回收。这一档同样没有序列化载体,手感参数照样留 `const`。

静态挂在 prefab 上的另算一档:`WindowPopInAnim` 由 prefab 窗根挂载、遮罩引用在 Inspector 里拖——**这一档才公开 `[SerializeField]`**。判断某个组件属哪档,grep 它的创建点即可:全是 `AddComponent` 就没有载体。

要让这类参数可调,得先造载体——宿主持 `[SerializeField]` 参数、`AddComponent` 后传进去。那是改接口,不是加个属性能解决的,按需求单独立项。

可视化好用的配套:`[Header]` 按语义分组、`[Tooltip]` 写清单位与含义、有界数值加 `[Range(min,max)]`、给能开箱即用的默认值(prefab 未覆写也应表现正常)。

```csharp
public sealed class HandAreaPart : MonoBehaviour
{
    [Header("发块飞入")]
    [Tooltip("单块从牌堆飞进手牌槽的时长(秒)。")]
    [SerializeField, Range(0.2f, 1.2f)] private float _dealInDur = 0.5f;
}

public sealed class BoardPart : MonoBehaviour
{
    private const int BoardSize = 8;   // 结构性常量:prefab 上摆的就是 8×8 格,改它两边对不上,不是调参
}
```

> 热更程序集(`GameLogic`)的 MonoBehaviour,`[SerializeField]` 在编辑器内正常序列化;开 HybridCLR 后真机运行时靠它补元数据绑值。届时新增此类可序列化字段后,首次上真机需确认存值正确绑回,否则出现「编辑器调好、真机显默认」。HybridCLR 暂关、走 Mono 时不涉此险。

---

## 五、prefab 静态挂载优先于代码动态添加

能在 prefab 里静态挂好的东西——组件、材质、事件绑定、对固定资源的引用——优先挂在 prefab 上,不在代码里运行时 `new` / `AddComponent` / 赋值。prefab 是美术/策划可视编辑的单一事实源;代码动态添加把本可见的结构藏进运行时,并增加生命周期负担(运行时 `new Material` 须自己 `Destroy`、`new` 组件须自己管引用)。

- **优先静态挂 prefab**:固定组件(Button/Toggle 等交互件)、对固定资源(材质/prefab/图集)的引用、编辑期已知的绑定、**运行时不改属性的材质**。代码里只**取引用用**(`GetComponent<T>()` / 读 `m_img_X.material`),不创建。
- **仅以下情形才代码动态创建/添加**(静态确实挂不了):
  - **运行时会改属性的材质**:代码逐帧/按态 `SetFloat`/`SetColor`/`SetVectorArray` 的材质,须 `new Material(模板)` 克隆出实例再改——`Image.material`(`Graphic.material`)返回的是 prefab 上那份**共享 .mat 资产本身、不克隆**(与 `Renderer.material` 不同),直接改会污染该资产(Editor Play 态写入不随退出还原、且多窗/多实例互相踩)。prefab 仍挂模板(承载 shader + 可调默认值),代码克隆、`OnDestroy` 时 `Destroy` 实例。
  - **per-instance 独立状态**:同一材质/组件需按实例各持不同状态(如逐格 grayscale / glow,每格点亮态不同,必须每格 `new Material`)。
  - **数据驱动的数量/种类**:实例个数或类型由配置/运行时决定 → 运行时克隆,走 §一 的 `UIPartFactory`;份数是锁定的设计常量时也不在 prefab 里手摆 N 份再靠人工同步节点数,同样由数据驱动建出。
    > 复用停用件而非销毁重建时,逐份绑定须全量覆盖显隐与监听两向:上一轮绑的显示与 onClick 监听都还在这个复用件上,只改差异项会串状态。
  - **运行时才可知的目标**:绑定对象在编辑期不存在。

判据:这份东西在编辑期**已知且单一、且运行时不改**? 是 → 挂 prefab、代码只取用;否(运行时要改材质属性 / 按实例异 / 按数据变 / 运行时才有) → 代码动态建(材质走「prefab 挂模板 + 代码克隆」)。

> 别把「用到 shader / 自定义材质」一律当成要从头 `new Material(shader)`:shader 与默认值交给 prefab 上的 .mat 模板,代码仅在「运行时要改材质属性」时克隆模板。反过来单实例卡面材质(全局仅一份)也别当成能静态改:`Image.material` 返回共享资产,单实例直接改它同样污染 prefab 的 .mat,仍须克隆。

## 六、提示出口

本作还没有提示设施(Toast、对白气泡、通用确认框、奖励展示都没有搬)。窗内要出一句提示的口只有一个:`UIPanelMono.TipPresenter`(静态委托,`CloseOnce(tip)` 等经它出);现在没人注入,提示被丢弃并记 Error。

加提示设施时在本节补「要告诉玩家什么 → 用哪种」的选用表,并在启动接线处注入 `TipPresenter`。

---

## 七、交叉引用

| 主题 | 文档 |
|------|------|
| 窗口生命周期、层级、属性 | [ui-lifecycle.md](ui-lifecycle.md) |
| 事件系统（AddUIEvent / GameEvent） | [event-system.md](event-system.md) |
| 节点前缀命名规范 | [naming-rules.md](naming-rules.md#ui-节点命名规范) |
| 资源加载/卸载 API | [resource-api.md](resource-api.md) |
