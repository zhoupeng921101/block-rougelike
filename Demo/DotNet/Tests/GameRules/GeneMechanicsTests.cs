using System.Linq;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>第二批基因里几条能被单步构造出来的算分/参数口径。</summary>
    public class GeneMechanicsTests
    {
        private static RunState Started(params int[] genes)
        {
            var config = new RuleConfig(TestRules.Repeat(8, TetrominoKind.I, 1), MinimalContent.ClearTypes, MinimalContent.Effects,
                catalog: MinimalContent.Catalog);
            RunState run = RunState.NewRun(TestRules.Seed, config);
            run.StartBlind(new BlindSpec(1, 1, 100000, 3, 3));
            foreach (int id in genes) run.AddGene(id);
            Assert.IsNull(run.Validate());
            return run;
        }

        /// <summary>两块 I 横放在空盘第 7 行补满整行:清屏,8 格。</summary>
        private static StepResult ClearBottomRow(RunState run)
        {
            int[] ids = run.Blind.Tray.Where(s => !s.IsEmpty).Select(s => s.Id).Take(2).ToArray();
            TestRules.Place(run, ids[0], 0, 7, 0);
            return TestRules.Place(run, ids[1], 0, 7, 4);
        }

        [Test]
        public void DoublePoints_Gene_CountsTheBasePointsTwice()
        {
            RunState run = Started(24);
            ScoreBooked booked = ClearBottomRow(run).Single<ScoreBooked>();
            Assert.AreEqual(60 + 8 * 2, booked.Chips);
        }

        [Test]
        public void Transcode_Gene_MovesPointsFromChipsToMult()
        {
            RunState run = Started(26);
            Assert.AreEqual(1, run.Genes.Count);
            Assert.IsNotNull(run.Config.Effects.Find(EffectSource.Gene, 26));
            Assert.IsTrue(run.PointsToMult, "转码开关应当在");
            ScoreBooked booked = ClearBottomRow(run).Single<ScoreBooked>();
            Assert.AreEqual(60, booked.Chips);
            Assert.AreEqual(6000, booked.MultPermille, "基础 4 倍 + 8 点按每 2 点 0.5 倍 = +2");
        }

        [Test]
        public void Credit_Gene_AllowsSpendingDownToTheDebtLimit()
        {
            RunState run = Started(92);
            Assert.IsTrue(run.TrySpend(run.Money + 10), "赊账基因允许花到 −$20");
            Assert.AreEqual(-10, run.Money);
            Assert.IsFalse(run.TrySpend(11), "越过 −$20 不许再花");
        }

        [Test]
        public void Compound_Gene_LowersTheInterestStep()
        {
            RunState run = Started(96);
            Assert.AreEqual(5, run.InterestPer);
        }

        [Test]
        public void Hoard_Gene_DoublesTheInterestCap()
        {
            RunState run = Started(99);
            Assert.AreEqual(2000, run.InterestCapPermille);
        }

        [Test]
        public void CopyBlock_Gene_OnlyCopiesTheFirstPlacementIfItClears()
        {
            RunState run = Started(130);
            int before = run.Library.Count;
            ClearBottomRow(run);
            Assert.AreEqual(1, run.Genes[0].State, "第一次落子没消除,之后就不再复制");
            Assert.AreEqual(before, run.Library.Count);
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void Proliferate_Gene_AddsATemporaryBlockToTheDrawPile()
        {
            RunState run = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            int library = run.Library.Count;
            run.AddGene(126);
            run.StartBlind(TestRules.Spec());
            Assert.AreEqual(library, run.Library.Count, "临时块不进方块库");
            Assert.AreEqual(1, run.Blind.TempBlocks.Count);
            Assert.IsNull(run.Validate());
        }
    }
}
