using System;

namespace GameRules
{
    /// <summary>
    /// 计分的整数算术:底分是整数,倍率是千分值(1000 = 1)。溢出饱和、不回绕;见效果系统 §9。
    /// </summary>
    public static class ScoreMath
    {
        public const long PermilleOne = 1000;

        /// <summary>整数倍率转千分值;正负溢出分别饱和。</summary>
        public static long ToPermille(long mult) => mult > long.MaxValue / PermilleOne ? long.MaxValue
            : mult < long.MinValue / PermilleOne ? long.MinValue : mult * PermilleOne;

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

        /// <summary>倍率当场乘一项:⌊max(multPermille,0) × termPermille / 1000⌋。乘项必须 ≥ 0。</summary>
        public static long MulPermille(long multPermille, long termPermille)
        {
            CheckNonNegative(termPermille, nameof(termPermille));
            return MulDivPermille(Math.Max(multPermille, 0), termPermille);
        }

        /// <summary>得分 = ⌊max(chips,0) × max(multPermille,0) / 1000⌋。</summary>
        public static long Gain(long chips, long multPermille) =>
            MulDivPermille(Math.Max(chips, 0), Math.Max(multPermille, 0));

        // 先拆两边的商与余数,避免除以 1000 之前的中间积溢出。
        private static long MulDivPermille(long x, long y)
        {
            long high = Mul(x / PermilleOne, y);
            long low = Add(Mul(x % PermilleOne, y / PermilleOne),
                x % PermilleOne * (y % PermilleOne) / PermilleOne);
            return Add(high, low);
        }

        private static void CheckNonNegative(long v, string name)
        {
            if (v < 0) throw new ArgumentOutOfRangeException(name, v, "须 ≥ 0");
        }
    }
}
