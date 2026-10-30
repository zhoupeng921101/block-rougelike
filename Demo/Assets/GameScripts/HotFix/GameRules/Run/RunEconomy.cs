using System;
using static System.FormattableString;

namespace GameRules
{
    /// <summary>目标分曲线的整数算法(设计稿 §1):段间按配置倍率连乘、每段四舍五入;段内按节点的层×强度;最后乘难度修正。</summary>
    public static class RunTargets
    {
        /// <summary>第 <paramref name="segment"/> 段层 1 的基准分。逐段乘 <see cref="RuleConfig.SegmentTargetPermille"/> 并四舍五入,不用浮点。</summary>
        public static int BaseFor(int segment, RuleConfig config)
        {
            if (config == null) throw new ArgumentNullException(nameof(config));
            if (segment < 1 || segment > config.MapSegments)
            {
                throw new ArgumentOutOfRangeException(nameof(segment), segment, Invariant($"段在 1..{config.MapSegments}"));
            }
            long value = config.FirstTarget;
            for (int i = 1; i < segment; i++)
            {
                value = (value * config.SegmentTargetPermille + 500) / 1000;
                if (value > int.MaxValue) throw new InvalidOperationException("目标分溢出");
            }
            return (int)value;
        }

        /// <summary>节点的目标分 = 段基准 × 节点的层×强度 × 难度修正,两次都四舍五入。</summary>
        public static int For(MapNode node, RunDifficulty difficulty, RuleConfig config) =>
            For(node, difficulty, config, 1000);

        /// <summary>再加一层券的修正(如轻装券 ×0.95);<paramref name="extraPermille"/> 默认 1000 = 不修。</summary>
        public static int For(MapNode node, RunDifficulty difficulty, RuleConfig config, int extraPermille)
        {
            if (config == null) throw new ArgumentNullException(nameof(config));
            if (extraPermille < 0) throw new ArgumentOutOfRangeException(nameof(extraPermille), extraPermille, "修正不能为负");
            long value = BaseFor(node.Segment, config);
            value = (value * config.Tuning.NodeTargetPermille(node) * config.Tuning.DifficultyOf(difficulty).TargetPermille * extraPermille + 500000000L) / 1000000000L;
            if (value > int.MaxValue) throw new InvalidOperationException("目标分溢出");
            return (int)value;
        }
    }

    /// <summary>一场盲注的结算(设计稿 §3.2):通关奖励、利息、入账合计与入账后的持有额。</summary>
    public readonly struct Settlement
    {
        public readonly int NodeId;
        public readonly int Reward;
        public readonly int Interest;
        public readonly int Total;
        public readonly int MoneyAfter;

        /// <summary>盲注结束时基因给的钱(金脉等),不算在 <see cref="Total"/> 里,已含在 <see cref="MoneyAfter"/> 里。</summary>
        public readonly int GeneMoney;

        public Settlement(int nodeId, int reward, int interest, int moneyAfter, int geneMoney = 0)
        {
            GeneMoney = geneMoney;
            NodeId = nodeId;
            Reward = reward;
            Interest = interest;
            Total = reward + interest;
            MoneyAfter = moneyAfter;
        }
    }

    /// <summary>
    /// 局外经济(设计稿 §3.1):钱只有通关奖励与利息两个来源。全部整数,利息按「每持有 N 得 1、封顶持有额」算。
    /// 本类只算不动状态;入账由 <see cref="RunState.SettleBlind"/> 调 <see cref="RunState.AddMoney"/>。
    /// </summary>
    public static class RunEconomy
    {
        /// <summary>持有 <paramref name="money"/> 时这一场的利息。超过封顶持有额的部分不计息。</summary>
        public static int InterestOf(int money, RunDifficulty difficulty, RuleConfig config)
        {
            if (config == null) throw new ArgumentNullException(nameof(config));
            return InterestOf(money, config.InterestPer, config.Tuning.DifficultyOf(difficulty).InterestCap);
        }

        /// <summary>按给定的每档门槛与封顶算利息;券可能改封顶,所以另开这一个口。</summary>
        public static int InterestOf(int money, int per, int cap)
        {
            if (money < 0) throw new ArgumentOutOfRangeException(nameof(money), money, "持有额不能为负");
            if (per < 1) throw new ArgumentOutOfRangeException(nameof(per), per, "利息门槛至少 1");
            if (cap < 0) throw new ArgumentOutOfRangeException(nameof(cap), cap, "利息封顶不能为负");
            return Math.Min(money, cap) / per;
        }

        /// <summary>算这一场的结算,不改状态。钱要在调用之后才加进去,<see cref="Settlement.MoneyAfter"/> 由调用方补。</summary>
        public static Settlement Settle(MapNode node, RunDifficulty difficulty, int money, RuleConfig config) =>
            new Settlement(node.Id, config.Tuning.NodeReward(node), InterestOf(money, difficulty, config), money);

        /// <summary>按给定的门槛与封顶算结算(券改了封顶时用)。</summary>
        public static Settlement Settle(MapNode node, int reward, int money, int per, int cap) =>
            new Settlement(node.Id, reward, InterestOf(money, per, cap), money);
    }
}
