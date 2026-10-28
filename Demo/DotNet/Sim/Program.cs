using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Text;

namespace GameRules.Sim
{
    /// <summary>
    /// 两种用法:
    /// <list type="bullet">
    /// <item><c>Sim --seeds &lt;种子&gt;[,&lt;种子&gt;…] --policy &lt;策略&gt;[,&lt;策略&gt;…]</c>:先按种子、再按策略的次序逐局跑,轨迹依次写 stdout(ASCII、LF),不落文件。
    /// 种子要是规范种子文本(<see cref="SeedText.IsCanonical"/>)。同种子跑局测试的子进程那一路逐字节比它,输出不许改。</item>
    /// <item><c>Sim --batch &lt;N&gt; [--from &lt;K&gt;] [--policy …] [--targets 325,340,350,375] [--threads &lt;T&gt;]</c>:批量回测(18 号票)。
    /// 种子是 <c>SeedText.FromEntropy(K)</c>…<c>(K+N-1)</c>,K 默认 1;不给 <c>--policy</c> 就跑 <see cref="SimPolicies.All"/>;
    /// 每局打完整库,Markdown 报告写 stdout(UTF-8、LF),见 <see cref="BatchReport"/>。</item>
    /// </list>
    /// 策略:greedy、random、onestep(一步贪心)、plan(整组规划,束宽 8)、plan6(束宽 6)。
    /// 出口码:0 全部跑完;1 某局出错(错误写 stderr,逐局模式下已跑完的局照常在 stdout 里);2 参数不对。
    /// </summary>
    public static class Program
    {
        private static readonly long[] DefaultTargets = { 325, 340, 350, 375 };

        public static int Main(string[] args)
        {
            var stderr = new StreamWriter(Console.OpenStandardError(), new UTF8Encoding(false)) { NewLine = "\n", AutoFlush = true };
            if (!TryParse(args, out Options o, out string error))
            {
                stderr.WriteLine(error);
                stderr.WriteLine("用法: Sim --seeds <种子>[,<种子>…] --policy <策略>[,…]");
                stderr.WriteLine("      Sim --batch <局数> [--from <起始熵>] [--policy <策略>[,…]] [--targets <分>[,…]] [--threads <线程数>]");
                stderr.WriteLine("策略: " + string.Join(",", SimPolicies.All));
                return 2;
            }

            var stdout = new StreamWriter(Console.OpenStandardOutput(), new UTF8Encoding(false)) { NewLine = "\n" };
            try
            {
                if (o.Batch > 0) RunBatch(o, stdout, stderr);
                else
                {
                    foreach (string seed in o.Seeds)
                    {
                        foreach (string policy in o.Policies) stdout.Write(SimGame.Run(seed, policy));
                    }
                }
                return 0;
            }
            catch (Exception e)
            {
                stderr.WriteLine(e.ToString());
                return 1;
            }
            finally
            {
                stdout.Flush();
            }
        }

        private static void RunBatch(Options o, StreamWriter stdout, StreamWriter stderr)
        {
            string[] seeds = BatchRunner.Seeds(o.From, o.Batch);
            var batches = new List<PolicyBatch>();
            Stopwatch total = Stopwatch.StartNew();
            foreach (string policy in o.Policies)
            {
                Stopwatch sw = Stopwatch.StartNew();
                BatchGame[] games = BatchRunner.Run(seeds, policy, o.Threads);
                batches.Add(new PolicyBatch(policy, games, sw.Elapsed));
                stderr.WriteLine(policy + ": " + sw.Elapsed.TotalSeconds.ToString("0.0", CultureInfo.InvariantCulture) + " 秒");
            }
            string seedNote = string.Format(CultureInfo.InvariantCulture, "SeedText.FromEntropy({0})…({1}),即 {2} … {3}",
                o.From, o.From + (ulong)o.Batch - 1, seeds[0], seeds[seeds.Length - 1]);
            stdout.Write(BatchReport.Write(batches, o.Targets, seedNote, o.Threads, total.Elapsed));
        }

        private sealed class Options
        {
            public List<string> Seeds;
            public List<string> Policies;
            public int Batch;
            public ulong From = 1;
            public List<long> Targets;
            public int Threads = Environment.ProcessorCount;
        }

        private static bool TryParse(string[] args, out Options o, out string error)
        {
            o = new Options();
            for (int i = 0; i < args.Length; i++)
            {
                if (i + 1 >= args.Length) return Fail("参数 " + args[i] + " 后面缺值", out error);
                string value = args[++i];
                switch (args[i - 1])
                {
                    case "--seeds":
                        o.Seeds = Split(value);
                        break;
                    case "--policy":
                        o.Policies = Split(value);
                        break;
                    case "--batch":
                        if (!int.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out o.Batch) || o.Batch < 1) return Fail("--batch 要正整数:" + value, out error);
                        break;
                    case "--from":
                        if (!ulong.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out o.From)) return Fail("--from 要非负整数:" + value, out error);
                        break;
                    case "--targets":
                        o.Targets = new List<long>();
                        foreach (string t in Split(value))
                        {
                            if (!long.TryParse(t, NumberStyles.None, CultureInfo.InvariantCulture, out long target) || target < 1) return Fail("--targets 要正整数:" + t, out error);
                            o.Targets.Add(target);
                        }
                        break;
                    case "--threads":
                        if (!int.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out o.Threads) || o.Threads < 1) return Fail("--threads 要正整数:" + value, out error);
                        break;
                    default:
                        return Fail("不认识的参数:" + args[i - 1], out error);
                }
            }
            if (o.Batch > 0)
            {
                if (o.Seeds != null) return Fail("--batch 与 --seeds 不能同时给", out error);
                o.Policies ??= new List<string>(SimPolicies.All);
                o.Targets ??= new List<long>(DefaultTargets);
                if (o.Targets.Count == 0) return Fail("--targets 为空", out error);
            }
            else
            {
                if (o.Seeds == null || o.Seeds.Count == 0) return Fail("缺 --seeds", out error);
                if (o.Policies == null || o.Policies.Count == 0) return Fail("缺 --policy", out error);
                foreach (string s in o.Seeds)
                {
                    if (!SeedText.IsCanonical(s)) return Fail("不是规范种子文本:" + s, out error);
                }
            }
            if (o.Policies.Count == 0) return Fail("缺 --policy", out error);
            foreach (string p in o.Policies)
            {
                if (SimPolicies.Create(p, SeedText.FromEntropy(0)) == null) return Fail("不认识的策略:" + p, out error);
            }
            error = null;
            return true;
        }

        private static List<string> Split(string list) => new List<string>(list.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries));

        private static bool Fail(string message, out string error)
        {
            error = message;
            return false;
        }
    }
}
