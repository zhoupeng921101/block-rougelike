using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 优惠券对一局参数的修正(局外循环设计稿 §7.4)。券是永久的、整局有效,所以每次要用参数时都从券列表现算,
    /// 不在状态里存派生值——存了就要在买券、读档、克隆三处同步,迟早漏一处。
    /// </summary>
    public readonly struct RunModifiers
    {
        public readonly int GeneSlotBonus;
        public readonly int ConsumableSlotBonus;
        public readonly int GroupSizeBonus;
        public readonly int DiscardBonus;
        public readonly int InterestCapBonus;
        public readonly int RerollDiscount;
        public readonly int TargetPermille;
        public readonly int PricePermille;

        /// <summary>柜台券带来的货格加成(每张 +1)。</summary>
        public readonly int ShopSlotBonus;

        /// <summary>稀券:基因池稀有度权重提升(普通 70/25/5 → 60/30/10)。</summary>
        public readonly bool ShiftRarity;

        private RunModifiers(int geneSlots, int consumableSlots, int groupSize, int discards, int interestCap,
            int rerollDiscount, int targetPermille, int pricePermille, int shopSlots, bool shiftRarity)
        {
            GeneSlotBonus = geneSlots;
            ConsumableSlotBonus = consumableSlots;
            GroupSizeBonus = groupSize;
            DiscardBonus = discards;
            InterestCapBonus = interestCap;
            RerollDiscount = rerollDiscount;
            TargetPermille = targetPermille;
            PricePermille = pricePermille;
            ShopSlotBonus = shopSlots;
            ShiftRarity = shiftRarity;
        }

        public static RunModifiers From(IReadOnlyList<int> vouchers)
        {
            int gene = 0, consumable = 0, group = 0, discard = 0, cap = 0, reroll = 0, target = 1000, price = 1000, shopSlots = 0;
            bool shift = false;
            if (vouchers != null)
            {
                foreach (int id in vouchers)
                {
                    switch (id)
                    {
                        case VoucherCatalog.GeneSlot: gene++; break;
                        case VoucherCatalog.ConsumableSlot: consumable++; break;
                        case VoucherCatalog.GroupSize: group++; break;
                        case VoucherCatalog.InterestCap: cap += 20; break;
                        case VoucherCatalog.Reroll: reroll += 2; break;
                        case VoucherCatalog.Discard: discard++; break;
                        case VoucherCatalog.LightTarget: target = target * 950 / 1000; break;
                        case VoucherCatalog.Wholesale: price = price * 800 / 1000; break;
                        case VoucherCatalog.Counter: shopSlots++; break;
                        case VoucherCatalog.Rarity: shift = true; break;
                        default: break; // 启动券是买的那一刻立即生效,不留修正;回收券等卖价系统接上再说
                    }
                }
            }
            return new RunModifiers(gene, consumable, group, discard, cap, reroll, target, price, shopSlots, shift);
        }
    }

    /// <summary>
    /// 最小内容集里的优惠券。号写死:进存档的是号,改名或挪号就是改存档形状。
    /// 回收券(卖价 75%)等卖价系统接上再进目录,其余 11 张都有效果。
    /// </summary>
    public static class VoucherCatalog
    {
        public const int GeneSlot = 1;
        public const int ConsumableSlot = 2;
        public const int GroupSize = 3;
        public const int InterestCap = 4;
        public const int Counter = 5;
        public const int Reroll = 6;
        public const int Discard = 7;
        public const int LightTarget = 8;
        public const int Wholesale = 9;
        public const int StartMoney = 10;
        public const int Rarity = 11;

        /// <summary>券的统一定价(设计稿 §4.3 的候选值);难度与批发券再在这上面乘。</summary>
        public const int Price = 10;

        public static bool IsKnown(int id)
        {
            switch (id)
            {
                case GeneSlot:
                case ConsumableSlot:
                case GroupSize:
                case InterestCap:
                case Counter:
                case Reroll:
                case Discard:
                case LightTarget:
                case Wholesale:
                case StartMoney:
                case Rarity:
                    return true;
                default:
                    return false;
            }
        }
    }
}
