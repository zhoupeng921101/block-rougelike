namespace GameRules
{
    /// <summary>
    /// 规则本身定下的强化与版本效果(规则 §4.1、§4.4,效果系统 §10 的起草口径):不属于哪张内容清单,所以单放一处,
    /// 由内容集登记进效果注册表。数值全是候选,待定标。
    /// <list type="bullet">
    /// <item>琉璃:每格 ×倍率;结算后有概率碎裂、湮灭。</item>
    /// <item>铁芯:每格 +倍率。</item>
    /// <item>金箔:结算后给钱,一块一次。</item>
    /// <item>万态:判定改写,同形态时视作任意形态(<see cref="RunState.ResolveClear"/>),不在注册表里。</item>
    /// <item>版本:块上每格生效;基因上在基因段生效,闪箔、镭射在本体之前,多彩在本体之后(规则 §3.1)。负片没有计分效果,只是不占槽。</item>
    /// </list>
    /// </summary>
    public static class CoreEffects
    {
        public const long GlassXMultPermille = 1200;
        public const int GlassShatterDen = 4;
        public const long SteelMult = 2;
        public const int GoldMoney = 1;

        public const long BlockFoilChips = 10;
        public const long BlockHoloMult = 2;
        public const long BlockPolyXMultPermille = 1100;

        public const long GeneFoilChips = 50;
        public const long GeneHoloMult = 10;
        public const long GenePolyXMultPermille = 1500;

        /// <summary>把强化与版本效果登记进注册表(要在交给 <see cref="RuleConfig"/> 之前)。</summary>
        public static EffectRegistry RegisterInto(EffectRegistry registry)
        {
            registry.Register(EffectSource.Enhancement, (int)Enhancement.Glass, new GlassEffect());
            registry.Register(EffectSource.Enhancement, (int)Enhancement.Steel, new FlatCell(EffectDelta.Mult(SteelMult)));
            registry.Register(EffectSource.Enhancement, (int)Enhancement.Gold, new GoldEffect());
            registry.Register(EffectSource.Edition, (int)Edition.Foil,
                new EditionEffect(EffectDelta.Chips(BlockFoilChips), EffectDelta.Chips(GeneFoilChips)));
            registry.Register(EffectSource.Edition, (int)Edition.Holo,
                new EditionEffect(EffectDelta.Mult(BlockHoloMult), EffectDelta.Mult(GeneHoloMult)));
            registry.Register(EffectSource.Edition, (int)Edition.Polychrome,
                new EditionEffect(EffectDelta.XMult(BlockPolyXMultPermille), EffectDelta.XMult(GenePolyXMultPermille)));
            return registry;
        }

        /// <summary>基因的版本在本体之后才结算吗(×倍率的版本);闪箔、镭射在本体之前。</summary>
        public static bool AppliesAfterGene(Edition edition) => edition == Edition.Polychrome;

        private sealed class GlassEffect : RuleEffect
        {
            public override EffectDelta OnCell(EffectContext ctx) => EffectDelta.XMult(GlassXMultPermille);

            public override void AfterScoring(EffectContext ctx)
            {
                // 坚璃基因把分母翻倍(概率减半);每局/每盲注都从持有基因现算
                if (ctx.Acting) return;
                if (ctx.Chance(1, ctx.State.GlassShatterDen)) ctx.ShatterBlock();
            }
        }

        private sealed class GoldEffect : RuleEffect
        {
            public override void AfterScoring(EffectContext ctx) => ctx.GainMoney(GoldMoney);
        }

        private sealed class FlatCell : RuleEffect
        {
            private readonly EffectDelta _delta;

            public FlatCell(EffectDelta delta)
            {
                _delta = delta;
            }

            public override EffectDelta OnCell(EffectContext ctx) => _delta;
        }

        /// <summary>同一种版本:块上每格给 cell 那份,基因上在基因段给 gene 那份。</summary>
        private sealed class EditionEffect : RuleEffect
        {
            private readonly EffectDelta _cell;
            private readonly EffectDelta _gene;

            public EditionEffect(EffectDelta cell, EffectDelta gene)
            {
                _cell = cell;
                _gene = gene;
            }

            public override EffectDelta OnCell(EffectContext ctx) => _cell;

            public override EffectDelta OnGene(EffectContext ctx) => _gene;
        }
    }
}
