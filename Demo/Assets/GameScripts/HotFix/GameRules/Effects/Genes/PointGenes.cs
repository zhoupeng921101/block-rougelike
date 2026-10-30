namespace GameRules
{
    /// <summary>点数组里要改计点的三张(基因清单 §2.2):倍点、加码、转码。</summary>
    internal static class PointGenes
    {
        /// <summary>倍点(G024):被消格计点数时按 2 倍计(只翻点数这一项,不翻强化与版本)。</summary>
        public sealed class DoublePoints : RuleEffect
        {
            public override int PointsMultiplier => 2;
        }

        /// <summary>加码(G025):每次消除后,这次被消格最多的那块点数永久 +1。</summary>
        public sealed class GrowingPoints : RuleEffect
        {
            public override void AfterScoring(EffectContext ctx)
            {
                if (ctx.Acting) return;
                int best = -1, bestCount = 0;
                foreach (int id in GeneUtil.DistinctOwners(ctx))
                {
                    int n = 0;
                    foreach (int owner in ctx.Owners)
                    {
                        if (owner == id) n++;
                    }
                    if (n > bestCount)
                    {
                        best = id;
                        bestCount = n;
                    }
                }
                BlockInstance block = best < 0 ? null : ctx.Run.FindInstance(best);
                if (block != null) block.Points++;
            }
        }

        /// <summary>转码(G026):被消格的点数不加进底分,改成每 2 点 +0.5 倍率。</summary>
        public sealed class Transcode : RuleEffect
        {
            public override bool PointsToMult => true;
        }
    }
}
