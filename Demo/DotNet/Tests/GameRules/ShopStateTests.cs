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

        [Test]
        public void BuyTech_UpgradesItsType()
        {
            (RunState run, ShopState shop, int index) = FindShop(ItemKind.Tech);
            run.AddMoney(50);
            ShopOffer offer = shop.Goods[index];
            ClearType type = run.Config.Catalog.TechTypeOf(offer.Id);
            Assert.AreEqual(1, run.LevelOf(type));
            Assert.AreEqual(ShopBuyResult.Ok, shop.TryBuy(index, run));
            Assert.AreEqual(2, run.LevelOf(type));
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
