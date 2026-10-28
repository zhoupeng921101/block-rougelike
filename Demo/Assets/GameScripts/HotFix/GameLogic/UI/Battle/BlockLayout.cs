using GameRules;
using UnityEngine;

/// <summary>
/// 战斗界面 Part 代码用的布局常量,设计分辨率 1920×1080(UIRoot 按高匹配)。各区坐标与锚点以 13 号票的布局表为准,摆在战斗窗 prefab 上,不在这里。
/// 方块颜色是占位色块,正式美术不在本图。
/// </summary>
public static class BlockLayout
{
    // 盘面尺寸取自 BinaryBoard:写独立字面量就和棋盘核心没有编译期绑定,改盘面尺寸时容易只改一边。
    public const int BoardSize = BinaryBoard.RowCount;

    /// <summary>格距。盘面层 prefab 按 8 × 它摆成 640×640;运行时格距一律经 <see cref="BoardGeometry"/> 按 rect 现算,这里只供核对。</summary>
    public const float CellSize = 80f;

    /// <summary>格与格之间的缝:单格视觉边长 = 格距 − 它。格底、盘上方块、虚影共用。</summary>
    public const float BoardCellGap = 4f;

    // 待放置区:槽 150×160,槽间 20,中心 x = 960;按 5 槽留位(13 号票)。
    public const float SlotWidth = 150f;
    public const float SlotHeight = 160f;
    public const float SlotGap = 20f;

    /// <summary>槽内格距:13 号票线框取槽短边 ÷ 5.2 向下取整。竖放的 I 高 4 × 28 = 112,装得进 160 高的槽。</summary>
    public const float SlotCell = 28f;

    /// <summary>槽内格的缝。</summary>
    public const float SlotCellGap = 3f;

    /// <summary>落点虚影的不透明度。</summary>
    public const float GhostAlpha = 0.42f;

    // ── 拖拽(12 号票):块心贴着指针,无拇指偏移、位移倍率 1.0,故这两项不设常量 ──

    /// <summary>起拖阈值(设计像素):按下后移动越过它才拾起,没越过算原地单击(转朝向)。触屏是 20,鼠标抖动小,取 10。调手感时改它。</summary>
    public const float SlotTapMaxMove = 10f;

    /// <summary>落点吸附半径(格):精确格放不下时,在周围这么多格内找最近的可放格(block-client 原样)。</summary>
    public const int SnapRadius = 1;

    /// <summary>向上吸附不吸进最底这几行:托盘在盘下方,从下往上拖时不该被吸到底边上(block-client 原样)。</summary>
    public const int SnapNoUpBottomRows = 2;

    /// <summary>托盘槽悬停时上浮的距离(13 号票)。</summary>
    public const float SlotHoverLift = 6f;

    /// <summary>预览徽章底边离手上那块顶边的距离(13 号票)。</summary>
    public const float BadgeGap = 10f;

    /// <summary>消除预览:将被消的行列上盖一层半透明填充,外加一条呼吸的光带。</summary>
    public static readonly Color ClearPreviewFillColor = new Color32(0x5e, 0xe7, 0xff, 0x2e);

    public static readonly Color ClearPreviewGlowColor = new Color32(0x5e, 0xe7, 0xff, 0x80);

    /// <summary>七种骨牌的占位色,下标 = (int)<see cref="TetrominoKind"/>。取自 13 号票线框。</summary>
    private static readonly Color[] KindColors =
    {
        new Color32(0x46, 0xcd, 0xe6, 0xFF), // I
        new Color32(0xf0, 0xc6, 0x3f, 0xFF), // O
        new Color32(0xa4, 0x6b, 0xff, 0xFF), // T
        new Color32(0x46, 0xd0, 0x6d, 0xFF), // S
        new Color32(0xf0, 0x52, 0x52, 0xFF), // Z
        new Color32(0x3b, 0x78, 0xff, 0xFF), // J
        new Color32(0xff, 0x98, 0x3a, 0xFF), // L
    };

    /// <summary>死格的颜色。本图没有死格的来源,规则核心留着钩子(05 号票)。</summary>
    public static readonly Color DeadCellColor = new Color32(0x05, 0x07, 0x0d, 0xFF);

    public static Color ColorOf(TetrominoKind kind)
    {
        int k = (int)kind;
        return k >= 0 && k < KindColors.Length ? KindColors[k] : Color.white;
    }

    // 置灰(这块怎么转都放不下):去色、压暗、半透明,点数变淡。不加文字(13 号票)。
    private const float GreyBrightness = 0.6f;
    private const float GreyAlpha = 0.55f;
    public const float GreyPointsAlpha = 0.45f;

    public static Color Greyed(Color c)
    {
        float g = c.grayscale * GreyBrightness;
        return new Color(g, g, g, c.a * GreyAlpha);
    }
}
