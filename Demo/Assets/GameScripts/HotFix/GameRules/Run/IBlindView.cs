using System.Collections.Generic;

namespace GameRules
{
    /// <summary>只读的盲注状态,给表现层用。成员含义见 <see cref="BlindState"/>。</summary>
    public interface IBlindView
    {
        BlindSpec Spec { get; }

        BlindOutcome Outcome { get; }

        FailReason FailReason { get; }

        int Step { get; }

        int Group { get; }

        long Score { get; }

        int Combo { get; }

        int DiscardsLeft { get; }

        IReadOnlyList<int> Draw { get; }

        IReadOnlyList<TraySlot> Tray { get; }

        IBoardView Board { get; }

        IReadOnlyList<int> Discarded { get; }

        IReadOnlyList<int> Departed { get; }

        IReadOnlyList<BlockInstance> TempBlocks { get; }

        bool IsTrayEmpty { get; }

        int SlotOf(int instanceId);
    }
}
