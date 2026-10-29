using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 阶段 5 的最小内容集(工程计划:基因/科技/改造各做最小集,只为验证钩子与商店)。
    /// 基因 8 张都是平推的加/乘,不碰成长与代价;科技 4 张各升一种消除类型;方块按七种骨牌 × 点数 1–4 定价。
    /// 改造、补给包、优惠券的目录先留空,等它们的效果接上再加。数值全是占位,阶段 6 定标。
    /// </summary>
    public static class MinimalContent
    {
        public const int GeneCount = 8;
        public const int TechCount = 4;

        public static ContentCatalog Catalog { get; } = BuildCatalog();

        public static EffectRegistry Effects { get; } = BuildEffects();

        /// <summary>科技要能升级,类型表就得有 2 级以上:四条对应科技的线各给 3 级,其余仍只有 1 级。</summary>
        public static ClearTypeTable ClearTypes { get; } = BuildClearTypes();

        /// <summary>带最小基因效果与商店目录的规则配置(阶段 5 的 Demo 与单测用它;阶段 3 的 PlaceholderTuning.Config 保持空效果)。</summary>
        public static RuleConfig Config { get; } = new RuleConfig(BuildLibrary(), ClearTypes, Effects, catalog: Catalog);

        private static EffectRegistry BuildEffects()
        {
            var effects = new EffectRegistry();
            effects.Register(EffectSource.Gene, 1, new FlatGene(chips: 10));
            effects.Register(EffectSource.Gene, 2, new FlatGene(chips: 20));
            effects.Register(EffectSource.Gene, 3, new FlatGene(chips: 30));
            effects.Register(EffectSource.Gene, 4, new FlatGene(mult: 2));
            effects.Register(EffectSource.Gene, 5, new FlatGene(mult: 3));
            effects.Register(EffectSource.Gene, 6, new FlatGene(mult: 4));
            effects.Register(EffectSource.Gene, 7, new FlatGene(xMultPermille: 1500));
            effects.Register(EffectSource.Gene, 8, new FlatGene(chips: 2, mult: 1));
            return effects;
        }

        private static ContentCatalog BuildCatalog()
        {
            var genes = new List<CatalogEntry>
            {
                new CatalogEntry(ItemKind.Gene, 1, 4),
                new CatalogEntry(ItemKind.Gene, 2, 4),
                new CatalogEntry(ItemKind.Gene, 3, 5),
                new CatalogEntry(ItemKind.Gene, 4, 4),
                new CatalogEntry(ItemKind.Gene, 5, 5),
                new CatalogEntry(ItemKind.Gene, 6, 6),
                new CatalogEntry(ItemKind.Gene, 7, 8, 2),
                new CatalogEntry(ItemKind.Gene, 8, 3),
            };
            var techs = new List<CatalogEntry>
            {
                new CatalogEntry(ItemKind.Tech, 1, 3),
                new CatalogEntry(ItemKind.Tech, 2, 3),
                new CatalogEntry(ItemKind.Tech, 3, 3),
                new CatalogEntry(ItemKind.Tech, 4, 3),
            };
            var techTypes = new Dictionary<int, ClearType>
            {
                { 1, ClearType.SingleLine },
                { 2, ClearType.DoubleLine },
                { 3, ClearType.TripleLine },
                { 4, ClearType.AllClear },
            };
            var mods = new List<CatalogEntry>
            {
                new CatalogEntry(ItemKind.Mod, 1, 3),
                new CatalogEntry(ItemKind.Mod, 2, 3),
                new CatalogEntry(ItemKind.Mod, 3, 3),
                new CatalogEntry(ItemKind.Mod, 4, 4),
                new CatalogEntry(ItemKind.Mod, 5, 4),
                new CatalogEntry(ItemKind.Mod, 6, 5),
            };
            var blocks = new List<BlockEntry>(Tetromino.KindCount * 4);
            int id = 1;
            for (int kind = 0; kind < Tetromino.KindCount; kind++)
            {
                for (int points = 1; points <= 4; points++)
                {
                    blocks.Add(new BlockEntry(id++, (TetrominoKind)kind, points, 3 + points));
                }
            }
            var vouchers = new List<CatalogEntry>();
            foreach (int voucherId in new[]
                     {
                         VoucherCatalog.GeneSlot, VoucherCatalog.ConsumableSlot, VoucherCatalog.GroupSize, VoucherCatalog.InterestCap,
                         VoucherCatalog.Reroll, VoucherCatalog.Discard, VoucherCatalog.LightTarget, VoucherCatalog.Wholesale, VoucherCatalog.StartMoney,
                     })
            {
                vouchers.Add(new CatalogEntry(ItemKind.Voucher, voucherId, VoucherCatalog.Price));
            }
            var boosters = new List<CatalogEntry>
            {
                new CatalogEntry(ItemKind.Booster, BoosterPack.GenePack, 6),
                new CatalogEntry(ItemKind.Booster, BoosterPack.TechPack, 4),
                new CatalogEntry(ItemKind.Booster, BoosterPack.ModPack, 4),
                new CatalogEntry(ItemKind.Booster, BoosterPack.BlockPack, 5),
                new CatalogEntry(ItemKind.Booster, BoosterPack.MixedPack, 8),
            };
            return new ContentCatalog(genes, techs, mods, boosters, vouchers, blocks, techTypes);
        }

        private static ClearTypeTable BuildClearTypes()
        {
            var level1 = new (ClearType Type, long Chips, long Mult)[]
            {
                (ClearType.AllClear, 60, 4),
                (ClearType.FiveLine, 55, 4),
                (ClearType.SameShapeCross, 50, 4),
                (ClearType.MultiLine, 45, 3),
                (ClearType.SameShape, 40, 3),
                (ClearType.TripleLine, 35, 3),
                (ClearType.Corner, 30, 2),
                (ClearType.Cross, 25, 2),
                (ClearType.Parallel, 20, 2),
                (ClearType.DoubleLine, 15, 2),
                (ClearType.SingleLine, 10, 1),
            };
            var rows = new List<ClearTypeRow>();
            foreach ((ClearType type, long chips, long mult) in level1) rows.Add(new ClearTypeRow(type, 1, chips, mult));
            // 四张科技各升一种类型,每级 +10 底注 / +1 倍率(占位增量)
            foreach (ClearType type in new[] { ClearType.SingleLine, ClearType.DoubleLine, ClearType.TripleLine, ClearType.AllClear })
            {
                long chips = 0, mult = 0;
                foreach ((ClearType t, long c, long m) in level1)
                {
                    if (t == type) { chips = c; mult = m; break; }
                }
                rows.Add(new ClearTypeRow(type, 2, chips + 10, mult + 1));
                rows.Add(new ClearTypeRow(type, 3, chips + 20, mult + 2));
            }
            return new ClearTypeTable(rows);
        }

        private static IReadOnlyList<LibraryEntry> BuildLibrary()        {
            var list = new List<LibraryEntry>(Tetromino.KindCount * 4);
            for (int kind = 0; kind < Tetromino.KindCount; kind++)
            {
                for (int points = 1; points <= 4; points++) list.Add(new LibraryEntry((TetrominoKind)kind, points));
            }
            return list.AsReadOnly();
        }

        /// <summary>平推基因:基因段固定返回一份加/乘,没有成长状态。</summary>
        private sealed class FlatGene : RuleEffect
        {
            private readonly EffectDelta _delta;

            public FlatGene(long chips = 0, long mult = 0, long xMultPermille = 1000)
            {
                _delta = new EffectDelta(chips, mult, xMultPermille);
            }

            public override EffectDelta OnGene(EffectContext ctx) => _delta;
        }
    }
}
