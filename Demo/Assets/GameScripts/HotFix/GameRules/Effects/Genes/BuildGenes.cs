using System;

namespace GameRules
{
    /// <summary>构筑组(基因清单 §2.9):乱码、吞噬、重现、拓印、均衡、溯首。</summary>
    internal static class BuildGenes
    {
        /// <summary>乱码(G101):每次消除 +0 到 +20 倍率(随机,结算前掷、记进计数)。</summary>
        public sealed class Typo : RuleEffect
        {
            private const int GeneId = 101;

            public override void BeforeScoring(EffectContext ctx)
            {
                ctx.Gene.Counter = GeneUtil.Rng(ctx, GeneId).Index(21);
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.Mult(ctx.Counter);
        }

        /// <summary>吞噬(G104):每个盲注开始时吞掉右邻的基因,本基因永久 +(被吞者卖价 × 2) 倍率。</summary>
        public sealed class Devour : RuleEffect
        {
            public override void OnBlindStart(EffectContext ctx)
            {
                int slot = ctx.SourceIndex;
                if (slot < 0 || slot + 1 >= ctx.Run.Genes.Count) return;
                int price = ctx.GeneSellPrice(slot + 1);
                ctx.Gene.Counter += price * 2;
                ctx.State.RemoveGeneAt(slot + 1);
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.Mult(ctx.Counter);
        }

        /// <summary>重现(G105):商店和补给包里可以出现已持有的基因。</summary>
        public sealed class Reappear : RuleEffect
        {
            public override bool ShopOffersOwned => true;
        }

        /// <summary>拓印(G107):复制右邻基因的效果(代行,不改被复制者的计数)。代价:每个盲注弃置 −1。</summary>
        public sealed class Blueprint : RuleEffect
        {
            public override int DiscardDelta => -1;

            public override EffectDelta OnGene(EffectContext ctx) => GeneUtil.CopyRight(ctx, e => e.OnGene(ctx), EffectDelta.None);

            public override EffectDelta OnCell(EffectContext ctx) => GeneUtil.CopyRight(ctx, e => e.OnCell(ctx), EffectDelta.None);

            public override int Repetitions(EffectContext ctx) => GeneUtil.CopyRight(ctx, e => e.Repetitions(ctx), 0);

            public override void AfterScoring(EffectContext ctx) => GeneUtil.CopyRight(ctx, e =>
            {
                e.AfterScoring(ctx);
                return 0;
            }, 0);
        }

        /// <summary>溯首(G109):复制最左边那个基因的效果(自己在最左时无效)。代价:拿到后首个盲注目标分 +25%。</summary>
        public sealed class FirstEcho : RuleEffect
        {
            public override int CostTargetPermille => 250;

            public override EffectDelta OnGene(EffectContext ctx) => GeneUtil.CopyFirst(ctx, e => e.OnGene(ctx), EffectDelta.None);

            public override EffectDelta OnCell(EffectContext ctx) => GeneUtil.CopyFirst(ctx, e => e.OnCell(ctx), EffectDelta.None);

            public override int Repetitions(EffectContext ctx) => GeneUtil.CopyFirst(ctx, e => e.Repetitions(ctx), 0);

            public override void AfterScoring(EffectContext ctx) => GeneUtil.CopyFirst(ctx, e =>
            {
                e.AfterScoring(ctx);
                return 0;
            }, 0);
        }

        /// <summary>均衡(G108):基因段结束时,底分与倍率取平均。代价:拿到后首个盲注目标分 +20%。</summary>
        public sealed class Balance : RuleEffect
        {
            public override int CostTargetPermille => 200;

            public override bool BalancesAccumulators => true;
        }
    }
}
