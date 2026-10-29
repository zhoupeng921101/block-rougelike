using System.Globalization;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 弃置区(挂在战斗窗的 m_part_Discard 节点上),三态照 13 号票:常态显示剩余次数;块心悬在区内时底图换亮框、上沿挂一条「松手弃置 · 剩余 n → n−1」
/// (手上的块会盖住区的中部,次数得挂在外面);次数用完时去色、叠斜纹 m_img_Stripes、显示 0 和「拖进来会弹回」,悬在上面也不亮。
/// </summary>
public sealed class DiscardAreaPart : MonoBehaviour
{
    [SerializeField] private Image m_img_Bg = null!;
    [SerializeField] private Image m_img_Stripes = null!;
    [SerializeField] private TMP_Text m_tmp_Title = null!;
    [SerializeField] private TMP_Text m_tmp_Count = null!;
    [SerializeField] private TMP_Text m_tmp_Hint = null!;
    [SerializeField] private Image m_img_Drop = null!;
    [SerializeField] private TMP_Text m_tmp_Drop = null!;

    [Header("次数用完")]
    [Tooltip("次数用完时乘在底图上的颜色;常态取 prefab 上 m_img_Bg 的颜色。")]
    [SerializeField] private Color _offBgColor = new Color32(0x9a, 0x9a, 0x9a, 0xFF);
    [Tooltip("次数用完时标题与次数的颜色;常态取 prefab 上的颜色。")]
    [SerializeField] private Color _offTextColor = new Color32(0x6b, 0x72, 0x88, 0xFF);

    [Header("块心悬在区内")]
    [Tooltip("高亮时 m_img_Bg 换的图;常态图取 prefab 上的图。")]
    [SerializeField] private Sprite _hoverSprite;

    private Color _bgColor;
    private Sprite _bgSprite;
    private Color _titleColor;
    private Color _countColor;
    private bool _baseKnown;
    private int _left;

    /// <summary>这次画的是不是「次数用完」那一态。只给战斗窗的调试核对读。</summary>
    public bool IsOff { get; private set; }

    /// <summary>这次画的是不是高亮态。</summary>
    public bool IsHover { get; private set; }

    /// <summary>次数这一格的字。只给战斗窗的调试核对读。</summary>
    public string CountText => m_tmp_Count.text;

    /// <summary>次数那一格。结算演出在弃置那一拍让它弹一下。</summary>
    public RectTransform CountRect => m_tmp_Count.rectTransform;

    /// <summary>区中心的世界坐标。弃置演出把块缩进这里。</summary>
    public Vector3 CenterWorld
    {
        get
        {
            var rt = (RectTransform)transform;
            return rt.TransformPoint(rt.rect.center);
        }
    }

    /// <summary>区在屏幕上的矩形含不含这个屏幕点。手势流拿块心来问。</summary>
    public bool Contains(Vector2 screen, Camera eventCamera) =>
        RectTransformUtility.RectangleContainsScreenPoint((RectTransform)transform, screen, eventCamera);

    /// <summary>块心进出弃置区时调。次数用完时不亮。</summary>
    public void SetHover(bool over)
    {
        bool on = over && !IsOff;
        if (on == IsHover) return;
        IsHover = on;
        m_img_Bg.sprite = on ? _hoverSprite : _bgSprite;
        m_img_Drop.gameObject.SetActive(on);
        if (on) m_tmp_Drop.text = TextTable.Instance.Format(TextKeys.Battle.DiscardDrop, _left, _left - 1);
    }

    public void Refresh(int discardsLeft)
    {
        if (!_baseKnown)
        {
            _bgColor = m_img_Bg.color;
            _bgSprite = m_img_Bg.sprite;
            _titleColor = m_tmp_Title.color;
            _countColor = m_tmp_Count.color;
            _baseKnown = true;
        }
        IsHover = false;
        m_img_Bg.sprite = _bgSprite;
        m_img_Drop.gameObject.SetActive(false);
        _left = discardsLeft;
        IsOff = discardsLeft <= 0;
        TextTable table = TextTable.Instance;
        m_img_Bg.color = IsOff ? _offBgColor : _bgColor;
        m_img_Stripes.gameObject.SetActive(IsOff);
        m_tmp_Title.text = table.Get(IsOff ? TextKeys.Battle.DiscardNone : TextKeys.Battle.Discard);
        m_tmp_Title.color = IsOff ? _offTextColor : _titleColor;
        m_tmp_Count.text = discardsLeft.ToString(CultureInfo.InvariantCulture);
        m_tmp_Count.color = IsOff ? _offTextColor : _countColor;
        m_tmp_Hint.text = table.Get(IsOff ? TextKeys.Battle.DiscardNoneHint : TextKeys.Battle.DiscardLeft);
    }
}
