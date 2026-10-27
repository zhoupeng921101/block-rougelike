using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 规则核心吐给表现层与跑局轨迹的事件(07 号票 §4)。成员只许是 int、long、bool、枚举和有序 int 列表:
    /// 跑局测试按成员名反射打印、逐行比对,浮点和无序容器会让打印器抛异常(10 号票 §7)。
    /// 格一律是 row*8 + col;行、列列表升序;Cells 的次序就是它所在段落的次序。事件不带演出时长,但自带演出要用的块属性。
    /// </summary>
    public abstract class RuleEvent
    {
        internal static IReadOnlyList<int> Snapshot(IEnumerable<int> items) => Array.AsReadOnly(new List<int>(items).ToArray());
    }

    /// <summary>开盲注;不属于任何一步。</summary>
    public sealed class BlindStarted : RuleEvent
    {
        public long Target { get; }
        public int Discards { get; }
        public int GroupSize { get; }

        /// <summary>发第一组之前抽牌堆的块数。</summary>
        public int DrawLeft { get; }

        internal BlindStarted(long target, int discards, int groupSize, int drawLeft)
        {
            Target = target;
            Discards = discards;
            GroupSize = groupSize;
            DrawLeft = drawLeft;
        }
    }

    public sealed class GroupDealt : RuleEvent
    {
        /// <summary>这是第几组,从 1 起。</summary>
        public int Group { get; }

        /// <summary>待放置区各槽的实例 id,空槽为 0。</summary>
        public IReadOnlyList<int> Slots { get; }

        internal GroupDealt(int group, IEnumerable<int> slots)
        {
            Group = group;
            Slots = Snapshot(slots);
        }
    }

    public sealed class PiecePlaced : RuleEvent
    {
        public int InstanceId { get; }
        public TetrominoKind Kind { get; }
        public int Rot { get; }
        public int Row { get; }
        public int Col { get; }

        /// <summary>落下的 4 格,按块内序号(原始朝向的行优先序)。</summary>
        public IReadOnlyList<int> Cells { get; }

        internal PiecePlaced(int instanceId, TetrominoKind kind, int rot, int row, int col, IEnumerable<int> cells)
        {
            InstanceId = instanceId;
            Kind = kind;
            Rot = rot;
            Row = row;
            Col = col;
            Cells = Snapshot(cells);
        }
    }

    public sealed class ClearResolved : RuleEvent
    {
        public IReadOnlyList<int> Rows { get; }
        public IReadOnlyList<int> Cols { get; }

        /// <summary>被消格的结算次序:先行后列,交叉格归行(07 §1)。</summary>
        public IReadOnlyList<int> Cells { get; }

        public ClearType Type { get; }

        internal ClearResolved(IEnumerable<int> rows, IEnumerable<int> cols, IEnumerable<int> cells, ClearType type)
        {
            Rows = Snapshot(rows);
            Cols = Snapshot(cols);
            Cells = Snapshot(cells);
            Type = type;
        }
    }

    public sealed class BaseApplied : RuleEvent
    {
        public ClearType Type { get; }
        public int Level { get; }
        public long Chips { get; }
        public long Mult { get; }

        internal BaseApplied(ClearType type, int level, long chips, long mult)
        {
            Type = type;
            Level = level;
            Chips = chips;
            Mult = mult;
        }
    }

    public sealed class RepetitionGranted : RuleEvent
    {
        public EffectSource Source { get; }
        public int SourceIndex { get; }
        public int Cell { get; }
        public int Count { get; }

        internal RepetitionGranted(EffectSource source, int sourceIndex, int cell, int count)
        {
            Source = source;
            SourceIndex = sourceIndex;
            Cell = cell;
            Count = count;
        }
    }

    public sealed class CellScored : RuleEvent
    {
        public int Cell { get; }
        public int InstanceId { get; }
        public TetrominoKind Kind { get; }
        public int Points { get; }

        /// <summary>0 是本遍,1 起是重触发。</summary>
        public int Repetition { get; }

        /// <summary>加上这一格之后的底分累计。</summary>
        public long Chips { get; }

        internal CellScored(int cell, int instanceId, TetrominoKind kind, int points, int repetition, long chips)
        {
            Cell = cell;
            InstanceId = instanceId;
            Kind = kind;
            Points = points;
            Repetition = repetition;
            Chips = chips;
        }
    }

    /// <summary>钩子返回的非空效果;空效果不吐。</summary>
    public sealed class EffectApplied : RuleEvent
    {
        public EffectSource Source { get; }

        /// <summary>强化、版本是枚举值,基因是槽位。</summary>
        public int SourceIndex { get; }

        /// <summary>基因段里为 -1。</summary>
        public int Cell { get; }

        public long AddChips { get; }
        public long AddMult { get; }
        public long XMultPermille { get; }

        /// <summary>结算到这里时三区的累计值,表现层拿来跳数字。</summary>
        public long Chips { get; }
        public long Mult { get; }
        public long XMultTotal { get; }

        internal EffectApplied(EffectSource source, int sourceIndex, int cell, EffectDelta delta, long chips, long mult, long xMultTotal)
        {
            Source = source;
            SourceIndex = sourceIndex;
            Cell = cell;
            AddChips = delta.AddChips;
            AddMult = delta.AddMult;
            XMultPermille = delta.XMultPermille;
            Chips = chips;
            Mult = mult;
            XMultTotal = xMultTotal;
        }
    }

    public sealed class ScoreBooked : RuleEvent
    {
        public long Chips { get; }
        public long Mult { get; }
        public long XMultPermille { get; }

        /// <summary>这次的得分 = ⌊max(Chips,0) × max(Mult,0) × XMultPermille / 1000⌋。</summary>
        public long Gain { get; }

        /// <summary>入账后的累计分。</summary>
        public long Total { get; }

        internal ScoreBooked(long chips, long mult, long xMultPermille, long gain, long total)
        {
            Chips = chips;
            Mult = mult;
            XMultPermille = xMultPermille;
            Gain = gain;
            Total = total;
        }
    }

    public sealed class CellsCleared : RuleEvent
    {
        /// <summary>按清格次序,与 <see cref="ClearResolved.Cells"/> 相同。</summary>
        public IReadOnlyList<int> Cells { get; }

        /// <summary>这次最后一格被消、离场进消尽堆的块,按 id 升序。</summary>
        public IReadOnlyList<int> Departed { get; }

        internal CellsCleared(IEnumerable<int> cells, IEnumerable<int> departed)
        {
            Cells = Snapshot(cells);
            Departed = Snapshot(departed);
        }
    }

    public sealed class PieceDiscarded : RuleEvent
    {
        public int InstanceId { get; }
        public int DiscardsLeft { get; }

        internal PieceDiscarded(int instanceId, int discardsLeft)
        {
            InstanceId = instanceId;
            DiscardsLeft = discardsLeft;
        }
    }

    public sealed class BlindEnded : RuleEvent
    {
        public BlindOutcome Outcome { get; }
        public FailReason Reason { get; }

        internal BlindEnded(BlindOutcome outcome, FailReason reason)
        {
            Outcome = outcome;
            Reason = reason;
        }
    }

    /// <summary>每步最后一个事件,带这一步之后界面要刷的数。</summary>
    public sealed class StepEnded : RuleEvent
    {
        public int Step { get; }
        public int Combo { get; }
        public long Total { get; }
        public int DiscardsLeft { get; }
        public int DrawLeft { get; }

        internal StepEnded(int step, int combo, long total, int discardsLeft, int drawLeft)
        {
            Step = step;
            Combo = combo;
            Total = total;
            DiscardsLeft = discardsLeft;
            DrawLeft = drawLeft;
        }
    }
}
