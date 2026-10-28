using System;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using System.Text;
using static System.FormattableString;

namespace GameRules.Sim
{
    /// <summary>
    /// 一局的规范化轨迹(10 号票 §7):纯 ASCII、LF,逐局比全文,出错时报第一处不同的行。
    /// <code>
    /// game seed=&lt;种子&gt; policy=&lt;策略&gt;
    /// start                                          开盲注的事件,不属于任何一步
    ///   &lt;事件类型名&gt; &lt;成员&gt;=&lt;值&gt; …
    /// step &lt;n&gt; place inst=&lt;id&gt; rot=&lt;r&gt; r=&lt;行&gt; c=&lt;列&gt;   或  step &lt;n&gt; discard inst=&lt;id&gt;
    ///   &lt;这一步吐的事件,按吐出的次序&gt;
    /// end outcome=&lt;结局&gt; reason=&lt;失败原因&gt; score=&lt;累计分&gt; steps=&lt;步数&gt;
    /// state
    /// &lt;终局的存档快照原文,多行,文末一个换行&gt;
    /// </code>
    /// 多局首尾相接;快照的行以空白或花括号开头,不会被认成 <c>game</c> 行。
    /// </summary>
    public sealed class TraceWriter
    {
        private readonly StringBuilder _sb;

        public TraceWriter()
        {
            _sb = new StringBuilder();
        }

        /// <summary>接着已有的轨迹写:存读续跑那一路从存档点的轨迹前缀往下写。</summary>
        public TraceWriter(string prefix)
        {
            _sb = new StringBuilder(prefix);
        }

        public void Game(string seed, string policy) => Line(Invariant($"game seed={seed} policy={policy}"));

        public void Start(StepResult result)
        {
            Line("start");
            Events(result);
        }

        public void Step(SimMove move, StepResult result)
        {
            Line(move.Kind == StepKind.Place
                ? Invariant($"step {result.Step} place inst={move.InstanceId} rot={move.Rot} r={move.Row} c={move.Col}")
                : Invariant($"step {result.Step} discard inst={move.InstanceId}"));
            Events(result);
        }

        public void End(RunState run)
        {
            BlindState b = run.Blind;
            Line(Invariant($"end outcome={b.Outcome} reason={b.FailReason} score={b.Score} steps={b.Step}"));
            Line("state");
            _sb.Append(RunSnapshot.Write(run));
        }

        public override string ToString() => _sb.ToString();

        /// <summary>
        /// 一个事件一行:类型名,再按成员名的 ordinal 序逐个 <c>名=值</c>(<c>GetProperties</c> 的返回次序没有保证)。
        /// 成员只认 int、long、bool、枚举名和有序 int 列表 <c>[a,b,…]</c>,这是 20 号票锁住的事件形状;
        /// 别的一律抛,无序容器尤其不许进事件。
        /// </summary>
        public static string FormatEvent(RuleEvent e)
        {
            Type type = e.GetType();
            var sb = new StringBuilder(type.Name);
            PropertyInfo[] props = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            Array.Sort(props, (x, y) => string.CompareOrdinal(x.Name, y.Name));
            foreach (PropertyInfo p in props)
            {
                sb.Append(' ').Append(p.Name).Append('=').Append(FormatValue(p.GetValue(e), type.Name + "." + p.Name));
            }
            return sb.ToString();
        }

        private static string FormatValue(object v, string member)
        {
            switch (v)
            {
                case int i: return i.ToString(CultureInfo.InvariantCulture);
                case long l: return l.ToString(CultureInfo.InvariantCulture);
                case bool b: return b ? "true" : "false";
                case Enum en: return en.ToString();
                case IReadOnlyList<int> list:
                    var sb = new StringBuilder("[");
                    for (int k = 0; k < list.Count; k++)
                    {
                        if (k > 0) sb.Append(',');
                        sb.Append(list[k].ToString(CultureInfo.InvariantCulture));
                    }
                    return sb.Append(']').ToString();
                default:
                    throw new NotSupportedException(Invariant($"{member}: 事件成员只许 int、long、bool、枚举、有序 int 列表,遇到 {v?.GetType().FullName ?? "null"}"));
            }
        }

        private void Events(StepResult result)
        {
            foreach (RuleEvent e in result.Events) _sb.Append("  ").Append(FormatEvent(e)).Append('\n');
        }

        private void Line(string text) => _sb.Append(text).Append('\n');
    }
}
