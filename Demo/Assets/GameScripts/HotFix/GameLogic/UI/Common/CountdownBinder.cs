using System;
using TEngine;

/// <summary>
/// 单条倒计时的绑定器:一个文本控件 + 一个「现在还剩多少毫秒」的求值委托,按秒驱动、按整秒去重、到点只收一次尾。
/// 宿主只给求值委托与文案拼法,不再各自写起表 / 停表 / 秒级去重 / 到点只做一次这四段。
/// </summary>
/// <remarks>
/// <b>求值口径只有一种</b>:每一拍现算(委托里按「绝对结束时刻 − 服务端权威当前时刻」求),
/// 不按「某一刻的剩余量 + 本地时钟递减」推。后者要求「剩余量」与「取得它的时刻」成对更新,
/// 任何一次只重设剩余量、没重设锚点的刷新,都会把已经过去的时间算回给玩家。
/// <para>
/// 驱动走 <c>GameModule.Timer</c> 的 1 秒循环:窗隐藏时框架照样驱动,故 <see cref="Stop"/> 须与宿主销毁成对,
/// 不停表的症状是关窗后秒表还在跑、回调写进一个已销毁的控件。
/// </para>
/// </remarks>
public sealed class CountdownBinder
{
    private const float TickSeconds = 1f;

    private readonly Action<string> _write;
    private readonly Func<long> _remainMs;
    private readonly Func<long, string> _format;
    private readonly Action _onExpired;

    private int _timerId = -1;

    /// <summary>上一次写进控件的整秒值;-1 = 尚未写过。同一秒不重写控件。</summary>
    private long _shownSec = -1L;

    /// <summary>到点已收过尾:<see cref="_onExpired"/> 只回调一次(秒表每秒来一趟)。</summary>
    private bool _expired;

    /// <param name="write">写文本的去处(宿主给;一条倒计时要同时写多个控件时在这里一并写)。</param>
    /// <param name="remainMs">求值委托:返回此刻剩余毫秒(≤0 视为已到点)。每一拍现算,不缓存。</param>
    /// <param name="format">剩余毫秒 → 显示文本(含前缀);到点时不调它,由 <paramref name="expiredText"/> 接。</param>
    /// <param name="expiredText">到点显示的文本;null = 到点不改文本(由 <paramref name="onExpired"/> 自行处置)。</param>
    /// <param name="onExpired">到点回调(只调一次):关窗、提示、收起整块等收尾归宿主。</param>
    public CountdownBinder(Action<string> write, Func<long> remainMs, Func<long, string> format,
        string expiredText = null, Action onExpired = null)
    {
        _write = write ?? throw new ArgumentNullException(nameof(write));
        _remainMs = remainMs ?? throw new ArgumentNullException(nameof(remainMs));
        _format = format ?? throw new ArgumentNullException(nameof(format));
        ExpiredText = expiredText;
        _onExpired = onExpired;
    }

    /// <summary>到点显示的文本(构造时给;null = 到点不改文本)。</summary>
    public string ExpiredText { get; }

    /// <summary>是否已到点(到点后秒表已停)。</summary>
    public bool IsExpired => _expired;

    /// <summary>
    /// 起表:先立即画一次(开窗那一帧就有数,不等第一拍),已到点则就地收尾、不起表。
    /// 重复调用先停旧表,不叠秒表。
    /// </summary>
    public void Start()
    {
        Stop();
        _shownSec = -1L;
        _expired = false;
        if (Draw()) return;   // 起表前就已到点:收过尾即不必再起
        _timerId = GameModule.Timer.AddTimer(OnTick, TickSeconds, true);
    }

    /// <summary>停表(宿主销毁 / 关窗须调,与 <see cref="Start"/> 成对)。未起表时是空操作。</summary>
    public void Stop()
    {
        if (_timerId < 0) return;
        GameModule.Timer.RemoveTimer(_timerId);
        _timerId = -1;
    }

    private void OnTick(object[] args) => Draw();

    /// <summary>画一拍。返回是否已到点(到点即停表并回调一次)。</summary>
    private bool Draw()
    {
        long remain = _remainMs();
        if (remain > 0L)
        {
            long sec = remain / 1000L;
            if (sec != _shownSec)
            {
                _shownSec = sec;
                _write(_format(remain));
            }
            return false;
        }

        Stop();
        if (_expired) return true;
        _expired = true;
        if (ExpiredText != null) _write(ExpiredText);
        _onExpired?.Invoke();
        return true;
    }
}
