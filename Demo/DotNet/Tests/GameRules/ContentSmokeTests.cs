using System;
using System.Linq;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>内容清单的粗筛:150 张基因都能加进一局、开盲注、走一步而不炸,且状态约束仍成立;22 张改造都在目录里、目标类型有定义。</summary>
    public class ContentSmokeTests
    {
        [Test]
        public void GeneTable_HasAllOneHundredFifty()
        {
            Assert.AreEqual(150, GeneTable.All.Count);
            CollectionAssert.AreEquivalent(Enumerable.Range(1, 150), GeneTable.All.Select(e => e.Id));
        }

        [Test]
        public void EveryGene_CanBeOwnedAndPlayed()
        {
            foreach (GeneTable.Entry entry in GeneTable.All)
            {
                RunState run = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
                run.StartBlind(new BlindSpec(1, 1, 100000, 5, 3));
                run.AddGene(entry.Id);
                Assert.IsNull(run.Validate(), "基因 " + entry.Id + " 加进去之后状态不合法");
                (int id, int rot, int row, int col)? placement = TestRules.FirstLegalPlacement(run);
                Assert.IsNotNull(placement, "基因 " + entry.Id + " 的局里没有可落子的地方");
                var (blockId, r, c, col2) = placement.Value;
                StepResult result = run.Place(blockId, r, c, col2);
                Assert.AreEqual(StepReject.None, result.Reject, "基因 " + entry.Id + " 落子被拒");
                Assert.IsNull(run.Validate(), "基因 " + entry.Id + " 走一步之后状态不合法");
            }
        }

        [Test]
        public void ModCatalog_HasTwentyTwoKnownIds()
        {
            Assert.AreEqual(22, ModCatalog.Count);
            for (int id = 1; id <= ModCatalog.Count; id++)
            {
                Assert.IsTrue(ModCatalog.IsKnown(id), "改造 " + id);
                Assert.IsTrue(Enum.IsDefined(typeof(ModTarget), ModCatalog.TargetOf(id)), "改造 " + id + " 的目标类型没定义");
            }
        }

        [Test]
        public void TechTable_MatchesTheApprovedIncrements()
        {
            // 科技与改造清单 §1 的每级 +底注 / +倍率(2026-10-30 拍板)
            var expected = new (ClearType Type, long Chips, long Mult, long StepChips, long StepMult)[]
            {
                (ClearType.AllClear, 60, 4, 40, 4),
                (ClearType.FiveLine, 55, 4, 35, 3),
                (ClearType.SameShapeCross, 50, 4, 35, 3),
                (ClearType.MultiLine, 45, 3, 30, 3),
                (ClearType.SameShape, 40, 3, 25, 2),
                (ClearType.TripleLine, 35, 3, 25, 2),
                (ClearType.Corner, 30, 2, 20, 2),
                (ClearType.Cross, 25, 2, 20, 2),
                (ClearType.Parallel, 20, 2, 20, 1),
                (ClearType.DoubleLine, 15, 2, 15, 1),
                (ClearType.SingleLine, 10, 1, 10, 1),
            };
            foreach ((ClearType type, long chips, long mult, long stepChips, long stepMult) in expected)
            {
                Assert.AreEqual(new ClearTypeBase(chips, mult), MinimalContent.ClearTypes.Get(type, 1), type.ToString());
                Assert.AreEqual(new ClearTypeBase(chips + stepChips, mult + stepMult), MinimalContent.ClearTypes.Get(type, 2), type.ToString());
            }
        }
    }
}
