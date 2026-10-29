using System;

namespace GameRules
{
    /// <summary>一个盲注的规格。开盲注时拷进盲注状态,之后不变。</summary>
    public sealed class BlindSpec
    {
        /// <summary>每组块数的上限(规则 §2.1:默认 3,最多可扩到 5)。</summary>
        public const int MaxGroupSize = 5;

        /// <summary>段,从 1 数。</summary>
        public int Segment { get; }

        /// <summary>段内的层,从 1 数。洗牌的随机流按 (段, 层) 分。</summary>
        public int Layer { get; }

        public long Target { get; }

        /// <summary>本盲注的弃置次数。</summary>
        public int Discards { get; }

        /// <summary>每组块数,也是待放置区的槽数。</summary>
        public int GroupSize { get; }

        /// <summary>这一场带的首领负面效果(设计稿 §7.2);0 = 普通盲注。只有第 3 层的首领场非 0。</summary>
        public int BossId { get; }

        public BlindSpec(int segment, int layer, long target, int discards, int groupSize, int bossId = Bosses.None)
        {
            if (segment < 1) throw new ArgumentOutOfRangeException(nameof(segment), segment, "段从 1 数");
            if (layer < 1) throw new ArgumentOutOfRangeException(nameof(layer), layer, "层从 1 数");
            if (target < 0) throw new ArgumentOutOfRangeException(nameof(target), target, "目标分不能为负");
            if (discards < 0) throw new ArgumentOutOfRangeException(nameof(discards), discards, "弃置次数不能为负");
            if (groupSize < 1 || groupSize > MaxGroupSize)
            {
                throw new ArgumentOutOfRangeException(nameof(groupSize), groupSize, "每组块数在 1 到 MaxGroupSize 之间");
            }
            if (bossId != Bosses.None)
            {
                if (!Bosses.IsKnown(bossId)) throw new ArgumentOutOfRangeException(nameof(bossId), bossId, "没定义的首领");
                if (layer != RunMap.LayersPerSegment)
                {
                    throw new ArgumentOutOfRangeException(nameof(bossId), bossId, "首领只出现在第 3 层");
                }
            }
            Segment = segment;
            Layer = layer;
            Target = target;
            Discards = discards;
            GroupSize = groupSize;
            BossId = bossId;
        }
    }
}
