using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 只读的局状态,给表现层用:界面按它全量刷新(开新局与续局走同一条路),变化经事件得知,改状态只经 <see cref="RunState"/> 的命令。
    /// 成员含义见 <see cref="RunState"/>。
    /// </summary>
    public interface IRunView
    {
        string Seed { get; }

        IReadOnlyList<BlockInstance> Library { get; }

        IReadOnlyList<int> TypeLevels { get; }

        IReadOnlyList<GeneSlot> Genes { get; }

        IBlindView Blind { get; }

        int LevelOf(ClearType type);

        BlockInstance FindInstance(int instanceId);

        bool CanPlace(int instanceId, int rot, int row, int col);

        bool CanPlaceAnyRotation(int instanceId);
    }
}
