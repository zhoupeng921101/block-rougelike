using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>商店:出货与保底、刷新费、买基因/方块/科技、钱不够与槽满时的拒绝(设计稿 §4)。</summary>
    public class ShopStateTests
    {
        private static ShopState Open(RunState run, int segment = 1, int layer = 1, bool guaranteeGene = true) =>
            ShopState.Open(run.Rng.Get(RngKeys.Shop(segment, layer)), run, guaranteeGene, false);

        private static int IndexOf(ShopState shop, ItemKind kind)
        {
            for (int i = 0; i < shop.Goods.Count; i++)
            {
                if (shop.Goods[i].Kind == kind && !shop.Goods[i].Sold) return i;
            }
            return -1;
        }

        /// <summary>按种子逐个找一家有指定货的店;生成是确定性的,同一组种子每次都给出同一结果。</summary>
        private static (RunState Run, ShopState Shop, int Index) FindShop(ItemKind kind)
        {
            for (int i = 0; i < 400; i++)
            {
                string seed = SeedText.FromEntropy((ulong)i * 2654435761UL + 17UL);
                RunState run = RunState.NewRun(seed, MinimalContent.Config);
                ShopState shop = Open(run);
                int index = IndexOf(shop, kind);
                if (index >= 0) return (run, shop, index);
            }
            Assert.Fail("400 个种子里没找到带 " + kind + " 的商店");
            return default;
        }

        [Test]
        public void Open_GivesFourOffers_AndGuaranteesAGene()
        {
            for (int i = 0; i < 30; i++)
            {
                RunState run = RunState.NewRun(SeedText.FromEntropy((ulong)i), MinimalContent.Config);
                ShopState shop = Open(run);
                Assert.AreEqual(ShopState.GoodsCount, shop.Goods.Count);
                int genes = 0;
                foreach (ShopOffer offer in shop.Goods)
                {
                    Assert.AreEqual(false, offer.Sold);
                    Assert.Greater(offer.Price, 0);
                    if (offer.Kind == ItemKind.Gene) genes++;
                }
                Assert.GreaterOrEqual(genes, 1, "前几场保底至少一个基因格");
            }
        }

        [Test]
        public void Reroll_CostsFiveThenSix_AndFailsWithoutMoney()
        {
            RunState run = RunState.NewRun(TestRules.Seed, MinimalContent.Config);
            ShopState shop = Open(run);
            run.AddMoney(20);
            Assert.AreEqual(24, run.Money);
            Assert.AreEqual(5, shop.RerollCost);
            Assert.IsTrue(shop.TryReroll(run.Rng.Get(RngKeys.Shop(1, 1)), run));
            Assert.AreEqual(19, run.Money);
            Assert.AreEqual(1, shop.Rerolls);
            Assert.AreEqual(6, shop.RerollCost);
            Assert.IsTrue(shop.TryReroll(run.Rng.Get(RngKeys.Shop(1, 1)), run));
            Assert.AreEqual(13, run.Money);
            Assert.AreEqual(2, shop.Rerolls);

            Assert.IsTrue(run.TrySpend(run.Money));
            int before = run.Money;
            Assert.IsFalse(shop.TryReroll(run.Rng.Get(RngKeys.Shop(1, 1)), run));
            Assert.AreEqual(before, run.Money);
            Assert.AreEqual(2, shop.Rerolls);
        }

        [Test]
        public void BuyGene_DeductsMoney_AddsGene_MarksSold()
        {
            (RunState run, ShopState shop, int index) = FindShop(ItemKind.Gene);
            run.AddMoney(50);
            ShopOffer offer = shop.Goods[index];
            int before = run.Money;
            Assert.AreEqual(ShopBuyResult.Ok, shop.TryBuy(index, run));
            Assert.AreEqual(before - offer.Price, run.Money);
            Assert.AreEqual(1, run.Genes.Count);
            Assert.AreEqual(offer.Id, run.Genes[0].GeneId);
            Assert.IsTrue(shop.Goods[index].Sold);
            Assert.AreEqual(ShopBuyResult.SoldOut, shop.TryBuy(index, run), "同一格不能再买");
        }

        [Test]
        public void BuyBlock_AddsToLibrary()
        {
            (RunState run, ShopState shop, int index) = FindShop(ItemKind.Block);
            run.AddMoney(50);
            ShopOffer offer = shop.Goods[index];
            int before = run.Library.Count;
            Assert.AreEqual(ShopBuyResult.Ok, shop.TryBuy(index, run));
            Assert.AreEqual(before + 1, run.Library.Count);
            BlockEntry entry = default;
            foreach (BlockEntry b in run.Config.Catalog.Blocks)
            {
                if (b.Id == offer.Id) { entry = b; break; }
            }
            BlockInstance added = run.Library[run.Library.Count - 1];
            Assert.AreEqual(entry.Kind, added.Kind);
            Assert.AreEqual(entry.Points, added.Points);
        }

        /// <summary>打完开局那一场(库里只有两块 I,消掉第 7 行就清屏):湮域科技解锁,其余仍锁着。结算后离场,同 RunFlow.SettleWon。</summary>
        internal static RunState UnlockedAllClear(string seed)
        {
            var config = new RuleConfig(new[] { new LibraryEntry(TetrominoKind.I, 1), new LibraryEntry(TetrominoKind.I, 1) },
                MinimalContent.ClearTypes, MinimalContent.Effects, catalog: MinimalContent.Catalog);
            RunState run = RunState.NewRun(seed, config);
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            run.StartBlind(new BlindSpec(1, 1, 1, 3, 3));
            TestRules.Place(run, run.Blind.Tray[0].Id, 0, 7, 0);
            TestRules.Place(run, TetrominoKind.I, 0, 7, 4);
            run.SettleBlind();
            run.LeaveBlind();
            return run;
        }

        [Test]
        public void TechSoftLock_NoTechBeforeItsTypeWasPlayed()
        {
            for (int i = 0; i < 60; i++)
            {
                RunState run = RunState.NewRun(SeedText.FromEntropy((ulong)i), MinimalContent.Config);
                Assert.AreEqual(-1, IndexOf(Open(run), ItemKind.Tech), "一种类型都没打出过,科技一张都不进池");
            }
        }

        [Test]
        public void BuyTech_GoesToTheItemBar_ThenUsingItUpgradesItsType()
        {
            for (int i = 0; i < 400; i++)
            {
                RunState run = UnlockedAllClear(SeedText.FromEntropy((ulong)i * 2654435761UL + 17UL));
                ShopState shop = run.OpenShop();
                int index = IndexOf(shop, ItemKind.Tech);
                if (index < 0) continue;
                run.AddMoney(50);
                ShopOffer offer = shop.Goods[index];
                ClearType type = run.Config.Catalog.TechTypeOf(offer.Id);
                Assert.AreEqual(ClearType.AllClear, type, "软锁:只有打出过的清屏有科技");
                Assert.AreEqual(ShopBuyResult.Ok, shop.TryBuy(index, run));
                Assert.AreEqual(1, run.LevelOf(type), "买下只进道具栏");
                CollectionAssert.AreEqual(new[] { ConsumableItem.Tech(offer.Id) }, run.Consumables);
                Assert.IsTrue(run.UseConsumable(0).Accepted);
                Assert.AreEqual(2, run.LevelOf(type));
                Assert.AreEqual(0, run.Consumables.Count);
                Assert.IsNull(run.Validate());
                return;
            }
            Assert.Fail("400 个种子里没找到带科技的商店");
        }

        [Test]
        public void Buy_RejectsWithoutMoney_AndWhenGeneSlotsAreFull()
        {
            (RunState run, ShopState shop, int index) = FindShop(ItemKind.Gene);
            Assert.IsTrue(run.TrySpend(run.Money));
            Assert.AreEqual(ShopBuyResult.NotEnoughMoney, shop.TryBuy(index, run));
            Assert.AreEqual(0, run.Genes.Count);
            Assert.IsFalse(shop.Goods[index].Sold);

            for (int i = 0; i < 400; i++)
            {
                string seed = SeedText.FromEntropy((ulong)i * 40503UL + 7UL);
                RunState candidate = RunState.NewRun(seed, MinimalContent.Config);
                ShopState candidateShop = Open(candidate);
                int gene = IndexOf(candidateShop, ItemKind.Gene);
                if (gene < 0) continue;
                candidate.AddMoney(50);
                for (int id = 1; id <= 4; id++) candidate.TryAddGene(id);
                int money = candidate.Money;
                Assert.AreEqual(ShopBuyResult.SlotFull, candidateShop.TryBuy(gene, candidate));
                Assert.AreEqual(money, candidate.Money, "放不下就不扣钱");
                Assert.IsFalse(candidateShop.Goods[gene].Sold);
                Assert.Pass();
            }
            Assert.Fail("没有找到带基因的商店");
        }
    }
}
