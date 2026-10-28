using GameRules;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 盘面几何的单一事实源:格尺寸、格心坐标、四套坐标系的互换、屏幕点反算。
///
/// 全部按盘面层(BoardLayer)的 rect 现算,故改它的 sizeDelta 棋盘随之缩放、格底与方块一起走。
/// 盘面上并存两套原点不同的坐标系(格坐标系以矩形中心为原点、Transform 局部空间以 pivot 为原点),
/// 互换一律经本类,不在使用方自行 TransformPoint —— 那样必然漏掉两者之差(见 <see cref="CellSpaceOrigin"/>)。
/// </summary>
public sealed class BoardGeometry
{
    private readonly RectTransform _board;
    private readonly GridLayoutGroup _cellBg;

    /// <param name="board">盘面层(BoardLayer)= 格几何的量取对象:格尺寸与原点全按它的 rect 现算。</param>
    /// <param name="cellBg">格底方格那一层的网格布局,由 <see cref="SyncCellBgLayout"/> 对齐到同一格几何。</param>
    public BoardGeometry(RectTransform board, GridLayoutGroup cellBg)
    {
        _board = board;
        _cellBg = cellBg;
    }

    private const int N = BlockLayout.BoardSize;

    /// <summary>所属 Canvas 缓存(懒取;Part 生命周期内父链不变,ScreenToCell 逐拖动事件调用不逐次查父链)。</summary>
    private Canvas _canvas;

    public float CellSize()
    {
        var rect = _board.rect;
        return Mathf.Min(rect.width, rect.height) / N;
    }

    /// <summary>
    /// 单格的视觉边长 = 格距减间隙,与格底方格、方块格三者同一个数。
    /// 图案的原生尺寸封顶取它而不取 <see cref="CellSize"/>:格距含格与格之间的缝,
    /// 按格距封顶会让图案铺到缝上、与相邻格的图案贴死。
    /// </summary>
    public float BoardCellVisual() => CellSize() - BlockLayout.BoardCellGap;

    /// <summary>上一次已同步给格底网格的格尺寸(NaN = 尚未同步过)。</summary>
    private float _cellBgSyncedCell = float.NaN;

    /// <summary>
    /// 把格底网格的格距与原点对齐到本部件的自适应格几何。
    ///
    /// 令 cellSize = cell - gap、spacing = gap、padding 全 0、childAlignment 居中,则网格总宽 = 8*cell - gap、
    /// 居中后左边距 = gap/2、首格中心 = -3.5*cell——与 <see cref="CellLocalPos"/> 在 col=0 处恒等,
    /// 且与 gap 取值无关。格底与方块因此共用同一格距与原点:改 BoardLayer 尺寸或改
    /// <see cref="BlockLayout.BoardCellGap"/>,两者一起走,不会再各算各的。
    ///
    /// 六项一并在代码里写,不只写 cellSize/spacing:其余四项都是上面那条恒等式的前提。
    /// padding 与 childAlignment 决定网格整体落在哪——留在 prefab 上被人顺手改成左上对齐或加一圈 padding,
    /// 格底就整体平移、而方块不动。列数尤其不能留 Flexible:那一档按容器尺寸现算列数,
    /// BoardLayer 恰好是正方时凑出 8x8、看着没事,换成长方(CellSize() 本就按短边均分、允许长方)
    /// 立刻排成别的行列数——实测 640x900 下排成 11 行 6 列,整盘格底与方块全错开。
    ///
    /// 违反「prefab 静态挂载优先」是有意的:格距是 BoardLayer 尺寸的派生量,不是编辑期可独立敲定的设计值,
    /// 烤进 prefab 等于把同一个量写两遍——本次修的正是那两份值对不上。prefab 上仍留 1000x1000 下的算出值,
    /// 使编辑期版面与运行期一致。
    /// </summary>
    public void SyncCellBgLayout()
    {
        float cell = CellSize();
        if (cell.Equals(_cellBgSyncedCell)) return;   // 格尺寸没变就不碰,免得每次 Refresh 都标脏一次布局
        _cellBgSyncedCell = cell;

        float gap = BlockLayout.BoardCellGap;
        _cellBg.padding = new RectOffset(0, 0, 0, 0);
        _cellBg.childAlignment = TextAnchor.MiddleCenter;
        _cellBg.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
        _cellBg.constraintCount = N;
        _cellBg.cellSize = new Vector2(cell - gap, cell - gap);
        _cellBg.spacing = new Vector2(gap, gap);
    }

    /// <summary>
    /// 棋盘格 (col,row) 中心在**格坐标系**里的位置（X 右正 Y 上正）。
    /// col 右增、row 下增（与数据数组 row 自上而下一致）。
    ///
    /// 产出可直接写进 BoardLayer 子层（PreviewLayer / ElementLayer / CellLayer，均 anchor 居中）
    /// 下节点的 anchoredPosition；要换到世界或屏幕空间一律经 <see cref="CellSpaceToWorld"/> /
    /// <see cref="WorldToCellSpace"/>，不自行 TransformPoint（理由见 <see cref="CellSpaceOrigin"/>）。
    /// </summary>
    public Vector2 CellLocalPos(int col, int row)
    {
        float cell = CellSize();
        float grid = cell * N;
        float x = -grid / 2f + cell / 2f + col * cell;
        float y = grid / 2f - cell / 2f - row * cell;
        return new Vector2(x, y);
    }

    /// <summary>
    /// 格坐标系原点在 BoardLayer 的 Transform 局部空间里的位置，两套坐标系靠它互换。
    ///
    /// 盘面上并存两套原点不同的坐标系，它们只在 BoardLayer 的 pivot 居中时才重合：
    /// <list type="bullet">
    /// <item>**格坐标系**（<see cref="CellLocalPos"/>）以 BoardLayer 的**矩形中心**为原点——
    /// 子层节点 anchor 居中，其 anchoredPosition 的原点就是父矩形中心，与 pivot 无关。</item>
    /// <item>**Transform 局部空间**（<c>InverseTransformPoint</c> / <c>TransformPoint</c> /
    /// <c>RectTransformUtility.ScreenPointToLocalPointInRectangle</c>）以 BoardLayer 的 **pivot** 为原点。</item>
    /// </list>
    ///
    /// 本量恒等于 <c>rectTransform.rect.center</c>，pivot 居中时为零、贴边时不为零。**不能假定为零**：
    /// 主玩法窗的 BoardLayer pivot 贴顶，假定为零会整体偏棋盘高的一半（4 格）。
    /// </summary>
    private Vector2 CellSpaceOrigin => _board.rect.center;

    /// <summary>BoardLayer 的 Transform 局部坐标（原点在 pivot）→ 格坐标系。</summary>
    public Vector2 LocalToCellSpace(Vector2 pivotLocal) => pivotLocal - CellSpaceOrigin;

    /// <summary>世界坐标 → 格坐标系。「手上那块方块落在哪一格」这类反算的唯一入口。</summary>
    public Vector2 WorldToCellSpace(Vector3 world) => LocalToCellSpace(_board.InverseTransformPoint(world));

    /// <summary>
    /// 格坐标系 → BoardLayer 的 Transform 局部坐标（原点在 pivot）。
    /// 挂载特效不用它：全部特效件都按 anchor 居中的 anchoredPosition 定位，原点本就是矩形中心，直接吃格坐标。
    /// </summary>
    private Vector2 CellSpaceToLocal(Vector2 cellSpace) => cellSpace + CellSpaceOrigin;

    /// <summary>格坐标系 → 世界坐标。盘上某点要交给别的层（飞行父层、引导前景层）时的唯一出口。</summary>
    public Vector3 CellSpaceToWorld(Vector2 cellSpace) => _board.TransformPoint(CellSpaceToLocal(cellSpace));

    /// <summary>棋盘格 (col,row) 中心的世界坐标。</summary>
    public Vector3 CellWorldPos(int col, int row) => CellSpaceToWorld(CellLocalPos(col, row));

    /// <summary>
    /// 一片格区 [col, col+width) × [row, row+height) 的几何中心的世界坐标。
    /// 手指 / 飞行终点要对准整块方块而非单格时用它。
    /// </summary>
    public Vector3 CellRectCenterWorld(int col, int row, int width, int height)
    {
        Vector2 a = CellLocalPos(col, row);
        Vector2 b = CellLocalPos(col + width - 1, row + height - 1);
        return CellSpaceToWorld((a + b) * 0.5f);
    }

    /// <summary>屏幕点 → 格坐标系。落在 Canvas 之外（换算失败）时返回 false，调用方不得使用 out 值。</summary>
    private bool ScreenToCellSpace(Vector2 screen, out Vector2 cellSpace)
    {
        if (_canvas == null) _canvas = _board.GetComponentInParent<Canvas>();
        if (!UICanvasSpace.ScreenToLocal(_board, _canvas, screen, out var local))
        {
            cellSpace = default;
            return false;
        }
        cellSpace = LocalToCellSpace(local);
        return true;
    }

    /// <summary>
    /// 屏幕点 → 棋盘格 (col,row)（消除道具点格用）。换算到格坐标系，用与渲染同一套自适应格尺寸/原点反算。
    /// 越界返回的 col/row 可能 &lt;0 或 ≥N，由调用方判定。
    /// </summary>
    public (int col, int row) ScreenToCell(Vector2 screen)
    {
        if (!ScreenToCellSpace(screen, out var local)) return (-1, -1);
        var idx = CellSpaceToCellIndex(local);
        return (Mathf.FloorToInt(idx.x), Mathf.FloorToInt(idx.y));
    }

    /// <summary>
    /// 屏幕点 → 消除道具清除区的**左上角**格。
    ///
    /// 落法是「手指在区域下边」：手指所在格是区域下边那一行，区域向上占一行——
    /// 使预览出现在手指正上方而不被手指压住（道具拖起物恒贴手指、无偏移，见 ClearToolDragger 头注）。
    /// 横向按手指在格内的左右半边决定它是左下格还是右下格，使区域水平中心尽量对齐手指；
    /// 2×2 没有中心列，半边判定是能做到的最接近「中下」的落法。
    ///
    /// 越界值原样返回，夹紧统一交 <see cref="BinaryBoard.ResolveClearToolOrigin"/>。
    /// </summary>
    /// <remarks>
    /// 半边判定用「加半格再向下取整」而不是 <c>Mathf.RoundToInt</c>：后者是银行家舍入，
    /// 手指恰在格中心（小数恰好 .5）时结果随列号奇偶跳变。
    ///
    /// 本方法是「手指位置 → 区域左上角」这条规则的唯一落点：它需要屏幕亚格坐标，
    /// 而发牌器推进与挂机选点只有整数格坐标，故规则留在手势侧、下游各路径统一收左上角。
    /// </remarks>
    public (int col, int row) ScreenToClearToolOrigin(Vector2 screen)
    {
        if (!ScreenToCellSpace(screen, out var local)) return (-1, -1);

        var idx = CellSpaceToCellIndex(local);
        // 区域覆盖列 [origin, origin+2)，中心 = origin + 1；令它贴近连续列坐标即 origin = idx.x - 1 取整。
        int col = Mathf.FloorToInt(idx.x + 0.5f) - 1;
        // 手指格是下边行，故左上角在它上面一行。
        return (col, Mathf.FloorToInt(idx.y) - 1);
    }

    /// <summary>
    /// 格坐标 -> 连续格索引(x = 列、y = 行,均含亚格小数)。<see cref="CellLocalPos"/> 的逆式,
    /// 屏幕反算的两条路径(反算格 / 反算清除区左上角)共用它 —— 此前两处各自重算一遍 grid 与半格偏移。
    /// </summary>
    private Vector2 CellSpaceToCellIndex(Vector2 cellSpace)
    {
        float cell = CellSize();
        float grid = cell * N;
        return new Vector2((cellSpace.x + grid / 2f) / cell, (grid / 2f - cellSpace.y) / cell);
    }

    /// <summary>
    /// 消除道具清除区(<see cref="BinaryBoard.ClearToolSize"/> 平方)的几何中心,入参是左上角格。
    ///
    /// 区域中心不落在格上(2x2 无中心格),由左上格中心向右下各偏「半个区域减半格」得到。
    /// 特效与预览两条路径共用本方法 —— 此前两处各写一份逐字相同的式子,注释里还互相指着对方。
    /// </summary>
    public Vector2 ClearToolAreaCenter(int row, int col)
    {
        float cell = CellSize();
        float half = cell * BinaryBoard.ClearToolSize * 0.5f;
        var topLeft = CellLocalPos(col, row);
        return new Vector2(topLeft.x + half - cell * 0.5f, topLeft.y - half + cell * 0.5f);
    }
}
