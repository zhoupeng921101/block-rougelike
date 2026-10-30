using System;
using GameRules;
using UnityEngine;

/// <summary>
/// 战斗演出用到的特效素材(32 号票),由战斗窗序列化持有、随窗 prefab 进包。
/// 阶段 6 起特效件已全部换成自绘的图与补间(见 <c>UI/VFX/</c> 下各 Fx 类);
/// 只剩粒子 prefab 与两个着色器仍是占位,登记在 <c>Assets/AssetRaw/Effects/ZooPlaceholder/占位登记表.md</c>。
/// </summary>
[Serializable]
public sealed class BattleFxAssets
{
    [Header("骨骼与 Spine")]
    [Tooltip("消行光束的白色横光带(按骨牌色染,见 ClearBeamFx)")]
    public Sprite ClearBeam;

    [Tooltip("彩虹消行光束:同一构图的多色光带,Excellent 档起替代普通光束")]
    public Sprite ClearBeamRainbow;

    [Tooltip("开盲注盘面点亮 / 清屏整盘亮起共用的格心柔光(代码现摆,见 BoardOpenFx / BoardClearFx)")]
    public Sprite BoardOpenGlow;

    [Tooltip("「继续」进战斗窗的扫描线横光带(已换成自绘图,见 BoardSweepFx)")]
    public Sprite BoardSweepBand;

    [Tooltip("飞分落到累计分的星环(自绘星环图 + 补间,见 LandRingFx)")]
    public Sprite LandRing;

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
