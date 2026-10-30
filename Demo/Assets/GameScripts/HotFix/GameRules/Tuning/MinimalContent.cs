using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 内容集:基因按基因清单逐批落(<see cref="GeneTable"/>),科技、改造还是只为验证钩子与商店的最小集:
    /// <list type="bullet">
    /// <item>基因:<see cref="GeneTable.All"/>,号 = 基因清单的号。</item>
    /// <item>科技 11 张:每种消除类型一张,等级 1–<see cref="TechMaxLevel"/>,每级增量照规则 §4.2.1 的表。</item>
    /// <item>改造 9 张(<see cref="ModCatalog"/>);方块按七种骨牌 × 点数 1–4 定价;补给包 5 种;优惠券 12 张。</item>
    /// <item>强化与版本的效果是规则本身定的,见 <see cref="CoreEffects"/>。</item>
    /// </list>
    /// 数值全是占位,阶段 6 定标。
    /// </summary>
    public static class MinimalContent
    {
        public static int GeneCount => GeneTable.All.Count;
        public const int TechCount = GameRules.ClearTypes.Count;

        /// <summary>科技能把一种类型升到第几级(待定标)。</summary>
        public const int TechMaxLevel = 10;

        public static ContentCatalog Catalog { get; } = BuildCatalog();
        public static EffectRegistry Effects { get; } = BuildEffects();

        /// <summary>消除类型表:11 种各 <see cref="TechMaxLevel"/> 级,1 级是阶段 3 的占位底注。</summary>
        public static ClearTypeTable ClearTypes { get; } = BuildClearTypes();

        /// <summary>默认方块库(28 块):数值表只换数字,不换内容。</summary>
        public static IReadOnlyList<LibraryEntry> Library { get; } = BuildLibrary();

        /// <summary>带最小基因效果与商店目录的规则配置(阶段 5 的 Demo 与单测用它;阶段 3 的 PlaceholderTuning.Config 保持空效果)。</summary>
        public static RuleConfig Config { get; } = new RuleConfig(Library, ClearTypes, Effects, catalog: Catalog);

        /// <summary>科技号 → 它升级的类型:号 = (int)类型 + 1。</summary>
        public static ClearType TechType(int techId) => (ClearType)(techId - 1);

        public static int TechOf(ClearType type) => (int)type + 1;

        private static EffectRegistry BuildEffects()
        {
            var effects = new EffectRegistry();
            CoreEffects.RegisterInto(effects);
            GeneTable.RegisterInto(effects);
            return effects;
        }

        private static ContentCatalog BuildCatalog()
        {
            var genes = new List<CatalogEntry>(GeneTable.All.Count);
            foreach (GeneTable.Entry e in GeneTable.All) genes.Add(new CatalogEntry(ItemKind.Gene, e.Id, e.Price, e.Rarity));
            var techs = new List<CatalogEntry>();
            var techTypes = new Dictionary<int, ClearType>();
            for (int t = 0; t < GameRules.ClearTypes.Count; t++)
            {
                int id = TechOf((ClearType)t);
                techs.Add(new CatalogEntry(ItemKind.Tech, id, 3));
                techTypes.Add(id, (ClearType)t);
            }
            var mods = new List<CatalogEntry>();
            for (int id = 1; id <= ModCatalog.Count; id++) mods.Add(new CatalogEntry(ItemKind.Mod, id, 3));
            var blocks = new List<BlockEntry>(Tetromino.KindCount * 4);
            int blockId = 1;
            for (int kind = 0; kind < Tetromino.KindCount; kind++)
            {
                for (int points = 1; points <= 4; points++)
                {
                    blocks.Add(new BlockEntry(blockId++, (TetrominoKind)kind, points, 3 + points));
                }
            }
            var vouchers = new List<CatalogEntry>();
            foreach (int voucherId in new[]
                     {
                         VoucherCatalog.GeneSlot, VoucherCatalog.ConsumableSlot, VoucherCatalog.GroupSize, VoucherCatalog.InterestCap,
                         VoucherCatalog.Counter, VoucherCatalog.Reroll, VoucherCatalog.Discard, VoucherCatalog.LightTarget,
                         VoucherCatalog.Wholesale, VoucherCatalog.StartMoney, VoucherCatalog.Rarity, VoucherCatalog.Recycle,
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
            // 1 级底注 / 倍率是阶段 3 的占位;每级增量照规则 §4.2.1(湮域 → 清屏、折轨 → 平行线、矢列 → 拐角)
            var table = new (ClearType Type, long Chips, long Mult, long StepChips, long StepMult)[]
            {
                (ClearType.AllClear, 60, 4, 40, 4),
                (ClearType.FiveLine, 55, 4, 35, 3),
                (ClearType.SameShapeCross, 50, 4, 40, 4),
                (ClearType.MultiLine, 45, 3, 30, 3),
                (ClearType.SameShape, 40, 3, 15, 2),
                (ClearType.TripleLine, 35, 3, 20, 2),
                (ClearType.Corner, 30, 2, 20, 1),
                (ClearType.Cross, 25, 2, 25, 2),
                (ClearType.Parallel, 20, 2, 30, 3),
                (ClearType.DoubleLine, 15, 2, 15, 1),
                (ClearType.SingleLine, 10, 1, 10, 1),
            };
            var rows = new List<ClearTypeRow>();
            foreach ((ClearType type, long chips, long mult, long stepChips, long stepMult) in table)
            {
                for (int level = 1; level <= TechMaxLevel; level++)
                {
                    rows.Add(new ClearTypeRow(type, level, chips + stepChips * (level - 1), mult + stepMult * (level - 1)));
                }
            }
            return new ClearTypeTable(rows);
        }

        private static IReadOnlyList<LibraryEntry> BuildLibrary()
        {
            var list = new List<LibraryEntry>(Tetromino.KindCount * 4);
            for (int kind = 0; kind < Tetromino.KindCount; kind++)
            {
                for (int points = 1; points <= 4; points++) list.Add(new LibraryEntry((TetrominoKind)kind, points));
            }
            return list.AsReadOnly();
        }
    }
}
