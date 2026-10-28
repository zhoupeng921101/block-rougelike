using DG.Tweening;
using UnityEngine;

/// <summary>
/// 撞击反馈:localScale 基准 → 基准 × <see cref="PeakScale"/> → 基准,播完只销毁自己、不动 GameObject。
/// 基准 = 起播时节点的 localScale:宿主按布局缩过的节点(如 HUD 头像件 0.6)撞完须回原尺寸,不能回 1。
/// </summary>
/// <remarks>
/// 一律经 <see cref="Play"/> 触发,不直接 AddComponent:防重入靠「组件在不在」,而这个判定放在调用方
/// 就会被漏写 —— 同节点挂两份组件会同帧互写 localScale(本组件是绝对赋值不叠乘),抖成一片;
/// 后挂的那份还会把前一份的放大中间值当成基准,节点从此停在放大态。
/// 播完必须销毁本组件——不销毁则该节点此后再也 punch 不了。
/// 缩放是绝对赋值不叠乘:同节点上另有缩放来源时两者互相覆盖而非相乘(OrderCardView 依赖此语义)。
/// 与 <see cref="ScalePopIn"/> 的分工在**起点**:那个从小于 1 起(从无到有出现),本组件从基准起(已在场的东西被撞一下)。
/// </remarks>
public sealed class ScalePunch : MonoBehaviour
{
    /// <summary>对该节点播一次撞击反馈。已在播则本次忽略(防重入);<paramref name="target"/> 为空静默返回。</summary>
    public static void Play(GameObject target)
    {
        if (target == null || target.GetComponent<ScalePunch>() != null)
        {
            return;
        }
        target.AddComponent<ScalePunch>();
    }

    /// <summary>组件形态的便捷重载(取其 gameObject)。</summary>
    public static void Play(Component target)
    {
        if (target != null)
        {
            Play(target.gameObject);
        }
    }

    private const float PeakScale = 1.28f;
    private const float RiseDur   = 0.12f;
    private const float FallDur   = 0.18f;

    private Sequence _seq;
    private Vector3 _baseScale;

    private void Awake()
    {
        _baseScale = transform.localScale;
        _seq = DOTween.Sequence()
            .Append(transform.DOScale(_baseScale * PeakScale, RiseDur).SetEase(Ease.OutCubic))
            .Append(transform.DOScale(_baseScale, FallDur).SetEase(Ease.OutCubic))
            .SetUpdate(true)
            .SetLink(gameObject)
            .OnComplete(() => { _seq = null; Settle(); });   // 置 null 先于 Settle:自然播完的这条不该再被 Kill 一次
    }

    /// <summary>
    /// 节点在演出中途被停用时就地收尾。宿主若走对象池(停用留池而非销毁),tween 不随 SetActive(false) 停,
    /// 隐藏期间仍在写 scale;而在取回处补一句复位并不管用——本组件还活着,下一帧照样把复位覆盖掉。
    /// 只认「节点被停用」这一路:组件被单独摘掉时节点仍在场,那多半是同节点上另一次 punch 接了手。
    /// </summary>
    private void OnDisable()
    {
        if (gameObject.activeInHierarchy) return;
        Settle();
    }

    /// <summary>
    /// tween 不随组件销毁而停(<c>SetLink</c> 只管 GameObject 那一路),组件被单独 Destroy 时在此停掉。
    /// 只停不复位,口径同 <see cref="OnDisable"/>:localScale 归摘掉本组件的一方。
    /// </summary>
    private void OnDestroy()
    {
        _seq?.Kill();
        _seq = null;
    }

    private void Settle()
    {
        _seq?.Kill();
        _seq = null;
        transform.localScale = _baseScale;
        Destroy(this);   // 仅销毁组件，不销毁 GameObject
    }
}
