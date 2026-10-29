using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 道具栏里的一件消耗品(规则 §2.5):科技或改造。号段按种类各自独立,所以要连种类一起存。
    /// </summary>
    public readonly struct ConsumableItem
    {
        public readonly ItemKind Kind;
        public readonly int Id;

        public ConsumableItem(ItemKind kind, int id)
        {
            Kind = kind;
            Id = id;
        }

        public static ConsumableItem Tech(int id) => new ConsumableItem(ItemKind.Tech, id);

        public static ConsumableItem Mod(int id) => new ConsumableItem(ItemKind.Mod, id);

        public override string ToString() => Kind + ":" + Id;
    }

    /// <summary>使用一件改造要指定什么(规则 §4.3:拖到网格里的块、待放置区的块或空格上)。</summary>
    public enum ModTarget
    {
        /// <summary>不用指定,直接生效。</summary>
        None = 0,

        /// <summary>一块方块:盘上的、待放置区的,或不在盲注里时方块库里的。</summary>
        Block = 1,

        /// <summary>基因栏的一格。</summary>
        Gene = 2,
    }

    /// <summary>用一件消耗品被拒的原因;被拒时状态一点不改。</summary>
    public enum UseReject
    {
        None = 0,

        /// <summary>道具栏里没有这一格。</summary>
        NoSuchItem = 1,

        /// <summary>目标不存在,或不是这件改造能作用的目标。</summary>
        BadTarget = 2,

        /// <summary>现在用不了:盲注已分出胜负、科技要升的类型已到顶、没有可生成的东西等。</summary>
        NotUsable = 3,
    }

    /// <summary>用一件消耗品的结果:被拒的原因,或这次吐的事件(删块后补发组、判负也在里面)。</summary>
    public sealed class UseResult
    {
        private static readonly IReadOnlyList<RuleEvent> NoEvents = Array.AsReadOnly(new RuleEvent[0]);

        public UseReject Reject { get; }

        public IReadOnlyList<RuleEvent> Events { get; }

        public bool Accepted => Reject == UseReject.None;

        private UseResult(UseReject reject, IReadOnlyList<RuleEvent> events)
        {
            Reject = reject;
            Events = events;
        }

        internal static UseResult Rejected(UseReject reject) => new UseResult(reject, NoEvents);

        internal static UseResult Done(List<RuleEvent> events) => new UseResult(UseReject.None, events.AsReadOnly());
    }

    /// <summary>
    /// 最小内容集里的改造(规则 §4.3)。§4.3.1 的清单待重新长,这里只放能验证「改块、删块、改基因、给钱、生成消耗品」
    /// 这几类钩子的九张;号写死,进存档。效果在 <see cref="RunState.UseConsumable"/>。数值待定标。
    /// </summary>
    public static class ModCatalog
    {
        /// <summary>琉璃改造:一块变成琉璃方块。</summary>
        public const int Glass = 1;

        /// <summary>铁芯改造:一块变成铁芯方块。</summary>
        public const int Steel = 2;

        /// <summary>金箔改造:一块变成金箔方块。</summary>
        public const int Gold = 3;

        /// <summary>万态改造:一块变成万态方块。</summary>
        public const int Wild = 4;

        /// <summary>崇基改造:一块点数永久 +<see cref="PointsBonus"/>。</summary>
        public const int Points = 5;

        /// <summary>垂湮改造:湮灭一块(牌库瘦身,规则 §5.3)。</summary>
        public const int Destroy = 6;

        /// <summary>敛金改造:持有金钱翻倍,这次最多加 <see cref="DoubleMoneyCap"/>。</summary>
        public const int DoubleMoney = 7;

        /// <summary>御铸改造:生成一张已解锁的随机科技进道具栏。</summary>
        public const int MakeTech = 8;

        /// <summary>镀金改造:给一格基因附随机版本(闪箔 / 镭射 / 多彩),<see cref="EditionChanceDen"/> 分之一成功。</summary>
        public const int GeneEdition = 9;

        public const int Count = 9;

        /// <summary>崇基改造加的点数(待定标)。</summary>
        public const int PointsBonus = 2;

        /// <summary>敛金改造一次最多加的钱(规则 §4.3.1 #10 的上限 20)。</summary>
        public const int DoubleMoneyCap = 20;

        /// <summary>镀金改造的成功率分母(规则 §4.3.1 #11 的 1/4)。</summary>
        public const int EditionChanceDen = 4;

        public static bool IsKnown(int id) => id >= 1 && id <= Count;

        public static ModTarget TargetOf(int id)
        {
            switch (id)
            {
                case Glass:
                case Steel:
                case Gold:
                case Wild:
                case Points:
                case Destroy:
                    return ModTarget.Block;
                case GeneEdition:
                    return ModTarget.Gene;
                default:
                    return ModTarget.None;
            }
        }

        /// <summary>改造给块的强化;不是改强化的改造返回 None。</summary>
        public static Enhancement EnhancementOf(int id)
        {
            switch (id)
            {
                case Glass: return Enhancement.Glass;
                case Steel: return Enhancement.Steel;
                case Gold: return Enhancement.Gold;
                case Wild: return Enhancement.Wild;
                default: return Enhancement.None;
            }
        }
    }
}
