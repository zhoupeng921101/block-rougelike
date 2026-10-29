using System;
using System.Collections;
using System.Collections.Generic;
using TEngine;
using UnityEngine;
using AudioType = TEngine.AudioType;

/// <summary>音频的粗分类,决定落在哪条通道池(音乐 / 游戏音效 / 界面音效 / 语音)。</summary>
public enum EAudioType
{
    InGame = 0,
    BGM = 1,
    GlobalUI = 2,
    Voice = 3,
}

/// <summary>淡入淡出模式;时长统一取 <see cref="AudioConfigMgr.DefaultFadeSeconds"/>。</summary>
public enum EAudioFade
{
    None = 0,
    In = 1,
    Out = 2,
    Both = 3,
}

/// <summary>音频号。全部是新编号,与 block-client 的 Luban 表无关(33 号票:占位表)。</summary>
public static class AudioIds
{
    public const int None = 0;

    // 音乐
    public const int MusicMain = 1;
    public const int MusicBoard = 2;

    // 手势与落子
    public const int BlockTouch = 10;
    public const int BlockReturn = 11;
    public const int BlockRotate = 12;
    public const int BlockPut = 13;

    /// <summary>逐拍音:1..10(<see cref="LineStreakFirst"/> + n)。</summary>
    public const int LineStreakFirst = 20;
    public const int LineStreakLast = 29;

    /// <summary>消行冲击:1..3(<see cref="LineImpactFirst"/> + n)。</summary>
    public const int LineImpactFirst = 30;
    public const int LineImpactLast = 32;

    // 评价语音
    public const int VoiceGood = 40;
    public const int VoiceGreat = 41;
    public const int VoiceExcellent = 42;
    public const int VoiceUnbelievable = 43;

    // 盘面与演出
    public const int AllClear = 50;
    public const int NoWayPut = 51;
    public const int CardFly = 52;
    public const int ProgressCrush = 53;
    public const int MoveToStash = 54;

    // 结局
    public const int LevelVictory = 60;
    public const int ComboFail = 61;

    // 界面
    public const int ButtonClick = 70;
    public const int WindowPop = 71;
}

/// <summary>
/// 音频配置与播放口(33 号票):配置是代码常量表(阶段 5 不接 Luban),骑在 TEngine 的 <see cref="IAudioModule"/> 上。
/// Type 决定通道池,Volume/Loop 透传,Cooldown 防连点(逐条 >0 优先,否则全局默认 0.05 秒),
/// Fade 复用框架的淡出、淡入用音量斜坡;音高给逐拍音用。
/// </summary>
public static class AudioConfigMgr
{
    /// <summary>淡入淡出默认时长(秒)。</summary>
    public const float DefaultFadeSeconds = 0.6f;

    /// <summary>全局默认防连点冷却(秒);表里的 0 表示用这个值。</summary>
    public const float DefaultCooldown = 0.05f;

    private readonly struct AudioRow
    {
        public readonly EAudioType Type;
        public readonly string ResourcePath;
        public readonly float Volume;
        public readonly bool Loop;
        public readonly float Cooldown;
        public readonly EAudioFade Fade;

        public AudioRow(EAudioType type, string resourcePath, float volume = 1f, bool loop = false, float cooldown = 0f,
            EAudioFade fade = EAudioFade.None)
        {
            Type = type;
            ResourcePath = resourcePath;
            Volume = volume;
            Loop = loop;
            Cooldown = cooldown;
            Fade = fade;
        }
    }

    // 占位配置:音量按参考作品听感先给常数,阶段 6 定标;文件名就是 YooAsset 的地址。
    private static readonly Dictionary<int, AudioRow> Rows = new Dictionary<int, AudioRow>
    {
        { AudioIds.MusicMain, new AudioRow(EAudioType.BGM, "music_main", 0.5f, true, 0f, EAudioFade.In) },
        { AudioIds.MusicBoard, new AudioRow(EAudioType.BGM, "music_board", 0.5f, true, 0f, EAudioFade.In) },

        { AudioIds.BlockTouch, new AudioRow(EAudioType.InGame, "block_touch", 0.7f) },
        { AudioIds.BlockReturn, new AudioRow(EAudioType.InGame, "block_return", 0.7f) },
        { AudioIds.BlockRotate, new AudioRow(EAudioType.InGame, "block_rotate", 0.7f) },
        { AudioIds.BlockPut, new AudioRow(EAudioType.InGame, "block_put", 0.8f) },

        { AudioIds.AllClear, new AudioRow(EAudioType.InGame, "board_all_clear", 0.9f) },
        { AudioIds.NoWayPut, new AudioRow(EAudioType.InGame, "board_no_way_put", 0.9f) },
        { AudioIds.CardFly, new AudioRow(EAudioType.InGame, "card_fly", 0.7f) },
        { AudioIds.ProgressCrush, new AudioRow(EAudioType.InGame, "progress_crush", 0.8f) },
        { AudioIds.MoveToStash, new AudioRow(EAudioType.InGame, "move_to_stash", 0.7f) },

        { AudioIds.LevelVictory, new AudioRow(EAudioType.InGame, "level_victory", 0.9f) },
        { AudioIds.ComboFail, new AudioRow(EAudioType.InGame, "combo_fail", 0.9f) },

        { AudioIds.VoiceGood, new AudioRow(EAudioType.Voice, "voice_good", 0.9f) },
        { AudioIds.VoiceGreat, new AudioRow(EAudioType.Voice, "voice_great", 0.9f) },
        { AudioIds.VoiceExcellent, new AudioRow(EAudioType.Voice, "voice_excellent", 0.9f) },
        { AudioIds.VoiceUnbelievable, new AudioRow(EAudioType.Voice, "voice_unbelievable", 0.9f) },

        { AudioIds.ButtonClick, new AudioRow(EAudioType.GlobalUI, "button_click", 0.6f) },
        { AudioIds.WindowPop, new AudioRow(EAudioType.GlobalUI, "window_pop", 0.6f) },
    };

    // 逐拍音与冲击按号段展开:文件名 line_clear_streak_1..10 / line_clear_impact_1..3
    static AudioConfigMgr()
    {
        for (int i = AudioIds.LineStreakFirst; i <= AudioIds.LineStreakLast; i++)
        {
            Rows[i] = new AudioRow(EAudioType.InGame, "line_clear_streak_" + (i - AudioIds.LineStreakFirst + 1), 0.8f);
        }
        for (int i = AudioIds.LineImpactFirst; i <= AudioIds.LineImpactLast; i++)
        {
            Rows[i] = new AudioRow(EAudioType.InGame, "line_clear_impact_" + (i - AudioIds.LineImpactFirst + 1), 0.9f);
        }
    }

    private static readonly Dictionary<int, float> LastPlayTime = new Dictionary<int, float>();
    private static AudioAgent _musicAgent;
    private static int _musicId;
    private static bool _musicOn = true;
    private static int _musicSerial;
    private static bool _quitHooked;
    private static bool _quitting;

    /// <summary>某个号段里的逐拍音号(1 起,超出 1..10 时夹到两端)。</summary>
    public static int LineStreak(int index) =>
        Mathf.Clamp(AudioIds.LineStreakFirst + index - 1, AudioIds.LineStreakFirst, AudioIds.LineStreakLast);

    /// <summary>某个号段里的消行冲击号(1 起,夹到 1..3)。</summary>
    public static int LineImpact(int index) =>
        Mathf.Clamp(AudioIds.LineImpactFirst + index - 1, AudioIds.LineImpactFirst, AudioIds.LineImpactLast);

    public static bool IsKnown(int audioId) => Rows.ContainsKey(audioId);

    /// <summary>
    /// 按号播放。<paramref name="pitch"/> 给逐拍音的升调(1 = 原调),<paramref name="volumeScale"/> 给整档衰减。
    /// 冷却中、号不存在、音频被关掉都返回 null。
    /// </summary>
    public static AudioAgent Play(int audioId, float pitch = 1f, float volumeScale = 1f)
    {
        if (audioId == AudioIds.None || !Rows.TryGetValue(audioId, out AudioRow row))
        {
            if (audioId != AudioIds.None) Log.Warning("[Audio] 没有这个音频号:" + audioId);
            return null;
        }
        if (GameModule.Audio == null || !GameModule.Audio.Enable) return null;

        float cooldown = row.Cooldown > 0f ? row.Cooldown : DefaultCooldown;
        float now = Time.realtimeSinceStartup;
        if (LastPlayTime.TryGetValue(audioId, out float last) && cooldown > 0f && now - last < cooldown) return null;
        LastPlayTime[audioId] = now;

        AudioAgent agent = GameModule.Audio.Play(MapType(row.Type), row.ResourcePath, row.Loop,
            Mathf.Clamp01(row.Volume * volumeScale), bAsync: true, bInPool: true);
        if (agent == null) return null;
        agent.Pitch = pitch;
        if (HasFadeIn(row.Fade)) FadeIn(agent, Mathf.Clamp01(row.Volume * volumeScale));
        return agent;
    }

    /// <summary>隔 <paramref name="delaySeconds"/> 秒再播;冷却在真正到点时判,与特效对拍用。</summary>
    public static void PlayDelayed(int audioId, float delaySeconds, float pitch = 1f, float volumeScale = 1f)
    {
        if (delaySeconds <= 0f)
        {
            Play(audioId, pitch, volumeScale);
            return;
        }
        Utility.Unity.StartGlobalCoroutine("Audio.PlayDelayed", PlayDelayedRoutine(audioId, delaySeconds, pitch, volumeScale));
    }

    private static IEnumerator PlayDelayedRoutine(int audioId, float delaySeconds, float pitch, float volumeScale)
    {
        yield return new WaitForSecondsRealtime(delaySeconds);
        Play(audioId, pitch, volumeScale);
    }

    /// <summary>停止一个句柄;表里配了淡出就渐消。</summary>
    public static void Stop(AudioAgent agent, int audioId)
    {
        if (agent == null) return;
        bool fadeout = Rows.TryGetValue(audioId, out AudioRow row) && HasFadeOut(row.Fade);
        agent.Stop(fadeout);
    }

    /// <summary>指定当前该播的背景音乐;音乐关着时只记下,开回来再起播。同一首不重播。</summary>
    public static void SwitchMusic(int audioId)
    {
        if (!_quitHooked)
        {
            _quitHooked = true;
            Application.quitting += () => _quitting = true;
        }
        if (_quitting || _musicId == audioId) return;
        _musicId = audioId;
        if (!_musicOn) return;
        _musicAgent = PlayMusic(audioId);
    }

    /// <summary>把背景音乐同步到开关态。关掉只弃句柄(框架已把整条音乐轨停掉),开回来重新起播。</summary>
    public static void SyncMusic(bool musicOn)
    {
        _musicOn = musicOn;
        if (!musicOn)
        {
            _musicAgent = null;
            _musicSerial++;
            return;
        }
        if (_musicAgent != null || _musicId == AudioIds.None) return;
        _musicAgent = PlayMusic(_musicId);
    }

    private static AudioAgent PlayMusic(int audioId)
    {
        if (!Rows.TryGetValue(audioId, out AudioRow row)) return null;
        bool channelBusy = _musicAgent != null && !_musicAgent.IsFree;
        int serial = ++_musicSerial;
        AudioAgent agent = GameModule.Audio.Play(MapType(row.Type), row.ResourcePath, row.Loop, row.Volume, bAsync: true, bInPool: true);
        if (agent != null && !channelBusy && HasFadeIn(row.Fade))
        {
            agent.Volume = 0f;
            Utility.Unity.StartGlobalCoroutine("Audio.MusicFadeIn", MusicFadeInRoutine(agent, row.Volume, serial));
        }
        return agent;
    }

    private static IEnumerator MusicFadeInRoutine(AudioAgent agent, float target, int serial)
    {
        float t = 0f;
        while (t < DefaultFadeSeconds)
        {
            if (serial != _musicSerial || agent.IsFree) yield break;
            t += Time.unscaledDeltaTime;
            agent.Volume = Mathf.Lerp(0f, target, t / DefaultFadeSeconds);
            yield return null;
        }
        if (serial == _musicSerial && !agent.IsFree) agent.Volume = target;
    }

    private static void FadeIn(AudioAgent agent, float target)
    {
        agent.Volume = 0f;
        Utility.Unity.StartGlobalCoroutine("Audio.FadeIn", FadeInRoutine(agent, target));
    }

    private static IEnumerator FadeInRoutine(AudioAgent agent, float target)
    {
        float t = 0f;
        while (t < DefaultFadeSeconds)
        {
            if (agent == null || agent.IsFree) yield break;
            t += Time.unscaledDeltaTime;
            agent.Volume = Mathf.Lerp(0f, target, t / DefaultFadeSeconds);
            yield return null;
        }
        if (agent != null && !agent.IsFree) agent.Volume = target;
    }

    private static AudioType MapType(EAudioType type)
    {
        switch (type)
        {
            case EAudioType.BGM: return AudioType.Music;
            case EAudioType.GlobalUI: return AudioType.UISound;
            case EAudioType.Voice: return AudioType.Voice;
            default: return AudioType.Sound;
        }
    }

    private static bool HasFadeIn(EAudioFade fade) => fade == EAudioFade.In || fade == EAudioFade.Both;

    private static bool HasFadeOut(EAudioFade fade) => fade == EAudioFade.Out || fade == EAudioFade.Both;
}
