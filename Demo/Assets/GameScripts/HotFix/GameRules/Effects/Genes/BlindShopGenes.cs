namespace GameRules
{
    /// <summary>盲注与商店组(基因清单 §2.13)与传说(§2.14)里要挂结算外钩子的那些。</summary>
    internal static class BlindShopGenes
    {
        /// <summary>刷新(G141):商店每刷新 1 次,本基因 +1 倍率(累加)。</summary>
        public sealed class RerollGrowth : RuleEffect
        {
            public override void OnShopRerolled(EffectContext ctx) => ctx.AddCounter(1);

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.Mult(ctx.Counter);
        }

        /// <summary>卖焰(G142):每卖掉 1 张(基因或消耗品),本基因 +×0.2 倍率;打过首领后归回 ×1。</summary>
        public sealed class SellFlame : RuleEffect
        {
            public override void OnSold(EffectContext ctx) => ctx.AddCounter(1);

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.XMult(1000 + 200 * ctx.Counter);

            public override void OnBlindEnd(EffectContext ctx)
            {
                if (ctx.Run.Blind.Spec.BossId != Bosses.None) ctx.Gene.Counter = 0;
            }
        }

        /// <summary>摔跤(G144):卖掉本基因时,当前首领盲注的负面效果失效。</summary>
        public sealed class Wrestler : RuleEffect
        {
            public override void OnSold(EffectContext ctx)
            {
                if (ctx.SoldSelf && ctx.State.Blind != null) ctx.State.Blind.BossSuppressed = true;
            }
        }

        /// <summary>免死(G145):盲注失败时,得分达到目标分 1/4 就改判通关,本基因随后湮灭。</summary>
        public sealed class Undying : RuleEffect
        {
            public override bool RescuesBlind => true;
        }

        /// <summary>赦免(L2):首领盲注的负面效果失效。</summary>
        public sealed class Pardon : RuleEffect
        {
            public override bool DisablesBoss => true;
        }

        /// <summary>永续(L3):每有 1 块方块湮灭(琉璃碎裂或被删),本基因 +×0.5 倍率,从 ×1 起。</summary>
        public sealed class Eternal : RuleEffect
        {
            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.XMult(1000 + 500 * ctx.State.DestroyedCount);
        }

        /// <summary>回响(L4):本局每累计弃掉 10 块,本基因 +×1 倍率,从 ×1 起。</summary>
        public sealed class Echo : RuleEffect
        {
            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.XMult(1000 + 1000 * (ctx.State.DiscardedCount / 10));
        }

        /// <summary>留影(L5):每个盲注结束时,复制道具栏里随机 1 张消耗品(道具栏要有空)。</summary>
        public sealed class Afterimage : RuleEffect
        {
            private const int GeneId = 150;

            public override void OnBlindEnd(EffectContext ctx)
            {
                var items = ctx.Run.Consumables;
                if (items.Count == 0) return;
                ConsumableItem pick = items[GeneUtil.Rng(ctx, GeneId).Index(items.Count)];
                ctx.GrantConsumable(pick.Kind, pick.Id);
            }
        }
    }
}
