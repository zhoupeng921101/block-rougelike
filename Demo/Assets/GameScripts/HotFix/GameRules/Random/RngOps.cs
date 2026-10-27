using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 规则核心取随机的全部助手,全程整数:不调 NextDouble,概率写成分数(「1/4」= <c>Chance(1, 4)</c>),没有取整口径要定。
    /// </summary>
    public static class RngOps
    {
        /// <summary>[0, n)。</summary>
        public static int Index(this IRandomSource rng, int n)
        {
            if (n < 1) throw new ArgumentOutOfRangeException(nameof(n), n, "n 至少为 1");
            return rng.Next(0, n);
        }

        /// <summary>num / den 的概率为真。</summary>
        public static bool Chance(this IRandomSource rng, int num, int den)
        {
            if (den < 1) throw new ArgumentOutOfRangeException(nameof(den), den, "den 至少为 1");
            if (num < 0 || num > den) throw new ArgumentOutOfRangeException(nameof(num), num, "num 须在 [0, den]");
            return rng.Next(0, den) < num;
        }

        /// <summary>按整数权重抽一个下标:先取 [0, 总权重),再逐项累加比较。权重 0 的项永远抽不到。</summary>
        public static int Weighted(this IRandomSource rng, IReadOnlyList<int> weights)
        {
            long total = 0;
            for (int i = 0; i < weights.Count; i++)
            {
                if (weights[i] < 0) throw new ArgumentOutOfRangeException(nameof(weights), weights[i], "权重不能为负");
                total += weights[i];
            }
            if (total < 1 || total > int.MaxValue) throw new ArgumentOutOfRangeException(nameof(weights), total, "总权重须在 [1, int.MaxValue]");
            int r = rng.Next(0, (int)total);
            for (int i = 0; i < weights.Count; i++)
            {
                r -= weights[i];
                if (r < 0) return i;
            }
            throw new InvalidOperationException("不可达:r 已按总权重取");
        }

        /// <summary>
        /// Fisher–Yates,从后往前,消费 n-1 次。洗方块库前调用方要先按实例 id 升序排,
        /// 否则洗出来的结果取决于各块回库的先后。
        /// </summary>
        public static void Shuffle<T>(this IRandomSource rng, IList<T> list)
        {
            for (int i = list.Count - 1; i > 0; i--)
            {
                int j = rng.Next(0, i + 1);
                T t = list[i];
                list[i] = list[j];
                list[j] = t;
            }
        }
    }
}
