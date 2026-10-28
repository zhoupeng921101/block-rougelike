using System;
using System.Collections.Generic;
using GameRules.Sim;
using NUnit.Framework;
using static System.FormattableString;

namespace GameRules.Tests
{
    /// <summary>
    /// 批量回测(18 号票)的几条前提:开阔度表、「目标分不设上限」与出包目标等价、结果不随线程数变、分位数取法。
    /// 胜率本身随占位数值变,这里不断言;门槛对照在 18、11 号票。
    /// </summary>
    public class BacktestTests
    {
        [Test]
        public void Openness_EmptyBoardHas801Placements()
        {
            Assert.AreEqual(801, BoardOpenness.Count(0UL), "七种骨牌 19 个朝向在 8×8 空盘上共 801 个落点(11 号票 §3)");
            Assert.AreEqual(0, BoardOpenness.Count(ulong.MaxValue));
        }

        [Test]
        public void Openness_PieceMaskMatchesWhatTheBoardPlaces()
        {
            var board = new BoardState();
            var block = new BlockInstance(1, TetrominoKind.T, 1, Enhancement.None, Edition.None);
            ulong expected = 0UL;
            foreach (int cell in board.Place(block, 1, 2, 3)) expected |= BoardCells.BoardMaskBit(cell);
            Assert.AreEqual(expected, BoardOpenness.PieceMask(TetrominoKind.T, 1, 2, 3));
            Assert.AreEqual(expected, BoardOpenness.Blocking(board));
            Assert.AreEqual(0UL, BoardOpenness.PieceMask(TetrominoKind.I, 0, 0, 7), "出界的落点记 0");
        }

        /// <summary>
        /// 同一种子、同一策略,打出包的盲注(目标 350)与打不设上限的盲注:赢了的话,批量那一局恰好在同一步第一次到目标、累计分相同;
        /// 输了的话,两局的结局、步数、终局分全同。只对不读目标分的策略成立;整组规划会抢组内看得到的胜,不在这里(见 <see cref="PlanPolicy"/>)。
        /// </summary>
        [TestCase(SimPolicies.Greedy, 8)]
        [TestCase(SimPolicies.Random, 8)]
        [TestCase(SimPolicies.OneStep, 4)]
        public void EndlessBlind_AgreesWithTheShippedTarget(string policy, int seedCount)
        {
            long target = PlaceholderTuning.FirstBlind.Target;
            foreach (string seed in BatchRunner.Seeds(1, seedCount))
            {
                BatchGame endless = BatchRunner.Play(seed, SimPolicies.Create(policy, seed));

                ISimPolicy p = SimPolicies.Create(policy, seed);
                RunState run = SimGame.NewRun(seed);
                run.StartBlind(PlaceholderTuning.FirstBlind);
                while (run.Blind.Outcome == BlindOutcome.InProgress) SimGame.PlayStep(run, p, null);

                string where = Invariant($"种子 {seed}、策略 {policy}");
                if (run.Blind.Outcome == BlindOutcome.Won)
                {
                    Assert.AreEqual(run.Blind.Step, endless.StepsToReach(target), where + ":达标那一步");
                    Assert.AreEqual(run.Blind.Score, endless.ScoreAfterStep[run.Blind.Step - 1], where + ":达标时的累计分");
                }
                else
                {
                    Assert.AreEqual(-1, endless.StepsToReach(target), where + ":出包那局输了,批量那局却到过目标");
                    Assert.AreEqual(run.Blind.FailReason, endless.End, where + ":结局");
                    Assert.AreEqual(run.Blind.Step, endless.Steps, where + ":步数");
                    Assert.AreEqual(run.Blind.Score, endless.Score, where + ":终局分");
                }
            }
        }

        /// <summary>
        /// 整组规划打出包的盲注:每步都被规则核心接受、走到结局(<see cref="SimGame.PlayStep"/> 碰到被拒或超步数上限就抛),
        /// 而且不会比打不设上限的那一局更晚到目标——它抢组内看得到的胜,不抢的话会绕开能赢的序列。一局一两百毫秒,只跑一个种子。
        /// </summary>
        [TestCase(SimPolicies.Plan)]
        [TestCase(SimPolicies.Plan6)]
        public void Plan_PlaysTheShippedBlindAndTakesAVisibleWin(string policy)
        {
            string seed = BatchRunner.Seeds(1, 1)[0];
            long target = PlaceholderTuning.FirstBlind.Target;
            ISimPolicy p = SimPolicies.Create(policy, seed);
            RunState run = SimGame.NewRun(seed);
            run.StartBlind(PlaceholderTuning.FirstBlind);
            while (run.Blind.Outcome == BlindOutcome.InProgress) SimGame.PlayStep(run, p, null);

            int endless = BatchRunner.Play(seed, SimPolicies.Create(policy, seed)).StepsToReach(target);
            Assume.That(endless, Is.GreaterThan(0), "这个种子在批量模式里没到目标,比不了");
            Assert.AreEqual(BlindOutcome.Won, run.Blind.Outcome, Invariant($"种子 {seed}、策略 {policy}:批量模式第 {endless} 步就到了目标"));
            Assert.LessOrEqual(run.Blind.Step, endless, Invariant($"种子 {seed}、策略 {policy}:达标那一步"));
        }

        [TestCase(SimPolicies.Greedy)]
        [TestCase(SimPolicies.Random)]
        [TestCase(SimPolicies.OneStep)]
        public void Batch_IsTheSameAtAnyParallelism(string policy)
        {
            string[] seeds = BatchRunner.Seeds(1, 8);
            BatchGame[] serial = BatchRunner.Run(seeds, policy, 1);
            BatchGame[] parallel = BatchRunner.Run(seeds, policy, 4);
            for (int i = 0; i < seeds.Length; i++)
            {
                Assert.AreEqual(serial[i].Seed, parallel[i].Seed);
                Assert.AreEqual(serial[i].End, parallel[i].End, seeds[i]);
                CollectionAssert.AreEqual(serial[i].ScoreAfterStep, parallel[i].ScoreAfterStep, seeds[i]);
                Assert.AreEqual(serial[i].Discards, parallel[i].Discards, seeds[i]);
                CollectionAssert.AreEqual(serial[i].Clears, parallel[i].Clears, seeds[i]);
            }
            long[] targets = { 325, 350 };
            Assert.AreEqual(
                BatchReport.Write(new[] { new PolicyBatch(policy, serial, TimeSpan.Zero) }, targets, "s", 1, TimeSpan.Zero),
                BatchReport.Write(new[] { new PolicyBatch(policy, parallel, TimeSpan.Zero) }, targets, "s", 1, TimeSpan.Zero));
        }

        [Test]
        public void Quantile_IsNearestRank()
        {
            var sorted = new List<long> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
            Assert.AreEqual(1, BatchReport.Quantile(sorted, 0.10));
            Assert.AreEqual(5, BatchReport.Quantile(sorted, 0.50));
            Assert.AreEqual(9, BatchReport.Quantile(sorted, 0.90));
            Assert.AreEqual(10, BatchReport.Quantile(sorted, 1.0));
            Assert.AreEqual(7, BatchReport.Quantile(new List<long> { 7 }, 0.10));
        }
    }
}
