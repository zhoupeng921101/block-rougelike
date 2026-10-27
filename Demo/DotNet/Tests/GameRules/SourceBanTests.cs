using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>
    /// 规则核心的源码禁用清单:按文本扫 Assets 下正本目录的 .cs(去掉注释后再扫,注释里提到不算)。
    /// 拦的是镜像库编得过、但会让两端或两次运行结果不一样的写法;约束正本 = .claude/rules-ondemand/tengine-conventions.md「规则核心」。
    /// </summary>
    public class SourceBanTests
    {
        private static readonly (string Name, Regex Pattern)[] Bans =
        {
            ("System.Random", new Regex(@"\bSystem\s*\.\s*Random\b|\bnew\s+Random\s*\(|\bRandom\s*\.\s*Shared\b")),
            ("DateTime.Now / UtcNow / Today", new Regex(@"\bDateTime(Offset)?\s*\.\s*(Now|UtcNow|Today)\b")),
            ("Guid.NewGuid", new Regex(@"\bGuid\s*\.\s*NewGuid\b")),
            ("Environment.TickCount", new Regex(@"\bEnvironment\s*\.\s*TickCount(64)?\b")),
            ("Stopwatch", new Regex(@"\bStopwatch\b")),
            ("调用 NextDouble(只取整数随机)", new Regex(@"\.\s*NextDouble\s*\(")),
            ("#if UNITY_*(镜像库没有 Unity 宏,两端编的不是同一份)", new Regex(@"^[ \t]*#[ \t]*(if|elif)\b[^\r\n]*\bUNITY_", RegexOptions.Multiline)),
        };

        [Test]
        public void RulesSource_HasNoBannedConstructs()
        {
            string root = FindRulesSourceDir();
            string[] files = Directory.GetFiles(root, "*.cs", SearchOption.AllDirectories);
            Array.Sort(files, StringComparer.Ordinal);
            Assert.That(files, Is.Not.Empty, "正本目录下没有 .cs:" + root);

            var hits = new List<string>();
            foreach (string file in files)
            {
                string code = StripComments(File.ReadAllText(file));
                foreach ((string name, Regex pattern) in Bans)
                {
                    foreach (Match m in pattern.Matches(code))
                    {
                        int line = code.Take(m.Index).Count(c => c == '\n') + 1;
                        hits.Add(Path.GetRelativePath(root, file) + ":" + line + "  " + name + "  「" + m.Value.Trim() + "」");
                    }
                }
            }
            Assert.That(hits, Is.Empty, "规则核心里出现禁用写法:\n" + string.Join("\n", hits));
        }

        [TestCase("var r = new System.Random(1);", true)]
        [TestCase("var r = new Random(1);", true)]
        [TestCase("long t = DateTime.UtcNow.Ticks;", true)]
        [TestCase("double d = rng.NextDouble();", true)]
        [TestCase("#if UNITY_EDITOR\n#endif", true)]
        [TestCase("// System.Random 只在注释里\nint x;", false)]
        [TestCase("/* DateTime.Now */ int x;", false)]
        [TestCase("string s = \"http://x\"; var r = new System.Random(1);", true)]
        [TestCase("public double NextDouble() => 0;", false)]
        public void Scanner_SelfCheck(string snippet, bool banned)
        {
            string code = StripComments(snippet);
            Assert.AreEqual(banned, Bans.Any(b => b.Pattern.IsMatch(code)), snippet);
        }

        private static string FindRulesSourceDir()
        {
            for (DirectoryInfo d = new DirectoryInfo(AppContext.BaseDirectory); d != null; d = d.Parent)
            {
                string candidate = Path.Combine(d.FullName, "Assets", "GameScripts", "HotFix", "GameRules");
                if (Directory.Exists(candidate)) return candidate;
            }
            throw new DirectoryNotFoundException("从 " + AppContext.BaseDirectory + " 往上找不到 Assets/GameScripts/HotFix/GameRules");
        }

        // 去掉 // 与 /* */ 注释,换行保留(行号不变);字符串与字符字面量原样保留,只为不把其中的 // 当成注释起点。
        private static string StripComments(string src)
        {
            var sb = new StringBuilder(src.Length);
            int i = 0;
            while (i < src.Length)
            {
                char c = src[i];
                char next = i + 1 < src.Length ? src[i + 1] : '\0';
                if (c == '/' && next == '/')
                {
                    while (i < src.Length && src[i] != '\n') i++;
                }
                else if (c == '/' && next == '*')
                {
                    i += 2;
                    while (i < src.Length && !(src[i] == '*' && i + 1 < src.Length && src[i + 1] == '/'))
                    {
                        if (src[i] == '\n') sb.Append('\n');
                        i++;
                    }
                    i += 2;
                }
                else if (c == '"' || c == '\'')
                {
                    bool verbatim = c == '"' && i > 0 && (src[i - 1] == '@' || (src[i - 1] == '$' && i > 1 && src[i - 2] == '@'));
                    sb.Append(c);
                    i++;
                    while (i < src.Length)
                    {
                        char s = src[i];
                        sb.Append(s);
                        i++;
                        if (!verbatim && s == '\\' && i < src.Length) { sb.Append(src[i]); i++; continue; }
                        if (s == c)
                        {
                            if (verbatim && i < src.Length && src[i] == c) { sb.Append(c); i++; continue; }
                            break;
                        }
                    }
                }
                else
                {
                    sb.Append(c);
                    i++;
                }
            }
            return sb.ToString();
        }
    }
}
