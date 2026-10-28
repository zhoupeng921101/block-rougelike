using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using static System.FormattableString;

namespace GameRules.Sim
{
    /// <summary>一种策略的批量结果:各局按种子次序,另带这一批的墙钟耗时(只进报告,不参与统计)。</summary>
    public sealed class PolicyBatch
    {
        public PolicyBatch(string policy, IReadOnlyList<BatchGame> games, TimeSpan elapsed)
        {
            Policy = policy;
            Games = games;
            Elapsed = elapsed;
        }

        public string Policy { get; }

        public IReadOnlyList<BatchGame> Games { get; }

        public TimeSpan Elapsed { get; }
    }

    /// <summary>
    /// 批量回测的报告,Markdown 表,能直接贴进票里。分位数取最近秩:排序后第 ⌈p·n⌉ 个。
    /// 卡死率 = 结局是「放不下」的局数 / 局数;胜率 = 累计分到过目标的局数 / 局数;达标块数只计达标的局。
    /// </summary>
    public static class BatchReport
    {
        private static readonly double[] ScoreQuantiles = { 0.10, 0.25, 0.50, 0.75, 0.90 };

        // 下标 = (int)ClearType,即优先级序
        private static readonly string[] TypeNames = { "清屏", "五线", "同形态十字", "多线", "同形态", "三线", "拐角", "十字", "平行线", "双线", "单线" };

        public static string Write(IReadOnlyList<PolicyBatch> batches, IReadOnlyList<long> targets, string seedNote, int threads, TimeSpan total)
        {
            var sb = new StringBuilder();
            BlindSpec spec = BatchRunner.EndlessBlind;
            int games = batches.Count == 0 ? 0 : batches[0].Games.Count;
            Line(sb, "# 批量回测");
            Line(sb, "");
            Line(sb, Invariant($"- 每种策略 {games} 局,种子 {seedNote}"));
            Line(sb, Invariant($"- 方块库 {PlaceholderTuning.DefaultLibrary.Count} 块,弃置 {spec.Discards} 次,每组 {spec.GroupSize} 块;目标分不设上限,每局打到卡死或整库用完"));
            Line(sb, Invariant($"- {threads} 线程,总耗时 {Seconds(total)}"));
            Line(sb, "");

            Line(sb, "## 结局与总分");
            Line(sb, "");
            var head = new StringBuilder("| 策略 | 卡死率 | 平均步数 | 平均弃置 |");
            var rule = new StringBuilder("|---|--:|--:|--:|");
            foreach (double q in ScoreQuantiles)
            {
                head.Append(Invariant($" 总分 p{(int)Math.Round(q * 100)} |"));
                rule.Append("--:|");
            }
            head.Append(" 耗时 |");
            rule.Append("--:|");
            Line(sb, head.ToString());
            Line(sb, rule.ToString());
            foreach (PolicyBatch b in batches)
            {
                int stuck = 0;
                long steps = 0, discards = 0;
                var scores = new List<long>(b.Games.Count);
                foreach (BatchGame g in b.Games)
                {
                    if (g.End == FailReason.CannotPlace) stuck++;
                    steps += g.Steps;
                    discards += g.Discards;
                    scores.Add(g.Score);
                }
                scores.Sort();
                var row = new StringBuilder(Invariant($"| {b.Policy} | {Percent(stuck, b.Games.Count)} | {Mean(steps, b.Games.Count)} | {Mean(discards, b.Games.Count)} |"));
                foreach (double q in ScoreQuantiles) row.Append(Invariant($" {Quantile(scores, q)} |"));
                row.Append(Invariant($" {Seconds(b.Elapsed)} |"));
                Line(sb, row.ToString());
            }
            Line(sb, "");

            Line(sb, "## 目标分下的胜率");
            Line(sb, "");
            Line(sb, TargetHeader(targets));
            Line(sb, TargetRule(targets));
            foreach (PolicyBatch b in batches)
            {
                var row = new StringBuilder("| " + b.Policy + " |");
                foreach (long t in targets)
                {
                    int wins = 0;
                    foreach (BatchGame g in b.Games)
                    {
                        if (g.StepsToReach(t) >= 0) wins++;
                    }
                    row.Append(" " + Percent(wins, b.Games.Count) + " |");
                }
                Line(sb, row.ToString());
            }
            Line(sb, "");

            Line(sb, "## 达标时用掉的块数(只计达标的局,p10 / p50 / p90)");
            Line(sb, "");
            Line(sb, TargetHeader(targets));
            Line(sb, TargetRule(targets));
            foreach (PolicyBatch b in batches)
            {
                var row = new StringBuilder("| " + b.Policy + " |");
                foreach (long t in targets)
                {
                    var used = new List<long>();
                    foreach (BatchGame g in b.Games)
                    {
                        int n = g.StepsToReach(t);
                        if (n >= 0) used.Add(n);
                    }
                    used.Sort();
                    row.Append(used.Count == 0 ? " — |" : Invariant($" {Quantile(used, 0.10)} / {Quantile(used, 0.50)} / {Quantile(used, 0.90)} |"));
                }
                Line(sb, row.ToString());
            }
            Line(sb, "");

            Line(sb, "## 消除类型的出现频率(占全部消除的比例,括号里是次数)");
            Line(sb, "");
            var typeHead = new StringBuilder("| 类型 |");
            var typeRule = new StringBuilder("|---|");
            var totals = new long[batches.Count];
            var counts = new long[batches.Count, ClearTypes.Count];
            for (int i = 0; i < batches.Count; i++)
            {
                typeHead.Append(" " + batches[i].Policy + " |");
                typeRule.Append("--:|");
                foreach (BatchGame g in batches[i].Games)
                {
                    for (int t = 0; t < ClearTypes.Count; t++)
                    {
                        counts[i, t] += g.Clears[t];
                        totals[i] += g.Clears[t];
                    }
                }
            }
            Line(sb, typeHead.ToString());
            Line(sb, typeRule.ToString());
            for (int t = 0; t < ClearTypes.Count; t++)
            {
                var row = new StringBuilder("| " + TypeNames[t] + " |");
                for (int i = 0; i < batches.Count; i++) row.Append(Invariant($" {Share(counts[i, t], totals[i])} ({counts[i, t]}) |"));
                Line(sb, row.ToString());
            }
            var sum = new StringBuilder("| 合计(每局) |");
            for (int i = 0; i < batches.Count; i++) sum.Append(Invariant($" {totals[i]}({Mean(totals[i], batches[i].Games.Count)}) |"));
            Line(sb, sum.ToString());
            return sb.ToString();
        }

        /// <summary>最近秩分位数:排好序的 sorted 里第 ⌈p·n⌉ 个(从 1 数)。</summary>
        public static long Quantile(IReadOnlyList<long> sorted, double p)
        {
            if (sorted.Count == 0) throw new ArgumentException("空列表没有分位数", nameof(sorted));
            int rank = (int)Math.Ceiling(p * sorted.Count);
            return sorted[Math.Min(Math.Max(rank, 1), sorted.Count) - 1];
        }

        private static string TargetHeader(IReadOnlyList<long> targets)
        {
            var sb = new StringBuilder("| 策略 |");
            foreach (long t in targets) sb.Append(Invariant($" 目标 {t} |"));
            return sb.ToString();
        }

        private static string TargetRule(IReadOnlyList<long> targets)
        {
            var sb = new StringBuilder("|---|");
            for (int i = 0; i < targets.Count; i++) sb.Append("--:|");
            return sb.ToString();
        }

        private static string Percent(long part, long whole) => (100.0 * part / whole).ToString("0.0", CultureInfo.InvariantCulture) + "%";

        private static string Share(long part, long whole) =>
            whole == 0 ? "—" : (100.0 * part / whole).ToString("0.00", CultureInfo.InvariantCulture) + "%";

        private static string Mean(long sum, long count) => ((double)sum / count).ToString("0.00", CultureInfo.InvariantCulture);

        private static string Seconds(TimeSpan t) => t.TotalSeconds.ToString("0.0", CultureInfo.InvariantCulture) + " 秒";

        private static void Line(StringBuilder sb, string line) => sb.Append(line).Append('\n');
    }
}
