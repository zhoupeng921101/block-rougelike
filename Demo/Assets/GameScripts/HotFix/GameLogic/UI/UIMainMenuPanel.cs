using Cysharp.Threading.Tasks;
using UnityEngine;

/// <summary>
/// 主界面。规则 §8.1 的「开始游戏」「继续」「语言」三个按钮排在「按钮列」里;界面元素按局外循环阶段补齐。
/// </summary>
[Window(UILayer.Bottom, fullScreen: true)]
public partial class UIMainMenuPanel : UIPanelMono
{
    protected override void OnCreate()
    {
        m_text_Version.text = "v" + Application.version;
    }

    /// <summary>开新局(11 号票的默认参数 + 新种子),进战斗窗。</summary>
    private partial void OnClick_StartBtn()
    {
        GameModule.UI.ShowUIAsync<UIBattlePanel>(RunLauncher.NewRun());
    }

    private partial void OnClick_LanguageBtn()
    {
        TextTable table = TextTable.Instance;
        table.SetLanguageAsync(table.NextLanguage()).Forget();
    }
}
