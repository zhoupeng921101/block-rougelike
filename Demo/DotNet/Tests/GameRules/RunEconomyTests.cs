using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>局外经济:目标分曲线、难度修正、利息封顶、结算入账与地图进度的推进(设计稿 §1、§3、§5)。</summary>
    public class RunEconomyTests
    {
        [Test]
        public void BaseTargets_FollowTheCurve()
        {
            RuleConfig config = PlaceholderTuning.Config;
            int[] expected = { 350, 805, 1852, 4260, 9798, 22535 };
            for (int segment = 1; segment <= expected.Length; segment++)
            {
                Assert.AreEqual(expected[segment - 1], RunTargets.BaseFor(segment, config), $"第 {segment} 段");
            }
        }

        [Test]
        public void Targets_CombineLayerStrengthAndDifficulty()
        {
            RuleConfig config = PlaceholderTuning.Config;
            Assert.AreEqual(350, RunTargets.For(new MapNode(1, 1, 1, NodeStrength.Normal), RunDifficulty.Standard, config));
            Assert.AreEqual(315, RunTargets.For(new MapNode(1, 1, 1, NodeStrength.Light), RunDifficulty.Standard, config));
            Assert.AreEqual(385, RunTargets.For(new MapNode(1, 1, 1, NodeStrength.Heavy), RunDifficulty.Standard, config));
            Assert.AreEqual(525, RunTargets.For(new MapNode(1, 1, 2, NodeStrength.Normal), RunDifficulty.Standard, config));
            Assert.AreEqual(735, RunTargets.For(new MapNode(1, 1, 3, NodeStrength.Boss), RunDifficulty.Standard, config));
            Assert.AreEqual(403, RunTargets.For(new MapNode(1, 1, 1, NodeStrength.Normal), RunDifficulty.Advanced, config));
            Assert.AreEqual(455, RunTargets.For(new MapNode(1, 1, 1, NodeStrength.Normal), RunDifficulty.Expert, config));
        }

        [Test]
        public void DifficultyRules_MatchDesign()
        {
            DifficultyRules standard = DifficultyRules.Of(RunDifficulty.Standard);
            Assert.AreEqual((1000, 0, 50, 1000), (standard.TargetPermille, standard.DiscardDelta, standard.InterestCap, standard.PricePermille));
            DifficultyRules advanced = DifficultyRules.Of(RunDifficulty.Advanced);
            Assert.AreEqual((1150, -1, 50, 1000), (advanced.TargetPermille, advanced.DiscardDelta, advanced.InterestCap, advanced.PricePermille));
            DifficultyRules expert = DifficultyRules.Of(RunDifficulty.Expert);
            Assert.AreEqual((1300, -1, 25, 1200), (expert.TargetPermille, expert.DiscardDelta, expert.InterestCap, expert.PricePermille));
        }

        [Test]
        public void Interest_CapsAtHoldingCap()
        {
            RuleConfig config = PlaceholderTuning.Config;
            Assert.AreEqual(0, RunEconomy.InterestOf(0, RunDifficulty.Standard, config));
            Assert.AreEqual(0, RunEconomy.InterestOf(9, RunDifficulty.Standard, config));
            Assert.AreEqual(1, RunEconomy.InterestOf(10, RunDifficulty.Standard, config));
            Assert.AreEqual(4, RunEconomy.InterestOf(49, RunDifficulty.Standard, config));
            Assert.AreEqual(5, RunEconomy.InterestOf(50, RunDifficulty.Standard, config));
            Assert.AreEqual(5, RunEconomy.InterestOf(1000, RunDifficulty.Standard, config), "封顶持有额之外的钱不计息");
            Assert.AreEqual(2, RunEconomy.InterestOf(1000, RunDifficulty.Expert, config), "专家档封顶 $25");
        }

        [Test]
        public void SpecForCurrentNode_UsesNodeAndDifficulty()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(2, TetrominoKind.I));
            RunState standard = RunState.NewRun(TestRules.Seed, config);
            Assert.IsTrue(standard.EnterNode(standard.Map.Start.Id));
            BlindSpec spec = standard.SpecForCurrentNode();
            Assert.AreEqual((1, 1, 350, 3, 3), (spec.Segment, spec.Layer, (int)spec.Target, spec.Discards, spec.GroupSize));

            RunState expert = RunState.NewRun(TestRules.Seed, config, RunDifficulty.Expert);
            Assert.IsTrue(expert.EnterNode(expert.Map.Start.Id));
            BlindSpec expertSpec = expert.SpecForCurrentNode();
            Assert.AreEqual((455, 2), ((int)expertSpec.Target, expertSpec.Discards), "专家档目标 +30%、弃置 −1");
        }

        [Test]
        public void SettleBlind_AwardsRewardAndInterest_AndResolvesNode()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(2, TetrominoKind.I));
            RunState run = RunState.NewRun(TestRules.Seed, config);
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            run.StartBlind(new BlindSpec(1, 1, 272, 3, 3));
            TestRules.Place(run, run.Blind.Tray[0].Id, 0, 7, 0);
            TestRules.Place(run, TetrominoKind.I, 0, 7, 4);
            Assert.AreEqual(BlindOutcome.Won, run.Blind.Outcome);

            Settlement settlement = run.SettleBlind();
            Assert.AreEqual(run.Map.Start.Id, settlement.NodeId);
            Assert.AreEqual(4, settlement.Reward, "中档普通节点的通关奖励");
            Assert.AreEqual(0, settlement.Interest, "起始 $4 不到 $10,没有利息");
            Assert.AreEqual(4, settlement.Total);
            Assert.AreEqual(8, settlement.MoneyAfter);
            Assert.AreEqual(8, run.Money);
            Assert.IsTrue(run.Progress.CurrentResolved);
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void SettleBlind_CountsInterestOnHeldMoney()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(2, TetrominoKind.I));
            RunState run = RunState.NewRun(TestRules.Seed, config);
            run.AddMoney(46);
            Assert.AreEqual(50, run.Money);
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            run.StartBlind(new BlindSpec(1, 1, 272, 3, 3));
            TestRules.Place(run, run.Blind.Tray[0].Id, 0, 7, 0);
            TestRules.Place(run, TetrominoKind.I, 0, 7, 4);

            Settlement settlement = run.SettleBlind();
            Assert.AreEqual(5, settlement.Interest, "持有 $50 吃满 $5 利息");
            Assert.AreEqual(9, settlement.Total);
            Assert.AreEqual(59, run.Money);
        }

        [Test]
        public void SettleBlind_RejectsUnfinishedOrUnentered()
        {
            RuleConfig config = TestRules.Config(TestRules.Repeat(2, TetrominoKind.I));
            RunState run = RunState.NewRun(TestRules.Seed, config);
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            run.StartBlind(new BlindSpec(1, 1, 272, 3, 3));
            Assert.Throws<System.InvalidOperationException>(() => run.SettleBlind(), "盲注还在进行,不能结算");

            RunState noNode = RunState.NewRun(TestRules.Seed, config);
            noNode.StartBlind(new BlindSpec(1, 1, 272, 3, 3));
            TestRules.Place(noNode, noNode.Blind.Tray[0].Id, 0, 7, 0);
            TestRules.Place(noNode, TetrominoKind.I, 0, 7, 4);
            Assert.AreEqual(BlindOutcome.Won, noNode.Blind.Outcome);
            Assert.Throws<System.InvalidOperationException>(() => noNode.SettleBlind(), "没进节点就没有可结算的地图进度");
        }
    }
}
