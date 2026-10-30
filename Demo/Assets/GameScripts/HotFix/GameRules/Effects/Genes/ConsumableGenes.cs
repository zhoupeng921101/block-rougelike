namespace GameRules
{
    /// <summary>消耗品组(基因清单 §2.12):开包、球击、星图、预备、星价、星金、灵感、焦痕;卜算是模板。</summary>
    internal static class ConsumableGenes
    {
        /// <summary>开包(G132):每开 1 个补给包,1/2 概率得 1 张随机改造(道具栏要有空)。</summary>
        public sealed class PackLuck : RuleEffect
        {
            private const int GeneId = 132;

            public override void OnBoosterOpened(EffectContext ctx)
            {
                if (!ctx.Chance(1, 2)) return;
                var mods = ctx.State.Config.Catalog.Mods;
                if (mods.Count == 0) return;
                int id = mods[GeneUtil.Rng(ctx, GeneId).Index(mods.Count)].Id;
                ctx.GrantConsumable(ItemKind.Mod, id);
            }
        }

        /// <summary>球击(G133):线数 ≥ 3 的消除,1/4 概率得 1 张随机改造(道具栏要有空)。</summary>
        public sealed class EightBall : RuleEffect
        {
            private const int GeneId = 133;

            public override void AfterScoring(EffectContext ctx)
            {
                if (GeneUtil.LineCount(ctx) < 3 || !ctx.Chance(1, 4)) return;
                var mods = ctx.State.Config.Catalog.Mods;
                if (mods.Count == 0) return;
                int id = mods[GeneUtil.Rng(ctx, GeneId).Index(mods.Count)].Id;
                ctx.GrantConsumable(ItemKind.Mod, id);
            }
        }

        /// <summary>星图(G134):每用 1 张科技,本基因 +×0.1 倍率,从 ×1 起。</summary>
        public sealed class StarChart : RuleEffect
        {
            public override void OnConsumableUsed(EffectContext ctx)
            {
                if (ctx.ItemKind == ItemKind.Tech) ctx.AddCounter(1);
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.XMult(1000 + 100 * ctx.Counter);
        }

        /// <summary>预备(G135):每个盲注开始时,得 1 张随机改造(道具栏要有空)。</summary>
        public sealed class Prepare : RuleEffect
        {
            private const int GeneId = 135;

            public override void OnBlindStart(EffectContext ctx)
            {
                var mods = ctx.State.Config.Catalog.Mods;
                if (mods.Count == 0) return;
                int id = mods[GeneUtil.PickRng(ctx, GeneId).Index(mods.Count)].Id;
                ctx.GrantConsumable(ItemKind.Mod, id);
            }
        }

        /// <summary>星金(G137):每个盲注结束时,本局每用过 1 种科技 +$1。</summary>
        public sealed class TechGold : RuleEffect
        {
            public override void OnBlindEnd(EffectContext ctx) => ctx.GainMoney(GeneUtil.BitCount(ctx.State.TechsUsedMask));
        }

        /// <summary>灵感(G138):清屏时得 1 张随机科技(道具栏要有空)。</summary>
        public sealed class Inspiration : RuleEffect
        {
            private const int GeneId = 138;

            public override void AfterScoring(EffectContext ctx)
            {
                if (ctx.Type != ClearType.AllClear) return;
                var techs = ctx.State.Config.Catalog.Techs;
                if (techs.Count == 0) return;
                int id = techs[GeneUtil.Rng(ctx, GeneId).Index(techs.Count)].Id;
                ctx.GrantConsumable(ItemKind.Tech, id);
            }
        }

        /// <summary>焦痕(G139):每个盲注第一次弃置时,上一次消除的类型科技等级 +1。代价:每组块数 −1。</summary>
        public sealed class Scorch : RuleEffect
        {
            public override int GroupSizeDelta => -1;

            public override void OnStepEnd(EffectContext ctx)
            {
                if (ctx.Step != StepKind.Discard) return;
                BlindState blind = ctx.State.Blind;
                if (blind.DiscardedList.Count != 1) return;
                if (blind.LastClearType < 0) return;
                ctx.State.UpgradeType((ClearType)blind.LastClearType);
            }
        }
    }
}
