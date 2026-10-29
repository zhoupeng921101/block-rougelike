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
    /// 一个商店的货架(局外循环设计稿 §4):4 个货格,权重 基因 60 / 方块 16 / 科技 12 / 改造 12;另挂一张优惠券(每段第一场)。
    /// 刷新只换货格,第一次 $5、之后每次 +$1,议价券再减;买货先查放不放得下,再扣钱,失败不改状态。
    /// 另挂一个补给包,买了当场开、选够次数关。
    /// </summary>
    public sealed class ShopState
    {
        /// <summary>默认货格数(设计稿 §4.1)。扩货标签与柜台券在这上面加,所以是「本店」的 <see cref="Count"/>。</summary>
        public const int GoodsCount = 4;

        /// <summary>货格数的上限:扩货标签 +1、柜台券 +1。</summary>
        public const int MaxGoodsCount = GoodsCount + 2;

        private readonly ShopOffer[] _goods;
        private readonly ContentCatalog _catalog;
        private readonly RunDifficulty _difficulty;
        private readonly bool _guaranteeGene;
        private readonly bool _freeReroll;
        private ShopOffer? _voucher;
        private ShopOffer? _booster;
        private BoosterPack _pack;

        public IReadOnlyList<ShopOffer> Goods => _goods;

        /// <summary>本店实际的货格数(4 起,扩货 / 柜台券可能加到 6)。</summary>
        public int Count => _goods.Length;

        /// <summary>本店挂着的补给包;买了就变成正在开的 <see cref="Pack"/>。</summary>
        public ShopOffer? Booster => _booster;

        /// <summary>正在开的补给包;没买或已经选完是 null。</summary>
        public BoosterPack Pack => _pack;

        /// <summary>已经刷新过几次;刷新费 = 5 + 这个数(再减议价券)。</summary>
        public int Rerolls { get; private set; }

        /// <summary>不带券的刷新费,界面上按 <see cref="RerollCostFor"/> 显示实付。</summary>
        public int RerollCost => 5 + Rerolls;

        /// <summary>本店的刷新费(按当局的券算;急售标签给的那一次是 0)。</summary>
        public int RerollCostFor(RunState run) => _freeReroll ? 0 : Math.Max(0, RerollCost - run.Modifiers.RerollDiscount);

        /// <summary>本店刷新免费且不涨价(急售标签)。免费刷新不累计次数,价格不跟着涨。</summary>
        public bool IsFreeReroll => _freeReroll;

        /// <summary>本店挂着的优惠券;没有就是 null。每段第一场才挂一张。</summary>
        public ShopOffer? Voucher => _voucher;

        /// <summary>开局前几场的保底基因;进存档,读档后刷新照样保底。</summary>
        public bool GuaranteeGene => _guaranteeGene;

        private ShopState(ShopOffer[] goods, ContentCatalog catalog, RunDifficulty difficulty, bool guaranteeGene, int rerolls,
            ShopOffer? voucher, ShopOffer? booster, BoosterPack pack, bool freeReroll = false)
        {
            _goods = goods;
            _catalog = catalog;
            _difficulty = difficulty;
            _guaranteeGene = guaranteeGene;
            Rerolls = rerolls;
            _voucher = voucher;
            _booster = booster;
            _pack = pack;
            _freeReroll = freeReroll;
        }

        /// <summary>读档的还原口(<see cref="RunSnapshot"/>):货架、刷新次数、券、包与保底标记原样接上;目录与难度取自当局配置。</summary>
        internal static ShopState Restore(ShopOffer[] goods, int rerolls, bool guaranteeGene, ShopOffer? voucher,
            ShopOffer? booster, BoosterPack pack, ContentCatalog catalog, RunDifficulty difficulty) =>
            new ShopState(goods, catalog, difficulty, guaranteeGene, rerolls, voucher, booster, pack);

        /// <summary>深拷贝货架(卖掉的标记与开了一半的包也要拷),给 <see cref="RunState.Clone"/> 的试走用。</summary>
        internal ShopState Clone()
        {
            var goods = new ShopOffer[_goods.Length];
            for (int i = 0; i < goods.Length; i++) goods[i] = _goods[i];
            BoosterPack pack = null;
            if (_pack != null)
            {
                var options = new List<ShopOffer>(_pack.Options);
                pack = BoosterPack.Restore(_pack.BoosterId, _pack.PicksLeft, options);
            }
            return new ShopState(goods, _catalog, _difficulty, _guaranteeGene, Rerolls, _voucher, _booster, pack, _freeReroll);
        }

        /// <summary>
        /// 开一个新商店。<paramref name="guaranteeGene"/> 用于开局前几场:至少给一个基因格;
        /// <paramref name="offerVoucher"/> 用于每段第一场:挂一张券。
        /// 后四个参数是跳到标签换来的:折扣、加格、免费刷新、免费补给包;柜台券另算进格数。
        /// </summary>
        public static ShopState Open(IRandomSource rng, RunState run, bool guaranteeGene, bool offerVoucher,
            int discountPermille = RunPending.PermilleOne, int extraGoods = 0, bool freeReroll = false, bool freeBooster = false)
        {
            if (rng == null) throw new ArgumentNullException(nameof(rng));
            if (run == null) throw new ArgumentNullException(nameof(run));
            ContentCatalog catalog = run.Config.Catalog;
            int count = Math.Min(MaxGoodsCount, GoodsCount + extraGoods + run.Modifiers.ShopSlotBonus);
            int pricePermille = run.Modifiers.PricePermille * Math.Max(1, discountPermille) / 1000;
            ShopOffer[] goods = Roll(rng, catalog, run.Difficulty, guaranteeGene, pricePermille, count, run.Modifiers.ShiftRarity);
            ShopOffer? voucher = offerVoucher && catalog.Vouchers.Count > 0
                ? (ShopOffer?)RollVoucher(rng, catalog, run.Difficulty, pricePermille)
                : null;
            ShopOffer? booster = catalog.Boosters.Count > 0
                ? (ShopOffer?)RollBooster(rng, catalog, run.Difficulty, freeBooster ? 0 : pricePermille)
                : null;
            return new ShopState(goods, catalog, run.Difficulty, guaranteeGene, 0, voucher, booster, null, freeReroll);
        }

        /// <summary>刷新货格并扣费。钱不够返回 false,货架与钱都不动;急售给的那一次免费且不记次数。</summary>
        public bool TryReroll(IRandomSource rng, RunState run)
        {
            if (rng == null) throw new ArgumentNullException(nameof(rng));
            if (run == null) throw new ArgumentNullException(nameof(run));
            int cost = RerollCostFor(run);
            if (!run.TrySpend(cost)) return false;
            ShopOffer[] fresh = Roll(rng, _catalog, _difficulty, _guaranteeGene, run.Modifiers.PricePermille, _goods.Length,
                run.Modifiers.ShiftRarity);
            for (int i = 0; i < _goods.Length; i++) _goods[i] = fresh[i];
            if (!_freeReroll) Rerolls++;
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
                    if (run.Consumables.Count >= run.ConsumableSlots) return ShopBuyResult.SlotFull;
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

        /// <summary>买本店挂着的优惠券。没有券、已经持有、钱不够都返回对应的失败码。</summary>
        public ShopBuyResult TryBuyVoucher(RunState run)
        {
            if (run == null) throw new ArgumentNullException(nameof(run));
            if (_voucher == null) return ShopBuyResult.SoldOut;
            ShopOffer offer = _voucher.Value;
            if (run.HasVoucher(offer.Id)) return ShopBuyResult.SoldOut;
            if (offer.Price > run.Money) return ShopBuyResult.NotEnoughMoney;
            if (!run.TrySpend(offer.Price)) return ShopBuyResult.NotEnoughMoney;
            if (!run.TryAddVoucher(offer.Id)) return ShopBuyResult.UnknownOffer;
            _voucher = null;
            return ShopBuyResult.Ok;
        }

        /// <summary>买本店的补给包:扣钱后立刻开包,包里是几件候选,由 <see cref="ChooseBooster"/> 选。</summary>
        public ShopBuyResult TryBuyBooster(IRandomSource rng, RunState run)
        {
            if (rng == null) throw new ArgumentNullException(nameof(rng));
            if (run == null) throw new ArgumentNullException(nameof(run));
            if (_pack != null) return ShopBuyResult.UnknownOffer;
            if (_booster == null) return ShopBuyResult.SoldOut;
            ShopOffer offer = _booster.Value;
            if (offer.Price > run.Money) return ShopBuyResult.NotEnoughMoney;
            if (!run.TrySpend(offer.Price)) return ShopBuyResult.NotEnoughMoney;
            _pack = BoosterPack.Open(rng, _catalog, offer.Id);
            _booster = null;
            return ShopBuyResult.Ok;
        }

        /// <summary>从正在开的包里选第 <paramref name="index"/> 件;选够次数包就关。</summary>
        public ShopBuyResult ChooseBooster(int index, RunState run)
        {
            if (_pack == null) return ShopBuyResult.SoldOut;
            ShopBuyResult result = _pack.Choose(index, run);
            if (result == ShopBuyResult.Ok && _pack.IsClosed) _pack = null;
            return result;
        }

        private static bool CanTakeGene(RunState run, int geneId) =>
            run.Genes.Count < run.GeneSlots && run.Config.Effects.Find(EffectSource.Gene, geneId) != null;

        private BlockEntry FindBlock(int blockId)
        {
            foreach (BlockEntry b in _catalog.Blocks)
            {
                if (b.Id == blockId) return b;
            }
            throw new InvalidOperationException("目录里没有这块方块: " + blockId);
        }

        private static ShopOffer[] Roll(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty, bool guaranteeGene,
            int pricePermille, int count, bool shiftRarity = false)
        {
            var goods = new ShopOffer[count];
            bool hasGene = false;
            for (int i = 0; i < goods.Length; i++)
            {
                goods[i] = RollOne(rng, catalog, difficulty, pricePermille, shiftRarity);
                if (goods[i].Kind == ItemKind.Gene) hasGene = true;
            }
            if (guaranteeGene && !hasGene && catalog.Genes.Count > 0)
            {
                goods[0] = GeneOffer(rng, catalog, difficulty, pricePermille, shiftRarity);
            }
            return goods;
        }

        private static ShopOffer RollOne(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty, int pricePermille,
            bool shiftRarity)
        {
            // 权重按设计稿 §4.1:基因 60 / 方块 16 / 科技 12 / 改造 12
            int roll = rng.Index(100);
            if (roll < 60 && catalog.Genes.Count > 0) return GeneOffer(rng, catalog, difficulty, pricePermille, shiftRarity);
            if (roll < 76 && catalog.Blocks.Count > 0) return BlockOffer(rng, catalog, difficulty, pricePermille);
            if (roll < 88 && catalog.Techs.Count > 0) return TechOffer(rng, catalog, difficulty, pricePermille);
            if (catalog.Mods.Count > 0) return ModOffer(rng, catalog, difficulty, pricePermille);
            if (catalog.Genes.Count > 0) return GeneOffer(rng, catalog, difficulty, pricePermille, shiftRarity);
            if (catalog.Blocks.Count > 0) return BlockOffer(rng, catalog, difficulty, pricePermille);
            if (catalog.Techs.Count > 0) return TechOffer(rng, catalog, difficulty, pricePermille);
            throw new InvalidOperationException("目录里没有任何可卖的东西");
        }

        /// <summary>
        /// 基因按稀有度抽:普通 70 / 罕见 25 / 稀有 5(千分比);稀券把它推到 60/30/10。
        /// 池子里没有某一档时把那一档的权重并回去,不至于抽空。
        /// </summary>
        private static ShopOffer GeneOffer(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty, int pricePermille,
            bool shiftRarity)
        {
            int common = shiftRarity ? 600 : 700;
            int uncommon = shiftRarity ? 300 : 250;
            int rare = shiftRarity ? 100 : 50;
            int roll = rng.Index(1000);
            int tier = roll < common ? 0 : roll < common + uncommon ? 1 : 2;
            CatalogEntry? pick = PickByRarity(rng, catalog, tier);
            if (!pick.HasValue) pick = catalog.Genes[rng.Index(catalog.Genes.Count)];
            CatalogEntry e = pick.Value;
            return new ShopOffer(ItemKind.Gene, e.Id, Price(e.Price, difficulty, pricePermille));
        }

        /// <summary>在某个稀有度档里随机挑一个;这一档为空返回 null(调用方退回全池)。</summary>
        private static CatalogEntry? PickByRarity(IRandomSource rng, ContentCatalog catalog, int rarity)
        {
            int count = 0;
            foreach (CatalogEntry e in catalog.Genes)
            {
                if (e.Rarity == rarity) count++;
            }
            if (count == 0) return null;
            int index = rng.Index(count);
            foreach (CatalogEntry e in catalog.Genes)
            {
                if (e.Rarity != rarity) continue;
                if (index-- == 0) return e;
            }
            return null;
        }

        private static ShopOffer TechOffer(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty, int pricePermille)
        {
            CatalogEntry e = catalog.Techs[rng.Index(catalog.Techs.Count)];
            return new ShopOffer(ItemKind.Tech, e.Id, Price(e.Price, difficulty, pricePermille));
        }

        private static ShopOffer ModOffer(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty, int pricePermille)
        {
            CatalogEntry e = catalog.Mods[rng.Index(catalog.Mods.Count)];
            return new ShopOffer(ItemKind.Mod, e.Id, Price(e.Price, difficulty, pricePermille));
        }

        private static ShopOffer BlockOffer(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty, int pricePermille)
        {
            BlockEntry e = catalog.Blocks[rng.Index(catalog.Blocks.Count)];
            return new ShopOffer(ItemKind.Block, e.Id, Price(e.Price, difficulty, pricePermille));
        }

        private static ShopOffer RollVoucher(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty, int pricePermille)
        {
            CatalogEntry e = catalog.Vouchers[rng.Index(catalog.Vouchers.Count)];
            return new ShopOffer(ItemKind.Voucher, e.Id, Price(e.Price, difficulty, pricePermille));
        }

        private static ShopOffer RollBooster(IRandomSource rng, ContentCatalog catalog, RunDifficulty difficulty, int pricePermille)
        {
            CatalogEntry e = catalog.Boosters[rng.Index(catalog.Boosters.Count)];
            return new ShopOffer(ItemKind.Booster, e.Id, Price(e.Price, difficulty, pricePermille));
        }

        private static int Price(int basePrice, RunDifficulty difficulty, int pricePermille) =>
            (int)((long)basePrice * DifficultyRules.Of(difficulty).PricePermille * pricePermille / 1000000);
    }
}
