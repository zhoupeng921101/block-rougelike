using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 把弹窗层的默认缩放弹入(<see cref="WindowPopIn"/>)变成可挂载的显式声明,供**不在弹窗层**、
/// 却要同一套入场表现的窗使用。
/// </summary>
/// <remarks>
/// 层默认动画只覆盖弹窗层(判据见 <see cref="UIPanelMono.IsPopupLayer"/>),其余层的窗
/// <c>GetComponent&lt;UIWindowOpenAnim&gt;</c> 返回 null 时就没有入场动画。落在别的层却仍是弹框形态的窗
/// 挂本组件即可拿回该表现(开窗音效随之恢复,判据见 <see cref="UIPanelMono.OpenSfxId"/>)。挂它的都是落
/// <see cref="UILayer.Tips"/> 的弹框(那一层不入栈,弹框与下层窗叠加显示),如 <c>UICommonConfirmPanel</c>。
/// 缩放的是窗根、轴心在屏幕中心,只适合居中的弹框;贴着锚点弹出的气泡用 <see cref="TipBubblePopIn"/>。
/// <para>
/// 弹窗层的窗**不必**挂它——该层本就有层默认,挂了只是把同一个效果换条路走。
/// </para>
/// </remarks>
public sealed class WindowPopInAnim : UIWindowOpenAnim
{
    [Tooltip("全屏遮罩的 Graphic(通常是 m_btn_Mask 上的 Image)。缩放窗根会连遮罩一起缩、四周露出下层," +
             "故 WindowPopIn 要逐帧反向补偿它。留空则只缩放、不淡入遮罩,也不做补偿")]
    [SerializeField] private Graphic _mask;

    public override void Play()
    {
        WindowPopIn.Play(gameObject, _mask);
    }

    public override void Finish()
    {
        WindowPopIn.Finish(gameObject);
    }
}
