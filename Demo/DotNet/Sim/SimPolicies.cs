using System;
using System.Collections.Generic;

namespace GameRules.Sim
{
    /// <summary>策略给出的一个动作;落子的朝向以这里为准,不看槽上存的朝向(同 <see cref="RunState.Place"/>)。</summary>
    public readonly struct SimMove
    {
        public readonly StepKind Kind;
        public readonly int InstanceId;
        public readonly int Rot;
        public readonly int Row;
        public readonly int Col;

        private SimMove(StepKind kind, int instanceId, int rot, int row, int col)
        {
            Kind = kind;
            InstanceId = instanceId;
            Rot = rot;
            Row = row;
            Col = col;
        }

        public static SimMove Place(int instanceId, int rot, int row, int col) => new SimMove(StepKind.Place, instanceId, rot, row, col);

        public static SimMove Discard(int instanceId) => new SimMove(StepKind.Discard, instanceId, 0, 0, 0);
    }

    /// <summary>落子策略:只调规则核心的公开 API,不改状态(10 号票 §7)。</summary>
    public interface ISimPolicy
    {
        /// <summary>轨迹 <c>game</c> 行与命令行里的名字。</summary>
        string Name { get; }

        /// <summary>进行中的盲注此刻走哪一步。规则核心已判负的局面不会问到这里。</summary>
        SimMove Choose(RunState run);

        /// <summary>
        /// 拷一份此刻的策略状态。策略的状态不进存档,存读续跑那一路在存档点把它拷给续跑的那一局,
        /// 两边的走法就只取决于读回来的对局状态。
        /// </summary>
        ISimPolicy Clone();
    }

    public static class SimPolicies
    {
        public const string Greedy = "greedy";
        public const string Random = "random";

        /// <summary>随机策略自己的流:种子文本与对局相同,不进对局状态(08 号票)。</summary>
        public const string PolicyKey = "sim.policy";

        public static readonly IReadOnlyList<string> Names = Array.AsReadOnly(new[] { Greedy, Random });

        /// <summary>按名字建一个全新的策略对象;随机策略的流从种子重新派生。不认的名字返回 null。</summary>
        public static ISimPolicy Create(string name, string seed)
        {
            switch (name)
            {
                case Greedy: return new GreedyPolicy();
                case Random: return new RandomPolicy(seed);
                default: return null;
            }
        }

        /// <summary>全部合法落子,按(槽位、朝向 0–3、行、列)的字典序。两种策略共用这一个枚举序。</summary>
        public static List<SimMove> LegalPlacements(RunState run)
        {
            var moves = new List<SimMove>();
            IReadOnlyList<TraySlot> tray = run.Blind.Tray;
            for (int slot = 0; slot < tray.Count; slot++)
            {
                if (tray[slot].IsEmpty) continue;
                int id = tray[slot].Id;
                for (int rot = 0; rot < 4; rot++)
                {
                    for (int row = 0; row < BoardCells.Rows; row++)
                    {
                        for (int col = 0; col < BoardCells.Cols; col++)
                        {
                            if (run.CanPlace(id, rot, row, col)) moves.Add(SimMove.Place(id, rot, row, col));
                        }
                    }
                }
            }
            return moves;
        }
    }

    /// <summary>
    /// 贪心:逐个合法落子做一次只读的判线定类型,取(类型底注 × 基础倍率,被消格数)最大的;不成线的都算 0。
    /// 平手取枚举序第一个,不排序。没有合法落子时弃掉槽位最靠前的一块。不带状态。
    /// </summary>
    public sealed class GreedyPolicy : ISimPolicy
    {
        public string Name => SimPolicies.Greedy;

        public ISimPolicy Clone() => new GreedyPolicy();

        public SimMove Choose(RunState run)
        {
            bool found = false;
            SimMove best = default;
            long bestValue = 0;
            int bestCells = 0;
            foreach (SimMove m in SimPolicies.LegalPlacements(run))
            {
                ClearResolution r = run.ResolveClear(m.InstanceId, m.Rot, m.Row, m.Col);
                long value = 0;
                int cells = 0;
                if (r.HasClear)
                {
                    ClearTypeBase b = run.BaseOf(r.Type.Value);
                    value = b.Chips * b.Mult;
                    cells = r.Cells.Count;
                }
                if (!found || value > bestValue || (value == bestValue && cells > bestCells))
                {
                    found = true;
                    best = m;
                    bestValue = value;
                    bestCells = cells;
                }
            }
            if (found) return best;
            if (run.Blind.DiscardsLeft == 0) throw new InvalidOperationException("没有合法落子、弃置也用完了,规则核心本该已判负");
            foreach (TraySlot slot in run.Blind.Tray)
            {
                if (!slot.IsEmpty) return SimMove.Discard(slot.Id);
            }
            throw new InvalidOperationException("进行中的盲注待放置区全空,规则核心本该已发组");
        }
    }

    /// <summary>
    /// 随机:合法动作 = 全部合法落子(同上枚举序),弃置次数还有时再加上「弃第 i 槽那块」;用 <see cref="SimPolicies.PolicyKey"/> 那条流取 <c>Index(n)</c>。
    /// </summary>
    public sealed class RandomPolicy : ISimPolicy
    {
        private readonly RngStreams _streams;
        private readonly IRandomSource _rng;

        public RandomPolicy(string seed) : this(new RngStreams(seed))
        {
        }

        private RandomPolicy(RngStreams streams)
        {
            _streams = streams;
            _rng = streams.Get(SimPolicies.PolicyKey);
        }

        public string Name => SimPolicies.Random;

        public ISimPolicy Clone() => new RandomPolicy(_streams.Clone());

        public SimMove Choose(RunState run)
        {
            List<SimMove> moves = SimPolicies.LegalPlacements(run);
            if (run.Blind.DiscardsLeft > 0)
            {
                foreach (TraySlot slot in run.Blind.Tray)
                {
                    if (!slot.IsEmpty) moves.Add(SimMove.Discard(slot.Id));
                }
            }
            if (moves.Count == 0) throw new InvalidOperationException("没有合法动作,规则核心本该已判负");
            return moves[_rng.Index(moves.Count)];
        }
    }
}
