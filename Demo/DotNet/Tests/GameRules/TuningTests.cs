using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>数值表(阶段 5 的 tuning.json)真的驱动规则:目标分曲线、单场奖励、商店格数与难度档都从 <see cref="RunTuning"/> 取。</summary>
    public class TuningTests
    {
        private static RuleConfig Config(RunTuning tuning) => new RuleConfig(
            new[] { new LibraryEntry(TetrominoKind.I, 1), new LibraryEntry(TetrominoKind.I, 1) },
            MinimalContent.ClearTypes, MinimalContent.Effects, MinimalContent.Catalog, tuning);

        [Test]
        public void Defaults_MatchTheShippedNumbers()
        {
            RunTuning tuning = RunTuning.Default;
            Assert.IsNull(tuning.Validate());
            Assert.AreEqual(350, tuning.FirstTarget);
            Assert.AreEqual(2300, tuning.SegmentTargetPermille);
            Assert.AreEqual(4, tuning.GoodsCount);
            Assert.AreEqual(1300, tuning.HighWallPermille);
        }

        [Test]
        public void TargetsFollowTheTable()
        {
            var tuning = new RunTuning { FirstTarget = 100, SegmentTargetPermille = 2000, MapSegments = 6 };
            RuleConfig config = Config(tuning);
            Assert.AreEqual(100, RunTargets.BaseFor(1, config));
            Assert.AreEqual(200, RunTargets.BaseFor(2, config));
            Assert.AreEqual(400, RunTargets.BaseFor(3, config));
        }

        [Test]
        public void RewardsComeFromTheTable()
        {
            var tuning = new RunTuning { RewardNormal = 9, RewardBoss = 11 };
            RuleConfig config = Config(tuning);
            var normal = new MapNode(1, 1, 1, NodeStrength.Normal);
            var boss = new MapNode(2, 1, 3, NodeStrength.Boss, 0, Bosses.Shrink);
            Assert.AreEqual(9, config.Tuning.NodeReward(normal));
            Assert.AreEqual(11, config.Tuning.NodeReward(boss));
        }

        [Test]
        public void ShopGoodsCountFollowsTheTable()
        {
            var tuning = new RunTuning { GoodsCount = 2 };
            RuleConfig config = Config(tuning);
            RunState run = RunState.NewRun(TestRules.Seed, config);
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            run.StartBlind(new BlindSpec(1, 1, 272, 3, 3));
            TestRules.Place(run, run.Blind.Tray[0].Id, 0, 7, 0);
            TestRules.Place(run, TetrominoKind.I, 0, 7, 4);
            run.SettleBlind();
            ShopState shop = run.OpenShop();
            Assert.AreEqual(2, shop.Count);
        }

        [Test]
        public void DifficultyRowsComeFromTheTable()
        {
            var tuning = new RunTuning
            {
                Expert = new DifficultyTuning(2000, -2, 10, 1500),
            };
            Assert.AreEqual(2000, tuning.DifficultyOf(RunDifficulty.Expert).TargetPermille);
            Assert.AreEqual(-2, tuning.DifficultyOf(RunDifficulty.Expert).DiscardDelta);
            Assert.AreEqual(1000, tuning.DifficultyOf(RunDifficulty.Standard).TargetPermille);
        }
    }
}
