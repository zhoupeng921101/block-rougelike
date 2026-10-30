namespace GameRules
{
    /// <summary>
    /// 只改参数、不出计分效果的一类基因(宽手、加弃、坚璃、选块、复利、囤金、星价)。
    /// 参数每次用到时由 <see cref="RunState"/> 从持有的基因重算(效果系统 §3.2),所以这里只放常量,不存状态。
    /// </summary>
    public sealed class ParamGene : RuleEffect
    {
        private readonly int _discardDelta;
        private readonly int _groupSizeDelta;
        private readonly int _deadCellsPerBlind;
        private readonly int _glassShatterDenMultiplier;
        private readonly int _interestPer;
        private readonly int _interestCapPermille;
        private readonly int _blockPriceDelta;
        private readonly bool _freeTechs;

        public ParamGene(int discardDelta = 0, int groupSizeDelta = 0, int deadCellsPerBlind = 0,
            int glassShatterDenMultiplier = 1, int interestPer = 0, int interestCapPermille = 1000, int blockPriceDelta = 0,
            bool freeTechs = false)
        {
            _discardDelta = discardDelta;
            _groupSizeDelta = groupSizeDelta;
            _deadCellsPerBlind = deadCellsPerBlind;
            _glassShatterDenMultiplier = glassShatterDenMultiplier;
            _interestPer = interestPer;
            _interestCapPermille = interestCapPermille;
            _blockPriceDelta = blockPriceDelta;
            _freeTechs = freeTechs;
        }

        public override int DiscardDelta => _discardDelta;

        public override int GroupSizeDelta => _groupSizeDelta;

        public override int DeadCellsPerBlind => _deadCellsPerBlind;

        public override int GlassShatterDenMultiplier => _glassShatterDenMultiplier;

        public override int InterestPer => _interestPer;

        public override int InterestCapPermille => _interestCapPermille;

        public override int BlockPriceDelta => _blockPriceDelta;

        public override bool FreeTechs => _freeTechs;
    }
}
