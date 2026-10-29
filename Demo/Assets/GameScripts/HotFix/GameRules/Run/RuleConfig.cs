using System;
using System.Collections.Generic;
using static System.FormattableString;

namespace GameRules
{
    /// <summary>默认方块库清单的一项。强化、版本默认是「无」。</summary>
    public readonly struct LibraryEntry
    {
        public readonly TetrominoKind Kind;
        public readonly int Points;
        public readonly Enhancement Enhancement;
        public readonly Edition Edition;

        public LibraryEntry(TetrominoKind kind, int points, Enhancement enhancement = Enhancement.None, Edition edition = Edition.None)
        {
            Kind = kind;
            Points = points;
            Enhancement = enhancement;
            Edition = edition;
        }
    }

    /// <summary>
    /// 开局时传入的规则配置,不是状态:不进存档,<see cref="RunState.Clone"/> 共享同一份;读档要传开局时那一份(09 号票)。
    /// </summary>
    public sealed class RuleConfig
    {
        /// <summary>
        /// 开局按这个顺序逐块取号。洗牌前又按 id 排序,所以清单顺序加种子决定抽牌顺序:顺序是规则的一部分,不能随手改。
        /// </summary>
        public IReadOnlyList<LibraryEntry> DefaultLibrary { get; }

        /// <summary>消除类型表,按(类型,等级)查。</summary>
        public ClearTypeTable ClearTypes { get; }

        /// <summary>强化、版本、基因的效果;交进来时封住。</summary>
        public EffectRegistry Effects { get; }

        /// <summary>开局金钱(设计稿 §3.1 的候选值,阶段 6 定标)。</summary>
        public int StartingMoney => Tuning.StartingMoney;

        /// <summary>一局几段(设计稿 §1);地图布局按它生成。</summary>
        public int MapSegments => Tuning.MapSegments;

        /// <summary>第一段第一层的目标分(阶段 4 的占位值 350)。</summary>
        public int FirstTarget => Tuning.FirstTarget;

        /// <summary>段间目标分倍率,千分值(设计稿 §1 的 ×2.3)。</summary>
        public int SegmentTargetPermille => Tuning.SegmentTargetPermille;

        /// <summary>每盲注的基础弃置次数;难度档在这上面加减。</summary>
        public int BaseDiscards => Tuning.BaseDiscards;

        /// <summary>每组块数的默认值(规则 §2.1 定为 3,不是占位)。</summary>
        public int DefaultGroupSize => Tuning.DefaultGroupSize;

        /// <summary>利息:每持有这么多钱得 $1。</summary>
        public int InterestPer => Tuning.InterestPer;

        /// <summary>利息封顶的持有额(标准档);难度档会改它。</summary>
        public int InterestCap => Tuning.InterestCap;

        /// <summary>商店与补给包能出现的东西(局外循环设计稿 §4);空目录 = 不卖东西。</summary>
        public ContentCatalog Catalog { get; }

        /// <summary>基因槽的默认数量(规则 §4.1:默认 4、最多 6;扩槽走优惠券与负片)。</summary>
        public int GeneSlots => Tuning.GeneSlots;

        /// <summary>道具栏(改造)的默认格数(规则 §4.3:默认 2、最多 3)。</summary>
        public int ConsumableSlots => Tuning.ConsumableSlots;

        /// <summary>一局的数值表(目标分曲线、难度、商店定价、首领与标签参数)。</summary>
        public RunTuning Tuning { get; }

        public RuleConfig(IEnumerable<LibraryEntry> defaultLibrary, ClearTypeTable clearTypes, EffectRegistry effects,
            ContentCatalog catalog = null, RunTuning tuning = null)
        {
            if (defaultLibrary == null) throw new ArgumentNullException(nameof(defaultLibrary));
            Tuning = tuning ?? RunTuning.Default;
            string invalid = Tuning.Validate();
            if (invalid != null) throw new ArgumentOutOfRangeException(nameof(tuning), invalid);
            DefaultLibrary = new List<LibraryEntry>(defaultLibrary).AsReadOnly();
            ClearTypes = clearTypes ?? throw new ArgumentNullException(nameof(clearTypes));
            Effects = effects ?? throw new ArgumentNullException(nameof(effects));
            Catalog = catalog ?? ContentCatalog.Empty;
            effects.Seal();
        }
    }
}
