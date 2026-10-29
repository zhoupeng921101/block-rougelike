using System;
using System.Globalization;

namespace GameRules
{
    /// <summary>
    /// 随机流的键:一个用途一条流。调用点只经这里取键,不自己拼字符串。
    /// 语法 = 用途名 <c>[a-z][a-z0-9_.]*</c>,消费次数随玩家操作变、而后面的结果不该跟着变的用途再带 <c>@段.层</c>(段、层从 1 数)。
    /// </summary>
    public static class RngKeys
    {
        /// <summary>盲注开始洗方块库。按层分、不按段分,也不带节点:跳过前一层不改后一层的洗牌,换节点刷不出别的洗牌。</summary>
        public static string Shuffle(int segment, int layer) => At("shuffle", segment, layer);

        /// <summary>开局生成地图布局。不带段层、整局只消费一次:地图在开新局那一刻就定死,之后的选路不重掷。</summary>
        public const string Map = "map";

        /// <summary>商店出货与刷新。按层分:同一段里换节点不出别的货,刷新次数也记在这条流上。</summary>
        public static string Shop(int segment, int layer) => At("shop", segment, layer);

        private static string At(string purpose, int segment, int layer)
        {
            if (segment < 1) throw new ArgumentOutOfRangeException(nameof(segment), segment, "段从 1 数");
            if (layer < 1) throw new ArgumentOutOfRangeException(nameof(layer), layer, "层从 1 数");
            return purpose + "@" + segment.ToString(CultureInfo.InvariantCulture) + "." + layer.ToString(CultureInfo.InvariantCulture);
        }

        public static bool IsValid(string key)
        {
            if (string.IsNullOrEmpty(key)) return false;
            int at = key.IndexOf('@');
            int purposeEnd = at < 0 ? key.Length : at;
            if (purposeEnd == 0 || key[0] < 'a' || key[0] > 'z') return false;
            for (int i = 1; i < purposeEnd; i++)
            {
                char c = key[i];
                if (!((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '_' || c == '.')) return false;
            }
            if (at < 0) return true;
            int dot = key.IndexOf('.', at + 1);
            return dot > 0 && IsOrdinal(key, at + 1, dot) && IsOrdinal(key, dot + 1, key.Length);
        }

        // [from, to) 是不带前导零的正整数
        private static bool IsOrdinal(string s, int from, int to)
        {
            if (to <= from || s[from] == '0') return false;
            for (int i = from; i < to; i++)
            {
                if (s[i] < '0' || s[i] > '9') return false;
            }
            return true;
        }
    }
}
