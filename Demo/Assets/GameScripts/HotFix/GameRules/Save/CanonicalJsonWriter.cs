using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace GameRules
{
    internal enum JsonLayout
    {
        /// <summary>每个元素一行,按深度两格缩进;收尾的括号另起一行。</summary>
        Lines = 0,

        /// <summary>写在一行里:<c>[1, 2]</c>、<c>{ "id": 3, "rot": 1 }</c>。里面不能再套 <see cref="Lines"/>。</summary>
        Inline = 1,
    }

    /// <summary>
    /// JSON 子集的写出端,出 09 号票 §3 的规范形:只有 ASCII(其余字符一律 <c>\uXXXX</c>)、LF、两格缩进、文末一个换行、不写 BOM。
    /// 排版由调用方逐个容器指定(<see cref="JsonLayout"/>),成员次序就是调用次序;没有自动换行规则,同一串调用写出的字节永远相同。
    /// </summary>
    internal sealed class CanonicalJsonWriter
    {
        private sealed class Frame
        {
            public bool IsObject;
            public bool Lines;
            public int Count;
        }

        private readonly StringBuilder _sb = new StringBuilder(4096);
        private readonly List<Frame> _frames = new List<Frame>();
        private bool _afterName;
        private bool _done;

        public CanonicalJsonWriter BeginObject(JsonLayout layout) => Begin(true, layout, '{');

        public CanonicalJsonWriter BeginArray(JsonLayout layout) => Begin(false, layout, '[');

        /// <summary>收掉最里层的容器。</summary>
        public CanonicalJsonWriter End()
        {
            if (_frames.Count == 0 || _afterName) throw new InvalidOperationException("没有可收的容器,或成员名后面还没写值");
            Frame f = _frames[_frames.Count - 1];
            _frames.RemoveAt(_frames.Count - 1);
            if (f.Count > 0)
            {
                if (f.Lines) NewLine(_frames.Count);
                else if (f.IsObject) _sb.Append(' ');
            }
            _sb.Append(f.IsObject ? '}' : ']');
            if (_frames.Count == 0) _done = true;
            return this;
        }

        public CanonicalJsonWriter Name(string name)
        {
            if (_frames.Count == 0 || !_frames[_frames.Count - 1].IsObject || _afterName) throw new InvalidOperationException("成员名只能写在对象里、值之前");
            Separate(_frames[_frames.Count - 1]);
            AppendString(name);
            _sb.Append(": ");
            _afterName = true;
            return this;
        }

        public CanonicalJsonWriter Int(long value)
        {
            BeforeValue();
            _sb.Append(value.ToString(CultureInfo.InvariantCulture));
            return this;
        }

        public CanonicalJsonWriter String(string value)
        {
            if (value == null) throw new ArgumentNullException(nameof(value));
            BeforeValue();
            AppendString(value);
            return this;
        }

        public CanonicalJsonWriter Bool(bool value)
        {
            BeforeValue();
            _sb.Append(value ? "true" : "false");
            return this;
        }

        public CanonicalJsonWriter Null()
        {
            BeforeValue();
            _sb.Append("null");
            return this;
        }

        /// <summary>根值写完后取全文,补上文末那个换行。</summary>
        public string Finish()
        {
            if (!_done) throw new InvalidOperationException("根值还没写完");
            return _sb.ToString() + "\n";
        }

        private CanonicalJsonWriter Begin(bool isObject, JsonLayout layout, char open)
        {
            bool lines = layout == JsonLayout.Lines;
            if (lines && _frames.Count > 0 && !_frames[_frames.Count - 1].Lines) throw new InvalidOperationException("单行容器里不能套多行容器");
            BeforeValue();
            _frames.Add(new Frame { IsObject = isObject, Lines = lines });
            _sb.Append(open);
            return this;
        }

        private void BeforeValue()
        {
            if (_done) throw new InvalidOperationException("根值已经写完");
            if (_frames.Count == 0) return;
            Frame f = _frames[_frames.Count - 1];
            if (f.IsObject)
            {
                // 分隔符已由 Name 写过
                if (!_afterName) throw new InvalidOperationException("对象里先写成员名");
                _afterName = false;
                return;
            }
            Separate(f);
        }

        private void Separate(Frame f)
        {
            if (f.Count > 0) _sb.Append(',');
            if (f.Lines) NewLine(_frames.Count);
            else if (f.Count > 0 || f.IsObject) _sb.Append(' ');
            f.Count++;
        }

        private void NewLine(int depth)
        {
            _sb.Append('\n');
            _sb.Append(' ', depth * 2);
        }

        private void AppendString(string s)
        {
            _sb.Append('"');
            foreach (char c in s)
            {
                if (c == '"') _sb.Append("\\\"");
                else if (c == '\\') _sb.Append("\\\\");
                else if (c < 0x20 || c > 0x7E) _sb.Append("\\u").Append(((int)c).ToString("x4", CultureInfo.InvariantCulture));
                else _sb.Append(c);
            }
            _sb.Append('"');
        }
    }
}
