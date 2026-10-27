using System;
using System.Collections.Generic;
using static System.FormattableString;

namespace GameRules
{
    /// <summary>被消格的结算次序与消除类型的判定(规则 §3.1、§3.3)。纯函数,预览和真落子都经 <see cref="RunState.ResolveClear"/> 走到这里。</summary>
    public static class ClearRules
    {
        /// <summary>
        /// 判定优先级,从上往下取第一个满足的(规则 §3.3 的表)。定标时按出现频率重排就改这里,<see cref="ClearType"/> 的取值不动。
        /// </summary>
        public static IReadOnlyList<ClearType> Priority { get; } = Array.AsReadOnly(new[]
        {
            ClearType.AllClear,
            ClearType.FiveLine,
            ClearType.SameShapeCross,
            ClearType.MultiLine,
            ClearType.SameShape,
            ClearType.TripleLine,
            ClearType.Corner,
            ClearType.Cross,
            ClearType.Parallel,
            ClearType.DoubleLine,
            ClearType.SingleLine,
        });

        /// <summary>
        /// 被消格按线走:先走行(升序),行内从左到右;再走列(升序),列内从上到下,在行里走过的跳过。交叉格因此只出现一次、归行。
        /// rows、cols 须已升序。
        /// </summary>
        public static int[] OrderCells(IReadOnlyList<int> rows, IReadOnlyList<int> cols)
        {
            var cells = new List<int>(rows.Count * BoardCells.Cols + cols.Count * BoardCells.Rows);
            var rowFull = new bool[BoardCells.Rows];
            foreach (int r in rows)
            {
                rowFull[r] = true;
                for (int c = 0; c < BoardCells.Cols; c++) cells.Add(BoardCells.Index(r, c));
            }
            foreach (int c in cols)
            {
                for (int r = 0; r < BoardCells.Rows; r++)
                {
                    if (!rowFull[r]) cells.Add(BoardCells.Index(r, c));
                }
            }
            return cells.ToArray();
        }

        /// <summary>
        /// 定类型。sameShape:被消格全部来自同一种骨牌(比 Kind,朝向不算、镜像算两种);allClear:消除后除死格外没有方块。
        /// rows、cols 须已升序,且至少有一条线。
        /// </summary>
        public static ClearType Classify(IReadOnlyList<int> rows, IReadOnlyList<int> cols, bool sameShape, bool allClear)
        {
            int r = rows.Count, c = cols.Count, lines = r + c;
            if (lines == 0) throw new ArgumentException("没有满线,谈不上消除类型");
            foreach (ClearType type in Priority)
            {
                if (Matches(type, rows, cols, lines, sameShape, allClear)) return type;
            }
            throw new InvalidOperationException(Invariant($"{r} 行 {c} 列不满足任何消除类型"));
        }

        private static bool Matches(ClearType type, IReadOnlyList<int> rows, IReadOnlyList<int> cols, int lines, bool sameShape, bool allClear)
        {
            int r = rows.Count, c = cols.Count;
            switch (type)
            {
                case ClearType.AllClear: return allClear;
                case ClearType.FiveLine: return lines == 5;
                case ClearType.SameShapeCross: return sameShape && r >= 1 && c >= 1;
                case ClearType.MultiLine: return lines == 4;
                case ClearType.SameShape: return sameShape;
                case ClearType.TripleLine: return lines == 3;
                case ClearType.Corner: return r == 1 && c == 1 && IsEdge(rows[0], BoardCells.Rows) && IsEdge(cols[0], BoardCells.Cols);
                case ClearType.Cross: return r >= 1 && c >= 1;
                case ClearType.Parallel: return HasAdjacent(rows) || HasAdjacent(cols);
                case ClearType.DoubleLine: return lines == 2;
                case ClearType.SingleLine: return lines == 1;
                default: throw new ArgumentOutOfRangeException(nameof(type), type, "不是消除类型");
            }
        }

        private static bool IsEdge(int line, int count) => line == 0 || line == count - 1;

        private static bool HasAdjacent(IReadOnlyList<int> ascending)
        {
            for (int i = 1; i < ascending.Count; i++)
            {
                if (ascending[i] - ascending[i - 1] == 1) return true;
            }
            return false;
        }
    }
}
