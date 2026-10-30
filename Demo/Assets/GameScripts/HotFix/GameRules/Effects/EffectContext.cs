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
    /// <item>步收尾、盲注开始、盲注结束:基因从左到右。</item>
    /// </list>
    /// 强化、版本为 None,或注册表里没有对应效果的,不问。
    /// <para>
    /// 状态变更(效果系统 §3.4 的 D 类)只经这里的方法:给钱、碎块、改自身计数、掷概率。管线照调用改状态、记事件;
    /// 结算后、步收尾、盲注结束能给钱,结算后能碎块,结算前、结算后、步收尾、盲注开始、盲注结束能改计数,其余挂点调用抛异常。
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
            Rows = Cols = Cells = Owners = PlacedCells = NoCells;
            Cell = -1;
        }

        /// <summary>局与盲注的只读视图。</summary>
        public IRunView Run { get; }

        /// <summary>这一步是落子还是弃置;盲注开始、盲注结束两个挂点里没有意义。</summary>
        public StepKind Step { get; }

        /// <summary>这一步放下的那块(规则里「放下的那块」);弃置、盲注开始与结束时为 null。</summary>
        public BlockInstance Placed { get; internal set; }

        /// <summary>放下的那块落在哪几格,升序;没有放下时为空。</summary>
        public IReadOnlyList<int> PlacedCells { get; internal set; }

        /// <summary>持有的钱。</summary>
        public int Money => _state.Money;

        /// <summary>开局方块库的块数(默认库的大小),「比开局多 / 少」按它比。</summary>
        public int StartingLibrarySize => _state.Config.DefaultLibrary.Count;

        /// <summary>基因栏第 slot 格现在卖得多少钱。</summary>
        public int GeneSellPrice(int slot)
        {
            GeneSlot g = _state.Genes[slot];
            return _state.SellPriceOf(g);
        }

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

        /// <summary>局状态内部口:效果做盘面外的状态变更(加块、删块、升级类型)时用,同程序集可见。</summary>
        internal RunState State => _state;

        // ── 结算外挂点带的数据(哪个挂点填哪些,见各字段注释) ──

        /// <summary>用掉/卖掉/开掉的种类与号:<see cref="EffectHook.ConsumableUsed"/>、<see cref="EffectHook.Sold"/> 用。</summary>
        public ItemKind ItemKind { get; internal set; }

        public int ItemId { get; internal set; }

        /// <summary>卖掉的是当前正在被问的这张基因自己(摔跤)。</summary>
        public bool SoldSelf { get; internal set; }

        /// <summary>卖掉的那张基因原来的槽位;-1 = 不是基因。</summary>
        public int SoldSlot { get; internal set; } = -1;

        /// <summary>开掉的补给包号(<see cref="EffectHook.BoosterOpened"/>)。</summary>
        public int BoosterId { get; internal set; }

        /// <summary>跳过的节点号(<see cref="EffectHook.Skipped"/>)。</summary>
        public int SkippedNode { get; internal set; }

        /// <summary>这一步弃掉的那块(<see cref="EffectHook.StepEnd"/> 且 <see cref="Step"/> 是弃置时);没弃为 -1。</summary>
        public int Discarded { get; internal set; } = -1;

        /// <summary>这一步放下的那块包围盒左上角(远投基因读);没落子为 -1。</summary>
        public int PlacedRow { get; internal set; } = -1;

        public int PlacedCol { get; internal set; } = -1;

        /// <summary>上一次落点(远投基因读);本局还没落过为 -1。</summary>
        public int LastPlacedRow { get; internal set; } = -1;

        public int LastPlacedCol { get; internal set; } = -1;

        /// <summary>免死已经救回这一场(<see cref="EffectHook.BlindFailed"/> 里调 <see cref="RescueBlind"/>)。</summary>
        public bool Rescued { get; private set; }

        /// <summary>正在代行别的基因(复制类,效果系统 §5.1):代行时只出效果、不改自己的计数。</summary>
        public bool Acting { get; internal set; }

        /// <summary>把这次判负改成通关(免死)。只在盲注失败挂点可用;随后由管线湮灭调它的那张基因。</summary>
        public void RescueBlind()
        {
            Require(Hook == EffectHook.BlindFailed, nameof(RescueBlind));
            Rescued = true;
        }

        /// <summary>往道具栏放一件消耗品(星辰、预备这类生成件);栏满返回 false。只在结算外挂点可用。</summary>
        public bool GrantConsumable(ItemKind kind, int id)
        {
            Require(IsOutsideScoring, nameof(GrantConsumable));
            return _state.TryAddConsumable(new ConsumableItem(kind, id));
        }

        /// <summary>结算外的挂点(结算后、步收尾、盲注开始/结束、用消耗品、开包、刷新、卖出、跳过、盲注失败)。</summary>
        private bool IsOutsideScoring =>
            Hook == EffectHook.After || Hook == EffectHook.StepEnd || Hook == EffectHook.BlindStart ||
            Hook == EffectHook.BlindEnd || Hook == EffectHook.BlindFailed || Hook == EffectHook.ConsumableUsed ||
            Hook == EffectHook.BoosterOpened || Hook == EffectHook.ShopReroll || Hook == EffectHook.Sold ||
            Hook == EffectHook.Skipped;

        /// <summary>结算后挂点里被碎掉的块,等这一段问完再统一湮灭(问的途中不改被问的那批块)。</summary>
        internal List<int> Shattered { get; } = new List<int>();

        /// <summary>给钱(金箔方块、经济类基因)。结算后、步收尾、盲注结束、用消耗品之后、开包之后、卖出之后、跳过之后可用。</summary>
        public void GainMoney(int amount)
        {
            Require(Hook == EffectHook.After || Hook == EffectHook.StepEnd || Hook == EffectHook.BlindEnd ||
                    Hook == EffectHook.ConsumableUsed || Hook == EffectHook.BoosterOpened || Hook == EffectHook.Sold ||
                    Hook == EffectHook.Skipped, nameof(GainMoney));
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

        /// <summary>改当前基因的成长计数,结果截到 ≥ 0。结算前、结算后、步收尾与各结算外挂点可用。</summary>
        public void AddCounter(int delta)
        {
            if (Acting) return;
            Require(Hook == EffectHook.Before || IsOutsideScoring, nameof(AddCounter));
            GeneSlot gene = Gene ?? throw new InvalidOperationException("只有基因有成长计数");
            long next = Math.Max(0L, (long)gene.Counter + delta);
            gene.Counter = next > int.MaxValue ? int.MaxValue : (int)next;
        }

        /// <summary>
        /// 掷一次 num/den 的概率,取本盲注的效果流(<see cref="RngKeys.Effect"/>)。只在结算前、结算后、步收尾与盲注开始、结束:
        /// 逐格段与基因段不许掷,否则拖动预览就和真落子对不上(预览不跑钩子)。
        /// </summary>
        public bool Chance(int num, int den)
        {
            Require(Hook == EffectHook.Before || IsOutsideScoring, nameof(Chance));
            BlindSpec spec = _state.Blind.Spec;
            return _state.Rng.Get(RngKeys.Effect(spec.Segment, spec.Layer)).Chance(num, den);
        }

        private bool IsBlindHook => Hook == EffectHook.BlindStart || Hook == EffectHook.BlindEnd;

        private void Require(bool allowed, string what)
        {
            if (!allowed) throw new InvalidOperationException(what + " 不能在 " + Hook + " 挂点调用(效果系统 §3.4、§4.1)");
        }
    }

    /// <summary>管线现在问到哪个挂点(效果系统 §4.1、§4.2)。</summary>
    internal enum EffectHook
    {
        Before = 0,
        Repetition = 1,
        Cell = 2,
        Gene = 3,
        After = 4,
        StepEnd = 5,
        BlindStart = 6,
        BlindEnd = 7,
        BlindFailed = 8,
        ConsumableUsed = 9,
        BoosterOpened = 10,
        ShopReroll = 11,
        Sold = 12,
        Skipped = 13,
    }
}
