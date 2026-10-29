using Cysharp.Threading.Tasks;
using GameRules;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 主界面(规则 §8.1):按钮列是「继续」「开始游戏」「收藏」「选项」「语言」。
/// 「继续」只在探测到进行中的局时显示:打开时探测一次,从局内回来(本窗重新露出)再探测一次。
/// 「开始游戏」先进难度选择页(规则 §8.2),选好再开局;声音开关在「选项」页里。三个子页见 <see cref="MainMenuPages"/>。
/// 预制体里原有的难度切档、声音两个按钮藏起来;「收藏」「选项」照「语言」按钮运行时克隆进按钮列。
/// </summary>
[Window(UILayer.Bottom, fullScreen: true)]
public partial class UIMainMenuPanel : UIPanelMono
{
    /// <summary>探测到的进行中的局;点「继续」直接用它继续,不再读第二次档(09 号票第 6 节)。</summary>
    private RunState _saved;

    private MainMenuPages _pages;

    private TMP_Text _collectionLabel;
    private TMP_Text _optionsLabel;

    protected override void OnCreate()
    {
        m_text_Version.text = "v" + Application.version;
        _pages = new MainMenuPages(rectTransform, m_text_Version.font);
        _collectionLabel = CloneMenuButton("收藏", () => _pages.OpenCollection());
        _optionsLabel = CloneMenuButton("选项", () => _pages.OpenOptions());
        m_btn_Difficulty.gameObject.SetActive(false);
        m_btn_Sound.gameObject.SetActive(false);
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
        m_text_Difficulty.text = table.Format(TextKeys.MainMenu.Difficulty, table.Get(TextKeys.Of(RunFlow.Difficulty)));
        m_text_Sound.text = table.Get(SoundSettings.IsOn ? TextKeys.MainMenu.SoundOn : TextKeys.MainMenu.SoundOff);
        _collectionLabel.text = table.Get(TextKeys.Menu.Collection);
        _optionsLabel.text = table.Get(TextKeys.Menu.Options);
        _pages?.Redraw();
    }

    /// <summary>
    /// 照「语言」按钮克隆一个按钮进按钮列(排在它前面),返回它的文字节点。
    /// 克隆件上的 <see cref="LocalizedText"/> 立即拆掉:它会按「语言」的 key 重画,文字改由 <see cref="RefreshLabels"/> 画。
    /// </summary>
    private TMP_Text CloneMenuButton(string name, System.Action onClick)
    {
        GameObject go = Instantiate(m_btn_Language.gameObject, m_btn_Language.transform.parent);
        go.name = name;
        go.SetActive(true);
        go.transform.SetSiblingIndex(m_btn_Language.transform.GetSiblingIndex());
        UnityEngine.UI.Button button = go.GetComponent<UnityEngine.UI.Button>();
        button.onClick.RemoveAllListeners();
        button.onClick.AddListener(() => onClick());
        foreach (LocalizedText localized in go.GetComponentsInChildren<LocalizedText>(true)) DestroyImmediate(localized);
        return go.GetComponentInChildren<TMP_Text>(true);
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

    /// <summary>切难度档:标准 → 进阶 → 专家 → 标准,存在 PlayerPrefs 里,下次启动还是这一档。</summary>
    private partial void OnClick_DifficultyBtn()
    {
        RunFlow.Difficulty = RunFlow.NextDifficulty(RunFlow.Difficulty);
        RefreshLabels();
    }

    /// <summary>声音总开关:音乐、音效、界面音效、语音一起开或关,存进 PlayerPrefs(启动时按同一套键还原)。</summary>
    private partial void OnClick_SoundBtn()
    {
        SoundSettings.Toggle();
        RefreshLabels();
    }

    private partial void OnClick_LanguageBtn()
    {
        TextTable table = TextTable.Instance;
        table.SetLanguageAsync(table.NextLanguage()).Forget();
    }
}
