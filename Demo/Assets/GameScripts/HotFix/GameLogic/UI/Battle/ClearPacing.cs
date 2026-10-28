/// <summary>
/// 战斗演出的时长表(秒)。占位,出自 21 号票第 10 节,调手感时整体替换。不进 Luban、不进规则核心,事件里也不带。
/// 演出时长用到时一律除以 <see cref="Speed"/>;从 block-client 移植的件原来「÷ FxPace.Speed」的时长都改从这里取。
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

    // ── 特效(32 号票):各件自身的动画曲线留在件里(动物乐园原值),这里只放它们挂在时间表上的时刻与震盘时长 ──

    /// <summary>开盲注点亮 / 续玩扫描线:战斗窗打开到起播(等盘面布局就绪;动物乐园原值)。不锁托盘。</summary>
    public const float OpenFx = 0.50f;

    /// <summary>震盘时长,按档(Great / Excellent / Unbelievable),在这一步最后一条线的光束起播时震。待定标。</summary>
    public const float ShakeGreat = 0.12f;

    public const float ShakeExcellent = 0.20f;

    public const float ShakeUnbelievable = 0.32f;

    /// <summary>清屏庆祝波:以落子处为圆心按曼哈顿距离一圈圈迸碎块,相邻两圈的错峰(动物乐园原值)。被消格全部退场时起第一圈。</summary>
    public const float AllClearWaveStep = 0.03f;

    /// <summary>清屏方块雨:被消格全部退场到第一颗起落(动物乐园是庆祝波后 0.05 秒)。</summary>
    public const float AllClearRain = 0.05f;

    /// <summary>清屏整盘特效(db_CC / db_FHQP 轮播):被消格全部退场到起播(动物乐园是逐格扫完后约 0.3 秒)。</summary>
    public const float AllClearBoardFx = 0.30f;

    /// <summary>转朝向后多久没再转就写档(23 号票,09 号票第 2 节的防抖)。不是演出时长,不除以 <see cref="Speed"/>。</summary>
    public const float RotationSaveDelay = 0.50f;

    /// <summary>全局倍率,所有时长除以它。是静态字段不是 const:阶段 5 的速度档写这一个值。不用 DOTween.timeScale,那会连开关窗动画一起变。</summary>
    public static float Speed = 1f;
}
