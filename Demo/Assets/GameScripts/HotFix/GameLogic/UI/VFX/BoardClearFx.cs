using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 清屏时整盘格网亮起(31 号票第 17 项)。原来是动物乐园的两套 DragonBones 素材
/// (db_CC / db_FHQP,轮播),阶段 6 换成代码现摆的 8×8 层,用柔光团当格心,
/// 两套走向轮播:
///   A —— 从盘心向外一圈圈铺开,亮起后整盘一起灭;
///   B —— 从盘心向外铺开时带一点上浮,灭得比 A 快。
/// 节点会沉到特效层最底,盖在格底上、不盖住同时在场的碎块与方块雨。
/// </summary>
public static class BoardClearFx
{
    /// <summary>相邻两圈的间隔(秒)。</summary>
    private const float RingStep = 0.05f;

    private const float RiseA = 0.10f, FallA = 0.42f;
    private const float RiseB = 0.08f, FallB = 0.26f;

    /// <summary>格边长占格距的比例。</summary>
    private const float CellFill = 0.94f;

    private const float PeakA = 0.95f, PeakB = 0.8f;

    /// <summary>
    /// 在特效层上放一轮清屏庆祝。<paramref name="variantB"/> 为 true 用第二套走向。
    /// </summary>
    public static void Play(RectTransform layer, Sprite glow, int grid, float cellSize, Vector2 center, float speed, bool variantB)
    {
        if (glow == null || grid <= 0) return;
        float k = 1f / Mathf.Max(0.01f, speed);
        float step = RingStep * k;
        float rise = (variantB ? RiseB : RiseA) * k;
        float fall = (variantB ? FallB : FallA) * k;
        float peak = variantB ? PeakB : PeakA;
        int mid = grid / 2;

        var rootGo = new GameObject("BoardClear", typeof(RectTransform));
        var root = (RectTransform)rootGo.transform;
        root.SetParent(layer, false);
        root.anchorMin = root.anchorMax = root.pivot = new Vector2(0.5f, 0.5f);
        root.anchoredPosition = center;
        root.sizeDelta = new Vector2(grid * cellSize, grid * cellSize);
        root.SetAsFirstSibling();

        float half = grid * cellSize * 0.5f;
        float cell = cellSize * CellFill;
        int maxRing = 0;
        for (int row = 0; row < grid; row++)
        {
            for (int col = 0; col < grid; col++)
            {
                int ring = Mathf.Max(Mathf.Abs(col - mid), Mathf.Abs(row - mid));
                if (ring > maxRing) maxRing = ring;

                var go = new GameObject("Cell", typeof(RectTransform), typeof(Image), typeof(CanvasGroup));
                var rt = (RectTransform)go.transform;
                rt.SetParent(root, false);
                rt.anchorMin = rt.anchorMax = rt.pivot = new Vector2(0.5f, 0.5f);
                rt.sizeDelta = new Vector2(cell, cell);
                rt.anchoredPosition = new Vector2(-half + cellSize * (col + 0.5f), half - cellSize * (row + 0.5f));

                var image = go.GetComponent<Image>();
                image.sprite = glow;
                image.raycastTarget = false;

                var group = go.GetComponent<CanvasGroup>();
                group.alpha = 0f;

                float delay = ring * step;
                Sequence seq = DOTween.Sequence().SetUpdate(true).SetLink(go)
                    .AppendInterval(delay)
                    .Append(group.DOFade(peak, rise).SetEase(Ease.OutQuad))
                    .Append(group.DOFade(0f, fall).SetEase(Ease.InQuad));
                if (variantB)
                {
                    Vector2 from = rt.anchoredPosition;
                    rt.anchoredPosition = from - new Vector2(0f, cellSize * 0.35f);
                    seq.Insert(delay, rt.DOAnchorPos(from, rise + fall).SetEase(Ease.OutCubic));
                }
            }
        }

        Object.Destroy(rootGo, maxRing * step + rise + fall + 0.15f);
    }
}
