using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>道具栏进存档:科技与改造按加入次序往返,校验放得下。</summary>
    public class InventorySnapshotTests
    {
        [Test]
        public void Consumables_RoundTripThroughSnapshot()
        {
            RunState run = RunState.NewRun("TESTSEED", MinimalContent.Config);
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(3)));
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Tech(5)));
            Assert.IsNull(run.Validate());

            string text = RunSnapshot.Write(run);
            SnapshotReadResult read = RunSnapshot.Read(text, MinimalContent.Config);
            Assert.IsTrue(read.Ok, read.Detail);
            CollectionAssert.AreEqual(new[] { ConsumableItem.Mod(3), ConsumableItem.Tech(5) }, read.State.Consumables);
            Assert.AreEqual(text, RunSnapshot.Write(read.State));
        }

        [Test]
        public void Consumables_RespectSlots()
        {
            RunState run = RunState.NewRun("TESTSEED", MinimalContent.Config);
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(1)));
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(2)));
            Assert.IsFalse(run.TryAddConsumable(ConsumableItem.Mod(3)), "道具栏默认 2 格");
            Assert.Greater(run.SellConsumable(0), 0, "卖掉腾一格");
            Assert.IsTrue(run.TryAddConsumable(ConsumableItem.Mod(3)));
            CollectionAssert.AreEqual(new[] { ConsumableItem.Mod(2), ConsumableItem.Mod(3) }, run.Consumables);
        }
    }
}
