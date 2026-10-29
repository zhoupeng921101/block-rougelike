namespace GameRules
{
    /// <summary>
    /// 跳过节点换的标签(局外循环设计稿 §7.1)。12 个全部实现:
    /// 现钱 / 科技 / 改造 / 加块 当场结清;折扣 / 扩货 / 急售 / 补给 改下一次商店;
    /// 蓄息 管本段利息封顶;轻敌 / 弃权 改下一个盲注;情报 让地图一直显示首领的负面效果。
    /// 号写死,进存档。
    /// </summary>
    public static class Tags
    {
        public const int Cash = 1;
        public const int Tech = 2;
        public const int Mod = 3;
        public const int Blocks = 4;
        public const int Discount = 5;
        public const int ExtraGoods = 6;
        public const int InterestCap = 7;
        public const int LightTarget = 8;
        public const int ExtraDiscards = 9;
        public const int Intel = 10;
        public const int FireSale = 11;
        public const int Supply = 12;

        /// <summary>标签池大小;地图生成按 1..Count 派签。</summary>
        public const int Count = 12;

        /// <summary>折扣标签的折扣千分值(下一次商店全部商品 75 折)。</summary>
        public const int DiscountPermille = 750;

        /// <summary>轻敌标签的目标分修正千分值。</summary>
        public const int LightTargetPermille = 850;

        /// <summary>弃权标签多给的弃置次数。</summary>
        public const int ExtraDiscardCount = 2;

        /// <summary>蓄息标签给本段加的利息封顶(美元)。</summary>
        public const int InterestCapBonus = 20;

        public static bool IsKnown(int id) => id >= 1 && id <= Count;
    }
}
