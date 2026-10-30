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
    /// 池子按稀有度比例切三批(90 / 120 / 150),同档按号取前几张:设计稿只给了张数,不给名单;
    /// 按比例切能保证每批都有普通、罕见与稀有,不会出现「前两批一张稀有都没有」。
    /// </summary>
    private static List<int> BuildPool(int count)
    {
        var byRarity = new List<int>[4];
        for (int r = 0; r < byRarity.Length; r++) byRarity[r] = new List<int>();
        foreach (CatalogEntry e in MinimalContent.Catalog.Genes)
        {
            if (e.Rarity >= 0 && e.Rarity < byRarity.Length) byRarity[e.Rarity].Add(e.Id);
        }
        foreach (List<int> list in byRarity) list.Sort();
        int total = 0;
        foreach (List<int> list in byRarity) total += list.Count;
        int[] take = new int[byRarity.Length];
        int assigned = 0;
        for (int r = 0; r < take.Length; r++)
        {
            take[r] = total == 0 ? 0 : byRarity[r].Count * count / total;
            assigned += take[r];
        }
        // 余数按「比例的小数部分」从大到小补,平局按稀有度从低到高
        while (assigned < count && assigned < total)
        {
            int best = -1;
            long bestRemainder = -1;
            for (int r = 0; r < take.Length; r++)
            {
                if (take[r] >= byRarity[r].Count) continue;
                long remainder = (long)byRarity[r].Count * count - (long)take[r] * total;
                if (remainder > bestRemainder)
                {
                    bestRemainder = remainder;
                    best = r;
                }
            }
            if (best < 0) break;
            take[best]++;
            assigned++;
        }
        var ids = new List<int>(count);
        for (int r = 0; r < take.Length; r++)
        {
            for (int i = 0; i < take[r] && i < byRarity[r].Count; i++) ids.Add(byRarity[r][i]);
        }
        ids.Sort();
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
