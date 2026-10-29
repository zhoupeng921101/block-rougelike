using System;

namespace GameRules
{
    /// <summary>
    /// 跳过节点换来的「下一次」效果(局外循环设计稿 §7.1):折扣、扩货、急售、补给改下一次商店,
    /// 轻敌、弃权改下一个盲注。用掉的那一刻归零;跟着存档走,读档后仍然生效。
    /// 用可变的类而不是结构:属性带来分,读一局的人不必沿构造参数数位置。
    /// </summary>
    public sealed class RunPending
    {
        /// <summary>下一次商店全部商品的折扣千分值;1000 = 不打折。</summary>
        public int ShopDiscountPermille = PermilleOne;

        /// <summary>下一次商店多出来的货格数。</summary>
        public int ExtraShopGoods;

        /// <summary>下一次商店刷新免费且不涨价。</summary>
        public bool FreeReroll;

        /// <summary>下一次商店的补给包免费。</summary>
        public bool FreeBooster;

        /// <summary>下一个盲注的目标分修正千分值;1000 = 不修。</summary>
        public int BlindTargetPermille = PermilleOne;

        /// <summary>下一个盲注多出来的弃置次数。</summary>
        public int BlindDiscards;

        /// <summary>没有任何待生效的效果。</summary>
        public const int PermilleOne = 1000;

        public bool IsEmpty =>
            ShopDiscountPermille == PermilleOne && ExtraShopGoods == 0 && !FreeReroll && !FreeBooster
            && BlindTargetPermille == PermilleOne && BlindDiscards == 0;

        public RunPending Clone() => new RunPending
        {
            ShopDiscountPermille = ShopDiscountPermille,
            ExtraShopGoods = ExtraShopGoods,
            FreeReroll = FreeReroll,
            FreeBooster = FreeBooster,
            BlindTargetPermille = BlindTargetPermille,
            BlindDiscards = BlindDiscards,
        };

        /// <summary>商店开出来之后清掉商店那部分。</summary>
        public void ClearShop()
        {
            ShopDiscountPermille = PermilleOne;
            ExtraShopGoods = 0;
            FreeReroll = false;
            FreeBooster = false;
        }

        /// <summary>盲注开出来之后清掉盲注那部分。</summary>
        public void ClearBlind()
        {
            BlindTargetPermille = PermilleOne;
            BlindDiscards = 0;
        }

        public string Validate()
        {
            if (ShopDiscountPermille < 0 || ShopDiscountPermille > PermilleOne)
            {
                return Invariant($"pending.shopDiscount: {ShopDiscountPermille} 不在 0..{PermilleOne}");
            }
            if (ExtraShopGoods < 0) return Invariant($"pending.extraShopGoods: {ExtraShopGoods} 为负");
            if (BlindTargetPermille <= 0) return Invariant($"pending.blindTarget: {BlindTargetPermille} 须为正");
            if (BlindDiscards < 0) return Invariant($"pending.blindDiscards: {BlindDiscards} 为负");
            return null;
        }

        private static string Invariant(string message) => message;
    }
}
