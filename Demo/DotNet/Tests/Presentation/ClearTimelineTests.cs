using System.Linq;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>
    /// 演出排期(30 号票第 2 条,口径 21 号票第 3、5、7、9 节)。<c>ClearTimeline.cs</c> 与 <c>ClearPacing.cs</c> 从 GameLogic 链接编译进来,
    /// 它们引了 UnityEngine 这里就编不过。事件一律由真规则核心走出来,不手搓:排期吃的就是表现层拿到的那份列表。
    /// </summary>
    public class ClearTimelineTests
    {
        private const long Unreachable = 1_000_000;
        private const float Eps = 1e-4f;

        // ---- 消除 ----

        [Test]
        public void SingleLine_EightCells_UnlocksAt067_EndsAt147()
        {
            StepResult step = ClearRowSeven(Started(Unreachable));
            ClearTimeline t = ClearTimeline.Build(step.Events, 1f);

            Assert.IsTrue(t.HasClear);
            Assert.AreEqual(8, t.Beats.Count);
            Assert.AreEqual(0.15f, t.Beats[0].Time, Eps, "落子后 ClearLead 到第 1 拍");
            Assert.AreEqual(0.42f, t.CellSegment, Eps, "7 × 0.06");
            Assert.AreEqual(0.67f, t.UnlockAt, Eps);
            Assert.AreEqual(0.67f, t.CellsGoneAt, Eps);
            Assert.AreEqual(1.47f, t.EndAt, Eps);
            Assert.AreEqual(ClearTimeline.Never, t.ResultAt);
            Assert.That(t.Beats, Has.All.Matches<ClearBeat>(b => b.Kind == ClearBeatKind.Cell && b.Exits && b.Line == 0));
            Assert.AreEqual(1, t.Lines.Count);
            Assert.AreEqual(t.Beats.Last().Time, t.Lines[0].FadeAt, Eps, "最后一格退场时光带跟着淡出");
        }

        [Test]
        public void Beats_FollowEventOrderAndCarryRunningChips()
        {
            StepResult step = ClearRowSeven(Started(Unreachable));
            ClearTimeline t = ClearTimeline.Build(step.Events, 1f);
            var scored = step.Of<CellScored>();
            BaseApplied b = step.Single<BaseApplied>();

            CollectionAssert.AreEqual(scored.Select(s => s.Cell), t.Beats.Select(x => x.Cell));
            CollectionAssert.AreEqual(scored.Select(s => s.Chips), t.Beats.Select(x => x.Chips));
            CollectionAssert.AreEqual(scored.Select(s => s.Points), t.Beats.Select(x => x.Points));
            Assert.That(t.Beats, Has.All.Matches<ClearBeat>(x => x.MultPermille == b.MultPermille), "本图倍率在逐格段里不变");
            for (int i = 1; i < t.Beats.Count; i++) Assert.AreEqual(0.06f, t.Beats[i].Time - t.Beats[i - 1].Time, Eps);
        }

        [Test]
        public void ThreeLines_TwentyFourCells_SqueezeTheCellSegmentToExactlyOneSecond()
        {
            RunState run = Started(Unreachable, library: 12);
            // 第 5–7 行除第 0 列外铺满(第 1–3 列竖 I 占第 4–7 行、第 4–7 列横 I),最后一条竖 I 落第 0 列第 4–7 行:第 4 行不满,只消三行
            for (int col = 1; col <= 3; col++) TestRules.Place(run, TetrominoKind.I, 1, 4, col);
            for (int row = 5; row <= 7; row++) TestRules.Place(run, TetrominoKind.I, 0, row, 4);
            StepResult step = TestRules.Place(run, TetrominoKind.I, 1, 4, 0);
            ClearResolved three = step.Single<ClearResolved>();
            CollectionAssert.AreEqual(new[] { 5, 6, 7 }, three.Rows, "全是 I,类型是同形态;排期只看线和格");
            CollectionAssert.IsEmpty(three.Cols);

            ClearTimeline t = ClearTimeline.Build(step.Events, 1f);
            Assert.AreEqual(24, t.Beats.Count);
            Assert.AreEqual(1.00f, t.CellSegment, Eps, "23 × 0.06 + 2 × 0.06 = 1.5,压到上限");
            Assert.AreEqual(1.00f, t.Beats.Last().Time - t.Beats[0].Time, Eps);
            Assert.AreEqual(1.25f, t.UnlockAt, Eps);
            Assert.AreEqual(2.05f, t.EndAt, Eps);
            // 压缩是等比的:线内拍距与换线的额外停顿同比例缩
            float step0 = t.Beats[1].Time - t.Beats[0].Time;
            Assert.AreEqual(0.04f, step0, Eps);
            Assert.AreEqual(2 * step0, t.Beats[8].Time - t.Beats[7].Time, Eps, "换线多停一个(压缩后的)LineGap");
        }

        [Test]
        public void RowAndColumn_CrossCellTakesNoBeatOnTheColumn()
        {
            RunState run = Started(Unreachable, library: 12);
            // 第 3 行 + 第 0 列(同 StepPipelineTests 的同形态十字)
            TestRules.Place(run, TetrominoKind.I, 1, 0, 5);
            TestRules.Place(run, TetrominoKind.I, 1, 0, 6);
            TestRules.Place(run, TetrominoKind.I, 1, 0, 7);
            TestRules.Place(run, TetrominoKind.I, 0, 3, 1);
            TestRules.Place(run, TetrominoKind.I, 1, 4, 0);
            StepResult step = TestRules.Place(run, TetrominoKind.I, 1, 0, 0);
            ClearResolved clear = step.Single<ClearResolved>();
            CollectionAssert.AreEqual(new[] { 3 }, clear.Rows);
            CollectionAssert.AreEqual(new[] { 0 }, clear.Cols);

            ClearTimeline t = ClearTimeline.Build(step.Events, 1f);
            Assert.AreEqual(15, t.Beats.Count, "8 + 7:交叉格 (3,0) 在行里走过,列上跳过");
            Assert.AreEqual(1, t.Beats.Count(b => b.Cell == 3 * 8 + 0));
            Assert.AreEqual(0, t.Beats.First(b => b.Cell == 3 * 8 + 0).Line, "交叉格归行");
            Assert.AreEqual(0.90f, t.CellSegment, Eps, "14 × 0.06 + 1 × 0.06");
            Assert.AreEqual(1.15f, t.UnlockAt, Eps);
            Assert.AreEqual(2, t.Lines.Count);
            Assert.IsTrue(t.Lines[0].IsRow && t.Lines[0].Index == 3);
            Assert.IsTrue(!t.Lines[1].IsRow && t.Lines[1].Index == 0);
            Assert.AreEqual(t.Beats.Last().Time, t.Lines[1].FadeAt, Eps, "列的最后一格是整步的最后一拍");
            Assert.Less(t.Lines[0].FadeAt, t.Lines[1].FadeAt);
        }

        // ---- 不锁的步 ----

        [Test]
        public void PlaceWithoutClear_Discard_AndDeal_UnlockAtZero()
        {
            RunState run = RunState.NewRun(TestRules.Seed, TestRules.Config(TestRules.Repeat(12, TetrominoKind.I)));
            StepResult start = run.StartBlind(TestRules.Spec(Unreachable));
            ClearTimeline deal = ClearTimeline.Build(start.Events, 1f);
            Assert.AreEqual(0f, deal.UnlockAt);
            Assert.AreEqual(0f, deal.GroupPopAt, "开盲注发的组当场弹出");
            Assert.AreEqual(ClearPacing.GroupPopIn, deal.EndAt, Eps);

            ClearTimeline place = ClearTimeline.Build(TestRules.Place(run, TetrominoKind.I, 0, 7, 0).Events, 1f);
            Assert.IsFalse(place.HasClear);
            Assert.IsEmpty(place.Beats);
            Assert.AreEqual(0f, place.UnlockAt);
            Assert.AreEqual(ClearPacing.PlacePunch, place.EndAt, Eps);

            ClearTimeline discard = ClearTimeline.Build(TestRules.Discard(run, run.Blind.Tray[1].Id).Events, 1f);
            Assert.IsTrue(discard.IsDiscard);
            Assert.AreEqual(0f, discard.UnlockAt);
            Assert.AreEqual(ClearPacing.DiscardShrink, discard.EndAt, Eps);

            // 托盘第三块落下:这一组用完,发下一组,不成线所以当场弹出
            StepResult third = TestRules.Place(run, run.Blind.Tray.First(s => !s.IsEmpty).Id, 0, 0, 0);
            Assert.AreEqual(1, third.Of<GroupDealt>().Count);
            ClearTimeline dealt = ClearTimeline.Build(third.Events, 1f);
            Assert.AreEqual(0f, dealt.UnlockAt);
            Assert.AreEqual(0f, dealt.GroupPopAt);
        }

        [Test]
        public void ClearThatDealsANewGroup_PopsItWhenTheCellsAreGone()
        {
            RunState run = Started(Unreachable, groupSize: 2);
            StepResult step = ClearRowSeven(run);
            Assert.AreEqual(1, step.Of<GroupDealt>().Count);
            ClearTimeline t = ClearTimeline.Build(step.Events, 1f);
            Assert.AreEqual(t.UnlockAt, t.GroupPopAt, Eps);
            Assert.AreEqual(1.47f, t.EndAt, Eps, "弹出 0.2 秒落在尾巴之内");
        }

        // ---- 结局 ----

        [Test]
        public void WinningStep_NeverUnlocks_ResultAfterTheTailPlusDelay()
        {
            StepResult step = ClearRowSeven(Started(target: 1));
            Assert.AreEqual(BlindOutcome.Won, step.Single<BlindEnded>().Outcome);
            ClearTimeline t = ClearTimeline.Build(step.Events, 1f);
            Assert.IsTrue(t.Ends);
            Assert.AreEqual(ClearTimeline.Never, t.UnlockAt);
            Assert.AreEqual(0.67f, t.CellsGoneAt, Eps, "格照常退场,只是不解锁");
            Assert.AreEqual(1.47f + ClearPacing.ResultDelay, t.ResultAt, Eps);
        }

        [Test]
        public void LosingStep_WithoutClear_NeverUnlocks_ResultAfterThePunch()
        {
            RunState run = Started(Unreachable, library: 2);
            TestRules.Place(run, TetrominoKind.I, 0, 0, 0);
            StepResult step = TestRules.Place(run, TetrominoKind.I, 0, 2, 0);
            Assert.AreEqual(FailReason.BudgetExhausted, step.Single<BlindEnded>().Reason);
            ClearTimeline t = ClearTimeline.Build(step.Events, 1f);
            Assert.AreEqual(ClearTimeline.Never, t.UnlockAt);
            Assert.AreEqual(ClearPacing.PlacePunch + ClearPacing.ResultDelay, t.ResultAt, Eps);
        }

        // ---- 倍率 ----

        [Test]
        public void SpeedTwo_HalvesEveryMoment()
        {
            RunState run = Started(Unreachable, library: 12);
            TestRules.Place(run, TetrominoKind.I, 1, 0, 5);
            TestRules.Place(run, TetrominoKind.I, 1, 0, 6);
            TestRules.Place(run, TetrominoKind.I, 1, 0, 7);
            TestRules.Place(run, TetrominoKind.I, 0, 3, 1);
            TestRules.Place(run, TetrominoKind.I, 1, 4, 0);
            StepResult step = TestRules.Place(run, TetrominoKind.I, 1, 0, 0);

            ClearTimeline one = ClearTimeline.Build(step.Events, 1f);
            ClearTimeline two = ClearTimeline.Build(step.Events, 2f);
            Assert.AreEqual(one.Beats.Count, two.Beats.Count);
            for (int i = 0; i < one.Beats.Count; i++) Assert.AreEqual(one.Beats[i].Time / 2, two.Beats[i].Time, Eps);
            for (int i = 0; i < one.Lines.Count; i++) Assert.AreEqual(one.Lines[i].FadeAt / 2, two.Lines[i].FadeAt, Eps);
            Assert.AreEqual(one.CellSegment / 2, two.CellSegment, Eps);
            Assert.AreEqual(one.UnlockAt / 2, two.UnlockAt, Eps);
            Assert.AreEqual(one.CellsGoneAt / 2, two.CellsGoneAt, Eps);
            Assert.AreEqual(one.PunchEndAt / 2, two.PunchEndAt, Eps);
            Assert.AreEqual(one.MergeAt / 2, two.MergeAt, Eps);
            Assert.AreEqual(one.FlyAt / 2, two.FlyAt, Eps);
            Assert.AreEqual(one.RollAt / 2, two.RollAt, Eps);
            Assert.AreEqual(one.GroupPopAt / 2, two.GroupPopAt, Eps);
            Assert.AreEqual(one.EndAt / 2, two.EndAt, Eps);

            ClearTimeline won = ClearTimeline.Build(ClearRowSeven(Started(target: 1)).Events, 2f);
            Assert.AreEqual((1.47f + ClearPacing.ResultDelay) / 2, won.ResultAt, Eps);
        }

        [Test]
        public void DefaultOverload_ReadsTheGlobalSpeed()
        {
            StepResult step = ClearRowSeven(Started(Unreachable));
            float saved = ClearPacing.Speed;
            try
            {
                ClearPacing.Speed = 2f;
                Assert.AreEqual(0.67f / 2, ClearTimeline.Build(step.Events).UnlockAt, Eps);
            }
            finally
            {
                ClearPacing.Speed = saved;
            }
        }

        // ---- 助手 ----

        private static RunState Started(long target, int library = 6, int groupSize = 3) =>
            TestRules.Started(TestRules.Config(TestRules.Repeat(library, TetrominoKind.I)), TestRules.Spec(target, groupSize: groupSize));

        /// <summary>两条横 I 补满第 7 行:单线 8 格。</summary>
        private static StepResult ClearRowSeven(RunState run)
        {
            TestRules.Place(run, TetrominoKind.I, 0, 7, 0);
            StepResult step = TestRules.Place(run, TetrominoKind.I, 0, 7, 4);
            ClearResolved clear = step.Single<ClearResolved>();
            CollectionAssert.AreEqual(new[] { 7 }, clear.Rows);
            CollectionAssert.IsEmpty(clear.Cols);
            return step;
        }
    }
}
