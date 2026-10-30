using System;
using Cysharp.Threading.Tasks;
using GameRules;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 主界面的三个子页(规则 §8.1、§8.2):难度选择(三档 + 开始 / 返回)、选项(声音、语言)、收藏(本作现有的全部内容)。
/// 子页是主界面窗里铺满屏的一层,盖住主界面的按钮列;同时在场的只有主界面自己与系统层的错误窗(压在它上面),
/// 撤法只有「返回」、开始新局(换屏后主界面整个关掉)与主界面重新露出时的 <see cref="Close"/> 三条,都撤得掉。
/// </summary>
public sealed class MainMenuPages
{
    private readonly RectTransform _window;
    private readonly Font _font;
    private RectTransform _page;
    private RunDifficulty _difficulty;

    public MainMenuPages(RectTransform window, Font font)
    {
        _window = window;
        _font = font;
    }

    public bool IsOpen => _page != null;

    public void Close()
    {
        if (_page != null) UnityEngine.Object.Destroy(_page.gameObject);
        _page = null;
    }

    /// <summary>开局前选难度(默认停在上次选的那一档),选好按「开始」开新局。</summary>
    public void OpenDifficulty()
    {
        _difficulty = RunFlow.Difficulty;
        if (!MetaProgress.IsDifficultyUnlocked(_difficulty)) _difficulty = RunDifficulty.Standard;
        BuildDifficulty();
    }

    private void BuildDifficulty()
    {
        TextTable table = TextTable.Instance;
        RectTransform page = NewPage(table.Get(TextKeys.Menu.DifficultyTitle));
        float y = -260f;
        foreach (RunDifficulty d in (RunDifficulty[])Enum.GetValues(typeof(RunDifficulty)))
        {
            RunDifficulty pick = d;
            bool unlocked = MetaProgress.IsDifficultyUnlocked(d);
            string text = table.Get(TextKeys.Of(d)) + "\n<size=20>" + table.Get(TextKeys.Desc(d)) + "</size>";
            if (!unlocked) text += "\n<size=18>" + table.Get(TextKeys.Menu.DifficultyLocked) + "</size>";
            RuntimeUI.Button(page, _font, text, new Vector2(560f, y), new Vector2(800f, 110f), () =>
            {
                if (!MetaProgress.IsDifficultyUnlocked(pick)) return;
                _difficulty = pick;
                BuildDifficulty();
            }, unlocked, 30, d == _difficulty ? RuntimeUI.ButtonAccent : RuntimeUI.ButtonColor);
            y -= 130f;
        }
        RuntimeUI.Button(page, _font, table.Get(TextKeys.Menu.DifficultyStart), new Vector2(560f, y - 30f), new Vector2(380f, 84f), () =>
        {
            RunFlow.Difficulty = _difficulty;
            RunFlow.StartNew(_difficulty);
        }, true, 30, RuntimeUI.ButtonAccent);
        BackButton(page, new Vector2(980f, y - 30f), 380f);
    }

    /// <summary>选项:声音总开关、语言。两样都随点随存。</summary>
    public void OpenOptions()
    {
        TextTable table = TextTable.Instance;
        RectTransform page = NewPage(table.Get(TextKeys.Menu.OptionsTitle));
        RuntimeUI.Button(page, _font, table.Get(SoundSettings.IsOn ? TextKeys.MainMenu.SoundOn : TextKeys.MainMenu.SoundOff), new Vector2(760f, -300f),
            new Vector2(400f, 84f), () =>
            {
                SoundSettings.Toggle();
                OpenOptions();
            }, true, 30);
        RuntimeUI.Button(page, _font, table.Get(TextKeys.MainMenu.Language), new Vector2(760f, -400f), new Vector2(400f, 84f), () =>
        {
            table.SetLanguageAsync(table.NextLanguage()).Forget();
        }, true, 30);
        BackButton(page, new Vector2(760f, -520f));
    }

    /// <summary>语言切换后,开着的子页按新语言重画。</summary>
    public void Redraw()
    {
        if (_page == null) return;
        string name = _page.name;
        if (name == nameof(OpenOptions)) OpenOptions();
        else if (name == nameof(OpenCollection)) OpenCollection();
        else if (name == nameof(BuildDifficulty)) BuildDifficulty();
    }

    /// <summary>收藏:基因(稀有度、价)、科技、改造、优惠券、补给包,分三栏列出。</summary>
    public void OpenCollection()
    {
        TextTable table = TextTable.Instance;
        ContentCatalog catalog = TuningTable.Instance.Config.Catalog;
        RectTransform page = NewPage(table.Get(TextKeys.Menu.CollectionTitle));
        const float top = -170f;
        const float row = 34f;
        float x = 80f, y = top;

        void Section(string title)
        {
            RuntimeUI.Label(page, _font, title, new Vector2(x, y), new Vector2(560f, 40f), 26, TextAnchor.MiddleLeft, RuntimeUI.Gold);
            y -= 44f;
        }

        void Line(string text)
        {
            RuntimeUI.Label(page, _font, text, new Vector2(x, y), new Vector2(560f, row), 19);
            y -= row;
        }

        void NextColumn()
        {
            x += 600f;
            y = top;
        }

        Section(table.Get(TextKeys.Of(ItemKind.Gene)));
        foreach (CatalogEntry e in catalog.Genes)
        {
            string desc = table.Has(TextKeys.GeneDesc(e.Id)) ? " · " + table.Get(TextKeys.GeneDesc(e.Id)) : string.Empty;
            Line(table.Get(TextKeys.Gene(e.Id)) + "  <color=#9aa0b4>" + table.Get(TextKeys.Rarity(e.Rarity)) + " $" + e.Price + desc + "</color>");
        }
        y -= 10f;
        Section(table.Get(TextKeys.Of(ItemKind.Booster)));
        foreach (CatalogEntry e in catalog.Boosters) Line(table.Get(TextKeys.Booster(e.Id)) + "  <color=#9aa0b4>$" + e.Price + "</color>");

        NextColumn();
        Section(table.Get(TextKeys.Of(ItemKind.Tech)));
        foreach (CatalogEntry e in catalog.Techs) Line(ItemNames.ConsumableDesc(catalog, ConsumableItem.Tech(e.Id)) + "  <color=#9aa0b4>" + ItemNames.Tech(catalog, e.Id) + "</color>");
        y -= 10f;
        Section(table.Get(TextKeys.Menu.CollectionLooks));
        foreach (Enhancement en in (Enhancement[])Enum.GetValues(typeof(Enhancement)))
        {
            if (en != Enhancement.None) Line(table.Get(TextKeys.Of(en)));
        }
        foreach (Edition ed in (Edition[])Enum.GetValues(typeof(Edition)))
        {
            if (ed != Edition.None) Line(table.Get(TextKeys.Of(ed)));
        }

        NextColumn();
        Section(table.Get(TextKeys.Of(ItemKind.Mod)));
        foreach (CatalogEntry e in catalog.Mods) Line(table.Get(TextKeys.Mod(e.Id)) + "  <color=#9aa0b4>" + table.Get(TextKeys.ModDesc(e.Id)) + "</color>");
        y -= 10f;
        Section(table.Get(TextKeys.Of(ItemKind.Voucher)));
        foreach (CatalogEntry e in catalog.Vouchers) Line(table.Get(TextKeys.Voucher(e.Id)) + "  <color=#9aa0b4>" + table.Get(TextKeys.VoucherDesc(e.Id)) + "</color>");

        BackButton(page, new Vector2(1540f, -960f));
    }

    /// <summary>新开一页(先撤掉旧的):铺满屏的底板挡住主界面的按钮,顶上一行标题。</summary>
    private RectTransform NewPage(string title, [System.Runtime.CompilerServices.CallerMemberName] string caller = "")
    {
        Close();
        _page = RuntimeUI.Fill(caller, _window, new Color(0.03f, 0.04f, 0.07f, 0.97f));
        _page.GetComponent<Image>().raycastTarget = true;
        RuntimeUI.Label(_page, _font, title, new Vector2(0f, -60f), new Vector2(1920f, 90f), 54, TextAnchor.MiddleCenter, RuntimeUI.Gold);
        return _page;
    }

    private void BackButton(RectTransform page, Vector2 position, float width = 300f)
    {
        RuntimeUI.Button(page, _font, TextTable.Instance.Get(TextKeys.Menu.Back), position, new Vector2(width, 84f), Close, true, 30);
    }
}
