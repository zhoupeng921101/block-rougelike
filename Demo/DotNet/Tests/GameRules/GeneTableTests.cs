using System;
using System.Linq;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>基因清单第一批:模板基因的条件与产出、三种代价、B 类重算、盲注开始 / 结束挂点、盲注内新状态的存档往返。</summary>
    public class GeneTableTests
    {
        private static RuleConfig ConfigOf(params LibraryEntry[] library) =>
            new RuleConfig(library, MinimalContent.ClearTypes, MinimalContent.Effects, catalog: MinimalContent.Catalog);

        private static RunState Started(RuleConfig config, params int[] genes)
        {
            RunState run = RunState.NewRun(TestRules.Seed, config);
            run.StartBlind(new BlindSpec(1, 1, 100000, 3, 3));
            // 开盲注之后才加:带死格代价的基因(极连)不在这几张测试盘上标死格
            foreach (int g in genes) run.AddGene(g);
            Assert.IsNull(run.Validate());
            return run;
        }

        /// <summary>两块 I 横放在空盘第 7 行,第二块补满整行:清屏,8 格,底注 60 × 4。</summary>
        private static StepResult ClearBottomRow(RunState run)
        {
            int[] ids = run.Blind.Tray.Where(s => !s.IsEmpty).Select(s => s.Id).Take(2).ToArray();
            TestRules.Place(run, ids[0], 0, 7, 0);
            return TestRules.Place(run, ids[1], 0, 7, 4);
        }

        private static int DeadCount(RunState run) => Enumerable.Range(0, BoardCells.Count).Count(c => run.Blind.Board.IsDead(c));

        [Test]
        public void Table_EveryEntryIsRegisteredInCatalogAndPricedInItsBand()
        {
            CollectionAssert.AllItemsAreUnique(GeneTable.All.Select(e => e.Id));
            CollectionAssert.AreEqual(GeneTable.All.Select(e => e.Id), MinimalContent.Catalog.Genes.Select(e => e.Id));
            foreach (GeneTable.Entry e in GeneTable.All)
            {
                Assert.IsNotNull(MinimalContent.Effects.Find(EffectSource.Gene, e.Id), "基因 " + e.Id);
                (int lo, int hi) = e.Rarity == Rarity.Common ? (4, 5) : e.Rarity == Rarity.Uncommon ? (6, 7) : e.Rarity == Rarity.Rare ? (8, 10) : (20, 20);
                // 赊账(G092)照原作定价 $2:它本身不出分,在价格带外是有意的(基因清单 §2.8)
                if (e.Id == 92) (lo, hi) = (2, 2);
                Assert.That(e.Price, Is.InRange(lo, hi), "基因 " + e.Id + " 的价不在价格带里(局外循环 §4.3)");
            }
        }

        [Test]
        public void CellGene_AddsPerClearedCellOfTheShape()
        {
            RunState run = Started(ConfigOf(TestRules.Repeat(6, TetrominoKind.I)), 1); // 直脊:每格 I +1 倍率
            ScoreBooked booked = ClearBottomRow(run).Single<ScoreBooked>();
            Assert.AreEqual((68L, 12000L, 816L), (booked.Chips, booked.MultPermille, booked.Gain));
        }

        [Test]
        public void FractionalMult_IsKeptInPermille()
        {
            RunState run = Started(ConfigOf(TestRules.Repeat(6, TetrominoKind.I, 2)), 18); // 偶数:每格 +0.5 倍率
            ScoreBooked booked = ClearBottomRow(run).Single<ScoreBooked>();
            Assert.AreEqual((76L, 8000L, 608L), (booked.Chips, booked.MultPermille, booked.Gain));
        }

        [Test]
        public void PlacedBlockGene_CountsOnlyTheBlockJustPlaced()
        {
            RunState run = Started(ConfigOf(TestRules.Repeat(6, TetrominoKind.I)), 30); // 落点:放下那块的每格 +1 倍率
            ScoreBooked booked = ClearBottomRow(run).Single<ScoreBooked>();
            Assert.AreEqual(8000L, booked.MultPermille, "第二块的 4 格");
        }

        [Test]
        public void SingleLineGene_MultipliesSingleLines()
        {
            RunState run = Started(ConfigOf(TestRules.Repeat(6, TetrominoKind.I)), 48); // 一线:线数为 1 时 ×2
            Assert.AreEqual(68L * 8, ClearBottomRow(run).Single<ScoreBooked>().Gain);
        }

        [Test]
        public void LinearXMult_ScalesWithCombo()
        {
            RunState run = Started(ConfigOf(TestRules.Repeat(6, TetrominoKind.I)), 64); // 极连:×(1 + 0.2 × 连击)
            Assert.AreEqual(4800L, ClearBottomRow(run).Single<ScoreBooked>().MultPermille);
        }

        [Test]
        public void BlindState_RecordsPlacedKindsTypeCountsAndLastClear()
        {
            RunState run = Started(ConfigOf(TestRules.Repeat(6, TetrominoKind.I)), 7); // 收集:每种放过的形状 +2
            Assert.AreEqual(-1, run.Blind.LastClearType);
            ScoreBooked booked = ClearBottomRow(run).Single<ScoreBooked>();
            Assert.AreEqual(6000L, booked.MultPermille);
            Assert.AreEqual(1 << (int)TetrominoKind.I, run.Blind.PlacedKinds);
            Assert.AreEqual(1, run.Blind.TypeCounts[(int)ClearType.AllClear]);
            Assert.AreEqual((int)ClearType.AllClear, run.Blind.LastClearType);
        }

        [Test]
        public void Snapshot_MidBlind_KeepsTheNewBlindStateAndTheScore()
        {
            RunState straight = Started(ConfigOf(TestRules.Repeat(6, TetrominoKind.I)), 7, 52);
            RunState saved = Started(ConfigOf(TestRules.Repeat(6, TetrominoKind.I)), 7, 52);
            int first = saved.Blind.Tray[0].Id;
            TestRules.Place(straight, first, 0, 7, 0);
            TestRules.Place(saved, first, 0, 7, 0);

            string text = RunSnapshot.Write(saved);
            SnapshotReadResult read = RunSnapshot.Read(text, saved.Config);
            Assert.IsTrue(read.Ok, read.Detail);
            Assert.AreEqual(text, RunSnapshot.Write(read.State));
            RunState resumed = read.State;
            Assert.AreEqual(saved.Blind.PlacedKinds, resumed.Blind.PlacedKinds);

            int second = straight.Blind.Tray.First(s => !s.IsEmpty).Id;
            long a = TestRules.Place(straight, second, 0, 7, 4).Single<ScoreBooked>().Gain;
            long b = TestRules.Place(resumed, second, 0, 7, 4).Single<ScoreBooked>().Gain;
            Assert.AreEqual(a, b, "读档续玩与不存档给分一致");
            Assert.AreEqual(RunSnapshot.Write(straight), RunSnapshot.Write(resumed));
        }

        [Test]
        public void SameSeedSameMoves_SameEventsAndState()
        {
            string Play()
            {
                RunState run = Started(ConfigOf(TestRules.Repeat(9, TetrominoKind.I, 3)), 1, 64, 81, 103);
                StepResult step = ClearBottomRow(run);
                return string.Join("|", step.Events.Select(e => e.ToString())) + RunSnapshot.Write(run);
            }

            Assert.AreEqual(Play(), Play());
        }

        [Test]
        public void DiscardCost_LowersDiscardsEachBlind_FlooredAtZero()
        {
            RunState plain = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            RunState paid = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            paid.AddGene(73); // 清场:弃置 −1
            foreach (RunState run in new[] { plain, paid }) Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            int base_ = plain.SpecForCurrentNode().Discards;
            Assert.AreEqual(base_ - 1, paid.SpecForCurrentNode().Discards);
            for (int i = 0; i < base_ + 2; i++) paid.AddGene(73);
            Assert.AreEqual(0, paid.SpecForCurrentNode().Discards, "不低于 0");
        }

        [Test]
        public void GroupSizeModifier_IsClampedToAtLeastOne()
        {
            var effects = new EffectRegistry().Register(EffectSource.Gene, 1, new Modifier(groupSize: -10));
            RunState run = RunState.NewRun(TestRules.Seed, TestRules.Config(effects, TestRules.Repeat(4, TetrominoKind.I)));
            run.AddGene(1);
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            Assert.AreEqual(1, run.SpecForCurrentNode().GroupSize);
        }

        [Test]
        public void DeadCellCost_MarksCellsAtBlindStart_WithoutOverlappingTheBoss()
        {
            RunState run = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            run.AddGene(64); // 极连:每个盲注开始 2 格死格
            run.StartBlind(new BlindSpec(1, 1, 100000, 3, 3));
            Assert.AreEqual(2, DeadCount(run));
            Assert.IsNull(run.Validate());

            RunState boss = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            boss.AddGene(64);
            boss.StartBlind(new BlindSpec(1, 3, 100000, 3, 3, Bosses.DeadCells));
            Assert.AreEqual(boss.Config.Tuning.DeadCellCount + 2, DeadCount(boss), "死格不重叠,首领与代价各标各的");
        }

        [Test]
        public void BlindHooks_RunAtStartAndOnWin_AndBlindEndMoneyIsReported()
        {
            var effects = new EffectRegistry().Register(EffectSource.Gene, 1, new Hooked());
            RunState run = RunState.NewRun(TestRules.Seed, TestRules.Config(effects, TestRules.Repeat(2, TetrominoKind.I)));
            run.AddGene(1);
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            run.StartBlind(new BlindSpec(1, 1, 1, 3, 3));
            Assert.AreEqual(1, run.Genes[0].Counter, "盲注开始问过一次");
            TestRules.Place(run, run.Blind.Tray[0].Id, 0, 7, 0);
            TestRules.Place(run, TetrominoKind.I, 0, 7, 4);
            Assert.AreEqual(BlindOutcome.Won, run.Blind.Outcome);

            int before = run.Money;
            Settlement s = run.SettleBlind();
            Assert.AreEqual(3, s.GeneMoney);
            Assert.AreEqual(before + s.Total + 3, s.MoneyAfter);
            Assert.AreEqual(s.MoneyAfter, run.Money);
            Assert.AreEqual(2, run.Genes[0].Counter, "盲注结束问过一次");
        }

        [Test]
        public void BlindStart_CannotGiveMoney()
        {
            var effects = new EffectRegistry().Register(EffectSource.Gene, 1, new PaysAtStart());
            RunState run = RunState.NewRun(TestRules.Seed, TestRules.Config(effects, TestRules.Repeat(2, TetrominoKind.I)));
            run.AddGene(1);
            Assert.Throws<InvalidOperationException>(() => run.StartBlind(new BlindSpec(1, 1, 1, 3, 3)));
        }

        private sealed class Modifier : RuleEffect
        {
            private readonly int _groupSize;

            public Modifier(int groupSize)
            {
                _groupSize = groupSize;
            }

            public override int GroupSizeDelta => _groupSize;
        }

        private sealed class Hooked : RuleEffect
        {
            public override void OnBlindStart(EffectContext ctx) => ctx.AddCounter(1);

            public override void OnBlindEnd(EffectContext ctx)
            {
                ctx.AddCounter(1);
                ctx.GainMoney(3);
            }
        }

        private sealed class PaysAtStart : RuleEffect
        {
            public override void OnBlindStart(EffectContext ctx) => ctx.GainMoney(1);
        }
    }
}
