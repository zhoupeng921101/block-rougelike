using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 续玩进战斗窗的扫描线(31 号票第 20 项)。原来是动物乐园的 DragonBones 素材(db_FHQPD),
/// 只剩「一条光带 + 整体淡出」,位移本来就由代码驱动;阶段 6 换成一张横光带图加补间,
/// 省掉那套骨骼,画面也换成太空像素风。
///
/// 光带自盘底外扫到盘顶外,越出盘面的两段由 <see cref="RectMask2D"/> 裁掉。
/// </summary>
public static class BoardSweepFx
{
    /// <summary>扫一趟的时长(秒):光带走完盘面并淡出。换动物乐园那版约 0.75 秒。</summary>
    public const float Duration = 0.75f;

    /// <summary>光带高度占行程的比例(盘面 640 时约 115 像素)。</summary>
    private const float BandHeightRatio = 0.18f;

    /// <summary>
    /// 在 <paramref name="parent"/>(特效层)上放一趟扫描线。<paramref name="center"/> 是盘面中心,
    /// <paramref name="span"/> 是盘面边长;播完自动销毁。
    /// </summary>
    public static void Spawn(RectTransform parent, Sprite band, Vector2 center, float span, float speed)
    {
        if (band == null) return;
        float duration = Duration / Mathf.Max(0.01f, speed);

        // 裁剪容器另建一层:RectMask2D 挂在特效层自己身上会连别的特效一起裁
        var clipGo = new GameObject("BoardSweepClip", typeof(RectTransform), typeof(RectMask2D));
        var clip = (RectTransform)clipGo.transform;
        clip.SetParent(parent, false);
        clip.anchorMin = clip.anchorMax = clip.pivot = new Vector2(0.5f, 0.5f);
        clip.sizeDelta = new Vector2(span, span);
        clip.anchoredPosition = center;
        clip.SetAsLastSibling();

        float bandHeight = span * BandHeightRatio;
        var bandGo = new GameObject("BoardSweepBand", typeof(RectTransform), typeof(Image));
        var bandRt = (RectTransform)bandGo.transform;
        bandRt.SetParent(clip, false);
        bandRt.anchorMin = bandRt.anchorMax = bandRt.pivot = new Vector2(0.5f, 0.5f);
        bandRt.sizeDelta = new Vector2(span, bandHeight);
        var image = bandGo.GetComponent<Image>();
        image.sprite = band;
        image.raycastTarget = false;
        image.preserveAspect = false;

        // 行程两端各多走半个光带高,光带从盘沿渐进进出
        float half = (span + bandHeight) * 0.5f;
        bandRt.anchoredPosition = new Vector2(0f, -half);
        var group = bandGo.AddComponent<CanvasGroup>();
        Sequence seq = DOTween.Sequence().SetUpdate(true).SetLink(bandGo);
        seq.Append(bandRt.DOAnchorPosY(half, duration).SetEase(Ease.OutCubic));
        seq.Join(group.DOFade(0f, duration * 0.55f).SetEase(Ease.InQuad).SetDelay(duration * 0.45f));
        seq.OnComplete(() => { if (bandGo != null) Object.Destroy(bandGo); });

        Object.Destroy(clipGo, duration + 0.2f);
    }
}
