using System;
using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 窗口退场:窗根 localScale 1 → <see cref="PeakScale"/> → <see cref="EndScale"/>,后段同时整窗淡出,播完回调。
/// 幅度与节奏取自竞品通用弹窗退场片段 <c>window_hide</c>。由 <see cref="UIModule"/> 关窗时经
/// <see cref="UIPanelMono.InternalPlayExitAnim"/> 挂上,业务代码不挂。
/// </summary>
/// <remarks>
/// **窗此时已逻辑关闭**(出栈、销毁回调已跑),本组件只驱动留下来的视觉外壳,播完由回调方销毁 GameObject。
/// **整窗淡出走窗根上的 CanvasGroup**:窗根通常没有,临时补一个——外壳随后即销毁,不污染任何存活的窗。
/// **遮罩反向补偿**同 <see cref="WindowPopIn"/>:缩放窗根会连全屏遮罩一起缩,缩到 0.8 时四周露出下层。
/// 无 prefab 载体(唯一创建点是 <see cref="Play"/> 里的 AddComponent),故手感参数一律 const。
/// </remarks>
internal sealed class WindowPopOut : MonoBehaviour
{
    private const float PeakScale = 1.05f;
    private const float EndScale  = 0.8f;
    private const float RiseDur   = 0.13f;
    private const float FallDur   = 0.17f;

    /// <summary>整段时长。关窗方据此定输入锁的截止时间与外壳的兜底收尾时刻。</summary>
    public const float Duration = RiseDur + FallDur;

    private RectTransform _rt;
    private RectTransform _maskRt;
    private Sequence _seq;

    /// <summary>
    /// 挂上并开播。<paramref name="onDone"/> 在播完时调一次;宿主先被销毁时不调(由关窗方的兜底收尾接管)。
    /// </summary>
    /// <param name="host">窗根 GameObject。</param>
    /// <param name="mask">全屏遮罩的图形,null 表示本窗没有遮罩(只缩放淡出、不补偿)。</param>
    /// <param name="onDone">播完回调。</param>
    public static void Play(GameObject host, Graphic mask, Action onDone)
    {
        WindowPopOut fx = host.GetComponent<WindowPopOut>();
        if (fx == null)
        {
            fx = host.AddComponent<WindowPopOut>();
        }

        fx.Begin(mask, onDone);
    }

    private void Begin(Graphic mask, Action onDone)
    {
        _rt = (RectTransform)transform;
        _maskRt = mask != null ? (RectTransform)mask.transform : null;

        CanvasGroup cg = GetComponent<CanvasGroup>();
        if (cg == null)
        {
            cg = gameObject.AddComponent<CanvasGroup>();
        }

        _seq?.Kill();
        _seq = DOTween.Sequence()
            .Append(_rt.DOScale(PeakScale, RiseDur).SetEase(Ease.InOutSine))
            .Append(_rt.DOScale(EndScale, FallDur).SetEase(Ease.InOutSine))
            .Insert(RiseDur, cg.DOFade(0f, FallDur).SetEase(Ease.InOutSine))
            .OnUpdate(CompensateMask)
            .SetUpdate(true)
            .SetLink(gameObject)
            .OnComplete(() =>
            {
                _seq = null;
                onDone?.Invoke();
            });
    }

    /// <summary>tween 不随本组件销毁而停(<c>SetLink</c> 只管 GameObject 那一路),漏 Kill 则残留补间继续写窗根。</summary>
    private void OnDestroy()
    {
        _seq?.Kill();
        _seq = null;
    }

    /// <summary>把遮罩反向缩放到世界尺寸不变。scale 恒 ≥ EndScale > 0,不必防除零。</summary>
    private void CompensateMask()
    {
        if (_maskRt == null)
        {
            return;
        }

        _maskRt.localScale = Vector3.one * (1f / _rt.localScale.x);
    }
}
