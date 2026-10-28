using System;
using GameRules;

/// <summary>
/// 开新局:11 号票的默认参数(<see cref="PlaceholderTuning"/>)加一个新种子,开第一个盲注。主界面「开始游戏」走这里;
/// 23 号票的存档点(开新局先删档、再写第一份)也插在这里。
/// </summary>
public static class RunLauncher
{
    public static RunState NewRun()
    {
        var run = RunState.NewRun(SeedText.FromEntropy(NewEntropy()), PlaceholderTuning.Config);
        // 开盲注的事件(发第一组)交给演出层(30 号票);本票画面直接按状态全量刷新
        run.StartBlind(PlaceholderTuning.FirstBlind);
        return run;
    }

    /// <summary>种子的熵。规则核心不碰非确定来源,熵在这里取(<see cref="SeedText.FromEntropy"/>)。</summary>
    private static ulong NewEntropy() => BitConverter.ToUInt64(Guid.NewGuid().ToByteArray(), 0);
}
