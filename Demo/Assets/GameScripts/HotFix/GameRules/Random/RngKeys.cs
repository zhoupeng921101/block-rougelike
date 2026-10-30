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

        /// <summary>跳过节点换标签时的随机(给哪张科技、哪件改造、哪几块)。不带段层:标签只由跳过的次序决定。</summary>
        public const string Tag = "tag";

        /// <summary>商店出货与刷新。按层分:同一段里换节点不出别的货,刷新次数也记在这条流上。</summary>
        public static string Shop(int segment, int layer) => At("shop", segment, layer);

        /// <summary>首领效果里的随机(预置块的形状与落点、死格位置、增殖补块)。按段层分:一场首领的随机只与本场有关。</summary>
        public static string Boss(int segment, int layer) => At("boss", segment, layer);

        /// <summary>盲注里效果的概率(琉璃碎裂等)。按段层分:一场里的碎裂只与这一场的操作有关。</summary>
        public static string Effect(int segment, int layer) => At("effect", segment, layer);

        /// <summary>基因代价在盲注开始时的随机(死格落在哪)。按段层分,与首领那条流分开:带不带这类基因不挪动首领的随机。</summary>
        public static string GeneCost(int segment, int layer) => At("gene_cost", segment, layer);

        /// <summary>
        /// 商店货与补给包候选的版本、强化,以及基因包里的传说(规则 §2.5)。按层分,且与 <see cref="Shop"/> 分开:
        /// 掷版本不挪动出货那条流,货架上出什么不因版本规则变动而变。
        /// </summary>
        public static string Edition(int segment, int layer) => At("edition", segment, layer);

        /// <summary>使用改造时的随机(镀金成没成、御铸给哪张科技)。不带段层:只由使用的先后决定。</summary>
        public const string Mod = "mod";

        /// <summary>基因在盲注开始时随机指定的形状、类型(古形、塑形、指令、弃金)。按段层与基因号分,一张基因一条流。</summary>
        public static string GenePick(int segment, int layer, int geneId) => At("gene_pick." + geneId, segment, layer);

        /// <summary>基因自己的随机(乱码掷 0–20、镀版给哪块与哪个版本、吞噬吞哪张)。按段层与基因号分。</summary>
        public static string GeneRoll(int segment, int layer, int geneId) => At("gene_roll." + geneId, segment, layer);

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
