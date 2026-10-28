using System.Globalization;
using GameRules;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 左栏消除类型表的一行(AssetRaw/UI/Prefabs/Parts/ClearTypeRow.prefab 的根,由 <see cref="ClearTypeTablePart"/> 按类型数建):
/// 类型名、Lv、本级底注、×倍率。拖动时命中的那一行亮起(<see cref="SetHighlight"/>)。预览徽章里也是这一行。
/// </summary>
public sealed class ClearTypeRowPart : MonoBehaviour
{
    [SerializeField] private Image m_img_Highlight = null!;
    [SerializeField] private TMP_Text m_tmp_Name = null!;
    [SerializeField] private TMP_Text m_tmp_Level = null!;
    [SerializeField] private TMP_Text m_tmp_Chips = null!;
    [SerializeField] private TMP_Text m_tmp_Mult = null!;

    /// <summary>这一行画的是哪种类型。</summary>
    public ClearType Type { get; private set; }

    public void Set(ClearType type, int level, ClearTypeBase values)
    {
        Type = type;
        TextTable table = TextTable.Instance;
        m_tmp_Name.text = table.Get(TextKeys.Of(type));
        m_tmp_Level.text = table.Format(TextKeys.Battle.Level, level);
        m_tmp_Chips.text = values.Chips.ToString(CultureInfo.InvariantCulture);
        m_tmp_Mult.text = table.Format(TextKeys.Battle.Mult, values.Mult);
    }

    /// <summary>结算演出的计数框里跳数字:底分与倍率千分值(1000 = 1)。数字按 InvariantCulture。</summary>
    public void SetChipsMult(long chips, long multPermille)
    {
        m_tmp_Chips.text = chips.ToString(CultureInfo.InvariantCulture);
        m_tmp_Mult.text = TextTable.Instance.Format(TextKeys.Battle.Mult, (multPermille / 1000m).ToString("0.###", CultureInfo.InvariantCulture));
    }

    /// <summary>底分那一格:计数框在它上面弹一下、合成时它变成「= 得分」。</summary>
    public TMP_Text ChipsText => m_tmp_Chips;

    /// <summary>倍率那一格:合成时淡出。</summary>
    public TMP_Text MultText => m_tmp_Mult;

    public void SetHighlight(bool on) => m_img_Highlight.gameObject.SetActive(on);

    public bool IsHighlighted => m_img_Highlight.gameObject.activeSelf;

    /// <summary>四格的字,依次是类型名、Lv、底注、倍率。只给战斗窗的调试核对读。</summary>
    public string[] Texts => new[] { m_tmp_Name.text, m_tmp_Level.text, m_tmp_Chips.text, m_tmp_Mult.text };
}
