using Cysharp.Threading.Tasks;
using GameRules;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 主界面(规则 §8.1):底下一排「继续」「开始游戏」「收藏」,左下「选项」、右下语言,右上版本号。
/// 「继续」只在探测到进行中的局时显示:打开时探测一次,从局内回来(本窗重新露出)再探测一次。
/// 「开始游戏」先进难度选择页(规则 §8.2),选好再开局;声音开关与语言在「选项」页里。三个子页见 <see cref="MainMenuPages"/>。
/// </summary>
[Window(UILayer.Bottom, fullScreen: true)]
public partial class UIMainMenuPanel : UIPanelMono
{
    /// <summary>探测到的进行中的局;点「继续」直接用它继续,不再读第二次档(09 号票第 6 节)。</summary>
    private RunState _saved;

    private MainMenuPages _pages;

    protected override void OnCreate()
    {
        m_text_Version.text = "v" + Application.version;
        _pages = new MainMenuPages(rectTransform, m_text_Version.font);
        AddServiceEvent(
            () => TextTable.Instance.LanguageChanged += RefreshLabels,
            () => { if (TextTable.IsValid) TextTable.Instance.LanguageChanged -= RefreshLabels; });
        RefreshLabels();
        ProbeSave();
        // 首帧的可见性翻转早于 OnCreate(见 UIPanelMono.OnVisibleChanged 注),背景音乐在这里落一次
        AudioConfigMgr.SwitchMusic(AudioIds.MusicMain);
    }

    protected override void OnVisibleChanged(bool visible)
    {
        if (visible)
        {
            _pages.Close();
            RefreshLabels();
            ProbeSave();
            AudioConfigMgr.SwitchMusic(AudioIds.MusicMain);
        }
    }

    private void ProbeSave()
    {
        _saved = RunSaveService.Instance.Probe();
        m_btn_Continue.gameObject.SetActive(_saved != null);
    }

    /// <summary>代码画的几处按钮文字(都随语言切换重画),开着的子页一起重画。</summary>
    private void RefreshLabels()
    {
        TextTable table = TextTable.Instance;
        m_tmp_ContinueLabel.text = table.Get(TextKeys.MainMenu.Continue);
        m_tmp_StartLabel.text = table.Get(TextKeys.MainMenu.Start);
        m_tmp_CollectionLabel.text = table.Get(TextKeys.Menu.Collection);
        m_tmp_OptionsLabel.text = table.Get(TextKeys.Menu.Options);
        m_tmp_LanguageLabel.text = table.Get(TextKeys.MainMenu.LanguageName);
        _pages?.Redraw();
    }

    /// <summary>开新局要先选难度(规则 §8.2);旧局的档在开局时删掉(规则 §8.1:开始新游戏会放弃旧局)。</summary>
    private partial void OnClick_StartBtn() => _pages.OpenDifficulty();

    /// <summary>接着打存档里那一局:战斗里的局回战斗窗,选关之间的局回地图,都按状态全量刷新。</summary>
    private partial void OnClick_ContinueBtn()
    {
        RunState run = _saved;
        if (run == null) return;
        _saved = null;
        RunFlow.Resume(run);
    }

    private partial void OnClick_CollectionBtn() => _pages.OpenCollection();

    private partial void OnClick_OptionsBtn() => _pages.OpenOptions();

    private partial void OnClick_LanguageBtn()
    {
        TextTable table = TextTable.Instance;
        table.SetLanguageAsync(table.NextLanguage()).Forget();
    }
}
