using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 基因清单(新游戏/设计/基因清单.md)已落代码的那些张:号 = 清单号(G001–G145 → 1–145,传说 L1–L5 → 146–150),
    /// 稀有度、价、效果、代价照清单 §2,数值全部待定标。模板基因一张一组 <see cref="GeneRule"/>,手写的各一个子类。
    /// 现在落了第一批(全部模板基因 + 叠层、首重);其余见清单 §4。
    /// </summary>
    public static class GeneTable
    {
        public readonly struct Entry
        {
            public readonly int Id;
            public readonly int Rarity;
            public readonly int Price;
            public readonly RuleEffect Effect;

            public Entry(int id, int rarity, int price, RuleEffect effect)
            {
                Id = id;
                Rarity = rarity;
                Price = price;
                Effect = effect;
            }
        }

        public const int Legendary1 = 146;

        // 形状位掩码,下标 = (int)TetrominoKind
        private const int I = 1 << (int)TetrominoKind.I;
        private const int O = 1 << (int)TetrominoKind.O;
        private const int T = 1 << (int)TetrominoKind.T;
        private const int SZ = 1 << (int)TetrominoKind.S | 1 << (int)TetrominoKind.Z;
        private const int JL = 1 << (int)TetrominoKind.J | 1 << (int)TetrominoKind.L;

        private const int C = GameRules.Rarity.Common;
        private const int U = GameRules.Rarity.Uncommon;
        private const int R = GameRules.Rarity.Rare;
        private const int L = GameRules.Rarity.Legendary;

        /// <summary>全部已落的基因,按号升序。</summary>
        public static IReadOnlyList<Entry> All { get; } = Build();

        private static IReadOnlyList<Entry> Build()
        {
            var list = new List<Entry>
            {
                // 2.1 形状
                E(1, C, 4, Cell(GeneCond.CellKindIn, I, GeneOut.Mult, 1000)),
                E(2, C, 4, Cell(GeneCond.CellKindIn, O, GeneOut.Chips, 6)),
                E(3, C, 4, Cell(GeneCond.CellKindIn, T, GeneOut.Mult, 1000)),
                E(4, C, 4, Cell(GeneCond.CellKindIn, SZ, GeneOut.Chips, 4)),
                E(5, C, 4, Cell(GeneCond.CellKindIn, JL, GeneOut.Mult, 500)),
                E(6, C, 5, Gene(GeneCond.ShapesAtLeast, 4, GeneOut.Mult, 10000)),
                E(7, C, 5, Gene(GeneScale.PlacedKinds, GeneOut.Mult, 2000)),
                E(8, C, 4, Gene(GeneScale.WholeBlocks, GeneOut.Chips, 20)),
                E(9, C, 4, Cell(GeneCond.CellKindMostInLibrary, 0, GeneOut.Chips, 3)),
                E(12, U, 6, Gene(GeneCond.ShapesAllOf, O | T, GeneOut.XMult, 2000)),
                E(14, U, 7, Retrigger(GeneCond.PlacedKindIs, (int)TetrominoKind.I, 1)),
                Costly(15, R, 8, new[] { Rule(GenePhase.Gene, GeneCond.TypeIn, TypeMask(ClearType.SameShape, ClearType.SameShapeCross), GeneScale.One, GeneOut.XMult, 3000) },
                    costTarget: 250),
                // 2.2 点数
                E(17, C, 4, Cell(GeneCond.CellPointsOdd, 0, GeneOut.Chips, 4)),
                E(18, C, 4, Cell(GeneCond.CellPointsEven, 0, GeneOut.Mult, 500)),
                E(19, C, 4, Cell(GeneCond.CellPointsEq, 1, GeneOut.Mult, 1000)),
                E(20, C, 5, Gene(GeneScale.TrayLowestPoints, GeneOut.Mult, 2000)),
                E(21, C, 4, Gene(GeneCond.DistinctPointsAtLeast, 3, GeneOut.Chips, 25)),
                E(22, U, 6, Retrigger(GeneCond.CellPointsAtLeast, 4, 1)),
                Costly(27, R, 9, new[] { Rule(GenePhase.Gene, GeneCond.PointsAllAtLeast, 3, GeneScale.One, GeneOut.XMult, 2500) }, discards: -1),
                Costly(28, R, 8, new[] { Rule(GenePhase.Gene, GeneCond.Always, 0, GeneScale.TrayHighPoints, GeneOut.XMultEach, 1500) }, costTarget: 200),
                // 2.3 位置
                E(29, C, 5, Cell(GeneCond.CellCorner, 0, GeneOut.Mult, 4000)),
                E(30, C, 4, Cell(GeneCond.CellOfPlaced, 0, GeneOut.Mult, 1000)),
                E(31, C, 4, Cell(GeneCond.CellCenter, 4, GeneOut.Mult, 500)),
                E(32, C, 4, Gene(GeneScale.EdgeLines, GeneOut.Mult, 5000)),
                E(34, U, 6, Gene(GeneCond.SymmetricLines, 0, GeneOut.Mult, 15000)),
                E(35, U, 7, Retrigger(GeneCond.CellOfPlacedOnEdge, 0, 1)),
                Costly(38, R, 8, new[] { Rule(GenePhase.Gene, GeneCond.CornersOccupied, 0, GeneScale.One, GeneOut.XMult, 2000) }, deadCells: 1),
                // 2.4 线与类型
                E(39, C, 4, Gene(GeneCond.LinesAtLeast, 2, GeneOut.Mult, 6000)),
                E(40, C, 4, Gene(GeneCond.HasRowAndCol, 0, GeneOut.Mult, 8000)),
                E(41, C, 4, Gene(GeneCond.AdjacentParallel, 0, GeneOut.Chips, 50)),
                E(42, C, 5, Gene(GeneCond.LinesAtLeast, 3, GeneOut.Mult, 12000)),
                E(43, C, 4, Gene(GeneCond.LinesAtLeast, 2, GeneOut.Chips, 50)),
                E(44, C, 4, Gene(GeneCond.LinesAtLeast, 3, GeneOut.Chips, 100)),
                E(45, C, 4, Gene(GeneCond.TypeIn, TypeMask(ClearType.Corner), GeneOut.Mult, 15000)),
                E(46, C, 4, Gene(GeneScale.RowsCleared, GeneOut.Mult, 3000)),
                E(47, U, 6, Gene(GeneScale.TypeRunCount, GeneOut.Mult, 500)),
                E(48, U, 6, new TemplateGene(new[]
                {
                    Rule(GenePhase.Gene, GeneCond.LinesEq, 1, GeneScale.One, GeneOut.XMult, 2000),
                    Rule(GenePhase.Gene, GeneCond.LinesAtLeast, 2, GeneScale.One, GeneOut.Mult, -8000),
                })),
                E(49, U, 7, Gene(GeneCond.TypeRepeatInBlind, 0, GeneOut.XMult, 2000)),
                E(50, U, 6, Gene(GeneCond.LinesAtLeast, 4, GeneOut.Mult, 30000)),
                E(52, U, 6, Gene(GeneCond.TypeDiffersFromLast, 0, GeneOut.Mult, 8000)),
                Costly(54, R, 9, new[] { Rule(GenePhase.Gene, GeneCond.LinesAtLeast, 3, GeneScale.One, GeneOut.XMult, 3000) }, costTarget: 250),
                // 2.5 连击
                E(55, C, 5, Gene(GeneScale.Combo, GeneOut.Mult, 1000)),
                E(56, C, 4, Gene(GeneCond.ComboEq, 1, GeneOut.Chips, 40)),
                E(57, C, 4, Gene(GeneScale.Combo, GeneOut.Chips, 10)),
                E(60, U, 7, Retrigger(GeneCond.ComboAtLeast, 4, 1)),
                Costly(64, R, 9, new[] { Rule(GenePhase.Gene, GeneCond.Always, 0, GeneScale.Combo, GeneOut.XMultLinear, 200) }, deadCells: 2),
                // 2.6 空间
                E(65, C, 4, Gene(GeneScale.EmptyAfterPer8, GeneOut.Mult, 1000)),
                E(66, C, 4, Gene(GeneCond.OccupiedAfterAtMost, 12, GeneOut.Chips, 60)),
                E(68, C, 5, Gene(GeneScale.OccupiedBeforePer4, GeneOut.Chips, 5)),
                E(69, U, 6, Gene(GeneCond.OccupiedBeforeAtLeast, 40, GeneOut.Mult, 20000)),
                E(71, U, 6, Gene(GeneScale.DeadCells, GeneOut.Mult, 4000)),
                Costly(73, R, 9, new[] { Rule(GenePhase.Gene, GeneCond.TypeIn, TypeMask(ClearType.AllClear), GeneScale.One, GeneOut.XMult, 4000) }, discards: -1),
                // 2.7 预算与弃置
                E(75, C, 4, Gene(GeneScale.DrawLeft, GeneOut.Chips, 2)),
                E(76, C, 4, Gene(GeneScale.DiscardsLeft, GeneOut.Chips, 15)),
                E(77, C, 5, Gene(GeneCond.NoDiscardsLeft, 0, GeneOut.Mult, 10000)),
                E(78, C, 4, Gene(GeneScale.TrayCount, GeneOut.Mult, 3000)),
                E(79, C, 4, Gene(GeneScale.DiscardsUsed, GeneOut.Mult, 2000)),
                E(80, C, 4, Gene(GeneCond.FirstGroup, 0, GeneOut.Mult, 8000)),
                E(81, U, 6, new GrowthGene(1000)),
                E(83, U, 6, Retrigger(GeneCond.DrawEmpty, 0, 1)),
                Costly(86, R, 8, new[] { Rule(GenePhase.Gene, GeneCond.DrawEmpty, 0, GeneScale.One, GeneOut.XMult, 3000) }, deadCells: 1),
                // 2.8 经济
                E(93, C, 5, Gene(GeneScale.Money, GeneOut.Chips, 1)),
                E(94, U, 6, new TemplateGene(new[] { Rule(GenePhase.After, GeneCond.LinesAtLeast, 3, GeneScale.One, GeneOut.Money, 2) })),
                E(95, U, 6, new TemplateGene(new[] { Rule(GenePhase.After, GeneCond.Always, 0, GeneScale.GoldBlocksCleared, GeneOut.Money, 2) })),
                // 2.9 构筑
                E(100, C, 4, Gene(GeneScale.OtherGenes, GeneOut.Mult, 2000)),
                E(102, C, 4, Gene(GeneScale.One, GeneOut.Mult, 4000)),
                E(103, U, 6, new RetriggerFirstCell(2)),
                E(106, U, 6, Gene(GeneScale.OtherGenesSellValue, GeneOut.Mult, 1000)),
                // 2.10 强化与版本
                E(110, C, 4, Cell(GeneCond.CellEnhancement, (int)Enhancement.Steel, GeneOut.Mult, 1000)),
                E(111, C, 4, Cell(GeneCond.CellNoEnhancement, 0, GeneOut.Chips, 3)),
                E(112, C, 4, Cell(GeneCond.CellHasEdition, 0, GeneOut.Mult, 1000)),
                E(113, C, 4, Cell(GeneCond.CellEnhancement, (int)Enhancement.Wild, GeneOut.Chips, 8)),
                E(114, U, 7, Gene(GeneScale.LibrarySteel, GeneOut.XMultLinear, 200)),
                E(119, U, 6, Gene(GeneCond.SameEnhancementAtLeast, 2, GeneOut.Mult, 10000)),
                Costly(121, R, 8, new[] { Rule(GenePhase.Gene, GeneCond.LibraryEnhancedAtLeast, 9, GeneScale.One, GeneOut.XMult, 3000) }, deadCells: 2),
                // 2.11 方块库
                E(122, C, 4, Gene(GeneScale.LibraryAboveStart, GeneOut.Chips, 3)),
                E(123, C, 4, Gene(GeneScale.LibraryShapesMissing, GeneOut.Mult, 4000)),
                E(125, U, 6, Gene(GeneScale.LibraryBelowStart, GeneOut.Mult, 2000)),
                E(128, U, 7, Cell(GeneCond.LibraryAtMost, 20, GeneOut.Mult, 1000)),
                // 2.14 传说
                E(Legendary1, L, 20, Cell(GeneCond.CellKindIn, I | O, GeneOut.XMult, 1250)),

                // ── 第二批:形状、点数、位置、线与类型、连击、空间 ──
                E(10, U, 6, new ShapeGenes.Mirror()),
                E(11, U, 7, new ShapeGenes.Ancient()),
                E(13, U, 6, new ShapeGenes.Sculpt()),
                Costly(16, R, 9, new[] { Rule(GenePhase.Gene, GeneCond.PlacedKindsAll, 127, GeneScale.One, GeneOut.XMult, 2500) },
                    groupSize: -1),
                E(23, U, 6, Gene(GeneCond.PointsAllEqual, 0, GeneOut.Mult, 15000)),
                E(24, U, 7, new PointGenes.DoublePoints()),
                E(25, U, 6, new PointGenes.GrowingPoints()),
                E(26, U, 6, new PointGenes.Transcode()),
                E(33, U, 6, new PositionGenes.Cross()),
                E(36, U, 6, new PositionGenes.CenterAnchor()),
                E(37, U, 6, new PositionGenes.LongThrow()),
                E(51, U, 6, new LineGenes.StarRise()),
                E(53, R, 8, new LineGenes.Obelisk()),
                E(58, C, 5, new ComboGenes.Perpetual()),
                E(59, U, 6, new ComboGenes.Charge()),
                E(61, U, 6, new ComboGenes.WarmUp()),
                E(62, U, 7, new ComboGenes.ComboKeeper()),
                Costly(63, R, 9, new[] { Rule(GenePhase.Gene, GeneCond.ComboAtLeast, 3, GeneScale.One, GeneOut.XMult, 2000) },
                    groupSize: -1),
                E(67, C, 4, new SpaceGenes.GapFill()),
                E(70, U, 6, new SpaceGenes.Holes()),
                E(72, U, 6, new SpaceGenes.ClearBonus()),
                Costly(74, R, 8, new[] { Rule(GenePhase.Gene, GeneCond.Always, 0, GeneScale.One, GeneOut.XMult, 2000) },
                    deadCells: 2),

                // ── 第二批:预算、经济、构筑 ──
                E(82, U, 7, new ParamGene(groupSizeDelta: 1, discardDelta: -1)),
                E(84, U, 6, new ParamGene(discardDelta: 1)),
                E(85, U, 7, new BudgetGenes.Recycle()),
                E(87, R, 8, new BudgetGenes.Fasting()),
                E(88, C, 5, new EconomyGenes.GoldVein()),
                E(89, C, 4, new EconomyGenes.Hatch()),
                E(90, C, 4, new EconomyGenes.Directive()),
                E(91, C, 4, new EconomyGenes.DiscardGold()),
                E(92, C, 2, new EconomyGenes.Credit()),
                E(96, U, 6, new EconomyGenes.Compound()),
                E(97, U, 6, new EconomyGenes.Appreciate()),
                E(98, U, 6, new EconomyGenes.Rocket()),
                E(99, R, 8, new EconomyGenes.Hoard()),
                E(101, C, 4, new BuildGenes.Typo()),
                E(104, U, 6, new BuildGenes.Devour()),
                E(105, U, 6, new BuildGenes.Reappear()),
                E(107, R, 10, new BuildGenes.Blueprint()),
                E(108, R, 9, new BuildGenes.Balance()),
                E(109, R, 10, new BuildGenes.FirstEcho()),

                // ── 第二批:强化与版本、方块库 ──
                E(115, U, 6, new EnhanceGenes.GlassShards()),
                E(116, U, 7, new EnhanceGenes.Midas()),
                E(117, U, 7, new EnhanceGenes.Drain()),
                E(118, U, 6, new EnhanceGenes.Plate()),
                E(120, U, 6, new ParamGene(glassShatterDenMultiplier: 2)),
                E(124, C, 4, new ParamGene(blockPriceDelta: -1)),
                E(126, U, 6, new LibraryGenes.Proliferate()),
                E(127, U, 6, new LibraryGenes.Cull()),
                E(129, U, 6, new LibraryGenes.Reshape()),
                E(130, R, 9, new LibraryGenes.CopyBlock()),

                // ── 第三批:消耗品、盲注与商店、传说 ──
                E(131, C, 4, Gene(GeneScale.ModsUsed, GeneOut.Mult, 1000)),
                E(132, C, 4, new ConsumableGenes.PackLuck()),
                E(133, C, 4, new ConsumableGenes.EightBall()),
                E(134, U, 6, new ConsumableGenes.StarChart()),
                E(135, U, 6, new ConsumableGenes.Prepare()),
                E(136, U, 7, new ParamGene(freeTechs: true)),
                E(137, U, 6, new ConsumableGenes.TechGold()),
                E(138, U, 6, new ConsumableGenes.Inspiration()),
                E(139, R, 8, new ConsumableGenes.Scorch()),
                E(140, C, 4, Gene(GeneScale.SkippedCount, GeneOut.Mult, 4000)),
                E(141, C, 5, new BlindShopGenes.RerollGrowth()),
                E(142, U, 7, new BlindShopGenes.SellFlame()),
                E(143, U, 6, new TemplateGene(new[] { Rule(GenePhase.After, GeneCond.BossBlind, 0, GeneScale.One, GeneOut.Money, 1) })),
                E(144, U, 6, new BlindShopGenes.Wrestler()),
                E(145, U, 6, new BlindShopGenes.Undying()),
                E(147, L, 20, new BlindShopGenes.Pardon()),
                E(148, L, 20, new BlindShopGenes.Eternal()),
                E(149, L, 20, new BlindShopGenes.Echo()),
                E(150, L, 20, new BlindShopGenes.Afterimage()),
            };
            return list.AsReadOnly();
        }

        /// <summary>把全部基因登记进注册表(要在交给 <see cref="RuleConfig"/> 之前)。</summary>
        public static EffectRegistry RegisterInto(EffectRegistry registry)
        {
            foreach (Entry e in All) registry.Register(EffectSource.Gene, e.Id, e.Effect);
            return registry;
        }

        public static int TypeMask(params ClearType[] types)
        {
            int mask = 0;
            foreach (ClearType t in types) mask |= 1 << (int)t;
            return mask;
        }

        private static Entry E(int id, int rarity, int price, RuleEffect effect) => new Entry(id, rarity, price, effect);

        private static Entry Costly(int id, int rarity, int price, GeneRule[] rules, int costTarget = 0, int discards = 0, int groupSize = 0,
            int deadCells = 0) =>
            new Entry(id, rarity, price, new TemplateGene(rules, costTarget, discards, groupSize, deadCells));

        private static GeneRule Rule(GenePhase phase, GeneCond cond, int arg, GeneScale scale, GeneOut output, long value) =>
            new GeneRule(phase, cond, arg, scale, output, value);

        private static TemplateGene Cell(GeneCond cond, int arg, GeneOut output, long value) =>
            new TemplateGene(new[] { Rule(GenePhase.Cell, cond, arg, GeneScale.One, output, value) });

        private static TemplateGene Gene(GeneCond cond, int arg, GeneOut output, long value) =>
            new TemplateGene(new[] { Rule(GenePhase.Gene, cond, arg, GeneScale.One, output, value) });

        private static TemplateGene Gene(GeneScale scale, GeneOut output, long value) =>
            new TemplateGene(new[] { Rule(GenePhase.Gene, GeneCond.Always, 0, scale, output, value) });

        private static TemplateGene Retrigger(GeneCond cond, int arg, long times) =>
            new TemplateGene(new[] { Rule(GenePhase.Repetition, cond, arg, GeneScale.One, GeneOut.Retrigger, times) });

        /// <summary>首重(G103):每次消除的首个被消格多走 n 遍(规则 §3.1 的重触发)。</summary>
        private sealed class RetriggerFirstCell : RuleEffect
        {
            private readonly int _times;

            public RetriggerFirstCell(int times)
            {
                _times = times;
            }

            public override int Repetitions(EffectContext ctx) => ctx.Cells.Count > 0 && ctx.Cell == ctx.Cells[0] ? _times : 0;
        }

        /// <summary>叠层(G081):每次消除计数 +1、每次弃置 −1(不低于 0);基因段给 +计数 × n 倍率(千分值)。</summary>
        private sealed class GrowthGene : RuleEffect
        {
            private readonly long _multPermillePerCount;

            public GrowthGene(long multPermillePerCount)
            {
                _multPermillePerCount = multPermillePerCount;
            }

            public override EffectDelta OnGene(EffectContext ctx) => EffectDelta.MultPermille(ctx.Counter * _multPermillePerCount);

            public override void AfterScoring(EffectContext ctx) => ctx.AddCounter(1);

            public override void OnStepEnd(EffectContext ctx)
            {
                if (ctx.Step == StepKind.Discard) ctx.AddCounter(-1);
            }
        }
    }
}
