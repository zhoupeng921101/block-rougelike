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

        /// <summary>先选来源块、再选目标块(双生、堕噬)。</summary>
        TwoBlocks = 3,

        /// <summary>只能是盘上的块(拆解)。</summary>
        BoardBlock = 4,
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
    /// 改造 22 张(科技与改造清单 §2,2026-10-30 拍板)。做强化 4、改块 7、删块 3、生成 5、给钱 2、救场 1。
    /// 效果在 <see cref="RunState.UseConsumable"/>。数值全是候选,待定标。
    /// </summary>
    public static class ModCatalog
    {
        // 2.1 做强化
        public const int Glass = 1;
        public const int Steel = 2;
        public const int Gold = 3;
        public const int Wild = 4;

        // 2.2 改块
        public const int Points = 5;
        public const int MakeAllPoints = 12;
        public const int Twin = 13;
        public const int ToO = 16;
        public const int ToI = 17;
        public const int ToT = 18;
        public const int Mirror = 19;

        // 2.3 删块
        public const int Destroy = 6;
        public const int Tilt = 15;
        public const int Devour = 21;

        // 2.4 生成
        public const int MakeTech = 8;
        public const int GeneEdition = 9;
        public const int MakeLast = 10;
        public const int MakeMods = 11;
        public const int MakeGene = 20;

        // 2.5 给钱
        public const int DoubleMoney = 7;
        public const int Tribute = 14;

        // 2.6 救场
        public const int Dismantle = 22;

        public const int Count = 22;

        /// <summary>崇基改造加的点数(待定标)。</summary>
        public const int PointsBonus = 2;

        /// <summary>敛金改造一次最多加的钱(规则 §4.3.1 #7 的上限 20)。</summary>
        public const int DoubleMoneyCap = 20;

        /// <summary>镀金改造的成功率分母(规则 §4.3.1 #9 的 1/4)。</summary>
        public const int EditionChanceDen = 4;

        /// <summary>调流改造一次最多给的钱(科技与改造清单 §2.5)。</summary>
        public const int TributeCap = 50;

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
                case ToO:
                case ToI:
                case ToT:
                case Mirror:
                case Tilt:
                    return ModTarget.Block;
                case GeneEdition:
                    return ModTarget.Gene;
                case Twin:
                case Devour:
                    return ModTarget.TwoBlocks;
                case Dismantle:
                    return ModTarget.BoardBlock;
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

        /// <summary>改形状的改造给的目标形状;不改形状返回 null。</summary>
        public static TetrominoKind? ShapeOf(int id)
        {
            switch (id)
            {
                case ToO: return TetrominoKind.O;
                case ToI: return TetrominoKind.I;
                case ToT: return TetrominoKind.T;
                default: return null;
            }
        }
    }
}
