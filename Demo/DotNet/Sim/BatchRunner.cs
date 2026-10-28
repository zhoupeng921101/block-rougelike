using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GameRules.Sim
{
    /// <summary>
    /// 一局打完整库的记录(18 号票):目标分不设上限、达标也不停,每局打到卡死或整库用完,
    /// 任意目标分下的胜负与达标时用掉几块都从「每步之后的累计分」读出来。
    /// </summary>
    public sealed class BatchGame
    {
        private readonly long[] _scoreAfterStep;
        private readonly int[] _clears;

        public BatchGame(string seed, string policy, FailReason end, long[] scoreAfterStep, int discards, int[] clears)
        {
            Seed = seed;
            Policy = policy;
            End = end;
            _scoreAfterStep = scoreAfterStep;
            Discards = discards;
            _clears = clears;
            ScoreAfterStep = Array.AsReadOnly(scoreAfterStep);
            Clears = Array.AsReadOnly(clears);
        }

        public string Seed { get; }

        public string Policy { get; }

        /// <summary><see cref="FailReason.CannotPlace"/> = 卡死;<see cref="FailReason.BudgetExhausted"/> = 整库用完。</summary>
        public FailReason End { get; }

        /// <summary>[i] = 第 i + 1 步之后的累计分。每步用掉一块:落下或弃掉。</summary>
        public IReadOnlyList<long> ScoreAfterStep { get; }

        public int Steps => _scoreAfterStep.Length;

        public long Score => _scoreAfterStep.Length == 0 ? 0 : _scoreAfterStep[_scoreAfterStep.Length - 1];

        public int Discards { get; }

        /// <summary>各消除类型打出的次数,下标 = (int)<see cref="ClearType"/>。</summary>
        public IReadOnlyList<int> Clears { get; }

        /// <summary>累计分第一次到 target 时走了几步,也就是用掉了几块;到不了为 -1。</summary>
        public int StepsToReach(long target)
        {
            for (int i = 0; i < _scoreAfterStep.Length; i++)
            {
                if (_scoreAfterStep[i] >= target) return i + 1;
            }
            return -1;
        }
    }

    /// <summary>
    /// 批量回测(18 号票,阶段 6 批量跑局的雏形):按种子跑 N 局,每局都打完整库。
    /// 各局互不相干,按种子并行;结果按种子次序放,汇总与报告不随线程数变。
    /// </summary>
    public static class BatchRunner
    {
        /// <summary>
        /// 批量模式的盲注规格:出包那份(<see cref="PlaceholderTuning.FirstBlind"/>)的段、层、弃置、每组块数,目标分换成 <see cref="long.MaxValue"/>。
        /// 段、层不变,洗牌那条流就和出包的一样;贪心、随机、一步贪心又不知道目标分,所以累计分到 T 之前的每一步都和目标为 T 的那一局相同,
        /// 「目标 T 下赢」⇔「这一局的累计分到过 T」(规则核心先判胜、后发组判负,到 T 的那一步就算赢)。
        /// 整组规划在副本上会碰到规则核心判胜,对它这条不严格成立,见 <see cref="PlanPolicy"/>。
        /// </summary>
        public static BlindSpec EndlessBlind { get; } = new BlindSpec(PlaceholderTuning.FirstBlind.Segment, PlaceholderTuning.FirstBlind.Layer,
            long.MaxValue, PlaceholderTuning.FirstBlind.Discards, PlaceholderTuning.FirstBlind.GroupSize);

        /// <summary>第 i 个种子 = <c>SeedText.FromEntropy(from + i)</c>。</summary>
        public static string[] Seeds(ulong from, int count)
        {
            var seeds = new string[count];
            for (int i = 0; i < count; i++) seeds[i] = SeedText.FromEntropy(from + (ulong)i);
            return seeds;
        }

        /// <summary>每个种子一局,按种子次序返回。parallelism 是最多同时跑几局。</summary>
        public static BatchGame[] Run(IReadOnlyList<string> seeds, string policy, int parallelism)
        {
            if (SimPolicies.Create(policy, SeedText.FromEntropy(0)) == null) throw new ArgumentException("不认识的策略:" + policy, nameof(policy));
            return Run(seeds, seed => SimPolicies.Create(policy, seed), parallelism);
        }

        /// <summary>同上,策略由 create 按种子新建,每局一个:没登记名字的策略变体也能批量跑。</summary>
        public static BatchGame[] Run(IReadOnlyList<string> seeds, Func<string, ISimPolicy> create, int parallelism)
        {
            var games = new BatchGame[seeds.Count];
            var options = new ParallelOptions { MaxDegreeOfParallelism = Math.Max(1, parallelism) };
            Parallel.For(0, seeds.Count, options, i => games[i] = Play(seeds[i], create(seeds[i])));
            return games;
        }

        /// <summary>默认方块库开新局,开 <see cref="EndlessBlind"/>,按策略打到结局。策略要是这一局新建的。</summary>
        public static BatchGame Play(string seed, ISimPolicy p)
        {
            RunState run = SimGame.NewRun(seed);
            run.StartBlind(EndlessBlind);
            var scores = new List<long>(SimGame.StepLimit(run));
            var clears = new int[ClearTypes.Count];
            while (run.Blind.Outcome == BlindOutcome.InProgress)
            {
                StepResult result = SimGame.PlayStep(run, p, null);
                foreach (RuleEvent e in result.Events)
                {
                    if (e is ClearResolved c) clears[(int)c.Type]++;
                }
                scores.Add(run.Blind.Score);
            }
            if (run.Blind.Outcome != BlindOutcome.Lost) throw new InvalidOperationException("目标分不设上限的盲注不该赢:" + seed);
            return new BatchGame(seed, p.Name, run.Blind.FailReason, scores.ToArray(), run.Blind.Spec.Discards - run.Blind.DiscardsLeft, clears);
        }
    }
}
