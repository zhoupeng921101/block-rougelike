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

            var ctx = new EffectContext(run, StepKind.Place, events);
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
            return Finish(run, new EffectContext(run, StepKind.Discard, events), events);
        }

        // #5–#12
        private static void Settle(RunState run, ClearResolution clear, EffectContext ctx, List<RuleEvent> events)
        {
            BlindState blind = run.Blind;
            ClearType type = clear.Type.Value;

            // #5 定类型
            events.Add(new ClearResolved(clear.Rows, clear.Cols, clear.Cells, type));
            run.RecordClear(type);
            ctx.HasClear = true;
            ctx.Type = type;
            ctx.Rows = clear.Rows;
            ctx.Cols = clear.Cols;
            ctx.Cells = clear.Cells;
            ctx.Owners = clear.Owners;

            // #6 结算前:可以改等级,所以 #7 在它之后读
            ctx.Hook = EffectHook.Before;
            VisitClearedBlocksThenGenes(run, ctx, (e, c) => e.BeforeScoring(c));

            // #7 读底注
            ClearTypeBase b = run.BaseOf(type);
            ctx.Chips = b.Chips;
            ctx.MultPermille = ScoreMath.ToPermille(b.Mult);
            events.Add(new BaseApplied(type, run.LevelOf(type), b.Chips, ctx.MultPermille));

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

                ctx.Hook = EffectHook.Repetition;
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

                ctx.Hook = EffectHook.Cell;
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

            // #9 基因段:带版本的基因,加算的版本在本体之前,×倍率的版本在本体之后(规则 §3.1)
            ctx.Hook = EffectHook.Gene;
            ScoreGenes(run, ctx, events);

            // #10 入账
            long gain = ScoreMath.Gain(ctx.Chips, ctx.MultPermille);
            blind.Score = ScoreMath.Add(blind.Score, gain);
            ctx.Gain = gain;
            events.Add(new ScoreBooked(ctx.Chips, ctx.MultPermille, gain, blind.Score));

            // #11 清格、离场:最后一格被消的块按 id 升序进消尽堆
            foreach (int cell in clear.Cells) blind.Board.ClearCell(cell);
            List<int> departed = DistinctInOrder(clear.Owners);
            departed.RemoveAll(id => blind.Board.CellsOf(id) > 0);
            departed.Sort();
            blind.DepartedList.AddRange(departed);
            events.Add(new CellsCleared(clear.Cells, departed));

            // #12 结算后:碎块等这一段问完再湮灭,问的途中被问的那批块不变
            ctx.Hook = EffectHook.After;
            VisitClearedBlocksThenGenes(run, ctx, (e, c) => e.AfterScoring(c));
            foreach (int id in ctx.Shattered) Destroy(run, id, events);
            ctx.Shattered.Clear();
        }

        /// <summary>湮灭一块并吐事件(琉璃碎裂、删块改造)。不在方块库与临时块里的 id 什么也不做。</summary>
        internal static void Destroy(RunState run, int instanceId, List<RuleEvent> events)
        {
            int[] cells = run.DestroyInstance(instanceId);
            if (cells != null) events.Add(new BlockDestroyed(instanceId, cells));
        }

        /// <summary>
        /// 盲注里用了改造之后:待放置区可能被删空,补发一组、再判一次负,回到稳定态(09 §5)。不算一步,不走步收尾。
        /// </summary>
        internal static void AfterConsumable(RunState run, List<RuleEvent> events)
        {
            BlindState blind = run.Blind;
            if (blind == null || blind.Outcome != BlindOutcome.InProgress) return;
            DealAndJudge(run, events);
        }

        private static void ScoreGenes(RunState run, EffectContext ctx, List<RuleEvent> events)
        {
            EffectRegistry registry = run.Config.Effects;
            for (int slot = 0; slot < run.Genes.Count; slot++)
            {
                GeneSlot gene = run.Genes[slot];
                RuleEffect body = registry.Find(EffectSource.Gene, gene.GeneId);
                RuleEffect edition = gene.Edition == Edition.None ? null : registry.Find(EffectSource.Edition, (int)gene.Edition);
                SetSource(ctx, EffectSource.Gene, slot);
                bool after = CoreEffects.AppliesAfterGene(gene.Edition);
                if (edition != null && !after) Apply(ctx, edition.OnGene(ctx), events);
                if (body != null) Apply(ctx, body.OnGene(ctx), events);
                if (edition != null && after) Apply(ctx, edition.OnGene(ctx), events);
            }
        }

        // #13–#17
        private static StepResult Finish(RunState run, EffectContext ctx, List<RuleEvent> events)
        {
            BlindState blind = run.Blind;

            // #13 步收尾
            ctx.Hook = EffectHook.StepEnd;
            VisitGenes(run, ctx, (e, c) => e.OnStepEnd(c));

            // #14 判胜在发组前:达标就不发下一组,同一步也不再判负(规则 §2.4)
            if (blind.Score >= blind.Spec.Target) End(blind, BlindOutcome.Won, FailReason.None, events);
            else DealAndJudge(run, events);

            // #17 收尾
            blind.Step++;
            run.ApplyBossOnStepEnd();
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
                run.ApplyBossOnDeal();
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
            ctx.MultPermille = ScoreMath.Add(ctx.MultPermille, ScoreMath.ToPermille(delta.AddMult));
            if (delta.XMultPermille != ScoreMath.PermilleOne)
                ctx.MultPermille = ScoreMath.MulPermille(ctx.MultPermille, delta.XMultPermille);
            events.Add(new EffectApplied(ctx.Source, ctx.SourceIndex, ctx.Cell, delta, ctx.Chips, ctx.MultPermille));
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
