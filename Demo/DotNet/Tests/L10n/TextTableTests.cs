using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.RegularExpressions;
using NUnit.Framework;

namespace GameRules.Tests
{
    /// <summary>
    /// 文本表的静态校验,读三样:<c>Assets/AssetRaw/Configs/l10n/texts.json</c>、链接编译进来的 <c>TextKeys.cs</c>、
    /// <c>Assets/AssetRaw/UI/</c> 下预制体的 YAML。另核主字体资产没带进编辑器里填的动态字形。
    /// 「表里有、没人用」的孤儿 key 不查:静态扫描扫不全代码里拼出来的引用。
    /// </summary>
    public class TextTableTests
    {
        private const string TablePath = "Assets/AssetRaw/Configs/l10n/texts.json";
        private const string PrefabRoot = "Assets/AssetRaw/UI";
        private const string LocalizedTextMeta = "Assets/GameScripts/HotFix/GameLogic/UI/Common/LocalizedText.cs.meta";
        private const string MainFontAsset = "Assets/AssetRaw/Fonts/SourceHanSansSC-Bold SDF.asset";

        /// <summary><c>LocalizedText</c> 里存 key 的序列化字段名(那边的注释写明了这是契约)。</summary>
        private const string KeyField = "_textKey";

        /// <summary>每条都要有的语言列;加语言就在这里加列名。</summary>
        private static readonly string[] Languages = { "zh", "en" };

        private static readonly Regex KeyPattern = new Regex(@"^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$");
        private static readonly Regex ColumnPattern = new Regex(@"^[a-z][a-z0-9_]*$");

        // {0}、{1,5}、{2:N0} 记序号;{{ 与 }} 是转义的花括号,不算。
        private static readonly Regex Placeholder = new Regex(@"(?<!\{)\{(\d+)(?:,[^}:]*)?(?::[^}]*)?\}");

        [Test]
        public void Table_KeysWellFormedUniqueAndSorted()
        {
            List<Row> rows = LoadTable();
            Assert.That(rows, Is.Not.Empty, TablePath + " 一条都没有");

            var problems = new List<string>();
            var seen = new HashSet<string>(StringComparer.Ordinal);
            string previous = null;
            foreach (Row row in rows)
            {
                if (!KeyPattern.IsMatch(row.Key)) problems.Add("key 不合规(小写 ASCII、数字、下划线,至少两段):" + row.Key);
                if (!seen.Add(row.Key)) problems.Add("key 重复:" + row.Key);
                if (previous != null && string.CompareOrdinal(previous, row.Key) > 0) problems.Add("没按 key 的字典序排:" + row.Key + " 排在 " + previous + " 后面");
                previous = row.Key;
            }
            Assert.That(problems, Is.Empty, TablePath + ":\n" + string.Join("\n", problems));
        }

        [Test]
        public void Table_EveryLanguageFilledAndPlaceholdersMatch()
        {
            var problems = new List<string>();
            foreach (Row row in LoadTable())
            {
                foreach (string lang in Languages)
                {
                    if (string.IsNullOrWhiteSpace(row.Texts[lang])) problems.Add(row.Key + ":" + lang + " 为空");
                }
                string reference = string.Join(",", PlaceholderIndices(row.Texts[Languages[0]]));
                foreach (string lang in Languages.Skip(1))
                {
                    string other = string.Join(",", PlaceholderIndices(row.Texts[lang]));
                    if (other != reference) problems.Add(row.Key + ":占位序号 " + Languages[0] + " 是 {" + reference + "}," + lang + " 是 {" + other + "}");
                }
            }
            Assert.That(problems, Is.Empty, TablePath + ":\n" + string.Join("\n", problems));
        }

        [Test]
        public void TextKeys_ConstantsAndEnumMappingsAreInTable()
        {
            HashSet<string> keys = TableKeys();
            var problems = new List<string>();
            int checkedCount = 0;
            foreach (Type type in WithNested(typeof(TextKeys)))
            {
                foreach (FieldInfo field in type.GetFields(BindingFlags.Public | BindingFlags.Static))
                {
                    if (!field.IsLiteral || field.FieldType != typeof(string)) continue;
                    var key = (string)field.GetRawConstantValue();
                    checkedCount++;
                    if (!keys.Contains(key)) problems.Add(type.FullName + "." + field.Name + " = \"" + key + "\" 不在表里");
                }
                foreach (MethodInfo of in type.GetMethods(BindingFlags.Public | BindingFlags.Static).Where(m => m.Name == "Of"))
                {
                    ParameterInfo[] ps = of.GetParameters();
                    if (ps.Length != 1 || !ps[0].ParameterType.IsEnum || of.ReturnType != typeof(string))
                    {
                        problems.Add(type.FullName + ".Of 的形状应是 string Of(枚举):" + of);
                        continue;
                    }
                    foreach (object value in Enum.GetValues(ps[0].ParameterType))
                    {
                        checkedCount++;
                        string where = type.FullName + ".Of(" + ps[0].ParameterType.Name + "." + value + ")";
                        string key;
                        try
                        {
                            key = (string)of.Invoke(null, new[] { value });
                        }
                        catch (TargetInvocationException e)
                        {
                            problems.Add(where + " 抛了 " + e.InnerException?.GetType().Name + ":" + e.InnerException?.Message);
                            continue;
                        }
                        if (key == null) problems.Add(where + " 返回 null");
                        else if (!keys.Contains(key)) problems.Add(where + " = \"" + key + "\" 不在表里");
                    }
                }
            }
            Assert.That(checkedCount, Is.GreaterThan(0), "TextKeys 里一个常量都没找到,扫描本身坏了");
            Assert.That(problems, Is.Empty, string.Join("\n", problems));
        }

        [Test]
        public void Prefabs_LocalizedTextKeysAreInTable()
        {
            HashSet<string> keys = TableKeys();
            string scriptGuid = ReadGuid(LocalizedTextMeta);
            var problems = new List<string>();
            int found = 0;
            foreach (string prefab in Prefabs())
            {
                YamlFile yaml = YamlFile.Load(prefab);
                foreach (YamlDoc doc in yaml.Docs.Where(d => d.Script == scriptGuid))
                {
                    found++;
                    string key = doc.Field(KeyField) ?? string.Empty;
                    if (!keys.Contains(key)) problems.Add(Relative(prefab) + " 节点「" + yaml.NodeName(doc) + "」:LocalizedText 的 key「" + key + "」不在表里");
                }
                foreach ((string node, string value) in yaml.Overrides(KeyField))
                {
                    found++;
                    if (!keys.Contains(value)) problems.Add(Relative(prefab) + " 嵌套实例的覆写 " + node + ":key「" + value + "」不在表里");
                }
            }
            Assert.That(found, Is.GreaterThan(0), "预制体里一个 LocalizedText 都没扫到(guid " + scriptGuid + "),扫描本身坏了");
            Assert.That(problems, Is.Empty, string.Join("\n", problems));
        }

        [Test]
        public void Prefabs_TmpTextsUseMainFont()
        {
            string mainFont = ReadGuid(MainFontAsset + ".meta");
            var problems = new List<string>();
            foreach (string prefab in Prefabs())
            {
                YamlFile yaml = YamlFile.Load(prefab);
                foreach (YamlDoc doc in yaml.Docs)
                {
                    string font = doc.Field("m_fontAsset");
                    if (font == null) continue;
                    if (GuidOf(font) != mainFont) problems.Add(Relative(prefab) + " 节点「" + yaml.NodeName(doc) + "」:TMP 字体是 " + font);
                }
                foreach ((string node, string value) in yaml.Overrides("m_fontAsset"))
                {
                    if (GuidOf(value) != mainFont) problems.Add(Relative(prefab) + " 嵌套实例的覆写 " + node + ":TMP 字体是 " + value);
                }
            }
            Assert.That(problems, Is.Empty,
                "TMP 组件要直接引用主字体资产 " + MainFontAsset + "(guid " + mainFont + "),不靠 TMP 默认字体:\n" + string.Join("\n", problems));
        }

        [Test]
        public void MainFontAsset_CarriesNoDynamicData()
        {
            YamlFile yaml = YamlFile.Load(Path.Combine(DemoRoot(), MainFontAsset));
            var problems = new List<string>();
            foreach (YamlDoc doc in yaml.Docs)
            {
                foreach (string table in new[] { "m_GlyphTable", "m_CharacterTable" })
                {
                    string value = doc.Field(table);
                    if (value != null && value != "[]") problems.Add(table + " 不是空的");
                }
                // 清空后的图集是 1×1(Clear Dynamic Data)或 0×0
                if (doc.ClassId == "28" && !(IsEmptyAtlasSide(doc.Field("m_Width")) && IsEmptyAtlasSide(doc.Field("m_Height"))))
                {
                    problems.Add("图集 " + doc.Field("m_Name") + " 是 " + doc.Field("m_Width") + "×" + doc.Field("m_Height"));
                }
            }
            Assert.That(problems, Is.Empty,
                MainFontAsset + " 带进了编辑器里填的动态字形与图集(文件会涨到数 MB,每次出字都改动)。" +
                "在 Inspector 里对它右键 Clear Dynamic Data 再保存,或 git checkout 这个文件:\n" + string.Join("\n", problems));
        }

        [TestCase("得分 {0}", "0")]
        [TestCase("{1} / {0}", "0,1")]
        [TestCase("{0:N0} 分,{0,5}", "0")]
        [TestCase("{{0}} 不是占位", "")]
        [TestCase("没有占位", "")]
        public void Scanner_PlaceholderIndices(string text, string expected)
        {
            Assert.AreEqual(expected, string.Join(",", PlaceholderIndices(text)));
        }

        [TestCase("ui.main_menu.start", true)]
        [TestCase("clear_type.full_clear.name", true)]
        [TestCase("ui", false)]
        [TestCase("UI.main_menu.start", false)]
        [TestCase("ui..start", false)]
        [TestCase("ui.main-menu.start", false)]
        [TestCase("1ui.start", false)]
        public void Scanner_KeyPattern(string key, bool ok)
        {
            Assert.AreEqual(ok, KeyPattern.IsMatch(key), key);
        }

        private static bool IsEmptyAtlasSide(string side)
        {
            return side == "0" || side == "1";
        }

        private static IEnumerable<int> PlaceholderIndices(string text)
        {
            return Placeholder.Matches(text).Select(m => int.Parse(m.Groups[1].Value)).Distinct().OrderBy(i => i);
        }

        private sealed class Row
        {
            public string Key;
            public Dictionary<string, string> Texts;
        }

        /// <summary>读表并核形状:根是数组,每条是对象、成员全是字符串、列名都合规、各条列集相同且含 key 与各语言列。</summary>
        private static List<Row> LoadTable()
        {
            string path = Path.Combine(DemoRoot(), TablePath);
            using JsonDocument json = JsonDocument.Parse(File.ReadAllText(path));
            Assert.AreEqual(JsonValueKind.Array, json.RootElement.ValueKind, TablePath + " 的根要是数组");

            var rows = new List<Row>();
            string firstColumns = null;
            int index = 0;
            foreach (JsonElement item in json.RootElement.EnumerateArray())
            {
                string where = TablePath + " 第 " + index++ + " 条";
                Assert.AreEqual(JsonValueKind.Object, item.ValueKind, where + " 不是对象");
                var members = new Dictionary<string, string>(StringComparer.Ordinal);
                foreach (JsonProperty p in item.EnumerateObject())
                {
                    Assert.IsTrue(ColumnPattern.IsMatch(p.Name), where + " 的列名「" + p.Name + "」不是 ASCII 小写标识符");
                    Assert.AreEqual(JsonValueKind.String, p.Value.ValueKind, where + " 的「" + p.Name + "」不是字符串");
                    Assert.IsFalse(members.ContainsKey(p.Name), where + " 的「" + p.Name + "」写了两次");
                    members[p.Name] = p.Value.GetString();
                }
                foreach (string column in new[] { "key" }.Concat(Languages))
                {
                    Assert.IsTrue(members.ContainsKey(column), where + " 缺列「" + column + "」");
                }
                string columns = string.Join(",", members.Keys.OrderBy(k => k, StringComparer.Ordinal));
                firstColumns ??= columns;
                Assert.AreEqual(firstColumns, columns, where + "(" + members["key"] + ")的列和第 0 条不一样");
                rows.Add(new Row { Key = members["key"], Texts = members });
            }
            return rows;
        }

        private static HashSet<string> TableKeys()
        {
            return new HashSet<string>(LoadTable().Select(r => r.Key), StringComparer.Ordinal);
        }

        private static IEnumerable<Type> WithNested(Type type)
        {
            yield return type;
            foreach (Type nested in type.GetNestedTypes(BindingFlags.Public))
            {
                foreach (Type t in WithNested(nested)) yield return t;
            }
        }

        private static IEnumerable<string> Prefabs()
        {
            string[] files = Directory.GetFiles(Path.Combine(DemoRoot(), PrefabRoot), "*.prefab", SearchOption.AllDirectories);
            Array.Sort(files, StringComparer.Ordinal);
            Assert.That(files, Is.Not.Empty, PrefabRoot + " 下没有预制体");
            return files;
        }

        private static string ReadGuid(string metaPath)
        {
            string path = Path.Combine(DemoRoot(), metaPath);
            Match m = Regex.Match(File.ReadAllText(path), @"^guid:\s*([0-9a-f]{32})\s*$", RegexOptions.Multiline);
            Assert.IsTrue(m.Success, metaPath + " 里读不到 guid");
            return m.Groups[1].Value;
        }

        /// <summary>从 <c>{fileID: 11400000, guid: …, type: 2}</c> 里取 guid;没有 guid(如 <c>{fileID: 0}</c>)返回空串。</summary>
        private static string GuidOf(string reference)
        {
            Match m = Regex.Match(reference, @"guid:\s*([0-9a-f]{32})");
            return m.Success ? m.Groups[1].Value : string.Empty;
        }

        private static string Relative(string path)
        {
            return Path.GetRelativePath(DemoRoot(), path).Replace('\\', '/');
        }

        private static string DemoRoot()
        {
            for (DirectoryInfo d = new DirectoryInfo(AppContext.BaseDirectory); d != null; d = d.Parent)
            {
                if (File.Exists(Path.Combine(d.FullName, TablePath))) return d.FullName;
            }
            throw new DirectoryNotFoundException("从 " + AppContext.BaseDirectory + " 往上找不到 " + TablePath);
        }

        /// <summary>Unity 文本序列化的一个文档(<c>--- !u!类号 &amp;fileID</c> 起头);只取顶层与第二层的「名: 值」单行成员。</summary>
        private sealed class YamlDoc
        {
            public string ClassId;
            public string FileId;
            public readonly Dictionary<string, string> Fields = new Dictionary<string, string>(StringComparer.Ordinal);
            public readonly List<string> Lines = new List<string>();

            public string Field(string name)
            {
                return Fields.TryGetValue(name, out string v) ? v : null;
            }

            /// <summary>MonoBehaviour 的脚本 guid;不是 MonoBehaviour 时为 null。</summary>
            public string Script => ClassId == "114" && Field("m_Script") is string s ? GuidOf(s) : null;
        }

        private sealed class YamlFile
        {
            private static readonly Regex Header = new Regex(@"^--- !u!(\d+) &(-?\d+)");
            private static readonly Regex Member = new Regex(@"^ {2}(\w+):(?: (.*))?$");

            public readonly List<YamlDoc> Docs = new List<YamlDoc>();

            public static YamlFile Load(string path)
            {
                var file = new YamlFile();
                YamlDoc current = null;
                foreach (string raw in File.ReadAllLines(path))
                {
                    string line = raw.TrimEnd('\r');
                    Match h = Header.Match(line);
                    if (h.Success)
                    {
                        current = new YamlDoc { ClassId = h.Groups[1].Value, FileId = h.Groups[2].Value };
                        file.Docs.Add(current);
                        continue;
                    }
                    if (current == null) continue;
                    current.Lines.Add(line);
                    Match m = Member.Match(line);
                    if (!m.Success || current.Fields.ContainsKey(m.Groups[1].Value)) continue;
                    string value = m.Groups[2].Value.Trim();
                    // 非 ASCII 的值 Unity 写成带 \uXXXX 转义的双引号串
                    if (value.Length >= 2 && value[0] == '"' && value[value.Length - 1] == '"') value = Regex.Unescape(value.Substring(1, value.Length - 2));
                    current.Fields[m.Groups[1].Value] = value;
                }
                return file;
            }

            /// <summary>组件所在 GameObject 的名字,报错用。</summary>
            public string NodeName(YamlDoc component)
            {
                string go = GuidlessFileId(component.Field("m_GameObject"));
                YamlDoc owner = Docs.FirstOrDefault(d => d.ClassId == "1" && d.FileId == go);
                return owner?.Field("m_Name") ?? "?";
            }

            /// <summary>嵌套预制体实例里对 <paramref name="property"/> 的覆写:(目标, 值或对象引用)。</summary>
            public IEnumerable<(string, string)> Overrides(string property)
            {
                foreach (YamlDoc doc in Docs.Where(d => d.ClassId == "1001"))
                {
                    for (int i = 0; i < doc.Lines.Count; i++)
                    {
                        if (doc.Lines[i].Trim() != "propertyPath: " + property) continue;
                        string target = i > 0 ? doc.Lines[i - 1].Trim() : "?";
                        string value = i + 1 < doc.Lines.Count ? Regex.Replace(doc.Lines[i + 1].Trim(), @"^value:\s*", "") : "";
                        string objectRef = i + 2 < doc.Lines.Count ? Regex.Replace(doc.Lines[i + 2].Trim(), @"^objectReference:\s*", "") : "";
                        yield return (target, property == "m_fontAsset" ? objectRef : value);
                    }
                }
            }

            private static string GuidlessFileId(string reference)
            {
                Match m = Regex.Match(reference ?? "", @"fileID:\s*(-?\d+)");
                return m.Success ? m.Groups[1].Value : "";
            }
        }
    }
}
