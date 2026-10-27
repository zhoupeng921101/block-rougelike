using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>
    /// 随机流的测试向量,原样抄自 .scratch/3b-首个盲注/research/08-随机流向量.md。
    /// 常量是另一个进程算出来的,这组断言本身就是一项跨进程比对;常量只在随机方案换版本(RngStreams.SchemeVersion)时重生成。
    /// </summary>
    public class RngVectorTests
    {
        private const string Seed = "TESTSEED";

        private const string FnvEmpty = "cbf29ce484222325";
        private const string FnvA = "af63dc4c8601ec8c";
        private const string FnvShuffle11 = "0a614c9ad1d15fe0";
        private const string OpenS0 = "3354cb684d657c6f";
        private const string OpenS1 = "08c1e12716cf4049";
        private static readonly int[] OpenNext100 = { 94, 88, 64, 62, 65, 21, 40, 21 };
        private static readonly int[] Shuffled20 = { 19, 13, 7, 0, 4, 2, 1, 15, 3, 17, 11, 18, 5, 12, 6, 9, 10, 8, 16, 14 };
        private const string ShuffledS0 = "b7c2c3054a65584e";
        private const string ShuffledS1 = "f370d8348855c47c";
        private static readonly int[] AfterShuffleNext1000 = { 262, 966, 377, 155, 382 };
        private static readonly int[] Shuffle12Next100 = { 19, 46, 93, 24, 36 };
        private static readonly int[] Shuffle21Next100 = { 76, 6, 1, 65, 93 };

        private static string Hex(ulong v) => v.ToString("x16", CultureInfo.InvariantCulture);

        private static int[] Draw(IRandomSource rng, int count, int max)
        {
            var r = new int[count];
            for (int i = 0; i < count; i++) r[i] = rng.Next(0, max);
            return r;
        }

        [Test]
        public void Fnv1a64_StandardVectors()
        {
            Assert.AreEqual(FnvEmpty, Hex(RngStreams.Fnv1a64("")));
            Assert.AreEqual(FnvA, Hex(RngStreams.Fnv1a64("a")));
        }

        [Test]
        public void ShuffleKey_DerivesFromSeedSlashKey()
        {
            Assert.AreEqual("shuffle@1.1", RngKeys.Shuffle(1, 1));
            Assert.AreEqual(FnvShuffle11, Hex(RngStreams.Fnv1a64("TESTSEED/shuffle@1.1")));
            Assert.AreEqual(FnvShuffle11, Hex(RngStreams.DeriveSeed(Seed, RngKeys.Shuffle(1, 1))));
        }

        [Test]
        public void OpenStream_StateAndFirstDraws()
        {
            var streams = new RngStreams(Seed);
            IRandomSource rng = streams.Get(RngKeys.Shuffle(1, 1));
            RngStreamState st = streams.Export().Single();
            Assert.AreEqual("shuffle@1.1", st.Key);
            Assert.AreEqual(OpenS0, Hex(st.S0));
            Assert.AreEqual(OpenS1, Hex(st.S1));
            CollectionAssert.AreEqual(OpenNext100, Draw(rng, 8, 100));
        }

        [Test]
        public void Shuffle_OrderStateAndRestoredContinuation()
        {
            var streams = new RngStreams(Seed);
            IRandomSource rng = streams.Get(RngKeys.Shuffle(1, 1));
            List<int> deck = Enumerable.Range(0, 20).ToList();
            rng.Shuffle(deck);
            CollectionAssert.AreEqual(Shuffled20, deck);

            List<RngStreamState> saved = streams.Export();
            Assert.AreEqual(ShuffledS0, Hex(saved[0].S0));
            Assert.AreEqual(ShuffledS1, Hex(saved[0].S1));

            IRandomSource rebuilt = RngStreams.Restore(Seed, saved).Get(RngKeys.Shuffle(1, 1));
            CollectionAssert.AreEqual(AfterShuffleNext1000, Draw(rng, 5, 1000));
            CollectionAssert.AreEqual(AfterShuffleNext1000, Draw(rebuilt, 5, 1000));
        }

        [Test]
        public void OtherLayersAndSegments_AreIndependentStreams()
        {
            var streams = new RngStreams(Seed);
            CollectionAssert.AreEqual(Shuffle12Next100, Draw(streams.Get(RngKeys.Shuffle(1, 2)), 5, 100));
            CollectionAssert.AreEqual(Shuffle21Next100, Draw(streams.Get(RngKeys.Shuffle(2, 1)), 5, 100));
        }

        [TestCase(0UL, "22222222")]
        [TestCase((1UL << 40) - 1, "ZZZZZZZZ")]
        [TestCase(123456789UL, "PAMRP522")]
        public void SeedFromEntropy(ulong entropy, string expected)
        {
            Assert.AreEqual(expected, SeedText.FromEntropy(entropy));
        }
    }
}
