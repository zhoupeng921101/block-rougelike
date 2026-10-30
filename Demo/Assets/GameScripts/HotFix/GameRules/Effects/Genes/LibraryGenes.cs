namespace GameRules
{
    /// <summary>方块库组里要改库的四张(基因清单 §2.11):增殖、剔除、转形、复制。</summary>
    internal static class LibraryGenes
    {
        /// <summary>增殖(G126):每个盲注开始时,往方块库加 1 块随机形状、点数 1 的临时块,盲注结束移走。</summary>
        public sealed class Proliferate : RuleEffect
        {
            private const int GeneId = 126;

            public override void OnBlindStart(EffectContext ctx)
            {
                IRandomSource rng = GeneUtil.PickRng(ctx, GeneId);
                int kind = rng.Index(Tetromino.KindCount);
                BlindState blind = ctx.State.Blind;
                var block = new BlockInstance(ctx.State.IssueId(), (TetrominoKind)kind, 1, Enhancement.None, Edition.None);
                blind.TempList.Add(block);
                int at = rng.Index(blind.DrawList.Count + 1);
                blind.DrawList.Insert(at, block.Id);
                ctx.Gene.State = block.Id;
            }

            public override void OnBlindEnd(EffectContext ctx)
            {
                if (ctx.Gene.State > 0) ctx.State.DestroyInstance(ctx.Gene.State);
                ctx.Gene.State = 0;
            }
        }

        /// <summary>剔除(G127):每个盲注结束时,删掉方块库里点数最低的 1 块(并列取随机)。</summary>
        public sealed class Cull : RuleEffect
        {
            private const int GeneId = 127;

            public override void OnBlindEnd(EffectContext ctx)
            {
                int low = int.MaxValue;
                foreach (BlockInstance block in ctx.Run.Library)
                {
                    if (block.Points < low) low = block.Points;
                }
                if (low == int.MaxValue) return;
                var candidates = new System.Collections.Generic.List<int>();
                foreach (BlockInstance block in ctx.Run.Library)
                {
                    if (block.Points == low) candidates.Add(block.Id);
                }
                int id = candidates[GeneUtil.Rng(ctx, GeneId).Index(candidates.Count)];
                ctx.State.DestroyInstance(id);
            }
        }

        /// <summary>转形(G129):每个盲注开始时,方块库里随机 2 块变成库里数量最多的那种形状。</summary>
        public sealed class Reshape : RuleEffect
        {
            private const int GeneId = 129;

            public override void OnBlindStart(EffectContext ctx)
            {
                var library = ctx.Run.Library;
                if (library.Count == 0) return;
                int mask = GeneUtil.MostCommonKindMask(ctx.Run);
                int kind = -1;
                for (int k = 0; k < Tetromino.KindCount; k++)
                {
                    if ((mask & (1 << k)) != 0)
                    {
                        kind = k;
                        break;
                    }
                }
                if (kind < 0) return;
                IRandomSource rng = GeneUtil.PickRng(ctx, GeneId);
                for (int i = 0; i < 2 && library.Count > 0; i++)
                {
                    BlockInstance block = library[rng.Index(library.Count)];
                    block.Kind = (TetrominoKind)kind;
                }
            }
        }

        /// <summary>复制(G130):每个盲注第一次放置若触发消除,把放下的那块(连强化、版本)复制一块加进方块库。</summary>
        public sealed class CopyBlock : RuleEffect
        {
            public override int CostTargetPermille => 200;

            public override void OnBlindStart(EffectContext ctx) => ctx.Gene.State = 0;

            public override void AfterScoring(EffectContext ctx)
            {
                if (ctx.Acting || ctx.Gene.State != 0 || ctx.Placed == null) return;
                BlockInstance copy = ctx.State.AddBlock(ctx.Placed.Kind, ctx.Placed.Points, ctx.Placed.Enhancement, ctx.Placed.Edition);
                // 新块进方块库、但不算这一场的预算:挂进拿掉区,打完这一场自动回来
                BlindState blind = ctx.State.Blind;
                blind.RemovedList.Add(copy.Id);
                blind.RemovedList.Sort();
            }

            public override void OnStepEnd(EffectContext ctx)
            {
                if (ctx.Step == StepKind.Place) ctx.Gene.State = 1;
            }
        }
    }
}
