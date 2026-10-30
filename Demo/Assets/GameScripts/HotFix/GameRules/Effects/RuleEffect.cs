using System;

namespace GameRules
{
    /// <summary>效果的来源种类,也是 <see cref="EffectRegistry"/> 查表键的一半。</summary>
    public enum EffectSource
    {
        /// <summary>块的强化;id = (int)<see cref="GameRules.Enhancement"/>。</summary>
        Enhancement = 0,

        /// <summary>块的版本;id = (int)<see cref="GameRules.Edition"/>。</summary>
        Edition = 1,

        /// <summary>基因;id = <see cref="GeneSlot.GeneId"/>。</summary>
        Gene = 2,
    }

    /// <summary>
    /// 钩子返回的一项效果:+底分、+倍率、×倍率,倍率两项都是千分值(+0.5 倍率 = 500)。
    /// 管线按这个字段序结算:先加底分、再加倍率、最后当场乘入倍率(规则 §3.1)。
    /// 乘项存的是相对 ×1 的偏移,所以 <c>default</c> 就是「无效果」,不会误乘 ×0。
    /// </summary>
    public readonly struct EffectDelta
    {
        public static readonly EffectDelta None = default;

        private readonly long _xMultOffset;

        public long AddChips { get; }

        /// <summary>+倍率的千分值,1000 = +1。</summary>
        public long AddMultPermille { get; }

        /// <summary>1000 = ×1。≥ 0。</summary>
        public long XMultPermille => _xMultOffset + ScoreMath.PermilleOne;

        public EffectDelta(long addChips, long addMultPermille, long xMultPermille)
        {
            if (xMultPermille < 0) throw new ArgumentOutOfRangeException(nameof(xMultPermille), xMultPermille, "倍率的乘项须 ≥ 0");
            AddChips = addChips;
            AddMultPermille = addMultPermille;
            _xMultOffset = xMultPermille - ScoreMath.PermilleOne;
        }

        public bool IsEmpty => AddChips == 0 && AddMultPermille == 0 && _xMultOffset == 0;

        public static EffectDelta Chips(long n) => new EffectDelta(n, 0, ScoreMath.PermilleOne);

        /// <summary>+n 倍率(整数)。</summary>
        public static EffectDelta Mult(long n) => new EffectDelta(0, ScoreMath.ToPermille(n), ScoreMath.PermilleOne);

        /// <summary>+倍率,千分值:500 = +0.5。</summary>
        public static EffectDelta MultPermille(long permille) => new EffectDelta(0, permille, ScoreMath.PermilleOne);

        public static EffectDelta XMult(long permille) => new EffectDelta(0, 0, permille);
    }

    /// <summary>
    /// 效果的抽象基类,六个挂点各一个空虚方法(07 号票 §5)。不用接口默认实现:Unity 的 Mono 与以后 HybridCLR 的解释器是否都支持没核过。
    /// <b>效果对象无状态</b>:计数、成长值挂在局状态里(基因的挂在 <see cref="GeneSlot"/> 上),否则 Clone 与存档带不上、两局之间会串状态。
    /// 钩子只返回数据,事件由管线吐;要随机经 <see cref="EffectContext.Run"/> 的 RngStreams 取,一个效果定义一个键。
    /// 谁在哪个挂点被问、按什么次序,见 <see cref="EffectContext"/>。
    /// </summary>
    public abstract class RuleEffect
    {
        /// <summary>
        /// 基因的代价「本盲注目标分 +X%」(规则 §4.1),千分值:200 = +20%。只作用于拿到之后的第一个盲注,
        /// 拿到时记在 <see cref="GeneSlot.CostPending"/> 上(效果系统 §6)。不是基因、或没有这种代价的为 0。
        /// </summary>
        public virtual int CostTargetPermille => 0;

        /// <summary>
        /// 持有期间每个盲注弃置次数的修正(B 类,效果系统 §3.2):代价的「弃置 −1」是 -1,加弃置的效果是正数。
        /// 开盲注时叠在难度、券、标签之上,结果不低于 0。
        /// </summary>
        public virtual int DiscardDelta => 0;

        /// <summary>持有期间每组块数的修正(B 类),叠在默认与券之上,结果截在 1..<see cref="BlindSpec.MaxGroupSize"/>。</summary>
        public virtual int GroupSizeDelta => 0;

        /// <summary>代价「每个盲注开始时,网格随机 N 格变死格」的 N(效果系统 §6 的 C 类代价),在盲注开始挂点之前标。</summary>
        public virtual int DeadCellsPerBlind => 0;

        /// <summary>盲注开始(效果系统 §4.2):首领生效、代价的死格标完之后,发第一组之前。不能加分。</summary>
        public virtual void OnBlindStart(EffectContext ctx)
        {
        }

        /// <summary>盲注结束:只在打赢、通关奖励与利息入账之后走(打输整局就结束了)。不能加分。</summary>
        public virtual void OnBlindEnd(EffectContext ctx)
        {
        }

        /// <summary>结算前(段 #6):定类型后、读底注前。</summary>
        public virtual void BeforeScoring(EffectContext ctx)
        {
        }

        /// <summary>重触发(段 #8,每格开始):这一格要额外再走几遍,≥ 0。</summary>
        public virtual int Repetitions(EffectContext ctx) => 0;

        /// <summary>每格(段 #8,每格每遍)。</summary>
        public virtual EffectDelta OnCell(EffectContext ctx) => EffectDelta.None;

        /// <summary>基因段(段 #9),只问基因。</summary>
        public virtual EffectDelta OnGene(EffectContext ctx) => EffectDelta.None;

        /// <summary>结算后(段 #12):入账、清格之后。不能再改这次的得分。</summary>
        public virtual void AfterScoring(EffectContext ctx)
        {
        }

        /// <summary>步收尾(段 #13):每一步都走,落子不论消没消,弃置也走。不能加分。</summary>
        public virtual void OnStepEnd(EffectContext ctx)
        {
        }
    }
}
