using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>默认方块库清单的一项。</summary>
    public readonly struct LibraryEntry
    {
        public readonly TetrominoKind Kind;
        public readonly int Points;

        public LibraryEntry(TetrominoKind kind, int points)
        {
            Kind = kind;
            Points = points;
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

        public RuleConfig(IEnumerable<LibraryEntry> defaultLibrary)
        {
            if (defaultLibrary == null) throw new ArgumentNullException(nameof(defaultLibrary));
            DefaultLibrary = new List<LibraryEntry>(defaultLibrary).AsReadOnly();
        }
    }
}
