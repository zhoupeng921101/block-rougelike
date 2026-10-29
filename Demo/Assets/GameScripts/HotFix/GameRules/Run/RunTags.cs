namespace GameRules
{
    /// <summary>
    /// 跳过节点换的标签(局外循环设计稿 §7.1)。首版只做四种能立刻结算的:
    /// 现钱、科技、改造、加块。折扣/扩货/蓄息/轻敌/弃权/情报/急售/补给要挂「下一次」的状态或改商店结构,等它们接上再进池。
    /// 号写死,进存档。
    /// </summary>
    public static class Tags
    {
        public const int Cash = 1;
        public const int Tech = 2;
        public const int Mod = 3;
        public const int Blocks = 4;

        /// <summary>首版的标签池大小;地图生成按 1..Count 派签。</summary>
        public const int Count = 4;

        public static bool IsKnown(int id) => id >= 1 && id <= Count;
    }
}
