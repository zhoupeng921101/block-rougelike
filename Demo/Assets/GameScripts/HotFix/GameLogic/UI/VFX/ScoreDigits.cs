using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 得分美术数字(摘自动物乐园 GameLogic/UI/VFX/ScoreDigits,32 号票):把一串「+0~9」排成一行位图字,每个字一张图(<see cref="BattleFxAssets.Digits"/>)。
/// 只管建,不管动画;建出的根节点居中、pivot 居中,调用方按 anchoredPosition 摆放、按 localScale 缩放。
/// </summary>
/// <remarks>
/// 同一套字等高、基线对齐,墨迹高 <see cref="SourceInkHeight"/> 像素;外描边烤在字图里,相邻字要按 <see cref="Overlap"/> 叠进去排,
/// 否则字距被描边撑得很散。本作只带动物乐园的「普通」一套(连击两套没搬:3B 连击只记数)。
/// </remarks>
public static class ScoreDigits
{
    /// <summary>字图里数字的墨迹高(源像素)。摆放尺寸按「目标墨迹高 ÷ 本值」缩放。</summary>
    public const float SourceInkHeight = 120f;

    /// <summary>相邻字叠进去的量(源像素):字图左右各留了描边余量,不叠的话字距是余量的两倍。</summary>
    private const float Overlap = 22f;

    /// <summary>字 → <see cref="BattleFxAssets.Digits"/> 的下标(0–9 是数字,10 是「+」);字符集外返回 -1(跳过)。</summary>
    private static int IndexOf(char ch) => ch >= '0' && ch <= '9' ? ch - '0' : ch == '+' ? 10 : -1;

    /// <summary>
    /// 建一行美术数字挂到 <paramref name="parent"/> 下,返回其根节点(居中锚、pivot 居中,尺寸 = 整行源像素外框,带 CanvasGroup 供淡出)。
    /// </summary>
    /// <param name="inkHeight">摆放后的墨迹高(<paramref name="parent"/> 本地单位),整行按它统一缩放。</param>
    public static RectTransform Create(Transform parent, Sprite[] digits, string text, float inkHeight)
    {
        var go = new GameObject("ScoreDigits", typeof(RectTransform), typeof(CanvasGroup));
        var root = (RectTransform)go.transform;
        root.SetParent(parent, false);
        root.anchorMin = root.anchorMax = root.pivot = new Vector2(0.5f, 0.5f);
        var group = go.GetComponent<CanvasGroup>();
        group.blocksRaycasts = false;
        group.interactable = false;

        float x = 0f, height = 0f;
        int built = 0;
        var glyphs = new RectTransform[text.Length];
        for (int i = 0; i < text.Length; i++)
        {
            int idx = IndexOf(text[i]);
            Sprite sprite = idx >= 0 && digits != null && idx < digits.Length ? digits[idx] : null;
            if (sprite == null) continue;

            var g = new GameObject(sprite.name, typeof(RectTransform), typeof(Image));
            var rt = (RectTransform)g.transform;
            rt.SetParent(root, false);
            rt.anchorMin = rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0f, 0.5f);
            var img = g.GetComponent<Image>();
            img.raycastTarget = false;
            img.sprite = sprite;

            var size = sprite.rect.size;
            rt.sizeDelta = size;
            if (built > 0) x -= Overlap;
            rt.anchoredPosition = new Vector2(x, 0f);
            x += size.x;
            if (size.y > height) height = size.y;
            glyphs[built++] = rt;
        }

        float half = x * 0.5f;
        for (int i = 0; i < built; i++) glyphs[i].anchoredPosition -= new Vector2(half, 0f);
        root.sizeDelta = new Vector2(x, height);
        root.localScale = Vector3.one * (inkHeight / SourceInkHeight);
        return root;
    }
}
