using GameRules;

/// <summary>
/// 消除类型 → 演出档位(31 号票第 3 节):评价字、震盘、光束换不换彩虹都按这一张表,不按条数。
/// 档 0 = 单线(不出字、不震);1 Good;2 Great(起震);3 Excellent(换彩虹光束);4 Unbelievable。占位映射,§3.3 的优先级定标重排时跟着重排。
/// </summary>
public static class ClearFxTiers
{
    public const int Good = 1;
    public const int Great = 2;
    public const int Excellent = 3;
    public const int Unbelievable = 4;

    public static int TierOf(ClearType type)
    {
        switch (type)
        {
            case ClearType.DoubleLine:
            case ClearType.Parallel:
            case ClearType.Cross:
                return Good;
            case ClearType.Corner:
            case ClearType.TripleLine:
                return Great;
            case ClearType.SameShape:
            case ClearType.MultiLine:
            case ClearType.SameShapeCross:
                return Excellent;
            case ClearType.FiveLine:
            case ClearType.AllClear:
                return Unbelievable;
            default:
                return 0;
        }
    }

    /// <summary>这一档的消行光束换成彩虹(db_clearRainbow)。</summary>
    public static bool RainbowBeam(int tier) => tier >= Excellent;
}
