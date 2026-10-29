using System;
using Cysharp.Threading.Tasks;
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

    /// <summary>开新局:不带盲注(下一步是选关),难度取主界面选的那一档;旧局的档在开局时删掉,主界面在选关屏开出来后关掉。</summary>
    public static void StartNew(RunDifficulty difficulty)
    {
        RunState run = RunState.NewRun(SeedText.FromEntropy(NewEntropy()), MinimalContent.Config, difficulty);
        RunSaveService.Instance.StartNew(run);
        ShowMap(run);
        CloseAfterOpen(typeof(UIMapPanel), typeof(UIMainMenuPanel));
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
        AudioConfigMgr.SwitchMusic(AudioIds.MusicBoard);
        GameModule.UI.ShowUIAsync<UIMapPanel>(run);
        CloseAfterOpen(typeof(UIMapPanel), typeof(UIBattlePanel), typeof(UIBattleResultPanel), typeof(UIShopPanel));
    }

    /// <summary>进节点并开打:开盲注的事件不演,战斗窗打开时按状态全量刷新。</summary>
    public static void EnterNode(RunState run, int nodeId)
    {
        if (!run.EnterNode(nodeId)) return;
        run.StartBlindForCurrentNode();
        RunSaveService.Instance.CommitRun(run, "进节点");
        ShowBattle(run, false);
        CloseAfterOpen(typeof(UIBattlePanel), typeof(UIMapPanel));
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
    /// 结果浮层的出口:赢了先结算再进商店(跳过的节点不开店),整局打完回主界面;输了整局结束。
    /// </summary>
    public static void AfterResult(RunState run, bool won)
    {
        GameModule.UI.CloseUI<UIBattleResultPanel>();
        if (!won)
        {
            GameModule.UI.CloseUI<UIBattlePanel>();
            RunSaveService.Instance.Leave();
            return;
        }
        if (run.Progress.IsComplete(run.Map))
        {
            GameModule.UI.CloseUI<UIBattlePanel>();
            RunSaveService.Instance.EndRun();
            return;
        }
        ShowShop(run);
    }

    /// <summary>结算后开店;已经开着就沿用(界面来回切不重掷)。跳过的节点不进商店,直接回地图。</summary>
    public static void ShowShop(RunState run)
    {
        if (run.Progress.CurrentSkipped || run.Progress.IsComplete(run.Map))
        {
            ShowMap(run);
            return;
        }
        run.OpenShop();
        RunSaveService.Instance.CommitRun(run, "开店");
        GameModule.UI.ShowUIAsync<UIShopPanel>(run);
        CloseAfterOpen(typeof(UIShopPanel), typeof(UIBattlePanel), typeof(UIBattleResultPanel), typeof(UIMapPanel));
    }

    /// <summary>离开商店:关店,回地图。</summary>
    public static void LeaveShop(RunState run)
    {
        run.CloseShop();
        RunSaveService.Instance.CommitRun(run, "离店");
        ShowMap(run);
    }

    /// <summary>回主界面(不结束这一局,档留着)。</summary>
    public static void BackToMenu()
    {
        RunSaveService.Instance.Leave();
        GameModule.UI.ShowUIAsync<UIMainMenuPanel>();
        CloseAfterOpen(typeof(UIMainMenuPanel), typeof(UIBattlePanel), typeof(UIBattleResultPanel), typeof(UIMapPanel), typeof(UIShopPanel));
    }

    private static void ShowBattle(RunState run, bool resumed) =>
        GameModule.UI.ShowUIAsync<UIBattlePanel>(new UIBattlePanel.Entry(run, resumed));

    /// <summary>
    /// 新窗开出来之后再关旧窗:同一帧里关窗会释放资源句柄,把正要加载的那张 prefab 的异步操作卡死(实测窗再也不出现)。
    /// 所以换屏一律「先开、等它开出来、再关别的」。
    /// </summary>
    private static void CloseAfterOpen(Type opened, params Type[] others)
    {
        CloseAfterOpenAsync(opened, others).Forget();
    }

    private static async UniTaskVoid CloseAfterOpenAsync(Type opened, Type[] others)
    {
        await GameModule.UI.WaitOpenedAsync(opened);
        foreach (Type type in others)
        {
            if (type != opened) GameModule.UI.CloseUI(type);
        }
    }

    /// <summary>种子的熵。规则核心不碰非确定来源,熵在这里取。</summary>
    private static ulong NewEntropy() => BitConverter.ToUInt64(Guid.NewGuid().ToByteArray(), 0);
}
