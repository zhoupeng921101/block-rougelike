using System;
using GameRules;
using TEngine;
using UnityEngine;

/// <summary>
/// 一局的窗口流转(局外循环设计稿 §2):主界面 → 地图 → 战斗 → 结果(结算)→ 商店 → 地图。
/// 规则核心管状态,这里只管「下一步开哪个窗」;存档时机统一在 <see cref="RunSaveService"/>。
/// </summary>
public static class RunFlow
{
    /// <summary>难度选择的存档键(主界面切档,开局带进 <see cref="RunState.Difficulty"/>)。</summary>
    private const string DifficultyPref = "3b.run.difficulty";

    public static RunDifficulty Difficulty
    {
        get
        {
            int value = PlayerPrefs.GetInt(DifficultyPref, (int)RunDifficulty.Standard);
            return Enum.IsDefined(typeof(RunDifficulty), value) ? (RunDifficulty)value : RunDifficulty.Standard;
        }
        set
        {
            PlayerPrefs.SetInt(DifficultyPref, (int)value);
            PlayerPrefs.Save();
        }
    }

    public static RunDifficulty NextDifficulty(RunDifficulty difficulty) => difficulty switch
    {
        RunDifficulty.Standard => RunDifficulty.Advanced,
        RunDifficulty.Advanced => RunDifficulty.Expert,
        _ => RunDifficulty.Standard,
    };

    /// <summary>开新局:不带盲注(下一步是选关),难度取主界面选的那一档;旧局的档在开局时删掉。</summary>
    public static void StartNew(RunDifficulty difficulty)
    {
        RunState run = RunState.NewRun(SeedText.FromEntropy(NewEntropy()), MinimalContent.Config, difficulty);
        RunSaveService.Instance.StartNew(run);
        ShowMap(run);
    }

    /// <summary>接着打:战斗里的局回战斗窗,选关/商店之间的局回地图。</summary>
    public static void Resume(RunState run)
    {
        RunSaveService.Instance.Resume(run);
        if (run.Blind != null) ShowBattle(run, true);
        else ShowMap(run);
    }

    public static void ShowMap(RunState run)
    {
        GameModule.UI.CloseUI<UIBattlePanel>();
        GameModule.UI.CloseUI<UIBattleResultPanel>();
        GameModule.UI.ShowUIAsync<UIMapPanel>(run);
    }

    /// <summary>进节点并开打:开盲注的事件不演,战斗窗打开时按状态全量刷新。</summary>
    public static void EnterNode(RunState run, int nodeId)
    {
        if (!run.EnterNode(nodeId)) return;
        run.StartBlindForCurrentNode();
        RunSaveService.Instance.CommitRun(run, "进节点");
        GameModule.UI.CloseUI<UIMapPanel>();
        ShowBattle(run, false);
    }

    /// <summary>打赢之后:入账、把地图推到已结算、丢掉盲注,回到两场之间的形状再存一次。返回这一场的结算,给结果浮层显示。</summary>
    public static Settlement SettleWon(RunState run)
    {
        Settlement settlement = run.SettleBlind();
        run.LeaveBlind();
        RunSaveService.Instance.CommitRun(run, "结算");
        return settlement;
    }

    /// <summary>打输了:这一局结束,删档。</summary>
    public static void LoseRun() => RunSaveService.Instance.EndRun();

    /// <summary>
    /// 结果浮层的出口:赢了先结算再回地图(商店还没接窗,先跳过),整局打完回主界面;输了整局结束。
    /// </summary>
    public static void AfterResult(RunState run, bool won)
    {
        GameModule.UI.CloseUI<UIBattleResultPanel>();
        GameModule.UI.CloseUI<UIBattlePanel>();
        if (!won)
        {
            RunSaveService.Instance.Leave();
            return;
        }
        if (run.Progress.IsComplete(run.Map))
        {
            RunSaveService.Instance.EndRun();
            return;
        }
        ShowMap(run);
    }

    /// <summary>回主界面(不结束这一局,档留着)。</summary>
    public static void BackToMenu()
    {
        RunSaveService.Instance.Leave();
        GameModule.UI.CloseUI<UIBattlePanel>();
        GameModule.UI.CloseUI<UIBattleResultPanel>();
        GameModule.UI.CloseUI<UIMapPanel>();
    }

    private static void ShowBattle(RunState run, bool resumed) =>
        GameModule.UI.ShowUIAsync<UIBattlePanel>(new UIBattlePanel.Entry(run, resumed));

    /// <summary>种子的熵。规则核心不碰非确定来源,熵在这里取。</summary>
    private static ulong NewEntropy() => BitConverter.ToUInt64(Guid.NewGuid().ToByteArray(), 0);
}
