namespace GameRules {
using System.Collections.Generic;

/// <summary>
/// 8×8 棋盘占用。内部是一个 64 位掩码:第 r 行占 bit r*8 .. r*8+7,行内 bit (ColCount-col-1)=1 表示该格被占用
/// (最左列是行内最高位)。按行取出的 8 位值即发牌器、对局存档与预设图案通用的「行掩码」,与它们逐位同构。
/// 表示不外露:外部只经按行 / 整盘接口读写,整盘拷贝、比较、判空都是单值操作。
/// </summary>
public sealed class BinaryBoard
{
    public const int RowCount = 8;
    public const int ColCount = 8;
    /// <summary>整行满的位掩码 = 0b11111111 = 255。</summary>
    public const int FullRow = (1 << ColCount) - 1;

    /// <summary>消除道具一次清除的正方形边长。</summary>
    public const int ClearToolSize = 2;

    /// <summary>
    /// 把**意向左上角**夹进盘内,使清除区恒占满 <see cref="ClearToolSize"/>² 格。
    /// 截断出界的那一半会让玩家在边缘花同样代价只买到一半效果,故夹紧而不截断。
    /// 越界入参一并夹进盘内,调用方不必先判界;夹紧幂等,重复调用不改变结果。
    ///
    /// **本方法不含「手指位置 → 左上角」那条规则**:那条规则要用屏幕亚格坐标(按手指在格内的
    /// 左右半边定区域向哪边展开),而 <c>ServerDealSync</c> 与挂机只有整数格坐标,故它落在手势层的
    /// <c>BoardAreaPart.ScreenToClearToolOrigin</c>,下游各路径统一收已解算的左上角。
    ///
    /// 清除、预览、销毁演出、发牌器推进几条路径共用本方法夹紧,不各夹各的:
    /// 任一处夹出不同结果,表现层画的框就与实际清掉的格错开。
    /// 落在本类而非玩法层,是因为 <c>ServerDealSync</c> 与 <c>BlockGameState</c> 都要用它,
    /// 而两者中任一方持有它都会让另一方反向依赖。
    /// </summary>
    public static void ResolveClearToolOrigin(int row, int col, out int originRow, out int originCol)
    {
        const int maxRow = RowCount - ClearToolSize;
        const int maxCol = ColCount - ClearToolSize;
        originRow = row < 0 ? 0 : (row > maxRow ? maxRow : row);
        originCol = col < 0 ? 0 : (col > maxCol ? maxCol : col);
    }

    /// <summary>每行最右列(行内 bit 0)组成的列掩码;左移 (ColCount-col-1) 即第 col 列。</summary>
    private const ulong RightColumn = 0x0101010101010101UL;

    /// <summary>64 位占用掩码(布局见类注释)。</summary>
    private ulong _cells;

    private static int RowShift(int row) => row * ColCount;

    private static int CellBit(int row, int col) => row * ColCount + (ColCount - col - 1);

    /// <summary>第 <paramref name="row"/> 行的行掩码(8 位,最左列为最高位)。</summary>
    public int GetRow(int row) => (int)((_cells >> RowShift(row)) & FullRow);

    /// <summary>整盘占用位(64 位,一格一位)。只读快照,供调用方以盘面为键做缓存比对。</summary>
    public ulong Cells => _cells;

    /// <summary>整行覆写为 <paramref name="bits"/>(只取低 8 位)。</summary>
    public void SetRow(int row, int bits)
    {
        int shift = RowShift(row);
        _cells = (_cells & ~((ulong)FullRow << shift)) | ((ulong)(bits & FullRow) << shift);
    }

    /// <summary>把 <paramref name="bits"/> 或进第 <paramref name="row"/> 行(不清既有占用)。</summary>
    public void OrRow(int row, int bits)
    {
        _cells |= (ulong)(bits & FullRow) << RowShift(row);
    }

    /// <summary>整盘导出为 8 个行掩码(新分配)。</summary>
    public int[] ToRows()
    {
        var rows = new int[RowCount];
        CopyRowsTo(rows);
        return rows;
    }

    /// <summary>整盘导出进调用方给的缓冲(长度 ≥ <see cref="RowCount"/>),零分配。</summary>
    public void CopyRowsTo(int[] rows)
    {
        for (int r = 0; r < RowCount; r++) rows[r] = GetRow(r);
    }

    /// <summary>整盘覆写为给定行掩码;不足 <see cref="RowCount"/> 行的其余行置空。</summary>
    public void SetRows(IReadOnlyList<int> rows)
    {
        _cells = 0UL;
        int count = rows.Count < RowCount ? rows.Count : RowCount;
        for (int r = 0; r < count; r++) OrRow(r, rows[r]);
    }

    /// <summary>两盘占用是否逐格相同。</summary>
    public bool SameAs(BinaryBoard other) => other != null && _cells == other._cells;

    /// <summary>清空整盘占用。</summary>
    public void Clear()
    {
        _cells = 0UL;
    }

    /// <summary>抹掉一格的占用位;越界格忽略。</summary>
    public void ClearCell(int row, int col)
    {
        if (row < 0 || row >= RowCount || col < 0 || col >= ColCount) return;
        _cells &= ~(1UL << CellBit(row, col));
    }

    /// <summary>棋盘是否为空。</summary>
    public bool IsEmpty() => _cells == 0UL;

    /// <summary>克隆。</summary>
    public BinaryBoard Clone()
    {
        var b = new BinaryBoard();
        b.CopyFrom(this);
        return b;
    }

    /// <summary>整盘覆写为 other 的盘面(模拟盘复用,免高频路径逐次 Clone 分配)。</summary>
    public void CopyFrom(BinaryBoard other)
    {
        _cells = other._cells;
    }

    /// <summary>形状按 rot 档朝向、左上角落在 pos 时覆盖的格;调用方须已保证整块在盘内。</summary>
    private static ulong ShapeMask(BlockShape shape, Vec2Int pos)
    {
        int xShift = ColCount - shape.Width - pos.X;
        ulong mask = 0UL;
        for (int i = 0; i < shape.Height; i++)
        {
            mask |= (ulong)(uint)(shape.Shape[i] << xShift) << RowShift(i + pos.Y);
        }
        return mask;
    }

    /// <summary>把形状按 rot 档朝向放到起点 pos（col=左, row=上） —— 不检查冲突。</summary>
    public void PutBlock(int shapeId, int rot, Vec2Int pos)
    {
        var shape = BlockShapeMap.GetRotated(shapeId, rot);
        if (shape == null) return;
        _cells |= ShapeMask(shape, pos);
    }

    /// <summary>校验形状按 rot 档朝向能否放到起点 pos。</summary>
    public bool CanPutBlock(int shapeId, int rot, Vec2Int pos)
    {
        var shape = BlockShapeMap.GetRotated(shapeId, rot);
        if (shape == null) return false;
        if (pos.X < 0 || pos.Y < 0) return false;
        if (pos.X + shape.Width > ColCount) return false;
        if (pos.Y + shape.Height > RowCount) return false;

        return (_cells & ShapeMask(shape, pos)) == 0UL;
    }

    /// <summary>返回该形状按 rot 档朝向的所有可放置位置。</summary>
    public List<Vec2Int> GetCanPutPoss(int shapeId, int rot)
    {
        var result = new List<Vec2Int>();
        var shape = BlockShapeMap.GetRotated(shapeId, rot);
        if (shape == null) return result;
        for (int x = 0; x <= ColCount - shape.Width; x++)
        {
            for (int y = 0; y <= RowCount - shape.Height; y++)
            {
                var pos = new Vec2Int(x, y);
                if (CanPutBlock(shapeId, rot, pos)) result.Add(pos);
            }
        }
        return result;
    }

    /// <summary>
    /// 该形状按 rot 档朝向能否放到当前棋盘任何位置。命中即返回,零分配(高频:死局判定每次落子链路多次调用)。
    /// 只问这一档朝向;玩家可转的场合问 <see cref="CanPutAnyRotation"/>。
    /// </summary>
    public bool CanPut(int shapeId, int rot)
    {
        var shape = BlockShapeMap.GetRotated(shapeId, rot);
        if (shape == null) return false;
        // 形状在循环里不变,只取一次;循环边界已保证不出界,故直接比掩码(判据同 CanPutBlock)。
        for (int x = 0; x <= ColCount - shape.Width; x++)
        {
            for (int y = 0; y <= RowCount - shape.Height; y++)
            {
                if ((_cells & ShapeMask(shape, new Vec2Int(x, y))) == 0UL) return true;
            }
        }
        return false;
    }

    /// <summary>
    /// 该形状转到<b>任一</b>朝向后能否放到当前棋盘任何位置。玩家能自己转朝向,
    /// 故「有没有出路」按本方法算;只问当前那一档会把「转一下就能走」误判成无解。
    /// 按该形状的实际朝向数截断枚举(正方形只有 1 档,转满 4 档是三档白算)。
    /// </summary>
    public bool CanPutAnyRotation(int shapeId)
    {
        int orientations = BlockShapeMap.GetOrientationCount(shapeId);
        for (int rot = 0; rot < orientations; rot++)
        {
            if (CanPut(shapeId, rot)) return true;
        }
        return false;
    }

    /// <summary>找出当前所有满行/满列，可选择就地消除。</summary>
    public ClearResult CanClearRowCols(bool doClear)
    {
        var result = new ClearResult();

        // 满行
        for (int r = 0; r < RowCount; r++)
        {
            if (GetRow(r) == FullRow) result.Rows.Add(r);
        }

        // 满列：所有行同列都是 1
        int colBits = FullRow;
        for (int r = 0; r < RowCount; r++) colBits &= GetRow(r);
        for (int c = ColCount - 1; colBits > 0; c--)
        {
            if ((colBits & 1) != 0) result.Cols.Add(c);
            colBits >>= 1;
        }

        if (doClear)
        {
            for (int i = 0; i < result.Rows.Count; i++) _cells &= ~((ulong)FullRow << RowShift(result.Rows[i]));
            for (int i = 0; i < result.Cols.Count; i++)
            {
                _cells &= ~(RightColumn << (ColCount - result.Cols[i] - 1));
            }
        }

        return result;
    }
}
}
