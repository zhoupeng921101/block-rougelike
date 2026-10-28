using System.Collections.Generic;
using GameRules;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 左栏消除类型表(挂在战斗窗的 m_part_TypeTable 节点上):11 行按规则 §3.3 的判定优先级排(<see cref="ClearRules.Priority"/>,
/// 不是 <see cref="ClearType"/> 的取值序),每行的数取开局参数里的类型表按本局等级查(<see cref="IRunView.BaseOf"/>)。
/// </summary>
public sealed class ClearTypeTablePart : MonoBehaviour
{
    [SerializeField] private VerticalLayoutGroup m_vlay_Rows = null!;

    [Tooltip("一行的 prefab（AssetRaw/UI/Prefabs/Parts/ClearTypeRow.prefab）")]
    [SerializeField] private GameObject _rowPrefab;

    private readonly List<ClearTypeRowPart> _rows = new List<ClearTypeRowPart>(ClearTypes.Count);

    /// <summary>这次画了几行。</summary>
    public int RowCount => _rows.Count;

    /// <summary>第 <paramref name="index"/> 行(按优先级,从 0 数)。只给战斗窗的调试核对读。</summary>
    public ClearTypeRowPart GetRow(int index) => _rows[index];

    public void Refresh(IRunView run)
    {
        IReadOnlyList<ClearType> order = ClearRules.Priority;
        if (_rows.Count == 0)
        {
            for (int i = 0; i < order.Count; i++)
            {
                var row = UIPartFactory.Create<ClearTypeRowPart>(_rowPrefab, m_vlay_Rows.transform, nameof(ClearTypeTablePart));
                if (row == null) return;   // 失败原因已由 UIPartFactory 记录
                _rows.Add(row);
            }
        }
        for (int i = 0; i < _rows.Count; i++)
        {
            ClearType type = order[i];
            _rows[i].Set(type, run.LevelOf(type), run.BaseOf(type));
        }
    }
}
