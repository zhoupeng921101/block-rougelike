using System;

namespace GameRules
{
    /// <summary>位置组里要看交叉格、中心格与上一次落点的三张(基因清单 §2.3)。</summary>
    internal static class PositionGenes
    {
        /// <summary>交汇(G033):同时有行和列时,行列交叉的每一格重触发 2 次。</summary>
        public sealed class Cross : RuleEffect
        {
            public override int Repetitions(EffectContext ctx)
            {
                if (ctx.Rows.Count == 0 || ctx.Cols.Count == 0 || ctx.Cell < 0) return 0;
                return GeneUtil.IsCross(ctx, ctx.Cell) ? 2 : 0;
            }
        }

        /// <summary>中锚(G036):中心 2×2 每被消 1 格,本基因 +1 倍率(累加,不清零)。</summary>
        public sealed class CenterAnchor : RuleEffect
        {
            public override void AfterScoring(EffectContext ctx)
            {
                int lo = (BoardCells.Rows - 2) / 2, hi = lo + 2;
                foreach (int cell in ctx.Cells)
                {
                    int row = BoardCells.RowOf(cell), col = BoardCells.ColOf(cell);
                    if (row >= lo && row < hi && col >= lo && col < hi) ctx.AddCounter(1);
                }
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.Mult(ctx.Counter);
        }

        /// <summary>远投(G037):这次落点与上一次落点的行差 + 列差(块左上角),每 1 格 +1 倍率。</summary>
        public sealed class LongThrow : RuleEffect
        {
            public override EffectDelta OnGene(EffectContext ctx)
            {
                if (ctx.PlacedRow < 0 || ctx.LastPlacedRow < 0) return EffectDelta.None;
                int distance = Math.Abs(ctx.PlacedRow - ctx.LastPlacedRow) + Math.Abs(ctx.PlacedCol - ctx.LastPlacedCol);
                return EffectDelta.Mult(distance);
            }
        }
    }
}
