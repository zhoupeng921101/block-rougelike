using System;
using System.Collections.Generic;
using System.Threading;
using Cysharp.Threading.Tasks;
using TEngine;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// MonoBehaviour 窗口基类（可挂 prefab 根、字段用 <c>[SerializeField]</c> 暴露到 Inspector）。
/// 自身即 panel，引用绑定走序列化字段而非命名前缀 / 运行时查找。
/// 生命周期由 <see cref="UIModule"/> 显式驱动，不写 Awake/Start/OnEnable/Update 等魔法方法
/// （<see cref="OnDestroy"/> 为 Unity 魔法回调，故用 <see cref="IsDestroyed"/> 守卫防双触发）。
///
/// UI 只有两档：本类（框架托管的窗）与裸 <see cref="MonoBehaviour"/>（宿主自持的 Part）。
/// 窗内的部件是 Part——由窗以 <c>[SerializeField]</c> 直接持有、或由窗自己 Instantiate 与销毁，
/// 不存在框架托管的子部件树，故本类不提供子节点注册、子树遍历与递归销毁。
/// </summary>
public abstract class UIPanelMono : MonoBehaviour
{
        #region Node / UserData / State

    /// <summary>矩阵位置组件（transform 即自身）。</summary>
    // ReSharper disable once InconsistentNaming
    public RectTransform rectTransform => (RectTransform)transform;

    /// <summary>自定义数据集。</summary>
    protected object[] _userDatas;

    /// <summary>自定义数据。</summary>
    public object UserData => _userDatas != null && _userDatas.Length >= 1 ? _userDatas[0] : null;

    /// <summary>自定义数据集。</summary>
    public object[] UserDatas => _userDatas;

    /// <summary>资源是否准备完毕。</summary>
    public bool IsPrepare { protected set; get; }

        #endregion

        #region 生命周期虚函数

    /// <summary>代码自动生成绑定 / 事件挂载（引用已由序列化就位，仅挂事件）。</summary>
    protected virtual void ScriptGenerator() { }

    /// <summary>注册事件。</summary>
    protected virtual void RegisterEvent() { }

    /// <summary>创建。</summary>
    protected virtual void OnCreate() { }

    /// <summary>刷新。</summary>
    protected virtual void OnRefresh() { }

    /// <summary>逐帧更新（由 <see cref="UIModule"/> 对可见窗口驱动）。</summary>
    protected virtual void OnUpdate() { }

    /// <summary>
    /// <see cref="Visible"/> 翻转后调用(被全屏窗盖住 / 露出)。首次定可见性早于 <see cref="OnCreate"/>,
    /// 那一次子类字段尚未初始化,须在 OnCreate 里按当前 <see cref="Visible"/> 自行落一次。
    /// </summary>
    protected virtual void OnVisibleChanged(bool visible) { }

        #endregion

        #region UIEvent

    private GameEventMgr _eventMgr;

    protected GameEventMgr EventMgr
    {
        get
        {
            if (_eventMgr == null)
            {
                _eventMgr = MemoryPool.Acquire<GameEventMgr>();
            }

            return _eventMgr;
        }
    }

    public void AddUIEvent(int eventType, Action handler)
    {
        EventMgr.AddEvent(eventType, handler);
    }

    protected void AddUIEvent<T>(int eventType, Action<T> handler)
    {
        EventMgr.AddEvent(eventType, handler);
    }

    protected void AddUIEvent<T, U>(int eventType, Action<T, U> handler)
    {
        EventMgr.AddEvent(eventType, handler);
    }

    protected void AddUIEvent<T, U, V>(int eventType, Action<T, U, V> handler)
    {
        EventMgr.AddEvent(eventType, handler);
    }

    protected void RemoveAllUIEvent()
    {
        if (_eventMgr != null)
        {
            MemoryPool.Release(_eventMgr);
            _eventMgr = null;
        }
    }

        #endregion

        #region 服务事件登记 / 生命周期令牌

    /// <summary>已登记的服务事件撤销动作(挂上时登记,窗销毁统一执行)。</summary>
    private List<Action> _serviceUnsubscribes;

    /// <summary>窗生命周期取消源(首访 <see cref="LifetimeToken"/> 时建,窗销毁 Cancel+Dispose)。</summary>
    private CancellationTokenSource _lifetimeCts;

    /// <summary>
    /// 订阅一个服务对象的 C# 事件并登记撤销:attach 立即执行,detach 在窗销毁时统一执行。
    /// 取代各窗手写「RegisterEvent += / OnDestroyWindow -=」镜像对——漏写 detach 不报错,
    /// 只在服务(寿命长于窗)里泄漏已销毁窗引用。登记表形状同红点接线点的 Subscribe。
    /// </summary>
    protected void AddServiceEvent(Action attach, Action detach)
    {
        if (attach == null || detach == null) return;
        attach();
        (_serviceUnsubscribes ??= new List<Action>()).Add(detach);
    }

    /// <summary>
    /// 随窗销毁取消的令牌:图标异步加载等窗生命周期内的异步操作传它,
    /// 不再各窗手写「建 CTS / 销毁 Cancel+Dispose」三段。
    /// </summary>
    protected CancellationToken LifetimeToken => (_lifetimeCts ??= new CancellationTokenSource()).Token;

    /// <summary>本窗是否有请求在途(<see cref="RunExclusive"/> 把守的那一把)。按钮要在在途期间置灰的读它。</summary>
    protected bool IsRequestInFlight { get; private set; }

    /// <summary>
    /// 请求在途防重:本窗同一时刻只允一条请求在途,在途期间再调直接不受理(返回 false),
    /// 请求跑完——正常返回、抛异常、关窗取消——都自动解闸。
    /// 取代各窗手写「一个 bool + 早返 + 置位 + finally 归位」四段:那四段抄了十来份,
    /// 漏掉 finally 的症状是该窗此后再也点不动,而且不报错。
    /// </summary>
    /// <param name="request">要跑的请求;它自己的早返判据(网关缺失、条目为空等)仍由它自己判。</param>
    /// <returns>是否受理了本次调用(false = 上一条还在途)。</returns>
    protected bool RunExclusive(Func<UniTask> request)
    {
        if (request == null || IsRequestInFlight) return false;
        IsRequestInFlight = true;
        RunThenRelease(request).Forget();
        return true;
    }

    private async UniTaskVoid RunThenRelease(Func<UniTask> request)
    {
        try
        {
            await request();
        }
        catch (OperationCanceledException)
        {
            // 关窗取消:不是错误,解闸即可(窗已销毁,后续也不会再有人点)。
        }
        catch (Exception e)
        {
            // 吞掉异常只为保证解闸;留痕给排查用——静默会让「点了没反应」查无实据。
            Log.Error($"[{GetType().Name}] 请求异常:{e}");
        }
        finally
        {
            IsRequestInFlight = false;
        }
    }

    /// <summary>
    /// 销毁清理其一:撤销全部服务事件订阅(两条销毁路径共用)。须先于 <see cref="OnDestroyWindow"/>:
    /// 销毁回调里改服务状态(如置面板关闭标记)会同步派发本窗订阅的事件,
    /// 此刻 <see cref="IsDestroyed"/> 尚为 false,重入的刷新会在将死的窗上重建计时器等资源并活过窗口。
    /// </summary>
    private void DetachServiceEvents()
    {
        if (_serviceUnsubscribes == null) return;
        for (int i = 0; i < _serviceUnsubscribes.Count; i++)
        {
            try { _serviceUnsubscribes[i]?.Invoke(); }
            catch (Exception e) { Log.Error($"[{WindowName}] 服务事件解绑异常:{e}"); }
        }
        _serviceUnsubscribes = null;
    }

    /// <summary>销毁清理其二:取消并释放生命周期令牌、停主倒计时(两条销毁路径共用,在 <see cref="OnDestroyWindow"/> 之后)。</summary>
    private void ReleaseLifetimeResources()
    {
        if (_lifetimeCts != null)
        {
            _lifetimeCts.Cancel();
            _lifetimeCts.Dispose();
            _lifetimeCts = null;
        }
        UnbindCountdown();
    }

        #endregion

        #region 只关一次 / 主倒计时

    /// <summary>本窗是否已在关(<see cref="CloseOnce"/> 置位;每次 <see cref="OnRefresh"/> 之前由基类复位)。</summary>
    protected bool IsClosing { get; private set; }

    /// <summary>基类持有的主倒计时(<see cref="BindCountdown"/> 起,关窗 / 窗销毁时自动停)。</summary>
    private CountdownBinder _countdown;

    /// <summary>
    /// 关窗(只做一次);<paramref name="tip"/> 非空时先出一条提示。
    /// 限时窗的关窗来源不止一个(到点、服务端判已结束、买完),同一帧撞上时只关一次、只提示一次。
    /// </summary>
    protected void CloseOnce(string tip = null)
    {
        if (IsClosing) return;
        IsClosing = true;
        UnbindCountdown();
        if (!string.IsNullOrEmpty(tip)) ShowTip(tip);
        Close();
    }

    /// <summary>
    /// <see cref="CloseOnce"/> 提示条的呈现方,由业务层组合根注入:提示条的样式与布局属于具体游戏。
    /// 漏注入时提示丢弃并记 Error。
    /// </summary>
    public static Action<string> TipPresenter;

    private static void ShowTip(string tip)
    {
        if (TipPresenter != null)
        {
            TipPresenter(tip);
            return;
        }
        Log.Error($"[UIPanelMono] 未注入 TipPresenter,提示丢弃:{tip}");
    }

    /// <summary>
    /// 起本窗的主倒计时:重复调用先停旧表;已在关则不起。参数同 <see cref="CountdownBinder"/>。
    /// 取代各窗手写「倒计时字段 + 起表前停旧表 + 销毁时停表」三段——漏停的表会在已销毁的窗上继续写文本。
    /// </summary>
    protected void BindCountdown(Action<string> write, Func<long> remainMs, Func<long, string> format,
        string expiredText, Action onExpired)
    {
        UnbindCountdown();
        if (IsClosing) return;
        _countdown = new CountdownBinder(write, remainMs, format, expiredText, onExpired);
        _countdown.Start();
    }

    /// <summary>到点关窗的主倒计时:到点文本与关窗提示是同一句 <paramref name="expiredTip"/>。</summary>
    protected void BindExpiryCountdown(Action<string> write, Func<long> remainMs, Func<long, string> format,
        string expiredTip)
    {
        BindCountdown(write, remainMs, format, expiredTip, () => CloseOnce(expiredTip));
    }

    /// <summary>停主倒计时(未起表时是空操作)。</summary>
    protected void UnbindCountdown()
    {
        _countdown?.Stop();
        _countdown = null;
    }

        #endregion

        #region Properties

    private Action<UIPanelMono> _prepareCallback;

    private bool _isCreate = false;

    private Canvas _canvas;
    private Canvas[] _childCanvas;
    private GraphicRaycaster _raycaster;
    private GraphicRaycaster[] _childRaycaster;

    public Canvas Canvas => _canvas;
    public GraphicRaycaster GraphicRaycaster => _raycaster;

    public string WindowName { private set; get; }
    public int WindowLayer { private set; get; }
    public string AssetName { private set; get; }
    public virtual bool FullScreen { private set; get; } = false;
    public bool FromResources { private set; get; }

    /// <summary>是否加载完毕。</summary>
    public bool IsLoadDone { get; private set; }

    /// <summary>
    /// 加载完成信号。<see cref="Setup"/> 走完即完成(成功给自身、缺 Canvas 抛错给 null),
    /// 窗提前销毁也给 null —— 等待方因而不会悬等。
    /// </summary>
    /// <remarks>
    /// 一次性:窗的加载只发生一次(已开窗复用不重走 <see cref="Setup"/>),故完成后 await 立即返回、不产生等待帧。
    /// </remarks>
    private readonly UniTaskCompletionSource<UIPanelMono> _loadSignal = new UniTaskCompletionSource<UIPanelMono>();

    /// <summary>等待本窗加载完成:成功返回自身,加载失败 / 已销毁返回 null。已完成时同步返回。</summary>
    internal UniTask<UIPanelMono> WaitLoadDoneAsync() => _loadSignal.Task;

    /// <summary>UI 是否销毁（守卫 OnDestroy 双触发）。</summary>
    public bool IsDestroyed { get; private set; }

    /// <summary>窗口深度值（排序）。</summary>
    public int Depth
    {
        get => _canvas != null ? _canvas.sortingOrder : 0;
        set
        {
            if (_canvas == null)
            {
                return;
            }

            if (_canvas.sortingOrder == value)
            {
                return;
            }

            var oldOrder = _canvas.sortingOrder;
            _canvas.sortingOrder = value;
            for (int i = 0; i < _childCanvas.Length; i++)
            {
                var canvas = _childCanvas[i];
                if (canvas != _canvas)
                {
                    canvas.sortingOrder = value + (canvas.sortingOrder - oldOrder);
                }
            }
        }
    }

    /// <summary>窗口可见性。</summary>
    public bool Visible
    {
        get => _canvas != null && _canvas.gameObject.layer == UIModule.WINDOW_SHOW_LAYER;
        set
        {
            if (_canvas == null)
            {
                return;
            }

            int setLayer = value ? UIModule.WINDOW_SHOW_LAYER : UIModule.WINDOW_HIDE_LAYER;
            if (_canvas.gameObject.layer == setLayer)
            {
                return;
            }

            _canvas.gameObject.layer = setLayer;
            for (int i = 0; i < _childCanvas.Length; i++)
            {
                _childCanvas[i].gameObject.layer = setLayer;
            }

            Interactable = value;
            OnVisibleChanged(value);
        }
    }

    /// <summary>窗口交互性。</summary>
    private bool Interactable
    {
        get => _raycaster != null && _raycaster.enabled;
        set
        {
            if (_raycaster == null)
            {
                return;
            }

            _raycaster.enabled = value;
            for (int i = 0; i < _childRaycaster.Length; i++)
            {
                _childRaycaster[i].enabled = value;
            }
        }
    }

        #endregion

    public void Init(string name, int layer, bool fullScreen, string assetName, bool fromResources)
    {
        WindowName = name;
        WindowLayer = layer;
        FullScreen = fullScreen;
        AssetName = assetName;
        FromResources = fromResources;
    }

    /// <summary>
    /// 初始化 panel（抓取 Canvas / 子 Canvas / Raycaster，置就绪并回调，由 <see cref="UIModule"/> 加载完成后驱动）。
    /// </summary>
    public void Setup(GameObject panel, Action<UIPanelMono> prepareCallback, object[] userDatas)
    {
        _prepareCallback = prepareCallback;
        _userDatas = userDatas;

        panel.name = GetType().Name;
        panel.transform.localPosition = Vector3.zero;

        _canvas = panel.GetComponent<Canvas>();
        if (_canvas == null)
        {
            // 先解除等待方再抛:否则 await 本窗的调用方会一直挂着,而异常只到得了加载协程。
            _loadSignal.TrySetResult(null);
            throw new Exception($"Not found {nameof(Canvas)} in panel {WindowName}");
        }

        // 就绪位置于取 Canvas 之后:缺 Canvas 的窗不该被任何人当成「加载完毕」。
        IsLoadDone = true;

        _canvas.overrideSorting = true;
        _canvas.sortingOrder = 0;
        _canvas.sortingLayerName = "Default";

        _raycaster = panel.GetComponent<GraphicRaycaster>();
        _childCanvas = panel.GetComponentsInChildren<Canvas>(true);
        _childRaycaster = panel.GetComponentsInChildren<GraphicRaycaster>(true);

        IsPrepare = true;
        _prepareCallback?.Invoke(this);

        _loadSignal.TrySetResult(this);
    }

    /// <summary>
    /// 重新抓取子 Canvas / 子 Raycaster 缓存。**运行时给窗内节点新增或移除 Canvas 后必须调一次。**
    /// </summary>
    /// <remarks>
    /// <see cref="Setup"/> 里那两次 <c>GetComponentsInChildren</c> 是一次性的,此后数组不再更新。
    /// 而 <see cref="Depth"/> 的 setter 只遍历这份缓存来保持各子 Canvas 的相对层序,
    /// <see cref="Visible"/> 也只切缓存内节点的 layer —— 运行时新增的 Canvas 不在其中,
    /// 于是同层再开一个窗触发 <c>OnSortWindowDepth</c> 重排时,它不跟着走,层级就此错乱。
    /// <para>
    /// 当前调用方 = 新手引导的高亮提层(给目标节点临时挂 Canvas 把它提到引导遮罩之上)。
    /// </para>
    /// </remarks>
    public void RefreshCanvasCache()
    {
        if (_canvas == null) return;
        var panel = _canvas.gameObject;
        _childCanvas = panel.GetComponentsInChildren<Canvas>(true);
        _childRaycaster = panel.GetComponentsInChildren<GraphicRaycaster>(true);
    }

    public void TryInvoke(Action<UIPanelMono> prepareCallback, object[] userDatas)
    {
        _userDatas = userDatas;
        if (IsPrepare)
        {
            prepareCallback?.Invoke(this);
        }
        else
        {
            _prepareCallback = prepareCallback;
        }
    }

    public void InternalCreate()
    {
        if (_isCreate == false)
        {
            _isCreate = true;
            ScriptGenerator();
            RegisterEvent();
            OnCreate();

            // ScriptGenerator 是遮罩绑定的产出点，跑完才能判有没有绑上。
            if (_maskBinding == null && IsPopupLayer(WindowLayer))
            {
                Log.Error($"[{WindowName}] 在 {(UILayer)WindowLayer} 层（弹窗层）却没有遮罩节点：" +
                          $"prefab 里缺 {MaskNodeName}，玩家点弹窗外的空地关不掉它。" +
                          $"补节点后重新生成绑定；本窗确实不该点空地关闭的，把它挪出弹窗层。");
            }
        }
    }

    public void InternalRefresh()
    {
        IsClosing = false;
        OnRefresh();
    }

    public void InternalUpdate()
    {
        if (!IsPrepare || !Visible)
        {
            return;
        }

        OnUpdate();
    }

    /// <summary>
    /// 逻辑销毁:解绑、跑销毁回调、取消生命周期令牌、置 <see cref="IsDestroyed"/>。
    /// </summary>
    /// <param name="destroyGameObject">
    /// false = 留下 GameObject 作退场外壳,由 <see cref="UIModule"/> 播完退场再销毁(见 <see cref="InternalPlayExitAnim"/>)。
    /// 逻辑层面此刻已关闭,外壳只剩表现。
    /// </param>
    public void InternalDestroy(bool destroyGameObject = true)
    {
        if (IsDestroyed)
        {
            return;
        }

        _isCreate = false;
        RemoveAllUIEvent();
        DetachServiceEvents();
        _prepareCallback = null;

        OnDestroyWindow();
        ReleaseLifetimeResources();
        IsDestroyed = true;
        _loadSignal.TrySetResult(null); // 加载中途被关:解除等待方,不让它挂到超时

        // panel 即自身：销毁 GameObject，窗内 Part 随子树一并被 Unity 销毁。
        // OnDestroy 魔法回调会再进一次，被 IsDestroyed 守卫拦下。
        if (destroyGameObject && gameObject != null)
        {
            Destroy(gameObject);
        }
    }

    /// <summary>
    /// Unity 魔法回调。框架外部直接销毁 GameObject（场景卸载 / 手动 Destroy 物体）时的兜底清理；
    /// 框架显式 <see cref="InternalDestroy"/> 已先行，二次进入被 <see cref="IsDestroyed"/> 守卫拦下。
    /// 仅当框架未先行时，通知 <see cref="UIModule"/> 从窗口栈摘除并重排深度 / 重算可见性，避免留死项。
    /// </summary>
    private void OnDestroy()
    {
        if (IsDestroyed)
        {
            return;
        }

        _isCreate = false;
        RemoveAllUIEvent();
        DetachServiceEvents();
        _prepareCallback = null;
        OnDestroyWindow();
        ReleaseLifetimeResources();
        IsDestroyed = true;
        _loadSignal.TrySetResult(null); // 加载中途被关:解除等待方,不让它挂到超时

        // UIModule 单例在 OnRelease 时可能已不可用；正常运行期 Instance 有效。
        if (UIModule.Instance != null)
        {
            UIModule.Instance.NotifyWindowDestroyed(this);
        }
    }

        #region 遮罩关闭（弹窗层机制）

    /// <summary>
    /// 全屏遮罩的节点名。prefab 里的节点与 UI 生成器产出的绑定都按它对齐。
    /// </summary>
    public const string MaskNodeName = "m_btn_Mask";

    /// <summary>已绑上的遮罩；null = 本窗 prefab 里没有遮罩节点。</summary>
    private Button _maskBinding;

    /// <summary>
    /// 该层是否弹窗层（模态、须带全屏遮罩）。只有 <see cref="UILayer.Window"/>，
    /// 遮罩契约与层默认入场动画都按本判据走。
    /// </summary>
    /// <remarks>
    /// 与 <see cref="UIModule.IsStackedLayer"/> 取值当前相同,但两者语义正交、新增层时须分别判断:
    /// 全屏功能页可入栈而不需遮罩(没有窗外空地可点),闸窗须遮罩而不可入栈(入栈会被同层新窗顶掉)。
    /// </remarks>
    public static bool IsPopupLayer(int layer)
    {
        return layer == (int)UILayer.Window;
    }

    /// <summary>
    /// 点遮罩是否关窗，默认 true。必须二选一的场景（如断网后「重新登录 / 退出游戏」）覆写为 false，
    /// 使玩家只能从两个按钮里选一个，不会滑进「两个都没选」的第三态、停在一个已失效的界面上。
    /// 覆写为 false 的窗仍要放遮罩节点——遮罩另一半职责是挡住下层点击。
    /// </summary>
    protected virtual bool DismissOnMask => true;

    /// <summary>
    /// 绑定全屏遮罩。由生成的 <see cref="ScriptGenerator"/> 调用，业务代码不写，
    /// 也不要另给遮罩挂回调——这里 RemoveAllListeners 会把它清掉。
    /// </summary>
    protected void BindMask(Button mask)
    {
        _maskBinding = mask;
        mask.onClick.RemoveAllListeners();
        mask.onClick.AddListener(OnMaskClick);
    }

    private void OnMaskClick()
    {
        if (!DismissOnMask)
        {
            return;
        }

        // 开窗防误点(规则见 UIModule.OpenGuardSeconds):刚开窗时点遮罩不收场,遮罩照样挡住下层点击、窗内按钮照常可点。
        // 所有窗同值、不设覆写口;覆写了 DismissByMask 的收尾逻辑同样被拦下。
        if (Time.unscaledTime - _openedAt < UIModule.OpenGuardSeconds)
        {
            return;
        }

        DismissByMask();
    }

    /// <summary>
    /// 点遮罩后怎么收场，默认直接关窗。带退场动画的窗覆写它（动画放完自行 <see cref="Close"/>）——
    /// 覆写改的是「怎么关」，不是「关不关」，后者归 <see cref="DismissOnMask"/>。
    /// </summary>
    protected virtual void DismissByMask() => Close();

        #endregion

        #region 入场动画

    /// <summary>
    /// 是否播<b>弹窗层的默认缩放弹入</b>，默认 true。已有整套自有入场演出、不该再叠一层窗体缩放的窗覆写为 false。
    /// 只管这一条层默认：层默认只覆盖弹窗层（<see cref="IsPopupLayer"/>），其余层没有层默认动画
    /// （功能页铺满屏，缩放起点小于 1 会在四周露出下层；Tips 层的飘字与引导有自己的演出节奏）。
    /// 要给其余层的窗加入场动画走另一条路——在 prefab 窗根挂 <see cref="UIWindowOpenAnim"/> 子类，那条路不看本值。
    /// </summary>
    protected virtual bool EnableOpenAnim => true;

    /// <summary>
    /// 播入场动画。由 <see cref="UIModule"/> 在窗口打开的统一入口调用，业务代码不调；
    /// 新建与已开窗复用（重复 ShowUIAsync 置顶）两条路径共用该入口，故复用打开时动画照播。
    ///
    /// 两条来源，prefab 挂载优先：窗根挂了 <see cref="UIWindowOpenAnim"/> 子类就播它（显式声明优先于层默认，
    /// 且对所有层生效）；没挂才回落到弹窗层的默认缩放弹入。
    /// </summary>
    public void InternalPlayOpenAnim()
    {
        UIWindowOpenAnim custom = GetComponent<UIWindowOpenAnim>();
        if (custom != null)
        {
            custom.Play();
            return;
        }

        if (!IsPopupLayer(WindowLayer) || !EnableOpenAnim)
        {
            return;
        }

        WindowPopIn.Play(gameObject, MaskGraphic);
    }

    /// <summary>
    /// 让本窗的入场动画立即收尾到终态。入场改写的是窗根或窗内块的位置 / 缩放 / 透明度,
    /// 业务窗要在入场没播完时自己开始往外飞内容(如奖励格以窗根为父节点飞向落点),先调本方法。
    /// 分派同 <see cref="InternalPlayOpenAnim"/>:挂了自定义入场组件的走它,没挂的走层默认弹入——
    /// 业务窗不要点名某一种入场实现,窗换挂别的入场组件后点名的那行会变成空操作且不报错。
    /// </summary>
    protected void FinishOpenAnim()
    {
        UIWindowOpenAnim custom = GetComponent<UIWindowOpenAnim>();
        if (custom != null)
        {
            custom.Finish();
            return;
        }

        WindowPopIn.Finish(gameObject);
    }

    /// <summary>遮罩的图形:取 Button 的 targetGraphic,未设时退回同节点的 Graphic。都没有 = null(只缩放、不淡入不补偿)。</summary>
    private Graphic MaskGraphic
    {
        get
        {
            if (_maskBinding == null)
            {
                return null;
            }

            return _maskBinding.targetGraphic != null
                ? _maskBinding.targetGraphic
                : _maskBinding.GetComponent<Graphic>();
        }
    }

        #endregion

        #region 退场动画

    /// <summary>
    /// 关窗是否播退场,默认 true。点一下看一眼的临时信息类窗(如奖励提示气泡)覆写为 false:
    /// 退场期间锁输入,会吃掉玩家连续查看的下一下。对所有关闭路径生效(点遮罩关、被别处按类型关);
    /// 只想让窗自己的某一条关闭路径不播,用 <see cref="CloseWithoutExit"/>。
    /// </summary>
    protected virtual bool EnableExitAnim => true;

    /// <summary>
    /// 播退场,镜像入场:窗根挂了 <see cref="UIWindowOpenAnim"/> 子类就播它的 <see cref="UIWindowOpenAnim.PlayExit"/>;
    /// 没挂时弹窗层(且未关掉层默认入场)播通用退场 <see cref="WindowPopOut"/>;其余不播。
    /// 由 <see cref="UIModule"/> 在逻辑关闭之后调用,业务代码不调。
    /// </summary>
    /// <remarks>
    /// 同一帧里刚打开就被关掉的窗不播:那是 OnRefresh 里判定过期之类的即开即关,播了只会闪一下再退、白锁一次输入。
    /// </remarks>
    /// <param name="onDone">播完回调;不播时不调。</param>
    /// <returns>整段时长(秒),0 = 不播(调用方直接销毁)。</returns>
    internal float InternalPlayExitAnim(Action onDone)
    {
        if (!EnableExitAnim || _openedFrame == Time.frameCount)
        {
            return 0f;
        }

        UIWindowOpenAnim custom = GetComponent<UIWindowOpenAnim>();
        if (custom != null)
        {
            return custom.PlayExit(MaskGraphic, onDone);
        }

        if (!IsPopupLayer(WindowLayer) || !EnableOpenAnim)
        {
            return 0f;
        }

        WindowPopIn.Finish(gameObject);
        WindowPopOut.Play(gameObject, MaskGraphic, onDone);
        return WindowPopOut.Duration;
    }

    /// <summary>
    /// 转为退场外壳:不再接收点击,排序抬高半档——外壳已出栈,同层重排会把它原来的排序值分给别的窗,
    /// 不抬高就可能与新开的窗同值、谁压谁不确定。
    /// </summary>
    internal void BecomeExitShell()
    {
        Interactable = false;
        Depth += UIModule.WINDOW_DEEP / 2;
    }

        #endregion

        #region 开窗配套(收起常驻按钮 / 遮罩防误触计时)

    /// <summary>最近一次打开的时刻(unscaled),遮罩的开窗防误点(<see cref="UIModule.OpenGuardSeconds"/>)从这里起算。</summary>
    private float _openedAt;

    /// <summary>最近一次打开的帧号,<see cref="InternalPlayExitAnim"/> 据此识别即开即关。</summary>
    private int _openedFrame = -1;

    /// <summary>
    /// 本窗在场时是否让主菜单收起按钮区,默认 true。只对弹窗层与功能页层生效(<see cref="CollapsesHud"/>)。
    /// 开着也要让玩家看见主菜单按钮的窗覆写为 false。
    /// </summary>
    protected virtual bool CollapseHudWhileOpen => true;

    /// <summary><see cref="UIModule.IsHudCollapsed"/> 的逐窗判据。</summary>
    internal bool CollapsesHud =>
        (IsPopupLayer(WindowLayer) || WindowLayer == (int)UILayer.UI) && CollapseHudWhileOpen;

    /// <summary>
    /// 窗打开的配套反馈:记开窗时刻。由 <see cref="UIModule"/> 与入场动画同一时机调用
    /// (新建与复用置顶都走),业务代码不调;关掉上层窗露出本窗不算打开,不走这里。
    /// </summary>
    internal void InternalOnOpened()
    {
        _openedAt = Time.unscaledTime;
        _openedFrame = Time.frameCount;
    }

        #endregion

    /// <summary>
    /// 关窗(有入场动画的窗播镜像退场,见 <see cref="InternalPlayExitAnim"/>)。已关闭的窗再调不做任何事:
    /// 退场外壳的倒计时、服务回调在销毁前仍可能触发关窗,按类型关会误关同类型新开的那个实例。
    /// </summary>
    protected void Close()
    {
        if (IsDestroyed)
        {
            return;
        }

        UIModule.Instance.CloseUI(GetType());
    }

    /// <summary>
    /// 关窗且不播默认退场。只给「自己已演完退场演出、窗上已无可见内容」的窗用(如恭喜获得飞完奖励后),
    /// 再叠一层退场只会白锁一次输入。
    /// </summary>
    protected void CloseWithoutExit()
    {
        if (IsDestroyed)
        {
            return;
        }

        UIModule.Instance.CloseUI(GetType(), playExit: false);
    }

    /// <summary>窗口销毁回调（用户可重写，避开 Unity 魔法名 OnDestroy）。</summary>
    protected virtual void OnDestroyWindow() { }
}
