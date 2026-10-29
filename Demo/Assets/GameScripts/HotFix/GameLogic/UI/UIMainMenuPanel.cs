using Cysharp.Threading.Tasks;
using GameRules;
using UnityEngine;

/// <summary>
/// 主界面。规则 §8.1 的「继续」「开始游戏」「语言」「难度」排在「按钮列」里。
/// 「继续」只在探测到进行中的局时显示:打开时探测一次,从局内回来(本窗重新露出)再探测一次。
/// 难度是主界面的一个切档按钮(占位做法,设计稿 §5 的三档),开局时带进 <see cref="RunState.Difficulty"/>。
/// </summary>
[Window(UILayer.Bottom, fullScreen: true)]
public partial class UIMainMenuPanel : UIPanelMono
{
    /// <summary>探测到的进行中的局;点「继续」直接用它继续,不再读第二次档(09 号票第 6 节)。</summary>
    private RunState _saved;

    protected override void OnCreate()
    {
        m_text_Version.text = "v" + Application.version;
        AddServiceEvent(
            () => TextTable.Instance.LanguageChanged += RefreshDifficulty,
            () => { if (TextTable.IsValid) TextTable.Instance.LanguageChanged -= RefreshDifficulty; });
        RefreshDifficulty();
        ProbeSave();
    }

    protected override void OnVisibleChanged(bool visible)
    {
        if (visible)
        {
            RefreshDifficulty();
            ProbeSave();
        }
    }

    private void ProbeSave()
    {
        _saved = RunSaveService.Instance.Probe();
        m_btn_Continue.gameObject.SetActive(_saved != null);
    }

    private void RefreshDifficulty()
    {
        TextTable table = TextTable.Instance;
        m_text_Difficulty.text = table.Format(TextKeys.MainMenu.Difficulty, table.Get(TextKeys.Of(RunFlow.Difficulty)));
    }

    /// <summary>开新局(选中的难度 + 新种子),下一步是选关。旧局的档在开局时删掉(规则 §8.1:开始新游戏会放弃旧局)。</summary>
    private partial void OnClick_StartBtn()
    {
        _saved = null;
        RunFlow.StartNew(RunFlow.Difficulty);
    }

    /// <summary>接着打存档里那一局:战斗里的局回战斗窗,选关之间的局回地图,都按状态全量刷新。</summary>
    private partial void OnClick_ContinueBtn()
    {
        RunState run = _saved;
        if (run == null) return;
        _saved = null;
        RunFlow.Resume(run);
    }

    /// <summary>切难度档:标准 → 进阶 → 专家 → 标准,存在 PlayerPrefs 里,下次启动还是这一档。</summary>
    private partial void OnClick_DifficultyBtn()
    {
        RunFlow.Difficulty = RunFlow.NextDifficulty(RunFlow.Difficulty);
        RefreshDifficulty();
    }

    private partial void OnClick_LanguageBtn()
    {
        TextTable table = TextTable.Instance;
        table.SetLanguageAsync(table.NextLanguage()).Forget();
    }
}
