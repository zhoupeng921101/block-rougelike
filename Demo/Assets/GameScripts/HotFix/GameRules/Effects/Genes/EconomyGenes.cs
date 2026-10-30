namespace GameRules
{
    /// <summary>经济组(基因清单 §2.8):金脉、孵化、指令、弃金、赊账、复利、增值、升空、囤金。</summary>
    internal static class EconomyGenes
    {
        /// <summary>金脉(G088):每个盲注结束时 +$3。</summary>
        public sealed class GoldVein : RuleEffect
        {
            public override void OnBlindEnd(EffectContext ctx) => ctx.GainMoney(3);
        }

        /// <summary>孵化(G089):每个盲注结束时,本基因卖价 +$2。</summary>
        public sealed class Hatch : RuleEffect
        {
            public override void OnBlindEnd(EffectContext ctx) => ctx.Gene.SellBonus += 2;
        }

        /// <summary>指令(G090):每个盲注开始随机指定一种消除类型;本盲注第一次打出它时 +$3。</summary>
        public sealed class Directive : RuleEffect
        {
            private const int GeneId = 90;

            public override void OnBlindStart(EffectContext ctx)
            {
                ctx.Gene.State = GeneUtil.PickRng(ctx, GeneId).Index(ClearTypes.Count);
                ctx.Gene.Counter = 0;
            }

            public override void AfterScoring(EffectContext ctx)
            {
                if (ctx.Acting || ctx.Gene.Counter != 0 || (int)ctx.Type != ctx.Gene.State) return;
                ctx.Gene.Counter = 1;
                ctx.GainMoney(3);
            }
        }

        /// <summary>弃金(G091):每个盲注开始随机指定一种形状;每弃掉 1 块这种形状,+$2。</summary>
        public sealed class DiscardGold : RuleEffect
        {
            private const int GeneId = 91;

            public override void OnBlindStart(EffectContext ctx)
            {
                ctx.Gene.State = GeneUtil.PickRng(ctx, GeneId).Index(Tetromino.KindCount);
            }

            public override void OnStepEnd(EffectContext ctx)
            {
                if (ctx.Step != StepKind.Discard || ctx.Discarded <= 0) return;
                BlockInstance block = ctx.State.FindInstance(ctx.Discarded);
                if (block != null && (int)block.Kind == ctx.Gene.State) ctx.GainMoney(2);
            }
        }

        /// <summary>赊账(G092):钱可以花到 −$20。</summary>
        public sealed class Credit : RuleEffect
        {
            public override bool AllowDebt => true;
        }

        /// <summary>复利(G096):利息每 $5 存款多给 $1。</summary>
        public sealed class Compound : RuleEffect
        {
            public override int InterestPer => 5;
        }

        /// <summary>增值(G097):每个盲注结束时,所有基因和道具栏消耗品的卖价 +$1。</summary>
        public sealed class Appreciate : RuleEffect
        {
            public override void OnBlindEnd(EffectContext ctx) => ctx.State.AddSellBonus(1);
        }

        /// <summary>升空(G098):每个盲注结束时 +$1;本局每打过 1 个首领,这笔再 +$1。</summary>
        public sealed class Rocket : RuleEffect
        {
            public override void OnBlindEnd(EffectContext ctx) => ctx.GainMoney(1 + ctx.State.BossesBeaten);
        }

        /// <summary>囤金(G099):利息上限翻倍。代价:每组块数 −1。</summary>
        public sealed class Hoard : RuleEffect
        {
            public override int GroupSizeDelta => -1;

            public override int InterestCapPermille => 2000;
        }
    }
}
