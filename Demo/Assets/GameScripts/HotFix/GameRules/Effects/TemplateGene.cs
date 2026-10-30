using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>模板规则在哪个挂点生效。</summary>
    public enum GenePhase
    {
        /// <summary>逐格段,每个被消格每遍问一次。</summary>
        Cell = 0,

        /// <summary>重触发,每个被消格开始时问一次。</summary>
        Repetition = 1,

        /// <summary>基因段。</summary>
        Gene = 2,

        /// <summary>结算后,只能给钱。</summary>
        After = 3,
    }

    /// <summary>
    /// 模板规则的条件。带 <c>Cell</c> 前缀的看当前被消格(只在逐格、重触发两段有意义),其余看这次消除或局面。
    /// 参数统一放在 <see cref="GeneRule.Arg"/> 里,含义写在各项上。
    /// </summary>
    public enum GeneCond
    {
        Always = 0,

        /// <summary>格所属块的形状在掩码里(Arg = <see cref="TetrominoKind"/> 位掩码)。</summary>
        CellKindIn,
        CellPointsOdd,
        CellPointsEven,

        /// <summary>格所属块的点数等于 Arg。</summary>
        CellPointsEq,

        /// <summary>格所属块的点数 ≥ Arg。</summary>
        CellPointsAtLeast,

        /// <summary>格在网格四角之一。</summary>
        CellCorner,

        /// <summary>格在中心 Arg×Arg 的方块里(Arg 取偶数)。</summary>
        CellCenter,

        /// <summary>格属于放下的那块。</summary>
        CellOfPlaced,

        /// <summary>格属于放下的那块,且那块至少 1 格在最外一圈。</summary>
        CellOfPlacedOnEdge,

        /// <summary>格所属块的强化是 Arg(<see cref="Enhancement"/> 的值)。</summary>
        CellEnhancement,
        CellNoEnhancement,
        CellHasEdition,

        /// <summary>格所属块的形状是方块库里数量最多的那种(并列都算)。</summary>
        CellKindMostInLibrary,

        /// <summary>放下的那块的形状是 Arg(<see cref="TetrominoKind"/> 的值)。</summary>
        PlacedKindIs,

        /// <summary>线数 ≥ Arg。</summary>
        LinesAtLeast,

        /// <summary>线数 = Arg。</summary>
        LinesEq,
        HasRowAndCol,

        /// <summary>有 ≥ 2 条相邻的行,或 ≥ 2 条相邻的列。</summary>
        AdjacentParallel,

        /// <summary>有两条关于网格中线对称的行或列。</summary>
        SymmetricLines,

        /// <summary>消除类型在掩码里(Arg = 1 &lt;&lt; <see cref="ClearType"/>)。</summary>
        TypeIn,

        /// <summary>消除类型不是单线,且本盲注已经打出过(含这次 ≥ 2 次)。</summary>
        TypeRepeatInBlind,

        /// <summary>本盲注上一次消除的类型存在且和这次不同。</summary>
        TypeDiffersFromLast,

        /// <summary>被消格来自 ≥ Arg 种形状。</summary>
        ShapesAtLeast,

        /// <summary>被消格里掩码中的形状全都有(Arg = 位掩码)。</summary>
        ShapesAllOf,

        /// <summary>被消格所属块的点数全部 ≥ Arg。</summary>
        PointsAllAtLeast,

        /// <summary>被消格里有 ≥ Arg 种不同点数。</summary>
        DistinctPointsAtLeast,

        /// <summary>被消格里有 ≥ Arg 块带同一种强化。</summary>
        SameEnhancementAtLeast,

        /// <summary>消除前网格四角都被占。</summary>
        CornersOccupied,

        /// <summary>连击数 = Arg。</summary>
        ComboEq,

        /// <summary>连击数 ≥ Arg。</summary>
        ComboAtLeast,

        /// <summary>消除前被占的格 ≥ Arg。</summary>
        OccupiedBeforeAtLeast,

        /// <summary>消除后被占的格 ≤ Arg。</summary>
        OccupiedAfterAtMost,

        /// <summary>在打本盲注第一组。</summary>
        FirstGroup,

        /// <summary>方块库已经抽空(在打最后一组)。</summary>
        DrawEmpty,

        /// <summary>弃置次数用完。</summary>
        NoDiscardsLeft,

        /// <summary>方块库 ≤ Arg 块。</summary>
        LibraryAtMost,

        /// <summary>方块库里带强化的块 ≥ Arg。</summary>
        LibraryEnhancedAtLeast,
    }

    /// <summary>模板规则的产出按什么计数放大;计数为 0 时不产出。</summary>
    public enum GeneScale
    {
        One = 0,
        Combo,

        /// <summary>消除后网格里的空格(死格不算)÷ 8。</summary>
        EmptyAfterPer8,

        /// <summary>消除前被占的格 ÷ 4。</summary>
        OccupiedBeforePer4,

        /// <summary>本盲注放下过的形状种数。</summary>
        PlacedKinds,

        /// <summary>这次 4 格全部被消的块数。</summary>
        WholeBlocks,

        /// <summary>待放置区里点数最低那块的点数(区空为 0)。</summary>
        TrayLowestPoints,

        /// <summary>待放置区里点数 ≥ 4 的块数。</summary>
        TrayHighPoints,

        /// <summary>待放置区剩的块数。</summary>
        TrayCount,
        RowsCleared,

        /// <summary>贴边的线数(第 1、8 行或第 1、8 列)。</summary>
        EdgeLines,

        /// <summary>本局打出过这次消除类型的次数(含这次)。</summary>
        TypeRunCount,
        DeadCells,

        /// <summary>方块库剩下未抽的块数。</summary>
        DrawLeft,
        DiscardsLeft,
        DiscardsUsed,
        Money,
        OtherGenes,

        /// <summary>其他基因的卖价总和。</summary>
        OtherGenesSellValue,

        /// <summary>方块库里的铁芯块数。</summary>
        LibrarySteel,

        /// <summary>方块库比开局多出的块数(少了按 0)。</summary>
        LibraryAboveStart,

        /// <summary>方块库比开局少的块数(多了按 0)。</summary>
        LibraryBelowStart,

        /// <summary>方块库里没有的形状种数。</summary>
        LibraryShapesMissing,

        /// <summary>这次被消格里的金箔块数。</summary>
        GoldBlocksCleared,
    }

    /// <summary>模板规则的产出。</summary>
    public enum GeneOut
    {
        /// <summary>+Value × 计数 底分。</summary>
        Chips = 0,

        /// <summary>+Value × 计数 倍率,千分值。</summary>
        Mult,

        /// <summary>×Value 倍率(千分值),计数只当开关。</summary>
        XMult,

        /// <summary>×Value 倍率,乘计数次。</summary>
        XMultEach,

        /// <summary>×(1 + Value × 计数 / 1000) 倍率。</summary>
        XMultLinear,

        /// <summary>重触发 Value × 计数 次。</summary>
        Retrigger,

        /// <summary>给 $Value × 计数(只在结算后)。</summary>
        Money,
    }

    /// <summary>模板的一行:「在哪个挂点、满足什么条件、按什么计数、产出什么」(效果系统 §7)。</summary>
    public readonly struct GeneRule
    {
        public readonly GenePhase Phase;
        public readonly GeneCond Cond;
        public readonly int Arg;
        public readonly GeneScale Scale;
        public readonly GeneOut Out;
        public readonly long Value;

        public GeneRule(GenePhase phase, GeneCond cond, int arg, GeneScale scale, GeneOut output, long value)
        {
            if (output == GeneOut.Money && phase != GenePhase.After) throw new ArgumentException("给钱只在结算后", nameof(output));
            if (output == GeneOut.Retrigger && phase != GenePhase.Repetition) throw new ArgumentException("重触发只在重触发挂点", nameof(output));
            if (phase == GenePhase.Repetition && output != GeneOut.Retrigger) throw new ArgumentException("重触发挂点只出次数", nameof(output));
            if (phase == GenePhase.After && output != GeneOut.Money) throw new ArgumentException("结算后只能给钱", nameof(output));
            Phase = phase;
            Cond = cond;
            Arg = arg;
            Scale = scale;
            Out = output;
            Value = value;
        }
    }

    /// <summary>
    /// 模板基因:读若干行 <see cref="GeneRule"/>,各行独立判、按行序产出(基因清单 §4 第 4 步)。Luban 接入前,行写在
    /// <see cref="GeneTable"/> 里。代价按效果系统 §6 分三种字段,由 <see cref="RunState.SpecForCurrentNode"/> 与盲注开始挂点读。
    /// 条件只读确定性状态,不掷概率:逐格段与基因段的结果要和拖动预览之外的重放一致。
    /// </summary>
    public sealed class TemplateGene : RuleEffect
    {
        private const int Corner0 = 0;
        private const int Corner1 = 7;
        private const int Corner2 = 56;
        private const int Corner3 = 63;

        private readonly GeneRule[] _rules;
        private readonly int _costTarget;
        private readonly int _discardDelta;
        private readonly int _groupSizeDelta;
        private readonly int _deadCells;

        public TemplateGene(GeneRule[] rules, int costTargetPermille = 0, int discardDelta = 0, int groupSizeDelta = 0, int deadCells = 0)
        {
            if (rules == null || rules.Length == 0) throw new ArgumentException("模板基因至少一行", nameof(rules));
            _rules = (GeneRule[])rules.Clone();
            _costTarget = costTargetPermille;
            _discardDelta = discardDelta;
            _groupSizeDelta = groupSizeDelta;
            _deadCells = deadCells;
        }

        public override int CostTargetPermille => _costTarget;

        public override int DiscardDelta => _discardDelta;

        public override int GroupSizeDelta => _groupSizeDelta;

        public override int DeadCellsPerBlind => _deadCells;

        public override int Repetitions(EffectContext ctx)
        {
            long n = 0;
            foreach (GeneRule r in _rules)
            {
                if (r.Phase != GenePhase.Repetition || !Holds(r, ctx)) continue;
                n += r.Value * Count(r.Scale, ctx);
            }
            return (int)Math.Min(int.MaxValue, Math.Max(0, n));
        }

        public override EffectDelta OnCell(EffectContext ctx) => Sum(GenePhase.Cell, ctx);

        public override EffectDelta OnGene(EffectContext ctx) => Sum(GenePhase.Gene, ctx);

        public override void AfterScoring(EffectContext ctx)
        {
            foreach (GeneRule r in _rules)
            {
                if (r.Phase != GenePhase.After || !Holds(r, ctx)) continue;
                long money = r.Value * Count(r.Scale, ctx);
                if (money > 0) ctx.GainMoney((int)Math.Min(int.MaxValue, money));
            }
        }

        // 一个来源同时给几项时,先加后乘(规则 §3.1):加项合进一份,乘项按行序乘
        private EffectDelta Sum(GenePhase phase, EffectContext ctx)
        {
            long chips = 0, mult = 0, x = ScoreMath.PermilleOne;
            foreach (GeneRule r in _rules)
            {
                if (r.Phase != phase || !Holds(r, ctx)) continue;
                long count = Count(r.Scale, ctx);
                if (count <= 0) continue;
                switch (r.Out)
                {
                    case GeneOut.Chips:
                        chips = ScoreMath.Add(chips, ScoreMath.Mul(r.Value, count));
                        break;
                    case GeneOut.Mult:
                        mult = ScoreMath.Add(mult, ScoreMath.Mul(r.Value, count));
                        break;
                    case GeneOut.XMult:
                        x = ScoreMath.MulPermille(x, r.Value);
                        break;
                    case GeneOut.XMultEach:
                        for (long i = 0; i < count; i++) x = ScoreMath.MulPermille(x, r.Value);
                        break;
                    case GeneOut.XMultLinear:
                        x = ScoreMath.MulPermille(x, ScoreMath.Add(ScoreMath.PermilleOne, ScoreMath.Mul(r.Value, count)));
                        break;
                }
            }
            return chips == 0 && mult == 0 && x == ScoreMath.PermilleOne ? EffectDelta.None : new EffectDelta(chips, mult, x);
        }

        private static bool Holds(GeneRule r, EffectContext ctx)
        {
            BlockInstance b = ctx.Block;
            IBlindView blind = ctx.Run.Blind;
            switch (r.Cond)
            {
                case GeneCond.Always: return true;
                case GeneCond.CellKindIn: return b != null && (r.Arg & (1 << (int)b.Kind)) != 0;
                case GeneCond.CellPointsOdd: return b != null && b.Points % 2 != 0;
                case GeneCond.CellPointsEven: return b != null && b.Points % 2 == 0;
                case GeneCond.CellPointsEq: return b != null && b.Points == r.Arg;
                case GeneCond.CellPointsAtLeast: return b != null && b.Points >= r.Arg;
                case GeneCond.CellCorner: return ctx.Cell == Corner0 || ctx.Cell == Corner1 || ctx.Cell == Corner2 || ctx.Cell == Corner3;
                case GeneCond.CellCenter:
                    {
                        if (ctx.Cell < 0) return false;
                        int lo = (BoardCells.Rows - r.Arg) / 2, hi = lo + r.Arg;
                        int row = BoardCells.RowOf(ctx.Cell), col = BoardCells.ColOf(ctx.Cell);
                        return row >= lo && row < hi && col >= lo && col < hi;
                    }
                case GeneCond.CellOfPlaced: return b != null && ctx.Placed != null && b.Id == ctx.Placed.Id;
                case GeneCond.CellOfPlacedOnEdge:
                    {
                        if (b == null || ctx.Placed == null || b.Id != ctx.Placed.Id) return false;
                        foreach (int cell in ctx.PlacedCells)
                        {
                            if (IsEdge(cell)) return true;
                        }
                        return false;
                    }
                case GeneCond.CellEnhancement: return b != null && (int)b.Enhancement == r.Arg;
                case GeneCond.CellNoEnhancement: return b != null && b.Enhancement == Enhancement.None;
                case GeneCond.CellHasEdition: return b != null && b.Edition != Edition.None;
                case GeneCond.CellKindMostInLibrary: return b != null && (MostCommonKinds(ctx.Run) & (1 << (int)b.Kind)) != 0;
                case GeneCond.PlacedKindIs: return ctx.Placed != null && (int)ctx.Placed.Kind == r.Arg;
                case GeneCond.LinesAtLeast: return ctx.HasClear && ctx.Rows.Count + ctx.Cols.Count >= r.Arg;
                case GeneCond.LinesEq: return ctx.HasClear && ctx.Rows.Count + ctx.Cols.Count == r.Arg;
                case GeneCond.HasRowAndCol: return ctx.Rows.Count > 0 && ctx.Cols.Count > 0;
                case GeneCond.AdjacentParallel: return HasAdjacent(ctx.Rows) || HasAdjacent(ctx.Cols);
                case GeneCond.SymmetricLines: return HasMirror(ctx.Rows, BoardCells.Rows) || HasMirror(ctx.Cols, BoardCells.Cols);
                case GeneCond.TypeIn: return ctx.HasClear && (r.Arg & (1 << (int)ctx.Type)) != 0;
                case GeneCond.TypeRepeatInBlind:
                    return ctx.HasClear && ctx.Type != ClearType.SingleLine && blind.TypeCounts[(int)ctx.Type] >= 2;
                case GeneCond.TypeDiffersFromLast: return ctx.HasClear && blind.LastClearType >= 0 && blind.LastClearType != (int)ctx.Type;
                case GeneCond.ShapesAtLeast: return BitCount(ClearedKinds(ctx)) >= r.Arg;
                case GeneCond.ShapesAllOf: return (ClearedKinds(ctx) & r.Arg) == r.Arg;
                case GeneCond.PointsAllAtLeast:
                    {
                        if (ctx.Owners.Count == 0) return false;
                        foreach (int id in ctx.Owners)
                        {
                            if (ctx.Run.FindInstance(id).Points < r.Arg) return false;
                        }
                        return true;
                    }
                case GeneCond.DistinctPointsAtLeast:
                    {
                        var seen = new List<int>();
                        foreach (int id in ctx.Owners)
                        {
                            int points = ctx.Run.FindInstance(id).Points;
                            if (!seen.Contains(points)) seen.Add(points);
                        }
                        return seen.Count >= r.Arg;
                    }
                case GeneCond.SameEnhancementAtLeast:
                    {
                        var counts = new int[(int)Enhancement.Wild + 1];
                        foreach (int id in DistinctOwners(ctx))
                        {
                            Enhancement e = ctx.Run.FindInstance(id).Enhancement;
                            if (e != Enhancement.None && ++counts[(int)e] >= r.Arg) return true;
                        }
                        return false;
                    }
                case GeneCond.CornersOccupied:
                    {
                        IBoardView board = blind.Board;
                        return board.IsOccupied(Corner0) && board.IsOccupied(Corner1) && board.IsOccupied(Corner2) && board.IsOccupied(Corner3);
                    }
                case GeneCond.ComboEq: return blind.Combo == r.Arg;
                case GeneCond.ComboAtLeast: return blind.Combo >= r.Arg;
                case GeneCond.OccupiedBeforeAtLeast: return OccupiedBefore(ctx) >= r.Arg;
                case GeneCond.OccupiedAfterAtMost: return OccupiedBefore(ctx) - ctx.Cells.Count <= r.Arg;
                case GeneCond.FirstGroup: return blind.Group == 1;
                case GeneCond.DrawEmpty: return blind.Draw.Count == 0;
                case GeneCond.NoDiscardsLeft: return blind.DiscardsLeft == 0;
                case GeneCond.LibraryAtMost: return ctx.Run.Library.Count <= r.Arg;
                case GeneCond.LibraryEnhancedAtLeast:
                    {
                        int n = 0;
                        foreach (BlockInstance x in ctx.Run.Library)
                        {
                            if (x.Enhancement != Enhancement.None) n++;
                        }
                        return n >= r.Arg;
                    }
                default: throw new ArgumentOutOfRangeException(nameof(r), r.Cond, "未处理的模板条件");
            }
        }

        private static long Count(GeneScale scale, EffectContext ctx)
        {
            IBlindView blind = ctx.Run.Blind;
            switch (scale)
            {
                case GeneScale.One: return 1;
                case GeneScale.Combo: return blind.Combo;
                case GeneScale.EmptyAfterPer8:
                    return (BoardCells.Count - DeadCount(blind.Board) - (OccupiedBefore(ctx) - ctx.Cells.Count)) / 8;
                case GeneScale.OccupiedBeforePer4: return OccupiedBefore(ctx) / 4;
                case GeneScale.PlacedKinds: return BitCount(blind.PlacedKinds);
                case GeneScale.WholeBlocks:
                    {
                        int n = 0;
                        foreach (int id in DistinctOwners(ctx))
                        {
                            int cleared = 0;
                            foreach (int owner in ctx.Owners)
                            {
                                if (owner == id) cleared++;
                            }
                            if (cleared == Tetromino.CellCount) n++;
                        }
                        return n;
                    }
                case GeneScale.TrayLowestPoints:
                    {
                        int low = int.MaxValue;
                        foreach (TraySlot s in blind.Tray)
                        {
                            if (!s.IsEmpty) low = Math.Min(low, ctx.Run.FindInstance(s.Id).Points);
                        }
                        return low == int.MaxValue ? 0 : low;
                    }
                case GeneScale.TrayHighPoints:
                    {
                        int n = 0;
                        foreach (TraySlot s in blind.Tray)
                        {
                            if (!s.IsEmpty && ctx.Run.FindInstance(s.Id).Points >= 4) n++;
                        }
                        return n;
                    }
                case GeneScale.TrayCount:
                    {
                        int n = 0;
                        foreach (TraySlot s in blind.Tray)
                        {
                            if (!s.IsEmpty) n++;
                        }
                        return n;
                    }
                case GeneScale.RowsCleared: return ctx.Rows.Count;
                case GeneScale.EdgeLines:
                    {
                        int n = 0;
                        foreach (int row in ctx.Rows)
                        {
                            if (row == 0 || row == BoardCells.Rows - 1) n++;
                        }
                        foreach (int col in ctx.Cols)
                        {
                            if (col == 0 || col == BoardCells.Cols - 1) n++;
                        }
                        return n;
                    }
                case GeneScale.TypeRunCount: return ctx.HasClear ? ctx.Run.TypeCounts[(int)ctx.Type] : 0;
                case GeneScale.DeadCells: return DeadCount(blind.Board);
                case GeneScale.DrawLeft: return blind.Draw.Count;
                case GeneScale.DiscardsLeft: return blind.DiscardsLeft;
                case GeneScale.DiscardsUsed: return Math.Max(0, blind.Spec.Discards - blind.DiscardsLeft);
                case GeneScale.Money: return Math.Max(0, ctx.Money);
                case GeneScale.OtherGenes: return Math.Max(0, ctx.Run.Genes.Count - 1);
                case GeneScale.OtherGenesSellValue:
                    {
                        long sum = 0;
                        for (int slot = 0; slot < ctx.Run.Genes.Count; slot++)
                        {
                            if (slot != ctx.SourceIndex) sum += ctx.GeneSellPrice(slot);
                        }
                        return sum;
                    }
                case GeneScale.LibrarySteel:
                    {
                        int n = 0;
                        foreach (BlockInstance x in ctx.Run.Library)
                        {
                            if (x.Enhancement == Enhancement.Steel) n++;
                        }
                        return n;
                    }
                case GeneScale.LibraryAboveStart: return Math.Max(0, ctx.Run.Library.Count - ctx.StartingLibrarySize);
                case GeneScale.LibraryBelowStart: return Math.Max(0, ctx.StartingLibrarySize - ctx.Run.Library.Count);
                case GeneScale.LibraryShapesMissing:
                    {
                        int mask = 0;
                        foreach (BlockInstance x in ctx.Run.Library) mask |= 1 << (int)x.Kind;
                        return Tetromino.KindCount - BitCount(mask);
                    }
                case GeneScale.GoldBlocksCleared:
                    {
                        int n = 0;
                        foreach (int id in DistinctOwners(ctx))
                        {
                            if (ctx.Run.FindInstance(id).Enhancement == Enhancement.Gold) n++;
                        }
                        return n;
                    }
                default: throw new ArgumentOutOfRangeException(nameof(scale), scale, "未处理的模板计数");
            }
        }

        private static bool IsEdge(int cell)
        {
            int row = BoardCells.RowOf(cell), col = BoardCells.ColOf(cell);
            return row == 0 || col == 0 || row == BoardCells.Rows - 1 || col == BoardCells.Cols - 1;
        }

        private static bool HasAdjacent(IReadOnlyList<int> lines)
        {
            for (int i = 1; i < lines.Count; i++)
            {
                if (lines[i] == lines[i - 1] + 1) return true;
            }
            return false;
        }

        private static bool HasMirror(IReadOnlyList<int> lines, int size)
        {
            foreach (int a in lines)
            {
                foreach (int b in lines)
                {
                    if (a < b && a + b == size - 1) return true;
                }
            }
            return false;
        }

        // 盘面在结算里还留着被消的格(第 11 段才清),所以现在的占用就是「消除前」
        private static int OccupiedBefore(EffectContext ctx)
        {
            IBoardView board = ctx.Run.Blind.Board;
            int n = 0;
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (board.IsOccupied(cell)) n++;
            }
            return n;
        }

        private static int DeadCount(IBoardView board)
        {
            int n = 0;
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (board.IsDead(cell)) n++;
            }
            return n;
        }

        private static int ClearedKinds(EffectContext ctx)
        {
            int mask = 0;
            foreach (int id in ctx.Owners) mask |= 1 << (int)ctx.Run.FindInstance(id).Kind;
            return mask;
        }

        private static List<int> DistinctOwners(EffectContext ctx)
        {
            var list = new List<int>();
            foreach (int id in ctx.Owners)
            {
                if (!list.Contains(id)) list.Add(id);
            }
            return list;
        }

        private static int MostCommonKinds(IRunView run)
        {
            var counts = new int[Tetromino.KindCount];
            foreach (BlockInstance x in run.Library) counts[(int)x.Kind]++;
            int max = 0;
            foreach (int c in counts) max = Math.Max(max, c);
            if (max == 0) return 0;
            int mask = 0;
            for (int k = 0; k < counts.Length; k++)
            {
                if (counts[k] == max) mask |= 1 << k;
            }
            return mask;
        }

        private static int BitCount(int mask)
        {
            int n = 0;
            for (; mask != 0; mask &= mask - 1) n++;
            return n;
        }
    }
}
