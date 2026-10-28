using System;
using System.Collections.Generic;
using static System.FormattableString;

namespace GameRules.Sim
{
    /// <summary>
    /// 盘面开阔度:七种骨牌 19 个朝向在这块盘上还有几个合法落点,空盘 801(11 号票 §3)。一步贪心与整组规划拿它当「别把盘堵死」那一项。
    /// 落点表在首次用到时经规则核心的公开 API 建:空盘上逐个 (种类, 朝向, 行, 列) 问 <see cref="BoardState.CanPlace"/>、真放一块取格;
    /// 占同一组格的只记一次(O 的四个朝向、I / S / Z 转 180° 占的格相同)。
    /// </summary>
    public static class BoardOpenness
    {
        // 下标 = ((int)种类 × 4 + 朝向) × 64 + 左上角格号;0 = 空盘上也放不下
        private static readonly ulong[] Pieces = BuildPieces();

        // 互不相同的落点,按首次出现的次序
        private static readonly ulong[] Placements = DistinctPlacements();

        /// <summary>这块按 rot 落在 (row, col) 占的格,盘面掩码同 <see cref="BoardCells.BoardMaskBit"/>;空盘上也放不下的为 0。</summary>
        public static ulong PieceMask(TetrominoKind kind, int rot, int row, int col) =>
            Pieces[((int)kind * BlockShapeMap.RotCount + rot) * BoardCells.Count + BoardCells.Index(row, col)];

        /// <summary>挡落子的格:占用或死格。</summary>
        public static ulong Blocking(BoardState board)
        {
            ulong mask = 0UL;
            for (int cell = 0; cell < BoardCells.Count; cell++)
            {
                if (board.IsOccupied(cell) || board.IsDead(cell)) mask |= BoardCells.BoardMaskBit(cell);
            }
            return mask;
        }

        /// <summary>挡落子的格为 blocking 时,还有几个合法落点。</summary>
        public static int Count(ulong blocking)
        {
            int n = 0;
            foreach (ulong m in Placements)
            {
                if ((m & blocking) == 0UL) n++;
            }
            return n;
        }

        private static ulong[] BuildPieces()
        {
            var pieces = new ulong[Tetromino.KindCount * BlockShapeMap.RotCount * BoardCells.Count];
            for (int kind = 0; kind < Tetromino.KindCount; kind++)
            {
                var block = new BlockInstance(1, (TetrominoKind)kind, 1, Enhancement.None, Edition.None);
                for (int rot = 0; rot < BlockShapeMap.RotCount; rot++)
                {
                    for (int row = 0; row < BoardCells.Rows; row++)
                    {
                        for (int col = 0; col < BoardCells.Cols; col++)
                        {
                            var board = new BoardState();
                            if (!board.CanPlace(block.Kind, rot, row, col)) continue;
                            ulong mask = 0UL;
                            foreach (int cell in board.Place(block, rot, row, col)) mask |= BoardCells.BoardMaskBit(cell);
                            pieces[(kind * BlockShapeMap.RotCount + rot) * BoardCells.Count + BoardCells.Index(row, col)] = mask;
                        }
                    }
                }
            }
            return pieces;
        }

        private static ulong[] DistinctPlacements()
        {
            var seen = new HashSet<ulong>();
            var list = new List<ulong>();
            foreach (ulong m in Pieces)
            {
                if (m != 0UL && seen.Add(m)) list.Add(m);
            }
            return list.ToArray();
        }
    }

    /// <summary>
    /// 试算一个合法落子:即时分与落子之后挡落子的格。不成线的即时分为 0、盘面 = 落子前 | 这块(只有消除结算加分,规则 §3.1;本图没有效果);
    /// 成线的在 <see cref="RunState.Clone"/> 上真走一步,即时分取两边累计分之差,盘面 = (落子前 | 这块) 去掉被消的格。
    /// </summary>
    internal readonly struct PlacementTrial
    {
        public readonly long Gain;
        public readonly ulong BlockingAfter;

        /// <summary>这一步走完盲注就赢了。只有成线的落子会赢;批量模式的目标分不设上限,永远为 false。</summary>
        public readonly bool Won;

        private PlacementTrial(long gain, ulong blockingAfter, bool won)
        {
            Gain = gain;
            BlockingAfter = blockingAfter;
            Won = won;
        }

        /// <param name="blocking">落子前挡落子的格,即 <see cref="BoardOpenness.Blocking"/>(run.Blind.Board)。</param>
        public static PlacementTrial Run(RunState run, ulong blocking, SimMove m)
        {
            BlockInstance block = run.FindInstance(m.InstanceId);
            ulong after = blocking | BoardOpenness.PieceMask(block.Kind, m.Rot, m.Row, m.Col);
            ClearResolution clear = run.ResolveClear(m.InstanceId, m.Rot, m.Row, m.Col);
            if (!clear.HasClear) return new PlacementTrial(0, after, false);

            foreach (int cell in clear.Cells) after &= ~BoardCells.BoardMaskBit(cell);
            RunState probe = run.Clone();
            StepResult result = probe.Place(m.InstanceId, m.Rot, m.Row, m.Col);
            if (!result.Accepted) throw new InvalidOperationException(Invariant($"试算 inst={m.InstanceId} 被拒({result.Reject})"));
            return new PlacementTrial(probe.Blind.Score - run.Blind.Score, after, probe.Blind.Outcome == BlindOutcome.Won);
        }

        /// <summary>即时分 + 0.5 × 开阔度,乘 2 成整数,比较时不碰浮点。</summary>
        public static long Value(long gain, ulong blockingAfter) => 2 * gain + BoardOpenness.Count(blockingAfter);
    }

    /// <summary>
    /// 一步贪心(18 号票):逐个合法落子试算,取「即时分 + 0.5 × 落子后的开阔度」最大的;平手取枚举序第一个。
    /// 没有合法落子时弃掉槽位最靠前的一块。不知道目标分,不带状态。
    /// </summary>
    public sealed class OneStepPolicy : ISimPolicy
    {
        public string Name => SimPolicies.OneStep;

        public ISimPolicy Clone() => new OneStepPolicy();

        public SimMove Choose(RunState run)
        {
            ulong blocking = BoardOpenness.Blocking(run.Blind.Board);
            bool found = false;
            SimMove best = default;
            long bestValue = 0;
            foreach (SimMove m in SimPolicies.LegalPlacements(run))
            {
                PlacementTrial t = PlacementTrial.Run(run, blocking, m);
                long value = PlacementTrial.Value(t.Gain, t.BlockingAfter);
                if (!found || value > bestValue)
                {
                    found = true;
                    best = m;
                    bestValue = value;
                }
            }
            return found ? best : SimPolicies.DiscardFirst(run);
        }
    }

    /// <summary>
    /// 整组规划(18 号票):把这一组还在待放置区的块按任意顺序全放完,束搜索,挑「各步即时分之和 + 0.5 × 放完后的开阔度」最高的序列,走它的第一步。
    /// 每一层把束里每个局面的全部合法落子(只限这一组的块)试算、按同一个值排序(平手按枚举序),取前 <see cref="Width"/> 个,
    /// 盘面、累计即时分、已放的块三者都相同的只留第一个;留下的在 <see cref="RunState.Clone"/> 上真走一步再往下展开。
    /// 一组放不完时取放得最深的那一层里最好的。一块都放不下时弃掉槽位最靠前的一块。不带状态。
    /// <para>
    /// 目标分不读,但副本上真走的那几步会让规则核心判胜:哪一层有赢的序列,就走排在最前的那条(赢了的副本不能再落子,不这样就会绕开组内能赢的走法)。
    /// 所以它在出包的盲注里会抢组内看得到的胜,在批量模式(目标分不设上限,副本永远赢不了)里不会——批量测出来的是不抢胜的那一版,
    /// 「目标 T 下赢 ⇔ 累计分到过 T」对它不严格成立,一步贪心、贪心、随机才严格成立。
    /// </para>
    /// </summary>
    public sealed class PlanPolicy : ISimPolicy
    {
        public PlanPolicy(string name, int width)
        {
            if (width < 1) throw new ArgumentOutOfRangeException(nameof(width), width, "束宽至少 1");
            Name = name;
            Width = width;
        }

        public string Name { get; }

        /// <summary>束宽。</summary>
        public int Width { get; }

        public ISimPolicy Clone() => new PlanPolicy(Name, Width);

        public SimMove Choose(RunState run)
        {
            var group = new List<int>();
            foreach (TraySlot slot in run.Blind.Tray)
            {
                if (!slot.IsEmpty) group.Add(slot.Id);
            }

            var beam = new List<Node> { new Node(run, BoardOpenness.Blocking(run.Blind.Board), 0, 0, default) };
            Node best = null;
            var candidates = new List<Candidate>();
            var seen = new HashSet<(ulong, long, int)>();
            for (int depth = 0; depth < group.Count; depth++)
            {
                bool last = depth == group.Count - 1;
                candidates.Clear();
                for (int p = 0; p < beam.Count; p++)
                {
                    Node node = beam[p];
                    if (node.State.Blind.Outcome != BlindOutcome.InProgress) continue;
                    foreach (SimMove m in SimPolicies.LegalPlacements(node.State))
                    {
                        int g = group.IndexOf(m.InstanceId);
                        if (g < 0) continue;
                        PlacementTrial t = PlacementTrial.Run(node.State, node.Blocking, m);
                        long gain = node.Gain + t.Gain;
                        candidates.Add(new Candidate(p, m, node.Placed | (1 << g), gain, t.BlockingAfter,
                            PlacementTrial.Value(gain, t.BlockingAfter), t.Won, candidates.Count));
                    }
                }
                if (candidates.Count == 0) break;
                candidates.Sort(Candidate.Compare);
                foreach (Candidate c in candidates)
                {
                    // 这一层就有赢的序列:走排在最前的那条;赢了的副本不再展开,不取它就会绕开组内能赢的走法
                    if (c.Won) return depth == 0 ? c.Move : beam[c.Parent].First;
                }

                var next = new List<Node>(Width);
                seen.Clear();
                foreach (Candidate c in candidates)
                {
                    if (next.Count == Width) break;
                    if (!seen.Add((c.BlockingAfter, c.Gain, c.Placed))) continue;
                    Node parent = beam[c.Parent];
                    SimMove first = depth == 0 ? c.Move : parent.First;
                    RunState state = null;
                    if (!last)
                    {
                        // 最后一层不再展开,不用真走
                        state = parent.State.Clone();
                        StepResult r = state.Place(c.Move.InstanceId, c.Move.Rot, c.Move.Row, c.Move.Col);
                        if (!r.Accepted) throw new InvalidOperationException(Invariant($"规划 inst={c.Move.InstanceId} 被拒({r.Reject})"));
                    }
                    next.Add(new Node(state, c.BlockingAfter, c.Gain, c.Placed, first));
                }
                beam = next;
                best = beam[0];
            }
            return best != null ? best.First : SimPolicies.DiscardFirst(run);
        }

        private sealed class Node
        {
            public readonly RunState State;
            public readonly ulong Blocking;
            public readonly long Gain;
            public readonly int Placed;
            public readonly SimMove First;

            public Node(RunState state, ulong blocking, long gain, int placed, SimMove first)
            {
                State = state;
                Blocking = blocking;
                Gain = gain;
                Placed = placed;
                First = first;
            }
        }

        private readonly struct Candidate
        {
            public readonly int Parent;
            public readonly SimMove Move;
            public readonly int Placed;
            public readonly long Gain;
            public readonly ulong BlockingAfter;
            public readonly long Value;
            public readonly bool Won;
            public readonly int Order;

            public Candidate(int parent, SimMove move, int placed, long gain, ulong blockingAfter, long value, bool won, int order)
            {
                Parent = parent;
                Move = move;
                Placed = placed;
                Gain = gain;
                BlockingAfter = blockingAfter;
                Value = value;
                Won = won;
                Order = order;
            }

            // 值降序,平手按枚举序;Order 各不相同,不稳定的 List.Sort 也排得唯一
            public static int Compare(Candidate a, Candidate b) =>
                a.Value != b.Value ? b.Value.CompareTo(a.Value) : a.Order.CompareTo(b.Order);
        }
    }
}
