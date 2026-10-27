using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>局与盲注:开局取号、开盲注洗牌发组、改朝向、按实例的落点查询、深拷贝、区守恒(RunState.Validate)。</summary>
    public class RunStateTests
    {
        private const string Seed = "TESTSEED";

        private static RunState StartedRun(string seed = Seed)
        {
            RunState run = RunState.NewRun(seed, PlaceholderTuning.Config);
            run.StartBlind(PlaceholderTuning.FirstBlind);
            return run;
        }

        private static List<int> DealOrder(RunState run)
        {
            var order = new List<int>();
            foreach (TraySlot slot in run.Blind.Tray)
            {
                if (!slot.IsEmpty) order.Add(slot.Id);
            }
            order.AddRange(run.Blind.Draw);
            return order;
        }

        [Test]
        public void PlaceholderTuning_MatchesTicket11()
        {
            IReadOnlyList<LibraryEntry> lib = PlaceholderTuning.DefaultLibrary;
            Assert.AreEqual(28, lib.Count);
            for (int i = 0; i < lib.Count; i++)
            {
                Assert.AreEqual((TetrominoKind)(i / 4), lib[i].Kind);
                Assert.AreEqual(i % 4 + 1, lib[i].Points);
            }
            BlindSpec spec = PlaceholderTuning.FirstBlind;
            Assert.AreEqual((1, 1, 350L, 3, 3), (spec.Segment, spec.Layer, spec.Target, spec.Discards, spec.GroupSize));
        }

        [Test]
        public void NewRun_IssuesIdsInDefaultListOrder()
        {
            RunState run = RunState.NewRun(Seed, PlaceholderTuning.Config);
            Assert.AreEqual(28, run.Library.Count);
            for (int i = 0; i < run.Library.Count; i++)
            {
                BlockInstance b = run.Library[i];
                Assert.AreEqual(i + 1, b.Id, "计数器从 1 起,按清单顺序取号");
                Assert.AreEqual(PlaceholderTuning.DefaultLibrary[i].Kind, b.Kind);
                Assert.AreEqual(PlaceholderTuning.DefaultLibrary[i].Points, b.Points);
                Assert.AreEqual(Enhancement.None, b.Enhancement);
                Assert.AreEqual(Edition.None, b.Edition);
            }
            Assert.AreEqual(29, run.NextInstanceId);
            Assert.AreEqual(Seed, run.Seed);
            Assert.IsNull(run.Blind);
            Assert.AreEqual(ClearTypes.Count, run.TypeLevels.Count);
            Assert.That(run.TypeLevels, Is.All.EqualTo(1));
            Assert.AreEqual(1, run.LevelOf(ClearType.SingleLine));
            Assert.That(run.Genes, Is.Empty);
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void IssueId_OnlyIncreases()
        {
            RunState run = RunState.NewRun(Seed, TestRules.Config());
            Assert.AreEqual(1, run.NextInstanceId);
            Assert.AreEqual(1, run.IssueId());
            Assert.AreEqual(2, run.IssueId());
            RunState copy = run.Clone();
            Assert.AreEqual(3, run.IssueId());
            Assert.AreEqual(4, run.NextInstanceId);
            Assert.AreEqual(3, copy.IssueId(), "拷贝带着自己的计数器");
            Assert.AreEqual(4, run.IssueId());
        }

        [Test]
        public void StartBlind_ShufflesAscendingIdsWithTheLayerStream_ThenDeals()
        {
            RunState run = StartedRun();

            var expected = Enumerable.Range(1, 28).ToList();
            new RngStreams(Seed).Get(RngKeys.Shuffle(1, 1)).Shuffle(expected);

            BlindState blind = run.Blind;
            CollectionAssert.AreEqual(expected.Take(3), blind.Tray.Select(s => s.Id));
            Assert.That(blind.Tray.Select(s => s.Rot), Is.All.EqualTo(0));
            CollectionAssert.AreEqual(expected.Skip(3), blind.Draw);
            Assert.AreEqual(1, blind.Group);
            Assert.AreEqual(0, blind.Step);
            Assert.AreEqual(0L, blind.Score);
            Assert.AreEqual(0, blind.Combo);
            Assert.AreEqual(3, blind.DiscardsLeft);
            Assert.AreEqual(BlindOutcome.InProgress, blind.Outcome);
            Assert.AreEqual(FailReason.None, blind.FailReason);
            Assert.That(blind.Discarded, Is.Empty);
            Assert.That(blind.Departed, Is.Empty);
            Assert.That(blind.TempBlocks, Is.Empty);
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void SameSeed_SameDrawOrder()
        {
            CollectionAssert.AreEqual(DealOrder(StartedRun()), DealOrder(StartedRun()));
            CollectionAssert.AreNotEqual(DealOrder(StartedRun()), DealOrder(StartedRun(SeedText.FromEntropy(1))));
        }

        [Test]
        public void StartBlind_DealsWhatIsLeft_WhenLibraryIsShort()
        {
            RuleConfig config = TestRules.Config(new LibraryEntry(TetrominoKind.O, 1), new LibraryEntry(TetrominoKind.I, 2));
            RunState run = RunState.NewRun(Seed, config);
            run.StartBlind(PlaceholderTuning.FirstBlind);

            Assert.AreEqual(3, run.Blind.Tray.Count);
            CollectionAssert.AreEquivalent(new[] { 1, 2 }, run.Blind.Tray.Take(2).Select(s => s.Id));
            Assert.IsTrue(run.Blind.Tray[2].IsEmpty);
            Assert.That(run.Blind.Draw, Is.Empty);
            Assert.AreEqual(1, run.Blind.Group);
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void StartBlind_RefusesWhileBlindInProgress()
        {
            RunState run = StartedRun();
            Assert.Throws<InvalidOperationException>(() => run.StartBlind(PlaceholderTuning.FirstBlind));
        }

        [Test]
        public void SetRotation_ChangesOnlyTheSlot()
        {
            RunState run = StartedRun();
            int id = run.Blind.Tray[1].Id;
            string before = Dump(run);

            Assert.IsTrue(run.SetRotation(id, 3));
            Assert.AreEqual(new TraySlot(id, 3), run.Blind.Tray[1]);
            Assert.AreEqual(before.Replace(Inv($"tray[1]={id}@0"), Inv($"tray[1]={id}@3")), Dump(run), "不算步、不碰随机流、不动别的槽");

            Assert.IsFalse(run.SetRotation(id, 4));
            Assert.IsFalse(run.SetRotation(id, -1));
            Assert.IsFalse(run.SetRotation(run.Blind.Draw[0], 1), "不在待放置区");
            Assert.IsFalse(run.SetRotation(0, 1));
            Assert.AreEqual(new TraySlot(id, 3), run.Blind.Tray[1]);
        }

        [Test]
        public void PlacementQueries_AskByInstance_AndRespectDeadCells()
        {
            RuleConfig config = TestRules.Config(new LibraryEntry(TetrominoKind.O, 1), new LibraryEntry(TetrominoKind.I, 1));
            RunState run = RunState.NewRun(Seed, config);
            Assert.IsFalse(run.CanPlace(1, 0, 0, 0), "开盲注前没有盘面");
            run.StartBlind(PlaceholderTuning.FirstBlind);

            Assert.IsTrue(run.CanPlace(1, 0, 0, 0));
            Assert.IsTrue(run.CanPlaceAnyRotation(2));
            Assert.IsFalse(run.CanPlace(99, 0, 0, 0), "不认识的 id");
            Assert.IsFalse(run.CanPlaceAnyRotation(99));

            // 只留左上 2×2 不是死格:O 放得下,I 怎么转都放不下
            var keep = new HashSet<int> { 0, 1, 8, 9 };
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (!keep.Contains(cell)) run.Blind.Board.SetDead(cell);
            }
            Assert.IsTrue(run.CanPlace(1, 0, 0, 0));
            Assert.IsFalse(run.CanPlace(1, 0, 1, 1));
            Assert.IsTrue(run.CanPlaceAnyRotation(1));
            Assert.IsFalse(run.CanPlaceAnyRotation(2));
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void Clone_ChangingTheCopyLeavesTheOriginal()
        {
            RunState run = StartedRun();
            run.SetRotation(run.Blind.Tray[0].Id, 2);
            string before = Dump(run);

            RunState copy = run.Clone();
            Assert.AreEqual(before, Dump(copy));
            Assert.AreSame(run.Config, copy.Config, "规则配置是参数,两边共享");
            Assert.AreNotSame(run.Library[0], copy.Library[0]);

            copy.SetRotation(copy.Blind.Tray[1].Id, 1);
            copy.IssueId();
            copy.Rng.Get(RngKeys.Shuffle(1, 1)).Next(0, 100);
            copy.Rng.Get(RngKeys.Shuffle(1, 2)).Next(0, 100);
            copy.Blind.Board.SetDead(63);
            copy.Blind.Board.Place(copy.FindInstance(copy.Blind.Tray[2].Id), 0, 0, 0);

            Assert.AreNotEqual(before, Dump(copy));
            Assert.AreEqual(before, Dump(run));
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void Validate_CatchesBlockInTwoZones()
        {
            RunState run = StartedRun();
            int id = run.Blind.Draw[0];
            run.Blind.Board.Place(run.FindInstance(id), 0, 0, 0);

            string error = run.Validate();
            StringAssert.Contains(Inv($"实例 {id} 已在 blind.draw"), error);
            StringAssert.StartsWith("blind.owner[", error);
        }

        [Test]
        public void Validate_CatchesForeignIdOnBoard()
        {
            RunState run = StartedRun();
            run.Blind.Board.Place(new BlockInstance(999, TetrominoKind.O, 1, Enhancement.None, Edition.None), 0, 6, 6);
            StringAssert.Contains("实例 999 不在方块库与临时块里", run.Validate());
        }

        [Test]
        public void Views_AreReadOnly()
        {
            RunState run = StartedRun();
            IRunView view = run;
            Assert.Throws<NotSupportedException>(() => ((IList<BlockInstance>)view.Library).Add(null));
            Assert.Throws<NotSupportedException>(() => ((IList<int>)view.Blind.Draw).RemoveAt(0));
            Assert.Throws<NotSupportedException>(() => ((IList<TraySlot>)view.Blind.Tray)[0] = default);
            Assert.Throws<NotSupportedException>(() => ((IList<int>)view.TypeLevels)[0] = 2);
        }

        private static string Inv(FormattableString s) => FormattableString.Invariant(s);

        private static string Dump(RunState run) => TestRules.Dump(run);
    }
}
