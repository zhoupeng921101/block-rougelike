using UnityEngine;

/// <summary>
/// 主界面。阶段 1 只验证启动链路走得到这里,界面元素按规则 §8.1 在局外循环阶段补齐。
/// </summary>
[Window(UILayer.Bottom, fullScreen: true)]
public partial class UIMainMenuPanel : UIPanelMono
{
    protected override void OnCreate()
    {
        m_text_Version.text = "v" + Application.version;
    }
}
