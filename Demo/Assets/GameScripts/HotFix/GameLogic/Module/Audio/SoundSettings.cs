using TEngine;

/// <summary>
/// 声音开关(33 号票第 6 节):一个总开关,同时管音乐、音效、界面音效与语音。
/// 存进 PlayerPrefs 的三个 Muted 键(<c>ProcedureLaunch</c> 启动时按同一套键还原),并立即推给音频模块。
/// </summary>
public static class SoundSettings
{
    /// <summary>声音现在是不是开着(任一 Muted 为真即视为关)。</summary>
    public static bool IsOn
    {
        get
        {
            return !Utility.PlayerPrefs.GetBool(Constant.Setting.SoundMuted, false)
                && !Utility.PlayerPrefs.GetBool(Constant.Setting.MusicMuted, false);
        }
    }

    /// <summary>开或关全部声音通道并存下来;音乐跟着开关同步起停。</summary>
    public static void SetAll(bool on)
    {
        Utility.PlayerPrefs.SetBool(Constant.Setting.SoundMuted, !on);
        Utility.PlayerPrefs.SetBool(Constant.Setting.MusicMuted, !on);
        Utility.PlayerPrefs.SetBool(Constant.Setting.UISoundMuted, !on);

        IAudioModule audio = GameModule.Audio;
        if (audio != null)
        {
            audio.SoundEnable = on;
            audio.MusicEnable = on;
            audio.UISoundEnable = on;
            audio.VoiceEnable = on;
        }
        AudioConfigMgr.SyncMusic(on);
    }

    /// <summary>翻转并返回新的状态。</summary>
    public static bool Toggle()
    {
        bool on = !IsOn;
        SetAll(on);
        return on;
    }
}
