using System;
using System.Globalization;
using System.Threading;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>随机件公开 API 的约定:种子文本规范化、键语法、试算副本不推进原流、整数助手的边界。</summary>
    public class RandomApiTests
    {
        [TestCase("  ab2c ", "AB2C")]
        [TestCase("zzzzzzzz", "ZZZZZZZZ")]
        public void SeedText_NormalizesInput(string input, string expected)
        {
            Assert.IsTrue(SeedText.TryNormalize(input, out string seed));
            Assert.AreEqual(expected, seed);
        }

        [TestCase("")]
        [TestCase("ABCDEFGHJ")]
        [TestCase("AB0C")]
        [TestCase("i")]
        public void SeedText_RejectsInvalid(string input)
        {
            Assert.IsFalse(SeedText.TryNormalize(input, out _));
        }

        [Test]
        public void SeedText_NormalizeIgnoresCurrentCulture()
        {
            CultureInfo saved = Thread.CurrentThread.CurrentCulture;
            try
            {
                Thread.CurrentThread.CurrentCulture = new CultureInfo("tr-TR");
                Assert.IsTrue(SeedText.TryNormalize("abc", out string seed));
                Assert.AreEqual("ABC", seed);
                Assert.AreEqual("shuffle@10.12", RngKeys.Shuffle(10, 12));
            }
            finally
            {
                Thread.CurrentThread.CurrentCulture = saved;
            }
        }

        [TestCase("shuffle", true)]
        [TestCase("shuffle@1.1", true)]
        [TestCase("gene.a_1", true)]
        [TestCase("sim.policy", true)]
        [TestCase("Shuffle", false)]
        [TestCase("1shuffle", false)]
        [TestCase("shuffle@0.1", false)]
        [TestCase("shuffle@01.1", false)]
        [TestCase("shuffle@1", false)]
        [TestCase("shuffle@1.1.1", false)]
        [TestCase("shu/ffle", false)]
        public void RngKeys_Syntax(string key, bool valid)
        {
            Assert.AreEqual(valid, RngKeys.IsValid(key));
        }

        [Test]
        public void RngStreams_RejectsBadSeedAndKey()
        {
            Assert.Throws<ArgumentException>(() => new RngStreams("TEST0"));
            Assert.Throws<ArgumentException>(() => new RngStreams("TESTSEED").Get("Bad Key"));
        }

        [Test]
        public void Clone_DoesNotAdvanceOriginal()
        {
            var streams = new RngStreams("TESTSEED");
            streams.Get(RngKeys.Shuffle(1, 1)).Next(0, 100);
            RngStreams trial = streams.Clone();
            trial.Get(RngKeys.Shuffle(1, 1)).Next(0, 100);
            trial.Get(RngKeys.Shuffle(1, 2)).Next(0, 100);

            var expected = new RngStreams("TESTSEED");
            expected.Get(RngKeys.Shuffle(1, 1)).Next(0, 100);
            CollectionAssert.AreEqual(expected.Export(), streams.Export());
        }

        [Test]
        public void Weighted_ZeroWeightNeverDrawn()
        {
            IRandomSource rng = new RngStreams("TESTSEED").Get("test.weighted");
            int[] weights = { 0, 3, 0, 1 };
            for (int i = 0; i < 200; i++)
            {
                int k = rng.Weighted(weights);
                Assert.That(k == 1 || k == 3, "抽到了权重 0 的项:" + k);
            }
            Assert.Throws<ArgumentOutOfRangeException>(() => rng.Weighted(new[] { 0, 0 }));
            Assert.Throws<ArgumentOutOfRangeException>(() => rng.Weighted(new[] { 1, -1 }));
        }

        [Test]
        public void Chance_Bounds()
        {
            IRandomSource rng = new RngStreams("TESTSEED").Get("test.chance");
            for (int i = 0; i < 50; i++)
            {
                Assert.IsFalse(rng.Chance(0, 4));
                Assert.IsTrue(rng.Chance(4, 4));
            }
            Assert.Throws<ArgumentOutOfRangeException>(() => rng.Chance(5, 4));
            Assert.Throws<ArgumentOutOfRangeException>(() => rng.Index(0));
        }
    }
}
