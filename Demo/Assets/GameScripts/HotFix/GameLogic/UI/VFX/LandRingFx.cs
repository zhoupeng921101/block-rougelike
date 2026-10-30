using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 飞分落到累计分时的星环(31 号票第 21 项)。原来是动物乐园的 Spine 素材(sp_landring,
/// idle 一段约 1.33 秒的展开);阶段 6 换成一张星环图 + 补间:从中心弹开、放大到定宽、淡出。
/// 换成补间后连 Spine 运行时对这个件也不再有依赖。
/// </summary>
public static class LandRingFx
{
    /// <summary>星环从弹开到淡完的时长(秒)。</summary>
    public const float Duration = 0.55f;

    /// <summary>起始缩放与峰值缩放:从小弹到略过头再收，读作「砰」一下。</summary>
    private const float StartScale = 0.35f;
    private const float PeakScale = 1.15f;

    /// <summary>
    /// 在 <paramref name="parent"/>(窗根的特效层)上的 <paramref name="localPos"/> 放一发,
    /// <paramref name="width"/> 是星环的最终外径(设计像素)。
    /// </summary>
    public static void Spawn(RectTransform parent, Sprite ring, Vector2 localPos, float width, float speed)
    {
        if (ring == null) return;
        float duration = Duration / Mathf.Max(0.01f, speed);

        var go = new GameObject("LandRing", typeof(RectTransform), typeof(Image), typeof(CanvasGroup));
        var rt = (RectTransform)go.transform;
        rt.SetParent(parent, false);
        rt.anchorMin = rt.anchorMax = rt.pivot = new Vector2(0.5f, 0.5f);
        rt.anchoredPosition = localPos;
        rt.sizeDelta = new Vector2(width, width);
        rt.localScale = Vector3.one * StartScale;

        var image = go.GetComponent<Image>();
        image.sprite = ring;
        image.raycastTarget = false;
        image.preserveAspect = true;

        var group = go.GetComponent<CanvasGroup>();
        group.alpha = 1f;

        Sequence seq = DOTween.Sequence().SetUpdate(true).SetLink(go);
        seq.Append(rt.DOScale(PeakScale, duration * 0.45f).SetEase(Ease.OutBack));
        seq.Join(group.DOFade(0f, duration).SetEase(Ease.InQuad));
        seq.Append(rt.DOScale(PeakScale * 1.1f, duration * 0.55f).SetEase(Ease.OutQuad));
        seq.OnComplete(() => { if (go != null) Object.Destroy(go); });
    }
}
