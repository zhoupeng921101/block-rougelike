using System.Collections.Generic;
using GameRules;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 落点虚影池与消除预览池:虚影、行内填充、呼吸光带三个池的建池与复用。拖拽流(29 号票)判好落点与将消的行列后推进来。
///
/// 三个池都挂在预览层(与盘面层同尺寸同坐标系),用格心坐标定位,故「虚影格 = 盘上格的视觉位置」。
/// 层内次序(填充 &lt; 光带)靠创建先后 + 各自置顶维持;跨层次序(方块格 &lt; 预览)由 prefab 的层节点次序固定。
/// 光带在 block-client 用 UI_GlowCell 材质画描边辉光,那个 shader 还没搬(要先确认来源),本图是默认材质的纯色条加呼吸。
/// </summary>
public sealed class BoardPreviewLayer
{
    private const int N = BlockLayout.BoardSize;

    private readonly BoardGeometry _geo;
    private readonly RectTransform _previewLayer;
    private readonly GameObject _blockPrefab;
    private readonly GameObject _fillPrefab;
    private readonly GameObject _glowPrefab;

    public BoardPreviewLayer(BoardGeometry geo, RectTransform previewLayer, GameObject blockPrefab,
        GameObject fillPrefab, GameObject glowPrefab)
    {
        _geo = geo;
        _previewLayer = previewLayer;
        _blockPrefab = blockPrefab;
        _fillPrefab = fillPrefab;
        _glowPrefab = glowPrefab;
    }

    // 一块四格骨牌的虚影最多 4 格。
    private readonly BlockPart[] _ghostPool = new BlockPart[Tetromino.CellCount];

    private int _ghostUsed;

    // 一手最多 5 条线(规则 §3.3),池按 2N 备。
    private const int BandCap = 2 * N;

    /// <summary>光带厚度相对行/列厚度的倍数。</summary>
    private const float BandScale = 1.6f;

    private readonly Image[] _glowPool = new Image[BandCap];

    private readonly GlowPulse[] _glowPulses = new GlowPulse[BandCap];

    private int _glowUsed;

    private readonly Image[] _fillPool = new Image[BandCap];

    private int _fillUsed;

    /// <summary>建池。宿主开窗时调一次。</summary>
    public void InitPools()
    {
        for (int i = 0; i < _ghostPool.Length; i++)
        {
            // 用盘面方块同一个模板:虚影就是「落下后那块」的半透明版
            var ghost = UIPartFactory.Create<BlockPart>(_blockPrefab, _previewLayer, nameof(BoardPreviewLayer));
            if (ghost == null) return;   // 失败原因已由 UIPartFactory 记录,放弃建池
            var rt = ghost.rectTransform;
            rt.anchorMin = rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.localScale = Vector3.one;
            // 虚影压在盘面上,挡射线会截走拖拽事件
            foreach (var g in ghost.GetComponentsInChildren<Graphic>(true)) g.raycastTarget = false;
            ghost.gameObject.SetActive(false);
            _ghostPool[i] = ghost;
        }

        for (int i = 0; i < _fillPool.Length; i++)
        {
            var fill = UIPartFactory.Create<Image>(_fillPrefab, _previewLayer, nameof(BoardPreviewLayer));
            if (fill == null) return;
            fill.raycastTarget = false;
            fill.gameObject.SetActive(false);
            _fillPool[i] = fill;
        }
        for (int i = 0; i < _glowPool.Length; i++)
        {
            var pulse = UIPartFactory.Create<GlowPulse>(_glowPrefab, _previewLayer, nameof(BoardPreviewLayer));
            if (pulse == null) return;
            var img = pulse.GetComponent<Image>();   // 模板根上就是这张图,GlowPulse 自己也这么取
            img.raycastTarget = false;
            pulse.gameObject.SetActive(false);
            _glowPulses[i] = pulse;
            _glowPool[i] = img;
        }
    }

    /// <summary>
    /// 落点虚影:<paramref name="shape"/> 包围盒左上角落在 (col,row) 时,每格画一块半透明方块。只在放得下时调,调用前先 <see cref="ClearGhostAndPreview"/>。
    /// </summary>
    /// <param name="color">手上那块的颜色,虚影照它画、alpha 取 <see cref="BlockLayout.GhostAlpha"/>。</param>
    public void ShowGhost(BlockShape shape, int col, int row, Color color)
    {
        if (shape == null) return;
        float visual = _geo.BoardCellVisual();
        var ghostSize = new Vector2(visual, visual);
        for (int r = 0; r < shape.Height; r++)
        {
            for (int c = 0; c < shape.Width; c++)
            {
                if (((shape.Shape[r] >> (shape.Width - c - 1)) & 1) == 0) continue;
                int gc = col + c, gr = row + r;
                if (gc < 0 || gc >= N || gr < 0 || gr >= N) continue;
                if (_ghostUsed >= _ghostPool.Length) break;
                var ghost = _ghostPool[_ghostUsed++];
                ghost.rectTransform.sizeDelta = ghostSize;
                ghost.rectTransform.anchoredPosition = _geo.CellLocalPos(gc, gr);
                ghost.SetColor(color);
                ghost.SetAlpha(BlockLayout.GhostAlpha);
                ghost.gameObject.SetActive(true);
            }
        }
    }

    /// <summary>
    /// 消除预览:每条满行铺一条横带、每条满列铺一条竖带,先铺填充、再铺光带。调用前先画虚影。
    /// </summary>
    public void ShowClearPreview(IReadOnlyList<int> rows, IReadOnlyList<int> cols)
    {
        if ((rows == null || rows.Count == 0) && (cols == null || cols.Count == 0)) return;

        float cell = _geo.CellSize();
        float boardSpan = N * cell;
        float bandThick = cell * BandScale;
        float boardCenterX = (_geo.CellLocalPos(0, 0).x + _geo.CellLocalPos(N - 1, 0).x) * 0.5f;
        float boardCenterY = (_geo.CellLocalPos(0, 0).y + _geo.CellLocalPos(0, N - 1).y) * 0.5f;

        if (rows != null)
            for (int i = 0; i < rows.Count; i++)
                ShowFill(new Vector2(boardSpan, cell), new Vector2(boardCenterX, _geo.CellLocalPos(0, rows[i]).y));
        if (cols != null)
            for (int i = 0; i < cols.Count; i++)
                ShowFill(new Vector2(cell, boardSpan), new Vector2(_geo.CellLocalPos(cols[i], 0).x, boardCenterY));

        if (rows != null)
            for (int i = 0; i < rows.Count; i++)
                ShowBand(new Vector2(boardSpan, bandThick), new Vector2(boardCenterX, _geo.CellLocalPos(0, rows[i]).y));
        if (cols != null)
            for (int i = 0; i < cols.Count; i++)
                ShowBand(new Vector2(bandThick, boardSpan), new Vector2(_geo.CellLocalPos(cols[i], 0).x, boardCenterY));
    }

    private void ShowBand(Vector2 size, Vector2 pos)
    {
        if (_glowUsed >= _glowPool.Length) return;
        var img = _glowPool[_glowUsed];
        var pulse = _glowPulses[_glowUsed];
        _glowUsed++;
        img.rectTransform.sizeDelta = size;
        img.rectTransform.anchoredPosition = pos;
        img.transform.SetAsLastSibling();
        pulse.BaseColor = BlockLayout.ClearPreviewGlowColor;
        pulse.SetRainbow(false);
        pulse.enabled = true;   // 结算演出淡出光带时停过它(见 TryGetBand)
        pulse.Restart(_glowUsed * 0.06f);   // 几条错开相位,不齐刷刷地呼吸
        img.gameObject.SetActive(true);
    }

    private void ShowFill(Vector2 size, Vector2 pos)
    {
        if (_fillUsed >= _fillPool.Length) return;
        var img = _fillPool[_fillUsed];
        _fillUsed++;
        img.rectTransform.sizeDelta = size;
        img.rectTransform.anchoredPosition = pos;
        img.color = BlockLayout.ClearPreviewFillColor;
        img.transform.SetAsLastSibling();
        img.gameObject.SetActive(true);
    }

    /// <summary>
    /// 这次消除预览的第 <paramref name="line"/> 条线(先行后列,与 <see cref="ShowClearPreview"/> 的入参同序)的填充与光带。
    /// 结算演出在这条线的最后一格退场时把它们淡出(21 号票第 2 节);淡出前要先停掉光带的呼吸,否则呼吸每帧改回 alpha。
    /// </summary>
    public bool TryGetBand(int line, out Image fill, out Image glow, out GlowPulse pulse)
    {
        fill = line >= 0 && line < _fillUsed ? _fillPool[line] : null;
        glow = line >= 0 && line < _glowUsed ? _glowPool[line] : null;
        pulse = glow != null ? _glowPulses[line] : null;
        return fill != null && glow != null;
    }

    /// <summary>收起全部虚影、填充与光带(拖动换格、落子、取消时调)。</summary>
    public void ClearGhostAndPreview()
    {
        for (int i = 0; i < _ghostUsed; i++) _ghostPool[i].gameObject.SetActive(false);
        _ghostUsed = 0;
        for (int i = 0; i < _glowUsed; i++) _glowPool[i].gameObject.SetActive(false);
        _glowUsed = 0;
        for (int i = 0; i < _fillUsed; i++) _fillPool[i].gameObject.SetActive(false);
        _fillUsed = 0;
    }
}
