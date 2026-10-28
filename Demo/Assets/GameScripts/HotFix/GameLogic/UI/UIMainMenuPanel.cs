using Cysharp.Threading.Tasks;
using GameRules;
using UnityEngine;

/// <summary>
/// 主界面。规则 §8.1 的「继续」「开始游戏」「语言」排在「按钮列」里;界面元素按局外循环阶段补齐。
/// 「继续」只在探测到进行中的局时显示:打开时探测一次,从战斗回来(本窗重新露出)再探测一次。
/// </summary>
[Window(UILayer.Bottom, fullScreen: true)]
public partial class UIMainMenuPanel : UIPanelMono
{
    /// <summary>探测到的进行中的局;点「继续」直接用它进战斗,不再读第二次档(09 号票第 6 节)。</summary>
    private RunState _saved;

    protected override void OnCreate()
    {
        m_text_Version.text = "v" + Application.version;
        ProbeSave();
    }

    protected override void OnVisibleChanged(bool visible)
    {
        if (visible) ProbeSave();
    }

    private void ProbeSave()
    {
        _saved = RunSaveService.Instance.Probe();
        m_btn_Continue.gameObject.SetActive(_saved != null);
    }

    /// <summary>开新局(11 号票的默认参数 + 新种子),进战斗窗。旧局的档在开局时删掉(规则 §8.1:开始新游戏会放弃旧局)。</summary>
    private partial void OnClick_StartBtn()
    {
        _saved = null;
        GameModule.UI.ShowUIAsync<UIBattlePanel>(new UIBattlePanel.Entry(RunLauncher.NewRun(), false));
    }

    /// <summary>接着打存档里那一局:战斗窗按状态全量刷新,不重放事件。</summary>
    private partial void OnClick_ContinueBtn()
    {
        RunState run = _saved;
        if (run == null) return;
        _saved = null;
        RunSaveService.Instance.Resume(run);
        GameModule.UI.ShowUIAsync<UIBattlePanel>(new UIBattlePanel.Entry(run, true));
    }

    private partial void OnClick_LanguageBtn()
    {
        TextTable table = TextTable.Instance;
        table.SetLanguageAsync(table.NextLanguage()).Forget();
    }
}
