using System;
using UnityEngine;

/// <summary>
/// z 轴转角缓动：把一个 RectTransform 绕自身 pivot 转到目标角，到时精确落位后转空闲（不自毁，留给同节点下一次复用）。
/// 纯表现层，自驱 Update，用于候选方块「点一下转 90°」的视觉过程。
///
/// <b>连点会累加而不是重来</b>：播放中再调 <see cref="PlayStep"/>，目标角再叠一档、起点取当前角，
/// 时长按剩余角度等比折算——每 90° 恒为 <see cref="StepDur"/>，连点几下角速度都一样，中途不回跳。
///
/// <b><see cref="SnapToTarget"/> 不触发完成回调</b>：它是给「转到一半被拖起」用的，
/// 那一刻只需要角度立刻到位，而回调那侧要做的重建会销毁正在处理拖拽事件的节点。
///
/// <paramref name="uprightTargets"/> 指定「转动中要保持正立」的子节点：本组件每帧给它们补上反向角，
/// 使其世界朝向不变。收集物图标属此类——它是语义符号，跟着方块歪会降低辨识度。
/// </summary>
public sealed class RotateFx : MonoBehaviour
{
    /// <summary>转满 90° 的时长。与工程既有起手类特效同档（ScalePunch / WindowPopIn 的 0.12）。</summary>
    private const float StepDur = 0.12f;

    /// <summary>一档转角。负值 = 屏幕顺时针，与逻辑侧 rot+1 同向。</summary>
    private const float StepAngle = -90f;

    private RectTransform _rt;
    private RectTransform[] _uprightTargets;
    private Action _onDone;

    private float _fromAngle;
    private float _toAngle;
    private float _dur;
    private float _t;
    private bool _playing;

    private void Awake() { _rt = (RectTransform)transform; }

    /// <summary>当前 z 角（度）。空闲时即静止角。</summary>
    internal float CurrentAngle => _rt != null ? _rt.localEulerAngles.z : 0f;

    /// <summary>
    /// 再转一档。播放中调用则叠加目标角、从当前角继续转。
    /// <paramref name="onDone"/> 只在自然转到位时触发一次（每次调用都会覆盖为最新的那个）。
    /// </summary>
    public void PlayStep(RectTransform[] uprightTargets, Action onDone)
    {
        if (_rt == null) _rt = (RectTransform)transform;
        _uprightTargets = uprightTargets;
        _onDone = onDone;

        // 起点取「当前实际角」而非上一段的目标角:中途插入时才不会跳回去重转。
        _fromAngle = _playing ? Mathf.LerpUnclamped(_fromAngle, _toAngle, Ease(_t / _dur)) : NormalizedZ();
        _toAngle = (_playing ? _toAngle : NormalizedZ()) + StepAngle;
        // 时长按剩余角度等比:每 90° 恒为 StepDur,连点时角速度不变。
        float span = Mathf.Abs(_toAngle - _fromAngle);
        _dur = Mathf.Max(0.0001f, StepDur * span / Mathf.Abs(StepAngle));
        _t = 0f;
        _playing = true;
    }

    /// <summary>
    /// 立即把角度推到目标并转空闲，<b>不触发完成回调</b>。
    /// 用于转到一半被拖起：那一刻「旧布局 + 转满一档」恰好就是新朝向的外观，直接定在这里跟手即可。
    /// </summary>
    public void SnapToTarget()
    {
        if (!_playing) return;
        _playing = false;
        _onDone = null;
        Apply(_toAngle);
    }

    private void Update()
    {
        if (!_playing) return;
        _t += Time.deltaTime;
        if (_t < _dur)
        {
            Apply(Mathf.LerpUnclamped(_fromAngle, _toAngle, Ease(_t / _dur)));
            return;
        }

        _playing = false;
        Apply(_toAngle);
        var done = _onDone;
        _onDone = null;
        // 回调放最后:它那侧通常会重建本节点,回调之后不得再碰任何字段。
        done?.Invoke();
    }

    private static float Ease(float x) => VFXEase.OutCubic(Mathf.Clamp01(x));

    private void Apply(float angle)
    {
        _rt.localRotation = Quaternion.Euler(0f, 0f, angle);
        if (_uprightTargets == null) return;
        var upright = Quaternion.Euler(0f, 0f, -angle);
        for (int i = 0; i < _uprightTargets.Length; i++)
        {
            var t = _uprightTargets[i];
            if (t != null) t.localRotation = upright;
        }
    }

    /// <summary>把 localEulerAngles.z 归一到 (-180, 180]，避免 350° 与 -10° 之间来回插值转一大圈。</summary>
    private float NormalizedZ()
    {
        float z = _rt.localEulerAngles.z % 360f;
        if (z > 180f) z -= 360f;
        return z;
    }
}
