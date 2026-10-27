using System;

namespace GameRules
{
    /// <summary>
    /// 方块实例:只装跟着块走、跨盲注保留的属性。不存形状 id、朝向、所在区——
    /// 形状由 <see cref="Tetromino.BaseShapeId"/> 推,朝向是待放置区槽位的状态,所在区由盲注上的各区列表决定(06 号票)。
    /// 永久改动(改形态、永久加点、强化、版本)直接改这里;只在本盲注有效的挂在盲注状态上、按 id 记。
    /// </summary>
    public sealed class BlockInstance
    {
        /// <summary>本局唯一,> 0,只经 <see cref="RunState.IssueId"/> 取号。</summary>
        public int Id { get; }

        public TetrominoKind Kind { get; internal set; }

        /// <summary>点数,就是基础值(规则 §2.1)。</summary>
        public int Points { get; internal set; }

        public Enhancement Enhancement { get; internal set; }

        public Edition Edition { get; internal set; }

        public BlockInstance(int id, TetrominoKind kind, int points, Enhancement enhancement, Edition edition)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id), id, "实例 id 从 1 起,0 留给空格");
            Id = id;
            Kind = kind;
            Points = points;
            Enhancement = enhancement;
            Edition = edition;
        }

        public BlockInstance Clone() => new BlockInstance(Id, Kind, Points, Enhancement, Edition);
    }
}
