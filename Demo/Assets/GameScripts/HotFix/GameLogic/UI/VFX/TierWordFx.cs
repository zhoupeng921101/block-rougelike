using DG.Tweening;
using TEngine;
using UnityEngine;
using UnityEngine.UI;

// TEngine 也有个 Ease 枚举,同时 using 两个命名空间时裸写 Ease 报 CS0104。
using Ease = DG.Tweening.Ease;

/// <summary>
/// 评价字 Good / Great / Excellent / Unbelievable(摘自动物乐园 GameLogic/UI/VFX/TierWordFx,32 号票):弹出、停住、收一下再胀大淡出,
/// 字后垫一团同色柔光,周围闪几颗星光。播完自毁。档位由 <see cref="ClearFxTiers"/> 按 3B 的消除类型给(31 号票第 3 节)。
/// </summary>
/// <remarks>
/// 运动曲线与星光颗数是动物乐园的原值,已是实际秒数,不再乘 <see cref="ClearPacing.Speed"/> 以外的倍率。
/// 字图是动物乐园脚本渲染的四色 × 四词(<see cref="BattleFxAssets.TierWords"/>)。
/// </remarks>
public static class TierWordFx
{
    /// <summary>字图的大写字母墨迹高(源像素);摆放尺寸按「目标墨迹高 ÷ 本值」缩放。</summary>
    public const float SourceInkHeight = 80f;

    /// <summary>字色,即字图的四套配色;<see cref="BattleFxAssets.TierWords"/> 按「(档 − 1) × 4 + 色」排。</summary>
    public enum Tint
    {
        Blue = 0,
        Green = 1,
        Orange = 2,
        Purple = 3,
    }

    public const int TintCount = 4;

    /// <summary>档位 → 星光颗数,下标 = 档 − 1:Good / Great 两颗、Excellent 起四颗。</summary>
    private static readonly int[] StarCounts = { 2, 2, 4, 4 };

    /// <summary>各色的柔光与星光色(取字面中段的颜色,比描边亮)。</summary>
    private static readonly Color[] GlowColors =
    {
        new Color(0.45f, 0.72f, 1f),
        new Color(0.45f, 0.9f, 0.5f),
        new Color(1f, 0.7f, 0.3f),
        new Color(0.78f, 0.55f, 1f),
    };

    // ── 节拍(秒,实际值,自出现起算) ──
    private const float StartScale = 0.35f;
    private const float PopPeak = 1.15f;
    private const float PopUpDur = 0.08f;
    private const float PopBackDur = 0.08f;
    private const float SqueezeScale = 0.9f;
    private const float SqueezeDur = 0.05f;
    private const float BurstScale = 1.2f;
    private const float BurstDur = 0.1f;

    /// <summary>出现到开始收(退场第一拍)的时长。</summary>
    private const float ExitAt = 0.71f;

    /// <summary>柔光团相对字图的大小与不透明度。</summary>
    private const float GlowWidthRatio = 1.2f;
    private const float GlowHeightRatio = 1.7f;
    private const float GlowAlpha = 0.55f;

    /// <summary>星光边长(字图高的倍数)。</summary>
    private const float StarSizeRatio = 0.5f;

    /// <summary>星光相对字图中心的位置(字图宽 / 高的倍数),前两颗给两颗档,四颗档全用。</summary>
    private static readonly Vector2[] StarSpots =
    {
        new Vector2(-0.44f, 0.34f),
        new Vector2(0.46f, -0.26f),
        new Vector2(0.3f, 0.44f),
        new Vector2(-0.3f, -0.4f),
    };

    /// <summary>
    /// 在 <paramref name="parent"/> 下播一发评价字。<paramref name="tier"/> 取 1–4(0 档不出字);字图缺失时记 Warning、不播。
    /// </summary>
    /// <param name="scale">字图源像素到 parent 本地单位的缩放。</param>
    /// <param name="place">拿到缩放后的字图尺寸(parent 本地单位),返回字中心位置(parent 矩形中心原点):站位要按字宽字高夹进盘内。</param>
    /// <param name="speed">节拍除以它(<see cref="ClearPacing.Speed"/>)。</param>
    /// <returns>字的根节点;没播返回 null。</returns>
    public static GameObject Spawn(RectTransform parent, BattleFxAssets assets, int tier, Tint tint, float scale,
        System.Func<Vector2, Vector2> place, float speed)
    {
        if (tier < 1 || tier > StarCounts.Length) return null;
        int index = (tier - 1) * TintCount + (int)tint;
        Sprite wordSprite = assets.TierWords != null && index < assets.TierWords.Length ? assets.TierWords[index] : null;
        if (wordSprite == null)
        {
            Log.Warning($"[TierWordFx] 评价字图缺失(档 {tier}、色 {tint}),检查战斗窗上的 BattleFxAssets.TierWords。");
            return null;
        }
        float k = speed > 0f ? 1f / speed : 1f;

        var rootGo = new GameObject("TierWord", typeof(RectTransform), typeof(CanvasGroup));
        var root = (RectTransform)rootGo.transform;
        root.SetParent(parent, false);
        root.anchorMin = root.anchorMax = root.pivot = new Vector2(0.5f, 0.5f);
        root.SetAsLastSibling();

        var word = CreateImage(root, wordSprite);
        Vector2 src = wordSprite.rect.size;
        word.rectTransform.sizeDelta = src;
        root.anchoredPosition = place != null ? place(src * scale) : Vector2.zero;

        Color glowColor = GlowColors[(int)tint];
        if (assets.GlowSoft != null)
        {
            var glow = CreateImage(root, assets.GlowSoft);
            glow.transform.SetAsFirstSibling();
            glow.rectTransform.sizeDelta = new Vector2(src.x * GlowWidthRatio, src.y * GlowHeightRatio);
            glow.color = new Color(glowColor.r, glowColor.g, glowColor.b, GlowAlpha);
            glow.rectTransform.localScale = Vector3.one * 0.6f;
            DOTween.Sequence()
                .Append(glow.rectTransform.DOScale(1.1f, (PopUpDur + PopBackDur) * k).SetEase(Ease.OutQuad))
                .AppendInterval((ExitAt - PopUpDur - PopBackDur) * k)
                .Append(glow.DOFade(0f, (SqueezeDur + BurstDur) * k))
                .SetUpdate(true)
                .SetLink(rootGo);
        }

        int stars = Mathf.Min(StarCounts[tier - 1], StarSpots.Length);
        Color starColor = Color.Lerp(glowColor, Color.white, 0.45f);
        for (int i = 0; i < stars && assets.TierStar != null; i++)
        {
            var star = CreateImage(root, assets.TierStar);
            float size = src.y * StarSizeRatio;
            var rt = star.rectTransform;
            rt.sizeDelta = new Vector2(size, size);
            rt.anchoredPosition = Vector2.Scale(StarSpots[i], src);
            rt.localScale = Vector3.zero;
            star.color = starColor;
            DOTween.Sequence()
                .AppendInterval((0.06f + i * 0.07f) * k)
                .Append(rt.DOScale(1.2f, 0.12f * k).SetEase(Ease.OutBack))
                .Join(rt.DOLocalRotate(new Vector3(0f, 0f, 45f), 0.37f * k))
                .Append(rt.DOScale(0f, 0.25f * k).SetEase(Ease.InQuad))
                .SetUpdate(true)
                .SetLink(rootGo);
        }

        root.localScale = Vector3.one * (scale * StartScale);
        var group = rootGo.GetComponent<CanvasGroup>();
        group.blocksRaycasts = false;
        group.interactable = false;
        DOTween.Sequence()
            .Append(root.DOScale(scale * PopPeak, PopUpDur * k).SetEase(Ease.OutQuad))
            .Append(root.DOScale(scale, PopBackDur * k).SetEase(Ease.InOutQuad))
            .AppendInterval((ExitAt - PopUpDur - PopBackDur) * k)
            .Append(root.DOScale(scale * SqueezeScale, SqueezeDur * k))
            .Append(root.DOScale(scale * BurstScale, BurstDur * k).SetEase(Ease.OutQuad))
            .Join(group.DOFade(0f, BurstDur * k))
            .SetUpdate(true)
            .SetLink(rootGo)
            .OnComplete(() => Object.Destroy(rootGo));
        return rootGo;
    }

    /// <summary>骨牌种类 → 字色:四色之外的就近归入(I 青、J 蓝归蓝,O 黄、Z 红、L 橙归橙)。</summary>
    public static Tint TintOf(GameRules.TetrominoKind kind)
    {
        switch (kind)
        {
            case GameRules.TetrominoKind.S: return Tint.Green;
            case GameRules.TetrominoKind.T: return Tint.Purple;
            case GameRules.TetrominoKind.O:
            case GameRules.TetrominoKind.Z:
            case GameRules.TetrominoKind.L: return Tint.Orange;
            default: return Tint.Blue;
        }
    }

    private static Image CreateImage(Transform parent, Sprite sprite)
    {
        var go = new GameObject(sprite.name, typeof(RectTransform), typeof(Image));
        var rt = (RectTransform)go.transform;
        rt.SetParent(parent, false);
        rt.anchorMin = rt.anchorMax = rt.pivot = new Vector2(0.5f, 0.5f);
        var img = go.GetComponent<Image>();
        img.raycastTarget = false;
        img.sprite = sprite;
        return img;
    }
}
