using System;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 窗口入场动画的公共契约。挂在窗根 prefab 上,由 <see cref="UIPanelMono.InternalPlayOpenAnim"/> 在窗口
/// 打开时 <c>GetComponent</c> 取到并调 <see cref="Play"/>——挂哪个子类就播哪种形态,故形态既不需要枚举
/// 也不需要开关,「挂了没有」本身就是开关。
///
/// **opt-in**:没挂的窗 <c>GetComponent</c> 返回 null,什么都不发生。新窗默认无入场动画。
/// **覆盖层默认**:prefab 上的挂载是显式声明,优先级高于层默认——弹窗层挂了本组件就播它,
/// 不再回落到 <see cref="WindowPopIn"/>。故本组件对所有层生效,不限 <see cref="UILayer.UI"/>。
/// **退场镜像入场**:挂了本组件的窗关窗时由 <see cref="UIPanelMono.InternalPlayExitAnim"/> 调 <see cref="PlayExit"/>;
/// 没挂的窗按层默认(弹窗层播通用退场,其余层瞬间关闭)。
/// </summary>
public abstract class UIWindowOpenAnim : MonoBehaviour
{
    /// <summary>
    /// 从头播一次。窗每次打开都会被调——含已开窗被重复 ShowUIAsync 复用置顶的那次,
    /// 故实现必须支持重入(重置计时与起点,而非叠加)。
    /// </summary>
    public abstract void Play();

    /// <summary>
    /// 立即收尾到终态:停掉入场、把它改写的量归位。没在播则什么都不做。
    /// 给「入场没播完窗就自己开始往外飞东西」的业务窗用(经 <see cref="UIPanelMono.FinishOpenAnim"/> 调),
    /// 只在入场阶段调;退场有 <see cref="PlayExit"/> 自己接管入场中途的量。
    /// </summary>
    public abstract void Finish();

    /// <summary>
    /// 播退场。此时窗已逻辑关闭(出栈、销毁回调已跑),只剩视觉外壳;播完调 <paramref name="onDone"/> 一次,
    /// 由关窗方销毁外壳。入场还没播完时,实现须先停掉入场、把它改写的量交给退场。
    /// 默认 = 通用弹窗退场(<see cref="WindowPopOut"/>),形态不同的子类覆写。
    /// </summary>
    /// <param name="mask">全屏遮罩的图形,null 表示本窗没有遮罩。</param>
    /// <param name="onDone">播完回调。</param>
    /// <returns>整段时长(秒)。关窗方据此定输入锁的截止时间与外壳的兜底收尾时刻。</returns>
    public virtual float PlayExit(Graphic mask, Action onDone)
    {
        WindowPopIn.Finish(gameObject);
        WindowPopOut.Play(gameObject, mask, onDone);
        return WindowPopOut.Duration;
    }
}
