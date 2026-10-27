using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 钩子拿到的上下文:由管线填、效果只读。一步里复用同一个对象,效果不许留着它。
    /// <para>谁被问、什么次序(07 号票 §2、§5):</para>
    /// <list type="bullet">
    /// <item>重触发、每格:当前格所属块的强化 → 它的版本 → 基因从左到右。</item>
    /// <item>基因段:基因从左到右。</item>
    /// <item>结算前、结算后:这次有格被消的块,按被消格顺序里第一次出现的次序,各问强化、版本;然后基因从左到右。</item>
    /// <item>步收尾:基因从左到右。</item>
    /// </list>
    /// 强化、版本为 None,或注册表里没有对应效果的,不问。
    /// </summary>
    public sealed class EffectContext
    {
        private static readonly IReadOnlyList<int> NoCells = Array.AsReadOnly(new int[0]);

        internal EffectContext(IRunView run, StepKind step)
        {
            Run = run;
            Step = step;
            Rows = Cols = Cells = Owners = NoCells;
            Cell = -1;
        }

        /// <summary>局与盲注的只读视图。</summary>
        public IRunView Run { get; }

        /// <summary>这一步是落子还是弃置。</summary>
        public StepKind Step { get; }

        /// <summary>这一步有没有消除。没有时 Type、各列表、三区都没有意义,只会走到步收尾。</summary>
        public bool HasClear { get; internal set; }

        public ClearType Type { get; internal set; }

        /// <summary>满行、满列,升序。</summary>
        public IReadOnlyList<int> Rows { get; internal set; }

        public IReadOnlyList<int> Cols { get; internal set; }

        /// <summary>被消格,按 07 §1 的结算次序;交叉格只出现一次。</summary>
        public IReadOnlyList<int> Cells { get; internal set; }

        /// <summary>与 <see cref="Cells"/> 逐项对应的所属块 id(清格之前的)。</summary>
        public IReadOnlyList<int> Owners { get; internal set; }

        /// <summary>当前被问的是谁。</summary>
        public EffectSource Source { get; internal set; }

        /// <summary>强化、版本是枚举值;基因是槽位(从左数,0 起)。</summary>
        public int SourceIndex { get; internal set; }

        /// <summary>逐格段里是当前格所属的块;结算前、结算后问强化、版本时是那一块;其余为 null。</summary>
        public BlockInstance Block { get; internal set; }

        /// <summary>当前格(row*8 + col),不在逐格段时为 -1。</summary>
        public int Cell { get; internal set; }

        /// <summary>当前格第几遍:0 是本遍,1 起是重触发。</summary>
        public int Repetition { get; internal set; }

        /// <summary>三区到这里为止的累计值。结算后是入账时的值。</summary>
        public long Chips { get; internal set; }

        public long Mult { get; internal set; }

        public long XMultPermille { get; internal set; }

        /// <summary>这次的得分,结算后才有。</summary>
        public long Gain { get; internal set; }
    }
}
