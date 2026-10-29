using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>节点的强度档(局外循环设计稿 §2.2):轻 / 中 / 重是普通节点,首领固定一档。</summary>
    public enum NodeStrength
    {
        Light = 0,
        Normal = 1,
        Heavy = 2,
        Boss = 3,
    }

    /// <summary>地图上的一个节点。首领节点不能跳过(规则 §2.3)。</summary>
    public readonly struct MapNode
    {
        public readonly int Id;
        public readonly int Segment;
        public readonly int Layer;
        public readonly NodeStrength Strength;

        /// <summary>跳过这个节点给的标签;0 = 不给(首领、第一段)。标签表在阶段 5 的内容清单里,这里只存号。</summary>
        public readonly int TagId;

        public MapNode(int id, int segment, int layer, NodeStrength strength, int tagId = 0)
        {
            Id = id;
            Segment = segment;
            Layer = layer;
            Strength = strength;
            TagId = tagId;
        }

        public bool IsBoss => Strength == NodeStrength.Boss;

        /// <summary>第一段的普通节点不能跳:规则 §2.3,逼玩家先建立基础盘。</summary>
        public bool CanSkip => !IsBoss && Segment > 1;

        /// <summary>
        /// 目标分倍率(设计稿 §1、§2.2):大盲是层 1 的 ×1.5,首领是 ×2.1;普通节点再乘轻 ×0.9 / 中 ×1.0 / 重 ×1.1。
        /// 千分值,层与强度都按整数折,1500 × 1100 / 1000 = 1650 不丢精度。
        /// </summary>
        public int TargetPermille
        {
            get
            {
                if (IsBoss) return 2100;
                int layer = Layer == 1 ? 1000 : 1500;
                int strength = Strength == NodeStrength.Light ? 900 : Strength == NodeStrength.Normal ? 1000 : 1100;
                return layer * strength / 1000;
            }
        }

        /// <summary>通关奖励(美元)。首领 $6,其余 $3/$4/$5(设计稿 §3.1)。</summary>
        public int Reward => Strength == NodeStrength.Light ? 3
            : Strength == NodeStrength.Normal ? 4
            : Strength == NodeStrength.Heavy ? 5
            : 6;
    }

    /// <summary>
    /// 一局的地图布局(设计稿 §2):6 段 × 3 层,前两层 2–3 个普通节点、第三层一个首领;第一段第一层只有唯一节点。
    /// 布局由种子在开局时一次生成,之后只读:同一份种子与同一份代码必得同一张图,所以局内存档只需存进度,布局可以按种子重算。
    /// 相邻层全连,不做汇合;节点的朝向不设意义,列表次序即展示次序。
    /// </summary>
    public sealed class RunMap
    {
        public const int DefaultSegments = 6;
        public const int LayersPerSegment = 3;

        private readonly List<MapNode> _nodes;

        public int SegmentCount { get; }

        public IReadOnlyList<MapNode> Nodes => _nodes;

        /// <summary>第一段第一层的唯一节点,一局从这里开始。</summary>
        public MapNode Start => NodesAt(1, 1)[0];

        private RunMap(List<MapNode> nodes, int segmentCount)
        {
            _nodes = nodes;
            SegmentCount = segmentCount;
        }

        /// <summary>按种子生成。只消费 <c>map</c> 一条流,且只在开局消费一次:地图不随玩家操作重掷。</summary>
        public static RunMap Generate(string seed, int segmentCount = DefaultSegments)
        {
            if (segmentCount < 1) throw new ArgumentOutOfRangeException(nameof(segmentCount), segmentCount, "段数至少为 1");
            return Generate(new RngStreams(seed).Get(RngKeys.Map), segmentCount);
        }

        /// <summary>用调用方的流生成(一局用 <see cref="RunState.Rng"/> 的那条,保持同种子可复现)。</summary>
        public static RunMap Generate(IRandomSource rng, int segmentCount = DefaultSegments)
        {
            if (rng == null) throw new ArgumentNullException(nameof(rng));
            if (segmentCount < 1) throw new ArgumentOutOfRangeException(nameof(segmentCount), segmentCount, "段数至少为 1");
            var nodes = new List<MapNode>(segmentCount * 8);
            int id = 1;
            for (int segment = 1; segment <= segmentCount; segment++)
            {
                for (int layer = 1; layer <= LayersPerSegment; layer++)
                {
                    if (layer == LayersPerSegment)
                    {
                        nodes.Add(new MapNode(id++, segment, layer, NodeStrength.Boss));
                        continue;
                    }
                    // 第一段第一层只有一条路:新玩家第一场必定是标准盲注
                    int count = segment == 1 && layer == 1 ? 1 : 2 + rng.Index(2);
                    NodeStrength[] strengths = PickStrengths(rng, count);
                    for (int i = 0; i < count; i++)
                    {
                        int tag = segment > 1 ? 1 + rng.Index(Tags.Count) : 0;
                        nodes.Add(new MapNode(id++, segment, layer, strengths[i], tag));
                    }
                }
            }
            return new RunMap(nodes, segmentCount);
        }

        /// <summary>同层强度互不相同且必含「中」;两节点时在 {轻,中} 与 {中,重} 里摇,三节点时三档齐全。返回的次序已洗过。</summary>
        private static NodeStrength[] PickStrengths(IRandomSource rng, int count)
        {
            NodeStrength[] strengths;
            if (count == 3)
            {
                strengths = new[] { NodeStrength.Light, NodeStrength.Normal, NodeStrength.Heavy };
            }
            else if (count == 2)
            {
                strengths = rng.Chance(1, 2)
                    ? new[] { NodeStrength.Light, NodeStrength.Normal }
                    : new[] { NodeStrength.Normal, NodeStrength.Heavy };
                if (rng.Chance(1, 2))
                {
                    NodeStrength t = strengths[0];
                    strengths[0] = strengths[1];
                    strengths[1] = t;
                }
            }
            else
            {
                strengths = new[] { NodeStrength.Normal };
            }
            return strengths;
        }

        public IReadOnlyList<MapNode> NodesAt(int segment, int layer)
        {
            if (segment < 1 || segment > SegmentCount) throw new ArgumentOutOfRangeException(nameof(segment), segment, "段超出范围");
            if (layer < 1 || layer > LayersPerSegment) throw new ArgumentOutOfRangeException(nameof(layer), layer, "层超出范围");
            var list = new List<MapNode>(3);
            foreach (MapNode n in _nodes)
            {
                if (n.Segment == segment && n.Layer == layer) list.Add(n);
            }
            return list;
        }

        public MapNode Get(int nodeId)
        {
            if (nodeId < 1 || nodeId > _nodes.Count) throw new ArgumentOutOfRangeException(nameof(nodeId), nodeId, "节点号超出范围");
            return _nodes[nodeId - 1];
        }

        /// <summary>这一节点之后能进入的节点:同段下一层,或首领之后下一段第一层;最后一关的首领之后为空。</summary>
        public IReadOnlyList<MapNode> NextAfter(int nodeId)
        {
            MapNode node = Get(nodeId);
            if (node.Layer < LayersPerSegment) return NodesAt(node.Segment, node.Layer + 1);
            return node.Segment < SegmentCount ? NodesAt(node.Segment + 1, 1) : Array.Empty<MapNode>();
        }

        /// <summary>最后一关的首领。</summary>
        public MapNode FinalBoss => NodesAt(SegmentCount, LayersPerSegment)[0];

        /// <summary>读档的还原口:布局原样接上,随后由 <see cref="MapProgress"/> 校验进度是否落在图上。</summary>
        internal static RunMap Restore(List<MapNode> nodes, int segmentCount)
        {
            if (nodes == null) throw new ArgumentNullException(nameof(nodes));
            return new RunMap(nodes, segmentCount);
        }

        /// <summary>布局约束,返回第一条不成立的;成立返回 null。读档后由 <see cref="RunState.Validate"/> 调。</summary>
        public string Validate()
        {
            if (SegmentCount < 1) return "map.segmentCount: 至少 1 段";
            if (_nodes.Count == 0) return "map.nodes: 不能为空";
            for (int i = 0; i < _nodes.Count; i++)
            {
                MapNode n = _nodes[i];
                if (n.Id != i + 1) return $"map.nodes[{i}].id: 应为 {i + 1}";
                if (n.Segment < 1 || n.Segment > SegmentCount) return $"map.nodes[{i}].segment: 超出 1..{SegmentCount}";
                if (n.Layer < 1 || n.Layer > LayersPerSegment) return $"map.nodes[{i}].layer: 超出 1..{LayersPerSegment}";
                if (!Enum.IsDefined(typeof(NodeStrength), n.Strength)) return $"map.nodes[{i}].strength: 未定义的值 {(int)n.Strength}";
                if (n.TagId < 0) return $"map.nodes[{i}].tag: 标签号不能为负";
                if (n.TagId != 0 && !Tags.IsKnown(n.TagId)) return $"map.nodes[{i}].tag: 未登记的标签 {n.TagId}";
                bool bossLayer = n.Layer == LayersPerSegment;
                if (bossLayer != n.IsBoss) return $"map.nodes[{i}]: 首领只能出现在第 {LayersPerSegment} 层";
            }
            for (int segment = 1; segment <= SegmentCount; segment++)
            {
                for (int layer = 1; layer < LayersPerSegment; layer++)
                {
                    IReadOnlyList<MapNode> nodes = NodesAt(segment, layer);
                    int expectedMin = segment == 1 && layer == 1 ? 1 : 2;
                    if (nodes.Count < expectedMin || nodes.Count > 3)
                    {
                        return $"map: 段 {segment} 层 {layer} 应有 {expectedMin}..3 个节点,实有 {nodes.Count}";
                    }
                    var strengths = new HashSet<NodeStrength>();
                    foreach (MapNode n in nodes)
                    {
                        if (!strengths.Add(n.Strength)) return $"map: 段 {segment} 层 {layer} 的强度重复";
                    }
                    if (!strengths.Contains(NodeStrength.Normal)) return $"map: 段 {segment} 层 {layer} 缺「中」节点";
                }
                if (NodesAt(segment, LayersPerSegment).Count != 1)
                {
                    return $"map: 段 {segment} 应有且只有一个首领";
                }
            }
            return null;
        }
    }
}
