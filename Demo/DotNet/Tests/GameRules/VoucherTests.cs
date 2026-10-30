using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>优惠券:改参数(槽/组/弃置/利息/目标/价格)、启动券立即入账、商店挂券与购买、进存档(设计稿 §5、§7.4)。</summary>
    public class VoucherTests
    {
        private static RunState Started()
        {
            RuleConfig config = new RuleConfig(
                new[] { new LibraryEntry(TetrominoKind.I, 1), new LibraryEntry(TetrominoKind.I, 1) },
                MinimalContent.ClearTypes, MinimalContent.Effects, catalog: MinimalContent.Catalog);
            return RunState.NewRun(TestRules.Seed, config);
        }

        private static RunState WonAtStartNode()
        {
            RunState run = Started();
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            run.StartBlind(new BlindSpec(1, 1, 272, 3, 3));
            TestRules.Place(run, run.Blind.Tray[0].Id, 0, 7, 0);
            TestRules.Place(run, TetrominoKind.I, 0, 7, 4);
            Assert.AreEqual(BlindOutcome.Won, run.Blind.Outcome);
            run.SettleBlind();
            return run;
        }

        [Test]
        public void Vouchers_ChangeRunParameters()
        {
            RunState run = Started();
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            Assert.AreEqual(4, run.GeneSlots);
            Assert.IsTrue(run.TryAddVoucher(VoucherCatalog.GeneSlot));
            Assert.AreEqual(5, run.GeneSlots, "扩槽券 +1");
            for (int id = 1; id <= 5; id++) Assert.IsTrue(run.TryAddGene(id), "五张基因都放得下");

            Assert.IsTrue(run.TryAddVoucher(VoucherCatalog.GroupSize));
            Assert.AreEqual(4, run.SpecForCurrentNode().GroupSize, "加组券让每组多一块");

            Assert.IsTrue(run.TryAddVoucher(VoucherCatalog.Discard));
            Assert.AreEqual(4, run.SpecForCurrentNode().Discards, "弃置券 +1");

            Assert.IsTrue(run.TryAddVoucher(VoucherCatalog.LightTarget));
            Assert.AreEqual(333, (int)run.SpecForCurrentNode().Target, "轻装券把目标打 95 折");
        }

        [Test]
        public void WholesaleVoucher_DiscountsBlocksAndBoostersOnly()
        {
            RunState plain = WonAtStartNode();
            plain.OpenShop();
            RunState discounted = WonAtStartNode();
            Assert.IsTrue(discounted.TryAddVoucher(VoucherCatalog.Wholesale));
            discounted.OpenShop();
            Assert.AreEqual(plain.Shop.Count, discounted.Shop.Count);
            for (int i = 0; i < plain.Shop.Count; i++)
            {
                ShopOffer a = plain.Shop.Goods[i];
                ShopOffer b = discounted.Shop.Goods[i];
                Assert.AreEqual((a.Kind, a.Id), (b.Kind, b.Id), "同一店同一件");
                if (a.Kind == ItemKind.Block) Assert.Less(b.Price, a.Price, "批发券只压方块");
                else Assert.AreEqual(a.Price, b.Price, "批发券不压" + a.Kind);
            }
        }

        [Test]
        public void StartMoneyVoucher_PaysImmediately()
        {
            RunState run = Started();
            int before = run.Money;
            Assert.IsTrue(run.TryAddVoucher(VoucherCatalog.StartMoney));
            Assert.AreEqual(before + 4, run.Money);
            Assert.IsFalse(run.TryAddVoucher(VoucherCatalog.StartMoney), "同一张券不能买两次");
        }

        [Test]
        public void InterestCapVoucher_RaisesCap()
        {
            RunState run = Started();
            run.AddMoney(70);
            Assert.AreEqual(5, RunEconomy.InterestOf(run.Money, run.Difficulty, run.Config), "标准档封顶 $50");
            Assert.IsTrue(run.TryAddVoucher(VoucherCatalog.InterestCap));
            Assert.AreEqual(7, RunEconomy.InterestOf(run.Money, run.Config.InterestPer,
                run.Config.Tuning.DifficultyOf(run.Difficulty).InterestCap + run.Modifiers.InterestCapBonus));
        }

        [Test]
        public void Shop_OffersVoucherInFirstShopOfSegment_AndSellsItOnce()
        {
            RunState run = WonAtStartNode();
            ShopState shop = run.OpenShop();
            Assert.IsNotNull(shop.Voucher, "每段第一场挂一张券");
            run.AddMoney(30);
            int price = shop.Voucher.Value.Price;
            int before = run.Money;
            Assert.AreEqual(ShopBuyResult.Ok, shop.TryBuyVoucher(run));
            Assert.AreEqual(before - price, run.Money);
            Assert.AreEqual(1, run.Vouchers.Count);
            Assert.IsNull(shop.Voucher, "买掉就不再挂");
            Assert.AreEqual(ShopBuyResult.SoldOut, shop.TryBuyVoucher(run));
        }

        [Test]
        public void Vouchers_RoundTripThroughSnapshot()
        {
            RunState run = Started();
            Assert.IsTrue(run.TryAddVoucher(VoucherCatalog.GeneSlot));
            Assert.IsTrue(run.TryAddVoucher(VoucherCatalog.StartMoney));
            string text = RunSnapshot.Write(run);
            SnapshotReadResult read = RunSnapshot.Read(text, MinimalContent.Config);
            Assert.IsTrue(read.Ok, read.Detail);
            CollectionAssert.AreEqual(run.Vouchers, read.State.Vouchers);
            Assert.AreEqual(run.Money, read.State.Money);
            Assert.AreEqual(text, RunSnapshot.Write(read.State));
        }
    }
}
