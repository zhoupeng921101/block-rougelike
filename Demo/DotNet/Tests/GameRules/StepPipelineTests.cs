using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>
    /// 一步的推进与结算管线(07 号票):钩子挂点与次序、重触发、基因段、计分、胜负、被拒、预览一致、整局打完、事件形态。
    /// 走步都经 <see cref="TestRules.Place(RunState,int,int,int,int)"/> 这类助手,每步之后断言 Validate。
    /// </summary>
    public class StepPipelineTests
    {
        private const long Unreachable = 1_000_000;

        // ---- 测试替身。效果对象本该无状态;Recorder 只为记下调用次序,每个用例新建一个 ----

        private sealed class AddMultPerCell : RuleEffect
        {
            public override EffectDelta OnCell(EffectContext ctx) => EffectDelta.Mult(1);
        }

        private sealed class RetriggerOnce : RuleEffect
        {
            public override int Repetitions(EffectContext ctx) => 1;
        }

        private sealed class GeneDelta : RuleEffect
        {
            private readonly EffectDelta _delta;

            public GeneDelta(EffectDelta delta) => _delta = delta;

            public override EffectDelta OnGene(EffectContext ctx) => _delta;
        }

        private sealed class Recorder : RuleEffect
        {
            private readonly string _name;
            private readonly List<string> _log;

            public Recorder(string name, List<string> log)
            {
                _name = name;
                _log = log;
            }

            private void Log(string hook, EffectContext ctx) => _log.Add(FormattableString.Invariant($"{_name}.{hook}@{ctx.Cell}"));

            public override void BeforeScoring(EffectContext ctx) => Log("before", ctx);

            public override int Repetitions(EffectContext ctx)
            {
                Log("rep", ctx);
                return 0;
            }

            public override EffectDelta OnCell(EffectContext ctx)
            {
                Log("cell", ctx);
                return EffectDelta.None;
            }

            public override EffectDelta OnGene(EffectContext ctx)
            {
                Log("gene", ctx);
                return EffectDelta.None;
            }

            public override void AfterScoring(EffectContext ctx) => Log("after", ctx);

            public override void OnStepEnd(EffectContext ctx) => Log("end", ctx);
        }

        /// <summary>两块横 I 拼满第 7 行:单线、同形态、清屏同时成立,判清屏(底注 60 × 4)。</summary>
        private static StepResult ClearRowSevenWithTwoI(RunState run, int first)
        {
            TestRules.Place(run, first, 0, 7, 0);
            return TestRules.Place(run, TestRules.InTray(run, TetrominoKind.I), 0, 7, 4);
        }

        // ---- 钩子 ----

        [Test]
        public void Enhancement_FiresOncePerClearedCellOfItsBlock_InSettleOrder()
        {
            var effects = new EffectRegistry().Register(EffectSource.Enhancement, (int)Enhancement.Steel, new AddMultPerCell());
            RuleConfig config = TestRules.Config(effects,
                new LibraryEntry(TetrominoKind.I, 1, Enhancement.Steel), new LibraryEntry(TetrominoKind.I, 2),
                new LibraryEntry(TetrominoKind.I, 3, Enhancement.Steel), new LibraryEntry(TetrominoKind.I, 4),
                new LibraryEntry(TetrominoKind.I, 1, Enhancement.Steel), new LibraryEntry(TetrominoKind.I, 2));
            RunState run = TestRules.Started(config, TestRules.Spec(Unreachable, groupSize: 5));

            // 第 3 行 + 第 0 列,全是 I:同形态十字。六块各有格被消
            TestRules.Place(run, TetrominoKind.I, 1, 0, 5);
            TestRules.Place(run, TetrominoKind.I, 1, 0, 6);
            TestRules.Place(run, TetrominoKind.I, 1, 0, 7);
            TestRules.Place(run, TetrominoKind.I, 0, 3, 1);
            TestRules.Place(run, TetrominoKind.I, 1, 4, 0);
            StepResult step = TestRules.Place(run, TetrominoKind.I, 1, 0, 0);

            ClearResolved clear = step.Single<ClearResolved>();
            Assert.AreEqual(ClearType.SameShapeCross, clear.Type);
            List<CellScored> scored = step.Of<CellScored>();
            CollectionAssert.AreEqual(clear.Cells, scored.Select(s => s.Cell));

            var steelCells = scored.Where(s => run.FindInstance(s.InstanceId).Enhancement == Enhancement.Steel).Select(s => s.Cell).ToList();
            List<EffectApplied> applied = step.Of<EffectApplied>();
            Assert.That(steelCells.Count, Is.InRange(3, clear.Cells.Count - 3));
            CollectionAssert.AreEqual(steelCells, applied.Select(e => e.Cell), "每被消 1 格触发一遍,次序同被消格");
            Assert.That(applied, Has.All.Matches<EffectApplied>(e => e.Source == EffectSource.Enhancement && e.SourceIndex == (int)Enhancement.Steel));
            foreach (EffectApplied e in applied)
            {
                var before = (CellScored)step.Events[IndexOf(step, e) - 1];
                Assert.AreEqual(e.Cell, before.Cell, "强化紧跟在这一格的点数之后");
            }

            ScoreBooked booked = step.Single<ScoreBooked>();
            Assert.AreEqual((4 + steelCells.Count) * 1000, booked.MultPermille);
            Assert.AreEqual(50 + scored.Sum(s => (long)s.Points), booked.Chips);
        }

        [Test]
        public void Repetition_ReplaysTheWholeCellSegmentRightAway_AndNothingElse()
        {
            var effects = new EffectRegistry()
                .Register(EffectSource.Enhancement, (int)Enhancement.Steel, new AddMultPerCell())
                .Register(EffectSource.Edition, (int)Edition.Foil, new RetriggerOnce());
            RuleConfig config = TestRules.Config(effects,
                new LibraryEntry(TetrominoKind.I, 2, Enhancement.Steel, Edition.Foil), new LibraryEntry(TetrominoKind.I, 3));
            RunState run = TestRules.Started(config, TestRules.Spec(Unreachable));

            int foil = TestRules.InTray(run, b => b.Edition == Edition.Foil);
            StepResult step = ClearRowSevenWithTwoI(run, foil);

            Assert.AreEqual(1, step.Of<ClearResolved>().Count, "定类型只走一次");
            Assert.AreEqual(1, step.Of<BaseApplied>().Count);
            var trace = step.Events
                .SkipWhile(e => !(e is BaseApplied)).Skip(1)
                .TakeWhile(e => !(e is ScoreBooked))
                .Select(Describe).ToList();
            var expected = new List<string>();
            for (int cell = 56; cell < 60; cell++)
            {
                expected.Add($"rep Edition {cell} 1");
                expected.Add($"cell {cell} {foil} 0");
                expected.Add($"fx Enhancement {cell}");
                expected.Add($"cell {cell} {foil} 1");
                expected.Add($"fx Enhancement {cell}");
            }
            int other = foil == 1 ? 2 : 1;
            for (int cell = 60; cell < 64; cell++) expected.Add($"cell {cell} {other} 0");
            CollectionAssert.AreEqual(expected, trace);

            ScoreBooked booked = step.Single<ScoreBooked>();
            Assert.AreEqual(60 + 4 * 2 * 2 + 4 * 3, booked.Chips);
            Assert.AreEqual(12000, booked.MultPermille);
            Assert.AreEqual(88 * 12, booked.Gain);
        }

        [Test]
        public void Genes_RunLeftToRightAfterAllCells_WithCellMinusOne()
        {
            var effects = new EffectRegistry()
                .Register(EffectSource.Gene, 7, new GeneDelta(EffectDelta.Mult(2)))
                .Register(EffectSource.Gene, 9, new GeneDelta(EffectDelta.XMult(1500)));
            RunState run = TestRules.Started(TestRules.Config(effects, TestRules.Repeat(2, TetrominoKind.I)), TestRules.Spec(Unreachable));
            run.AddGene(7);
            run.AddGene(9);

            StepResult step = ClearRowSevenWithTwoI(run, run.Blind.Tray[0].Id);
            List<EffectApplied> genes = step.Of<EffectApplied>();
            Assert.AreEqual(2, genes.Count);
            Assert.AreEqual((EffectSource.Gene, 0, -1, 2L, 6000L), (genes[0].Source, genes[0].SourceIndex, genes[0].Cell, genes[0].AddMult, genes[0].MultPermille));
            Assert.AreEqual((EffectSource.Gene, 1, -1, 1500L, 9000L), (genes[1].Source, genes[1].SourceIndex, genes[1].Cell, genes[1].XMultPermille, genes[1].MultPermille));
            Assert.Greater(IndexOf(step, genes[0]), IndexOf(step, step.Of<CellScored>().Last()));
            Assert.Less(IndexOf(step, genes[1]), IndexOf(step, step.Single<ScoreBooked>()));
            Assert.AreEqual(68 * 6 * 3 / 2, step.Single<ScoreBooked>().Gain);
        }

        [Test]
        public void SixHookPoints_AskInTheDocumentedOrder()
        {
            var log = new List<string>();
            var effects = new EffectRegistry()
                .Register(EffectSource.Enhancement, (int)Enhancement.Glass, new Recorder("enh", log))
                .Register(EffectSource.Edition, (int)Edition.Holo, new Recorder("ed", log))
                .Register(EffectSource.Gene, 5, new Recorder("gene", log));
            RuleConfig config = TestRules.Config(effects,
                new LibraryEntry(TetrominoKind.I, 1, Enhancement.Glass, Edition.Holo), new LibraryEntry(TetrominoKind.I, 1));
            RunState run = TestRules.Started(config, TestRules.Spec(Unreachable));
            run.AddGene(5);

            int special = TestRules.InTray(run, b => b.Enhancement == Enhancement.Glass);
            TestRules.Place(run, special, 0, 7, 0);
            CollectionAssert.AreEqual(new[] { "gene.end@-1" }, log, "没消除的落子只走步收尾");
            log.Clear();

            TestRules.Place(run, TestRules.InTray(run, TetrominoKind.I), 0, 7, 4);
            var expected = new List<string> { "enh.before@-1", "ed.before@-1", "gene.before@-1" };
            for (int cell = 56; cell < 60; cell++)
            {
                expected.AddRange(new[] { $"enh.rep@{cell}", $"ed.rep@{cell}", $"gene.rep@{cell}", $"enh.cell@{cell}", $"ed.cell@{cell}", $"gene.cell@{cell}" });
            }
            for (int cell = 60; cell < 64; cell++) expected.AddRange(new[] { $"gene.rep@{cell}", $"gene.cell@{cell}" });
            expected.AddRange(new[] { "gene.gene@-1", "enh.after@-1", "ed.after@-1", "gene.after@-1", "gene.end@-1" });
            CollectionAssert.AreEqual(expected, log);
            Assert.That(run.Blind.Outcome, Is.EqualTo(BlindOutcome.Lost), "库打空、没达标");
        }

        [Test]
        public void Registry_IsSealedOnceInAConfig()
        {
            var effects = new EffectRegistry();
            TestRules.Config(effects);
            Assert.Throws<InvalidOperationException>(() => effects.Register(EffectSource.Gene, 1, new AddMultPerCell()));
            Assert.IsTrue(PlaceholderTuning.Config.Effects.IsSealed);
            Assert.IsNull(PlaceholderTuning.Config.Effects.Find(EffectSource.Gene, 1));
        }

        // ---- 计分 ----

        [Test]
        public void ScoreMath_FloorsEachPermilleProduct()
        {
            long c = ScoreMath.PermilleOne;
            for (int i = 0; i < 3; i++) c = ScoreMath.MulPermille(c, 1500);
            Assert.AreEqual(3375, c, "×1.5 连乘三次正好 ×3.375");
            c = ScoreMath.PermilleOne;
            var chain = new List<long>();
            for (int i = 0; i < 3; i++) chain.Add(c = ScoreMath.MulPermille(c, 1333));
            CollectionAssert.AreEqual(new[] { 1333L, 1776L, 2367L }, chain, "每乘一项向下取整到千分位");
            Assert.AreEqual(931, ScoreMath.Gain(69, 13500), "⌊69 × 4 × 3.375⌋ = ⌊931.5⌋");
        }

        [Test]
        public void ScoreMath_ClampsNegativesAndSaturates()
        {
            Assert.AreEqual(0, ScoreMath.Gain(-5, 3000));
            Assert.AreEqual(0, ScoreMath.Gain(5, -3000));
            Assert.AreEqual(0, ScoreMath.Gain(-5, -3000), "负负不得正:A、B 各自按 0 截");
            Assert.AreEqual(long.MaxValue, ScoreMath.Gain(long.MaxValue / 2, 3000));
            Assert.AreEqual(long.MaxValue, ScoreMath.Gain(long.MaxValue, long.MaxValue));
            Assert.AreEqual(long.MaxValue, ScoreMath.Add(long.MaxValue, 1));
            Assert.AreEqual(long.MinValue, ScoreMath.Add(long.MinValue, -1));
            Assert.AreEqual(long.MaxValue, ScoreMath.MulPermille(long.MaxValue, 2000));
            Assert.AreEqual(long.MaxValue, ScoreMath.MulPermille(1000, long.MaxValue));
            Assert.Throws<ArgumentOutOfRangeException>(() => ScoreMath.MulPermille(1000, -1));
            Assert.Throws<ArgumentOutOfRangeException>(() => new EffectDelta(0, 0, -1));
            Assert.IsTrue(default(EffectDelta).IsEmpty);
            Assert.AreEqual(1000, default(EffectDelta).XMultPermille, "default 不是 ×0");
        }

        [Test]
        public void Pipeline_XMultChainFloorsTheGain()
        {
            var effects = new EffectRegistry()
                .Register(EffectSource.Gene, 1, new GeneDelta(EffectDelta.Chips(1)))
                .Register(EffectSource.Gene, 9, new GeneDelta(EffectDelta.XMult(1500)));
            RunState run = TestRules.Started(TestRules.Config(effects, TestRules.Repeat(2, TetrominoKind.I)), TestRules.Spec(Unreachable));
            foreach (int gene in new[] { 1, 9, 9, 9 }) run.AddGene(gene);

            ScoreBooked booked = ClearRowSevenWithTwoI(run, run.Blind.Tray[0].Id).Single<ScoreBooked>();
            Assert.AreEqual((69L, 13500L, 931L, 931L), (booked.Chips, booked.MultPermille, booked.Gain, booked.Total));
        }

        [TestCase(-1000, 0)]
        [TestCase(0, -10)]
        public void Pipeline_NegativeChipsOrMult_ScoreZero(long addChips, long addMult)
        {
            var effects = new EffectRegistry().Register(EffectSource.Gene, 1, new GeneDelta(new EffectDelta(addChips, addMult, 1000)));
            RunState run = TestRules.Started(TestRules.Config(effects, TestRules.Repeat(2, TetrominoKind.I)), TestRules.Spec(Unreachable));
            run.AddGene(1);

            ScoreBooked booked = ClearRowSevenWithTwoI(run, run.Blind.Tray[0].Id).Single<ScoreBooked>();
            Assert.That(booked.Chips < 0 || booked.MultPermille < 0);
            Assert.AreEqual(0, booked.Gain);
            Assert.AreEqual(0, booked.Total);
            Assert.AreEqual(0, run.Blind.Score);
        }

        [Test]
        public void Pipeline_HugeValuesSaturate()
        {
            var effects = new EffectRegistry().Register(EffectSource.Gene, 1, new GeneDelta(EffectDelta.Chips(long.MaxValue)));
            RunState run = TestRules.Started(TestRules.Config(effects, TestRules.Repeat(3, TetrominoKind.I)), TestRules.Spec(Unreachable));
            run.AddGene(1);

            StepResult step = ClearRowSevenWithTwoI(run, run.Blind.Tray[0].Id);
            ScoreBooked booked = step.Single<ScoreBooked>();
            Assert.AreEqual((long.MaxValue, long.MaxValue, long.MaxValue), (booked.Chips, booked.Gain, booked.Total));
            Assert.AreEqual(BlindOutcome.Won, step.Single<BlindEnded>().Outcome);
        }

        [TestCase(false, 28000, 1904)]
        [TestCase(true, 18000, 1224)]
        public void GeneOrder_ChangesWhichAdditionsAreMultiplied(bool multiplyFirst, long mult, long gain)
        {
            var effects = new EffectRegistry()
                .Register(EffectSource.Gene, 1, new GeneDelta(EffectDelta.Mult(10)))
                .Register(EffectSource.Gene, 2, new GeneDelta(EffectDelta.XMult(2000)));
            RunState run = TestRules.Started(TestRules.Config(effects, TestRules.Repeat(2, TetrominoKind.I)), TestRules.Spec(Unreachable));
            run.AddGene(multiplyFirst ? 2 : 1);
            run.AddGene(multiplyFirst ? 1 : 2);
            ScoreBooked booked = ClearRowSevenWithTwoI(run, run.Blind.Tray[0].Id).Single<ScoreBooked>();
            Assert.AreEqual(mult, booked.MultPermille);
            Assert.AreEqual(gain, booked.Gain);
        }

        [Test]
        public void CombinedDelta_AddsBeforeMultiplying_AndNegativeMultClampsAtMultiply()
        {
            var effects = new EffectRegistry()
                .Register(EffectSource.Gene, 1, new GeneDelta(new EffectDelta(0, -10, 1000)))
                .Register(EffectSource.Gene, 2, new GeneDelta(EffectDelta.XMult(2000)))
                .Register(EffectSource.Gene, 3, new GeneDelta(new EffectDelta(1, 3, 1500)));
            RunState run = TestRules.Started(TestRules.Config(effects, TestRules.Repeat(2, TetrominoKind.I)), TestRules.Spec(Unreachable));
            foreach (int gene in new[] { 1, 2, 3 }) run.AddGene(gene);
            StepResult step = ClearRowSevenWithTwoI(run, run.Blind.Tray[0].Id);
            CollectionAssert.AreEqual(new long[] { -6000, 0, 4500 }, step.Of<EffectApplied>().Select(e => e.MultPermille));
            Assert.AreEqual(310, step.Single<ScoreBooked>().Gain);
        }

        [Test]
        public void PermilleArithmetic_MatchesUnboundedIntegerReference()
        {
            long[] values = { 0, 1, 999, 1000, 1333, 999999, long.MaxValue / 1000, long.MaxValue / 2, long.MaxValue };
            foreach (long a in values)
            foreach (long b in values)
            {
                System.Numerics.BigInteger exact = (System.Numerics.BigInteger)a * b / 1000;
                long expected = exact > long.MaxValue ? long.MaxValue : (long)exact;
                Assert.AreEqual(expected, ScoreMath.Gain(a, b), $"{a} * {b} / 1000");
                Assert.AreEqual(expected, ScoreMath.MulPermille(a, b));
            }
            Assert.AreEqual(long.MaxValue, ScoreMath.ToPermille(long.MaxValue));
            Assert.AreEqual(long.MinValue, ScoreMath.ToPermille(long.MinValue));
            Assert.AreEqual(-3000, ScoreMath.ToPermille(-3));
        }

        // ---- 胜负 ----

        [Test]
        public void ReachingTargetWhileEmptyingTheLibrary_IsAWin()
        {
            RunState run = TestRules.Started(TestRules.Config(TestRules.Repeat(2, TetrominoKind.I)), TestRules.Spec(target: (60 + 8) * 4));
            StepResult step = ClearRowSevenWithTwoI(run, run.Blind.Tray[0].Id);

            Assert.AreEqual(272, step.Single<ScoreBooked>().Total);
            BlindEnded end = step.Single<BlindEnded>();
            Assert.AreEqual((BlindOutcome.Won, FailReason.None), (end.Outcome, end.Reason), "达标即结束,不再判预算耗尽");
            Assert.That(step.Of<GroupDealt>(), Is.Empty);
            Assert.AreEqual((BlindOutcome.Won, FailReason.None), (run.Blind.Outcome, run.Blind.FailReason));
            Assert.IsTrue(run.Blind.IsTrayEmpty);
            Assert.That(run.Blind.Draw, Is.Empty);
            AssertEverythingRejected(run);
        }

        [Test]
        public void LibraryAndTrayEmpty_BelowTarget_IsBudgetExhausted()
        {
            RunState run = TestRules.Started(TestRules.Config(new LibraryEntry(TetrominoKind.O, 1)), TestRules.Spec());
            BlindEnded end = TestRules.Place(run, TetrominoKind.O, 0, 0, 0).Single<BlindEnded>();
            Assert.AreEqual((BlindOutcome.Lost, FailReason.BudgetExhausted), (end.Outcome, end.Reason));
            Assert.AreEqual(FailReason.BudgetExhausted, run.Blind.FailReason);
            AssertEverythingRejected(run);
        }

        [Test]
        public void TrayLeftButNothingFits_NoDiscards_IsCannotPlace()
        {
            RunState run = TestRules.Started(TestRules.Config(new LibraryEntry(TetrominoKind.O, 1), new LibraryEntry(TetrominoKind.I, 1)),
                TestRules.Spec(discards: 0));
            KeepOnlyTopLeftSquare(run);
            Assert.IsNull(run.Validate(), "O 还放得下,不是该判负的状态");

            StepResult step = TestRules.Place(run, TetrominoKind.O, 0, 0, 0);
            BlindEnded end = step.Single<BlindEnded>();
            Assert.AreEqual((BlindOutcome.Lost, FailReason.CannotPlace), (end.Outcome, end.Reason));
            Assert.IsFalse(run.Blind.IsTrayEmpty);
            AssertEverythingRejected(run);
        }

        [Test]
        public void LossAfterDiscard()
        {
            RunState run = TestRules.Started(TestRules.Config(TestRules.Repeat(2, TetrominoKind.I)), TestRules.Spec(discards: 1));
            KeepOnlyTopLeftSquare(run);
            Assert.IsNull(run.Validate(), "两块都放不下,但还有一次弃置");

            int id = run.Blind.Tray[0].Id;
            StepResult step = TestRules.Discard(run, id);
            PieceDiscarded discarded = step.Single<PieceDiscarded>();
            Assert.AreEqual((id, 0), (discarded.InstanceId, discarded.DiscardsLeft));
            Assert.AreEqual(FailReason.CannotPlace, step.Single<BlindEnded>().Reason);
            CollectionAssert.AreEqual(new[] { id }, run.Blind.Discarded);

            RunState last = TestRules.Started(TestRules.Config(new LibraryEntry(TetrominoKind.I, 1)), TestRules.Spec(discards: 1));
            Assert.AreEqual(FailReason.BudgetExhausted, TestRules.Discard(last, last.Blind.Tray[0].Id).Single<BlindEnded>().Reason,
                "最后一块是弃掉的:方块库和待放置区都空了");
        }

        [Test]
        public void EmptyLibrary_LosesAtBlindStart()
        {
            RunState run = RunState.NewRun(TestRules.Seed, TestRules.Config());
            StepResult start = run.StartBlind(TestRules.Spec());
            Assert.AreEqual(0, start.Step);
            CollectionAssert.AreEqual(new[] { typeof(BlindStarted), typeof(BlindEnded) }, start.Events.Select(e => e.GetType()));
            Assert.AreEqual(FailReason.BudgetExhausted, start.Single<BlindEnded>().Reason);
            Assert.IsNull(run.Validate());
            AssertEverythingRejected(run);
        }

        // ---- 命令与结果 ----

        [Test]
        public void StartBlind_ReturnsEvents_AndIsNotAStep()
        {
            RunState run = RunState.NewRun(TestRules.Seed, PlaceholderTuning.Config);
            StepResult start = run.StartBlind(PlaceholderTuning.FirstBlind);
            Assert.IsTrue(start.Accepted);
            Assert.AreEqual(0, start.Step);
            Assert.AreEqual(2, start.Events.Count);
            BlindStarted started = (BlindStarted)start.Events[0];
            Assert.AreEqual((350L, 3, 3, 28), (started.Target, started.Discards, started.GroupSize, started.DrawLeft));
            GroupDealt dealt = (GroupDealt)start.Events[1];
            Assert.AreEqual(1, dealt.Group);
            CollectionAssert.AreEqual(run.Blind.Tray.Select(s => s.Id), dealt.Slots);
        }

        [Test]
        public void Rejections_ChangeNothing()
        {
            RunState run = TestRules.Started(TestRules.Config(TestRules.Repeat(5, TetrominoKind.I)), TestRules.Spec(discards: 0));
            int inTray = run.Blind.Tray[0].Id;
            TestRules.Place(run, inTray, 0, 0, 0);
            int next = run.Blind.Tray[1].Id;
            string before = TestRules.Dump(run);

            AssertRejected(run, run.Place(run.Blind.Draw[0], 0, 4, 0), StepReject.NotInTray, before);
            AssertRejected(run, run.Place(inTray, 0, 4, 0), StepReject.NotInTray, before);
            AssertRejected(run, run.Place(999, 0, 4, 0), StepReject.NotInTray, before);
            AssertRejected(run, run.Place(next, 0, 0, 2), StepReject.CannotPlace, before);
            AssertRejected(run, run.Place(next, 0, 0, 5), StepReject.CannotPlace, before);
            AssertRejected(run, run.Place(next, 4, 4, 0), StepReject.CannotPlace, before);
            AssertRejected(run, run.Place(next, -1, 4, 0), StepReject.CannotPlace, before);
            AssertRejected(run, run.Discard(next), StepReject.NoDiscards, before);
            AssertRejected(run, run.Discard(run.Blind.Draw[0]), StepReject.NotInTray, before);

            RunState notStarted = RunState.NewRun(TestRules.Seed, PlaceholderTuning.Config);
            Assert.AreEqual(StepReject.BlindOver, notStarted.Place(1, 0, 0, 0).Reject);
            Assert.AreEqual(StepReject.BlindOver, notStarted.Discard(1).Reject);
        }

        [Test]
        public void Combo_CountsClearingPlacements_DiscardKeepsIt_DealsWhenTrayEmpties()
        {
            RunState run = TestRules.Started(TestRules.Config(TestRules.Repeat(5, TetrominoKind.I)), TestRules.Spec(Unreachable, discards: 1));
            Assert.AreEqual(0, TestRules.Place(run, TetrominoKind.I, 0, 7, 0).Single<StepEnded>().Combo);
            StepResult clear = TestRules.Place(run, TetrominoKind.I, 0, 7, 4);
            Assert.AreEqual(1, clear.Single<StepEnded>().Combo, "连击含本次");
            Assert.That(clear.Of<GroupDealt>(), Is.Empty, "待放置区还剩一块");

            StepResult discard = TestRules.Discard(run, run.Blind.Tray.First(s => !s.IsEmpty).Id);
            Assert.AreEqual(1, discard.Single<StepEnded>().Combo, "弃置不改连击");
            GroupDealt dealt = discard.Single<GroupDealt>();
            Assert.AreEqual(2, dealt.Group);
            Assert.AreEqual(3, dealt.Slots.Count);
            Assert.AreEqual(0, dealt.Slots[2], "库里只剩两块:剩几块抽几块,空槽为 0");
            StepEnded ended = discard.Single<StepEnded>();
            Assert.AreEqual((3, 0, 0), (ended.Step, ended.DiscardsLeft, ended.DrawLeft));

            Assert.AreEqual(0, TestRules.Place(run, TetrominoKind.I, 0, 0, 0).Single<StepEnded>().Combo, "没消除的放置清零");
        }

        [Test]
        public void ClearedBlocks_DepartOnlyWhenTheirLastCellGoes_ByAscendingId()
        {
            RunState run = TestRules.Started(TestRules.Config(TestRules.Repeat(4, TetrominoKind.O)), TestRules.Spec(Unreachable, groupSize: 4));
            int[] ids = run.Blind.Tray.Select(s => s.Id).ToArray();
            TestRules.Place(run, ids[0], 0, 6, 0);
            TestRules.Place(run, ids[1], 0, 6, 2);
            TestRules.Place(run, ids[2], 0, 6, 4);
            StepResult step = TestRules.Place(run, ids[3], 0, 6, 6);

            CellsCleared cleared = step.Single<CellsCleared>();
            CollectionAssert.AreEqual(new[] { 6, 7 }, step.Single<ClearResolved>().Rows);
            CollectionAssert.AreEqual(ids.OrderBy(i => i), cleared.Departed, "两行一起消,四块都离场,按 id 升序");
            CollectionAssert.AreEqual(ids.OrderBy(i => i), run.Blind.Departed);
            CollectionAssert.AreEqual(step.Single<ClearResolved>().Cells, cleared.Cells);
        }

        [Test]
        public void HalfClearedBlock_StaysOnBoard()
        {
            RuleConfig config = TestRules.Config(new LibraryEntry(TetrominoKind.O, 1), new LibraryEntry(TetrominoKind.O, 1), new LibraryEntry(TetrominoKind.I, 1));
            RunState run = TestRules.Started(config, TestRules.Spec(Unreachable));
            int left = TestRules.InTray(run, TetrominoKind.O);
            TestRules.Place(run, left, 0, 6, 0);
            int bar = TestRules.InTray(run, TetrominoKind.I);
            TestRules.Place(run, bar, 0, 7, 2);
            int right = TestRules.InTray(run, TetrominoKind.O);
            StepResult step = TestRules.Place(run, right, 0, 6, 6);

            CollectionAssert.AreEqual(new[] { 7 }, step.Single<ClearResolved>().Rows);
            CollectionAssert.AreEqual(new[] { bar }, step.Single<CellsCleared>().Departed, "两块 O 只消了下半");
            Assert.AreEqual(2, run.Blind.Board.CellsOf(left));
            Assert.AreEqual(2, run.Blind.Board.CellsOf(right));
            CollectionAssert.AreEqual(new[] { left, right }.OrderBy(i => i), run.Blind.Board.InstancesOnBoard());
        }

        // ---- 预览与整局 ----

        [TestCase(TestRules.Seed)]
        [TestCase("23456789")]
        [TestCase("ZZZZZZZZ")]
        public void DefaultLibrary_PlaysToTheEnd_WithPreviewMatchingEveryPlacement(string seed)
        {
            RunState run = RunState.NewRun(seed, PlaceholderTuning.Config);
            run.StartBlind(PlaceholderTuning.FirstBlind);
            Assert.IsNull(run.Validate());
            int limit = PlaceholderTuning.DefaultLibrary.Count + PlaceholderTuning.FirstBlind.Discards + 1;
            int steps = 0, clears = 0;
            long total = 0;

            while (run.Blind.Outcome == BlindOutcome.InProgress)
            {
                Assert.Less(steps, limit, "规则核心没能结束这一局");
                StepResult step;
                (int id, int rot, int row, int col)? move = TestRules.FirstLegalPlacement(run);
                if (move.HasValue)
                {
                    (int id, int rot, int row, int col) = move.Value;
                    string rngBefore = RngDump(run);
                    ClearResolution preview = run.ResolveClear(id, rot, row, col);
                    Assert.AreEqual(rngBefore, RngDump(run), "预览不碰随机流");

                    step = TestRules.Place(run, id, rot, row, col);
                    ClearResolved resolved = step.Of<ClearResolved>().SingleOrDefault();
                    Assert.AreEqual(preview.HasClear, resolved != null);
                    if (resolved != null)
                    {
                        clears++;
                        Assert.AreEqual(preview.Type, resolved.Type);
                        CollectionAssert.AreEqual(preview.Cells, resolved.Cells);
                        CollectionAssert.AreEqual(preview.Rows, resolved.Rows);
                        CollectionAssert.AreEqual(preview.Cols, resolved.Cols);
                        Assert.AreEqual(run.BaseOf(resolved.Type).Chips, step.Single<BaseApplied>().Chips, "预览显示的底注就是结算读的底注");
                        total += step.Single<ScoreBooked>().Gain;
                    }
                }
                else
                {
                    step = TestRules.Discard(run, run.Blind.Tray.First(s => !s.IsEmpty).Id);
                }
                steps++;
                Assert.AreEqual(steps, step.Step);
                Assert.AreEqual(total, step.Single<StepEnded>().Total);
                Assert.AreEqual(run.Blind.Outcome != BlindOutcome.InProgress, step.Of<BlindEnded>().Count == 1);
            }

            TestContext.WriteLine(FormattableString.Invariant(
                $"{seed}: {run.Blind.Outcome} {run.Blind.FailReason} score={total} steps={steps} clears={clears} discards={run.Blind.Discarded.Count}"));
            Assert.LessOrEqual(steps, limit);
            Assert.Greater(clears, 0);
            Assert.AreEqual(total, run.Blind.Score);
            if (run.Blind.Outcome == BlindOutcome.Won) Assert.GreaterOrEqual(total, PlaceholderTuning.FirstBlind.Target);
            else Assert.AreNotEqual(FailReason.None, run.Blind.FailReason);
        }

        [Test]
        public void Clone_TryingAStepLeavesTheOriginal()
        {
            RunState run = RunState.NewRun(TestRules.Seed, PlaceholderTuning.Config);
            run.StartBlind(PlaceholderTuning.FirstBlind);
            string before = TestRules.Dump(run);
            RunState copy = run.Clone();
            (int id, int rot, int row, int col) = TestRules.FirstLegalPlacement(copy).Value;
            TestRules.Place(copy, id, rot, row, col);
            Assert.AreEqual(before, TestRules.Dump(run));
            Assert.AreEqual(1, copy.Blind.Step);
        }

        [Test]
        public void Events_HoldOnlyIntegersEnumsBoolsAndOrderedIntLists()
        {
            Type[] events = typeof(RuleEvent).Assembly.GetTypes().Where(t => t.IsSubclassOf(typeof(RuleEvent))).ToArray();
            Assert.AreEqual(13, events.Length, "07 号票第 4 节的 13 种事件");
            var bad = new List<string>();
            foreach (Type t in events)
            {
                Assert.IsTrue(t.IsSealed, t.Name);
                if (t.GetFields(BindingFlags.Public | BindingFlags.Instance).Length > 0) bad.Add(t.Name + " 有公开字段");
                foreach (PropertyInfo p in t.GetProperties(BindingFlags.Public | BindingFlags.Instance))
                {
                    Type pt = p.PropertyType;
                    bool ok = pt == typeof(int) || pt == typeof(long) || pt == typeof(bool) || pt.IsEnum || pt == typeof(IReadOnlyList<int>);
                    if (!ok) bad.Add(t.Name + "." + p.Name + ": " + pt.Name);
                }
            }
            Assert.That(bad, Is.Empty);
        }

        // ---- 助手 ----

        private static void KeepOnlyTopLeftSquare(RunState run)
        {
            var keep = new[] { 0, 1, 8, 9 };
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (!keep.Contains(cell)) run.Blind.Board.SetDead(cell);
            }
        }

        private static void AssertEverythingRejected(RunState run)
        {
            Assert.AreNotEqual(BlindOutcome.InProgress, run.Blind.Outcome);
            string before = TestRules.Dump(run);
            int anyId = run.Library.Count > 0 ? run.Library[0].Id : 1;
            AssertRejected(run, run.Place(anyId, 0, 3, 3), StepReject.BlindOver, before);
            AssertRejected(run, run.Discard(anyId), StepReject.BlindOver, before);
            foreach (TraySlot slot in run.Blind.Tray)
            {
                if (slot.IsEmpty) continue;
                AssertRejected(run, run.Place(slot.Id, 0, 3, 3), StepReject.BlindOver, before);
                AssertRejected(run, run.Discard(slot.Id), StepReject.BlindOver, before);
            }
        }

        private static void AssertRejected(RunState run, StepResult result, StepReject reject, string before)
        {
            Assert.AreEqual(reject, result.Reject);
            Assert.IsFalse(result.Accepted);
            Assert.That(result.Events, Is.Empty);
            Assert.AreEqual(run.Blind.Step, result.Step);
            Assert.AreEqual(before, TestRules.Dump(run), "被拒不改状态");
        }

        private static int IndexOf(StepResult step, RuleEvent e)
        {
            for (int i = 0; i < step.Events.Count; i++)
            {
                if (ReferenceEquals(step.Events[i], e)) return i;
            }
            return -1;
        }

        private static string RngDump(RunState run) =>
            string.Join(";", run.Rng.Export().Select(s => FormattableString.Invariant($"{s.Key}={s.S0:x16}{s.S1:x16}")));

        private static string Describe(RuleEvent e)
        {
            switch (e)
            {
                case RepetitionGranted r: return FormattableString.Invariant($"rep {r.Source} {r.Cell} {r.Count}");
                case CellScored s: return FormattableString.Invariant($"cell {s.Cell} {s.InstanceId} {s.Repetition}");
                case EffectApplied a: return FormattableString.Invariant($"fx {a.Source} {a.Cell}");
                default: return e.GetType().Name;
            }
        }
    }
}
