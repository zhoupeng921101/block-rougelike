using TMPro;
using UnityEngine;

/// <summary>
/// 托盘块的点数标签,摆在槽的右下角(13 号票:点数只标在托盘块上,落到盘上之后格子不标)。
/// block-client 的同名件是格上图标 + 角标 + 个数,本图只剩个数这一样;强化、版本的角标阶段 5 再加回来。
/// </summary>
public sealed class ElementPart : MonoBehaviour
{
    [SerializeField] private TMP_Text m_tmp_Points = null!;

    /// <summary>自身矩阵位置（Part 是裸 MonoBehaviour，无框架基类可提供该便捷属性）。</summary>
    public RectTransform rectTransform => (RectTransform)transform;

    /// <summary>prefab 上标签的原色;置灰只压 alpha,复原时取回它。</summary>
    private Color _baseColor;

    private bool _baseColorKnown;

    /// <summary>写点数;<paramref name="greyed"/> = 这块怎么转都放不下,点数变淡。</summary>
    public void SetPoints(int points, bool greyed)
    {
        if (!_baseColorKnown)
        {
            _baseColor = m_tmp_Points.color;
            _baseColorKnown = true;
        }
        m_tmp_Points.text = TextTable.Instance.Format(TextKeys.Battle.Points, points);
        var c = _baseColor;
        if (greyed) c.a *= BlockLayout.GreyPointsAlpha;
        m_tmp_Points.color = c;
    }

    /// <summary>当前标签上的字。只给战斗窗的调试核对读。</summary>
    public string Text => m_tmp_Points.text;
}
