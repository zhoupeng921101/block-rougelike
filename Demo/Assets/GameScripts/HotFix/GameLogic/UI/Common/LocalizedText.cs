using TMPro;
using UnityEngine;

/// <summary>
/// 静态文案的绑定:挂在 TMP 文字节点上,按 key 从 <see cref="TextTable"/> 取当前语言的文案,启用时画一次,之后随切语言重画。
/// 带参数的句子、分数这类动态文案不用它,由持有节点的窗在 <see cref="TextTable.LanguageChanged"/> 里重绘。
/// </summary>
[DisallowMultipleComponent]
[RequireComponent(typeof(TMP_Text))]
public sealed class LocalizedText : MonoBehaviour
{
    /// <summary>字段名是契约:DotNet/Tests 的 L10n 用例按名从预制体里读它,核对 key 在表里;改名要同步改用例。</summary>
    [SerializeField] private string _textKey = string.Empty;

    private TMP_Text _text;

    private void Awake()
    {
        _text = GetComponent<TMP_Text>();
    }

    private void OnEnable()
    {
        TextTable.Instance.LanguageChanged += Refresh;
        Refresh();
    }

    private void OnDisable()
    {
        // 退出游戏时表可能先一步释放了,不为解绑再造一个。
        if (TextTable.IsValid) TextTable.Instance.LanguageChanged -= Refresh;
    }

    private void Refresh()
    {
        _text.text = TextTable.Instance.Get(_textKey);
    }
}
