using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 一局走到地图哪里(设计稿 §2):当前节点、是否已结算(打赢或跳过)、走过的节点。布局在 <see cref="RunMap"/> 里,这里只存进度。
    /// 进节点与结算分开:进节点之后要先打一场(或跳过),打完才允许选下一层——把「还没打就想走」挡在规则层,表现层不用自己记。
    /// </summary>
    public sealed class MapProgress
    {
        private readonly List<int> _visited;

        /// <summary>当前节点号;0 = 还没进第一个节点。</summary>
        public int CurrentNodeId { get; private set; }

        /// <summary>当前节点是否已结算(战斗胜利或跳过)。还没进节点时为 true,免得开局就被判「等待结算」。</summary>
        public bool CurrentResolved { get; private set; }

        /// <summary>当前节点是跳过的(没打、没拿奖励、没进商店)。进下一个节点时清掉。</summary>
        public bool CurrentSkipped { get; private set; }

        /// <summary>走过的节点,按进入次序。</summary>
        public IReadOnlyList<int> Visited => _visited;

        public MapProgress()
        {
            _visited = new List<int>();
            CurrentResolved = true;
        }

        private MapProgress(int current, bool resolved, bool skipped, List<int> visited)
        {
            CurrentNodeId = current;
            CurrentResolved = resolved;
            CurrentSkipped = skipped;
            _visited = visited;
        }

        /// <summary>此刻可选的节点:开局是第一个节点;否则是当前节点的下一层(当前节点已结算时才有)。</summary>
        public IReadOnlyList<MapNode> Choices(RunMap map)
        {
            if (map == null) throw new ArgumentNullException(nameof(map));
            if (CurrentNodeId == 0) return new[] { map.Start };
            if (!CurrentResolved) return Array.Empty<MapNode>();
            return map.NextAfter(CurrentNodeId);
        }

        /// <summary>进一个节点。不在可选范围、或当前节点还没结算时不改状态,返回 false。</summary>
        public bool Enter(RunMap map, int nodeId)
        {
            if (map == null) throw new ArgumentNullException(nameof(map));
            foreach (MapNode n in Choices(map))
            {
                if (n.Id != nodeId) continue;
                CurrentNodeId = nodeId;
                CurrentResolved = false;
                CurrentSkipped = false;
                _visited.Add(nodeId);
                return true;
            }
            return false;
        }

        /// <summary>
        /// 跳过当前可选的节点:进节点、直接结算、记「跳过」。节点不可跳(首领、第一段)时返回 false 且不改状态。
        /// </summary>
        public bool Skip(RunMap map, int nodeId)
        {
            if (map == null) throw new ArgumentNullException(nameof(map));
            if (nodeId < 1 || nodeId > map.Nodes.Count) return false;
            if (!map.Get(nodeId).CanSkip) return false;
            if (!Enter(map, nodeId)) return false;
            CurrentResolved = true;
            CurrentSkipped = true;
            return true;
        }

        /// <summary>结算当前节点(战斗胜利或跳过)。没有待结算的节点时不改状态,返回 false。</summary>
        public bool Resolve()
        {
            if (CurrentNodeId == 0 || CurrentResolved) return false;
            CurrentResolved = true;
            return true;
        }

        /// <summary>打过最后一关的首领且已结算,这一局就结束了。</summary>
        public bool IsComplete(RunMap map)
        {
            if (map == null) throw new ArgumentNullException(nameof(map));
            return CurrentNodeId == map.FinalBoss.Id && CurrentResolved;
        }

        public MapProgress Clone() => new MapProgress(CurrentNodeId, CurrentResolved, CurrentSkipped, new List<int>(_visited));

        /// <summary>读档的还原口(<see cref="RunSnapshot"/>):字段原样接上,随后由 <see cref="Validate"/> 校验。</summary>
        internal static MapProgress Restore(int current, bool resolved, bool skipped, List<int> visited) =>
            new MapProgress(current, resolved, skipped, visited ?? new List<int>());

        /// <summary>状态约束,返回第一条不成立的,形如「路径: 说明」;全部成立返回 null。与存档读入后的校验共用。</summary>
        public string Validate(RunMap map)
        {
            if (map == null) throw new ArgumentNullException(nameof(map));
            if (CurrentNodeId == 0)
            {
                if (_visited.Count != 0) return "map.visited: 还没进节点却已有走过的节点";
                if (!CurrentResolved) return "map.resolved: 还没进节点却处于待结算";
                if (CurrentSkipped) return "map.skipped: 还没进节点却标着跳过";
                return null;
            }
            if (CurrentSkipped && !CurrentResolved) return "map.skipped: 跳过的节点必须已结算";
            if (CurrentNodeId < 1 || CurrentNodeId > map.Nodes.Count) return "map.current: 节点号不在图上";
            if (_visited.Count == 0 || _visited[_visited.Count - 1] != CurrentNodeId)
            {
                return "map.visited: 走过的节点最后一个不是当前节点";
            }
            for (int i = 1; i < _visited.Count; i++)
            {
                int prev = _visited[i - 1], next = _visited[i];
                bool connected = false;
                foreach (MapNode n in map.NextAfter(prev))
                {
                    if (n.Id == next) { connected = true; break; }
                }
                if (!connected) return Invariant($"map.visited[{i}]: 节点 {next} 不是节点 {prev} 的下一层");
            }
            return null;
        }

        private static string Invariant(string message) => message;
    }
}
