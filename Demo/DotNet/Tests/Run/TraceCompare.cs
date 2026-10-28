using System;
using static System.FormattableString;

namespace GameRules.Tests
{
    /// <summary>轨迹逐行比对:报第一处不同的行,以及它落在哪一段(开盲注、第几步、终局摘要、终局快照)。</summary>
    internal static class TraceCompare
    {
        /// <summary>相同返回 null;不同返回「哪一段(第几行)起不同」加基准、实际各一行。</summary>
        public static string FirstDifference(string expected, string actual)
        {
            if (string.Equals(expected, actual, StringComparison.Ordinal)) return null;
            string[] e = expected.Split('\n');
            string[] a = actual.Split('\n');
            int i = 0;
            while (i < e.Length && i < a.Length && string.Equals(e[i], a[i], StringComparison.Ordinal)) i++;
            string section = SectionOf(i < e.Length ? e : a, i);
            return Invariant($"{section}(第 {i + 1} 行)起不同\n  基准: {LineAt(e, i)}\n  实际: {LineAt(a, i)}");
        }

        /// <summary>第 index 行属于哪一段:往上找最近的段头。快照文本里没有段头,报「开头」。</summary>
        private static string SectionOf(string[] lines, int index)
        {
            for (int k = Math.Min(index, lines.Length - 1); k >= 0; k--)
            {
                string line = lines[k];
                if (line.StartsWith("step ", StringComparison.Ordinal))
                {
                    int end = line.IndexOf(' ', 5);
                    return "第 " + (end < 0 ? line.Substring(5) : line.Substring(5, end - 5)) + " 步";
                }
                if (line == "start") return "开盲注";
                if (line.StartsWith("end ", StringComparison.Ordinal)) return "终局摘要";
                if (line == "state") return "终局快照";
                if (line.StartsWith("game ", StringComparison.Ordinal)) return "game 行";
            }
            return "开头";
        }

        private static string LineAt(string[] lines, int index) => index < lines.Length ? "\"" + lines[index] + "\"" : "(到此结束)";
    }
}
