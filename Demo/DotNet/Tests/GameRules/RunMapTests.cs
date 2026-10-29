using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>地图:同种子同布局、段/层形状、相邻层连接、推进规则(先结算再选下一层)、走到结局、节点数值(设计稿 §2)。</summary>
    public class RunMapTests
    {
        private const string Seed = "TESTSEED";

        private static List<int> Ids(IEnumerable<MapNode> nodes) => nodes.Select(n => n.Id).ToList();

        [Test]
        public void Generate_IsDeterministic()
        {
            RunMap a = RunMap.Generate(Seed);
            RunMap b = RunMap.Generate(Seed);
            Assert.AreEqual(a.Nodes.Count, b.Nodes.Count);
            for (int i = 0; i < a.Nodes.Count; i++)
            {
                Assert.AreEqual(a.Nodes[i].Id, b.Nodes[i].Id);
                Assert.AreEqual(a.Nodes[i].Segment, b.Nodes[i].Segment);
                Assert.AreEqual(a.Nodes[i].Layer, b.Nodes[i].Layer);
                Assert.AreEqual(a.Nodes[i].Strength, b.Nodes[i].Strength);
            }
        }

        [Test]
        public void Generate_ShapeMatchesDesign()
        {
            RunMap map = RunMap.Generate(Seed);
            Assert.AreEqual(6, map.SegmentCount);
            Assert.AreEqual(1, map.NodesAt(1, 1).Count, "第一段第一层只有一条路");
            Assert.AreEqual(NodeStrength.Normal, map.NodesAt(1, 1)[0].Strength, "第一场是标准盲注");

            for (int segment = 1; segment <= map.SegmentCount; segment++)
            {
                for (int layer = 1; layer < RunMap.LayersPerSegment; layer++)
                {
                    IReadOnlyList<MapNode> nodes = map.NodesAt(segment, layer);
                    if (segment == 1 && layer == 1) continue;
                    Assert.That(nodes.Count, Is.InRange(2, 3), $"段 {segment} 层 {layer} 的节点数");
                    var strengths = new HashSet<NodeStrength>();
                    foreach (MapNode n in nodes)
                    {
                        Assert.AreNotEqual(NodeStrength.Boss, n.Strength, "首领只在第 3 层");
                        Assert.IsTrue(strengths.Add(n.Strength), "同层强度互不相同");
                    }
                    Assert.IsTrue(strengths.Contains(NodeStrength.Normal), "同层必有一个「中」");
                }

                IReadOnlyList<MapNode> boss = map.NodesAt(segment, RunMap.LayersPerSegment);
                Assert.AreEqual(1, boss.Count, $"段 {segment} 的首领只有一个");
                Assert.IsTrue(boss[0].IsBoss);
            }
        }

        [Test]
        public void Generate_NodeIdsAreSequential()
        {
            RunMap map = RunMap.Generate(Seed);
            for (int i = 0; i < map.Nodes.Count; i++)
            {
                Assert.AreEqual(i + 1, map.Nodes[i].Id);
            }
        }

        [Test]
        public void NextAfter_ConnectsLayersAndSegments()
        {
            RunMap map = RunMap.Generate(Seed);
            foreach (MapNode node in map.Nodes)
            {
                IReadOnlyList<MapNode> next = map.NextAfter(node.Id);
                if (node.Layer < RunMap.LayersPerSegment)
                {
                    CollectionAssert.AreEqual(Ids(map.NodesAt(node.Segment, node.Layer + 1)), Ids(next));
                }
                else if (node.Segment < map.SegmentCount)
                {
                    CollectionAssert.AreEqual(Ids(map.NodesAt(node.Segment + 1, 1)), Ids(next));
                }
                else
                {
                    Assert.AreEqual(0, next.Count, "最后一关的首领之后没有节点");
                }
            }
        }

        [Test]
        public void Progress_RequiresResolveBeforeNextChoice()
        {
            RunMap map = RunMap.Generate(Seed);
            var progress = new MapProgress();
            CollectionAssert.AreEqual(new[] { map.Start.Id }, Ids(progress.Choices(map)), "开局只能进第一个节点");

            Assert.IsTrue(progress.Enter(map, map.Start.Id));
            Assert.AreEqual(0, progress.Choices(map).Count, "还没结算就不给下一层的选择");
            Assert.IsFalse(progress.Enter(map, map.NextAfter(map.Start.Id)[0].Id), "没结算不能硬进下一节点");

            Assert.IsTrue(progress.Resolve());
            Assert.AreEqual(map.NextAfter(map.Start.Id).Count, progress.Choices(map).Count);
            Assert.IsFalse(progress.Resolve(), "已经结算过,重复结算不算");
            Assert.IsNull(progress.Validate(map));
        }

        [Test]
        public void Progress_WalkToFinalBoss_Completes()
        {
            RunMap map = RunMap.Generate(Seed);
            var progress = new MapProgress();
            while (!progress.IsComplete(map))
            {
                IReadOnlyList<MapNode> choices = progress.Choices(map);
                Assert.IsTrue(choices.Count > 0, "未到结局却无路可走");
                Assert.IsTrue(progress.Enter(map, choices[0].Id));
                Assert.IsTrue(progress.Resolve());
            }
            Assert.AreEqual(18, progress.Visited.Count, "6 段 × 3 层,一路走 18 个节点");
            Assert.IsNull(progress.Validate(map));
            Assert.AreEqual(map.FinalBoss.Id, progress.CurrentNodeId);
        }

        [Test]
        public void Progress_RejectsNodeNotOffered()
        {
            RunMap map = RunMap.Generate(Seed);
            var progress = new MapProgress();
            Assert.IsFalse(progress.Enter(map, map.FinalBoss.Id), "开局不能直接跳首领");
            Assert.AreEqual(0, progress.CurrentNodeId);
            Assert.AreEqual(0, progress.Visited.Count);
        }

        [Test]
        public void DifferentSeeds_ProduceDifferentLayouts()
        {
            string[] seeds = { "TESTSEED", "ABCDEFGH", "ZXCVBNMA", "QWERTYUA", "ASDFGHJK", "MNBVCXZL" };
            var shapes = new HashSet<string>();
            foreach (string seed in seeds)
            {
                RunMap map = RunMap.Generate(seed);
                shapes.Add(string.Join(",", map.Nodes.Select(n => n.Strength)));
            }
            Assert.Greater(shapes.Count, 1, "六个种子至少应给出两种布局");
        }

        [Test]
        public void Generate_TagsOnlyOnSkippableNodes()
        {
            RunMap map = RunMap.Generate(Seed);
            foreach (MapNode node in map.Nodes)
            {
                if (node.CanSkip) Assert.That(node.TagId, Is.InRange(1, Tags.Count), $"段 {node.Segment} 层 {node.Layer} 的节点该有标签");
                else Assert.AreEqual(0, node.TagId, "首领与第一段不派签");
            }
        }

        [Test]
        public void NodeValues_MatchDesign()
        {
            Assert.AreEqual(900, new MapNode(1, 2, 1, NodeStrength.Light).TargetPermille);
            Assert.AreEqual(1000, new MapNode(1, 2, 1, NodeStrength.Normal).TargetPermille);
            Assert.AreEqual(1100, new MapNode(1, 2, 1, NodeStrength.Heavy).TargetPermille);
            Assert.AreEqual(2100, new MapNode(1, 2, 3, NodeStrength.Boss).TargetPermille);
            Assert.AreEqual(3, new MapNode(1, 2, 1, NodeStrength.Light).Reward);
            Assert.AreEqual(6, new MapNode(1, 2, 3, NodeStrength.Boss).Reward);
            Assert.IsFalse(new MapNode(1, 1, 1, NodeStrength.Normal).CanSkip, "第一段不能跳");
            Assert.IsTrue(new MapNode(1, 2, 1, NodeStrength.Normal).CanSkip);
            Assert.IsFalse(new MapNode(1, 2, 3, NodeStrength.Boss).CanSkip, "首领不能跳");
        }
    }
}
