using System;
using System.Collections.Generic;

namespace GameRules
{
    /// <summary>
    /// 钩子拿到的上下文:由管线填、效果只读。一步里复用同一个对象,效果不许留着它。
    /// <para>谁被问、什么次序(07 号票 §2、§5):</para>
    /// <list type="bullet">
    /// <item>重触发、每格:当前格所属块的强化 → 它的版本 → 基因从左到右。</item>
    /// <item>基因段:基因从左到右;带版本的基因,加算的版本在本体之前,×倍率的版本在本体之后(规则 §3.1)。</item>
    /// <item>结算前、结算后:这次有格被消的块,按被消格顺序里第一次出现的次序,各问强化、版本;然后基因从左到右。</item>
    /// <item>步收尾:基因从左到右。</item>
    /// </list>
    /// 强化、版本为 None,或注册表里没有对应效果的,不问。
    /// <para>
    /// 状态变更(效果系统 §3.4 的 D 类)只经这里的方法:给钱、碎块、改自身计数、掷概率。管线照调用改状态、记事件;
    /// 只有结算后与步收尾能给钱、碎块,结算前、结算后、步收尾能改计数,其余挂点调用抛异常。
    /// </para>
    /// </summary>
    public sealed class EffectContext
    {
        private static readonly IReadOnlyList<int> NoCells = Array.AsReadOnly(new int[0]);

        private readonly RunState _state;
        private readonly List<RuleEvent> _events;

        internal EffectContext(RunState run, StepKind step, List<RuleEvent> events)
        {
            _state = run;
            _events = events;
            Run = run;
            Step = step;
            Rows = Cols = Cells = Owners = NoCells;
            Cell = -1;
        }

        /// <summary>局与盲注的只读视图。</summary>
        public IRunView Run { get; }

        /// <summary>这一步是落子还是弃置。</summary>
        public StepKind Step { get; }

        /// <summary>这一步有没有消除。没有时 Type、各列表、两个累加器都没有意义,只会走到步收尾。</summary>
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

        /// <summary>两个累加器到这里为止的累计值。结算后是入账时的值。</summary>
        public long Chips { get; internal set; }

        /// <summary>倍率千分值,1000 = 1。</summary>
        public long MultPermille { get; internal set; }

        /// <summary>这次的得分,结算后才有。</summary>
        public long Gain { get; internal set; }

        /// <summary>当前被问的是基因时,它那一格;否则 null。</summary>
        public GeneSlot Gene => Source == EffectSource.Gene && SourceIndex >= 0 && SourceIndex < _state.Genes.Count ? _state.Genes[SourceIndex] : null;

        /// <summary>当前基因的成长计数;不是基因时为 0。</summary>
        public int Counter => Gene?.Counter ?? 0;

        /// <summary>现在处在哪个挂点;D 类方法据此放行。</summary>
        internal EffectHook Hook { get; set; }

        /// <summary>结算后挂点里被碎掉的块,等这一段问完再统一湮灭(问的途中不改被问的那批块)。</summary>
        internal List<int> Shattered { get; } = new List<int>();

        /// <summary>给钱(金箔方块、经济类基因)。只在结算后与步收尾。</summary>
        public void GainMoney(int amount)
        {
            Require(Hook == EffectHook.After || Hook == EffectHook.StepEnd, nameof(GainMoney));
            if (amount <= 0) return;
            _state.AddMoney(amount);
            _events.Add(new MoneyGained(Source, SourceIndex, amount, _state.Money));
        }

        /// <summary>碎掉当前这块(琉璃)。只在结算后;同一块碎一次。</summary>
        public void ShatterBlock()
        {
            Require(Hook == EffectHook.After, nameof(ShatterBlock));
            if (Block == null) throw new InvalidOperationException("现在没有被问的块");
            if (!Shattered.Contains(Block.Id)) Shattered.Add(Block.Id);
        }

        /// <summary>改当前基因的成长计数,结果截到 ≥ 0。结算前、结算后、步收尾可用。</summary>
        public void AddCounter(int delta)
        {
            Require(Hook == EffectHook.Before || Hook == EffectHook.After || Hook == EffectHook.StepEnd, nameof(AddCounter));
            GeneSlot gene = Gene ?? throw new InvalidOperationException("只有基因有成长计数");
            long next = Math.Max(0L, (long)gene.Counter + delta);
            gene.Counter = next > int.MaxValue ? int.MaxValue : (int)next;
        }

        /// <summary>
        /// 掷一次 num/den 的概率,取本盲注的效果流(<see cref="RngKeys.Effect"/>)。只在结算前、结算后、步收尾:
        /// 逐格段与基因段不许掷,否则拖动预览就和真落子对不上(预览不跑钩子)。
        /// </summary>
        public bool Chance(int num, int den)
        {
            Require(Hook == EffectHook.Before || Hook == EffectHook.After || Hook == EffectHook.StepEnd, nameof(Chance));
            BlindSpec spec = _state.Blind.Spec;
            return _state.Rng.Get(RngKeys.Effect(spec.Segment, spec.Layer)).Chance(num, den);
        }

        private void Require(bool allowed, string what)
        {
            if (!allowed) throw new InvalidOperationException(what + " 不能在 " + Hook + " 挂点调用(效果系统 §3.4、§4.1)");
        }
    }

    /// <summary>管线现在问到哪个挂点(效果系统 §4.1)。</summary>
    internal enum EffectHook
    {
        Before = 0,
        Repetition = 1,
        Cell = 2,
        Gene = 3,
        After = 4,
        StepEnd = 5,
    }
}
