using System.Globalization;
using GameRules;
using TMPro;
using UnityEngine;

/// <summary>
/// 左栏消除类型表的一行(AssetRaw/UI/Prefabs/Parts/ClearTypeRow.prefab 的根,由 <see cref="ClearTypeTablePart"/> 按类型数建):
/// 类型名、Lv、本级底注、×倍率。拖动时高亮命中行归 29 号票。
/// </summary>
public sealed class ClearTypeRowPart : MonoBehaviour
{
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

    /// <summary>四格的字,依次是类型名、Lv、底注、倍率。只给战斗窗的调试核对读。</summary>
    public string[] Texts => new[] { m_tmp_Name.text, m_tmp_Level.text, m_tmp_Chips.text, m_tmp_Mult.text };
}
