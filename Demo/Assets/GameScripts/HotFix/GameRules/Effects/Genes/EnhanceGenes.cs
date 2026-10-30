using System;

namespace GameRules
{
    /// <summary>强化与版本组里要改块或累积的四张(基因清单 §2.10):碎璃、点金、汲取、镀版。</summary>
    internal static class EnhanceGenes
    {
        /// <summary>碎璃(G115):每碎 1 块琉璃,本基因 +×0.5 倍率,从 ×1 起。</summary>
        public sealed class GlassShards : RuleEffect
        {
            public override void AfterScoring(EffectContext ctx)
            {
                int n = 0;
                foreach (int id in ctx.Shattered)
                {
                    BlockInstance block = ctx.Run.FindInstance(id);
                    if (block != null && block.Enhancement == Enhancement.Glass) n++;
                }
                if (n > 0) ctx.AddCounter(n);
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.XMult(1000 + 500 * ctx.Counter);
        }

        /// <summary>点金(G116):每个盲注第一次消除后,这次被消格最多的那块变成金箔块。</summary>
        public sealed class Midas : RuleEffect
        {
            public override void OnBlindStart(EffectContext ctx) => ctx.Gene.Counter = 0;

            public override void AfterScoring(EffectContext ctx)
            {
                if (ctx.Acting) return;
                if (ctx.Gene.Counter != 0) return;
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
                if (block == null) return;
                block.Enhancement = Enhancement.Gold;
                ctx.Gene.Counter = 1;
            }
        }

        /// <summary>汲取(G117):被消的强化块失去强化;每失去 1 块,本基因 +×0.1 倍率,从 ×1 起。</summary>
        public sealed class Drain : RuleEffect
        {
            public override void AfterScoring(EffectContext ctx)
            {
                if (ctx.Acting) return;
                foreach (int id in GeneUtil.DistinctOwners(ctx))
                {
                    BlockInstance block = ctx.Run.FindInstance(id);
                    if (block == null || block.Enhancement == Enhancement.None) continue;
                    block.Enhancement = Enhancement.None;
                    ctx.AddCounter(1);
                }
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.XMult(1000 + 100 * ctx.Counter);
        }

        /// <summary>镀版(G118):每个盲注结束时,1/4 概率给方块库里随机 1 块没版本的块加一个随机版本。</summary>
        public sealed class Plate : RuleEffect
        {
            private const int GeneId = 118;

            public override void OnBlindEnd(EffectContext ctx)
            {
                if (!ctx.Chance(1, 4)) return;
                var candidates = new System.Collections.Generic.List<BlockInstance>();
                foreach (BlockInstance block in ctx.Run.Library)
                {
                    if (block.Edition == Edition.None) candidates.Add(block);
                }
                if (candidates.Count == 0) return;
                IRandomSource rng = GeneUtil.Rng(ctx, GeneId);
                candidates[rng.Index(candidates.Count)].Edition = (Edition)(1 + rng.Index(3));
            }
        }
    }
}
