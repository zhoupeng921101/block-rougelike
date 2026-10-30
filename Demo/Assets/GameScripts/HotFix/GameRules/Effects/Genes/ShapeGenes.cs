using System;

namespace GameRules
{
    /// <summary>
    /// 形状组里要靠判定改写或跨挂点状态的三张(基因清单 §2.1):镜合、古形、塑形。
    /// 其余单形状张在 <see cref="TemplateGene"/> 里。
    /// </summary>
    internal static class ShapeGenes
    {
        /// <summary>镜合(G010):同形态判定里 S/Z、J/L 各算一种。</summary>
        public sealed class Mirror : RuleEffect
        {
            public override bool MirrorSameShape => true;
        }

        /// <summary>古形(G011):每个盲注开始随机指定一种形状,被消格里有它时 ×1.5。</summary>
        public sealed class Ancient : RuleEffect
        {
            private const int GeneId = 11;

            public override void OnBlindStart(EffectContext ctx)
            {
                ctx.Gene.State = GeneUtil.PickRng(ctx, GeneId).Index(Tetromino.KindCount);
            }

            public override EffectDelta OnGene(EffectContext ctx)
            {
                int kind = ctx.Gene.State;
                if (kind < 0 || kind >= Tetromino.KindCount) return EffectDelta.None;
                foreach (int id in ctx.Owners)
                {
                    if ((int)ctx.Run.FindInstance(id).Kind == kind) return EffectDelta.XMult(1500);
                }
                return EffectDelta.None;
            }
        }

        /// <summary>塑形(G013):每个盲注开始随机指定一种形状;每弃掉 1 块这种形状,本基因 +5 底分(累加,不清零)。</summary>
        public sealed class Sculpt : RuleEffect
        {
            private const int GeneId = 13;

            public override void OnBlindStart(EffectContext ctx)
            {
                ctx.Gene.State = GeneUtil.PickRng(ctx, GeneId).Index(Tetromino.KindCount);
            }

            public override void OnStepEnd(EffectContext ctx)
            {
                if (ctx.Step != StepKind.Discard || ctx.Discarded <= 0) return;
                BlockInstance block = ctx.State.FindInstance(ctx.Discarded);
                if (block != null && (int)block.Kind == ctx.Gene.State) ctx.AddCounter(5);
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.Chips(ctx.Counter);
        }
    }
}
