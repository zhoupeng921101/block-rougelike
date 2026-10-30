using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>
    /// 局内存档快照(09 号票):往返逐字节相同、规范形、样档、坏档的错误码、稳定态校验、读档后接着打与不中断的一局逐步相同。
    /// </summary>
    public class RunSnapshotTests
    {
        private static readonly string[] Seeds = { "TESTSEED", "23456789", "ZZZZZZZZ" };

        /// <summary>设成 1 再跑一次单测,就按当前写出端重生成样档(形状一改,样档跟着重生成)。</summary>
        private const string RegenSamplesVariable = "GAMERULES_REGEN_SAMPLES";

        private sealed class NoEffect : RuleEffect
        {
        }

        // ---- 往返 ----

        [TestCaseSource(nameof(Seeds))]
        public void RoundTrip_AtStartAfterEveryStepAndAtTheEnd(string seed)
        {
            RunState run = Started(seed);
            AssertRoundTrip(run, PlaceholderTuning.Config);
            for (int i = 0; run.Blind.Outcome == BlindOutcome.InProgress; i++)
            {
                Play(run, i);
                AssertRoundTrip(run, PlaceholderTuning.Config);
            }
            Assert.AreNotEqual(BlindOutcome.InProgress, run.Blind.Outcome);
        }

        [Test]
        public void RoundTrip_CoversEnhancementsEditionsGenesAndDeadCells()
        {
            var effects = new EffectRegistry().Register(EffectSource.Gene, 7, new NoEffect()).Register(EffectSource.Gene, 9, new NoEffect());
            var library = new List<LibraryEntry>();
            foreach (LibraryEntry e in PlaceholderTuning.DefaultLibrary)
            {
                int k = library.Count;
                library.Add(new LibraryEntry(e.Kind, e.Points, (Enhancement)(k % 5), (Edition)(k / 5 % 4)));
            }
            RuleConfig config = TestRules.Config(effects, library.ToArray());
            RunState run = RunState.NewRun("ABCDEFGH", config);
            run.AddGene(9);
            run.AddGene(7);
            run.StartBlind(PlaceholderTuning.FirstBlind);
            run.Blind.Board.SetDead(63);
            run.Blind.Board.SetDead(56);
            AssertRoundTrip(run, config);
            for (int i = 0; i < 6; i++)
            {
                Play(run, i);
                AssertRoundTrip(run, config);
            }

            string text = RunSnapshot.Write(run);
            StringAssert.Contains("\"dead\": [56, 63]", text);
            StringAssert.Contains("\"genes\": [\n    { \"id\": 9, \"edition\": \"None\", \"counter\": 0, \"costPending\": false, \"state\": 0, \"sellBonus\": 0 },\n"
                + "    { \"id\": 7, \"edition\": \"None\", \"counter\": 0, \"costPending\": false, \"state\": 0, \"sellBonus\": 0 }\n  ]", text);
            StringAssert.Contains("\"enhancement\": \"Wild\", \"edition\": \"Polychrome\"", text);
        }

        [Test]
        public void RoundTrip_TempBlocksWrittenByHand()
        {
            RunState run = Started("TESTSEED");
            string text = RunSnapshot.Write(run);
            string edited = Mutate(Mutate(Mutate(text,
                "\"nextInstanceId\": 29,", "\"nextInstanceId\": 31,"),
                "\"discarded\": [],", "\"discarded\": [30, 29],"),
                "\"tempBlocks\": []",
                "\"tempBlocks\": [\n      { \"id\": 29, \"kind\": \"T\", \"points\": 7, \"enhancement\": \"Steel\", \"edition\": \"None\" },\n" +
                "      { \"id\": 30, \"kind\": \"L\", \"points\": 0, \"enhancement\": \"None\", \"edition\": \"Holo\" }\n    ]");

            SnapshotReadResult r = AssertReads(edited, PlaceholderTuning.Config);
            Assert.AreEqual(2, r.State.Blind.TempBlocks.Count);
            Assert.AreEqual(Enhancement.Steel, r.State.FindInstance(29).Enhancement);
            Assert.AreEqual(Edition.Holo, r.State.FindInstance(30).Edition);
            Assert.AreEqual(edited, RunSnapshot.Write(r.State), "手写的这份就是规范形");
        }

        [Test]
        public void RoundTrip_WithOpenShop_KeepsGoodsSalesAndRerolls()
        {
            RuleConfig config = new RuleConfig(
                new[] { new LibraryEntry(TetrominoKind.I, 1), new LibraryEntry(TetrominoKind.I, 1) },
                MinimalContent.ClearTypes, MinimalContent.Effects, catalog: MinimalContent.Catalog);
            RunState run = RunState.NewRun("TESTSEED", config);
            Assert.IsTrue(run.EnterNode(run.Map.Start.Id));
            run.StartBlind(new BlindSpec(1, 1, 272, 3, 3));
            TestRules.Place(run, run.Blind.Tray[0].Id, 0, 7, 0);
            TestRules.Place(run, TetrominoKind.I, 0, 7, 4);
            run.SettleBlind();
            ShopState shop = run.OpenShop();
            run.AddMoney(30);
            Assert.IsTrue(shop.TryReroll(run.Rng.Get(RngKeys.Shop(1, 1)), run));

            int bought = -1;
            for (int i = 0; i < shop.Goods.Count; i++)
            {
                if (shop.Goods[i].Sold || shop.Goods[i].Price > run.Money) continue;
                if (shop.TryBuy(i, run) != ShopBuyResult.Ok) continue;
                bought = i;
                break;
            }
            Assert.GreaterOrEqual(bought, 0, "至少买得起一件");

            string text = RunSnapshot.Write(run);
            SnapshotReadResult read = RunSnapshot.Read(text, config);
            Assert.IsTrue(read.Ok, Describe(read));
            ShopState restored = read.State.Shop;
            Assert.IsNotNull(restored, "商店开着就进档");
            Assert.AreEqual(shop.Rerolls, restored.Rerolls);
            for (int i = 0; i < shop.Goods.Count; i++)
            {
                Assert.AreEqual(shop.Goods[i].Kind, restored.Goods[i].Kind);
                Assert.AreEqual(shop.Goods[i].Id, restored.Goods[i].Id);
                Assert.AreEqual(shop.Goods[i].Price, restored.Goods[i].Price);
                Assert.AreEqual(shop.Goods[i].Sold, restored.Goods[i].Sold, $"第 {i} 格的卖出标记");
            }
            Assert.AreEqual(run.Money, read.State.Money);
            Assert.AreEqual(run.Genes.Count, read.State.Genes.Count);
            Assert.AreEqual(text, RunSnapshot.Write(read.State));
        }

        [Test]
        public void Write_WithoutABlind_RoundTripsBetweenBlinds()
        {
            RunState run = RunState.NewRun("TESTSEED", PlaceholderTuning.Config);
            string text = RunSnapshot.Write(run);
            SnapshotReadResult read = RunSnapshot.Read(text, PlaceholderTuning.Config);
            Assert.IsTrue(read.Ok, Describe(read));
            Assert.IsNull(read.State.Blind, "两个盲注之间没有盲注");
            Assert.AreEqual(PlaceholderTuning.Config.StartingMoney, read.State.Money);
            Assert.AreEqual(RunDifficulty.Standard, read.State.Difficulty);
            Assert.AreEqual(0, read.State.Progress.CurrentNodeId);
            Assert.AreEqual(text, RunSnapshot.Write(read.State));
        }

        // ---- 规范形 ----

        [Test]
        public void CanonicalForm_SameBytesUnderTurkishCulture_AsciiLfNoBom()
        {
            RunState run = SampleState();
            string text = RunSnapshot.Write(run);

            CultureInfo culture = CultureInfo.CurrentCulture, uiCulture = CultureInfo.CurrentUICulture;
            string turkish;
            SnapshotReadResult readInTurkish;
            try
            {
                CultureInfo.CurrentCulture = CultureInfo.CurrentUICulture = new CultureInfo("tr-TR");
                turkish = RunSnapshot.Write(run);
                readInTurkish = RunSnapshot.Read(text, PlaceholderTuning.Config);
            }
            finally
            {
                CultureInfo.CurrentCulture = culture;
                CultureInfo.CurrentUICulture = uiCulture;
            }
            Assert.AreEqual(text, turkish);
            Assert.IsTrue(readInTurkish.Ok, Describe(readInTurkish));
            Assert.AreEqual(text, RunSnapshot.Write(readInTurkish.State));

            Assert.IsFalse(text.Contains('\r'), "只有 LF");
            Assert.AreNotEqual('﻿', text[0], "不写 BOM");
            Assert.IsTrue(text.All(c => c <= 0x7F), "只有 ASCII");
            Assert.AreEqual(text.Length, Encoding.UTF8.GetByteCount(text));
            Assert.IsTrue(text.EndsWith("}\n", StringComparison.Ordinal) && !text.EndsWith("\n\n", StringComparison.Ordinal), "文末一个换行");
            Assert.IsFalse(text.Contains('\t'), "缩进只用空格");
        }

        [Test]
        public void CanonicalForm_LayoutAsDocumented()
        {
            string text = RunSnapshot.Write(SampleState());
            string[] lines = text.Split('\n');
            Assert.AreEqual("{", lines[0]);
            Assert.AreEqual("  \"format\": \"3b.run\",", lines[1]);
            Assert.AreEqual("  \"schema\": 1,", lines[2]);
            StringAssert.Contains("\n  \"library\": [\n    { \"id\": 1, \"kind\": \"I\", \"points\": 1, \"enhancement\": \"None\", \"edition\": \"None\" },\n", text);
            StringAssert.Contains("\n    \"spec\": { \"segment\": 1, \"layer\": 1, \"target\": \"350\", \"discards\": 3, \"groupSize\": 3, \"boss\": 0 },\n", text);
            Assert.AreEqual(8, lines.Count(l => l.StartsWith("      [", StringComparison.Ordinal)), "owner 一行盘面一行");
            foreach (string line in lines)
            {
                int indent = line.Length - line.TrimStart(' ').Length;
                Assert.AreEqual(0, indent % 2, "两格缩进:" + line);
                Assert.IsFalse(line.EndsWith(" ", StringComparison.Ordinal), "行尾没有空格:" + line);
            }
        }

        // ---- 样档 ----

        [Test]
        public void SampleFile_IsWhatTheWriterWrites_AndReadsBack()
        {
            string text = RunSnapshot.Write(SampleState());
            string path = SamplePath();
            if (Environment.GetEnvironmentVariable(RegenSamplesVariable) == "1")
            {
                File.WriteAllText(path, text, new UTF8Encoding(false));
                Assert.Pass("已重生成样档:" + path);
            }
            Assert.IsTrue(File.Exists(path), "缺样档 " + path + ";设 " + RegenSamplesVariable + "=1 跑一次单测生成");

            // core.autocrlf=true 的检出会把样档换成 CRLF;读入端照收,比对规范形时换回 LF
            string raw = File.ReadAllText(path, new UTF8Encoding(false));
            Assert.IsTrue(AssertReads(raw, PlaceholderTuning.Config).Ok);
            string sample = raw.Replace("\r\n", "\n");
            Assert.AreEqual(text, sample, "写出端的形状变了:确认是有意改的,就设 " + RegenSamplesVariable + "=1 重生成样档");
            Assert.AreEqual(sample, RunSnapshot.Write(AssertReads(sample, PlaceholderTuning.Config).State));
        }

        // ---- 坏档:每种都返回对应的错误码,不抛异常 ----

        private static IEnumerable BadDocuments()
        {
            // (说明, 原文片段, 改成, 错误码, 出错路径);底稿 = TESTSEED 开盲注发完第一组
            yield return Bad("未来的 schema", "\"schema\": 1,", "\"schema\": 2,", SnapshotError.UnsupportedSchema, "schema");
            yield return Bad("schema 0", "\"schema\": 1,", "\"schema\": 0,", SnapshotError.UnsupportedSchema, "schema");
            yield return Bad("schema 不是整数", "\"schema\": 1,", "\"schema\": \"1\",", SnapshotError.Shape, "schema");
            yield return Bad("format 不对", "\"format\": \"3b.run\",", "\"format\": \"3b.save\",", SnapshotError.BadFormat, "format");
            yield return Bad("随机流方案不认", "\"scheme\": 1,", "\"scheme\": 2,", SnapshotError.UnsupportedRngScheme, "rng.scheme");
            yield return Bad("多一个成员", "\"seed\": \"TESTSEED\",", "\"seed\": \"TESTSEED\",\n  \"extra\": 1,", SnapshotError.Shape, "extra");
            yield return Bad("少一个成员", "    \"combo\": 0,\n", "", SnapshotError.Shape, "blind.combo");
            yield return Bad("次序调换", "\"step\": 0,\n    \"group\": 1,", "\"group\": 1,\n    \"step\": 0,", SnapshotError.Shape, "blind.step");
            yield return Bad("重复的成员", "\"combo\": 0,", "\"combo\": 0,\n    \"combo\": 0,", SnapshotError.Shape, "blind.combo");
            yield return Bad("整数写成字符串", "\"combo\": 0,", "\"combo\": \"0\",", SnapshotError.Shape, "blind.combo");
            yield return Bad("64 位写成数", "\"score\": \"0\",", "\"score\": 0,", SnapshotError.Shape, "blind.score");
            yield return Bad("数字带小数", "\"combo\": 0,", "\"combo\": 0.5,", SnapshotError.NotInteger, "blind.combo");
            yield return Bad("数字带指数", "\"combo\": 0,", "\"combo\": 1e2,", SnapshotError.NotInteger, "blind.combo");
            yield return Bad("超出 64 位", "\"combo\": 0,", "\"combo\": 99999999999999999999,", SnapshotError.OutOfRange, "blind.combo");
            yield return Bad("超出 32 位", "\"combo\": 0,", "\"combo\": 4294967296,", SnapshotError.OutOfRange, "blind.combo");
            yield return Bad("前导零", "\"combo\": 0,", "\"combo\": 01,", SnapshotError.Syntax, "blind.combo");
            yield return Bad("种子不规范", "\"seed\": \"TESTSEED\",", "\"seed\": \"testseed\",", SnapshotError.BadValue, "seed");
            yield return Bad("键不合语法", "\"key\": \"map\"", "\"key\": \"Map\"", SnapshotError.BadValue, "rng.streams[0].key");
            yield return Bad("枚举名大小写不对", "{ \"id\": 1, \"kind\": \"I\"", "{ \"id\": 1, \"kind\": \"i\"", SnapshotError.BadValue, "library[0].kind");
            yield return Bad("枚举写成数字", "{ \"id\": 1, \"kind\": \"I\"", "{ \"id\": 1, \"kind\": \"0\"", SnapshotError.BadValue, "library[0].kind");
            yield return Bad("枚举不认", "\"outcome\": \"InProgress\",", "\"outcome\": \"Pending\",", SnapshotError.BadValue, "blind.outcome");
            yield return Bad("十进制串不规范", "\"target\": \"350\"", "\"target\": \"+350\"", SnapshotError.BadValue, "blind.spec.target");
            yield return Bad("十进制串前导零", "\"target\": \"350\"", "\"target\": \"0350\"", SnapshotError.BadValue, "blind.spec.target");
            yield return Bad("规格越界", "\"groupSize\": 3,", "\"groupSize\": 6,", SnapshotError.BadValue, "blind.spec.groupSize");
            yield return Bad("实例 id 为 0", "{ \"id\": 1, \"kind\"", "{ \"id\": 0, \"kind\"", SnapshotError.BadValue, "library[0].id");
            yield return Bad("id 重复", "{ \"id\": 2, \"kind\"", "{ \"id\": 1, \"kind\"", SnapshotError.Invalid, "library[1].id");
            yield return Bad("计数器不大于最大 id", "\"nextInstanceId\": 29,", "\"nextInstanceId\": 28,", SnapshotError.Invalid, "library[27].id");
            yield return Bad("类型等级为 0", "\"SingleLine\": 1", "\"SingleLine\": 0", SnapshotError.Invalid, "typeLevels.SingleLine");
            yield return Bad("类型等级超出类型表", "\"AllClear\": 1,", "\"AllClear\": 2,", SnapshotError.Invalid, "typeLevels.AllClear");
            yield return Bad("基因没登记", "\"genes\": [],", "\"genes\": [\n    { \"id\": 5, \"edition\": \"None\", \"counter\": 0, \"costPending\": false, \"state\": 0, \"sellBonus\": 0 }\n  ],", SnapshotError.Invalid, "genes[0].id");
            yield return Bad("步数为负", "\"step\": 0,", "\"step\": -1,", SnapshotError.Invalid, "blind.step");
            yield return Bad("弃置次数超出规格", "\"discardsLeft\": 3,", "\"discardsLeft\": 4,", SnapshotError.Invalid, "blind.discardsLeft");
            yield return Bad("输了却没有原因", "\"outcome\": \"InProgress\",", "\"outcome\": \"Lost\",", SnapshotError.Invalid, "blind.failReason");
            yield return Bad("盘面少一行", "      [0, 0, 0, 0, 0, 0, 0, 0],\n", "", SnapshotError.Shape, "blind.owner");
            yield return Bad("盘面一行少一格", "      [0, 0, 0, 0, 0, 0, 0, 0],", "      [0, 0, 0, 0, 0, 0, 0],", SnapshotError.Shape, "blind.owner[0]");
            yield return Bad("盘上是外来的 id", "      [0, 0, 0, 0, 0, 0, 0, 0],", "      [999, 0, 0, 0, 0, 0, 0, 0],", SnapshotError.Invalid, "blind.owner[0][0]");
            yield return Bad("盘上的 id 为负", "      [0, 0, 0, 0, 0, 0, 0, 0],", "      [-3, 0, 0, 0, 0, 0, 0, 0],", SnapshotError.Invalid, "blind.owner");
            yield return Bad("死格号越界", "\"dead\": [],", "\"dead\": [64],", SnapshotError.BadValue, "blind.dead[0]");
            yield return Bad("死格号没排序", "\"dead\": [],", "\"dead\": [9, 3],", SnapshotError.BadValue, "blind.dead[1]");
            yield return Bad("根值之后还有内容", "\n}\n", "\n}\n{}", SnapshotError.Syntax, "");
            yield return Bad("坏的转义", "\"seed\": \"TESTSEED\",", "\"seed\": \"TEST\\qSEED\",", SnapshotError.Syntax, "seed");
            yield return Bad("尾逗号", "\"edition\": \"None\" }\n  ],", "\"edition\": \"None\" },\n  ],", SnapshotError.Syntax, "library[28]");
        }

        private static TestCaseData Bad(string name, string from, string to, SnapshotError error, string path) =>
            new TestCaseData(from, to, error, path).SetName("BadDocument_" + name);

        [TestCaseSource(nameof(BadDocuments))]
        public void BadDocument(string from, string to, SnapshotError error, string path)
        {
            string text = Mutate(StartText(), from, to);
            AssertFails(text, error, path);
        }

        [Test]
        public void BadDocument_Truncated()
        {
            string text = StartText();
            // 切点落在值里(而不是某个成员名里),这样解析器报错时带得出路径
            int[] cuts =
            {
                1, 10,
                text.IndexOf("\"nodes\"", StringComparison.Ordinal) + 40,
                text.IndexOf("\"library\"", StringComparison.Ordinal) + 40,
                text.Length - 3, text.Length - 2,
            };
            foreach (int cut in cuts)
            {
                SnapshotReadResult r = RunSnapshot.Read(text.Substring(0, cut), PlaceholderTuning.Config);
                Assert.AreEqual(SnapshotError.Syntax, r.Error, Inv($"截在 {cut}:{Describe(r)}"));
                Assert.IsNull(r.State);
                // 截在末尾几个字符时停在根这一层(blind 已收完),路径就是空串
                if (cut > 10 && cut < text.Length - 10) Assert.IsNotEmpty(r.Path, Inv($"截在 {cut},路径落在某个成员上"));
            }
        }

        [Test]
        public void BadDocument_StreamStateAllZero()
        {
            RunState run = Started("TESTSEED");
            RngStreamState s = run.Rng.Export()[0];
            string text = Mutate(RunSnapshot.Write(run),
                Inv($"\"s0\": \"{s.S0:x16}\", \"s1\": \"{s.S1:x16}\""),
                "\"s0\": \"0000000000000000\", \"s1\": \"0000000000000000\"");
            AssertFails(text, SnapshotError.BadValue, "rng.streams[0]");
        }

        [Test]
        public void BadDocument_StreamHexNotLowercase()
        {
            RunState run = Started("TESTSEED");
            RngStreamState s = run.Rng.Export()[0];
            string text = Mutate(RunSnapshot.Write(run), Inv($"\"s0\": \"{s.S0:x16}\""), Inv($"\"s0\": \"{s.S0:X16}\""));
            if (s.S0.ToString("x16", CultureInfo.InvariantCulture) == s.S0.ToString("X16", CultureInfo.InvariantCulture)) Assert.Inconclusive("s0 里没有字母");
            AssertFails(text, SnapshotError.BadValue, "rng.streams[0].s0");
        }

        [Test]
        public void BadDocument_ConservationBroken()
        {
            RunState run = Started("TESTSEED");
            int first = run.Blind.Draw[0], second = run.Blind.Draw[1];
            // 抽牌堆的第一块换成第二块:second 出现两次,first 不在任何区
            string text = Mutate(RunSnapshot.Write(run), Inv($"\"draw\": [{first}, {second},"), Inv($"\"draw\": [{second}, {second},"));
            AssertFails(text, SnapshotError.Invalid, "blind.draw[1]");
        }

        [Test]
        public void BadDocument_RotFour()
        {
            RunState run = Started("TESTSEED");
            TraySlot slot = run.Blind.Tray[0];
            string text = Mutate(RunSnapshot.Write(run), Inv($"{{ \"id\": {slot.Id}, \"rot\": 0 }}"), Inv($"{{ \"id\": {slot.Id}, \"rot\": 4 }}"));
            AssertFails(text, SnapshotError.Invalid, "blind.tray[0].rot");
        }

        [Test]
        public void BadDocument_TraySlotIdZero_AndWrongTrayLength()
        {
            RunState run = Started("TESTSEED");
            TraySlot slot = run.Blind.Tray[2];
            string text = RunSnapshot.Write(run);
            AssertFails(Mutate(text, Inv($"{{ \"id\": {slot.Id}, \"rot\": 0 }}"), "{ \"id\": 0, \"rot\": 0 }"), SnapshotError.BadValue, "blind.tray[2].id");
            AssertFails(Mutate(text, Inv($", {{ \"id\": {slot.Id}, \"rot\": 0 }}]"), "]"), SnapshotError.Invalid, "blind.tray");
        }

        [Test]
        public void BadDocument_EmptyAndNullAndBlank()
        {
            AssertFails("", SnapshotError.Syntax, "");
            AssertFails(null, SnapshotError.Syntax, "");
            AssertFails(" \n ", SnapshotError.Syntax, "");
            AssertFails("﻿", SnapshotError.Syntax, "");
        }

        [Test]
        public void BadDocument_NotAnObjectOrNotOurs()
        {
            AssertFails("[]", SnapshotError.Shape, "");
            AssertFails("{}", SnapshotError.BadFormat, "format");
            AssertFails("{ \"schema\": 1, \"format\": \"3b.run\" }", SnapshotError.BadFormat, "format");
            AssertFails("{ \"format\": \"3b.run\" }", SnapshotError.Shape, "schema");
        }

        [Test]
        public void BadDocument_OverOneMiB()
        {
            string text = StartText();
            Assert.IsTrue(RunSnapshot.Read(text + new string(' ', (1 << 20) - text.Length), PlaceholderTuning.Config).Ok, "正好 1 MiB 还收");
            AssertFails(text + new string(' ', (1 << 20) - text.Length + 1), SnapshotError.TooLarge, "");
        }

        [Test]
        public void BadDocument_Nested100Levels()
        {
            AssertFails(new string('[', 100) + new string(']', 100), SnapshotError.TooDeep, string.Concat(Enumerable.Repeat("[0]", 16)));
            AssertFails(Mutate(StartText(), "\"genes\": [],", "\"genes\": " + new string('[', 100) + new string(']', 100) + ","),
                SnapshotError.TooDeep, "genes" + string.Concat(Enumerable.Repeat("[0]", 15)));
            // 16 层以内照常解析,再由形状检查拦下
            AssertFails(Mutate(StartText(), "\"genes\": [],", "\"genes\": " + new string('[', 15) + new string(']', 15) + ","),
                SnapshotError.Shape, "genes[0]");
        }

        [Test]
        public void Read_SkipsBomAndToleratesOtherWhitespace()
        {
            string text = StartText();
            SnapshotReadResult withBom = AssertReads("﻿" + text, PlaceholderTuning.Config);
            Assert.AreEqual(text, RunSnapshot.Write(withBom.State));
            SnapshotReadResult crlf = AssertReads(text.Replace("\n", "\r\n").Replace("  ", "\t"), PlaceholderTuning.Config);
            Assert.AreEqual(text, RunSnapshot.Write(crlf.State), "空白不同的档读回来,再写就是规范形");
        }

        [Test]
        public void Read_NeverThrows_OnEveryOneCharacterDamageAndEveryTruncation()
        {
            string text = RunSnapshot.Write(SampleState());
            const string damage = "\"0]}x-\\.";
            for (int i = 0; i < text.Length; i++)
            {
                string damaged = text.Substring(0, i) + damage[i % damage.Length] + text.Substring(i + 1);
                AssertWellFormedResult(RunSnapshot.Read(damaged, PlaceholderTuning.Config), Inv($"第 {i} 个字符换成 {damage[i % damage.Length]}"));
                AssertWellFormedResult(RunSnapshot.Read(text.Substring(0, i), PlaceholderTuning.Config), Inv($"截在 {i}"));
            }
        }

        // ---- 稳定态 ----

        [Test]
        public void StableState_InProgressWithEmptyTrayButCardsToDraw_IsRejected()
        {
            RunState run = Started("TESTSEED");
            string text = RunSnapshot.Write(run);
            IReadOnlyList<TraySlot> tray = run.Blind.Tray;
            string draw = string.Join(", ", run.Blind.Draw);
            string dealtBack = string.Join(", ", tray.Select(s => s.Id.ToString(CultureInfo.InvariantCulture)).Concat(run.Blind.Draw.Select(id => id.ToString(CultureInfo.InvariantCulture))));
            string trayText = "[" + string.Join(", ", tray.Select(s => Inv($"{{ \"id\": {s.Id}, \"rot\": 0 }}"))) + "]";
            string edited = Mutate(Mutate(text, "\"tray\": " + trayText, "\"tray\": [null, null, null]"), "\"draw\": [" + draw + "]", "\"draw\": [" + dealtBack + "]");

            SnapshotReadResult r = RunSnapshot.Read(edited, PlaceholderTuning.Config);
            Assert.AreEqual(SnapshotError.Invalid, r.Error, Describe(r));
            Assert.AreEqual("blind", r.Path);
            StringAssert.Contains("本该已发组", r.Detail);
        }

        [Test]
        public void StableState_EndedBlindReadsBack()
        {
            RunState run = Started("TESTSEED");
            for (int i = 0; run.Blind.Outcome == BlindOutcome.InProgress; i++) Play(run, i);
            string text = RunSnapshot.Write(run);
            string other = run.Blind.FailReason == FailReason.None ? "CannotPlace" : "None";
            AssertFails(Mutate(text, Inv($"\"failReason\": \"{run.Blind.FailReason}\""), "\"failReason\": \"" + other + "\""),
                SnapshotError.Invalid, "blind.failReason");
            Assert.AreEqual(run.Blind.Outcome, AssertReads(text, PlaceholderTuning.Config).State.Blind.Outcome, "终局快照能读,当不当无档归文件层(23 号票)");
        }

        [Test]
        public void Validate_RejectsAnUnregisteredGene()
        {
            RunState run = Started("TESTSEED");
            run.AddGene(5);
            StringAssert.StartsWith("genes[0].id: ", run.Validate());
        }

        // ---- 读档后接着打 ----

        [TestCaseSource(nameof(Seeds))]
        public void ReadBackAfterAnyStep_PlaysOnExactlyLikeTheUninterruptedRun(string seed)
        {
            RunState straight = Started(seed);
            var expected = new List<string>();
            for (int i = 0; straight.Blind.Outcome == BlindOutcome.InProgress; i++) expected.Add(DescribeStep(Play(straight, i)));
            string finalText = RunSnapshot.Write(straight);

            for (int cut = 0; cut < expected.Count; cut++)
            {
                RunState run = Started(seed);
                for (int i = 0; i < cut; i++) Play(run, i);
                RunState resumed = AssertReads(RunSnapshot.Write(run), PlaceholderTuning.Config).State;
                int step = cut;
                for (; resumed.Blind.Outcome == BlindOutcome.InProgress; step++)
                {
                    Assert.Less(step, expected.Count, Inv($"第 {cut} 步后存读,局面比不中断的那一局长"));
                    Assert.AreEqual(expected[step], DescribeStep(Play(resumed, step)), Inv($"第 {cut} 步后存读,第 {step + 1} 步分叉"));
                }
                Assert.AreEqual(expected.Count, step, Inv($"第 {cut} 步后存读,局面提前结束"));
                Assert.AreEqual(finalText, RunSnapshot.Write(resumed), Inv($"第 {cut} 步后存读,终局快照不同"));
            }
        }

        // ---- 助手 ----

        private static RunState Started(string seed)
        {
            RunState run = RunState.NewRun(seed, PlaceholderTuning.Config);
            run.StartBlind(PlaceholderTuning.FirstBlind);
            return run;
        }

        private static string StartText() => RunSnapshot.Write(Started("TESTSEED"));

        /// <summary>样档的局面:默认库 TESTSEED 打 6 步(含一次弃置),再在一个空格上置死格。</summary>
        private static RunState SampleState()
        {
            RunState run = Started("TESTSEED");
            for (int i = 0; i < 6; i++) Play(run, i);
            int empty = Enumerable.Range(0, BoardCells.Count).Last(c => run.Blind.Board.OwnerAt(c) == 0);
            run.Blind.Board.SetDead(empty);
            Assert.IsNull(run.Validate());
            return run;
        }

        /// <summary>
        /// 确定的走法:第 2、6、10… 步有弃置次数就弃最左那块,否则最简策略落子,放不下就弃;
        /// 每步之后把最左那块转到 步号 % 4 档,让快照里有非 0 的朝向。
        /// </summary>
        private static StepResult Play(RunState run, int index)
        {
            StepResult result;
            (int id, int rot, int row, int col)? move = TestRules.FirstLegalPlacement(run);
            if ((index % 4 == 1 && run.Blind.DiscardsLeft > 0) || !move.HasValue)
            {
                result = TestRules.Discard(run, run.Blind.Tray.First(s => !s.IsEmpty).Id);
            }
            else
            {
                (int id, int rot, int row, int col) = move.Value;
                result = TestRules.Place(run, id, rot, row, col);
            }
            TraySlot left = run.Blind.Tray.FirstOrDefault(s => !s.IsEmpty);
            if (!left.IsEmpty) run.SetRotation(left.Id, index % 4);
            return result;
        }

        private static void AssertRoundTrip(RunState run, RuleConfig config)
        {
            string text = RunSnapshot.Write(run);
            SnapshotReadResult r = AssertReads(text, config);
            Assert.AreEqual(text, RunSnapshot.Write(r.State), "写 → 读 → 再写逐字节相同");
            Assert.AreEqual(TestRules.Dump(run), TestRules.Dump(r.State), "读回的状态与原状态相同");
        }

        private static SnapshotReadResult AssertReads(string text, RuleConfig config)
        {
            SnapshotReadResult r = RunSnapshot.Read(text, config);
            Assert.IsTrue(r.Ok, Describe(r));
            Assert.IsNull(r.State.Validate());
            Assert.IsNull(r.Path);
            return r;
        }

        private static void AssertFails(string text, SnapshotError error, string path)
        {
            SnapshotReadResult r = RunSnapshot.Read(text, PlaceholderTuning.Config);
            Assert.AreEqual(error, r.Error, Describe(r));
            Assert.AreEqual(path, r.Path, Describe(r));
            Assert.IsNull(r.State);
            Assert.IsFalse(string.IsNullOrEmpty(r.Detail));
        }

        private static void AssertWellFormedResult(SnapshotReadResult r, string what)
        {
            if (r.Ok)
            {
                Assert.IsNull(r.State.Validate(), what);
                return;
            }
            Assert.IsNull(r.State, what);
            Assert.IsNotNull(r.Path, what);
            Assert.IsFalse(string.IsNullOrEmpty(r.Detail), what);
        }

        /// <summary>把第一处 <paramref name="from"/> 换成 <paramref name="to"/>;换的是哪一处由用例期望的出错路径钉住。</summary>
        private static string Mutate(string text, string from, string to)
        {
            int at = text.IndexOf(from, StringComparison.Ordinal);
            Assert.GreaterOrEqual(at, 0, "底稿里没有:" + from);
            return text.Substring(0, at) + to + text.Substring(at + from.Length);
        }

        private static string Describe(SnapshotReadResult r) => Inv($"{r.Error} [{r.Path}] {r.Detail}");

        /// <summary>一步结果的全文:事件按次序,每个事件的公开属性按名字的 ordinal 序。只为比较「两次一样不一样」,不是跑局轨迹的格式。</summary>
        private static string DescribeStep(StepResult r)
        {
            var sb = new StringBuilder(Inv($"step={r.Step} reject={r.Reject}\n"));
            foreach (RuleEvent e in r.Events)
            {
                sb.Append(e.GetType().Name);
                foreach (PropertyInfo p in e.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance).OrderBy(p => p.Name, StringComparer.Ordinal))
                {
                    object v = p.GetValue(e);
                    string s = v is IReadOnlyList<int> list ? "[" + string.Join(",", list) + "]" : Convert.ToString(v, CultureInfo.InvariantCulture);
                    sb.Append(' ').Append(p.Name).Append('=').Append(s);
                }
                sb.Append('\n');
            }
            return sb.ToString();
        }

        private static string SamplePath()
        {
            for (DirectoryInfo d = new DirectoryInfo(AppContext.BaseDirectory); d != null; d = d.Parent)
            {
                if (File.Exists(Path.Combine(d.FullName, "Tests.csproj"))) return Path.Combine(d.FullName, "GameRules", "Samples", "run-v1.json");
            }
            throw new DirectoryNotFoundException("从 " + AppContext.BaseDirectory + " 往上找不到 Tests.csproj");
        }

        private static string Inv(FormattableString s) => FormattableString.Invariant(s);
    }
}
