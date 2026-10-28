using DG.Tweening;
using UnityEngine;

public static class VFXEase
{
    public static float OutBack(float x)
    {
        const float c1 = 1.70158f, c3 = c1 + 1f;
        float xm = x - 1f;
        return 1f + c3 * xm * xm * xm + c1 * xm * xm;
    }
    public static float OutCubic(float x) { float r = 1f - x; return 1f - r * r * r; }

    /// <summary>
    /// 给 DOTween 用的 <see cref="OutBack"/>:值域夹到 [0,1],**超调被削掉**。
    /// </summary>
    /// <remarks>
    /// 不是 <c>Ease.OutBack</c>——那个走 unclamped 插值,会真的越过终点再回落。
    /// 手写版用 <c>Mathf.Lerp</c> 收口(它自带 Clamp01),超调那一段被压成停在峰值的平台;
    /// 迁 DOTween 时照搬这条曲线才不改手感。想要真回弹得换成 <c>Ease.OutBack</c>,那是改手感、须单独立项。
    /// </remarks>
    internal static readonly EaseFunction ClampedOutBack =
        (time, duration, overshoot, period) => Mathf.Clamp01(OutBack(duration <= 0f ? 1f : time / duration));
}
