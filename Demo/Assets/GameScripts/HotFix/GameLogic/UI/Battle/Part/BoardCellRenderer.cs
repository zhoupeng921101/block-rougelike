using System;
using System.Collections.Generic;
using GameRules;
using UnityEngine;

/// <summary>
/// 盘上每一格画成什么样:有块的格一个 <see cref="BlockPart"/>,颜色按所属块的骨牌种类;死格画成暗块;空格不画(格底在 m_grid_CellBg 那一层)。
///
/// 增删改一律「空则退场、有则复用、缺则新建摆位」:复用而非每次重建,故全量刷新与拖动预览这类高频刷新不产生 Instantiate。
/// 输入只有规则核心的只读盘面(<see cref="IBoardView"/>);格上不标点数(13 号票:点数只标在托盘块上)。
/// </summary>
public sealed class BoardCellRenderer
{
    private const int N = BlockLayout.BoardSize;

    private readonly BoardGeometry _geo;
    private readonly RectTransform _cellLayer;
    private readonly GameObject _blockPrefab;
    private readonly Material _brightenTemplate;

    /// <param name="brightenTemplate">UI_Brighten 的模板材质(盘面区序列化持有,shader 随它进包);首次提亮时克隆一份。</param>
    public BoardCellRenderer(BoardGeometry geo, RectTransform cellLayer, GameObject blockPrefab, Material brightenTemplate)
    {
        _geo = geo;
        _cellLayer = cellLayer;
        _blockPrefab = blockPrefab;
        _brightenTemplate = brightenTemplate;
    }

    private readonly BlockPart[,] _blockParts = new BlockPart[N, N];

    /// <summary>对某格已存在的方块做一次落子放大反馈（越界/空格安全忽略）。</summary>
    public void PunchCell(int row, int col)
    {
        if (row < 0 || row >= N || col < 0 || col >= N) return;
        var w = _blockParts[row, col];
        if (w != null) w.Punch();
    }

    /// <summary>
    /// 按盘面全量重画。<paramref name="instanceOf"/> 按实例 id 取块(要它的骨牌种类定颜色),取不到的格按白色画。
    /// </summary>
    public void Refresh(IBoardView board, Func<int, BlockInstance> instanceOf)
    {
        _geo.SyncCellBgLayout();
        for (int r = 0; r < N; r++)
            for (int c = 0; c < N; c++)
                SyncBlockCell(board, instanceOf, r, c);
        // 延后退场只作用于登记后的这一次刷新:没在这次被移除的格不该把延迟带到以后某次无关的移除上。
        Array.Clear(_exitDelay, 0, _exitDelay.Length);
    }

    /// <summary>某格当前画着的方块(没有则 null)。只给战斗窗的调试核对读。</summary>
    public BlockPart PartAt(int row, int col) => _blockParts[row, col];

    /// <summary>各格下一次被移除时的退场延迟(秒),0 = 当即退场。由 <see cref="DeferExit"/> 登记,下一次 <see cref="Refresh"/> 用掉即清。</summary>
    private readonly float[,] _exitDelay = new float[N, N];

    /// <summary>登记 (r, c) 在紧接着的那次 <see cref="Refresh"/> 里晚 <paramref name="delay"/> 秒再退场(逐格扫出时每格按自己那一拍走)。</summary>
    public void DeferExit(int r, int c, float delay)
    {
        if (r < 0 || r >= N || c < 0 || c >= N) return;
        _exitDelay[r, c] = Mathf.Max(_exitDelay[r, c], delay);
    }

    // ── 消行预览:将被消行列里已有的块提亮上浮(提亮材质 UI_Brighten,32 号票从动物乐园搬来,团队自写)──

    /// <summary>上浮时的放大倍数(动物乐园原值)。</summary>
    private const float HighlightScale = 1.06f;

    /// <summary>提亮量:rgb 朝白色推的比例(动物乐园原值,见 UI_Brighten shader 的 _Amount)。</summary>
    private const float HighlightBrighten = 0.35f;

    private readonly HashSet<BlockPart> _highlighted = new HashSet<BlockPart>();

    private Material _brighten;

    /// <summary>把 <paramref name="rows"/> / <paramref name="cols"/> 上已有的块提亮并放大;先复原上一次的。</summary>
    public void HighlightLines(IReadOnlyList<int> rows, IReadOnlyList<int> cols)
    {
        ClearHighlight();
        if (_brighten == null)
        {
            _brighten = new Material(_brightenTemplate);
            _brighten.SetFloat("_Amount", HighlightBrighten);
        }
        void Mark(int r, int c)
        {
            var part = _blockParts[r, c];
            if (part == null || !_highlighted.Add(part)) return;
            part.SetHighlight(_brighten, HighlightScale);
        }
        for (int i = 0; rows != null && i < rows.Count; i++)
            for (int c = 0; c < N; c++) Mark(rows[i], c);
        for (int i = 0; cols != null && i < cols.Count; i++)
            for (int r = 0; r < N; r++) Mark(r, cols[i]);
    }

    /// <summary>复原全部提亮上浮的块。可重复调用。</summary>
    public void ClearHighlight()
    {
        foreach (var part in _highlighted)
            if (part != null) part.SetHighlight(null, 1f);
        _highlighted.Clear();
    }

    /// <summary>运行时克隆的提亮材质随盘面区销毁。</summary>
    public void DestroyMaterials()
    {
        if (_brighten != null) UnityEngine.Object.Destroy(_brighten);
    }

    // ── 整盘入场:按对角线逐格弹入 ──

    /// <summary>相邻两条对角线的错峰(秒):整盘 15 条对角线约 0.3s 铺完。</summary>
    private const float EntranceDiagonalStep = 0.02f;

    /// <summary>
    /// 盘上现有的每个方块按对角线(左上起)逐格弹入。只演出,不改格表;
    /// 弹入中的格照常参与刷新与退场(退场会停掉弹入,见 <see cref="BlockPart.PlayExit"/>)。
    /// </summary>
    public void PlayEntrance()
    {
        for (int r = 0; r < N; r++)
            for (int c = 0; c < N; c++)
                _blockParts[r, c]?.PlayEnter((r + c) * EntranceDiagonalStep);
    }

    // 单格的增删改:空格让已有实例退场,有块的格复用已有实例、缺则新建并摆位,最后无条件上色。
    // 退场中的节点已不在格表里,不挡新落进同格的方块。
    private void SyncBlockCell(IBoardView board, Func<int, BlockInstance> instanceOf, int r, int c)
    {
        int cell = BoardCells.Index(r, c);
        bool dead = board.IsDead(cell);
        int owner = board.OwnerAt(cell);
        var existing = _blockParts[r, c];
        if (owner == 0 && !dead)
        {
            if (existing != null)
            {
                _blockParts[r, c] = null;
                if (_highlighted.Remove(existing)) existing.SetHighlight(null, 1f);
                existing.PlayExit(ClearPacing.CellExit / ClearPacing.Speed, BlockLayout.CellExitEndScale, _exitDelay[r, c]);
            }
            return;
        }

        var block = existing ?? CreateCell(r, c);
        if (block == null) return; // 失败原因已由 UIPartFactory 记录
        block.SetColor(dead ? BlockLayout.DeadCellColor : ColorOfOwner(instanceOf, owner));
    }

    /// <summary>在 (r, c) 新建一格并登记进格表。格尺寸与位置按盘面层 rect 现算;单格视觉边长 = 格距 - BoardCellGap,与格底同口径。</summary>
    private BlockPart CreateCell(int r, int c)
    {
        var block = UIPartFactory.Create<BlockPart>(_blockPrefab, _cellLayer, nameof(BoardCellRenderer));
        if (block == null) return null;
        float visual = _geo.BoardCellVisual();
        var rt = block.rectTransform;
        rt.anchorMin = rt.anchorMax = new Vector2(0.5f, 0.5f);
        rt.pivot = new Vector2(0.5f, 0.5f);
        rt.localScale = Vector3.one;
        rt.sizeDelta = new Vector2(visual, visual);
        rt.anchoredPosition = _geo.CellLocalPos(c, r);
        _blockParts[r, c] = block;
        return block;
    }

    // ── 结算演出(30 号票):演出不回读规则核心的盘面(那时已是这一步的终态),按事件逐格摆、逐格摘 ──

    /// <summary>
    /// 把刚落下那块的格画上(<paramref name="cells"/> 是 row*8 + col),返回各格。被消的格在规则核心的终态里已经空了,
    /// 全量刷新画不出来,演出要先按 <see cref="GameRules.PiecePlaced"/> 把它们摆上,再逐拍摘走。
    /// </summary>
    public List<BlockPart> ShowPlaced(IReadOnlyList<int> cells, Color color)
    {
        var parts = new List<BlockPart>(cells.Count);
        foreach (int cell in cells)
        {
            int r = BoardCells.RowOf(cell), c = BoardCells.ColOf(cell);
            var block = _blockParts[r, c] ?? CreateCell(r, c);
            if (block == null) continue;
            block.SetColor(color);
            parts.Add(block);
        }
        return parts;
    }

    /// <summary>把 (r, c) 那一格从格表里摘下来交给演出退场;没有则 null。摘下之后它不再参与任何刷新。提亮留着,格带着亮色退场。</summary>
    public BlockPart TakeForExit(int r, int c)
    {
        var part = _blockParts[r, c];
        if (part == null) return null;
        _blockParts[r, c] = null;
        _highlighted.Remove(part);
        return part;
    }

    private static Color ColorOfOwner(Func<int, BlockInstance> instanceOf, int owner)
    {
        BlockInstance b = instanceOf(owner);
        return b != null ? BlockLayout.ColorOf(b) : Color.white;
    }
}
