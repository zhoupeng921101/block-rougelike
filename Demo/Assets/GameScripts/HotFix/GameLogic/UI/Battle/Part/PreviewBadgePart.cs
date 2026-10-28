using GameRules;
using UnityEngine;

/// <summary>
/// 拖动预览徽章(挂在战斗窗的 m_part_Badge 节点上,窗根的最后几个子节点之一,压在盘面与托盘之上)。
/// 内容同类型表的一行:类型名、Lv、本级底注 × 倍率,行就用类型表那个 prefab 建。
/// 位置贴手上那块的上沿、水平居中,底边离块顶 <see cref="BlockLayout.BadgeGap"/>(13 号票),由拖拽流每次拖动时推进来。
/// 30 号票的计数框就是落了位的它(21 号票第 6 节)。
/// </summary>
public sealed class PreviewBadgePart : MonoBehaviour
{
    [Tooltip("一行的 prefab（AssetRaw/UI/Prefabs/Parts/ClearTypeRow.prefab）")]
    [SerializeField] private GameObject _rowPrefab;

    /// <summary>自身矩阵位置（Part 是裸 MonoBehaviour，无框架基类可提供该便捷属性）。</summary>
    public RectTransform rectTransform => (RectTransform)transform;

    private ClearTypeRowPart _row;

    public bool IsShown => gameObject.activeSelf;

    /// <summary>这次显示的类型;没显示时为 null。</summary>
    public ClearType? Type => IsShown && _row != null ? _row.Type : (ClearType?)null;

    /// <summary>徽章里的那一行;还没显示过时为 null。结算演出拿它跳数字。</summary>
    public ClearTypeRowPart Row => _row;

    public void Show(ClearType type, int level, ClearTypeBase values)
    {
        // 结算演出的计数框是拷出来的一份徽章:行已经在子节点里,字段没跟着拷
        if (_row == null) _row = GetComponentInChildren<ClearTypeRowPart>(true);
        if (_row == null)
        {
            _row = UIPartFactory.Create<ClearTypeRowPart>(_rowPrefab, rectTransform, nameof(PreviewBadgePart));
            if (_row == null) return;   // 失败原因已由 UIPartFactory 记录
            var rt = (RectTransform)_row.transform;
            rt.anchorMin = rt.anchorMax = rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = Vector2.zero;
        }
        _row.Set(type, level, values);
        gameObject.SetActive(true);
    }

    /// <summary>底边中点移到世界坐标 <paramref name="bottomCenter"/>(徽章 pivot 在底边中点)。</summary>
    public void MoveTo(Vector3 bottomCenter) => rectTransform.position = bottomCenter;

    public void Hide() => gameObject.SetActive(false);
}
