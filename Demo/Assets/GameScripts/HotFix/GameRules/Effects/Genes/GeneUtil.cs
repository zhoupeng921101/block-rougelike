using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 手写基因共用的小工具:只读盘面、局状态,不掷随机(要随机时调用方自己从 <see cref="Rng"/> 取)。
    /// 放这里的都是「同一个问题在好几张基因里各写一遍」的那种,不是通用效果机制。
    /// </summary>
    internal static class GeneUtil
    {
        internal static IBlindView Blind(EffectContext ctx) => ctx.Run.Blind;

        internal static IBoardView Board(EffectContext ctx) => ctx.Run.Blind.Board;

        /// <summary>盘上被占的格数(死格不算占用)。</summary>
        internal static int Occupied(IBoardView board)
        {
            int n = 0;
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (board.IsOccupied(cell)) n++;
            }
            return n;
        }

        internal static int Dead(IBoardView board)
        {
            int n = 0;
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (board.IsDead(cell)) n++;
            }
            return n;
        }

        /// <summary>这次被消的格所属的块 id,按首次出现去重。</summary>
        internal static List<int> DistinctOwners(EffectContext ctx)
        {
            var list = new List<int>();
            foreach (int id in ctx.Owners)
            {
                if (!list.Contains(id)) list.Add(id);
            }
            return list;
        }

        /// <summary>这次被消格覆盖的形状位掩码。</summary>
        internal static int ClearedKinds(EffectContext ctx)
        {
            int mask = 0;
            foreach (int id in ctx.Owners) mask |= 1 << (int)ctx.Run.FindInstance(id).Kind;
            return mask;
        }

        /// <summary>方块库里数量最多的形状(并列都算)的位掩码。</summary>
        internal static int MostCommonKindMask(IRunView run)
        {
            var counts = new int[Tetromino.KindCount];
            foreach (BlockInstance b in run.Library) counts[(int)b.Kind]++;
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

        internal static int BitCount(int mask)
        {
            int n = 0;
            for (; mask != 0; mask &= mask - 1) n++;
            return n;
        }

        internal static int LineCount(EffectContext ctx) => ctx.Rows.Count + ctx.Cols.Count;

        /// <summary>这一格是不是被消的行与列交叉出来的格。</summary>
        internal static bool IsCross(EffectContext ctx, int cell)
        {
            return Has(ctx.Rows, BoardCells.RowOf(cell)) && Has(ctx.Cols, BoardCells.ColOf(cell));
        }

        internal static bool Has(IReadOnlyList<int> list, int value)
        {
            for (int i = 0; i < list.Count; i++)
            {
                if (list[i] == value) return true;
            }
            return false;
        }

        internal static bool IsEdge(int cell)
        {
            int row = BoardCells.RowOf(cell), col = BoardCells.ColOf(cell);
            return row == 0 || col == 0 || row == BoardCells.Rows - 1 || col == BoardCells.Cols - 1;
        }

        /// <summary>本盲注的随机流,按基因号分:同一张基因的重投不挪动别的基因。</summary>
        internal static IRandomSource Rng(EffectContext ctx, int geneId)
        {
            BlindSpec spec = ctx.Run.Blind.Spec;
            return ctx.State.Rng.Get(RngKeys.GeneRoll(spec.Segment, spec.Layer, geneId));
        }

        /// <summary>盲注开始时指定形状/类型用的流。</summary>
        internal static IRandomSource PickRng(EffectContext ctx, int geneId)
        {
            BlindSpec spec = ctx.Run.Blind.Spec;
            return ctx.State.Rng.Get(RngKeys.GenePick(spec.Segment, spec.Layer, geneId));
        }

        /// <summary>盘上某块的四邻格(上下左右,含越界返回 -1);用于填缝、空洞这类空间件。</summary>
        internal static void Neighbors(int cell, Action<int> visit)
        {
            int row = BoardCells.RowOf(cell), col = BoardCells.ColOf(cell);
            if (row > 0) visit(BoardCells.Index(row - 1, col));
            if (row < BoardCells.Rows - 1) visit(BoardCells.Index(row + 1, col));
            if (col > 0) visit(BoardCells.Index(row, col - 1));
            if (col < BoardCells.Cols - 1) visit(BoardCells.Index(row, col + 1));
        }

        /// <summary>复制右邻基因的效果(拓印)。代行时不改被复制者的计数;右邻也是复制件时不再套娃。</summary>
        internal static T CopyRight<T>(EffectContext ctx, Func<RuleEffect, T> call, T none)
        {
            if (ctx.Acting) return none;
            int slot = ctx.SourceIndex;
            if (slot < 0 || slot + 1 >= ctx.Run.Genes.Count) return none;
            return Call(ctx, slot + 1, call, none);
        }

        /// <summary>复制最左那个基因的效果(溯首);自己在最左时无效。</summary>
        internal static T CopyFirst<T>(EffectContext ctx, Func<RuleEffect, T> call, T none)
        {
            if (ctx.Acting || ctx.Run.Genes.Count == 0) return none;
            int slot = ctx.SourceIndex;
            if (slot == 0) return none;
            return Call(ctx, 0, call, none);
        }

        private static T Call<T>(EffectContext ctx, int slot, Func<RuleEffect, T> call, T none)
        {
            RuleEffect effect = ctx.State.Config.Effects.Find(EffectSource.Gene, ctx.Run.Genes[slot].GeneId);
            if (effect == null) return none;
            int savedIndex = ctx.SourceIndex;
            bool savedActing = ctx.Acting;
            ctx.SourceIndex = slot;
            ctx.Acting = true;
            try
            {
                return call(effect);
            }
            finally
            {
                ctx.SourceIndex = savedIndex;
                ctx.Acting = savedActing;
            }
        }
    }
}
