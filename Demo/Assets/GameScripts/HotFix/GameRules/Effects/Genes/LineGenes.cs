namespace GameRules
{
    /// <summary>线与类型组里要成长或掷概率的两张(基因清单 §2.4):星升、偏门。</summary>
    internal static class LineGenes
    {
        /// <summary>星升(G051):每次消除有 1/4 概率,这次消除类型的科技等级 +1。</summary>
        public sealed class StarRise : RuleEffect
        {
            public override void AfterScoring(EffectContext ctx)
            {
                if (ctx.Chance(1, 4)) ctx.State.UpgradeType(ctx.Type);
            }
        }

        /// <summary>
        /// 偏门(G053):每次消除的类型不是本局打得最多的那种时,本基因 +×0.25;打出那种时归回 ×1。
        /// 代价:每个盲注弃置 −1。
        /// </summary>
        public sealed class Obelisk : RuleEffect
        {
            public override int DiscardDelta => -1;

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.XMult(1000 + 250 * ctx.Counter);

            public override void AfterScoring(EffectContext ctx)
            {
                if (ctx.Acting || !ctx.HasClear) return;
                int mine = ctx.Run.TypeCounts[(int)ctx.Type];
                bool most = true;
                for (int t = 0; t < ClearTypes.Count; t++)
                {
                    if (t == (int)ctx.Type) continue;
                    if (ctx.Run.TypeCounts[t] > mine)
                    {
                        most = false;
                        break;
                    }
                }
                // 并列也算「打得最多」:本类型达到最高就归 ×1
                if (most) ctx.Gene.Counter = 0;
                else ctx.Gene.Counter++;
            }
        }
    }
}
