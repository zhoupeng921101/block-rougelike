using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 开盲注时整盘逐格点亮(31 号票第 20 项)。原来是动物乐园的 DragonBones 素材(db_boardOpen,
/// a / b 两套走向各 7 色),阶段 6 换成代码现摆的 8×8 层:按对角线依次亮起再熄灭,
/// 两套走向轮着来。不用新图,直接用一张柔光方块做格心。
/// </summary>
public static class BoardOpenFx
{
    /// <summary>相邻两条对角线之间的间隔(秒);整盘亮完约 0.5 秒。</summary>
    private const float DiagonalStep = 0.035f;

    /// <summary>一格亮起与熄灭各占多久(秒)。</summary>
    private const float RiseDur = 0.09f;
    private const float FallDur = 0.22f;

    /// <summary>格的边长占格距的比例(留一道缝,读得出是一格一格)。</summary>
    private const float CellFill = 0.9f;

    /// <summary>亮起时的最大不透明度。</summary>
    private const float PeakAlpha = 0.85f;

    /// <summary>第几次开盲注,用来在两套走向之间轮换(与原来 a / b 轮播同义)。</summary>
    private static int _turn;

    /// <summary>
    /// 在特效层上放一轮开局点亮。<paramref name="grid"/> 是盘面格数(8),
    /// <paramref name="cellSize"/> 是格距,<paramref name="center"/> 是盘面中心。
    /// </summary>
    public static void Play(RectTransform layer, Sprite glow, int grid, float cellSize, Vector2 center, float speed)
    {
        if (glow == null || grid <= 0) return;
        float step = DiagonalStep / Mathf.Max(0.01f, speed);
        float rise = RiseDur / Mathf.Max(0.01f, speed);
        float fall = FallDur / Mathf.Max(0.01f, speed);
        bool flip = (_turn++ & 1) != 0;

        var rootGo = new GameObject("BoardOpen", typeof(RectTransform));
        var root = (RectTransform)rootGo.transform;
        root.SetParent(layer, false);
        root.anchorMin = root.anchorMax = root.pivot = new Vector2(0.5f, 0.5f);
        root.anchoredPosition = center;
        root.sizeDelta = new Vector2(grid * cellSize, grid * cellSize);
        root.SetAsLastSibling();

        float half = grid * cellSize * 0.5f;
        float cell = cellSize * CellFill;
        int last = 0;
        for (int row = 0; row < grid; row++)
        {
            for (int col = 0; col < grid; col++)
            {
                // 一套走向从左上到右下,另一套镜像过来
                int diag = flip ? (grid - 1 - col) + row : col + row;
                if (diag > last) last = diag;

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

                float delay = diag * step;
                DOTween.Sequence().SetUpdate(true).SetLink(go)
                    .AppendInterval(delay)
                    .Append(group.DOFade(PeakAlpha, rise).SetEase(Ease.OutQuad))
                    .Append(group.DOFade(0f, fall).SetEase(Ease.InQuad));
            }
        }

        Object.Destroy(rootGo, last * step + rise + fall + 0.1f);
    }
}
