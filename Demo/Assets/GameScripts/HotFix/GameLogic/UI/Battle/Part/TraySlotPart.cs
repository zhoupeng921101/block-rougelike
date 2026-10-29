using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 托盘的一个槽(AssetRaw/UI/Prefabs/Parts/TraySlot.prefab 的根,由 <see cref="TrayAreaPart"/> 按槽数建)。
/// 槽底是 m_img_Fill(凹槽九宫图),空槽换成虚线框 m_img_Dashed;块的格子挂在 <see cref="PieceRoot"/> 下,点数标签挂在槽根上。
/// 根上是透明的 Image,整槽都是命中区,拖拽(29 号票)从这里拾起。
/// </summary>
public sealed class TraySlotPart : MonoBehaviour
{
    [SerializeField] private Image m_img_Fill = null!;
    [SerializeField] private Image m_img_Dashed = null!;
    [SerializeField] private RectTransform m_rect_Piece = null!;

    /// <summary>自身矩阵位置（Part 是裸 MonoBehaviour，无框架基类可提供该便捷属性）。</summary>
    public RectTransform rectTransform => (RectTransform)transform;

    /// <summary>块的视觉根:与槽同心,尺寸由托盘按块的外轮廓设,旋转动画绕它的中心转。</summary>
    public RectTransform PieceRoot => m_rect_Piece;

    [Header("悬停(指针停在有块的槽上)")]
    [Tooltip("悬停时槽底换的图(亮青框);常态图取 prefab 上 m_img_Fill 的图。")]
    [SerializeField] private Sprite _hoverSprite;

    private Sprite _fillSprite;
    private bool _baseKnown;
    private bool _hover;

    /// <summary>空槽(块已放下或弃掉,这一组还没发完)只画虚线框(13 号票)。</summary>
    public void SetEmpty(bool empty)
    {
        ShowDashed(empty);
        m_rect_Piece.gameObject.SetActive(!empty);
    }

    /// <summary>块在手上:画成空槽,块的视觉根不动(它已被拖拽流挪走)。</summary>
    public void SetHeld()
    {
        SetHover(false);
        ShowDashed(true);
    }

    private void ShowDashed(bool dashed)
    {
        m_img_Fill.gameObject.SetActive(!dashed);
        m_img_Dashed.gameObject.SetActive(dashed);
    }

    /// <summary>
    /// 悬停态:槽底换亮框,槽里的东西(槽底、块、点数)整体上浮 <see cref="BlockLayout.SlotHoverLift"/>。
    /// 根是命中区,留在原处不动:跟着浮上去的话,指针停在槽底边那几像素时会出了又进、来回闪。
    /// </summary>
    public void SetHover(bool on)
    {
        if (on == _hover) return;
        _hover = on;
        KnowBase();
        m_img_Fill.sprite = on ? _hoverSprite : _fillSprite;
        var lift = new Vector2(0f, on ? BlockLayout.SlotHoverLift : -BlockLayout.SlotHoverLift);
        foreach (Transform child in transform) ((RectTransform)child).anchoredPosition += lift;
    }

    private void KnowBase()
    {
        if (_baseKnown) return;
        _fillSprite = m_img_Fill.sprite;
        _baseKnown = true;
    }
}
