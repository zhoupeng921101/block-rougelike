using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 一个已经买下、正在开的补给包(设计稿 §7.3):包里是几件候选,选够次数就关。
    /// 号写死:1 基因包(3 选 1)、2 科技包(2 选 1)、3 改造包(3 选 1)、4 方块包(4 选 2)、5 混合包(5 选 1)。
    /// 选项的价格为 0:钱在买包时已经付过。
    /// </summary>
    public sealed class BoosterPack
    {
        public const int GenePack = 1;
        public const int TechPack = 2;
        public const int ModPack = 3;
        public const int BlockPack = 4;
        public const int MixedPack = 5;

        private readonly List<ShopOffer> _options;

        public int BoosterId { get; }

        public IReadOnlyList<ShopOffer> Options => _options;

        public int PicksLeft { get; private set; }

        public bool IsClosed => PicksLeft <= 0;

        private BoosterPack(int boosterId, List<ShopOffer> options, int picksLeft)
        {
            BoosterId = boosterId;
            _options = options;
            PicksLeft = picksLeft;
        }

        /// <summary>按包号摇出候选。选项的 id 在同类池子里不重复。</summary>
        public static BoosterPack Open(IRandomSource rng, ContentCatalog catalog, int boosterId)
        {
            if (rng == null) throw new ArgumentNullException(nameof(rng));
            if (catalog == null) throw new ArgumentNullException(nameof(catalog));
            switch (boosterId)
            {
                case GenePack:
                    return new BoosterPack(boosterId, Distinct(rng, catalog.Genes, 3), 1);
                case TechPack:
                    return new BoosterPack(boosterId, Distinct(rng, catalog.Techs, 2), 1);
                case ModPack:
                    return new BoosterPack(boosterId, Distinct(rng, catalog.Mods, 3), 1);
                case BlockPack:
                    return new BoosterPack(boosterId, DistinctBlocks(rng, catalog.Blocks, 4), 2);
                case MixedPack:
                    return new BoosterPack(boosterId, Mixed(rng, catalog, 5), 1);
                default:
                    throw new ArgumentOutOfRangeException(nameof(boosterId), boosterId, "没有这种补给包");
            }
        }

        /// <summary>选第 <paramref name="index"/> 个候选。放不下时返回对应的失败码,不消耗选择次数。</summary>
        public ShopBuyResult Choose(int index, RunState run)
        {
            if (run == null) throw new ArgumentNullException(nameof(run));
            if (IsClosed) return ShopBuyResult.SoldOut;
            if (index < 0 || index >= _options.Count) return ShopBuyResult.UnknownOffer;
            ShopOffer offer = _options[index];

            switch (offer.Kind)
            {
                case ItemKind.Gene:
                    if (run.Genes.Count >= run.GeneSlots || run.Config.Effects.Find(EffectSource.Gene, offer.Id) == null)
                    {
                        return ShopBuyResult.SlotFull;
                    }
                    run.TryAddGene(offer.Id);
                    break;
                case ItemKind.Tech:
                    ClearType type = run.Config.Catalog.TechTypeOf(offer.Id);
                    if (run.LevelOf(type) >= run.Config.ClearTypes.MaxLevel(type)) return ShopBuyResult.SlotFull;
                    run.UpgradeType(type);
                    break;
                case ItemKind.Mod:
                    if (run.Consumables.Count >= run.ConsumableSlots) return ShopBuyResult.SlotFull;
                    run.TryAddConsumable(offer.Id);
                    break;
                case ItemKind.Block:
                    BlockEntry block = FindBlock(run.Config.Catalog, offer.Id);
                    run.AddBlock(block.Kind, block.Points);
                    break;
                default:
                    return ShopBuyResult.UnknownOffer;
            }

            _options.RemoveAt(index);
            PicksLeft--;
            return ShopBuyResult.Ok;
        }

        internal static BoosterPack Restore(int boosterId, int picksLeft, List<ShopOffer> options) =>
            new BoosterPack(boosterId, options, picksLeft);

        private static List<ShopOffer> Distinct(IRandomSource rng, IReadOnlyList<CatalogEntry> pool, int count)
        {
            int take = Math.Min(count, pool.Count);
            var indices = new List<int>(pool.Count);
            for (int i = 0; i < pool.Count; i++) indices.Add(i);
            rng.Shuffle(indices);
            var options = new List<ShopOffer>(take);
            for (int i = 0; i < take; i++)
            {
                CatalogEntry e = pool[indices[i]];
                options.Add(new ShopOffer(e.Kind, e.Id, 0));
            }
            return options;
        }

        private static List<ShopOffer> DistinctBlocks(IRandomSource rng, IReadOnlyList<BlockEntry> pool, int count)
        {
            int take = Math.Min(count, pool.Count);
            var indices = new List<int>(pool.Count);
            for (int i = 0; i < pool.Count; i++) indices.Add(i);
            rng.Shuffle(indices);
            var options = new List<ShopOffer>(take);
            for (int i = 0; i < take; i++)
            {
                BlockEntry e = pool[indices[i]];
                options.Add(new ShopOffer(ItemKind.Block, e.Id, 0));
            }
            return options;
        }

        private static List<ShopOffer> Mixed(IRandomSource rng, ContentCatalog catalog, int count)
        {
            var pool = new List<ShopOffer>();
            foreach (CatalogEntry e in catalog.Genes) pool.Add(new ShopOffer(e.Kind, e.Id, 0));
            foreach (CatalogEntry e in catalog.Techs) pool.Add(new ShopOffer(e.Kind, e.Id, 0));
            foreach (CatalogEntry e in catalog.Mods) pool.Add(new ShopOffer(e.Kind, e.Id, 0));
            rng.Shuffle(pool);
            int take = Math.Min(count, pool.Count);
            pool.RemoveRange(take, pool.Count - take);
            return pool;
        }

        private static BlockEntry FindBlock(ContentCatalog catalog, int blockId)
        {
            foreach (BlockEntry b in catalog.Blocks)
            {
                if (b.Id == blockId) return b;
            }
            throw new InvalidOperationException("目录里没有这块方块: " + blockId);
        }
    }
}
