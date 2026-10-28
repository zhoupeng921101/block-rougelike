using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 托盘的一个槽(AssetRaw/UI/Prefabs/Parts/TraySlot.prefab 的根,由 <see cref="TrayAreaPart"/> 按槽数建)。
/// 槽底是 m_img_Fill,槽框是它上面的 Outline;块的格子挂在 <see cref="PieceRoot"/> 下,点数标签挂在槽根上。
/// 根上是透明的 Image,整槽都是命中区,拖拽(29 号票)从这里拾起。
/// </summary>
public sealed class TraySlotPart : MonoBehaviour
{
    [SerializeField] private Image m_img_Fill = null!;
    [SerializeField] private RectTransform m_rect_Piece = null!;

    [Tooltip("槽框:m_img_Fill 上的 Outline。")]
    [SerializeField] private Outline _frame;

    [Header("空槽(块已放下或弃掉,这一组还没发完)")]
    [Tooltip("空槽的框色;常态框色取 prefab 上 Outline 的颜色。")]
    [SerializeField] private Color _emptyFrameColor = new Color32(0x2f, 0x3d, 0x6b, 0x99);
    [Tooltip("空槽的底色,取战斗窗背景色:Outline 是把底图错位重画四份,底一透明,四份就把整槽涂满,所以底要不透明。")]
    [SerializeField] private Color _emptyFillColor = new Color32(0x0a, 0x0f, 0x1f, 0xFF);

    /// <summary>自身矩阵位置（Part 是裸 MonoBehaviour，无框架基类可提供该便捷属性）。</summary>
    public RectTransform rectTransform => (RectTransform)transform;

    /// <summary>块的视觉根:与槽同心,尺寸由托盘按块的外轮廓设,旋转动画绕它的中心转。</summary>
    public RectTransform PieceRoot => m_rect_Piece;

    [Header("悬停(指针停在有块的槽上)")]
    [Tooltip("悬停时的框色。")]
    [SerializeField] private Color _hoverFrameColor = new Color32(0x8b, 0xa4, 0xff, 0xFF);

    private Color _fillColor;
    private Color _frameColor;
    private bool _baseKnown;
    private bool _hover;

    /// <summary>空槽只留暗框、底与背景同色(13 号票的空槽是虚线框,本图没有虚线图,用暗框代)。</summary>
    public void SetEmpty(bool empty)
    {
        KnowBase();
        m_img_Fill.color = empty ? _emptyFillColor : _fillColor;
        _frame.effectColor = empty ? _emptyFrameColor : _frameColor;
        m_rect_Piece.gameObject.SetActive(!empty);
    }

    /// <summary>块在手上:画成空槽,块的视觉根不动(它已被拖拽流挪走)。</summary>
    public void SetHeld()
    {
        SetHover(false);
        KnowBase();
        m_img_Fill.color = _emptyFillColor;
        _frame.effectColor = _emptyFrameColor;
    }

    /// <summary>
    /// 悬停态:框变亮,槽里的东西(槽底、块、点数)整体上浮 <see cref="BlockLayout.SlotHoverLift"/>。
    /// 根是命中区,留在原处不动:跟着浮上去的话,指针停在槽底边那几像素时会出了又进、来回闪。
    /// </summary>
    public void SetHover(bool on)
    {
        if (on == _hover) return;
        _hover = on;
        KnowBase();
        _frame.effectColor = on ? _hoverFrameColor : _frameColor;
        var lift = new Vector2(0f, on ? BlockLayout.SlotHoverLift : -BlockLayout.SlotHoverLift);
        foreach (Transform child in transform) ((RectTransform)child).anchoredPosition += lift;
    }

    private void KnowBase()
    {
        if (_baseKnown) return;
        _fillColor = m_img_Fill.color;
        _frameColor = _frame.effectColor;
        _baseKnown = true;
    }
}
