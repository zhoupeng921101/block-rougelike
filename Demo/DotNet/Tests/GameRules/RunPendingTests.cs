using System.Collections.Generic;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>
    /// 跳到标签换来的「下一次」效果与三张新券落到实处的样子:折扣、扩货、急售、补给改下一次商店;
    /// 轻敌、弃权改下一个盲注;柜台券加货格、稀券提稀有度权重(设计稿 §7.1、§7.4)。
    /// </summary>
    public class RunPendingTests
    {
        private static RuleConfig Config() => new RuleConfig(
            new[] { new LibraryEntry(TetrominoKind.I, 1), new LibraryEntry(TetrominoKind.I, 1) },
            MinimalContent.ClearTypes, MinimalContent.Effects, catalog: MinimalContent.Catalog);

        /// <summary>赢下开局那一场,停在「已结算、可以开店」的状态。</summary>
        private static RunState SettledStart()
        {
            RunState run = RunState.NewRun(TestRules.Seed, Config());
            Win(run, run.Map.Start);
            return run;
        }

        private static void Win(RunState run, MapNode node)
        {
            Assert.IsTrue(run.EnterNode(node.Id));
            run.StartBlind(new BlindSpec(node.Segment, node.Layer, 272, 3, 3));
            TestRules.Place(run, run.Blind.Tray[0].Id, 0, 7, 0);
            TestRules.Place(run, TetrominoKind.I, 0, 7, 4);
            Assert.AreEqual(BlindOutcome.Won, run.Blind.Outcome);
            run.SettleBlind();
        }

        [Test]
        public void Discount_MarksDownEveryGoodsSlot()
        {
            RunState control = SettledStart();
            ShopState normal = control.OpenShop();
            var basePrices = new List<int>();
            foreach (ShopOffer offer in normal.Goods) basePrices.Add(offer.Price);

            RunState discounted = SettledStart();
            discounted.Pending.ShopDiscountPermille = Tags.DiscountPermille;
            ShopState shop = discounted.OpenShop();
            Assert.AreEqual(normal.Count, shop.Count);
            for (int i = 0; i < shop.Count; i++)
            {
                Assert.LessOrEqual(shop.Goods[i].Price, basePrices[i], $"第 {i} 格应更便宜或同价(75 折向下取整)");
            }
            Assert.AreEqual(RunPending.PermilleOne, discounted.Pending.ShopDiscountPermille, "用掉即清");
        }

        [Test]
        public void ExtraGoods_AddsASlot()
        {
            RunState run = SettledStart();
            run.Pending.ExtraShopGoods = 1;
            ShopState shop = run.OpenShop();
            Assert.AreEqual(ShopState.GoodsCount + 1, shop.Count);
            Assert.AreEqual(0, run.Pending.ExtraShopGoods, "用掉即清");
        }

        [Test]
        public void FreeReroll_CostsNothingAndKeepsThePrice()
        {
            RunState run = SettledStart();
            run.Pending.FreeReroll = true;
            ShopState shop = run.OpenShop();
            Assert.IsTrue(shop.IsFreeReroll);
            Assert.AreEqual(0, shop.RerollCostFor(run));
            int money = run.Money;
            Assert.IsTrue(shop.TryReroll(run.ShopRng(), run));
            Assert.AreEqual(money, run.Money, "免费刷新不扣钱");
            Assert.AreEqual(0, shop.Rerolls, "免费刷新不涨价");
            Assert.AreEqual(0, shop.RerollCostFor(run));
        }

        [Test]
        public void FreeBooster_MakesThePackFree()
        {
            RunState run = SettledStart();
            run.Pending.FreeBooster = true;
            ShopState shop = run.OpenShop();
            Assert.IsTrue(shop.Booster.HasValue, "目录里有补给包");
            Assert.AreEqual(0, shop.Booster.Value.Price);
        }

        [Test]
        public void LightTarget_LowersTheNextBlind_ThenClears()
        {
            RunState control = RunState.NewRun(TestRules.Seed, Config());
            Assert.IsTrue(control.EnterNode(control.Map.Start.Id));
            long normalTarget = control.SpecForCurrentNode().Target;

            RunState run = RunState.NewRun(TestRules.Seed, Config());
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            run.Pending.BlindTargetPermille = Tags.LightTargetPermille;
            BlindSpec spec = run.SpecForCurrentNode();
            Assert.Less(spec.Target, normalTarget, "轻敌把目标分压下来");
            Assert.GreaterOrEqual(spec.Target, normalTarget * 84 / 100, "压到 85% 附近(四舍五入)");
            Assert.LessOrEqual(spec.Target, normalTarget * 86 / 100, "压到 85% 附近(四舍五入)");

            run.StartBlindForCurrentNode();
            Assert.AreEqual(RunPending.PermilleOne, run.Pending.BlindTargetPermille, "开盲注即用掉");
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void ExtraDiscards_AddsToTheNextBlind()
        {
            RunState control = RunState.NewRun(TestRules.Seed, Config());
            Assert.IsTrue(control.EnterNode(control.Map.Start.Id));
            int normal = control.SpecForCurrentNode().Discards;

            RunState run = RunState.NewRun(TestRules.Seed, Config());
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            run.Pending.BlindDiscards = Tags.ExtraDiscardCount;
            Assert.AreEqual(normal + Tags.ExtraDiscardCount, run.SpecForCurrentNode().Discards);
        }

        [Test]
        public void CounterVoucher_AddsAPermanentShopSlot()
        {
            RunState run = SettledStart();
            Assert.IsTrue(run.TryAddVoucher(VoucherCatalog.Counter));
            ShopState shop = run.OpenShop();
            Assert.AreEqual(ShopState.GoodsCount + 1, shop.Count);
        }

        [Test]
        public void RarityVoucher_ShiftsGeneWeights()
        {
            RunState run = SettledStart();
            Assert.IsFalse(run.Modifiers.ShiftRarity);
            Assert.IsTrue(run.TryAddVoucher(VoucherCatalog.Rarity));
            Assert.IsTrue(run.Modifiers.ShiftRarity);
        }

        [Test]
        public void InterestBonus_OnlyCountsInItsOwnSegment()
        {
            RunState run = RunState.NewRun(TestRules.Seed, Config());
            Assert.AreEqual(0, run.SegmentInterestCapBonus);
        }
    }
}
