using System;
using System.Collections.Generic;
using System.Globalization;
using Cysharp.Threading.Tasks;
using Newtonsoft.Json.Linq;
using TEngine;
using UnityEngine;

/// <summary>
/// 文本表:按当前语言查 <c>AssetRaw/Configs/l10n/texts.json</c>(<c>[{key, zh, en}]</c>,即 Luban 文本表格式)。
/// 切语言后发 <see cref="LanguageChanged"/>,不重开窗口。
/// </summary>
/// <remarks>
/// 内存里只留当前语言那一列,切语言时重读表。语言存玩家设置,不进局内存档;没存过就按系统语言取。
/// 切换时开着的窗要响应 <see cref="LanguageChanged"/>:静态文案挂 <see cref="LocalizedText"/>,
/// 动态文案(带参数的句子、分数)由窗在同一事件里重绘,窗内经 <c>AddServiceEvent</c> 登记。
/// </remarks>
public sealed class TextTable : Singleton<TextTable>
{
    /// <summary>表的资源地址(YooAsset 按文件名寻址)。</summary>
    private const string TableLocation = "texts";

    private const string LanguagePrefKey = "settings.language";

    /// <summary>支持的语言,即表里的列名;次序就是语言按钮的轮换次序。</summary>
    private static readonly string[] Languages = { "zh", "en" };

    private Dictionary<string, string> _texts = new Dictionary<string, string>(StringComparer.Ordinal);
    private readonly HashSet<string> _warnedMissing = new HashSet<string>(StringComparer.Ordinal);

    /// <summary>读表的序号:连续切换时,先发起、后读完的那次不覆盖后发起的。</summary>
    private int _loadSerial;

    /// <summary>当前语言(表的列名)。<see cref="LoadAsync"/> 读成之前为 null。</summary>
    public string Current { get; private set; }

    /// <summary>切了语言、新的一列已经换上之后触发。</summary>
    public event Action LanguageChanged;

    /// <summary>启动时调一次,主界面打开之前完成:定当前语言并读表。</summary>
    public async UniTask LoadAsync()
    {
        string saved = Utility.PlayerPrefs.GetString(LanguagePrefKey, string.Empty);
        string lang = Array.IndexOf(Languages, saved) >= 0 ? saved : DefaultLanguage(Application.systemLanguage);
        await LoadColumnAsync(lang);
    }

    /// <summary>切语言并存进玩家设置;新的一列换上后触发 <see cref="LanguageChanged"/>。</summary>
    public async UniTask SetLanguageAsync(string lang)
    {
        if (Array.IndexOf(Languages, lang) < 0) throw new ArgumentException("不支持的语言: " + lang, nameof(lang));
        Utility.PlayerPrefs.SetString(LanguagePrefKey, lang);
        if (await LoadColumnAsync(lang)) LanguageChanged?.Invoke();
    }

    /// <summary>当前语言的下一种,给语言按钮轮换用。</summary>
    public string NextLanguage()
    {
        return Languages[(Array.IndexOf(Languages, Current) + 1) % Languages.Length];
    }

    /// <summary>查文案;表里没有的 key 原样返回,每个 key 只警告一次。</summary>
    public string Get(string key)
    {
        if (_texts.TryGetValue(key, out string text)) return text;
        if (_warnedMissing.Add(key)) Log.Warning("[TextTable] 表里没有 key: " + key);
        return key;
    }

    /// <summary>查文案并填 <c>{0}</c>、<c>{1}</c>… 占位;数字按 InvariantCulture 转文字,不随系统区域。</summary>
    public string Format(string key, params object[] args)
    {
        return string.Format(CultureInfo.InvariantCulture, Get(key), args);
    }

    /// <summary>中文(含繁体:还没有繁体列,简体比英文近)进 zh,其余进 en。</summary>
    private static string DefaultLanguage(SystemLanguage system)
    {
        switch (system)
        {
            case SystemLanguage.ChineseSimplified:
            case SystemLanguage.ChineseTraditional:
            case SystemLanguage.Chinese:
                return "zh";
            default:
                return "en";
        }
    }

    /// <returns>这一列是否已换上;读不到表、或被更晚发起的一次取代时为 false。</returns>
    private async UniTask<bool> LoadColumnAsync(string lang)
    {
        int serial = ++_loadSerial;
        TextAsset asset = await GameModule.Resource.LoadAssetAsync<TextAsset>(TableLocation);
        if (asset == null)
        {
            Log.Error("[TextTable] 读不到文本表: " + TableLocation);
            return false;
        }
        string json = asset.text;
        GameModule.Resource.UnloadAsset(asset);
        if (serial != _loadSerial) return false;

        var texts = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (JToken row in JArray.Parse(json))
        {
            texts[(string)row["key"]] = (string)row[lang] ?? string.Empty;
        }
        _texts = texts;
        Current = lang;
        return true;
    }
}
