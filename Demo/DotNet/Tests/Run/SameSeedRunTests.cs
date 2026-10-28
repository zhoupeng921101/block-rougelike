using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Text;
using GameRules.Sim;
using NUnit.Framework;
using static System.FormattableString;

namespace GameRules.Tests
{
    /// <summary>
    /// 同种子跑局(17 号票,10 号票 §7):每个种子各跑贪心、随机两种策略,规范化轨迹全文都要和基准 A 一致。
    /// A 是本进程里跑的一局;B 同进程、全新对象、<c>tr-TR</c> 下再跑;C 子进程跑测试输出目录里的 Sim.dll;
    /// D 每步之后「写 → 读 → 再写」逐字节相同,第 1、2 步及之后每隔 5 步存读一次、用存档点拷下的策略接着打完。
    /// 方块库与盲注规格用出包的那份占位值,不断言结局;不入库基准轨迹,跨进程那一项靠 C。
    /// </summary>
    public class SameSeedRunTests
    {
        private const int ResumeEvery = 5;
        private const int ChildTimeoutMs = 60000;

        private static readonly string[] Seeds = BuildSeeds();

        private static readonly Dictionary<string, string> Baselines = new Dictionary<string, string>(StringComparer.Ordinal);

        public static IEnumerable<TestCaseData> Games()
        {
            foreach (string seed in Seeds)
            {
                foreach (string policy in SimPolicies.Names) yield return new TestCaseData(seed, policy);
            }
        }

        [OneTimeSetUp]
        public void RunBaselines()
        {
            foreach (string seed in Seeds)
            {
                foreach (string policy in SimPolicies.Names) Baselines[Key(seed, policy)] = SimGame.Run(seed, policy);
            }
        }

        [TestCaseSource(nameof(Games))]
        public void B_RerunInTheSameProcessUnderTurkishCulture(string seed, string policy)
        {
            CultureInfo culture = CultureInfo.CurrentCulture, uiCulture = CultureInfo.CurrentUICulture;
            string trace;
            try
            {
                CultureInfo.CurrentCulture = CultureInfo.CurrentUICulture = ExaggeratedTurkish();
                trace = SimGame.Run(seed, policy);
            }
            finally
            {
                CultureInfo.CurrentCulture = culture;
                CultureInfo.CurrentUICulture = uiCulture;
            }
            AssertSameTrace("B 同进程 tr-TR 再跑", seed, policy, trace);
        }

        [Test]
        public void C_ChildProcessPlaysTheSameGames()
        {
            string output = RunChild(Seeds, SimPolicies.Names);
            var games = new List<(string seed, string policy, string trace)>();
            int at = 0;
            while (at < output.Length)
            {
                Assert.AreEqual(at, output.IndexOf("game ", at, StringComparison.Ordinal), Invariant($"C 子进程:输出的第 {at} 个字符不是一局的开头"));
                int next = output.IndexOf("\ngame ", at, StringComparison.Ordinal);
                int end = next < 0 ? output.Length : next + 1;
                string trace = output.Substring(at, end - at);
                string[] head = trace.Substring(0, trace.IndexOf('\n')).Split(' ');
                games.Add((head[1].Substring("seed=".Length), head[2].Substring("policy=".Length), trace));
                at = end;
            }

            string[] expectedOrder = Games().Select(c => Key((string)c.Arguments[0], (string)c.Arguments[1])).ToArray();
            CollectionAssert.AreEqual(expectedOrder, games.Select(g => Key(g.seed, g.policy)).ToArray(), "C 子进程:局的次序与种子 × 策略的次序不同");
            var differing = games.Where(g => TraceCompare.FirstDifference(Baselines[Key(g.seed, g.policy)], g.trace) != null).ToList();
            if (differing.Count == 0) return;
            (string seed, string policy, string trace) first = differing[0];
            Assert.Fail(Describe(Invariant($"C 子进程({games.Count} 局里 {differing.Count} 局不同,下面是第一局)"), first.seed, first.policy, first.trace));
        }

        [TestCaseSource(nameof(Games))]
        public void D_SaveLoadEveryFewStepsAndPlayOn(string seed, string policyName)
        {
            ISimPolicy policy = SimPolicies.Create(policyName, seed);
            var trace = new TraceWriter();
            trace.Game(seed, policy.Name);
            RunState run = SimGame.NewRun(seed);
            trace.Start(run.StartBlind(PlaceholderTuning.FirstBlind));
            AssertRoundTrip(run, seed, policyName);
            int resumes = 0;
            while (run.Blind.Outcome == BlindOutcome.InProgress)
            {
                SimGame.PlayStep(run, policy, trace);
                RunState readBack = AssertRoundTrip(run, seed, policyName);
                int step = run.Blind.Step;
                if (step != 1 && (step < 2 || (step - 2) % ResumeEvery != 0)) continue;

                var resumed = new TraceWriter(trace.ToString());
                SimGame.PlayOut(readBack, policy.Clone(), resumed);
                AssertSameTrace(Invariant($"D 第 {step} 步后存读接着打"), seed, policyName, resumed.ToString());
                resumes++;
            }
            trace.End(run);
            AssertSameTrace("D 不存读的那一局", seed, policyName, trace.ToString());
            Assert.Greater(resumes, 0, "D 一次都没存读");
        }

        // ---- 助手 ----

        /// <summary>TESTSEED,加上 <c>SeedText.FromEntropy(1)</c> 到 <c>(7)</c>,共 8 个。</summary>
        private static string[] BuildSeeds()
        {
            var seeds = new List<string> { "TESTSEED" };
            for (ulong e = 1; e <= 7; e++) seeds.Add(SeedText.FromEntropy(e));
            return seeds.ToArray();
        }

        private static string Key(string seed, string policy) => seed + "/" + policy;

        /// <summary>
        /// B 路的区域设置:tr-TR(大小写有 i / İ 之分),数字格式再夸大成每 1 位一组、负号写成 <c>~</c>。
        /// 本图的分数到不了 1000,原样的 tr-TR 下 <c>N0</c> 与别的区域写出来一样;夸大之后两位数以上、负数的区域相关格式化都会显形。
        /// </summary>
        private static CultureInfo ExaggeratedTurkish()
        {
            var culture = (CultureInfo)CultureInfo.GetCultureInfo("tr-TR").Clone();
            NumberFormatInfo n = culture.NumberFormat;
            n.NumberGroupSizes = new[] { 1 };
            n.CurrencyGroupSizes = new[] { 1 };
            n.PercentGroupSizes = new[] { 1 };
            n.NegativeSign = "~";
            return culture;
        }

        private static void AssertSameTrace(string label, string seed, string policy, string actual)
        {
            string message = Describe(label, seed, policy, actual);
            if (message != null) Assert.Fail(message);
        }

        private static string Describe(string label, string seed, string policy, string actual)
        {
            string diff = TraceCompare.FirstDifference(Baselines[Key(seed, policy)], actual);
            return diff == null ? null : Invariant($"{label}:种子 {seed}、策略 {policy},{diff}");
        }

        /// <summary>写 → 读 → 再写逐字节相同;返回读回的那份状态(已过 <see cref="RunState.Validate"/>)。</summary>
        private static RunState AssertRoundTrip(RunState run, string seed, string policy)
        {
            string text = RunSnapshot.Write(run);
            SnapshotReadResult r = RunSnapshot.Read(text, PlaceholderTuning.Config);
            string where = Invariant($"D 种子 {seed}、策略 {policy},第 {run.Blind.Step} 步之后");
            if (!r.Ok) Assert.Fail(Invariant($"{where}读不回自己写的快照:{r.Error} [{r.Path}] {r.Detail}"));
            string diff = TraceCompare.FirstDifference(text, RunSnapshot.Write(r.State));
            if (diff != null) Assert.Fail(where + "「写 → 读 → 再写」的快照" + diff);
            return r.State;
        }

        /// <summary>
        /// 起一个 <c>dotnet Sim.dll</c>:Sim.dll 取本进程加载的那一份(随 ProjectReference 拷进测试输出目录,旁边有它的 runtimeconfig)。
        /// dotnet 取 SDK 设下的 <c>DOTNET_HOST_PATH</c>,没有就按 PATH 找。
        /// </summary>
        private static string RunChild(IEnumerable<string> seeds, IEnumerable<string> policies)
        {
            string simDll = typeof(SimGame).Assembly.Location;
            string host = Environment.GetEnvironmentVariable("DOTNET_HOST_PATH");
            var info = new ProcessStartInfo(string.IsNullOrEmpty(host) || !System.IO.File.Exists(host) ? "dotnet" : host)
            {
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                StandardOutputEncoding = new UTF8Encoding(false),
                StandardErrorEncoding = new UTF8Encoding(false),
            };
            info.ArgumentList.Add(simDll);
            info.ArgumentList.Add("--seeds");
            info.ArgumentList.Add(string.Join(",", seeds));
            info.ArgumentList.Add("--policy");
            info.ArgumentList.Add(string.Join(",", policies));

            using (Process p = Process.Start(info))
            {
                var stdout = p.StandardOutput.ReadToEndAsync();
                var stderr = p.StandardError.ReadToEndAsync();
                if (!p.WaitForExit(ChildTimeoutMs))
                {
                    p.Kill(true);
                    Assert.Fail(Invariant($"C 子进程 {ChildTimeoutMs / 1000} 秒没跑完:{simDll}"));
                }
                p.WaitForExit();
                Assert.AreEqual(0, p.ExitCode, Invariant($"C 子进程出口码 {p.ExitCode}:{simDll}\n{stderr.Result}"));
                return stdout.Result;
            }
        }
    }
}
