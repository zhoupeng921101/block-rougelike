using GameRules;

/// <summary>
/// 战斗里的音效挂点(33 号票第 5 节):把手势、演出时间表、结局这些时刻翻译成音频号。
/// 只做「什么时候响、响哪一条、升多少调」;播放与冷却在 <see cref="AudioConfigMgr"/>。
/// </summary>
public static class BattleAudio
{
    /// <summary>逐拍音最多升到这么高的音高(1 = 原调),再多就不是「升调」而是尖叫了。</summary>
    public const float MaxBeatPitch = 1.6f;

    /// <summary>每拍升多少。</summary>
    public const float BeatPitchStep = 0.04f;

    public static void Pickup() => AudioConfigMgr.Play(AudioIds.BlockTouch);

    public static void Return() => AudioConfigMgr.Play(AudioIds.BlockReturn);

    public static void Rotate() => AudioConfigMgr.Play(AudioIds.BlockRotate);

    public static void Place() => AudioConfigMgr.Play(AudioIds.BlockPut);

    public static void Discard() => AudioConfigMgr.Play(AudioIds.MoveToStash);

    public static void GroupDealt() => AudioConfigMgr.Play(AudioIds.CardFly);

    /// <summary>飞分起飞与落地。</summary>
    public static void FlyStart() => AudioConfigMgr.Play(AudioIds.CardFly);

    public static void FlyLand() => AudioConfigMgr.Play(AudioIds.ProgressCrush);

    /// <summary>第 <paramref name="index"/> 拍(1 起)的逐拍音:同一条短音逐拍升调、逐拍轻一点。</summary>
    public static void Beat(int index, float delaySeconds)
    {
        float pitch = 1f + BeatPitchStep * (index - 1);
        if (pitch > MaxBeatPitch) pitch = MaxBeatPitch;
        float volume = 1f - 0.04f * (index - 1);
        if (volume < 0.4f) volume = 0.4f;
        AudioConfigMgr.PlayDelayed(AudioConfigMgr.LineStreak(index), delaySeconds, pitch, volume);
    }

    /// <summary>消行冲击与评价语音:跟评价字同时(合成那一刻)。</summary>
    public static void ClearResult(ClearType type, float delaySeconds)
    {
        int tier = ClearFxTiers.TierOf(type);
        if (tier > 0) AudioConfigMgr.PlayDelayed(AudioConfigMgr.LineImpact(tier), delaySeconds);
        if (type == ClearType.AllClear) AudioConfigMgr.PlayDelayed(AudioIds.AllClear, delaySeconds);
        switch (tier)
        {
            case ClearFxTiers.Good:
                AudioConfigMgr.PlayDelayed(AudioIds.VoiceGood, delaySeconds);
                break;
            case ClearFxTiers.Great:
                AudioConfigMgr.PlayDelayed(AudioIds.VoiceGreat, delaySeconds);
                break;
            case ClearFxTiers.Excellent:
                AudioConfigMgr.PlayDelayed(AudioIds.VoiceExcellent, delaySeconds);
                break;
            case ClearFxTiers.Unbelievable:
                AudioConfigMgr.PlayDelayed(AudioIds.VoiceUnbelievable, delaySeconds);
                break;
        }
    }

    /// <summary>结局:输了先响一声「放不下」,再和结果浮层同时响胜或负。</summary>
    public static void Result(BlindOutcome outcome, FailReason reason)
    {
        if (outcome == BlindOutcome.Won)
        {
            AudioConfigMgr.Play(AudioIds.LevelVictory);
            return;
        }
        if (reason == FailReason.CannotPlace) AudioConfigMgr.Play(AudioIds.NoWayPut);
        AudioConfigMgr.Play(AudioIds.ComboFail);
    }
}
