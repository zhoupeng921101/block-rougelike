using System;
using System.Collections.Generic;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>首领的负面效果(设计稿 §7.2):候选分配、规格修正、开局效果、增殖与偏航,以及进档。</summary>
    public class BossTests
    {
        private static RunState Run(RuleConfig config) => RunState.NewRun(TestRules.Seed, config);

        /// <summary>一路结算到第 <paramref name="segment"/> 段的首领并停在那里(不结算首领)。</summary>
        private static MapNode ToBoss(RunState run, int segment)
        {
            for (int s = 1; s <= segment; s++)
            {
                for (int layer = 1; layer <= RunMap.LayersPerSegment; layer++)
                {
                    IReadOnlyList<MapNode> choices = run.Progress.Choices(run.Map);
                    Assert.IsNotEmpty(choices, $"段 {s} 层 {layer} 没有可进的节点");
                    Assert.IsTrue(run.EnterNode(choices[0].Id));
                    if (s == segment && layer == RunMap.LayersPerSegment) return run.Map.Get(run.Progress.CurrentNodeId);
                    Assert.IsTrue(run.Progress.Resolve(), "测试直接把这一场记为已结算");
                }
            }
            Assert.Fail("没走到首领");
            return default;
        }

        [Test]
        public void Candidates_CoverAllEightBosses()
        {
            var seen = new HashSet<int>();
            for (int segment = 1; segment <= RunMap.DefaultSegments; segment++)
            {
                int[] candidates = Bosses.CandidatesOf(segment);
                Assert.IsNotEmpty(candidates, $"段 {segment} 应有首领候选");
                foreach (int boss in candidates)
                {
                    Assert.IsTrue(Bosses.IsKnown(boss), "候选里是登记过的首领");
                    seen.Add(boss);
                }
            }
            Assert.AreEqual(8, seen.Count, "8 个首领都要能出现");
        }

        [Test]
        public void Pick_StaysInsideThatSegmentsCandidates()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(4, TetrominoKind.I));
            RunState run = Run(config);
            for (int segment = 1; segment <= run.Map.SegmentCount; segment++)
            {
                foreach (MapNode node in run.Map.NodesAt(segment, RunMap.LayersPerSegment))
                {
                    CollectionAssert.Contains(Bosses.CandidatesOf(segment), node.BossId, $"段 {segment} 的首领");
                }
            }
            Assert.IsNull(run.Map.Validate());
        }

        [Test]
        public void Adjustments_MatchDesign()
        {
            Assert.AreEqual(1000, Bosses.TargetPermille(Bosses.Shrink));
            Assert.AreEqual(1300, Bosses.TargetPermille(Bosses.HighWall));
            Assert.AreEqual(3, Bosses.GroupSize(3, Bosses.HighWall));
            Assert.AreEqual(2, Bosses.GroupSize(5, Bosses.Shatter), "券加到 5 也被压回 2");
            Assert.AreEqual(2, Bosses.GroupSize(3, Bosses.Shatter));
            Assert.AreEqual(0, Bosses.Discards(3, Bosses.NoDiscard));
            Assert.AreEqual(3, Bosses.Discards(3, Bosses.Preset));
        }

        [Test]
        public void BossOnlyOnTheThirdLayer()
        {
            Assert.Throws<ArgumentOutOfRangeException>(() => new BlindSpec(1, 1, 350, 3, 3, Bosses.Preset));
            Assert.Throws<ArgumentOutOfRangeException>(() => new BlindSpec(1, 3, 350, 3, 3, 99));
            Assert.AreEqual(Bosses.Yaw, new BlindSpec(1, 3, 350, 3, 3, Bosses.Yaw).BossId);
        }

        [Test]
        public void SpecForCurrentNode_CarriesBossAndItsAdjustments()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(4, TetrominoKind.I));
            RunState run = Run(config);
            MapNode boss = ToBoss(run, 2);
            BlindSpec spec = run.SpecForCurrentNode();
            Assert.AreEqual(boss.BossId, spec.BossId);
            Assert.AreEqual(boss.BossId, run.CurrentBoss);
            int extra = Bosses.TargetPermille(boss.BossId);
            Assert.AreEqual(RunTargets.For(boss, RunDifficulty.Standard, config, extra), spec.Target, "首领的目标分修正只折一次");
            Assert.AreEqual(Bosses.GroupSize(3, boss.BossId), spec.GroupSize);
            Assert.AreEqual(Bosses.Discards(3, boss.BossId), spec.Discards);
        }

        [Test]
        public void Preset_PlacesSixBlocksOnTheBoard()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(8, TetrominoKind.I));
            RunState run = Run(config);
            run.StartBlind(new BlindSpec(1, 3, 9999, 3, 3, Bosses.Preset));
            Assert.AreEqual(Bosses.PresetBlocks, run.Blind.TempBlocks.Count, "开局预置 6 块");
            int occupied = 0;
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (run.Blind.Board.IsOccupied(cell)) occupied++;
            }
            Assert.AreEqual(Bosses.PresetBlocks * Tetromino.CellCount, occupied);
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void Shrink_TakesFourBlocksOutOfTheDraw()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(8, TetrominoKind.I));
            RunState run = Run(config);
            int total = run.Library.Count;
            run.StartBlind(new BlindSpec(1, 3, 9999, 3, 3, Bosses.Shrink));
            Assert.AreEqual(Bosses.ShrinkBlocks, run.Blind.Removed.Count, "拿掉 4 块");
            int inTray = run.Blind.Tray.Count - CountEmpty(run);
            Assert.AreEqual(total, run.Blind.Draw.Count + run.Blind.Removed.Count + inTray, "三处加起来还是整库");
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void DeadCells_MarksFiveCells()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(8, TetrominoKind.I));
            RunState run = Run(config);
            run.StartBlind(new BlindSpec(1, 3, 9999, 3, 3, Bosses.DeadCells));
            int dead = 0;
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (run.Blind.Board.IsDead(cell)) dead++;
            }
            Assert.AreEqual(Bosses.DeadCellCount, dead);
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void Spawn_AddsABlockOnEveryDeal()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(24, TetrominoKind.I));
            RunState run = Run(config);
            run.StartBlind(new BlindSpec(1, 3, 99999, 6, 3, Bosses.Spawn));
            Assert.AreEqual(1, run.Blind.TempBlocks.Count, "发第一组时补一块");
            for (int i = 0; i < 3; i++) TestRules.Discard(run, FirstInTray(run));
            Assert.AreEqual(2, run.Blind.TempBlocks.Count, "发第二组时再补一块");
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void Yaw_RotatesTheBoardEveryFourSteps()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(40, TetrominoKind.I));
            RunState run = Run(config);
            run.StartBlind(new BlindSpec(1, 3, 999999, 3, 3, Bosses.Yaw));
            int id = run.Blind.Tray[0].Id;
            TestRules.Place(run, id, 0, 7, 0);
            Assert.AreEqual(id, run.Blind.Board.OwnerAt(BoardCells.Index(7, 0)));
            for (int i = 0; i < 3; i++) TestRules.Discard(run, FirstInTray(run));
            Assert.AreEqual(4, run.Blind.Step);
            Assert.AreEqual(0, run.Blind.Board.OwnerAt(BoardCells.Index(7, 0)), "第 4 步之后盘面已转");
            for (int row = 0; row < Tetromino.CellCount; row++)
            {
                Assert.AreEqual(id, run.Blind.Board.OwnerAt(BoardCells.Index(row, 0)), $"转后落在第 0 列的 {row} 行");
            }
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void Snapshot_RoundTripsABossBlind()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(8, TetrominoKind.I));
            RunState run = Run(config);
            run.StartBlind(new BlindSpec(1, 3, 9999, 3, 3, Bosses.Preset));
            string text = RunSnapshot.Write(run);
            SnapshotReadResult read = RunSnapshot.Read(text, config);
            Assert.IsTrue(read.Ok, "读回失败:" + read.Error + " @" + read.Path);
            Assert.AreEqual(Bosses.Preset, read.State.Blind.Spec.BossId);
            Assert.AreEqual(run.Blind.TempBlocks.Count, read.State.Blind.TempBlocks.Count);
            Assert.AreEqual(text, RunSnapshot.Write(read.State));
        }

        private static int FirstInTray(RunState run)
        {
            foreach (TraySlot slot in run.Blind.Tray)
            {
                if (!slot.IsEmpty) return slot.Id;
            }
            Assert.Fail("待放置区是空的");
            return 0;
        }

        private static int CountEmpty(RunState run)
        {
            int empty = 0;
            foreach (TraySlot slot in run.Blind.Tray)
            {
                if (slot.IsEmpty) empty++;
            }
            return empty;
        }
    }
}
