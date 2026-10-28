using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>
    /// 局内存档的文件层(23 号票第 4 条,口径 09 号票第 6 节)。<c>RunSaveFile.cs</c> 从 GameLogic 链接编译进来,它引了 UnityEngine 这里就编不过。
    /// 每个用例一个新的临时目录;档的内容由真规则核心走出来,用 <see cref="RunSnapshot.Write"/> 比「读回来的是哪一份」。
    /// </summary>
    public class RunSaveFileTests
    {
        private string _dir;
        private List<string> _warnings;
        private RunSaveFile _file;

        private static RuleConfig Config => PlaceholderTuning.Config;

        [SetUp]
        public void SetUp()
        {
            _dir = Path.Combine(Path.GetTempPath(), "3b-RunSaveFileTests", Guid.NewGuid().ToString("N"));
            _warnings = new List<string>();
            _file = new RunSaveFile(_dir, _warnings.Add);
        }

        [TearDown]
        public void TearDown()
        {
            if (Directory.Exists(_dir)) Directory.Delete(_dir, true);
        }

        // ---- 写 ----

        [Test]
        public void WriteTwice_BakIsTheFirst()
        {
            RunState run = Started();
            string first = RunSnapshot.Write(run);
            Assert.IsTrue(_file.Write(first));
            Assert.IsFalse(File.Exists(_file.BakPath), "第一次写,正档原来不在,不产生 .bak");

            string second = RunSnapshot.Write(Stepped(run, 1));
            Assert.IsTrue(_file.Write(second));

            Assert.AreEqual(second, ReadText(_file.MainPath));
            Assert.AreEqual(first, ReadText(_file.BakPath));
            Assert.IsFalse(File.Exists(_file.TmpPath));
            CollectionAssert.IsEmpty(_warnings);
        }

        [Test]
        public void Write_CreatesTheFolder_Utf8WithoutBom()
        {
            Assert.IsFalse(Directory.Exists(_dir));
            string text = RunSnapshot.Write(Started());
            Assert.IsTrue(_file.Write(text));
            CollectionAssert.AreEqual(Encoding.ASCII.GetBytes(text), File.ReadAllBytes(_file.MainPath), "逐字节就是快照文本:没有 BOM,换行不改");
        }

        [Test]
        public void Write_WhenMainIsLocked_ReturnsFalse_LogsAndKeepsTheOldMain()
        {
            RunState run = Started();
            string first = RunSnapshot.Write(run);
            _file.Write(first);
            string second = RunSnapshot.Write(Stepped(run, 1));

            bool ok;
            using (new FileStream(_file.MainPath, FileMode.Open, FileAccess.Read, FileShare.None))
            {
                ok = _file.Write(second);
            }

            Assert.IsFalse(ok);
            Assert.AreEqual(1, _warnings.Count, "重试过一次之后只记一条");
            StringAssert.Contains("写档失败", _warnings[0]);
            Assert.AreEqual(first, ReadText(_file.MainPath), "正档还是上一份");
            Assert.AreEqual(first, RunSnapshot.Write(_file.Load(Config)), "下一次读档照常读到上一份,残留的 .tmp 被删");
            Assert.IsFalse(File.Exists(_file.TmpPath));
        }

        [Test]
        public void Write_WhenMainPathIsADirectory_ReturnsFalseWithoutThrowing()
        {
            Directory.CreateDirectory(_file.MainPath);
            Assert.IsFalse(_file.Write(RunSnapshot.Write(Started())));
            Assert.AreEqual(1, _warnings.Count);
        }

        // ---- 读 ----

        [Test]
        public void Load_NoFolderOrNoFile_IsNoSave()
        {
            Assert.IsNull(_file.Load(Config));
            Directory.CreateDirectory(_dir);
            Assert.IsNull(_file.Load(Config));
            CollectionAssert.IsEmpty(_warnings);
        }

        [Test]
        public void Load_ReadsBackTheLastWrite()
        {
            RunState run = Stepped(Started(), 3);
            _file.Write(RunSnapshot.Write(Started()));
            _file.Write(RunSnapshot.Write(run));

            RunState loaded = _file.Load(Config);
            Assert.IsNotNull(loaded);
            Assert.IsNull(loaded.Validate());
            Assert.AreEqual(RunSnapshot.Write(run), RunSnapshot.Write(loaded));
            CollectionAssert.IsEmpty(_warnings);
        }

        [Test]
        public void CorruptMain_FallsBackToBak_MovesMainToBad_AndCopiesBakBack()
        {
            RunState run = Started();
            string first = RunSnapshot.Write(run);
            _file.Write(first);
            string second = RunSnapshot.Write(Stepped(run, 1));
            _file.Write(second);
            string broken = second.Substring(0, second.Length / 2);
            File.WriteAllText(_file.MainPath, broken);

            RunState loaded = _file.Load(Config);

            Assert.IsNotNull(loaded, "回退到 .bak");
            Assert.AreEqual(first, RunSnapshot.Write(loaded), "退回上一份");
            Assert.AreEqual(broken, ReadText(_file.BadPath), "坏档挪成 .bad,内容原样");
            Assert.AreEqual(first, ReadText(_file.MainPath), "从 .bak 抄回正档:这次不点「继续」就退出,下次还读得到");
            Assert.AreEqual(first, ReadText(_file.BakPath));
            Assert.AreEqual(2, _warnings.Count, "一条坏档、一条回退");
            StringAssert.Contains("Syntax", _warnings[0]);

            Assert.AreEqual(first, RunSnapshot.Write(_file.Load(Config)), "再读一次,读的是抄回来的正档");
        }

        [Test]
        public void CorruptMainAndBak_BothMovedAway_IsNoSave_BadKeepsTheLatest()
        {
            RunState run = Started();
            _file.Write(RunSnapshot.Write(run));
            _file.Write(RunSnapshot.Write(Stepped(run, 1)));
            File.WriteAllText(_file.MainPath, "{}");
            File.WriteAllText(_file.BakPath, "not json");

            Assert.IsNull(_file.Load(Config));
            Assert.IsFalse(File.Exists(_file.MainPath));
            Assert.IsFalse(File.Exists(_file.BakPath));
            Assert.AreEqual("not json", ReadText(_file.BadPath), ".bad 只留最近读不了的那一份");
        }

        [Test]
        public void HalfWrittenTmp_IsDeletedOnLoad_MainUntouched()
        {
            RunState run = Started();
            string first = RunSnapshot.Write(run);
            _file.Write(first);
            string second = RunSnapshot.Write(Stepped(run, 1));
            File.WriteAllText(_file.TmpPath, second.Substring(0, second.Length / 3));

            RunState loaded = _file.Load(Config);

            Assert.IsFalse(File.Exists(_file.TmpPath));
            Assert.AreEqual(first, RunSnapshot.Write(loaded));
            Assert.AreEqual(first, ReadText(_file.MainPath));
            Assert.IsFalse(File.Exists(_file.BadPath));
            CollectionAssert.IsEmpty(_warnings);
        }

        [Test]
        public void EndedSnapshot_LoadsAsNoSave_AndDeletesMainAndBak()
        {
            RunState run = Started();
            _file.Write(RunSnapshot.Write(run));
            PlayToEnd(run);
            Assert.AreNotEqual(BlindOutcome.InProgress, run.Blind.Outcome);
            _file.Write(RunSnapshot.Write(run));
            Assert.IsTrue(File.Exists(_file.BakPath));

            Assert.IsNull(_file.Load(Config));
            Assert.IsFalse(File.Exists(_file.MainPath));
            Assert.IsFalse(File.Exists(_file.BakPath));
            Assert.IsFalse(File.Exists(_file.BadPath), "终局快照不是坏档,不挪成 .bad");
            CollectionAssert.IsEmpty(_warnings);
        }

        [Test]
        public void OnlyBak_NoMain_IsNoSave_BakLeftAlone()
        {
            RunState run = Started();
            _file.Write(RunSnapshot.Write(run));
            _file.Write(RunSnapshot.Write(Stepped(run, 1)));
            File.Delete(_file.MainPath);

            Assert.IsNull(_file.Load(Config));
            Assert.IsTrue(File.Exists(_file.BakPath), "不回退到 .bak,也不动它:开新局时一起删");
            Assert.IsFalse(File.Exists(_file.MainPath));
            CollectionAssert.IsEmpty(_warnings);
        }

        /// <summary>读入任何内容都不抛异常:读不了的一律挪成 .bad、当无档。</summary>
        [TestCaseSource(nameof(Garbage))]
        public void Load_NeverThrows_OnAnyContent(string name, byte[] content)
        {
            Directory.CreateDirectory(_dir);
            File.WriteAllBytes(_file.MainPath, content);
            File.WriteAllBytes(_file.BakPath, content);

            RunState loaded = null;
            Assert.DoesNotThrow(() => loaded = _file.Load(Config), name);

            Assert.IsNull(loaded, name);
            Assert.IsFalse(File.Exists(_file.MainPath), name);
            Assert.IsFalse(File.Exists(_file.BakPath), name);
            Assert.IsTrue(File.Exists(_file.BadPath), name);
            Assert.AreEqual(2, _warnings.Count, name + ":正档、.bak 各记一条");
        }

        private static IEnumerable<TestCaseData> Garbage()
        {
            string valid = RunSnapshot.Write(Started());
            var rng = new Random(23);
            byte[] noise = new byte[4096];
            rng.NextBytes(noise);
            byte[] huge = new byte[4 * 1024 * 1024 + 1];
            for (int i = 0; i < huge.Length; i++) huge[i] = (byte)' ';
            var cases = new (string, byte[])[]
            {
                ("空文件", new byte[0]),
                ("只有 BOM", new byte[] { 0xEF, 0xBB, 0xBF }),
                ("随机字节", noise),
                ("全零", new byte[1024]),
                ("不合法的 UTF-8", new byte[] { (byte)'{', 0xC3, 0x28, 0xFF, 0xFE, (byte)'}' }),
                ("UTF-16 写的快照", Encoding.Unicode.GetBytes(valid)),
                ("别的 JSON", Encoding.ASCII.GetBytes("{\"format\": \"other\", \"schema\": 1}\n")),
                ("截掉末尾的右括号", Encoding.ASCII.GetBytes(valid.Substring(0, valid.Length - 2))),
                ("超过 4 MiB", huge),
            };
            return cases.Select(c => new TestCaseData(c.Item1, c.Item2).SetName("Load_NeverThrows_" + c.Item1));
        }

        [Test]
        public void Load_NeverThrows_OnEveryTruncationOfARealSave()
        {
            string text = RunSnapshot.Write(Stepped(Started(), 4));
            // 只截到右括号之前:截掉的只是文末换行时,读入端照收(22 号票:词法上放宽)
            for (int cut = 0; cut < text.Length - 1; cut += 7)
            {
                Directory.CreateDirectory(_dir);
                File.WriteAllText(_file.MainPath, text.Substring(0, cut));
                RunState loaded = null;
                Assert.DoesNotThrow(() => loaded = _file.Load(Config), "截到 " + cut);
                Assert.IsNull(loaded, "截到 " + cut);
            }
        }

        // ---- 删 ----

        [Test]
        public void Delete_RemovesMainBakAndTmp_KeepsBad()
        {
            RunState run = Started();
            _file.Write(RunSnapshot.Write(run));
            _file.Write(RunSnapshot.Write(Stepped(run, 1)));
            File.WriteAllText(_file.TmpPath, "x");
            File.WriteAllText(_file.BadPath, "y");

            _file.Delete();

            Assert.IsFalse(File.Exists(_file.MainPath));
            Assert.IsFalse(File.Exists(_file.BakPath));
            Assert.IsFalse(File.Exists(_file.TmpPath));
            Assert.AreEqual("y", ReadText(_file.BadPath), ".bad 留着报 bug");
            Assert.DoesNotThrow(() => _file.Delete(), "没有档时再删一次也不出事");
            CollectionAssert.IsEmpty(_warnings);
        }

        // ---- 助手 ----

        private static RunState Started()
        {
            RunState run = RunState.NewRun(TestRules.Seed, Config);
            run.StartBlind(PlaceholderTuning.FirstBlind);
            return run;
        }

        /// <summary>用最简策略接着走 <paramref name="steps"/> 步(放不下就弃)。</summary>
        private static RunState Stepped(RunState run, int steps)
        {
            for (int i = 0; i < steps && run.Blind.Outcome == BlindOutcome.InProgress; i++) StepOnce(run);
            return run;
        }

        private static void PlayToEnd(RunState run)
        {
            for (int i = 0; i < 500 && run.Blind.Outcome == BlindOutcome.InProgress; i++) StepOnce(run);
        }

        private static void StepOnce(RunState run)
        {
            var move = TestRules.FirstLegalPlacement(run);
            if (move.HasValue)
            {
                (int id, int rot, int row, int col) = move.Value;
                TestRules.Place(run, id, rot, row, col);
                return;
            }
            TestRules.Discard(run, run.Blind.Tray.First(s => !s.IsEmpty).Id);
        }

        private static string ReadText(string path) => File.ReadAllText(path, new UTF8Encoding(false));
    }
}
