namespace GameRules {
using System.Collections.Generic;

/// <summary>
/// 七种四格骨牌的 19 个朝向。id 沿用 block-client 形状表的编号(那张表有 71 个形状,3B 只要四格骨牌,裁去其余 52 个),
/// 骨牌种类到基准 id 的对照见 <see cref="Tetromino"/>。
/// </summary>
public static class BlockShapeMap
{
    /// <summary>
    /// 形状定义原表:七种四格骨牌的全部朝向(I 7/17,O 9,T 10/20/25/26,S 14/16,Z 18/19,J 8/29/30/31,L 32/33/34/42)。
    /// 对外一律经 <see cref="Map"/> 取用:那份裁过空边,而本表允许宽松写法。
    /// </summary>
    private static readonly IReadOnlyDictionary<int, BlockShape> Definitions = new Dictionary<int, BlockShape>
    {
        { 7,   new BlockShape(1, 4, new[] { 1, 1, 1, 1 }) },
        { 8,   new BlockShape(3, 2, new[] { 4, 7 }) },
        { 9,   new BlockShape(2, 2, new[] { 3, 3 }) },
        { 10,  new BlockShape(3, 2, new[] { 2, 7 }) },
        { 14,  new BlockShape(3, 2, new[] { 3, 6 }) },
        { 16,  new BlockShape(2, 3, new[] { 2, 3, 1 }) },
        { 17,  new BlockShape(4, 1, new[] { 15 }) },
        { 18,  new BlockShape(3, 2, new[] { 6, 3 }) },
        { 19,  new BlockShape(2, 3, new[] { 1, 3, 2 }) },
        { 20,  new BlockShape(2, 3, new[] { 2, 3, 2 }) },
        { 25,  new BlockShape(2, 3, new[] { 1, 3, 1 }) },
        { 26,  new BlockShape(3, 2, new[] { 7, 2 }) },
        { 29,  new BlockShape(2, 3, new[] { 1, 1, 3 }) },
        { 30,  new BlockShape(3, 2, new[] { 7, 1 }) },
        { 31,  new BlockShape(2, 3, new[] { 3, 2, 2 }) },
        { 32,  new BlockShape(2, 3, new[] { 3, 1, 1 }) },
        { 33,  new BlockShape(3, 2, new[] { 1, 7 }) },
        { 34,  new BlockShape(3, 2, new[] { 7, 4 }) },
        { 42,  new BlockShape(2, 3, new[] { 2, 2, 3 }) },
    };

    /// <summary>
    /// 对外的形状表:每个形状的包围盒都贴合它声明的 Width/Height。
    /// </summary>
    /// <remarks>
    /// 判定层拿 Width/Height 当边界用(<c>BinaryBoard.CanPutBlock</c> 的 <c>pos.X + Width > ColCount</c>、
    /// <c>OfferBoard.CanPlace</c> 的 <c>c + Width <= N</c>)。声明宽于实占时,多出来的那条空边把靠边的
    /// 落点整列(或整行)吃掉:玩家看着有位置却放不进去,而卡死判定走同一条路,盘面还有解就弹消除道具。
    /// </remarks>
    public static readonly IReadOnlyDictionary<int, BlockShape> Map = BuildNormalizedMap();

    /// <summary>
    /// <see cref="Definitions"/> 里包围盒不贴合声明尺寸、建表时被裁过空边的形状 id。
    /// </summary>
    /// <remarks>
    /// 正常为空。裁剪会平移格坐标,而 <c>_c_block_anchor_cfg.xlsx</c> 的锚点按定义原表的坐标配——
    /// 源定义留着空边,锚点就会落到错的格上,严重时落到空格上被整行丢弃。
    /// 由 <c>Tools/BlockBlast/形状表自检</c> 消费。
    /// </remarks>
    public static readonly IReadOnlyList<int> NonTightDefinitionIds = BuildNonTightIds();

    private static Dictionary<int, BlockShape> BuildNormalizedMap()
    {
        var dict = new Dictionary<int, BlockShape>(Definitions.Count);
        foreach (var pair in Definitions) dict[pair.Key] = Normalize(pair.Value);
        return dict;
    }

    private static List<int> BuildNonTightIds()
    {
        var ids = new List<int>();
        foreach (var pair in Definitions)
        {
            if (!ReferenceEquals(Map[pair.Key], pair.Value)) ids.Add(pair.Key);
        }
        ids.Sort();
        return ids;
    }

    /// <summary>
    /// 裁掉四周的空行空列。已经贴合的原样返回同一个实例(<see cref="BuildNonTightIds"/> 据此判裁没裁过)。
    /// </summary>
    private static BlockShape Normalize(BlockShape s)
    {
        int top = -1, bottom = -1;
        for (int r = 0; r < s.Height; r++)
        {
            if (s.Shape[r] == 0) continue;
            if (top < 0) top = r;
            bottom = r;
        }
        if (top < 0) return s; // 全空形状:没有包围盒可算,原样返回交给自检点名

        int left = s.Width, right = -1;
        for (int r = top; r <= bottom; r++)
        {
            for (int c = 0; c < s.Width; c++)
            {
                if (((s.Shape[r] >> (s.Width - c - 1)) & 1) == 0) continue;
                if (c < left) left = c;
                if (c > right) right = c;
            }
        }

        int w = right - left + 1, h = bottom - top + 1;
        if (w == s.Width && h == s.Height) return s;

        // 位序 MSB=最左列:裁掉右侧 (Width-1-right) 列就是右移这么多位,再按新宽度截断掉左侧多余的。
        int shift = s.Width - 1 - right;
        int mask = (1 << w) - 1;
        var rows = new int[h];
        for (int i = 0; i < h; i++) rows[i] = (s.Shape[top + i] >> shift) & mask;
        return new BlockShape(w, h, rows);
    }

    /// <summary>每个形状包含的格子数（预计算）。对外经 <see cref="GetCellCount"/> 取用。</summary>
    private static readonly IReadOnlyDictionary<int, int> BlockNumMap = BuildBlockNumMap();

    /// <summary>尝试取形状，未找到返回 null。</summary>
    public static BlockShape Get(int id) => Map.TryGetValue(id, out var s) ? s : null;

    /// <summary>取该形状包含的格子数，未找到返回 0。</summary>
    public static int GetCellCount(int id) => BlockNumMap.TryGetValue(id, out var n) ? n : 0;

    /// <summary>
    /// 一块落下最多能同时凑满的行列数 = 各形状「宽 + 高」的最大值(一块只碰得到它占的那几行几列;旋转不改这个和)。
    /// 服务端拿它作上报「单步消行数」的值域上界:消除分随条数平方增长,上界松一倍,虚报能多拿的分就多四倍。
    /// </summary>
    public static readonly int MaxLinesPerPlacement = MaxSpan(Map);

    private static int MaxSpan(IReadOnlyDictionary<int, BlockShape> shapes)
    {
        int max = 0;
        foreach (var pair in shapes)
        {
            int span = pair.Value.Width + pair.Value.Height;
            if (span > max) max = span;
        }
        return max;
    }

    // ── 旋转 ────────────────────────────────────────────────────

    /// <summary>旋转档位数。rot 取 0..3，每档顺时针 90°，0 = 发牌原样。</summary>
    public const int RotCount = 4;

    /// <summary>每个形状的四档旋转结果（预计算）。下标 = rot，[0] 是原形状实例本身。</summary>
    private static readonly IReadOnlyDictionary<int, BlockShape[]> RotatedMap = BuildRotatedMap();

    /// <summary>每个形状转满一圈会出现几种不同朝向（预计算）。</summary>
    private static readonly IReadOnlyDictionary<int, int> OrientationCountMap = BuildOrientationCountMap();

    /// <summary>取形状按 rot 档顺时针旋转后的结果，未找到返回 null。rot 超出 0..3 时按 4 取模。</summary>
    public static BlockShape GetRotated(int id, int rot)
        => RotatedMap.TryGetValue(id, out var arr) ? arr[NormalizeRot(rot)] : null;

    /// <summary>
    /// 该形状有几种不同朝向（1 / 2 / 4），未找到返回 0。
    /// 枚举「任一朝向能否放下」时按它截断：正方形四档全同，转满 4 档是三档白算。
    /// </summary>
    public static int GetOrientationCount(int id)
        => OrientationCountMap.TryGetValue(id, out var n) ? n : 0;

    /// <summary>rot 归一到 0..3（负数同样落回该区间）。</summary>
    public static int NormalizeRot(int rot) => ((rot % RotCount) + RotCount) % RotCount;

    /// <summary>
    /// 把原始朝向下的格坐标 (r, c) 映射到 rot 档旋转后的格坐标。
    ///
    /// <b>与 <see cref="GetRotated"/> 必须落在同一套格上</b>：那边按位掩码整行转、这边逐格转，
    /// 两处若各写一份公式，会变成掩码校验说放得下、逐格写盘却写到别的格——只在非对称形状上显形。
    /// 故 <see cref="GetRotated"/> 的建表也走本方法，不另写旋转。
    ///
    /// 逐格转这一路存在的理由：<c>PendingPiece.Elements</c> 按原始朝向的填充格顺序编号，
    /// 沿原始朝向遍历、只把落点转过去，元素与格的对应关系就不随旋转变动。
    /// </summary>
    public static void RotateCell(int width, int height, int rot, int r, int c, out int rr, out int rc)
    {
        int w = width, h = height, cr = r, cc = c;
        int n = NormalizeRot(rot);
        for (int i = 0; i < n; i++)
        {
            int nr = cc;
            int nc = h - 1 - cr;
            cr = nr;
            cc = nc;
            (w, h) = (h, w);
        }
        rr = cr;
        rc = cc;
    }

    private static Dictionary<int, BlockShape[]> BuildRotatedMap()
    {
        var dict = new Dictionary<int, BlockShape[]>();
        foreach (var pair in Map)
        {
            var arr = new BlockShape[RotCount];
            arr[0] = pair.Value;
            for (int rot = 1; rot < RotCount; rot++) arr[rot] = RotateShape(pair.Value, rot);
            dict[pair.Key] = arr;
        }
        return dict;
    }

    private static BlockShape RotateShape(BlockShape src, int rot)
    {
        bool swap = NormalizeRot(rot) % 2 != 0;
        int w = swap ? src.Height : src.Width;
        int h = swap ? src.Width : src.Height;
        var rows = new int[h];
        for (int r = 0; r < src.Height; r++)
        {
            for (int c = 0; c < src.Width; c++)
            {
                if (((src.Shape[r] >> (src.Width - c - 1)) & 1) == 0) continue;
                RotateCell(src.Width, src.Height, rot, r, c, out int rr, out int rc);
                rows[rr] |= 1 << (w - rc - 1);
            }
        }
        return new BlockShape(w, h, rows);
    }

    private static Dictionary<int, int> BuildOrientationCountMap()
    {
        var dict = new Dictionary<int, int>();
        foreach (var pair in RotatedMap)
        {
            var arr = pair.Value;
            int count = RotCount;
            for (int rot = 1; rot < RotCount; rot++)
            {
                if (!SameShape(arr[0], arr[rot])) continue;
                count = rot;
                break;
            }
            dict[pair.Key] = count;
        }
        return dict;
    }

    private static bool SameShape(BlockShape a, BlockShape b)
    {
        if (a.Width != b.Width || a.Height != b.Height) return false;
        for (int r = 0; r < a.Height; r++)
        {
            if (a.Shape[r] != b.Shape[r]) return false;
        }
        return true;
    }

    private static Dictionary<int, int> BuildBlockNumMap()
    {
        var dict = new Dictionary<int, int>();
        foreach (var pair in Map)
        {
            int count = 0;
            foreach (var row in pair.Value.Shape)
            {
                int x = row;
                while (x != 0) { count += x & 1; x >>= 1; }
            }
            dict[pair.Key] = count;
        }
        return dict;
    }
}
}
