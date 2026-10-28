using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 清屏方块雨(摘自动物乐园 GameLogic/UI/VFX/AllClearRainFx,32 号票):一批方块拖着同色竖向光尾,从盘上沿外错峰落下、穿过盘面落出下沿,裁在盘面格区内。
/// 方块用盘面的格模板、按七种骨牌的占位色交替着落(3B 不搬方块皮肤,31 号票第 22 项);光尾是柔光图拉长染色。
/// </summary>
/// <remarks>
/// 只演出:图元全不吃射线,雨中照常可拖可落。一份实例常驻特效层(首用时建),每次清屏重放;位置每帧由本类直接写,不起补间。
/// 下列节拍是动物乐园的原值(实际秒数),按 <see cref="ClearPacing.Speed"/> 折。
/// </remarks>
public sealed class AllClearRainFx : MonoBehaviour
{
    /// <summary>每场雨的方块数:8 列各落三颗。</summary>
    private const int DropCount = 24;

    /// <summary>第一颗与最后一颗起落的间隔(秒)。</summary>
    private const float SpawnSpan = 0.9f;

    /// <summary>起落时刻的随机抖动(秒),同列三颗不排成等距。</summary>
    private const float SpawnJitter = 0.05f;

    /// <summary>一颗从盘上沿外落到下沿外的时长(秒)。</summary>
    private const float FallDurMin = 0.5f;
    private const float FallDurMax = 0.68f;

    /// <summary>方块边长(格)。比格子小一圈,读成「落下的方块」而不是盘面又铺了一层。</summary>
    private const float SizeMinCells = 0.6f;
    private const float SizeMaxCells = 0.8f;

    /// <summary>光尾长、宽(方块边长的倍数)与不透明度。</summary>
    private const float TrailLength = 3f;
    private const float TrailWidth = 1f;
    private const float TrailAlpha = 0.9f;

    /// <summary>落完全程转过的最大角度(度)。</summary>
    private const float SpinMax = 45f;

    /// <summary>落点横向抖动(格)。</summary>
    private const float ColumnJitterCells = 0.18f;

    private struct Drop
    {
        public RectTransform Root;
        public RectTransform Block;
        public Image Trail;
        public float Start;
        public float Dur;
        public float Spin;
    }

    private readonly Drop[] _drops = new Drop[DropCount];
    private RectTransform _rect;
    private float _t;
    private float _span;
    private float _margin;
    private float _endAt;

    /// <summary>在 <paramref name="parent"/> 下建一份方块雨(隐藏,待 <see cref="Play"/>)。模板建不出时返回 null。</summary>
    /// <param name="blockPrefab">盘面格模板(<see cref="BlockPart"/>)。</param>
    /// <param name="glow">光尾用的柔光图。</param>
    public static AllClearRainFx Create(RectTransform parent, GameObject blockPrefab, Sprite glow)
    {
        if (parent == null || blockPrefab == null) return null;

        var go = new GameObject("AllClearRain", typeof(RectTransform), typeof(RectMask2D));
        var rect = (RectTransform)go.transform;
        rect.SetParent(parent, false);
        rect.anchorMin = rect.anchorMax = rect.pivot = new Vector2(0.5f, 0.5f);

        var fx = go.AddComponent<AllClearRainFx>();
        fx._rect = rect;
        for (int i = 0; i < DropCount; i++)
        {
            var rootGo = new GameObject("Drop", typeof(RectTransform));
            var root = (RectTransform)rootGo.transform;
            root.SetParent(rect, false);
            root.anchorMin = root.anchorMax = root.pivot = new Vector2(0.5f, 0.5f);

            // 光尾在方块上方(雨往下落,尾巴拖在后面):柔光图下段压在方块底下,向上拉长,与方块之间不留缝。
            var trailGo = new GameObject("Trail", typeof(RectTransform), typeof(Image));
            var trail = (RectTransform)trailGo.transform;
            trail.SetParent(root, false);
            trail.anchorMin = trail.anchorMax = new Vector2(0.5f, 0.5f);
            trail.pivot = new Vector2(0.5f, 0.3f);
            var trailImg = trailGo.GetComponent<Image>();
            trailImg.raycastTarget = false;
            trailImg.sprite = glow;
            trailImg.enabled = glow != null;

            var block = UIPartFactory.Create<BlockPart>(blockPrefab, root, nameof(AllClearRainFx));
            if (block == null)
            {
                Destroy(go);
                return null;
            }
            foreach (var g in block.GetComponentsInChildren<Graphic>(true)) g.raycastTarget = false;
            var blockRt = block.rectTransform;
            blockRt.anchorMin = blockRt.anchorMax = blockRt.pivot = new Vector2(0.5f, 0.5f);
            blockRt.anchoredPosition = Vector2.zero;
            blockRt.localScale = Vector3.one;

            fx._drops[i] = new Drop { Root = root, Block = blockRt, Trail = trailImg };
            rootGo.SetActive(false);
        }

        go.SetActive(false);
        return fx;
    }

    /// <summary>
    /// 播一场雨:<paramref name="startDelay"/> 秒后第一颗从盘上沿外落下。上一场还没落完就重新起(两次清屏的间隔不会这么短,不做叠加)。
    /// </summary>
    /// <param name="boardCenter">盘心(父层本地坐标,矩形中心原点)。</param>
    /// <param name="cell">格边长(父层本地单位)。</param>
    /// <param name="speed">节拍除以它(<see cref="ClearPacing.Speed"/>)。</param>
    public void Play(Vector2 boardCenter, float cell, float startDelay, float speed)
    {
        int n = BlockLayout.BoardSize;
        float k = speed > 0f ? 1f / speed : 1f;
        _span = n * cell;
        _rect.sizeDelta = new Vector2(_span, _span);
        _rect.anchoredPosition = boardCenter;
        _rect.SetAsLastSibling();

        // 8 列 × 3 轮,每轮列序打乱,整场下来每列三颗、不扎堆;颜色在七种骨牌里轮着取,相邻两颗不同色。
        var cols = new int[n];
        for (int c = 0; c < n; c++) cols[c] = c;
        int kinds = BlockLayout.KindCount;
        int kind = Random.Range(0, kinds);
        float maxSize = SizeMaxCells * cell;
        _margin = maxSize * (TrailLength + 0.5f);
        _endAt = 0f;
        for (int i = 0; i < DropCount; i++)
        {
            int inRound = i % n;
            if (inRound == 0)
            {
                for (int j = n - 1; j > 0; j--)
                {
                    int r = Random.Range(0, j + 1);
                    (cols[j], cols[r]) = (cols[r], cols[j]);
                }
            }
            kind = (kind + 1 + Random.Range(0, kinds - 1)) % kinds;
            Color color = BlockLayout.ColorOf((GameRules.TetrominoKind)kind);

            float size = Random.Range(SizeMinCells, SizeMaxCells) * cell;
            ref var d = ref _drops[i];
            d.Start = (startDelay + SpawnSpan * i / (DropCount - 1) + Random.Range(-SpawnJitter, SpawnJitter)) * k;
            d.Dur = Random.Range(FallDurMin, FallDurMax) * k;
            d.Spin = Random.Range(-SpinMax, SpinMax);
            _endAt = Mathf.Max(_endAt, d.Start + d.Dur);

            float x = (cols[inRound] + 0.5f) * cell - _span * 0.5f + Random.Range(-ColumnJitterCells, ColumnJitterCells) * cell;
            d.Root.anchoredPosition = new Vector2(x, _span * 0.5f + _margin);
            d.Block.sizeDelta = new Vector2(size, size);
            d.Block.localRotation = Quaternion.identity;
            d.Block.GetComponent<BlockPart>().SetColor(color);

            d.Trail.rectTransform.sizeDelta = new Vector2(size * TrailWidth, size * TrailLength);
            d.Trail.color = new Color(color.r, color.g, color.b, TrailAlpha);
            d.Root.gameObject.SetActive(false);
        }

        _t = 0f;
        gameObject.SetActive(true);
    }

    private void Update()
    {
        _t += Time.unscaledDeltaTime;
        float top = _span * 0.5f + _margin;
        float fall = _span + _margin * 2f;
        for (int i = 0; i < DropCount; i++)
        {
            ref var d = ref _drops[i];
            float p = (_t - d.Start) / d.Dur;
            bool on = p >= 0f && p <= 1f;
            if (d.Root.gameObject.activeSelf != on) d.Root.gameObject.SetActive(on);
            if (!on) continue;

            // 先慢后快:像被甩下来,而不是匀速平移。
            float eased = p * (0.45f + 0.55f * p);
            var pos = d.Root.anchoredPosition;
            pos.y = top - fall * eased;
            d.Root.anchoredPosition = pos;
            d.Block.localRotation = Quaternion.Euler(0f, 0f, d.Spin * p);
        }

        if (_t > _endAt) gameObject.SetActive(false);
    }
}
