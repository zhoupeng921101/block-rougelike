namespace GameRules
{
    /// <summary>连击组里记在自己身上的三张(基因清单 §2.5):不断、蓄势、热身;保连是判定开关。</summary>
    internal static class ComboGenes
    {
        /// <summary>不断(G058):连击每 +1,本基因 +1 倍率;一次放置没消除时清零,盲注开始不清零。</summary>
        public sealed class Perpetual : RuleEffect
        {
            public override void AfterScoring(EffectContext ctx) => ctx.AddCounter(1);
            public override void OnStepEnd(EffectContext ctx)
            {
                if (ctx.Step == StepKind.Place && !ctx.HasClear) ctx.Gene.Counter = 0;
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.Mult(ctx.Counter);
        }

        /// <summary>蓄势(G059):每有 1 次放置没触发消除,本基因 +2 倍率;下一次消除时给出并清零。</summary>
        public sealed class Charge : RuleEffect
        {
            public override void OnStepEnd(EffectContext ctx)
            {
                if (ctx.Step == StepKind.Place && !ctx.HasClear) ctx.AddCounter(2);
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.Mult(ctx.Counter);

            public override void AfterScoring(EffectContext ctx)
            {
                if (ctx.Acting) return;
                ctx.Gene.Counter = 0;
            }
        }

        /// <summary>热身(G061):+20 倍率;每次放置没触发消除 −4,每个盲注开始时回满。</summary>
        public sealed class WarmUp : RuleEffect
        {
            private const int Start = 20;
            private const int Decay = 4;

            public override void OnBlindStart(EffectContext ctx) => ctx.Gene.Counter = Start;

            public override void OnStepEnd(EffectContext ctx)
            {
                if (ctx.Step != StepKind.Place || ctx.HasClear) return;
                ctx.Gene.Counter = System.Math.Max(0, ctx.Gene.Counter - Decay);
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.Mult(ctx.Counter);
        }

        /// <summary>保连(G062):每个盲注 1 次,一次放置没触发消除时连击不清零。</summary>
        public sealed class ComboKeeper : RuleEffect
        {
            public override bool ComboShield => true;
        }
    }
}
