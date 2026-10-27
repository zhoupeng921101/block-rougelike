using System;
using System.Collections.Generic;
using static System.FormattableString;

namespace GameRules
{
    /// <summary>
    /// 一步的推进(07 号票 §4):一次调用推进到下一个稳定状态,同步算完,返回有序事件。注释里的 #n 是那张表的段号。
    /// 钩子谁被问、什么次序见 <see cref="EffectContext"/>;三区的累计值就放在上下文里,效果读到的总是当时的值。
    /// </summary>
    internal static class StepPipeline
    {
        internal static StepResult AfterBlindStart(RunState run)
        {
            BlindState blind = run.Blind;
            var events = new List<RuleEvent>
            {
                new BlindStarted(blind.Spec.Target, blind.Spec.Discards, blind.Spec.GroupSize, blind.DrawList.Count),
            };
            DealAndJudge(run, events);
            return new StepResult(blind.Step, events);
        }

        internal static StepResult Place(RunState run, int instanceId, int rot, int row, int col)
        {
            // #1 校验
            BlindState blind = run.Blind;
            if (blind == null || blind.Outcome != BlindOutcome.InProgress) return Rejected(blind, StepReject.BlindOver);
            int slot = blind.SlotOf(instanceId);
            if (slot < 0) return Rejected(blind, StepReject.NotInTray);
            if (!Tetromino.IsValidRot(rot)) return Rejected(blind, StepReject.CannotPlace);
            // #3、#5 的判线定类型在写盘之前做,用的就是预览那个纯函数
            ClearResolution clear = run.ResolveClear(instanceId, rot, row, col);
            if (!clear.Legal) return Rejected(blind, StepReject.CannotPlace);

            // #2 落子
            BlockInstance block = run.FindInstance(instanceId);
            int[] cells = blind.Board.Place(block, rot, row, col);
            blind.TraySlots[slot] = default;
            var events = new List<RuleEvent> { new PiecePlaced(instanceId, block.Kind, rot, row, col, cells) };

            var ctx = new EffectContext(run, StepKind.Place);
            if (!clear.HasClear)
            {
                blind.Combo = 0;
            }
            else
            {
                // #4 连击在结算前更新,结算里读到的值含本次(规则 §2.2)
                blind.Combo++;
                Settle(run, clear, ctx, events);
            }
            return Finish(run, ctx, events);
        }

        internal static StepResult Discard(RunState run, int instanceId)
        {
            BlindState blind = run.Blind;
            if (blind == null || blind.Outcome != BlindOutcome.InProgress) return Rejected(blind, StepReject.BlindOver);
            int slot = blind.SlotOf(instanceId);
            if (slot < 0) return Rejected(blind, StepReject.NotInTray);
            if (blind.DiscardsLeft <= 0) return Rejected(blind, StepReject.NoDiscards);

            blind.TraySlots[slot] = default;
            blind.DiscardedList.Add(instanceId);
            blind.DiscardsLeft--;
            var events = new List<RuleEvent> { new PieceDiscarded(instanceId, blind.DiscardsLeft) };
            return Finish(run, new EffectContext(run, StepKind.Discard), events);
        }

        // #5–#12
        private static void Settle(RunState run, ClearResolution clear, EffectContext ctx, List<RuleEvent> events)
        {
            BlindState blind = run.Blind;
            ClearType type = clear.Type.Value;

            // #5 定类型
            events.Add(new ClearResolved(clear.Rows, clear.Cols, clear.Cells, type));
            ctx.HasClear = true;
            ctx.Type = type;
            ctx.Rows = clear.Rows;
            ctx.Cols = clear.Cols;
            ctx.Cells = clear.Cells;
            ctx.Owners = clear.Owners;

            // #6 结算前:可以改等级,所以 #7 在它之后读
            VisitClearedBlocksThenGenes(run, ctx, (e, c) => e.BeforeScoring(c));

            // #7 读底注
            ClearTypeBase b = run.BaseOf(type);
            ctx.Chips = b.Chips;
            ctx.Mult = b.Mult;
            ctx.XMultPermille = ScoreMath.PermilleOne;
            events.Add(new BaseApplied(type, run.LevelOf(type), b.Chips, b.Mult));

            // #8 逐格段:每格先问齐重触发次数,再把这一格的整段连走 1 + n 遍,走完才到下一格(07 §2)
            var sources = new List<(EffectSource Source, int Index, RuleEffect Effect)>();
            for (int i = 0; i < clear.Cells.Count; i++)
            {
                int cell = clear.Cells[i];
                BlockInstance owner = run.FindInstance(clear.Owners[i]);
                ctx.Cell = cell;
                ctx.Block = owner;
                ctx.Repetition = 0;
                CollectCellSources(run, owner, sources);

                int extra = 0;
                foreach ((EffectSource source, int index, RuleEffect effect) in sources)
                {
                    SetSource(ctx, source, index);
                    int n = effect.Repetitions(ctx);
                    if (n < 0) throw new InvalidOperationException(Invariant($"{source} {index} 在格 {cell} 返回的重触发次数为负:{n}"));
                    if (n == 0) continue;
                    extra = checked(extra + n);
                    events.Add(new RepetitionGranted(source, index, cell, n));
                }

                for (int pass = 0; pass <= extra; pass++)
                {
                    ctx.Repetition = pass;
                    ctx.Chips = ScoreMath.Add(ctx.Chips, owner.Points);
                    events.Add(new CellScored(cell, owner.Id, owner.Kind, owner.Points, pass, ctx.Chips));
                    foreach ((EffectSource source, int index, RuleEffect effect) in sources)
                    {
                        SetSource(ctx, source, index);
                        Apply(ctx, effect.OnCell(ctx), events);
                    }
                }
            }
            ctx.Cell = -1;
            ctx.Block = null;
            ctx.Repetition = 0;

            // #9 基因段
            VisitGenes(run, ctx, (e, c) => Apply(c, e.OnGene(c), events));

            // #10 入账
            long gain = ScoreMath.Gain(ctx.Chips, ctx.Mult, ctx.XMultPermille);
            blind.Score = ScoreMath.Add(blind.Score, gain);
            ctx.Gain = gain;
            events.Add(new ScoreBooked(ctx.Chips, ctx.Mult, ctx.XMultPermille, gain, blind.Score));

            // #11 清格、离场:最后一格被消的块按 id 升序进消尽堆
            foreach (int cell in clear.Cells) blind.Board.ClearCell(cell);
            List<int> departed = DistinctInOrder(clear.Owners);
            departed.RemoveAll(id => blind.Board.CellsOf(id) > 0);
            departed.Sort();
            blind.DepartedList.AddRange(departed);
            events.Add(new CellsCleared(clear.Cells, departed));

            // #12 结算后
            VisitClearedBlocksThenGenes(run, ctx, (e, c) => e.AfterScoring(c));
        }

        // #13–#17
        private static StepResult Finish(RunState run, EffectContext ctx, List<RuleEvent> events)
        {
            BlindState blind = run.Blind;

            // #13 步收尾
            VisitGenes(run, ctx, (e, c) => e.OnStepEnd(c));

            // #14 判胜在发组前:达标就不发下一组,同一步也不再判负(规则 §2.4)
            if (blind.Score >= blind.Spec.Target) End(blind, BlindOutcome.Won, FailReason.None, events);
            else DealAndJudge(run, events);

            // #17 收尾
            blind.Step++;
            events.Add(new StepEnded(blind.Step, blind.Combo, blind.Score, blind.DiscardsLeft, blind.DrawList.Count));
            return new StepResult(blind.Step, events);
        }

        // #15 发组、#16 判负:判负在发组后,一次就盖住落子后、弃置后、发新一组后三种时机
        private static void DealAndJudge(RunState run, List<RuleEvent> events)
        {
            BlindState blind = run.Blind;
            if (blind.DealGroup())
            {
                var slots = new int[blind.TraySlots.Length];
                for (int i = 0; i < slots.Length; i++) slots[i] = blind.TraySlots[i].Id;
                events.Add(new GroupDealt(blind.Group, slots));
            }
            FailReason failure = run.PendingFailure();
            if (failure != FailReason.None) End(blind, BlindOutcome.Lost, failure, events);
        }

        private static void End(BlindState blind, BlindOutcome outcome, FailReason reason, List<RuleEvent> events)
        {
            blind.Outcome = outcome;
            blind.FailReason = reason;
            events.Add(new BlindEnded(outcome, reason));
        }

        private static StepResult Rejected(BlindState blind, StepReject reject) => new StepResult(blind?.Step ?? 0, reject);

        private static void Apply(EffectContext ctx, EffectDelta delta, List<RuleEvent> events)
        {
            if (delta.IsEmpty) return;
            ctx.Chips = ScoreMath.Add(ctx.Chips, delta.AddChips);
            ctx.Mult = ScoreMath.Add(ctx.Mult, delta.AddMult);
            ctx.XMultPermille = ScoreMath.MulPermille(ctx.XMultPermille, delta.XMultPermille);
            events.Add(new EffectApplied(ctx.Source, ctx.SourceIndex, ctx.Cell, delta, ctx.Chips, ctx.Mult, ctx.XMultPermille));
        }

        // 一格的来源:所属块的强化 → 它的版本 → 基因从左到右
        private static void CollectCellSources(RunState run, BlockInstance block, List<(EffectSource, int, RuleEffect)> into)
        {
            into.Clear();
            EffectRegistry registry = run.Config.Effects;
            RuleEffect e;
            if (block.Enhancement != Enhancement.None && (e = registry.Find(EffectSource.Enhancement, (int)block.Enhancement)) != null)
            {
                into.Add((EffectSource.Enhancement, (int)block.Enhancement, e));
            }
            if (block.Edition != Edition.None && (e = registry.Find(EffectSource.Edition, (int)block.Edition)) != null)
            {
                into.Add((EffectSource.Edition, (int)block.Edition, e));
            }
            for (int slot = 0; slot < run.Genes.Count; slot++)
            {
                if ((e = registry.Find(EffectSource.Gene, run.Genes[slot].GeneId)) != null) into.Add((EffectSource.Gene, slot, e));
            }
        }

        private static void VisitClearedBlocksThenGenes(RunState run, EffectContext ctx, Action<RuleEffect, EffectContext> visit)
        {
            EffectRegistry registry = run.Config.Effects;
            foreach (int id in DistinctInOrder(ctx.Owners))
            {
                BlockInstance block = run.FindInstance(id);
                ctx.Block = block;
                RuleEffect e;
                if (block.Enhancement != Enhancement.None && (e = registry.Find(EffectSource.Enhancement, (int)block.Enhancement)) != null)
                {
                    SetSource(ctx, EffectSource.Enhancement, (int)block.Enhancement);
                    visit(e, ctx);
                }
                if (block.Edition != Edition.None && (e = registry.Find(EffectSource.Edition, (int)block.Edition)) != null)
                {
                    SetSource(ctx, EffectSource.Edition, (int)block.Edition);
                    visit(e, ctx);
                }
            }
            ctx.Block = null;
            VisitGenes(run, ctx, visit);
        }

        private static void VisitGenes(RunState run, EffectContext ctx, Action<RuleEffect, EffectContext> visit)
        {
            EffectRegistry registry = run.Config.Effects;
            for (int slot = 0; slot < run.Genes.Count; slot++)
            {
                RuleEffect e = registry.Find(EffectSource.Gene, run.Genes[slot].GeneId);
                if (e == null) continue;
                SetSource(ctx, EffectSource.Gene, slot);
                visit(e, ctx);
            }
        }

        private static void SetSource(EffectContext ctx, EffectSource source, int index)
        {
            ctx.Source = source;
            ctx.SourceIndex = index;
        }

        private static List<int> DistinctInOrder(IReadOnlyList<int> ids)
        {
            var list = new List<int>();
            foreach (int id in ids)
            {
                if (!list.Contains(id)) list.Add(id);
            }
            return list;
        }
    }
}
