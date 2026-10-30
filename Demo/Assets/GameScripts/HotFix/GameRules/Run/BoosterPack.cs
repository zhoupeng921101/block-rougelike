using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 一个已经买下、正在开的补给包(设计稿 §7.3):包里是几件候选,选够次数就关,也可以跳过。
    /// 号写死:1 基因包(3 选 1)、2 科技包(2 选 1)、3 改造包(3 选 1)、4 方块包(4 选 2)、5 混合包(5 选 1)。
    /// 选项的价格为 0:钱在买包时已经付过。科技遵守软锁;基因包的每个候选有小概率换成传说(规则 §2.5)。
    /// 包里选的科技当场用掉,同 Balatro 1.0.1o 的天体包。
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

        /// <summary>选够了,或者候选已经选空。</summary>
        public bool IsClosed => PicksLeft <= 0 || _options.Count == 0;

        private BoosterPack(int boosterId, List<ShopOffer> options, int picksLeft)
        {
            BoosterId = boosterId;
            _options = options;
            PicksLeft = picksLeft;
        }

        /// <summary>按包号摇出候选。选项的 id 在同类池子里不重复;传说与版本走 <see cref="RunState.EditionRng"/>。</summary>
        public static BoosterPack Open(IRandomSource rng, RunState run, int boosterId)
        {
            if (rng == null) throw new ArgumentNullException(nameof(rng));
            if (run == null) throw new ArgumentNullException(nameof(run));
            ContentCatalog catalog = run.Config.Catalog;
            switch (boosterId)
            {
                case GenePack:
                    return new BoosterPack(boosterId, GeneOptions(rng, run, 3), 1);
                case TechPack:
                    return new BoosterPack(boosterId, Distinct(rng, UnlockedTechEntries(run), 2), 1);
                case ModPack:
                    return new BoosterPack(boosterId, Distinct(rng, catalog.Mods, 3), 1);
                case BlockPack:
                    return new BoosterPack(boosterId, DistinctBlocks(rng, catalog.Blocks, 4), 2);
                case MixedPack:
                    return new BoosterPack(boosterId, Mixed(rng, run, 5), 1);
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
            ShopBuyResult fits = ShopState.CanTake(offer, run, fromPack: true);
            if (fits != ShopBuyResult.Ok) return fits;
            ShopState.Take(offer, run, fromPack: true);
            _options.RemoveAt(index);
            PicksLeft--;
            return ShopBuyResult.Ok;
        }

        internal static BoosterPack Restore(int boosterId, int picksLeft, List<ShopOffer> options) =>
            new BoosterPack(boosterId, options, picksLeft);

        /// <summary>
        /// 基因包:先从非传说里不重复地抽,再逐个按 <see cref="ShopState.LegendaryPermille"/> 换成一张还没出现的传说;
        /// 每个候选另掷版本。
        /// </summary>
        private static List<ShopOffer> GeneOptions(IRandomSource rng, RunState run, int count)
        {
            var normal = new List<CatalogEntry>();
            var legendary = new List<CatalogEntry>();
            foreach (CatalogEntry e in run.Config.Catalog.Genes)
            {
                if (!run.IsGeneUnlocked(e.Id)) continue;
                if (!run.ShopOffersOwned && Owned(run, e.Id)) continue;
                if (e.Rarity == Rarity.Legendary) legendary.Add(e);
                else normal.Add(e);
            }
            if (normal.Count == 0)
            {
                // 全持有且没有重现时,包里总得有点东西:退回全池(与原作允许重复一致)
                foreach (CatalogEntry e in run.Config.Catalog.Genes)
                {
                    if (e.Rarity != Rarity.Legendary && run.IsGeneUnlocked(e.Id)) normal.Add(e);
                }
            }
            List<ShopOffer> options = Distinct(rng, normal, count);
            IRandomSource looks = run.EditionRng();
            for (int i = 0; i < options.Count; i++)
            {
                int id = options[i].Id;
                if (legendary.Count > 0 && looks.Index(1000) < ShopState.LegendaryPermille)
                {
                    int pick = looks.Index(legendary.Count);
                    id = legendary[pick].Id;
                    legendary.RemoveAt(pick);
                }
                options[i] = new ShopOffer(ItemKind.Gene, id, 0, false, Enhancement.None, ShopState.RollGeneEdition(looks));
            }
            return options;
        }

        private static bool Owned(RunState run, int geneId)
        {
            foreach (GeneSlot g in run.Genes)
            {
                if (g.GeneId == geneId) return true;
            }
            return false;
        }

        private static List<CatalogEntry> UnlockedTechEntries(RunState run)
        {
            var list = new List<CatalogEntry>();
            foreach (int id in run.UnlockedTechs()) list.Add(run.Config.Catalog.Find(ItemKind.Tech, id).Value);
            return list;
        }

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

        /// <summary>混合包:非传说基因、已解锁的科技、改造混在一起洗,取前几件。</summary>
        private static List<ShopOffer> Mixed(IRandomSource rng, RunState run, int count)
        {
            ContentCatalog catalog = run.Config.Catalog;
            var pool = new List<ShopOffer>();
            foreach (CatalogEntry e in catalog.Genes)
            {
                if (e.Rarity != Rarity.Legendary && run.IsGeneUnlocked(e.Id) && (run.ShopOffersOwned || !Owned(run, e.Id)))
                {
                    pool.Add(new ShopOffer(e.Kind, e.Id, 0));
                }
            }
            foreach (CatalogEntry e in UnlockedTechEntries(run)) pool.Add(new ShopOffer(e.Kind, e.Id, 0));
            foreach (CatalogEntry e in catalog.Mods) pool.Add(new ShopOffer(e.Kind, e.Id, 0));
            rng.Shuffle(pool);
            int take = Math.Min(count, pool.Count);
            pool.RemoveRange(take, pool.Count - take);
            return pool;
        }
    }
}
