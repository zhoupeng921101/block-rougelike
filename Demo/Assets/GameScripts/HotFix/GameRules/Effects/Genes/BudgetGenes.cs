namespace GameRules
{
    /// <summary>预算与弃置组里要改区的两张(基因清单 §2.7):回收、斋戒。</summary>
    internal static class BudgetGenes
    {
        /// <summary>回收(G085):每个盲注第一次弃掉的块放回方块库底,不算花掉的预算。</summary>
        public sealed class Recycle : RuleEffect
        {
            public override void OnStepEnd(EffectContext ctx)
            {
                if (ctx.Step != StepKind.Discard || ctx.Discarded <= 0) return;
                BlindState blind = ctx.State.Blind;
                if (blind.DiscardedList.Count != 1 || blind.DiscardedList[0] != ctx.Discarded) return;
                blind.DiscardedList.RemoveAt(0);
                blind.DrawList.Add(ctx.Discarded);
            }
        }

        /// <summary>斋戒(G087):×3 倍率;本局每弃掉 1 块 −×0.05,降到 ×1 为止。代价:每个盲注弃置 −1。</summary>
        public sealed class Fasting : RuleEffect
        {
            public override int DiscardDelta => -1;

            public override EffectDelta OnGene(EffectContext ctx)
            {
                long x = 3000L - 50L * ctx.State.DiscardedCount;
                if (x < 1000L) x = 1000L;
                return EffectDelta.XMult(x);
            }
        }
    }
}
