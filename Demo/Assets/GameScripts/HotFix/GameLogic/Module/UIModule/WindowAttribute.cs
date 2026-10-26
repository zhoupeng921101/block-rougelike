using System;

/// <summary>
/// UI层级枚举。枚举值即渲染顺序（Depth = 层值 * <see cref="UIModule.LAYER_DEEP"/>），值大者压在值小者之上。
/// </summary>
public enum UILayer : int
{
    /// <summary>底层：主玩法、主菜单。</summary>
    Bottom = 0,

    /// <summary>功能页：由入口进入、铺满屏的界面。</summary>
    UI = 1,

    /// <summary>常驻覆盖层：跨界面常显的 HUD。</summary>
    Top = 2,

    /// <summary>
    /// 弹窗层（栈层，见 <see cref="UIModule.IsStackedLayer"/>）：同层可共存多个窗，只有最上面那个可见，
    /// 关掉它自动露出下面一个。父子弹窗、多级弹窗链落本层，不必为「能同时在场」另找层；
    /// 唯一例外是下层窗被藏掉玩家就看不懂的弹框，落 <see cref="Tips"/>。
    /// <para>
    /// 落本层的窗必须含全屏遮罩节点 <c>m_btn_Mask</c>，点遮罩即关窗：绑定由 UI 生成器产出、
    /// 关闭行为在 <see cref="UIPanelMono.BindMask"/>，缺节点在窗创建时报错。
    /// 个别窗要禁掉点遮罩关闭（如必须二选一的确认框），覆写 <see cref="UIPanelMono.DismissOnMask"/>，
    /// 不是不放遮罩节点。
    /// </para>
    /// </summary>
    Window = 3,

    /// <summary>
    /// 提示层：Toast、飘字。压在弹窗之上，使弹窗内操作的反馈可见。不入栈，可与弹窗同时看见。
    /// <para>
    /// 弹框也可落本层，判据是「下层窗被藏掉，玩家还看不看得懂它在说什么」：文案或操作指向下层窗里具体某一档、
    /// 某一行的弹框（确认框、买票窗）看不懂，落本层与下层窗叠加显示。落本层即失去弹窗层的层默认
    /// （缩放弹入与开窗音效、缺遮罩报错、被动入口排队），补法见
    /// <c>.claude/references/tengine/ui-lifecycle.md</c>「弹框落提示层」。
    /// </para>
    /// </summary>
    Tips = 4,

    /// <summary>系统层：断线遮屏闸窗、登录、错误日志窗。压在一切之上。</summary>
    System = 5,
}

/// <summary>
/// UI窗口属性。
/// </summary>
[AttributeUsage(AttributeTargets.Class)]
public class WindowAttribute : Attribute    // 用于标记UI窗口,最好完整支持是做成配置表，可以支持货币栏位配置，UI跳转配置等等~
{
    /// <summary>
    /// 窗口层级
    /// </summary>
    public readonly int WindowLayer;

    /// <summary>
    /// 资源定位地址。
    /// </summary>
    public readonly string Location;

    /// <summary>
    /// 全屏窗口标记。
    /// </summary>
    public readonly bool FullScreen;

    /// <summary>
    /// 是内部资源无需AB加载。
    /// </summary>
    public readonly bool FromResources;

    public WindowAttribute(UILayer windowLayer, string location = "", bool fullScreen = false)
    {
        WindowLayer = (int)windowLayer;
        Location = location;
        FullScreen = fullScreen;
    }

    public WindowAttribute(UILayer windowLayer, bool fromResources, bool fullScreen = false)
    {
        WindowLayer = (int)windowLayer;
        FromResources = fromResources;
        FullScreen = fullScreen;
    }
}