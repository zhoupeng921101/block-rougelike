namespace GameRules
{
    /// <summary>
    /// 基因栏的一格(规则 §4.1)。基因的版本、成长计数、待生效的代价都是整数字段,挂在这里,跟着局状态克隆和存档;
    /// 效果对象本身无状态(07 号票 §5)。
    /// </summary>
    public sealed class GeneSlot
    {
        public int GeneId { get; }

        /// <summary>基因的版本;负片不占基因槽(规则 §4.1)。</summary>
        public Edition Edition { get; internal set; }

        /// <summary>成长型基因的计数(效果系统 §2:逐步成长、衰减写成载体上的整数计数)。≥ 0,不用的基因恒为 0。</summary>
        public int Counter { get; internal set; }

        /// <summary>
        /// 本盲注内的一次性状态(随机指定的形状/消除类型、要移走的临时块 id、本盲注已生效标记等)。
        /// 基因打开盲注时自己重置;含义由各基因定义,不用的基因恒为 0(效果系统 §2:状态挂在载体上,效果对象无状态)。
        /// </summary>
        public int State { get; internal set; }

        /// <summary>这张基因自己的卖价加成(孵化、增值这类「卖价 +N」的件写在上面),卖价公式读它。</summary>
        public int SellBonus { get; internal set; }

        /// <summary>
        /// 代价还没兑现:「本盲注目标分 +X%」只作用于拿到之后的第一个盲注(规则 §4.1),
        /// 开下一个盲注时读它、随即清掉(效果系统 §6)。
        /// </summary>
        public bool CostPending { get; internal set; }

        public GeneSlot(int geneId, Edition edition = Edition.None, int counter = 0, bool costPending = false, int state = 0,
            int sellBonus = 0)
        {
            GeneId = geneId;
            Edition = edition;
            Counter = counter;
            CostPending = costPending;
            State = state;
            SellBonus = sellBonus;
        }

        public GeneSlot Clone() => new GeneSlot(GeneId, Edition, Counter, CostPending, State, SellBonus);
    }
}
