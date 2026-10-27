using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>导出的一条流:进存档,读档时经 <see cref="RngStreams.Restore"/> 原样接上。</summary>
    public readonly struct RngStreamState
    {
        public readonly string Key;
        public readonly ulong S0;
        public readonly ulong S1;

        public RngStreamState(string key, ulong s0, ulong s1)
        {
            Key = key;
            S0 = s0;
            S1 = s1;
        }
    }

    /// <summary>
    /// 一局的随机流登记表:一个键一条独立流,第一次 <see cref="Get"/> 时派生,子流种子 = FNV-1a 64(种子文本 + "/" + 键)。
    /// 规则核心要随机只能经这里取,且只取整数(<see cref="IRandomSource.Next"/> 与 <see cref="RngOps"/>)。
    /// 试算(拖动预览)在 <see cref="Clone"/> 出的副本上跑,否则来回拖会推进随机流。
    /// 改发生器、派生方式或键语法 = 换方案,<see cref="SchemeVersion"/> 加一;
    /// 测试向量见 .scratch/3b-首个盲注/research/08-随机流向量.md,DotNet/Tests 里原样写成常量。
    /// </summary>
    public sealed class RngStreams
    {
        /// <summary>v1 = xorshift128+ / FNV-1a 64 / <see cref="RngKeys"/> 的键语法。</summary>
        public const int SchemeVersion = 1;

        // 按键的 ordinal 序存:导出次序即存档次序,不依赖哈希容器的遍历序
        private readonly SortedDictionary<string, XorShift128PlusRng> _streams =
            new SortedDictionary<string, XorShift128PlusRng>(StringComparer.Ordinal);

        public string Seed { get; }

        public RngStreams(string seed)
        {
            if (!SeedText.IsCanonical(seed)) throw new ArgumentException("不是规范种子文本:" + seed, nameof(seed));
            Seed = seed;
        }

        public IRandomSource Get(string key)
        {
            if (_streams.TryGetValue(key, out XorShift128PlusRng rng)) return rng;
            if (!RngKeys.IsValid(key)) throw new ArgumentException("不合键语法:" + key, nameof(key));
            rng = new XorShift128PlusRng(unchecked((long)DeriveSeed(Seed, key)));
            _streams.Add(key, rng);
            return rng;
        }

        /// <summary>已开的各流,按键的 ordinal 序。</summary>
        public List<RngStreamState> Export()
        {
            var list = new List<RngStreamState>(_streams.Count);
            foreach (KeyValuePair<string, XorShift128PlusRng> kv in _streams)
            {
                (ulong s0, ulong s1) = kv.Value.ExportState();
                list.Add(new RngStreamState(kv.Key, s0, s1));
            }
            return list;
        }

        /// <summary>存档里没有的键,第一次用到时照常派生:存档早于或晚于开流都接得上。</summary>
        public static RngStreams Restore(string seed, IEnumerable<RngStreamState> states)
        {
            var streams = new RngStreams(seed);
            foreach (RngStreamState st in states)
            {
                if (!RngKeys.IsValid(st.Key)) throw new ArgumentException("不合键语法:" + st.Key, nameof(states));
                streams._streams.Add(st.Key, new XorShift128PlusRng(st.S0, st.S1));
            }
            return streams;
        }

        public RngStreams Clone() => Restore(Seed, Export());

        public static ulong DeriveSeed(string seed, string key) => Fnv1a64(seed + "/" + key);

        /// <summary>按 char 逐个异或;只收 ASCII。不用 string.GetHashCode:CoreCLR 每个进程算出的值都不同。</summary>
        public static ulong Fnv1a64(string ascii)
        {
            ulong h = 14695981039346656037UL;
            foreach (char c in ascii)
            {
                if (c > 0x7F) throw new ArgumentException("只收 ASCII:" + ascii, nameof(ascii));
                h ^= c;
                h = unchecked(h * 1099511628211UL);
            }
            return h;
        }
    }
}
