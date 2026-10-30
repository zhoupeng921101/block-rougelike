namespace GameRules
{
    /// <summary>空间组里要看邻格与空洞的三张(基因清单 §2.6):填缝、空洞、净空。</summary>
    internal static class SpaceGenes
    {
        /// <summary>
        /// 填缝(G067):放下的那块四周(上下左右相邻、不属于它的格)里,已占的格与网格边界合计 ≥ 6 时 +6 倍率。
        /// </summary>
        public sealed class GapFill : RuleEffect
        {
            public override EffectDelta OnGene(EffectContext ctx)
            {
                if (ctx.Placed == null) return EffectDelta.None;
                int count = 0;
                foreach (int cell in ctx.PlacedCells)
                {
                    CountAround(ctx, cell, ref count);
                }
                return count >= 6 ? EffectDelta.Mult(6) : EffectDelta.None;
            }

            private static void CountAround(EffectContext ctx, int cell, ref int count)
            {
                int row = BoardCells.RowOf(cell), col = BoardCells.ColOf(cell);
                if (row == 0) count++;
                else Count(ctx, BoardCells.Index(row - 1, col), ref count);
                if (row == BoardCells.Rows - 1) count++;
                else Count(ctx, BoardCells.Index(row + 1, col), ref count);
                if (col == 0) count++;
                else Count(ctx, BoardCells.Index(row, col - 1), ref count);
                if (col == BoardCells.Cols - 1) count++;
                else Count(ctx, BoardCells.Index(row, col + 1), ref count);
            }

            private static void Count(EffectContext ctx, int cell, ref int count)
            {
                IBoardView board = GeneUtil.Board(ctx);
                if (board.IsOccupied(cell) && board.OwnerAt(cell) != ctx.Placed.Id) count++;
            }
        }

        /// <summary>
        /// 空洞(G070):消除后网格里每有 1 个四邻都被占(或是边界)的空格,+2 倍率。
        /// 基因段在清格之前,所以「消除后」按「当前占用减去这次被消的格」算。
        /// </summary>
        public sealed class Holes : RuleEffect
        {
            public override EffectDelta OnGene(EffectContext ctx)
            {
                IBoardView board = GeneUtil.Board(ctx);
                int n = 0;
                for (int cell = 0; cell < BoardCells.Count; cell++)
                {
                    if (OccupiedAfter(ctx, board, cell)) continue;
                    if (Surrounded(ctx, board, cell)) n++;
                }
                return n == 0 ? EffectDelta.None : EffectDelta.Mult(2L * n);
            }

            private static bool OccupiedAfter(EffectContext ctx, IBoardView board, int cell)
            {
                if (!board.IsOccupied(cell)) return false;
                foreach (int cleared in ctx.Cells)
                {
                    if (cleared == cell) return false;
                }
                return true;
            }

            private static bool Surrounded(EffectContext ctx, IBoardView board, int cell)
            {
                int row = BoardCells.RowOf(cell), col = BoardCells.ColOf(cell);
                if (row > 0 && !OccupiedAfter(ctx, board, BoardCells.Index(row - 1, col))) return false;
                if (row < BoardCells.Rows - 1 && !OccupiedAfter(ctx, board, BoardCells.Index(row + 1, col))) return false;
                if (col > 0 && !OccupiedAfter(ctx, board, BoardCells.Index(row, col - 1))) return false;
                if (col < BoardCells.Cols - 1 && !OccupiedAfter(ctx, board, BoardCells.Index(row, col + 1))) return false;
                return true;
            }
        }

        /// <summary>净空(G072):每次清屏,本基因 +8 倍率(累加,不清零)。</summary>
        public sealed class ClearBonus : RuleEffect
        {
            public override void AfterScoring(EffectContext ctx)
            {
                if (ctx.Type == ClearType.AllClear) ctx.AddCounter(8);
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.Mult(ctx.Counter);
        }
    }
}
