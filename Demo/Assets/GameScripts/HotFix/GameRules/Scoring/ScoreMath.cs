using System;

namespace GameRules
{
    /// <summary>
    /// 计分的整数算术(07 号票 §6):底分、倍率是 long,独立倍率是千分值的 long(1000 = ×1)。溢出一律饱和、不回绕;没有浮点。
    /// </summary>
    public static class ScoreMath
    {
        public const long PermilleOne = 1000;

        /// <summary>
        /// 独立倍率与单个乘项的上限。⌊x·y/1000⌋ 拆成 (x/1000)·y + ⌊(x%1000)·y/1000⌋ 时,后一项的积不超过 999·y,y 不超过它就不会溢出。
        /// </summary>
        public const long XMultCap = long.MaxValue / PermilleOne;

        public static long Add(long a, long b)
        {
            long sum = unchecked(a + b);
            // 同号相加却变了号 = 溢出
            if (((a ^ sum) & (b ^ sum)) < 0) return a < 0 ? long.MinValue : long.MaxValue;
            return sum;
        }

        /// <summary>两个非负数相乘,溢出时饱和到 <see cref="long.MaxValue"/>。</summary>
        public static long Mul(long a, long b)
        {
            CheckNonNegative(a, nameof(a));
            CheckNonNegative(b, nameof(b));
            if (a == 0 || b == 0) return 0;
            return a > long.MaxValue / b ? long.MaxValue : a * b;
        }

        /// <summary>独立倍率乘一项:⌊c × 项 / 1000⌋,两者都按 <see cref="XMultCap"/> 截。项必须 ≥ 0。</summary>
        public static long MulPermille(long xMult, long termPermille)
        {
            CheckNonNegative(termPermille, nameof(termPermille));
            return Math.Min(MulDivPermille(Math.Min(xMult, XMultCap), Math.Min(termPermille, XMultCap)), XMultCap);
        }

        /// <summary>一次的得分 = ⌊max(A,0) × max(B,0) × C / 1000⌋:A、B 只在这里按 0 截,所以加算的先后不影响结果,得分不为负。</summary>
        public static long Gain(long chips, long mult, long xMultPermille)
        {
            long product = Mul(Math.Max(chips, 0), Math.Max(mult, 0));
            return MulDivPermille(product, Math.Min(Math.Max(xMultPermille, 0), XMultCap));
        }

        // ⌊x·y/1000⌋,x ≥ 0,0 ≤ y ≤ XMultCap
        private static long MulDivPermille(long x, long y)
        {
            long high = Mul(x / PermilleOne, y);
            long low = x % PermilleOne * y / PermilleOne;
            return Add(high, low);
        }

        private static void CheckNonNegative(long v, string name)
        {
            if (v < 0) throw new ArgumentOutOfRangeException(name, v, "须 ≥ 0");
        }
    }
}
