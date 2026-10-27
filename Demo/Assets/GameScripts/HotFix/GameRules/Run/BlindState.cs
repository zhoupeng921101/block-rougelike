using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 一个盲注的状态(06 号票 §6)。各区只按 id 引用方块库,库里每块在盲注里恰好在一个区(<see cref="RunState.Validate"/> 查);
    /// 盲注结束直接丢掉本对象就是「整块洗回」,下一个盲注从方块库重建抽牌堆。
    /// 只在本盲注有效的东西一律挂在这里、按 id 记,不挂在块上。「盘上」不另存列表,就是 <see cref="Board"/> 格层里出现的 id。
    /// </summary>
    public sealed class BlindState : IBlindView
    {
        internal readonly List<int> DrawList;
        internal readonly TraySlot[] TraySlots;
        internal readonly List<int> DiscardedList;
        internal readonly List<int> DepartedList;
        internal readonly List<BlockInstance> TempList;

        public BlindSpec Spec { get; }

        public BlindOutcome Outcome { get; internal set; }

        public FailReason FailReason { get; internal set; }

        /// <summary>已完成的步数,从 0 起。一步 = 一次落子或弃置;开盲注、转朝向都不算步。</summary>
        public int Step { get; internal set; }

        /// <summary>已发的组数,每发一组加 1。</summary>
        public int Group { get; internal set; }

        public long Score { get; internal set; }

        public int Combo { get; internal set; }

        public int DiscardsLeft { get; internal set; }

        /// <summary>抽牌堆,下标 0 先抽。</summary>
        public IReadOnlyList<int> Draw { get; }

        /// <summary>待放置区,定长 = 每组块数。放掉、弃掉的槽留空,别的槽不挪:命令和事件只用 id 指块,不用槽号。</summary>
        public IReadOnlyList<TraySlot> Tray { get; }

        public BoardState Board { get; }

        /// <summary>弃置堆,按弃的先后。</summary>
        public IReadOnlyList<int> Discarded { get; }

        /// <summary>消尽堆:最后一格被消掉才离场,按离场先后。</summary>
        public IReadOnlyList<int> Departed { get; }

        /// <summary>不属于方块库、只活在本盲注里的块(首领预置块等,本图没有)。</summary>
        public IReadOnlyList<BlockInstance> TempBlocks { get; }

        IBoardView IBlindView.Board => Board;

        internal BlindState(BlindSpec spec)
            : this(spec, new List<int>(), new TraySlot[spec.GroupSize], new BoardState(),
                new List<int>(), new List<int>(), new List<BlockInstance>())
        {
            DiscardsLeft = spec.Discards;
        }

        private BlindState(BlindSpec spec, List<int> draw, TraySlot[] tray, BoardState board,
            List<int> discarded, List<int> departed, List<BlockInstance> temp)
        {
            Spec = spec ?? throw new ArgumentNullException(nameof(spec));
            DrawList = draw;
            TraySlots = tray;
            Board = board;
            DiscardedList = discarded;
            DepartedList = departed;
            TempList = temp;
            Draw = draw.AsReadOnly();
            Tray = Array.AsReadOnly(tray);
            Discarded = discarded.AsReadOnly();
            Departed = departed.AsReadOnly();
            TempBlocks = temp.AsReadOnly();
        }

        internal BlindState Clone()
        {
            var temp = new List<BlockInstance>(TempList.Count);
            foreach (BlockInstance b in TempList) temp.Add(b.Clone());
            return new BlindState(Spec, new List<int>(DrawList), (TraySlot[])TraySlots.Clone(), Board.Clone(),
                new List<int>(DiscardedList), new List<int>(DepartedList), temp)
            {
                Outcome = Outcome,
                FailReason = FailReason,
                Step = Step,
                Group = Group,
                Score = Score,
                Combo = Combo,
                DiscardsLeft = DiscardsLeft,
            };
        }

        public bool IsTrayEmpty
        {
            get
            {
                foreach (TraySlot slot in TraySlots)
                {
                    if (!slot.IsEmpty) return false;
                }
                return true;
            }
        }

        /// <summary>这块在待放置区的槽号;不在待放置区返回 -1。</summary>
        public int SlotOf(int instanceId)
        {
            if (instanceId <= 0) return -1;
            for (int i = 0; i < TraySlots.Length; i++)
            {
                if (TraySlots[i].Id == instanceId) return i;
            }
            return -1;
        }

        /// <summary>
        /// 待放置区全空、抽牌堆非空时发一组:从槽 0 起依次填,剩几块抽几块(规则 §2.2),朝向一律 0。发了返回 true。
        /// </summary>
        internal bool DealGroup()
        {
            if (!IsTrayEmpty || DrawList.Count == 0) return false;
            int n = Math.Min(Spec.GroupSize, DrawList.Count);
            for (int i = 0; i < n; i++) TraySlots[i] = new TraySlot(DrawList[i], 0);
            DrawList.RemoveRange(0, n);
            Group++;
            return true;
        }
    }
}
