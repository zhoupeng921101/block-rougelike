using System;
using System.Collections.Generic;
using System.Threading;
using Cysharp.Threading.Tasks;
using TEngine;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// UI管理模块。
/// 窗口体系统一为 MonoBehaviour（<see cref="UIPanelMono"/>）：脚本挂 prefab 根、引用走 [SerializeField]。
/// 实例须先加载 prefab 再 GetComponent 取得，故无法像纯 C# 窗口那样加载前同步入栈，
/// 加载期由 <see cref="_pendingMono"/> 占位去重并承接「加载途中请求关闭」的竞态。
/// </summary>
public sealed partial class UIModule : Singleton<UIModule>, IUpdate
{
    // 核心字段
    private static Transform _instanceRoot = null;          // UI根节点变换组件
    private bool _enableErrorLog = true;                    // 是否启用错误日志
    private Camera _uiCamera = null;                        // UI专用摄像机
    private readonly List<UIPanelMono> _uiStack = new List<UIPanelMono>(128); // 窗口堆栈

    /// <summary>
    /// 窗打开完成后的通知槽(当前唯一订阅者 = 新手引导服务)。
    /// </summary>
    /// <remarks>
    /// 只挂**打开**一侧:打开路径唯一(本方法),而关闭有 CloseUI / CloseAll 两条,逐处挂才完整。
    /// 引导只需要"某界面开出来了"这一个信号,不做关闭事件。
    /// <para>订阅方负责成对解绑(本模块寿命长于任何业务服务)。</para>
    /// </remarks>
    public event Action<UIPanelMono> WindowOpened;

    /// <summary>
    /// 常驻界面的按钮区此刻是否该收起:栈中有任一窗 <see cref="UIPanelMono.CollapsesHud"/>。
    /// 竞品口径——地图上开出第一个弹窗时收起周边按钮,最后一个关掉再滑回。
    /// </summary>
    public bool IsHudCollapsed { get; private set; }

    /// <summary><see cref="IsHudCollapsed"/> 翻转时通知(当前订阅者 = 主菜单)。订阅方负责成对解绑。</summary>
    public event Action<bool> HudCollapseChanged;

    /// <summary>
    /// 顶栏此刻是否让位(滑出屏外):有未释放的 <see cref="HoldTopHudHidden"/>。与 <see cref="IsHudCollapsed"/> 分开——
    /// 普通弹窗只收主菜单按钮区、顶栏常显;只有剧情对白与完成演出(竞品时间线期间)连顶栏也收。
    /// </summary>
    public bool IsTopHudHidden => _topHudHideHolds > 0;

    /// <summary><see cref="IsTopHudHidden"/> 翻转时通知(订阅者 = 顶栏)。订阅方负责成对解绑。</summary>
    public event Action<bool> TopHudHiddenChanged;

    private int _topHudHideHolds;

    /// <summary>
    /// 让顶栏滑出屏外,直到返回值 Dispose(重复 Dispose 无副作用);多方同时持有时全部释放才滑回。
    /// 持有方须在窗销毁 / finally 里释放,漏放的症状是顶栏再也不回来。
    /// </summary>
    public IDisposable HoldTopHudHidden()
    {
        if (_topHudHideHolds++ == 0) TopHudHiddenChanged?.Invoke(true);
        return new TopHudHideHold(this);
    }

    private sealed class TopHudHideHold : IDisposable
    {
        private UIModule _owner;

        public TopHudHideHold(UIModule owner) => _owner = owner;

        public void Dispose()
        {
            if (_owner == null) return;
            var owner = _owner;
            _owner = null;
            if (--owner._topHudHideHolds > 0) return;
            owner._topHudHideHolds = 0;
            owner.TopHudHiddenChanged?.Invoke(false);
        }
    }

    /// <summary>
    /// 正在播退场的外壳。窗在关闭那一刻已逻辑关闭(出栈、销毁回调已跑),这里只留 GameObject 播完退场再销毁。
    /// 外壳计入所在层的占用(<see cref="IsLayerOccupied"/>):弹窗链与排队的被动弹窗等它播完才接下一个。
    /// </summary>
    private readonly List<ExitShell> _exitShells = new List<ExitShell>();

    private sealed class ExitShell
    {
        public UIPanelMono Window;
        public int Layer;

        /// <summary>兜底收尾时刻(unscaled)。退场回调因 tween 被意外 Kill 而不来时,到点强制收尾,该层不会永久被占。</summary>
        public float Deadline;
    }

    /// <summary>退场兜底收尾在动画时长之外再宽限多久(秒)。</summary>
    private const float ExitShellGrace = 0.5f;

    /// <summary>
    /// 开窗防误点的时长(秒),全工程一个数、窗自己不声明。玩家常在窗弹出的那一下还在连点上一个界面,规则两条:
    /// ①任何带遮罩的窗,开窗后这段时间内点遮罩不收场(<see cref="UIPanelMono"/> 的遮罩点击处);
    /// ②被动窗(<see cref="ShowUIPassiveAsync{T}"/>)出现后这段时间内整屏不收点击,连窗内的「确定 / 关闭 / 购买」一起挡住——
    /// 手动打开的窗是玩家自己要的,按钮不锁。
    /// </summary>
    public const float OpenGuardSeconds = 0.5f;

    /// <summary>
    /// 全局输入锁(退场期间、被动窗刚出现时):一块全屏透明、吃点击的拦截层,排序在提示层之上、系统层之下——
    /// 断线遮屏、二选一确认框这类系统层闸窗压在它上面,锁住期间照样能操作。
    /// 只按截止时间 <see cref="_inputLockUntil"/> 释放,不依赖退场回调,任何路径都撤得掉。
    /// </summary>
    private GameObject _inputBlocker;
    private float _inputLockUntil;

    /// <summary>
    /// 加载中窗口的占位记录。<see cref="CloseRequested"/> = 加载途中是否已请求关闭；
    /// <see cref="Layer"/> 冗余存一份层级，供队列层占用判定在实例存在之前就能按层查。
    /// </summary>
    private sealed class PendingWindow
    {
        public int Layer;
        public bool CloseRequested;

        /// <summary>这次加载的结局:开出来给窗实例,加载失败 / 途中被关给 null。供 <see cref="WaitOpenedAsync"/> 的等待方。</summary>
        public readonly UniTaskCompletionSource<UIPanelMono> Opened = new UniTaskCompletionSource<UIPanelMono>();
    }

    // Mono 窗口加载中状态表。键 = 窗口名（类型 FullName）。
    // 实例在加载完成后才存在，无法加载前入栈去重，故用此表在加载期占位。
    // 加载途中 CloseUI/CloseAll 命中时把 CloseRequested 置 true；LoadMonoWindow 在 await 后据此放弃入栈
    // 并销毁实例（等价经典窗口 Handle_Completed 的 IsDestroyed 兜底，修复「加载中关闭被吞、窗口照开」竞态）。
    // 任何结束路径都必须移除键，否则该窗口再也打不开，且该层队列会永久卡住（见 TryDequeueLayer）。
    private readonly Dictionary<string, PendingWindow> _pendingMono = new Dictionary<string, PendingWindow>();

    /// <summary>
    /// 被动打开请求的等待队列。键 = 层级值，值 = 按请求先后排的等待队列（FIFO）。
    /// </summary>
    /// <remarks>
    /// 只有 <see cref="ShowUIPassiveAsync{T}"/> 且该层还有窗在场时入队（见 <see cref="ShowUIImp"/>）；
    /// 手动打开永不入队。排队中的请求**不加载 prefab、无实例**，故 <see cref="HasWindow(Type)"/> /
    /// <see cref="GetUIPanel"/> 对它一律返回「不存在」——队列不引入「有请求但没实例」的第三态。
    /// </remarks>
    private readonly Dictionary<int, List<PendingRequest>> _layerQueues = new Dictionary<int, List<PendingRequest>>();

    /// <summary>一条等待中的被动打开请求（窗类型 + 打开时要带的用户数据）。</summary>
    private sealed class PendingRequest
    {
        public Type Type;
        public System.Object[] UserDatas;
    }

    /// <summary>未释放的被动出队暂停数（见 <see cref="HoldPassive"/>）。</summary>
    private int _passiveHolds;

    /// <summary>
    /// 暂停栈层的被动弹窗：持有期间被动打开一律入队、队列不出队，<see cref="IsLayerIdle"/> 对栈层恒报不空闲；
    /// 释放最后一份时按队列顺序接着开。返回值 Dispose 即释放（重复 Dispose 无副作用）。
    /// </summary>
    /// <remarks>
    /// 给由多个窗首尾相接的演出链用：链中两窗交接的空档里栈层是空的，不暂停的话排队的自发弹窗（如升级窗）会插进来，
    /// 随后又被链的下一个窗盖住。持有方须在 finally 里释放，漏放的症状是之后所有自发弹窗都不再出现。
    /// </remarks>
    public IDisposable HoldPassive()
    {
        _passiveHolds++;
        return new PassiveHold(this);
    }

    private sealed class PassiveHold : IDisposable
    {
        private UIModule _owner;

        public PassiveHold(UIModule owner) => _owner = owner;

        public void Dispose()
        {
            if (_owner == null) return;
            var owner = _owner;
            _owner = null;
            if (--owner._passiveHolds > 0) return;
            owner._passiveHolds = 0;
            owner.TryDequeueLayer((int)UILayer.Window);
        }
    }

    private ErrorLogger _errorLogger;                       // 错误日志记录器
    // UI 层级容器节点表。键 = UILayer 值，值 = 挂在 UIRoot 下的全屏拉伸空节点，窗口按层级挂到对应节点下；
    // 非窗口覆盖层（如 Toast）也经 GetLayerRoot 挂到对应层级节点下，与 UIRoot 静态对齐可静态访问。
    // 仅作 hierarchy 组织与挂载锚点；窗口间渲染层级仍由 Depth/sortingOrder 决定（窗口 Canvas overrideSorting，
    // 不认 hierarchy 兄弟序），故层节点不参与排序，越界层级值回退直挂 UIRoot。
    private static readonly Dictionary<int, Transform> _layerRoots = new Dictionary<int, Transform>();

    // 常量定义
    public const int LAYER_DEEP = 2000;
    public const int WINDOW_DEEP = 100;
    public const int WINDOW_HIDE_LAYER = 2; // Ignore Raycast
    public const int WINDOW_SHOW_LAYER = 5; // UI

    // 资源加载接口
    public static IUIResourceLoader Resource;

    /// <summary>
    /// UI根节点访问属性
    /// </summary>
    public static Transform UIRoot => _instanceRoot;

    /// <summary>
    /// UI摄像机访问属性
    /// </summary>
    public Camera UICamera => _uiCamera;

    /// <summary>
    /// 模块初始化（自动调用）。
    /// 1. 查找场景中的UIRoot
    /// 2. 初始化资源加载器
    /// 3. 配置错误日志系统
    /// </summary>
    protected override void OnInit()
    {
        var uiRoot = GameObject.Find("UIRoot");
        if (uiRoot != null)
        {
            var canvas = uiRoot.GetComponentInChildren<Canvas>();
            _instanceRoot = canvas != null ? canvas.transform : null;
            _uiCamera = uiRoot.GetComponentInChildren<Camera>();
        }
        else
        {
            Log.Fatal("UIRoot not found !");
            return;
        }

        Resource = new UIResourceLoader();

        UnityEngine.Object.DontDestroyOnLoad(_instanceRoot.parent != null ? _instanceRoot.parent : _instanceRoot);

        _instanceRoot.gameObject.layer = LayerMask.NameToLayer("UI");

        BuildLayerRoots();
        BuildInputBlocker();

        if (Debugger.Instance != null)
        {
            switch (Debugger.Instance.ActiveWindowType)
            {
                case DebuggerActiveWindowType.AlwaysOpen:
                    _enableErrorLog = true;
                    break;

                case DebuggerActiveWindowType.OnlyOpenWhenDevelopment:
                    _enableErrorLog = Debug.isDebugBuild;
                    break;

                case DebuggerActiveWindowType.OnlyOpenInEditor:
                    _enableErrorLog = Application.isEditor;
                    break;

                default:
                    _enableErrorLog = false;
                    break;
            }
            if (_enableErrorLog)
            {
                _errorLogger = new ErrorLogger(this);
            }
        }
    }

    /// <summary>
    /// 按 UILayer 枚举在 UIRoot 下建层级容器节点（全屏拉伸的空 RectTransform）。
    /// 节点顺序随枚举、命名取枚举名，仅供 hierarchy 组织与窗口挂载；不参与渲染排序。
    /// </summary>
    private static void BuildLayerRoots()
    {
        _layerRoots.Clear();
        int uiLayer = LayerMask.NameToLayer("UI");
        foreach (UILayer layer in Enum.GetValues(typeof(UILayer)))
        {
            var node = new GameObject(layer.ToString(), typeof(RectTransform));
            node.layer = uiLayer;
            var rect = (RectTransform)node.transform;
            rect.SetParent(_instanceRoot, worldPositionStays: false);
            rect.localScale = Vector3.one;
            rect.localPosition = Vector3.zero;
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
            _layerRoots[(int)layer] = rect;
        }
    }

    /// <summary>建全局输入锁的拦截层(默认停用)。语义见 <see cref="_inputBlocker"/>。</summary>
    private void BuildInputBlocker()
    {
        var go = new GameObject("InputLockBlocker", typeof(RectTransform), typeof(Canvas), typeof(GraphicRaycaster), typeof(Image));
        go.layer = LayerMask.NameToLayer("UI");
        var rect = (RectTransform)go.transform;
        rect.SetParent(GetLayerRoot(UILayer.System), worldPositionStays: false);
        rect.anchorMin = Vector2.zero;
        rect.anchorMax = Vector2.one;
        rect.offsetMin = Vector2.zero;
        rect.offsetMax = Vector2.zero;

        var canvas = go.GetComponent<Canvas>();
        canvas.overrideSorting = true;
        canvas.sortingOrder = (int)UILayer.System * LAYER_DEEP - 1;

        var image = go.GetComponent<Image>();
        image.color = Color.clear;
        image.raycastTarget = true;

        go.SetActive(false);
        _inputBlocker = go;
    }

    /// <summary>锁全局输入至少 <paramref name="seconds"/> 秒(与已有的锁取较晚的截止时间)。</summary>
    private void HoldInput(float seconds)
    {
        _inputLockUntil = Mathf.Max(_inputLockUntil, Time.unscaledTime + seconds);
        if (_inputBlocker != null && !_inputBlocker.activeSelf)
        {
            _inputBlocker.SetActive(true);
        }
    }

    private void ReleaseInput()
    {
        _inputLockUntil = 0f;
        if (_inputBlocker != null)
        {
            _inputBlocker.SetActive(false);
        }
    }

    /// <summary>
    /// 取指定层级的容器节点，供窗口与非窗口覆盖层（Toast 等）按层级挂载；
    /// 层级节点未就绪（UIModule 未初始化）时回退 UIRoot。
    /// </summary>
    public static Transform GetLayerRoot(UILayer layer)
    {
        return GetLayerRoot((int)layer);
    }

    /// <summary>
    /// 取指定层级的容器节点；层级值越出 UILayer 枚举（自定义 int 层级）时回退 UIRoot，不丢窗口。
    /// </summary>
    private static Transform GetLayerRoot(int layer)
    {
        return _layerRoots.TryGetValue(layer, out var root) && root != null ? root : UIRoot;
    }

    /// <summary>
    /// 模块释放（自动调用）。
    /// 1. 清理错误日志系统
    /// 2. 关闭所有窗口
    /// 3. 销毁UI根节点
    /// </summary>
    protected override void OnRelease()
    {
        if (_errorLogger != null)
        {
            _errorLogger.Dispose();
            _errorLogger = null;
        }
        CloseAll();
        if (_instanceRoot != null && _instanceRoot.parent != null)
        {
            UnityEngine.Object.Destroy(_instanceRoot.parent.gameObject);
        }
    }

    /// <summary>
    /// 查询窗口是否存在。
    /// </summary>
    /// <typeparam name="T">界面类型。</typeparam>
    /// <returns>是否存在。</returns>
    public bool HasWindow<T>()
    {
        return HasWindow(typeof(T));
    }

    /// <summary>
    /// 查询窗口是否存在。
    /// </summary>
    /// <param name="type">界面类型。</param>
    /// <returns>是否存在。</returns>
    public bool HasWindow(Type type)
    {
        return IsContains(type.FullName);
    }

    /// <summary>
    /// 异步打开窗口（玩家操作直接触发）：压栈顶、立即显示，盖住同层当前那个窗。
    /// </summary>
    /// <param name="userDatas">用户自定义数据。</param>
    public void ShowUIAsync<T>(params System.Object[] userDatas) where T : UIPanelMono
    {
        ShowUIImp(typeof(T), false, userDatas);
    }

    /// <summary>
    /// 异步打开窗口（玩家操作直接触发）：压栈顶、立即显示，盖住同层当前那个窗。
    /// </summary>
    /// <param name="type">界面类型。</param>
    /// <param name="userDatas">用户自定义数据。</param>
    public void ShowUIAsync(Type type, params System.Object[] userDatas)
    {
        ShowUIImp(type, false, userDatas);
    }

    /// <summary>
    /// 异步打开窗口（系统流程自发弹出，非玩家操作触发）：栈层还有窗在场时排队等待，不打断玩家。
    /// </summary>
    /// <remarks>
    /// 判据是「这次打开玩家在不在等着看」，不是调用点在哪个文件——新手引导按 <c>RequireWindow</c>
    /// 代开依赖窗虽在流程编排代码里，玩家正等着它出现，仍走 <see cref="ShowUIAsync{T}"/>。
    /// 用错的症状：该弹的窗一直不弹（误用本方法），或自发弹窗突然盖住玩家正在操作的界面（误用手动入口）。
    /// <para>只对栈层（<see cref="IsStackedLayer"/>）的窗有排队语义；非栈层的窗走本入口记 Error 并立即打开。</para>
    /// </remarks>
    /// <param name="userDatas">用户自定义数据。</param>
    public void ShowUIPassiveAsync<T>(params System.Object[] userDatas) where T : UIPanelMono
    {
        ShowUIImp(typeof(T), true, userDatas);
    }

    /// <summary>
    /// 异步打开窗口（系统流程自发弹出，非玩家操作触发）。判据与用错症状见 <see cref="ShowUIPassiveAsync{T}"/>。
    /// </summary>
    /// <param name="type">界面类型。</param>
    /// <param name="userDatas">用户自定义数据。</param>
    public void ShowUIPassiveAsync(Type type, params System.Object[] userDatas)
    {
        ShowUIImp(type, true, userDatas);
    }

    /// <summary>
    /// 打开窗口（<see cref="UIPanelMono"/> 子类）：先加载 prefab，再 <c>GetComponent</c> 取实例。
    /// 已在栈中（已加载完成的复用）→ 重新置顶并触发刷新回调；正在加载中 → 去重忽略本次请求。
    /// </summary>
    /// <param name="passive">
    /// true = 系统自发弹出：落栈层且该层还有窗在场时入队等待，不加载；false = 玩家操作触发：一律立即加载。
    /// </param>
    private void ShowUIImp(Type type, bool passive, params System.Object[] userDatas)
    {
        string windowName = type.FullName;
        int layer = GetWindowLayer(type);

        // 非栈层没有队列、HoldPassive 也管不到,被动语义在这里兑现不了:报出来,仍照常打开不丢内容。
        if (passive && !IsStackedLayer(layer))
        {
            Log.Error($"[UIModule] {windowName} 落 {(UILayer)layer} 层,被动入口不排队、不受 HoldPassive 约束,会立即弹出;系统自发的展示改放弹窗层的窗里,或经 PopupChain 声明该层后用手动入口。");
        }

        // 已在栈中（已加载完成的复用）→ 重新置顶并触发刷新回调。
        if (IsContains(windowName))
        {
            UIPanelMono exist = GetWindow(windowName);
            Pop(exist);
            Push(exist);
            exist.TryInvoke(OnWindowPrepare, userDatas);
            if (passive && !exist.IsDestroyed)
            {
                HoldInput(OpenGuardSeconds);
            }

            return;
        }

        // 正在加载中 → 去重，忽略本次请求（且清掉可能已置位的关闭标记，本次请求覆盖为「要打开」）。
        if (_pendingMono.TryGetValue(windowName, out PendingWindow loading))
        {
            loading.CloseRequested = false;
            return;
        }

        // 被动打开且该层还有窗在场（含正在加载的）→ 排队，等该层清空后由 TryDequeueLayer 开出。
        if (passive && IsStackedLayer(layer) && (_passiveHolds > 0 || IsLayerOccupied(layer)))
        {
            Enqueue(layer, type, userDatas);
            return;
        }

        _pendingMono[windowName] = new PendingWindow { Layer = layer, CloseRequested = false };
        LoadMonoWindow(type, windowName, passive, userDatas).Forget();
    }

    /// <summary>
    /// 该层是否栈层：同层可共存多个窗，但只有最上面那个可见，关掉它自动露出下面一个。
    /// </summary>
    /// <remarks>
    /// 只有弹窗层入栈。其余各层保持叠加语义：Bottom/UI 是界面本体，Top 是常驻 HUD，
    /// Tips 是压在一切之上的反馈，System 是闸窗，它们要么天然互斥要么必须能同时看见。
    /// <para>
    /// 与 <see cref="UIPanelMono.IsPopupLayer"/> 取值当前相同,但那边定的是遮罩契约与入场动画,与本判据的栈语义无关。
    /// 两者不是同一判据的副本,新增层时分别判断。
    /// </para>
    /// </remarks>
    public static bool IsStackedLayer(int layer)
    {
        return layer == (int)UILayer.Window;
    }

    /// <summary>窗类型 → 它的 <see cref="WindowAttribute"/>(无标注则为 null)。特性是编译期常量,查一次即可。</summary>
    /// <remarks>
    /// 开窗是玩家等待路径,而 IL2CPP / HybridCLR 下 <c>Attribute.GetCustomAttribute</c> 的开销明显。
    /// 缓存 null 结果同样必要 —— 无标注的窗否则每次开窗都白查一遍。
    /// </remarks>
    private static readonly Dictionary<Type, WindowAttribute> WindowAttrCache = new Dictionary<Type, WindowAttribute>();

    private static WindowAttribute GetWindowAttribute(Type type)
    {
        if (WindowAttrCache.TryGetValue(type, out var cached))
        {
            return cached;
        }
        var attribute = Attribute.GetCustomAttribute(type, typeof(WindowAttribute)) as WindowAttribute;
        WindowAttrCache[type] = attribute;
        return attribute;
    }

    /// <summary>取窗类型声明的层级；无 <see cref="WindowAttribute"/> 时回退 <see cref="UILayer.UI"/>（与加载路径同口径）。</summary>
    private static int GetWindowLayer(Type type)
    {
        var attribute = GetWindowAttribute(type);
        return attribute != null ? attribute.WindowLayer : (int)UILayer.UI;
    }

    /// <summary>该层是否已被占用：栈中有本层的窗，或有本层的窗正在加载。</summary>
    private bool IsLayerOccupied(int layer)
    {
        for (int i = 0; i < _uiStack.Count; i++)
        {
            if (_uiStack[i].WindowLayer == layer)
            {
                return true;
            }
        }

        foreach (var pending in _pendingMono.Values)
        {
            if (pending.Layer == layer && !pending.CloseRequested)
            {
                return true;
            }
        }

        for (int i = 0; i < _exitShells.Count; i++)
        {
            if (_exitShells[i].Layer == layer)
            {
                return true;
            }
        }

        return false;
    }

    /// <summary>
    /// 该层此刻是否完全空闲:无在场的窗、无加载中的窗、无排队等开的被动请求。
    /// 全局弹窗链(<see cref="PopupChain"/>)据此判断能不能自动弹下一个——三者任一不空,玩家眼前就有窗或马上会有窗。
    /// </summary>
    public bool IsLayerIdle(UILayer layer)
    {
        int value = (int)layer;
        if (IsLayerOccupied(value) || (_passiveHolds > 0 && IsStackedLayer(value)))
        {
            return false;
        }

        return !_layerQueues.TryGetValue(value, out var queue) || queue.Count == 0;
    }

    /// <summary>
    /// 被动请求入队。队列里已有同类型请求时丢弃本次（保留先入队那条连同它的 userDatas），
    /// 与「正在加载中重复请求即忽略」同口径。
    /// </summary>
    private void Enqueue(int layer, Type type, System.Object[] userDatas)
    {
        if (!_layerQueues.TryGetValue(layer, out var queue))
        {
            queue = new List<PendingRequest>();
            _layerQueues[layer] = queue;
        }

        for (int i = 0; i < queue.Count; i++)
        {
            if (queue[i].Type == type)
            {
                return;
            }
        }

        queue.Add(new PendingRequest { Type = type, UserDatas = userDatas });
    }

    /// <summary>
    /// 该层清空后开出队首的下一个被动窗。层里还有窗、非栈层、队列为空时什么都不做。
    /// </summary>
    /// <remarks>
    /// 调用点是所有「本层可能清空」的路径：窗关闭、外部销毁兜底，以及加载失败的每条退出路径。
    /// 漏一处的症状是该层队列永久卡住——后续自发弹窗一律不显示，且不报错。
    /// </remarks>
    private void TryDequeueLayer(int layer)
    {
        if (!IsStackedLayer(layer))
        {
            return;
        }

        if (_passiveHolds > 0 || !_layerQueues.TryGetValue(layer, out var queue) || queue.Count == 0)
        {
            return;
        }

        if (IsLayerOccupied(layer))
        {
            return;
        }

        PendingRequest next = queue[0];
        queue.RemoveAt(0);

        string windowName = next.Type.FullName;
        _pendingMono[windowName] = new PendingWindow { Layer = layer, CloseRequested = false };
        LoadMonoWindow(next.Type, windowName, true, next.UserDatas).Forget();
    }

    /// <summary>加载失败 / 加载途中被关：清 pending 并让出该层，队列里的下一个才接得上。</summary>
    private void AbortPending(string windowName, int layer)
    {
        _pendingMono.Remove(windowName);
        TryDequeueLayer(layer);
    }

    /// <summary>
    /// 诊断用：描述某个窗所在层此刻的占用与排队现场（在场的窗 / 正在加载的窗 / 队列内容）。
    /// 只读，不改任何状态；供「窗该开却没开出来」的排查现场取证，业务逻辑不读它做判断。
    /// </summary>
    public string DescribeQueueStateFor(Type windowType)
    {
        if (windowType == null)
        {
            return "(窗类型为空)";
        }

        int layer = GetWindowLayer(windowType);
        var name = (UILayer)layer;
        if (!IsStackedLayer(layer))
        {
            return $"{name} 层不排队(窗没开出来与队列无关)";
        }

        var onStage = new List<string>();
        for (int i = 0; i < _uiStack.Count; i++)
        {
            if (_uiStack[i].WindowLayer == layer)
            {
                onStage.Add(_uiStack[i].GetType().Name);
            }
        }

        var loading = new List<string>();
        foreach (var kv in _pendingMono)
        {
            if (kv.Value.Layer == layer)
            {
                loading.Add(kv.Key + (kv.Value.CloseRequested ? "(已请求关闭)" : string.Empty));
            }
        }

        var queued = new List<string>();
        if (_layerQueues.TryGetValue(layer, out var queue))
        {
            for (int i = 0; i < queue.Count; i++)
            {
                queued.Add(queue[i].Type.Name);
            }
        }

        return $"{name} 层: 在场=[{string.Join(",", onStage)}] 加载中=[{string.Join(",", loading)}] 排队=[{string.Join(",", queued)}]";
    }

    /// <summary>
    /// 加载 Mono 窗口 prefab，取组件、Init、入栈，再走统一的 OnWindowPrepare。
    /// 任何失败路径（加载失败 / 组件缺失 / 加载途中被请求关闭）都必须经 <see cref="AbortPending"/>
    /// 移除 _pendingMono 键并让出层——只移除键不让层，该层队列会永久卡住。
    /// </summary>
    /// <param name="passive">被动打开:窗出现后起 <see cref="OpenGuardSeconds"/> 的输入锁。排队后出队的请求恒为被动。</param>
    private async UniTaskVoid LoadMonoWindow(Type type, string windowName, bool passive, System.Object[] userDatas)
    {
        int layer = GetWindowLayer(type);
        // 占位记录在各条退出路径上都会被移出表,先留住引用,收尾时把结局交给等待方。
        _pendingMono.TryGetValue(windowName, out PendingWindow self);
        UIPanelMono opened = null;
        try
        {
            WindowAttribute attribute = GetWindowAttribute(type);
            bool fullScreen = attribute != null && attribute.FullScreen;
            string assetName = attribute != null && !string.IsNullOrEmpty(attribute.Location) ? attribute.Location : type.Name;
            bool fromResources = attribute != null && attribute.FromResources;

            // 加载分支：fromResources 走 UnityEngine.Resources.Load 同步实例化（UILogPanel 等内置资源依赖，
            // 非 YooAsset bundle，不受 WebGL 同步加载限制）；否则一律走 YooAsset 异步加载。
            // 客户端运行时禁用同步资源加载 API（WebGL 不支持），故 YooAsset 路径恒异步、无同步分支可选。
            // 按窗口层级挂到对应层级容器节点下（越界层级值回退 UIRoot）。
            Transform layerRoot = GetLayerRoot(layer);
            GameObject panel;
            if (fromResources)
            {
                panel = UnityEngine.Object.Instantiate(Resources.Load<GameObject>(assetName), layerRoot);
            }
            else
            {
                panel = await Resource.LoadGameObjectAsync(assetName, parent: layerRoot);
            }

            if (panel == null)
            {
                AbortPending(windowName, layer);
                Log.Error($"Load mono window prefab failed: {windowName} (location={assetName})");
                return;
            }

            // 加载途中被请求关闭（CloseUI/CloseAll 命中 pending 并置位）→ 放弃入栈、销毁实例、清键。
            // 这是「加载中关闭」竞态的兜底：实例加载完成时若关闭请求已先到，不让其入栈成僵尸窗。
            if (_pendingMono.TryGetValue(windowName, out PendingWindow pending) && pending.CloseRequested)
            {
                AbortPending(windowName, layer);
                UnityEngine.Object.Destroy(panel);
                return;
            }

            UIPanelMono window = panel.GetComponent<UIPanelMono>();
            if (window == null)
            {
                AbortPending(windowName, layer);
                UnityEngine.Object.Destroy(panel);
                Log.Error($"Mono window prefab has no {nameof(UIPanelMono)} component: {windowName}");
                return;
            }

            window.Init(windowName, layer, fullScreen, assetName, fromResources);

            // 加载完成，移除 pending。先入栈（OnWindowPrepare 的排序/显隐遍历需窗口已在栈），
            // 再 Setup 抓 Canvas / 置就绪 / 回调 OnWindowPrepare。
            _pendingMono.Remove(windowName);
            Push(window);
            window.Setup(panel, OnWindowPrepare, userDatas);
            opened = window;

            // 锁从窗出现起算,不从发起请求起算:加载与排队的时间不该吃掉锁。
            // OnRefresh 里判过期即开即关的窗不锁——屏上没有新窗,锁了就是一段无缘无故点不动的时间。
            if (passive && !window.IsDestroyed)
            {
                HoldInput(OpenGuardSeconds);
            }
        }
        catch (Exception e)
        {
            AbortPending(windowName, layer);
            Log.Error($"Load mono window exception: {windowName}\n{e}");
        }
        finally
        {
            self?.Opened.TrySetResult(opened);
        }
    }

    /// <summary>
    /// 等一个已请求打开的窗开出来:已在场直接返回;正在加载则等它加载完、入栈并就绪。
    /// </summary>
    /// <remarks>
    /// 不触发打开,先调 <see cref="ShowUIAsync{T}"/> 再等。加载失败、加载途中被关,以及既不在场也没在加载
    /// (没人开它,或经被动入口还排在队里)都返回 null,不悬等;要上限的调用方自己套超时。
    /// 与 <see cref="GetUIAsyncAwait{T}"/> 的差别:那个只认已在栈里的窗,prefab 还在加载时拿到的是 null。
    /// 等待方在加载收尾的调用栈里被同步唤醒;要等首帧画出来再动作的,拿到窗后自己再让一帧。
    /// </remarks>
    public UniTask<UIPanelMono> WaitOpenedAsync(Type type)
    {
        if (type == null)
        {
            return UniTask.FromResult<UIPanelMono>(null);
        }

        string windowName = type.FullName;
        UIPanelMono window = GetWindow(windowName);
        if (window != null)
        {
            return window.IsLoadDone ? UniTask.FromResult(window) : window.WaitLoadDoneAsync();
        }

        return _pendingMono.TryGetValue(windowName, out PendingWindow pending)
            ? pending.Opened.Task
            : UniTask.FromResult<UIPanelMono>(null);
    }

    /// <summary>
    /// 关闭窗口。
    /// </summary>
    /// <typeparam name="T">窗口类型</typeparam>
    public void CloseUI<T>() where T : UIPanelMono
    {
        CloseUI(typeof(T));
    }

    /// <summary>
    /// 关闭窗口。逻辑当帧生效(出栈、销毁回调、露出下层并刷新、按钮区与排队重算),与有无退场动画无关;
    /// 有入场动画的可见窗另留外壳播镜像退场,期间锁全局输入,播完销毁并放行该层排队。
    /// </summary>
    public void CloseUI(Type type)
    {
        CloseUI(type, playExit: true);
    }

    /// <param name="playExit">false = 不播退场、当帧销毁(已自带退场演出的窗用,见 <see cref="UIPanelMono"/> 的 CloseWithoutExit)。</param>
    public void CloseUI(Type type, bool playExit)
    {
        string windowName = type.FullName;

        // 加载途中关闭：实例尚未存在，置「已请求关闭」标记，由 LoadMonoWindow 在 await 后兜底销毁。
        if (_pendingMono.TryGetValue(windowName, out PendingWindow pending))
        {
            pending.CloseRequested = true;
            return;
        }

        // 尚在队列里等待（未加载、无实例）→ 直接撤掉这条请求。不动该层当前在场的窗。
        if (RemoveFromQueue(type))
        {
            return;
        }

        UIPanelMono window = GetWindow(windowName);
        if (window == null)
            return;

        // 关的是可见窗才会露出下面的窗；被压住的窗（Visible=false）关掉不改变谁可见，也不播退场（看不见）。
        bool wasVisible = window.Visible;

        // GameObject 先留着：要不要当外壳播退场，等逻辑关闭走完再定。
        window.InternalDestroy(destroyGameObject: false);
        Pop(window);
        OnSortWindowDepth(window.WindowLayer);
        OnSetWindowVisible();
        if (wasVisible)
        {
            RefreshRevealedTop(window.WindowLayer);
        }

        RefreshHudCollapse();

        float exit = playExit && wasVisible
            ? window.InternalPlayExitAnim(() => FinishExitShell(window))
            : 0f;
        if (exit > 0f)
        {
            window.BecomeExitShell();
            _exitShells.Add(new ExitShell
            {
                Window = window,
                Layer = window.WindowLayer,
                Deadline = Time.unscaledTime + exit + ExitShellGrace,
            });
            HoldInput(exit);
            return;
        }

        UnityEngine.Object.Destroy(window.gameObject);
        TryDequeueLayer(window.WindowLayer);
    }

    /// <summary>外壳退场播完(或到兜底时刻):销毁外壳,放行该层排队的下一个被动弹窗。重复调用无害。</summary>
    private void FinishExitShell(UIPanelMono window)
    {
        for (int i = 0; i < _exitShells.Count; i++)
        {
            ExitShell shell = _exitShells[i];
            if (!ReferenceEquals(shell.Window, window))
            {
                continue;
            }

            _exitShells.RemoveAt(i);
            if (window != null)
            {
                UnityEngine.Object.Destroy(window.gameObject);
            }

            TryDequeueLayer(shell.Layer);
            return;
        }
    }

    /// <summary>到兜底时刻仍未收尾的外壳、被外部销毁的外壳,在这里补收尾;输入锁到点释放。</summary>
    private void TickExitShells()
    {
        for (int i = _exitShells.Count - 1; i >= 0; i--)
        {
            ExitShell shell = _exitShells[i];
            if (shell.Window == null || Time.unscaledTime >= shell.Deadline)
            {
                FinishExitShell(shell.Window);
            }
        }

        if (_inputBlocker != null && _inputBlocker.activeSelf && Time.unscaledTime >= _inputLockUntil)
        {
            _inputBlocker.SetActive(false);
        }
    }

    /// <summary>
    /// 栈层的可见窗关闭后，露出来的新栈顶重跑一次 <c>OnRefresh</c>。
    /// </summary>
    /// <remarks>
    /// 被压住期间窗照收事件、协程照跑，但不重刷显示（<c>Visible=false</c> 只切 layer 与 raycaster，
    /// 不是停用）。少了这一步的症状是：关掉上层窗露出下层窗，下层显示的还是被压住那一刻的旧数据。
    /// </remarks>
    private void RefreshRevealedTop(int layer)
    {
        if (!IsStackedLayer(layer))
        {
            return;
        }

        for (int i = _uiStack.Count - 1; i >= 0; i--)
        {
            UIPanelMono window = _uiStack[i];
            if (window.WindowLayer != layer)
            {
                continue;
            }

            if (window.IsPrepare && window.Visible)
            {
                window.InternalRefresh();
            }

            return;
        }
    }

    /// <summary>把该类型的等待请求从所属层队列里撤掉；撤到了返回 true。</summary>
    private bool RemoveFromQueue(Type type)
    {
        foreach (var queue in _layerQueues.Values)
        {
            for (int i = 0; i < queue.Count; i++)
            {
                if (queue[i].Type == type)
                {
                    queue.RemoveAt(i);
                    return true;
                }
            }
        }

        return false;
    }

    /// <summary>
    /// 关闭所有窗口。
    /// </summary>
    public void CloseAll()
    {
        // 先拷贝再清栈，然后自栈顶向下逐个销毁拷贝里的窗；全部当帧销毁、不播退场
        // （软重启、换账号之后紧跟加载或换场景，残留外壳会压在新画面上）。
        // 先清栈是为了销毁回调里嵌套的关窗（如个人信息关奖励提示）：
        // 它们在栈里找不到目标、什么都不做，被关的那个窗本来就在拷贝里、照常销毁。
        // 若边遍历边销毁，嵌套关窗会把栈中途改短、下标跳过下一个窗——那个窗 GameObject 没销毁、
        // 订阅没解，随后清栈又让框架再也管不到它。
        UIPanelMono[] windows = _uiStack.ToArray();
        _uiStack.Clear();
        for (int i = windows.Length - 1; i >= 0; i--)
        {
            windows[i].InternalDestroy();
        }

        // 以下两步必须排在销毁循环之后：销毁回调里可能再开窗（如邀请窗发放暂存奖励、弹恭喜获得），
        // 那次打开要么进了加载中表、要么进了排队。排在前面就拦不住它，新画面上会凭空弹出旧窗。
        // 循环是同步的，其间没有加载能完成，故循环后统一处理即可覆盖循环前后发起的全部打开。
        // 加载中的窗口一并标记关闭，避免 await 返回后又入栈成僵尸窗。
        MarkAllPendingClose();

        // 等待中的请求一并丢弃：CloseAll 的语义是「一个都不留」，留着队列会在下一次关窗时凭空弹出旧窗。
        _layerQueues.Clear();

        for (int i = 0; i < _exitShells.Count; i++)
        {
            UIPanelMono shell = _exitShells[i].Window;
            if (shell != null)
            {
                UnityEngine.Object.Destroy(shell.gameObject);
            }
        }

        _exitShells.Clear();
        ReleaseInput();
        RefreshHudCollapse();
    }

    /// <summary>
    /// 把所有加载中的窗口标记为「已请求关闭」，使其加载完成后不入栈（CloseAll 用）。
    /// </summary>
    private void MarkAllPendingClose()
    {
        foreach (var pending in _pendingMono.Values)
        {
            pending.CloseRequested = true;
        }
    }

    /// <summary>
    /// 窗口被外部直接销毁（场景卸载 / 手动 Destroy GameObject）时的兜底出栈。
    /// 由 <see cref="UIPanelMono.OnDestroy"/> 在框架显式 InternalDestroy 未先行时调用：
    /// 从栈摘除、重排同层深度、重算可见性（缺陷 C 的窗口侧修复）。
    /// </summary>
    internal void NotifyWindowDestroyed(UIPanelMono window)
    {
        if (window == null)
        {
            return;
        }

        int index = _uiStack.IndexOf(window);
        if (index < 0)
        {
            return;
        }

        _uiStack.RemoveAt(index);
        OnSortWindowDepth(window.WindowLayer);
        OnSetWindowVisible();

        // 不判「关的是不是可见窗」：走到这里 GameObject 已被外部销毁，Visible 读的 Canvas 已失效。
        // 多刷一次是幂等的，而这条兜底路径本身罕见（场景卸载 / 手动 Destroy）。
        RefreshRevealedTop(window.WindowLayer);

        RefreshHudCollapse();
        TryDequeueLayer(window.WindowLayer);
    }

    /// <summary>窗打开的统一入口：新建与已开窗复用（重复 ShowUIAsync 置顶）两条路径共用。</summary>
    /// <remarks>
    /// **三段顺序都有约束**。定深与定可见性排在 <c>InternalCreate</c> / <c>InternalRefresh</c> 之前：
    /// 窗在 OnCreate / OnRefresh 里读到的 <c>sortingOrder</c> 若还是 <c>Setup</c> 给的 0，由它派生出去的值
    /// （如新手引导按窗序算的高亮提层值）就停在废值上——本方法随后把窗抬到本层深度时不回头修正它们。
    /// 入场动画则排在可见性之后：动画写的起始缩放只有在窗已置可见时才看得到，反过来会先以满尺寸绘一帧；
    /// 复用打开时动画同样重播，挂载点自身防重入（见 <c>WindowPopIn.Play</c>）。
    /// </remarks>
    private void OnWindowPrepare(UIPanelMono window)
    {
        OnSortWindowDepth(window.WindowLayer);
        OnSetWindowVisible();
        window.InternalCreate();
        window.InternalRefresh();
        window.InternalPlayOpenAnim();
        window.InternalOnOpened();
        RefreshHudCollapse();
        WindowOpened?.Invoke(window);
    }

    /// <summary>
    /// 重算 <see cref="IsHudCollapsed"/>,翻转才通知。调用点 = 窗打开完成与所有出栈路径(关闭 / 全关 / 外部销毁兜底),
    /// 漏一处的症状是按钮区收起后不再滑回。只认已就绪的窗:加载中的窗还没出现,不该先把按钮收走。
    /// </summary>
    private void RefreshHudCollapse()
    {
        bool collapsed = false;
        for (int i = 0; i < _uiStack.Count; i++)
        {
            UIPanelMono window = _uiStack[i];
            if (window.IsPrepare && window.CollapsesHud)
            {
                collapsed = true;
                break;
            }
        }

        if (collapsed == IsHudCollapsed)
        {
            return;
        }

        IsHudCollapsed = collapsed;
        HudCollapseChanged?.Invoke(collapsed);
    }

    private void OnSortWindowDepth(int layer)
    {
        int depth = layer * LAYER_DEEP;
        for (int i = 0; i < _uiStack.Count; i++)
        {
            if (_uiStack[i].WindowLayer == layer)
            {
                _uiStack[i].Depth = depth;
                depth += WINDOW_DEEP;
            }
        }
    }

    /// <summary>
    /// 重算全栈可见性。两条互不相干的剪枝叠加：全屏窗遮住它下面的一切；栈层内只留最上面那个。
    /// </summary>
    /// <remarks>
    /// 自栈顶向下遍历，故栈层里第一个撞到的就是该层栈顶。栈层剪枝不依赖 <c>FullScreen</c> 标记——
    /// 弹窗层的窗一个都没设它，靠它剪不掉同层任何窗。
    /// </remarks>
    private void OnSetWindowVisible()
    {
        bool isHideNext = false;
        int shownStackedLayer = -1;

        for (int i = _uiStack.Count - 1; i >= 0; i--)
        {
            UIPanelMono window = _uiStack[i];
            if (isHideNext)
            {
                window.Visible = false;
                continue;
            }

            // 栈层：本层已经给出可见窗（即栈顶）→ 其余同层窗一律压住。
            if (IsStackedLayer(window.WindowLayer))
            {
                if (shownStackedLayer == window.WindowLayer)
                {
                    window.Visible = false;
                    continue;
                }

                shownStackedLayer = window.WindowLayer;
            }

            window.Visible = true;
            if (window.IsPrepare && window.FullScreen)
            {
                isHideNext = true;
            }
        }
    }

    /// <summary>
    /// 取已打开的窗，未加载完则等它加载完；窗不在栈中返回 null。
    /// </summary>
    /// <remarks>
    /// 不触发打开——只服务「窗应该已经开着，等它就绪」这一场景。
    /// 等待经窗自身的加载完成信号，加载失败 / 中途被关时该信号给出 null，故不会悬等。
    /// </remarks>
    public async UniTask<T> GetUIAsyncAwait<T>(CancellationToken cancellationToken = default) where T : UIPanelMono
    {
        var ret = GetWindow(typeof(T).FullName) as T;
        if (ret == null)
        {
            return null;
        }

        if (ret.IsLoadDone)
        {
            return ret;
        }

        await ret.WaitLoadDoneAsync().AttachExternalCancellation(cancellationToken);
        return ret.IsLoadDone ? ret : null;
    }

    /// <summary>
    /// 取已打开的窗，就绪后回调；窗不在栈中则不回调（同 <see cref="GetUIAsyncAwait{T}"/>，回调风格）。
    /// </summary>
    /// <param name="callback">回调。窗加载失败时不触发。</param>
    public void GetUIAsync<T>(Action<T> callback) where T : UIPanelMono
    {
        var ret = GetWindow(typeof(T).FullName) as T;
        if (ret == null)
        {
            return;
        }

        GetUIAsyncImp().Forget();

        async UniTaskVoid GetUIAsyncImp()
        {
            if (!ret.IsLoadDone)
            {
                await ret.WaitLoadDoneAsync();
                if (!ret.IsLoadDone)
                {
                    return; // 加载失败 / 中途被关：不拿半成品回调业务
                }
            }
            callback?.Invoke(ret);
        }
    }

    /// <summary>
    /// 按界面类型取已打开的窗实例;未打开返回 null。
    /// </summary>
    /// <remarks>
    /// 与 <see cref="HasWindow(Type)"/> 同一口径(都按 <c>type.FullName</c> 匹配 WindowName),
    /// 差别只在返回实例而非布尔。新手引导要在运行时取到目标窗、再从窗上反射取锚点节点,
    /// 只有"在不在"不够用。
    /// </remarks>
    public UIPanelMono GetUIPanel(Type type)
    {
        return type == null ? null : GetWindow(type.FullName);
    }

    private UIPanelMono GetWindow(string windowName)
    {
        for (int i = 0; i < _uiStack.Count; i++)
        {
            UIPanelMono window = _uiStack[i];
            if (window.WindowName == windowName)
            {
                return window;
            }
        }

        return null;
    }

    private bool IsContains(string windowName)
    {
        for (int i = 0; i < _uiStack.Count; i++)
        {
            UIPanelMono window = _uiStack[i];
            if (window.WindowName == windowName)
            {
                return true;
            }
        }

        return false;
    }

    private void Push(UIPanelMono window)
    {
        // 如果已经存在
        if (IsContains(window.WindowName))
        {
            throw new GameFrameworkException($"Window {window.WindowName} is exist.");
        }

        // 获取插入到所属层级的位置
        int insertIndex = -1;
        for (int i = 0; i < _uiStack.Count; i++)
        {
            if (window.WindowLayer == _uiStack[i].WindowLayer)
            {
                insertIndex = i + 1;
            }
        }

        // 如果没有所属层级，找到相邻层级
        if (insertIndex == -1)
        {
            for (int i = 0; i < _uiStack.Count; i++)
            {
                if (window.WindowLayer > _uiStack[i].WindowLayer)
                {
                    insertIndex = i + 1;
                }
            }
        }

        // 如果是空栈或没有找到插入位置
        if (insertIndex == -1)
        {
            insertIndex = 0;
        }

        // 最后插入到堆栈
        _uiStack.Insert(insertIndex, window);
    }

    private void Pop(UIPanelMono window)
    {
        // 从堆栈里移除
        _uiStack.Remove(window);
    }

    public void OnUpdate()
    {
        if (_uiStack == null)
        {
            return;
        }

        TickExitShells();

        int count = _uiStack.Count;
        for (int i = 0; i < _uiStack.Count; i++)
        {
            if (_uiStack.Count != count)
            {
                break;
            }

            var window = _uiStack[i];
            window.InternalUpdate();
        }
    }
}
