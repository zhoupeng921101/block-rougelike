using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 最小内容集(工程计划:基因/科技/改造各做最小集,只为验证钩子与商店)。规则 §4 的三张清单待从方块原生维度重新长,
    /// 这里不照搬,只放能把每一类机制走通的几张:
    /// <list type="bullet">
    /// <item>基因 13 张:8 张平推的加 / 乘;重触发(连票)、成长计数(翠涨)、读连击(连环)、带目标分代价(蚀灭)、传说(星核)各一张。</item>
    /// <item>科技 11 张:每种消除类型一张,等级 1–<see cref="TechMaxLevel"/>,每级增量照规则 §4.2.1 的表。</item>
    /// <item>改造 9 张(<see cref="ModCatalog"/>);方块按七种骨牌 × 点数 1–4 定价;补给包 5 种;优惠券 12 张。</item>
    /// <item>强化与版本的效果是规则本身定的,见 <see cref="CoreEffects"/>。</item>
    /// </list>
    /// 数值全是占位,阶段 6 定标。
    /// </summary>
    public static class MinimalContent
    {
        public const int GeneCount = 13;
        public const int TechCount = GameRules.ClearTypes.Count;

        /// <summary>科技能把一种类型升到第几级(待定标)。</summary>
        public const int TechMaxLevel = 10;

        public const int RetriggerGeneId = 9;
        public const int GrowthGeneId = 10;
        public const int ComboGeneId = 11;
        public const int CostGeneId = 12;
        public const int LegendaryGeneId = 13;

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
            effects.Register(EffectSource.Gene, 1, new FlatGene(chips: 10));
            effects.Register(EffectSource.Gene, 2, new FlatGene(chips: 20));
            effects.Register(EffectSource.Gene, 3, new FlatGene(chips: 30));
            effects.Register(EffectSource.Gene, 4, new FlatGene(mult: 2));
            effects.Register(EffectSource.Gene, 5, new FlatGene(mult: 3));
            effects.Register(EffectSource.Gene, 6, new FlatGene(mult: 4));
            effects.Register(EffectSource.Gene, 7, new FlatGene(xMultPermille: 1500));
            effects.Register(EffectSource.Gene, 8, new FlatGene(chips: 2, mult: 1));
            effects.Register(EffectSource.Gene, RetriggerGeneId, new RetriggerFirstCell(2));
            effects.Register(EffectSource.Gene, GrowthGeneId, new GrowthGene(1));
            effects.Register(EffectSource.Gene, ComboGeneId, new ComboGene(2));
            effects.Register(EffectSource.Gene, CostGeneId, new CostGene(3000, 250));
            effects.Register(EffectSource.Gene, LegendaryGeneId, new FlatGene(xMultPermille: 2500));
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
                new CatalogEntry(ItemKind.Gene, 7, 8, Rarity.Rare),
                new CatalogEntry(ItemKind.Gene, 8, 3),
                new CatalogEntry(ItemKind.Gene, RetriggerGeneId, 5),
                new CatalogEntry(ItemKind.Gene, GrowthGeneId, 4),
                new CatalogEntry(ItemKind.Gene, ComboGeneId, 6, Rarity.Uncommon),
                new CatalogEntry(ItemKind.Gene, CostGeneId, 8, Rarity.Rare),
                new CatalogEntry(ItemKind.Gene, LegendaryGeneId, 20, Rarity.Legendary),
            };
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

        /// <summary>连票:每次消除中首个被消的格多走 n 遍(规则 §3.1 的重触发)。</summary>
        private sealed class RetriggerFirstCell : RuleEffect
        {
            private readonly int _times;

            public RetriggerFirstCell(int times)
            {
                _times = times;
            }

            public override int Repetitions(EffectContext ctx) => ctx.Cells.Count > 0 && ctx.Cell == ctx.Cells[0] ? _times : 0;
        }

        /// <summary>翠涨:每次有消除的落子计数 +1、每次弃置 -1(不低于 0);基因段给 +计数×n 倍率。</summary>
        private sealed class GrowthGene : RuleEffect
        {
            private readonly long _multPerCount;

            public GrowthGene(long multPerCount)
            {
                _multPerCount = multPerCount;
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.Mult(ctx.Counter * _multPerCount);

            public override void AfterScoring(EffectContext ctx) => ctx.AddCounter(1);

            public override void OnStepEnd(EffectContext ctx)
            {
                if (ctx.Step == StepKind.Discard) ctx.AddCounter(-1);
            }
        }

        /// <summary>连环:基因段给 +连击数×n 倍率(连击叠倍流,规则 §6)。</summary>
        private sealed class ComboGene : RuleEffect
        {
            private readonly long _multPerCombo;

            public ComboGene(long multPerCombo)
            {
                _multPerCombo = multPerCombo;
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.Mult(ctx.Run.Blind.Combo * _multPerCombo);
        }

        /// <summary>蚀灭:基因段 ×倍率;代价是拿到之后第一个盲注目标分 +X%(规则 §4.1)。</summary>
        private sealed class CostGene : RuleEffect
        {
            private readonly long _xMultPermille;
            private readonly int _costPermille;

            public CostGene(long xMultPermille, int costPermille)
            {
                _xMultPermille = xMultPermille;
                _costPermille = costPermille;
            }

            public override int CostTargetPermille => _costPermille;

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.XMult(_xMultPermille);
        }
    }
}
