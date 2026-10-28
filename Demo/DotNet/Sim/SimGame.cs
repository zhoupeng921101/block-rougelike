using System;
using static System.FormattableString;

namespace GameRules.Sim
{
    /// <summary>
    /// 跑一局:默认方块库开新局、开首个盲注(都是出包的那份占位值,11 号票),按策略走到结局,写成规范化轨迹。
    /// 测试的几路与命令行都走这里;存读续跑那一路拿 <see cref="PlayStep"/>、<see cref="PlayOut"/> 自己拼。
    /// </summary>
    public static class SimGame
    {
        public static RunState NewRun(string seed) => RunState.NewRun(seed, PlaceholderTuning.Config);

        public static string Run(string seed, string policyName)
        {
            ISimPolicy policy = SimPolicies.Create(policyName, seed) ?? throw new ArgumentException("不认识的策略:" + policyName, nameof(policyName));
            var trace = new TraceWriter();
            trace.Game(seed, policy.Name);
            RunState run = NewRun(seed);
            trace.Start(run.StartBlind(PlaceholderTuning.FirstBlind));
            PlayOut(run, policy, trace);
            return trace.ToString();
        }

        /// <summary>走到结局,再写 <c>end</c> 与终局快照。</summary>
        public static void PlayOut(RunState run, ISimPolicy policy, TraceWriter trace)
        {
            while (run.Blind.Outcome == BlindOutcome.InProgress) PlayStep(run, policy, trace);
            trace.End(run);
        }

        /// <summary>
        /// 走一步并写进轨迹。步数到了上限还没结束,或者策略给的动作被拒,都抛:前者是规则核心没能结束这一局,后者是策略写错了。
        /// </summary>
        public static StepResult PlayStep(RunState run, ISimPolicy policy, TraceWriter trace)
        {
            int limit = StepLimit(run);
            if (run.Blind.Step >= limit)
            {
                throw new InvalidOperationException(Invariant($"种子 {run.Seed}、策略 {policy.Name}:走了 {run.Blind.Step} 步(上限 {limit})盲注还没结束"));
            }
            SimMove move = policy.Choose(run);
            StepResult result = move.Kind == StepKind.Place
                ? run.Place(move.InstanceId, move.Rot, move.Row, move.Col)
                : run.Discard(move.InstanceId);
            if (!result.Accepted)
            {
                throw new InvalidOperationException(Invariant($"种子 {run.Seed}、策略 {policy.Name}:第 {run.Blind.Step + 1} 步 {move.Kind} inst={move.InstanceId} 被拒({result.Reject})"));
            }
            trace.Step(move, result);
            return result;
        }

        /// <summary>步数上限 = 方块库块数 + 弃置次数 + 1(10 号票 §7)。</summary>
        public static int StepLimit(RunState run) => run.Library.Count + run.Blind.Spec.Discards + 1;
    }
}
