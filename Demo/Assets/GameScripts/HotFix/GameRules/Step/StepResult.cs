using System;
using System.Collections.Generic;

namespace GameRules
{
    public enum StepKind
    {
        Place = 0,
        Discard = 1,
    }

    /// <summary>命令被拒的原因;被拒时状态一点不改,调用方据此弹回。</summary>
    public enum StepReject
    {
        None = 0,

        /// <summary>块不在待放置区。</summary>
        NotInTray = 1,

        /// <summary>落点放不下:越界、压块、压死格,或 rot 不在 0..3。</summary>
        CannotPlace = 2,

        /// <summary>弃置次数用完了。</summary>
        NoDiscards = 3,

        /// <summary>没有进行中的盲注:结局已定,或还没开盲注。</summary>
        BlindOver = 4,
    }

    /// <summary>
    /// 一个命令的结果(07 号票 §3):规则核心在这次调用里把状态推进到下一个稳定状态,事件按发生次序给出。
    /// 存档、跑局、试走都只看返回之后的状态,步内没有可观察的中间态。
    /// </summary>
    public sealed class StepResult
    {
        private static readonly IReadOnlyList<RuleEvent> NoEvents = Array.AsReadOnly(new RuleEvent[0]);

        /// <summary>这一步之后的步数;被拒时不变。开盲注不算步,为 0。</summary>
        public int Step { get; }

        public StepReject Reject { get; }

        /// <summary>按发生次序;被拒时为空。落子、弃置的最后一个是 <see cref="StepEnded"/>。</summary>
        public IReadOnlyList<RuleEvent> Events { get; }

        public bool Accepted => Reject == StepReject.None;

        internal StepResult(int step, List<RuleEvent> events)
        {
            Step = step;
            Reject = StepReject.None;
            Events = events.AsReadOnly();
        }

        internal StepResult(int step, StepReject reject)
        {
            Step = step;
            Reject = reject;
            Events = NoEvents;
        }
    }
}
