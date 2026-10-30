using System;
using GameRules;
using UnityEngine;

/// <summary>
/// 战斗演出用到的特效素材(32 号票),由战斗窗序列化持有、随窗 prefab 进包。现在挂的全是动物乐园搬来的占位,
/// 放在 <c>Assets/AssetRaw/Effects/ZooPlaceholder/</c>,逐件登记在那里的 <c>占位登记表.md</c>;阶段 6 换素材只改这里的引用。
/// 动画名与内容宽在 <see cref="BattleFxNames"/>。
/// </summary>
[Serializable]
public sealed class BattleFxAssets
{
    [Header("骨骼与 Spine")]
    [Tooltip("消行光束的白色横光带(按骨牌色染,见 ClearBeamFx)")]
    public Sprite ClearBeam;

    [Tooltip("彩虹消行光束:同一构图的多色光带,Excellent 档起替代普通光束")]
    public Sprite ClearBeamRainbow;

    [Tooltip("清屏整盘特效 db_CC,与 db_FHQP 轮播")]
    public GameObject BoardClearA;

    [Tooltip("清屏整盘特效 db_FHQP,与 db_CC 轮播")]
    public GameObject BoardClearB;

    [Tooltip("开盲注盘面点亮:代码现摆的 8×8 格,用柔光团当格心(见 BoardOpenFx)")]
    public Sprite BoardOpenGlow;

    [Tooltip("「继续」进战斗窗的扫描线横光带(已换成自绘图,见 BoardSweepFx)")]
    public Sprite BoardSweepBand;

    [Tooltip("飞分落到累计分的星环 sp_landring(Spine)")]
    public GameObject LandRing;

    [Header("粒子")]
    [Tooltip("逐格退场的碎块与清屏庆祝波 ClearBurstFx")]
    public GameObject ClearBurst;

    [Tooltip("落子每格的光点 PlaceBurstFx")]
    public GameObject PlaceBurst;

    [Header("图")]
    [Tooltip("柔光团 boardfx_glow_soft:评价字的底光、方块雨的光尾")]
    public Sprite GlowSoft;

    [Tooltip("评价字旁的星光 tier_star")]
    public Sprite TierStar;

    [Tooltip("评价字 16 张,按「(档 − 1) × 4 + 色」排:档 Good / Great / Excellent / Unbelievable,色 蓝 / 绿 / 橙 / 紫")]
    public Sprite[] TierWords;

    [Tooltip("得分数字 11 张:0–9 与「+」")]
    public Sprite[] Digits;
}

/// <summary>
/// <see cref="BattleFxAssets"/> 里骨骼与 Spine 素材的动画名、内容宽(取自各自 <c>_ske.json</c> / 动物乐园名表,逐字一致;拼错的表现是不播特效、只记一条 Warning)。
/// 消行光束与评价字的颜色取「这一步落下那块的种类色」(31 号票第 4 节)。
/// </summary>
public static class BattleFxNames
{
    public const string BoardClearAAnim = "qingchang";

    public const string BoardClearBAnim = "fuhuoqipan";

    /// <summary>星环唯一的动画(约 1.33 秒,前半程即成形)。</summary>
    public const string LandRingAnim = "idle";

    /// <summary>星环扩到最大时的骨架像素外径。</summary>
    public const float LandRingContentWidth = 256f;
}
