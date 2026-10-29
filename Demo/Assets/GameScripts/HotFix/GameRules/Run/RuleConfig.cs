using System;
using System.Collections.Generic;

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
        public int StartingMoney { get; }

        /// <summary>一局几段(设计稿 §1);地图布局按它生成。</summary>
        public int MapSegments { get; }

        public RuleConfig(IEnumerable<LibraryEntry> defaultLibrary, ClearTypeTable clearTypes, EffectRegistry effects,
            int startingMoney = 4, int mapSegments = RunMap.DefaultSegments)
        {
            if (defaultLibrary == null) throw new ArgumentNullException(nameof(defaultLibrary));
            if (startingMoney < 0) throw new ArgumentOutOfRangeException(nameof(startingMoney), startingMoney, "起始金钱不能为负");
            if (mapSegments < 1) throw new ArgumentOutOfRangeException(nameof(mapSegments), mapSegments, "段数至少为 1");
            DefaultLibrary = new List<LibraryEntry>(defaultLibrary).AsReadOnly();
            ClearTypes = clearTypes ?? throw new ArgumentNullException(nameof(clearTypes));
            Effects = effects ?? throw new ArgumentNullException(nameof(effects));
            StartingMoney = startingMoney;
            MapSegments = mapSegments;
            effects.Seal();
        }
    }
}
