using System;
using System.Collections.Generic;
using System.IO;
using GameRules;
using UnityEngine;

/// <summary>
/// 元进程存档(局外循环设计稿 §6):已解锁的难度、已解锁的基因池、累计通关次数。
/// 与局内存档分开,存 <c>meta.json</c>,不进 run.json。只解锁可能性,不给永久强度。
/// 一开始就随包发布,形状从 schema 1 起;坏档当作全新档。
/// </summary>
public static class MetaProgress
{
    private const string FileName = "meta.json";
    private const int Schema = 1;

    /// <summary>初始基因池的大小;通关标准 +30、通关专家 +30(局外循环 §6)。</summary>
    private const int InitialGenes = 90;
    private const int StandardBatch = 30;
    private const int ExpertBatch = 30;

    [Serializable]
    private sealed class Data
    {
        public int schema;
        public int winsStandard;
        public int winsAdvanced;
        public int winsExpert;
    }

    private static Data _data;
    private static List<int> _unlockedGenes;

    private static string Path => System.IO.Path.Combine(Application.persistentDataPath, FileName);

    private static Data Current
    {
        get
        {
            if (_data == null) Load();
            return _data;
        }
    }

    /// <summary>难度解锁:标准开局可选;进阶要通关标准,专家要通关进阶(局外循环 §5.1)。</summary>
    public static bool IsDifficultyUnlocked(RunDifficulty difficulty)
    {
        switch (difficulty)
        {
            case RunDifficulty.Standard: return true;
            case RunDifficulty.Advanced: return Current.winsStandard > 0;
            case RunDifficulty.Expert: return Current.winsAdvanced > 0;
            default: return false;
        }
    }

    /// <summary>通关一局:记一次,按难度分计数。调用方负责在整局打完那一刻调一次。</summary>
    public static void RecordWin(RunDifficulty difficulty)
    {
        Data data = Current;
        switch (difficulty)
        {
            case RunDifficulty.Standard: data.winsStandard++; break;
            case RunDifficulty.Advanced: data.winsAdvanced++; break;
            case RunDifficulty.Expert: data.winsExpert++; break;
        }
        _unlockedGenes = null;
        Save();
    }

    /// <summary>这一档已经通关过几次。</summary>
    public static int WinsOf(RunDifficulty difficulty)
    {
        switch (difficulty)
        {
            case RunDifficulty.Standard: return Current.winsStandard;
            case RunDifficulty.Advanced: return Current.winsAdvanced;
            case RunDifficulty.Expert: return Current.winsExpert;
            default: return 0;
        }
    }

    /// <summary>这一局能出现的基因号:初始 90,通关标准再放 30,通关专家再放 30。</summary>
    public static IReadOnlyList<int> UnlockedGenes
    {
        get
        {
            if (_unlockedGenes != null) return _unlockedGenes;
            int count = InitialGenes;
            if (Current.winsStandard > 0) count += StandardBatch;
            if (Current.winsExpert > 0) count += ExpertBatch;
            _unlockedGenes = BuildPool(count);
            return _unlockedGenes;
        }
    }

    /// <summary>
    /// 池子按「稀有度从低到高、同档按号」切三批:普通全在第一批,罕见跨前两批,稀有与传说在最后一批。
    /// 设计稿只给了 90 / +30 / +30 的张数,没给名单,这里取最稳的切法。
    /// </summary>
    private static List<int> BuildPool(int count)
    {
        var ordered = new List<CatalogEntry>();
        foreach (CatalogEntry e in MinimalContent.Catalog.Genes) ordered.Add(e);
        ordered.Sort((a, b) => a.Rarity != b.Rarity ? a.Rarity.CompareTo(b.Rarity) : a.Id.CompareTo(b.Id));
        var ids = new List<int>(Math.Min(count, ordered.Count));
        for (int i = 0; i < ordered.Count && i < count; i++) ids.Add(ordered[i].Id);
        return ids;
    }

    private static void Load()
    {
        _data = new Data { schema = Schema };
        try
        {
            if (File.Exists(Path))
            {
                Data parsed = JsonUtility.FromJson<Data>(File.ReadAllText(Path));
                if (parsed != null && parsed.schema == Schema) _data = parsed;
            }
        }
        catch (Exception e)
        {
            Debug.LogWarning("元进程存档读不了,按新档处理: " + e.Message);
            _data = new Data { schema = Schema };
        }
    }

    private static void Save()
    {
        try
        {
            string dir = System.IO.Path.GetDirectoryName(Path);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir)) Directory.CreateDirectory(dir);
            File.WriteAllText(Path, JsonUtility.ToJson(Current), new System.Text.UTF8Encoding(false));
        }
        catch (Exception e)
        {
            Debug.LogWarning("元进程存档写不了: " + e.Message);
        }
    }

    /// <summary>测试或换档用:丢掉内存里的副本,下次重新读。</summary>
    public static void ResetCache()
    {
        _data = null;
        _unlockedGenes = null;
    }
}
