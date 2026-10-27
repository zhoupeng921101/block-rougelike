using System;
using System.Collections.Generic;
using static System.FormattableString;

namespace GameRules
{
    /// <summary>一种消除类型在某一级的底注与基础倍率。</summary>
    public readonly struct ClearTypeBase
    {
        public readonly long Chips;
        public readonly long Mult;

        public ClearTypeBase(long chips, long mult)
        {
            Chips = chips;
            Mult = mult;
        }
    }

    /// <summary>类型表的一行:类型、等级(从 1 起)、底注、基础倍率。</summary>
    public readonly struct ClearTypeRow
    {
        public readonly ClearType Type;
        public readonly int Level;
        public readonly long Chips;
        public readonly long Mult;

        public ClearTypeRow(ClearType type, int level, long chips, long mult)
        {
            Type = type;
            Level = level;
            Chips = chips;
            Mult = mult;
        }
    }

    /// <summary>
    /// 消除类型表,按(类型,等级)查。是开局时传入的规则配置(<see cref="RuleConfig"/>),不是状态。
    /// 每种类型都要有从 1 起、连续的等级;升级增量归阶段 5 的科技,本图只有 1 级。
    /// </summary>
    public sealed class ClearTypeTable
    {
        // 下标 = (int)ClearType,再按 等级 - 1
        private readonly ClearTypeBase[][] _levels;

        public ClearTypeTable(IEnumerable<ClearTypeRow> rows)
        {
            if (rows == null) throw new ArgumentNullException(nameof(rows));
            var byType = new List<ClearTypeBase>[ClearTypes.Count];
            for (int t = 0; t < byType.Length; t++) byType[t] = new List<ClearTypeBase>();
            foreach (ClearTypeRow row in rows)
            {
                int t = (int)row.Type;
                if (t < 0 || t >= ClearTypes.Count) throw new ArgumentException(Invariant($"不是消除类型:{row.Type}"), nameof(rows));
                if (row.Level != byType[t].Count + 1)
                {
                    throw new ArgumentException(Invariant($"{row.Type} 的等级须从 1 起依次给出,这一行是 {row.Level}"), nameof(rows));
                }
                byType[t].Add(new ClearTypeBase(row.Chips, row.Mult));
            }
            _levels = new ClearTypeBase[ClearTypes.Count][];
            for (int t = 0; t < byType.Length; t++)
            {
                if (byType[t].Count == 0) throw new ArgumentException(Invariant($"{(ClearType)t} 没有 1 级"), nameof(rows));
                _levels[t] = byType[t].ToArray();
            }
        }

        public int MaxLevel(ClearType type) => _levels[CheckType(type)].Length;

        public ClearTypeBase Get(ClearType type, int level)
        {
            ClearTypeBase[] levels = _levels[CheckType(type)];
            if (level < 1 || level > levels.Length)
            {
                throw new ArgumentOutOfRangeException(nameof(level), level, Invariant($"{type} 的等级在 1..{levels.Length}"));
            }
            return levels[level - 1];
        }

        private static int CheckType(ClearType type)
        {
            int t = (int)type;
            if (t < 0 || t >= ClearTypes.Count) throw new ArgumentOutOfRangeException(nameof(type), type, "不是消除类型");
            return t;
        }
    }
}
