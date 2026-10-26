using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 弹窗入场弹入:窗根 localScale <see cref="StartScale"/> → <see cref="PeakScale"/> → 1,
/// 遮罩不跟随缩放、只独立淡入。由 <see cref="UIPanelMono.InternalPlayOpenAnim"/> 对弹窗层窗自动挂载,业务代码不挂。
/// 幅度、时长与缓动取自竞品通用弹窗片段 <c>window_show</c>(约 150 个弹窗共用)。
/// </summary>
/// <remarks>
/// **遮罩要反向补偿**:遮罩是窗根的子节点,缩放窗根会连它一起缩放,而全屏遮罩缩到 0.8 会在四周
/// 露出下层画面——挡住下层正是遮罩的职责。故每帧给遮罩一个 1/s 的反向 localScale 抵消掉窗根那一层:
/// 它的 rect 由 anchor stretch 恒等于窗根 rect,反补后世界尺寸恒为满屏。这是本组件唯一要逐帧算的量,
/// 故整条序列挂 <c>OnUpdate</c>;不改成「只缩放内容节点」是因为各窗根下的内容节点没有统一名字。
/// **遮罩淡入是独立时间轴**(<see cref="MaskFadeDur"/> ≠ 缩放总时长),故它单独起一条 tween、不进缩放序列——
/// 不能 Join 进去的原因写在 <see cref="Restart"/> 里。
/// 与 <see cref="ScalePopIn"/> 的分工在**宿主**:那个挂棋盘元素、带 0.5 秒前置延迟,弹窗不能延迟半秒才出现。
/// 无 prefab 载体(唯一创建点是 <see cref="Play"/> 里的 AddComponent),故手感参数一律 const。
/// </remarks>
internal sealed class WindowPopIn : MonoBehaviour
{
    private const float StartScale  = 0.8f;
    private const float PeakScale   = 1.05f;
    private const float RiseDur     = 0.18f;
    private const float FallDur     = 0.18f;
    private const float MaskFadeDur = 0.23f;

    private RectTransform _rt;
    private Graphic _mask;
    private RectTransform _maskRt;

    /// <summary>遮罩淡入的终点 = 它在 prefab 里的原始 alpha,只在首次捕获,重入不重捕。</summary>
    private float _maskTargetAlpha;
    private bool _maskCaptured;

    private Sequence _seq;

    /// <summary>遮罩淡入独立于缩放序列,故单独持一条。</summary>
    private Tween _maskTween;

    /// <summary>
    /// 取或加并从头播。重入走重置而非再挂一个:窗在动画途中被复用重开时
    /// (<see cref="UIPanelMono.Visible"/> 置 false 改的是 layer,OnDisable 不触发、本组件仍在跑),
    /// 重复 AddComponent 会让两份组件同帧互相覆盖 localScale。
    /// </summary>
    /// <param name="host">窗根 GameObject。</param>
    /// <param name="mask">全屏遮罩的图形,null 表示本窗没有遮罩(只缩放、不淡入)。</param>
    public static void Play(GameObject host, Graphic mask)
    {
        WindowPopIn fx = host.GetComponent<WindowPopIn>();
        if (fx == null)
        {
            fx = host.AddComponent<WindowPopIn>();
        }

        fx.Restart(mask);
    }

    /// <summary>
    /// 立即收尾:停掉补间、窗根与遮罩归位、销毁本组件。没在播则什么都不做。
    /// </summary>
    /// <remarks>
    /// 给「入场没播完就开始退场」的窗用。窗根缩放是本组件在约 0.37 秒内持续改写的量,
    /// 而退场演出(如把奖励格子挂在窗根下飞向落点)读的是同一个 transform:两者重叠时
    /// 飞行中的内容会跟着窗根缩放抖一下。退场开始前调本方法把窗根交还给退场那一侧。
    /// </remarks>
    /// <param name="host">窗根 GameObject。</param>
    public static void Finish(GameObject host)
    {
        WindowPopIn fx = host.GetComponent<WindowPopIn>();
        if (fx == null)
        {
            return;
        }

        fx.KillTweens();
        fx.Settle();
        Destroy(fx);   // 仅销毁组件,不销毁窗
    }

    /// <summary>
    /// 起始态在本方法内同步就位,不等第一次推进:<see cref="Play"/> 是同步调用,
    /// 留到下一帧设则本帧仍以满尺寸、遮罩满 alpha 绘制一次,观感是「先整个出现、下一帧才缩回去」。
    /// </summary>
    private void Restart(Graphic mask)
    {
        _rt = (RectTransform)transform;

        if (mask != null)
        {
            _mask = mask;
            _maskRt = (RectTransform)mask.transform;
            if (!_maskCaptured)
            {
                _maskTargetAlpha = mask.color.a;
                _maskCaptured = true;
            }
        }

        KillTweens();
        _rt.localScale = Vector3.one * StartScale;
        CompensateMask();
        SetMaskAlpha(0f);

        _seq = DOTween.Sequence()
            .Append(_rt.DOScale(PeakScale, RiseDur).SetEase(Ease.InOutSine))
            .Append(_rt.DOScale(1f, FallDur).SetEase(Ease.InOutSine))
            .OnUpdate(CompensateMask)
            .SetUpdate(true)   // 弹窗入场不该受玩法暂停影响
            .SetLink(gameObject)
            .OnComplete(() =>
            {
                _seq = null;
                Settle();
                Destroy(this);   // 仅销毁组件,不销毁窗
            });

        // 遮罩淡入单独起一条,不 Join 进上面那条序列:Join 会把序列的插入位置推到
        // max(已插入元素的结束时间),而本段 (0.23s) 比缩放第一段 (0.18s) 长,
        // Join 进去会把缩放第二段推迟到 0.23s 才开始、总时长从 0.36 变成 0.41。
        if (_mask != null)
        {
            _maskTween = _mask.DOFade(_maskTargetAlpha, MaskFadeDur)
                .SetEase(Ease.InOutSine)
                .SetUpdate(true)
                .SetLink(gameObject);
        }
    }

    /// <summary>
    /// 节点在演出中途被停用时就地收尾(复位 + 自毁),口径与 <see cref="ScalePunch"/> 同:
    /// 宿主若被停用留存(而非销毁),缩到一半的窗会连同本组件一起留着,下次启用是个歪着的、遮罩半透明的窗。
    /// 只认「节点被停用」这一路:组件被单独摘掉时节点仍在场,复位反而会打断接手的那次演出。
    /// </summary>
    private void OnDisable()
    {
        if (gameObject.activeInHierarchy)
        {
            return;
        }

        KillTweens();
        Settle();
        Destroy(this);
    }

    /// <summary>tween 不随本组件销毁而停(<c>SetLink</c> 只管 GameObject 那一路),漏 Kill 则残留的补间会继续写窗根与遮罩。</summary>
    private void OnDestroy()
    {
        KillTweens();
    }

    private void KillTweens()
    {
        _seq?.Kill();
        _seq = null;
        _maskTween?.Kill();
        _maskTween = null;
    }

    /// <summary>把遮罩反向缩放到世界尺寸不变。scale 恒 ≥ StartScale > 0,不必防除零。</summary>
    private void CompensateMask()
    {
        if (_maskRt == null)
        {
            return;
        }

        _maskRt.localScale = Vector3.one * (1f / _rt.localScale.x);
    }

    private void SetMaskAlpha(float alpha)
    {
        if (_mask == null)
        {
            return;
        }

        Color c = _mask.color;
        c.a = alpha;
        _mask.color = c;
    }

    /// <summary>收尾复位:窗根与遮罩都回到无动画时的状态。</summary>
    private void Settle()
    {
        // 走 transform 而不是缓存的 _rt:收尾不该依赖 Restart 是否已跑过。
        transform.localScale = Vector3.one;

        if (_mask == null)
        {
            return;
        }

        _maskRt.localScale = Vector3.one;
        SetMaskAlpha(_maskTargetAlpha);
    }
}
