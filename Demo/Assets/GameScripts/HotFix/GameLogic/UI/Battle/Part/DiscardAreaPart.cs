using System.Globalization;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 弃置区(挂在战斗窗的 m_part_Discard 节点上)。本票画两态:常态显示剩余次数;次数用完时去色、显示 0 和「拖进来会弹回」。
/// 块悬在区内的高亮态、「松手弃置 · 剩余 n → n−1」那条签归 29 号票(13 号票的三态)。
/// </summary>
public sealed class DiscardAreaPart : MonoBehaviour
{
    [SerializeField] private Image m_img_Bg = null!;
    [SerializeField] private TMP_Text m_tmp_Title = null!;
    [SerializeField] private TMP_Text m_tmp_Count = null!;
    [SerializeField] private TMP_Text m_tmp_Hint = null!;

    [Header("次数用完")]
    [Tooltip("次数用完时的底色;常态底色取 prefab 上 m_img_Bg 的颜色。")]
    [SerializeField] private Color _offBgColor = new Color32(0x10, 0x14, 0x1f, 0xFF);
    [Tooltip("次数用完时标题与次数的颜色;常态取 prefab 上的颜色。")]
    [SerializeField] private Color _offTextColor = new Color32(0x6b, 0x72, 0x88, 0xFF);

    private Color _bgColor;
    private Color _titleColor;
    private Color _countColor;
    private bool _baseKnown;

    /// <summary>这次画的是不是「次数用完」那一态。只给战斗窗的调试核对读。</summary>
    public bool IsOff { get; private set; }

    /// <summary>次数这一格的字。只给战斗窗的调试核对读。</summary>
    public string CountText => m_tmp_Count.text;

    public void Refresh(int discardsLeft)
    {
        if (!_baseKnown)
        {
            _bgColor = m_img_Bg.color;
            _titleColor = m_tmp_Title.color;
            _countColor = m_tmp_Count.color;
            _baseKnown = true;
        }
        IsOff = discardsLeft <= 0;
        TextTable table = TextTable.Instance;
        m_img_Bg.color = IsOff ? _offBgColor : _bgColor;
        m_tmp_Title.text = table.Get(IsOff ? TextKeys.Battle.DiscardNone : TextKeys.Battle.Discard);
        m_tmp_Title.color = IsOff ? _offTextColor : _titleColor;
        m_tmp_Count.text = discardsLeft.ToString(CultureInfo.InvariantCulture);
        m_tmp_Count.color = IsOff ? _offTextColor : _countColor;
        m_tmp_Hint.text = table.Get(IsOff ? TextKeys.Battle.DiscardNoneHint : TextKeys.Battle.DiscardLeft);
    }
}
