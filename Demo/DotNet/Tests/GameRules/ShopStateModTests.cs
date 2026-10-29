using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>商店买改造:进道具栏;栏满时不扣钱、不卖。</summary>
    public class ShopStateModTests
    {
        private static (RunState Run, ShopState Shop, int Index) FindModShop()
        {
            for (int i = 0; i < 400; i++)
            {
                string seed = SeedText.FromEntropy((ulong)i * 2654435761UL + 17UL);
                RunState run = RunState.NewRun(seed, MinimalContent.Config);
                ShopState shop = ShopState.Open(run.Rng.Get(RngKeys.Shop(1, 1)), run.Config.Catalog, run.Difficulty, true);
                for (int j = 0; j < shop.Goods.Count; j++)
                {
                    if (shop.Goods[j].Kind == ItemKind.Mod) return (run, shop, j);
                }
            }
            Assert.Fail("400 个种子里没有带改造的商店");
            return default;
        }

        [Test]
        public void BuyMod_AddsToConsumables()
        {
            (RunState run, ShopState shop, int index) = FindModShop();
            run.AddMoney(50);
            ShopOffer offer = shop.Goods[index];
            int before = run.Money;
            Assert.AreEqual(ShopBuyResult.Ok, shop.TryBuy(index, run));
            Assert.AreEqual(before - offer.Price, run.Money);
            CollectionAssert.Contains(run.Consumables, offer.Id);
            Assert.IsTrue(shop.Goods[index].Sold);
            Assert.IsNull(run.Validate());
        }

        [Test]
        public void BuyMod_RejectsWhenInventoryFull()
        {
            (RunState run, ShopState shop, int index) = FindModShop();
            run.AddMoney(50);
            Assert.IsTrue(run.TryAddConsumable(1));
            Assert.IsTrue(run.TryAddConsumable(2));
            int before = run.Money;
            Assert.AreEqual(ShopBuyResult.SlotFull, shop.TryBuy(index, run));
            Assert.AreEqual(before, run.Money, "放不下就不扣钱");
            Assert.IsFalse(shop.Goods[index].Sold);
            Assert.AreEqual(2, run.Consumables.Count);
        }
    }
}
