namespace GameRules
{
    /// <summary>
    /// 基因栏的一格(规则 §4.1)。本图没有基因,栏恒为空。
    /// 基因的计数、成长值以后作为整数字段挂在这里,跟着局状态克隆和存档;效果对象本身无状态(07 号票 §5)。
    /// </summary>
    public sealed class GeneSlot
    {
        public int GeneId { get; }

        public GeneSlot(int geneId)
        {
            GeneId = geneId;
        }

        public GeneSlot Clone() => new GeneSlot(GeneId);
    }
}
