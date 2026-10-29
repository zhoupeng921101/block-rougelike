using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>商店货格的一件货。卖出后 <see cref="Sold"/> 为真,格子留着但不能再买。</summary>
    public readonly struct ShopOffer
    {
        public readonly ItemKind Kind;
        public readonly int Id;
        public readonly int Price;
        public readonly bool Sold;

        public ShopOffer(ItemKind kind, int id, int price, bool sold = false)
        {
            Kind = kind;
            Id = id;
            Price = price;
            Sold = sold;
        }

        public ShopOffer AsSold() => new ShopOffer(Kind, Id, Price, true);
    }

    /// <summary>买一件货的结果。失败时不改状态、不扣钱。</summary>
    public enum ShopBuyResult
    {
        Ok = 0,
        SoldOut = 1,
        NotEnoughMoney = 2,
        SlotFull = 3,
        UnknownOffer = 4,
    }

    /// <summary>
    /// 一个商店的货架(局外循环设计稿 §4):4 个货格,权重 基因 60 / 方块 16 / 科技 12 / 改造 12。
    /// 刷新只换货格,第一次 $5、之后每次 +$1;买货先查放不放得下,再扣钱,失败不改状态。
    /// 优惠券与补给包两格还没接(等它们的效果),货架先只出货格。
    /// </summary>
    public sealed class ShopState
    {
        public const int GoodsCount = 4;

        private readonly ShopOffer[] _goods;
        private readonly ContentCatalog _catalog;
        private readonly RunDifficulty _difficulty;
        private readonly bool _guaranteeGene;

        public IReadOnlyList<ShopOffer> Goods => _goods;

        /// <summary>已经刷新过几次;刷新费 = 5 + 这个数。</summary>
        public int Rerolls { get; private set; }

        public int RerollCost => 5 + Rerolls;

        /// <summary>开局前几场的保底基因;进存档,读档后刷新照样保底。</summary>
        public bool GuaranteeGene => _guaranteeGene;

        private ShopState(ShopOffer[] goods, ContentCatalog catalog, RunDifficulty difficulty, bool guaranteeGene, int rerolls)
        {
            _goods = goods;
            _catalog = catalog;
            _difficulty = difficulty;
            _guaranteeGene = guaranteeGene;
            Rerolls = rerolls;
        }

        /// <summary>读档的还原口(<see cref="RunSnapshot"/>):货架、刷新次数与保底标记原样接上;目录与难度取自当局配置。</summary>
        internal static ShopState Restore(ShopOffer[] goods, int rerolls, bool guaranteeGene, ContentCatalog catalog, RunDifficulty difficulty) =>
            new ShopState(goods, catalog, difficulty, guaranteeGene, rerolls);

        /// <summary>深拷贝货架(卖掉的标记也要拷),给 <see cref="RunState.Clone"/> 的试走用。</summary>
        internal ShopState Clone()
        {
            var goods = new ShopOffer[_goods.Length];
            for (int i = 0; i < goods.Length; i++) goods[i] = _goods[i];
            return new ShopState(goods, _catalog, _difficulty, _guaranteeGene, Rerolls);
        }

        /// <summary>开一个新商店。<paramref name="guaranteeGene"/> 用于开局前几场:至少给一个基因格。</summary>
        public static ShopState Open(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty, bool guaranteeGene)
        {
            if (rng == null) throw new ArgumentNullException(nameof(rng));
            if (catalog == null) throw new ArgumentNullException(nameof(catalog));
            ShopOffer[] goods = Roll(rng, catalog, difficulty, guaranteeGene);
            return new ShopState(goods, catalog, difficulty, guaranteeGene, 0);
        }

        /// <summary>刷新货格并扣费。钱不够返回 false,货架与钱都不动。</summary>
        public bool TryReroll(IRandomSource rng, RunState run)
        {
            if (rng == null) throw new ArgumentNullException(nameof(rng));
            if (run == null) throw new ArgumentNullException(nameof(run));
            int cost = RerollCost;
            if (!run.TrySpend(cost)) return false;
            ShopOffer[] fresh = Roll(rng, _catalog, _difficulty, _guaranteeGene);
            for (int i = 0; i < _goods.Length; i++) _goods[i] = fresh[i];
            Rerolls++;
            return true;
        }

        /// <summary>买第 <paramref name="index"/> 个货格。先查种类支不支持、放不放得下,再扣钱并生效。</summary>
        public ShopBuyResult TryBuy(int index, RunState run)
        {
            if (run == null) throw new ArgumentNullException(nameof(run));
            if (index < 0 || index >= _goods.Length) return ShopBuyResult.UnknownOffer;
            ShopOffer offer = _goods[index];
            if (offer.Sold) return ShopBuyResult.SoldOut;
            if (offer.Price > run.Money) return ShopBuyResult.NotEnoughMoney;

            switch (offer.Kind)
            {
                case ItemKind.Gene:
                    if (!CanTakeGene(run, offer.Id)) return ShopBuyResult.SlotFull;
                    break;
                case ItemKind.Tech:
                    ClearType type = _catalog.TechTypeOf(offer.Id);
                    if (run.LevelOf(type) >= run.Config.ClearTypes.MaxLevel(type)) return ShopBuyResult.SlotFull;
                    break;
                case ItemKind.Mod:
                    if (run.Consumables.Count >= run.Config.ConsumableSlots) return ShopBuyResult.SlotFull;
                    break;
                case ItemKind.Block:
                    break;
                default:
                    return ShopBuyResult.UnknownOffer;
            }

            if (!run.TrySpend(offer.Price)) return ShopBuyResult.NotEnoughMoney;

            switch (offer.Kind)
            {
                case ItemKind.Gene:
                    run.TryAddGene(offer.Id);
                    break;
                case ItemKind.Tech:
                    run.UpgradeType(_catalog.TechTypeOf(offer.Id));
                    break;
                case ItemKind.Mod:
                    run.TryAddConsumable(offer.Id);
                    break;
                case ItemKind.Block:
                    BlockEntry block = FindBlock(offer.Id);
                    run.AddBlock(block.Kind, block.Points);
                    break;
            }
            _goods[index] = offer.AsSold();
            return ShopBuyResult.Ok;
        }

        private static bool CanTakeGene(RunState run, int geneId) =>
            run.Genes.Count < run.Config.GeneSlots && run.Config.Effects.Find(EffectSource.Gene, geneId) != null;

        private BlockEntry FindBlock(int blockId)
        {
            foreach (BlockEntry b in _catalog.Blocks)
            {
                if (b.Id == blockId) return b;
            }
            throw new InvalidOperationException("目录里没有这块方块: " + blockId);
        }

        private static ShopOffer[] Roll(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty, bool guaranteeGene)
        {
            var goods = new ShopOffer[GoodsCount];
            bool hasGene = false;
            for (int i = 0; i < goods.Length; i++)
            {
                goods[i] = RollOne(rng, catalog, difficulty);
                if (goods[i].Kind == ItemKind.Gene) hasGene = true;
            }
            if (guaranteeGene && !hasGene && catalog.Genes.Count > 0)
            {
                goods[0] = GeneOffer(rng, catalog, difficulty);
            }
            return goods;
        }

        private static ShopOffer RollOne(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty)
        {
            // 权重按设计稿 §4.1:基因 60 / 方块 16 / 科技 12 / 改造 12
            int roll = rng.Index(100);
            if (roll < 60 && catalog.Genes.Count > 0) return GeneOffer(rng, catalog, difficulty);
            if (roll < 76 && catalog.Blocks.Count > 0) return BlockOffer(rng, catalog, difficulty);
            if (roll < 88 && catalog.Techs.Count > 0) return TechOffer(rng, catalog, difficulty);
            if (catalog.Mods.Count > 0) return ModOffer(rng, catalog, difficulty);
            if (catalog.Genes.Count > 0) return GeneOffer(rng, catalog, difficulty);
            if (catalog.Blocks.Count > 0) return BlockOffer(rng, catalog, difficulty);
            if (catalog.Techs.Count > 0) return TechOffer(rng, catalog, difficulty);
            throw new InvalidOperationException("目录里没有任何可卖的东西");
        }

        private static ShopOffer GeneOffer(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty)
        {
            CatalogEntry e = catalog.Genes[rng.Index(catalog.Genes.Count)];
            return new ShopOffer(ItemKind.Gene, e.Id, Price(e.Price, difficulty));
        }

        private static ShopOffer TechOffer(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty)
        {
            CatalogEntry e = catalog.Techs[rng.Index(catalog.Techs.Count)];
            return new ShopOffer(ItemKind.Tech, e.Id, Price(e.Price, difficulty));
        }

        private static ShopOffer ModOffer(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty)
        {
            CatalogEntry e = catalog.Mods[rng.Index(catalog.Mods.Count)];
            return new ShopOffer(ItemKind.Mod, e.Id, Price(e.Price, difficulty));
        }

        private static ShopOffer BlockOffer(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty)
        {
            BlockEntry e = catalog.Blocks[rng.Index(catalog.Blocks.Count)];
            return new ShopOffer(ItemKind.Block, e.Id, Price(e.Price, difficulty));
        }

        private static int Price(int basePrice, RunDifficulty difficulty) =>
            (int)((long)basePrice * DifficultyRules.Of(difficulty).PricePermille / 1000);
    }
}
