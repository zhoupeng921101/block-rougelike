namespace GameRules
{
    // 以下枚举都进存档(09 号票:存档写名字)。取值写死,只追加、不改序、不改名;改名就是改存档形状。

    /// <summary>
    /// 11 种消除类型(规则 §3.3)。取值序是写下时规则表的次序,**不是判定优先级**:
    /// 优先级在定标时会按出现频率重排,由判定代码里的有序表决定,改它不动这里。
    /// </summary>
    public enum ClearType
    {
        AllClear = 0,
        FiveLine = 1,
        SameShapeCross = 2,
        MultiLine = 3,
        SameShape = 4,
        TripleLine = 5,
        Corner = 6,
        Cross = 7,
        Parallel = 8,
        DoubleLine = 9,
        SingleLine = 10,
    }

    public static class ClearTypes
    {
        /// <summary><see cref="ClearType"/> 的取值数,也是类型等级表的长度。</summary>
        public const int Count = 11;
    }

    public enum BlindOutcome
    {
        InProgress = 0,
        Won = 1,
        Lost = 2,
    }

    /// <summary>盲注失败的原因(规则 §2.4),两种互斥;胜或进行中时为 None。</summary>
    public enum FailReason
    {
        None = 0,

        /// <summary>方块库抽完,待放置区也空了,仍未达标。</summary>
        BudgetExhausted = 1,

        /// <summary>待放置区剩下的块怎么转都放不下,弃置次数也用完了。</summary>
        CannotPlace = 2,
    }
}
