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
    [Tooltip("消行光束 db_xc:一条线一发,7 色动画对 7 种骨牌")]
    public GameObject ClearLine;

    [Tooltip("彩虹消行光束 db_clearRainbow:Excellent 档起替代 db_xc")]
    public GameObject ClearLineRainbow;

    [Tooltip("清屏整盘特效 db_CC,与 db_FHQP 轮播")]
    public GameObject BoardClearA;

    [Tooltip("清屏整盘特效 db_FHQP,与 db_CC 轮播")]
    public GameObject BoardClearB;

    [Tooltip("开盲注盘面点亮 db_boardOpen")]
    public GameObject BoardOpen;

    [Tooltip("「继续」进战斗窗的扫描线 db_FHQPD")]
    public GameObject BoardSweep;

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
    /// <summary>七种骨牌 → db_xc 的颜色动画,下标 = (int)<see cref="TetrominoKind"/>,与 <see cref="BlockLayout.ColorOf"/> 的占位色对应(I 青取浅蓝)。</summary>
    private static readonly string[] ClearLineAnims = { "wathetblue", "yellow", "purple", "green", "red", "blue", "orange" };

    public static string ClearLineAnimOf(TetrominoKind kind)
    {
        int k = (int)kind;
        return k >= 0 && k < ClearLineAnims.Length ? ClearLineAnims[k] : "wathetblue";
    }

    public const string ClearLineRainbowAnim = "colour_elimination_A";

    public const string BoardClearAAnim = "qingchang";

    public const string BoardClearBAnim = "fuhuoqipan";

    /// <summary>开局点亮:整盘 8×8 格按对角线依次点亮再熄灭,a / b 两套走向各 7 色,每次开盲注轮下一个。</summary>
    private static readonly string[] BoardOpenAnims =
    {
        "in_a_1", "in_a_2", "in_a_3", "in_a_4", "in_a_5", "in_a_6", "in_a_7",
        "in_b_1", "in_b_2", "in_b_3", "in_b_4", "in_b_5", "in_b_6", "in_b_7",
    };

    public static int BoardOpenAnimCount => BoardOpenAnims.Length;

    /// <summary>取第 <paramref name="idx"/> 个开局点亮动画;取模轮回。</summary>
    public static string BoardOpenAnimAt(int idx)
    {
        int i = idx % BoardOpenAnims.Length;
        if (i < 0) i += BoardOpenAnims.Length;
        return BoardOpenAnims[i];
    }

    /// <summary>扫描线:光带整体淡出,约 0.75 秒。素材里没有位移轨道,扫过盘面那一段由调用方驱动;亮线在素材上方,自下而上扫。</summary>
    public const string BoardSweepAnim = "fuhuod";

    /// <summary>星环唯一的动画(约 1.33 秒,前半程即成形)。</summary>
    public const string LandRingAnim = "idle";

    /// <summary>星环扩到最大时的骨架像素外径。</summary>
    public const float LandRingContentWidth = 256f;
}
