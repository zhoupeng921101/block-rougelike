using System.Collections.Generic;

namespace GameRules
{
    /// <summary>只读的盘面,给表现层与查询用。写盘只经 <see cref="BoardState"/> 的 Place / ClearCell。</summary>
    public interface IBoardView
    {
        /// <summary>格上块的实例 id;空格、死格为 0。</summary>
        int OwnerAt(int cell);

        bool IsOccupied(int cell);

        bool IsDead(int cell);

        /// <summary>这块在盘上还剩几格。</summary>
        int CellsOf(int instanceId);

        /// <summary>盘上的块(格层里出现的 id),按 id 升序。</summary>
        List<int> InstancesOnBoard();

        /// <summary>按 rot 档朝向、包围盒左上角落在 (row, col) 时放得下吗。死格挡落子。</summary>
        bool CanPlace(TetrominoKind kind, int rot, int row, int col);

        /// <summary>转到任一朝向、放到任一位置,有放得下的吗。托盘置灰与「放不下」判负共用它。</summary>
        bool CanPlaceAnyRotation(TetrominoKind kind);
    }
}
