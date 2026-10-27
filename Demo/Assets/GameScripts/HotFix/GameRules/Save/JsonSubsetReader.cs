using System;
using System.Collections.Generic;
using System.Text;
using static System.FormattableString;

namespace GameRules
{
    /// <summary>
    /// JSON 子集的读入端,按不可信输入写(09 号票 §3):不抛异常,出错返回错误码和第一处出错的成员路径。
    /// 只认整数、字符串、布尔、null、数组、对象;数带小数点或指数、超出 64 位都是错。
    /// 上限:文本 <see cref="MaxLength"/> 字符、嵌套 <see cref="MaxDepth"/> 层(递归下降,深度先于递归查,嵌套再深也不会栈溢出)。
    /// 开头的 UTF-8 BOM 跳过;空白、转义照标准 JSON 收,规范形只约束写出端。
    /// </summary>
    internal sealed class JsonSubsetReader
    {
        /// <summary>1 MiB,按字符数计:合规的档全是 ASCII,字符数就是字节数。</summary>
        public const int MaxLength = 1 << 20;

        public const int MaxDepth = 16;

        private readonly string _text;
        private int _pos;

        // 当前位置的成员路径,一段一项:".成员名" 或 "[i]"
        private readonly List<string> _path = new List<string>();

        private SnapshotReadResult _fault;

        private JsonSubsetReader(string text)
        {
            _text = text;
        }

        /// <summary>解析成功返回 null、<paramref name="root"/> 是根;失败返回错误结果、<paramref name="root"/> 为 null。</summary>
        public static SnapshotReadResult Parse(string text, out JsonNode root)
        {
            root = null;
            if (string.IsNullOrEmpty(text)) return SnapshotReadResult.Failure(SnapshotError.Syntax, "", "空文本");
            if (text.Length > MaxLength)
            {
                return SnapshotReadResult.Failure(SnapshotError.TooLarge, "", Invariant($"文本有 {text.Length} 个字符,上限 {MaxLength}"));
            }
            var reader = new JsonSubsetReader(text);
            if (text[0] == '﻿') reader._pos = 1;
            reader.SkipWhitespace();
            if (!reader.ParseValue(0, out JsonNode node)) return reader._fault;
            reader.SkipWhitespace();
            if (reader._pos != text.Length)
            {
                reader.Fail(SnapshotError.Syntax, "根值之后还有内容");
                return reader._fault;
            }
            root = node;
            return null;
        }

        private bool ParseValue(int depth, out JsonNode node)
        {
            node = null;
            if (_pos >= _text.Length) return Fail(SnapshotError.Syntax, "文本在这里断了");
            char c = _text[_pos];
            switch (c)
            {
                case '{': return ParseObject(depth + 1, out node);
                case '[': return ParseArray(depth + 1, out node);
                case '"':
                    if (!ParseString(out string s)) return false;
                    node = JsonNode.FromString(s);
                    return true;
                case 't': return ParseLiteral("true", JsonNode.FromBool(true), out node);
                case 'f': return ParseLiteral("false", JsonNode.FromBool(false), out node);
                case 'n': return ParseLiteral("null", JsonNode.Null, out node);
            }
            if (c == '-' || (c >= '0' && c <= '9')) return ParseInteger(out node);
            return Fail(SnapshotError.Syntax, Invariant($"意外的字符 U+{(int)c:X4}"));
        }

        private bool ParseObject(int depth, out JsonNode node)
        {
            node = null;
            if (depth > MaxDepth) return Fail(SnapshotError.TooDeep, Invariant($"嵌套超过 {MaxDepth} 层"));
            _pos++;
            var members = new List<KeyValuePair<string, JsonNode>>();
            SkipWhitespace();
            if (Peek() == '}')
            {
                _pos++;
                node = JsonNode.FromMembers(members);
                return true;
            }
            while (true)
            {
                SkipWhitespace();
                if (Peek() != '"') return Fail(SnapshotError.Syntax, _pos >= _text.Length ? "文本在这里断了" : "这里应是成员名");
                if (!ParseString(out string name)) return false;
                SkipWhitespace();
                if (!Expect(':')) return false;
                SkipWhitespace();
                _path.Add("." + name);
                if (!ParseValue(depth, out JsonNode value)) return false;
                _path.RemoveAt(_path.Count - 1);
                members.Add(new KeyValuePair<string, JsonNode>(name, value));
                SkipWhitespace();
                if (Peek() == ',')
                {
                    _pos++;
                    continue;
                }
                if (!Expect('}')) return false;
                node = JsonNode.FromMembers(members);
                return true;
            }
        }

        private bool ParseArray(int depth, out JsonNode node)
        {
            node = null;
            if (depth > MaxDepth) return Fail(SnapshotError.TooDeep, Invariant($"嵌套超过 {MaxDepth} 层"));
            _pos++;
            var items = new List<JsonNode>();
            SkipWhitespace();
            if (Peek() == ']')
            {
                _pos++;
                node = JsonNode.FromItems(items);
                return true;
            }
            while (true)
            {
                SkipWhitespace();
                _path.Add(Invariant($"[{items.Count}]"));
                if (!ParseValue(depth, out JsonNode item)) return false;
                _path.RemoveAt(_path.Count - 1);
                items.Add(item);
                SkipWhitespace();
                if (Peek() == ',')
                {
                    _pos++;
                    continue;
                }
                if (!Expect(']')) return false;
                node = JsonNode.FromItems(items);
                return true;
            }
        }

        private bool ParseString(out string value)
        {
            value = null;
            _pos++;
            var sb = new StringBuilder();
            while (true)
            {
                if (_pos >= _text.Length) return Fail(SnapshotError.Syntax, "字符串没有结尾");
                char c = _text[_pos++];
                if (c == '"') break;
                if (c < 0x20) return Fail(SnapshotError.Syntax, "字符串里有未转义的控制字符");
                if (c != '\\')
                {
                    sb.Append(c);
                    continue;
                }
                if (_pos >= _text.Length) return Fail(SnapshotError.Syntax, "字符串没有结尾");
                char e = _text[_pos++];
                switch (e)
                {
                    case '"': sb.Append('"'); break;
                    case '\\': sb.Append('\\'); break;
                    case '/': sb.Append('/'); break;
                    case 'b': sb.Append('\b'); break;
                    case 'f': sb.Append('\f'); break;
                    case 'n': sb.Append('\n'); break;
                    case 'r': sb.Append('\r'); break;
                    case 't': sb.Append('\t'); break;
                    case 'u':
                        int code = 0;
                        for (int i = 0; i < 4; i++)
                        {
                            int d = _pos < _text.Length ? HexDigit(_text[_pos]) : -1;
                            if (d < 0) return Fail(SnapshotError.Syntax, "\\u 后面要 4 位十六进制");
                            code = code * 16 + d;
                            _pos++;
                        }
                        sb.Append((char)code);
                        break;
                    default:
                        return Fail(SnapshotError.Syntax, Invariant($"不认的转义 \\{e}"));
                }
            }
            value = sb.ToString();
            return true;
        }

        private bool ParseInteger(out JsonNode node)
        {
            node = null;
            bool negative = Peek() == '-';
            if (negative) _pos++;
            if (_pos >= _text.Length || _text[_pos] < '0' || _text[_pos] > '9') return Fail(SnapshotError.Syntax, "负号后面要数字");
            if (_text[_pos] == '0' && _pos + 1 < _text.Length && _text[_pos + 1] >= '0' && _text[_pos + 1] <= '9')
            {
                return Fail(SnapshotError.Syntax, "数字有前导零");
            }

            // 按无符号累加量级,负数允许到 2^63(long.MinValue)
            const ulong limit = 9223372036854775808UL;
            ulong magnitude = 0;
            bool overflow = false;
            while (_pos < _text.Length && _text[_pos] >= '0' && _text[_pos] <= '9')
            {
                ulong digit = (ulong)(_text[_pos] - '0');
                if (magnitude > (limit - digit) / 10) overflow = true;
                else magnitude = magnitude * 10 + digit;
                _pos++;
            }
            char next = Peek();
            if (next == '.' || next == 'e' || next == 'E') return Fail(SnapshotError.NotInteger, "只认整数,不认小数点和指数");
            if (overflow || (!negative && magnitude == limit)) return Fail(SnapshotError.OutOfRange, "整数超出 64 位");
            long value = negative ? (magnitude == limit ? long.MinValue : -(long)magnitude) : (long)magnitude;
            node = JsonNode.FromInteger(value);
            return true;
        }

        private bool ParseLiteral(string word, JsonNode value, out JsonNode node)
        {
            node = null;
            if (string.CompareOrdinal(_text, _pos, word, 0, word.Length) != 0) return Fail(SnapshotError.Syntax, "不认的字面量");
            _pos += word.Length;
            node = value;
            return true;
        }

        private bool Expect(char c)
        {
            if (Peek() == c)
            {
                _pos++;
                return true;
            }
            return Fail(SnapshotError.Syntax, _pos >= _text.Length ? "文本在这里断了" : Invariant($"这里应是 '{c}'"));
        }

        private char Peek() => _pos < _text.Length ? _text[_pos] : '\0';

        private void SkipWhitespace()
        {
            while (_pos < _text.Length)
            {
                char c = _text[_pos];
                if (c != ' ' && c != '\t' && c != '\n' && c != '\r') return;
                _pos++;
            }
        }

        private static int HexDigit(char c)
        {
            if (c >= '0' && c <= '9') return c - '0';
            if (c >= 'a' && c <= 'f') return c - 'a' + 10;
            if (c >= 'A' && c <= 'F') return c - 'A' + 10;
            return -1;
        }

        private bool Fail(SnapshotError error, string detail)
        {
            _fault = SnapshotReadResult.Failure(error, CurrentPath(), detail);
            return false;
        }

        // 根下的成员不带前导点:blind.tray[1].rot
        private string CurrentPath()
        {
            string path = string.Concat(_path);
            return path.StartsWith(".", StringComparison.Ordinal) ? path.Substring(1) : path;
        }
    }
}
