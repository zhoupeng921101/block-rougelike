/// <summary>
/// 战斗演出的时长表(秒)。占位,出自 21 号票第 10 节,调手感时整体替换。不进 Luban、不进规则核心,事件里也不带。
/// 用到时一律除以 <see cref="Speed"/>;从 block-client 移植的件原来「÷ FxPace.Speed」的时长都改从这里取。
/// </summary>
public static class ClearPacing
{
    /// <summary>落子各格放大(不占锁)。</summary>
    public const float PlacePunch = 0.30f;

    /// <summary>落子到第 1 拍。</summary>
    public const float ClearLead = 0.15f;

    /// <summary>相邻两拍的间隔。</summary>
    public const float CellStep = 0.06f;

    /// <summary>换线时多停的时间。</summary>
    public const float LineGap = 0.06f;

    /// <summary>逐格段上限,超出就把 CellStep 与 LineGap 等比压缩。</summary>
    public const float CellSegmentMax = 1.00f;

    /// <summary>「+k」弹出(叠放,不占时间)。</summary>
    public const float CellPop = 0.15f;

    /// <summary>「+k」停留(叠放,不占时间)。</summary>
    public const float CellHold = 0.25f;

    /// <summary>格缩没退场(缩到一半并淡出)。</summary>
    public const float CellExit = 0.10f;

    /// <summary>计数框数字弹一下。</summary>
    public const float TallyBump = 0.08f;

    /// <summary>最后一拍到合成。</summary>
    public const float TallyHold = 0.15f;

    /// <summary>底分 × 倍率并成得分。</summary>
    public const float Merge = 0.20f;

    /// <summary>得分直线飞进累计分。</summary>
    public const float FlyToTotal = 0.25f;

    /// <summary>累计分滚动、进度条增长。</summary>
    public const float TotalRoll = 0.30f;

    /// <summary>新组弹出(不占锁)。</summary>
    public const float GroupPopIn = 0.20f;

    /// <summary>块缩进弃置区(不占锁)。</summary>
    public const float DiscardShrink = 0.20f;

    /// <summary>最后一拍演完到结果浮层。</summary>
    public const float ResultDelay = 0.40f;

    /// <summary>全局倍率,所有时长除以它。是静态字段不是 const:阶段 5 的速度档写这一个值。不用 DOTween.timeScale,那会连开关窗动画一起变。</summary>
    public static float Speed = 1f;
}
