using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 商店货格的一件货。卖出后 <see cref="Sold"/> 为真,格子留着但不能再买。
    /// 基因可以带版本,方块可以带强化与版本(规则 §4.1、§4.4);其余种类两者恒为 None。
    /// </summary>
    public readonly struct ShopOffer
    {
        public readonly ItemKind Kind;
        public readonly int Id;
        public readonly int Price;
        public readonly bool Sold;
        public readonly Enhancement Enhancement;
        public readonly Edition Edition;

        public ShopOffer(ItemKind kind, int id, int price, bool sold = false, Enhancement enhancement = Enhancement.None,
            Edition edition = Edition.None)
        {
            Kind = kind;
            Id = id;
            Price = price;
            Sold = sold;
            Enhancement = enhancement;
            Edition = edition;
        }

        public ShopOffer AsSold() => new ShopOffer(Kind, Id, Price, true, Enhancement, Edition);
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
    /// 另挂一个补给包,买了当场开、选够次数或跳过就关。
    /// 科技软锁(规则 §4.2):对应类型这一局没打出过的科技不进货格与补给包。传说基因不进货格(规则 §2.5)。
    /// 版本与强化另走 <see cref="RngKeys.Edition"/> 那条流,出货那条流的消费次数不因它变。
    /// </summary>
    public sealed class ShopState
    {
        /// <summary>默认货格数(设计稿 §4.1)。扩货标签与柜台券在这上面加,所以是「本店」的 <see cref="Count"/>。</summary>
        public const int GoodsCount = 4;

        /// <summary>货格数的上限:扩货标签 +1、柜台券 +1。</summary>
        public const int MaxGoodsCount = GoodsCount + 2;

        // 版本、强化出现率(千分比,照 Balatro 1.0.1o 的量级折候选,待定标):基因 闪箔 20 / 镭射 14 / 多彩 3 / 负片 3;
        // 方块 闪箔 20 / 镭射 14 / 多彩 6,强化 200(四种均分)。
        private const int FoilPermille = 20;
        private const int HoloPermille = 14;
        private const int GenePolyPermille = 3;
        private const int NegativePermille = 3;
        private const int BlockPolyPermille = 6;
        private const int BlockEnhancementPermille = 200;

        /// <summary>基因包里每个候选换成传说的概率(千分比,待定标);池里没有传说时不掷。</summary>
        public const int LegendaryPermille = 30;

        private readonly ShopOffer[] _goods;
        private readonly ContentCatalog _catalog;
        private readonly RunDifficulty _difficulty;
        private readonly bool _guaranteeGene;
        private readonly bool _freeReroll;
        private readonly RunTuning _tuning;
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
            ShopOffer? voucher, ShopOffer? booster, BoosterPack pack, RunTuning tuning = null, bool freeReroll = false)
        {
            _goods = goods;
            _catalog = catalog;
            _difficulty = difficulty;
            _guaranteeGene = guaranteeGene;
            Rerolls = rerolls;
            _voucher = voucher;
            _booster = booster;
            _pack = pack;
            _tuning = tuning ?? RunTuning.Default;
            _freeReroll = freeReroll;
        }

        /// <summary>读档的还原口(<see cref="RunSnapshot"/>):货架、刷新次数、券、包与保底标记原样接上;目录与难度取自当局配置。</summary>
        internal static ShopState Restore(ShopOffer[] goods, int rerolls, bool guaranteeGene, ShopOffer? voucher,
            ShopOffer? booster, BoosterPack pack, ContentCatalog catalog, RunDifficulty difficulty, RunTuning tuning) =>
            new ShopState(goods, catalog, difficulty, guaranteeGene, rerolls, voucher, booster, pack, tuning);

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
            return new ShopState(goods, _catalog, _difficulty, _guaranteeGene, Rerolls, _voucher, _booster, pack, _tuning, _freeReroll);
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
            RunTuning tuning = run.Config.Tuning;
            int count = Math.Min(tuning.GoodsCount + 2, tuning.GoodsCount + extraGoods + run.Modifiers.ShopSlotBonus);
            int discount = Math.Max(1, discountPermille);
            int pricePermille = run.Modifiers.PricePermille * discount / 1000;
            ShopOffer[] goods = Roll(rng, run, guaranteeGene, pricePermille, discount, count);
            ShopOffer? voucher = offerVoucher && catalog.Vouchers.Count > 0
                ? (ShopOffer?)RollVoucher(rng, run, discount)
                : null;
            ShopOffer? booster = catalog.Boosters.Count > 0
                ? RollBooster(rng, run, freeBooster ? 0 : pricePermille)
                : null;
            return new ShopState(goods, catalog, run.Difficulty, guaranteeGene, 0, voucher, booster, null, tuning, freeReroll);
        }

        /// <summary>刷新货格并扣费。钱不够返回 false,货架与钱都不动;急售给的那一次免费且不记次数。</summary>
        public bool TryReroll(IRandomSource rng, RunState run)
        {
            if (rng == null) throw new ArgumentNullException(nameof(rng));
            if (run == null) throw new ArgumentNullException(nameof(run));
            int cost = RerollCostFor(run);
            if (!run.TrySpend(cost)) return false;
            ShopOffer[] fresh = Roll(rng, run, _guaranteeGene, run.Modifiers.PricePermille, RunPending.PermilleOne, _goods.Length);
            for (int i = 0; i < _goods.Length; i++) _goods[i] = fresh[i];
            if (!_freeReroll) Rerolls++;
            StepPipeline.AfterShopRerolled(run);
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
            ShopBuyResult fits = CanTake(offer, run);
            if (fits != ShopBuyResult.Ok) return fits;
            if (!run.TrySpend(offer.Price)) return ShopBuyResult.NotEnoughMoney;
            Take(offer, run);
            _goods[index] = offer.AsSold();
            return ShopBuyResult.Ok;
        }

        /// <summary>
        /// 这件东西现在放得下吗:基因看槽(负片不占槽),科技与改造看道具栏(规则 §2.5:消耗品都进道具栏),方块直接进库。
        /// 补给包里选的科技当场用掉(同 Balatro 的天体包),不进道具栏,所以只看等级到没到顶。
        /// </summary>
        internal static ShopBuyResult CanTake(ShopOffer offer, RunState run, bool fromPack = false)
        {
            switch (offer.Kind)
            {
                case ItemKind.Gene:
                    return run.CanTakeGene(offer.Id, offer.Edition) ? ShopBuyResult.Ok : ShopBuyResult.SlotFull;
                case ItemKind.Tech:
                    if (fromPack)
                    {
                        ClearType type = run.Config.Catalog.TechTypeOf(offer.Id);
                        return run.LevelOf(type) < run.Config.ClearTypes.MaxLevel(type) ? ShopBuyResult.Ok : ShopBuyResult.SlotFull;
                    }
                    return run.Consumables.Count < run.ConsumableSlots ? ShopBuyResult.Ok : ShopBuyResult.SlotFull;
                case ItemKind.Mod:
                    return run.Consumables.Count < run.ConsumableSlots ? ShopBuyResult.Ok : ShopBuyResult.SlotFull;
                case ItemKind.Block:
                    return ShopBuyResult.Ok;
                default:
                    return ShopBuyResult.UnknownOffer;
            }
        }

        /// <summary>把一件东西交给这一局;调用方已经查过 <see cref="CanTake"/>。</summary>
        internal static void Take(ShopOffer offer, RunState run, bool fromPack = false)
        {
            switch (offer.Kind)
            {
                case ItemKind.Gene:
                    run.TryAddGene(offer.Id, offer.Edition);
                    break;
                case ItemKind.Tech:
                    if (fromPack) run.UpgradeType(run.Config.Catalog.TechTypeOf(offer.Id));
                    else run.TryAddConsumable(ConsumableItem.Tech(offer.Id));
                    break;
                case ItemKind.Mod:
                    run.TryAddConsumable(ConsumableItem.Mod(offer.Id));
                    break;
                case ItemKind.Block:
                    BlockEntry block = FindBlock(run.Config.Catalog, offer.Id);
                    run.AddBlock(block.Kind, block.Points, offer.Enhancement, offer.Edition);
                    break;
            }
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
            _pack = BoosterPack.Open(rng, run, offer.Id);
            _booster = null;
            run.RecordBoosterOpened(offer.Id);
            if (_pack.IsClosed) _pack = null;
            return ShopBuyResult.Ok;
        }

        /// <summary>从正在开的包里选第 <paramref name="index"/> 件;选够次数或候选选空,包就关。</summary>
        public ShopBuyResult ChooseBooster(int index, RunState run)
        {
            if (_pack == null) return ShopBuyResult.SoldOut;
            ShopBuyResult result = _pack.Choose(index, run);
            if (result == ShopBuyResult.Ok && _pack.IsClosed) _pack = null;
            return result;
        }

        /// <summary>跳过正在开的包:剩下的候选作废,包关掉。没有在开的包返回 false。</summary>
        public bool SkipBooster()
        {
            if (_pack == null) return false;
            _pack = null;
            return true;
        }

        /// <summary>版本的附加费(照 Balatro 1.0.1o 的 +2 / +3 / +5 / +5,待定标);卖价也把它算进去。</summary>
        public static int EditionSurcharge(Edition edition)
        {
            switch (edition)
            {
                case Edition.Foil: return 2;
                case Edition.Holo: return 3;
                case Edition.Polychrome: return 5;
                case Edition.Negative: return 5;
                default: return 0;
            }
        }

        /// <summary>强化的附加费(待定标)。</summary>
        public static int EnhancementSurcharge(Enhancement enhancement) => enhancement == Enhancement.None ? 0 : 1;

        /// <summary>按难度与折扣折算的实付价,向下取整。</summary>
        internal static int PriceFor(int basePrice, RunDifficulty difficulty, int pricePermille, RunTuning tuning) =>
            (int)((long)basePrice * tuning.DifficultyOf(difficulty).PricePermille * pricePermille / 1000000);

        internal static BlockEntry FindBlock(ContentCatalog catalog, int blockId)
        {
            foreach (BlockEntry b in catalog.Blocks)
            {
                if (b.Id == blockId) return b;
            }
            throw new InvalidOperationException("目录里没有这块方块: " + blockId);
        }

        /// <summary>基因货的版本:闪箔、镭射、多彩、负片,大多数为 None。</summary>
        internal static Edition RollGeneEdition(IRandomSource rng)
        {
            int roll = rng.Index(1000);
            if (roll < NegativePermille) return Edition.Negative;
            if (roll < NegativePermille + GenePolyPermille) return Edition.Polychrome;
            if (roll < NegativePermille + GenePolyPermille + HoloPermille) return Edition.Holo;
            if (roll < NegativePermille + GenePolyPermille + HoloPermille + FoilPermille) return Edition.Foil;
            return Edition.None;
        }

        private static ShopOffer[] Roll(IRandomSource rng, RunState run, bool guaranteeGene, int pricePermille, int discountPermille,
            int count)
        {
            ContentCatalog catalog = run.Config.Catalog;
            IRandomSource looks = run.EditionRng();
            var goods = new ShopOffer[count];
            bool hasGene = false;
            for (int i = 0; i < goods.Length; i++)
            {
                goods[i] = RollOne(rng, looks, run, pricePermille, discountPermille);
                if (goods[i].Kind == ItemKind.Gene) hasGene = true;
            }
            if (guaranteeGene && !hasGene && HasShopGenes(catalog))
            {
                goods[0] = GeneOffer(rng, looks, run, discountPermille);
            }
            return goods;
        }

        private static ShopOffer RollOne(IRandomSource rng, IRandomSource looks, RunState run, int pricePermille, int discountPermille)
        {
            ContentCatalog catalog = run.Config.Catalog;
            RunTuning tuning = run.Config.Tuning;
            // 权重按设计稿 §4.1:基因 60 / 方块 16 / 科技 12 / 改造 12(数值在 RunTuning)
            int gene = tuning.WeightGene, block = tuning.WeightBlock, tech = tuning.WeightTech;
            bool hasGenes = HasShopGenes(catalog);
            bool hasTechs = run.UnlockedTechs().Count > 0;
            int roll = rng.Index(100);
            if (roll < gene && hasGenes) return GeneOffer(rng, looks, run, discountPermille);
            if (roll < gene + block && catalog.Blocks.Count > 0) return BlockOffer(rng, looks, run, pricePermille);
            if (roll < gene + block + tech && hasTechs) return TechOffer(rng, run, discountPermille);
            if (catalog.Mods.Count > 0) return ModOffer(rng, run, discountPermille);
            if (hasGenes) return GeneOffer(rng, looks, run, discountPermille);
            if (catalog.Blocks.Count > 0) return BlockOffer(rng, looks, run, pricePermille);
            if (hasTechs) return TechOffer(rng, run, discountPermille);
            throw new InvalidOperationException("目录里没有任何可卖的东西");
        }

        private static bool HasShopGenes(ContentCatalog catalog)
        {
            foreach (CatalogEntry e in catalog.Genes)
            {
                if (e.Rarity != Rarity.Legendary) return true;
            }
            return false;
        }

        /// <summary>
        /// 基因按稀有度抽:普通 70 / 罕见 25 / 稀有 5(千分比);稀券把它推到 60/30/10。传说不进商店。
        /// 池子里没有某一档时退回全部非传说基因,不至于抽空。
        /// </summary>
        private static ShopOffer GeneOffer(IRandomSource rng, IRandomSource looks, RunState run, int pricePermille)
        {
            ContentCatalog catalog = run.Config.Catalog;
            run.Config.Tuning.GeneWeights(run.Modifiers.ShiftRarity, out int common, out int uncommon, out int rare);
            int roll = rng.Index(1000);
            int tier = roll < common ? Rarity.Common : roll < common + uncommon ? Rarity.Uncommon : Rarity.Rare;
            CatalogEntry e = PickByRarity(rng, catalog, tier, run) ?? PickNonLegendary(rng, catalog, run);
            Edition edition = RollGeneEdition(looks);
            int price = PriceFor(e.Price + EditionSurcharge(edition), run.Difficulty, pricePermille, run.Config.Tuning);
            return new ShopOffer(ItemKind.Gene, e.Id, price, false, Enhancement.None, edition);
        }

        /// <summary>这张基因现在能进商店吗:传说不进;已经持有的,只有重现基因在时才再出现。</summary>
        private static bool GeneAvailable(CatalogEntry e, RunState run)
        {
            if (e.Rarity == Rarity.Legendary) return false;
            if (!run.IsGeneUnlocked(e.Id)) return false;
            if (run.ShopOffersOwned) return true;
            foreach (GeneSlot g in run.Genes)
            {
                if (g.GeneId == e.Id) return false;
            }
            return true;
        }

        /// <summary>在某个稀有度档里随机挑一个;这一档为空返回 null(调用方退回全池)。</summary>
        private static CatalogEntry? PickByRarity(IRandomSource rng, ContentCatalog catalog, int rarity, RunState run)
        {
            int count = 0;
            foreach (CatalogEntry e in catalog.Genes)
            {
                if (e.Rarity == rarity && GeneAvailable(e, run)) count++;
            }
            if (count == 0) return null;
            int index = rng.Index(count);
            foreach (CatalogEntry e in catalog.Genes)
            {
                if (e.Rarity != rarity || !GeneAvailable(e, run)) continue;
                if (index-- == 0) return e;
            }
            return null;
        }

        private static CatalogEntry PickNonLegendary(IRandomSource rng, ContentCatalog catalog, RunState run)
        {
            var pool = new List<CatalogEntry>();
            foreach (CatalogEntry e in catalog.Genes)
            {
                if (e.Rarity != Rarity.Legendary && GeneAvailable(e, run)) pool.Add(e);
            }
            if (pool.Count == 0)
            {
                foreach (CatalogEntry e in catalog.Genes)
                {
                    if (e.Rarity != Rarity.Legendary) pool.Add(e);
                }
            }
            return pool[rng.Index(pool.Count)];
        }

        private static ShopOffer TechOffer(IRandomSource rng, RunState run, int pricePermille)
        {
            List<int> unlocked = run.UnlockedTechs();
            int id = unlocked[rng.Index(unlocked.Count)];
            CatalogEntry e = run.Config.Catalog.Find(ItemKind.Tech, id).Value;
            int price = run.TechFree ? 0 : PriceFor(e.Price, run.Difficulty, pricePermille, run.Config.Tuning);
            return new ShopOffer(ItemKind.Tech, e.Id, price);
        }

        private static ShopOffer ModOffer(IRandomSource rng, RunState run, int pricePermille)
        {
            IReadOnlyList<CatalogEntry> mods = run.Config.Catalog.Mods;
            CatalogEntry e = mods[rng.Index(mods.Count)];
            return new ShopOffer(ItemKind.Mod, e.Id, PriceFor(e.Price, run.Difficulty, pricePermille, run.Config.Tuning));
        }

        private static ShopOffer BlockOffer(IRandomSource rng, IRandomSource looks, RunState run, int pricePermille)
        {
            IReadOnlyList<BlockEntry> blocks = run.Config.Catalog.Blocks;
            BlockEntry e = blocks[rng.Index(blocks.Count)];
            Enhancement enhancement = looks.Index(1000) < BlockEnhancementPermille ? (Enhancement)(1 + looks.Index(4)) : Enhancement.None;
            int roll = looks.Index(1000);
            Edition edition = roll < BlockPolyPermille ? Edition.Polychrome
                : roll < BlockPolyPermille + HoloPermille ? Edition.Holo
                : roll < BlockPolyPermille + HoloPermille + FoilPermille ? Edition.Foil
                : Edition.None;
            int price = PriceFor(e.Price + EnhancementSurcharge(enhancement) + EditionSurcharge(edition), run.Difficulty, pricePermille,
                run.Config.Tuning) + run.BlockPriceDelta;
            return new ShopOffer(ItemKind.Block, e.Id, Math.Max(0, price), false, enhancement, edition);
        }

        private static ShopOffer RollVoucher(IRandomSource rng, RunState run, int pricePermille)
        {
            IReadOnlyList<CatalogEntry> vouchers = run.Config.Catalog.Vouchers;
            CatalogEntry e = vouchers[rng.Index(vouchers.Count)];
            return new ShopOffer(ItemKind.Voucher, e.Id, PriceFor(e.Price, run.Difficulty, pricePermille, run.Config.Tuning));
        }

        /// <summary>挂哪个补给包。科技包在没有已解锁科技时打开是空的,这时不挂它、改挂别的;一个都挂不了返回 null。</summary>
        private static ShopOffer? RollBooster(IRandomSource rng, RunState run, int pricePermille)
        {
            IReadOnlyList<CatalogEntry> boosters = run.Config.Catalog.Boosters;
            CatalogEntry e = boosters[rng.Index(boosters.Count)];
            if (e.Id == BoosterPack.TechPack && run.UnlockedTechs().Count == 0)
            {
                CatalogEntry? other = null;
                foreach (CatalogEntry b in boosters)
                {
                    if (b.Id != BoosterPack.TechPack) { other = b; break; }
                }
                if (other == null) return null;
                e = other.Value;
            }
            int price = (e.Id == BoosterPack.TechPack || e.Id == BoosterPack.MixedPack) && run.TechFree ? 0
                : PriceFor(e.Price, run.Difficulty, pricePermille, run.Config.Tuning);
            return new ShopOffer(ItemKind.Booster, e.Id, price);
        }
    }
}
