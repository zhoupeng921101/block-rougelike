using System;
using System.Collections.Generic;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>跳过节点换标签:只能跳普通节点、四种标签的效果落进这一局、跳过的节点不进商店、跳过状态进存档(设计稿 §2.3、§7.1)。</summary>
    public class TagTests
    {
        private static RuleConfig Config() => new RuleConfig(
            new[] { new LibraryEntry(TetrominoKind.I, 1), new LibraryEntry(TetrominoKind.I, 1) },
            MinimalContent.ClearTypes, MinimalContent.Effects, catalog: MinimalContent.Catalog);

        private static RunState NewRun() => RunState.NewRun(TestRules.Seed, Config());

        /// <summary>用两块 I 清掉第 7 行,目标 272 正好达标。</summary>
        private static void WinNode(RunState run, MapNode node)
        {
            Assert.IsTrue(run.EnterNode(node.Id));
            run.StartBlind(new BlindSpec(node.Segment, node.Layer, 272, 3, 3));
            TestRules.Place(run, run.Blind.Tray[0].Id, 0, 7, 0);
            TestRules.Place(run, TetrominoKind.I, 0, 7, 4);
            Assert.AreEqual(BlindOutcome.Won, run.Blind.Outcome);
            run.SettleBlind();
        }

        private static void WalkToSegmentTwo(RunState run)
        {
            while (run.Progress.Choices(run.Map)[0].Segment == 1)
            {
                WinNode(run, run.Progress.Choices(run.Map)[0]);
            }
        }

        private static string Signature(RunState run) =>
            string.Join(",", run.Money, run.Genes.Count, run.Consumables.Count, run.Library.Count, string.Join(".", run.TypeLevels));

        [Test]
        public void FirstSegmentNodes_CannotBeSkipped()
        {
            RunState run = NewRun();
            WinNode(run, run.Map.Start);
            IReadOnlyList<MapNode> choices = run.Progress.Choices(run.Map);
            Assert.GreaterOrEqual(choices.Count, 2);
            foreach (MapNode node in choices)
            {
                Assert.IsFalse(node.CanSkip, "第一段的普通节点不能跳");
                Assert.IsFalse(run.SkipNode(node.Id));
            }
            Assert.IsFalse(run.Progress.CurrentSkipped);
        }

        [Test]
        public void SkipNode_GrantsTag_AndBlocksShop()
        {
            RunState run = NewRun();
            WalkToSegmentTwo(run);
            MapNode target = run.Progress.Choices(run.Map)[0];
            Assert.IsTrue(target.CanSkip);
            Assert.GreaterOrEqual(target.TagId, 1);
            string before = Signature(run);
            Assert.IsTrue(run.SkipNode(target.Id));
            Assert.IsTrue(run.Progress.CurrentSkipped);
            // 一半标签当场结清(钱/科技/改造/加块),另一半挂「下一次」的状态;两种都算「落进了这一局」
            string after = Signature(run);
            bool immediate = before != after;
            bool pending = !run.Pending.IsEmpty || run.BossIntel || run.SegmentInterestCapBonus > 0;
            Assert.IsTrue(immediate || pending, $"标签 {target.TagId} 没有留下任何效果");
            Assert.Throws<InvalidOperationException>(() => run.OpenShop(), "跳过的节点不进商店");
        }

        [Test]
        public void SkippedFlag_RoundTripsThroughSnapshot()
        {
            RunState run = NewRun();
            WalkToSegmentTwo(run);
            Assert.IsTrue(run.SkipNode(run.Progress.Choices(run.Map)[0].Id));

            string text = RunSnapshot.Write(run);
            SnapshotReadResult read = RunSnapshot.Read(text, run.Config);
            Assert.IsTrue(read.Ok, read.Detail);
            Assert.IsTrue(read.State.Progress.CurrentSkipped);
            Assert.AreEqual(text, RunSnapshot.Write(read.State));
        }
    }
}
