using System.Text;

namespace GameRules
{
    /// <summary>
    /// 主种子 = 种子文本。派生只认文本(<see cref="RngStreams"/>),不另存数字形式:
    /// 玩家看到的、抄走的、再输回来的是同一个东西。
    /// </summary>
    public static class SeedText
    {
        /// <summary>32 个字符,去掉易认混的 0 1 I O。</summary>
        public const string Alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

        public const int Length = 8;

        /// <summary>
        /// 新开局的种子。熵在规则核心外取(规则核心不碰非确定来源);取低 40 位,每 5 位一个字符,低位在前。
        /// </summary>
        public static string FromEntropy(ulong entropy)
        {
            var sb = new StringBuilder(Length);
            for (int k = 0; k < Length; k++)
            {
                sb.Append(Alphabet[(int)(entropy & 31)]);
                entropy >>= 5;
            }
            return sb.ToString();
        }

        /// <summary>
        /// 玩家输入 → 规范种子文本。用 ToUpperInvariant:随区域变的 ToUpper 在土耳其语区会把 i 变成 İ。
        /// </summary>
        public static bool TryNormalize(string input, out string seed)
        {
            seed = null;
            if (input == null) return false;
            string s = input.Trim().ToUpperInvariant();
            if (!IsCanonical(s)) return false;
            seed = s;
            return true;
        }

        /// <summary>1~8 位,每个字符都在 <see cref="Alphabet"/> 里。</summary>
        public static bool IsCanonical(string seed)
        {
            if (seed == null || seed.Length < 1 || seed.Length > Length) return false;
            foreach (char c in seed)
            {
                if (Alphabet.IndexOf(c) < 0) return false;
            }
            return true;
        }
    }
}
