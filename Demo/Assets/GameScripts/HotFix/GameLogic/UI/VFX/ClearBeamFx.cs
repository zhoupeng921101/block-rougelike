using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 消行光束(31 号票第 16 项):一条线一发,横贯整行/整列,颜色按落下那块的种类染。
/// 原来是动物乐园的 DragonBones 七色动画(db_xc)与彩虹版(db_clearRainbow),阶段 6 换成
/// 一张白色横光带 + 一张彩虹光带,按骨牌色染、按方向转 90 度,补间只做「闪一下再淡出」。
/// </summary>
public static class ClearBeamFx
{
    /// <summary>一发光束的时长(秒):起亮 0.06 秒、淡出到 0.32 秒。</summary>
    public const float Duration = 0.32f;

    private const float RiseShare = 0.18f;

    /// <summary>光带厚度占行长度的比例(盘面 640 时约 64 像素)。</summary>
    private const float ThicknessRatio = 0.10f;

    /// <summary>
    /// 在某一条线的中心放一发。<paramref name="angleDeg"/> 传 0 是横线、90 是竖线;
    /// <paramref name="tint"/> 是光带颜色(白图染色,彩虹图传白)。
    /// </summary>
    public static void Spawn(RectTransform parent, Sprite beam, Vector2 center, float span, float angleDeg, Color tint, float speed)
    {
        if (beam == null) return;
        float duration = Duration / Mathf.Max(0.01f, speed);
        float thickness = span * ThicknessRatio;

        var go = new GameObject("ClearBeam", typeof(RectTransform), typeof(Image), typeof(CanvasGroup));
        var rt = (RectTransform)go.transform;
        rt.SetParent(parent, false);
        rt.anchorMin = rt.anchorMax = rt.pivot = new Vector2(0.5f, 0.5f);
        rt.anchoredPosition = center;
        rt.sizeDelta = new Vector2(span, thickness);
        rt.localRotation = Quaternion.Euler(0f, 0f, angleDeg);

        var image = go.GetComponent<Image>();
        image.sprite = beam;
        image.raycastTarget = false;
        image.preserveAspect = false;
        image.color = tint;

        var group = go.GetComponent<CanvasGroup>();
        group.alpha = 0f;

        Sequence seq = DOTween.Sequence().SetUpdate(true).SetLink(go);
        seq.Append(group.DOFade(1f, duration * RiseShare).SetEase(Ease.OutQuad));
        seq.Join(rt.DOScaleY(1.12f, duration * RiseShare).SetEase(Ease.OutQuad));
        seq.Append(group.DOFade(0f, duration * (1f - RiseShare)).SetEase(Ease.InQuad));
        seq.Join(rt.DOScaleY(0.86f, duration * (1f - RiseShare)).SetEase(Ease.OutQuad));
        seq.OnComplete(() => { if (go != null) Object.Destroy(go); });
    }
}
