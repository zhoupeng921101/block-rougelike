using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>补给包:五种包的候选数与选择次数、买包扣钱、选件生效、选够即关、开了一半的包能存档(设计稿 §7.3)。</summary>
    public class BoosterTests
    {
        private static RuleConfig Config => MinimalContent.Config;

        /// <summary>背包里会变的那几样:基因、改造、方块库、类型等级。</summary>
        private static string Signature(RunState run) =>
            string.Join(",", run.Genes.Count, run.Consumables.Count, run.Library.Count, string.Join(".", run.TypeLevels));

        private static RunState WonAtStartNode()
        {
            RuleConfig config = new RuleConfig(
                new[] { new LibraryEntry(TetrominoKind.I, 1), new LibraryEntry(TetrominoKind.I, 1) },
                MinimalContent.ClearTypes, MinimalContent.Effects, catalog: MinimalContent.Catalog);
            RunState run = RunState.NewRun(TestRules.Seed, config);
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            run.StartBlind(new BlindSpec(1, 1, 272, 3, 3));
            TestRules.Place(run, run.Blind.Tray[0].Id, 0, 7, 0);
            TestRules.Place(run, TetrominoKind.I, 0, 7, 4);
            run.SettleBlind();
            return run;
        }

        [Test]
        public void Open_GivesTheRightOptionCountAndPicks()
        {
            var rng = new RngStreams(TestRules.Seed).Get(RngKeys.Shop(1, 1));
            Assert.AreEqual(3, BoosterPack.Open(rng, Config.Catalog, BoosterPack.GenePack).Options.Count);
            Assert.AreEqual(2, BoosterPack.Open(rng, Config.Catalog, BoosterPack.TechPack).Options.Count);
            Assert.AreEqual(3, BoosterPack.Open(rng, Config.Catalog, BoosterPack.ModPack).Options.Count);
            Assert.AreEqual(4, BoosterPack.Open(rng, Config.Catalog, BoosterPack.BlockPack).Options.Count);
            Assert.AreEqual(2, BoosterPack.Open(rng, Config.Catalog, BoosterPack.BlockPack).PicksLeft);
            Assert.AreEqual(5, BoosterPack.Open(rng, Config.Catalog, BoosterPack.MixedPack).Options.Count);
            Assert.AreEqual(1, BoosterPack.Open(rng, Config.Catalog, BoosterPack.GenePack).PicksLeft);
        }

        [Test]
        public void Shop_SellsBooster_ThenChoosesIntoTheRun()
        {
            RunState run = WonAtStartNode();
            ShopState shop = run.OpenShop();
            Assert.IsNotNull(shop.Booster, "每个商店都挂一个补给包");
            run.AddMoney(50);
            int price = shop.Booster.Value.Price;
            int before = run.Money;
            Assert.AreEqual(ShopBuyResult.Ok, shop.TryBuyBooster(run.Rng.Get(RngKeys.Shop(1, 1)), run));
            Assert.AreEqual(before - price, run.Money);
            Assert.IsNull(shop.Booster, "买掉就不再挂");
            Assert.IsNotNull(shop.Pack, "买了立刻开包");
            int picks = shop.Pack.PicksLeft;

            string stateBefore = Signature(run);
            Assert.AreEqual(ShopBuyResult.Ok, shop.ChooseBooster(0, run));
            Assert.AreEqual(picks - 1, shop.Pack?.PicksLeft ?? 0);
            Assert.AreNotEqual(stateBefore, Signature(run), "选中的那件要落进这一局");
        }

        [Test]
        public void BlockPack_NeedsTwoPicks()
        {
            RunState run = WonAtStartNode();
            var rng = new RngStreams(TestRules.Seed).Get(RngKeys.Shop(1, 1));
            BoosterPack pack = BoosterPack.Open(rng, run.Config.Catalog, BoosterPack.BlockPack);
            Assert.AreEqual(4, pack.Options.Count);
            Assert.AreEqual(2, pack.PicksLeft);
            Assert.AreEqual(ShopBuyResult.Ok, pack.Choose(0, run));
            Assert.AreEqual(1, pack.PicksLeft);
            Assert.IsFalse(pack.IsClosed);
            Assert.AreEqual(ShopBuyResult.Ok, pack.Choose(0, run));
            Assert.AreEqual(0, pack.PicksLeft);
            Assert.IsTrue(pack.IsClosed, "两次选完包就关");
        }

        [Test]
        public void OpenPack_RoundTripsThroughSnapshot()
        {
            RunState run = WonAtStartNode();
            run.AddMoney(50);
            ShopState shop = run.OpenShop();
            Assert.AreEqual(ShopBuyResult.Ok, shop.TryBuyBooster(run.Rng.Get(RngKeys.Shop(1, 1)), run));
            Assert.AreEqual(ShopBuyResult.Ok, shop.ChooseBooster(0, run));

            string text = RunSnapshot.Write(run);
            SnapshotReadResult read = RunSnapshot.Read(text, run.Config);
            Assert.IsTrue(read.Ok, read.Detail);
            BoosterPack pack = read.State.Shop?.Pack;
            if (shop.Pack == null)
            {
                Assert.IsNull(pack, "选完了的包不该留下");
            }
            else
            {
                Assert.IsNotNull(pack);
                Assert.AreEqual(shop.Pack.BoosterId, pack.BoosterId);
                Assert.AreEqual(shop.Pack.PicksLeft, pack.PicksLeft);
                Assert.AreEqual(shop.Pack.Options.Count, pack.Options.Count);
            }
            Assert.AreEqual(text, RunSnapshot.Write(read.State));
        }
    }
}
